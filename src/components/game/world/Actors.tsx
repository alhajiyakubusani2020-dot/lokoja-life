'use client'

/**
 * LOKOJA LIFE — Actors (Stage 3D)
 * ---------------------------------
 * Everything that moves in the world:
 *  - PlayerController: unified joystick/keyboard input, collision, terrain
 *    grounding, walk-cycle animation, character tinted from the player's
 *    ACTUAL avatar config in the save.
 *  - CameraRig: smooth third-person follow with drag-look + soft auto-align.
 *  - NPCs strolling the lively districts (fewer at night — the real clock).
 *  - Keke/okada/taxi traffic driving the road loops.
 *  - Rain particles when the real weather says so.
 *
 * No gameplay logic lives here: movement is free expression, while money,
 * time and location authority stay in the store.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { AvatarConfig, TimeOfDay, Weather } from '@/game/types'
import {
  ANCHOR_BY_ID, DISTRICTS, DOORS, heightAt, makeRng, NPC_ZONES, POINTS_OF_INTEREST, TRAFFIC_LOOPS,
} from '@/game/world3d/layout'
import { bridgeDeckY, cameraObstructionT, resolvePosition } from '@/game/world3d/collision'
import {
  applyVehicleNight, buildDanfo, buildKeke, buildOkada, buildSedan, headlightConeMaterial,
  PARKED_VEHICLES, type SedanVariant, type VehicleRig,
} from '@/game/world3d/vehicles'
import { NPCS } from '@/game/data/npcs'
import { INTERIOR, WORLD3D } from '@/game/data/config'
import {
  addWalkDistance, consumeLook, consumeZoom, getCamMode, isInputFrozen, MOVE, playerPos,
  readMoveInput, reportPlayerPos, CAM_RIG,
} from './controls'
import { HumanRig, MidRig, type RigColors } from './HumanRig'

/* ------------------------------ rig colour mapping ---------------------------- */

const VOLUME_HAIR = new Set(['afro', 'puffs', 'dreads', 'braids'])
const CAP_HAIR = new Set(['low-cut', 'waves', 'cornrows'])
const DRESS_STYLES = new Set(['kaftan'])

export function playerRigColors(avatar: AvatarConfig): RigColors {
  return {
    skin: avatar.skinTone,
    cloth: avatar.clothingColor,
    clothAlt: avatar.clothingColor,
    hair: avatar.hairColor,
    hairStyle: VOLUME_HAIR.has(avatar.hairstyle) ? 'volume' : CAP_HAIR.has(avatar.hairstyle) ? 'cap' : 'none',
    dress: DRESS_STYLES.has(avatar.clothingStyle),
  }
}

