/**
 * LOKOJA LIFE — M23 W2: THE GREEN (per-species merged flora geometry)
 * ------------------------------------------------------------------
 * ONE merged BufferGeometry per species (trunk + branches + buttresses
 * + crown + fruit, a single draw-friendly mesh) for the ten Kogi
 * species defined in flora-types.ts.
 *
 * Laws of this file:
 *  - deterministic: the only randomness is the private mulberry32
 *    helper (the verbatim body of layout.makeRng, kept local so this
 *    file never imports layout) driven by SPECIES_BUILD_SEEDS —
 *    no Math.random anywhere
 *  - zero imports beyond `three` + the flora-types contract, so the
 *    build is headless-safe under bun (no geo bootstrap required)
 *  - cache law: one BufferGeometry per SpeciesId in a module-level Map;
 *    repeat calls return the identical object — build once, instance
 *    forever, nothing here ever allocates per frame
 *  - frame: origin at ground contact (bbox min y = 0), tree faces +Z
 *    (raffia walks out along +Z, fruit hangs toward +Z), total height
 *    hand-tuned within ±15% of SPECIES_META.height
 *  - vertex attributes: position / normal (computeVertexNormals) /
 *    index / color (Float32 3 vertex colors) / aSway (Float32 1, RAW
 *    0..1 weight — the material multiplies by meta.swayAmp) / aLeaf
 *    (Float32 1: 1 = crown/leaf for the weather-gold mask, 0 = wood)
 *
 * Silhouettes (flat-shaded low-poly, Kogi State field guide):
 *  neem    street umbrella · mango  compound dome · cashew  forked orchard V
 *  shea    sparse savanna  · oilpalm rosette fronds · raffia leaning river palm
 *  plantain paddle-leaf herb · iroko buttressed giant · baobab bare bottle
 *  acacia  flat-topped umbrella
 */

import * as THREE from 'three'
import type { SpeciesId } from './flora-types'

/* -------------------------------- seeded rng -------------------------------- */

/** mulberry32 — verbatim body of layout.makeRng, kept local so this
 *  module stays dependency-free (layout needs the geo bootstrap). */
function makeRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The seed each species build runs on — pinned here so the suite can
 *  cite it and re-runs stay byte-stable. Distinct primes, draw order is
 *  the builder's code order (colors first-come, then per-part jitter). */
export const SPECIES_BUILD_SEEDS: Record<SpeciesId, number> = {
  neem: 4101,
  mango: 4207,
  cashew: 4313,
  shea: 4409,
  oilpalm: 4523,
  raffia: 4639,
  plantain: 4741,
  iroko: 4861,
  baobab: 4933,
  acacia: 5059,
}

/* ------------------------------ merge builder ------------------------------- */

type SwayFn = (v: THREE.Vector3) => number

/**
 * Accumulates transformed primitives into flat arrays, painting every
 * vertex with part color + raw sway weight + leaf mask, then bakes one
 * indexed BufferGeometry. Same cache discipline as vehicles.ts:
 * everything is built once here and reused forever.
 */
class SpeciesBuilder {
  private pos: number[] = []
  private col: number[] = []
  private sway: number[] = []
  private leaf: number[] = []
  private idx: number[] = []
  private rng: () => number

  constructor(seed: number) {
    this.rng = makeRng(seed)
  }

  /** one draw of the species rng — for per-part silhouette jitter */
  next(): number {
    return this.rng()
  }

  /** jittered copy of a base color — per-part tone variation, rng-driven */
  tint(base: string, hue = 0.012, sat = 0.05, light = 0.045): THREE.Color {
    const c = new THREE.Color(base)
    c.offsetHSL((this.rng() - 0.5) * 2 * hue, (this.rng() - 0.5) * 2 * sat, (this.rng() - 0.5) * 2 * light)
    return c
  }

