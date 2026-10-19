'use client'

/**
 * M21 — HEALTH APP (the body book in your pocket)
 * -----------------------------------------------
 * The four needs meters exactly as the save holds them, with the REAL
 * consequence laws from the needs engine (hunger ≤ 20 drains mood −4
 * per action; hunger 0 drains health −3; energy ≤ 10 blocks strenuous
 * work) and the REAL decay the clock applies. The "where to fix it"
 * card is DERIVED from the city's own data: LOCATIONS activities
 * (eat/shop-food → hunger, rest/sleep → energy) and the FOODS table —
 * no invented clinic, no fake medicine. The age-band card reads
 * AGE_LAW (systems/shield.ts) verbatim — the same table the whole
 * game reads. Read-only: the meters move where the meters move.
 *
 * M24-UI wave 2 — the face: the meters as big honest dials (pct bars
 * with the number riding the row), the mend-card with the city's own
 * data, the age law verbatim. Every number, every testid, every law:
 * unchanged.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { NEEDS, INTERIOR } from '@/game/data/config'
import { FOODS } from '@/game/data/foods'
import { LOCATIONS } from '@/game/data/locations'
import { conditionSummary } from '@/game/systems/needs'
import { AGE_LAW } from '@/game/systems/shield'
import { FaceHero, SectionLabel, StatusChip, MiniBar } from './app-face'

export const APP_ID = 'health'
export const APP_TITLE = 'Health'
export const APP_GLYPH = '🩺'

const METERS: { key: 'health' | 'energy' | 'hunger' | 'mood'; label: string; emoji: string; tone: 'red' | 'gold' | 'terra' | 'green' }[] = [
  { key: 'health', label: 'Health', emoji: '❤️', tone: 'red' },
  { key: 'energy', label: 'Energy', emoji: '⚡', tone: 'gold' },
  { key: 'hunger', label: 'Belle (100 = full)', emoji: '🍲', tone: 'terra' },
  { key: 'mood', label: 'Mood', emoji: '🙂', tone: 'green' },
]

/** the need a location's REAL activities serve — derived, not invented */
function needServerFor(needKey: string): string[] {
  const serving: string[] = []
  for (const l of LOCATIONS) {
    const keys = l.activities.map((a) => a.key)
    const hit =
      (needKey === 'hunger' && (keys.includes('eat') || keys.includes('shop-food'))) ||
      (needKey === 'energy' && (keys.includes('rest') || keys.includes('sleep'))) ||
      (needKey === 'mood' && (keys.includes('rest') || keys.includes('eat')))
    if (hit) serving.push(l.name)
  }
  return serving
}

export default function HealthApp() {
  const player = useGameStore((s) => s.player)
  if (!player) return null

  const needs = player.needs
  const summary = conditionSummary(needs)
  const law = AGE_LAW[player.ageBand]
  const topMeals = [...FOODS].sort((a, b) => b.hungerRestore - a.hungerRestore).slice(0, 3)
  const hungerSpots = needServerFor('hunger')
  const energySpots = needServerFor('energy')

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="health-app">
      <FaceHero
        id="health"
        glyph="🩺"
        title="Health"
        sub="The body book — four meters, the engine's own laws, no invented clinic"
        hue="green"
        right={
          <span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-black backdrop-blur-sm">
            {summary.tone === 'bad' ? '⚠ body' : summary.tone === 'good' ? '✓ body' : 'body'}
          </span>
        }
      />

      <div className="mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* the four meters */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <p className={`text-[10px] font-bold ${summary.tone === 'bad' ? 'text-red-700' : summary.tone === 'good' ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-ink-soft)]'}`} data-testid="health-summary">
            {summary.text}
          </p>
          <div className="mt-2 space-y-2.5">
            {METERS.map((m) => {
              const v = needs[m.key]
              return (
                <div key={m.key} data-testid={`health-meter-${m.key}`}>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[var(--lko-ink)]">{m.emoji} {m.label}</span>
                    <span className="lko-num text-[var(--lko-ink-soft)]">{Math.round(v)}/100</span>
                  </div>
                  <div className="mt-1">
                    <MiniBar pct={v} tone={m.tone} tall />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-2.5 rounded-xl bg-[var(--lko-river-soft)] px-2.5 py-1.5">
            <p className="text-[9.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
              The engine&apos;s honest laws: hunger ≤ {NEEDS.hungerCritical} drains mood −{NEEDS.hungryMoodDrain} per action;
              hunger 0 drains health −{NEEDS.starvingHealthDrain}; energy ≤ {NEEDS.energyCritical} blocks strenuous work.
              Every clock slot outside rest drains hunger −{NEEDS.decay.hunger}, energy −{NEEDS.decay.energy}, mood −{NEEDS.decay.mood}
              {player.ageBand !== 'adult' ? ' (Chill Mode halves it)' : ''}.
            </p>
          </div>
        </div>

        {/* where the body gets fixed — derived from the city's own data */}
        <SectionLabel>Where Body Dey Mend</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <div className="space-y-1.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            <p data-testid="health-hunger-spots">
              🍲 <span className="font-extrabold text-[var(--lko-ink)]">Hunger</span> — {hungerSpots.length > 0 ? hungerSpots.join(' · ') : 'the food tables'} serve am.
            </p>
            <p data-testid="health-energy-spots">
              ⚡ <span className="font-extrabold text-[var(--lko-ink)]">Energy</span> — {energySpots.length > 0 ? energySpots.join(' · ') : 'Your Place'}: nap +{NEEDS.rest.nap.energy}, sleep +{NEEDS.rest.sleep.energy}.
            </p>
            <p>
              🙂 <span className="font-extrabold text-[var(--lko-ink)]">Mood</span> — the same rest bench: nap +{NEEDS.rest.nap.mood}, sleep +{NEEDS.rest.sleep.mood}, a night out +{INTERIOR.lounge.mood} at the lounge.
            </p>
            <p>
              ❤️ <span className="font-extrabold text-[var(--lko-ink)]">Health</span> — sleep patches +{NEEDS.rest.sleep.health}; the gym patch +{INTERIOR.gym.health} but bills −{Math.abs(INTERIOR.gym.energy)} energy.
            </p>
          </div>
          <div className="mt-2 space-y-1 border-t border-black/[0.05] pt-2">
            {topMeals.map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg bg-black/[0.02] px-2 py-1 text-[10px] font-bold" data-testid={`health-food-${f.id}`}>
                <span className="truncate text-[var(--lko-ink-soft)]">{f.emoji} {f.name}</span>
                <span className="lko-num shrink-0 text-[var(--lko-ink)]">+{f.hungerRestore} hunger · ₦{f.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* the age law — verbatim from systems/shield.ts */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Your Age Law</span>
            <StatusChip tone="gold">{player.ageBand}</StatusChip>
          </div>
          <div className="mt-1.5 space-y-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="health-age-law">
            <p>crime road: {law.crime ? 'open (adult only by design)' : 'LOCKED — the shield no dey argue'}</p>
            <p>hustles: {law.hustle === 'all' ? 'the whole board' : 'light loads only — kid-safe hustles'}</p>
            <p>social: {law.social === 'full' ? 'full chat' : 'preset emotes only'}</p>
            <p>study boost: ×{law.studyBoost} smart XP — {player.ageBand === 'adult' ? 'adult rate' : 'education-first for the young ones'}</p>
            <p>scammer literacy game: {law.scammerFeatured ? 'featured on the school sheet' : 'not featured'}</p>
            <p>JAPA gauntlet: {law.japa ? 'open' : 'locked — adult paperwork'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
