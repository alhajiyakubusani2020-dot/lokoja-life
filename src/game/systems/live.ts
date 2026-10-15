/**
 * LOKOJA LIFE — M17: THE LIVE NATION
 * ----------------------------------
 * Identity arrives FREE from the Guest Loop: every claimed account is
 * multiplayer-ready — no separate signup, ever. This system holds the
 * LAWS of the nation; the relay (two thin API routes) only ever
 * DISTRIBUTES the events these laws produce — it never simulates.
 *
 * LAWS OF THIS FILE:
 *  - THE IDENTITY LAW: a claimed account plays the nation; an unclaimed
 *    guest spectates (reads everything) but the mic stays dark until
 *    claim. No second signup exists anywhere in the app.
 *  - THE TIERED CHAT LAW (rides the M13 bands): kids speak in preset
 *    emotes ONLY; teens speak moderated text (the word wall, 140 chars);
 *    adults speak full text (280 chars) but NO EXTERNAL LINKS EVER —
 *    URLs, phone numbers and wallet addresses are stripped before the
 *    relay ever sees them.
 *  - THE PRESENCE LAW: a live walker is a record with a TTL — a stale
 *    ping is an absent neighbor; presence never lies.
 *  - THE JOIN-TELEPORT LAW: a live invite is an M15 postcard (the SAME
 *    signed code) — arrival is free, landings never pay street credit.
 *  - THE STREAM LAW: anyone may broadcast a stall/regatta/wedding;
 *    viewers BECOME the crowd (an honest multiplier, capped); the city
 *    itself broadcasts on a deterministic civic schedule.
 *  - THE ASSOCIATION LAW: a shared treasury where every move is a
 *    kobo-chain link (M14 fortress math) — and the co-op books never
 *    move on one man's word (the two-key law).
 *  - THE COURT LAW: contracts and disputes land before the Market Union
 *    Court, whose verdict is a HASH of (day, contract, evidence) —
 *    deterministic, reload-proof, bribe-proof.
 *  - THE TRADE LAW: a trade is a signed ledger event both sides apply
 *    through their own honest engines; the relay just carries it.
 *  - THE AJO LAW: real-player rotating savings with THE DEFAULT PANIC
 *    and the court guarantee — a defaulter is fined, the round still
 *    pays; nobody's money dies with a stranger's empty pocket.
 *  - THE VOICE LAW: adults, opt-in, same street — minors NEVER
 *    (structurally false, the M13 graph-block doctrine).
 *  - THE RELAY DOCTRINE: events are validated shapes on channels; the
 *    nation's memory lives in the relay, the simulation lives at home.
 */

import { chainHash, sha256 } from './fortress'

/* ================================ identity ================================= */

export type LiveBand = 'kid' | 'teen' | 'adult' | 'guest'

export interface LiveIdentity {
  /** null = an unclaimed guest (spectate-only) */
  handle: string | null
  band: LiveBand
}

export type LiveCapability = 'read' | 'emote' | 'text' | 'host' | 'assoc' | 'trade' | 'ajo' | 'voice'

/**
 * THE IDENTITY LAW + THE TIERED CHAT LAW, one table.
 *  guest  → read-only spectate (the mic is dark until claim)
 *  kid    → emotes only
 *  teen   → moderated text
 *  adult  → full text
 * Hosting/assoc/trade/ajo are grown-folk law: adults only. (Teens may
 * read every room; the nation keeps its money tables adult-hands-only,
 * the same doctrine the M13 shield set for crime and japa.)
 */
const CAPABILITY_TABLE: Record<LiveBand, LiveCapability[]> = {
  guest: ['read'],
  kid: ['read', 'emote'],
  teen: ['read', 'emote', 'text'],
  adult: ['read', 'emote', 'text', 'host', 'assoc', 'trade', 'ajo', 'voice'],
}

export function canLive(identity: LiveIdentity, cap: LiveCapability): boolean {
  return CAPABILITY_TABLE[identity.band].includes(cap)
}

/* ================================== chat =================================== */

/** THE KID LEXICON — preset phrases/emotes ONLY (the M13 emote-grid law,
 *  widened to the nation: a kid's whole vocabulary in the live rooms). */
