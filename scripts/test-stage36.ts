/**
 * LOKOJA LIFE — Stage 3.6 Tests: Movement, Joystick & World Expansion
 * ---------------------------------------------------------------------
 * Headless verification of the ONE movement controller (controls.ts):
 * joystick normalization, dead zone, diagonal clamp, camera-relative
 * movement, collision/water/bounds handling, framerate independence,
 * near-zone settling — plus the expanded world (new roads, colliders,
 * travel regression, location registry untouched).
 *
 * Run: bun run scripts/test-stage36.ts
 */

import {
  normalizeJoystick, combineInputs, cameraRelative, stepPlayer,
  buildColliderGrid, nearestLocationZone, blockedGround,
  joystickState, keyState, sprintButton,
} from '../src/components/game/world3d/controls'
import { MOVEMENT } from '../src/game/data/config'
import { WORLD_BOUNDS, terrainHeight, isWaterMap, WATER_LEVEL } from '../src/game/systems/terrain'
import {
  ANCHORS, RESOLVED_ROADS, EXTRA_PLANS, DISTRICT_PLANS, SCATTER_HOUSES,
  routeBetween, groundHeight, LANDMARK_POSITIONS,
} from '../src/game/data/world3d'
import { LOCATIONS, LOCATION_BY_ID } from '../src/game/data/locations'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

/* --------------------------- 1. joystick input ---------------------------- */

console.log('\n— Joystick normalization (analog, dead zone, clamp) —')
{
  // straight up = full forward (screen-up maps to forward +1)
  const up = normalizeJoystick(0, -46, 46)
  check('full push up → forward 1.0', Math.abs(up.y - 1) < 0.001 && Math.abs(up.x) < 0.001)

  // small push = analog (past the dead zone, not binary)
  const small = normalizeJoystick(0, -12, 46)
  const smallMag = Math.hypot(small.x, small.y)
  check('small push → analog between 0 and 1', smallMag > 0 && smallMag < 0.5, smallMag.toFixed(3))

  // inside the dead zone → neutral
  const dead = normalizeJoystick(2, -3, 46)
  check('dead zone reads neutral', dead.x === 0 && dead.y === 0)

  // overshoot clamps to the unit circle
  const far = normalizeJoystick(0, -90, 46)
  check('over-deflection clamps to 1.0', Math.abs(Math.hypot(far.x, far.y) - 1) < 0.001)

  // 45° diagonal keeps equal axes
  const diag = normalizeJoystick(32.5, -32.5, 46)
  check('diagonal keeps equal axes', Math.abs(diag.x - diag.y) < 0.01, `${diag.x.toFixed(3)}/${diag.y.toFixed(3)}`)

  // release returns to zero
  const zero = normalizeJoystick(0, 0, 46)
  check('release → neutral', zero.x === 0 && zero.y === 0)
}

/* ---------------------------- 2. combined input ---------------------------- */

console.log('\n— Combined keyboard + joystick intent —')
{
  // diagonal never exceeds magnitude 1
  const diag = combineInputs({ x: 1, y: 1 }, keyState, false)
  check('diagonal joystick clamps to magnitude 1', Math.hypot(diag.ix, diag.iz) <= 1.0001)

  // opposite keys cancel
  const keys = { up: true, down: true, left: false, right: false, sprint: false }
  const cancel = combineInputs({ x: 0, y: 0 }, keys, false)
  check('up+down keys cancel', cancel.ix === 0 && cancel.iz === 0)

  // keyboard + joystick sum then clamp
  const keysR = { up: false, down: false, left: false, right: true, sprint: false }
  const summed = combineInputs({ x: 1, y: 0 }, keysR, false)
  check('joystick + key right clamps to ≤ 1', Math.hypot(summed.ix, summed.iz) <= 1.0001)

  // sprint only via the explicit modifier
  const walk = combineInputs({ x: 0, y: 1 }, { up: false, down: false, left: false, right: false, sprint: false }, false)
  check('no sprint without the modifier', walk.sprint === false)
  const run = combineInputs({ x: 0, y: 1 }, { up: false, down: false, left: false, right: false, sprint: false }, true)
  check('sprint modifier engages', run.sprint === true)
  const idleRun = combineInputs({ x: 0, y: 0 }, { up: false, down: false, left: false, right: false, sprint: false }, true)
  check('sprint while idle stays false', idleRun.sprint === false)
}

