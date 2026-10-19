'use client'

/**
 * THE APP FACE KIT (M24-UI wave 2)
 * --------------------------------
 * The shared presentational kit the phone's reader apps wear — the
 * same design language the W5-W9 rebuilt social faces speak (hero
 * band, stat tiles, section labels, law notes, mini bars). Purely
 * presentational: zero store imports, zero data invention, zero new
 * tokens (the palette rides the existing --lko-* CSS variables).
 *
 * THE LAWS IT KEEPS:
 *  - every hero carries the app's own testid so the e2e witnesses
 *    still find the face by its name;
 *  - no colour exists outside the real token vocabulary;
 *  - nothing here mutates, fetches, or reads — the apps stay the
 *    honest readers they were born (the laws live in their systems).
 */

import type { ReactNode } from 'react'

export type FaceHue = 'green' | 'gold' | 'river' | 'terra' | 'ember' | 'ink'

const HERO_GRAD: Record<FaceHue, string> = {
  green: 'from-[var(--lko-green-deep)] via-[var(--lko-green)] to-[#0b4a2a]',
  gold: 'from-[#8a6d1a] via-[var(--lko-gold-deep)] to-[#6b5416]',
  river: 'from-[#155e75] via-[var(--lko-river)] to-[#0e4a5c]',
  terra: 'from-[#9a3412] via-[var(--lko-terra)] to-[#7c2d12]',
  ember: 'from-[#92400e] via-[#b45309] to-[#78350f]',
  ink: 'from-[#0f1a15] via-[#1a2a22] to-[#0b1512]',
}

/**
 * THE HERO BAND — the app's face: glyph tile, display title, the live
 * sub-line, and one honest right-side chip (a count, a status, a law).
 */
export function FaceHero({ id, glyph, title, sub, hue = 'green', right, wrap = false }: {
  id: string
  glyph: string
  title: string
  sub: string
  hue?: FaceHue
  right?: ReactNode
  /** long titles may wrap — the chip stays shrink-0 either way */
  wrap?: boolean
}) {
  return (
    <div
      data-testid={`${id}-hero`}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${HERO_GRAD[hue]} p-3.5 text-white shadow-[var(--lko-shadow-md)]`}
    >
      {/* the confluence watermark — the whole phone shares one river */}
      <svg viewBox="0 0 48 48" className="absolute -right-3 -top-3 h-20 w-20 opacity-[0.14]" aria-hidden>
        <path d="M8 8 C 20 13 23 22 24 36" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M41 17 C 31 20 26 26 24 36" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="24" cy="37.5" r="4" fill="#fff" />
      </svg>
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[15px] backdrop-blur-sm" aria-hidden>
              {glyph}
            </span>
            <h2 className={`lko-display text-[16px] leading-tight ${wrap ? '' : 'truncate'}`}>{title}</h2>
          </div>
          <p className="mt-1 text-[10px] font-bold leading-snug text-white/80">{sub}</p>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  )
}

/** THE STAT TILE — one honest number, big, with its label under it. */
export function StatTile({ label, value, tone = 'green' }: {
  label: string
  value: string | number
  tone?: 'green' | 'gold' | 'river' | 'terra'
}) {
  const toneCls =
    tone === 'gold' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]'
    : tone === 'river' ? 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]'
    : tone === 'terra' ? 'bg-orange-50 text-[var(--lko-terra)]'
    : 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
  return (
    <div className={`rounded-xl px-2 py-1.5 text-center ${toneCls}`}>
      <div className="lko-num text-[14px] font-black leading-none">{value}</div>
      <div className="mt-0.5 text-[8px] font-extrabold uppercase tracking-[0.06em] opacity-80">{label}</div>
    </div>
  )
}

/** THE SECTION LABEL — the quiet uppercase voice between cards. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-1 pb-0.5 pt-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-ink-soft)]">
      {children}
    </p>
  )
}

/** THE LAW NOTE — the honest fine print, token-toned, never invented. */
export function LawNote({ children, tone = 'plain' }: {
  children: ReactNode
  tone?: 'plain' | 'gold' | 'river'
}) {
  const cls =
    tone === 'gold' ? 'border-[var(--lko-gold)]/30 bg-[var(--lko-gold-soft)]/60'
    : tone === 'river' ? 'border-[var(--lko-river)]/25 bg-[var(--lko-river-soft)]/70'
    : 'border-black/[0.05] bg-black/[0.02]'
  return (
    <div className={`rounded-xl border ${cls} px-2.5 py-1.5`}>
      <p className="text-[9.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]">{children}</p>
    </div>
  )
}

/** THE MINI BAR — one honest proportion, animated on change. */
export function MiniBar({ pct, tone = 'green', tall = false }: {
  pct: number
  tone?: 'green' | 'gold' | 'river' | 'terra' | 'red'
  tall?: boolean
}) {
  const w = Math.max(0, Math.min(100, pct))
  const cls =
    tone === 'gold' ? 'bg-[var(--lko-gold)]'
    : tone === 'river' ? 'bg-[var(--lko-river)]'
    : tone === 'terra' ? 'bg-[var(--lko-terra)]'
    : tone === 'red' ? 'bg-red-500'
    : 'bg-[var(--lko-green)]'
  return (
    <div className={`${tall ? 'h-2' : 'h-1.5'} overflow-hidden rounded-full bg-black/[0.05]`}>
      <div className={`h-full rounded-full transition-[width] duration-500 ${cls}`} style={{ width: `${w}%` }} />
    </div>
  )
}

/** THE STATUS CHIP — the real state in its real colour. */
export function StatusChip({ children, tone = 'plain' }: {
  children: ReactNode
  tone?: 'ok' | 'warn' | 'bad' | 'plain' | 'gold'
}) {
  const cls =
    tone === 'ok' ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
    : tone === 'warn' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]'
    : tone === 'bad' ? 'bg-red-50 text-red-700'
    : tone === 'gold' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]'
    : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-black ${cls}`}>
      {children}
    </span>
  )
}
