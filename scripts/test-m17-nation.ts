/**
 * LOKOJA LIFE — M17: THE LIVE NATION (test battery)
 * -------------------------------------------------
 * Law blocks:
 *  - THE IDENTITY LAW: guest reads only; kid emotes; teen moderated
 *    text; adult full — hosting/money tables adults only
 *  - THE TIERED CHAT LAW: kid text refused; teen word-wall + 140 cap
 *    + link refused; adult links STRIPPED (URL/phone/crypto), 280 cap
 *  - THE PRESENCE LAW: TTL 90s, stale = gone, roster sorted
 *  - THE STREAM LAW: viewers-as-crowd honest math (cap ×1.5), the
 *    city broadcast schedule deterministic
 *  - THE ASSOCIATION LAW: the kobo-chain seals the books (relabel
 *    breaks the walk), the TWO-KEY law (president alone refuses)
 *  - THE COURT LAW: the verdict is a hash — deterministic twice, no
 *    evidence bias honest, penalty law lands on the liable party
 *  - THE TRADE LAW: self-trade refused, wrong party refused, a gone
 *    partner refuses, a valid accept verdict
 *  - THE AJO LAW: the ladder never skips, the round pays the next
 *    unpaid name, THE DEFAULT PANIC trips past grace, the court fine
 *    is 1.5× + rep 5 and the round still pays
 *  - THE VOICE LAW: adults-only opt-in proximity; minors structurally
 *    false forever
 *  - THE RELAY DOCTRINE: events validate shape/kind/channel/payload-cap
 *  - SAVE v17: the live slice migrates (bare v16 loads at v17)
 *  - REAL HTTP pass: two accounts register, sync, chat (link stripped
 *    server-side too), found a union, dues chain, two-key refusal,
 *    contract + dispute verdict, trade offer/accept, ajo found/join/
 *    pay/ladder, the panics and the court
 * Run: bun scripts/test-m17-nation.ts
 */

import {
  canLive, sanitizeChat, emoteById, EMOTE_LIBRARY,
  presenceAlive, presenceRoster, PRESENCE_TTL_MS,
  crowdMult, broadcastPayout, cityBroadcastFor,
  assocIdFor, assocChainLink, withdrawVerdict, ASSOC_MIN_MEMBERS,
  contractIdFor, courtVerdict, courtPenalty, COURT_FEE,
  tradeIdFor, tradeVerdict,
  ajoIdFor, ajoRoundReady, ajoNextBeneficiary, ajoPanicCheck, ajoCourtFine,
  AJO_PANIC_GRACE_DAYS, AJO_MAX_MEMBERS,
  voiceAllowed, validateEvent, EVENT_PAYLOAD_CAP,
  freshLiveState, type LiveIdentity, type Association, type AjoCircle,
} from '../src/game/systems/live'
import { verifyChain, CHAIN_SEED } from '../src/game/systems/fortress'
import { SaveSystem } from '../src/game/systems/save'

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) { passed++; console.log('  ✓', name) } else { failed++; console.log('  ✗', name) }
}
function section(name: string) { console.log(`\n— ${name} —`) }

const BASE = 'http://localhost:3000'

const GUEST: LiveIdentity = { handle: null, band: 'guest' }
const KID: LiveIdentity = { handle: 'Small Papa', band: 'kid' }
const TEEN: LiveIdentity = { handle: 'Young Huster', band: 'teen' }
const ADULT: LiveIdentity = { handle: 'Mama Ngozi', band: 'adult' }

/* ----------------------------- THE IDENTITY LAW ---------------------------- */

