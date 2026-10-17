/**
 * LOKOJA LIFE — W1 ROAD SIDES: OPEN U-DRAINS (the corridor law)
 * -------------------------------------------------------------
 * A Nigerian arterial street without open drainage gutters is not real.
 * This module derives the roadside U-drain network from the same real
 * Lokoja road graph the kerbs come from (roads.ts pattern: pure
 * deterministic numbers, NO three.js, NO React, NO DOM).
 *
 * THE CHANNEL: one concrete U-channel per artery side, centre at
 * renderHalf + 1.15, half-width 0.275 (channel band renderHalf+0.875
 * .. +1.425). The band clears the kerb line (+0.34, its outer edge
 * +0.45), clears the lamp shoulders (+0.62), and stays inside the
 * flora street-row floor (+2.2) — the corridor ladder reads:
 *   tarmac | kerb 0.34 | DRAIN 0.875–1.425 | lamp 0.62* | poles 2.0 | trees 2.54+
 *   (* lamp arm reaches ACROSS the carriageway; its pole stands clear)
 *
 * THE 1:100 FALL LAW (the heart of W1): drain water flows by gravity,
 * so along the downstream direction the invert (channel floor) is
 * monotonic non-increasing and EVERY segment falls at least 1:100
 * (drop ≥ 0.01 × segment length). Where the terrain itself falls
 * faster than 1:100 the floor hugs a minimum 0.22 cover below the
 * surface; where the surface is flat the floor digs deeper as real
 * gutters do, until the dig exceeds MAX_DIG (0.55) — there a CATCH PIT
 * resets the invert (a real municipal drain resets at pits/outfalls,
 * it never digs to China). Depth invariant: cover ∈ [0.22, 0.55].
 *
 * THE CROSSING LAWS:
 *  - SLAB COVERS where pedestrians cross: every drain segment within
 *    ZEBRA_COVER_R of a zebra crossing gets a concrete slab cover (the
 *    footpath lands on the gutter — it is covered, not jumped).
 *  - BOX CULVERTS where side roads cross: when a drain candidate is
 *    invalid ONLY because a carriageway crosses the band (all other
 *    laws pass), that break point is a crossing — the drain goes under
 *    the side road through a box culvert with headwalls. Never on its
 *    own artery (the channel runs parallel to it, by construction).
 *
 * THE GEO GATE (repo law): headless bun consumers must import
 * scripts/geo/bootstrap.ts FIRST — this file only ever imports from
 * './layout' and './roads', both gate-safe.
 */

import {
  ROADS,
  ROAD_RENDER_W,
  WALK_BOUND,
  WATER_Y,
  heightAt,
  inCivicCampus,
  inSchoolYard,
  LAMPS,
  riverInfo,
  roadGap,
  type RoadDef,
} from './layout'
import { UTILITY_POLES } from './props'
import { ZEBRAS } from './roads'

/* ------------------------------ tunable laws ------------------------------- */

const DRAIN_STEP = 4 // resample pitch along the artery polyline (kerb-walk law)
const DRAIN_OFFSETS = [1.15, 1.75] // candidate verge offsets — the drain
// steps OUTSIDE frontage roads, but never past the W2 contract: the flora
// street rows stand 2.54+ from the edge, so the band stays ≤ 2.075
const DRAIN_HALF_W = 0.275 // channel half-width (0.55 wide band)
const DRAIN_GAP_MIN = 0.45 // roadGap floor at the channel centre — the whole
// band (centre ±0.325) stays clear of every carriageway edge
const CROSS_GAP_MAX = 0.8 // a carriageway edge within this = a crossing (culvert)
const FURNITURE_CLEAR = 0.45 // the channel jogs around lamp/pole posts (real gutters)
const DRAIN_WATER_MIN = 0.12 // height margin above the water line
const DRAIN_RIVER_MIN = 1.0 // clearance beyond a channel's half width
const DRAIN_CHAIN_MAX = 5 // max distance between chained points (kerb law)
const DRAIN_CAP = 1800 // sanity cap on emitted channel segments

const MIN_COVER = 0.22 // floor never shallower than this under the surface
const START_DEPTH = 0.30 // invert depth at the head of every run
const MAX_DIG = 0.55 // deeper than this → catch pit resets the invert
const FALL = 0.01 // THE 1:100 LAW — gravity drainage, water flows the right way

