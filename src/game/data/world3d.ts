/**
 * LOKOJA LIFE — 3D World Registry (Stage 3.5)
 * ---------------------------------------------
 * The data heart of the 3D city. EVERYTHING here derives from the
 * EXISTING stable location ids in locations.ts (mapX/mapY grid) —
 * there is no second location registry, so the 3D world, the 2D map,
 * travel fares and opportunities can never drift apart.
 *
 *   Location id → map coords → world coords → district → landmark.
 *
 * Pure data + deterministic (seeded) layout generation — no three.js
 * imports, so tests can run headless.
 */

import { LOCATIONS, LOCATION_BY_ID } from './locations'
import { mapToWorld, isWaterMap, terrainHeight, terrainSlope, WORLD_SCALE, WATER_LEVEL, RIVER_NIGER_MAP, RIVER_MERGED_MAP, RIVER_BENUE_MAP } from '../systems/terrain'

/* ------------------------------ seeded random ------------------------------ */

/** mulberry32 — tiny deterministic PRNG so the city layout is stable. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ------------------------------- world anchors ----------------------------- */

export interface LocationAnchor {
  id: string
  name: string
  x: number
  z: number
  /** where the player avatar stands / marker hovers */
  standX: number
  standZ: number
}

/** Every stable location id resolved to its 3D home. */
export const ANCHORS: Record<string, LocationAnchor> = (() => {
  const out = Object.fromEntries(
    LOCATIONS.map((l) => {
      const { x, z } = mapToWorld(l.mapX, l.mapY)
      return [l.id, { id: l.id, name: l.name, x, z, standX: x, standZ: z }]
    }),
  ) as Record<string, LocationAnchor>

  // The Confluence location marks the meeting of the waters (open river).
  // In the 3D world the player stands on the famous west-bank viewpoint
  // beside it — exactly where visitors watch the two rivers kiss.
  const confluence = out['confluence']
  confluence.standX = confluence.x - 14
  confluence.standZ = confluence.z - 5

  return out
})()

/* -------------------------------- road graph ------------------------------- */

/**
 * The road network — laterite arteries radiating from Ganaja Junction
 * (the real hub of Lokoja), exactly as drawn on the Stage 2 map canvas.
 * Points are either location ids or raw [mapX, mapY].
 */
export type RoadPoint = string | [number, number]

export interface RoadDef {
  id: string
  /** main = paved artery, minor = laterite/dirt road */
  kind: 'main' | 'minor'
  points: RoadPoint[]
}

export const ROADS: RoadDef[] = [
  // arteries from Ganaja Junction (the hub every road meets)
  { id: 'ganaja-kpata', kind: 'main', points: ['ganaja-junction', [57, 46], [44, 49], 'kpata-market'] },
  { id: 'ganaja-gra', kind: 'main', points: ['ganaja-junction', [64, 34], [61, 25], 'government-area'] },
  { id: 'ganaja-university', kind: 'main', points: ['ganaja-junction', [71.5, 37], 'university-area'] },
  { id: 'ganaja-historic', kind: 'main', points: ['ganaja-junction', [59, 39], [50, 33.5], 'historic-lokoja'] },
  { id: 'ganaja-motorpark', kind: 'main', points: ['ganaja-junction', [66.5, 54], [63, 66], [61, 74], 'transport-area'] },
  { id: 'ganaja-confluence', kind: 'main', points: ['ganaja-junction', [73.5, 50], [78.5, 58], [81.5, 63.5], 'confluence'] },
  { id: 'ganaja-home', kind: 'main', points: ['ganaja-junction', [61.5, 52], [55.5, 62], [52, 67.5], 'home'] },
  // minor roads binding neighbourhoods together
  { id: 'kpata-foodstrip', kind: 'minor', points: ['kpata-market', [36, 56.5], [41, 60], 'food-area'] },
  { id: 'foodstrip-home', kind: 'minor', points: ['food-area', [47.5, 66], 'home'] },
  { id: 'home-motorpark', kind: 'minor', points: ['home', [54, 75.5], 'transport-area'] },
  { id: 'motorpark-confluence', kind: 'minor', points: ['transport-area', [68, 79], [75.5, 73.5], 'confluence'] },
  // the Patti road — crosses the Niger on the old bridge, then climbs the
  // mountain with real switchbacks (Stage 3.6); the bridge segment near
  // map (24.5, 44) is preserved so the computed crossing never moves
  { id: 'kpata-patti', kind: 'minor', points: ['kpata-market', [26.5, 47], [25, 43.5], [23.5, 40], [25.5, 37], [23.5, 34.5], [25, 31.5], [22.5, 28.5], [24, 25.5], [21.5, 22.5], [19.5, 20.8], 'mount-patti'] },

  /* --------------- Stage 3.6 expansion — the wider city ----------------
   * Exploratory streets & environmental roads. Raw endpoints ONLY, and
   * appended after the routing spokes: routeBetween() picks the FIRST
   * road containing a location id, so travel routing is bit-identical
   * to Stage 2/3.5 while the walkable world grows around it. */
  { id: 'adankolo-road', kind: 'main', points: ['university-area', [80, 24.5], [86, 22], [92, 25], [97, 31], [100, 38]] },
  { id: 'north-bypass', kind: 'main', points: [[61, 25], [66, 17], [74, 13], [83, 15], [90, 21], [97, 31]] },
  { id: 'riverfront-drive', kind: 'main', points: [[63, 88.5], [66, 88], [71, 89.5], [75.5, 90.5]] },
  { id: 'crusher-spur', kind: 'minor', points: [[24.8, 39.2], [22.8, 36.3], [21.5, 33.5]] },
  { id: 'home-south-loop', kind: 'minor', points: ['home', [47, 77.5], [45.5, 83.5], [51, 87.5], [58, 88.5], [63, 88.5]] },
  { id: 'market-backstreet', kind: 'minor', points: ['kpata-market', [31.5, 57.5], [33, 62.5], [37, 65], [41, 63.5]] },
  { id: 'junction-east-street', kind: 'minor', points: ['ganaja-junction', [74.5, 42.5], [80, 44], [84.5, 48]] },
]

