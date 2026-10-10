'use client'

/**
 * LOKOJA LIFE — LocationSheet (shared, Stage 3.5)
 * ------------------------------------------------
 * The bottom-sheet location panel: description, activities, travel
 * confirmation rows. Extracted from the Stage 2 MapScreen so BOTH the
 * 2D map and the 3D world open the exact same panel — one interaction
 * language, one set of fares straight from calculateTravel().
 */

import { useMemo } from 'react'
import { Icon } from './ui/icons'
import { Btn, SheetShell } from './ui/kit'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { calculateTravel, type TravelPlan } from '@/game/systems/travel'
import { ECONOMY } from '@/game/data/config'
import { LOCATION_BY_ID } from '@/game/data/locations'
import type { TransportId } from '@/game/types'
import { useGameStore } from '@/game/store/useGameStore'

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
      className={`lko-press flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-3 py-2 text-left ${
        disabled
          ? 'cursor-not-allowed border-[var(--lko-line)] bg-black/[0.02] opacity-55'
          : 'border-[var(--lko-line)] bg-[var(--lko-surface)] hover:border-[var(--lko-green)]/50'
      }`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
        style={{ background: 'var(--lko-cream)' }}
        aria-hidden
      >
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-[var(--lko-ink)]">{label}</span>
        <span className="block text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          {disabled ? disabledReason : `${plan.minutes} min trip`}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-sm font-extrabold tabular-nums text-[var(--lko-terra)]">
          {plan.cost === 0 ? 'Free' : formatNaira(plan.cost)}
        </span>
        <span className="block text-[11px] font-bold tabular-nums text-[#8a5a00]">−{plan.energyCost} energy</span>
      </span>
    </button>
  )
}

export interface LocationSheetProps {
  locationId: string
  onClose: () => void
  /** deep-link out: live work chips jump to the Work tab */
  onOpenWork?: () => void
  /**
   * Optional travel interceptor — the 3D world uses this to capture the
   * journey before the store action runs. When absent the store action
   * is called directly (2D map behaviour).
   */
  onTravel?: (destinationId: string, transport: TransportId) => void
}

export function LocationSheet({ locationId, onClose, onOpenWork, onTravel }: LocationSheetProps) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const travel = useGameStore((s) => s.travel)

  const selected = LOCATION_BY_ID[locationId]
  const origin = LOCATION_BY_ID[world.currentLocation]

  const isSelectedCurrent = selected?.id === origin.id
  const isSelectedLocked = !!selected && player.level < selected.unlockLevel

  // travel plans for the selected destination — one per available transport
  const plans = useMemo<TravelPlan[]>(() => {
    if (!selected || isSelectedCurrent || isSelectedLocked) return []
    return selected.transport.map((t) =>
      calculateTravel(origin, selected, t, world.weather, world.timeOfDay),
    )
  }, [selected, origin, isSelectedCurrent, isSelectedLocked, world.weather, world.timeOfDay])

  if (!selected) return null

  const confirmTravel = (transport: TransportId) => {
    audio.play('click')
    if (onTravel) onTravel(selected.id, transport)
    else travel(selected.id, transport)
    onClose()
  }

  return (
    <SheetShell label={`${selected.name} details`} onClose={onClose}>
      {/* header */}
      <div className="flex items-start gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
          style={{ background: `${selected.color}1f` }}
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
        <div className="mt-3 rounded-xl border border-[var(--lko-line)] bg-black/[0.02] p-4 text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm font-extrabold">
            <Icon name="lock" size={15} /> Not open to you yet
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
          <h4 className="lko-label mb-1.5 mt-3.5">Activities here</h4>
          <div className="flex flex-wrap gap-1.5">
            {selected.activities.map((a) => {
              // Stage 3: work content is live — chips deep-link to the Work tab
              const isLive = a.stage <= 3
              const isWork = a.key.startsWith('job-') || a.key === 'hustle'
              if (isLive && isWork && onOpenWork) {
                return (
                  <button
                    key={a.key}
                    onClick={() => {
                      audio.play('click')
                      onClose()
                      onOpenWork()
                    }}
                    className="lko-press flex items-center gap-1 rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[11px] font-bold text-[#8a5a00]"
                  >
                    {a.label}
                    <Icon name="arrow-up-right" size={11} />
                  </button>
                )
              }
              return (
                <span
                  key={a.key}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    isLive
                      ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
                      : 'bg-black/[0.04] text-[var(--lko-ink-soft)]'
                  }`}
                >
                  {!isLive && <Icon name="lock" size={10} />}
                  {isLive ? a.label : `${a.label} (Stage ${a.stage})`}
                </span>
              )
            })}
          </div>
        </>
      )}

      {/* travel confirmation */}
      {!isSelectedCurrent && !isSelectedLocked && (
        <>
          <h4 className="lko-label mb-1.5 mt-3.5">
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
                  label={params.label}
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
        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--lko-green-soft)] p-3 text-center text-sm font-bold text-[var(--lko-green-deep)]">
          <Icon name="check" size={15} /> You are already here.
        </p>
      )}

      <Btn variant="ghost" onClick={() => { audio.play('click'); onClose() }} className="mt-3">
        Cancel
      </Btn>
    </SheetShell>
  )
}
