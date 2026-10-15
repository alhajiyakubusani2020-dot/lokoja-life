/**
 * LOKOJA LIFE — M15: THE CITY PULSE (pure rules)
 * ------------------------------------------------
 * The civic mesh already LIVES — transformers blow (M8), the Niger
 * rises (M11), the calendar dances (M10), the market breathes (M2).
 * The Pulse is the city's own newspaper: the SAME deterministic facts,
 * rewritten as shareable news. Zero new simulation, zero new state —
 * the feed derives from the day + the slices the game already keeps.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the same city state yields the same
 *    feed, byte for byte. A test can pin a day and know the news.
 *  - The city's PRIVATE books stay OUT of the paper: bills, taxes,
 *    fines and the player's wallet never become headlines. The Pulse
 *    reports the city (outages, rivers, festivals, market, scarcity),
 *    not the player.
 *  - Weight law: a blown transformer outranks a flood warning, which
 *    outranks a festival, which outranks the market. Ties break by id
 *    (a total order — the feed is sortable and testable).
 *  - Read-marking is idempotent: marking a feed you already marked
 *    changes nothing, and the unread count never counts yesterday.
 *  - KNOW YOUR CITY: the share card's percent reads REAL persisted
 *    facts only (biz, garage, festivals, rivers, school, home, JAPA,
 *    MOPOL, the ledger). No invented progress, no vanity rounding.
 */

import type { Weather, ChaosState, CivicState, RiversState, CalendarState, PlayerState, PulseState } from '../types'
import { LOCATION_BY_ID } from '../data/locations'
import { CHAOS } from '../data/config'
import { blackoutAt, fuelMultFor, isPayoutDay, isScarcityDay } from './chaos'
import { cutZonesFor, isSurge, riverLevelFor } from './rivers'
import { festivalForDay, weddingForCycle, pavingCycleOf } from './calendar'

/* --------------------------------- the item -------------------------------- */

export type PulseKind =
  | 'blast'
  | 'upnepa'
  | 'flood'
  | 'storm'
  | 'fuel'
  | 'market'
  | 'festival'
  | 'wedding'
  | 'paving'
  | 'ajo'
  | 'quiet'

export interface PulseItem {
  /** stable per-day id — `${day}:${kind}[:${zone}]` (the read-mark book keys on this) */
  id: string
  kind: PulseKind
  icon: string
  headline: string
  body: string
  /** the zone the news happened in (null = citywide) */
  zoneId: string | null
  /** the weight law's sort key (higher = louder) */
  w: number
}

export interface PulseInput {
  day: number
  weather: Weather
  chaos: ChaosState
  civic: CivicState
  rivers: RiversState
  calendar: CalendarState
}

const zoneName = (zoneId: string): string => LOCATION_BY_ID[zoneId]?.name ?? zoneId

/* ------------------------------ the feed law ------------------------------- */

/**
 * The day's paper. Deterministic, weight-sorted, id-tiebroken. A quiet
 * city prints one honest line — the paper never invents news, and it
 * is never empty.
 */
