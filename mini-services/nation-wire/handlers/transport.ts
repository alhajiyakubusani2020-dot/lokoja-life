/**
 * LOKOJA LIFE — PH2.5 CHARLIE: THE NATION WIRE — TRANSPORT
 * ========================================================
 * The plumbing lanes, moved VERBATIM from index.ts (zero logic
 * changes). Domains: the cursor law's replay (resume), the W7 dialed
 * call signaling (call:ring/accept/decline/hangup/offer/answer/ice/cam),
 * the W7 street walkie (voice:join/leave + pv:offer/answer/ice), the
 * W9 stage MESH RELAY (stage:offer/answer/ice — the sealed-envelope
 * doors, W7's own envelope laws), the latency witness (ping), the
 * disconnect law, and the 15s presence sweep (sweepPresence — index.ts
 * keeps the setInterval).
 */
import {
  dialVerdict,
  callChannelInvolves,
  callIdOk,
  endWhyOk,
  sdpOk,
  iceOk,
  pvPeers,
  pvRelayOk,
} from '../../../src/game/systems/voice'
import { dmChannel, dmChannelInvolves, socialNorm } from '../../../src/game/systems/socialgraph'
import { crewVoiceOk } from '../../../src/game/systems/wheels'
import { stageIdOk } from '../../../src/game/systems/stage'
import { type LiveBand } from '../../../src/game/systems/live'
import type { Server, WireCtx, WireConn, WireCall } from '../context'

const RESUME_CAP = 100

