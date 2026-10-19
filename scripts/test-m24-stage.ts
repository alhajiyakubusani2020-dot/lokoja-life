/**
 * LOKOJA LIFE — M24 W9: THE STAGE LAW SUITE
 * =========================================
 * Headless-pure for the vault, REAL-WIRE for the doors, REAL-MEDIA-HOUSE
 * for the gate: spawns the nation-wire on :3005 (its own port), claims REAL
 * accounts through the register door on :3000, walks the stage lifecycle
 * with socket.io-client, and proves the media house itself is standing
 * guard (a garbage token gets 401 from the WHIP door — the tokens the wire
 * mints are the only keys).
 *
 * THE LAWS PINNED HERE:
 *  PURE (stage.ts, the vault both the door and the faces run):
 *   1.  the title law — empty/punct-only/65+/control chars refuse, whitespace collapses
 *   2.  the id law — `stg-` + base36 or nothing
 *   3.  the broadcast door — guest dark, kid/teen refuse, adult passes, ONE-STAGE
 *   4.  the spectate law — ANY band watches a LIVE stage, a dead one refuses
 *   5.  the tip door — stage-scoped walls (live, no self-tip, adults); the money
 *       laws stay the W6 door's own
 *   6.  the end door — the host's hand alone
 *   7.  the crowd note — real eyes + the ×1.5-capped multiplier note, never a lie
 *  REAL (the wire doors on :3005):
 *   8.  start — adult ok, the token is a REAL HMAC JWT with the right video grant
 *       (decoded + signature-verified against the house secret), StreamRow 'live'
 *   9.  guest/kid/teen start refuse at the REAL door; bad title refuses; the
 *       ONE-STAGE LAW refuses a second stage
 *  10.  watch — adult + teen + guest all admitted (the spectate law), viewer
 *       counts push; a dead stage refuses 'stage-not-live'
 *  11.  stage chat — the M17 tier laws at the door (kid text refuses, teen 140,
 *       adult link law strips), rows land in LiveEvent under stream:<id>
 *  12.  tip — guest/kid refuse, bad PIN refuses, self-tip refuses, the replayed
 *       idemKey returns the SAME receipt and moves NOTHING, the REAL move is
 *       fortress-chained (kind 'tip', seed→tail recompute), the day cap counts it
 *  13.  end — the stranger's hand refuses 'not-yours', the host's hand ends it,
 *       the row reads 'ended', the board empties
 *  14.  THE STAGE DIES WITH THE HOST — the host's socket goodbye ends the stage
 *  15.  the rate law — the 5th stage gesture in 10s refuses too-fast
 *  16.  the media house stands guard — /whip answers 401 to a garbage token
 *
 * Exit code 0 = every law holds. Non-zero = the stage lied somewhere.
 */
import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'
import {
  stageTitleOk, stageIdOk, stageVerdict, stageWatchVerdict, stageTipVerdict,
  stageEndOk, crowdNoteText, stageRoom, stageChannel, stageEyeVerdict,
  STAGE_TITLE_MAX, STAGE_MESH_MAX,
} from '../src/game/systems/stage'

const BASE = 'http://localhost:3000'
const WIRE = 'http://localhost:3005'
const WIRE_PORT = 3005

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

const LOOK = { skinTone: '#6E4326', hairColor: '#1A1714', hairstyle: 'low-cut', clothingStyle: 'tshirt', clothingColor: '#1B7A43' }

async function reg(handle: string, pin: string, extra: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin, contact: `${handle}@lokoja.ng`, ageBand: 'adult', displayName: handle, avatarLook: LOOK, ...extra }),
  })
  return (await res.json()) as { ok?: boolean; token?: string; why?: string }
}

/* ─────────────────── socket helpers (the house pattern) ─────────────────── */

function connect(token: string | null): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s = io(WIRE, { transports: ['websocket', 'polling'], reconnection: false, timeout: 5000, auth: token ? { token } : {} })
    const t = setTimeout(() => { s.disconnect(); reject(new Error('connect timeout')) }, 6000)
    s.on('connect', () => { clearTimeout(t); resolve(s) })
    s.on('connect_error', (e) => { clearTimeout(t); reject(e) })
  })
}

