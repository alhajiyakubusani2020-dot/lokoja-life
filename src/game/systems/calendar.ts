/**
 * LOKOJA LIFE — M10: THE LIVING CALENDAR (pure rules)
 * ----------------------------------------------------
 * Lokoja runs on a 72-day year, and the year has a heartbeat:
 *   - The Confluence Regatta (the signature): four neighbourhood boat
 *     teams, shoreline crowds, naira spraying — sponsor a crew, back a
 *     boat, stand in the crowd.
 *   - The Eid family drifts a little every year (the Islamic calendar
 *     never sits still): the Ramadan fast, Eid-el-Fitr, the ram market,
 *     Eid-el-Kabir — buy a ram, butcher it, share the meat around.
 *   - The national days (Workers, Children, Democracy, Independence),
 *     New Yam, New Year, and Detty December when the returnees flood
 *     the city and every price knows it.
 *   - A wedding in somebody's compound every nine days — aso-ebi at
 *     Kpata, gift at the door, respect at the canopy.
 *   - The town union paving one street every fourteen days — gather the
 *     pool, and journeys into that zone ride a smooth road for a season.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (day, state) → same answer. Every
 *    "random" number is a hash of stable inputs — tests and replays
 *    can trust the year.
 *  - The SCHEDULE is derived from the day counter alone — zero state,
 *    reload-proof by construction. Only PARTICIPATION persists
 *    (meat packs, stakes, aso-ebi, attended lists, the paving pool).
 *  - The Eid family drifts ±4 year-days per year, deterministically —
 *    far enough to feel alive, never far enough to collide with the
 *    Regatta or New Yam.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the
 *    UI only reads them. Every naira constant lives in config.FESTIVALS.
 */

import type { CalendarState, FestivalDay, TimeOfDay, WeddingDay } from '../types'
import { FESTIVALS } from '../data/config'
import { civicHash } from './civic'

/* ------------------------------ fresh state ------------------------------- */

/** Fresh calendar slice for a new game — the year's parties are waiting. */
export function freshCalendarState(): CalendarState {
  return {
    day: 0,
    meatPacks: 0,
    meatShares: [],
    sponsored: [],
    bets: [],
    asoEbi: [],
    attended: [],
    paved: [],
    paving: null,
    stats: {
      festivalsAttended: 0,
      ramsBought: 0,
      meatShared: 0,
      regattaWins: 0,
      weddings: 0,
      projectsDone: 0,
    },
  }
}

/* ------------------------------ debug override ----------------------------- */

/**
 * An E2E/debug override for the year-day reading (1–72). Set ONLY through
 * the __lkl hook — normal play never touches it. When set, every calendar
 * law (festivals, Ramadan, Detty, ram prices, weddings) reads this
 * year-day instead of deriving one from the world clock.
 */
let debugYearDay: number | null = null
export function setDebugYearDay(n: number | null): void {
  debugYearDay = n !== null ? Math.max(1, Math.min(FESTIVALS.yearDays, Math.round(n))) : null
}

/* ------------------------------- the year laws ------------------------------ */

const A = FESTIVALS.anchors

/** Which Lokoja year is this? (Year 1 starts on game day 1.) */
export function yearOf(day: number): number {
  return Math.floor((day - 1) / FESTIVALS.yearDays) + 1
}

/** The day's position in the Lokoja year — 1..72, wrapping. */
export function yearDayOf(day: number): number {
  if (debugYearDay !== null) return debugYearDay
  return ((day - 1) % FESTIVALS.yearDays) + 1
}

/** Absolute in-game day of a (year, year-day) pair. */
export function absoluteDayOf(year: number, yearDay: number): number {
  return (year - 1) * FESTIVALS.yearDays + yearDay
}

/**
 * The Islamic-calendar drift: the Eid family slides 3 days later each
 * year, wrapping every 9 — a deterministic wobble of −4..+4 year-days.
 * The drift moves Ramadan, both Eids and the ram market TOGETHER.
 */
export function eidDriftForYear(year: number): number {
  return ((year - 1) * FESTIVALS.eidDriftStep) % FESTIVALS.eidDriftMod - (FESTIVALS.eidDriftMod - 1) / 2
}