export const EMOTE_LIBRARY: readonly { id: string; glyph: string; phrase: string }[] = [
  { id: 'up-nepa', glyph: '💡', phrase: 'Up NEPA!' },
  { id: 'howfar', glyph: '👋', phrase: 'How far!' },
  { id: 'lol', glyph: '😂', phrase: 'Lol' },
  { id: 'hot', glyph: '🔥', phrase: 'Fire!' },
  { id: 'strong', glyph: '💪', phrase: 'Strong thing' },
  { id: 'abeg', glyph: '🙏', phrase: 'Abeg oo' },
  { id: 'oya', glyph: '⭐', phrase: 'Oya!' },
  { id: 'choi', glyph: '😮', phrase: 'Choi!' },
  { id: 'welldone', glyph: '🎁', phrase: 'Well done oo' },
  { id: 'tired', glyph: '😴', phrase: 'Body dey pain me' },
  { id: 'correct', glyph: '🤝', phrase: 'Correct!' },
  { id: 'nice', glyph: '❤️', phrase: 'Nice one' },
]

export function emoteById(id: string): { glyph: string; phrase: string } | null {
  return EMOTE_LIBRARY.find((e) => e.id === id) ?? null
}

/** THE TEEN WORD WALL — moderation as a pure law. A small honest
 *  blocklist of the classic 419/harassment openers; the list is data,
 *  so it grows without touching any law. */
const WORD_WALL: readonly string[] = [
  '419', 'yahoo boy', 'blood money', 'send ur pics', 'send pictures', 'credit card',
  'bank pin', 'atm pin', 'one chance', 'kill', 'stupid fool',
]

/** THE ADULT LINK LAW — no external links ever, in ANY room. URLs,
 *  www hosts, common TLDs, phone numbers and crypto/transfer handles
 *  are stripped; what survives is honest street talk. */
const LINK_PATTERNS: RegExp[] = [
  /https?:\/\/\S+/gi,
  /\bwww\.\S+/gi,
  /[\w.-]+\.(com|net|org|ng|io|xyz|link|me|tv)\b/gi,
  /(?:\+?234|0)[789]\d{9}/g,
  /\b0[789]\d{9}\b/g,
  /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g, // crypto addresses
]

export interface ChatVerdict {
  ok: boolean
  /** the cleaned text (emote phrase for kids) — undefined when refused */
  text?: string
  /** why a refusal happened (or 'link-stripped' notes a cleaned send) */
  why?: 'guest-mic-dark' | 'kid-text-refused' | 'word-wall' | 'empty' | 'too-long' | 'no-links-ever'
  stripped?: boolean
}

const KID_MAX = 0 // kids never type — the lexicon speaks
const TEEN_MAX = 140
const ADULT_MAX = 280

export function sanitizeChat(identity: LiveIdentity, raw: string): ChatVerdict {
  // THE IDENTITY LAW at the mic: a guest's mic is dark, full stop
  if (identity.band === 'guest') return { ok: false, why: 'guest-mic-dark' }
  if (identity.band === 'kid') return { ok: false, why: 'kid-text-refused' }
  const text = raw.trim()
  if (!text) return { ok: false, why: 'empty' }
  if (identity.band === 'teen') {
    if (text.length > TEEN_MAX) return { ok: false, why: 'too-long' }
    const low = text.toLowerCase()
    if (WORD_WALL.some((w) => low.includes(w))) return { ok: false, why: 'word-wall' }
    // teens inherit the link law too — moderation is the floor, not the ceiling
    if (LINK_PATTERNS.some((r) => r.test(text))) return { ok: false, why: 'no-links-ever' }
    return { ok: true, text }
  }
  // adult: full text, the link law, the length cap
  if (text.length > ADULT_MAX) return { ok: false, why: 'too-long' }
  let out = text
  let stripped = false
  for (const r of LINK_PATTERNS) {
    if (r.test(out)) {
      // the link DIES — nothing stands in for it (an only-link message
      // leaves nothing honest, and nothing honest never crosses)
      out = out.replace(r, '')
      stripped = true
    }
    r.lastIndex = 0
  }
  if (!out.trim()) return { ok: false, why: 'no-links-ever' }
  return { ok: true, text: out.replace(/\s{2,}/g, ' ').trim(), stripped }
}

/* ================================ presence ================================= */

export const PRESENCE_TTL_MS = 90_000

export type PresenceStatus = 'hustling' | 'chilling' | 'market' | 'streaming'

export interface LivePresence {
  handle: string
  street: string
  status: PresenceStatus
  band: LiveBand
  ts: number
}

export function presenceAlive(p: LivePresence, now: number): boolean {
  return now - p.ts <= PRESENCE_TTL_MS
}

