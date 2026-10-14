/**
 * LOKOJA LIFE — M10: THE LIVING CALENDAR (pure rule checks + a real store pass)
 * ------------------------------------------------------------------------------
 * The year has a heartbeat. Law blocks: the year + drift laws (72-day wrap,
 * the Eid family sliding ±4 together, deterministically), the schedule laws
 * (every festival lands at its venue, daysLeft honest, no day-festival
 * collisions across 40 drift years, next-festival countdown), the market
 * folds (Ramadan quiets, Detty sets dollar prices, Eid feasts — all riding
 * the SAME marketDayRoll channel as the chaos liquidity), the fleet premium
 * (Detty returnees pay like tourists), the regatta (four crews, deterministic
 * trophy, sponsor + bet resolution the morning after), the ram market
 * (ladder pricing, six packs a ram, once-per-paddy sharing), the weddings
 * (seeded every 9 days, aso-ebi respect), the paving projects (NPC flow,
 * player tiers, completion → smooth roads, stall law), the paved travel
 * discount, the save v10→v11 migration, and a REAL bun store pass: sleep
 * into the Regatta, sponsor the trophy crew, stake the bookie, collect the
 * morning-after payouts, buy a ram and share the meat, attend a wedding in
 * aso-ebi, and help the union finish a street.
 * Run: bun scripts/test-m10-calendar.ts
 */

import {
  freshCalendarState,
  yearOf,
  yearDayOf,
  absoluteDayOf,
  wrapDay,
  eidDriftForYear,
  inRamadan,
  inDetty,
  ramMarketDayIndex,
  festivalForDay,
  nextFestivalFrom,
  calendarMarketMult,
  calendarFleetMult,
  regattaTeamsFor,
  regattaWinnerFor,
  regattaResultDay,
  attendSprayFor,
  ramPriceFor,
  weddingForCycle,
  pavingZoneFor,
  pavingNpcFlowFor,
  pavingCycleOf,
  isPaved,
  pavedMinutesMult,
  calendarDayRoll,
  canBuyRam,
  buyRamApply,
  canShareMeat,
  shareMeatApply,
  inMeatSeason,
  canSponsor,
  canBet,
  canBuyAsoEbi,
  canAttendWedding,
  attendWeddingApply,
  canContributePaving,
  contributePavingApply,
  setDebugYearDay,
  PAVING_ZONE_IDS,
} from '../src/game/systems/calendar'
import { marketDayRoll, freshCivicState, marketMealPrice } from '../src/game/systems/civic'
import { setDebugRiverLevel } from '../src/game/systems/rivers'
import { gigPayout } from '../src/game/systems/fleet'
import { calculateTravel } from '../src/game/systems/travel'
import { FESTIVALS, MEAL_BY_KEY, TRAVEL } from '../src/game/data/config'
import { LOCATION_BY_ID } from '../src/game/data/locations'
import { DEFAULT_AVATAR } from '../src/game/data/avatar'
import { SaveSystem } from '../src/game/systems/save'
import type { CalendarState } from '../src/game/types'

const A = FESTIVALS.anchors
const SAVE_V = 13

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

function section(name: string) {
  console.log(`\n— ${name} —`)
}

const fresh = freshCalendarState()
const near = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol

/* ------------------------------- the year laws ------------------------------ */

section('the year + drift laws')

check('year wraps at 72 (day 72 = year 1, day 73 = year 2)', yearOf(72) === 1 && yearOf(73) === 2)
check('yearDay wraps honestly (day 1 → 1, day 72 → 72, day 73 → 1)', yearDayOf(1) === 1 && yearDayOf(72) === 72 && yearDayOf(73) === 1)
check('wrapDay folds 0 → 72 and 73 → 1', wrapDay(0) === 72 && wrapDay(73) === 1)
check('absoluteDayOf round-trips (year 3, day 5)', absoluteDayOf(3, 5) === 2 * FESTIVALS.yearDays + 5)

const drifts = new Set<number>()
let driftOk = true
for (let y = 1; y <= 200; y++) {
  const d = eidDriftForYear(y)
  drifts.add(d)
  if (d < -4 || d > 4) driftOk = false
}
check('drift bounded to −4..+4 across 200 years', driftOk, `got ${[...drifts].sort((a, b) => a - b).join(',')}`)
check('drift deterministic (year 7 always the same)', eidDriftForYear(7) === eidDriftForYear(7))
check('drift actually drifts (year 1 ≠ year 2)', eidDriftForYear(1) !== eidDriftForYear(2))

/* --------------------------------- schedule --------------------------------- */

section('the schedule laws')

