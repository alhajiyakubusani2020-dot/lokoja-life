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
import { scryptSync, timingSafeEqual } from 'node:crypto'
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

// THE SOCIAL GRAPH LAWS — W5, same verbatim doctrine (zero copies)
import {
  requestVerdict,
  acceptVerdict,
  dmVerdict,
  reportVerdict,
  socialNorm,
  SOCIAL_HANDLE_RE,
  dmChannel,
  dmChannelInvolves,
  hangoutPayload,
  type SocialEdge,
} from '../../src/game/systems/socialgraph'

// THE LEDGER LAWS — W6, same verbatim doctrine (zero copies)
import {
  transferVerdict,
  depositVerdict,
  chainLink,
  receiptOf,
  dayStartMs,
  LEDGER_SEED,
  type LedgerReceipt,
} from '../../src/game/systems/ledger'

// THE VOICE LAWS — W7, same verbatim doctrine (zero copies)
import {
  dialVerdict,
  callChannel,
  callChannelInvolves,
  callIdOk,
  endWhyOk,
  sdpOk,
  iceOk,
  pvPeers,
  pvRelayOk,
  type VoiceCallWhy,
} from '../../src/game/systems/voice'

const PORT = Number(process.env.WIRE_PORT ?? 3003)
const DB_PATH = process.env.WIRE_DB ?? '/home/z/my-project/db/custom.db'
const RESUME_CAP = 100
const CAPS = {
  chat: { n: 5, ms: 10_000 },
  emote: { n: 6, ms: 10_000 },
  typing: { n: 3, ms: 1_000 },
  presence: { n: 1, ms: 2_000 },
  resume: { n: 1, ms: 1_000 },
  social: { n: 8, ms: 10_000 },
  wallet: { n: 4, ms: 10_000 },
  // W7 — signaling is bursty (a connection burst releases a fist of ICE
  // envelopes at once); the cap stays generous but the wire stays thin.
  call: { n: 24, ms: 10_000 },
} as const

const DM_HISTORY_CAP = 100

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

interface AccountFullRow extends AccountRow {
  pinHash: string
  salt: string
}

/** THE PIN LAW'S EYE — the full account row (hash + salt ride along). */
function accountFullByToken(token: unknown): AccountFullRow | null {
  if (typeof token !== 'string' || token.length < 8) return null
  try {
    return (
      db
        .query('SELECT id, handle, ageBand, pinHash, salt FROM Account WHERE token = ? LIMIT 1')
        .get(token.trim()) as AccountFullRow | undefined
    ) ?? null
  } catch {
    return null
  }
}