/** soft blob shadow — reads as contact shadow, costs one quad */
function BlobShadow({ scale = 1 }: { scale?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
      <circleGeometry args={[0.5 * scale, 12]} />
      <meshBasicMaterial color="#1a2016" transparent opacity={0.28} depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------- player character ----------------------------- */

export function PlayerAvatar({ avatar, speedRef }: { avatar: AvatarConfig; speedRef: { current: number } }) {
  return <HumanRig colors={playerRigColors(avatar)} speedRef={speedRef} castShadow />
}

/* -------------------------------- player controller ---------------------------- */

export function PlayerController({
  avatar,
  spawnLocationId,
  onPosition,
  onNearestAnchor,
  onDistrict,
}: {
  avatar: AvatarConfig
  spawnLocationId: string
  onPosition?: (x: number, z: number, heading: number) => void
  onNearestAnchor?: (anchorId: string | null) => void
  onDistrict?: (districtId: string | null) => void
}) {
  const group = useRef<THREE.Group>(null)
  const playerSpeed = useRef(0)

  const state = useRef({
    x: 0,
    z: 0,
    vx: 0,
    vz: 0,
    yaw: 0,
    camYaw: 0,
    camPitch: 0.42,
    camDist: MOVE.cameraDistance as number,
    speed: 0,
    anchorId: null as string | null,
    districtId: null as string | null,
    teleport: null as { x: number; z: number } | null,
  })

  const { camera } = useThree()

  // spawn at the player's actual current location
  useEffect(() => {
    const a = ANCHOR_BY_ID[spawnLocationId]
    if (!a || !group.current) return
    const s = state.current
    s.x = a.x + 4
    s.z = a.z + 5
    // face the camera toward the anchor
    s.camYaw = Math.atan2(a.x - s.x, a.z - s.z)
    const groundY = heightAt(s.x, s.z)
    group.current.position.set(s.x, groundY, s.z)
    // snap the camera to the correct rig position on the FIRST frame
    // (no slow lerp from the default canvas position)
    const cosP = Math.cos(s.camPitch)
    camera.position.set(
      s.x - Math.sin(s.camYaw) * s.camDist * cosP,
      groundY + MOVE.cameraHeight + Math.sin(s.camPitch) * s.camDist * 0.9,
      s.z - Math.cos(s.camYaw) * s.camDist * cosP,
    )
    camera.lookAt(a.x, a.y + 1.6, a.z)

    // dev/E2E debug bridge (stripped from production builds)
    if (process.env.NODE_ENV !== 'production') {
      ;(window as unknown as Record<string, unknown>).__lko = {
        teleport: (x: number, z: number) => {
          state.current.teleport = { x, z }
        },
        pos: () => ({ x: state.current.x, z: state.current.z }),
        anchors: Object.fromEntries(
          Object.entries(ANCHOR_BY_ID).map(([id, an]) => [id, { x: an.x, z: an.z }]),
        ),
        // E2E: feed the walked-meters accumulator directly (the frame loop
        // feeds it via addWalkDistance(s.speed*dt) — this skips terrain fights)
        walk: (m: number) => addWalkDistance(m),
      }
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__lko
    }
  }, [spawnLocationId])

  useFrame((_, rawDt) => {
    const s = state.current
    const dt = Math.min(rawDt, 0.05)
    const g = group.current
    if (!g) return

    // debug teleport (E2E)
    if (s.teleport) {
      s.x = s.teleport.x
      s.z = s.teleport.z
      s.vx = 0
      s.vz = 0
      s.teleport = null
    }

    const frozen = isInputFrozen()

    // ---- look ----
    const look = consumeLook()
    s.camYaw -= look.dx * 0.0042
    s.camPitch = THREE.MathUtils.clamp(s.camPitch + look.dy * 0.0032, MOVE.camPitchMin, MOVE.camPitchMax)

    // ---- movement (camera-relative) ----
    const input = readMoveInput()
    const moving = !frozen && (Math.abs(input.x) > 0.01 || Math.abs(input.y) > 0.01)
    const targetSpeed = moving ? (input.sprint ? MOVE.sprintSpeed : MOVE.walkSpeed) : 0

    let tx = 0
    let tz = 0
    if (moving) {
      const sin = Math.sin(s.camYaw)
      const cos = Math.cos(s.camYaw)
      // forward = -z when yaw=0 → rotate input by camYaw
      tx = (input.x * cos - input.y * sin)
      tz = (-input.x * sin - input.y * cos)
      const len = Math.hypot(tx, tz) || 1
      tx = (tx / len) * targetSpeed
      tz = (tz / len) * targetSpeed
    }

    const accel = MOVE.accel * dt
    s.vx += THREE.MathUtils.clamp(tx - s.vx, -accel, accel)
    s.vz += THREE.MathUtils.clamp(tz - s.vz, -accel, accel)

    let nx = s.x + s.vx * dt
    let nz = s.z + s.vz * dt
    ;[nx, nz] = resolvePosition(nx, nz)
    s.x = nx
    s.z = nz
    s.speed = Math.hypot(s.vx, s.vz)

    // presentation MEASURES (the store APPLIES on exit) — metres walked
    if (!frozen) addWalkDistance(s.speed * dt)
    reportPlayerPos(s.x, s.z, s.yaw)

    // slide dampening when blocked
    if (s.speed > 0.01) {
      const dot = (s.vx * tx + s.vz * tz) / (s.speed * (targetSpeed || 1) + 1e-6)
      if (targetSpeed > 0 && dot < 0.4) {
        s.vx *= 0.6
        s.vz *= 0.6
      }
    }

    // ---- ground ----
    const deckY = bridgeDeckY(s.x, s.z)
    const groundY = deckY ?? heightAt(s.x, s.z)
    g.position.set(s.x, groundY, s.z)

    // face movement direction
    if (s.speed > 0.4) {
      const targetYaw = Math.atan2(s.vx, s.vz)
      let d = targetYaw - s.yaw
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      s.yaw += d * Math.min(1, dt * 10)
    }
    g.rotation.y = s.yaw

    // ---- nearest anchor / point of interest (interaction discovery) ----
    let nearestId: string | null = null
    let nearestD = Infinity
    for (const [id, a] of Object.entries(ANCHOR_BY_ID)) {
      const d = Math.hypot(a.x - s.x, a.z - s.z)
      if (d < MOVE.interactRadius && d < nearestD) {
        nearestD = d
        nearestId = id
      }
    }
    // physical props (job boards) are interactables too — namespaced ids
    for (const p of POINTS_OF_INTEREST) {
      const d = Math.hypot(p.x - s.x, p.z - s.z)
      if (d < MOVE.interactRadius * 0.62 && d < nearestD) {
        nearestD = d
        nearestId = `poi:${p.id}`
      }
    }
    // interior doors (INC 4) — tight radius so stepping inside feels deliberate
    for (const dr of DOORS) {
      const d = Math.hypot(dr.x - s.x, dr.z - s.z)
      if (d < INTERIOR.doorRadius && d < nearestD) {
        nearestD = d
        nearestId = `door:${dr.interiorId}`
      }
    }
    const changed = nearestId !== s.anchorId
    s.anchorId = nearestId
    if (onNearestAnchor && changed) {
      onNearestAnchor(nearestId)
    }

    // ---- district awareness (the HUD shows arrival toasts) ----
    let districtNow: string | null = null
    for (const d of DISTRICTS) {
      if (Math.hypot(d.x - s.x, d.z - s.z) <= d.radius) {
        districtNow = d.id
        break
      }
    }
    if (onDistrict && districtNow !== s.districtId) {
      s.districtId = districtNow
      onDistrict(districtNow)
    }

    if (onPosition) onPosition(s.x, s.z, s.yaw)
    playerSpeed.current = s.speed

    // ---- camera ----
    const rig = CAM_RIG[getCamMode()]
    s.camDist = THREE.MathUtils.clamp(
      s.camDist + consumeZoom(),
      MOVE.cameraMinDistance,
      MOVE.cameraMaxDistance * (getCamMode() === 'drone' ? 1.5 : 1),
    )

    // soft auto-align behind the running player (off in orbit mode)
    if (rig.align > 0 && s.speed > 1.5 && look.dx === 0) {
      let d = s.yaw - s.camYaw
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      s.camYaw += d * Math.min(1, dt * rig.align * 0.12)
    }

    // third-person rig — parked BEHIND the player (opposite the view dir)
    const cosP = Math.cos(s.camPitch)
    const rigDist = s.camDist * rig.dist
    const desired = new THREE.Vector3(
      s.x - Math.sin(s.camYaw) * rigDist * cosP,
      groundY + MOVE.cameraHeight + rig.height + Math.sin(s.camPitch) * rigDist * 0.9,
      s.z - Math.cos(s.camYaw) * rigDist * cosP,
    )
    // keep the camera above terrain
    const camGround = heightAt(desired.x, desired.z) + 1.2
    if (desired.y < camGround) desired.y = camGround
    // INC 4 — never let a building swallow the view: pull the boom in
    // to just before the first obstructed sample (known clipping fix)
    const obsT = cameraObstructionT(s.x, s.z, desired.x, desired.z, desired.y)
    if (obsT !== null) {
      desired.lerpVectors(new THREE.Vector3(s.x, groundY + 1.7, s.z), desired, obsT)
    }
    camera.position.lerp(desired, Math.min(1, dt * (getCamMode() === 'drone' ? 4.2 : 6.5)))
    camera.lookAt(s.x, groundY + 1.7, s.z)
  })

  return (
    <group ref={group}>
      <PlayerAvatar avatar={avatar} speedRef={playerSpeed} />
      <BlobShadow scale={1.2} />
    </group>
  )
}

/* ----------------------------------- NPCs ------------------------------------- */

const NPC_SKINS = ['#4A2C17', '#5C3A21', '#6E4326', '#8A5A32', '#A9714B']
const NPC_CLOTHES = ['#c94f2e', '#2e7d5b', '#d99a2b', '#3a6ea3', '#8a5aa3', '#b03a5b', '#e8dcc3']

export function Npcs({
  timeOfDay,
  onGist,
}: {
  timeOfDay: TimeOfDay
  /** reports the nearest named NPC's id (real NPCS registry) — null when none near */
  onGist?: (npcId: string | null) => void
}) {
  const COUNT = 12
  const refs = useRef<(THREE.Group | null)[]>([])
  const gistRef = useRef<string | null>(null)
  const data = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const zone = NPC_ZONES[i % NPC_ZONES.length]
        const rng = Math.random
        // real identities — the same registry that powers hustle offers
        const pool = NPCS.filter((n) => n.homeLocationId === zone.locationId)
        const skin = NPC_SKINS[Math.floor(rng() * NPC_SKINS.length)]
        const cloth = NPC_CLOTHES[Math.floor(rng() * NPC_CLOTHES.length)]
        return {
          zone,
          identity: pool.length ? pool[i % pool.length] : null,
          ang0: rng() * Math.PI * 2,
          radius: 5 + rng() * (zone.radius - 7),
          speed: 0.25 + rng() * 0.4,
          dir: rng() > 0.5 ? 1 : -1,
          rig: {
            skin,
            cloth,
            clothAlt: NPC_CLOTHES[Math.floor(rng() * NPC_CLOTHES.length)],
            hair: '#1A1714',
            hairStyle: (['none', 'cap', 'volume'] as const)[Math.floor(rng() * 3)],
            dress: rng() > 0.6,
          } as RigColors,
          walk: { current: 1.2 + rng() * 0.6 },
        }
      }),
    [],
  )

  // at night most residents head home — the real clock makes the city breathe
  const activeCount = timeOfDay === 'night' ? 4 : COUNT

  useFrame((s) => {
    const t = s.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const g = refs.current[i]
      if (!g) continue
      const d = data[i]
      const ang = d.ang0 + t * d.speed * d.dir
      let x = d.zone.x + Math.cos(ang) * d.radius
      let z = d.zone.z + Math.sin(ang) * d.radius
      // INC 4 — residents now respect walls & rivers (was: stroll through buildings)
      ;[x, z] = resolvePosition(x, z)
      g.visible = i < activeCount
      if (!g.visible) continue
      g.position.set(x, heightAt(x, z), z)
      g.rotation.y = -ang + (d.dir > 0 ? Math.PI / 2 : -Math.PI / 2)
    }

    // gist discovery — the nearest NAMED resident to the player
    if (onGist) {
      let best: string | null = null
      let bestD: number = WORLD3D.npcGistRadius
      for (let i = 0; i < COUNT; i++) {
        if (i >= activeCount) break
        const d = data[i]
        if (!d.identity) continue
        const g = refs.current[i]
        if (!g) continue
        const dist = Math.hypot(g.position.x - playerPos.x, g.position.z - playerPos.z)
        if (dist < bestD) {
          bestD = dist
          best = d.identity.id
        }
      }
      if (best !== gistRef.current) {
        gistRef.current = best
        onGist(best)
      }
    }
  })

  return (
    <group>
      {data.map((d, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el }}>
          <MidRig colors={d.rig} speedRef={d.walk} />
          <BlobShadow scale={0.9} />
        </group>
      ))}
    </group>
  )
}

