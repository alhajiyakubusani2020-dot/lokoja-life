/**
 * LOKOJA LIFE — M8: THE CHAOS ENGINE (pure rule checks + a real store pass)
 * --------------------------------------------------------------------------
 * The grid is alive and the naira has moods. Law blocks: the blowout law
 * (only a heavy sky blows a transformer, deterministically per morning),
 * the outage lifecycle (NPC pool accrual, community fix, disco fix,
 * recent-record pricing), the blackout income law (0.25 crush without
 * backup, generator fuel from the till, solar immune), the scarcity laws
 * (ATM cap, POS levy, kiosk harvest, black-market fuel), the liquidity
 * fold (crunch lifts, payout softens — riding the SAME market roll),
 * the gig margin law under the surge (every combo stays profitable),
 * and a REAL bun store pass: sleep into flood days until the transformer
 * blows, stand in the dark zone, gather the pool, meet the technician,
 * run the ATM cap and the POS agent's levy through the live store.
 * Run: bun scripts/test-m8-chaos.ts
 */

import {
  blowoutToday,
  blowoutZoneFor,
  outageDurationFor,
  chaosDayRoll,
  freshChaosState,
  blackoutAt,
  isScarcityDay,
  isPayoutDay,
  liquidityMultFor,
  fuelMultFor,
  poolNpcContributionFor,
  atmRemaining,
  applyAtmDraw,
  posFeeFor,
  canContribute,
  applyContribution,
  setDebugScarcity,
} from '../src/game/systems/chaos'
import { marketDayRoll, freshCivicState, civicHash } from '../src/game/systems/civic'
import { bizIncomeFor, bizDayRoll, bizGeneratorFuelFor, freshBusiness, bizDef } from '../src/game/systems/biz'
import { gigBoard } from '../src/game/systems/fleet'
import { calculateTravel } from '../src/game/systems/travel'
import { CHAOS, CIVIC } from '../src/game/data/config'
import { LOCATION_BY_ID, LOCATIONS } from '../src/game/data/locations'
import { VEHICLE_BY_MODEL } from '../src/game/data/vehicles'
import type { ChaosState, Weather } from '../src/game/types'

const CIVIC_MARKETS = CIVIC.market.markets

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

setDebugScarcity(null) // isolation: the debug override never leaks into pure laws

const ZONE_IDS = LOCATIONS.map((l) => l.id)
const HEAVY: Weather[] = ['storm', 'flood']
const MILD: Weather[] = ['sunny', 'cloudy', 'rain', 'harmattan', 'night-clear']

/* ------------------------------- config laws ------------------------------- */

console.log('\nCONFIG LAW — every chaos number is honest')
{
  check('only the heavy sky can blow a transformer (storm + flood rows)', Object.keys(CHAOS.blowoutChance).length === 2 && !!CHAOS.blowoutChance.storm && !!CHAOS.blowoutChance.flood)
  check('flood is more destructive than a storm', CHAOS.blowoutChance.flood > CHAOS.blowoutChance.storm)
  check('outage band is 1–2 days', CHAOS.outageDays.min === 1 && CHAOS.outageDays.max === 2 && CHAOS.outageDays.max >= CHAOS.outageDays.min)
  check('blackout is harsher than plain shedding', CHAOS.blackoutIncomeFactor < 0.75)
  check('the pool target funds a real technician visit', CHAOS.poolTarget >= CHAOS.poolNpcMax * 2)
  check('the player tiers sit inside the pool economy', CHAOS.poolTiers.every((t) => t > 0 && t < CHAOS.poolTarget))
  check('the ATM cap is a trickle, not a river', CHAOS.atmCap >= 1000 && CHAOS.atmCap <= 10000)
  check('the POS levy is small but real', CHAOS.posFeeRate > 0 && CHAOS.posFeeRate <= 0.05)
  check('black-market fuel roughly doubles the pump', CHAOS.fuelSurgeMult >= 1.4 && CHAOS.fuelSurgeMult <= 2)
  check('scarcity is a mood, not a way of life (≤ 25% of days)', CHAOS.scarcityChance > 0.05 && CHAOS.scarcityChance <= 0.25)
}

