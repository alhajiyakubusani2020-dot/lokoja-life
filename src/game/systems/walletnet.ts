/**
 * LOKOJA LIFE — M24 W6: THE WALLET NET (the purse's client mirror)
 * =================================================================
 * The client home of the NATION PURSE — the server's WalletRow balance,
 * synced through BOTH lanes with the honest lane law (the live wire ack,
 * the 12s relay door when it's down — N10), plus the wire:ledger PUSH
 * lane (a receipt lands on the receiver the moment the money moves).
 *
 * THE POCKET/PURSE LAW (the wave's architecture):
 *  - the POCKET is the save's money (player.cash — the honest engine's
 *    whole solo economy). It NEVER leaves the client except through the
 *    store's own doors.
 *  - the PURSE is the server's money (WalletRow). P2P transfers draw
 *    from it and ONLY it — so every naira that moves person-to-person
 *    passes the server door and N8 ("₦500 exactly once") is structure.
 *  - DEPOSIT (pocket→purse) debits the pocket FIRST through the honest
 *    engine, then asks the server; a server refusal REFUNDS the pocket
 *    in the same breath. No phantom naira either direction.
 *  - WITHDRAW (purse→pocket) is server-first: the PIN is judged at the
 *    door, the pocket only grows when the server says PAID.
 *  - THE SERVER WINS: the mirror here is a cache — after every ack the
 *    server's balance replaces it. Reconciliation is not a negotiation.
 *  - THE MINOR WALL: kid/teen accounts never even sync a purse — the
 *    server refuses, the store holds nothing, the face says why.
 */

import { create } from 'zustand'
import { useGameStore } from '../store/useGameStore'
import {
  wireOnLedger, wireWalletState, wireWalletDeposit, wireWalletWithdraw, wireWalletTransfer,
  type WireLedgerReceipt,
} from './wire'

export type WalletLane = 'wire' | 'relay' | null

interface WalletNetState {
  balance: number | null // the server's purse — null = never synced (or refused)
  transferredToday: number
  recent: WireLedgerReceipt[]
  syncedAt: number | null
  lane: WalletLane
  lastReceipt: WireLedgerReceipt | null
}

export const useWalletNetStore = create<WalletNetState>(() => ({
  balance: null,
  transferredToday: 0,
  recent: [],
  syncedAt: null,
  lane: null,
  lastReceipt: null,
}))

function applyAck(a: { balance?: number; transferredToday?: number; recent?: WireLedgerReceipt[] }, lane: WalletLane) {
  useWalletNetStore.setState({
    balance: typeof a.balance === 'number' ? a.balance : null,
    transferredToday: typeof a.transferredToday === 'number' ? a.transferredToday : 0,
    recent: Array.isArray(a.recent) ? a.recent : [],
    syncedAt: Date.now(),
    lane,
  })
}

/* ── the push lane (registered once — StrictMode-proof, idempotent) ── */

let pushRegistered = false

export function walletNetInit(): void {
  if (pushRegistered || typeof window === 'undefined') return
  pushRegistered = true
  wireOnLedger((r: WireLedgerReceipt) => {
    const s = useWalletNetStore.getState()
    // THE SERVER WINS: the receipt says money moved — the receiver's mirror
    // grows by the receipt's truth (the sender's mirror was set by their ack)
    const iAmReceiver = r.to === useGameStore.getState().account.handle
    useWalletNetStore.setState({
      balance: iAmReceiver && s.balance !== null ? s.balance + r.amount : s.balance,
      recent: [r, ...s.recent].slice(0, 12),
      lastReceipt: r,
      syncedAt: Date.now(),
    })
  })
}

/* ── the sync (wire first, relay fallback — one purse, two lanes) ── */

export async function walletNetSync(): Promise<{ ok: boolean; lane: WalletLane; why?: string }> {
  const { account } = useGameStore.getState()
  if (!account.linked || !account.token) {
    useWalletNetStore.setState({ balance: null, recent: [], lane: null, syncedAt: null })
    return { ok: false, lane: null, why: 'unclaimed' }
  }
  walletNetInit()

  const w = await wireWalletState()
  if (w.ok) {
    applyAck(w, 'wire')
    return { ok: true, lane: 'wire' }
  }
  if (w.why === 'minors-no-money') {
    // THE MINOR WALL — the store honestly holds nothing
    useWalletNetStore.setState({ balance: null, recent: [], lane: null, syncedAt: null })
    return { ok: false, lane: null, why: 'minors-no-money' }
  }
  if (w.why !== 'wire-down' && w.why !== 'wire-slow') {
    useWalletNetStore.setState({ balance: null, lane: null })
    return { ok: false, lane: null, why: w.why }
  }
  // lane 2: the relay door
  const res = await useGameStore.getState().liveAction('wallet', {})
  if (res.ok) {
    applyAck(res as { balance?: number; transferredToday?: number; recent?: WireLedgerReceipt[] }, 'relay')
    return { ok: true, lane: 'relay' }
  }
  if (res.why === 'minors-no-money') {
    useWalletNetStore.setState({ balance: null, recent: [], lane: null, syncedAt: null })
    return { ok: false, lane: null, why: 'minors-no-money' }
  }
  return { ok: false, lane: null, why: typeof res.why === 'string' ? res.why : 'offline' }
}

/* ── the move doors (the honest deposit law lives here) ── */

function mintIdem(kind: string): string {
  return `${kind}:${useGameStore.getState().account.handle}:${Date.now().toString(36)}:${Math.floor(Math.random() * 1e9).toString(36)}`
}

export type MoveResult = { ok: boolean; why?: string; balance?: number; receipt?: WireLedgerReceipt; replayed?: boolean }