export function pulseForDay(input: PulseInput): PulseItem[] {
  const { day, weather, chaos, civic, rivers, calendar } = input
  const items: PulseItem[] = []

  // 1) THE BLAST — a transformer is dark RIGHT NOW (the M8 outage law)
  if (chaos.active && blackoutAt(chaos, chaos.active.zoneId, day)) {
    const z = chaos.active.zoneId
    items.push({
      id: `${day}:blast:${z}`,
      kind: 'blast',
      icon: '⚡',
      headline: `Transformer don blow for ${zoneName(z)}!`,
      body: `The whole area don go dark. Community dey gather ₦${chaos.active.pool.toLocaleString('en-NG')} for the technician — ₦500/₦1k/₦2.5k in person.`,
      zoneId: z,
      w: 100,
    })
  }

  // 2) UP NEPA — the light came back THIS morning (the M8 fix book)
  const backToday = chaos.recent.find((r) => r.untilDay === day - 1)
  if (backToday) {
    items.push({
      id: `${day}:upnepa:${backToday.zoneId}`,
      kind: 'upnepa',
      icon: '💡',
      headline: `UP NEPA! ${zoneName(backToday.zoneId)} don get light back`,
      body: backToday.fixedBy === 'community'
        ? 'The community pool paid the technician — the street dey shine again.'
        : 'The disco finally rolled the truck — the street dey shine again.',
      zoneId: backToday.zoneId,
      w: 80,
    })
  }

  // 3) THE FLOOD — the Niger speaks for itself (the M11 cut law)
  const cuts = cutZonesFor(day)
  if (weather === 'flood' || cuts.length > 0) {
    items.push({
      id: `${day}:flood`,
      kind: 'flood',
      icon: '🌊',
      headline: cuts.length > 0 ? `The Niger don rise — ${cuts.map(zoneName).join(' + ')} dey cut` : 'The Niger don rise — watch the low streets',
      body: cuts.length > 0
        ? `Land transport no go pass there today. The canoe ferry dey run from the jetty — river level ${Math.round(riverLevelFor(day) * 100)}%.`
        : `River level ${Math.round(riverLevelFor(day) * 100)}% — the low streets go cut soon. Buy sand early.`,
      zoneId: cuts[0] ?? null,
      w: 95,
    })
  }

  // 4) THE STORM — heavy sky warning (the M8 blowout window)
  if (weather === 'storm') {
    items.push({
      id: `${day}:storm`,
      kind: 'storm',
      icon: '⛈️',
      headline: 'Heavy sky dey hang over the city',
      body: 'Storm days don blow transformers before. Hold your people close — and maybe drop ₦500 in the light fund early.',
      zoneId: null,
      w: 70,
    })
  }

  // 5) THE FUEL PAPER — scarcity is public math (the M8 scarcity law)
  if (isScarcityDay(day)) {
    items.push({
      id: `${day}:fuel`,
      kind: 'fuel',
      icon: '⛽',
      headline: 'Fuel scarce today — pump don dry for Ganaja',
      body: `Black market dey sell ×${fuelMultFor(day).toFixed(1)}. ATM dey cap ₦${CHAOS.atmCap.toLocaleString('en-NG')} — POS agents don price am.`,
      zoneId: 'ganaja-junction',
      w: 85,
    })
  }

  // 6) THE MARKET — market day + the day's flavour event (the M2 roll)
  if (civic.market.marketDay) {
    items.push({
      id: `${day}:market`,
      kind: 'market',
      icon: '🧺',
      headline: 'Market day for Kpata — prices don soft',
      body: 'The whole street don turn bazaar. Same goods, softer prices — carry your bag.',
      zoneId: 'kpata-market',
      w: 50,
    })
  } else if (civic.market.event) {
    items.push({
      id: `${day}:market-event`,
      kind: 'market',
      icon: civic.market.event.icon || '🧺',
      headline: civic.market.event.label,
      body: civic.market.event.note,
      zoneId: 'kpata-market',
      w: 55,
    })
  }

  // 7) THE FESTIVAL — today's day-festival (the M10 calendar)
  const fest = festivalForDay(day)
  if (fest && fest.daysLeft <= 1) {
    items.push({
      id: `${day}:festival:${fest.id}`,
      kind: 'festival',
      icon: fest.icon,
      headline: `${fest.name} dey ${zoneName(fest.venueId)} today!`,
      body: fest.note,
      zoneId: fest.venueId,
      w: 60,
    })
  }

  // 8) THE WEDDING — the compound with canopies (the M10 cycle law)
  const wedding = weddingForCycle(day)
  if (wedding.isToday) {
    items.push({
      id: `${day}:wedding:${wedding.id}`,
      kind: 'wedding',
      icon: '💍',
      headline: `${wedding.couple} dey wed for ${zoneName(wedding.venueId)} today!`,
      body: 'Aso-ebi dey Kpata — gift well and the respect go follow you.',
      zoneId: wedding.venueId,
      w: 55,
    })
  }

  // 9) THE PAVING — the town union's live project (the M10 season)
  if (calendar.paving && calendar.paving.zoneId && calendar.paving.cycle === pavingCycleOf(day)) {
    items.push({
      id: `${day}:paving:${calendar.paving.zoneId}`,
      kind: 'paving',
      icon: '🛣️',
      headline: `Town union dey pave ${zoneName(calendar.paving.zoneId)}`,
      body: `₦${calendar.paving.pool.toLocaleString('en-NG')} don enter the project pool — the street go ride smooth for 20 days when e finish.`,
      zoneId: calendar.paving.zoneId,
      w: 40,
    })
  }

  // 10) AJO DAY — the circles settle (the M8 payout law)
  if (isPayoutDay(day)) {
    items.push({
      id: `${day}:ajo`,
      kind: 'ajo',
      icon: '🤝',
      headline: 'Ajo payout day — the circles don settle',
      body: `Every ${CHAOS.payoutEvery} days the ajo lands. Market go busy (softer prices), and pockets go full.`,
      zoneId: null,
      w: 45,
    })
  }

  // the weight law: louder first, ties break by id — a total order
  items.sort((a, b) => b.w - a.w || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))

  if (items.length === 0) {
    items.push({
      id: `${day}:quiet`,
      kind: 'quiet',
      icon: '🌤️',
      headline: isSurge(day) ? 'The river dey watch — quiet day for the city' : 'Nothing dey shake the city today',
      body: 'Quiet days na for hustle. The pulse go shout when the city shake.',
      zoneId: null,
      w: 0,
    })
  }
  return items
}