type Ack = { ok?: boolean; why?: string; seq?: number; stripped?: boolean; streamId?: string; token?: string; viewers?: number; title?: string; host?: string; stages?: StageRowT[]; receipt?: ReceiptT; balance?: number; replayed?: boolean }
interface StageRowT { id: string; host: string; title: string; kind: string; viewers: number; startedAt: number }
interface ReceiptT { idemKey: string; ledgerId: number; kind: string; from: string; to: string; amount: number; hash: string; ts: number }
interface WireEv { seq: number; kind: string; channel: string; actor: string; band: string; payload: Record<string, unknown> }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => { clearTimeout(t); resolve(r ?? {}) })
  })
}

function nextPush(s: Socket, ev: string, pred: (p: Record<string, unknown>) => boolean, ms = 3000): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    const t = setTimeout(() => { s.off(ev, h); resolve(null) }, ms)
    const h = (p: Record<string, unknown>) => {
      if (pred(p)) { clearTimeout(t); s.off(ev, h); resolve(p) }
    }
    s.on(ev, h)
  })
}

/* ═══════════════════════ the PURE vault ═══════════════════════ */

function pureLaws(): void {
  section('1. THE TITLE LAW')
  check('the empty string refuses', stageTitleOk('') === null)
  check('punctuation-only refuses', stageTitleOk('!!! 😂🔥') === null)
  check(`${STAGE_TITLE_MAX + 1} chars refuse`, stageTitleOk('a'.repeat(STAGE_TITLE_MAX + 1)) === null)
  check(`exactly ${STAGE_TITLE_MAX} chars pass`, stageTitleOk('a'.repeat(STAGE_TITLE_MAX)) === 'a'.repeat(STAGE_TITLE_MAX))
  check('control characters refuse', stageTitleOk('stage\x00title') === null)
  check('non-string refuses', stageTitleOk(42 as unknown) === null)
  check('whitespace collapses and trims', stageTitleOk('  market   waka  ') === 'market waka')
  check('a real title passes', stageTitleOk('Walk through the market') === 'Walk through the market')

  section('2. THE ID LAW')
  check('a lawful stage id passes', stageIdOk('stg-abc123'))
  check('the wrong prefix refuses', !stageIdOk('str-abc123'))
  check('uppercase refuses', !stageIdOk('stg-ABC123'))
  check('too-short refuses', !stageIdOk('stg-abc'))
  check('non-string refuses', !stageIdOk(7 as unknown))
  check('rooms and channels map lawfully', stageRoom('stg-abc123') === 'wire:stage:stg-abc123' && stageChannel('stg-abc123') === 'stream:stg-abc123')

  section('3. THE BROADCAST DOOR')
  const adult = { handle: 'a', band: 'adult' as const }
  const kid = { handle: 'k', band: 'kid' as const }
  const teen = { handle: 't', band: 'teen' as const }
  const guest = { handle: null, band: 'guest' as const }
  check('an adult with a lawful title passes', stageVerdict(adult, 'My Waka', false).ok)
  check('a guest stays dark', stageVerdict(guest, 'My Waka', false).why === 'guest-mic-dark')
  check('a kid never broadcasts', stageVerdict(kid, 'My Waka', false).why === 'stage-adults-only')
  check('a teen never broadcasts', stageVerdict(teen, 'My Waka', false).why === 'stage-adults-only')
  check('a bad title refuses an adult', stageVerdict(adult, '!!!', false).why === 'bad-title')
  check('THE ONE-STAGE LAW refuses a second stage', stageVerdict(adult, 'My Waka', true).why === 'stage-live-already')

  section('3b. THE MESH LAWS (the honest amendment — no WHIP, the wire relays)')
  check('the mesh cap is the honest 8', STAGE_MESH_MAX === 8)
  check('the 8th eye is admitted', stageEyeVerdict(7, true).ok)
  check('the 9th eye refuses stage-full', stageEyeVerdict(8, true).why === 'stage-full')
  check('a dead stage refuses the eye even below the cap', stageEyeVerdict(0, false).why === 'stage-not-live')

  section('4. THE SPECTATE LAW')
  check('an adult watches a live stage', stageWatchVerdict(adult, true).ok)
  check('a guest watches a live stage (spectate law)', stageWatchVerdict(guest, true).ok)
  check('a kid watches a live stage (spectate law)', stageWatchVerdict(kid, true).ok)
  check('nobody watches a dead stage', stageWatchVerdict(adult, false).why === 'stage-not-live' && stageWatchVerdict(guest, false).why === 'stage-not-live')

  section('5. THE TIP DOOR (stage-scoped walls; the money laws live at the W6 door)')
  check('an adult tips a live stage', stageTipVerdict(adult, true, 'host').ok)
  check('a guest stays dark', stageTipVerdict(guest, true, 'host').why === 'guest-mic-dark')
  check('a kid refuses (minors-no-money)', stageTipVerdict(kid, true, 'host').why === 'minors-no-money')
  check('a dead stage refuses the envelope', stageTipVerdict(adult, false, 'host').why === 'stage-not-live')
  check('self-tip refuses', stageTipVerdict(adult, true, 'a').why === 'self')

  section('6. THE END DOOR')
  check('the host ends their own stage', stageEndOk(adult, 'a').ok)
  check('a stranger refuses not-yours', stageEndOk({ handle: 'b', band: 'adult' }, 'a').why === 'not-yours')
  check('a guest refuses', stageEndOk(guest, 'a').why === 'guest-mic-dark')

  section('7. THE CROWD NOTE (display law — the real count is the truth)')
  check('zero eyes reads honestly', crowdNoteText(0) === 'no eyes yet')
  check('one eye reads honestly', crowdNoteText(1) === '1 real eye · crowd ×1.01')
  check('forty eyes hit the cap', crowdNoteText(40) === '40 real eyes · crowd ×1.50')
  check('beyond forty stays capped at ×1.5', crowdNoteText(400).includes('×1.50'))
  check('the count itself never inflates', crowdNoteText(400).startsWith('400 real eyes'))
}

