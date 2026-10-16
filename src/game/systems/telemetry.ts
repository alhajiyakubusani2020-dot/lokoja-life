/**
 * M20 — THE TELEMETRY LAW (opt-in or nothing)
 * --------------------------------------------
 * One honest counter book, kept locally, flushed ONLY when the device
 * owner opted in — and even then, NEVER for a kid. The kid refusal is
 * STRUCTURAL: recordTelemetry takes the band as an argument and the
 * kid branch returns before anything can be counted. There is no
 * code path, flag, or override that counts a child.
 *
 * THE CLOSED-ENUM LAW: keys come from TELEMETRY_KEYS only — no free
 * text, no invented metrics, nothing personal ever (no handles, no
 * streets, no naira amounts — just "how many times did the day roll").
 */

export const TELEMETRY_KEYS = [
  'day-rolled',
  'travel-made',
  'gig-run',
  'meal-bought',
  'biz-earned',
  'festival-attended',
  'flood-cut',
  'share-sent',
] as const

export type TelemetryKey = (typeof TELEMETRY_KEYS)[number]
export type AgeBand = 'kid' | 'teen' | 'adult' | null

export interface TelemetryBook {
  optIn: boolean
  day: number
  counts: Partial<Record<TelemetryKey, number>>
}

export function freshTelemetryBook(): TelemetryBook {
  return { optIn: false, day: 1, counts: {} }
}

const KEY_CAP = 9999
const DAY_CAP = 100_000

/**
 * Record one event. THE KID WALL: band 'kid' → refused before the
 * opt-in is even read — a child's copy of this game produces ZERO
 * rows, structurally, forever (the M13 doctrine at the ops layer).
 */
export function recordTelemetry(
  book: TelemetryBook,
  key: TelemetryKey,
  band: AgeBand,
  day: number,
): { next: TelemetryBook; recorded: boolean } {
  if (band === 'kid') return { next: book, recorded: false }
  if (!book.optIn) return { next: book, recorded: false }
  if (!TELEMETRY_KEYS.includes(key)) return { next: book, recorded: false }
  const counts = { ...book.counts }
  counts[key] = Math.min(KEY_CAP, (counts[key] ?? 0) + 1)
  return { next: { optIn: true, day: Math.min(DAY_CAP, Math.max(1, Math.floor(day))), counts }, recorded: true }
}

/** The payload the flush sends — clamped, closed-enum, nothing else. */
export function telemetryPayload(book: TelemetryBook): { day: number; counters: Partial<Record<TelemetryKey, number>> } | null {
  if (!book.optIn) return null
  const counters: Partial<Record<TelemetryKey, number>> = {}
  for (const k of TELEMETRY_KEYS) {
    const v = book.counts[k]
    if (typeof v === 'number' && v > 0) counters[k] = v
  }
  return { day: Math.max(1, Math.floor(book.day)), counters }
}

/** The day crossing: the book rides the new day, counts persist a week-ish window (cap by reset every 30 days). */
export function telemetryDayRoll(book: TelemetryBook, newDay: number): TelemetryBook {
  if (newDay - book.day >= 30) return { optIn: book.optIn, day: Math.max(1, Math.floor(newDay)), counts: {} }
  return { ...book, day: Math.max(1, Math.floor(newDay)) }
}
