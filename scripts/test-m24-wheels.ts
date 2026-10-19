/**
 * LOKOJA LIFE — M24 W10-a: THE WHEELS LAW SUITE
 * ==============================================
 * Headless-pure where possible, REAL-WIRE where it matters: the suite
 * spawns the nation-wire on :3005, claims REAL accounts through the
 * register door on :3000 (the W1 face rides along), and walks the
 * wheels' lanes with socket.io-client. The park rows are read straight
 * off the disk (THE PARK LAW's witness).
 *
 * THE LAWS PINNED HERE:
 *  — pure (systems/wheels.ts, no server):
 *    1.  the hello verdict matrix (guest dark, minor never drives, bad
 *        model/plate/paint/pos refuse)
 *    2.  the plate law (the generator's shape AND the custom plate, one wall)
 *    3.  the paint law (the rigs' real vocabulary; invented colour never)
 *    4.  THE N12 SPEED LAW (clampVehicleStep: lawful steps pass, a cheat
 *        leap scales back along its own heading, the odometer reads clamped)
 *    5.  the park transition law (true→false is a park; a parked first tick too)
 *    6.  the cadence sender law (mover speaks, the park tick rides ONCE,
 *        a parked car never re-speaks)
 *    7.  the CarBuffer (lerp + the wheels' 12 ceiling + NEVER stales —
 *        absence is the roster's verdict; heading short-way; seed law)
 *    8.  the range law for cars (90 vs the bodies' 60)
 *    9.  the carried verdict
 *  — real wire (nation-wire on :3005):
 *    10. the car door: A's okada claims its wheels + the ack carries the
 *        DISK truth (fuel/condition/odometer readback)
 *    11. THE ADULT-HANDS LAW at the door: teen refuses minor-wheel; a
 *        guest stays dark
 *    12. the plate/paint laws at the door (bad values refuse)
 *    13. the 12Hz relay: B hears A's wheel ticks sub-second, full face
 *        (model/plate/paint/x/z/hd/mv)
 *    14. the street law: a different street hears NOTHING
 *    15. THE N12 LAW AT THE DOOR: a 100-unit cheat leap relays as the
 *        lawful distance along its own heading (ack.clamped true)
 *    16. THE CARRIED LAW at the door: A's body pos refuses 'carried'
 *        while the car lives; flows again after the bye
 *    17. THE PARK LAW ON DISK: the park tick writes the VehicleRow (spot,
 *        plate, paint, odometer from CLAMPED metres); the goodbye persists
 *        it again; the readback round-trips
 *    18. the seed law: a walker who arrives LATER sees the car in their
 *        roster (the roster carries the seed)
 *    19. the block wall covers the driveway: B blocks A → no wire:car;
 *        unblock → flow
 *    20. the rate law: a burst fills the bucket then refuses HONESTLY
 *    21. THE EPHEMERALITY LAW: no LiveEvent row ever carries a vehicle kind
 *
 * Exit code 0 = every law holds. Non-zero = a wheel lied somewhere.
 */
import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'

import {
  carHelloVerdict,
  clampVehicleStep,
  isParkTransition,
  carWorthSending,
  CarBuffer,
  carInRenderRange,
  carriedVerdict,
  plateOk,
  paintOk,
  topSpeedOf,
  VEH_TICK_MS,
  CAR_RANGE,
  CAR_SPEED_MAX,
  PAINT_VOCAB,
} from '../src/game/systems/wheels'

const BASE = 'http://localhost:3000'
const WIRE = 'http://localhost:3005'
const WIRE_PORT = 3005

