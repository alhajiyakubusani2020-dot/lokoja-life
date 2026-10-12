'use client'

/**
 * LOKOJA LIFE — Ground: terrain, rivers & roads (Stage 3.5)
 * ----------------------------------------------------------
 * The continuous land of Lokoja: one displaced terrain mesh painted with
 * vertex colours (grass, laterite earth, river sand, Patti rock), a real
 * water surface where the Niger and Benue carve their beds, the road
 * network draped over the ground, and the old Niger bridge.
 */

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useWorldAssets, worldMood, WINDOW_MAT, Instances, type PartSpec } from './assets'
import {
  terrainHeight, terrainZoneAt, WATER_LEVEL, mapToWorld,
} from '@/game/systems/terrain'
import {
  RESOLVED_ROADS, RIVER_NIGER_WORLD, RIVER_BENUE_WORLD, BRIDGE, groundHeight, pointOnRoute,
} from '@/game/data/world3d'

/* --------------------------------- terrain --------------------------------- */

// Stage 3.6: the playable world grew from ±210 to ±300 — the mesh and
// water plane grow with it (bounds still fully covered)
const TERRAIN_SIZE = 640
const TERRAIN_SEG = 208

export function TerrainMesh() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEG, TERRAIN_SEG)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)

    const grass = new THREE.Color('#79a651')
    const grassDeep = new THREE.Color('#619147')
    const grassDry = new THREE.Color('#9aa85e')
    const sand = new THREE.Color('#e0cd98')
    const dirt = new THREE.Color('#b99a68')
    const rock = new THREE.Color('#8a755c')
    const rockLight = new THREE.Color('#a3907a')
    const bed = new THREE.Color('#3f6b5c')
    const c = new THREE.Color()

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const h = terrainHeight(x, z)
      pos.setY(i, h)

      const zone = terrainZoneAt(x, z)
      // base grass with gentle variation
      const n = (Math.sin(x * 0.11) + Math.cos(z * 0.13)) * 0.5
      c.copy(grass).lerp(grassDeep, Math.max(0, n)).lerp(grassDry, Math.max(0, -n) * 0.7)

      // settled districts → dry earth tone
      c.lerp(dirt, zone.settled * 0.55)
      // river banks → sand
      c.lerp(sand, zone.riverProximity * 0.85)
      // patti slopes → rock, higher = lighter
      if (zone.hilliness > 0.04) {
        const rocky = Math.min(1, zone.hilliness * 1.35)
        c.lerp(rock, rocky * 0.8)
        if (zone.height > 24) c.lerp(rockLight, Math.min(1, (zone.height - 24) / 14) * 0.55)
      }
      // underwater bed
      if (h < WATER_LEVEL + 0.35) c.lerp(bed, Math.min(1, (WATER_LEVEL + 0.35 - h) / 1.6))

      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow={false}>
      <meshLambertMaterial vertexColors />
    </mesh>
  )
}

/* ---------------------------------- water ---------------------------------- */

const WATER_SIZE = 800
const WATER_SEG = 96

export function WaterMesh() {
  const { mats } = useWorldAssets()
  const ref = useRef<THREE.Mesh>(null!)
  const base = useRef<Float32Array | null>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WATER_SIZE, WATER_SIZE, WATER_SEG, WATER_SEG)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    if (!base.current) base.current = new Float32Array(pos.array as Float32Array)
    const arr = pos.array as Float32Array
    const t = state.clock.elapsedTime
    // cheap 2-wave ripple — step 2 keeps it a light touch on the CPU
    for (let i = 0; i < pos.count; i += 2) {
      const x = base.current[i * 3]
      const z = base.current[i * 3 + 2]
      arr[i * 3 + 1] = Math.sin(x * 0.055 + t * 1.15) * 0.09 + Math.sin(z * 0.042 - t * 0.9) * 0.08
    }
    pos.needsUpdate = true
    // night water deepens with the mood (shared singleton material)
    mats.water.color.copy(WATER_BASE).lerp(WATER_DEEP, worldMood.night * 0.5)
  })

  return (
    <mesh ref={ref} geometry={geometry} material={mats.water} position={[0, WATER_LEVEL, 0]} />
  )
}

