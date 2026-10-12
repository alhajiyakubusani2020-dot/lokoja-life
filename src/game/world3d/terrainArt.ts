/**
 * LOKOJA LIFE — terrain art helpers (Stage 4C)
 * ---------------------------------------------
 * Baked-once canvas textures and geometry utilities for the ground half of
 * the world (terrain grain, road surfaces). Everything here is DETERMINISTIC
 * — seeded PRNG only, no Math.random — so Lokoja renders identically every
 * run. Textures stay ≤ 512px and are generated on the client only.
 */

import * as THREE from 'three'

/* ------------------------------- seeded noise ------------------------------ */

/** tiny deterministic PRNG (mulberry32) — same family as layout.ts */
function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** cheap deterministic hash → 0..1 (for per-instance jitter) */
export function hash1(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

function canvas2d(w: number, h: number): { cv: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const ctx = cv.getContext('2d')
  if (!ctx) throw new Error('2d canvas unavailable')
  return { cv, ctx }
}

/** per-pixel warm speckle so flat fills get grain (in place) */
function speckle(ctx: CanvasRenderingContext2D, w: number, h: number, amp: number, r: () => number) {
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * amp
    d[i] = Math.max(0, Math.min(255, d[i] + n))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n * 0.92))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * 0.74))
  }
  ctx.putImageData(img, 0, 0)
}

/** soft radial blob (mottling) */
function blob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  r2: () => number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
  void r2
}

/* ------------------------------ ground grain ------------------------------- */

/**
 * Warm neutral grain/mottle texture multiplied over the terrain's vertex
 * colours — kills the "flat paint" look. Low contrast so tiling seams at
 * 26× repeat stay invisible.
 */
export function makeGroundGrainTexture(size = 256): THREE.CanvasTexture {
  const { cv, ctx } = canvas2d(size, size)
  const r = rng(40211)
  ctx.fillStyle = 'rgb(238,234,222)'
  ctx.fillRect(0, 0, size, size)
  // soft mottling — darker earth patches and pale dry patches
  for (let i = 0; i < 230; i++) {
    const x = r() * size
    const y = r() * size
    const rad = 7 + r() * 34
    const dark = r() < 0.52
    blob(ctx, x, y, rad, dark ? 'rgba(118,106,78,0.055)' : 'rgba(255,252,238,0.05)', r)
  }
  // sparse micro speckle (pebbles/twigs hint)
  for (let i = 0; i < 420; i++) {
    const x = r() * size
    const y = r() * size
    ctx.fillStyle = r() < 0.5 ? 'rgba(96,86,64,0.10)' : 'rgba(236,228,200,0.10)'
    ctx.fillRect(x, y, 1.4, 1.4)
  }
  speckle(ctx, size, size, 16, r)
  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 4
  return tex
}

/* ------------------------------ road surfaces ------------------------------ */

/**
 * Worn laterite (lateritic earth) road strip. u runs ACROSS the road
 * (0..1), v ALONG it — one tile ≈ 7.2 world units. Includes the two darker
 * wheel-track bands and dusty edges baked in, so a plain ribbon reads as a
 * trafficked dirt road.
 */
