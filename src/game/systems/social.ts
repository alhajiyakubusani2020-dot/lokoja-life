/**
 * LOKOJA LIFE — Social System (Stage 5)
 * ---------------------------------------
 * Pure functions for the familiarity/relationship track. No UI, no
 * side effects — the store applies results, components only read.
 *
 * Model: every NPC has familiarity 0–100. Talking once per in-game day
 * moves it up. Tiers unlock warmer chat lines (data/npcChat.ts) and a
 * documented hustle-offer perk hook for the opportunities system.
 */

import type { RelationshipState } from '../types'
import type { FamiliarityTier } from '../data/npcChat'

/** Familiarity thresholds (>= min, < next). */
export const TIERS: ReadonlyArray<{ tier: FamiliarityTier; min: number }> = [
  { tier: 'stranger', min: 0 },
  { tier: 'acquaintance', min: 15 },
  { tier: 'paddy', min: 40 },
  { tier: 'close-paddy', min: 75 },
]

export const TIER_META: Record<FamiliarityTier, { label: string; perk: string; offerBonus: number }> = {
  stranger: { label: 'Stranger', perk: 'They still dey size you up.', offerBonus: 0 },
  acquaintance: { label: 'Acquaintance', perk: 'Small gist, small trust.', offerBonus: 0.05 },
  paddy: { label: 'Paddy', perk: 'Real paddy — better offers pass your way.', offerBonus: 0.1 },
  'close-paddy': { label: 'Close Paddy', perk: 'Day-one. Doors open for you.', offerBonus: 0.15 },
}

/** Chat with the same NPC is gated to once per in-game day. */
export const CHAT_COOLDOWN_DAYS = 1

/** Familiarity gained per chat (a touch more once you're already paddy). */
export function chatGain(familiarity: number): number {
  return familiarity >= 40 ? 8 : 6
}

/** Can the player chat with this NPC today? */
export function canChat(state: RelationshipState | undefined, today: number): boolean {
  if (!state) return true
  return today > state.lastChatDay
}

export function tierFor(familiarity: number): FamiliarityTier {
  let current: FamiliarityTier = 'stranger'
  for (const t of TIERS) {
    if (familiarity >= t.min) current = t.tier
  }
  return current
}

export function relationshipFor(
  relationships: Record<string, RelationshipState>,
  npcId: string,
): RelationshipState {
  return relationships[npcId] ?? { familiarity: 0, lastChatDay: 0 }
}

/** Pick a deterministic-feeling chat line (alternates by count, not random — replayable and testable). */
export function pickLine<T>(lines: T[], familiarity: number, today: number): T {
  return lines[(familiarity + today) % lines.length]
}

/**
 * The state after one chat — pure, returns a NEW object.
 */
export function afterChat(state: RelationshipState, today: number): RelationshipState {
  return {
    familiarity: Math.min(100, state.familiarity + chatGain(state.familiarity)),
    lastChatDay: today,
  }
}

/** Deterministic 0–1 roll for flavour checks (day+npc scoped, testable). */
export function dayRoll(npcId: string, day: number): number {
  let h = 2166136261
  const key = `${npcId}:${day}`
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}
