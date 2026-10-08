'use client'

/**
 * LOKOJA LIFE — NeedsBar
 * A labelled stat bar for the four player needs.
 * Colour shifts by value; small + large sizes for HUD / detail views.
 * Self-contained (no shared ui dependency) so game styling stays isolated.
 */

export type NeedKey = 'health' | 'energy' | 'hunger' | 'mood'

const NEED_META: Record<NeedKey, { label: string; emoji: string }> = {
  health: { label: 'Health', emoji: '❤️' },
  energy: { label: 'Energy', emoji: '⚡' },
  hunger: { label: 'Food', emoji: '🍲' },
  mood: { label: 'Mood', emoji: '🙂' },
}

function barColor(value: number): string {
  if (value <= 20) return '#ef4444'
  if (value <= 45) return '#f59e0b'
  return 'var(--lko-green)'
}

interface NeedsBarProps {
  need: NeedKey
  value: number
  size?: 'sm' | 'md'
}

export function NeedsBar({ need, value, size = 'md' }: NeedsBarProps) {
  const meta = NEED_META[need]
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`${size === 'sm' ? 'w-20 text-xs' : 'w-24 text-sm'} shrink-0 font-semibold text-[var(--lko-ink)]`}
      >
        {meta.emoji} {meta.label}
      </span>
      <div
        className={`${size === 'sm' ? 'h-2.5' : 'h-3.5'} flex-1 overflow-hidden rounded-full bg-black/[0.08]`}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={meta.label}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: barColor(value) }}
        />
      </div>
      <span
        className={`${size === 'sm' ? 'w-8 text-[11px]' : 'w-9 text-xs'} shrink-0 text-right font-bold tabular-nums text-[var(--lko-ink-soft)]`}
      >
        {Math.round(value)}
      </span>
    </div>
  )
}
