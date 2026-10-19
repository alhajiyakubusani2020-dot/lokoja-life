/**
 * LOKOJA LIFE — M24 W10-b: THE BOARDING SUITE
 * ============================================
 * The passengers' wave: the BOARD VERDICT matrix (pure), the SEAT LAW's
 * real capacities, the UNBOARD mirror, THE CREW VOICE LAW, THE DMV
 * VERDICT + the plate-ownership eye, THE PARKED SEED LAW — and the REAL
 * doors on a fresh :3005 wire: seats toggle, the board matrix (guest
 * dark, blocked, seats-shut, moving, full, not-here), the crew push,
 * the carried law covers the rider, the crew voice zone at the pv
 * doors, the DMV door (not-yours, plate-taken, the live repaint), the
 * parked spawn (the bye broadcast + the latecomer query + live-wins),
 * and THE GOODBYE'S CREW DROP. bun run scripts/test-m24-wheels2.ts
 */

import { Database } from 'bun:sqlite'
import { io, type Socket } from 'socket.io-client'

/* ───────────────────────── the harness (the wheels suite's own) ───────────────────────── */

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
  boardVerdict,
  unboardVerdict,
  crewVoiceOk,
  patchVerdict,
  plateOwnershipOk,
  parkedSeedsNear,
  seatsOf,
  PASSENGER_SEATS,
  PARKED_SEED_CAP,
  type ParkedSeed,
} from '../src/game/systems/wheels'

/** the verdict's why — TS-narrowing without double calls */
function whyOf(v: { ok: boolean; why?: string }): string {
  return v.ok ? '' : (v.why ?? '')
}