section('THE IDENTITY LAW — the mic opens at claim, the tables at adulthood')
check('a guest reads but nothing else', canLive(GUEST, 'read') && !canLive(GUEST, 'emote') && !canLive(GUEST, 'text'))
check('a kid reads + emotes, never types', canLive(KID, 'read') && canLive(KID, 'emote') && !canLive(KID, 'text'))
check('a teen speaks moderated text', canLive(TEEN, 'text') && canLive(TEEN, 'emote'))
check('an adult speaks full text', canLive(ADULT, 'text'))
check('the money tables are adult-hands-only (host/assoc/trade/ajo)',
  !canLive(TEEN, 'assoc') && !canLive(TEEN, 'trade') && !canLive(TEEN, 'ajo') && !canLive(TEEN, 'host') &&
  canLive(ADULT, 'assoc') && canLive(ADULT, 'trade') && canLive(ADULT, 'ajo') && canLive(ADULT, 'host'))
check('the kid lexicon holds 12 honest phrases', EMOTE_LIBRARY.length === 12)
check('every emote resolves by id', EMOTE_LIBRARY.every((e) => emoteById(e.id) !== null))
check('a fake emote id resolves to nothing', emoteById('hack-the-planet') === null)

/* ---------------------------- THE TIERED CHAT LAW -------------------------- */

section('THE TIERED CHAT LAW — the wall, the cap, the link law')
check('guest text refused (the mic is dark)', sanitizeChat(GUEST, 'hello') === { ok: false, why: 'guest-mic-dark' } as never || sanitizeChat(GUEST, 'hello').why === 'guest-mic-dark')
check('kid text refused (the lexicon speaks)', sanitizeChat(KID, 'let me type').why === 'kid-text-refused')
check('empty text refused', sanitizeChat(ADULT, '   ').why === 'empty')
check('teen 141 chars refused (the 140 wall)', sanitizeChat(TEEN, 'a'.repeat(141)).why === 'too-long')
check('teen 140 chars passes the wall', sanitizeChat(TEEN, 'b'.repeat(140)).ok === true)
check('teen word-wall refuses the 419 opener', sanitizeChat(TEEN, 'abeg do 419 for me').why === 'word-wall')
check('teen links refused outright', sanitizeChat(TEEN, 'check https://scam.ng now').why === 'no-links-ever')
check('adult within the 280 cap passes', sanitizeChat(ADULT, 'market don set today').ok === true)
check('adult 281 chars refused', sanitizeChat(ADULT, 'c'.repeat(281)).why === 'too-long')

const linked = sanitizeChat(ADULT, 'join my group https://whatsapp.com/channel/123 for beta')
check('THE NO-LINKS-EVER LAW: an adult URL is stripped, not passed', linked.ok === true && linked.stripped === true && !linked.text?.includes('https'))
check('the stripped message keeps the honest words', linked.text?.includes('join my group') === true)

const phone = sanitizeChat(ADULT, 'call me 08031234567 sharp sharp')
check('phone numbers never cross the wire', phone.ok === true && phone.stripped === true && !phone.text?.includes('08031234567'))
const crypto = sanitizeChat(ADULT, 'send am to bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')
check('crypto addresses never cross the wire', crypto.ok === true && !crypto.text?.includes('bc1q'))
const onlyLink = sanitizeChat(ADULT, 'https://only-links.ng')
check('a message that is ONLY a link refuses (nothing honest survives)', onlyLink.ok === false && onlyLink.why === 'no-links-ever')

/* ------------------------------ THE PRESENCE LAW --------------------------- */

section('THE PRESENCE LAW — a stale ping is an absent neighbour')
const now = 1_000_000
const roster = [
  { handle: 'zola', street: 'kpata-market', status: 'market' as const, band: 'adult' as const, ts: now - 10_000 },
  { handle: 'bola', street: 'home', status: 'chilling' as const, band: 'teen' as const, ts: now - PRESENCE_TTL_MS - 1 },
  { handle: 'ada', street: 'ganaja-junction', status: 'hustling' as const, band: 'adult' as const, ts: now - 89_000 },
]
check('the TTL law: fresh pings live, the stale die', presenceAlive(roster[0], now) && !presenceAlive(roster[1], now))
const live1 = presenceRoster(roster, now)
check('the roster never lies (2 alive, sorted)', live1.length === 2 && live1[0].handle === 'ada' && live1[1].handle === 'zola')

/* ------------------------------- THE STREAM LAW ---------------------------- */

