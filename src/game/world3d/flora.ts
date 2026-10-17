/**
 * LOKOJA LIFE — M23 W2: THE GREEN (flora placement engine)
 * --------------------------------------------------------
 * Pure deterministic placement data for the Kogi tree guild + the 10k
 * savanna grass scatter. NO three.js, NO React, NO DOM — plain TypeScript
 * numbers so bun can run it headless and the renderer can instance the
 * rows straight from these arrays (geometry lives in flora-species.ts,
 * which this module NEVER imports — placement and geometry are siblings).
 *
 *  - FLORA_TREES: one TreeInstance array per SpeciesId — STREET ROWS of
 *    alternating neem/mango along every asphalt artery, RIVERINE GROVES
 *    of raffia + oil palm on the wet margins, PLANTAIN clusters tucked
 *    behind compound buildings, iroko + baobab LANDMARKS, and the
 *    open-savanna SCATTER (acacia/shea/cashew + spare mango/neem) that
 *    fills the remaining cap. The legacy 'tree'/'palm' keys ship EMPTY
 *    (the generic blobs are superseded; school compounds plant their own
 *    SCHOOL_TREES at render time).
 *  - GRASS_TUFTS: layout.GRASS's moisture-gradient law at 10k tufts,
 *    upgraded to the M22 clearance grade (off the tarmac AND shoulders).
 *
 * THE PLACEMENT LAW (the W2 upgrade): trees are clearance-probed like the
 * M22 parked fleet, never scattered blind. Every candidate must clear the
 * rendered carriageways (roadGap), the kerb lines, the zebra mouths, the
 * lamps, the parked bays, the stalls, every building footprint, the
 * anchor plazas, the street furniture, the school compounds and the
 * water, and honour its species minSpacing against every accepted trunk
 * through ONE 8u cell hash built over the accepted set (grid-reuse
 * spirit — no O(n²) sweep, no new spatial index beyond that one hash).
 * A candidate that fails any law is counted in stats and skipped; nothing
 * is ever forced (landmark shortfalls are recorded honestly).
 *
 * W1 FUTURE-PROOFING: street rows stand 2.2..3.4 beyond the kerb line
 * (roads.ts's kerb sits at renderHalf + 0.34), so the W1 U-drain band
 * that will occupy the kerb-1.2u strip never collides with a trunk.
 *
 * THE GEO GATE (repo law): layout.ts derives its module-scope world from
 * the geo arrays, which the browser fills before the world chunk is ever
 * evaluated. Headless bun consumers must import scripts/geo/bootstrap.ts
 * FIRST (the established CLI pattern for every layout-derived module —
 * see roads.ts). In-app this module is imported from behind the geo gate
 * (the world chunk) exactly like layout/roads; it imports vehicles.ts +
 * props.ts for their parked-bay and street-furniture probe lists only.
 *
 * Determinism: makeRng with fixed seeds only, one draw per decision where
 * practical, single module-scope build cached in consts. Math.random is
 * forbidden by repo law and appears nowhere in this file.
 */

import {
  ANCHORS,
  ANCHOR_BY_ID,
  BUILDINGS,
  LAMPS,
  MOUNT_PATTI,
  ROAD_RENDER_W,
  ROADS,
  SCHOOL_SITES,
  STALLS,
  WALK_BOUND,
  WATER_Y,
  heightAt,
  inCivicCampus,
  inSchoolYard,
  makeRng,
  riverInfo,
  roadGap,
  type BuildingDef,
  type RoadDef,
} from './layout'
import { KERB_RUNS, ZEBRAS } from './roads'
import { PARKED_VEHICLES } from './vehicles'
import { ROAD_SIGNS, SHELTERS, UTILITY_POLES } from './props'
import {
  SPECIES_IDS,
  SPECIES_META,
  type FloraMap,
  type FloraStats,
  type GrassStats,
  type GrassTuft,
  type SpeciesId,
  type TreeInstance,
} from './flora-types'

/* ------------------------------ tunable laws ------------------------------- */

const TAU = Math.PI * 2

// — street rows —
const STREET_STEP = 4 // resample pitch along the artery polyline (kerb-walk law)
const KERB_LINE = 0.34 // kerb offset beyond the rendered edge (roads.ts law)
const STREET_SETBACK = 2.2 // min setback beyond the kerb line (W1 drain band)
const STREET_SETBACK_JITTER = 1.0 // seeded jitter → setback 2.2..3.2
const STREET_SIDE_SPACING = 9 // per-side arc spacing — the rows must READ as
// rows: the first draft's 13u starved the showpiece to a tree every other
// streetlight (the home stretch stood bare for 30u — caught by the witness)
const ROW_GAP_MIN = 1.5 // carriageway/tarmac law
const ROW_WATER_MIN = 0.35 // height floor above the water line
const ROW_RIVER_MIN = 3.0 // clearance beyond a channel's half width