const unit = (...nums: (number | string)[]): number => civicHash(...nums) / 0xffffffff

/** Is `yearDay` inside the wrapped window [start, start+len)? */
function inWindow(yearDay: number, start: number, len: number): boolean {
  for (let i = 0; i < len; i++) {
    if (wrapDay(start + i) === yearDay) return true
  }
  return false
}

/** Wrap any integer into the year — 0 becomes 72, 73 becomes 1. */
export function wrapDay(n: number): number {
  return ((n - 1) % FESTIVALS.yearDays + FESTIVALS.yearDays) % FESTIVALS.yearDays + 1
}

/* ------------------------------- the seasons -------------------------------- */

/** Ramadan: the `ramadanDays` before Eid-el-Fitr (drifts with the family). */
export function inRamadan(day: number): boolean {
  const yd = yearDayOf(day)
  const start = A.eidFitr - A.ramadanDays + eidDriftForYear(yearOf(day))
  return inWindow(yd, start, A.ramadanDays)
}

/** Detty December: the year's last stretch — returnees, dollars, shine. */
export function inDetty(day: number): boolean {
  return yearDayOf(day) >= A.dettyStart
}

/** The ram market: the `ramMarketDays` before Eid-el-Kabir. 0 = not today. */
export function ramMarketDayIndex(day: number): number {
  const yd = yearDayOf(day)
  const start = A.eidKabir - A.ramMarketDays + eidDriftForYear(yearOf(day))
  for (let i = 0; i < A.ramMarketDays; i++) {
    if (wrapDay(start + i) === yd) return i + 1
  }
  return 0
}

/* ----------------------------- the day festivals ---------------------------- */

interface FestivalDef {
  id: string
  name: string
  icon: string
  venueId: string
  start: number
  len: number
  note: string
}

/**
 * The attendable day-festivals, in year order. The Eid pair shifts with
 * the drift; everything else holds its anchor. `len` counts days.
 */
function festivalDefsForYear(year: number): FestivalDef[] {
  const d = eidDriftForYear(year)
  return [
    { id: 'new-year', name: 'New Year', icon: '🎆', venueId: 'confluence', start: A.newYear, len: 1, note: 'Cross-over night crowd dey outside — the year don open.' },
    { id: 'eid-fitr', name: 'Eid-el-Fitr', icon: '🌙', venueId: 'historic-lokoja', start: A.eidFitr + d, len: A.eidFitrDays, note: 'The fast don complete — Ramadan blessings for everybody.' },
    { id: 'workers', name: "Workers' Day", icon: '🔨', venueId: 'government-area', start: A.workersDay, len: 1, note: 'The unions dey march — every hustle get value today.' },
    { id: 'children', name: "Children's Day", icon: '🎈', venueId: 'university-area', start: A.childrensDay, len: 1, note: 'The young ones own the streets today.' },
    { id: 'regatta', name: 'Confluence Regatta', icon: '🚤', venueId: 'confluence', start: A.regatta, len: A.regattaDays, note: 'Boat teams on the water, naira dey spray for shoreline.' },
    { id: 'democracy', name: 'Democracy Day', icon: '🗳️', venueId: 'government-area', start: A.democracyDay, len: 1, note: 'The town dey argue politics small small — join the gist.' },
    { id: 'eid-kabir', name: 'Eid-el-Kabir', icon: '🐏', venueId: 'historic-lokoja', start: A.eidKabir + d, len: A.eidKabirDays, note: 'Sallah! Meat dey share around every compound.' },
    { id: 'new-yam', name: 'New Yam Festival', icon: '🍠', venueId: 'historic-lokoja', start: A.newYam, len: 1, note: 'The first yam of the season don land — come chop.' },
    { id: 'independence', name: 'Independence Day', icon: '🇳🇬', venueId: 'government-area', start: A.independenceDay, len: 1, note: 'Green-white-green everywhere — Lokoja dey proud today.' },
    { id: 'detty', name: 'Detty December', icon: '🎉', venueId: 'food-area', start: A.dettyStart, len: FESTIVALS.yearDays - A.dettyStart + 1, note: 'Returnees don land — the city shine, price dey shine too.' },
  ]
}

