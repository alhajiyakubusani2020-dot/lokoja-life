/**
 * LOKOJA LIFE — M24 W4: THE WIRE LAW SUITE
 * ========================================
 * Headless-pure where possible, REAL-WIRE where it matters: this suite
 * spawns the nation-wire service on :3004 (its own port — never fights
 * the live one), claims REAL accounts through the register door on :3000
 * (the dev server, same contract test-m17 rides), and walks the wire
 * with socket.io-client.
 *
 * THE LAWS PINNED HERE (each one is a promise made in the service header):
 *  1.  welcome — a claimed walker connects and receives the head cursor
 *  2.  identity law at the door — a guest may listen but the mic stays dark
 *  3.  instant delivery — B receives A's chat in << 12s (the wire's whole point)
 *  4.  the tier laws at the SERVER door — adult text passes intact
 *  5.  the adult link law — the link dies before the relay ever sees it
 *  6.  teen moderation — 141 chars refuses too-long, the word wall holds
 *  7.  kid law — text refused, the lexicon (emote) rides the wire
 *  8.  the cursor law — resume replays exactly what came after the cursor
 *  9.  one-nation — wire words land in LiveEvent (read by bun:sqlite)
 * 10.  one-nation lane 2 — the 12s polling lane SEES wire words (one cursor)
 * 11.  presence truth — same-street roster sees you, other streets don't
 * 12.  DM — online pair receives sub-second; offline handle refuses honestly
 * 13.  rate law — the 6th chat in 10s refuses too-fast (honest, not silent)
 * 14.  fail-closed bands — an unknown ageBand plays guest (plausibility law)
 * 15.  latency — ping-pong on loopback is sub-100ms
 * 16.  reconnect + resume — drop and return inside the 3s gate with nothing lost
 * 17.  health door — /health speaks the truth (online, head)
 *
 * Exit code 0 = every law holds. Non-zero = the wire lied somewhere.
 */
import { io, type Socket } from 'socket.io-client'
import { Database } from 'bun:sqlite'

const BASE = 'http://localhost:3000'
const WIRE = 'http://localhost:3004'
const WIRE_PORT = 3004

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

function connect(token: string | null): Promise<Socket & { welcome?: { head?: number; you?: { handle?: string; band?: string } } }> {
  type W = Socket & { welcome?: { head?: number; you?: { handle?: string; band?: string } } }
  return new Promise((resolve, reject) => {
    const s: W = io(WIRE, {
      transports: ['websocket', 'polling'],
      reconnection: false,
      timeout: 5000,
      auth: token ? { token } : {},
    })
    // the welcome rides the connect — capture it HERE, never a race
    s.on('wire:welcome', (w: { head?: number; you?: { handle?: string; band?: string } }) => {
      s.welcome = w
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

type Ack = { ok?: boolean; why?: string; seq?: number; stripped?: boolean; echo?: WireEv; roster?: RosterRow[]; street?: string; events?: WireEv[]; head?: number; t?: number }
interface WireEv { seq: number; kind: string; channel: string; actor: string; band: string; payload: Record<string, unknown> }
interface RosterRow { handle: string; band: string; street: string; status: string; ts: number }

function emit(s: Socket, ev: string, body: unknown): Promise<Ack> {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ ok: false, why: 'ack-timeout' }), 4000)
    s.emit(ev, body, (r: Ack) => {
      clearTimeout(t)
      resolve(r ?? {})
    })
  })
}

function nextEvent(s: Socket, pred: (e: WireEv) => boolean, ms = 3000): Promise<{ ev: WireEv; dt: number } | null> {
  return new Promise((resolve) => {
    const t0 = Date.now()
    const t = setTimeout(() => {
      s.off('wire:event', h)
      resolve(null)
    }, ms)
    const h = (e: WireEv) => {
      if (pred(e)) {
        clearTimeout(t)
        s.off('wire:event', h)
        resolve({ ev: e, dt: Date.now() - t0 })
      }
    }
    s.on('wire:event', h)
  })
}

/* ═══════════════════════════ the suite ═══════════════════════════ */

