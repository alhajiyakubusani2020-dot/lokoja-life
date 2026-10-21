/**
 * LOKOJA LIFE — PH2.5 CHARLIE: THE NATION WIRE — SHARED CONTEXT
 * ============================================================
 * Part 2 of the Phase-2.5 decomposition: the 2,479-line index.ts monolith
 * is split by domain into handlers/{identity,world,social,economy,transport}.ts.
 * This file is the ONE home of every piece of shared in-memory state, every
 * cross-domain helper, and the db handle — moved VERBATIM from index.ts
 * (zero logic changes; the placement map lives in
 * scripts/audit-tmp/charlie25/wire-map.md). index.ts constructs the context
 * and hands it to every register.
 *
 * The LAWS OF THIS FILE (the wire's own header) stay printed on index.ts,
 * the bootstrap. Every SQL statement here is byte-identical to the
 * monolith's.
 */
import { Server, type Socket as IoSocket } from 'socket.io'
import { Database } from 'bun:sqlite'

// THE LAW VAULT — imported VERBATIM from the game (zero copies, zero drift)
import { PRESENCE_TTL_MS, type LiveBand, type LiveIdentity } from '../../src/game/systems/live'
import { type SocialEdge } from '../../src/game/systems/socialgraph'
import { callChannel, type VoiceCallWhy } from '../../src/game/systems/voice'
import { POS_TICK_MS } from '../../src/game/systems/bodies'
import { VEH_TICK_MS } from '../../src/game/systems/wheels'
import { stageRoom } from '../../src/game/systems/stage'

// socket.io is imported ONCE here and re-exported: every handler file takes
// Server/IoSocket from this module, so the uninstalled-dep type error keeps
// exactly one site (the monolith's single import line).
export { Server }
export type { IoSocket }

export const CAPS = {
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
  // W2 — the 10Hz body cadence (POS_TICK_MS=100) + a burst headroom of one
  // full second; the cap is data, the cadence law lives in bodies.ts.
  pos: { n: Math.ceil((1000 / POS_TICK_MS) * 2.4), ms: 1_000 },
  // W10 — the 12Hz car cadence (VEH_TICK_MS=83) ONLY-WHILE-MOVING + the
  // same burst headroom; the cap is data, the law lives in wheels.ts.
  veh: { n: Math.ceil((1000 / VEH_TICK_MS) * 2.4), ms: 1_000 },
  // W9 — the stage: ingest/subscribe are single gestures; watch toggles
  // are the bursty one (a board click-around); chat rides the chat cap.
  stage: { n: 4, ms: 10_000 },
  // W10-b — the boarding doors: the seats toggle, the board/unboard
  // gestures, and the parked-spawn query are single honest gestures;
  // the DMV patch is its own slower key (a repaint spree stays human).
  board: { n: 8, ms: 10_000 },
  patch: { n: 4, ms: 10_000 },
} as const

interface WireCar {
  model: string
  plate: string
  paint: string
  x: number
  z: number
  hd: number
  mv: boolean
  t: number // the last accepted tick's clock — THE N12 CLAMP's dt
  odo: number // the honest odometer — CLAMPED metres only
  fuel: number
  condition: number
  // W10-b — THE CREW: the standing consent (seatsOpen) + the handles
  // aboard. A full car carries its people by handle; the roster carries
  // the same truth on every passenger's own row (riding).
  seatsOpen: boolean
  crew: string[]
}
export type { WireCar }

interface WirePresence {
  handle: string
  band: LiveBand
  street: string
  status: string
  voiceOn: boolean // W7 — the M17 opt-in rides the presence row
  ts: number
  sid: string // the socket that owns this presence — the sweep's truth
  car: WireCar | null // W10 — the car I'm driving (null = on foot)
  // W10-b — THE RIDE: whose car carries me (null = on foot). While it
  // lives my body lane refuses 'carried' — the walker is IN the car.
  riding: { driver: string; model: string; plate: string } | null
  // W2 — THE BODIES: the walker's moment + the face the body wears.
  // Positions are EPHEMERAL (the bodies.ts law): memory only, never a row.
  x: number
  z: number
  hd: number
  mv: boolean
  hasPos: boolean
  // F5 THE WALK LAW — the clamp's anchor: the epoch-ms and street of the
  // LAST ACCEPTED pos. posStreet '' = no lawful anchor yet (spawn, or a
  // street seam — the join-teleport/ferry door may lawfully move the body
  // across the map, so the next pos re-anchors instead of clamping).
  posT: number
  posStreet: string
  displayName: string
  look: string // the validated avatarLook JSON (the REAL vocab only)
}
export type { WirePresence }

interface WireCall {
  callId: string
  from: string
  to: string
  video: boolean
  state: 'ringing' | 'accepted' | 'connecting' | 'active'
  startedAt: number
}
export type { WireCall }