// — the shared clearance set (every placement path, ×mult for landmarks) —
const KERB_CLEAR = 2.0 // trunk vs any kerb point
const ZEBRA_CLEAR = 4.4
const LAMP_CLEAR = 1.7
const BAY_CLEAR = 5.5 // parked-vehicle bays
const STALL_CLEAR = 2.6
const BUILDING_PAD = 2.2 // beyond max(w,d)*0.75
const ANCHOR_CLEAR = 9 // anchor plazas keep an open ring — the first draft's
// 12u starved every anchor-adjacent street (home stood bare for 30u); the
// buildings/plaza structures themselves stay law-cleared by BUILDINGS
const POLE_CLEAR = 1.6 // utility poles / road signs / shelters
const SCHOOL_CLEAR = 2 // beyond a compound's plateauR
const BOUND_MARGIN = 2 // inside WALK_BOUND - 2

// — scatter / groves / plantain / landmarks —
const TREE_CAP = 720 // hard total-tree cap (law G) — the guild sits at
// ~5 tris/tree average, so +60 slots cost ~300 tris and zero draw calls
const SCATTER_GUARD = 26000 // the old scatterTrees guard discipline
const TREELINE_Y = 26 // sparse above the Patti slopes' treeline
const PATTI_BOOST_R = 110 // denser around the guardian hill (old law)
const GROVE_CENTRES = 14 // 14-16 grove centres — the wet-margin show the
// guild promises (the first draft's 6 starved to 11 palms: the near-river
// band is eaten by anchor plazas, riverfront roads and marsh)
const GROVE_CENTRE_GUARD = 3000
const GROVE_RIVER_MIN = 4 // palms in [halfWidth+4, halfWidth+34]
const GROVE_RIVER_MAX = 34 // wide enough to hold the ring around a +26 centre
const GROVE_WET_SPLIT = 16 // raffia below, oil palm above (d < hw + 16)
const GROVE_WATER_MIN = 0.4 // grove height floor (wetter ground than rows)
const PLANTAIN_CLUSTERS = 14
const PLANTAIN_GAP_MIN = 1.2 // behind-building roadGap floor (law E)
const PLANTAIN_PAD = 2.3 // beyond the 0.75 envelope (task's 1.8 nominal,
//  lifted to hold the suite's +2.15 envelope law with margin — the true
//  wall sits deeper inside the envelope, so the wall gap is larger still)
const PLANTAIN_PAD_JITTER = 1.1 // → stems 2.3..3.4 beyond the envelope
const LANDMARK_DRAWS = 4000
const LANDMARK_GAP_MULT = 2 // landmarks clear EVERYTHING at twice standard
const IROKO_TARGET = 3
const BAOBAB_TARGET = 2
const IROKO_SLOPE_MAX = 0.12
const BAOBAB_SLOPE_MAX = 0.15
const BAOBAB_MOISTURE_MAX = 0.4 // laterite flats, away from the wet margins
const CORE_RING_MIN = 60 // landmark preference ring around the city core
const CORE_RING_MAX = 110

// — grass —
const GRASS_TARGET = 10000
const GRASS_GUARD = 60000
const GRASS_GAP_MIN = 0.7 // off the tarmac AND its shoulders (W2 upgrade)
const GRASS_WATER_MIN = 0.15
const GRASS_RIVER_MIN = 0.5
const GRASS_MARGIN = 0.05 // acceptance cushion — no razor-thin tufts

// — the one spacing structure: an 8u cell hash over ACCEPTED trunks —
const SPACING_CELL = 8
const SPACING_Q_R = 3 // ceil(max meta minSpacing 20 / 8) — provably covers
//  every trunk within hypot < 20 of a candidate (the largest meta law)

/** flora-species.ts owns the colours; placement only needs the row count
 *  (3 tones per species, which the geometry side mirrors) */
const TONE_ROWS = 3

/* ------------------------- the building cell hash --------------------------- */

/**
 * BUILDINGS bucketed into 16u cells, registered at the WORST-case reach
 * (0.75 envelope + BUILDING_PAD × 2 — landmarks probe at mult 2), so no
 * probe ever sweeps the whole building array: the grass's 10k candidates
 * each touch ~1 cell of ~2 buildings instead of ~400 hypots. Grid-reuse
 * over the building set — the same law the seg-grid follows for roads.
 */
