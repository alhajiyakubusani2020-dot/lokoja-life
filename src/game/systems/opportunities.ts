/**
 * LOKOJA LIFE — Opportunity System (Stage 3)
 * -------------------------------------------
 * THE core opportunity architecture. Opportunities are plain data with
 * stable ids, a source, a real location id, requirements, reward and
 * expiry — deliberately NOT coupled to any UI.
 *
 * Flow today:  hustles.ts data → generateHustleOffers() → offer instance
 *              → player accepts → player.activeOpportunities → resolve at
 *              the location (systems/work.ts rolls the outcome).
 * Flow tomorrow: NPC → phone chat → gist → THE SAME opportunity shape →
 *              map/3D world → activity → reward. Nothing here changes.
 */

import { HUSTLE } from '../data/config'
import { HUSTLE_BY_ID, type HustleDef } from '../data/hustles'
import { JOB_BY_ID, type JobDef } from '../data/jobs'
import type { ActiveOpportunity, PlayerState, WorkResult } from '../types'
import { checkRequirements, cooldownRemaining, resolveHustle, type Rng } from './work'

/* ------------------------------- instances ------------------------------- */

/** Build a unique opportunity instance from a hustle def. */
export function makeOpportunityInstance(
  def: HustleDef,
  currentAbsSlot: number,
): ActiveOpportunity {
  return {
    instanceId: `${def.id}@${currentAbsSlot}`,
    defId: def.id,
    type: 'hustle',
    source: def.source,
    npcId: def.npcId,
    locationId: def.locationId,
    acceptedAtSlot: currentAbsSlot,
    expiresAtSlot: currentAbsSlot + HUSTLE.expirySlots,
  }
}

/** A hustle def is only offerable if the player qualifies right now. */
export function isEligible(
  def: HustleDef,
  player: PlayerState,
  currentAbsSlot: number,
  active: ActiveOpportunity[],
): boolean {
  // already carrying this exact hustle — no duplicate stacking
  if (active.some((o) => o.defId === def.id)) return false
  // personal cooldown after finishing this hustle
  if (cooldownRemaining(player.cooldowns, def.id, currentAbsSlot) > 0) return false
  // level / skill / reputation gates
  return checkRequirements(player, def.requirements).ok
}

/* ------------------------------- generation ------------------------------ */

export interface OfferGeneration {
  /** fresh, un-accepted opportunity instances (transient — shown once) */
  offers: ActiveOpportunity[]
  /** true when the search came up empty (street was dry) */
  dry: boolean
}

/**
 * Generate hustle offers for a location. Weighted random pick without
 * replacement; respects requirements, active duplicates, per-hustle
 * cooldowns and the configured dry-chance. `rng` is injectable for tests.
 */
export function generateHustleOffers(
  locationId: string,
  player: PlayerState,
  currentAbsSlot: number,
  rng: Rng = Math.random,
): OfferGeneration {
  const pool = Object.values(HUSTLE_BY_ID).filter(
    (def) => def.locationId === locationId && isEligible(def, player, currentAbsSlot, player.activeOpportunities),
  )
  if (pool.length === 0 || rng() < HUSTLE.dryChance) {
    return { offers: [], dry: true }
  }

  const count = Math.min(HUSTLE.maxPerSearch, pool.length, 1 + (rng() < 0.5 ? 1 : 0))

  const offers: ActiveOpportunity[] = []
  const remaining = [...pool]
  for (let i = 0; i < count && remaining.length > 0; i++) {
    const total = remaining.reduce((s, d) => s + d.weight, 0)
    let roll = rng() * total
    let picked = remaining[remaining.length - 1]
    for (const def of remaining) {
      roll -= def.weight
      if (roll <= 0) {
        picked = def
        break
      }
    }
    offers.push(makeOpportunityInstance(picked, currentAbsSlot))
    remaining.splice(remaining.indexOf(picked), 1)
  }

  return { offers, dry: offers.length === 0 }
}

/* -------------------------------- expiry --------------------------------- */

/** Split active opportunities into still-valid and gone-cold lists. */
export function pruneExpiredOpportunities(
  active: ActiveOpportunity[],
  currentAbsSlot: number,
): { kept: ActiveOpportunity[]; expired: ActiveOpportunity[] } {
  const kept: ActiveOpportunity[] = []
  const expired: ActiveOpportunity[] = []
  for (const o of active) {
    ;(o.expiresAtSlot > currentAbsSlot ? kept : expired).push(o)
  }
  return { kept, expired }
}

/* ------------------------------- resolution ------------------------------ */

/** Look up the hustle def behind an opportunity instance (defensively). */
export function hustleDefFor(instance: ActiveOpportunity): HustleDef | null {
  return HUSTLE_BY_ID[instance.defId] ?? null
}

/**
 * Resolve an accepted hustle opportunity. Kept in the opportunity system
 * (not the store) so future entry points — phone, NPC chat, 3D world —
 * resolve identically.
 */
export function resolveOpportunity(
  instance: ActiveOpportunity,
  player: PlayerState,
  rng: Rng = Math.random,
): WorkResult | null {
  const def = hustleDefFor(instance)
  if (!def) return null
  return resolveHustle(def, player, rng)
}

/* --------------------------- job-board helpers --------------------------- */

/**
 * Jobs ARE opportunities too (source: 'board'). This adapter lets any
 * future surface — phone job feed, NPC tip, 3D building — present a
 * JobDef through the same opportunity language.
 */
export function jobAsOpportunityMeta(job: JobDef) {
  return {
    defId: job.id,
    type: 'job' as const,
    source: 'board' as const,
    locationId: job.locationId,
    npcId: null,
  }
}

/** Is the job's cooldown still running? (keyed by job id) */
export function jobCooldownRemaining(
  job: JobDef,
  player: PlayerState,
  currentAbsSlot: number,
): number {
  return cooldownRemaining(player.cooldowns, job.id, currentAbsSlot)
}

/** Instance id generator for accepted-job bookkeeping (future use). */
export function jobIdForSlot(job: JobDef, currentAbsSlot: number): string {
  return `${job.id}@${currentAbsSlot}`
}

/** Keep activeOpportunities tidy when data changes between versions. */
export function filterValidInstances(active: ActiveOpportunity[]): ActiveOpportunity[] {
  return active.filter((o) => (o.type === 'hustle' ? !!HUSTLE_BY_ID[o.defId] : !!JOB_BY_ID[o.defId]))
}