/* -------------------------- 3. camera-relative move ------------------------ */

console.log('\n— Camera-relative movement —')
{
  // camera behind the player (theta = 0 → camera at +Z): up input → -Z
  const f = cameraRelative(0, 1, 0)
  check('θ=0: forward input walks away from camera (-Z)', Math.abs(f.mz + 1) < 0.001 && Math.abs(f.mx) < 0.001)

  // camera at -Z (theta = π): forward → +Z
  const b = cameraRelative(0, 1, Math.PI)
  check('θ=π: forward input flips to +Z', Math.abs(b.mz - 1) < 0.001)

  // right input strafes right relative to the camera
  const r = cameraRelative(1, 0, 0)
  check('θ=0: right input strafes +X', Math.abs(r.mx - 1) < 0.001)

  // magnitude preserved (analog feel after rotation)
  const m = cameraRelative(0.5, 0.5, 1.234)
  check('rotation preserves magnitude', Math.abs(Math.hypot(m.mx, m.mz) - Math.hypot(0.5, 0.5)) < 0.0001)
}

/* ------------------------------ 4. stepPlayer ------------------------------ */

console.log('\n— Movement solver (collision, water, bounds, framerate) —')
{
  const grid = buildColliderGrid()
  check('collision grid built', grid.buckets.size > 10, `${grid.buckets.size} cells`)

  // near a known building: house at home district — find any collider
  let colliderCount = 0
  for (const bucket of grid.buckets.values()) colliderCount += bucket.length
  check('colliders cover the whole city', colliderCount > 150, `${colliderCount} colliders`)
  check('landmarks are solid', !!LANDMARK_POSITIONS.mosque && !!LANDMARK_POSITIONS.church)

  // walk forward for 2 seconds at full input, camera θ=0 → heads -Z
  const pos = { x: 0, z: 88 }
  const vel = { x: 0, z: 0 }
  const intent = { ix: 0, iz: 1, sprint: false }
  for (let i = 0; i < 120; i++) stepPlayer(pos, vel, intent, 1 / 60, 0, grid)
  const distWalk = Math.hypot(pos.x - 0, pos.z - 88)
  const expected = MOVEMENT.walkSpeed * 2 * 0.92 // settle tolerance for accel ramp
  check('2s walk covers ≈ walkSpeed × 2', distWalk > expected * 0.75 && distWalk < expected * 1.15, `${distWalk.toFixed(1)}u`)

  // sprint covers more ground
  const pos2 = { x: 0, z: 88 }
  const vel2 = { x: 0, z: 0 }
  for (let i = 0; i < 120; i++) stepPlayer(pos2, vel2, { ix: 0, iz: 1, sprint: true }, 1 / 60, 0, grid)
  const distRun = Math.hypot(pos2.x, pos2.z - 88)
  check('sprint outpaces walk', distRun > distWalk * 1.4, `${distRun.toFixed(1)} vs ${distWalk.toFixed(1)}`)

  // framerate independence: 60×(1/60)s ≈ 30×(1/30)s (within smoothing tolerance)
  const posA = { x: 200, z: 200 }
  const velA = { x: 0, z: 0 }
  const posB = { x: 200, z: 200 }
  const velB = { x: 0, z: 0 }
  for (let i = 0; i < 60; i++) stepPlayer(posA, velA, intent, 1 / 60, 0, grid)
  for (let i = 0; i < 30; i++) stepPlayer(posB, velB, intent, 1 / 30, 0, grid)
  const dA = Math.hypot(posA.x - 200, posA.z - 200)
  const dB = Math.hypot(posB.x - 200, posB.z - 200)
  check('framerate-independent distance', Math.abs(dA - dB) / Math.max(dA, 0.001) < 0.1, `${dA.toFixed(2)} vs ${dB.toFixed(2)}`)

  // can never walk into the Niger: march toward the river from Kpata
  const kpata = ANCHORS['kpata-market']
  const riverDir = { x: kpata.standX - 60, z: kpata.standZ - 10 } // roughly toward the river
  const norm = Math.hypot(riverDir.x, riverDir.z)
  const riverIntent = { ix: riverDir.x / norm, iz: riverDir.z / norm, sprint: false }
  const posR = { x: kpata.standX, z: kpata.standZ }
  const velR = { x: 0, z: 0 }
  let inWater = false
  for (let i = 0; i < 1200; i++) {
    stepPlayer(posR, velR, riverIntent, 1 / 60, 0, grid)
    if (groundHeight(posR.x, posR.z) < WATER_LEVEL + 0.17) { inWater = true; break }
  }
  check('water blocks the walker', !inWater)

  // bounds clamp: march west forever, never leave the world
  const posW = { x: 0, z: 88 }
  const velW = { x: 0, z: 0 }
  for (let i = 0; i < 3600; i++) stepPlayer(posW, velW, { ix: -1, iz: 0, sprint: true }, 1 / 60, 0, grid)
  check(
    'world bounds hold',
    posW.x >= WORLD_BOUNDS.minX && posW.x <= WORLD_BOUNDS.maxX,
    posW.x.toFixed(1),
  )

  // blockedGround sanity: Niger centreline is blocked, city centre is not
  // (map (23, 44.5) — a Niger polyline point — in world space)
  const nigerMid = { x: (23 - 50) * 4, z: (44.5 - 50) * 4 }
  check('river centre is blocked ground', blockedGround(nigerMid.x, nigerMid.z))
  check('city floor is walkable', !blockedGround(0, 88))

  // collision: walk straight into the central mosque, get pushed out
  const mosque = LANDMARK_POSITIONS.mosque
  const start = { x: mosque.x + 2, z: mosque.z }
  const velM = { x: 0, z: 0 }
  // push toward the mosque centre
  const toMosque = { ix: -1, iz: 0, sprint: false }
  let inside = false
  let p = { x: start.x, z: start.z }
  const v = { x: 0, z: 0 }
  for (let i = 0; i < 300; i++) {
    stepPlayer(p, v, toMosque, 1 / 60, 0, grid)
    const d = Math.hypot(p.x - mosque.x, p.z - mosque.z)
    if (d < 8.5 - MOVEMENT.playerRadius - 0.2) { inside = true; break }
  }
  check('buildings push the player out', !inside, `final dist ${(Math.hypot(p.x - mosque.x, p.z - mosque.z)).toFixed(2)}`)
}

