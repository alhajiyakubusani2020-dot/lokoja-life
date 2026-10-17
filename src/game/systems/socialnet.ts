/**
 * LOKOJA LIFE — M24 W5: THE SOCIAL NET (server truth store)
 * ==========================================================
 * The client home of the NATION's social graph — the FriendRow rows on
 * the server, synced through BOTH lanes with the honest lane law:
 *  - the LIVE WIRE ack when the socket lives (instant);
 *  - the 12s relay door (/api/live/action social-*) when it doesn't
 *    (N10 — two lanes, one nation, nothing hard-crashes).
 *
 * THE DEVICE TRUTH LAW STILL STANDS: the social-store's own arrays stay
 * exactly what they were (device rows, NPC street paddies) — this store
 * holds the SERVER rows beside them, and the faces label which is which.
 * The server wins on the nation graph; the device store never pretends.
 *
 * THE PUSH LAW: the server prods the person directly (wire:social) — a
 * request lands, a paddy accepts, a hangout postcard arrives. This store
 * registers ONE listener at module scope (StrictMode's double-mount
 * cannot double-apply a push: every push is idempotent state, and the
 * request/accepted pushes dedupe by handle).
 *
 * THE TOKEN LAW: the graph is per-account — a token change re-syncs and
 * the previous account's rows never linger.
 */

import { create } from 'zustand'
import { useGameStore } from '../store/useGameStore'
import { wireEmitAck, wireOnSocial, type WireSocialPush } from './wire'
import { SOCIAL_HANDLE_RE, socialNorm } from './socialgraph'

export interface SocialNetGraph {
  friends: { handle: string; since: number }[]
  inReqs: { handle: string; ts: number }[]
  outReqs: { handle: string; ts: number }[]
  blocked: string[]
}

export type SocialNetLane = 'wire' | 'relay' | null

interface SocialNetState {
  syncedAt: number | null
  lane: SocialNetLane
  tokenSeen: string | null
  friends: { handle: string; since: number }[]
  inReqs: { handle: string; ts: number }[]
  outReqs: { handle: string; ts: number }[]
  blocked: string[]
}

export const useSocialNetStore = create<SocialNetState>(() => ({
  syncedAt: null,
  lane: null,
  tokenSeen: null,
  friends: [],
  inReqs: [],
  outReqs: [],
  blocked: [],
}))

function applyGraph(g: SocialNetGraph, lane: SocialNetLane) {
  useSocialNetStore.setState({
    syncedAt: Date.now(),
    lane,
    friends: Array.isArray(g.friends) ? g.friends : [],
    inReqs: Array.isArray(g.inReqs) ? g.inReqs : [],
    outReqs: Array.isArray(g.outReqs) ? g.outReqs : [],
    blocked: Array.isArray(g.blocked) ? g.blocked : [],
  })
}

function token(): string | null {
  return useGameStore.getState().account.token ?? null
}

/* ── the push lane (registered ONCE at module scope) ── */

let pushRegistered = false

export function socialNetInit(): void {
  if (pushRegistered || typeof window === 'undefined') return
  pushRegistered = true
  wireOnSocial((p: WireSocialPush) => {
    const s = useSocialNetStore.getState()
    if (p.type === 'request' && typeof p.from === 'string') {
      if (!s.inReqs.some((r) => r.handle === p.from) && !s.friends.some((f) => f.handle === p.from)) {
        applyGraph(
          { ...s, friends: s.friends, inReqs: [...s.inReqs, { handle: p.from, ts: Date.now() }], outReqs: s.outReqs, blocked: s.blocked },
          s.lane,
        )
      }
    } else if (p.type === 'accepted' && typeof p.by === 'string') {
      if (!s.friends.some((f) => f.handle === p.by)) {
        applyGraph(
          {
            friends: [...s.friends, { handle: p.by, since: Date.now() }],
            inReqs: s.inReqs.filter((r) => r.handle !== p.by),
            outReqs: s.outReqs.filter((r) => r.handle !== p.by),
            blocked: s.blocked,
          },
          s.lane,
        )
      }
    }
  })
}

/* ── the sync (wire first, relay fallback — the honest lane law) ── */

/** THE SELF-HEALING LANE LAW: a graph that landed on the relay lane while
 * the socket was mid-handshake must NOT stay there lying. The sync retries
 * (2.5s backoff, max 5 per flip) until the graph rides the wire — then the
 * retry clock stops. Degraded truth, never a stuck lie. */
const RETRY_MS = 2_500
const RETRY_MAX = 5
let retryTimer: ReturnType<typeof setTimeout> | null = null
let retryCount = 0

function scheduleRetry() {
  if (retryTimer) clearTimeout(retryTimer)
  if (retryCount >= RETRY_MAX) return
  retryCount += 1
  retryTimer = setTimeout(() => {
    retryTimer = null
    void socialNetSync()
  }, RETRY_MS)
}

