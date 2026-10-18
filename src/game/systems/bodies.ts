/**
 * LOKOJA LIFE — M24 W2: THE BODIES LAW VAULT
 * ===========================================
 * The PURE laws of co-presence: real walkers as real bodies in the one
 * living city. Zero React, zero store, zero DOM — the same verdicts run
 * in the browser AND at the wire door (imported VERBATIM — zero copies,
 * zero drift, the W4-W8 doctrine).
 *
 * LAWS OF THIS FILE:
 *  - THE EPHEMERALITY LAW: a position is a MOMENT, not a record. pos
 *    ticks live in wire memory only — they are NEVER persisted to
 *    LiveEvent (the relay doctrine: distribute, never simulate; the
 *    nation's DB stays lean and no one's footsteps become history).
 *  - THE POS LAW: a pos payload is 4 finite numbers and a boolean —
 *    x/z inside the world bound, heading any finite angle, mv the
 *    movement truth. Anything else refuses (bad-pos) before it ever
 *    touches a neighbour's screen.
 *  - THE SPEED LAW: a human walks ≤ SPRINT_SPEED u/s (the controls'
 *    own law, mirrored as a clamp — a teleporting body is a lying
 *    body; the renderer clamps the interpolated speed, the wire does
 *    not police it beyond plausibility).
 *  - THE INTERPOLATION LAW: a remote body is TWO snaps and a render
 *    clock — the body stands INTERP_DELAY_MS behind the newest snap
 *    and lerps between the pair (never snaps, never extrapolates past
 *    MAX_EXTRAP_MS — a lost packet freezes a body mid-stride instead
 *    of gliding it into a wall it never walked to).
 *  - THE STALE LAW: a body whose snaps stopped STALE_MS ago is GONE —
 *    the walker closed the tab, the wire swept the presence, the body
 *    must not keep standing there like a ghost.
 *  - THE RANGE LAW: a body farther than RENDER_RANGE from MY body is
 *    culled from rendering (the street can hold many walkers; the
 *    frame budget holds few) — pure distance, recomputed per frame.
 *  - THE BLOCK WALL FOR BODIES (the M17 law walks in space): if
 *    either side blocked the other, the wire relays NO pos between
 *    them and the body does not render — a block is a wall you can
 *    see, not just a quiet thread.
 *  - THE GUEST DARKNESS LAW: a guest broadcasts NO pos (no identity,
 *    no body-broadcast; the door refuses guest-mic-dark, the M17
 *    spectate law rides unchanged — guests may WATCH claimed walkers,
 *    claimed walkers never render a guest).
 *  - THE LOOK LAW: a body wears the REAL avatarLook the register law
 *    minted (systems/profile.ts validateAvatarLook — the vocab from
 *    data/avatar.ts). An invented colour or style never renders.
 */

import { validateAvatarLook, type AvatarLook } from './profile'

/* ─────────────────────────── constants (the cadence law) ─────────────────────── */

/** broadcast cadence while MOVING — the plan's 10Hz AOI law */
export const POS_HZ = 10
export const POS_TICK_MS = Math.round(1000 / POS_HZ)
/** the still heartbeat — an idle body whispers 1×/3s, the wire stays thin (N5) */
export const IDLE_POS_MS = 3_000
/** a body whose snaps stopped this long ago has LEFT (the wire TTL sweeps at 90s
 *  but a dropped socket is known in seconds — the body must not ghost) */
export const STALE_MS = 5_000
/** how far behind the newest snap the render clock stands */
export const INTERP_DELAY_MS = 120
/** never glide past the newest snap by more than this (packet-loss honesty) */
export const MAX_EXTRAP_MS = 250
/** the render range — a body beyond this distance from MY body is culled */
export const RENDER_RANGE = 60
/** the world bound — Lokoja's buildable earth (resolvePosition clamps the
 *  walker client-side; the door refuses anything past the bound) */
export const WORLD_BOUND = 330
/** the human speed ceiling (controls MOVE.sprintSpeed = 7.4 u/s + drift headroom) */
export const SPEED_MAX = 8

/* ─────────────────────────────── the pos laws ──────────────────────────────── */

