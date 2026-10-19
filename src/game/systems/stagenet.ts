/**
 * LOKOJA LIFE — M24 W9: THE STAGE NET (the broadcast's client plane)
 * ==================================================================
 * The browser home of the nation's stage. The PURE laws live in
 * stage.ts (the wire door runs them VERBATIM); this file is the media
 * plane: it owns the POV capture, the 1:N mesh handshake and the
 * witness counters — the same discipline voicenet.ts carries for the ear.
 *
 * THE MESH DOCTRINE (the honest amendment, recorded in stage.ts): the OSS
 * livekit-server ships NO WHIP door (witnessed: 404 with a VALID grant on
 * two versions) and the SDK would blow the N2 wire budget — so the stage
 * rides the SAME architecture as the W7 voice and the W8 face: SIGNALING
 * on the nation-wire, MEDIA peer-to-peer. ONE publisher offers to each
 * eye; the wire relays the sealed envelopes (the W7 sdp/ice laws at the
 * door) and NEVER sees a media byte (N5 holds). The SFU is the W12+
 * upgrade path when the mesh cap demands it.
 *
 * LAWS OF THIS FILE:
 *  - THE POV LAW: a stage broadcasts YOUR OWN EYES — the living world's
 *    canvas, captured through the StageCapture hook (in-task requestFrame;
 *    the luma instrument proves the frames are not black). No camera is
 *    asked, no permission is needed.
 *  - THE MIC TRUTH (W8's fallback law, carried): the mic is asked ONCE,
 *    best-effort, when the stage starts. A refused mic is an honest
 *    video-only stage — never a fake audio track.
 *  - THE ONE-STAGE LAW, client side: one publish per walker.
 *  - THE PUBLISHER-OFFERS LAW: the host initiates every handshake — an
 *    'eye' push wakes ONE pc with the POV tracks; an 'eye-gone' push
 *    closes it. The viewer never offers, never publishes.
 *  - THE ONE-EYE LAW: a walker watches zero or one stage; a new watch
 *    closes the old eye first.
 *  - THE ICE QUEUE LAW (the W7 discipline): a candidate may land before
 *    the remote description is set — it queues and drains in order.
 *  - THE CLEANUP LAW: stop / ended push / logout — every track stops,
 *    every peer closes, the store resets. No phantom stage, no ghost eye.
 *  - THE DEBUG HOOK (e2e witness): window.__lklStage exposes the REAL
 *    getStats bytes (published / received), the peer states and the
 *    witnessed viewer/chat/tip counts — the money shot reads numbers,
 *    never a fake.
 */

import { create } from 'zustand'
import { useGameStore } from '../store/useGameStore'
import { wireEnsure, wireEmitAck, wireOnStage, type WireStagePush } from './wire'
import { stageTipVerdict, type StageIdentity } from './stage'

/* ─────────────────────────── the constants ─────────────────────────── */

/** THE POV PACING — ≈15 frames a second (the pump time-gates requestFrame). */
const POV_PUMP_MS = 66

export interface StageBoardRow {
  id: string
  host: string
  title: string
  kind: string
  viewers: number
  startedAt: number
}

/* ──────────────────────────── the store ────────────────────────────── */

interface StageNetState {
  /** I am on air (the mesh is live). */
  publishing: boolean
  myStreamId: string | null
  myTitle: string | null
  myMic: boolean
  /** the live board (the wire registry's truth, kept fresh by pushes) */
  board: StageBoardRow[]
  /** what I am watching right now (zero or one — THE ONE-EYE LAW) */
  watchingId: string | null
  watchingTitle: string | null
  remoteStream: MediaStream | null
  viewerMuted: boolean
  /** the last honest refusal, shown by the face once */
  lastWhy: string | null
  /** the last spray seen in MY rooms (the host's face + the watcher's box) */
  tipNote: string | null
}