/* ── the presence sweep: a stale row is an absent neighbour ── */
export function sweepPresence(io: Server, ctx: WireCtx): boolean {
  const { presence, calls, dropCrew, vehiclePersist, broadcastParked, endCall, broadcastRoster } = ctx
  const now = Date.now()
  let changed = false
  for (const [handle, p] of presence) {
    const live = io.sockets.sockets.get(p.sid)
    if (live && live.connected) {
      // a connected socket IS presence — the TTL only ever sweeps zombies
      p.ts = now
      continue
    }
    // W10-b — the zombie's car ends honestly: the crew is put down where
    // the car stands, and the parked row keeps the car visible.
    if (p.car) {
      dropCrew(io, p.car, handle)
      vehiclePersist(p.car, handle)
      broadcastParked(io, p.street, p.car, handle)
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

export function register(io: Server, ctx: WireCtx, conn: WireConn): void {
  const { db, presence, calls, lastMoment, stages, stageIdByHost, persistEvent, pushCall, endCall, edgeGet, accountBand, accountExists, headSeq, dropCrew, vehiclePersist, broadcastParked, broadcastRoster, endStage, pushViewers } = ctx
  const { socket, identity, allow, claimed } = conn

  /* ── the cursor law's replay — one cursor, both lanes (resume reads it) ── */
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

  function callOfHandle(handle: string): WireCall | null {
    for (const c of calls.values()) if (c.from === handle || c.to === handle) return c
    return null
  }

  /** THE WALKIE LANE — the proximity envelopes ride their OWN lane: the
   *  call lane stays pure (a dialed call is one phone, one state line);
   *  the street mesh is many tiny envelopes with no registry at all. */
  function pushPv(io: Server, toHandle: string, payload: Record<string, unknown>): void {
    const p = presence.get(toHandle)
    if (p?.sid) io.to(p.sid).emit('wire:pv', payload) // rides the person
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

  /** THE CREW KEY — the driver owns their crew; a passenger carries the
   *  driver's key; a walker on foot carries none. The interior voice zone
   *  reads this at the envelope doors. */
  function crewKeyOf(handle: string): string | null {
    const p = presence.get(handle)
    if (!p) return null
    if (p.car) return handle
    if (p.riding) return p.riding.driver
    return null
  }

  /** THE CREW ZONE — the door-side wrapper of the pure law: while EITHER
   *  mouth sits in a live car, both must share the crew (crewVoiceOk
   *  verbatim); on foot, the street walkie's own law already ruled. */
  function crewZoneOk(meHandle: string, meBand: LiveBand, peerHandle: string, peerBand: LiveBand): boolean {
    const myCrew = crewKeyOf(meHandle)
    const peerCrew = crewKeyOf(peerHandle)
    if (!myCrew && !peerCrew) return true // nobody is aboard — the street walkie rules
    return crewVoiceOk({ meBand, peerBand, myCrew, peerCrew })
  }

  /* ── resume: the cursor law — one cursor, both lanes ── */
  socket.on('resume', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!allow('resume')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { since?: number }
    const since = Number(body.since ?? 0)
    if (!Number.isFinite(since) || since < 0) return ack?.({ ok: false, why: 'bad-cursor' })
    ack?.({ ok: true, events: eventsSince(since, identity.handle), head: headSeq() })
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
    // W10-b — THE INTERIOR ZONE: while either mouth sits in a live car
    // (driving or riding), the envelope must stay INSIDE that crew — the
    // street walkie hears the car, not the whole road.
    if (!crewZoneOk(identity.handle!, identity.band, target!.handle, target!.band)) {
      return ack?.({ ok: false, why: 'not-crew' })
    }
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
    if (!crewZoneOk(identity.handle!, identity.band, target!.handle, target!.band)) {
      return ack?.({ ok: false, why: 'not-crew' })
    }
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
    if (!crewZoneOk(identity.handle!, identity.band, target!.handle, target!.band)) {
      return ack?.({ ok: false, why: 'not-crew' })
    }
    pushPv(io, target!.handle, { type: 'pv-ice', from: identity.handle!, candidate: body.candidate })
    ack?.({ ok: true })
  })

  /* ── THE MESH RELAY — three doors, sealed envelopes only. THE ENVELOPE
   * LAWS are the W7 voice's own (sdpOk ≤16KB, iceOk the full candidate
   * envelope) run VERBATIM here. THE DIRECTION LAW: the offer flows from
   * the HOST alone; the answer and the ICE from a registered eye alone;
   * every envelope lands on its named peer — a stranger's envelope never
   * rides. ── */
  socket.on('stage:offer', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown; to?: unknown; sdp?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: false, why: 'stage-not-live' })
    if (identity.handle !== s.host) return ack?.({ ok: false, why: 'not-yours' })
    if (typeof body.sdp !== 'string' || !sdpOk(body.sdp)) return ack?.({ ok: false, why: 'bad-sdp' })
    const sid = typeof body.to === 'string' ? s.eyesSid.get(body.to) : undefined
    if (!sid) return ack?.({ ok: false, why: 'no-such-eye' })
    io.to(sid).emit('wire:stage', { type: 'offer', streamId: s.id, sdp: body.sdp, from: s.host })
    ack?.({ ok: true })
  })

  socket.on('stage:answer', (raw: unknown, ack?: (r: unknown) => void) => {
    // PH2.5-NOTE (pre-existing, moved verbatim): this guard is VACUOUS —
    // !claimed implies band === 'guest', so `!claimed && band !== 'guest'`
    // can never fire; the mesh answer path for guest eyes is the designed
    // behavior, so the dead check stays exactly as written.
    if (!claimed && identity.band !== 'guest') return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown; sdp?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: false, why: 'stage-not-live' })
    const eye = identity.handle ?? `guest:${socket.id}`
    if (!s.viewers.has(eye)) return ack?.({ ok: false, why: 'not-watching' })
    if (typeof body.sdp !== 'string' || !sdpOk(body.sdp)) return ack?.({ ok: false, why: 'bad-sdp' })
    const hp = presence.get(s.host)
    if (hp?.sid) io.to(hp.sid).emit('wire:stage', { type: 'answer', streamId: s.id, sdp: body.sdp, from: eye })
    ack?.({ ok: true })
  })

  socket.on('stage:ice', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!allow('call')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown; to?: unknown; candidate?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: false, why: 'stage-not-live' })
    const eye = identity.handle ?? `guest:${socket.id}`
    const isHost = identity.handle === s.host
    if (!isHost && !s.viewers.has(eye)) return ack?.({ ok: false, why: 'not-watching' })
    if (!body.candidate || typeof body.candidate !== 'object' || !iceOk(body.candidate)) return ack?.({ ok: false, why: 'bad-ice' })
    if (isHost) {
      // the host's candidate rides to a named eye
      const sid = typeof body.to === 'string' ? s.eyesSid.get(body.to) : undefined
      if (!sid) return ack?.({ ok: false, why: 'no-such-eye' })
      io.to(sid).emit('wire:stage', { type: 'ice', streamId: s.id, candidate: body.candidate, from: s.host })
    } else {
      // the eye's candidate rides to the host
      const hp = presence.get(s.host)
      if (hp?.sid) io.to(hp.sid).emit('wire:stage', { type: 'ice', streamId: s.id, candidate: body.candidate, from: eye })
    }
    ack?.({ ok: true })
  })

  /* ── latency witness ── */
  socket.on('ping', (_raw: unknown, ack?: (r: unknown) => void) => ack?.({ t: Date.now() }))

  socket.on('disconnect', () => {
    // W9 — THE STAGE DIES WITH THE HOST: my socket's goodbye ends my live
    // stage (the sweep is not needed — a stage without its host is a dead
    // air lie), and my eye leaves every stage I was watching.
    if (identity.handle) {
      const myStageId = stageIdByHost.get(identity.handle)
      if (myStageId) {
        const s = stages.get(myStageId)
        if (s && s.hostSid === socket.id) endStage(io, s, 'system')
      }
      for (const s of stages.values()) {
        if (s.viewers.has(identity.handle)) {
          s.viewers.delete(identity.handle)
          s.eyesSid.delete(identity.handle)
          pushViewers(io, s)
          const hp = presence.get(s.host)
          if (hp?.sid) io.to(hp.sid).emit('wire:stage', { type: 'eye-gone', streamId: s.id, eye: identity.handle })
        }
      }
    }

    // THE GUEST EYE LAW (hardening): a guest's eye dies with its socket —
    // eight refreshes can no longer hold a stage's seats hostage. The
    // old cleanup only ran for claimed handles, so guest eyes leaked
    // until the host ended the stage.
    const guestEye = `guest:${socket.id}`
    for (const s of stages.values()) {
      if (s.viewers.delete(guestEye)) {
        s.eyesSid.delete(guestEye)
        pushViewers(io, s)
        const hp = presence.get(s.host)
        if (hp?.sid) io.to(hp.sid).emit('wire:stage', { type: 'eye-gone', streamId: s.id, eye: guestEye })
      }
    }

    // W7: my phone fell off the wire — my call ends honestly (the sweep
    // is the backstop; this is the instant truth). THE FRESH-SID LAW: a
    // reconnect races its own disconnect — the old socket's goodbye may
    // land AFTER the successor's hello; it must never delete (or kill)
    // what the successor now owns.
    const p = presence.get(identity.handle ?? '')
    const mine = callOfHandle(identity.handle ?? '')
    if (mine && (!p || p.sid === socket.id)) endCall(io, mine, 'hangup', 'system')
    if (claimed && p && p.sid === socket.id) {
      // THE LAST MOMENT survives the goodbye — the re-hello law reads it
      if (p.hasPos) lastMoment.set(identity.handle!, { x: p.x, z: p.z, hd: p.hd })
      // W10/W10-b — THE PARK LAW's last word: the goodbye persists the car
      // where it stopped, the crew is put down honestly, and the PARKED
      // BROADCAST keeps the car visible to the street it stopped on.
      if (p.car) {
        dropCrew(io, p.car, identity.handle!)
        vehiclePersist(p.car, identity.handle!)
        broadcastParked(io, p.street, p.car, identity.handle!)
      }
      presence.delete(identity.handle!)
      broadcastRoster(io)
    }
  })
}
