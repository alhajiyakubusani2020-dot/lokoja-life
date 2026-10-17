/**
 * LOKOJA LIFE — M24 W5: THE SOCIAL GRAPH LAWS (pure)
 * ===================================================
 * The server door's laws for friends / requests / blocks / reports —
 * PURE functions, zero I/O, zero UI — imported VERBATIM by BOTH doors
 * (the nation-wire socket service AND the /api/live/action relay door),
 * exactly like the M17 law vault. Zero copies, zero drift by construction.
 *
 * THE SHAPE LAW: a relationship is a PAIR of mirrored edges — one row per
 * direction (owner→peer). 'friend' exists on both sides; 'pending' carries
 * the initiator in requestedBy; 'blocked' is ONE-DIRECTIONAL (owner refuses
 * peer) and never lives on the blocked person's side.
 *
 * LAWS OF THIS FILE:
 *  - THE BLOCK LAW: a blocked handle receives NOTHING — no request, no DM,
 *    no invite. The refusal is returned with the real why, never silent.
 *  - THE MUTUAL LAW: if B already asked A, A's "add B" IS the acceptance —
 *    two paddies, one gesture, no duplicate request ever.
 *  - THE KID WALL (M13, server door): a minor's DMs and invites only reach
 *    ACCEPTED paddies — never strangers. Adults reach anyone not blocked.
 *  - THE HONEST-REFUSAL LAW: every verdict carries a stable `why` both
 *    doors and the UI can name.
 *  - THE REPORT LAW: reports are evidence, not verdicts — they land in the
 *    queue for the union's eyes (W12 builds the console); nothing automatic
 *    happens to the reported handle here.
 */

/** The same handle shape the register enforces (M9). */
export const SOCIAL_HANDLE_RE = /^[a-zA-Z0-9_]{3,16}$/

export type SocialEdgeState = 'pending' | 'friend' | 'blocked'

/** One mirrored edge (owner → peer). The pair is the relationship. */
export interface SocialEdge {
  ownerHandle: string
  peerHandle: string
  state: SocialEdgeState
  requestedBy: string
}

export type SocialVerdict =
  | { ok: true; kind: 'new' | 'mutual' }
  | { ok: false; why: SocialRefusal }

export type SocialRefusal =
  | 'bad-handle'
  | 'self'
  | 'no-such-paddy'
  | 'already'
  | 'already-sent'
  | 'they-blocked-you'
  | 'you-blocked-them'
  | 'not-requested'
  | 'not-friends'
  | 'paddies-only'
  | 'blocked'
  | 'bad-reason'
  | 'unclaimed'

/** THE NAMES LAW: the handle the server stores — trimmed, capped, honest. */
export function socialNorm(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim().slice(0, 16) : ''
}

/**
 * THE REQUEST VERDICT — A asks to be B's paddy.
 * edgeAB = A's own row toward B; edgeBA = B's row toward A (their block
 * wall and their pending request live THERE).
 */
export function requestVerdict(a: string, b: string, edgeAB: SocialEdge | null, edgeBA: SocialEdge | null): SocialVerdict {
  if (!SOCIAL_HANDLE_RE.test(b)) return { ok: false, why: 'bad-handle' }
  if (b === a) return { ok: false, why: 'self' }
  if (edgeBA?.state === 'blocked') return { ok: false, why: 'they-blocked-you' }
  if (edgeAB?.state === 'blocked') return { ok: false, why: 'you-blocked-them' }
  if (edgeAB?.state === 'friend' && edgeBA?.state === 'friend') return { ok: false, why: 'already' }
  if (edgeAB?.state === 'pending' && edgeAB.requestedBy === a) return { ok: false, why: 'already-sent' }
  // THE MUTUAL LAW: their pending request to me + my request to them = friends
  if (edgeAB?.state === 'pending' && edgeAB.requestedBy === b) return { ok: true, kind: 'mutual' }
  return { ok: true, kind: 'new' }
}

/** THE ACCEPT VERDICT — B accepts A's standing request. */
export function acceptVerdict(b: string, a: string, edgeBA: SocialEdge | null, edgeAB: SocialEdge | null): { ok: boolean; why?: SocialRefusal } {
  if (!SOCIAL_HANDLE_RE.test(a)) return { ok: false, why: 'bad-handle' }
  if (edgeBA?.state === 'blocked' || edgeAB?.state === 'blocked') return { ok: false, why: 'blocked' }
  if (edgeBA?.state === 'pending' && edgeBA.requestedBy === a) return { ok: true }
  return { ok: false, why: 'not-requested' }
}

/** THE DM VERDICT — the M13 kid wall + the block wall at the server door.
 * edgeToMe = recipient's row toward the sender (their block wall);
 * edgeMeTo = sender's row toward the recipient (the kid's friendship proof). */
export function dmVerdict(band: 'guest' | 'kid' | 'teen' | 'adult', edgeToMe: SocialEdge | null, edgeMeTo: SocialEdge | null): { ok: boolean; why?: SocialRefusal } {
  if (band === 'guest') return { ok: false, why: 'unclaimed' }
  if (edgeToMe?.state === 'blocked') return { ok: false, why: 'blocked' }
  if ((band === 'kid' || band === 'teen') && edgeMeTo?.state !== 'friend') return { ok: false, why: 'paddies-only' }
  return { ok: true }
}

/** THE REPORT LAW — evidence only, the reason must be nameable. */
export const REPORT_REASONS = ['harassment', 'scam', 'abuse', 'impersonation', 'other'] as const
export type ReportReason = (typeof REPORT_REASONS)[number]

export function reportVerdict(target: string, reason: string): { ok: boolean; why?: SocialRefusal; reason?: ReportReason } {
  if (!SOCIAL_HANDLE_RE.test(target)) return { ok: false, why: 'bad-handle' }
  const r = (REPORT_REASONS as readonly string[]).includes(reason) ? (reason as ReportReason) : 'other'
  return { ok: true, reason: r }
}

/** The DM history channel — ONE shape, both doors (also used by W6's ledger). */
export function dmChannel(a: string, b: string): string {
  return `dm:${[a, b].sort().join('|')}`
}

/** Does this stored channel involve `me`? (history + resume privacy law) */
export function dmChannelInvolves(channel: string, me: string): boolean {
  if (!channel.startsWith('dm:')) return false
  return channel.slice(3).split('|').includes(me)
}

/** A hangout invite's postcard payload (the M15 shape, carried on the wire). */
export function hangoutPayload(from: string, to: string, street: string): { to: string; street: string; from: string } {
  return { to, street: street.slice(0, 48) || 'home', from }
}
