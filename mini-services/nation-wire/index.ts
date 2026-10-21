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
 *
 * PH2.5 SPLIT (Team Charlie, Part 2): this file is now the THIN
 * bootstrap — config, server creation, ctx construction, the io.use
 * identity door, the io.on('connection') wrapper, and the register
 * calls in the original handler order. Every shared Map/helper/db
 * handle lives in ./context.ts; the 59 socket.on doors live in
 * ./handlers/{identity,world,social,economy,transport}.ts. The
 * placement map: scripts/audit-tmp/charlie25/wire-map.md.
 */
import { createServer } from 'node:http'
import { Server, makeCtx, CAPS, type WireCtx, type WireConn } from './context'
import { register as registerIdentity } from './handlers/identity'
import { register as registerWorld } from './handlers/world'
import { register as registerSocial } from './handlers/social'
import { register as registerEconomy } from './handlers/economy'
import { register as registerTransport, sweepPresence } from './handlers/transport'

const PORT = Number(process.env.WIRE_PORT ?? 3003)
const DB_PATH = process.env.WIRE_DB ?? '/home/z/my-project/db/custom.db'

/* ─── the shared context: state, helpers, the db handle (PH2.5 split) ─── */
const ctx: WireCtx = makeCtx(DB_PATH)
const { presence, calls, identityOf, headSeq, rateKeeper, accountAllow } = ctx

/* ─────────────────────────── the socket.io server ──────────────────────── */

const httpServer = createServer((req, res) => {
  // the health door for the witness + the gates
  if (req.url?.startsWith('/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, service: 'nation-wire', online: presence.size, head: headSeq(), calls: calls.size, t: Date.now() }))
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

registerIdentity(io, ctx)

io.on('connection', (socket) => {
  const identity = identityOf(socket)
  const sockAllow = rateKeeper()
  // THE ACCOUNT EYE: both buckets must agree — the socket's flood law
  // AND the handle's account-level manners (one token, no capMultiply).
  const allow = (kind: keyof typeof CAPS): boolean =>
    sockAllow(kind) && accountAllow(identity.handle ?? socket.id, kind)
  let claimed = identity.band !== 'guest'
  let currentStreet = 'home'
  socket.join('wire:global')
  socket.emit('wire:welcome', { ok: true, you: identity, head: headSeq(), t: Date.now() })

  /* the per-connection closures ride one conn object into the registers —
   * the handler bodies themselves stay byte-verbatim (wire-map.md §5.1) */
  const conn: WireConn = {
    socket,
    identity,
    allow,
    claimed,
    get currentStreet() {
      return currentStreet
    },
    set currentStreet(v: string) {
      currentStreet = v
    },
  }

  // registration order = the monolith's original handler order, flattened
  // into the four domain files (every event name is registered exactly
  // once, so the flatten has no behavioral effect — wire-map.md §5.5):
  // world (hello→stage:list) → social (chat→social:invite) →
  // economy (wallet→stage:tip) → transport (resume→disconnect).
  registerWorld(io, ctx, conn)
  registerSocial(io, ctx, conn)
  registerEconomy(io, ctx, conn)
  registerTransport(io, ctx, conn)
})

/* ── the presence sweep: a stale row is an absent neighbour ── */
setInterval(() => sweepPresence(io, ctx), 15_000).unref()

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