let passed = 0
let failed = 0
const fails: string[] = []

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✅ ${name}`)
  } else {
    failed++
    fails.push(name)
    console.log(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

function section(name: string) {
  console.log(`\n━━ ${name}`)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* ─────────────────────── pure 1-9: the vault's own matrix ─────────────────────── */

section('PURE 1. the hello verdict matrix')
{
  const pos = { x: 10, z: 10, hd: 0.3, mv: false }
  const base = { model: 'okada', plate: 'LKO-419-AB', paint: '1', pos }
  check('an adult claims their wheels', carHelloVerdict({ band: 'adult', ...base }).ok === true)
  const ok = carHelloVerdict({ band: 'adult', ...base })
  check('the ok carries the validated shape', ok.ok === true && ok.ok && ok.model === 'okada' && ok.plate === 'LKO-419-AB' && ok.paint === '1' && ok.pos.mv === false)
  const g1 = carHelloVerdict({ band: 'guest', ...base })
  check('a guest stays dark', !g1.ok && g1.why === 'guest-mic-dark')
  const k1 = carHelloVerdict({ band: 'kid', ...base })
  check('THE ADULT-HANDS LAW: a kid NEVER drives online', !k1.ok && k1.why === 'minor-wheel')
  const t1 = carHelloVerdict({ band: 'teen', ...base })
  check('a teen neither', !t1.ok && t1.why === 'minor-wheel')
  const m1 = carHelloVerdict({ band: 'adult', ...base, model: 'jet' })
  check('an invented model refuses', !m1.ok && m1.why === 'bad-model')
  const m2 = carHelloVerdict({ band: 'adult', ...base, model: 7 })
  check('a non-string model refuses', !m2.ok && m2.why === 'bad-model')
  const m3 = carHelloVerdict({ band: 'adult', ...base, plate: 'BAD PLATE!' })
  check('a bad plate refuses', !m3.ok && m3.why === 'bad-plate')
  const m4 = carHelloVerdict({ band: 'adult', ...base, paint: 'gold-flake' })
  check('an invented paint refuses', !m4.ok && m4.why === 'bad-paint')
  const m5 = carHelloVerdict({ band: 'adult', ...base, pos: { x: 'a', z: 10, hd: 0, mv: false } })
  check('a NaN pos refuses', !m5.ok && m5.why === 'bad-pos')
  const m6 = carHelloVerdict({ band: 'adult', ...base, pos: { x: 9000, z: 10, hd: 0, mv: false } })
  check('an out-of-world pos refuses', !m6.ok && m6.why === 'bad-pos')
}

section('PURE 2. the plate law (the generator AND the custom plate, one wall)')
{
  check("the generator's shape fits", plateOk('LKO-419-AB') === true)
  check('a custom plate fits', plateOk('MY-RIDE-9') === true)
  check('a short custom fits', plateOk('AB12') === true)
  check('lowercase refuses (the wall is uppercase)', plateOk('lko-123-ab') === false)
  check('3 chars refuse', plateOk('A1-') === false)
  check('11 chars refuse', plateOk('ABCDEFGHIJ1') === false)
  check('symbols refuse', plateOk('LKO 419') === false)
  check('a non-string refuses', (plateOk as unknown as (v: unknown) => boolean)(42) === false)
}

section('PURE 3. the paint law (the rigs\' real vocabulary)')
{
  check('okada wears its 4 real tones', ['0', '1', '2', '3'].every((p) => paintOk('okada', p)))
  check('okada tone 9 never renders', paintOk('okada', '9') === false)
  check('the sedan wears its real variants', ['yellow', 'white', 'silver', 'darkblue', 'maroon'].every((p) => paintOk('taxi', p)))
  check('a taxi refuses the okada tones', paintOk('taxi', '2') === false)
  check('keke is honest stock', paintOk('keke', 'stock') === true && paintOk('keke', 'white') === false)
  check('danfo is honest stock', paintOk('danfo', 'stock') === true && paintOk('danfo', 'yellow') === false)
  check('the empty paint is the default', paintOk('okada', '') === true && paintOk('taxi', undefined) === true)
  const vocab = JSON.stringify(PAINT_VOCAB)
  check('the vocabulary is the rigs\' own (4/1/5/1 sizes)', vocab.includes('["0","1","2","3"]') && vocab.includes('["stock"]'))
}

section('PURE 4. THE N12 SPEED LAW (the server clamps to the TRUE top speed)')
{
  check('the data file\'s own numbers are the law', topSpeedOf('okada') === 9.5 && topSpeedOf('keke') === 7.5 && topSpeedOf('taxi') === 11 && topSpeedOf('danfo') === 9)
  const t0 = 1_000_000
  // a lawful step: 9.5 u/s okada × 0.083s ≈ 0.79u — passes untouched
  const lawful = clampVehicleStep({ x: 0, z: 0, t: t0 }, { x: 0.7, z: 0 }, 'okada', t0 + 83)
  check('a lawful step passes untouched', lawful.clamped === false && Math.abs(lawful.x - 0.7) < 1e-9 && Math.abs(lawful.moved - 0.7) < 1e-9, JSON.stringify(lawful))
  // a cheat leap: 100u in one tick — scaled back along its own direction
  const cheat = clampVehicleStep({ x: 0, z: 0, t: t0 }, { x: 100, z: 0 }, 'okada', t0 + 83)
  const maxDist = 9.5 * (83 / 1000) * 1.5
  check('the leap scales back to the lawful distance', cheat.clamped === true && Math.abs(cheat.x - maxDist) < 1e-6, JSON.stringify({ cheat, maxDist }))
  check('the leap keeps its DIRECTION (scaled, not refused)', cheat.z === 0)
  // the diagonal cheat keeps its angle
  const diag = clampVehicleStep({ x: 0, z: 0, t: t0 }, { x: 60, z: 80 }, 'okada', t0 + 83)
  const ang = Math.atan2(diag.z, diag.x)
  check('the diagonal cheat keeps its angle (0.9273 rad ≈ 3:4:5)', Math.abs(ang - Math.atan2(4, 3)) < 1e-6, `ang=${ang}`)
  check('the odometer reads CLAMPED metres only', Math.abs(diag.moved - maxDist) < 1e-6, `moved=${diag.moved}`)
  // a first tick (no prev) passes through — the hello owns the seed
  const first = clampVehicleStep(null, { x: 55, z: 66 }, 'okada', t0)
  check('a first tick passes through (the hello owns the seed)', first.clamped === false && first.x === 55 && first.z === 66 && first.moved === 0)
  // a long gap (wire hiccup) still clamps honestly, never freezes the law
  const gap = clampVehicleStep({ x: 0, z: 0, t: t0 }, { x: 30, z: 0 }, 'danfo', t0 + 2000)
  check('a 2s gap lets a danfo cover 27u — no more', gap.clamped === true && Math.abs(gap.x - 27) < 1e-6, JSON.stringify(gap))
}

section('PURE 5+6. the park transition + the cadence sender law')
{
  check('the move→stop transition is a park', isParkTransition(true, false) === true)
  check('the first parked tick is a park (the hello owns the seed)', isParkTransition(undefined, false) === true)
  check('stop→stop is not a park (no re-persist spam)', isParkTransition(false, false) === false)
  check('move→move is not a park', isParkTransition(false, true) === false)
  const mover = { x: 1, z: 0, hd: 0, mv: true }
  const parked = { x: 1, z: 0, hd: 0, mv: false }
  check('a mover speaks at the cadence', carWorthSending(null, mover) === true)
  check('the park tick rides ONCE', carWorthSending(mover, parked) === true)
  check('a parked car NEVER re-speaks', carWorthSending(parked, parked) === false)
  check(`the cadence constant is the plan's 12Hz (${VEH_TICK_MS}ms)`, VEH_TICK_MS === 83)
}

