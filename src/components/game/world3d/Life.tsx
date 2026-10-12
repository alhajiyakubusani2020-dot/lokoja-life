'use client'

/**
 * LOKOJA LIFE — Life: people, vehicles & the player (Stage 3.6)
 * --------------------------------------------------------------
 * Ambient Lokoja: pedestrians strolling the sidewalks with real leg &
 * arm swings, okadas weaving through traffic, kekes and taxis working
 * the main roads, buses parked at the motor park — and the player's own
 * avatar, which NOW WALKS THE STREETS with the virtual joystick or
 * keyboard (one movement controller in controls.ts) and still rides the
 * real road network whenever the existing travel system moves them.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useWorldAssets, PALETTE, pick, worldMood } from './assets'
import { groundHeight } from '@/game/data/world3d'
import {
  RESOLVED_ROADS, NPC_WALK_ROUTES, MOVING_VEHICLE_ROUTES, ANCHORS,
  routeBetween, pointOnRoute, polylineLength, ALL_BUILDING_PLANS,
} from '@/game/data/world3d'
import { MOVEMENT } from '@/game/data/config'
import {
  joystickState, keyState, sprintButton, inputLock, playerPos, camState,
  combineInputs, stepPlayer, colliderGrid, nearestLocationZone,
} from './controls'
import type { TransportId } from '@/game/types'

/* ------------------------------ shared scratch ------------------------------ */
/* module singletons — one canvas exists at a time; keeps the hot loops
   allocation-free (React-compiler-safe: never mutated during render) */
const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _q2 = new THREE.Quaternion()
const _e = new THREE.Euler()
const _p = new THREE.Vector3()
const _s = new THREE.Vector3()
const AXIS_Y = new THREE.Vector3(0, 1, 0)
const AXIS_Z = new THREE.Vector3(0, 0, 1)

