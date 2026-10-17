import '../scripts/geo/bootstrap'
/**
 * LOKOJA LIFE — M23 W2: THE GREEN — smoke: flora placement laws
 * -------------------------------------------------------------
 * Prints the import-time build reports (floraStats / grassStats) and then
 * asserts the W2 clearance laws on EVERY placed TreeInstance:
 *   water / walk-bound / roadGap / kerb lines / zebras / lamps / parked
 *   bays / stalls / building envelopes / anchors / school yard + civic
 *   campus / river margins — plus the plantain behind-building exemption
 *   (roadGap >= 1.2 only where the stem is hosted by a building) and the
 *   grass law set. PASS/FAIL per law group with the worst margin found.
 * Stats are printed twice and byte-compared (determinism evidence in one
 * process — the build is a cached module-scope const, like roads.ts).
 * Run: bun scripts/smoke-flora-place.ts
 */

import {
  ANCHORS,
  BUILDINGS,
  LAMPS,
  STALLS,
  WALK_BOUND,
  WATER_Y,
  inCivicCampus,
  inSchoolYard,
  riverInfo,
  roadGap,
} from '../src/game/world3d/layout'
import { KERB_RUNS, ZEBRAS } from '../src/game/world3d/roads'
import { PARKED_VEHICLES } from '../src/game/world3d/vehicles'
import { FLORA_TREES, GRASS_TUFTS, floraStats, grassStats } from '../src/game/world3d/flora'
import { SPECIES_IDS } from '../src/game/world3d/flora-types'
import type { TreeInstance } from '../src/game/world3d/flora-types'

/* -------------------------------- the report -------------------------------- */

const stats1 = floraStats()
const gstats1 = grassStats()
console.log('FLORA STATS:', JSON.stringify(stats1))
console.log('GRASS STATS:', JSON.stringify(gstats1))

/* ------------------------------ the law sweep ------------------------------- */

const KERB_PTS: [number, number][] = []
for (const k of KERB_RUNS) KERB_PTS.push([k.ax, k.az], [k.bx, k.bz])

interface LawGroup {
  name: string
  worst: number
  worstAt: string
  bad: number
}

const groups = new Map<string, LawGroup>()
function law(name: string, margin: number, at: string): void {
  let g = groups.get(name)
  if (!g) {
    g = { name, worst: Infinity, worstAt: '', bad: 0 }
    groups.set(name, g)
  }
  if (margin < g.worst) {
    g.worst = margin
    g.worstAt = at
  }
  if (margin < 0) g.bad++
}

function sweepTree(t: TreeInstance, sp: string): void {
  const at = `${sp}@(${t.x.toFixed(1)},${t.z.toFixed(1)})`
  law('water y > WATER_Y+0.3', t.y - WATER_Y - 0.3, at)
  law('walk bound <= WALK_BOUND-1.5', WALK_BOUND - 1.5 - Math.hypot(t.x, t.z), at)
  const gapMin = sp === 'plantain' ? 1.2 : 1.45
  law(`roadGap >= ${gapMin}`, roadGap(t.x, t.z) - gapMin, at)
  let kerb = Infinity
  for (const k of KERB_PTS) {
    const d = Math.hypot(k[0] - t.x, k[1] - t.z)
    if (d < kerb) kerb = d
  }
  law('kerb points >= 2.0', kerb - 2.0, at)
  let zb = Infinity
  for (const z of ZEBRAS) {
    const d = Math.hypot(z.x - t.x, z.z - t.z)
    if (d < zb) zb = d
  }
  law('zebras >= 4.4', zb - 4.4, at)
  let lp = Infinity
  for (const l of LAMPS) {
    const d = Math.hypot(l.x - t.x, l.z - t.z)
    if (d < lp) lp = d
  }
  law('lamps >= 1.7', lp - 1.7, at)
  let pv = Infinity
  for (const p of PARKED_VEHICLES) {
    const d = Math.hypot(p.x - t.x, p.z - t.z)
    if (d < pv) pv = d
  }
  law('parked bays >= 5.5', pv - 5.5, at)
  let st = Infinity
  for (const s of STALLS) {
    const d = Math.hypot(s.x - t.x, s.z - t.z)
    if (d < st) st = d
  }
  law('stalls >= 2.6', st - 2.6, at)
  let bld = Infinity
  for (const b of BUILDINGS) {
    const d = Math.hypot(b.x - t.x, b.z - t.z) - Math.max(b.w, b.d) * 0.75
    if (d < bld) bld = d
  }
  law('building env >= +2.15', bld - 2.15, at)
  let an = Infinity
  for (const a of ANCHORS) {
    const d = Math.hypot(a.x - t.x, a.z - t.z)
    if (d < an) an = d
  }
  law('anchors >= 9', an - 9, at)
  if (inSchoolYard(t.x, t.z) || inCivicCampus(t.x, t.z)) {
    law('school yard + civic campus excluded', -1, at)
  } else {
    law('school yard + civic campus excluded', 1, at)
  }
  const ri = riverInfo(t.x, t.z)
  law('river d >= halfWidth+2.8', ri.d - ri.halfWidth - 2.8, at)
  if (sp === 'plantain') {
    // the roadGap >= 1.45 exemption is honest ONLY where the stem is hosted
    let hostEnv = Infinity
    for (const b of BUILDINGS) {
      const env = Math.max(b.w, b.d) * 0.75
      const d = Math.hypot(b.x - t.x, b.z - t.z) - env
      if (d < hostEnv) hostEnv = d
    }
    law('plantain hosted behind a building (env <= +4.0)', 4.0 - hostEnv, at)
  }
}

