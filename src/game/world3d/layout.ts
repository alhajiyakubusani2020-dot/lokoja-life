/**
 * LOKOJA LIFE — 3D World Layout (Stage 6: Real Geography)
 * ---------------------------------------------------------
 * The world is now built on the REAL Lokoja road network (OpenStreetMap,
 * ODbL — the same dataset Google Maps/Earth render). `world3d/geo.ts` is
 * GENERATED from raw OSM tiles by `scripts/geo/` and holds every mapped
 * road (3,000+ ways, ~930 km), the Niger/Benue/streams, bridges and place
 * names, projected so that 1 world unit = 26 m and north = -Z.
 *
 * This file fuses that real geography with the GAMEPLAY layer:
 *  - district anchors derived from the LOCATIONS registry (same ids, same
 *    mapX/mapY grid the 2D map uses — 3D world and map can never disagree)
 *  - the Patti summit trail (the real hike route, gameplay-walkable)
 *  - plateaus, buildings, the savanna tree guild (broadleaf/palm/acacia/
 *    baobab), Patti boulders, grass, lamps, stalls, traffic loops
 *
 * Nothing in this file mutates game state and nothing here knows about
 * the economy: it is pure geometry + placement, generated once from a
 * fixed seed so every player sees the same Lokoja.
 */

import { LOCATIONS, LOCATION_BY_ID, type LokojaLocation } from '../data/locations'
import { SCHOOL_SITES_PROJECTED, LEGACY_ANCHOR_XY, type SchoolSite } from '../data/schools'
import {
  GEO_ROADS,
  GEO_RIVERS,
  GEO_BRIDGES,
  GEO_LOOPS,
  GEO_WORLD_HALF,
  type GeoRoad,
} from './geo'

/* ------------------------------ world constants ---------------------------- */

/** map grid (0–100) → world units (the map grid spans the whole real city) */
export const MAP_SCALE = (GEO_WORLD_HALF * 2) / 100
/** terrain half-extent in world units (620 × 620 m at 26 m/u ≈ 16 km across) */
export const WORLD_HALF = GEO_WORLD_HALF
/** hard walk boundary radius from the map centre */
export const WALK_BOUND = WORLD_HALF - 18
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
const PLATEAU_R = 14

/**
 * Anchors derive from LOCATIONS.mapX/mapY. The Stage 6 coordinates are the
 * REAL positions (road-snapped to the OSM network by the geo pipeline), so
 * Kpata Market stands in the real market core, Mount Patti on the real
 * summit plateau, the Confluence viewpoint on the real west-bank bluff.
 */
export const ANCHORS: WorldAnchor[] = LOCATIONS.map((l) => ({
  id: l.id,
  location: l,
  x: worldX(l.mapX),
  z: worldZ(l.mapY),
  plateauH: 0,
  y: 0,
}))

export const ANCHOR_BY_ID: Record<string, WorldAnchor> = Object.fromEntries(
  ANCHORS.map((a) => [a.id, a]),
)

/** the guardian hill's anchor — exported for the terrain art + rock scatter */
export const MOUNT_PATTI = ANCHOR_BY_ID['mount-patti']

/* --------------------------------- rivers ---------------------------------- */

export interface RiverDef {
  id: string
  name: string | null
  /** real-width scaled channel (world units) */
  width: number
  /** world-space centreline */
  points: [number, number][]
}

/**
 * The REAL waters of Lokoja from OSM: the River Niger flows down the town's
 * eastern side (with the great bend at the waterfront), the River Benue
 * arrives from the east-north-east, and they meet at the true Confluence
 * south-east of the town — exactly as a local knows them. Smaller entries
 * are the mapped streams (Ofe/Odagbo etc.) that the highways bridge over.
 */
export const RIVERS: RiverDef[] = GEO_RIVERS.map((r) => ({
  id: r.id,
  name: r.name,
  width: r.w,
  points: r.pts,
}))

/** where the Benue kisses the Niger — the famous confluence landmark */
export const CONFLUENCE_POINT: [number, number] =
  RIVERS[1].points[RIVERS[1].points.length - 1]

/** distance from (x,z) to a polyline */
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

export type RoadStyle = GeoRoad['style']

export interface RoadDef {
  osm: number
  name: string | null
  cls: string
  style: RoadStyle
  /** REAL carriageway width in world units (1u = 26 m) */
  w: number
  /** trunk/major road — lamps, poles, traffic, building clearance */
  major: boolean
  pts: [number, number][]
}

/** the real hike/touring route up Mount Patti — switchbacks to the summit */
const PATTI_TRAIL: RoadDef = {
  osm: 0,
  name: 'Patti Road',
  cls: 'track',
  style: 'dirt',
  w: 0.26,
  major: false,
  pts: [
    [-51.7, -85.2], [-60, -91], [-69, -100], [-66, -111],
    [-75, -119], [-83, -129], [-85, -136],
  ],
}

/**
 * The road graph of Lokoja — REAL, from OpenStreetMap: every trunk (A2
 * Okene/Abuja roads), the IBB Way, Marine Road, Lugard Road, Taiwo Road,
 * Hassan Usman Katsina Road, the Lokoja–Otukpo road out to the Ganaja
 * ferry, plus the full residential fabric. The Patti trail is appended.
 */