interface StageT {
  id: string
  host: string
  title: string
  startedAt: number
  viewers: Set<string> // the eye keys (handles; guests = guest:<sid>)
  eyesSid: Map<string, string> // eye key → the socket the envelopes ride to
  hostSid: string
}
export type { StageT }

interface FriendRowT {
  id: number
  ownerHandle: string
  peerHandle: string
  state: string
  requestedBy: string
}
export type { FriendRowT }

/** the roster row shape broadcastRoster/hello push (the W2/W10 seed). */
export interface WireRosterRow {
  handle: string
  band: LiveBand
  street: string
  status: string
  voiceOn: boolean
  ts: number
  displayName: string
  look: string
  x?: number
  z?: number
  hd?: number
  mv?: boolean
  car?: {
    model: string
    plate: string
    paint: string
    x: number
    z: number
    hd: number
    mv: boolean
    seatsOpen: boolean
  }
  riding?: { driver: string; model: string; plate: string }
}

/** The per-connection closures the monolith kept in the io.on('connection')
 * wrapper — carried into the handler registers so the socket.on bodies
 * themselves stay byte-verbatim. currentStreet is the one value handlers
 * mutate (hello/presence), so the conn carries it by accessor. */
export interface WireConn {
  socket: IoSocket
  identity: LiveIdentity & { accountId?: string }
  allow: (kind: keyof typeof CAPS) => boolean
  claimed: boolean
  currentStreet: string
}

/** THE ONE TYPED CONTEXT — every shared Map, the db handle, and every
 * cross-domain helper of the wire (the monolith's module level). */
export interface WireCtx {
  db: Database
  presence: Map<string, WirePresence> // handle -> record (one walker, one row)
  lastMoment: Map<string, { x: number; z: number; hd: number }>
  calls: Map<string, WireCall>
  stages: Map<string, StageT>
  stageIdByHost: Map<string, string>
  accountBuckets: Map<string, Map<string, { n: number; reset: number }>>
  relocateAt: Map<string, number>
  identityOf(s: IoSocket): LiveIdentity & { accountId?: string }
  rateKeeper(): (kind: keyof typeof CAPS) => boolean
  accountAllow(key: string, kind: keyof typeof CAPS): boolean
  relocateGate(key: string): boolean
  accountExists(handle: string): boolean
  accountBand(handle: string): 'kid' | 'teen' | 'adult' | null
  edgeGet(owner: string, peer: string): SocialEdge | null
  persistEvent(kind: string, channel: string, actor: string, band: string, payload: object): number | null
  headSeq(): number
  rosterFor(street?: string): WireRosterRow[]
  broadcastRoster(io: Server): void
  vehiclePersist(car: WireCar, handle: string): void
  broadcastParked(io: Server, street: string, car: WireCar, handle: string): void
  dropCrew(io: Server, car: WireCar, driver: string): void
  snapBodyToCar(p: WirePresence, car: { x: number; z: number; hd: number }): void
  pushCall(io: Server, toHandle: string, payload: Record<string, unknown>): void
  endCall(io: Server, c: WireCall, why: VoiceCallWhy, ender: string): void
  stageRow(id: string, status: 'live' | 'ended', viewersSnapshot: string[]): void
  endStage(io: Server, s: StageT, why: 'host' | 'system'): void
  pushViewers(io: Server, s: StageT): void
}

const RELOCATE_WINDOW = 5 * 60_000

