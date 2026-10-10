'use client'

/**
 * LOKOJA LIFE — UI kit ("Confluence" design language)
 * ----------------------------------------------------
 * Small presentational primitives shared by every screen so spacing,
 * type and colour stay consistent by construction:
 *
 *   Btn          — the one button (primary / gold / ghost / soft / danger)
 *   IconBtn      — square icon control for HUD clusters
 *   GlassChip    — frosted status chip that floats over the 3D world
 *   SectionLabel — micro section header with optional icon
 *   SheetShell   — bottom sheet (backdrop + handle + panel) used by ALL sheets
 *   StatTile     — small centred stat tile used on Profile/Work/Status
 *
 * Purely presentational: no store access, no game logic.
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './icons'

/* ---------------------------------- Btn ---------------------------------- */

type BtnVariant = 'primary' | 'gold' | 'ghost' | 'soft' | 'danger'
type BtnSize = 'sm' | 'md' | 'lg'

const BTN_VARIANT: Record<BtnVariant, string> = {
  primary:
    'bg-[var(--lko-green)] text-white shadow-[0_8px_20px_-10px_rgba(16,101,61,0.65)] hover:bg-[#0d5735] disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)] disabled:shadow-none',
  gold:
    'bg-[var(--lko-gold)] text-[#33230a] shadow-[0_8px_20px_-10px_rgba(217,154,27,0.7)] hover:bg-[#c98d14] disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)] disabled:shadow-none',
  ghost:
    'bg-[var(--lko-surface)] text-[var(--lko-ink)] border border-[var(--lko-line)] hover:border-black/[0.16]',
  soft:
    'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)] border border-[var(--lko-green)]/20 hover:border-[var(--lko-green)]/40',
  danger:
    'bg-red-50 text-red-700 border border-red-200/80 hover:border-red-300',
}

const BTN_SIZE: Record<BtnSize, string> = {
  sm: 'min-h-[38px] px-3.5 text-[13px] gap-1.5 rounded-[10px]',
  md: 'min-h-[46px] px-4 text-sm gap-2 rounded-xl',
  lg: 'min-h-[54px] px-5 text-[15px] gap-2 rounded-[14px]',
}

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  icon?: IconName
  iconEnd?: IconName
  block?: boolean
}

export function Btn({
  variant = 'primary',
  size = 'md',
  icon,
  iconEnd,
  block = true,
  className = '',
  children,
  type = 'button',
  ...rest
}: BtnProps) {
  return (
    <button
      type={type}
      className={`lko-press inline-flex items-center justify-center font-bold tracking-[-0.01em] disabled:cursor-not-allowed ${
        BTN_VARIANT[variant]
      } ${BTN_SIZE[size]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size === 'sm' ? 15 : 17} />}
    </button>
  )
}

/* -------------------------------- IconBtn -------------------------------- */

interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  /** accessible label — visually hidden */
  label: string
  size?: number
  active?: boolean
}

export function IconBtn({ icon, label, size = 20, active = false, className = '', ...rest }: IconBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`lko-press pointer-events-auto flex h-11 w-11 items-center justify-center rounded-xl lko-glass ${
        active ? 'text-[var(--lko-green)]' : 'text-[var(--lko-ink)]'
      } ${className}`}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  )
}

/* ------------------------------- GlassChip ------------------------------- */

export function GlassChip({
  children,
  className = '',
  tone = 'plain',
}: {
  children: ReactNode
  className?: string
  tone?: 'plain' | 'good' | 'bad' | 'gold'
}) {
  const tones: Record<string, string> = {
    plain: 'text-[var(--lko-ink)]',
    good: 'text-[var(--lko-green-deep)]',
    bad: 'border-red-200/80 bg-red-50/85 text-red-700',
    gold: 'text-[#8a5a00]',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold lko-glass ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* ----------------------------- SectionLabel ------------------------------ */

export function SectionLabel({ icon, children, className = '' }: { icon?: IconName; children: ReactNode; className?: string }) {
  return (
    <h2 className={`lko-label flex items-center gap-1.5 ${className}`}>
      {icon && <Icon name={icon} size={13} className="shrink-0 opacity-80" />}
      {children}
    </h2>
  )
}

/* ------------------------------- SheetShell ------------------------------ */

export function SheetShell({
  label,
  onClose,
  children,
}: {
  label: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label={label}>
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(14,20,15,0.42)] backdrop-blur-[2px]"
      />
      <div className="lko-pop absolute inset-x-0 bottom-0 mx-auto w-full max-w-md">
        <div className="lko-sheet max-h-[80dvh] overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2.5">
          <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-black/15" aria-hidden />
          {children}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- StatTile ------------------------------- */

export function StatTile({
  label,
  value,
  tone = 'plain',
}: {
  label: string
  value: ReactNode
  tone?: 'plain' | 'good' | 'bad' | 'gold'
}) {
  const tones: Record<string, string> = {
    plain: 'bg-[var(--lko-cream)] text-[var(--lko-ink)]',
    good: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
    bad: 'bg-red-50 text-red-700',
    gold: 'bg-[var(--lko-gold-soft)] text-[#8a5a00]',
  }
  return (
    <div className={`rounded-xl px-3 py-2.5 text-center ${tones[tone]}`}>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] opacity-70">{label}</p>
      <p className="lko-display mt-0.5 text-[17px] leading-tight">{value}</p>
    </div>
  )
}
