/**
 * TEAM BRAVO PH2.5 — rate-limit unit probe (real import, no mocks).
 * Run: bun scripts/audit-tmp/bravo25/rate-limit-probe.ts
 *
 * Verifies src/lib/rate-limit.ts laws:
 *  1. FIXED WINDOW fills → refusals carry a Retry-After, resets when the
 *     window rolls (tiny windowMs, real sleeps).
 *  2. FAILURE LOCKOUT arms at maxFails, refuses (locked) even a
 *     credential check, and the backoff GROWS across successive
 *     lockouts (base * 2^over, capped).
 *  3. clearFailures wipes the book — the honest credential law.
 */
import {
  takeToken, isLockedOut, recordFailure, clearFailures, rlKey, ipOf, RL_LIMITS, __lockState,
} from '../../../src/lib/rate-limit'

let pass = 0, fail = 0
function check(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) pass++; else fail++
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} → got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`)
}
const sec = (t: string) => console.log(`\n== ${t} ==`)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* 1 — the fixed window */
sec('1. FIXED WINDOW (limit 3 / 100ms)')
const wkey = rlKey('probe-window', ['k1'])
check('req1 ok', takeToken(wkey, 3, 100).ok, true)
check('req2 ok', takeToken(wkey, 3, 100).ok, true)
check('req3 ok', takeToken(wkey, 3, 100).ok, true)
const r4 = takeToken(wkey, 3, 100)
check('req4 refused', r4.ok, false)
check('req4 carries retryAfterSec', r4.retryAfterSec > 0, true)
await sleep(120)
check('window rolls → reset works', takeToken(wkey, 3, 100).ok, true)

/* 2 — the failure lockout with exponential backoff */
sec('2. FAILURE LOCKOUT (maxFails 2, base 60ms, cap 10s) — backoff grows')
const lkey = rlKey('probe-lock', ['k2'])
check('locked before any failure', isLockedOut(lkey).locked, false)
recordFailure(lkey, { windowMs: 60_000, maxFails: 2, baseLockMs: 60, maxLockMs: 10_000 })
check('fail 1: not locked yet', isLockedOut(lkey).locked, false)
const arm = recordFailure(lkey, { windowMs: 60_000, maxFails: 2, baseLockMs: 60, maxLockMs: 10_000 })
check('fail 2: locks', arm.locked, true)
check('fail 2: lock ≈ 60ms backoff', __lockState(lkey).lockedUntil - Date.now() <= 60 && __lockState(lkey).lockedUntil > Date.now() - 60, true)
await sleep(80)
check('lock expires', isLockedOut(lkey).locked, false)
const grow = recordFailure(lkey, { windowMs: 60_000, maxFails: 2, baseLockMs: 60, maxLockMs: 10_000 })
check('fail 3: backoff GROWS to ≈120ms', grow.locked && Math.abs(__lockState(lkey).lockedUntil - Date.now() - 120) <= 60, true)
await sleep(140)
const grow2 = recordFailure(lkey, { windowMs: 60_000, maxFails: 2, baseLockMs: 60, maxLockMs: 10_000 })
check('fail 4: backoff GROWS to ≈180ms', grow2.locked && Math.abs(__lockState(lkey).lockedUntil - Date.now() - 180) <= 70, true)

/* 3 — the clearing */
sec('3. CLEARING (correct credential wipes the book)')
clearFailures(lkey)
check('cleared → not locked', isLockedOut(lkey).locked, false)
check('cleared → fails 0', isLockedOut(lkey).fails, 0)

/* 4 — key building + ip */
sec('4. KEY LAW + IP LAW')
check('rlKey shape', rlKey('login', ['ada', '9.9.9.9']), 'login:ada|9.9.9.9')
check('rlKey absent part', rlKey('pin', [null]), 'pin:-')
const fakeReq = new Request('http://x/', { headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' } })
check('ipOf takes first forwarded hop', ipOf(fakeReq), '1.2.3.4')
check('ipOf fallback', ipOf(new Request('http://x/')), 'local')

/* 5 — the production constants */
sec('5. PRODUCTION CONSTANTS (the doors)')
check('LOGIN window 15min', RL_LIMITS.LOGIN_FAIL_WINDOW_MS, 900_000)
check('LOGIN arms after 4 fails', RL_LIMITS.LOGIN_MAX_FAILS, 4)
check('LOGIN backoff base 30s / cap 15min', [RL_LIMITS.LOGIN_BASE_LOCK_MS, RL_LIMITS.LOGIN_MAX_LOCK_MS], [30_000, 900_000])
check('TIER 10/min', [RL_LIMITS.TIER_MAX_PER_WINDOW, RL_LIMITS.TIER_WINDOW_MS], [10, 60_000])
check('PUSH 30/h', [RL_LIMITS.PUSH_MAX_PER_WINDOW, RL_LIMITS.PUSH_WINDOW_MS], [30, 3_600_000])
check('PULL 60/h', [RL_LIMITS.PULL_MAX_PER_WINDOW, RL_LIMITS.PULL_WINDOW_MS], [60, 3_600_000])

console.log(`\n== RATE-LIMIT PROBE: ${pass} PASS / ${fail} FAIL ==`)
process.exit(fail === 0 ? 0 : 1)