const BLD_CELL = 16
const bldCells: Map<string, BuildingDef[]> = new Map()
for (const b of BUILDINGS) {
  const r = Math.max(b.w, b.d) * 0.75 + BUILDING_PAD * 2
  for (let ix = Math.floor((b.x - r) / BLD_CELL); ix <= Math.floor((b.x + r) / BLD_CELL); ix++) {
    for (let iz = Math.floor((b.z - r) / BLD_CELL); iz <= Math.floor((b.z + r) / BLD_CELL); iz++) {
      const k = `${ix}:${iz}`
      const arr = bldCells.get(k)
      if (arr) arr.push(b)
      else bldCells.set(k, [b])
    }
  }
}

/** the one building-envelope probe (pad = the 0.75-envelope margin) */
function nearBuilding(x: number, z: number, pad: number): boolean {
  const arr = bldCells.get(`${Math.floor(x / BLD_CELL)}:${Math.floor(z / BLD_CELL)}`)
  if (!arr) return false
  for (const b of arr) {
    if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.75 + pad) return true
  }
  return false
}

/* ------------------------------ probe machinery ---------------------------- */

/** the asphalt artery classes that carry street rows (roads.ts law) */
function isArtery(r: RoadDef): boolean {
  return r.cls === 'highway' || r.cls === 'major' || r.cls === 'secondary'
}

function renderHalf(cls: string): number {
  return (ROAD_RENDER_W[cls] ?? 2.2) / 2
}

/** KERB_RUNS flattened to its chained points (both ends of every segment) */
const KERB_PTS: [number, number][] = []
for (const k of KERB_RUNS) {
  KERB_PTS.push([k.ax, k.az], [k.bx, k.bz])
}

/**
 * THE SHARED CLEARANCE PROBE — one law set for every placement path.
 * Returns a reject reason (for the honest stats) or null when the spot is
 * legal. `mult` scales the DISTANCE clearances (landmarks clear everything
 * at twice standard); `gapMin` and `waterMin` let the street rows / groves
 * / plantain tune their own tarmac and water floors.
 *
 * THE KERB/LAMP SCANS ARE UNCONDITIONAL. An earlier draft skipped them via
 * a triangle-inequality proof ("every kerb at roadGap <= 0.34, every lamp
 * at <= 1.62") — M22's own suite numbers disprove both bounds (kerb chain
 * points reach roadGap 0.584; plaza/rim lamps sit beyond 1.62 off-tarmac)
 * and the shortcut leaked a real lamp violation in the W2 smoke. A full
 * scan is ~600k hypots over the whole build — single-digit ms. LAWS OVER
 * PROOFS THAT AREN'T.
 */
function clearOfTown(x: number, z: number, mult: number, gapMin: number, waterMin: number): string | null {
  if (heightAt(x, z) <= WATER_Y + waterMin) return 'water'
  if (Math.hypot(x, z) > WALK_BOUND - BOUND_MARGIN) return 'bound'
  if (inSchoolYard(x, z) || inCivicCampus(x, z)) return 'school'
  for (const sp of SCHOOL_SITES) {
    if (Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + SCHOOL_CLEAR * mult) return 'school'
  }
  const g = roadGap(x, z)
  if (g < gapMin) return 'roadgap'
  const ri = riverInfo(x, z)
  if (ri.d < ri.halfWidth + ROW_RIVER_MIN * mult) return 'river'
  for (const st of STALLS) {
    if (Math.hypot(st.x - x, st.z - z) < STALL_CLEAR * mult) return 'stall'
  }
  for (const p of UTILITY_POLES) {
    if (Math.hypot(p.x - x, p.z - z) < POLE_CLEAR * mult) return 'pole'
  }
  for (const sg of ROAD_SIGNS) {
    if (Math.hypot(sg.x - x, sg.z - z) < POLE_CLEAR * mult) return 'pole'
  }
  for (const sh of SHELTERS) {
    if (Math.hypot(sh.x - x, sh.z - z) < POLE_CLEAR * mult) return 'pole'
  }
  for (const zb of ZEBRAS) {
    if (Math.hypot(zb.x - x, zb.z - z) < ZEBRA_CLEAR * mult) return 'zebra'
  }
  for (const a of ANCHORS) {
    if (Math.hypot(a.x - x, a.z - z) < ANCHOR_CLEAR * mult) return 'anchor'
  }
  for (const b of BUILDINGS) {
    if (nearBuilding(x, z, BUILDING_PAD * mult)) return 'building'
  }
  for (const k of KERB_PTS) {
    if (Math.hypot(k[0] - x, k[1] - z) < KERB_CLEAR * mult) return 'kerb'
  }
  for (const lp of LAMPS) {
    if (Math.hypot(lp.x - x, lp.z - z) < LAMP_CLEAR * mult) return 'lamp'
  }
  for (const pv of PARKED_VEHICLES) {
    if (Math.hypot(pv.x - x, pv.z - z) < BAY_CLEAR * mult) return 'bay'
  }
  return null
}

