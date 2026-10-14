'use client'

/**
 * LOKOJA LIFE — Bank Panel (Stage 5-b)
 * ------------------------------------
 * The teller's window as a bottom sheet, opened from inside the Lokoja
 * Microfinance Bank interior. Pure presentation over the SAME store
 * authority: every naira moves through `bankDeposit` / `bankWithdraw`
 * (they validate, ledger, notify and autosave). No economy lives here.
 *
 * House style: the shared kit SheetShell + the HUD's glass/typography
 * classes, mobile-first (390px), touch targets ≥ 44px.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { formatNaira } from '@/game/systems/progression'
import { audio } from '@/game/systems/audio'
import { CHAOS } from '@/game/data/config'
import { isScarcityDay, atmRemaining, posFeeFor } from '@/game/systems/chaos'
import { SheetShell } from '../../ui/kit'

/** the teller's quick amounts — presentation chips, not economy rules */
const QUICK_AMOUNTS = [1000, 5000, 25000] as const

function AmountButton({
  label,
  disabled,
  onClick,
  tone,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  tone: 'in' | 'out'
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`lko-press flex min-h-[46px] items-center justify-center rounded-xl px-2 text-[13px] font-extrabold ${
        tone === 'in'
          ? 'bg-[var(--lko-green)] text-white disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]'
          : 'bg-[var(--lko-gold)] text-[#33230a] disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]'
      }`}
    >
      {label}
    </button>
  )
}