/**
 * The festival happening TODAY (attendable day-festivals only — the
 * Ramadan fast, the ram market and the paving season are window-laws,
 * not day parties). Deterministic per day; null on plain days.
 */
export function festivalForDay(day: number): FestivalDay | null {
  const yd = yearDayOf(day)
  const year = yearOf(day)
  for (const f of festivalDefsForYear(year)) {
    for (let i = 0; i < f.len; i++) {
      if (wrapDay(f.start + i) === yd) {
        return {
          id: f.id,
          name: f.name,
          icon: f.icon,
          venueId: f.venueId,
          dayOfYear: wrapDay(f.start),
          daysLeft: f.len - i,
          note: f.note,
        }
      }
    }
  }
  return null
}

/**
 * The next day-festival on (or after) `day`, wrapping into next year —
 * the retention chip: the city's calendar always names its next party.
 */
export function nextFestivalFrom(day: number): { festival: FestivalDay; inDays: number } {
  for (let i = 0; i < FESTIVALS.yearDays; i++) {
    const d = day + i
    const f = festivalForDay(d)
    if (f) return { festival: f, inDays: i }
  }
  // unreachable — the year always contains a festival
  return { festival: festivalForDay(day)!, inDays: 0 }
}

/* --------------------------- the price folds -------------------------------- */

/**
 * The calendar's market fold — MULTIPLICATIVE over every season live
 * today: Ramadan quiets the day market, the festivals lift it, Detty
 * December sets the whole city on dollar prices. Feeds marketDayRoll
 * through the SAME liquidity channel as the chaos engine, so meals,
 * shops and the gig board all ride the SAME numbers. One-price law.
 */
export function calendarMarketMult(day: number): number {
  let m = 1
  if (inRamadan(day)) m *= FESTIVALS.marketMult.ramadan
  if (inDetty(day)) m *= FESTIVALS.marketMult.detty
  const rm = ramMarketDayIndex(day)
  if (rm > 0) m *= FESTIVALS.marketMult.ramMarket
  const f = festivalForDay(day)
  if (f) {
    if (f.id === 'eid-fitr' || f.id === 'eid-kabir') m *= FESTIVALS.marketMult.eid
    else if (f.id === 'regatta') m *= FESTIVALS.marketMult.regatta
    else if (f.id === 'new-yam') m *= FESTIVALS.marketMult.newYam
    else if (f.id === 'independence') m *= FESTIVALS.marketMult.independence
  }
  return m
}

/** The returnees' city: the Motor Park's festival premiums (Detty pays). */
export function calendarFleetMult(day: number): number {
  if (inDetty(day)) return FESTIVALS.fleetMult.detty
  const f = festivalForDay(day)
  if (f?.id === 'regatta') return FESTIVALS.fleetMult.regatta
  if (f?.id === 'independence') return FESTIVALS.fleetMult.independence
  return 1
}

/** The iftar blessing: an evening/night meal during the fast lands softer. */
export function isIftarHour(day: number, timeOfDay: TimeOfDay): boolean {
  return inRamadan(day) && (timeOfDay === 'evening' || timeOfDay === 'night')
}

/* ------------------------------- the regatta -------------------------------- */

/** The four neighbourhood crews for a year — showroom order, stable. */
export function regattaTeamsFor(_year: number): readonly string[] {
  return FESTIVALS.regattaTeams
}

/** Which crew takes the trophy this year — deterministic per year. */
export function regattaWinnerFor(year: number): string {
  const teams = regattaTeamsFor(year)
  return teams[civicHash('regatta', year) % teams.length]
}

/** The morning the race results land: the day after the regatta's last day. */
export function regattaResultDay(year: number): number {
  return absoluteDayOf(year, A.regatta + A.regattaDays)
}

/** The crowd's naira spray for attending a festival — seeded, rounded to tens. */
export function attendSprayFor(day: number, festivalId: string): number {
  const u = unit('spray', day, festivalId)
  return Math.round((FESTIVALS.attend.sprayMin + u * (FESTIVALS.attend.sprayMax - FESTIVALS.attend.sprayMin)) / 10) * 10
}

