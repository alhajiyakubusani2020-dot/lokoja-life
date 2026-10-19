/**
 * LOKOJA LIFE — M24 W10-a: THE WHEEL NET (the fleet's client engine)
 * ===================================================================
 * The client home of the shared wheels: every claimed same-street
 * driver's car becomes a REAL rig the renderer can stand on the road.
 * Zero React churn — the per-frame truth lives in a module map the 3D
 * layer reads inside useFrame, exactly the W2 doctrine.
 *
 * LAWS OF THIS FILE:
 *  - THE IMPORTED-LAW DOCTRINE: the cadence, the clamp, the park, the
 *    buffer — ALL of it comes from systems/wheels.ts VERBATIM. This
 *    file only WIRING: wire pushes in, ticks out, samples to the frame.
 *  - THE SEED LAW: the roster push carries the car (the face + the last
 *    spot) — a car seen for the first time STANDS where the wire says
 *    before its first wheel tick ever arrives.
 *  - THE SENDER LAW: my wheels speak only when I am SEATED in a car I
 *    own (controls' own drive truth — this file never asks the 3D layer
 *    for anything), only claimed (a guest broadcasts nothing), only
 *    while the wire lives. The engine says hello on ENTER (one hello —
 *    the refused minor never retries), ticks at the 12Hz cadence
 *    ONLY-WHILE-MOVING, says the ONE park tick on the stop, and says
 *    bye the moment the seat empties.
 *  - THE CARRIED COORDINATION: while my car is live, my BODY lane is
 *    silent (remotenet checks isDriveActive() — the walker is in the
 *    car, not walking beside it).
 *  - THE SELF-ECHO LAW: the relay never sends my own car back to me —
 *    but a defensive client drops it anyway.
 *  - THE SWEEP LAW: a roster row whose car vanished is a car gone (the
 *    driver left the world — the rig must not ghost on the road).
 *  - THE WITNESS LAW: __lklWheels exposes the honest counters (hellos,
 *    ticks, parks, byes, refusals, the DISK readback the hello ack
 *    carried) so the E2E witness reads REALITY, not UI.
 */

import { create } from 'zustand'
import { CarBuffer, VEH_TICK_MS, carWorthSending, type CarSnap } from './wheels'
import {
  wireOnCar,
  wireOnCarCrew,
  wireOnParked,
  wireSendCarHello,
  wireSendCarPos,
  wireSendCarBye,
  wireSendVehicleSeats,
  wireSendVehicleBoard,
  wireSendVehicleUnboard,
  wireSendVehicleParkedQuery,
  wireEnsure,
  useWireStore,
  type WireRosterRow,
  type WireCarRow,
  type WireParkedRow,
} from './wire'
import { useGameStore } from '../store/useGameStore'
import type { VehicleModel } from '../types'

export function parkedGhostByKey(key: string): ParkedGhost | null {
  const [handle, model] = key.split('\u0000')
  return (handle && model && parked.get(`${handle}\u0000${model}`)) || null
}

export interface RemoteCar {
  handle: string
  name: string
  model: VehicleModel
  plate: string
  paint: string
  buf: CarBuffer
  /** the wire's DISK truth the hello ack carried (the driver's own copy) */
  disk?: WireCarRow
  lastHeard: number
  /** W10-b — the driver's standing consent (the roster seed + deltas carry it) */
  seatsOpen: boolean
}

/* ───────────────────────── the module truth (per-frame) ───────────────────────── */

const cars = new Map<string, RemoteCar>()

export function remoteCar(handle: string): RemoteCar | null {
  return cars.get(handle) ?? null
}

export function remoteCarCount(): number {
  return cars.size
}

export function remoteCarList(): RemoteCar[] {
  return [...cars.values()]
}

/** THE DRIVER SET — the handles whose walker body must not ghost-walk
 *  (they are IN the car; RemoteWalkers reads this every frame). */
const drivers = new Set<string>()

export function isLiveDriver(handle: string): boolean {
  return drivers.has(handle)
}

