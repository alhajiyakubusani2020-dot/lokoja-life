'use client'

/**
 * LOKOJA LIFE — Interior Scene (INC 4 "life inside")
 * ---------------------------------------------------
 * The walkable inside-world: your flat, Mama's buka, the Kpata store.
 * Renders straight from the pure interior definitions (rooms, walls,
 * furniture, hotspots) — geometry and collision share the same data.
 *
 * The interior is its own small scene with a closer follow camera and
 * dollhouse open-top (the camera looks in from above, so no ceiling).
 * Interaction hotspots report to the HUD; all actions (rest, cook,
 * unwind) flow through the SAME store actions as everywhere else.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { AvatarConfig, TimeOfDay } from '@/game/types'
import { INTERIOR } from '@/game/data/config'
import { FURN_FOOTPRINT, resolveInteriorPosition, type FurnDef, type InteriorDef } from '@/game/world3d/interiors'
import {
  consumeLook, consumeZoom, isInputFrozen, playerPos, readMoveInput, reportPlayerPos,
} from './controls'
import { HumanRig } from './HumanRig'

/* --------------------------------- furniture --------------------------------- */

const WOOD = ['#7a5a38', '#8a6a42', '#6a4c30']
const FABRIC = ['#c94f2e', '#2e7d5b', '#3a6ea3', '#d99a2b']