const expectVenue: Record<string, string> = {
  'new-year': 'confluence',
  'eid-fitr': 'historic-lokoja',
  workers: 'government-area',
  children: 'university-area',
  regatta: 'confluence',
  democracy: 'government-area',
  'eid-kabir': 'historic-lokoja',
  'new-yam': 'historic-lokoja',
  independence: 'government-area',
  detty: 'food-area',
}
{
  const foundIds = new Set<string>()
  let honest = true
  for (let d = 1; d <= FESTIVALS.yearDays; d++) {
    const f = festivalForDay(d)
    if (!f) continue
    foundIds.add(f.id)
    if (f.venueId !== expectVenue[f.id]) honest = false
    const expectDays = f.id === 'detty' ? FESTIVALS.yearDays - A.dettyStart + 1 : f.id === 'regatta' ? A.regattaDays : f.id.startsWith('eid') ? 2 : undefined
    // the full-length expectation holds on the festival's FIRST day only
    if (f.dayOfYear === d && expectDays !== undefined && f.daysLeft !== expectDays) honest = false
    if (f.daysLeft < 1) honest = false
  }
  check('every attendable festival lands at its venue with honest daysLeft', honest && foundIds.size === Object.keys(expectVenue).length, `found ${[...foundIds].join(',')}`)
}
check('no festival on a plain day (yearDay 20)', festivalForDay(20) === null)
check('the Regatta runs 2 days (2 → 1)', festivalForDay(A.regatta)?.id === 'regatta' && festivalForDay(A.regatta)?.daysLeft === 2 && festivalForDay(A.regatta + 1)?.daysLeft === 1)

// the Eid family + ram market drift TOGETHER and never collide with the fixed days
{
  let collisions = 0
  for (let y = 1; y <= 40; y++) {
    const d = eidDriftForYear(y)
    const days: { id: string; start: number }[] = [
      { id: 'regatta', start: A.regatta },
      { id: 'regatta', start: A.regatta + 1 },
      { id: 'new-yam', start: A.newYam },
      { id: 'independence', start: A.independenceDay },
      { id: 'workers', start: A.workersDay },
      { id: 'children', start: A.childrensDay },
      { id: 'democracy', start: A.democracyDay },
      { id: 'new-year', start: A.newYear },
      { id: 'eid-fitr', start: A.eidFitr + d },
      { id: 'eid-fitr', start: A.eidFitr + d + 1 },
      { id: 'eid-kabir', start: A.eidKabir + d },
      { id: 'eid-kabir', start: A.eidKabir + d + 1 },
      { id: 'ram-market', start: A.eidKabir + d - A.ramMarketDays },
      { id: 'ram-market', start: A.eidKabir + d - A.ramMarketDays + 1 },
      { id: 'ram-market', start: A.eidKabir + d - A.ramMarketDays + 2 },
    ]
    for (let i = 0; i < days.length; i++) {
      for (let j = i + 1; j < days.length; j++) {
        if (days[i].id !== days[j].id && wrapDay(days[i].start) === wrapDay(days[j].start)) collisions++
      }
    }
  }
  check('no day-festival collisions across 40 drift years', collisions === 0, `${collisions} collisions`)
}

const nextFrom20 = nextFestivalFrom(20)
check('next-festival countdown from a plain day', nextFrom20.festival.id === 'workers' && nextFrom20.inDays === 7, `got ${nextFrom20.festival.id} in ${nextFrom20.inDays}`)
check('mid-festival days still read as today', nextFestivalFrom(A.regatta).inDays === 0 && nextFestivalFrom(A.regatta + 1).inDays === 0 && nextFestivalFrom(A.regatta + 2).inDays > 0)

/* ------------------------------- market folds ------------------------------- */

section('the market folds — one price law')

check('a plain day folds ×1', calendarMarketMult(20) === 1)
{
  // the Eid pair drifts — find year 1's real days instead of pinning anchors
  let eidDay = 0
  let ramDay2 = 0
  let eidKabirDay = 0
  for (let d = 1; d <= FESTIVALS.yearDays; d++) {
    const f = festivalForDay(d)
    if (f?.id === 'eid-fitr' && eidDay === 0) eidDay = d
    if (f?.id === 'eid-kabir' && eidKabirDay === 0) eidKabirDay = d
    if (ramMarketDayIndex(d) === 2 && ramDay2 === 0) ramDay2 = d
  }
  check('Ramadan quiets the day market (×0.95)', near(calendarMarketMult(eidDay - 5), FESTIVALS.marketMult.ramadan))
  check('an Eid day lifts the feasts (×1.06)', near(calendarMarketMult(eidDay), FESTIVALS.marketMult.eid))
  check('Eid-el-Kabir lifts the feasts too (×1.06)', near(calendarMarketMult(eidKabirDay), FESTIVALS.marketMult.eid))
  check('ram market days lean rich (×1.04)', near(calendarMarketMult(ramDay2), FESTIVALS.marketMult.ramMarket))
  check('the feast lift stacks on the ram market nothing (plain Eid ≠ market day)', eidDay !== ramDay2)
}