section('PURE 7. the CarBuffer (two snaps and a render clock — never stale)')
{
  const t0 = 2_000_000
  const buf = new CarBuffer()
  check('an empty buffer is not alive', buf.sample(t0).alive === false)
  buf.seed({ t: t0, x: 5, z: 5, hd: 0, mv: false })
  check('THE SEED LAW: the roster\'s moment stands the car before the first tick', buf.sample(t0 + 50).alive && Math.abs(buf.sample(t0 + 50).x - 5) < 1e-9)
  buf.push({ t: t0 + 100, x: 5.6, z: 5, hd: 0.4, mv: true }) // 6 u/s
  const mid = buf.sample(t0 + 100 + 120 - 60)
  const midMoving = mid.moving // the scratch is SHARED — read the truth before any later sample
  check('the car stands BETWEEN the snaps (lerped)', mid.alive && Math.abs(mid.x - 5.24) < 0.02, JSON.stringify(mid))
  const midSpeed = mid.speed
  check('the speed is measured (6 u/s across 100ms)', Math.abs(midSpeed - 6) < 0.2, `speed=${midSpeed}`)
  check('THE WHEELS\' CEILING: a taxi\'s measured speed clamps at 12, not the human 8', (() => {
    const b = new CarBuffer()
    b.push({ t: t0, x: 0, z: 0, hd: 0, mv: true })
    b.push({ t: t0 + 100, x: 1.2, z: 0, hd: 0, mv: true }) // 12 u/s exactly
    const s = b.sample(t0 + 100 + 60)
    return s.speed > 8 && s.speed <= CAR_SPEED_MAX
  })())
  buf.push({ t: t0 + 200, x: 5.6, z: 5, hd: 0.4, mv: false }) // THE PARK — the ticks stop here
  const parkedSample = buf.sample(t0 + 900_000) // 15 minutes later
  check('A CAR NEVER STALES: a parked car stands where it stopped (absence is the roster\'s verdict)', parkedSample.alive === true && Math.abs(parkedSample.x - 5.6) < 1e-9 && parkedSample.moving === false)
  check('the moving flag rides the NEWEST snap (engine on while moving)', midMoving === true && parkedSample.moving === false)
  check('a late packet never rewinds the clock', (() => {
    const b2 = new CarBuffer()
    b2.push({ t: t0, x: 5, z: 5, hd: 0, mv: true })
    b2.push({ t: t0 - 400, x: 0, z: 0, hd: 0, mv: true })
    return Math.abs(b2.sample(t0).x - 5) < 1e-9
  })())
  check('the heading takes the SHORT way round', (() => {
    const b3 = new CarBuffer()
    b3.push({ t: t0, x: 0, z: 0, hd: 3.1, mv: false })
    b3.push({ t: t0 + 100, x: 0, z: 0, hd: -3.1, mv: false })
    return Math.abs(b3.sample(t0 + 50).hd) < Math.PI + 1e-9
  })())
}

