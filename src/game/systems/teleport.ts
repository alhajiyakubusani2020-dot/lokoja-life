/**
 * LOKOJA LIFE — M15: TELEPORT (pure rules)
 * -----------------------------------------
 * THE POSTCARD: a signed, ~100-byte code that carries one honest MOMENT
 * of a life in Lokoja — the day, the street, the walker's name, the
 * level, the reputation, and the last three honest money moves.
 * WhatsApp it. Anyone who opens it arrives at that street with the
 * ghost card telling them whose corner they just landed in.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic. Same moment + same version → the same
 *    code bytes, byte for byte (a share re-share is the same postcard).
 *  - The signature rides the M14 fortress crypto: HMAC-SHA256 over the
 *    EXACT payload string, keyed by an app-wide pepper derived through
 *    SHA-256. Honest scope (the M14 note applies twice over): a
 *    teleport code is a POSTCARD, not a bank vault — the signature is
 *    INTEGRITY (transit mangling, truncated paste, casual forgery),
 *    not secrecy. Every device verifies every code with the same key:
 *    a postcard Ada signs on her phone opens on Musa's phone.
 *  - THE BUDGET: the code fits WhatsApp — ≤ 96 characters, the full
 *    share URL ≤ ~100 bytes of payload. encodeTeleport refuses to
 *    mint a code that busts the budget (the law is tested).
 *  - THE MERCY LAW: a mangled or truncated paste is refused honestly
 *    (malformed), an edited payload is refused (tampered) — a broken
 *    postcard NEVER loads a moment. No partial arrivals.
 *  - The roster is FROZEN: v1 codes speak the v1 street list. A street
 *    added later joins at the tail; a removed street breaks nothing
 *    already in circulation (its codes decode with an honest refusal
 *    if the index walks off the frozen list).
 */

import { hmacSha256, sha256 } from './fortress'
import { formatNaira } from './progression'
import { LOCATIONS, LOCATION_BY_ID } from '../data/locations'

/* ------------------------------ the roster --------------------------------- */

/**
 * The frozen v1 head — the ten launch streets whose indexes are baked into
 * circulating codes. This head is a CONTRACT: append-only, never reorder,
 * never splice.
 */
const V1_ROSTER: readonly string[] = [
  'home',
  'kpata-market',
  'ganaja-junction',
  'confluence',
  'mount-patti',
  'historic-lokoja',
  'government-area',
  'university-area',
  'food-area',
  'transport-area',
]

/**
 * The full postcard roster (32 streets). The law at the top of this file
 * permits tail appends: every street in the LOCATIONS registry that the v1
 * head does not already speak joins the tail in LOCATIONS order (launch →
 * school wards → G2 spaces). v1 indexes never move, so circulating codes
 * decode forever; the schema version (v:1) and the signing pepper stay
 * untouched for exactly that reason — bumping either would refuse every
 * postcard already in circulation.
 */
export const TELEPORT_ROSTER: readonly string[] = [
  ...V1_ROSTER,
  ...LOCATIONS.map((l) => l.id).filter((id) => !V1_ROSTER.includes(id)),
]

/** The frozen v1 ledger categories — the ghost card's last three moves. */
export const TELEPORT_CATEGORIES: readonly string[] = [
  'job',
  'hustle',
  'transport',
  'shop',
  'tip',
  'other',
  'bank',
  'fun',
]

/* -------------------------------- the key ---------------------------------- */

/**
 * The app-wide pepper, stretched through SHA-256 so the HMAC key is a
 * uniform 32-byte hex string. Public by design (client bundle) — the
 * barrier stops mangling and casual forgery, and that is the honest
 * whole of its job.
 */
const TELEPORT_PEPPER = 'lokoja-teleport-v1'
const TELEPORT_KEY = sha256(TELEPORT_PEPPER)

/** The signature is the first 16 hex chars of the HMAC — 64 honest bits. */
const SIG_LEN = 16

/* ------------------------------- the moment -------------------------------- */

export interface TeleportMoment {
  /** code schema version (1) */
  v: 1
  /** the in-game day the moment belongs to */
  day: number
  /** a TELEPORT_ROSTER id — where the walker stands */
  locId: string
  /** the walker's claimed name (1–12 safe chars) */
  name: string
  /** the walker's level (1+) */
  level: number
  /** the walker's reputation */
  rep: number
  /** naira earned that day (the ghost card's headline number) */
  earned: number
  /** honest money moves that day (ledger count) */
  moves: number
  /** the day's last three category indexes (the ghost walk) */
  trail: number[]
}