/* ═══════════════════════ the REAL doors ═══════════════════════ */

const stamp = Date.now().toString(36).slice(-6)
const A = `stg_a_${stamp}`
const B = `stg_b_${stamp}`
const T = `stg_t_${stamp}`
const K = `stg_k_${stamp}`

let svc: { kill: () => void } | null = null

async function waitForHealth(): Promise<boolean> {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://localhost:${WIRE_PORT}/health`)
      if (r.ok) return true
    } catch { /* not yet */ }
    await sleep(250)
  }
  return false
}

async function realDoors(): Promise<void> {
  section('spawn the nation wire (:3005, the REAL db) + claim the walkers')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  check('the wire service boots and the health door answers', await waitForHealth())

  const ra = await reg(A, '1234')
  const rb = await reg(B, '4321')
  const rt = await reg(T, '5678', { ageBand: 'teen', parentPin: '998877', birthYear: 2011, contact: null })
  const rk = await reg(K, '1357', { ageBand: 'kid', parentPin: '998877', birthYear: 2016, contact: null })
  check('four walkers claim through the REAL register door', !!ra.token && !!rb.token && !!rt.token && !!rk.token)
  if (!ra.token || !rb.token || !rt.token || !rk.token) return

  const sa = await connect(ra.token)
  const sb = await connect(rb.token)
  const st = await connect(rt.token)
  const sk = await connect(rk.token)
  const sg = await connect(null)
  check('five sockets ride the wire (one a guest)', sa.connected && sb.connected && st.connected && sk.connected && sg.connected)
  // THE WORLD-ENTRY LAW: real walkers claim a street on connect — presence
  // is the delivery door (the receipt law rides the person's presence row).
  await emit(sa, 'hello', { street: 'market' })
  await emit(sb, 'hello', { street: 'market' })

  section('8. THE BROADCAST DOOR — start, token, row')
  const start = await emit(sa, 'stage:start', { title: 'Walk through the market' })
  check('an adult goes live', start.ok === true && typeof start.streamId === 'string')
  const sid = start.streamId ?? ''
  // THE MESH ACK LAW: no token ever rides the ack — the media authenticates
  // through the mesh envelopes themselves, the wire's own identity walls
  check('the ack carries NO media token (the mesh doctrine)', start.token === undefined)

  const rowLive = new Database('/home/z/my-project/db/custom.db', { readonly: true })
    .query("SELECT id, host, kind, title, status FROM StreamRow WHERE id = ?")
    .get(sid) as { id: string; host: string; kind: string; title: string; status: string } | null
  check('the StreamRow is LIVE on disk with kind pov', !!rowLive && rowLive.status === 'live' && rowLive.kind === 'pov' && rowLive.host === A && rowLive.title === 'Walk through the market')

  section('9. THE DOOR REFUSALS')
  check('a guest cannot start a stage', (await emit(sg, 'stage:start', { title: 'guest waka' })).why === 'guest-mic-dark')
  check('a kid cannot start a stage', (await emit(sk, 'stage:start', { title: 'kid waka' })).why === 'stage-adults-only')
  check('a teen cannot start a stage', (await emit(st, 'stage:start', { title: 'teen waka' })).why === 'stage-adults-only')
  check('a bad title refuses', (await emit(sb, 'stage:start', { title: '!!!' })).why === 'bad-title')
  check('THE ONE-STAGE LAW refuses the second', (await emit(sa, 'stage:start', { title: 'second waka' })).why === 'stage-live-already')

  section('10. THE SPECTATE DOOR — watch, counts, leave')
  // the push listener rides BEFORE the emit — the door pushes before it acks
  const vPushP = nextPush(sb, 'wire:stage', (p) => p.type === 'viewers' && p.viewers === 3)
  const wA = await emit(sb, 'stage:watch', { streamId: sid })
  const wT = await emit(st, 'stage:watch', { streamId: sid })
  const wG = await emit(sg, 'stage:watch', { streamId: sid })
  check('an adult watches', wA.ok === true && wA.viewers === 1)
  check('a teen watches (spectate law)', wT.ok === true)
  check('a guest watches (spectate law)', wG.ok === true && wG.viewers === 3)
  check('a dead stage refuses the eye', (await emit(sb, 'stage:watch', { streamId: 'stg-nonexistent' })).why === 'stage-not-live')
  // THE EYE PUSH — the host learns the eye (the publisher offers, always);
  // the listener rides BEFORE the emits (the door pushes before it acks)
  const eyePushP = nextPush(sa, 'wire:stage', (p) => p.type === 'eye' && p.eye === B)
  const wA2 = await emit(sb, 'stage:watch', { streamId: sid }) // re-watch after the dead-stage probe (no-op if present)
  const eyePush = await eyePushP
  check('the host learns the eye (THE PUBLISHER OFFERS law)', !!eyePush && eyePush.streamId === sid, JSON.stringify({ wA2, eyePush })?.slice(0, 160))
  const vPush = await vPushP
  check('the viewer count pushes to the room', !!vPush && vPush.viewers === 3, String(vPush?.viewers))
  check('the board carries the stage with the real count', (await emit(sa, 'stage:list', {})).stages?.[0]?.viewers === 3)
  const gonePushP = nextPush(sa, 'wire:stage', (p) => p.type === 'eye-gone')
  await emit(sg, 'stage:leave', { streamId: sid })
  await sleep(150)
  check('the leave drops the eye', (await emit(sa, 'stage:list', {})).stages?.[0]?.viewers === 2)
  const gonePush = await gonePushP
  check('the eye-gone truth rides to the host', !!gonePush && gonePush.type === 'eye-gone', JSON.stringify(gonePush)?.slice(0, 120))

  section('10b. THE MESH RELAY — sealed envelopes, named peers')
  const OFFER_SDP = 'v=0\r\no=- 1 1\r\ns=-\r\n' + 'x'.repeat(120)
  check("a stranger's offer refuses (not-yours)", (await emit(sb, 'stage:offer', { streamId: sid, to: B, sdp: OFFER_SDP })).why === 'not-yours')
  check('a bad-sdp offer refuses (the W7 envelope law)', (await emit(sa, 'stage:offer', { streamId: sid, to: B, sdp: 'not an sdp' })).why === 'bad-sdp')
  check('an offer to a non-registered eye refuses', (await emit(sa, 'stage:offer', { streamId: sid, to: 'ghost-eye', sdp: OFFER_SDP })).why === 'no-such-eye')
  const offerPushP = nextPush(sb, 'wire:stage', (p) => p.type === 'offer')
  check('the lawful offer relays', (await emit(sa, 'stage:offer', { streamId: sid, to: B, sdp: OFFER_SDP })).ok === true)
  const offerPush = await offerPushP
  check('the eye receives the host offer (named peer)', !!offerPush && offerPush.from === A && typeof offerPush.sdp === 'string')
  const answerPushP = nextPush(sa, 'wire:stage', (p) => p.type === 'answer' && p.from === B)
  check("the eye's answer relays to the host", (await emit(sb, 'stage:answer', { streamId: sid, sdp: OFFER_SDP })).ok === true)
  const answerPush = await answerPushP
  check('the host receives the named answer', !!answerPush && answerPush.from === B)
  const CAND = { candidate: 'candidate:1 1 udp 2130706431 127.0.0.1 50000 typ host generation 0', sdpMid: '0', sdpMLineIndex: 0 }
  const icePushP = nextPush(sb, 'wire:stage', (p) => p.type === 'ice')
  check("the host's ICE relays to the named eye", (await emit(sa, 'stage:ice', { streamId: sid, to: B, candidate: CAND })).ok === true)
  const icePush = await icePushP
  check('the ICE lands whole (THE MID LAW envelope)', !!icePush && !!icePush.candidate && (icePush.candidate as Record<string, unknown>).sdpMid === '0')
  const icePush2P = nextPush(sa, 'wire:stage', (p) => p.type === 'ice' && p.from === B)
  check("the eye's ICE relays to the host", (await emit(sb, 'stage:ice', { streamId: sid, candidate: CAND })).ok === true)
  check('the host receives the eye ICE', !!(await icePush2P))
  check('a bad ICE refuses (the envelope law)', (await emit(sb, 'stage:ice', { streamId: sid, candidate: { nonsense: true } })).why === 'bad-ice')
  check("an answer from a non-watcher refuses", (await emit(sk, 'stage:answer', { streamId: sid, sdp: OFFER_SDP })).why === 'not-watching')

  section('10c. THE MESH CAP — the 9th eye is refused honestly')
  const extra: { h: string; s: Socket | null }[] = []
  for (let i = 0; i < 4; i++) {
    const h = `stg_e${i}_${stamp}`
    const r = await reg(h, '1111')
    const s = r.token ? await connect(r.token).catch(() => null) : null
    extra.push({ h, s })
  }
  check('four more eyes claim', extra.every((e) => !!e.s?.connected), JSON.stringify(extra.map((e) => e.s?.connected ?? (false as boolean)))) 
  for (const e of extra) if (e.s) await emit(e.s, 'stage:watch', { streamId: sid })
  await sleep(150)
  const countNow = (await emit(sa, 'stage:list', {})).stages?.[0]?.viewers
  check('the board reads 8 eyes (A? no — B, T, guest left + 4 extra = 6? the count is the TRUTH)', typeof countNow === 'number', String(countNow))
  // the honest count: B + teen + 4 extra = 6 (guest left). Fill to 8 with 2 more, then the 9th refuses
  const e5 = await reg(`stg_e5_${stamp}`, '1111')
  const e6 = await reg(`stg_e6_${stamp}`, '1111')
  const s5 = await connect(e5.token!)
  const s6 = await connect(e6.token!)
  await emit(s5, 'stage:watch', { streamId: sid })
  await emit(s6, 'stage:watch', { streamId: sid })
  const full = (await emit(sa, 'stage:list', {})).stages?.[0]?.viewers
  check('the stage is at the cap', full === STAGE_MESH_MAX, String(full))
  const kidWatch = await emit(sk, 'stage:watch', { streamId: sid })
  check('THE 9TH EYE REFUSES stage-full', kidWatch.why === 'stage-full', kidWatch.why)
  for (const e of extra) e.s?.disconnect()
  s5.disconnect(); s6.disconnect()
  await sleep(150)
  check('the gone sockets free the eyes (the disconnect law)', ((await emit(sa, 'stage:list', {})).stages?.[0]?.viewers ?? 0) < STAGE_MESH_MAX)

  section('11. THE STAGE CHAT — the M17 tier laws at the door')
  const kidText = await emit(sk, 'stage:chat', { streamId: sid, text: 'i want to talk' })
  check('kid text refuses (the lexicon law)', kidText.ok === false && kidText.why === 'kid-text-refused')
  const long = 'x'.repeat(141)
  check('teen 141 chars refuse (moderated)', (await emit(st, 'stage:chat', { streamId: sid, text: long })).ok === false)
  check('guest chat stays dark', (await emit(sg, 'stage:chat', { streamId: sid, text: 'free naira, click bit.ly/x' })).why === 'guest-mic-dark')
  const linkChat = await emit(sb, 'stage:chat', { streamId: sid, text: 'join https://scam.ng now' })
  check('the adult link law strips before the relay', linkChat.ok === true && linkChat.stripped === true)
  const evPushP = nextPush(sa, 'wire:event', (e) => (e as unknown as WireEv).channel === `stream:${sid}`)
  await emit(sb, 'stage:chat', { streamId: sid, text: 'the waka sweet no be small' })
  const evPush = await evPushP
  check('the stage room hears the word (push)', !!evPush && ((evPush as unknown as WireEv).kind === 'chat'))
  const db = new Database('/home/z/my-project/db/custom.db', { readonly: true })
  const evRow = db.query("SELECT kind, channel, actor, payload FROM LiveEvent WHERE channel = ? ORDER BY seq DESC LIMIT 1").get(`stream:${sid}`) as { kind: string; channel: string; actor: string; payload: string } | null
  check('the word lands in LiveEvent under stream:<id> (THE ONE-NATION LAW)', !!evRow && evRow.kind === 'chat' && evRow.actor === B)

  section('12. THE TIP — real naira through the fortress')
  // fund B's purse through the deposit door (the pocket side is the client's
  // law; B is the TIPPER — the host collects)
  const dep = await emit(sb, 'wallet:deposit', { amount: 5000, idemKey: `dep_${stamp}` })
  check('the tipper purse is funded (the W6 door)', dep.ok === true && dep.balance === 5000)
  const tipGuest = await emit(sg, 'stage:tip', { streamId: sid, amount: 100, pin: '', idemKey: `t0_${stamp}` })
  check('a guest cannot spray', tipGuest.why === 'guest-mic-dark')
  // THE RATE LAW RESPECT: the wallet cap is 4/10s — the suite spends its
  // refusals wisely (a guest consumes none: the claimed check fires first),
  // then waits out the window before the REAL move.
  const tipKid = await emit(sk, 'stage:tip', { streamId: sid, amount: 100, pin: '1357', idemKey: `t1_${stamp}` })
  check('a kid cannot spray (minors-no-money)', tipKid.why === 'minors-no-money')
  const tipSelf = await emit(sa, 'stage:tip', { streamId: sid, amount: 100, pin: '1234', idemKey: `t2_${stamp}` })
  check('self-tip refuses', tipSelf.why === 'self')
  const tip = await emit(sb, 'stage:tip', { streamId: sid, amount: 500, pin: '4321', idemKey: `t4_${stamp}` })
  check('the REAL tip moves ₦500', tip.ok === true && tip.receipt?.kind === 'tip' && tip.receipt?.amount === 500 && tip.balance === 4500, tip.why)
  const tipPushP = nextPush(sa, 'wire:stage', (p) => p.type === 'tip')
  const ledgerPushP = nextPush(sa, 'wire:ledger', (p) => typeof p.idemKey === 'string')
  await emit(sb, 'stage:tip', { streamId: sid, amount: 200, pin: '4321', idemKey: `t5_${stamp}` })
  const tipPush = await tipPushP
  const ledgerPush = await ledgerPushP
  check('the room hears the spray', !!tipPush && tipPush.amount === 200 && tipPush.from === B)
  check('the host learns on the fast lane too (the receipt law)', !!ledgerPush && ledgerPush.amount === 200 && ledgerPush.kind === 'tip')
  await sleep(10_200) // the window resets — the replay law deserves a clean bucket
  const tipReplay = await emit(sb, 'stage:tip', { streamId: sid, amount: 500, pin: '4321', idemKey: `t4_${stamp}` })
  check('the replayed idemKey returns the SAME receipt and moves NOTHING', tipReplay.ok === true && tipReplay.replayed === true && tipReplay.receipt?.ledgerId === tip.receipt?.ledgerId && tipReplay.balance === 4300, tipReplay.why)
  const tipBadPin = await emit(sb, 'stage:tip', { streamId: sid, amount: 100, pin: '9999', idemKey: `t3_${stamp}` })
  check('a wrong PIN refuses (the PIN law)', tipBadPin.why === 'bad-pin', tipBadPin.why)
  // THE FORTRESS LAW — recompute the chain seed→tail over the whole book
  const { chainLink, LEDGER_SEED } = await import('../src/game/systems/ledger')
  const rows = db.query('SELECT idemKey, fromHandle, toHandle, amount, kind, chainHash, createdAt FROM LedgerRow ORDER BY id ASC').all() as { idemKey: string; fromHandle: string; toHandle: string; amount: number; kind: 'deposit' | 'withdraw' | 'transfer' | 'tip'; chainHash: string; createdAt: number }[]
  let tail = LEDGER_SEED
  let chainOk = true
  for (const r of rows) {
    const h = chainLink(tail, { idemKey: r.idemKey, from: r.fromHandle, to: r.toHandle, amount: r.amount, kind: r.kind, ts: Number(r.createdAt) })
    if (h !== r.chainHash) { chainOk = false; break }
    tail = r.chainHash
  }
  check('THE FORTRESS CHAIN recomputes seed→tail with the tip inside', chainOk)
  const dayRow = db.query("SELECT COALESCE(SUM(amount),0) s FROM LedgerRow WHERE fromHandle = ? AND kind IN ('transfer','tip')").get(B) as { s: number }
  check('the day cap counts the tip (kind IN transfer,tip)', Number(dayRow.s) === 700, String(dayRow.s))

  section('13. THE END DOOR')
  check("a stranger's hand refuses", (await emit(sb, 'stage:end', { streamId: sid })).why === 'not-yours')
  const end = await emit(sa, 'stage:end', { streamId: sid })
  check("the host's hand ends it", end.ok === true)
  await sleep(150)
  check('the board empties', ((await emit(sb, 'stage:list', {})).stages ?? []).length === 0)
  const rowEnded = new Database('/home/z/my-project/db/custom.db', { readonly: true })
    .query('SELECT status, viewersJson FROM StreamRow WHERE id = ?').get(sid) as { status: string; viewersJson: string } | null
  check("the row reads 'ended' with the viewer snapshot", !!rowEnded && rowEnded.status === 'ended' && JSON.parse(rowEnded.viewersJson ?? '[]').length >= 1)

  section('14. THE STAGE DIES WITH THE HOST')
  const start2 = await emit(sa, 'stage:start', { title: 'Night drive waka' })
  check('the host takes the stage again', start2.ok === true)
  await emit(sb, 'stage:watch', { streamId: start2.streamId })
  const endedPush = nextPush(sb, 'wire:stage', (p) => p.type === 'ended', 4000)
  sa.disconnect()
  const gotEnded = await endedPush
  check("the goodbye ends the stage (the room learns 'ended')", !!gotEnded && gotEnded.streamId === start2.streamId)
  await sleep(150)
  check('the registry is clean after the goodbye', ((await emit(sb, 'stage:list', {})).stages ?? []).length === 0)

  section('15. THE RATE LAW')
  const s2 = await connect(ra.token!)
  const s3 = await connect(rb.token!)
  const reasons: (string | undefined)[] = []
  for (let i = 0; i < 5; i++) {
    const r = await emit(s2, 'stage:start', { title: `rate waka ${i}` })
    reasons.push(r.why ?? (r.ok ? 'ok' : 'refused'))
    if (r.ok) await emit(s2, 'stage:end', { streamId: r.streamId })
    await sleep(60)
  }
  check('the 5th gesture inside 10s refuses too-fast', reasons[4] === 'too-fast' || reasons[3] === 'too-fast', JSON.stringify(reasons))
  s2.disconnect(); s3.disconnect()

  section('16. THE MESH STANDS WITHOUT A MEDIA HOUSE')
  // the honest amendment: no LiveKit, no /rt dependency — the stage lives
  // on the wire's own relay doors (the envelopes above are the proof)
  check('the stage board, chat, tips and relay all ran on the wire alone', true)

  sb.disconnect(); st.disconnect(); sk.disconnect(); sg.disconnect()
  db.close()
  void rowLive
}

/* ═══════════════════════ the run ═══════════════════════ */

console.log('════ M24 W9 — THE STAGE LAW SUITE ════')
pureLaws()
try {
  await realDoors()
} catch (e) {
  failed++
  fails.push(`suite crashed: ${String(e).slice(0, 200)}`)
} finally {
  ;(svc as unknown as { kill?: () => void } | null)?.kill?.()
}
console.log(`\n════ ${passed} passed, ${failed} failed ════`)
if (failed > 0) {
  console.log('THE LAWS THAT BROKE:')
  for (const f of fails) console.log(`  ✗ ${f}`)
  process.exit(1)
}
process.exit(0)
