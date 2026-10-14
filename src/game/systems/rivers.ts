/**
 * LOKOJA LIFE — M11: THE RIVERS AWAKE (pure rules)
 * -------------------------------------------------
 * The Niger has a year of its own. The green-season rains fill the river
 * through the middle of the Lokoja year, it peaks late, and the low-lying
 * city pays: the Confluence riverfront, the Ganaja road and (in the worst
 * surges) the Kpata market go under water. The city answers like the real
 * one — canoes become public transport, sandbag walkways rise from the
 * Crusher's sand, cold-room owners pass the bowl for the rescue trucks,
 * and a deep crossing earns an honest toll.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (day, state) → same answer. The river
 *    LEVEL is a pure function of the day counter (the water keeps its own
 *    calendar) — reload-proof, zero state. Only the player's fight against
 *    the water persists (sandbags, walkways, tolls, the canoe, the bowl).
 *  - The M6 flood WEATHER law stays independent: a cloudburst closes the
 *    riverfront for a day; the river season holds it for weeks. The store
 *    refuses travel if EITHER law says so — the stronger water wins.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them. Every naira constant lives in config.RIVERS.
 */

import type { RiversState, WalkwayState } from '../types'
import { ECONOMY, RIVERS, TRAVEL } from '../data/config'
import { LOCATION_BY_ID } from '../data/locations'
import { civicHash } from './civic'
import { yearOf, yearDayOf } from './calendar'

/* ------------------------------ fresh state ------------------------------- */

/** Fresh rivers slice — dry season, empty compound, no canoes. */
export function freshRiversState(): RiversState {
  return {
    day: 0,
    sandbags: 0,
    canoe: false,
    walkways: {},
    rescue: null,
    rescuedYear: 0,
    ferryDay: 0,
    ferryDone: [],
    stats: { sandBought: 0, segmentsLaid: 0, tollsCollected: 0, ferryRuns: 0, ferryEarned: 0, rescues: 0 },
  }
}

/* --------------------------- the river's own year -------------------------- */

const S = RIVERS.season

/**
 * The season base level for a year-day (1–72): dry through the first
 * stretch, a steady green-season rise, the peak sits through Lokoja's
 * flood months, then the river walks back into its banks before the
 * year turns. Deterministic and wrap-safe — New Year's Day is DRY, so
 * the calendar's festivals never drown.
 */
function seasonBaseFor(yearDay: number): number {
  if (yearDay < S.riseStart) return 0
  if (yearDay < S.peakStart) {
    const t = (yearDay - S.riseStart) / (S.peakStart - S.riseStart)
    return t * t * (3 - 2 * t) // smoothstep — the rise gathers itself
  }
  if (yearDay < S.recedeStart) return 1
  if (yearDay < S.dryBy) {
    const t = (yearDay - S.recedeStart) / (S.dryBy - S.recedeStart)
    return 1 - t * t * (3 - 2 * t) // smoothstep — the water lets go
  }
  return 0
}

const unit = (...nums: (number | string)[]): number => civicHash(...nums) / 0xffffffff

/** A debug override for E2E determinism ONLY (never game code). */
let debugLevel: number | null = null
export function setDebugRiverLevel(v: number | null): void {
  debugLevel = v
}

/**
 * THE RIVER LEVEL for an absolute day: the season curve × the day's
 * seeded breath (±wobble), clamped 0..1. This one number drives every
 * cut, every fare premium and every rescue in the city.
 */
export function riverLevelFor(day: number): number {
  if (debugLevel !== null) return Math.min(1, Math.max(0, debugLevel))
  const base = seasonBaseFor(yearDayOf(day))
  if (base <= 0) return 0
  const breath = (unit('river', day) * 2 - 1) * RIVERS.wobble
  return Math.min(1, Math.max(0, base + breath))
}

/* ------------------------------- the cut law ------------------------------- */

/** The low-lying zones the river can take (the map's riverbank trio). */
export const RIVER_ZONES: readonly string[] = Object.keys(RIVERS.cutAt)

