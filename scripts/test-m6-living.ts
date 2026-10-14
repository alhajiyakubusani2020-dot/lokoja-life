/**
 * LOKOJA LIFE — M6: LIVING WORLD (pure rule checks + a real store pass)
 * ----------------------------------------------------------------------
 * The sky beyond rain, the night market, and the social track growing
 * teeth. Law blocks: the config exhaustiveness law (every weather row
 * complete), the market-stress fold (dust/storm/flood ride the SAME
 * prices everything reads), the flood law (the riverfront closes —
 * travel refuses, the gig board never strands a passenger there), the
 * rough-sky payout law (storm/flood widen the M4 margin, never flip it),
 * the night-market laws (open after dark only, seeded discount, night
 * dishes nowhere else), the social laws (gifts/hangout/favours), and a
 * REAL bun store pass: sleep into a flood day (mood + note + stressed
 * prices) → confluence travel refused → night meal refused by day and
 * served at night → gift math → hangout cooldown → a paddy's favour
 * accepted through the chat pipeline.
 * Run: bun scripts/test-m6-living.ts
 */

import {
  weatherMarketMult,
  weatherBlocksLocation,
  weatherMinutesMult,
  isRainSky,
  isHeavySky,
  isNightMarketOpen,
  nightMarketMultFor,
  nightMealPrice,
  mealAvailableAt,
  NIGHT_MARKET_LOCATION_ID,
} from '../src/game/systems/seasons'
import { marketDayRoll, marketMealPrice, freshCivicState, marketForDay, civicHash } from '../src/game/systems/civic'
import { gigDestinationsFor, gigPayout } from '../src/game/systems/fleet'
import { calculateTravel } from '../src/game/systems/travel'
import { canGift, canHangout, afterGift, afterHangout, favorRollsToday, giftById } from '../src/game/systems/social'
import { TIME, WEATHER_META, CIVIC, SOCIAL, FOOD, MEAL_BY_KEY, TRAVEL } from '../src/game/data/config'
import { LOCATIONS, LOCATION_BY_ID } from '../src/game/data/locations'
import { VEHICLES } from '../src/game/data/vehicles'
import type { Weather, TimeOfDay, TransportId, RelationshipState } from '../src/game/types'
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

const WEATHERS: Weather[] = ['sunny', 'cloudy', 'rain', 'night-clear', 'harmattan', 'storm', 'flood']
const TRANSPORTS: TransportId[] = ['walk', 'keke', 'taxi', 'own-okada', 'own-keke', 'own-taxi', 'own-danfo']
const SLOTS: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night']

/* ------------------------------- config laws ------------------------------- */

console.log('\nCONFIG LAW — the living sky is complete and honest')
{
  const weights = TIME.weatherWeights as Record<string, number>
  const total = Object.values(weights).reduce((s, w) => s + w, 0)
  const DAY_SKIES: Weather[] = ['sunny', 'cloudy', 'rain', 'harmattan', 'storm', 'flood']
  check('weatherWeights covers every DAY sky (night-clear is forced, never rolled)', DAY_SKIES.every((w) => typeof weights[w] === 'number') && typeof weights['night-clear'] !== 'number')
  check('weather weights sum to 100 (a fair sky)', Math.abs(total - 100) < 0.001, `total ${total}`)
  check('new skies are rare but real (each ≥ 0.5/100)', weights.harmattan >= 0.5 && weights.storm >= 0.5 && weights.flood >= 0.5)
  check('WEATHER_META covers every weather with a label', WEATHERS.every((w) => (WEATHER_META[w]?.label ?? '').length > 0))
  check('WEATHER_META covers every weather with a HUD tip', WEATHERS.every((w) => (WEATHER_META[w]?.tip ?? '').length > 0))
  check('the dramatic skies carry a day-roll note', !!WEATHER_META.harmattan?.dayNote && !!WEATHER_META.storm?.dayNote && !!WEATHER_META.flood?.dayNote)
  check('calm skies stay silent at the day roll', WEATHER_META.sunny.dayNote === null && WEATHER_META.cloudy.dayNote === null)
  const effects = TIME.weatherEffects as Record<string, { mood: number }>
  check('weatherEffects covers every DAY sky', DAY_SKIES.every((w) => typeof effects[w]?.mood === 'number'))
  check('flood is the worst day for the spirit (flood < storm < rain < harmattan)', effects.flood.mood < effects.storm.mood && effects.storm.mood < effects.rain.mood && effects.rain.mood < effects.harmattan.mood)
  for (const w of WEATHERS) {
    const row = TRAVEL.weatherMinutesMultiplier[w] as Record<string, number> | undefined
    check(`weatherMinutesMultiplier["${w}"] covers all ${TRANSPORTS.length} transports`, !!row && TRANSPORTS.every((t) => typeof row[t] === 'number' && row[t] > 0))
  }
  check('flood is the slowest weather for every transport', TRANSPORTS.every((t) =>
    (TRAVEL.weatherMinutesMultiplier.flood as Record<string, number>)[t] >= (TRAVEL.weatherMinutesMultiplier.storm as Record<string, number>)[t]))
  check('storm is slower than plain rain for every transport', TRANSPORTS.every((t) =>
    (TRAVEL.weatherMinutesMultiplier.storm as Record<string, number>)[t] >= (TRAVEL.weatherMinutesMultiplier.rain as Record<string, number>)[t]))
}