/* ───────────────── W10-b: THE PARKED GHOSTS (the persistence spawn) ─────────────────
 * The disk rows of ABSENT drivers the wire seeded near me: the same rigs
 * stand where their drivers left them, until a live roster row wins the
 * (handle, model) key back. Memory-only on the client; the disk is the
 * server's own truth — the same honest split as the park law. */
export interface ParkedGhost {
  handle: string
  model: VehicleModel
  plate: string
  paint: string
  x: number
  z: number
  hd: number
  at: number
}

const parked = new Map<string, ParkedGhost>() // key: handle\u0000model

function parkedKey(handle: string, model: string): string {
  return `${handle}\u0000${model}`
}

export function parkedGhostCount(): number {
  return parked.size
}

export function parkedGhostList(): ParkedGhost[] {
  return [...parked.values()]
}

function ghostFromRow(row: WireParkedRow): ParkedGhost {
  return {
    handle: row.handle,
    model: row.model as VehicleModel,
    plate: row.plate,
    paint: row.paint ?? '',
    x: row.x,
    z: row.z,
    hd: row.hd ?? 0,
    at: Date.now(),
  }
}

/* ─────────────────────── the roster-cadence store (UI only) ─────────────────────── */

interface WheelsState {
  /** how many cars ride my street right now */
  count: number
  /** plates of the cars (roster cadence — never per-frame) */
  plates: string[]
  /** W10-b — keys of the parked ghosts (roster cadence for the renderer) */
  parkedKeys: string[]
}

export const useWheelsStore = create<WheelsState>(() => ({
  count: 0,
  plates: [],
  parkedKeys: [],
}))

function mirrorStore() {
  const list = [...cars.values()]
  useWheelsStore.setState({
    count: list.length,
    plates: list.map((c) => c.plate),
    parkedKeys: parkedGhostList().map((g) => `${g.handle}\u0000${g.model}\u0000${g.plate}\u0000${g.paint}`),
  })
  drivers.clear()
  for (const c of list) drivers.add(c.handle)
}

/* ───────────────────────────── the seed + the lanes ───────────────────────────── */

let myHandle: string | null = null

function seedFromRoster(rows: WireRosterRow[]): void {
  const seen = new Set<string>()
  let myDriverGone = false
  for (const r of rows) {
    if (!r || typeof r.handle !== 'string') continue
    // W10-b — THE RIDE BACKSTOP: my own row carries my ride; a roster
    // where my driver's car vanished means the drive ended upstream.
    if (myHandle && r.handle === myHandle && r.riding && myRide && r.riding.driver !== myRide.driver) {
      myDriverGone = true // the wire moved me — trust the wire, not the memory
    }
    if (!r.car) continue
    if (myHandle && r.handle === myHandle) continue // my own car is MY business
    seen.add(r.handle)
    let c = cars.get(r.handle)
    if (!c) {
      c = {
        handle: r.handle,
        name: r.displayName || r.handle,
        model: r.car.model as VehicleModel,
        plate: r.car.plate,
        paint: r.car.paint ?? '',
        buf: new CarBuffer(),
        lastHeard: Date.now(),
        seatsOpen: r.car.seatsOpen === true,
      }
      cars.set(r.handle, c)
    } else {
      c.name = r.displayName || c.name
      c.plate = r.car.plate || c.plate
      c.paint = r.car.paint ?? c.paint
      c.seatsOpen = r.car.seatsOpen === true
      if (c.model !== r.car.model) {
        c.model = r.car.model as VehicleModel
        c.buf = new CarBuffer() // a different rig — the buffer restarts honestly
      }
    }
    // THE SEED LAW: the roster's moment stands the car before the first tick
    if (
      typeof r.car.x === 'number' &&
      typeof r.car.z === 'number' &&
      Number.isFinite(r.car.x) &&
      Number.isFinite(r.car.z)
    ) {
      c.buf.seed({ t: Date.now(), x: r.car.x, z: r.car.z, hd: typeof r.car.hd === 'number' ? r.car.hd : 0, mv: r.car.mv === true })
    }
  }
  // THE SWEEP LAW: a roster row that lost its car is a car gone
  for (const h of [...cars.keys()]) {
    if (!seen.has(h)) cars.delete(h)
  }
  // W10-b — THE LIVE-WINS LAW: a live roster row erases its own parked
  // ghost (the same car came back to life; the ghost must not double it)
  for (const c of cars.values()) parked.delete(parkedKey(c.handle, c.model))
  if (myDriverGone) endMyRide('wire')
  mirrorStore()
}

