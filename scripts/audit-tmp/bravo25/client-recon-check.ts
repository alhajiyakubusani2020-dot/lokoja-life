/**
 * TEAM BRAVO PH2.5 — CLIENT RECONCILIATION CHECK (Task 5-b)
 * Run: bun scripts/audit-tmp/bravo25/client-recon-check.ts
 *
 * Boots the REAL composed store headless (the busy-guard-check shim) and
 * proves the PH2.5-ESCROW-CLIENT / PH2.5-DUES-CLIENT law end-to-end against
 * fetch stubs shaped EXACTLY like the real relay acks (live/action):
 *   • assoc-dues  — the SERVER purse paid (ack debited+balance): the pocket
 *     does NOT move, the walletnet mirror takes the ack balance
 *   • trade-offer — the SERVER purse escrowed: pocket does NOT move,
 *     mirror = post-escrow balance
 *   • trade-accept — the SERVER purse credited: pocket pays ONLY the
 *     client-held wantCash leg (no +giveCash double-pay), mirror = balance
 *   • accept REPLAY (route's replayed:true) — nothing moves twice
 *   • sync broadcast of an ALREADY-ACKED tradeId — the appliedTrades book skips
 *   • sync broadcast, recipient side, never acked — pocket pays -wantCash only
 *     (the old code applied giveCash-wantCash), finesPaid UNTOUCHED, and the
 *     ledger label is the trade's own (never the Market-Union fine label)
 *   • sync broadcast, offerer side — pocket collects +wantCash only
 *     (the old code applied wantCash-giveCash, double-burning the escrow)
 *   • court fines still book through the same loop (finesPaid + ⚖️ path)
 */
/* ------------------------- browser-global shims (pre-import) ------------------------ */
const mem = new Map<string, string>()
const g = globalThis as unknown as Record<string, unknown>
const storage = {
  getItem: (k: string) => (mem.has(k) ? (mem.get(k) as string) : null),
  setItem: (k: string, v: string) => void mem.set(k, String(v)),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => void mem.clear(),
  key: (i: number) => [...mem.keys()][i] ?? null,
  get length() { return mem.size },
}
g.window = g
g.self = g
g.localStorage = storage
g.navigator = { vibrate: () => true, onLine: true, userAgent: 'B25-headless', language: 'en', hardwareConcurrency: 8, deviceMemory: 8, maxTouchPoints: 0 }
g.location = { search: '', href: 'http://localhost/' }
g.document = { visibilityState: 'visible', addEventListener: () => {}, removeEventListener: () => {}, hidden: false }
g.addEventListener = () => {}
g.removeEventListener = () => {}
g.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} })
g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(0), 0) as unknown as number
g.cancelAnimationFrame = (id: number) => clearTimeout(id)
mem.set('lokoja-life:flags', JSON.stringify({ crowdSim: false, workerSim: false }))