console.log('\nRAIN FAMILY LAW — one family, three intensities')
{
  check('rain, storm, flood are the rain family', isRainSky('rain') && isRainSky('storm') && isRainSky('flood'))
  check('sunny/cloudy/night/harmattan stay dry skies', !isRainSky('sunny') && !isRainSky('cloudy') && !isRainSky('night-clear') && !isRainSky('harmattan'))
  check('storm and flood are the heavy end', isHeavySky('storm') && isHeavySky('flood') && !isHeavySky('rain'))
}

/* ------------------------------ market stress ------------------------------- */

console.log('\nMARKET STRESS LAW — the fold rides the SAME prices everything reads')
{
  check('sunny days carry no stress', weatherMarketMult('sunny') === 1 && weatherMarketMult('cloudy') === 1 && weatherMarketMult('night-clear') === 1)
  check('stress rises with the sky (harmattan < storm < flood)', weatherMarketMult('harmattan') < weatherMarketMult('storm') && weatherMarketMult('storm') < weatherMarketMult('flood'))
  const day = 12
  const sunnyRoll = marketDayRoll(freshCivicState(), day, 'sunny').next.market
  const floodRoll = marketDayRoll(freshCivicState(), day, 'flood').next.market
  const stormRoll = marketDayRoll(freshCivicState(), day, 'storm').next.market
  check('a flood day rolls every market above the sunny roll', CIVIC.market.markets.every((m) => (floodRoll.prices[m] ?? 0) > (sunnyRoll.prices[m] ?? 0)))
  check('a storm day rolls every market above the sunny roll', CIVIC.market.markets.every((m) => (stormRoll.prices[m] ?? 0) > (sunnyRoll.prices[m] ?? 0)))
  // exact arithmetic: price = round2(base × stress), capped at 2
  for (const m of CIVIC.market.markets) {
    const u = civicHash('mkt', m, day) / 0xffffffff
    const base = CIVIC.market.minMult + u * (CIVIC.market.maxMult - CIVIC.market.minMult)
    const want = Math.min(2, Math.round(base * weatherMarketMult('flood') * 100) / 100)
    check(`flood price for ${m} matches the exact fold arithmetic`, floodRoll.prices[m] === want, `got ${floodRoll.prices[m]} want ${want}`)
  }
  const reRoll = marketDayRoll(floodRoll ? { ...freshCivicState(), market: floodRoll } : freshCivicState(), day, 'sunny')
  check('same-day re-roll is a no-op (the fold cannot double-apply)', reRoll.rolled === false)
  check('marketForDay threads weather for the lazy UI path', (() => {
    const c = marketForDay(freshCivicState(), day, 'storm')
    const s = marketForDay(freshCivicState(), day, 'sunny')
    return CIVIC.market.markets.every((m) => (c.market.prices[m] ?? 0) > (s.market.prices[m] ?? 0))
  })())
  // meal pricing inherits the fold: a storm-day amala costs more at Kpata
  const mealSunny = marketMealPrice(450, 'amala', 'kpata-market', marketForDay(freshCivicState(), day, 'sunny'), day)
  const mealFlood = marketMealPrice(450, 'amala', 'kpata-market', marketForDay(freshCivicState(), day, 'flood'), day)
  check('flood-day meals cost more through the SAME meal law', mealFlood >= mealSunny && mealFlood > 450 * 0.9)
}

