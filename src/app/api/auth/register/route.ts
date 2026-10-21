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
import { profileVerdict, sanitizeProfilePublic } from '@/game/systems/profile'
import { takeToken, rlKey, ipOf, RL_LIMITS } from '@/lib/rate-limit'

const HANDLE_RE = /^[a-zA-Z0-9_]{3,16}$/
const PIN_RE = /^\d{4,8}$/
const PARENT_PIN_RE = /^\d{6}$/
const PHONE_RE = /^\+?\d{7,15}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    // PH2.5 THE THROTTLE LAW — the register mints rows: ≤10 claims / 15min
    // per IP (a generous household cap — row growth is the abuse here).
    const gate = takeToken(rlKey('register', [ipOf(req)]), RL_LIMITS.REGISTER_MAX_PER_WINDOW, RL_LIMITS.REGISTER_WINDOW_MS)
    if (!gate.ok) {
      return NextResponse.json({ ok: false, why: 'too-many-attempts' }, {
        status: 429,
        headers: { 'Retry-After': String(gate.retryAfterSec) },
      })
    }
    const body = (await req.json().catch(() => ({}))) as {
      handle?: string
      contact?: string
      pin?: string
      ageBand?: string
      parentPin?: string
      displayName?: string
      avatarLook?: string
      bio?: string
    }
    const handle = (body.handle ?? '').trim()
    const contact = (body.contact ?? '').trim()
    const pin = body.pin ?? ''
    const ageBand = ['kid', 'teen', 'adult'].includes(body.ageBand ?? '') ? (body.ageBand as string) : 'adult'
    const minor = ageBand !== 'adult'

    if (!HANDLE_RE.test(handle)) return NextResponse.json({ ok: false, why: 'Name must be 3–16 letters, numbers, underscore.' }, { status: 400 })
    if (!PIN_RE.test(pin)) return NextResponse.json({ ok: false, why: 'PIN must be 4–8 digits.' }, { status: 400 })

    // W1 — THE FACE LAW: the claim carries the whole profile. The SAME
    // pure verdict the sheet ran runs here — neither side can drift.
    const profile = profileVerdict({
      displayName: body.displayName ?? '',
      avatarLook: body.avatarLook ?? '',
      bio: body.bio ?? '',
    })
    if (!profile.ok) return NextResponse.json({ ok: false, why: profile.why }, { status: 400 })

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
    } else if (contact) {
      // W1 — the v2 register law: contact is OPTIONAL and nullable
      // (validated-if-present, never demanded). The M13 minor shield
      // never collects it; adults MAY leave a recovery line.
      if (!PHONE_RE.test(contact) && !EMAIL_RE.test(contact)) {
        return NextResponse.json({ ok: false, why: 'That phone/email no valid — or leave am empty.' }, { status: 400 })
      }
    }

    // minors have no contact — uniqueness rides the handle alone
    const exists = await db.account.findFirst({ where: minor || !contact ? { handle } : { OR: [{ handle }, { contact }] } })
    if (exists) {
      return NextResponse.json({ ok: false, why: exists.handle === handle ? 'That name don dey the register already — login instead.' : 'That phone/email don get an account — login instead.' }, { status: 409 })
    }

    const salt = randomBytes(16).toString('hex')
    const pinHash = scryptSync(pin, salt, 32).toString('hex')
    const token = randomBytes(24).toString('hex')

    // W1 — THE BIRTH LAW: the identity and its face are born together.
    // One transaction: if the profile row cannot exist, the account
    // does not either — no faceless citizens on the street.
    const created = await db.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          handle,
          // M13 — zero collection: the minor's contact never touches the disk
          contact: minor ? null : contact || null,
          pinHash,
          salt,
          ageBand,
          parentPinHash,
          parentSalt,
          token,
        },
        select: { id: true, handle: true },
      })
      await tx.profileRow.create({
        data: {
          accountId: account.id,
          handle: account.handle,
          displayName: profile.displayName!,
          avatarLook: JSON.stringify(profile.look),
          bio: profile.bio ?? null,
        },
      })
      return account
    })
    return NextResponse.json({
      ok: true,
      token,
      profile: sanitizeProfilePublic({
        handle: created.handle,
        displayName: profile.displayName!,
        avatarLook: JSON.stringify(profile.look),
        bio: profile.bio ?? null,
      }),
    })
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
