'use client'

/**
 * LOKOJA LIFE — DriveSystem (Stage 5-a)
 * --------------------------------------
 * "You own and DRIVE vehicles in the 3D world." This component owns the
 * player's OWN rides (distinct from the ambient Traffic fleet):
 *
 *  - spawn: the last-driven owned vehicle materialises parked at a
 *    road-adjacent spot near the player on world entry ("where you left
 *    it" within a visit — the spot is re-found if you re-enter far away)
 *  - enter: walk-up prompt (HUD) or the garage Drive button requests it
 *    through controls.ts; drive mode freezes the walking controller and
 *    hides the player rig via the seat protocol (see controls.ts)
 *  - drive: throttle/brake/steer from the SAME joystick + WASD axes,
 *    VehicleDef top speed / accel / handling, 0.45× on grass, building +
 *    river collision through the EXISTING resolver (fast hits kill 60%
 *    of speed), wheel spin, corner lean (okada leans IN), bridge decks,
 *    night headlight pool — all presentation-only
 *  - camera: smoothed chase cam with speed FOV pull and the same
 *    obstruction/terrain safety the walk camera uses
 *  - park: vehicle stays where you left it; metres driven are settled
 *    through store.settleDrive — the only money/time authority
 *
 * No economy logic lives here. Module-level state is deliberately small
 * (one parked-spot map + rig cache) and survives interior swaps.
 */

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { TimeOfDay, VehicleModel } from '@/game/types'
import { VEHICLE_BY_MODEL } from '@/game/data/vehicles'
import {
  buildPlayerRig, findPlayerVehicleSpot, headlightConeMaterial, type SpawnSpot, type VehicleRig,
} from '@/game/world3d/vehicles'
import { heightAt, roadDistance } from '@/game/world3d/layout'
import { bumpHeightAt, BUMP_AMPLITUDE } from '@/game/world3d/junctions' // W3 — the school humps
import { bridgeDeckY, cameraObstructionT, resolvePosition } from '@/game/world3d/collision'
import { useGameStore } from '@/game/store/useGameStore'
import {
  addDriveMeters, consumeEnterRequest, consumeParkRequest, freezeInput, getDriveMeters, isDriveActive,
  reportDriveSpeed, reportNearVehicle, reportPlayerPos, playerPos, readMoveInput, resetDriveMeters,
  requestE2eTeleport, setDriveActive, setDriveSeat,
} from './controls'
import { myRideState, sampleCar } from '@/game/systems/wheelnet' // W10-b — the passenger seat

/* ------------------------------- feel constants ------------------------------- */

const ENTER_RADIUS = 4.6 // walk-up "Enter {label}" range
const ON_ROAD_DIST = 4.6 // within this of a road centreline = tarmac
const GRASS_CAP = 0.45 // grass multiplies top speed (mud drag)
const REVERSE_MAX = 2.6 // careful reverse gear for dead ends
const IMPACT_SPEED = 4.2 // hits above this kill 60% of speed
const RESPAWN_FAR = 60 // parked farther than this from you → re-spot nearby
const CHASE_DIST = 7.4
const CHASE_HEIGHT = 3.05
const FOV_BASE = 55

/* W10-b — the passenger seat hangs ON the rig (the honest danfo ride):
 * seat 0 left, seat 1 right, seat 2 back — and the reach per model (the
 * okada's pillion rides BEHIND the rider, the cars take the running board). */
const SEAT_SIDE = ['left', 'right', 'back'] as const
const SEAT_DIST: Record<string, number> = { okada: 1.15, keke: 1.2, taxi: 1.4, danfo: 1.65 }

/** react-hooks/immutability guards hook values from stray writes — animating
 *  the canvas camera's fov goes through this sanctioned module helper */
function applyFov(cam: THREE.PerspectiveCamera, fov: number): void {
  cam.fov = fov
  cam.updateProjectionMatrix()
}

/** per-family presentation tuning (mirrors the Traffic feel table) */
const WHEEL_R: Record<VehicleModel, number> = { okada: 0.33, keke: 0.34, taxi: 0.34, danfo: 0.38 }
/**
 * W3 — THE ACKERMANN GEOMETRY: wheelbase L and track width w per model
 * (measured off the rigs: danfo axles ±1.35 track ±0.86, sedan ±1.28/±0.8).
 * The inner/outer front-wheel angles follow the real law
 *   cot(δo) − cot(δi) = w/L
 * via δ = atan(L / (R ∓ w/2)) — algebraically exact for the turn radius R.
 */
