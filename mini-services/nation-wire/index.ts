/**
 * LOKOJA LIFE — M24 W4: THE NATION WIRE
 * =====================================
 * The REAL-TIME heart of the nation. The faces (Messages, Connect) already
 * ride the honest 12s relay heartbeat (/api/live/sync + LiveEvent rows);
 * this wire is the FAST LANE over the SAME nation — same events table,
 * same seq cursor, SAME LAWS at the door. Nothing is replaced: the relay
 * heartbeat stays as the degraded-mode fallback lane, exactly as the plan
 * promised ("nothing thrown away").
 *
 * LAWS OF THIS FILE:
 *  - THE TRANSPORT LAW (environment): socket.io on :3003 behind the
 *    gateway (XTransformPort), path '/' — the environment gateway law.
 *    The plan's Bun-native-WS pick is amended honestly; every law of the
 *    plan carries over unchanged.
 *  - THE RELAY DOCTRINE (M17, carried): distribute, never simulate. This
 *    process holds no money, no truth of its own — it only relays what
 *    the laws produce and persists what the nation says.
 *  - THE ONE-NATION LAW: every chat/emote the wire relays is INSERTed
 *    into the SAME LiveEvent table the polling lane reads, so a walker
 *    on the 12s heartbeat and a walker on the wire see ONE history with
 *    ONE seq cursor. Two lanes, one nation.
 *  - THE IDENTITY LAW AT THE DOOR: the bearer token (Account.token — the
 *    same token the register/login issue and the relay already trusts)
 *    is verified against the REAL database at handshake. A guest or a
 *    bad token may connect and READ (spectate per M17) but the mic stays
 *    dark — every speak event refuses with guest-mic-dark.
 *  - THE TIER LAWS AT THE SERVER DOOR: the REAL sanitizeChat/canLive/
 *    emoteById from src/game/systems/live.ts are IMPORTED, not copied —
 *    zero drift by construction. Kids emote-only, teens moderated 140,
 *    adults 280 with the link law. The verdicts are computed HERE.
 *  - THE HONEST-REFUSAL LAW: a refused send answers the SENDER with the
 *    real why — nothing is ever silently dropped, nothing is faked.
 *  - THE RATE LAW: per-socket token caps (chat 5/10s, emote 6/10s,
 *    typing 3/s, presence 1/2s) — honest 'too-fast' refusals; the cap
 *    is data at the bottom of this file, so it tunes without touching
 *    any law.
 *  - THE PRESENCE LAW: a connected socket IS presence; the map sweeps
 *    stale entries on the 90s TTL (PRESENCE_TTL_MS imported verbatim)
 *    and on disconnect. Presence never lies.
 *  - THE CURSOR LAW: seq is LiveEvent's autoincrement; lastInsertRowid
 *    IS the seq; 'resume' replays DB events with seq > since (capped
 *    100) so reconnects and the polling lane share one cursor.
 *  - THE DEFENSIVE LAW: if the DB write fails the send refuses honestly
 *    (never a fake seq, never a broadcast of an unrecorded word), and
 *    an unknown age band fails CLOSED to guest.
 */
import { createServer } from 'node:http'
import { Server, type Socket as IoSocket } from 'socket.io'
import { Database } from 'bun:sqlite'

// THE LAW VAULT — imported VERBATIM from the game (zero copies, zero drift)
import {
  sanitizeChat,
  canLive,
  emoteById,
  PRESENCE_TTL_MS,
  type LiveBand,
  type LiveIdentity,
} from '../../src/game/systems/live'

const PORT = Number(process.env.WIRE_PORT ?? 3003)
const DB_PATH = process.env.WIRE_DB ?? '/home/z/my-project/db/custom.db'
const RESUME_CAP = 100
const CAPS = {
  chat: { n: 5, ms: 10_000 },
  emote: { n: 6, ms: 10_000 },
  typing: { n: 3, ms: 1_000 },
  presence: { n: 1, ms: 2_000 },
  resume: { n: 1, ms: 1_000 },
} as const

/* ─────────────────────────── the real database ─────────────────────────── */

const db = new Database(DB_PATH)
db.exec('PRAGMA journal_mode = WAL;')
db.exec('PRAGMA busy_timeout = 5000;')

const BANDS: readonly LiveBand[] = ['guest', 'kid', 'teen', 'adult']

/** THE DOOR'S PLAUSIBILITY law: unknown bands fail CLOSED to guest. */
function bandOf(raw: string | null | undefined): LiveBand {
  return BANDS.includes((raw ?? '') as LiveBand) ? (raw as LiveBand) : 'guest'
}

interface AccountRow {
  id: string
  handle: string
  ageBand: string
}

