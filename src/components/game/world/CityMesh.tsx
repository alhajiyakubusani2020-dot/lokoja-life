'use client'

/**
 * LOKOJA LIFE — City Mesh (Stage 3D)
 * -----------------------------------
 * Everything the eye reads as "a Nigerian city", built from instanced
 * primitives so the whole skyline costs a handful of draw calls:
 * buildings + roofs, market stalls, trees, street lamps, plus the
 * bespoke landmark structures at each location anchor and floating
 * location labels styled after the R1 design language.
 *
 * Window glow / lamp glow read atmoLive.nightGlow (driven by the REAL
 * world clock) — no React re-render on time changes.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  ANCHORS, BUILDINGS, heightAt, LAMPS, POINTS_OF_INTEREST, ROOF_TONES, STALLS, STALL_TONES,
  TREE_TONES, TREES, WALL_TONES, WATER_Y, type WorldAnchor,
} from '@/game/world3d/layout'
import { atmoLive } from './atmosphere'

/* ----------------------------- shared textures ------------------------------ */

/** window grid texture: white walls + darker glass (map) + glowing mask (emissive) */
function makeWindowTextures(): { map: THREE.CanvasTexture; emissive: THREE.CanvasTexture } {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const eCanvas = document.createElement('canvas')
  eCanvas.width = size
  eCanvas.height = size
  const eCtx = eCanvas.getContext('2d')!

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)
  eCtx.fillStyle = '#000000'
  eCtx.fillRect(0, 0, size, size)

  const cols = 4
  const rows = 3
  const padX = 18
  const padY = 22
  const wW = (size - padX * (cols + 1)) / cols
  const wH = (size - padY * (rows + 1) - 46) / rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = padX + c * (wW + padX)
      const y = padY + r * (wH + padY)
      ctx.fillStyle = '#3a4448'
      ctx.fillRect(x, y, wW, wH)
      ctx.fillStyle = 'rgba(255,255,255,0.28)'
      ctx.fillRect(x, y, wW * 0.42, wH)
      // emissive mask: lit interior
      eCtx.fillStyle = '#ffb95e'
      eCtx.fillRect(x + 1, y + 1, wW - 2, wH - 2)
    }
  }
  // ground-floor shop band
  ctx.fillStyle = '#4a3f34'
  ctx.fillRect(padX, size - 40, size - padX * 2, 26)
  eCtx.fillStyle = '#ffd9a0'
  eCtx.fillRect(padX, size - 40, size - padX * 2, 26)

  const map = new THREE.CanvasTexture(canvas)
  const emissive = new THREE.CanvasTexture(eCanvas)
  map.colorSpace = THREE.SRGBColorSpace
  emissive.colorSpace = THREE.SRGBColorSpace
  return { map, emissive }
}

/** rounded-pill label sprite texture (name only — R1 typographic style) */
function makeLabelTexture(text: string): THREE.CanvasTexture {
  const w = 512
  const h = 128
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, w, h)

  // pill
  ctx.fillStyle = 'rgba(16, 22, 17, 0.78)'
  const r = 26
  const x0 = 26
  const y0 = 34
  const x1 = w - 26
  const y1 = h - 20
  ctx.beginPath()
  ctx.roundRect(x0, y0, x1 - x0, y1 - y0, r)
  ctx.fill()
  ctx.strokeStyle = 'rgba(232, 163, 23, 0.55)'
  ctx.lineWidth = 3
  ctx.stroke()

  // gold pin dot
  ctx.fillStyle = '#e8a317'
  ctx.beginPath()
  ctx.arc(x0 + 34, h / 2 - 4, 8, 0, Math.PI * 2)
  ctx.fill()

  // name
  ctx.fillStyle = '#fdf9ef'
  ctx.font = '700 44px "Outfit", "Segoe UI", sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x0 + 56, h / 2 - 2, w - x0 - 92)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ------------------------------ instanced base ------------------------------ */

