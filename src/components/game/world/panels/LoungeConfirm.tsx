'use client'

/**
 * LOKOJA LIFE — Lounge Confirm (Stage 5-b)
 * ----------------------------------------
 * The small confirm chip-sheet for a night out at Golden Nights Lounge.
 * The price comes from config (INTERIOR.NIGHT_OUT.cost) and the money
 * moves ONLY through `useGameStore.nightOut()` — it validates the
 * pocket, ledgers the spend and shows its own toast.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { INTERIOR } from '@/game/data/config'
import { formatNaira } from '@/game/systems/progression'
import { audio } from '@/game/systems/audio'
import { SheetShell } from '../../ui/kit'

export function LoungeConfirm({ onClose }: { onClose: () => void }) {
  const cash = useGameStore((s) => s.player?.cash ?? 0)
  const cost = INTERIOR.NIGHT_OUT.cost
  const affordable = cash >= cost

  return (
    <SheetShell label="Night out at Golden Nights" onClose={onClose}>
      <div className="flex items-start gap-3 px-1.5 pt-1">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8a317] text-[20px] text-white">
          🍾
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="lko-display truncate text-lg leading-tight">Golden Nights Lounge</h2>
          <p className="truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]">
            “Small chops, loud music, sweet life.”
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

      <div className="mt-3 px-1.5">
        <div className="flex items-center justify-between rounded-xl bg-[var(--lko-gold-soft)] px-3.5 py-3">
          <span className="text-[13px] font-extrabold text-[#8a5a00]">Night out — table + small chops</span>
          <span className="lko-display text-[16px] text-[#8a5a00]">{formatNaira(cost)}</span>
        </div>
        <p className="mt-2 text-[11.5px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
          One clock slot. Mood go rise well well — {formatNaira(cost)} leaves your pocket, and evenings
          slap sweeter than afternoons.
        </p>
      </div>

      <div className="mx-1.5 mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            audio.play('click')
            onClose()
          }}
          className="lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]"
        >
          Not today
        </button>
        <button
          onClick={() => {
            audio.play('click')
            useGameStore.getState().nightOut()
            onClose()
          }}
          disabled={!affordable}
          className="lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--lko-green)] text-[13px] font-extrabold text-white disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]"
        >
          {affordable ? 'Enjoy the night' : 'Pocket no reach'}
        </button>
      </div>
      <p className="mt-2 px-1.5 pb-1 text-center text-[11px] font-bold text-[var(--lko-ink-soft)]">
        Pocket: <span className="lko-num text-[var(--lko-ink)]">{formatNaira(cash)}</span>
      </p>
    </SheetShell>
  )
}