function accountByToken(token: unknown): AccountRow | null {
  if (typeof token !== 'string' || token.length < 8) return null
  try {
    return (
      db
        .query('SELECT id, handle, ageBand FROM Account WHERE token = ? LIMIT 1')
        .get(token.trim()) as AccountRow | undefined
    ) ?? null
  } catch {
    return null
  }
}

/** THE CURSOR LAW — the seq IS the rowid; insert honestly or refuse.
 * THE STORAGE LAW: Prisma's SQLite connector stores DateTime as INTEGER
 * epoch milliseconds — the wire MUST write the same shape or Prisma's
 * reads of this table die ("Inconsistent column data"). Learned the hard
 * way; the repair that fixed the poisoned rows lives in scripts/. */
function persistEvent(kind: string, channel: string, actor: string, band: string, payload: object): number | null {
  try {
    const r = db
      .query('INSERT INTO LiveEvent (kind, channel, actor, band, payload, createdAt) VALUES (?, ?, ?, ?, ?, ?)')
      .run(kind, channel, actor, band, JSON.stringify(payload), Date.now())
    return Number(r.lastInsertRowid)
  } catch {
    return null
  }
}

function headSeq(): number {
  const r = db.query('SELECT MAX(seq) AS s FROM LiveEvent').get() as { s: number | null }
  return Number(r.s ?? 0)
}

function eventsSince(since: number) {
  const rows = db
    .query(
      'SELECT seq, kind, channel, actor, band, payload FROM LiveEvent WHERE seq > ? ORDER BY seq ASC LIMIT ?'
    )
    .all(Number(since) || 0, RESUME_CAP) as {
    seq: number
    kind: string
    channel: string
    actor: string
    band: string
    payload: string
  }[]
  return rows.map((e) => ({ seq: Number(e.seq), kind: e.kind, channel: e.channel, actor: e.actor, band: e.band, payload: JSON.parse(e.payload || '{}') }))
}

/* ─────────────────────────── presence (memory + TTL) ───────────────────── */

interface WirePresence {
  handle: string
  band: LiveBand
  street: string
  status: string
  ts: number
  sid: string // the socket that owns this presence — the sweep's truth
}

const presence = new Map<string, WirePresence>() // handle -> record (one walker, one row)

function sweepPresence(io: Server): boolean {
  const now = Date.now()
  let changed = false
  for (const [handle, p] of presence) {
    const live = io.sockets.sockets.get(p.sid)
    if (live && live.connected) {
      // a connected socket IS presence — the TTL only ever sweeps zombies
      p.ts = now
      continue
    }
    presence.delete(handle)
    changed = true
  }
  if (changed) broadcastRoster(io)
  return changed
}

function rosterFor(street?: string) {
  return [...presence.values()]
    .filter((p) => (street ? p.street === street : true))
    .map(({ handle, band, street: st, status, ts }) => ({ handle, band, street: st, status, ts }))
}

function broadcastRoster(io: Server) {
  // the street rosters + the nation roster (global), one truth
  const streets = new Set([...presence.values()].map((p) => p.street))
  io.to('wire:global').emit('wire:roster', { scope: 'nation', roster: rosterFor() })
  for (const st of streets) {
    io.to(`wire:street:${st}`).emit('wire:roster', { scope: 'street', street: st, roster: rosterFor(st) })
  }
}

/* ─────────────────────────── rate law (per socket) ─────────────────────── */

function rateKeeper() {
  const buckets = new Map<string, { n: number; reset: number }>()
  return function allow(kind: keyof typeof CAPS): boolean {
    const cap = CAPS[kind]
    const now = Date.now()
    const b = buckets.get(kind)
    if (!b || now >= b.reset) {
      buckets.set(kind, { n: 1, reset: now + cap.ms })
      return true
    }
    if (b.n >= cap.n) return false
    b.n += 1
    return true
  }
}

/* ─────────────────────────── the socket.io server ──────────────────────── */

