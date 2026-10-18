/**
 * LOKOJA LIFE — M24 W7: THE VOICE LAWS (pure, headless-safe)
 * ===========================================================
 * The pure law vault for the nation's voice. The wire service imports
 * these VERBATIM (the W4 doctrine: zero copies, zero drift) and the
 * client engine (voicenet.ts) rides the same shapes.
 *
 * TWO VOICES, TWO LAWS:
 *  - THE DIALED CALL (phone → phone): THE DIAL LAW — adults only on BOTH
 *    ends (a minor never carries voice, structurally — the M13 doctrine),
 *    both walkers claimed, no block edge either way, never yourself,
 *    nobody busy. ANSWER IS THE OPT-IN: a dialed call rings a real
 *    phone; the human thumb that taps Answer IS the consent. The M17
 *    same-street clause does NOT bind a phone call — a phone crosses
 *    the nation by design.
 *  - THE PROXIMITY VOICE (street walkie): THE M17 VOICE LAW VERBATIM —
 *    voiceAllowed(identity, voiceOn, myStreet, theirStreet): adults,
 *    opt-in, same street. No ring, no dial — the street carries it.
 *
 * THE RELAY DOCTRINE (carried): the server DISTRIBUTES signaling, never
 * simulates media. SDP and ICE are sealed envelopes — the wire checks
 * the seal (shape + size), never opens them.
 *
 * LAWS OF THIS FILE:
 *  - THE ENVELOPE LAWS: an SDP offer/answer is a string that LOOKS like
 *    SDP (v=0) and stays under SDP_MAX bytes; an ICE candidate is a
 *    short JSON envelope under ICE_MAX. The wire stays thin (N5) —
 *    media never rides it.
 *  - THE ONE-CALL LAW: one ALIVE call per person. A busy phone refuses
 *    honestly — the verdict says busy, not silence.
 *  - THE CHANNEL LAW: a call's LiveEvent rows live on call:<a|b> with
 *    the SORTED pair — the same shape the DM channels use — so the
 *    privacy filters (wire resume + the 12s sync) can show each row to
 *    its two parties ALONE.
 *  - THE END TRUTH: a call ends with one of the honest whys. The wire
 *    refuses an unknown why — the ended card never invents a lie.
 *  - THE MESH LAW: the proximity voice mesh is capped (PV_MESH_MAX) —
 *    a browser builds ≤4 peer connections for street voice, the heat
 *    and battery honesty of the plan.
 *
 * W8 — THE CAMERA LAWS:
 *  - THE CAMERA STATE LAW: a camera is a SIGNALING truth, not media on
 *    the wire. The 'cam' envelope carries { callId, on } and the wire
 *    relays it to the OTHER EAR ALONE (the same privacy eye that shows
 *    a ring to its two parties). The wire never sees a picture frame.
 *  - THE FACE LAW: video is negotiated AT THE RING — the offer that
 *    carries a video m-line was born from a video dial; a call born
 *    audio stays audio until redial (no renegotiation, structurally).
 *    A mid-call camera toggle mutes the PICTURE (track.enabled), it
 *    never re-opens the negotiation.
 *  - THE CAMERA FALLBACK LAW: a camera that refuses (permission, no
 *    device, low tier) NEVER kills the call — a voice call is the
 *    floor. The refusing ear says so on the cam lane; the other ear
 *    shows an honest chip, never a black lie.
 *  - THE STREAM-SURVIVAL LAW: an 'on:true' cam push never evicts the
 *    picture it announces (the push can land after the track event —
 *    the socket's order is honest but the track is the media); only an
 *    'on:false' drops the frame. The face shows the picture, the chip
 *    shows the truth — neither clobbers the other.
 */

import type { LiveBand } from './live'

/* ─────────────────────────────── shapes ─────────────────────────────── */

export type VoiceCallWhy = 'hangup' | 'declined' | 'missed' | 'no-answer' | 'busy'

export const CALL_WHYS: readonly VoiceCallWhy[] = ['hangup', 'declined', 'missed', 'no-answer', 'busy']

/** THE END TRUTH at the door: only the honest whys cross the wire. */
export function endWhyOk(why: unknown): why is VoiceCallWhy {
  return typeof why === 'string' && (CALL_WHYS as readonly string[]).includes(why)
}

export const CALL_ID_RE = /^c:[a-z0-9]{10,32}$/

export function callIdOk(id: unknown): id is string {
  return typeof id === 'string' && CALL_ID_RE.test(id)
}

/** THE CHANNEL LAW — sorted pair, the DM shape with the call prefix. */
export function callChannel(a: string, b: string): string {
  return `call:${[a, b].sort().join('|')}`
}

/** THE PRIVACY LAW's eye: does this call: channel belong to `handle`? */
export function callChannelInvolves(channel: string, handle: string): boolean {
  if (!channel.startsWith('call:')) return false
  const pair = channel.slice(5).split('|')
  return pair.length === 2 && pair.includes(handle)
}

/* ─────────────────────────── the envelope laws ─────────────────────────── */

/** SDP stays under this (a generous audio offer/answer is ~2–6KB). */
export const SDP_MAX = 16_000
/** One ICE candidate envelope stays under this. */
export const ICE_MAX = 1_000

/** THE SDP ENVELOPE LAW: looks like SDP (v=0 first line), under the cap. */
export function sdpOk(sdp: unknown): sdp is string {
  if (typeof sdp !== 'string' || sdp.length === 0 || sdp.length > SDP_MAX) return false
  return sdp.startsWith('v=0')
}

/** THE ICE ENVELOPE — the FULL candidate as WebRTC gave it: the string
 *  PLUS the media-section coordinates. Chromium refuses a candidate
 *  with BOTH sdpMid and sdpMLineIndex missing — the envelope relays
 *  them verbatim (learned by the witness, pinned by the law). */