let netInited = false

/** THE ONE DOOR IN — idempotent; call from any face effect. */
export function wheelNetInit(): void {
  if (netInited || typeof window === 'undefined') return
  netInited = true

  // the wheel lane: deltas into the buffer (unknown handles wait for the roster)
  wireOnCar((p) => {
    counters.recv++
    if (myHandle && p.h === myHandle) return // THE SELF-ECHO LAW (defensive)
    const c = cars.get(p.h)
    if (!c) return
    c.buf.push({ t: Date.now(), x: p.x, z: p.z, hd: p.hd, mv: p.mv })
    if (typeof p.seatsOpen === 'boolean') c.seatsOpen = p.seatsOpen
    c.lastHeard = Date.now()
  })

  // W10-b — the crew lane: a member boarded, hopped off, or was dropped.
  // MY ride reads its own death here FIRST (the dropped push is instant;
  // the roster backstop follows for everything the push missed).
  wireOnCarCrew((p) => {
    counters.crew++
    crewLast = { type: p.type, driver: p.driver, who: p.who, crew: [...p.crew], at: Date.now() }
    if (myRide && p.type === 'dropped' && p.who === myHandle) {
      endMyRide('dropped')
      return
    }
    if (myRide && p.type === 'unboard' && p.who === myHandle) endMyRide('ack')
  })

  // W10-b — the parked lane: a car left behind stands where it stopped.
  // THE ORDER LAW: the push may land BEFORE the roster sweep frees the
  // (handle, model) key — the ghost is stored ALWAYS and the LIVE-WINS
  // law in seedFromRoster erases it while the car is live, so either
  // order lands on the same truth.
  wireOnParked((p) => {
    counters.parked++
    parked.set(parkedKey(p.row.handle, p.row.model), ghostFromRow(p.row))
    mirrorStore()
  })

  // the roster lane: the wire store is the ONE roster truth — mirror it
  let lastRoster: WireRosterRow[] | null = null
  useWireStore.subscribe((s) => {
    if (s.roster !== lastRoster) {
      lastRoster = s.roster
      seedFromRoster(s.roster)
    }
  })
}

/* ─────────────────── the drive reader (the 3D layer's own truth) ───────────────────
 * THE LAYERING LAW: a system never imports from components — the 3D
 * layer REGISTERS the drive truth on mount (the setPosReader precedent):
 * seated? which rig? how fast? where? The sender reads it every tick;
 * nothing here guesses. */
export interface DriveTruth {
  active: boolean
  model: VehicleModel | null
  speed: number
  x: number
  z: number
  hd: number
}

let driveReader: (() => DriveTruth) | null = null

export function wheelSetDriveReader(fn: () => DriveTruth): void {
  driveReader = fn
}

function driveTruth(): DriveTruth {
  if (driveReader) return driveReader()
  return { active: false, model: null, speed: 0, x: 0, z: 0, hd: 0 }
}

/** the sender's own shared truth — my wheels are live on the wire RIGHT
 *  NOW (remotenet reads this to keep the body lane silent: the walker is
 *  IN the car). Module-level, updated by the sender tick itself. */
let drivingNow = false

export function wheelIsDriving(): boolean {
  return drivingNow
}

/* ───────────── W10-b: THE RIDE (boarding somebody's stopped car) ─────────────
 * While myRide lives: my body lane pauses (the carried law), my rig
 * follows the car through the 3D layer's own teleport seam, and the
 * voice zone tightens to the crew (voicenet reads wheelCrewHandles).
 * The wire's roster + crew pushes are the truth; this state is the
 * client's own mirror of it. */
