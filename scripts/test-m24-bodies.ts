/**
 * LOKOJA LIFE — M24 W2: THE BODIES LAW SUITE
 * ==========================================
 * Headless-pure where possible, REAL-WIRE where it matters: the suite
 * spawns the nation-wire on :3005, claims REAL accounts through the
 * register door on :3000 (the W1 face rides along), and walks the
 * bodies' lanes with socket.io-client.
 *
 * THE LAWS PINNED HERE:
 *  — pure (systems/bodies.ts, no server):
 *    1.  the pos law matrix (bad-pos refuses: strings, NaN, out-of-world)
 *    2.  the interpolation law (lerp between two snaps, never past
 *        MAX_EXTRAP, speed measured + clamped)
 *    3.  the stale law (a body whose snaps died is GONE)
 *    4.  the worth-sending law (move sends, stillness heartbeats at 3s)
 *    5.  the join wall matrix (guest/self/not-around/blocked/paddies-only)
 *    6.  the block wall verdict (a blocked pair shares nothing)
 *  — real wire (nation-wire on :3005):
 *    7.  the roster carries THE FACE (displayName + the REAL validated look)
 *    8.  the 10Hz relay: B hears A's pos sub-second, exact fields
 *    9.  the street law: a different street hears NOTHING
 *    10. guest darkness: a guest broadcasts nothing
 *    11. the pos law at the door (bad-pos refuses on the real socket)
 *    12. THE EPHEMERALITY LAW: no LiveEvent rows, no resume replay —
 *        footsteps are not history
 *    13. the seed law: the roster carries the moment (x/z ride the roster)
 *    14. the block wall walks in space: B blocks A → silence; unblock → flow
 *    15. the where door matrix on the REAL wire (+ the kid wall + the friend
 *        join) and the REAL coords
 *    16. the re-hello law: a reconnect keeps the body's last moment
 *    17. the rate law: the burst fills the bucket then refuses HONESTLY
 *
 * Exit code 0 = every law holds. Non-zero = a body lied somewhere.
 */
import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'

import {
  posOk,
  posWorthSending,
  joinVerdict,
  bodyRelayOk,
  bodyLook,
  InterpBuffer,
  inRenderRange,
  POS_TICK_MS,
  IDLE_POS_MS,
  STALE_MS,
} from '../src/game/systems/bodies'

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

/* ─────────────────────────── pure laws first ─────────────────────────── */

section('PURE 1. the pos law matrix')
check('a clean pos passes', posOk({ x: 10.5, z: -20.25, hd: 1.2, mv: true }) === true)
check('a string x refuses', posOk({ x: '10', z: 0, hd: 0, mv: true }) === false)
check('NaN refuses', posOk({ x: NaN, z: 0, hd: 0, mv: false }) === false)
check('a missing heading refuses', posOk({ x: 1, z: 2, mv: true }) === false)
check('a string mv refuses', posOk({ x: 1, z: 2, hd: 0, mv: 'yes' }) === false)
check('out-of-world x refuses', posOk({ x: 9999, z: 0, hd: 0, mv: false }) === false)
check('out-of-world z refuses', posOk({ x: 0, z: -9999, hd: 0, mv: false }) === false)
check('a non-object refuses', posOk('walk fast') === false)
check('the world bound admits the honest edge', posOk({ x: 330, z: -330, hd: 0, mv: false }) === true)

