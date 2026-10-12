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
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  ANCHORS, ANCHOR_BY_ID, BUILDINGS, heightAt, LAMPS, makeRng, PALM_TONES, POINTS_OF_INTEREST, ROOF_TONES,
  RIVERS, STALLS, STALL_TONES, TREE_TONES, TREES, WALL_TONES, WATER_Y, type BuildingDef, type WorldAnchor,
} from '@/game/world3d/layout'
import { ALL_DOORS, SCHOOL_TREES } from '@/game/world3d/schools'
import { atmoLive } from './atmosphere'
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

/* ---------------------------------- trees ------------------------------------ */

/** one drooping palm frond: a curved ribbon that arcs out and hangs */
function makeFrondGeometry(): THREE.BufferGeometry {
  const STEPS = 6
  const pos: number[] = []
  const idx: number[] = []
  for (let i = 0; i <= STEPS; i++) {
    const x = (i / STEPS) * 2.3
    const y = -(x * x) * 0.3
    const w = 0.24 * (1 - (i / STEPS) * 0.72)
    pos.push(x, y, -w, x, y, w)
  }
  for (let i = 0; i < STEPS; i++) {
    const a = i * 2
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  g.setIndex(idx)
  return g
}

/**
 * Savanna broadleaf trees (layered flat-shaded canopies, some dry-season
 * gold) and riverine palms (segmented curved trunks, radial arched
 * fronds, coconut clusters). Instanced per part — 5 draw calls total.
 */
function Trees() {
  // Stage 7 — compound trees (mango/neem rows + gate palms) join the scatter
  const ALL_TREE_DEFS = useMemo(() => [...TREES, ...SCHOOL_TREES], [])
  const palms = useMemo(() => ALL_TREE_DEFS.filter((t) => t.kind === 'palm'), [ALL_TREE_DEFS])
  const trees = useMemo(() => ALL_TREE_DEFS.filter((t) => t.kind === 'tree'), [ALL_TREE_DEFS])

  // per-tree character, decided once by the seeded RNG
  const treeVars = useMemo(() => {
    const rng = makeRng(77007)
    return trees.map(() => ({
      lean: (rng() - 0.5) * 0.2,
      yaw: rng() * Math.PI * 2,
      gold: rng() < 0.2,
    }))
  }, [trees])
  const palmVars = useMemo(() => {
    const rng = makeRng(88011)
    return palms.map(() => ({
      yaw: rng() * Math.PI * 2,
      lean: 0.3 + rng() * 0.7,
      frondJit: rng() * 0.4,
    }))
  }, [palms])

  const GOLD_REF = useMemo(() => new THREE.Color('#c09a3e'), [])
  const frondGeo = useMemo(() => makeFrondGeometry(), [])
  useEffect(() => () => frondGeo.dispose(), [frondGeo])
  const UP = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  return (
    <group>
      {/* --- broadleaf trunks --- */}
      <InstancedGroup count={trees.length} castShadow setup={(i, m) => {
        const t = trees[i]
        const v = treeVars[i]
        m.position.set(t.x, t.y + 1.15 * t.scale - 0.08, t.z)
        m.rotation.set(v.lean * 0.4, v.yaw, v.lean * 0.5)
        m.scale.set(t.scale, t.scale * 1.05, t.scale)
      }}>
        <cylinderGeometry args={[0.13, 0.26, 2.6, 5]} />
        <meshStandardMaterial color="#63452a" roughness={1} flatShading />
      </InstancedGroup>

      {/* --- broadleaf canopies: 2-3 flat-shaded blobs per tree --- */}
      <InstancedGroup count={trees.length * 3} castShadow setup={(i, m, color) => {
        const t = trees[Math.floor(i / 3)]
        const v = treeVars[Math.floor(i / 3)]
        const blob = i % 3
        const s = t.scale
        if (blob === 0) {
          m.position.set(t.x, t.y + 3.2 * s, t.z)
          m.rotation.set(v.lean * 0.6, v.yaw, v.lean)
          m.scale.set(s * 1.55, s * 1.3, s * 1.55)
        } else {
          const ang = v.yaw + blob * 2.5
          const r = 0.75 * s * (blob === 1 ? 1 : 0.8)
          m.position.set(t.x + Math.cos(ang) * r, t.y + (2.5 + blob * 0.42) * s, t.z + Math.sin(ang) * r)
          m.rotation.set(blob * 1.1, v.yaw * 1.3, blob * 0.7)
          m.scale.setScalar(s * (blob === 1 ? 1.0 : 0.82))
        }
        color.set(TREE_TONES[t.tone % TREE_TONES.length])
        if (blob > 0) color.multiplyScalar(0.86)
        if (v.gold) color.lerp(GOLD_REF, 0.55)
      }}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.95} flatShading />
      </InstancedGroup>

      {/* --- palm trunks: 4 stacked segments walking out along the lean --- */}
      <InstancedGroup count={palms.length * 4} castShadow setup={(i, m) => {
        const t = palms[Math.floor(i / 4)]
        const v = palmVars[Math.floor(i / 4)]
        const k = i % 4
        const drift = k * k * 0.1 * v.lean * t.scale
        m.rotation.set(k * 0.09 * v.lean, v.yaw, 0, 'YXZ')
        m.position.set(
          t.x + Math.sin(v.yaw) * drift,
          t.y + (0.42 + k * 0.86) * t.scale,
          t.z + Math.cos(v.yaw) * drift,
        )
        m.scale.set(t.scale, t.scale, t.scale)
      }}>
        <cylinderGeometry args={[0.09, 0.14, 0.95, 5]} />
        <meshStandardMaterial color="#8a6a48" roughness={1} flatShading />
      </InstancedGroup>

      {/* --- palm fronds: 7 arched blades radiating from the crown --- */}
      <InstancedGroup count={palms.length * 7} castShadow setup={(i, m, color) => {
        const t = palms[Math.floor(i / 7)]
        const v = palmVars[Math.floor(i / 7)]
        const f = i % 7
        const drift = 9 * 0.1 * v.lean * t.scale
        const yaw = f * ((Math.PI * 2) / 7) + v.frondJit
        const lift = 0.18 + ((f * 5 + Math.floor(i / 7)) % 3) * 0.2
        const qYaw = new THREE.Quaternion().setFromAxisAngle(UP, yaw)
        const qLift = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), lift)
        m.quaternion.multiplyQuaternions(qYaw, qLift)
        m.position.set(
          t.x + Math.sin(v.yaw) * drift,
          t.y + (3.62 + (f % 2) * 0.1) * t.scale,
          t.z + Math.cos(v.yaw) * drift,
        )
        m.scale.setScalar(t.scale * (0.92 + (f % 3) * 0.06))
        color.set(PALM_TONES[t.tone % PALM_TONES.length]).multiplyScalar(0.92 + (f % 2) * 0.12)
      }}>
        <primitive object={frondGeo} attach="geometry" />
        <meshStandardMaterial roughness={0.9} flatShading side={THREE.DoubleSide} />
      </InstancedGroup>

      {/* --- coconut clusters at the crowns --- */}
      <InstancedGroup count={palms.length * 3} castShadow setup={(i, m) => {
        const t = palms[Math.floor(i / 3)]
        const v = palmVars[Math.floor(i / 3)]
        const k = i % 3
        const drift = 9 * 0.1 * v.lean * t.scale
        const ang = k * 2.1 + v.yaw
        m.position.set(
          t.x + Math.sin(v.yaw) * drift + Math.cos(ang) * 0.18 * t.scale,
          t.y + 3.5 * t.scale,
          t.z + Math.cos(v.yaw) * drift + Math.sin(ang) * 0.18 * t.scale,
        )
        m.scale.setScalar(t.scale * (0.85 + (k % 2) * 0.3))
      }}>
        <sphereGeometry args={[0.14, 6, 5]} />
        <meshStandardMaterial color="#6e5222" roughness={1} />
      </InstancedGroup>
    </group>
  )
}

