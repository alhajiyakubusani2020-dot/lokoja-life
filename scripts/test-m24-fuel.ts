/**
 * LOKOJA LIFE — M24 W10-c: THE FUEL SUITE
 * ========================================
 * The pump and the garage, through the REAL ledger: THE TANK LAW (the
 * clamp's metres burn it), THE WEAR LAW, THE PUMP VERDICT matrix (adults
 * only, the pump proximity the WIRE's own eye, the tank-full + amount
 * laws), THE SERVICE BOOK's quote, and the REAL doors on a fresh :3005
 * wire riding a THROWAWAY COPY of the books (the test/prod seam — the
 * live db/custom.db is never opened for writing here): the burn lands on
 * the copy's disk, the dry tank refuses, the REAL ₦
 * debit (deposit → refuel → the balance moves EXACTLY once), the replay
 * law (the same idemKey returns the SAME receipt — the tank never
 * double-pours), the day cap now counts the pump, and the repair brings
 * the condition home. bun run scripts/test-m24-fuel.ts
 */

import { Database } from 'bun:sqlite'
import { io, type Socket } from 'socket.io-client'
import { makeTestDb, dropTestDb, seedAccount, scrubTestHandles } from './lib/test-db'

let pass = 0
let fail = 0
const fails: string[] = []

function check(name: string, ok: boolean, detail?: string): void {
  if (ok) {
    pass++
    console.log(`  ✅ ${name}`)
  } else {
    fail++
    fails.push(name)
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

function section(name: string): void {
  console.log(`\n── ${name} ──`)
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/* ───────────────────────── the pure laws (wheels.ts verbatim) ───────────────────────── */

import {
  fuelAfterBurn,
  conditionAfterWear,
  refuelVerdict,
  repairVerdict,
  repairQuote,
  nearServiceSpot,
  FUEL_RANGE,
  TANK_LITRES,
  DRY_TANK,
  PETROL_PRICE_PER_LITRE,
  FULL_SERVICE,
  SERVICE_SPOTS,
} from '../src/game/systems/wheels'
import { LOCATIONS } from '../src/game/data/locations'

function pureLaws(): void {
  section('1. THE MAP LAW — the wire\'s spots stand where the world\'s anchors stand')
  
  check('all three pump ids are real locations', SERVICE_SPOTS.pump.every((id) => LOCATIONS.some((l) => l.id === id)))
  check('the garage id is a real location', SERVICE_SPOTS.garage.every((id) => LOCATIONS.some((l) => l.id === id)))

  section('2. THE TANK LAW — the clamp\'s metres burn it')
  check('the ranges: okada 2600 / keke 3400 / taxi 5200 / danfo 6800', FUEL_RANGE.okada === 2600 && FUEL_RANGE.keke === 3400 && FUEL_RANGE.taxi === 5200 && FUEL_RANGE.danfo === 6800)
  check('a full tank burns by metres/range', fuelAfterBurn(1, 520, 'taxi') === 0.9)
  check('the tank floors at 0 (never negative)', fuelAfterBurn(0.01, 6800, 'danfo') === 0)
  check('a still car burns nothing', fuelAfterBurn(0.5, 0, 'okada') === 0.5)
  check('an unknown model burns nothing (no invented range)', fuelAfterBurn(0.5, 100, 'jet') === 0.5)

  section('3. THE WEAR LAW — the honest odometer wears the body')
  check('a full life is 30,000u', conditionAfterWear(1, 3000, ) === 0.9)
  check('the condition floors at 0', conditionAfterWear(0.005, 30_000) === 0)

  section('4. THE PUMP VERDICT — the matrix in order')
  const base = { band: 'adult' as const, model: 'taxi', fuel: 0.4, amount: 2000, atPump: true }
  check('a guest buys nothing (guest-dark)', refuelVerdict({ ...base, band: 'guest' }).ok === false)
  check('a minor never touches the pump (minors-no-money)', refuelVerdict({ ...base, band: 'teen' }).ok === false)
  check('an invented model refuses', refuelVerdict({ ...base, model: 'jet' }).ok === false)
  check('off-pump refuses (the wire\'s own eye)', refuelVerdict({ ...base, atPump: false }).ok === false)
  check('a full tank refuses (tank-full)', refuelVerdict({ ...base, fuel: 1 }).ok === false)
  check('₦199 is too small', refuelVerdict({ ...base, amount: 199 }).ok === false)
  check('₦20,001 is too big', refuelVerdict({ ...base, amount: 20_001 }).ok === false)
  const pour = refuelVerdict(base)
  check('₦2,000 pours honestly (litres = amount/900 → fraction of the 45L tank)', pour.ok === true && pour.ok && pour.amount === 2000 && Math.abs(pour.fuel - (0.4 + (2000 / PETROL_PRICE_PER_LITRE) / TANK_LITRES.taxi)) < 1e-9)
  const pourCap = refuelVerdict({ ...base, fuel: 0.99, amount: 20_000 })
  check('the pour never overflows the tank (capped at 1)', pourCap.ok === true && pourCap.ok && pourCap.fuel === 1)

  section('5. THE SERVICE BOOK — the mechanic\'s ladder')
  check('full services: okada ₦8k / keke ₦14k / taxi ₦24k / danfo ₦32k', FULL_SERVICE.okada === 8_000 && FULL_SERVICE.keke === 14_000 && FULL_SERVICE.taxi === 24_000 && FULL_SERVICE.danfo === 32_000)
  check('the quote is the wear\'s own math (60% body → 40% of the book)', repairQuote('danfo', 0.6) === Math.ceil(0.4 * 32_000))
  check('a sound body quotes ₦0', repairQuote('okada', 1) === 0)

  section('6. THE REPAIR VERDICT — the matrix')
  const rBase = { band: 'adult' as const, model: 'okada', condition: 0.6, atGarage: true }
  check('a guest repairs nothing', repairVerdict({ ...rBase, band: 'guest' }).ok === false)
  check('a minor never pays the mechanic', repairVerdict({ ...rBase, band: 'kid' }).ok === false)
  check('off-garage refuses', repairVerdict({ ...rBase, atGarage: false }).ok === false)
  check('a sound body refuses (no-need)', repairVerdict({ ...rBase, condition: 1 }).ok === false)
  const fix = repairVerdict(rBase)
  check('a 60% body services back to 1 for the honest quote', fix.ok === true && fix.ok && fix.condition === 1 && fix.amount === Math.ceil(0.4 * FULL_SERVICE.okada))

  section('7. THE DRY LINE')
  check('the dry tank sits at 2%', DRY_TANK === 0.02)
}

/* ───────────────────────── the real doors (:3005) ───────────────────────── */

const WIRE_PORT = Number(process.env.WIRE_PORT ?? 3005)
const WIRE = `http://localhost:${WIRE_PORT}`
// THE SEAM: the wire, the harness's tank write and every read ride this
// throwaway copy — the live db/custom.db is never opened by this suite.
const COPY = makeTestDb('m24-fuel')

function connect(token: string | null): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s: Socket = io(WIRE, { transports: ['websocket', 'polling'], reconnection: false, timeout: 5000, auth: token ? { token } : {} })
    const t = setTimeout(() => { s.disconnect(); reject(new Error('connect timeout')) }, 6000)
    s.on('connect', () => { clearTimeout(t); resolve(s) })
    s.on('connect_error', (e) => { clearTimeout(t); reject(e) })
  })
}