/* --------------------------------- flood law --------------------------------- */

console.log('\nFLOOD LAW — the water owns the riverfront for a day')
{
  check('flood closes the Confluence', weatherBlocksLocation('flood', 'confluence'))
  check('no other weather closes it', WEATHERS.filter((w) => w !== 'flood').every((w) => !weatherBlocksLocation(w, 'confluence')))
  check('no other location floods', LOCATIONS.filter((l) => l.id !== 'confluence').every((l) => !weatherBlocksLocation('flood', l.id)))
  const home = LOCATION_BY_ID['home']
  const confluence = LOCATION_BY_ID['confluence']
  const walkPlan = calculateTravel(home, confluence, 'walk', 'sunny', 'morning')
  const floodPlan = calculateTravel(home, confluence, 'walk', 'flood', 'morning')
  check('flood slows the walk that would have crossed town', floodPlan.minutes > walkPlan.minutes)
  // the gig board never strands a passenger at a flooded pin
  const floodDests = gigDestinationsFor('okada', 10, 'flood').map((d) => d.id)
  const sunnyDests = gigDestinationsFor('okada', 10, 'sunny').map((d) => d.id)
  check('flood day: no okada gig drops at the Confluence', !floodDests.includes('confluence'))
  check('sunny day: the Confluence remains a destination', sunnyDests.includes('confluence'))
  check('the rest of the board keeps its sunny-day destinations', sunnyDests.filter((d) => d !== 'confluence').every((d) => floodDests.includes(d)))
}

/* ----------------------------- rough-sky payouts ----------------------------- */

console.log('\nROUGH-SKY LAW — misery on the road pays, and the margin holds')
{
  const park = LOCATION_BY_ID['transport-area']
  const dests = gigDestinationsFor('okada', 10, 'flood')
  const someDest = dests[0]
  const pSunny = gigPayout('okada', someDest, 'sunny')
  const pRain = gigPayout('okada', someDest, 'rain')
  const pStorm = gigPayout('okada', someDest, 'storm')
  const pFlood = gigPayout('okada', someDest, 'flood')
  check('rain pays above sun', pRain > pSunny)
  check('storm pays above rain (rough-sky bonus stacks)', pStorm > pRain)
  check('flood pays above storm', pFlood > pStorm)
  // the M4 margin law (payout − fuel > 0) must hold for EVERY combo under
  // storm and flood — the bonus only ever widens it, never flips it
  let worstMargin = Number.POSITIVE_INFINITY
  let combos = 0
  for (const v of VEHICLES) {
    for (const dest of gigDestinationsFor(v.model, 10, 'flood')) {
      for (const sky of ['storm', 'flood'] as Weather[]) {
        const plan = calculateTravel(park, dest, `own-${v.model}` as TransportId, sky, 'morning')
        const margin = gigPayout(v.model, dest, sky) - plan.cost
        combos++
        if (margin < worstMargin) worstMargin = margin
      }
    }
  }
  check(`${combos} model × destination × rough-sky combos all keep payout − fuel > 0`, combos > 0 && worstMargin > 0, `worst margin ${worstMargin}`)
}

/* ------------------------------- night market ------------------------------- */