export interface IceEnvelope {
  candidate: string
  sdpMid?: string
  sdpMLineIndex?: number
}

/** THE ICE ENVELOPE LAW: a small object with a candidate string and,
 *  when present, honest media-section coordinates. */
export function iceOk(c: unknown): c is IceEnvelope {
  if (!c || typeof c !== 'object') return false
  const q = c as Record<string, unknown>
  if (typeof q.candidate !== 'string' || q.candidate.length === 0 || q.candidate.length > ICE_MAX) return false
  if (q.sdpMid !== undefined && (typeof q.sdpMid !== 'string' || q.sdpMid.length > 8)) return false
  if (q.sdpMLineIndex !== undefined && (typeof q.sdpMLineIndex !== 'number' || !Number.isInteger(q.sdpMLineIndex) || q.sdpMLineIndex < 0 || q.sdpMLineIndex > 9)) return false
  return true
}

/* ─────────────────────────── the dial law ─────────────────────────── */

export interface DialCtx {
  /** the CALLER's band (server truth from the Account row) */
  callerBand: LiveBand
  /** the TARGET's band (server truth), or null when no such account */
  targetBand: LiveBand | null
  /** does the target have an account at all (the ghost law) */
  targetExists: boolean
  /** is the target's phone ON the wire right now */
  targetOnline: boolean
  /** target already holds an ALIVE call (the one-call law) */
  targetBusy: boolean
  /** the caller already holds an ALIVE call */
  callerBusy: boolean
  /** a block edge in EITHER direction (W5's FriendRow truth) */
  blockedEitherWay: boolean
  self: boolean
}

export type DialVerdict =
  | { ok: true }
  | { ok: false; why: 'guest-mic-dark' | 'minors-no-voice' | 'no-such-paddy' | 'offline' | 'busy' | 'blocked' | 'self-call' }

/** THE DIAL LAW — computed at the SERVER door, once, before any ring. */
export function dialVerdict(ctx: DialCtx): DialVerdict {
  if (ctx.self) return { ok: false, why: 'self-call' }
  if (ctx.callerBand === 'guest') return { ok: false, why: 'guest-mic-dark' }
  // THE MINOR WALL: a minor never places, and never receives, a voice call.
  if (ctx.callerBand === 'kid' || ctx.callerBand === 'teen') return { ok: false, why: 'minors-no-voice' }
  if (ctx.targetBand === 'kid' || ctx.targetBand === 'teen') return { ok: false, why: 'minors-no-voice' }
  if (!ctx.targetExists || !ctx.targetBand) return { ok: false, why: 'no-such-paddy' }
  if (ctx.blockedEitherWay) return { ok: false, why: 'blocked' }
  if (!ctx.targetOnline) return { ok: false, why: 'offline' }
  if (ctx.targetBusy || ctx.callerBusy) return { ok: false, why: 'busy' }
  return { ok: true }
}

/* ─────────────────────────── the proximity law ─────────────────────────── */

/** THE MESH LAW: ≤4 peer connections for street voice (heat/battery honesty). */
export const PV_MESH_MAX = 4

export interface PvPeer {
  handle: string
  band: LiveBand
  street: string
  voiceOn: boolean
}

/**
 * THE PROXIMITY ADMISSION LAW — the M17 voiceAllowed doctrine made a list:
 * same street, adults, opt-in. The caller's own row is excluded by the
 * door; the mesh cap trims the tail (sorted for determinism — the SAME
 * cap must bite the SAME way on every device).
 */
export function pvPeers(myHandle: string, myStreet: string, roster: PvPeer[]): string[] {
  return roster
    .filter((p) => p.handle !== myHandle && p.street === myStreet && p.band === 'adult' && p.voiceOn)
    .map((p) => p.handle)
    .sort()
    .slice(0, PV_MESH_MAX)
}

/** Can `from` relay proximity signaling to `to`? (the pv door's gate) */
export function pvRelayOk(from: PvPeer | null, to: PvPeer | null): boolean {
  if (!from || !to) return false
  return from.band === 'adult' && from.voiceOn && to.band === 'adult' && to.voiceOn && from.street === to.street
}

/* ─────────────────────────── the wire call push ─────────────────────────── */

/** The envelope the wire pushes on `wire:call` — every type, one shape. */
export type WireCallPush =
  | { type: 'ring'; callId: string; from: string; video: boolean }
  | { type: 'accepted'; callId: string }
  | { type: 'offer'; callId: string; sdp: string }
  | { type: 'answer'; callId: string; sdp: string }
  | { type: 'ice'; callId: string; candidate: { candidate: string } }
  | { type: 'cam'; callId: string; on: boolean }
  | { type: 'ended'; callId: string; why: VoiceCallWhy }

export function wireCallPushOk(p: unknown): p is WireCallPush {
  if (!p || typeof p !== 'object') return false
  const q = p as Record<string, unknown>
  if (!callIdOk(q.callId)) return false
  switch (q.type) {
    case 'ring':
      return typeof q.from === 'string' && typeof q.video === 'boolean'
    case 'accepted':
      return true
    case 'offer':
    case 'answer':
      return sdpOk(q.sdp)
    case 'ice':
      return iceOk(q.candidate)
    case 'cam':
      return typeof q.on === 'boolean'
    case 'ended':
      return endWhyOk(q.why)
    default:
      return false
  }
}

/** The push the wire emits on `wire:voice` (proximity lane). */
export type WireVoicePush =
  | { type: 'joined'; handle: string; street: string }
  | { type: 'left'; handle: string; street: string }