// the fold rides the SAME liquidity channel as the chaos engine — one price for all surfaces
{
  const { liquidityMultFor } = await import('../src/game/systems/chaos')
  const day = 37 // a Regatta day — the fold should land inside the SAME roll
  const meal = MEAL_BY_KEY['jollof']
  const product = liquidityMultFor(day) * calendarMarketMult(day)
  const folded = marketDayRoll(freshCivicState(), day, 'sunny', product).next
  const manual = marketDayRoll(freshCivicState(), day, 'sunny', product).next
  const plain = marketDayRoll(freshCivicState(), day, 'sunny', 1).next
  check('folded roll = the same product handed to the roll by hand', near(marketMealPrice(meal.price, meal.key, 'kpata-market', folded, day), marketMealPrice(meal.price, meal.key, 'kpata-market', manual, day)))
  check('the Regatta crowd really lifts the meal over a plain day', marketMealPrice(meal.price, meal.key, 'kpata-market', folded, day) >= marketMealPrice(meal.price, meal.key, 'kpata-market', plain, day))
}

/* ------------------------------ the fleet premium ---------------------------- */

section('the fleet premium')

{
  const dest = LOCATION_BY_ID['kpata-market']
  const basePay = gigPayout('okada', dest, 'sunny')
  const dettyPay = gigPayout('okada', dest, 'sunny', FESTIVALS.fleetMult.detty)
  const ratio = dettyPay / basePay
  check('plain day pays the plain fare', calendarFleetMult(20) === 1)
  check('Detty returnees pay like tourists (×1.35 within rounding)', ratio > 1.3 && ratio < 1.4, `ratio ${ratio.toFixed(3)}`)
  check('regatta + independence ride the board too', calendarFleetMult(A.regatta) === FESTIVALS.fleetMult.regatta && calendarFleetMult(A.independenceDay) === FESTIVALS.fleetMult.independence)
  check('every payout stays on the fare step', dettyPay % TRAVEL.fareRounding === 0)
}

/* --------------------------------- the regatta ------------------------------- */

section('the regatta')

check('four crews race every year', regattaTeamsFor(1).length === 4)
check('the trophy is deterministic per year', regattaWinnerFor(3) === regattaWinnerFor(3))
check('the result lands the morning after the last race day', regattaResultDay(1) === absoluteDayOf(1, A.regatta + A.regattaDays))

{
  const winner = regattaWinnerFor(1)
  const cal: CalendarState = { ...fresh, sponsored: [{ year: 1, teamId: winner }], bets: [{ year: 1, teamId: winner, amount: 1000 }] }
  const resultDay = regattaResultDay(1)
  const rolled = calendarDayRoll(cal, resultDay)
  check('sponsor of the winning crew wins ₦6,000', rolled.regattaResult?.sponsorWin?.payout === FESTIVALS.sponsorWinPayout)
  check('the winning bet pays ×2.5', rolled.regattaResult?.betWin?.payout === Math.round(1000 * FESTIVALS.betOdds))
  check('stakes clear after settlement', rolled.next.sponsored.length === 0 && rolled.next.bets.length === 0)
  check('the win lands in the stats book', rolled.next.stats.regattaWins === 1)

  const loserTeam = regattaTeamsFor(1).find((t) => t !== winner)!
  const loseCal: CalendarState = { ...fresh, sponsored: [{ year: 1, teamId: loserTeam }], bets: [{ year: 1, teamId: loserTeam, amount: 500 }] }
  const rolledLose = calendarDayRoll(loseCal, resultDay)
  check('a losing sponsor gets the honest consolation', rolledLose.regattaResult?.sponsorLose === loserTeam && !rolledLose.regattaResult?.sponsorWin)
  check('a losing bet is honestly lost', rolledLose.regattaResult?.betLose === 500 && !rolledLose.regattaResult?.betWin)

  const again = calendarDayRoll(rolled.next, resultDay)
  check('the roll is idempotent per day', again.regattaResult === null && again.next.day === resultDay)
}

check('sponsorship opens at the Regatta only', !canSponsor(fresh, 20, 'confluence', regattaTeamsFor(1)[0]).ok)
check('sponsorship demands the shoreline in person', !canSponsor(fresh, A.regatta, 'kpata-market', regattaTeamsFor(1)[0]).ok)
check('one sponsorship per year', !canSponsor({ ...fresh, sponsored: [{ year: yearOf(A.regatta), teamId: regattaTeamsFor(1)[0] }] }, A.regatta, 'confluence', regattaTeamsFor(1)[1]).ok)
check('one bet per year', !canBet({ ...fresh, bets: [{ year: yearOf(A.regatta), teamId: regattaTeamsFor(1)[0], amount: 500 }] }, A.regatta, 'confluence', 'adult').ok)
check('bets close before the race (day 2 refuses)', !canBet(fresh, A.regatta + 1, 'confluence', 'adult').ok)
check('kids cannot bet — sponsor instead', !canBet(fresh, A.regatta, 'confluence', 'kid').ok)
check('the naira spray is seeded and tens-rounded', attendSprayFor(A.regatta, 'regatta') >= FESTIVALS.attend.sprayMin && attendSprayFor(A.regatta, 'regatta') % 10 === 0 && attendSprayFor(A.regatta, 'regatta') === attendSprayFor(A.regatta, 'regatta'))