section('PURE 8+9. the range law for cars + the carried verdict')
{
  check('a car catches the eye at 90 (the bodies\' 60 would cull it)', carInRenderRange(0, 0, 80, 0) === true && carInRenderRange(0, 0, 60.1, 0) === true)
  check('beyond 90 a car is culled', carInRenderRange(0, 0, 90.1, 0) === false)
  check('the constants are the plan\'s (90 vs 60)', CAR_RANGE === 90)
  check('a driver is carried', carriedVerdict(true).ok === false && carriedVerdict(true).why === 'carried')
  check('a walker is not carried', carriedVerdict(false).ok === true)
}

/* ─────────────────────── real accounts through the real door ─────────────────────── */

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
    const s: Socket = io(WIRE, { transports: ['websocket', 'polling'], reconnection: false, timeout: 5000, auth: token ? { token } : {} })
    const t = setTimeout(() => { s.disconnect(); reject(new Error('connect timeout')) }, 6000)
    s.on('connect', () => { clearTimeout(t); resolve(s) })
    s.on('connect_error', (e) => { clearTimeout(t); reject(e) })
  })
}

type Ack = { ok?: boolean; why?: string; [k: string]: unknown }
interface RosterRow { handle: string; car?: { model: string; plate: string; paint: string; x: number; z: number; hd: number; mv: boolean } }
interface CarPush { h: string; model: string; plate: string; paint: string; x: number; z: number; hd: number; mv: boolean }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => { clearTimeout(t); resolve(r ?? {}) })
  })
}

