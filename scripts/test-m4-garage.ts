/**
 * LOKOJA LIFE — M4: THE GARAGE (pure rule checks)
 * ------------------------------------------------
 * Deterministic law blocks for vehicles × map depth: the fuel law (your
 * ride is always cheaper than the public fare for the same trip), the
 * access law (where each vehicle can physically go), the availability
 * law (only owned rides are offered), the resale law (deterministic
 * depreciation), the transport-id roundtrip, and a REAL store pass in
 * bun: buy → fuel-travel → ledger → sell, plus the refusal paths.
 * Run: bun scripts/test-m4-garage.ts
 */

import {
  allTravelOptions,
  canPersonalReach,
  personalModelOf,
  personalTransportId,
  personalTransportsFor,
  publicCounterpartId,
  resaleValue,
  transportAllowed,
} from '../src/game/systems/garage'
import { calculateTravel } from '../src/game/systems/travel'
import { ECONOMY, TRAVEL } from '../src/game/data/config'
import { VEHICLES, VEHICLE_BY_MODEL, generatePlate } from '../src/game/data/vehicles'
import { LOCATION_BY_ID } from '../src/game/data/locations'
import type { OwnedVehicle, TransportId, VehicleModel } from '../src/game/types'
import { DEFAULT_AVATAR } from '../src/game/data/avatar'

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

/* ---------------------------------- fixtures ---------------------------------- */

const vehicle = (model: VehicleModel, day = 1): OwnedVehicle => ({
  id: `${model}-test`,
  model,
  plate: generatePlate(model, day, 0),
  boughtDay: day,
})

const HOME = LOCATION_BY_ID['home']
const PATTI = LOCATION_BY_ID['mount-patti'] // keke-reachable, NO taxi road, L1
const KPATA = LOCATION_BY_ID['kpata-market']

console.log('\nDATA LAW — the showroom and the pump')
check('4 vehicle models', VEHICLES.length === 4)
check('short names unique and non-empty', new Set(VEHICLES.map((v) => v.short)).size === 4 && VEHICLES.every((v) => v.short.length > 0))
check('showroom prices strictly ascending', VEHICLES[0].price < VEHICLES[1].price && VEHICLES[1].price < VEHICLES[2].price && VEHICLES[2].price < VEHICLES[3].price)
check('every model has an own-* transport entry', VEHICLES.every((v) => ECONOMY.transport[personalTransportId(v.model)] !== undefined))
check('every own-* entry has base 0 (no fare — fuel only)', (Object.keys(ECONOMY.transport) as TransportId[]).filter((t) => t.startsWith('own-')).every((t) => ECONOMY.transport[t].cost.base === 0))
check('weather multipliers cover every transport id', (Object.keys(ECONOMY.transport) as TransportId[]).every((t) =>
  (['sunny', 'cloudy', 'rain', 'night-clear'] as const).every((w) => TRAVEL.weatherMinutesMultiplier[w][t] !== undefined),
))

console.log('\nID ROUNDTRIP — model ⇄ transport')
check('personalTransportId(okada) = own-okada', personalTransportId('okada') === 'own-okada')
check('roundtrip for all four models', VEHICLES.every((v) => personalModelOf(personalTransportId(v.model)) === v.model))
check('public modes map to null', (['walk', 'keke', 'taxi'] as TransportId[]).every((t) => personalModelOf(t) === null))

console.log('\nFUEL LAW — ownership always beats the public fare (same trip)')
{
  const sunny = 'sunny' as const
  const slot = 'morning' as const
  for (const v of VEHICLES) {
    const ownT = personalTransportId(v.model)
    const pubT = publicCounterpartId(v.model)
    const own = calculateTravel(HOME, KPATA, ownT, sunny, slot)
    const pub = calculateTravel(HOME, KPATA, pubT, sunny, slot)
    const ownKm = calculateTravel(HOME, KPATA, ownT, 'rain' as const, slot)
    check(`${v.short}: fuel < public ${pubT} fare`, own.cost < pub.cost, `fuel ${own.cost} vs fare ${pub.cost}`)
    check(`${v.short}: no slower than public ${pubT}`, own.minutes <= pub.minutes, `${own.minutes} vs ${pub.minutes}`)
    check(`${v.short}: fuel rounds to the naira step`, own.cost % TRAVEL.fareRounding === 0)
    check(`${v.short}: rain slows but never stops you`, ownKm.minutes >= own.minutes)
    check(`${v.short}: riding costs less effort than walking`, own.energyCost < calculateTravel(HOME, KPATA, 'walk', sunny, slot).energyCost)
  }
  const a = calculateTravel(HOME, KPATA, 'own-okada', sunny, slot)
  const b = calculateTravel(HOME, KPATA, 'own-okada', sunny, slot)
  check('determinism: same inputs, same fuel plan', a.cost === b.cost && a.minutes === b.minutes && a.energyCost === b.energyCost)
}