/* ------------------------- the accepted-trunk cell hash --------------------- */

interface PlacedTrunk {
  x: number
  z: number
  /** the species minSpacing this trunk was planted under */
  m: number
}

const trunkCells: Map<string, PlacedTrunk[]> = new Map()

/**
 * Pairwise minSpacing law — candidate vs every accepted trunk, answered by
 * the ONE cell hash built over the accepted set (grid-reuse over a new
 * index: no O(n²) sweep ever runs). The law honours BOTH sides: a spot is
 * illegal if it crowds a neighbour closer than either species allows.
 */
function spacingOk(x: number, z: number, minSpacing: number): boolean {
  const cx = Math.floor(x / SPACING_CELL)
  const cz = Math.floor(z / SPACING_CELL)
  for (let ix = cx - SPACING_Q_R; ix <= cx + SPACING_Q_R; ix++) {
    for (let iz = cz - SPACING_Q_R; iz <= cz + SPACING_Q_R; iz++) {
      const arr = trunkCells.get(`${ix}:${iz}`)
      if (!arr) continue
      for (const p of arr) {
        if (Math.hypot(p.x - x, p.z - z) < Math.max(minSpacing, p.m)) return false
      }
    }
  }
  return true
}

/** register an accepted trunk in the cell hash (plant() + landmark picks) */
function registerTrunk(x: number, z: number, m: number): void {
  const key = `${Math.floor(x / SPACING_CELL)}:${Math.floor(z / SPACING_CELL)}`
  const arr = trunkCells.get(key)
  const trunk: PlacedTrunk = { x, z, m }
  if (arr) arr.push(trunk)
  else trunkCells.set(key, [trunk])
}

/* --------------------------------- the build -------------------------------- */

const FLORA_T0 = performance.now()

const flora: FloraMap = {
  neem: [],
  mango: [],
  cashew: [],
  shea: [],
  oilpalm: [],
  raffia: [],
  plantain: [],
  iroko: [],
  baobab: [],
  acacia: [],
  // LEGACY KEYS (law F) — honest empties: the generic 'tree'/'palm' blobs
  // are superseded by the species-true guild above; the school compounds
  // keep planting their own trees at render time (SCHOOL_TREES mapping).
  tree: [],
  palm: [],
}

const rejected: Record<string, number> = {}
function rej(k: string): void {
  rejected[k] = (rejected[k] ?? 0) + 1
}

function treeTotal(): number {
  let n = 0
  for (const sp of SPECIES_IDS) n += flora[sp].length
  return n
}

/**
 * Accept a tree: push into its species row + register the trunk in the cell
 * hash. The per-instance yaw + tone jitter are drawn HERE, inside the one
 * acceptance point, so every accepted tree carries exactly two seeded draws
 * (rot then tone) and rejects never consume them.
 */
function plant(sp: SpeciesId, x: number, z: number, s: number): TreeInstance {
  const meta = SPECIES_META[sp]
  const rng = plantRng
  const t: TreeInstance = {
    x,
    z,
    y: heightAt(x, z),
    s,
    rot: rng() * TAU,
    tone: Math.floor(rng() * TONE_ROWS),
  }
  flora[sp].push(t)
  registerTrunk(x, z, meta.minSpacing)
  return t
}

/** the shared acceptance RNG — rot + tone jitter at the moment of planting */
const plantRng = makeRng(3307)

/* --------------------------- A) the street rows ----------------------------- */
/* Walk every asphalt artery, resample every 5u like the kerb walk, and plant
 * alternating neem/mango on each side at setback = renderHalf + kerb line +
 * 2.2..3.4 — beyond the future W1 U-drain band. Per-side arc spacing 13u.
 * Every candidate runs the shared clearance probe + the cell-hash spacing. */

