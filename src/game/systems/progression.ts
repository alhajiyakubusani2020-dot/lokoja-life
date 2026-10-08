/**
 * LOKOJA LIFE — Progression System
 * ---------------------------------
 * XP curve, level-ups and reputation tiers.
 * Pure functions so they are trivially testable and reusable
 * by jobs, hustles, missions and events in later stages.
 */

import { PROGRESSION, REPUTATION_TIERS } from '../data/config'

/** XP required to advance FROM `level` TO `level + 1`. */
export function xpToNextLevel(level: number): number {
  return Math.round(PROGRESSION.xpBase * Math.pow(level, PROGRESSION.xpGrowth))
}

export interface LevelUpResult {
  xp: number
  level: number
  leveledUp: boolean
  levelsGained: number
}

/**
 * Add XP and process level-ups (with overflow carry).
 * Level cap is enforced from config.
 */
export function addXp(xp: number, level: number, amount: number): LevelUpResult {
  let newLevel = level
  let newXp = xp + Math.max(0, amount)

  let leveledUp = false
  let levelsGained = 0

  while (newLevel < PROGRESSION.maxLevel && newXp >= xpToNextLevel(newLevel)) {
    newXp -= xpToNextLevel(newLevel)
    newLevel += 1
    leveledUp = true
    levelsGained += 1
  }

  if (newLevel >= PROGRESSION.maxLevel) {
    newXp = Math.min(newXp, xpToNextLevel(PROGRESSION.maxLevel) - 1)
  }

  return { xp: newXp, level: newLevel, leveledUp, levelsGained }
}

/** Maximum a skill can reach at the given level. */
export function skillCap(level: number): number {
  return PROGRESSION.skillCapBase + level * PROGRESSION.skillCapPerLevel
}

/** Current reputation tier for the given reputation value. */
export function reputationTier(reputation: number) {
  let current: (typeof REPUTATION_TIERS)[number] = REPUTATION_TIERS[0]
  for (const tier of REPUTATION_TIERS) {
    if (reputation >= tier.threshold) current = tier
  }
  return current
}

/** Next reputation tier + how far away it is (null = top tier reached). */
export function nextReputationTier(reputation: number) {
  for (const tier of REPUTATION_TIERS) {
    if (reputation < tier.threshold) {
      return { tier, remaining: tier.threshold - reputation }
    }
  }
  return null
}

/** Format Naira the Lokoja Life way: ₦12,500 */
export function formatNaira(amount: number): string {
  const sign = amount < 0 ? '-' : ''
  const abs = Math.abs(Math.round(amount))
  return `${sign}₦${abs.toLocaleString('en-NG')}`
}