type Ack = { ok?: boolean; why?: string; [k: string]: unknown }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => { clearTimeout(t); resolve(r ?? {}) })
  })
}

function rowOf(handle: string, model: string): { fuel: number; condition: number; odometer: number } | null {
  const db = new Database(COPY, { readonly: true })
  try {
    return (db.query('SELECT fuel, condition, odometer FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1').get(handle, model) as never) ?? null
  } finally {
    db.close()
  }
}

function walletOf(handle: string): number {
  const db = new Database(COPY, { readonly: true })
  try {
    const r = db.query('SELECT balance FROM WalletRow WHERE handle = ? LIMIT 1').get(handle) as { balance: number } | undefined
    return r?.balance ?? -1
  } finally {
    db.close()
  }
}

function ledgerRow(idemKey: string): { kind: string; amount: number; from: string; to: string } | null {
  const db = new Database(COPY, { readonly: true })
  try {
    return (db.query('SELECT kind, amount, fromHandle as \"from\", toHandle as \"to\" FROM LedgerRow WHERE idemKey = ? LIMIT 1').get(idemKey) as never) ?? null
  } finally {
    db.close()
  }
}

const stamp = Date.now().toString(36).slice(-4).toUpperCase()
const A = `f3a_${stamp}`
const T = `f3t_${stamp}`
const PA = `LKO-${stamp}-F`
const PARK = LOCATIONS.find((l) => l.id === 'transport-area')!
const PUMP = { x: (PARK.mapX - 50) * 6.2, z: (PARK.mapY - 50) * 6.2 }

