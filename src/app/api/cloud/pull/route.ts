/**
 * LOKOJA LIFE — M9 Guest Loop: /api/cloud/pull
 * The cloud vault's read door. Bearer-token gated; returns the stored
 * GameSave (or null) — the client's merge law decides what continues.
 * M14 — the client's HMAC rides back beside the save so the fortress
 * verifies the payload before the merge trusts it.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })

    const account = await db.account.findFirst({ where: { token }, include: { cloudSave: true } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    const save = account.cloudSave ? JSON.parse(account.cloudSave.data) : null
    // M14 — the stored client signature (null = a pre-Fortress vault row)
    const sig = account.cloudSave?.sig ?? null
    return NextResponse.json({ ok: true, save, sig })
  } catch {
    return NextResponse.json({ ok: false, why: 'vault no gree' }, { status: 500 })
  }
}