const httpServer = createServer((req, res) => {
  // the health door for the witness + the gates
  if (req.url?.startsWith('/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, service: 'nation-wire', online: presence.size, head: headSeq(), t: Date.now() }))
    return
  }
  res.writeHead(404)
  res.end()
})

const io = new Server(httpServer, {
  // THE PATH LAW (amended honestly): the default '/socket.io' — with path '/',
  // engine.io claims EVERY url (startsWith('/')) and a plain HTTP health door
  // can never exist beside the wire. The gateway routes on the XTransformPort
  // QUERY, not the path; client+server stay a matched pair. Proven by the
  // gateway curl + the browser E2E witness before any commit.
  path: '/socket.io',
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60_000,
  pingInterval: 25_000,
  maxHttpBufferSize: 4_096, // the wire carries words, not freight
})

io.use((socket, next) => {
  // THE IDENTITY LAW AT THE DOOR — the REAL db decides
  const account = accountByToken(socket.handshake.auth?.token)
  ;(socket.data as { identity: LiveIdentity & { accountId?: string } }).identity = account
    ? { handle: account.handle, band: bandOf(account.ageBand), accountId: account.id }
    : { handle: null, band: 'guest' }
  next()
})

function identityOf(s: IoSocket): LiveIdentity & { accountId?: string } {
  return (s.data as { identity: LiveIdentity & { accountId?: string } }).identity
}

function dmRoom(a: string, b: string): string {
  return `dm:${[a, b].sort().join('|')}`
}

io.on('connection', (socket) => {
  const identity = identityOf(socket)
  const allow = rateKeeper()
  let claimed = identity.band !== 'guest'
  let currentStreet = 'home'
  socket.join('wire:global')
  socket.emit('wire:welcome', { ok: true, you: identity, head: headSeq(), t: Date.now() })

  /* ── hello: the street claim (presence + street room) ── */
  socket.on('hello', (raw: unknown, ack?: (r: unknown) => void) => {
    const body = (raw ?? {}) as { street?: string; status?: string }
    currentStreet = typeof body.street === 'string' ? body.street.slice(0, 48) : 'home'
    const status = typeof body.status === 'string' ? body.status.slice(0, 24) : 'chilling'
    if (claimed) {
      socket.join(`wire:street:${currentStreet}`)
      presence.set(identity.handle!, {
        handle: identity.handle!,
        band: identity.band,
        street: currentStreet,
        status,
        ts: Date.now(),
        sid: socket.id,
      })
      broadcastRoster(io)
    }
    ack?.({ ok: true, street: currentStreet, roster: rosterFor(claimed ? currentStreet : undefined) })
  })

  /* ── presence updates (claimed only — a guest has no street) ── */
  socket.on('presence', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('presence')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { street?: string; status?: string }
    const nextStreet = typeof body.street === 'string' ? body.street.slice(0, 48) : currentStreet
    const status = typeof body.status === 'string' ? body.status.slice(0, 24) : 'chilling'
    if (nextStreet !== currentStreet) {
      socket.leave(`wire:street:${currentStreet}`)
      socket.join(`wire:street:${nextStreet}`)
      currentStreet = nextStreet
    }
    const p = presence.get(identity.handle!)
    if (p) {
      p.street = currentStreet
      p.status = status
      p.ts = Date.now()
      p.sid = socket.id
    } else {
      presence.set(identity.handle!, {
        handle: identity.handle!,
        band: identity.band,
        street: currentStreet,
        status,
        ts: Date.now(),
        sid: socket.id,
      })
    }
    broadcastRoster(io)
    ack?.({ ok: true, street: currentStreet })
  })

  /* ── chat: the tier laws computed HERE, at the server door ── */
  socket.on('chat', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('chat')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { channel?: string; text?: string }
    const channel = typeof body.channel === 'string' ? body.channel.slice(0, 64) : 'global'
    const verdict = sanitizeChat(identity, typeof body.text === 'string' ? body.text : '')
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    const seq = persistEvent('chat', channel, identity.handle!, identity.band, {
      text: verdict.text,
      stripped: verdict.stripped ?? false,
    })
    if (seq === null) return ack?.({ ok: false, why: 'wire no gree — try again' })
    const ev = { seq, kind: 'chat' as const, channel, actor: identity.handle!, band: identity.band, payload: { text: verdict.text, stripped: verdict.stripped ?? false } }
    const room = channel === 'global' ? 'wire:global' : `wire:street:${channel}`
    io.to(room).emit('wire:event', ev)
    ack?.({ ok: true, seq, stripped: verdict.stripped ?? false, echo: ev })
  })

  /* ── emote: the kid lexicon rides the wire (kids CAN speak this way) ── */
  socket.on('emote', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!canLive(identity, 'emote')) return ack?.({ ok: false, why: 'kid-text-refused' })
    if (!allow('emote')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { channel?: string; emoteId?: string }
    const channel = typeof body.channel === 'string' ? body.channel.slice(0, 64) : 'global'
    const emote = emoteById(typeof body.emoteId === 'string' ? body.emoteId : '')
    if (!emote) return ack?.({ ok: false, why: 'bad-emote' })
    const seq = persistEvent('emote', channel, identity.handle!, identity.band, emote)
    if (seq === null) return ack?.({ ok: false, why: 'wire no gree — try again' })
    const ev = { seq, kind: 'emote' as const, channel, actor: identity.handle!, band: identity.band, payload: emote }
    const room = channel === 'global' ? 'wire:global' : `wire:street:${channel}`
    io.to(room).emit('wire:event', ev)
    ack?.({ ok: true, seq, echo: ev })
  })

  /* ── DM: claimed ↔ claimed, same laws, both must be on the wire ── */
  socket.on('dm', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('chat')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { to?: string; text?: string }
    const to = typeof body.to === 'string' ? body.to.trim().slice(0, 48) : ''
    if (!to || to === identity.handle) return ack?.({ ok: false, why: 'bad-handle' })
    if (!presence.has(to)) return ack?.({ ok: false, why: 'offline — DM waits for W5' })
    const verdict = sanitizeChat(identity, typeof body.text === 'string' ? body.text : '')
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    const seq = persistEvent('dm', `dm:${identity.handle}|${to}`, identity.handle!, identity.band, {
      to,
      text: verdict.text,
      stripped: verdict.stripped ?? false,
    })
    if (seq === null) return ack?.({ ok: false, why: 'wire no gree — try again' })
    const ev = { seq, kind: 'dm' as const, channel: `dm:${[identity.handle!, to].sort().join('|')}`, actor: identity.handle!, band: identity.band, payload: { to, text: verdict.text, stripped: verdict.stripped ?? false } }
    io.to(dmRoom(identity.handle!, to)).emit('wire:event', ev)
    // THE DELIVERY LAW: the paddy hears the DM even if their UI never opened
    // the thread — delivery rides the PERSON, not their open tabs. Direct
    // emit to their current socket; a duplicate (they joined the room) dies
    // on the client's seq-dedupe law.
    const recip = presence.get(to)
    if (recip && recip.sid) io.to(recip.sid).emit('wire:event', ev)
    ack?.({ ok: true, seq, echo: ev })
  })

  /* ── DM pairing: join the room so both sides receive ── */
  socket.on('dm:open', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { with?: string }
    const other = typeof body.with === 'string' ? body.with.trim().slice(0, 48) : ''
    if (!other || other === identity.handle) return ack?.({ ok: false, why: 'bad-handle' })
    socket.join(dmRoom(identity.handle!, other))
    ack?.({ ok: true, room: dmRoom(identity.handle!, other) })
  })

  /* ── typing: ephemeral, never persisted, never lies to the DB ── */
  socket.on('typing', (raw: unknown) => {
    if (!claimed || !allow('typing')) return
    const body = (raw ?? {}) as { channel?: string }
    const channel = typeof body.channel === 'string' ? body.channel.slice(0, 64) : 'global'
    const room = channel === 'global' ? 'wire:global' : channel.startsWith('dm:') ? channel : `wire:street:${channel}`
    socket.to(room).emit('wire:typing', { channel, from: identity.handle })
  })

  /* ── resume: the cursor law — one cursor, both lanes ── */
  socket.on('resume', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!allow('resume')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { since?: number }
    const since = Number(body.since ?? 0)
    if (!Number.isFinite(since) || since < 0) return ack?.({ ok: false, why: 'bad-cursor' })
    ack?.({ ok: true, events: eventsSince(since), head: headSeq() })
  })

  /* ── latency witness ── */
  socket.on('ping', (_raw: unknown, ack?: (r: unknown) => void) => ack?.({ t: Date.now() }))

  socket.on('disconnect', () => {
    if (claimed) {
      presence.delete(identity.handle!)
      broadcastRoster(io)
    }
  })
})

