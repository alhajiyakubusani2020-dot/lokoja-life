'use client'

/**
 * LOKOJA LIFE — 3D Terrain (Stage 3D)
 * ------------------------------------
 * The land itself: heightfield from layout.heightAt (shared with the
 * player controller, so feet always meet ground), the Niger and Benue,
 * their confluence foam, laterite roads, and the confluence bridge.
 */

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  BRIDGES, heightAt, riverInfo, ROADS, RIVERS, WATER_Y, WORLD_HALF,
} from '@/game/world3d/layout'

/* -------------------------------- terrain ---------------------------------- */

const SEG = 128

function TerrainMesh() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, SEG, SEG)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const colors = new Float32Array(pos.count * 3)

    const cGrass = new THREE.Color('#7d9c50')
    const cDry = new THREE.Color('#a39a5c')
    const cSand = new THREE.Color('#cdb680')
    const cHigh = new THREE.Color('#8a9a5e')
    const cRock = new THREE.Color('#94856a')

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = heightAt(x, z)
      pos.setY(i, y)

      // colour by altitude + slope + riverbanks
      const n = Math.sin(x * 0.11 + z * 0.07) * 0.5 + Math.sin(x * 0.031 - z * 0.043) * 0.5
      const c = cGrass.clone().lerp(cDry, Math.max(0, n) * 0.45)
      if (y > 7) c.lerp(cHigh, Math.min(1, (y - 7) / 10))
      if (y > 14) c.lerp(cRock, Math.min(1, (y - 14) / 12))
      // sandy river banks
      const { d, halfWidth } = riverInfo(x, z)
      const bankT = 1 - Math.min(1, Math.abs(d - (halfWidth + 1)) / 5)
      if (bankT > 0) c.lerp(cSand, bankT * 0.45)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} metalness={0} />
    </mesh>
  )
}

/* --------------------------------- rivers ---------------------------------- */

function riverGeometry(points: [number, number][], width: number, y: number): THREE.BufferGeometry {
  // ribbon along the centreline with soft edge verts (for slight shore colour)
  const verts: number[] = []
  const uvs: number[] = []
  const idx: number[] = []
  const dirs: THREE.Vector2[] = []

  for (let i = 0; i < points.length; i++) {
    const [x, z] = points[i]
    const prev = points[Math.max(0, i - 1)]
    const next = points[Math.min(points.length - 1, i + 1)]
    const dx = next[0] - prev[0]
    const dz = next[1] - prev[1]
    const len = Math.hypot(dx, dz) || 1
    dirs.push(new THREE.Vector2(dx / len, dz / len))
  }

  let cursor = 0
  for (let i = 0; i < points.length; i++) {
    const [x, z] = points[i]
    const d = dirs[i]
    const nx = -d.y
    const nz = d.x
    const hw = width / 2
    verts.push(x + nx * hw, y, z + nz * hw)
    verts.push(x - nx * hw, y, z - nz * hw)
    uvs.push(cursor, 0, cursor, 1)
    cursor += 1
    if (i < points.length - 1) {
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

function Rivers() {
  const nigerRef = useRef<THREE.Mesh>(null)
  const foamRef = useRef<THREE.Mesh>(null)

  const geos = useMemo(
    () => RIVERS.map((r) => riverGeometry(r.points, r.width, WATER_Y)),
    [],
  )

  useFrame((state) => {
    // gentle water shimmer — one material trick, cheap
    const t = state.clock.elapsedTime
    for (const g of geos) void g
    if (nigerRef.current) {
      const m = nigerRef.current.material as THREE.MeshStandardMaterial
      m.roughness = 0.14 + Math.sin(t * 0.7) * 0.05
    }
    if (foamRef.current) {
      foamRef.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06)
      ;(foamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.26 + Math.sin(t * 2.1) * 0.08
    }
  })

  const confluence = RIVERS[0].points[RIVERS[0].points.length - 1]

  return (
    <group>
      {geos.map((g, i) => (
        <mesh key={RIVERS[i].id} ref={i === 0 ? nigerRef : undefined} geometry={g} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={i === 2 ? '#2e8a80' : '#2f8fa0'}
            roughness={0.3}
            metalness={0.05}
            transparent
            opacity={0.93}
          />
        </mesh>
      ))}
      {/* confluence foam — where the Niger kisses the Benue */}
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} position={[confluence[0], WATER_Y + 0.06, confluence[1]]}>
        <circleGeometry args={[9, 24]} />
        <meshBasicMaterial color="#eaf5ee" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ---------------------------------- roads ----------------------------------- */

function roadGeometry(points: [number, number][], width: number): THREE.BufferGeometry {
  // resample the polyline into short steps so the ribbon drapes the terrain
  // smoothly instead of stretching into wall-like slabs across slopes
  const dense: [number, number][] = []
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i]
    const [bx, bz] = points[i + 1]
    const len = Math.hypot(bx - ax, bz - az)
    const steps = Math.max(1, Math.round(len / 3.2))
    for (let s = 0; s < steps; s++) {
      const t = s / steps
      dense.push([ax + (bx - ax) * t, az + (bz - az) * t])
    }
  }
  dense.push(points[points.length - 1])

  const verts: number[] = []
  const idx: number[] = []
  for (let i = 0; i < dense.length; i++) {
    const [x, z] = dense[i]
    const prev = dense[Math.max(0, i - 1)]
    const next = dense[Math.min(dense.length - 1, i + 1)]
    const dx = next[0] - prev[0]
    const dz = next[1] - prev[1]
    const len = Math.hypot(dx, dz) || 1
    const nx = (-dz / len) * (width / 2)
    const nz = (dx / len) * (width / 2)
    const yL = heightAt(x + nx, z + nz) + 0.07
    const yR = heightAt(x - nx, z - nz) + 0.07
    verts.push(x + nx, yL, z + nz)
    verts.push(x - nx, yR, z - nz)
    if (i < dense.length - 1) {
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

function Roads() {
  const geos = useMemo(() => ROADS.map((r) => roadGeometry(r, 5.6)), [])
  return (
    <group>
      {geos.map((g, i) => (
        <mesh key={i} geometry={g} receiveShadow>
          <meshStandardMaterial color="#b0713c" roughness={1} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}

/* --------------------------------- bridges ---------------------------------- */

function Bridges() {
  return (
    <group>
      {BRIDGES.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]} rotation={[0, b.rotY, 0]}>
          {/* deck */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.width, 0.6, b.length]} />
            <meshStandardMaterial color="#9a8570" roughness={0.9} />
          </mesh>
          {/* railings */}
          <mesh position={[b.width / 2 - 0.15, 0.65, 0]}>
            <boxGeometry args={[0.24, 0.7, b.length]} />
            <meshStandardMaterial color="#7a6650" roughness={0.9} />
          </mesh>
          <mesh position={[-b.width / 2 + 0.15, 0.65, 0]}>
            <boxGeometry args={[0.24, 0.7, b.length]} />
            <meshStandardMaterial color="#7a6650" roughness={0.9} />
          </mesh>
          {/* pillars */}
          {[-b.length / 2 + 2, 0, b.length / 2 - 2].map((z, j) => (
            <mesh key={j} position={[0, -1.4, z]}>
              <boxGeometry args={[1.1, 2.4, 1.1]} />
              <meshStandardMaterial color="#8a7660" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/* ---------------------------------- export ---------------------------------- */

export function WorldTerrain() {
  return (
    <group>
      <TerrainMesh />
      <Rivers />
      <Roads />
      <Bridges />
    </group>
  )
}
