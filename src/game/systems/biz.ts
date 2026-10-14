/**
 * LOKOJA LIFE — Business System (M3 — OWN THE CITY)
 * --------------------------------------------------
 * Pure, deterministic, UI-agnostic rules for the player's businesses.
 * Every shop sits at a real Lokoja location, earns into a till the player
 * must SHOW UP to empty, and plugs into the M2 civic mesh:
 *   - Kpata/Food-Strip shops follow that market's DAILY multiplier (the same
 *     engine that moves meal prices) — market days are your discount days
 *     AND your busy days.
 *   - Non-market shops (Ganaja kiosk, motor-park okada stand) wobble inside
 *     a small seeded daily band instead.
 *   - Reputation buys customers: +1% income per 100 rep above 500 (capped).
 *   - Every fridge you own loads the NEPA meter (config: BIZ.nepaLoadPerBiz).
 *   - Collected income flows through addMoney → the ledger → stats.totalEarned,
 *     so KGIRS assesses business income with ZERO extra tax code.
 *
 * Day rolls run inside the store's commitCivicDays (same seam as bills and
 * taxes) so sleeping, travelling and time-skips all accrue exactly once.
 */

import type { BusinessState, ChaosState, CivicState, ShopUpgradeId } from '../types'
import { BIZ, CHAOS } from '../data/config'
import { civicHash, marketForDay } from './civic'
import { blackoutAt, isScarcityDay } from './chaos'

export type BizTypeId = string

export interface BizTypeDef {
  name: string
  locationId: string
  emoji: string
  buyCost: number
  baseIncome: number
  unlockLevel: number
  blurb: string
  marketId: string | null
  /** M8 — runs a payment terminal: cash-scarcity days lift its take */
  pos?: boolean
}

export const BIZ_TYPES: Record<string, BizTypeDef> = BIZ.types
export const BIZ_TYPE_IDS = Object.keys(BIZ.types)

export function bizDef(typeId: string): BizTypeDef | null {
  return (BIZ.types as Record<string, BizTypeDef>)[typeId] ?? null
}

/** The biz type hosted at a location (one per location, or null). */
export function bizAtLocation(locationId: string): { typeId: string; def: BizTypeDef } | null {
  for (const [typeId, def] of Object.entries(BIZ.types as Record<string, BizTypeDef>)) {
    if (def.locationId === locationId) return { typeId, def }
  }
  return null
}

/* ------------------------------- shop creation ------------------------------ */

/** A brand-new level-1 shop with an empty till (and nobody on the payroll). */
export function freshBusiness(typeId: string, day: number): BusinessState {
  return {
    id: typeId,
    typeId,
    level: 1,
    accrued: 0,
    lastAccrualDay: day,
    openedDay: day,
    lastCollectedAt: null,
    staff: 0,
    upgrades: [],
  }
}

/* ------------------------------ M5 — staff & power ----------------------------- */

/** Attendants a shop at `level` can carry: one per level (1–5). */
export function staffCapFor(level: number): number {
  return Math.min(Math.max(1, Math.floor(level)), BIZ.maxLevel)
}

/** Does this shop keep its own light when NEPA cuts the city? */
export function hasPowerBackup(upgrades: ShopUpgradeId[]): boolean {
  return upgrades.includes('generator') || upgrades.includes('solar')
}

/** Does this shop RUN a generator (burns fuel on dark days — solar does not)? */
export function hasGenerator(upgrades: ShopUpgradeId[]): boolean {
  return upgrades.includes('generator')
}

/* --------------------------------- income law -------------------------------- */

/** Reputation → customer pull: +1% income per `repBonusDivisor` rep above the
 *  base (so 1000 rep over = +10%), hard-capped at `repBonusCap`. */
export function bizRepBonus(reputation: number): number {
  const over = Math.max(0, reputation - BIZ.repBonusBase)
  return Math.min(BIZ.repBonusCap, over / BIZ.repBonusDivisor / 100)
}

/** Level multiplier: ×(1 + step × (level−1)), level clamped to maxLevel. */
export function bizLevelMult(level: number): number {
  const lvl = Math.min(Math.max(1, Math.floor(level)), BIZ.maxLevel)
  return 1 + BIZ.levelIncomeStep * (lvl - 1)
}

/**
 * The day's multiplier for one shop. Market shops read the SAME daily
 * multiplier the meal board shows (market-day discount included); other
 * shops wobble inside a small seeded band. Deterministic per (type, day).
 */
export function bizDayMult(typeId: string, day: number, civic: CivicState): number {
  const def = bizDef(typeId)
  if (!def) return 1
  if (def.marketId) {
    const rolled = marketForDay(civic, day)
    let mult = rolled.market.prices[def.marketId] ?? 1
    if (rolled.market.marketDay) mult *= 1 / 0.9 // market day: cheap goods, BUSY shop
    return mult
  }
  const u = (civicHash('biz', typeId, day) % 1000) / 1000
  return 1 - BIZ.wobbleBand + u * 2 * BIZ.wobbleBand
}

/** One shop's income for one specific day, rounded to the naira.
 *  M5 — `opts` carries the shop's staff and power installs: each attendant
 *  lifts income by BIZ.staffIncomeBoost, and a shop caught dark by
 *  load-shedding (no generator/solar) earns BIZ.sheddingIncomeFactor of
 *  the normal take. Omitted opts = the plain M3 law, untouched.
 *  M8 — `chaos` threads the CHAOS ENGINE through the same law: a BLACKOUT
 *  zone (transformer down — harsher than shedding) crushes an un-backed
 *  shop to CHAOS.blackoutIncomeFactor, a cash-scarcity day multiplies a
 *  POS shop's take by CHAOS.posBoostMult. Omitted chaos = M5 law exactly. */
