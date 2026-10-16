/**
 * LOKOJA LIFE — ROAD FURNITURE DATA (kerbs + zebra crossings)
 * ----------------------------------------------------------
 * Pure deterministic placement data derived from the real Lokoja road graph
 * in `./layout`. NO three.js, NO React, NO DOM — plain TypeScript numbers so
 * bun can run it headless and the renderer can drape/extrude the geometry.
 *
 *  - KERB_RUNS: raised concrete kerb segments along BOTH edges of every
 *    asphalt artery (highway/major/secondary). Each segment is one
 *    `KerbRun`; chains break at junction mouths (so the mouths stay open),
 *    at school/civic fences, over carved water and on bridge spans (the
 *    bridges carry their own structure), and at the walk boundary.
 *  - ZEBRAS: zebra crossings where major arteries meet — one per artery
 *    arm entering a junction cluster (the same endpoint clustering the
 *    road renderer's junctionDiscs uses), pulled back onto the mouth.
 *
 * THE GEO GATE (repo law): layout.ts derives everything at module scope
 * from the geo arrays, which the browser fills before the world chunk is
 * ever evaluated. Headless bun scripts must import scripts/geo/bootstrap.ts
 * FIRST (the established CLI pattern for every layout-derived module) —
 * this file itself only ever imports from './layout'.
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

const KERB_STEP = 4 // resample pitch along the polyline (world units)
const KERB_SHOULDER = 0.34 // kerb offset beyond the rendered carriageway edge
const KERB_CHAIN_MAX = 5 // max distance between chained kerb points
const KERB_GAP_MIN = 0.05 // roadGap floor — junction mouths must stay open
const KERB_WATER_MIN = 0.12 // height margin above the water line
const KERB_RIVER_MIN = 1.0 // clearance beyond a channel's half width
const KERB_CAP = 6000 // sanity cap on emitted segments

const ZEBRA_CLUSTER_R = 5 // endpoint clustering radius (junctionDiscs law)
const ZEBRA_PULL = 2.2 // crossing sits (renderHalf + 2.2) from cluster centre
const ZEBRA_WATER_MIN = 0.12 // height margin above the water line
const ZEBRA_RIVER_MIN = 1.5 // clearance beyond a channel's half width
const ZEBRA_TARMAC_MAX = 0.6 // roadGap ceiling — must sit ON the mouth
const ZEBRA_DEDUPE = 4 // skip a zebra if another stands within this range
const ZEBRA_CAP = 48

/** the asphalt artery classes that carry kerbs */
function isArtery(r: RoadDef): boolean {
  return r.cls === 'highway' || r.cls === 'major' || r.cls === 'secondary'
}

function renderHalf(cls: string): number {
  return (ROAD_RENDER_W[cls] ?? 2.2) / 2
}

/* --------------------------------- kerbs ----------------------------------- */

export interface KerbRun {
  /** segment start (world units) */
  ax: number
  az: number
  /** segment end (world units) */
  bx: number
  bz: number
}

/**
 * THE KERB LAWS — a candidate kerb point is valid only if ALL hold:
 *  1. heightAt > WATER_Y + 0.12            (never in carved water)
 *  2. outside school yards + civic campus  (fenced ground owns itself)
 *  3. riverInfo.d > halfWidth + 1.0        (never on a bridge span)
 *  4. roadGap >= 0.05                      (on the shoulder — junction
 *                                           mouths break the kerb open)
 *  5. within the walk boundary
 *
 * The chord law extends 4 to the whole run: a prospective segment's
 * midpoint must satisfy the same laws before it may chain (otherwise a
 * sharp-corner chord between two valid samples would cut across the very
 * carriageway the kerb lines). ~97% of law-4 breaks are real junction
 * mouths — the dense Lokoja fabric meeting the arteries.
 */