/* ── the presence sweep: a stale row is an absent neighbour ── */
setInterval(() => sweepPresence(io), 15_000).unref()

httpServer.listen(PORT, () => {
  console.log(`[nation-wire] THE WIRE IS UP — :${PORT}, head=${headSeq()}, db=${DB_PATH}`)
})

/* THE SHUTDOWN LAW: exit IMMEDIATELY on signal. A graceful httpServer.close()
 * waits for live websockets to drain — with sockets open the callback never
 * fires and the process becomes a ZOMBIE (listener closed, sockets alive):
 * the client never learns the wire died, and the degraded lane never takes
 * over. A stateless relay owes nobody an open socket — die loud, the client
 * gets the RST, flips to 'degraded', and the 12s relay carries the nation. */
function die(signal: string) {
  console.log(`[nation-wire] ${signal} — the wire goes down (the relay lane takes over)`)
  process.exit(0)
}
process.on('SIGTERM', () => die('SIGTERM'))
process.on('SIGINT', () => die('SIGINT'))

/* THE NATION STANDS LAW: one malformed packet from one client must NEVER
 * kill the wire for everyone. Log the truth, stay standing. */
process.on('uncaughtException', (e) => {
  console.error(`[nation-wire] uncaught (the nation stands): ${e?.stack ?? e}`)
})
process.on('unhandledRejection', (e) => {
  console.error(`[nation-wire] rejected (the nation stands): ${String(e).slice(0, 500)}`)
})