/* ------------------------------- the ram market ----------------------------- */

/**
 * Today's honest ram price: base × the proximity ladder (cheap early,
 * dear on Eid-eve — every buyer knows this dance) × a seeded wobble,
 * rounded to hundreds. Meaningful only inside the ram-market window.
 */
export function ramPriceFor(day: number): number {
  const idx = ramMarketDayIndex(day)
  if (idx === 0) return 0
  const ladder = FESTIVALS.ramLadder[Math.min(idx - 1, FESTIVALS.ramLadder.length - 1)]
  const u = unit('ram', day)
  const wobble = 1 + (u * 2 - 1) * FESTIVALS.ramWobble
  return Math.round((FESTIVALS.ramBasePrice * ladder * wobble) / 100) * 100
}

/* -------------------------------- the weddings ------------------------------ */

/**
 * The wedding in the streets: one every `weddingEvery` days, seeded
 * inside day 1–7 of its cycle (never on the cycle's edge), at a seeded
 * compound, with a seeded couple. If this cycle's wedding already
 * passed, the NEXT one comes back (the UI's countdown never lies).
 */
export function weddingForCycle(day: number): WeddingDay {
  const every = FESTIVALS.weddingEvery
  let cycle = Math.floor((day - 1) / every)
  const offsetFor = (c: number): number => civicHash('wedding-day', c) % 7
  const weddingDayFor = (c: number): number => c * every + 1 + offsetFor(c)
  // if this cycle's wedding already passed, show the next one
  if (day > weddingDayFor(cycle)) cycle += 1
  const weddingDay = weddingDayFor(cycle)
  const venueId = FESTIVALS.weddingVenues[civicHash('wedding-venue', cycle) % FESTIVALS.weddingVenues.length]
  const names = FESTIVALS.coupleFirstNames
  const a = names[civicHash('wedding-a', cycle) % names.length]
  let bi = civicHash('wedding-b', cycle) % names.length
  if (names[bi] === a) bi = (bi + 1) % names.length
  const b = names[bi]
  return {
    id: `w${cycle}`,
    couple: `${a} & ${b}`,
    venueId,
    day: weddingDay,
    isToday: weddingDay === day,
    inDays: Math.max(0, weddingDay - day),
  }
}

/* ----------------------------- the paving season ---------------------------- */

/** The zones the town union paves — the 10 launch districts. */
const PAVING_ZONES: readonly string[] = [
  'home',
  'kpata-market',
  'ganaja-junction',
  'confluence',
  'mount-patti',
  'historic-lokoja',
  'government-area',
  'university-area',
  'food-area',
  'transport-area',
]
/** Exported for tests + UI. */
export const PAVING_ZONE_IDS = PAVING_ZONES

/** Which zone the union is on for a project cycle — deterministic. */
export function pavingZoneFor(cycle: number): string {
  return PAVING_ZONES[civicHash('paving-zone', cycle) % PAVING_ZONES.length]
}

/** What the community drops into the pool on one project day — seeded. */
export function pavingNpcFlowFor(cycle: number, day: number): number {
  const u = unit('paving-flow', cycle, day)
  return Math.round((FESTIVALS.pavingNpcMin + u * (FESTIVALS.pavingNpcMax - FESTIVALS.pavingNpcMin)) / 10) * 10
}

/** The project cycle a day belongs to (one project every `pavingEvery`). */
export function pavingCycleOf(day: number): number {
  return Math.floor((day - 1) / FESTIVALS.pavingEvery)
}

/** A paved street's smoothness — is `zoneId` paved on `day`? */
export function isPaved(cal: CalendarState, day: number, zoneId: string): boolean {
  return cal.paved.some((r) => r.zoneId === zoneId && day <= r.untilDay)
}

/**
 * The smooth-road law: journeys INTO a paved zone take 15% fewer
 * minutes while the surface lasts. One-price — every travel plan in
 * the game reads through this multiplier.
 */
