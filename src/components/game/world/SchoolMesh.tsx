'use client'

/**
 * LOKOJA LIFE — School Mesh (Stage 7)
 * ------------------------------------
 * Renders every school compound from the pure world3d/schools.ts data:
 * swept sand yards, painted perimeter walls with rhythm pillars, the
 * gatehouse pair with the painted name board, long classroom blocks with
 * front verandas + louvre window bands + corrugated gable roofs, the
 * admin / library / lab / theatre / toilet blocks, flagpole with
 * school-colour flag, borehole water tank, football pitch with real line
 * markings, and the laterite driveway that ties each gate to the real
 * road it meets.
 *
 * Instanced per part-kind — 12 compounds render in a handful of draw
 * calls, everything reads at the arcade city scale the rest of the world
 * uses, and nothing here mutates game state.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { SCHOOL_COMPOUNDS, type SchoolBox, type SchoolBoxKind } from '@/game/world3d/schools'
import { heightAt } from '@/game/world3d/layout'

/* ------------------------------- shared palettes ------------------------------ */

const SAND_YARD = '#c9a86a'
const SAND_ASM = '#d4b479'
const LATERITE = '#a5623a'
const CONCRETE = '#b8b2a4'
const PILLAR_TONES = ['#d8d2c2', '#cfc9b8', '#e0dacb']
const STEEL = '#7d8288'
const ROOF_TONES = ['#8a4a2a', '#6e4530', '#96543a', '#7a6a55']
const LOUVRE = '#9fc4cc'

/* ------------------------------- gate name board ------------------------------ */

const boardTexCache = new Map<string, THREE.CanvasTexture>()

function gateBoardTexture(name: string, motto: string, color: string): THREE.CanvasTexture {
  const key = `${name}|${motto}|${color}`
  let tex = boardTexCache.get(key)
  if (tex) return tex
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 256
  const ctx = c.getContext('2d')!
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1024, 256)
  ctx.fillStyle = 'rgba(255,255,255,0.14)'
  ctx.fillRect(0, 0, 1024, 26)
  ctx.fillRect(0, 230, 1024, 26)
  ctx.strokeStyle = '#f4efe2'
  ctx.lineWidth = 8
  ctx.strokeRect(10, 10, 1004, 236)
  ctx.fillStyle = '#fdf9ec'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let size = 76
  ctx.font = `900 ${size}px Arial, sans-serif`
  while (ctx.measureText(name).width > 940 && size > 34) {
    size -= 4
    ctx.font = `900 ${size}px Arial, sans-serif`
  }
  ctx.fillText(name, 512, 108)
  ctx.font = 'italic 600 40px Georgia, serif'
  ctx.fillStyle = '#f1e6c8'
  ctx.fillText(`“${motto}”`, 512, 190)
  tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  boardTexCache.set(key, tex)
  return tex
}

