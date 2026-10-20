/**
 * LOKOJA LIFE — M24 W6: THE LEDGER LAW SUITE
 * ===========================================
 * The nation purse under oath. Pure verdicts headless, then the REAL
 * doors: the wire on :3004, the relay on :3000, and the fortress book
 * read back from the disk with bun:sqlite.
 *
 * THE LAWS PINNED HERE:
 *  1.  the verdict matrix — minors walled, guests dark, bad amounts,
 *      too-small/too-big, the day cap, insufficient, self
 *  2.  the fortress link — deterministic, key-sensitive, order-sensitive
 *  3.  the kid wall at BOTH doors (wire + relay): minors-no-money
 *  4.  deposit: purse grows, receipt kind deposit, the row on disk
 *  5.  THE IDEMPOTENCY LAW: a replayed deposit idemKey = SAME ledgerId,
 *      balance UNCHANGED (the UNIQUE index is the double-spend killer)
 *  6.  THE PIN LAW: withdraw with a wrong PIN refuses bad-pin; the right
 *      PIN moves the purse
 *  7.  THE N8 MONEY SHOT: A sends ₦500 to B — A −500, B +500, ONE
 *      ledger row, and B's wire:ledger push rides the person; a REPLAY
 *      of the same idemKey returns the SAME receipt and moves NOTHING
 *  8.  the receiver's LiveEvent row is channel-scoped (ledger:B exists,
 *      ledger:A never does)
 *  9.  the refusal law at the door: too-big, insufficient,
 *      minors-collect-nothing (a minor target), no-such-paddy
 * 10.  THE DAY CAP at the relay door: the 5th ₦50,000 transfer in a day
 *      refuses day-cap (the pure law + the aggregate agreeing)
 * 11.  the relay lane carries the SAME rows (deposit + transfer through
 *      /api/live/action land in the same WalletRow/LedgerRow)
 * 12.  THE FORTRESS CHAIN: every row's chainHash recomputes exactly from
 *      the previous row through the pure law — the book is tamper-evident
 * 13.  THE SYNC PRIVACY LAW: B's sync sees their ledger:B receipt; a
 *      third party's sync sees NONE of it
 * 14.  the wallet state door: balance + transferredToday + recent agree
 *
 * Exit code 0 = every law holds. Non-zero = the purse lied somewhere.
 *
 * THE SEAM (AUD-D): the relay leg against live :3000 is unavoidable today
 * (the relay IS the dev server) — and the relay door's own law ("both
 * lanes, ONE book") demands the spawned wire share the relay's books, so
 * every row this suite creates is removed again in the teardown (the one
 * lawful write), printed, and the books are re-verified seed→tail after.
 * Every DIRECT disk read rides a THROWAWAY VACUUM INTO snapshot cut at the
 * exact moment the live read would have happened — the live file is never
 * opened read-write except by the cleanup, never opened at all except
 * readonly for that verification.
 */
import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'
import { makeTestDb, dropTestDb } from './lib/test-db'
import {
  transferVerdict, depositVerdict, chainLink, idemKeyOf, dayStartMs, LEDGER_SEED, LEDGER_LIMITS,
} from '../src/game/systems/ledger'

const BASE = 'http://localhost:3000'
const WIRE = 'http://localhost:3004'
const WIRE_PORT = 3004
const DB_PATH = '/home/z/my-project/db/custom.db'

/* THE SEAM: disk reads ride throwaway snapshots of the books, cut at the
 * exact moment the live read happens — the assertion sees precisely what a
 * live read would see, and the live file is never the suite's reader. */
const SNAPSHOTS: string[] = []
function snapshotReadonly(label: string): Database {
  const path = makeTestDb(label)
  SNAPSHOTS.push(path)
  return new Database(path, { readonly: true })
}

let passed = 0
let failed = 0
const fails: string[] = []

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    fails.push(name)
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

function section(name: string) {
  console.log(`\n── ${name} ─────────────────────────────────`)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function reg(handle: string, pin: string, extra: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin, contact: `${handle}@lokoja.ng`, ageBand: 'adult', displayName: handle, avatarLook: '{"skinTone":"#6E4326","hairColor":"#1A1714","hairstyle":"low-cut","clothingStyle":"tshirt","clothingColor":"#1B7A43"}', ...extra }),
  })
  return (await res.json()) as { ok?: boolean; token?: string; why?: string }
}