interface InstancedProps {
  count: number
  setup: (i: number, m: THREE.Object3D, color: THREE.Color) => void
  children: React.ReactNode
  castShadow?: boolean
  receiveShadow?: boolean
}

/** thin wrapper that fills an InstancedMesh once on mount */
function InstancedGroup({ count, setup, children, castShadow = false, receiveShadow = false }: InstancedProps) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Object3D()
    const color = new THREE.Color('#ffffff')
    for (let i = 0; i < count; i++) {
      color.set('#ffffff')
      setup(i, m, color)
      m.updateMatrix()
      mesh.setMatrixAt(i, m.matrix)
      mesh.setColorAt(i, color)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [count, setup])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow={castShadow} receiveShadow={receiveShadow}>
      {children}
    </instancedMesh>
  )
}

/* ------------------------------- buildings ---------------------------------- */

function Buildings() {
  const tex = useMemo(() => makeWindowTextures(), [])
  const emissiveRef = useRef<THREE.MeshStandardMaterial>(null)

  const bodies = useMemo(() => BUILDINGS.filter((b) => b.roof !== 'shed'), [])
  const sheds = useMemo(() => BUILDINGS.filter((b) => b.roof === 'shed'), [])
  const hips = useMemo(() => BUILDINGS.filter((b) => b.roof === 'hip'), [])
  const slabs = useMemo(() => BUILDINGS.filter((b) => b.roof === 'shed'), [])

  useFrame(() => {
    if (emissiveRef.current) emissiveRef.current.emissiveIntensity = 0.12 + atmoLive.nightGlow * 1.15
  })

  return (
    <group>
      {/* wall bodies (window texture shared across instances) */}
      <InstancedGroup
        count={bodies.length}
        castShadow
        receiveShadow
        setup={(i, m, color) => {
          const b = bodies[i]
          m.position.set(b.x, b.y + b.h / 2, b.z)
          m.rotation.set(0, b.rotY, 0)
          m.scale.set(b.w, b.h, b.d)
          color.set(WALL_TONES[b.tone])
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          ref={emissiveRef}
          map={tex.map}
          emissiveMap={tex.emissive}
          emissive="#ffca7a"
          emissiveIntensity={0.12}
          roughness={0.92}
          metalness={0}
        />
      </InstancedGroup>

      {/* hip (pyramid) roofs */}
      <InstancedGroup
        count={hips.length}
        castShadow
        setup={(i, m, color) => {
          const b = hips[i]
          m.position.set(b.x, b.y + b.h + b.d * 0.22, b.z)
          m.rotation.set(0, b.rotY + Math.PI / 4, 0)
          m.scale.set(b.w * 0.82, b.d * 0.44, b.d * 0.82)
          color.set(ROOF_TONES[b.roofTone])
        }}
      >
        <coneGeometry args={[0.71, 1, 4]} />
        <meshStandardMaterial roughness={0.85} flatShading metalness={0} />
      </InstancedGroup>

      {/* shed slabs (market/park sheds — single sloped roof) */}
      <InstancedGroup
        count={slabs.length}
        setup={(i, m, color) => {
          const b = slabs[i]
          m.position.set(b.x, b.y + b.h + 0.12, b.z)
          m.rotation.set(0, b.rotY, 0.1)
          m.scale.set(b.w * 1.15, 0.16, b.d * 1.15)
          color.set(ROOF_TONES[b.roofTone])
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.8} metalness={0.15} />
      </InstancedGroup>

      {/* shopfront parapet strips for flat-roof blocks */}
      <InstancedGroup
        count={bodies.filter((b) => b.roof === 'flat').length}
        setup={(i, m, color) => {
          const b = bodies.filter((bb) => bb.roof === 'flat')[i]
          m.position.set(b.x, b.y + b.h + 0.18, b.z)
          m.rotation.set(0, b.rotY, 0)
          m.scale.set(b.w * 1.04, 0.36, b.d * 1.04)
          color.set(WALL_TONES[b.tone]).multiplyScalar(0.82)
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} metalness={0} />
      </InstancedGroup>

      {/* market / park shed walls (open-sided counters) */}
      <InstancedGroup
        count={sheds.length}
        castShadow
        setup={(i, m, color) => {
          const b = sheds[i]
          m.position.set(b.x, b.y + b.h / 2, b.z)
          m.rotation.set(0, b.rotY, 0)
          m.scale.set(b.w, b.h, b.d)
          color.set(WALL_TONES[b.tone])
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.92} metalness={0} />
      </InstancedGroup>
    </group>
  )
}

/* --------------------------------- stalls ----------------------------------- */

function Stalls() {
  return (
    <group>
      {/* wooden counters */}
      <InstancedGroup
        count={STALLS.length}
        castShadow
        setup={(i, m) => {
          const s = STALLS[i]
          m.position.set(s.x, s.y + 0.45, s.z)
          m.rotation.set(0, s.rotY, 0)
          m.scale.set(2, 0.9, 1)
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#7a5a38" roughness={1} />
      </InstancedGroup>
      {/* colourful canopies */}
      <InstancedGroup
        count={STALLS.length}
        castShadow
        setup={(i, m, color) => {
          const s = STALLS[i]
          m.position.set(s.x, s.y + 2.05, s.z)
          m.rotation.set(0.06, s.rotY, 0)
          m.scale.set(2.5, 0.1, 1.9)
          color.set(STALL_TONES[s.tone])
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.75} side={THREE.DoubleSide} />
      </InstancedGroup>
      {/* canopy poles */}
      <InstancedGroup
        count={STALLS.length * 2}
        setup={(i, m) => {
          const s = STALLS[Math.floor(i / 2)]
          const side = i % 2 === 0 ? -0.9 : 0.9
          const c = Math.cos(s.rotY)
          const sn = Math.sin(s.rotY)
          m.position.set(s.x + side * c, s.y + 1, s.z - side * sn)
          m.rotation.set(0, 0, 0)
          m.scale.set(0.09, 2, 0.09)
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#6a5138" roughness={1} />
      </InstancedGroup>
    </group>
  )
}

/* ---------------------------------- trees ------------------------------------ */

function Trees() {
  return (
    <group>
      <InstancedGroup
        count={TREES.length}
        castShadow
        setup={(i, m) => {
          const t = TREES[i]
          m.position.set(t.x, t.y + 1.1 * t.scale, t.z)
          m.rotation.set(0, 0, 0)
          m.scale.set(t.scale, t.scale * 1.25, t.scale)
        }}
      >
        <cylinderGeometry args={[0.14, 0.2, 2.2, 5]} />
        <meshStandardMaterial color="#6a4a2e" roughness={1} flatShading />
      </InstancedGroup>
      <InstancedGroup
        count={TREES.length}
        castShadow
        setup={(i, m, color) => {
          const t = TREES[i]
          m.position.set(t.x, t.y + (2.2 + 0.9) * t.scale, t.z)
          m.rotation.set(i * 0.61, i * 0.83, 0)
          m.scale.setScalar(t.scale * (1 + (i % 3) * 0.12))
          color.set(TREE_TONES[t.tone])
        }}
      >
        <icosahedronGeometry args={[1.55, 1]} />
        <meshStandardMaterial roughness={0.95} flatShading />
      </InstancedGroup>
    </group>
  )
}

/* ---------------------------------- lamps ------------------------------------ */

function Lamps() {
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const poolRef = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    const g = atmoLive.nightGlow
    if (glowRef.current) glowRef.current.emissiveIntensity = 0.1 + g * 2.6
    if (poolRef.current) poolRef.current.opacity = g * 0.22
  })

  return (
    <group>
      <InstancedGroup
        count={LAMPS.length}
        setup={(i, m) => {
          const l = LAMPS[i]
          m.position.set(l.x, l.y + 1.9, l.z)
          m.rotation.set(0, 0, 0)
          m.scale.set(1, 1, 1)
        }}
      >
        <cylinderGeometry args={[0.07, 0.09, 3.8, 6]} />
        <meshStandardMaterial color="#3a3f3a" roughness={0.7} metalness={0.4} />
      </InstancedGroup>
      <InstancedGroup
        count={LAMPS.length}
        setup={(i, m) => {
          const l = LAMPS[i]
          m.position.set(l.x, l.y + 3.86, l.z)
          m.rotation.set(0, 0, 0)
          m.scale.setScalar(1)
        }}
      >
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshStandardMaterial ref={glowRef} color="#ffe9c0" emissive="#ffca7a" emissiveIntensity={0.1} />
      </InstancedGroup>
      {/* warm pools of light on the ground at night */}
      <InstancedGroup
        count={LAMPS.length}
        setup={(i, m) => {
          const l = LAMPS[i]
          m.position.set(l.x, l.y + 0.09, l.z)
          m.rotation.set(-Math.PI / 2, 0, 0)
          m.scale.setScalar(1)
        }}
      >
        <circleGeometry args={[1.7, 12]} />
        <meshBasicMaterial ref={poolRef} color="#ffca7a" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </InstancedGroup>
    </group>
  )
}

/* ----------------------------- landmark structures ---------------------------- */

function ConfluenceDeck(a: WorldAnchor) {
  const flagRef = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (flagRef.current) flagRef.current.rotation.y = Math.sin(s.clock.elapsedTime * 2.2) * 0.28
  })
  return (
    <group position={[a.x, a.y, a.z]}>
      {/* wooden viewing deck */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <cylinderGeometry args={[5.4, 5.9, 0.44, 10]} />
        <meshStandardMaterial color="#8a6a44" roughness={0.9} />
      </mesh>
      {/* railing posts */}
      {Array.from({ length: 10 }).map((_, i) => {
        const ang = (i / 10) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(ang) * 5.2, 0.85, Math.sin(ang) * 5.2]}>
            <boxGeometry args={[0.16, 1, 0.16]} />
            <meshStandardMaterial color="#6a5138" roughness={1} />
          </mesh>
        )
      })}
      {/* flagpole with the green-white-green */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 6.4, 6]} />
        <meshStandardMaterial color="#c8c8c8" metalness={0.6} roughness={0.4} />
      </mesh>
      <group ref={flagRef} position={[0.9, 5.6, 0]}>
        <mesh>
          <boxGeometry args={[1.7, 1.1, 0.05]} />
          <meshStandardMaterial color="#f4f4ee" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.38, 0.001]}>
          <boxGeometry args={[1.7, 0.37, 0.052]} />
          <meshStandardMaterial color="#1a7a3c" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.38, 0.001]}>
          <boxGeometry args={[1.7, 0.37, 0.052]} />
          <meshStandardMaterial color="#1a7a3c" roughness={0.8} />
        </mesh>
      </group>
      {/* moored canoe at the water's edge */}
      <Canoe />
    </group>
  )
}