/* ---------------------------------- traffic ----------------------------------- */

/**
 * STAGE 4 — the fleet. Every vehicle is a shared-rig build from
 * `world3d/vehicles.ts` (keke napep, okada, danfo, taxi, private
 * sedans) with cached geometries/materials. The Traffic loop below:
 *   - drives each rig along its seeded loop with per-vehicle speed
 *     noise, corner braking, right-hand lane keeping and okada weave
 *   - banks rigs into corners (okadas lean IN, bodies lean OUT)
 *   - spins wheels by true distance travelled and steers the front fork
 *   - at night, rides ONE pool of four fake headlight cones on the
 *     vehicles nearest the player (no real lights, no allocations)
 * Parked cars render statically from the seeded placement data.
 */

type VehicleKind = 'keke' | 'okada' | 'danfo' | 'taxi' | 'sedan'

interface VehiclePlan {
  kind: VehicleKind
  variant: SedanVariant
  toneIdx: number
  loop: number
  s: number
  base: number
  lane: number
  phase: number
  wobbleFreq: number
  weave: number
  yaw: number
  rate: number
}

// speeds are presentation feel, scaled off the shared config base
const BASE = WORLD3D.trafficBaseSpeed

/** the town's fleet mix — 13 rigs across the four loops (perf ceiling ~14) */
const TRAFFIC_MIX: { kind: VehicleKind; loop: number; lane: number; base: number; variant?: SedanVariant }[] = [
  { kind: 'keke', loop: 0, lane: 1.55, base: 1.0 },
  { kind: 'taxi', loop: 0, lane: -1.7, base: 1.14 },
  { kind: 'danfo', loop: 0, lane: 1.9, base: 0.8 },
  { kind: 'okada', loop: 0, lane: -1.4, base: 1.32 },
  { kind: 'danfo', loop: 1, lane: 1.9, base: 0.78 },
  { kind: 'keke', loop: 1, lane: -1.55, base: 0.96 },
  { kind: 'sedan', loop: 1, lane: 1.75, base: 1.06, variant: 'white' },
  { kind: 'okada', loop: 1, lane: -1.35, base: 1.36 },
  { kind: 'keke', loop: 2, lane: 1.5, base: 1.0 },
  { kind: 'sedan', loop: 2, lane: -1.8, base: 1.08, variant: 'silver' },
  { kind: 'okada', loop: 2, lane: 1.4, base: 1.3 },
  { kind: 'taxi', loop: 3, lane: 1.65, base: 1.12 },
  { kind: 'sedan', loop: 3, lane: -1.75, base: 1.02, variant: 'darkblue' },
]