/* -------------------------------- the ram market ----------------------------- */

section('the ram market + meat sharing')

{
  // the window drifts with the Eid family — find year 1's real days
  const ramDays = [1, 2, 3].map((idx) => {
    for (let yd = 1; yd <= FESTIVALS.yearDays; yd++) {
      if (ramMarketDayIndex(absoluteDayOf(1, yd)) === idx) return absoluteDayOf(1, yd)
    }
    return 0
  })
  const kabirDay = (() => {
    for (let yd = 1; yd <= FESTIVALS.yearDays; yd++) {
      const f = festivalForDay(absoluteDayOf(1, yd))
      if (f?.id === 'eid-kabir') return absoluteDayOf(1, yd)
    }
    return 0
  })()
  check('the ram market runs 3 days before Eid-el-Kabir', ramDays[0] > 0 && kabirDay - ramDays[2] === 1 && ramDays[2] - ramDays[0] === 2 && ramMarketDayIndex(kabirDay) === 0)
  const p1 = ramPriceFor(ramDays[0])
  const p3 = ramPriceFor(ramDays[2])
  check('the ladder climbs toward Eid-eve', p1 < p3, `${p1} → ${p3}`)
  check('the price is deterministic per day', p1 === ramPriceFor(ramDays[0]))
  check('the price stays inside the wobble band', p1 >= FESTIVALS.ramBasePrice * FESTIVALS.ramLadder[0] * (1 - FESTIVALS.ramWobble) - 100 && p3 <= FESTIVALS.ramBasePrice * FESTIVALS.ramLadder[2] * (1 + FESTIVALS.ramWobble) + 100)
  check('no ram market price outside the window', ramPriceFor(20) === 0)

  const gate = canBuyRam(ramDays[1], 'kpata-market', 1_000_000)
  check('a ram buys at Kpata in season', gate.ok && gate.price === ramPriceFor(ramDays[1]))
  check('the ram market refuses other venues', !canBuyRam(ramDays[1], 'confluence', 1_000_000).ok)
  check('a thin pocket refuses the ram', !canBuyRam(ramDays[1], 'kpata-market', 100).ok)
  const withMeat = buyRamApply(fresh)
  check('one ram butchers into 6 meat packs', withMeat.meatPacks === FESTIVALS.meatPacksPerRam && withMeat.stats.ramsBought === 1)
}
check('meat sharing lives in the Sallah season only', !inMeatSeason(20))
check('sharing needs a pack', !canShareMeat(fresh, A.eidKabir, 'musa').ok)
{
  const cal = buyRamApply(fresh)
  const shareDay = (() => {
    for (let yd = 1; yd <= FESTIVALS.yearDays; yd++) {
      const d = absoluteDayOf(1, yd)
      if (inMeatSeason(d)) return d
    }
    return 0
  })()
  check('sharing works in season with packs', shareDay > 0 && canShareMeat(cal, shareDay, 'musa').ok)
  const shared = shareMeatApply(cal, shareDay, 'musa')
  check('one pack leaves, the street remembers', shared.meatPacks === cal.meatPacks - 1 && shared.stats.meatShared === 1 && shared.meatShares.includes('1:musa'))
  check('one share per paddy per Eid', !canShareMeat(shared, shareDay, 'musa').ok)
  check('the next paddy still gets theirs', canShareMeat(shared, shareDay, 'emeka').ok)
}

/* --------------------------------- the weddings ------------------------------ */

section('the weddings')

{
  let allSeeded = true
  for (let c = 0; c < 20; c++) {
    const probeDay = c * FESTIVALS.weddingEvery + 1
    const w = weddingForCycle(probeDay)
    const offset = w.day - probeDay
    if (offset < 0 || offset > 6) allSeeded = false
  }
  check('a wedding seeded inside day 1–7 of every 9-day cycle', allSeeded)
  const w = weddingForCycle(3)
  check('the couple + venue are deterministic per read', w.couple === weddingForCycle(3).couple && w.venueId === weddingForCycle(3).venueId)
  check('the couple is stable across its own cycle', weddingForCycle(w.day).couple === w.couple && weddingForCycle(Math.max(1, w.day - 1)).couple === w.couple)
  const today = weddingForCycle(w.day)
  check('isToday lands exactly on the seeded day', today.isToday && today.inDays === 0)
  const before = weddingForCycle(w.day - 1)
  check('the day before shows an honest countdown', !before.isToday && before.inDays === 1)

  check('aso-ebi sells only at Kpata', !canBuyAsoEbi(fresh, w.day - 1, 'confluence', before).ok)
  const withEbi = { ...fresh, asoEbi: [before.id] }
  check('one fabric per wedding', !canBuyAsoEbi(withEbi, w.day - 1, 'kpata-market', before).ok)

  const atVenue = today.venueId
  check('attendance demands the compound', !canAttendWedding(fresh, atVenue === 'confluence' ? 'home' : 'confluence', today).ok)
  const attended = attendWeddingApply(fresh, today.id)
  check('attendance is once per wedding', !canAttendWedding(attended, atVenue, today).ok && attended.stats.weddings === 1)
}