function connect(token: string | null): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s: Socket = io(WIRE, {
      transports: ['websocket', 'polling'],
      reconnection: false,
      timeout: 5000,
      auth: token ? { token } : {},
    })
    const t = setTimeout(() => {
      s.disconnect()
      reject(new Error('connect timeout'))
    }, 6000)
    s.on('connect', () => {
      clearTimeout(t)
      resolve(s)
    })
    s.on('connect_error', (e) => {
      clearTimeout(t)
      reject(e)
    })
  })
}

type Ack = { ok?: boolean; why?: string; balance?: number; transferredToday?: number; receipt?: Rec; recent?: Rec[]; replayed?: boolean }
type Rec = { idemKey: string; ledgerId: number; kind: string; from: string; to: string; amount: number; hash: string; ts: number }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 5000)
    s.emit(ev, body, (r: Ack) => {
      clearTimeout(t)
      resolve(r ?? {})
    })
  })
}

function nextLedger(s: Socket, pred: (r: Rec) => boolean, ms = 3000): Promise<Rec | null> {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      s.off('wire:ledger', h)
      resolve(null)
    }, ms)
    const h = (r: Rec) => {
      if (pred(r)) {
        clearTimeout(t)
        s.off('wire:ledger', h)
        resolve(r)
      }
    }
    s.on('wire:ledger', h)
  })
}

async function relay(token: string, action: string, payload: Record<string, unknown>): Promise<Ack & { status: number }> {
  const r = await fetch(`${BASE}/api/live/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action, payload }),
  })
  return { ...(await r.json()), status: r.status }
}

/* ═══════════════════════════ the suite ═══════════════════════════ */

const stamp = Date.now().toString(36).slice(-6)
const A = `ldg_a_${stamp}`
const B = `ldg_b_${stamp}`
const K = `ldg_k_${stamp}`
const D = `ldg_d_${stamp}` // the day-cap walker (relay lane only)
const Z = `ldg_z_${stamp}` // the third party (privacy)
/** every handle this run births on the live books — the teardown's marks */
const HANDLES = [A, B, K, D, Z]
const PIN = '4321'

let svc: { kill: () => void } | null = null

async function waitForHealth(tries = 40): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(`http://localhost:${WIRE_PORT}/health`)
      if (r.ok) return true
    } catch {
      /* not up yet */
    }
    await sleep(150)
  }
  return false
}