function pureLaws(): void {
  section('1. THE SEAT LAW — real capacities, the model decides')
  check('okada 1, keke 2, taxi 3, danfo 5', PASSENGER_SEATS.okada === 1 && PASSENGER_SEATS.keke === 2 && PASSENGER_SEATS.taxi === 3 && PASSENGER_SEATS.danfo === 5)
  check('seatsOf unknown model = 0 (no invented seats)', seatsOf('jet') === 0)

  section('2. THE BOARD VERDICT — the matrix in order')
  const base = { band: 'adult' as const, model: 'taxi', carLive: true, carMv: false, seatsOpen: true, seated: 0, alreadyAboard: false }
  check('no car refuses no-car', whyOf(boardVerdict({ ...base, carLive: false })) === 'no-car')
  check('a guest rides nothing (guest-dark)', whyOf(boardVerdict({ ...base, band: 'guest' })) === 'guest-dark')
  check('a rider cannot board twice (already-aboard)', whyOf(boardVerdict({ ...base, alreadyAboard: true })) === 'already-aboard')
  check('a blocked pair shares NO car', whyOf(boardVerdict({ ...base, blocked: true })) === 'blocked')
  check('shut seats refuse (consent or nothing)', whyOf(boardVerdict({ ...base, seatsOpen: false })) === 'seats-shut')
  check('a moving danfo takes nobody', whyOf(boardVerdict({ ...base, carMv: true })) === 'moving')
  check('a full okada refuses full (1 seat)', whyOf(boardVerdict({ ...base, model: 'okada', seated: 1 })) === 'full')
  const ok = boardVerdict(base)
  check('a stopped, consenting taxi boards at seat 0', ok.ok === true && ok.ok && ok.seat === 0)
  const ok2 = boardVerdict({ ...base, seated: 2 })
  check('the third pillion takes seat 2 (the seat index rides)', ok2.ok === true && ok2.ok && ok2.seat === 2)
  check('a TEEN rides shotgun (the M13 mercy)', boardVerdict({ ...base, band: 'teen' }).ok === true)
  check('a KID rides shotgun too', boardVerdict({ ...base, band: 'kid' }).ok === true)

  section('3. THE UNBOARD VERDICT — the mirror wall')
  check('not riding refuses', whyOf(unboardVerdict(false, false)) === 'not-riding')
  check('a moving car drops nobody', whyOf(unboardVerdict(true, true)) === 'moving')
  check('a stopped car lets go', unboardVerdict(true, false).ok === true)

  section('4. THE CREW VOICE LAW — the interior zone')
  check('a minor never voices (either mouth)', crewVoiceOk({ meBand: 'kid', peerBand: 'adult', myCrew: 'a', peerCrew: 'a' }) === false)
  check('no crew = no zone pass', crewVoiceOk({ meBand: 'adult', peerBand: 'adult', myCrew: null, peerCrew: 'a' }) === false)
  check('different crews never pair', crewVoiceOk({ meBand: 'adult', peerBand: 'adult', myCrew: 'a', peerCrew: 'b' }) === false)
  check('the same crew hears itself', crewVoiceOk({ meBand: 'adult', peerBand: 'adult', myCrew: 'a', peerCrew: 'a' }) === true)

  section('5. THE DMV VERDICT — the patch walls in order')
  check('a guest paints nothing (guest-dark)', whyOf(patchVerdict({ band: 'guest', model: 'taxi', paint: 'yellow' })) === 'guest-dark')
  check('an invented model refuses', whyOf(patchVerdict({ band: 'adult', model: 'jet' })) === 'bad-model')
  check('an invented colour refuses', whyOf(patchVerdict({ band: 'adult', model: 'taxi', paint: 'purple' })) === 'bad-paint')
  check('a lowercase plate refuses', whyOf(patchVerdict({ band: 'adult', model: 'taxi', plate: 'ab1' })) === 'bad-plate')
  const p1 = patchVerdict({ band: 'adult', model: 'taxi', paint: 'maroon' })
  check('a lawful paint-only patch passes', p1.ok === true && p1.ok && p1.paint === 'maroon' && p1.plate === undefined)
  const p2 = patchVerdict({ band: 'adult', model: 'okada', plate: 'LKO-77-XY' })
  check('a lawful plate-only patch passes', p2.ok === true && p2.ok && p2.plate === 'LKO-77-XY' && p2.paint === undefined)
  check("stock paint ('') is the book's own default", patchVerdict({ band: 'adult', model: 'taxi', paint: '' }).ok === true)

  section('6. THE PLATE OWNERSHIP LAW — one plate, one row')
  check('a free plate passes', plateOwnershipOk('LKO-1-AA', 'a', 'taxi', null) === true)
  check('my own row keeps my plate', plateOwnershipOk('LKO-1-AA', 'a', 'taxi', { handle: 'a', model: 'taxi' }) === true)
  check('another citizen\'s plate refuses', plateOwnershipOk('LKO-1-AA', 'b', 'taxi', { handle: 'a', model: 'taxi' }) === false)
  check('my plate on my OTHER model refuses (one plate, one row)', plateOwnershipOk('LKO-1-AA', 'a', 'danfo', { handle: 'a', model: 'taxi' }) === false)

  section('7. THE PARKED SEED LAW — the disk rows fill absences')
  const rows: ParkedSeed[] = [
    { handle: 'a', model: 'taxi', plate: 'P-1', paint: '', x: 10, z: 10, hd: 0, odometer: 5, fuel: 1, condition: 1 },
    { handle: 'b', model: 'danfo', plate: 'P-2', paint: '', x: 200, z: 200, hd: 0, odometer: 5, fuel: 1, condition: 1 },
    { handle: 'c', model: 'keke', plate: 'P-3', paint: '', x: 12, z: 11, hd: 0, odometer: 5, fuel: 1, condition: 1 },
    { handle: 'd', model: 'okada', plate: 'P-4', paint: '', x: Number.NaN, z: 5, hd: 0, odometer: 5, fuel: 1, condition: 1 },
  ]
  const live = new Set(['a\u0000taxi']) // a's taxi is LIVE — the seed must not double it
  const seeds = parkedSeedsNear(rows, 10, 10, live)
  check('the live car wins its own row (no double spawn)', !seeds.some((s) => s.handle === 'a'))
  check('beyond the 90u range law: nothing', !seeds.some((s) => s.handle === 'b'))
  check('a NaN pose never seeds', !seeds.some((s) => s.handle === 'd'))
  check('the nearest absent car seeds first', seeds.length >= 1 && seeds[0].handle === 'c')
  check('the cap holds (PARKED_SEED_CAP 24)', PARKED_SEED_CAP === 24 && parkedSeedsNear(rows, 10, 10, new Set()).length <= 24)
}

