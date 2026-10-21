/**
 * LOKOJA LIFE — PH2.5 CHARLIE: THE NATION WIRE — WORLD
 * ====================================================
 * The world-sync / plates / wheels+bodies position lanes / the stage
 * board, moved VERBATIM from index.ts (zero logic changes). Domains:
 * the street claim (hello/presence), the 10Hz body lane (pos), the
 * 12Hz car family (vehicle:hello/pos/bye/seats/board/unboard/patch/
 * parked), the join-teleport lookup (where), and the W9 stage
 * registry doors (stage:start/watch/leave/chat/end/list).
 * The purse doors of the car (vehicle:refuel/repair) and the stage
 * tip live in economy.ts; the stage mesh envelope doors (offer/answer/
 * ice) live in transport.ts — see wire-map.md §3 for the boundary.
 */
import { posOk, bodyRelayOk, joinVerdict, bodyLook } from '../../../src/game/systems/bodies'
import { DEFAULT_LOOK_JSON } from '../../../src/game/systems/profile'
import {
  carHelloVerdict,
  clampVehicleStep,
  isParkTransition,
  DRY_TANK,
  boardVerdict,
  unboardVerdict,
  patchVerdict,
  plateOwnershipOk,
  parkedSeedsNear,
  fuelAfterBurn,
  conditionAfterWear,
  type ParkedSeed,
} from '../../../src/game/systems/wheels'
import {
  stageVerdict,
  stageWatchVerdict,
  stageEyeVerdict,
  stageEndOk,
  stageIdOk,
  stageRoom,
  stageChannel,
  stageTitleOk,
  STAGE_KIND,
  type StageWhy,
} from '../../../src/game/systems/stage'
import { socialNorm } from '../../../src/game/systems/socialgraph'
import { sanitizeChat, type LiveBand } from '../../../src/game/systems/live'
import type { Server, WireCtx, WireConn, WirePresence, WireCar, StageT } from '../context'

const RELOCATE_RADIUS = 60