const VEHICLES: VehiclePlan[] = TRAFFIC_MIX.map((m, i) => {
  // per-vehicle seeded rng: order-independent, identical every load
  const r = makeRng(8021 + i * 97)
  return {
    ...m,
    variant: m.variant ?? 'silver',
    toneIdx: Math.floor(r() * 4),
    s: r() * 400,
    base: m.base * (0.9 + r() * 0.2) * BASE,
    phase: r() * Math.PI * 2,
    wobbleFreq: 0.25 + r() * 0.3,
    weave: m.kind === 'okada' ? 0.4 + r() * 0.25 : 0,
    yaw: 0,
    rate: 0,
  }
})

interface LoopTable {
  ax: Float64Array
  az: Float64Array
  dx: Float64Array
  dz: Float64Array
  start: Float64Array
  len: Float64Array
  yaw: Float64Array
  total: number
}

// arc-length tables precomputed once — the frame loop never allocates
const LOOP_TABLES: LoopTable[] = TRAFFIC_LOOPS.map((loop) => {
  const n = loop.length
  const t: LoopTable = {
    ax: new Float64Array(n),
    az: new Float64Array(n),
    dx: new Float64Array(n),
    dz: new Float64Array(n),
    start: new Float64Array(n),
    len: new Float64Array(n),
    yaw: new Float64Array(n),
    total: 0,
  }
  let acc = 0
  for (let i = 0; i < n; i++) {
    const a = loop[i]
    const b = loop[(i + 1) % n]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    t.ax[i] = a[0]
    t.az[i] = a[1]
    t.dx[i] = b[0] - a[0]
    t.dz[i] = b[1] - a[1]
    t.start[i] = acc
    t.len[i] = l
    t.yaw[i] = Math.atan2(t.dx[i], t.dz[i])
    acc += l
  }
  t.total = acc
  return t
})