function validKerbPoint(x: number, z: number): boolean {
  if (heightAt(x, z) <= WATER_Y + KERB_WATER_MIN) return false
  if (inSchoolYard(x, z) || inCivicCampus(x, z)) return false
  const ri = riverInfo(x, z)
  if (ri.d <= ri.halfWidth + KERB_RIVER_MIN) return false
  if (roadGap(x, z) < KERB_GAP_MIN) return false
  if (Math.hypot(x, z) > WALK_BOUND) return false
  return true
}

const kerbRuns: KerbRun[] = []
const kerbRoads: Record<string, number> = {}
let kerbPoints = 0

// the two chain buffers (side 0 = +perpendicular, side 1 = −perpendicular)
const chains: { x: number; z: number }[][] = [[], []]

function flushChain(side: number): void {
  const c = chains[side]
  for (let i = 0; i + 1 < c.length; i++) {
    kerbRuns.push({ ax: c[i].x, az: c[i].z, bx: c[i + 1].x, bz: c[i + 1].z })
  }
  kerbPoints += c.length
  c.length = 0
}

for (const r of ROADS) {
  if (!isArtery(r)) continue
  kerbRoads[r.cls] = (kerbRoads[r.cls] ?? 0) + 1
  chains[0].length = 0
  chains[1].length = 0
  const offset = renderHalf(r.cls) + KERB_SHOULDER
  const pts = r.pts
  let next = 0 // arc position of the next resample
  let walked = 0 // arc position at the start of the current segment
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const seg = Math.hypot(bx - ax, bz - az)
    if (seg < 1e-9) continue
    // unit perpendicular of this segment (markings-builder convention)
    const nx = -(bz - az) / seg
    const nz = (bx - ax) / seg
    while (next <= walked + seg) {
      const t = (next - walked) / seg
      const x = ax + (bx - ax) * t
      const z = az + (bz - az) * t
      next += KERB_STEP
      for (let side = 0; side < 2; side++) {
        const s = side === 0 ? 1 : -1
        const px = x + nx * offset * s
        const pz = z + nz * offset * s
        const c = chains[side]
        if (!validKerbPoint(px, pz)) {
          flushChain(side) // any invalid point terminates the run
          continue
        }
        const last = c[c.length - 1]
        if (last) {
          const span = Math.hypot(px - last.x, pz - last.z)
          // chord law: the run is only as strong as its weakest point — the
          // midpoint of a prospective segment must satisfy the same laws
          const midOk = validKerbPoint((last.x + px) / 2, (last.z + pz) / 2)
          if (span > KERB_CHAIN_MAX || !midOk) {
            flushChain(side) // a gap > 5u or an invalid point terminates the run
          }
        }
        chains[side].push({ x: px, z: pz })
      }
    }
    walked += seg
  }
  flushChain(0)
  flushChain(1)
}

const KERB_RUNS_BEFORE_CAP = kerbRuns.length

/** kerb segments along both edges of every asphalt artery (deterministic) */
export const KERB_RUNS: KerbRun[] =
  KERB_RUNS_BEFORE_CAP > KERB_CAP ? kerbRuns.slice(0, KERB_CAP) : kerbRuns

/** { runs, points, roads by cls } + honest cap bookkeeping, for tests */
export function kerbStats(): {
  runs: number
  points: number
  roads: Record<string, number>
  runsBeforeCap: number
  truncated: boolean
} {
  return {
    runs: KERB_RUNS.length,
    points: kerbPoints,
    roads: { ...kerbRoads },
    runsBeforeCap: KERB_RUNS_BEFORE_CAP,
    truncated: KERB_RUNS_BEFORE_CAP > KERB_CAP,
  }
}

/* --------------------------------- zebras ---------------------------------- */

export interface ZebraDef {
  /** crossing centre on the road (world units) */
  x: number
  z: number
  /** the road's yaw — stripes will be laid across */
  rotY: number
  /** the road's render half-width */
  half: number
}