function Canoe() {
  const ref = useRef<THREE.Group>(null)
  useFrame((s) => {
    if (ref.current) {
      ref.current.position.y = WATER_Y + 0.18 + Math.sin(s.clock.elapsedTime * 1.3) * 0.08
      ref.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.1) * 0.04
    }
  })
  return (
    <group ref={ref} position={[6.2, WATER_Y + 0.18, 10.5]} rotation={[0, 0.7, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.42, 3.2, 4, 8]} />
        <meshStandardMaterial color="#5a4028" roughness={1} />
      </mesh>
      <mesh position={[0, 0.18, 0]} scale={[0.62, 0.5, 1]}>
        <capsuleGeometry args={[0.4, 2.6, 4, 8]} />
        <meshStandardMaterial color="#3a2a1a" roughness={1} />
      </mesh>
    </group>
  )
}

function PattiTower(a: WorldAnchor) {
  const beaconRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame((s) => {
    if (beaconRef.current) {
      const blink = atmoLive.nightGlow > 0.4 ? (Math.sin(s.clock.elapsedTime * 3.4) > 0 ? 1 : 0.15) : 0.15
      beaconRef.current.emissiveIntensity = blink * 2.2
    }
  })
  return (
    <group position={[a.x, a.y, a.z]}>
      {/* three-legged lattice mast */}
      {Array.from({ length: 3 }).map((_, i) => {
        const ang = (i / 3) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(ang) * 0.85, 4.4, Math.sin(ang) * 0.85]} rotation={[Math.sin(ang) * 0.09, 0, -Math.cos(ang) * 0.09]}>
            <cylinderGeometry args={[0.07, 0.1, 8.8, 5]} />
            <meshStandardMaterial color="#b03a2e" roughness={0.7} metalness={0.3} />
          </mesh>
        )
      })}
      {[2.2, 4.4, 6.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.72 - i * 0.12, 0.045, 6, 14]} />
          <meshStandardMaterial color="#b03a2e" roughness={0.7} metalness={0.3} />
        </mesh>
      ))}
      {/* blinking beacon */}
      <mesh position={[0, 9, 0]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial ref={beaconRef} color="#ff5040" emissive="#ff3020" emissiveIntensity={0.15} />
      </mesh>
      {/* ranger hut */}
      <mesh position={[4.2, 1, -3]} castShadow>
        <boxGeometry args={[2.6, 2, 2.2]} />
        <meshStandardMaterial color="#cbb682" roughness={1} />
      </mesh>
      <mesh position={[4.2, 2.2, -3]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="#8a4a2a" roughness={0.9} flatShading />
      </mesh>
    </group>
  )
}

