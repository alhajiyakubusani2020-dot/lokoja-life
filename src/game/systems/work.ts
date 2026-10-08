/**
 * LOKOJA LIFE — Work System (Stage 3)
 * ------------------------------------
 * The maths behind every shift and hustle: requirement checks,
 * pay calculation, outcome rolls. All pure — the store applies results.
 *
 * Design intent: formal JOBS are reliable (always pay, modest upside),
 * personal HUSTLES are riskier (difficulty vs skill decides success).
 * Different jobs train different skills and pay differently — no two
 * defs are interchangeable.
 */

import { WORK } from '../data/config'
import type { JobDef } from '../data/jobs'
import type { HustleDef } from '../data/hustles'
import { NPC_BY_ID } from '../data/npcs'
import type { PlayerState, Reward, SkillId, WorkOutcome, WorkResult } from '../types'
import { REPUTATION_TIERS } from '../data/config'

export type Rng = () => number

/* ----------------------------- requirements ----------------------------- */

export interface RequirementCheck {
  ok: boolean
  /** human-readable reasons the activity is blocked (already translated to UI voice) */
  reasons: string[]
}

/** Level / skill / reputation gates shared by jobs and hustles. */
export function checkRequirements(
  player: PlayerState,
  req: { minSkills?: Partial<Record<SkillId, number>>; minReputation?: number; minLevel?: number },
): RequirementCheck {
  const reasons: string[] = []

  if (req.minLevel && player.level < req.minLevel) {
    reasons.push(`Unlocks at Level ${req.minLevel}`)
  }
  for (const [skill, min] of Object.entries(req.minSkills ?? {})) {
    if (min && player.skills[skill as SkillId] < min) {
      reasons.push(`Needs ${skill === 'hustle' ? '💪' : skill === 'smart' ? '🧠' : '🗣️'} ${skill} ${min}`)
    }
  }
  if (req.minReputation && player.reputation < req.minReputation) {
    const tier = REPUTATION_TIERS.find((t) => t.threshold === req.minReputation)
    reasons.push(tier ? `Needs “${tier.name}” reputation (${req.minReputation})` : `Needs ${req.minReputation} reputation`)
  }

  return { ok: reasons.length === 0, reasons }
}

/** How many absolute slots until the activity is ready (0 = ready now). */
export function cooldownRemaining(
  cooldowns: Record<string, number>,
  key: string,
  currentAbsSlot: number,
): number {
  const end = cooldowns[key]
  if (!end) return 0
  return Math.max(0, end - currentAbsSlot)
}

/* --------------------------------- pay ---------------------------------- */

/** Mood factor on pay — good vibes earn more, heavy vibes earn less. */
export function moodPayFactor(mood: number): number {
  if (mood >= WORK.moodBonusHigh.threshold) return WORK.moodBonusHigh.factor
  if (mood <= WORK.moodPenaltyLow.threshold) return WORK.moodPenaltyLow.factor
  return 1
}

function roundPay(raw: number): number {
  return Math.max(0, Math.round(raw / WORK.payRounding) * WORK.payRounding)
}

/**
 * Final pay for a job shift: base × skill bonus × mood, rounded.
 * Skills above 1 sharpen the rate — grinding a trade visibly pays.
 */
export function calculateJobPay(job: JobDef, player: PlayerState): number {
  const skillLevel = player.skills[job.skillTraining.skill]
  const skillBonus = 1 + Math.max(0, skillLevel - 1) * WORK.payPerSkillLevel
  return roundPay(job.basePay * skillBonus * moodPayFactor(player.needs.mood))
}

/* ------------------------------- outcomes ------------------------------- */

/** Success chance for a risked hustle: base + skill-vs-difficulty + mood. */
export function hustleSuccessChance(def: HustleDef, player: PlayerState): number {
  const skillLevel = player.skills[def.skill]
  let chance = WORK.baseSuccess + (skillLevel - def.difficulty) * WORK.skillStep
  if (player.needs.mood >= WORK.moodBonusHigh.threshold) chance += WORK.moodChanceBonusHigh
  if (player.needs.mood <= WORK.moodPenaltyLow.threshold) chance -= WORK.moodChancePenaltyLow
  return Math.min(WORK.successClamp.max, Math.max(WORK.successClamp.min, chance))
}

function rollCashRange(min: number, max: number, rng: Rng): number {
  return Math.round(min + rng() * (max - min))
}

/**
 * Resolve a JOB shift. Jobs always pay (reliable work) but a 'great'
 * shift can land for a bonus — outcome flavour, not a lottery.
 */
export function resolveJob(job: JobDef, player: PlayerState, rng: Rng = Math.random): WorkResult {
  let pay = calculateJobPay(job, player)
  const great = rng() < WORK.greatChance
  if (great) pay = roundPay(pay * WORK.greatPayFactor)

  const reward: Reward = {
    cash: pay,
    xp: great ? Math.round(job.xpReward * 1.25) : job.xpReward,
    skillXp: { [job.skillTraining.skill]: job.skillTraining.xp },
    reputation: great ? job.reputationReward + WORK.greatBonusReputation : job.reputationReward,
  }

  return {
    outcome: great ? 'great' : 'good',
    headline: great
      ? `${job.emoji} Excellent shift! The ${job.name.toLowerCase()} work came out sharp.`
      : `${job.emoji} Shift complete — ${job.name} work done.`,
    reward,
    cash: pay,
    skillId: job.skillTraining.skill,
  }
}

/**
 * Resolve a HUSTLE. Skill vs difficulty decides success; success can
 * be 'great' for a premium payout + bonus reputation. Failure still
 * teaches (half XP) and costs mood — the streets keep it honest.
 */
export function resolveHustle(def: HustleDef, player: PlayerState, rng: Rng = Math.random): WorkResult {
  const npc = NPC_BY_ID[def.npcId]
  const chance = hustleSuccessChance(def, player)

  if (rng() >= chance) {
    return {
      outcome: 'fail',
      headline: `The hustle no work out — ${npc?.name ?? 'they'} no smile.`,
      reward: { xp: Math.round(def.reward.xp * WORK.fail.xpFactor) },
      cash: 0,
      skillId: def.skill,
    }
  }

  const great = rng() < WORK.greatChance
  const cash = roundCash(rollCashRange(def.reward.cashMin, def.reward.cashMax, rng) * (great ? WORK.greatPayFactor : 1))
  const reward: Reward = {
    cash,
    xp: great ? Math.round(def.reward.xp * 1.25) : def.reward.xp,
    skillXp: { [def.skill]: def.reward.skillXp },
    reputation: great ? def.reward.reputation + WORK.greatBonusReputation : def.reward.reputation,
  }

  return {
    outcome: great ? 'great' : 'good',
    headline: great
      ? `${npc?.emoji ?? '🙌'} ${npc?.name ?? 'They'} dey super impressed — sharp work!`
      : `${npc?.emoji ?? '🙌'} ${npc?.name ?? 'They'} paid you for the hustle.`,
    reward,
    cash,
    skillId: def.skill,
  }
}

function roundCash(raw: number): number {
  return Math.max(0, Math.round(raw / WORK.payRounding) * WORK.payRounding)
}
