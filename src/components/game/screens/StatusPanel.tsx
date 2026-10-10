'use client'

/**
 * LOKOJA LIFE — Status Panel (extracted from the Stage 1 Home tab)
 * -----------------------------------------------------------------
 * The player's condition, needs, skills, world card and rest actions.
 * Originally the Home tab; since the 3D world became the main view it
 * lives in a bottom sheet opened from the world HUD. Same behaviour:
 * rest stays gated to the home location.
 */

import { Avatar } from '../Avatar'
import { NeedsBar } from '../NeedsBar'
import { Icon, weatherIcon, type IconName } from '../ui/icons'
import { Btn, SectionLabel } from '../ui/kit'
import { audio } from '@/game/systems/audio'
import { xpToNextLevel, skillCap } from '@/game/systems/progression'
import { skillXpToNext, SKILL_META } from '@/game/systems/skills'
import { conditionSummary } from '@/game/systems/needs'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { useGameStore } from '@/game/store/useGameStore'
import type { TabKey } from '../BottomNav'

const TIME_ICON: Record<string, IconName> = {
  morning: 'sunrise',
  afternoon: 'sun',
  evening: 'sun',
  night: 'moon',
}

export function StatusPanel({ onOpenMap }: { onOpenMap?: (tab: TabKey) => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const isTravelling = useGameStore((s) => s.isTravelling)
  const rest = useGameStore((s) => s.rest)

  const condition = conditionSummary(player.needs)
  const timeIcon = TIME_ICON[world.timeOfDay] ?? 'sun'
  const loc = LOCATION_BY_ID[world.currentLocation] ?? LOCATION_BY_ID['home']
  const xpNeeded = xpToNextLevel(player.level)

  return (
    <div className="px-0 pt-1 pb-2">
      {/* condition banner */}
      <div
        className={`mb-3 flex items-center gap-2.5 rounded-xl border px-4 py-2.5 ${
          condition.tone === 'bad'
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-[var(--lko-line)] bg-[var(--lko-surface)] text-[var(--lko-ink)]'
        }`}
      >
        <Icon
          name={condition.tone === 'bad' ? 'mood' : 'sparkle'}
          size={17}
          className={condition.tone === 'bad' ? '' : 'text-[var(--lko-gold)]'}
        />
        <p className="text-[13px] font-semibold">{condition.text}</p>
      </div>

      {/* needs */}
      <section className="lko-card p-4" aria-label="Player needs">
        <SectionLabel icon="heart" className="mb-3">
          Condition
        </SectionLabel>
        <div className="flex flex-col gap-2.5">
          <NeedsBar need="health" value={player.needs.health} />
          <NeedsBar need="energy" value={player.needs.energy} />
          <NeedsBar need="hunger" value={player.needs.hunger} />
          <NeedsBar need="mood" value={player.needs.mood} />
        </div>
      </section>

      {/* skills */}
      <section className="lko-card mt-3 p-4" aria-label="Skills">
        <SectionLabel icon="sparkle" className="mb-3">
          Skills
        </SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {(
            ['hustle', 'smart', 'social'] as const
          ).map((key) => {
            const cap = skillCap(player.level)
            const capped = player.skills[key] >= cap
            const toNext = skillXpToNext()
            return (
              <div
                key={key}
                className="flex flex-col items-center rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] py-2.5"
              >
                <span className="lko-display text-[17px] leading-none text-[var(--lko-green-deep)]">
                  {player.skills[key]}
                </span>
                <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.06em] text-[var(--lko-ink-soft)]">
                  {SKILL_META[key].label}
                </span>
                {/* skill XP bar — work grinds visibly fill this */}
                <div className="mt-1.5 h-1 w-3/4 overflow-hidden rounded-full bg-black/[0.07]">
                  <div
                    className="h-full rounded-full bg-[var(--lko-gold)] transition-all duration-500"
                    style={{ width: capped ? '100%' : `${Math.min(100, (player.skillXp[key] / toNext) * 100)}%` }}
                  />
                </div>
                <span className="mt-1 text-[9px] font-bold tabular-nums text-[var(--lko-ink-soft)]">
                  {capped ? 'MAX' : `${player.skillXp[key]}/${toNext} xp`}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* world card + rest actions */}
      <section className="mt-3 grid grid-cols-2 gap-3" aria-label="Time and rest">
        <div className="lko-card flex flex-col justify-center p-4">
          <p className="lko-label">Lokoja • Day {world.day}</p>
          <p className="lko-display mt-1.5 flex items-center gap-1.5 text-[17px]">
            <Icon name={timeIcon} size={17} className="text-[var(--lko-gold)]" />
            <span className="capitalize">{world.timeOfDay}</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--lko-ink-soft)]">
            <Icon name={weatherIcon(world.weather)} size={13} />
            {world.weather === 'night-clear' ? 'Clear night' : <span className="capitalize">{world.weather}</span>}
          </p>
        </div>
        <div className="lko-card flex flex-col justify-center p-4">
          <p className="lko-label">Location</p>
          {isTravelling ? (
            <p className="lko-display mt-1.5 animate-pulse text-[17px] text-[var(--lko-gold)]">
              Travelling…
            </p>
          ) : (
            <>
              <p className="lko-display mt-1.5 flex items-center gap-1.5 text-[17px] leading-tight">
                <span aria-hidden>{loc.emoji}</span> {loc.name}
              </p>
              <p className="mt-0.5 text-xs font-semibold italic text-[var(--lko-ink-soft)]">
                “{loc.tagline}”
              </p>
            </>
          )}
        </div>

        {/* Real mechanic: rest — only possible while actually at home */}
        <div className="col-span-2 lko-card p-4">
          <SectionLabel icon="bed" className="mb-2.5">
            Rest at home
          </SectionLabel>
          {world.currentLocation === 'home' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  audio.play('click')
                  rest('nap')
                }}
                className="lko-press flex min-h-[52px] flex-col items-center justify-center rounded-xl bg-[var(--lko-gold)] px-2 py-2 text-sm font-extrabold text-[#33230a] shadow-[0_8px_20px_-10px_rgba(217,154,27,0.7)]"
              >
                Nap
                <span className="mt-0.5 block text-[10px] font-bold opacity-75">+22 Energy • 1 slot</span>
              </button>
              <button
                onClick={() => {
                  audio.play('click')
                  rest('sleep')
                }}
                className="lko-press flex min-h-[52px] flex-col items-center justify-center rounded-xl bg-[var(--lko-green)] px-2 py-2 text-sm font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(16,101,61,0.65)]"
              >
                Sleep
                <span className="mt-0.5 block text-[10px] font-bold opacity-80">Full rest • next morning</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="rounded-xl bg-black/[0.03] px-4 py-3 text-center text-xs font-semibold text-[var(--lko-ink-soft)]">
                Rest is only possible at your place.
              </p>
              {onOpenMap && (
                <Btn variant="soft" icon="map" onClick={() => { audio.play('click'); onOpenMap('map') }}>
                  Open the map to head home
                </Btn>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
