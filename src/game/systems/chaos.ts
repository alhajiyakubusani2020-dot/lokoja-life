/**
 * LOKOJA LIFE — M8: THE CHAOS ENGINE (pure rules)
 * ------------------------------------------------
 * The grid is alive and the naira has moods:
 *   - On a heavy-sky day (storm/flood) a zone transformer can blow: the
 *     whole area goes dark, shops without backup starve, generator shops
 *     burn fuel, and the community gathers naira for the technician.
 *   - Independent of the sky, some mornings the cash simply dries up:
 *     the ATM pays a capped trickle, POS agents charge their levy,
 *     black-market fuel doubles, and market prices climb — while the
 *     ajo payout days soften everything again.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, day, weather) → same outcome.
 *    Every "random" number is a hash of stable inputs (day / zone / kind),
 *    so tests and replays can trust the world.
 *  - Scarcity and payout days are DERIVED from the day number alone —
 *    reload-proof, zero state. Blowouts are rolled ONCE at the day roll
 *    and persisted (the sky history is not), exactly like weather.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every naira constant lives in config.CHAOS — nothing is hard-coded.
 */

import type { ChaosOutageRecord, ChaosState, Weather } from '../types'
import { CHAOS } from '../data/config'
import { civicHash } from './civic'
import { isHeavySky } from './seasons'

/* -------------------------------- fresh state ------------------------------- */

/** Fresh chaos slice for a new game — a quiet grid, plenty of cash. */
export function freshChaosState(): ChaosState {
  return {
    day: 0,
    active: null,
    recent: [],
    atmDrawnDay: 0,
    atmDrawn: 0,
    stats: { blowouts: 0, fixes: 0, contributed: 0, posFees: 0 },
  }
}

/* ------------------------------ derived laws ------------------------------- */

const unit = (...nums: (number | string)[]): number => civicHash(...nums) / 0xffffffff

/**
 * Did a transformer blow THIS morning? Only a heavy sky (storm / flood)
 * can blow one — plain rain never touches the feeder. Deterministic
 * per (day, weather): the same stormy morning blows the same way.
 */
export function blowoutToday(weather: Weather, day: number): boolean {
  if (!isHeavySky(weather)) return false
  const chance = CHAOS.blowoutChance[weather] ?? 0
  return unit('blowout', day, weather) < chance
}

/** Which zone's transformer lets go (deterministic per blowout day). */
export function blowoutZoneFor(day: number, weather: Weather): string {
  const zones = CHAOS_ZONES
  return zones[civicHash('zone', day, weather) % zones.length]
}

/** How long the disco needs (days) if the community never gathers — 1–2, seeded. */
export function outageDurationFor(day: number, weather: Weather): number {
  const span = CHAOS.outageDays.max - CHAOS.outageDays.min
  const u = unit('outage-len', day, weather)
  return CHAOS.outageDays.min + Math.floor(u * (span + 1))
}

/**
 * The zones that share one transformer each — the 10 LAUNCH districts.
 * Schools ride their district's grid: a school street is not its own
 * feeder, and every zone here is walkable/rideable from the core map.
 */