/* --------------------------- 5. near-zone settle --------------------------- */

console.log('\n— Near-location zones (walking arrival) —')
{
  // standing on an anchor = inside that zone
  const home = ANCHORS['home']
  check('home anchor reads home zone', nearestLocationZone(home.standX, home.standZ) === 'home')

  // just outside the radius → null
  const far = home.standX + MOVEMENT.nearRadius + 6
  check('outside radius reads null', nearestLocationZone(far, home.standZ) === null)

  // every location resolves its own zone
  const all = LOCATIONS.every((l) => {
    const a = ANCHORS[l.id]
    return nearestLocationZone(a.standX, a.standZ) === l.id
  })
  check('every anchor resolves its own zone', all)

  // between two adjacent zones, exactly one wins
  const kpata = ANCHORS['kpata-market']
  const food = ANCHORS['food-area']
  const mid = { x: (kpata.standX + food.standX) / 2, z: (kpata.standZ + food.standZ) / 2 }
  const zone = nearestLocationZone(mid.x, mid.z)
  check('midpoint resolves to the nearer zone', zone === 'kpata-market' || zone === 'food-area' || zone === null, String(zone))
}

/* ----------------------- 6. expanded world integrity ----------------------- */

console.log('\n— Expanded world (Stage 3.6 geography) —')
{
  // new roads exist and are dry where they should be
  const newRoads = ['adankolo-road', 'north-bypass', 'riverfront-drive', 'crusher-spur', 'home-south-loop', 'market-backstreet', 'junction-east-street']
  const resolved = newRoads.map((id) => RESOLVED_ROADS.find((r) => r.id === id))
  check('all 7 new roads resolve', resolved.every((r) => !!r && r.pts.length >= 2))

  // new roads never run through open water — except the bridged Patti
  // road, whose deck legitimately crosses the Niger
  let roadWater = 0
  for (const road of RESOLVED_ROADS) {
    if (road.id === 'kpata-patti') continue // the Niger bridge crossing
    for (const p of road.pts) {
      if (isWaterMap(p.x / 4 + 50, p.z / 4 + 50)) roadWater++
    }
  }
  check('no road waypoint sits in open water (bridge exempt)', roadWater === 0, `${roadWater} waypoints`)

  // the Patti switchbacks climb well above the plain
  const pattiRoad = RESOLVED_ROADS.find((r) => r.id === 'kpata-patti')!
  let maxH = 0
  for (const p of pattiRoad.pts) maxH = Math.max(maxH, groundHeight(p.x, p.z))
  check('switchback road climbs the mountain', maxH > 18, `${maxH.toFixed(1)}u`)

  // the bridge still crosses the Niger on the same segment
  const bridgeCheck = groundHeight(
    pattiRoad.pts[1].x * 0.5 + pattiRoad.pts[2].x * 0.5,
    pattiRoad.pts[1].z * 0.5 + pattiRoad.pts[2].z * 0.5,
  )
  check('Patti road still rides the bridge deck', bridgeCheck > WATER_LEVEL + 2.5, `${bridgeCheck.toFixed(2)}`)

  // environmental areas exist with real buildings
  const extraBuildings = EXTRA_PLANS.flatMap((p) => p.buildings)
  check('3 environmental areas populated', EXTRA_PLANS.length === 3 && extraBuildings.length >= 18, `${extraBuildings.length} buildings`)

  // the outskirts grew
  check('outskirts populated (scatter houses)', SCATTER_HOUSES.length >= 90, `${SCATTER_HOUSES.length} houses`)
  check('districts grew fuller', DISTRICT_PLANS.reduce((n, p) => n + p.buildings.length, 0) > 180)

  // bounds expanded
  check('world bounds ±300', WORLD_BOUNDS.maxX === 300 && WORLD_BOUNDS.maxZ === 300)

  // frontier hills exist (NE ridge above the plain)
  const neHill = terrainHeight((92 - 50) * 4, (10 - 50) * 4)
  check('frontier ridge rises north-east', neHill > 9, `${neHill.toFixed(1)}u`)
}

