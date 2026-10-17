/**
 * LOKOJA LIFE — M24 W5: THE CONNECT LAW SUITE
 * ============================================
 * The nation's social graph under oath. Two layers, same discipline as
 * the W4 suite: PURE laws headless (the verdict matrix), then the REAL
 * wire on :3004 with REAL accounts claimed through the REAL register
 * door on :3000, and the REAL FriendRow/ReportRow rows read back with
 * bun:sqlite.
 *
 * THE LAWS PINNED HERE (each promise made in socialgraph.ts / index.ts):
 *  1.  request verdict matrix — self, bad-handle, blocked both ways,
 *      already, already-sent, and THE MUTUAL LAW (their request + my
 *      gesture = paddies in one write)
 *  2.  accept verdict — nothing accepts what was never requested
 *  3.  DM verdict — guest dark, their block wall, THE KID WALL (minors
 *      reach accepted paddies only), adults reach the unblocked
 *  4.  report verdict — unknown reasons coerce to 'other', never crash
 *  5.  the door: A adds B → pending; B's push (wire:social 'request')
 *      rides the PERSON instantly
 *  6.  the mutual law at the door: B adds A back → BOTH 'friend' in the
 *      same write, push 'accepted' lands on A
 *  7.  server truth: the FriendRow pair EXISTS on disk (bun:sqlite read)
 *  8.  symmetric list: social:list agrees on both sides
 *  9.  the block law at the door: blocked paddy's add refuses
 *      they-blocked-you; their DM refuses blocked; unblock reopens the DM
 * 10.  THE KID WALL at the door: kid DMs a stranger → paddies-only;
 *      after accept → the word lands
 * 11.  THE OFFLINE TRUTH: a DM to a claimed-but-offline paddy LANDS
 *      (persisted); a DM to a never-claimed handle refuses no-such-paddy
 * 12.  THE HISTORY LAW: social:dms returns the thread rows with REAL ts,
 *      and both kinds (dm + hangout)
 * 13.  the hangout postcard: invite → push 'hangout' + persisted kind
 * 14.  the relay lane: /api/live/action social-list + dm carry the SAME
 *      rows (two lanes, one nation, N10)
 * 15.  the report queue: ReportRow lands, reason coerced, status open
 * 16.  the remove law: unfriend deletes BOTH edges
 * 17.  the rate law: the 9th social action in 10s refuses too-fast
 * 18.  THE PRIVACY LAW: a third party's resume replay never leaks the
 *      dm: channel rows of another pair
 *
 * Exit code 0 = every law holds. Non-zero = the graph lied somewhere.
 */
import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'
import {
  requestVerdict, acceptVerdict, dmVerdict, reportVerdict, dmChannel, dmChannelInvolves,
} from '../src/game/systems/socialgraph'

const BASE = 'http://localhost:3000'
const WIRE = 'http://localhost:3004'
const WIRE_PORT = 3004
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
    body: JSON.stringify({ handle, pin, contact: `${handle}@lokoja.ng`, ageBand: 'adult', ...extra }),
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

type Ack = { ok?: boolean; why?: string; state?: string; graph?:unknown; events?: unknown[]; head?: number; t?: number; seq?: number }
interface WireEv { seq: number; kind: string; channel: string; actor: string; band: string; payload: Record<string, unknown> }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => {
      clearTimeout(t)
      resolve(r ?? {})
    })
  })
}

function nextPush(s: Socket, ev: string, pred: (p: Record<string, unknown>) => boolean, ms = 3000): Promise<Record<string, unknown> | null> {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      s.off(ev, h)
      resolve(null)
    }, ms)
    const h = (p: Record<string, unknown>) => {
      if (pred(p)) {
        clearTimeout(t)
        s.off(ev, h)
        resolve(p)
      }
    }
    s.on(ev, h)
  })
}

/* ═══════════════════════════ the suite ═══════════════════════════ */

const stamp = Date.now().toString(36).slice(-6)
const A = `cnt_a_${stamp}`
const B = `cnt_b_${stamp}`
const C = `cnt_c_${stamp}`
const D = `cnt_d_${stamp}`
const K = `cnt_k_${stamp}`
const Z = `cnt_z_${stamp}` // never connects, but claimed
const PIN = '4321'