export interface ResolvedRoad {
  id: string
  kind: 'main' | 'minor'
  /** world-space polyline [{x,z}] */
  pts: Array<{ x: number; z: number }>
  /** ids of locations this road directly connects */
  endpoints: [string, string]
}

function resolvePoint(p: RoadPoint): { x: number; z: number } {
  if (typeof p === 'string') {
    const loc = LOCATION_BY_ID[p]
    // the Confluence location marks open water — roads (and the journeys
    // that ride them) end on the west-bank viewpoint beside it
    if (p === 'confluence') {
      return { x: ANCHORS['confluence'].standX, z: ANCHORS['confluence'].standZ }
    }
    return mapToWorld(loc.mapX, loc.mapY)
  }
  return mapToWorld(p[0], p[1])
}

export const RESOLVED_ROADS: ResolvedRoad[] = ROADS.map((r) => ({
  id: r.id,
  kind: r.kind,
  pts: r.points.map(resolvePoint),
  endpoints: (() => {
    const first = r.points[0]
    const last = r.points[r.points.length - 1]
    return [typeof first === 'string' ? first : '', typeof last === 'string' ? last : ''] as [string, string]
  })(),
}))

/* ------------------------------ travel routing ----------------------------- */

/**
 * Route a journey between two locations along the road graph.
 * The graph is a hub-and-spoke (Ganaja Junction), matching the 2D map:
 *  1. a direct road A→B wins
 *  2. otherwise A→ganaja-junction→B (concatenated, deduped)
 */
export function routeBetween(originId: string, destinationId: string): Array<{ x: number; z: number }> {
  if (originId === destinationId) return []
  const direct = RESOLVED_ROADS.find(
    (r) =>
      (r.endpoints[0] === originId && r.endpoints[1] === destinationId) ||
      (r.endpoints[0] === destinationId && r.endpoints[1] === originId),
  )
  const ptsOf = (rid: string) => RESOLVED_ROADS.find((r) => r.id === rid)!.pts
  if (direct) return [...direct.pts]

  const a = ptsOf(RESOLVED_ROADS.find((r) => r.endpoints.includes(originId))!.id)
  const b = ptsOf(RESOLVED_ROADS.find((r) => r.endpoints.includes(destinationId))!.id)
  // spoke A normalised to run A→hub; spoke B normalised to run hub→B
  const pathA = firstNear(a, originId) ? [...a] : [...a].reverse()
  const pathB = firstNear(b, destinationId) ? [...b].reverse() : [...b]
  return [...pathA, ...pathB]
}

function firstNear(pts: Array<{ x: number; z: number }>, locationId: string): boolean {
  const loc = LOCATION_BY_ID[locationId]
  const w = mapToWorld(loc.mapX, loc.mapY)
  const d0 = Math.hypot(pts[0].x - w.x, pts[0].z - w.z)
  const d1 = Math.hypot(pts[pts.length - 1].x - w.x, pts[pts.length - 1].z - w.z)
  return d0 <= d1
}