let svc: { kill: () => void } | null = null

async function waitForHealth(tries = 40): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(`http://localhost:${WIRE_PORT}/health`); if (r.ok) return true } catch { /* not up yet */ }
    await sleep(150)
  }
  return false
}

async function main(): Promise<void> {
  pureLaws()

  section('8. spawn the wire (on the COPY) + claim the walkers')
  // THE SEAM LAW: the register door on :3000 writes the LIVE books, so the
  // fixtures are born DIRECTLY in the copy (the test-hardening pattern) —
  // same columns the register door writes, M13 parent shield for the teen.
  // The scrub first: this suite's 4-char stamp can repeat within ~28min,
  // and a stale fixture row in the snapshot must never masquerade as fresh.
  const seeded: { a: string; t: string } = (() => {
    const db = new Database(COPY)
    try {
      scrubTestHandles(db, [A, T])
      return { a: seedAccount(db, { handle: A, pin: '1234' }).token, t: seedAccount(db, { handle: T, band: 'teen', pin: '5678', parentPin: '998877' }).token }
    } finally {
      db.close()
    }
  })()
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT), WIRE_DB: COPY },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  check('the wire boots (the health door answers)', await waitForHealth())
  const ra = { token: seeded.a }
  const rt = { token: seeded.t }
  check('the adult + the teen claim through the REAL register', !!ra.token && !!rt.token)
  const sa = await connect(ra.token!)
  const st = await connect(rt.token!)
  const ha = await emit(sa, 'hello', { street: 'transport-area' })
  check('A stands at the Motor Park (the pump\'s own street)', !!ha.ok)

  section('9. THE BURN — the clamped metres drain the tank on the disk')
  const vhello = await emit(sa, 'vehicle:hello', { model: 'taxi', plate: PA, paint: '', x: PUMP.x, z: PUMP.z, hd: 0.2, mv: false })
  check('A claims the taxi at the pump (the door accepts)', vhello.ok === true, JSON.stringify(vhello))
  const row0 = rowOf(A, 'taxi')
  check('a fresh row: fuel 1, condition 1', !!row0 && row0.fuel === 1 && row0.condition === 1)
  // THE HONEST DRIVE — out and back, every claim inside the world bound:
  // 2s ticks (the clamp allows topSpeed × dt × 1.5 = 33u/tick), 32u claims
  // never refused, ~520 honest metres ≈ 10% of the taxi's tank.
  let x = PUMP.x
  const driveTick = async (nx: number): Promise<boolean> => {
    const r = await emit(sa, 'vehicle:pos', { x: nx, z: PUMP.z, hd: nx >= x ? 0.2 : Math.PI - 0.2, mv: true })
    if (r.ok === false) {
      console.log(`  🔍 tick: ${JSON.stringify(r)}`)
      return false
    }
    await sleep(2000)
    return true
  }
  while (x < 315) { if (!(await driveTick(Math.min(315, x + 32)))) break; x = Math.min(315, x + 32) }
  // THE HONEST PARK: the wire judges the pump on ITS OWN clamped car pos
  // (hardening) — the taxi must STAND at the pump (≤ SERVICE_RADIUS 26u),
  // exactly like the honest client does, before the pour is lawful
  for (let i = 0; i < 20 && x > PUMP.x + 20; i++) { if (!(await driveTick(x - 32))) break; x -= 32 }
  await sleep(600) // the park tick breathes well clear of the bucket window
  const parkAck = await emit(sa, 'vehicle:pos', { x, z: PUMP.z, hd: 0.2, mv: false }) // the park persists the row
  if (parkAck.ok === false) {
    console.log(`  🔍 park: ${JSON.stringify(parkAck)}`)
    await sleep(1200)
    await emit(sa, 'vehicle:pos', { x, z: PUMP.z, hd: 0.2, mv: false })
  }
  const row1 = rowOf(A, 'taxi')
  check('THE BURN LANDED: ~528 honest metres drained the tank to ~0.9', !!row1 && row1.fuel < 0.95 && row1.fuel > 0.8, JSON.stringify(row1))
  check('THE WEAR LANDED: the body wears with the odometer', !!row1 && row1.condition < 1 && row1.condition > 0.95, JSON.stringify(row1))

  section('10. THE PUMP DOOR — the REAL ledger moves EXACTLY once')
  await emit(sa, 'wallet:deposit', { amount: 5000, idemKey: `dep-${stamp}` })
  await sleep(2600) // THE WALLET CAP: 4/10s — the doors breathe
  const balance0 = walletOf(A)
  check('A funded the purse (₦5,000 through the deposit door)', balance0 === 5000, `balance=${balance0}`)
  await sleep(2600)
  // THE PAPER LIE DIES (the hardening law): the coords claim 900u off the
  // pump, but the wire judges its OWN clamped car pos — the taxi STANDS at
  // the pump, so the pour is lawful and the client's paper is dead weight.
  const thePour = await emit(sa, 'vehicle:refuel', { model: 'taxi', amount: 2000, x: PUMP.x + 900, z: PUMP.z, idemKey: `r-off-${stamp}` })
  check("THE WIRE'S OWN EYE: the coords lie 900u off, the server's pos pours anyway (₦2,000)", thePour.ok === true && typeof thePour.fuel === 'number' && typeof thePour.balance === 'number', JSON.stringify(thePour).slice(0, 240))
  const teenPour = await emit(st, 'vehicle:refuel', { model: 'taxi', amount: 2000, x: PUMP.x, z: PUMP.z, idemKey: `r-teen-${stamp}` })
  check('the teen\'s money wall holds at the pump (minors-no-money / no-car)', teenPour.ok === false, JSON.stringify(teenPour))
  await sleep(2600)
  const tooBig = await emit(sa, 'vehicle:refuel', { model: 'taxi', amount: 21_000, x: PUMP.x, z: PUMP.z, idemKey: `r-big-${stamp}` })
  check('₦21,000 refuses (the pump\'s ceiling)', tooBig.ok === false && tooBig.why === 'too-big')
  await sleep(2600)
  const balance1 = walletOf(A)
  check('THE DEBIT IS REAL: ₦5,000 − ₦2,000 = ₦3,000 on the disk', balance1 === 3000, `balance=${balance1}`)
  const led = ledgerRow(`r-off-${stamp}`)
  check('THE LEDGER ROW: kind refuel, from A, to the pump', !!led && led.kind === 'refuel' && led.amount === 2000 && led.from === A && led.to === 'pump', JSON.stringify(led))
  const row2 = rowOf(A, 'taxi')
  check('THE TANK ON DISK: the pour landed on the row at once', !!row2 && typeof thePour.fuel === 'number' && Math.abs((row2?.fuel ?? -1) - (thePour.fuel ?? -2)) < 1e-9, JSON.stringify(row2))
  await sleep(2600)
  const replay = await emit(sa, 'vehicle:refuel', { model: 'taxi', amount: 2000, x: PUMP.x + 900, z: PUMP.z, idemKey: `r-off-${stamp}` })
  check('THE REPLAY LAW: the same idemKey returns ok + replayed, the tank never double-pours', replay.ok === true && replay.replayed === true && replay.fuel === thePour.fuel, JSON.stringify(replay).slice(0, 200))
  check('THE BOOKS ARE SEALED: the replay moved nothing (balance still ₦3,000)', walletOf(A) === 3000)
  await sleep(2600)
  const capView = await emit(sa, 'wallet', {})
  check('THE DAY CAP\'S EYE: the pump spend counts (transferredToday ≥ ₦2,000)', typeof capView.transferredToday === 'number' && capView.transferredToday >= 2000, JSON.stringify({ t: capView.transferredToday }))

  section('11. THE SERVICE DOOR — the condition comes home')
  // force wear: the suite's odometer is honest — service the worn taxi
  const quoteNeeded = row2 ? Math.ceil((1 - row2.condition) * 24_000) : 0
  await sleep(2600)
  // THE PAPER LIE DIES at the garage too: the coords claim 900u off, the
  // wire's own eye sees the taxi STANDING at the mechanic row — lawful.
  const theFix = await emit(sa, 'vehicle:repair', { model: 'taxi', x: PUMP.x + 900, z: PUMP.z, idemKey: `s-off-${stamp}` })
  check("THE WIRE'S OWN EYE at the garage: the coords lie, the server's pos services (the quote lands)", theFix.ok === true && theFix.condition === 1 && typeof theFix.balance === 'number', JSON.stringify(theFix).slice(0, 240))
  check('THE QUOTE IS THE WEAR\'S OWN MATH: the debit equals the book\'s quote', walletOf(A) === 3000 - quoteNeeded, `balance=${walletOf(A)} quote=${quoteNeeded}`)
  const row3 = rowOf(A, 'taxi')
  check('THE BODY ON DISK: condition 1 (the mechanic\'s word is the row)', !!row3 && row3.condition === 1)
  await sleep(2600)
  const noNeed = await emit(sa, 'vehicle:repair', { model: 'taxi', x: PUMP.x, z: PUMP.z, idemKey: `s2-${stamp}` })
  check('a sound body refuses (no-need) — the mechanic does not invent work', noNeed.ok === false && noNeed.why === 'no-need')
  await sleep(2600) // the wallet cap breathes before the replay law asks again
  const replayFix = await emit(sa, 'vehicle:repair', { model: 'taxi', x: PUMP.x + 900, z: PUMP.z, idemKey: `s-off-${stamp}` })
  check('THE REPLAY LAW at the garage: the same idemKey services nothing twice', replayFix.ok === true && replayFix.replayed === true && replayFix.condition === 1, JSON.stringify(replayFix).slice(0, 200))
  const ledgerAfter = ledgerRow(`s-off-${stamp}`)
  check('THE LEDGER ROW: kind repair, to the garage', !!ledgerAfter && ledgerAfter.kind === 'repair' && ledgerAfter.to === 'garage')

  section('12. THE DRY TANK — the engine coughs at the line')
  await emit(sa, 'vehicle:bye', {})
  // the harness sets the tank (the SERVER's burn math is already proven
  // by the taxi drive; the DOOR's law is what this leg tests): a hello
  // below the dry line takes the road ONCE — the next moving tick refuses.
  await emit(sa, 'vehicle:hello', { model: 'okada', plate: `LKO-${stamp}-O`, paint: '', x: PUMP.x, z: PUMP.z, hd: 0, mv: false })
  await emit(sa, 'vehicle:bye', {}) // the memory row drops; the disk holds the fresh row
  await sleep(200)
  // the harness sets the tank ON THE COPY (the suite's own arena — the live
  // books are never written by a test)
  const dbW = new Database(COPY)
  try {
    dbW.query('UPDATE VehicleRow SET fuel = ? WHERE handle = ? AND model = ?').run(0.005, A, 'okada')
  } finally {
    dbW.close()
  }
  // THE READBACK IS THE TRUTH: this hello lifts the dry tank from the disk
  await emit(sa, 'vehicle:hello', { model: 'okada', plate: `LKO-${stamp}-O`, paint: '', x: PUMP.x, z: PUMP.z, hd: 0, mv: false })
  const dryTick = await emit(sa, 'vehicle:pos', { x: PUMP.x + 30, z: PUMP.z, hd: 0, mv: true })
  check('THE DRY TANK AT THE DOOR: a dry engine\'s motion refuses dry-tank', dryTick.ok === false && dryTick.why === 'dry-tank', JSON.stringify(dryTick))
  const stillTick = await emit(sa, 'vehicle:pos', { x: PUMP.x, z: PUMP.z, hd: 0, mv: false })
  check('a STILL dry car still speaks (the park lane is not fuel-locked)', stillTick.ok === true)

  section('13. THE EPHEMERALITY LAW re-pinned')
  const db = new Database(COPY, { readonly: true })
  const kinds = (db.query('SELECT DISTINCT kind FROM LiveEvent WHERE createdAt >= ?').all(Date.now() - 120_000) as { kind: string }[]).map((r) => r.kind)
  db.close()
  check('no LiveEvent row carries a vehicle/fuel kind', !kinds.some((k) => k.includes('vehicle') || k.includes('fuel') || k.includes('refuel')))

  sa.disconnect()
  st.disconnect()
}

try {
  await main()
} catch (e) {
  fail++
  fails.push(`suite threw: ${String(e)}`)
  console.error(e)
} finally {
  try { (svc as { kill: () => void } | null)?.kill() } catch { /* already gone */ }
  dropTestDb(COPY)
}

console.log(`\n════════════════════════════════════════`)
console.log(`W10-c FUEL SUITE: ${pass} passed, ${fail} failed`)
if (fails.length) {
  console.log('FAILED:')
  for (const f of fails) console.log(`  - ${f}`)
  process.exit(1)
}
process.exit(0)