/* ---------------------------------- the paving -------------------------------- */

section('the paving projects')

check('ten districts share the paving seasons', PAVING_ZONE_IDS.length === 10)
check('the zone is deterministic per cycle', pavingZoneFor(0) === pavingZoneFor(0) && pavingZoneFor(1) === pavingZoneFor(1))
check('the NPC flow sits in its band and is tens-rounded', (() => {
  for (let d = 1; d < FESTIVALS.pavingEvery; d++) {
    const f = pavingNpcFlowFor(0, d)
    if (f < FESTIVALS.pavingNpcMin || f > FESTIVALS.pavingNpcMax || f % 10 !== 0) return false
  }
  return pavingNpcFlowFor(0, 3) === pavingNpcFlowFor(0, 3)
})())
check('the cycle law splits the year into projects', pavingCycleOf(1) === 0 && pavingCycleOf(FESTIVALS.pavingEvery) === 0 && pavingCycleOf(FESTIVALS.pavingEvery + 1) === 1)

{
  const zone = pavingZoneFor(0)
  const cal: CalendarState = { ...fresh, paving: { cycle: 0, zoneId: zone, pool: FESTIVALS.pavingTarget - 10, contribDays: [] } }
  const rolled = calendarDayRoll(cal, 5)
  check('a filled pool finishes the street', rolled.pavingDone?.zoneId === zone)
  check('the finished street is paved for the season', isPaved(rolled.next, 5, zone) && isPaved(rolled.next, 5 + FESTIVALS.pavedDays - 1, zone) && !isPaved(rolled.next, 5 + FESTIVALS.pavedDays, zone))
  check('the project closes after completion', rolled.next.paving === null)
  check('the completion lands in the stats book', rolled.next.stats.projectsDone === 1)
}
{
  const zone = pavingZoneFor(0)
  const cal: CalendarState = { ...fresh, paving: { cycle: 0, zoneId: zone, pool: 100, contribDays: [] } }
  const rolled = calendarDayRoll(cal, FESTIVALS.pavingEvery + 1)
  check('a stalled project announces itself', rolled.pavingStalled?.zoneId === zone)
  check('a new project starts on the new cycle', rolled.next.paving?.cycle === 1 && rolled.next.paving?.zoneId === pavingZoneFor(1))
}
{
  const zone = pavingZoneFor(0)
  const other = zone === 'confluence' ? 'home' : 'confluence'
  const cal: CalendarState = { ...fresh, paving: { cycle: 0, zoneId: zone, pool: 0, contribDays: [] } }
  check('contributing demands the zone in person', !canContributePaving(cal, 3, other).ok)
  const given = contributePavingApply(cal, 3, 1000)
  check('the gift lands in the pool', given.paving?.pool === 1000 && given.paving?.contribDays.includes(3))
  check('one gift per day', !canContributePaving(given, 3, zone).ok)
  check('tomorrow the union takes more', canContributePaving(given, 4, zone).ok)
}
{
  const zone = PAVING_ZONE_IDS.find((z) => z !== 'home' && z !== 'kpata-market')!
  const cal: CalendarState = { ...fresh, paved: [{ zoneId: zone, untilDay: 30 }] }
  check('the smooth-road discount applies only into a paved zone', pavedMinutesMult(cal, 10, zone) === FESTIVALS.pavedMinutesMult && pavedMinutesMult(cal, 10, 'kpata-market') === 1 && pavedMinutesMult(cal, 31, zone) === 1)
  const home = LOCATION_BY_ID['home']
  const dest = LOCATION_BY_ID[zone]
  const plain = calculateTravel(home, dest, 'keke', 'sunny', 'morning')
  const smooth = calculateTravel(home, dest, 'keke', 'sunny', 'morning', 1, pavedMinutesMult(cal, 10, zone))
  check('the discount rides calculateTravel (minutes shrink, energy stays)', smooth.minutes <= plain.minutes && smooth.energyCost === plain.energyCost)
}

/* ---------------------------------- seasons ---------------------------------- */

section('the season windows')

