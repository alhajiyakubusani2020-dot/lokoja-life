'use client'

/**
 * LOKOJA LIFE — 3D World shared assets & helpers (Stage 3.5)
 * -----------------------------------------------------------
 * One per-canvas asset kit (geometries + materials, all low-poly) shared
 * through context, plus the instancing helper that keeps the whole city
 * in a handful of draw calls. Everything is procedural — zero downloads.
 */

import { createContext, useContext, useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { WALL_COLORS, ROOF_COLORS, AWNING_COLORS } from '@/game/data/world3d'

/* ------------------------------ colour system ------------------------------ */

export const PALETTE = {
  grass: new THREE.Color('#79a651'),
  grassDeep: new THREE.Color('#5c8a3e'),
  grassDry: new THREE.Color('#a8b060'),
  sand: new THREE.Color('#e2cf9a'),
  dirt: new THREE.Color('#b99a68'),
  rock: new THREE.Color('#8a755c'),
  rockLight: new THREE.Color('#a3907a'),
  riverbed: new THREE.Color('#3f6b5c'),
  water: new THREE.Color('#1f7a6d'),
  waterDeep: new THREE.Color('#155c50'),
  roadMain: new THREE.Color('#7d7466'),
  roadMinor: new THREE.Color('#b0812a'),
  roadApron: new THREE.Color('#cdb98b'),
  wall: WALL_COLORS.map((c) => new THREE.Color(c)),
  roof: ROOF_COLORS.map((c) => new THREE.Color(c)),
  awning: AWNING_COLORS.map((c) => new THREE.Color(c)),
  zinc: new THREE.Color('#9aa7b0'),
  wood: new THREE.Color('#8a6a3b'),
  woodDark: new THREE.Color('#5c4623'),
  white: new THREE.Color('#f5f0e0'),
  gold: new THREE.Color('#e8b83a'),
  trunk: new THREE.Color('#7a5a34'),
  leaf: [new THREE.Color('#4d7a30'), new THREE.Color('#5f8f3c'), new THREE.Color('#3e6b2a')],
  palm: new THREE.Color('#6b9a3e'),
  bush: new THREE.Color('#568a3c'),
  skin: ['#8a5a3b', '#7a4a30', '#6b3d26', '#96684a', '#5c3520', '#a3765a'].map((c) => new THREE.Color(c)),
  cloth: ['#1B7A43', '#C4562A', '#E8A317', '#1F7A6D', '#7C2D6E', '#2b6cb0', '#b03030', '#f0f0e0'].map((c) => new THREE.Color(c)),
  dark: new THREE.Color('#2a2a26'),
  tyre: new THREE.Color('#26262a'),
  keke: new THREE.Color('#e8c820'),
  taxi: new THREE.Color('#f0c020'),
  busGreen: new THREE.Color('#2e7d4f'),
  busWhite: new THREE.Color('#e8e4d8'),
  carCols: ['#b03030', '#2b6cb0', '#e8e4d8', '#3a3a3e', '#5c9a50', '#c4a030', '#7c3aed'].map((c) => new THREE.Color(c)),
}

/** Shared mutable mood — Lighting writes it, materials read it. */
export const worldMood = { night: 0, rain: 0 }

/**
 * Window glass — glows warm after dark. Module singleton (one canvas at
 * a time) so NightGlow's frame loop can drift its emissive without
 * touching hook-returned objects.
 */
export const WINDOW_MAT = new THREE.MeshLambertMaterial({
  color: '#e8f0f5',
  emissive: new THREE.Color('#ffcf7a'),
  emissiveIntensity: 0,
})

/* --------------------------------- context --------------------------------- */

export interface WorldAssets {
  geos: {
    box: THREE.BoxGeometry
    cone: THREE.ConeGeometry
    pyramid: THREE.ConeGeometry
    cylinder: THREE.CylinderGeometry
    sphere: THREE.SphereGeometry
    dome: THREE.SphereGeometry
    ico: THREE.IcosahedronGeometry
    plane: THREE.PlaneGeometry
    circle: THREE.CircleGeometry
    torus: THREE.TorusGeometry
  }
  mats: {
    flat: THREE.MeshLambertMaterial // per-instance colors
    flatDouble: THREE.MeshLambertMaterial
    bulb: THREE.MeshLambertMaterial // streetlight bulbs
    water: THREE.MeshPhongMaterial
    ghost: THREE.MeshBasicMaterial // invisible hitboxes
    shadow: THREE.MeshBasicMaterial // blob shadows
    glowCone: THREE.MeshBasicMaterial // streetlight cones
    cloud: THREE.MeshLambertMaterial // drifting puffs
  }
}

const AssetsContext = createContext<WorldAssets | null>(null)

export function useWorldAssets(): WorldAssets {
  const ctx = useContext(AssetsContext)
  if (!ctx) throw new Error('WorldAssets missing — use inside WorldScene')
  return ctx
}

export function WorldAssetsProvider({ children }: { children: React.ReactNode }) {
  const assets = useMemo<WorldAssets>(() => {
    const geos = {
      box: new THREE.BoxGeometry(1, 1, 1),
      cone: new THREE.ConeGeometry(0.5, 1, 7),
      pyramid: new THREE.ConeGeometry(0.72, 1, 4),
      cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 8),
      sphere: new THREE.SphereGeometry(0.5, 10, 8),
      dome: new THREE.SphereGeometry(0.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      ico: new THREE.IcosahedronGeometry(0.5, 0),
      plane: new THREE.PlaneGeometry(1, 1),
      circle: new THREE.CircleGeometry(0.5, 12),
      torus: new THREE.TorusGeometry(0.5, 0.09, 6, 20),
    }
    const mats = {
      flat: new THREE.MeshLambertMaterial({ color: '#ffffff' }),
      flatDouble: new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide }),
      bulb: new THREE.MeshLambertMaterial({ color: '#fff8e0', emissive: new THREE.Color('#ffe9a8'), emissiveIntensity: 0 }),
      water: new THREE.MeshPhongMaterial({
        color: PALETTE.water.clone(),
        transparent: true,
        opacity: 0.88,
        shininess: 110,
        specular: new THREE.Color('#9fd8cc'),
      }),
      ghost: new THREE.MeshBasicMaterial({ visible: false }),
      shadow: new THREE.MeshBasicMaterial({ color: '#1a221a', transparent: true, opacity: 0.22, depthWrite: false }),
      glowCone: new THREE.MeshBasicMaterial({
        color: '#ffe9a8',
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      cloud: new THREE.MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.82, emissive: new THREE.Color('#8a95a5'), emissiveIntensity: 0.35 }),
    }
    return { geos, mats }
  }, [])

  return <AssetsContext.Provider value={assets}>{children}</AssetsContext.Provider>
}