export function pavedMinutesMult(cal: CalendarState, day: number, destId: string): number {
  return isPaved(cal, day, destId) ? FESTIVALS.pavedMinutesMult : 1
}

/* --------------------------------- day roll --------------------------------- */

export interface RegattaResult {
  year: number
  winner: string
  /** the player's sponsorship settled this morning */
  sponsorWin: { teamId: string; payout: number } | null
  sponsorLose: string | null
  /** the player's bet settled this morning */
  betWin: { teamId: string; payout: number } | null
  betLose: number
}

export interface CalendarDayResult {
  next: CalendarState
  /** the town union finished a street this morning */
  pavingDone: { zoneId: string } | null
  /** the union's last project stalled — the pool never filled */
  pavingStalled: { zoneId: string } | null
  /** regatta stakes settled this morning */
  regattaResult: RegattaResult | null
}

/**
 * One day of calendar rules — the store calls this once per day
 * crossing, inside the same loop as the civic + chaos rolls.
 * Idempotent per day. The schedule needs no roll (it is derived);
 * this roll only settles what PEOPLE did: the paving pool's NPC flow,
 * the union's project lifecycle, and the regatta's stakes.
 */
export function calendarDayRoll(cal: CalendarState, day: number): CalendarDayResult {
  if (day <= cal.day) {
    return { next: cal, pavingDone: null, pavingStalled: null, regattaResult: null }
  }

  let next: CalendarState = { ...cal, day }
  let pavingDone: CalendarDayResult['pavingDone'] = null
  let pavingStalled: CalendarDayResult['pavingStalled'] = null
  let regattaResult: RegattaResult | null = null

  /* ---- the paving project lifecycle ---- */
  const cycle = pavingCycleOf(day)
  const cycleStartDay = cycle * FESTIVALS.pavingEvery + 1
  let paving = next.paving ? { ...next.paving, contribDays: [...next.paving.contribDays] } : null
  if (paving && paving.cycle !== cycle) {
    // a new cycle started and the old pool never filled — the union pauses
    pavingStalled = { zoneId: paving.zoneId }
    paving = null
  }
  if (!paving && day === cycleStartDay) {
    // a fresh project breaks ground ONLY on its cycle's first day — one
    // project per season, even if an earlier one finished early
    paving = { cycle, zoneId: pavingZoneFor(cycle), pool: 0, contribDays: [] }
  }
  // yesterday's community coins (only inside the project's own cycle)
  const yesterday = day - 1
  if (paving && pavingCycleOf(yesterday) === cycle) {
    paving = { ...paving, pool: paving.pool + pavingNpcFlowFor(cycle, yesterday) }
  }
  if (paving && paving.pool >= FESTIVALS.pavingTarget) {
    next.paved = [...next.paved.filter((r) => day <= r.untilDay), { zoneId: paving.zoneId, untilDay: day + FESTIVALS.pavedDays - 1 }]
    next.stats = { ...next.stats, projectsDone: next.stats.projectsDone + 1 }
    pavingDone = { zoneId: paving.zoneId }
    paving = null
  }
  next.paving = paving

  /* ---- the regatta's morning after ---- */
  const year = yearOf(day)
  if (day === regattaResultDay(year)) {
    const winner = regattaWinnerFor(year)
    const sponsored = next.sponsored.filter((s) => s.year <= year)
    const bets = next.bets.filter((b) => b.year <= year)
    let sponsorWin: RegattaResult['sponsorWin'] = null
    let sponsorLose: string | null = null
    let betWin: RegattaResult['betWin'] = null
    let betLose = 0
    for (const s of sponsored) {
      if (s.teamId === winner) sponsorWin = { teamId: s.teamId, payout: FESTIVALS.sponsorWinPayout }
      else sponsorLose = s.teamId
    }
    for (const b of bets) {
      if (b.teamId === winner) betWin = { teamId: b.teamId, payout: Math.round(b.amount * FESTIVALS.betOdds) }
      else betLose += b.amount
    }
    if (sponsored.length > 0 || bets.length > 0) {
      regattaResult = { year, winner, sponsorWin, sponsorLose, betWin, betLose }
      next.sponsored = next.sponsored.filter((s) => s.year > year)
      next.bets = next.bets.filter((b) => b.year > year)
      if (sponsorWin) next.stats = { ...next.stats, regattaWins: next.stats.regattaWins + 1 }
    }
  }

  /* ---- housekeeping: expire old paved records, prune share keys ---- */
  if (next.paved.length > 0) next.paved = next.paved.filter((r) => day <= r.untilDay + 1)
  if (next.meatShares.length > 60) next.meatShares = next.meatShares.slice(-60)
  if (next.attended.length > 60) next.attended = next.attended.slice(-60)

  return { next, pavingDone, pavingStalled, regattaResult }
}