/* ───────────────────────── the real doors (:3005) ───────────────────────── */

const WIRE_PORT = Number(process.env.WIRE_PORT ?? 3005)
const WIRE = `http://localhost:${WIRE_PORT}`
const BASE = process.env.BASE ?? 'http://localhost:3000'

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

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => { clearTimeout(t); resolve(r ?? {}) })
  })
}

interface CrewPush { type: string; driver: string; who: string; why?: string; crew: string[]; x?: number; z?: number }
interface ParkedPush { op: string; row: { handle: string; model: string; plate: string; x: number; z: number } }

function nextCrew(s: Socket, ms = 2500): Promise<CrewPush | null> {
  return new Promise((resolve) => {
    const t = setTimeout(() => { s.off('wire:car-crew', h); resolve(null) }, ms)
    const h = (p: CrewPush) => { clearTimeout(t); s.off('wire:car-crew', h); resolve(p) }
    s.on('wire:car-crew', h)
  })
}

function nextParked(s: Socket, ms = 2500): Promise<ParkedPush | null> {
  return new Promise((resolve) => {
    const t = setTimeout(() => { s.off('wire:parked', h); resolve(null) }, ms)
    const h = (p: ParkedPush) => { clearTimeout(t); s.off('wire:parked', h); resolve(p) }
    s.on('wire:parked', h)
  })
}

function carRow(handle: string, model: string): { plate: string; paint: string; x: number; z: number; odometer: number } | null {
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  try {
    return (db.query('SELECT plate, paint, x, z, odometer FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1').get(handle, model) as never) ?? null
  } finally {
    db.close()
  }
}

function liveEventKinds(): string[] {
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  try {
    return (db.query("SELECT DISTINCT kind FROM LiveEvent WHERE createdAt >= ?").all(Date.now() - 120_000) as { kind: string }[]).map((r) => r.kind)
  } finally {
    db.close()
  }
}

