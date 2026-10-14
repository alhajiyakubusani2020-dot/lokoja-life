/**
 * LOKOJA LIFE — FleetBlock (M5: WORK & FLEET)
 * -------------------------------------------
 * The Motor Park gig board, mounted in the park's location sheet (the same
 * shared sheet the 2D map and the 3D world open). Reads the ONE derived
 * board law (availableGigs — deterministic per day + your garage) and hands
 * every run to the store's runGig action. Presentation only: payouts,
 * fuel, energy and presence rules all live in systems/fleet + the store.
 */

import { useMemo } from 'react'
import { formatNaira } from '@/game/systems/progression'
import { availableGigs } from '@/game/systems/fleet'
import { fuelMultFor } from '@/game/systems/chaos'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { VEHICLE_BY_MODEL } from '@/game/data/vehicles'
import { audio } from '@/game/systems/audio'
import { useGameStore } from '@/game/store/useGameStore'
import { Icon } from './ui/icons'

export function FleetBlock() {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const fleet = useGameStore((s) => s.fleet)
  const isTravelling = useGameStore((s) => s.isTravelling)
  const runGig = useGameStore((s) => s.runGig)

  const gigs = useMemo(
    () => availableGigs(world.day, player.vehicles, player.level, world.weather, fleet, fuelMultFor(world.day)),
    [world.day, world.weather, player.vehicles, player.level, fleet],
  )
  const atPark = world.currentLocation === 'transport-area'

  const run = (gigId: string) => {
    audio.play('click')
    runGig(gigId)
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--lko-gold)]/40 bg-[var(--lko-gold-soft)]/25 p-3">
      <h4 className="lko-label mb-1.5 flex items-center gap-1.5">
        <span aria-hidden>🛵</span> Driver gigs today
        <span className="ml-auto rounded-full bg-black/[0.06] px-2 py-0.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
          passengers pay · you burn the fuel
        </span>
      </h4>

      {player.vehicles.length === 0 && (
        <p className="text-xs leading-relaxed text-[var(--lko-ink-soft)]">
          No ride in your garage yet — the Motor Park showroom dey sell right here.
          Buy one and the park go start giving you runs.
        </p>
      )}

      {player.vehicles.length > 0 && gigs.length === 0 && (
        <p className="text-xs leading-relaxed text-[var(--lko-ink-soft)]">
          You don clear today&apos;s board. Tomorrow get their own runs — come back fresh.
        </p>
      )}

      {gigs.map((gig) => {
        const vdef = VEHICLE_BY_MODEL[gig.model]
        const dest = LOCATION_BY_ID[gig.toId]
        const tooTired = player.needs.energy < gig.energyCost
        const blocked = !atPark || tooTired || isTravelling
        const reason = !atPark
          ? 'You no dey the park — travel come first'
          : tooTired
            ? 'You are too tired for this run'
            : 'You are travelling'
        return (
          <button
            key={gig.id}
            data-testid={gig.id}
            onClick={() => run(gig.id)}
            disabled={blocked}
            className={`lko-press mt-1.5 flex min-h-[56px] w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left first:mt-0 ${
              blocked
                ? 'cursor-not-allowed border-black/[0.06] bg-white opacity-55'
                : 'border-[var(--lko-gold)]/50 bg-white hover:border-[var(--lko-gold)]'
            }`}
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-xl"
              aria-hidden
            >
              {vdef.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-extrabold text-[var(--lko-ink)]">
                Run to {dest?.shortName ?? gig.toId}
                {gig.rainPremium && (
                  <span className="ml-1.5 rounded-full bg-[var(--lko-gold)]/25 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#8a5a00]">
                    rain pay
                  </span>
                )}
              </span>
              <span className="block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                {blocked ? reason : `Your ${vdef.short} · ${gig.distanceKm.toFixed(1)} km · ${gig.minutes} min · fuel −${formatNaira(gig.fuel)}`}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-sm font-extrabold tabular-nums text-[var(--lko-green-deep)]">
                +{formatNaira(gig.payout)}
              </span>
              <span className="block text-[10px] font-bold tabular-nums text-[var(--lko-ink-soft)]">−{gig.energyCost} energy</span>
            </span>
          </button>
        )
      })}

      {player.vehicles.length > 0 && gigs.length > 0 && !atPark && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          <Icon name="lock" size={11} /> The board opens when you stand inside the Motor Park.
        </p>
      )}
    </div>
  )
}