/* ------------------------------ action gates -------------------------------- */

export interface Gate {
  ok: boolean
  why: string
}

/** Attend today's festival — standing at its venue, once per festival-day. */
export function canAttendFestival(cal: CalendarState, day: number, locationId: string): Gate & { festival: FestivalDay | null } {
  const festival = festivalForDay(day)
  if (!festival) return { ok: false, why: 'No festival today.', festival: null }
  if (locationId !== festival.venueId) return { ok: false, why: 'The party is at another venue.', festival }
  if (cal.attended.includes(`${day}:${festival.id}`)) return { ok: false, why: 'You don already attend today — enjoy the street.', festival }
  return { ok: true, why: '', festival }
}

/** The meat-sharing window: ram market through Eid-el-Kabir's last day. */
export function inMeatSeason(day: number): boolean {
  const yd = yearDayOf(day)
  const d = eidDriftForYear(yearOf(day))
  const start = A.eidKabir - A.ramMarketDays + d
  const end = A.eidKabir + d + A.eidKabirDays - 1
  // both ends wrap inside a 72-day year and the whole span (≤9 days)
  // never crosses more than one wrap — walk it
  for (let i = 0; i <= end - start; i++) {
    if (wrapDay(start + i) === yd) return true
  }
  return false
}

/** Share ram meat with a paddy — one pack, once per paddy per Eid. */
export function canShareMeat(cal: CalendarState, day: number, npcId: string): Gate {
  if (cal.meatPacks < 1) return { ok: false, why: 'You no get meat pack — go buy ram at the ram market.' }
  if (!inMeatSeason(day)) return { ok: false, why: 'Meat sharing na Sallah season thing.' }
  const year = yearOf(day)
  if (cal.meatShares.includes(`${year}:${npcId}`)) return { ok: false, why: 'You don share meat for this paddy this Eid.' }
  return { ok: true, why: '' }
}

export function shareMeatApply(cal: CalendarState, day: number, npcId: string): CalendarState {
  const year = yearOf(day)
  return {
    ...cal,
    meatPacks: cal.meatPacks - 1,
    meatShares: [...cal.meatShares, `${year}:${npcId}`],
    stats: { ...cal.stats, meatShared: cal.stats.meatShared + 1 },
  }
}

/** Buy a ram at Kpata during the ram market (price from the ladder). */
export function canBuyRam(day: number, locationId: string, cash: number): Gate & { price: number } {
  const price = ramPriceFor(day)
  if (ramMarketDayIndex(day) === 0) return { ok: false, why: 'The ram market no dey today.', price: 0 }
  if (locationId !== 'kpata-market') return { ok: false, why: 'The rams dey Kpata market.', price }
  if (cash < price) return { ok: false, why: `You need ${price} naira for this ram.`, price }
  return { ok: true, why: '', price }
}

export function buyRamApply(cal: CalendarState): CalendarState {
  return {
    ...cal,
    meatPacks: cal.meatPacks + FESTIVALS.meatPacksPerRam,
    stats: { ...cal.stats, ramsBought: cal.stats.ramsBought + 1 },
  }
}