export function register(io: Server, ctx: WireCtx, conn: WireConn): void {
  const { db, presence, lastMoment, stages, stageIdByHost, rosterFor, edgeGet, broadcastRoster, dropCrew, vehiclePersist, broadcastParked, snapBodyToCar, persistEvent, pushViewers, endStage, relocateGate } = ctx
  const { socket, identity, allow, claimed } = conn

  /** THE BODY'S FACE — the REAL ProfileRow at the door (the W1 register law's
   *  own disk). A walker with no row yet (pre-W1) carries the honest default
   *  look + their handle as the name; the first PATCH upgrades the body. */
  function profileOf(handle: string): { displayName: string; look: string } {
    try {
      const r = db
        .query('SELECT displayName, avatarLook FROM ProfileRow WHERE handle = ? LIMIT 1')
        .get(handle) as { displayName: string; avatarLook: string } | undefined
      if (r) {
        const look = bodyLook(r.avatarLook)
        return { displayName: r.displayName, look: look ? JSON.stringify(look) : DEFAULT_LOOK_JSON }
      }
    } catch {
      /* the face row is best-effort — the body still walks */
    }
    return { displayName: handle, look: DEFAULT_LOOK_JSON }
  }

  function freshPresence(handle: string, band: LiveBand, street: string, status: string, voiceOn: boolean, sid: string): WirePresence {
    const face = profileOf(handle)
    const lm = lastMoment.get(handle)
    return {
      handle,
      band,
      street,
      status,
      voiceOn,
      ts: Date.now(),
      sid,
      x: lm?.x ?? 0,
      z: lm?.z ?? 0,
      hd: lm?.hd ?? 0,
      mv: false,
      hasPos: !!lm,
      posT: 0,
      posStreet: '',
      displayName: face.displayName,
      look: face.look,
      car: null,
      riding: null,
    }
  }

  /* ───────────── F5 THE WALK LAW — the body lane's speed clamp ─────────────
   * Evidence for the ceiling: controls.ts:26-27 `MOVE = { walkSpeed: 4.4,
   * sprintSpeed: 7.4 }` u/s (bodies.ts:67 SPEED_MAX = 8 is the drift
   * headroom), reported at the 10Hz cadence (bodies.ts:51 POS_TICK_MS = 100;
   * remotenet.ts:20 "While moving: the 10Hz cadence; while still: the 1×/3s
   * heartbeat"). The wire clamps to 3× the fastest evidenced run speed:
   * an honest sprinter never touches it, a teleporting body cannot cross
   * it — the same doctrine the car lane has always run (clampVehicleStep,
   * wheels.ts:160), which the body lane lacked entirely. */
  const WALK_MAX_SPEED = 3 * 7.4 // 22.2 u/s

  /** THE WALKER STEP CLAMP — mirror of clampVehicleStep's structure, scaled
   * to the elapsed time since the anchor: the delta VECTOR is scaled down
   * its own direction (no per-axis clamp — a diagonal gains nothing), so
   * direction is preserved and the average speed across ANY tick pattern
   * never exceeds WALK_MAX_SPEED. No lawful anchor (first pos, or a street
   * seam — the where door itself hands out teleports) accepts as-is. */
  function clampBodyStep(
    prev: { x: number; z: number; t: number } | null,
    next: { x: number; z: number },
    nowMs: number,
  ): { x: number; z: number; clamped: boolean } {
    if (!prev || !Number.isFinite(prev.x) || !Number.isFinite(prev.z)) {
      return { x: next.x, z: next.z, clamped: false }
    }
    const dt = Math.max(1, nowMs - prev.t) / 1000
    const maxDist = Math.max(0, WALK_MAX_SPEED * dt)
    const dx = next.x - prev.x
    const dz = next.z - prev.z
    const dist = Math.hypot(dx, dz)
    if (dist <= maxDist) {
      return { x: next.x, z: next.z, clamped: false }
    }
    const k = maxDist / dist // scale the leap down its own direction
    return { x: prev.x + dx * k, z: prev.z + dz * k, clamped: true }
  }

  /** THE BODY RELAY — a mover's moment to one same-street neighbour, the
   * BLOCK WALL checked PER RECIPIENT (a blocked pair shares NO positions,
   * either direction — the M17 wall walks in space). Memory only: no row,
   * no replay, no history — the ephemeral law. */
  function relayPos(io: Server, from: WirePresence): void {
    const payload = { h: from.handle, x: from.x, z: from.z, hd: from.hd, mv: from.mv }
    for (const p of presence.values()) {
      if (p.handle === from.handle || p.street !== from.street || !p.sid) continue
      if (!bodyRelayOk(
        edgeGet(from.handle, p.handle)?.state === 'blocked' || edgeGet(p.handle, from.handle)?.state === 'blocked',
      )) continue
      io.to(p.sid).emit('wire:pos', payload)
    }
  }

  /* ─────────── W10 the fleet's disk truth (THE PARK LAW's row) ─────────── */

  /** the park row's readback — the fuel/odometer/park-spot the car was
   *  born with (or last left behind). Best-effort: a row that cannot be
   *  read never stops a drive from starting. */
  function vehicleRowOf(handle: string, model: string): {
    plate: string
    paint: string
    fuel: number
    condition: number
    x: number
    z: number
    hd: number
    odometer: number
  } | null {
    try {
      return (
        (db
          .query('SELECT plate, paint, fuel, condition, x, z, hd, odometer FROM VehicleRow WHERE handle = ? AND model = ? LIMIT 1')
          .get(handle, model) as {
          plate: string
          paint: string
          fuel: number
          condition: number
          x: number
          z: number
          hd: number
          odometer: number
        } | null) ?? null
      )
    } catch {
      return null
    }
  }

  /** THE DMV'S EYE — who owns this plate? One plate, one row (bun:sqlite
   *  is synchronous: the check and the write cannot race inside one
   *  process — the uniqueness wall needs no index to be honest). */
  function plateOwnerOf(plate: string): { handle: string; model: string } | null {
    try {
      return (
        (db
          .query('SELECT handle, model FROM VehicleRow WHERE plate = ? LIMIT 1')
          .get(plate) as { handle: string; model: string } | undefined) ?? null
      )
    } catch {
      return null
    }
  }

  /** THE CREW PUSH — the instant lane to the driver's socket (the crew UI
   *  learns a member joined/left/was dropped in one beat, roster follows). */
  function pushCarCrew(
    io: Server,
    driverSid: string | null | undefined,
    driver: string,
    car: WireCar,
    op: 'board' | 'unboard' | 'dropped',
    who: string,
    why?: string,
  ): void {
    const payload = {
      type: op,
      driver,
      model: car.model,
      plate: car.plate,
      crew: [...car.crew],
      who,
      ...(why ? { why } : {}),
    }
    if (driverSid) io.to(driverSid).emit('wire:car-crew', payload)
    for (const h of car.crew) {
      const rp = presence.get(h)
      if (rp?.sid) io.to(rp.sid).emit('wire:car-crew', payload)
    }
  }

  function stageBoard() {
    return [...stages.values()]
      .sort((a, b) => a.startedAt - b.startedAt)
      .map((s) => ({ id: s.id, host: s.host, title: s.title, kind: STAGE_KIND, viewers: s.viewers.size, startedAt: s.startedAt }))
  }

  function mintStageId(): string {
    return `stg-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
  }

  /* ── hello: the street claim (presence + street room + THE BODY) ── */
  socket.on('hello', (raw: unknown, ack?: (r: unknown) => void) => {
    const body = (raw ?? {}) as { street?: string; status?: string; voiceOn?: boolean; x?: unknown; z?: unknown; hd?: unknown }
    conn.currentStreet = typeof body.street === 'string' ? body.street.slice(0, 48) : 'home'
    const status = typeof body.status === 'string' ? body.status.slice(0, 24) : 'chilling'
    const voiceOn = body.voiceOn === true // W7 — the M17 opt-in rides presence
    if (claimed) {
      socket.join(`wire:street:${conn.currentStreet}`)
      const prev = presence.get(identity.handle!)
      const p = freshPresence(identity.handle!, identity.band, conn.currentStreet, status, voiceOn, socket.id)
      // a re-hello (reconnect) keeps the body's last honest moment — and
      // (F5) its walk-law anchor ONLY if the moment belongs to THIS street;
      // a re-hello into another street is a lawful teleport seam, so the
      // next pos re-anchors instead of clamping across the old street.
      if (prev && prev.hasPos) {
        p.x = prev.x
        p.z = prev.z
        p.hd = prev.hd
        p.mv = false
        p.hasPos = true
        p.posT = prev.posStreet === conn.currentStreet ? prev.posT : 0
        p.posStreet = prev.posStreet === conn.currentStreet ? conn.currentStreet : ''
      }
      presence.set(identity.handle!, p)
      broadcastRoster(io)
    }
    ack?.({ ok: true, street: conn.currentStreet, roster: rosterFor(claimed ? conn.currentStreet : undefined) })
  })

  /* ── presence updates (claimed only — a guest has no street) ── */
  socket.on('presence', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('presence')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { street?: string; status?: string; voiceOn?: boolean }
    const nextStreet = typeof body.street === 'string' ? body.street.slice(0, 48) : conn.currentStreet
    const status = typeof body.status === 'string' ? body.status.slice(0, 24) : 'chilling'
    const voiceOn = body.voiceOn === true
    if (nextStreet !== conn.currentStreet) {
      socket.leave(`wire:street:${conn.currentStreet}`)
      socket.join(`wire:street:${nextStreet}`)
      conn.currentStreet = nextStreet
    }
    const p = presence.get(identity.handle!)
    if (p) {
      p.street = conn.currentStreet
      p.status = status
      p.voiceOn = voiceOn
      p.ts = Date.now()
      p.sid = socket.id
    } else {
      presence.set(identity.handle!, freshPresence(identity.handle!, identity.band, conn.currentStreet, status, voiceOn, socket.id))
    }
    broadcastRoster(io)
    ack?.({ ok: true, street: conn.currentStreet })
  })

  /* ── W2 THE POS DOOR — the body's moment at 10Hz. THE EPHEMERALITY LAW:
   * memory only, never a row; THE POS LAW at the door (bad-pos refuses);
   * F5 THE WALK LAW (the step is clamped to the evidenced walk ceiling —
   * the car lane's own clampVehicleStep doctrine, now on foot too);
   * THE BLOCK WALL per recipient in the relay. A guest broadcasts NOTHING
   * (guest-mic-dark — the spectate law: guests watch, never walk). ── */
  socket.on('pos', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    // W10/W10-b — THE CARRIED LAW: while my car is live on the wire — or
    // I ride in somebody's — my BODY lane is silent (the walker is IN a
    // car; the client's own sender pauses; this door is the backstop).
    const carriedMe = presence.get(identity.handle!)
    if (carriedMe?.car || carriedMe?.riding) return ack?.({ ok: false, why: 'carried' })
    if (!allow('pos')) return ack?.({ ok: false, why: 'too-fast' })
    if (!posOk(raw)) return ack?.({ ok: false, why: 'bad-pos' })
    const p = presence.get(identity.handle!)
    if (!p) return ack?.({ ok: false, why: 'no-street' })
    const now = Date.now()
    // F5 THE WALK LAW: clamp from the anchor — the last accepted pos on
    // THIS street. A street seam (join-teleport, ferry) has no lawful
    // anchor (posStreet '' or another street): the pos RE-ANCHORS there,
    // because the wire itself handed the walker that teleport.
    const anchored = p.hasPos && p.posStreet === p.street && p.posT > 0
    const step = clampBodyStep(anchored ? { x: p.x, z: p.z, t: p.posT } : null, { x: raw.x, z: raw.z }, now)
    p.x = step.x
    p.z = step.z
    p.hd = raw.hd
    p.mv = raw.mv
    p.hasPos = true
    p.posT = now
    p.posStreet = p.street
    p.ts = now
    lastMoment.set(identity.handle!, { x: p.x, z: p.z, hd: p.hd })
    relayPos(io, p)
    ack?.({ ok: true, clamped: step.clamped })
  })

  /* ── W10 THE CAR DOOR — the fleet's hello. THE ADULT-HANDS LAW at the
   * server door (a minor NEVER drives online — kid or teen, the wheel
   * refuses), the plate/paint/pos laws verbatim, and THE SEED: the car
   * rides the roster from this instant. The ack carries the DISK truth
   * (the fuel/condition/odometer the car was last left with) — the
   * readback law. ── */
  socket.on('vehicle:hello', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('veh')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { model?: unknown; plate?: unknown; paint?: unknown; x?: unknown; z?: unknown; hd?: unknown; mv?: unknown }
    const v = carHelloVerdict({
      band: identity.band,
      model: body.model,
      plate: body.plate,
      paint: body.paint,
      pos: { x: body.x, z: body.z, hd: body.hd, mv: body.mv === true },
    })
    if (!v.ok) return ack?.(v)
    const p = presence.get(identity.handle!)
    if (!p) return ack?.({ ok: false, why: 'no-street' })
    // W10-b — THE PLATE OWNERSHIP LAW at the hello too: the plate this
    // hello carries must not be another citizen's row (the DMV's eye at
    // every door that writes a plate — the upsert below must never clone one).
    if (!plateOwnershipOk(v.plate, identity.handle!, v.model, plateOwnerOf(v.plate))) {
      return ack?.({ ok: false, why: 'plate-taken' })
    }
    // switching cars persists the old one's last park first (the row is sacred)
    if (p.car && p.car.model !== v.model) {
      dropCrew(io, p.car, identity.handle!)
      vehiclePersist(p.car, identity.handle!)
    }
    const row = vehicleRowOf(identity.handle!, v.model)
    // THE RELOCATION GATE (hardening): the car stands where IT parked.
    // A far hello is a teleport — scarced to one per window per
    // handle:model; the honest near-park hello never touches the gate.
    if (row && Number.isFinite(row.x) && Number.isFinite(row.z)) {
      const rdx = v.pos.x - row.x
      const rdz = v.pos.z - row.z
      if (rdx * rdx + rdz * rdz > RELOCATE_RADIUS * RELOCATE_RADIUS && !relocateGate(`${identity.handle!}:${v.model}`)) {
        return ack?.({ ok: false, why: 'too-far-from-park' })
      }
    }
    p.car = {
      model: v.model,
      plate: v.plate,
      paint: v.paint || row?.paint || '',
      x: v.pos.x,
      z: v.pos.z,
      hd: v.pos.hd,
      mv: v.pos.mv,
      t: Date.now(),
      odo: typeof row?.odometer === 'number' ? row.odometer : 0,
      fuel: typeof row?.fuel === 'number' ? row.fuel : 1,
      condition: typeof row?.condition === 'number' ? row.condition : 1,
      seatsOpen: false, // W10-b — consent is EXPLICIT: every hello starts shut
      crew: [],
    }
    // THE PARK LAW: a parked hello is a park — the row persists at once
    if (!v.pos.mv) vehiclePersist(p.car, identity.handle!)
    broadcastRoster(io)
    ack?.({ ok: true, car: { model: p.car.model, plate: p.car.plate, paint: p.car.paint, fuel: p.car.fuel, condition: p.car.condition, odometer: p.car.odo } })
  })

  /* ── W10 THE WHEEL POS DOOR — the 12Hz ONLY-WHILE-MOVING delta lane.
   * THE N12 SPEED LAW lives here: the wire CLAMPS every step to the
   * model's TRUE top speed (a cheating leap relays as the lawful
   * distance along its own heading) and the odometer reads ONLY the
   * clamped metres. THE PARK LAW: the stop persists the row once. THE
   * BLOCK WALL per recipient, exactly like the body's lane. ── */
  socket.on('vehicle:pos', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('veh')) return ack?.({ ok: false, why: 'too-fast' })
    const p = presence.get(identity.handle!)
    if (!p || !p.car) return ack?.({ ok: false, why: 'no-car' })
    if (!posOk(raw)) return ack?.({ ok: false, why: 'bad-pos' })
    const now = Date.now()
    // W10-c — THE DRY TANK: at the dry line the engine coughs — further
    // motion refuses (the last lawful tick already burned to the floor).
    if (p.car.fuel < DRY_TANK && raw.mv === true) {
      return ack?.({ ok: false, why: 'dry-tank' })
    }
    const wasMoving = p.car.mv
    const step = clampVehicleStep({ x: p.car.x, z: p.car.z, t: p.car.t }, { x: raw.x, z: raw.z }, p.car.model, now)
    p.car.x = step.x
    p.car.z = step.z
    p.car.hd = raw.hd
    p.car.mv = raw.mv
    p.car.t = now
    p.car.odo += step.moved
    // W10-c — THE BURN + THE WEAR: the CLAMPED metres burn the tank and
    // wear the condition (a cheat's kilometres never burn fuel — the
    // odometer's own law carries here). The park persists the row.
    p.car.fuel = fuelAfterBurn(p.car.fuel, step.moved, p.car.model)
    p.car.condition = conditionAfterWear(p.car.condition, step.moved)
    // THE PARK LAW: the move→stop transition persists the row ONCE
    if (isParkTransition(wasMoving, raw.mv)) vehiclePersist(p.car, identity.handle!)
    const payload = { h: identity.handle, model: p.car.model, plate: p.car.plate, paint: p.car.paint, x: p.car.x, z: p.car.z, hd: p.car.hd, mv: p.car.mv, seatsOpen: p.car.seatsOpen }
    for (const o of presence.values()) {
      if (o.handle === identity.handle || o.street !== p.street || !o.sid) continue
      if (!bodyRelayOk(edgeGet(identity.handle!, o.handle)?.state === 'blocked' || edgeGet(o.handle, identity.handle!)?.state === 'blocked')) continue
      io.to(o.sid).emit('wire:car', payload)
    }
    ack?.({ ok: true, clamped: step.clamped })
  })

  /* ── W10 THE BYE DOOR — the engine dies with MY hand: exit the world,
   *   the menu, or the garage's own off switch. The row persists (the car
   *   stays where it stopped), the seed leaves the roster — and (W10-b)
   *   the crew is put down where the car stands, while the PARKED
   *   BROADCAST keeps the car visible to the street it stopped on. ── */
  socket.on('vehicle:bye', (_raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    const p = presence.get(identity.handle!)
    if (p?.car) {
      const stood = { x: p.car.x, z: p.car.z, hd: p.car.hd }
      dropCrew(io, p.car, identity.handle!)
      vehiclePersist(p.car, identity.handle!)
      broadcastParked(io, p.street, p.car, identity.handle!)
      p.car = null
      // F5 THE BODY ANCHOR SNAP: the engine dies where it STANDS — the
      // driver's walk-law anchor re-seeds at the car's stand, so the body
      // lane that reopens clamps from truth, not the pre-drive spot.
      snapBodyToCar(p, stood)
      broadcastRoster(io)
    }
    ack?.({ ok: true })
  })

  /* ── W10-b THE SEATS DOOR — the driver's standing consent. THE HIJACK
   *   LAW: consent or nothing — the toggle is the driver's own hand, the
   *   car must be live, and the roster re-pushes so the street's chips
   *   read the same truth. ── */
  socket.on('vehicle:seats', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('board')) return ack?.({ ok: false, why: 'too-fast' })
    const p = presence.get(identity.handle!)
    if (!p?.car) return ack?.({ ok: false, why: 'no-car' })
    const body = (raw ?? {}) as { open?: unknown }
    p.car.seatsOpen = body.open === true
    broadcastRoster(io)
    ack?.({ ok: true, seatsOpen: p.car.seatsOpen })
  })

  /* ── W10-b THE BOARD DOOR — ride shotgun. THE BOARD VERDICT verbatim
   *   (no-car → guest-dark → already-aboard → blocked → seats-shut →
   *   moving → full), THE SAME-STREET WALL (you board a car you can
   *   walk up to), and THE CREW: the passenger's own row carries the
   *   ride; the body lane refuses 'carried' from this instant. ── */
  socket.on('vehicle:board', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-dark' })
    if (!allow('board')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { handle?: unknown }
    const driver = socialNorm(body.handle)
    if (!driver || driver === identity.handle!) return ack?.({ ok: false, why: 'no-car' })
    const dp = presence.get(driver)
    const car = dp?.car ?? null
    const me = presence.get(identity.handle!)
    if (!me) return ack?.({ ok: false, why: 'no-street' })
    if (!dp || !car || dp.street !== me.street) return ack?.({ ok: false, why: 'not-here' })
    const blockedEitherWay =
      edgeGet(identity.handle!, driver)?.state === 'blocked' || edgeGet(driver, identity.handle!)?.state === 'blocked'
    const v = boardVerdict({
      band: identity.band,
      model: car.model,
      carLive: true,
      carMv: car.mv,
      seatsOpen: car.seatsOpen,
      seated: car.crew.length,
      blocked: blockedEitherWay,
      alreadyAboard: !!me.riding || !!me.car,
    })
    if (!v.ok) return ack?.(v)
    me.riding = { driver, model: car.model, plate: car.plate }
    car.crew.push(identity.handle!)
    broadcastRoster(io)
    pushCarCrew(io, dp.sid, driver, car, 'board', identity.handle!, me.displayName)
    ack?.({
      ok: true,
      seat: v.seat,
      car: { model: car.model, plate: car.plate, paint: car.paint, x: car.x, z: car.z, hd: car.hd },
    })
  })

  /* ── W10-b THE UNBOARD DOOR — step off where the car STANDS. A moving
   *   danfo drops nobody (the verdict mirrors the boarding wall); the
   *   ack carries the car's pose so the walker lands BESIDE it. ── */
  socket.on('vehicle:unboard', (_raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-dark' })
    if (!allow('board')) return ack?.({ ok: false, why: 'too-fast' })
    const me = presence.get(identity.handle!)
    if (!me?.riding) return ack?.({ ok: false, why: 'not-riding' })
    const driver = me.riding.driver
    const dp = presence.get(driver)
    const car = dp?.car ?? null
    const u = unboardVerdict(true, car?.mv === true)
    if (!u.ok) return ack?.(u)
    const pose = car ? { x: car.x, z: car.z, hd: car.hd } : null
    if (car) {
      car.crew = car.crew.filter((h) => h !== identity.handle!)
      pushCarCrew(io, dp!.sid, driver, car, 'unboard', identity.handle!)
    }
    me.riding = null
    // F5 THE BODY ANCHOR SNAP: step off where the car STANDS — the wire's
    // own door law (the ack carries this pose) now anchors the walk law
    // at the same truth, so the next pos clamps from beside the car.
    if (pose) snapBodyToCar(me, pose)
    broadcastRoster(io)
    ack?.({ ok: true, ...(pose ?? {}) })
  })

  /* ── W10-b THE DMV DOOR — the paint and the plate, server truth. THE
   *   DMV VERDICT verbatim (claimed only, real model, paint law, plate
   *   law), THE OWNERSHIP WALL (not-yours), THE PLATE UNIQUENESS WALL
   *   (one plate, one row), and a LIVE car wears the new face at once
   *   (the roster re-push repaints every street rig in one beat). ── */
  socket.on('vehicle:patch', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-dark' })
    if (!allow('patch')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { model?: unknown; paint?: unknown; plate?: unknown }
    const v = patchVerdict({ band: identity.band, model: body.model, paint: body.paint, plate: body.plate })
    if (!v.ok) return ack?.(v)
    const row = vehicleRowOf(identity.handle!, v.model)
    if (!row) return ack?.({ ok: false, why: 'not-yours' })
    if (v.plate !== undefined && !plateOwnershipOk(v.plate, identity.handle!, v.model, plateOwnerOf(v.plate))) {
      return ack?.({ ok: false, why: 'plate-taken' })
    }
    const nextPlate = v.plate ?? row.plate
    const nextPaint = v.paint ?? row.paint
    try {
      db
        .query('UPDATE VehicleRow SET plate = ?, paint = ?, updatedAt = ? WHERE handle = ? AND model = ?')
        .run(nextPlate, nextPaint, Date.now(), identity.handle!, v.model)
    } catch {
      return ack?.({ ok: false, why: 'dmv-down' })
    }
    const p = presence.get(identity.handle!)
    if (p?.car && p.car.model === v.model) {
      p.car.plate = nextPlate
      p.car.paint = nextPaint
      broadcastRoster(io)
    }
    ack?.({ ok: true, plate: nextPlate, paint: nextPaint })
  })

  /* ── W10-b THE PARKED SPAWN DOOR — the city keeps its cars. A walker
   *   asks for the parked rows NEAR them (the range law's own 90u, the
   *   disk's honest box query), the seed law dedupes the LIVE roster (a
   *   live car wins its own row), the cap keeps the wire thin. ── */
  socket.on('vehicle:parked', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-dark' })
    if (!allow('board')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { x?: unknown; z?: unknown }
    const x = Number(body.x)
    const z = Number(body.z)
    if (!Number.isFinite(x) || !Number.isFinite(z)) return ack?.({ ok: false, why: 'bad-pos' })
    const half = 200 // the box the SQL prunes; the seed law's 90u decides the rest
    let rows: ParkedSeed[] = []
    try {
      rows = db
        .query(
          'SELECT handle, model, plate, paint, x, z, hd, odometer, fuel, condition FROM VehicleRow WHERE x BETWEEN ? AND ? AND z BETWEEN ? AND ?',
        )
        .all(x - half, x + half, z - half, z + half) as unknown as ParkedSeed[]
    } catch {
      rows = []
    }
    const liveKeys = new Set<string>()
    for (const p of presence.values()) if (p.car) liveKeys.add(`${p.handle}\u0000${p.car.model}`)
    ack?.({ ok: true, parked: parkedSeedsNear(rows, x, z, liveKeys) })
  })

  /* ── W2 THE WHERE DOOR — the join-teleport law. Where does my paddy
   * STAND right now? THE JOIN WALL (bodies.ts verbatim): blocked never,
   * minors reach accepted paddies only, guests stay dark, and a walker
   * who is not on the wire is honestly 'not-around'. ── */
  socket.on('where', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('social')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { handle?: string }
    const target = socialNorm(body.handle)
    if (!target) return ack?.({ ok: false, why: 'bad-handle' })
    const t = presence.get(target) ?? null
    const blockedEitherWay = edgeGet(identity.handle!, target)?.state === 'blocked' || edgeGet(target, identity.handle!)?.state === 'blocked'
    const verdict = joinVerdict({
      myBand: identity.band,
      blockedEitherWay,
      edgeStateMine: edgeGet(identity.handle!, target)?.state ?? null,
      edgeStateTheirs: edgeGet(target, identity.handle!)?.state ?? null,
      targetPresent: !!t,
      self: target === identity.handle,
    })
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    ack?.({ ok: true, street: t!.street, x: t!.x, z: t!.z, hd: t!.hd, hasPos: t!.hasPos, displayName: t!.displayName })
  })

  /* ── W9 THE STAGE — the nation's broadcast at the server door.
   * THE BROADCAST DOOR (stageVerdict verbatim): guests stay dark, minors
   * never broadcast, the title law, THE ONE-STAGE LAW. THE TOKEN LAW: the
   * wire mints the media-house token; the media NEVER rides this wire.
   * THE BOARD LAW: the StreamRow is the board record; the live registry
   * is the truth; every start/end rides BOTH lanes (the room + the
   * global board). ── */
  socket.on('stage:start', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('stage')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { title?: unknown }
    const v = stageVerdict(identity, body.title, stageIdByHost.has(identity.handle!))
    if (!v.ok) return ack?.({ ok: false, why: v.why })
    const id = mintStageId()
    const stage: StageT = { id, host: identity.handle!, title: v.title!, startedAt: Date.now(), viewers: new Set(), eyesSid: new Map(), hostSid: socket.id }
    stages.set(id, stage)
    stageIdByHost.set(identity.handle!, id)
    socket.join(stageRoom(id))
    // THE BOARD RECORD — StreamRow is upserted live; a crash between map
    // and row leaves an honest 'live' row that the next start/end re-pins.
    try {
      db.query(
        "INSERT INTO StreamRow (id, host, kind, title, viewersJson, startedDay, status, updatedAt) VALUES (?, ?, ?, ?, '[]', ?, 'live', ?) ON CONFLICT(id) DO UPDATE SET status = 'live', title = excluded.title, kind = excluded.kind, updatedAt = excluded.updatedAt"
      ).run(id, stage.host, STAGE_KIND, stage.title, 1, Date.now())
    } catch (e) {
      stages.delete(id)
      stageIdByHost.delete(stage.host)
      console.error(`[nation-wire] stage board row refused (${String(e).slice(0, 120)})`)
      return ack?.({ ok: false, why: 'wire no gree — try again' })
    }
    io.to('wire:global').emit('wire:stage', { type: 'started', stage: { id, host: stage.host, title: stage.title, kind: STAGE_KIND, viewers: 0, startedAt: stage.startedAt } })
    ack?.({ ok: true, streamId: id, title: stage.title })
  })

  /* ── THE SPECTATE DOOR (stageWatchVerdict verbatim): ANYBODY on the wire
   * may watch a LIVE stage — claimed or guest, kid or adult. Watching is
   * not speaking: the chat door below still runs the M17 tier laws. ── */
  socket.on('stage:watch', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!allow('stage')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    const w = stageWatchVerdict(identity, !!s)
    if (!w.ok || !s) return ack?.({ ok: false, why: w.why ?? 'stage-not-live' })
    const eye = identity.handle ?? `guest:${socket.id}`
    // THE EYE LAW (stage.ts verbatim): the spectate law + THE MESH CAP —
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
  })

  socket.on('stage:leave', (raw: unknown, ack?: (r: unknown) => void) => {
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

  /* ── THE STAGE CHAT — the SAME words the street speaks: sanitizeChat at
   * the door (kid emote-only / teen 140 / adult 280 + the link law), the
   * SAME LiveEvent table (THE ONE-NATION LAW — the 12s lane and the cursor
   * replay carry the stage's words too), relayed to the stage room alone. ── */
  socket.on('stage:chat', (raw: unknown, ack?: (r: unknown) => void) => {
    if (!claimed) return ack?.({ ok: false, why: 'guest-mic-dark' })
    if (!allow('chat')) return ack?.({ ok: false, why: 'too-fast' })
    const body = (raw ?? {}) as { streamId?: unknown; text?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    if (!stages.has(body.streamId)) return ack?.({ ok: false, why: 'stage-not-live' })
    const verdict = sanitizeChat(identity, typeof body.text === 'string' ? body.text : '')
    if (!verdict.ok) return ack?.({ ok: false, why: verdict.why })
    const channel = stageChannel(body.streamId)
    const seq = persistEvent('chat', channel, identity.handle!, identity.band, {
      text: verdict.text,
      stripped: verdict.stripped ?? false,
    })
    if (seq === null) return ack?.({ ok: false, why: 'wire no gree — try again' })
    const ev = { seq, kind: 'chat' as const, channel, actor: identity.handle!, band: identity.band, payload: { text: verdict.text, stripped: verdict.stripped ?? false } }
    io.to(stageRoom(body.streamId)).emit('wire:event', ev)
    ack?.({ ok: true, seq, stripped: verdict.stripped ?? false, echo: ev })
  })

  /* ── THE END DOOR — the host's own hand, or the system's (the disconnect
   * law below). THE ONE-UNMOUNT SPIRIT: the stage ends ONCE, the room and
   * the global board both learn it, the row reads 'ended'. ── */
  socket.on('stage:end', (raw: unknown, ack?: (r: unknown) => void) => {
    const body = (raw ?? {}) as { streamId?: unknown }
    if (!stageIdOk(body.streamId)) return ack?.({ ok: false, why: 'bad-stage' })
    const s = stages.get(body.streamId)
    if (!s) return ack?.({ ok: true })
    const e = stageEndOk(identity, s.host)
    if (!e.ok) return ack?.({ ok: false, why: e.why })
    endStage(io, s, 'host')
    ack?.({ ok: true })
  })

  /* ── THE BOARD DOOR — the LIVE truth only (ended rows are history, the
   * honest empty state is the board's own face). ── */
  socket.on('stage:list', (_raw: unknown, ack?: (r: unknown) => void) => {
    ack?.({ ok: true, stages: stageBoard() })
  })
}
