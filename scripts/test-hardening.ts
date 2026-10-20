/**
 * LOKOJA LIFE — THE HARDENING SUITE (Trust & World Hardening Update, Phase 1-A)
 * ==============================================================================
 * The attack suite for the money + abuse laws. EVERY scenario runs against a
 * THROWAWAY copy of the books (VACUUM INTO /tmp) with a scratch wire on :3007
 * — the live DB at db/custom.db is NEVER opened for writing by this suite,
 * and nothing on :3000/:3003 is touched or killed. THE SEAM IS THE LAW.
 *
 * What it proves (each scenario = a named attack, asserted end to end):
 *  S1  THE MINT DIES      — the 5th ×₦50k deposit of the day refuses 'day-cap'
 *  S2  THE SPEND CAP      — 4×₦50k transfers pass, the 5th refuses (PIN law alive)
 *  S3  TELEPORT-PUMP DIES — refuel with pump coords in the POCKET refused:
 *                            the wire judges its OWN clamped car pos
 *  S4  THE PUMP IS HONEST — a car standing at the pump refuels with garbage
 *                            coords (the client's paper is no longer read)
 *  S5  RELOCATION GATED   — far hello #1 relocates, far hello #2 within the
 *                            window refuses 'too-far-from-park', near-park is free
 *  S6  THE ACCOUNT EYE    — 4 sockets × 4 calls: the 5 sockets' worth of
 *                            wallet reads stop at the account-level cap (12)
 *  S7  THE GUEST EYE DIES — a guest's disconnect frees its stage seat: after
 *                            8 eyes full, a departing guest's seat is re-usable
 *  S8  CONSERVATION       — every touched purse equals deposits − spends,
 *                            to the kobo, against the copy's own rows
 *
 * Run: bun scripts/test-hardening.ts
 */

import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'
import { createHash, scryptSync, randomBytes } from 'node:crypto'
import { unlinkSync } from 'node:fs'
import { SERVICE_SPOTS, nearServiceSpot } from '../src/game/systems/wheels'
import { LOCATIONS } from '../src/game/data/locations'
import { LEDGER_LIMITS } from '../src/game/systems/ledger'

const WIRE_PORT = 3007
const WIRE = `http://localhost:${WIRE_PORT}`
const STAMP = Date.now().toString(36)
const COPY = `/tmp/lokoja-hard-${STAMP}.db`
const PIN = '4321'