const ACKERMANN: Record<VehicleModel, { L: number; w: number }> = {
  okada: { L: 1.35, w: 0 },
  keke: { L: 1.55, w: 0 },
  taxi: { L: 2.56, w: 1.6 },
  danfo: { L: 2.7, w: 1.72 },
}
const ROLL_GAIN: Record<VehicleModel, number> = { okada: 3.4, keke: 0.55, taxi: 0.24, danfo: 0.15 }
const MAX_ROLL: Record<VehicleModel, number> = { okada: 0.4, keke: 0.09, taxi: 0.05, danfo: 0.04 }
const LEAN_SIGN: Record<VehicleModel, number> = { okada: -1, keke: 1, taxi: 1, danfo: 1 }

/* --------------------------- module-level session state ------------------------ */

/** where each owned model is parked right now (survives interior swaps) */
const PARKED_SPOTS = new Map<VehicleModel, SpawnSpot>()
/** rig cache — one shared rig per model, built lazily like the traffic fleet */
const RIG_CACHE = new Map<VehicleModel, VehicleRig>()
let lastDriven: VehicleModel | null = null

/* ------------------------------ engine hum (synth) ----------------------------- */

/** tiny two-knob engine voice — diegetic speed feel, zero assets. Fails silent. */
class DriveHum {
  private ctx: AudioContext | null = null
  private osc: OscillatorNode | null = null
  private gain: GainNode | null = null
  private enabled = true

  setEnabled(on: boolean) {
    this.enabled = on
    if (this.gain && this.ctx) {
      this.gain.gain.setTargetAtTime(on ? 0.02 : 0, this.ctx.currentTime, 0.05)
    }
  }

  start() {
    if (this.ctx) return
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      const ctx = new Ctor()
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = 58
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 340
      const gain = ctx.createGain()
      gain.gain.value = 0
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      void ctx.resume()
      this.ctx = ctx
      this.osc = osc
      this.gain = gain
    } catch {
      /* audio is best-effort; never break driving for it */
    }
  }

  update(speedNorm: number) {
    if (!this.ctx || !this.osc || !this.gain) return
    const t = this.ctx.currentTime
    this.osc.frequency.setTargetAtTime(56 + speedNorm * 108, t, 0.08)
    this.gain.gain.setTargetAtTime(this.enabled ? 0.014 + speedNorm * 0.05 : 0, t, 0.1)
  }

  stop() {
    const ctx = this.ctx
    try {
      if (this.gain && ctx) this.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.04)
    } catch {
      /* ignore */
    }
    this.ctx = null
    this.osc = null
    this.gain = null
    if (ctx) {
      setTimeout(() => {
        try {
          void ctx.close()
        } catch {
          /* ignore */
        }
      }, 160)
    }
  }
}

/* ------------------------------- player-rig find ------------------------------- */

/**
 * Locate the walking player's root group WITHOUT touching Actors.tsx:
 * its BlobShadow is a 12-segment circle of radius 0.6 (scale 1.2) — the
 * only blob in town with exactly those parameters. Used to hide the rig
 * while driving (seat protocol, see controls.ts).
 */
function findPlayerRigGroup(scene: THREE.Scene): THREE.Object3D | null {
  let found: THREE.Object3D | null = null
  scene.traverse((o) => {
    if (found) return
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const g = mesh.geometry
    if (g instanceof THREE.CircleGeometry) {
      const p = g.parameters
      if (Math.abs(p.radius - 0.6) < 0.005 && p.segments === 12) {
        let top: THREE.Object3D = o
        while (top.parent && top.parent !== scene) top = top.parent
        found = top
      }
    }
  })
  return found
}

/* --------------------------------- the system ---------------------------------- */

