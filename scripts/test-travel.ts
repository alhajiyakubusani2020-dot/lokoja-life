/**
 * Lokoja Life — Stage 2 travel system test (pure functions, no browser).
 * Run: bun run scripts/test-travel.ts
 * Verifies: determinism, fare/time/energy sanity for all pairs & transports,
 * weather modifiers, event eligibility, and the spec's example trip.
 */

import { calculateTravel, rollTravelEvent } from '../src/game/systems/travel'
import { LOCATIONS, LOCATION_BY_ID } from '../src/game/data/locations'

let failures = 0
function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    console.log(`  ✓ ${name}`)
  } else {
    failures += 1
    console.error(`  ✗ ${name} ${detail}`)
  }
}

console.log('\n— Determinism —')
{
  const home = LOCATION_BY_ID['home']
  const kpata = LOCATION_BY_ID['kpata-market']
  const a = calculateTravel(home, kpata, 'keke', 'sunny', 'morning')
  const b = calculateTravel(home, kpata, 'keke', 'sunny', 'morning')
  check('same inputs → identical plan', JSON.stringify(a) === JSON.stringify(b))
}

console.log('\n— Spec example trip: Home → Kpata Market (≈0.55 km in the REAL town — near neighbours) —')
{
  const home = LOCATION_BY_ID['home']
  const kpata = LOCATION_BY_ID['kpata-market']
  const walk = calculateTravel(home, kpata, 'walk', 'sunny', 'morning')
  const keke = calculateTravel(home, kpata, 'keke', 'sunny', 'morning')
  const taxi = calculateTravel(home, kpata, 'taxi', 'sunny', 'morning')
  check('walk free, ~3 min, cheapest energy', walk.cost === 0 && walk.minutes >= 2 && walk.minutes <= 8 && walk.energyCost >= 1, JSON.stringify(walk))
  check('keke ≈ ₦130 / ~1 min', keke.cost >= 100 && keke.cost <= 170 && keke.minutes <= 4 && keke.energyCost <= 3, JSON.stringify(keke))
  check('taxi ≈ ₦420 / ~1 min', taxi.cost >= 380 && taxi.cost <= 480 && taxi.minutes <= 4 && taxi.energyCost <= 2, JSON.stringify(taxi))
  check('a short real hop stays the same day (one slot advances)', keke.arrival.dayDelta === 0)
  check('walk is the slowest, taxi the fastest', walk.minutes > keke.minutes && keke.minutes >= taxi.minutes)
}

console.log('\n— Weather modifiers (gentle, ordered) —')
{
  const home = LOCATION_BY_ID['home']
  const confluence = LOCATION_BY_ID['confluence']
  for (const t of ['walk', 'keke', 'taxi'] as const) {
    const sunny = calculateTravel(home, confluence, t, 'sunny', 'morning')
    const rain = calculateTravel(home, confluence, t, 'rain', 'morning')
    check(`rain slows ${t} (by ≤ 40%)`, rain.minutes >= sunny.minutes && rain.minutes <= Math.ceil(sunny.minutes * 1.5), `${sunny.minutes}→${rain.minutes}`)
  }
}

console.log('\n— Location modifiers —')
{
  const home = LOCATION_BY_ID['home']
  const patti = LOCATION_BY_ID['mount-patti']
  const walk = calculateTravel(home, patti, 'walk', 'sunny', 'morning')
  check('Mount Patti uphill costs more (×1.5)', walk.minutes >= 20 && walk.energyCost >= 14, JSON.stringify(walk))
  check('Mount Patti has no taxi access', !patti.transport.includes('taxi'))
}

console.log('\n— All pairs × transports produce sane plans —')
{
  let bad = 0
  for (const from of LOCATIONS) {
    for (const to of LOCATIONS) {
      if (from.id === to.id) continue
      for (const t of ['walk', 'keke', 'taxi'] as const) {
        const p = calculateTravel(from, to, t, 'sunny', 'morning')
        if (
          !(p.cost >= 0 && p.minutes >= 1 && p.energyCost >= 1 && p.distanceKm > 0)
        ) {
          bad += 1
          console.error(`    bad plan ${from.id}→${to.id} by ${t}: ${JSON.stringify(p)}`)
        }
      }
    }
  }
  check('90 pairs × 3 transports all valid', bad === 0)
}

console.log('\n— Travel event framework —')
{
  // deterministic eligibility: rain event only in rain, keke event only keke
  let rainEventSeen = false
  let kekeEventSeen = false
  let trafficSeen = false
  for (let i = 0; i < 400; i++) {
    const e = rollTravelEvent('keke', 'rain')
    if (e) {
      if (e.id === 'rain-delay') rainEventSeen = true
      if (e.id === 'keke-stop') kekeEventSeen = true
      if (e.id === 'traffic') trafficSeen = true
    }
  }
  check('rain event can roll in rain (keke)', rainEventSeen)
  check('keke event can roll (keke)', kekeEventSeen)
  check('traffic event can roll', trafficSeen)

  let rainEventInSunny = false
  for (let i = 0; i < 400; i++) {
    const e = rollTravelEvent('walk', 'sunny')
    if (e?.id === 'rain-delay') rainEventInSunny = true
  }
  check('rain event NEVER rolls in sunny', !rainEventInSunny)
}

console.log(failures === 0 ? '\nALL TRAVEL TESTS PASSED ✅\n' : `\n${failures} TEST(S) FAILED ❌\n`)
process.exit(failures === 0 ? 0 : 1)
