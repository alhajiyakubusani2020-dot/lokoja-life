/**
 * LOKOJA LIFE — M24 W7: THE VOICE ENGINE (client media plane)
 * ===========================================================
 * The WebRTC heart of the nation's voice. The PURE laws live in
 * voice.ts (the wire door runs them VERBATIM); this file is the
 * browser side: it owns the microphone, the peer connections and the
 * sequencing of the sealed envelopes.
 *
 * LAWS OF THIS FILE:
 *  - THE RELAY DOCTRINE, client side: signaling rides the wire socket;
 *    the AUDIO flies peer-to-peer (RTCPeerConnection). The wire never
 *    carries media (N5 stays true).
 *  - THE ONE-OFFER LAW (glare kill): for a dialed call the CALLER offers
 *    after the 'accepted' push; the callee only answers. For the street
 *    mesh the alphabetically-LOWEST handle offers — both sides compute
 *    the same polite answer, so nobody double-dials.
 *  - THE ANSWER-IS-THE-OPT-IN LAW: a dialed ring is answered by a human
 *    thumb; nobody answers by themselves (the m24-ui law carried).
 *  - THE MIC TRUTH: getUserMedia is asked ONLY on answer/accept — a
 *    refused mic ends the call honestly with 'no-mic' (local truth;
 *    the wire carries the five shared whys, never my private reasons).
 *  - THE ICE QUEUE LAW: a candidate may land before the remote
 *    description is set (the wire is faster than SDP sometimes) — it
 *    queues and drains in order. Nothing dropped, nothing reordered.
 *  - THE PV PAUSE LAW: the street walkie stands down while a dialed
 *    call is alive — one mouth, one microphone, one conversation.
 *  - THE PV CLEANUP LAW: voice off / wire down / minor wall / logout —
 *    every peer connection closes, every audio element stops. No
 *    phantom mic ever stays open.
 *  - THE ENDED IDEMPOTENCE LAW: 'ended' may arrive twice (my own action
 *    + the wire's echo) — endCallWith refuses the second; cleanup runs
 *    once.
 *  - THE DEBUG HOOK (e2e witness): window.__lklVoice exposes the peer
 *    states and the REAL bytes received — the money shot reads its
 *    numbers, never a fake.
 */

import { useSocialStore } from '../store/social-store'
import {
  wireCallRing,
  wireCallSend,
  wireOnCall,
  wireOnPv,
  wireOnVoice,
  type WireCallPush,
  type WirePvPush,
} from './wire'
import { PV_MESH_MAX } from './voice'

/* ───────────────────────── the shared microphone ───────────────────────── */

let micStream: MediaStream | null = null
let micPromise: Promise<MediaStream> | null = null

/** THE MIC TRUTH — asked once, shared by the call and the walkie. */
function ensureMic(): Promise<MediaStream> {
  if (micStream) return Promise.resolve(micStream)
  if (!micPromise) {
    micPromise = navigator.mediaDevices
      .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false })
      .then((s) => {
        micStream = s
        return s
      })
      .catch((e) => {
        micPromise = null // the next attempt asks again — a later grant must work
        throw e
      })
  }
  return micPromise
}

function releaseMicIfIdle(): void {
  // the walkie and the call share one stream; only a truly idle mic stops
  if (micStream && !currentCall && pvConns.size === 0) {
    for (const t of micStream.getTracks()) t.stop()
    micStream = null
    micPromise = null
  }
}

/* ─────────────────────────── the dialed call ─────────────────────────── */

interface CallConn {
  callId: string
  peer: string
  video: boolean
  pc: RTCPeerConnection | null
  iceServers: { urls: string }[]
  remoteAudio: HTMLAudioElement
  pendingIce: RTCIceCandidateInit[]
  remoteSet: boolean
  endSent: boolean
  iceSent: number
  iceGot: number
  iceErr: number
  iceErrMsg: string
  lastIceGot: string
  signal: string
}

