/**
 * LOKOJA LIFE — M24 W10-a: THE WHEELS LAW VAULT
 * ==============================================
 * The PURE laws of the shared world's fleet: real claimed citizens drive
 * real cars the whole street can see. Zero React, zero store, zero DOM —
 * the same verdicts run in the browser AND at the wire door (imported
 * VERBATIM — zero copies, zero drift, the W2-W9 doctrine).
 *
 * LAWS OF THIS FILE:
 *  - THE EPHEMERALITY LAW (bodies, carried over): a car's MOVEMENT is a
 *    moment, not a record — the 12Hz delta lane never touches LiveEvent.
 *    What IS durable is THE PARK: the row (model, face, spot, fuel,
 *    odometer) persists on every park, every bye, every disconnect.
 *  - THE CADENCE LAW: 12Hz ONLY-WHILE-MOVING (the plan's bandwidth law —
 *    a parked car is silent on the wire; the street registry holds it).
 *  - THE ADULT-HANDS LAW (M13, server-side): a minor NEVER drives online
 *    — kid or teen, the wheel refuses (minor-wheel). Passengers may ride
 *    shotgun (W10-b); the wheel itself is adult-hands.
 *  - THE GUEST DARKNESS LAW: a guest publishes NO car (no identity, no
 *    wheels — guest-mic-dark, the same law every door speaks).
 *  - THE PLATE LAW: 4–10 chars of [A-Z0-9-] — the generator's own shape
 *    and the custom plate the garage paints, one validator for both.
 *  - THE PAINT LAW: a per-model vocabulary ONLY (the rigs' real tones —
 *    an invented colour never renders; unknown falls to the default).
 *  - THE N12 SPEED LAW: the server CLAMPS every step to the model's TRUE
 *    top speed (the M23-W4 speedometer law, now structural): a tick may
 *    cover at most topSpeed × dt × JITTER (1.5 — network honesty), and a
 *    cheating client's 100-unit leap relays as the lawful distance along
 *    its own heading. The odometer reads ONLY clamped metres — a cheat's
 *    kilometres never enter the books.
 *  - THE CARRIED LAW: while my car is live on the wire, my BODY lane is
 *    silent — the walker is IN the car (the pos door refuses 'carried';
 *    the client's sender pauses itself; the wire is the backstop).
 *  - THE PARK LAW: mv true→false is a park — the row persists once, and
 *    the car stands where it stopped for every latecomer (the roster's
 *    seed carries it; no heartbeat, the wire stays thin).
 *  - THE BLOCK WALL FOR CARS: a blocked pair shares NO car either —
 *    bodyRelayOk's own verdict (the M17 wall covers the driveway).
 *  - THE RANGE LAW: a car catches the eye farther than a walker
 *    (CAR_RANGE 90 vs the bodies' 60) — squared compare, no sqrt.
 */

import { posOk, bodyRelayOk, angleLerp, INTERP_DELAY_MS, MAX_EXTRAP_MS, type PosPayload } from './bodies'
import { VEHICLE_BY_MODEL, type VehicleDef } from '../data/vehicles'
import { LOCATIONS } from '../data/locations'

export { posOk, bodyRelayOk } // the car pos IS a pos (4 finite fields + mv) — one law
export type { PosPayload as CarPosPayload }

/* ─────────────────────────── constants (the cadence law) ─────────────────────── */

/** broadcast cadence while MOVING — the plan's 12–15Hz vehicle law */
export const VEH_HZ = 12
export const VEH_TICK_MS = Math.round(1000 / VEH_HZ)
/** the render range for cars (a car catches the eye farther than a walker) */
export const CAR_RANGE = 90
/** the world bound — the same earth the bodies walk (bodies.ts owns it) */
export const WORLD_BOUND = 330
/** N12 jitter headroom — real roads + real networks round corners */
export const SPEED_JITTER = 1.5
/** a car step smaller than this is a parked engine's shiver, not motion */
export const PARK_EPS = 0.05

/* ─────────────────────────── the face laws (paint + plate) ─────────────────────── */

/** THE PAINT VOCABULARY — the rigs' real tones (world3d/vehicles.ts):
 *  okada's 4 tones, the sedan's 5 variants ('yellow' maps to the taxi
 *  livery), keke/danfo are the honest stock they were born in. */
