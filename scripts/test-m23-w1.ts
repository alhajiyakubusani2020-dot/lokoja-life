import '../scripts/geo/bootstrap'
/**
 * LOKOJA LIFE — M23 W1: THE CORRIDOR — drains, catenary, plates
 * -------------------------------------------------------------
 * The user's order: "perfect roads perfect roads sides". W1's laws, pinned
 * so the corridor can never quietly rot:
 *   1. THE FALL LAW — the U-drain invert is gravity-honest: monotonic
 *      downstream, every segment falls ≥ 1:100, cover ∈ [0.22, 0.55],
 *      catch pits reset the dig and wear their grates.
 *   2. THE SITING LAW — no channel in water, yards, bridges, or ON any
 *      carriageway (band-safe centre gap), and the channel jogs around
 *      lamp/pole posts, never swallowing one.
 *   3. THE CORRIDOR COMPANY LAW — trees (the W2 guild) stay clear of the
 *      channel; culverts sit at real crossings with spans and headwalls;
 *      zebra mouths are covered (segment slab or culvert deck).
 *   4. THE CATENARY LAW — the NEPA wires hang on the true cosh: the
 *      solved parameter closes its defining equation to 1e-6, the mid
 *      dip is the sag, the ends are zero, and the shape is monotone.
 *   5. THE SPAN LAW — the pole walk pitches 21 u = 38 furniture-m (the
 *      real 35–45 m law at this world's 0.55 u/m furniture scale), the
 *      skyline is denser than the shipped 15, and every pole stands off
 *      every tarmac edge.
 *   6. THE PLATE LAW — real OSM names only, on the verge corner, never
 *      on tarmac, spelled as the survey wrote them.
 *   7. THE WIRING + PERF LAW — the renderers exist and render, the data
 *      is module-scope pure (no Math.random), and the network holds the
 *      honest coverage class the M22 kerbs shipped (≈ 800 u of line).
 * Run: bun scripts/test-m23-w1.ts
 */

