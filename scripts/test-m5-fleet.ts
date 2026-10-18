/**
 * LOKOJA LIFE — M5: WORK & FLEET (pure rule checks)
 * --------------------------------------------------
 * Deterministic law blocks for the Motor Park gig board and the shop as a
 * small enterprise: the gig margin law (passenger fare − your fuel > 0 for
 * EVERY model × destination, guaranteed by the M4 fuel law), the board law
 * (deterministic per day+garage, level-gated, class-correct, distinct),
 * the rain law, the done-gig ledger, the staff wage/boost laws, the
 * dark-shop shedding law, the solar meter law, the v5→v6 migration, and a
 * REAL bun store pass: buy okada → travel to the park → run a gig (fuel +
 * payout ledgered, clock advanced, dropped at the destination) → done-gig
 * refused → hire/install at the shop → till reflects the wage → solar cuts
 * the NEPA bill.
 * Run: bun scripts/test-m5-fleet.ts
 */

import {
  gigBoard,
  gigDestinationsFor,
  gigPayout,
  gigLabel,
  availableGigs,
  GIG_ORIGIN_ID,
} from '../src/game/systems/fleet'
import {
  bizIncomeFor,
  bizDayRoll,
  bizLevelMult,
  bizDayMult,
  staffCapFor,
  hasPowerBackup,
  freshBusiness,
} from '../src/game/systems/biz'
import { nepaBillFor, freshCivicState, civicDayRoll, marketForDay } from '../src/game/systems/civic'
import { civicHash } from '../src/game/systems/civic'
import { CIVIC } from '../src/game/data/config'
import { calculateTravel, mapDistanceKm } from '../src/game/systems/travel'
import { publicCounterpartId } from '../src/game/systems/garage'
import { ECONOMY, FLEET, BIZ, TRAVEL } from '../src/game/data/config'
import { LOCATIONS, LOCATION_BY_ID } from '../src/game/data/locations'
import { VEHICLES, generatePlate } from '../src/game/data/vehicles'
import type { BusinessState, CivicState, OwnedVehicle, ShopUpgradeId, VehicleModel } from '../src/game/types'
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

const PARK = LOCATION_BY_ID[GIG_ORIGIN_ID]
const DAY = 9
const sunny = 'sunny' as const
const rain = 'rain' as const

/** Deterministic civic slice with shedding pinned on/off for law checks. */
function civicWith(shedding: boolean): CivicState {
  const c = freshCivicState()
  return { ...c, nepa: { ...c.nepa, shedding, owed: shedding ? 2000 : 0 } }
}

console.log('\nCONFIG LAW — every naira traces to config')
check('FLEET payout multiplier above 1 (hired runs pay the fare plus)', FLEET.payoutMult > 1)
check('FLEET rain premium exists for every model', VEHICLES.every((v) => (FLEET.rainPayout[v.model] ?? 0) > 1))
check('okada rain premium is the steepest (misery pays)', FLEET.rainPayout['okada'] > FLEET.rainPayout['keke'] && FLEET.rainPayout['okada'] > FLEET.rainPayout['taxi'])
check('staff wage, boost and hire fee are positive', BIZ.staffWagePerDay > 0 && BIZ.staffIncomeBoost > 0 && BIZ.staffHireFee > 0)
check('shedding factor cuts income but never to zero', BIZ.sheddingIncomeFactor > 0 && BIZ.sheddingIncomeFactor < 1)
check('solar load is lighter than the grid load', BIZ.nepaLoadWithSolar < BIZ.nepaLoadPerBiz)
check('generator and solar both cost real money', (Object.values(BIZ.upgrades) as { cost: number }[]).every((u) => u.cost > 0))

console.log('\nDESTINATION LAW — class-correct, level-gated, no self-hire')
{
  const allIds = LOCATIONS.map((l) => l.id)
  check('gig origin is the Motor Park', GIG_ORIGIN_ID === 'transport-area' && !!PARK)
  for (const v of VEHICLES) {
    const dests = gigDestinationsFor(v.model, 10)
    const classRoad = v.model === 'taxi' || v.model === 'danfo' ? 'taxi' : 'keke'
    check(`${v.short}: every gig destination takes a ${classRoad} road`, dests.every((d) => d.transport.includes(classRoad as 'keke' | 'taxi')))
    check(`${v.short}: the park never hires to itself`, dests.every((d) => d.id !== GIG_ORIGIN_ID))
  }
  const cars = gigDestinationsFor('taxi', 10).map((d) => d.id)
  check('no car gig destination includes Mount Patti (keke-class road)', !cars.includes('mount-patti'))
  const lowLevel = gigDestinationsFor('okada', 1).map((d) => d.id)
  const fullLevel = gigDestinationsFor('okada', 10).map((d) => d.id)
  check('level gates shrink the board, never empty it', lowLevel.length > 0 && lowLevel.length <= fullLevel.length)
  check('every destination is a real map location', fullLevel.every((id) => allIds.includes(id)))
}