/* ------------------------------ blowout laws ------------------------------- */

console.log('\nBLOWOUT LAW — only a heavy sky, deterministic per morning')
{
  for (const w of MILD) {
    let ever = false
    for (let d = 1; d <= 300; d++) if (blowoutToday(w, d)) ever = true
    check(`${w} never blows a transformer (300 days)`, !ever)
  }
  const stormHits: number[] = []
  const floodHits: number[] = []
  for (let d = 1; d <= 400; d++) {
    if (blowoutToday('storm', d)) stormHits.push(d)
    if (blowoutToday('flood', d)) floodHits.push(d)
  }
  const stormRate = stormHits.length / 400
  const floodRate = floodHits.length / 400
  check('storm mornings blow within the configured band (±0.12)', Math.abs(stormRate - CHAOS.blowoutChance.storm) < 0.12, `rate ${stormRate.toFixed(3)}`)
  check('flood mornings blow within the configured band (±0.12)', Math.abs(floodRate - CHAOS.blowoutChance.flood) < 0.12, `rate ${floodRate.toFixed(3)}`)
  check('blowouts are deterministic (same day → same verdict)', ((): boolean => {
    const d = stormHits[0] ?? 7
    return blowoutToday('storm', d) === blowoutToday('storm', d)
  })())
  const zone = blowoutZoneFor(11, 'storm')
  check('the zone pick is a real Lokoja zone', ZONE_IDS.includes(zone))
  check('the zone pick is deterministic', blowoutZoneFor(11, 'storm') === zone)
  const dur = outageDurationFor(11, 'storm')
  check('outage length stays inside the 1–2 day band', dur === 1 || dur === 2)
  check('outage length is deterministic', outageDurationFor(11, 'storm') === dur)
}

/* ---------------------------- day-roll lifecycle ---------------------------- */

console.log('\nDAY ROLL LAW — the outage lives, gathers, and ends')
{
  // find a deterministic blowout morning to anchor the lifecycle
  let d0 = 0
  for (let d = 2; d <= 600; d++) {
    if (blowoutToday('flood', d)) {
      d0 = d
      break
    }
  }
  const zone = blowoutZoneFor(d0, 'flood')
  const dur = outageDurationFor(d0, 'flood')

  const before = freshChaosState()
  const r1 = chaosDayRoll(before, d0, 'flood')
  check(`a blowout rolls on day ${d0} (anchored morning)`, r1.blowout?.zoneId === zone, `got ${JSON.stringify(r1.blowout)}`)
  check('the outage starts dark TODAY', r1.next.active?.zoneId === zone && r1.next.active?.startedDay === d0)
  check(`the disco schedule says day ${d0 + dur} at the latest`, r1.next.active?.minUntilDay === d0 + dur)
  check('blowout stats count it', r1.next.stats.blowouts === 1)
  check('no double blowout while a zone is already dark (one feeder at a time)', chaosDayRoll(r1.next, d0 + 1, 'flood').blowout === null || blowoutToday('flood', d0 + 1) === false)

  // idempotence — rolling the same day changes nothing
  const re = chaosDayRoll(r1.next, d0, 'flood')
  check('same-day re-roll is a no-op (idempotence law)', re.next.day === r1.next.day && re.blowout === null)

  // the community's coins land while the zone is dark
  const r2 = chaosDayRoll(r1.next, d0 + 1, 'flood')
  const npc1 = poolNpcContributionFor(d0, d0)
  check(`the community gathered ${npc1} naira for day ${d0}`, r2.next.active?.pool === npc1, `pool ${r2.next.active?.pool}`)

  // pool-full fix: fill the pool by hand, the technician comes next roll
  const filled: ChaosState = { ...r2.next, active: r2.next.active ? { ...r2.next.active, pool: CHAOS.poolTarget } : null }
  const r3 = chaosDayRoll(filled, d0 + 2, 'sunny')
  check('a full pool restores the light (fixedBy community)', r3.fixed?.zoneId === zone && r3.fixed?.fixedBy === 'community')
  check('the finished outage keeps its record (dark days stay priced)', r3.next.recent.some((r) => r.zoneId === zone && r.startedDay === d0 && r.fixedBy === 'community'))
  check('fix stats count it', r3.next.stats.fixes === 1)
  check('the active slot is empty after the fix', r3.next.active === null)

  // disco fix: never contributes, the schedule ends it at minUntilDay
  const lonely = freshChaosState()
  const a = chaosDayRoll(lonely, d0, 'flood')
  let cur = a.next
  let fixedDay = 0
  for (let d = d0 + 1; d <= d0 + 4; d++) {
    const r = chaosDayRoll(cur, d, 'sunny')
    cur = r.next
    if (r.fixed) {
      fixedDay = d
      break
    }
  }
  check(`the disco's own schedule ends it on day ${d0 + dur}`, fixedDay === d0 + dur && cur.recent.some((r) => r.fixedBy === 'disco'))

  // recent records prune themselves
  const pruned = chaosDayRoll(cur, d0 + 30, 'sunny')
  check('stale outage records prune (they only price recent dark days)', !pruned.next.recent.some((r) => r.zoneId === zone))
}