interface LoopPoint {
  x: number
  z: number
  yaw: number
}
const SCRATCH_A: LoopPoint = { x: 0, z: 0, yaw: 0 }
const SCRATCH_B: LoopPoint = { x: 0, z: 0, yaw: 0 }

/** position along a loop at arc-length s — writes into `out`, no allocation */
function loopPoint(loopIdx: number, s: number, out: LoopPoint): void {
  const t = LOOP_TABLES[loopIdx]
  const rem = ((s % t.total) + t.total) % t.total
  let k = 0
  while (k < t.len.length - 1 && rem > t.start[k + 1]) k++
  const f = t.len[k] === 0 ? 0 : (rem - t.start[k]) / t.len[k]
  out.x = t.ax[k] + t.dx[k] * f
  out.z = t.az[k] + t.dz[k] * f
  out.yaw = t.yaw[k]
}

// feel constants per family: body roll gain/cap + wheel radius (spin rate)
const ROLL_GAIN: Record<VehicleKind, number> = { keke: 0.55, okada: 3.4, taxi: 0.24, sedan: 0.24, danfo: 0.15 }
const MAX_ROLL: Record<VehicleKind, number> = { keke: 0.09, okada: 0.4, taxi: 0.05, sedan: 0.05, danfo: 0.04 }
const WHEEL_R: Record<VehicleKind, number> = { keke: 0.34, okada: 0.33, taxi: 0.34, sedan: 0.34, danfo: 0.38 }