export const PAINT_VOCAB: Record<string, string[]> = {
  okada: ['0', '1', '2', '3'],
  keke: ['stock'],
  taxi: ['yellow', 'white', 'silver', 'darkblue', 'maroon'],
  danfo: ['stock'],
}

/** THE PLATE LAW — 4–10 chars of A-Z 0-9 and the dash. The generator's
 *  LKO-123-AB fits; the garage's custom plate fits the same wall. */
const PLATE_RE = /^[A-Z0-9-]{4,10}$/

export function plateOk(plate: unknown): plate is string {
  return typeof plate === 'string' && PLATE_RE.test(plate)
}

export function paintOk(model: string, paint: unknown): paint is string {
  if (paint === '' || paint === undefined || paint === null) return true // the default
  const vocab = PAINT_VOCAB[model]
  return !!vocab && typeof paint === 'string' && vocab.includes(paint)
}

/* ─────────────────────────────── the door verdicts ─────────────────────────────── */

export type Band = 'guest' | 'kid' | 'teen' | 'adult'

export interface CarHelloInput {
  band: Band
  model: unknown
  plate: unknown
  paint: unknown
  pos: unknown // the PosPayload the posOk law already understands
}

/**
 * THE HELLO VERDICT — every wall the car door runs, in order, one law:
 * guest dark → minor never drives → real model → real plate → real
 * paint → real pos. The ok carries the validated shape.
 */
export function carHelloVerdict(
  input: CarHelloInput,
): { ok: true; model: string; plate: string; paint: string; pos: PosPayload } | { ok: false; why: string } {
  if (input.band === 'guest') return { ok: false, why: 'guest-mic-dark' }
  if (input.band !== 'adult') return { ok: false, why: 'minor-wheel' } // THE ADULT-HANDS LAW
  const model = input.model
  if (typeof model !== 'string' || !VEHICLE_BY_MODEL[model as keyof typeof VEHICLE_BY_MODEL]) {
    return { ok: false, why: 'bad-model' }
  }
  if (!plateOk(input.plate)) return { ok: false, why: 'bad-plate' }
  if (!paintOk(model as string, input.paint)) return { ok: false, why: 'bad-paint' }
  if (!posOk(input.pos)) return { ok: false, why: 'bad-pos' }
  return {
    ok: true,
    model: model as string,
    plate: input.plate,
    paint: typeof input.paint === 'string' ? input.paint : '',
    pos: input.pos,
  }
}

/**
 * THE CARRIED LAW — while my car is live, my body lane refuses. The pos
 * door runs this as the backstop behind the client's own pause.
 */
export function carriedVerdict(hasLiveCar: boolean): { ok: boolean; why?: string } {
  if (hasLiveCar) return { ok: false, why: 'carried' }
  return { ok: true }
}

/* ───────────────────────── the N12 speed law (the clamp) ──────────────────────── */

/** the model's TRUE top speed in u/s — the data file's own number */
export function topSpeedOf(model: string): number {
  const def = VEHICLE_BY_MODEL[model as keyof typeof VEHICLE_BY_MODEL] as VehicleDef | undefined
  return def ? def.topSpeed : 0
}

export interface CarStep {
  x: number
  z: number
  clamped: boolean
  moved: number // the CLAMPED distance this step covered (the honest odometer)
}

/**
 * THE N12 CLAMP — the heart of the vehicle law. Between the car's last
 * accepted tick and this one, at most topSpeed × dt × JITTER units of
 * road exist. A lawful car never feels it; a cheating client's leap is
 * scaled back along its own direction to the lawful distance. Returns
 * the pos the wire will relay — the server, not the client, decides how
 * far a car moved.
 */