let failures = 0
function check(name: string, ok: boolean, detail = ''): void {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures += 1
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* --------------------------------- import the store -------------------------------- */
const { useGameStore } = await import('../../../src/game/store/useGameStore')
const { useWalletNetStore } = await import('../../../src/game/systems/walletnet')

useGameStore.getState().startNewGame('B25_Tester', 'male', {}, 'adult')
useGameStore.setState({ account: { ...useGameStore.getState().account, linked: true, token: 'b25-token', handle: 'B25_Tester', ageBand: 'adult' } })
const cash0 = useGameStore.getState().player!.cash
const me = 'B25_Tester'
console.log(`boot: pocket ₦${cash0}, mirror=${useWalletNetStore.getState().balance}`)

/* ------------------------------ the relay stub (real ack shapes) -------------------- */
const realFetch = globalThis.fetch
let walletTruth = 9_000
let duesAck: Record<string, unknown> | null = null
let offerAck: Record<string, unknown> | null = null
let acceptAcks: Record<string, unknown>[] = []
let syncQueue: Record<string, unknown>[] = []
let calls: string[] = []
const okRes = (b: unknown) => Promise.resolve(new Response(JSON.stringify(b), { status: 200, headers: { 'Content-Type': 'application/json' } }))
g.fetch = (url: unknown, init?: { body?: string }) => {
  const u = String(url)
  const body = init?.body ? (JSON.parse(String(init.body)) as { action?: string }) : {}
  calls.push(`${u.split('?')[0]}${body.action ? `:${body.action}` : ''}`)
  if (u.includes('/api/live/sync')) return okRes(syncQueue.length > 0 ? syncQueue.shift() : { ok: true, cursor: 1, events: [], roster: [] })
  if (u.includes('/api/live/action')) {
    if (body.action === 'wallet') return okRes({ ok: true, balance: walletTruth, transferredToday: 0, recent: [] })
    if (body.action === 'assoc-dues' && duesAck) return okRes(duesAck)
    if (body.action === 'trade-offer' && offerAck) return okRes(offerAck)
    if (body.action === 'trade-accept' && acceptAcks.length > 0) return okRes(acceptAcks.shift())
  }
  return okRes({ ok: true })
}

/* 1 — DUES: the server purse pays; the pocket NEVER moves */
duesAck = { ok: true, treasury: 5000, sig: 'sig-dues-1', debited: 2500, balance: 4500 }
const dues = await useGameStore.getState().livePayDues('asc-1', 2500)
const afterDues = useGameStore.getState()
check('dues ack ok', dues.ok)
check('dues: pocket UNTOUCHED (server purse paid)', afterDues.player!.cash === cash0, `cash=${afterDues.player!.cash} (old law would removeMoney 2500)`)
check('dues: mirror takes ack balance', useWalletNetStore.getState().balance === 4500, `mirror=${useWalletNetStore.getState().balance}`)
check('dues: narrated', afterDues.notifications.some((n) => n.text.includes('dues land for the union books')))

/* 2 — OFFER: the escrow leaves the SERVER purse; the pocket owes nothing */
offerAck = { ok: true, tradeId: 'trd-1', escrowed: 3000, balance: 1500 }
const offer = await useGameStore.getState().liveOfferTrade('PADDY', 3000, 800, 'bag of garri')
check('offer ack ok', offer.ok)
check('offer: pocket UNTOUCHED (escrow is server-side)', useGameStore.getState().player!.cash === cash0, `cash=${useGameStore.getState().player!.cash}`)
check('offer: mirror = post-escrow balance', useWalletNetStore.getState().balance === 1500, `mirror=${useWalletNetStore.getState().balance}`)

/* 3 — ACCEPT: the server credited my purse; the pocket pays ONLY wantCash */
acceptAcks = [{
  ok: true, credited: 3000, balance: 4500,
  trade: { id: 'trd-1', from: 'PADDY', to: me, giveCash: 3000, wantCash: 800, terms: 'bag of garri' },
}]
const accept = await useGameStore.getState().liveAcceptTrade('trd-1')
check('accept ack ok', accept.ok)
const afterAccept = useGameStore.getState()
check('accept: pocket = cash0 - wantCash EXACTLY (no +giveCash double-pay)', afterAccept.player!.cash === cash0 - 800, `cash=${afterAccept.player!.cash} want=-800 (old law: +2200)`)
check('accept: mirror = post-credit balance', useWalletNetStore.getState().balance === 4500, `mirror=${useWalletNetStore.getState().balance}`)
check('accept: tradesDone +1', afterAccept.live?.stats.tradesDone === 1)
check('accept: the giveCash lands in the PURSE per the narrated law', afterAccept.notifications.some((n) => n.text.includes('nation purse')))

/* 4 — REPLAY accept: the honest already-sealed answer moves NOTHING */
acceptAcks = [{
  ok: true, credited: 0, replayed: true, balance: 4500,
  trade: { id: 'trd-1', from: 'PADDY', to: me, giveCash: 3000, wantCash: 800, terms: 'bag of garri' },
}]
await useGameStore.getState().liveAcceptTrade('trd-1')
const afterReplay = useGameStore.getState()
check('replay: pocket UNCHANGED (no second wantCash charge)', afterReplay.player!.cash === cash0 - 800, `cash=${afterReplay.player!.cash}`)
check('replay: tradesDone NOT double-counted', afterReplay.live?.stats.tradesDone === 1)
check('replay: mirror steady', useWalletNetStore.getState().balance === 4500)

/* 5 — SYNC: the same tradeId broadcast again → the appliedTrades book skips */
syncQueue = [{ ok: true, cursor: 2, roster: [], events: [{ seq: 2, kind: 'trade', channel: 'global', actor: 'PADDY', payload: { accepted: true, tradeId: 'trd-1', from: 'PADDY', to: me, giveCash: 3000, wantCash: 800 } }] }]
await useGameStore.getState().liveSync()
await sleep(30)
check('sync(re-acked tradeId): pocket UNCHANGED (book skip)', useGameStore.getState().player!.cash === cash0 - 800, `cash=${useGameStore.getState().player!.cash}`)

/* 6 — SYNC recipient-side, never acked: pays -wantCash only; NOT booked as a fine */
const fines0 = useGameStore.getState().live?.finesPaid ?? 0
const txCount0 = useGameStore.getState().player!.transactions.length
syncQueue = [{ ok: true, cursor: 3, roster: [], events: [{ seq: 3, kind: 'trade', channel: 'global', actor: 'OTHER', payload: { accepted: true, tradeId: 'trd-rec-2', from: 'OTHER', to: me, giveCash: 500, wantCash: 200 } }] }]
await useGameStore.getState().liveSync()
await sleep(60) // the mirror re-pull rides the wire-down → relay 'wallet' action
const afterSyncRec = useGameStore.getState()
check('sync(recipient, fresh): pocket pays -wantCash ONLY', afterSyncRec.player!.cash === cash0 - 800 - 200, `cash=${afterSyncRec.player!.cash} (old law: +300)`)
check('sync(recipient, fresh): finesPaid UNTOUCHED (no fine mislabel)', afterSyncRec.live?.finesPaid === fines0, `finesPaid=${afterSyncRec.live?.finesPaid}`)
check('sync(recipient, fresh): ledger label is the trade\u2019s own', afterSyncRec.player!.transactions.length === txCount0 + 1 && afterSyncRec.player!.transactions[0]?.label === 'paid for trade from OTHER', `label(head)=${afterSyncRec.player!.transactions[0]?.label}`)
check('sync(recipient, fresh): mirror re-pulled server truth', useWalletNetStore.getState().balance === walletTruth, `mirror=${useWalletNetStore.getState().balance}`)
check('sync(recipient, fresh): the mirror pull rode the relay wallet door', calls.some((c) => c.endsWith('action:wallet')), calls.filter((c) => c.includes('wallet')).join(','))

/* 7 — SYNC offerer-side: collects +wantCash only (the escrow was server-side) */
syncQueue = [{ ok: true, cursor: 4, roster: [], events: [{ seq: 4, kind: 'trade', channel: 'global', actor: 'BUYER', payload: { accepted: true, tradeId: 'trd-oft-1', from: me, to: 'BUYER', giveCash: 3000, wantCash: 1200 } }] }]
await useGameStore.getState().liveSync()
await sleep(60)
check('sync(offerer): pocket collects +wantCash ONLY', useGameStore.getState().player!.cash === cash0 - 800 - 200 + 1200, `cash=${useGameStore.getState().player!.cash} (old law: -1800)`)

/* 8 — COURT fine: the same loop still books it honestly */
syncQueue = [{ ok: true, cursor: 5, roster: [], events: [{ seq: 5, kind: 'court', channel: 'circle:x', actor: 'market-union-court', payload: { defaulter: me, fine: 700 } }] }]
await useGameStore.getState().liveSync()
await sleep(30)
const afterCourt = useGameStore.getState()
check('court fine: pocket -fine', afterCourt.player!.cash === cash0 - 800 - 200 + 1200 - 700, `cash=${afterCourt.player!.cash}`)
check('court fine: finesPaid +fine', afterCourt.live?.finesPaid === fines0 + 700, `finesPaid=${afterCourt.live?.finesPaid}`)
check('court fine: ⚖️ narrated', afterCourt.notifications.some((n) => n.text.includes('The court collected')))

g.fetch = realFetch
console.log(failures === 0 ? '\nALL CLIENT-RECON CHECKS PASS' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
