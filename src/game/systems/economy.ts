/**
 * LOKOJA LIFE — Economy System (Stage 3)
 * ---------------------------------------
 * The money layer. Pure, UI-agnostic helpers plus the transaction
 * ledger every earning/spending flow records into.
 *
 * Store actions (addMoney / removeMoney / giveReward) call these —
 * no component ever mutates player.cash directly. The ledger is the
 * same shape a future phone Banking screen will read.
 */

import type { Transaction, TransactionCategory, Reward } from '../types'

/** Can the player afford `amount`? */
export function canAfford(cash: number, amount: number): boolean {
  return cash >= Math.max(0, amount)
}

let txCounter = 0

/**
 * Shape a ledger entry. `id` is overridable so tests can stay deterministic.
 * Newest entries are prepended by the store; the ledger is capped there.
 */
export function recordTransaction(
  label: string,
  category: TransactionCategory,
  amount: number,
  day: number,
  slot: number,
  id?: string,
): Transaction {
  txCounter += 1
  return {
    id: id ?? `tx-${day}-${slot}-${txCounter}`,
    day,
    slot,
    label,
    category,
    amount: Math.round(amount),
  }
}

/** Prepend a transaction, newest first, capped at `cap` entries. */
export function pushTransaction(list: Transaction[], tx: Transaction, cap = 50): Transaction[] {
  return [tx, ...list].slice(0, cap)
}

/** Sum of positive (earned) amounts. */
export function sumEarned(list: Transaction[]): number {
  return list.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
}

/** Sum of negative (spent) amounts, returned positive. */
export function sumSpent(list: Transaction[]): number {
  return list.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
}

/** Ledger entries that happened on the given in-game day. */
export function transactionsOnDay(list: Transaction[], day: number): Transaction[] {
  return list.filter((t) => t.day === day)
}

/** Total cash value inside a reward bundle (0 when absent). */
export function rewardCash(reward: Reward): number {
  return Math.max(0, Math.round(reward.cash ?? 0))
}

/**
 * Human-readable one-line summary of a reward — used by toasts and
 * (later) chat receipts. Reads the SAME reward every system emits.
 */
export function describeReward(reward: Reward): string {
  const parts: string[] = []
  const cash = rewardCash(reward)
  if (cash > 0) parts.push(`+₦${cash.toLocaleString('en-NG')}`)
  if (reward.xp && reward.xp > 0) parts.push(`+${reward.xp} XP`)
  const skillEmoji: Record<string, string> = { hustle: '💪', smart: '🧠', social: '🗣️' }
  for (const [skill, xp] of Object.entries(reward.skillXp ?? {})) {
    if (xp && xp > 0) parts.push(`${skillEmoji[skill] ?? '⭐'}+${xp}`)
  }
  if (reward.reputation && reward.reputation > 0) parts.push(`⭐+${reward.reputation}`)
  return parts.join(' • ')
}