function Furniture({ f, night }: { f: FurnDef; night: boolean }) {
  const fp = FURN_FOOTPRINT[f.kind]
  const s = f.s ?? 1
  const tone = f.tone ?? 0
  const rot: [number, number, number] = [0, f.rotY, 0]

  switch (f.kind) {
    case 'bed':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.36, fp.d * s]} />
            <meshStandardMaterial color={WOOD[2]} roughness={1} />
          </mesh>
          <mesh position={[0, 0.42, 0.05]} castShadow>
            <boxGeometry args={[fp.w * s - 0.12, 0.18, fp.d * s - 0.14]} />
            <meshStandardMaterial color="#e8e0cc" roughness={0.9} />
          </mesh>
          {/* blanket */}
          <mesh position={[0, 0.5, -0.28]} castShadow>
            <boxGeometry args={[fp.w * s - 0.1, 0.09, fp.d * s * 0.55]} />
            <meshStandardMaterial color={FABRIC[tone % FABRIC.length]} roughness={0.95} />
          </mesh>
          {/* pillows */}
          {[-0.45, 0.45].map((x) => (
            <mesh key={x} position={[x, 0.55, fp.d * s * 0.32]} rotation={[0.28, 0, 0]}>
              <boxGeometry args={[fp.w * s * 0.36, 0.12, 0.3]} />
              <meshStandardMaterial color="#f4efe2" roughness={0.9} />
            </mesh>
          ))}
          {/* headboard */}
          <mesh position={[0, 0.55, -fp.d * s * 0.48]} castShadow>
            <boxGeometry args={[fp.w * s, 0.75, 0.09]} />
            <meshStandardMaterial color={WOOD[1]} roughness={1} />
          </mesh>
        </group>
      )
    case 'wardrobe':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color={WOOD[0]} roughness={0.95} />
          </mesh>
          {[0.14, -0.14].map((x) => (
            <mesh key={x} position={[x, 1.05, fp.d * s / 2 + 0.02]}>
              <boxGeometry args={[0.035, 0.32, 0.03]} />
              <meshStandardMaterial color="#c8b06a" metalness={0.5} roughness={0.4} />
            </mesh>
          ))}
        </group>
      )
    case 'stove':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.84, fp.d * s]} />
            <meshStandardMaterial color="#2c2c30" roughness={0.6} metalness={0.25} />
          </mesh>
          {[[-0.2, -0.14], [0.2, -0.14], [-0.2, 0.16], [0.2, 0.16]].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.855, z]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 10]} />
              <meshStandardMaterial color="#111114" roughness={0.5} />
            </mesh>
          ))}
          {/* oven door */}
          <mesh position={[0, 0.34, fp.d * s / 2 + 0.015]}>
            <boxGeometry args={[fp.w * s * 0.7, 0.4, 0.02]} />
            <meshStandardMaterial color="#4a4a52" metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      )
    case 'fridge':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color="#dfe3e6" roughness={0.35} metalness={0.35} />
          </mesh>
          <mesh position={[fp.w * s / 2 - 0.09, 1.1, fp.d * s / 2 + 0.02]}>
            <boxGeometry args={[0.04, 0.55, 0.035]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )
    case 'sofa':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.34, fp.d * s]} />
            <meshStandardMaterial color={FABRIC[tone % FABRIC.length]} roughness={1} />
          </mesh>
          <mesh position={[0, 0.62, -fp.d * s / 2 + 0.11]} castShadow>
            <boxGeometry args={[fp.w * s, 0.6, 0.22]} />
            <meshStandardMaterial color={FABRIC[tone % FABRIC.length]} roughness={1} />
          </mesh>
          {[-1, 1].map((sd) => (
            <mesh key={sd} position={[sd * (fp.w * s / 2 - 0.1), 0.5, 0]} castShadow>
              <boxGeometry args={[0.2, 0.32, fp.d * s]} />
              <meshStandardMaterial color={FABRIC[tone % FABRIC.length]} roughness={1} />
            </mesh>
          ))}
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, 0.48, 0.04]} rotation={[0.1, 0.08 * x, 0]}>
              <boxGeometry args={[0.62, 0.16, 0.5]} />
              <meshStandardMaterial color="#f0e8d4" roughness={1} />
            </mesh>
          ))}
        </group>
      )
    case 'tv':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* stand */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.5, fp.d * s]} />
            <meshStandardMaterial color={WOOD[1]} roughness={1} />
          </mesh>
          {/* screen — softly emissive, the room "watching TV" glow */}
          <mesh position={[0, 0.86, 0]} rotation={[-0.08, 0, 0]} castShadow>
            <boxGeometry args={[fp.w * s * 0.86, 0.52, 0.06]} />
            <meshStandardMaterial color="#101418" roughness={0.3} metalness={0.4} emissive="#3a6ea3" emissiveIntensity={0.55} />
          </mesh>
        </group>
      )
    case 'table':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.72, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.06, fp.d * s]} />
            <meshStandardMaterial color={WOOD[tone % WOOD.length]} roughness={0.9} />
          </mesh>
          {[[-0.55, -0.32], [0.55, -0.32], [-0.55, 0.32], [0.55, 0.32]].map(([x, z], i) => (
            <mesh key={i} position={[x * (fp.w * s / 1.4), 0.36, z * (fp.d * s / 0.9)]}>
              <boxGeometry args={[0.06, 0.72, 0.06]} />
              <meshStandardMaterial color={WOOD[2]} roughness={1} />
            </mesh>
          ))}
        </group>
      )
    case 'chair':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
            <meshStandardMaterial color={WOOD[0]} roughness={1} />
          </mesh>
          <mesh position={[0, 0.66, -0.18]} castShadow>
            <boxGeometry args={[0.42, 0.42, 0.05]} />
            <meshStandardMaterial color={WOOD[0]} roughness={1} />
          </mesh>
          {[[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]].map(([x, z], i) => (
            <mesh key={i} position={[x, 0.22, z]}>
              <boxGeometry args={[0.05, 0.44, 0.05]} />
              <meshStandardMaterial color={WOOD[2]} roughness={1} />
            </mesh>
          ))}
        </group>
      )
    case 'shelf':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            {/* gentle self-glow at night — shelf fronts face away from the lamps */}
            <meshStandardMaterial color={WOOD[1]} roughness={1} emissive="#8a744f" emissiveIntensity={night ? 0.32 : 0} />
          </mesh>
          {/* stocked goods — colourful boxes on the shelf face */}
          {Array.from({ length: Math.max(3, Math.round(fp.w * s * 2.4)) }, (_, i) => (
            <mesh
              key={i}
              position={[-fp.w * s / 2 + 0.14 + i * (fp.w * s - 0.24) / Math.max(3, Math.round(fp.w * s * 2.4) - 1), 0.35 + (i % 3) * 0.55, fp.d * s / 2 + 0.03]}
            >
              <boxGeometry args={[0.16, 0.28, 0.14]} />
              <meshStandardMaterial color={FABRIC[(i + tone) % FABRIC.length]} roughness={0.9} />
            </mesh>
          ))}
        </group>
      )
    case 'counter':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.88, fp.d * s]} />
            <meshStandardMaterial color={WOOD[0]} roughness={1} />
          </mesh>
          {/* countertop */}
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[fp.w * s + 0.08, 0.07, fp.d * s + 0.08]} />
            <meshStandardMaterial color="#4a3f34" roughness={0.7} />
          </mesh>
        </group>
      )
    case 'bench':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.07, fp.d * s]} />
            <meshStandardMaterial color={WOOD[0]} roughness={1} />
          </mesh>
          {[-0.68, 0.68].map((x) => (
            <mesh key={x} position={[x * (fp.w * s / 1.6), 0.2, 0]}>
              <boxGeometry args={[0.07, 0.4, fp.d * s * 0.8]} />
              <meshStandardMaterial color={WOOD[2]} roughness={1} />
            </mesh>
          ))}
        </group>
      )
    case 'shower':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.09, 0]} receiveShadow>
            <boxGeometry args={[fp.w * s, 0.18, fp.d * s]} />
            <meshStandardMaterial color="#cfd8dc" roughness={0.4} metalness={0.15} />
          </mesh>
          {/* riser pipe + head */}
          <mesh position={[-0.32, 1.05, -0.32]}>
            <cylinderGeometry args={[0.025, 0.025, 2.1, 8]} />
            <meshStandardMaterial color="#9aa0a6" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.12, 2.05, -0.12]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.09, 0.05, 0.07, 10]} />
            <meshStandardMaterial color="#b8bec4" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )
    case 'mirror':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 1.35, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.85, fp.d * s]} />
            <meshStandardMaterial color={WOOD[1]} roughness={1} />
          </mesh>
          {/* basin */}
          <mesh position={[0, 0.82, 0.12]}>
            <cylinderGeometry args={[0.24, 0.18, 0.16, 12]} />
            <meshStandardMaterial color="#e8eef0" roughness={0.35} />
          </mesh>
          {/* mirror glass */}
          <mesh position={[0, 1.42, fp.d * s / 2 + 0.015]}>
            <boxGeometry args={[fp.w * s * 0.72, 0.6, 0.015]} />
            <meshStandardMaterial color="#b8ccd4" roughness={0.12} metalness={0.7} />
          </mesh>
        </group>
      )
    case 'rug':
    case 'mat':
      return (
        <mesh position={[f.x, 0.012, f.z]} rotation={[-Math.PI / 2, 0, f.rotY]} receiveShadow>
          <planeGeometry args={[fp.w * s, fp.d * s]} />
          <meshStandardMaterial color={f.kind === 'rug' ? FABRIC[(tone + 1) % FABRIC.length] : '#a8683f'} roughness={1} />
        </mesh>
      )
    case 'crate':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color={WOOD[tone % WOOD.length]} roughness={1} />
          </mesh>
          <mesh position={[0, fp.h / 2, fp.d * s / 2 + 0.005]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.05, fp.w * s * 1.35, 0.012]} />
            <meshStandardMaterial color={WOOD[2]} roughness={1} />
          </mesh>
        </group>
      )
    case 'pot':
      return (
        <group position={[f.x, 1.0, f.z]} rotation={rot}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16 * s, 0.13 * s, 0.3 * s, 12]} />
            <meshStandardMaterial color={tone === 1 ? '#b03a2e' : tone === 2 ? '#3a6ea3' : '#2c2c30'} roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.17 * s, 0]}>
            <cylinderGeometry args={[0.15 * s, 0.15 * s, 0.04 * s, 12]} />
            <meshStandardMaterial color="#e8dcc3" roughness={0.8} />
          </mesh>
        </group>
      )
    case 'fan':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.08, 10]} />
            <meshStandardMaterial color="#3a3a40" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 1.1, 8]} />
            <meshStandardMaterial color="#8a9096" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.06, 12, 1, true]} />
            <meshStandardMaterial color="#c8ccd0" metalness={0.4} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )
    case 'menu':
      return (
        <group position={[f.x, 1.35, f.z]} rotation={[0, f.rotY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[fp.w * s, 0.62, 0.05]} />
            <meshStandardMaterial color="#2e4a3a" roughness={0.8} />
          </mesh>
          {/* chalk lines */}
          {[0.14, -0.02, -0.18].map((y, i) => (
            <mesh key={y} position={[-0.06 + (i % 2) * 0.05, y, 0.03]}>
              <boxGeometry args={[0.66 - i * 0.14, 0.045, 0.005]} />
              <meshStandardMaterial color="#e8dcc3" roughness={1} />
            </mesh>
          ))}
        </group>
      )
    default:
      return null
  }
}