let svc: { kill: () => void } | null = null

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

async function main() {
  /* ── layer 1: the pure verdict matrix ── */
  section('the pure laws (systems/socialgraph, headless)')

  const vSelf = requestVerdict('ada', 'ada', null, null)
  check('1a. self-add refuses (self)', !vSelf.ok && vSelf.why === 'self')
  const vBad = requestVerdict('ada', 'no!', null, null)
  check('1b. bad handle refuses (bad-handle)', !vBad.ok && vBad.why === 'bad-handle')
  const vTheyBlocked = requestVerdict('ada', 'musa', null, { ownerHandle: 'musa', peerHandle: 'ada', state: 'blocked', requestedBy: 'musa' })
  check('1c. their block wall refuses (they-blocked-you)', !vTheyBlocked.ok && vTheyBlocked.why === 'they-blocked-you')
  const vYouBlocked = requestVerdict('ada', 'musa', { ownerHandle: 'ada', peerHandle: 'musa', state: 'blocked', requestedBy: 'ada' }, null)
  check('1d. your own wall refuses (you-blocked-them)', !vYouBlocked.ok && vYouBlocked.why === 'you-blocked-them')
  const vAlready = requestVerdict('ada', 'musa', { ownerHandle: 'ada', peerHandle: 'musa', state: 'friend', requestedBy: 'musa' }, { ownerHandle: 'musa', peerHandle: 'ada', state: 'friend', requestedBy: 'musa' })
  check('1e. already paddies refuse (already)', !vAlready.ok && vAlready.why === 'already')
  const vSent = requestVerdict('ada', 'musa', { ownerHandle: 'ada', peerHandle: 'musa', state: 'pending', requestedBy: 'ada' }, { ownerHandle: 'musa', peerHandle: 'ada', state: 'pending', requestedBy: 'ada' })
  check('1f. double send refuses (already-sent)', !vSent.ok && vSent.why === 'already-sent')
  const vMutual = requestVerdict('ada', 'musa', { ownerHandle: 'ada', peerHandle: 'musa', state: 'pending', requestedBy: 'musa' }, { ownerHandle: 'musa', peerHandle: 'ada', state: 'pending', requestedBy: 'musa' })
  check('1g. THE MUTUAL LAW — their pending + my gesture = friend', vMutual.ok && vMutual.kind === 'mutual')
  const vNew = requestVerdict('ada', 'musa', null, null)
  check('1h. clean slate = new request', vNew.ok && vNew.kind === 'new')

  const aBad = acceptVerdict('ada', 'musa', null, null)
  check('2a. accept with no request refuses (not-requested)', !aBad.ok && aBad.why === 'not-requested')
  const aOk = acceptVerdict('ada', 'musa', { ownerHandle: 'ada', peerHandle: 'musa', state: 'pending', requestedBy: 'musa' }, { ownerHandle: 'musa', peerHandle: 'ada', state: 'pending', requestedBy: 'musa' })
  check('2b. accept of a standing request holds', aOk.ok)

  const dGuest = dmVerdict('guest', null, null)
  check('3a. guest mic dark (unclaimed)', !dGuest.ok && dGuest.why === 'unclaimed')
  const dBlocked = dmVerdict('adult', { ownerHandle: 'musa', peerHandle: 'ada', state: 'blocked', requestedBy: 'musa' }, null)
  check('3b. their block wall darkens the DM (blocked)', !dBlocked.ok && dBlocked.why === 'blocked')
  const dKid = dmVerdict('kid', null, null)
  check('3c. THE KID WALL — stranger DM refused (paddies-only)', !dKid.ok && dKid.why === 'paddies-only')
  const dKidFriend = dmVerdict('kid', null, { ownerHandle: 'ada', peerHandle: 'musa', state: 'friend', requestedBy: 'musa' })
  check('3d. kid → accepted paddy flies', dKidFriend.ok)
  const dAdult = dmVerdict('adult', null, null)
  check('3e. adult → unblocked stranger flies', dAdult.ok)

  const rCoerce = reportVerdict('musa', 'weird-reason')
  check('4. report reason coerces to other', rCoerce.ok && rCoerce.reason === 'other')
  check('4b. dmChannel shape is sorted + stable', dmChannel('zoe', 'ada') === 'dm:ada|zoe' && dmChannel('ada', 'zoe') === 'dm:ada|zoe')
  check('4c. dmChannelInvolves law', dmChannelInvolves('dm:ada|zoe', 'zoe') && !dmChannelInvolves('dm:ada|zoe', 'musa'))

  /* ── layer 2: the REAL doors ── */
  section('spawn the nation wire (:3004) + claim the walkers')
  const debug = process.argv.includes('--debug')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) },
    stdout: debug ? 'inherit' : 'pipe',
    stderr: debug ? 'inherit' : 'pipe',
  })
  const up = await waitForHealth()
  check('wire health door answers', up)
  if (!up) throw new Error('wire never came up')

  const regA = await reg(A, PIN)
  const regB = await reg(B, PIN)
  const regC = await reg(C, PIN)
  const regD = await reg(D, PIN)
  const regK = await reg(K, PIN, { ageBand: 'kid', parentPin: '991133' })
  const regZ = await reg(Z, PIN)
  check('six real accounts claimed through the register door', !!(regA.token && regB.token && regC.token && regD.token && regK.token && regZ.token),
    `a:${!!regA.token} b:${!!regB.token} c:${!!regC.token} d:${!!regD.token} k:${!!regK.token} z:${!!regZ.token}`)
  if (!regA.token || !regB.token || !regC.token || !regD.token || !regK.token || !regZ.token) throw new Error('register door failed')

  const sa = await connect(regA.token)
  const sb = await connect(regB.token)
  const sc = await connect(regC.token)
  const sd = await connect(regD.token)
  const sk = await connect(regK.token)
  for (const s of [sa, sb, sc, sd, sk]) await emit(s, 'hello', { street: 'patti', status: 'hustling' })
  await sleep(150)

  section('the graph at the wire door')
  // the push listeners arm BEFORE the emit — the wire is instant, the race
  // is the test's to lose
  const pushBP = nextPush(sb, 'wire:social', (p) => p.type === 'request' && p.from === A)
  const addAB = await emit(sa, 'social:add', { handle: B })
  check('5a. A adds B → pending', addAB.ok === true && addAB.state === 'pending', JSON.stringify(addAB))
  const pushB = await pushBP
  check('5b. B feels the request INSTANTLY (push rides the person)', !!pushB)
  const addABagain = await emit(sa, 'social:add', { handle: B })
  check('5c. double send refuses (already-sent)', !addABagain.ok && addABagain.why === 'already-sent')

  // THE MUTUAL LAW at the door
  const pushAP = nextPush(sa, 'wire:social', (p) => p.type === 'accepted' && p.by === B)
  const addBA = await emit(sb, 'social:add', { handle: A })
  check('6a. B adds A back → BOTH friend in one write', addBA.ok === true && addBA.state === 'friend', JSON.stringify(addBA))
  const pushA = await pushAP
  check('6b. A feels the acceptance (push)', !!pushA)

  // server truth on disk
  const db = new Database(DB_PATH, { readonly: true })
  const edges = db.query('SELECT ownerHandle, peerHandle, state FROM FriendRow WHERE (ownerHandle = ? AND peerHandle = ?) OR (ownerHandle = ? AND peerHandle = ?)').all(A, B, B, A) as { ownerHandle: string; state: string }[]
  check('7. THE FriendRow pair EXISTS on disk, both friend', edges.length === 2 && edges.every((e) => e.state === 'friend'), JSON.stringify(edges))

  const listA = await emit(sa, 'social:list', {})
  const listB = await emit(sb, 'social:list', {})
  const gA = listA.graph as { friends: { handle: string }[] }
  const gB = listB.graph as { friends: { handle: string }[] }
  check('8. symmetric list — each side sees the other once', gA?.friends?.some((f) => f.handle === B) === true && gB?.friends?.some((f) => f.handle === A) === true)

  section('the block law at the door')
  const blockAC = await emit(sa, 'social:block', { handle: C })
  check('9a. A blocks C', blockAC.ok === true)
  const addCA = await emit(sc, 'social:add', { handle: A })
  check('9b. C add refuses (they-blocked-you)', !addCA.ok && addCA.why === 'they-blocked-you', JSON.stringify(addCA))
  const dmCA = await emit(sc, 'dm', { to: A, text: 'abeg' })
  check('9c. C DM refuses (blocked)', !dmCA.ok && dmCA.why === 'blocked', JSON.stringify(dmCA))
  const unblockAC = await emit(sa, 'social:unblock', { handle: C })
  check('9d. A unblocks C', unblockAC.ok === true)
  const dmCA2 = await emit(sc, 'dm', { to: A, text: 'we dey again' })
  check('9e. the DM flies after unblock (adult law)', dmCA2.ok === true, JSON.stringify(dmCA2))

  section('THE KID WALL at the door')
  const dmKD = await emit(sk, 'dm', { to: D, text: 'hello uncle' })
  check('10a. kid DMs a stranger → refused (paddies-only)', !dmKD.ok && dmKD.why === 'paddies-only', JSON.stringify(dmKD))
  await emit(sk, 'social:add', { handle: D })
  await emit(sd, 'social:accept', { handle: K })
  const dmKD2 = await emit(sk, 'dm', { to: D, text: 'now we be paddies' })
  // THE LAW STACK: the kid wall OPENS for accepted paddies, but the M17 tier
  // law still rules the words — kid text is refused (emotes are the lexicon).
  // The honest pin: the refusal is kid-text-refused, NOT paddies-only.
  check('10b. kid → accepted paddy passes the WALL, the tier law still rules the text (kid-text-refused)', !dmKD2.ok && dmKD2.why === 'kid-text-refused', JSON.stringify(dmKD2))

  section('THE OFFLINE TRUTH + the history law')
  const dmAB = await emit(sa, 'dm', { to: B, text: 'paddy we dey' })
  check('11c. the paddy DM lands (the pair speaks first)', dmAB.ok === true, JSON.stringify(dmAB))
  const dmAZ = await emit(sa, 'dm', { to: Z, text: 'you dey offline but the word go wait' })
  check('11a. DM to a claimed-but-offline paddy LANDS', dmAZ.ok === true && typeof dmAZ.seq === 'number', JSON.stringify(dmAZ))
  const dmAGhost = await emit(sa, 'dm', { to: 'never_claimed_404', text: 'boo' })
  check('11b. DM to a never-claimed handle refuses (no-such-paddy)', !dmAGhost.ok && dmAGhost.why === 'no-such-paddy')

  const histB = await emit(sb, 'social:dms', { with: A })
  const histRows = (histB.events ?? []) as { seq: number; kind: string; payload: { text?: string }; ts?: number }[]
  check('12a. history returns the thread rows', histB.ok === true && histRows.length >= 1)
  check('12b. history rows carry REAL timestamps', histRows.length > 0 && histRows.every((r) => typeof r.ts === 'number' && r.ts > 1_600_000_000_000))

  const pushB2P = nextPush(sb, 'wire:social', (p) => p.type === 'hangout' && p.from === A)
  const invAB = await emit(sa, 'social:invite', { to: B, street: 'patti' })
  check('13a. the hangout postcard flies', invAB.ok === true)
  const pushB2 = await pushB2P
  check('13b. B feels the invite (push)', !!pushB2 && (pushB2.street as string) === 'patti')
  const histB2 = await emit(sb, 'social:dms', { with: A })
  const rows2 = (histB2.events ?? []) as { kind: string }[]
  check('13c. the invite persisted as kind hangout', rows2.some((r) => r.kind === 'hangout'))

  section('the relay lane (the same rows, one nation)')
  const relayList = await fetch(`${BASE}/api/live/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regB.token}` },
    body: JSON.stringify({ action: 'social-list', payload: {} }),
  }).then((r) => r.json()) as { ok?: boolean; graph?: { friends: { handle: string }[] } }
  check('14a. relay social-list sees the SAME friend', relayList.ok === true && relayList.graph?.friends?.some((f) => f.handle === A) === true)
  const relayDm = await fetch(`${BASE}/api/live/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${regB.token}` },
    body: JSON.stringify({ action: 'dm', payload: { to: A, text: 'the 12s lane carry am too' } }),
  }).then((r) => r.json()) as { ok?: boolean; seq?: number; why?: string }
  check('14b. relay dm door lands in the SAME LiveEvent rows', relayDm.ok === true && typeof relayDm.seq === 'number', JSON.stringify(relayDm))

  section('the report queue')
  const rep = await emit(sa, 'social:report', { handle: C, reason: 'scam' })
  check('15a. the report files', rep.ok === true)
  const repRow = db.query('SELECT byHandle, targetHandle, reason, status FROM ReportRow WHERE byHandle = ? ORDER BY id DESC LIMIT 1').get(A) as { reason: string; status: string } | null
  check('15b. the ReportRow exists (status open, reason kept)', !!repRow && repRow.reason === 'scam' && repRow.status === 'open')
  const repWeird = await emit(sa, 'social:report', { handle: C, reason: 'weird-thing' })
  const repWeirdRow = db.query('SELECT reason FROM ReportRow WHERE byHandle = ? ORDER BY id DESC LIMIT 1').get(A) as { reason: string } | null
  check('15c. unknown reason coerces to other at the door', repWeird.ok === true && repWeirdRow?.reason === 'other')

  section('the remove law')
  await emit(sc, 'social:add', { handle: D })
  await emit(sd, 'social:accept', { handle: C })
  const remC = await emit(sc, 'social:remove', { handle: D })
  const edgesCD = db.query('SELECT id FROM FriendRow WHERE (ownerHandle = ? AND peerHandle = ?) OR (ownerHandle = ? AND peerHandle = ?)').all(C, D, D, C)
  check('16. unfriend deletes BOTH edges', remC.ok === true && edgesCD.length === 0, `left:${edgesCD.length}`)

  section('the rate law + the privacy law')
  // the social cap is 8/10s — burn it with blocks on fresh handles
  for (let i = 0; i < 8; i++) await emit(sa, 'social:block', { handle: `spam_x_${stamp}_${i}` })
  const tooFast = await emit(sa, 'social:add', { handle: D })
  check('17. the 9th social action in 10s refuses (too-fast)', !tooFast.ok && tooFast.why === 'too-fast', JSON.stringify(tooFast))

  const sz = await connect(regZ.token)
  await emit(sz, 'hello', { street: 'patti', status: 'hustling' })
  const szEvents: unknown[] = []
  sz.on('wire:event', (e: WireEv) => szEvents.push(e))
  // resume inside THIS run's window (head-60) so the replay truly contains
  // the dm rows that were just written — the leak check must be real
  const head = (await (await fetch(`http://localhost:${WIRE_PORT}/health`)).json()) as { head?: number }
  const resZ = await emit(sz, 'resume', { since: Math.max(0, (head.head ?? 0) - 60) })
  const replayed = (resZ.events ?? []) as WireEv[]
  // THE PRIVACY LAW: Z sees Z's OWN mail (the A→Z row MUST be there — the
  // offline delivery proof) and sees ZERO rows from pairs that exclude Z
  const own = replayed.filter((e) => e.channel?.startsWith('dm:') && e.channel.includes(Z))
  const foreign = replayed.filter((e) => e.channel?.startsWith('dm:') && !e.channel.includes(Z))
  check('18a. Z own offline DM arrives via replay (the delivery proof)', own.length >= 1, JSON.stringify(replayed.filter((e) => e.channel?.startsWith('dm:')).slice(0, 2)))
  check('18b. ZERO foreign-pair DMs in Z replay', foreign.length === 0, JSON.stringify(foreign.slice(0, 2)))
  void szEvents

  db.close()
  sa.disconnect()
  sb.disconnect()
  sc.disconnect()
  sd.disconnect()
  sk.disconnect()
  sz.disconnect()
}

try {
  await main()
} catch (e) {
  failed++
  console.error('\nSUITE CRASH:', e instanceof Error ? e.message : e)
} finally {
  // the spawn is typed { kill } — the shield never lies about its handle
  ;(svc as { kill: () => void } | null)?.kill()
}

console.log(`\n════════════════════════════════════════`)
console.log(`M24-W5 CONNECT SUITE: ${passed} passed, ${failed} failed`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
process.exit(failed ? 1 : 0)
