/**
 * LOKOJA LIFE — M19: THE EXTRAS-FIRST LIVE LEVEL
 * -----------------------------------------------
 * The scene's 2s governor loop (the dynres heartbeat) computes the
 * polish verdict every tick and writes it here; every beauty layer
 * reads it per frame — one small object, zero React churn, zero new
 * timers (THE NO-NEW-TIMER LAW).
 *
 *   level 2 — the full show (what the tier allows)
 *   level 1 — mid polish: half the dust, quieter music kit
 *   level 0 — strip to the floor: dust off, puddles dry, drums out —
 *             and only THEN does dynres start walking resolution down.
 */

import { extrasVerdict, type QualityTier } from './device'

export const extrasLive: { level: 0 | 1 | 2; tier: QualityTier } = {
  level: 2,
  tier: 'mid',
}

/**
 * Called ONLY from the governor's ~2s tick: recompute the verdict from
 * the perf probe's numbers + the dynres direction. The tier argument is
 * the tier ACTUALLY in force (after the player's pick).
 */
export function updateExtrasLevel(tier: QualityTier, p95ms: number | null, dynresDir: 'steady' | 'hot' | 'cool'): void {
  extrasLive.tier = tier
  extrasLive.level = extrasVerdict(tier, p95ms, dynresDir)
}

/* --------------------- M19 — the polish tier gates (pure) -------------------- */

/** dust planes by tier — low structurally receives none (THE TIER GATE LAW) */
export function dustPlaneCount(tier: string, extras: 0 | 1 | 2): number {
  if (tier === 'low') return 0
  if (extras === 0) return 0
  if (extras === 1) return 2
  return tier === 'high' ? 4 : 3
}

/** puddle visibility cap by tier — low sees dry streets, always */
export function puddleCap(tier: string, extras: 0 | 1 | 2): number {
  if (tier === 'low') return 0
  if (extras === 0) return 0
  if (extras === 1) return tier === 'high' ? 7 : 5
  return tier === 'high' ? 14 : 9
}

/** how wet the streets are from the live weather (0..1 — puddle opacity driver) */
export function wetnessFor(weather: string): number {
  if (weather === 'storm' || weather === 'flood') return 1
  if (weather === 'rain') return 0.8
  return 0
}

/** the dust target opacity for a tier under the current extras level */
export function dustOpacityTarget(tier: string, extras: 0 | 1 | 2, harmattan: boolean): number {
  const tierCap = tier === 'high' ? 0.34 : 0.26
  const stress = extras === 2 ? 1 : extras === 1 ? 0.5 : 0
  return harmattan ? tierCap * stress : 0
}