console.log('\nNIGHT MARKET LAW — the food strip turns after dark')
{
  check('the night market lives at the Food Strip', NIGHT_MARKET_LOCATION_ID === 'food-area')
  check('opens evening and night only', isNightMarketOpen('evening') && isNightMarketOpen('night'))
  check('daylight keeps it shut', !isNightMarketOpen('morning') && !isNightMarketOpen('afternoon'))
  check('the seeded discount sits in its band and is deterministic', (() => {
    for (let d = 21; d <= 50; d++) {
      // M10 — Ramadan days DEEPEN the discount by law (×0.92): the raw band
      // holds on plain year-days only (the fast wraps the year's first days)
      const m1 = nightMarketMultFor(d)
      const m2 = nightMarketMultFor(d)
      if (m1 !== m2) return false
      if (m1 < CIVIC.nightMarket.minMult * 0.92 - 1e-9 || m1 > CIVIC.nightMarket.maxMult) return false
    }
    return true
  })())
  check('the discount actually varies across days (prices breathe)', new Set(Array.from({ length: 14 }, (_, i) => nightMarketMultFor(i + 1))).size > 1)
  const suya = MEAL_BY_KEY['night-suya']
  const price = nightMealPrice(suya.price, 8)
  const want = Math.max(10, Math.round((suya.price * nightMarketMultFor(8)) / 10) * 10)
  check('night price = round10(base × tonight’s discount)', price === want, `got ${price} want ${want}`)
  check('night dishes never price ABOVE the day rate', (() => {
    for (let d = 1; d <= 40; d++) {
      for (const m of FOOD.meals.filter((x) => x.night)) {
        if (nightMealPrice(m.price, d) > m.price) return false
      }
    }
    return true
  })())
  check('night dishes sold at the strip after dark', mealAvailableAt(true, 'food-area', 'evening') && mealAvailableAt(true, 'food-area', 'night'))
  check('night dishes refused anywhere else', SLOTS.every((s) => !mealAvailableAt(true, 'kpata-market', s)) && SLOTS.every((s) => !mealAvailableAt(true, 'home', s)))
  check('night dishes refused at the strip by day', !mealAvailableAt(true, 'food-area', 'morning') && !mealAvailableAt(true, 'food-area', 'afternoon'))
  check('day dishes are everywhere always', SLOTS.every((s) => mealAvailableAt(false, 'kpata-market', s)))
  const nightKeys = FOOD.meals.filter((m) => m.night).map((m) => m.key)
  check('exactly the three night dishes exist', nightKeys.length === 3 && ['night-suya', 'boli-ekpa', 'peppersoup'].every((k) => nightKeys.includes(k)))
}

/* ------------------------------ social laws ------------------------------- */

console.log('\nSOCIAL LAW — gifts, hangouts and a paddy’s favour')
{
  check('every gift costs naira and moves the needle', SOCIAL.gifts.every((g) => g.cost > 0 && g.familiarity > 0))
  check('bigger gifts move the needle harder', SOCIAL.gifts[0].familiarity < SOCIAL.gifts[1].familiarity && SOCIAL.gifts[1].familiarity < SOCIAL.gifts[2].familiarity)
  check('gift lookup finds every gift and lies about nothing else', SOCIAL.gifts.every((g) => giftById(g.id)?.id === g.id) && giftById('village-bike') === null)
  const rel: RelationshipState = { familiarity: 60, lastChatDay: 2 }
  check('a gift can go today when none has', canGift(rel, 5))
  const gifted = afterGift(rel, SOCIAL.gifts[0], 5)
  check('gift lands the familiarity and marks the day', gifted.familiarity === 68 && gifted.lastGiftDay === 5)
  check('second gift same day refused', !canGift(gifted, 5))
  check('gift again tomorrow', canGift(gifted, 6))
  const nearTop = afterGift({ ...rel, familiarity: 97 }, SOCIAL.gifts[2], 5)
  check('familiarity clamps at 100 (no overflow paddy)', nearTop.familiarity === 100)

  check('hangout available with no history', canHangout(rel, 5))
  const out = afterHangout(rel, 5)
  check('hangout lands its familiarity and marks the day', out.familiarity === 60 + SOCIAL.hangout.familiarity && out.lastHangoutDay === 5)
  check('hangout cooldown holds for cooldownDays − 1', Array.from({ length: SOCIAL.hangout.cooldownDays - 1 }, (_, i) => 6 + i).every((d) => !canHangout(out, d)))
  check('hangout reopens on cooldownDay', canHangout(out, 5 + SOCIAL.hangout.cooldownDays))
  check('hangout config: night slots only, real cost', (SOCIAL.hangout.slots as readonly string[]).includes('evening') && (SOCIAL.hangout.slots as readonly string[]).includes('night') && SOCIAL.hangout.cost > 0)

  check('strangers never drop favours', WEATHERS.length > 0 && Array.from({ length: 30 }, (_, i) => i + 1).every((d) => !favorRollsToday(20, 'musa', d)))
  const anyTrue = Array.from({ length: 60 }, (_, i) => i + 1).filter((d) => favorRollsToday(60, 'musa', d))
  check('paddies drop favours on some days (deterministic)', anyTrue.length > 0)
  check('the favour roll is deterministic per (npc, day)', anyTrue.every((d) => favorRollsToday(60, 'musa', d) === true))
  check('favour chance sits in its configured band', (() => {
    const hits = Array.from({ length: 200 }, (_, i) => i + 1).filter((d) => favorRollsToday(60, 'musa', d)).length
    return hits > 200 * SOCIAL.favorChance * 0.5 && hits < 200 * SOCIAL.favorChance * 1.5
  })())
}

