/**
 * LOKOJA LIFE — M12: THE LADDER — HOUSING (pure rules)
 * -----------------------------------------------------
 * The roof over the hustle: the basic room starts as a RENT (a cycle
 * posts every N days, the landlord's wahala lands on a seeded share of
 * cycles — the spike, the leaking roof, the inspecting son), and the
 * ladder climbs by BUYING: family room → self-contain → GRA flat → the
 * Adankolo duplex. Every property carries a comfort rating that warms
 * the sleep law; furnishing tiers (fan → generator → AC) warm it further.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the wahala pick is a hash of the cycle —
 *    same cycle, same wahala, reload-proof.
 *  - The rent book is the only state: paidThrough, owed, the live
 *    wahala. Everything else derives.
 *  - No store, no React, no DOM. Every naira constant lives in config.LADDER.
 */

import type { HousingState } from '../types'
import { LADDER } from '../data/config'
import { civicHash } from './civic'

const H = LADDER.housing

/* ------------------------------ fresh state -------------------------------- */

export function freshHousingState(): HousingState {
  return {
    owned: null,
    furnishing: {},
    rentPaidThrough: 0, // day 0: the first cycle posts on day rentCycleDays
    lastPostedDay: 0,
    rentOwed: 0,
    wahala: null,
    stats: { rentPaid: 0, wahalaResolved: 0, cyclesLate: 0 },
  }
}

/* ------------------------------- the ladder -------------------------------- */

export interface PropertyDef {
  id: string
  name: string
  locationId: string
  price: number
  level: number
  comfort: number
}

export const PROPERTIES: readonly PropertyDef[] = H.properties

export function propertyFor(id: string): PropertyDef | null {
  return PROPERTIES.find((p) => p.id === id) ?? null
}

/** The comfort the sleep law reads tonight (owned property + furnishing). */
export function homeComfort(housing: HousingState): number {
  if (!housing.owned) return 0
  const prop = propertyFor(housing.owned)
  if (!prop) return 0
  const tier = housing.furnishing[housing.owned] ?? 0
  const tierDef = H.furnishTiers.find((f) => f.tier === tier)
  return prop.comfort + (tierDef?.mood ?? 0)
}

/** Can the player buy this rung of the ladder? */
export function canBuyProperty(housing: HousingState, propertyId: string, level: number, cash: number): { ok: boolean; why: string } {
  const prop = propertyFor(propertyId)
  if (!prop) return { ok: false, why: 'No such property.' }
  if (housing.owned === propertyId) return { ok: false, why: 'You already own this one.' }
  if (level < prop.level) return { ok: false, why: `${prop.name} unlocks at Level ${prop.level}.` }
  if (cash < prop.price) return { ok: false, why: `The agent wants ${prop.price.toLocaleString()} naira for ${prop.name}.` }
  return { ok: true, why: '' }
}

export function buyPropertyApply(housing: HousingState, propertyId: string): HousingState {
  return { ...housing, owned: propertyId }
}

/** Furnishing: one honest tier at a time, each warmer than the last. */
export function canFurnish(housing: HousingState, tier: number): { ok: boolean; why: string; cost: number } {
  if (!housing.owned) return { ok: false, why: 'Furnishing is for owners — the landlord no go gree.', cost: 0 }
  const current = housing.furnishing[housing.owned] ?? 0
  if (tier !== current + 1) return { ok: false, why: current === 0 ? 'Start with tier 1 — the fan and the curtains.' : `Finish tier ${current} first.`, cost: 0 }
  const def = H.furnishTiers.find((f) => f.tier === tier)
  if (!def) return { ok: false, why: 'No such tier.', cost: 0 }
  return { ok: true, why: '', cost: def.cost }
}

export function furnishApply(housing: HousingState, tier: number): HousingState {
  if (!housing.owned) return housing
  return { ...housing, furnishing: { ...housing.furnishing, [housing.owned]: tier } }
}

/* ---------------------------- the rent book -------------------------------- */

/** The seeded wahala for a rent cycle (null = a quiet cycle). */
export function wahalaForCycle(cycle: number): { kind: string; cost: number; note: string } | null {
  const roll = civicHash('wahala', cycle) / 0xffffffff
  if (roll >= H.wahalaChance) return null
  const pick = Math.floor(civicHash('wahala-kind', cycle) / 0xffffffff * 3)
  if (pick === 0) return { kind: 'spike', cost: 0, note: 'The landlord don raise rent this cycle — "the dollar don enter"' }
  if (pick === 1) return { kind: 'repair', cost: 2000, note: 'The roof dey leak — the plumber wants his own money' }
  return { kind: 'inspection', cost: 1000, note: 'The landlord\'s son dey inspect — "settle small make we no stress"' }
}