export const ROADS: RoadDef[] = [
  ...GEO_ROADS.map((r) => ({
    osm: r.osm,
    name: r.name,
    cls: r.cls,
    style: r.style,
    w: r.w,
    major: r.major,
    pts: r.pts,
  })),
  PATTI_TRAIL,
]

/**
 * Gameplay render width per road class. The world compresses 26 m into one
 * unit, so real widths (RoadDef.w) would be sub-unit — the RENDERED
 * carriageway uses arcade widths a player can walk and drive on, exactly
 * like every city-compression game.
 */
export const ROAD_RENDER_W: Record<string, number> = {
  highway: 6.2,
  major: 5.2,
  secondary: 4.6,
  minor: 2.6,
  track: 2.8,
  path: 1.6,
  foot: 1.6,
}

/* ------------------------- road spatial grid (fast) ------------------------ */

const GRID_CELL = 16

interface RoadSeg {
  ax: number
  az: number
  bx: number
  bz: number
  half: number
  major: boolean
}

const SEG_GRID: Map<string, RoadSeg[]> = new Map()

function gridAdd(s: RoadSeg): void {
  const minX = Math.floor(Math.min(s.ax, s.bx) / GRID_CELL)
  const maxX = Math.floor(Math.max(s.ax, s.bx) / GRID_CELL)
  const minZ = Math.floor(Math.min(s.az, s.bz) / GRID_CELL)
  const maxZ = Math.floor(Math.max(s.az, s.bz) / GRID_CELL)
  for (let cx = minX; cx <= maxX; cx++) {
    for (let cz = minZ; cz <= maxZ; cz++) {
      const k = `${cx}:${cz}`
      let arr = SEG_GRID.get(k)
      if (!arr) {
        arr = []
        SEG_GRID.set(k, arr)
      }
      arr.push(s)
    }
  }
}

for (const r of ROADS) {
  const half = (ROAD_RENDER_W[r.cls] ?? 2.2) / 2
  for (let i = 0; i < r.pts.length - 1; i++) {
    const [ax, az] = r.pts[i]
    const [bx, bz] = r.pts[i + 1]
    gridAdd({ ax, az, bx, bz, half, major: r.major })
  }
}

const ROAD_Q_CAP = 30

function segsNear(x: number, z: number, radius: number): RoadSeg[] {
  const out: RoadSeg[] = []
  const minX = Math.floor((x - radius) / GRID_CELL)
  const maxX = Math.floor((x + radius) / GRID_CELL)
  const minZ = Math.floor((z - radius) / GRID_CELL)
  const maxZ = Math.floor((z + radius) / GRID_CELL)
  for (let cx = minX; cx <= maxX; cx++) {
    for (let cz = minZ; cz <= maxZ; cz++) {
      const arr = SEG_GRID.get(`${cx}:${cz}`)
      if (arr) out.push(...arr)
    }
  }
  return out
}

function segDist(s: RoadSeg, x: number, z: number): number {
  const dx = s.bx - s.ax
  const dz = s.bz - s.az
  const len2 = dx * dx + dz * dz
  let t = len2 === 0 ? 0 : ((x - s.ax) * dx + (z - s.az) * dz) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(x - (s.ax + dx * t), z - (s.az + dz * t))
}

/**
 * Distance to the nearest road centreline (capped at 30u — callers only
 * reason about nearby streets). Used by driving grip, dust halos,
 * building/tree/grass clearance, lamps and props.
 */
export function roadDistance(x: number, z: number): number {
  let best = ROAD_Q_CAP
  for (const s of segsNear(x, z, ROAD_Q_CAP)) {
    const d = segDist(s, x, z)
    if (d < best) best = d
  }
  return best
}

/** distance to the nearest MAJOR road centreline (trunk/major/secondary) */
export function roadDistanceMajors(x: number, z: number): number {
  let best = ROAD_Q_CAP
  for (const s of segsNear(x, z, ROAD_Q_CAP)) {
    if (!s.major) continue
    const d = segDist(s, x, z)
    if (d < best) best = d
  }
  return best
}

/**
 * GAP to the nearest RENDERED carriageway edge — centreline distance minus
 * the road's render half-width. Negative = inside the tarmac. This is the
 * one number the whole "nothing stands on the road" law is written in:
 * buildings, lamps, stalls and trees must all keep a positive gap.
 */
export function roadGap(x: number, z: number, radius = ROAD_Q_CAP): number {
  let best = radius
  for (const s of segsNear(x, z, radius)) {
    const d = segDist(s, x, z) - s.half
    if (d < best) best = d
  }
  return best
}

/** gap to the nearest MAJOR carriageway edge (the strict clearance class) */
export function roadGapMajors(x: number, z: number, radius = ROAD_Q_CAP): number {
  let best = radius
  for (const s of segsNear(x, z, radius)) {
    if (!s.major) continue
    const d = segDist(s, x, z) - s.half
    if (d < best) best = d
  }
  return best
}

/**
 * THE ROAD-CLEARANCE LAW — a building's whole footprint keeps a positive gap
 * to every rendered carriageway. The worst-case corner (the diagonal) must
 * clear the tarmac edge with margin; majors additionally keep shoulder room.
 */
