/**
 * LOKOJA LIFE — 3D World System (Stage 3D increment 2)
 * ------------------------------------------------------
 * The ONE pure bridge between physical walking in the 3D world and
 * the authoritative needs economy. Deterministic, dependency-free,
 * fully unit-tested (scripts/test-world3d.ts).
 *
 * Design rule (Stage 3D brief §4): presentation may MEASURE, but only
 * the store may APPLY. Components accumulate metres; this system turns
 * metres into an energy cost from config; the store applies it through
 * the existing needs engine. No second clock, no ledger duplication.
 */

import { WORLD3D } from '../data/config'

/**
 * Energy cost for a stretch of walking, in whole energy points.
 * - 0 below the free-stroll allowance
 * - 1 energy per ~182 m thereafter (energyPer100m), rounded
 * - hard-capped per world visit so idle walking can never starve the player
 */
export function walkingEnergyCost(meters: number): number {
  if (!Number.isFinite(meters) || meters <= 0) return 0
  const billable = Math.max(0, meters - WORLD3D.freeMeters)
  if (billable === 0) return 0
  const raw = (billable / 100) * WORLD3D.energyPer100m
  return Math.min(WORLD3D.maxEnergyPerVisit, Math.max(1, Math.round(raw)))
}

/** Human sentence for the toast — lives here so UI stays dumb. */
export function describeWalkSettle(meters: number, cost: number): string | null {
  if (cost <= 0) return null
  const km = (meters / 1000).toFixed(1)
  return `Long trek around Lokoja (${km} km on foot)`
}