export function presenceRoster(all: LivePresence[], now: number): LivePresence[] {
  return all.filter((p) => presenceAlive(p, now)).sort((a, b) => a.handle.localeCompare(b.handle))
}

/* ============================== join-teleport ============================== */

/** THE JOIN-TELEPORT LAW: a live invite carries an M15 postcard code.
 *  The code itself is minted by teleport.ts (the SAME signed payload);
 *  this builder packages the live event. Arrival rides the M15 arrival
 *  law on the receiver's side: free, booked, never street credit. */
export function joinTeleportEvent(handle: string, street: string, code: string): LiveEvent {
  return {
    id: `jt:${sha256(`${handle}|${street}|${code}`).slice(0, 16)}`,
    kind: 'join',
    channel: 'global',
    actor: handle,
    payload: { street, code },
  }
}

/* ================================= streams ================================= */

export type StreamKind = 'stall' | 'regatta' | 'wedding' | 'city'

export interface LiveStream {
  id: string
  host: string
  kind: StreamKind
  title: string
  viewers: string[]
  startedDay: number
}

/** THE VIEWERS-AS-CROWD LAW: every viewer is one more body at the
 *  stall — ×0.0125 each, capped at ×1.5 (40 viewers). The crowd pays,
 *  but it never drowns the honest base. */
export function crowdMult(viewerCount: number): number {
  return 1 + Math.min(viewerCount, 40) * 0.0125
}

export function broadcastPayout(base: number, viewerCount: number): number {
  return Math.round(base * crowdMult(viewerCount))
}

/** THE CITY BROADCAST LAW: the city itself takes the mic on a
 *  deterministic civic schedule — the governor every 36 days (the
 *  mid-year address lands on day 36, the year-open on day 1), election
 *  night every year-day 60. Zero state, reload-proof. */
export function cityBroadcastFor(yearDay: number): { kind: 'address' | 'election'; title: string } | null {
  if (yearDay === 1) return { kind: 'address', title: "The Governor's New Year Address" }
  if (yearDay === 36) return { kind: 'address', title: 'The Mid-Year Address' }
  if (yearDay === 60) return { kind: 'election', title: 'Election Night — the results walk home' }
  return null
}

/* ============================== associations =============================== */

export type AssocRole = 'president' | 'secretary' | 'member'

export interface AssocMemberRow {
  handle: string
  role: AssocRole
  joinedDay: number
}

export interface Association {
  id: string
  name: string
  motto: string
  founder: string
  treasury: number
  /** the association's own kobo-chain tail — the co-op books are sealed */
  chainTail: string
  ledger: { day: number; amount: number; category: string; label: string; sig: string }[]
  members: AssocMemberRow[]
  contracts: LiveContract[]
  createdDay: number
}

export const ASSOC_DUES = 500
export const ASSOC_MIN_MEMBERS = 3

export function assocIdFor(name: string, founder: string, day: number): string {
  return `asc:${sha256(`${name}|${founder}|${day}`).slice(0, 16)}`
}

export function canFoundAssociation(identity: LiveIdentity): boolean {
  return canLive(identity, 'assoc')
}

/** THE TWO-KEY LAW: treasury withdrawals need the president AND one
 *  other officer's yes — the co-op books never move on one word. */
export function withdrawVerdict(
  assoc: Association,
  requester: string,
  coSigner: string | null,
  amount: number,
): { ok: boolean; why?: 'not-member' | 'not-president' | 'two-key' | 'empty-treasury' | 'bad-amount' } {
  const row = assoc.members.find((m) => m.handle === requester)
  if (!row) return { ok: false, why: 'not-member' }
  if (row.role !== 'president') return { ok: false, why: 'not-president' }
  if (!coSigner || coSigner === requester || !assoc.members.some((m) => m.handle === coSigner)) {
    return { ok: false, why: 'two-key' }
  }
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, why: 'bad-amount' }
  if (amount > assoc.treasury) return { ok: false, why: 'empty-treasury' }
  return { ok: true }
}

/** The association ledger rides the M14 kobo-chain: every move hashes
 *  the previous signature. The treasury is sealed exactly like a pocket. */
export function assocChainLink(prevSig: string, day: number, amount: number, category: string, label: string): string {
  // the assoc books chain on the SAME ChainTx law; slot 0 is the
  // association's own counter slot (the day-slot pair stays unique per move)
  return chainHash(prevSig, { day, slot: 0, amount, category, label })
}

/* ============================ contracts + court ============================ */