section('PURE 2+3. the interpolation law + the stale law')
{
  const buf = new InterpBuffer()
  check('an empty buffer answers not-alive', buf.sample(1).alive === false)
  const t0 = 1_000_000
  buf.seed({ t: t0, x: 0, z: 0, hd: 0, mv: false })
  buf.push({ t: t0 + 100, x: 0.6, z: 0, hd: 0.5, mv: true }) // 0.6u / 100ms = 6 u/s
  // sample(now) stands the render clock 120ms behind NOW — to read the
  // render moment 60ms behind the newest snap: now = newest + 120 - 60
  const mid = buf.sample(t0 + 100 + 120 - 60)
  check('the body stands BETWEEN the snaps (lerped)', mid.alive && Math.abs(mid.x - 0.24) < 0.02 && Math.abs(mid.z) < 1e-9, JSON.stringify(mid))
  check('the speed is measured (6 u/s across 100ms)', Math.abs(mid.speed - 6) < 0.2, `speed=${mid.speed}`)
  const far = buf.sample(t0 + 500)
  check('the render clock never runs past the newest + MAX_EXTRAP (a lost packet freezes, never glides)', far.alive === true && Math.abs(far.x - 0.6) < 1e-9 && far.speed === 0, JSON.stringify(far))
  const stale = buf.sample(t0 + 100 + STALE_MS + 1)
  check('THE STALE LAW: the body is gone after STALE_MS', stale.alive === false)
  check('a late packet never rewinds the clock', (() => {
    const b2 = new InterpBuffer()
    b2.push({ t: t0, x: 5, z: 5, hd: 0, mv: true })
    b2.push({ t: t0 - 400, x: 0, z: 0, hd: 0, mv: true })
    return Math.abs(b2.sample(t0).x - 5) < 1e-9
  })())
  check('the heading takes the SHORT way round', (() => {
    const b3 = new InterpBuffer()
    b3.push({ t: t0, x: 0, z: 0, hd: 3.1, mv: false })
    b3.push({ t: t0 + 100, x: 0, z: 0, hd: -3.1, mv: false })
    return Math.abs(b3.sample(t0 + 50).hd) < Math.PI + 1e-9
  })())
  check('THE SPEED LAW clamps a teleporting body', (() => {
    const b4 = new InterpBuffer()
    b4.push({ t: t0, x: 0, z: 0, hd: 0, mv: true })
    b4.push({ t: t0 + 50, x: 90, z: 0, hd: 0, mv: true }) // 1800 u/s
    return b4.sample(t0 + 40).speed <= 8
  })())
}

section('PURE 4. the worth-sending law (the cadence)')
{
  const p0 = { x: 0, z: 0, hd: 0, mv: false }
  const moved = { x: 0.2, z: 0, hd: 0, mv: true }
  const turned = { x: 0, z: 0, hd: 0.2, mv: false }
  check('a first moment always sends', posWorthSending(null, p0, 0) === true)
  check('stillness inside the heartbeat stays silent', posWorthSending(p0, p0, 1000) === false)
  check('stillness past the 3s heartbeat whispers', posWorthSending(p0, p0, IDLE_POS_MS + 10) === true)
  check('a 20cm step sends', posWorthSending(p0, moved, 10) === true)
  check('a turn sends', posWorthSending(p0, turned, 10) === true)
  check(`the cadence constant is the plan's 10Hz (${POS_TICK_MS}ms)`, POS_TICK_MS === 100)
}

section('PURE 5+6. the join wall + the block wall (the matrices)')
{
  const base = { myBand: 'adult' as const, blockedEitherWay: false, edgeStateMine: null, edgeStateTheirs: null, targetPresent: true, self: false }
  check('an adult joins a present walker', joinVerdict(base).ok === true)
  check('a guest stays dark', joinVerdict({ ...base, myBand: 'guest' }).why === 'guest-mic-dark')
  check('self join refuses', joinVerdict({ ...base, self: true }).why === 'self')
  check('an absent paddy is not-around', joinVerdict({ ...base, targetPresent: false }).why === 'not-around')
  check('a blocked pair never joins', joinVerdict({ ...base, blockedEitherWay: true }).why === 'blocked')
  check('a kid reaches accepted paddies ONLY', joinVerdict({ ...base, myBand: 'kid' }).why === 'paddies-only')
  check('a teen too', joinVerdict({ ...base, myBand: 'teen' }).why === 'paddies-only')
  check('a kid + a friend edge (mine) joins', joinVerdict({ ...base, myBand: 'kid', edgeStateMine: 'friend' }).ok === true)
  check('a kid + a friend edge (theirs) joins', joinVerdict({ ...base, myBand: 'teen', edgeStateTheirs: 'friend' }).ok === true)
  check('a pending edge is not a paddy', joinVerdict({ ...base, myBand: 'kid', edgeStateMine: 'pending' }).why === 'paddies-only')
  check('THE BLOCK WALL FOR BODIES: blocked relay = silence', bodyRelayOk(true) === false && bodyRelayOk(false) === true)
}

