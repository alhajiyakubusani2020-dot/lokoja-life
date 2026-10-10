'use client'

/**
 * LOKOJA LIFE — BottomNav + ComingSoon (R1)
 * Mobile-first bottom navigation (5 tabs) with the coherent SVG icon set,
 * an animated active pill, and the honest "arrives in a later stage" panel.
 * Principle: never fake finished functionality.
 */

import { audio } from '@/game/systems/audio'
import { NavIcon, type NavIconKey } from './icons'

export type TabKey = NavIconKey

interface TabDef {
  key: TabKey
  label: string
}

const TABS: TabDef[] = [
  { key: 'home', label: 'Home' },
  { key: 'world', label: 'World' },
  { key: 'map', label: 'Map' },
  { key: 'work', label: 'Work' },
  { key: 'bag', label: 'Bag' },
  { key: 'profile', label: 'You' },
]

interface BottomNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
  /** attention dots — e.g. work tab pings when accepted hustles are waiting */
  badge?: Partial<Record<TabKey, boolean>>
}

export function BottomNav({ active, onChange, badge }: BottomNavProps) {
  return (
    <nav
      aria-label="Game navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-[var(--lko-surface)]/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
      style={{ boxShadow: '0 -8px 24px -18px rgba(27,34,24,0.35)' }}
    >
      {/* hairline accent that warms the bar */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[-1px] h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(232,163,23,0.35), transparent)' }}
        aria-hidden
      />
      <div className="mx-auto grid max-w-xl grid-cols-6 px-1.5">
        {TABS.map((tab) => {
          const isActive = active === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => {
                audio.play('click')
                onChange(tab.key)
              }}
              aria-current={isActive ? 'page' : undefined}
              className="lko-press group flex min-h-[58px] flex-col items-center justify-center gap-0.5 px-1 py-1.5"
            >
              <span
                className={`relative flex h-7 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--lko-green)] text-white shadow-[0_4px_10px_-3px_rgba(20,107,58,0.5)]'
                    : 'text-[var(--lko-ink-soft)] group-hover:text-[var(--lko-green)]'
                }`}
                aria-hidden
              >
                <NavIcon name={tab.key} size={19} />
                {badge?.[tab.key] && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--lko-surface)] bg-[var(--lko-terra)]" />
                )}
              </span>
              <span
                className={`text-[10.5px] font-bold leading-none transition-colors ${
                  isActive ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-ink-soft)]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

interface ComingSoonProps {
  icon: NavIconKey | 'bag'
  title: string
  stage: string
  description: string
}

/** Honest placeholder for features being built in later stages. */
export function ComingSoon({ icon, title, stage, description }: ComingSoonProps) {
  return (
    <div className="lko-card lko-pop mx-4 my-5 flex flex-col items-center p-6 text-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]">
        <NavIcon name={icon === 'bag' ? 'bag' : icon} size={30} />
      </div>
      <h3 className="lko-display text-lg">{title}</h3>
      <span className="mt-1 rounded-full bg-[var(--lko-green-soft)] px-3 py-0.5 text-xs font-bold text-[var(--lko-green-deep)]">
        Arrives in {stage}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-[var(--lko-ink-soft)]">{description}</p>
    </div>
  )
}