export type ContractKind = 'coop' | 'trade' | 'labor'
export type ContractStatus = 'open' | 'kept' | 'broken' | 'disputed' | 'settled'

export interface LiveContract {
  id: string
  kind: ContractKind
  parties: string[]
  terms: string
  /** the stake both sides posted (the court holds it) */
  stake: number
  status: ContractStatus
  day: number
  verdictDay?: number
  verdict?: 'kept' | 'broken'
  /** who the court ordered to pay (broken party) */
  liable?: string
}

export function contractIdFor(terms: string, parties: string[], day: number): string {
  return `ctr:${sha256(`${terms}|${parties.join('+')}|${day}`).slice(0, 16)}`
}

/** THE MARKET UNION COURT: the verdict is a HASH of (day, contract,
 *  evidence) — deterministic, reload-proof, bribe-proof. The evidence
 *  is whatever the disputants signed into the file; the same file
 *  argued on a different day CANNOT flip (the verdict freezes at the
 *  first sitting via verdictDay, but the hash itself is stable). */
export function courtVerdict(contract: LiveContract, evidence: string): 'kept' | 'broken' {
  const h = sha256(`${contract.id}|${evidence}|${contract.day}`)
  // the honest bias: a contract with no evidence against it stands
  return parseInt(h.slice(0, 2), 16) % 4 === 0 ? 'broken' : 'kept'
}

export const COURT_FEE = 200

/** The penalty law: a broken contract costs the liable party the
 *  stake; the winner takes the pot. The fee pays the Union clerk. */
export function courtPenalty(contract: LiveContract): { liable: string; penalty: number; winner: string } | null {
  if (contract.status !== 'disputed' || !contract.verdict) return null
  if (contract.verdict === 'kept') return null
  const liable = contract.parties[1] ?? contract.parties[0]
  const winner = contract.parties[0]
  return { liable, penalty: contract.stake, winner }
}

/* ================================= trades ================================== */

export interface TradeOffer {
  id: string
  from: string
  to: string
  giveCash: number
  wantCash: number
  /** one-line what-for (the item story rides the terms) */
  terms: string
  status: 'offered' | 'accepted' | 'cancelled'
  day: number
}

/** deterministic: the caller supplies the day and their offer count —
 *  the same offer moment always mints the same id. */
export function tradeIdFor(from: string, to: string, day: number, offerSeq: number): string {
  return `trd:${sha256(`${from}|${to}|${day}|${offerSeq}`).slice(0, 16)}`
}

/** THE TRADE LAW: both walkers must be alive on the roster, the offer
 *  must still be open, and a walker cannot trade with himself. The
 *  relay stores the record; each side applies the move through its OWN
 *  honest engines (M14 income guard + kobo-chain) on acceptance. */
export function tradeVerdict(
  offer: TradeOffer,
  acceptor: string,
  roster: LivePresence[],
  now: number,
): { ok: boolean; why?: 'not-offered' | 'self-trade' | 'wrong-party' | 'partner-gone' } {
  if (offer.status !== 'offered') return { ok: false, why: 'not-offered' }
  if (offer.from === offer.to) return { ok: false, why: 'self-trade' }
  if (acceptor !== offer.to) return { ok: false, why: 'wrong-party' }
  const partner = roster.find((p) => p.handle === offer.from)
  if (!partner || !presenceAlive(partner, now)) return { ok: false, why: 'partner-gone' }
  return { ok: true }
}

/* ============================== ajo / esusu ================================ */

export interface AjoCircle {
  id: string
  name: string
  /** the fixed contribution every member pays every round */
  contribution: number
  /** the payout ladder — the order never reshuffles mid-game */
  order: string[]
  round: number
  /** the day the CURRENT round opened (the grace clock anchors here) */
  roundStartDay: number
  pot: number
  /** round → the handle the pot paid */
  paid: Record<number, string>
  /** who has paid into the CURRENT round (the round completes when every name is here) */
  paidThisRound: string[]
  /** members who missed the current round (the panic book) */
  defaulters: string[]
  status: 'open' | 'panic' | 'closed'
  createdDay: number
}

export const AJO_MAX_MEMBERS = 12
export const AJO_PANIC_GRACE_DAYS = 2

export function ajoIdFor(name: string, founder: string, day: number): string {
  return `ajo:${sha256(`${name}|${founder}|${day}`).slice(0, 16)}`
}