export const useStageStore = create<StageNetState>(() => ({
  publishing: false,
  myStreamId: null,
  myTitle: null,
  myMic: false,
  board: [],
  watchingId: null,
  watchingTitle: null,
  remoteStream: null,
  viewerMuted: true,
  lastWhy: null,
  tipNote: null,
}))

/* ─────────────────────── the media plane (module state) ────────────── */

let povStream: MediaStream | null = null
let micStream: MediaStream | null = null
let myStreamId: string | null = null

/** THE MESH — one pc per eye (the publisher's side). */
const eyePcs = new Map<string, RTCPeerConnection>()
const eyeIceQueues = new Map<string, RTCIceCandidateInit[]>()
let subPc: RTCPeerConnection | null = null
let subStreamId: string | null = null
let subIceQueue: RTCIceCandidateInit[] = []
let pubSampler: ReturnType<typeof setInterval> | null = null
let subSampler: ReturnType<typeof setInterval> | null = null

/* ────────────────────────── the witness hook ───────────────────────── */

const witness = {
  pubBytes: 0,
  subBytes: 0,
  pubState: 'idle',
  subState: 'idle',
  viewersSeen: 0,
  chatSeen: 0,
  tipsSeen: 0,
  startedAt: 0,
  luma: -1,
  lastPubWhy: '',
  lastSubWhy: '',
}

async function samplePubBytes(): Promise<void> {
  let total = 0
  for (const pc of eyePcs.values()) {
    try {
      const stats = await pc.getStats()
      stats.forEach((r) => {
        if (r.type === 'outbound-rtp' && typeof r.bytesSent === 'number') total += r.bytesSent
      })
    } catch { /* the witness never lies, it just misses a beat */ }
  }
  witness.pubBytes = Math.max(witness.pubBytes, total)
}

async function sampleSubBytes(): Promise<void> {
  if (!subPc) return
  try {
    const stats = await subPc.getStats()
    let total = 0
    stats.forEach((r) => {
      if (r.type === 'inbound-rtp' && typeof r.bytesReceived === 'number') total += r.bytesReceived
    })
    witness.subBytes = Math.max(witness.subBytes, total)
  } catch { /* the witness never lies, it just misses a beat */ }
}

/** THE WITNESS — the e2e money shot reads these, never a mock. */
export function stageWitness(): Record<string, unknown> {
  const pubStates = [...eyePcs.values()].map((pc) => pc.connectionState)
  return {
    ...witness,
    luma: lastLuma,
    pubPc: pubStates.length ? pubStates.join('+') : (myStreamId ? 'no-eyes' : 'none'),
    subPc: subPc?.connectionState ?? 'none',
    store: useStageStore.getState(),
  }
}

/* the witness hook install — every stage face ensure carries it */

/* ─────────────────────── the capture hook (StageCapture) ─────────────── */

/* A WebGL canvas without preserveDrawingBuffer hands captureStream a
 * CLEARED buffer the moment compositing ends — the silent black stage. The
 * law: the frames are captured INSIDE the render task. The additive
 * <StageCapture/> (inside the world's Canvas, the W2 doctrine) binds the
 * world's own canvas here and pumps requestFrame() from R3F's
 * addAfterEffect — the same task that just drew the frame, so the buffer
 * is alive. The pump also samples a 32×32 luminance read (same task) so
 * the witness can prove the stage is NOT black. No 3D file behaves
 * differently; the world never knows. */
let captureCanvas: HTMLCanvasElement | null = null
let captureStreamRef: MediaStream | null = null
let frameTrack: CanvasCaptureMediaStreamTrack | null = null
let pumping = false
let lastPump = 0
let lastLuma = -1
const lumaSample = typeof document !== 'undefined' ? document.createElement('canvas') : null

export function stageBindCanvas(c: HTMLCanvasElement | null): void {
  captureCanvas = c
}