function seededRng(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* --------------------------------- people ---------------------------------- */

interface Person {
  /** walkers: road ping-pong; idlers: fixed spot */
  roadId: string | null
  t: number
  speed: number
  dir: 1 | -1
  offset: number
  x: number
  z: number
  ry: number
  phase: number
  bodyScale: number
  skin: THREE.Color
  cloth: THREE.Color
  hair: THREE.Color | null
  bottom: THREE.Color
}

const WALKER_COUNT = 44
const IDLER_COUNT = 30

const HAIR_COLORS = ['#141210', '#241610', '#33231a', '#0e1216', '#2c1a10']

export function People() {
  const { geos, mats } = useWorldAssets()

  const people = useMemo<Person[]>(() => {
    const rng = seededRng(99991)
    const out: Person[] = []

    // walkers along sidewalks
    for (let i = 0; i < WALKER_COUNT; i++) {
      const roadId = NPC_WALK_ROUTES[i % NPC_WALK_ROUTES.length]
      out.push({
        roadId,
        t: rng(),
        speed: 0.008 + rng() * 0.011,
        dir: rng() > 0.5 ? 1 : -1,
        offset: (2.9 + rng() * 1.7) * (rng() > 0.5 ? 1 : -1),
        x: 0,
        z: 0,
        ry: 0,
        phase: rng() * Math.PI * 2,
        bodyScale: 0.9 + rng() * 0.22,
        skin: pick(PALETTE.skin, Math.floor(rng() * 6)),
        cloth: pick(PALETTE.cloth, Math.floor(rng() * PALETTE.cloth.length)),
        hair: rng() < 0.72 ? new THREE.Color(pick(HAIR_COLORS, Math.floor(rng() * HAIR_COLORS.length))) : null,
        bottom: pick(PALETTE.cloth, Math.floor(rng() * PALETTE.cloth.length)),
      })
    }
    // idlers around busy spots (market, bukas, motor park, riverfront…)
    const spots = ALL_BUILDING_PLANS.flatMap((d) => d.busySpots)
    for (let i = 0; i < IDLER_COUNT && spots.length > 0; i++) {
      const s = spots[Math.floor(rng() * spots.length)]
      out.push({
        roadId: null,
        t: 0,
        speed: 0,
        dir: 1,
        offset: 0,
        x: s.x + (rng() - 0.5) * 3.4,
        z: s.z + (rng() - 0.5) * 3.4,
        ry: rng() * Math.PI * 2,
        phase: rng() * Math.PI * 2,
        bodyScale: 0.9 + rng() * 0.22,
        skin: pick(PALETTE.skin, Math.floor(rng() * 6)),
        cloth: pick(PALETTE.cloth, Math.floor(rng() * PALETTE.cloth.length)),
        hair: rng() < 0.72 ? new THREE.Color(pick(HAIR_COLORS, Math.floor(rng() * HAIR_COLORS.length))) : null,
        bottom: pick(PALETTE.cloth, Math.floor(rng() * PALETTE.cloth.length)),
      })
    }
    return out
  }, [])

  const TOTAL = people.length
  const bodyRef = useRef<THREE.InstancedMesh>(null!)
  const headRef = useRef<THREE.InstancedMesh>(null!)
  const hairRef = useRef<THREE.InstancedMesh>(null!)
  const legARef = useRef<THREE.InstancedMesh>(null!)
  const legBRef = useRef<THREE.InstancedMesh>(null!)
  const armARef = useRef<THREE.InstancedMesh>(null!)
  const armBRef = useRef<THREE.InstancedMesh>(null!)

  /** route polylines resolved once (no per-frame array scans) */
  const walkerRoutes = useMemo(
    () => people.map((p) => (p.roadId ? RESOLVED_ROADS.find((r) => r.id === p.roadId)!.pts : null)),
    [people],
  )

  // static colours, set once
  useEffect(() => {
    const setup = (ref: React.RefObject<THREE.InstancedMesh>, paint: (p: Person) => THREE.Color | null) => {
      if (!ref.current) return
      people.forEach((p, i) => {
        const c = paint(p)
        if (c) ref.current!.setColorAt(i, c)
      })
      if (ref.current!.instanceColor) ref.current!.instanceColor.needsUpdate = true
    }
    setup(bodyRef, (p) => p.cloth)
    setup(headRef, (p) => p.skin)
    setup(hairRef, (p) => p.hair)
    setup(legARef, (p) => p.bottom)
    setup(legBRef, (p) => p.bottom)
    setup(armARef, (p) => p.skin)
    setup(armBRef, (p) => p.skin)
  }, [people])

  useFrame((state, dtRaw) => {
    const t = state.clock.elapsedTime
    const dt = Math.min(dtRaw, 0.1)

    const setPart = (
      ref: React.RefObject<THREE.InstancedMesh>,
      i: number,
      x: number, y: number, z: number,
      ry: number, rx: number,
      sx: number, sy: number, sz: number,
    ) => {
      if (!ref.current) return
      _e.set(rx, ry, 0)
      _q.setFromEuler(_e)
      _p.set(x, y, z)
      _s.set(sx, sy, sz)
      _m.compose(_p, _q, _s)
      ref.current.setMatrixAt(i, _m)
    }

    people.forEach((p, i) => {
      let x = p.x
      let z = p.z
      let facing = p.ry
      let stride = 0

      if (p.roadId && walkerRoutes[i]) {
        // ping-pong along the road — dt-scaled so framerate never changes speed
        p.t += p.speed * dt * p.dir
        let tt = p.t % 2
        if (tt < 0) tt += 2
        const ft = tt > 1 ? 2 - tt : tt
        const pt = pointOnRoute(walkerRoutes[i]!, ft)
        const nx = Math.cos(pt.angle)
        const nz = -Math.sin(pt.angle)
        x = pt.x + nx * p.offset
        z = pt.z + nz * p.offset
        facing = pt.angle + (p.dir > 0 ? 0 : Math.PI)
        stride = Math.sin(t * 7 + p.phase)
      }
      p.x = x
      p.z = z
      const y = groundHeight(x, z)
      const sc = p.bodyScale
      const bob = p.roadId ? Math.abs(Math.sin(t * 7 + p.phase)) * 0.055 * sc : Math.sin(t * 1.6 + p.phase) * 0.02

      setPart(bodyRef, i, x, y + (0.98 * sc) + bob, z, facing, 0, 0.5 * sc, 0.72 * sc, 0.32 * sc)
      setPart(headRef, i, x, y + (1.56 * sc) + bob, z, facing, 0, 0.44 * sc, 0.44 * sc, 0.44 * sc)
      setPart(hairRef, i, x, y + (1.7 * sc) + bob, z, facing, 0, p.hair ? 0.46 * sc : 0.0001, p.hair ? 0.3 * sc : 0.0001, p.hair ? 0.46 * sc : 0.0001)
      // legs scissor along the facing direction; arms swing opposite
      const strideA = stride * 0.17 * sc
      const strideB = -stride * 0.17 * sc
      setPart(legARef, i, x + Math.sin(facing) * strideA, y + (0.26 * sc) + bob, z + Math.cos(facing) * strideA, facing, stride * 0.45, 0.16 * sc, 0.5 * sc, 0.2 * sc)
      setPart(legBRef, i, x + Math.sin(facing) * strideB, y + (0.26 * sc) + bob, z + Math.cos(facing) * strideB, facing, -stride * 0.45, 0.16 * sc, 0.5 * sc, 0.2 * sc)
      const armAoff = -stride * 0.12 * sc
      const armBoff = stride * 0.12 * sc
      setPart(armARef, i, x + Math.sin(facing) * armAoff, y + (1.0 * sc) + bob, z + Math.cos(facing) * armAoff, facing, -stride * 0.4, 0.11 * sc, 0.44 * sc, 0.13 * sc)
      setPart(armBRef, i, x + Math.sin(facing) * armBoff, y + (1.0 * sc) + bob, z + Math.cos(facing) * armBoff, facing, stride * 0.4, 0.11 * sc, 0.44 * sc, 0.13 * sc)
    })

    for (const ref of [bodyRef, headRef, hairRef, legARef, legBRef, armARef, armBRef]) {
      if (ref.current) ref.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[geos.box, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={headRef} args={[geos.sphere, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={hairRef} args={[geos.sphere, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={legARef} args={[geos.box, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={legBRef} args={[geos.box, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={armARef} args={[geos.box, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={armBRef} args={[geos.box, mats.flat, TOTAL]} frustumCulled={false} />
    </group>
  )
}

/* -------------------------------- vehicles --------------------------------- */

type VehicleKind = 'keke' | 'taxi' | 'car' | 'bus' | 'okada'

interface MovingVehicle {
  roadId: string
  kind: VehicleKind
  t: number
  speed: number // progress per second
  worldSpeed: number // world units per second (for wheel spin)
  dir: 1 | -1
  phase: number
  spin: number
  color: THREE.Color
}

const MOVING_COUNT = 16

const PARKED: Array<{ x: number; z: number; ry: number; kind: VehicleKind; color: THREE.Color }> = [
  ...Array.from({ length: 5 }, (_, i) => {
    const a = ANCHORS['transport-area']
    return { x: a.x - 8 + i * 4.4, z: a.z + 6, ry: Math.PI / 2, kind: (i % 2 === 0 ? 'bus' : 'taxi') as VehicleKind, color: i % 2 === 0 ? PALETTE.busGreen : PALETTE.taxi }
  }),
  ...Array.from({ length: 4 }, (_, i) => {
    const a = ANCHORS['transport-area']
    return { x: a.x - 8 + i * 4.4, z: a.z + 12, ry: Math.PI / 2, kind: 'car' as VehicleKind, color: pick(PALETTE.carCols, i + 1) }
  }),
  { x: ANCHORS['ganaja-junction'].x + 6, z: ANCHORS['ganaja-junction'].z + 8, ry: 0.6, kind: 'keke', color: PALETTE.keke },
  { x: ANCHORS['ganaja-junction'].x - 7, z: ANCHORS['ganaja-junction'].z - 5, ry: 2.4, kind: 'keke', color: PALETTE.keke },
  { x: ANCHORS['ganaja-junction'].x + 10, z: ANCHORS['ganaja-junction'].z - 8, ry: 1.2, kind: 'okada', color: pick(PALETTE.carCols, 4) },
  { x: ANCHORS['ganaja-junction'].x - 11, z: ANCHORS['ganaja-junction'].z + 3, ry: 2.9, kind: 'okada', color: pick(PALETTE.carCols, 1) },
  { x: ANCHORS['ganaja-junction'].x - 4, z: ANCHORS['ganaja-junction'].z - 12, ry: 0.3, kind: 'okada', color: pick(PALETTE.carCols, 6) },
  { x: ANCHORS['kpata-market'].x + 5, z: ANCHORS['kpata-market'].z - 6, ry: 1.2, kind: 'car', color: PALETTE.carCols[2] },
  { x: ANCHORS['food-area'].x - 5, z: ANCHORS['food-area'].z + 4, ry: 2.2, kind: 'okada', color: pick(PALETTE.carCols, 0) },
  { x: ANCHORS['government-area'].x - 6, z: ANCHORS['government-area'].z + 5, ry: 0.4, kind: 'car', color: PALETTE.white },
  { x: ANCHORS['confluence'].standX + 4, z: ANCHORS['confluence'].standZ + 8, ry: 2.8, kind: 'taxi', color: PALETTE.taxi },
]

const VEHICLE_DIMS: Record<VehicleKind, { body: [number, number, number]; cabin: [number, number, number]; cabinZ: number; wheels: Array<[number, number]>; wheelR: number }> = {
  keke: { body: [1.35, 1.05, 2.5], cabin: [1.15, 0.85, 1.1], cabinZ: 0.45, wheels: [[-0.7, 0.8], [0.7, 0.8], [0, -0.85]], wheelR: 0.3 },
  taxi: { body: [1.8, 0.75, 3.8], cabin: [1.6, 0.65, 1.9], cabinZ: -0.1, wheels: [[-0.85, 1.25], [0.85, 1.25], [-0.85, -1.25], [0.85, -1.25]], wheelR: 0.34 },
  car: { body: [1.85, 0.7, 4], cabin: [1.65, 0.6, 2], cabinZ: -0.15, wheels: [[-0.88, 1.3], [0.88, 1.3], [-0.88, -1.3], [0.88, -1.3]], wheelR: 0.35 },
  bus: { body: [2.3, 1.5, 6.6], cabin: [2.1, 0.7, 2.4], cabinZ: -1.8, wheels: [[-1.05, 2.2], [1.05, 2.2], [-1.05, -2.2], [1.05, -2.2]], wheelR: 0.45 },
  okada: { body: [0.55, 0.4, 1.8], cabin: [0.42, 0.52, 0.55], cabinZ: 0.2, wheels: [[0, 0.62], [0, -0.62]], wheelR: 0.29 },
}

const CABIN_GLASS = new THREE.Color('#dff2ec')

// module-singleton vehicle light materials (one canvas at a time)
const HEADLIGHT_MAT = new THREE.MeshBasicMaterial({
  color: '#fff3c4', transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, depthWrite: false,
})
const TAILLIGHT_MAT = new THREE.MeshBasicMaterial({
  color: '#ff4530', transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, depthWrite: false,
})

export function Vehicles() {
  const { geos, mats } = useWorldAssets()

  const moving = useMemo<MovingVehicle[]>(() => {
    const rng = seededRng(77777)
    // okadas + kekes dominate Lokoja streets — the mix matches real traffic
    const kinds: VehicleKind[] = ['keke', 'okada', 'taxi', 'car', 'keke', 'okada', 'bus', 'car', 'taxi', 'okada', 'keke', 'bus', 'car', 'okada', 'taxi', 'keke']
    const out: MovingVehicle[] = []
    for (let i = 0; i < MOVING_COUNT; i++) {
      const kind = kinds[i % kinds.length]
      const road = RESOLVED_ROADS.find((r) => r.id === MOVING_VEHICLE_ROUTES[i % MOVING_VEHICLE_ROUTES.length])!
      const len = polylineLength(road.pts)
      const baseSpeed = kind === 'bus' ? 5.5 : kind === 'okada' ? 9.5 : kind === 'keke' ? 6.5 : 8.5
      out.push({
        roadId: road.id,
        kind,
        t: rng(),
        speed: baseSpeed / len,
        worldSpeed: baseSpeed,
        dir: rng() > 0.5 ? 1 : -1,
        phase: rng() * Math.PI * 2,
        spin: 0,
        color: kind === 'keke' ? PALETTE.keke : kind === 'taxi' ? PALETTE.taxi : kind === 'okada' ? pick(PALETTE.carCols, i * 7 + 1) : kind === 'bus' ? PALETTE.busWhite : pick(PALETTE.carCols, i * 3),
      })
    }
    return out
  }, [])

  const TOTAL = MOVING_COUNT + PARKED.length
  const bodyRef = useRef<THREE.InstancedMesh>(null!)
  const cabinRef = useRef<THREE.InstancedMesh>(null!)
  const wheelRef = useRef<THREE.InstancedMesh>(null!)
  const headRef = useRef<THREE.InstancedMesh>(null!)
  const tailRef = useRef<THREE.InstancedMesh>(null!)
  const WHEEL_TOTAL = TOTAL * 4

  const movingRoutes = useMemo(
    () => moving.map((v) => RESOLVED_ROADS.find((r) => r.id === v.roadId)!.pts),
    [moving],
  )

  const tyreMat = useMemo(() => new THREE.MeshLambertMaterial({ color: '#26262a' }), [])
  // cylinder axis tips from Y to sideways-X once, shared by every wheel
  const qzTip = useMemo(() => new THREE.Quaternion().setFromAxisAngle(AXIS_Z, Math.PI / 2), [])

  const place = (i: number, x: number, y: number, z: number, ry: number, kind: VehicleKind, color: THREE.Color, spin: number, withLights: boolean) => {
    if (!bodyRef.current || !cabinRef.current || !wheelRef.current) return
    const dim = VEHICLE_DIMS[kind]
    _e.set(0, ry, 0); _q.setFromEuler(_e)
    _p.set(x, y + dim.body[1] / 2 + dim.wheelR, z); _s.set(dim.body[0], dim.body[1], dim.body[2])
    _m.compose(_p, _q, _s)
    bodyRef.current.setMatrixAt(i, _m)
    bodyRef.current.setColorAt(i, color)
    // cabin sits offset toward the BACK along local Z
    const cz = dim.cabinZ
    _p.set(x + Math.sin(ry) * cz, y + dim.body[1] + dim.wheelR + dim.cabin[1] / 2 - 0.05, z + Math.cos(ry) * cz)
    _s.set(dim.cabin[0], dim.cabin[1], dim.cabin[2])
    _m.compose(_p, _q, _s)
    cabinRef.current.setMatrixAt(i, _m)
    cabinRef.current.setColorAt(i, CABIN_GLASS)
    // wheels: roll around the own axis, tip the axis sideways, face travel
    dim.wheels.forEach(([wx, wz], wi) => {
      const rx = x + wx * Math.cos(ry) + wz * Math.sin(ry)
      const rz = z - wx * Math.sin(ry) + wz * Math.cos(ry)
      _q.setFromAxisAngle(AXIS_Y, ry)
      _q.multiply(qzTip)
      _q2.setFromAxisAngle(AXIS_Y, spin)
      _q.multiply(_q2)
      _p.set(rx, y + dim.wheelR, rz)
      _s.set(dim.wheelR * 2, 0.24, dim.wheelR * 2)
      _m.compose(_p, _q, _s)
      wheelRef.current.setMatrixAt(i * 4 + wi, _m)
    })
    // okadas have 2 wheels — park the spare slots far below the world
    for (let wi = dim.wheels.length; wi < 4; wi++) {
      _p.set(0, -999, 0)
      _s.set(0.0001, 0.0001, 0.0001)
      _q.identity()
      _m.compose(_p, _q, _s)
      wheelRef.current.setMatrixAt(i * 4 + wi, _m)
    }

    if (!headRef.current || !tailRef.current) return
    if (withLights) {
      // headlight cone — apex at the bonnet, base spread on the road ahead
      const fx = Math.sin(ry)
      const fz = Math.cos(ry)
      _e.set(-Math.PI / 2, 0, 0)
      _q.setFromEuler(_e)
      _q2.setFromAxisAngle(AXIS_Y, ry)
      _q2.multiply(_q)
      _p.set(x + fx * (dim.body[2] / 2 + 2.6), y + 0.7, z + fz * (dim.body[2] / 2 + 2.6))
      _s.set(2.4, 5.4, 2.4)
      _m.compose(_p, _q2, _s)
      headRef.current.setMatrixAt(i, _m)
      // taillights — two small boxes on the rear face
      for (let s = 0; s < 2; s++) {
        const side = s === 0 ? 1 : -1
        const ox = Math.cos(ry) * (dim.body[0] / 2 - 0.25) * side - fx * (dim.body[2] / 2 + 0.08)
        const oz = -Math.sin(ry) * (dim.body[0] / 2 - 0.25) * side - fz * (dim.body[2] / 2 + 0.08)
        _e.set(0, ry, 0)
        _q.setFromEuler(_e)
        _p.set(x + ox, y + dim.wheelR + dim.body[1] * 0.72, z + oz)
        _s.set(0.22, 0.14, 0.1)
        _m.compose(_p, _q, _s)
        tailRef.current.setMatrixAt(i * 2 + s, _m)
      }
    }
  }

  useFrame((state, dtRaw) => {
    const t = state.clock.elapsedTime
    const dt = Math.min(dtRaw, 0.1)

    moving.forEach((v, i) => {
      v.t = (v.t + v.speed * dt * v.dir + 1) % 1
      const pt = pointOnRoute(movingRoutes[i], v.t)
      // right-side lane offset relative to travel direction
      const side = v.dir > 0 ? 1.8 : -1.8
      const nx = Math.cos(pt.angle) * side
      const nz = -Math.sin(pt.angle) * side
      const x = pt.x + nx
      const z = pt.z + nz
      const y = groundHeight(x, z)
      const facing = pt.angle + (v.dir > 0 ? 0 : Math.PI)
      const bikeTilt = v.kind === 'keke' || v.kind === 'okada' ? Math.sin(t * 9 + v.phase) * 0.035 : 0
      // wheel spin: rolling without slipping (spin rate from world speed)
      v.spin += (v.worldSpeed / VEHICLE_DIMS[v.kind].wheelR) * dt
      place(i, x, y, z, facing + bikeTilt, v.kind, v.color, v.spin * (v.dir > 0 ? 1 : -1), true)
    })
    PARKED.forEach((v, i) => {
      place(MOVING_COUNT + i, v.x, groundHeight(v.x, v.z), v.z, v.ry, v.kind, v.color, 0, false)
    })
    if (bodyRef.current) {
      bodyRef.current.instanceMatrix.needsUpdate = true
      if (bodyRef.current.instanceColor) bodyRef.current.instanceColor.needsUpdate = true
    }
    if (cabinRef.current) {
      cabinRef.current.instanceMatrix.needsUpdate = true
      if (cabinRef.current.instanceColor) cabinRef.current.instanceColor.needsUpdate = true
    }
    if (wheelRef.current) wheelRef.current.instanceMatrix.needsUpdate = true

    // night lights fade with the shared world mood (no second clock)
    const k = 1 - Math.exp(-dt * 3)
    HEADLIGHT_MAT.opacity += (worldMood.night * 0.5 - HEADLIGHT_MAT.opacity) * k
    TAILLIGHT_MAT.opacity += (worldMood.night * 0.85 - TAILLIGHT_MAT.opacity) * k
  })

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[geos.box, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={cabinRef} args={[geos.box, mats.flat, TOTAL]} frustumCulled={false} />
      <instancedMesh ref={wheelRef} args={[geos.cylinder, tyreMat, WHEEL_TOTAL]} frustumCulled={false} />
      <instancedMesh ref={headRef} args={[geos.cone, HEADLIGHT_MAT, MOVING_COUNT]} frustumCulled={false} />
      <instancedMesh ref={tailRef} args={[geos.box, TAILLIGHT_MAT, MOVING_COUNT * 2]} frustumCulled={false} />
    </group>
  )
}

/* --------------------------------- player ---------------------------------- */

export interface TravelAnim {
  fromId: string
  toId: string
  transport: TransportId
  startedAt: number
}

const TRAVEL_MS = 850 // matches TRAVEL.transitionMs — the one true duration

export function PlayerAvatar({
  currentLocationId,
  travel,
  avatar,
  onSettle,
  onNearChange,
  onWalkDrain,
}: {
  currentLocationId: string
  travel: TravelAnim | null
  avatar: { skinTone: string; hairColor: string; clothingColor: string }
  onSettle?: (locationId: string) => void
  onNearChange?: (locationId: string | null) => void
  onWalkDrain?: (units: number) => void
}) {
  const { geos, mats } = useWorldAssets()
  const group = useRef<THREE.Group>(null!)
  const legL = useRef<THREE.Mesh>(null!)
  const legR = useRef<THREE.Mesh>(null!)
  const armL = useRef<THREE.Mesh>(null!)
  const armR = useRef<THREE.Mesh>(null!)
  const charRef = useRef<THREE.Group>(null!)
  const ride = useRef<THREE.Group>(null!)

  const colors = useMemo(
    () => ({
      skin: new THREE.Color(avatar.skinTone),
      hair: new THREE.Color(avatar.hairColor),
      cloth: new THREE.Color(avatar.clothingColor),
      leg: new THREE.Color('#2a3550'),
    }),
    [avatar.skinTone, avatar.hairColor, avatar.clothingColor],
  )

  // local movement state (module playerPos is the shared/camera-facing copy)
  const pos = useRef({ x: 0, z: 0, seeded: false })
  const vel = useRef({ x: 0, z: 0 })
  const heading = useRef(0)
  const walkCycle = useRef(0)
  const nearId = useRef<string | null>(null)
  const settleTimer = useRef(0)
  const walkedAccum = useRef(0)
  const lastAnchorId = useRef('')
  /** seconds of arrival-slide remaining (triggered by location changes) */
  const anchorSlide = useRef(0)
  const grid = useMemo(() => colliderGrid(), [])

  useFrame((state, dtRaw) => {
    if (!group.current) return
    const dt = Math.min(dtRaw, 0.05)
    const t = state.clock.elapsedTime

    // seed the shared position once (module state survives tab switches)
    if (!pos.current.seeded) {
      const a = ANCHORS[currentLocationId]
      if (!playerPos.init || playerPos.anchorId !== currentLocationId) {
        // fresh boot, or the position belongs to another location (the
        // player travelled via the 2D map while the world was unmounted)
        // → anchor to the official location
        pos.current.x = a?.standX ?? 0
        pos.current.z = a?.standZ ?? 88
        playerPos.x = pos.current.x
        playerPos.z = pos.current.z
        playerPos.anchorId = currentLocationId
      } else {
        pos.current.x = playerPos.x
        pos.current.z = playerPos.z
      }
      playerPos.init = true
      lastAnchorId.current = currentLocationId
      pos.current.seeded = true
    }

    let riding = false
    let moving = false
    let speed = 0

    if (travel) {
      /* ---------------- journey: the ONE travel system drives --------------- */
      const path = routeBetween(travel.fromId, travel.toId)
      const progress = Math.min(1, (performance.now() - travel.startedAt) / TRAVEL_MS)
      const pt = pointOnRoute(path, progress)
      pos.current.x = pt.x
      pos.current.z = pt.z
      heading.current = pt.angle
      moving = true
      riding = travel.transport !== 'walk'
      vel.current.x = 0
      vel.current.z = 0
      speed = 1
      playerPos.x = pt.x
      playerPos.z = pt.z
      playerPos.speed = 0
      playerPos.sprinting = false
      lastAnchorId.current = travel.toId
      playerPos.anchorId = travel.toId
    } else {
      /* -------------------- free walking: one controller -------------------- */
      const locked = inputLock.locked
      const intent = locked
        ? { ix: 0, iz: 0, sprint: false }
        : combineInputs(joystickState, keyState, sprintButton.held || keyState.sprint)

      const result = stepPlayer(pos.current, vel.current, intent, dt, camState.theta, grid)
      speed = result.speed
      moving = speed > 0.35

      // walked distance → silent energy drain in chunks
      walkedAccum.current += speed * dt
      if (walkedAccum.current >= MOVEMENT.energyStepUnits) {
        onWalkDrain?.(walkedAccum.current * MOVEMENT.energyPerUnit)
        walkedAccum.current = 0
      }

      // when the official location changes (travel, settle, 2D map) start a
      // short arrival slide toward the new stand point — or snap instantly
      // when the change happened out of band (e.g. 2D-map travel while the
      // world tab was closed) and the new anchor is far away
      if (lastAnchorId.current !== currentLocationId) {
        lastAnchorId.current = currentLocationId
        playerPos.anchorId = currentLocationId
        const a0 = ANCHORS[currentLocationId]
        const d0 = a0 ? Math.hypot(a0.standX - pos.current.x, a0.standZ - pos.current.z) : 0
        if (a0 && d0 > 26) {
          pos.current.x = a0.standX
          pos.current.z = a0.standZ
          vel.current.x = 0
          vel.current.z = 0
        } else {
          anchorSlide.current = 1.6
        }
      }

      // near-location detection + settling (walking arrival)
      const zone = nearestLocationZone(pos.current.x, pos.current.z)
      if (zone !== nearId.current) {
        nearId.current = zone
        onNearChange?.(zone)
      }

      // arrival slide: a brief, capped walk to the official stand point
      // after a location transition — pausing mid-exploration never
      // rewinds the player, and a pending settle is never fought
      const a = ANCHORS[currentLocationId]
      if (!moving && a && anchorSlide.current > 0 && !(zone && zone !== currentLocationId)) {
        anchorSlide.current = Math.max(0, anchorSlide.current - dt)
        const dx = a.standX - pos.current.x
        const dz = a.standZ - pos.current.z
        const d = Math.hypot(dx, dz)
        if (d > 0.6 && d < 26) {
          const k = 1 - Math.exp(-dt * 2.2)
          const step = Math.min(d * k, 5.5 * dt) // capped walking-pace slide
          pos.current.x += (dx / d) * step
          pos.current.z += (dz / d) * step
        }
      }

      playerPos.x = pos.current.x
      playerPos.z = pos.current.z
      playerPos.speed = speed
      playerPos.sprinting = intent.sprint && moving

      if (zone && zone !== currentLocationId && speed < 0.6) {
        settleTimer.current += dt
        if (settleTimer.current >= MOVEMENT.settleDelay) {
          settleTimer.current = 0
          onSettle?.(zone)
        }
      } else {
        settleTimer.current = 0
      }
    }

    const ground = groundHeight(pos.current.x, pos.current.z)
    playerPos.y = ground
    group.current.position.set(pos.current.x, ground, pos.current.z)

    // orient toward movement (shortest arc)
    if (moving && !riding) {
      const targetHeading = Math.atan2(vel.current.x, vel.current.z)
      if (speed > 0.4) {
        let diff = targetHeading - heading.current
        while (diff > Math.PI) diff -= Math.PI * 2
        while (diff < -Math.PI) diff += Math.PI * 2
        heading.current += diff * (1 - Math.exp(-dt * 12))
      }
    }
    group.current.rotation.y = heading.current

    // seat height + ride visibility are per-frame state, not JSX state
    if (charRef.current) charRef.current.position.y = riding ? 0.78 : 0
    if (ride.current) ride.current.visible = riding && moving

    // animation: walk / run / ride / idle — driven by real speed
    const speed01 = Math.min(1, speed / MOVEMENT.walkSpeed)
    const sprinting = playerPos.sprinting
    if (moving && !riding) {
      walkCycle.current += dt * (6 + speed * (sprinting ? 1.55 : 1.9))
      const swing = Math.sin(walkCycle.current) * (0.42 + speed01 * 0.3)
      legL.current.rotation.x = swing
      legR.current.rotation.x = -swing
      armL.current.rotation.x = -swing * 0.8
      armR.current.rotation.x = swing * 0.8
      if (charRef.current) charRef.current.rotation.x = sprinting ? 0.09 : 0.03 * speed01
      group.current.position.y = ground + Math.abs(Math.sin(walkCycle.current)) * (0.06 + speed01 * 0.05)
    } else if (moving && riding) {
      legL.current.rotation.x = 1.2 // seated
      legR.current.rotation.x = 1.2
      armL.current.rotation.x = 0.9
      armR.current.rotation.x = 0.9
      if (charRef.current) charRef.current.rotation.x = 0
      group.current.position.y = ground
    } else {
      const idle = Math.sin(t * 1.8) * 0.03
      legL.current.rotation.x = 0
      legR.current.rotation.x = 0
      armL.current.rotation.x = idle
      armR.current.rotation.x = -idle
      if (charRef.current) charRef.current.rotation.x = 0
      group.current.position.y = ground + Math.sin(t * 1.8) * 0.015
    }
  })

  const skinMat = useMemo(() => new THREE.MeshLambertMaterial({ color: colors.skin }), [colors.skin])
  const hairMat = useMemo(() => new THREE.MeshLambertMaterial({ color: colors.hair }), [colors.hair])
  const clothMat = useMemo(() => new THREE.MeshLambertMaterial({ color: colors.cloth }), [colors.cloth])
  const legMat = useMemo(() => new THREE.MeshLambertMaterial({ color: colors.leg }), [colors.leg])

  return (
    <group ref={group}>
      {/* blob shadow */}
      <mesh geometry={geos.circle} material={mats.shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} scale={[1.7, 1.7, 1.7]} />
      {/* ride (keke shape when travelling by keke/taxi) */}
      <group ref={ride} visible={false} position={[0, 0.35, 0]}>
        <mesh geometry={geos.box} position={[0, 0.55, 0]} scale={[1.35, 1.05, 2.5]}>
          <meshLambertMaterial color="#e8c820" />
        </mesh>
        <mesh geometry={geos.box} position={[0, 1.4, -0.5]} scale={[1.15, 0.7, 1.3]}>
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        <mesh geometry={geos.cylinder} position={[-0.7, 0.3, 0.8]} rotation={[0, 0, Math.PI / 2]} scale={[0.6, 0.24, 0.6]}>
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        <mesh geometry={geos.cylinder} position={[0.7, 0.3, 0.8]} rotation={[0, 0, Math.PI / 2]} scale={[0.6, 0.24, 0.6]}>
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
        <mesh geometry={geos.cylinder} position={[0, 0.3, -0.85]} rotation={[Math.PI / 2, 0, 0]} scale={[0.6, 0.24, 0.6]}>
          <meshLambertMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* the character — low-poly mirror of the 2D avatar config */}
      <group ref={charRef} position={[0, 0, 0]}>
        {/* legs */}
        <mesh ref={legL} material={legMat} geometry={geos.box} position={[-0.14, 0.5, 0]} scale={[0.2, 0.55, 0.24]} />
        <mesh ref={legR} material={legMat} geometry={geos.box} position={[0.14, 0.5, 0]} scale={[0.2, 0.55, 0.24]} />
        {/* body */}
        <mesh material={clothMat} geometry={geos.box} position={[0, 1.08, 0]} scale={[0.56, 0.62, 0.36]} />
        {/* arms (swing while walking) */}
        <mesh ref={armL} material={clothMat} geometry={geos.box} position={[-0.36, 1.28, 0]} scale={[0.13, 0.5, 0.16]} />
        <mesh ref={armR} material={clothMat} geometry={geos.box} position={[0.36, 1.28, 0]} scale={[0.13, 0.5, 0.16]} />
        {/* head */}
        <mesh material={skinMat} geometry={geos.sphere} position={[0, 1.62, 0]} scale={[0.42, 0.46, 0.4]} />
        {/* hair cap */}
        <mesh material={hairMat} geometry={geos.sphere} position={[0, 1.72, -0.02]} scale={[0.44, 0.36, 0.44]} />
        {/* face marker keeps facing readable */}
        <mesh material={hairMat} geometry={geos.box} position={[0, 1.62, 0.18]} scale={[0.3, 0.09, 0.08]} />
      </group>
    </group>
  )
}