console.log('\nACCESS LAW — where each ride can physically go')
check('mount-patti has no taxi road (keke class only)', !PATTI.transport.includes('taxi'))
check('okada reaches mount-patti (keke class)', canPersonalReach(PATTI, 'okada'))
check('own keke reaches mount-patti', canPersonalReach(PATTI, 'keke'))
check('taxi CANNOT reach mount-patti', !canPersonalReach(PATTI, 'taxi'))
check('danfo CANNOT reach mount-patti', !canPersonalReach(PATTI, 'danfo'))
check('everywhere a taxi goes, all four rides go', [HOME, KPATA].every((loc) => VEHICLES.every((v) => canPersonalReach(loc, v.model))))
check('public walk law untouched', transportAllowed(HOME, 'walk', []) === HOME.transport.includes('walk'))
check('public keke law untouched', transportAllowed(HOME, 'keke', []) === true)

console.log('\nAVAILABILITY LAW — only the garage you have')
check('empty garage offers nothing personal', personalTransportsFor([]).length === 0)
check('okada-only garage offers own-okada only', JSON.stringify(personalTransportsFor([vehicle('okada')])) === JSON.stringify(['own-okada']))
check('full garage offers all four in showroom order', JSON.stringify(personalTransportsFor(VEHICLES.map((v) => vehicle(v.model)))) === JSON.stringify(['own-okada', 'own-keke', 'own-taxi', 'own-danfo']))
{
  const okadaOnly = [vehicle('okada')]
  check('unowned ride refused even on a reachable road', !transportAllowed(KPATA, 'own-taxi', okadaOnly))
  check('owned + reachable = allowed', transportAllowed(KPATA, 'own-okada', okadaOnly) === true)
  check('owned but no road = refused (danfo → Patti)', !transportAllowed(PATTI, 'own-danfo', [vehicle('danfo'), vehicle('okada')]))
}

console.log('\nOFFER LAW — allTravelOptions matches the store exactly')
{
  const empty = allTravelOptions(HOME, KPATA, 'sunny', 'morning', [])
  check('no garage → only the location\u2019s public modes', empty.every((o) => !o.personal) && empty.length === KPATA.transport.length)
  const full = allTravelOptions(HOME, KPATA, 'sunny', 'morning', VEHICLES.map((v) => vehicle(v.model)))
  check('full garage adds all four personal rows', full.filter((o) => o.personal).length === 4)
  check('personal rows are labelled "Your …"', full.filter((o) => o.personal).every((o) => o.label.startsWith('Your ')))
  const patti = allTravelOptions(HOME, PATTI, 'sunny', 'morning', VEHICLES.map((v) => vehicle(v.model)))
  check('Patti sheet offers okada+keke but no car rows', patti.filter((o) => o.personal).map((o) => o.transport).join(',') === 'own-okada,own-keke')
  const pub = full.find((o) => o.transport === 'keke')!
  const own = full.find((o) => o.transport === 'own-keke')!
  check('the sheet itself shows fuel beating fare', own.plan.cost < pub.plan.cost)
}

console.log('\nRESALE LAW — deterministic depreciation')
{
  const day = 10
  for (const v of VEHICLES) {
    const fresh = resaleValue(v.model, day, day)
    const aged = resaleValue(v.model, day, day + 30)
    const floor = resaleValue(v.model, day, day + 500)
    check(`${v.short}: day-one resale = 62% of showroom`, fresh === Math.round((v.price * 0.62) / 100) * 100, `got ${fresh}`)
    check(`${v.short}: value never rises with age`, aged <= fresh)
    check(`${v.short}: floor holds at 35%`, floor === Math.round((v.price * 0.35) / 100) * 100 && resaleValue(v.model, day, day + 900) === floor)
    check(`${v.short}: resale never negative or absurd`, floor > 0 && floor < v.price)
  }
}