/** Is `zoneId` under water today? (The level owns the low ground.) */
export function zoneCut(day: number, zoneId: string): boolean {
  const cutAt = RIVERS.cutAt[zoneId]
  if (cutAt === undefined) return false
  return riverLevelFor(day) >= cutAt
}

/** Every zone the river holds today (banner + map + ferry board read this). */
export function cutZonesFor(day: number): string[] {
  return RIVER_ZONES.filter((z) => zoneCut(day, z))
}

/** Is today a surge day at all (any zone cut)? */
export function isSurge(day: number): boolean {
  return cutZonesFor(day).length > 0
}

/* ------------------------------- walkway laws ------------------------------ */

function walkwayFor(rivers: RiversState, zoneId: string): WalkwayState {
  return rivers.walkways[zoneId] ?? { laid: 0, tollTier: 0, pot: 0, tollDay: 0 }
}

/** How many segments this zone's crossing still needs (0 = it is open). */
export function segmentsLeft(rivers: RiversState, zoneId: string): number {
  const need = RIVERS.segments[zoneId] ?? 0
  return Math.max(0, need - walkwayFor(rivers, zoneId).laid)
}

/** Is the zone's sandbag walkway complete (the WALK law's green light)? */
export function walkwayOpen(rivers: RiversState, zoneId: string): boolean {
  return segmentsLeft(rivers, zoneId) === 0 && (RIVERS.segments[zoneId] ?? 0) > 0
}

/**
 * THE WALK LAW: can the player enter a cut zone on foot? Land transport
 * refuses a cut zone outright, but a finished walkway carries pedestrians
 * — slow, careful steps on wet bags. Any land ride into the cut zone is
 * the store's refusal; this law only governs the walkway.
 */
export function walkAllowed(rivers: RiversState, day: number, zoneId: string): boolean {
  return zoneCut(day, zoneId) && walkwayOpen(rivers, zoneId)
}

/** Can the player lay one segment here today? (In person, sacks in hand.) */
export function canLaySegment(
  rivers: RiversState,
  day: number,
  zoneId: string,
  standingIn: string,
  sacks: number,
): { ok: boolean; why: string } {
  if (standingIn !== zoneId) return { ok: false, why: 'You have to stand in the water to lay the bags.' }
  if (!zoneCut(day, zoneId)) return { ok: false, why: 'The river is in its banks here — no bags needed.' }
  if (walkwayOpen(rivers, zoneId)) return { ok: false, why: 'This crossing is already open — the bags dey hold.' }
  if (sacks < RIVERS.sacksPerSegment) return { ok: false, why: `One segment needs ${RIVERS.sacksPerSegment} sacks of Crusher sand.` }
  return { ok: true, why: '' }
}

/** Lay one segment: consumes the sacks, returns the next slice. */
export function laySegmentApply(rivers: RiversState, zoneId: string): RiversState {
  const w = walkwayFor(rivers, zoneId)
  return {
    ...rivers,
    sandbags: rivers.sandbags - RIVERS.sacksPerSegment,
    walkways: { ...rivers.walkways, [zoneId]: { ...w, laid: w.laid + 1 } },
    stats: { ...rivers.stats, segmentsLaid: rivers.stats.segmentsLaid + 1 },
  }
}

/* --------------------------------- tolls ----------------------------------- */

/** Seeded NPC crossings for a cut zone on a day (deeper water = more walkers). */
export function crossingsFor(zoneId: string, day: number): number {
  const level = riverLevelFor(day)
  const u = unit('toll', zoneId, day)
  return Math.max(0, Math.round(RIVERS.tollCrossingsMin + u * (RIVERS.tollCrossingsMax - RIVERS.tollCrossingsMin) * level))
}

