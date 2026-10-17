/**
 * LOKOJA LIFE — M17 LIVE NATION: /api/live/sync
 * The nation's heartbeat door. Bearer-token gated (the M9 identity IS
 * the multiplayer identity — no separate signup). One POST carries the
 * walker's presence up and pulls the nation's new events down since
 * the walker's cursor. THE RELAY DOCTRINE: distribute, never simulate.
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { presenceAlive } from '@/game/systems/live'

interface PresenceRow {
  handle: string
  band: string
  street: string
  status: string
  updatedAt: Date
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })
    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    const body = (await req.json().catch(() => ({}))) as {
      presence?: { street?: string; status?: string }
      since?: number
    }
    const since = typeof body.since === 'number' && body.since >= 0 ? Math.floor(body.since) : 0
    const street = typeof body.presence?.street === 'string' ? body.presence.street.slice(0, 48) : 'home'
    const status = typeof body.presence?.status === 'string' ? body.presence.status.slice(0, 24) : 'chilling'

    // the heartbeat upsert — one row per account, the TTL is read-time law
    await db.livePresence.upsert({
      where: { accountId: account.id },
      create: { accountId: account.id, handle: account.handle, band: account.ageBand, street, status },
      update: { handle: account.handle, band: account.ageBand, street, status },
    })

    // the nation's new wire since the cursor (capped — thin doors), own events never echo.
    // THE LEDGER PRIVACY LAW (W6): a transfer receipt's LiveEvent row is
    // channel-scoped to its receiver (ledger:<handle>) — the sync shows it
    // to that person ALONE. Nobody else's money news ever lands here.
    const events = await db.liveEvent.findMany({
      where: {
        seq: { gt: since },
        actor: { not: account.handle },
        OR: [{ channel: { not: { startsWith: 'ledger:' } } }, { channel: `ledger:${account.handle}` }],
      },
      orderBy: { seq: 'asc' },
      take: 120,
    })

    // the roster: every heartbeat inside the TTL window
    const rows = (await db.livePresence.findMany()) as PresenceRow[]
    const now = Date.now()
    const roster = rows
      .map((r) => ({
        handle: r.handle,
        band: r.band,
        street: r.street,
        status: r.status,
        ts: r.updatedAt.getTime(),
      }))
      .filter((p) => presenceAlive({ ...p, band: 'adult', status: 'chilling' }, now))

    const head = await db.liveEvent.findFirst({ orderBy: { seq: 'desc' } })

    return NextResponse.json({
      ok: true,
      cursor: head ? Math.max(head.seq, since) : since,
      events: events.map((e) => ({
        seq: e.seq,
        kind: e.kind,
        channel: e.channel,
        actor: e.actor,
        band: e.band,
        payload: JSON.parse(e.payload || '{}'),
      })),
      roster,
      you: { handle: account.handle, band: account.ageBand },
    })
  } catch {
    return NextResponse.json({ ok: false, why: 'relay no gree' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, why: 'POST only — the heartbeat rides the body' }, { status: 405 })
}
