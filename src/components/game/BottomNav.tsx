'use client'

/**
 * LOKOJA LIFE — BottomNav + ComingSoon
 * Mobile-first bottom navigation (5 tabs) and the honest
 * "arrives in a later stage" panel used for unbuilt features.
 * Principle: never fake finished functionality.
 */

import { audio } from '@/game/systems/audio'

export type TabKey = 'home' | 'map' | 'work' | 'bag' | 'profile'

interface TabDef {
  key: TabKey
  label: string
  icon: string
}

const TABS: TabDef[] = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'map', label: 'Map', icon: '🗺️' },
  { key: 'work', label: 'Work', icon: '💼' },
  { key: 'bag', label: 'Bag', icon: '🎒' },
  { key: 'profile', label: 'Profile', icon: '⭐' },
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
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t-2 border-black/[0.06] bg-[#fffdf7]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 px-2">
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
              className={`lko-press flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-[var(--lko-green)]' : 'text-[var(--lko-ink-soft)]'
              }`}
            >
              <span
                className={`relative flex h-7 w-12 items-center justify-center rounded-lg text-lg transition-colors ${
                  isActive ? 'bg-[var(--lko-green-soft)]' : ''
                }`}
                aria-hidden
              >
                {tab.icon}
                {badge?.[tab.key] && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#fffdf7] bg-[var(--lko-terra)]" />
                )}
              </span>
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

interface ComingSoonProps {
  icon: string
  title: string
  stage: string
  description: string
}

/** Honest placeholder for features being built in later stages. */
export function ComingSoon({ icon, title, stage, description }: ComingSoonProps) {
  return (
    <div className="lko-card lko-pop mx-4 my-5 flex flex-col items-center p-6 text-center">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lko-gold-soft)] text-3xl">
        {icon}
      </div>
      <h3 className="lko-display text-lg">{title}</h3>
      <span className="mt-1 rounded-full bg-[var(--lko-green-soft)] px-3 py-0.5 text-xs font-bold text-[var(--lko-green)]">
        Arrives in {stage}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-[var(--lko-ink-soft)]">{description}</p>
    </div>
  )
}