/** The day's toll take for one walkway (crossings × the owner's tier). */
export function tollIncomeFor(rivers: RiversState, zoneId: string, day: number): number {
  if (!zoneCut(day, zoneId) || !walkwayOpen(rivers, zoneId)) return 0
  const w = walkwayFor(rivers, zoneId)
  const tier = RIVERS.tollTiers[w.tollTier] ?? RIVERS.tollTiers[0]
  return crossingsFor(zoneId, day) * tier
}

/** Set the crossing toll (the owner's price call — instant, at the zone). */
export function setTollTierApply(rivers: RiversState, zoneId: string, tierIndex: number): RiversState {
  const w = walkwayFor(rivers, zoneId)
  const clamped = Math.min(RIVERS.tollTiers.length - 1, Math.max(0, tierIndex))
  return { ...rivers, walkways: { ...rivers.walkways, [zoneId]: { ...w, tollTier: clamped } } }
}

/* ------------------------------ the ferry laws ----------------------------- */

/**
 * The PUBLIC land rate between two places (the taxi counter — the same
 * base + perKm every sheet reads). The ferry premium multiplies THIS
 * number, so the water can never quote a fare the land sheets disown.
 */
export function counterFareBetween(fromId: string, toId: string): number {
  const a = LOCATION_BY_ID[fromId]
  const b = LOCATION_BY_ID[toId]
  if (!a || !b) return 0
  const params = ECONOMY.transport['taxi']
  const km = Math.hypot(b.mapX - a.mapX, b.mapY - a.mapY) * TRAVEL.kmPerMapUnit
  return params.cost.base + params.cost.perKm * km
}

/** The ferry fare between two places today (counter fare × surge premium). */
export function ferryFareBetween(fromId: string, toId: string, day: number): number {
  return ferryFareFor(counterFareBetween(fromId, toId), day)
}

/** The ferry fare for a counter fare today (surge premium applied). */
export function ferryFareFor(counterFare: number, day: number): number {
  const level = riverLevelFor(day)
  const mult = RIVERS.ferryFareMult + RIVERS.ferryLevelPremium * level
  return Math.max(10, Math.round((counterFare * mult) / 10) * 10)
}

export interface FerryGig {
  /** stable id — `ferry-{day}-{i}` — doubles as the done-list key */
  id: string
  day: number
  /** the cut zone the passengers are crossing INTO */
  toId: string
  /** what the boatload pays (counter fare × surge premium) */
  payout: number
  /** energy the paddle costs */
  energyCost: number
  /** the level this gig was priced at (display) */
  level: number
}

/** The jetty: where the canoes wait (the buses stop at the Motor Park). */
export const JETTY_ID = RIVERS.jettyId

/**
 * The day's ferry board: only while the river holds a zone, deterministic
 * per (day, board size), priced by the SAME water that cut the road —
 * the boatload pays the counter fare × the surge premium. Riding a canoe
 * needs no ownership — the fishermen row you. RUNNING one as a gig needs
 * your own canoe (buy at the jetty).
 */
export function ferryBoard(day: number, cutZones: string[]): FerryGig[] {
  if (cutZones.length === 0) return []
  const gigs: FerryGig[] = []
  for (let i = 0; i < RIVERS.ferryGigsPerDay; i++) {
    const idx = civicHash('ferry', day, i) % cutZones.length
    const zoneId = cutZones[idx]
    gigs.push({
      id: `ferry-${day}-${i}`,
      day,
      toId: zoneId,
      payout: ferryFareBetween(JETTY_ID, zoneId, day),
      energyCost: RIVERS.ferryEnergy,
      level: riverLevelFor(day),
    })
  }
  return gigs
}

/* ---------------------------- the cold-room rescue ------------------------- */

/**
 * THE RESCUE LAW: when the deep surge wakes (level ≥ trigger), the
 * Kpata cold rooms need the trucks. One bowl per surge-YEAR (the river
 * only comes this deep once a year), seeded NPC flow daily, the player
 * gives in person. A full bowl rolls the trucks the next morning — the
 * stock reaches the Patti road high ground and the street remembers.
 * (The LEVEL is the law: it can only read this deep inside the surge,
 * so no extra season guard is needed — and the E2E override works.)
 */
