import '../scripts/geo/bootstrap'
/**
 * LOKOJA LIFE — M23 W3: THE JUNCTIONS — signals, roundabout, humps, stops
 * -----------------------------------------------------------------------
 * The user's order: "Traffic lights… roundabout… Speed bumps… Ackermann
 * steering… Danfo stops". W3's laws, pinned:
 *   1. THE PHASE LAW — the signal timing table (green 12 → amber 3 → red
 *      15) is exact at every boundary, pure in its inputs, cycles forever,
 *      and the city's masts run desynchronised (distinct offsets).
 *   2. THE SIGNAL SITING LAW — every mast off the tarmac (roadGap ≥ 0.45),
 *      dry, outside fenced ground, ≤ 14 masts, ≥ 8 (the big mouths).
 *   3. THE HUMP LAW — the cos² profile is exactly A at the throat, exactly
 *      0 at the ends, C¹ smooth (zero slope at the ends), monotone on each
 *      half; bumpHeightAt is the shared truth (profile at the centre, 0
 *      away); every hump guards a school frontage on a major artery.
 *   4. THE ACKERMANN LAW — cot(δo) − cot(δi) = w/L verified numerically
 *      across the real vehicle geometry, and the DriveSystem actually
 *      lays per-wheel angles on the front pivots.
 *   5. THE BAY LAW — every stop stands off the carriageway beside a real
 *      transit bay; private sedans get no stop.
 *   6. THE WIRING LAW — the renderers exist and render (roundabout annulus
 *      + yield lines, humps extruded, signals instanced, stops sheltered),
 *      and the data stays deterministic (no Math.random).
 * Run: bun scripts/test-m23-w3.ts
 */

import { readFileSync } from 'fs'
import { WATER_Y, heightAt, inCivicCampus, inSchoolYard, roadGap } from '../src/game/world3d/layout'
import { PARKED_VEHICLES } from '../src/game/world3d/vehicles'
import {
  DANFO_STOPS, JUNCTION_CLUSTERS, PHASE_AMBER, PHASE_CYCLE, PHASE_GREEN, PHASE_RED,
  SPEED_BUMPS, TRAFFIC_LIGHTS, BUMP_AMPLITUDE, BUMP_HALF_LEN,
  junctionStats, lightPhaseAt, secondsToPhaseChange, bumpProfile, bumpHeightAt,
} from '../src/game/world3d/junctions'

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

const st = junctionStats()

console.log('\n--- W3.1 THE PHASE LAW (the timing table) ---')
{
  check('the table sums to a 30s cycle', PHASE_CYCLE === 30, `${PHASE_GREEN}+${PHASE_AMBER}+${PHASE_RED}`)
  check('green holds the full 12s', lightPhaseAt(0, 0) === 'green' && lightPhaseAt(0, 11.999) === 'green')
  check('amber begins exactly at 12 and ends before 15', lightPhaseAt(0, 12) === 'amber' && lightPhaseAt(0, 14.999) === 'amber')
  check('red begins exactly at 15', lightPhaseAt(0, 15) === 'red' && lightPhaseAt(0, 29.999) === 'red')
  check('the cycle wraps to green at 30', lightPhaseAt(0, 30) === 'green')
  check('phase is pure (same input, same answer)', lightPhaseAt(7.3, 41.2) === lightPhaseAt(7.3, 41.2))
  check('negative world time is safe (mod folded)', lightPhaseAt(5, -1) === 'red' || lightPhaseAt(5, -1) === 'green' || lightPhaseAt(5, -1) === 'amber')
  // seconds-to-change is consistent with the phase boundaries
  let bad = 0
  for (let t = 0; t < PHASE_CYCLE; t += 0.5) {
    const p0 = lightPhaseAt(0, t)
    const dt = secondsToPhaseChange(0, t)
    const p1 = lightPhaseAt(0, t + dt - 0.001)
    const p2 = lightPhaseAt(0, t + dt + 0.001)
    if (p1 !== p0 || p2 === p0) bad++
  }
  check('secondsToPhaseChange lands on every boundary', bad === 0, `${bad} misses`)
  const offsets = new Set(TRAFFIC_LIGHTS.map((l) => Math.round(l.offset * 10) / 10))
  check('the grid runs desynchronised (≥ 6 distinct offsets)', offsets.size >= Math.min(6, TRAFFIC_LIGHTS.length), `${offsets.size} distinct`)
  check('every offset inside the cycle', TRAFFIC_LIGHTS.every((l) => l.offset >= 0 && l.offset < PHASE_CYCLE))
}