/** Total world-space length of a polyline. */
export function polylineLength(pts: Array<{ x: number; z: number }>): number {
  let len = 0
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
  }
  return len
}

/** Point + tangent at normalised progress t (0..1) along a polyline. */
export function pointOnRoute(
  pts: Array<{ x: number; z: number }>,
  t: number,
): { x: number; z: number; angle: number } {
  if (pts.length === 0) return { x: 0, z: 0, angle: 0 }
  const total = polylineLength(pts)
  let target = Math.max(0, Math.min(1, t)) * total
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
    if (target <= seg || i === pts.length - 1) {
      const local = seg > 0 ? target / seg : 0
      const x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * local
      const z = pts[i - 1].z + (pts[i].z - pts[i - 1].z) * local
      const angle = Math.atan2(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
      return { x, z, angle }
    }
    target -= seg
  }
  const last = pts[pts.length - 1]
  return { x: last.x, z: last.z, angle: 0 }
}

/* --------------------------------- bridge ---------------------------------- */

/**
 * The one river bridge (Kpata ⇄ Patti road crosses the Niger).
 * Computed — where the road polyline crosses the river centreline.
 */
export const BRIDGE = (() => {
  const road = RESOLVED_ROADS.find((r) => r.id === 'kpata-patti')!
  // find the road segment closest to the river polyline region (map 20..28 x)
  let bestI = 0
  let bestScore = Infinity
  for (let i = 0; i < road.pts.length - 1; i++) {
    const mx = (road.pts[i].x + road.pts[i + 1].x) / 2
    const mz = (road.pts[i].z + road.pts[i + 1].z) / 2
    // river near map (24.5,44) → world (-102,-24); target that crossing
    const score = Math.hypot(mx - -102, mz - -24)
    if (score < bestScore) {
      bestScore = score
      bestI = i
    }
  }
  const a = road.pts[bestI]
  const b = road.pts[bestI + 1]
  const center = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 }
  const angle = Math.atan2(b.x - a.x, b.z - a.z) // deck direction
  const span = 34 // world units across the Niger at this point
  return { id: 'niger-bridge', center, angle, span, roadId: 'kpata-patti' }
})()

/** World-units the bridge deck rides above the water. */
export const BRIDGE_DECK_HEIGHT = 3.4

/**
 * Walkable/drivable ground height — terrain height, EXCEPT on the bridge
 * where the deck rides above the river. Roads, the player and vehicles
 * all sample this so the Patti road cleanly crosses the Niger.
 */
export function groundHeight(x: number, z: number): number {
  const base = terrainHeight(x, z)
  // project onto the bridge axis
  const dx = x - BRIDGE.center.x
  const dz = z - BRIDGE.center.z
  const sin = Math.sin(BRIDGE.angle)
  const cos = Math.cos(BRIDGE.angle)
  const along = dx * sin + dz * cos // distance along the deck
  const perp = dx * cos - dz * sin // distance across the deck
  const halfSpan = BRIDGE.span / 2
  if (Math.abs(perp) < 5 && Math.abs(along) < halfSpan + 10) {
    const deck = WATER_LEVEL + BRIDGE_DECK_HEIGHT
    if (Math.abs(along) <= halfSpan) return Math.max(base, deck)
    // ramps: blend deck → terrain over 10 units at each end
    const t = 1 - (Math.abs(along) - halfSpan) / 10
    const ramped = base * (1 - t) + deck * t
    return Math.max(base, ramped)
  }
  return base
}

/* ------------------------------- district plan ----------------------------- */

export type BuildingKind =
  | 'house' // pitched-roof family home
  | 'bungalow' // flat-roof modern house
  | 'compound' // walled family compound with gate (Stage 3.6)
  | 'flat' // 3-storey walk-up with balconies (Stage 3.6)
  | 'shop' // street shop with awning
  | 'block' // 2-storey block (offices/hostels)
  | 'stall' // market stall with canopy
  | 'kiosk' // tiny roadside kiosk
  | 'buka' // food stand with benches
  | 'workshop' // garage/workshop with drums
  | 'office' // government office block
  | 'colonial' // historic colonial building
  | 'mosque'
  | 'church'
  | 'school'
  | 'hostel'
  | 'shelter' // motor-park waiting shelter
  | 'resthouse' // mount patti rest house
  | 'monument' // confluence monument
  | 'jetty'