export function rescueWakes(day: number): boolean {
  return riverLevelFor(day) >= RIVERS.rescue.triggerLevel
}

export function canContributeRescue(
  rivers: RiversState,
  day: number,
  standingIn: string,
): { ok: boolean; why: string } {
  const r = rivers.rescue
  if (!r) return { ok: false, why: 'No rescue running — the water has not reached the freezers.' }
  if (r.zoneId !== standingIn) return { ok: false, why: 'The bowl passes at the cold rooms — go there in person.' }
  if (r.contribDays.includes(day)) return { ok: false, why: 'You don give today — the cold-room owners dey grateful.' }
  return { ok: true, why: '' }
}

export function contributeRescueApply(rivers: RiversState, day: number, amount: number): RiversState {
  if (!rivers.rescue) return rivers
  return {
    ...rivers,
    rescue: {
      ...rivers.rescue,
      pool: rivers.rescue.pool + amount,
      contribDays: [...rivers.rescue.contribDays, day],
    },
  }
}

/** Seeded NPC flow into the bowl for one dark day. */
export function rescueNpcFlowFor(year: number, day: number): number {
  const u = unit('rescue', year, day)
  return Math.round((RIVERS.rescue.npcMin + u * (RIVERS.rescue.npcMax - RIVERS.rescue.npcMin)) / 10) * 10
}

/**
 * THE FLOOD CRUSH LAW: what share of its normal income a shop in
 * `zoneId` earns today. Under water WITHOUT the rescue the stock spoils
 * in real time (×0.5); the trucks reaching high ground soften it to
 * ×0.9 for the rest of the surge-year. Dry zones earn full. The store
 * folds this with the M8 blackout law — the worse water wins.
 */
export function floodBizFactor(rivers: RiversState, zoneId: string, day: number): number {
  const cutAt = RIVERS.cutAt[zoneId]
  if (cutAt === undefined) return 1
  const level = riverLevelFor(day)
  if (level < cutAt) return 1
  const saved = rivers.rescuedYear === yearOf(day)
  return saved ? RIVERS.rescue.savedIncomeFactor : RIVERS.rescue.floodIncomeFactor
}

/* ------------------------------ the market fold ---------------------------- */

/**
 * THE ONE-PRICE LAW: the water lifts every price in town (supply cut,
 * canoes cost more than trailers) — ×(1 + perLevel × level), capped.
 * The store folds this into the SAME marketDayRoll channel the weather,
 * chaos and calendar folds ride, so no surface can disagree.
 */
export function riverMarketMult(day: number): number {
  const level = riverLevelFor(day)
  if (level <= 0) return 1
  return Math.min(RIVERS.marketMultCap, 1 + RIVERS.marketMultPerLevel * level)
}

/* -------------------------------- day roll --------------------------------- */

export interface RiversDayResult {
  next: RiversState
  /** a zone went under water THIS morning (first cut of the surge or a new zone) */
  flooded: { zoneId: string } | null
  /** the river let a zone go THIS morning (first dry reading of the recede) */
  drained: { zoneId: string } | null
  /** the bowl filled and the trucks rolled THIS morning */
  rescueDone: { zoneId: string } | null
  /** the rescue wakes THIS morning (the deep surge is here) */
  rescueWake: { zoneId: string } | null
  /** the damp: the river held above the discomfort line today */
  damp: boolean
  /** the city breathes: the river dropped below the relief line today */
  relief: boolean
}

/**
 * One day of river rules — the store calls this once per day crossing,
 * inside the same loop as the civic + chaos + calendar rolls. Idempotent
 * per day:
 *   1. the cold-room bowl takes the street's coins for YESTERDAY
 *   2. a full bowl rolls the trucks (the year's rescue lands)
 *   3. the toll bowls take yesterday's crossings
 *   4. the deep surge wakes the rescue (or the recede dissolves it)
 */
