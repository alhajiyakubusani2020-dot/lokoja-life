/**
 * LOKOJA LIFE — M24 W8: THE FACE LAW SUITE
 * =========================================
 * Video 1:1 on the nation's voice wire. Headless-pure where possible,
 * REAL-WIRE where it matters (the W7 doctrine): this suite spawns the
 * nation-wire service on :3006 (its own port — never fights
 * :3003/:3004/:3005), claims REAL accounts through the register door on
 * :3000, and walks the CAMERA doors with socket.io-client. The MEDIA
 * plane itself (RTCPeerConnection, real video frames) is witnessed in
 * the E2E browser run — a Node suite has no WebRTC, and the suite
 * refuses to fake one.
 *
 * THE LAWS PINNED HERE:
 *   PURE LAWS
 *   1. THE CAMERA STATE LAW — the 'cam' envelope: { callId, on: boolean }
 *      passes; a non-boolean `on` refuses; a missing callId refuses; an
 *      unknown type refuses (the seal, never opened)
 *   2. THE RING CARRIES THE WISH — the video flag is a first-class field
 *      of the ring push (a video dial rings as video, verbatim)
 *   3. THE VIDEO SDP ENVELOPE — a realistic two-m-line video offer
 *      (audio + video, DTLS + ICE, ~3KB) passes sdpOk under the cap: the
 *      wire never needs to open it to know it is sealed
 *   DOORS (the REAL wire, the REAL db)
 *   4. the guest wall — call:cam refuses guest-mic-dark
 *   5. THE OWNERSHIP WALL — a third party's call:cam refuses not-yours
 *   6. THE STATE WALL — a cam push before the offer refuses
 *      not-connecting (the camera truth rides a LIVE call only)
 *   7. THE SEAL WALL — a non-boolean `on` refuses bad-cam
 *   8. THE VIDEO RING RIDES — B's ring push carries video===true when A
 *      dialed video
 *   9. THE CAMERA RELAY — after accept+offer: the callee's cam on:true
 *      lands on the CALLER alone; the caller's cam on:false lands on the
 *      CALLEE alone; a stranger's wire:call lane sees NOTHING (the
 *      privacy eye rides the person, never a channel)
 *  10. THE VIDEO OFFER RELAYS VERBATIM — a two-m-line SDP offer crosses
 *      the door untouched (the relay doctrine: sealed envelopes)
 *  11. THE ONE-CALL LAW still guards the face — a video dial onto a busy
 *      phone refuses busy (video inherits the whole dial law; the minor
 *      wall needs no new code — a minor can never place the call at all)
 *
 * Exit code 0 = every law holds. Non-zero = the wire lied somewhere.
 */
import { io, type Socket } from 'socket.io-client'
import { wireCallPushOk, sdpOk, SDP_MAX } from '../src/game/systems/voice'

const BASE = 'http://localhost:3000'
const WIRE = 'http://localhost:3006'
const WIRE_PORT = 3006

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

async function reg(handle: string, pin: string): Promise<{ ok?: boolean; token?: string; why?: string }> {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin, contact: `${handle}@lokoja.ng`, ageBand: 'adult' }),
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

type Ack = { ok?: boolean; why?: string; callId?: string }

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

/** A REALISTIC video offer: BUNDLE, two m-lines (audio 111 opus + video
 *  96 VP8), DTLS fingerprint, ICE options — the shape Chromium ships.
 *  ~1.2KB — the wire must take it whole and never open it. */
const VIDEO_SDP = [
  'v=0',
  'o=- 4611731400430051336 2 IN IP4 127.0.0.1',
  's=-',
  't=0 0',
  'a=group:BUNDLE 0 1',
  'a=extmap-allow-mixed',
  'a=msid-semantic: WMS lokoja',
  'm=audio 9 UDP/TLS/RTP/SAVPF 111',
  'c=IN IP4 0.0.0.0',
  'a=rtcp:9 IN IP4 0.0.0.0',
  'a=ice-ufrag:EsAw',
  'a=ice-pwd:P2uYro0UCOQ4zxjKXaWCBui1',
  'a=ice-options:trickle',
  'a=fingerprint:sha-256 D2:FA:0E:C3:22:59:5E:14:95:69:92:3D:13:B4:84:24:2C:C2:A2:C0:3E:FD:34:8E:5E:EA:6F:AF:52:CE:E6:0F',
  'a=setup:actpass',
  'a=mid:0',
  'a=sendrecv',
  'a=msid:lokoja a0',
  'a=rtpmap:111 opus/48000/2',
  'a=fmtp:111 minptime=10;useinbandfec=1',
  'a=ssrc:1001 cname:lokoja',
  'm=video 9 UDP/TLS/RTP/SAVPF 96',
  'c=IN IP4 0.0.0.0',
  'a=rtcp:9 IN IP4 0.0.0.0',
  'a=ice-ufrag:EsAw',
  'a=ice-pwd:P2uYro0UCOQ4zxjKXaWCBui1',
  'a=ice-options:trickle',
  'a=fingerprint:sha-256 D2:FA:0E:C3:22:59:5E:14:95:69:92:3D:13:B4:84:24:2C:C2:A2:C0:3E:FD:34:8E:5E:EA:6F:AF:52:CE:E6:0F',
  'a=setup:actpass',
  'a=mid:1',
  'a=sendrecv',
  'a=msid:lokoja v0',
  'a=rtcp-mux',
  'a=rtpmap:96 VP8/90000',
  'a=rtcp-fb:96 nack',
  'a=rtcp-fb:96 nack pli',
  'a=rtcp-fb:96 goog-remb',
  'a=ssrc:2002 cname:lokoja',
].join('\r\n') + '\r\n'

