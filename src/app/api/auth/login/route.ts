/**
 * LOKOJA LIFE — M9 Guest Loop: /api/auth/login
 * Return to a claimed name. The PIN verifies timing-safe against the
 * stored scrypt hash; on success the bearer token (rotated) and the
 * cloud save (if one exists) come back — the client's merge law decides
 * what continues, and nothing is ever lost.
 *
 * PH2.5 THE THROTTLE LAW — the brute-force wall: ≤4 recorded PIN
 * failures / 15min per handle+IP arm an exponential-backoff lockout
 * (30s doubling, 15min cap); the 5th and later bad attempts — AND any
 * attempt at all while locked, right or wrong — are refused 429 before
 * the hash is ever computed (no timing oracle). A CORRECT PIN clears
 * the book. Single-instance scope: see src/lib/rate-limit.ts header.
 */
import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { db } from '@/lib/db'
import { verifyPin } from '../register/route'
import { sanitizeProfilePublic } from '@/game/systems/profile'
import { isLockedOut, recordFailure, clearFailures, rlKey, ipOf, RL_LIMITS } from '@/lib/rate-limit'

function tooMany(retryAfterSec: number) {
  return NextResponse.json({ ok: false, why: 'too-many-attempts' }, {
    status: 429,
    headers: { 'Retry-After': String(Math.max(1, retryAfterSec)) },
  })
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { handle?: string; pin?: string }
    const handle = (body.handle ?? '').trim()
    const pin = body.pin ?? ''

    // THE THROTTLE LAW — the lock is checked BEFORE the register is even
    // opened: a locked handle+IP gets the door, not a hash comparison.
    const throttleKey = rlKey('login', [handle || null, ipOf(req)])
    const lock = isLockedOut(throttleKey)
    if (lock.locked) return tooMany(lock.retryAfterSec)

    const account = await db.account.findUnique({ where: { handle }, include: { cloudSave: true } })
    if (!account || !verifyPin(pin, account.salt, account.pinHash)) {
      const armed = recordFailure(throttleKey, {
        windowMs: RL_LIMITS.LOGIN_FAIL_WINDOW_MS,
        maxFails: RL_LIMITS.LOGIN_MAX_FAILS,
        baseLockMs: RL_LIMITS.LOGIN_BASE_LOCK_MS,
        maxLockMs: RL_LIMITS.LOGIN_MAX_LOCK_MS,
      })
      const res = NextResponse.json({ ok: false, why: 'Name or PIN no match — try again.' }, { status: 401 })
      if (armed.locked) res.headers.set('Retry-After', String(armed.retryAfterSec))
      return res
    }
    clearFailures(throttleKey)

    // rotate the session token on every login (one device holds the latest)
    const token = randomBytes(24).toString('hex')
    await db.account.update({ where: { id: account.id }, data: { token } })

    const save = account.cloudSave ? (JSON.parse(account.cloudSave.data) as unknown) : null
    // M14 — the vault row's client signature rides back: the client's login
    // merge verifies it against the device fortress key BEFORE applying
    // (F2 pull gate in useGameStore.loginAccount — verifyPayload + version gate).
    const sig = account.cloudSave?.sig ?? null
    // W1 — the face rides home: the returning player's profile comes
    // with the token (null for pre-W1 names — honest absence, the
    // profile face offers the device-truth fallback).
    const profileRow = await db.profileRow.findUnique({ where: { accountId: account.id } })
    return NextResponse.json({
      ok: true,
      token,
      save,
      sig,
      band: account.ageBand,
      profile: profileRow ? sanitizeProfilePublic(profileRow) : null,
    })
  } catch {
    return NextResponse.json({ ok: false, why: 'The register no gree — try again.' }, { status: 500 })
  }
}
