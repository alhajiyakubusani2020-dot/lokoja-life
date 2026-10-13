/**
 * LOKOJA LIFE — M2: the civic mesh (pure rules)
 * ----------------------------------------------
 * The state machinery: NEPA bills that really post, KGIRS taxes that really
 * assess what you EARNED, a warrant that really escalates to the police,
 * whistleblower tips that really pay, and a market whose prices really
 * breathe day by day.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, day) → same outcome. Every
 *    "random" number is a hash of stable inputs (day / tip id), so tests
 *    and replays can trust the world.
 *  - No store, no React, no DOM — the store EXECUTES these rules and the
 *    UI only reads them.
 *  - Every naira constant lives in config.CIVIC — nothing is hard-coded.
 */

import type { CivicState, EfccTip, MarketEvent } from '../types'
import { CIVIC } from '../data/config'

/* ------------------------------ tiny hash core ------------------------------ */

/** FNV-1a-ish 32-bit hash — stable across reloads, no imports needed. */
export function civicHash(...nums: (number | string)[]): number {
  let h = 0x811c9dc5
  const mix = (v: number): void => {
    h ^= v & 0xff
    h = Math.imul(h, 0x01000193)
    h ^= (v >>> 8) & 0xff
    h = Math.imul(h, 0x01000193)
  }
  for (const n of nums) {
    if (typeof n === 'number') {
      mix(n)
      mix(n >>> 8)
      mix(n >>> 16)
      mix(n >>> 24)
    } else {
      for (let i = 0; i < n.length; i++) mix(n.charCodeAt(i))
    }
  }
  return h >>> 0
}

/** deterministic 0..1 from the hash */
const unit = (...nums: (number | string)[]): number => civicHash(...nums) / 0xffffffff

/* -------------------------------- fresh state ------------------------------- */

/** Fresh civic slice for a new game — nobody owes anybody anything yet. */
export function freshCivicState(): CivicState {
  return {
    nepa: { cycleStart: 1, owed: 0, paidThrough: CIVIC.nepa.cycleDays, shedding: false, totalPaid: 0 },
    kgirs: { lastSeenEarned: 0, assessed: 0, dueDay: 0, paid: 0, warrant: false },
    police: { fines: 0, paid: 0 },
    efcc: { pending: [], rewardsTotal: 0, lastTipDay: -99 },
    market: { rolledDay: 0, prices: {}, event: null, marketDay: false },
  }
}

/* ---------------------------------- NEPA ------------------------------------ */

/** The bill posted on a given billing day — deterministic per day. */
export function nepaBillFor(day: number): number {
  const { baseBill, billVariance } = CIVIC.nepa
  return Math.round((baseBill + unit('nepa', day) * billVariance) / 10) * 10
}

/** Is a NEPA bill posting today? Bills post every cycleDays from day 1. */
export function nepaBillDueToday(civic: CivicState, day: number): boolean {
  return day > civic.nepa.paidThrough
}

/**
 * One day of NEPA rules. Returns the next state plus what happened so the
 * store can narrate it (notifications stay the store's job).
 */
export function nepaDayRoll(
  civic: CivicState,
  day: number,
): { next: CivicState; posted: number; shed: boolean } {
  let nepa = { ...civic.nepa }
  let posted = 0
  let shed = false

  if (nepaBillDueToday(civic, day)) {
    posted = nepaBillFor(day)
    nepa.owed += posted
    nepa.cycleStart = day
    nepa.paidThrough = day + CIVIC.nepa.cycleDays - 1
  }
  // debt past the grace window cuts the light — exactly once
  if (nepa.owed > 0 && !nepa.shedding && day - nepa.cycleStart >= CIVIC.nepa.graceDays) {
    nepa.shedding = true
    shed = true
  }
  return { next: { ...civic, nepa }, posted, shed }
}

/** What settling the disco costs right now: debt (+ reconnection once cut). */
export function nepaSettleCost(civic: CivicState): number {
  return civic.nepa.owed + (civic.nepa.shedding ? CIVIC.nepa.reconnectFee : 0)
}