export interface BuildingPlacement {
  kind: BuildingKind
  x: number
  z: number
  /** rotation around Y (radians) — faces the road/anchor by default */
  rot: number
  /** footprint scale multiplier (0.85–1.3) */
  scale: number
  /** palette index (per-district colour themes) */
  color: number
}

export interface DistrictPlan {
  locationId: string
  buildings: BuildingPlacement[]
  /** local scenery circle where ambient props (stalls/crates) cluster */
  busySpots: Array<{ x: number; z: number }>
}

/**
 * Palettes per district — warm Nigerian wall colours, roofs mostly
 * rust-red / zinc-grey, accents in the game's green/gold/terra.
 */
const WALL_COLORS = [
  '#f5e6c8', '#edd9b0', '#e8c98f', '#f0d3b8', '#e5b98a',
  '#d9e3c8', '#cfe0d8', '#f2d8d0', '#e6d3f0', '#f5f0e0',
]
const ROOF_COLORS = ['#b5542d', '#a34a26', '#8a6a4a', '#7d8894', '#9c5a30', '#b05c34', '#6f7d8c']
const AWNING_COLORS = ['#1B7A43', '#E8A317', '#C4562A', '#1F7A6D', '#7C2D6E', '#2b6cb0']

/**
 * Lay out one district's buildings deterministically on ring/grid patterns
 * around the anchor, skipping water and too-steep slopes.
 */
function layoutDistrict(
  locationId: string,
  seed: number,
  recipe: Array<{ kind: BuildingKind; count: number; minR: number; maxR: number }>,
): DistrictPlan {
  const anchor = ANCHORS[locationId]
  return layoutDistrictAt(locationId, seed, anchor.x, anchor.z, recipe)
}

/** Stage 3.6: same layout language for environmental areas WITHOUT a
 *  location id (Adankolo village, the riverfront, the crusher foot). */
function layoutDistrictAt(
  planId: string,
  seed: number,
  anchorX: number,
  anchorZ: number,
  recipe: Array<{ kind: BuildingKind; count: number; minR: number; maxR: number }>,
): DistrictPlan {
  const rng = mulberry32(seed)
  const buildings: BuildingPlacement[] = []
  const busySpots: Array<{ x: number; z: number }> = []

  for (const item of recipe) {
    let placed = 0
    let attempts = 0
    while (placed < item.count && attempts < item.count * 30) {
      attempts++
      const angle = rng() * Math.PI * 2
      const radius = item.minR + rng() * (item.maxR - item.minR)
      const x = anchorX + Math.cos(angle) * radius
      const z = anchorZ + Math.sin(angle) * radius
      const { mapX, mapZ } = { mapX: x / WORLD_SCALE + 50, mapZ: z / WORLD_SCALE + 50 }

      if (isWaterMap(mapX, mapZ)) continue
      const h = terrainHeight(x, z)
      if (h < 1.9) continue // not on the riverbank lip
      if (terrainSlope(x, z) > 0.85) continue // too steep to build

      // face the district anchor — streets radiate from it
      const rot = Math.atan2(anchorX - x, anchorZ - z) + (rng() - 0.5) * 0.35
      buildings.push({
        kind: item.kind,
        x,
        z,
        rot,
        scale: 0.88 + rng() * 0.42,
        color: Math.floor(rng() * WALL_COLORS.length),
      })
      placed++
      if (placed % 2 === 0) busySpots.push({ x, z })
    }
  }
  return { locationId: planId, buildings, busySpots }
}

/**
 * THE CITY PLAN — every district's buildings, deterministic forever.
 * Layout language per district matches its real-life character.
 * Stage 3.6: fuller districts — the city now fills its streets.
 */
