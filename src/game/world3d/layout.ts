/**
 * LOKOJA LIFE — 3D World Layout (Stage 3D)
 * ------------------------------------------
 * Deterministic, data-driven layout of the 3D Lokoja world.
 *
 * Every district anchor is derived from the EXISTING LOCATIONS registry
 * (same ids, same mapX/mapY grid the 2D map uses) — the 3D world and the
 * map screen can never disagree about where places are.
 *
 * Nothing in this file mutates game state and nothing here knows about
 * the economy: it is pure geometry + placement, generated once from a
 * fixed seed so every player sees the same Lokoja.
 */

import { LOCATIONS, type LokojaLocation } from '../data/locations'

/* ------------------------------ world constants ---------------------------- */

/** map grid (0–100) → world units */
export const MAP_SCALE = 3.0
/** terrain half-extent in world units */
export const WORLD_HALF = 160
/** hard walk boundary radius from the map centre */
export const WALK_BOUND = 148
/** water surface height */
export const WATER_Y = -1.1

export function worldX(mapX: number): number {
  return (mapX - 50) * MAP_SCALE
}
export function worldZ(mapY: number): number {
  return (mapY - 50) * MAP_SCALE
}

/* -------------------------------- seeded RNG ------------------------------- */

/** mulberry32 — tiny deterministic PRNG (fixed seed keeps Lokoja stable) */
export function makeRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* --------------------------------- anchors --------------------------------- */

export interface WorldAnchor {
  id: string
  location: LokojaLocation
  x: number
  z: number
  plateauH: number
  y: number
}

/** flat plateau radius so every anchor has a buildable, walkable site */
const PLATEAU_R = 13

export const ANCHORS: WorldAnchor[] = LOCATIONS.map((l) => {
  let x = worldX(l.mapX)
  let z = worldZ(l.mapY)
  // the Confluence marker sits ON the meeting of the rivers (map-accurate),
  // but you cannot stand in water — the 3D viewpoint nudges onto the bluff
  // SOUTH-WEST of the meeting point, overlooking it across the water
  if (l.id === 'confluence') {
    x -= 30
    z += 18
  }
  return { id: l.id, location: l, x, z, plateauH: 0, y: 0 }
})

export const ANCHOR_BY_ID: Record<string, WorldAnchor> = Object.fromEntries(
  ANCHORS.map((a) => [a.id, a]),
)

const MOUNT_PATTI = ANCHOR_BY_ID['mount-patti']

/* --------------------------------- rivers ---------------------------------- */

export interface RiverDef {
  id: 'niger' | 'benue' | 'outflow'
  /** world-space centreline, sampled downstream */
  points: [number, number][]
  width: number
}

/**
 * Real Lokoja geography, stylised to the world grid (north-up):
 *  • River Niger enters from the NORTH-WEST and curves east north of the
 *    city and Mount Patti.
 *  • River Benue arrives from the EAST.
 *  • They meet at the Confluence NORTH-EAST of the town.
 *  • The combined Niger flows SOUTH along the town's eastern side —
 *    Lokoja is sandwiched between the Niger (east) and Mount Patti (west).
 */
export const RIVERS: RiverDef[] = [
  {
    id: 'niger',
    width: 15,
    points: [
      [-150, -152], [-116, -144], [-88, -134], [-58, -124],
      [-24, -118], [8, -116], [32, -115], [54, -114],
    ],
  },
  {
    id: 'benue',
    width: 13,
    points: [[160, -122], [122, -118], [86, -116], [54, -114]],
  },
  {
    id: 'outflow',
    width: 17,
    points: [
      [54, -114], [60, -90], [64, -62], [66, -30], [66, 4],
      [62, 40], [58, 76], [54, 110], [52, 140], [52, 162],
    ],
  },
]

