/**
 * LOKOJA LIFE — M13 FAMILY SHIELD: /api/auth/tier
 * THE TIER GATE — Parent PIN gates tiers. A minor account (kid/teen)
 * climbs the ladder ONLY with the parent's yes: the account PIN proves
 * the caller, the parent PIN proves the guardian. Every band move —
 * climb OR demotion — carries the parent PIN; the child cannot move the
 * ladder alone. The band lives on the register row and comes back so
 * the client syncs the character.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPin, verifyParentPin } from '../register/route'
import { takeToken, rlKey, ipOf, RL_LIMITS } from '@/lib/rate-limit'

const BANDS = ['kid', 'teen', 'adult'] as const
type Band = (typeof BANDS)[number]
const ORDER: Record<Band, number> = { kid: 0, teen: 1, adult: 2 }

export async function POST(req: Request) {
  try {
    // PH2.5 THE THROTTLE LAW — the tier gate is a PIN probe door: ≤10
    // attempts/min, 429 beyond. Volume counts whether the attempt passes
    // or fails — a hammer is a hammer either way.
    // PH2.5 COMPLETION (Task 5-b) — THE KEY LAW fix: the body DECLARES a
    // handle, so it throttles TOGETHER with the IP (`kind:handle|ip`, the
    // login door's exact shape). IP-only keys let one handle be brute-
    // forced from many IPs at 10/min each; the handle half caps the
    // aggregate at 10/min no matter how many IPs knock. The body is read
    // ONCE here (a Request stream cannot be consumed twice) and the
    // malformed-JSON catch makes the garbage body a 400, not a 500.
    const body = (await req.json().catch(() => ({}))) as { handle?: string; pin?: string; parentPin?: string; toBand?: string }
    const gate = takeToken(rlKey('tier', [(body.handle ?? '').trim() || null, ipOf(req)]), RL_LIMITS.TIER_MAX_PER_WINDOW, RL_LIMITS.TIER_WINDOW_MS)
    if (!gate.ok) {
      return NextResponse.json({ ok: false, why: 'too-many-attempts' }, {
        status: 429,
        headers: { 'Retry-After': String(gate.retryAfterSec) },
      })
    }

    const handle = (body.handle ?? '').trim()
    const pin = body.pin ?? ''
    const parentPin = body.parentPin ?? ''
    const toBand = BANDS.includes(body.toBand as Band) ? (body.toBand as Band) : null

    if (!toBand) return NextResponse.json({ ok: false, why: 'Pick a tier — kid, teen or adult.' }, { status: 400 })

    const account = await db.account.findUnique({ where: { handle } })
    if (!account || !verifyPin(pin, account.salt, account.pinHash)) {
      return NextResponse.json({ ok: false, why: 'Name or PIN no match — try again.' }, { status: 401 })
    }

    const fromBand = (BANDS.includes(account.ageBand as Band) ? account.ageBand : 'adult') as Band
    if (fromBand === toBand) {
      return NextResponse.json({ ok: false, why: 'You don dey that tier already.' }, { status: 400 })
    }

    // every band move carries the parent's yes — the ladder belongs to the parent
    if (!verifyParentPin(parentPin, account.parentSalt, account.parentPinHash)) {
      return NextResponse.json({ ok: false, why: 'A parent must move that tier — the shield PIN no match.' }, { status: 403 })
    }

    await db.account.update({ where: { id: account.id }, data: { ageBand: toBand } })
    return NextResponse.json({ ok: true, ageBand: toBand })
  } catch {
    return NextResponse.json({ ok: false, why: 'The register no gree — try again.' }, { status: 500 })
  }
}
