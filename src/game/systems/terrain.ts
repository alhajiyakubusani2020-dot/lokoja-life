/**
 * LOKOJA LIFE — 3D Terrain Engine (Stage 3.5)
 * ---------------------------------------------
 * The ONE deterministic height field for the whole 3D world.
 * Terrain mesh, building placement, roads, vehicles, NPCs and the
 * player avatar all sample the same functions — nothing else may
 * guess a ground height.
 *
 * Geography mirrors the Stage 2 stylised 2D map (MapCanvas):
 *   • River Niger enters from the NORTH-WEST, sweeps past Mount
 *     Patti's east side, curves east along the south of the city and
 *     meets the Benue at the famous Confluence (SE), then flows south.
 *   • River Benue arrives from the EAST.
 *   • Mount Patti is the big hill mass WEST of the Niger.
 *
 * Coordinates:
 *   map space   0–100 grid (the same grid locations.ts uses)
 *   world space 1 map unit = WORLD_SCALE units; (50,50) maps to (0,0)
 */

/* ------------------------------- constants -------------------------------- */

/** World units per map unit. City core spans ≈ 400×400 world units. */
export const WORLD_SCALE = 4

/** Water surface height (riverbeds carve below this). */
export const WATER_LEVEL = 1.05

/** Riverbed depth at the centre of a river. */
export const RIVER_DEPTH = 2.6

/** Base land height before noise/hills (district plateaus sit near this). */
export const BASE_LAND = 3.5

/** Mount Patti peak height (world units above 0). */
export const PATTI_HEIGHT = 38

/** World bounds — the playable/camera clamped area (Stage 3.6: expanded). */
export const WORLD_BOUNDS = { minX: -300, maxX: 300, minZ: -300, maxZ: 300 }

/* --------------------------------- rivers --------------------------------- */

/** Polylines in MAP space (0–100 grid) — matching MapCanvas geography.
 *  Exported so world3d.ts reuses the EXACT same lines (no drift).
 *  Mid-course points sit slightly west of the 2D stroke so Kpata Market
 *  keeps dry ground, matching the real market's inland position. */
export const RIVER_NIGER_MAP: Array<[number, number]> = [
  [-4, 19], [4, 24], [12, 30], [20, 38], [23, 44.5], [25.5, 53.5],
  [28, 62.5], [31, 69.5], [40, 77], [50, 83], [62, 85.5], [72, 84.5],
  [78.5, 80], [81.5, 74], [82.5, 68.5],
]
export const RIVER_MERGED_MAP: Array<[number, number]> = [
  [82.5, 68.5], [81.5, 76], [80.5, 85], [79.5, 94], [79, 104],
]
export const RIVER_BENUE_MAP: Array<[number, number]> = [
  [104, 49], [96, 52.5], [89, 56.5], [84.5, 62], [82.5, 68.5],
]

/** Half-width of each river in MAP units (the 2D map stroke ≈ 5.5/4.5/6.5). */
export const RIVER_WIDTHS = {
  niger: 3.1, // map units half-width → ≈ 25 world-unit-wide majestic Niger
  benue: 2.5,
  merged: 3.4,
}

/** The world-famous Confluence — where the two rivers kiss (map space). */
export const CONFLUENCE_MAP: [number, number] = [82.5, 68.5]
export const CONFLUENCE_RADIUS_MAP = 4.5

/* ------------------------------ seeded noise ------------------------------ */

/** Deterministic 2D value noise — same world on every device & reload. */
function hash2(x: number, y: number, seed: number): number {
  let h = seed + x * 374761393 + y * 668265263
  h = (h ^ (h >> 13)) * 1274126177
  h = h ^ (h >> 16)
  // map to 0..1
  return (h >>> 0) / 4294967295
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t)
}

/** Value noise in 0..1 with bilinear smoothing. Grid coords are floats. */
function valueNoise(x: number, y: number, seed = 7): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const a = hash2(xi, yi, seed)
  const b = hash2(xi + 1, yi, seed)
  const c = hash2(xi, yi + 1, seed)
  const d = hash2(xi + 1, yi + 1, seed)
  const u = smooth(xf)
  const v = smooth(yf)
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
}

/** Fractal noise 0..1 (3 octaves). */
function fbm(x: number, y: number, seed = 7): number {
  let sum = 0
  let amp = 0.55
  let freq = 1
  for (let o = 0; o < 3; o++) {
    sum += valueNoise(x * freq, y * freq, seed + o * 131) * amp
    amp *= 0.5
    freq *= 2.13
  }
  return sum / (0.55 + 0.275 + 0.1375)
}

