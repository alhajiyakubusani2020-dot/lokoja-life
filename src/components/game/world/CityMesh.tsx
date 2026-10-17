'use client'

/**
 * LOKOJA LIFE — City Mesh (Stage 3D + 4-b Nigerianisation)
 * ---------------------------------------------------
 * Everything the eye reads as "a Nigerian city", built from instanced
 * primitives so the whole skyline costs a handful of draw calls:
 * buildings with baked plaster facades (small punched windows, damp
 * bases, night-lit panes), corrugated roofs with overhangs, striped
 * shopfront awnings + painted signboards, compound walls with gates and
 * laundry lines, utility poles with sagging wires, keke-stop shelters,
 * market crates, palms and savanna trees — plus the bespoke landmark
 * structures at each location anchor and floating location labels.
 *
 * Window glow / lamp glow read atmoLive.nightGlow (driven by the REAL
 * world clock) — no React re-render on time changes.
 *
 * SILK II — the frame law. The city's three heaviest static lesions are
 * healed here: (1) THE DOOR LIGHT LAW — the 98 per-door pointLights are
 * gone; a fixed pool of 6 point lights (DoorLights) tracks the K nearest
 * door anchors imperatively (K by effective tier: 0 low / 4 mid / 6 high,
 * read live from extrasLive), intensity following atmoLive.nightGlow each
 * frame — the shader's point-light count is per-tier constant. (2) THE
 * DOOR MERGE LAW — 98 doors × 7 private meshes became 6 InstancedMesh
 * buckets (one per part-kind, 686 instances, 6 materials), matrices
 * composed by doorPartMatrix to be exactly the old scene-graph
 * transforms; only the frame (posts + lintel) casts shadows. (3) THE
 * LABEL LAW — location labels cull by distance from the player (140u,
 * the 3 nearest always alive) via imperative per-frame writes; invisible
 * sprites skip the y-bounce. Every per-frame write is allocation-free
 * module scratch; zero new timers; zero React state.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  ANCHORS, ANCHOR_BY_ID, BUILDINGS, CIVIC_CAMPUS, heightAt, LAMPS, makeRng,
  POINTS_OF_INTEREST, ROCKS, ROCK_TONES, ROOF_TONES,
  RIVERS, STALLS, STALL_TONES, WALL_TONES, WATER_Y, type BuildingDef, type LampDef, type WorldAnchor,
} from '@/game/world3d/layout'
import { FLORA_TREES } from '@/game/world3d/flora'
import { buildSpeciesGeometry } from '@/game/world3d/flora-species'
import { SPECIES_IDS, type SpeciesId, type TreeInstance } from '@/game/world3d/flora-types'
import { applyFloraShader, stepFlora } from './flora-shader'
import { hash1, mergeGeoms } from '@/game/world3d/terrainArt'
import { ALL_DOORS, SCHOOL_TREES } from '@/game/world3d/schools'
import { atmoLive } from './atmosphere'
import { playerPos } from './controls'
import { extrasLive } from '@/game/systems/extras'
import type { QualityTier } from '@/game/systems/device'
import {
  ANTENNAS, AWNINGS, AWNING_TONES, BARRELS, BASKETS, CLOTH_TONES, CRATES, GATE_LEAVES, LAUNDRY_LINES,
  ROAD_SIGNS, SHELTERS, SHOP_NAMES, SIGNBOARDS, TIRES, UTILITY_POLES, WALL_SEGMENTS, WATER_TANKS, WIRE_SPANS,
} from '@/game/world3d/props'

/* ----------------------------- shared textures ------------------------------ */

/**
 * Baked facade per building kind (map + emissive). The plaster is baked
 * near-white so the per-instance colour lays the WALL_TONES wash over it;
 * windows stay small punched openings (~25% of wall area) with frames,
 * lintels, sills and timber shutters. The SECOND canvas carries only the
 * night-lit panes — a warm, partial glow (never lantern-mode).
 */
type FacadeKind = 'house' | 'shop' | 'block' | 'shed'

function bakeFacade(kind: FacadeKind, variant: number): { map: THREE.CanvasTexture; emissive: THREE.CanvasTexture } {
  const S = 256
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  const eCanvas = document.createElement('canvas')
  eCanvas.width = S
  eCanvas.height = S
  const eCtx = eCanvas.getContext('2d')!
  const rng = makeRng(9100 + kind.length * 131 + variant * 57)

  // plaster base (near-white → instance colour provides the wall tone)
  ctx.fillStyle = '#f1ebdd'
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = `rgba(${104 + ((rng() * 44) | 0)}, ${94 + ((rng() * 34) | 0)}, 72, ${0.03 + rng() * 0.05})`
    ctx.fillRect(rng() * S, rng() * S, 12 + rng() * 38, 5 + rng() * 16)
  }
  // vertical rain streaks under the roofline
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = `rgba(96, 88, 70, ${0.05 + rng() * 0.06})`
    ctx.fillRect(rng() * S, rng() * S * 0.4, 2 + rng() * 3, 44 + rng() * 90)
  }
  // block courses — the classic stripped masonry banding
  if (kind === 'block') {
    for (let y = 44; y < S - 40; y += 42) {
      ctx.fillStyle = 'rgba(70, 62, 48, 0.15)'
      ctx.fillRect(0, y, S, 2)
      ctx.fillStyle = 'rgba(255, 255, 250, 0.22)'
      ctx.fillRect(0, y + 2, S, 1)
    }
  }
  // damp: the rain-splash grime line every Lokoja wall wears
  const grad = ctx.createLinearGradient(0, S, 0, S - 66)
  grad.addColorStop(0, 'rgba(72, 60, 42, 0.36)')
  grad.addColorStop(1, 'rgba(72, 60, 42, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, S - 66, S, 66)

  eCtx.fillStyle = '#000000'
  eCtx.fillRect(0, 0, S, S)

  const paintWindow = (x: number, y: number, w: number, h: number, opts: { shutter: boolean; lit: boolean; tv: boolean }) => {
    // lintel + sill
    ctx.fillStyle = 'rgba(66, 58, 44, 0.6)'
    ctx.fillRect(x - 3, y - 4, w + 6, 4)
    ctx.fillStyle = 'rgba(244, 238, 222, 0.9)'
    ctx.fillRect(x - 4, y + h + 2, w + 8, 4)
    // painted timber shutters flanking some windows
    if (opts.shutter) {
      ctx.fillStyle = 'rgba(62, 74, 68, 0.95)'
      ctx.fillRect(x - 8, y, 8, h)
      ctx.fillRect(x + w, y, 8, h)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
      for (let sy = y + 2; sy < y + h - 2; sy += 4) {
        ctx.fillRect(x - 8, sy, 8, 1.4)
        ctx.fillRect(x + w, sy, 8, 1.4)
      }
    }
    // frame + glass + sky glint
    ctx.fillStyle = '#e4ddcb'
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4)
    ctx.fillStyle = '#222c33'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = 'rgba(198, 222, 232, 0.3)'
    ctx.beginPath()
    ctx.moveTo(x, y + h)
    ctx.lineTo(x + w, y)
    ctx.lineTo(x + w * 0.5, y)
    ctx.closePath()
    ctx.fill()
    // night: only SOME panes glow, warm — a couple glow TV-blue
    if (opts.lit) {
      eCtx.fillStyle = opts.tv ? 'rgba(214, 226, 255, 0.9)' : 'rgba(255, 255, 255, 0.94)'
      eCtx.fillRect(x + 1, y + 1, w - 2, h - 2)
      eCtx.fillStyle = 'rgba(0, 0, 0, 0.42)'
      eCtx.fillRect(x + 1, y + 1, (w - 2) * 0.42, h - 2)
    }
  }

  const paintDoor = (x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = 'rgba(58, 48, 34, 0.9)'
    ctx.fillRect(x - 3, y - 3, w + 6, h + 3)
    ctx.fillStyle = '#4c3822'
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = 'rgba(28, 20, 10, 0.5)'
    for (let px = x + w / 3; px < x + w - 1; px += w / 3) ctx.fillRect(px, y, 1.5, h)
    ctx.fillStyle = '#2a3138'
    ctx.fillRect(x + w * 0.18, y + h * 0.1, w * 0.64, h * 0.24)
    ctx.fillStyle = '#c8b070'
    ctx.fillRect(x + w - 6, y + h * 0.52, 2.5, 7)
  }

  if (kind === 'house') {
    for (let c = 0; c < 4; c++) {
      paintWindow(18 + c * 60, 46, 30, 32, { shutter: rng() < 0.42, lit: rng() < (variant === 0 ? 0.46 : 0.3), tv: rng() < 0.14 })
    }
    paintDoor(113, 182, 30, 62)
    paintWindow(32, 190, 30, 38, { shutter: rng() < 0.5, lit: rng() < 0.4, tv: rng() < 0.2 })
    paintWindow(190, 190, 30, 38, { shutter: rng() < 0.5, lit: rng() < 0.4, tv: rng() < 0.2 })
  } else if (kind === 'shop') {
    for (let c = 0; c < 3; c++) {
      paintWindow(40 + c * 73, 44, 30, 30, { shutter: rng() < 0.3, lit: rng() < (variant === 0 ? 0.5 : 0.32), tv: rng() < 0.16 })
    }
    // open shopfront: deep shaded interior with a serving counter
    ctx.fillStyle = '#e4ddcb'
    ctx.fillRect(30, 172, 196, 74)
    ctx.fillStyle = '#191b1d'
    ctx.fillRect(34, 176, 188, 70)
    ctx.fillStyle = '#6a4a2e'
    ctx.fillRect(34, 214, 188, 12)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)'
    ctx.fillRect(34, 176, 188, 16)
    // the interior breathes warm light at night
    eCtx.fillStyle = 'rgba(255, 255, 255, 0.34)'
    eCtx.fillRect(34, 190, 188, 54)
    eCtx.fillStyle = 'rgba(255, 255, 255, 0.16)'
    eCtx.fillRect(40, 176, 40, 70)
  } else if (kind === 'block') {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 5; c++) {
        paintWindow(24 + c * 44, 40 + r * 52, 26, 24, { shutter: rng() < 0.3, lit: rng() < (variant === 0 ? 0.4 : 0.26), tv: rng() < 0.12 })
      }
    }
    paintDoor(112, 182, 32, 62)
  } else {
    // shed counters — plain washed plaster, no punched openings
    ctx.fillStyle = 'rgba(60, 52, 38, 0.12)'
    ctx.fillRect(0, 96, S, 2)
  }

  const map = new THREE.CanvasTexture(canvas)
  const emissive = new THREE.CanvasTexture(eCanvas)
  map.colorSpace = THREE.SRGBColorSpace
  emissive.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 4
  return { map, emissive }
}

