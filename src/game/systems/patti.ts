/**
 * LOKOJA LIFE — M19: MT PATTI SECRETS (the hill's five honest spots)
 * ------------------------------------------------------------------
 * Five seeded hidden places on the guardian hill, discovered the old
 * way: you WALK there. No minigame, no lottery — the ground itself is
 * the game. The HUD polls nearestSecret() with the player's position
 * at ~2Hz; one step inside DISCOVERY_RADIUS and the spot is yours
 * forever (the save records the day it was found).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (position, state) → same answer.
 *    No store, no React, no DOM.
 *  - Discovery is IDEMPOTENT: finding a found secret returns the same
 *    state and isNew:false — a reward can never double-pay. (The store
 *    wires the drop through its own honest engines exactly once, on
 *    isNew:true — cash/xp/rep via addMoney & co, outfit/walk via the
 *    wardrobe's append-only grant.)
 *  - Rewards ride as DATA (kind + amount/item) — no money moves here.
 *
 * PLACEMENT MATH (authored once from world3d/layout.ts — do not re-derive):
 *  layout.ts's PATTI_TRAIL is a PRIVATE polyline of 7 points from the
 *  trailhead (-51.7,-85.2) to the summit (-85,-136) — and importing
 *  layout.ts would drag the 432KB generated geo.ts into every systems
 *  consumer. So the five secrets are FIXED CONSTANTS, placed (at
 *  authoring time, computed to 1 decimal) as a trail vertex/segment
 *  midpoint plus a fixed PERPENDICULAR offset:
 *    mast         = midpoint(P0→P1) + 6u perpendicular   (west of the track)
 *    baobab       = P2 bend         + 7u perpendicular   (uphill side)
 *    quarry-cave  = P3 bend         + 8u perpendicular   (east slope face)
 *    rest-house   = MOUNT_PATTI anchor (-84.94,-135.78) + (8,-4)
 *    summit-stone = MOUNT_PATTI anchor + (-5,4)          (the summit core)
 *  Every perpendicular offset is < DISCOVERY_RADIUS, so walking the
 *  real trail discovers every secret honestly (trailDist ≤ 8.9);
 *  pairwise spread ≥ 15.3u so two secrets never share one footstep.
 *
 * THE Y LAW: y is 0 everywhere on purpose. Terrain heightAt() lives in
 * the heavy world3d/layout.ts (the 432KB geo chain) — the 3D layer
 * samples heightAt(x, z) itself when it plants the markers; this file
 * never guesses a height.
 */

import type { PattiState } from '../types'

/* --------------------------------- the secrets ------------------------------- */

export interface PattiSecret {
  id: string
  name: string
  /** the discovery flavour line (Pidgin-flavoured, honest) */
  line: string
  /** world position — y is always 0, the 3D layer samples heightAt itself */
  x: number
  y: number
  z: number
  /** one-time reward — the store executes it through its own engines */
  reward: { kind: 'cash' | 'xp' | 'rep' | 'outfit' | 'walk'; amount?: number; item?: string }
}

/**
 * The five spots, summit-bound order (they double as a tour of the
 * real trail): lower-slope mast → baobab bend → quarry face → Lugard's
 * rest house → the summit stone. Rewards are honest and small.
 */
export const PATTI_SECRETS: readonly PattiSecret[] = [
  {
    id: 'mast',
    name: 'The Climbers\' Mast',
    line: 'An old mast hums on the lower slope — ₦800 tucked under the generator house. "Them no go miss am," you tell yourself.',
    x: -59.3,
    y: 0,
    z: -83.2,
    reward: { kind: 'cash', amount: 800 },
  },
  {
    id: 'baobab',
    name: 'The Granddaddy Baobab',
    line: 'The granddaddy baobab — your palm finds the old carved steps. The hill names you friend (rep +3).',
    x: -73.9,
    y: 0,
    z: -95.1,
    reward: { kind: 'rep', amount: 3 },
  },
  {
    id: 'quarry-cave',
    name: 'The Quarry Cut',
    line: 'A cool quarry cut hides behind the trail bend — ₦1,200 in a rusted kerosene tin. The hill pays in silence.',
    x: -58.3,
    y: 0,
    z: -108.9,
    reward: { kind: 'cash', amount: 1200 },
  },
  {
    id: 'rest-house',
    name: 'Lugard\'s Rest House',
    line: 'Lugard\'s rest house — the walls still stand. Inside, a folded match jersey the hill wind forgot. Na your size.',
    x: -76.9,
    y: 0,
    z: -139.8,
    reward: { kind: 'outfit', item: 'jersey' },
  },
  {
    id: 'summit-stone',
    name: 'The Summit Stone',
    line: 'The summit stone — whole Lokoja at your feet, the two rivers writing one name. +120 XP to your soul.',
    x: -89.9,
    y: 0,
    z: -131.8,
    reward: { kind: 'xp', amount: 120 },
  },
]

/** Walk inside this radius of an undiscovered spot and it is yours. */
export const DISCOVERY_RADIUS = 9

const SECRET_BY_ID: ReadonlyMap<string, PattiSecret> = new Map(
  PATTI_SECRETS.map((sec) => [sec.id, sec]),
)

/* ---------------------------------- the laws --------------------------------- */

/** Fresh save memory — found: secret id → the absolute day it was found. */
export function freshPattiState(): PattiState {
  return { found: {} }
}

/** How many of the FIVE seeded secrets are in the book (stale keys never count). */
export function secretsFound(s: PattiState): number {
  return PATTI_SECRETS.reduce((n, sec) => (s.found[sec.id] !== undefined ? n + 1 : n), 0)
}

/** Has this secret been found? Unknown ids read as false — the door never lies. */
export function isDiscovered(s: PattiState, id: string): boolean {
  return s.found[id] !== undefined
}

/**
 * The nearest UNDISCOVERED secret within DISCOVERY_RADIUS of (x, z) —
 * the HUD's ~2Hz poll. Found spots go silent; nothing nearby returns
 * null. Deterministic tie-break: the seeded order (first-wins on exact
 * equality, which the ≥15.3u spread makes near-impossible anyway).
 */
export function nearestSecret(x: number, z: number, s: PattiState): { secret: PattiSecret; dist: number } | null {
  let best: { secret: PattiSecret; dist: number } | null = null
  for (const sec of PATTI_SECRETS) {
    if (s.found[sec.id] !== undefined) continue
    const dist = Math.hypot(x - sec.x, z - sec.z)
    if (dist <= DISCOVERY_RADIUS && (best === null || dist < best.dist)) {
      best = { secret: sec, dist }
    }
  }
  return best
}

/**
 * THE discovery: idempotent forever. A found secret returns the same
 * state and isNew:false; an unknown id refuses silently (same state,
 * isNew:false — the HUD can only offer ids it read from this table);
 * a fresh find stamps the day and returns a NEW state for set().
 */
export function discover(s: PattiState, id: string, day: number): { state: PattiState; isNew: boolean } {
  if (!SECRET_BY_ID.has(id)) return { state: s, isNew: false }
  if (s.found[id] !== undefined) return { state: s, isNew: false }
  return { state: { ...s, found: { ...s.found, [id]: day } }, isNew: true }
}