/* ------------------------------ the read book ------------------------------ */

/**
 * Mark a day's feed read. Idempotent by law: marking the same feed
 * twice changes nothing, and stale ids from other days never linger.
 */
export function markPulseRead(pulse: PulseState, day: number, items: PulseItem[]): PulseState {
  const ids = items.map((i) => i.id)
  const seen = new Set(pulse.seen)
  for (const id of ids) seen.add(id)
  return { ...pulse, readDay: day, seen: [...seen].slice(-64) }
}

/** How many of today's items are still unread (yesterday never counts). */
export function pulseUnread(pulse: PulseState, items: PulseItem[]): number {
  const seen = new Set(pulse.seen)
  return items.filter((i) => !seen.has(i.id)).length
}

/* --------------------------- KNOW YOUR CITY -------------------------------- */

export interface CityCheck {
  id: string
  label: string
  done: boolean
}

export interface CityKnowledge {
  percent: number
  grade: string
  checked: number
  total: number
  checks: CityCheck[]
}

/**
 * The checklist — every box reads a REAL persisted fact. If the city
 * says you know it 62%, eighteen honest ledgers agree.
 */
export function cityChecklist(player: PlayerState, slices: {
  calendar: CalendarState
  rivers: RiversState
  education: import('../types').EducationState
  housing: import('../types').HousingState
  japa: import('../types').JapaState
  chaos: ChaosState
}): CityCheck[] {
  const p = player
  const c = slices.calendar
  const r = slices.rivers
  return [
    { id: 'biz', label: 'Open your own shop', done: p.businesses.length > 0 },
    { id: 'vehicle', label: 'Own a ride', done: p.vehicles.length > 0 },
    { id: 'job', label: 'Finish a real job', done: p.stats.jobsCompleted > 0 },
    { id: 'hustle', label: 'Finish a street hustle', done: p.stats.hustlesCompleted > 0 },
    { id: 'earned', label: 'Earn ₦50k lifetime', done: p.stats.totalEarned >= 50_000 },
    { id: 'bank', label: 'Keep money in the bank', done: p.bankBalance > 0 },
    { id: 'friends', label: 'Know 3 people by name', done: Object.keys(p.relationships).length >= 3 },
    { id: 'festival', label: 'Attend a festival', done: c.stats.festivalsAttended > 0 },
    { id: 'wedding', label: 'Attend a wedding', done: c.stats.weddings > 0 },
    { id: 'regatta', label: 'Back a regatta crew', done: c.sponsored.length > 0 || c.stats.regattaWins > 0 },
    { id: 'paving', label: 'Help pave a street', done: c.stats.projectsDone > 0 },
    { id: 'surge', label: 'Fight the river surge', done: r.stats.sandBought > 0 || Object.keys(r.walkways).length > 0 },
    { id: 'ferry', label: 'Run the canoe ferry', done: r.stats.ferryRuns > 0 },
    { id: 'rescue', label: 'Save the cold rooms', done: r.stats.rescues > 0 },
    { id: 'school', label: 'Sit a FUL exam', done: slices.education.examsPassed > 0 || slices.education.graduated },
    { id: 'home', label: 'Own your own place', done: slices.housing.owned !== null },
    { id: 'papers', label: 'Start the JAPA papers', done: slices.japa.passportDay > 0 || slices.japa.nimcDay > 0 },
    { id: 'mopol', label: 'Serve a MOPOL shift', done: slices.japa.policeShifts > 0 },
    { id: 'grid', label: 'Feed the light fund', done: slices.chaos.stats.contributed > 0 },
  ]
}

/** The grade law: what the city calls you at each level of knowing it. */
export function cityGrade(percent: number): string {
  if (percent >= 100) return 'Confluence Legend'
  if (percent >= 75) return 'Indigene'
  if (percent >= 50) return 'Waka Rider'
  if (percent >= 25) return 'Walker'
  return 'Visitor'
}

/** The I-know-Lokoja card: percent + grade, from honest ledgers only. */
export function cityKnowledge(player: PlayerState, slices: Parameters<typeof cityChecklist>[1]): CityKnowledge {
  const checks = cityChecklist(player, slices)
  const checked = checks.filter((c) => c.done).length
  const percent = Math.round((checked / checks.length) * 100)
  return { percent, grade: cityGrade(percent), checked, total: checks.length, checks }
}

/* ------------------------------ the fresh slice ----------------------------- */

export function freshPulseState(): PulseState {
  return {
    readDay: 0,
    seen: [],
    arrivals: [],
    stats: { shares: 0, arrivalsIn: 0 },
  }
}
