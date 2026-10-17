/**
 * LOKOJA LIFE — W3: JUNCTION PHYSICS & HARDWARE (pure data + laws)
 * ---------------------------------------------------------------
 * The hardware that makes junctions JUNCTIONS:
 *
 *  - TRAFFIC LIGHTS at the top artery mouths — the junctionDiscs
 *    clustering law (the zebra pattern) finds the mouths; the biggest
 *    ones (major members first) get a signal mast. THE PHASE LAW is a
 *    fixed table — GREEN 12s → AMBER 3s → RED 15s (30s cycle) — pure
 *    function of the running world seconds plus a position-hashed
 *    junction offset, so the city's signals are deterministic and
 *    desynchronised (a real grid never runs one green wave).
 *
 *  - SPEED BUMPS at the school frontages — the real sinusoidal profile
 *    h(u) = A·cos²(π·u/2) for u ∈ [−1, 1] across the carriageway's
 *    throat, painted. bumpHeightAt(x, z) is THE shared truth: the
 *    renderer extrudes it, the DriveSystem lifts the body over it, the
 *    suite verifies continuity — one law, three consumers.
 *
 *  - DANFO STOPS at the existing bays — where the parked danfo fleet
 *    clusters, a shelter + a painted board post. No bay, no stop.
 *
 * Pure TypeScript: layout + vehicles imports only, deterministic by
 * construction (hash/seeding only), headless-suite safe behind the geo
 * gate.
 */

import {
  ROADS,
  ROAD_RENDER_W,
  SCHOOL_SITES,
  WALK_BOUND,
  WATER_Y,
  heightAt,
  inCivicCampus,
  inSchoolYard,
  riverInfo,
  roadGap,
  type RoadDef,
} from './layout'
import { PARKED_VEHICLES } from './vehicles'

/* ------------------------------ tunable laws ------------------------------- */

const CLUSTER_R = 5 // endpoint clustering radius (junctionDiscs law)
const LIGHT_CAP = 14
const LIGHT_VERGE = 1.9 // mast setback beyond the carriageway edge
const LIGHT_GAP_MIN = 0.5 // roadGap floor at the mast
const WATER_MIN = 0.12

// THE PHASE TABLE (seconds) — the one timing law
export const PHASE_GREEN = 12
export const PHASE_AMBER = 3
export const PHASE_RED = 15
export const PHASE_CYCLE = PHASE_GREEN + PHASE_AMBER + PHASE_RED

export const BUMP_AMPLITUDE = 0.09 // metres of hump — a car-feel bump, not a wall
export const BUMP_HALF_LEN = 2.6 // half-length along the road (the sinusoid's u ∈ [−1,1])
const BUMPS_PER_SCHOOL = 2
const BUMP_SPACING = 4.4 // between the pair, along the road
const BUMP_CAP = 12

const STOP_MIN_BAYS = 1 // a lone danfo at a bay IS a stop — but clusters win
const STOP_CLUSTER_R = 9
const STOP_CAP = 6
const STOP_VERGE = 1.8

/* --------------------------- junction mouth clusters ------------------------ */

export interface JunctionCluster {
  x: number
  z: number
  y: number
  /** artery arms entering the mouth */
  members: number
  majors: number
  rotY: number // the first major arm's yaw — the mast faces it
}

interface ArteryEnd {
  x: number
  z: number
  road: RoadDef
  isStart: boolean
}

const arteryEnds: ArteryEnd[] = []
for (const r of ROADS) {
  if (!r.major) continue
  arteryEnds.push({ x: r.pts[0][0], z: r.pts[0][1], road: r, isStart: true })
  const last = r.pts[r.pts.length - 1]
  arteryEnds.push({ x: last[0], z: last[1], road: r, isStart: false })
}

const usedEnd = arteryEnds.map(() => false)
const clusters: JunctionCluster[] = []
for (let i = 0; i < arteryEnds.length; i++) {
  if (usedEnd[i]) continue
  usedEnd[i] = true
  const first = arteryEnds[i]
  const members: ArteryEnd[] = [first]
  let cx = first.x
  let cz = first.z
  for (let j = i + 1; j < arteryEnds.length; j++) {
    if (usedEnd[j]) continue
    if (Math.hypot(first.x - arteryEnds[j].x, first.z - arteryEnds[j].z) < CLUSTER_R) {
      usedEnd[j] = true
      members.push(arteryEnds[j])
      cx += arteryEnds[j].x
      cz += arteryEnds[j].z
    }
  }
  if (members.length < 2) continue // a lone endpoint is no junction
  cx /= members.length
  cz /= members.length
  const majors = members.filter((m) => m.road.cls !== 'secondary').length
  // the mouth faces along the first major arm — the mast stands on that corner
  const firstMajor = members.find((m) => m.road.cls !== 'secondary') ?? members[0]
  let dx = firstMajor.x - cx
  let dz = firstMajor.z - cz
  const len = Math.hypot(dx, dz)
  const rotY = len > 1e-9 ? Math.atan2(dx / len, dz / len) : 0
  clusters.push({ x: cx, z: cz, y: heightAt(cx, cz), members: members.length, majors, rotY })
}