function JunctionRoundabout(a: WorldAnchor) {
  return (
    <group position={[a.x, a.y, a.z]}>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[4.4, 4.7, 0.22, 18]} />
        <meshStandardMaterial color="#9aa06a" roughness={1} />
      </mesh>
      {/* signpost with three arms */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.09, 0.11, 3.8, 6]} />
        <meshStandardMaterial color="#4a5248" roughness={0.8} />
      </mesh>
      {[0.4, 1.9, 3.3].map((y, i) => (
        <mesh key={i} position={[0.55, y, 0]} rotation={[0, i * 2.1, 0]}>
          <boxGeometry args={[1.1, 0.3, 0.08]} />
          <meshStandardMaterial color={['#e8a317', '#1b7a43', '#c4562a'][i]} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function SuyaGrill(a: WorldAnchor) {
  return (
    <group position={[a.x + 3.2, a.y, a.z - 2]}>
      {/* grill box with warm coals */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.6, 1, 0.8]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.9} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[1.3, 0.08, 0.6]} />
        <meshStandardMaterial color="#e05a28" emissive="#c43a10" emissiveIntensity={0.55} />
      </mesh>
      {/* big brolly */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1.9, 1, 8]} />
        <meshStandardMaterial color="#c94f2e" roughness={0.8} flatShading side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 5]} />
        <meshStandardMaterial color="#6a5138" />
      </mesh>
    </group>
  )
}

