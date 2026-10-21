/**
 * LOKOJA LIFE — PH2.5 THE THROTTLE LAW (src/lib/rate-limit.ts)
 * ============================================================
 * The brute-force wall for the trust doors: login, tier, the wallet PIN
 * lane, and the cloud vault's read/write doors. Two mechanisms:
 *
 *  1. THE FIXED WINDOW (takeToken) — a hard ceiling on requests per key
 *     per window (`Map<key, { count, resetAt }>`). Used for volume doors
 *     (tier probes, cloud push/pull floods) where even HONEST traffic
 *     must not exceed the cap.
 *  2. THE FAILURE LOCKOUT (recordFailure / isLockedOut) — a failure
 *     counter per key per window with EXPONENTIAL BACKOFF: once
 *     `maxFails` failures are recorded inside the window, the key is
 *     locked for `baseLockMs * 2^(fails - maxFails)` (capped at
 *     `maxLockMs`). Every lockout expiry that meets a fresh failure
 *     doubles the next lock. Used for credential doors (login, PIN)
 *     where only FAILURES count — a correct password/PIN clears the
 *     book (clearFailures).
 *
 * THE KEY LAW: keys are built as `${kind}:${part}|${part}` via rlKey().
 * Identity parts come from the request itself — the handle (when the
 * caller declares one) AND the IP (x-forwarded-for's first hop, then
 * x-real-ip, else 'local'). Both parts are throttled TOGETHER: a
 * botnet of one handle from many IPs still trips the handle half; one
 * IP hammering many handles still trips the IP half (for per-IP doors
 * like tier, pass only the IP).
 *
 * SCOPE LAW — SINGLE INSTANCE: every bucket lives in THIS process's
 * memory. Behind one Next.js server (the deployment shape of this
 * project) the limits below are exact. Behind N instances the wall is
 * N× softer (each process counts its own map) — a shared store (Redis)
 * is the upgrade path, deliberately not built here: no new dependency
 * on a hot path that must never fail closed for honest players.
 *
 * FAIL-SAFE LAW: every map is bounded (MAX_KEYS) and prunes expired
 * entries opportunistically — a flood cannot OOM the relay.
 */

/** Production constants — the doors pass these; the unit probe passes
 *  its own tiny windows so the backoff math is verified in milliseconds. */
export const RL_LIMITS = {
  /** auth/login — ≤5 failure RESPONSES / 15min per handle+IP (4 recorded
   *  failures arm the lock; the 5th bad attempt is refused, so at most 5
   *  failure responses ever leave the door per window). */
  LOGIN_FAIL_WINDOW_MS: 15 * 60_000,
  LOGIN_MAX_FAILS: 4,
  LOGIN_BASE_LOCK_MS: 30_000,
  LOGIN_MAX_LOCK_MS: 15 * 60_000,
  /** auth/tier — ≤10/min/IP (a probe door, not a credential door). */
  TIER_WINDOW_MS: 60_000,
  TIER_MAX_PER_WINDOW: 10,
  /** wallet PIN inside /api/live/action — ≤5 failure RESPONSES / 15min
   *  per handle (same 4-recorded-failures arm as login). */
  PIN_FAIL_WINDOW_MS: 15 * 60_000,
  PIN_MAX_FAILS: 4,
  PIN_BASE_LOCK_MS: 30_000,
  PIN_MAX_LOCK_MS: 15 * 60_000,
  /** cloud/push — ≤30 writes/hour/account. */
  PUSH_WINDOW_MS: 3_600_000,
  PUSH_MAX_PER_WINDOW: 30,
  /** cloud/pull — ≤60 reads/hour/account. */
  PULL_WINDOW_MS: 3_600_000,
  PULL_MAX_PER_WINDOW: 60,
  /** auth/register — row-growth guard, generous for one household. */
  REGISTER_WINDOW_MS: 15 * 60_000,
  REGISTER_MAX_PER_WINDOW: 10,
} as const

export interface TakeVerdict {
  ok: boolean
  /** seconds the caller should wait before retrying (Retry-After). */
  retryAfterSec: number
}

export interface LockVerdict {
  locked: boolean
  retryAfterSec: number
  fails: number
}