let currentCall: CallConn | null = null
/** the ring that is on my phone RIGHT NOW (the callee's side of the law) */
let lastRing: { callId: string; from: string } | null = null
/** the last dial ack, for the witness's honest eye */
let lastDialAck: { ok: boolean; why?: string; callId?: string; at?: number } | null = null

function mapServerWhy(why?: string): 'busy' | 'no-answer' | 'declined' {
  if (why === 'busy') return 'busy'
  if (why === 'declined') return 'declined'
  // offline / no-such-paddy / blocked / minors / guest — the phone never
  // picked up: the honest card is no-answer (a blocked paddy reads the
  // same as an absent one — the block wall never announces itself)
  return 'no-answer'
}

function makePc(iceServers: { urls: string }[]): RTCPeerConnection {
  return new RTCPeerConnection({
    iceServers: iceServers.length ? iceServers : [{ urls: 'stun:stun.l.google.com:19302' }],
  })
}

function closeConnResources(conn: CallConn): void {
  if (conn.pc) {
    try {
      conn.pc.close()
    } catch {
      /* already closed */
    }
  }
  conn.remoteAudio.pause()
  conn.remoteAudio.srcObject = null
}

/** THE ONE ENDING — idempotent by construction. */
function endLocalCall(why: 'hangup' | 'declined' | 'missed' | 'no-answer' | 'busy' | 'no-mic', notifyWire = true): void {
  const conn = currentCall
  currentCall = null
  if (conn && !conn.endSent && notifyWire) {
    conn.endSent = true
    // the wire's shared whys only — 'no-mic' never crosses
    void wireCallSend('call:hangup', { callId: conn.callId, why: why === 'no-mic' ? 'hangup' : why })
  }
  if (conn) closeConnResources(conn)
  useSocialStore.getState().endFromWire(why)
  releaseMicIfIdle()
}

function hookCallPc(conn: CallConn): void {
  const pc = conn.pc
  if (!pc) return
  pc.onicecandidate = (ev) => {
    if (ev.candidate && !conn.endSent) {
      conn.iceSent++
      // THE FULL ENVELOPE: sdpMid/sdpMLineIndex ride along — Chromium
      // refuses a candidate that carries neither
      void wireCallSend('call:ice', { callId: conn.callId, candidate: ev.candidate.toJSON() })
    }
  }
  pc.ontrack = (ev) => {
    const [stream] = ev.streams
    if (stream && conn.remoteAudio.srcObject !== stream) {
      conn.remoteAudio.srcObject = stream
      void conn.remoteAudio.play().catch(() => {
        /* autoplay waits for the gesture — the answer tap IS the gesture;
           the retry lives on the next track event */
      })
    }
  }
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed') endLocalCall('hangup') // the media wire died — both sides learn
  }
}

async function drainIce(conn: CallConn): Promise<void> {
  const q = conn.pendingIce
  conn.pendingIce = []
  for (const c of q) {
    try {
      await conn.pc?.addIceCandidate(c)
    } catch {
      /* a stale candidate from a previous generation dies quietly */
    }
  }
}

/** CALLER: the accept push landed — mic, pc, offer, send. */
async function callerAfterAccepted(callId: string): Promise<void> {
  if (!currentCall || currentCall.callId !== callId || currentCall.pc) return
  let stream: MediaStream
  try {
    stream = await ensureMic()
  } catch {
    endLocalCall('no-mic')
    return
  }
  if (!currentCall || currentCall.callId !== callId) return // ended while asking
  const pc = makePc(currentCall.iceServers)
  currentCall.pc = pc
  hookCallPc(currentCall)
  for (const t of stream.getAudioTracks()) pc.addTrack(t, stream)
  const offer = await pc.createOffer({ offerToReceiveAudio: true })
  await pc.setLocalDescription(offer)
  const r = await wireCallSend('call:offer', { callId, sdp: pc.localDescription?.sdp ?? '' })
  if (!r.ok && currentCall && currentCall.callId === callId) endLocalCall('hangup')
}

