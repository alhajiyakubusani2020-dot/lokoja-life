'use client'

/**
 * LOKOJA LIFE — MapScreen (Stage 2)
 * ----------------------------------
 * The functional Lokoja map: stylised canvas + tappable location markers
 * (current / available / locked states) + a mobile bottom-sheet location
 * panel with the travel confirmation built from the pure travel system.
 *
 * All fares, times and energy costs come from calculateTravel() —
 * nothing is hard-coded here.
 */

import { useMemo, useState } from 'react'
import { MapCanvas } from '../MapCanvas'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { calculateTravel, type TravelPlan } from '@/game/systems/travel'
import { ECONOMY, TRAVEL } from '@/game/data/config'
import { LOCATIONS, LOCATION_BY_ID, type LokojaLocation } from '@/game/data/locations'
import type { TransportId } from '@/game/types'
import { useGameStore } from '@/game/store/useGameStore'

const WEATHER_HINT: Record<string, string | null> = {
  rain: '🌧️ Rain is falling — trips take a bit longer.',
  sunny: null,
  cloudy: null,
  'night-clear': '🌙 Night roads are quiet.',
}

/* ------------------------------- marker -------------------------------- */

function Marker({
  location,
  isCurrent,
  isLocked,
  onSelect,
}: {
  location: LokojaLocation
  isCurrent: boolean
  isLocked: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      aria-label={`${location.name}${isCurrent ? ' (you are here)' : isLocked ? ' (locked)' : ''}`}
      className="lko-press absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${location.mapX}%`, top: `${location.mapY}%` }}
    >
      <span
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 text-xl shadow-md transition-transform ${
          isCurrent
            ? 'border-[var(--lko-green)] ring-4 ring-[var(--lko-green)]/30'
            : 'border-white/90'
        } ${isLocked ? 'opacity-50 grayscale' : ''}`}
        style={{ background: location.color }}
      >
        <span aria-hidden>{location.emoji}</span>
        {isCurrent && (
          <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--lko-green)] text-[9px] font-extrabold text-white">
            ✓
          </span>
        )}
        {isLocked && (
          <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#5a5a52] text-[9px] font-extrabold text-white">
            🔒
          </span>
        )}
      </span>
      <span
        className={`mt-0.5 rounded-md px-1 py-px text-[9px] font-extrabold leading-tight shadow-sm ${
          isCurrent ? 'bg-[var(--lko-green)] text-white' : 'bg-white/90 text-[var(--lko-ink)]'
        }`}
      >
        {location.shortName}
      </span>
    </button>
  )
}

/* ---------------------------- travel option ----------------------------- */

function TravelOptionRow({
  plan,
  label,
  emoji,
  disabled,
  disabledReason,
  onConfirm,
}: {
  plan: TravelPlan
  label: string
  emoji: string
  disabled: boolean
  disabledReason: string
  onConfirm: () => void
}) {
  return (
    <button
      onClick={onConfirm}
      disabled={disabled}
      className={`lko-press flex min-h-[56px] w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-left ${
        disabled
          ? 'cursor-not-allowed border-black/[0.06] bg-black/[0.03] opacity-60'
          : 'border-[var(--lko-green)]/25 bg-white hover:border-[var(--lko-green)]/60'
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-xl" aria-hidden>
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-[var(--lko-ink)]">{label}</span>
        <span className="block text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          {disabled ? disabledReason : `${plan.minutes} min trip`}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-sm font-extrabold text-[var(--lko-terra)]">
          {plan.cost === 0 ? 'Free' : formatNaira(plan.cost)}
        </span>
        <span className="block text-[11px] font-bold text-[#b57d0a]">−{plan.energyCost} ⚡</span>
      </span>
    </button>
  )
}

/* ------------------------------- map screen ----------------------------- */

export function MapScreen() {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const isTravelling = useGameStore((s) => s.isTravelling)
  const travel = useGameStore((s) => s.travel)

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const origin = LOCATION_BY_ID[world.currentLocation]
  const selected = selectedId ? LOCATION_BY_ID[selectedId] : null

  const isSelectedCurrent = selected?.id === origin.id
  const isSelectedLocked = !!selected && player.level < selected.unlockLevel

  // travel plans for the selected destination — one per available transport
  const plans = useMemo<TravelPlan[]>(() => {
    if (!selected || isSelectedCurrent || isSelectedLocked) return []
    return selected.transport.map((t) =>
      calculateTravel(origin, selected, t, world.weather, world.timeOfDay),
    )
  }, [selected, origin, isSelectedCurrent, isSelectedLocked, world.weather, world.timeOfDay])

  const openLocation = (id: string) => {
    audio.play('click')
    setSelectedId(id)
  }

  const confirmTravel = (transport: TransportId) => {
    if (!selected) return
    audio.play('click')
    travel(selected.id, transport)
    setSelectedId(null)
  }

  return (
    <div className="px-4 pt-3">
      {/* status header */}
      <div className="lko-card mb-3 flex items-center justify-between gap-2 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            📍 Current location
          </p>
          {isTravelling ? (
            <p className="lko-display animate-pulse text-base text-[var(--lko-gold)]">🛺 Travelling…</p>
          ) : (
            <p className="lko-display truncate text-base">
              {origin.emoji} {origin.name}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-green-deep)]">
          Day {world.day}
        </span>
      </div>
      {WEATHER_HINT[world.weather] && (
        <p className="mb-2 px-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          {WEATHER_HINT[world.weather]}
        </p>
      )}

      {/* map canvas + markers */}
      <div className="lko-card relative aspect-square w-full overflow-hidden p-0">
        <MapCanvas />
        {LOCATIONS.map((l) => (
          <Marker
            key={l.id}
            location={l}
            isCurrent={l.id === origin.id && !isTravelling}
            isLocked={player.level < l.unlockLevel}
            onSelect={() => openLocation(l.id)}
          />
        ))}
        {isTravelling && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--lko-cream)]/40 backdrop-blur-[1px]">
            <span className="lko-display animate-bounce rounded-full border-2 border-[var(--lko-gold)]/40 bg-white/95 px-4 py-2 text-sm shadow-md">
              🛺 Travelling…
            </span>
          </div>
        )}
      </div>

      {/* transport legend (informational, fares shown per-trip) */}
      <p className="mt-2 px-1 text-center text-[11px] font-semibold text-[var(--lko-ink-soft)]">
        🚶 Walk is free but tiring • 🛺 Keke is cheap • 🚕 Taxi is fastest
      </p>

      {/* ------------------------ location bottom sheet ------------------------ */}
      {selected && (
        <div className="fixed inset-0 z-50" role="dialog" aria-label={`${selected.name} details`}>
          {/* backdrop */}
          <button
            aria-label="Close panel"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 bg-black/40"
          />
          {/* sheet */}
          <div className="lko-pop absolute inset-x-0 bottom-0 mx-auto w-full max-w-md">
            <div className="rounded-t-3xl border-t-2 border-black/[0.08] bg-[#fffdf7] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-2xl">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15" aria-hidden />

              {/* header */}
              <div className="flex items-start gap-3">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: `${selected.color}22` }}
                  aria-hidden
                >
                  {selected.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="lko-display text-lg leading-tight">{selected.name}</h3>
                  <p className="text-xs font-semibold italic text-[var(--lko-ink-soft)]">
                    “{selected.tagline}”
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]">
                {selected.description}
              </p>

              {/* locked notice */}
              {isSelectedLocked && (
                <div className="mt-3 rounded-xl border-2 border-black/[0.06] bg-black/[0.03] p-4 text-center">
                  <p className="text-sm font-extrabold">🔒 Not open to you yet</p>
                  <p className="mt-1 text-xs text-[var(--lko-ink-soft)]">
                    Reach <b>Level {selected.unlockLevel}</b> to unlock this part of Lokoja.
                    You are Level {player.level}.
                  </p>
                </div>
              )}

              {/* activities */}
              {!isSelectedLocked && (
                <>
                  <h4 className="mb-1.5 mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
                    Activities here
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.activities.map((a) => (
                      <span
                        key={a.key}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          a.stage === 1
                            ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
                            : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'
                        }`}
                      >
                        {a.stage === 1 ? a.label : `🔒 ${a.label} (Stage ${a.stage})`}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* travel confirmation */}
              {!isSelectedCurrent && !isSelectedLocked && (
                <>
                  <h4 className="mb-1.5 mt-3 text-[11px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
                    Travel to {selected.name}? ({plans[0]?.distanceKm.toFixed(1)} km from {origin.shortName})
                  </h4>
                  <div className="flex flex-col gap-2">
                    {plans.map((plan) => {
                      const params = ECONOMY.transport[plan.transport]
                      const tooPoor = player.cash < plan.cost
                      const tooTired = player.needs.energy < plan.energyCost
                      return (
                        <TravelOptionRow
                          key={plan.transport}
                          plan={plan}
                          label={`${params.emoji} ${params.label}`}
                          emoji={params.emoji}
                          disabled={tooPoor || tooTired}
                          disabledReason={
                            tooPoor
                              ? `You need ${formatNaira(plan.cost)} for this fare`
                              : 'You are too tired for this trip'
                          }
                          onConfirm={() => confirmTravel(plan.transport)}
                        />
                      )
                    })}
                  </div>
                </>
              )}

              {/* current location note */}
              {isSelectedCurrent && (
                <p className="mt-3 rounded-xl bg-[var(--lko-green-soft)] p-3 text-center text-sm font-bold text-[var(--lko-green-deep)]">
                  ✓ You are already here.
                </p>
              )}

              <button
                onClick={() => {
                  audio.play('click')
                  setSelectedId(null)
                }}
                className="lko-press mt-3 min-h-[48px] w-full rounded-xl border-2 border-black/[0.08] bg-white py-3 text-sm font-extrabold text-[var(--lko-ink)]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
