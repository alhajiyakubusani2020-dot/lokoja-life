/**
 * LOKOJA LIFE — M24 W2: THE REMOTE NET (the bodies' client engine)
 * ================================================================
 * The client home of co-presence: every claimed same-street walker
 * becomes a REAL body the renderer can stand in the city. Zero React
 * churn — the per-frame truth lives in a module map the 3D layer reads
 * inside useFrame; the store only mirrors the ROSTER cadence (who is
 * here, what do they wear), which changes rarely.
 *
 * LAWS OF THIS FILE:
 *  - THE IMPORTED-LAW DOCTRINE: the buffer, the cadence, the staleness,
 *    the range — ALL of it comes from systems/bodies.ts VERBATIM. This
 *    file only WIRING: wire pushes in, ticks out, samples to the frame.
 *  - THE SEED LAW: the roster push carries the body (look + name + the
 *    last moment) — a walker seen for the first time STANDS where the
 *    wire says before their first pos tick ever arrives.
 *  - THE SENDER LAW: my body speaks only when I am IN the world
 *    (start/stop bracket the 3D mount), only when claimed (a guest
 *    broadcasts nothing — the darkness law), only when the wire lives.
 *    While moving: the 10Hz cadence; while still: the 1×/3s heartbeat.
 *  - THE SELF-ECHO LAW: the relay never sends my own pos back to me —
 *    but a defensive client drops it anyway (h==my handle → ignore).
 *  - THE JOIN LAW: remoteJoin(handle) asks the where door, teleports my
 *    body beside my paddy (the walker's own teleport seam) and follows
 *    their street with my presence. A guest join refuses at the door.
 *  - THE WITNESS LAW: __lklBodies exposes the honest counters (sent,
 *    received, the body list) so the E2E witness reads REALITY, not UI.
 */

import { create } from 'zustand'
import { InterpBuffer, POS_TICK_MS, posWorthSending, bodyLook, type PosPayload } from './bodies'
import { wheelIsDriving, wheelIsRiding } from './wheelnet'
import { wireOnPos, wireSendPos, wireWhere, wireSetStreet, wireEnsure, useWireStore, type WireRosterRow } from './wire'
import { useGameStore } from '../store/useGameStore'

export interface RemoteBody {
  handle: string
  name: string
  band: string
  street: string
  /** the look is ALWAYS a validated real vocab object (bodyLook guards) */
  look: { skinTone: string; hairColor: string; hairstyle: string; clothingStyle: string; clothingColor: string } | null
  buf: InterpBuffer
  /** the tick I last heard from this body (any lane) */
  lastHeard: number
}

/* ───────────────────────── the module truth (per-frame) ───────────────────────── */

const bodies = new Map<string, RemoteBody>()

export function remoteBody(handle: string): RemoteBody | null {
  return bodies.get(handle) ?? null
}

export function remoteBodyCount(): number {
  return bodies.size
}

export function remoteBodyList(): RemoteBody[] {
  return [...bodies.values()]
}

/* ─────────────────────── the roster-cadence store (UI only) ─────────────────────── */

interface BodiesState {
  /** how many walkers stand beside me on this street */
  count: number
  /** display names of the bodies (roster cadence — never per-frame) */
  names: string[]
}

export const useBodiesStore = create<BodiesState>(() => ({
  count: 0,
  names: [],
}))

function mirrorStore() {
  const list = [...bodies.values()]
  useBodiesStore.setState({ count: list.length, names: list.map((b) => b.name || b.handle) })
}

/* ───────────────────────────── the seed + the lanes ───────────────────────────── */

let myHandle: string | null = null

function seedFromRoster(rows: WireRosterRow[]): void {
  const seen = new Set<string>()
  for (const r of rows) {
    if (!r || typeof r.handle !== 'string') continue
    seen.add(r.handle)
    if (myHandle && r.handle === myHandle) continue // my own body is MY business
    const look = r.look ? bodyLook(r.look) : null
    let b = bodies.get(r.handle)
    if (!b) {
      b = { handle: r.handle, name: r.displayName || r.handle, band: r.band ?? 'adult', street: r.street ?? 'home', look, buf: new InterpBuffer(), lastHeard: Date.now() }
      bodies.set(r.handle, b)
    } else {
      b.name = r.displayName || b.name
      b.band = r.band || b.band
      b.street = r.street || b.street
      if (look) b.look = look
    }
    // THE SEED LAW: the roster's moment stands the body before the first tick
    if (typeof r.x === 'number' && typeof r.z === 'number' && Number.isFinite(r.x) && Number.isFinite(r.z)) {
      b.buf.seed({ t: Date.now(), x: r.x, z: r.z, hd: typeof r.hd === 'number' ? r.hd : 0, mv: r.mv === true })
    }
  }
  // THE SWEEP LAW: a roster row that vanished is a body that left
  for (const h of [...bodies.keys()]) {
    if (!seen.has(h)) bodies.delete(h)
  }
  mirrorStore()
}

let netInited = false

