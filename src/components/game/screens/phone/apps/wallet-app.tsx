'use client'

/**
 * LOKOJA LIFE — M24-UI: WALLET (the transfer face)
 * -------------------------------------------------
 * Pick a person → amount → confirm → receipt. The OUTGOING side rides
 * the store's REAL honest engine (removeMoney — the kobo-chain ledger
 * records it, the income guard rules it). The CREDIT side lands with
 * the W6 server ledger — until then the UI says so on every screen,
 * and a gift to a street paddy is exactly what it claims to be.
 *
 * THE HONESTY LAWS:
 *  - No fake credits: the app never pretends another player's wallet
 *    grew. The receipt says SENT, and the W6 wire will say RECEIVED.
 *  - The guard chain rules: zero, negative, more-than-pocket, and
 *    non-numbers all refuse through the same door the Bank uses.
 */

import { useMemo, useState } from 'react'
import { NPCS } from '@/game/data/npcs'
import { formatNaira } from '@/game/systems/progression'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'

type Step = 'who' | 'how' | 'done'

interface Receipt { id: string; to: string; amount: number; at: number }

const QUICK = [200, 500, 1000, 2000]

export function WalletApp() {
  const [step, setStep] = useState<Step>('who')
  const [to, setTo] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(500)
  const [custom, setCustom] = useState('')
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const removeMoney = useGameStore((s) => s.removeMoney)
  const friends = useSocialStore((s) => s.friends)

  const people = useMemo(() => [...new Set([...friends, ...NPCS.slice(0, 8).map((n) => n.name)])], [friends])
  const cash = player?.cash ?? 0

  const send = () => {
    const amt = Math.floor(Number(custom !== '' ? custom : amount))
    if (!to || !Number.isFinite(amt) || amt <= 0) {
      setNotice('Put a correct amount — zero and negative no dey fly.')
      return
    }
    if (!player || !world) return
    const ok = removeMoney(amt, { label: `Transfer to ${to}`, category: 'tip' })
    if (!ok) {
      setNotice(`You no carry ${formatNaira(amt)} — pocket get ${formatNaira(cash)}.`)
      return
    }
    setReceipt({ id: `tr:${Date.now().toString(36)}`, to, amount: amt, at: Date.now() })
    setStep('done')
    setNotice(null)
  }

  /* ------------------------------- the receipt ------------------------------- */
  if (step === 'done' && receipt) {
    return (
      <div className="flex flex-col gap-3" data-testid="wallet-receipt">
        <div className="rounded-3xl border border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)] p-5 text-center">
          <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-[var(--lko-green)] text-2xl text-white" aria-hidden>✓</span>
          <p className="lko-display mt-2 text-[16px]">{formatNaira(receipt.amount)} sent</p>
          <p className="text-[12px] font-bold text-[var(--lko-ink-soft)]">to {receipt.to}</p>
          <p className="lko-num mt-2 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">{receipt.id} · day {world?.day ?? 1}</p>
        </div>
        <p className="rounded-2xl bg-white/70 px-3 py-2 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
          Your side don comot through the honest engine. The receiving wallet go credit when the W6 server ledger dey live — na there the two sides go meet.
        </p>
        <button
          data-testid="wallet-again"
          onClick={() => { setStep('who'); setTo(null); setReceipt(null); setCustom('') }}
          className="lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[12.5px] font-extrabold text-white"
        >
          Send another
        </button>
      </div>
    )
  }

  /* --------------------------------- pick who -------------------------------- */
  if (step === 'who' || !to) {
    return (
      <div className="flex flex-col gap-2" data-testid="wallet-who">
        <p className="px-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Who dey receive?</p>
        {people.map((p) => (
          <button key={p} onClick={() => { setTo(p); setStep('how') }}
            className="lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left">
            <span className="text-[12.5px] font-extrabold">{p.startsWith('@') || friends.includes(p) ? `@${p}` : p}</span>
            <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">{friends.includes(p) ? 'paddy' : 'street'}</span>
          </button>
        ))}
        {notice && <p className="px-1 text-[10.5px] font-bold text-[var(--lko-terra)]">{notice}</p>}
      </div>
    )
  }

  /* -------------------------------- pick amount ------------------------------- */
  return (
    <div className="flex flex-col gap-2.5" data-testid="wallet-how">
      <button onClick={() => setStep('who')} className="lko-press self-start rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-extrabold text-[var(--lko-ink-soft)]">
        ← To @{to}
      </button>
      <div className="rounded-2xl border border-black/[0.05] bg-white p-3.5 text-center">
        <p className="text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Pocket balance</p>
        <p className="lko-display text-[22px] text-[var(--lko-green-deep)]">{formatNaira(cash)}</p>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {QUICK.map((q) => (
          <button key={q} onClick={() => { setAmount(q); setCustom('') }}
            className={`lko-press rounded-xl py-2 text-[11px] font-extrabold ${amount === q && custom === '' ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05] text-[var(--lko-ink)]'}`}>
            {formatNaira(q)}
          </button>
        ))}
      </div>
      <input
        data-testid="wallet-amount"
        value={custom}
        onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
        inputMode="numeric"
        placeholder="Custom amount (₦)"
        className="w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-center text-[14px] font-extrabold outline-none focus:border-[var(--lko-green)]"
      />
      <button
        data-testid="wallet-confirm"
        onClick={send}
        className="lko-press rounded-xl bg-[var(--lko-green)] py-3 text-[13px] font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)]"
      >
        Send {formatNaira(Math.floor(Number(custom || amount)) || 0)} to {to}
      </button>
      <p className="px-1 text-center text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
        The outgoing side na real — the kobo-chain go record am. W6 go carry the receiving side.
      </p>
      {notice && <p className="px-1 text-center text-[10.5px] font-bold text-[var(--lko-terra)]">{notice}</p>}
    </div>
  )
}