/** distance from (x,z) to a polyline, plus progress along it (0..1) */
function polylineDistance(x: number, z: number, pts: [number, number][]): { d: number } {
  let best = Infinity
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const dx = bx - ax
    const dz = bz - az
    const len2 = dx * dx + dz * dz
    let t = len2 === 0 ? 0 : ((x - ax) * dx + (z - az) * dz) / len2
    t = Math.max(0, Math.min(1, t))
    const px = ax + dx * t
    const pz = az + dz * t
    const d = Math.hypot(x - px, z - pz)
    if (d < best) best = d
  }
  return { d: best }
}

/** distance to every river centreline (min), for carving + collision */
export function riverInfo(x: number, z: number): { d: number; halfWidth: number } {
  let d = Infinity
  let halfWidth = 0
  for (const r of RIVERS) {
    const { d: rd } = polylineDistance(x, z, r.points)
    if (rd < d) {
      d = rd
      halfWidth = r.width / 2
    }
  }
  return { d, halfWidth }
}

/* ---------------------------------- roads ---------------------------------- */

export type RoadPath = [number, number][]

/**
 * The road graph — named after the real Lokoja road spine, expressed in
 * world coordinates. Same connectivity the 2D map implies.
 */
export const ROADS: RoadPath[] = [
  // 0: IBB Way — food strip ↔ kpata ↔ ganaja junction (the E-W spine)
  [[-18, 15], [0, 10], [18, 6], [30, 12], [42, 24]],
  // 1: town spine — kpata ↔ home ↔ motor park (Murtala Mohammed Way)
  [[18, 6], [10, 26], [-6, 48], [4, 66], [18, 84]],
  // 2: Ganaja Road — ganaja junction ↘ river road, hugging the west bank
  [[42, 24], [46, 34], [48, 46], [46, 58], [44, 70], [44, 82]],
  // 3: Nataco/university road — ganaja junction ↔ university area
  [[42, 24], [46, -10], [44, -44], [36, -78]],
  // 4: Confluence road — university area ↗ the bluff viewpoint
  [[36, -78], [28, -88], [24, -96]],
  // 5: Kogi Bridge road — ganaja junction → east across the Niger
  [[42, 24], [54, 28], [66, 30], [80, 30], [96, 28]],
  // 6: southern bypass — motor park → east across the Niger (Felele side)
  [[18, 84], [34, 92], [48, 96], [62, 94], [76, 88]],
  // 7: Patti foot road — kpata ↔ historic Lokoja
  [[18, 6], [2, 0], [-30, -14], [-60, -24]],
  // 8: Patti trail — switchbacks up the mount to the summit
  [[-60, -24], [-70, -30], [-80, -38], [-88, -50], [-84, -60], [-94, -56], [-100, -50], [-102, -48]],
  // 9: GRA road — historic ↔ government area
  [[-60, -24], [-42, -44], [-18, -60]],
  // 10: GRA ↔ IBB Way link (the western spine)
  [[-18, -60], [-20, -24], [-18, 15]],
  // 11: Felele road — motor park → southern rim
  [[18, 84], [24, 100], [28, 116], [32, 134]],
]

export function roadDistance(x: number, z: number): number {
  let d = Infinity
  for (const r of ROADS) {
    const { d: rd } = polylineDistance(x, z, r)
    if (rd < d) d = rd
  }
  return d
}

/* --------------------------------- terrain --------------------------------- */

