'use client'

/**
 * M21 — GARAGE APP (the motor park in your pocket)
 * ------------------------------------------------
 * The garage book, honest: the rides you own with their REAL fields —
 * plate, buy day, age, and today's resale value straight from the M4
 * depreciation law (62% day-one, −1.5%/day, 35% floor). Owned vehicles
 * carry NO condition/fuel meter in the save — fuel is bought at the
 * pump per trip (the M4 law: fuel < the public fare). That is stated,
 * not faked. Buy and sell go through the store's REAL doors:
 *   buyVehicle(model) — one per model, showroom price, wallet pays
 *   sellVehicle(id) — the resale law pays
 * The Motor Park board reads the M5 fleet law off the REAL garage:
 *   availableGigs(day, garage, level, weather, fleet, fuelMultFor(day))
 * — the same read the park screen makes, rain premium included.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { VEHICLES, VEHICLE_BY_MODEL } from '@/game/data/vehicles'
import { resaleValue } from '@/game/systems/garage'
import { availableGigs, gigLabel } from '@/game/systems/fleet'
import { fuelMultFor } from '@/game/systems/chaos'
import { LOCATION_BY_ID } from '@/game/data/locations'

export const APP_ID = 'garage'
export const APP_TITLE = 'Garage'
export const APP_GLYPH = '🛻'

export default function GarageApp() {
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const fleet = useGameStore((s) => s.fleet)
  const buyVehicle = useGameStore((s) => s.buyVehicle)
  const sellVehicle = useGameStore((s) => s.sellVehicle)
  if (!player || !world) return null

  const day = world.day
  const gigs = availableGigs(day, player.vehicles, player.level, world.weather, fleet, fuelMultFor(day))

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="garage-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Garage</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
          {player.vehicles.length} ride{player.vehicles.length === 1 ? '' : 's'} · one per model — Lokoja parking na real
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* the rides you own */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Your Rides</span>
          {player.vehicles.length === 0 ? (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="garage-empty">
              The garage is empty — the showroom dey wait below.
            </p>
          ) : (
            <div className="mt-1.5 space-y-1.5">
              {player.vehicles.map((v) => {
                const def = VEHICLE_BY_MODEL[v.model]
                const resale = resaleValue(v.model, v.boughtDay, day)
                return (
                  <div key={v.id} className="rounded-xl bg-black/[0.03] px-2.5 py-2" data-testid={`garage-vehicle-${v.id}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-extrabold text-[var(--lko-ink)]">
                          {def.emoji} {def.label} · {v.plate}
                        </p>
                        <p className="text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">
                          bought day {v.boughtDay} · {Math.max(0, day - v.boughtDay)} day{day - v.boughtDay === 1 ? '' : 's'} old · resale {formatNaira(resale)}
                        </p>
                        <p className="text-[9px] font-semibold text-[var(--lko-ink-soft)]">
                          Fuel dey pump-side per trip — e no dey park for garage (the M4 law: fuel &lt; the public fare).
                        </p>
                      </div>
                      <button
                        type="button"
                        data-testid={`garage-sell-${v.id}`}
                        className="lko-press shrink-0 rounded-lg bg-black/[0.06] px-2.5 py-1 text-[9.5px] font-black text-[var(--lko-ink)]"
                        onClick={() => { audio.play('click'); sellVehicle(v.id) }}
                      >
                        SELL {formatNaira(resale)}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* the showroom — the real buyVehicle door */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Showroom</span>
          <div className="mt-1.5 space-y-1.5">
            {VEHICLES.map((v) => {
              const owned = player.vehicles.some((p) => p.model === v.model)
              const affordable = player.cash >= v.price
              return (
                <div key={v.model} className="rounded-xl bg-black/[0.03] px-2.5 py-2" data-testid={`garage-model-${v.model}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-[var(--lko-ink)]">
                        {v.emoji} {v.label}{owned ? ' · in the garage' : ''}
                      </p>
                      <p className="truncate text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">{v.description}</p>
                    </div>
                    {owned ? (
                      <span className="shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green)]">YOURS</span>
                    ) : (
                      <button
                        type="button"
                        data-testid={`garage-buy-${v.model}`}
                        className={`lko-press shrink-0 rounded-lg px-2.5 py-1 text-[9.5px] font-black text-white ${affordable ? 'bg-[var(--lko-green)]' : 'bg-black/[0.25]'}`}
                        onClick={() => { audio.play('click'); buyVehicle(v.model) }}
                      >
                        {formatNaira(v.price)}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* the Motor Park board — the M5 fleet law, read live */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Motor Park Board</span>
            <span className="text-[9px] font-bold text-[var(--lko-ink-soft)]">day {day} · {world.weather}</span>
          </div>
          {gigs.length === 0 ? (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="garage-gigs-empty">
              {player.vehicles.length === 0
                ? 'No rides, no gigs — the board pays the garage, not the pocket.'
                : "Today's runs don finish — the board refreshes tomorrow."}
            </p>
          ) : (
            <div className="mt-1.5 space-y-1">
              {gigs.map((g) => (
                <div key={g.id} className="flex items-center justify-between text-[10px] font-bold" data-testid={`garage-gig-${g.id}`}>
                  <span className="truncate text-[var(--lko-ink-soft)]">
                    {VEHICLE_BY_MODEL[g.model].emoji} {gigLabel(g)}
                  </span>
                  <span className="shrink-0 text-[var(--lko-ink)]">
                    +{formatNaira(g.payout)} · fuel {formatNaira(g.fuel)}
                  </span>
                </div>
              ))}
              <p className="pt-0.5 text-[9px] font-semibold text-[var(--lko-ink-soft)]">
                Runs start at the park ({LOCATION_BY_ID['transport-area']?.shortName ?? 'Motor Park'}) — the board dey there.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
