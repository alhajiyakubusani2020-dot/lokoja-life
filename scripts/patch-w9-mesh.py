#!/usr/bin/env python3
"""W9 mesh pivot — the wire's stage section rides the 1:N mesh (signaling on
the wire, media P2P). Removes the dead LiveKit JWT mint (the OSS server has
no WHIP door — witnessed) and adds the three relay doors + the eye law."""
import sys

P = '/home/z/my-project/mini-services/nation-wire/index.ts'
src = open(P, encoding='utf-8').read()

if 'stage:offer' in src:
    print('already meshed — skip')
    sys.exit(0)

# ── 1. the media house block → the mesh doctrine + the eyes map ──
OLD_MINT_START = "/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 W9 THE STAGE \u2014 the media house + the registry \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */"
OLD_MINT_END = "function mintStageId(): string {"
i0 = src.find(OLD_MINT_START)
i1 = src.find(OLD_MINT_END)
if i0 < 0 or i1 < 0 or i1 <= i0:
    print(f'FATAL mint anchors: {i0} {i1}')
    sys.exit(1)

NEW_MINT = '''/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 W9 THE STAGE \u2014 the mesh registry \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

/* THE MESH DOCTRINE (the honest amendment, recorded in stage.ts): the OSS
 * livekit-server ships NO WHIP door (witnessed 404 with a VALID grant on
 * two versions) and the SDK would blow the N2 wire budget \u2014 so the stage
 * rides the W7/W8 architecture: SIGNALING on the nation-wire, MEDIA
 * peer-to-peer. The publisher offers to each eye; the wire relays the
 * sealed envelopes and NEVER sees a media byte (N5 holds). The SFU is the
 * W12+ upgrade path when the mesh cap demands it. */

interface StageT {
  id: string
  host: string
  title: string
  startedAt: number
  viewers: Set<string> // the eye keys (handles; guests = guest:<sid>)
  eyesSid: Map<string, string> // eye key \u2192 the socket the envelopes ride to
  hostSid: string
}

/* THE REGISTRY IS MEMORY \u2014 a stage is a LIVE thing: when the host's socket
 * dies, the stage dies with it (THE STAGE DIES WITH THE HOST law). The
 * StreamRow keeps the honest board record (status live \u2192 ended); the live
 * truth is this map, like presence, like calls. */
const stages = new Map<string, StageT>()
const stageIdByHost = new Map<string, string>()

function stageRow(id: string, status: 'live' | 'ended', viewersSnapshot: string[]): void {
  try {
    db.query('UPDATE StreamRow SET status = ?, viewersJson = ?, updatedAt = ? WHERE id = ?').run(
      status,
      JSON.stringify(viewersSnapshot),
      new Date().toISOString(),
      id
    )
  } catch (e) {
    console.error(`[nation-wire] stageRow refused (${String(e).slice(0, 120)})`)
  }
}

function stageBoard() {
  return [...stages.values()]
    .sort((a, b) => a.startedAt - b.startedAt)
    .map((s) => ({ id: s.id, host: s.host, title: s.title, kind: STAGE_KIND, viewers: s.viewers.size, startedAt: s.startedAt }))
}

function endStage(io: Server, s: StageT, why: 'host' | 'system'): void {
  if (!stages.has(s.id)) return
  stages.delete(s.id)
  if (stageIdByHost.get(s.host) === s.id) stageIdByHost.delete(s.host)
  stageRow(s.id, 'ended', [...s.viewers])
  io.to(stageRoom(s.id)).emit('wire:stage', { type: 'ended', streamId: s.id, why })
  io.to('wire:global').emit('wire:stage', { type: 'ended', streamId: s.id, why })
}

function pushViewers(io: Server, s: StageT): void {
  io.to(stageRoom(s.id)).emit('wire:stage', { type: 'viewers', streamId: s.id, viewers: s.viewers.size })
}

function mintStageId(): string {'''

src = src[:i0] + NEW_MINT + src[i1 + len(OLD_MINT_END):]

# also mintStageId's body survived (it was AFTER the old end anchor) \u2014 verify below.

# \u2500\u2500 2. stage:start ack \u2014 no token, the mesh hands the publisher the eyes \u2500\u2500
src = src.replace(
    "    const stage: StageT = { id, host: identity.handle!, title: v.title!, startedAt: Date.now(), viewers: new Set(), hostSid: socket.id }",
    "    const stage: StageT = { id, host: identity.handle!, title: v.title!, startedAt: Date.now(), viewers: new Set(), eyesSid: new Map(), hostSid: socket.id }")
src = src.replace(
    "    ack?.({ ok: true, streamId: id, title: stage.title, token: lkToken(stage.host, id, true) })",
    "    ack?.({ ok: true, streamId: id, title: stage.title })")

