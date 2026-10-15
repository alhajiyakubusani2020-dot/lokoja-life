/**
 * LOKOJA LIFE — M9 Guest Loop: /api/auth/login
 * Return to a claimed name. The PIN verifies timing-safe against the
 * stored scrypt hash; on success the bearer token (rotated) and the
 * cloud save (if one exists) come back — the client's merge law decides
 * what continues, and nothing is ever lost.
 */
import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { db } from '@/lib/db'
import { verifyPin } from '../register/route'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { handle?: string; pin?: string }
    const handle = (body.handle ?? '').trim()
    const pin = body.pin ?? ''

    const account = await db.account.findUnique({ where: { handle }, include: { cloudSave: true } })
    if (!account || !verifyPin(pin, account.salt, account.pinHash)) {
      return NextResponse.json({ ok: false, why: 'Name or PIN no match — try again.' }, { status: 401 })
    }

    // rotate the session token on every login (one device holds the latest)
    const token = randomBytes(24).toString('hex')
    await db.account.update({ where: { id: account.id }, data: { token } })

    const save = account.cloudSave ? (JSON.parse(account.cloudSave.data) as unknown) : null
    // M14 — the vault row's client signature rides back (the merge verifies)
    const sig = account.cloudSave?.sig ?? null
    // M17 — the ACCOUNT ROW's band is the canonical tier law (the register
    // stored it; a cloud-less account still answers to its true band)
    return NextResponse.json({ ok: true, token, save, sig, band: account.ageBand })
  } catch {
    return NextResponse.json({ ok: false, why: 'The register no gree — try again.' }, { status: 500 })
  }
}