/* ---------------------------------- lamps ------------------------------------ */

function Lamps() {
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const poolRef = useRef<THREE.MeshBasicMaterial>(null)
  const poolTex = useMemo(() => bakeGlowPool(), [])
  useEffect(() => () => poolTex.dispose(), [poolTex])

  useFrame(() => {
    const g = atmoLive.nightGlow
    if (glowRef.current) glowRef.current.emissiveIntensity = 0.1 + g * 2.4
    if (poolRef.current) poolRef.current.opacity = g * 0.5
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
      {/* cowl over the lamp head */}
      <InstancedGroup
        count={LAMPS.length}
        setup={(i, m) => {
          const l = LAMPS[i]
          m.position.set(l.x, l.y + 3.98, l.z)
          m.rotation.set(0, i * 0.8, 0)
          m.scale.setScalar(1)
        }}
      >
        <coneGeometry args={[0.3, 0.2, 8]} />
        <meshStandardMaterial color="#2c312e" roughness={0.65} metalness={0.35} />
      </InstancedGroup>
      <InstancedGroup
        count={LAMPS.length}
        setup={(i, m) => {
          const l = LAMPS[i]
          m.position.set(l.x, l.y + 3.82, l.z)
          m.rotation.set(0, 0, 0)
          m.scale.setScalar(1)
        }}
      >
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial ref={glowRef} color="#ffe9c0" emissive="#ffca7a" emissiveIntensity={0.1} />
      </InstancedGroup>
      {/* warm sodium pools of light on the ground at night (soft radial falloff) */}
      <InstancedGroup
        count={LAMPS.length}
        setup={(i, m) => {
          const l = LAMPS[i]
          m.position.set(l.x, l.y + 0.09, l.z)
          m.rotation.set(-Math.PI / 2, 0, 0)
          m.scale.setScalar(1)
        }}
      >
        <circleGeometry args={[2.3, 18]} />
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

/* ------------------------------ interior doors ------------------------------- */

/**
 * INC 4 — visible exterior doorways into the enterable interiors: step,
 * frame, door slab, awning and a small hanging sign. Positioned from the
 * SAME DOORS data the interact system uses — walk to the prop, press E,
 * you're inside.
 */
function Doorways() {
  return (
    <group>
      {ALL_DOORS.map((d) => (
        <group key={d.interiorId} position={[d.x, d.y, d.z]} rotation={[0, d.rotY, 0]}>
          {/* step */}
          <mesh position={[0, 0.06, 0.35]} receiveShadow>
            <boxGeometry args={[1.7, 0.12, 0.9]} />
            <meshStandardMaterial color="#b9a98d" roughness={1} />
          </mesh>
          {/* frame posts + lintel */}
          {[-0.62, 0.62].map((x) => (
            <mesh key={x} position={[x, 1.05, 0]} castShadow>
              <boxGeometry args={[0.13, 2.1, 0.13]} />
              <meshStandardMaterial color="#6a4c30" roughness={1} />
            </mesh>
          ))}
          <mesh position={[0, 2.14, 0]} castShadow>
            <boxGeometry args={[1.42, 0.14, 0.15]} />
            <meshStandardMaterial color="#6a4c30" roughness={1} />
          </mesh>
          {/* the door slab, ajar */}
          <mesh position={[0.45, 1.02, 0.16]} rotation={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.86, 1.94, 0.055]} />
            <meshStandardMaterial color="#2e7d5b" roughness={0.75} />
          </mesh>
          {/* awning */}
          <mesh position={[0, 2.32, 0.42]} rotation={[0.34, 0, 0]} castShadow>
            <boxGeometry args={[1.6, 0.05, 0.95]} />
            <meshStandardMaterial color="#c94f2e" roughness={0.85} />
          </mesh>
          {/* hanging sign plate */}
          <mesh position={[0, 1.88, 0.3]}>
            <boxGeometry args={[0.5, 0.34, 0.03]} />
            <meshStandardMaterial color="#e8dcc3" roughness={0.9} emissive="#e8a317" emissiveIntensity={atmoLive.nightGlow * 0.35} />
          </mesh>
          {/* warm doorstep glow at night (city doors only — the 24 school
              doors keep their light budget for the compound floodlamps) */}
          {d.light !== false && (
            <pointLight position={[0, 2.0, 0.5]} color="#ffd9a0" intensity={atmoLive.nightGlow * 6} distance={6} decay={1.8} />
          )}
        </group>
      ))}
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
      <Trees />
      <Lamps />
      <AnchorStructures />
      <PointOfInterestProps />
      <Doorways />
      <LocationLabels />
    </group>
  )
}