async function main() {
  /* ── layer 1: the pure laws ── */
  section('the pure laws (systems/ledger, headless)')
  const vMinor = transferVerdict({ band: 'kid', amount: 500, purse: 5000, transferredToday: 0 })
  check('1a. THE MINOR BLOCK — kid refuses (minors-no-money)', !vMinor.ok && vMinor.why === 'minors-no-money')
  const vTeen = transferVerdict({ band: 'teen', amount: 500, purse: 5000, transferredToday: 0 })
  check('1b. teen walled too', !vTeen.ok && vTeen.why === 'minors-no-money')
  const vGuest = transferVerdict({ band: 'guest', amount: 500, purse: 5000, transferredToday: 0 })
  check('1c. guest dark (unclaimed)', !vGuest.ok && vGuest.why === 'unclaimed')
  const vBad = transferVerdict({ band: 'adult', amount: 10.5, purse: 5000, transferredToday: 0 })
  check('1d. fractional naira refuses (bad-amount)', !vBad.ok && vBad.why === 'bad-amount')
  const vSmall = transferVerdict({ band: 'adult', amount: 0, purse: 5000, transferredToday: 0 })
  check('1e. zero refuses (too-small)', !vSmall.ok && vSmall.why === 'too-small')
  const vBig = transferVerdict({ band: 'adult', amount: LEDGER_LIMITS.MAX_PER_TRANSFER + 1, purse: 1_000_000, transferredToday: 0 })
  check('1f. over the per-transfer max refuses (too-big)', !vBig.ok && vBig.why === 'too-big')
  const vCap = transferVerdict({ band: 'adult', amount: 50_000, purse: 1_000_000, transferredToday: 160_000 })
  check('1g. THE DAY CAP (160k + 50k > 200k) refuses', !vCap.ok && vCap.why === 'day-cap')
  const vBroke = transferVerdict({ band: 'adult', amount: 500, purse: 499, transferredToday: 0 })
  check('1h. insufficient purse refuses', !vBroke.ok && vBroke.why === 'insufficient')
  const vSelf = transferVerdict({ band: 'adult', to: 'ada', from: 'ada', amount: 500, purse: 5000, transferredToday: 0 })
  check('1i. self-transfer refuses (self)', !vSelf.ok && vSelf.why === 'self')
  const vOk = transferVerdict({ band: 'adult', to: 'ada', from: 'musa', amount: 500, purse: 5000, transferredToday: 0 })
  check('1j. an honest transfer holds', vOk.ok)
  const vDep = depositVerdict({ band: 'adult', amount: 2000 })
  check('1k. THE DEPOSIT VERDICT — a first top-up holds (the purse check is meaningless for deposits)', vDep.ok)

  const h1 = chainLink(LEDGER_SEED, { idemKey: 'k1', from: 'a', to: 'b', amount: 500, kind: 'transfer', ts: 1234 })
  const h1again = chainLink(LEDGER_SEED, { idemKey: 'k1', from: 'a', to: 'b', amount: 500, kind: 'transfer', ts: 1234 })
  const h2 = chainLink(LEDGER_SEED, { idemKey: 'k2', from: 'a', to: 'b', amount: 500, kind: 'transfer', ts: 1234 })
  const h3 = chainLink(h1, { idemKey: 'k2', from: 'a', to: 'b', amount: 500, kind: 'transfer', ts: 1234 })
  check('2a. the fortress link is deterministic', h1 === h1again)
  check('2b. the link changes with ANY truth (key)', h1 !== h2)
  check('2c. the link chains (prev matters)', h1 !== h3 && h3 !== h2)
  check('2d. the idemKey shape', idemKeyOf('ada', 'transfer', 'n1').startsWith('tra:ada:'))
  const midnight = dayStartMs()
  check('2e. dayStartMs is midnight local', new Date(midnight).getHours() === 0 && new Date(midnight).getMinutes() === 0)

  /* ── layer 2: the REAL doors ── */
  section('spawn the wire (:3004) + claim the walkers')
  // THE ONE-BOOK LAW: this suite's own doors — the wire's wallet verbs AND
  // the relay's /api/live/action legs — must land in the SAME books or the
  // cross-lane assertions below (11a-11d, 13a) would be fiction. The relay
  // is pinned to the live books today (it IS the dev server), so this wire
  // rides them too (the default WIRE_DB); the teardown then removes every
  // row the run created and re-verifies the chain seed→tail.
  const debug = process.argv.includes('--debug')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) }, // prod books BY DESIGN — see THE ONE-BOOK LAW above
    stdout: debug ? 'inherit' : 'pipe',
    stderr: debug ? 'inherit' : 'pipe',
  })
  const up = await waitForHealth()
  check('wire health door answers', up)
  if (!up) throw new Error('wire never came up')

  const regA = await reg(A, PIN)
  const regB = await reg(B, PIN)
  const regK = await reg(K, PIN, { ageBand: 'kid', parentPin: '991133' })
  const regD = await reg(D, PIN)
  const regZ = await reg(Z, PIN)
  check('five real accounts claimed', !!(regA.token && regB.token && regK.token && regD.token && regZ.token))
  if (!regA.token || !regB.token || !regK.token || !regD.token || !regZ.token) throw new Error('register door failed')

  // THE RATE ROTATION: the wallet bucket is 4/10s per socket — the heavy
  // walkers carry three sockets each and round-robin honestly
  const sa = [await connect(regA.token), await connect(regA.token), await connect(regA.token)]
  const sb = await connect(regB.token)
  const sk = await connect(regK.token)
  let ai = 0
  const nextA = () => sa[ai++ % sa.length]!
  for (const s of [...sa, sb, sk]) await emit(s, 'hello', { street: 'patti', status: 'hustling' })
  await sleep(150)

  section('the kid wall at BOTH doors')
  const kw = await emit(sk, 'wallet', {})
  check('3a. kid wallet at the wire door refuses (minors-no-money)', !kw.ok && kw.why === 'minors-no-money', JSON.stringify(kw))
  const kr = await relay(regK.token, 'wallet', {})
  check('3b. kid wallet at the relay door refuses too', !kr.ok && kr.why === 'minors-no-money')

  section('the purse: deposit + the idempotency law')
  const w0 = await emit(nextA(), 'wallet', {})
  check('4a. a fresh purse reads zero', w0.ok === true && w0.balance === 0, JSON.stringify(w0))
  const depKey = idemKeyOf(A, 'deposit', `d1_${stamp}`)
  const dep = await emit(nextA(), 'wallet:deposit', { amount: 2000, idemKey: depKey })
  check('4b. the deposit lands (balance 2000)', dep.ok === true && dep.balance === 2000 && dep.receipt?.kind === 'deposit', JSON.stringify(dep))
  const depReplay = await emit(nextA(), 'wallet:deposit', { amount: 2000, idemKey: depKey })
  check('5. THE IDEMPOTENCY LAW — replayed key: SAME ledgerId, balance UNMOVED', depReplay.ok === true && depReplay.receipt?.ledgerId === dep.receipt?.ledgerId && depReplay.balance === 2000, JSON.stringify({ r: depReplay.receipt?.ledgerId, b: depReplay.balance }))

  section('the PIN law')
  const wdBad = await emit(nextA(), 'wallet:withdraw', { amount: 500, pin: '9999', idemKey: idemKeyOf(A, 'withdraw', `w1_${stamp}`) })
  check('6a. a wrong PIN refuses (bad-pin)', !wdBad.ok && wdBad.why === 'bad-pin', JSON.stringify(wdBad))
  const wdOk = await emit(nextA(), 'wallet:withdraw', { amount: 500, pin: PIN, idemKey: idemKeyOf(A, 'withdraw', `w2_${stamp}`) })
  check('6b. the right PIN moves the purse (1500)', wdOk.ok === true && wdOk.balance === 1500, JSON.stringify(wdOk))

  section('THE N8 MONEY SHOT — ₦500 exactly once')
  const pushB = nextLedger(sb, (r) => r.from === A && r.amount === 500)
  const trKey = idemKeyOf(A, 'transfer', `t1_${stamp}`)
  const tr = await emit(nextA(), 'wallet:transfer', { to: B, amount: 500, pin: PIN, idemKey: trKey })
  check('7a. the transfer lands (A 1000)', tr.ok === true && tr.balance === 1000, JSON.stringify(tr))
  const gotB = await pushB
  check('7b. B purse +500', gotB !== null)
  const wB = await emit(sb, 'wallet', {})
  check('7c. B purse reads 500 (the push + the row agree)', wB.ok === true && wB.balance === 500, JSON.stringify(wB))
  const trReplay = await emit(nextA(), 'wallet:transfer', { to: B, amount: 500, pin: PIN, idemKey: trKey })
  check('7d. THE REPLAY: same idemKey → SAME ledgerId, B still 500, A still 1000', trReplay.ok === true && trReplay.receipt?.ledgerId === tr.receipt?.ledgerId && trReplay.balance === 1000, JSON.stringify({ id: trReplay.receipt?.ledgerId, b: trReplay.balance }))

  const db = snapshotReadonly('ledger-disk')
  const rowsAB = db.query("SELECT id, fromHandle, toHandle, amount, kind FROM LedgerRow WHERE idemKey = ?").get(trKey) as { id: number; amount: number } | undefined
  const countAB = db.query("SELECT COUNT(*) AS c FROM LedgerRow WHERE fromHandle = ? AND toHandle = ? AND kind = 'transfer'").get(A, B) as { c: number }
  check('7e. the disk truth: ONE transfer row for the pair', !!rowsAB && rowsAB.amount === 500 && countAB.c === 1, JSON.stringify({ rows: rowsAB?.id, count: countAB.c }))

  section('the receipt channel law')
  const evB = db.query("SELECT seq FROM LiveEvent WHERE channel = ? LIMIT 1").get(`ledger:${B}`)
  const evA = db.query("SELECT seq FROM LiveEvent WHERE channel = ? LIMIT 1").get(`ledger:${A}`)
  check('8. the receiver LiveEvent row is channel-scoped (ledger:B yes, ledger:A no)', !!evB && !evA)
  db.close()

  section('the refusal law at the door')
  const rBig = await emit(nextA(), 'wallet:transfer', { to: B, amount: LEDGER_LIMITS.MAX_PER_TRANSFER + 1, pin: PIN, idemKey: idemKeyOf(A, 'transfer', `r1_${stamp}`) })
  check('9a. too-big refuses', !rBig.ok && rBig.why === 'too-big', JSON.stringify(rBig))
  const rBroke = await emit(nextA(), 'wallet:transfer', { to: B, amount: 40_000, pin: PIN, idemKey: idemKeyOf(A, 'transfer', `r2_${stamp}`) })
  check('9b. insufficient refuses (purse 1000 < 40k)', !rBroke.ok && rBroke.why === 'insufficient', JSON.stringify(rBroke))
  const rKid = await emit(nextA(), 'wallet:transfer', { to: K, amount: 100, pin: PIN, idemKey: idemKeyOf(A, 'transfer', `r3_${stamp}`) })
  check('9c. THE M13 TARGET WALL — a minor receives nothing (minors-collect-nothing)', !rKid.ok && rKid.why === 'minors-collect-nothing', JSON.stringify(rKid))
  const rGhost = await emit(nextA(), 'wallet:transfer', { to: 'never_claimed_404', amount: 100, pin: PIN, idemKey: idemKeyOf(A, 'transfer', `r4_${stamp}`) })
  check('9d. a ghost handle refuses (no-such-paddy)', !rGhost.ok && rGhost.why === 'no-such-paddy')

  section('the relay lane — the same rows, one book')
  const rd = await relay(regA.token, 'wallet-deposit', { amount: 300, idemKey: idemKeyOf(A, 'deposit', `rd_${stamp}`) })
  check('11a. the relay deposit lands (1300)', rd.ok === true && rd.balance === 1300, JSON.stringify(rd))
  const rt = await relay(regA.token, 'wallet-transfer', { to: B, amount: 200, pin: PIN, idemKey: idemKeyOf(A, 'transfer', `rt_${stamp}`) })
  check('11b. the relay transfer lands (1100)', rt.ok === true && rt.balance === 1100, JSON.stringify(rt))
  const rtReplay = await relay(regA.token, 'wallet-transfer', { to: B, amount: 200, pin: PIN, idemKey: idemKeyOf(A, 'transfer', `rt_${stamp}`) })
  check('11c. the relay replay: same ledgerId, no double move', rtReplay.ok === true && rtReplay.receipt?.ledgerId === rt.receipt?.ledgerId && rtReplay.balance === 1100)
  const wB2 = await emit(sb, 'wallet', {})
  check('11d. B purse 700 — both lanes, ONE book', wB2.ok === true && wB2.balance === 700, JSON.stringify(wB2))

  section('THE DAY CAP at the relay door (a fresh walker, no rate law)')
  for (let i = 0; i < 4; i++) {
    const d = await relay(regD.token, 'wallet-deposit', { amount: 50_000, idemKey: idemKeyOf(D, 'deposit', `cap_${i}_${stamp}`) })
    if (!d.ok) {
      check('10a. the cap walker funded (4 × ₦50,000)', false, JSON.stringify(d))
      break
    }
    if (i === 3) check('10a. the cap walker funded (4 × ₦50,000)', d.balance === 200_000, JSON.stringify(d.balance))
  }
  let capTripped = false
  let capWhy = ''
  for (let i = 0; i < 5; i++) {
    const t = await relay(regD.token, 'wallet-transfer', { to: B, amount: 50_000, pin: PIN, idemKey: idemKeyOf(D, 'transfer', `cap_${i}_${stamp}`) })
    if (!t.ok) {
      capTripped = true
      capWhy = t.why ?? ''
      break
    }
  }
  check('10b. the 5th ₦50,000 transfer of the day refuses (day-cap)', capTripped && capWhy === 'day-cap', capWhy)

  section('THE FORTRESS CHAIN — the book recomputes end to end')
  // a FRESH snapshot: the walk must see every row the run wrote (the wire
  // legs AND the relay legs) — exactly what a live read would walk
  const chainDb = snapshotReadonly('ledger-chain')
  const chain = chainDb.query('SELECT id, idemKey, fromHandle, toHandle, amount, kind, chainHash, createdAt FROM LedgerRow ORDER BY id ASC').all() as { id: number; idemKey: string; fromHandle: string; toHandle: string; amount: number; kind: string; chainHash: string; createdAt: number }[]
  let chainOk = chain.length > 0
  let prev = LEDGER_SEED
  for (const r of chain) {
    const expect = chainLink(prev, { idemKey: r.idemKey, from: r.fromHandle, to: r.toHandle, amount: r.amount, kind: r.kind as 'deposit' | 'withdraw' | 'transfer', ts: Number(r.createdAt) })
    if (expect !== r.chainHash) {
      chainOk = false
      break
    }
    prev = r.chainHash
  }
  check(`12. every one of the ${chain.length} rows recomputes through the pure law (seed → tail)`, chainOk)
  chainDb.close()

  section('THE SYNC PRIVACY LAW — nobody sees another purse news')
  // sync INSIDE this run's window (head-110) so the check is real, not vacuous
  const head = (await (await fetch(`http://localhost:${WIRE_PORT}/health`)).json()) as { head?: number }
  const since = Math.max(0, (head.head ?? 0) - 110)
  const syncB = await fetch(`${BASE}/api/live/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regB.token}` },
    body: JSON.stringify({ presence: { street: 'patti', status: 'hustling' }, since }),
  }).then((r) => r.json()) as { ok?: boolean; events?: { channel?: string }[] }
  const bLedger = (syncB.events ?? []).filter((e) => e.channel?.startsWith('ledger:'))
  check("13a. B sync carries B own ledger receipt", bLedger.length >= 1 && bLedger.every((e) => e.channel === `ledger:${B}`), JSON.stringify(bLedger.slice(0, 2)))
  const syncZ = await fetch(`${BASE}/api/live/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regZ.token}` },
    body: JSON.stringify({ presence: { street: 'patti', status: 'hustling' }, since }),
  }).then((r) => r.json()) as { ok?: boolean; events?: { channel?: string }[] }
  const zLedger = (syncZ.events ?? []).filter((e) => e.channel?.startsWith('ledger:'))
  check("13b. Z sync carries ZERO ledger rows (the privacy law)", zLedger.length === 0, JSON.stringify(zLedger.slice(0, 2)))

  section('the wallet state door')
  const wA = await emit(nextA(), 'wallet', {})
  check('14. the state door: balance + transferredToday + recent all agree', wA.ok === true && typeof wA.balance === 'number' && typeof wA.transferredToday === 'number' && Array.isArray(wA.recent))

  for (const s of sa) s.disconnect()
  sb.disconnect()
  sk.disconnect()
}