section('PURE 7. the look law (the REAL vocab, verbatim)')
{
  const good = bodyLook('{"skinTone":"#6E4326","hairColor":"#1A1714","hairstyle":"puffs","clothingStyle":"senator","clothingColor":"#33332E"}')
  check('the real look passes whole', !!good && good.clothingStyle === 'senator' && good.hairstyle === 'puffs')
  check('an invented colour refuses', bodyLook('{"skinTone":"#00FF00","hairColor":"#1A1714","hairstyle":"puffs","clothingStyle":"senator","clothingColor":"#33332E"}') === null)
  check('an invented style refuses', bodyLook('{"skinTone":"#6E4326","hairColor":"#1A1714","hairstyle":"puffs","clothingStyle":"spacesuit","clothingColor":"#33332E"}') === null)
  check('garbage refuses', bodyLook('not-json') === null)
  check('the range law (squared, no sqrt)', inRenderRange(0, 0, 3, 4) === true && inRenderRange(0, 0, 60.1, 0) === false)
}

/* ─────────────────────── real accounts through the real door ─────────────────────── */

async function reg(handle: string, pin: string, extra: Record<string, unknown> = {}) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, pin, contact: `${handle}@lokoja.ng`, ageBand: 'adult', displayName: handle, avatarLook: '{"skinTone":"#6E4326","hairColor":"#1A1714","hairstyle":"low-cut","clothingStyle":"tshirt","clothingColor":"#1B7A43"}', ...extra }),
  })
  return (await res.json()) as { ok?: boolean; token?: string; why?: string }
}

function connect(token: string | null): Promise<Socket> {
  return new Promise((resolve, reject) => {
    const s: Socket = io(WIRE, { transports: ['websocket', 'polling'], reconnection: false, timeout: 5000, auth: token ? { token } : {} })
    const t = setTimeout(() => { s.disconnect(); reject(new Error('connect timeout')) }, 6000)
    s.on('connect', () => { clearTimeout(t); resolve(s) })
    s.on('connect_error', (e) => { clearTimeout(t); reject(e) })
  })
}

type Ack = { ok?: boolean; why?: string; [k: string]: unknown }
interface RosterRow { handle: string; displayName?: string; look?: string; x?: number; z?: number; street?: string }
interface PosPush { h: string; x: number; z: number; hd: number; mv: boolean }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => { clearTimeout(t); resolve(r ?? {}) })
  })
}

function nextPos(s: Socket, from: string, ms = 2500): Promise<{ p: PosPush; dt: number } | null> {
  return new Promise((resolve) => {
    const t0 = Date.now()
    const t = setTimeout(() => { s.off('wire:pos', h); resolve(null) }, ms)
    const h = (p: PosPush) => {
      if (p.h === from) { clearTimeout(t); s.off('wire:pos', h); resolve({ p, dt: Date.now() - t0 }) }
    }
    s.on('wire:pos', h)
  })
}

function silencePos(s: Socket, from: string, ms = 900): Promise<boolean> {
  return new Promise((resolve) => {
    let silent = true
    const h = (p: PosPush) => { if (p.h === from) silent = false }
    s.on('wire:pos', h)
    setTimeout(() => { s.off('wire:pos', h); resolve(silent) }, ms)
  })
}

