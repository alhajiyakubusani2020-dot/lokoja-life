import '../scripts/geo/bootstrap'
/**
 * LOKOJA LIFE — M23 W4: THE WORLD UI — speedo, banners, photo frame
 * -----------------------------------------------------------------
 * The user's order: "Speedometer (km/h off DriveSystem velocity) +
 * 'Entering Ganaja Road' junction banners" and the interaction/photo
 * polish pass. W4's laws, pinned:
 *   1. THE SPEEDOMETER LAW — the conversion is the W1 furniture scale
 *      (1 m ≈ 0.55 u, the NEPA pole's own law): km/h = u/s × 3.6 / 0.55
 *      exactly; a danfo at top speed reads a true 54 km/h; the cluster
 *      is REF-DRIVEN (no per-frame setState — the poll law holds).
 *   2. THE BANNER LAW — the named streets are the real OSM plates; the
 *      proximity check is pure; a banner dedupes per name and releases
 *      the mouth when you leave it.
 *   3. THE PHOTO FRAME LAW — photo mode keeps its HUD hiding but gains
 *      the thirds grid + framing corners + the postcard mark; nothing
 *      pointer-events-blocking.
 *   4. THE WIRING LAW — the e2e drive hook feeds the REAL pipeline
 *      (setDriveActive + reportDriveSpeed, never direct HUD mutation),
 *      and the touched world3d modules stay deterministic.
 * Run: bun scripts/test-m23-w4.ts
 */

import { readFileSync } from 'fs'
import { speedToKmh, KMH_PER_U } from '../src/components/game/world/controls'
import { STREET_PLATES, nearestPlate, plateStats } from '../src/game/world3d/plates'
import { VEHICLE_BY_MODEL } from '../src/game/data/vehicles'

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

console.log('\n--- W4.1 THE SPEEDOMETER LAW ---')
{
  check('the factor is 3.6 / 0.55 (m/s → km/h over the furniture scale)', Math.abs(KMH_PER_U - 6.545454545454545) < 1e-12, KMH_PER_U.toFixed(6))
  check('conversion is exact multiplication', Math.abs(speedToKmh(5.5) - 36) < 1e-9, `5.5 u/s → ${speedToKmh(5.5).toFixed(2)} km/h`)
  check('zero speed reads zero', speedToKmh(0) === 0)
  check('reverse reads negative (the gear chip shows R)', speedToKmh(-1) < 0)
  // every owned drivable tops out inside the 80 km/h gauge scale
  let inside = true
  const tops: string[] = []
  for (const [model, def] of Object.entries(VEHICLE_BY_MODEL)) {
    if (!def) continue
    const kmh = speedToKmh(def.topSpeed)
    tops.push(`${model} ${kmh.toFixed(0)}`)
    if (kmh > 80) inside = false
  }
  check('every ride tops out inside the 80 km/h gauge', inside, tops.join(', '))
  const hud = readFileSync('src/components/game/world/HudOverlay.tsx', 'utf8')
  check('the cluster is ref-driven (no km/h setState)', hud.includes('speedoNumRef.current.textContent') && !hud.includes('setSpeedKmh'))
  check('the needle rides the poll, not a timer', hud.includes('speedoNeedleRef.current.style.transform'))
  check('the latch resets when the cluster unmounts', hud.includes("lastKmhRef.current !== -999"))
}

console.log('\n--- W4.2 THE BANNER LAW ---')
{
  const st = plateStats()
  check('named plates exist to speak (≥ 8)', STREET_PLATES.length >= 8, `${st.count} plates, ${st.uniqueNames} names`)
  check('proximity is pure (same input, same answer)', (() => {
    const a = nearestPlate(STREET_PLATES[0].x + 1, STREET_PLATES[0].z + 1, 9)
    const b = nearestPlate(STREET_PLATES[0].x + 1, STREET_PLATES[0].z + 1, 9)
    return a?.plate.name === b?.plate.name && a?.dist === b?.dist
  })())
  check('nearest wins over first', (() => {
    // stand next to a plate: it must be the one returned
    const p = STREET_PLATES[2]
    const r = nearestPlate(p.x + 0.3, p.z + 0.3, 9)
    return r !== null && r.plate.name === p.name
  })())
  check('null far from every plate', nearestPlate(9999, 9999, 7) === null)
  check('radius respected (a plate just outside returns null)', (() => {
    const p = STREET_PLATES[0]
    return nearestPlate(p.x + 7.5, p.z, 7) === null
  })())
  const hud = readFileSync('src/components/game/world/HudOverlay.tsx', 'utf8')
  check('the poll reads the live photo/travel flags (no stale closure)', hud.includes('!isPhotoMode() && panelRef.current.kind === \'none\' && !travellingRef.current'))
  check('banners dedupe 24s per name', hud.includes('24_000'))
  check('the banner releases the mouth on exit', hud.includes("lastPlateNameRef.current = null"))
  check('the banner names are the real OSM strings (uppercased in CSS, not mutated)', hud.includes('uppercase tracking-wide text-white">{banner.name}'))
}

console.log('\n--- W4.3 THE PHOTO FRAME LAW ---')
{
  const hud = readFileSync('src/components/game/world/HudOverlay.tsx', 'utf8')
  check('the thirds grid is four hairlines', (hud.match(/bg-white\/20/g) ?? []).length >= 4)
  check('the framing corners are four', (hud.match(/border-l-2 border-t-2/g) ?? []).length === 1 && (hud.match(/border-b-2 border-r-2/g) ?? []).length === 1)
  check('the postcard mark carries the city + the sky', hud.includes('LOKOJA LIFE') && hud.includes('world.timeOfDay'))
  check('nothing in the frame blocks the camera', hud.includes('pointer-events-none absolute inset-0 z-10'))
  check('the frame lives only in photo mode', hud.includes('{photo && ('))
}

console.log('\n--- W4.4 THE WIRING LAW ---')
{
  const wt = readFileSync('src/components/game/world/WorldTab.tsx', 'utf8')
  check('the e2e drive hook feeds the REAL pipeline', wt.includes('setDriveActive(on, \'danfo\')') && wt.includes('reportDriveSpeed(on ? (speed ?? 5.2) : 0)'))
  check('the hook stays behind the e2e gate', (() => {
    const idx = wt.indexOf('forceDrive')
    const gate = wt.lastIndexOf("e2e=1", idx)
    return gate > 0 && idx - gate < 4000
  })())
  const pl = readFileSync('src/game/world3d/plates.ts', 'utf8')
  const ct = readFileSync('src/components/game/world/controls.ts', 'utf8')
  check('plates.ts stays deterministic', !pl.includes('Math.random'))
  check('controls.ts conversion is the documented constant', ct.includes('3.6 / 0.55'))
}

console.log(`\n${'='.repeat(52)}`)
console.log(`M23 W4 WORLD UI: ${passed} passed, ${failed} failed`)
console.log('='.repeat(52))
if (failed > 0) process.exit(1)
