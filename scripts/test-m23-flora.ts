import '../scripts/geo/bootstrap'
/**
 * LOKOJA LIFE — M23 W2: THE GREEN — trees and grasses done honestly
 * -----------------------------------------------------------------
 * The user's order: "perfect roads perfect roads sides perfect real trees
 * and grasses". W2's laws, pinned so the green can never quietly rot:
 *   1. THE SPECIES LAW — ten Kogi-true silhouettes, each a merged
 *      vertex-coloured geometry under its tri budget, ground-contact true,
 *      height within ±15% of the contract, sway weight rooted at 0 and
 *      leaf-masked for the weather gold.
 *   2. THE PLACEMENT LAW — every tree stands where M22-grade clearance
 *      probes say a tree may stand: off the tarmac, off the kerb line
 *      (the future W1 drain band), clear of zebras/lamps/bays/stalls/
 *      buildings/anchors/schools/water, spaced by the guild's own
 *      minSpacing, capped at 660, landmarks exact.
 *   3. THE GRASS LAW — 10,000 tufts (the 3.2k scatter's upgrade), each
 *      above the SUNK waterline, off the shoulders, out of the river,
 *      inside the bound, tone and scale in range.
 *   4. THE WEATHER LAW — the M6 weather reaches the leaves: harmattan is
 *      the full gold, the rain family the lush end, and the shader's
 *      phase is per-instance (zero CPU).
 *   5. THE WIRING LAW — CityMesh renders the guild, WorldTerrain renders
 *      the 10k, both share the one flora shader; no Math.random anywhere
 *      in the green.
 * Run: bun scripts/test-m23-flora.ts
 */

import { readFileSync } from 'fs'
import {
  ANCHORS, BUILDINGS, LAMPS, STALLS, WALK_BOUND, WATER_Y,
  heightAt, inCivicCampus, inSchoolYard, riverInfo, roadGap,
} from '../src/game/world3d/layout'
import { KERB_RUNS, ZEBRAS } from '../src/game/world3d/roads'
import { PARKED_VEHICLES } from '../src/game/world3d/vehicles'
import {
  SPECIES_IDS, SPECIES_META, type SpeciesId, type TreeInstance,
} from '../src/game/world3d/flora-types'
import { buildSpeciesGeometry, speciesTriCount, SPECIES_BUILD_SEEDS } from '../src/game/world3d/flora-species'
import { FLORA_TREES, GRASS_TUFTS, floraStats, grassStats } from '../src/game/world3d/flora'
import { dryTargetOf, floraLive, applyFloraShader, stepFlora } from '../src/components/game/world/flora-shader'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

/* ------------------------- 1. THE SPECIES LAW ------------------------- */

console.log('\nTHE SPECIES GUILD — ten silhouettes, each true to Kogi')
check('the roster is the ten-species guild', SPECIES_IDS.length === 10, `got ${SPECIES_IDS.length}`)

let totalTris = 0
const budgets: [SpeciesId, number, number][] = [] // [id, tris, height]
for (const sp of SPECIES_IDS) {
  const g = buildSpeciesGeometry(sp)
  const meta = SPECIES_META[sp]
  const tris = speciesTriCount(sp)
  totalTris += tris
  const pos = g.getAttribute('position')
  const col = g.getAttribute('color')
  const sway = g.getAttribute('aSway')
  const leaf = g.getAttribute('aLeaf')
  const ok =
    !!pos && !!col && !!sway && !!leaf &&
    pos.count === col.count && pos.count === sway.count && pos.count === leaf.count &&
    g.index !== null && g.index.count % 3 === 0
  check(`${sp} merged geometry carries position/color/aSway/aLeaf + index`, ok)
  check(`${sp} tris ${tris} <= budget ${meta.maxTris}`, tris > 0 && tris <= meta.maxTris)
  g.computeBoundingBox()
  const bb = g.boundingBox!
  const h = bb.max.y - bb.min.y
  budgets.push([sp, tris, h])
  check(`${sp} ground contact (min.y ${bb.min.y.toFixed(3)})`, Math.abs(bb.min.y) <= 0.06)
  check(
    `${sp} height ${h.toFixed(2)} within ±15% of ${meta.height}`,
    h >= meta.height * 0.85 && h <= meta.height * 1.15,
  )
  let swayLo = Infinity
  let swayHi = -Infinity
  let leafBinary = true
  for (let i = 0; i < sway.count; i++) {
    const s = sway.getX(i)
    if (s < 0 || s > 1) leafBinary = false
    swayLo = Math.min(swayLo, s)
    swayHi = Math.max(swayHi, s)
    const l = leaf.getX(i)
    if (l !== 0 && l !== 1) leafBinary = false
  }
  check(`${sp} aSway within [0,1] (rooted discipline)`, swayLo >= -1e-6 && swayHi <= 1 + 1e-6)
  check(`${sp} aLeaf strictly binary (gold never gilds the wood)`, leafBinary)
}
check(
  `cache identity — rebuild returns the SAME geometry`,
  SPECIES_IDS.every((sp) => buildSpeciesGeometry(sp) === buildSpeciesGeometry(sp)),
)
check(`every species has a build seed (determinism by construction)`,
  SPECIES_IDS.every((sp) => Number.isFinite(SPECIES_BUILD_SEEDS[sp])))