export interface MyRide {
  driver: string
  model: VehicleModel
  plate: string
  paint: string
  seat: number
}

let myRide: MyRide | null = null
let crewLast: { type: string; driver: string; who: string; crew: string[]; at: number } | null = null

export function wheelIsRiding(): boolean {
  return myRide !== null
}

export function myRideState(): MyRide | null {
  return myRide ? { ...myRide } : null
}

export function wheelCrewLast(): typeof crewLast {
  return crewLast ? { ...crewLast } : null
}

/** THE CREW HANDLES — me + the driver + every other passenger of MY car
 *  (the voicenet zone filter reads this; null = on foot, no filter). */
export function wheelCrewHandles(): string[] | null {
  if (!myRide) return null
  const list = [myRide.driver]
  if (myHandle && !list.includes(myHandle)) list.push(myHandle)
  for (const r of useWireStore.getState().roster) {
    if (r.riding?.driver === myRide.driver && !list.includes(r.handle)) list.push(r.handle)
  }
  return list
}

/** THE CAR SAMPLE — the 3D layer's per-frame read of one remote car
 *  (the passenger follower teleports the body through the buffer). */
export function sampleCar(handle: string): { x: number; z: number; hd: number; moving: boolean } | null {
  const c = cars.get(handle)
  if (!c) return null
  const s = c.buf.sample(Date.now())
  return s.alive ? { x: s.x, z: s.z, hd: s.hd, moving: s.moving } : null
}

/** THE BOARDABLE NEAR — the nearest LIVE car with seats OPEN, stopped,
 *  with a seat free, within arm's reach (the chip's whole truth). */
export function boardableNear(
  x: number,
  z: number,
  radius = 5,
): { handle: string; name: string; model: VehicleModel; plate: string; paint: string; seatsOpen: boolean; seated: number } | null {
  let best: { c: RemoteCar; d: number } | null = null
  for (const c of cars.values()) {
    if (!c.seatsOpen) continue
    const s = c.buf.sample(Date.now())
    if (!s.alive || s.moving) continue
    const d = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z)
    if (d > radius * radius) continue
    if (!best || d < best.d) best = { c, d }
  }
  if (!best) return null
  const rosterSeated = useWireStore
    .getState()
    .roster.filter((r) => r.riding?.driver === best!.c.handle).length
  return {
    handle: best.c.handle,
    name: best.c.name,
    model: best.c.model,
    plate: best.c.plate,
    paint: best.c.paint,
    seatsOpen: best.c.seatsOpen,
    seated: rosterSeated,
  }
}

function endMyRide(why: 'ack' | 'dropped' | 'wire'): void {
  if (!myRide) return
  myRide = null
  counters.unboard++
  rideEndWhy = why
}

let rideEndWhy: string | null = null
export function myRideEndWhy(): string | null {
  return rideEndWhy
}

/** THE BOARD GESTURE — ask the wire to ride a driver's stopped car. The
 *  ack carries the seat + the pose; the 3D layer's follower takes over
 *  the very next frame (the same seam the E2E teleport speaks). */
export async function wheelRequestBoard(driver: string): Promise<{ ok: boolean; why?: string }> {
  if (drivingNow) return { ok: false, why: 'already-aboard' }
  if (myRide) return { ok: false, why: 'already-aboard' }
  const r = await wireSendVehicleBoard(driver).catch(() => ({ ok: false, why: 'wire-down' }) as const)
  if (!r.ok || !r.car) return { ok: false, why: ('why' in r && r.why) || 'no-car' }
  myRide = {
    driver,
    model: r.car.model as VehicleModel,
    plate: r.car.plate,
    paint: r.car.paint ?? '',
    seat: typeof r.seat === 'number' ? r.seat : 0,
  }
  rideEndWhy = null
  counters.board++
  return { ok: true }
}

/** THE HOP-OFF GESTURE — the wire drops me where the car stands; the
 *  ack's pose is the body's next teleport. */