function buildTrafficRig(v: VehiclePlan): VehicleRig {
  if (v.kind === 'keke') return buildKeke()
  if (v.kind === 'okada') return buildOkada(v.toneIdx)
  if (v.kind === 'danfo') return buildDanfo()
  if (v.kind === 'taxi') return buildSedan('taxi')
  return buildSedan(v.variant)
}

// module-level rig caches — built lazily on the first client render (SSR
// import stays safe); geometries/materials themselves live in vehicles.ts
let RIG_CACHE: VehicleRig[] | null = null
let PARKED_RIG_CACHE: VehicleRig[] | null = null

function getRigs(): VehicleRig[] {
  if (!RIG_CACHE) RIG_CACHE = VEHICLES.map(buildTrafficRig)
  return RIG_CACHE
}

function getParkedRigs(): VehicleRig[] {
  if (!PARKED_RIG_CACHE) {
    PARKED_RIG_CACHE = PARKED_VEHICLES.map((p) =>
      p.build === 'keke' ? buildKeke(true) : buildSedan(p.variant, true),
    )
  }
  return PARKED_RIG_CACHE
}

// reused scratch for the nightly "4 nearest vehicles" scan (no allocs)
const BEST_D = [Infinity, Infinity, Infinity, Infinity]
const BEST_I = [-1, -1, -1, -1]

export function Traffic({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const refs = useRef<(THREE.Group | null)[]>([])
  const coneRefs = useRef<(THREE.Group | null)[]>([])
  const night = timeOfDay === 'night'

  const coneGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(2.5, 5.6)
    g.translate(0, 2.8, 0) // pivot at the near edge so the pool runs forward
    return g
  }, [])

  // one call flips every headlight/taillight in town (moving + parked)
  useEffect(() => {
    applyVehicleNight(night)
  }, [night])

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const t = state.clock.elapsedTime

    for (let i = 0; i < VEHICLES.length; i++) {
      const v = VEHICLES[i]
      const g = refs.current[i]
      const rig = getRigs()[i]
      if (!g || !rig) continue

      // cruise: deterministic per-vehicle noise + gentle slow-down into corners
      loopPoint(v.loop, v.s, SCRATCH_A)
      loopPoint(v.loop, v.s + 3.4, SCRATCH_B)
      let lookYaw = SCRATCH_B.yaw - SCRATCH_A.yaw
      while (lookYaw > Math.PI) lookYaw -= Math.PI * 2
      while (lookYaw < -Math.PI) lookYaw += Math.PI * 2
      const noise = 1 + Math.sin(t * v.wobbleFreq + v.phase) * 0.09
      const corner = 1 - Math.min(0.45, Math.abs(lookYaw) * 1.15)
      const spd = v.base * noise * corner
      v.s += spd * dt

      // lane keeping (right-hand traffic); okadas weave, everyone drifts a hair
      const lateral =
        v.lane + (v.weave > 0 ? Math.sin(v.s * 0.55 + v.phase) * v.weave : Math.sin(v.s * 0.21 + v.phase) * 0.07)
      const x = SCRATCH_A.x + -Math.cos(SCRATCH_A.yaw) * lateral
      const z = SCRATCH_A.z + Math.sin(SCRATCH_A.yaw) * lateral

      // smoothed turn rate → steer + bank (okadas lean IN, bodies lean OUT)
      let dy = SCRATCH_A.yaw - v.yaw
      while (dy > Math.PI) dy -= Math.PI * 2
      while (dy < -Math.PI) dy += Math.PI * 2
      v.rate += (dy / Math.max(dt, 1e-3) - v.rate) * Math.min(1, dt * 4.5)
      v.yaw = SCRATCH_A.yaw

      // ride bridge decks where the loop crosses water (bypass / Kogi bridge)
      g.position.set(x, bridgeDeckY(x, z) ?? heightAt(x, z) + 0.05, z)
      g.rotation.set(0, SCRATCH_A.yaw, 0)

      const leanSign = v.kind === 'okada' ? -1 : 1
      const rollTarget = THREE.MathUtils.clamp(
        leanSign * v.rate * ROLL_GAIN[v.kind],
        -MAX_ROLL[v.kind],
        MAX_ROLL[v.kind],
      )
      rig.bank.rotation.z += (rollTarget - rig.bank.rotation.z) * Math.min(1, dt * 6)
      if (rig.steer) rig.steer.rotation.y = THREE.MathUtils.clamp(v.rate * 0.35, -0.3, 0.3)

      // wheels spin by true distance travelled
      const dist = spd * dt
      const wr = WHEEL_R[v.kind]
      for (const w of rig.wheels) w.rotation.x += dist / wr
    }

    // night: the four shared light pools ride the vehicles nearest the player
    const cones = coneRefs.current
    if (night) {
      for (let k = 0; k < 4; k++) {
        BEST_D[k] = Infinity
        BEST_I[k] = -1
      }
      const px = playerPos.x
      const pz = playerPos.z
      for (let i = 0; i < VEHICLES.length; i++) {
        const g = refs.current[i]
        if (!g) continue
        const d2 = (g.position.x - px) * (g.position.x - px) + (g.position.z - pz) * (g.position.z - pz)
        for (let k = 0; k < 4; k++) {
          if (d2 < BEST_D[k]) {
            for (let m = 3; m > k; m--) {
              BEST_D[m] = BEST_D[m - 1]
              BEST_I[m] = BEST_I[m - 1]
            }
            BEST_D[k] = d2
            BEST_I[k] = i
            break
          }
        }
      }
      for (let c = 0; c < cones.length; c++) {
        const cone = cones[c]
        if (!cone) continue
        const gi = c < 4 ? BEST_I[c] : -1
        const src = gi >= 0 ? refs.current[gi] : null
        if (src && BEST_D[c] < 3600) {
          cone.visible = true
          cone.position.set(src.position.x, src.position.y + 0.05, src.position.z)
          cone.rotation.y = VEHICLES[gi].yaw
        } else {
          cone.visible = false
        }
      }
    } else {
      for (const cone of cones) if (cone) cone.visible = false
    }
  })

  return (
    <group>
      {VEHICLES.map((v, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el }}>
          <primitive object={getRigs()[i].group} />
          <BlobShadow scale={v.kind === 'danfo' ? 2 : 1.6} />
        </group>
      ))}
      {/* parked fleet — static visual-only rigs, no frame updates */}
      {PARKED_VEHICLES.map((p, i) => (
        <group key={`parked-${i}`} position={[p.x, p.y, p.z]} rotation={[0, p.rotY, 0]}>
          <primitive object={getParkedRigs()[i].group} />
          <BlobShadow scale={p.build === 'sedan' ? 1.7 : 1.3} />
        </group>
      ))}
      {/* fake headlight pools — one shared material, four riders (night only) */}
      {[0, 1, 2, 3].map((i) => (
        <group key={`cone-${i}`} ref={(el) => { coneRefs.current[i] = el }} visible={false}>
          <mesh
            geometry={coneGeo}
            material={headlightConeMaterial()}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0.06, 1.6]}
          />
        </group>
      ))}
    </group>
  )
}