{
  const rng = makeRng(4102)
  for (const r of ROADS) {
    if (!isArtery(r)) continue
    const half = renderHalf(r.cls)
    // seeded alternation: one draw per road, the sides start on opposite species
    const sideIsNeem = [rng() < 0.5, false]
    sideIsNeem[1] = !sideIsNeem[0]
    const lastArc = [-Infinity, -Infinity]
    const pts = r.pts
    let next = 0 // arc position of the next resample
    let walked = 0 // arc position at the start of the current segment
    for (let i = 0; i < pts.length - 1; i++) {
      const [ax, az] = pts[i]
      const [bx, bz] = pts[i + 1]
      const seg = Math.hypot(bx - ax, bz - az)
      if (seg < 1e-9) continue
      const nx = -(bz - az) / seg // unit perpendicular (markings-builder law)
      const nz = (bx - ax) / seg
      while (next <= walked + seg) {
        const arc = next
        const t = (next - walked) / seg
        const x = ax + (bx - ax) * t
        const z = az + (bz - az) * t
        next += STREET_STEP
        for (let side = 0; side < 2; side++) {
          if (arc - lastArc[side] < STREET_SIDE_SPACING) continue
          const s = side === 0 ? 1 : -1
          // THE FALLBACK-SETBACK LAW — Lokoja's real streetscape: where the
          // fabric is dense (side streets swallow the first band — the home
          // stretch's candidates died with NEGATIVE roadGap there), the row
          // steps OUT into the compound margins instead of giving up. Three
          // bands, first legal wins; every band runs the SAME full probe.
          let planted = false
          for (let band = 0; band < 3 && !planted; band++) {
            const setback = STREET_SETBACK + band * 1.6 + rng() * STREET_SETBACK_JITTER
            const off = half + KERB_LINE + setback
            const px = x + nx * off * s
            const pz = z + nz * off * s
            const why = clearOfTown(px, pz, 1, ROW_GAP_MIN, ROW_WATER_MIN)
            if (why) {
              rej(why)
              continue
            }
            const sp: SpeciesId = sideIsNeem[side] ? 'neem' : 'mango'
            if (!spacingOk(px, pz, SPECIES_META[sp].minSpacing)) {
              rej('spacing')
              continue
            }
            plant(sp, px, pz, 0.85 + rng() * 0.55)
            sideIsNeem[side] = !sideIsNeem[side] // alternate down the side
            lastArc[side] = arc
            planted = true
          }
        }
      }
      walked += seg
    }
  }
}

/* -------------------------- D) the riverine groves -------------------------- */
/* 6-8 seeded grove centres inside the river margin band, each ring-scattering
 * 5-9 palms. Raffia holds the wet end (d < halfWidth + 16), oil palm the
 * drier end. Every palm runs the shared probe + the band + spacing laws. */

{
  const rng = makeRng(7702)
  const centreTarget = GROVE_CENTRES + Math.floor(rng() * 3) // 6-8
  let centres = 0
  let attempts = 0
  while (centres < centreTarget && attempts < GROVE_CENTRE_GUARD) {
    attempts++
    const x = (rng() * 2 - 1) * (WALK_BOUND - 6)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 6)
    const ri = riverInfo(x, z)
    if (ri.d < ri.halfWidth + 5 || ri.d > ri.halfWidth + 26) continue
    if (heightAt(x, z) <= WATER_Y + GROVE_WATER_MIN) continue
    if (inSchoolYard(x, z) || inCivicCampus(x, z)) continue
    if (roadGap(x, z) < ROW_GAP_MIN) continue
    centres++
    const n = 6 + Math.floor(rng() * 6) // 6-11 palms per grove
    for (let i = 0; i < n; i++) {
      const ang = rng() * TAU
      const rad = 2.5 + rng() * 6.5
      const px = x + Math.cos(ang) * rad
      const pz = z + Math.sin(ang) * rad
      const pri = riverInfo(px, pz)
      if (pri.d < pri.halfWidth + GROVE_RIVER_MIN || pri.d > pri.halfWidth + GROVE_RIVER_MAX) {
        rej('groveband')
        continue
      }
      const wet = pri.d < pri.halfWidth + GROVE_WET_SPLIT
      const sp: SpeciesId = rng() < 0.65 ? (wet ? 'raffia' : 'oilpalm') : wet ? 'oilpalm' : 'raffia'
      const why = clearOfTown(px, pz, 1, ROW_GAP_MIN, GROVE_WATER_MIN)
      if (why) {
        rej(why)
        continue
      }
      if (!spacingOk(px, pz, SPECIES_META[sp].minSpacing)) {
        rej('spacing')
        continue
      }
      plant(sp, px, pz, 0.9 + rng() * 0.5)
    }
  }
}