/* ------------------------------ map utilities ----------------------------- */

/** Convert map grid coordinates (0–100) to world XZ. */
export function mapToWorld(mapX: number, mapY: number): { x: number; z: number } {
  return { x: (mapX - 50) * WORLD_SCALE, z: (mapY - 50) * WORLD_SCALE }
}

/** Convert world XZ back to map grid coordinates. */
export function worldToMap(x: number, z: number): { mapX: number; mapZ: number } {
  return { mapX: x / WORLD_SCALE + 50, mapZ: z / WORLD_SCALE + 50 }
}

/** Squared distance from point (map space) to a map-space segment. */
function segDistSqMap(
  px: number, pz: number,
  ax: number, az: number,
  bx: number, bz: number,
): number {
  const dx = bx - ax
  const dz = bz - az
  const lenSq = dx * dx + dz * dz
  let t = lenSq > 0 ? ((px - ax) * dx + (pz - az) * dz) / lenSq : 0
  t = Math.max(0, Math.min(1, t))
  const cx = ax + dx * t
  const cz = az + dz * t
  const ex = px - cx
  const ez = pz - cz
  return ex * ex + ez * ez
}

/** Distance (map units) from a map-space point to a map-space polyline. */
function polylineDistMap(px: number, pz: number, pts: Array<[number, number]>): number {
  let best = Infinity
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const d = segDistSqMap(px, pz, ax, az, bx, bz)
    if (d < best) best = d
  }
  return Math.sqrt(best)
}

/* --------------------------------- rivers --------------------------------- */

export interface RiverInfo {
  /** distance to the centreline, in map units */
  distMap: number
  /** half-width of that river at this point, in map units */
  halfWidthMap: number
}

/**
 * Which river is nearest and how far — used for carving AND for
 * keeping buildings, roads and trees off the water.
 */
export function riverInfoAt(mapX: number, mapY: number): RiverInfo {
  const dNiger = polylineDistMap(mapX, mapY, RIVER_NIGER_MAP)
  const dBenue = polylineDistMap(mapX, mapY, RIVER_BENUE_MAP)
  const dMerged = polylineDistMap(mapX, mapY, RIVER_MERGED_MAP)

  let distMap = dNiger
  let halfWidthMap = RIVER_WIDTHS.niger
  if (dBenue < distMap) {
    distMap = dBenue
    halfWidthMap = RIVER_WIDTHS.benue
  }
  if (dMerged < distMap) {
    distMap = dMerged
    halfWidthMap = RIVER_WIDTHS.merged
  }

  // confluence basin: both rivers widen where they meet
  const dConfluence = Math.hypot(mapX - CONFLUENCE_MAP[0], mapY - CONFLUENCE_MAP[1])
  if (dConfluence < CONFLUENCE_RADIUS_MAP) {
    const widen = 1 + 0.55 * (1 - dConfluence / CONFLUENCE_RADIUS_MAP)
    halfWidthMap *= widen
    // distance to the confluence point itself can be nearer than to lines
    distMap = Math.min(distMap, dConfluence)
  }

  return { distMap, halfWidthMap }
}

/** Distance from map point to the nearest river centreline (map units). */
export function riverDistanceMap(mapX: number, mapY: number): number {
  return riverInfoAt(mapX, mapY).distMap
}

/** True when a map point is on open water — consistent with the visible
 *  water plane: water is exactly where the carved terrain sits below it. */
export function isWaterMap(mapX: number, mapY: number): boolean {
  const { x, z } = mapToWorld(mapX, mapY)
  return terrainHeight(x, z) < WATER_LEVEL + 0.12
}

/* -------------------------------- the hill -------------------------------- */

/**
 * Mount Patti massif — a cluster of gaussian hills west of the Niger,
 * highest peak ≈ PATTI_HEIGHT. Real Patti rises steeply from the plain.
 */
const PATTI_PEAKS: Array<{ mapX: number; mapY: number; radiusMap: number; height: number }> = [
  { mapX: 16.5, mapY: 18.5, radiusMap: 12.5, height: PATTI_HEIGHT }, // main summit
  { mapX: 9.5, mapY: 25.5, radiusMap: 9, height: PATTI_HEIGHT * 0.62 }, // west shoulder
  { mapX: 23.5, mapY: 13.5, radiusMap: 8.5, height: PATTI_HEIGHT * 0.55 }, // NE spur
  { mapX: 5.5, mapY: 12.5, radiusMap: 8, height: PATTI_HEIGHT * 0.48 }, // NW ridge
  { mapX: 11.5, mapY: 33.5, radiusMap: 7, height: PATTI_HEIGHT * 0.34 }, // southern foot
]