section('THE STREAM LAW — viewers as crowd, the city takes the mic')
check('zero viewers = the honest base', crowdMult(0) === 1)
check('10 viewers = ×1.125', crowdMult(10) === 1.125)
check('the crowd caps at ×1.5 (40 viewers)', crowdMult(100) === 1.5)
check('broadcastPayout rounds honest', broadcastPayout(1000, 20) === 1250)
check('city broadcast day 1 = the New Year address', cityBroadcastFor(1)?.kind === 'address')
check('city broadcast day 36 = the Mid-Year address', cityBroadcastFor(36)?.title === 'The Mid-Year Address')
check('city broadcast day 60 = election night', cityBroadcastFor(60)?.kind === 'election')
check('a quiet day prints no broadcast', cityBroadcastFor(15) === null)

/* --------------------------- THE ASSOCIATION LAW --------------------------- */

section('THE ASSOCIATION LAW — the sealed books, the two keys')
const assoc: Association = {
  id: assocIdFor('Kpata Traders', 'Mama Ngozi', 12),
  name: 'Kpata Traders', motto: 'one hand no fit', founder: 'Mama Ngozi',
  treasury: 5000, chainTail: 'seed',
  ledger: [], createdDay: 12,
  members: [
    { handle: 'Mama Ngozi', role: 'president', joinedDay: 12 },
    { handle: 'Chief Keke', role: 'secretary', joinedDay: 13 },
    { handle: 'Bola', role: 'member', joinedDay: 14 },
  ],
  contracts: [], 
}
check('the id mints deterministically', assoc.id === assocIdFor('Kpata Traders', 'Mama Ngozi', 12))
check(`the union stands on ${ASSOC_MIN_MEMBERS} members (min-members law)`, assoc.members.length >= ASSOC_MIN_MEMBERS)

// the kobo-chain seals the books
const sig1 = assocChainLink(CHAIN_SEED, 15, 500, 'assoc-dues', 'dues by Bola')
const sig2 = assocChainLink(sig1, 16, -1000, 'assoc-withdraw', 'withdrawal by Mama Ngozi')
check('the chain links deterministically', sig1 === assocChainLink(CHAIN_SEED, 15, 500, 'assoc-dues', 'dues by Bola'))
check('a different move forges a different link', sig1 !== sig2)
const txs = [
  { day: 15, slot: 0, amount: 500, category: 'assoc-dues', label: 'dues by Bola', sig: sig1 },
  { day: 16, slot: 0, amount: -1000, category: 'assoc-withdraw', label: 'withdrawal by Mama Ngozi', sig: sig2 },
]
check('the M14 verifier walks the assoc books clean', verifyChain(txs).ok)
const relabeled = [{ ...txs[0], label: 'dues by Bola (edited)' }, txs[1]]
check('a relabelled dues entry breaks the walk at the exact entry', verifyChain(relabeled).ok === false && verifyChain(relabeled).brokenAt === 0)

// the two-key law
check('the president alone CANNOT open the books', withdrawVerdict(assoc, 'Mama Ngozi', null, 1000).why === 'two-key')
check('co-signing yourself is one key, refused', withdrawVerdict(assoc, 'Mama Ngozi', 'Mama Ngozi', 1000).why === 'two-key')
check('an outsider key refuses', withdrawVerdict(assoc, 'Mama Ngozi', 'Stranger Danger', 1000).why === 'two-key')
check('president + secretary: the books open', withdrawVerdict(assoc, 'Mama Ngozi', 'Chief Keke', 1000).ok === true)
check('a member cannot withdraw at all', withdrawVerdict(assoc, 'Bola', 'Chief Keke', 1000).why === 'not-president')
check('more than the treasury refuses', withdrawVerdict(assoc, 'Mama Ngozi', 'Chief Keke', 999_999).why === 'empty-treasury')
check('a negative amount refuses', withdrawVerdict(assoc, 'Mama Ngozi', 'Chief Keke', -5).why === 'bad-amount')

