/**
 * LOKOJA LIFE — M13: THE FAMILY SHIELD (pure rules)
 * --------------------------------------------------
 * One download, three generations — Lagos Life structurally cannot
 * follow. Kids (6–12) walk a safer Lokoja: no crime road, light hustles
 * only, preset-emote socials, and the Spot-the-Scammer literacy game.
 * Teens (13–17) hustle freely but the crime road stays locked and school
 * pays better. Adults see everything. Elder mode is an accessibility
 * toggle, not a third life.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. Content
 *    gates answer honest questions; every action surface asks before it
 *    offers a band something the shield refuses.
 *  - The graph block: an adult account can NEVER contact a minor
 *    account. Not "we try to prevent" — canContact() is the single
 *    function every present and future social surface must pass through,
 *    and it is structurally false for adult→minor.
 *  - Zero minor data collection: the minor register path (server side)
 *    stores no contact and no recovery line. The parent PIN is the only
 *    key a minor account answers to.
 */

import type { AgeBand, ShieldState } from '../types'

export type { AgeBand } from '../types'
export type { ShieldState } from '../types'

/* ------------------------------ the age law -------------------------------- */

/** What each life stage may touch. The whole game reads this one table. */
export interface AgeLaw {
  /** may touch crime-adjacent content (the night lounge, race-eve bets, the street agent) */
  crime: boolean
  /** 'light' = only kidSafe hustles; 'all' = the whole board */
  hustle: 'light' | 'all'
  /** 'emotes' = preset emotes only; 'full' = the normal chat */
  social: 'emotes' | 'full'
  /** the Spot-the-Scammer game is featured on the school sheet */
  scammerFeatured: boolean
  /** smart-skill XP multiplier (education-first for the young ones) */
  studyBoost: number
  /** may walk the JAPA document gauntlet */
  japa: boolean
}

export const AGE_LAW: Record<AgeBand, AgeLaw> = {
  kid: { crime: false, hustle: 'light', social: 'emotes', scammerFeatured: true, studyBoost: 1.25, japa: false },
  teen: { crime: false, hustle: 'all', social: 'full', scammerFeatured: true, studyBoost: 1.25, japa: true },
  adult: { crime: true, hustle: 'all', social: 'full', scammerFeatured: false, studyBoost: 1, japa: true },
}

/* --------------------------- the content gates ------------------------------ */

/** Crime-adjacent content ids — the roads a kid or teen cannot walk. */
export type CrimeContentId = 'night-out' | 'regatta-bet' | 'japa-agent'

export const CRIME_CONTENT_IDS: readonly CrimeContentId[] = ['night-out', 'regatta-bet', 'japa-agent']

export const CRIME_REFUSALS: Record<CrimeContentId, string> = {
  'night-out': 'The lounge na 18+ matter — go school tomorrow, the street go wait.',
  'regatta-bet': 'Race-eve betting na 18+. Small paddies dey sponsor boat — that one better pass.',
  'japa-agent': 'No waka enter that agent office — na adult paperwork, and some of dem na 419.',
}

/** true when THIS band may touch THIS crime-adjacent content. */
export function crimeAllowed(band: AgeBand, content: CrimeContentId): boolean {
  void content
  return AGE_LAW[band].crime
}

/** A hustle def needs only this shape for the gate. */
export interface HustleGateKey {
  id: string
  kidSafe: boolean
}

/** Can THIS band run THIS hustle? Kids carry light loads only. */
export function canHustle(band: AgeBand, def: HustleGateKey): boolean {
  return AGE_LAW[band].hustle === 'all' || def.kidSafe
}

/** The JAPA gauntlet refuses kids (adult paperwork, honest Nigerian reality). */
export function canJapa(band: AgeBand): boolean {
  return AGE_LAW[band].japa
}

/**
 * THE GRAPH BLOCK — structurally impossible contact. An adult account can
 * never contact a minor account: kid/teen accounts have no contactable
 * address (zero data collected), and this verdict is the law every social
 * surface (present and future) must pass. Everything else may greet.
 */
export function canContact(from: AgeBand | null, to: AgeBand | null): boolean {
  if (from === 'adult' && (to === 'kid' || to === 'teen')) return false
  return true
}

/* ------------------------------ parent PIN --------------------------------- */

/** A parent PIN is exactly 6 digits — long enough to matter, short enough for a parent to keep. */
export function validateParentPin(pin: string): { ok: boolean; why: string } {
  if (!/^\d{6}$/.test(pin)) return { ok: false, why: 'Parent PIN must be exactly 6 digits.' }
  return { ok: true, why: '' }
}

/**
 * The LOCAL parent-PIN gate (guests without a cloud account). Honest
 * scope: a device-local soft gate — iterated salted FNV, enough to stop
 * a casual tier bump. The REAL pin law lives server-side (scrypt, the
 * register and the tier route own it).
 */
