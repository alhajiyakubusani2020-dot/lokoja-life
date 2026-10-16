/**
 * M20 — THE NATION SLICE (the ops books)
 * ---------------------------------------
 * Pure laws + the fresh state for the Nation Dashboard. The store
 * executes, the UI reads — the same doctrine as every systems module.
 *
 * THE NO-TEXT LAW: the moderation book stores {day, why, band} ONLY —
 * never a word of what anybody typed. The M17 word wall already
 * refused the text; this book counts the refusals, it does not
 * archive them. The type system enforces it: there is no field the
 * text could even live in.
 *
 * THE ONE-CHANNEL LAW: the inflation book records the SAME liquidity
 * multiplier the day roll folded into marketDayRoll (civic.ts) — the
 * dashboard reads the city's real ledger, it invents nothing.
 */

import type { CrowdSnapshot } from './nation-sim'

/* -------------------------------- the type --------------------------------- */

export interface NationState {
  /** the crowd sim's identity + the player's switch (the flag lives here, in the save) */
  crowd: { seed: number; count: number; on: boolean }
  /** the liquidity ledger — {day, mult} capped at 12, deduped by day */
  inflation: { day: number; mult: number }[]
  /** the moderation book — refusal counts ONLY, no text, cap 40 */
  moderation: { day: number; why: string; band: string }[]
  /** the telemetry opt-in (device owner's honest yes; kids are structurally dark) */
  telemetryOptIn: boolean
}

export function freshNationState(): NationState {
  return {
    crowd: { seed: 20261017, count: 10_000, on: true },
    inflation: [],
    moderation: [],
    telemetryOptIn: false,
  }
}

/* ----------------------------- the inflation book --------------------------- */

/**
 * Record the day's liquidity multiplier. Deduped by day (a sleep that
 * crosses two days posts each day once), newest last, cap 12 — the
 * dashboard shows a rolling two-week-ish ledger of the naira's moods.
 */
export function recordInflation(
  book: { day: number; mult: number }[],
  day: number,
  mult: number,
): { next: { day: number; mult: number }[]; recorded: boolean } {
  const d = Math.max(1, Math.floor(day))
  const m = Math.max(0.5, Math.min(3, Number.isFinite(mult) ? mult : 1))
  if (book.some((row) => row.day === d)) return { next: book, recorded: false }
  const next = [...book, { day: d, mult: Math.round(m * 1000) / 1000 }]
  return { next: next.slice(-12), recorded: true }
}

/** The trend the dashboard prints — the honest average of the book. */
export function inflationTrend(book: { day: number; mult: number }[]): { avg: number; hot: boolean; rows: number } {
  if (book.length === 0) return { avg: 1, hot: false, rows: 0 }
  const avg = book.reduce((a, r) => a + r.mult, 0) / book.length
  return { avg: Math.round(avg * 1000) / 1000, hot: avg >= 1.1, rows: book.length }
}

/* ---------------------------- the moderation book --------------------------- */

/** The closed set of refusal reasons the M17 tiered chat law produces. */
export const MODERATION_WHYS: readonly string[] = [
  'kid-text-refused',
  'word-wall',
  'no-links-ever',
  'too-long',
  'empty',
  'guest-mic-dark',
]

/**
 * Record one refusal. Cap 40, no text (the type forbids it), and the
 * reason must come from the closed set — an unknown why is refused
 * rather than invented (the forge never invents; neither does this).
 */
export function recordModeration(
  book: { day: number; why: string; band: string }[],
  day: number,
  why: string,
  band: string,
): { next: { day: number; why: string; band: string }[]; recorded: boolean } {
  if (!MODERATION_WHYS.includes(why)) return { next: book, recorded: false }
  const b = band === 'kid' || band === 'teen' || band === 'adult' ? band : 'unknown'
  const next = [...book, { day: Math.max(1, Math.floor(day)), why, band: b }]
  return { next: next.slice(-40), recorded: true }
}

/** Refusals grouped by reason — the dashboard's moderation row. */
export function moderationScore(book: { day: number; why: string; band: string }[]): { why: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const row of book) counts.set(row.why, (counts.get(row.why) ?? 0) + 1)
  return MODERATION_WHYS.filter((w) => counts.has(w)).map((why) => ({ why, count: counts.get(why) ?? 0 }))
}

/* ------------------------------- the crowd flag ----------------------------- */

/** Toggle the crowd sim. The seed/count ride the save so the city is
 *  the same city when you come back. */
export function crowdToggle(state: NationState, on: boolean): NationState {
  return { ...state, crowd: { ...state.crowd, on } }
}

/* --------------------------- the snapshot holder ---------------------------- */

/**
 * The session-only live snapshot (never persisted — the wire is the
 * worker's, the save keeps only the switch). The store mirrors the
 * bridge's latest aggregate here for the dashboard.
 */
let liveSnapshot: CrowdSnapshot | null = null

export function setLiveSnapshot(s: CrowdSnapshot | null): void {
  liveSnapshot = s
}

export function getLiveSnapshot(): CrowdSnapshot | null {
  return liveSnapshot
}