/** CALLEE: the offer landed after my thumb — remote, answer, send. */
async function calleeOnOffer(callId: string, sdp: string): Promise<void> {
  if (!currentCall || currentCall.callId !== callId) return
  if (!currentCall.pc) {
    let stream: MediaStream
    try {
      stream = await ensureMic()
    } catch {
      endLocalCall('no-mic')
      return
    }
    if (!currentCall || currentCall.callId !== callId) return
    const pc = makePc(currentCall.iceServers)
    currentCall.pc = pc
    hookCallPc(currentCall)
    for (const t of stream.getAudioTracks()) pc.addTrack(t, stream)
  }
  const pc = currentCall.pc
  if (!pc) return
  try {
    await pc.setRemoteDescription({ type: 'offer', sdp })
    currentCall.remoteSet = true
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await wireCallSend('call:answer', { callId, sdp: pc.localDescription?.sdp ?? '' })
    await drainIce(currentCall)
  } catch {
    endLocalCall('hangup')
  }
}

/* ─────────────────────── the wire push handler ─────────────────────── */

async function onCallPush(p: WireCallPush): Promise<void> {
  const st = useSocialStore.getState()
  switch (p.type) {
    case 'ring': {
      if (!p.callId) break
      lastRing = { callId: p.callId, from: p.from ?? '' }
      st.incomingWireCall(p.from ?? '', !!p.video)
      if (useSocialStore.getState().call.phase !== 'ringing') {
        // my phone was NOT idle — the machine refused; the caller learns 'busy'
        lastRing = null
        void wireCallSend('call:hangup', { callId: p.callId, why: 'busy' })
      }
      break
    }
    case 'accepted': {
      // caller side: their thumb tapped — THE MACHINE LEARS IT: dialing
      // becomes active (the pure answerCall law allows the dialing phase),
      // then mic, pc, offer, go
      if (currentCall && currentCall.callId === p.callId) {
        useSocialStore.getState().answer()
        await callerAfterAccepted(p.callId)
      }
      break
    }
    case 'offer': {
      if (currentCall && currentCall.callId === p.callId && p.sdp) await calleeOnOffer(p.callId, p.sdp)
      break
    }
    case 'answer': {
      if (currentCall && currentCall.callId === p.callId && p.sdp && currentCall.pc) {
        try {
          await currentCall.pc.setRemoteDescription({ type: 'answer', sdp: p.sdp })
          currentCall.remoteSet = true
          await drainIce(currentCall)
        } catch {
          endLocalCall('hangup')
        }
      }
      break
    }
    case 'ice': {
      if (currentCall && currentCall.callId === p.callId && p.candidate?.candidate) {
        currentCall.iceGot++
        const init: RTCIceCandidateInit = {
          candidate: p.candidate.candidate,
          sdpMid: p.candidate.sdpMid,
          sdpMLineIndex: p.candidate.sdpMLineIndex,
        }
        if (currentCall.pc && currentCall.remoteSet) {
          try {
            currentCall.lastIceGot = (init.candidate ?? '').slice(0, 120)
            currentCall.signal = currentCall.pc.signalingState
            await currentCall.pc.addIceCandidate(init)
          } catch (e) {
            currentCall.iceErr++ // the witness reads this — never a silent lie
            currentCall.iceErrMsg = String((e as Error)?.message ?? e).slice(0, 160)
          }
        } else {
          currentCall.pendingIce.push(init) // THE ICE QUEUE LAW
        }
      }
      break
    }
    case 'ended': {
      if (currentCall && currentCall.callId === p.callId) {
        endLocalCall((p.why as 'hangup' | 'declined' | 'missed' | 'no-answer' | 'busy') ?? 'hangup', false)
      } else if (lastRing?.callId === p.callId) {
        // the ring died before my thumb (the caller cancelled / the sweep)
        lastRing = null
        useSocialStore.getState().endFromWire('missed')
      }
      break
    }
    default:
      break
  }
}

