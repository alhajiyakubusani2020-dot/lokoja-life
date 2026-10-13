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

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { AvatarConfig, TimeOfDay } from '@/game/types'
import { INTERIOR } from '@/game/data/config'
import {
  FURN_FOOTPRINT, resolveInteriorPosition,
  type ActionDef, type FurnDef, type InteriorDef,
} from '@/game/world3d/interiors'
import {
  consumeLook, consumeZoom, freezeInput, isInputFrozen, playerPos, readMoveInput, reportPlayerPos,
} from './controls'
import { HumanRig } from './HumanRig'
import { useWardrobeBus } from './wardrobe-store'
import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { BankPanel } from './panels/BankPanel'
import { LoungeConfirm } from './panels/LoungeConfirm'
import { CivicPanel } from './panels/CivicPanel'

/* --------------------------------- furniture --------------------------------- */

const WOOD = ['#7a5a38', '#8a6a42', '#6a4c30']
const FABRIC = ['#c94f2e', '#2e7d5b', '#3a6ea3', '#d99a2b']
const METAL = '#9aa0a6'

/**
 * Stage 5-b — baked text plate (painted sign). One small canvas per
 * distinct (text, palette) pair, cached module-level so the gym motto
 * and the lounge neon cost one texture each, once per session.
 */
const plateTexCache = new Map<string, THREE.CanvasTexture>()

function plateTexture(lines: string[], bg: string, fg: string, accent: string): THREE.CanvasTexture {
  const key = `${lines.join('|')}·${bg}·${fg}·${accent}`
  let tex = plateTexCache.get(key)
  if (tex) return tex
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 512, 256)
  // border trim
  ctx.strokeStyle = accent
  ctx.lineWidth = 10
  ctx.strokeRect(12, 12, 488, 232)
  ctx.fillStyle = fg
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const size = lines.length > 1 ? 64 : 80
  ctx.font = `900 ${size}px Arial, sans-serif`
  lines.forEach((ln, i) => {
    ctx.fillText(ln, 256, 128 + (i - (lines.length - 1) / 2) * (size + 8))
  })
  tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  plateTexCache.set(key, tex)
  return tex
}