const WATER_BASE = new THREE.Color('#1f7a6d')
const WATER_DEEP = new THREE.Color('#12473e')

/** Foam + boats at the world-famous meeting of the waters. */
export function ConfluenceLife() {
  const { geos } = useWorldAssets()
  const canoe1 = useRef<THREE.Group>(null!)
  const canoe2 = useRef<THREE.Group>(null!)
  const rings = useRef<THREE.Group>(null!)

  const niger = useMemo(() => RIVER_NIGER_WORLD(), [])
  const benue = useMemo(() => RIVER_BENUE_WORLD(), [])
  const confluence = useMemo(() => mapToWorld(82.5, 68.5), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // canoes drift lazily downstream
    if (canoe1.current) {
      const p = pointOnRoute(niger, ((t * 0.006) % 1))
      canoe1.current.position.set(p.x, WATER_LEVEL + 0.25, p.z)
      canoe1.current.rotation.y = p.angle
      canoe1.current.rotation.z = Math.sin(t * 1.4) * 0.045
    }
    if (canoe2.current) {
      const p = pointOnRoute(benue, (1 - (t * 0.008) % 1))
      canoe2.current.position.set(p.x, WATER_LEVEL + 0.25, p.z)
      canoe2.current.rotation.y = p.angle
      canoe2.current.rotation.z = Math.sin(t * 1.1 + 2) * 0.05
    }
    // confluence swirl rings pulse
    if (rings.current) {
      rings.current.children.forEach((r, i) => {
        const s = 1.6 + ((t * 0.35 + i * 1.1) % 2.2)
        r.scale.set(s, s, s)
        const mat = (r as THREE.Mesh).material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.5 - (s - 1.6) * 0.22)
      })
    }
  })

  return (
    <group>
      {/* swirl rings where the rivers kiss */}
      <group ref={rings} position={[confluence.x, WATER_LEVEL + 0.12, confluence.z]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} geometry={geos.torus} rotation={[-Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#dff2ec" transparent opacity={0.4} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* two fisher canoes */}
      <group ref={canoe1}>
        <mesh geometry={geos.box} scale={[1.5, 0.55, 6.4]} position={[0, 0, 0]}>
          <meshLambertMaterial color="#8a5a34" />
        </mesh>
        <mesh geometry={geos.box} scale={[1.1, 0.5, 1]} position={[0, 0.5, 1.4]}>
          <meshLambertMaterial color="#5c3a20" />
        </mesh>
      </group>
      <group ref={canoe2}>
        <mesh geometry={geos.box} scale={[1.5, 0.55, 6.4]} position={[0, 0, 0]}>
          <meshLambertMaterial color="#7a5a44" />
        </mesh>
        <mesh geometry={geos.box} scale={[1.1, 0.5, 1]} position={[0, 0.5, -1.2]}>
          <meshLambertMaterial color="#4a3020" />
        </mesh>
      </group>
    </group>
  )
}

/* ---------------------------------- roads ---------------------------------- */

function buildRoadRibbon(
  pts: Array<{ x: number; z: number }>,
  halfWidth: number,
  color: THREE.Color,
  yLift: number,
  samplesPerUnit = 0.35,
  centerOffset = 0,
): { positions: Float32Array; normals: Float32Array; indices: number[]; color: number[] } {
  // resample the polyline by distance
  const sampled: Array<{ x: number; z: number; nx: number; nz: number }> = []
  let total = 0
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
  const step = 1 / samplesPerUnit
  const n = Math.max(2, Math.round(total / step))
  for (let i = 0; i <= n; i++) {
    const p = pointOnRoute(pts, i / n)
    const nx = Math.cos(p.angle)
    const nz = -Math.sin(p.angle)
    sampled.push({ x: p.x + nx * centerOffset, z: p.z + nz * centerOffset, nx, nz })
  }

  const positions: number[] = []
  const normals: number[] = []
  const indices: number[] = []
  const colors: number[] = []

  sampled.forEach((s, i) => {
    const yL = groundHeight(s.x - s.nx * halfWidth, s.z - s.nz * halfWidth) + yLift
    const yR = groundHeight(s.x + s.nx * halfWidth, s.z + s.nz * halfWidth) + yLift
    positions.push(s.x - s.nx * halfWidth, yL, s.z - s.nz * halfWidth)
    positions.push(s.x + s.nx * halfWidth, yR, s.z + s.nz * halfWidth)
    normals.push(0, 1, 0, 0, 1, 0)
    colors.push(color.r, color.g, color.b, color.r, color.g, color.b)
    if (i < sampled.length - 1) {
      const a = i * 2
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  })

  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices,
    color: colors,
  }
}

export function RoadsMesh() {
  const geometry = useMemo(() => {
    const positions: number[] = []
    const normals: number[] = []
    const colors: number[] = []
    const indices: number[] = []
    let vertexOffset = 0

    const push = (
      pts: Array<{ x: number; z: number }>,
      halfWidth: number,
      color: THREE.Color,
      lift: number,
      centerOffset = 0,
    ) => {
      const r = buildRoadRibbon(pts, halfWidth, color, lift, 0.35, centerOffset)
      for (let i = 0; i < r.positions.length; i += 3) {
        positions.push(r.positions[i], r.positions[i + 1], r.positions[i + 2])
      }
      for (let i = 0; i < r.normals.length; i += 3) {
        normals.push(r.normals[i], r.normals[i + 1], r.normals[i + 2])
      }
      // normalise color into per-vertex triples
      colors.push(...r.color)
      r.indices.forEach((idx) => indices.push(idx + vertexOffset))
      vertexOffset += r.positions.length / 3
    }

    const main = new THREE.Color('#6f675c')
    const minor = new THREE.Color('#b0812a')
    const shoulder = new THREE.Color('#c9b184') // dusty laterite shoulder
    const walkway = new THREE.Color('#b3a68e') // concrete sidewalk
    const gutter = new THREE.Color('#57514a') // drainage line along main roads

    for (const road of RESOLVED_ROADS) {
      const hw = road.kind === 'main' ? 2.7 : 2
      const asphalt = road.kind === 'main' ? main : minor
      // dusty shoulder on every road — no floating asphalt
      push(road.pts, hw + 1.5, shoulder, 0.07)
      if (road.kind === 'main') {
        // sidewalks outside the asphalt
        push(road.pts, 1.35, walkway, 0.24, -(hw + 1.35))
        push(road.pts, 1.35, walkway, 0.24, hw + 1.35)
        // drainage/curb lines hugging the asphalt edges (above the asphalt)
        push(road.pts, 0.3, gutter, 0.155, -(hw + 0.1))
        push(road.pts, 0.3, gutter, 0.155, hw + 0.1)
      }
      push(road.pts, hw, asphalt, 0.14)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3))
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    geo.setIndex(indices)
    return geo
  }, [])

  return (
    <mesh geometry={geometry}>
      <meshLambertMaterial vertexColors />
    </mesh>
  )
}