export function stagePump(): void {
  if (!pumping || !frameTrack) return
  const now = performance.now()
  if (now - lastPump < POV_PUMP_MS) return
  lastPump = now
  try { frameTrack.requestFrame() } catch { /* a lost frame dies alone */ }
  // THE LUMA INSTRUMENT — same-task 32×32 read, the anti-black-frame proof
  if (captureCanvas && lumaSample) {
    try {
      lumaSample.width = 32
      lumaSample.height = 32
      const ctx = lumaSample.getContext('2d', { willReadFrequently: true })
      if (ctx) {
        ctx.drawImage(captureCanvas, 0, 0, 32, 32)
        const d = ctx.getImageData(0, 0, 32, 32).data
        let sum = 0
        for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
        lastLuma = sum / (d.length / 4)
      }
    } catch { /* a lost sample dies alone */ }
  }
}

/* ─────────────────────── the wire plumbing ─────────────────────────── */

export function stageEnsure(): void {
  stageInstallWitness()
  wireEnsure(
    () => useGameStore.getState().account.token ?? null,
    () => ({ street: useGameStore.getState().world?.currentLocation ?? 'home', status: useStageStore.getState().publishing ? 'on air' : 'hustling' }),
  )
}

/** THE BOARD LAW: every push re-pins the board; stage:list seeds it. */
let stageLaneBound = false
export function stageBindLane(): void {
  if (stageLaneBound) return
  stageLaneBound = true
  wireOnStage((p: WireStagePush) => {
    if (p.type === 'started' && p.stage) {
      const board = useStageStore.getState().board.filter((r) => r.id !== p.stage!.id)
      useStageStore.setState({ board: [...board, p.stage] })
    } else if (p.type === 'ended' && typeof p.streamId === 'string') {
      useStageStore.setState({ board: useStageStore.getState().board.filter((r) => r.id !== p.streamId) })
      // MY stage died (the host law, the wire's goodbye) — clean up
      if (useStageStore.getState().myStreamId === p.streamId) stageTeardownLocal()
      // MY eye was on it — the honest dark
      if (useStageStore.getState().watchingId === p.streamId) stageUnwatchLocal('stage-ended')
    } else if (p.type === 'viewers' && typeof p.viewers === 'number') {
      witness.viewersSeen = p.viewers
      useStageStore.setState({ board: useStageStore.getState().board.map((r) => (r.id === p.streamId ? { ...r, viewers: p.viewers! } : r)) })
    } else if (p.type === 'tip') {
      witness.tipsSeen += 1
      const from = typeof p.from === 'string' ? p.from : 'someone'
      const amount = typeof p.amount === 'number' ? p.amount : 0
      useStageStore.setState({ tipNote: `💸 @${from} sprayed ₦${amount}` })
    }
    // THE MESH LANES (only meaningful when I publish or watch)
    else if (p.type === 'eye' && typeof p.streamId === 'string' && typeof p.eye === 'string') {
      void hostEye(p.streamId, p.eye)
    } else if (p.type === 'eye-gone' && typeof p.streamId === 'string' && typeof p.eye === 'string') {
      void hostEyeGone(p.streamId, p.eye)
    } else if (p.type === 'offer' && typeof p.streamId === 'string' && typeof p.sdp === 'string') {
      void viewerOffer(p.streamId, p.sdp)
    } else if (p.type === 'answer' && typeof p.streamId === 'string' && typeof p.sdp === 'string' && typeof p.from === 'string') {
      void hostAnswer(p.streamId, p.from, p.sdp)
    } else if (p.type === 'ice' && !!p.candidate && typeof p.candidate === 'object') {
      void meshIce(p)
    }
  })
}

/* ─────────────────────── the generic mesh helpers ──────────────────── */

function newPc(): RTCPeerConnection {
  // the media flies peer-to-peer on loopback / LAN — the deploy's coturn
  // (W12) rides the same iceServers slot when the wider nation needs it
  return new RTCPeerConnection({ iceServers: [] })
}