function Furniture({ f, night, accent }: { f: FurnDef; night: boolean; accent: string }) {
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
    /* -------- Stage 5-b — gym / bank / lounge fittings -------- */
    case 'dumbbell-rack':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* two inclined rails */}
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, 0.34, 0]} rotation={[0, 0, 0.5]} castShadow>
              <boxGeometry args={[0.06, 1.0, fp.d * s - 0.1]} />
              <meshStandardMaterial color="#2c2c30" roughness={0.6} metalness={0.3} />
            </mesh>
          ))}
          {/* base + crossbar */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.1, fp.d * s]} />
            <meshStandardMaterial color="#1c1c20" roughness={0.7} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.92, 0]} castShadow>
            <boxGeometry args={[fp.w * s - 0.2, 0.07, 0.06]} />
            <meshStandardMaterial color="#c94f2e" roughness={0.6} />
          </mesh>
          {/* the dumbbells, paired heads on slanted handles */}
          {Array.from({ length: 4 }, (_, i) => {
            const x = -0.6 + i * 0.4
            const y = 0.42 + i * 0.13
            return (
              <group key={i} position={[x, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.028, 0.028, 0.3, 8]} />
                  <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.35} />
                </mesh>
                {[-0.13, 0.13].map((o) => (
                  <mesh key={o} position={[0, o, 0]} castShadow>
                    <cylinderGeometry args={[0.085, 0.085, 0.07, 10]} />
                    <meshStandardMaterial color="#1a1a1e" roughness={0.5} />
                  </mesh>
                ))}
              </group>
            )
          })}
        </group>
      )
    case 'bench-press':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* bench pad */}
          <mesh position={[0, 0.46, 0.1]} castShadow>
            <boxGeometry args={[0.42, 0.1, fp.d * s - 0.2]} />
            <meshStandardMaterial color="#20242a" roughness={0.85} />
          </mesh>
          {[-0.3, 0.3].map((x) => (
            <mesh key={x} position={[x, 0.2, 0.1]} castShadow>
              <boxGeometry args={[0.07, 0.42, 0.07]} />
              <meshStandardMaterial color="#2c2c30" metalness={0.4} roughness={0.5} />
            </mesh>
          ))}
          {/* uprights holding the bar */}
          {[-0.52, 0.52].map((x) => (
            <mesh key={x} position={[x, 0.72, -0.44]} castShadow>
              <boxGeometry args={[0.08, 1.44, 0.08]} />
              <meshStandardMaterial color="#2c2c30" metalness={0.4} roughness={0.5} />
            </mesh>
          ))}
          {/* the loaded barbell */}
          <group position={[0, 1.18, -0.44]} rotation={[0, 0, Math.PI / 2]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 2.1, 10]} />
              <meshStandardMaterial color={METAL} metalness={0.65} roughness={0.3} />
            </mesh>
            {[-0.82, -0.7, 0.7, 0.82].map((o, i) => (
              <mesh key={o} position={[0, o, 0]} castShadow>
                <cylinderGeometry args={[i % 2 === 0 ? 0.22 : 0.17, i % 2 === 0 ? 0.22 : 0.17, 0.06, 14]} />
                <meshStandardMaterial color="#1a1a1e" roughness={0.45} />
              </mesh>
            ))}
          </group>
        </group>
      )
    case 'treadmill':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* deck — raised at the back, belt on top */}
          <mesh position={[0, 0.16, 0.15]} castShadow>
            <boxGeometry args={[fp.w * s, 0.24, fp.d * s * 0.82]} />
            <meshStandardMaterial color="#23262b" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0, 0.29, 0.15]} castShadow>
            <boxGeometry args={[fp.w * s - 0.16, 0.03, fp.d * s * 0.78]} />
            <meshStandardMaterial color="#111318" roughness={0.9} />
          </mesh>
          {/* side handrails */}
          {[-1, 1].map((sd) => (
            <mesh key={sd} position={[sd * (fp.w * s / 2 - 0.06), 0.52, 0.05]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.05, 0.9, 0.05]} />
              <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.35} />
            </mesh>
          ))}
          {/* console mast + screen */}
          <mesh position={[0, 0.62, -fp.d * s * 0.44]} castShadow>
            <boxGeometry args={[fp.w * s * 0.7, 1.05, 0.09]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.06, -fp.d * s * 0.4]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[fp.w * s * 0.55, 0.26, 0.04]} />
            <meshStandardMaterial color="#0d1117" emissive="#39d98a" emissiveIntensity={0.7} roughness={0.3} />
          </mesh>
        </group>
      )
    case 'mirror-strip':
      return (
        <group position={[f.x, 1.05, f.z]} rotation={rot}>
          <mesh castShadow>
            <boxGeometry args={[fp.w * s, fp.h, 0.06]} />
            <meshStandardMaterial color="#4a4a52" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* the glass — slightly emissive so the room reads in it */}
          <mesh position={[0, 0, 0.045]}>
            <boxGeometry args={[fp.w * s - 0.1, fp.h - 0.12, 0.02]} />
            <meshStandardMaterial color="#b8ccd4" roughness={0.08} metalness={0.85} emissive="#6a7a84" emissiveIntensity={0.18} />
          </mesh>
        </group>
      )
    case 'sign': {
      const gym = tone !== 1
      const tex = plateTexture(
        gym ? ['NO FOOD', 'BEFORE REP 10'] : ['GOLDEN', 'NIGHTS'],
        gym ? '#8e2318' : '#1a1410',
        gym ? '#f4ede0' : '#e8a317',
        gym ? '#d9a12b' : '#c98d14',
      )
      return (
        <group position={[f.x, 1.92, f.z]} rotation={[0, f.rotY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[fp.w * s, 0.8, 0.05]} />
            <meshStandardMaterial color={gym ? '#8e2318' : '#1a1410'} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.031]}>
            <planeGeometry args={[fp.w * s - 0.08, 0.72]} />
            <meshStandardMaterial
              map={tex}
              emissive="#ffffff"
              emissiveMap={tex}
              emissiveIntensity={gym ? 0.22 : night ? 0.85 : 0.25}
              roughness={0.7}
            />
          </mesh>
        </group>
      )
    }
    case 'ceilingfan':
      return (
        <group position={[f.x, 0, f.z]} rotation={[0, f.rotY, 0]}>
          {/* drop rod (the dollhouse hangs lamps the same way) */}
          <mesh position={[0, 2.48, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.5, 8]} />
            <meshStandardMaterial color="#5a4030" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, 2.22, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.16, 0.12, 12]} />
            <meshStandardMaterial color="#3a3230" roughness={0.5} metalness={0.35} />
          </mesh>
          {/* three pitched blades — arranged by rotation, no spin loop needed */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 2.17, 0]} rotation={[0, (i * Math.PI * 2) / 3, 0.12]} castShadow>
              <boxGeometry args={[1.15, 0.02, 0.19]} />
              <meshStandardMaterial color={tone === 1 ? '#6a4c30' : '#8a6a4a'} roughness={0.85} />
            </mesh>
          ))}
        </group>
      )
    case 'vault':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* frame slab */}
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color="#3c4048" roughness={0.5} metalness={0.35} />
          </mesh>
          {/* the round vault door */}
          <mesh position={[0, 1.12, fp.d * s / 2 + 0.03]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.62, 0.62, 0.14, 24]} />
            <meshStandardMaterial color="#23262c" metalness={0.75} roughness={0.3} />
          </mesh>
          {/* locking spokes + hub */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 1.12, fp.d * s / 2 + 0.11]} rotation={[Math.PI / 2, (i * Math.PI) / 3, 0]}>
              <boxGeometry args={[0.9, 0.07, 0.04]} />
              <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 1.12, fp.d * s / 2 + 0.13]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
            <meshStandardMaterial color="#c8b06a" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      )
    case 'partition':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* the glass screen */}
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 1.85, 0.05]} />
            <meshStandardMaterial
              color="#cfe0e8" roughness={0.08} metalness={0.35} transparent opacity={0.42}
            />
          </mesh>
          {/* top rail + feet */}
          <mesh position={[0, 1.99, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.07, 0.12]} />
            <meshStandardMaterial color={WOOD[0]} roughness={0.9} />
          </mesh>
          {[-fp.w * s / 2 + 0.1, fp.w * s / 2 - 0.1].map((x) => (
            <mesh key={x} position={[x, 0.5, 0]} castShadow>
              <boxGeometry args={[0.09, 1.0, 0.12]} />
              <meshStandardMaterial color={WOOD[0]} roughness={0.9} />
            </mesh>
          ))}
          {/* the speech slot at the counter height */}
          <mesh position={[0, 0.86, 0]}>
            <boxGeometry args={[0.6, 0.16, 0.06]} />
            <meshStandardMaterial color="#1d5c8a" roughness={0.5} emissive="#1d5c8a" emissiveIntensity={0.12} />
          </mesh>
        </group>
      )
    case 'queueboard':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* pole + hood */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[0.09, 1.4, 0.09]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.62, 0.02]} castShadow>
            <boxGeometry args={[fp.w * s, 0.72, 0.08]} />
            <meshStandardMaterial color="#14181d" roughness={0.4} />
          </mesh>
          {/* the now-serving digits (green, of course) */}
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.24 + i * 0.24, 1.62, 0.07]}>
              <boxGeometry args={[0.16, 0.3, 0.02]} />
              <meshStandardMaterial color="#0d1117" emissive="#39d98a" emissiveIntensity={1.1} roughness={0.3} />
            </mesh>
          ))}
          <mesh position={[0, 1.24, 0.07]}>
            <boxGeometry args={[0.6, 0.08, 0.02]} />
            <meshStandardMaterial color="#e8dcc3" emissive="#e8dcc3" emissiveIntensity={0.35} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.28, 0.08, 12]} />
            <meshStandardMaterial color="#2c2c30" roughness={0.6} />
          </mesh>
        </group>
      )
    case 'booth':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* seat + high back — the classic lounge booth */}
          <mesh position={[0, 0.24, -0.1]} castShadow>
            <boxGeometry args={[fp.w * s, 0.34, fp.d * s - 0.12]} />
            <meshStandardMaterial color={FABRIC[tone % FABRIC.length]} roughness={1} />
          </mesh>
          <mesh position={[0, 0.68, -fp.d * s / 2 + 0.16]} castShadow>
            <boxGeometry args={[fp.w * s, 0.94, 0.2]} />
            <meshStandardMaterial color={FABRIC[tone % FABRIC.length]} roughness={1} />
          </mesh>
          {/* side wings */}
          {[-1, 1].map((sd) => (
            <mesh key={sd} position={[sd * (fp.w * s / 2 - 0.08), 0.52, 0]} castShadow>
              <boxGeometry args={[0.14, 1.04, fp.d * s]} />
              <meshStandardMaterial color={WOOD[2]} roughness={0.95} />
            </mesh>
          ))}
        </group>
      )
    case 'bottle-shelf':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* cabinet + warm back panel (the backlight) */}
          <mesh position={[0, fp.h / 2, -0.04]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s - 0.06]} />
            <meshStandardMaterial color={WOOD[2]} roughness={0.95} />
          </mesh>
          <mesh position={[0, fp.h / 2, fp.d * s / 2 - 0.14]}>
            <planeGeometry args={[fp.w * s - 0.2, fp.h - 0.3]} />
            <meshStandardMaterial
              color="#7a4a1e" emissive="#ffb85c" emissiveIntensity={night ? 1.5 : 0.5} roughness={0.8}
            />
          </mesh>
          {/* bottles on two glass ledges */}
          {[0.72, 1.36].map((y, r) => (
            <group key={y}>
              <mesh position={[0, y - 0.16, 0.05]} castShadow>
                <boxGeometry args={[fp.w * s - 0.14, 0.04, fp.d * s - 0.16]} />
                <meshStandardMaterial color="#cfe0e8" roughness={0.15} metalness={0.4} transparent opacity={0.55} />
              </mesh>
              {Array.from({ length: 7 }, (_, i) => (
                <mesh key={i} position={[-fp.w * s / 2 + 0.32 + i * ((fp.w * s - 0.62) / 6), y, 0.06]} castShadow>
                  <cylinderGeometry args={[0.05, 0.06, r === 0 ? 0.3 : 0.24, 8]} />
                  <meshStandardMaterial
                    color={['#b03a2e', '#3a6ea3', '#2e7d5b', '#d99a2b', '#8a4a6a', '#c96f3b', '#e8dcc3'][i]}
                    roughness={0.3} metalness={0.15} emissive="#ffb85c" emissiveIntensity={night ? 0.22 : 0.05}
                  />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )
    case 'dj-deck':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* the table */}
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.88, fp.d * s]} />
            <meshStandardMaterial color="#26221e" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[fp.w * s + 0.08, 0.06, fp.d * s + 0.06]} />
            <meshStandardMaterial color="#14161a" roughness={0.5} metalness={0.3} />
          </mesh>
          {/* two platters + a mixer strip */}
          {[-0.42, 0.42].map((x) => (
            <group key={x} position={[x, 0.95, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
                <meshStandardMaterial color="#2c2c30" roughness={0.4} metalness={0.3} />
              </mesh>
              <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.02, 10]} />
                <meshStandardMaterial color="#e8a317" metalness={0.6} roughness={0.3} emissive="#e8a317" emissiveIntensity={0.3} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 0.95, 0]}>
            <boxGeometry args={[0.34, 0.04, 0.24]} />
            <meshStandardMaterial color="#3a3f46" roughness={0.4} metalness={0.4} emissive="#39d98a" emissiveIntensity={0.35} />
          </mesh>
        </group>
      )
    case 'speaker':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color="#191c20" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.44, fp.d * s / 2 + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.17, 0.17, 0.04, 14]} />
            <meshStandardMaterial color="#101216" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.12, fp.d * s / 2 + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} />
            <meshStandardMaterial color="#101216" roughness={0.7} />
          </mesh>
          <mesh position={[0, fp.h - 0.08, fp.d * s / 2 + 0.012]}>
            <circleGeometry args={[0.035, 10]} />
            <meshStandardMaterial color="#e8a317" emissive="#e8a317" emissiveIntensity={night ? 1.2 : 0.4} />
          </mesh>
        </group>
      )
    case 'drink-table':
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h - 0.03, 0]} castShadow>
            <cylinderGeometry args={[fp.w * s / 2, fp.w * s / 2, 0.05, 16]} />
            <meshStandardMaterial color={WOOD[tone % WOOD.length]} roughness={0.7} />
          </mesh>
          <mesh position={[0, fp.h / 2 - 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, fp.h - 0.1, 8]} />
            <meshStandardMaterial color="#26221e" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.03, 0]} castShadow>
            <cylinderGeometry args={[fp.w * s / 2 - 0.08, fp.w * s / 2 - 0.04, 0.06, 16]} />
            <meshStandardMaterial color="#26221e" roughness={0.6} metalness={0.3} />
          </mesh>
          {/* two glasses catching the neon */}
          {[-0.14, 0.16].map((x, i) => (
            <mesh key={x} position={[x, fp.h + 0.07, i === 0 ? 0.08 : -0.05]} castShadow>
              <cylinderGeometry args={[0.045, 0.035, 0.14, 10]} />
              <meshStandardMaterial
                color="#d8ecf2" roughness={0.1} metalness={0.2} transparent opacity={0.7}
                emissive={i === 0 ? '#e8a317' : '#39d98a'} emissiveIntensity={0.25}
              />
            </mesh>
          ))}
        </group>
      )
    case 'school-desk':
      // the long shared desk with its attached bench seat — the Nigerian
      // classroom unit: hardwood top, steel frame, two pupils per desk
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* desk top */}
          <mesh position={[0, 0.72, -0.06]} castShadow>
            <boxGeometry args={[fp.w * s, 0.05, fp.d * s * 0.55]} />
            <meshStandardMaterial color={WOOD[tone % WOOD.length]} roughness={0.8} />
          </mesh>
          {/* steel legs */}
          {[-0.62, 0.62].map((x) => (
            <mesh key={x} position={[x * (fp.w * s / 1.5), 0.35, -0.06]}>
              <boxGeometry args={[0.05, 0.7, 0.05]} />
              <meshStandardMaterial color="#7d8288" metalness={0.55} roughness={0.4} />
            </mesh>
          ))}
          {/* attached bench seat behind */}
          <mesh position={[0, 0.44, fp.d * s * 0.34]} castShadow>
            <boxGeometry args={[fp.w * s * 0.96, 0.05, fp.d * s * 0.42]} />
            <meshStandardMaterial color={WOOD[(tone + 1) % WOOD.length]} roughness={1} />
          </mesh>
          {[0.55, 1.25].map((dz) => (
            <mesh key={dz} position={[0, 0.22, fp.d * s * dz / 1.6]}>
              <boxGeometry args={[fp.w * s * 0.8, 0.05, 0.05]} />
              <meshStandardMaterial color="#7d8288" metalness={0.55} roughness={0.4} />
            </mesh>
          ))}
        </group>
      )
    case 'blackboard':
      // framed board + chalk tray (tone 1 renders as a whiteboard)
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 1.32, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, 0.05]} />
            <meshStandardMaterial color={tone === 1 ? '#f2f4f2' : '#2f4234'} roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.32, 0.032]}>
            <boxGeometry args={[fp.w * s + 0.12, fp.h + 0.12, 0.02]} />
            <meshStandardMaterial color={WOOD[1]} roughness={1} />
          </mesh>
          {/* chalk tray with chalk sticks */}
          <mesh position={[0, 0.66, 0.09]} castShadow>
            <boxGeometry args={[fp.w * s * 0.8, 0.05, 0.1]} />
            <meshStandardMaterial color={WOOD[2]} roughness={1} />
          </mesh>
          {[-0.35, -0.1, 0.3].map((x) => (
            <mesh key={x} position={[x, 0.71, 0.09]} rotation={[0, x, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.11, 6]} />
              <meshStandardMaterial color="#f4f1e6" roughness={0.9} />
            </mesh>
          ))}
        </group>
      )
    case 'wallmap':
      // classroom wall chart — painted map poster with a wooden batten
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[fp.w * s, fp.h, 0.03]} />
            <meshStandardMaterial
              color={tone === 0 ? '#dfe8d2' : '#d6e4ec'} roughness={0.9}
            />
          </mesh>
          {/* land masses — simplified blobs in the school colours */}
          <mesh position={[-fp.w * s * 0.16, 1.62, 0.02]}>
            <boxGeometry args={[fp.w * s * 0.4, fp.h * 0.5, 0.012]} />
            <meshStandardMaterial color="#7da35c" roughness={0.9} />
          </mesh>
          <mesh position={[fp.w * s * 0.2, 1.4, 0.02]}>
            <boxGeometry args={[fp.w * s * 0.3, fp.h * 0.34, 0.012]} />
            <meshStandardMaterial color="#c8a45c" roughness={0.9} />
          </mesh>
          <mesh position={[0, 1.98, 0.025]}>
            <boxGeometry args={[fp.w * s + 0.06, 0.05, 0.02]} />
            <meshStandardMaterial color={WOOD[2]} roughness={1} />
          </mesh>
        </group>
      )
    case 'computer':
      // desk computer — monitor box + keyboard + glowing screen at night
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.62, 0]} castShadow>
            <boxGeometry args={[fp.w * s * 0.62, 0.36, 0.05]} />
            <meshStandardMaterial color="#26221e" roughness={0.5} />
          </mesh>
          <mesh
            position={[0, 0.62, 0.028]}
          >
            <boxGeometry args={[fp.w * s * 0.56, 0.3, 0.005]} />
            <meshStandardMaterial
              color="#9fd4e8" roughness={0.2}
              emissive="#bfe8f4" emissiveIntensity={night ? 0.9 : 0.12}
            />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.07, 0.16, 0.07]} />
            <meshStandardMaterial color="#26221e" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.47, 0.18]} rotation={[-0.06, 0, 0]}>
            <boxGeometry args={[0.34, 0.02, 0.12]} />
            <meshStandardMaterial color="#3a352e" roughness={0.6} />
          </mesh>
        </group>
      )
    case 'bunk':
      // student hostel bunk — steel frame, two mattresses, folded blanket
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* posts */}
          {[[-0.94, -0.42], [0.94, -0.42], [-0.94, 0.42], [0.94, 0.42]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x, 0.88, z]} castShadow>
              <boxGeometry args={[0.07, 1.76, 0.07]} />
              <meshStandardMaterial color="#5f6a72" metalness={0.6} roughness={0.45} />
            </mesh>
          ))}
          {/* lower mattress + base */}
          <mesh position={[0, 0.34, 0]} castShadow>
            <boxGeometry args={[1.92, 0.09, 0.92]} />
            <meshStandardMaterial color="#5f6a72" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.46, 0]} castShadow>
            <boxGeometry args={[1.88, 0.14, 0.88]} />
            <meshStandardMaterial color={FABRIC[tone % FABRIC.length]} roughness={0.95} />
          </mesh>
          {/* upper mattress + base */}
          <mesh position={[0, 1.28, 0]} castShadow>
            <boxGeometry args={[1.92, 0.09, 0.92]} />
            <meshStandardMaterial color="#5f6a72" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[1.88, 0.14, 0.88]} />
            <meshStandardMaterial color={FABRIC[(tone + 2) % FABRIC.length]} roughness={0.95} />
          </mesh>
          {/* folded blanket + pillow up top */}
          <mesh position={[-0.55, 1.51, 0.12]} castShadow>
            <boxGeometry args={[0.7, 0.09, 0.6]} />
            <meshStandardMaterial color="#e7ddc8" roughness={1} />
          </mesh>
          <mesh position={[0.72, 1.52, 0.05]} castShadow>
            <boxGeometry args={[0.34, 0.1, 0.5]} />
            <meshStandardMaterial color="#f2ead8" roughness={1} />
          </mesh>
          {/* ladder rungs */}
          {[0.55, 0.95, 1.35].map((y) => (
            <mesh key={y} position={[0.98, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.025, 0.025, 0.2, 6]} />
              <meshStandardMaterial color="#8a939b" metalness={0.55} roughness={0.4} />
            </mesh>
          ))}
        </group>
      )
    case 'locker':
      // steel student locker — vents, handle, house-colour door
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color="#6e7a84" metalness={0.55} roughness={0.5} />
          </mesh>
          <mesh position={[0, fp.h / 2 + 0.01, fp.d * s / 2 + 0.011]}>
            <boxGeometry args={[fp.w * s - 0.07, fp.h - 0.1, 0.02]} />
            <meshStandardMaterial color={accent} roughness={0.6} metalness={0.25} />
          </mesh>
          {/* vent slits */}
          {[0.35, 0.5, 1.25, 1.4].map((y) => (
            <mesh key={y} position={[0, y, fp.d * s / 2 + 0.024]}>
              <boxGeometry args={[fp.w * s * 0.6, 0.035, 0.012]} />
              <meshStandardMaterial color="#2c343a" roughness={0.8} />
            </mesh>
          ))}
          <mesh position={[fp.w * s * 0.28, 0.92, fp.d * s / 2 + 0.026]}>
            <boxGeometry args={[0.05, 0.16, 0.02]} />
            <meshStandardMaterial color="#d9d4c5" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      )
    case 'lab-bench':
      // science lab bench — hardwood top, reagent rack, gas taps, cupboards
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h - 0.045, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.07, fp.d * s]} />
            <meshStandardMaterial color="#26221e" roughness={0.55} />
          </mesh>
          <mesh position={[0, fp.h / 2 - 0.06, 0]} castShadow>
            <boxGeometry args={[fp.w * s - 0.08, fp.h - 0.16, fp.d * s - 0.1]} />
            <meshStandardMaterial color={WOOD[(tone + 2) % WOOD.length]} roughness={0.85} />
          </mesh>
          {/* reagent rack along the back edge */}
          <mesh position={[0, fp.h + 0.19, -fp.d * s / 2 + 0.1]} castShadow>
            <boxGeometry args={[fp.w * s * 0.8, 0.05, 0.09]} />
            <meshStandardMaterial color={WOOD[tone % WOOD.length]} roughness={0.9} />
          </mesh>
          {[-0.7, -0.35, 0, 0.35, 0.7].map((x, i) => (
            <mesh key={x} position={[x * fp.w * s * 0.5, fp.h + 0.11, -fp.d * s / 2 + 0.1]} castShadow>
              <cylinderGeometry args={[0.055, 0.05, i % 2 ? 0.15 : 0.22, 8]} />
              <meshStandardMaterial color={i === 2 ? '#7da35c' : i === 4 ? '#b0673a' : '#9fb6c2'} roughness={0.25} transparent opacity={0.85} />
            </mesh>
          ))}
          {/* gas taps */}
          {[-0.4, 0.4].map((x) => (
            <group key={x} position={[x * fp.w * s * 0.5, fp.h, 0.12]}>
              <mesh position={[0, 0.07, 0]}>
                <cylinderGeometry args={[0.026, 0.032, 0.14, 8]} />
                <meshStandardMaterial color="#b8b2a4" metalness={0.75} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.16, 0.05]} rotation={[Math.PI / 2.6, 0, 0]}>
                <cylinderGeometry args={[0.016, 0.016, 0.13, 6]} />
                <meshStandardMaterial color="#b8b2a4" metalness={0.75} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      )
    case 'fume-hood':
      // fume cupboard — steel base, glass sash, dark working chamber
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.44, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.88, fp.d * s]} />
            <meshStandardMaterial color="#8d949c" metalness={0.4} roughness={0.55} />
          </mesh>
          <mesh position={[0, 1.5, -0.06]} castShadow>
            <boxGeometry args={[fp.w * s, 1.22, fp.d * s - 0.12]} />
            <meshStandardMaterial color="#3a3e44" roughness={0.7} />
          </mesh>
          {/* glass sash */}
          <mesh position={[0, 1.52, fp.d * s / 2 - 0.05]}>
            <boxGeometry args={[fp.w * s - 0.14, 0.95, 0.03]} />
            <meshStandardMaterial color="#b9d8e0" transparent opacity={0.35} roughness={0.12} metalness={0.1} />
          </mesh>
          {/* duct */}
          <mesh position={[0, 2.32, -0.1]}>
            <cylinderGeometry args={[0.11, 0.11, 0.5, 10]} />
            <meshStandardMaterial color="#9aa1a8" metalness={0.5} roughness={0.45} />
          </mesh>
        </group>
      )
    case 'basin':
      // wall wash basin — safety first in every lab
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.82, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.16, fp.d * s]} />
            <meshStandardMaterial color="#eef0ea" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.9, -0.03]}>
            <boxGeometry args={[fp.w * s - 0.1, 0.05, fp.d * s - 0.12]} />
            <meshStandardMaterial color="#dfe2da" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.02, -fp.d * s / 2 + 0.08]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 6]} />
            <meshStandardMaterial color="#b8b2a4" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.12, -fp.d * s / 2 + 0.14]} rotation={[Math.PI / 2.4, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.1, 6]} />
            <meshStandardMaterial color="#b8b2a4" metalness={0.8} roughness={0.25} />
          </mesh>
          {/* pedestal */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.09, 0.12, 0.8, 8]} />
            <meshStandardMaterial color="#eef0ea" roughness={0.4} />
          </mesh>
        </group>
      )
    case 'specimen-cabinet':
      // glass specimen cabinet — jars and preserved samples on shelves
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} castShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color={WOOD[tone % WOOD.length]} roughness={0.85} />
          </mesh>
          <mesh position={[0, fp.h / 2 + 0.02, fp.d * s / 2 + 0.015]}>
            <boxGeometry args={[fp.w * s - 0.1, fp.h - 0.14, 0.02]} />
            <meshStandardMaterial color="#bcd8e2" transparent opacity={0.38} roughness={0.1} metalness={0.1} />
          </mesh>
          {/* shelves with specimen jars */}
          {[0.62, 1.05, 1.48].map((y, si) => (
            <group key={y}>
              <mesh position={[0, y, 0.02]}>
                <boxGeometry args={[fp.w * s - 0.14, 0.03, fp.d * s - 0.1]} />
                <meshStandardMaterial color={WOOD[(tone + 1) % WOOD.length]} roughness={0.9} />
              </mesh>
              {[-0.3, 0, 0.3].map((x, i) => (
                <mesh key={`${x}${si}`} position={[x * fp.w * s * 0.42, y + 0.1, 0.02]} castShadow>
                  <cylinderGeometry args={[0.055, 0.05, 0.13 + (i % 2) * 0.05, 8]} />
                  <meshStandardMaterial color={['#8fae7c', '#a88f5c', '#7c9fae'][(i + si) % 3]} roughness={0.3} transparent opacity={0.8} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      )
    case 'microscope':
      // compound microscope — bench-top, ocular tube + stage
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.025, 0]} castShadow>
            <boxGeometry args={[0.2, 0.05, 0.26]} />
            <meshStandardMaterial color="#3a3e44" metalness={0.45} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.16, -0.03]} rotation={[0.16, 0, 0]} castShadow>
            <cylinderGeometry args={[0.032, 0.042, 0.26, 10]} />
            <meshStandardMaterial color="#565e66" metalness={0.55} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.29, -0.05]} rotation={[0.16, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.026, 0.07, 8]} />
            <meshStandardMaterial color="#2c3036" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.1, 0.07]}>
            <boxGeometry args={[0.14, 0.02, 0.09]} />
            <meshStandardMaterial color="#6e7a84" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* the slide */}
          <mesh position={[0, 0.115, 0.07]}>
            <boxGeometry args={[0.07, 0.005, 0.05]} />
            <meshStandardMaterial color="#d8ecf2" roughness={0.2} />
          </mesh>
        </group>
      )
    case 'skeleton':
      // articulated skeleton model on a rolling stand — anatomy's boss prop
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          {/* stand */}
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 0.1, 10]} />
            <meshStandardMaterial color="#3a3e44" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
            <meshStandardMaterial color="#8a939b" metalness={0.6} roughness={0.35} />
          </mesh>
          {/* spine + pelvis */}
          <mesh position={[0, 1.12, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.05, 0.5, 8]} />
            <meshStandardMaterial color="#ece6d4" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.86, 0]} castShadow>
            <boxGeometry args={[0.24, 0.12, 0.14]} />
            <meshStandardMaterial color="#ece6d4" roughness={0.85} />
          </mesh>
          {/* ribcage */}
          {[1.02, 1.08, 1.14, 1.2, 1.26].map((y, i) => (
            <mesh key={y} position={[0, y, 0]} rotation={[0, i * 0.2, 0]}>
              <torusGeometry args={[0.13 - i * 0.008, 0.014, 6, 14, Math.PI * 1.5]} />
              <meshStandardMaterial color="#ece6d4" roughness={0.85} />
            </mesh>
          ))}
          {/* skull */}
          <mesh position={[0, 1.48, 0]} castShadow>
            <sphereGeometry args={[0.11, 12, 10]} />
            <meshStandardMaterial color="#f2ecda" roughness={0.85} />
          </mesh>
          <mesh position={[0, 1.4, 0.05]}>
            <boxGeometry args={[0.12, 0.08, 0.1]} />
            <meshStandardMaterial color="#f2ecda" roughness={0.85} />
          </mesh>
          {/* arms + legs */}
          {[[-0.15], [0.15]].map(([x]) => (
            <mesh key={x} position={[x, 1.12, 0]} rotation={[0, 0, x > 0 ? -0.12 : 0.12]}>
              <cylinderGeometry args={[0.02, 0.018, 0.52, 6]} />
              <meshStandardMaterial color="#ece6d4" roughness={0.85} />
            </mesh>
          ))}
          {[[-0.09], [0.09]].map(([x]) => (
            <mesh key={x} position={[x, 0.45, 0]}>
              <cylinderGeometry args={[0.024, 0.02, 0.72, 6]} />
              <meshStandardMaterial color="#ece6d4" roughness={0.85} />
            </mesh>
          ))}
        </group>
      )
    case 'dissection-table':
      // steel dissection table — slight drain slope, hose at the corner
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h - 0.03, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.06, fp.d * s]} />
            <meshStandardMaterial color="#c9cdd2" metalness={0.65} roughness={0.3} />
          </mesh>
          <mesh position={[0, fp.h - 0.075, 0]}>
            <boxGeometry args={[fp.w * s - 0.06, 0.03, fp.d * s - 0.06]} />
            <meshStandardMaterial color="#aeb4ba" metalness={0.6} roughness={0.35} />
          </mesh>
          {/* legs */}
          {[[-0.82, -0.3], [0.82, -0.3], [-0.82, 0.3], [0.82, 0.3]].map(([x, z]) => (
            <mesh key={`${x}${z}`} position={[x * fp.w * s * 0.55, 0.42, z * fp.d * s * 0.6]}>
              <cylinderGeometry args={[0.035, 0.035, 0.84, 8]} />
              <meshStandardMaterial color="#8d949c" metalness={0.6} roughness={0.4} />
            </mesh>
          ))}
          {/* drain + hose */}
          <mesh position={[0, fp.h + 0.005, 0.24]}>
            <cylinderGeometry args={[0.045, 0.045, 0.012, 10]} />
            <meshStandardMaterial color="#565e66" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[fp.w * s * 0.38, fp.h - 0.2, fp.d * s * 0.3]} rotation={[0.5, 0, 1.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.42, 8]} />
            <meshStandardMaterial color="#7c8571" roughness={0.8} />
          </mesh>
        </group>
      )
    case 'podium':
      // lecture podium — angled top, mic stem, school crest panel
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.58, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 1.06, fp.d * s]} />
            <meshStandardMaterial color={WOOD[tone % WOOD.length]} roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.14, 0.02]} rotation={[-0.22, 0, 0]} castShadow>
            <boxGeometry args={[fp.w * s + 0.06, 0.05, fp.d * s + 0.12]} />
            <meshStandardMaterial color={WOOD[(tone + 1) % WOOD.length]} roughness={0.7} />
          </mesh>
          {/* mic */}
          <mesh position={[0.14, 1.3, 0.05]} rotation={[0.35, 0, -0.15]}>
            <cylinderGeometry args={[0.012, 0.012, 0.28, 6]} />
            <meshStandardMaterial color="#2c3036" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0.19, 1.42, 0.1]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color="#2c3036" roughness={0.6} />
          </mesh>
          {/* crest panel */}
          <mesh position={[0, 0.62, fp.d * s / 2 + 0.012]}>
            <boxGeometry args={[fp.w * s * 0.55, 0.4, 0.015]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
        </group>
      )
    case 'riser':
      // tiered lecture platform — stepped concrete, benches sit on top
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, fp.h / 2, 0]} receiveShadow>
            <boxGeometry args={[fp.w * s, fp.h, fp.d * s]} />
            <meshStandardMaterial color="#c8c2b4" roughness={0.95} />
          </mesh>
          <mesh position={[0, fp.h + 0.09, -fp.d * s / 2 + 0.16]} receiveShadow>
            <boxGeometry args={[fp.w * s, fp.h, 0.32]} />
            <meshStandardMaterial color="#b6b0a2" roughness={0.95} />
          </mesh>
        </group>
      )
    case 'machine':
      // workshop machine — lathe/mill on a plinth with a chuck + gears
      return (
        <group position={[f.x, 0, f.z]} rotation={rot}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <boxGeometry args={[fp.w * s, 0.28, fp.d * s]} />
            <meshStandardMaterial color="#6e7a84" metalness={0.45} roughness={0.55} />
          </mesh>
          <mesh position={[-0.4, 0.62, 0]} castShadow>
            <boxGeometry args={[0.42, 0.68, 0.6]} />
            <meshStandardMaterial color="#3a6ea3" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0.35, 0.5, 0]} castShadow>
            <boxGeometry args={[1.1, 0.16, 0.3]} />
            <meshStandardMaterial color="#b8b2a4" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0.85, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 12]} />
            <meshStandardMaterial color="#565e66" metalness={0.65} roughness={0.3} />
          </mesh>
          {/* chuck jaws */}
          <mesh position={[0.85, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.05, 0.05, 0.14, 8]} />
            <meshStandardMaterial color="#2c3036" metalness={0.6} roughness={0.4} />
          </mesh>
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
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 256
    const ctx = c.getContext('2d')!
    ctx.fillStyle = def.palette.floor
    ctx.fillRect(0, 0, 256, 256)
    if (def.floorTiles) {
      // Stage 5-b — ceramic tiles (the bank): alternating tone + grout lines
      ctx.fillStyle = def.palette.floorAlt
      for (let y = 0; y < 256; y += 64) {
        for (let x = 0; x < 256; x += 64) {
          if (((x / 64) + (y / 64)) % 2 === 0) ctx.fillRect(x, y, 64, 64)
        }
      }
      ctx.fillStyle = 'rgba(40,32,22,0.35)'
      for (let v = 0; v <= 256; v += 64) {
        ctx.fillRect(0, v - 1, 256, 2)
        ctx.fillRect(v - 1, 0, 2, 256)
      }
    } else {
      // subtle plank stripes painted on a canvas texture
      ctx.fillStyle = def.palette.floorAlt
      for (let y = 0; y < 256; y += 32) {
        ctx.fillRect(0, y, 256, 2)
        for (let x = ((y / 32) % 2) * 64; x < 256; x += 128) ctx.fillRect(x, y, 2, 32)
      }
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
        <Furniture key={i} f={f} night={night} accent={def.palette.accent} />
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
  // HUD hotspots + Stage 5-b action hotspots share the same golden-pin language
  const points: { id: string; x: number; z: number }[] = [
    ...def.hotspots.map((h) => ({ id: h.id, x: h.x, z: h.z })),
    ...(def.actions ?? []).map((a) => ({ id: a.id, x: a.x, z: a.z })),
  ]
  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < points.length; i++) {
      const m = refs.current[i]
      if (!m) continue
      const p = points[i]
      const active = nearestRef.current === p.id
      m.scale.setScalar((active ? 1.35 : 1) * (1 + Math.sin(t * 3 + i) * 0.08))
      const mat = m.material as THREE.MeshBasicMaterial
      mat.color.set(active ? '#ffd88a' : '#e8a317')
      mat.opacity = active ? 0.95 : 0.6
    }
  })
  return (
    <group>
      {points.map((p, idx) => (
        <mesh
          key={p.id}
          ref={(el) => { refs.current[idx] = el }}
          position={[p.x, 1.62, p.z]}
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
  onNearest,
  onNearAction,
}: {
  def: InteriorDef
  avatar: AvatarConfig
  spawn: { x: number; z: number; facing: number }
  onHotspot?: (id: string | null) => void
  /** every nearest-point change (HUD hotspots AND actions) — marker highlight */
  onNearest?: (id: string | null) => void
  /** Stage 5-b — the nearest in-scene action hotspot (or null) */
  onNearAction?: (a: ActionDef | null) => void
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
    nearAction: null as string | null,
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

    // nearest interactive point — HUD hotspots and the Stage 5-b action
    // hotspots compete on the SAME radius; the single closest one wins, so
    // only one prompt (HUD chip or in-scene chip) can ever show at a time.
    let bestId: string | null = null
    let bestAction: ActionDef | null = null
    let bestD: number = INTERIOR.hotspotRadius
    for (const h of def.hotspots) {
      const d = Math.hypot(h.x - s.x, h.z - s.z)
      if (d < bestD) {
        bestD = d
        bestId = h.id
        bestAction = null
      }
    }
    for (const a of def.actions ?? []) {
      const d = Math.hypot(a.x - s.x, a.z - s.z)
      if (d < bestD) {
        bestD = d
        bestId = a.id
        bestAction = a
      }
    }
    if (bestId !== s.near) {
      s.near = bestId
      onNearest?.(bestId)
      // action hotspots are owned by THIS layer — the HUD never sees them
      onHotspot?.(bestAction ? null : bestId)
    }
    if ((bestAction?.id ?? null) !== s.nearAction) {
      s.nearAction = bestAction?.id ?? null
      onNearAction?.(bestAction)
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

/** the in-scene chip icon per action kind (matches the HUD chip anatomy) */
const ACTION_ICON: Record<ActionDef['kind'], string> = {
  workout: '💪',
  'bank-teller': '🏦',
  'civic-desk': '🏛️',
  'night-out': '🍾',
  wardrobe: '👕',
  study: '📚',
}

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

  // Stage 5-b — in-scene action state (prompt chip + self-owned panels).
  // Sheet state carries its owning interior id so a (defensive) interior
  // swap can never show a stale panel; walking-input freeze mirrors it.
  const [nearAction, setNearAction] = useState<ActionDef | null>(null)
  const [sheet, setSheet] = useState<{ owner: string; kind: 'bank' | 'lounge' | 'civic' } | null>(null)
  const nearActionRef = useRef<ActionDef | null>(null)
  const sheetRef = useRef<{ owner: string; kind: 'bank' | 'lounge' | 'civic' } | null>(null)
  useEffect(() => {
    nearActionRef.current = nearAction
  }, [nearAction])
  useEffect(() => {
    sheetRef.current = sheet
  }, [sheet])
  // leaving the world must never leave the joystick frozen
  useEffect(() => () => freezeInput(false), [])

  // live = still valid for THIS interior (guards against any def swap)
  const shownAction = nearAction && (def.actions ?? []).some((a) => a.id === nearAction.id) ? nearAction : null
  const shownSheet = sheet?.owner === def.id ? sheet.kind : null

  const closeSheet = () => {
    setSheet(null)
    sheetRef.current = null
    freezeInput(false)
  }

  /** activate the nearest action — money/time flows through the store only */
  const activateAction = (a: ActionDef) => {
    audio.play('click')
    switch (a.kind) {
      case 'workout':
        // the store applies the slot + needs and shows its own toast
        useGameStore.getState().workout()
        break
      case 'study':
        // Stage 7 — school hours: the store applies slot + needs + smart XP
        useGameStore.getState().study(a.label)
        break
      case 'bank-teller':
        setSheet({ owner: def.id, kind: 'bank' })
        sheetRef.current = { owner: def.id, kind: 'bank' }
        freezeInput(true)
        break
      case 'civic-desk':
        // M2 — one action kind, four agencies; the panel reads the interior id
        setSheet({ owner: def.id, kind: 'civic' })
        sheetRef.current = { owner: def.id, kind: 'civic' }
        freezeInput(true)
        break
      case 'night-out':
        setSheet({ owner: def.id, kind: 'lounge' })
        sheetRef.current = { owner: def.id, kind: 'lounge' }
        freezeInput(true)
        break
      case 'wardrobe':
        // the wardrobe UI lives in another layer — ring the bus
        useWardrobeBus.getState().show()
        break
    }
  }

  // keyboard: E / Enter activates the nearest action, Escape closes my sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (e.code === 'Escape') {
        if (sheetRef.current) {
          setSheet(null)
          sheetRef.current = null
          freezeInput(false)
        }
        return
      }
      if (e.code !== 'KeyE' && e.code !== 'Enter') return
      // a focused button fires click itself — don't double-fire on Enter
      if (e.code === 'Enter' && tag === 'BUTTON') return
      if (isInputFrozen() || sheetRef.current) return
      const a = nearActionRef.current
      if (a) activateAction(a)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    // E2E hook: let tests peek at the interior without DOM digging
    if (process.env.NODE_ENV !== 'production') {
      const w = window as unknown as Record<string, unknown>
      w.__lkoInterior = {
        id: def.id,
        hotspots: def.hotspots.map((h) => h.id),
        actions: (def.actions ?? []).map((a) => ({ id: a.id, kind: a.kind, label: a.label })),
      }
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__lkoInterior
    }
  }, [def])

  return (
    <>
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
          key={def.id}
          def={def}
          avatar={avatar}
          spawn={def.spawn}
          onNearest={(id) => {
            nearestRef.current = id
          }}
          onHotspot={onHotspot}
          onNearAction={setNearAction}
        />
      </Canvas>

      {/* ---- Stage 5-b — in-scene action prompt chip ----
        Shown only while an ACTION hotspot is nearest; HUD hotspots keep the
        HUD's own chip (the two can never show together — one nearest wins). */}
      {shownAction && !shownSheet && (
        <div
          data-lko-chip={shownAction.kind}
          className="pointer-events-none absolute inset-x-0 bottom-32 z-[45] flex justify-center px-6 sm:bottom-10"
        >
          <button
            onClick={() => activateAction(shownAction)}
            className="lko-press lko-pop pointer-events-auto flex max-w-full items-center gap-2.5 rounded-full border border-[#ffd88a]/45 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffd88a] text-[11px] font-black text-[#3d2a00]">
              {ACTION_ICON[shownAction.kind]}
            </span>
            <span className="truncate text-[14px] font-extrabold">{shownAction.label}</span>
            <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold">E</kbd>
          </button>
        </div>
      )}

      {/* ---- Stage 5-b — self-owned bottom sheets ---- */}
      {shownSheet === 'bank' && <BankPanel onClose={closeSheet} />}
      {shownSheet === 'lounge' && <LoungeConfirm onClose={closeSheet} />}
      {shownSheet === 'civic' && (
        <CivicPanel
          office={def.id as 'kgirs-office' | 'nepa-office' | 'police-station' | 'efcc-office'}
          onClose={closeSheet}
        />
      )}
    </>
  )
}
