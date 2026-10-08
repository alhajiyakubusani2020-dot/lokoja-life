/**
 * LOKOJA LIFE — Central Game Configuration
 * -----------------------------------------
 * The ONE place to tune the economy and balance.
 * Game logic must read from here — never hard-code numbers in components.
 *
 * Sections marked "(future stage)" are consumed by systems that arrive
 * in later stages; they live here now so designers can pre-tune them.
 */

/* ------------------------------ Starting stats ------------------------------ */

export const STARTING = {
  cash: 5000, // ₦5,000
  needs: { health: 100, energy: 100, hunger: 100, mood: 100 },
  skills: { hustle: 1, smart: 1, social: 1 },
  reputation: 0,
  level: 1,
  xp: 0,
  homeId: 'basic-room',
  jobId: null as string | null,
} as const

/* ------------------------------- Needs engine ------------------------------- */

export const NEEDS = {
  /** Hard clamp for all need values. */
  min: 0,
  max: 100,

  /** Below this hunger, mood starts draining each action. */
  hungerCritical: 20,
  /** Below this energy, strenuous activities are blocked. */
  energyCritical: 10,
  /** Mood drain per action while hunger is critical. */
  hungryMoodDrain: 4,
  /** Health drain per action while hunger has hit 0. */
  starvingHealthDrain: 3,

  /** Passive regen applied when a player rests. */
  rest: {
    /** Short nap (advances one time slot). */
    nap: { energy: 22, hunger: -8, mood: 4, health: 2 },
    /** Full night sleep (advances to next morning). */
    sleep: { energy: 100, hunger: -22, mood: 12, health: 8 },
  },
} as const

/* --------------------------------- Progression ------------------------------ */

export const PROGRESSION = {
  /** xp needed to go from level L to L+1 = base * L^growth */
  xpBase: 120,
  xpGrowth: 1.4,
  /** Cap keeps late-game numbers sane. */
  maxLevel: 50,
  /** Skill XP converted to skill points at this many XP per point (future stage). */
  skillXpPerPoint: 25,
  /** Starting skill cap grows with level: cap = base + level * perLevel. */
  skillCapBase: 3,
  skillCapPerLevel: 2,
} as const

/** Reputation ladder — thresholds unlock opportunities (used by many systems). */
export const REPUTATION_TIERS = [
  { threshold: 0, name: 'Nobody', title: 'Just another face in Lokoja' },
  { threshold: 100, name: 'Known', title: 'People nod when you pass' },
  { threshold: 250, name: 'Hustler', title: 'Your name opens small doors' },
  { threshold: 500, name: 'Respected', title: 'Traders call you boss' },
  { threshold: 1000, name: 'Influential', title: 'Your word carries weight' },
  { threshold: 2500, name: 'Big Player', title: 'Lokoja knows your name' },
] as const

/** What each level unlocks — readable strings for the profile screen. */
export const LEVEL_UNLOCKS: Record<number, string[]> = {
  1: ['Basic jobs', 'Kpata Market', 'Ganaja Junction'],
  2: ['Food stalls', 'Photography gigs'],
  3: ['Confluence activities', 'Fishing'],
  4: ['Mount Patti trails', 'Tourist hustles'],
  5: ['Market stall business'],
  8: ['Food stand business'],
  10: ['Historic Lokoja tours', 'Delivery business'],
}

/* ---------------------------------- Economy --------------------------------- */

export const ECONOMY = {
  currencySymbol: '₦',

  /** Transport costs + energy costs (Stage 2). Base speed in slots per trip. */
  transport: {
    walk: { cost: 0, energyPerTrip: 8, timeSlots: 1 },
    keke: { cost: 150, energyPerTrip: 2, timeSlots: 1 },
    taxi: { cost: 500, energyPerTrip: 1, timeSlots: 1 },
    // future: bus, motorcycle, personal car, boat
  },

  /** Rent charged every N days per home (Stage 4). */
  rent: {
    cycleDays: 7,
    homes: {
      'basic-room': 2500,
      apartment: 15000,
      house: 45000,
      // future premium homes (cosmetic only) listed in Stage 10 architecture
    },
  },

  /** Starting prices for shops (Stage 4). Tunable per item in foods/items data. */
  shopMargin: 1.15,

  /** Businesses (Stage 8): income per in-game day at level 1, upgrade multiplier. */
  business: {
    baseIncome: { 'food-stand': 1800, 'market-stall': 1500 },
    upgradeCostMultiplier: 1.8,
    collectIntervalDays: 1,
  },
} as const

/* ----------------------------------- Time ----------------------------------- */

export const TIME = {
  /** Order of the day. */
  slots: ['morning', 'afternoon', 'evening', 'night'] as const,

  /** Weighted weather for a new day. Night-clear only appears at night. */
  weatherWeights: {
    sunny: 55,
    cloudy: 25,
    rain: 20,
  },

  /** Effects applied to travel/jobs per weather (Stage 2/3 reads these). */
  weatherEffects: {
    sunny: { mood: 0, travelEnergyMultiplier: 1 },
    cloudy: { mood: 0, travelEnergyMultiplier: 1 },
    rain: { mood: -3, travelEnergyMultiplier: 1.5 },
  },
} as const

/* ------------------------------- Misc / Meta -------------------------------- */

export const GAME_META = {
  title: 'Lokoja Life',
  tagline: 'Build your life at the Confluence.',
  version: '0.1.0',
  stage: 'Stage 1 — Foundation',
} as const

export const AUTOSAVE = {
  /** Debounce window for autosave after state changes (ms). */
  debounceMs: 1200,
} as const