export function buildingClearOfRoad(x: number, z: number, w: number, d: number): boolean {
  const cornerR = Math.hypot(w, d) * 0.5
  return roadGap(x, z) >= cornerR + 0.3 && roadGapMajors(x, z) >= cornerR + 0.7
}

/**
 * Inside a school compound the swept yard owns the ground — mapped minor
 * streets that cross the fence simply stop at it (exactly what a satellite
 * view of a real Lokoja school shows). Road/prop renderers use this to clip.
 */
export function inSchoolYard(x: number, z: number): boolean {
  for (const sp of SCHOOL_SITES) {
    if (Math.hypot(sp.x - x, sp.z - z) < sp.plateauR * 0.92) return true
  }
  return false
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

/** terrace band period in height units — the real Patti's laterite strata */
const PATTI_TERRACE_PERIOD = 7.4

/**
 * Sedimentary terracing for Mount Patti. The real hill is a chain of small
 * plateaus, not a smooth cone: heights inside the mound's influence are
 * gently pulled toward band centres so the flanks read as strata from the
 * plain while the risers between bands stay steep. The pull is capped at
 * ~0.45u so walking and driving the summit trail stays perfectly smooth.
 */
function pattiTerrace(h: number): number {
  if (h < 3.2 || h > 31) return h
  const k = h / PATTI_TERRACE_PERIOD
  const f = k - Math.floor(k)
  const flat = smoothstep(0.18, 0.42, f) * (1 - smoothstep(0.58, 0.82, f))
  return h - (f - 0.5) * PATTI_TERRACE_PERIOD * flat * 0.6
}

// plateau heights must exist before heightAt is ever called
for (const a of ANCHORS) {
  a.plateauH = Math.max(0.4, baseNoise(a.x, a.z) * 0.55 + (a.id === 'mount-patti' ? 30 : 0))
}

/* --------------------------- school site relaxation ---------------------------
 * Final school-site placement runs HERE (it needs the legacy anchor geometry
 * this module owns): campus-vs-campus separation, clearance from the legacy
 * anchors, and a rim clamp that keeps every compound fully inside the
 * playable circle — iterated together so the clamp can never re-bunch the
 * Felele-corridor campuses. The 2D map grid derives from the FINAL positions.
 * --------------------------------------------------------------------------- */

function relaxSchoolSites(): SchoolSite[] {
  const sites = SCHOOL_SITES_PROJECTED.map((s) => ({ ...s }))
  // the CENTER must sit far enough in that the whole compound (gate, front
  // wall, doors, gate palms) stays inside the playable circle
  const rimFor = (s: SchoolSite): number => 272 - s.d / 2 - 1.5
  const outerR = (s: SchoolSite): number => Math.max(s.plateauR, Math.hypot(s.w, s.d) / 2) + 4

  for (let sweep = 0; sweep < 14; sweep++) {
    // campus ↔ campus separation
    for (let i = 0; i < sites.length; i++) {
      for (let j = i + 1; j < sites.length; j++) {
        const a = sites[i]
        const b = sites[j]
        const minD = outerR(a) + outerR(b) + 6
        const dx = b.x - a.x
        const dz = b.z - a.z
        const d = Math.hypot(dx, dz)
        if (d >= minD || d < 1e-4) continue
        const push = (minD - d) / 2
        const ux = dx / d
        const uz = dz / d
        a.x -= ux * push
        a.z -= uz * push
        b.x += ux * push
        b.z += uz * push
      }
    }
    // school plateaus must not stomp the legacy anchors
    for (const s of sites) {
      for (const a of LEGACY_ANCHOR_XY) {
        const dx = s.x - a.x
        const dz = s.z - a.z
        const d = Math.hypot(dx, dz)
        const minD = s.plateauR + 17
        if (d >= minD || d < 1e-4) continue
        const push = minD - d
        s.x += (dx / d) * push
        s.z += (dz / d) * push
      }
    }
    // rim clamp INSIDE the loop so separation survives
    for (const s of sites) {
      const rim = Math.hypot(s.x, s.z)
      const limit = rimFor(s)
      if (rim > limit) {
        s.x = (s.x / rim) * limit
        s.z = (s.z / rim) * limit
      }
    }
  }
  // final map grid from the FINAL positions — map pin and 3D gate agree forever
  for (const s of sites) {
    s.mapX = 50 + s.x / MAP_SCALE
    s.mapY = 50 + s.z / MAP_SCALE
  }
  return sites
}

/** final school sites — the one true positions every consumer shares */
export const SCHOOL_SITES: SchoolSite[] = relaxSchoolSites()

// the school ANCHORS (same stable ids) and the 2D map registry adopt the
// final relaxed positions — anchors, map pins, travel fares and the 3D
// gate all read the one truth
for (const a of ANCHORS) {
  const s = SCHOOL_SITES.find((sp) => sp.id === a.id)
  if (!s) continue
  a.x = s.x
  a.z = s.z
  a.plateauH = Math.max(0.4, baseNoise(a.x, a.z) * 0.55)
  const loc = LOCATION_BY_ID[s.id]
  if (loc) {
    loc.mapX = s.mapX
    loc.mapY = s.mapY
  }
}

/** school sites get their own flat buildable plateau (Stage 7 compounds) */
const SCHOOL_PLATEAU_H: Record<string, number> = {}
for (const sp of SCHOOL_SITES) {
  SCHOOL_PLATEAU_H[sp.id] = Math.max(0.4, baseNoise(sp.x, sp.z) * 0.55)
}

/**
 * Terrain height at any world position.
 * Layers: rolling base → Mount Patti mound (real summit position) →
 * anchor plateaus → river carving (wide for the Niger, narrow for streams).
 * The SAME function drapes roads/buildings and grounds the player,
 * so nothing can float or sink.
 */
export function heightAt(x: number, z: number): number {
  // rolling savanna base
  let h = baseNoise(x, z) * 0.55

  // gentle rise toward the world rim (natural boundary)
  const rim = Math.hypot(x, z)
  h += smoothstep(WALK_BOUND - 26, WALK_BOUND + 14, rim) * 14

  // Mount Patti — the guardian ridge at its REAL position north-west of
  // the town, ~480 m above the Niger plain. The plateau top carries the
  // summit anchor (Lugard's rest house site).
  const pd = Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z)
  const pattiRise = smoothstep(85, 8, pd) // 1 at summit → 0 at the plains
  h += Math.pow(pattiRise, 1.3) * 34

  // sedimentary terracing on the Patti flanks (strata bands, see above)
  if (pd < 96) h = pattiTerrace(h)

  // anchor plateaus — flat buildable/walkable sites
  for (const a of ANCHORS) {
    const d = Math.hypot(x - a.x, z - a.z)
    if (d < PLATEAU_R * 1.9) {
      const w = 1 - smoothstep(PLATEAU_R * 0.62, PLATEAU_R * 1.9, d)
      h = h * (1 - w) + a.plateauH * w
    }
  }

  // river carving — big rivers carve wide valleys, streams cut narrow gullies
  const { d, halfWidth } = riverInfo(x, z)
  const margin = Math.min(9, 2 + halfWidth)
  if (d < halfWidth + margin) {
    const carve = 1 - smoothstep(halfWidth - 2, halfWidth + margin, d)
    h = h * (1 - carve) + (WATER_Y - 1.7) * carve
  }

  // school compound plateaus — carved AFTER the rivers so no mapped stream
  // can gully through a school yard (a stream that meets a compound simply
  // runs to its fence; the yard itself stays honest, flat and dry).
  // Fully flat across the whole compound footprint, fading to the plain beyond.
  for (const sp of SCHOOL_SITES) {
    const dS = Math.hypot(x - sp.x, z - sp.z)
    if (dS < sp.plateauR * 2.0) {
      const w = 1 - smoothstep(sp.plateauR * 1.02, sp.plateauR * 2.0, dS)
      h = h * (1 - w) + SCHOOL_PLATEAU_H[sp.id] * w
    }
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
  /** surface style of the carrying road */
  cls: RoadStyle
}

/**
 * The real bridges of Lokoja (computed from the OSM network by the geo
 * pipeline): every mapped stream crossing — the dual-carriageway A2
 * bridges over the northern river, the town bridges along the Okene and
 * IBB roads, Felele-road crossings. The Niger itself has NO road bridge
 * at Lokoja (locals cross by the Ganaja ferry — true to the real city).
 */
export const BRIDGES: BridgeDef[] = GEO_BRIDGES.map((b) => ({
  x: b.x,
  z: b.z,
  y: WATER_Y + 1.5,
  rotY: b.yaw,
  length: b.len,
  width: b.w,
  cls: (b.cls === 'asphalt' ? 'asphalt' : b.cls === 'laterite' ? 'laterite' : 'dirt') as RoadStyle,
}))

/* -------------------------------- districts -------------------------------- */

export type DistrictKind =
  | 'home' | 'market' | 'food' | 'junction' | 'park' | 'school'
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
  // Stage 7 — the schools are their own district kind (bespoke compounds)
  'ful-felele': 'school',
  'ful-adankolo': 'school',
  'ksp-felele': 'school',
  'salem-university': 'school',
  'college-nursing': 'school',
  'crowther-memorial': 'school',
  'gyb-model-adankolo': 'school',
  'faithview-academy': 'school',
  'al-azhar-college': 'school',
  'baptist-high': 'school',
  'julitola-intl': 'school',
  'christfield-school': 'school',
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
  radius: a.id === 'mount-patti' || a.id === 'confluence' ? 34 : 30,
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

function isClearOf(x: number, z: number, r: number, w: number, d: number): boolean {
  if (riverInfo(x, z).d < 16) return false
  // school compounds own their ground — never scatter a generic house inside
  if (SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + r)) return false
  // THE ROAD-CLEARANCE LAW — the whole footprint stays off the tarmac
  return buildingClearOfRoad(x, z, w, d)
}

