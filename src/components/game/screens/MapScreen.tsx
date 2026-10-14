'use client'

/**
 * LOKOJA LIFE — MapScreen (Stage 2, R1 presentation pass)
 * -------------------------------------------------------
 * The functional Lokoja map: stylised canvas + tappable location markers
 * (current / available / locked states) + a bottom-sheet location panel
 * with the travel confirmation built from the pure travel system.
 *
 * R1 changes are presentation-only: SVG place icons on the markers, an
 * honest lock treatment without "Coming Soon" noise, slide-up sheet motion,
 * transport rows with the shared icon language. All fares, times and energy
 * costs still come from calculateTravel() — nothing is hard-coded here.
 */

import { useEffect, useMemo, useState } from 'react'
import { MapCanvas } from '../MapCanvas'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { type TravelPlan } from '@/game/systems/travel'
import { allTravelOptions } from '@/game/systems/garage'
import { ECONOMY, TRAVEL, WORLD3D, FOOD } from '@/game/data/config'
import { LOCATIONS, LOCATION_BY_ID, type LokojaLocation } from '@/game/data/locations'
import { bizAtLocation } from '@/game/systems/biz'
import { VEHICLE_BY_MODEL } from '@/game/data/vehicles'
import { WEATHER_META } from '@/game/data/config'
import { weatherBlocksLocation, isNightMarketOpen } from '@/game/systems/seasons'
import { BizBlock } from '../BizBlock'
import { FleetBlock } from '../FleetBlock'
import type { TransportId } from '@/game/types'
import { useGameStore } from '@/game/store/useGameStore'
import {
  PlaceIcon,
  TransportIcon,
  PinIcon,
  KekeIcon,
  WeatherIcon,
  LockIcon,
  CheckIcon,
  EnergyIcon,
  ClockIcon,
  ArrowRightIcon,
} from '../icons'

// M6 — one dictionary for every weather word. Tips come straight from
// WEATHER_META, so a new sky can never ship with a silent HUD.
const WEATHER_HINT: Record<string, string | null> = Object.fromEntries(
  Object.entries(WEATHER_META).map(([k, v]) => [k, v.tip]),
)

/* ------------------------------- marker -------------------------------- */