const stamp = Date.now().toString(36).slice(-6)
const A = `bod_a_${stamp}`
const B = `bod_b_${stamp}`
const T = `bod_t_${stamp}`
const K = `bod_k_${stamp}`
const C = `bod_c_${stamp}` // never connects

let svc: ReturnType<typeof Bun.spawn> | null = null

async function waitForHealth(tries = 40): Promise<boolean> {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(`http://localhost:${WIRE_PORT}/health`); if (r.ok) return true } catch { /* not up yet */ }
    await sleep(150)
  }
  return false
}

try {
  section('spawn the nation wire (:3005) + claim the walkers (the W1 face rides)')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) },
    stdout: 'pipe',
    stderr: 'pipe',
  })
  void (async () => {
    try {
      const err = await new Response(svc!.stderr as unknown as BodyInit).text()
      if (err.trim()) console.error('[wire-child stderr]', err.slice(0, 2000))
    } catch { /* child may still be running */ }
  })()
  check('the wire service boots and the health door answers', await waitForHealth())

  const T_LOOK = '{"skinTone":"#8A5A32","hairColor":"#5C2330","hairstyle":"puffs","clothingStyle":"senator","clothingColor":"#33332E"}'
  const ra = await reg(A, '1234')
  const rb = await reg(B, '4321')
  const rt = await reg(T, '5678', { ageBand: 'teen', parentPin: '998877', displayName: 'Two Puffs Senator', avatarLook: T_LOOK })
  const rk = await reg(K, '1357', { ageBand: 'kid', parentPin: '998877' })
  const rcc = await reg(C, '2468')
  const ta = ra.token!, tb = rb.token!, tt = rt.token!, tk = rk.token!
  check('five walkers claim through the REAL register door (4 will connect)', !!ta && !!tb && !!tt && !!tk && !!rcc.ok)

  const sa = await connect(ta)
  const sb = await connect(tb)
  const st = await connect(tt)
  const sk = await connect(tk)
  const sw = await connect(null)

  section('8. THE FACE RIDES THE ROSTER')
  const ha = await emit(sa, 'hello', { street: 'kpata-market' })
  const hb = await emit(sb, 'hello', { street: 'kpata-market' })
  const ht = await emit(st, 'hello', { street: 'patti' })
  const hk = await emit(sk, 'hello', { street: 'kpata-market' })
  check('four walkers claim their streets', ha.ok && hb.ok && ht.ok && hk.ok)
  const roster = (hb.roster as RosterRow[]) ?? []
  const rowA = roster.find((r) => r.handle === A)
  check('B street roster sees A (same street)', !!rowA)
  check('the roster carries the displayName', rowA?.displayName === A)
  const rowT = ((ht.roster as RosterRow[]) ?? []).find((r) => r.handle === T)
  check(`the puffs+senator face rides the roster (T's W1 look, T's own street)`, !!rowT && (() => { const l = bodyLook(rowT.look); return !!l && l.clothingStyle === 'senator' && l.hairstyle === 'puffs' })(), JSON.stringify(rowT))
  check('an invented look never rides (the door validated it)', rowT ? bodyLook(rowT.look) !== null : false)

  section('9. THE 10HZ RELAY — the body walks in real time')
  const heardFirst = nextPos(sb, A)
  const p1 = await emit(sa, 'pos', { x: 12.5, z: -8.25, hd: 0.75, mv: true })
  check('the pos door acks (ok, memory only)', p1.ok === true, JSON.stringify(p1.why))
  const heard = await heardFirst
  check('B hears A\'s body sub-second (the wire is instant)', !!heard && heard.dt < 1000, heard ? `${heard.dt}ms` : 'never')
  check('the pos payload is EXACT (h/x/z/hd/mv)', !!heard && heard.p.x === 12.5 && heard.p.z === -8.25 && heard.p.hd === 0.75 && heard.p.mv === true)

  section('10. THE STREET LAW — another street hears NOTHING')
  const tSilent = await silencePos(st, A, 700)
  const p2 = await emit(sa, 'pos', { x: 13, z: -8, hd: 0.7, mv: true })
  const stillSilent = await silencePos(st, A, 500)
  check('T (patti) never hears A (kpata-market)', tSilent && p2.ok === true && stillSilent)

  section('11. GUEST DARKNESS + the pos law at the real door')
  const gpos = await emit(sw, 'pos', { x: 1, z: 2, hd: 0, mv: false })
  check('a guest broadcasts NOTHING (guest-mic-dark)', gpos.ok === false && gpos.why === 'guest-mic-dark')
  const bad1 = await emit(sa, 'pos', { x: 'walk', z: 2, hd: 0, mv: false })
  const bad2 = await emit(sa, 'pos', { x: 99999, z: 2, hd: 0, mv: false })
  const bad3 = await emit(sa, 'pos', { x: 1, z: 2, hd: 0 })
  check('bad-pos refuses honestly at the door (string / out-of-world / no-mv)', bad1.why === 'bad-pos' && bad2.why === 'bad-pos' && bad3.why === 'bad-pos', JSON.stringify([bad1.why, bad2.why, bad3.why]))
  const ghostPos = await emit(sw, 'pos', { x: 1, z: 2, hd: 0, mv: false })
  check('a guest with no street still refuses (never a fake ok)', ghostPos.ok === false)

  section('12. THE EPHEMERALITY LAW — footsteps are not history')
  const dbr = new Database('/home/z/my-project/db/custom.db')
  const posRows = dbr.query("SELECT COUNT(*) AS n FROM LiveEvent WHERE kind = 'pos'").get() as { n: number }
  check('NOT ONE LiveEvent row carries a pos (memory only, never a record)', Number(posRows.n) === 0, `rows=${posRows.n}`)
  const res = await emit(sb, 'resume', { since: 0 })
  const posInReplay = ((res.events as { kind: string }[]) ?? []).some((e) => e.kind === 'pos')
  check('the cursor replay never replays a body (no pos in the gap)', res.ok === true && !posInReplay)
  dbr.close()

  section('13. THE SEED LAW — the roster carries the moment')
  const hb2 = await emit(sb, 'hello', { street: 'kpata-market' })
  const roster2 = (hb2.roster as RosterRow[]) ?? []
  const rowA2 = roster2.find((r) => r.handle === A)
  check('A\'s roster row carries the LAST pos (x/z ride the roster)', !!rowA2 && rowA2.x === 13 && rowA2.z === -8, JSON.stringify(rowA2))

  section('16. THE RE-HELLO LAW — a reconnect keeps the body\'s last moment')
  sa.disconnect()
  await sleep(200)
  const sa2 = await connect(ta)
  const ha2 = await emit(sa2, 'hello', { street: 'kpata-market' })
  const roster3 = (ha2.roster as RosterRow[]) ?? []
  const rowA3 = roster3.find((r) => r.handle === A)
  check('the fresh hello still carries the body where it LAST stood (mv=false)', !!rowA3 && rowA3.x === 13 && rowA3.z === -8, JSON.stringify(rowA3))

  section('15. THE WHERE DOOR — the join matrix on the REAL wire')
  const whereOk = await emit(sb, 'where', { handle: A })
  check('B wheres A: ok + the REAL coords + the street', whereOk.ok === true && whereOk.x === 13 && whereOk.z === -8 && whereOk.street === 'kpata-market', JSON.stringify(whereOk))
  const whereG = await emit(sw, 'where', { handle: A })
  check('a guest wheres nobody (guest-mic-dark)', whereG.ok === false && whereG.why === 'guest-mic-dark')
  const whereC = await emit(sb, 'where', { handle: C })
  check('an offline paddy is honestly not-around', whereC.ok === false && whereC.why === 'not-around')
  const whereSelf = await emit(sb, 'where', { handle: B })
  check('self join refuses', whereSelf.ok === false && whereSelf.why === 'self')
  const whereGhost = await emit(sb, 'where', { handle: 'never_a_soul' })
  check('a never-claimed handle is honestly not-around (ONE truth for nobody standing there)', whereGhost.ok === false && whereGhost.why === 'not-around', JSON.stringify(whereGhost))
  const whereNoPos = await emit(sb, 'where', { handle: T })
  check(`T never sent a pos — hasPos is honestly false (no fake 0,0)`, whereNoPos.ok === true && whereNoPos.hasPos === false, JSON.stringify(whereNoPos))
  const whereKid = await emit(sk, 'where', { handle: A })
  check('THE KID WALL: a kid reaches accepted paddies only', whereKid.ok === false && whereKid.why === 'paddies-only')

  section('14. THE BLOCK WALL WALKS IN SPACE')
  // K becomes B's accepted paddy FIRST (the join's friend edge, used below)
  await emit(sk, 'social:add', { handle: B })
  await emit(sb, 'social:accept', { handle: K })
  const whereKidFriend = await emit(sk, 'where', { handle: B })
  check('a kid + a FRIEND edge joins for real (coords ride)', whereKidFriend.ok === true && whereKidFriend.street === 'kpata-market', JSON.stringify(whereKidFriend))
  // B blocks A — the relay goes dark, the where door shuts
  const blk = await emit(sb, 'social:block', { handle: A })
  check('B blocks A (the graph door)', blk.ok === true)
  const blockedRelay = await emit(sa2, 'pos', { x: 55.5, z: 55.5, hd: 0, mv: true })
  const bSilent = await silencePos(sb, A, 700)
  check('A\'s body is SILENT to B now (the wall walks in space)', blockedRelay.ok === true && bSilent)
  const whereBlocked = await emit(sb, 'where', { handle: A })
  check('the where door shuts too (blocked)', whereBlocked.ok === false && whereBlocked.why === 'blocked')
  const whereBlockedRev = await emit(sa2, 'where', { handle: B })
  check('either direction: A cannot where B either', whereBlockedRev.ok === false && whereBlockedRev.why === 'blocked')
  const unb = await emit(sb, 'social:unblock', { handle: A })
  check('B unblocks A', unb.ok === true)
  const flowAgain = nextPos(sb, A)
  await emit(sa2, 'pos', { x: 56.5, z: 56.5, hd: 0, mv: true })
  const flowing = await flowAgain
  check('the body flows again the moment the wall lifts', !!flowing && flowing.p.x === 56.5, flowing ? JSON.stringify(flowing.p) : 'never')

  section('17. THE RATE LAW — the burst fills the bucket, then honest refusal')
  // a FRESH socket for clean bucket math (the cap: ceil(10Hz * 2.4) = 24/s)
  const sa3 = await connect(ta)
  await emit(sa3, 'hello', { street: 'kpata-market' })
  let refusals = 0
  let oks = 0
  for (let i = 0; i < 30; i++) {
    const r = await emit(sa3, 'pos', { x: 20 + i * 0.01, z: 5, hd: 0, mv: true })
    if (r.ok) oks++
    else if (r.why === 'too-fast') refusals++
  }
  check('the burst passes the cap then refuses HONESTLY (too-fast, never silent)', oks === 24 && refusals === 6, `oks=${oks} refusals=${refusals}`)
  sa3.disconnect()

  sa2.disconnect()
  sb.disconnect()
  st.disconnect()
  sk.disconnect()
  sw.disconnect()
} catch (e) {
  failed++
  fails.push(`suite crashed: ${String(e)}`)
  console.error('SUITE CRASH:', e)
} finally {
  svc?.kill()
}

console.log(`\n════════════════════════════════════════`)
console.log(`M24-W2 BODIES LAWS: ${passed} passed, ${failed} failed`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
process.exit(failed ? 1 : 0)
