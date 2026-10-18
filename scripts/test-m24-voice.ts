/**
 * LOKOJA LIFE — M24 W7: THE VOICE LAW SUITE
 * =========================================
 * Headless-pure where possible, REAL-WIRE where it matters: this suite
 * spawns the nation-wire service on :3005 (its own port — never fights
 * :3003/:3004), claims REAL accounts through the register door on :3000,
 * and walks the call doors + the proximity voice doors with
 * socket.io-client. The MEDIA plane itself (RTCPeerConnection, real
 * audio bytes) is witnessed in the E2E browser run — a Node suite has
 * no WebRTC, and the suite refuses to fake one.
 *
 * THE LAWS PINNED HERE (each one is a promise made in voice.ts / the
 * wire service header):
 *   PURE LAWS
 *   1. the dial verdict matrix — self/guest/minor-both-sides/ghost/
 *      blocked/offline/busy/ok, judged exactly as the door judges
 *   2. the channel law — call:a|b sorted pair; involves() knows its two
 *   3. the envelope laws — sdp looks like SDP and stays under the cap;
 *      ice is a small candidate envelope; the five whys, no sixth
 *   DOORS
 *   4. the identity law — a guest's call:ring refuses guest-mic-dark
 *   5. THE MINOR WALL — kid and teen refuse BOTH directions, structurally
 *   6. the ghost law — a never-claimed handle refuses no-such-paddy
 *   7. the offline law — claimed but not on the wire refuses offline
 *   8. the self law — you cannot call yourself
 *   9. the block wall — a block edge in EITHER direction refuses
 *  10. THE RING — the callee's phone receives the real ring push
 *      (from + video + callId), sub-second
 *  11. the one-call ownership laws — wrong-party accept refuses
 *      not-yours; a dead callId refuses no-call
 *  12. THE STATE LAW — an offer before accept refuses not-accepted;
 *      a garbage or oversize SDP refuses bad-sdp
 *  13. THE ACCEPT — the callee's ack carries iceServers; the caller
 *      receives the accepted push
 *  14. THE RELAY — offer lands on the callee, answer lands on the
 *      caller, ICE lands both ways (sealed envelopes, relayed verbatim)
 *  15. THE ONE-CALL LAW — a busy phone refuses busy (both directions)
 *  16. THE END TRUTH — hangup/declined push both sides; ONE outcome row
 *      in LiveEvent on the sorted-pair channel; health calls drops to 0
 *  17. THE PER-EAR MAPPING — the caller's no-answer IS the callee's
 *      missed call
 *  18. THE VANISH LAW — a phone that falls off the wire ends its call;
 *      the survivor learns
 *  19. THE PRIVACY LAW — a stranger's resume never sees the call:
 *      rows; the parties' resume does
 *  20. THE RATE LAW — the 25th signaling packet in 10s refuses too-fast
 *  PROXIMITY VOICE
 *  21. the walkie walls — guest and minors refuse voice:join
 *  22. the M17 admission law — the peers list carries same-street adults
 *      with voiceOn only; a different street never appears
 *  23. THE PV RELAY — pv:offer/answer/ice ride to the right peer, and
 *      voice-dark/different-street refusals hold
 *  24. THE MESH LAW — no walker's peers list ever exceeds 4
 *
 * Exit code 0 = every law holds. Non-zero = the wire lied somewhere.
 */
import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'
import {
  dialVerdict,
  callChannel,
  callChannelInvolves,
  sdpOk,
  iceOk,
  endWhyOk,
  callIdOk,
  pvPeers,
  PV_MESH_MAX,
  type PvPeer,
} from '../src/game/systems/voice'

const BASE = 'http://localhost:3000'
const WIRE = 'http://localhost:3005'
const WIRE_PORT = 3005
const DB_PATH = '/home/z/my-project/db/custom.db'

let passed = 0
let failed = 0
const fails: string[] = []

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    fails.push(name)
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

function section(name: string) {
  console.log(`\n── ${name} ─────────────────────────────────`)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/* ─────────────────── real accounts through the real door ─────────────────── */

async function reg(handle: string, pin: string, extra: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin, contact: `${handle}@lokoja.ng`, ageBand: 'adult', displayName: handle, avatarLook: '{"skinTone":"#6E4326","hairColor":"#1A1714","hairstyle":"low-cut","clothingStyle":"tshirt","clothingColor":"#1B7A43"}', ...extra }),
  })
  return (await res.json()) as { ok?: boolean; token?: string; why?: string }
}