const CHAOS_ZONES: readonly string[] = [
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
/** Exported for tests + UI (the map never shows a school-zone boom). */
export const CHAOS_ZONE_IDS = CHAOS_ZONES

/**
 * Is today a cash-scarcity morning? Derived from the day alone — the
 * naira's mood needs no memory. A debug override exists ONLY for E2E
 * determinism (set through the __lkl hook, never by game code).
 */
let debugScarcity: boolean | null = null
export function setDebugScarcity(v: boolean | null): void {
  debugScarcity = v
}
export function isScarcityDay(day: number): boolean {
  if (debugScarcity !== null) return debugScarcity
  return unit('scarcity', day) < CHAOS.scarcityChance
}

/** Ajo/esusu payout day — every Nth day the circles settle (day 1 stays calm). */
export function isPayoutDay(day: number): boolean {
  return day > 1 && day % CHAOS.payoutEvery === 0
}

/**
 * The market liquidity fold for a day: a cash crunch lifts prices (traders
 * buy POS cash at a premium), an ajo payout day softens them (the streets
 * are flush). Feeds marketDayRoll so meals, shops and the board all ride
 * the SAME numbers.
 */
export function liquidityMultFor(day: number): number {
  if (isScarcityDay(day)) return CHAOS.scarcityMarketMult
  if (isPayoutDay(day)) return CHAOS.payoutMarketMult
  return 1
}

/** Black-market pump multiplier for personal-vehicle fuel today. */
export function fuelMultFor(day: number): number {
  return isScarcityDay(day) ? CHAOS.fuelSurgeMult : 1
}

/** What the community (NPCs) drops in the pool for one dark day — seeded. */
export function poolNpcContributionFor(startedDay: number, day: number): number {
  const u = unit('pool', startedDay, day)
  return Math.round((CHAOS.poolNpcMin + u * (CHAOS.poolNpcMax - CHAOS.poolNpcMin)) / 10) * 10
}

/* ------------------------------ blackout law ------------------------------- */

/**
 * Is `locationId` dark on `day`? Consults the LIVE outage (dark from its
 * blow day until the roll that restores it) and the recent-finished
 * records (so a multi-day sleep can still price yesterday's dark shop).
 */
export function blackoutAt(chaos: ChaosState, locationId: string, day: number): boolean {
  if (chaos.active) {
    const a = chaos.active
    if (a.zoneId === locationId && day >= a.startedDay && day <= chaos.day) {
      // an active outage darkens every day from its blow day through
      // yesterday inclusive (today may still be fixed tomorrow morning)
      return day < Math.max(a.minUntilDay, chaos.day)
    }
  }
  return chaos.recent.some(
    (r) => r.zoneId === locationId && day >= r.startedDay && day <= r.untilDay,
  )
}

/* -------------------------------- day roll --------------------------------- */

export interface ChaosDayResult {
  next: ChaosState
  /** a transformer blew THIS morning (zone went dark) */
  blowout: { zoneId: string } | null
  /** the light came back THIS morning */
  fixed: { zoneId: string; fixedBy: 'community' | 'disco' } | null
  scarcity: boolean
  payout: boolean
}

/**
 * One day of chaos rules — the store calls this once per day crossing,
 * inside the same loop as the civic roll. Idempotent per day.
 *   1. the community's coins from YESTERDAY land in the pool
 *   2. a full pool (or the disco's own schedule) restores the light
 *   3. a heavy sky may blow the next transformer
 */
export function chaosDayRoll(chaos: ChaosState, day: number, weather: Weather): ChaosDayResult {
  if (day <= chaos.day) {
    return { next: chaos, blowout: null, fixed: null, scarcity: isScarcityDay(day), payout: isPayoutDay(day) }
  }

  let active = chaos.active ? { ...chaos.active, playerContribDays: [...chaos.active.playerContribDays] } : null
  let recent = [...chaos.recent]
  let fixed: ChaosDayResult['fixed'] = null

  // 1 + 2 — settle yesterday's darkness
  if (active) {
    const endedYesterday = day - 1
    if (endedYesterday >= active.startedDay) {
      active = { ...active, pool: active.pool + poolNpcContributionFor(active.startedDay, endedYesterday) }
    }
    // the disco repairs THROUGH the night before minUntilDay — power returns
    // that morning; a full pool calls the technician even earlier
    if (active.pool >= CHAOS.poolTarget || day >= active.minUntilDay) {
      const record: ChaosOutageRecord = {
        zoneId: active.zoneId,
        startedDay: active.startedDay,
        untilDay: endedYesterday,
        fixedBy: active.pool >= CHAOS.poolTarget ? 'community' : 'disco',
      }
      recent = [...recent, record]
      fixed = { zoneId: record.zoneId, fixedBy: record.fixedBy }
      active = null
    }
  }

  // 3 — a heavy sky can blow the next one (never two dark zones at once)
  let blowout: ChaosDayResult['blowout'] = null
  if (!active && blowoutToday(weather, day)) {
    const zoneId = blowoutZoneFor(day, weather)
    active = {
      zoneId,
      startedDay: day,
      minUntilDay: day + outageDurationFor(day, weather),
      pool: 0,
      playerContribDays: [],
    }
    blowout = { zoneId }
  }

  // prune the recent records to the last few days (they only exist so
  // multi-day sleeps can still price dark shops)
  recent = recent.filter((r) => r.untilDay >= day - 6)

  return {
    next: {
      ...chaos,
      day,
      active,
      recent,
      atmDrawnDay: day,
      atmDrawn: chaos.atmDrawnDay === day ? chaos.atmDrawn : 0,
      stats: {
        ...chaos.stats,
        blowouts: chaos.stats.blowouts + (blowout ? 1 : 0),
        fixes: chaos.stats.fixes + (fixed ? 1 : 0),
      },
    },
    blowout,
    fixed,
    scarcity: isScarcityDay(day),
    payout: isPayoutDay(day),
  }
}

/* ------------------------------ pool actions ------------------------------- */

/** Can the player give to the pool today? (In the dark zone, once per day.) */
export function canContribute(chaos: ChaosState, locationId: string, day: number): { ok: boolean; why: string } {
  const a = chaos.active
  if (!a) return { ok: false, why: 'No outage — the grid is holding.' }
  if (a.zoneId !== locationId) return { ok: false, why: 'The dark zone is elsewhere — go there in person.' }
  if (a.playerContribDays.includes(day)) return { ok: false, why: 'You don give today — the community dey grateful.' }
  return { ok: true, why: '' }
}

/** Apply one contribution tier (the store validates affordability first). */
export function applyContribution(chaos: ChaosState, day: number, amount: number): ChaosState {
  if (!chaos.active) return chaos
  return {
    ...chaos,
    active: {
      ...chaos.active,
      pool: chaos.active.pool + amount,
      playerContribDays: [...chaos.active.playerContribDays, day],
    },
    stats: { ...chaos.stats, contributed: chaos.stats.contributed + amount },
  }
}

/* ------------------------------- ATM cap law ------------------------------- */

/** How much the ATM can still pay today (capped on scarcity days). */
export function atmRemaining(chaos: ChaosState, day: number): number {
  if (!isScarcityDay(day)) return Number.POSITIVE_INFINITY
  const drawn = chaos.atmDrawnDay === day ? chaos.atmDrawn : 0
  return Math.max(0, CHAOS.atmCap - drawn)
}

/** Record an ATM draw (cap law bookkeeping). */
export function applyAtmDraw(chaos: ChaosState, day: number, amount: number): ChaosState {
  return {
    ...chaos,
    atmDrawnDay: day,
    atmDrawn: (chaos.atmDrawnDay === day ? chaos.atmDrawn : 0) + amount,
  }
}

/** The POS agent's fee for an instant withdrawal (rounded up to tens). */
export function posFeeFor(amount: number): number {
  return Math.min(Math.ceil((amount * CHAOS.posFeeRate) / 10) * 10, 2000)
}

/** Outage display helper — is the zone the player stands in dark right now? */
export function playerZoneDark(chaos: ChaosState, locationId: string): boolean {
  return blackoutAt(chaos, locationId, chaos.day)
}