/* ---------------------------- THE COURT LAW -------------------------------- */

section('THE COURT LAW — the hash that judges')
const contract = {
  id: contractIdFor('supply 20 bags monthly', ['Mama Ngozi', 'Chief Keke'], 20),
  kind: 'coop' as const, parties: ['Mama Ngozi', 'Chief Keke'], terms: 'supply 20 bags monthly',
  stake: 2000, status: 'open' as const, day: 20,
}
check('the contract id mints deterministically', contract.id === contractIdFor('supply 20 bags monthly', ['Mama Ngozi', 'Chief Keke'], 20))
const v1 = courtVerdict(contract, 'the bags never came')
const v2 = courtVerdict(contract, 'the bags never came')
check('the SAME file argues to the SAME verdict (deterministic)', v1 === v2)
check('the verdict is one of the two honest words', v1 === 'kept' || v1 === 'broken')
check('the court fee is honest pocket change', COURT_FEE === 200)

if (v1 === 'broken') {
  const pen = courtPenalty({ ...contract, status: 'disputed', verdict: 'broken' })
  check('a broken verdict lands the stake on the liable party', pen?.liable === 'Chief Keke' && pen.winner === 'Mama Ngozi' && pen.penalty === 2000)
} else {
  check('a kept verdict pays nobody (the contract stands)', courtPenalty({ ...contract, status: 'disputed', verdict: 'kept' }) === null)
}
check('an undisputed contract owes nothing', courtPenalty(contract) === null)

/* ------------------------------ THE TRADE LAW ------------------------------ */

section('THE TRADE LAW — signed events, honest engines')
const offer = {
  id: tradeIdFor('Mama Ngozi', 'Chief Keke', 21, 1),
  from: 'Mama Ngozi', to: 'Chief Keke', giveCash: 5000, wantCash: 0,
  terms: '20 bags at once', status: 'offered' as const, day: 21,
}
check('the trade id mints deterministically per offer moment', offer.id === tradeIdFor('Mama Ngozi', 'Chief Keke', 21, 1))
const warmRoster = [{ handle: 'Mama Ngozi', street: 'kpata-market', status: 'market' as const, band: 'adult' as const, ts: now }]
check('self-trade is structurally false', tradeVerdict({ ...offer, from: 'Chief Keke', to: 'Chief Keke' }, 'Chief Keke', warmRoster, now).why === 'self-trade')
check('the wrong party cannot accept', tradeVerdict(offer, 'Bola', [...warmRoster, { handle: 'Chief Keke', street: 'home', status: 'chilling' as const, band: 'adult' as const, ts: now }], now).why === 'wrong-party')
check('an already-settled trade cannot re-accept', tradeVerdict({ ...offer, status: 'accepted' }, 'Chief Keke', warmRoster, now).why === 'not-offered')
check('a gone partner cannot close (the wire is the truth)', tradeVerdict(offer, 'Chief Keke', [{ ...warmRoster[0], ts: now - PRESENCE_TTL_MS - 5 }], now).why === 'partner-gone')
check('a warm roster closes the trade', tradeVerdict(offer, 'Chief Keke', [...warmRoster, { handle: 'Chief Keke', street: 'home', status: 'chilling' as const, band: 'adult' as const, ts: now }], now).ok === true)

/* ------------------------------ THE AJO LAW -------------------------------- */

section('THE AJO LAW — the ladder, the panic, the guarantee')
const circle: AjoCircle = {
  id: ajoIdFor('Market Women Ajo', 'Mama Ngozi', 22),
  name: 'Market Women Ajo', contribution: 1000,
  order: ['Mama Ngozi', 'Chief Keke', 'Bola'],
  round: 1, roundStartDay: 22, pot: 0, paid: {}, paidThisRound: [], defaulters: [],
  status: 'open', createdDay: 22,
}
check('the circle id mints deterministically', circle.id === ajoIdFor('Market Women Ajo', 'Mama Ngozi', 22))
check('the ladder never reshuffles (order is data)', circle.order[0] === 'Mama Ngozi')
check('a fresh round with zero payers is NOT ready (the pot needs every head)', ajoRoundReady(circle) === false)
check('the ladder pays the first name first', ajoNextBeneficiary(circle) === 'Mama Ngozi')
check('a fresh circle with zero payers does not panic', ajoPanicCheck(circle, 23).panic === false)