/**
 * Stage 3.6 frontier hills — scenery beyond the ten districts so the
 * expanded world has a horizon: a ridge north-east of the Adankolo road,
 * far-east bluffs over the Benue, and wild hill country across the Niger.
 * All sit clear of roads, locations and both rivers (checked in tests).
 */
const FRONTIER_PEAKS: Array<{ mapX: number; mapY: number; radiusMap: number; height: number }> = [
  { mapX: 92, mapY: 10, radiusMap: 9, height: 17 }, // NE ridge by the north bypass
  { mapX: 103, mapY: 22, radiusMap: 7.5, height: 13 }, // Adankolo high ground
  { mapX: 113, mapY: 44, radiusMap: 8, height: 10 }, // far-east bluffs
  { mapX: 8, mapY: 58, radiusMap: 9, height: 12 }, // wild west, across the Niger
  { mapX: -12, mapY: 40, radiusMap: 10, height: 14 }, // north-west frontier
  { mapX: 46, mapY: 100, radiusMap: 11, height: 11 }, // southern bush ridges
]

function pattiHeight(mapX: number, mapY: number): number {
  let h = 0
  for (const p of PATTI_PEAKS) {
    const d = Math.hypot(mapX - p.mapX, mapY - p.mapY)
    if (d < p.radiusMap) {
      const t = 1 - d / p.radiusMap
      // smooth dome with steeper foot
      const dome = t * t * (3 - 2 * t)
      h = Math.max(h, p.height * dome)
    }
  }
  return h
}

/** Frontier hill height — same dome profile as Patti's peaks. */
function frontierHeight(mapX: number, mapY: number): number {
  let h = 0
  for (const p of FRONTIER_PEAKS) {
    const d = Math.hypot(mapX - p.mapX, mapY - p.mapY)
    if (d < p.radiusMap) {
      const t = 1 - d / p.radiusMap
      h = Math.max(h, p.height * (t * t * (3 - 2 * t)))
    }
  }
  return h
}

/* ------------------------------ district flats ---------------------------- */

/**
 * District plateaus — terrain eases to a gentle, buildable height around
 * every location anchor. Values are per-location base heights (world units).
 */
export const DISTRICT_FLATS: Record<string, { mapX: number; mapY: number; radiusMap: number; height: number }> = {
  home: { mapX: 50, mapY: 72, radiusMap: 6.5, height: 3.2 },
  'kpata-market': { mapX: 30, mapY: 52, radiusMap: 7, height: 3.4 },
  'ganaja-junction': { mapX: 68, mapY: 44, radiusMap: 7, height: 3.3 },
  confluence: { mapX: 78.5, mapY: 66.5, radiusMap: 5, height: 2.6 },
  'mount-patti': { mapX: 18, mapY: 20, radiusMap: 5.5, height: 20.5 },
  'historic-lokoja': { mapX: 42, mapY: 30, radiusMap: 6, height: 3.4 },
  'government-area': { mapX: 58, mapY: 18, radiusMap: 6.5, height: 3.8 },
  'university-area': { mapX: 74, mapY: 28, radiusMap: 6.5, height: 3.6 },
  'food-area': { mapX: 46, mapY: 62, radiusMap: 5.5, height: 3.2 },
  'transport-area': { mapX: 60, mapY: 80, radiusMap: 6.5, height: 3.1 },
  // Stage 3.6 environmental areas (no location id — scenery districts)
  adankolo: { mapX: 93, mapY: 29, radiusMap: 5, height: 3.3 },
  crusher: { mapX: 21, mapY: 33.5, radiusMap: 4, height: 3.6 },
  riverfront: { mapX: 76, mapY: 88, radiusMap: 4.5, height: 3.0 },
}

/* ------------------------------ height field ------------------------------ */

/**
 * THE terrain height at a world-space point (x, z).
 * Deterministic and side-effect free — safe to call anywhere, any time.
 */
