/**
 * LOKOJA LIFE — M24 W4: THE WIRE CLIENT
 * =====================================
 * The game's fast lane to the nation-wire service (:3003 through the
 * gateway). ONE singleton socket, idempotent ensure, honest states.
 *
 * LAWS OF THIS FILE:
 *  - THE NOTHING-THROWN-AWAY LAW: the 12s relay heartbeat (/api/live/sync)
 *    stays EXACTLY as it is — it is the DEGRADED lane. When the wire is
 *    'live' the faces stop polling (bandwidth law N5); the moment the
 *    socket drops they fall back automatically. Two lanes, one nation.
 *  - THE HONEST-STATE LAW: 'off' | 'connecting' | 'live' | 'degraded' —
 *    the faces label the lane with the REAL state, never a fake green.
 *  - THE SPECTATE LAW (M17 identity law, client side): the socket connects
 *    even for a guest (listening is free); the mic stays dark — the
 *    server door enforces it and the faces already do too.
 *  - THE CURSOR LAW (client side): every event seen updates lastSeq; a
 *    reconnect resumes from it (server replays the gap). One cursor.
 *  - THE DEDUPE LAW: the feed is keyed by seq — the wire echo, the relay
 *    lane and the resume replay can all collide; seq wins, exactly once.
 *  - THE BANDWIDTH LAW (N5): idle traffic = one 24-byte ping every 12s.
 *    Presence updates ride the same cadence (≤1/2s server cap, we send
 *    1/12s). No other idle chatter.
 *  - THE 3s GATE: reconnectionDelay 500ms, reconnectionDelayMax 3000ms —
 *    the socket is back or the state says 'degraded' (the relay takes over).
 *  - THE TOKEN-ROTATION LAW: the auth is captured per handshake; when the
 *    account's token changes (login/claim/rotate) the socket re-handshakes
 *    with the fresh token. A stale token never sits on the wire.
 *  - THE OFF-SWITCH: wireForget() closes the lane (logout/reset paths).
 */

import { io, type Socket } from 'socket.io-client'
import { create } from 'zustand'

export type WireState = 'off' | 'connecting' | 'live' | 'degraded'

export interface WireFeedEvent {
  seq: number
  kind: string
  channel: string
  actor: string
  band: string
  payload: Record<string, unknown>
}

export interface WireRosterRow {
  handle: string
  band: string
  street: string
  status: string
  voiceOn?: boolean // W7 — the M17 opt-in rides the roster
  ts: number
  // W2 — the body rides the roster (one push seeds the face + the moment)
  displayName?: string
  look?: string // the validated avatarLook JSON
  x?: number
  z?: number
  hd?: number
  mv?: boolean
}

interface WireStore {
  state: WireState
  feed: WireFeedEvent[]
  roster: WireRosterRow[]
  latencyMs: number | null
}

export const useWireStore = create<WireStore>(() => ({
  state: 'off',
  feed: [],
  roster: [],
  latencyMs: null,
}))

/* ───────────────────────── the singleton ───────────────────────── */

const WIRE_URL = '/?XTransformPort=3003'
const FEED_CAP = 200
const PING_EVERY_MS = 12_000

let socket: Socket | null = null
let handshakeToken: string | null = null
let lastSeq = 0
let presence: { street: string; status: string } = { street: 'home', status: 'hustling' }
let pingTimer: ReturnType<typeof setInterval> | null = null

function setState(s: WireState) {
  useWireStore.setState({ state: s })
}

function pushFeed(events: WireFeedEvent[]) {
  if (!events.length) return
  const cur = useWireStore.getState().feed
  // THE DEDUPE LAW: seq is the identity; only the unseen pass
  const seen = new Set(cur.map((e) => e.seq))
  const fresh = events.filter((e) => e.seq > 0 && !seen.has(e.seq))
  if (!fresh.length) return
  for (const e of fresh) if (e.seq > lastSeq) lastSeq = e.seq
  const merged = [...cur, ...fresh].sort((a, b) => a.seq - b.seq)
  useWireStore.setState({ feed: merged.length > FEED_CAP ? merged.slice(merged.length - FEED_CAP) : merged })
}

function startPing(s: Socket) {
  stopPing()
  pingTimer = setInterval(() => {
    if (!s.connected) return
    const t0 = Date.now()
    s.timeout(4000).emit('ping', {}, (err: unknown) => {
      if (err) return
      useWireStore.setState({ latencyMs: Date.now() - t0 })
    })
  }, PING_EVERY_MS)
}