/* -------------------------- E) the compound plantain ------------------------ */
/* 14 seeded clusters of 3-5 stems tucked behind BUILDINGS rows, on the side
 * AWAY from the nearest road (the back heading wins the roadGap duel). The
 * 0.75 envelope stands in for the wall edge; stems stand PLANTAIN_PAD..
 * +JITTER beyond it, so the suite's envelope law holds with margin and the
 * true wall gap is larger still. Stems run the shared probe at the relaxed
 * behind-building roadGap floor. */

{
  const rng = makeRng(1408)
  // seeded Fisher-Yates over the building indices — one draw per swap
  const order = BUILDINGS.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = order[i]
    order[i] = order[j]
    order[j] = tmp
  }
  let clusters = 0
  for (const bi of order) {
    if (clusters >= PLANTAIN_CLUSTERS) break
    const b = BUILDINGS[bi]
    const env = Math.max(b.w, b.d) * 0.75
    const baseAng = rng() * TAU
    const probeR = env + 3
    // THE AWAY-SIDE LAW: the cluster heading is the one whose sample point
    // stands in the BIGGER roadGap (the road side loses the duel)
    const fx = Math.cos(baseAng)
    const fz = Math.sin(baseAng)
    const g1 = roadGap(b.x + fx * probeR, b.z + fz * probeR)
    const g2 = roadGap(b.x - fx * probeR, b.z - fz * probeR)
    const dir = g1 > g2 ? 0 : Math.PI
    const back = baseAng + dir
    const k = 3 + Math.floor(rng() * 3) // 3-5 stems attempted
    const stems: { x: number; z: number; s: number }[] = []
    for (let i = 0; i < k; i++) {
      const ang = back + (i - (k - 1) / 2) * 0.62 + (rng() - 0.5) * 0.16
      const dist = env + PLANTAIN_PAD + rng() * PLANTAIN_PAD_JITTER
      const px = b.x + Math.cos(ang) * dist
      const pz = b.z + Math.sin(ang) * dist
      const why = clearOfTown(px, pz, 1, PLANTAIN_GAP_MIN, ROW_WATER_MIN)
      if (why) {
        rej(why)
        continue
      }
      if (!spacingOk(px, pz, SPECIES_META.plantain.minSpacing)) {
        rej('spacing')
        continue
      }
      // stem-to-stem law inside the not-yet-committed cluster
      let close = false
      for (const st of stems) {
        if (Math.hypot(st.x - px, st.z - pz) < SPECIES_META.plantain.minSpacing) close = true
      }
      if (close) {
        rej('spacing')
        continue
      }
      stems.push({ x: px, z: pz, s: 0.8 + rng() * 0.5 })
    }
    if (stems.length < 3) {
      rej('plantainCluster') // a host that cannot take 3 stems is skipped whole
      continue
    }
    for (const st of stems) plant('plantain', st.x, st.z, st.s)
    clusters++
  }
}

/* ------------------------------- C) landmarks ------------------------------- */
/* Iroko + baobab giants: seeded candidate sweep, scored open flat spots that
 * clear EVERYTHING at twice standard, preferring the 60-110u ring around the
 * built-up city core. Top candidates win; shortfalls are recorded honestly. */

// the built-up core: the named non-school, non-landmark anchors, averaged
const CORE = (() => {
  const ids = [
    'kpata-market',
    'food-area',
    'ganaja-junction',
    'government-area',
    'transport-area',
    'historic-lokoja',
    'home',
    'university-area',
  ]
  let cx = 0
  let cz = 0
  let n = 0
  for (const id of ids) {
    const a = ANCHOR_BY_ID[id]
    if (!a) continue
    cx += a.x
    cz += a.z
    n++
  }
  return { x: cx / n, z: cz / n, n }
})()