  /**
   * Append a primitive (we own it — disposed after the copy), transformed
   * by `m`, painted `color`, with per-vertex sway resolved from the
   * TRANSFORMED position. Non-indexed sources (icosahedra) keep their
   * per-face vertices, so blobs stay flat-faceted after
   * computeVertexNormals.
   */
  part(g: THREE.BufferGeometry, m: THREE.Matrix4, color: THREE.Color, swayFn: SwayFn, leaf: number): void {
    const p = g.attributes.position
    const base = this.pos.length / 3
    const v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m)
      this.pos.push(v.x, v.y, v.z)
      this.col.push(color.r, color.g, color.b)
      this.sway.push(swayFn(v))
      this.leaf.push(leaf)
    }
    const src = g.index
    if (src) {
      for (let i = 0; i < src.count; i++) this.idx.push(base + src.getX(i))
    } else {
      for (let i = 0; i < p.count; i++) this.idx.push(base + i)
    }
    g.dispose()
  }

  /**
   * Append one curved blade — the CityMesh.makeFrondGeometry ribbon,
   * generalized: rings of `ringVerts` vertices stepped along a drooping
   * arc (x = out, y = rise·t − droop·t²), yawed around Y and moved to
   * the attach point. `fold` raises middle ring verts (plantain paddle
   * midrib). Sway ramps swayBase → 1.0 along the blade so tips tremble
   * hardest. Winding is consistent but arbitrary — the flora material
   * renders DoubleSide (same call as CityMesh fronds).
   */
  blade(opts: {
    steps: number
    len: number
    rise: number
    droop: number
    width: (t: number) => number
    fold: number
    ringVerts: number
    yaw: number
    attach: THREE.Vector3
    color: THREE.Color
    swayBase: number
    leaf: number
  }): void {
    const { steps, len, rise, droop, width, fold, ringVerts, yaw, attach, color, swayBase, leaf } = opts
    const base = this.pos.length / 3
    const cy = Math.cos(yaw)
    const sy = Math.sin(yaw)
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = t * len
      const y = rise * t - droop * t * t
      const w = width(t)
      for (let j = 0; j < ringVerts; j++) {
        const edge = j === 0 ? -1 : j === ringVerts - 1 ? 1 : 0
        const zLocal = edge * w
        const yLocal = y + (edge === 0 ? fold : 0)
        // rotate the ring around Y, then move to the attach point
        this.pos.push(attach.x + x * cy + zLocal * sy, attach.y + yLocal, attach.z - x * sy + zLocal * cy)
        this.col.push(color.r, color.g, color.b)
        this.sway.push(swayBase + (1 - swayBase) * t)
        this.leaf.push(leaf)
      }
    }
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < ringVerts - 1; j++) {
        const a = base + i * ringVerts + j
        const b = a + ringVerts
        this.idx.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }
  }

  /** bake the merged geometry — normals recomputed over the whole mesh */
  finish(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    g.setAttribute('aSway', new THREE.Float32BufferAttribute(this.sway, 1))
    g.setAttribute('aLeaf', new THREE.Float32BufferAttribute(this.leaf, 1))
    g.setIndex(this.idx)
    g.computeVertexNormals()
    return g
  }
}

/* --------------------------------- helpers ---------------------------------- */

/** composed transform: position + euler rotation + scale (T·R·S) */
function xf(px: number, py: number, pz: number, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1): THREE.Matrix4 {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(px, py, pz),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)),
    new THREE.Vector3(sx, sy, sz),
  )
}

/** transform for a cylinder pivoted at its BASE, so it leans around the root */
function pivot(px: number, py: number, pz: number, rx: number, ry: number, rz: number, h: number): THREE.Matrix4 {
  return new THREE.Matrix4()
    .makeTranslation(px, py, pz)
    .multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)))
    .multiply(new THREE.Matrix4().makeTranslation(0, h / 2, 0))
}

/** trunk wood: 0 at the ground ramping to ≤0.25 at the top — rigid roots,
 *  supple crown; the material scales further by meta.swayAmp. Clamped ≥0
 *  so a leaning segment's base ring can never bake a negative weight. */