/* ----------------------------------- rain -------------------------------------- */

export function Rain({ weather }: { weather: Weather }) {
  const COUNT = 620
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44
      pos[i * 3 + 1] = Math.random() * 26
      pos[i * 3 + 2] = (Math.random() - 0.5) * 44
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame((state, dt) => {
    const pts = ref.current
    if (!pts || weather !== 'rain') return
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const fall = 27 * Math.min(dt, 0.05)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] -= fall
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3] = (Math.random() - 0.5) * 44
        arr[i * 3 + 1] = 24 + Math.random() * 4
        arr[i * 3 + 2] = (Math.random() - 0.5) * 44
      }
    }
    attr.needsUpdate = true
    // follow the camera area in coarse steps so the shower is always around you
    pts.position.set(
      Math.round(state.camera.position.x / 22) * 22,
      0,
      Math.round(state.camera.position.z / 22) * 22,
    )
  })

  if (weather !== 'rain') return null
  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial color="#aebfc9" size={0.09} transparent opacity={0.62} sizeAttenuation />
    </points>
  )
}

/* ------------------------------ joystick bridge -------------------------------- */

/** The HUD joystick writes straight into controls.setJoystick(); both input
 *  paths (touch + keyboard) meet in controls.ts and are read here. */

/* ----------------------------------- birds ------------------------------------- */

/**
 * INC 4 — life in the sky: three flocks of flapping birds circling the
 * Confluence, Mount Patti and the market by day. Cheap primitives, no
 * shadows, hidden at night — the city breathes without costing frames.
 */