# \u2500\u2500 3. stage:watch \u2014 THE EYE LAW + the eye push to the host \u2500\u2500
OLD_WATCH = """  socket.on('stage:watch', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!allow('stage')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    const w = stageWatchVerdict(identity, !!s)
    if (!w.ok || !s) return ack?.({ ok: false, why: w.why ?? 'stage-not-live' })
    const eye = identity.handle ?? `guest:${socket.id}`
    s.viewers.add(eye)
    socket.join(stageRoom(s.id))
    pushViewers(io, s)
    ack?.({ ok: true, streamId: s.id, title: s.title, host: s.host, viewers: s.viewers.size, token: lkToken(eye, s.id, false) })
  })"""
NEW_WATCH = """  socket.on('stage:watch', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!allow('stage')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    const w = stageWatchVerdict(identity, !!s)
    if (!w.ok || !s) return ack?.({ ok: false, why: w.why ?? 'stage-not-live' })
    const eye = identity.handle ?? `guest:${socket.id}`
    // THE EYE LAW (stage.ts verbatim): the spectate law + THE MESH CAP \u2014
    // the 9th eye is refused honestly, never a stuttering stage.
    const cap = stageEyeVerdict(s.viewers.size, true)
    if (!cap.ok) return ack?.({ ok: false, why: cap.why })
    s.viewers.add(eye)
    s.eyesSid.set(eye, socket.id)
    socket.join(stageRoom(s.id))
    pushViewers(io, s)
    // THE PUBLISHER OFFERS: the host learns the eye and starts the handshake
    const hp = presence.get(s.host)
    if (hp?.sid) io.to(hp.sid).emit('wire:stage', { type: 'eye', streamId: s.id, eye })
    ack?.({ ok: true, streamId: s.id, title: s.title, host: s.host, viewers: s.viewers.size })
  })"""
if OLD_WATCH not in src:
    print('FATAL: watch anchor')
    sys.exit(1)
src = src.replace(OLD_WATCH, NEW_WATCH)

# \u2500\u2500 4. stage:leave \u2014 the eye-gone truth rides to the host \u2500\u2500
OLD_LEAVE = """  socket.on('stage:leave', (raw: unknown, ack?: (r: unknown) => void) => {
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: true })
    const eye = identity.handle ?? `guest:${socket.id}`
    if (s.viewers.delete(eye)) {
      socket.leave(stageRoom(s.id))
      pushViewers(io, s)
    }
    ack?.({ ok: true })
  })"""
NEW_LEAVE = """  socket.on('stage:leave', (raw: unknown, ack?: (r: unknown) => void) => {
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: true })
    const eye = identity.handle ?? `guest:${socket.id}`
    if (s.viewers.delete(eye)) {
      s.eyesSid.delete(eye)
      socket.leave(stageRoom(s.id))
      pushViewers(io, s)
      const hp = presence.get(s.host)
      if (hp?.sid) io.to(hp.sid).emit('wire:stage', { type: 'eye-gone', streamId: s.id, eye })
    }
    ack?.({ ok: true })
  })

  /* \u2500\u2500 THE MESH RELAY \u2014 three doors, sealed envelopes only. THE ENVELOPE
   * LAWS are the W7 voice's own (sdpOk \u226416KB, iceOk the full candidate
   * envelope) run VERBATIM here. THE DIRECTION LAW: the offer flows from
   * the HOST alone; the answer and the ICE from a registered eye alone;
   * every envelope lands on its named peer \u2014 a stranger's envelope never
   * rides. \u2500\u2500 */
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
  })"""
if OLD_LEAVE not in src:
    print('FATAL: leave anchor')
    sys.exit(1)
src = src.replace(OLD_LEAVE, NEW_LEAVE)

# \u2500\u2500 5. the imports grow the eye law \u2500\u2500
src = src.replace(
    """import {
  stageVerdict,
  stageWatchVerdict,
  stageTipVerdict,
  stageEndOk,
  stageIdOk,
  stageRoom,
  stageChannel,
  stageTitleOk,
  STAGE_KIND,
  STAGE_TOKEN_TTL_S,
  type StageWhy,
} from '../../src/game/systems/stage'""",
    """import {
  stageVerdict,
  stageWatchVerdict,
  stageEyeVerdict,
  stageTipVerdict,
  stageEndOk,
  stageIdOk,
  stageRoom,
  stageChannel,
  stageTitleOk,
  STAGE_KIND,
  type StageWhy,
} from '../../src/game/systems/stage'""")

open(P, 'w', encoding='utf-8').write(src)
print('mesh pivot OK')