function trunkSway(top: number): SwayFn {
  return (v) => Math.max(0, Math.min(v.y / top, 1)) * 0.25
}

/** crown foliage: 0.3 near the trunk axis → 1.0 at the outer canopy */
function blobSway(reach: number): SwayFn {
  return (v) => 0.3 + 0.7 * Math.min(Math.hypot(v.x, v.z) / reach, 1)
}

/** closed tapered trunk from y=0 to y=h, centered on the axis */
function addTrunk(b: SpeciesBuilder, rTop: number, rBot: number, h: number, color: THREE.Color, seg = 6): void {
  b.part(new THREE.CylinderGeometry(rTop, rBot, h, seg, 1, false), xf(0, h / 2, 0), color, trunkSway(h), 0)
}

/** crown blob: icosahedron detail 1 scaled to (r, sy, r) — flat-faceted,
 *  rng-yawed so the faceting never reads stamped */
function addBlob(b: SpeciesBuilder, x: number, y: number, z: number, r: number, sy: number, color: THREE.Color, reach: number): void {
  b.part(new THREE.IcosahedronGeometry(1, 1), xf(x, y, z, 0, b.next() * Math.PI * 2, 0, r, sy, r), color, blobSway(reach), 1)
}

/** bare branch wood, pivoted at its root point, open-ended (ends hidden) */
function addBranch(b: SpeciesBuilder, x: number, y: number, z: number, rTop: number, rBot: number, h: number, rx: number, rz: number, color: THREE.Color, swayTop: number): void {
  b.part(new THREE.CylinderGeometry(rTop, rBot, h, 5, 1, true), pivot(x, y, z, rx, 0, rz, h), color, trunkSway(swayTop), 0)
}

/** fruit bunch — NOT leaf-masked (dry-season gold must never gild fruit),
 *  gentle constant sway */
function addFruit(b: SpeciesBuilder, x: number, y: number, z: number, r: number, color: THREE.Color): void {
  b.part(new THREE.IcosahedronGeometry(r, 0), xf(x, y, z), color, () => 0.5, 0)
}

/* --------------------------- the ten species builds -------------------------- */

/** 1. neem — street tree: tapered trunk + rounded umbrella of 4 fine blobs */
function buildNeem(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.neem)
  const wood = b.tint('#6a4a2e')
  addTrunk(b, 0.14, 0.22, 2.7, wood)
  const reach = 3.0
  addBlob(b, 0, 4.7, 0, 2.05, 1.5, b.tint('#4e7a36'), reach)
  addBlob(b, 1.45, 4.0, 0.85, 1.5, 1.05, b.tint('#568437'), reach)
  addBlob(b, -1.5, 4.25, -0.55, 1.45, 1.0, b.tint('#477332'), reach)
  addBlob(b, 0.2, 3.55, -1.6, 1.4, 0.95, b.tint('#517a38'), reach)
  return b.finish()
}

/** 2. mango — compound shade: stouter trunk + dense tight dome, deep
 *  green, widest near the middle */
function buildMango(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.mango)
  addTrunk(b, 0.18, 0.3, 2.5, b.tint('#5e3f26'))
  const reach = 3.1
  addBlob(b, 0, 4.55, 0, 2.1, 1.45, b.tint('#3d6b2f'), reach)
  addBlob(b, 1.55, 4.0, 0.75, 1.55, 1.1, b.tint('#446f30'), reach)
  addBlob(b, -1.5, 3.95, -0.65, 1.5, 1.08, b.tint('#3a662c'), reach)
  addBlob(b, 0.6, 3.55, -1.55, 1.4, 1.0, b.tint('#416d2f'), reach)
  addBlob(b, -0.7, 3.6, 1.5, 1.35, 0.98, b.tint('#37622a'), reach)
  return b.finish()
}

/** 3. cashew — orchard: short forked trunk (two cylinders in a V from
 *  the same root), wide lopsided canopy spread wider than tall */
