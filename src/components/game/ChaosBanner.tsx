'use client'

/**
 * LOKOJA LIFE — ChaosBanner (M8: THE CHAOS ENGINE)
 * -------------------------------------------------
 * The city's grid + naira mood, one glance: an active transformer outage
 * (with the community fix pool + in-person contribution tiers) and today's
 * cash weather (scarcity / ajo payout). Pure presentation over the store's
 * chaos slice — every naira moves through contributeToPool / bankWithdraw.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { CHAOS } from '@/game/data/config'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { isScarcityDay, isPayoutDay } from '@/game/systems/chaos'
import { formatNaira } from '@/game/systems/progression'
import { audio } from '@/game/systems/audio'

export function ChaosBanner() {
  const chaos = useGameStore((s) => s.chaos)
  const world = useGameStore((s) => s.world)!
  const player = useGameStore((s) => s.player)!
  const contributeToPool = useGameStore((s) => s.contributeToPool)

  const outage = chaos.active
  const scarcity = isScarcityDay(world.day)
  const payout = isPayoutDay(world.day)
  const inDarkZone = outage !== null && world.currentLocation === outage.zoneId
  const contributedToday = outage !== null && outage.playerContribDays.includes(world.day)
  const need = outage ? Math.max(0, CHAOS.poolTarget - outage.pool) : 0

  if (!outage && !scarcity && !payout) return null

  return (
    <div className="mb-3 space-y-2">
      {outage && (
        <div
          data-testid="chaos-outage"
          className="rounded-2xl border border-[#c0392b]/30 bg-[#2b1a16] p-3 text-white shadow-[var(--lko-shadow-sm)]"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#ffb4a0]">
                <span className="animate-pulse" aria-hidden>⚡</span> Blackout — {LOCATION_BY_ID[outage.zoneId]?.name ?? outage.zoneId}
              </p>
              <p className="mt-0.5 text-[11.5px] font-semibold text-white/70">
                {inDarkZone
                  ? 'Your whole area don go dark — shops dey run blank.'
                  : 'That side don dark. Your side still get light.'}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-[10px] font-extrabold tabular-nums">
              Day {outage.startedDay}→{outage.minUntilDay}
            </span>
          </div>

          {/* community fix pool */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-white/60">
              <span>Community light fund</span>
              <span className="tabular-nums">
                {formatNaira(outage.pool)} / {formatNaira(CHAOS.poolTarget)}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#ffb4a0] to-[#ffd166] transition-[width] duration-500"
                style={{ width: `${Math.min(100, Math.round((outage.pool / CHAOS.poolTarget) * 100))}%` }}
              />
            </div>
            {inDarkZone && !contributedToday ? (
              <div className="mt-2 flex gap-1.5">
                {CHAOS.poolTiers.map((tier) => (
                  <button
                    key={tier}
                    data-testid={`chaos-give-${tier}`}
                    disabled={player.cash < tier}
                    onClick={() => {
                      audio.play('click')
                      contributeToPool(tier)
                    }}
                    className="lko-press flex-1 rounded-lg bg-[#ffd166] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40"
                  >
                    Drop {formatNaira(tier)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-1.5 text-[10.5px] font-bold text-white/55">
                {need <= 0
                  ? 'Pool don complete — technician dey come tomorrow morning.'
                  : inDarkZone
                    ? 'You don contribute today — the street dey grateful.'
                    : `${formatNaira(need)} more — contribute from inside the dark zone.`}
              </p>
            )}
          </div>
        </div>
      )}

      {(scarcity || payout) && (
        <div className="flex flex-wrap gap-2" data-testid="chaos-money-weather">
          {scarcity && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdecea] px-3 py-1.5 text-[11px] font-extrabold text-[#8a2a20]">
              💸 Cash scarcity — ATM dey dry · POS levy · fuel na black market
            </span>
          )}
          {payout && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-3 py-1.5 text-[11px] font-extrabold text-[#1b5e20]">
              🐷 Ajo payout day — market prices soft small
            </span>
          )}
        </div>
      )}
    </div>
  )
}
