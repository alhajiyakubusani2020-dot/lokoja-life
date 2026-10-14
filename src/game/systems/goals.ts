/**
 * LOKOJA LIFE — M9: THE CASUAL SHELL (pure rules)
 * ------------------------------------------------
 * The daily goal engine: every morning rolls THREE honest goals from the
 * life the player actually leads — one gig, one meal, one collection —
 * each worth real naira and real XP, with a streak that remembers.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the goals for (day, index) are hash-picked
 *    from the pool — same day, same goals, reload-proof.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the
 *    UI only reads them.
 *  - Every naira/XP constant lives in config.GOALS — nothing hard-coded.
 */

import type { GoalState } from '../types'
import { GOALS } from '../data/config'
import { civicHash } from './civic'

/* --------------------------------- fresh state ------------------------------- */

/** Fresh goal slice — day 0 forces the first read to roll today's three. */
export function freshGoalState(): GoalState {
  return {
    day: 0,
    ids: [],
    progress: {},
    done: [],
    streak: 0,
    lastDoneDay: 0,
  }
}

/* --------------------------------- goal pool -------------------------------- */

export interface GoalDef {
  id: string
  /** the life event that advances this goal */
  kind: string
  label: string
  target: number
  cash: number
  xp: number
}

export const GOAL_POOL: GoalDef[] = GOALS.pool

/** The day's three goals — distinct pool rows, hash-picked, deterministic. */
export function dailyGoals(day: number): GoalDef[] {
  const picked: GoalDef[] = []
  const used = new Set<number>()
  for (let i = 0; i < GOALS.perDay && picked.length < GOALS.perDay; i++) {
    let idx = civicHash('goal', day, i) % GOAL_POOL.length
    // walk forward off already-picked rows so one day never repeats a goal
    let tries = 0
    while (used.has(idx) && tries < GOAL_POOL.length) {
      idx = (idx + 1) % GOAL_POOL.length
      tries++
    }
    if (used.has(idx)) continue
    used.add(idx)
    picked.push(GOAL_POOL[idx])
  }
  return picked
}

/** Roll (or keep) the day's goals — lazy day-roll the UI/store read first. */
export function ensureGoals(state: GoalState, day: number): GoalState {
  if (state.day === day && state.ids.length === GOALS.perDay) return state
  const goals = dailyGoals(day)
  return {
    day,
    ids: goals.map((g) => g.id),
    progress: {},
    done: goals.map(() => false),
    streak: state.streak,
    lastDoneDay: state.lastDoneDay,
  }
}

/** The defs for the state's current ids (data-changed safe). */
export function goalsFor(state: GoalState): GoalDef[] {
  return state.ids
    .map((id) => GOAL_POOL.find((g) => g.id === id))
    .filter((g): g is GoalDef => !!g)
}

export interface GoalBumpResult {
  next: GoalState
  /** goals completed by THIS bump (empty most of the time) */
  completed: GoalDef[]
  /** true when this bump completed the day's full set (streak advances) */
  perfectDay: boolean
}

/**
 * One life event lands on the goals. Reaching a target completes the goal
 * exactly once; the third completion of a day advances the streak — but
 * only when YESTERDAY (or today, already counted) kept it alive.
 */
export function bumpGoal(state: GoalState, kind: string, day: number): GoalBumpResult {
  const ensured = ensureGoals(state, day)
  const defs = goalsFor(ensured)
  const completed: GoalDef[] = []
  let perfectDay = false

  const progress = { ...ensured.progress }
  const done = [...ensured.done]
  defs.forEach((def, i) => {
    if (def.kind !== kind || done[i]) return
    const next = (progress[def.id] ?? 0) + 1
    progress[def.id] = next
    if (next >= def.target) {
      done[i] = true
      completed.push(def)
    }
  })

  let streak = ensured.streak
  let lastDoneDay = ensured.lastDoneDay
  if (completed.length > 0 && done.every(Boolean) && !ensured.done.every(Boolean)) {
    // the full set just completed — the streak continues only off yesterday
    streak = ensured.lastDoneDay === day - 1 || ensured.lastDoneDay === day ? streak + 1 : 1
    lastDoneDay = day
    perfectDay = true
  }

  return { next: { ...ensured, progress, done, streak, lastDoneDay }, completed, perfectDay }
}