/* ─────────────────────── the public call doors ─────────────────────── */

/** Dial a real paddy through the real wire. The store's pure machine
 *  judges first; the server's dial law judges second; both must say yes. */
export async function voiceDial(peer: string, video: boolean): Promise<{ ok: boolean; why?: string }> {
  if (currentCall) return { ok: false, why: 'busy' }
  const r = useSocialStore.getState().dial(peer, video)
  if (!r.ok) return r
  const ack = await wireCallRing(peer, video)
  lastDialAck = { ok: !!ack.ok, why: ack.why, callId: ack.callId, at: Date.now() }
  if (!ack.ok || !ack.callId) {
    endLocalCall(mapServerWhy(ack.why), false)
    return { ok: false, why: ack.why }
  }
  currentCall = {
    callId: ack.callId,
    peer,
    video,
    pc: null, // built when the accept lands
    iceServers: [],
    remoteAudio: new Audio(),
    pendingIce: [],
    remoteSet: false,
    endSent: false,
    iceSent: 0,
    iceGot: 0,
    iceErr: 0,
    iceErrMsg: '',
    lastIceGot: '',
    signal: '',
  }
  return { ok: true }
}

export async function voiceAnswer(): Promise<void> {
  const st = useSocialStore.getState()
  if (st.call.phase !== 'ringing' || st.call.outgoing || !lastRing) return
  const ring = lastRing
  st.answer() // the machine goes active — the timer starts
  try {
    await ensureMic()
  } catch {
    endLocalCall('no-mic')
    return
  }
  if (useSocialStore.getState().call.phase !== 'active') return // ended while asking
  const ack = await wireCallSend('call:accept', { callId: ring.callId })
  if (!ack.ok) {
    endLocalCall('no-answer', false)
    return
  }
  currentCall = {
    callId: ring.callId,
    peer: ring.from,
    video: st.call.video,
    pc: null, // built when the offer lands
    iceServers: ack.iceServers ?? [],
    remoteAudio: new Audio(),
    pendingIce: [],
    remoteSet: false,
    endSent: false,
    iceSent: 0,
    iceGot: 0,
    iceErr: 0,
    iceErrMsg: '',
    lastIceGot: '',
    signal: '',
  }
  lastRing = null
  // THE PV PAUSE LAW: the walkie stands down for the conversation
  void pvTeardown()
}

export async function voiceDecline(): Promise<void> {
  const st = useSocialStore.getState()
  const phase = st.call.phase
  if (phase === 'active') {
    endLocalCall('hangup')
    return
  }
  if (phase !== 'ringing' && phase !== 'dialing') return
  if (st.call.outgoing) {
    // cancel my own dial — the callee's phone saw a ring that stopped
    endLocalCall('no-answer')
  } else {
    // THE PRE-ANSWER DECLINE LAW: the callee's conn is only built on
    // answer — a decline BEFORE that still owes the wire the truth,
    // and it learns it through the ring that is on the phone
    const ring = lastRing
    lastRing = null
    endLocalCall('declined')
    if (ring) void wireCallSend('call:decline', { callId: ring.callId })
  }
}

export async function voiceHangup(): Promise<void> {
  const st = useSocialStore.getState()
  if (st.call.phase === 'active') {
    endLocalCall('hangup')
    return
  }
  await voiceDecline()
}

export function voiceToggleMute(): void {
  useSocialStore.getState().toggleMute()
  const muted = useSocialStore.getState().call.muted
  if (micStream) for (const t of micStream.getAudioTracks()) t.enabled = !muted
}

/* ─────────────────── the proximity voice (street walkie) ─────────────────── */

interface PvConn {
  handle: string
  pc: RTCPeerConnection
  remoteAudio: HTMLAudioElement
  pendingIce: RTCIceCandidateInit[]
  remoteSet: boolean
  polite: boolean // the alphabetically-higher side is polite: it answers, never offers
}

