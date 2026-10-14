'use client'

/**
 * LOKOJA LIFE — PulseBanner (M15: THE CITY PULSE)
 * -------------------------------------------------
 * The city's newspaper, one glance on the Dashboard: today's loudest
 * headline (the weight law's top item), the unread count, and the
 * deep-link into the handset's City Pulse app. Pure presentation over
 * the DERIVED feed — the banner stores nothing, pays nothing.
 */

import { useMemo } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { pulseForDay, pulseUnread, freshPulseState } from '@/game/systems/pulse'
import { openPhoneApp } from './screens/PhoneScreen'


export function PulseBanner({ onOpenPhone }: { onOpenPhone: () => void }) {
  const world = useGameStore((s) => s.world)!
  const civic = useGameStore((s) => s.civic)!
  const chaos = useGameStore((s) => s.chaos)
  const rivers = useGameStore((s) => s.rivers)
  const calendar = useGameStore((s) => s.calendar)
  const cityPulse = useGameStore((s) => s.cityPulse)

  const items = useMemo(
    () => pulseForDay({ day: world.day, weather: world.weather, chaos, civic, rivers, calendar }),
    [world.day, world.weather, chaos, civic, rivers, calendar],
  )
  const top = items[0]
  const unread = pulseUnread(cityPulse ?? freshPulseState(), items)
  // the quiet-day line never earns a banner — a calm city needs no megaphone
  if (items.length === 1 && items[0].kind === 'quiet') return null

  return (
    <button
      data-testid="pulse-banner"
      onClick={() => {
        openPhoneApp('pulse')
        onOpenPhone()
      }}
      className="lko-press mb-3 flex w-full items-start gap-2.5 rounded-2xl border border-[#0d4d2a]/15 bg-gradient-to-r from-[#e8f5e9] to-[#f1f8f2] p-3 text-left shadow-[var(--lko-shadow-sm)]"
      aria-label="Open the City Pulse newspaper"
    >
      <span className="mt-0.5 text-xl" aria-hidden>{top.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-green-deep)]">
          📰 City Pulse
          {unread > 0 && (
            <span data-testid="pulse-banner-unread" className="rounded-full bg-[var(--lko-green)] px-1.5 py-px text-[9px] text-white">
              {unread} new
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[12.5px] font-extrabold leading-snug text-[var(--lko-ink)]">
          {top.headline}
        </span>
        <span className="mt-0.5 block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
          {top.body}
        </span>
      </span>
      <span className="mt-1 shrink-0 text-[10px] font-extrabold text-[var(--lko-green)]">
        {items.length} more →
      </span>
    </button>
  )
}