function stopPing() {
  if (pingTimer) clearInterval(pingTimer)
  pingTimer = null
}

function wirePresence() {
  if (socket?.connected) socket.emit('presence', presence)
}

/**
 * THE ONE DOOR IN — idempotent. Call it from any face's effect, as often
 * as you like: it connects once, refreshes presence, and re-handshakes
 * only when the token rotated.
 */
export function wireEnsure(
  getToken: () => string | null,
  getPresence?: () => { street: string; status: string }
): void {
  if (typeof window === 'undefined') return
  const token = getToken() ?? null
  if (getPresence) presence = getPresence()

  if (socket && handshakeToken === token) {
    wirePresence()
    return
  }

  // token rotated (or first connect) — the old lane closes honestly
  if (socket) {
    stopPing()
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }

  handshakeToken = token
  setState('connecting')

  const s = io(WIRE_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000, // THE 3s GATE
    timeout: 10_000,
    auth: token ? { token } : {},
  })
  socket = s

  s.on('connect', () => {
    setState('live')
    s.emit('hello', presence)
    // THE CURSOR LAW: whatever flew while we were away, replay it
    if (lastSeq > 0) {
      s.timeout(5000).emit('resume', { since: lastSeq }, (err: unknown, res?: { ok?: boolean; events?: WireFeedEvent[] }) => {
        if (!err && res?.ok && res.events) pushFeed(res.events)
      })
    }
    startPing(s)
  })

  s.on('disconnect', (reason: string) => {
    // the honest lane flip: the relay heartbeat takes over (nothing thrown away)
    setState(reason === 'io client disconnect' || reason === 'io server disconnect' ? 'off' : 'degraded')
  })

  s.io.on('reconnect', () => setState('connecting'))

  s.on('wire:event', (ev: WireFeedEvent) => pushFeed([ev]))

  // W5: the social push lane — forward to every registered listener
  s.on('wire:social', (p: WireSocialPush) => {
    if (p && typeof p.type === 'string') for (const fn of socialPushFns) fn(p)
  })

  // W6: the ledger push lane — a receipt for MY wallet (the receiver's door)
  s.on('wire:ledger', (r: WireLedgerReceipt) => {
    if (r && typeof r.idemKey === 'string') for (const fn of ledgerFns) fn(r)
  })

  // W7: the call push lane — the ring, the accept, the sealed envelopes, the end
  s.on('wire:call', (p: unknown) => {
    if (p && typeof p === 'object' && typeof (p as { type?: unknown }).type === 'string') {
      for (const fn of callFns) fn(p as WireCallPush)
    }
  })

  // W7: the proximity voice lane — a street neighbour joined / left the walkie
  s.on('wire:voice', (p: unknown) => {
    if (p && typeof p === 'object' && typeof (p as { type?: unknown }).type === 'string') {
      for (const fn of voiceFns) fn(p as WireVoicePush)
    }
  })

  // W7: the walkie mesh lane — the street's sealed pv envelopes ride the person
  s.on('wire:pv', (p: unknown) => {
    if (p && typeof p === 'object' && typeof (p as { type?: unknown }).type === 'string') {
      for (const fn of pvFns) fn(p as WirePvPush)
    }
  })

  // W2: the body lane — a same-street walker's 10Hz moment (ephemeral,
  // memory-only; remotenet owns the buffers)
  s.on('wire:pos', (p: WirePosPush) => {
    if (p && typeof p.h === 'string' && typeof p.x === 'number' && typeof p.z === 'number') {
      for (const fn of posFns) fn(p)
    }
  })

  s.on('wire:roster', (r: { scope?: string; roster?: WireRosterRow[] }) => {
    if (r?.roster) useWireStore.setState({ roster: r.roster })
  })

  s.on('wire:welcome', (w: { head?: number }) => {
    // a fresh cursor only when we never saw one (boot); else the resume carries
    if (lastSeq === 0 && typeof w.head === 'number') lastSeq = w.head
  })
}