export function makeCtx(dbPath: string): WireCtx {
  /* ─────────────────────────── the real database ─────────────────────────── */
  const db = new Database(dbPath)
  db.exec('PRAGMA journal_mode = WAL;')
  db.exec('PRAGMA busy_timeout = 5000;')

  const presence = new Map<string, WirePresence>() // handle -> record (one walker, one row)

  /** THE LAST MOMENT — a body's final honest position, kept so a reconnecting
   *  walker STANDS where they last stood instead of blinking to (0,0). Memory
   *  only (the ephemeral law): three numbers per claimed walker, no rows. */
  const lastMoment = new Map<string, { x: number; z: number; hd: number }>()

  /* ─────────────── W7 the call registry (memory — the relay doctrine) ───────────────
   * A call is TWO claimed walkers and a state line. No money, no truth of
   * its own — the registry only remembers which envelopes belong to which
   * phone so the laws can gate them. If the wire dies, the calls die with
   * it (both phones see the socket drop — nothing phantom survives). */
  const calls = new Map<string, WireCall>()

  /* ── THE ACCOUNT EYE (hardening): the socket buckets above are per-
   * connection — one token holding many sockets multiplied every cap by
   * the socket count (100 sockets = 100× every rate limit, plus a
   * scryptSync starvation weapon). This second eye is keyed by HANDLE
   * (a guest falls back to its socket id) with a 3× headroom for the
   * honest multi-device citizen. A door is only open when BOTH eyes
   * agree: the socket's flood law AND the account's manners. ── */
  const accountBuckets = new Map<string, Map<string, { n: number; reset: number }>>()

  /* ── THE RELOCATION GATE (hardening): vehicle:hello trusts the client's
   * pose — the N12 clamp never sees the jump, so a bye→far-hello cycle
   * teleported the car (and its full tank) anywhere for free. The law:
   * the car stands where IT parked. A hello landing far from the row's
   * own last park is a RELOCATION — allowed, but scarced to one per
   * window per handle:model, so the honest cross-town morning still
   * drives while hello-farming stops paying. Near-park hellos never
   * touch the gate. ── */
  const relocateAt = new Map<string, number>()

  /* THE REGISTRY IS MEMORY — a stage is a LIVE thing: when the host's socket
   * dies, the stage dies with it (THE STAGE DIES WITH THE HOST law). The
   * StreamRow keeps the honest board record (status live → ended); the live
   * truth is this map, like presence, like calls. */
  const stages = new Map<string, StageT>()
  const stageIdByHost = new Map<string, string>()

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

  /* ─────────── W10 the fleet's disk truth (THE PARK LAW's row) ─────────── */

  /** THE PARK PERSIST — the upsert the hello/park/bye/disconnect all run.
   *  The car stays where you stopped it, the odometer keeps its honest
   *  metres, and (W10-c) the tank waits at the level it was left at. */
  function vehiclePersist(car: WireCar, handle: string): void {
    try {
      db.query(
        'INSERT INTO VehicleRow (handle, model, plate, paint, fuel, condition, x, z, hd, odometer, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(handle, model) DO UPDATE SET plate = excluded.plate, paint = excluded.paint, fuel = excluded.fuel, condition = excluded.condition, x = excluded.x, z = excluded.z, hd = excluded.hd, odometer = excluded.odometer, updatedAt = excluded.updatedAt',
      ).run(handle, car.model, car.plate, car.paint, car.fuel, car.condition, car.x, car.z, car.hd, car.odo, Date.now())
    } catch {
      /* the park is best-effort — the moment still relays */
    }
  }

  /** THE PARKED BROADCAST — a car left behind stays VISIBLE where it
   *  stopped (the persistence spawn): every same-street socket holds the
   *  disk row as a ghost rig until the driver returns. Memory on the
   *  client, disk on the server — the same honest split as the park law. */
  function broadcastParked(io: Server, street: string, car: WireCar, handle: string): void {
    io.to(`wire:street:${street}`).emit('wire:parked', {
      op: 'park',
      row: {
        handle,
        model: car.model,
        plate: car.plate,
        paint: car.paint,
        x: car.x,
        z: car.z,
        hd: car.hd,
        odometer: car.odo,
        fuel: car.fuel,
        condition: car.condition,
      },
    })
  }

  /** THE CREW DROP — the driver's seat emptied (bye, goodbye, or the
   *  sweep): every passenger is put down WHERE THE CAR STANDS, honestly
   *  marked 'driver-gone', and their body lane reopens. */
  function dropCrew(io: Server, car: WireCar, driver: string): void {
    for (const h of [...car.crew]) {
      const rp = presence.get(h)
      if (rp && rp.riding?.driver === driver) {
        rp.riding = null
        // F5 THE BODY ANCHOR SNAP: the dropped passenger stands where the car
        // STANDS — their walk-law anchor re-seeds here, so the first pos tick
        // after the drop clamps from truth, never from the stale pre-ride spot.
        snapBodyToCar(rp, car)
        if (rp.sid) {
          io.to(rp.sid).emit('wire:car-crew', {
            type: 'dropped',
            driver,
            model: car.model,
            plate: car.plate,
            crew: [],
            who: h,
            why: 'driver-gone',
            x: car.x,
            z: car.z,
            hd: car.hd,
          })
        }
      }
    }
    car.crew = []
  }

  /** THE BODY ANCHOR SNAP — a lawful seam (stepping off a car) puts the
   * body where the wire KNOWS it stands, so the walk law clamps from truth
   * instead of gliding the walker from a stale pre-ride spot. */
  function snapBodyToCar(p: WirePresence, car: { x: number; z: number; hd: number }): void {
    p.x = car.x
    p.z = car.z
    p.hd = car.hd
    p.posT = Date.now()
    p.posStreet = p.street
  }

  function rosterFor(street?: string) {
    return [...presence.values()]
      .filter((p) => (street ? p.street === street : true))
      .map(({ handle, band, street: st, status, voiceOn, ts, x, z, hd, mv, hasPos, displayName, look, car, riding }) => ({
        handle,
        band,
        street: st,
        status,
        voiceOn,
        ts,
        // W2 — the body rides the roster: one push seeds the face, the moment
        // and the name; the pos lane only ever carries the DELTAS after it.
        ...(hasPos ? { x, z, hd, mv } : {}),
        displayName,
        look,
        // W10 — THE WHEELS' SEED: the car rides the same push (the face of
        // it + the spot it stands at); the wire:car lane is deltas only.
        ...(car
          ? {
              car: {
                model: car.model,
                plate: car.plate,
                paint: car.paint,
                x: car.x,
                z: car.z,
                hd: car.hd,
                mv: car.mv,
                seatsOpen: car.seatsOpen, // W10-b — the standing consent rides the seed
              },
            }
          : {}),
        // W10-b — THE RIDE rides the passenger's own row (the crew truth is
        // derivable: everybody whose riding.driver is the same handle).
        ...(riding ? { riding } : {}),
      }))
  }

  function pushCall(io: Server, toHandle: string, payload: Record<string, unknown>): void {
    const p = presence.get(toHandle)
    if (p?.sid) io.to(p.sid).emit('wire:call', payload) // rides the person
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

  function accountAllow(key: string, kind: keyof typeof CAPS): boolean {
    const cap = CAPS[kind]
    const now = Date.now()
    let buckets = accountBuckets.get(key)
    if (!buckets) {
      buckets = new Map()
      accountBuckets.set(key, buckets)
    }
    const b = buckets.get(kind)
    if (!b || now >= b.reset) {
      buckets.set(kind, { n: 1, reset: now + cap.ms })
      return true
    }
    if (b.n >= cap.n * 3) return false
    b.n += 1
    return true
  }

  function relocateGate(key: string): boolean {
    const now = Date.now()
    const at = relocateAt.get(key)
    if (at !== undefined && now - at < RELOCATE_WINDOW) return false
    relocateAt.set(key, now)
    return true
  }

  /* the eyes sweep: expired buckets and stale gates leave the books */
  setInterval(() => {
    const now = Date.now()
    for (const [k, buckets] of accountBuckets) {
      for (const [kind, b] of buckets) if (now >= b.reset) buckets.delete(kind)
      if (buckets.size === 0) accountBuckets.delete(k)
    }
    for (const [k, at] of relocateAt) if (now - at >= RELOCATE_WINDOW) relocateAt.delete(k)
  }, 60_000).unref()

  /* ────────────── W9 THE STAGE — the mesh registry helpers ────────────── */

  function stageRow(id: string, status: 'live' | 'ended', viewersSnapshot: string[]): void {
    try {
      // THE EPOCH LAW (hardening): updatedAt is INTEGER epoch-ms — the same
      // shape Prisma's @updatedAt writes. The old toISOString() text rows
      // were the exact mixed-type poison that once killed Prisma reads.
      db.query('UPDATE StreamRow SET status = ?, viewersJson = ?, updatedAt = ? WHERE id = ?').run(
        status,
        JSON.stringify(viewersSnapshot),
        Date.now(),
        id
      )
    } catch (e) {
      console.error(`[nation-wire] stageRow refused (${String(e).slice(0, 120)})`)
    }
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

  /* ─────────────────────── the social graph (W5, FriendRow) ────────────────── */

  function edgeGet(owner: string, peer: string): SocialEdge | null {
    const r = db
      .query('SELECT ownerHandle, peerHandle, state, requestedBy FROM FriendRow WHERE ownerHandle = ? AND peerHandle = ? LIMIT 1')
      .get(owner, peer) as FriendRowT | undefined
    return r ? { ownerHandle: r.ownerHandle, peerHandle: r.peerHandle, state: r.state as SocialEdge['state'], requestedBy: r.requestedBy } : null
  }

  function accountExists(handle: string): boolean {
    return !!db.query('SELECT id FROM Account WHERE handle = ? LIMIT 1').get(handle)
  }

  function accountBand(handle: string): 'kid' | 'teen' | 'adult' | null {
    const r = db.query('SELECT ageBand FROM Account WHERE handle = ? LIMIT 1').get(handle) as { ageBand: string } | undefined
    if (!r) return null
    return r.ageBand === 'kid' || r.ageBand === 'teen' ? r.ageBand : 'adult'
  }

  function identityOf(s: IoSocket): LiveIdentity & { accountId?: string } {
    return (s.data as { identity: LiveIdentity & { accountId?: string } }).identity
  }

  return {
    db,
    presence,
    lastMoment,
    calls,
    stages,
    stageIdByHost,
    accountBuckets,
    relocateAt,
    identityOf,
    rateKeeper,
    accountAllow,
    relocateGate,
    accountExists,
    accountBand,
    edgeGet,
    persistEvent,
    headSeq,
    rosterFor,
    broadcastRoster,
    vehiclePersist,
    broadcastParked,
    dropCrew,
    snapBodyToCar,
    pushCall,
    endCall,
    stageRow,
    endStage,
    pushViewers,
  }
}