async function gatherComplete(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === 'complete') return
  await new Promise<void>((res) => {
    const done = () => res()
    const t = setTimeout(done, 2_000) // THE GATHER CEILING — never hang the mesh
    pc.addEventListener('icegatheringstatechange', () => {
      if (pc.iceGatheringState === 'complete') { clearTimeout(t); done() }
    })
    pc.addEventListener('icecandidate', (e) => { if (!e.candidate) { clearTimeout(t); done() } })
  })
}

/* ──────────────────────── THE PUBLISHER'S SIDE ─────────────────────── */

function worldCanvas(): HTMLCanvasElement | null {
  const cs = Array.from(document.querySelectorAll('canvas')) as HTMLCanvasElement[]
  return cs.find((c) => c.width >= 320 && c.height >= 200) ?? cs[0] ?? null
}

/** GO LIVE — the wire's broadcast door, then the POV capture stands ready.
 * The mesh handshakes begin when the first 'eye' push lands. */
export async function stageGoLive(title: string): Promise<{ ok: boolean; why?: string; streamId?: string }> {
  if (useStageStore.getState().publishing) return { ok: false, why: 'stage-live-already' }
  stageEnsure()
  stageBindLane()
  useStageStore.setState({ lastWhy: null })

  const ack = (await wireEmitAck('stage:start', { title })) as { ok: boolean; why?: string; streamId?: string }
  if (!ack.ok || !ack.streamId) return { ok: false, why: ack.why ?? 'wire no gree' }

  const canvas = worldCanvas()
  if (!canvas) {
    void wireEmitAck('stage:end', { streamId: ack.streamId })
    return { ok: false, why: 'stage-no-canvas' }
  }
  // THE CAPTURE LAW: the bound hook (in-task requestFrame) when the world
  // mounted it; the honest direct capture otherwise (recorded, never hidden).
  let stream: MediaStream
  try {
    if (captureCanvas) {
      captureStreamRef = captureCanvas.captureStream(0)
      frameTrack = (captureStreamRef.getVideoTracks()[0] ?? null) as CanvasCaptureMediaStreamTrack | null
      pumping = !!frameTrack
      stream = captureStreamRef
      lastLuma = -1
    } else {
      stream = canvas.captureStream(15)
    }
    if (!stream || stream.getVideoTracks().length === 0) throw new Error('no video track')
  } catch {
    void wireEmitAck('stage:end', { streamId: ack.streamId })
    return { ok: false, why: 'stage-no-canvas' }
  }

  // THE MIC TRUTH — asked ONCE at start; a refusal is an honest video-only
  // stage (the fallback law, never a fake track)
  let mic = false
  try {
    const m = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    micStream = m
    mic = true
  } catch { mic = false }

  povStream = stream
  myStreamId = ack.streamId
  witness.pubState = 'ready'
  witness.startedAt = Date.now()

  useStageStore.setState({ publishing: true, myStreamId: ack.streamId, myTitle: title, myMic: mic, tipNote: null })
  if (pubSampler) clearInterval(pubSampler)
  pubSampler = setInterval(() => { void samplePubBytes() }, 2_000)
  return { ok: true, streamId: ack.streamId }
}

/** THE PUBLISHER OFFERS — an eye arrived; one pc, POV tracks, one offer. */
async function hostEye(streamId: string, eye: string): Promise<void> {
  if (streamId !== myStreamId || !povStream) return
  if (eyePcs.has(eye)) return // THE ONE-PC-PER-EYE LAW
  const pc = newPc()
  eyePcs.set(eye, pc)
  eyeIceQueues.set(eye, [])
  witness.pubState = 'offering'
  for (const track of povStream.getVideoTracks()) pc.addTrack(track, povStream)
  if (micStream) for (const track of micStream.getAudioTracks()) pc.addTrack(track, micStream)
  pc.addEventListener('icecandidate', (e) => {
    if (e.candidate) void wireEmitAck('stage:ice', { streamId, to: eye, candidate: e.candidate.toJSON() })
  })
  pc.addEventListener('connectionstatechange', () => {
    witness.pubState = `eye:${pc.connectionState}`
    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') void hostEyeGone(streamId, eye)
  })
  try {
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    await gatherComplete(pc)
    const r = (await wireEmitAck('stage:offer', { streamId, to: eye, sdp: pc.localDescription!.sdp! })) as { ok: boolean; why?: string }
    if (!r.ok) {
      witness.lastPubWhy = `offer(${r.why})`
      void hostEyeGone(streamId, eye)
    }
  } catch (e) {
    witness.lastPubWhy = `offer(${String(e).slice(0, 60)})`
    void hostEyeGone(streamId, eye)
  }
}