const halfPaid: AjoCircle = { ...circle, pot: 1000, paidThisRound: ['Mama Ngozi'] }
check('one payer + a pending member inside grace = no panic', ajoPanicCheck(halfPaid, 23).panic === false)
check(`one payer + a pending member past ${AJO_PANIC_GRACE_DAYS}-day grace = THE PANIC`, ajoPanicCheck(halfPaid, 22 + AJO_PANIC_GRACE_DAYS + 1).panic === true)
check('the panic names the first pending defaulter', ajoPanicCheck(halfPaid, 22 + AJO_PANIC_GRACE_DAYS + 1).defaulter === 'Chief Keke')

const complete = { ...circle, pot: 3000, paidThisRound: ['Mama Ngozi', 'Chief Keke', 'Bola'], defaulters: [] }
check('a full ladder round is ready to pay', ajoRoundReady(complete))
check(`the cap law: ${AJO_MAX_MEMBERS} heads maximum`, AJO_MAX_MEMBERS === 12)
const fine = ajoCourtFine(circle, 'Chief Keke')
check('the court fine is 1.5× the contribution', fine.fine === 1500)
check('the court rep hit is 5', fine.repHit === 5)

/* ------------------------------- THE VOICE LAW ----------------------------- */

section('THE VOICE LAW — adults, opt-in, same street, minors never')
check('a kid NEVER gets voice (structurally false)', voiceAllowed(KID, true, 'kpata-market', 'kpata-market') === false)
check('a teen NEVER gets voice', voiceAllowed(TEEN, true, 'kpata-market', 'kpata-market') === false)
check('a guest NEVER gets voice', voiceAllowed(GUEST, true, 'kpata-market', 'kpata-market') === false)
check('an adult with voice off does not get voice', voiceAllowed(ADULT, false, 'kpata-market', 'kpata-market') === false)
check('an adult opt-in on the SAME street gets voice', voiceAllowed(ADULT, true, 'kpata-market', 'kpata-market') === true)
check('proximity law: a different street does not', voiceAllowed(ADULT, true, 'kpata-market', 'home') === false)
check('no street data does not', voiceAllowed(ADULT, true, null, 'kpata-market') === false)

/* ---------------------------- THE RELAY DOCTRINE --------------------------- */

section('THE RELAY DOCTRINE — distribute, never simulate')
check('a valid chat event passes the shape law', validateEvent({ id: 'e1', kind: 'chat', channel: 'global', actor: 'ada', payload: { text: 'hi' } }).ok === true)
check('a street channel passes', validateEvent({ id: 'e2', kind: 'emote', channel: 'street:kpata-market', actor: 'ada', payload: {} }).ok === true)
check('an unknown kind refuses', validateEvent({ id: 'e3', kind: 'hax', channel: 'global', actor: 'ada', payload: {} }).ok === false)
check('a garbage channel refuses', validateEvent({ id: 'e4', kind: 'chat', channel: 'moon-base', actor: 'ada', payload: {} }).ok === false)
check('a fat payload refuses (the wire stays thin)', validateEvent({ id: 'e5', kind: 'chat', channel: 'global', actor: 'ada', payload: { blob: 'x'.repeat(EVENT_PAYLOAD_CAP + 10) } }).ok === false)
check('a shapeless event refuses', validateEvent({ kind: 'chat' }).ok === false)

/* --------------------------------- SAVE v17 --------------------------------- */