console.log('\nREAL STORE — buy → fuel trip → ledger → sell (bun, live actions)')
{
  // The real store, imported the way the app runs it. localStorage is
  // guarded inside SaveSystem, so bun runs this honestly in memory.
  // Math.random is pinned HIGH so rollTravelEvent never fires — cash
  // assertions must see fuel, not a lucky roadside tip.
  const realRandom = Math.random
  Math.random = () => 0.999
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const state = () => useGameStore.getState()

  // fresh game at home (avatar = the catalog defaults)
  state().startNewGame('tester', 'female', {...DEFAULT_AVATAR })
  // M9-era neutralizer: this suite predates the casual shell — pre-complete
  // today's goals and the onboarding arc so its exact-cash assertions still
  // measure ONE action at a time (no goal rewards stacking in).
  {
    const st0 = useGameStore.getState()
    const d0 = st0.world!.day
    useGameStore.setState({
      goals: { day: d0, ids: ['gig-run', 'eat-well', 'waka'], progress: { 'gig-run': 99, 'eat-well': 99, waka: 99 }, done: [true, true, true], streak: 0, lastDoneDay: d0 },
      onboarding: { done: ['travel', 'work', 'meal', 'earn'], rewarded: true },
      account: { linked: true, handle: 'legacy_test', token: 'test-token', ageBand: 'adult', gateGraceDay: d0, displayName: null, avatarLook: null, bio: null },
    })
  }
  const p0 = state().player!
  check('fresh spawn: empty garage, ₦5,000', p0.vehicles.length === 0 && p0.cash === 5000)

  // fund the showroom visit honestly through the money system
  state().addMoney(300_000, { label: 'test funding', category: 'other' })

  // refusal: no ride in the garage yet
  const locBefore = state().world!.currentLocation
  state().travel(KPATA.id, 'own-okada')
  await sleep(TRAVEL.transitionMs + 80)
  check('unowned ride refused — never left home', state().world!.currentLocation === locBefore)

  // buy the okada through the ONE purchase authority
  const ok = state().buyVehicle('okada')
  const p1 = state().player!
  check('buyVehicle succeeds', ok)
  check('okada in the garage with a plate', p1.vehicles.length === 1 && p1.vehicles[0].model === 'okada' && p1.vehicles[0].plate.startsWith('LKO-'))
  check('purchase debited the showroom price', p1.cash === p0.cash + 300_000 - VEHICLE_BY_MODEL['okada'].price)
  const second = state().buyVehicle('okada')
  check('one per model — second buy refused', !second && state().player!.vehicles.length === 1)

  // the fuel trip: home → kpata on YOUR okada
  const cashBefore = state().player!.cash
  const plan = calculateTravel(HOME, KPATA, 'own-okada', state().world!.weather, state().world!.timeOfDay)
  state().travel(KPATA.id, 'own-okada')
  await sleep(TRAVEL.transitionMs + 80)
  const after = state()
  check('fuel trip arrives at kpata-market', after.world!.currentLocation === 'kpata-market')
  check('cash dropped by FUEL, not the keke fare', cashBefore - after.player!.cash === plan.cost, `delta ${cashBefore - after.player!.cash} vs fuel ${plan.cost}`)
  const fuelTx = after.player!.transactions.find((t) => t.label.startsWith('Fuel — Okada'))
  check('ledger records it as FUEL', !!fuelTx && fuelTx.amount === -plan.cost && fuelTx.category === 'transport')

  // a ride you own but with no road: buy the danfo (fund it first —
  // the showroom honestly refuses unaffordable purchases), aim it at Patti
  state().addMoney(900_000, { label: 'test funding 2', category: 'other' })
  check('danfo purchase succeeds after funding', state().buyVehicle('danfo'))
  const locBeforePatti = state().world!.currentLocation
  state().travel(PATTI.id, 'own-danfo')
  await sleep(TRAVEL.transitionMs + 80)
  check('danfo refused on the keke-class Patti road', state().world!.currentLocation === locBeforePatti)
  // …but the okada climbs it
  state().travel(PATTI.id, 'own-okada')
  await sleep(TRAVEL.transitionMs + 80)
  check('okada reaches mount-patti', state().world!.currentLocation === 'mount-patti')

  // sell the danfo back at its deterministic resale price
  const danfo = state().player!.vehicles.find((v) => v.model === 'danfo')!
  const cashBeforeSell = state().player!.cash
  const expectedResale = resaleValue('danfo', danfo.boughtDay, state().world!.day)
  const sold = state().sellVehicle(danfo.id)
  check('sellVehicle succeeds', sold)
  check('garage loses the danfo', !state().player!.vehicles.some((v) => v.model === 'danfo'))
  check('pocket gains the exact resale value', state().player!.cash === cashBeforeSell + expectedResale, `delta ${state().player!.cash - cashBeforeSell} vs ${expectedResale}`)
  const saleTx = state().player!.transactions.find((t) => t.label.startsWith('Sold Danfo'))
  check('ledger records the sale', !!saleTx && saleTx.amount === expectedResale)
  check('selling an id you no longer hold fails', !state().sellVehicle(danfo.id))
  Math.random = realRandom
}

console.log(`\n=== M4 GARAGE: ${passed} passed, ${failed} failed ===`)
if (failed > 0) process.exit(1)