const pvConns = new Map<string, PvConn>()
let pvActive = false
let pvJoined = false

/** The polite rule needs MY handle — the faces inject the account truth. */
let handleProvider: () => string | null = () => null

export function voiceSetHandleProvider(fn: () => string | null): void {
  handleProvider = fn
}

function hookPvPc(conn: PvConn): void {
  conn.pc.onicecandidate = (ev) => {
    if (ev.candidate && pvActive) {
      void wireCallSend('pv:ice', { to: conn.handle, candidate: ev.candidate.toJSON() })
    }
  }
  conn.pc.ontrack = (ev) => {
    const [stream] = ev.streams
    if (stream && conn.remoteAudio.srcObject !== stream) {
      conn.remoteAudio.srcObject = stream
      void conn.remoteAudio.play().catch(() => {})
    }
  }
  conn.pc.onconnectionstatechange = () => {
    if (conn.pc.connectionState === 'failed' || conn.pc.connectionState === 'closed') pvDrop(conn.handle)
  }
}

async function pvDial(handle: string): Promise<void> {
  if (!pvActive || pvConns.has(handle) || pvConns.size >= PV_MESH_MAX) return
  let stream: MediaStream
  try {
    stream = await ensureMic()
  } catch {
    return // the walkie stays silent — the dialed-call path owns the mic error UI
  }
  const pc = makePc([])
  const conn: PvConn = { handle, pc, remoteAudio: new Audio(), pendingIce: [], remoteSet: false, polite: false }
  pvConns.set(handle, conn)
  hookPvPc(conn)
  for (const t of stream.getAudioTracks()) pc.addTrack(t, stream)
  const offer = await pc.createOffer({ offerToReceiveAudio: true })
  await pc.setLocalDescription(offer)
  const r = await wireCallSend('pv:offer', { to: handle, sdp: pc.localDescription?.sdp ?? '' })
  if (!r.ok) pvDrop(handle)
}

async function pvOnOffer(from: string, sdp: string): Promise<void> {
  if (!pvActive) return
  if (currentCall) return // THE PV PAUSE LAW
  const me = handleProvider() ?? ''
  let conn = pvConns.get(from)
  if (!conn) {
    if (pvConns.size >= PV_MESH_MAX) return
    let stream: MediaStream
    try {
      stream = await ensureMic()
    } catch {
      return
    }
    const pc = makePc([])
    conn = { handle: from, pc, remoteAudio: new Audio(), pendingIce: [], remoteSet: false, polite: me > from }
    pvConns.set(from, conn)
    hookPvPc(conn)
    for (const t of stream.getAudioTracks()) pc.addTrack(t, stream)
  }
  if (conn.pc.signalingState === 'have-local-offer' && conn.polite) {
    // glare, resolved the polite way: my offer loses, theirs wins
    try {
      const rollback = conn.pc as RTCPeerConnection & { createRollback?: () => Promise<RTCSessionDescriptionInit> }
      if (rollback.createRollback) await conn.pc.setLocalDescription(await rollback.createRollback())
    } catch {
      /* rollback unsupported — the impolite side simply retries */
    }
  }
  try {
    await conn.pc.setRemoteDescription({ type: 'offer', sdp })
    conn.remoteSet = true
    const answer = await conn.pc.createAnswer()
    await conn.pc.setLocalDescription(answer)
    await wireCallSend('pv:answer', { to: from, sdp: conn.pc.localDescription?.sdp ?? '' })
    await pvDrainIce(conn)
  } catch {
    pvDrop(from)
  }
}

async function pvOnAnswer(from: string, sdp: string): Promise<void> {
  const conn = pvConns.get(from)
  if (!conn || conn.remoteSet) return
  try {
    await conn.pc.setRemoteDescription({ type: 'answer', sdp })
    conn.remoteSet = true
    await pvDrainIce(conn)
  } catch {
    pvDrop(from)
  }
}