function smoothstep(a: number, b: number, t: number): number {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

/** deterministic layered sine noise — no dependencies, stable forever */
function baseNoise(x: number, z: number): number {
  return (
    Math.sin(x * 0.045 + z * 0.02) * 0.45 +
    Math.sin(x * 0.017 - z * 0.051 + 1.7) * 0.6 +
    Math.sin((x + z) * 0.028 + 4.1) * 0.35
  )
}

// plateau heights must exist before heightAt is ever called
for (const a of ANCHORS) {
  a.plateauH = Math.max(0.4, baseNoise(a.x, a.z) * 0.55 + (a.id === 'mount-patti' ? 30 : 0))
}

/**
 * Terrain height at any world position.
 * Layers: rolling base → Mount Patti mound → anchor plateaus → river carving.
 * The SAME function drapes roads/buildings and grounds the player,
 * so nothing can float or sink.
 */
export function heightAt(x: number, z: number): number {
  // rolling savanna base
  let h = baseNoise(x, z) * 0.55

  // gentle rise toward the world rim (natural boundary)
  const rim = Math.hypot(x, z)
  h += smoothstep(WALK_BOUND - 26, WALK_BOUND + 14, rim) * 14

  // Mount Patti — the guardian ridge (west). Bigger and steeper: the real
  // Patti plateau dominates the town's skyline
  const pdx = x - (MOUNT_PATTI.x - 4)
  const pdz = z - (MOUNT_PATTI.z - 2)
  const pd = Math.hypot(pdx, pdz)
  const pattiRise = smoothstep(78, 8, pd) // 1 at summit → 0 at the plains
  h += Math.pow(pattiRise, 1.3) * 30

  // anchor plateaus — flat buildable/walkable sites
  for (const a of ANCHORS) {
    const d = Math.hypot(x - a.x, z - a.z)
    if (d < PLATEAU_R * 1.9) {
      const w = 1 - smoothstep(PLATEAU_R * 0.62, PLATEAU_R * 1.9, d)
      h = h * (1 - w) + a.plateauH * w
    }
  }

  // river carving — smooth banks down to below water level
  const { d, halfWidth } = riverInfo(x, z)
  if (d < halfWidth + 9) {
    const carve = 1 - smoothstep(halfWidth - 2, halfWidth + 9, d)
    h = h * (1 - carve) + (WATER_Y - 1.7) * carve
  }

  return h
}

// final anchor ground heights
for (const a of ANCHORS) {
  a.y = heightAt(a.x, a.z)
}

/* ------------------------------ bridge crossings ---------------------------- */

export interface BridgeDef {
  x: number
  z: number
  y: number
  /** world yaw so the deck aligns with the road */
  rotY: number
  length: number
  width: number
}

function findCrossings(): BridgeDef[] {
  const bridges: BridgeDef[] = []
  for (const road of ROADS) {
    for (let i = 0; i < road.length - 1; i++) {
      const [ax, az] = road[i]
      const [bx, bz] = road[i + 1]
      const segLen = Math.hypot(bx - ax, bz - az)
      const steps = Math.max(2, Math.round(segLen / 2))
      for (let s = 0; s <= steps; s++) {
        const t = s / steps
        const x = ax + (bx - ax) * t
        const z = az + (bz - az) * t
        const { d, halfWidth } = riverInfo(x, z)
        if (d < halfWidth + 1.5) {
          const dirX = (bx - ax) / segLen
          const dirZ = (bz - az) / segLen
          // walk along the road direction until out of the water
          let u = 0
          while (u < 60 && riverInfo(x + dirX * u, z + dirZ * u).d < halfWidth + 2) u += 1.2
          const hi = u
          u = 0
          while (u > -60 && riverInfo(x + dirX * u, z + dirZ * u).d < halfWidth + 2) u -= 1.2
          const lo = u
          const midU = (lo + hi) / 2
          const cx = x + dirX * midU
          const cz = z + dirZ * midU
          bridges.push({
            x: cx,
            z: cz,
            y: WATER_Y + 1.5,
            rotY: Math.atan2(dirX, dirZ),
            length: hi - lo + 6,
            width: 7.5,
          })
          break // one bridge per road segment
        }
      }
    }
  }
  // de-duplicate bridges that ended up within 6 units of each other
  const out: BridgeDef[] = []
  for (const b of bridges) {
    if (!out.some((o) => Math.hypot(o.x - b.x, o.z - b.z) < 6)) out.push(b)
  }
  return out
}

export const BRIDGES: BridgeDef[] = findCrossings()

/* -------------------------------- districts -------------------------------- */

export type DistrictKind =
  | 'home' | 'market' | 'food' | 'junction' | 'park'
  | 'landmark-river' | 'landmark-hill' | 'historic' | 'gov' | 'university'

const KIND_BY_ID: Record<string, DistrictKind> = {
  home: 'home',
  'kpata-market': 'market',
  'ganaja-junction': 'junction',
  confluence: 'landmark-river',
  'mount-patti': 'landmark-hill',
  'historic-lokoja': 'historic',
  'government-area': 'gov',
  'university-area': 'university',
  'food-area': 'food',
  'transport-area': 'park',
}

export interface District {
  id: string
  kind: DistrictKind
  x: number
  z: number
  y: number
  radius: number
}

export const DISTRICTS: District[] = ANCHORS.map((a) => ({
  id: a.id,
  kind: KIND_BY_ID[a.id] ?? 'home',
  x: a.x,
  z: a.z,
  y: a.y,
  radius: a.id === 'mount-patti' || a.id === 'confluence' ? 20 : 16,
}))

/* ------------------------------- buildings --------------------------------- */

export type BuildingKind = 'house' | 'shop' | 'block' | 'shed' | 'colonial' | 'hostel'

export interface BuildingDef {
  x: number
  z: number
  y: number
  w: number
  d: number
  h: number
  rotY: number
  kind: BuildingKind
  /** palette index for walls */
  tone: number
  roof: 'hip' | 'flat' | 'shed'
  roofTone: number
}

/** Nigerian neighbourhood wall palette — cream, ochre, terracotta, teal-wash… */
export const WALL_TONES = ['#e8dcc3', '#d9b98a', '#c96f3b', '#9fb98a', '#b9a06a', '#d8cbb0', '#a8683f', '#cbb682']
export const ROOF_TONES = ['#8a4a2a', '#6e4530', '#7a6a55', '#96543a', '#5a6e5c', '#8a3a28']

function isClearOf(x: number, z: number, r: number): boolean {
  if (riverInfo(x, z).d < 16) return false
  if (roadDistance(x, z) < r + 3.4) return false
  return true
}

function buildDistrictBuildings(d: District, rng: () => number): BuildingDef[] {
  const out: BuildingDef[] = []
  const push = (b: Omit<BuildingDef, 'y'>) => out.push({ ...b, y: heightAt(b.x, b.z) })

  const tryPlace = (
    radiusMin: number,
    radiusMax: number,
    w: number,
    dd: number,
    h: number,
    kind: BuildingKind,
    roof: BuildingDef['roof'],
    rotJitter = 0.5,
  ): void => {
    for (let attempt = 0; attempt < 14; attempt++) {
      const ang = rng() * Math.PI * 2
      const rad = radiusMin + rng() * (radiusMax - radiusMin)
      const x = d.x + Math.cos(ang) * rad
      const z = d.z + Math.sin(ang) * rad
      if (Math.hypot(x, z) > WALK_BOUND - 6) continue
      if (!isClearOf(x, z, Math.max(w, dd) * 0.72)) continue
      // avoid overlapping earlier buildings
      if (out.some((b) => Math.hypot(b.x - x, b.z - z) < (Math.max(b.w, b.d) + Math.max(w, dd)) * 0.62)) continue
      push({
        x, z, w, d: dd, h,
        rotY: ang + Math.PI / 2 + (rng() - 0.5) * rotJitter,
        kind, tone: Math.floor(rng() * WALL_TONES.length),
        roof,
        roofTone: Math.floor(rng() * ROOF_TONES.length),
      })
      return
    }
  }

  switch (d.kind) {
    case 'home': {
      // the player's place — proud compound beside the anchor clearing
      // (roads terminate at the anchor, so the centre stays open)
      push({ x: d.x + 6.5, z: d.z - 5, w: 6.4, d: 5.4, h: 3.4, rotY: -0.5, kind: 'house', tone: 5, roof: 'hip', roofTone: 0 })
      for (let i = 0; i < 3; i++) tryPlace(11, 15, 4.6 + rng() * 1.6, 4 + rng(), 2.9, 'house', 'hip')
      break
    }
    case 'market': {
      // permanent sheds beside the clearing; dense stall rows are placed separately
      push({ x: d.x - 10, z: d.z - 6, w: 9, d: 5.6, h: 3.8, rotY: 0.4, kind: 'shed', tone: 2, roof: 'shed', roofTone: 4 })
      push({ x: d.x + 11, z: d.z + 7, w: 8, d: 5, h: 3.4, rotY: -0.3, kind: 'shed', tone: 1, roof: 'shed', roofTone: 3 })
      for (let i = 0; i < 3; i++) tryPlace(12, 15.5, 4.4, 4, 3, 'shop', 'flat')
      break
    }
    case 'food': {
      for (let i = 0; i < 3; i++) tryPlace(10.5, 14.5, 4.6, 4.2, 3.1, 'shop', 'flat')
      for (let i = 0; i < 2; i++) tryPlace(11, 15, 4, 3.6, 2.7, 'house', 'hip')
      break
    }
    case 'junction': {
      for (let i = 0; i < 5; i++) tryPlace(10.5, 15.5, 5 + rng() * 2.4, 4.4, 3.6 + rng() * 1.4, 'shop', 'flat')
      break
    }
    case 'park': {
      push({ x: d.x, z: d.z, w: 12, d: 6.4, h: 4, rotY: 0.2, kind: 'shed', tone: 3, roof: 'shed', roofTone: 1 })
      for (let i = 0; i < 2; i++) tryPlace(12, 15, 4.8, 4, 3, 'shop', 'flat')
      break
    }
    case 'historic': {
      // colonial relics — pale walls, dark hip roofs
      push({ x: d.x - 6, z: d.z + 2, w: 8.4, d: 6, h: 4.6, rotY: 0.9, kind: 'colonial', tone: 0, roof: 'hip', roofTone: 2 })
      push({ x: d.x + 7, z: d.z - 4, w: 6.6, d: 5.4, h: 4.1, rotY: -0.6, kind: 'colonial', tone: 5, roof: 'hip', roofTone: 2 })
      tryPlace(11, 14.5, 5.4, 4.8, 3.6, 'colonial', 'hip', 0.3)
      break
    }
    case 'gov': {
      push({ x: d.x, z: d.z, w: 12.5, d: 7.5, h: 6.2, rotY: 0, kind: 'block', tone: 6, roof: 'flat', roofTone: 4 })
      tryPlace(12, 15, 6, 5, 4.4, 'block', 'flat', 0.2)
      break
    }
    case 'university': {
      push({ x: d.x - 5, z: d.z + 3, w: 10.5, d: 6, h: 5.4, rotY: 0.3, kind: 'hostel', tone: 4, roof: 'flat', roofTone: 5 })
      for (let i = 0; i < 3; i++) tryPlace(10.5, 15, 4.4, 4, 3.1, 'shop', 'flat')
      break
    }
    case 'landmark-river':
    case 'landmark-hill':
      // landmarks get bespoke anchor structures (CityMesh), not generic fill
      break
  }
  return out
}

export const BUILDINGS: BuildingDef[] = DISTRICTS.flatMap((d) =>
  buildDistrictBuildings(d, makeRng(1860 + d.x * 7 + d.z)),
)

/* ----------------------------- interior doors ------------------------------- */

/**
 * INC 4 — exterior doors into the enterable interiors. Each door is
 * derived FROM the building it belongs to (front-face centre, pushed
 * 0.95u outward along the wall normal) so the prop and the geometry
 * can never drift apart. Fallback: a doorway arch offset from the
 * district anchor when the seeded building placement failed.
 */
export interface DoorDef {
  /** interior id this door leads into (INTERIOR_BY_ID) */
  interiorId: string
  locationId: string
  x: number
  z: number
  y: number
  /** yaw facing OUTWARD from the building wall */
  rotY: number
}

function doorFor(
  interiorId: string,
  locationId: string,
  b: BuildingDef | null,
  fallback: { dx: number; dz: number },
): DoorDef {
  if (b) {
    const out = 0.95 + b.d / 2
    const x = b.x + Math.sin(b.rotY) * out
    const z = b.z + Math.cos(b.rotY) * out
    return { interiorId, locationId, x, z, y: heightAt(x, z), rotY: b.rotY }
  }
  const a = ANCHOR_BY_ID[locationId]
  const x = a.x + fallback.dx
  const z = a.z + fallback.dz
  return { interiorId, locationId, x, z, y: heightAt(x, z), rotY: 0 }
}

export const DOORS: DoorDef[] = (() => {
  // the player's house — pushed directly at this exact offset in the home district
  const homeA = ANCHOR_BY_ID['home']
  const homeHouse =
    BUILDINGS.find(
      (b) => b.kind === 'house' && b.tone === 5 && Math.hypot(b.x - (homeA.x + 6.5), b.z - (homeA.z - 5)) < 1,
    ) ?? null
  // Mama's buka — the first shop placed in the food district
  const foodShop = BUILDINGS.find(
    (b) => b.kind === 'shop' && Math.hypot(b.x - ANCHOR_BY_ID['food-area'].x, b.z - ANCHOR_BY_ID['food-area'].z) < 16,
  ) ?? null
  // the provision store — the first shed in the market district
  const marketShed = BUILDINGS.find(
    (b) => b.kind === 'shed' && Math.hypot(b.x - ANCHOR_BY_ID['kpata-market'].x, b.z - ANCHOR_BY_ID['kpata-market'].z) < 16,
  ) ?? null
  return [
    doorFor('home-interior', 'home', homeHouse, { dx: 5, dz: 2 }),
    doorFor('mamas-kitchen', 'food-area', foodShop, { dx: -4, dz: -4.5 }),
    doorFor('kpata-shop', 'kpata-market', marketShed, { dx: -10, dz: -6 }),
  ]
})()

/* --------------------------------- trees ----------------------------------- */

export type TreeKind = 'tree' | 'palm'

export interface TreeDef {
  x: number
  z: number
  y: number
  scale: number
  tone: number
  kind: TreeKind
}

export const TREE_TONES = ['#3d6b2f', '#4c7a2e', '#5d8a37', '#6ea344', '#446e3a']
export const PALM_TONES = ['#5d8a37', '#6ea344', '#4c7a2e']

function scatterTrees(): TreeDef[] {
  const rng = makeRng(51197)
  const out: TreeDef[] = []
  let guard = 0
  while (out.length < 280 && guard < 9000) {
    guard++
    const x = (rng() * 2 - 1) * (WALK_BOUND - 4)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 4)
    const y = heightAt(x, z)
    if (y > 24) continue // sparse above the Patti slopes' treeline
    const nearRiver = riverInfo(x, z)
    if (nearRiver.d < 13) continue
    if (roadDistance(x, z) < 6.5) continue
    if (Math.hypot(x, z) > WALK_BOUND) continue
    // keep anchor sites readable
    if (ANCHORS.some((a) => Math.hypot(a.x - x, a.z - z) < 13)) continue
    if (BUILDINGS.some((b) => Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.75 + 2)) continue
    // denser around Patti + riversides, thinner downtown
    const pattiBoost = Math.max(0, 1 - Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z) / 90)
    if (rng() > 0.34 + pattiBoost * 0.5) continue
    // riverside riverine vegetation — palms line the watersides
    const riverside = nearRiver.d < nearRiver.halfWidth + 26
    out.push({
      x, z, y,
      scale: 0.75 + rng() * 0.8,
      tone: Math.floor(rng() * (riverside ? PALM_TONES.length : TREE_TONES.length)),
      kind: riverside && rng() < 0.55 ? 'palm' : 'tree',
    })
  }
  return out
}