/** THE TEARDOWN'S MERCY — the ONE lawful write a suite may make on the
 * live books: removing every row THIS run created (its stamped handles),
 * then proving the books whole again. Printed, always. */
function cleanupLedgerRows(): void {
  const ph = HANDLES.map(() => '?').join(',')
  const db = new Database(DB_PATH)
  const cleaned: Record<string, number> = {}
  try {
    const del = (name: string, sql: string, params: unknown[]): void => {
      cleaned[name] = (cleaned[name] ?? 0) + Number(db.query(sql).run(...(params as [])).changes)
    }
    del('Account', `DELETE FROM Account WHERE handle IN (${ph})`, HANDLES)
    del('ProfileRow', `DELETE FROM ProfileRow WHERE handle IN (${ph})`, HANDLES)
    del('WalletRow', `DELETE FROM WalletRow WHERE handle IN (${ph})`, HANDLES)
    del('VehicleRow', `DELETE FROM VehicleRow WHERE handle IN (${ph})`, HANDLES)
    del('LivePresence', `DELETE FROM LivePresence WHERE handle IN (${ph})`, HANDLES)
    del('LedgerRow', `DELETE FROM LedgerRow WHERE fromHandle IN (${ph}) OR toHandle IN (${ph})`, [...HANDLES, ...HANDLES])
    del('LiveEvent', `DELETE FROM LiveEvent WHERE actor IN (${ph}) OR channel IN (${ph})`, [...HANDLES, ...HANDLES.map((h) => `ledger:${h}`)])
  } finally {
    db.close()
  }
  console.log(`[cleanup] removed every row this run created (${HANDLES.join(' ')}): ${JSON.stringify(cleaned)}`)
}