/* ═══════════════════════════ the suite ═══════════════════════════ */

const stamp = Date.now().toString(36).slice(-6)
const A = `face_a_${stamp}`
const B = `face_b_${stamp}`
const X = `face_x_${stamp}` // the stranger (the privacy eye)
const W = `face_w_${stamp}` // guest (never registers)

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

try {
  /* ─────────────── the pure laws (no wire needed) ─────────────── */

  section('PURE 1. THE CAMERA STATE LAW — the cam envelope')
  check('cam on:true passes', wireCallPushOk({ type: 'cam', callId: 'c:abc123def456', on: true }))
  check('cam on:false passes', wireCallPushOk({ type: 'cam', callId: 'c:abc123def456', on: false }))
  check("cam on:'yes' refuses (the seal wants a boolean)", !wireCallPushOk({ type: 'cam', callId: 'c:abc123def456', on: 'yes' }))
  check('cam without callId refuses', !wireCallPushOk({ type: 'cam', on: true }))
  check('cam with a deformed callId refuses', !wireCallPushOk({ type: 'cam', callId: 'nope', on: true }))

  section('PURE 2. THE RING CARRIES THE WISH + the ended truth stays')
  check('ring video:true passes', wireCallPushOk({ type: 'ring', callId: 'c:abc123def456', from: 'face_a', video: true }))
  check('ring video:false passes', wireCallPushOk({ type: 'ring', callId: 'c:abc123def456', from: 'face_a', video: false }))
  check('an unknown type still refuses (the law did not loosen)', !wireCallPushOk({ type: 'snapshot', callId: 'c:abc123def456' }))

  section('PURE 3. THE VIDEO SDP ENVELOPE — sealed, under the cap')
  check(`the realistic video offer passes (${VIDEO_SDP.length}B ≤ ${SDP_MAX})`, sdpOk(VIDEO_SDP))
  check('it really carries TWO m-lines (audio + video)', (VIDEO_SDP.match(/^m=/gm) ?? []).length === 2)
  check('an oversize video offer (17KB) still refuses', !sdpOk(VIDEO_SDP + 'x'.repeat(17_000)))

  /* ─────────────── spawn the wire ─────────────── */
  section('spawn the nation wire (:3006, the REAL db) + claim the walkers')
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
  check('the wire rose', await waitForHealth())

  const ta = await reg(A, '5551')
  const tb = await reg(B, '5552')
  const tx = await reg(X, '5553')
  check('A claimed', !!ta.token)
  check('B claimed', !!tb.token)
  check('X claimed', !!tx.token)

  const sa = await connect(ta.token ?? null)
  const sb = await connect(tb.token ?? null)
  const sx = await connect(tx.token ?? null)
  const sw = await connect(null) // the guest
  check('four phones on the wire', sa.connected && sb.connected && sx.connected && sw.connected)
  await emit(sa, 'hello', { street: 'patti' })
  await emit(sb, 'hello', { street: 'patti' })
  await emit(sx, 'hello', { street: 'patti' })

  /* ─────────────── the doors ─────────────── */

  section('DOOR 4. the guest wall on the camera truth')
  const gw = await emit(sw, 'call:cam', { callId: 'c:abc123def456', on: true })
  check('a guest call:cam refuses guest-mic-dark', gw.ok === false && gw.why === 'guest-mic-dark')

  section('DOOR 8. THE VIDEO RING RIDES — the wish crosses verbatim')
  {
    const ringPush = nextPush<{ type: string; callId?: string; from?: string; video?: boolean }>(sb, 'wire:call', (p) => p.type === 'ring')
    const r = await emit(sa, 'call:ring', { to: B, video: true })
    check('the video dial acks ok with a callId', r.ok === true && typeof r.callId === 'string')
    const push = await ringPush
    check("B's ring push carries video===true", push?.video === true && push?.callId === r.callId && push?.from === A)
    const callId = r.callId!

    section('DOOR 6. THE STATE WALL — the camera truth rides a LIVE call only')
    const early = await emit(sb, 'call:cam', { callId, on: true })
    check('a cam push while still ringing refuses not-connecting', early.ok === false && early.why === 'not-connecting')

    section('DOOR 9. THE CAMERA RELAY — the other ear alone')
    // accept + offer → state 'connecting'
    const acc = await emit(sb, 'call:accept', { callId })
    check('the accept acks ok', acc.ok === true)
    const offerPush = nextPush<{ type: string; sdp?: string }>(sb, 'wire:call', (p) => p.type === 'offer')
    const off = await emit(sa, 'call:offer', { callId, sdp: VIDEO_SDP })
    check('the video offer acks ok', off.ok === true)
    const gotOffer = await offerPush
    check('the two-m-line offer relays VERBATIM (the relay doctrine)', gotOffer?.sdp === VIDEO_SDP)

    // the stranger's lane listens for EVERYTHING on this callId — it must
    // receive NOTHING (the privacy eye rides the person, never a channel)
    const strangerSeen: unknown[] = []
    sx.on('wire:call', (p: unknown) => {
      if ((p as { callId?: string })?.callId === callId) strangerSeen.push(p)
    })

    // the callee's camera opens → the CALLER learns it alone
    const camToCaller = nextPush<{ type: string; callId?: string; on?: boolean }>(sa, 'wire:call', (p) => p.type === 'cam')
    const c1 = await emit(sb, 'call:cam', { callId, on: true })
    check('the callee cam acks ok', c1.ok === true)
    const gotCam = await camToCaller
    check("the caller's ear hears cam on:true", gotCam?.on === true && gotCam?.callId === callId)

    // the caller's camera stays dark → the CALLEE learns it alone
    const camToCallee = nextPush<{ type: string; callId?: string; on?: boolean }>(sb, 'wire:call', (p) => p.type === 'cam')
    const c2 = await emit(sa, 'call:cam', { callId, on: false })
    check('the caller cam acks ok', c2.ok === true)
    const gotCam2 = await camToCallee
    check("the callee's ear hears cam on:false", gotCam2?.on === false && gotCam2?.callId === callId)

    section('DOOR 5. THE OWNERSHIP WALL + the stranger NEVER sees')
    const sneak = await emit(sx, 'call:cam', { callId, on: true })
    check('a stranger call:cam refuses not-yours', sneak.ok === false && sneak.why === 'not-yours')
    await sleep(250)
    check('the stranger saw ZERO pushes on this call', strangerSeen.length === 0, `saw ${strangerSeen.length}`)

    section('DOOR 7. THE SEAL WALL — garbage truth refuses')
    const bad = await emit(sa, 'call:cam', { callId, on: 'yes' })
    check("cam on:'yes' refuses bad-cam", bad.ok === false && bad.why === 'bad-cam')
    const missing = await emit(sa, 'call:cam', { callId })
    check('cam without on refuses bad-cam', missing.ok === false && missing.why === 'bad-cam')

    section('DOOR 11. THE ONE-CALL LAW guards the face too')
    {
      // A is busy with callId; a THIRD walker would refuse busy — but the
      // structural proof here: A cannot dial again (callerBusy)
      const ringPush2 = nextPush<Record<string, unknown>>(sb, 'wire:call', () => false, 400) // silence expected
      const again = await emit(sa, 'call:ring', { to: B, video: true })
      check('a video dial from an already-calling phone refuses busy', again.ok === false && again.why === 'busy')
      const silent = await ringPush2
      check('B heard NO second ring', silent === null)
    }

    section('THE END — the face hangs up honestly')
    const endA = nextPush<{ type: string; why?: string }>(sa, 'wire:call', (p) => p.type === 'ended')
    const endB = nextPush<{ type: string; why?: string }>(sb, 'wire:call', (p) => p.type === 'ended')
    await emit(sb, 'call:hangup', { callId, why: 'hangup' })
    const ea = await endA
    const eb = await endB
    check('both ears learn the end', ea?.why === 'hangup' && eb?.why === 'hangup')
  }

  sa.disconnect()
  sb.disconnect()
  sx.disconnect()
  sw.disconnect()
} catch (e) {
  failed++
  fails.push(`suite crashed: ${String(e)}`)
  console.error('SUITE CRASH:', e)
} finally {
  if (svc) {
    svc.kill()
    await sleep(200)
  }
}

console.log(`\n═══════════════════════════════════════`)
console.log(`m24-face: ${passed} passed, ${failed} failed`)
if (fails.length) {
  console.log('FAILED:')
  for (const f of fails) console.log(`  ✗ ${f}`)
  process.exit(1)
}
process.exit(0)
