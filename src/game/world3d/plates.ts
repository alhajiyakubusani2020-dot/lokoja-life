/**
 * LOKOJA LIFE — W1 ROAD SIDES: STREET NAME PLATES
 * -----------------------------------------------
 * Blue municipal name plates at the junction mouths of the streets that
 * carry REAL OSM names in our own geo data (`RoadDef.name` — Lugard Road,
 * Ibb way, Patti Road, Ahmadu Bello way… 20 unique names over 30 named
 * ways, verified by the m23-w1 law suite against the live arrays).
 *
 * THE CLUSTER LAW (zebra pattern reused): every NAMED artery's first/last
 * polyline point is clustered at junction radius 5 (the road renderer's
 * junctionDiscs law); a cluster with ≥ 2 members is a junction mouth. Each
 * named member arm gets ONE plate standing on the verge corner beside the
 * mouth, facing back up the arm so the approaching driver reads it.
 *
 * THE VERGE LAW: the plate stands at roadGap ≥ 0.55 (never on tarmac,
 * never in the W1 drain band), above water, outside fenced ground, inside
 * the walk bound. One plate per (cluster, name); ≤ PLATE_CAP total.
 *
 * THE NAME LAW: names are the raw OSM strings uppercased for the plate
 * face — spelling preserved exactly as mapped (Cementry Road stays the
 * way the survey wrote it). The renderer draws them from one canvas
 * atlas; this module stays pure data.
 *
 * THE GEO GATE (repo law): headless bun consumers must import
 * scripts/geo/bootstrap.ts FIRST.
 */

import {
  ROADS,
  ROAD_RENDER_W,
  WALK_BOUND,
  WATER_Y,
  heightAt,
  inCivicCampus,
  inSchoolYard,
  riverInfo,
  roadGap,
  type RoadDef,
} from './layout'

/* ------------------------------ tunable laws ------------------------------- */

const CLUSTER_R = 5 // endpoint clustering radius (junctionDiscs law)
const VERGE_GAP_MIN = 0.55 // roadGap floor at the plate spot (drain band ends +1.425)
const PULL = 1.7 // plate sits this far outside the mouth along the arm
const SIDE = 1.75 // plate offset beyond the carriageway EDGE — behind the drain
// band (outer wall +1.425), in front of the pole line (+2.0): the real corner
const WATER_MIN = 0.12
const RIVER_MIN = 1.2
const PLATE_CAP = 40
const NAME_MAX = 28 // longest OSM name we will engrave (law-tested)

export interface StreetPlate {
  x: number
  z: number
  y: number
  /** the plate faces back up the arm toward approaching traffic */
  rotY: number
  /** the raw OSM name (uppercased only by the renderer's atlas) */
  name: string
  /** source artery class — the plate's parent street */
  cls: string
}

export interface PlateStats {
  count: number
  uniqueNames: number
  clusters: number
  truncated: boolean
  longestName: number
}

interface ArmEnd {
  x: number
  z: number
  road: RoadDef
  isStart: boolean
}

const plates: StreetPlate[] = []
let clusterCount = 0
let truncated = false

// every NAMED artery's first/last polyline point, in ROADS array order
const armEnds: ArmEnd[] = []
for (const r of ROADS) {
  if (!r.name) continue
  armEnds.push({ x: r.pts[0][0], z: r.pts[0][1], road: r, isStart: true })
  const last = r.pts[r.pts.length - 1]
  armEnds.push({ x: last[0], z: last[1], road: r, isStart: false })
}

const used = armEnds.map(() => false)
for (let i = 0; i < armEnds.length; i++) {
  if (plates.length >= PLATE_CAP) {
    truncated = true
    break
  }
  if (used[i]) continue
  used[i] = true
  const first = armEnds[i]
  const members: ArmEnd[] = [first]
  let cx = first.x
  let cz = first.z
  for (let j = i + 1; j < armEnds.length; j++) {
    if (used[j]) continue
    if (Math.hypot(first.x - armEnds[j].x, first.z - armEnds[j].z) < CLUSTER_R) {
      used[j] = true
      members.push(armEnds[j])
      cx += armEnds[j].x
      cz += armEnds[j].z
    }
  }
  if (members.length < 2) continue // a lone endpoint is no junction mouth
  cx /= members.length
  cz /= members.length
  clusterCount++
  // one plate per named arm, one per name per cluster
  const seenNames = new Set<string>()
  for (const m of members) {
    if (plates.length >= PLATE_CAP) {
      truncated = true
      break
    }
    const name = m.road.name!
    if (!name || seenNames.has(name)) continue
    // arm direction: from the cluster centre toward this arm's endpoint
    let dx = m.x - cx
    let dz = m.z - cz
    let len = Math.hypot(dx, dz)
    if (len < 0.25) {
      const p = m.isStart ? m.road.pts[1] : m.road.pts[m.road.pts.length - 2]
      dx = p[0] - m.x
      dz = p[1] - m.z
      len = Math.hypot(dx, dz)
      if (len < 1e-9) continue
    }
    const dirX = dx / len
    const dirZ = dz / len
    const half = renderHalf(m.road.cls)
    // u points INTO the arm (junction → endpoint); the plate pulls back
    // from the endpoint toward the mouth, then steps to whichever verge
    // side passes the laws (both sides tried — the corner must read).
    // SIDE is measured from the carriageway EDGE, not the centreline.
    const baseX = m.x - dirX * PULL
    const baseZ = m.z - dirZ * PULL
    const candidates: { x: number; z: number }[] = []
    for (const s of [1, -1]) {
      candidates.push({
        x: baseX + -dirZ * (half + SIDE) * s,
        z: baseZ + dirX * (half + SIDE) * s,
      })
    }
    let placed: { x: number; z: number } | null = null
    for (const c of candidates) {
      // THE VERGE LAWS — all must hold
      if (inSchoolYard(c.x, c.z) || inCivicCampus(c.x, c.z)) continue
      if (heightAt(c.x, c.z) <= WATER_Y + WATER_MIN) continue
      const ri = riverInfo(c.x, c.z)
      if (ri.d <= ri.halfWidth + RIVER_MIN) continue
      if (roadGap(c.x, c.z) < VERGE_GAP_MIN) continue
      if (Math.hypot(c.x, c.z) > WALK_BOUND) continue
      placed = c
      break
    }
    if (!placed) continue
    seenNames.add(name)
    // the plate is parallel to its street, normal +u — facing the driver
    // who is coming down the named street toward the junction
    plates.push({
      x: placed.x,
      z: placed.z,
      y: heightAt(placed.x, placed.z),
      rotY: Math.atan2(dirX, dirZ),
      name,
      cls: m.road.cls,
    })
  }
}

function renderHalf(cls: string): number {
  return (ROAD_RENDER_W[cls] ?? 2.2) / 2
}

export const STREET_PLATES: StreetPlate[] = plates

export function plateStats(): PlateStats {
  let longest = 0
  const names = new Set<string>()
  for (const p of plates) {
    names.add(p.name)
    longest = Math.max(longest, p.name.length)
  }
  return {
    count: plates.length,
    uniqueNames: names.size,
    clusters: clusterCount,
    truncated,
    longestName: longest,
  }
}

export const PLATE_NAME_MAX = NAME_MAX