/** THE OFF-SWITCH — logout/reset/unclaim closes the lane. */
export function wireForget(): void {
  if (socket) {
    stopPing()
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
  handshakeToken = null
  lastSeq = 0
  useWireStore.setState({ state: 'off', feed: [], roster: [], latencyMs: null })
}

/** THE CURRENT CURSOR — the faces and the relay lane can align on it. */
export function wireCursor(): number {
  return lastSeq
}

/* ───────────────────── the send doors (same verdict shapes) ───────────────────── */

export interface WireSendResult {
  ok: boolean
  why?: string
  stripped?: boolean
}

type Ack = { ok?: boolean; why?: string; stripped?: string | boolean; [k: string]: unknown }

/** THE RAW ACK DOOR (W5) — the social-net module rides this for its own
 * server verbs; the chat/emote/dm senders below stay the faces' doors. */
export function wireEmitAck(ev: string, body: Record<string, unknown>): Promise<{ ok: boolean; why?: string; [k: string]: unknown }> {
  return new Promise((resolve) => {
    if (!socket?.connected) return resolve({ ok: false, why: 'wire-down' })
    socket.timeout(5000).emit(ev, body, (err: unknown, res?: Ack) => {
      if (err) return resolve({ ok: false, why: 'wire-slow' })
      if (!res) return resolve({ ok: false, why: 'wire-slow' })
      resolve({ ok: !!res.ok, why: res.why, ...res })
    })
  })
}

/* ── W5: the wire:social push lane — the server prods the person directly
 * (a request landed, a paddy accepted, a hangout postcard arrived). Any
 * module may listen; the social-net store registers the first. ── */
export interface WireSocialPush {
  type: string
  from?: string
  by?: string
  street?: string
  seq?: number
  [k: string]: unknown
}

type SocialPushFn = (p: WireSocialPush) => void
const socialPushFns = new Set<SocialPushFn>()

export function wireOnSocial(fn: SocialPushFn): () => void {
  // registration only — the ensure-time forwarder on the live socket is the
  // ONE listener (a direct socket.on here would double-deliver every push)
  socialPushFns.add(fn)
  return () => {
    socialPushFns.delete(fn)
  }
}

/* ── W6: the ledger push lane — the receiver's wallet learns instantly ── */
export type WireLedgerReceipt = {
  idemKey: string
  ledgerId: number
  kind: string
  from: string
  to: string
  amount: number
  hash: string
  ts: number
}

type LedgerFn = (r: WireLedgerReceipt) => void
const ledgerFns = new Set<LedgerFn>()

export function wireOnLedger(fn: LedgerFn): () => void {
  ledgerFns.add(fn)
  return () => {
    ledgerFns.delete(fn)
  }
}

/* ── W7: the call + proximity push lanes — voicenet registers the first
 * listeners; the shapes are validated by the pure laws it imports. ── */
export type WireCallPush = {
  type: string
  callId?: string
  from?: string
  video?: boolean
  /** W8 — the camera-state envelope ('cam' push): the other ear's truth */
  on?: boolean
  sdp?: string
  candidate?: { candidate: string; sdpMid?: string; sdpMLineIndex?: number }
  why?: string
  [k: string]: unknown
}

type CallFn = (p: WireCallPush) => void
const callFns = new Set<CallFn>()

export function wireOnCall(fn: CallFn): () => void {
  callFns.add(fn)
  return () => {
    callFns.delete(fn)
  }
}

export type WireVoicePush = { type: string; handle?: string; street?: string; [k: string]: unknown }

type VoiceFn = (p: WireVoicePush) => void
const voiceFns = new Set<VoiceFn>()

export function wireOnVoice(fn: VoiceFn): () => void {
  voiceFns.add(fn)
  return () => {
    voiceFns.delete(fn)
  }
}

export type WirePvPush = {
  type: string
  from?: string
  sdp?: string
  candidate?: { candidate: string; sdpMid?: string; sdpMLineIndex?: number }
  [k: string]: unknown
}

type PvFn = (p: WirePvPush) => void
const pvFns = new Set<PvFn>()

export function wireOnPv(fn: PvFn): () => void {
  pvFns.add(fn)
  return () => {
    pvFns.delete(fn)
  }
}

/* ── W2: the body lanes — the 10Hz moment in, the pos tick out. ── */

export type WirePosPush = { h: string; x: number; z: number; hd: number; mv: boolean }

type PosFn = (p: WirePosPush) => void
const posFns = new Set<PosFn>()

export function wireOnPos(fn: PosFn): () => void {
  posFns.add(fn)
  return () => {
    posFns.delete(fn)
  }
}

/** THE POS TICK — fire-and-forget at the 10Hz cadence (an ack per tick
 *  would double the wire for zero honesty; the door's refusals matter only
 *  to a sender misbehaving, and the cap's 'too-fast' is felt as a pause). */
export function wireSendPos(p: { x: number; z: number; hd: number; mv: boolean }): void {
  if (socket?.connected) socket.emit('pos', p)
}

/** THE WHERE DOOR — where does my paddy stand this second? */
export function wireWhere(handle: string): Promise<WireSendResult & { street?: string; x?: number; z?: number; hd?: number; hasPos?: boolean; displayName?: string }> {
  return wireEmitAck('where', { handle }) as Promise<WireSendResult & { street?: string; x?: number; z?: number; hd?: number; hasPos?: boolean; displayName?: string }>
}

/** THE STREET MOVE — the join law landed me beside my paddy; my presence
 *  follows (the next hello/presence carries it; the server's own cap paces). */
export function wireSetStreet(street: string): void {
  presence = { ...presence, street: street.slice(0, 48) || 'home' }
  wirePresence()
}

/** THE CALL SENDERS — thin doors over the raw ack; voicenet owns the
 * sequencing, these just name the server doors. */
export function wireCallRing(to: string, video: boolean): Promise<WireSendResult & { callId?: string }> {
  return wireEmitAck('call:ring', { to, video }) as Promise<WireSendResult & { callId?: string }>
}

export function wireCallSend(ev: 'call:accept' | 'call:decline' | 'call:hangup' | 'call:offer' | 'call:answer' | 'call:ice' | 'call:cam' | 'voice:join' | 'voice:leave' | 'pv:offer' | 'pv:answer' | 'pv:ice', body: Record<string, unknown>): Promise<WireSendResult & { iceServers?: { urls: string }[]; peers?: string[]; street?: string }> {
  return wireEmitAck(ev, body) as Promise<WireSendResult & { iceServers?: { urls: string }[]; peers?: string[]; street?: string }>
}

function emitAck(ev: string, body: Record<string, unknown>): Promise<WireSendResult> {
  return wireEmitAck(ev, body) as Promise<WireSendResult>
}

/** Chat through the fast lane — the server door runs the REAL sanitizeChat. */
export function wireSendChat(text: string, channel = 'global'): Promise<WireSendResult> {
  return emitAck('chat', { channel, text })
}

/** Emote through the fast lane — the kid lexicon rides the wire. */
export function wireSendEmote(emoteId: string, channel = 'global'): Promise<WireSendResult> {
  return emitAck('emote', { channel, emoteId })
}

/** Join the DM room so both online paddies receive live. */
export function wireOpenDm(withHandle: string): void {
  if (socket?.connected) socket.emit('dm:open', { with: withHandle })
}

/** DM through the fast lane — server laws apply; both sides must be on the wire. */
export function wireSendDm(toHandle: string, text: string): Promise<WireSendResult> {
  return emitAck('dm', { to: toHandle, text })
}

/** W5: the hangout postcard — invite a paddy to your street. */
export function wireSendInvite(toHandle: string, street: string): Promise<WireSendResult> {
  return emitAck('social:invite', { to: toHandle, street })
}

/* ── W6: the purse doors (the acks carry the receipt + the fresh balance) ── */

export type WalletAck = {
  ok: boolean
  why?: string
  balance?: number
  transferredToday?: number
  recent?: WireLedgerReceipt[]
  receipt?: WireLedgerReceipt
  replayed?: boolean
}

export function wireWalletState(): Promise<WalletAck> {
  return wireEmitAck('wallet', {}) as Promise<WalletAck>
}

export function wireWalletDeposit(amount: number, idemKey: string): Promise<WalletAck> {
  return wireEmitAck('wallet:deposit', { amount, idemKey }) as Promise<WalletAck>
}

export function wireWalletWithdraw(amount: number, pin: string, idemKey: string): Promise<WalletAck> {
  return wireEmitAck('wallet:withdraw', { amount, pin, idemKey }) as Promise<WalletAck>
}

export function wireWalletTransfer(to: string, amount: number, pin: string, idemKey: string, note?: string): Promise<WalletAck> {
  return wireEmitAck('wallet:transfer', { to, amount, pin, idemKey, note }) as Promise<WalletAck>
}