function buildDistrictBuildings(d: District, rng: () => number): BuildingDef[] {
  const out: BuildingDef[] = []
  const push = (b: Omit<BuildingDef, 'y'>) => out.push({ ...b, y: heightAt(b.x, b.z) })

  /**
   * Anchor-placed signature buildings (the family house, market sheds, the
   * civic block…) get the SAME road-clearance law as everything else — if
   * their hand-set spot would touch a carriageway they slide outward along
   * a deterministic spoke scan until the whole footprint is clear.
   */
  const pushSafe = (b: Omit<BuildingDef, 'y'>): void => {
    const ok = (x: number, z: number): boolean =>
      riverInfo(x, z).d >= 16 &&
      !SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + Math.max(b.w, b.d) * 0.72) &&
      buildingClearOfRoad(x, z, b.w, b.d) &&
      !out.some((o) => Math.hypot(o.x - x, o.z - z) < (Math.max(o.w, o.d) + Math.max(b.w, b.d)) * 0.62) &&
      Math.hypot(x, z) <= WALK_BOUND - 6
    if (!ok(b.x, b.z)) {
      outer: for (let step = 1; step <= 14; step++) {
        for (let k = 0; k < 12; k++) {
          const dir = (k / 12) * Math.PI * 2 + 0.2617
          const x = b.x + Math.cos(dir) * step * 1.5
          const z = b.z + Math.sin(dir) * step * 1.5
          if (ok(x, z)) {
            b = { ...b, x, z }
            break outer
          }
        }
      }
    }
    // absolute law: if even the spoke scan found no clear spot, the building
    // does not get built standing on the road — it is skipped entirely
    if (ok(b.x, b.z)) push(b)
  }

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
    // DETERMINISTIC RING SCAN — exhaustive first-fit: every radius step from
    // the anchor outward, 24 spokes around, the first fully-legal spot wins.
    // The road-clearance law is absolute, so density yields to correctness.
    for (let rad = radiusMin; rad <= radiusMax; rad += 1.5) {
      for (let k = 0; k < 24; k++) {
        const ang = (k / 24) * Math.PI * 2
        const x = d.x + Math.cos(ang) * rad
        const z = d.z + Math.sin(ang) * rad
        if (Math.hypot(x, z) > WALK_BOUND - 6) continue
        if (!isClearOf(x, z, Math.max(w, dd) * 0.72, w, dd)) continue
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
  }

  switch (d.kind) {
    case 'home': {
      // the player's place — proud compound beside the anchor clearing
      // (roads terminate at the anchor, so the centre stays open)
      pushSafe({ x: d.x + 6.5, z: d.z - 5, w: 6.4, d: 5.4, h: 3.4, rotY: -0.5, kind: 'house', tone: 5, roof: 'hip', roofTone: 0 })
      for (let i = 0; i < 5; i++) tryPlace(13, 28, 4.6 + rng() * 1.6, 4 + rng(), 2.9, 'house', 'hip')
      break
    }
    case 'market': {
      // permanent sheds beside the clearing; dense stall rows are placed separately
      pushSafe({ x: d.x - 10, z: d.z - 6, w: 9, d: 5.6, h: 3.8, rotY: 0.4, kind: 'shed', tone: 2, roof: 'shed', roofTone: 4 })
      pushSafe({ x: d.x + 11, z: d.z + 7, w: 8, d: 5, h: 3.4, rotY: -0.3, kind: 'shed', tone: 1, roof: 'shed', roofTone: 3 })
      for (let i = 0; i < 5; i++) tryPlace(14, 30, 4.4, 4, 3, 'shop', 'flat')
      break
    }
    case 'food': {
      for (let i = 0; i < 5; i++) tryPlace(13, 28, 4.6, 4.2, 3.1, 'shop', 'flat')
      for (let i = 0; i < 3; i++) tryPlace(14, 29, 4, 3.6, 2.7, 'house', 'hip')
      break
    }
    case 'junction': {
      for (let i = 0; i < 8; i++) tryPlace(13, 30, 5 + rng() * 2.4, 4.4, 3.6 + rng() * 1.4, 'shop', 'flat')
      break
    }
    case 'park': {
      pushSafe({ x: d.x, z: d.z, w: 12, d: 6.4, h: 4, rotY: 0.2, kind: 'shed', tone: 3, roof: 'shed', roofTone: 1 })
      for (let i = 0; i < 4; i++) tryPlace(14, 29, 4.8, 4, 3, 'shop', 'flat')
      break
    }
    case 'historic': {
      // colonial relics — pale walls, dark hip roofs
      pushSafe({ x: d.x - 6, z: d.z + 2, w: 8.4, d: 6, h: 4.6, rotY: 0.9, kind: 'colonial', tone: 0, roof: 'hip', roofTone: 2 })
      pushSafe({ x: d.x + 7, z: d.z - 4, w: 6.6, d: 5.4, h: 4.1, rotY: -0.6, kind: 'colonial', tone: 5, roof: 'hip', roofTone: 2 })
      for (let i = 0; i < 2; i++) tryPlace(14, 28, 5.4, 4.8, 3.6, 'colonial', 'hip', 0.3)
      break
    }
    case 'gov': {
      pushSafe({ x: d.x, z: d.z, w: 12.5, d: 7.5, h: 6.2, rotY: 0, kind: 'block', tone: 6, roof: 'flat', roofTone: 4 })
      for (let i = 0; i < 2; i++) tryPlace(15, 29, 6, 5, 4.4, 'block', 'flat', 0.2)
      break
    }
    case 'university': {
      pushSafe({ x: d.x - 5, z: d.z + 3, w: 10.5, d: 6, h: 5.4, rotY: 0.3, kind: 'hostel', tone: 4, roof: 'flat', roofTone: 5 })
      for (let i = 0; i < 5; i++) tryPlace(13, 29, 4.4, 4, 3.1, 'shop', 'flat')
      break
    }
    case 'school': {
      // the compound builder owns everything here — the anchor clearing
      // stays open so the gate, yard and blocks read clean
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
  /** false = skip the per-door night point light (school doors opt out) */
  light?: boolean
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
  // the player's house — the signature home building nearest its design spot
  // (pushSafe may have nudged it off a road, so match by nearest, not exact)
  const homeA = ANCHOR_BY_ID['home']
  const homeSpot = BUILDINGS.filter(
    (b) => b.kind === 'house' && b.tone === 5 && Math.hypot(b.x - (homeA.x + 6.5), b.z - (homeA.z - 5)) < 14,
  ).sort(
    (a, b) =>
      Math.hypot(a.x - (homeA.x + 6.5), a.z - (homeA.z - 5)) -
      Math.hypot(b.x - (homeA.x + 6.5), b.z - (homeA.z - 5)),
  )[0] ?? null
  // Mama's buka — the first shop placed in the food district
  const foodShop = BUILDINGS.find(
    (b) => b.kind === 'shop' && Math.hypot(b.x - ANCHOR_BY_ID['food-area'].x, b.z - ANCHOR_BY_ID['food-area'].z) < 34,
  ) ?? null
  // the provision store — the first shed in the market district
  const marketShed = BUILDINGS.find(
    (b) => b.kind === 'shed' && Math.hypot(b.x - ANCHOR_BY_ID['kpata-market'].x, b.z - ANCHOR_BY_ID['kpata-market'].z) < 34,
  ) ?? null
  // Stage 5-b — the campus gym: a shop building in the university district
  const uniGym = BUILDINGS.find(
    (b) => b.kind === 'shop' && Math.hypot(b.x - ANCHOR_BY_ID['university-area'].x, b.z - ANCHOR_BY_ID['university-area'].z) < 34,
  ) ?? null
  // Stage 5-b — the microfinance bank: the civic block standing at the gov anchor
  const govA = ANCHOR_BY_ID['government-area']
  const govBlock =
    BUILDINGS.filter((b) => b.kind === 'block' && Math.hypot(b.x - govA.x, b.z - govA.z) < 16).sort(
      (a, b) => Math.hypot(a.x - govA.x, a.z - govA.z) - Math.hypot(b.x - govA.x, b.z - govA.z),
    )[0] ?? null
  // Stage 5-b — the lounge: the SECOND shop in the food strip (the first is Mama's)
  const foodShop2 =
    BUILDINGS.filter(
      (b) => b.kind === 'shop' && Math.hypot(b.x - ANCHOR_BY_ID['food-area'].x, b.z - ANCHOR_BY_ID['food-area'].z) < 34,
    )[1] ?? null
  return [
    doorFor('home-interior', 'home', homeSpot, { dx: 5, dz: 2 }),
    doorFor('mamas-kitchen', 'food-area', foodShop, { dx: -4, dz: -4.5 }),
    doorFor('kpata-shop', 'kpata-market', marketShed, { dx: -10, dz: -6 }),
    doorFor('peak-gym', 'university-area', uniGym, { dx: 6.5, dz: -4.5 }),
    doorFor('lokoja-microfinance', 'government-area', govBlock, { dx: -6.5, dz: -5.5 }),
    doorFor('golden-nights', 'food-area', foodShop2, { dx: 4.5, dz: 4.5 }),
  ]
})()

/* --------------------------------- trees ----------------------------------- */

export type TreeKind = 'tree' | 'palm' | 'acacia' | 'baobab'

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
export const ACACIA_TONES = ['#6e7a34', '#7d8a3c', '#8a8f45']
export const BAOBAB_TONES = ['#5d7038', '#6a7c40']

function scatterTrees(): TreeDef[] {
  const rng = makeRng(51197)
  const out: TreeDef[] = []
  let guard = 0
  while (out.length < 700 && guard < 26000) {
    guard++
    const x = (rng() * 2 - 1) * (WALK_BOUND - 4)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 4)
    const y = heightAt(x, z)
    if (y > 26) continue // sparse above the Patti slopes' treeline
    const nearRiver = riverInfo(x, z)
    if (nearRiver.d < 13) continue
    if (roadDistance(x, z) < 6.5) continue
    if (Math.hypot(x, z) > WALK_BOUND) continue
    // keep anchor sites readable
    if (ANCHORS.some((a) => Math.hypot(a.x - x, a.z - z) < 13)) continue
    // school compounds plant their own trees — no wild scatter inside
    if (SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 2)) continue
    if (BUILDINGS.some((b) => Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.75 + 2)) continue
    // denser around Patti + riversides, thinner downtown
    const pattiBoost = Math.max(0, 1 - Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z) / 110)
    if (rng() > 0.34 + pattiBoost * 0.5) continue
    // riverside riverine vegetation — palms line the watersides
    const riverside = nearRiver.d < nearRiver.halfWidth + 26
    /**
     * THE TREE GUILD — the real Guinea-savanna mix around Lokoja:
     *  • palms hold the wet riversides (raffia/elder palms, as in life)
     *  • broadleaf neem/mango fills the town and the moister ground
     *  • flat-topped acacias own the open dry plains (the classic silhouette)
     *  • sparse baobab giants stand over the gentle laterite flats
     */
    const moisture = Math.max(0, 1 - nearRiver.d / 60)
    const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
    let kind: TreeKind = 'tree'
    if (riverside && rng() < 0.55) {
      kind = 'palm'
    } else if (moisture < 0.42 && slope < 0.3 && rng() < 0.38) {
      kind = 'acacia'
    } else if (moisture < 0.5 && slope < 0.2 && rng() < 0.05) {
      kind = 'baobab'
    }
    out.push({
      x, z, y,
      scale: kind === 'baobab' ? 1.5 + rng() * 0.8 : 0.75 + rng() * 0.8,
      tone: Math.floor(rng() * (riverside ? PALM_TONES.length : TREE_TONES.length)),
      kind,
    })
  }
  return out
}