const ZEBRA_COVER_R = 2.6 // a drain segment this close to a zebra gets a slab
const CULVERT_DEDUPE = 3.5 // skip a second culvert within this range of one
const CULVERT_CAP = 90

/** the asphalt artery classes that carry open drains (the loud corridors) */
function isDrainRoad(r: RoadDef): boolean {
  return r.cls === 'highway' || r.cls === 'major'
}

function renderHalf(cls: string): number {
  return (ROAD_RENDER_W[cls] ?? 2.2) / 2
}

/* ------------------------------ drain channel ------------------------------ */

export interface DrainSeg {
  /** segment start (world units) — flow DOWNSTREAM from ax,az to bx,bz */
  ax: number
  az: number
  ay: number // surface height at the start
  /** segment end */
  bx: number
  bz: number
  by: number // surface height at the end
  /** invert (channel floor) height at start / end — the 1:100 law lives here */
  fa: number
  fb: number
  /** the artery class this side of the channel serves */
  cls: string
  /** slab cover on this segment (zebra footpath or catch-pit grate) */
  cover: 0 | 1 | 2 // 0 open, 1 slab (zebra), 2 grate (catch pit)
  /** 1 = this segment's END is a catch pit: the invert RISES there through
   *  a vertical drop structure (water falls through the grate) — the only
   *  lawful exception to the monotonic 1:100 fall */
  pit: 0 | 1
}

export interface DrainPit {
  x: number
  z: number
  y: number // surface height at the pit head
  rotY: number // along the run
}

export interface DrainCulvert {
  x: number
  z: number
  y: number // surface height at the crossing
  rotY: number // the drain's own yaw — the box opening faces along it
  /** the crossing road's class ('' if unresolved — still culverted) */
  crossCls: string
  /** deck span across the crossing (world units) — a side SWITCH crosses
   *  the artery itself, so its deck is the artery's width */
  span: number
  /** 1 = a zebra lands here: the deck wears a pedestrian slab cover */
  covered: 0 | 1
}

export interface DrainStats {
  segs: number
  segsBeforeCap: number
  truncated: boolean
  chains: number
  pits: number
  culverts: number
  covers: number
  /** total channel arc length (world units) */
  length: number
  /** min cover observed over the whole network (must be ≥ MIN_COVER − ε) */
  minCover: number
  /** worst segment fall ratio (must be ≥ FALL − ε; 1 = exactly 1:100 or better) */
  minFallRatio: number
  outfalls: number // chains ending within 3u of carved water — natural outfalls
  zebraCovers: number // segments slabbed because a zebra lands on them
}

const segs: DrainSeg[] = []
const pits: DrainPit[] = []
const culverts: DrainCulvert[] = []
let chainCount = 0
let outfalls = 0
let worstCover = Infinity
let worstFall = Infinity
let arcLen = 0

/**
 * THE DRAIN POINT LAWS — a candidate channel point is valid only if ALL
 * hold: height above water, outside fenced ground, off bridge spans, not
 * ON any carriageway (gap ≥ 0.12 — the channel dies only on tarmac), not
 * inside a lamp/pole post (the channel jogs around furniture, 0.45 clear
 * — a gutter never swallows a pole), inside the walk bound.
 */
function validDrainPoint(x: number, z: number): boolean {
  if (heightAt(x, z) <= WATER_Y + DRAIN_WATER_MIN) return false
  if (inSchoolYard(x, z) || inCivicCampus(x, z)) return false
  const ri = riverInfo(x, z)
  if (ri.d <= ri.halfWidth + DRAIN_RIVER_MIN) return false
  if (roadGap(x, z) < DRAIN_GAP_MIN) return false
  for (const l of LAMPS) {
    if (Math.hypot(l.x - x, l.z - z) < FURNITURE_CLEAR) return false
  }
  for (const p of UTILITY_POLES) {
    if (Math.hypot(p.x - x, p.z - z) < FURNITURE_CLEAR) return false
  }
  return Math.hypot(x, z) <= WALK_BOUND
}

/** a crossing point: a carriageway encroaches the band — the drain's
 *  chain breaks there and the gap later grows a box culvert */
function isCrossingPoint(x: number, z: number): boolean {
  if (heightAt(x, z) <= WATER_Y + DRAIN_WATER_MIN) return false
  if (inSchoolYard(x, z) || inCivicCampus(x, z)) return false
  const ri = riverInfo(x, z)
  if (ri.d <= ri.halfWidth + DRAIN_RIVER_MIN) return false
  if (Math.hypot(x, z) > WALK_BOUND) return false
  return roadGap(x, z) < CROSS_GAP_MAX
}

