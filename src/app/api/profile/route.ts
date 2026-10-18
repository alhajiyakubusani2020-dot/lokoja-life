/**
 * LOKOJA LIFE — M24 W1: /api/profile
 * The face door. Bearer-token gated (the identity law — your token,
 * your face, nobody else's). GET returns the caller's sanitized
 * profile; PATCH edits it through the SAME pure laws the register ran
 * (profilePatchVerdict — absent field keeps its value, present field
 * passes whole). A minor's profile obeys the SAME laws — the band
 * never changes what the street may see of a name.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { profilePatchVerdict, sanitizeProfilePublic, DEFAULT_LOOK_JSON } from '@/game/systems/profile'

async function bearer(req: Request) {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) return null
  const account = await db.account.findFirst({ where: { token } })
  if (!account) return null
  return account
}

export async function GET(req: Request) {
  try {
    const account = await bearer(req)
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })
    const row = await db.profileRow.findUnique({ where: { accountId: account.id } })
    // honest absence: a pre-W1 name has no row yet — null, not a lie
    return NextResponse.json({ ok: true, profile: row ? sanitizeProfilePublic(row) : null })
  } catch {
    return NextResponse.json({ ok: false, why: 'The register no gree — try again.' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const account = await bearer(req)
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })
    const body = (await req.json().catch(() => ({}))) as {
      displayName?: string
      avatarLook?: string
      bio?: string
    }
    const verdict = profilePatchVerdict(body)
    if (!verdict.ok) return NextResponse.json({ ok: false, why: verdict.why }, { status: 400 })

    const row = await db.profileRow.findUnique({ where: { accountId: account.id } })
    if (!row) {
      // a pre-W1 name adopting its first face — born now, server truth
      const created = await db.profileRow.create({
        data: {
          accountId: account.id,
          handle: account.handle,
          displayName: verdict.displayName ?? account.handle,
          avatarLook: verdict.look ? JSON.stringify(verdict.look) : DEFAULT_LOOK_JSON,
          bio: verdict.bio ?? null,
        },
      })
      return NextResponse.json({ ok: true, profile: sanitizeProfilePublic(created) })
    }

    const updated = await db.profileRow.update({
      where: { accountId: account.id },
      data: {
        displayName: verdict.displayName ?? undefined,
        avatarLook: verdict.look ? JSON.stringify(verdict.look) : undefined,
        bio: verdict.bio === undefined ? undefined : verdict.bio || null,
      },
    })
    return NextResponse.json({ ok: true, profile: sanitizeProfilePublic(updated) })
  } catch {
    return NextResponse.json({ ok: false, why: 'The register no gree — try again.' }, { status: 500 })
  }
}
