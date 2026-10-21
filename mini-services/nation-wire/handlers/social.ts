/**
 * LOKOJA LIFE — PH2.5 CHARLIE: THE NATION WIRE — SOCIAL
 * =====================================================
 * The chat lanes + the connect graph, moved VERBATIM from index.ts
 * (zero logic changes). Domains: the one-nation word lanes (chat/emote/
 * dm/dm:open/typing), the W5 social graph doors (social:list/add/accept/
 * decline/remove/block/unblock/report/dms/invite). The tier laws
 * (sanitizeChat/canLive/emoteById) are IMPORTED from the game, never
 * copied — zero drift by construction.
 */
import { sanitizeChat, canLive, emoteById, crowdMult } from '../../../src/game/systems/live'
import {
  requestVerdict,
  acceptVerdict,
  dmVerdict,
  reportVerdict,
  socialNorm,
  SOCIAL_HANDLE_RE,
  dmChannel,
  hangoutPayload,
} from '../../../src/game/systems/socialgraph'
import type { Server, WireCtx, WireConn, FriendRowT } from '../context'

const DM_HISTORY_CAP = 100

/** ── DM pairing room name (sorted pair, the W5 channel law) ── */
function dmRoom(a: string, b: string): string {
  return `dm:${[a, b].sort().join('|')}`
}

export function register(io: Server, ctx: WireCtx, conn: WireConn): void {
  const { db, presence, persistEvent, edgeGet, accountExists } = ctx
  const { socket, identity, allow, claimed } = conn

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

  function pushSocial(io: Server, toHandle: string, payload: Record<string, unknown>): void {
    const p = presence.get(toHandle)
    if (p?.sid) io.to(p.sid).emit('wire:social', payload) // THE DELIVERY LAW: rides the person
  }

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

  // PH2.5-NOTE (pre-existing, moved verbatim): this history door is an
  // unthrottled DB read — no allow() gate, the exact shape the account
  // eye was added to `wallet` for. Left as-is per the verbatim-movement
  // law; hardening it is a future wave's honest change.
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
}