check(`the whole guild costs ${totalTris} tris <= 3600`, totalTris <= 3600)

/* ------------------------ 2. THE PLACEMENT LAW ------------------------ */

console.log('\nTHE PLACEMENT LAW — M22-grade clearance probes for every trunk')

const stats = floraStats()
const allTrees: TreeInstance[] = []
for (const sp of SPECIES_IDS) allTrees.push(...FLORA_TREES[sp])
check(`the town is green: ${stats.total} trees, 420..720`, stats.total >= 420 && stats.total <= 720)
check(`the honest stats report matches the map`, stats.perSpecies.neem === FLORA_TREES.neem.length)

const floors: Record<SpeciesId, number> = {
  neem: 60, mango: 80, cashew: 30, shea: 30, oilpalm: 4,
  raffia: 8, plantain: 24, iroko: 3, baobab: 2, acacia: 25,
}
for (const sp of SPECIES_IDS) {
  check(`${sp} planted ${FLORA_TREES[sp].length} >= floor ${floors[sp]}`, FLORA_TREES[sp].length >= floors[sp])
}
check('the legacy generic kinds ship empty (superseded, honestly)', FLORA_TREES.tree.length === 0 && FLORA_TREES.palm.length === 0)
check('the landmarks stand: 3 iroko + 2 baobab', FLORA_TREES.iroko.length === 3 && FLORA_TREES.baobab.length === 2)

const KERB_PTS: [number, number][] = []
for (const k of KERB_RUNS) KERB_PTS.push([k.ax, k.az], [k.bx, k.bz])

let wet = 0
let offBound = 0
let onTarmac = 0
let onKerb = 0
let onZebra = 0
let onLamp = 0
let onBay = 0
let onStall = 0
let inBuilding = 0
let onAnchor = 0
let inYard = 0
let inRiver = 0
let float = 0
for (const t of allTrees) {
  if (t.y <= WATER_Y + 0.3) wet++
  if (Math.hypot(t.x, t.z) > WALK_BOUND - 1.5) offBound++
  if (roadGap(t.x, t.z) < 1.2) onTarmac++ // plantain's behind-building floor
  for (const k of KERB_PTS) if (Math.hypot(k[0] - t.x, k[1] - t.z) < 1.9) { onKerb++; break }
  for (const z of ZEBRAS) if (Math.hypot(z.x - t.x, z.z - t.z) < 4.3) { onZebra++; break }
  for (const l of LAMPS) if (Math.hypot(l.x - t.x, l.z - t.z) < 1.6) { onLamp++; break }
  for (const pv of PARKED_VEHICLES) if (Math.hypot(pv.x - t.x, pv.z - t.z) < 5.4) { onBay++; break }
  for (const st of STALLS) if (Math.hypot(st.x - t.x, st.z - t.z) < 2.5) { onStall++; break }
  let inB = false
  for (const b of BUILDINGS) if (Math.hypot(b.x - t.x, b.z - t.z) < Math.max(b.w, b.d) * 0.75 + 2.0) { inB = true; break }
  if (inB) inBuilding++
  for (const a of ANCHORS) if (Math.hypot(a.x - t.x, a.z - t.z) < 8.9) { onAnchor++; break }
  if (inSchoolYard(t.x, t.z) || inCivicCampus(t.x, t.z)) inYard++
  const ri = riverInfo(t.x, t.z)
  if (ri.d < ri.halfWidth + 2.7) inRiver++
  if (Math.abs(t.y - heightAt(t.x, t.z)) > 0.01) float++
}
check(`no tree in the water (${wet})`, wet === 0)
check(`no tree off the world edge (${offBound})`, offBound === 0)
check(`no tree on the tarmac (${onTarmac})`, onTarmac === 0)
check(`no tree on the kerb/W1 drain line (${onKerb})`, onKerb === 0)
check(`no tree on a zebra crossing (${onZebra})`, onZebra === 0)
check(`no tree against a street lamp (${onLamp})`, onLamp === 0)
check(`no tree in a parked-vehicle bay (${onBay})`, onBay === 0)
check(`no tree against a market stall (${onStall})`, onStall === 0)
check(`no tree inside a building envelope (${inBuilding})`, inBuilding === 0)
check(`no tree inside an anchor plaza (${onAnchor})`, onAnchor === 0)
check(`no wild tree in a school yard or civic campus (${inYard})`, inYard === 0)
check(`no tree in the river margin (${inRiver})`, inRiver === 0)
check(`every trunk sits ON the land it sampled (${float})`, float === 0)

