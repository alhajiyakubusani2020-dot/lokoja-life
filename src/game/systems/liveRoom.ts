/**
 * LOKOJA LIFE — M21: THE LIVING ROOM (room helpers on top of live.ts)
 * -------------------------------------------------------------------
 * Pure helpers for the ROOM the walker is physically standing in.
 * This file sits ON TOP of systems/live.ts (it never edits the laws,
 * it composes them) and holds the honesty build's prime law:
 *
 *  - THE PRIME LAW — HONESTY: a room's people count comes ONLY from
 *    real presence rows. The NPC crowd is a SEPARATE number that may
 *    only ever cross into UI through crowdNote(), which labels it
 *    "(sim)" every single time. No invented handles, no bot messages,
 *    no fake online counters.
 *  - THE ROOM KEY LAW: a room is keyed by the SAME string the world
 *    calls the player's current location id — liveSync already pings
 *    `street: world.currentLocation`, so roomRoster matches exactly
 *    the co-located (their last ping said this street) walkers.
 *  - THE TTL LAW (inherited): presenceAlive + PRESENCE_TTL_MS decide
 *    who is in the room — a stale ping is an absent neighbor. Roster
 *    order is the presenceRoster order (handle sort), filtered.
 *  - THE SPRAY LAW: spraying real naira is an ADULT money-table move
 *    (band === 'adult', structurally false for minors regardless of
 *    pocket), bounded ₦100–₦5,000 in ₦100 notes, and the broadcast it
 *    mints is a valid LiveEvent on the room's street channel — the
 *    same relay shapes, no new event kind invented.
 *
 * Everything here is deterministic and side-effect-free: no clock, no
 * store, no fetch — the caller always supplies `now`, the day and the
 * identity, exactly like live.ts.
 */

import {
  presenceAlive,
  presenceRoster,
  validateEvent,
  type LiveBand,
  type LiveEvent,
  type LiveIdentity,
  type LivePresence,
  type PresenceStatus,
} from './live'

/* ------------------------------ the room key ------------------------------- */

/** The room channel for a street: the same `street:<id>` shape live.ts's
 *  validateEvent already accepts, keyed by the location id the world
 *  and the presence ping both carry. */
export function roomChannel(street: string): string {
  return `street:${street}`
}

/* -------------------------------- the roster -------------------------------- */

/**
 * THE ROOM ROSTER: everyone whose last ping (inside the 90s TTL) says
 * they are on THIS street. Delegates the alive-filter and the sort to
 * presenceRoster so the room can never disagree with the nation
 * roster's ordering law (handle.localeCompare, deterministic).
 */
export function roomRoster(all: LivePresence[], street: string, now: number): LivePresence[] {
  return presenceRoster(all, now).filter((p) => p.street === street)
}

/**
 * THE HONEST COUNT: how many REAL presence rows are alive on this
 * street right now. It counts rows — nothing else. The sim crowd is a
 * different number from a different world and can never enter here.
 * (The caller's own row counts too — the wire carries it — so a count
 * of 1 means "just you".)
 */
export function playerCountIn(presences: LivePresence[], street: string, now: number): number {
  return presences.filter((p) => p.street === street && presenceAlive(p, now)).length
}

/* ------------------------------- the sim note ------------------------------- */

/**
 * THE ONLY sanctioned way UI may show the NPC crowd: a clearly labeled
 * simulated-souls line. Always "(sim)", always the honest number — a
 * missing/NaN district clamps to 0 rather than inventing a crowd.
 */
export function crowdNote(simCrowd: number): string {
  const n = Number.isFinite(simCrowd) ? Math.max(0, Math.round(simCrowd)) : 0
  return `~${n.toLocaleString('en-US')} souls on this street (sim)`
}

/* --------------------------------- the spray -------------------------------- */

export const SPRAY_MIN = 100
export const SPRAY_MAX = 5_000
/** notes come in hundreds — a spray is a multiple of ₦100 */
export const SPRAY_STEP = 100

export type SprayRefusal = 'bad-amount' | 'not-multiple' | 'bad-street'

export type SprayVerdict =
  | { ok: true; event: LiveEvent; text: string; channel: string }
  | { ok: false; why: SprayRefusal }

/**
 * THE SPRAY GATE (pure): spraying moves real money, so it rides the
 * AGE_LAW the same way every other money table does — adults only.
 * A kid (or teen, or guest) is refused REGARDLESS of cash; an adult
 * still needs the pocket to reach the smallest note.
 */
export function sprayAllowed(identity: LiveIdentity, cash: number): boolean {
  if (identity.band !== 'adult') return false
  return Number.isFinite(cash) && cash >= SPRAY_MIN
}

/**
 * THE SPRAY BROADCAST: mints the money-spray moment as a valid
 * LiveEvent — kind 'chat' on the room's street channel (no new event
 * kind is invented; the relay's existing laws carry it). Refuses
 * out-of-bounds amounts and non-multiples of ₦100 outright, and
 * refuses to emit anything validateEvent would reject.
 */
export function sprayEvent(handle: string, street: string, amount: number, day: number): SprayVerdict {
  if (!Number.isFinite(amount) || amount < SPRAY_MIN || amount > SPRAY_MAX) return { ok: false, why: 'bad-amount' }
  if (amount % SPRAY_STEP !== 0) return { ok: false, why: 'not-multiple' }
  const naira = amount.toLocaleString('en-US')
  const text = `💰 ${handle} spray ₦${naira} — money dey fly for ${street}! (day ${day})`
  const event: LiveEvent = {
    id: `spray:${handle}:${street}:${day}:${amount}`,
    kind: 'chat',
    channel: roomChannel(street),
    actor: handle,
    payload: { text, spray: amount, day },
  }
  // honest by construction: the builder never emits a shape the relay would refuse
  if (!validateEvent(event).ok) return { ok: false, why: 'bad-street' }
  return { ok: true, event, text, channel: event.channel }
}

/* ------------------------------ wire row bridge ----------------------------- */

/**
 * The relay's roster row as the wire actually carries it (with the
 * heartbeat timestamp). The store's slice type predates `ts`, so UI
 * bridges rows through this shape; a row without ts counts from the
 * moment it arrived (the server already TTL-filtered it at sync time).
 */
export interface WirePresenceRow {
  handle: string
  band: string
  street: string
  status: string
  ts?: number
}

/** Bridge a wire roster into live.ts's LivePresence shape (pure). */
export function wireToPresences(rows: readonly WirePresenceRow[], now: number): LivePresence[] {
  return rows.map((r) => ({
    handle: r.handle,
    street: r.street,
    status: (r.status as PresenceStatus) ?? 'chilling',
    band: (r.band as LiveBand) ?? 'adult',
    ts: typeof r.ts === 'number' ? r.ts : now,
  }))
}