/* ── the harness's own truth ── */
let pass = 0
let fail = 0
const failures: string[] = []
function check(name: string, ok: boolean, detail = ''): void {
  if (ok) {
    pass++
    console.log(`  ✅ ${name}`)
  } else {
    fail++
    failures.push(name)
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}
function section(name: string): void {
  console.log(`\n── ${name} ──`)
}

/* ── the spot math: the harness computes the pump coords the SAME way the
 *    wire does (wheels.ts's own exported law), then self-checks it ── */
function spotOf(locId: string): { x: number; z: number } {
  const l = LOCATIONS.find((L) => L.id === locId)
  if (!l) throw new Error(`no such location: ${locId}`)
  return { x: (l.mapX - 50) * 6.2, z: (l.mapY - 50) * 6.2 }
}
const PUMP = spotOf(SERVICE_SPOTS.pump[0]!)
if (!nearServiceSpot('pump', PUMP.x, PUMP.z)) throw new Error('harness self-check failed: computed pump spot is not near the pump')
/** a spot provably far from every pump + the garage (the self-check of the lie) */
function farSpot(): { x: number; z: number } {
  for (let x = -300; x <= 300; x += 10) {
    for (let z = -300; z <= 300; z += 10) {
      if (!nearServiceSpot('pump', x, z) && !nearServiceSpot('garage', x, z)) return { x, z }
    }
  }
  throw new Error('no far spot found')
}
const FAR = farSpot()

/* ── the acked emit ── */
const ALL_SOCKS: Socket[] = []
function connect(token?: string): Promise<Socket> {
  return new Promise((res, rej) => {
    const s = token ? io(WIRE, { auth: { token }, transports: ['websocket'] }) : io(WIRE, { transports: ['websocket'] })
    ALL_SOCKS.push(s)
    s.on('connect', () => res(s))
    s.on('connect_error', (e) => rej(e))
    setTimeout(() => rej(new Error('connect timeout')), 8000)
  })
}
function emit<T = Record<string, unknown>>(s: Socket, ev: string, payload: unknown): Promise<T> {
  return new Promise((res) => {
    const t = setTimeout(() => res({ ok: false, why: 'ack-timeout' } as T), 6000)
    s.emit(ev, payload, (r: T) => {
      clearTimeout(t)
      res(r)
    })
  })
}
/** THE STREET FIRST: the wire's vehicle doors demand the walker's own
 * presence (no-street otherwise) — every driver in this suite steps onto
 * a street before touching a wheel, exactly like the client does. */
async function walkOn(s: Socket): Promise<void> {
  await emit(s, 'hello', { street: 'home', status: '' })
  await sleep(150)
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* ── the throwaway books: a consistent snapshot via VACUUM INTO, then the
 *    fixture citizens are born DIRECTLY in the copy (the copy is ours —
 *    writing fixtures into it is the honest test pattern the old suites
 *    lost when they wrote into db/custom.db instead). ── */
function buildCopy(): void {
  const live = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  live.exec(`VACUUM INTO '${COPY}'`)
  live.close()
  const db = new Database(COPY)
  const mk = (handle: string, band = 'adult'): string => {
    const token = `hard-${handle}-${STAMP}`
    const salt = randomBytes(16).toString('hex')
    const pinHash = scryptSync(PIN, salt, 32).toString('hex')
    const id = createHash('sha1').update(handle + STAMP).digest('hex').slice(0, 24)
    const now = Date.now()
    db.query(
      'INSERT INTO Account (id, handle, contact, pinHash, salt, ageBand, parentPinHash, parentSalt, token, createdAt, updatedAt) VALUES (?, ?, NULL, ?, ?, ?, NULL, NULL, ?, ?, ?)',
    ).run(id, handle, pinHash, salt, band, token, now, now)
    return token
  }
  globalThis.__tokens = {
    B: mk(`hardB_${STAMP}`), // the mint + the spend cap
    D: mk(`hardD_${STAMP}`), // the relocation gate
    E: mk(`hardE_${STAMP}`), // the account eye
    F: mk(`hardF_${STAMP}`), // the stage host + the transfer receiver
    G: mk(`hardG_${STAMP}`), // the teleport-pump liar
    H: mk(`hardH_${STAMP}`), // the honest pump customer
  }
  // H's car: born at the pump with a nearly dry tank (hello reads the row)
  db.query(
    "INSERT INTO VehicleRow (handle, model, plate, paint, fuel, condition, x, z, hd, odometer, updatedAt) VALUES (?, 'danfo', ?, '', 0.005, 1, ?, ?, 0, 0, ?)",
  ).run(`hardH_${STAMP}`, `HARD-${STAMP.slice(-4).toUpperCase()}H`, PUMP.x, PUMP.z, Date.now())
  db.close()
}
declare global {
  // eslint-disable-next-line no-var
  var __tokens: Record<string, string>
}

let svc: ReturnType<typeof Bun.spawn> | null = null
async function waitWire(): Promise<boolean> {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${WIRE}/health`)
      if (r.ok) return true
    } catch { /* not up yet */ }
    await sleep(250)
  }
  return false
}

/* ── THE SCENARIOS ── */
async function main(): Promise<void> {
  console.log('🔥 THE HARDENING SUITE — the copy is the arena, the live books are sacred\n')
  buildCopy()
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT), WIRE_DB: COPY },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  if (!(await waitWire())) {
    console.error('the scratch wire never came up on :' + WIRE_PORT)
    const err = await new Response(svc.stderr as unknown as ReadableStream).text()
    console.error(err.slice(-2000))
    process.exit(1)
  }
  console.log(`   scratch wire live on :${WIRE_PORT} (db: ${COPY})`)
  const T = globalThis.__tokens
  const CAP = LEDGER_LIMITS.DAY_DEPOSIT_CAP
  const BIG = LEDGER_LIMITS.MAX_PER_TRANSFER
  const GAP = 2600 // the honest pace: 4 wallet verbs per 10s socket window —
  // the suite must attack the DAY CAP, not trip the flood law on the way

  /* S1 + S2 — the mint dies, the spend cap holds */
  section('S1/S2 — THE MINT DIES + THE SPEND CAP (account B)')
  const b = await connect(T.B!)
  const bHandle = `hardB_${STAMP}`
  let depositsOk = 0
  let lastWhy = ''
  for (let i = 0; i < 5; i++) {
    const r = await emit<{ ok: boolean; why?: string; balance?: number }>(b, 'wallet:deposit', { amount: BIG, idemKey: `${bHandle}:deposit:hard${i}:${STAMP}` })
    if (r.ok) depositsOk++
    else lastWhy = r.why ?? ''
    await sleep(GAP)
  }
  check(`the 5th ×${BIG} deposit refuses 'day-cap' (the faucet has a meter)`, depositsOk === CAP / BIG && lastWhy === 'day-cap', `ok=${depositsOk} why=${lastWhy}`)
  await sleep(GAP)
  const wB = await emit<{ ok: boolean; balance?: number }>(b, 'wallet', {})
  check(`the purse holds exactly the capped ₦${CAP.toLocaleString()}`, wB.ok && wB.balance === CAP, `balance=${wB.balance}`)
  await sleep(GAP)
  let spendsOk = 0
  let spendWhy = ''
  for (let i = 0; i < 5; i++) {
    const r = await emit<{ ok: boolean; why?: string; balance?: number }>(b, 'wallet:transfer', { to: `hardF_${STAMP}`, amount: BIG, pin: PIN, idemKey: `${bHandle}:transfer:hard${i}:${STAMP}` })
    if (r.ok) spendsOk++
    else spendWhy = r.why ?? ''
    await sleep(GAP)
  }
  check(`4×${BIG} transfers pass, the 5th refuses 'day-cap' (one cap law, wire side)`, spendsOk === 4 && spendWhy === 'day-cap', `ok=${spendsOk} why=${spendWhy}`)
  await sleep(GAP)
  const wB2 = await emit<{ ok: boolean; balance?: number }>(b, 'wallet', {})
  check('B drained to ₦0 — conservation on the honest path', wB2.ok && wB2.balance === 0, `balance=${wB2.balance}`)
  b.disconnect()

  /* S3 — the teleport-pump dies */
  section('S3 — TELEPORT-PUMP DIES (account G lies with its coords)')
  const g = await connect(T.G!)
  const gHandle = `hardG_${STAMP}`
  await walkOn(g)
  const hG = await emit<{ ok: boolean; why?: string }>(g, 'vehicle:hello', { model: 'danfo', plate: `HARD-${STAMP.slice(-4).toUpperCase()}G`, paint: '', x: FAR.x, z: FAR.z, hd: 0, mv: false })
  check('G parks far from every service spot (the row is born there)', hG.ok, JSON.stringify(hG))
  const lie = await emit<{ ok: boolean; why?: string }>(g, 'vehicle:refuel', { model: 'danfo', amount: 2000, x: PUMP.x, z: PUMP.z, idemKey: `${gHandle}:refuel:lie:${STAMP}` })
  check('refuel with pump coords in the POCKET refuses — the wire judges its own car pos', lie.ok === false && lie.why === 'no-pump', JSON.stringify(lie))
  g.disconnect()

  /* S4 — the honest pump works (and the client's paper coords are dead) */
  section('S4 — THE PUMP IS HONEST (account H stands at the pump)')
  const h = await connect(T.H!)
  const hHandle = `hardH_${STAMP}`
  await walkOn(h)
  const depH = await emit<{ ok: boolean }>(h, 'wallet:deposit', { amount: 5000, idemKey: `${hHandle}:deposit:seed:${STAMP}` })
  check('H tops up ₦5,000 for the pour', depH.ok === true, JSON.stringify(depH))
  const hHello = await emit<{ ok: boolean; why?: string; car?: { fuel: number } }>(h, 'vehicle:hello', { model: 'danfo', plate: `HARD-${STAMP.slice(-4).toUpperCase()}H`, paint: '', x: PUMP.x + 5, z: PUMP.z + 5, hd: 0, mv: false })
  check('H hello at the pump (row park +5u — near-park law free)', hHello.ok && (hHello.car?.fuel ?? 1) < 0.01, JSON.stringify(hHello))
  const pour = await emit<{ ok: boolean; why?: string; fuel?: number; receipt?: { kind?: string } }>(h, 'vehicle:refuel', { model: 'danfo', amount: 2000, x: 9999, z: 9999, idemKey: `${hHandle}:refuel:pour:${STAMP}` })
  check('the pour lands with GARBAGE coords (paper coords dead, server pos wins)', pour.ok === true && (pour.fuel ?? 0) > 0.005 && pour.receipt?.kind === 'refuel', JSON.stringify(pour))
  h.disconnect()

  /* S5 — the relocation gate */
  section('S5 — THE RELOCATION GATE (account D: the car stands where IT parked)')
  const d = await connect(T.D!)
  const dHandle = `hardD_${STAMP}`
  await walkOn(d)
  const d1 = await emit<{ ok: boolean; why?: string }>(d, 'vehicle:hello', { model: 'danfo', plate: `HARD-${STAMP.slice(-4).toUpperCase()}D`, paint: '', x: 10, z: 10, hd: 0, mv: false })
  check('D parks at (10,10)', d1.ok, JSON.stringify(d1))
  await emit(d, 'vehicle:bye', {})
  const d2 = await emit<{ ok: boolean; why?: string }>(d, 'vehicle:hello', { model: 'danfo', plate: `HARD-${STAMP.slice(-4).toUpperCase()}D`, paint: '', x: FAR.x, z: FAR.z, hd: 0, mv: false })
  check('far hello #1 = the ONE lawful relocation of the window', d2.ok, JSON.stringify(d2))
  await emit(d, 'vehicle:bye', {})
  const d3 = await emit<{ ok: boolean; why?: string }>(d, 'vehicle:hello', { model: 'danfo', plate: `HARD-${STAMP.slice(-4).toUpperCase()}D`, paint: '', x: 300, z: 300, hd: 0, mv: false })
  check("far hello #2 refuses 'too-far-from-park' (the farm is dead)", d3.ok === false && d3.why === 'too-far-from-park', JSON.stringify(d3))
  const d4 = await emit<{ ok: boolean; why?: string }>(d, 'vehicle:hello', { model: 'danfo', plate: `HARD-${STAMP.slice(-4).toUpperCase()}D`, paint: '', x: FAR.x + 30, z: FAR.z + 30, hd: 0, mv: false })
  check('near-park hello (30u) is free — the honest morning still drives', d4.ok, JSON.stringify(d4))
  d.disconnect()

  /* S6 — the account eye */
  section('S6 — THE ACCOUNT EYE (account E, 4 sockets, one wallet)')
  const socks: Socket[] = []
  for (let i = 0; i < 4; i++) socks.push(await connect(T.E))
  let oks = 0
  let fasts = 0
  for (let round = 0; round < 4; round++) {
    for (const s of socks) {
      const r = await emit<{ ok: boolean; why?: string }>(s, 'wallet', {})
      if (r.ok) oks++
      else if (r.why === 'too-fast') fasts++
    }
  }
  check(`16 reads across 4 sockets: 12 pass, 4 refuse (the token cannot multiply its manners)`, oks === 12 && fasts === 4, `ok=${oks} fast=${fasts}`)
  for (const s of socks) s.disconnect()

  /* S7 — the guest eye dies */
  section('S7 — THE GUEST EYE DIES (host F, the refresh hostage is over)')
  const f = await connect(T.F!)
  const start = await emit<{ ok: boolean; why?: string; streamId?: string }>(f, 'stage:start', { title: `Hardening Live ${STAMP}` })
  check('F goes live', start.ok, JSON.stringify(start))
  const guests: Socket[] = []
  let full = 0
  for (let i = 0; i < 9; i++) {
    const gSock = await connect()
    guests.push(gSock)
    const r = await emit<{ ok: boolean; why?: string }>(gSock, 'stage:watch', { streamId: start.streamId })
    if (r.why === 'stage-full') full++
  }
  check('8 guest eyes fill the mesh cap, the 9th was refused', full === 1, `full=${full}`)
  guests[0]!.disconnect()
  await sleep(400)
  const g9 = await connect()
  const r9 = await emit<{ ok: boolean; why?: string }>(g9, 'stage:watch', { streamId: start.streamId })
  check('the departed guest\u2019s seat is FREED — a fresh eye walks in', r9.ok === true, JSON.stringify(r9))
  g9.disconnect()
  await emit(f, 'stage:end', { streamId: start.streamId })
  f.disconnect()

  /* S8 — conservation on the copy's own rows */
  section('S8 — CONSERVATION (the copy\u2019s books, read back)')
  const db = new Database(COPY, { readonly: true })
  const handles = [`hardB_${STAMP}`, `hardF_${STAMP}`, `hardG_${STAMP}`, `hardH_${STAMP}`, `hardD_${STAMP}`, `hardE_${STAMP}`]
  let allBalanced = true
  let detail = ''
  for (const hnd of handles) {
    const inRow = db.query("SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE toHandle = ? AND kind IN ('deposit','transfer')").get(hnd) as { s: number }
    // the spend side EXCLUDES deposit — a top-up is not a spend, and a
    // self-deposit must not be counted against the purse twice
    const outRow = db.query("SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE fromHandle = ? AND kind != 'deposit'").get(hnd) as { s: number }
    const w = db.query('SELECT balance FROM WalletRow WHERE handle = ?').get(hnd) as { balance: number } | null
    const expect = Number(inRow.s) - Number(outRow.s)
    const actual = w ? Number(w.balance) : 0
    if (expect !== actual) {
      allBalanced = false
      detail += `${hnd}: expect ${expect} got ${actual}; `
    }
  }
  check('every touched purse = deposits in − spends out, to the kobo', allBalanced, detail)
  db.close()

  /* ── the verdict ── */
  console.log(`\n═══ THE HARDENING SUITE: ${pass} passed, ${fail} failed ═══`)
  if (failures.length) console.log('   the dead: ' + failures.join(' · '))
  teardown(fail > 0 ? 1 : 0)
}

/** THE TEARDOWN LAW: open sockets + the spawned wire keep the loop alive
 * forever — the suite dismantles its whole arena and exits HARD. */
function teardown(code: number): void {
  try {
    for (const s of ALL_SOCKS) s.disconnect()
  } catch { /* already gone */ }
  try {
    svc?.kill()
  } catch { /* already gone */ }
  try {
    unlinkSync(COPY)
  } catch { /* already gone */ }
  setTimeout(() => process.exit(code), 150)
}

main().catch((e) => {
  console.error('SUITE ERROR:', e)
  teardown(1)
})