function buildCashew(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.cashew)
  const wood = b.tint('#6b4b30')
  // fork pivots sit a hair above ground so the tilted base rings never
  // dip below y=0 (a 0.38 rad tilt swings the r=0.15 ring ±0.056)
  b.part(new THREE.CylinderGeometry(0.09, 0.15, 1.7, 5, 1, true), pivot(0, 0.07, 0, 0, 0, -0.38, 1.7), wood, trunkSway(3.2), 0)
  b.part(new THREE.CylinderGeometry(0.09, 0.15, 1.7, 5, 1, true), pivot(0, 0.07, 0, 0, 0, 0.38, 1.7), wood, trunkSway(3.2), 0)
  const reach = 3.4
  addBlob(b, 1.7, 3.2, 0.75, 1.65, 1.1, b.tint('#4f7c33'), reach)
  addBlob(b, -1.6, 3.35, -0.5, 1.5, 1.0, b.tint('#477331'), reach)
  addBlob(b, 0.15, 3.0, -1.35, 1.45, 0.95, b.tint('#557f36'), reach)
  return b.finish()
}

/** 4. shea — savanna: squat stout trunk, higher bare branches, SPARSE
 *  3-blob crown with visible gaps */
function buildShea(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.shea)
  const wood = b.tint('#71503a')
  addTrunk(b, 0.3, 0.4, 2.4, wood)
  addBranch(b, 0, 1.9, 0, 0.08, 0.13, 1.7, 0, 0.55, wood, 5)
  addBranch(b, 0, 1.9, 0, 0.08, 0.13, 1.7, 0, -0.55, wood, 5)
  const reach = 3.1
  addBlob(b, 1.7, 4.9, 0.3, 1.5, 1.1, b.tint('#6b8a3a'), reach)
  addBlob(b, -1.5, 5.1, -0.9, 1.45, 1.05, b.tint('#5f7d34'), reach)
  addBlob(b, -0.2, 5.9, 1.5, 1.3, 0.95, b.tint('#718e3d'), reach)
  return b.finish()
}

/** 5. oilpalm — tall straight tapering bole + rosette of 12 arched
 *  fronds + two orange fruit bunches tucked under the crown */
function buildOilpalm(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.oilpalm)
  addTrunk(b, 0.16, 0.26, 7.4, b.tint('#8a6a48'))
  for (let f = 0; f < 12; f++) {
    const yaw = (f / 12) * Math.PI * 2 + (b.next() - 0.5) * 0.22
    b.blade({
      steps: 6,
      len: 2.6 * (0.9 + b.next() * 0.2),
      rise: 1.5,
      droop: 1.7,
      width: (t) => 0.3 * (1 - 0.72 * t),
      fold: 0,
      ringVerts: 2,
      yaw,
      attach: new THREE.Vector3(0, 7.32, 0),
      color: b.tint('#4a7c34'),
      swayBase: 0.35,
      leaf: 1,
    })
  }
  addFruit(b, 0.32, 6.95, 0.4, 0.22, b.tint('#d97a1f'))
  addFruit(b, -0.36, 6.9, -0.28, 0.2, b.tint('#d97a1f'))
  return b.finish()
}

/** 6. raffia — river palm: 4 trunk segments walking out along a +Z lean
 *  (the CityMesh stacked-cylinder trick), 9 arched fronds, dark-red
 *  fruit cluster */
function buildRaffia(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.raffia)
  const wood = b.tint('#7d5f42')
  const segH = 1.42
  for (let k = 0; k < 4; k++) {
    b.part(
      new THREE.CylinderGeometry(0.16 - k * 0.018, 0.2 - k * 0.018, segH, 5, 1, true),
      pivot(0, k * 1.2, k * k * 0.16, k * 0.12, 0, 0, segH),
      wood,
      trunkSway(5.2),
      0,
    )
  }
  for (let f = 0; f < 9; f++) {
    const yaw = (f / 9) * Math.PI * 2 + (b.next() - 0.5) * 0.3
    b.blade({
      steps: 6,
      len: 2.3 * (0.9 + b.next() * 0.2),
      rise: 1.5,
      droop: 1.65,
      width: (t) => 0.28 * (1 - 0.72 * t),
      fold: 0,
      ringVerts: 2,
      yaw,
      attach: new THREE.Vector3(0, 4.85, 1.55),
      color: b.tint('#4f8038'),
      swayBase: 0.35,
      leaf: 1,
    })
  }
  addFruit(b, 0.2, 4.55, 1.85, 0.26, b.tint('#7a2230'))
  addFruit(b, -0.24, 4.45, 1.7, 0.18, b.tint('#7a2230'))
  return b.finish()
}