/** nearest NON-artery road segment yaw within 3.5u (for the culvert record) */
function nearestSideRoadYaw(x: number, z: number, own: RoadDef): { yaw: number; cls: string } | null {
  let best = 3.5
  let hit: { yaw: number; cls: string } | null = null
  for (const r of ROADS) {
    if (r === own || isDrainRoad(r)) continue
    for (let i = 0; i < r.pts.length - 1; i++) {
      const ax = r.pts[i][0]
      const az = r.pts[i][1]
      const bx = r.pts[i + 1][0]
      const bz = r.pts[i + 1][1]
      const dx = bx - ax
      const dz = bz - az
      const len2 = dx * dx + dz * dz
      if (len2 < 1e-9) continue
      let t = ((x - ax) * dx + (z - az) * dz) / len2
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const px = ax + dx * t
      const pz = az + dz * t
      const d = Math.hypot(px - x, pz - z)
      if (d < best) {
        best = d
        hit = { yaw: Math.atan2(dx, dz), cls: r.cls }
      }
    }
  }
  return hit
}

interface ChainPt {
  x: number
  z: number
  y: number // surface
}

/** THE FALL LAW, applied to one chain in flow order — see the header maths */
function layInvert(chain: ChainPt[], cls: string, lastYaw: number): void {
  if (chain.length < 2) return
  chainCount++
  // downstream = the end that stands lower; the profile runs that way
  const downstream = chain[chain.length - 1].y < chain[0].y
  const flow = downstream ? chain : [...chain].reverse()
  // natural outfall: the run's mouth reaches carved water
  const mouth = flow[flow.length - 1]
  if (heightAt(mouth.x, mouth.z) <= WATER_Y + 0.12) outfalls++
  const n = flow.length
  const floors = new Array<number>(n)
  floors[0] = flow[0].y - START_DEPTH
  for (let i = 1; i < n; i++) {
    const px = flow[i - 1].x
    const pz = flow[i - 1].z
    const qx = flow[i].x
    const qz = flow[i].z
    const segLen = Math.hypot(qx - px, qz - pz)
    const want = floors[i - 1] - FALL * segLen // gravity: always ≥ 1:100 down
    const cap = flow[i].y - MIN_COVER // never shallower than MIN_COVER
    let f = Math.min(want, cap)
    const dig = flow[i].y - f
    let isPit: 0 | 1 = 0
    if (dig > MAX_DIG) {
      f = flow[i].y - START_DEPTH // CATCH PIT — the invert resets, depth 0.30
      isPit = 1
      pits.push({ x: qx, z: qz, y: flow[i].y, rotY: lastYaw })
    }
    floors[i] = f
    if (!isPit) {
      worstCover = Math.min(worstCover, flow[i].y - f)
      worstFall = Math.min(worstFall, (floors[i - 1] - f) / Math.max(segLen, 1e-9))
    }
    arcLen += segLen
    segs.push({
      ax: px, az: pz, ay: flow[i - 1].y,
      bx: qx, bz: qz, by: flow[i].y,
      fa: floors[i - 1], fb: f,
      cls,
      cover: isPit ? 2 : 0, // the pit head wears its grate
      pit: isPit,
    })
  }
}

/* --------------------- the walk (roads.ts kerb pattern) -------------------- */

const chainsBuf: { pts: ChainPt[]; lastYaw: number; cls: string; side: number; road: RoadDef }[] = []

/**
 * THE SIDE-SELECTION + SIDE-SWITCH LAW (municipal honesty). Where a
 * parallel carriageway (dual way / service road) occupies a verge, the
 * gutter cannot run there — real engineers put it on the buildable side,
 * and when the buildable side dies mid-street the gutter crosses UNDER
 * the road at a junction and continues on the far verge. So: each artery
 * starts on its more viable side (8u pre-scan), walks the arc, and when
 * the running side fails while the far side stands free, the channel
 * switches sides through a road-width culvert. Both sides viable for the
 * whole street → the walk never switches; the street simply drains both
 * verges across its life.
 */