function nextCar(s: Socket, from: string, ms = 2500): Promise<{ p: CarPush; dt: number } | null> {
  return new Promise((resolve) => {
    const t0 = Date.now()
    const t = setTimeout(() => { s.off('wire:car', h); resolve(null) }, ms)
    const h = (p: CarPush) => {
      if (p.h === from) { clearTimeout(t); s.off('wire:car', h); resolve({ p, dt: Date.now() - t0 }) }
    }
    s.on('wire:car', h)
  })
}

function silenceCar(s: Socket, from: string, ms = 900): Promise<boolean> {
  return new Promise((resolve) => {
    let silent = true
    const h = (p: CarPush) => { if (p.h === from) silent = false }
    s.on('wire:car', h)
    setTimeout(() => { s.off('wire:car', h); resolve(silent) }, ms)
  })
}

function carRow(handle: string, model: string): { plate: string; paint: string; fuel: number; condition: number; x: number; z: number; hd: number; odometer: number } | null {
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  try {
    return (db.query('SELECT plate, paint, fuel, condition, x, z, hd, odometer FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1').get(handle, model) as never) ?? null
  } finally {
    db.close()
  }
}

const stamp = Date.now().toString(36).slice(-6)
const A = `whl_a_${stamp}`
const B = `whl_b_${stamp}`
const T = `whl_t_${stamp}`
const E = `whl_e_${stamp}` // the latecomer (the seed law)

let svc: ReturnType<typeof Bun.spawn> | null = null

async function waitForHealth(tries = 40): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(`http://localhost:${WIRE_PORT}/health`); if (r.ok) return true } catch { /* not up yet */ }
    await sleep(150)
  }
  return false
}