/** 7. plantain — NO woody trunk: green pseudostem + 6 large paddle
 *  leaves (folded-ribbon quads) + the rolled cigar-leaf bud on top */
function buildPlantain(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.plantain)
  addTrunk(b, 0.1, 0.16, 2.2, b.tint('#7a9a3a'))
  for (let f = 0; f < 6; f++) {
    const yaw = (f / 6) * Math.PI * 2 + (b.next() - 0.5) * 0.5
    b.blade({
      steps: 6,
      len: 1.6 * (0.88 + b.next() * 0.24),
      rise: 0.9 + b.next() * 0.3,
      droop: 1.5,
      width: (t) => 0.44 * (0.12 + 0.88 * Math.pow(Math.max(Math.sin(Math.PI * t), 0), 0.8)) * (1 - 0.5 * t),
      fold: 0.055,
      ringVerts: 3,
      yaw,
      attach: new THREE.Vector3(0, 2.05, 0.02),
      color: b.tint('#7aa03a'),
      swayBase: 0.3,
      leaf: 1,
    })
  }
  // tiny bud — the rolled young leaf at the growth point, aLeaf = 1
  b.part(
    new THREE.CylinderGeometry(0.035, 0.075, 0.78, 5, 1, true),
    pivot(0, 2.02, 0.02, 0.1, 0, 0.06, 0.78),
    b.tint('#6b8a30'),
    () => 0.9,
    1,
  )
  return b.finish()
}

/** 8. iroko — giant: massive bole + 6 buttress fins flaring to r~1.1,
 *  clear trunk to ~9u, then a huge broad 6-blob crown */
function buildIroko(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.iroko)
  const wood = b.tint('#5c4028')
  addTrunk(b, 0.42, 0.58, 9.4, wood)
  for (let k = 0; k < 6; k++) {
    const yaw = (k / 6) * Math.PI * 2 + (b.next() - 0.5) * 0.3
    // triangular wedge (3-sided tapering cone) flattened tangentially,
    // pushed out to r~1.1 at the flare — lifted h/2 so the base ring
    // sits exactly on y=0
    const m = new THREE.Matrix4()
      .makeTranslation(Math.cos(yaw) * 0.62, 1.4, -Math.sin(yaw) * 0.62)
      .multiply(new THREE.Matrix4().makeRotationY(yaw))
      .multiply(new THREE.Matrix4().makeScale(1, 1, 0.2))
    b.part(new THREE.CylinderGeometry(0.03, 0.46, 2.8, 3, 1, false), m, wood, (v) => Math.min(v.y / 2.8, 1) * 0.12, 0)
  }
  addBranch(b, 0, 8.6, 0, 0.09, 0.16, 2.4, 0.55, 0.3, wood, 12)
  addBranch(b, 0, 8.8, 0, 0.09, 0.15, 2.2, 0.4, -0.5, wood, 12)
  addBranch(b, 0, 8.7, 0, 0.08, 0.14, 2.1, -0.6, 0.15, wood, 12)
  const reach = 5.2
  addBlob(b, 0.3, 15.4, 0.2, 3.0, 2.55, b.tint('#3f6e2e'), reach)
  addBlob(b, 2.6, 13.4, 1.2, 2.6, 1.9, b.tint('#3a6829'), reach)
  addBlob(b, -2.7, 13.0, -0.9, 2.5, 1.8, b.tint('#43732f'), reach)
  addBlob(b, 1.2, 12.3, -2.6, 2.4, 1.7, b.tint('#3c6a2b'), reach)
  addBlob(b, -1.4, 12.0, 2.6, 2.3, 1.65, b.tint('#477631'), reach)
  addBlob(b, 0.1, 10.9, 0.1, 2.2, 1.5, b.tint('#386226'), reach)
  return b.finish()
}