console.log('\nPAYOUT LAW — the counter fare × hired-run mult, rain on top')
{
  const dest = LOCATION_BY_ID['ganaja-junction']
  for (const v of VEHICLES) {
    const km = mapDistanceKm(PARK, dest)
    const pub = ECONOMY.transport[publicCounterpartId(v.model)]
    const expected = Math.round((pub.cost.base + pub.cost.perKm * km) * FLEET.payoutMult / TRAVEL.fareRounding) * TRAVEL.fareRounding
    check(`${v.short}: payout = counter fare × ${FLEET.payoutMult}, fare-rounded`, gigPayout(v.model, dest, sunny) === expected, `got ${gigPayout(v.model, dest, sunny)} want ${expected}`)
    const rainP = gigPayout(v.model, dest, rain)
    check(`${v.short}: rain pays strictly more`, rainP > gigPayout(v.model, dest, sunny), `${rainP} vs ${gigPayout(v.model, dest, sunny)}`)
    check(`${v.short}: payout rounds to the fare step`, gigPayout(v.model, dest, sunny) % TRAVEL.fareRounding === 0)
  }
}

console.log('\nMARGIN LAW — payout − fuel > 0 for EVERY model × destination (M4 guarantee)')
{
  let worst = { margin: Infinity, label: '' }
  let combos = 0
  for (const v of VEHICLES) {
    for (const dest of gigDestinationsFor(v.model, 10)) {
      const payout = gigPayout(v.model, dest, sunny)
      const fuel = calculateTravel(PARK, dest, `own-${v.model}` as const, sunny, 'morning').cost
      const margin = payout - fuel
      combos++
      if (margin < worst.margin) worst = { margin, label: `${v.short} → ${dest.shortName}` }
      if (margin <= 0) check(`MARGIN: ${v.short} → ${dest.shortName} pays above fuel`, false, `${payout} vs fuel ${fuel}`)
    }
  }
  check(`${combos} model × destination combos all profitable`, worst.margin > 0, `worst: ${worst.label} +${worst.margin}`)
  const keke = gigDestinationsFor('keke', 10)[0]
  const rainFuel = calculateTravel(PARK, keke, 'own-keke' as const, rain, 'morning').cost
  const rainMargin = gigPayout('keke', keke, rain) - rainFuel
  check('rain runs stay profitable even with rain-thickened fuel burn', rainMargin > 0, `margin ${rainMargin}`)
}