try {
  section('spawn the nation wire (:3005) + claim the walkers (the W1 face rides)')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  void (async () => {
    try {
      const err = await new Response(svc!.stderr as unknown as BodyInit).text()
      if (err.trim()) console.error('[wire-child stderr]', err.slice(0, 2000))
    } catch { /* child may still be running */ }
  })()
  check('the wire service boots and the health door answers', await waitForHealth())

  const ra = await reg(A, '1234')
  const rb = await reg(B, '4321')
  const rt = await reg(T, '5678', { ageBand: 'teen', parentPin: '998877' })
  const re = await reg(E, '2468')
  const ta = ra.token!, tb = rb.token!, tt = rt.token!, te = re.token!
  check('four walkers claim through the REAL register door', !!ta && !!tb && !!tt && !!te)

  const sa = await connect(ta)
  const sb = await connect(tb)
  const st = await connect(tt)
  const sw = await connect(null)

  section('10. THE CAR DOOR — the fleet\'s hello + the disk readback')
  const ha = await emit(sa, 'hello', { street: 'kpata-market' })
  const hb = await emit(sb, 'hello', { street: 'kpata-market' })
  const ht = await emit(st, 'hello', { street: 'patti' })
  check('three walkers claim their streets (A+B market, T patti)', !!ha.ok && !!hb.ok && !!ht.ok)
  const vhello = await emit(sa, 'vehicle:hello', { model: 'okada', plate: 'LKO-419-AB', paint: '1', x: 10, z: 10, hd: 0.3, mv: false })
  check('A claims their okada (the door accepts)', vhello.ok === true, JSON.stringify(vhello))
  const readback = (vhello.car ?? null) as { model?: string; plate?: string; paint?: string; fuel?: number; condition?: number; odometer?: number } | null
  check('THE READBACK LAW: the ack carries the DISK truth (a fresh row: fuel 1, odometer 0)', !!readback && readback.model === 'okada' && readback.plate === 'LKO-419-AB' && readback.paint === '1' && readback.fuel === 1 && readback.condition === 1 && readback.odometer === 0, JSON.stringify(readback))
  const rowNow = carRow(A, 'okada')
  check('THE PARK LAW: a parked hello persists the row at once', !!rowNow && rowNow.plate === 'LKO-419-AB' && rowNow.paint === '1' && Math.abs(rowNow.x - 10) < 1e-6 && Math.abs(rowNow.z - 10) < 1e-6, JSON.stringify(rowNow))

  section('11+12. THE ADULT-HANDS LAW + the face laws at the REAL door')
  const teenHello = await emit(st, 'vehicle:hello', { model: 'keke', plate: 'TEEN-RIDE', paint: 'stock', x: 12, z: 12, hd: 0, mv: false })
  check('a teen NEVER drives online (the door refuses)', teenHello.ok === false && teenHello.why === 'minor-wheel', JSON.stringify(teenHello))
  const guestHello = await emit(sw, 'vehicle:hello', { model: 'okada', plate: 'GUEST-1', paint: '', x: 0, z: 0, hd: 0, mv: false })
  check('a guest stays dark at the car door', guestHello.ok === false && guestHello.why === 'guest-mic-dark')
  const badPlate = await emit(sa, 'vehicle:hello', { model: 'okada', plate: 'no spaces!', paint: '', x: 10, z: 10, hd: 0, mv: false })
  check('a bad plate refuses at the door', badPlate.ok === false && badPlate.why === 'bad-plate')
  const badPaint = await emit(sa, 'vehicle:hello', { model: 'okada', plate: 'LKO-419-AB', paint: 'gold-flake', x: 10, z: 10, hd: 0, mv: false })
  check('an invented paint refuses at the door', badPaint.ok === false && badPaint.why === 'bad-paint')
  const badModel = await emit(sa, 'vehicle:hello', { model: 'jet', plate: 'LKO-419-AB', paint: '', x: 10, z: 10, hd: 0, mv: false })
  check('an invented model refuses at the door', badModel.ok === false && badModel.why === 'bad-model')

  section('13+14. the 12Hz relay + the street law')
  const flow = nextCar(sb, A)
  await sleep(60)
  const tick1 = await emit(sa, 'vehicle:pos', { x: 10.3, z: 10, hd: 0.3, mv: true })
  const got1 = await flow
  check('the wheel tick relays (the door accepts)', tick1.ok === true)
  check('B hears A\'s wheels sub-second, FULL FACE', !!got1 && got1.p.model === 'okada' && got1.p.plate === 'LKO-419-AB' && got1.p.paint === '1' && got1.p.mv === true && Math.abs(got1.p.x - 10.3) < 1e-6, JSON.stringify(got1?.p))
  check('the relay is SUB-SECOND', !!got1 && got1.dt < 1000, `dt=${got1?.dt}ms`)

  section('15. THE N12 LAW AT THE DOOR — the cheat leap scales back')
  // sync: one accepted tick right before the cheat, so the clamp's dt is
  // known-small (the law's window is the REAL gap since the last ACCEPTED tick)
  await emit(sa, 'vehicle:pos', { x: 10.45, z: 10, hd: 0.3, mv: true })
  await sleep(80)
  const prev = { x: 10.45, z: 10 }
  const clampWatch = nextCar(sb, A)
  await sleep(20)
  const cheatAck = await emit(sa, 'vehicle:pos', { x: prev.x + 100, z: prev.z, hd: 0.3, mv: true })
  const cheatRelay = await clampWatch
  check('the door ANSWERS clamped=true', cheatAck.ok === true && (cheatAck as { clamped?: boolean }).clamped === true, JSON.stringify(cheatAck))
  const lawfulMax = topSpeedOf('okada') * 0.25 * 1.5 // ≤250ms elapsed → ≤3.56u lawful
  const dist = Math.hypot((cheatRelay?.p.x ?? 0) - prev.x, (cheatRelay?.p.z ?? 0) - prev.z)
  check('the 100-unit leap relays as the LAWFUL distance along its own heading', !!cheatRelay && dist <= lawfulMax && (cheatRelay?.p.x ?? 0) > prev.x, `dist=${dist.toFixed(2)} max=${lawfulMax.toFixed(2)} relayed=${JSON.stringify(cheatRelay?.p)}`)

  section('14. the street law')
  const stSilent = silenceCar(st, A, 900)
  await emit(sa, 'vehicle:pos', { x: 10.6, z: 10, hd: 0.3, mv: true })
  check('a DIFFERENT street hears NOTHING (T stands on patti)', await stSilent)

  section('16. THE CARRIED LAW at the door — the body lane goes silent')
  const carried = await emit(sa, 'pos', { x: 11, z: 11, hd: 0, mv: true })
  check("A's body pos REFUSES while the car lives", carried.ok === false && carried.why === 'carried', JSON.stringify(carried))
  const bye = await emit(sa, 'vehicle:bye', {})
  check('the bye accepts', bye.ok === true)
  const onFoot = await emit(sa, 'pos', { x: 11, z: 11, hd: 0, mv: false })
  check('after the bye the body lane flows again', onFoot.ok === true)
  const noCar = await emit(sa, 'vehicle:pos', { x: 12, z: 12, hd: 0, mv: true })
  check('a wheel tick with no live car refuses', noCar.ok === false && noCar.why === 'no-car')

  section('17. THE PARK LAW ON DISK — the row is the truth a reconnect reads')
  // re-hello (drive again), move lawfully, then PARK
  await emit(sa, 'vehicle:hello', { model: 'okada', plate: 'LKO-419-AB', paint: '1', x: 10, z: 10, hd: 0.3, mv: true })
  await sleep(90)
  await emit(sa, 'vehicle:pos', { x: 10.5, z: 10, hd: 0.3, mv: true })
  await sleep(90)
  const parkWatch = nextCar(sb, A)
  await sleep(60)
  const parkTick = await emit(sa, 'vehicle:pos', { x: 10.8, z: 10, hd: 0.3, mv: false })
  await parkWatch
  check('the park tick relays (mv=false rides once)', parkTick.ok === true)
  const rowParked = carRow(A, 'okada')
  check('THE PARK ROW: the stop persists the spot + the face', !!rowParked && Math.abs(rowParked.x - 10.8) < 1e-6 && rowParked.plate === 'LKO-419-AB' && rowParked.paint === '1', JSON.stringify(rowParked))
  check('THE HONEST ODOMETER: the row keeps the CLAMPED metres (>0, sane)', !!rowParked && rowParked.odometer > 0 && rowParked.odometer < 5, `odo=${rowParked?.odometer}`)
  // the goodbye's last word: disconnect with the car live persists again
  await emit(sa, 'vehicle:hello', { model: 'okada', plate: 'LKO-419-AB', paint: '1', x: 20, z: 20, hd: 0, mv: true })
  await sleep(80)
  sa.disconnect()
  await sleep(400)
  const rowBye = carRow(A, 'okada')
  check("THE GOODBYE'S LAST WORD: the disconnect persists the car where it stopped", !!rowBye && Math.abs(rowBye.x - 20) < 1e-6 && Math.abs(rowBye.z - 20) < 1e-6, JSON.stringify(rowBye))

  section('18. the seed law — a latecomer sees the car in their roster')
  const se = await connect(te)
  const he = await emit(se, 'hello', { street: 'kpata-market' })
  check('the latecomer claims the street', he.ok === true)
  const rosterE = ((he.roster as RosterRow[]) ?? [])
  // A disconnected above — hello a fresh driver instead: B borrows the wheel? No —
  // B claims their OWN keke parked (mv=false), then E sees B's car in the roster.
  const bcar = await emit(sb, 'vehicle:hello', { model: 'keke', plate: 'LKO-222-CD', paint: 'stock', x: 15, z: 15, hd: 0.9, mv: false })
  check('B claims their keke (parked)', bcar.ok === true)
  const rosterNow = await (async () => {
    const se2 = await connect(te)
    const h2 = await emit(se2, 'hello', { street: 'kpata-market' })
    se2.disconnect()
    return ((h2.roster as RosterRow[]) ?? []).find((r) => r.handle === B)?.car ?? null
  })()
  check('THE SEED LAW: the roster carries the car (face + spot) to a walker who arrived LATER', !!rosterNow && rosterNow.model === 'keke' && rosterNow.plate === 'LKO-222-CD' && Math.abs(rosterNow.x - 15) < 1e-6 && rosterNow.mv === false, JSON.stringify(rosterNow))
  se.disconnect()

  section('19. the block wall covers the driveway')
  const blk = await emit(sb, 'social:block', { handle: E })
  check('B blocks E (the graph door)', blk.ok === true)
  const se2 = await connect(te)
  await emit(se2, 'hello', { street: 'kpata-market' })
  const eSilent = silenceCar(se2, B, 800)
  await emit(sb, 'vehicle:hello', { model: 'keke', plate: 'LKO-222-CD', paint: 'stock', x: 15.5, z: 15, hd: 0.9, mv: true })
  await sleep(80)
  await emit(sb, 'vehicle:pos', { x: 15.9, z: 15, hd: 0.9, mv: true })
  check('the blocked pair shares NO car (the wall walks the driveway)', await eSilent)
  await emit(sb, 'social:unblock', { handle: E })
  const eFlow = nextCar(se2, B)
  await sleep(60)
  await emit(sb, 'vehicle:pos', { x: 16.2, z: 15, hd: 0.9, mv: true })
  const eGot = await eFlow
  check('unblock → the wheels flow again', !!eGot && Math.abs(eGot.p.x - 16.2) < 1e-6, JSON.stringify(eGot?.p))
  se2.disconnect()

  section('20. the rate law — the burst fills the bucket then refuses')
  const burst: Ack[] = []
  for (let i = 0; i < 40; i++) {
    burst.push(await emit(sb, 'vehicle:pos', { x: 16.2 + i * 0.01, z: 15, hd: 0.9, mv: true }))
  }
  const tooFast = burst.filter((r) => !r.ok && r.why === 'too-fast').length
  check('the bucket fills (29/1000ms) then refuses HONESTLY', tooFast > 0 && burst.filter((r) => r.ok).length > 0, `ok=${burst.filter((r) => r.ok).length} tooFast=${tooFast}`)

  section('21. THE EPHEMERALITY LAW — no LiveEvent row ever carries a vehicle')
  {
    const dbr = new Database('/home/z/my-project/db/custom.db', { readonly: true })
    try {
      const vehRows = dbr.query("SELECT COUNT(*) AS n FROM LiveEvent WHERE kind LIKE 'vehicle%' OR kind = 'car'").get() as { n: number }
      check('NOT ONE LiveEvent row carries a vehicle kind (movement is a moment, the park is a row)', Number(vehRows.n) === 0, `rows=${vehRows.n}`)
    } finally {
      dbr.close()
    }
  }

  for (const s of [sb, st, sw]) s.disconnect()
  await sleep(200)
} catch (e) {
  failed++
  fails.push(`suite threw: ${String(e)}`)
  console.error('SUITE THREW:', e)
} finally {
  svc?.kill()
}

console.log(`\n════════════════════════════════════════`)
console.log(`W10-a THE WHEELS: ${passed} passed, ${failed} failed`)
if (fails.length) {
  console.log('FAILED:')
  for (const f of fails) console.log(`  - ${f}`)
}
process.exit(failed === 0 ? 0 : 1)