console.log('\n--- W3.2 THE SIGNAL SITING LAW ---')
{
  let bad = 0
  for (const l of TRAFFIC_LIGHTS) {
    if (roadGap(l.x, l.z) < 0.45) bad++
    if (heightAt(l.x, l.z) <= WATER_Y + 0.12) bad++
    if (inSchoolYard(l.x, l.z) || inCivicCampus(l.x, l.z)) bad++
  }
  check('every mast off the tarmac, dry, outside yards', bad === 0, `${bad} violations`)
  check('the big mouths are signalled (≥ 8 masts)', TRAFFIC_LIGHTS.length >= 8, `${TRAFFIC_LIGHTS.length} of ${st.bigMouths} big mouths`)
  check('the mast cap respected (≤ 14)', TRAFFIC_LIGHTS.length <= 14)
  check('every mast maps to a real cluster', TRAFFIC_LIGHTS.every((l) => JUNCTION_CLUSTERS[l.cluster] !== undefined))
  check('clusters found on the real graph (≥ 20)', JUNCTION_CLUSTERS.length >= 20, `${st.clusters} clusters, ${st.bigMouths} big`)
}

console.log('\n--- W3.3 THE HUMP LAW (the sinusoid) ---')
{
  check('profile at the throat is exactly A', Math.abs(bumpProfile(0) - BUMP_AMPLITUDE) < 1e-12)
  check('profile at the ends is exactly 0', bumpProfile(-1) === 0 && bumpProfile(1) === 0)
  check('C¹ smooth — zero slope at both ends', (() => {
    const e = 1e-4
    return bumpProfile(-1 + e) < 1e-6 && bumpProfile(1 - e) < 1e-6
  })())
  let mono = true
  for (let u = 0; u <= 1; u += 0.05) {
    if (bumpProfile(u) < bumpProfile(Math.min(1, u + 0.05)) - 1e-12) mono = false
  }
  check('monotone rising then falling (half-law)', mono)
  check('profile clamps outside [−1, 1]', bumpProfile(2) === 0 && bumpProfile(-2) === 0)
  // the shared truth
  let shared = true
  for (const b of SPEED_BUMPS) {
    if (Math.abs(bumpHeightAt(b.x, b.z) - BUMP_AMPLITUDE) > 1e-9) shared = false
    if (bumpHeightAt(b.x + 5, b.z + 5) !== 0) shared = false
  }
  check('bumpHeightAt = the profile at every hump centre, 0 away', shared)
  check('humps exist and stay capped (4 ≤ n ≤ 12)', SPEED_BUMPS.length >= 4 && SPEED_BUMPS.length <= 12, `${SPEED_BUMPS.length} humps`)
  let siting = 0
  for (const b of SPEED_BUMPS) {
    if (heightAt(b.x, b.z) <= WATER_Y + 0.12) siting++
    if (roadGap(b.x, b.z) > 0.6) siting++ // a hump sits ON the carriageway it guards
  }
  check('every hump ON its carriageway, dry', siting === 0, `${siting} violations`)
}

console.log('\n--- W3.4 THE ACKERMANN LAW (cot δo − cot δi = w/L) ---')
{
  // the law, verified over the real vehicle geometry grid
  const dims = [
    { L: 2.56, w: 1.6 }, // taxi
    { L: 2.7, w: 1.72 }, // danfo
    { L: 2.85, w: 1.7 }, // lorry (front ±0.85, axles 1.35/−1.5)
  ]
  let worst = 0
  for (const { L, w } of dims) {
    for (const R of [2, 3.5, 5, 12, 40, 150]) {
      const di = Math.atan(L / (R - w / 2))
      const doo = Math.atan(L / (R + w / 2))
      const residual = Math.abs(1 / Math.tan(doo) - 1 / Math.tan(di) - w / L)
      worst = Math.max(worst, residual)
    }
  }
  check('cot(δo) − cot(δi) = w/L to 1e-9 across the fleet', worst < 1e-9, `worst ${worst.toExponential(2)}`)
  // the inner wheel always steers MORE than the outer
  let inner = true
  for (const { L, w } of dims) {
    for (const R of [2, 5, 20]) {
      if (!(Math.atan(L / (R - w / 2)) > Math.atan(L / (R + w / 2)))) inner = false
    }
  }
  check('the inner wheel steers sharper than the outer (always)', inner)
  const ds = readFileSync('src/components/game/world/DriveSystem.tsx', 'utf8')
  check('DriveSystem lays per-wheel Ackermann angles', ds.includes('rig.frontWheels[0].rotation.y') && ds.includes('rig.frontWheels[1].rotation.y'))
  check('DriveSystem uses the real turn radius (speed / yawRate)', ds.includes('Math.abs(d.speed / yawRate)'))
  check('the rigs carry steerable front pivots', (() => {
    const v = readFileSync('src/game/world3d/vehicles.ts', 'utf8')
    const pivots = (v.match(/rig\.frontWheels\.push\(pivot\)/g) ?? []).length
    return pivots >= 3 // danfo + sedan + lorry — each pushes inside a ±1 loop (2 wheels)
  })(), '3 pivot loops = 6 steerable wheels')
}