export const DISTRICT_PLANS: DistrictPlan[] = [
  layoutDistrict('home', 101, [
    { kind: 'house', count: 13, minR: 14, maxR: 42 },
    { kind: 'compound', count: 3, minR: 18, maxR: 44 },
    { kind: 'bungalow', count: 6, minR: 16, maxR: 44 },
    { kind: 'kiosk', count: 4, minR: 20, maxR: 38 },
  ]),
  layoutDistrict('kpata-market', 202, [
    { kind: 'stall', count: 40, minR: 10, maxR: 34 },
    { kind: 'shop', count: 12, minR: 22, maxR: 46 },
    { kind: 'block', count: 3, minR: 32, maxR: 48 },
    { kind: 'kiosk', count: 8, minR: 12, maxR: 30 },
    { kind: 'flat', count: 1, minR: 34, maxR: 44 },
  ]),
  layoutDistrict('ganaja-junction', 303, [
    { kind: 'shop', count: 10, minR: 14, maxR: 36 },
    { kind: 'buka', count: 6, minR: 12, maxR: 30 },
    { kind: 'kiosk', count: 8, minR: 10, maxR: 26 },
    { kind: 'workshop', count: 4, minR: 24, maxR: 40 },
    { kind: 'flat', count: 2, minR: 26, maxR: 42 },
  ]),
  layoutDistrict('confluence', 404, [
    { kind: 'kiosk', count: 5, minR: 16, maxR: 30 },
    { kind: 'buka', count: 4, minR: 18, maxR: 32 },
  ]),
  layoutDistrict('mount-patti', 505, [
    { kind: 'resthouse', count: 1, minR: 4, maxR: 8 },
    { kind: 'kiosk', count: 3, minR: 10, maxR: 20 },
  ]),
  layoutDistrict('historic-lokoja', 606, [
    { kind: 'colonial', count: 6, minR: 14, maxR: 36 },
    { kind: 'house', count: 8, minR: 18, maxR: 42 },
    { kind: 'compound', count: 2, minR: 20, maxR: 40 },
  ]),
  layoutDistrict('government-area', 707, [
    { kind: 'office', count: 6, minR: 16, maxR: 38 },
    { kind: 'block', count: 4, minR: 20, maxR: 42 },
    { kind: 'bungalow', count: 6, minR: 22, maxR: 46 },
    { kind: 'compound', count: 2, minR: 24, maxR: 44 },
  ]),
  layoutDistrict('university-area', 808, [
    { kind: 'school', count: 1, minR: 6, maxR: 12 },
    { kind: 'hostel', count: 6, minR: 14, maxR: 36 },
    { kind: 'block', count: 3, minR: 18, maxR: 38 },
    { kind: 'kiosk', count: 6, minR: 12, maxR: 28 },
    { kind: 'flat', count: 1, minR: 20, maxR: 34 },
  ]),
  layoutDistrict('food-area', 909, [
    { kind: 'buka', count: 10, minR: 9, maxR: 28 },
    { kind: 'shop', count: 6, minR: 16, maxR: 34 },
    { kind: 'stall', count: 10, minR: 8, maxR: 24 },
  ]),
  layoutDistrict('transport-area', 1010, [
    { kind: 'shelter', count: 4, minR: 10, maxR: 24 },
    { kind: 'workshop', count: 3, minR: 18, maxR: 36 },
    { kind: 'kiosk', count: 6, minR: 10, maxR: 26 },
    { kind: 'shop', count: 4, minR: 20, maxR: 38 },
    { kind: 'flat', count: 1, minR: 22, maxR: 34 },
  ]),
]

/**
 * Stage 3.6 environmental areas — real neighbourhoods beyond the ten
 * registered destinations, so the expanded world has places to walk to.
 * They render exactly like districts but hold NO location id: the
 * stable registry stays untouched.
 */
export interface AreaPlan extends DistrictPlan {
  planId: string
}

function mapToWorldRaw(mapX: number, mapY: number) {
  return { x: (mapX - 50) * WORLD_SCALE, z: (mapY - 50) * WORLD_SCALE }
}

export const EXTRA_PLANS: AreaPlan[] = [
  (() => {
    const a = mapToWorldRaw(93, 29) // Adankolo village
    const p = layoutDistrictAt('adankolo', 1111, a.x, a.z, [
      { kind: 'house', count: 8, minR: 10, maxR: 26 },
      { kind: 'compound', count: 3, minR: 12, maxR: 30 },
      { kind: 'kiosk', count: 3, minR: 8, maxR: 20 },
      { kind: 'buka', count: 2, minR: 10, maxR: 22 },
    ])
    return { ...p, planId: 'adankolo' }
  })(),
  (() => {
    const a = mapToWorldRaw(76, 88) // the riverfront fishing spot
    const p = layoutDistrictAt('riverfront', 1222, a.x, a.z, [
      { kind: 'kiosk', count: 3, minR: 8, maxR: 18 },
      { kind: 'buka', count: 2, minR: 10, maxR: 20 },
      { kind: 'house', count: 3, minR: 12, maxR: 24 },
    ])
    return { ...p, planId: 'riverfront' }
  })(),
  (() => {
    const a = mapToWorldRaw(22, 34.5) // crusher foot settlement
    const p = layoutDistrictAt('crusher', 1333, a.x, a.z, [
      { kind: 'workshop', count: 2, minR: 8, maxR: 16 },
      { kind: 'kiosk', count: 2, minR: 6, maxR: 14 },
      { kind: 'house', count: 3, minR: 10, maxR: 20 },
    ])
    return { ...p, planId: 'crusher' }
  })(),
]