/* ------------------------------ REAL STORE PASS ------------------------------ */

console.log('\nREAL STORE — flood day, night plate, gift, hangout, favour (bun, live actions)')
{
  // Math.random pinned HIGH: 0.999 of the weather walk lands on FLOOD
  // (weights sum 100: 55+25+14+3.5+1.8 = 99.3 < 99.9 → flood, mood −8).
  const realRandom = Math.random
  Math.random = () => 0.999
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const state = () => useGameStore.getState()

  state().startNewGame('tester', 'male', {...DEFAULT_AVATAR })
  // M9-era neutralizer: this suite predates the casual shell — pre-complete
  // today's goals and the onboarding arc so its exact-cash assertions still
  // measure ONE action at a time (no goal rewards stacking in).
  const neutralizeM9 = () => {
    const d0 = state().world!.day
    useGameStore.setState({
      goals: { day: d0, ids: ['gig-run', 'eat-well', 'waka'], progress: { 'gig-run': 99, 'eat-well': 99, waka: 99 }, done: [true, true, true], streak: 0, lastDoneDay: d0 },
      onboarding: { done: ['travel', 'work', 'meal', 'earn'], rewarded: true },
      account: { linked: true, handle: 'legacy_test', token: 'test-token', ageBand: 'adult', gateGraceDay: d0 },
    })
  }
  neutralizeM9()
  state().addMoney(300_000, { label: 'test funding', category: 'other' })
  check('funded game running', state().player!.cash >= 300_000)

  // ----- the day the water came: sleep rolls a FLOOD day -----
  const moodBefore = state().player!.needs.mood
  state().rest('sleep')
  neutralizeM9() // the day crossed — pin the casual shell again for exact-cash laws
  await sleep(80)
  const flooded = state()
  check('the pinned sky rolled a flood day', flooded.world!.weather === 'flood', `got ${flooded.world!.weather}`)
  check('the flood mood landed on the same sleep (−8)', flooded.player!.needs.mood === Math.max(0, moodBefore - 8), `mood ${flooded.player!.needs.mood}`)
  check('the city announced the flood (day note)', flooded.notifications.some((n) => n.text.startsWith('Flood alert')))
  check('the day’s market prices carry the flood stress (≥ sunny base band)', CIVIC.market.markets.every((m) => (flooded.civic!.market.prices[m] ?? 0) >= CIVIC.market.minMult * weatherMarketMult('flood') - 0.011))

  // ----- the flood law bites at the store level -----
  const cashBeforeFloodTry = flooded.player!.cash
  const locBefore = flooded.world!.currentLocation
  useGameStore.setState({ world: { ...flooded.world!, currentLocation: 'kpata-market' } })
  state().travel('confluence', 'walk')
  await sleep(TRAVEL.transitionMs + 100)
  check('travel into the flooded Confluence refused', state().world!.currentLocation === 'kpata-market')
  check('no fare moved for a refused trip', state().player!.cash === cashBeforeFloodTry)

  // ----- the night market: refused by day, served after dark -----
  useGameStore.setState({ world: { ...state().world!, timeOfDay: 'afternoon' } })
  const noonHunger = state().player!.needs.hunger
  check('night dish refused while the stalls sleep', !state().eatMeal('night-suya', 'food-area'))
  check('refused dish moved no hunger', state().player!.needs.hunger === noonHunger)
  check('night dish priced by the day law while closed (display falls back to base)', state().mealPriceAt('night-suya', 'food-area') === MEAL_BY_KEY['night-suya'].price)
  useGameStore.setState({ world: { ...state().world!, timeOfDay: 'evening' } })
  const nightPrice = state().mealPriceAt('night-suya', 'food-area')
  check('night dish priced BELOW base once the stalls wake', nightPrice < MEAL_BY_KEY['night-suya'].price && nightPrice === nightMealPrice(MEAL_BY_KEY['night-suya'].price, state().world!.day))
  const cashPrePlate = state().player!.cash
  check('night plate serves at the strip after dark', state().eatMeal('night-suya', 'food-area'))
  check('the plate charged the night price exactly', state().player!.cash === cashPrePlate - nightPrice)

  // ----- social depth: gift, hangout, favour -----
  // gift musa (start fresh: familiarity 0 → recharge card +8)
  const cashPreGift = state().player!.cash
  check('gift accepted', state().giveGift('musa', 'recharge-card'))
  check('gift charged its cost', state().player!.cash === cashPreGift - SOCIAL.gifts[0].cost)
  check('gift ledgered', !!state().player!.transactions.find((t) => t.label.startsWith('Gift — ')))
  check('familiarity rose by the gift law', state().player!.relationships.musa.familiarity === SOCIAL.gifts[0].familiarity)
  check('second gift same day refused', !state().giveGift('musa', 'recharge-card'))

  // hangout: evening already, cooldown fresh. Honest clock law: a night
  // hangout runs past midnight — the clock lands on the NEXT morning.
  const cashPreHang = state().player!.cash
  const moodPreHang = state().player!.needs.mood
  const dayPreHang = state().world!.day
  check('hangout accepted at evening', state().hangout('musa'))
  check('hangout charged its cost', state().player!.cash === cashPreHang - SOCIAL.hangout.cost)
  check('hangout mood landed (+8)', state().player!.needs.mood >= Math.min(100, moodPreHang + SOCIAL.hangout.mood) - 0.001)
  check('hangout marked its cooldown day (the day it STARTED)', state().player!.relationships.musa.lastHangoutDay === dayPreHang)
  check('second hangout same day refused', !state().hangout('musa'))
  check('hangout advanced one honest clock slot (night → next morning)', state().world!.timeOfDay === 'morning' && state().world!.day === dayPreHang + 1)

  // favour: push musa to paddy (50), scan for a day the roll hits, chat, accept
  useGameStore.setState({ player: { ...state().player!, relationships: { ...state().player!.relationships, musa: { familiarity: 50, lastChatDay: 0, lastGiftDay: 0, lastHangoutDay: 0 } } } })
  const favorDay = Array.from({ length: 200 }, (_, i) => i + 2).find((d) => favorRollsToday(50, 'musa', d))
  check('a favour day exists for musa', !!favorDay)
  if (favorDay) {
    useGameStore.setState({ world: { ...state().world!, day: favorDay, timeOfDay: 'morning' } })
    const activeBefore = state().player!.activeOpportunities.length
    const outcome = state().chatNpc('musa')
    check('the chat came back', !!outcome)
    check('the paddy dropped real gist (favorOffer attached)', !!outcome?.favorOffer, 'no offer on a roll-true day')
    if (outcome?.favorOffer) {
      state().acceptFavorOffer(outcome.favorOffer)
      check('favour accepted into the active list', state().player!.activeOpportunities.length === activeBefore + 1)
      check('the favour carries the gist source', state().player!.activeOpportunities.at(-1)?.source === 'gist')
      check('duplicate favour refused', (() => {
        state().acceptFavorOffer(outcome.favorOffer!)
        return state().player!.activeOpportunities.length === activeBefore + 1
      })())
    }
  }

  Math.random = realRandom
}

console.log(`\n=== M6 LIVING WORLD: ${passed} passed, ${failed} failed ===`)
if (failed > 0) process.exit(1)