export const TREES: TreeDef[] = scatterTrees()

/* --------------------------------- grass ----------------------------------- */

/**
 * Instanced savanna grass tufts — the Lokoja ground cover. Placed in the
 * layout (not the component) so the scatter is deterministic and testable.
 * Tone encodes moisture: lush green near the rivers, dry savanna gold away
 * from them (the real Guinea-savanna gradient around Lokoja).
 */
export interface GrassDef {
  x: number
  z: number
  y: number
  scale: number
  tone: number
}

export const GRASS_TONES = ['#7a9a3a', '#8aa844', '#9db050', '#b3b45c', '#c2b45f']

export const GRASS: GrassDef[] = (() => {
  const rng = makeRng(90210)
  const out: GrassDef[] = []
  let guard = 0
  while (out.length < 3200 && guard < 30000) {
    guard++
    const x = (rng() * 2 - 1) * (WALK_BOUND - 2)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 2)
    const y = heightAt(x, z)
    if (y < WATER_Y + 0.4) continue
    if (y > 26) continue // rocky Patti crown stays bare
    // steep ground sheds the terrain mesh's faceting — tufts would float
    const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
    if (slope > 0.45) continue
    const river = riverInfo(x, z)
    if (river.d < river.halfWidth + 2.5) continue
    if (roadDistance(x, z) < 5.2) continue
    if (ANCHORS.some((a) => Math.hypot(a.x - x, a.z - z) < 12.5)) continue
    if (BUILDINGS.some((b) => Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.7 + 1.5)) continue
    // moisture gradient — greener close to water
    const moisture = Math.max(0, 1 - river.d / 60)
    const tone = Math.min(
      GRASS_TONES.length - 1,
      Math.floor((1 - moisture) * GRASS_TONES.length * (0.75 + rng() * 0.5)),
    )
    // sink tufts: the crown pokes out, the base is safely under the mesh
    out.push({ x, z, y: y - 0.35 * slope - 0.1, scale: 0.7 + rng() * 0.7, tone })
  }
  return out
})()

