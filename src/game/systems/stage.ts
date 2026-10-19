/**
 * LOKOJA LIFE — M24 W9: THE STAGE — THE PURE LAW VAULT
 * ====================================================
 * The nation's broadcast, as LAWS. The wire door runs these VERBATIM
 * (the W4 doctrine: zero copies, zero drift); the client engine
 * (stagenet.ts) and the faces run the same functions, so the suite
 * proves one truth and every side of the nation lives it.
 *
 * WHAT A STAGE IS: a claimed ADULT broadcaster puts their real point
 * of view (the living world's own canvas, the walk through Lokoja)
 * on the wire through the self-hosted media house (LiveKit, WHIP
 * ingest); anybody on the wire may WATCH it (the M17 spectate law —
 * guests watch, never walk); the stage room's chat rides the SAME
 * LiveEvent table as every word in the nation (THE ONE-NATION LAW);
 * tips move REAL server naira through the W6 ledger (the fortress
 * chain, idempotent, PIN-sealed); the viewer count is REAL, and the
 * M17 crowd law (crowdMult) stays a DISPLAY note, never a lie about
 * the number.
 *
 * LAWS OF THIS FILE:
 *  - THE BROADCAST DOOR (stageVerdict): a guest has no stage
 *    (guest-mic-dark); a MINOR never broadcasts (stage-adults-only —
 *    the M13 shield: a child's face never goes out on a public stage);
 *    the title law; THE ONE-STAGE LAW (one live stage per host — a
 *    broadcaster is one voice, not a grid of themselves).
 *  - THE SPECTATE LAW (stageWatchVerdict): ANYBODY on the wire may
 *    watch — claimed or guest, kid or adult. Watching is not speaking.
 *    (The stage room's CHAT door still runs the M17 tier laws.)
 *  - THE TITLE LAW (stageTitleOk): 1–64 printable characters after
 *    whitespace collapse; control characters refuse; punctuation-only
 *    refuses (the profile.ts discipline, carried).
 *  - THE ID LAW (stageIdOk): every stage id is minted `stg-` + base36;
 *    anything else refuses at every door that takes a streamId.
 *  - THE TIP DOOR (stageTipVerdict): a tip is REAL transfer money —
 *    the door still runs transferVerdict (W6) VERBATIM; these are the
 *    stage-scoped walls on top: the stage must be LIVE (a tip to a
 *    dead stage is a lost envelope), self-tip refuses, and the room
 *    hears the spray (the M17 SPRAY spirit — the crowd sees the
 *    generosity).
 *  - THE KIND LAW: W9 ships exactly one kind — 'pov' (the walker's
 *    own eyes). The old M17 sim kinds (stall/regatta/wedding) stay in
 *    the store for the M17 suite; they never appear on the real board.
 *  - THE PATH LAW: the media house answers at /rt (next rewrite in
 *    this sandbox; nginx /rt proxy in the deploy guide). The wire
 *    mints TOKENS, never URLs — the origin belongs to the page, so
 *    the same token works behind any front door.
 *  - THE ZERO-IMPORT LAW: this file imports NOTHING — it is a vault,
 *    not a machine.
 */

/* ─────────────────────────── the constants ─────────────────────────── */

export const STAGE_TITLE_MIN = 1
export const STAGE_TITLE_MAX = 64
export const STAGE_KIND = 'pov' as const
export const STAGE_TOKEN_TTL_S = 4 * 60 * 60 // the media house token: four hours, renewed by the next stage

/** THE ID LAW — `stg-` + base36 (the wire mints; every door verifies). */
export const STAGE_ID_RE = /^stg-[0-9a-z]{6,16}$/

export function stageIdOk(id: unknown): id is string {
  return typeof id === 'string' && STAGE_ID_RE.test(id)
}

/** The wire room a stage broadcasts inside (socket.io), and the
 * LiveEvent channel its chat rides (THE ONE-NATION LAW). */
export function stageRoom(id: string): string {
  return `wire:stage:${id}`
}

export function stageChannel(id: string): string {
  return `stream:${id}`
}

export function stageChannelInvolves(channel: string, streamId: string): boolean {
  return channel === stageChannel(streamId)
}

/* ─────────────────────────── the title law ─────────────────────────── */

const PRINTABLE_RE = /^[\x20-\x7E\u00A0-\uFFFF]+$/
const PUNCT_ONLY_RE = /^[\p{P}\p{S}\s]+$/u

export function stageTitleOk(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const t = raw.replace(/\s+/g, ' ').trim()
  if (t.length < STAGE_TITLE_MIN || t.length > STAGE_TITLE_MAX) return null
  if (!PRINTABLE_RE.test(t)) return null
  if (PUNCT_ONLY_RE.test(t)) return null
  return t
}

/* ───────────────────────── the broadcast door ──────────────────────── */

