/**
 * LOKOJA LIFE — M24 W1: THE REGISTER (pure profile laws)
 * =======================================================
 * What the street sees. The claim door now collects the WHOLE face:
 * handle + PIN + birthday (the band law, untouched) + DISPLAY NAME +
 * AVATAR LOOK (+ optional bio) → the ProfileRow. The avatar look rides
 * the REAL vocabularies from data/avatar.ts — the same words the
 * CharacterCreation speaks and the W2 remote-body renderer will draw —
 * so what you design at signup is what the city sees walking.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. The API
 *    doors import the SAME functions (the M17 law-vault doctrine: the
 *    browser and the server can never disagree about a verdict).
 *  - The vocabulary law: every look value must exist in the REAL
 *    option arrays. A hex we never minted or a style key we never
 *    named refuses at the door — no invented bodies on the street.
 *  - THE PREVIEW LAW: a guest walks FREE for exactly 60 seconds, then
 *    the wall stands. Not a dead end — a door (claim, or the menu).
 *  - Contact is optional and nullable (the v2 register law): the M13
 *    minor shield never collects it; adults MAY give a recovery line,
 *    validated-if-present, never demanded.
 */

import {
  SKIN_TONES,
  HAIR_COLORS,
  AVATAR_HAIRSTYLES,
  AVATAR_CLOTHING_STYLES,
  CLOTHING_COLORS,
  DEFAULT_AVATAR,
} from '../data/avatar'

/* ------------------------------ the look law ------------------------------- */

export interface AvatarLook {
  skinTone: string
  hairColor: string
  hairstyle: string
  clothingStyle: string
  clothingColor: string
}

/** The REAL vocabulary values, as sets — O(1) door checks, one truth. */
const SKIN_VALUES = new Set(SKIN_TONES.map((o) => o.value))
const HAIR_VALUES = new Set(HAIR_COLORS.map((o) => o.value))
const HAIR_KEYS = new Set(AVATAR_HAIRSTYLES.map((o) => o.key))
const CLOTHING_STYLE_KEYS = new Set(AVATAR_CLOTHING_STYLES.map((o) => o.key))
const CLOTHING_VALUES = new Set(CLOTHING_COLORS.map((o) => o.value))

export const DEFAULT_LOOK_JSON = JSON.stringify(DEFAULT_AVATAR)

/** The default look for a claimer who never touched the picker. */
export function defaultLook(): AvatarLook {
  return { ...DEFAULT_AVATAR }
}

