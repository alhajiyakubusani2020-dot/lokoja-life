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
  ts: number
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