section('SAVE v17 — the live slice joins the ladder')
{
  const mem: Record<string, string> = {}
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => { mem[k] = v },
      removeItem: (k: string) => { delete mem[k] },
    },
  }
  SaveSystem.setFortKey('m17-nation-key-0123456789abcdef')
  // a bare v16 save (pre-live) rides the ladder to v17
  const bare16: Record<string, unknown> = {
    version: 16, createdAt: 1, updatedAt: 2,
    player: { name: 'Silk', gender: 'female' as const, ageBand: 'adult' as const, avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' }, cash: 5000, needs: { health: 100, energy: 90, hunger: 80, mood: 70 }, skills: { hustle: 2, smart: 2, social: 2 }, skillXp: { hustle: 0, smart: 0, social: 0 }, reputation: 10, level: 2, xp: 0, homeId: 'home', jobId: null, activeOpportunities: [], cooldowns: {}, transactions: [], stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }, inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [], vehicles: [], bankBalance: 0, relationships: {} },
    world: { day: 1, timeOfDay: 'morning' as const, weather: 'sunny' as const, currentLocation: 'home' },
    settings: { graphics: 'auto', chill: false, elder: false, music: true, sfx: true },
  }
  mem['lokoja-life:save'] = JSON.stringify(bare16)
  const loaded = SaveSystem.load() as unknown as Record<string, unknown> | null
  check('the bare v16 save loads', loaded !== null)
  check('the ladder walks it to v17', loaded?.version === 17)
  const lv = loaded?.live as ReturnType<typeof freshLiveState> | undefined
  check('the live slice arrives defaulted (cursor 0, mic dark, no memberships)', lv !== undefined && lv.cursor === 0 && lv.voiceOn === false && lv.assocId === null && lv.circles.length === 0)
  check('freshLiveState is honest', freshLiveState().stats.chats === 0 && freshLiveState().finesPaid === 0)
}

/* ------------------------- the REAL HTTP relay pass ------------------------- */

