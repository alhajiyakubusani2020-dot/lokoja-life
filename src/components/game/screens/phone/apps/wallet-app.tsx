'use client'

/**
 * LOKOJA LIFE — M24 W6: WALLET (the nation purse's face)
 * -------------------------------------------------------
 * TWO balances, BOTH honest, both labeled:
 *  - POCKET — the save's money (player.cash): the honest engine's whole
 *    solo economy lives here. Device truth.
 *  - PURSE — the server's money (WalletRow): the only balance P2P
 *    transfers draw from, so every naira that moves person-to-person
 *    passes the server door. ₦500 moves exactly once (N8), a replayed
 *    send returns the SAME receipt, the PIN judges every spend, minors
 *    are structurally walled out.
 *
 * THE FLOWS: Top up (pocket→purse, debit-first + refund-on-refusal),
 * Send (purse→paddy, PIN step, receipt with the ledger id + hash),
 * Cash out (purse→pocket, server-first). The receipt list is SERVER
 * truth; the wire:ledger push updates a receiver live.
 */

import { useEffect, useState } from 'react'
import { formatNaira } from '@/game/systems/progression'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialNetStore } from '@/game/systems/socialnet'
import { useWireStore } from '@/game/systems/wire'
import {
  useWalletNetStore, walletNetInit, walletNetSync,
  walletNetDeposit, walletNetWithdraw, walletNetTransfer,
} from '@/game/systems/walletnet'
import { LEDGER_LIMITS } from '@/game/systems/ledger'

type Step = 'home' | 'amount' | 'pin' | 'done'

interface Receipt {
  kind: string
  label: string
  amount: number
  ledgerId: number
  hash: string
  balance: number | null
}

const WHY_LABEL: Record<string, string> = {
  'minors-no-money': 'The nation purse na adults only — na the M13 law.',
  'minors-collect-nothing': 'Minors collect nothing — pick an adult paddy.',
  'bad-amount': 'Put a correct amount.',
  'too-small': 'Too small — the floor na ₦1.',
  'too-big': `Too big — one transfer no pass ${formatNaira(LEDGER_LIMITS.MAX_PER_TRANSFER)}.`,
  'day-cap': 'You don pass today transfer cap. Tomorrow dey come.',
  insufficient: 'The purse no carry that amount — top up first.',
  self: 'Na you be that 😄',
  'bad-handle': 'That handle no correct.',
  'no-such-paddy': 'Nobody claim that name.',
  'bad-pin': 'Wrong PIN — the purse no open.',
  'bad-idem': 'The receipt key no correct — try again.',
  offline: 'The nation no reach — try again when network come.',
  unclaimed: 'Claim your name first.',
}

const QUICK = [500, 1000, 2000, 5000]