/** Sponsor a regatta crew — one team per player per year, at the shoreline. */
export function canSponsor(cal: CalendarState, day: number, locationId: string, teamId: string): Gate {
  const f = festivalForDay(day)
  if (!f || f.id !== 'regatta') return { ok: false, why: 'Sponsorship opens at the Regatta.' }
  if (locationId !== 'confluence') return { ok: false, why: 'You must stand at the Confluence shoreline.' }
  const year = yearOf(day)
  if (cal.sponsored.some((s) => s.year === year)) return { ok: false, why: 'You don sponsor a team this year — stand by am.' }
  if (!regattaTeamsFor(year).includes(teamId)) return { ok: false, why: 'That crew no dey race this year.' }
  return { ok: true, why: '' }
}

export function sponsorApply(cal: CalendarState, day: number, teamId: string): CalendarState {
  const year = yearOf(day)
  return { ...cal, sponsored: [...cal.sponsored, { year, teamId }] }
}

/** Back a boat — race day eve only, adults only, one stake per year. */
export function canBet(cal: CalendarState, day: number, locationId: string, ageBand: 'kid' | 'teen' | 'adult' | null): Gate {
  const f = festivalForDay(day)
  if (!f || f.id !== 'regatta' || f.daysLeft !== A.regattaDays) return { ok: false, why: 'Bets close before the race — day one only.' }
  if (locationId !== 'confluence') return { ok: false, why: 'You must stand at the Confluence shoreline.' }
  // M13 — THE FAMILY SHIELD: race-eve betting is crime-adjacent — 18+ only.
  if (ageBand !== 'adult') return { ok: false, why: 'Betting na 18+ — small paddies dey sponsor team, that one better pass.' }
  const year = yearOf(day)
  if (cal.bets.some((b) => b.year === year)) return { ok: false, why: 'One bet per year — you don carry stake already.' }
  return { ok: true, why: '' }
}

export function betApply(cal: CalendarState, day: number, teamId: string, amount: number): CalendarState {
  const year = yearOf(day)
  return { ...cal, bets: [...cal.bets, { year, teamId, amount }] }
}

/** Buy the wedding fabric at Kpata — once per wedding, before the day. */
export function canBuyAsoEbi(cal: CalendarState, day: number, locationId: string, wedding: WeddingDay): Gate {
  if (locationId !== 'kpata-market') return { ok: false, why: 'The fabric dey Kpata market.' }
  if (wedding.inDays > 2 && !wedding.isToday) return { ok: false, why: 'Aso-ebi opens two days to the wedding.' }
  if (cal.asoEbi.includes(wedding.id)) return { ok: false, why: 'You don already buy this wedding aso-ebi.' }
  return { ok: true, why: '' }
}

export function buyAsoEbiApply(cal: CalendarState, weddingId: string): CalendarState {
  return { ...cal, asoEbi: [...cal.asoEbi, weddingId] }
}

/** Attend the wedding — at the compound, on the day, once. */
export function canAttendWedding(cal: CalendarState, locationId: string, wedding: WeddingDay): Gate {
  if (!wedding.isToday) return { ok: false, why: 'The wedding no dey today.' }
  if (locationId !== wedding.venueId) return { ok: false, why: 'The canopies dey another compound.' }
  if (cal.attended.includes(wedding.id)) return { ok: false, why: 'You don attend — the couple don see you.' }
  return { ok: true, why: '' }
}

export function attendWeddingApply(cal: CalendarState, weddingId: string): CalendarState {
  return {
    ...cal,
    attended: [...cal.attended, weddingId],
    stats: { ...cal.stats, weddings: cal.stats.weddings + 1 },
  }
}

/** Contribute to the paving pool — in the zone, once per day. */
export function canContributePaving(cal: CalendarState, day: number, locationId: string): Gate {
  const p = cal.paving
  if (!p) return { ok: false, why: 'No paving project today.' }
  if (p.zoneId !== locationId) return { ok: false, why: 'The project dey another zone — go there in person.' }
  if (p.contribDays.includes(day)) return { ok: false, why: 'You don give today — the union dey grateful.' }
  return { ok: true, why: '' }
}

export function contributePavingApply(cal: CalendarState, day: number, amount: number): CalendarState {
  if (!cal.paving) return cal
  return {
    ...cal,
    paving: {
      ...cal.paving,
      pool: cal.paving.pool + amount,
      contribDays: [...cal.paving.contribDays, day],
    },
  }
}