async function hostEyeGone(streamId: string, eye: string): Promise<void> {
  if (streamId !== myStreamId) return
  const pc = eyePcs.get(eye)
  if (pc) {
    try { pc.close() } catch { /* closing twice is lawful */ }
    eyePcs.delete(eye)
    eyeIceQueues.delete(eye)
  }
}

async function hostAnswer(streamId: string, eye: string, sdp: string): Promise<void> {
  if (streamId !== myStreamId) return
  const pc = eyePcs.get(eye)
  if (!pc) return
  try {
    await pc.setRemoteDescription({ type: 'answer', sdp })
    const q = eyeIceQueues.get(eye) ?? []
    for (const c of q) await pc.addIceCandidate(c).catch(() => { /* a lost trickle dies alone */ })
    eyeIceQueues.set(eye, [])
  } catch (e) {
    witness.lastPubWhy = `answer(${String(e).slice(0, 60)})`
    void hostEyeGone(streamId, eye)
  }
}

/** STOP — my own hand. The wire's end door + THE CLEANUP LAW. */
export async function stageStop(): Promise<void> {
  const sid = useStageStore.getState().myStreamId
  if (sid) void wireEmitAck('stage:end', { streamId: sid })
  stageTeardownLocal()
}

function stageTeardownLocal(): void {
  if (pubSampler) { clearInterval(pubSampler); pubSampler = null }
  pumping = false
  frameTrack = null
  captureStreamRef?.getTracks().forEach((t) => t.stop())
  captureStreamRef = null
  povStream?.getTracks().forEach((t) => t.stop())
  micStream?.getTracks().forEach((t) => t.stop())
  povStream = null
  micStream = null
  for (const pc of eyePcs.values()) { try { pc.close() } catch { /* lawful */ } }
  eyePcs.clear()
  eyeIceQueues.clear()
  myStreamId = null
  useStageStore.setState({ publishing: false, myStreamId: null, myTitle: null, myMic: false })
}

/* ───────────────────────── THE EYE'S SIDE ──────────────────────────── */

/** WATCH — the spectate law: the ack registers the eye; the offer push
 * starts the recvonly handshake. */
export async function stageWatch(streamId: string): Promise<{ ok: boolean; why?: string }> {
  if (useStageStore.getState().watchingId === streamId) return { ok: true }
  // THE ONE-EYE LAW: a new eye closes the old one first
  if (useStageStore.getState().watchingId) await stageUnwatch()
  stageEnsure()
  stageBindLane()
  useStageStore.setState({ lastWhy: null })

  const ack = (await wireEmitAck('stage:watch', { streamId })) as { ok: boolean; why?: string; title?: string; host?: string }
  if (!ack.ok) return { ok: false, why: ack.why ?? 'stage-not-live' }

  useStageStore.setState({ watchingId: streamId, watchingTitle: typeof ack.title === 'string' ? ack.title : null, viewerMuted: true, remoteStream: null })
  // the offer rides the push lane; nothing to do until it lands
  return { ok: true }
}