async function pvDrainIce(conn: PvConn): Promise<void> {
  const q = conn.pendingIce
  conn.pendingIce = []
  for (const c of q) {
    try {
      await conn.pc.addIceCandidate(c)
    } catch {
      /* stale */
    }
  }
}

function pvDrop(handle: string): void {
  const conn = pvConns.get(handle)
  if (!conn) return
  pvConns.delete(handle)
  try {
    conn.pc.close()
  } catch {
    /* already closed */
  }
  conn.remoteAudio.pause()
  conn.remoteAudio.srcObject = null
  releaseMicIfIdle()
}

async function pvTeardown(): Promise<void> {
  if (pvJoined) {
    pvJoined = false
    void wireCallSend('voice:leave', {})
  }
  pvActive = false
  for (const h of [...pvConns.keys()]) pvDrop(h)
  releaseMicIfIdle()
}

/** THE PROXIMITY SYNC — call whenever the walkie's inputs change: the
 *  voiceOn toggle, the band, the wire state, a dialed call. */
export async function pvSync(opts: { voiceOn: boolean; adult: boolean; wireLive: boolean }): Promise<void> {
  const want = opts.voiceOn && opts.adult && opts.wireLive && !currentCall
  if (want && !pvActive) {
    pvActive = true
    const r = await wireCallSend('voice:join', {})
    pvJoined = !!r.ok
    if (r.ok && Array.isArray(r.peers)) {
      const me = handleProvider() ?? ''
      for (const p of r.peers as string[]) {
        // THE ONE-OFFER LAW: only the alphabetically-lowest handle offers
        if (me && me < p) void pvDial(p)
      }
    }
  } else if (!want && pvActive) {
    await pvTeardown()
  }
}

function onVoicePush(p: { type: string; handle?: string }): void {
  if (!pvActive || !p.handle) return
  const me = handleProvider() ?? ''
  if (p.handle === me) return
  if (p.type === 'joined') {
    if (me < p.handle) void pvDial(p.handle) // the polite rule decides
  } else if (p.type === 'left') {
    pvDrop(p.handle)
  }
}

/** THE WALKIE MESH — the sealed pv envelopes land here: offer builds
 *  (or joins) the peer, answer closes the handshake, ICE queues like
 *  every candidate before its remote description. */
async function onPvPush(p: WirePvPush): Promise<void> {
  if (!p.from) return
  if (p.type === 'pv-offer' && p.sdp) {
    await pvOnOffer(p.from, p.sdp)
  } else if (p.type === 'pv-answer' && p.sdp) {
    await pvOnAnswer(p.from, p.sdp)
  } else if (p.type === 'pv-ice' && p.candidate?.candidate) {
    const conn = pvConns.get(p.from)
    if (!conn) return
    const init: RTCIceCandidateInit = {
      candidate: p.candidate.candidate,
      sdpMid: p.candidate.sdpMid,
      sdpMLineIndex: p.candidate.sdpMLineIndex,
    }
    if (conn.remoteSet) {
      try {
        await conn.pc.addIceCandidate(init)
      } catch {
        /* stale generation */
      }
    } else {
      conn.pendingIce.push(init) // THE ICE QUEUE LAW, walkie edition
    }
  }
}

/* ─────────────────────────── the boot (once) ─────────────────────────── */

let booted = false

/** THE ONE BOOT — the first face that imports voicenet registers the
 *  push lanes and the ended-truth watcher. Idempotent by construction. */