/** Apply a full settlement: debt cleared, light back, stats up. */
export function nepaApplyPayment(civic: CivicState, day: number): CivicState {
  return {
    ...civic,
    nepa: {
      ...civic.nepa,
      owed: 0,
      paidThrough: Math.max(civic.nepa.paidThrough, day + CIVIC.nepa.cycleDays - 1),
      shedding: false,
      totalPaid: civic.nepa.totalPaid + nepaSettleCost(civic),
    },
  }
}

/* ---------------------------------- KGIRS ------------------------------------ */

/**
 * One day of tax rules. The cycle income is measured the honest way:
 * the delta of the player's own lifetime earnings ledger since the last
 * look — no per-action hooks, nothing to forget.
 */
export function kgirsDayRoll(
  civic: CivicState,
  totalEarned: number,
  day: number,
): { next: CivicState; assessed: number; warrantIssued: boolean } {
  const k = { ...civic.kgirs }
  let assessedNow = 0
  let warrantIssued = false

  // assessment day — every cycleDays from the game start
  if (day > 1 && (day - 1) % CIVIC.kgirs.cycleDays === 0 && k.assessed === 0) {
    const income = Math.max(0, totalEarned - k.lastSeenEarned)
    assessedNow = Math.max(CIVIC.kgirs.minAssessment, Math.round((income * CIVIC.kgirs.rate) / 10) * 10)
    k.assessed = assessedNow
    k.dueDay = day
    k.lastSeenEarned = totalEarned
  }
  // warrant — past the grace window with an unpaid assessment
  if (k.assessed > 0 && !k.warrant && day > k.dueDay + CIVIC.kgirs.graceDays) {
    k.warrant = true
    warrantIssued = true
  }
  return { next: { ...civic, kgirs: k }, assessed: assessedNow, warrantIssued }
}

/** Cost to settle KGIRS: the assessment — plus the warrant fine via police. */
export function kgirsSettleCost(civic: CivicState): number {
  const k = civic.kgirs
  if (k.assessed <= 0) return 0
  return k.warrant
    ? Math.round((k.assessed * (1 + CIVIC.kgirs.warrantFineRate)) / 10) * 10
    : k.assessed
}

/** Apply a KGIRS settlement through the given channel. */
export function kgirsApplyPayment(civic: CivicState, viaWarrant: boolean): CivicState {
  const k = civic.kgirs
  return {
    ...civic,
    kgirs: {
      ...k,
      assessed: 0,
      dueDay: 0,
      warrant: false,
      paid: k.paid + (viaWarrant ? 1 : 1),
    },
    police: viaWarrant
      ? { ...civic.police, paid: civic.police.paid + 1 }
      : civic.police,
  }
}

/* ---------------------------------- EFCC ------------------------------------- */

const TIP_CASES = [
  'Ghost workers on a ministry payroll',
  'Cartel hoarding fertiliser subsidies',
  'Diverted road-project funds',
  'Fake contract executions',
  'Stolen palliative warehouse',
  'Bribe list at a licence office',
]

/** File a whistleblower tip — the recovery amount is deterministic per id. */
export function efccFileTip(civic: CivicState, day: number): { next: CivicState; tip: EfccTip } {
  const id = `tip-${day}-${civic.efcc.pending.length + 1}`
  const recovery = CIVIC.efcc.recoveries[civicHash('efcc', id) % CIVIC.efcc.recoveries.length]
  const label = TIP_CASES[civicHash('case', id) % TIP_CASES.length]
  const tip: EfccTip = { id, filedDay: day, recovery, label }
  return {
    next: {
      ...civic,
      efcc: {
        ...civic.efcc,
        pending: [...civic.efcc.pending, tip],
        lastTipDay: day,
      },
    },
    tip,
  }
}

/** Whistleblower reward for one resolved tip (rounded to tens). */
export function efccRewardFor(tip: EfccTip): number {
  return Math.max(100, Math.round((tip.recovery * CIVIC.efcc.rewardRate) / 10) * 10)
}

/**
 * Resolve any tips whose investigation ran its course — the store pays the
 * rewards and narrates them.
 */