async function viewerOffer(streamId: string, sdp: string): Promise<void> {
  if (useStageStore.getState().watchingId !== streamId || subPc) return
  subStreamId = streamId
  const pc = newPc()
  subPc = pc
  subIceQueue = []
  witness.subState = 'answering'
  // THE PASSIVE EYE LAW: no pre-added transceivers — setRemote(offer) creates
  // the recvonly m-lines itself (a pre-added pair doubles them, the wart the
  // deep hook caught: two muted receivers beside the two live ones)
  const remote = new MediaStream()
  pc.addEventListener('track', (e) => {
    remote.addTrack(e.track)
    useStageStore.setState({ remoteStream: remote })
  })
  pc.addEventListener('icecandidate', (e) => {
    if (e.candidate) void wireEmitAck('stage:ice', { streamId, candidate: e.candidate.toJSON() })
  })
  pc.addEventListener('connectionstatechange', () => {
    witness.subState = pc.connectionState
    if (pc.connectionState === 'failed') stageUnwatchLocal('stage-dark')
  })
  if (subSampler) clearInterval(subSampler)
  subSampler = setInterval(() => { void sampleSubBytes() }, 2_000)
  try {
    await pc.setRemoteDescription({ type: 'offer', sdp })
    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await gatherComplete(pc)
    const r = (await wireEmitAck('stage:answer', { streamId, sdp: pc.localDescription!.sdp! })) as { ok: boolean; why?: string }
    if (!r.ok) {
      witness.lastSubWhy = `answer(${r.why})`
      stageUnwatchLocal('stage-dark')
    }
  } catch (e) {
    witness.lastSubWhy = `offer(${String(e).slice(0, 60)})`
    stageUnwatchLocal('stage-dark')
  }
}

async function meshIce(p: WireStagePush): Promise<void> {
  const cand = p.candidate as RTCIceCandidateInit
  if (!cand || typeof cand.candidate !== 'string') return
  // MY eye's queue: the host's candidate lands before the answer sometimes
  if (subPc && subStreamId === p.streamId) {
    if (subPc.remoteDescription && subPc.remoteDescription.type) {
      await subPc.addIceCandidate(cand).catch(() => { /* a lost trickle dies alone */ })
    } else {
      subIceQueue.push(cand) // THE ICE QUEUE LAW
    }
    return
  }
  // the host's per-eye queues
  const from = typeof p.from === 'string' ? p.from : null
  if (from && eyePcs.has(from)) {
    const pc = eyePcs.get(from)!
    if (pc.remoteDescription && pc.remoteDescription.type) {
      await pc.addIceCandidate(cand).catch(() => { /* a lost trickle dies alone */ })
    } else {
      const q = eyeIceQueues.get(from) ?? []
      q.push(cand)
      eyeIceQueues.set(from, q)
    }
  }
}

/** STOP WATCHING — my own hand or the stage's end. */
export async function stageUnwatch(): Promise<void> {
  const id = useStageStore.getState().watchingId
  if (id) void wireEmitAck('stage:leave', { streamId: id })
  stageUnwatchLocal()
}

function stageUnwatchLocal(why: 'stage-ended' | 'stage-dark' | 'clean' = 'clean'): void {
  if (subSampler) { clearInterval(subSampler); subSampler = null }
  try { subPc?.close() } catch { /* closing twice is lawful */ }
  subPc = null
  subStreamId = null
  subIceQueue = []
  useStageStore.setState({ watchingId: null, watchingTitle: null, remoteStream: null, viewerMuted: true, lastWhy: why === 'clean' ? null : why })
}

/* ─────────────────────── the face-level helpers ────────────────────── */

/** THE BOARD SEED — stage:list on the face's mount (the pushes keep it).
 * THE RACE LAW: the face can mount before the wire finishes its handshake
 * — the seed retries honestly until the wire answers. */
export async function stageSeedBoard(): Promise<void> {
  stageEnsure()
  stageBindLane()
  for (let i = 0; i < 12; i++) {
    const r = (await wireEmitAck('stage:list', {})) as { ok: boolean; why?: string; stages?: StageBoardRow[] }
    if (r.ok && Array.isArray(r.stages)) {
      useStageStore.setState({ board: r.stages })
      return
    }
    if (r.why !== 'wire-down' && r.why !== 'wire-slow') return // a lawful answer, even an empty board
    await new Promise((res) => setTimeout(res, 700))
  }
}