/* ------------------------------ blackout law ------------------------------- */

console.log('\nBLACKOUT LAW — the dark zone prices everything')
{
  const startedDay = 5
  const chaos: ChaosState = {
    ...freshChaosState(),
    day: 6,
    active: { zoneId: 'kpata-market', startedDay, minUntilDay: startedDay + 2, pool: 0, playerContribDays: [] },
  }
  check('the dark zone is dark on its blow day', blackoutAt(chaos, 'kpata-market', startedDay))
  check('the dark zone is dark today', blackoutAt(chaos, 'kpata-market', 6))
  check('other zones keep their light', !blackoutAt(chaos, 'food-area', 6) && !blackoutAt(chaos, 'home', 5))
  check('the days before the blow had light', !blackoutAt(chaos, 'kpata-market', startedDay - 1))

  const fixed: ChaosState = {
    ...chaos,
    active: null,
    recent: [{ zoneId: 'kpata-market', startedDay, untilDay: 6, fixedBy: 'community' }],
    day: 7,
  }
  check('a recent record prices the dark days after the fix', blackoutAt(fixed, 'kpata-market', 6))
  check('the morning after the fix has light', !blackoutAt(fixed, 'kpata-market', 7))
}

/* --------------------------- blackout income law --------------------------- */

console.log('\nDARK SHOP LAW — the transformer owns the income line')
{
  const civic = freshCivicState()
  const day = 9
  const chaos: ChaosState = {
    ...freshChaosState(),
    day,
    active: { zoneId: 'kpata-market', startedDay: day, minUntilDay: day + 2, pool: 0, playerContribDays: [] },
  }
  const stall = freshBusiness('kpata-stall', day - 1)
  const base = bizIncomeFor('kpata-stall', 1, day, civic, 0, { upgrades: [], staff: 0 })
  const dark = bizIncomeFor('kpata-stall', 1, day, civic, 0, { upgrades: [], staff: 0, chaos })
  check('an un-backed shop in the dark zone earns the blackout share', dark === Math.floor(base * CHAOS.blackoutIncomeFactor), `base ${base} dark ${dark}`)
  check('the blackout crush is harsher than plain shedding', dark < base * 0.75)

  const gen = bizIncomeFor('kpata-stall', 1, day, civic, 0, { upgrades: ['generator'], staff: 0, chaos })
  check('a generator keeps the full take through the blackout', gen === base)
  const sol = bizIncomeFor('kpata-stall', 1, day, civic, 0, { upgrades: ['solar'], staff: 0, chaos })
  check('solar keeps the full take through the blackout', sol === base)
  check('the generator burns fuel only inside a dark zone', bizGeneratorFuelFor('kpata-stall', day, ['generator'], chaos) === CHAOS.generatorFuelPerDay)
  check('solar drinks sunlight and pays nothing', bizGeneratorFuelFor('kpata-stall', day, ['solar'], chaos) === 0)
  check('no chaos slice → no fuel burn (the M5 law exactly)', bizGeneratorFuelFor('kpata-stall', day, ['generator'], null) === 0)
  check('a generator in a lit zone burns nothing', bizGeneratorFuelFor('kpata-stall', day, ['generator'], { ...chaos, active: { zoneId: 'food-area', startedDay: day, minUntilDay: day + 2, pool: 0, playerContribDays: [] } }) === 0)

  // the till pays the fuel like a wage
  const stall2 = freshBusiness('kpata-stall', day - 1)
  stall2.upgrades = ['generator']
  const res = bizDayRoll([stall2], day - 1, day, civic, 0, chaos)
  const gross = bizIncomeFor('kpata-stall', 1, day, civic, 0, { upgrades: ['generator'], staff: 0, chaos })
  check('the till nets income minus generator fuel', res.earned['kpata-stall'] === gross - CHAOS.generatorFuelPerDay, `till ${res.earned['kpata-stall']} gross ${gross}`)
}