/** All buildings in the world — districts + environmental areas. */
export const ALL_BUILDING_PLANS: DistrictPlan[] = [...DISTRICT_PLANS, ...EXTRA_PLANS]

/**
 * Landmark positions — the ONE source for the mosque, church and
 * confluence monument, shared by City.tsx AND the collision grid.
 */
export const LANDMARK_POSITIONS = (() => {
  const hub = ANCHORS['ganaja-junction']
  const conf = ANCHORS['confluence']
  return {
    mosque: { x: hub.x - 34, z: hub.z + 42, rot: 0.5 },
    church: { x: hub.x + 44, z: hub.z + 36, rot: -0.7 },
    // monument stands beside the viewpoint so the arrival spot stays clear
    monument: { x: conf.standX + 5, z: conf.standZ - 4 },
  }
})()

/** City-centre landmarks around Ganaja Junction — the recognisable silhouette. */
export const CITY_LANDMARKS: BuildingPlacement[] = ([
  // central mosque — visible across the city, near the junction
  { kind: 'mosque', x: 0, z: 0, rot: 0.4, scale: 1, color: 0 }, // resolved below
  { kind: 'church', x: 0, z: 0, rot: 2.2, scale: 1, color: 0 },
] as BuildingPlacement[]).map((b, i) => {
  const hub = ANCHORS['ganaja-junction']
  const rng = mulberry32(4000 + i)
  const angle = i === 0 ? Math.PI * 0.78 : Math.PI * 1.7
  const radius = 38 + rng() * 6
  return {
    ...b,
    x: hub.x + Math.cos(angle) * radius,
    z: hub.z + Math.sin(angle) * radius,
    rot: angle + Math.PI / 2,
    scale: 1,
    color: Math.floor(rng() * WALL_COLORS.length),
  }
})

export { WALL_COLORS, ROOF_COLORS, AWNING_COLORS }

/* ------------------------------ ambient layout ----------------------------- */

/** Environmental anchors by plan id — the raw centres of the Stage 3.6
 *  areas (declared early: scatter houses + vegetation read them). */
export const EXTRA_ANCHORS: Record<string, { x: number; z: number }> = {
  adankolo: mapToWorldRaw(93, 29),
  riverfront: mapToWorldRaw(76, 88),
  crusher: mapToWorldRaw(22, 34.5),
}

/** World anchor of any plan — location plans via ANCHORS, extras via map. */
function planAnchor(plan: DistrictPlan): { x: number; z: number } {
  const a = ANCHORS[plan.locationId]
  if (a) return { x: a.x, z: a.z }
  return EXTRA_ANCHORS[plan.locationId] ?? { x: 0, z: 0 }
}

/**
 * Roadside houses & farms filling the gaps between districts, so the
 * world never feels like 10 islands in empty grass.
 * Stage 3.6: the expanded world gets a proper outskirts population.
 */
export const SCATTER_HOUSES: BuildingPlacement[] = (() => {
  const rng = mulberry32(777)
  const out: BuildingPlacement[] = []
  const kinds: BuildingKind[] = ['house', 'bungalow', 'kiosk', 'house', 'house', 'compound']
  const anchors = [...DISTRICT_PLANS, ...EXTRA_PLANS].map((p) => planAnchor(p))
  let attempts = 0
  while (out.length < 120 && attempts < 2600) {
    attempts++
    const x = (rng() - 0.5) * 520
    const z = (rng() - 0.5) * 520
    const mapX = x / WORLD_SCALE + 50
    const mapZ = z / WORLD_SCALE + 50
    if (isWaterMap(mapX, mapZ)) continue
    const h = terrainHeight(x, z)
    if (h < 2 || h > 14) continue // keep off the hills and the banks
    if (terrainSlope(x, z) > 0.5) continue
    // keep clear of district centres (they have their own buildings)
    let nearDistrict = false
    for (const a of anchors) {
      if (Math.hypot(x - a.x, z - a.z) < 52) {
        nearDistrict = true
        break
      }
    }
    if (nearDistrict) continue
    // hug a road: within 26 units of any road polyline
    let nearRoad = false
    for (const road of RESOLVED_ROADS) {
      for (let i = 1; i < road.pts.length && !nearRoad; i++) {
        const a = road.pts[i - 1]
        const b = road.pts[i]
        const dx = b.x - a.x
        const dz = b.z - a.z
        const lenSq = dx * dx + dz * dz
        let t = ((x - a.x) * dx + (z - a.z) * dz) / lenSq
        t = Math.max(0, Math.min(1, t))
        const cx = a.x + dx * t
        const cz = a.z + dz * t
        if (Math.hypot(x - cx, z - cz) < 26) nearRoad = true
      }
      if (nearRoad) break
    }
    if (!nearRoad) continue
    // face the nearest road point (approximate with segment angle)
    out.push({
      kind: kinds[Math.floor(rng() * kinds.length)],
      x,
      z,
      rot: rng() * Math.PI * 2,
      scale: 0.85 + rng() * 0.4,
      color: Math.floor(rng() * WALL_COLORS.length),
    })
  }
  return out
})()

