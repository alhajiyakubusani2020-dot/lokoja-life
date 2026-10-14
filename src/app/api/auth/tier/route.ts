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

const BANDS = ['kid', 'teen', 'adult'] as const
type Band = (typeof BANDS)[number]
const ORDER: Record<Band, number> = { kid: 0, teen: 1, adult: 2 }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { handle?: string; pin?: string; parentPin?: string; toBand?: string }
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