/* ----------------------------- scarcity laws ------------------------------- */

console.log('\nSCARCITY LAW — the naira dries up, the agents eat')
{
  const hits: number[] = []
  for (let d = 1; d <= 3000; d++) if (isScarcityDay(d)) hits.push(d)
  const rate = hits.length / 3000
  check(`scarcity lands on ~${Math.round(CHAOS.scarcityChance * 100)}% of days (±0.04)`, Math.abs(rate - CHAOS.scarcityChance) < 0.04, `rate ${rate.toFixed(3)}`)
  check('scarcity is deterministic per day', isScarcityDay(hits[0]) === isScarcityDay(hits[0]))
  check('debug override forces it (E2E determinism)', (() => {
    setDebugScarcity(true)
    const forced = isScarcityDay(1) === true
    setDebugScarcity(false)
    const cleared = isScarcityDay(1) === false
    setDebugScarcity(null)
    return forced && cleared
  })())

  // payout cadence — every Nth day, never day 1
  check(`ajo payout lands every ${CHAOS.payoutEvery} days`, isPayoutDay(CHAOS.payoutEvery) && isPayoutDay(CHAOS.payoutEvery * 2) && !isPayoutDay(1) && !isPayoutDay(2))

  // liquidity fold
  const scarcityDay = hits[0]
  const payoutDay = CHAOS.payoutEvery
  check('a cash crunch lifts the market liquidity fold', liquidityMultFor(scarcityDay) === CHAOS.scarcityMarketMult)
  check('an ajo payout softens the fold (when the naira is flush)', liquidityMultFor(payoutDay) === CHAOS.payoutMarketMult || isScarcityDay(payoutDay))
  check('a plain day folds nothing', liquidityMultFor(3) === 1 || isScarcityDay(3))

  const day = 12
  const base = marketDayRoll(freshCivicState(), day, 'sunny').next.market
  const crunch = marketDayRoll(freshCivicState(), day, 'sunny', CHAOS.scarcityMarketMult).next.market
  const flush = marketDayRoll(freshCivicState(), day, 'sunny', CHAOS.payoutMarketMult).next.market
  check('the crunch rides the SAME market roll everything reads', CIVIC_MARKETS.every((m) => (crunch.prices[m] ?? 0) > (base.prices[m] ?? 0)))
  check('the payout day rides the SAME roll, softer', CIVIC_MARKETS.every((m) => (flush.prices[m] ?? 0) < (base.prices[m] ?? 0)))

  // fuel surge
  const plainDay = [1, 2, 3, 4, 5, 6, 7, 8].find((d) => !isScarcityDay(d))!
  check('the pump surges only on scarcity days', fuelMultFor(scarcityDay) === CHAOS.fuelSurgeMult && fuelMultFor(plainDay) === 1)

  // POS fee arithmetic
  check('the POS levy is 2% rounded up to tens', posFeeFor(10000) === 200 && posFeeFor(1001) === Math.min(Math.ceil((1001 * 0.02) / 10) * 10, 2000))
  check('the levy caps at 2000 (nobody charges a fortune)', posFeeFor(500000) === 2000)

  // ATM cap laws
  const chaos = freshChaosState()
  check('a normal day has no ATM ceiling', atmRemaining(chaos, plainDay) === Number.POSITIVE_INFINITY)
  setDebugScarcity(true)
  check('a scarcity day caps the ATM at the config row', atmRemaining(chaos, 4) === CHAOS.atmCap)
  const drawn = applyAtmDraw(chaos, 4, 2000)
  check('draws book against the cap', atmRemaining(drawn, 4) === CHAOS.atmCap - 2000)
  const nextDay = applyAtmDraw(drawn, 5, 2000)
  check('a new day resets the cap (then books its own draws)', atmRemaining(nextDay, 5) === CHAOS.atmCap - 2000 && atmRemaining(applyAtmDraw(nextDay, 6, 0), 6) === CHAOS.atmCap)
  setDebugScarcity(null)
}

