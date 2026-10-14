/**
 * LOKOJA LIFE — M9 Guest Loop: /api/auth/register
 * Claims a name on the city's register. Handles + contacts are unique;
 * the PIN hashes with a per-account salt (scrypt); a session token comes
 * back as the cloud vault's bearer. The register never sees the PIN itself.
 *
 * M13 — THE FAMILY SHIELD: a minor account (kid/teen) only exists behind
 * a parent's 6-digit PIN (scrypt, its own salt) and collects NOTHING —
 * no contact, no recovery line, no address. The contact column stays
 * null; the parent PIN is the only key a minor account answers to.
 */
import { NextResponse } from 'next/server'
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { db } from '@/lib/db'

const HANDLE_RE = /^[a-zA-Z0-9_]{3,16}$/
const PIN_RE = /^\d{4,8}$/
const PARENT_PIN_RE = /^\d{6}$/
const PHONE_RE = /^\+?\d{7,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { handle?: string; contact?: string; pin?: string; ageBand?: string; parentPin?: string }
    const handle = (body.handle ?? '').trim()
    const contact = (body.contact ?? '').trim()
    const pin = body.pin ?? ''
    const ageBand = ['kid', 'teen', 'adult'].includes(body.ageBand ?? '') ? (body.ageBand as string) : 'adult'
    const minor = ageBand !== 'adult'

    if (!HANDLE_RE.test(handle)) return NextResponse.json({ ok: false, why: 'Name must be 3–16 letters, numbers, underscore.' }, { status: 400 })
    if (!PIN_RE.test(pin)) return NextResponse.json({ ok: false, why: 'PIN must be 4–8 digits.' }, { status: 400 })

    // M13 — the minor register law: parent PIN required, contact FORBIDDEN
    let parentPinHash: string | null = null
    let parentSalt: string | null = null
    if (minor) {
      const parentPin = body.parentPin ?? ''
      if (!PARENT_PIN_RE.test(parentPin)) {
        return NextResponse.json({ ok: false, why: 'A parent must set the shield PIN — exactly 6 digits.' }, { status: 400 })
      }
      if (parentPin === pin) {
        return NextResponse.json({ ok: false, why: 'The parent PIN must differ from the account PIN.' }, { status: 400 })
      }
      parentSalt = randomBytes(16).toString('hex')
      parentPinHash = scryptSync(parentPin, parentSalt, 32).toString('hex')
    } else {
      if (!PHONE_RE.test(contact) && !EMAIL_RE.test(contact)) {
        return NextResponse.json({ ok: false, why: 'Enter a phone number or an email.' }, { status: 400 })
      }
    }

    // minors have no contact — uniqueness rides the handle alone
    const exists = await db.account.findFirst({ where: minor ? { handle } : { OR: [{ handle }, { contact }] } })
    if (exists) {
      return NextResponse.json({ ok: false, why: exists.handle === handle ? 'That name don dey the register already — login instead.' : 'That phone/email don get an account — login instead.' }, { status: 409 })
    }

    const salt = randomBytes(16).toString('hex')
    const pinHash = scryptSync(pin, salt, 32).toString('hex')
    const token = randomBytes(24).toString('hex')

    await db.account.create({
      data: {
        handle,
        // M13 — zero collection: the minor's contact never touches the disk
        contact: minor ? null : contact,
        pinHash,
        salt,
        ageBand,
        parentPinHash,
        parentSalt,
        token,
      },
      select: { id: true, handle: true },
    })
    return NextResponse.json({ ok: true, token })
  } catch (e) {
    console.error('[register] FAILED:', JSON.stringify({ name: (e as {name?:string})?.name, msg: (e as {message?:string})?.message, code: (e as {code?:string})?.code, stack: (e as Error)?.stack?.slice(0, 400) }))
    return NextResponse.json({ ok: false, why: 'The register no gree — try again.' }, { status: 500 })
  }
}

// timing-safe compare helper the login/tier routes import
export function verifyPin(pin: string, salt: string, pinHash: string): boolean {
  try {
    const candidate = scryptSync(pin, salt, 32)
    const stored = Buffer.from(pinHash, 'hex')
    return candidate.length === stored.length && timingSafeEqual(candidate, stored)
  } catch {
    return false
  }
}

/** M13 — the parent-PIN verify (same timing-safe discipline). */
export function verifyParentPin(pin: string, salt: string | null, pinHash: string | null): boolean {
  if (!salt || !pinHash) return false
  return verifyPin(pin, salt, pinHash)
}