export function Birds({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const night = timeOfDay === 'night'
  const flocks = useMemo(
    () => [
      { c: ANCHOR_BY_ID['confluence'], n: 7, r: 15, h: 11, speed: 0.16 },
      { c: ANCHOR_BY_ID['mount-patti'], n: 6, r: 19, h: 34, speed: 0.11 },
      { c: ANCHOR_BY_ID['kpata-market'], n: 5, r: 11, h: 9, speed: 0.21 },
    ],
    [],
  )
  const birds = useMemo(() => {
    const out: { flock: number; phase: number; rad: number }[] = []
    flocks.forEach((f, fi) => {
      for (let i = 0; i < f.n; i++) {
        out.push({ flock: fi, phase: (i / f.n) * Math.PI * 2 + fi * 1.7, rad: f.r + (i % 3) * 2.4 })
      }
    })
    return out
  }, [flocks])
  const refs = useRef<(THREE.Group | null)[]>([])
  const wings = useRef<(THREE.Group | null)[]>([])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    for (let i = 0; i < birds.length; i++) {
      const g = refs.current[i]
      if (!g) continue
      const b = birds[i]
      const f = flocks[b.flock]
      const ang = b.phase + t * f.speed
      const x = f.c.x + Math.cos(ang) * b.rad
      const z = f.c.z + Math.sin(ang) * b.rad
      g.position.set(x, f.c.y + f.h + Math.sin(t * 0.7 + i) * 1.6, z)
      g.rotation.y = -ang + Math.PI / 2
      const w = wings.current[i]
      if (w) w.rotation.z = Math.sin(t * 9 + i * 1.31) * 0.6
    }
  })

  return (
    <group visible={!night}>
      {birds.map((_, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el }}>
          {/* body */}
          <mesh scale={[1.5, 0.8, 0.9]}>
            <sphereGeometry args={[0.075, 6, 6]} />
            <meshStandardMaterial color="#2a2620" roughness={1} />
          </mesh>
          {/* flapping wings */}
          <group ref={(el) => { wings.current[i] = el }}>
            {[-1, 1].map((sd) => (
              <mesh key={sd} position={[sd * 0.21, 0.02, 0]} rotation={[0, 0, sd * 0.18]}>
                <planeGeometry args={[0.36, 0.15]} />
                <meshStandardMaterial color="#2a2620" roughness={1} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        </group>
      ))}
    </group>
  )
}

/* -------------------------------- cooking smoke -------------------------------- */

const SMOKE_PUFFS = 7

/** cooking smoke at the food strip + the market grills — cheap looping sprites */
export function SmokeWisps() {
  const emitters = useMemo(
    () => [
      { x: ANCHOR_BY_ID['food-area'].x + 4.4, z: ANCHOR_BY_ID['food-area'].z - 3.6 },
      { x: ANCHOR_BY_ID['kpata-market'].x - 8.6, z: ANCHOR_BY_ID['kpata-market'].z - 4.2 },
    ].map((e) => ({ ...e, y: heightAt(e.x, e.z) })),
    [],
  )
  const refs = useRef<(THREE.Sprite | null)[]>([])
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 64
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 30)
    g.addColorStop(0, 'rgba(238,233,224,0.6)')
    g.addColorStop(1, 'rgba(238,233,224,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  }, [])

  useFrame((s) => {
    const t = s.clock.elapsedTime
    for (let e = 0; e < emitters.length; e++) {
      for (let p = 0; p < SMOKE_PUFFS; p++) {
        const sp = refs.current[e * SMOKE_PUFFS + p]
        if (!sp) continue
        const life = (t * 0.32 + p / SMOKE_PUFFS + e * 0.37) % 1
        sp.position.set(
          emitters[e].x + Math.sin(life * 8 + p) * 0.4,
          emitters[e].y + 0.7 + life * 2.8,
          emitters[e].z + Math.cos(life * 6.4 + p) * 0.3,
        )
        sp.scale.setScalar(0.55 + life * 1.6)
        ;(sp.material as THREE.SpriteMaterial).opacity = 0.42 * (1 - life) * Math.min(1, life * 4)
      }
    }
  })

  return (
    <group>
      {emitters.map((_, e) =>
        Array.from({ length: SMOKE_PUFFS }, (_, p) => (
          <sprite key={`${e}-${p}`} ref={(el) => { refs.current[e * SMOKE_PUFFS + p] = el }}>
            <spriteMaterial map={tex} transparent depthWrite={false} opacity={0.4} />
          </sprite>
        )),
      )}
    </group>
  )
}