// the guild's own spacing: same-species pairs honour minSpacing
let crowded = 0
for (const sp of SPECIES_IDS) {
  const list = FLORA_TREES[sp]
  const m = SPECIES_META[sp].minSpacing * 0.99
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      if (Math.hypot(list[i].x - list[j].x, list[i].z - list[j].z) < m) crowded++
    }
  }
}
check(`no same-species crowding below minSpacing (${crowded})`, crowded === 0)

// the parked fleet the bay law swept against is the real M22 registry
check(`the parked fleet is real (${PARKED_VEHICLES.length} rigs)`, PARKED_VEHICLES.length >= 7)

/* --------------------------- 3. THE GRASS LAW --------------------------- */

console.log(`\nTHE GRASS LAW — the 10k savanna`)
const gs = grassStats()
check(`10,000 tufts stand (${gs.count})`, gs.count === 10000)
check(`the guard never fired (the laws feed the target)`, gs.rejected.grassGuard === undefined)
let gWet = 0
let gRoad = 0
let gRiver = 0
let gBound = 0
let gTone = 0
let gScale = 0
for (const t of GRASS_TUFTS) {
  if (t.y <= WATER_Y + 0.15) gWet++
  if (roadGap(t.x, t.z) <= 0.7) gRoad++
  const ri = riverInfo(t.x, t.z)
  if (ri.d <= ri.halfWidth + 0.5) gRiver++
  if (Math.hypot(t.x, t.z) > WALK_BOUND - 2) gBound++
  if (t.tone < 0 || t.tone > 4) gTone++
  if (t.s < 0.7 || t.s > 1.25) gScale++
}
check(`no tuft below the sunk waterline (${gWet})`, gWet === 0)
check(`no tuft on tarmac or shoulder (${gRoad})`, gRoad === 0)
check(`no tuft in the river (${gRiver})`, gRiver === 0)
check(`no tuft beyond the world edge (${gBound})`, gBound === 0)
check(`tones and scales in range (${gTone}/${gScale})`, gTone === 0 && gScale === 0)

/* -------------------------- 4. THE WEATHER LAW -------------------------- */

console.log(`\nTHE WEATHER LAW — the M6 sky reaches the leaves`)
check(`harmattan is the full gold (dry=1)`, dryTargetOf('harmattan') === 1)
check(`flood is the lush floor (dry=0)`, dryTargetOf('flood') === 0)
check(`the rain family reads wet (rain/storm <= 0.1)`, dryTargetOf('rain') <= 0.1 && dryTargetOf('storm') <= 0.1)
check(`the savanna middle holds (sunny/cloudy/night-clear in [0.2,0.6])`,
  [dryTargetOf('sunny'), dryTargetOf('cloudy'), dryTargetOf('night-clear')].every((v) => v >= 0.2 && v <= 0.6))
check(`the eased state starts mid-savanna (0.45)`, Math.abs(floraLive.dry - 0.45) < 1e-9)
check(`the shader injection is a real material hook`, typeof applyFloraShader === 'function' && typeof stepFlora === 'function')

/* ---------------------------- 5. THE WIRING LAW ---------------------------- */

console.log(`\nTHE WIRING LAW — the renderers actually render the green`)
const city = readFileSync('src/components/game/world/CityMesh.tsx', 'utf-8')
const terrain = readFileSync('src/components/game/world/WorldTerrain.tsx', 'utf-8')
const shader = readFileSync('src/components/game/world/flora-shader.ts', 'utf-8')
check('CityMesh renders <FloraTrees /> (the guild replaced the blobs)', city.includes('<FloraTrees />'))
check('CityMesh feeds the guild from FLORA_TREES + buildSpeciesGeometry', city.includes('FLORA_TREES') && city.includes('buildSpeciesGeometry'))
check('CityMesh steps the one flora clock', city.includes('stepFlora'))
check('WorldTerrain renders GRASS_TUFTS (the 10k)', terrain.includes('GRASS_TUFTS'))
check('WorldTerrain\'s tufts carry aSway/aLeaf (wind + gold mask)', terrain.includes("'aSway'") && terrain.includes("'aLeaf'"))
check('both renderers share the one flora shader', city.includes("from './flora-shader'") && terrain.includes("from './flora-shader'"))
check('the shader phase is per-instance from world position (zero CPU)', shader.includes('instanceMatrix[3][0]') && shader.includes('instanceMatrix[3][2]'))
check('the shader reads the live weather (no React)', shader.includes('atmoLive.weather'))
check('the gold is leaf-masked (wood never gilds)', shader.includes('flDry = clamp(uDry * vLeaf'))

for (const f of ['src/game/world3d/flora.ts', 'src/game/world3d/flora-species.ts', 'src/components/game/world/flora-shader.ts']) {
  const src = readFileSync(f, 'utf-8').replace(/\/\*[^]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  check(`no Math.random in CODE of ${f.split('/').pop()}`, !src.includes('Math.random'))
}

/* ------------------------------ summary --------------------------------- */

console.log(`\n${'='.repeat(52)}`)
console.log(`M23 W2 THE GREEN: ${passed} passed, ${failed} failed`)
console.log('='.repeat(52))
if (failed > 0) process.exit(1)