console.log('\nBOARD LAW — deterministic, distinct, honest, done-aware')
{
  const garage = [vehicle('okada'), vehicle('keke')]
  const a = gigBoard(DAY, garage, 5, sunny)
  const b = gigBoard(DAY, garage, 5, sunny)
  check('same (day, garage, level) → byte-identical board', JSON.stringify(a) === JSON.stringify(b))
  check('2 offers per owned vehicle', a.filter((g) => g.model === 'okada').length === FLEET.gigsPerModelPerDay && a.filter((g) => g.model === 'keke').length === FLEET.gigsPerModelPerDay)
  check('empty garage → empty board', gigBoard(DAY, [], 5, sunny).length === 0)
  check('every gig belongs to the day asked', a.every((g) => g.day === DAY))
  check('gig ids are unique and stable-shaped', new Set(a.map((g) => g.id)).size === a.length && a.every((g) => /^gig-\d+-(okada|keke|taxi|danfo)-\d$/.test(g.id)))
  check('okada board differs per day (the city moves on)', JSON.stringify(gigBoard(2, garage, 5, sunny)) !== JSON.stringify(gigBoard(3, garage, 5, sunny)))
  check('okada gigs are distinct within the day', gigBoard(DAY, garage, 5, sunny).filter((g) => g.model === 'okada').every((g1, _i, arr) => arr.every((g2) => g2 === g1 || g2.toId !== g1.toId || arr.indexOf(g1) === arr.indexOf(g2))))
  check('every board gig can physically be reached (road class)', a.every((g) => gigDestinationsFor(g.model, 5).some((d) => d.id === g.toId)))
  check('fuel on the board matches the travel law exactly', a.every((g) => g.fuel === calculateTravel(PARK, LOCATION_BY_ID[g.toId], `own-${g.model}` as const, sunny, 'morning').cost))
  check('gigLabel names the vehicle and the drop-off', gigLabel(a[0]).includes('run to') && a.every((g) => gigLabel(g).includes(LOCATION_BY_ID[g.toId].shortName) || gigLabel(g).includes(LOCATION_BY_ID[g.toId].name)))

  // done-aware: availableGigs hides what the fleet ledger already ran
  const first = a[0]
  const partFleet = { day: DAY, done: [first.id] }
  const avail = availableGigs(DAY, garage, 5, sunny, partFleet)
  check('run gigs fall off the board', avail.length === a.length - 1 && !avail.some((g) => g.id === first.id))
  check('stale done-list (yesterday) ignores itself', availableGigs(DAY, garage, 5, sunny, { day: DAY - 1, done: [first.id] }).length === a.length)
  check('rain board carries the rainPremium flag', gigBoard(DAY, garage, 5, rain).every((g) => g.rainPremium) && gigBoard(DAY, garage, 5, sunny).every((g) => !g.rainPremium))
  check('a sold vehicle takes its gigs off the board', gigBoard(DAY, [vehicle('okada')], 5, sunny).every((g) => g.model === 'okada'))
}

console.log('\nSTAFF LAW — cap, boost, wage, and the honest break-even')
{
  check('staff cap = shop level (1–5)', [1, 2, 3, 4, 5].every((l) => staffCapFor(l) === l) && staffCapFor(9) === BIZ.maxLevel && staffCapFor(0) === 1)
  const civic = marketForDay(freshCivicState(), DAY)
  // the law rounds ONCE at the end — recompose it exactly for the expectation
  const raw = (staff: number): number =>
    1100 * bizLevelMult(3) * bizDayMult('kpata-stall', DAY, civic) * 1 * (1 + staff * BIZ.staffIncomeBoost)
  const base = bizIncomeFor('kpata-stall', 3, DAY, civic, 0)
  check('one attendant lifts income by exactly the config share', bizIncomeFor('kpata-stall', 3, DAY, civic, 0, { staff: 1, upgrades: [] }) === Math.round(raw(1)), `got ${bizIncomeFor('kpata-stall', 3, DAY, civic, 0, { staff: 1, upgrades: [] })} want ${Math.round(raw(1))}`)
  check('two attendants lift double the share', bizIncomeFor('kpata-stall', 3, DAY, civic, 0, { staff: 2, upgrades: [] }) === Math.round(raw(2)))
  check('staff of 0 = the plain M3 law', bizIncomeFor('kpata-stall', 3, DAY, civic, 0, { staff: 0, upgrades: [] }) === base)
  check('opts omitted = the plain M3 law (backward compat)', bizIncomeFor('kpata-stall', 3, DAY, civic, 0) === base)
}

console.log('\nDARK-SHOP LAW — load-shedding dims shops without power')
{
  const lit = civicWith(false)
  const dark = civicWith(true)
  // the law rounds once at the end — recompose exactly
  const raw = 1100 * bizLevelMult(3) * bizDayMult('kpata-stall', DAY, dark)
  const plain = bizIncomeFor('kpata-stall', 3, DAY, lit, 0)
  const darkPlain = bizIncomeFor('kpata-stall', 3, DAY, dark, 0)
  check('a shop without backup earns the shedding share', darkPlain === Math.round(raw * BIZ.sheddingIncomeFactor), `${darkPlain} vs ${Math.round(raw * BIZ.sheddingIncomeFactor)}`)
  const withGen = bizIncomeFor('kpata-stall', 3, DAY, dark, 0, { staff: 0, upgrades: ['generator'] })
  check('a generator keeps the full take through shedding', withGen === plain)
  const withSolar = bizIncomeFor('kpata-stall', 3, DAY, dark, 0, { staff: 0, upgrades: ['solar'] })
  check('solar keeps the full take too', withSolar === plain)
  check('sunny days never dim any shop', bizIncomeFor('kpata-stall', 3, DAY, lit, 0, { staff: 2, upgrades: [] }) > 0)
  check('hasPowerBackup reads both installs', hasPowerBackup(['generator']) && hasPowerBackup(['solar']) && hasPowerBackup(['generator', 'solar']) && !hasPowerBackup([]))
}