function Marker({
  location,
  isCurrent,
  isLocked,
  bizDot,
  civicAlert,
  garageDot,
  onSelect,
}: {
  location: LokojaLocation
  isCurrent: boolean
  isLocked: boolean
  /** M3 — an owned business here has money sitting in the till */
  bizDot?: boolean
  /** M2 — the civic mesh is waiting at this pin (bill due / tax / warrant) */
  civicAlert?: boolean
  /** M4 — the Motor Park garage sells rides here */
  garageDot?: boolean
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
        className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-md transition-transform ${
          isCurrent
            ? 'border-[var(--lko-green)] ring-4 ring-[var(--lko-green)]/25'
            : 'border-white/95'
        } ${isLocked ? 'opacity-45 grayscale' : ''}`}
        style={{ background: location.color }}
      >
        <PlaceIcon id={location.id} size={17} className="text-white" />
        {isCurrent && (
          <span className="absolute -bottom-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-[var(--lko-green)]" style={{ width: 18, height: 18 }}>
            <CheckIcon size={9} className="text-white" />
          </span>
        )}
        {isLocked && (
          <span className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center rounded-full border-2 border-white bg-[#5a5a52]" style={{ width: 18, height: 18 }}>
            <LockIcon size={9} className="text-white" />
          </span>
        )}
        {bizDot && !isLocked && (
          <span className="absolute -top-1.5 -left-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-white bg-[var(--lko-gold)] text-[8px] font-black text-[#3d2a00]" style={{ width: 18, height: 18 }} aria-hidden>
            ₦
          </span>
        )}
        {civicAlert && !isLocked && (
          <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-white bg-[#c0392b]" style={{ width: 14, height: 14 }} aria-hidden />
        )}
        {garageDot && !isLocked && (
          <span
            data-testid="map-garage-dot"
            className="absolute -bottom-1.5 -left-1.5 flex items-center justify-center rounded-full border-2 border-white bg-[#3f6b4f] text-[8px]"
            style={{ width: 18, height: 18 }}
            aria-hidden
          >
            🔧
          </span>
        )}
      </span>
      <span
        className={`mt-1 rounded-md px-1.5 py-px text-[9px] font-extrabold leading-tight shadow-sm ${
          isCurrent ? 'bg-[var(--lko-green)] text-white' : 'bg-white/95 text-[var(--lko-ink)]'
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
  transport,
  personal,
  emoji,
  disabled,
  disabledReason,
  onConfirm,
}: {
  plan: TravelPlan
  label: string
  transport: TransportId
  /** M4 — your own ride: fuel, not a fare */
  personal?: boolean
  /** M4 — emoji for personal rides (TransportIcon only knows public modes) */
  emoji?: string
  disabled: boolean
  disabledReason: string
  onConfirm: () => void
}) {
  return (
    <button
      onClick={onConfirm}
      disabled={disabled}
      className={`lko-press flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-3 py-2 text-left ${
        disabled
          ? 'cursor-not-allowed border-black/[0.05] bg-black/[0.03] opacity-60'
          : personal
            ? 'border-[var(--lko-gold)]/50 bg-[var(--lko-gold-soft)]/40 hover:border-[var(--lko-gold)]'
            : 'border-black/[0.07] bg-white hover:border-[var(--lko-green)]/50'
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          disabled ? 'bg-black/[0.05] text-[var(--lko-ink-soft)]' : 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]'
        }`}
        aria-hidden
      >
        {personal && emoji ? <span className="text-[19px] leading-none">{emoji}</span> : <TransportIcon name={transport as 'walk' | 'keke' | 'taxi'} size={20} />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-[var(--lko-ink)]">
          {label}
          {personal && (
            <span className="ml-1.5 rounded-full bg-[var(--lko-gold)]/25 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#8a5a00]">
              fuel · no fare
            </span>
          )}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          {disabled ? (
            disabledReason
          ) : (
            <>
              <ClockIcon size={11} />
              {plan.minutes} min trip
            </>
          )}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="lko-num block text-sm font-extrabold text-[var(--lko-terra)]">
          {plan.cost === 0 ? 'Free' : formatNaira(plan.cost)}
        </span>
        <span className="lko-num flex items-center justify-end gap-0.5 text-[11px] font-bold text-[#b57d0a]">
          <EnergyIcon size={11} />−{plan.energyCost}
        </span>
      </span>
    </button>
  )
}

/* ------------------------------- map screen ----------------------------- */

interface MapScreenProps {
  /** deep-link: open the sheet for this location (Work screen → map handoff) */
  focusLocationId?: string | null
  /** called once the focus has been applied (lets the parent reset it) */
  onFocusHandled?: () => void
  /** deep-link out: activity chips for live work content jump to the Work tab */
  onOpenWork?: () => void
}

export function MapScreen({
  focusLocationId,
  onFocusHandled,
  onOpenWork,
}: MapScreenProps) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const civic = useGameStore((s) => s.civic)!
  const isTravelling = useGameStore((s) => s.isTravelling)
  const travel = useGameStore((s) => s.travel)
  const eatMeal = useGameStore((s) => s.eatMeal)
  const mealPriceAt = useGameStore((s) => s.mealPriceAt)

  const [userSelectedId, setUserSelectedId] = useState<string | null>(focusLocationId ?? null)

  /* ---------------- exploration progress (session-spanning, not in the save) ---------------- */

  const [discovered, setDiscovered] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(WORLD3D.discoveryKey)
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch {
      return new Set()
    }
  })
  const [recordedLoc, setRecordedLoc] = useState(world.currentLocation)

  // visiting a place counts too — travelling IS discovering
  // (adjust-state-during-render: syncs discovery to the live location)
  if (recordedLoc !== world.currentLocation) {
    setRecordedLoc(world.currentLocation)
    setDiscovered((prev) => {
      if (prev.has(world.currentLocation)) return prev
      const next = new Set(prev)
      next.add(world.currentLocation)
      try {
        localStorage.setItem(WORLD3D.discoveryKey, JSON.stringify([...next]))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const undiscovered = LOCATIONS.filter((l) => !discovered.has(l.id))

  // consume the focus request (parent clears it) — the selection itself was
  // already captured in the state initializer above
  useEffect(() => {
    if (focusLocationId) onFocusHandled?.()
  }, [focusLocationId, onFocusHandled])

  const origin = LOCATION_BY_ID[world.currentLocation]
  const selected = userSelectedId ? LOCATION_BY_ID[userSelectedId] : null

  const isSelectedCurrent = selected?.id === origin.id
  const isSelectedLocked = !!selected && player.level < selected.unlockLevel

  // travel options for the selected destination — public modes + YOUR rides (M4)
  // M6 — a flood day closes the riverfront: the Confluence simply has no
  // travel rows today, and the sheet says why.
  const flooded = !!selected && weatherBlocksLocation(world.weather, selected.id)
  const plans = useMemo(() => {
    if (!selected || isSelectedCurrent || isSelectedLocked) return []
    if (weatherBlocksLocation(world.weather, selected.id)) return []
    return allTravelOptions(origin, selected, world.weather, world.timeOfDay, player.vehicles)
  }, [selected, origin, isSelectedCurrent, isSelectedLocked, world.weather, world.timeOfDay, player.vehicles])

  const openLocation = (id: string) => {
    audio.play('click')
    setUserSelectedId(id)
  }

  const confirmTravel = (transport: TransportId) => {
    if (!selected) return
    audio.play('click')
    travel(selected.id, transport)
    setUserSelectedId(null)
  }

  return (
    <div className="px-4 pt-3 sm:px-6">
      {/* status header */}
      <div className="lko-card mb-3 flex items-center gap-3 px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-river-soft)] text-[var(--lko-river)]" aria-hidden>
          <PinIcon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
            Current location
          </p>
          {isTravelling ? (
            <p className="lko-display flex animate-pulse items-center gap-1.5 text-base text-[var(--lko-gold-deep)]">
              <KekeIcon size={16} /> Travelling…
            </p>
          ) : (
            <p className="lko-display flex items-center gap-1.5 truncate text-base">
              <PlaceIcon id={origin.id} size={16} className="shrink-0 text-[var(--lko-terra)]" />
              {origin.name}
            </p>
          )}
        </div>
        <span className="lko-num shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-green-deep)]">
          Day {world.day}
        </span>
      </div>
      {/* M4 — your rides: the garage follows you onto the map */}
      {player.vehicles.length > 0 && (
        <p
          data-testid="map-rides"
          className="mb-2 flex flex-wrap items-center gap-1.5 px-1 text-[11px] font-bold text-[var(--lko-ink-soft)]"
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wide">Your rides:</span>
          {player.vehicles.map((v) => (
            <span
              key={v.id}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[10.5px] font-extrabold text-[#8a5a00]"
            >
              {VEHICLE_BY_MODEL[v.model].emoji} {VEHICLE_BY_MODEL[v.model].short}
              <span className="lko-num font-bold opacity-70">{v.plate}</span>
            </span>
          ))}
        </p>
      )}
      {WEATHER_HINT[world.weather] && (
        <p className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          <WeatherIcon name={world.weather} size={13} />
          {WEATHER_HINT[world.weather]}
        </p>
      )}
      {world.weather === 'flood' && (
        <p className="mb-2 flex items-center gap-1.5 rounded-xl border border-[var(--lko-river)]/30 bg-[var(--lko-river-soft)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--lko-river)]">
          🌊 Flood watch: the Confluence riverfront is CLOSED today — journeys crawl, food prices climb.
        </p>
      )}

      {/* map canvas + markers — hero of the screen: status header above,
          atlas + legend below; square art so the pin overlay never drifts */}
      <div className="-mx-2 sm:mx-auto w-auto sm:w-full sm:max-w-[620px] lg:max-w-[640px]">
        <div className="lko-card relative aspect-square w-full overflow-hidden p-0">
          <MapCanvas />
          {LOCATIONS.map((l) => {
            // M3/M2 map layer — the city tells you where business & civic business waits
            const host = bizAtLocation(l.id)
            const owned = host ? player.businesses.find((b) => b.typeId === host.typeId) : undefined
            const bizDot = !!owned && owned.accrued > 0
            const civicAlert =
              l.id === 'government-area' && !!civic &&
              (civic.nepa.owed > 0 || civic.kgirs.assessed > 0 || civic.kgirs.warrant)
            return (
              <Marker
                key={l.id}
                location={l}
                isCurrent={l.id === origin.id && !isTravelling}
                isLocked={player.level < l.unlockLevel}
                bizDot={bizDot}
                civicAlert={civicAlert}
                garageDot={l.id === 'transport-area'}
                onSelect={() => openLocation(l.id)}
              />
            )
          })}
          {isTravelling && (
            <div className="lko-scrim absolute inset-0 z-20 flex items-center justify-center bg-[var(--lko-cream)]/40 backdrop-blur-[1px]">
              <span className="lko-display flex items-center gap-2 rounded-full border border-[var(--lko-gold)]/40 bg-white/95 px-4 py-2 text-sm shadow-md">
                <KekeIcon size={17} className="animate-pulse text-[var(--lko-gold-deep)]" />
                Travelling…
              </span>
            </div>
          )}
        </div>
      </div>

      {/* exploration progress — walk the 3D city or travel to fill the atlas */}
      <div className="lko-card mt-3 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
            Lokoja atlas
          </p>
          <span className="lko-num rounded-full bg-[var(--lko-river-soft)] px-2.5 py-0.5 text-[11px] font-extrabold text-[var(--lko-river)]">
            {discovered.size}/{LOCATIONS.length} explored
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-[var(--lko-green)] transition-[width] duration-500"
            style={{ width: `${(discovered.size / LOCATIONS.length) * 100}%` }}
          />
        </div>
        {undiscovered.length > 0 ? (
          <p className="mt-2 text-[11.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
            Still out there: {undiscovered.map((l) => l.name).join(', ')}. Walk there in the 3D city to discover it.
          </p>
        ) : (
          <p className="mt-2 text-[11.5px] font-semibold leading-snug text-[var(--lko-green-deep)]">
            You don find every corner of Lokoja. The whole city sabi your face. 🏙️
          </p>
        )}
      </div>

      {/* transport legend (informational, fares shown per-trip) */}
      <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-[11px] font-semibold text-[var(--lko-ink-soft)]">
        <span className="inline-flex items-center gap-1"><TransportIcon name="walk" size={13} /> Walk is free but tiring</span>
        <span className="inline-flex items-center gap-1"><TransportIcon name="keke" size={13} /> Keke is cheap</span>
        <span className="inline-flex items-center gap-1"><TransportIcon name="taxi" size={13} /> Taxi is fastest</span>
      </p>
      {/* M4 — the garage layer legend */}
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-[11px] font-semibold text-[var(--lko-ink-soft)]">
        <span className="inline-flex items-center gap-1"><span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#3f6b4f] text-[7px]">🔧</span> Motor Park garage sells rides</span>
        <span className="inline-flex items-center gap-1">🏍️ Your rides sip fuel — no fare</span>
        <span className="inline-flex items-center gap-1">🛵 Own a ride? Driver gigs wait at the park</span>
      </p>
      {/* M3/M2 — the civic & business layer legend */}
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-1 text-center text-[11px] font-semibold text-[var(--lko-ink-soft)]">
        <span className="inline-flex items-center gap-1"><span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--lko-gold)] text-[7px] font-black text-[#3d2a00]">₦</span> Your shop has money</span>
        <span className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#c0392b]" /> Government wan see you</span>
      </p>

      {/* ------------------------ location bottom sheet ------------------------ */}
      {selected && (
        <div className="fixed inset-0 z-50" role="dialog" aria-label={`${selected.name} details`}>
          {/* backdrop */}
          <button
            aria-label="Close panel"
            onClick={() => setUserSelectedId(null)}
            className="lko-scrim absolute inset-0 bg-black/45"
          />
          {/* sheet */}
          <div className="lko-sheet absolute inset-x-0 bottom-0 mx-auto w-full max-w-md">
            <div className="max-h-[86dvh] overflow-y-auto rounded-t-3xl border-t border-black/[0.06] bg-[var(--lko-surface)] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-[var(--lko-shadow-lg)]">
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15" aria-hidden />

              {/* header */}
              <div className="flex items-start gap-3">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: `${selected.color}1e`, color: selected.accent }}
                  aria-hidden
                >
                  <PlaceIcon id={selected.id} size={28} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="lko-display text-lg leading-tight">{selected.name}</h3>
                  <p className="mt-0.5 text-xs font-semibold italic text-[var(--lko-ink-soft)]">
                    “{selected.tagline}”
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]">
                {selected.description}
              </p>

              {/* locked notice — honest, quiet */}
              {isSelectedLocked && (
                <div className="mt-3 rounded-xl border border-black/[0.06] bg-black/[0.03] p-4 text-center">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-extrabold">
                    <LockIcon size={15} className="text-[var(--lko-ink-soft)]" />
                    Not open to you yet
                  </p>
                  <p className="mt-1 text-xs text-[var(--lko-ink-soft)]">
                    Reach <b>Level {selected.unlockLevel}</b> to unlock this part of Lokoja.
                    You are Level {player.level}.
                  </p>
                </div>
              )}

              {/* activities */}
              {!isSelectedLocked && (
                <>
                  {/* the eating loop — live here too, same store action as the 3D world */}
                  {(selected.id === 'food-area' || selected.id === 'kpata-market') && (
                    <div className="mt-3 rounded-xl border border-black/[0.06] bg-[var(--lko-gold-soft)]/40 p-3">
                      <p className="mb-2 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]">
                        {selected.id === 'food-area' ? '🍲 Eat a proper meal' : '🧺 Market fresh'}
                        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[9.5px] font-bold normal-case text-[var(--lko-ink-soft)]">
                          hunger {Math.round(player.needs.hunger)}%
                        </span>
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {FOOD.meals.map((m) => {
                          // M6 — night dishes wake only at the night market
                          if (m.night) return null
                          const price = mealPriceAt(m.key, selected.id)
                          const afford = player.cash >= price
                          return (
                            <button
                              key={m.key}
                              disabled={!afford || isTravelling}
                              onClick={() => {
                                audio.play('click')
                                eatMeal(m.key, selected.id)
                              }}
                              className={`lko-press flex min-h-[48px] items-center gap-2.5 rounded-lg border border-black/[0.05] bg-white px-2.5 py-1.5 text-left ${
                                afford ? '' : 'cursor-not-allowed opacity-55'
                              }`}
                            >
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[12.5px] font-extrabold leading-tight">{m.label}</span>
                                <span className="block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">{m.detail}</span>
                              </span>
                              <span className="flex shrink-0 flex-col items-end">
                                <span className="lko-num text-[12px] font-extrabold text-[var(--lko-green)]">{formatNaira(price)}{price !== m.price && <span className="ml-0.5 text-[9px] font-bold text-[var(--lko-gold-deep)]">today</span>}</span>
                                <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">+{m.hunger} hunger</span>
                              </span>
                            </button>
                          )
                        })}
                        {/* M6 — the night market: food strip stalls that wake after dark */}
                        {selected.id === 'food-area' && isNightMarketOpen(world.timeOfDay) && (
                          <>
                            <p className="mt-1.5 flex items-center justify-between rounded-lg bg-[#0a1230] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[#ffd88a]">
                              <span>🌙 Night market dey open</span>
                              <span className="font-bold opacity-80">late plates, fair price</span>
                            </p>
                            {FOOD.meals.filter((m) => m.night).map((m) => {
                              const price = mealPriceAt(m.key, selected.id)
                              const afford = player.cash >= price
                              return (
                                <button
                                  key={m.key}
                                  disabled={!afford || isTravelling}
                                  onClick={() => {
                                    audio.play('click')
                                    eatMeal(m.key, selected.id)
                                  }}
                                  className={`lko-press flex min-h-[48px] items-center gap-2.5 rounded-lg border border-[#0a1230]/15 bg-[#0a1230]/[0.04] px-2.5 py-1.5 text-left ${
                                    afford ? '' : 'cursor-not-allowed opacity-55'
                                  }`}
                                >
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[12.5px] font-extrabold leading-tight">🌙 {m.label}</span>
                                    <span className="block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">{m.detail}</span>
                                  </span>
                                  <span className="flex shrink-0 flex-col items-end">
                                    <span className="lko-num text-[12px] font-extrabold text-[var(--lko-green)]">{formatNaira(price)}</span>
                                    <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">+{m.hunger} hunger</span>
                                  </span>
                                </button>
                              )
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <h4 className="mb-1.5 mt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
                    Activities here
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.activities.map((a) => {
                      // eat / shop-food render as the meal menu above
                      if ((a.key === 'eat' || a.key === 'shop-food') && (selected.id === 'food-area' || selected.id === 'kpata-market')) return null
                      // Stage 3: work content is live — chips deep-link to the Work tab
                      const isLive = a.stage <= 3
                      const isWork = a.key.startsWith('job-') || a.key === 'hustle'
                      if (isLive && isWork && onOpenWork) {
                        return (
                          <button
                            key={a.key}
                            onClick={() => {
                              audio.play('click')
                              setUserSelectedId(null)
                              onOpenWork()
                            }}
                            className="lko-press inline-flex items-center gap-0.5 rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-gold-deep)]"
                          >
                            {a.label}
                            <ArrowRightIcon size={11} />
                          </button>
                        )
                      }
                      return (
                        <span
                          key={a.key}
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            isLive
                              ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
                              : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'
                          }`}
                        >
                          {!isLive && <LockIcon size={10} />}
                          {a.label}
                          {!isLive && ` (Stage ${a.stage})`}
                        </span>
                      )
                    })}
                  </div>
                  {/* M3 — the shopfront: this location's business (buy/collect/upgrade) */}
                  {!isSelectedLocked && <BizBlock locationId={selected.id} />}

                  {/* M5 — the Motor Park gig board: your garage becomes today's work */}
                  {!isSelectedLocked && selected.id === 'transport-area' && <FleetBlock />}
                </>
              )}

              {/* travel confirmation */}
              {!isSelectedCurrent && !isSelectedLocked && (
                <>
                  <h4 className="lko-num mb-1.5 mt-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
                    Travel to {selected.name}? ({plans[0]?.plan.distanceKm.toFixed(1)} km from {origin.shortName})
                  </h4>
                  {flooded ? (
                    <p className="mt-1 flex items-center gap-1.5 rounded-xl border border-[var(--lko-river)]/30 bg-[var(--lko-river-soft)] px-3 py-2.5 text-[12px] font-bold text-[var(--lko-river)]">
                      🌊 Flood don block the road — the riverfront is closed today. Come back when the water drop.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {plans.map((option) => {
                        const tooPoor = player.cash < option.plan.cost
                        const tooTired = player.needs.energy < option.plan.energyCost
                        return (
                          <TravelOptionRow
                            key={option.transport}
                            plan={option.plan}
                            label={option.label}
                            transport={option.transport}
                            personal={option.personal}
                            emoji={option.emoji}
                            disabled={tooPoor || tooTired}
                            disabledReason={
                              tooPoor
                                ? `You need ${formatNaira(option.plan.cost)} for this ${option.personal ? 'fuel' : 'fare'}`
                                : 'You are too tired for this trip'
                            }
                            onConfirm={() => confirmTravel(option.transport)}
                          />
                        )
                      })}
                    </div>
                  )}
                </>
              )}

              {/* current location note */}
              {isSelectedCurrent && (
                <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--lko-green-soft)] p-3 text-center text-sm font-bold text-[var(--lko-green-deep)]">
                  <CheckIcon size={15} />
                  You are already here.
                </p>
              )}

              <button
                onClick={() => {
                  audio.play('click')
                  setUserSelectedId(null)
                }}
                className="lko-press mt-3 min-h-[48px] w-full rounded-xl border border-black/[0.08] bg-white py-3 text-sm font-extrabold text-[var(--lko-ink)]"
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