/* --------------------- markings & patches (Stage 3.6) ---------------------- */

let roadDetailCache: { dashes: PartSpec[]; patches: PartSpec[] } | null = null
export function computeRoadDetails() {
  if (roadDetailCache) return roadDetailCache
  const dashes: PartSpec[] = []
  const patches: PartSpec[] = []
  const paint = new THREE.Color('#e8e2d2')
  const patchColor = new THREE.Color('#5c534a')
  const rng = (() => {
    let a = 606060
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  })()

  for (const road of RESOLVED_ROADS) {
    let len = 0
    for (let i = 1; i < road.pts.length; i++) len += Math.hypot(road.pts[i].x - road.pts[i - 1].x, road.pts[i].z - road.pts[i - 1].z)
    if (road.kind === 'main') {
      // centre-line dashes along every paved artery
      const count = Math.max(2, Math.floor(len / 9))
      for (let i = 0; i < count; i++) {
        const p = pointOnRoute(road.pts, (i + 0.5) / count)
        const y = groundHeight(p.x, p.z)
        dashes.push({ x: p.x, y: y + 0.165, z: p.z, ry: p.angle, s: [0.34, 0.02, 2.4], color: paint })
      }
    } else {
      // potholes & laterite patches on minor roads — sparse, honest wear
      const count = Math.max(1, Math.floor(len / 34))
      for (let i = 0; i < count; i++) {
        if (rng() < 0.4) continue
        const p = pointOnRoute(road.pts, (i + rng()) / count)
        const side = rng() > 0.5 ? 1 : -1
        const nx = Math.cos(p.angle) * 1.1 * side
        const nz = -Math.sin(p.angle) * 1.1 * side
        const y = groundHeight(p.x + nx, p.z + nz)
        patches.push({ x: p.x + nx, y: y + 0.145, z: p.z + nz, ry: p.angle, s: [1.1 + rng() * 1.2, 0.02, 0.8 + rng()], color: patchColor })
      }
    }
  }
  roadDetailCache = { dashes, patches }
  return roadDetailCache
}