export function makeLateriteRoadTexture(): THREE.CanvasTexture {
  const W = 128
  const H = 256
  const { cv, ctx } = canvas2d(W, H)
  const r = rng(73317)
  ctx.fillStyle = 'rgb(196,132,80)'
  ctx.fillRect(0, 0, W, H)
  // mottling — patches of paler dust and redder gravel
  for (let i = 0; i < 60; i++) {
    const x = r() * W
    const y = r() * H
    const rad = 6 + r() * 22
    blob(ctx, x, y, rad, r() < 0.5 ? 'rgba(150,92,50,0.16)' : 'rgba(224,178,120,0.14)', r)
  }
  // wheel-track bands (two darker polished strips)
  for (const u of [0.3, 0.7]) {
    const x = u * W
    const g = ctx.createLinearGradient(x - 15, 0, x + 15, 0)
    g.addColorStop(0, 'rgba(74,42,22,0)')
    g.addColorStop(0.5, 'rgba(74,42,22,0.34)')
    g.addColorStop(1, 'rgba(74,42,22,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - 15, 0, 30, H)
  }
  // transverse wear — faint washout bands where rain crossed the road
  for (let i = 0; i < 18; i++) {
    const y = r() * H
    const h = 3 + r() * 9
    ctx.fillStyle = `rgba(210,170,120,${0.05 + r() * 0.08})`
    ctx.fillRect(0, y, W, h)
  }
  // dusty shoulders — lighter at both edges
  for (const side of [0, 1]) {
    const g = side === 0
      ? ctx.createLinearGradient(0, 0, 16, 0)
      : ctx.createLinearGradient(W, 0, W - 16, 0)
    g.addColorStop(0, 'rgba(226,196,140,0.30)')
    g.addColorStop(1, 'rgba(226,196,140,0)')
    ctx.fillStyle = g
    ctx.fillRect(side === 0 ? 0 : W - 16, 0, 16, H)
  }
  speckle(ctx, W, H, 26, r)
  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  return tex
}

/**
 * Weathered asphalt strip for trunk roads, with the worn centre dashed
 * line baked in (one dash per tile, ~2.9u dash / ~4.3u gap at 7.2u tiles).
 * u across, v along — same convention as the laterite strip.
 */
export function makeAsphaltRoadTexture(): THREE.CanvasTexture {
  const W = 128
  const H = 256
  const { cv, ctx } = canvas2d(W, H)
  const r = rng(99017)
  ctx.fillStyle = 'rgb(88,92,96)'
  ctx.fillRect(0, 0, W, H)
  // patchy repairs / tar seams
  for (let i = 0; i < 46; i++) {
    const x = r() * W
    const y = r() * H
    const rad = 5 + r() * 20
    blob(ctx, x, y, rad, r() < 0.55 ? 'rgba(52,56,60,0.18)' : 'rgba(130,134,132,0.12)', r)
  }
  // wheel polish — slightly darker sheen bands
  for (const u of [0.3, 0.7]) {
    const x = u * W
    const g = ctx.createLinearGradient(x - 14, 0, x + 14, 0)
    g.addColorStop(0, 'rgba(38,40,42,0)')
    g.addColorStop(0.5, 'rgba(38,40,42,0.26)')
    g.addColorStop(1, 'rgba(38,40,42,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - 14, 0, 28, H)
  }
  // grime at the edges (dust blowing onto the shoulder line)
  for (const side of [0, 1]) {
    const g = side === 0
      ? ctx.createLinearGradient(0, 0, 14, 0)
      : ctx.createLinearGradient(W, 0, W - 14, 0)
    g.addColorStop(0, 'rgba(140,124,96,0.26)')
    g.addColorStop(1, 'rgba(140,124,96,0)')
    ctx.fillStyle = g
    ctx.fillRect(side === 0 ? 0 : W - 14, 0, 14, H)
  }
  // centre dashed line — painted, then worn back
  const lx = W * 0.5
  const dashTop = H * 0.16
  const dashH = H * 0.42
  ctx.fillStyle = 'rgb(216,212,196)'
  ctx.fillRect(lx - 2.2, dashTop, 4.4, dashH)
  // wear: chip the paint with dark specks
  for (let i = 0; i < 90; i++) {
    const y = dashTop + r() * dashH
    ctx.fillStyle = `rgba(88,92,96,${0.35 + r() * 0.4})`
    ctx.fillRect(lx - 2.2 + r() * 4.4, y, 0.9 + r() * 1.6, 1 + r() * 2.4)
  }
  speckle(ctx, W, H, 22, r)
  const tex = new THREE.CanvasTexture(cv)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 8
  return tex
}

/* ---------------------------- shared road textures ------------------------- */

let roadTexCache: { asphalt: THREE.CanvasTexture; laterite: THREE.CanvasTexture } | null = null

/** Lazily baked, shared between the road ribbons and the bridge decks. */
export function roadTextures(): { asphalt: THREE.CanvasTexture; laterite: THREE.CanvasTexture } {
  if (!roadTexCache) {
    roadTexCache = {
      asphalt: makeAsphaltRoadTexture(),
      laterite: makeLateriteRoadTexture(),
    }
  }
  return roadTexCache
}

/* ---------------------------- geometry utilities --------------------------- */

/**
 * Minimal indexed-geometry merge (position + optional uv/color).
 * All inputs must be indexed; attributes are matched to the FIRST geometry.
 */
export function mergeGeoms(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (list.length === 1) return list[0]
  const hasUV = list.every((g) => !!g.attributes.uv)
  const hasCol = list.every((g) => !!g.attributes.color)
  let vTotal = 0
  let iTotal = 0
  for (const g of list) {
    vTotal += g.attributes.position.count
    iTotal += g.index ? g.index.count : 0
  }
  const pos = new Float32Array(vTotal * 3)
  const uv = hasUV ? new Float32Array(vTotal * 2) : null
  const col = hasCol ? new Float32Array(vTotal * 3) : null
  const idx = new Uint32Array(iTotal)
  let vo = 0
  let io = 0
  for (const g of list) {
    pos.set(g.attributes.position.array as Float32Array, vo * 3)
    if (uv) uv.set(g.attributes.uv.array as Float32Array, vo * 2)
    if (col) col.set(g.attributes.color.array as Float32Array, vo * 3)
    if (g.index) {
      const gi = g.index.array
      for (let k = 0; k < gi.length; k++) idx[io + k] = gi[k] + vo
      io += gi.length
    }
    vo += g.attributes.position.count
    g.dispose()
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  if (uv) out.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  if (col) out.setAttribute('color', new THREE.BufferAttribute(col, 3))
  out.setIndex(new THREE.BufferAttribute(idx, 1))
  return out
}