/** DEPOSIT — pocket → purse. Debit FIRST (the honest engine records it),
 * then the server; a refusal refunds the pocket in the same breath. */
export async function walletNetDeposit(amount: number): Promise<MoveResult> {
  const g = useGameStore.getState()
  if (!g.player) return { ok: false, why: 'unclaimed' }
  const amt = Math.floor(amount)
  const debited = g.removeMoney(amt, { label: 'Nation purse top-up', category: 'other' })
  if (!debited) return { ok: false, why: 'insufficient' }
  const idem = mintIdem('dep')
  const w = await wireWalletDeposit(amt, idem)
  if (w.ok && w.receipt) {
    useWalletNetStore.setState({ balance: w.balance ?? null, lastReceipt: w.receipt, syncedAt: Date.now(), recent: [w.receipt, ...useWalletNetStore.getState().recent].slice(0, 12) })
    return { ok: true, balance: w.balance, receipt: w.receipt, replayed: w.replayed }
  }
  // relay fallback
  if (w.why === 'wire-down' || w.why === 'wire-slow') {
    const res = await useGameStore.getState().liveAction('wallet-deposit', { amount: amt, idemKey: idem })
    if (res.ok && res.receipt) {
      useWalletNetStore.setState({ balance: typeof res.balance === 'number' ? res.balance : null, lastReceipt: res.receipt as WireLedgerReceipt, syncedAt: Date.now() })
      return { ok: true, balance: typeof res.balance === 'number' ? res.balance : undefined, receipt: res.receipt as WireLedgerReceipt, replayed: !!res.replayed }
    }
    if (res.why && !['offline', 'relay no gree', 'unclaimed'].includes(res.why)) {
      g.addMoney(amt, { label: 'Purse top-up refund — the door refused', category: 'tip' })
      return { ok: false, why: res.why }
    }
  } else {
    // a REAL refusal (too-big, minors, bad-amount…) — refund, name the why
    g.addMoney(amt, { label: 'Purse top-up refund — the door refused', category: 'tip' })
    return { ok: false, why: w.why }
  }
  // both lanes dead — refund; the pocket never lies
  g.addMoney(amt, { label: 'Purse top-up refund — the nation was unreachable', category: 'tip' })
  return { ok: false, why: 'offline' }
}

/** WITHDRAW — purse → pocket. Server-first; the PIN is judged at the door. */
export async function walletNetWithdraw(amount: number, pin: string): Promise<MoveResult> {
  const g = useGameStore.getState()
  if (!g.player) return { ok: false, why: 'unclaimed' }
  const amt = Math.floor(amount)
  const idem = mintIdem('wd')
  const w = await wireWalletWithdraw(amt, pin, idem)
  if (w.ok && w.receipt) {
    useWalletNetStore.setState({ balance: w.balance ?? null, lastReceipt: w.receipt, syncedAt: Date.now(), recent: [w.receipt, ...useWalletNetStore.getState().recent].slice(0, 12) })
    g.addMoney(amt, { label: 'Purse cash-out', category: 'tip' })
    return { ok: true, balance: w.balance, receipt: w.receipt, replayed: w.replayed }
  }
  if (w.why === 'wire-down' || w.why === 'wire-slow') {
    const res = await useGameStore.getState().liveAction('wallet-withdraw', { amount: amt, pin, idemKey: idem })
    if (res.ok && res.receipt) {
      useWalletNetStore.setState({ balance: typeof res.balance === 'number' ? res.balance : null, lastReceipt: res.receipt as WireLedgerReceipt, syncedAt: Date.now() })
      g.addMoney(amt, { label: 'Purse cash-out', category: 'tip' })
      return { ok: true, balance: typeof res.balance === 'number' ? res.balance : undefined, receipt: res.receipt as WireLedgerReceipt, replayed: !!res.replayed }
    }
    if (res.why && !['offline', 'relay no gree', 'unclaimed'].includes(res.why)) return { ok: false, why: res.why }
    return { ok: false, why: 'offline' }
  }
  return { ok: false, why: w.why }
}

/** TRANSFER — purse → paddy's purse. Both legs, one server transaction. */
export async function walletNetTransfer(to: string, amount: number, pin: string, note?: string): Promise<MoveResult> {
  const g = useGameStore.getState()
  if (!g.player) return { ok: false, why: 'unclaimed' }
  const amt = Math.floor(amount)
  const idem = mintIdem('tr')
  const w = await wireWalletTransfer(to, amt, pin, idem, note)
  if (w.ok && w.receipt) {
    useWalletNetStore.setState({ balance: w.balance ?? null, lastReceipt: w.receipt, syncedAt: Date.now(), recent: [w.receipt, ...useWalletNetStore.getState().recent].slice(0, 12) })
    return { ok: true, balance: w.balance, receipt: w.receipt, replayed: w.replayed }
  }
  if (w.why === 'wire-down' || w.why === 'wire-slow') {
    const res = await useGameStore.getState().liveAction('wallet-transfer', { to, amount: amt, pin, idemKey: idem, note })
    if (res.ok && res.receipt) {
      useWalletNetStore.setState({ balance: typeof res.balance === 'number' ? res.balance : null, lastReceipt: res.receipt as WireLedgerReceipt, syncedAt: Date.now() })
      return { ok: true, balance: typeof res.balance === 'number' ? res.balance : undefined, receipt: res.receipt as WireLedgerReceipt, replayed: !!res.replayed }
    }
    if (res.why && !['offline', 'relay no gree', 'unclaimed'].includes(res.why)) return { ok: false, why: res.why }
    return { ok: false, why: 'offline' }
  }
  return { ok: false, why: w.why }
}