export function BankPanel({ onClose }: { onClose: () => void }) {
  const cash = useGameStore((s) => s.player?.cash ?? 0)
  const bankBalance = useGameStore((s) => s.player?.bankBalance ?? 0)
  const transactions = useGameStore((s) => s.player?.transactions ?? [])
  const world = useGameStore((s) => s.world)!
  const chaos = useGameStore((s) => s.chaos)
  const bankDeposit = useGameStore((s) => s.bankDeposit)
  const bankWithdraw = useGameStore((s) => s.bankWithdraw)

  // last five bank moves, newest first
  const bankTx = transactions.filter((t) => t.category === 'bank').slice(0, 5)

  // M8 — the naira's mood today
  const scarcity = isScarcityDay(world.day)
  const atmLeft = atmRemaining(chaos, world.day)

  const deposit = (amount: number) => {
    audio.play('click')
    bankDeposit(amount)
  }
  const withdraw = (amount: number, channel: 'atm' | 'pos' = 'atm') => {
    audio.play('click')
    bankWithdraw(amount, channel)
  }

  return (
    <SheetShell label="Lokoja Microfinance Bank" onClose={onClose}>
      {/* header — same anatomy as the HUD sheets */}
      <div className="flex items-start gap-3 px-1.5 pt-1">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1d5c8a] text-[20px] text-white">
          🏦
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="lko-display truncate text-lg leading-tight">Lokoja Microfinance Bank</h2>
          <p className="truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]">
            “Save am safe — collect am anytime.”
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="lko-press flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]"
        >
          ✕
        </button>
      </div>

      {/* balances */}
      <div className="mt-3 grid grid-cols-2 gap-2 px-1.5">
        <div className="rounded-xl bg-[var(--lko-cream)] px-3 py-2.5 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70">Pocket cash</p>
          <p className="lko-display mt-0.5 text-[16px] leading-tight">{formatNaira(cash)}</p>
        </div>
        <div className="rounded-xl bg-[var(--lko-green-soft)] px-3 py-2.5 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70">Bank balance</p>
          <p className="lko-display mt-0.5 text-[16px] leading-tight text-[var(--lko-green-deep)]">
            {formatNaira(bankBalance)}
          </p>
        </div>
      </div>

      {/* M8 — cash weather: the scarcity law announced in the teller's own words */}
      {scarcity && (
        <div data-testid="bank-scarcity" className="mx-1.5 mt-3 rounded-xl bg-[#fdecea] px-3 py-2.5">
          <p className="text-[11.5px] font-extrabold text-[#8a2a20]">💸 Cash scarcity — the ATM dey pay small small</p>
          <p className="mt-0.5 text-[11px] font-semibold text-[#8a2a20]/80">
            ATM fit still pay {Number.isFinite(atmLeft) ? formatNaira(atmLeft) : formatNaira(CHAOS.atmCap)} today.
            The POS agent dey instant — {Math.round(CHAOS.posFeeRate * 100)}% levy, no cap.
          </p>
        </div>
      )}

      {/* deposit */}
      <div className="mt-3 px-1.5">
        <p className="lko-label mb-1.5">Deposit</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <AmountButton
              key={a}
              tone="in"
              label={`₦${a / 1000}k`}
              disabled={cash < a}
              onClick={() => deposit(a)}
            />
          ))}
          <AmountButton
            tone="in"
            label="All"
            disabled={cash <= 0}
            onClick={() => deposit(Math.floor(cash))}
          />
        </div>
      </div>

      {/* withdraw — M8: two doors on a scarcity day (the queue or the levy) */}
      <div className="mt-2.5 px-1.5">
        <p className="lko-label mb-1.5">Withdraw {scarcity ? '— choose your door' : ''}</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <AmountButton
              key={a}
              tone="out"
              label={`₦${a / 1000}k`}
              disabled={bankBalance < a}
              onClick={() => withdraw(a, 'atm')}
            />
          ))}
          <AmountButton
            tone="out"
            label="All · ATM"
            disabled={bankBalance <= 0}
            onClick={() => withdraw(bankBalance, 'atm')}
          />
        </div>
        {scarcity && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {QUICK_AMOUNTS.map((a) => {
              const fee = posFeeFor(a)
              return (
                <button
                  key={a}
                  data-testid={`bank-pos-${a}`}
                  disabled={bankBalance < a}
                  onClick={() => withdraw(a, 'pos')}
                  className="lko-press flex min-h-[46px] flex-col items-center justify-center rounded-xl border border-[#1d5c8a]/40 bg-white px-1 text-[11px] font-extrabold text-[#1d5c8a] disabled:opacity-40"
                >
                  <span>POS ₦{a / 1000}k</span>
                  <span className="text-[9.5px] font-bold opacity-70">−{formatNaira(fee)} levy</span>
                </button>
              )
            })}
            <button
              data-testid="bank-pos-all"
              disabled={bankBalance <= 0}
              onClick={() => withdraw(bankBalance, 'pos')}
              className="lko-press flex min-h-[46px] flex-col items-center justify-center rounded-xl border border-[#1d5c8a]/40 bg-white px-1 text-[11px] font-extrabold text-[#1d5c8a] disabled:opacity-40"
            >
              <span>POS All</span>
              <span className="text-[9.5px] font-bold opacity-70">instant · levy</span>
            </button>
          </div>
        )}
      </div>

      {/* ledger — the last five bank moves */}
      <div className="mt-3.5 px-1.5">
        <p className="lko-label mb-1.5">Recent bank moves</p>
        {bankTx.length === 0 ? (
          <p className="rounded-xl bg-black/[0.04] px-3 py-3 text-center text-[12px] font-semibold text-[var(--lko-ink-soft)]">
            No bank moves yet — your first deposit starts the story.
          </p>
        ) : (
          <ul className="overflow-hidden rounded-xl bg-black/[0.04]">
            {bankTx.map((t, i) => (
              <li
                key={t.id}
                className={`flex items-center justify-between gap-2 px-3 py-2 ${i > 0 ? 'border-t border-black/[0.05]' : ''}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-bold">{t.label}</span>
                  <span className="block text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">Day {t.day}</span>
                </span>
                <span
                  className={`lko-num shrink-0 text-[12.5px] font-extrabold ${
                    t.amount >= 0 ? 'text-[var(--lko-green)]' : 'text-red-600'
                  }`}
                >
                  {t.amount >= 0 ? '+' : ''}
                  {formatNaira(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={onClose}
        className="lko-press mx-1.5 mb-1 mt-3 flex min-h-[46px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]"
      >
        Step back from the counter
      </button>
    </SheetShell>
  )
}