check('Ramadan runs the 10 days before Eid-el-Fitr', (() => {
  const d = eidDriftForYear(1)
  const first = wrapDay(A.eidFitr + d - 10)
  const last = wrapDay(A.eidFitr + d - 1)
  const eid = wrapDay(A.eidFitr + d)
  return inRamadan(first) && inRamadan(last) && !inRamadan(eid)
})())
check('Detty December owns the year-end', inDetty(A.dettyStart) && inDetty(FESTIVALS.yearDays) && !inDetty(A.dettyStart - 1))

/* --------------------------------- debug law --------------------------------- */

section('the debug override (E2E only)')

setDebugYearDay(37)
check('the override bends every reading to one year-day', festivalForDay(999)?.id === 'regatta' && yearDayOf(999) === 37)
setDebugYearDay(null)
check('clearing the override restores the true year', yearDayOf(999) === ((999 - 1) % FESTIVALS.yearDays) + 1)

/* ------------------------------- save migration ------------------------------ */

section('the save v10 → v11 migration')

{
  const mem = new Map<string, string>()
  const shim = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  }
  ;(globalThis as unknown as Record<string, unknown>).localStorage = shim
  // the SaveSystem guards on window.localStorage — bun has no window
  ;(globalThis as unknown as Record<string, unknown>).window = { localStorage: shim }
  const v10 = {
    version: 10,
    createdAt: 1,
    updatedAt: 2,
    player: { name: 'Ada', gender: 'female' as const, avatar: {}, cash: 1000, needs: {}, skills: {}, reputation: 0, level: 1, xp: 0, homeId: 'basic-room', jobId: null, skillXp: {}, activeOpportunities: [], cooldowns: {}, transactions: [], stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }, inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [], vehicles: [], bankBalance: 0, relationships: {} },
    world: { day: 12, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
    settings: { sound: true, graphics: 'auto' as const, chill: false },
    civic: freshCivicState(),
    fleet: { day: 12, done: ['gig-12-okada-0'] },
    chaos: { day: 12, active: null, recent: [], atmDrawnDay: 12, atmDrawn: 0, stats: { blowouts: 1, fixes: 1, contributed: 500, posFees: 0 } },
    goals: { day: 12, ids: ['a', 'b', 'c'], progress: {}, done: [false, false, false], streak: 2, lastDoneDay: 11 },
    onboarding: { done: ['travel'], rewarded: false },
    account: { linked: true, handle: 'ada_hustle', token: 't', ageBand: 'adult' as const, gateGraceDay: 0 },
  }
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify(v10))
  const loaded = SaveSystem.load()
  check('v10 save migrates to v13', loaded?.version === SAVE_V)
  check('the calendar slice arrives fresh and harmless', !!loaded?.calendar && loaded.calendar.day === 0 && loaded.calendar.meatPacks === 0 && Array.isArray(loaded.calendar.paved))
  check('nothing else moved (chaos/goals/account intact)', loaded?.chaos.stats.blowouts === 1 && loaded?.goals.streak === 2 && loaded?.account.linked === true)
  mem.set(SaveSystem.SAVE_KEY, '{broken json')
  check('a corrupt save still loads as null, no crash', SaveSystem.load() === null)
}

/* ------------------------------- the REAL store pass ------------------------- */

section('the REAL store pass — sleep into the Regatta, stake the year')