export function DriveSystem({
  timeOfDay,
  followRef,
}: {
  timeOfDay: TimeOfDay
  /** WorldScene's shadow-frustum target — follows the car while driving */
  followRef: React.MutableRefObject<THREE.Vector3>
}) {
  const night = timeOfDay === 'night'
  const { camera: r3fCam, scene } = useThree()
  // the canvas mounts a perspective camera (fov 55) — DriveSystem animates its fov
  const camera = r3fCam as THREE.PerspectiveCamera
  const soundOn = useGameStore((s) => s.settings?.sound ?? true)

  /** React only needs to know WHICH rig is mounted; physics lives in refs */
  const [mounted, setMounted] = useState<{ model: VehicleModel; rig: VehicleRig } | null>(null)

  const drive = useRef({
    active: false,
    model: null as VehicleModel | null,
    x: 0,
    z: 0,
    yaw: 0,
    speed: 0,
    camYaw: 0,
    fov: FOV_BASE,
  })
  const playerRigRef = useRef<THREE.Object3D | null>(null)
  const enterVehicleRef = useRef<(model: VehicleModel) => void>(null)
  const parkVehicleRef = useRef<() => void>(null)
  const frameRef = useRef(0)
  const spawnedThisVisit = useRef(false)
  // W10-b — the passenger seat: whose car I follow + where it last stood
  const rideRef = useRef<string | null>(null)
  const rideLastSample = useRef<{ x: number; z: number; hd: number } | null>(null)
  const humRef = useRef<DriveHum | null>(null)
  const soundRef = useRef(soundOn)
  const scratch = useRef({
    desired: new THREE.Vector3(),
    from: new THREE.Vector3(),
  })

  useEffect(() => {
    soundRef.current = soundOn
    humRef.current?.setEnabled(soundOn)
  }, [soundOn])

  /* ------------------------------ helpers (stable) ------------------------------ */

  const ensureRig = (model: VehicleModel): VehicleRig => {
    let rig = RIG_CACHE.get(model)
    if (!rig) {
      rig = buildPlayerRig(model)
      // ground-contact blob shadow (same read as the traffic fleet's)
      const blob = new THREE.Mesh(
        new THREE.CircleGeometry(0.95, 14),
        new THREE.MeshBasicMaterial({ color: '#1a2016', transparent: true, opacity: 0.26, depthWrite: false }),
      )
      blob.rotation.x = -Math.PI / 2
      blob.position.y = 0.04
      rig.group.add(blob)
      // night-only fake headlight pool, riding the rig like Traffic's
      const coneGeo = new THREE.PlaneGeometry(2.5, 5.6)
      coneGeo.translate(0, 2.8, 0)
      const cone = new THREE.Mesh(coneGeo, headlightConeMaterial())
      cone.rotation.x = Math.PI / 2
      cone.position.set(0, 0.06, 1.6)
      cone.visible = false
      cone.name = 'driveCone'
      rig.group.add(cone)
      RIG_CACHE.set(model, rig)
    }
    const cone = rig.group.getObjectByName('driveCone')
    if (cone) cone.visible = night
    return rig
  }

  /** parked spot for a model — reuses "where you left it", re-spots if absurdly far */
  const ensureParked = (model: VehicleModel): SpawnSpot => {
    const existing = PARKED_SPOTS.get(model)
    if (existing && Math.hypot(existing.x - playerPos.x, existing.z - playerPos.z) <= RESPAWN_FAR) {
      return existing
    }
    const spot = findPlayerVehicleSpot(playerPos.x, playerPos.z, playerPos.heading)
    PARKED_SPOTS.set(model, spot)
    return spot
  }

  const applySeatHide = (hide: boolean) => {
    const g = playerRigRef.current
    if (g) g.visible = !hide
  }

  const enterVehicle = (model: VehicleModel) => {
    const st = useGameStore.getState()
    if (!st.player || drive.current.active) return
    if (!st.player.vehicles.some((v) => v.model === model)) return
    const def = VEHICLE_BY_MODEL[model]
    if (!def) return

    const spot = ensureParked(model)
    const rig = ensureRig(model)
    const groundY = bridgeDeckY(spot.x, spot.z) ?? heightAt(spot.x, spot.z)
    rig.group.position.set(spot.x, groundY, spot.z)
    rig.group.rotation.y = spot.rotY

    const d = drive.current
    d.active = true
    d.model = model
    d.x = spot.x
    d.z = spot.z
    d.yaw = spot.rotY
    d.speed = 0
    d.camYaw = spot.rotY
    lastDriven = model

    setMounted({ model, rig })
    setDriveActive(true, model)
    resetDriveMeters()
    reportDriveSpeed(0)
    reportNearVehicle(null)

    // hide the walking rig while the built-in driver silhouette takes over
    playerRigRef.current = findPlayerRigGroup(scene)
    applySeatHide(true)

    // hard cut: chase cam snaps behind the vehicle, then smooths from there
    const { desired } = scratch.current
    desired.set(
      d.x - Math.sin(d.camYaw) * CHASE_DIST,
      groundY + CHASE_HEIGHT,
      d.z - Math.cos(d.camYaw) * CHASE_DIST,
    )
    const camGround = heightAt(desired.x, desired.z) + 1.15
    if (desired.y < camGround) desired.y = camGround
    camera.position.copy(desired)
    camera.lookAt(d.x + Math.sin(d.yaw) * 2.2, groundY + 1.55, d.z + Math.cos(d.yaw) * 2.2)

    if (!humRef.current) humRef.current = new DriveHum()
    humRef.current.setEnabled(soundRef.current)
    humRef.current.start()
  }

  const parkVehicle = () => {
    if (!drive.current.active) return
    const model = drive.current.model
    const st = useGameStore.getState()
    // the ONLY money/time touch: metres driven settle through the store action
    st.settleDrive(getDriveMeters())
    resetDriveMeters()

    drive.current.active = false
    drive.current.speed = 0
    drive.current.fov = FOV_BASE
    applyFov(camera, FOV_BASE)
    setDriveActive(false)
    applySeatHide(false)
    playerRigRef.current = null
    reportDriveSpeed(0)
    if (model) {
      lastDriven = model
      reportNearVehicle(model) // parked right by you — the prompt may re-offer it
    }
    humRef.current?.stop()
  }

  /* --------------------------------- lifecycle ---------------------------------- */

  // leaving the scene mid-drive (world exit / crash boundary) still settles
  useEffect(() => {
    return () => {
      if (isDriveActive()) {
        useGameStore.getState().settleDrive(getDriveMeters())
        resetDriveMeters()
        setDriveActive(false)
        playerRigRef.current = null
        humRef.current?.stop()
      }
    }
  }, [])

  // dev/E2E bridge (stripped from production builds)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    ;(window as unknown as Record<string, unknown>).__lkoDrive = {
      enter: (model: VehicleModel) => enterVehicleRef.current?.(model),
      exit: () => parkVehicleRef.current?.(),
      pos: () => ({ x: drive.current.x, z: drive.current.z, speed: drive.current.speed, model: drive.current.model }),
      owned: () => useGameStore.getState().player?.vehicles.map((v) => v.model) ?? [],
      parked: () => Object.fromEntries([...PARKED_SPOTS.entries()]),
      // E2E only: test funds go through the REAL store action (never direct mutation)
      grantTestFunds: () => {
        useGameStore.getState().addCash(500_000)
        return useGameStore.getState().player?.cash ?? 0
      },
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__lkoDrive
    }
  }, [])

  // keep the latest enter/park handlers reachable from the (stable) bridge
  useEffect(() => {
    enterVehicleRef.current = enterVehicle
    parkVehicleRef.current = parkVehicle
  })

  // dusk/dawn while mounted — flip the rig's headlight pool with the sky
  useEffect(() => {
    const cone = mounted?.rig.group.getObjectByName('driveCone')
    if (cone) cone.visible = night
  }, [night, mounted])

  /* --------------------------------- frame loop --------------------------------- */

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const d = drive.current
    frameRef.current++

    // HUD requests (garage Drive / Enter chip / Park button / stop+E)
    const wantEnter = consumeEnterRequest()
    if (wantEnter && !d.active) enterVehicle(wantEnter)
    if (consumeParkRequest() && d.active) parkVehicle()

    /* ---- W10-b — THE PASSENGER SEAT: riding somebody's stopped car ----
     * While myRide lives, the walker controller is FROZEN and the body
     * teleports each frame to the car's own buffer sample (the E2E
     * teleport seam — the controller keeps its truth, we just aim it).
     * The seat hangs ON the rig: okada behind the rider, keke/taxi/danfo
     * on the running board — the honest danfo ride, visible, no ghost
     * beside the car. The body lane is silent (the carried law); on
     * unboard/drop the body steps off where the car STANDS. */
    const ride = myRideState()
    if (ride && !d.active) {
      if (!rideRef.current) {
        rideRef.current = ride.driver
        freezeInput(true)
      }
      const s = sampleCar(ride.driver)
      if (s) {
        rideLastSample.current = { x: s.x, z: s.z, hd: s.hd }
        const side = SEAT_SIDE[ride.seat % 3] ?? 'left'
        const dist = SEAT_DIST[ride.model] ?? 1.3
        const sin = Math.sin(s.hd)
        const cos = Math.cos(s.hd)
        // heading 0 faces +z; left = +cos/-sin, right = −cos/+sin, back = −forward
        const ox = side === 'left' ? cos * dist : side === 'right' ? -cos * dist : -sin * dist
        const oz = side === 'left' ? -sin * dist : side === 'right' ? sin * dist : -cos * dist
        requestE2eTeleport(s.x + ox, s.z + oz)
      }
    } else if (rideRef.current && !ride) {
      // the ride ended (my hop-off ack, the crew drop, or the wire's own
      // roster backstop): the input unfreezes and the body lands where
      // the car last stood — never inside its geometry, never at (0,0)
      rideRef.current = null
      freezeInput(false)
      const last = rideLastSample.current
      if (last) requestE2eTeleport(last.x + 1.2, last.z + 1.2)
      rideLastSample.current = null
    }

    // world entry: once the walking controller has reported a real position,
    // the last-driven ride waits parked by the roadside nearby
    if (frameRef.current >= 3 && !spawnedThisVisit.current) {
      spawnedThisVisit.current = true
      const vehicles = useGameStore.getState().player?.vehicles ?? []
      if (vehicles.length > 0) {
        const model =
          lastDriven && vehicles.some((v) => v.model === lastDriven)
            ? lastDriven
            : vehicles[vehicles.length - 1].model
        const spot = ensureParked(model)
        const rig = ensureRig(model)
        rig.group.position.set(spot.x, bridgeDeckY(spot.x, spot.z) ?? heightAt(spot.x, spot.z), spot.z)
        rig.group.rotation.y = spot.rotY
        setMounted({ model, rig })
      }
    }

    if (d.active && d.model) {
      const def = VEHICLE_BY_MODEL[d.model]
      const rig = RIG_CACHE.get(d.model)
      if (!def || !rig) return

      // ---- input: same axes as walking (joystick wins, then WASD) ----
      const input = readMoveInput()
      const throttle = input.y
      const steer = input.x

      // ---- longitudinal: accel → top speed, grass cap, brake/reverse ----
      const onRoad = roadDistance(d.x, d.z) < ON_ROAD_DIST
      const cap = def.topSpeed * (onRoad ? 1 : GRASS_CAP)
      if (throttle > 0.02) {
        d.speed += def.accel * throttle * dt
      } else if (throttle < -0.02) {
        if (d.speed > 0.25) d.speed -= def.accel * 2.1 * dt // brake
        else d.speed = Math.max(d.speed - def.accel * 0.55 * dt, -REVERSE_MAX) // reverse creep
      } else {
        const drag = def.accel * 0.42 * dt // engine braking + rolling drag
        d.speed = Math.abs(d.speed) <= drag ? 0 : d.speed - Math.sign(d.speed) * drag
      }
      if (d.speed > cap) d.speed += (cap - d.speed) * Math.min(1, dt * 2.6)
      d.speed = THREE.MathUtils.clamp(d.speed, -REVERSE_MAX, def.topSpeed)

      // ---- steering: authority grows with roll speed, fades at the top end ----
      const speedNorm = THREE.MathUtils.clamp(Math.abs(d.speed) / def.topSpeed, 0, 1)
      const steerAuth = Math.min(1, Math.abs(d.speed) / 2.0) * (1 - 0.42 * speedNorm)
      const turnRate = steer * 1.55 * def.handling * steerAuth * (d.speed < -0.05 ? -1 : 1)
      d.yaw += turnRate * dt

      // ---- W3 THE ACKERMANN LAW — the front wheels get their REAL angles:
      // the turn radius R = |speed / yawRate|, then δi = atan(L/(R − w/2))
      // and δo = atan(L/(R + w/2)) — cot(δo) − cot(δi) = w/L exactly. Zero
      // allocations; a few trig calls per frame on a driven rig only.
      const dims = ACKERMANN[d.model]
      const yawRate = turnRate
      const turnR = Math.abs(yawRate) > 1e-4 ? Math.abs(d.speed / yawRate) : Infinity
      const sTurn = yawRate >= 0 ? 1 : -1 // yaw+ = a left turn → left wheel inner
      if (rig.frontWheels.length >= 2) {
        const Ri = Math.max(0.55, turnR - dims.w / 2)
        const Ro = Math.max(0.55, turnR + dims.w / 2)
        const dInner = Math.atan(dims.L / Ri)
        const dOuter = Math.atan(dims.L / Ro)
        // frontWheels build order: [left (−x), right (+x)]
        rig.frontWheels[0].rotation.y = sTurn * dInner
        rig.frontWheels[1].rotation.y = sTurn * dOuter
      }
      if (rig.steer) {
        // the fork vehicles (okada/keke) steer the whole fork by the
        // bicycle-model angle δ = atan(L / R)
        const dFork = Math.atan(dims.L / Math.max(0.55, turnR))
        rig.steer.rotation.y = THREE.MathUtils.clamp(sTurn * dFork, -0.55, 0.55)
      }

      // ---- integrate + reuse the building/river/rim resolver ----
      const fx = Math.sin(d.yaw)
      const fz = Math.cos(d.yaw)
      const rawX = d.x + fx * d.speed * dt
      const rawZ = d.z + fz * d.speed * dt
      const [rx, rz] = resolvePosition(rawX, rawZ)
      const shoved = Math.hypot(rx - rawX, rz - rawZ)
      if (shoved > 0.02) {
        // wall/scrape contact — a fast hit kills 60% of the speed
        if (Math.abs(d.speed) > IMPACT_SPEED) d.speed *= 0.4
        else d.speed *= 0.9
      }
      d.x = rx
      d.z = rz

      if (d.speed !== 0) addDriveMeters(Math.abs(d.speed) * dt)

      // ---- visuals: ground, bumps, wheels, lean ----
      const groundY = bridgeDeckY(d.x, d.z) ?? heightAt(d.x, d.z)
      // W3 THE SCHOOL-BUMP LAW — the body rides the true sinusoid: lift by
      // the shared profile and shed a little speed on the throat (a real
      // hump slows the car; painted-only lies don't)
      const bump = bumpHeightAt(d.x, d.z)
      rig.group.position.set(d.x, groundY + bump, d.z)
      if (bump > 0.002) d.speed *= Math.max(0, 1 - 1.6 * dt * (bump / BUMP_AMPLITUDE))
      rig.group.rotation.y = d.yaw
      const wr = WHEEL_R[d.model]
      for (const w of rig.wheels) w.rotation.x += (d.speed * dt) / wr
      const rollTarget = THREE.MathUtils.clamp(LEAN_SIGN[d.model] * turnRate * ROLL_GAIN[d.model], -MAX_ROLL[d.model], MAX_ROLL[d.model])
      rig.bank.rotation.z += (rollTarget - rig.bank.rotation.z) * Math.min(1, dt * 6)

      // ---- seat protocol: rig hidden, vehicle position published ----
      setDriveSeat({ x: d.x, y: groundY, z: d.z, yaw: d.yaw, hide: true })

      // ---- HUD + shared state (minimap/ambience read playerPos) ----
      reportDriveSpeed(d.speed)
      reportPlayerPos(d.x, d.z, d.yaw)
      followRef.current.set(d.x, 0, d.z)

      // ---- chase cam: smoothed, terrain-safe, obstruction-aware ----
      const dyaw = d.yaw - d.camYaw
      const wrapped = Math.atan2(Math.sin(dyaw), Math.cos(dyaw))
      d.camYaw += wrapped * Math.min(1, dt * 2.8)
      const { desired, from } = scratch.current
      const dist = CHASE_DIST + speedNorm * 2.2
      desired.set(
        d.x - Math.sin(d.camYaw) * dist,
        groundY + CHASE_HEIGHT + speedNorm * 0.9,
        d.z - Math.cos(d.camYaw) * dist,
      )
      const camGround = heightAt(desired.x, desired.z) + 1.15
      if (desired.y < camGround) desired.y = camGround
      from.set(d.x, groundY + 1.6, d.z)
      const obsT = cameraObstructionT(d.x, d.z, desired.x, desired.z, desired.y)
      if (obsT !== null) desired.lerpVectors(from, desired, obsT)
      camera.position.lerp(desired, Math.min(1, dt * 5.2))
      camera.lookAt(d.x + fx * 2.3, groundY + 1.55, d.z + fz * 2.3)

      // ---- speed feel: gentle FOV pull + engine hum ----
      const targetFov = FOV_BASE + 8.5 * speedNorm
      if (Math.abs(d.fov - targetFov) > 0.02) {
        d.fov += (targetFov - d.fov) * Math.min(1, dt * 3)
        applyFov(camera, d.fov)
      }
      humRef.current?.update(speedNorm)
      return
    }

    // ---- not driving: walk-up discovery of parked rides ----
    humRef.current?.update(0)
    let near: VehicleModel | null = null
    let nearD = ENTER_RADIUS
    for (const [model, spot] of PARKED_SPOTS) {
      const owned = useGameStore.getState().player?.vehicles.some((v) => v.model === model)
      if (!owned) continue
      const dist = Math.hypot(spot.x - playerPos.x, spot.z - playerPos.z)
      if (dist < nearD) {
        nearD = dist
        near = model
      }
    }
    reportNearVehicle(near)
  })

  if (!mounted) return null
  return <primitive object={mounted.rig.group} />
}
