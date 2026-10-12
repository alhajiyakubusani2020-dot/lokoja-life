/**
 * LOKOJA LIFE — Stage 3.5 Tests: The 3D World
 * ---------------------------------------------
 * Verifies the pure-data heart of the 3D city (terrain.ts + world3d.ts)
 * without a browser: determinism, geography, road connectivity, the
 * bridge, building placement safety, and 3D/2D/location-registry unity.
 *
 * Run: bun run scripts/test-stage35.ts
 */

import {
  terrainHeight, terrainSlope, isWaterMap, mapToWorld, WATER_LEVEL,
  RIVER_NIGER_MAP, RIVER_BENUE_MAP, DISTRICT_FLATS, PATTI_HEIGHT,
} from '../src/game/systems/terrain'
import {
  ANCHORS, RESOLVED_ROADS, DISTRICT_PLANS, EXTRA_PLANS, SCATTER_HOUSES, CITY_LANDMARKS,
  VEGETATION, routeBetween, groundHeight, BRIDGE, pointOnRoute, polylineLength,
  RIVER_NIGER_WORLD, mulberry32,
} from '../src/game/data/world3d'
import { LOCATIONS } from '../src/game/data/locations'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name} ${detail}`)
  }
}

/* ------------------------------- 1. determinism ------------------------------ */

console.log('\n— Determinism —')
{
  const h1 = terrainHeight(37.2, -81.7)
  const h2 = terrainHeight(37.2, -81.7)
  check('terrainHeight is pure/deterministic', h1 === h2, `${h1} vs ${h2}`)

  // the seeded RNG is stable
  const rng1 = mulberry32(42)
  const rng2 = mulberry32(42)
  let same = true
  for (let i = 0; i < 50; i++) if (rng1() !== rng2()) same = false
  check('mulberry32 seeded streams identical', same)

  // layouts are stable across module reloads (spot check some buildings)
  const kpata = DISTRICT_PLANS.find((d) => d.locationId === 'kpata-market')!
  check('district plans populated', kpata.buildings.length >= 20, `${kpata.buildings.length}`)
  check('scatter houses placed along roads', SCATTER_HOUSES.length >= 20, `${SCATTER_HOUSES.length}`)
}

/* -------------------------------- 2. geography ------------------------------- */

console.log('\n— Geography: rivers, confluence, Mount Patti —')
{
  // every Niger/Benue centreline sample sits below the water plane
  const niger = RIVER_NIGER_WORLD()
  const below = niger.filter((p) => terrainHeight(p.x, p.z) < WATER_LEVEL).length
  check('Niger centreline is carved below water level', below === niger.length, `${below}/${niger.length}`)

  // confluence exists where the two rivers meet
  const conf = mapToWorld(82.5, 68.5)
  check('confluence point is open water', isWaterMap(82.5, 68.5))

  // the famous west-bank viewpoint is on land
  const a = ANCHORS['confluence']
  check('confluence viewpoint (stand) is on dry land', terrainHeight(a.standX, a.standZ) > WATER_LEVEL + 1)

  // Mount Patti rises dramatically
  const peak = mapToWorld(16.5, 18.5)
  const ph = terrainHeight(peak.x, peak.z)
  check('Mount Patti summit is tall', ph > PATTI_HEIGHT * 0.85, `${ph.toFixed(1)} vs ${PATTI_HEIGHT}`)

  // the city floor is gentle and buildable
  const cityH = terrainHeight(0, 0)
  check('city centre sits on solid ground', cityH > WATER_LEVEL + 0.5 && cityH < 6, cityH.toFixed(2))

  // district flats exist for all 10 locations — Stage 3.6 adds
  // environmental flats (adankolo/crusher/riverfront) on top
  const flatIds = Object.keys(DISTRICT_FLATS)
  const allLocationsFlatted = LOCATIONS.every((l) => flatIds.includes(l.id))
  check('district flats defined for all locations', allLocationsFlatted, `${flatIds.length} flats`)
}

/* ------------------------------ 3. location unity ---------------------------- */

console.log('\n— Location registry unity (no second registry) —')
{
  // every location resolved to a 3D anchor with the SAME id
  check('anchors exist for every location id', LOCATIONS.every((l) => !!ANCHORS[l.id]))

  // 3D positions derive from the SAME mapX/mapY as the 2D map
  let derived = true
  for (const l of LOCATIONS) {
    const w = mapToWorld(l.mapX, l.mapY)
    const a = ANCHORS[l.id]
    if (l.id === 'confluence') continue // viewpoint offset by design
    if (Math.abs(a.x - w.x) > 0.001 || Math.abs(a.z - w.z) > 0.001) derived = false
  }
  check('anchor coords derive from locations.mapX/mapY', derived)

  // all stands on walkable ground
  let allDry = true
  for (const l of LOCATIONS) {
    const an = ANCHORS[l.id]
    if (terrainHeight(an.standX, an.standZ) < WATER_LEVEL + 0.5) allDry = false
  }
  check('no location stand is in the water', allDry)
}

/* ------------------------------- 4. road network ----------------------------- */

console.log('\n— Roads & the Niger bridge —')
{
  // every road resolves and has length
  const allRoads = RESOLVED_ROADS.every((r) => r.pts.length >= 2 && polylineLength(r.pts) > 10)
  check('all roads resolve to world polylines', allRoads)

  // all 90 ordered location pairs route through the network
  const ids = LOCATIONS.map((l) => l.id)
  let routable = 0
  let bad = 0
  for (const a of ids) {
    for (const b of ids) {
      if (a === b) continue
      const path = routeBetween(a, b)
      const len = polylineLength(path)
      if (path.length >= 2 && isFinite(len) && len > 0) routable++
      else bad++
    }
  }
  check('all 90 location pairs routable', bad === 0, `${routable} ok, ${bad} bad`)

  // routes start at the origin and end at the destination
  const p = routeBetween('mount-patti', 'home')
  const start = ANCHORS['mount-patti']
  const end = ANCHORS['home']
  const startOk = Math.hypot(p[0].x - start.standX, p[0].z - start.standZ) < 2
  const endOk = Math.hypot(p[p.length - 1].x - end.standX, p[p.length - 1].z - end.standZ) < 2
  check('routes run origin → destination', startOk && endOk)

  // the bridge: deck rides above water along the Patti road
  const pattiRoad = routeBetween('kpata-market', 'mount-patti')
  let deckSamples = 0
  let waterSamples = 0
  for (let i = 0; i <= 60; i++) {
    const pt = pointOnRoute(pattiRoad, i / 60)
    const g = groundHeight(pt.x, pt.z)
    const t = terrainHeight(pt.x, pt.z)
    if (g > WATER_LEVEL + 2.5) deckSamples++
    if (t < WATER_LEVEL) waterSamples++
  }
  check('Patti road crosses water (river is really there)', waterSamples > 0, `${waterSamples} samples`)
  check('bridge deck carries the road over the water', deckSamples >= 6, `${deckSamples} samples`)
  check('bridge has span + angle resolved', BRIDGE.span > 20 && isFinite(BRIDGE.angle))

  // groundHeight equals terrain everywhere except the bridge zone
  const far = mapToWorld(70, 70)
  check('groundHeight = terrainHeight off-bridge', Math.abs(groundHeight(far.x, far.z) - terrainHeight(far.x, far.z)) < 0.001)
}

/* ----------------------------- 5. building safety ---------------------------- */

console.log('\n— Building & prop placement safety —')
{
  const all = [
    ...DISTRICT_PLANS.flatMap((d) => d.buildings),
    ...EXTRA_PLANS.flatMap((d) => d.buildings),
    ...SCATTER_HOUSES,
    ...CITY_LANDMARKS,
  ]
  check('city has a meaningful building stock', all.length >= 140, `${all.length} buildings`)

  // nothing built on open water or underwater ground
  const onWater = all.filter((b) => {
    const mapX = b.x / 4 + 50
    const mapZ = b.z / 4 + 50
    return isWaterMap(mapX, mapZ)
  })
  check('no buildings stand in the rivers', onWater.length === 0, `${onWater.length} in water`)

  // all placements within the world bounds (Stage 3.6: ±300)
  const inBounds = all.every((b) => Math.abs(b.x) <= 300 && Math.abs(b.z) <= 300)
  check('all buildings inside world bounds', inBounds)

  // vegetation exists at scale and is dry
  const vegTotal = VEGETATION.trees.length + VEGETATION.palms.length + VEGETATION.bushes.length
  check('world is properly green', vegTotal >= 180, `${vegTotal} plants`)
  const wetPlants = [...VEGETATION.trees, ...VEGETATION.palms].filter((t) => {
    const mapX = t.x / 4 + 50
    const mapZ = t.z / 4 + 50
    return isWaterMap(mapX, mapZ)
  })
  check('no trees growing in the river', wetPlants.length === 0, `${wetPlants.length} drowned`)
}

/* ------------------------------ 6. travel sanity ----------------------------- */

console.log('\n— 3D routes agree with the 2D map distances —')
{
  // the world road path should roughly track the map distance — hub-routed
  // trips legitimately run longer than straight lines (up to ~3.5×)
  const kmPerMapUnit = 0.11
  const pairs: Array<[string, string]> = [
    ['home', 'kpata-market'],
    ['kpata-market', 'ganaja-junction'],
    ['ganaja-junction', 'confluence'],
    ['transport-area', 'home'],
  ]
  let plausible = true
  const detail: string[] = []
  for (const [a, b] of pairs) {
    const la = LOCATIONS.find((l) => l.id === a)!
    const lb = LOCATIONS.find((l) => l.id === b)!
    const mapKm = Math.hypot(lb.mapX - la.mapX, lb.mapY - la.mapY) * kmPerMapUnit
    const roadUnits = polylineLength(routeBetween(a, b))
    const roadKm = (roadUnits / 4) * kmPerMapUnit // world→map→km
    const ratio = roadKm / mapKm
    detail.push(`${a}→${b} ×${ratio.toFixed(2)}`)
    if (ratio < 0.85 || ratio > 3.5) plausible = false
  }
  check('road distances plausible vs map distances', plausible, detail.join(', '))
}

console.log(`\n${'='.repeat(46)}`)
console.log(`STAGE 3.5 WORLD TESTS: ${passed} passed, ${failed} failed`)
console.log(`${'='.repeat(46)}`)
if (failed > 0) process.exit(1)