/** THE PIN LAW — scrypt, per-account salt, timing-safe compare. */
function pinVerifies(account: AccountFullRow, pin: unknown): boolean {
  if (typeof pin !== 'string' || !/^[0-9]{4,8}$/.test(pin)) return false
  try {
    const h = scryptSync(pin, account.salt, 32)
    const stored = Buffer.from(account.pinHash, 'hex')
    return h.length === stored.length && timingSafeEqual(h, stored)
  } catch {
    return false
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

function eventsSince(since: number, forHandle: string | null) {
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
  // THE PRIVACY LAW (W5): a replay never leaks another pair's DMs or a
  // stranger's ledger receipts — the cursor is ONE, the visibility is PER
  // PERSON. Public channels (global, street) replay to everyone; dm:/
  // ledger: channels replay only to the people they belong to.
  return rows
    .filter((e) => {
      if (e.channel.startsWith('dm:')) return dmChannelInvolves(e.channel, forHandle ?? '')
      if (e.channel.startsWith('ledger:')) return e.channel === `ledger:${forHandle ?? ''}`
      // W7 THE PRIVACY LAW grows an ear: a call's outcome row belongs to
      // its TWO parties alone — a stranger's replay never rings of it
      if (e.channel.startsWith('call:')) return callChannelInvolves(e.channel, forHandle ?? '')
      return true
    })
    .map((e) => ({ seq: Number(e.seq), kind: e.kind, channel: e.channel, actor: e.actor, band: e.band, payload: JSON.parse(e.payload || '{}') }))
}

/* ─────────────────────────── presence (memory + TTL) ───────────────────── */

interface WirePresence {
  handle: string
  band: LiveBand
  street: string
  status: string
  voiceOn: boolean // W7 — the M17 opt-in rides the presence row
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
  // W7: a call whose phone vanished ends honestly — the survivor learns
  for (const c of [...calls.values()]) {
    if (!presence.has(c.from) || !presence.has(c.to)) endCall(io, c, 'hangup', 'system')
  }
  if (changed) broadcastRoster(io)
  return changed
}

function rosterFor(street?: string) {
  return [...presence.values()]
    .filter((p) => (street ? p.street === street : true))
    .map(({ handle, band, street: st, status, voiceOn, ts }) => ({ handle, band, street: st, status, voiceOn, ts }))
}

/* ─────────────── W7 the call registry (memory — the relay doctrine) ───────────────
 * A call is TWO claimed walkers and a state line. No money, no truth of
 * its own — the registry only remembers which envelopes belong to which
 * phone so the laws can gate them. If the wire dies, the calls die with
 * it (both phones see the socket drop — nothing phantom survives). */
interface WireCall {
  callId: string
  from: string
  to: string
  video: boolean
  state: 'ringing' | 'accepted' | 'connecting' | 'active'
  startedAt: number
}
const calls = new Map<string, WireCall>()

function callOfHandle(handle: string): WireCall | null {
  for (const c of calls.values()) if (c.from === handle || c.to === handle) return c
  return null
}

function pushCall(io: Server, toHandle: string, payload: Record<string, unknown>): void {
  const p = presence.get(toHandle)
  if (p?.sid) io.to(p.sid).emit('wire:call', payload) // rides the person
}

/** THE WALKIE LANE — the proximity envelopes ride their OWN lane: the
 *  call lane stays pure (a dialed call is one phone, one state line);
 *  the street mesh is many tiny envelopes with no registry at all. */
function pushPv(io: Server, toHandle: string, payload: Record<string, unknown>): void {
  const p = presence.get(toHandle)
  if (p?.sid) io.to(p.sid).emit('wire:pv', payload) // rides the person
}

/** THE END TRUTH, per ear: the caller's no-answer IS the callee's missed
 *  call. One outcome row lands on the sorted-pair call: channel — the
 *  privacy filters (wire resume + the 12s sync) show it to the two
 *  parties ALONE. */
function endCall(io: Server, c: WireCall, why: VoiceCallWhy, ender: string): void {
  calls.delete(c.callId)
  const whyFor = (handle: string): VoiceCallWhy =>
    handle === ender ? why : why === 'no-answer' ? 'missed' : why
  pushCall(io, c.from, { type: 'ended', callId: c.callId, why: whyFor(c.from) })
  pushCall(io, c.to, { type: 'ended', callId: c.callId, why: whyFor(c.to) })
  const secs = c.state === 'active' ? Math.max(0, Math.floor((Date.now() - c.startedAt) / 1000)) : 0
  persistEvent('call', callChannel(c.from, c.to), ender, 'adult', {
    callId: c.callId, phase: 'ended', why, secs, from: c.from, to: c.to, video: c.video,
  })
}

/* THE TURN SLOT: coturn is a DEPLOYMENT step (the W12 guide — nginx /rt
 * proxy + coturn). The door hands every accepted call the freshest
 * config; when the env is empty the nation still speaks over host/STUN
 * candidates (LAN + open NAT), stated plainly — Nigeria's CGNAT pairs
 * need TURN for real deploy, and the slot is waiting for the env. */
function iceServersFor(): { urls: string; username?: string; credential?: string }[] {
  const list: { urls: string; username?: string; credential?: string }[] = [
    { urls: process.env.NATION_STUN_URL ?? 'stun:stun.l.google.com:19302' },
  ]
  if (process.env.NATION_TURN_URL) {
    list.push({
      urls: process.env.NATION_TURN_URL,
      username: process.env.NATION_TURN_USER,
      credential: process.env.NATION_TURN_PASS,
    })
  }
  return list
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

/* ─────────────────────── the social graph (W5, FriendRow) ────────────────── */

interface FriendRowT {
  id: number
  ownerHandle: string
  peerHandle: string
  state: string
  requestedBy: string
}

function edgeGet(owner: string, peer: string): SocialEdge | null {
  const r = db
    .query('SELECT ownerHandle, peerHandle, state, requestedBy FROM FriendRow WHERE ownerHandle = ? AND peerHandle = ? LIMIT 1')
    .get(owner, peer) as FriendRowT | undefined
  return r ? { ownerHandle: r.ownerHandle, peerHandle: r.peerHandle, state: r.state as SocialEdge['state'], requestedBy: r.requestedBy } : null
}

function edgePut(owner: string, peer: string, state: string, requestedBy: string): void {
  db.query(
    'INSERT INTO FriendRow (ownerHandle, peerHandle, state, requestedBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(ownerHandle, peerHandle) DO UPDATE SET state = excluded.state, requestedBy = excluded.requestedBy, updatedAt = excluded.updatedAt'
  ).run(owner, peer, state, requestedBy, Date.now(), Date.now())
}

function edgeDel(owner: string, peer: string): void {
  db.query('DELETE FROM FriendRow WHERE ownerHandle = ? AND peerHandle = ?').run(owner, peer)
}

function graphFor(me: string) {
  const rows = db
    .query('SELECT ownerHandle, peerHandle, state, requestedBy, updatedAt FROM FriendRow WHERE ownerHandle = ?')
    .all(me) as (FriendRowT & { updatedAt: number | string })[]
  const friends: { handle: string; since: number }[] = []
  const inReqs: { handle: string; ts: number }[] = []
  const outReqs: { handle: string; ts: number }[] = []
  const blocked: string[] = []
  for (const r of rows) {
    const ts = typeof r.updatedAt === 'number' ? r.updatedAt : Date.parse(String(r.updatedAt)) || Date.now()
    if (r.state === 'friend') friends.push({ handle: r.peerHandle, since: ts })
    else if (r.state === 'pending') {
      if (r.requestedBy === me) outReqs.push({ handle: r.peerHandle, ts })
      else inReqs.push({ handle: r.peerHandle, ts })
    } else if (r.state === 'blocked') blocked.push(r.peerHandle)
  }
  return { friends, inReqs, outReqs, blocked }
}

function accountExists(handle: string): boolean {
  return !!db.query('SELECT id FROM Account WHERE handle = ? LIMIT 1').get(handle)
}

function accountBand(handle: string): 'kid' | 'teen' | 'adult' | null {
  const r = db.query('SELECT ageBand FROM Account WHERE handle = ? LIMIT 1').get(handle) as { ageBand: string } | undefined
  if (!r) return null
  return r.ageBand === 'kid' || r.ageBand === 'teen' ? r.ageBand : 'adult'
}

/* ───────────────────── the nation purse (W6, the ledger) ─────────────────── */

interface WalletT { handle: string; balance: number }
interface LedgerT {
  id: number
  fromHandle: string
  toHandle: string
  amount: number
  kind: string
  idemKey: string
  chainHash: string
  note: string
  createdAt: number
}

function walletGet(handle: string): WalletT {
  const r = db.query('SELECT handle, balance FROM WalletRow WHERE handle = ? LIMIT 1').get(handle) as WalletT | undefined
  if (r) return r
  db.query('INSERT INTO WalletRow (handle, balance, version, updatedAt) VALUES (?, 0, 0, ?)').run(handle, Date.now())
  return { handle, balance: 0 }
}

function ledgerTail(): string {
  const r = db.query('SELECT chainHash FROM LedgerRow ORDER BY id DESC LIMIT 1').get() as { chainHash: string } | undefined
  return r?.chainHash ?? LEDGER_SEED
}

function dayTransferred(handle: string): number {
  const r = db
    .query("SELECT COALESCE(SUM(amount), 0) AS s FROM LedgerRow WHERE fromHandle = ? AND kind = 'transfer' AND createdAt >= ?")
    .get(handle, dayStartMs()) as { s: number | null }
  return Number(r.s ?? 0)
}

function recentLedger(handle: string, cap = 8): LedgerReceipt[] {
  const rows = db
    .query('SELECT * FROM LedgerRow WHERE fromHandle = ? OR toHandle = ? ORDER BY id DESC LIMIT ?')
    .all(handle, handle, cap) as unknown as LedgerT[]
  return rows.map((r) => receiptOf(r))
}

function ledgerByIdem(idemKey: string): LedgerT | null {
  return (db.query('SELECT * FROM LedgerRow WHERE idemKey = ? LIMIT 1').get(idemKey) as LedgerT | undefined) ?? null
}

/** THE MOVE — atomic, idempotent, chained. Throws the refusal why, or
 * returns the receipt. A replayed idemKey returns the SAME row untouched. */
const theMove = db.transaction((move: {
  kind: 'deposit' | 'withdraw' | 'transfer'
  from: string
  to: string
  amount: number
  idemKey: string
  note: string
}): LedgerReceipt => {
  const existing = ledgerByIdem(move.idemKey)
  if (existing) return receiptOf(existing) // THE IDEMPOTENCY LAW — same receipt, zero movement
  const ts = Date.now()
  if (move.kind === 'deposit') {
    walletGet(move.from) // the purse exists before the credit
    db.query('UPDATE WalletRow SET balance = balance + ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.from)
    const hash = chainLink(ledgerTail(), { idemKey: move.idemKey, from: move.from, to: move.to, amount: move.amount, kind: move.kind, ts })
    const r = db
      .query('INSERT INTO LedgerRow (fromHandle, toHandle, amount, kind, idemKey, chainHash, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(move.from, move.to, move.amount, move.kind, move.idemKey, hash, move.note, ts)
    return { idemKey: move.idemKey, ledgerId: Number(r.lastInsertRowid), kind: move.kind, from: move.from, to: move.to, amount: move.amount, hash, ts }
  }
  if (move.kind === 'withdraw') {
    const w = walletGet(move.from)
    if (w.balance < move.amount) throw 'insufficient'
    db.query('UPDATE WalletRow SET balance = balance - ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.from)
    const hash = chainLink(ledgerTail(), { idemKey: move.idemKey, from: move.from, to: move.to, amount: move.amount, kind: move.kind, ts })
    const r = db
      .query('INSERT INTO LedgerRow (fromHandle, toHandle, amount, kind, idemKey, chainHash, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(move.from, move.to, move.amount, move.kind, move.idemKey, hash, move.note, ts)
    return { idemKey: move.idemKey, ledgerId: Number(r.lastInsertRowid), kind: move.kind, from: move.from, to: move.to, amount: move.amount, hash, ts }
  }
  // transfer — the N8 law's whole point: both legs in ONE transaction
  const wFrom = walletGet(move.from)
  if (wFrom.balance < move.amount) throw 'insufficient'
  walletGet(move.to) // the receiver's purse exists before the credit
  db.query('UPDATE WalletRow SET balance = balance - ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.from)
  db.query('UPDATE WalletRow SET balance = balance + ?, version = version + 1, updatedAt = ? WHERE handle = ?').run(move.amount, ts, move.to)
  const hash = chainLink(ledgerTail(), { idemKey: move.idemKey, from: move.from, to: move.to, amount: move.amount, kind: move.kind, ts })
  const r = db
    .query('INSERT INTO LedgerRow (fromHandle, toHandle, amount, kind, idemKey, chainHash, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(move.from, move.to, move.amount, move.kind, move.idemKey, hash, move.note, ts)
  return { idemKey: move.idemKey, ledgerId: Number(r.lastInsertRowid), kind: move.kind, from: move.from, to: move.to, amount: move.amount, hash, ts }
})

/** THE RECEIPT LAW — the receiver learns on BOTH lanes: a direct push now
 * and the LiveEvent row the 12s relay reads (channel-scoped to them). */
function deliverTransferReceipt(io: Server, receipt: LedgerReceipt, toHandle: string): void {
  const p = presence.get(toHandle)
  if (p?.sid) io.to(p.sid).emit('wire:ledger', receipt) // the fast lane, riding the person
  persistEvent('ledger', `ledger:${toHandle}`, receipt.from, 'adult', {
    ledgerId: receipt.ledgerId,
    kind: receipt.kind,
    from: receipt.from,
    amount: receipt.amount,
    hash: receipt.hash.slice(0, 16),
    ts: receipt.ts,
  }) // the relay lane — the sync's privacy filter shows it to them alone
}

function pushSocial(io: Server, toHandle: string, payload: Record<string, unknown>): void {
  const p = presence.get(toHandle)
  if (p?.sid) io.to(p.sid).emit('wire:social', payload) // THE DELIVERY LAW: rides the person
}

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

/** THE PIN LAW'S DOOR — the token this socket shook hands with. */
function handshakeTokenOf(s: IoSocket): unknown {
  return s.handshake.auth?.token
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
    const body = (raw ?? {}) as { street?: string; status?: string; voiceOn?: boolean }
    currentStreet = typeof body.street === 'string' ? body.street.slice(0, 48) : 'home'
    const status = typeof body.status === 'string' ? body.status.slice(0, 24) : 'chilling'
    const voiceOn = body.voiceOn === true // W7 — the M17 opt-in rides presence
    if (claimed) {
      socket.join(`wire:street:${currentStreet}`)
      presence.set(identity.handle!, {
        handle: identity.handle!,
        band: identity.band,
        street: currentStreet,
        status,
        voiceOn,
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
    const body = (raw ?? {}) as { street?: string; status?: string; voiceOn?: boolean }
    const nextStreet = typeof body.street === 'string' ? body.street.slice(0, 48) : currentStreet
    const status = typeof body.status === 'string' ? body.status.slice(0, 24) : 'chilling'
    const voiceOn = body.voiceOn === true
    if (nextStreet !== currentStreet) {
      socket.leave(`wire:street:${currentStreet}`)
      socket.join(`wire:street:${nextStreet}`)
      currentStreet = nextStreet
    }
    const p = presence.get(identity.handle!)
    if (p) {
      p.street = currentStreet
      p.status = status
      p.voiceOn = voiceOn
      p.ts = Date.now()
      p.sid = socket.id
    } else {
      presence.set(identity.handle!, {
        handle: identity.handle!,
        band: identity.band,
        street: currentStreet,
        status,
        voiceOn,
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

  /* ── DM: claimed ↔ claimed, W5 laws at the door — the BLOCK WALL, the
   * M13 KID WALL (minors reach accepted paddies only), and the OFFLINE
   * TRUTH: a DM to a claimed paddy who is not on the wire RIGHT NOW still
   * lands (persisted + replayed by the cursor law and social:dms history).
   * Only a handle that never claimed a name refuses. ── */
  socket.on('dm', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('chat')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { to?: string; text?: string }
    const to = socialNorm(body.to)
    if (!to || to === identity.handle) return ack?.({ ok: false, why: 'bad-handle' })
    // W5 DOOR LAWS: their block wall, then the kid wall
    const dmCheck = dmVerdict(identity.band, edgeGet(to, identity.handle!), edgeGet(identity.handle!, to))
    if (!dmCheck.ok) return ack?.({ ok: false, why: dmCheck.why })
    if (!presence.has(to) && !accountExists(to)) return ack?.({ ok: false, why: 'no-such-paddy' })
    const verdict = sanitizeChat(identity, typeof body.text === 'string' ? body.text : '')
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    const seq = persistEvent('dm', dmChannel(identity.handle!, to), identity.handle!, identity.band, {
      to,
      text: verdict.text,
      stripped: verdict.stripped ?? false,
    })
    if (seq === null) return ack?.({ ok: false, why: 'wire no gree — try again' })
    const ev = { seq, kind: 'dm' as const, channel: dmChannel(identity.handle!, to), actor: identity.handle!, band: identity.band, payload: { to, text: verdict.text, stripped: verdict.stripped ?? false } }
    io.to(dmRoom(identity.handle!, to)).emit('wire:event', ev)
    // THE DELIVERY LAW: the paddy hears the DM even if their UI never opened
    // the thread — delivery rides the PERSON, not their open tabs. Direct
    // emit to their current socket; a duplicate (they joined the room) dies
    // on the client's seq-dedupe law. Offline paddies drink later: the
    // cursor replay and the social:dms history carry the same rows.
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
    ack?.({ ok: true, events: eventsSince(since, identity.handle), head: headSeq() })
  })

  /* ── W5 THE CONNECT — the social graph at the server door ── */
  socket.on('social:list', (_raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    ack?.({ ok: true, graph: graphFor(identity.handle!) })
  })

  socket.on('social:add', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('social')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { handle?: string }
    const other = socialNorm(body.handle)
    const edgeAB = edgeGet(identity.handle!, other)
    const edgeBA = edgeGet(other, identity.handle!)
    const verdict = requestVerdict(identity.handle!, other, edgeAB, edgeBA)
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    if (!accountExists(other)) return ack?.({ ok: false, why: 'no-such-paddy' })
    try {
      if (verdict.kind === 'mutual') {
        // THE MUTUAL LAW: their request + my gesture = paddies, one write
        edgePut(identity.handle!, other, 'friend', other)
        edgePut(other, identity.handle!, 'friend', other)
        pushSocial(io, other, { type: 'accepted', by: identity.handle })
        ack?.({ ok: true, state: 'friend' })
      } else {
        edgePut(identity.handle!, other, 'pending', identity.handle!)
        edgePut(other, identity.handle!, 'pending', identity.handle!)
        pushSocial(io, other, { type: 'request', from: identity.handle })
        ack?.({ ok: true, state: 'pending' })
      }
    } catch {
      ack?.({ ok: false, why: 'wire no gree — try again' })
    }
  })

  socket.on('social:accept', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('social')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { handle?: string }
    const other = socialNorm(body.handle)
    const verdict = acceptVerdict(identity.handle!, other, edgeGet(identity.handle!, other), edgeGet(other, identity.handle!))
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      edgePut(identity.handle!, other, 'friend', other)
      edgePut(other, identity.handle!, 'friend', other)
      pushSocial(io, other, { type: 'accepted', by: identity.handle })
      ack?.({ ok: true, state: 'friend' })
    } catch {
      ack?.({ ok: false, why: 'wire no gree — try again' })
    }
  })

  socket.on('social:decline', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { handle?: string }
    const other = socialNorm(body.handle)
    const edge = edgeGet(identity.handle!, other)
    if (edge?.state !== 'pending' || edge.requestedBy !== other) return ack?.({ ok: false, why: 'not-requested' })
    edgeDel(identity.handle!, other)
    edgeDel(other, identity.handle!)
    ack?.({ ok: true })
  })

  socket.on('social:remove', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { handle?: string }
    const other = socialNorm(body.handle)
    if (edgeGet(identity.handle!, other)?.state !== 'friend') return ack?.({ ok: false, why: 'not-friends' })
    edgeDel(identity.handle!, other)
    edgeDel(other, identity.handle!)
    ack?.({ ok: true })
  })

  socket.on('social:block', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('social')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { handle?: string }
    const other = socialNorm(body.handle)
    if (!SOCIAL_HANDLE_RE.test(other) || other === identity.handle) return ack?.({ ok: false, why: 'bad-handle' })
    try {
      // THE BLOCK LAW: my wall goes up; any relationship from their side dies
      edgePut(identity.handle!, other, 'blocked', identity.handle!)
      edgeDel(other, identity.handle!)
      ack?.({ ok: true })
    } catch {
      ack?.({ ok: false, why: 'wire no gree — try again' })
    }
  })

  socket.on('social:unblock', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { handle?: string }
    const other = socialNorm(body.handle)
    if (edgeGet(identity.handle!, other)?.state !== 'blocked') return ack?.({ ok: false, why: 'not-blocked' })
    edgeDel(identity.handle!, other)
    ack?.({ ok: true })
  })

  socket.on('social:report', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { handle?: string; reason?: string }
    const verdict = reportVerdict(socialNorm(body.handle), typeof body.reason === 'string' ? body.reason : 'other')
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      db.query('INSERT INTO ReportRow (byHandle, targetHandle, reason, status, createdAt) VALUES (?, ?, ?, ?, ?)').run(
        identity.handle!, socialNorm(body.handle), verdict.reason ?? 'other', 'open', Date.now(),
      )
      ack?.({ ok: true }) // evidence filed — the union go look am (W12 console)
    } catch {
      ack?.({ ok: false, why: 'wire no gree — try again' })
    }
  })

  socket.on('social:dms', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { with?: string; since?: number }
    const other = socialNorm(body.with)
    if (!other || other === identity.handle) return ack?.({ ok: false, why: 'bad-handle' })
    const since = Number(body.since ?? 0)
    const rows = db
      .query(
        'SELECT seq, kind, channel, actor, band, payload, createdAt FROM LiveEvent WHERE (channel = ? OR channel = ?) AND seq > ? ORDER BY seq ASC LIMIT ?'
      )
      .all(dmChannel(identity.handle!, other), dmChannel(other, identity.handle!), Number.isFinite(since) ? since : 0, DM_HISTORY_CAP) as {
      seq: number
      kind: string
      channel: string
      actor: string
      band: string
      payload: string
      createdAt: number | string
    }[]
    ack?.({
      ok: true,
      events: rows
        .filter((e) => e.kind === 'dm' || e.kind === 'hangout')
        .map((e) => ({
          seq: Number(e.seq),
          kind: e.kind,
          channel: e.channel,
          actor: e.actor,
          band: e.band,
          payload: JSON.parse(e.payload || '{}'),
          ts: typeof e.createdAt === 'number' ? e.createdAt : Date.parse(String(e.createdAt)) || Date.now(),
        })),
    })
  })

  socket.on('social:invite', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('social')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { to?: string; street?: string }
    const to = socialNorm(body.to)
    if (!to || to === identity.handle) return ack?.({ ok: false, why: 'bad-handle' })
    const verdict = dmVerdict(identity.band, edgeGet(to, identity.handle!), edgeGet(identity.handle!, to))
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    if (!accountExists(to)) return ack?.({ ok: false, why: 'no-such-paddy' })
    const payload = hangoutPayload(identity.handle!, to, typeof body.street === 'string' ? body.street : 'home')
    const seq = persistEvent('hangout', dmChannel(identity.handle!, to), identity.handle!, identity.band, payload)
    if (seq === null) return ack?.({ ok: false, why: 'wire no gree — try again' })
    const ev = { seq, kind: 'hangout' as const, channel: dmChannel(identity.handle!, to), actor: identity.handle!, band: identity.band, payload }
    io.to(dmRoom(identity.handle!, to)).emit('wire:event', ev)
    pushSocial(io, to, { type: 'hangout', from: identity.handle, street: payload.street, seq })
    ack?.({ ok: true, seq })
  })

  /* ── W6 THE LEDGER — the nation purse at the server door ──
   * THE MINOR BLOCK: kid/teen refuse every purse verb, structurally.
   * THE PIN LAW: the spend sides answer to the REAL PIN (scrypt, timing-safe).
   * THE IDEMPOTENCY LAW: a replayed idemKey returns the SAME receipt.
   * THE RECEIPT LAW: the receiver learns on BOTH lanes. ── */
  socket.on('wallet', (_raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const w = walletGet(identity.handle!)
    ack?.({ ok: true, balance: w.balance, transferredToday: dayTransferred(identity.handle!), recent: recentLedger(identity.handle!) })
  })

  socket.on('wallet:deposit', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const body = (raw ?? {}) as { amount?: number; idemKey?: string; note?: string }
    const amount = Math.floor(Number(body.amount))
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    // THE DEPOSIT VERDICT — the pocket is judged client-side by the honest
    // engine; the purse check is meaningless for a top-up
    const verdict = depositVerdict({ band: identity.band, amount })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      const receipt = theMove({ kind: 'deposit', from: identity.handle!, to: identity.handle!, amount, idemKey, note: typeof body.note === 'string' ? body.note.slice(0, 80) : 'pocket → purse' })
      ack?.({ ok: true, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  socket.on('wallet:withdraw', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const account = accountFullByToken(handshakeTokenOf(socket))
    if (!account || account.handle !== identity.handle) return ack?.({ ok: false, why: 'unclaimed' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const body = (raw ?? {}) as { amount?: number; pin?: string; idemKey?: string }
    const amount = Math.floor(Number(body.amount))
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    if (!pinVerifies(account, body.pin)) return ack?.({ ok: false, why: 'bad-pin' })
    const verdict = transferVerdict({ band: identity.band, amount, purse: walletGet(identity.handle!).balance, transferredToday: 0 })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      const receipt = theMove({ kind: 'withdraw', from: identity.handle!, to: identity.handle!, amount, idemKey, note: 'purse → pocket' })
      ack?.({ ok: true, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  socket.on('wallet:transfer', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('wallet')) return ack?.({ ok: false, why: 'too-fast' })
    const account = accountFullByToken(handshakeTokenOf(socket))
    if (!account || account.handle !== identity.handle) return ack?.({ ok: false, why: 'unclaimed' })
    if (identity.band === 'kid' || identity.band === 'teen') return ack?.({ ok: false, why: 'minors-no-money' })
    const body = (raw ?? {}) as { to?: string; amount?: number; pin?: string; idemKey?: string; note?: string }
    const to = socialNorm(body.to)
    const amount = Math.floor(Number(body.amount))
    const idemKey = typeof body.idemKey === 'string' ? body.idemKey.slice(0, 80) : ''
    if (!idemKey) return ack?.({ ok: false, why: 'bad-idem' })
    if (!pinVerifies(account, body.pin)) return ack?.({ ok: false, why: 'bad-pin' })
    // THE REPLAY FIRST: a retry with the SAME key returns the SAME receipt
    // with no laws re-judged — the receiver's credit never doubles.
    const replay = ledgerByIdem(idemKey)
    if (replay) return ack?.({ ok: true, receipt: receiptOf(replay), balance: walletGet(identity.handle!).balance, replayed: true })
    const toBand = accountBand(to)
    if (!toBand) return ack?.({ ok: false, why: 'no-such-paddy' })
    if (toBand !== 'adult') return ack?.({ ok: false, why: 'minors-collect-nothing' })
    if (to === identity.handle) return ack?.({ ok: false, why: 'self' })
    const verdict = transferVerdict({ band: identity.band, to, from: identity.handle, amount, purse: walletGet(identity.handle!).balance, transferredToday: dayTransferred(identity.handle!) })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    try {
      const receipt = theMove({ kind: 'transfer', from: identity.handle!, to, amount, idemKey, note: typeof body.note === 'string' ? body.note.slice(0, 80) : '' })
      deliverTransferReceipt(io, receipt, to)
      ack?.({ ok: true, receipt, balance: walletGet(identity.handle!).balance })
    } catch (why) {
      ack?.({ ok: false, why: String(why) })
    }
  })

  /* ── W7 THE VOICE — the dialed call at the server door ──
   * THE DIAL LAW (adults BOTH ends — a minor never places nor receives a
   * voice call; the block wall; ghosts; offline; busy). THE ANSWER-IS-
   * THE-OPT-IN LAW: a dialed ring is answered by a human thumb. THE
   * RELAY DOCTRINE: this socket relays SEALED SDP/ICE envelopes and
   * never simulates media — the audio flies peer-to-peer, the wire
   * stays thin (N5). ── */
  socket.on('call:ring', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { to?: string; video?: boolean }
    const to = socialNorm(body.to)
    const video = body.video === true
    const verdict = dialVerdict({
      callerBand: identity.band,
      targetBand: accountBand(to),
      targetExists: accountExists(to),
      targetOnline: presence.has(to),
      targetBusy: !!callOfHandle(to),
      callerBusy: !!callOfHandle(identity.handle!),
      blockedEitherWay: edgeGet(identity.handle!, to)?.state === 'blocked' || edgeGet(to, identity.handle!)?.state === 'blocked',
      self: to === identity.handle,
    })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    const callId = `c:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
    calls.set(callId, { callId, from: identity.handle!, to, video, state: 'ringing', startedAt: Date.now() })
    pushCall(io, to, { type: 'ring', callId, from: identity.handle!, video })
    ack?.({ ok: true, callId })
  })

  socket.on('call:accept', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { callId?: string }
    const c = callIdOk(body.callId) ? calls.get(body.callId) : undefined
    if (!c) return ack?.({ ok: false, why: 'no-call' })
    if (c.to !== identity.handle) return ack?.({ ok: false, why: 'not-yours' })
    if (c.state !== 'ringing') return ack?.({ ok: false, why: 'not-ringing' })
    c.state = 'accepted'
    pushCall(io, c.from, { type: 'accepted', callId: c.callId })
    ack?.({ ok: true, iceServers: iceServersFor() })
  })

  socket.on('call:decline', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { callId?: string }
    const c = callIdOk(body.callId) ? calls.get(body.callId) : undefined
    if (!c) return ack?.({ ok: false, why: 'no-call' })
    if (c.to !== identity.handle) return ack?.({ ok: false, why: 'not-yours' })
    endCall(io, c, 'declined', identity.handle!)
    ack?.({ ok: true })
  })

  socket.on('call:hangup', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const body = (raw ?? {}) as { callId?: string; why?: string }
    const c = callIdOk(body.callId) ? calls.get(body.callId) : undefined
    if (!c) return ack?.({ ok: false, why: 'no-call' })
    if (c.from !== identity.handle && c.to !== identity.handle) return ack?.({ ok: false, why: 'not-yours' })
    const why = endWhyOk(body.why) ? body.why : 'hangup'
    endCall(io, c, why, identity.handle!)
    ack?.({ ok: true })
  })

  socket.on('call:offer', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { callId?: string; sdp?: string }
    const c = callIdOk(body.callId) ? calls.get(body.callId) : undefined
    if (!c) return ack?.({ ok: false, why: 'no-call' })
    if (c.from !== identity.handle) return ack?.({ ok: false, why: 'not-yours' })
    if (c.state !== 'accepted' && c.state !== 'connecting') return ack?.({ ok: false, why: 'not-accepted' })
    if (!sdpOk(body.sdp)) return ack?.({ ok: false, why: 'bad-sdp' })
    c.state = 'connecting'
    pushCall(io, c.to, { type: 'offer', callId: c.callId, sdp: body.sdp })
    ack?.({ ok: true })
  })

  socket.on('call:answer', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { callId?: string; sdp?: string }
    const c = callIdOk(body.callId) ? calls.get(body.callId) : undefined
    if (!c) return ack?.({ ok: false, why: 'no-call' })
    if (c.to !== identity.handle) return ack?.({ ok: false, why: 'not-yours' })
    if (c.state !== 'connecting') return ack?.({ ok: false, why: 'no-offer' })
    if (!sdpOk(body.sdp)) return ack?.({ ok: false, why: 'bad-sdp' })
    c.state = 'active'
    c.startedAt = Date.now()
    pushCall(io, c.from, { type: 'answer', callId: c.callId, sdp: body.sdp })
    ack?.({ ok: true })
  })

  socket.on('call:ice', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { callId?: string; candidate?: unknown }
    const c = callIdOk(body.callId) ? calls.get(body.callId) : undefined
    if (!c) return ack?.({ ok: false, why: 'no-call' })
    if (c.from !== identity.handle && c.to !== identity.handle) return ack?.({ ok: false, why: 'not-yours' })
    if (c.state !== 'connecting' && c.state !== 'active') return ack?.({ ok: false, why: 'not-connecting' })
    if (!iceOk(body.candidate)) return ack?.({ ok: false, why: 'bad-ice' })
    const other = c.from === identity.handle ? c.to : c.from
    pushCall(io, other, { type: 'ice', callId: c.callId, candidate: body.candidate })
    ack?.({ ok: true })
  })

  /* ── W8 THE CAMERA STATE — the face's signaling truth. THE CAMERA
   * STATE LAW: the camera is announced, never relayed as media — the
   * wire checks the boolean seal and pushes it to the OTHER EAR ALONE
   * (a stranger never learns a stranger's camera). The refusal truth
   * rides it too: a camera that never opened is said, not faked. ── */
  socket.on('call:cam', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { callId?: string; on?: unknown }
    const c = callIdOk(body.callId) ? calls.get(body.callId) : undefined
    if (!c) return ack?.({ ok: false, why: 'no-call' })
    if (c.from !== identity.handle && c.to !== identity.handle) return ack?.({ ok: false, why: 'not-yours' })
    if (c.state !== 'connecting' && c.state !== 'active') return ack?.({ ok: false, why: 'not-connecting' })
    if (typeof body.on !== 'boolean') return ack?.({ ok: false, why: 'bad-cam' })
    const other = c.from === identity.handle ? c.to : c.from
    pushCall(io, other, { type: 'cam', callId: c.callId, on: body.on })
    ack?.({ ok: true })
  })

  /* ── W7 THE PROXIMITY VOICE — the street walkie (the M17 law verbatim:
   * adults, opt-in, same street). The mesh is the CLIENT's (≤4 peers);
   * the door only admits lawful walkers and relays lawful envelopes. ── */
  socket.on('voice:join', (_raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (identity.band !== 'adult') return ack?.({ ok: false, why: 'minors-no-voice' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const me = presence.get(identity.handle!)
    if (!me) return ack?.({ ok: false, why: 'no-street' })
    me.voiceOn = true
    socket.join(`voice:street:${me.street}`)
    const peers = pvPeers(identity.handle!, me.street, [...presence.values()])
    socket.to(`voice:street:${me.street}`).emit('wire:voice', { type: 'joined', handle: identity.handle!, street: me.street })
    ack?.({ ok: true, street: me.street, peers })
  })

  socket.on('voice:leave', (_raw: unknown, ack?: (r: unknown) => void) => {
    const me = presence.get(identity.handle!)
    if (me && me.voiceOn) {
      me.voiceOn = false
      socket.leave(`voice:street:${me.street}`)
      socket.to(`voice:street:${me.street}`).emit('wire:voice', { type: 'left', handle: identity.handle!, street: me.street })
    }
    ack?.({ ok: true })
  })

  socket.on('pv:offer', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (identity.band !== 'adult') return ack?.({ ok: false, why: 'minors-no-voice' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { to?: string; sdp?: string }
    if (!sdpOk(body.sdp)) return ack?.({ ok: false, why: 'bad-sdp' })
    const from = presence.get(identity.handle!) ?? null
    const target = presence.get(socialNorm(body.to)) ?? null
    if (!pvRelayOk(from, target)) return ack?.({ ok: false, why: 'voice-dark' })
    pushPv(io, target!.handle, { type: 'pv-offer', from: identity.handle!, sdp: body.sdp })
    ack?.({ ok: true })
  })

  socket.on('pv:answer', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (identity.band !== 'adult') return ack?.({ ok: false, why: 'minors-no-voice' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { to?: string; sdp?: string }
    if (!sdpOk(body.sdp)) return ack?.({ ok: false, why: 'bad-sdp' })
    const from = presence.get(identity.handle!) ?? null
    const target = presence.get(socialNorm(body.to)) ?? null
    if (!pvRelayOk(from, target)) return ack?.({ ok: false, why: 'voice-dark' })
    pushPv(io, target!.handle, { type: 'pv-answer', from: identity.handle!, sdp: body.sdp })
    ack?.({ ok: true })
  })

  socket.on('pv:ice', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { to?: string; candidate?: unknown }
    if (!iceOk(body.candidate)) return ack?.({ ok: false, why: 'bad-ice' })
    const from = presence.get(identity.handle!) ?? null
    const target = presence.get(socialNorm(body.to)) ?? null
    if (!pvRelayOk(from, target)) return ack?.({ ok: false, why: 'voice-dark' })
    pushPv(io, target!.handle, { type: 'pv-ice', from: identity.handle!, candidate: body.candidate })
    ack?.({ ok: true })
  })

  /* ── latency witness ── */
  socket.on('ping', (_raw: unknown, ack?: (r: unknown) => void) => ack?.({ t: Date.now() }))

  socket.on('disconnect', () => {
    // W7: my phone fell off the wire — my call ends honestly (the sweep
    // is the backstop; this is the instant truth). THE FRESH-SID LAW: a
    // reconnect races its own disconnect — the old socket's goodbye may
    // land AFTER the successor's hello; it must never delete (or kill)
    // what the successor now owns.
    const p = presence.get(identity.handle ?? '')
    const mine = callOfHandle(identity.handle ?? '')
    if (mine && (!p || p.sid === socket.id)) endCall(io, mine, 'hangup', 'system')
    if (claimed && p && p.sid === socket.id) {
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