export function WalletApp() {
  const [step, setStep] = useState<Step>('home')
  const [mode, setMode] = useState<'topup' | 'send' | 'cashout'>('topup')
  const [to, setTo] = useState<string>('')
  const [amount, setAmount] = useState<number>(1000)
  const [custom, setCustom] = useState('')
  const [pin, setPin] = useState('')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const account = useGameStore((s) => s.account)
  const wireState = useWireStore((s) => s.state)

  // THE WIRE + the purse mirror — sync on open and when the lane flips
  const purse = useWalletNetStore((s) => s.balance)
  const recent = useWalletNetStore((s) => s.recent)
  const walletLane = useWalletNetStore((s) => s.lane)
  const syncedAt = useWalletNetStore((s) => s.syncedAt)
  const netFriends = useSocialNetStore((s) => s.friends)
  const wireLive = wireState === 'live'

  useEffect(() => {
    walletNetInit()
    void walletNetSync()
  }, [account.linked, account.token, wireState])

  const cash = player?.cash ?? 0
  const me = account.handle

  const amt = Math.floor(Number(custom !== '' ? custom : amount))

  const openAmount = (m: 'topup' | 'send' | 'cashout') => {
    setMode(m)
    setStep('amount')
    setNotice(null)
    setCustom('')
    setPin('')
  }

  const proceedToPin = () => {
    if (mode === 'send' && !to) {
      setNotice('Pick who dey receive first.')
      return
    }
    setStep('pin')
    setNotice(null)
  }

  const confirm = async () => {
    setBusy(true)
    try {
      if (mode === 'topup') {
        const res = await walletNetDeposit(amt)
        if (res.ok && res.receipt) {
          setReceipt({ kind: 'deposit', label: 'Purse top-up', amount: amt, ledgerId: res.receipt.ledgerId, hash: res.receipt.hash, balance: res.balance ?? null })
          setStep('done')
        } else setNotice(WHY_LABEL[res.why ?? ''] ?? 'The door no gree.')
      } else if (mode === 'cashout') {
        const res = await walletNetWithdraw(amt, pin)
        if (res.ok && res.receipt) {
          setReceipt({ kind: 'withdraw', label: 'Purse cash-out', amount: amt, ledgerId: res.receipt.ledgerId, hash: res.receipt.hash, balance: res.balance ?? null })
          setStep('done')
        } else setNotice(WHY_LABEL[res.why ?? ''] ?? 'The door no gree.')
      } else {
        const res = await walletNetTransfer(to, amt, pin, `transfer to ${to}`)
        if (res.ok && res.receipt) {
          setReceipt({ kind: 'transfer', label: `Sent to @${to}`, amount: amt, ledgerId: res.receipt.ledgerId, hash: res.receipt.hash, balance: res.balance ?? null })
          setStep('done')
        } else setNotice(WHY_LABEL[res.why ?? ''] ?? 'The door no gree.')
      }
    } finally {
      setBusy(false)
    }
  }

  /* ------------------------------- the receipt ------------------------------- */
  if (step === 'done' && receipt) {
    return (
      <div className="flex flex-col gap-3" data-testid="wallet-receipt">
        <div className="rounded-3xl border border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)] p-5 text-center">
          <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-[var(--lko-green)] text-2xl text-white" aria-hidden>✓</span>
          <p className="lko-display mt-2 text-[16px]">{formatNaira(receipt.amount)} {receipt.kind === 'deposit' ? 'don enter purse' : receipt.kind === 'withdraw' ? 'don return pocket' : 'don land'}</p>
          <p className="text-[12px] font-bold text-[var(--lko-ink-soft)]">{receipt.label}</p>
          <p className="lko-num mt-2 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
            ledger #{receipt.ledgerId} · hash {receipt.hash.slice(0, 10)}…{receipt.balance !== null ? ` · purse ${formatNaira(receipt.balance)}` : ''}
          </p>
        </div>
        <p className="rounded-2xl bg-white/70 px-3 py-2 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
          The fortress book don record am — idemKey law: even if the network replay am, the naira no go move twice.
        </p>
        <button
          data-testid="wallet-again"
          onClick={() => { setStep('home'); setReceipt(null); setTo(''); setCustom(''); setPin('') }}
          className="lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[12.5px] font-extrabold text-white"
        >
          Back to the purse
        </button>
      </div>
    )
  }

  /* --------------------------------- the PIN --------------------------------- */
  if (step === 'pin') {
    return (
      <div className="flex flex-col gap-2.5" data-testid="wallet-pin">
        <button onClick={() => setStep('amount')} className="lko-press self-start rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-extrabold text-[var(--lko-ink-soft)]">← Amount</button>
        <div className="rounded-2xl border border-black/[0.05] bg-white p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">
            {mode === 'send' ? `Send ${formatNaira(amt)} to @${to}` : mode === 'cashout' ? `Cash out ${formatNaira(amt)} to pocket` : `Top up ${formatNaira(amt)}`}
          </p>
          {mode !== 'topup' && (
            <>
              <p className="mt-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Your PIN — the purse no open without am</p>
              <input
                data-testid="wallet-pin-input"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                inputMode="numeric"
                maxLength={8}
                type="password"
                placeholder="••••"
                className="lko-num mx-auto mt-1.5 block w-32 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-center text-[16px] font-extrabold tracking-[0.3em] outline-none focus:border-[var(--lko-green)]"
              />
            </>
          )}
        </div>
        <button
          data-testid="wallet-confirm"
          onClick={() => void confirm()}
          disabled={busy || (mode !== 'topup' && pin.length < 4)}
          className="lko-press rounded-xl bg-[var(--lko-green)] py-3 text-[13px] font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          {busy ? 'The book dey write…' : 'Confirm'}
        </button>
        <p className="px-1 text-center text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
          The server judges the PIN, the fortress book records am — ₦ moves exactly once.
        </p>
        {notice && <p className="px-1 text-center text-[10.5px] font-bold text-[var(--lko-terra)]">{notice}</p>}
      </div>
    )
  }

  /* -------------------------------- the amount -------------------------------- */
  if (step === 'amount') {
    const sourceLabel = mode === 'topup' ? 'Pocket' : 'Purse'
    const sourceBalance = mode === 'topup' ? cash : purse
    return (
      <div className="flex flex-col gap-2.5" data-testid="wallet-amount">
        <button onClick={() => setStep('home')} className="lko-press self-start rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-extrabold text-[var(--lko-ink-soft)]">
          ← Purse
        </button>
        {mode === 'send' && (
          <div className="flex flex-col gap-1">
            <p className="px-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Who dey receive?</p>
            <div className="flex max-h-[120px] flex-col gap-1 overflow-y-auto">
              {netFriends.length === 0 && (
                <p className="rounded-xl bg-white/70 p-2 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                  No nation paddy yet — add dem for Connect. Transfers ride the nation graph.
                </p>
              )}
              {netFriends.map((f) => (
                <button key={f.handle} data-testid={`wallet-to-${f.handle}`} onClick={() => setTo(f.handle)}
                  className={`lko-press flex items-center justify-between rounded-xl border px-3 py-2 text-left ${to === f.handle ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)]' : 'border-black/[0.05] bg-white'}`}>
                  <span className="text-[12px] font-extrabold">@{f.handle}</span>
                  <span className="text-[9px] font-black uppercase text-[var(--lko-ink-soft)]">{to === f.handle ? 'picked' : 'paddy'}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-black/[0.05] bg-white p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">{sourceLabel} balance</p>
          <p className="lko-display text-[22px] text-[var(--lko-green-deep)]">
            {sourceBalance === null ? '—' : formatNaira(sourceBalance)}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {QUICK.map((q) => (
            <button key={q} data-testid={`wallet-quick-${q}`} onClick={() => { setAmount(q); setCustom('') }}
              className={`lko-press rounded-xl py-2 text-[11px] font-extrabold ${amount === q && custom === '' ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05] text-[var(--lko-ink)]'}`}>
              {formatNaira(q)}
            </button>
          ))}
        </div>
        <input
          data-testid="wallet-custom-amount"
          value={custom}
          onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
          placeholder="Custom amount (₦)"
          className="w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-center text-[14px] font-extrabold outline-none focus:border-[var(--lko-green)]"
        />
        <button
          data-testid="wallet-amount-next"
          onClick={proceedToPin}
          disabled={amt < 1 || (mode === 'send' && !to) || (mode !== 'topup' && (purse === null || purse < amt))}
          className="lko-press rounded-xl bg-[var(--lko-green)] py-3 text-[13px] font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          {mode === 'topup' ? `Top up ${formatNaira(amt || 0)}` : mode === 'cashout' ? `Cash out ${formatNaira(amt || 0)}` : `Send ${formatNaira(amt || 0)} to @${to || '…'}`}
        </button>
        {mode !== 'topup' && purse !== null && purse < amt && (
          <p className="px-1 text-center text-[10px] font-bold text-[var(--lko-terra)]">Purse low — top up first.</p>
        )}
        {notice && <p className="px-1 text-center text-[10.5px] font-bold text-[var(--lko-terra)]">{notice}</p>}
      </div>
    )
  }

  /* --------------------------------- the home --------------------------------- */
  const minor = account.ageBand === 'kid' || account.ageBand === 'teen'
  return (
    <div className="flex flex-col gap-2" data-testid="wallet-home">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-black/[0.05] bg-white p-3 text-center" data-testid="wallet-pocket">
          <p className="text-[9px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Pocket (the save)</p>
          <p className="lko-display text-[17px] text-[var(--lko-ink)]">{formatNaira(cash)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)] p-3 text-center" data-testid="wallet-purse">
          <p className="text-[9px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Purse (the nation)</p>
          <p className="lko-display text-[17px] text-[var(--lko-green-deep)]">{purse === null ? '—' : formatNaira(purse)}</p>
        </div>
      </div>
      <p className="px-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]" data-testid="wallet-lane">
        {!account.linked
          ? 'Claim your name — the purse dey wait.'
          : minor
            ? 'THE M13 LAW: the nation purse na adults only. Your pocket dey safe for the save.'
            : purse === null
              ? 'The purse never synced — open go retry.'
              : `${walletLane === 'wire' ? '● Purse rides the LIVE WIRE' : 'Purse rides the ~12s relay lane'} — the server wins at reconciliation.${syncedAt ? ` synced ${new Date(syncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}`}
      </p>

      {!minor && account.linked && (
        <div className="grid grid-cols-3 gap-1.5">
          <button data-testid="wallet-topup" onClick={() => openAmount('topup')} className="lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[11px] font-extrabold text-white">⬆ Top up</button>
          <button data-testid="wallet-send" onClick={() => openAmount('send')} className="lko-press rounded-xl bg-[var(--lko-gold-soft)] py-2.5 text-[11px] font-extrabold text-[var(--lko-gold-deep)]">💸 Send</button>
          <button data-testid="wallet-cashout" onClick={() => openAmount('cashout')} className="lko-press rounded-xl bg-black/[0.05] py-2.5 text-[11px] font-extrabold text-[var(--lko-ink)]">⬇ Cash out</button>
        </div>
      )}

      {recent.length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">The book (server truth)</p>
          {recent.slice(0, 6).map((r) => {
            const incoming = r.to === me
            return (
              <div key={r.idemKey} className="flex items-center justify-between rounded-xl border border-black/[0.05] bg-white px-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-[11.5px] font-extrabold">
                    {r.kind === 'deposit' ? '⬆ Top up' : r.kind === 'withdraw' ? '⬇ Cash out' : incoming ? `⬇ from @${r.from}` : `⬆ to @${r.to}`}
                  </span>
                  <span className="block text-[8.5px] font-bold text-[var(--lko-ink-soft)]">#{r.ledgerId} · {r.hash.slice(0, 8)}…</span>
                </span>
                <span className={`text-[12px] font-extrabold ${incoming ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-terra)]'}`}>
                  {incoming ? '+' : '−'}{formatNaira(r.amount)}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <p className="px-1 text-center text-[9px] font-bold text-[var(--lko-ink-soft)]">
        In-game naira only, forever — real money transmission na CBN territory, we no touch am.
      </p>
      {notice && <p className="px-1 text-center text-[10.5px] font-bold text-[var(--lko-terra)]">{notice}</p>}
      {world && <p className="px-1 text-center text-[8.5px] font-bold text-[var(--lko-ink-soft)] opacity-70">day {world.day}</p>}
    </div>
  )
}