export function voiceInit(): void {
  if (booted || typeof window === 'undefined') return
  booted = true

  wireOnCall((p) => {
    void onCallPush(p)
  })
  wireOnVoice((p) => onVoicePush(p))
  wireOnPv((p) => {
    void onPvPush(p)
  })

  // THE ENDED WATCHER: any path that ends the call through the pure
  // machine (the 30s timeout law, the UI doors) still owes the wire its
  // hangup — this subscription owes it exactly once.
  let lastPhase = useSocialStore.getState().call.phase
  useSocialStore.subscribe((s) => {
    const now = s.call.phase
    const prev = lastPhase
    lastPhase = now
    if (now === 'ended' && prev !== 'ended' && currentCall && !currentCall.endSent) {
      const why = s.call.endedWhy ?? 'hangup'
      currentCall.endSent = true
      void wireCallSend('call:hangup', { callId: currentCall.callId, why: why === 'no-mic' ? 'hangup' : why })
      const conn = currentCall
      currentCall = null
      closeConnResources(conn)
      releaseMicIfIdle()
    }
  })

  // THE DEBUG HOOK (the e2e witness reads REAL numbers)
  const w = window as unknown as { __lklVoice?: unknown; __lklVoiceDebug?: () => unknown }
  w.__lklVoiceDebug = () => {
    const s = useSocialStore.getState()
    return {
      phase: s.call.phase,
      peer: s.call.peer,
      outgoing: s.call.outgoing,
      endedWhy: s.call.endedWhy,
      demo: s.callDemo,
      ring: lastRing?.callId ?? null,
      hasConn: !!currentCall,
      lastDial: lastDialAck,
    }
  }
  w.__lklVoice = {
    call: () =>
      currentCall
        ? {
            callId: currentCall.callId,
            peer: currentCall.peer,
            pc: currentCall.pc?.connectionState ?? 'none',
            gathering: currentCall.pc?.iceGatheringState ?? 'none',
            iceSent: currentCall.iceSent,
            iceGot: currentCall.iceGot,
            iceErr: currentCall.iceErr,
            iceErrMsg: currentCall.iceErrMsg,
            queued: currentCall.pendingIce.length,
            lastIceGot: currentCall.lastIceGot,
            signal: currentCall.signal || currentCall.pc?.signalingState,
            remoteSet: currentCall.remoteSet,
          }
        : null,
    pv: () => [...pvConns.keys()],
    pairs: async (): Promise<{ type: string; addr?: string; port?: number; ctype?: string; state?: string; selected?: boolean }[]> => {
      const out: { type: string; addr?: string; port?: number; ctype?: string; state?: string; selected?: boolean }[] = []
      const pcs: RTCPeerConnection[] = []
      if (currentCall?.pc) pcs.push(currentCall.pc)
      for (const c of pvConns.values()) pcs.push(c.pc)
      for (const pc of pcs) {
        const rep = await pc.getStats()
        rep.forEach((s) => {
          const r = s as unknown as { type?: string; state?: string; address?: string; port?: number; candidateType?: string; selected?: boolean }
          if (r.type === 'local-candidate' || r.type === 'remote-candidate') {
            out.push({ type: r.type, addr: r.address, port: r.port, ctype: r.candidateType })
          }
          if (r.type === 'candidate-pair') out.push({ type: 'pair', state: r.state, selected: r.selected })
        })
      }
      return out
    },
    stats: async (): Promise<{ rx: number; tx: number }> => {
      let rx = 0
      let tx = 0
      const pcs: RTCPeerConnection[] = []
      if (currentCall?.pc) pcs.push(currentCall.pc)
      for (const c of pvConns.values()) pcs.push(c.pc)
      for (const pc of pcs) {
        const rep = await pc.getStats()
        rep.forEach((s) => {
          const r = s as unknown as {
            type?: string
            kind?: string
            bytesReceived?: number
            bytesSent?: number
          }
          if (r.type === 'inbound-rtp' && r.kind === 'audio' && typeof r.bytesReceived === 'number') rx += r.bytesReceived
          if (r.type === 'outbound-rtp' && r.kind === 'audio' && typeof r.bytesSent === 'number') tx += r.bytesSent
        })
      }
      return { rx, tx }
    },
  }
}
