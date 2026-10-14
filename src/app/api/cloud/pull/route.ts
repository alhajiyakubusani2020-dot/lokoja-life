/**
 * LOKOJA LIFE — M9 Guest Loop: /api/cloud/pull
 * The cloud vault's read door. Bearer-token gated; returns the stored
 * GameSave (or null) — the client's merge law decides what continues.
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
    return NextResponse.json({ ok: true, save })
  } catch {
    return NextResponse.json({ ok: false, why: 'vault no gree' }, { status: 500 })
  }
}
