/**
 * F2 — dynamic validation battery (bun scripts/audit-tmp/f2/busy-guard-check.ts)
 *
 * Boots the real store headless under browser-global shims and proves:
 *   1. FIX 2 — rest/workout/study/relaxIndoors/takeFerry refuse to touch the
 *      clock or needs while isWorking/isTravelling stands, and DO run once the
 *      flag falls (the guard is the only blocker).
 *   2. FIX 4 — a POS withdrawal appends a SIGNED 'POS agent levy' chain entry
 *      and advances fortress.chainTail; the ATM path appends nothing.
 *   3. FIX 1 — loginAccount REFUSES an unsigned/corrupt cloud save (raw save
 *      never reaches the store; the row lands in the backup slot; the device
 *      continues on its own books) and ACCEPTS an honestly re-signed one.
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
  get length() {
    return mem.size
  },
}
g.window = g
g.self = g
g.localStorage = storage
g.navigator = { vibrate: () => true, onLine: true, userAgent: 'F2-headless', language: 'en', hardwareConcurrency: 8, deviceMemory: 8, maxTouchPoints: 0 }
g.location = { search: '', href: 'http://localhost/' }
g.document = { visibilityState: 'visible', addEventListener: () => {}, removeEventListener: () => {}, hidden: false }
g.addEventListener = () => {}
g.removeEventListener = () => {}
g.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} })
g.requestAnimationFrame = (cb: (t: number) => void) => setTimeout(() => cb(0), 0) as unknown as number
g.cancelAnimationFrame = (id: number) => clearTimeout(id)

// FIX 2/FIX 1 pre-seed: crowd sim off (no Worker under bun) — read before store creation
mem.set('lokoja-life:flags', JSON.stringify({ crowdSim: false, workerSim: false }))

let failures = 0
function check(name: string, ok: boolean, detail = ''): void {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failures += 1
}

/* --------------------------------- import the store -------------------------------- */
const { useGameStore } = await import('../../../src/game/store/useGameStore')
const { SaveSystem } = await import('../../../src/game/systems/save')
const { signPayload } = await import('../../../src/game/systems/fortress')
const { BACKUP_KEY } = await import('../../../src/game/systems/guest')

const s = useGameStore.getState()
s.startNewGame('F2_Tester', 'male', {}, 'adult')
const live = useGameStore.getState()
check('boot: startNewGame produced a live world', !!live.player && !!live.world)

/* ------------------------------- FIX 2 — busy guards ------------------------------- */
const worldBefore = JSON.stringify(live.world)
const needsBefore = JSON.stringify(live.player!.needs)
const cashBefore = live.player!.cash

useGameStore.setState({ isWorking: true })
s.rest('nap')
s.workout()
s.study('Lesson')
s.relaxIndoors('tv')
s.takeFerry('patti')
const during = useGameStore.getState()
check('busy-guard: rest() refused mid-shift', JSON.stringify(during.world) === worldBefore && JSON.stringify(during.player!.needs) === needsBefore, `world=${JSON.stringify(during.world)}`)
check('busy-guard: workout() refused mid-shift', JSON.stringify(during.player!.needs) === needsBefore)
check('busy-guard: study() refused mid-shift', JSON.stringify(during.player!.needs) === needsBefore)
check('busy-guard: relaxIndoors() refused mid-shift', JSON.stringify(during.world) === worldBefore)

useGameStore.setState({ isWorking: false, isTravelling: true })
s.rest('sleep')
const travelling = useGameStore.getState()
check('busy-guard: rest(sleep) refused mid-travel (day unchanged)', travelling.world!.day === 1 && JSON.stringify(travelling.world) === worldBefore, `day=${travelling.world!.day}`)
useGameStore.setState({ isTravelling: false })

// the unblocked control: the SAME action now runs — the guard was the only blocker
s.rest('nap')
const after = useGameStore.getState()
check('control: rest() runs once the flag falls', JSON.stringify(after.world) !== worldBefore, `timeOfDay=${after.world!.timeOfDay}`)
check('control: needs moved when unblocked', JSON.stringify(after.player!.needs) !== needsBefore)