export function riversDayRoll(rivers: RiversState, day: number): RiversDayResult {
  if (day <= rivers.day) {
    return { next: rivers, flooded: null, drained: null, rescueDone: null, rescueWake: null, damp: riverLevelFor(day) >= RIVERS.dampLevel, relief: false }
  }

  const prev = rivers.day > 0 ? rivers.day : day - 1
  const levelToday = riverLevelFor(day)
  const levelYesterday = riverLevelFor(prev)
  const year = yearOf(day)

  let next: RiversState = { ...rivers, walkways: { ...rivers.walkways } }
  let flooded: RiversDayResult['flooded'] = null
  let drained: RiversDayResult['drained'] = null
  let rescueDone: RiversDayResult['rescueDone'] = null
  let rescueWake: RiversDayResult['rescueWake'] = null

  // cut/drain narrations — a zone crossing its line is a city event
  for (const zoneId of RIVER_ZONES) {
    const cutAt = RIVERS.cutAt[zoneId]
    const wasCut = levelYesterday >= cutAt && riverLevelFor(prev) >= cutAt
    const isCut = levelToday >= cutAt
    if (isCut && !wasCut) flooded = { zoneId }
    if (!isCut && wasCut && levelYesterday >= cutAt) drained = { zoneId }
  }

  // 1 + 2 — the rescue bowl
  const r = next.rescue
  if (r) {
    const stillDeep = levelYesterday >= RIVERS.rescue.triggerLevel && year === r.year
    if (stillDeep) {
      const pooled = r.pool + rescueNpcFlowFor(r.year, prev)
      if (pooled >= RIVERS.rescue.poolTarget) {
        rescueDone = { zoneId: r.zoneId }
        next = {
          ...next,
          rescue: null,
          rescuedYear: r.year,
          stats: { ...next.stats, rescues: next.stats.rescues + 1 },
        }
      } else {
        next = { ...next, rescue: { ...r, pool: pooled } }
      }
    } else {
      // the surge ended (or the year turned) — the bowl dissolves, honest
      next = { ...next, rescue: null }
    }
  }
  if (!next.rescue && rescueWakes(day) && next.rescuedYear !== year) {
    next = { ...next, rescue: { zoneId: RIVERS.rescue.zoneId, year, pool: 0, contribDays: [] } }
    rescueWake = { zoneId: RIVERS.rescue.zoneId }
  }

  // 3 — the toll bowls take yesterday's crossings (while the water held)
  for (const [zoneId, w] of Object.entries(next.walkways)) {
    const income = tollIncomeFor(next, zoneId, prev)
    if (income > 0) {
      next.walkways[zoneId] = { ...w, pot: w.pot + income, tollDay: prev }
    }
  }

  const damp = levelToday >= RIVERS.dampLevel
  const relief = levelYesterday >= RIVERS.reliefBelow && levelToday < RIVERS.reliefBelow

  return {
    next: { ...next, day },
    flooded,
    drained,
    rescueDone,
    rescueWake,
    damp,
    relief,
  }
}

/* ------------------------------ ferry bookkeeping --------------------------- */

/** Record a run ferry gig (the done-ledger kills reload double-pay). */
export function runFerryApply(rivers: RiversState, day: number, gigId: string): RiversState {
  const done = rivers.ferryDay === day ? rivers.ferryDone : []
  return {
    ...rivers,
    ferryDay: day,
    ferryDone: [...done, gigId],
    stats: { ...rivers.stats, ferryRuns: rivers.stats.ferryRuns + 1 },
  }
}

/** Today's ferry board MINUS what already ran (the store's UI read). */
export function availableFerryGigs(rivers: RiversState, day: number, cutZones: string[]): FerryGig[] {
  const done = rivers.ferryDay === day ? rivers.ferryDone : []
  return ferryBoard(day, cutZones).filter((g) => !done.includes(g.id))
}