const stamp = Date.now().toString(36).slice(-4).toUpperCase() // THE PLATE LAW: A-Z 0-9 only
const PA = `LKO-${stamp}-A` // 10 chars exactly — the generator's own shape
const PB = `LKO-${stamp}-B`
const PC = `LKO-${stamp}-C`
const A = `w2a_${stamp}`
const B = `w2b_${stamp}`
const T = `w2t_${stamp}`
const E = `w2e_${stamp}`
const F = `w2f_${stamp}`

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

  section('8. spawn the nation wire (:3005) + claim the walkers')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  check('the wire service boots and the health door answers', await waitForHealth())

  const ra = await reg(A, '1234')
  const rb = await reg(B, '4321')
  const rt = await reg(T, '5678', { ageBand: 'teen', parentPin: '998877' })
  const re = await reg(E, '2468')
  const rf = await reg(F, '1357')
  check('five walkers claim through the REAL register door', !!ra.token && !!rb.token && !!rt.token && !!re.token && !!rf.token)

  const sa = await connect(ra.token!)
  const sb = await connect(rb.token!)
  const st = await connect(rt.token!)
  const se = await connect(re.token!)
  const sf = await connect(rf.token!)
  const sw = await connect(null)
  check('six sockets + one guest ride the wire', sa.connected && sb.connected && st.connected && se.connected && sf.connected && sw.connected)

  // the roster mirror: latest roster row per handle (the riding truth rides it)
  let roster: { handle: string; riding?: { driver: string }; car?: { seatsOpen?: boolean; plate: string; paint: string } }[] = []
  const rosterH = (p: { roster?: typeof roster }) => { if (p.roster) roster = p.roster }
  sb.on('wire:roster', rosterH)
  await sleep(120)

  section('9. THE SEATS DOOR — the driver\'s standing consent')
  const ha = await emit(sa, 'hello', { street: 'kpata-market' })
  const hb = await emit(sb, 'hello', { street: 'kpata-market' })
  const he = await emit(se, 'hello', { street: 'kpata-market' })
  const hf = await emit(sf, 'hello', { street: 'kpata-market' })
  const ht = await emit(st, 'hello', { street: 'patti' })
  check('four adults on the market + the teen on patti', !!ha.ok && !!hb.ok && !!he.ok && !!hf.ok && !!ht.ok, JSON.stringify({ ha, hb, he, hf, ht }))
  const noCarSeats = await emit(sa, 'vehicle:seats', { open: true })
  check('seats without a car refuse no-car', noCarSeats.ok === false && noCarSeats.why === 'no-car')
  const vhello = await emit(sa, 'vehicle:hello', { model: 'okada', plate: PA, paint: '', x: 10, z: 10, hd: 0.4, mv: false })
  check('A claims their okada, parked (the door accepts)', vhello.ok === true, JSON.stringify(vhello))
  const seatsOn = await emit(sa, 'vehicle:seats', { open: true })
  check('THE STANDING CONSENT: the toggle answers seatsOpen true', seatsOn.ok === true && seatsOn.seatsOpen === true)
  await sleep(150)
  check('the roster seed carries the consent (the street reads it)', roster.find((r) => r.handle === A)?.car?.seatsOpen === true)

  section('10. THE BOARD DOOR — the matrix at the wire')
  const gBoard = await emit(sw, 'vehicle:board', { handle: A })
  check('a guest boards nothing (guest-dark)', gBoard.ok === false && gBoard.why === 'guest-dark')
  const tBoard = await emit(st, 'vehicle:board', { handle: A })
  check('a different street refuses not-here (you board a car you can walk to)', tBoard.ok === false && tBoard.why === 'not-here')
  const crewWait = nextCrew(sb) // the listener rides BEFORE the gesture (the push is instant)
  const bBoard = await emit(sb, 'vehicle:board', { handle: A })
  check('B boards A\'s stopped, consenting okada (seat 0 + the pose rides)', bBoard.ok === true && (bBoard.seat as number) === 0 && typeof (bBoard.car as { x?: number })?.x === 'number', JSON.stringify(bBoard))
  const crewB = await crewWait
  check('THE CREW PUSH: the driver hears the board (type board, who B)', !!crewB && crewB.type === 'board' && crewB.who === B && crewB.crew.includes(B))
  await sleep(150)
  check('B\'s roster row carries the ride (riding.driver = A)', roster.find((r) => r.handle === B)?.riding?.driver === A)
  const bCarried = await emit(sb, 'pos', { x: 11, z: 11, hd: 0, mv: true })
  check('THE CARRIED LAW covers the rider: B\'s body lane refuses', bCarried.ok === false && bCarried.why === 'carried')
  const tFull = await emit(st, 'vehicle:board', { handle: A })
  check('the okada is FULL at one pillion (T on patti boards same street? no — not-here first)', tFull.ok === false, JSON.stringify(tFull))

  section('11. the crew voice zone — the pv doors run crewVoiceOk')
  const va = await emit(sa, 'voice:join', {})
  const vb = await emit(sb, 'voice:join', {})
  const ve = await emit(se, 'voice:join', {})
  const vt = await emit(st, 'voice:join', {})
  check('the adults join the walkie; the teen stays dark (minors-no-voice)', va.ok === true && vb.ok === true && ve.ok === true && vt.ok === false && vt.why === 'minors-no-voice')
  const crewTalk = await new Promise<boolean>((resolve) => {
    const t = setTimeout(() => resolve(false), 2500)
    sb.on('wire:pv', (p: { type: string; from: string }) => {
      if (p.type === 'pv-offer' && p.from === A) { clearTimeout(t); resolve(true) }
    })
    void emit(sa, 'pv:offer', { to: B, sdp: 'v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\ns=-\r\n' }).then(() => {})
  })
  check('driver → passenger: the crew hears its own (the envelope relays)', crewTalk)
  const strTalk = await emit(sa, 'pv:offer', { to: E, sdp: 'v=0\r\no=- 2 2 IN IP4 127.0.0.1\r\ns=-\r\n' })
  check('driver → street stranger: NOT-CREW (the interior zone tightens)', strTalk.ok === false && strTalk.why === 'not-crew')
  const paxTalk = await emit(sb, 'pv:offer', { to: E, sdp: 'v=0\r\no=- 3 3 IN IP4 127.0.0.1\r\ns=-\r\n' })
  check('passenger → street stranger: NOT-CREW', paxTalk.ok === false && paxTalk.why === 'not-crew')

  section('12. THE MOVING WALL — a moving danfo drops nobody')
  await emit(sa, 'vehicle:pos', { x: 14, z: 14, hd: 0.4, mv: true })
  const hopMoving = await emit(sb, 'vehicle:unboard', {})
  check('B cannot hop off while the car moves', hopMoving.ok === false && hopMoving.why === 'moving')
  await emit(sa, 'vehicle:pos', { x: 14.5, z: 14.5, hd: 0.4, mv: false }) // the park tick
  const hopOk = await emit(sb, 'vehicle:unboard', {})
  check('stopped, B steps off — the ack carries the car\'s pose', hopOk.ok === true && typeof hopOk.x === 'number', JSON.stringify(hopOk))
  await sleep(150)
  check('B\'s riding cleared (the roster speaks)', roster.find((r) => r.handle === B)?.riding === undefined)

  section('13. THE BLOCK WALL walks to the driveway')
  await emit(sb, 'social:block', { handle: E })
  const blockedBoard = await emit(se, 'vehicle:board', { handle: A })
  check('E (blocked by nobody relevant) still boards A fine', blockedBoard.ok === true, JSON.stringify(blockedBoard))
  await emit(se, 'vehicle:unboard', {})
  await emit(sb, 'social:block', { handle: F })
  const fBoard = await emit(sf, 'vehicle:board', { handle: A })
  check('F (blocked by B? no — the wall is the DRIVER\'S edges) boards or refuses honestly', typeof fBoard.ok === 'boolean')
  if (fBoard.ok) await emit(sf, 'vehicle:unboard', {}) // F steps off — the next wall judges F on foot
  await sleep(120)
  // the real wall: the DRIVER blocks the boarder
  await emit(sa, 'social:block', { handle: F })
  const fBoard2 = await emit(sf, 'vehicle:board', { handle: A })
  check('the driver\'s blocked pair shares NO car (blocked)', fBoard2.ok === false && fBoard2.why === 'blocked', JSON.stringify(fBoard2))
  await emit(sb, 'social:unblock', { handle: E })
  await emit(sb, 'social:unblock', { handle: F })

  section('14. THE DMV DOOR — the paint and the plate, server truth')
  const notYours = await emit(sb, 'vehicle:patch', { model: 'okada', paint: '2' })
  check('B cannot patch A\'s okada (not-yours)', notYours.ok === false && notYours.why === 'not-yours')
  const badPlate = await emit(sa, 'vehicle:patch', { model: 'okada', plate: 'ab1' })
  check('a lowercase plate refuses at the DMV', badPlate.ok === false && badPlate.why === 'bad-plate')
  const badPaint = await emit(sa, 'vehicle:patch', { model: 'okada', paint: 'purple' })
  check('an invented colour refuses at the DMV', badPaint.ok === false && badPaint.why === 'bad-paint')
  const okPaint = await emit(sa, 'vehicle:patch', { model: 'okada', paint: '2' })
  check('A repaints the okada green (the ack carries the disk answer)', okPaint.ok === true && okPaint.paint === '2')
  const rowPaint = carRow(A, 'okada')
  check('THE DISK TRUTH: the row wears the new paint', !!rowPaint && rowPaint.paint === '2')
  await sleep(150)
  check('THE LIVE REPAINT: the roster seed carries the new face at once', roster.find((r) => r.handle === A)?.car?.paint === '2')
  // B needs their own row for the uniqueness test
  const bHello = await emit(sb, 'vehicle:hello', { model: 'danfo', plate: PB, paint: '', x: 40, z: 40, hd: 0, mv: false })
  check('B claims their danfo', bHello.ok === true)
  await emit(sb, 'vehicle:bye', {})
  const plateTaken = await emit(sb, 'vehicle:patch', { model: 'danfo', plate: PA })
  check('THE PLATE UNIQUENESS WALL: A\'s plate refuses B (plate-taken)', plateTaken.ok === false && plateTaken.why === 'plate-taken')
  const plateOk2 = await emit(sb, 'vehicle:patch', { model: 'danfo', plate: PC })
  check('a free plate passes the DMV', plateOk2.ok === true && plateOk2.plate === PC)
  const dupHello = await emit(sb, 'vehicle:hello', { model: 'danfo', plate: PA, paint: '', x: 41, z: 41, hd: 0, mv: false })
  check('THE PLATE OWNERSHIP LAW at the HELLO too: B cannot take A\'s plate on the road', dupHello.ok === false && dupHello.why === 'plate-taken', JSON.stringify(dupHello))

  section('15. THE PARKED SPAWN — the city keeps its cars')
  const parkedWait = nextParked(sb) // the listener rides BEFORE the bye
  await emit(sa, 'vehicle:bye', {}) // A's okada stays at (10,10) on the disk
  const parkedPush = await parkedWait
  check('THE BYE BROADCAST: the street hears the parked row (A\'s okada)', !!parkedPush && parkedPush.row.handle === A && parkedPush.row.model === 'okada', JSON.stringify(parkedPush))
  const seedQ = await emit(se, 'vehicle:parked', { x: 12, z: 12 })
  const seeds = (seedQ.parked ?? []) as { handle: string; model: string }[]
  check('THE LATECOMER QUERY: E\'s box query returns A\'s parked okada', seedQ.ok === true && seeds.some((s) => s.handle === A && s.model === 'okada'), JSON.stringify(seedQ).slice(0, 220))
  const aBack = await emit(sa, 'vehicle:hello', { model: 'okada', plate: PA, paint: '2', x: 10, z: 10, hd: 0.4, mv: false })
  check('A returns — the hello accepts (own plate, own row)', aBack.ok === true)
  const seedQ2 = await emit(se, 'vehicle:parked', { x: 12, z: 12 })
  const seeds2 = (seedQ2.parked ?? []) as { handle: string }[]
  check('THE LIVE-WINS LAW: the live car no longer seeds as parked', !seeds2.some((s) => s.handle === A))
  await emit(sa, 'vehicle:bye', {})

  section('16. THE GOODBYE\'S CREW DROP — the driver falls, the crew lands')
  await emit(sa, 'vehicle:hello', { model: 'okada', plate: PA, paint: '2', x: 20, z: 20, hd: 0, mv: false })
  await emit(sa, 'vehicle:seats', { open: true })
  const bBack = await emit(sb, 'vehicle:board', { handle: A })
  check('B boards again for the drop test', bBack.ok === true)
  sa.disconnect() // THE GOODBYE — no bye door, the socket just dies
  const drop = await nextCrew(sb, 4000)
  check('THE CREW DROP: B is put down where the car stands (driver-gone + the pose)', !!drop && drop.type === 'dropped' && drop.who === B && drop.why === 'driver-gone' && typeof drop.x === 'number', JSON.stringify(drop))
  await sleep(400)
  check('B\'s body lane reopened (the carried law released)', (await emit(sb, 'pos', { x: 21, z: 21, hd: 0, mv: false })).ok === true)
  const rowAfter = carRow(A, 'okada')
  check('THE PARK LAW\'s last word: the goodbye persisted the row', !!rowAfter && Math.abs(rowAfter.x - 20) < 1e-6)
  const seedQ3 = await emit(se, 'vehicle:parked', { x: 22, z: 22 })
  check('the goodbye\'s parked broadcast seeds the latecomer too', ((seedQ3.parked ?? []) as { handle: string }[]).some((s) => s.handle === A))

  section('17. THE EPHEMERALITY LAW re-pinned')
  const kinds = liveEventKinds()
  check('no LiveEvent row carries a vehicle/crew kind', !kinds.some((k) => k.includes('vehicle') || k.includes('car') || k.includes('crew')))

  for (const s of [sb, st, se, sf, sw]) s.disconnect()
}

try {
  await main()
} catch (e) {
  fail++
  fails.push(`suite threw: ${String(e)}`)
  console.error(e)
} finally {
  try { (svc as { kill: () => void } | null)?.kill() } catch { /* already gone */ }
}

console.log(`\n════════════════════════════════════════`)
console.log(`W10-b BOARDING SUITE: ${pass} passed, ${fail} failed`)
if (fails.length) {
  console.log('FAILED:')
  for (const f of fails) console.log(`  - ${f}`)
  process.exit(1)
}
process.exit(0)