function Monument(a: WorldAnchor) {
  return (
    <group position={[a.x, a.y, a.z]}>
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[3.4, 0.6, 3.4]} />
        <meshStandardMaterial color="#b9b2a2" roughness={1} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <boxGeometry args={[0.9, 4.2, 0.9]} />
        <meshStandardMaterial color="#d8d2c2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.9, 0]}>
        <coneGeometry args={[0.75, 0.7, 4]} />
        <meshStandardMaterial color="#8a6a3b" roughness={0.8} />
      </mesh>
    </group>
  )
}

function GatePosts(a: WorldAnchor) {
  return (
    <group position={[a.x, a.y, a.z]}>
      {[-3, 3].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[0.8, 3, 0.8]} />
            <meshStandardMaterial color="#d8cbb0" roughness={1} />
          </mesh>
          <mesh position={[0, 3.15, 0]}>
            <coneGeometry args={[0.62, 0.5, 4]} />
            <meshStandardMaterial color="#5C6E3A" roughness={0.8} flatShading />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.2, 0]}>
        <boxGeometry args={[5.4, 0.5, 0.3]} />
        <meshStandardMaterial color="#5C6E3A" roughness={0.8} />
      </mesh>
    </group>
  )
}

function AnchorStructures() {
  return (
    <group>
      {ANCHORS.map((a) => {
        switch (a.id) {
          case 'confluence':
            return <ConfluenceDeck key={a.id} {...a} />
          case 'mount-patti':
            return <PattiTower key={a.id} {...a} />
          case 'ganaja-junction':
            return <JunctionRoundabout key={a.id} {...a} />
          case 'food-area':
            return <SuyaGrill key={a.id} {...a} />
          case 'historic-lokoja':
            return <Monument key={a.id} {...a} />
          case 'government-area':
            return <GatePosts key={a.id} {...a} />
          default:
            return null
        }
      })}
    </group>
  )
}