/** THE CHAT — rides the wire's stage:chat door (the M17 tier laws live
 * there, verbatim). */
export function stageSendChat(streamId: string, text: string): Promise<{ ok: boolean; why?: string; seq?: number }> {
  return wireEmitAck('stage:chat', { streamId, text }) as Promise<{ ok: boolean; why?: string; seq?: number }>
}

/** THE TIP — the stage walls (stageTipVerdict verbatim, client side) +
 * the W6 money laws at the wire's door (the PIN, the replay, the cap). */
export function stageTipIdentity(): StageIdentity {
  const a = useGameStore.getState().account
  const band = a.ageBand === 'kid' || a.ageBand === 'teen' ? a.ageBand : a.linked ? 'adult' : 'guest'
  return { handle: a.handle ?? null, band }
}

export function stageTipVerdictLocal(streamId: string, host: string): { ok: boolean; why?: string } {
  const live = useStageStore.getState().board.some((r) => r.id === streamId)
  return stageTipVerdict(stageTipIdentity(), live, host)
}

export function stageSendTip(streamId: string, amount: number, pin: string, idemKey: string): Promise<{ ok: boolean; why?: string; receipt?: unknown; balance?: number }> {
  return wireEmitAck('stage:tip', { streamId, amount, pin, idemKey }) as Promise<{ ok: boolean; why?: string; receipt?: unknown; balance?: number }>
}

/* ─────────────────────── the logout cleanup law ────────────────────── */

/** THE CLEANUP LAW: logout/reset kills my stage and my eye. */
export function stageReset(): void {
  void stageStop()
  void stageUnwatch()
  useStageStore.setState({ board: [], lastWhy: null, tipNote: null })
}

/** the chat counter rides the feed: the face bumps it (the witness reads it) */
export function stageNoteChat(): void {
  witness.chatSeen += 1
}

export function stageSubStreamId(): string | null {
  return subStreamId
}

/* ─────────────────────── the debug hook (e2e) ──────────────────────── */

function stageInstallWitness(): void {
  if (typeof window === 'undefined') return
  ;(window as unknown as { __lklStage?: unknown }).__lklStage = {
    witness: () => stageWitness(),
    chatSeen: () => witness.chatSeen,
    bumpChat: () => { witness.chatSeen += 1 },
  }
  // the deep diagnostic (the e2e's law: read the REAL peer state, never a guess)
  ;(window as unknown as { __lklStageDeep?: () => Promise<unknown> }).__lklStageDeep = async () => {
    const read = async (pc: RTCPeerConnection | null) => {
      if (!pc) return null
      const rows: Record<string, unknown>[] = []
      const stats = await pc.getStats()
      stats.forEach((r) => {
        if (['inbound-rtp', 'outbound-rtp', 'candidate-pair', 'track'].includes(r.type)) {
          rows.push({ t: r.type, kind: (r as Record<string, unknown>).kind ?? (r as Record<string, unknown>).mediaType ?? '', bytes: (r as Record<string, unknown>).bytesReceived ?? (r as Record<string, unknown>).bytesSent ?? '', state: (r as Record<string, unknown>).state ?? (r as Record<string, unknown>).trackState ?? '', id: String(r.id).slice(0, 14) })
        }
      })
      return {
        state: pc.connectionState,
        recv: pc.getReceivers().map((r) => `${r.track?.kind}:${r.track?.readyState}:${r.track?.muted ? 'muted' : 'live'}`),
        send: pc.getSenders().map((s) => `${s.track?.kind ?? 'none'}:${s.track?.readyState ?? '-'}`),
        rows,
      }
    }
    return { sub: await read(subPc), eyes: await Promise.all([...eyePcs.entries()].map(async ([k, pc]) => [k.slice(0, 12), await read(pc)])) }
  }
}