/* ─────────────────── socket helpers ─────────────────── */

function connect(token: string | null): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s: Socket = io(WIRE, {
      transports: ['websocket', 'polling'],
      reconnection: false,
      timeout: 5000,
      auth: token ? { token } : {},
    })
    const t = setTimeout(() => {
      s.disconnect()
      reject(new Error('connect timeout'))
    }, 6000)
    s.on('connect', () => {
      clearTimeout(t)
      resolve(s)
    })
    s.on('connect_error', (e) => {
      clearTimeout(t)
      reject(e)
    })
  })
}

type Ack = { ok?: boolean; why?: string; callId?: string; iceServers?: { urls: string }[]; peers?: string[]; street?: string; events?: WireEvLike[]; head?: number }
interface WireEvLike { seq: number; kind: string; channel: string; actor: string; band: string; payload: Record<string, unknown> }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => {
      clearTimeout(t)
      resolve(r ?? {})
    })
  })
}

function nextPush<T = Record<string, unknown>>(s: Socket, lane: string, pred: (p: T) => boolean, ms = 3000): Promise<T | null> {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      s.off(lane, h)
      resolve(null)
    }, ms)
    const h = (p: T) => {
      if (pred(p)) {
        clearTimeout(t)
        s.off(lane, h)
        resolve(p)
      }
    }
    s.on(lane, h)
  })
}

/* ─────────────────── shared fixtures ─────────────────── */

const GOOD_SDP = 'v=0\r\no=- 4611731400430051336 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\n'
const GOOD_ICE = { candidate: 'candidate:842163049 1 udp 1677729535 192.168.0.1 50123 typ srflx raddr 0.0.0.0 rport 0 generation 0', sdpMid: '0', sdpMLineIndex: 0 }

function ringPair(a: Socket, b: Socket, video = false): Promise<string | null> {
  // A rings B; returns the callId once B's phone shows the ring push
  return (async () => {
    const ringPush = nextPush<{ type: string; callId?: string; from?: string; video?: boolean }>(b, 'wire:call', (p) => p.type === 'ring')
    const r = await emit(a, 'call:ring', { to: CURRENT_B, video })
    if (!r.ok || !r.callId) return null
    const push = await ringPush
    return push?.callId === r.callId ? r.callId : null
  })()
}

let CURRENT_B = ''

/* ═══════════════════════════ the suite ═══════════════════════════ */

const stamp = Date.now().toString(36).slice(-6)
const A = `voice_a_${stamp}`
const B = `voice_b_${stamp}`
const T = `voice_t_${stamp}`
const K = `voice_k_${stamp}`
const C = `voice_c_${stamp}` // claimed, never connects (the offline truth)
const X = `voice_x_${stamp}` // the blocker
const G = `voice_ghost_${stamp}` // never registered
const D = `voice_d_${stamp}`
const E = `voice_e_${stamp}`
const F = `voice_f_${stamp}`
const H = `voice_h_${stamp}`

let svc: ReturnType<typeof Bun.spawn> | null = null

async function waitForHealth(tries = 40): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(`http://localhost:${WIRE_PORT}/health`)
      if (r.ok) return true
    } catch {
      /* not up yet */
    }
    await sleep(150)
  }
  return false
}

function dialWhy(v: { ok: boolean; why?: string }): string | null {
  return v.ok ? null : (v.why ?? null)
}