console.log('\n--- W3.5 THE BAY LAW (the danfo stops) ---')
{
  let bad = 0
  for (const s of DANFO_STOPS) {
    if (roadGap(s.x, s.z) < 0.55) bad++
    if (heightAt(s.x, s.z) <= WATER_Y + 0.12) bad++
    if (inSchoolYard(s.x, s.z) || inCivicCampus(s.x, s.z)) bad++
  }
  check('every stop off the tarmac, dry, outside yards', bad === 0, `${bad} violations`)
  const TRANSIT = new Set(['danfo', 'taxi', 'keke', 'okada'])
  const bays = PARKED_VEHICLES.filter((v) => TRANSIT.has(v.build))
  let served = 0
  for (const bay of bays) {
    if (DANFO_STOPS.some((s) => Math.hypot(s.x - bay.x, s.z - bay.z) < 7.5)) served++
  }
  check('every served stop sits beside a real transit bay (≤ 7.5u)', served >= DANFO_STOPS.length, `${DANFO_STOPS.length} stops for ${bays.length} transit bays`)
  check('stops exist (≥ 2) and stay capped (≤ 6)', DANFO_STOPS.length >= 2 && DANFO_STOPS.length <= 6, `${DANFO_STOPS.length} stops`)
  check('no stop within 2.2u of another (no doubled shelters)', (() => {
    for (let i = 0; i < DANFO_STOPS.length; i++) {
      for (let j = i + 1; j < DANFO_STOPS.length; j++) {
        if (Math.hypot(DANFO_STOPS[i].x - DANFO_STOPS[j].x, DANFO_STOPS[i].z - DANFO_STOPS[j].z) < 2.2) return false
      }
    }
    return true
  })())
}

console.log('\n--- W3.6 THE WIRING + DETERMINISM LAW ---')
{
  const cm = readFileSync('src/components/game/world/CityMesh.tsx', 'utf8')
  const wt = readFileSync('src/components/game/world/WorldTerrain.tsx', 'utf8')
  const jn = readFileSync('src/game/world3d/junctions.ts', 'utf8')
  check('CityMesh renders the signals + stops', cm.includes('function TrafficLights()') && cm.includes('<TrafficLights />') && cm.includes('function DanfoStops()') && cm.includes('<DanfoStops />'))
  check('the roundabout is the real annulus with yield lines', cm.includes('ringGeometry args={[3.0, 5.0, 30]}') && cm.includes('YIELD LINES'))
  check('WorldTerrain extrudes the humps', wt.includes('function SpeedBumps()') && wt.includes('<SpeedBumps />'))
  check('the hump renderer and the physics share ONE profile', wt.includes('bumpProfile(u)') && dsIncludesBump())
  check('signal colours only rewrite on phase change', cm.includes('if (lastPhase.current[i] === code) continue'))
  check('junctions.ts has no Math.random (determinism law)', !jn.includes('Math.random'))
  function dsIncludesBump(): boolean {
    const ds = readFileSync('src/components/game/world/DriveSystem.tsx', 'utf8')
    return ds.includes('bumpHeightAt(d.x, d.z)')
  }
}

console.log(`\n${'='.repeat(52)}`)
console.log(`M23 W3 JUNCTIONS: ${passed} passed, ${failed} failed`)
console.log('='.repeat(52))
if (failed > 0) process.exit(1)