/**
 * Trees, palms, bushes — forested Patti, riverine strips along both
 * rivers, and shade trees inside districts. Returns world positions.
 */
export interface PropPlacement {
  x: number
  z: number
  rot: number
  scale: number
  variant: number
}

export function treeLine(pts: Array<{ x: number; z: number }>, count: number, seed: number, offsetRange: [number, number], scaleRange: [number, number]): PropPlacement[] {
  const rng = mulberry32(seed)
  const out: PropPlacement[] = []
  const total = polylineLength(pts)
  for (let i = 0; i < count; i++) {
    const t = (i + rng()) / count
    const p = pointOnRoute(pts, t)
    // perpendicular offset
    const nx = Math.cos(p.angle)
    const nz = -Math.sin(p.angle)
    const side = rng() > 0.5 ? 1 : -1
    const off = (offsetRange[0] + rng() * (offsetRange[1] - offsetRange[0])) * side
    const x = p.x + nx * off
    const z = p.z + nz * off
    const mapX = x / WORLD_SCALE + 50
    const mapZ = z / WORLD_SCALE + 50
    if (isWaterMap(mapX, mapZ)) continue
    if (terrainHeight(x, z) < 2) continue
    if (terrainSlope(x, z) > 1.1) continue
    out.push({ x, z, rot: rng() * Math.PI * 2, scale: scaleRange[0] + rng() * (scaleRange[1] - scaleRange[0]), variant: Math.floor(rng() * 3) })
  }
  return out
}

/** All vegetation for the world, deterministic. Stage 3.6: the expanded
 *  world gets a fuller canopy — Patti's forest, the frontier ridges,
 *  riverine strips, riverfront palms and roadside trees. */