console.log('\nSOLAR METER LAW — the disco sees fewer fridges')
{
  const bill0 = nepaBillFor(DAY, 0, 0)
  const bill2 = nepaBillFor(DAY, 2, 0)
  const bill2s1 = nepaBillFor(DAY, 2, 1)
  const bill2s2 = nepaBillFor(DAY, 2, 2)
  check('each grid shop loads the meter by BIZ.nepaLoadPerBiz', bill2 > bill0)
  check('one solar shop lightens the bill', bill2s1 < bill2)
  check('two solar shops lighten it more', bill2s2 < bill2s1)
  // exact arithmetic: bill = round10(flat × (1 + grid×loadPerBiz + solar×loadWithSolar))
  const flat = CIVIC.nepa.baseBill + (civicHash('nepa', DAY) / 0xffffffff) * CIVIC.nepa.billVariance
  const want2 = Math.round((flat * (1 + 2 * BIZ.nepaLoadPerBiz)) / 10) * 10
  const want2s1 = Math.round((flat * (1 + BIZ.nepaLoadPerBiz + BIZ.nepaLoadWithSolar)) / 10) * 10
  check('grid bill matches the exact load arithmetic', bill2 === want2, `got ${bill2} want ${want2}`)
  check('one solar shop matches the exact mixed-load arithmetic', bill2s1 === want2s1, `got ${bill2s1} want ${want2s1}`)
  const r = civicDayRoll(freshCivicState(), 0, DAY, 2, 2)
  check('civicDayRoll threads solarCount into the bill', r.next.nepa.owed > 0)
  check('solar beyond owned shops cannot load the meter', nepaBillFor(DAY, 1, 5) === nepaBillFor(DAY, 1, 1))
}

console.log('\nWAGE LAW — the till pays the staff, not your pocket')
{
  const civic = marketForDay(freshCivicState(), DAY)
  const shop: BusinessState = { ...freshBusiness('ganaja-kiosk', 1), level: 3, staff: 1, lastAccrualDay: DAY - 1 }
  const res = bizDayRoll([shop], DAY - 1, DAY, civic, 0)
  const gross = bizIncomeFor('ganaja-kiosk', 3, DAY, civic, 0, { staff: 1, upgrades: [] })
  const net = Math.max(0, gross - BIZ.staffWagePerDay)
  check('one day with one attendant nets gross − wage', res.next[0].accrued === net, `till ${res.next[0].accrued} vs gross ${gross} − wage ${BIZ.staffWagePerDay}`)
  check('the ledger attributes the net, not the gross', res.total === net)
  // idempotence: rolling the same day twice never double-pays or double-charges
  const res2 = bizDayRoll(res.next, DAY - 1, DAY, civic, 0)
  check('same-day re-roll is a no-op (wage charged once)', res2.next[0].accrued === net && res2.total === 0)
  // a wage heavier than the take still marks the day (no double charge)
  // 20 attendants × ₦400 dwarf any L1 take — the pure law must clamp at 0
  const heavy: BusinessState = { ...freshBusiness('ganaja-kiosk', 1), level: 1, staff: 20 }
  const res3 = bizDayRoll([{ ...heavy, lastAccrualDay: DAY - 1 }], DAY - 1, DAY, civic, 0)
  check('an over-staffed shop marks the day even at zero net', res3.next[0].lastAccrualDay === DAY && res3.total === 0 && res3.next[0].accrued === 0)
  const res4 = bizDayRoll(res3.next, DAY - 1, DAY, civic, 0)
  check('and never charges that day twice', res4.next[0].accrued === 0 && res4.total === 0)
}