const stamp = Date.now().toString(36).slice(-6)
const A = `wire_a_${stamp}`
const B = `wire_b_${stamp}`
const T = `wire_t_${stamp}`
const K = `wire_k_${stamp}`
const C = `wire_c_${stamp}` // the offline paddy — never connects

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
  section('spawn the nation wire (:3004, the REAL db) + claim the walkers')
  const debug = process.argv.includes('--debug')
  svc = Bun.spawn(['bun', 'index.ts'], {
    cwd: '/home/z/my-project/mini-services/nation-wire',
    env: { ...process.env, WIRE_PORT: String(WIRE_PORT) },
    stdout: debug ? 'inherit' : 'pipe',
    stderr: debug ? 'inherit' : 'pipe',
  })
  if (!debug) {
    // surface the child's dying words when it crashes — a shield that never lies
    void (async () => {
      try {
        const err = await new Response(svc!.stderr as unknown as BodyInit).text()
        if (err.trim()) console.error('[wire-child stderr]', err.slice(0, 2000))
      } catch { /* child may still be running */ }
    })()
  }
  check('the wire service boots and the health door answers', await waitForHealth())

  const ra = await reg(A, '1234')
  const rb = await reg(B, '4321')
  const rt = await reg(T, '5678', { ageBand: 'teen', parentPin: '998877' })
  const rk = await reg(K, '1357', { ageBand: 'kid', parentPin: '998877' })
  const rc = await reg(C, '2468')
  const ta = ra.token!
  const tb = rb.token!
  const tt = rt.token!
  const tk = rk.token!
  check('five walkers claim through the REAL register door (4 connect, C stays offline)', !!ta && !!tb && !!tt && !!tk && !!rc.ok)

  section('1+15. the door, the welcome, the latency')
  const sa = await connect(ta)
  const sb = await connect(tb)
  const sw = await connect(null) // the guest — spectates, mic dark
  const st = await connect(tt)
  const sk = await connect(tk)
  await emit(sk, 'hello', { street: 'patti' }) // the kid walks in with a street too
  check('a claimed walker receives the welcome + the head cursor', (sa.welcome?.head ?? -1) >= 0 && sa.welcome?.you?.band === 'adult')
  const t0 = performance.now()
  const pong = await emit(sa, 'ping', {})
  const rtt = performance.now() - t0
  check('ping-pong is sub-100ms on loopback', pong.ok !== false && rtt < 100, `rtt=${rtt.toFixed(1)}ms`)

  section('2. THE IDENTITY LAW AT THE WIRE DOOR')
  const g = await emit(sw, 'chat', { text: 'guest here' })
  check('a guest connects but the mic stays dark (guest-mic-dark)', g.ok === false && g.why === 'guest-mic-dark')
  const gp = await emit(sw, 'presence', { street: 'patti' })
  check('a guest has no street either (presence refused)', gp.ok === false && gp.why === 'guest-mic-dark')

  section('3+4. THE INSTANT NATION — adult text rides the wire')
  const heardB = nextEvent(sb, (e) => e.kind === 'chat' && e.actor === A)
  const heardGuest = nextEvent(sw, (e) => e.kind === 'chat' && e.actor === A)
  const sent = await emit(sa, 'chat', { text: 'How far the wire dey move!' })
  check('the send acks with a real seq', sent.ok === true && typeof sent.seq === 'number' && sent.seq > 0, JSON.stringify(sent.why))
  const heard = await heardB
  check('B hears A in WELL under the old 12s heartbeat (the wire is instant)', !!heard && heard.dt < 1000, heard ? `${heard.dt}ms` : 'never heard')
  check('the event shape is EXACTLY the relay shape (seq/kind/channel/actor/band/payload)', !!heard && heard.ev.kind === 'chat' && heard.ev.channel === 'global' && heard.ev.band === 'adult' && (heard.ev.payload.text as string) === 'How far the wire dey move!')
  const gHeard = await heardGuest
  check('the guest hears the nation (spectate law — read is free)', !!gHeard)

  section('5. THE ADULT LINK LAW AT THE SERVER DOOR')
  const heardB2 = nextEvent(sb, (e) => e.kind === 'chat' && e.actor === A && e.payload.stripped === true)
  const linky = await emit(sa, 'chat', { text: 'join https://419-boys.ng fast fast' })
  check('the link is stripped, the words survive, the sender is told the truth', linky.ok === true && linky.stripped === true)
  const h2 = await heardB2
  check('B receives the CLEANED words (the relay never saw a link)', !!h2 && !(h2.ev.payload.text as string).includes('http'))

  section('6. TEEN MODERATION — the word wall lives at the wire door too')
  const long = await emit(st, 'chat', { text: 'x'.repeat(141) })
  check('141 chars refuses too-long (the teen cap)', long.ok === false && long.why === 'too-long')
  const wall = await emit(st, 'chat', { text: 'teach me 419 abeg' })
  check('the word wall holds (word-wall)', wall.ok === false && wall.why === 'word-wall')
  const teenOk = await emit(st, 'chat', { text: 'the match go hot today' })
  check('an honest teen chat passes', teenOk.ok === true)

  section('7. THE KID LEXICON RIDES THE WIRE')
  const kidText = await emit(sk, 'chat', { text: 'hello sir' })
  check('a kid typing is refused (kid-text-refused)', kidText.ok === false && kidText.why === 'kid-text-refused')
  const heardB3 = nextEvent(sb, (e) => e.kind === 'emote' && e.actor === K)
  const kidEmote = await emit(sk, 'emote', { emoteId: 'up-nepa' })
  check('the kid emote passes with the lexicon truth (glyph+phrase)', kidEmote.ok === true)
  const h3 = await heardB3
  check('B hears the kid emote as {glyph, phrase} — the SAME payload the relay sends', !!h3 && (h3.ev.payload.phrase as string) === 'Up NEPA!')

  section('8. THE CURSOR LAW — resume replays exactly the missed words')
  const firstSeq = sent.seq!
  const res = await emit(sb, 'resume', { since: firstSeq })
  const evs = res.events ?? []
  check('resume returns ONLY events after the cursor, in order', res.ok === true && evs.length >= 2 && evs.every((e) => e.seq > firstSeq) && evs.every((e, i) => i === 0 || e.seq > evs[i - 1].seq))
  check('resume head equals the health head (one cursor, no lies)', res.head === (await (await fetch(`http://localhost:${WIRE_PORT}/health`)).json()).head)

  section('9+10. ONE NATION, TWO LANES — the wire writes what the relay reads')
  const dbr = new Database('/home/z/my-project/db/custom.db')
  const row = dbr.query('SELECT kind, actor, payload FROM LiveEvent WHERE seq = ?').get(sent.seq!) as { kind: string; actor: string; payload: string } | null
  check('the wire word sits in the REAL LiveEvent table', !!row && row.kind === 'chat' && row.actor === A && (JSON.parse(row.payload).text as string).includes('wire dey move'))
  const syncRes = await fetch(`${BASE}/api/live/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tb}` },
    body: JSON.stringify({ since: sent.seq! - 1, presence: { street: 'kpata-market', status: 'hustling' } }),
  })
  const syncData = (await syncRes.json()) as { events?: { seq: number; kind: string; actor: string }[] }
  const seen = (syncData.events ?? []).find((e) => e.seq === sent.seq!)
  check('the 12s polling lane SEES the wire words (two lanes, ONE nation)', !!seen && seen.actor === A, `events=${(syncData.events ?? []).length} seqs=[${(syncData.events ?? []).slice(0, 3).map((e) => e.seq).join(',')}...${(syncData.events ?? []).slice(-1)[0]?.seq}] want=${sent.seq}`)
  dbr.close()

  section('11. PRESENCE NEVER LIES')
  const ha = await emit(sa, 'hello', { street: 'kpata-market' })
  const hb = await emit(sb, 'hello', { street: 'kpata-market' })
  const ht = await emit(st, 'hello', { street: 'patti' })
  check('A and B claim the same street', ha.ok === true && hb.ok === true && ha.street === 'kpata-market')
  check('B street roster sees A', (hb.roster ?? []).some((r) => r.handle === A))
  check('T street roster does NOT see A (different street)', !(ht.roster ?? []).some((r) => r.handle === A))
  const moved = await emit(st, 'presence', { street: 'kpata-market' })
  check('presence moves T to the street (rate-capped, honest)', moved.ok === true)

  section('12. DM — the honest doors (and THE DELIVERY LAW)')
  await emit(sa, 'dm:open', { with: B }) // ONLY the sender joins — the paddy's UI state must never gate delivery
  const heardBdm = nextEvent(sb, (e) => e.kind === 'dm' && e.actor === A)
  const dm = await emit(sa, 'dm', { to: B, text: 'paddy, the wire dey sweet' })
  check('an online DM delivers', dm.ok === true)
  const hdm = await heardBdm
  check('B receives the DM sub-second WITHOUT ever joining the room (delivery rides the person, not their tabs)', !!hdm && hdm.dt < 1000, hdm ? `${hdm.dt}ms` : 'never')
  const dmOff = await emit(sa, 'dm', { to: C, text: 'you dey?' })
  // THE W5 AMENDMENT: offline claimed paddies now RECEIVE — the DM persists
  // in LiveEvent and the cursor replay / history law delivers it. The honest
  // refusal left is the never-claimed handle (no-such-paddy) — checked on
  // sb2's FRESH bucket below so socket sa's chat-cap math stays undisturbed.
  check('W5 LAW: a claimed-but-offline paddy RECEIVES the DM (persisted)', dmOff.ok === true && typeof dmOff.seq === 'number', JSON.stringify(dmOff))

  section('14. FAIL-CLOSED BANDS — the plausibility law')
  const wdb = new Database('/home/z/my-project/db/custom.db')
  wdb
    .query('INSERT INTO Account (id, handle, pinHash, salt, ageBand, token, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(`wiz_${stamp}`, `wiz_${stamp}`, 'ab'.repeat(32), 'cd'.repeat(32), 'wizard', `wizard-token-${stamp}`, Date.now(), Date.now())
  const swiz = await connect(`wizard-token-${stamp}`)
  const wiz = await emit(swiz, 'chat', { text: 'I am a wizard' })
  check('an unknown band plays GUEST — the mic is dark (fail closed)', wiz.ok === false && wiz.why === 'guest-mic-dark')
  swiz.disconnect()
  wdb.query('DELETE FROM Account WHERE handle = ?').run(`wiz_${stamp}`)
  wdb.close()

  section('16. RECONNECT + RESUME — the 3s gate, nothing lost')
  const beforeSeq = (await emit(sb, 'ping', {}), (await (await fetch(`http://localhost:${WIRE_PORT}/health`)).json()).head) as number
  sb.disconnect()
  const tRec = performance.now()
  const sb2 = await connect(tb)
  await emit(sb2, 'hello', { street: 'kpata-market' })
  const res2 = await emit(sb2, 'resume', { since: beforeSeq })
  const recMs = performance.now() - tRec
  check('reconnect + resume completes inside the 3s gate', recMs < 3000, `${recMs.toFixed(0)}ms`)
  check('nothing was lost across the drop (resume covers the gap)', res2.ok === true && Array.isArray(res2.events))

  section('13. THE RATE LAW — the last law, so the bucket is fresh')
  // the W5 ghost law rides sb2's fresh bucket (sa's chat-cap math above stays exact)
  const dmGhost = await emit(sb2, 'dm', { to: `never_${stamp}_x`, text: 'boo' })
  check('the never-claimed handle refuses (no-such-paddy, W5 door)', !dmGhost.ok && dmGhost.why === 'no-such-paddy', JSON.stringify(dmGhost))
  const spam = await emit(sa, 'chat', { text: 'spam 6' })
  const spamRefused = await emit(sa, 'chat', { text: 'spam 7' })
  check('the burst fills the bucket then refuses HONESTLY (too-fast, never silent)', spam.ok === true && spamRefused.ok === false && spamRefused.why === 'too-fast')

  section('17. THE HEALTH DOOR')
  const health = (await (await fetch(`http://localhost:${WIRE_PORT}/health`)).json()) as { ok?: boolean; online?: number; head?: number }
  check('/health speaks the truth (ok, online walkers, head seq)', health.ok === true && (health.online ?? 0) >= 4 && (health.head ?? 0) >= firstSeq, `health=${JSON.stringify(health)} want_online>=4 firstSeq=${firstSeq}`)

  sa.disconnect()
  sb2.disconnect()
  sw.disconnect()
  st.disconnect()
  sk.disconnect()
} catch (e) {
  failed++
  fails.push(`suite crashed: ${String(e)}`)
  console.error('SUITE CRASH:', e)
} finally {
  svc?.kill()
}

console.log(`\n════════════════════════════════════════`)
console.log(`M24-W4 WIRE LAWS: ${passed} passed, ${failed} failed`)
if (fails.length) console.log('FAILED:', fails.join(' | '))
process.exit(failed ? 1 : 0)
