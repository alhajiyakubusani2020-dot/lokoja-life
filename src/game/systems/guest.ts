/**
 * LOKOJA LIFE — M9: THE GUEST LOOP (pure rules)
 * ----------------------------------------------
 * Play first, login to continue. Every new user plays INSTANTLY as a
 * guest — no wall, no form. The GATE fires only when they try to move
 * forward past the starter environment: a friendly "Lokoja knows your
 * face. Claim your name to keep going." with a one-day grace when they
 * ask for it ("Maybe later" buys the rest of TODAY — never a dead end).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. The network
 *    lives in the API routes; the merge law lives here so no surface can
 *    disagree about what "never lose progress" means.
 *  - The merge law: the FURTHER save wins by (day, then totalEarned);
 *    the loser is KEPT as a backup, never deleted. Nobody ever loses
 *    a single naira to the guest loop.
 */

import type { AccountState, GameSave, OnboardingState } from '../types'

/* ------------------------------ fresh slices -------------------------------- */

/** A fresh account line: an unlinked guest with the whole city to earn. */
export function freshAccountState(): AccountState {
  return { linked: false, handle: null, token: null, ageBand: null, gateGraceDay: 0 }
}

/** A fresh onboarding arc: nothing done, nothing rewarded. */
export function freshOnboardingState(): OnboardingState {
  return { done: [], rewarded: false }
}

/* ------------------------------ starter zone -------------------------------- */

/** The starter environment: the three zones a guest roams free forever. */
export const STARTER_ZONE_IDS: readonly string[] = ['home', 'kpata-market', 'ganaja-junction']

export function inStarterZone(locationId: string): boolean {
  return STARTER_ZONE_IDS.includes(locationId)
}

/* ---------------------------------- gate law -------------------------------- */

export interface GateVerdict {
  /** true = the gate stands (travel refused until claimed or graced) */
  blocked: boolean
  /** 'claim' = the gate modal; 'graced' = they asked for today, let them pass */
  reason: 'claim' | 'graced'
}

/**
 * Should the gate stand before THIS travel? Linked accounts never see it;
 * the starter trio is free forever; anywhere else fires the gate once per
 * in-game day (the grace marks the day they chose "Maybe later").
 */
export function gateVerdict(account: AccountState, destinationId: string, day: number): GateVerdict {
  if (account.linked) return { blocked: false, reason: 'graced' }
  if (inStarterZone(destinationId)) return { blocked: false, reason: 'graced' }
  if (account.gateGraceDay === day) return { blocked: false, reason: 'graced' }
  return { blocked: true, reason: 'claim' }
}

/** Accept the grace: today is free, tomorrow the gate stands again. */
export function applyGrace(account: AccountState, day: number): AccountState {
  return { ...account, gateGraceDay: day }
}

/* --------------------------------- validators -------------------------------- */

/** 3–16 characters: letters, numbers, underscore — a street name, not a handle. */
export function validateHandle(handle: string): { ok: boolean; why: string } {
  const h = handle.trim()
  if (h.length < 3 || h.length > 16) return { ok: false, why: 'Name must be 3–16 characters.' }
  if (!/^[a-zA-Z0-9_]+$/.test(h)) return { ok: false, why: 'Letters, numbers and underscore only.' }
  return { ok: true, why: '' }
}

/** 4–8 digits — a PIN, not a password (kids can remember it too). */
export function validatePin(pin: string): { ok: boolean; why: string } {
  if (!/^\d{4,8}$/.test(pin)) return { ok: false, why: 'PIN must be 4–8 digits.' }
  return { ok: true, why: '' }
}

/** A phone number or an email — the recovery line. */
export function validateContact(contact: string): { ok: boolean; why: string } {
  const c = contact.trim()
  if (/^\+?\d{7,15}$/.test(c)) return { ok: true, why: '' }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return { ok: true, why: '' }
  return { ok: false, why: 'Enter a phone number or an email.' }
}

export type AgeBand = 'kid' | 'teen' | 'adult'

/** The honest age band from a birth year (kids never walk the adult road). */
export function ageBandForYear(birthYear: number, nowYear: number): AgeBand | null {
  const age = nowYear - birthYear
  if (age < 6 || age > 120) return null
  if (age <= 12) return 'kid'
  if (age <= 17) return 'teen'
  return 'adult'
}

/* ---------------------------------- merge law -------------------------------- */

export interface MergeVerdict {
  /** the save that continues the game */
  winner: 'cloud' | 'local'
  /** why it won — shown honestly in the account sheet */
  why: string
  /** the loser's payload (kept as a backup slot, never deleted) */
  backup: GameSave | null
}

/** Progress distance: the day leads, the ledger breaks ties. */
function progressScore(save: GameSave): number {
  return save.world.day * 1_000_000_000 + Math.min(save.player.stats.totalEarned, 999_999_999)
}

/**
 * THE MERGE LAW — never lose progress. The cloud save and the device's
 * guest save are compared by (day, totalEarned); the further one wins and
 * the other is returned as a backup payload for the backup slot. Ties
 * (same day AND earnings) keep the cloud — it is the portable one.
 */
export function mergeVerdict(local: GameSave, cloud: GameSave): MergeVerdict {
  const l = progressScore(local)
  const c = progressScore(cloud)
  if (l > c) return { winner: 'local', why: `This device is further (Day ${local.world.day} vs Day ${cloud.world.day}) — your guest hustle stays.`, backup: cloud }
  return { winner: 'cloud', why: `Your cloud save is further (Day ${cloud.world.day} vs Day ${local.world.day}) — it continues. This device's progress is kept as a backup.`, backup: local }
}

/** The backup slot key — one slot, overwritten only when a NEWER backup lands. */
export const BACKUP_KEY = 'lokoja-life:backup'

export function backupPayload(save: GameSave): string {
  return JSON.stringify({ ...save, savedAs: 'backup', backupAt: Date.now() })
}
