/**
 * LOKOJA LIFE — M19: THE WARDROBE LAWS (walk-cycle shop + outfit drops)
 * ----------------------------------------------------------------------
 * The fashion layer becomes a real market: premium outfits and walk
 * styles are bought with NAIRA through the honest wallet engines, or
 * GRANTED as drops (quests, festivals, the hill). Pure + deterministic —
 * the same purchase decision is legal or illegal everywhere, and the
 * store only executes what these laws allow.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, action) → same verdict. No
 *    store, no React, no DOM.
 *  - Money NEVER moves here — the store calls removeMoney/addMoney and
 *    then these laws validate the book change.
 *  - 'street' walk and the six base clothing styles are owned by birth;
 *    only premium goods touch the wardrobe book.
 *  - Drops are append-only: an owned item can never be granted twice
 *    (idempotent), and an unknown key is refused at the door.
 *  - The equipped walk must be an OWNED walk — the law refuses to equip
 *    what the wardrobe does not hold (a bare CityId-style door guard).
 */

import type { WardrobeState } from '../types'

/* --------------------------------- catalogue -------------------------------- */

export interface WalkStyle {
  key: string
  label: string
  /** the flavour line the shop shows */
  blurb: string
  /** ₦ price in the Bend-Down-Select premium rail */
  price: number
  /** the rig's motion parameters — HumanRig consumes these EXACT numbers */
  rig: WalkRig
}

/**
 * THE RIG SHAPE — every walk style is ONE set of five honest numbers:
 *   freq    — stride frequency multiplier (rad/s base 8.4)
 *   swing   — arm/leg swing amplitude multiplier (base 1)
 *   bob     — torso bob multiplier (base 1)
 *   sway    — hip sway multiplier (base 1)
 *   lean    — standing/run lean add (rad, small!)
 *   shin    — knee flex multiplier (base 1)
 * Bounds are asserted by `isSaneWalk` — a style that would bend the
 * rig into a pretzel never ships.
 */
export interface WalkRig {
  freq: number
  swing: number
  bob: number
  sway: number
  lean: number
  shin: number
}

export const WALK_STYLES: readonly WalkStyle[] = [
  {
    key: 'street',
    label: 'Street Walk',
    blurb: 'The classic Lokoja stride you were born with.',
    price: 0,
    rig: { freq: 1, swing: 1, bob: 1, sway: 1, lean: 0, shin: 1 },
  },
  {
    key: 'strut',
    label: 'Chairman Strut',
    blurb: 'Shoulders back, chin up — the GRA walk that owns the road.',
    price: 1200,
    rig: { freq: 0.86, swing: 1.22, bob: 1.5, sway: 1.6, lean: -0.03, shin: 0.86 },
  },
  {
    key: 'swagger',
    label: 'Patti Swagger',
    blurb: 'A rolling hip sway learnt on the mountain trails.',
    price: 1800,
    rig: { freq: 0.92, swing: 1.1, bob: 1.25, sway: 2.1, lean: 0.01, shin: 0.95 },
  },
  {
    key: 'hustle',
    label: 'Hustle Rush',
    blurb: 'Fast, forward-leaning — POS deadline energy.',
    price: 1500,
    rig: { freq: 1.28, swing: 1.35, bob: 1.15, sway: 0.7, lean: 0.09, shin: 1.15 },
  },
  {
    key: 'glide',
    label: 'Confluence Glide',
    blurb: 'Smooth as the Niger at dawn — barely a bob.',
    price: 2200,
    rig: { freq: 0.78, swing: 0.78, bob: 0.45, sway: 0.9, lean: 0, shin: 0.8 },
  },
  {
    key: 'bata',
    label: 'Bata Step',
    blurb: 'The festival drum in your feet — every walk a small dance.',
    price: 2600,
    rig: { freq: 1.12, swing: 1.45, bob: 1.8, sway: 1.8, lean: 0.02, shin: 1.3 },
  },
]

/** The premium outfit rail — keys MUST exist in AVATAR_CLOTHING_STYLES
 *  (the bridge test in m19-polish proves the two catalogues agree). */
export const PREMIUM_OUTFITS: readonly { key: string; label: string; blurb: string; price: number }[] = [
  { key: 'agbada', label: 'Agbada Royale', blurb: 'Three-piece flowing grandeur — owambe law.', price: 8500 },
  { key: 'confluence-gold', label: 'Confluence Gold', blurb: 'The white-coat gift: gold-threaded agbada. Not sold — earned.', price: 0 },
  { key: 'jersey', label: 'Match Jersey', blurb: 'Number 10 — the street named you.', price: 3200 },
  { key: 'lab-coat', label: 'The White Coat', blurb: 'A dream pressed clean. Not sold — earned.', price: 0 },
]

export const WALK_BY_KEY = new Map(WALK_STYLES.map((w) => [w.key, w]))
export const PREMIUM_BY_KEY = new Map(PREMIUM_OUTFITS.map((o) => [o.key, o]))

/** The base clothing styles every player owns from creation. */
export const BASE_STYLE_KEYS: ReadonlySet<string> = new Set(['tshirt', 'kaftan', 'ankara', 'senator', 'hoodie', 'lace'])
/** The always-free walk (owned by birth, never purchasable). */
export const STREET_WALK = 'street'

/* ----------------------------------- laws ----------------------------------- */