let treeCount = 0
for (const sp of SPECIES_IDS) {
  for (const t of FLORA_TREES[sp]) {
    sweepTree(t, sp)
    treeCount++
  }
}
// the legacy keys ship empty by contract — sweep them too (zero iterations)
for (const t of FLORA_TREES.tree) sweepTree(t, 'tree')
for (const t of FLORA_TREES.palm) sweepTree(t, 'palm')

console.log(`\nTREES SWEPT: ${treeCount} (stats total ${stats1.total})`)

let failed = 0
for (const g of groups.values()) {
  const ok = g.bad === 0 && g.worst >= 0 && (g.name.startsWith('water') ? g.worst > 0 : true)
  if (!ok) failed++
  console.log(
    `  ${ok ? 'PASS' : 'FAIL'}  ${g.name}  worst margin ${g.worst.toFixed(4)} at ${g.worstAt}${g.bad ? ` — ${g.bad} violations` : ''}`,
  )
}

// cap law: the honest ceiling
if (stats1.total > 720) {
  console.log(`  FAIL  tree cap 720 — total ${stats1.total}`)
  failed++
} else {
  console.log(`  PASS  tree cap 720 — total ${stats1.total}`)
}
// legacy keys: contract empties
if (FLORA_TREES.tree.length === 0 && FLORA_TREES.palm.length === 0) {
  console.log('  PASS  legacy tree/palm keys empty (law F)')
} else {
  console.log(`  FAIL  legacy keys — tree ${FLORA_TREES.tree.length}, palm ${FLORA_TREES.palm.length}`)
  failed++
}

/* ------------------------------- the grass laws ------------------------------ */

let gBad = 0
let gWorstWater = Infinity
let gWorstGap = Infinity
let gWorstRiver = Infinity
let gWorstBound = Infinity
let gBadTone = 0
let gBadScale = 0
for (const t of GRASS_TUFTS) {
  gWorstWater = Math.min(gWorstWater, t.y - WATER_Y - 0.15)
  gWorstGap = Math.min(gWorstGap, roadGap(t.x, t.z) - 0.7)
  const ri = riverInfo(t.x, t.z)
  gWorstRiver = Math.min(gWorstRiver, ri.d - ri.halfWidth - 0.5)
  gWorstBound = Math.min(gWorstBound, WALK_BOUND - 2 - Math.hypot(t.x, t.z))
  if (t.tone < 0 || t.tone > 4) gBadTone++
  if (t.s < 0.7 || t.s > 1.25) gBadScale++
}
const grassOk =
  gBad === 0 && gWorstWater > 0 && gWorstGap > 0 && gWorstRiver > 0 && gWorstBound >= 0 && gBadTone === 0 && gBadScale === 0
if (!grassOk) failed++
console.log(
  `  ${grassOk ? 'PASS' : 'FAIL'}  grass laws — water ${(gWorstWater + 0).toFixed(4)}, roadGap ${gWorstGap.toFixed(4)}, river ${gWorstRiver.toFixed(4)}, bound ${gWorstBound.toFixed(4)}, badTone ${gBadTone}, badScale ${gBadScale}`,
)

/* ----------------------- determinism evidence (one run) ---------------------- */

const checksum = (): number => {
  let h = 0
  for (const sp of SPECIES_IDS) {
    for (const t of FLORA_TREES[sp]) {
      h = (h * 31 + Math.round(t.x * 100)) | 0
      h = (h * 31 + Math.round(t.z * 100)) | 0
      h = (h * 31 + Math.round(t.y * 100)) | 0
      h = (h * 31 + Math.round(t.s * 100)) | 0
    }
  }
  for (const t of GRASS_TUFTS) {
    h = (h * 31 + Math.round(t.x * 100)) | 0
    h = (h * 31 + Math.round(t.z * 100)) | 0
  }
  return h >>> 0
}
const sum1 = checksum()
const stats2 = floraStats()
const gstats2 = grassStats()
const sum2 = checksum()
const same = JSON.stringify(stats1) === JSON.stringify(stats2) && JSON.stringify(gstats1) === JSON.stringify(gstats2) && sum1 === sum2
console.log(`\nDETERMINISM: stats printed twice identical=${JSON.stringify(stats1) === JSON.stringify(stats2) && JSON.stringify(gstats1) === JSON.stringify(gstats2)}, coordinate checksum stable=${sum1 === sum2} (0x${sum1.toString(16)} / 0x${sum2.toString(16)})`)
if (!same) failed++

console.log(failed === 0 ? '\nSMOKE: ALL LAWS PASS' : `\nSMOKE: ${failed} LAW GROUPS FAILED`)
process.exit(failed === 0 ? 0 : 1)
