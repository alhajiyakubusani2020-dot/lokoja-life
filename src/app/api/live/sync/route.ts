/**
 * LOKOJA LIFE — M17 LIVE NATION: /api/live/sync
 * The nation's heartbeat door. Bearer-token gated (the M9 identity IS
 * the multiplayer identity — no separate signup). One POST carries the
 * walker's presence up and pulls the nation's new events down since
 * the walker's cursor. THE RELAY DOCTRINE: distribute, never simulate.
 *
 * PH2.5 THE BOUNDED HEARTBEAT (Team Bravo) — no read on this door walks
 * an unbounded table: the roster take is capped, dead presence rows are
 * pruned opportunistically in the same request that reads them, and the
 * LiveEvent ledger self-trims past 30 days at most once an hour (a
 * module-level timestamp guard — the wire stays thin forever).
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

/* ---------------------- PH2.5 bounded-heartbeat consts --------------------- */
/** the roster read cap (a heartbeat never walks an unbounded table) */
const ROSTER_TAKE = 200
/** dead presence rows (2 min silent — the 90s TTL already read them out) */
const PRESENCE_PRUNE_MS = 120_000
/** LiveEvent retention horizon */
const EVENT_RETENTION_MS = 30 * 24 * 3_600_000
/** retention fires at most once per hour, per server process */
const RETENTION_EVERY_MS = 3_600_000
let lastRetentionAt = 0

export async function POST(req: Request) {
  try {
    const auth = req.headers.get('authorization') ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!token) return NextResponse.json({ ok: false, why: 'no token' }, { status: 401 })
    const account = await db.account.findFirst({ where: { token } })
    if (!account) return NextResponse.json({ ok: false, why: 'bad token' }, { status: 401 })

    // THE PRUNE LAW (PH2.5): dead presence rows (2 min silent) leave with
    // the same request that reads the roster — the table cannot grow
    // past the honest walker count. 2 min > the 90s read TTL, so no
    // alive row is ever pruned from under a real walker.
    await db.livePresence.deleteMany({
      where: { updatedAt: { lt: new Date(Date.now() - PRESENCE_PRUNE_MS) } },
    })

    // THE RETENTION LAW (PH2.5): events past 30 days leave the ledger at
    // most once an hour (module-level guard), fire-and-forget — the
    // heartbeat never waits on housekeeping and never double-fires it.
    const nowMs = Date.now()
    if (nowMs - lastRetentionAt >= RETENTION_EVERY_MS) {
      lastRetentionAt = nowMs
      db.liveEvent
        .deleteMany({ where: { createdAt: { lt: new Date(nowMs - EVENT_RETENTION_MS) } } })
        .catch(() => {})
    }

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
    // THE CALL PRIVACY LAW (W7): a call's outcome row lives on the sorted
    // pair channel (call:a|b) — the post-filter shows it to its TWO
    // parties alone; a stranger's sync never hears a stranger's ring.
    const rawEvents = await db.liveEvent.findMany({
      where: {
        seq: { gt: since },
        actor: { not: account.handle },
        OR: [{ channel: { not: { startsWith: 'ledger:' } } }, { channel: `ledger:${account.handle}` }],
      },
      orderBy: { seq: 'asc' },
      take: 120,
    })
    const events = rawEvents.filter((e) => {
      if (!e.channel.startsWith('call:')) return true
      const pair = e.channel.slice(5).split('|')
      return pair.length === 2 && pair.includes(account.handle)
    })

    // the roster: every heartbeat inside the TTL window — bounded take
    // (PH2.5: ≤200 walkers, FRESHEST-FIRST: ordering by updatedAt desc
    // reads the newest heartbeats before the take cuts, then the 90s TTL
    // filter keeps only the alive ones)
    const rows = (await db.livePresence.findMany({ orderBy: { updatedAt: 'desc' }, take: ROSTER_TAKE })) as PresenceRow[]
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