export const TREES: TreeDef[] = scatterTrees()

/* ---------------------------------- rocks ----------------------------------- */

export interface RockDef {
  x: number
  z: number
  y: number
  scale: number
  rotY: number
  tone: number
  /** vertical squash — cliff slabs lie low, crown boulders sit rounder */
  squash: number
}

/** laterite/ironstone boulder palette (the stone Patti is made of) */
export const ROCK_TONES = ['#8f7f63', '#7a6a50', '#9a8868']

/**
 * THE ROCKS OF PATTI — boulders and cliff slabs strewn over the mountain's
 * steep flanks, the way the real hill sheds sandstone blocks onto its slopes.
 * The same placement law as everything else: never on the trail or any
 * carriageway, never inside a school compound, an anchor site or a building,
 * never down on the plains (rock belongs to the hill), half-sunk so each
 * boulder reads as part of the slope it sits on. Deterministic.
 */
export const ROCKS: RockDef[] = (() => {
  const rng = makeRng(61223)
  const out: RockDef[] = []
  let guard = 0
  while (out.length < 110 && guard < 9000) {
    guard++
    const ang = rng() * Math.PI * 2
    const rad = 12 + Math.pow(rng(), 0.72) * 88 // denser toward the crown
    const x = MOUNT_PATTI.x + Math.cos(ang) * rad
    const z = MOUNT_PATTI.z + Math.sin(ang) * rad
    const y = heightAt(x, z)
    if (y < 2.2) continue // the Niger plain has no Patti stone
    const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
    // steep flanks and the cliff bands carry the rock; gentle foot slopes get few
    if (slope < 0.26 && rng() > 0.18) continue
    if (roadDistance(x, z) < 4.6) continue // trail + streets stay walkable
    if (Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z) < PLATEAU_R * 1.75) continue
    if (ANCHORS.some((a) => a.id !== 'mount-patti' && Math.hypot(a.x - x, a.z - z) < 15)) continue
    if (SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 3)) continue
    if (BUILDINGS.some((b) => Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.75 + 2.2)) continue
    out.push({
      x, z, y: y - 0.3,
      scale: 0.5 + Math.pow(rng(), 1.6) * 2.1,
      rotY: rng() * Math.PI * 2,
      tone: Math.floor(rng() * ROCK_TONES.length),
      squash: 0.55 + rng() * 0.4,
    })
  }
  return out
})()

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
  while (out.length < 7500 && guard < 72000) {
    guard++
    const x = (rng() * 2 - 1) * (WALK_BOUND - 2)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 2)
    const y = heightAt(x, z)
    if (y < WATER_Y + 0.4) continue
    if (y > 28) continue // rocky Patti crown stays bare
    // steep ground sheds the terrain mesh's faceting — tufts would float
    const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
    if (slope > 0.45) continue
    const river = riverInfo(x, z)
    if (river.d < river.halfWidth + 2.5) continue
    if (roadDistance(x, z) < 5.2) continue
    if (ANCHORS.some((a) => Math.hypot(a.x - x, a.z - z) < 12.5)) continue
    if (SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 1.5)) continue
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
  /** yaw the light ARM points — always across the carriageway it serves */
  rotY: number
  /** highway masts: taller pole, bigger head */
  tall: boolean
}

