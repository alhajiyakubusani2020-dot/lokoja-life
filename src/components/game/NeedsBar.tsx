'use client'

/**
 * LOKOJA LIFE — NeedsBar (R1)
 * A labelled stat bar for the four player needs.
 * R1: SVG need icons in tinted discs instead of emoji, slimmer track,
 * tabular numbers. Colour shifts by value; small + large sizes.
 * Self-contained so game styling stays isolated.
 */

import { NeedIcon, type NeedIconKey } from './icons'

export type NeedKey = NeedIconKey

const NEED_META: Record<NeedKey, { label: string; disc: string; icon: string }> = {
  health: { label: 'Health', disc: 'bg-red-50 text-red-500', icon: 'health' },
  energy: { label: 'Energy', disc: 'bg-[var(--lko-gold-soft)] text-[#b57d0a]', icon: 'energy' },
  hunger: { label: 'Food', disc: 'bg-orange-50 text-[var(--lko-terra)]', icon: 'hunger' },
  mood: { label: 'Mood', disc: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]', icon: 'mood' },
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
  const disc = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'
  const iconSize = size === 'sm' ? 13 : 15
  return (
    <div className="flex items-center gap-2.5">
      <span className={`${disc} flex shrink-0 items-center justify-center rounded-full ${meta.disc}`} aria-hidden>
        <NeedIcon name={need} size={iconSize} />
      </span>
      <span className={`${size === 'sm' ? 'w-12 text-xs' : 'w-14 text-[13px]'} shrink-0 font-bold text-[var(--lko-ink)]`}>
        {meta.label}
      </span>
      <div
        className={`${size === 'sm' ? 'h-2' : 'h-2.5'} flex-1 overflow-hidden rounded-full bg-black/[0.07]`}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={meta.label}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: barColor(value) }}
        />
      </div>
      <span
        className={`lko-num ${size === 'sm' ? 'w-7 text-[11px]' : 'w-8 text-xs'} shrink-0 text-right font-bold text-[var(--lko-ink-soft)]`}
      >
        {Math.round(value)}
      </span>
    </div>
  )
}