const RIG_BOUNDS = { freq: [0.6, 1.5], swing: [0.5, 1.6], bob: [0.2, 2.0], sway: [0.4, 2.4], lean: [-0.05, 0.12], shin: [0.6, 1.4] } as const

/** THE SANITY LAW: a rig outside human motion bounds is refused at the door. */
export function isSaneWalk(w: WalkStyle): boolean {
  const r = w.rig
  return (
    r.freq >= RIG_BOUNDS.freq[0] && r.freq <= RIG_BOUNDS.freq[1] &&
    r.swing >= RIG_BOUNDS.swing[0] && r.swing <= RIG_BOUNDS.swing[1] &&
    r.bob >= RIG_BOUNDS.bob[0] && r.bob <= RIG_BOUNDS.bob[1] &&
    r.sway >= RIG_BOUNDS.sway[0] && r.sway <= RIG_BOUNDS.sway[1] &&
    r.lean >= RIG_BOUNDS.lean[0] && r.lean <= RIG_BOUNDS.lean[1] &&
    r.shin >= RIG_BOUNDS.shin[0] && r.shin <= RIG_BOUNDS.shin[1]
  )
}

export function freshWardrobeState(): WardrobeState {
  return { ownedStyles: [], ownedWalks: [], activeWalk: STREET_WALK }
}

export type ShopVerdict =
  | { ok: true; itemKey: string; price: number; kind: 'walk' | 'outfit' }
  | { ok: false; why: string }

/**
 * THE SHOP DOOR: one honest verdict per purchase. Free-price items
 * (the earned drops) are NOT purchasable — they arrive through
 * `grantDrop` or they do not arrive. Double ownership is refused
 * kindly (it is already yours), unknown keys refused hard.
 */
export function shopBuy(state: WardrobeState, kind: 'walk' | 'outfit', itemKey: string): ShopVerdict {
  if (kind === 'walk') {
    const w = WALK_BY_KEY.get(itemKey)
    if (!w) return { ok: false, why: 'We no sell that walk for this market.' }
    if (w.key === STREET_WALK) return { ok: false, why: 'Street Walk na your birthright — e no dey cost.' }
    if (w.price <= 0) return { ok: false, why: 'This one na gift — no price tag.' }
    if (state.ownedWalks.includes(w.key)) return { ok: false, why: 'You don already own this walk.' }
    return { ok: true, itemKey: w.key, price: w.price, kind: 'walk' }
  }
  const o = PREMIUM_BY_KEY.get(itemKey)
  if (!o) return { ok: false, why: 'We no sell that cloth for this market.' }
  if (o.price <= 0) return { ok: false, why: 'This one na gift — you must earn am.' }
  if (state.ownedStyles.includes(o.key)) return { ok: false, why: 'You don already own this outfit.' }
  return { ok: true, itemKey: o.key, price: o.price, kind: 'outfit' }
}

export type EquipVerdict = { ok: true; walkKey: string } | { ok: false; why: string }

/** THE EQUIP DOOR: the equipped walk must already sit in the book. */
export function equipWalk(state: WardrobeState, walkKey: string): EquipVerdict {
  if (!WALK_BY_KEY.has(walkKey)) return { ok: false, why: 'That walk no exist.' }
  if (walkKey !== STREET_WALK && !state.ownedWalks.includes(walkKey)) {
    return { ok: false, why: 'Buy the walk first — the rig no dey take credit.' }
  }
  return { ok: true, walkKey }
}

export type DropVerdict = { ok: true; added: string | null } | { ok: false; why: string }

/**
 * THE DROP DOOR (append-only, idempotent): a quest/festival grant adds
 * the item once; granting it again changes nothing (honest `added: null`
 * instead of a fake success). Outfit drops land in ownedStyles; walk
 * drops land in ownedWalks.
 */
export function grantDrop(state: WardrobeState, kind: 'walk' | 'outfit', itemKey: string): DropVerdict {
  if (kind === 'walk') {
    if (!WALK_BY_KEY.has(itemKey)) return { ok: false, why: 'Unknown walk drop.' }
    if (state.ownedWalks.includes(itemKey)) return { ok: true, added: null }
    state.ownedWalks.push(itemKey)
    return { ok: true, added: itemKey }
  }
  if (!PREMIUM_BY_KEY.has(itemKey) && !BASE_STYLE_KEYS.has(itemKey)) return { ok: false, why: 'Unknown outfit drop.' }
  if (BASE_STYLE_KEYS.has(itemKey)) return { ok: true, added: null } // base styles need no book
  if (state.ownedStyles.includes(itemKey)) return { ok: true, added: null }
  state.ownedStyles.push(itemKey)
  return { ok: true, added: itemKey }
}

/** Does the player own this clothing style for the avatar render? Base styles always true. */
export function ownsStyle(state: WardrobeState, styleKey: string): boolean {
  return BASE_STYLE_KEYS.has(styleKey) || state.ownedStyles.includes(styleKey)
}

/** The rig numbers for the equipped walk — unknown/unequipped falls back to street. */
export function walkRigFor(state: Pick<WardrobeState, 'activeWalk'> | null | undefined): WalkRig {
  const w = state ? WALK_BY_KEY.get(state.activeWalk) : undefined
  return (w && isSaneWalk(w) ? w.rig : WALK_STYLES[0].rig)
}