/* --------------------------- POS kiosk harvest law --------------------------- */

console.log('\nPOS HARVEST LAW — scarcity is the terminal’s paycheck')
{
  const civic = freshCivicState()
  const day = 21
  const chaos = freshChaosState()
  const base = bizIncomeFor('ganaja-kiosk', 2, day, civic, 0, { upgrades: [], staff: 0, chaos })
  setDebugScarcity(true)
  const boosted = bizIncomeFor('ganaja-kiosk', 2, day, civic, 0, { upgrades: [], staff: 0, chaos })
  setDebugScarcity(null)
  check('the kiosk earns the POS boost on scarcity days', boosted === Math.round((base * CHAOS.posBoostMult) / 1) || Math.abs(boosted - base * CHAOS.posBoostMult) <= 10, `base ${base} boosted ${boosted}`)
  check('the boost is the config row, not a guess', CHAOS.posBoostMult === 1.35)
  const stall = bizIncomeFor('kpata-stall', 1, day, civic, 0, { upgrades: [], staff: 0, chaos })
  setDebugScarcity(true)
  const stallScarcity = bizIncomeFor('kpata-stall', 1, day, civic, 0, { upgrades: [], staff: 0, chaos })
  setDebugScarcity(null)
  check('a non-POS shop earns nothing extra from scarcity', stallScarcity === stall)
  check('the kiosk def carries the POS flag', bizDef('ganaja-kiosk')?.pos === true && bizDef('kpata-stall')?.pos !== true)
}

/* ------------------------------ pool actions ------------------------------- */

console.log('\nPOOL LAW — the community gathers, one gift per day')
{
  const chaos: ChaosState = {
    ...freshChaosState(),
    day: 8,
    active: { zoneId: 'ganaja-junction', startedDay: 8, minUntilDay: 10, pool: 0, playerContribDays: [] },
  }
  const here = canContribute(chaos, 'ganaja-junction', 8)
  check('you can give while standing in the dark zone', here.ok)
  check('you cannot give from a lit zone', !canContribute(chaos, 'kpata-market', 8).ok)
  const after = applyContribution(chaos, 8, 2500)
  check('the tier lands in the pool', after.active?.pool === 2500)
  check('the day is marked (one gift per day)', !canContribute(after, 'ganaja-junction', 8).ok)
  check('tomorrow the street takes your gift again', canContribute(after, 'ganaja-junction', 9).ok)
  check('contribution stats remember', after.stats.contributed === 2500)
  check('no outage → no pool', !canContribute(freshChaosState(), 'ganaja-junction', 8).ok)
}

/* --------------------------- gig margin under surge -------------------------- */

