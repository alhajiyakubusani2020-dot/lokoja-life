/**
 * LOKOJA LIFE — Skills System (Stage 3)
 * --------------------------------------
 * Skill level + skill XP + progression toward the next skill point.
 * Pure functions — the store applies the results, UI only displays.
 *
 * Caps grow with player level (PROGRESSION.skillCap*) so skills track
 * the player's overall stage in life. Excess XP banks until the cap
 * rises — nothing is lost, nothing is exploitable.
 */

import { PROGRESSION } from '../data/config'
import type { SkillId, Skills, SkillXpMap } from '../types'

/** XP needed to gain ONE skill level (from central config). */
export function skillXpToNext(): number {
  return PROGRESSION.skillXpPerPoint
}

export interface SkillProgressResult {
  skillXp: SkillXpMap
  skills: Skills
  leveledUp: boolean
  newLevel: number
  /** capped at max — extra XP is banking for when the cap rises */
  capped: boolean
}

/**
 * Add XP to one skill and convert it into skill levels.
 * Level-ups respect the player-level cap; XP beyond the cap banks.
 */
export function addSkillXp(
  skillXp: SkillXpMap,
  skills: Skills,
  playerLevel: number,
  skill: SkillId,
  amount: number,
): SkillProgressResult {
  const cap = PROGRESSION.skillCapBase + playerLevel * PROGRESSION.skillCapPerLevel
  const perPoint = PROGRESSION.skillXpPerPoint

  let xp = Math.max(0, skillXp[skill]) + Math.max(0, amount)
  let level = skills[skill]
  let leveledUp = false

  while (level < cap && xp >= perPoint) {
    xp -= perPoint
    level += 1
    leveledUp = true
  }

  const capped = level >= cap && xp >= perPoint
  if (capped) xp = perPoint // show a full bar while capped

  return {
    skillXp: { ...skillXp, [skill]: xp },
    skills: { ...skills, [skill]: level },
    leveledUp,
    newLevel: level,
    capped,
  }
}

/** Which skill colour/emoji a SkillId maps to (UI-neutral metadata). */
export const SKILL_META: Record<SkillId, { label: string; emoji: string }> = {
  hustle: { label: 'Hustle', emoji: '💪' },
  smart: { label: 'Smart', emoji: '🧠' },
  social: { label: 'Social', emoji: '🗣️' },
}