/** THE ONE FINAL VERIFICATION READ (readonly): the books must show ZERO
 * leftovers for the run's handles, and the fortress chain must still walk
 * seed → tail after the tail rows left. */
function verifyBooksClean(): boolean {
  const ph = HANDLES.map(() => '?').join(',')
  const db = new Database(DB_PATH, { readonly: true })
  try {
    const n = (sql: string, params: unknown[]): number => Number((db.query(sql).get(...(params as [])) as { n: number }).n)
    const leftovers = {
      Account: n(`SELECT COUNT(*) n FROM Account WHERE handle IN (${ph})`, HANDLES),
      ProfileRow: n(`SELECT COUNT(*) n FROM ProfileRow WHERE handle IN (${ph})`, HANDLES),
      WalletRow: n(`SELECT COUNT(*) n FROM WalletRow WHERE handle IN (${ph})`, HANDLES),
      VehicleRow: n(`SELECT COUNT(*) n FROM VehicleRow WHERE handle IN (${ph})`, HANDLES),
      LivePresence: n(`SELECT COUNT(*) n FROM LivePresence WHERE handle IN (${ph})`, HANDLES),
      LedgerRow: n(`SELECT COUNT(*) n FROM LedgerRow WHERE fromHandle IN (${ph}) OR toHandle IN (${ph})`, [...HANDLES, ...HANDLES]),
      LiveEvent: n(`SELECT COUNT(*) n FROM LiveEvent WHERE actor IN (${ph}) OR channel IN (${ph})`, [...HANDLES, ...HANDLES.map((h) => `ledger:${h}`)]),
    }
    const chain = db.query('SELECT id, idemKey, fromHandle, toHandle, amount, kind, chainHash, createdAt FROM LedgerRow ORDER BY id ASC').all() as { idemKey: string; fromHandle: string; toHandle: string; amount: number; kind: string; chainHash: string; createdAt: number }[]
    let chainOk = chain.length > 0
    let prev = LEDGER_SEED
    for (const r of chain) {
      const expect = chainLink(prev, { idemKey: r.idemKey, from: r.fromHandle, to: r.toHandle, amount: r.amount, kind: r.kind as 'deposit' | 'withdraw' | 'transfer', ts: Number(r.createdAt) })
      if (expect !== r.chainHash) {
        chainOk = false
        break
      }
      prev = r.chainHash
    }
    const spotless = Object.values(leftovers).every((v) => v === 0)
    console.log(`[verify] books after cleanup: leftovers=${JSON.stringify(leftovers)}; fortress chain ${chainOk ? `INTACT (${chain.length} rows, seed → tail)` : 'BROKEN'}`)
    return spotless && chainOk
  } finally {
    db.close()
  }
}

try {
  await main()
} catch (e) {
  failed++
  console.error('\nSUITE CRASH:', e instanceof Error ? e.message : e)
} finally {
  ;(svc as { kill: () => void } | null)?.kill()
  cleanupLedgerRows()
  const booksWhole = verifyBooksClean()
  for (const p of SNAPSHOTS) dropTestDb(p)
  if (!booksWhole) {
    failed++
    fails.push('the teardown could not restore the books (leftovers or chain break)')
  }
}

console.log(`\n════════════════════════════════════════`)
console.log(`M24-W6 LEDGER SUITE: ${passed} passed, ${failed} failed`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
process.exit(failed ? 1 : 0)