section('the REAL HTTP pass — two nations walk the wire (live relay on :3000)')
{
  const stamp = Date.now().toString(36).slice(-6)
  const A = `kola_${stamp}`
  const B = `amaka_${stamp}`
  const reg = async (handle: string, pin: string) => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, pin, contact: `${handle}@lokoja.ng`, ageBand: 'adult' }),
    })
    return (await res.json()) as { ok?: boolean; token?: string; why?: string }
  }
  const act = async (token: string, action: string, payload: Record<string, unknown> = {}) => {
    const res = await fetch(`${BASE}/api/live/action`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, payload }),
    })
    return { status: res.status, data: (await res.json()) as Record<string, unknown> }
  }
  const sync = async (token: string, since: number, street = 'home') => {
    const res = await fetch(`${BASE}/api/live/sync`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ since, presence: { street, status: 'hustling' } }),
    })
    return (await res.json()) as { ok?: boolean; cursor?: number; events?: { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[]; roster?: { handle: string }[]; you?: { handle: string } }
  }

  const ra = await reg(A, '1234')
  const rb = await reg(B, '4321')
  check('account A claims (identity arrives FREE)', ra.ok === true && typeof ra.token === 'string')
  check('account B claims (no separate signup)', rb.ok === true && typeof rb.token === 'string')
  const ta = ra.token as string
  const tb = rb.token as string
  // the teen behind the parent shield (M13 law — the register demands the PIN)
  const T = `tobi_${stamp}`
  const rt = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: T, pin: '5678', ageBand: 'teen', parentPin: '998877' }),
  })
  const teen = (await rt.json()) as { ok?: boolean; token?: string }
  check('the teen claims behind the parent shield', teen.ok === true && typeof teen.token === 'string')
  const tt = teen.token as string

  // unauthenticated doors refuse
  const noAuth = await fetch(`${BASE}/api/live/sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
  check('the relay door refuses a tokenless walker (the identity law at the door)', noAuth.status === 401)

  // presence + roster
  const s1 = await sync(ta, 0, 'kpata-market')
  check('A syncs (heartbeat lands)', s1.ok === true && typeof s1.cursor === 'number')
  const s2 = await sync(tb, 0, 'kpata-market')
  check('B sees A on the roster (same street)', (s2.roster ?? []).some((r) => r.handle === A))

  // chat: the link law server-side too
  const clean = await act(ta, 'chat', { text: 'market dey set today o' })
  check('an honest chat broadcasts', clean.status === 200 && clean.data.ok === true)
  const dirty = await act(ta, 'chat', { text: 'join https://419-boys.ng fast' })
  check('the relay re-judges the link law (defense in depth)', dirty.status === 200 && dirty.data.stripped === true && !(dirty.data.text as string)?.includes('https'))
  const wall = await act(tt, 'chat', { text: 'teach me 419 abeg' })
  check('the word wall holds at the door (teen moderation)', wall.status === 400 && wall.data.why === 'word-wall')

  // the event wire carries both
  const s3 = await sync(tb, s2.cursor ?? 0)
  const sawChat = (s3.events ?? []).some((e) => e.kind === 'chat' && e.payload.text === 'market dey set today o')
  check('the wire distributes the chat (B reads what A said)', sawChat)

  // the union: found, join, dues, chain, two-key
  const found = await act(ta, 'assoc-found', { name: `Kpata Union ${stamp}`, motto: 'one hand no fit', day: 30 })
  check('A founds the union (adult table)', found.status === 200 && found.data.ok === true)
  const assocId = found.data.assocId as string
  const join = await act(tb, 'assoc-join', { assocId, day: 30 })
  check('B joins the union', join.status === 200 && join.data.ok === true)
  const dues = await act(tb, 'assoc-dues', { assocId, amount: 500, day: 30 })
  check('B pays dues (the relay books, B\'s wallet pays at home)', dues.status === 200 && dues.data.ok === true)
  check('the treasury grew by the dues', dues.data.treasury === 500)
  const wdNoKey = await act(ta, 'assoc-withdraw', { assocId, amount: 200, day: 31 })
  check('THE TWO-KEY LAW at the relay: the president alone refuses', wdNoKey.status === 403 && wdNoKey.data.why === 'two-key')
  const wd = await act(ta, 'assoc-withdraw', { assocId, amount: 200, coSigner: B, day: 31 })
  check('two keys turn: the withdrawal lands', wd.status === 200 && wd.data.ok === true)
  check('the treasury reflects the withdrawal honestly', wd.data.treasury === 300)

  // the court: contract + dispute
  const contract = await act(ta, 'assoc-contract', { assocId, terms: 'supply 20 bags monthly sharp', stake: 1000, parties: [A, B], day: 32 })
  check('the contract files (the stake rides the record)', contract.status === 200 && contract.data.ok === true)
  const ctrId = (contract.data.contract as { id: string }).id
  const dispute = await act(tb, 'assoc-dispute', { assocId, contractId: ctrId, evidence: 'the bags never came', day: 33 })
  check('the dispute files and the court judges', dispute.status === 200 && dispute.data.ok === true)
  check('the verdict is an honest word', dispute.data.verdict === 'kept' || dispute.data.verdict === 'broken')
  const dispute2 = await act(tb, 'assoc-dispute', { assocId, contractId: ctrId, evidence: 'double jeopardy', day: 34 })
  check('a settled contract cannot re-argue', dispute2.status === 400 && dispute2.data.why === 'not-open')

  // the trade: offer, wrong-party, accept
  const offer = await act(ta, 'trade-offer', { to: B, giveCash: 2000, wantCash: 0, terms: 'for the bags', day: 35 })
  check('the trade offer rides the relay', offer.status === 200 && offer.data.ok === true)
  const tradeId = offer.data.tradeId as string
  const wrong = await act(tb, 'trade-accept', { tradeId: 'no-such-trade' })
  check('a ghost trade refuses', wrong.status === 404)
  const inbox = await act(tb, 'trades')
  check('B\'s inbox carries the offer', inbox.status === 200 && ((inbox.data.trades as unknown[]) ?? []).length >= 1)
  const accept = await act(tb, 'trade-accept', { tradeId })
  check('B accepts (each side applies through its own engines)', accept.status === 200 && accept.data.ok === true)
  const reAccept = await act(tb, 'trade-accept', { tradeId })
  check('an accepted trade never re-accepts', reAccept.status === 400 && reAccept.data.why === 'not-offered')

  // the ajo: found, join, pay, ladder, panic, court
  const cfound = await act(ta, 'ajo-found', { name: `Test Ajo ${stamp}`, contribution: 1000, day: 40 })
  check('A opens the circle', cfound.status === 200 && cfound.data.ok === true)
  const ajoId = cfound.data.ajoId as string
  const cjoin = await act(tb, 'ajo-join', { ajoId, day: 40 })
  check('B joins the ladder', cjoin.status === 200 && cjoin.data.ok === true)
  const pay1 = await act(ta, 'ajo-pay', { ajoId, day: 41 })
  check('A pays in (the pot grows)', pay1.status === 200 && pay1.data.pot === 1000)
  const pay2 = await act(tb, 'ajo-pay', { ajoId, day: 42 })
  check('B pays in — the ladder completes and pays the first name', pay2.status === 200 && pay2.data.paidOut === A && pay2.data.payout === 2000)
  const board = await act(tb, 'ajos')
  const mine = (board.data.circles as { id: string; round: number; pot: number }[] | undefined)?.find((c) => c.id === ajoId)
  check('the board reads round 2 with an empty pot', mine?.round === 2 && mine?.pot === 0)

  // panic + court: B stops paying; A pays round 2 alone
  const pay3 = await act(ta, 'ajo-pay', { ajoId, day: 45 })
  check('A pays round 2 (B is pending)', pay3.status === 200 && pay3.data.pot === 1000)
  const noPanic = await act(ta, 'ajo-court', { ajoId, day: 43 })
  check('inside the grace the court refuses to act', noPanic.status === 400 && noPanic.data.why === 'no-panic')
  const panicDay = 40 + AJO_PANIC_GRACE_DAYS + 3
  const court = await act(ta, 'ajo-court', { ajoId, day: panicDay })
  check('THE COURT GUARANTEE: past grace the court convicts the defaulter', court.status === 200 && court.data.ok === true && court.data.defaulter === B)
  check('the fine is 1.5× the contribution', (court.data.fine as { fine: number }).fine === 1500 && (court.data.fine as { repHit: number }).repHit === 5)
  const afterCourt = await act(tb, 'ajos')
  const after = (afterCourt.data.circles as { id: string; round: number }[] | undefined)?.find((c) => c.id === ajoId)
  check('the round STILL paid (round 3 opens, the ladder holds)', after?.round === 3)

  // the streams wire
  const stream = await act(ta, 'stream-open', { kind: 'stall', title: 'Mama Ngozi live from Kpata', day: 50 })
  check('A goes live (viewers-as-crowd)', stream.status === 200 && stream.data.ok === true)
  const streamId = stream.data.streamId as string
  const view = await act(tb, 'stream-view', { streamId })
  check('B joins the crowd', view.status === 200 && view.data.viewers === 1)
  const close = await act(ta, 'stream-close', { streamId })
  check('A closes the stream (the peak is honest)', close.status === 200 && close.data.peakViewers === 1)
  const teenStream = await act(tt, 'stream-open', { kind: 'stall', title: 'young huster tv', day: 50 })
  check('a teen cannot host (adults only at the relay)', teenStream.status === 403)
  const teenAssoc = await act(tt, 'assoc-found', { name: `School Union ${stamp}`, motto: 'books first', day: 50 })
  check('a teen cannot found a union (the money tables stay adult)', teenAssoc.status === 403)

  // the join-teleport wire
  const jt = await act(ta, 'join', { code: 'lkt1.AAAAAAAA', street: 'kpata-market' })
  check('the join-postcard rides the wire', jt.status === 200 && jt.data.ok === true)
}

/* ---------------------------------- verdict --------------------------------- */

console.log('\n========================================')
console.log(`M17 LIVE NATION — ${passed} passed, ${failed} failed`)
console.log('========================================')
process.exit(failed > 0 ? 1 : 0)