/* ------------------------------- FIX 4 — POS levy chain ----------------------------- */
useGameStore.setState({ player: { ...after.player!, bankBalance: 5000 } })
const tailBefore = useGameStore.getState().fortress.chainTail
const okPos = useGameStore.getState().bankWithdraw(1000, 'pos')
const pos = useGameStore.getState()
const levy = pos.player!.transactions.find((t) => t.label === 'POS agent levy')
check('POS levy: withdrawal succeeded', okPos && pos.player!.bankBalance === 4000, `bank=${pos.player!.bankBalance}`)
check('POS levy: signed chain entry appended', !!levy && typeof levy.sig === 'string' && levy.sig.length > 0, `sig=${levy?.sig?.slice(0, 12) ?? 'NONE'}`)
check('POS levy: chainTail advanced onto the levy', pos.fortress.chainTail === levy?.sig, `tail=${pos.fortress.chainTail.slice(0, 12)}`)
check('POS levy: fee magnitude recorded (negative outflow)', !!levy && levy.amount === -pos.chaos.stats.posFees, `fee=${pos.chaos.stats.posFees}`)
check('POS levy: net landed in cash', pos.player!.cash === cashBefore + 1000 - pos.chaos.stats.posFees, `cash=${pos.player!.cash}`)

const tail2 = pos.fortress.chainTail
const okAtm = useGameStore.getState().bankWithdraw(500, 'atm')
const atm = useGameStore.getState()
check('ATM path: no levy entry, chain untouched', okAtm && !atm.player!.transactions.some((t) => t.label === 'POS agent levy' && t.sig !== levy?.sig) && atm.fortress.chainTail === tail2, `tailMoved=${atm.fortress.chainTail !== tail2}`)

/* -------------------------------- FIX 1 — the pull gate ----------------------------- */
const realFetch = globalThis.fetch
let servedSave: unknown = null
let servedSig: string | null = null
g.fetch = (url: unknown) => {
  const u = String(url)
  if (u.includes('/api/auth/login')) {
    return Promise.resolve(new Response(JSON.stringify({ ok: true, token: 'f2-token', save: servedSave, sig: servedSig, band: 'adult', profile: null }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
  }
  // pushCloud / anything else — pretend the wire accepted it
  return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))
}

// 3a. REJECT: unsigned + corrupt (hotel-QA's measured payload: cash -999999)
useGameStore.setState({ account: { ...useGameStore.getState().account, linked: false, token: null } })
servedSave = { ...(SaveSystem.load() as object), version: SaveSystem.SAVE_VERSION, player: { ...(useGameStore.getState().player as object), cash: -999999, bankBalance: 'five' }, world: { ...(useGameStore.getState().world as object), day: '5' } }
servedSig = null
const cashGuard = useGameStore.getState().player!.cash
const reject = await useGameStore.getState().loginAccount({ handle: 'F2_Tester', pin: '1234' })
const afterReject = useGameStore.getState()
check('pull gate: login still links the account', reject.ok && afterReject.account.linked)
check('pull gate: RAW SAVE NEVER APPLIED (cash untouched)', afterReject.player!.cash === cashGuard, `cash=${afterReject.player!.cash} (attack offered -999999 / day "5")`)
check('pull gate: refusal narrated', afterReject.notifications.some((n) => n.text.includes('no pass the gate')))
check('pull gate: refused row kept in the backup slot', mem.get(BACKUP_KEY) !== undefined, BACKUP_KEY)

// 3b. ACCEPT: an honestly signed current-version save rides home
useGameStore.setState({ account: { ...afterReject.account, linked: false, token: null } })
const honest = JSON.parse(JSON.stringify(SaveSystem.load())) as Record<string, unknown>
;(honest as { player: { cash: number } }).player.cash = 777
const key = SaveSystem.fortKey()
servedSig = key ? signPayload(JSON.stringify(honest), key) : ''
servedSave = honest
const accept = await useGameStore.getState().loginAccount({ handle: 'F2_Tester', pin: '1234' })
check('pull gate: honestly signed save APPLIED', accept.ok && useGameStore.getState().player!.cash === 777, `cash=${useGameStore.getState().player!.cash}`)
check('pull gate: signed merge produced no refusal toast', !useGameStore.getState().notifications.some((n) => n.text.includes('no pass the gate') && n.id > (afterReject.notifications.at(-1)?.id ?? 0)))

g.fetch = realFetch
console.log(failures === 0 ? '\nALL F2 CHECKS PASS' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