export function localPinHash(pin: string, salt: string): string {
  let h = 0x811c9dc5
  const material = `${salt}:${pin}`
  for (let round = 0; round < 600; round++) {
    for (let i = 0; i < material.length; i++) {
      h ^= material.charCodeAt(i)
      h = Math.imul(h, 0x01000193) >>> 0
    }
    h = (h + round) >>> 0
  }
  return h.toString(16).padStart(8, '0') + salt
}

export function makeLocalSalt(): string {
  // deterministic-safe salt for guests: mixes clock with entropy when present
  const rnd = typeof crypto !== 'undefined' && 'getRandomValues' in crypto
    ? Array.from(crypto.getRandomValues(new Uint8Array(6))).map((b) => b.toString(16).padStart(2, '0')).join('')
    : Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  return rnd
}

/** The tier ladder order — kid climbs to teen climbs to adult. */
const TIER_ORDER: AgeBand[] = ['kid', 'teen', 'adult']

export interface TierGateVerdict {
  allowed: boolean
  why: string
}

/**
 * THE TIER GATE — Parent PIN gates tiers. Climbing kid→teen or
 * teen→adult requires the parent's yes (parentPinOk). Demotion (a parent
 * pulling the ladder back down) is always allowed; adult accounts never
 * climb (they are the top).
 */
export function tierGateVerdict(from: AgeBand, to: AgeBand, parentPinOk: boolean): TierGateVerdict {
  if (from === to) return { allowed: false, why: 'You don dey that tier already.' }
  const up = TIER_ORDER.indexOf(to) > TIER_ORDER.indexOf(from)
  if (up && from !== 'adult') {
    return parentPinOk
      ? { allowed: true, why: '' }
      : { allowed: false, why: 'A parent must unlock that tier — enter the Parent PIN.' }
  }
  return { allowed: true, why: '' }
}

/* -------------------------------- elder mode -------------------------------- */

/** The elder accessibility verdict — the UI folds this into one root class. */
export function elderClass(on: boolean): string | null {
  return on ? 'elder-mode' : null
}

/* ---------------------- SPOT THE SCAMMER (literacy game) -------------------- */

export interface ScamLine {
  text: string
  why: string
}

/** The 419 roads — every line a real Lokoja street scam pattern. */
export const SCAM_LINES: ScamLine[] = [
  { text: 'You don win MTN promo! Send ₦2,000 activation fee make I release the ₦500,000.', why: 'No real promo asks you to PAY to collect a prize. Na advance-fee fraud.' },
  { text: 'I be bank official — give me your BVN and card PIN make I clear the ₦750,000 wey dey hang.', why: 'Your bank will NEVER ask for your BVN or PIN. Na account takeover.' },
  { text: 'Your uncle send package from abroad — pay customs fee ₦15,000 to this personal account.', why: 'Customs fees no ever enter personal account. Na fake delivery scam.' },
  { text: 'Click this link sharp sharp make you claim your JAMB refund before 6pm.', why: 'Strange links = phishing. Dem go harvest your details. Type the site yourself or no go.' },
  { text: 'Send the naira first, the dollar go land for you tomorrow — black market rate, no inspection.', why: 'Nobody honest collects money before you see the goods. Na 419.' },
  { text: 'Your account go block in 24 hours unless you update am with your card PIN for this app.', why: 'Threat + urgency + PIN request = scam. Bank block no dey come like WhatsApp message.' },
  { text: 'I be army officer — seized phones dey sell half price, pay today, no receipt, no inspection.', why: 'Stolen goods + no receipt + pressure = you go lose your money (or worse).' },
  { text: 'Send me the OTP wey just enter your phone make I finish the transfer — I go send am back.', why: 'Your OTP na the last lock. ANYBODY wey ask for am na thief.' },
  { text: 'Pay ₦5,000 for immigration form — I go link you visa wey no get interview at all.', why: 'No visa skip interview by magic. Na japa scam — dem dey sweep boys with am.' },
  { text: 'Send any amount, in 30 minutes e go double — na village power from my grandfather.', why: 'Money no dey double by mouth. Ponzi + juju story = 419 classic.' },
  { text: 'iPhone 15 Pro ₦90k — pay today, pickup tomorrow, no come inspect am before payment o.', why: 'Cheap flagship + no inspection + pay-first = wrong marketplace triangle.' },
  { text: 'Your NECO result fail — pay ₦8,000 make I upgrade am for CBT office before dem seal am.', why: 'Result upgrade na scam AND offence — dem go collect the ₦8k plus your future.' },
]

