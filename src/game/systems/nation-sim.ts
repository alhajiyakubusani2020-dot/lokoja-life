/**
 * M20 — PLANET SCALE: THE NATION SIM
 * -----------------------------------
 * THE WORKER LAW: 10,000 NPCs simulate OFF the main thread. The kernel
 * below is 100% pure TypeScript — no three.js, no React, no DOM, no
 * store — so the SAME module runs inside a Web Worker (the browser) and
 * directly under Bun (the law suite). The UI NEVER sees a per-NPC
 * array: the only thing that crosses the boundary is the small
 * CrowdSnapshot aggregate (crowdAggregate) — one plain object, ten
 * districts, four numbers each. THE UI-NEVER-STUTTERS LAW lives here:
 * stepCrowd mutates typed arrays in place with ZERO allocations, and
 * the bridge (nation-bridge.ts) rides a 2-second cadence, never rAF.
 *
 * THE DETERMINISM LAW: the same (seed, day, tick, pulse) produces the
 * same city — proven by FNV-1a city hashes in the law suite, the same
 * discipline as the M19 music patterns and the M8 chaos rolls.
 *
 * THE DISTRICT LAW: the crowd walks the city's REAL zone roster —
 * pinned by test to CHAOS_ZONE_IDS (chaos.ts) so the two can never
 * drift apart. Lokoja's crowd lives where Lokoja's chaos lives.
 */

/* ------------------------------ the city map ------------------------------ */

/**
 * The crowd's district roster — the game's real zone ids. Pinned by
 * test to CHAOS_ZONE_IDS; reorder nothing, the indices ARE the save
 * format of the snapshot.
 */