export const VEGETATION = (() => {
  const trees: PropPlacement[] = []
  const palms: PropPlacement[] = []
  const bushes: PropPlacement[] = []

  // Mount Patti forest — dense on the slopes
  {
    const rng = mulberry32(3131)
    let placed = 0
    let attempts = 0
    while (placed < 150 && attempts < 2000) {
      attempts++
      const mapX = 4 + rng() * 30
      const mapZ = 6 + rng() * 32
      const { x, z } = mapToWorld(mapX, mapZ)
      const h = terrainHeight(x, z)
      if (h < 6) continue // only on the hill itself
      if (terrainSlope(x, z) > 1.25) continue
      const isPalm = rng() < 0.25
      ;(isPalm ? palms : trees).push({ x, z, rot: rng() * Math.PI * 2, scale: 0.85 + rng() * 0.7, variant: Math.floor(rng() * 3) })
      placed++
    }
  }

  // frontier ridge woods (Stage 3.6) — the NE hills get their own green
  {
    const rng = mulberry32(3232)
    let placed = 0
    let attempts = 0
    while (placed < 60 && attempts < 900) {
      attempts++
      const mapX = 84 + rng() * 36
      const mapZ = 4 + rng() * 34
      const { x, z } = mapToWorld(mapX, mapZ)
      const h = terrainHeight(x, z)
      if (h < 6) continue
      if (terrainSlope(x, z) > 1.25) continue
      ;(rng() < 0.2 ? palms : trees).push({ x, z, rot: rng() * Math.PI * 2, scale: 0.8 + rng() * 0.7, variant: Math.floor(rng() * 3) })
      placed++
    }
  }

  // riverine strips — the Niger & Benue banks are green
  {
    const nigerPath: Array<{ x: number; z: number }> = RIVER_NIGER_WORLD()
    const benuePath: Array<{ x: number; z: number }> = RIVER_BENUE_WORLD()
    trees.push(...treeLine(nigerPath, 70, 5151, [16, 24], [0.9, 1.5]))
    trees.push(...treeLine(benuePath, 34, 5252, [14, 20], [0.9, 1.4]))
    palms.push(...treeLine(nigerPath, 34, 5353, [13, 18], [0.85, 1.3]))
  }

  // district shade trees + market greenery (now covers EXTRA_PLANS too)
  {
    const rng = mulberry32(6161)
    for (const plan of ALL_BUILDING_PLANS) {
      const a = planAnchor(plan)
      const count = plan.locationId === 'kpata-market' ? 6 : 8
      for (let i = 0; i < count; i++) {
        const ang = rng() * Math.PI * 2
        const r = 26 + rng() * 24
        const x = a.x + Math.cos(ang) * r
        const z = a.z + Math.sin(ang) * r
        const mapX = x / WORLD_SCALE + 50
        const mapZ = z / WORLD_SCALE + 50
        if (isWaterMap(mapX, mapZ)) continue
        if (terrainHeight(x, z) < 2) continue
        ;(rng() < 0.3 ? palms : trees).push({ x, z, rot: rng() * Math.PI * 2, scale: 0.8 + rng() * 0.6, variant: Math.floor(rng() * 3) })
      }
      // low bushes inside districts
      for (let i = 0; i < 6; i++) {
        const ang = rng() * Math.PI * 2
        const r = 12 + rng() * 30
        const x = a.x + Math.cos(ang) * r
        const z = a.z + Math.sin(ang) * r
        const mapX = x / WORLD_SCALE + 50
        const mapZ = z / WORLD_SCALE + 50
        if (isWaterMap(mapX, mapZ)) continue
        bushes.push({ x, z, rot: rng() * Math.PI * 2, scale: 0.7 + rng() * 0.8, variant: Math.floor(rng() * 3) })
      }
    }
  }

  // roadside trees along the newer streets (Stage 3.6)
  {
    const riverfrontRoad = RESOLVED_ROADS.find((r) => r.id === 'riverfront-drive')!
    palms.push(...treeLine(riverfrontRoad.pts, 16, 5454, [7, 10], [0.9, 1.3]))
    const adankoloRoad = RESOLVED_ROADS.find((r) => r.id === 'adankolo-road')!
    trees.push(...treeLine(adankoloRoad.pts, 12, 5555, [7.5, 11], [0.85, 1.3]))
  }

  // grass tufts / rocks out in the bush
  const rocks: PropPlacement[] = []
  {
    const rng = mulberry32(7171)
    let placed = 0
    let attempts = 0
    while (placed < 90 && attempts < 1600) {
      attempts++
      const x = (rng() - 0.5) * 560
      const z = (rng() - 0.5) * 560
      const mapX = x / WORLD_SCALE + 50
      const mapZ = z / WORLD_SCALE + 50
      if (isWaterMap(mapX, mapZ)) continue
      const h = terrainHeight(x, z)
      if (h < 2) continue
      rocks.push({ x, z, rot: rng() * Math.PI * 2, scale: 0.5 + rng() * 1.1, variant: Math.floor(rng() * 3) })
      placed++
    }
  }

  return { trees, palms, bushes, rocks }
})()

/** Niger centreline in world space — reuses terrain.ts polylines 1:1. */
export function RIVER_NIGER_WORLD(): Array<{ x: number; z: number }> {
  return [...RIVER_NIGER_MAP, ...RIVER_MERGED_MAP.slice(1)].map(([mx, my]) => mapToWorld(mx, my))
}

/** Benue centreline in world space. */
export function RIVER_BENUE_WORLD(): Array<{ x: number; z: number }> {
  return RIVER_BENUE_MAP.map(([mx, my]) => mapToWorld(mx, my))
}

/* ------------------------------- NPC circuit ------------------------------- */

/**
 * Ambient NPC walks — pedestrians stroll along the main roads'
 * sidewalks (offset from the centreline). Vehicles use the same paths.
 * Stage 3.6: the new streets are alive too.
 */
export const NPC_WALK_ROUTES = [
  'ganaja-kpata', 'ganaja-home', 'ganaja-motorpark', 'ganaja-confluence',
  'ganaja-gra', 'ganaja-university', 'kpata-foodstrip', 'foodstrip-home',
  'market-backstreet', 'home-south-loop', 'adankolo-road', 'riverfront-drive',
]

export const MOVING_VEHICLE_ROUTES = [
  'ganaja-kpata', 'ganaja-home', 'ganaja-motorpark', 'ganaja-confluence',
  'ganaja-gra', 'ganaja-university', 'ganaja-historic', 'motorpark-confluence',
  'adankolo-road', 'north-bypass', 'riverfront-drive', 'junction-east-street',
]
