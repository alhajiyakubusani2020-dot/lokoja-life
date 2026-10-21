/**
 * LOKOJA LIFE — M9 Guest Loop: /api/cloud/pull
 * The cloud vault's read door. Bearer-token gated; returns the stored
 * GameSave (or null) — the client's merge law decides what continues.
 * M14 — the client's HMAC rides back beside the save so the fortress
 * verifies the payload before the merge trusts it.
 *
 * PH2.5 THE THROTTLE + CEILING — ≤60 reads/hour/account (the client
 * pulls at login and on manual restore; 60 is 60× an honest day), and
 * the returned payload obeys the vault's own 512KB ceiling: an oversized
 * legacy row (pre-F1) is refused honestly, never streamed.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { takeToken, rlKey, RL_LIMITS } from '@/lib/rate-limit'

/** single-sourced with the push door's envelope ceiling */
const MAX_SAVE_BYTES = 512_000

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })

    const account = await db.account.findFirst({ where: { token }, include: { cloudSave: true } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    const gate = takeToken(rlKey('pull', [account.id]), RL_LIMITS.PULL_MAX_PER_WINDOW, RL_LIMITS.PULL_WINDOW_MS)
    if (!gate.ok) {
      return NextResponse.json({ ok: false, why: 'too-many-pulls' }, {
        status: 429,
        headers: { 'Retry-After': String(gate.retryAfterSec) },
      })
    }

    // THE PULL CEILING (PH2.5): the response can only be as big as the
    // vault's write law allows — a row above the envelope ceiling is not
    // delivered (honest refusal; every row since F1 sits far below it).
    if (account.cloudSave && account.cloudSave.data.length > MAX_SAVE_BYTES) {
      return NextResponse.json({ ok: false, why: 'vault row too large' }, { status: 400 })
    }

    const save = account.cloudSave ? JSON.parse(account.cloudSave.data) : null
    // M14 — the stored client signature (null = a pre-Fortress vault row)
    const sig = account.cloudSave?.sig ?? null
    return NextResponse.json({ ok: true, save, sig })
  } catch {
    return NextResponse.json({ ok: false, why: 'vault no gree' }, { status: 500 })
  }
}