/* ---------------------------------- the room --------------------------------- */

const WALL_H = 2.6 // wall height

/**
 * segment (x0,z0)→(x1,z1) vs axis-aligned box — slab method, 2D
 */
function segHitsBox(
  x0: number, z0: number, x1: number, z1: number,
  cx: number, cz: number, hw: number, hd: number,
): boolean {
  const dx = x1 - x0
  const dz = z1 - z0
  let tMin = 0
  let tMax = 1
  // x slabs
  if (Math.abs(dx) < 1e-6) {
    if (x0 < cx - hw || x0 > cx + hw) return false
  } else {
    let t1 = (cx - hw - x0) / dx
    let t2 = (cx + hw - x0) / dx
    if (t1 > t2) [t1, t2] = [t2, t1]
    tMin = Math.max(tMin, t1)
    tMax = Math.min(tMax, t2)
    if (tMin > tMax) return false
  }
  // z slabs
  if (Math.abs(dz) < 1e-6) {
    if (z0 < cz - hd || z0 > cz + hd) return false
  } else {
    let t1 = (cz - hd - z0) / dz
    let t2 = (cz + hd - z0) / dz
    if (t1 > t2) [t1, t2] = [t2, t1]
    tMin = Math.max(tMin, t1)
    tMax = Math.min(tMax, t2)
    if (tMin > tMax) return false
  }
  return true
}