export async function wheelRequestUnboard(): Promise<{ ok: boolean; why?: string; x?: number; z?: number; hd?: number }> {
  if (!myRide) return { ok: false, why: 'not-riding' }
  const r = await wireSendVehicleUnboard().catch(() => ({ ok: false, why: 'wire-down' }) as const)
  if (!r.ok) return { ok: false, why: ('why' in r && r.why) || 'not-riding' }
  const pose = { x: r.x, z: r.z, hd: r.hd }
  endMyRide('ack')
  return { ok: true, ...pose }
}

/** THE SEATS TOGGLE (driver's own hand) — the ack's truth is the state. */
export async function wheelRequestSeats(open: boolean): Promise<boolean> {
  const r = await wireSendVehicleSeats(open).catch(() => ({ ok: false }) as const)
  return r.ok === true
}

/** THE PARKED QUERY — the world's own one-beat ask: what parked cars
 *  does the disk keep near me? (RemoteVehicles calls it on mount; the
 *  wire:parked broadcast lane keeps the map warm after it.) */
export async function wheelQueryParked(x: number, z: number): Promise<number> {
  const r = await wireSendVehicleParkedQuery(x, z).catch(() => ({ ok: false }) as const)
  if (!r.ok) return 0
  for (const row of r.parked ?? []) {
    const key = parkedKey(row.handle, row.model)
    if (!cars.has(row.handle)) parked.set(key, ghostFromRow(row))
  }
  mirrorStore()
  return parked.size
}

let parkedQueryRan = false

/** THE MOUNT QUERY, LANDED — the world's one-beat ask must ride a LIVE
 *  wire (a query fired before the handshake is a wasted beat): wait for
 *  the wire's own state, then ask ONCE per world mount. */
