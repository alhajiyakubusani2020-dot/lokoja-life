/**
 * LOKOJA LIFE — M24 W6: THE LEDGER LAWS (pure)
 * =============================================
 * The server door's money laws — PURE functions, zero I/O, zero UI —
 * imported VERBATIM by BOTH doors (the nation-wire socket service AND
 * the /api/live/action relay door), same doctrine as live.ts and
 * socialgraph.ts. Zero copies, zero drift by construction.
 *
 * THE HONESTY CLAUSE (plan §3.4, unchanged): in-game naira only, forever.
 * Real P2P money transmission in Nigeria = CBN PSP-license territory;
 * we do not touch it. This is a game purse with a fortress book.
 *
 * THE ARCHITECTURE LAW: the POCKET is the save's money (the client's
 * honest engine — jobs, markets, the whole solo economy). The PURSE is
 * the server's money (WalletRow) — the only balance P2P transfers can
 * draw from, so the server fully controls every naira that moves
 * person-to-person and N8 ("₦500 moves exactly once") becomes structure,
 * not hope. Deposits (pocket→purse) are client-declared through the
 * honest engine; the server never credits more than was deposited and
 * every spend side (withdraw/transfer) answers to the PIN.
 *
 * LAWS OF THIS FILE:
 *  - THE MINOR BLOCK (M13 at the money door): kid/teen accounts refuse
 *    EVERY purse verb — structurally, at the server door. Minors collect
 *    nothing, receive nothing. The M13 wall ends arguments.
 *  - THE PIN LAW: the spend sides (withdraw + transfer) verify the
 *    account's REAL PIN (scrypt, per-account salt) at the door. A stolen
 *    session can look, but it cannot spend.
 *  - THE LIMITS LAW: per-transfer max + daily transfer cap + min ₦1 —
 *    data at the bottom, tunable without touching a law.
 *  - THE IDEMPOTENCY LAW: every purse verb carries a client-minted
 *    idemKey; the UNIQUE index is the law. A replay returns the SAME
 *    receipt and moves NOTHING twice. Double-spend dies by structure.
 *  - THE FORTRESS LAW: each LedgerRow's chainHash = sha256(prev hash +
 *    the row's truth). The book is tamper-evident end to end; the seed
 *    is a constant, the tail is the latest row.
 *  - THE RECEIPT LAW: both sides learn the truth — the sender's ack AND
 *    a receipt event for the receiver, on both lanes (direct push + the
 *    LiveEvent row the 12s relay reads, channel-scoped to the recipient).
 */

import { createHash } from 'node:crypto'

/** The purse limits — data, not law-code, so they tune without ceremony. */
export const LEDGER_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_PER_TRANSFER: 50_000,
  DAY_TRANSFER_CAP: 200_000,
} as const

export const LEDGER_SEED = 'lko-ledger-seed'

/** W9 — 'tip' joins the book: a stage spray is a REAL transfer (both legs,
 * the day cap, the fortress chain) — the same money, a lawful name. */
export type LedgerKind = 'deposit' | 'withdraw' | 'transfer' | 'tip'

export type LedgerRefusal =
  | 'minors-no-money'
  | 'minors-collect-nothing'
  | 'bad-amount'
  | 'too-small'
  | 'too-big'
  | 'day-cap'
  | 'insufficient'
  | 'self'
  | 'bad-handle'
  | 'no-such-paddy'
  | 'bad-pin'
  | 'unclaimed'

/** THE VERDICT for any purse move. `balance` = the mover's purse AFTER the
 * day's counted transfers have been considered (the door checks the real
 * row; this verdict only shapes the decision). */
export function transferVerdict(input: {
  band: 'guest' | 'kid' | 'teen' | 'adult'
  to?: string
  from?: string
  amount: number
  purse: number
  transferredToday: number
}): { ok: boolean; why?: LedgerRefusal } {
  const { band, amount, purse, transferredToday } = input
  if (band === 'kid' || band === 'teen') return { ok: false, why: 'minors-no-money' }
  if (band === 'guest') return { ok: false, why: 'unclaimed' }
  if (!Number.isFinite(amount) || Math.floor(amount) !== amount) return { ok: false, why: 'bad-amount' }
  if (amount < LEDGER_LIMITS.MIN_AMOUNT) return { ok: false, why: 'too-small' }
  if (amount > LEDGER_LIMITS.MAX_PER_TRANSFER) return { ok: false, why: 'too-big' }
  if (transferredToday + amount > LEDGER_LIMITS.DAY_TRANSFER_CAP) return { ok: false, why: 'day-cap' }
  if (input.to !== undefined) {
    if (!input.to || input.to === input.from) return { ok: false, why: input.to === input.from ? 'self' : 'bad-handle' }
  }
  if (purse < amount) return { ok: false, why: 'insufficient' }
  return { ok: true }
}

/** THE DEPOSIT VERDICT — a deposit draws from the POCKET (the client's
 * honest engine judges the pocket), never from the purse. The purse
 * check is meaningless here and would refuse every first top-up. */
export function depositVerdict(input: { band: 'guest' | 'kid' | 'teen' | 'adult'; amount: number }): { ok: boolean; why?: LedgerRefusal } {
  const { band, amount } = input
  if (band === 'kid' || band === 'teen') return { ok: false, why: 'minors-no-money' }
  if (band === 'guest') return { ok: false, why: 'unclaimed' }
  if (!Number.isFinite(amount) || Math.floor(amount) !== amount) return { ok: false, why: 'bad-amount' }
  if (amount < LEDGER_LIMITS.MIN_AMOUNT) return { ok: false, why: 'too-small' }
  if (amount > LEDGER_LIMITS.MAX_PER_TRANSFER) return { ok: false, why: 'too-big' }
  return { ok: true }
}

/** THE FORTRESS LINK — the chain every row hangs from. */
export function chainLink(
  prevHash: string,
  row: { idemKey: string; from: string; to: string; amount: number; kind: LedgerKind; ts: number },
): string {
  return createHash('sha256')
    .update(`${prevHash}|${row.idemKey}|${row.from}>${row.to}|${row.amount}|${row.kind}|${row.ts}`)
    .digest('hex')
}

/** THE IDEMPOTENCY KEY SHAPE — client-minted, server-enforced UNIQUE. */
export function idemKeyOf(handle: string, kind: LedgerKind, nonce: string): string {
  return `${kind.slice(0, 3)}:${handle}:${nonce}`.slice(0, 80)
}

/** THE START OF TODAY (epoch-ms) — the day-cap window. Server-local midnight. */
export function dayStartMs(now = Date.now()): number {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** THE RECEIPT both sides see — the same shape on both lanes. */
export interface LedgerReceipt {
  idemKey: string
  ledgerId: number
  kind: LedgerKind
  from: string
  to: string
  amount: number
  hash: string
  ts: number
}

export function receiptOf(row: {
  id: number
  idemKey: string
  kind: string
  fromHandle: string
  toHandle: string
  amount: number
  chainHash: string
  createdAt: number | Date
}): LedgerReceipt {
  return {
    idemKey: row.idemKey,
    ledgerId: row.id,
    kind: row.kind as LedgerKind,
    from: row.fromHandle,
    to: row.toHandle,
    amount: row.amount,
    hash: row.chainHash,
    ts: typeof row.createdAt === 'number' ? row.createdAt : row.createdAt.getTime(),
  }
}