/* ------------------------------ instancing core ----------------------------- */

export interface PartSpec {
  /** world position */
  x: number
  y: number
  z: number
  /** euler rotation (radians) */
  rx?: number
  ry?: number
  rz?: number
  /** scale per axis (uniform if single number) */
  s: number | [number, number, number]
  /** optional per-instance colour */
  color?: THREE.Color
}

/**
 * Instanced batch of one geometry — the whole reason the city renders
 * in ~40 draw calls instead of thousands.
 */
export function Instances({ geometry, material, parts }: {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  parts: PartSpec[]
}) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const count = Math.max(1, parts.length)

  useLayoutEffect(() => {
    const im = ref.current
    if (!im) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    const supportsColor = (material as THREE.MeshLambertMaterial).color !== undefined
    parts.forEach((part, i) => {
      e.set(part.rx ?? 0, part.ry ?? 0, part.rz ?? 0)
      q.setFromEuler(e)
      p.set(part.x, part.y, part.z)
      const sc = typeof part.s === 'number' ? [part.s, part.s, part.s] : part.s
      s.set(sc[0], sc[1], sc[2])
      m.compose(p, q, s)
      im.setMatrixAt(i, m)
      if (part.color && supportsColor) im.setColorAt(i, part.color)
    })
    im.count = parts.length
    im.instanceMatrix.needsUpdate = true
    if (im.instanceColor) im.instanceColor.needsUpdate = true
    im.computeBoundingSphere()
  }, [parts, material])

  return <instancedMesh ref={ref} args={[geometry, material, count]} />
}

/* ------------------------------- label sprites ------------------------------ */

/**
 * Build a canvas label sprite (rounded pill + emoji + text) — used for
 * the floating district names. 10 sprites total, negligible cost.
 */
export function makeLabelSprite(text: string, emoji: string, tint: string): THREE.Sprite {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 80
  const ctx = canvas.getContext('2d')!

  // pill
  ctx.fillStyle = 'rgba(255, 253, 247, 0.94)'
  ctx.beginPath()
  ctx.roundRect(6, 8, 244, 64, 22)
  ctx.fill()
  ctx.lineWidth = 4
  ctx.strokeStyle = tint
  ctx.stroke()

  ctx.font = '700 28px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#22271f'
  ctx.fillText(`${emoji} ${text}`, 128, 41)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(9.6, 3, 1)
  sprite.renderOrder = 20
  return sprite
}

/** Deterministic pick helper. */
export function pick<T>(arr: T[], i: number): T {
  return arr[Math.abs(i) % arr.length]
}