export function clampVehicleStep(
  prev: { x: number; z: number; t: number } | null,
  next: { x: number; z: number },
  model: string,
  nowMs: number,
): CarStep {
  const top = topSpeedOf(model)
  if (!prev || !Number.isFinite(prev.x) || !Number.isFinite(prev.z)) {
    return { x: next.x, z: next.z, clamped: false, moved: 0 }
  }
  const dt = Math.max(1, nowMs - prev.t) / 1000
  const maxDist = Math.max(0, top * dt * SPEED_JITTER)
  const dx = next.x - prev.x
  const dz = next.z - prev.z
  const dist = Math.hypot(dx, dz)
  if (dist <= maxDist || top <= 0) {
    return { x: next.x, z: next.z, clamped: false, moved: dist }
  }
  const k = maxDist / dist // scale the leap down its own direction
  return { x: prev.x + dx * k, z: prev.z + dz * k, clamped: true, moved: maxDist }
}

/* ─────────────── the car interpolation buffer (the render clock) ─────────────── */

export interface CarSnap {
  t: number
  x: number
  z: number
  hd: number
  mv: boolean
}

export interface CarSample {
  x: number
  z: number
  hd: number
  /** u/s measured between the two newest snaps, clamped by the wheels' ceiling */
  speed: number
  /** the NEWEST snap's engine truth — a parked car renders, a mover glides */
  moving: boolean
  alive: boolean
}

/** the wheels' speed ceiling (taxi 11 u/s + drift headroom — the bodies'
 *  buffer clamps at the human sprint, a taxi would lie about its wheels) */
export const CAR_SPEED_MAX = 12

/**
 * THE CAR BUFFER — two snaps and a render clock: the bodies' own
 * interpolation law with the wheels' ceiling and ONE honest difference —
 * a car never goes stale on its own. A parked car's ticks STOP (the
 * only-while-moving law) yet the car must KEEP standing where it stopped;
 * absence is the ROSTER SWEEP's verdict (the driver left), never a
 * clock's. Same INTERP_DELAY, same MAX_EXTRAP, same short-way heading.
 */
export class CarBuffer {
  private a: CarSnap | null = null
  private b: CarSnap | null = null

  push(s: CarSnap): void {
    if (!this.b) {
      this.b = { ...s }
      return
    }
    if (s.t <= this.b.t) return // a late packet never rewinds the clock
    this.a = this.b
    this.b = { ...s }
  }

  seed(s: CarSnap): void {
    if (!this.b || s.t >= this.b.t) {
      this.a = this.b
      this.b = { ...s }
    }
  }

  /** the newest snap — the renderer's parked fallback reads the mv truth */
  newest(): CarSnap | null {
    return this.b ? { ...this.b } : null
  }

  private readonly out: CarSample = { x: 0, z: 0, hd: 0, speed: 0, moving: false, alive: false }

  sample(now: number): CarSample {
    const o = this.out
    if (!this.b) {
      o.alive = false
      return o
    }
    o.moving = this.b.mv
    // the render clock stands INTERP_DELAY behind the newest snap
    const rt = Math.min(now - INTERP_DELAY_MS, this.b.t + MAX_EXTRAP_MS)
    if (!this.a || rt >= this.b.t) {
      o.x = this.b.x
      o.z = this.b.z
      o.hd = this.b.hd
      o.speed = 0
      o.alive = true
      return o
    }
    const span = Math.max(1, this.b.t - this.a.t)
    const k = Math.min(1, Math.max(0, (rt - this.a.t) / span))
    o.x = this.a.x + (this.b.x - this.a.x) * k
    o.z = this.a.z + (this.b.z - this.a.z) * k
    o.hd = angleLerp(this.a.hd, this.b.hd, k)
    const d = Math.hypot(this.b.x - this.a.x, this.b.z - this.a.z)
    o.speed = Math.min(CAR_SPEED_MAX, (d / span) * 1000)
    o.alive = true
    return o
  }
}

/* ─────────────────────────────── the range law ─────────────────────────────── */

/** THE RANGE LAW FOR CARS — squared compare, no sqrt in the frame loop. */
export function carInRenderRange(ax: number, az: number, bx: number, bz: number): boolean {
  const dx = ax - bx
  const dz = az - bz
  return dx * dx + dz * dz <= CAR_RANGE * CAR_RANGE
}

/* ─────────────────────────────── the park law ─────────────────────────────── */

/**
 * THE PARK TRANSITION — mv true→false (or a first tick already still)
 * is a park: the row persists once, the wire goes silent for this car
 * until it moves again. The wire calls this; the suite proves it.
 */
