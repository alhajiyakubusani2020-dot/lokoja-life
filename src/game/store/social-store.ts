/**
 * LOKOJA LIFE — M24-UI: THE SOCIAL STORE (device truth until the wire)
 * ---------------------------------------------------------------------
 * The client-side home of the new social UI: profile details, friends,
 * requests, blocks, DM threads, unread counts and the call state —
 * everything the M24 UI waves render against BEFORE the server waves
 * (W1 register, W4 wire, W5 connect, W6 ledger) pin it to the relay.
 *
 * LAWS OF THIS FILE:
 *  - THE DEVICE TRUTH LAW: this store persists to localStorage under
 *    `lokoja-life:social:v1`. Every UI that renders it labels the scope
 *    honestly ("on this device"). Nothing here pretends to be server
 *    truth — the relay waves replace the transport, not the shapes.
 *  - THE BLOCK LAW: a blocked handle receives NOTHING — no DM send,
 *    no friend request, no call. The refusal is returned, not silent.
 *  - THE ONE CALL LAW: the phone holds ONE call (the callflow machine
 *    owns the phases); this store just carries it and the ring clock.
 *  - NO FAKE PEOPLE: the call machine never answers itself. A demo
 *    ring exists ONLY behind the e2e/dev door and is labeled "demo".
 */

import { create } from 'zustand'
import {
  answerCall, declineCall, dialCall, freshCallState, hangupCall,
  receiveCall, ringExpired, setMuted, withRingClock,
  type CallState,
} from '../systems/callflow'

export interface DmMsg { id: string; from: 'me' | string; text: string; ts: number }
export interface FriendRequest { handle: string; dir: 'in' | 'out'; ts: number }
export interface SocialProfile { displayName: string; bio: string; vibe: string }

interface SocialPersist {
  friends: string[]
  requests: FriendRequest[]
  blocked: string[]
  dms: Record<string, DmMsg[]>
  unread: Record<string, number>
  profile: SocialProfile
}

const STORAGE_KEY = 'lokoja-life:social:v1'

function freshPersist(): SocialPersist {
  return { friends: [], requests: [], blocked: [], dms: {}, unread: {}, profile: { displayName: '', bio: '', vibe: '🌊' } }
}

function loadPersist(): SocialPersist {
  if (typeof window === 'undefined') return freshPersist()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return freshPersist()
    const p = JSON.parse(raw) as Partial<SocialPersist>
    return {
      friends: Array.isArray(p.friends) ? p.friends : [],
      requests: Array.isArray(p.requests) ? p.requests : [],
      blocked: Array.isArray(p.blocked) ? p.blocked : [],
      dms: p.dms && typeof p.dms === 'object' ? p.dms : {},
      unread: p.unread && typeof p.unread === 'object' ? p.unread : {},
      profile: {
        displayName: typeof p.profile?.displayName === 'string' ? p.profile.displayName : '',
        bio: typeof p.profile?.bio === 'string' ? p.profile.bio : '',
        vibe: typeof p.profile?.vibe === 'string' ? p.profile.vibe : '🌊',
      },
    }
  } catch {
    return freshPersist()
  }
}

function savePersist(p: SocialPersist): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) } catch { /* the flag is honest — storage may refuse */ }
}

interface SocialStore extends SocialPersist {
  call: CallState
  overlayOpen: boolean
  pendingDm: string | null

  /* friends + blocks */
  addFriend: (handle: string) => { ok: boolean; why?: 'self' | 'already' | 'blocked' | 'empty' }
  acceptRequest: (handle: string) => void
  declineRequest: (handle: string) => void
  removeFriend: (handle: string) => void
  blockHandle: (handle: string) => void
  unblockHandle: (handle: string) => void

  /* DMs */
  sendDm: (handle: string, text: string) => { ok: boolean; why?: 'blocked' | 'empty' | 'too-long' }
  receiveDm: (handle: string, text: string) => void
  markDmRead: (handle: string) => void
  setPendingDm: (handle: string | null) => void

  /* profile */
  setProfile: (patch: Partial<SocialProfile>) => void

  /* the call (the callflow machine owns the laws; the store carries it) */
  dial: (peer: string, video: boolean) => { ok: boolean; why?: string }
  incomingDemoCall: (peer: string, video: boolean) => void
  answer: () => void
  decline: () => void
  hangup: () => void
  toggleMute: () => void
  tickCall: (now: number) => void
  clearEnded: () => void

  /* the diegetic layer */
  setOverlayOpen: (open: boolean) => void
}

const DM_MAX = 280