function Room({ def, night }: { def: InteriorDef; night: boolean }) {
  const floorTex = useMemo(() => {
    // subtle plank stripes painted on a canvas texture
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 256
    const ctx = c.getContext('2d')!
    ctx.fillStyle = def.palette.floor
    ctx.fillRect(0, 0, 256, 256)
    ctx.fillStyle = def.palette.floorAlt
    for (let y = 0; y < 256; y += 32) {
      ctx.fillRect(0, y, 256, 2)
      for (let x = ((y / 32) % 2) * 64; x < 256; x += 128) ctx.fillRect(x, y, 2, 32)
    }
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(def.size.w / 3, def.size.d / 3)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [def])

  const H = WALL_H
  const wallRefs = useRef<(THREE.Group | null)[]>([])

  // Sims-style wall cutaway — hide any wall whose body crosses the
  // sightline from the camera to the player (checked in 2D each frame)
  useFrame((state) => {
    const cam = state.camera.position
    for (let i = 0; i < def.walls.length; i++) {
      const g = wallRefs.current[i]
      if (!g) continue
      const w = def.walls[i]
      const hit = segHitsBox(cam.x, cam.z, playerPos.x, playerPos.z, w.x, w.z, w.w / 2 + 0.05, w.d / 2 + 0.05)
      if (g.visible === hit) g.visible = !hit
    }
  })

  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[def.size.w, def.size.d]} />
        <meshStandardMaterial map={floorTex} roughness={0.85} />
      </mesh>
      {/* walls (with cutaway) + windows riding their own wall group */}
      {def.walls.map((w, i) => (
        <group
          key={i}
          ref={(el) => { wallRefs.current[i] = el }}
        >
          <mesh position={[w.x, H / 2, w.z]} castShadow receiveShadow>
            <boxGeometry args={[w.w, H, w.d]} />
            <meshStandardMaterial color={def.palette.wall} roughness={0.95} />
          </mesh>
          {/* windows — bright panes by day, dim blue at night (north wall) */}
          {i === 0 && def.size.w >= 10 &&
            [def.size.w * 0.22, -def.size.w * 0.22].map((wx) => (
              <mesh key={wx} position={[wx, 1.5, -def.size.d / 2 + 0.18]}>
                <boxGeometry args={[1.15, 0.95, 0.06]} />
                <meshStandardMaterial
                  color={night ? '#26324a' : '#dff0f8'}
                  emissive={night ? '#101a2c' : '#bfe0f0'}
                  emissiveIntensity={night ? 0.5 : 0.85}
                  roughness={0.25}
                  metalness={0.1}
                />
              </mesh>
            ))}
        </group>
      ))}
      {/* ceiling lamps — glow at night (dollhouse: no ceiling mesh) */}
      {[[def.size.w * 0.22, 0], [-def.size.w * 0.22, 0]].map(([x, z], i) => (
        <group key={i} position={[x, H - 0.25, z]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
            <meshStandardMaterial color="#3a3a3a" />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <coneGeometry args={[0.22, 0.16, 12, 1, true]} />
            <meshStandardMaterial color="#c8442a" roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <sphereGeometry args={[0.075, 8, 8]} />
            <meshStandardMaterial color="#fff2cc" emissive="#ffdf9a" emissiveIntensity={night ? 2.4 : 0.25} />
          </mesh>
          {night && <pointLight position={[0, -0.45, 0]} color="#ffd9a0" intensity={20} distance={13} decay={1.5} />}
        </group>
      ))}
      {/* zone labels are HUD work — the floors just differ subtly */}
      {def.rooms.map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[r.x, 0.008, r.z]} receiveShadow>
          <planeGeometry args={[r.w, r.d]} />
          <meshStandardMaterial color={def.palette.floorAlt} roughness={0.95} transparent opacity={0.24} depthWrite={false} />
        </mesh>
      ))}
      {/* furniture */}
      {def.furniture.map((f, i) => (
        <Furniture key={i} f={f} night={night} />
      ))}
      {/* exit door — frame + ajar slab + warm outside light */}
      <group position={[def.door.x, 0, def.door.z]} rotation={[0, doorYaw(def), 0]}>
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[1.2, 2.1, 0.14]} />
          <meshStandardMaterial color={WOOD[0]} roughness={1} />
        </mesh>
        <mesh position={[0.42, 1.02, 0.14]} rotation={[0, -0.55, 0]} castShadow>
          <boxGeometry args={[0.78, 1.94, 0.05]} />
          <meshStandardMaterial color={def.palette.accent} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.1, 0.12]}>
          <planeGeometry args={[1.0, 1.9]} />
          <meshBasicMaterial color={night ? '#101a2c' : '#e8f2ea'} />
        </mesh>
      </group>
    </group>
  )
}