export interface HousingDayResult {
  next: HousingState
  /** a rent cycle posted this morning (owed grew) */
  rentPosted: { amount: number; cycle: number } | null
  /** the landlord's wahala arrived with the cycle */
  wahalaArrived: { kind: string; cost: number; note: string } | null
  /** the rent book fell two cycles behind — the notice lands */
  lateNotice: boolean
}

/**
 * One day of the rent book — the store calls this once per day crossing.
 * Cycles post when the day passes the paid-through mark; the wahala rides
 * its cycle's hash; two cycles behind posts the notice (mood + rep ride
 * the store's narration).
 */
export function housingDayRoll(housing: HousingState, day: number): HousingDayResult {
  let next: HousingState = { ...housing }
  let rentPosted: HousingDayResult['rentPosted'] = null
  let wahalaArrived: HousingDayResult['wahalaArrived'] = null
  let lateNotice = false

  if (!next.owned) {
    // every MISSED cycle posts exactly once (a 20-day sleep lands them all)
    while (!next.owned && day > next.lastPostedDay && day >= next.lastPostedDay + H.rentCycleDays) {
      const dueDay = next.lastPostedDay + H.rentCycleDays
      const cycle = Math.floor(dueDay / H.rentCycleDays) + (dueDay % H.rentCycleDays === 0 ? 0 : 1) || Math.round(dueDay / H.rentCycleDays)
      const w = wahalaForCycle(cycle)
      const amount = w?.kind === 'spike' ? Math.round(H.baseRent * 1.15) : H.baseRent
      next = {
        ...next,
        rentOwed: next.rentOwed + amount,
        lastPostedDay: dueDay,
        wahala: w ? { day, kind: w.kind, cost: w.cost, note: w.note } : null,
      }
      rentPosted = { amount, cycle }
      if (w) wahalaArrived = w
    }
    // the notice: two cycles behind and the landlord is done smiling
    if (next.rentOwed >= H.baseRent * 2) {
      next = { ...next, stats: { ...next.stats, cyclesLate: next.stats.cyclesLate + 1 } }
      lateNotice = true
    }
  }

  return { next, rentPosted, wahalaArrived, lateNotice }
}

/** Pay the rent book (one full cycle at a time — the landlord counts). */
export function canPayRent(housing: HousingState, cash: number): { ok: boolean; why: string; amount: number } {
  if (housing.owned) return { ok: false, why: 'You own your roof — the landlord no dey your account again.', amount: 0 }
  if (housing.rentOwed <= 0) return { ok: false, why: 'The rent book is clean — nothing due.', amount: 0 }
  const amount = Math.min(housing.rentOwed, H.baseRent)
  if (cash < amount) return { ok: false, why: `One cycle na ${H.baseRent.toLocaleString()} — your pocket no carry am.`, amount }
  return { ok: true, why: '', amount }
}

export function payRentApply(housing: HousingState, amount: number): HousingState {
  return {
    ...housing,
    rentOwed: Math.max(0, housing.rentOwed - amount),
    rentPaidThrough: housing.rentPaidThrough + H.rentCycleDays,
    stats: { ...housing.stats, rentPaid: housing.stats.rentPaid + amount },
  }
}

/** Settle the live wahala (the cost buys peace for the cycle). */
export function canResolveWahala(housing: HousingState, cash: number): { ok: boolean; why: string; cost: number } {
  if (!housing.wahala) return { ok: false, why: 'The compound is quiet — no wahala today.', cost: 0 }
  if (housing.wahala.cost <= 0) return { ok: false, why: 'This wahala na rent problem — pay the rent book.', cost: 0 }
  if (cash < housing.wahala.cost) return { ok: false, why: `The settlement na ${housing.wahala.cost.toLocaleString()} — your pocket no carry am.`, cost: housing.wahala.cost }
  return { ok: true, why: '', cost: housing.wahala.cost }
}

export function resolveWahalaApply(housing: HousingState): HousingState {
  return {
    ...housing,
    wahala: null,
    stats: { ...housing.stats, wahalaResolved: housing.stats.wahalaResolved + 1 },
  }
}