export const useSocialStore = create<SocialStore>((set, get) => {
  const persist = (patch: Partial<SocialPersist>) => {
    const s = get()
    const next: SocialPersist = {
      friends: patch.friends ?? s.friends,
      requests: patch.requests ?? s.requests,
      blocked: patch.blocked ?? s.blocked,
      dms: patch.dms ?? s.dms,
      unread: patch.unread ?? s.unread,
      profile: patch.profile ?? s.profile,
    }
    savePersist(next)
  }
  return {
    ...loadPersist(),
    call: freshCallState(),
    overlayOpen: false,
    pendingDm: null,

    addFriend: (handle) => {
      const h = handle.trim()
      const s = get()
      if (!h) return { ok: false, why: 'empty' }
      if (s.blocked.includes(h)) return { ok: false, why: 'blocked' }
      if (s.friends.includes(h)) return { ok: false, why: 'already' }
      const requests = s.requests.filter((r) => !(r.handle === h && r.dir === 'in'))
      const friends = [...s.friends, h]
      set({ friends, requests })
      persist({ friends, requests })
      return { ok: true }
    },
    acceptRequest: (handle) => {
      const s = get()
      const row = s.requests.find((r) => r.handle === handle && r.dir === 'in')
      if (!row || s.friends.includes(handle)) return
      const requests = s.requests.filter((r) => !(r.handle === handle && r.dir === 'in'))
      const friends = [...s.friends, handle]
      set({ friends, requests })
      persist({ friends, requests })
    },
    declineRequest: (handle) => {
      const requests = get().requests.filter((r) => !(r.handle === handle && r.dir === 'in'))
      set({ requests })
      persist({ requests })
    },
    removeFriend: (handle) => {
      const friends = get().friends.filter((f) => f !== handle)
      set({ friends })
      persist({ friends })
    },
    blockHandle: (handle) => {
      const s = get()
      if (s.blocked.includes(handle)) return
      const blocked = [...s.blocked, handle]
      const friends = s.friends.filter((f) => f !== handle)
      const requests = s.requests.filter((r) => r.handle !== handle)
      set({ blocked, friends, requests })
      persist({ blocked, friends, requests })
    },
    unblockHandle: (handle) => {
      const blocked = get().blocked.filter((b) => b !== handle)
      set({ blocked })
      persist({ blocked })
    },

    sendDm: (handle, text) => {
      const s = get()
      const t = text.trim()
      if (!t) return { ok: false, why: 'empty' }
      if (t.length > DM_MAX) return { ok: false, why: 'too-long' }
      if (s.blocked.includes(handle)) return { ok: false, why: 'blocked' }
      const msg: DmMsg = { id: `dm:${Date.now()}:${Math.floor(Math.random() * 1e5)}`, from: 'me', text: t, ts: Date.now() }
      const dms = { ...s.dms, [handle]: [...(s.dms[handle] ?? []), msg] }
      set({ dms })
      persist({ dms })
      return { ok: true }
    },
    receiveDm: (handle, text) => {
      const s = get()
      const msg: DmMsg = { id: `dm:${Date.now()}:${Math.floor(Math.random() * 1e5)}`, from: handle, text, ts: Date.now() }
      const dms = { ...s.dms, [handle]: [...(s.dms[handle] ?? []), msg] }
      const unread = { ...s.unread, [handle]: (s.unread[handle] ?? 0) + 1 }
      set({ dms, unread })
      persist({ dms, unread })
    },
    markDmRead: (handle) => {
      const s = get()
      if (!s.unread[handle]) return
      const unread = { ...s.unread }
      delete unread[handle]
      set({ unread })
      persist({ unread })
    },
    setPendingDm: (handle) => set({ pendingDm: handle }),

    setProfile: (patch) => {
      const profile = { ...get().profile, ...patch }
      set({ profile })
      persist({ profile })
    },

    dial: (peer, video) => {
      const verdict = dialCall(get().call, peer, video, Date.now())
      if (!verdict.ok) return { ok: false, why: verdict.why }
      set({ call: withRingClock(verdict.next, Date.now()) })
      return { ok: true }
    },
    incomingDemoCall: (peer, video) => {
      const verdict = receiveCall(get().call, peer, video, Date.now())
      if (!verdict.ok) return
      set({ call: withRingClock(verdict.next, Date.now()) })
    },
    answer: () => {
      const verdict = answerCall(get().call, Date.now())
      if (verdict.ok) set({ call: verdict.next })
    },
    decline: () => {
      const verdict = declineCall(get().call, Date.now())
      if (verdict.ok) set({ call: verdict.next })
    },
    hangup: () => {
      const verdict = hangupCall(get().call, Date.now())
      if (verdict.ok) set({ call: verdict.next })
    },
    toggleMute: () => set({ call: setMuted(get().call, !get().call.muted) }),
    tickCall: (now) => {
      const verdict = ringExpired(get().call, now)
      if (verdict.ok) set({ call: verdict.next })
    },
    clearEnded: () => {
      if (get().call.phase === 'ended') set({ call: freshCallState() })
    },

    setOverlayOpen: (open) => set({ overlayOpen: open }),
  }
})
