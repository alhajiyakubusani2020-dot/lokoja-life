/**
 * LOKOJA LIFE — M9 Guest Loop: /api/cloud/push
 * The cloud vault's write door. Bearer-token gated; the whole GameSave
 * JSON rides in the body exactly as the localStorage transport carries it.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })

    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    const body = (await req.json()) as { schema_version?: number; data?: unknown }
    if (!body?.data || typeof body.data !== 'object') {
      return NextResponse.json({ ok: false, why: 'bad payload' }, { status: 400 })
    }

    const data = JSON.stringify(body.data)
    const version = typeof body.schema_version === 'number' ? body.schema_version : 10
    await db.cloudSave.upsert({
      where: { accountId: account.id },
      create: { accountId: account.id, data, version },
      update: { data, version },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, why: 'vault no gree' }, { status: 500 })
  }
}