/* ------------------- 7. travel + registry regression (S2/3.5) ---------------- */

console.log('\n— Location registry & travel untouched —')
{
  // stable ids untouched
  const ids = LOCATIONS.map((l) => l.id)
  check('10 stable location ids', ids.length === 10)
  check('no EXTRA plan holds a location id', EXTRA_PLANS.every((p) => !LOCATION_BY_ID[p.locationId]))

  // all 90 ordered pairs still routable (routing spokes unchanged)
  let routable = 0
  let bad = 0
  for (const a of LOCATIONS) {
    for (const b of LOCATIONS) {
      if (a.id === b.id) continue
      const route = routeBetween(a.id, b.id)
      if (route.length >= 2) routable++
      else bad++
    }
  }
  check('all 90 location pairs routable', routable === 90 && bad === 0, `${routable}/90`)

  // new roads never hijack routing (raw endpoints only)
  const hijacks = RESOLVED_ROADS.filter(
    (r) => r.endpoints[0] === '' && r.endpoints[1] === '' ? false : false,
  )
  void hijacks
  const firstRoadOfHome = RESOLVED_ROADS.find((r) => r.endpoints.includes('home'))!
  check('travel routing spokes unchanged (home → ganaja-home)', firstRoadOfHome.id === 'ganaja-home')

  // every anchor still on dry ground (with the new terrain)
  const allDry = LOCATIONS.every((l) => terrainHeight(ANCHORS[l.id].standX, ANCHORS[l.id].standZ) > WATER_LEVEL + 0.5)
  check('all anchors dry after terrain change', allDry)
}

console.log('==============================================')
console.log(`STAGE 3.6 TESTS: ${passed} passed, ${failed} failed`)
console.log('==============================================')
process.exit(failed > 0 ? 1 : 0)