export function bizIncomeFor(
  typeId: string,
  level: number,
  day: number,
  civic: CivicState,
  reputation: number,
  opts?: { staff?: number; upgrades?: ShopUpgradeId[]; chaos?: ChaosState; floodFactor?: number },
): number {
  const def = bizDef(typeId)
  if (!def) return 0
  const staff = Math.max(0, Math.floor(opts?.staff ?? 0))
  const upgrades = opts?.upgrades ?? []
  const chaos = opts?.chaos ?? null
  const dark = civic.nepa.shedding && !hasPowerBackup(upgrades)
  const blackedOut = chaos ? blackoutAt(chaos, def.locationId, day) : false
  const posBoost = chaos && def.pos === true && isScarcityDay(day) ? CHAOS.posBoostMult : 1
  const staffMult = 1 + staff * BIZ.staffIncomeBoost
  // M11 — the flood crush folds with the grid laws: the WORSE water wins
  // (a generator keeps the lights on but cannot keep the river out)
  const powerMult = blackedOut && !hasPowerBackup(upgrades)
    ? CHAOS.blackoutIncomeFactor
    : dark
      ? BIZ.sheddingIncomeFactor
      : 1
  const waterMult = Math.min(powerMult === 1 ? 1 : powerMult, opts?.floodFactor ?? 1)
  return Math.max(
    0,
    Math.round(
      def.baseIncome *
        bizLevelMult(level) *
        bizDayMult(typeId, day, civic) *
        (1 + bizRepBonus(reputation)) *
        staffMult *
        waterMult *
        posBoost,
    ),
  )
}

/**
 * M8 — the generator's honest appetite: a shop RUNNING A GENERATOR inside a
 * blackout zone burns this much fuel per dark day (drawn from the till like
 * a wage). Solar shops drink sunlight and pay nothing.
 */
export function bizGeneratorFuelFor(
  typeId: string,
  day: number,
  upgrades: ShopUpgradeId[],
  chaos: ChaosState | null,
): number {
  if (!chaos || !hasGenerator(upgrades)) return 0
  const def = bizDef(typeId)
  if (!def) return 0
  return blackoutAt(chaos, def.locationId, day) ? CHAOS.generatorFuelPerDay : 0
}

/* ---------------------------------- upgrades --------------------------------- */

/** Cost of the NEXT level for a shop at `level` (null at max). */
export function bizUpgradeCost(typeId: string, level: number): number | null {
  const def = bizDef(typeId)
  if (!def || level >= BIZ.maxLevel) return null
  return Math.round(def.buyCost * BIZ.upgradeCostMult * level)
}

/* ---------------------------------- day roll --------------------------------- */

export interface BizDayResult {
  next: BusinessState[]
  /** income accrued per typeId across the elapsed days */
  earned: Record<string, number>
  total: number
}

/**
 * Accrue income for every owned shop across the elapsed days (prevDay, newDay].
 * The accrual cap applies per shop from its OWN lastAccrualDay: after
 * `accrualCapDays` unattended days the till stops growing — the city moves
 * on, go show your face. Rolling the same day twice is a no-op (idempotent).
 * M5 — each attendant's daily wage (BIZ.staffWagePerDay) is paid out of the
 * day's take BEFORE it lands in the till; a day that nets ≤0 still marks
 * the shop as accrued-through so a re-roll can never double-charge wages.
 * M8 — a generator inside a blackout zone burns CHAOS.generatorFuelPerDay
 * of the till per dark day, the same honest way.
 */
export function bizDayRoll(
  list: BusinessState[],
  prevDay: number,
  newDay: number,
  civic: CivicState,
  reputation: number,
  chaos?: ChaosState,
  floodFactorFor?: (locationId: string, day: number) => number,
): BizDayResult {
  const earned: Record<string, number> = {}
  let total = 0
  const next = list.map((biz) => {
    if (newDay <= prevDay || newDay <= biz.lastAccrualDay) return biz
    const from = Math.max(prevDay + 1, biz.lastAccrualDay + 1)
    const cappedFrom = Math.max(from, newDay - BIZ.accrualCapDays + 1)
    const wages = Math.max(0, biz.staff) * BIZ.staffWagePerDay
    let sum = 0
    for (let day = cappedFrom; day <= newDay; day++) {
      const gross = bizIncomeFor(biz.typeId, biz.level, day, civic, reputation, {
        staff: biz.staff,
        upgrades: biz.upgrades,
        chaos,
        floodFactor: floodFactorFor ? floodFactorFor(bizDef(biz.typeId)?.locationId ?? '', day) : 1,
      })
      const genFuel = bizGeneratorFuelFor(biz.typeId, day, biz.upgrades, chaos ?? null)
      sum += Math.max(0, gross - wages - genFuel)
    }
    // advance the accrual marker even on a wiped-out day (idempotence law)
    const marked: BusinessState = { ...biz, lastAccrualDay: newDay }
    if (sum <= 0) return marked
    earned[biz.typeId] = (earned[biz.typeId] ?? 0) + sum
    total += sum
    return { ...marked, accrued: biz.accrued + sum }
  })
  return { next, earned, total }
}

/* --------------------------------- till laws --------------------------------- */

/** Empty the till (returns the withdrawn amount and the emptied shop). */
export function bizCollect(biz: BusinessState, day: number): { next: BusinessState; amount: number } {
  const amount = Math.max(0, Math.round(biz.accrued))
  return { next: { ...biz, accrued: 0, lastCollectedAt: Date.now(), lastAccrualDay: day }, amount }
}

/** Owned biz entry for a type (or null). */
export function bizOwned(list: BusinessState[], typeId: string): BusinessState | null {
  return list.find((b) => b.typeId === typeId) ?? null
}
