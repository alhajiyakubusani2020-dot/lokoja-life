/**
 * LOKOJA LIFE — M23 W2: THE GREEN (shared flora contract)
 * ---------------------------------------------------
 * The single contract both swarm builders compile against:
 *  • flora-species.ts — deterministic per-species merged geometry
 *  • flora.ts         — clearance-probe placement over the real geo
 *
 * LAWS OF THIS FILE:
 *  - Pure types + one constant table. No three.js, no DOM, no store.
 *  - SPECIES_META is the PLACEMENT truth (crown radius, mature height,
 *    sway weight, minimum spacing) — both sides read the same numbers so
 *    no species can be placed tighter than its crown or sway allows.
 */

/** The Kogi guild. Ten families, each a real Lokoja presence:
 *  neem/mango street + compound shade, cashew orchards, shea on the
 *  dry plains, oil palm + raffia on the wet margins, plantain in the
 *  compounds, iroko + baobab as landmarks, acacia on the open savanna. */
export type SpeciesId =
  | 'neem'
  | 'mango'
  | 'cashew'
  | 'shea'
  | 'oilpalm'
  | 'raffia'
  | 'plantain'
  | 'iroko'
  | 'baobab'
  | 'acacia'

export const SPECIES_IDS: readonly SpeciesId[] = [
  'neem', 'mango', 'cashew', 'shea', 'oilpalm', 'raffia', 'plantain', 'iroko', 'baobab', 'acacia',
]

export interface SpeciesMeta {
  /** crown radius at scale 1 — placement keeps trunks ≥ spacing apart */
  crownR: number
  /** mature height at scale 1 (geometry must land within ±15%) */
  height: number
  /** vertex-shader sway multiplier (0 = rigid, 1 = full leaf tremble) */
  swayAmp: number
  /** minimum trunk-to-trunk distance the placement engine must honour */
  minSpacing: number
  /** tri budget for the merged species geometry (the suite enforces it) */
  maxTris: number
}

/**
 * The numbers both builders obey. Heights: neem ~6.5u street tree,
 * mango ~6u dome, cashew ~4.5u spread, shea ~7u, oilpalm ~8u bole +
 * frond crown, raffia ~5.5u leaning river palm, plantain ~2.8u herb,
 * iroko ~18u giant, baobab ~9u bottle, acacia ~7u umbrella.
 */
export const SPECIES_META: Record<SpeciesId, SpeciesMeta> = {
  neem: { crownR: 2.6, height: 6.5, swayAmp: 0.55, minSpacing: 7.5, maxTris: 420 },
  mango: { crownR: 2.9, height: 6.0, swayAmp: 0.5, minSpacing: 8.0, maxTris: 460 },
  cashew: { crownR: 3.0, height: 4.5, swayAmp: 0.6, minSpacing: 8.0, maxTris: 380 },
  shea: { crownR: 3.1, height: 7.0, swayAmp: 0.45, minSpacing: 9.0, maxTris: 420 },
  oilpalm: { crownR: 3.0, height: 8.0, swayAmp: 0.75, minSpacing: 7.5, maxTris: 520 },
  raffia: { crownR: 2.6, height: 5.5, swayAmp: 0.8, minSpacing: 6.5, maxTris: 480 },
  plantain: { crownR: 1.7, height: 2.8, swayAmp: 1.0, minSpacing: 3.0, maxTris: 300 },
  iroko: { crownR: 5.2, height: 18.0, swayAmp: 0.35, minSpacing: 16.0, maxTris: 700 },
  baobab: { crownR: 3.4, height: 9.0, swayAmp: 0.25, minSpacing: 20.0, maxTris: 620 },
  acacia: { crownR: 3.6, height: 7.0, swayAmp: 0.4, minSpacing: 11.0, maxTris: 400 },
}

/** One placed tree. `s` multiplies meta.height; `tone` indexes the
 *  species' own tone row for the per-instance gray/warmth jitter. */
export interface TreeInstance {
  x: number
  z: number
  /** ground height from layout.heightAt — trunk base sits ON the land */
  y: number
  s: number
  rot: number
  tone: number
}

/** Per-species placement output keyed by SpeciesId (+ the two legacy
 *  layout kinds so callers can merge SCHOOL_TREES without branching). */
export type FloraMap = Record<SpeciesId, TreeInstance[]> & {
  tree: TreeInstance[]
  palm: TreeInstance[]
}

/** Import-time build report — the honest numbers the suite prints. */
export interface FloraStats {
  perSpecies: Record<string, number>
  total: number
  rejected: Record<string, number>
  /** build wall-clock ms (informational) */
  ms: number
}

/** One grass tuft. 10k of these ARE the instanced savanna — layout.GRASS
 *  now keeps only its 800 riverside candidates (the Flower-dot pool). */
export interface GrassTuft {
  x: number
  z: number
  y: number
  s: number
  tone: number
}

export interface GrassStats {
  count: number
  rejected: Record<string, number>
  ms: number
}