export interface PosPayload {
  x: number
  z: number
  hd: number
  mv: boolean
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

/** THE POS LAW — 4 finite fields inside the world bound, or refuse. */
export function posOk(raw: unknown): raw is PosPayload {
  const b = raw as Partial<PosPayload>
  if (!b || typeof b !== 'object') return false
  if (!isNum(b.x) || !isNum(b.z) || !isNum(b.hd)) return false
  if (typeof b.mv !== 'boolean') return false
  if (Math.abs(b.x) > WORLD_BOUND || Math.abs(b.z) > WORLD_BOUND) return false
  return true
}

/** should this tick leave the building? (moved-enough law: the sender's
 *  honest threshold — position, heading, or the idle heartbeat) */
export function posWorthSending(
  prev: PosPayload | null,
  next: PosPayload,
  sinceLastSendMs: number,
): boolean {
  if (!prev) return true
  if (sinceLastSendMs >= IDLE_POS_MS) return true // the still heartbeat
  const d = Math.hypot(next.x - prev.x, next.z - prev.z)
  if (d >= 0.05) return true
  let dh = Math.abs(next.hd - prev.hd) % (Math.PI * 2)
  if (dh > Math.PI) dh = Math.PI * 2 - dh
  return dh >= 0.06
}

/* ─────────────────────────────── the block wall ─────────────────────────────── */

/**
 * THE BLOCK WALL FOR BODIES — the pure verdict the wire relay runs per
 * recipient: a blocked pair shares NO positions, in either direction.
 * (friendState: the SocialEdge.state of MY row toward THEM / theirs toward ME.)
 */
export function bodyRelayOk(blockedEitherWay: boolean): boolean {
  return !blockedEitherWay
}

/** THE JOIN WALL — who may teleport to whom (the `where` door's law):
 *  - blocked either way: never;
 *  - a minor joins ACCEPTED PADDIES only (the M13 kid wall, dmVerdict's law);
 *  - an adult joins any walker standing in the world. */
export function joinVerdict(input: {
  myBand: 'guest' | 'kid' | 'teen' | 'adult'
  blockedEitherWay: boolean
  edgeStateMine: string | null
  edgeStateTheirs: string | null
  targetPresent: boolean
  self: boolean
}): { ok: boolean; why?: string } {
  if (input.myBand === 'guest') return { ok: false, why: 'guest-mic-dark' }
  if (input.self) return { ok: false, why: 'self' }
  if (!input.targetPresent) return { ok: false, why: 'not-around' }
  if (input.blockedEitherWay) return { ok: false, why: 'blocked' }
  if (input.myBand === 'kid' || input.myBand === 'teen') {
    const friend = input.edgeStateMine === 'friend' || input.edgeStateTheirs === 'friend'
    if (!friend) return { ok: false, why: 'paddies-only' }
  }
  return { ok: true }
}

/* ─────────────────────────────── the look law ─────────────────────────────── */

/** the REAL look the body wears — the register law's own validator decides */
export function bodyLook(raw: unknown): AvatarLook | null {
  const v = validateAvatarLook(raw)
  return v.ok && v.look ? v.look : null
}

/* ─────────────────────────── the interpolation buffer ─────────────────────────── */

export interface PosSnap {
  t: number
  x: number
  z: number
  hd: number
  mv: boolean
}

export interface BodySample {
  x: number
  z: number
  hd: number
  /** u/s measured between the two newest snaps, clamped by THE SPEED LAW */
  speed: number
  alive: boolean
}

const TAU = Math.PI * 2

/** shortest signed angular distance a→b (-π..π) */
export function angleLerp(a: number, b: number, k: number): number {
  let d = (b - a) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return a + d * k
}

/**
 * THE INTERPOLATION BUFFER — two snaps and a render clock. Pure: push()
 * in from the wire, sample() in the frame loop, zero allocation per frame.
 */
export class InterpBuffer {
  private a: PosSnap | null = null // the older snap
  private b: PosSnap | null = null // the newer snap

  push(s: PosSnap): void {
    if (!this.b) {
      this.b = { ...s }
      return
    }
    if (s.t <= this.b.t) return // a late packet never rewinds the clock
    this.a = this.b
    this.b = { ...s }
  }

  /** the newest snap's clock (the wire's truth of "when did they last speak") */
  lastT(): number {
    return this.b ? this.b.t : 0
  }

  /** THE STALE LAW: no snaps for STALE_MS → the body has left. */
  stale(now: number): boolean {
    return !!this.b && now - this.b.t > STALE_MS
  }

  /** seed a fresh buffer with ONE snap so the body stands before it walks */
  seed(s: PosSnap): void {
    if (!this.b || s.t >= this.b.t) {
      this.a = this.b
      this.b = { ...s }
    }
  }

  private readonly out: BodySample = { x: 0, z: 0, hd: 0, speed: 0, alive: false }

  /**
   * THE SAMPLE LAW: render time = newest.t − INTERP_DELAY_MS, clamped to
   * never run past newest + MAX_EXTRAP_MS; speed measured between snaps,
   * clamped by THE SPEED LAW. Writes the shared scratch — zero alloc.
   */
  sample(now: number): BodySample {
    const o = this.out
    if (!this.b) {
      o.alive = false
      return o
    }
    if (now - this.b.t > STALE_MS) {
      o.alive = false
      return o
    }
    // the render clock stands INTERP_DELAY behind the newest snap
    const rt = Math.min(now - INTERP_DELAY_MS, this.b.t + MAX_EXTRAP_MS)
    if (!this.a || rt >= this.b.t) {
      o.x = this.b.x
      o.z = this.b.z
      o.hd = this.b.hd
      o.speed = 0
      o.alive = true
      return o
    }
    const span = Math.max(1, this.b.t - this.a.t)
    const k = Math.min(1, Math.max(0, (rt - this.a.t) / span))
    o.x = this.a.x + (this.b.x - this.a.x) * k
    o.z = this.a.z + (this.b.z - this.a.z) * k
    o.hd = angleLerp(this.a.hd, this.b.hd, k)
    const d = Math.hypot(this.b.x - this.a.x, this.b.z - this.a.z)
    o.speed = Math.min(SPEED_MAX, (d / span) * 1000)
    o.alive = true
    return o
  }
}

/* ─────────────────────────────── the range law ─────────────────────────────── */

/** THE RANGE LAW — squared compare, no sqrt in the frame loop. */
export function inRenderRange(ax: number, az: number, bx: number, bz: number): boolean {
  const dx = ax - bx
  const dz = az - bz
  return dx * dx + dz * dz <= RENDER_RANGE * RENDER_RANGE
}

/** how far did the walker travel since the last snap (the sender's helper) */
export function distMoved(ax: number, az: number, bx: number, bz: number): number {
  return Math.hypot(ax - bx, az - bz)
}