export type TeleportEncode =
  | { ok: true; code: string; url: string; payload: string; bytes: number }
  | { ok: false; why: string }

export type TeleportDecode =
  | { ok: true; moment: TeleportMoment; payload: string }
  | { ok: false; why: 'tampered' | 'malformed' | 'empty' }

/* ------------------------------ the helpers -------------------------------- */

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/** RFC 4648 base32, no padding, URL-safe alphabet (A–Z, 2–7). */
export function base32Encode(bytes: number[]): string {
  let bits = 0
  let value = 0
  let out = ''
  for (const b of bytes) {
    value = (value << 8) | (b & 255)
    bits += 8
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31]
  return out
}

export function base32Decode(s: string): number[] | null {
  const bytes: number[] = []
  let bits = 0
  let value = 0
  for (const ch of s) {
    const idx = B32.indexOf(ch)
    if (idx < 0) return null
    value = (value << 5) | idx
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return bytes
}

/** The walker-name law: safe charset only, 1–12 chars after a trim. */
export function sanitizeTeleportName(raw: string): { ok: true; name: string } | { ok: false; why: string } {
  const name = raw.trim().replace(/\s+/g, ' ')
  if (name.length < 1) return { ok: false, why: 'A postcard needs a name.' }
  if (name.length > 12) return { ok: false, why: 'Keep the name under 12 characters.' }
  if (!/^[A-Za-z0-9 _-]+$/.test(name)) return { ok: false, why: 'Letters, numbers, spaces, - and _ only.' }
  return { ok: true, name }
}

/** Serialise the moment into the exact signed payload string. */
function serializeMoment(m: TeleportMoment): string {
  const trail = (m.trail.length ? m.trail : [0, 0, 0]).slice(0, 3)
  const padded = [...trail]
  while (padded.length < 3) padded.push(0)
  return [m.v, m.day, TELEPORT_ROSTER.indexOf(m.locId), m.name, m.level, m.rep, m.earned, m.moves, padded.join('.')].join('|')
}

/** The code budget — the whole URL must fit a WhatsApp message comfortably. */
export const TELEPORT_CODE_LIMIT = 96
export const TELEPORT_URL_LIMIT = 112

/** Build the share URL (browser callers omit base; tests + SSR pass it). */
export function teleportUrl(code: string, base?: string): string {
  const origin = base ?? (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://lokoja.life')
  return `${origin.replace(/\/$/, '')}/t/${code}`
}

/* ------------------------------ encode / decode ---------------------------- */

/**
 * Mint a postcard. Deterministic: the same moment yields the same code.
 * Refuses moments that bust the budget or break the name law.
 */
export function encodeTeleport(moment: TeleportMoment, base?: string): TeleportEncode {
  if (moment.v !== 1) return { ok: false, why: 'Unknown postcard version.' }
  if (!Number.isInteger(moment.day) || moment.day < 1) return { ok: false, why: 'The day is not a real day.' }
  if (!TELEPORT_ROSTER.includes(moment.locId)) return { ok: false, why: 'That street is not on the postcard roster.' }
  if (!Number.isInteger(moment.level) || moment.level < 1) return { ok: false, why: 'The level is not a real level.' }
  const name = sanitizeTeleportName(moment.name)
  if (!name.ok) return { ok: false, why: name.why }
  for (const t of moment.trail) {
    if (!Number.isInteger(t) || t < 0 || t >= TELEPORT_CATEGORIES.length) return { ok: false, why: 'The ghost walk broke the category law.' }
  }
  const payload = serializeMoment({ ...moment, name: name.name })
  const sig = hmacSha256(TELEPORT_KEY, payload).slice(0, SIG_LEN)
  const code = `lkt1.${base32Encode(Array.from(new TextEncoder().encode(payload)))}.${sig}`
  if (code.length > TELEPORT_CODE_LIMIT) return { ok: false, why: 'The postcard busted the byte budget.' }
  const url = teleportUrl(code, base)
  if (url.length > TELEPORT_URL_LIMIT) return { ok: false, why: 'The share URL busted the byte budget.' }
  return { ok: true, code, url, payload, bytes: new TextEncoder().encode(payload).length }
}

/**
 * Open a postcard. Whitespace, quotes and the marks WhatsApp leaves
 * around a pasted link are stripped before the walk; anything else
 * wrong is refused honestly — tampered never loads.
 */
export function decodeTeleport(raw: string): TeleportDecode {
  const cleaned = raw.trim().replace(/^["'<]+|["'>]+$/g, '').replace(/\s+/g, '')
  if (!cleaned) return { ok: false, why: 'empty' }
  const parts = cleaned.split('.')
  if (parts.length !== 3 || parts[0] !== 'lkt1') return { ok: false, why: 'malformed' }
  const [, body, sig] = parts
  const bytes = base32Decode(body)
  if (!bytes || bytes.length === 0) return { ok: false, why: 'malformed' }
  let payload: string
  try {
    payload = new TextDecoder().decode(new Uint8Array(bytes))
  } catch {
    return { ok: false, why: 'malformed' }
  }
  const expect = hmacSha256(TELEPORT_KEY, payload).slice(0, SIG_LEN)
  if (expect.length !== sig.length) return { ok: false, why: 'tampered' }
  let diff = 0
  for (let i = 0; i < expect.length; i++) diff |= expect.charCodeAt(i) ^ sig.charCodeAt(i)
  if (diff !== 0) return { ok: false, why: 'tampered' }
  const f = payload.split('|')
  if (f.length !== 9) return { ok: false, why: 'malformed' }
  const v = Number(f[0])
  const day = Number(f[1])
  const locIdx = Number(f[2])
  const name = f[3]
  const level = Number(f[4])
  const rep = Number(f[5])
  const earned = Number(f[6])
  const moves = Number(f[7])
  const trail = f[8].split('.').map(Number)
  if (!Number.isInteger(v) || v !== 1) return { ok: false, why: 'malformed' }
  if (!Number.isInteger(day) || day < 1) return { ok: false, why: 'malformed' }
  if (!Number.isInteger(locIdx) || locIdx < 0 || locIdx >= TELEPORT_ROSTER.length) return { ok: false, why: 'malformed' }
  if (!sanitizeTeleportName(name).ok) return { ok: false, why: 'malformed' }
  if (!Number.isInteger(level) || level < 1) return { ok: false, why: 'malformed' }
  if (!Number.isInteger(rep) || !Number.isInteger(earned) || !Number.isInteger(moves)) return { ok: false, why: 'malformed' }
  if (trail.length !== 3 || trail.some((t) => !Number.isInteger(t) || t < 0 || t >= TELEPORT_CATEGORIES.length)) {
    return { ok: false, why: 'malformed' }
  }
  return {
    ok: true,
    payload,
    moment: { v: 1, day, locId: TELEPORT_ROSTER[locIdx], name, level, rep, earned, moves, trail },
  }
}

/* ------------------------------ the postcard ------------------------------- */

export interface Postcard {
  /** the OG/share title — "Ada na Day 41 dey Kpata Market" */
  title: string
  /** the share body — the ghost walk in one honest line */
  body: string
  /** the chips the card displays (label/value pairs) */
  chips: { label: string; value: string }[]
}

/**
 * The postcard copy for a moment. One builder — the phone share sheet,
 * the OG route and the ghost card all speak the SAME words.
 */
export function postcardFor(m: TeleportMoment): Postcard {
  const loc = LOCATION_BY_ID[m.locId]
  const place = loc ? loc.name : m.locId
  const title = `${m.name} na Day ${m.day} dey ${place}`
  const walk = m.trail
    .map((t) => TELEPORT_CATEGORIES[t])
    .filter(Boolean)
    .slice(0, 3)
  const walkLine = walk.length
    ? `Last moves: ${walk.join(' → ')}`
    : 'The day dey quiet — come see the street yourself.'
  const body = `${walkLine} · ${formatNaira(m.earned)} earned across ${m.moves} move${m.moves === 1 ? '' : 's'}`
  const chips = [
    { label: 'Day', value: String(m.day) },
    { label: 'Street', value: place },
    { label: 'Level', value: String(m.level) },
    { label: 'Rep', value: String(m.rep) },
  ]
  return { title, body, chips }
}