/** pitch line markings — one shared canvas */
function pitchTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 320
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#7d8a4a'
  ctx.fillRect(0, 0, 512, 320)
  ctx.strokeStyle = 'rgba(250,248,240,0.85)'
  ctx.lineWidth = 6
  ctx.strokeRect(18, 18, 476, 284)
  ctx.beginPath()
  ctx.moveTo(256, 18)
  ctx.lineTo(256, 302)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(256, 160, 52, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeRect(18, 96, 66, 128)
  ctx.strokeRect(428, 96, 66, 128)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* --------------------------------- instancing --------------------------------- */

interface InstancedProps {
  count: number
  setup: (i: number, mesh: THREE.Object3D, color: THREE.Color) => void
  children: React.ReactNode
  castShadow?: boolean
  receiveShadow?: boolean
}

/** thin wrapper that fills an InstancedMesh once on mount (CityMesh pattern) */
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

/* --------------------------------- the mesh ----------------------------------- */

const RUST_REF = new THREE.Color('#7a4a30')

export function SchoolMesh() {
  const compounds = SCHOOL_COMPOUNDS

  // group all compound boxes once — kind → list
  const groups = useMemo(() => {
    const by: Record<SchoolBoxKind, SchoolBox[]> = {
      wall: [], pillar: [], gatehouse: [], block: [], admin: [], library: [],
      lab: [], office: [], toilet: [], theatre: [], flag: [], water: [], veranda: [],
      senate: [], faculty: [], hostel: [], watchtower: [], healthsci: [],
      workshop: [], chapel: [], mosque: [], hall: [], canteen: [], clinic: [], demo: [],
    }
    for (const c of compounds) {
      for (const b of c.boxes) by[b.kind].push(b)
    }
    return by
  }, [compounds])

  const siteById = useMemo(() => {
    const m = new Map<string, (typeof compounds)[number]['site']>()
    for (const c of compounds) m.set(c.site.id, c.site)
    return m
  }, [compounds])

  const pitchTex = useMemo(() => pitchTexture(), [])
  useEffect(() => () => pitchTex.dispose(), [pitchTex])

  /** body position/rotation for a plain box part */
  const bodySetup = (list: SchoolBox[], paint: (b: SchoolBox) => string, i: number, m: THREE.Object3D, color: THREE.Color) => {
    const b = list[i]
    m.position.set(b.x, b.y + b.h / 2, b.z)
    m.rotation.set(0, b.rotY, 0)
    m.scale.set(b.w, b.h, b.d)
    color.set(paint(b))
  }

  /** gable roof over a block — squashed 4-cone like the city hip roofs */
  const roofSetup = (list: SchoolBox[], paint: (b: SchoolBox) => string, i: number, m: THREE.Object3D, color: THREE.Color) => {
    const b = list[i]
    const roofH = Math.min(b.w, b.d) * 0.42
    m.position.set(b.x, b.y + b.h + roofH / 2 - 0.02, b.z)
    m.rotation.set(0, b.rotY + Math.PI / 4, 0)
    m.scale.set(b.w + 1.2, roofH, b.d + 1.2)
    color.set(paint(b)).lerp(RUST_REF, 0.22)
  }

  const schoolPaint = (fallbacks: string[]) => (b: SchoolBox) => {
    const s = siteById.get(b.schoolId)
    return s?.paint ?? fallbacks[0]
  }
  const wallPaint = schoolPaint(['#e8e0cc'])
  const roofPaint = () => ROOF_TONES[0]

  const bigKinds: SchoolBoxKind[] = [
    'office', 'admin', 'library', 'lab', 'theatre',
    'faculty', 'hostel', 'healthsci', 'workshop', 'chapel', 'mosque',
    'hall', 'canteen', 'clinic', 'demo',
  ]
  const bigList = useMemo(() => bigKinds.flatMap((k) => groups[k]), [groups])

  /** roof tone per kind — the painted corrugated variety real campuses carry */
  const roofTone = (kind: SchoolBoxKind): number =>
    kind === 'admin' ? 3
    : kind === 'library' ? 1
    : kind === 'chapel' || kind === 'mosque' ? 0
    : kind === 'hostel' || kind === 'hall' ? 2
    : kind === 'senate' ? 3
    : 2

  return (
    <group>
      {/* sand yard, assembly ground, pitch, driveway — per compound */}
      {compounds.map((c) => {
        const y = c.gate.y
        return (
          <group key={`ground-${c.site.id}`}>
            {/* the swept yard */}
            <mesh position={[c.gate.x, y + 0.05, c.gate.z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
              <circleGeometry args={[c.groundR, 26]} />
              <meshStandardMaterial color={SAND_YARD} roughness={1} />
            </mesh>
            {/* assembly ground, slightly lighter sweep */}
            <mesh position={[c.assembly.x, y + 0.07, c.assembly.z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
              <circleGeometry args={[c.assembly.r, 22]} />
              <meshStandardMaterial color={SAND_ASM} roughness={1} />
            </mesh>
            {/* small yards paint their touchlines on the assembly ground */}
            {!c.pitch && c.site.field && (
              <mesh position={[c.assembly.x, y + 0.085, c.assembly.z]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
                <ringGeometry args={[c.assembly.r * 0.8, c.assembly.r * 0.85, 32]} />
                <meshBasicMaterial color="#f6f2e4" transparent opacity={0.7} />
              </mesh>
            )}
            {/* real grass pitch when the compound can honestly hold one */}
            {c.pitch && (
              <mesh
                position={[c.pitch.x, y + 0.08, c.pitch.z]}
                rotation={[-Math.PI / 2, 0, -c.pitch.rotY]}
                renderOrder={3}
              >
                <planeGeometry args={[c.pitch.w, c.pitch.d]} />
                <meshStandardMaterial map={pitchTex} roughness={1} />
              </mesh>
            )}
            {/* laterite driveway: real road → gate */}
            {c.drive && (
              <mesh
                position={[
                  (c.drive.ax + c.drive.bx) / 2,
                  Math.min(y, heightAt(c.drive.ax, c.drive.az)) + 0.06,
                  (c.drive.az + c.drive.bz) / 2,
                ]}
                rotation={[
                  -Math.PI / 2,
                  0,
                  -Math.atan2(c.drive.bx - c.drive.ax, c.drive.bz - c.drive.az),
                ]}
                renderOrder={1}
              >
                <planeGeometry args={[2.3, Math.hypot(c.drive.bx - c.drive.ax, c.drive.bz - c.drive.az) + 2]} />
                <meshStandardMaterial color={LATERITE} roughness={1} />
              </mesh>
            )}
          </group>
        )
      })}

      {/* painted perimeter walls */}
      <InstancedGroup count={groups.wall.length} castShadow receiveShadow setup={(i, m, color) => bodySetup(groups.wall, wallPaint, i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.95} />
      </InstancedGroup>

      {/* veranda slabs (concrete walkways) */}
      <InstancedGroup count={groups.veranda.length} receiveShadow setup={(i, m, color) => bodySetup(groups.veranda, () => CONCRETE, i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} />
      </InstancedGroup>

      {/* rhythm pillars along walls + verandas */}
      <InstancedGroup count={groups.pillar.length} castShadow setup={(i, m, color) => bodySetup(groups.pillar, (b) => PILLAR_TONES[b.h > 3 ? 2 : i % 2], i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.92} />
      </InstancedGroup>

      {/* gatehouse pair — taller, school paint */}
      <InstancedGroup count={groups.gatehouse.length} castShadow setup={(i, m, color) => bodySetup(groups.gatehouse, wallPaint, i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} />
      </InstancedGroup>

      {/* classroom blocks + corrugated gable roofs */}
      <InstancedGroup count={groups.block.length} castShadow receiveShadow setup={(i, m, color) => bodySetup(groups.block, wallPaint, i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.94} />
      </InstancedGroup>
      <InstancedGroup count={groups.block.length} castShadow setup={(i, m, color) => roofSetup(groups.block, roofPaint, i, m, color)}>
        <coneGeometry args={[0.71, 1, 4]} />
        <meshStandardMaterial roughness={0.62} metalness={0.22} flatShading />
      </InstancedGroup>

      {/* big buildings: office / admin / library / lab / theatre + the Stage 8 kinds, with roofs */}
      <InstancedGroup count={bigList.length} castShadow receiveShadow setup={(i, m, color) => bodySetup(bigList, wallPaint, i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.94} />
      </InstancedGroup>
      <InstancedGroup count={bigList.length} castShadow setup={(i, m, color) => roofSetup(bigList, () => ROOF_TONES[roofTone(bigList[i].kind)], i, m, color)}>
        <coneGeometry args={[0.71, 1, 4]} />
        <meshStandardMaterial roughness={0.62} metalness={0.22} flatShading />
      </InstancedGroup>

      {/* the Senate Building — clock face + entrance steps on the front face */}
      {compounds.flatMap((c) =>
        c.boxes
          .filter((b) => b.kind === 'senate')
          .map((b, i) => (
            <group key={`senate-${c.site.id}-${i}`}>
              {/* entrance steps */}
              {[0, 1, 2].map((s) => (
                <mesh
                  key={s}
                  position={[
                    b.x + Math.sin(b.rotY) * (b.d / 2 + 0.28 + s * 0.42),
                    b.y + 0.07 + (2 - s) * 0.07,
                    b.z + Math.cos(b.rotY) * (b.d / 2 + 0.28 + s * 0.42),
                  ]}
                  rotation={[0, b.rotY, 0]}
                  castShadow
                  receiveShadow
                >
                  <boxGeometry args={[b.w * 0.5, 0.14 + s * 0.07, 0.5]} />
                  <meshStandardMaterial color="#c8c2b4" roughness={0.9} />
                </mesh>
              ))}
              {/* the clock — white disc, dark hands, above the entrance */}
              <group
                position={[
                  b.x + Math.sin(b.rotY) * (b.d / 2 + 0.1),
                  b.y + b.h * 0.74,
                  b.z + Math.cos(b.rotY) * (b.d / 2 + 0.1),
                ]}
                rotation={[0, b.rotY, 0]}
              >
                <mesh castShadow>
                  <cylinderGeometry args={[0.55, 0.55, 0.12, 20]} />
                  <meshStandardMaterial color="#f4efe2" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
                  <boxGeometry args={[0.05, 0.34, 0.02]} />
                  <meshStandardMaterial color="#26221e" roughness={0.6} />
                </mesh>
                <mesh position={[0.12, 0.02, 0.075]} rotation={[Math.PI / 2, 0, -Math.PI / 3]}>
                  <boxGeometry args={[0.04, 0.24, 0.02]} />
                  <meshStandardMaterial color="#26221e" roughness={0.6} />
                </mesh>
              </group>
            </group>
          )),
      )}

      {/* the security watchtower — tall post, cabin on top, pyramid cap */}
      {compounds.flatMap((c) =>
        c.boxes
          .filter((b) => b.kind === 'watchtower')
          .map((b, i) => (
            <group key={`tower-${c.site.id}-${i}`}>
              <mesh position={[b.x, b.y + b.h * 0.42, b.z]} castShadow>
                <boxGeometry args={[b.w * 0.55, b.h * 0.84, b.d * 0.55]} />
                <meshStandardMaterial color="#b8b2a4" roughness={0.92} />
              </mesh>
              {/* the cabin — glazed, all-round view */}
              <mesh position={[b.x, b.y + b.h * 0.94, b.z]} castShadow>
                <boxGeometry args={[b.w * 1.5, b.h * 0.2, b.d * 1.5]} />
                <meshStandardMaterial color="#9fc4cc" roughness={0.25} metalness={0.15} />
              </mesh>
              <mesh position={[b.x, b.y + b.h + 0.22, b.z]} castShadow>
                <coneGeometry args={[b.w * 1.15, 0.5, 4]} />
                <meshStandardMaterial color={ROOF_TONES[0]} roughness={0.62} metalness={0.2} flatShading />
              </mesh>
            </group>
          )),
      )}

      {/* the chapel cross + the mosque dome */}
      {compounds.flatMap((c) =>
        c.boxes
          .filter((b) => b.kind === 'chapel' || b.kind === 'mosque')
          .map((b, i) =>
            b.kind === 'chapel' ? (
              <group key={`chapel-${c.site.id}-${i}`} position={[b.x, b.y, b.z]} rotation={[0, b.rotY, 0]}>
                {/* cross on the front gable */}
                <mesh position={[0, b.h + 1.05, b.d / 2 - 0.1]} castShadow>
                  <boxGeometry args={[0.09, 0.72, 0.09]} />
                  <meshStandardMaterial color="#f2ecda" roughness={0.7} />
                </mesh>
                <mesh position={[0, b.h + 1.18, b.d / 2 - 0.1]} castShadow>
                  <boxGeometry args={[0.34, 0.09, 0.09]} />
                  <meshStandardMaterial color="#f2ecda" roughness={0.7} />
                </mesh>
              </group>
            ) : (
              <group key={`mosque-${c.site.id}-${i}`} position={[b.x, b.y, b.z]}>
                {/* the dome */}
                <mesh position={[0, b.h + 0.42, 0]} castShadow>
                  <sphereGeometry args={[1.15, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                  <meshStandardMaterial color="#2e7d5b" roughness={0.5} metalness={0.25} />
                </mesh>
                <mesh position={[0, b.h + 1.62, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.03, 0.42, 6]} />
                  <meshStandardMaterial color="#d9c26a" metalness={0.7} roughness={0.3} />
                </mesh>
              </group>
            ),
          ),
      )}

      {/* toilet block (squat, unpainted cement) */}
      <InstancedGroup count={groups.toilet.length} castShadow setup={(i, m, color) => bodySetup(groups.toilet, () => '#c8c2b2', i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.95} />
      </InstancedGroup>

      {/* water tank stands */}
      <InstancedGroup count={groups.water.length} castShadow setup={(i, m, color) => bodySetup(groups.water, () => STEEL, i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.5} metalness={0.4} />
      </InstancedGroup>

      {/* flagpoles */}
      <InstancedGroup count={groups.flag.length} castShadow setup={(i, m, color) => bodySetup(groups.flag, () => STEEL, i, m, color)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.55} />
      </InstancedGroup>

      {/* flags in the school colour */}
      {compounds.map((c) => {
        const flag = c.boxes.find((b) => b.kind === 'flag')
        if (!flag) return null
        return (
          <mesh key={`flag-${c.site.id}`} position={[flag.x + 0.55, flag.y + flag.h - 0.85, flag.z]} rotation={[0, c.rotY, 0]}>
            <boxGeometry args={[1.05, 0.62, 0.02]} />
            <meshStandardMaterial color={c.site.color} roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
        )
      })}

      {/* the painted name board across every gate */}
      {compounds.map((c) => {
        const tex = gateBoardTexture(c.site.name, c.site.motto, c.site.color)
        return (
          <mesh
            key={`board-${c.site.id}`}
            position={[c.gate.x + Math.sin(c.rotY) * 0.15, c.gate.y + 3.15, c.gate.z + Math.cos(c.rotY) * 0.15]}
            rotation={[0, c.rotY, 0]}
          >
            <boxGeometry args={[4.7, 1.18, 0.14]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.55}
              map={tex}
              emissive="#ffffff"
              emissiveMap={tex}
              emissiveIntensity={0.05}
            />
          </mesh>
        )
      })}

      {/* louvre window bands facing the yard on every building */}
      {compounds.flatMap((c) =>
        c.boxes
          .filter((b) =>
            ['block', 'library', 'lab', 'office', 'admin', 'theatre', 'faculty', 'hostel',
              'hall', 'healthsci', 'workshop', 'demo', 'canteen', 'clinic', 'chapel', 'mosque', 'senate'].includes(b.kind),
          )
          .map((b, i) => (
            <mesh
              key={`louvre-${c.site.id}-${b.kind}-${i}`}
              position={[
                b.x + Math.sin(b.rotY) * (b.d / 2 + 0.04),
                b.y + b.h * 0.62,
                b.z + Math.cos(b.rotY) * (b.d / 2 + 0.04),
              ]}
              rotation={[0, b.rotY, 0]}
            >
              <boxGeometry args={[b.w * 0.82, 0.72, 0.08]} />
              <meshStandardMaterial color={LOUVRE} roughness={0.25} metalness={0.15} />
            </mesh>
          )),
      )}
    </group>
  )
}