/* ----------------------------- points of interest ----------------------------- */

/** physical job board — walk up and read the REAL work board of that district */
function JobBoard({ x, y, z, rotY }: { x: number; y: number; z: number; rotY: number }) {
  return (
    <group position={[x, y, z]} rotation={[0, rotY, 0]}>
      {/* timber posts */}
      {[-0.7, 0.7].map((px) => (
        <mesh key={px} position={[px, 1.05, 0]} castShadow>
          <boxGeometry args={[0.14, 2.1, 0.14]} />
          <meshStandardMaterial color="#6a5138" roughness={0.95} />
        </mesh>
      ))}
      {/* board frame */}
      <mesh position={[0, 1.9, 0.04]} castShadow>
        <boxGeometry args={[1.9, 1.3, 0.08]} />
        <meshStandardMaterial color="#1c5c3a" roughness={0.8} />
      </mesh>
      {/* notice sheets — slightly staggered, hand-pinned feel */}
      {[0.42, 0, -0.42].map((sx, i) => (
        <mesh key={sx} position={[sx, 1.84 - (i % 2) * 0.14, 0.1]}>
          <boxGeometry args={[0.52, 0.7, 0.03]} />
          <meshStandardMaterial color={i === 1 ? '#f2ead8' : '#e8dcc3'} roughness={1} />
        </mesh>
      ))}
      {/* gold header cap */}
      <mesh position={[0, 2.58, 0.02]} castShadow>
        <boxGeometry args={[2.06, 0.3, 0.12]} />
        <meshStandardMaterial color="#e8a317" roughness={0.6} />
      </mesh>
    </group>
  )
}

function PointOfInterestProps() {
  return (
    <group>
      {POINTS_OF_INTEREST.map((p) =>
        p.kind === 'jobboard' ? <JobBoard key={p.id} x={p.x} y={p.y} z={p.z} rotY={p.rotY} /> : null,
      )}
    </group>
  )
}

/* ---------------------------------- labels ----------------------------------- */

function LocationLabels() {
  const sprites = useMemo(
    () =>
      ANCHORS.map((a) => {
        const tex = makeLabelTexture(a.location.name)
        return { a, tex }
      }),
    [],
  )
  const groupRef = useRef<THREE.Group>(null)

  useFrame((s) => {
    if (!groupRef.current) return
    const t = s.clock.elapsedTime
    groupRef.current.children.forEach((child, i) => {
      child.position.y = ANCHORS[i].y + 7.4 + Math.sin(t * 1.1 + i * 1.7) * 0.18
    })
  })

  return (
    <group ref={groupRef}>
      {sprites.map(({ a, tex }) => (
        <sprite key={a.id} position={[a.x, a.y + 8.2, a.z]} scale={[9, 2.25, 1]}>
          <spriteMaterial map={tex} transparent depthTest={false} depthWrite={false} />
        </sprite>
      ))}
    </group>
  )
}

/* ---------------------------------- export ----------------------------------- */

export function CityMesh() {
  return (
    <group>
      <Buildings />
      <Stalls />
      <Trees />
      <Lamps />
      <AnchorStructures />
      <PointOfInterestProps />
      <LocationLabels />
    </group>
  )
}