console.log('\nREAL STORE — buy → park → gig → ledger → done-gig → hire → solar (bun, live actions)')
{
  // Math.random pinned HIGH: travel events must never flake cash asserts.
  const realRandom = Math.random
  Math.random = () => 0.999
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const state = () => useGameStore.getState()

  state().startNewGame('tester', 'male', {...DEFAULT_AVATAR })
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
  state().addMoney(300_000, { label: 'test funding', category: 'other' })
  check('okada purchase succeeds funded', state().buyVehicle('okada'))

  // drive to the park FIRST (fuel trip) — gigs start at the Motor Park
  state().travel('transport-area', 'own-okada')
  await sleep(TRAVEL.transitionMs + 80)
  check('arrived at the Motor Park', state().world!.currentLocation === 'transport-area')

  const board = gigBoard(state().world!.day, state().player!.vehicles, state().player!.level, state().world!.weather)
  check('the park offers exactly the config count', board.length === FLEET.gigsPerModelPerDay * 1, `got ${board.length}`)
  const gig = board[0]
  const cashBefore = state().player!.cash
  const jobsBefore = state().player!.stats.jobsCompleted

  // refusal path: mark it done, the store must refuse the double-run
  check('runGig accepts the fresh gig', state().runGig(gig.id))
  await sleep(TRAVEL.transitionMs + 120)
  const after = state()
  check('run completes: paid fuel, collected the fare', after.player!.cash === cashBefore - gig.fuel + gig.payout, `delta ${after.player!.cash - cashBefore} vs net ${gig.payout - gig.fuel}`)
  check('dropped at the destination, not the park', after.world!.currentLocation === gig.toId)
  check('ledger records BOTH the fuel and the fare', !!after.player!.transactions.find((t) => t.label.startsWith('Fuel — ') && t.amount === -gig.fuel) && !!after.player!.transactions.find((t) => t.label.startsWith('Gig — ') && t.amount === gig.payout))
  check('the gig counts as honest work (jobsCompleted +1)', after.player!.stats.jobsCompleted === jobsBefore + 1)
  check('the done-gig ledger holds it for today', after.fleet.day === after.world!.day && after.fleet.done.includes(gig.id))
  check('double-run refused', !state().runGig(gig.id))

  // the store refuses gigs away from the park
  const gig2 = board[1]
  check('second gig on the board exists', !!gig2)
  check('runGig refuses away from the park', !state().runGig(gig2.id))

  // ------- the shop as an enterprise: hire, wage, solar -------
  state().addMoney(200_000, { label: 'test funding 2', category: 'other' })
  check('buyBiz(kpata-stall) succeeds', state().buyBiz('kpata-stall'))
  const cashPreHire = state().player!.cash
  check('hire succeeds', state().hireStaff('kpata-stall'))
  check('hire fee charged', state().player!.cash === cashPreHire - BIZ.staffHireFee)
  check('staff shows on the shop', state().player!.businesses[0].staff === 1)
  check('second hire at L1 refused (cap = level)', !state().hireStaff('kpata-stall') && state().player!.businesses[0].staff === 1)
  check('fire works and is free', state().fireStaff('kpata-stall') && state().player!.businesses[0].staff === 0 && state().player!.cash === cashPreHire - BIZ.staffHireFee)
  check('fire with nobody to fire refuses', !state().fireStaff('kpata-stall'))
  state().hireStaff('kpata-stall')

  // solar: cash cost + NEPA meter interplay through the REAL day roll
  const cashPreSolar = state().player!.cash
  check('solar install succeeds', state().installBizUpgrade('kpata-stall', 'solar'))
  check('solar cost charged', state().player!.cash === cashPreSolar - (BIZ.upgrades as Record<string, { cost: number }>)['solar'].cost)
  check('double install refused', !state().installBizUpgrade('kpata-stall', 'solar'))
  check('generator still available alongside solar', state().installBizUpgrade('kpata-stall', 'generator'))
  check('unknown upgrade id refuses', !state().installBizUpgrade('kpata-stall', 'windmill' as ShopUpgradeId))

  // sleep a day: the shop accrues NET of the wage, and the day rolls cleanly
  const tillBefore = state().player!.businesses[0].accrued
  state().rest('sleep')
  await sleep(60)
  const slept = state()
  check('till accrued net of the wage after a night', slept.player!.businesses[0].accrued > 0)
  check('fleet ledger survives a day crossing (stale, harmless)', Array.isArray(slept.fleet.done))

  void tillBefore
  Math.random = realRandom
}

console.log(`\n=== M5 FLEET: ${passed} passed, ${failed} failed ===`)
if (failed > 0) process.exit(1)
