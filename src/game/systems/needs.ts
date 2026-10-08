/**
 * LOKOJA LIFE — Needs Engine
 * ---------------------------
 * Pure functions that apply changes to the four player needs.
 * The store calls these; UI never mutates needs directly.
 * Design rule: consequences should push the player to manage needs
 * without making the game frustrating.
 */

import { NEEDS } from '../data/config'
import type { Needs } from '../types'

/** Clamp a single need value into the valid range. */
export function clampNeed(value: number): number {
  return Math.max(NEEDS.min, Math.min(NEEDS.max, value))
}

/** Clamp a whole needs object. */
export function clampNeeds(needs: Needs): Needs {
  return {
    health: clampNeed(needs.health),
    energy: clampNeed(needs.energy),
    hunger: clampNeed(needs.hunger),
    mood: clampNeed(needs.mood),
  }
}

/**
 * Apply a partial delta to needs and clamp the result.
 * Also applies the built-in consequences:
 *  - hungry (hunger <= critical): mood drains per action
 *  - starving (hunger == 0): health drains per action
 */
export function applyNeedsDelta(current: Needs, delta: Partial<Needs>): Needs {
  const merged: Needs = {
    health: current.health + (delta.health ?? 0),
    energy: current.energy + (delta.energy ?? 0),
    hunger: current.hunger + (delta.hunger ?? 0),
    mood: current.mood + (delta.mood ?? 0),
  }

  // --- built-in consequences ---
  if (merged.hunger <= NEEDS.hungerCritical) {
    merged.mood -= NEEDS.hungryMoodDrain
  }
  if (merged.hunger <= NEEDS.min) {
    merged.health -= NEEDS.starvingHealthDrain
  }

  return clampNeeds(merged)
}

/** Can the player perform a strenuous activity (work, long walk)? */
export function canDoStrenuous(needs: Needs): boolean {
  return needs.energy > NEEDS.energyCritical
}

/** One-line human summary of the player's condition, for HUD hints. */
export function conditionSummary(needs: Needs): { text: string; tone: 'good' | 'ok' | 'bad' } {
  if (needs.health <= 15) return { text: 'You need to see a doctor…', tone: 'bad' }
  if (needs.hunger <= NEEDS.hungerCritical) return { text: 'Your belle is empty. Find food!', tone: 'bad' }
  if (needs.energy <= NEEDS.energyCritical) return { text: 'You are tired. Rest small.', tone: 'bad' }
  if (needs.mood <= 25) return { text: 'You dey feel down. Do something fun.', tone: 'ok' }
  if (needs.hunger >= 80 && needs.energy >= 80 && needs.mood >= 80) {
    return { text: 'You are glowing today! 🔥', tone: 'good' }
  }
  return { text: 'You dey okay. Keep pushing.', tone: 'ok' }
}
