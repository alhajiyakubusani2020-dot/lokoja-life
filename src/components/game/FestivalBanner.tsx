'use client'

/**
 * LOKOJA LIFE — FestivalBanner (M10: THE LIVING CALENDAR)
 * --------------------------------------------------------
 * The city's year, one glance: today's festival (with its venue + the
 * days left), the live seasons (Ramadan's fast, the ram market, Detty
 * December), the next party on the calendar, the wedding on the street,
 * the town union's paving pool, and any meat in your pocket. Pure
 * presentation over the calendar laws — every naira moves through the
 * store's festival actions.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { FESTIVALS } from '@/game/data/config'
import { LOCATION_BY_ID } from '@/game/data/locations'
import {
  festivalForDay,
  nextFestivalFrom,
  weddingForCycle,
  inRamadan,
  inDetty,
  ramMarketDayIndex,
  ramPriceFor,
  yearOf,
} from '@/game/systems/calendar'
import { formatNaira } from '@/game/systems/progression'

/** The ram market's day count for the chip. */
const A_LEN = FESTIVALS.anchors.ramMarketDays

export function FestivalBanner() {
  const world = useGameStore((s) => s.world)!
  const calendar = useGameStore((s) => s.calendar)

  const day = world.day
  const festival = festivalForDay(day)
  const next = nextFestivalFrom(day + (festival ? festival.daysLeft : 0))
  const wedding = weddingForCycle(day)
  const ramadan = inRamadan(day)
  const detty = inDetty(day)
  const ramDay = ramMarketDayIndex(day)
  const ramPrice = ramPriceFor(day)
  const paving = calendar.paving

  const quiet = !festival && !ramadan && !detty && ramDay === 0 && !wedding.isToday && wedding.inDays > 2 && !paving && calendar.meatPacks === 0
  if (quiet) {
    return (
      <div className="mb-3">
        <div
          data-testid="festival-next"
          className="flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 py-2 text-[11px] font-extrabold text-[var(--lko-ink-soft)] shadow-[var(--lko-shadow-sm)]"
        >
          <span aria-hidden>{next.festival.icon}</span>
          <span className="min-w-0 flex-1 truncate">
            Next on the calendar: <span className="text-[var(--lko-ink)]">{next.festival.name}</span> — in {next.inDays} day{next.inDays === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-3 space-y-2">
      {festival && (
        <div
          data-testid="festival-today"
          className="rounded-2xl border border-[#8a5a00]/25 bg-gradient-to-r from-[#fff8ec] to-[#fdeecd] p-3 shadow-[var(--lko-shadow-sm)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#8a5a00]">
                <span aria-hidden>{festival.icon}</span> {festival.name}
                {festival.daysLeft > 1 && (
                  <span className="rounded-full bg-[#8a5a00]/10 px-1.5 py-0.5 text-[9px] font-black">day 1 of {festival.daysLeft}</span>
                )}
              </p>
              <p className="mt-0.5 text-[11.5px] font-semibold text-[#4a3200]">{festival.note}</p>
              <p className="mt-1 text-[10.5px] font-bold text-[#8a5a00]/80">
                {LOCATION_BY_ID[festival.venueId]?.name ?? festival.venueId}
                {festival.daysLeft > 1 ? ` — runs ${festival.daysLeft} days` : ' — today only'}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/70 px-2 py-1 text-[10px] font-extrabold tabular-nums text-[#8a5a00]">
              Year {yearOf(day)}
            </span>
          </div>
        </div>
      )}

      {(ramadan || detty || ramDay > 0) && (
        <div className="flex flex-wrap gap-2" data-testid="festival-seasons">
          {ramadan && (
            <span data-testid="festival-chip-ramadan" className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4ff] px-3 py-1.5 text-[11px] font-extrabold text-[#1e3a8a]">
              🌙 Ramadan — fast dey run · iftar for evening · night market deep
            </span>
          )}
          {ramDay > 0 && (
            <span data-testid="festival-chip-ram-market" className="inline-flex items-center gap-1.5 rounded-full bg-[#fdf2e9] px-3 py-1.5 text-[11px] font-extrabold text-[#9a4b12]">
              🐏 Ram market day {ramDay}/{A_LEN} — ram na {formatNaira(ramPrice)} for Kpata
            </span>
          )}
          {detty && (
            <span data-testid="festival-chip-detty" className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1.5 text-[11px] font-extrabold text-[#14532d]">
              🎉 Detty December — returnees don land · prices ×{FESTIVALS.marketMult.detty} · gigs ×{FESTIVALS.fleetMult.detty}
            </span>
          )}
        </div>
      )}

      {wedding.isToday && (
        <div data-testid="festival-wedding" className="flex items-center gap-2 rounded-2xl border border-[#9d174d]/20 bg-[#fdf2f8] px-3 py-2 text-[11px] font-extrabold text-[#9d174d]">
          <span aria-hidden>💍</span>
          <span className="min-w-0 flex-1 truncate">
            {wedding.couple} dey wed TODAY at {LOCATION_BY_ID[wedding.venueId]?.name ?? wedding.venueId} — aso-ebi dey Kpata
          </span>
        </div>
      )}

      {paving && (
        <div data-testid="festival-paving" className="rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]">
          <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">
            <span className="flex items-center gap-1.5">
              <span aria-hidden>🛣️</span> Town union paving — {LOCATION_BY_ID[paving.zoneId]?.name ?? paving.zoneId}
            </span>
            <span className="tabular-nums">
              {formatNaira(paving.pool)} / {formatNaira(FESTIVALS.pavingTarget)}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#86c99b] to-[var(--lko-green)] transition-[width] duration-500"
              style={{ width: `${Math.min(100, Math.round((paving.pool / FESTIVALS.pavingTarget) * 100))}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
            {paving.zoneId === world.currentLocation
              ? 'You dey inside the project zone — drop your tier for the day.'
              : `Contribute from inside ${LOCATION_BY_ID[paving.zoneId]?.name ?? paving.zoneId}. Finished streets ride 15% faster for ${FESTIVALS.pavedDays} days.`}
          </p>
        </div>
      )}

      {calendar.meatPacks > 0 && (
        <div data-testid="festival-packs" className="flex items-center gap-2 rounded-2xl border border-[#9a3412]/20 bg-[#fff7ed] px-3 py-2 text-[11px] font-extrabold text-[#9a3412]">
          <span aria-hidden>🍖</span>
          <span className="min-w-0 flex-1 truncate">
            {calendar.meatPacks} meat pack{calendar.meatPacks === 1 ? '' : 's'} in your cooler — share am with your paddies
          </span>
        </div>
      )}

      {!festival && (
        <div data-testid="festival-next" className="flex items-center gap-2 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
          <span aria-hidden>{next.festival.icon}</span>
          Next: {next.festival.name} — in {next.inDays} day{next.inDays === 1 ? '' : 's'}
        </div>
      )}
    </div>
  )
}