export function efccDayRoll(
  civic: CivicState,
  day: number,
): { next: CivicState; resolved: EfccTip[]; totalReward: number } {
  const ready = civic.efcc.pending.filter((t) => day >= t.filedDay + CIVIC.efcc.resolveDays)
  const kept = civic.efcc.pending.filter((t) => day < t.filedDay + CIVIC.efcc.resolveDays)
  const totalReward = ready.reduce((sum, t) => sum + efccRewardFor(t), 0)
  return {
    next: {
      ...civic,
      efcc: {
        ...civic.efcc,
        pending: kept,
        rewardsTotal: civic.efcc.rewardsTotal + totalReward,
      },
    },
    resolved: ready,
    totalReward,
  }
}

/* ---------------------------------- market ----------------------------------- */

/** Is `day` a market day? Every Nth day from day 2 (day 1 stays a calm tutorial day). */
export function isMarketDay(day: number): boolean {
  return day >= CIVIC.market.marketDayEvery && day % CIVIC.market.marketDayEvery === 0
}

/** The day's weighted flavour event — deterministic, sometimes none. */
export function marketEventFor(day: number): MarketEvent | null {
  if (unit('event', day) > CIVIC.market.eventChance) return null
  const events = CIVIC.market.events
  const total = events.reduce((s, e) => s + e.weight, 0)
  let pick = unit('eventpick', day) * total
  for (const e of events) {
    pick -= e.weight
    if (pick <= 0) {
      const { weight: _w, ...rest } = e
      return rest
    }
  }
  return null
}

/**
 * The daily market roll — per-market multipliers, the market-day flag and
 * the flavour event, all locked to the day number (reload-proof).
 */
export function marketDayRoll(civic: CivicState, day: number): { next: CivicState; rolled: boolean } {
  if (civic.market.rolledDay === day) return { next: civic, rolled: false }
  const prices: Record<string, number> = {}
  for (const m of CIVIC.market.markets) {
    const u = unit('mkt', m, day)
    prices[m] = CIVIC.market.minMult + u * (CIVIC.market.maxMult - CIVIC.market.minMult)
  }
  return {
    next: {
      ...civic,
      market: {
        rolledDay: day,
        prices,
        event: marketEventFor(day),
        marketDay: isMarketDay(day),
      },
    },
    rolled: true,
  }
}

/** Ensure the market slice is rolled for `day` (lazy — UI calls before reading). */
export function marketForDay(civic: CivicState, day: number): CivicState {
  const { next } = marketDayRoll(civic, day)
  return next
}

/**
 * The honest price of a meal at a market stall today. Base prices live in
 * FOOD; the daily multiplier, the market-day discount and (when present)
 * the event bias stack multiplicatively; rounded to the nearest 10.
 * Outside a market location the base price stands.
 */
export function marketMealPrice(
  base: number,
  mealKey: string,
  locationId: string,
  civic: CivicState,
  day: number,
): number {
  const m = civic.market
  const MARKET_IDS: readonly string[] = CIVIC.market.markets
  if (!MARKET_IDS.includes(locationId)) return base
  let mult = m.prices[locationId] ?? 1
  if (m.marketDay) mult *= CIVIC.market.marketDayMult
  if (m.event && m.event.mealBias === mealKey && typeof m.event.biasMult === 'number') {
    mult *= m.event.biasMult
  }
  return Math.max(10, Math.round((base * mult) / 10) * 10)
}

/* ------------------------------- whole-day roll ------------------------------- */

export interface CivicDayResult {
  next: CivicState
  nepaPosted: number
  nepaShed: boolean
  taxAssessed: number
  warrantIssued: boolean
  tipsResolved: EfccTip[]
  tipReward: number
}

/**
 * The ONE civic day-roll the store calls whenever the in-game day
 * advances (sleep). Idempotent per (state, day): every sub-roll is
 * guarded by its own "already done" marker.
 */
export function civicDayRoll(civic: CivicState, totalEarned: number, day: number): CivicDayResult {
  const nepa = nepaDayRoll(civic, day)
  const kgirs = kgirsDayRoll(nepa.next, totalEarned, day)
  const efcc = efccDayRoll(kgirs.next, day)
  const market = marketDayRoll(efcc.next, day)
  return {
    next: market.next,
    nepaPosted: nepa.posted,
    nepaShed: nepa.shed,
    taxAssessed: kgirs.assessed,
    warrantIssued: kgirs.warrantIssued,
    tipsResolved: efcc.resolved,
    tipReward: efcc.totalReward,
  }
}