/** corrugated iron: vertical ribs, seam lines and rust bloom (tinted per roof) */
function bakeCorrugation(): THREE.CanvasTexture {
  const S = 256
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  const rng = makeRng(5501)

  ctx.fillStyle = '#d2d2d2'
  ctx.fillRect(0, 0, S, S)
  for (let x = 0; x < S; x += 10) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.17)'
    ctx.fillRect(x, 0, 3, S)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)'
    ctx.fillRect(x + 5, 0, 2, S)
  }
  for (let y = 0; y < S; y += 86) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.fillRect(0, y, S, 2)
  }
  for (let i = 0; i < 10; i++) {
    const x = rng() * S
    const y = rng() * S
    const r = 7 + rng() * 24
    const g = ctx.createRadialGradient(x, y, 1, x, y, r)
    g.addColorStop(0, `rgba(128, 62, 32, ${0.16 + rng() * 0.14})`)
    g.addColorStop(1, 'rgba(128, 62, 32, 0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** striped awning canvas — white/cream bands that take the per-instance tint */
function bakeStripes(): THREE.CanvasTexture {
  const S = 128
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  for (let x = 0; x < S; x += 16) {
    ctx.fillStyle = '#f4f4f4'
    ctx.fillRect(x, 0, 8, S)
    ctx.fillStyle = '#d8d2c2'
    ctx.fillRect(x + 8, 0, 8, S)
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'
  ctx.fillRect(0, S - 5, S, 5)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Painted business signboards — one atlas, 4×4 slots of 128px, each an
 * ORIGINAL Lokoja business name (props.SSHOP list) on a painted board.
 * Slot 15 is the plain dark back panel.
 */
function bakeSignAtlas(): THREE.CanvasTexture {
  const CELL = 128
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  const rng = makeRng(771)
  const BG = ['#1b5c3a', '#8a2f22', '#1f3a6e', '#6e4a10', '#3a2a50', '#14532d', '#7a2838', '#2a4a2a']

  for (let slot = 0; slot < 16; slot++) {
    const x0 = (slot % 4) * CELL
    const y0 = Math.floor(slot / 4) * CELL
    ctx.fillStyle = slot === 15 ? '#232e28' : BG[slot % BG.length]
    ctx.fillRect(x0, y0, CELL, CELL)
    if (slot === 15) continue
    ctx.strokeStyle = '#e2c06a'
    ctx.lineWidth = 5
    ctx.strokeRect(x0 + 6, y0 + 6, CELL - 12, CELL - 12)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.fillRect(x0 + 8, y0 + 8, CELL - 16, 10)

    const name = SHOP_NAMES[slot] ?? 'LOKOJA'
    const words = name.split(' ')
    ctx.font = '800 19px "Outfit", "Segoe UI", Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#f7efd8'
    // wrap to at most 3 lines that fit the 108px board face
    const lines: string[] = []
    let line = ''
    for (const w of words) {
      const test = line ? `${line} ${w}` : w
      if (ctx.measureText(test).width > 106 && line) {
        lines.push(line)
        line = w
      } else {
        line = test
      }
    }
    if (line) lines.push(line)
    const lh = 22
    const startY = y0 + CELL / 2 - ((lines.length - 1) * lh) / 2 + (rng() - 0.5) * 2
    lines.forEach((l, i) => ctx.fillText(l, x0 + CELL / 2, startY + i * lh, 108))
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** soft radial falloff for the warm pools street lamps cast at night */
function bakeGlowPool(): THREE.CanvasTexture {
  const S = 128
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
  g.addColorStop(0.45, 'rgba(255, 255, 255, 0.32)')
  g.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(canvas)
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

/** shared scratch vectors for instanced setup (mount-time only, no per-frame allocs) */
const UP_VEC = new THREE.Vector3(0, 1, 0)

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

const FACADE_GROUPS: { kind: FacadeKind; test: (b: BuildingDef) => boolean; variants: number }[] = [
  { kind: 'house', test: (b) => b.kind === 'house' || b.kind === 'colonial', variants: 2 },
  { kind: 'shop', test: (b) => b.kind === 'shop', variants: 2 },
  { kind: 'block', test: (b) => b.kind === 'block' || b.kind === 'hostel', variants: 2 },
  { kind: 'shed', test: (b) => b.kind === 'shed', variants: 1 },
]

const RUST_REF = new THREE.Color('#7a4630')

function Buildings() {
  // one baked material per (kind, lit-variant) — 7 materials, 7 draw calls
  const groups = useMemo(() => {
    const out: { mat: THREE.MeshStandardMaterial; list: BuildingDef[] }[] = []
    for (const g of FACADE_GROUPS) {
      const list = BUILDINGS.filter(g.test)
      for (let v = 0; v < g.variants; v++) {
        const sub = list.filter((_, i) => i % g.variants === v)
        if (!sub.length) continue
        const tex = bakeFacade(g.kind, v)
        out.push({
          list: sub,
          mat: new THREE.MeshStandardMaterial({
            map: tex.map,
            emissiveMap: tex.emissive,
            emissive: new THREE.Color('#ffb45c'),
            emissiveIntensity: 0.04,
            roughness: 0.94,
            metalness: 0,
          }),
        })
      }
    }
    return out
  }, [])
  // dispose baked materials/textures when the world unmounts
  useEffect(() => {
    return () => {
      for (const g of groups) {
        g.mat.map?.dispose()
        g.mat.emissiveMap?.dispose()
        g.mat.dispose()
      }
    }
  }, [groups])

  const corrugated = useMemo(() => {
    const tex = bakeCorrugation()
    return new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.62,
      metalness: 0.22,
      flatShading: true,
    })
  }, [])
  useEffect(() => {
    return () => {
      corrugated.map?.dispose()
      corrugated.dispose()
    }
  }, [corrugated])

  const hips = useMemo(() => BUILDINGS.filter((b) => b.roof === 'hip'), [])
  const slabs = useMemo(() => BUILDINGS.filter((b) => b.roof === 'shed'), [])
  const flats = useMemo(() => BUILDINGS.filter((b) => b.roof === 'flat'), [])

  // subtle night glow on the lit panes — tasteful, not lantern-mode
  // (materials live in a ref so the frame loop can retune them safely)
  const matsRef = useRef<THREE.MeshStandardMaterial[]>([])
  useEffect(() => {
    matsRef.current = groups.map((g) => g.mat)
  }, [groups])
  useFrame(() => {
    const e = 0.03 + atmoLive.nightGlow * 0.95
    for (const m of matsRef.current) m.emissiveIntensity = e
  })

  return (
    <group>
      {/* wall bodies — one instanced mesh per facade material */}
      {groups.map((g, gi) => (
        <InstancedGroup key={gi} count={g.list.length} castShadow receiveShadow setup={(i, m, color) => {
          const b = g.list[i]
          m.position.set(b.x, b.y + b.h / 2, b.z)
          m.rotation.set(0, b.rotY, 0)
          m.scale.set(b.w, b.h, b.d)
          color.set(WALL_TONES[b.tone]).multiplyScalar(0.94 + (i % 4) * 0.03)
        }}>
          <boxGeometry args={[1, 1, 1]} />
          <primitive object={g.mat} attach="material" />
        </InstancedGroup>
      ))}

      {/* hip roofs — corrugated iron, overhanging eaves so they sit ON the walls */}
      <InstancedGroup count={hips.length} castShadow setup={(i, m, color) => {
        const b = hips[i]
        const roofH = Math.min(b.w, b.d) * 0.5
        m.position.set(b.x, b.y + b.h + roofH / 2 - 0.04, b.z)
        m.rotation.set(0, b.rotY + Math.PI / 4, 0)
        m.scale.set(b.w + 1.15, roofH, b.d + 1.15)
        color.set(ROOF_TONES[b.roofTone]).lerp(RUST_REF, 0.24).multiplyScalar(0.9 + (i % 3) * 0.06)
      }}>
        <coneGeometry args={[0.71, 1, 4]} />
        <primitive object={corrugated} attach="material" />
      </InstancedGroup>

      {/* shed slabs (market/park sheds — single sloped roof) */}
      <InstancedGroup count={slabs.length} castShadow setup={(i, m, color) => {
        const b = slabs[i]
        m.position.set(b.x, b.y + b.h + 0.12, b.z)
        m.rotation.set(0, b.rotY, 0.1)
        m.scale.set(b.w * 1.18, 0.16, b.d * 1.18)
        color.set(ROOF_TONES[b.roofTone]).lerp(RUST_REF, 0.24).multiplyScalar(0.9 + (i % 3) * 0.06)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={corrugated} attach="material" />
      </InstancedGroup>

      {/* flat roofs: dark deck + plaster parapet in ONE instanced mesh */}
      <InstancedGroup count={flats.length * 2} castShadow setup={(i, m, color) => {
        const b = flats[i % flats.length]
        if (i < flats.length) {
          // roof deck
          m.position.set(b.x, b.y + b.h + 0.05, b.z)
          m.rotation.set(0, b.rotY, 0)
          m.scale.set(b.w * 1.02, 0.12, b.d * 1.02)
          color.set('#57534a')
        } else {
          // parapet
          m.position.set(b.x, b.y + b.h + 0.2, b.z)
          m.rotation.set(0, b.rotY, 0)
          m.scale.set(b.w * 1.05, 0.42, b.d * 1.05)
          color.set(WALL_TONES[b.tone]).multiplyScalar(0.8)
        }
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} metalness={0} />
      </InstancedGroup>
    </group>
  )
}

/* ------------------------------- shopfronts ---------------------------------- */

/**
 * Street-level commerce: striped awnings over the shopfronts and painted
 * business signboards (one atlas texture, one merged geometry — a single
 * draw call for every sign in Lokoja, with a plain back panel each).
 */
function Shopfronts() {
  const signGeo = useMemo(() => {
    const pos: number[] = []
    const nor: number[] = []
    const uv: number[] = []
    const idx: number[] = []
    let v = 0
    const quad = (
      cx: number, cy: number, cz: number,
      w: number, h: number,
      rotY: number, outX: number, outZ: number,
      slot: number,
    ) => {
      const col = slot % 4
      const row = Math.floor(slot / 4)
      const u0 = (col + 0.02) / 4
      const u1 = (col + 0.98) / 4
      const v1 = 1 - (row + 0.03) / 4
      const v0 = 1 - (row + 0.97) / 4
      const hw = w / 2
      const hh = h / 2
      const cos = Math.cos(rotY)
      const sin = Math.sin(rotY)
      const corners: [number, number, number, number][] = [
        [-hw, hh, u0, v1], [hw, hh, u1, v1], [hw, -hh, u1, v0], [-hw, -hh, u0, v0],
      ]
      for (const [lx, ly, u, vv] of corners) {
        pos.push(cx + lx * cos + outX, cy + ly, cz - lx * sin + outZ)
        nor.push(outX, 0, outZ)
        uv.push(u, vv)
      }
      idx.push(v, v + 1, v + 2, v, v + 2, v + 3)
      v += 4
    }
    for (const s of SIGNBOARDS) {
      const fx = Math.sin(s.rotY)
      const fz = Math.cos(s.rotY)
      quad(s.x, s.y, s.z, s.w, s.h, s.rotY, fx * 0.06, fz * 0.06, s.slot)
      // plain back panel a hair behind, so signs read as real boards
      quad(s.x - fx * 0.05, s.y, s.z - fz * 0.05, s.w, s.h, s.rotY, -fx * 0.06, -fz * 0.06, 15)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    g.setIndex(idx)
    return g
  }, [])
  useEffect(() => () => signGeo.dispose(), [signGeo])

  const signMat = useMemo(() => {
    const tex = bakeSignAtlas()
    return new THREE.MeshStandardMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: new THREE.Color('#ffc98a'),
      emissiveIntensity: 0.05,
      roughness: 0.8,
      metalness: 0,
      side: THREE.DoubleSide,
    })
  }, [])
  useEffect(() => {
    return () => {
      signMat.map?.dispose()
      signMat.emissiveMap?.dispose()
      signMat.dispose()
    }
  }, [signMat])
  const signMatRef = useRef<THREE.MeshStandardMaterial | null>(null)
  useEffect(() => {
    signMatRef.current = signMat
  }, [signMat])
  useFrame(() => {
    if (signMatRef.current) signMatRef.current.emissiveIntensity = 0.04 + atmoLive.nightGlow * 0.5
  })

  const stripeTex = useMemo(() => bakeStripes(), [])
  useEffect(() => () => stripeTex.dispose(), [stripeTex])

  return (
    <group>
      {/* slanted striped awnings over the shopfronts */}
      <InstancedGroup count={AWNINGS.length} castShadow setup={(i, m, color) => {
        const a = AWNINGS[i]
        m.position.set(a.x, a.y, a.z)
        m.rotation.set(-0.48, a.rotY, 0, 'YXZ')
        m.scale.set(a.width, 1.2, 1)
        color.set(AWNING_TONES[a.tone % AWNING_TONES.length])
      }}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial map={stripeTex} roughness={0.85} side={THREE.DoubleSide} />
      </InstancedGroup>

      {/* every business sign in town — one mesh, one atlas */}
      <mesh geometry={signGeo} material={signMat} castShadow />
    </group>
  )
}

/* ----------------------------- rooftop clutter ------------------------------- */

/** the Nigerian skyline signature: blue plastic water tanks + TV antennas */
function RooftopClutter() {
  return (
    <group>
      {/* concrete stand blocks */}
      <InstancedGroup count={WATER_TANKS.length} setup={(i, m) => {
        const t = WATER_TANKS[i]
        m.position.set(t.x, t.y + 0.22, t.z)
        m.rotation.set(0, i * 0.7, 0)
        m.scale.set(0.66, 0.44, 0.66)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8f8b80" roughness={1} />
      </InstancedGroup>
      {/* the tanks themselves */}
      <InstancedGroup count={WATER_TANKS.length} castShadow setup={(i, m, color) => {
        const t = WATER_TANKS[i]
        m.position.set(t.x, t.y + 0.9, t.z)
        m.rotation.set(0, i * 1.3, 0)
        m.scale.setScalar(1)
        color.set(i % 5 === 0 ? '#2a3a44' : '#2e6ea3')
      }}>
        <cylinderGeometry args={[0.52, 0.56, 0.92, 9]} />
        <meshStandardMaterial roughness={0.55} metalness={0.05} />
      </InstancedGroup>
      {/* antenna sticks */}
      <InstancedGroup count={ANTENNAS.length} setup={(i, m) => {
        const a = ANTENNAS[i]
        m.position.set(a.x, a.y + a.h / 2 + 0.05, a.z)
        m.rotation.set(0.06 * ((i % 3) - 1), 0, 0.05 * ((i % 5) - 2))
        m.scale.set(1, a.h, 1)
      }}>
        <cylinderGeometry args={[0.022, 0.035, 1, 4]} />
        <meshStandardMaterial color="#3a3f42" roughness={0.6} metalness={0.5} />
      </InstancedGroup>
      {/* little cross bars near the antenna tops */}
      <InstancedGroup count={ANTENNAS.length} setup={(i, m) => {
        const a = ANTENNAS[i]
        m.position.set(a.x, a.y + a.h - 0.28, a.z)
        m.rotation.set(0, i * 0.9, 0)
        m.scale.set(0.62, 0.03, 0.03)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a4f52" roughness={0.6} metalness={0.5} />
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

/* -------------- trees — M23 W2: THE GREEN (the species guild) ---------------- */

/**
 * The species-true Kogi guild — one instanced draw call per species. Every
 * tree is a merged, vertex-coloured geometry (flora-species.ts: neem/mango/
 * cashew/shea/oilpalm/raffia/plantain/iroko/baobab/acacia, each with its
 * real silhouette) placed by the clearance-probe engine (flora.ts) under
 * M22-grade laws against the real roads, kerbs, zebras, lamps, parked bays,
 * stalls, buildings, anchors, schools and water. The shared material wraps
 * the W2 flora shader: per-instance wind sway computed in the vertex shader
 * (phase derived from each instance's own world position — zero CPU, no
 * per-frame matrix writes) and the M6 weather reaching the leaves through
 * the shared floraLive uniforms (harmattan golds the crowns, the rain
 * family deepens them lush; the leaf mask keeps the gold off the wood).
 */

/** one species = one InstancedMesh over the cached merged geometry */
function SpeciesMesh({ sp, list, mat, seed }: { sp: SpeciesId; list: TreeInstance[]; mat: THREE.Material; seed: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const geo = useMemo(() => buildSpeciesGeometry(sp), [sp])
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const p = new THREE.Vector3()
    const sc = new THREE.Vector3()
    const c = new THREE.Color()
    list.forEach((t, i) => {
      e.set(0, t.rot, 0)
      q.setFromEuler(e)
      p.set(t.x, t.y, t.z)
      sc.set(t.s, t.s, t.s)
      m.compose(p, q, sc)
      mesh.setMatrixAt(i, m)
      // per-instance character, decided once: a gray jitter with a warm
      // lean on the tone-2 trees — the same tree species reads slightly
      // different across the town, exactly like a real streetscape
      const g = 0.88 + hash1(seed + i * 3.71) * 0.22
      const warm = t.tone === 2 ? 1.045 : 1
      c.setRGB(g * warm, g, g * 0.96)
      mesh.setColorAt(i, c)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [list, seed])
  if (list.length === 0) return null
  return <instancedMesh ref={ref} args={[geo, mat, list.length]} castShadow />
}

/** school compound trees (schools.ts plants its own) join the guild:
 *  the shade rows read as mango, the gate palms as raffia — same
 *  geometries, same wind, same weather as the town around them. */
const SCHOOL_SPECIES_MAP: Record<string, SpeciesId> = {
  tree: 'mango',
  palm: 'raffia',
  acacia: 'acacia',
  baobab: 'baobab',
}

function FloraTrees() {
  // the ONE tree material — vertex colours carry the species palette,
  // the flora shader carries the wind (amp 0.16) and the weather
  const mat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, metalness: 0 })
    applyFloraShader(m, 0.16)
    return m
  }, [])
  useEffect(() => () => mat.dispose(), [mat])

  // the guild + the school compounds' own trees, merged per species
  const lists = useMemo(() => {
    const out: Record<SpeciesId, TreeInstance[]> = {
      neem: [...FLORA_TREES.neem],
      mango: [...FLORA_TREES.mango],
      cashew: [...FLORA_TREES.cashew],
      shea: [...FLORA_TREES.shea],
      oilpalm: [...FLORA_TREES.oilpalm],
      raffia: [...FLORA_TREES.raffia],
      plantain: [...FLORA_TREES.plantain],
      iroko: [...FLORA_TREES.iroko],
      baobab: [...FLORA_TREES.baobab],
      acacia: [...FLORA_TREES.acacia],
    }
    let si = 0
    for (const t of SCHOOL_TREES) {
      const sp = SCHOOL_SPECIES_MAP[t.kind] ?? 'mango'
      out[sp].push({
        x: t.x,
        z: t.z,
        y: t.y,
        s: t.scale,
        rot: hash1(9100 + si * 1.37) * Math.PI * 2,
        tone: t.tone % 3,
      })
      si++
    }
    return out
  }, [])

  // the flora clock — the ONE per-frame writer; its shared uniforms drive
  // the grass in WorldTerrain too (see flora-shader.ts)
  useFrame((_, dt) => stepFlora(dt))

  return (
    <group>
      {SPECIES_IDS.map((sp, i) => (
        <SpeciesMesh key={sp} sp={sp} list={lists[sp]} mat={mat} seed={8100 + i * 97} />
      ))}
    </group>
  )
}

/**
 * The boulders of Patti — half-sunk dodecahedra in the laterite palette,
 * each tilted and squashed by its own deterministic hash so no two read
 * alike. One draw call for the whole scatter.
 */
function Rocks() {
  return (
    <InstancedGroup count={ROCKS.length} castShadow receiveShadow setup={(i, m, color) => {
      const r = ROCKS[i]
      m.position.set(r.x, r.y + r.scale * r.squash * 0.42, r.z)
      m.rotation.set(hash1(i * 3.7) * 0.5 - 0.25, r.rotY, hash1(i * 9.1) * 0.5 - 0.25)
      m.scale.set(
        r.scale * (0.8 + hash1(i * 5.3) * 0.5),
        r.scale * r.squash,
        r.scale * (0.9 + hash1(i * 7.7) * 0.4),
      )
      color.set(ROCK_TONES[r.tone % ROCK_TONES.length])
    }}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial roughness={1} flatShading />
    </InstancedGroup>
  )
}

/* ---------------------------------- lamps ------------------------------------ */

/**
 * ONE real street lamp body, merged into a single instanced geometry:
 * bolted base flange + collar, tapered pole and a top stub collar the
 * swan-neck arm bolts onto. `tall` = highway mast. Local frame: arm
 * reaches +Z; instances rotate by the lamp's rotY. The arm itself is a
 * SEPARATE unit-length instanced tube so each lamp's outreach bracket
 * can grow with its setback (LampDef.reach) — exactly how real
 * outer-rim masts on wide carriageways carry longer arms.
 */
function buildLampBody(tall: boolean): THREE.BufferGeometry {
  const h = tall ? 5.1 : 3.8
  const rT = tall ? 0.07 : 0.055
  const rB = tall ? 0.105 : 0.085
  const parts: THREE.BufferGeometry[] = []
  // bolted base flange + weathering collar
  const base = new THREE.CylinderGeometry(rB * 1.9, rB * 2.3, 0.22, 8)
  base.translate(0, 0.11, 0)
  parts.push(base)
  const collar = new THREE.CylinderGeometry(rB * 1.35, rB * 1.65, 0.18, 8)
  collar.translate(0, 0.32, 0)
  parts.push(collar)
  // tapered pole
  const pole = new THREE.CylinderGeometry(rT, rB, h, 8)
  pole.translate(0, h / 2, 0)
  parts.push(pole)
  // stub collar where the outreach arm bolts on
  const stub = new THREE.CylinderGeometry(rT * 1.5, rT * 1.5, 0.14, 8)
  stub.translate(0, h - 0.02, 0)
  parts.push(stub)
  return mergeGeoms(parts)
}

/**
 * The swan-neck outreach arm as a UNIT-length tube (0..1 along +Z):
 * rises off the pole collar, levels out over the carriageway. Instances
 * scale Z by the lamp's reach so a far-setback mast still hangs its lens
 * over the tarmac. Y is untouched by the stretch — the head height law
 * (4.55 / 5.45) holds for every lamp.
 */
function buildLampArm(tall: boolean): THREE.BufferGeometry {
  const h = tall ? 5.1 : 3.8
  const headY = tall ? 5.45 : 4.55
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, h - 0.08, 0),
    new THREE.Vector3(0, h + (tall ? 0.42 : 0.4), 0.26),
    new THREE.Vector3(0, headY - 0.05, 0.66),
    new THREE.Vector3(0, headY - 0.08, 1.0),
  ])
  return new THREE.TubeGeometry(curve, 12, tall ? 0.05 : 0.042, 6, false)
}

/**
 * Street lights: bolted flange + tapered pole + swan-neck arm reaching
 * OVER the carriageway (each lamp's bracket grows with its setback) +
 * luminaire housing with a sodium lens that glows at night + a warm
 * pool of light on the road under the head. Highway masts are taller
 * with a longer reach. All instanced — 9 draw calls for the whole
 * town's lighting.
 */
function Lamps() {
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const glowRefMast = useRef<THREE.MeshStandardMaterial>(null)
  const poolRef = useRef<THREE.MeshBasicMaterial>(null)
  const poolTex = useMemo(() => bakeGlowPool(), [])
  useEffect(() => () => poolTex.dispose(), [poolTex])

  const poles = useMemo(() => LAMPS.filter((l) => !l.tall), [])
  const masts = useMemo(() => LAMPS.filter((l) => l.tall), [])
  const headAt = (l: LampDef): [number, number, number] => [
    l.x + Math.sin(l.rotY) * l.reach, l.y + (l.tall ? 5.45 : 4.55), l.z + Math.cos(l.rotY) * l.reach,
  ]
  const geos = useMemo(() => ({
    poleBody: buildLampBody(false), mastBody: buildLampBody(true),
    poleArm: buildLampArm(false), mastArm: buildLampArm(true),
    poleFix: (() => { const g = new THREE.BoxGeometry(0.5, 0.13, 0.26); g.rotateX(0.09); return g })(),
    mastFix: (() => { const g = new THREE.BoxGeometry(0.62, 0.13, 0.3); g.rotateX(0.09); return g })(),
  }), [])
  useEffect(() => () => { Object.values(geos).forEach((g) => g.dispose()) }, [geos])

  useFrame(() => {
    const g = atmoLive.nightGlow
    if (glowRef.current) glowRef.current.emissiveIntensity = 0.1 + g * 2.6
    if (glowRefMast.current) glowRefMast.current.emissiveIntensity = 0.1 + g * 2.6
    if (poolRef.current) poolRef.current.opacity = g * 0.55
  })

  return (
    <group>
      {/* merged lamp bodies (flange + collar + tapered pole + stub) */}
      {[
        { arr: poles, geo: geos.poleBody },
        { arr: masts, geo: geos.mastBody },
      ].map((grp, gi) => (
        <InstancedGroup
          key={`body-${gi}`}
          count={grp.arr.length}
          castShadow
          setup={(i, m) => {
            const l = grp.arr[i]
            m.position.set(l.x, l.y, l.z)
            m.rotation.set(0, l.rotY, 0)
            m.scale.set(1, 1, 1)
          }}
        >
          <primitive object={grp.geo} attach="geometry" />
          <meshStandardMaterial color="#33383a" roughness={0.55} metalness={0.65} />
        </InstancedGroup>
      ))}
      {/* swan-neck arms — unit tube stretched to each lamp's reach */}
      {[
        { arr: poles, geo: geos.poleArm },
        { arr: masts, geo: geos.mastArm },
      ].map((grp, gi) => (
        <InstancedGroup
          key={`arm-${gi}`}
          count={grp.arr.length}
          setup={(i, m) => {
            const l = grp.arr[i]
            m.position.set(l.x, l.y, l.z)
            m.rotation.set(0, l.rotY, 0)
            m.scale.set(1, 1, l.reach)
          }}
        >
          <primitive object={grp.geo} attach="geometry" />
          <meshStandardMaterial color="#33383a" roughness={0.55} metalness={0.65} />
        </InstancedGroup>
      ))}
      {/* luminaire housings canted toward the tarmac, at the arm tips */}
      {[
        { arr: poles, geo: geos.poleFix, head: 4.55 },
        { arr: masts, geo: geos.mastFix, head: 5.45 },
      ].map((grp, gi) => (
        <InstancedGroup
          key={`fix-${gi}`}
          count={grp.arr.length}
          castShadow
          setup={(i, m) => {
            const l = grp.arr[i]
            m.position.set(
              l.x + Math.sin(l.rotY) * l.reach,
              l.y + grp.head - 0.1,
              l.z + Math.cos(l.rotY) * l.reach,
            )
            m.rotation.set(0, l.rotY, 0)
            m.scale.set(1, 1, 1)
          }}
        >
          <primitive object={grp.geo} attach="geometry" />
          <meshStandardMaterial color="#2c3134" roughness={0.5} metalness={0.7} />
        </InstancedGroup>
      ))}
      {/* sodium lenses under each housing — the glow that flips at dusk */}
      {[
        { arr: poles, head: 4.55, w: 0.2 },
        { arr: masts, head: 5.45, w: 0.24 },
      ].map((grp, gi) => (
        <InstancedGroup
          key={`lens-${gi}`}
          count={grp.arr.length}
          setup={(i, m) => {
            const l = grp.arr[i]
            m.position.set(
              l.x + Math.sin(l.rotY) * l.reach,
              l.y + grp.head - 0.185,
              l.z + Math.cos(l.rotY) * l.reach,
            )
            m.rotation.set(0, l.rotY, 0)
            m.scale.set(1, 1, 1)
          }}
        >
          <boxGeometry args={[0.42, 0.04, grp.w]} />
          <meshStandardMaterial ref={gi === 0 ? glowRef : glowRefMast} color="#ffe9c0" emissive="#ffca7a" emissiveIntensity={0.1} />
        </InstancedGroup>
      ))}
      {/* warm sodium pools of light on the ground under each head at night */}
      <InstancedGroup
        count={LAMPS.length}
        setup={(i, m) => {
          const l = LAMPS[i]
          const [hx, , hz] = headAt(l)
          m.position.set(hx, l.y + 0.09, hz)
          m.rotation.set(-Math.PI / 2, 0, 0)
          m.scale.setScalar(l.tall ? 1.3 : 1)
        }}
      >
        <circleGeometry args={[2.4, 18]} />
        <meshBasicMaterial
          ref={poolRef}
          color="#ffb45c"
          map={poolTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </InstancedGroup>
    </group>
  )
}

/* ------------------------------ compound life --------------------------------- */

/**
 * Fenced family compounds: low plaster walls with coping gaps for the
 * gates, swung-open gate leaves and lines of washing between posts —
 * the everyday texture of a Nigerian neighbourhood. All visual-only.
 */
function CompoundLife() {
  return (
    <group>
      {/* compound walls */}
      <InstancedGroup count={WALL_SEGMENTS.length} castShadow receiveShadow setup={(i, m, color) => {
        const s = WALL_SEGMENTS[i]
        m.position.set(s.x, s.y + 0.46, s.z)
        m.rotation.set(0, s.rotY, 0)
        m.scale.set(s.len, 0.92, 0.26)
        color.set(WALL_TONES[s.tone % WALL_TONES.length]).multiplyScalar(0.86)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.95} />
      </InstancedGroup>
      {/* gate leaves, half open */}
      <InstancedGroup count={GATE_LEAVES.length} castShadow setup={(i, m) => {
        const g = GATE_LEAVES[i]
        m.position.set(g.x, g.y + 0.78, g.z)
        m.rotation.set(0, g.rotY, 0)
        m.scale.set(1.05, 1.56, 0.07)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a3a28" roughness={0.9} metalness={0.05} />
      </InstancedGroup>
      {/* laundry posts (one pair per line) */}
      <InstancedGroup count={LAUNDRY_LINES.length * 2} setup={(i, m) => {
        const l = LAUNDRY_LINES[Math.floor(i / 2)]
        const first = i % 2 === 0
        const x = first ? l.x1 : l.x2
        const z = first ? l.z1 : l.z2
        m.position.set(x, l.y - 0.89, z)
        m.rotation.set(0, 0, first ? 0.02 : -0.02)
        m.scale.set(1, 1, 1)
      }}>
        <cylinderGeometry args={[0.045, 0.055, 1.82, 5]} />
        <meshStandardMaterial color="#7a6a4a" roughness={1} />
      </InstancedGroup>
      {/* the washing lines themselves */}
      <InstancedGroup count={LAUNDRY_LINES.length} setup={(i, m) => {
        const l = LAUNDRY_LINES[i]
        const dx = l.x2 - l.x1
        const dz = l.z2 - l.z1
        const len = Math.hypot(dx, dz) || 1
        m.position.set((l.x1 + l.x2) / 2, l.y - 0.04, (l.z1 + l.z2) / 2)
        m.quaternion.setFromUnitVectors(UP_VEC, new THREE.Vector3(dx / len, 0, dz / len))
        m.scale.set(1, len, 1)
      }}>
        <cylinderGeometry args={[0.016, 0.016, 1, 4]} />
        <meshStandardMaterial color="#cfc9b8" roughness={1} />
      </InstancedGroup>
      {/* the washing — bright instanced cloth panels drying in the sun */}
      <InstancedGroup count={LAUNDRY_LINES.length * 3} castShadow setup={(i, m, color) => {
        const l = LAUNDRY_LINES[Math.floor(i / 3)]
        const k = i % 3
        const t = 0.24 + k * 0.26
        m.position.set(l.x1 + (l.x2 - l.x1) * t, l.y - 0.3, l.z1 + (l.z2 - l.z1) * t)
        m.rotation.set(0, Math.atan2(l.x2 - l.x1, l.z2 - l.z1) + (k - 1) * 0.12, 0.04 * (k - 1))
        m.scale.set(0.42, 0.5, 1)
        color.set(CLOTH_TONES[(i * 5 + k * 3) % CLOTH_TONES.length])
      }}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={1} side={THREE.DoubleSide} />
      </InstancedGroup>
    </group>
  )
}

/* ------------------------------ utility lines --------------------------------- */

/**
 * NEPA poles with crossarms and sagging wires — the iconic skyline
 * tangle. Poles + arms are instanced; every wire span is sampled into
 * ONE LineSegments geometry (2 conductors per span, no per-frame work).
 */
function UtilityLines() {
  const wireGeo = useMemo(() => {
    const pts: number[] = []
    const SAMPLES = 7
    for (const s of WIRE_SPANS) {
      const dx = s.bx - s.ax
      const dz = s.bz - s.az
      const len = Math.hypot(dx, dz) || 1
      const px = -dz / len
      const pz = dx / len
      for (const off of [-0.55, 0.55]) {
        let prevX = s.ax + px * off
        let prevY = s.ay
        let prevZ = s.az + pz * off
        for (let k = 1; k <= SAMPLES; k++) {
          const t = k / SAMPLES
          const dip = s.sag * 4 * t * (1 - t)
          const cx = s.ax + dx * t + px * off
          const cy = s.ay + (s.by - s.ay) * t - dip
          const cz = s.az + dz * t + pz * off
          pts.push(prevX, prevY, prevZ, cx, cy, cz)
          prevX = cx
          prevY = cy
          prevZ = cz
        }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])
  useEffect(() => () => wireGeo.dispose(), [wireGeo])

  return (
    <group>
      <InstancedGroup count={UTILITY_POLES.length} castShadow setup={(i, m) => {
        const p = UTILITY_POLES[i]
        m.position.set(p.x, p.y + 2.75, p.z)
        m.rotation.set(0, 0, 0.015 * ((i % 5) - 2))
        m.scale.set(1, 1, 1)
      }}>
        <cylinderGeometry args={[0.1, 0.14, 5.5, 6]} />
        <meshStandardMaterial color="#4d4238" roughness={1} />
      </InstancedGroup>
      {/* crossarms perpendicular to the road */}
      <InstancedGroup count={UTILITY_POLES.length} setup={(i, m) => {
        const p = UTILITY_POLES[i]
        m.position.set(p.x, p.y + 5.18, p.z)
        m.rotation.set(0, p.rotY, 0)
        m.scale.set(1.8, 0.09, 0.09)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3c352c" roughness={0.9} />
      </InstancedGroup>
      {/* the sagging conductors */}
      <lineSegments geometry={wireGeo}>
        <lineBasicMaterial color="#22262a" transparent opacity={0.75} />
      </lineSegments>
    </group>
  )
}

/* ------------------------------ street furniture ------------------------------ */

/** road signs, keke-stop shelters, market crates, tire stacks, water drums */
function StreetProps() {
  return (
    <group>
      {/* sign posts */}
      <InstancedGroup count={ROAD_SIGNS.length} setup={(i, m) => {
        const s = ROAD_SIGNS[i]
        m.position.set(s.x, s.y + 1.05, s.z)
        m.rotation.set(0, 0, 0.03 * ((i % 3) - 1))
        m.scale.set(1, 1, 1)
      }}>
        <cylinderGeometry args={[0.045, 0.06, 2.1, 5]} />
        <meshStandardMaterial color="#8a8f94" roughness={0.6} metalness={0.4} />
      </InstancedGroup>
      {/* boards: green direction / blue info / white municipal */}
      <InstancedGroup count={ROAD_SIGNS.length} castShadow setup={(i, m, color) => {
        const s = ROAD_SIGNS[i]
        m.position.set(s.x, s.y + 1.95, s.z)
        m.rotation.set(0, s.rotY, 0)
        m.scale.set(1.0, 0.62, 0.07)
        color.set(['#1b7a43', '#1f4f8e', '#d8d6c8'][s.kind % 3])
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.6} />
      </InstancedGroup>

      {/* keke-stop shelters: posts + legs share one instanced family */}
      <InstancedGroup count={SHELTERS.length * 4} setup={(i, m) => {
        const s = SHELTERS[Math.floor(i / 4)]
        const k = i % 4
        const cos = Math.cos(s.rotY)
        const sin = Math.sin(s.rotY)
        if (k < 2) {
          // roof posts at the front corners
          const lx = k === 0 ? -1.35 : 1.35
          m.position.set(s.x + lx * cos, s.y + 1.12, s.z - lx * sin)
          m.rotation.set(0, s.rotY, 0)
          m.scale.set(0.14, 2.24, 0.14)
        } else {
          // bench legs tucked under the back
          const lx = k === 2 ? -1.0 : 1.0
          m.position.set(s.x + lx * cos - 0.55 * sin, s.y + 0.28, s.z - lx * sin - 0.55 * cos)
          m.rotation.set(0, s.rotY, 0)
          m.scale.set(0.12, 0.56, 0.45)
        }
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a5248" roughness={0.85} />
      </InstancedGroup>
      {/* shelter roofs */}
      <InstancedGroup count={SHELTERS.length} castShadow setup={(i, m, color) => {
        const s = SHELTERS[i]
        m.position.set(s.x - 0.1 * Math.sin(s.rotY), s.y + 2.34, s.z - 0.1 * Math.cos(s.rotY))
        m.rotation.set(0, s.rotY, 0.05)
        m.scale.set(3.4, 0.13, 2.0)
        color.set(['#2e7d5b', '#c94f2e'][s.tone % 2])
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.8} />
      </InstancedGroup>
      {/* benches */}
      <InstancedGroup count={SHELTERS.length} castShadow setup={(i, m) => {
        const s = SHELTERS[i]
        m.position.set(s.x - 0.55 * Math.sin(s.rotY), s.y + 0.58, s.z - 0.55 * Math.cos(s.rotY))
        m.rotation.set(0, s.rotY, 0)
        m.scale.set(2.5, 0.1, 0.5)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#8a6a44" roughness={1} />
      </InstancedGroup>

      {/* market crates, stacked and sun-bleached */}
      <InstancedGroup count={CRATES.length} castShadow setup={(i, m, color) => {
        const c = CRATES[i]
        m.position.set(c.x, c.y, c.z)
        m.rotation.set(0, c.rotY, 0.03 * ((i % 3) - 1))
        m.scale.set(0.55 * c.s, 0.36 * c.s, 0.42 * c.s)
        color.set('#a3703c').multiplyScalar(0.88 + (i % 4) * 0.06)
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={1} />
      </InstancedGroup>
      {/* woven baskets */}
      <InstancedGroup count={BASKETS.length} castShadow setup={(i, m, color) => {
        const b = BASKETS[i]
        m.position.set(b.x, b.y, b.z)
        m.rotation.set(0, i * 0.9, 0)
        m.scale.setScalar(b.s)
        color.set(i % 3 === 0 ? '#b8924a' : '#c9a458')
      }}>
        <cylinderGeometry args={[0.34, 0.24, 0.48, 7]} />
        <meshStandardMaterial roughness={1} flatShading />
      </InstancedGroup>
      {/* tire stacks by the motor park */}
      <InstancedGroup count={TIRES.length} castShadow setup={(i, m) => {
        const t = TIRES[i]
        m.position.set(t.x, t.y, t.z)
        m.rotation.set(Math.PI / 2, 0, i * 0.5)
        m.scale.setScalar(1)
      }}>
        <torusGeometry args={[0.34, 0.13, 6, 12]} />
        <meshStandardMaterial color="#242424" roughness={0.9} />
      </InstancedGroup>
      {/* plastic water drums */}
      <InstancedGroup count={BARRELS.length} castShadow setup={(i, m, color) => {
        const b = BARRELS[i]
        m.position.set(b.x, b.y, b.z)
        m.rotation.set(0, i * 1.1, 0)
        m.scale.set(1, 1, 1)
        color.set(['#2e6ea3', '#c94f2e', '#3a7a52'][b.tone % 3])
      }}>
        <cylinderGeometry args={[0.32, 0.32, 0.78, 9]} />
        <meshStandardMaterial roughness={0.6} metalness={0.05} />
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

/**
 * Lord Lugard's Rest House — the colonial bungalow on Patti's summit
 * (the real hilltop is where the 1900-era administrator overlooked the
 * confluence). White walls, wide shaded veranda, flag pole.
 */
function LugardRestHouse(a: WorldAnchor) {
  return (
    <group position={[a.x - 6.5, a.y, a.z + 4.5]} rotation={[0, 0.5, 0]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 3, 5]} />
        <meshStandardMaterial color="#f2ead8" roughness={0.95} />
      </mesh>
      {/* wide hipped roof */}
      <mesh position={[0, 3.7, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[5.4, 1.8, 4]} />
        <meshStandardMaterial color="#6e4530" roughness={0.85} flatShading />
      </mesh>
      {/* veranda deck + posts */}
      <mesh position={[0, 0.32, 3.4]} receiveShadow>
        <boxGeometry args={[7.6, 0.3, 2.6]} />
        <meshStandardMaterial color="#b9a06a" roughness={1} />
      </mesh>
      {[-3, -1, 1, 3].map((px) => (
        <mesh key={px} position={[px, 1.75, 4.5]}>
          <boxGeometry args={[0.18, 2.7, 0.18]} />
          <meshStandardMaterial color="#e8dcc3" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 3.25, 3.4]}>
        <boxGeometry args={[7.8, 0.16, 3]} />
        <meshStandardMaterial color="#8a4a2a" roughness={0.9} />
      </mesh>
      {/* chimney — the old fireplace still stands */}
      <mesh position={[2.2, 4.6, -1.2]} castShadow>
        <boxGeometry args={[0.7, 1.8, 0.7]} />
        <meshStandardMaterial color="#b9b2a2" roughness={1} />
      </mesh>
    </group>
  )
}

/** Township Stadium — oval stands + green pitch + floodlights, south of the motor park */
function TownStadium() {
  const base = ANCHOR_BY_ID['transport-area']
  const x = base.x - 2
  const z = base.z + 16
  const y = heightAt(x, z)
  return (
    <group position={[x, y, z]} rotation={[0, 0.35, 0]}>
      {/* pitch */}
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 20]} />
        <meshStandardMaterial color="#5d8a37" roughness={1} />
      </mesh>
      <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.6, 9, 20]} />
        <meshStandardMaterial color="#e8dcc3" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* oval stands — two ring steps */}
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[12.4, 12.4, 1.1, 24, 1, true]} />
        <meshStandardMaterial color="#c9a96b" roughness={1} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[13.8, 13.8, 1, 24, 1, true]} />
        <meshStandardMaterial color="#b98a4a" roughness={1} side={THREE.DoubleSide} flatShading />
      </mesh>
      {/* floodlight pylons */}
      {[45, 135, 225, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180
        return (
          <group key={deg} position={[Math.cos(rad) * 14.6, 0, Math.sin(rad) * 14.6]}>
            <mesh position={[0, 4.4, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.2, 8.8, 5]} />
              <meshStandardMaterial color="#3a3f3a" roughness={0.7} metalness={0.4} />
            </mesh>
            <mesh position={[0, 9, 0]} rotation={[0.5, 0, 0]}>
              <boxGeometry args={[1.7, 0.7, 0.25]} />
              <meshStandardMaterial color="#e8e4d0" emissive="#fff2c0" emissiveIntensity={0.25} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/** Central Mosque — dome + minaret, near the Kpata road */
function CentralMosque() {
  const base = ANCHOR_BY_ID['kpata-market']
  const x = base.x + 14
  const z = base.z - 6
  const y = heightAt(x, z)
  return (
    <group position={[x, y, z]} rotation={[0, -0.4, 0]}>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 3.2, 6]} />
        <meshStandardMaterial color="#e8dcc3" roughness={0.95} />
      </mesh>
      {/* dome */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <sphereGeometry args={[2.5, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2e7d5b" roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[0, 7, 0]}>
        <coneGeometry args={[0.24, 0.8, 6]} />
        <meshStandardMaterial color="#e8a317" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* minaret */}
      <group position={[4.6, 0, 3.4]}>
        <mesh position={[0, 4.5, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.7, 9, 8]} />
          <meshStandardMaterial color="#e8dcc3" roughness={0.95} />
        </mesh>
        <mesh position={[0, 9.4, 0]}>
          <coneGeometry args={[0.85, 1.4, 8]} />
          <meshStandardMaterial color="#2e7d5b" roughness={0.6} />
        </mesh>
        <mesh position={[0, 10.4, 0]}>
          <sphereGeometry args={[0.14, 6, 6]} />
          <meshStandardMaterial color="#e8a317" metalness={0.4} roughness={0.4} />
        </mesh>
      </group>
      {/* arched doorway band */}
      <mesh position={[0, 0.9, 3.02]}>
        <boxGeometry args={[2.4, 1.8, 0.1]} />
        <meshStandardMaterial color="#3a4a3e" roughness={0.9} />
      </mesh>
    </group>
  )
}

/** A church hall near the university quarter */
function ChurchHall() {
  const base = ANCHOR_BY_ID['university-area']
  const x = base.x - 10
  const z = base.z + 6
  const y = heightAt(x, z)
  return (
    <group position={[x, y, z]} rotation={[0, 0.9, 0]}>
      {/* nave */}
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 3.8, 7.5]} />
        <meshStandardMaterial color="#d8cbb0" roughness={0.95} />
      </mesh>
      {/* gable roof — two slabs */}
      <mesh position={[-1.35, 4.45, 0]} rotation={[0, 0, 0.52]} castShadow>
        <boxGeometry args={[2.4, 0.14, 8]} />
        <meshStandardMaterial color="#7a6a55" roughness={0.85} />
      </mesh>
      <mesh position={[1.35, 4.45, 0]} rotation={[0, 0, -0.52]} castShadow>
        <boxGeometry args={[2.4, 0.14, 8]} />
        <meshStandardMaterial color="#7a6a55" roughness={0.85} />
      </mesh>
      {/* tower + simple cross */}
      <mesh position={[0, 2.6, 4.6]} castShadow>
        <boxGeometry args={[2, 5.2, 2]} />
        <meshStandardMaterial color="#e8dcc3" roughness={0.95} />
      </mesh>
      <mesh position={[0, 5.6, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.5, 1.1, 4]} />
        <meshStandardMaterial color="#7a6a55" roughness={0.85} flatShading />
      </mesh>
      <mesh position={[0, 6.9, 4.6]}>
        <boxGeometry args={[0.12, 1.1, 0.12]} />
        <meshStandardMaterial color="#e8a317" roughness={0.5} />
      </mesh>
      <mesh position={[0, 7.1, 4.6]}>
        <boxGeometry args={[0.55, 0.12, 0.12]} />
        <meshStandardMaterial color="#e8a317" roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ---------------------------------- boats ------------------------------------ */

interface BoatPath {
  points: [number, number][]
  from: number
  to: number
  speed: number
}

/**
 * River life — fishing canoes and a laden ferry drifting the Niger and
 * Benue along the real river courses. Each boat slides along a window of
 * its river polyline (deterministic loop, no physics).
 */
const BOAT_PATHS: BoatPath[] = [
  { points: RIVERS[0].points, from: 0.15, to: 0.95, speed: 1.4 },  // Niger — the long real course
  { points: RIVERS[0].points, from: 0.05, to: 0.85, speed: 1.1 },  // slower canoe
  { points: RIVERS[1].points, from: 0.1, to: 0.9, speed: 1.2 },    // Benue
  { points: RIVERS[0].points, from: 0.4, to: 0.99, speed: 1.7 },   // lower Niger ferry (Ganaja run)
  { points: RIVERS[1].points, from: 0.15, to: 0.98, speed: 1.25 }, // Benue canoe
]

function riverPoint(points: [number, number][], t: number): { x: number; z: number; yaw: number } {
  const clamped = Math.max(0, Math.min(0.9999, t))
  const target = clamped * (points.length - 1)
  const i = Math.min(points.length - 2, Math.floor(target))
  const f = target - i
  const [ax, az] = points[i]
  const [bx, bz] = points[i + 1]
  return {
    x: ax + (bx - ax) * f,
    z: az + (bz - az) * f,
    yaw: Math.atan2(bx - ax, bz - az),
  }
}

function Boats() {
  const refs = useRef<(THREE.Group | null)[]>([])
  const phases = useMemo(() => BOAT_PATHS.map((_, i) => i * 0.37), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i < BOAT_PATHS.length; i++) {
      const g = refs.current[i]
      if (!g) continue
      const bp = BOAT_PATHS[i]
      const span = bp.to - bp.from
      const u = (phases[i] + t * (bp.speed / (span * 60))) % 1
      // ping-pong drift so boats come and go
      const tri = u < 0.5 ? u * 2 : 2 - u * 2
      const p = riverPoint(bp.points, bp.from + tri * span)
      g.position.set(p.x, WATER_Y + 0.16 + Math.sin(t * 1.2 + i) * 0.07, p.z)
      g.rotation.y = p.yaw + (tri > 0.5 ? Math.PI : 0)
      g.rotation.z = Math.sin(t * 1.05 + i * 2) * 0.035
    }
    void dt
  })

  return (
    <group>
      {BOAT_PATHS.map((_, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el }}>
          <mesh castShadow>
            <capsuleGeometry args={[0.42, i === 3 ? 4.6 : 3, 4, 8]} />
            <meshStandardMaterial color={i === 3 ? '#3a6ea3' : i % 2 ? '#5a4028' : '#4a6a3a'} roughness={1} />
          </mesh>
          <mesh position={[0, 0.2, 0]} scale={[0.6, 0.45, 1]}>
            <capsuleGeometry args={[0.38, i === 3 ? 3.8 : 2.4, 4, 8]} />
            <meshStandardMaterial color="#2a1e12" roughness={1} />
          </mesh>
          {i === 3 && (
            <mesh position={[0, 0.85, -0.6]} castShadow>
              <boxGeometry args={[1.3, 0.9, 1.6]} />
              <meshStandardMaterial color="#c94f2e" roughness={0.85} />
            </mesh>
          )}
        </group>
      ))}
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
      {/* district-adjacent landmarks (not anchors themselves) */}
      <LugardRestHouse {...ANCHOR_BY_ID['mount-patti']} />
      <TownStadium />
      <CentralMosque />
      <ChurchHall />
      <Boats />
    </group>
  )
}

/* ----------------------------- points of interest ----------------------------- */

/**
 * M2 — THE CIVIC MESH dressing: the Government House flag and one agency
 * fascia per GRA service office. Six small meshes total (performance law:
 * this city carries no decoration it cannot justify) — the buildings
 * themselves stay on the standard instanced block path.
 */
const CIVIC_FASCIA: Record<string, string> = {
  kgirs: '#5C6E3A',
  nepa: '#b9821f',
  police: '#1f3a5c',
  efcc: '#2e5c46',
}

function CivicDressing() {
  const tagged = useMemo(() => BUILDINGS.filter((b) => b.tag), [])
  const poles = useMemo(() => tagged.filter((b) => b.tag === 'gov-house'), [tagged])
  const offices = useMemo(() => tagged.filter((b) => b.tag && b.tag !== 'gov-house'), [tagged])
  const campus = useMemo(() => BUILDINGS.some((b) => b.tag), [])
  if (!campus) return null
  // THE GOVERNMENT GROUNDS — fence, gate and the laterite drive from the GRA
  const { minX, maxX, minZ, maxZ, gateZmin, gateZmax } = CIVIC_CAMPUS
  const midX = (minX + maxX) / 2
  const w = maxX - minX
  const d = maxZ - minZ
  const fenceY = heightAt(minX, minZ)
  const gateZ = (gateZmin + gateZmax) / 2
  const fenceMat = { color: '#b8ab90', roughness: 0.95 } as const
  return (
    <group>
      {/* the fence — four low walls, the east one split by the gate */}
      <mesh position={[midX, fenceY + 0.55, minZ]} castShadow>
        <boxGeometry args={[w, 1.1, 0.35]} />
        <meshStandardMaterial {...fenceMat} />
      </mesh>
      <mesh position={[midX, fenceY + 0.55, maxZ]} castShadow>
        <boxGeometry args={[w, 1.1, 0.35]} />
        <meshStandardMaterial {...fenceMat} />
      </mesh>
      <mesh position={[minX, fenceY + 0.55, (minZ + maxZ) / 2]} castShadow>
        <boxGeometry args={[0.35, 1.1, d]} />
        <meshStandardMaterial {...fenceMat} />
      </mesh>
      <mesh position={[maxX, fenceY + 0.55, (minZ + gateZmin) / 2]} castShadow>
        <boxGeometry args={[0.35, 1.1, gateZmin - minZ]} />
        <meshStandardMaterial {...fenceMat} />
      </mesh>
      <mesh position={[maxX, fenceY + 0.55, (gateZmax + maxZ) / 2]} castShadow>
        <boxGeometry args={[0.35, 1.1, maxZ - gateZmax]} />
        <meshStandardMaterial {...fenceMat} />
      </mesh>
      {/* gate posts — the green-white claim on the entrance */}
      {[gateZmin, gateZmax].map((gz) => (
        <mesh key={gz} position={[maxX, fenceY + 1.35, gz]} castShadow>
          <boxGeometry args={[0.5, 2.7, 0.5]} />
          <meshStandardMaterial color="#1b7a43" roughness={0.6} />
        </mesh>
      ))}
      {/* the laterite drive — gate spine, then the cross to the door row */}
      <mesh position={[maxX + 8, fenceY + 0.06, gateZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 2.6]} />
        <meshStandardMaterial color="#b06a3a" roughness={1} />
      </mesh>
      <mesh position={[midX, fenceY + 0.06, gateZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w - 3, 2.4]} />
        <meshStandardMaterial color="#b06a3a" roughness={1} />
      </mesh>
      <mesh position={[midX, fenceY + 0.06, (maxZ + gateZ) / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.4, (maxZ - gateZ) / 2 + 2]} />
        <meshStandardMaterial color="#b06a3a" roughness={1} />
      </mesh>

      {poles.map((b) => {
        const px = b.x + Math.sin(b.rotY) * (b.d / 2 + 0.4)
        const pz = b.z + Math.cos(b.rotY) * (b.d / 2 + 0.4)
        const py = heightAt(px, pz)
        return (
          <group key="gov-house-flag" position={[px, py, pz]}>
            {/* the mast */}
            <mesh position={[0, 4.2, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.075, 8.4, 6]} />
              <meshStandardMaterial color="#d8d6c8" roughness={0.6} />
            </mesh>
            {/* the flag — green-white-green, live in the wind */}
            <FlagCloth />
          </group>
        )
      })}
      {offices.map((b) => {
        const out = b.d / 2 + 0.07
        const fx = b.x + Math.sin(b.rotY) * out
        const fz = b.z + Math.cos(b.rotY) * out
        return (
          <mesh
            key={b.tag}
            position={[fx, b.y + b.h * 0.82, fz]}
            rotation={[0, b.rotY, 0]}
            castShadow
          >
            <boxGeometry args={[b.w * 0.62, 0.62, 0.1]} />
            <meshStandardMaterial color={CIVIC_FASCIA[b.tag!] ?? '#1c5c3a'} roughness={0.55} />
          </mesh>
        )
      })}
    </group>
  )
}

/** the Government House flag — a small waving plane driven by useFrame */
function FlagCloth() {
  const ref = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 96
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#f7f7f2'
    ctx.fillRect(0, 0, 96, 64)
    ctx.fillStyle = '#1b7a43'
    ctx.fillRect(0, 0, 32, 64)
    ctx.fillRect(64, 0, 32, 64)
    const tex = new THREE.CanvasTexture(canvas)
    if (matRef.current) matRef.current.map = tex
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime()
      ref.current.rotation.y = Math.sin(t * 1.7) * 0.22
      ref.current.rotation.z = Math.sin(t * 2.3) * 0.06
    }
  })
  return (
    <mesh ref={ref} position={[0.62, 7.6, 0]}>
      <planeGeometry args={[1.24, 0.82]} />
      <meshStandardMaterial ref={matRef} side={THREE.DoubleSide} roughness={0.9} />
    </mesh>
  )
}

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

/* --------------------- SILK II — the shared nearest-K law --------------------- */

/**
 * THE NEAREST-K LAW (SILK II): fill `idx` with the array indices of the k
 * nearest points of `pts` to (px, pz), nearest first. Ties break to the
 * LOWER array index — the data keeps its own order, so every player sees
 * the same selection every time (THE DETERMINISM LAW). Pure insertion into
 * caller-owned scratch: zero allocations per call — the frame loops run
 * this every frame. Returns how many slots were filled
 * (≤ min(k, idx.length, pts.length)). Exported for the SILK smoke rig.
 */
export function nearestKInto(
  idx: Int32Array,
  d2: Float64Array,
  pts: readonly { x: number; z: number }[],
  px: number,
  pz: number,
  k: number,
): number {
  const n = Math.min(k, idx.length, pts.length)
  if (n <= 0) return 0
  let filled = 0
  for (let i = 0; i < pts.length; i++) {
    const dx = pts[i].x - px
    const dz = pts[i].z - pz
    const dist2 = dx * dx + dz * dz
    if (filled === n && dist2 >= d2[n - 1]) continue // rim ties keep the earlier entry
    if (filled < n) filled++
    let slot = filled - 1
    while (slot > 0 && d2[slot - 1] > dist2) {
      d2[slot] = d2[slot - 1]
      idx[slot] = idx[slot - 1]
      slot--
    }
    d2[slot] = dist2
    idx[slot] = i
  }
  return filled
}

/* ---------------------------------- labels ----------------------------------- */

/**
 * THE LABEL LAW (SILK II): the 22 location labels are depthTest:false
 * overlays — the old build drew every one of them, always, and bounced
 * all 22 every frame. Now a label is visible only within
 * LABEL_CULL_RANGE of the player (XZ), with the 3 NEAREST kept alive
 * regardless so an arrival always reads its name. Visibility and the
 * y-bounce are imperative per-frame writes; invisible sprites skip the
 * bounce math entirely. Zero allocations (module scratch), zero React
 * churn, sprite scale + atlas untouched (readability unchanged).
 */
const LABEL_CULL_RANGE = 140
const LABEL_KEEP_NEAR = 3
const LABEL_COUNT = ANCHORS.length

// module scratch for the per-frame cull — no per-frame allocation
const labelD2 = new Float64Array(LABEL_COUNT)
const labelKeepI = new Int32Array(LABEL_KEEP_NEAR)
const labelKeepD = new Float64Array(LABEL_KEEP_NEAR)

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
    const grp = groupRef.current
    if (!grp) return
    const t = s.clock.elapsedTime
    const px = playerPos.x
    const pz = playerPos.z
    for (let i = 0; i < LABEL_COUNT; i++) {
      const a = ANCHORS[i]
      const dx = a.x - px
      const dz = a.z - pz
      labelD2[i] = dx * dx + dz * dz
    }
    // the 3-nearest keep-alive — the same deterministic law as the door lights
    nearestKInto(labelKeepI, labelKeepD, ANCHORS, px, pz, LABEL_KEEP_NEAR)
    const range2 = LABEL_CULL_RANGE * LABEL_CULL_RANGE
    for (let i = 0; i < LABEL_COUNT; i++) {
      const child = grp.children[i]
      if (!child) continue
      const near =
        labelD2[i] <= range2 ||
        i === labelKeepI[0] ||
        i === labelKeepI[1] ||
        i === labelKeepI[2]
      if (child.visible !== near) child.visible = near
      if (!near) continue // THE CULL LAW: invisible labels cost no bounce writes
      child.position.y = ANCHORS[i].y + 7.4 + Math.sin(t * 1.1 + i * 1.7) * 0.18
    }
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

/* ------------------------------ interior doors ------------------------------- */

/**
 * INC 4 — visible exterior doorways into the enterable interiors: step,
 * frame, door slab, awning and a small hanging sign. Positioned from the
 * SAME DOORS data the interact system uses — walk to the prop, press E,
 * you're inside.
 *
 * SILK II — THE DOOR MERGE LAW: the old build mounted 686 private meshes
 * (98 doors × 7 parts) with 686 private materials. Every door's parts are
 * identical (each part carries one fixed paint — there is NO per-door
 * colour variation in the data, so instanceColor is unnecessary), so each
 * part-kind is ONE InstancedMesh bucket: 6 buckets, 6 materials, 686
 * instances. doorPartMatrix composes each instance's world matrix to be
 * EXACTLY the transform the old nested scene graph produced (verified
 * vertex-exact by the SILK smoke rig). Shadow casting follows the SILK
 * brief: only the frame buckets (posts + lintel) cast — the old slab and
 * awning shadows were slivers lost inside the doorway at gameplay
 * distance; the step keeps receiving, nothing else does.
 *
 * SILK II — THE DOOR LIGHT LAW: the old build mounted a pointLight on
 * EVERY door — 98 lights, so every lit fragment paid a 98-light loop and
 * the JSX intensity was frozen at the mount-time nightGlow (≈0: dead
 * weight that still billed the loop). DoorLights keeps a fixed pool of 6
 * point lights tracking the K nearest door anchors to the player, K by
 * the effective tier read live from extrasLive (0 low — the emissive glow
 * planes carry the night look / 4 mid / 6 high). Intensity follows
 * atmoLive.nightGlow each frame at the old scale (×6, distance 6,
 * decay 1.8, same warm colour, same anchor spot). The pool size never
 * varies, so the shader's point-light count is constant per tier — no
 * dusk recompile stalls, no React churn, no per-frame allocations.
 */

interface DoorTransform {
  x: number
  y: number
  z: number
  rotY: number
}

interface DoorPartSpec {
  kind: 'step' | 'post' | 'lintel' | 'slab' | 'awning' | 'sign'
  /** instances per door (the frame posts are a pair) */
  perDoor: 1 | 2
  /** shared geometry dims — exactly the old per-mesh <boxGeometry args> */
  geo: [number, number, number]
  /** local transform inside the door frame (the old mesh's position/rotation) */
  x: number
  y: number
  z: number
  rotX: number
  rotY: number
  /** for the post pair: instance s sits at x + sideX[s] */
  sideX: readonly [number, number] | null
  cast: boolean
  receive: boolean
  color: string
  roughness: number
  /** the sign plate is the one emissive part (follows nightGlow live) */
  emissive?: string
}

/** the exact old per-door part transforms, one bucket per part-kind.
 *  Exported for the SILK smoke rig (instance-count + matrix verification). */
export const DOOR_PARTS: DoorPartSpec[] = [
  { kind: 'step', perDoor: 1, geo: [1.7, 0.12, 0.9], x: 0, y: 0.06, z: 0.35, rotX: 0, rotY: 0, sideX: null, cast: false, receive: true, color: '#b9a98d', roughness: 1 },
  { kind: 'post', perDoor: 2, geo: [0.13, 2.1, 0.13], x: 0, y: 1.05, z: 0, rotX: 0, rotY: 0, sideX: [-0.62, 0.62], cast: true, receive: false, color: '#6a4c30', roughness: 1 },
  { kind: 'lintel', perDoor: 1, geo: [1.42, 0.14, 0.15], x: 0, y: 2.14, z: 0, rotX: 0, rotY: 0, sideX: null, cast: true, receive: false, color: '#6a4c30', roughness: 1 },
  { kind: 'slab', perDoor: 1, geo: [0.86, 1.94, 0.055], x: 0.45, y: 1.02, z: 0.16, rotX: 0, rotY: -0.62, sideX: null, cast: false, receive: false, color: '#2e7d5b', roughness: 0.75 },
  { kind: 'awning', perDoor: 1, geo: [1.6, 0.05, 0.95], x: 0, y: 2.32, z: 0.42, rotX: 0.34, rotY: 0, sideX: null, cast: false, receive: false, color: '#c94f2e', roughness: 0.85 },
  { kind: 'sign', perDoor: 1, geo: [0.5, 0.34, 0.03], x: 0, y: 1.88, z: 0.3, rotX: 0, rotY: 0, sideX: null, cast: false, receive: false, color: '#e8dcc3', roughness: 0.9, emissive: '#e8a317' },
]

// module scratch — the composition runs at mount only but stays alloc-free
const _doorParent = new THREE.Matrix4()
const _doorLocal = new THREE.Matrix4()

/**
 * THE DOOR MATRIX LAW: one part instance's world matrix, EXACTLY the old
 * scene graph — T(door) · Ry(door.rotY) · T(local) · R(local). The old
 * build expressed this as nested Object3Ds; this is the same arithmetic
 * on the same numbers. Exported for the SILK smoke rig.
 */
export function doorPartMatrix(out: THREE.Matrix4, door: DoorTransform, part: DoorPartSpec, s: number): THREE.Matrix4 {
  _doorParent.makeRotationY(door.rotY)
  _doorParent.setPosition(door.x, door.y, door.z)
  if (part.rotX !== 0) _doorLocal.makeRotationX(part.rotX)
  else if (part.rotY !== 0) _doorLocal.makeRotationY(part.rotY)
  else _doorLocal.identity()
  _doorLocal.setPosition(part.x + (part.sideX ? part.sideX[s] : 0), part.y, part.z)
  return out.multiplyMatrices(_doorParent, _doorLocal)
}

/** one part-kind bucket: ONE InstancedMesh across all 98 doors */
function DoorBucket({ part, glowScale = 0 }: { part: DoorPartSpec; glowScale?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = ALL_DOORS.length * part.perDoor

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    for (let i = 0; i < ALL_DOORS.length; i++) {
      for (let s = 0; s < part.perDoor; s++) {
        mesh.setMatrixAt(i * part.perDoor + s, doorPartMatrix(m, ALL_DOORS[i], part, s))
      }
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [part])

  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: part.color,
        roughness: part.roughness,
        metalness: 0,
        emissive: part.emissive ?? '#000000',
        emissiveIntensity: 0,
      }),
    [part],
  )
  useEffect(() => () => mat.dispose(), [mat])

  // the sign plate is the one emissive part — it follows nightGlow live
  // through a ref (the Shopfronts sign convention — the old JSX read
  // nightGlow once at mount; the file's own convention is the live read)
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null)
  useEffect(() => {
    matRef.current = mat
  }, [mat])
  useFrame(() => {
    if (glowScale > 0 && matRef.current) matRef.current.emissiveIntensity = atmoLive.nightGlow * glowScale
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow={part.cast} receiveShadow={part.receive}>
      <boxGeometry args={part.geo} />
      <primitive object={mat} attach="material" />
    </instancedMesh>
  )
}

/* -------------------------- SILK II — the door lights ------------------------- */

/**
 * THE DOOR LIGHT POOL: 6 point lights, always mounted, tracking the K
 * nearest door anchors — the exact spots the old per-door lights sat at
 * (door frame + (0, 2, 0.5), the frame's yaw applied). K follows the
 * effective tier live (extrasLive — the polish layers' own live pattern):
 * 0 on low, 4 on mid, 6 on high. Active slots stay visible at intensity 0
 * in daytime so the shader's light count never churns; only the spares
 * (pool slots beyond the tier count) sit dark + hidden.
 */
export const DOOR_LIGHT_POOL = 6
export const DOOR_LIGHT_BY_TIER: Record<QualityTier, number> = { low: 0, mid: 4, high: 6 }

interface DoorLightSource {
  x: number
  y: number
  z: number
}

/** doors eligible for the pool (the old `d.light !== false` law) with the
 *  exact anchor the old JSX light occupied. Exported for the smoke rig. */
export const DOOR_LIGHT_SOURCES: DoorLightSource[] = ALL_DOORS.filter((d) => d.light !== false).map((d) => ({
  x: d.x + Math.sin(d.rotY) * 0.5,
  y: d.y + 2,
  z: d.z + Math.cos(d.rotY) * 0.5,
}))

// module scratch — the per-frame nearest-K allocates nothing
const _lightIdx = new Int32Array(DOOR_LIGHT_POOL)
const _lightD2 = new Float64Array(DOOR_LIGHT_POOL)

/** nearest door lights to the player, nearest first (ties → data order) */
export function pickNearestDoorLights(px: number, pz: number, k: number): number {
  return nearestKInto(_lightIdx, _lightD2, DOOR_LIGHT_SOURCES, px, pz, k)
}

function DoorLights() {
  const refs = useRef<(THREE.PointLight | null)[]>([])

  useFrame(() => {
    const k = DOOR_LIGHT_BY_TIER[extrasLive.tier]
    const active = Math.min(k, DOOR_LIGHT_SOURCES.length)
    const glow = atmoLive.nightGlow
    // selection only matters while a glow can read it; the ACTIVE slots
    // keep tracking (visible at intensity 0 by day) so the light count is
    // stable across the whole day cycle
    if (glow > 0 && active > 0) pickNearestDoorLights(playerPos.x, playerPos.z, active)
    for (let s = 0; s < DOOR_LIGHT_POOL; s++) {
      const light = refs.current[s]
      if (!light) continue
      if (s >= active) {
        // THE SPARE LAW: pool slots beyond the tier count sit dark + hidden
        light.intensity = 0
        light.visible = false
        continue
      }
      light.visible = true
      if (glow <= 0) {
        light.intensity = 0
        continue
      }
      const src = DOOR_LIGHT_SOURCES[_lightIdx[s]]
      light.position.set(src.x, src.y, src.z)
      light.intensity = glow * 6
    }
  })

  return (
    <group>
      {Array.from({ length: DOOR_LIGHT_POOL }, (_, i) => (
        <pointLight
          key={i}
          ref={(el) => { refs.current[i] = el }}
          color="#ffd9a0"
          intensity={0}
          distance={6}
          decay={1.8}
        />
      ))}
    </group>
  )
}

function Doorways() {
  return (
    <group>
      {/* one instanced bucket per part-kind — 686 instances, 6 draw calls */}
      {DOOR_PARTS.map((p) => (
        <DoorBucket key={p.kind} part={p} glowScale={p.kind === 'sign' ? 0.35 : 0} />
      ))}
      {/* the SILK II light pool — 6 point lights for the whole city's doors */}
      <DoorLights />
    </group>
  )
}

/* ---------------------------------- export ----------------------------------- */

export function CityMesh() {
  return (
    <group>
      <Buildings />
      <Shopfronts />
      <RooftopClutter />
      <CompoundLife />
      <UtilityLines />
      <StreetProps />
      <Stalls />
      <FloraTrees />
      <Rocks />
      <Lamps />
      <AnchorStructures />
      <CivicDressing />
      <PointOfInterestProps />
      <Doorways />
      <LocationLabels />
    </group>
  )
}