interface ArteryEnd {
  x: number
  z: number
  road: RoadDef
  isStart: boolean
}

// every MAJOR artery's first/last polyline point, in ROADS array order —
// the exact input set the road renderer's junctionDiscs clusters
const arteryEnds: ArteryEnd[] = []
for (const r of ROADS) {
  if (!r.major) continue
  arteryEnds.push({ x: r.pts[0][0], z: r.pts[0][1], road: r, isStart: true })
  const last = r.pts[r.pts.length - 1]
  arteryEnds.push({ x: last[0], z: last[1], road: r, isStart: false })
}

const zebras: ZebraDef[] = []
const zebraClasses: string[] = [] // parallel to zebras — source road's cls
const endUsed = arteryEnds.map(() => false)

for (let i = 0; i < arteryEnds.length; i++) {
  if (zebras.length >= ZEBRA_CAP) break
  if (endUsed[i]) continue
  endUsed[i] = true
  const first = arteryEnds[i]
  const members: ArteryEnd[] = [first]
  let cx = first.x
  let cz = first.z
  for (let j = i + 1; j < arteryEnds.length; j++) {
    if (endUsed[j]) continue
    if (Math.hypot(first.x - arteryEnds[j].x, first.z - arteryEnds[j].z) < ZEBRA_CLUSTER_R) {
      endUsed[j] = true
      members.push(arteryEnds[j])
      cx += arteryEnds[j].x
      cz += arteryEnds[j].z
    }
  }
  if (members.length < 2) continue // a lone endpoint is no junction
  cx /= members.length
  cz /= members.length
  // one crossing per artery arm that ENTERS the cluster, in member order
  for (const m of members) {
    if (zebras.length >= ZEBRA_CAP) break
    // arm direction: from the cluster centre toward this arm's endpoint
    let dx = m.x - cx
    let dz = m.z - cz
    let len = Math.hypot(dx, dz)
    if (len < 0.25) {
      // degenerate (endpoint sits on the cluster centre) — fall back to the
      // arm's own direction "from the endpoint back along the road"
      const p = m.isStart ? m.road.pts[1] : m.road.pts[m.road.pts.length - 2]
      dx = p[0] - m.x
      dz = p[1] - m.z
      len = Math.hypot(dx, dz)
      if (len < 1e-9) continue
    }
    const dirX = dx / len
    const dirZ = dz / len
    const half = renderHalf(m.road.cls)
    const x = cx - dirX * (half + ZEBRA_PULL)
    const z = cz - dirZ * (half + ZEBRA_PULL)
    // THE ZEBRA LAWS — all must hold:
    if (inSchoolYard(x, z) || inCivicCampus(x, z)) continue
    if (heightAt(x, z) <= WATER_Y + ZEBRA_WATER_MIN) continue
    const ri = riverInfo(x, z)
    if (ri.d <= ri.halfWidth + ZEBRA_RIVER_MIN) continue
    if (roadGap(x, z) > ZEBRA_TARMAC_MAX) continue // must sit ON the mouth
    // dedupe: skip if another zebra already stands within 4u
    let dup = false
    for (const zb of zebras) {
      if (Math.hypot(zb.x - x, zb.z - z) < ZEBRA_DEDUPE) {
        dup = true
        break
      }
    }
    if (dup) continue
    zebras.push({ x, z, rotY: Math.atan2(dirX, dirZ), half })
    zebraClasses.push(m.road.cls)
  }
}

/** zebra crossings at major-artery junction mouths (deterministic, ≤ 48) */
export const ZEBRAS: ZebraDef[] = zebras

/** { count, byClass (source road's cls) } — for tests */
export function zebraStats(): { count: number; byClass: Record<string, number> } {
  const byClass: Record<string, number> = {}
  for (const cls of zebraClasses) {
    byClass[cls] = (byClass[cls] ?? 0) + 1
  }
  return { count: ZEBRAS.length, byClass }
}