export const NATION_DISTRICTS: readonly string[] = [
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

/** Low-lying districts the flood season empties (the M11 cut law's ground). */
const LOW_DISTRICTS: readonly number[] = NATION_DISTRICTS.reduce<number[]>((acc, id, i) => {
  if (id === 'kpata-market' || id === 'confluence' || id === 'ganaja-junction' || id === 'transport-area') acc.push(i)
  return acc
}, [])

/** High ground the flood moves people TOWARD (Patti first — the real refuge). */
const HIGH_DISTRICTS: readonly number[] = NATION_DISTRICTS.reduce<number[]>((acc, id, i) => {
  if (id === 'mount-patti' || id === 'government-area' || id === 'university-area') acc.push(i)
  return acc
}, [])

/** Where a market-day crowd concentrates (the M2/M8 liquidity ground). */
const MARKET_DISTRICTS: readonly number[] = NATION_DISTRICTS.reduce<number[]>((acc, id, i) => {
  if (id === 'kpata-market' || id === 'food-area' || id === 'transport-area' || id === 'ganaja-junction') acc.push(i)
  return acc
}, [])

/* --------------------------------- types ---------------------------------- */

/** Activity ids — the aggregate's `top` reads human words from these. */
export const CROWD_ACTIVITIES = ['idle', 'hustle', 'market', 'worship', 'football', 'shelter'] as const
export type CrowdActivityId = 0 | 1 | 2 | 3 | 4 | 5

/** The immutable world facts the sim reads — plain data, never the store. */
export interface WorldPulse {
  day: number
  weather: 'sunny' | 'rain' | 'harmattan' | 'storm' | 'flood' | 'cloudy'
  /** 0..1 river surge (the M11 gauge) */
  floodLevel: number
  /** the day's ONE liquidity multiplier (the same channel meals/shops read) */
  marketMult: number
  /** a live festival id or null (the M10 calendar) */
  festival: string | null
}

export interface CrowdState {
  seed: number
  /** per-NPC district index (NATION_DISTRICTS index) */
  street: Uint8Array
  /** mood 0..100 */
  mood: Uint8Array
  /** wealth index in naira-ish units 0..65535 (the crowd's pocket pressure) */
  wealth: Uint16Array
  /** CROWD_ACTIVITIES index */
  activity: Uint8Array
  /** xorshift cursor — the deterministic heartbeat */
  tick: number
  /** the last day the sim crossed */
  day: number
  count: number
}

/** The ONLY shape that crosses the worker boundary. Ten districts, four numbers. */
export interface CrowdSnapshot {
  tick: number
  day: number
  /** city totals for the dashboard's headline row */
  total: number
  avgMood: number
  avgWealth: number
  districts: { id: string; pop: number; mood: number; wealth: number; top: string }[]
}

/* ------------------------------ the rng law ------------------------------- */

/** xorshift32 — one source of chance, seeded, identical in worker and bun. */
function nextRandom(state: CrowdState): number {
  let x = state.tick | 0
  x ^= x << 13
  x ^= x >>> 17
  x ^= x << 5
  state.tick = x | 0
  return (x >>> 0) / 4294967296
}

/* ------------------------------ construction ------------------------------ */

/**
 * Seed the crowd. District weights mirror a real Lokoja day: the market
 * and transport belts hold the bulk, Patti holds the few. Deterministic
 * per seed.
 */
export function createCrowdState(seed: number, count = 10_000): CrowdState {
  const safeCount = Math.max(1, Math.min(50_000, Math.floor(count)))
  const state: CrowdState = {
    seed: seed | 0,
    street: new Uint8Array(safeCount),
    mood: new Uint8Array(safeCount),
    wealth: new Uint16Array(safeCount),
    activity: new Uint8Array(safeCount),
    tick: (seed | 0) || 0x9e3779b9,
    day: 1,
    count: safeCount,
  }
  // warm the rng so the boot layout never depends on the seed's low bits alone
  for (let i = 0; i < 8; i++) nextRandom(state)
  const weights = NATION_DISTRICTS.map((id) => {
    if (id === 'kpata-market') return 22
    if (id === 'transport-area') return 16
    if (id === 'food-area') return 14
    if (id === 'ganaja-junction') return 12
    if (id === 'historic-lokoja') return 9
    if (id === 'home') return 9
    if (id === 'university-area') return 7
    if (id === 'government-area') return 5
    if (id === 'confluence') return 4
    return 2 // mount-patti — the quiet hill
  })
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const cum: number[] = []
  let acc = 0
  for (const w of weights) {
    acc += w
    cum.push(acc / totalWeight)
  }
  for (let i = 0; i < safeCount; i++) {
    const r = nextRandom(state)
    let d = 0
    while (d < cum.length - 1 && r > cum[d]) d++
    state.street[i] = d
    state.mood[i] = 55 + Math.floor(nextRandom(state) * 25) // 55..79 — a hopeful city
    state.wealth[i] = 800 + Math.floor(nextRandom(state) * 6400) // ₦800..₦7,199 pocket index
    // morning: most of the city is already hustling or heading to market
    const ar = nextRandom(state)
    state.activity[i] = ar < 0.42 ? 1 : ar < 0.72 ? 2 : ar < 0.86 ? 0 : ar < 0.95 ? 4 : 3
  }
  return state
}

/* --------------------------------- the step -------------------------------- */

/**
 * Advance the crowd one in-game day-crossing slice (the bridge calls it
 * on its 2s cadence with the CURRENT pulse — several small steps paint
 * one day, the same time-slice doctrine as the terrain). Mutates in
 * place, allocates NOTHING, returns NOTHING.
 */
export function stepCrowd(state: CrowdState, pulse: WorldPulse): void {
  const floodActive = pulse.weather === 'flood' || pulse.floodLevel >= 0.35
  const marketHot = pulse.marketMult >= 1.08
  const festival = pulse.festival !== null
  const raining = pulse.weather === 'rain' || pulse.weather === 'storm'

  for (let i = 0; i < state.count; i++) {
    // --- THE FLOOD LAW: the low city walks to the high ground ---
    if (floodActive) {
      const here = state.street[i]
      const low = LOW_DISTRICTS.indexOf(here) !== -1
      if (low && nextRandom(state) < 0.55) {
        // deterministic pick from the high roster
        state.street[i] = HIGH_DISTRICTS[Math.floor(nextRandom(state) * HIGH_DISTRICTS.length) % HIGH_DISTRICTS.length]
        state.activity[i] = 5 // shelter
        state.mood[i] = Math.max(0, state.mood[i] - 8)
      } else if (!low && nextRandom(state) < 0.04) {
        // a few brave hearts drift back down as the water breathes
        state.street[i] = LOW_DISTRICTS[Math.floor(nextRandom(state) * LOW_DISTRICTS.length) % LOW_DISTRICTS.length]
      }
    } else if (state.activity[i] === 5) {
      // the water gone: the sheltered go back to work
      state.activity[i] = nextRandom(state) < 0.6 ? 1 : 2
    }

    // --- THE MARKET LAW: liquidity pulls the crowd to the belts ---
    if (marketHot && !floodActive) {
      const ar = nextRandom(state)
      if (ar < 0.12) {
        state.street[i] = MARKET_DISTRICTS[Math.floor(nextRandom(state) * MARKET_DISTRICTS.length) % MARKET_DISTRICTS.length]
        state.activity[i] = 2
      }
    }

    // --- THE FESTIVAL LAW: the whole city lifts (M10's mood dividend) ---
    if (festival && nextRandom(state) < 0.2) {
      state.mood[i] = Math.min(100, state.mood[i] + 3)
      if (nextRandom(state) < 0.15) state.activity[i] = 4 // football/crowd joy
    }

    // --- THE RAIN LAW: storms press the open-air moods down ---
    if (raining && nextRandom(state) < 0.1) {
      state.mood[i] = Math.max(0, state.mood[i] - 2)
      if (pulse.weather === 'storm' && nextRandom(state) < 0.12) state.activity[i] = 0
    }

    // --- THE WEALTH LAW: pockets follow the day's ONE liquidity channel ---
    const drift = Math.round((pulse.marketMult - 1) * 220)
    if (drift !== 0) {
      const w = state.wealth[i] + drift
      state.wealth[i] = Math.max(0, Math.min(65535, w))
    }

    // --- THE MEAN-REVERT LAW: moods breathe back to the city's baseline ---
    if (nextRandom(state) < 0.06) {
      const target = floodActive ? 42 : festival ? 74 : 62
      state.mood[i] = state.mood[i] + Math.round((target - state.mood[i]) * 0.25)
    }
  }
  state.day = pulse.day
}

/* ------------------------------- the snapshot ------------------------------ */

/**
 * The aggregate — the ONE object that crosses to the UI. Plain data,
 * small by construction (ten districts), no typed arrays ever.
 */
export function crowdAggregate(state: CrowdState): CrowdSnapshot {
  const n = NATION_DISTRICTS.length
  const pop = new Array<number>(n).fill(0)
  const mood = new Array<number>(n).fill(0)
  const wealth = new Array<number>(n).fill(0)
  const acts = new Array<number>(n * CROWD_ACTIVITIES.length).fill(0)
  let cityMood = 0
  let cityWealth = 0
  for (let i = 0; i < state.count; i++) {
    const d = state.street[i]
    pop[d]++
    mood[d] += state.mood[i]
    wealth[d] += state.wealth[i]
    acts[d * CROWD_ACTIVITIES.length + state.activity[i]]++
    cityMood += state.mood[i]
    cityWealth += state.wealth[i]
  }
  const districts = NATION_DISTRICTS.map((id, d) => {
    let topA = 0
    let topI = 0
    for (let a = 0; a < CROWD_ACTIVITIES.length; a++) {
      const c = acts[d * CROWD_ACTIVITIES.length + a]
      if (c > topA) {
        topA = c
        topI = a
      }
    }
    return {
      id,
      pop: pop[d],
      mood: pop[d] > 0 ? Math.round(mood[d] / pop[d]) : 0,
      wealth: pop[d] > 0 ? Math.round(wealth[d] / pop[d]) : 0,
      top: CROWD_ACTIVITIES[topI],
    }
  })
  return {
    tick: state.tick,
    day: state.day,
    total: state.count,
    avgMood: state.count > 0 ? Math.round(cityMood / state.count) : 0,
    avgWealth: state.count > 0 ? Math.round(cityWealth / state.count) : 0,
    districts,
  }
}

/** FNV-1a over the three crowd arrays — the determinism referee. */
export function hashCrowd(state: CrowdState): number {
  let h = 0x811c9dc5
  const mix = (v: number) => {
    h ^= v & 0xff
    h = Math.imul(h, 0x01000193) >>> 0
    h ^= (v >>> 8) & 0xff
    h = Math.imul(h, 0x01000193) >>> 0
  }
  for (let i = 0; i < state.count; i++) {
    mix(state.street[i])
    mix(state.mood[i])
    mix(state.wealth[i] & 0xff)
    mix((state.wealth[i] >>> 8) & 0xff)
  }
  return h >>> 0
}

/** The default pulse — an honest quiet Lokoja morning (tests + boot). */
export function quietPulse(day = 1): WorldPulse {
  return { day, weather: 'sunny', floodLevel: 0, marketMult: 1, festival: null }
}