/** THE ONE DOOR IN — idempotent; call from any face effect. */
export function remoteNetInit(): void {
  if (netInited || typeof window === 'undefined') return
  netInited = true

  // the pos lane: deltas into the buffer (unknown handles wait for the roster)
  wireOnPos((p) => {
    counters.recv++
    if (myHandle && p.h === myHandle) return // THE SELF-ECHO LAW (defensive)
    const b = bodies.get(p.h)
    if (!b) return
    b.buf.push({ t: Date.now(), x: p.x, z: p.z, hd: p.hd, mv: p.mv })
    b.lastHeard = Date.now()
  })

  // the roster lane: the wire store is the ONE roster truth — mirror it
  let lastRoster: WireRosterRow[] | null = null
  useWireStore.subscribe((s) => {
    if (s.roster !== lastRoster) {
      lastRoster = s.roster
      seedFromRoster(s.roster)
    }
  })
}

/* ──────────────────────────────── the sender ──────────────────────────────── */

const counters = { sent: 0, recv: 0, refused: 0 }

let sendTimer: ReturnType<typeof setInterval> | null = null
let lastSent: PosPayload | null = null
let lastSentAt = 0
let prevRead: { x: number; z: number } | null = null

/** bracket the 3D mount: my body speaks only while I stand in the world */
export function remoteStartSending(): void {
  remoteNetInit()
  myHandle = useGameStore.getState().account.handle ?? null
  // THE WORLD-ENTRY LAW: standing in the world ENSURES the wire — co-presence
  // never depends on which phone face happened to open (the faces keep their
  // own ensures; this one is idempotent like them all)
  wireEnsure(
    () => useGameStore.getState().account.token ?? null,
    () => ({ street: useGameStore.getState().world?.currentLocation ?? 'home', status: 'hustling' }),
  )
  if (sendTimer || typeof window === 'undefined') return
  lastSent = null
  lastSentAt = 0
  prevRead = null
  sendTimer = setInterval(() => {
    if (sendTimer === null) return // stopped mid-flight (defensive)
    const { token } = useGameStore.getState().account
    const w = useWireStore.getState().state
    if (!token || w !== 'live') return // THE SENDER LAW: claimed + live only
    // controls' own truth — the walker reports it every frame
    const c = playerPosRef()
    if (!c) return
    // W10/W10-b — THE CARRIED COORDINATION: my wheels are live on the wire
    // (or I ride in somebody's), so my body lane is silent — the walker is
    // IN a car (the wire's pos door refuses 'carried' as the backstop; this
    // pause is the politeness)
    if (wheelIsDriving() || wheelIsRiding()) return
    // THE MOVEMENT TRUTH: measured between MY OWN reads (0.02u ≈ 2cm —
    // a still body stays still; a walking body says mv)
    const mv = !!prevRead && Math.hypot(c.x - prevRead.x, c.z - prevRead.z) > 0.02
    prevRead = { x: c.x, z: c.z }
    const now = Date.now()
    const next: PosPayload = { x: c.x, z: c.z, hd: c.hd, mv }
    if (!posWorthSending(lastSent, next, now - lastSentAt)) return
    wireSendPos(next)
    counters.sent++
    lastSent = next
    lastSentAt = now
  }, POS_TICK_MS)
}

export function remoteStopSending(): void {
  if (sendTimer) clearInterval(sendTimer)
  sendTimer = null
  lastSent = null
  prevRead = null
}

/** the local player's moment — the 3D layer registers the walker's own
 *  truth (playerPos); mv is DERIVED here from my own reads, never guessed */
let posReader: (() => { x: number; z: number; hd: number } | null) | null = null

export function setPosReader(fn: () => { x: number; z: number; hd: number } | null): void {
  posReader = fn
}

function playerPosRef(): { x: number; z: number; hd: number } | null {
  if (posReader) return posReader()
  return null
}

/* ──────────────────────────────── the join law ──────────────────────────────── */

export type RemoteJoinResult = { ok: boolean; why?: string; street?: string; displayName?: string }

/** the teleport executor — the 3D layer registers the walker seam once
 *  (a system never imports from components; the component brings it) */
let joinExecutor: ((x: number, z: number) => void) | null = null

export function setJoinExecutor(fn: (x: number, z: number) => void): void {
  joinExecutor = fn
}

/**
 * THE JOIN — where does my paddy stand? Teleport my body there and follow
 * their street. The M13/block walls live at the DOOR (bodies.ts joinVerdict);
 * this side only executes a lawful answer.
 */
export async function remoteJoin(handle: string): Promise<RemoteJoinResult> {
  const res = await wireWhere(handle)
  if (!res.ok) return { ok: false, why: res.why ?? 'wire-down' }
  const x = typeof res.x === 'number' ? res.x : 0
  const z = typeof res.z === 'number' ? res.z : 0
  const street = typeof res.street === 'string' ? res.street : 'home'
  if (joinExecutor) joinExecutor(x, z)
  wireSetStreet(street)
  return { ok: true, street, displayName: typeof res.displayName === 'string' ? res.displayName : undefined }
}

/* ──────────────────────────────── the witness ──────────────────────────────── */

/** the E2E witness — REALITY, not UI: the bodies the net truly holds */
export function bodiesWitness(): {
  count: number
  sent: number
  recv: number
  list: () => { handle: string; name: string; look: string | null }[]
} {
  return {
    count: bodies.size,
    sent: counters.sent,
    recv: counters.recv,
    list: () => remoteBodyList().map((b) => ({ handle: b.handle, name: b.name, look: b.look ? `${b.look.clothingStyle}/${b.look.hairstyle}` : null })),
  }
}