/** THE ROUND LAW: the round pays the next unpaid name on the ladder —
 *  but only when EVERY member has paid into this round (the pot is the
 *  whole point; the panic book names who has not). */
export function ajoRoundReady(circle: AjoCircle): boolean {
  return circle.order.every((m) => circle.paidThisRound.includes(m))
}

export function ajoNextBeneficiary(circle: AjoCircle): string | null {
  for (const m of circle.order) {
    if (!Object.values(circle.paid).includes(m)) return m
  }
  return null
}

/** THE DEFAULT PANIC: the round wants to pay, at least one member has
 *  paid, but someone hasn't — and the grace window (2 days from the
 *  round's own opening) has walked past. The circle panics; the court
 *  guarantee stands behind the pot. */
export function ajoPanicCheck(circle: AjoCircle, day: number): { panic: boolean; defaulter: string | null } {
  if (circle.status === 'panic') return { panic: true, defaulter: circle.defaulters[0] ?? null }
  const next = ajoNextBeneficiary(circle)
  if (!next) return { panic: false, defaulter: null }
  const pending = circle.order.filter((m) => !circle.paidThisRound.includes(m))
  if (circle.paidThisRound.length === 0 || pending.length === 0) return { panic: false, defaulter: null }
  if (day - circle.roundStartDay > AJO_PANIC_GRACE_DAYS) {
    return { panic: true, defaulter: pending[0] }
  }
  return { panic: false, defaulter: null }
}

/** THE COURT GUARANTEE: the Market Union fines a convicted defaulter
 *  1.5× their contribution + a rep hit; the round pays anyway. */
export function ajoCourtFine(circle: AjoCircle, handle: string): { fine: number; repHit: number } {
  return { fine: Math.round(circle.contribution * 1.5), repHit: 5 }
}

/* ================================== voice ================================== */

/** THE VOICE LAW: adults only, opt-in, proximity (same street).
 *  Minors NEVER — structurally false, the M13 graph-block doctrine. */
export function voiceAllowed(identity: LiveIdentity, voiceOn: boolean, myStreet: string | null, theirStreet: string | null): boolean {
  if (identity.band !== 'adult') return false
  if (!voiceOn) return false
  if (!myStreet || !theirStreet) return false
  return myStreet === theirStreet
}

/* ================================== events ================================= */

export type LiveEventKind = 'chat' | 'emote' | 'join' | 'stream' | 'assoc' | 'trade' | 'ajo' | 'city' | 'court'

export interface LiveEvent {
  id: string
  kind: LiveEventKind
  /** global | street:<id> | assoc:<id> | circle:<id> | stream:<id> */
  channel: string
  actor: string
  payload: Record<string, unknown>
}

/** THE RELAY DOCTRINE: the relay distributes events, never simulates.
 *  A valid event is a known kind on a known-shaped channel with a
 *  bounded payload (2KB — the nation's wire stays thin). */
export const EVENT_PAYLOAD_CAP = 2048

export function validateEvent(e: unknown): { ok: boolean; why?: 'shape' | 'kind' | 'channel' | 'payload-cap' } {
  const ev = e as LiveEvent | null
  if (!ev || typeof ev !== 'object' || typeof ev.id !== 'string' || typeof ev.actor !== 'string') return { ok: false, why: 'shape' }
  const kinds: LiveEventKind[] = ['chat', 'emote', 'join', 'stream', 'assoc', 'trade', 'ajo', 'city', 'court']
  if (!kinds.includes(ev.kind)) return { ok: false, why: 'kind' }
  if (typeof ev.channel !== 'string' || ev.channel.length === 0 || ev.channel.length > 64) return { ok: false, why: 'channel' }
  if (ev.channel !== 'global' && !/^(street|assoc|circle|stream):[\w:-]{1,48}$/.test(ev.channel)) return { ok: false, why: 'channel' }
  if (JSON.stringify(ev.payload ?? {}).length > EVENT_PAYLOAD_CAP) return { ok: false, why: 'payload-cap' }
  return { ok: true }
}

/* ============================== fresh state ================================ */

/** The player's own book inside the nation — the slice the save carries.
 *  Everything else (rosters, treasuries, pots, the wire) lives in the
 *  relay; this is only what is HERS. */
export function freshLiveState(): import('../types').LiveState {
  return {
    cursor: 0,
    voiceOn: false,
    assocId: null,
    coSigned: [],
    circles: [],
    stats: { chats: 0, emotes: 0, streamsWatched: 0, tradesDone: 0 },
    finesPaid: 0,
  }
}