/** The honest lines — same street, same mouth, but true. */
export const HONEST_LINES: ScamLine[] = [
  { text: 'Kpata market dey open every third day — the fresh pepper land that morning.', why: 'True market gist — no payment, no urgency, no personal account.' },
  { text: 'Make you save ₦500 every week for the bank — small drops fill big buckets.', why: 'Honest advice no ever ask for YOUR money to move first.' },
  { text: 'NEPA bill don land — pay am for the office for GRA, the desk no dey collect extra.', why: 'Real bills dey get real offices. You go see the receipt.' },
  { text: 'If anybody ask for your OTP — even if dem say na bank — block am and report.', why: 'This na the lesson itself: OTP na last lock, nobody legit dey ask.' },
  { text: 'Always collect your school fee receipt the same day you pay.', why: 'Paperwork advice — receipt dey protect you, scam dey avoid paper.' },
  { text: 'Register your SIM with your NIN at the approved centre — the service dey free.', why: 'Real registrations happen at centres, never by transfer to strangers.' },
  { text: 'The canoe ferry dey charge flat fare — count your change before you waka.', why: 'Honest street math — counting change no be crime.' },
  { text: 'The Motor Park job board dey refresh every morning — check am early.', why: 'Work gist wey you fit verify with your own eye.' },
  { text: 'Harmattan sun dey harsh — carry water, wear face cap.', why: 'Care advice. Scams dey always carry money directions, no be water.' },
  { text: 'Keep your rent receipt safe — landlord wahala dey always come one day.', why: 'Receipt na shield. 419 no like anything wey leave paper trail.' },
  { text: 'Baba T dey wash keke for the compound — ₦800, ask anybody for there.', why: 'Real service = real place + verifiable person + agreed price.' },
  { text: 'The library dey open till evening — free past questions dey the shelf.', why: 'Free, checkable, no money path. That na honest street offer.' },
]

/** mulberry32 — tiny deterministic PRNG (fixed seed keeps the lesson stable). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** One round: 3 cards on the table — 1 scam, 2 honest, shuffled by the day. */
export interface ScamRound {
  day: number
  options: { text: string; scam: boolean; why: string }[]
  /** where the scam sits (index) — for the verdict + tests */
  scamIndex: number
}

/** Deterministic per day: same day, same three cards, city-wide. */
export function scamRound(day: number): ScamRound {
  const rng = mulberry32(Math.imul(day + 1, 2654435761) >>> 0)
  const scam = SCAM_LINES[Math.floor(rng() * SCAM_LINES.length)]
  const h1 = HONEST_LINES[Math.floor(rng() * HONEST_LINES.length)]
  let h2 = HONEST_LINES[Math.floor(rng() * HONEST_LINES.length)]
  if (h2.text === h1.text) h2 = HONEST_LINES[(HONEST_LINES.indexOf(h2) + 3) % HONEST_LINES.length]
  const cards = [
    { text: scam.text, scam: true, why: scam.why },
    { text: h1.text, scam: false, why: h1.why },
    { text: h2.text, scam: false, why: h2.why },
  ]
  // seeded shuffle (Fisher–Yates with the same rng — deterministic)
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return { day, options: cards, scamIndex: cards.findIndex((c) => c.scam) }
}

/** The payoff law: ₦150 + ₦25 × streak (streak capped), +8 smart XP, +2 mood. */
export function scamReward(streakBefore: number): { cash: number; smartXp: number; mood: number } {
  const capped = Math.min(streakBefore, 10)
  const cash = 150 + 25 * capped
  return { cash, smartXp: 8, mood: 2 }
}

/** Can the player round up today? Once per in-game day — the street only teaches once a day. */
export function canPlayScammer(lastPlayedDay: number, day: number): boolean {
  return lastPlayedDay !== day
}

/* ------------------------------ fresh slice -------------------------------- */

export function freshShieldState(): ShieldState {
  return { scammerDay: 0, scammerCorrect: 0, scammerWrong: 0, scammerStreak: 0, parentPinHash: null }
}

/** The scammer verdict — pure, so the store just commits it. */
export function scamAnswerApply(
  state: ShieldState,
  round: ScamRound,
  pickIndex: number,
  day: number,
): { next: ShieldState; correct: boolean; reward: { cash: number; smartXp: number; mood: number } | null; lesson: string } {
  const picked = round.options[pickIndex]
  if (picked.scam) {
    const reward = scamReward(state.scammerStreak)
    return {
      next: { ...state, scammerDay: day, scammerCorrect: state.scammerCorrect + 1, scammerStreak: state.scammerStreak + 1 },
      correct: true,
      reward,
      lesson: picked.why,
    }
  }
  const honest = round.options[round.scamIndex]
  return {
    next: { ...state, scammerDay: day, scammerWrong: state.scammerWrong + 1, scammerStreak: 0 },
    correct: false,
    reward: null,
    lesson: honest.why,
  }
}