/** yaw so the door frame lies flat against the nearest wall */
function doorYaw(def: InteriorDef): number {
  const { x, z } = def.door
  const west = Math.abs(x - (-def.size.w / 2))
  const east = Math.abs(x - def.size.w / 2)
  const north = Math.abs(z - (-def.size.d / 2))
  const south = Math.abs(z - def.size.d / 2)
  const min = Math.min(west, east, north, south)
  if (min === west) return Math.PI / 2
  if (min === east) return Math.PI / 2
  return 0 // north/south walls
}

/* -------------------------------- hotspots ----------------------------------- */

function HotspotMarkers({ def, nearestRef }: { def: InteriorDef; nearestRef: React.MutableRefObject<string | null> }) {
  const refs = useRef<(THREE.Mesh | null)[]>([])
  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < def.hotspots.length; i++) {
      const m = refs.current[i]
      if (!m) continue
      const h = def.hotspots[i]
      const active = nearestRef.current === h.id
      m.scale.setScalar((active ? 1.35 : 1) * (1 + Math.sin(t * 3 + i) * 0.08))
      const mat = m.material as THREE.MeshBasicMaterial
      mat.color.set(active ? '#ffd88a' : '#e8a317')
      mat.opacity = active ? 0.95 : 0.6
    }
  })
  return (
    <group>
      {def.hotspots.map((h, i) => (
        <mesh
          key={h.id}
          ref={(el) => { refs.current[i] = el }}
          position={[h.x, 1.62, h.z]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <octahedronGeometry args={[0.11, 0]} />
          <meshBasicMaterial color="#e8a317" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/* ------------------------------ interior player ------------------------------- */

function InteriorPlayer({
  def,
  avatar,
  spawn,
  onHotspot,
}: {
  def: InteriorDef
  avatar: AvatarConfig
  spawn: { x: number; z: number; facing: number }
  onHotspot?: (id: string | null) => void
}) {
  const group = useRef<THREE.Group>(null)
  const speed = useRef(0)
  const { camera } = useThree()
  const state = useRef({
    x: spawn.x,
    z: spawn.z,
    vx: 0,
    vz: 0,
    yaw: spawn.facing,
    camYaw: spawn.facing,
    camPitch: 0.42,
    camDist: INTERIOR.camera.distance as number,
    speed: 0,
    near: null as string | null,
    camSnap: true,
  })

  // dev/E2E bridge (stripped from production builds)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      ;(window as unknown as Record<string, unknown>).__lkoInteriorTP = (x: number, z: number) => {
        state.current.x = x
        state.current.z = z
        state.current.vx = 0
        state.current.vz = 0
      }
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__lkoInteriorTP
    }
  }, [])

  useFrame((_, rawDt) => {
    const s = state.current
    const dt = Math.min(rawDt, 0.05)
    const g = group.current
    if (!g) return

    const frozen = isInputFrozen()
    const look = consumeLook()
    s.camYaw -= look.dx * 0.0042
    s.camPitch = THREE.MathUtils.clamp(s.camPitch + look.dy * 0.0032, INTERIOR.camera.pitchMin, INTERIOR.camera.pitchMax)

    const input = readMoveInput()
    const moving = !frozen && (Math.abs(input.x) > 0.01 || Math.abs(input.y) > 0.01)
    const targetSpeed = moving ? (input.sprint ? 4.1 : 2.55) : 0

    let tx = 0
    let tz = 0
    if (moving) {
      const sin = Math.sin(s.camYaw)
      const cos = Math.cos(s.camYaw)
      tx = input.x * cos - input.y * sin
      tz = -input.x * sin - input.y * cos
      const len = Math.hypot(tx, tz) || 1
      tx = (tx / len) * targetSpeed
      tz = (tz / len) * targetSpeed
    }
    const accel = 22 * dt
    s.vx += THREE.MathUtils.clamp(tx - s.vx, -accel, accel)
    s.vz += THREE.MathUtils.clamp(tz - s.vz, -accel, accel)
    let nx = s.x + s.vx * dt
    let nz = s.z + s.vz * dt
    ;[nx, nz] = resolveInteriorPosition(def, nx, nz)
    s.x = nx
    s.z = nz
    s.speed = 0
    s.speed = Math.hypot(s.vx, s.vz)

    if (s.speed > 0.4) {
      const targetYaw = Math.atan2(s.vx, s.vz)
      let d = targetYaw - s.yaw
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      s.yaw += d * Math.min(1, dt * 10)
    }
    g.position.set(s.x, 0, s.z)
    g.rotation.y = s.yaw
    reportPlayerPos(s.x, s.z, s.yaw)

    // nearest hotspot
    let best: string | null = null
    let bestD: number = INTERIOR.hotspotRadius
    for (const h of def.hotspots) {
      const d = Math.hypot(h.x - s.x, h.z - s.z)
      if (d < bestD) {
        bestD = d
        best = h.id
      }
    }
    if (best !== s.near) {
      s.near = best
      onHotspot?.(best)
    }

    // camera — closer follow
    s.camDist = THREE.MathUtils.clamp(s.camDist + consumeZoom(), INTERIOR.camera.minDistance, INTERIOR.camera.maxDistance)
    const cosP = Math.cos(s.camPitch)
    const desired = new THREE.Vector3(
      s.x - Math.sin(s.camYaw) * s.camDist * cosP,
      INTERIOR.camera.height + Math.sin(s.camPitch) * s.camDist,
      s.z - Math.cos(s.camYaw) * s.camDist * cosP,
    )
    // keep the camera inside the room (dollhouse allows over-the-wall peeking)
    desired.x = THREE.MathUtils.clamp(desired.x, -def.size.w / 2 + 0.4, def.size.w / 2 - 0.4)
    desired.z = THREE.MathUtils.clamp(desired.z, -def.size.d / 2 + 0.4, def.size.d / 2 - 0.4)
    if (s.camSnap) {
      camera.position.copy(desired)
      s.camSnap = false
    } else {
      camera.position.lerp(desired, Math.min(1, dt * 7))
    }
    camera.lookAt(s.x, 1.35, s.z)
  })

  return (
    <group ref={group} position={[spawn.x, 0, spawn.z]} rotation={[0, spawn.facing, 0]}>
      <HumanRig
        colors={{
          skin: avatar.skinTone,
          cloth: avatar.clothingColor,
          clothAlt: avatar.clothingColor,
          hair: avatar.hairColor,
          hairStyle:
            ['afro', 'puffs', 'dreads', 'braids'].includes(avatar.hairstyle)
              ? 'volume'
              : ['low-cut', 'waves', 'cornrows'].includes(avatar.hairstyle)
                ? 'cap'
                : 'none',
          dress: avatar.clothingStyle === 'kaftan',
        }}
        speedRef={speed}
      />
      {/* contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.5, 12]} />
        <meshBasicMaterial color="#1a2016" transparent opacity={0.26} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ---------------------------------- the scene --------------------------------- */

export function InteriorScene({
  def,
  avatar,
  timeOfDay,
  onReady,
  onHotspot,
}: {
  def: InteriorDef
  avatar: AvatarConfig
  timeOfDay: TimeOfDay
  onReady?: () => void
  onHotspot?: (id: string | null) => void
}) {
  const night = timeOfDay === 'night'
  const nearestRef = useRef<string | null>(null)

  useEffect(() => {
    // E2E hook: let tests peek at the interior without DOM digging
    if (process.env.NODE_ENV !== 'production') {
      const w = window as unknown as Record<string, unknown>
      w.__lkoInterior = { id: def.id, hotspots: def.hotspots.map((h) => h.id) }
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__lkoInterior
    }
  }, [def])

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 58, near: 0.1, far: 60, position: [def.spawn.x - 3, 3.4, def.spawn.z + 3] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
        onReady?.()
      }}
      style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
    >
      {/* warm interior light */}
      <hemisphereLight args={[night ? '#3a3f52' : '#fff4e0', '#8a6a4a', night ? 0.72 : 1.05]} />
      <directionalLight
        castShadow
        position={[def.size.w * 0.3, 7, -def.size.d * 0.4]}
        intensity={night ? 0.35 : 2.2}
        color={night ? '#8fa3c8' : '#fff0d2'}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {night && <ambientLight intensity={0.45} color="#7a84a0" />}
      <Room def={def} night={night} />
      <HotspotMarkers def={def} nearestRef={nearestRef} />
      <InteriorPlayer
        def={def}
        avatar={avatar}
        spawn={def.spawn}
        onHotspot={(id) => {
          nearestRef.current = id
          onHotspot?.(id)
        }}
      />
    </Canvas>
  )
}