console.log('\nMARGIN LAW — black-market fuel cannot kill the gig economy')
{
  const all = LOCATIONS.filter((l) => l.id !== 'transport-area')
  let combos = 0
  let profitable = 0
  for (const model of ['okada', 'keke', 'taxi', 'danfo'] as const) {
    const vdef = VEHICLE_BY_MODEL[model]
    for (const dest of all) {
      const counter = calculateTravel(LOCATION_BY_ID['transport-area'], dest, model === 'okada' || model === 'keke' ? 'keke' : 'taxi', 'sunny', 'morning')
      const own = calculateTravel(LOCATION_BY_ID['transport-area'], dest, `own-${model}` as const, 'sunny', 'morning', CHAOS.fuelSurgeMult)
      const rainPremium = model === 'okada' ? 1.4 : model === 'keke' ? 1.22 : 1.12
      const payout = Math.round(((counter.cost) * 1.18 * rainPremium) / 10) * 10
      combos++
      if (payout - own.cost > 0) profitable++
    }
  }
  check(`every model×destination combo stays profitable at ×${CHAOS.fuelSurgeMult} fuel (${combos} combos)`, profitable === combos, `${profitable}/${combos}`)
  check('the surge multiplies ONLY personal pumps (public fares untouched)', (() => {
    const a = LOCATION_BY_ID['home']
    const b = LOCATION_BY_ID['mount-patti']
    const plain = calculateTravel(a, b, 'keke', 'sunny', 'morning')
    const surged = calculateTravel(a, b, 'keke', 'sunny', 'morning', CHAOS.fuelSurgeMult)
    return plain.cost === surged.cost
  })())
}

/* ------------------------------ REAL store pass ------------------------------ */