function sideViability(r: RoadDef, side: 0 | 1, offset: number): number {
  const s = side === 0 ? 1 : -1
  let total = 0
  let ok = 0
  const pts = r.pts
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i]
    const [bx, bz] = pts[i + 1]
    const seg = Math.hypot(bx - ax, bz - az)
    if (seg < 1e-9) continue
    const nx = -(bz - az) / seg
    const nz = (bx - ax) / seg
    for (let d = 0; d <= seg; d += 8) {
      const t = d / seg
      const x = ax + (bx - ax) * t + nx * offset * s
      const z = az + (bz - az) * t + nz * offset * s
      total++
      if (heightAt(x, z) <= WATER_Y + DRAIN_WATER_MIN) continue
      if (inSchoolYard(x, z) || inCivicCampus(x, z)) continue
      const ri = riverInfo(x, z)
      if (ri.d <= ri.halfWidth + DRAIN_RIVER_MIN) continue
      if (roadGap(x, z) < DRAIN_GAP_MIN) continue
      if (Math.hypot(x, z) > WALK_BOUND) continue
      ok++
    }
  }
  return total ? ok / total : 0
}

/** dedupe + record a culvert */
function putCulvert(x: number, z: number, y: number, rotY: number, crossCls: string, span: number): boolean {
  if (culverts.length >= CULVERT_CAP) return false
  for (const c of culverts) {
    if (Math.hypot(c.x - x, c.z - z) < CULVERT_DEDUPE) return false
  }
  culverts.push({ x, z, y, rotY, crossCls, span, covered: 0 })
  return true
}

{
  for (const r of ROADS) {
    if (!isDrainRoad(r)) continue
    const half = renderHalf(r.cls)
    const pts = r.pts
    // THE OFFSET LAW: each side drains at its OWN best offset of the
    // candidates — the gutter runs at the corridor's buildable outer edge,
    // stepping outside minor frontage roads that would bury it in tarmac.
    // A side with no buildable offset simply has no gutter (the mapped
    // fabric owns the verge — the same siting truth the M22 kerbs follow).
    const offsets: number[] = []
    const sides: number[] = []
    for (const side of [0, 1] as const) {
      let bestV = -1
      let bestOff = -1
      for (const off of DRAIN_OFFSETS) {
        const v = sideViability(r, side, half + off)
        if (v > bestV) {
          bestV = v
          bestOff = off
        }
      }
      if (bestV > 0.12) {
        sides.push(side)
        offsets.push(half + bestOff)
      }
    }
    for (let si = 0; si < sides.length; si++) {
      const side = sides[si]
      const offset = offsets[si]
      const s = side === 0 ? 1 : -1
      let cur: ChainPt[] = []
      let curYaw = 0
      let next = 0
      let walked = 0
      const flush = (): void => {
        if (cur.length) {
          chainsBuf.push({ pts: cur, lastYaw: curYaw, cls: r.cls, side, road: r })
          cur = []
        }
      }
      for (let i = 0; i < pts.length - 1; i++) {
        const [ax, az] = pts[i]
        const [bx, bz] = pts[i + 1]
        const seg = Math.hypot(bx - ax, bz - az)
        if (seg < 1e-9) continue
        const nx = -(bz - az) / seg
        const nz = (bx - ax) / seg
        const yaw = Math.atan2(bx - ax, bz - az)
        while (next <= walked + seg) {
          const t = (next - walked) / seg
          const x = ax + (bx - ax) * t
          const z = az + (bz - az) * t
          next += DRAIN_STEP
          const px = x + nx * offset * s
          const pz = z + nz * offset * s
          const last = cur[cur.length - 1]
          if (validDrainPoint(px, pz)) {
            if (last) {
              const span = Math.hypot(px - last.x, pz - last.z)
              const midOk = validDrainPoint((last.x + px) / 2, (last.z + pz) / 2)
              if (span > DRAIN_CHAIN_MAX || !midOk) flush()
            }
            cur.push({ x: px, z: pz, y: heightAt(px, pz) })
            curYaw = yaw
          } else {
            // THE CHAIN BREAK: a carriageway encroaches the band. The
            // culvert is derived AFTER the walk from the chain gaps —
            // a box culvert connects two live channels; a gutter that
            // dead-ends into nowhere gets none (real engineering).
            flush()
          }
        }
        walked += seg
      }
      flush()
    }
  }
  // lay every chain's invert, then derive culverts from the gaps
  for (const c of chainsBuf) layInvert(c.pts, c.cls, c.lastYaw)
  for (let i = 0; i + 1 < chainsBuf.length; i++) {
    const A = chainsBuf[i]
    const B = chainsBuf[i + 1]
    if (A.road !== B.road || A.side !== B.side) continue // only same-run gaps on the SAME street
    if (A.pts.length < 2 || B.pts.length < 2) continue // a one-point chain laid no channel — nothing to bridge
    const tail = A.pts[A.pts.length - 1]
    const head = B.pts[0]
    const gap = Math.hypot(head.x - tail.x, head.z - tail.z)
    if (gap < DRAIN_STEP + 0.5 || gap > 11) continue
    const mx = (tail.x + head.x) / 2
    const mz = (tail.z + head.z) / 2
    // a culvert needs a ROAD to pass under — furniture jogs get none
    if (roadGap(mx, mz) > 0.95) continue
    const yaw = Math.atan2(head.x - tail.x, head.z - tail.z)
    const cross = nearestSideRoadYaw(mx, mz, ROADS[0])
    const crossSpan = cross ? (ROAD_RENDER_W[cross.cls] ?? 2.2) + 1.4 : 2.4
    putCulvert(mx, mz, heightAt(mx, mz), yaw, cross?.cls ?? '', crossSpan)
  }
  chainsBuf.length = 0
}