export async function socialNetSync(): Promise<{ ok: boolean; lane: SocialNetLane; why?: string }> {
  const tok = token()
  if (!tok) {
    if (retryTimer) clearTimeout(retryTimer)
    retryTimer = null
    retryCount = 0
    applyGraph({ friends: [], inReqs: [], outReqs: [], blocked: [] }, null)
    useSocialNetStore.setState({ tokenSeen: null })
    return { ok: false, lane: null, why: 'unclaimed' }
  }
  const seen = useSocialNetStore.getState().tokenSeen
  if (seen !== tok) useSocialNetStore.setState({ tokenSeen: tok })

  // lane 1: the live wire ack
  const w = await wireEmitAck('social:list', {})
  if (w.ok && w.graph) {
    retryCount = 0
    if (retryTimer) clearTimeout(retryTimer)
    retryTimer = null
    applyGraph(w.graph as SocialNetGraph, 'wire')
    return { ok: true, lane: 'wire' }
  }

  // lane 2: the 12s relay door (N10 — the graph survives a dead wire)
  const res = await useGameStore.getState().liveAction('social-list', {})
  if (res.ok && res.graph) {
    applyGraph(res.graph as SocialNetGraph, 'relay')
    // the wire may simply have been mid-handshake — heal toward it
    if (w.why === 'wire-down' || w.why === 'wire-slow') scheduleRetry()
    return { ok: true, lane: 'relay' }
  }
  scheduleRetry()
  return { ok: false, lane: null, why: typeof res.why === 'string' ? res.why : 'offline' }
}

/* ── the action doors (wire ack first, relay fallback, verdicts verbatim) ── */

type NetResult = { ok: boolean; why?: string; state?: string }

async function netAction(wireEvent: string, relayAction: string, payload: Record<string, unknown>): Promise<NetResult> {
  const w = await wireEmitAck(wireEvent, payload)
  if (w.ok) return { ok: true, state: typeof w.state === 'string' ? w.state : undefined }
  if (w.why !== 'wire-down' && w.why !== 'wire-slow') return { ok: false, why: w.why } // a REAL verdict — carry it
  const res = await useGameStore.getState().liveAction(relayAction, payload)
  return res.ok ? { ok: true, state: typeof res.state === 'string' ? res.state : undefined } : { ok: false, why: typeof res.why === 'string' ? res.why : 'offline' }
}

export function socialNetAdd(rawHandle: string): Promise<NetResult> {
  const h = socialNorm(rawHandle)
  if (!SOCIAL_HANDLE_RE.test(h)) return Promise.resolve({ ok: false, why: 'bad-handle' })
  return netAction('social:add', 'social-add', { handle: h }).then(async (r) => {
    if (r.ok) await socialNetSync()
    return r
  })
}

export function socialNetAccept(handle: string): Promise<NetResult> {
  return netAction('social:accept', 'social-accept', { handle }).then(async (r) => {
    if (r.ok) await socialNetSync()
    return r
  })
}

export function socialNetDecline(handle: string): Promise<NetResult> {
  return netAction('social:decline', 'social-decline', { handle }).then(async (r) => {
    if (r.ok) await socialNetSync()
    return r
  })
}

export function socialNetRemove(handle: string): Promise<NetResult> {
  return netAction('social:remove', 'social-remove', { handle }).then(async (r) => {
    if (r.ok) await socialNetSync()
    return r
  })
}

export function socialNetBlock(handle: string): Promise<NetResult> {
  return netAction('social:block', 'social-block', { handle }).then(async (r) => {
    if (r.ok) await socialNetSync()
    return r
  })
}

export function socialNetUnblock(handle: string): Promise<NetResult> {
  return netAction('social:unblock', 'social-unblock', { handle }).then(async (r) => {
    if (r.ok) await socialNetSync()
    return r
  })
}

export function socialNetReport(handle: string, reason: string): Promise<NetResult> {
  return netAction('social:report', 'social-report', { handle, reason })
}

/** DM history from the ONE LiveEvent nation table (server truth for threads). */
export async function socialNetDms(withHandle: string, since = 0): Promise<{ ok: boolean; why?: string; events?: { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[] }> {
  const w = await wireEmitAck('social:dms', { with: withHandle, since })
  if (w.ok) return { ok: true, events: (w.events ?? []) as { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[] }
  if (w.why !== 'wire-down' && w.why !== 'wire-slow') return { ok: false, why: w.why }
  const res = await useGameStore.getState().liveAction('social-dms', { with: withHandle, since })
  return res.ok ? { ok: true, events: (res.events ?? []) as { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[] } : { ok: false, why: typeof res.why === 'string' ? res.why : 'offline' }
}