/* ---------------------------------- lamps ----------------------------------- */

export interface LampDef {
  x: number
  z: number
  y: number
}

export const LAMPS: LampDef[] = (() => {
  const out: LampDef[] = []
  for (const road of ROADS) {
    for (let i = 0; i < road.length - 1; i++) {
      const [ax, az] = road[i]
      const [bx, bz] = road[i + 1]
      const len = Math.hypot(bx - ax, bz - az)
      const steps = Math.floor(len / 17)
      for (let s = 0; s < steps; s++) {
        const t = (s + 0.5) / steps
        const x = ax + (bx - ax) * t + 4.2
        const z = az + (bz - az) * t + 2.2
        if (riverInfo(x, z).d < 12) continue
        out.push({ x, z, y: heightAt(x, z) })
      }
    }
  }
  return out
})()

/* ---------------------------------- stalls ---------------------------------- */

export interface StallDef {
  x: number
  z: number
  y: number
  rotY: number
  tone: number
}

export const STALL_TONES = ['#c94f2e', '#d99a2b', '#2e7d5b', '#b03a5b', '#3a6ea3', '#8a5aa3']

/** market + food-strip stalls — the colourful heart of Kpata */
export const STALLS: StallDef[] = (() => {
  const rng = makeRng(4402)
  const out: StallDef[] = []
  const rows: { cx: number; cz: number; n: number; spread: number; rot: number }[] = [
    { cx: ANCHOR_BY_ID['kpata-market'].x, cz: ANCHOR_BY_ID['kpata-market'].z, n: 12, spread: 12.5, rot: 0.35 },
    { cx: ANCHOR_BY_ID['food-area'].x, cz: ANCHOR_BY_ID['food-area'].z, n: 9, spread: 10.5, rot: -0.5 },
    { cx: ANCHOR_BY_ID['ganaja-junction'].x, cz: ANCHOR_BY_ID['ganaja-junction'].z, n: 6, spread: 9, rot: 1.1 },
  ]
  for (const row of rows) {
    for (let i = 0; i < row.n; i++) {
      const gx = (i % 4) - 1.5
      const gz = Math.floor(i / 4) - 1
      const x = row.cx + Math.cos(row.rot) * (gx * 4.6) - Math.sin(row.rot) * (gz * 5.4)
      const z = row.cz + Math.sin(row.rot) * (gx * 4.6) + Math.cos(row.rot) * (gz * 5.4)
      if (roadDistance(x, z) < 4.5) continue
      out.push({
        x, z, y: heightAt(x, z),
        rotY: row.rot + (rng() - 0.5) * 0.3,
        tone: Math.floor(rng() * STALL_TONES.length),
      })
    }
  }
  return out
})()