const SEGS_BEFORE_CAP = segs.length
export const DRAIN_SEGS: DrainSeg[] = SEGS_BEFORE_CAP > DRAIN_CAP ? segs.slice(0, DRAIN_CAP) : segs
export const DRAIN_PITS: DrainPit[] = pits
export const DRAIN_CULVERTS: DrainCulvert[] = culverts

/* ------------------------- slab covers at zebras --------------------------- */

// THE PEDESTRIAN LAW: where a zebra lands on the drain line the gutter is
// covered, never hopped. Two cases: (1) a channel segment within 2.6u of
// the crossing gets a slab; (2) the mouths — exactly where the culverts
// sit — get the deck itself slabbed (real streets: you cross ON the
// culvert). One cover per zebra, never double-slapping a grate.
let zebraCovers = 0
for (const z of ZEBRAS) {
  // the drain runs PARALLEL to the zebra's street, ~half+1.15..1.75 to the
  // side — centre-to-centre distance is the wrong metric. Decompose the
  // offset into the zebra's own axes: across = perpendicular to rotY (the
  // lateral hop onto the verge), along = parallel (the mouth arc).
  const ux = Math.sin(z.rotY)
  const uz = Math.cos(z.rotY)
  let served = false
  for (const s of DRAIN_SEGS) {
    if (s.cover !== 0) continue
    const mx = (s.ax + s.bx) / 2
    const mz = (s.az + s.bz) / 2
    const dx = mx - z.x
    const dz = mz - z.z
    const along = Math.abs(dx * ux + dz * uz)
    const across = Math.abs(dx * -uz + dz * ux)
    if (across <= z.half + 2.2 && along <= 3.0) {
      s.cover = 1
      zebraCovers++
      served = true
      break
    }
  }
  if (served) continue
  // no channel at the mouth — the culvert deck is the cover (real streets:
  // you cross ON the culvert)
  let bestC = 4.0
  let bestCul: DrainCulvert | null = null
  for (const c of culverts) {
    const d = Math.hypot(c.x - z.x, c.z - z.z)
    if (d < bestC) {
      bestC = d
      bestCul = c
    }
  }
  if (bestCul && bestCul.covered === 0) {
    bestCul.covered = 1
    zebraCovers++
  }
}

/* --------------------------------- stats ----------------------------------- */

export function drainStats(): DrainStats {
  return {
    segs: DRAIN_SEGS.length,
    segsBeforeCap: SEGS_BEFORE_CAP,
    truncated: SEGS_BEFORE_CAP > DRAIN_CAP,
    chains: chainCount,
    pits: pits.length,
    culverts: culverts.length,
    covers: DRAIN_SEGS.filter((s) => s.cover !== 0).length,
    length: arcLen,
    minCover: Number.isFinite(worstCover) ? worstCover : 0,
    minFallRatio: Number.isFinite(worstFall) ? worstFall : 0,
    outfalls,
    zebraCovers,
  }
}

export const DRAIN_MIN_COVER = MIN_COVER
export const DRAIN_MAX_DIG = MAX_DIG
export const DRAIN_FALL = FALL
