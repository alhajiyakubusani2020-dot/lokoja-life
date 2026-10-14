/**
 * LOKOJA LIFE — M6: LIVING WORLD (pure weather laws)
 * ---------------------------------------------------
 * The sky beyond rain. Harmattan dust off the Sahara, confluence
 * thunderstorms and the Niger/Benue flood days are REAL Lokoja weather,
 * and the whole city answers to them: journeys slow, food prices climb,
 * the riverfront closes, and misery on the road pays the riders extra.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (weather, day, location) → same answer.
 *    No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every constant lives in config (TIME.WEATHER_META, CIVIC.nightMarket,
 *    FLEET.roughSkyBonus, SOCIAL) — nothing hard-coded.
 *  - A weather day is ONE day: the roll happens once (systems/world.ts),
 *    everything here derives from the weather value itself. Reload-proof
 *    by construction — no extra state to persist.
 */

import type { TimeOfDay, TransportId, Weather } from '../types'
import { CIVIC, TRAVEL, FESTIVALS } from '../data/config'
import { civicHash } from './civic'
import { inRamadan } from './calendar'

/* ------------------------------ the rain family ----------------------------- */

/**
 * The wet-sky family: plain rain, a confluence thunderstorm and a flood
 * day all read as "rain" to the systems that already respect it — rain
 * premiums, rain audio, rain particles. One family, three intensities.
 */
const RAIN_FAMILY: ReadonlySet<Weather> = new Set(['rain', 'storm', 'flood'])

export function isRainSky(weather: Weather): boolean {
  return RAIN_FAMILY.has(weather)
}

/** Storm/flood read as rain everywhere — the heavy end of the family. */
export function isHeavySky(weather: Weather): boolean {
  return weather === 'storm' || weather === 'flood'
}

/* ----------------------------- flood block law ------------------------------ */

/**
 * THE flood law: a flood day closes the riverfront. The Confluence — the
 * city's pride — is the one location the water owns. Travelling there is
 * refused at the store; every sheet that shows travel options greys it.
 */
export const FLOODED_LOCATION_IDS: readonly string[] = ['confluence']

export function weatherBlocksLocation(weather: Weather, locationId: string): boolean {
  return weather === 'flood' && FLOODED_LOCATION_IDS.includes(locationId)
}

/* ---------------------------- travel minute law ----------------------------- */

/**
 * The minutes multiplier for one transport under one weather. Reads the
 * central TRAVEL table defensively — an unknown row falls back to 1 so a
 * config mistake can never produce NaN journey times.
 */
export function weatherMinutesMult(weather: Weather, transport: TransportId): number {
  return TRAVEL.weatherMinutesMultiplier[weather]?.[transport] ?? 1
}

/* ---------------------------- market stress law ----------------------------- */

/**
 * Weather stress on the food chain, folded into the market roll: dust
 * chokes the supply trailers, storms keep traders home, a flood day is
 * the year's worst food day. The multiplier lands in the market prices
 * at roll time — meals, market shops and the market board all inherit
 * it through the SAME numbers, so no surface can disagree.
 */
export function weatherMarketMult(weather: Weather): number {
  switch (weather) {
    case 'harmattan': return 1.08
    case 'storm': return 1.15
    case 'flood': return 1.3
    default: return 1
  }
}

/* ----------------------------- night market laws ----------------------------- */

/** Is the night market open at this slot? (Evening and night only.) */
export function isNightMarketOpen(timeOfDay: TimeOfDay): boolean {
  return (CIVIC.nightMarket.opensAt as readonly TimeOfDay[]).includes(timeOfDay)
}

/** The night market's home — the Food Strip turns after dark. */
export const NIGHT_MARKET_LOCATION_ID = CIVIC.nightMarket.locationId

/**
 * Seeded per-day night-market discount. Night stalls feed the late
 * hustler: prices BELOW the day rate, breathing 0.78–0.95 day by day.
 * Deterministic from the day number — reload-proof by construction.
 * M10 — during the Ramadan fast the night market is the city's real
 * kitchen: the discount deepens (×0.92 on top of tonight's roll).
 */
export function nightMarketMultFor(day: number): number {
  const u = civicHash('night-mkt', day) / 0xffffffff
  const base = CIVIC.nightMarket.minMult + u * (CIVIC.nightMarket.maxMult - CIVIC.nightMarket.minMult)
  return base * (inRamadan(day) ? FESTIVALS.ramadanNightMult : 1)
}

/**
 * The honest price of a night-market dish tonight: base × tonight's
 * seeded discount, rounded to tens. Night dishes dodge the day market
 * stress — that dodge IS the night market's charm.
 */
export function nightMealPrice(base: number, day: number): number {
  return Math.max(10, Math.round((base * nightMarketMultFor(day)) / 10) * 10)
}

/** Can this dish be sold right here, right now? Night dishes only wake
 *  after dark at the food strip; day dishes follow the day law. */
export function mealAvailableAt(
  mealNight: boolean,
  locationId: string,
  timeOfDay: TimeOfDay,
): boolean {
  if (!mealNight) return true
  return locationId === NIGHT_MARKET_LOCATION_ID && isNightMarketOpen(timeOfDay)
}
