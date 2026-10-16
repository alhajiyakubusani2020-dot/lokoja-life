/**
 * LOKOJA LIFE — M9 Guest Loop: /api/cloud/push
 * The cloud vault's write door. Bearer-token gated; the whole GameSave
 * JSON rides in the body exactly as the localStorage transport carries it.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { applyDelta, patchFromBase64 } from '@/game/systems/binarydelta'

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })

    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    const body = (await req.json()) as { schema_version?: number; data?: unknown; sig?: string; patch?: unknown }

    // M20 — THE DELTA DOOR: a patch carries the CHANGE against the exact
    // string this vault already stores. The base mismatch (another device
    // wrote since), a torn codec, or a wrong shape is refused honestly —
    // the client falls back to the whole envelope. The stored row stays a
    // WHOLE envelope either way: the vault never learns a new format.
    if (typeof body?.patch === 'string' && body.patch.length > 0 && (!body?.data || typeof body.data !== 'object')) {
      const row = await db.cloudSave.findUnique({ where: { accountId: account.id } })
      if (!row) return NextResponse.json({ ok: false, why: 'no base — send whole' }, { status: 400 })
      let next: string
      try {
        next = applyDelta(row.data, patchFromBase64(body.patch))
        const parsed = JSON.parse(next) as { player?: unknown; version?: unknown; sig?: unknown }
        if (!parsed || typeof parsed !== 'object' || !('player' in parsed) || !('version' in parsed)) {
          return NextResponse.json({ ok: false, why: 'patch refused — wrong shape' }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ ok: false, why: 'patch refused — send whole' }, { status: 400 })
      }
      const version = typeof (JSON.parse(next) as { version?: unknown }).version === 'number' ? (JSON.parse(next) as { version: number }).version : (typeof body.schema_version === 'number' ? body.schema_version : 10)
      // the delta path's sig is computed by the client over the EXACT rebuilt string
      const deltaSig = typeof body.sig === 'string' && body.sig.length > 0 ? body.sig : null
      await db.cloudSave.upsert({
        where: { accountId: account.id },
        create: { accountId: account.id, data: next, version, sig: deltaSig },
        update: { data: next, version, sig: deltaSig },
      })
      return NextResponse.json({ ok: true, delta: true })
    }

    if (!body?.data || typeof body.data !== 'object') {
      return NextResponse.json({ ok: false, why: 'bad payload' }, { status: 400 })
    }

    const data = JSON.stringify(body.data)
    const version = typeof body.schema_version === 'number' ? body.schema_version : 10
    // M14 — the client's HMAC rides beside the save (tamper-evidence for the pull)
    const sig = typeof body.sig === 'string' && body.sig.length > 0 ? body.sig : null
    await db.cloudSave.upsert({
      where: { accountId: account.id },
      create: { accountId: account.id, data, version, sig },
      update: { data, version, sig },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, why: 'vault no gree' }, { status: 500 })
  }
}