/** 9. baobab — bottle trunk (3 stacked tapering segments, bulge low) +
 *  7 short stub branches + 6 SMALL sparse leaf blobs: the bare-topped
 *  silhouette is the point */
function buildBaobab(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.baobab)
  const wood = b.tint('#84654c')
  b.part(new THREE.CylinderGeometry(1.25, 1.7, 2.4, 7, 1, true), xf(0, 1.2, 0), wood, trunkSway(8), 0)
  b.part(new THREE.CylinderGeometry(0.85, 1.25, 2.1, 7, 1, true), xf(0, 2.4 + 1.05, 0), wood, trunkSway(8), 0)
  b.part(new THREE.CylinderGeometry(0.5, 0.85, 2.0, 7, 1, false), xf(0, 4.5 + 1.0, 0), wood, trunkSway(8), 0)
  // 7 stubs radiating from the shoulder — one nearly vertical carries the
  // highest tuft so the silhouette tops out honestly
  for (let k = 0; k < 7; k++) {
    const yaw = (k / 7) * Math.PI * 2 + (b.next() - 0.5) * 0.4
    const tilt = k === 0 ? 0.15 : 0.6 + b.next() * 0.3
    addBranch(b, Math.cos(yaw) * 0.35, 6.15, -Math.sin(yaw) * 0.35, 0.045, 0.09, 1.15, tilt, 0, wood, 8)
  }
  const tuft = b.tint('#5d8a46')
  for (let k = 0; k < 6; k++) {
    const yaw = (k / 6) * Math.PI * 2 + (b.next() - 0.5) * 0.5
    const rad = k === 0 ? 0.05 : 0.95 + b.next() * 0.25
    const y = k === 0 ? 7.55 : 6.9 + b.next() * 0.45
    addBlob(b, Math.cos(yaw) * rad, y, -Math.sin(yaw) * rad, 0.5, 0.42, tuft, 1.4)
  }
  return b.finish()
}

/** 10. acacia — tall slim trunk to ~5u + the classic flat-topped
 *  umbrella: two stacked squashed discs (y scaled ×0.35) */
function buildAcacia(): THREE.BufferGeometry {
  const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.acacia)
  addTrunk(b, 0.12, 0.2, 5.3, b.tint('#6a5136'))
  const reach = 3.6
  addBlob(b, 0, 5.6, 0, 3.6, 1.26, b.tint('#55823a'), reach)
  addBlob(b, 0.5, 6.2, 0.4, 2.8, 0.98, b.tint('#5d893e'), reach)
  return b.finish()
}

/* --------------------------------- public API -------------------------------- */

const BUILDERS: Record<SpeciesId, () => THREE.BufferGeometry> = {
  neem: buildNeem,
  mango: buildMango,
  cashew: buildCashew,
  shea: buildShea,
  oilpalm: buildOilpalm,
  raffia: buildRaffia,
  plantain: buildPlantain,
  iroko: buildIroko,
  baobab: buildBaobab,
  acacia: buildAcacia,
}

const cache = new Map<SpeciesId, THREE.BufferGeometry>()

/** the ONE geometry per species — repeat calls return the identical object */
export function buildSpeciesGeometry(id: SpeciesId): THREE.BufferGeometry {
  const hit = cache.get(id)
  if (hit) return hit
  const g = BUILDERS[id]()
  cache.set(id, g)
  return g
}

/** tri count of the merged species geometry (index count / 3) */
export function speciesTriCount(id: SpeciesId): number {
  const g = buildSpeciesGeometry(id)
  return g.index ? g.index.count / 3 : g.attributes.position.count / 3
}