/** every major-artery junction mouth, biggest first (deterministic order) */
export const JUNCTION_CLUSTERS: JunctionCluster[] = clusters.sort((a, b) =>
  b.majors - a.majors || b.members - a.members || a.x - b.x || a.z - b.z,
)

/* -------------------------------- traffic lights --------------------------- */

export type LightPhase = 'green' | 'amber' | 'red'

export interface TrafficLight {
  x: number
  z: number
  y: number
  /** the mast faces the arm it controls */
  rotY: number
  /** position-hashed phase offset (seconds) — the grid never runs one wave */
  offset: number
  cluster: number // index into JUNCTION_CLUSTERS (law-suite provenance)
}

/** THE PHASE LAW — pure: t = (worldSec + offset) mod cycle */
export function lightPhaseAt(offset: number, worldSec: number): LightPhase {
  const t = (((worldSec + offset) % PHASE_CYCLE) + PHASE_CYCLE) % PHASE_CYCLE
  if (t < PHASE_GREEN) return 'green'
  if (t < PHASE_GREEN + PHASE_AMBER) return 'amber'
  return 'red'
}

/** seconds until the NEXT phase boundary (the suite pins the table) */
export function secondsToPhaseChange(offset: number, worldSec: number): number {
  const t = (((worldSec + offset) % PHASE_CYCLE) + PHASE_CYCLE) % PHASE_CYCLE
  if (t < PHASE_GREEN) return PHASE_GREEN - t
  if (t < PHASE_GREEN + PHASE_AMBER) return PHASE_GREEN + PHASE_AMBER - t
  return PHASE_CYCLE - t
}

/** deterministic position hash → seconds offset inside the cycle */
function phaseOffsetOf(x: number, z: number): number {
  const h = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453)
  return (h - Math.floor(h)) * PHASE_CYCLE
}

export const TRAFFIC_LIGHTS: TrafficLight[] = []
{
  for (let ci = 0; ci < JUNCTION_CLUSTERS.length && TRAFFIC_LIGHTS.length < LIGHT_CAP; ci++) {
    const c = JUNCTION_CLUSTERS[ci]
    if (c.majors < 2) continue // signals live where two real roads meet
    if (c.y <= WATER_Y + WATER_MIN) continue
    if (inSchoolYard(c.x, c.z) || inCivicCampus(c.x, c.z)) continue
    const ri = riverInfo(c.x, c.z)
    if (ri.d <= ri.halfWidth + 1.2) continue
    if (Math.hypot(c.x, c.z) > WALK_BOUND) continue
    // the mast stands on the corner the first major arm opens toward —
    // probe several distances/sides; a real mouth always has one legal corner
    const half = (ROAD_RENDER_W.highway + ROAD_RENDER_W.major) / 4 // blended verge
    const nx = -Math.cos(c.rotY)
    const nz = Math.sin(c.rotY)
    let placed: { x: number; z: number } | null = null
    for (const back of [1.6, 2.6, 3.8, 5.2]) {
      if (placed) break
      for (const s of [1, -1]) {
        const bx = c.x + Math.sin(c.rotY) * (half + back)
        const bz = c.z + Math.cos(c.rotY) * (half + back)
        for (const out of [LIGHT_VERGE, LIGHT_VERGE + 0.9, LIGHT_VERGE + 1.9]) {
          const x = bx + nx * out * s
          const z = bz + nz * out * s
          if (heightAt(x, z) <= WATER_Y + WATER_MIN) continue
          if (roadGap(x, z) < LIGHT_GAP_MIN) continue
          if (inSchoolYard(x, z) || inCivicCampus(x, z)) continue
          if (Math.hypot(x, z) > WALK_BOUND) continue
          placed = { x, z }
          break
        }
        if (placed) break
      }
    }
    if (!placed) continue
    TRAFFIC_LIGHTS.push({
      x: placed.x,
      z: placed.z,
      y: heightAt(placed.x, placed.z),
      rotY: c.rotY,
      offset: phaseOffsetOf(c.x, c.z),
      cluster: ci,
    })
  }
}

/* -------------------------------- speed bumps ------------------------------ */

export interface SpeedBump {
  x: number
  z: number
  y: number // surface height at the bump centre
  rotY: number // along the artery — the sinusoid's u axis
  half: number // the carriageway half-width it spans
}

/** THE BUMP PROFILE — h(u) = A·cos²(π·u/2), u ∈ [−1, 1]; exactly 0 at the
 *  ends (the clamp is exact, no cos-of-pi float dust), exactly A at the
 *  throat, C¹ smooth (cos² has zero slope at both ends) — a real hump,
 *  not a ramp with cliffs. */
export function bumpProfile(u: number): number {
  const a = Math.max(-1, Math.min(1, u))
  if (a <= -1 || a >= 1) return 0 // the exact endpoints — cos(±π/2) is float dust
  const c = Math.cos((Math.PI * a) / 2)
  return BUMP_AMPLITUDE * c * c
}