interface WindowState {
  count: number
  resetAt: number
}

interface LockState {
  fails: number
  windowStart: number
  lockedUntil: number
}

const windows = new Map<string, WindowState>()
const locks = new Map<string, LockState>()

const MAX_KEYS = 10_000

/** The caller's address — the proxy hop chain's FIRST entry is the real
 *  client (the last hops are our own infra). */
export function ipOf(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) {
    const first = xf.split(',')[0]?.trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip')?.trim() || 'local'
}

/** THE KEY LAW — `${kind}:${part}|${part}`; absent parts become '-' so a
 *  key is never ambiguous. */
export function rlKey(kind: string, parts: Array<string | null | undefined>): string {
  return `${kind}:${parts.map((p) => (p && p.length > 0 ? p : '-')).join('|')}`
}

function pruneExpired(now: number): void {
  for (const [k, w] of windows) if (now >= w.resetAt) windows.delete(k)
  for (const [k, s] of locks) {
    // a lock that expired AND whose failure window is a day cold can never re-arm
    if (s.lockedUntil <= now && now - s.windowStart > 24 * 3_600_000) locks.delete(k)
  }
}

/** THE FIXED WINDOW — count one request against `limit` per `windowMs`.
 *  The count INCLUDES refused requests (the bucket fills whether the
 *  door answers ok or an error — volume is the abuse, not the outcome). */
export function takeToken(key: string, limit: number, windowMs: number): TakeVerdict {
  const now = Date.now()
  let w = windows.get(key)
  if (!w || now >= w.resetAt) {
    w = { count: 0, resetAt: now + windowMs }
    windows.set(key, w)
    if (windows.size > MAX_KEYS) pruneExpired(now)
  }
  w.count++
  if (w.count > limit) return { ok: false, retryAfterSec: Math.max(1, Math.ceil((w.resetAt - now) / 1000)) }
  return { ok: true, retryAfterSec: 0 }
}

/** THE LOCKOUT CHECK — run BEFORE verifying any credential. A locked key
 *  is refused WITHOUT a verify (no timing oracle, no "correct PIN during
 *  lockout" grace — the PoC law: the right answer still waits). */
export function isLockedOut(key: string): LockVerdict {
  const now = Date.now()
  const s = locks.get(key)
  if (!s) return { locked: false, retryAfterSec: 0, fails: 0 }
  if (s.lockedUntil > now) {
    return { locked: true, retryAfterSec: Math.max(1, Math.ceil((s.lockedUntil - now) / 1000)), fails: s.fails }
  }
  return { locked: false, retryAfterSec: 0, fails: s.fails }
}

/** THE FAILURE RECORD — one verified-but-wrong credential. When the
 *  window's failure count reaches `maxFails` the key locks for
 *  `baseLockMs * 2^(fails - maxFails)`, capped at `maxLockMs`. The
 *  backoff GROWS: every post-lockout failure doubles the next lock. */
export function recordFailure(
  key: string,
  opts: { windowMs: number; maxFails: number; baseLockMs: number; maxLockMs: number },
): LockVerdict {
  const now = Date.now()
  let s = locks.get(key)
  if (!s || now - s.windowStart >= opts.windowMs) {
    s = { fails: 0, windowStart: now, lockedUntil: 0 }
    locks.set(key, s)
    if (locks.size > MAX_KEYS) pruneExpired(now)
  }
  s.fails++
  if (s.fails >= opts.maxFails) {
    const over = s.fails - opts.maxFails
    const lock = Math.min(opts.baseLockMs * 2 ** over, opts.maxLockMs)
    if (now + lock > s.lockedUntil) s.lockedUntil = now + lock
  }
  return isLockedOut(key)
}

/** THE CLEARING — a verified-CORRECT credential wipes the book. */
export function clearFailures(key: string): void {
  locks.delete(key)
}

/** Test/probe visibility only — the unit probe reads the armed lock. */
export function __lockState(key: string): { lockedUntil: number; fails: number } {
  const s = locks.get(key)
  return { lockedUntil: s?.lockedUntil ?? 0, fails: s?.fails ?? 0 }
}