function isLookShape(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

/**
 * THE LOOK LAW — parse + verify an avatar look. Accepts the object or
 * its JSON string; every value must be one the vocabularies minted.
 * Returns the canonical shape or a refusal — never a half-look.
 */
export function validateAvatarLook(raw: unknown): { ok: boolean; why: string; look?: AvatarLook } {
  let v: unknown = raw
  if (typeof raw === 'string') {
    if (raw.length > 500) return { ok: false, why: 'The look payload is too heavy.' }
    try {
      v = JSON.parse(raw)
    } catch {
      return { ok: false, why: 'The look is not a valid payload.' }
    }
  }
  if (!isLookShape(v)) return { ok: false, why: 'The look is not a valid payload.' }
  const skinTone = str(v.skinTone)
  const hairColor = str(v.hairColor)
  const hairstyle = str(v.hairstyle)
  const clothingStyle = str(v.clothingStyle)
  const clothingColor = str(v.clothingColor)
  if (!SKIN_VALUES.has(skinTone)) return { ok: false, why: 'Pick a skin tone from the real shades.' }
  if (!HAIR_VALUES.has(hairColor)) return { ok: false, why: 'Pick a hair colour from the real shades.' }
  if (!HAIR_KEYS.has(hairstyle)) return { ok: false, why: 'Pick a hairstyle the barber knows.' }
  if (!CLOTHING_STYLE_KEYS.has(clothingStyle)) return { ok: false, why: 'Pick a clothing style the tailor knows.' }
  if (!CLOTHING_VALUES.has(clothingColor)) return { ok: false, why: 'Pick a clothing colour from the real palette.' }
  return { ok: true, why: '', look: { skinTone, hairColor, hairstyle, clothingStyle, clothingColor } }
}

/* --------------------------- the name + bio laws --------------------------- */

/** 2–24 visible characters — a street name people can hail you by. */
export function validateDisplayName(name: string): { ok: boolean; why: string } {
  const n = name.trim().replace(/\s+/g, ' ')
  if (n.length < 2 || n.length > 24) return { ok: false, why: 'Display name must be 2–24 characters.' }
  // printable, no control chars / newlines — one line the roster can render
  if (/[\u0000-\u001F\u007F]/.test(n)) return { ok: false, why: 'Letters, numbers and plain punctuation only.' }
  if (/^[\p{P}\p{S}\s]+$/u.test(n)) return { ok: false, why: 'A name needs at least one letter or number.' }
  return { ok: true, why: '' }
}

/** ≤ 280 chars — a bio, not a sermon. */
export function validateBio(bio: string): { ok: boolean; why: string } {
  const b = bio.trim()
  if (b.length > 280) return { ok: false, why: 'Bio must be 280 characters or fewer.' }
  if (/[\u0000-\u001F\u007F]/.test(b)) return { ok: false, why: 'Plain text only — no control characters.' }
  return { ok: true, why: '' }
}

/* ----------------------------- the door verdict ----------------------------- */

export interface ProfileClaimInput {
  displayName: string
  avatarLook: string
  bio?: string
}

export interface ProfileVerdict {
  ok: boolean
  why: string
  displayName?: string
  bio?: string
  look?: AvatarLook
}

/**
 * THE DOOR LAW — the whole register payload in one verdict: the face
 * name, the look, the optional bio. The route and the sheet both run
 * THIS function; neither can drift from the other.
 */
export function profileVerdict(input: ProfileClaimInput): ProfileVerdict {
  const vName = validateDisplayName(input.displayName ?? '')
  if (!vName.ok) return { ok: false, why: vName.why }
  const vBio = validateBio(input.bio ?? '')
  if (!vBio.ok) return { ok: false, why: vBio.why }
  const vLook = validateAvatarLook(input.avatarLook ?? '')
  if (!vLook.ok || !vLook.look) return { ok: false, why: vLook.why }
  return {
    ok: true,
    why: '',
    displayName: input.displayName.trim().replace(/\s+/g, ' '),
    bio: (input.bio ?? '').trim() || undefined,
    look: vLook.look,
  }
}

/** What a PATCH may touch — the profile is the only writable surface. */
export interface ProfilePatchInput {
  displayName?: string
  avatarLook?: string
  bio?: string
}

/**
 * THE PATCH LAW — same laws, partial fields: an absent field keeps its
 * current value, a present field must pass whole.bio/look validation.
 */
export function profilePatchVerdict(patch: ProfilePatchInput): ProfileVerdict {
  const vName =
    patch.displayName === undefined
      ? { ok: true, why: '' }
      : validateDisplayName(patch.displayName)
  if (!vName.ok) return { ok: false, why: vName.why }
  const vBio = patch.bio === undefined ? { ok: true, why: '' } : validateBio(patch.bio)
  if (!vBio.ok) return { ok: false, why: vBio.why }
  // THE ABSENT-FIELD LAW: an absent look means "keep mine" — its branch
  // carries look: undefined and the guard must NOT mistake that for a
  // refusal (only a PRESENT look must parse to a whole shape).
  const vLook =
    patch.avatarLook === undefined
      ? { ok: true as const, why: '', look: undefined }
      : validateAvatarLook(patch.avatarLook)
  if (!vLook.ok) return { ok: false, why: vLook.why }
  return {
    ok: true,
    why: '',
    displayName: patch.displayName === undefined ? undefined : patch.displayName.trim().replace(/\s+/g, ' '),
    bio: patch.bio === undefined ? undefined : patch.bio.trim() || '',
    look: vLook.look,
  }
}

/* ---------------------------- the preview law ---------------------------- */

/** THE PREVIEW LAW: a guest sees the whole city free for 60 seconds. */
export const GUEST_PREVIEW_MS = 60_000

export interface PreviewState {
  /** ms of the preview left (never negative) */
  remainingMs: number
  /** the wall stands */
  expired: boolean
  /** 0–1 for the countdown ring */
  fraction: number
}

/**
 * The 60-second law, computed — pure so the suite can freeze time and
 * the face can tick against the same math. startedAt <= 0 means the
 * preview has not begun (no wall yet).
 */
export function previewState(startedAt: number, now: number): PreviewState {
  if (!startedAt || startedAt <= 0) return { remainingMs: GUEST_PREVIEW_MS, expired: false, fraction: 1 }
  const elapsed = Math.max(0, now - startedAt)
  const remainingMs = Math.max(0, GUEST_PREVIEW_MS - elapsed)
  return {
    remainingMs,
    expired: remainingMs === 0,
    fraction: Math.max(0, Math.min(1, remainingMs / GUEST_PREVIEW_MS)),
  }
}

/* ----------------------------- the public face ----------------------------- */

/** The sanitized profile that may leave the server — nothing sensitive. */
export interface PublicProfile {
  handle: string
  displayName: string
  avatarLook: string
  bio: string | null
}

/** What the roster, the wire and the W2 bodies may read of a profile. */
export function sanitizeProfilePublic(row: {
  handle: string
  displayName: string
  avatarLook: string
  bio: string | null
}): PublicProfile {
  return {
    handle: row.handle,
    displayName: row.displayName,
    avatarLook: row.avatarLook,
    bio: row.bio ?? null,
  }
}