export function RoadDetails() {
  const { geos, mats } = useWorldAssets()
  const { dashes, patches } = useMemo(() => computeRoadDetails(), [])
  return (
    <group>
      <Instances geometry={geos.box} material={mats.flat} parts={dashes} />
      <Instances geometry={geos.circle} material={mats.flat} parts={patches} />
    </group>
  )
}

/* ---------------------------------- bridge --------------------------------- */

export function BridgeMesh() {
  const deckY = WATER_LEVEL + 3.4
  const parts = useMemo(() => {
    const out: PartSpec[] = []
    // railings (both sides) built as segments along the deck
    for (let i = -1; i <= 1; i += 2) {
      out.push({ x: 0, y: 1.1, z: i * 3.1, s: [BRIDGE.span + 20, 0.35, 0.35] })
      for (let p = -BRIDGE.span / 2 - 8; p <= BRIDGE.span / 2 + 8; p += 6) {
        out.push({ x: p, y: 0.55, z: i * 3.1, s: [0.3, 1.1, 0.3] })
      }
    }
    return out
  }, [])

  return (
    <group position={[BRIDGE.center.x, 0, BRIDGE.center.z]} rotation={[0, BRIDGE.angle, 0]}>
      {/* deck */}
      <mesh position={[0, deckY - 0.2, 0]}>
        <boxGeometry args={[BRIDGE.span + 20, 0.55, 6.4]} />
        <meshLambertMaterial color="#9a8a70" />
      </mesh>
      {/* railings */}
      <group position={[0, deckY, 0]}>
        {parts.map((p, i) => (
          <mesh key={i} position={[p.x, p.y, p.z]} scale={typeof p.s === 'number' ? [p.s, p.s, p.s] : p.s}>
            <boxGeometry args={[1, 1, 1]} />
            <meshLambertMaterial color="#8a6a3b" />
          </mesh>
        ))}
      </group>
      {/* pillars down to the riverbed */}
      {[-BRIDGE.span / 4, BRIDGE.span / 4].map((px, i) => (
        <mesh key={i} position={[px, WATER_LEVEL - 1.4, 0]}>
          <boxGeometry args={[2.2, 4.2, 3.4]} />
          <meshLambertMaterial color="#8a7a62" />
        </mesh>
      ))}
      {/* approach abutments */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[s * (BRIDGE.span / 2 + 9), deckY - 1.6, 0]}>
          <boxGeometry args={[4, 3.4, 7]} />
          <meshLambertMaterial color="#8a7a62" />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------- streetlights ------------------------------- */

/**
 * Street furniture along the main roads — computed once, shared by the
 * poles and the night-glow layers.
 */
interface StreetLightData {
  poles: PartSpec[]
  bulbs: PartSpec[]
  cones: PartSpec[]
}

let streetLightCache: StreetLightData | null = null
export function computeStreetLights(): StreetLightData {
  if (streetLightCache) return streetLightCache
  const poles: PartSpec[] = []
  const bulbs: PartSpec[] = []
  const cones: PartSpec[] = []
  const poleColor = new THREE.Color('#3a3a38')
  for (const road of RESOLVED_ROADS) {
    if (road.kind !== 'main') continue
    let len = 0
    for (let i = 1; i < road.pts.length; i++) len += Math.hypot(road.pts[i].x - road.pts[i - 1].x, road.pts[i].z - road.pts[i - 1].z)
    const count = Math.floor(len / 26)
    for (let i = 0; i < count; i++) {
      const p = pointOnRoute(road.pts, (i + 0.5) / count)
      const side = i % 2 === 0 ? 1 : -1
      const nx = Math.cos(p.angle) * 3.6 * side
      const nz = -Math.sin(p.angle) * 3.6 * side
      const x = p.x + nx
      const z = p.z + nz
      const y = groundHeight(x, z)
      poles.push({ x, y: y + 2.6, z, ry: p.angle, s: [0.22, 5.2, 0.22], color: poleColor })
      // arm reaching over the road
      poles.push({ x: x - nx * 0.9, y: y + 5, z: z - nz * 0.9, ry: p.angle, s: [0.16, 0.16, 1.9], color: poleColor })
      bulbs.push({ x: x - nx * 1.7, y: y + 4.85, z: z - nz * 1.7, s: [0.5, 0.35, 0.5] })
      cones.push({ x: x - nx * 1.7, y: y + 2.2, z: z - nz * 1.7, s: [3.2, 5.2, 3.2] })
    }
  }
  streetLightCache = { poles, bulbs, cones }
  return streetLightCache
}

export function StreetLights() {
  const { geos, mats } = useWorldAssets()
  const { poles } = useMemo(() => computeStreetLights(), [])
  return <Instances geometry={geos.box} material={mats.flat} parts={poles} />
}

export function NightGlow() {
  const { geos, mats } = useWorldAssets()
  const { bulbs, cones } = useMemo(() => computeStreetLights(), [])

  const bulbRef = useRef<THREE.InstancedMesh>(null!)
  const coneRef = useRef<THREE.InstancedMesh>(null!)

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 2.5)
    const bulbMat = bulbRef.current?.material as THREE.MeshLambertMaterial | undefined
    const coneMat = coneRef.current?.material as THREE.MeshBasicMaterial | undefined
    if (bulbMat) bulbMat.emissiveIntensity = THREE.MathUtils.lerp(bulbMat.emissiveIntensity, worldMood.night * 1.6, k)
    if (coneMat) coneMat.opacity = THREE.MathUtils.lerp(coneMat.opacity, worldMood.night * 0.16, k)
    // Stage 3.6: building windows glow after dark (module singleton mat)
    WINDOW_MAT.emissiveIntensity = THREE.MathUtils.lerp(WINDOW_MAT.emissiveIntensity, worldMood.night * 1.25, k)
  })

  return (
    <group>
      <instancedMesh ref={bulbRef} args={[geos.box, BULB_MAT, bulbs.length]} />
      <instancedMesh ref={coneRef} args={[geos.cone, GLOW_MAT, cones.length]} />
    </group>
  )
}

// module-singleton materials — one canvas exists at a time, and useFrame
// drifts their glow values every frame
const BULB_MAT = new THREE.MeshLambertMaterial({ color: '#fff8e0', emissive: new THREE.Color('#ffe9a8'), emissiveIntensity: 0 })
const GLOW_MAT = new THREE.MeshBasicMaterial({
  color: '#ffe9a8',
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  side: THREE.DoubleSide,
})
