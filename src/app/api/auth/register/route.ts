/**
 * LOKOJA LIFE — M9 Guest Loop: /api/auth/register
 * Claims a name on the city's register. Handles + contacts are unique;
 * the PIN hashes with a per-account salt (scrypt); a session token comes
 * back as the cloud vault's bearer. The register never sees the PIN itself.
 */
import { NextResponse } from 'next/server'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'

const HANDLE_RE = /^[a-zA-Z0-9_]{3,16}$/
const PIN_RE = /^\d{4,8}$/
const PHONE_RE = /^\+?\d{7,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { handle?: string; contact?: string; pin?: string; ageBand?: string }
    const handle = (body.handle ?? '').trim()
    const contact = (body.contact ?? '').trim()
    const pin = body.pin ?? ''
    const ageBand = ['kid', 'teen', 'adult'].includes(body.ageBand ?? '') ? (body.ageBand as string) : 'adult'

    if (!HANDLE_RE.test(handle)) return NextResponse.json({ ok: false, why: 'Name must be 3–16 letters, numbers, underscore.' }, { status: 400 })
    if (!PIN_RE.test(pin)) return NextResponse.json({ ok: false, why: 'PIN must be 4–8 digits.' }, { status: 400 })
    if (!PHONE_RE.test(contact) && !EMAIL_RE.test(contact)) {
      return NextResponse.json({ ok: false, why: 'Enter a phone number or an email.' }, { status: 400 })
    }

    const exists = await db.account.findFirst({ where: { OR: [{ handle }, { contact }] } })
    if (exists) {
      return NextResponse.json({ ok: false, why: exists.handle === handle ? 'That name don dey the register already — login instead.' : 'That phone/email don get an account — login instead.' }, { status: 409 })
    }

    const salt = randomBytes(16).toString('hex')
    const pinHash = scryptSync(pin, salt, 32).toString('hex')
    const token = randomBytes(24).toString('hex')

    const account = await db.account.create({
      data: { handle, contact, pinHash, salt, ageBand, token },
      select: { id: true, handle: true },
    })
    void account
    return NextResponse.json({ ok: true, token })
  } catch {
    return NextResponse.json({ ok: false, why: 'The register no gree — try again.' }, { status: 500 })
  }
}

// timing-safe compare helper the login route imports
export function verifyPin(pin: string, salt: string, pinHash: string): boolean {
  try {
    const candidate = scryptSync(pin, salt, 32)
    const stored = Buffer.from(pinHash, 'hex')
    return candidate.length === stored.length && timingSafeEqual(candidate, stored)
  } catch {
    return false
  }
}