/* ------------------------------- NPC walk zones ------------------------------ */

export interface NpcZone {
  /** stable location id this zone belongs to (joins NPCS registry) */
  locationId: string
  x: number
  z: number
  y: number
  radius: number
}

/** NPCs stroll around the livelier districts (not the lonely landmarks). */
export const NPC_ZONES: NpcZone[] = [
  'kpata-market', 'food-area', 'ganaja-junction', 'home', 'transport-area', 'university-area', 'historic-lokoja',
].map((id) => {
  const a = ANCHOR_BY_ID[id]
  return { locationId: id, x: a.x, z: a.z, y: a.y, radius: 11 }
})

/* ---------------------------- points of interest ----------------------------- */

/**
 * Physical interactable props that are NOT location anchors — extra
 * "eyes-on" objects that deep-link into the real location panel
 * (e.g. the Kpata Market job board). Ids are namespaced `poi:` in the
 * HUD so they never collide with location anchor ids.
 */
export interface PoiDef {
  id: string
  kind: 'jobboard'
  /** the location whose panel this prop opens */
  locationId: string
  x: number
  z: number
  y: number
  rotY: number
}

export const POINTS_OF_INTEREST: PoiDef[] = (
  [
    { locationId: 'kpata-market', dx: 3.4, dz: 3.2 },
    { locationId: 'government-area', dx: -3.6, dz: 3.4 },
    { locationId: 'food-area', dx: -3.2, dz: -3.6 },
    { locationId: 'transport-area', dx: 3.6, dz: 3.2 },
  ] as { locationId: string; dx: number; dz: number }[]
).map(({ locationId, dx, dz }) => {
  const a = ANCHOR_BY_ID[locationId]
  const x = a.x + dx
  const z = a.z + dz
  return {
    id: `board-${locationId}`,
    kind: 'jobboard' as const,
    locationId,
    x,
    z,
    y: heightAt(x, z),
    rotY: Math.atan2(a.x - x, a.z - z), // face the plaza
  }
})

/* ------------------------------- traffic loops ------------------------------- */

/** concatenate road point lists into closed loops for keke/okada traffic */
export const TRAFFIC_LOOPS: [number, number][][] = [
  // loop A: food strip ↔ kpata ↔ ganaja junction ↔ food strip (IBB ring)
  [
    ...ROADS[0],
    ...ROADS[0].slice().reverse().slice(1),
  ],
  // loop B: kpata ↔ home ↔ motor park ↔ bypass ↔ back (southern ring)
  [
    ...ROADS[1],
    ...ROADS[6],
    ...ROADS[6].slice().reverse().slice(1),
    ...ROADS[1].slice().reverse().slice(1),
  ],
  // loop C: kpata ↔ historic ↔ GRA ↔ food strip ↔ kpata (western ring)
  [
    ...ROADS[7],
    ...ROADS[9],
    ...ROADS[10],
    ...ROADS[0].slice(0, 3),
  ],
  // loop D: ganaja junction ↔ university ↔ confluence viewpoint (out + back)
  [
    ...ROADS[3],
    ...ROADS[4],
    ...ROADS[4].slice().reverse().slice(1),
    ...ROADS[3].slice().reverse().slice(1),
  ],
]