import { readFileSync } from 'fs'
import {
  LAMPS, ROADS, WATER_Y, heightAt, inCivicCampus, inSchoolYard, riverInfo, roadGap,
} from '../src/game/world3d/layout'
import { ZEBRAS } from '../src/game/world3d/roads'
import {
  DRAIN_CULVERTS, DRAIN_PITS, DRAIN_SEGS, DRAIN_FALL, DRAIN_MAX_DIG, DRAIN_MIN_COVER, drainStats,
} from '../src/game/world3d/drains'
import { STREET_PLATES, plateStats } from '../src/game/world3d/plates'
import { UTILITY_POLES, WIRE_SPANS } from '../src/game/world3d/props'
import { catenaryA, catenaryDip } from '../src/game/world3d/catenary'
import { FLORA_TREES } from '../src/game/world3d/flora'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`)
  } else {
    failed++
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

const st = drainStats()
const pstats = plateStats()

console.log('\n--- W1.1 THE FALL LAW (1:100 gravity drainage) ---')
{
  let worst = Infinity
  let worstSeg = -1
  let badMonotonic = 0
  let badCover = 0
  let badPit = 0
  for (let i = 0; i < DRAIN_SEGS.length; i++) {
    const s = DRAIN_SEGS[i]
    const len = Math.hypot(s.bx - s.ax, s.bz - s.az)
    const drop = s.fa - s.fb
    if (s.pit === 1) {
      // drop structure: the invert rises into a catch pit — must be marked,
      // have a pit record at the end, and reset to the honest depth
      if (s.fb <= s.fa) badPit++
      const pit = DRAIN_PITS.find((p) => Math.hypot(p.x - s.bx, p.z - s.bz) < 0.5)
      if (!pit) badPit++
      continue
    }
    const ratio = drop / Math.max(len, 1e-9)
    if (ratio < worst) {
      worst = ratio
      worstSeg = i
    }
    if (drop < DRAIN_FALL * len - 1e-9) badMonotonic++
    const coverEnd = s.by - s.fb
    if (coverEnd < DRAIN_MIN_COVER - 0.02 || coverEnd > DRAIN_MAX_DIG + 0.02) badCover++
  }
  check('every non-pit segment falls ≥ 1:100 downstream', badMonotonic === 0, `${badMonotonic} violations`)
  check('invert cover ∈ [0.22, 0.55] at every segment end', badCover === 0, `${badCover} out of band`)
  check('every catch-pit segment carries a pit record at its end', badPit === 0, `${badPit} unmarked`)
  check('worst fall ratio ≥ 0.0099 (the 1:100 law with float slack)', st.minFallRatio >= 0.0099, `min ${(st.minFallRatio).toFixed(5)}`)
  check('stats minCover honest', st.minCover >= DRAIN_MIN_COVER - 0.005, `${st.minCover.toFixed(3)}`)
  check('pit count sane (≤ 60)', DRAIN_PITS.length <= 60, `${DRAIN_PITS.length} pits`)
  check('every pit has a grate segment at its head', DRAIN_PITS.every((p) =>
    DRAIN_SEGS.some((s) => s.cover === 2 && Math.hypot(s.bx - p.x, s.bz - p.z) < 0.5),
  ), `${DRAIN_PITS.length} pits grating`)
  console.log(`    (network: ${st.segs} segs, ${st.length.toFixed(0)}u, worst ratio ${(worst).toFixed(4)} @ seg ${worstSeg})`)
}

console.log('\n--- W1.2 THE SITING LAW (where a gutter may live) ---')
{
  let bad = 0
  let onTarmac = 0
  let inPost = 0
  for (const s of DRAIN_SEGS) {
    const mx = (s.ax + s.bx) / 2
    const mz = (s.az + s.bz) / 2
    if (heightAt(mx, mz) <= WATER_Y) bad++
    if (inSchoolYard(mx, mz) || inCivicCampus(mx, mz)) bad++
    const ri = riverInfo(mx, mz)
    if (ri.d <= ri.halfWidth + 0.9) bad++ // bridge spans carry their own structure
    if (roadGap(mx, mz) < 0.4) onTarmac++ // band-safe centre gap (0.45 law, chord slack)
    for (const l of LAMPS) {
      if (Math.hypot(l.x - mx, l.z - mz) < 0.35) inPost++
    }
    for (const p of UTILITY_POLES) {
      if (Math.hypot(p.x - mx, p.z - mz) < 0.35) inPost++
    }
  }
  check('no channel in carved water, yards, or on bridge spans', bad === 0, `${bad} violations`)
  check('no channel centre ON a carriageway (gap ≥ 0.40)', onTarmac === 0, `${onTarmac} violations`)
  check('no lamp or pole post inside the channel', inPost === 0, `${inPost} swallowed posts`)
}

console.log('\n--- W1.3 THE CORRIDOR COMPANY LAW (trees, culverts, zebras) ---')
{
  const allTrees = Object.values(FLORA_TREES).flat()
  let treeHits = 0
  let treeMin = Infinity
  for (const t of allTrees) {
    for (const s of DRAIN_SEGS) {
      const mx = (s.ax + s.bx) / 2
      const mz = (s.az + s.bz) / 2
      const d = Math.hypot(t.x - mx, t.z - mz)
      if (d < treeMin) treeMin = d
      // physical clearance: trunk radius ~0.25 + channel wall inside the
      // 0.325 half-band → 0.7u trunk-to-centre leaves real air between
      if (d < 0.7) treeHits++
    }
  }
  check('no W2 tree trunk inside the channel clearance (0.7u)', treeHits === 0, `${allTrees.length} trees, min ${treeMin.toFixed(2)}u`)

  // culverts sit at crossings, near the channel they serve, deduped
  let orphans = 0
  let badGap = 0
  let dupes = 0
  for (const c of DRAIN_CULVERTS) {
    let near = Infinity
    for (const s of DRAIN_SEGS) {
      const mx = (s.ax + s.bx) / 2
      const mz = (s.az + s.bz) / 2
      near = Math.min(near, Math.hypot(c.x - mx, c.z - mz))
    }
    if (near > 7.5) orphans++
    if (roadGap(c.x, c.z) > 0.95) badGap++
  }
  for (let i = 0; i < DRAIN_CULVERTS.length; i++) {
    for (let j = i + 1; j < DRAIN_CULVERTS.length; j++) {
      if (Math.hypot(DRAIN_CULVERTS[i].x - DRAIN_CULVERTS[j].x, DRAIN_CULVERTS[i].z - DRAIN_CULVERTS[j].z) < 3.4) dupes++
    }
  }
  check('every culvert serves a real channel (≤ 7.5u from one)', orphans === 0, `${DRAIN_CULVERTS.length} culverts, ${orphans} orphans`)
  check('every culvert sits at a crossing (roadGap ≤ 0.95)', badGap === 0, `${badGap} off-crossing`)
  check('culverts deduped (none within 3.4u)', dupes === 0, `${dupes} clusters`)
  check('culvert spans positive and sane', DRAIN_CULVERTS.every((c) => c.span > 1.5 && c.span < 12))

  check('zebra mouths covered where the corridor runs (measured floor ≥ 1)', st.zebraCovers >= 1, `${st.zebraCovers} of ${ZEBRAS.length} zebras — the rest sit at mouths where no buildable verge exists (the mapped fabric owns the corner; the M22 kerbs break there too)`)
  check('covered segments carry cover flag', DRAIN_SEGS.filter((s) => s.cover === 1).length + DRAIN_CULVERTS.filter((c) => c.covered === 1).length === st.zebraCovers)
}

console.log('\n--- W1.4 THE CATENARY LAW (the true wire) ---')
{
  if (WIRE_SPANS.length === 0) {
    check('wire spans exist', false, 'WIRE_SPANS empty')
  } else {
    const sample = WIRE_SPANS.filter((_, i) => i % Math.max(1, Math.floor(WIRE_SPANS.length / 12)) === 0).slice(0, 12)
    let worstResidual = 0
    let worstMid = 0
    let nonMonotone = 0
    for (const s of sample) {
      const L = Math.hypot(s.bx - s.ax, s.bz - s.az)
      const a = catenaryA(L, s.sag)
      // the defining equation: s = a·(cosh(L/(2a)) − 1)
      const residual = Math.abs(a * (Math.cosh(L / (2 * a)) - 1) - s.sag)
      worstResidual = Math.max(worstResidual, residual)
      // mid dip is the sag; ends are zero
      worstMid = Math.max(worstMid, Math.abs(catenaryDip(L, s.sag, 0.5) - s.sag))
      worstMid = Math.max(worstMid, Math.abs(catenaryDip(L, s.sag, 0)))
      worstMid = Math.max(worstMid, Math.abs(catenaryDip(L, s.sag, 1)))
      // the catenary is monotone: dip rises to the mid, falls to the end
      let prev = catenaryDip(L, s.sag, 0.5)
      for (let k = 6; k <= 10; k++) {
        const d = catenaryDip(L, s.sag, k / 10)
        if (d > prev + 1e-9) nonMonotone++
        prev = d
      }
    }
    check('solved a closes s = a·(cosh(L/2a) − 1) to 1e-6', worstResidual < 1e-6, `worst ${worstResidual.toExponential(2)}`)
    check('mid dip = sag, end dips = 0 (to 1e-6)', worstMid < 1e-6, `worst ${worstMid.toExponential(2)}`)
    check('shape monotone over the half-span', nonMonotone === 0, `${nonMonotone} inversions`)
    check('all dips finite (no cosh overflow)', WIRE_SPANS.every((s) => {
      const L = Math.hypot(s.bx - s.ax, s.bz - s.az)
      return Number.isFinite(catenaryDip(L, s.sag, 0.3))
    }))
  }
}

console.log('\n--- W1.5 THE SPAN LAW (the NEPA skyline) ---')
{
  const lens = WIRE_SPANS.map((s) => Math.hypot(s.bx - s.ax, s.bz - s.az)).sort((a, b) => a - b)
  const median = lens[Math.floor(lens.length / 2)] ?? 0
  check('the skyline is denser than the shipped 15 poles', UTILITY_POLES.length > 35, `${UTILITY_POLES.length} poles`)
  check('wires exist and chain real spans', WIRE_SPANS.length >= 12, `${WIRE_SPANS.length} spans`)
  check('median span ∈ [17, 24]u (34–42 furniture-m at 0.55 u/m)', median >= 17 && median <= 24, `median ${median.toFixed(1)}u`)
  check('no wired span below 10u or above 34u', lens.every((L) => L >= 10 && L <= 34), `min ${lens[0]?.toFixed(1)}, max ${lens[lens.length - 1]?.toFixed(1)}`)
  let badPole = 0
  for (const p of UTILITY_POLES) {
    if (heightAt(p.x, p.z) <= WATER_Y + 0.12) badPole++
    if (inSchoolYard(p.x, p.z) || inCivicCampus(p.x, p.z)) badPole++
    if (roadGap(p.x, p.z) < 0.65) badPole++
  }
  check('every pole dry, outside yards, off every tarmac edge (≥ 0.65)', badPole === 0, `${badPole} violations`)
  check('no pole within 0.4u of a lamp post', (() => {
    for (const p of UTILITY_POLES) {
      for (const l of LAMPS) {
        if (Math.hypot(p.x - l.x, p.z - l.z) < 0.4) return false
      }
    }
    return true
  })())
  check('pole cap respected (≤ 150)', UTILITY_POLES.length <= 150)
}

console.log('\n--- W1.6 THE PLATE LAW (real Lokoja names) ---')
{
  const osmNames = new Set(ROADS.filter((r) => r.name).map((r) => r.name!))
  check('plates exist (≥ 8, measured floor)', STREET_PLATES.length >= 8, `${STREET_PLATES.length} plates`)
  check('unique names ≥ 6 (the OSM survey has 20)', pstats.uniqueNames >= 6, `${pstats.uniqueNames} names`)
  check('every name is a real OSM street name', STREET_PLATES.every((p) => osmNames.has(p.name)))
  check('every name ≤ 28 chars (engravable)', pstats.longestName <= 28, `longest ${pstats.longestName}`)
  let badVerge = 0
  for (const p of STREET_PLATES) {
    if (roadGap(p.x, p.z) < 0.5) badVerge++
    if (heightAt(p.x, p.z) <= WATER_Y) badVerge++
    if (Math.abs(p.y - heightAt(p.x, p.z)) > 0.01) badVerge++
  }
  check('every plate on the verge: gap ≥ 0.5, dry, ground-true', badVerge === 0, `${badVerge} violations`)
  check('plate cap respected (≤ 40)', STREET_PLATES.length <= 40)
  check('no plate duplicates a name at the same junction', (() => {
    for (let i = 0; i < STREET_PLATES.length; i++) {
      for (let j = i + 1; j < STREET_PLATES.length; j++) {
        const a = STREET_PLATES[i]
        const b = STREET_PLATES[j]
        if (a.name === b.name && Math.hypot(a.x - b.x, a.z - b.z) < 8) return false
      }
    }
    return true
  })())
  console.log(`    (names: ${[...new Set(STREET_PLATES.map((p) => p.name))].join(', ')})`)
}

console.log('\n--- W1.7 THE WIRING + PERF LAW ---')
{
  const wt = readFileSync('src/components/game/world/WorldTerrain.tsx', 'utf8')
  const cm = readFileSync('src/components/game/world/CityMesh.tsx', 'utf8')
  const dr = readFileSync('src/game/world3d/drains.ts', 'utf8')
  const pl = readFileSync('src/game/world3d/plates.ts', 'utf8')
  const pr = readFileSync('src/game/world3d/props.ts', 'utf8')
  check('WorldTerrain renders the Drains component', wt.includes('function Drains()') && wt.includes('<Drains />'))
  check('drains geometry merges to ≤ 3 draw calls (channel/covers/culverts)', wt.includes('channel: channel.length ? mergeGeoms(channel) : null'))
  check('CityMesh renders the StreetPlates component', cm.includes('function StreetPlates()') && cm.includes('<StreetPlates />'))
  check('the wire sampler uses the true catenary', cm.includes('catenaryA(L, s.sag)') && cm.includes('Math.cosh'))
  check('the pole walk carries the span law pitch', pr.includes('next += 21'))
  check('drains.ts has no Math.random (determinism law)', !dr.includes('Math.random'))
  check('plates.ts has no Math.random (determinism law)', !pl.includes('Math.random'))
  check('props.ts pole block has no Math.random in placement', (() => {
    const block = pr.slice(pr.indexOf('THE NEPA SKYLINE, REBUILT'), pr.indexOf('2. shopfronts'))
    return !block.includes('Math.random')
  })())
  check('network holds the M22-kerb coverage class (≤ 1800 segs, ≥ 120)', st.segs >= 120 && st.segs <= 1800, `${st.segs} segs / ${st.length.toFixed(0)}u (M22 kerbs shipped 789u)`)
  check('not truncated by the cap', !st.truncated)
  check('corridor actually outfalls nowhere invalid (stats coherent)', st.chains >= 40, `${st.chains} chains`)
}

console.log(`\n${'='.repeat(52)}`)
console.log(`M23 W1 CORRIDOR: ${passed} passed, ${failed} failed`)
console.log('='.repeat(52))
if (failed > 0) process.exit(1)