export function isParkTransition(prevMv: boolean | undefined, nextMv: boolean): boolean {
  return nextMv === false && (prevMv === true || prevMv === undefined)
}

/**
 * THE CADENCE SENDER LAW — a mover speaks at 12Hz; a parked car sends
 * NOTHING (the park tick itself already announced the stop; the roster's
 * seed holds the car where it stands; the wire stays thin).
 */
export function carWorthSending(prev: PosPayload | null, next: PosPayload): boolean {
  return next.mv === true || (prev !== null && prev.mv === true) // the park tick rides once
}

/* ─────────────── W10-b: THE BOARDING LAWS (the crew + the DMV) ─────────────── */

/** THE SEAT LAW — the rigs' REAL capacities: an okada carries one
 *  pillion, a keke two, a taxi three, a danfo five. The model decides;
 *  nothing else does. */
export const PASSENGER_SEATS: Record<string, number> = {
  okada: 1,
  keke: 2,
  taxi: 3,
  danfo: 5,
}

export function seatsOf(model: string): number {
  return PASSENGER_SEATS[model] ?? 0
}

export interface BoardInput {
  band: Band
  model: string
  carLive: boolean
  carMv: boolean
  seatsOpen: boolean
  seated: number
  blocked?: boolean
  alreadyAboard: boolean // driving my own car or riding another already
}

/**
 * THE BOARD VERDICT — the plan's own law (N12: "only a stopped and
 * consenting car is boardable"; the hijack law: consent or nothing):
 * the car must be LIVE, the rider must be CLAIMED (a guest rides
 * nothing — guest-dark), the rider must arrive on foot, a blocked pair
 * shares NO car, the driver's seats must be OPEN (the standing consent),
 * the car must be STOPPED, and a seat must be free. Kids AND teens may
 * ride shotgun (the M13 mercy — they just never hold the wheel).
 */
export function boardVerdict(
  input: BoardInput,
): { ok: true; seat: number } | { ok: false; why: string } {
  if (!input.carLive) return { ok: false, why: 'no-car' }
  if (input.band === 'guest') return { ok: false, why: 'guest-dark' }
  if (input.alreadyAboard) return { ok: false, why: 'already-aboard' }
  if (input.blocked) return { ok: false, why: 'blocked' }
  if (!input.seatsOpen) return { ok: false, why: 'seats-shut' }
  if (input.carMv) return { ok: false, why: 'moving' }
  if (input.seated >= seatsOf(input.model)) return { ok: false, why: 'full' }
  return { ok: true, seat: input.seated }
}

/**
 * THE UNBOARD VERDICT — a passenger steps off where the car STANDS. A
 * moving danfo drops nobody (the honest law: jump out at the stop —
 * the same wall the boarding door speaks, mirrored).
 */
export function unboardVerdict(riding: boolean, carMv: boolean): { ok: boolean; why?: string } {
  if (!riding) return { ok: false, why: 'not-riding' }
  if (carMv) return { ok: false, why: 'moving' }
  return { ok: true }
}

/**
 * THE CREW VOICE LAW — the interior is its OWN zone (the plan's W10
 * letter): both mouths must be ADULT (M17: minors never voice — the
 * server doors stay structural), both must be IN the same crew. The
 * crew's key is the driver's handle: the driver owns their crew, every
 * passenger carries the driver's key. While the wheel is live the zone
 * TIGHTENS — the street walkie hears the car, not the whole road.
 */
export function crewVoiceOk(input: {
  meBand: Band
  peerBand: Band
  myCrew: string | null
  peerCrew: string | null
}): boolean {
  if (input.meBand !== 'adult' || input.peerBand !== 'adult') return false
  if (!input.myCrew || !input.peerCrew) return false
  return input.myCrew === input.peerCrew
}

export interface PatchInput {
  band: Band
  model: unknown
  paint?: unknown
  plate?: unknown
}

/**
 * THE DMV VERDICT — the patch door's walls in order: a claimed citizen
 * only (guest-dark), a REAL model, the paint law, the plate law. Plate
 * UNIQUENESS is the server's own eye (the disk query — a pure verdict
 * cannot see the table); the doors run it behind this verdict.
 */