/** the one truth: surface lift at a world point (0 away from every bump) */
export function bumpHeightAt(x: number, z: number): number {
  for (const b of SPEED_BUMPS) {
    const dx = x - b.x
    const dz = z - b.z
    const along = dx * Math.sin(b.rotY) + dz * Math.cos(b.rotY)
    if (Math.abs(along) > BUMP_HALF_LEN) continue
    const across = Math.abs(dx * -Math.cos(b.rotY) + dz * Math.sin(b.rotY))
    if (across > b.half) continue
    return bumpProfile(along / BUMP_HALF_LEN)
  }
  return 0
}

export const SPEED_BUMPS: SpeedBump[] = []
{
  // the artery sample nearest each school's frontage — bumps guard the gate
  for (const site of SCHOOL_SITES) {
    if (SPEED_BUMPS.length >= BUMP_CAP) break
    // find the nearest point on any major artery within 7u of the site
    let best = 7
    let hit: { x: number; z: number; yaw: number; half: number; road: RoadDef } | null = null
    for (const r of ROADS) {
      if (!r.major) continue
      const half = (ROAD_RENDER_W[r.cls] ?? 2.2) / 2
      for (let i = 0; i < r.pts.length - 1; i++) {
        const ax = r.pts[i][0]
        const az = r.pts[i][1]
        const bx = r.pts[i + 1][0]
        const bz = r.pts[i + 1][1]
        const dx = bx - ax
        const dz = bz - az
        const l2 = dx * dx + dz * dz
        if (l2 < 1e-9) continue
        let t = ((site.x - ax) * dx + (site.z - az) * dz) / l2
        t = t < 0 ? 0 : t > 1 ? 1 : t
        const px = ax + dx * t
        const pz = az + dz * t
        const d = Math.hypot(px - site.x, pz - site.z)
        if (d < best) {
          best = d
          hit = { x: px, z: pz, yaw: Math.atan2(dx, dz), half, road: r }
        }
      }
    }
    if (!hit) continue
    const ux = Math.sin(hit.yaw)
    const uz = Math.cos(hit.yaw)
    for (let k = 0; k < BUMPS_PER_SCHOOL; k++) {
      const along = (k - (BUMPS_PER_SCHOOL - 1) / 2) * BUMP_SPACING
      const x = hit.x + ux * along
      const z = hit.z + uz * along
      if (heightAt(x, z) <= WATER_Y + WATER_MIN) continue
      const ri = riverInfo(x, z)
      if (ri.d <= ri.halfWidth + 1.2) continue // bridges carry their own deck
      SPEED_BUMPS.push({ x, z, y: heightAt(x, z), rotY: hit.yaw, half: hit.half })
    }
  }
}

/* --------------------------------- danfo stops ----------------------------- */

export interface DanfoStop {
  x: number
  z: number
  y: number
  rotY: number // the bay's road yaw — the shelter faces the carriageway
  bays: number // danfo parked in the cluster (provenance)
}

export const DANFO_STOPS: DanfoStop[] = []
{
  // THE BAY LAW — a stop marks a TRANSIT bay: the danfo, taxi, keke and
  // okada bays of the BAY_SPECS fleet (private sedans get no stop). The
  // shelter stands on the shoulder behind the bay, on whichever side is
  // legally off the carriageway.
  const TRANSIT = new Set(['danfo', 'taxi', 'keke', 'okada'])
  const bays = PARKED_VEHICLES.filter((v) => TRANSIT.has(v.build))
  for (const bay of bays) {
    if (DANFO_STOPS.length >= STOP_CAP) break
    // THE SITING SEARCH — the bay shoulders are tight; probe behind and
    // beside the bay until a spot clears every carriageway by 0.6
    let placed: { x: number; z: number } | null = null
    const ux = Math.sin(bay.rotY)
    const uz = Math.cos(bay.rotY)
    for (const along of [0, -1.6, 1.6, -3.2, 3.2]) {
      if (placed) break
      for (const across of [-2.6, 2.6, -3.6, 3.6, -4.8, 4.8, -6.2, 6.2]) {
        const x = bay.x + ux * along + -Math.cos(bay.rotY) * across
        const z = bay.z + uz * along + Math.sin(bay.rotY) * across
        if (heightAt(x, z) <= WATER_Y + WATER_MIN) continue
        if (roadGap(x, z) < 0.6) continue
        if (inSchoolYard(x, z) || inCivicCampus(x, z)) continue
        if (Math.hypot(x, z) > WALK_BOUND) continue
        placed = { x, z }
        break
      }
    }
    if (!placed) continue
    DANFO_STOPS.push({ x: placed.x, z: placed.z, y: heightAt(placed.x, placed.z), rotY: bay.rotY, bays: 1 })
  }
}

/* ---------------------------------- stats ---------------------------------- */

export interface JunctionStats {
  clusters: number
  bigMouths: number // clusters with ≥2 major arms
  lights: number
  bumps: number
  stops: number
}

export function junctionStats(): JunctionStats {
  return {
    clusters: JUNCTION_CLUSTERS.length,
    bigMouths: JUNCTION_CLUSTERS.filter((c) => c.majors >= 2).length,
    lights: TRAFFIC_LIGHTS.length,
    bumps: SPEED_BUMPS.length,
    stops: DANFO_STOPS.length,
  }
}