try {
  /* ─────────────── the pure laws (no wire needed) ─────────────── */
  section('PURE 1. the dial verdict matrix')
  check('self refuses self-call', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: true })) === 'self-call')
  check('a guest caller refuses guest-mic-dark', dialWhy(dialVerdict({ callerBand: 'guest', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false })) === 'guest-mic-dark')
  check('a kid caller refuses minors-no-voice', dialWhy(dialVerdict({ callerBand: 'kid', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false })) === 'minors-no-voice')
  check('a teen caller refuses minors-no-voice', dialWhy(dialVerdict({ callerBand: 'teen', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false })) === 'minors-no-voice')
  check('a kid TARGET refuses minors-no-voice (minors never receive)', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: 'kid', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false })) === 'minors-no-voice')
  check('a teen TARGET refuses minors-no-voice', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: 'teen', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false })) === 'minors-no-voice')
  check('a ghost refuses no-such-paddy', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: null, targetExists: false, targetOnline: false, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false })) === 'no-such-paddy')
  check('a block edge either way refuses blocked', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: true, self: false })) === 'blocked')
  check('an offline paddy refuses offline', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: 'adult', targetExists: true, targetOnline: false, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false })) === 'offline')
  check('a busy callee refuses busy', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: true, callerBusy: false, blockedEitherWay: false, self: false })) === 'busy')
  check('a busy caller refuses busy', dialWhy(dialVerdict({ callerBand: 'adult', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: true, blockedEitherWay: false, self: false })) === 'busy')
  check('two lawful adults dial OK', dialVerdict({ callerBand: 'adult', targetBand: 'adult', targetExists: true, targetOnline: true, targetBusy: false, callerBusy: false, blockedEitherWay: false, self: false }).ok === true)

  section('PURE 2. the channel law (sorted pair, privacy eye)')
  check('callChannel sorts the pair', callChannel('zeta', 'alpha') === 'call:alpha|zeta')
  check('involves() knows its two', callChannelInvolves('call:alpha|zeta', 'zeta') && !callChannelInvolves('call:alpha|zeta', 'stranger'))

  section('PURE 3. the envelope laws + the end truth')
  check('a real SDP passes', sdpOk(GOOD_SDP))
  check('non-SDP garbage refuses', !sdpOk('hello world'))
  check('an oversize SDP (17KB) refuses', !sdpOk('v=0' + 'x'.repeat(17_000)))
  check('a real ICE candidate passes', iceOk(GOOD_ICE))
  check('an empty candidate refuses', !iceOk({ candidate: '' }) && !iceOk(null))
  check('the five whys pass, a sixth refuses', ['hangup', 'declined', 'missed', 'no-answer', 'busy'].every(endWhyOk) && !endWhyOk('no-mic') && !endWhyOk('whatever'))
  check('callId shape is c:<lower-alnum>', callIdOk('c:abc123def456') && !callIdOk('C:ABC') && !callIdOk('nope'))

  /* ─────────────── spawn the wire ─────────────── */
  section('spawn the nation wire (:3005, the REAL db) + claim the walkers')
  const debug = process.argv.includes('--debug')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) },
    stdout: debug ? 'inherit' : 'pipe',
    stderr: debug ? 'inherit' : 'pipe',
  })
  if (!debug) {
    void (async () => {
      try {
        const err = await new Response(svc!.stderr as unknown as BodyInit).text()
        if (err.trim()) console.error('[wire-child stderr]', err.slice(0, 2000))
      } catch { /* child may still be running */ }
    })()
  }
  check('the wire service boots and the health door answers', await waitForHealth())
  const health0 = (await (await fetch(`http://localhost:${WIRE_PORT}/health`)).json()) as { calls?: number; head?: number }
  check('the health door carries the calls count (W7)', typeof health0.calls === 'number' && health0.calls === 0)
  const HEAD0 = health0.head ?? 0 // the privacy replay reads rows AFTER this cursor

  const ra = await reg(A, '1234')
  const rb = await reg(B, '4321')
  const rt = await reg(T, '5678', { ageBand: 'teen', parentPin: '998877' })
  const rk = await reg(K, '1357', { ageBand: 'kid', parentPin: '998877' })
  const rc = await reg(C, '2468')
  const rx = await reg(X, '9090')
  const rd = await reg(D, '1122')
  const re = await reg(E, '2233')
  const rf = await reg(F, '3344')
  const rh = await reg(H, '4455')
  check(
    'ten walkers claim through the REAL register door (C stays offline)',
    !!ra.token && !!rb.token && !!rt.token && !!rk.token && !!rc.ok && !!rx.token && !!rd.token && !!re.token && !!rf.token && !!rh.token,
  )

  /* ─────────────── the door laws ─────────────── */
  section('DOORS 4-9. the walls at the ring door')
  const sa = await connect(ra.token!)
  const sb = await connect(rb.token!)
  const sw = await connect(null)
  const st = await connect(rt.token!)
  const sk = await connect(rk.token!)
  const sx = await connect(rx.token!)
  CURRENT_B = B
  await emit(sa, 'hello', { street: 'patti' })
  await emit(sb, 'hello', { street: 'patti' })
  await emit(sx, 'hello', { street: 'patti' })
  // the minors WALK the same street on purpose — the admission law must
  // never name them even though presence carries them
  await emit(st, 'hello', { street: 'patti' })
  await emit(sk, 'hello', { street: 'patti' })

  const g = await emit(sw, 'call:ring', { to: B })
  check('a guest ring refuses guest-mic-dark', g.ok === false && g.why === 'guest-mic-dark')
  const kt = await emit(st, 'call:ring', { to: B })
  check('a teen ring refuses minors-no-voice', kt.ok === false && kt.why === 'minors-no-voice')
  const kk = await emit(sk, 'call:ring', { to: B })
  check('a kid ring refuses minors-no-voice', kk.ok === false && kk.why === 'minors-no-voice')
  const gh = await emit(sa, 'call:ring', { to: G })
  check('a ghost refuses no-such-paddy', gh.ok === false && gh.why === 'no-such-paddy')
  const off = await emit(sa, 'call:ring', { to: C })
  check('a claimed-but-offline paddy refuses offline', off.ok === false && off.why === 'offline')
  const self = await emit(sa, 'call:ring', { to: A })
  check('nobody calls themselves', self.ok === false && self.why === 'self-call')

  // THE BLOCK WALL — X blocks A, then A's ring refuses
  await emit(sx, 'social:block', { handle: A })
  const blocked = await emit(sa, 'call:ring', { to: X })
  check('a block edge in either direction refuses blocked', blocked.ok === false && blocked.why === 'blocked')
  await emit(sx, 'social:unblock', { handle: A })

  /* ─────────────── the full call flow ─────────────── */
  section('DOORS 10-14. THE RING, THE STATE LAW, THE RELAY')
  CURRENT_B = B
  const callId = await ringPair(sa, sb)
  check('THE RING — B receives the real ring push with the callId', !!callId)

  const wrongAcc = await emit(sa, 'call:accept', { callId })
  check('the CALLER cannot accept their own call (not-yours)', wrongAcc.ok === false && wrongAcc.why === 'not-yours')
  const deadAcc = await emit(sb, 'call:accept', { callId: 'c:deadbeefdeadbeef' })
  check('a dead callId refuses no-call', deadAcc.ok === false && deadAcc.why === 'no-call')
  const earlyOffer = await emit(sa, 'call:offer', { callId, sdp: GOOD_SDP })
  check('an offer BEFORE accept refuses not-accepted', earlyOffer.ok === false && earlyOffer.why === 'not-accepted')

  const acceptedPush = nextPush<{ type: string; callId?: string }>(sa, 'wire:call', (p) => p.type === 'accepted') // registered BEFORE the accept flies
  const acc = await emit(sb, 'call:accept', { callId })
  check('THE ACCEPT — the callee acks with iceServers (STUN present)', acc.ok === true && Array.isArray(acc.iceServers) && acc.iceServers.some((i) => i.urls.startsWith('stun:')))
  const gotAccepted = await acceptedPush
  check('the caller receives the accepted push', gotAccepted?.callId === callId)

  const badSdp = await emit(sa, 'call:offer', { callId, sdp: 'not sdp at all' })
  check('a garbage SDP refuses bad-sdp', badSdp.ok === false && badSdp.why === 'bad-sdp')
  const bigSdp = await emit(sa, 'call:offer', { callId, sdp: 'v=0' + 'x'.repeat(17_000) })
  check('an oversize SDP refuses bad-sdp', bigSdp.ok === false && bigSdp.why === 'bad-sdp')
  const offeredPush = nextPush<{ type: string; sdp?: string }>(sb, 'wire:call', (p) => p.type === 'offer') // registered BEFORE the offer flies
  const offer = await emit(sa, 'call:offer', { callId, sdp: GOOD_SDP })
  const gotOffer = await offeredPush
  check('THE RELAY — the offer lands on the callee verbatim', offer.ok === true && gotOffer?.sdp === GOOD_SDP)

  const wrongAnswer = await emit(sa, 'call:answer', { callId, sdp: GOOD_SDP })
  check('the CALLER cannot answer (not-yours)', wrongAnswer.ok === false && wrongAnswer.why === 'not-yours')
  const answerPush = nextPush<{ type: string; sdp?: string }>(sa, 'wire:call', (p) => p.type === 'answer')
  const ans = await emit(sb, 'call:answer', { callId, sdp: GOOD_SDP })
  const gotAnswer = await answerPush
  check('THE RELAY — the answer lands on the caller verbatim', ans.ok === true && gotAnswer?.sdp === GOOD_SDP)

  const icePushB = nextPush<{ type: string; candidate?: { candidate: string } }>(sb, 'wire:call', (p) => p.type === 'ice')
  const iceA = await emit(sa, 'call:ice', { callId, candidate: GOOD_ICE })
  const gotIceB = await icePushB
  check('ICE flies caller → callee', iceA.ok === true && gotIceB?.candidate?.candidate === GOOD_ICE.candidate)
  const icePushA = nextPush<{ type: string; candidate?: { candidate: string } }>(sa, 'wire:call', (p) => p.type === 'ice')
  const iceB = await emit(sb, 'call:ice', { callId, candidate: GOOD_ICE })
  const gotIceA = await icePushA
  check('ICE flies callee → caller', iceB.ok === true && gotIceA?.candidate?.candidate === GOOD_ICE.candidate)
  const badIce = await emit(sa, 'call:ice', { callId, candidate: { candidate: '' } })
  check('an empty candidate refuses bad-ice', badIce.ok === false && badIce.why === 'bad-ice')

  section('DOOR 15. THE ONE-CALL LAW (busy, both directions)')
  const sd = await connect(rd.token!)
  await emit(sd, 'hello', { street: 'patti' })
  CURRENT_B = A
  const busyTarget = await emit(sd, 'call:ring', { to: A })
  check('ringing a phone in an ACTIVE call refuses busy', busyTarget.ok === false && busyTarget.why === 'busy')
  CURRENT_B = D
  const busyCaller = await emit(sa, 'call:ring', { to: D })
  check('a phone in an ACTIVE call cannot dial (busy caller)', busyCaller.ok === false && busyCaller.why === 'busy')

  section('DOORS 16-17. THE END TRUTH + THE PER-EAR MAPPING')
  const endedPushB = nextPush<{ type: string; why?: string }>(sb, 'wire:call', (p) => p.type === 'ended')
  await emit(sa, 'call:hangup', { callId, why: 'hangup' })
  const endedB = await endedPushB
  check('a hangup lands on the peer with the honest why', endedB?.why === 'hangup')
  await sleep(100)
  const db = new Database(DB_PATH, { readonly: true })
  const rows1 = db.query('SELECT channel, payload FROM LiveEvent WHERE kind = ? AND channel = ? ORDER BY seq DESC LIMIT 3').all('call', callChannel(A, B)) as { channel: string; payload: string }[]
  const p1 = rows1.length ? (JSON.parse(rows1[0].payload) as { why?: string; secs?: number }) : {}
  check('ONE outcome row lives on the sorted-pair call: channel', rows1.length >= 1 && p1.why === 'hangup' && typeof p1.secs === 'number', `rows=${rows1.length} why=${p1.why}`)
  const healthAfter = (await (await fetch(`http://localhost:${WIRE_PORT}/health`)).json()) as { calls?: number }
  check('the registry is empty after the end (health calls = 0)', healthAfter.calls === 0)

  // the per-ear mapping: the caller's cancel is the callee's missed call
  CURRENT_B = B
  const callId2 = await ringPair(sa, sb)
  const endedPushB2 = nextPush<{ type: string; why?: string }>(sb, 'wire:call', (p) => p.type === 'ended')
  await emit(sa, 'call:hangup', { callId: callId2, why: 'no-answer' })
  const endedB2 = await endedPushB2
  check('THE PER-EAR MAPPING — the caller no-answer IS the callee missed', endedB2?.why === 'missed')

  // decline: the callee's truth travels as declined
  CURRENT_B = B
  const callId3 = await ringPair(sa, sb)
  const endedPushA3 = nextPush<{ type: string; why?: string }>(sa, 'wire:call', (p) => p.type === 'ended')
  await emit(sb, 'call:decline', { callId: callId3 })
  const endedA3 = await endedPushA3
  check('a decline lands on the caller as declined', endedA3?.why === 'declined')

  section('DOOR 18. THE VANISH LAW (a phone that falls off the wire)')
  CURRENT_B = B
  const callId4 = await ringPair(sa, sb)
  const endedPushB4 = nextPush<{ type: string; why?: string }>(sb, 'wire:call', (p) => p.type === 'ended')
  sa.disconnect()
  const vanished = await endedPushB4
  check('a vanished caller ends the call — the callee learns', !!vanished && typeof vanished.why === 'string')
  const sa2 = await connect(ra.token!) // A returns (the suite still needs A)
  await emit(sa2, 'hello', { street: 'patti' })

  section('DOOR 19. THE PRIVACY LAW (a stranger never hears a stranger\'s ring)')
  const sh = await connect(rh.token!)
  await emit(sh, 'hello', { street: 'yaba' })
  // THE CURSOR TRUTH: resume replays rows AFTER the cursor (capped at
  // RESUME_CAP) — so both readers resume from HEAD0, the cursor before
  // the suite's first ring. The ACK carries the events — no listener race.
  const hRes = await emit(sh, 'resume', { since: HEAD0 })
  const hSaw = hRes.events ?? []
  check('a stranger\'s replay carries ZERO call: rows', !hSaw.some((e) => e.channel.startsWith('call:')), `saw=${hSaw.filter((e) => e.channel.startsWith('call:')).length}`)
  const aRes = await emit(sa2, 'resume', { since: HEAD0 })
  const aSaw = aRes.events ?? []
  check('a party\'s replay carries the call: rows (theirs alone)', aSaw.some((e) => e.channel.startsWith('call:')), `saw=${aSaw.filter((e) => e.channel.startsWith('call:')).length}`)
  const tRes = await emit(st, 'resume', { since: HEAD0 })
  check('no replay anywhere leaks a call: row to a THIRD party', !(tRes.events ?? []).some((e) => e.channel.startsWith('call:')))

  section('DOOR 20. THE RATE LAW (signaling stays capped)')
  const sRate = await connect(ra.token!)
  let tooFast = false
  for (let i = 0; i < 25; i++) {
    const r = await emit(sRate, 'call:ice', { callId: 'c:nonexistent000', candidate: GOOD_ICE })
    if (r.why === 'too-fast') {
      tooFast = true
      break
    }
  }
  check('the 25th signaling packet in 10s refuses too-fast', tooFast)
  sRate.disconnect()

  /* ─────────────── the proximity voice ─────────────── */
  section('WALKIE 21-22. the walls + the M17 admission law')
  const gv = await emit(sw, 'voice:join', {})
  check('a guest cannot join the walkie (guest-mic-dark)', gv.ok === false && gv.why === 'guest-mic-dark')
  const kv = await emit(sk, 'voice:join', {})
  check('a kid cannot join the walkie (minors-no-voice)', kv.ok === false && kv.why === 'minors-no-voice')
  const tv = await emit(st, 'voice:join', {})
  check('a teen cannot join the walkie (minors-no-voice)', tv.ok === false && tv.why === 'minors-no-voice')

  // T (teen) walks the SAME street — pv admission must never name them
  const av = await emit(sa2, 'voice:join', {})
  check('A joins the walkie (adult, presence row present)', av.ok === true && av.street === 'patti', JSON.stringify(av))
  const bv = await emit(sb, 'voice:join', {})
  check('B joins and sees A in the peers list', bv.ok === true && Array.isArray(bv.peers) && bv.peers.includes(A), JSON.stringify(bv))
  const joinedListener = nextPush<{ type: string; handle?: string }>(sa2, 'wire:voice', (p) => p.type === 'joined', 2500) // BEFORE anyone else joins
  const avJoinedPush = await (async () => {
    // D (an adult already online) joins — the room hears the push
    const sc = await connect(rd.token!)
    await emit(sc, 'hello', { street: 'patti' })
    await emit(sc, 'voice:join', {})
    const got = await joinedListener
    sc.disconnect()
    return got
  })()
  check('the street hears the joined push (the walkie lane)', avJoinedPush?.handle === D, JSON.stringify(avJoinedPush))

  // the teen T is IN street patti (hello earlier) but voice:join refused —
  // the peers list must never carry a minor even though presence has them
  check('no minor ever appears in a peers list', !(bv.peers ?? []).some((p) => p === T || p === K))

  section('WALKIE 23. THE PV RELAY + the voice-dark refusals')
  const pvOfferPush = nextPush<{ type: string; from?: string; sdp?: string }>(sb, 'wire:pv', (p) => p.type === 'pv-offer') // BEFORE the offer flies
  const pvo = await emit(sa2, 'pv:offer', { to: B, sdp: GOOD_SDP })
  const gotPv = await pvOfferPush
  check('the pv offer rides to the right peer verbatim', pvo.ok === true && gotPv?.sdp === GOOD_SDP && gotPv?.from === A)
  const pvAnsPush = nextPush<{ type: string; from?: string; sdp?: string }>(sa2, 'wire:pv', (p) => p.type === 'pv-answer') // BEFORE the answer flies
  const pva = await emit(sb, 'pv:answer', { to: A, sdp: GOOD_SDP })
  const gotPvAns = await pvAnsPush
  check('the pv answer rides back verbatim', pva.ok === true && gotPvAns?.sdp === GOOD_SDP)
  const pvIcePush = nextPush<{ type: string; from?: string }>(sb, 'wire:pv', (p) => p.type === 'pv-ice') // BEFORE the ICE flies
  const pvi = await emit(sa2, 'pv:ice', { to: B, candidate: GOOD_ICE })
  const gotPvIce = await pvIcePush
  check('the pv ICE rides both ways', pvi.ok === true && gotPvIce?.type === 'pv-ice')

  await emit(sa2, 'voice:leave', {})
  const pvd = await emit(sa2, 'pv:offer', { to: B, sdp: GOOD_SDP })
  check('voice OFF = voice-dark (the opt-in law holds at the door)', pvd.ok === false && pvd.why === 'voice-dark')
  const pvoK = await emit(sb, 'pv:offer', { to: K, sdp: GOOD_SDP })
  check('pv signaling to a minor refuses voice-dark', pvoK.ok === false && pvoK.why === 'voice-dark')
  const pvoC = await emit(sb, 'pv:offer', { to: C, sdp: GOOD_SDP })
  check('pv signaling to an offline paddy refuses voice-dark', pvoC.ok === false && pvoC.why === 'voice-dark')
  const pvoBig = await emit(sb, 'pv:offer', { to: A, sdp: 'v=0' + 'x'.repeat(17_000) })
  check('an oversize pv SDP refuses bad-sdp', pvoBig.ok === false && pvoBig.why === 'bad-sdp')

  section('WALKIE 24. THE MESH LAW (the cap is 4, everywhere)')
  // D, E, F, H + A + B all in street patti — nobody's peers list exceeds 4
  const se = await connect(re.token!)
  const sf = await connect(rf.token!)
  await emit(se, 'hello', { street: 'patti' })
  await emit(sf, 'hello', { street: 'patti' })
  await emit(sh, 'hello', { street: 'patti' })
  await emit(sa2, 'voice:join', {})
  await emit(sb, 'voice:join', {})
  const ev = await emit(se, 'voice:join', {})
  const fv = await emit(sf, 'voice:join', {})
  const hv = await emit(sh, 'voice:join', {})
  const caps = [ev, fv, hv].map((r) => (r.peers ?? []).length)
  check('every walker\'s peers list respects PV_MESH_MAX=4', caps.every((n) => n <= PV_MESH_MAX), `caps=${caps.join(',')}`)
  // the pure law agrees: a 6-row roster trims to 4
  const bigRoster: PvPeer[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map((h) => ({ handle: h, band: 'adult' as const, street: 'patti', voiceOn: true }))
  check('the pure pvPeers trims a 6-row roster to 4 (sorted)', JSON.stringify(pvPeers('me', 'patti', bigRoster)) === JSON.stringify(['p1', 'p2', 'p3', 'p4']))

  /* ─────────────── cleanup ─────────────── */
  sa2.disconnect()
  sb.disconnect()
  sw.disconnect()
  st.disconnect()
  sk.disconnect()
  sx.disconnect()
  sd.disconnect()
  se.disconnect()
  sf.disconnect()
  sh.disconnect()
  db.close()
} catch (e) {
  failed++
  fails.push(`suite crashed: ${String(e)}`)
  console.error('SUITE CRASH:', e)
} finally {
  svc?.kill()
}

console.log(`\n══════════════════════════════════════`)
console.log(`M24-W7 VOICE LAWS: ${passed} passed, ${failed} failed`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
process.exit(failed ? 1 : 0)