export function patchVerdict(
  input: PatchInput,
): { ok: true; model: string; paint?: string; plate?: string } | { ok: false; why: string } {
  if (input.band === 'guest') return { ok: false, why: 'guest-dark' }
  const model = input.model
  if (typeof model !== 'string' || !VEHICLE_BY_MODEL[model as keyof typeof VEHICLE_BY_MODEL]) {
    return { ok: false, why: 'bad-model' }
  }
  const wantsPaint = input.paint !== undefined && input.paint !== null
  if (wantsPaint && !paintOk(model as string, input.paint)) return { ok: false, why: 'bad-paint' }
  const wantsPlate = input.plate !== undefined && input.plate !== null
  if (wantsPlate && !plateOk(input.plate)) return { ok: false, why: 'bad-plate' }
  return {
    ok: true,
    model: model as string,
    ...(wantsPaint ? { paint: input.paint as string } : {}),
    ...(wantsPlate ? { plate: input.plate as string } : {}),
  }
}

/**
 * THE PLATE OWNERSHIP LAW — the DMV's eye at EVERY door that writes a
 * plate (the hello included): a plate may belong to ONE row. The server
 * reads the disk and hands the owner here; the law stays pure.
 */
export function plateOwnershipOk(
  plate: string,
  handle: string,
  model: string,
  owner: { handle: string; model: string } | null,
): boolean {
  if (!owner) return true // the plate is free
  return owner.handle === handle && owner.model === model // my own row may keep it
}

export interface ParkedSeed {
  handle: string
  model: string
  plate: string
  paint: string
  x: number
  z: number
  hd: number
  odometer: number
  fuel: number
  condition: number
}

/** the parked-spawn list never floods a street (the wire stays thin) */
export const PARKED_SEED_CAP = 24

/**
 * THE PARKED SEED LAW — the disk rows of ABSENT drivers, near a walker:
 * inside the range law's own 90u, deduped against the LIVE roster (a
 * live car wins its own row — the seed only fills absences), nearest
 * first, capped. This is the persistence spawn: the city keeps its
 * parked cars after their drivers go home.
 */
export function parkedSeedsNear(
  rows: ParkedSeed[],
  x: number,
  z: number,
  liveKeys: Set<string>,
): ParkedSeed[] {
  const near = rows
    .filter((r) => Number.isFinite(r.x) && Number.isFinite(r.z))
    .filter((r) => !liveKeys.has(`${r.handle}\u0000${r.model}`))
    .filter((r) => (r.x - x) * (r.x - x) + (r.z - z) * (r.z - z) <= CAR_RANGE * CAR_RANGE)
  near.sort(
    (a, b) =>
      (a.x - x) * (a.x - x) + (a.z - z) * (a.z - z) - ((b.x - x) * (b.x - x) + (b.z - z) * (b.z - z)),
  )
  return near.slice(0, PARKED_SEED_CAP)
}

/* ─────────────── W10-c: THE FUEL LAWS (the pump and the garage) ─────────────── */

/** THE MAP LAW — world3d/layout.ts's own math, replicated PURE so the
 *  WIRE can run it (layout drags three.js; the wire never does). The
 *  suite pins this constant against the real MAP_SCALE — drift is caught. */
const WIRE_MAP_SCALE = 6.2 // (GEO_WORLD_HALF 310 × 2) / 100

function spotOf(locId: string): { x: number; z: number } {
  const l = LOCATIONS.find((L) => L.id === locId)
  if (!l) return { x: 0, z: 0 }
  return { x: (l.mapX - 50) * WIRE_MAP_SCALE, z: (l.mapY - 50) * WIRE_MAP_SCALE }
}

/** THE SERVICE SPOTS — the Motor Park is the city's fuel + service yard
 *  (real practice: the pumps and the mechanics cluster at the park); the
 *  Ganaja junction and Adankolo carry pumps for the other banks. The
 *  garage (repair) is the Motor Park's own mechanic row. */
export const SERVICE_SPOTS: Record<'pump' | 'garage', string[]> = {
  pump: ['transport-area', 'ganaja-junction', 'adankolo'],
  garage: ['transport-area'],
}
export const SERVICE_RADIUS = 26