export async function wheelQueryParkedWhenLive(x: number, z: number): Promise<number> {
  if (parkedQueryRan) return parked.size
  for (let i = 0; i < 24; i++) {
    if (useWireStore.getState().state === 'live') {
      parkedQueryRan = true
      return wheelQueryParked(x, z)
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  return 0
}

export function wheelResetParkedQuery(): void {
  parkedQueryRan = false
}

/* ──────────────────────────────── the sender ──────────────────────────────── */

const counters = { hello: 0, sent: 0, park: 0, bye: 0, refused: 0, recv: 0, board: 0, unboard: 0, crew: 0, parked: 0 }
let diskReadback: WireCarRow | null = null

let sendTimer: ReturnType<typeof setInterval> | null = null
let carLive: { model: VehicleModel; plate: string; paint: string } | null = null
let lastTick: CarSnap | null = null
let helloInFlight = false
let helloSentAt = 0
let refusedFor: VehicleModel | null = null

/**
 * bracket the 3D mount: my wheels speak only while I stand in the world.
 * THE WORLD-ENTRY LAW rides from the bodies — standing in the world
 * ENSURES the wire (idempotent like every face's own ensure).
 */
export function wheelStartSending(): void {
  wheelNetInit()
  myHandle = useGameStore.getState().account.handle ?? null
  wireEnsure(
    () => useGameStore.getState().account.token ?? null,
    () => ({ street: useGameStore.getState().world?.currentLocation ?? 'home', status: 'hustling' }),
  )
  if (sendTimer || typeof window === 'undefined') return
  carLive = null
  lastTick = null
  helloInFlight = false
  helloSentAt = 0
  refusedFor = null
  sendTimer = setInterval(() => {
    if (sendTimer === null) return // stopped mid-flight (defensive)
    const { token } = useGameStore.getState().account
    const w = useWireStore.getState().state
    if (!token || w !== 'live') {
      drivingNow = false
      return // THE SENDER LAW: claimed + live only
    }
    const t = driveTruth()
    if (t.active && t.model) {
      drivingNow = true
      // the drive truth is the 3D layer's own — the car's moment
      const mv = t.speed > 0.15
      if (!carLive) {
        if (refusedFor === t.model) return // THE MINOR'S HONEST SILENCE — one refusal, no spam
        // THE HELLO TIMEOUT LAW: a lost ack can never wedge the sender —
        // if the door's answer hasn't landed in 4s, the hello re-fires
        // (the door is idempotent: the same hello twice = the same car)
        if (helloInFlight) {
          if (Date.now() - helloSentAt > 4_000) helloInFlight = false
          else return
        }
        const veh = useGameStore.getState().player?.vehicles.find((v) => v.model === t.model)
        if (!veh) return // a seat in a car I don't own is not my seat (defensive)
        carLive = { model: t.model, plate: veh.plate, paint: veh.paint ?? '' }
        lastTick = null
        helloInFlight = true
        helloSentAt = Date.now()
        counters.hello++
        wireSendCarHello({ model: t.model, plate: veh.plate, paint: veh.paint ?? '', x: t.x, z: t.z, hd: t.hd, mv })
          .then((r) => {
            helloInFlight = false
            if (!r.ok) {
              carLive = null
              refusedFor = t.model
              counters.refused++
              // W10-b — the DMV speaks: a plate another citizen owns never
              // takes the road (the store's own laws keep the local save
              // lawful; the wire's disk is the court of final appeal).
              if (r.why === 'plate-taken') {
                useGameStore.getState().notify({
                  icon: '🚫',
                  text: 'DMV: that plate don belong to another motor — change am for garage.',
                  tone: 'bad',
                })
              }
              return
            }
            // THE READBACK LAW: the door answered with the DISK truth
            if (r.car) diskReadback = r.car
          })
          .catch(() => {
            helloInFlight = false
          })
        return
      }
      if (carLive.model !== t.model) return // a mid-drive switch settles next tick
      const next: CarSnap = { t: Date.now(), x: t.x, z: t.z, hd: t.hd, mv }
      if (carWorthSending(lastTick, next)) {
        wireSendCarPos({ x: next.x, z: next.z, hd: next.hd, mv: next.mv })
        counters.sent++
        if (!next.mv) counters.park++ // the ONE park tick
        lastTick = next
      }
    } else {
      drivingNow = false
      if (carLive) {
        // THE BYE — the seat emptied: the engine dies with my hand
        wireSendCarBye()
        carLive = null
        lastTick = null
        refusedFor = null
        counters.bye++
      }
    }
  }, VEH_TICK_MS)
}

export function wheelStopSending(): void {
  if (sendTimer) clearInterval(sendTimer)
  sendTimer = null
  // a bracket that ends while seated still says goodbye (the honest exit)
  if (carLive) {
    wireSendCarBye()
    carLive = null
    lastTick = null
    refusedFor = null
    counters.bye++
  }
}

/* ──────────────────────────────── the witness ──────────────────────────────── */

/** the E2E witness — REALITY, not UI: the cars the net truly holds */
export function wheelsWitness(): {
  cars: number
  hello: number
  sent: number
  park: number
  bye: number
  refused: number
  recv: number
  board: number
  unboard: number
  crew: number
  parked: number
  ride: () => MyRide | null
  riding: () => boolean
  crewHandles: () => string[] | null
  crewLast: () => { type: string; driver: string; who: string; crew: string[]; at: number } | null
  parkedGhosts: () => { handle: string; model: string; plate: string; x: number; z: number }[]
  disk: () => WireCarRow | null
  list: () => { handle: string; plate: string; model: string; paint: string; seatsOpen: boolean }[]
} {
  return {
    cars: cars.size,
    hello: counters.hello,
    sent: counters.sent,
    park: counters.park,
    bye: counters.bye,
    refused: counters.refused,
    recv: counters.recv,
    board: counters.board,
    unboard: counters.unboard,
    crew: counters.crew,
    parked: counters.parked,
    ride: () => myRideState(),
    riding: () => myRide !== null,
    crewHandles: () => wheelCrewHandles(),
    crewLast: () => wheelCrewLast(),
    parkedGhosts: () => parkedGhostList().map((g) => ({ handle: g.handle, model: g.model, plate: g.plate, x: g.x, z: g.z })),
    disk: () => diskReadback,
    list: () => remoteCarList().map((c) => ({ handle: c.handle, plate: c.plate, model: c.model, paint: c.paint, seatsOpen: c.seatsOpen })),
  }
}