function pickLandmarks(sp: 'iroko' | 'baobab', target: number, seed: number): number {
  const meta = SPECIES_META[sp]
  const rng = makeRng(seed)
  const slopeMax = sp === 'iroko' ? IROKO_SLOPE_MAX : BAOBAB_SLOPE_MAX
  const cands: { x: number; z: number; y: number; s: number; score: number }[] = []
  for (let i = 0; i < LANDMARK_DRAWS; i++) {
    const x = (rng() * 2 - 1) * (WALK_BOUND - 6)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 6)
    const y = heightAt(x, z)
    if (y > TREELINE_Y) continue
    const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
    if (slope >= slopeMax) continue
    if (sp === 'baobab' && Math.max(0, 1 - riverInfo(x, z).d / 60) >= BAOBAB_MOISTURE_MAX) continue
    const why = clearOfTown(x, z, LANDMARK_GAP_MULT, ROW_GAP_MIN * LANDMARK_GAP_MULT, ROW_WATER_MIN)
    if (why) continue
    if (!spacingOk(x, z, meta.minSpacing * LANDMARK_GAP_MULT)) continue
    const dc = Math.hypot(x - CORE.x, z - CORE.z)
    const bandDist = dc < CORE_RING_MIN ? CORE_RING_MIN - dc : dc > CORE_RING_MAX ? dc - CORE_RING_MAX : 0
    const score = (1 - slope / slopeMax) * 2 - bandDist * 0.03 + rng() * 0.05
    const s = sp === 'iroko' ? 1.15 + rng() * 0.35 : 1.3 + rng() * 0.5
    cands.push({ x, z, y, s, score })
  }
  cands.sort((a, b) => b.score - a.score) // stable sort — deterministic top-3/2
  let placed = 0
  for (const c of cands) {
    if (placed >= target) break
    // re-check spacing against the giants committed within this same pick
    if (!spacingOk(c.x, c.z, meta.minSpacing * LANDMARK_GAP_MULT)) {
      rej('spacing')
      continue
    }
    plant(sp, c.x, c.z, c.s)
    placed++
  }
  if (placed < target) rejected[`${sp}Shortfall`] = target - placed
  return placed
}

pickLandmarks('iroko', IROKO_TARGET, 9182)
pickLandmarks('baobab', BAOBAB_TARGET, 9183)

/* ------------------------------ B) savanna scatter -------------------------- */
/* The old scatterTrees law (moisture guild + slope + Patti boost) rebuilt on
 * the species guild: dry open ground → acacia-biased, mid moisture → shea/
 * cashew, moist ground → mango/neem. Full shared clearance set + cell-hash
 * spacing, filling the remaining cap. Every reject is counted. */

{
  const rng = makeRng(61217)
  const guardMax = SCATTER_GUARD
  let guard = 0
  while (treeTotal() < TREE_CAP && guard < guardMax) {
    guard++
    const x = (rng() * 2 - 1) * (WALK_BOUND - 4)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 4)
    const y = heightAt(x, z)
    if (y > TREELINE_Y) {
      rej('treeline')
      continue
    }
    const ri = riverInfo(x, z)
    const moisture = Math.max(0, 1 - ri.d / 60)
    const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
    // THE GUILD — the real Guinea-savanna mix around Lokoja
    let sp: SpeciesId
    if (moisture > 0.6) {
      sp = rng() < 0.5 ? 'mango' : 'neem' // moist ground
    } else if (moisture < 0.42 && slope < 0.3) {
      const g = rng() // dry open savanna — acacia-biased, spare mango/neem
      sp = g < 0.42 ? 'acacia' : g < 0.7 ? 'shea' : g < 0.92 ? 'cashew' : rng() < 0.5 ? 'mango' : 'neem'
    } else {
      const g = rng() // mid moisture — shea/cashew country
      sp = g < 0.45 ? 'shea' : g < 0.8 ? 'cashew' : 'mango'
    }
    // denser around Patti + riversides, thinner downtown (old law)
    const pattiBoost = Math.max(0, 1 - Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z) / PATTI_BOOST_R)
    if (rng() > 0.34 + pattiBoost * 0.5) {
      rej('thin')
      continue
    }
    const why = clearOfTown(x, z, 1, ROW_GAP_MIN, ROW_WATER_MIN)
    if (why) {
      rej(why)
      continue
    }
    if (!spacingOk(x, z, SPECIES_META[sp].minSpacing)) {
      rej('spacing')
      continue
    }
    plant(sp, x, z, 0.75 + rng() * 0.8)
  }
  if (treeTotal() >= TREE_CAP) rej('treeCap') // the cap fired mid-scatter
  if (treeTotal() < TREE_CAP && guard >= guardMax) rej('scatterGuard')
}

/* --------------------------- the exported tree map -------------------------- */

const FLORA_BUILD_MS = Math.round((performance.now() - FLORA_T0) * 100) / 100

/** species-keyed placement output (legacy 'tree'/'palm' ship empty — law F) */
export const FLORA_TREES: FloraMap = flora

let floraStatsCache: FloraStats | null = null