export function nearServiceSpot(kind: 'pump' | 'garage', x: number, z: number): boolean {
  const spots = SERVICE_SPOTS[kind] ?? []
  return spots.some((id) => {
    const s = spotOf(id)
    return Number.isFinite(x) && Number.isFinite(z) && (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z) <= SERVICE_RADIUS * SERVICE_RADIUS
  })
}

/** THE TANK LAW — a full tank's honest range in world units: the clamp's
 *  metres burn it (a cheat's kilometres never burn fuel — the odometer's
 *  own law carries here). A danfo hauls, an okada sips. */
export const FUEL_RANGE: Record<string, number> = { okada: 2600, keke: 3400, taxi: 5200, danfo: 6800 }
/** THE DRY TANK — at this fraction the engine coughs: the pos door
 *  refuses further motion, the client's throttle dies with it. */
export const DRY_TANK = 0.02

export function fuelAfterBurn(fuel: number, metres: number, model: string): number {
  const range = FUEL_RANGE[model]
  if (!range || metres <= 0) return fuel
  return Math.max(0, fuel - metres / range)
}

/** THE WEAR LAW — the condition wears with the HONEST odometer: a full
 *  life is CONDITION_LIFE metres, then the garage earns its keep. */
export const CONDITION_LIFE = 30_000

export function conditionAfterWear(condition: number, metres: number): number {
  if (metres <= 0) return condition
  return Math.max(0, condition - metres / CONDITION_LIFE)
}

/** THE PUMP PRICE — the honest Nigerian street (post-subsidy, ~₦900/L).
 *  The M8 scarcity surge keeps riding the CLIENT's travel-cost law until
 *  the chaos clock moves server-side (the recorded honest limit). */
export const PETROL_PRICE_PER_LITRE = 900
export const TANK_LITRES: Record<string, number> = { okada: 8, keke: 12, taxi: 45, danfo: 60 }
export const REFUEL_MIN = 200
export const REFUEL_MAX = 20_000

export interface RefuelInput {
  band: Band
  model: string
  fuel: number
  amount: unknown
  atPump: boolean
}

export function refuelVerdict(
  input: RefuelInput,
): { ok: true; amount: number; fuel: number } | { ok: false; why: string } {
  if (input.band === 'guest') return { ok: false, why: 'guest-dark' }
  if (input.band !== 'adult') return { ok: false, why: 'minors-no-money' }
  if (!FUEL_RANGE[input.model]) return { ok: false, why: 'bad-model' }
  if (!input.atPump) return { ok: false, why: 'no-pump' }
  if (input.fuel >= 0.999) return { ok: false, why: 'tank-full' }
  const amount = Math.floor(Number(input.amount))
  if (!Number.isFinite(amount) || amount < REFUEL_MIN) return { ok: false, why: 'too-small' }
  if (amount > REFUEL_MAX) return { ok: false, why: 'too-big' }
  const litres = amount / PETROL_PRICE_PER_LITRE
  const fuel = Math.min(1, input.fuel + litres / (TANK_LITRES[input.model] ?? 40))
  return { ok: true, amount, fuel }
}

/** THE SERVICE BOOK — a full service per model (the mechanic's ladder). */
export const FULL_SERVICE: Record<string, number> = {
  okada: 8_000,
  keke: 14_000,
  taxi: 24_000,
  danfo: 32_000,
}

export function repairQuote(model: string, condition: number): number {
  const full = FULL_SERVICE[model] ?? 20_000
  return Math.max(0, Math.ceil((1 - condition) * full))
}

export interface RepairInput {
  band: Band
  model: string
  condition: number
  atGarage: boolean
}

export function repairVerdict(
  input: RepairInput,
): { ok: true; amount: number; condition: number } | { ok: false; why: string } {
  if (input.band === 'guest') return { ok: false, why: 'guest-dark' }
  if (input.band !== 'adult') return { ok: false, why: 'minors-no-money' }
  if (!FULL_SERVICE[input.model]) return { ok: false, why: 'bad-model' }
  if (!input.atGarage) return { ok: false, why: 'no-garage' }
  if (input.condition >= 0.999) return { ok: false, why: 'no-need' }
  return { ok: true, amount: repairQuote(input.model, input.condition), condition: 1 }
}