export type StageWhy =
  | 'guest-mic-dark'
  | 'stage-adults-only'
  | 'bad-title'
  | 'stage-live-already'
  | 'stage-not-live'
  | 'not-yours'
  | 'self'
  | 'bad-stage'

export interface StageIdentity {
  handle: string | null
  band: 'kid' | 'teen' | 'adult' | 'guest'
}

export interface StageVerdict {
  ok: boolean
  why?: StageWhy
  title?: string
}

/** THE BROADCAST DOOR — the whole start law, judged before the media
 * house is ever asked for a token. */
export function stageVerdict(identity: StageIdentity, rawTitle: unknown, liveStageOfHost: boolean): StageVerdict {
  if (!identity.handle || identity.band === 'guest') return { ok: false, why: 'guest-mic-dark' }
  if (identity.band !== 'adult') return { ok: false, why: 'stage-adults-only' }
  const title = stageTitleOk(rawTitle)
  if (!title) return { ok: false, why: 'bad-title' }
  if (liveStageOfHost) return { ok: false, why: 'stage-live-already' }
  return { ok: true, title }
}

/* ───────────────────────── the spectate law ────────────────────────── */

/** THE SPECTATE LAW — watching is open to the whole wire (claimed or
 * guest), but only a LIVE stage admits an eye. */
export function stageWatchVerdict(_identity: StageIdentity, stageLive: boolean): { ok: boolean; why?: StageWhy } {
  if (!stageLive) return { ok: false, why: 'stage-not-live' }
  return { ok: true }
}

/* ─────────────────────────── the tip door ──────────────────────────── */

export interface StageTipVerdict {
  ok: boolean
  why?: StageWhy | 'minors-no-money'
}

/** THE TIP DOOR — the stage-scoped walls ONLY. The money laws
 * (transferVerdict, the PIN law, minors-collect-nothing, the day cap,
 * the idempotency law) are the W6 door's own and run VERBATIM beside
 * this verdict. */
export function stageTipVerdict(identity: StageIdentity, stageLive: boolean, host: string): StageTipVerdict {
  if (!identity.handle || identity.band === 'guest') return { ok: false, why: 'guest-mic-dark' }
  if (identity.band !== 'adult') return { ok: false, why: 'minors-no-money' }
  if (!stageLive) return { ok: false, why: 'stage-not-live' }
  if (host === identity.handle) return { ok: false, why: 'self' }
  return { ok: true }
}

/* ─────────────────────── the mesh laws (W9's media plane) ──────────────────────── */

/** THE MESH AMENDMENT (recorded, honest): the OSS livekit-server ships NO
 * WHIP door at all (witnessed: 404 with a VALID grant on v1.8.4 AND
 * v1.13.10 — the auth middleware 401s on garbage, the route itself does
 * not exist), and the livekit-client SDK would blow the N2 wire budget
 * (~100KB). So the stage rides the SAME architecture as the W7 voice and
 * the W8 face: SIGNALING on the nation-wire, MEDIA peer-to-peer, ONE
 * publisher offering to each eye. The wire never carries media (N5 holds);
 * the SFU (LiveKit Cloud WHIP or mediasoup) is the W12+ upgrade path the
 * moment the mesh cap demands it. */

/** THE MESH CAP — one publisher's honest uplink ceiling. The 9th eye gets
 * 'stage-full' — an honest refusal, never a stuttering lie. */
export const STAGE_MESH_MAX = 8

export interface StageEyeVerdict {
  ok: boolean
  why?: StageWhy | 'stage-full'
}

/** THE EYE LAW — the spectate door grows the mesh tooth: a LIVE stage
 * admits an eye UNTIL THE CAP. */
export function stageEyeVerdict(eyeCount: number, stageLive: boolean): StageEyeVerdict {
  if (!stageLive) return { ok: false, why: 'stage-not-live' }
  if (eyeCount >= STAGE_MESH_MAX) return { ok: false, why: 'stage-full' }
  return { ok: true }
}

/* ─────────────────────── the end door (host only) ──────────────────── */

export function stageEndOk(identity: StageIdentity, host: string): { ok: boolean; why?: StageWhy } {
  if (!identity.handle || identity.band === 'guest') return { ok: false, why: 'guest-mic-dark' }
  if (identity.handle !== host) return { ok: false, why: 'not-yours' }
  return { ok: true }
}

/* ───────────────────── the crowd law (display only) ────────────────── */

/** THE CROWD NOTE — the REAL viewer count is the truth; this multiplier
 * (M17 crowdMult, carried verbatim by import at the door) is the
 * DISPLAY note under it: each viewer thickens the imagined crowd,
 * capped. The board never shows the multiplied number AS the count. */
export function crowdNoteText(viewers: number): string {
  const real = Math.max(0, Math.floor(viewers))
  if (real === 0) return 'no eyes yet'
  const mult = 1 + Math.min(real, 40) * 0.0125
  return `${real} real ${real === 1 ? 'eye' : 'eyes'} · crowd ×${mult.toFixed(2)}`
}
