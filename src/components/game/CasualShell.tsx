'use client'

/**
 * LOKOJA LIFE — M9: THE CASUAL SHELL (dashboard cards)
 * -----------------------------------------------------
 * GoalsCard: today's three honest goals with live progress, the naira
 * each pays, and the streak. OnboardingCard: the Street Certified arc
 * (travel → work → meal → earn) that doubles as the Guest Loop's tour.
 * Both read the SAME pure laws the store executes — display can never
 * drift from the rules.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { GOALS } from '@/game/data/config'
import { goalsFor, ensureGoals } from '@/game/systems/goals'
import { formatNaira } from '@/game/systems/progression'

export function GoalsCard() {
  const goals = useGameStore((s) => s.goals)
  const world = useGameStore((s) => s.world)!
  const account = useGameStore((s) => s.account)

  // the lazy day-roll: reads roll today's three the same way the store does
  const state = ensureGoals(goals, world.day)
  const defs = goalsFor(state)

  return (
    <section data-testid="goals-card" className="mb-3 rounded-2xl border border-[var(--lko-line)] bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
          🎯 Today&apos;s goals
        </h2>
        {state.streak > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-[#fff3e0] px-2 py-0.5 text-[10.5px] font-extrabold text-[#b35400]">
            🔥 {state.streak}-day streak
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {defs.map((g, i) => {
          const done = state.done[i]
          const prog = state.progress[g.id] ?? 0
          return (
            <li
              key={g.id}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-2 ${done ? 'bg-[var(--lko-green-soft)]' : 'bg-black/[0.035]'}`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                  done ? 'bg-[var(--lko-green)] text-white' : 'bg-white text-[var(--lko-ink-soft)]'
                }`}
                aria-hidden
              >
                {done ? '✓' : prog}
              </span>
              <span className={`min-w-0 flex-1 truncate text-[12px] font-bold ${done ? 'text-[var(--lko-green-deep)] line-through opacity-80' : 'text-[var(--lko-ink)]'}`}>
                {g.label}
                {g.target > 1 && !done ? ` (${prog}/${g.target})` : ''}
              </span>
              <span className={`shrink-0 text-[11px] font-extrabold tabular-nums ${done ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-gold-deep)]'}`}>
                {done ? 'paid' : `+${formatNaira(g.cash)}`}
              </span>
            </li>
          )
        })}
      </ul>
      {!account.linked && (
        <p className="mt-2 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
          Guest mode — claim your name before you leave the starter streets to lock these in on the cloud.
        </p>
      )}
    </section>
  )
}

export function OnboardingCard() {
  const onboarding = useGameStore((s) => s.onboarding)
  if (onboarding.done.length >= GOALS.onboardingSteps.length) return null

  return (
    <section data-testid="onboarding-card" className="mb-3 rounded-2xl border border-[var(--lko-gold)]/40 bg-[var(--lko-gold-soft)]/30 p-3">
      <h2 className="mb-1.5 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
        <span>🧭 Learn the streets</span>
        <span className="tabular-nums">
          {onboarding.done.length}/{GOALS.onboardingSteps.length}
        </span>
      </h2>
      <ul className="space-y-1">
        {GOALS.onboardingSteps.map((step) => {
          const done = onboarding.done.includes(step.id)
          return (
            <li key={step.id} className="flex items-center gap-2 text-[11.5px] font-bold">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black ${
                  done ? 'bg-[var(--lko-green)] text-white' : 'border border-black/15 bg-white text-[var(--lko-ink-soft)]'
                }`}
                aria-hidden
              >
                {done ? '✓' : ''}
              </span>
              <span className={done ? 'text-[var(--lko-ink-soft)] line-through' : 'text-[var(--lko-ink)]'}>{step.label}</span>
              {!done && <span className="min-w-0 flex-1 truncate text-right text-[10px] font-semibold text-[var(--lko-ink-soft)]">{step.hint}</span>}
            </li>
          )
        })}
      </ul>
      <p className="mt-1.5 text-[10.5px] font-extrabold text-[var(--lko-gold-deep)]">
        Finish all four — {formatNaira(GOALS.onboardingReward)} + the Street Certified badge go land.
      </p>
    </section>
  )
}