/**
 * THE STREET LIGHTS OF LOKOJA — every lit class of the real road network:
 * the arteries (highway/major/secondary) end to end, and the residential
 * minor fabric through the built-up core around each district. Lamps stand
 * ON THE SHOULDER (renderHalf + 0.62), alternate sides of the street, face
 * the carriageway with their arm, skip school yards and open water, and the
 * 16 real bridges get corner masts at both abutments. Deterministic.
 */
export const LAMPS: LampDef[] = (() => {
  const SPACING: Record<string, number> = { highway: 13, major: 14, secondary: 15, minor: 19 }
  const out: LampDef[] = []
  const seen = new Set<string>()
  const put = (x: number, z: number, rotY: number, tall: boolean, force = false): void => {
    const k = `${Math.round(x / 3.5)}:${Math.round(z / 3.5)}`
    if (!force && seen.has(k)) return
    if (heightAt(x, z) <= WATER_Y + 0.15) return // never standing in carved water ground
    if (inSchoolYard(x, z)) return // yards clip mapped streets — no lamps either
    if (Math.hypot(x, z) > WALK_BOUND) return
    // THE LAW: the lamp must clear EVERY carriageway — its own shoulder spot
    // is invalid where a highway/feeder road runs through it (dual carriageways)
    if (roadGap(x, z) < 0.3) return
    seen.add(k)
    out.push({ x, z, y: heightAt(x, z), rotY, tall })
  }
  // corner masts on every real bridge — on dry bank ground just past each
  // abutment, arms over the deck so the crossing is lit. Stream valleys carve
  // wide, so each mast searches a small along×across grid for a spot that is
  // dry AND clear of every carriageway.
  for (const b of BRIDGES) {
    const dirX = Math.sin(b.rotY)
    const dirZ = Math.cos(b.rotY)
    const nx = -dirZ
    const nz = dirX
    for (const end of [-1, 1]) {
      for (const sd of [-1, 1]) {
        for (let along = 1.0; along <= 5.6; along += 0.9) {
          let placed = false
          for (let side = b.width / 2 + 0.55; side <= b.width / 2 + 4.6; side += 0.5) {
            const lx = b.x + dirX * ((b.length + 3) / 2 + along) * end + nx * side * sd
            const lz = b.z + dirZ * ((b.length + 3) / 2 + along) * end + nz * side * sd
            if (heightAt(lx, lz) <= WATER_Y + 0.15) continue
            if (roadGap(lx, lz) < 0.3) continue
            if (inSchoolYard(lx, lz)) continue
            put(lx, lz, Math.atan2(-nx * sd, -nz * sd), b.cls === 'asphalt', true)
            placed = true
            break
          }
          if (placed) break
        }
      }
    }
  }
  for (const r of ROADS) {
    const spacing = SPACING[r.cls]
    if (!spacing) continue
    const half = (ROAD_RENDER_W[r.cls] ?? 2.2) / 2
    const offset = half + 0.62
    const tall = r.cls === 'highway'
    let side = 1
    let acc = spacing * 0.45
    for (let i = 0; i < r.pts.length - 1; i++) {
      const [ax, az] = r.pts[i]
      const [bx, bz] = r.pts[i + 1]
      const seg = Math.hypot(bx - ax, bz - az)
      const nx = -(bz - az) / Math.max(seg, 1e-6)
      const nz = (bx - ax) / Math.max(seg, 1e-6)
      while (acc < seg) {
        const t = acc / seg
        const px = ax + (bx - ax) * t
        const pz = az + (bz - az) * t
        // minors only through the built-up fabric around the districts
        if (r.cls !== 'minor' || DISTRICTS.some((dd) => Math.hypot(dd.x - px, dd.z - pz) < 58)) {
          // candidate shoulders: near rim first, then farther out on either
          // side — dual carriageways swallow the inner shoulders, so their
          // lighting lands on the outer rim (exactly how real ones are lit)
          const rims: [number, number][] = [
            [nx * offset * side, nz * offset * side],
            [-nx * offset * side, -nz * offset * side],
            [nx * (offset + 0.6) * side, nz * (offset + 0.6) * side],
            [nx * (offset + 1.3) * side, nz * (offset + 1.3) * side],
            [-nx * (offset + 0.7) * side, -nz * (offset + 0.7) * side],
          ]
          for (const [ox, oz] of rims) {
            const lx = px + ox
            const lz = pz + oz
            if (roadGap(lx, lz) < 0.3) continue
            put(lx, lz, Math.atan2(px - lx, pz - lz), tall)
            break
          }
          side = -side
        }
        acc += spacing
      }
      acc -= seg
    }
  }
  return out.slice(0, 1500)
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
    { cx: ANCHOR_BY_ID['kpata-market'].x, cz: ANCHOR_BY_ID['kpata-market'].z, n: 14, spread: 17, rot: 0.35 },
    { cx: ANCHOR_BY_ID['food-area'].x, cz: ANCHOR_BY_ID['food-area'].z, n: 10, spread: 14, rot: -0.5 },
    { cx: ANCHOR_BY_ID['ganaja-junction'].x, cz: ANCHOR_BY_ID['ganaja-junction'].z, n: 8, spread: 12, rot: 1.1 },
  ]
  for (const row of rows) {
    for (let i = 0; i < row.n; i++) {
      const gx = (i % 4) - 1.5
      const gz = Math.floor(i / 4) - 1
      const x = row.cx + Math.cos(row.rot) * (gx * 4.6) - Math.sin(row.rot) * (gz * 5.4)
      const z = row.cz + Math.sin(row.rot) * (gx * 4.6) + Math.cos(row.rot) * (gz * 5.4)
      if (roadGap(x, z) < 0.45) continue
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

/** NPCs stroll around the livelier districts + the school compounds (Stage 7). */
export const NPC_ZONES: NpcZone[] = [
  'kpata-market', 'food-area', 'ganaja-junction', 'home', 'transport-area', 'university-area', 'historic-lokoja',
  // the schools — students in the yard, teachers at the block
  'ful-felele', 'ful-adankolo', 'ksp-felele', 'crowther-memorial', 'gyb-model-adankolo', 'college-nursing',
].map((id) => {
  const a = ANCHOR_BY_ID[id]
  return { locationId: id, x: a.x, z: a.z, y: a.y, radius: 15 }
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

/**
 * Closed traffic loops chained along the REAL major-road graph by the geo
 * pipeline (IBB Way circuit, Taiwo/west ring, Otukpo road circuit).
 */
export const TRAFFIC_LOOPS: [number, number][][] = GEO_LOOPS