export function terrainHeight(x: number, z: number): number {
  const { mapX, mapZ } = worldToMap(x, z)

  // 1. rolling plains — gentle, buildable
  let h = BASE_LAND + (fbm(mapX * 0.09, mapZ * 0.09, 11) - 0.5) * 2.0

  // 2. secondary bumps for rural edges (mostly outside the city core)
  h += (fbm(mapX * 0.045 + 40, mapZ * 0.045 - 17, 29) - 0.5) * 1.6

  // 3. Mount Patti + frontier hills (Stage 3.6)
  const patti = Math.max(pattiHeight(mapX, mapZ), frontierHeight(mapX, mapZ))
  if (patti > 0) {
    // rocky micro-relief on the hills themselves
    const rock = (fbm(mapX * 0.35, mapZ * 0.35, 53) - 0.5) * 2.4 * Math.min(1, patti / PATTI_HEIGHT)
    h = Math.max(h, patti + rock)
  }

  // 4. river carving — pull the bed to an absolute depth so the water
  //    surface (a plane at WATER_LEVEL) always shows a real river
  const river = riverInfoAt(mapX, mapZ)
  if (river.distMap < river.halfWidthMap + 2.4) {
    const inner = Math.max(0, 1 - river.distMap / river.halfWidthMap) // 1 centre → 0 waterline
    const bank = Math.max(0, Math.min(1, 1 - (river.distMap - river.halfWidthMap) / 2.4)) // bank falloff
    const bed = WATER_LEVEL - RIVER_DEPTH
    let t = Math.min(1, smooth(Math.min(1, inner * 1.3)) + bank * 0.22)
    h = h * (1 - t) + bed * t
  }

  // 5. district plateaus — blend toward flat building ground
  //    (Mount Patti keeps its rugged summit — the rest house sits on pillars)
  //    Plateau weight fades to zero underwater so the Niger & Benue keep flowing.
  for (const key in DISTRICT_FLATS) {
    if (key === 'mount-patti') continue
    const f = DISTRICT_FLATS[key]
    const d = Math.hypot(mapX - f.mapX, mapZ - f.mapY)
    if (d < f.radiusMap * 1.9) {
      const t = d < f.radiusMap ? 1 : 1 - (d - f.radiusMap) / (f.radiusMap * 0.9)
      const w = smooth(Math.max(0, Math.min(1, t)))
      const gate = smooth(Math.max(0, Math.min(1, (h - (WATER_LEVEL + 0.25)) / 1.1)))
      const ww = w * gate
      // plateaus never sink below water — confluence jetty sits on land
      const target = Math.max(f.height, WATER_LEVEL + 1.6)
      h = h * (1 - ww) + target * ww
    }
  }

  // 6. open plain never dips below the water table (no mystery ponds)
  if (river.distMap > river.halfWidthMap + 1.6 && h < 1.55) {
    h = 1.55 + (1.55 - h) * 0.2
  }

  return h
}

/**
 * Sampled terrain normal (cheap finite difference) — for sloping props.
 */
export function terrainSlope(x: number, z: number): number {
  const e = 1.2
  const hx = terrainHeight(x + e, z) - terrainHeight(x - e, z)
  const hz = terrainHeight(x, z + e) - terrainHeight(x, z - e)
  return Math.hypot(hx, hz) / (2 * e)
}

/**
 * Terrain surface colour weight helpers — shared by the mesh builder so
 * colours and geometry can never drift apart.
 */
export function terrainZoneAt(x: number, z: number): {
  mapX: number
  mapZ: number
  height: number
  /** 0..1 — how close to a river bank (sand tint) */
  riverProximity: number
  /** 0..1 — how high up Patti this is (rocky tint) */
  hilliness: number
  /** 0..1 — inside a district plateau (settled tint) */
  settled: number
} {
  const { mapX, mapZ } = worldToMap(x, z)
  const info = riverInfoAt(mapX, mapZ)
  const riverProximity = Math.max(0, 1 - info.distMap / (info.halfWidthMap + 2.6))
  const hilliness = Math.min(1, Math.max(pattiHeight(mapX, mapZ), frontierHeight(mapX, mapZ)) / PATTI_HEIGHT)
  let settled = 0
  for (const key in DISTRICT_FLATS) {
    const f = DISTRICT_FLATS[key]
    const d = Math.hypot(mapX - f.mapX, mapZ - f.mapY)
    if (d < f.radiusMap * 1.6) {
      settled = Math.max(settled, 1 - d / (f.radiusMap * 1.6))
    }
  }
  return { mapX, mapZ, height: terrainHeight(x, z), riverProximity, hilliness, settled }
}