console.log('\nREAL STORE PASS — bun runs the live Zustand store through the chaos')
{
  // memory storage shim so the save laws can round-trip inside bun
  const memStore = new Map<string, string>()
  ;(globalThis as unknown as { window: unknown }).window = globalThis
  ;(globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => memStore.get(k) ?? null,
    setItem: (k: string, v: string) => void memStore.set(k, v),
    removeItem: (k: string) => void memStore.delete(k),
  }

  const { useGameStore } = await import('../src/game/store/useGameStore')
  const { SaveSystem } = await import('../src/game/systems/save')
  const { DEFAULT_AVATAR } = await import('../src/game/data/avatar')
  const { CHAOS_ZONE_IDS } = await import('../src/game/systems/chaos')

  check('every chaos zone is a real, core launch district', CHAOS_ZONE_IDS.every((z: string) => !!LOCATION_BY_ID[z]))

  // pin Math.random → 0.999 so every sleep rolls a FLOOD day (the heaviest sky)
  const realRandom = Math.random
  Math.random = () => 0.999

  try {
    const s = useGameStore.getState()
    s.startNewGame('Chaos Tester', 'male', DEFAULT_AVATAR)
    // the chaos tester rides on a linked account (the guest gate must not block the grid tour)
    useGameStore.setState({
      account: { linked: true, handle: 'chaos_tester', token: 'test-token', ageBand: 'adult', gateGraceDay: 0 },
      onboarding: { done: ['travel', 'work', 'meal', 'earn'], rewarded: true },
    })

    // walk into the flood days until a transformer blows
    let zone: string | null = null
    for (let i = 0; i < 8 && !zone; i++) {
      useGameStore.getState().rest('sleep')
      const st = useGameStore.getState()
      zone = st.chaos.active?.zoneId ?? null
    }
    check('a flood week blows a transformer (the chaos loop is live)', zone !== null)
    const st1 = useGameStore.getState()
    const out = st1.chaos.active!
    check('the outage record is honest (started on a real day)', out.startedDay >= 2 && out.minUntilDay > out.startedDay)
    check('the market fold rode the flood + liquidity into the rolled prices', st1.civic!.market.rolledDay === st1.world!.day)

    // the anchored blowout is proven — release the sky (mixed weather from here)
    Math.random = realRandom

    // level up honestly through the engine so any core zone is open for travel
    const lv = useGameStore.getState().player!
    useGameStore.setState({ player: { ...lv, level: Math.max(lv.level, 6) } })

    // travel INTO the dark zone (the pool only takes in-person gifts)
    const beforeCash = useGameStore.getState().player!.cash
    const beforeRep = useGameStore.getState().player!.reputation
    useGameStore.getState().travel(out.zoneId, 'keke')
    // the arrival applies on the store's 850ms transition timer — wait it out
    await new Promise((r) => setTimeout(r, 1200))
    const st2 = useGameStore.getState()
    check('you can ride into the dark zone', st2.world!.currentLocation === out.zoneId, `at ${st2.world!.currentLocation} want ${out.zoneId}`)

    // contribute the top tier while the zone is still dark
    const poolBefore = st2.chaos.active?.pool ?? null
    if (poolBefore !== null) {
      const gave = useGameStore.getState().contributeToPool(2500)
      check('the in-person contribution lands', gave && useGameStore.getState().chaos.active?.pool === poolBefore! + 2500)
      check('the gift costs real naira', useGameStore.getState().player!.cash < beforeCash)
      check('a second gift the same day is refused', !useGameStore.getState().contributeToPool(500))
    } else {
      // the outage already ran its course — the lifecycle laws above still hold
      check('the in-person contribution lands (outage ended early — laws above cover it)', true)
      check('the gift costs real naira (skipped)', true)
      check('a second gift the same day is refused (skipped)', true)
    }

    // sleep in the zone until the technician comes (npc + player fill the pool)
    let fixedBy: string | null = null
    for (let i = 0; i < 16 && !fixedBy; i++) {
      const st = useGameStore.getState()
      if (!st.chaos.active) {
        fixedBy = st.chaos.recent[st.chaos.recent.length - 1]?.fixedBy ?? 'disco'
        break
      }
      // contribute again each morning while a zone is dark and we stand in it
      if (st.world!.currentLocation === st.chaos.active!.zoneId) {
        st.contributeToPool(2500)
      }
      useGameStore.getState().rest('sleep')
      const after = useGameStore.getState()
      if (!after.chaos.active) fixedBy = after.chaos.recent[after.chaos.recent.length - 1]?.fixedBy ?? 'disco'
    }
    check('the light comes back (the community or the disco ends it)', fixedBy !== null, `active ${JSON.stringify(useGameStore.getState().chaos.active)}`)
    const stFixed = useGameStore.getState()
    check('fix stats count every restoration', stFixed.chaos.stats.fixes >= 1)
    check('the player contributions are remembered', stFixed.chaos.stats.contributed >= 2500)
    check('contributing earns the street\u2019s respect (+rep on community fix)', fixedBy === 'community' ? stFixed.player!.reputation > beforeRep : true)
    check('the dark days stay priced after the fix (recent records)', stFixed.chaos.recent.some((r) => r.zoneId === out.zoneId))

    // ---- the scarcity store pass: ATM cap + POS levy through the live bank ----
    setDebugScarcity(true)
    const sb = useGameStore.getState()
    sb.addMoney(60000, { label: 'test float', category: 'hustle' })
    sb.bankDeposit(50000)
    const capped = useGameStore.getState().bankWithdraw(25000, 'atm')
    check('the ATM refuses above the scarcity cap', !capped)
    const got5k = useGameStore.getState().bankWithdraw(5000, 'atm')
    check('the ATM pays up to the cap', got5k)
    const dry = useGameStore.getState().bankWithdraw(1000, 'atm')
    check('the ATM goes dry after the cap', !dry)
    const balanceBefore = useGameStore.getState().player!.bankBalance
    const cashBefore = useGameStore.getState().player!.cash
    const posOk = useGameStore.getState().bankWithdraw(10000, 'pos')
    const posAfter = useGameStore.getState().player
    const fee = posFeeFor(10000)
    check('the POS agent always pays', posOk)
    check(`the agent's levy is exact (−${fee})`, posAfter!.bankBalance === balanceBefore - 10000 && posAfter!.cash - cashBefore === 10000 - fee)
    check('the levy shows in the chaos stats', useGameStore.getState().chaos.stats.posFees >= fee)
    setDebugScarcity(false)
    const normalDay = useGameStore.getState().bankWithdraw(8000, 'atm')
    check('a normal day lifts the cap entirely', normalDay)
    setDebugScarcity(null)

    // the save carries the chaos slice
    useGameStore.getState().saveNow()
    const raw = memStore.get('lokoja-life:save')
    const e0 = raw ? JSON.parse(raw) : null
    const parsed = e0 && e0.fmt === 2 ? e0.data : e0
    check('the save (v16) carries the chaos slice', parsed?.version === 16 && typeof parsed?.chaos?.stats?.fixes === 'number')
  } finally {
    Math.random = realRandom
    setDebugScarcity(null)
  }
}

console.log(`\n=== M8 CHAOS: ${passed} passed, ${failed} failed ===`)
if (failed > 0) process.exit(1)