/** import-time build report — per-species counts, rejects, build ms */
export function floraStats(): FloraStats {
  if (floraStatsCache) return floraStatsCache
  const perSpecies: Record<string, number> = {}
  let total = 0
  for (const sp of SPECIES_IDS) {
    perSpecies[sp] = flora[sp].length
    total += perSpecies[sp]
  }
  floraStatsCache = {
    perSpecies,
    total,
    rejected: { ...rejected },
    ms: FLORA_BUILD_MS,
  }
  return floraStatsCache
}

/* --------------------------------- GRASS_TUFTS ------------------------------ */
/* layout.GRASS's moisture-gradient law at 10k tufts, upgraded to the M22
 * clearance grade: heightAt > WATER_Y + 0.15, roadGap > 0.7 (the old law
 * only kept roadDistance < 3.4 — this one keeps the shoulders bare too),
 * inside WALK_BOUND - 2, never in the river, tone from the moisture law,
 * s = 0.7..1.25 seeded. Slope/treeline/anchor/school/building exclusions
 * mirror the old scatter so tufts never float or poke through floors. */

const GRASS_T0 = performance.now()

function buildGrass(): { tufts: GrassTuft[]; rejected: Record<string, number>; ms: number } {
  const rng = makeRng(51710)
  const out: GrassTuft[] = []
  const rej: Record<string, number> = {}
  const bump = (k: string): void => {
    rej[k] = (rej[k] ?? 0) + 1
  }
  let guard = 0
  while (out.length < GRASS_TARGET && guard < GRASS_GUARD) {
    guard++
    const x = (rng() * 2 - 1) * (WALK_BOUND - 2)
    const z = (rng() * 2 - 1) * (WALK_BOUND - 2)
    const y = heightAt(x, z)
    const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
    if (slope > 0.45) {
      bump('slope') // steep ground sheds the mesh's faceting — tufts would float
      continue
    }
    // THE SINK LAW — the water rule judges the tuft's FINAL y. Tufts sink
    // 0.35*slope + 0.1 below the sampled ground so the base hides under the
    // mesh; the first draft checked the RAW sample and shore tufts sank
    // under the water line (caught by the W2 smoke, margin −0.242).
    const ySunk = y - 0.35 * slope - 0.1
    if (ySunk <= WATER_Y + GRASS_WATER_MIN + GRASS_MARGIN) {
      bump('water')
      continue
    }
    if (y > 28) {
      bump('treeline') // the rocky Patti crown stays bare
      continue
    }
    const ri = riverInfo(x, z)
    if (ri.d <= ri.halfWidth + GRASS_RIVER_MIN + GRASS_MARGIN) {
      bump('river')
      continue
    }
    if (roadGap(x, z) <= GRASS_GAP_MIN + GRASS_MARGIN) {
      bump('roadgap')
      continue
    }
    if (Math.hypot(x, z) > WALK_BOUND - 2 - GRASS_MARGIN) {
      bump('bound')
      continue
    }
    let blocked = false
    for (const a of ANCHORS) {
      if (Math.hypot(a.x - x, a.z - z) < 12.5) {
        bump('anchor')
        blocked = true
        break
      }
    }
    if (blocked) continue
    for (const sp of SCHOOL_SITES) {
      if (Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 1.5) {
        bump('school')
        blocked = true
        break
      }
    }
    if (blocked) continue
    if (nearBuilding(x, z, 1.5)) {
      bump('building')
      continue
    }
    // moisture gradient — greener close to water (the old law, verbatim)
    const moisture = Math.max(0, 1 - ri.d / 60)
    const tone = Math.min(4, Math.floor((1 - moisture) * 5 * (0.75 + rng() * 0.5)))
    // the sunk final y (the sink computed and LAW-CHECKED above)
    out.push({ x, z, y: ySunk, s: 0.7 + rng() * 0.55, tone })
  }
  if (out.length < GRASS_TARGET && guard >= GRASS_GUARD) rej['grassGuard'] = 1
  return { tufts: out, rejected: rej, ms: Math.round((performance.now() - GRASS_T0) * 100) / 100 }
}

const grassBuild = buildGrass()

/** the 10k savanna ground cover (deterministic, cached const) */
export const GRASS_TUFTS: GrassTuft[] = grassBuild.tufts

let grassStatsCache: GrassStats | null = null

/** import-time build report — count, rejects, build ms */
export function grassStats(): GrassStats {
  if (grassStatsCache) return grassStatsCache
  grassStatsCache = {
    count: GRASS_TUFTS.length,
    rejected: { ...grassBuild.rejected },
    ms: grassBuild.ms,
  }
  return grassStatsCache
}
