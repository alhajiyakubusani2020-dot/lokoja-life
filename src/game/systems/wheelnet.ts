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
  wireSendCarHello,
  wireSendCarPos,
  wireSendCarBye,
  wireEnsure,
  useWireStore,
  type WireRosterRow,
  type WireCarRow,
} from './wire'
import { useGameStore } from '../store/useGameStore'
import type { VehicleModel } from '../types'

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

/* ─────────────────────── the roster-cadence store (UI only) ─────────────────────── */

interface WheelsState {
  /** how many cars ride my street right now */
  count: number
  /** plates of the cars (roster cadence — never per-frame) */
  plates: string[]
}

export const useWheelsStore = create<WheelsState>(() => ({
  count: 0,
  plates: [],
}))

function mirrorStore() {
  const list = [...cars.values()]
  useWheelsStore.setState({ count: list.length, plates: list.map((c) => c.plate) })
  drivers.clear()
  for (const c of list) drivers.add(c.handle)
}

/* ───────────────────────────── the seed + the lanes ───────────────────────────── */

let myHandle: string | null = null

function seedFromRoster(rows: WireRosterRow[]): void {
  const seen = new Set<string>()
  for (const r of rows) {
    if (!r || typeof r.handle !== 'string' || !r.car) continue
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
      }
      cars.set(r.handle, c)
    } else {
      c.name = r.displayName || c.name
      c.plate = r.car.plate || c.plate
      c.paint = r.car.paint ?? c.paint
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
    c.lastHeard = Date.now()
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

/* ──────────────────────────────── the sender ──────────────────────────────── */

const counters = { hello: 0, sent: 0, park: 0, bye: 0, refused: 0, recv: 0 }
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
  disk: () => WireCarRow | null
  list: () => { handle: string; plate: string; model: string; paint: string }[]
} {
  return {
    cars: cars.size,
    hello: counters.hello,
    sent: counters.sent,
    park: counters.park,
    bye: counters.bye,
    refused: counters.refused,
    recv: counters.recv,
    disk: () => diskReadback,
    list: () => remoteCarList().map((c) => ({ handle: c.handle, plate: c.plate, model: c.model, paint: c.paint })),
  }
}
