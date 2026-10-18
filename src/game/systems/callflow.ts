/**
 * LOKOJA LIFE — M24-UI: THE CALL FLOW (pure laws, headless-safe)
 * ---------------------------------------------------------------
 * The state machine behind the Calls app: dialing → ringing → active →
 * ended, with the honest timeouts. PURE — no clock, no media, no DOM:
 * the caller supplies `now`, the same property that made live.ts
 * testable makes this testable.
 *
 * LAWS OF THIS FILE:
 *  - THE ONE-LINE LAW: a call is ONE peer, one direction, one phase.
 *    You cannot dial while dialing, answer while active, or hang up
 *    something that never started.
 *  - THE TIMEOUT LAW: a ring that nobody answers inside RING_TIMEOUT_MS
 *    ends honestly — 'no-answer' for outgoing, 'missed' for incoming.
 *    A phone that rings forever is a lying phone.
 *  - THE VIDEO FLAG: video is a wish carried on the call, not media.
 *    The camera wire lands with the W8 wave; the UI says so.
 *  - THE ENDED TRUTH: every ended call carries WHY (hangup / declined /
 *    missed / no-answer / busy / no-mic) — the recents list never
 *    invents one. 'no-mic' is LOCAL truth only: the wire carries the
 *    five shared whys; a refused microphone ends my call and tells the
 *    peer nothing but that it ended.
 */

export type CallPhase = 'idle' | 'dialing' | 'ringing' | 'active' | 'ended'
export type CallEndWhy = 'hangup' | 'declined' | 'missed' | 'no-answer' | 'busy' | 'no-mic'

export interface CallState {
  phase: CallPhase
  peer: string | null
  video: boolean
  muted: boolean
  /** true = I started it; false = my phone is ringing */
  outgoing: boolean
  startedAt: number | null
  endedAt: number | null
  endedWhy: CallEndWhy | null
}

/** THE TIMEOUT LAW: 30 seconds of ringing and the phone tells the truth. */
export const RING_TIMEOUT_MS = 30_000

export function freshCallState(): CallState {
  return { phase: 'idle', peer: null, video: false, muted: false, outgoing: false, startedAt: null, endedAt: null, endedWhy: null }
}

/** THE ONE-LINE LAW at the dial door: idle only, a real peer named. */
export function dialCall(s: CallState, peer: string, video: boolean, now: number): { ok: boolean; why?: 'not-idle' | 'no-peer' | 'self-call'; next: CallState } {
  if (s.phase !== 'idle') return { ok: false, why: 'not-idle', next: s }
  if (!peer) return { ok: false, why: 'no-peer', next: s }
  return { ok: true, next: { phase: 'dialing', peer, video, muted: false, outgoing: true, startedAt: null, endedAt: null, endedWhy: null } }
}

/** An incoming call lands on an idle phone — busy phones refuse honestly. */
export function receiveCall(s: CallState, peer: string, video: boolean, now: number): { ok: boolean; why?: 'busy' | 'no-peer'; next: CallState } {
  if (s.phase !== 'idle') return { ok: false, why: 'busy', next: s }
  if (!peer) return { ok: false, why: 'no-peer', next: s }
  return { ok: true, next: { phase: 'ringing', peer, video, muted: false, outgoing: false, startedAt: null, endedAt: null, endedWhy: null } }
}

/** ringing → active (both directions answer the same law). */
export function answerCall(s: CallState, now: number): { ok: boolean; next: CallState } {
  if (s.phase !== 'ringing' && s.phase !== 'dialing') return { ok: false, next: s }
  return { ok: true, next: { ...s, phase: 'active', startedAt: now } }
}

/** decline works on an incoming ring OR cancel on my own dialing. */
export function declineCall(s: CallState, now: number): { ok: boolean; next: CallState } {
  if (s.phase !== 'ringing' && s.phase !== 'dialing') return { ok: false, next: s }
  return { ok: true, next: { ...s, phase: 'ended', endedAt: now, endedWhy: 'declined' } }
}

/** hangup only ends something that was alive. */
export function hangupCall(s: CallState, now: number): { ok: boolean; next: CallState } {
  if (s.phase !== 'active') return { ok: false, next: s }
  return { ok: true, next: { ...s, phase: 'ended', endedAt: now, endedWhy: 'hangup' } }
}

/** THE TIMEOUT LAW — poll this on a tick; it never lies about a dead ring. */
export function ringExpired(s: CallState, now: number): { ok: boolean; next: CallState } {
  if (s.phase !== 'ringing' && s.phase !== 'dialing') return { ok: false, next: s }
  const ringStart = s.startedAt ?? now
  if (now - ringStart < RING_TIMEOUT_MS) return { ok: false, next: s }
  return { ok: true, next: { ...s, phase: 'ended', endedAt: now, endedWhy: s.outgoing ? 'no-answer' : 'missed' } }
}

/** W7 — an ended truth that arrives from OUTSIDE (the wire's why).
 *  The wire's shared whys map 1:1; 'no-mic' never crosses the wire. */
export function endCallWith(s: CallState, why: CallEndWhy, now: number): { ok: boolean; next: CallState } {
  if (s.phase === 'idle' || s.phase === 'ended') return { ok: false, next: s }
  return { ok: true, next: { ...s, phase: 'ended', endedAt: now, endedWhy: why } }
}

/** mark the ring clock (the store sets it when a call enters ringing/dialing) */
export function withRingClock(s: CallState, now: number): CallState {
  if (s.phase !== 'ringing' && s.phase !== 'dialing') return s
  return { ...s, startedAt: now }
}

/** seconds alive while active; 0 otherwise (the timer chip reads this) */
export function callSeconds(s: CallState, now: number): number {
  if (s.phase !== 'active' || s.startedAt === null) return 0
  return Math.max(0, Math.floor((now - s.startedAt) / 1000))
}

/** mute is a switch on an alive call only */
export function setMuted(s: CallState, muted: boolean): CallState {
  if (s.phase !== 'active') return s
  return { ...s, muted }
}