{
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const store = useGameStore
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const arrive = async () => {
    for (let i = 0; i < 80; i++) {
      if (!store.getState().isTravelling) return true
      await sleep(60)
    }
    return false
  }
  const sleepDay = async () => {
    store.getState().rest('sleep')
    await sleep(5)
  }
  const travelTo = async (id: string) => {
    if (store.getState().world!.currentLocation === id) return true
    const modes = LOCATION_BY_ID[id].transport
    for (const t of modes) {
      store.getState().travel(id, t)
      const ok = await arrive()
      if (ok && store.getState().world!.currentLocation === id) return true
    }
    return store.getState().world!.currentLocation === id
  }

  store.getState().startNewGame('Ada', 'female', DEFAULT_AVATAR)
  // link the account (the Guest Loop's gate would otherwise block forward travel)
  store.setState({ account: { ...store.getState().account, linked: true, ageBand: 'adult' } })
  // an honest seed — the ram costs a real Eid budget
  store.getState().addMoney(150_000, { label: 'Test seed', category: 'other' })

  check('a fresh game carries the fresh calendar slice', store.getState().calendar.day === 0 && store.getState().calendar.meatPacks === 0)

  // — the Regatta: sleep to the shoreline
  while (store.getState().world!.day < A.regatta) await sleepDay()
  check('the year turns to the Regatta', festivalForDay(store.getState().world!.day)?.id === 'regatta')
  check('the Regatta travel lands at the Confluence', await travelTo('confluence') && store.getState().world!.currentLocation === 'confluence')

  const year = yearOf(store.getState().world!.day)
  const winner = regattaWinnerFor(year)
  const loser = regattaTeamsFor(year).find((t) => t !== winner)!
  const cashBefore = store.getState().player!.cash
  check('sponsor the trophy crew through the live store', store.getState().sponsorBoat(winner) && store.getState().player!.cash === cashBefore - FESTIVALS.sponsorFee)
  check('one sponsorship per year holds in the store', !store.getState().sponsorBoat(loser))
  check('the bookie takes a stake on race-eve', store.getState().betBoat(winner, 1000) && store.getState().calendar.bets.length === 1)
  check('a second stake is refused', !store.getState().betBoat(loser, 500))

  // seed an honest body: mood with headroom + a fed belly (a starving
  // hustler drains every mood gain — the M1 hungry law)
  store.setState({ player: { ...store.getState().player!, needs: { ...store.getState().player!.needs, mood: 55, hunger: 80 } } })
  const moodBefore = store.getState().player!.needs.mood
  const attendedOk = store.getState().attendFestival()
  check('attending the Regatta lifts mood and sprays naira', attendedOk && store.getState().player!.needs.mood > moodBefore, `ok=${attendedOk} mood ${moodBefore} → ${store.getState().player!.needs.mood}`)
  check('attendance is once per day', !store.getState().attendFestival())

  // — the morning after the RACE: payouts land (day 2 → result morning)
  while (store.getState().world!.day < regattaResultDay(year)) await sleepDay()
  check('the trophy crew pays the sponsorship back', store.getState().calendar.stats.regattaWins === 1)
  check('the winner payout landed in the ledger', store.getState().player!.transactions.some((t) => t.label.includes('Regatta sponsor payout')))
  check('the bet ×2.5 landed too', store.getState().player!.transactions.some((t) => t.label.includes('Regatta bet won')))
  check('the stakes cleared from the slice', store.getState().calendar.sponsored.length === 0 && store.getState().calendar.bets.length === 0)

  // — the ram market: buy, butcher, share (the window drifts with the Eid family)
  let ramTarget = 0
  for (let yd = 1; yd <= FESTIVALS.yearDays; yd++) {
    if (ramMarketDayIndex(absoluteDayOf(year, yd)) === 2) {
      ramTarget = absoluteDayOf(year, yd)
      break
    }
  }
  while (store.getState().world!.day < ramTarget) await sleepDay()
  check('the ram market window arrives', ramMarketDayIndex(store.getState().world!.day) > 0)
  check('Kpata travel lands', await travelTo('kpata-market') && store.getState().world!.currentLocation === 'kpata-market')
  const ramPrice = ramPriceFor(store.getState().world!.day)
  const beforeRam = store.getState().player!.cash
  check('the ram buys through the live store', store.getState().buyRam() && store.getState().calendar.meatPacks === FESTIVALS.meatPacksPerRam && store.getState().player!.cash === beforeRam - ramPrice)
  store.getState().chatNpc('musa')
  const famBefore = store.getState().player!.relationships['musa']?.familiarity ?? 0
  check('meat reaches the paddy through the live store', store.getState().shareMeat('musa') && (store.getState().player!.relationships['musa']?.familiarity ?? 0) === Math.min(100, famBefore + FESTIVALS.meatShareFamiliarity))
  check('the second pack to the same paddy is refused', !store.getState().shareMeat('musa'))
  check('the pack count fell by one', store.getState().calendar.meatPacks === FESTIVALS.meatPacksPerRam - 1)

  // — the wedding: aso-ebi, then the canopy (the river rides dry — the
  // surge window would legally lock Kpata in, and this suite tests the calendar)
  setDebugRiverLevel(0)
  const wed = weddingForCycle(store.getState().world!.day)
  while (store.getState().world!.day < wed.day) await sleepDay()
  const wedToday = weddingForCycle(store.getState().world!.day)
  check('the wedding day arrives', wedToday.isToday)
  // an established wedding guest: level 2 opens Historic Lokoja's compound
  store.setState({ player: { ...store.getState().player!, level: 2, needs: { ...store.getState().player!.needs, hunger: 80 } } })
  check('Kpata travel lands for the fabric', await travelTo('kpata-market'))
  check('aso-ebi buys at Kpata', store.getState().buyAsoEbi() && store.getState().calendar.asoEbi.includes(wedToday.id))
  store.setState({ world: { ...store.getState().world!, weather: 'sunny' } }) // a flood day legally closes the riverfront — test on a clear sky
  check('the canopy travel lands', await travelTo(wedToday.venueId), `want ${wedToday.venueId} got ${store.getState().world!.currentLocation} notes="${store.getState().notifications.map((n) => n.text).join(' | ').slice(-160)}"`)
  if (store.getState().world!.currentLocation !== wedToday.venueId) {
    store.setState({ world: { ...store.getState().world!, weather: 'sunny' } })
    await travelTo(wedToday.venueId)
  }
  const repBeforeWed = store.getState().player!.reputation
  const wedGate = canAttendWedding(store.getState().calendar, store.getState().world!.currentLocation, wedToday)
  const wedOk = store.getState().attendWedding(1000)
  check('the aso-ebi wedding pays the double respect', wedOk && store.getState().player!.reputation === repBeforeWed + FESTIVALS.weddingRepAsoEbi && store.getState().calendar.stats.weddings === 1, `ok=${wedOk} gate=${JSON.stringify(wedGate)} asoEbi=${JSON.stringify(store.getState().calendar.asoEbi)} want=w${wedToday.id} day=${store.getState().world!.day}/${wedToday.day}`)
  check('one attendance per wedding', !store.getState().attendWedding(1000))

  // (the river stays dry through the paving phase too — its zone can sit
  // inside the surge window, and this suite tests the calendar's laws)
  // — the paving: stand at the ground-breaking of a fresh season's project
  const dayNow = store.getState().world!.day
  const nextStart = (pavingCycleOf(dayNow) + 1) * FESTIVALS.pavingEvery + 1
  while (store.getState().world!.day < nextStart) await sleepDay()
  const pavingZone = store.getState().calendar.paving?.zoneId ?? pavingZoneFor(pavingCycleOf(store.getState().world!.day))
  check('a fresh project breaks ground on the cycle start', store.getState().calendar.paving?.cycle === pavingCycleOf(nextStart))
  check('the project zone travel lands', await travelTo(pavingZone))
  check('the paving pool takes the player tier in person', store.getState().contributePaving(2500) && store.getState().calendar.paving!.contribDays.length === 1)
  check('one gift per day holds', !store.getState().contributePaving(2500))

  const projectZone = store.getState().calendar.paving!.zoneId
  let guard = 0
  const pavedNow = () => store.getState().calendar.paved.some((r) => r.zoneId === projectZone && store.getState().world!.day <= r.untilDay)
  while (!pavedNow() && guard < 25) {
    await sleepDay()
    guard++
    if (guard % 5 === 0) {
      const cal = store.getState().calendar
      console.log(`    [paving] day ${store.getState().world!.day} pool ${cal.paving?.pool ?? 'null'} zone ${cal.paving?.zoneId ?? '-'} paved ${cal.paved.length}`)
    }
  }
  check('the union finishes the street within the cycle', pavedNow(), `zone ${projectZone} after ${guard} sleeps, day ${store.getState().world!.day}`)
  const pavedZone = store.getState().calendar.paved[store.getState().calendar.paved.length - 1].zoneId
  const home = LOCATION_BY_ID['home']
  const smooth = calculateTravel(home, LOCATION_BY_ID[pavedZone], 'keke', 'sunny', 'morning', 1, pavedMinutesMult(store.getState().calendar, store.getState().world!.day, pavedZone))
  const plain = calculateTravel(home, LOCATION_BY_ID[pavedZone], 'keke', 'sunny', 'morning')
  check('the finished street rides 15% faster', smooth.minutes < plain.minutes, `${plain.minutes} → ${smooth.minutes}`)

  setDebugRiverLevel(null)
  // — the iftar blessing: an evening meal inside the fast lands softer
  setDebugYearDay(5) // inside year 1's drifted fast window (drift −4 → the fast wraps 72, 1..8)
  // march the clock to the iftar hour (wherever the paving afternoon left us)
  let slotGuard = 0
  while (!['evening', 'night'].includes(store.getState().world!.timeOfDay) && slotGuard < 4) {
    store.getState().advanceTime(1)
    slotGuard++
  }
  const w0 = store.getState().world!
  const moodPre = store.getState().player!.needs.mood
  store.getState().eatMeal('jollof')
  const notes = store.getState().notifications.map((n) => n.text).join(' | ')
  check('the iftar blessing announces itself', notes.includes('iftar'), `notes="${notes.slice(-140)}"`)
  check('the meal still feeds honestly', store.getState().player!.needs.mood >= moodPre)
  setDebugYearDay(null)

  // — the calendar slice persists into the save (v11)
  store.getState().saveNow()
  const raw = localStorage.getItem(SaveSystem.SAVE_KEY)
  let parsed: { version: number; calendar?: { meatPacks: number } } | null = null
  try {
    parsed = raw ? (JSON.parse(raw) as { version: number; calendar?: { meatPacks: number } }) : null
  } catch {
    parsed = null
  }
  check('the calendar slice persists into the v13 save', parsed?.version === SAVE_V && typeof parsed?.calendar?.meatPacks === 'number', `raw head=${raw ? raw.slice(0, 60) : 'null'}`)
}

console.log(`\n========================================`)
console.log(`M10 LIVING CALENDAR — ${passed} passed, ${failed} failed`)
console.log(`========================================`)
if (failed > 0) process.exit(1)
