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

  /**
   * INC 4 — living-world decay. Every time slot that passes OUTSIDE of
   * rest quietly drains the body: meals now matter on a schedule and a
   * full day of hustling leaves its mark. Applied by the store on the
   * non-rest clock paths (travel, work, eating, home downtime) through
   * systems/needs.applySlotDecay — never hand-rolled in components.
   */
  decay: {
    hunger: 2,
    energy: 1,
    mood: 1,
    health: 0,
  },
} as const

/* ------------------------------ home interiors ------------------------------ */

/**
 * INC 4 — "life inside". Tuning for the enterable interiors (your flat,
 * Mama's buka, the Kpata provision store). Interiors are 3D presentation;
 * every effect they apply flows through these config values + the same
 * store actions the rest of the game uses.
 */
export const INTERIOR = {
  /** interaction radius for furniture hotspots, in interior metres */
  hotspotRadius: 2.1,
  /** unwind actions — each honestly advances one clock slot (time passes) */
  relax: {
    tv: { mood: 8, energy: 3, hunger: -3 },
    bath: { mood: 5, energy: 5, hunger: -3 },
  },
  /** Stage 5 — gym session (one clock slot, leaves you properly tired) */
  gym: { energy: -14, mood: 8, health: 6, hunger: -8 },
  /** Stage 5 — night out at the lounge: mood bomb, wallet hit (cash in NIGHT_OUT.cost) */
  lounge: { energy: -6, mood: 14, hunger: -4 },
  /** Stage 5 — night-out economy */
  NIGHT_OUT: {
    cost: 2500,
    /** evening/night only — daytime visits cost the same but give half mood */
    nightMoodBonus: 4,
  },
  /** interior camera rig tuning (presentation-only) */
  camera: {
    distance: 4.6,
    minDistance: 2.6,
    maxDistance: 7,
    height: 3.1,
    pitchMin: 0.22,
    pitchMax: 0.95,
  },
  /** exterior door interact radius (world units) */
  doorRadius: 3.2,
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

  /**
   * Transport (Stage 2). Fares scale with trip distance from these params:
   *   cost   = base + perKm × km  (rounded to TRAVEL.fareRounding)
   *   time   = minutesPerKm × km  (× location modifier × weather modifier)
   *   energy = energyPerKm × km   (× location modifier)
   * Tuned so a median trip (≈3 km) matches Lokoja-realistic fares:
   *   walk ₦0/15min/-10⚡, keke ≈₦300/8min/-2⚡, taxi ≈₦1,000/4min/-1⚡
   */
  transport: {
    walk: { label: 'Walk', emoji: '🚶', cost: { base: 0, perKm: 0 }, minutesPerKm: 4.8, energyPerKm: 3.2 },
    keke: { label: 'Keke', emoji: '🛺', cost: { base: 100, perKm: 60 }, minutesPerKm: 2.6, energyPerKm: 0.65 },
    taxi: { label: 'Taxi', emoji: '🚕', cost: { base: 300, perKm: 220 }, minutesPerKm: 1.3, energyPerKm: 0.32 },
    // future: bus, motorcycle, personal car, boat — add entries here only
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

  /** Effects on the player per weather (travel modifiers live in TRAVEL below). */
  weatherEffects: {
    sunny: { mood: 0 },
    cloudy: { mood: 0 },
    rain: { mood: -3 },
  },
} as const

/* ----------------------------------- Work ----------------------------------- */

/**
 * Stage 3 work tuning — jobs read every number below at runtime.
 * One job shift: energy − time slots on the SAME world clock — payout.
 * Cooldowns are measured in absolute clock slots (see systems/world.ts).
 */
export const WORK = {
  /** default cooldown after a shift, if a job doesn't define its own */
  defaultCooldownSlots: 1,
  /** pay bonus per relevant skill level above 1 (0.05 = +5%) */
  payPerSkillLevel: 0.05,
  /** pay factor when mood is high / low — hustle rewards good vibes */
  moodBonusHigh: { threshold: 70, factor: 1.08 },
  moodPenaltyLow: { threshold: 25, factor: 0.9 },
  /** base success chance for a hustle-style roll (jobs always succeed) */
  baseSuccess: 0.72,
  /** success shift per (skill − difficulty) point, clamped below */
  skillStep: 0.07,
  successClamp: { min: 0.15, max: 0.95 },
  /** chance a success becomes a 'great' outcome (bigger payout + bonus rep) */
  greatChance: 0.18,
  /** great outcomes multiply the payout by this */
  greatPayFactor: 1.5,
  /** what a failed hustle still yields (lesson XP, mood hit) */
  fail: { xpFactor: 0.5, cashFactor: 0, moodDelta: -6 },
  /** pay rounding step (keeps naira amounts tidy) */
  payRounding: 10,
  /** success chance bonus when mood is high (hustle rolls) */
  moodChanceBonusHigh: 0.05,
  /** success chance penalty when mood is low (hustle rolls) */
  moodChancePenaltyLow: 0.05,
  /** extra reputation a 'great' outcome adds */
  greatBonusReputation: 2,
  /** how long the on-screen "working…" transition lasts (ms) */
  transitionMs: 700,
} as const

/* ------------------------------- Hustles / offers ---------------------------- */

/**
 * Stage 3 hustle/opportunity tuning. Opportunities are generated from data
 * (hustles.ts) and carried on the player until done or expired.
 */
export const HUSTLE = {
  /** max accepted-but-undone opportunities the player can hold */
  maxActive: 3,
  /** generated offers expire after this many absolute slots */
  expirySlots: 6,
  /** cooldown for "look around for hustles" searching */
  searchCooldownSlots: 1,
  /** how many offers one search can produce (weighted random pick) */
  maxPerSearch: 2,
  /** chance (0–1) that a search finds nothing — the streets are not always kind */
  dryChance: 0.25,
  /** duplicate-instance guard: same def can't be active twice */
} as const

/* ---------------------------------- Travel ---------------------------------- */

/**
 * Stage 2 movement tuning. All travel numbers flow through here —
 * components and the travel system must never hard-code fares or speeds.
 */
export const TRAVEL = {
  /** Map units (0–100 grid) → kilometres. Lokoja core ≈ 11 km across. */
  kmPerMapUnit: 0.16,
  /** Every completed trip advances this many time slots on the EXISTING clock. */
  slotsPerTrip: 1,
  /** Minutes multiplier per transport in each weather (kept gentle by design). */
  weatherMinutesMultiplier: {
    sunny: { walk: 1, keke: 1, taxi: 1 },
    cloudy: { walk: 1, keke: 1, taxi: 1 },
    rain: { walk: 1.4, keke: 1.15, taxi: 1.08 },
    'night-clear': { walk: 1, keke: 1, taxi: 1 },
  },
  /** Chance (0–1) that a travel event rolls on a completed trip. */
  eventChance: 0.3,
  /** Fares are rounded to the nearest naira step. */
  fareRounding: 10,
  /** How long the on-screen "travelling…" transition lasts (ms). */
  transitionMs: 850,
} as const

/* ------------------------------- Misc / Meta -------------------------------- */

export const GAME_META = {
  title: 'Lokoja Life',
  tagline: 'Build your life at the Confluence.',
  version: '0.3.0',
  stage: 'Stage 3 — Economy, Work & Opportunities',
} as const

export const AUTOSAVE = {
  /** Debounce window for autosave after state changes (ms). */
  debounceMs: 1200,
} as const

/* --------------------------------- 3D World ---------------------------------- */

/**
 * Stage 3D — tuning for the walkable 3D world's connection to the
 * real economy. All balance values live HERE (never in components).
 * Walking is free sightseeing up to the free allowance; beyond it,
 * long treks cost a little energy, settled through the store so the
 * ledger/clock stay the ONLY authorities.
 */
export const WORLD3D = {
  /** energy cost per 100 m actually walked on foot */
  energyPer100m: 0.55,
  /** metres per world visit that are always free (strolling one spot) */
  freeMeters: 150,
  /** maximum energy one world visit can drain (anti-idle safety cap) */
  maxEnergyPerVisit: 6,
  /** radius (m) at which a nearby NPC's gist chip appears */
  npcGistRadius: 24,
  /** metres of road a keke/okada/danfo travels per second (traffic feel) */
  trafficBaseSpeed: 7,
  /** localStorage key for the one-time 3D onboarding (NOT part of the save) */
  onboardingKey: 'lko-world-tut-v1',
  /** localStorage key for district discovery progress (NOT part of the save) */
  discoveryKey: 'lko-world-disc-v1',
  /** Stage 5 — driving your own vehicle: energy per km (much cheaper than walking) */
  driveEnergyPerKm: 0.35,
} as const

/* ------------------------------- food & eating -------------------------------- */

/**
 * Stage 4 goes live — the eating loop. A real meal: costs cash, fills
 * hunger, lifts mood a little, advances the clock one slot (eating takes
 * time). Values live here so balance never hides in components.
 */
export interface MealDef {
  key: string
  label: string
  /** short flavour line shown on the menu row */
  detail: string
  price: number
  hunger: number
  mood: number
  energy: number
}

export const FOOD: { meals: MealDef[] } = {
  meals: [
    { key: 'amala', label: 'Amala + ewedu + goat', detail: 'Mama T’s Thursday special — swallow that holds you', price: 450, hunger: 34, mood: 6, energy: 4 },
    { key: 'jollof', label: 'Party jollof + chicken', detail: 'Smoky bottom-pot jollof, fried chicken on top', price: 700, hunger: 46, mood: 10, energy: 5 },
    { key: 'suya', label: 'Suya wrap', detail: 'Hot off the grill, extra yaji pepper', price: 300, hunger: 18, mood: 8, energy: 2 },
    { key: 'bread-akara', label: 'Bread + akara', detail: 'The classic roadside combo that never fails', price: 250, hunger: 20, mood: 4, energy: 3 },
    { key: 'groceries', label: 'Fresh foodstuff basket', detail: 'Tomatoes, peppers, rice, groundnut oil — for the pot at home', price: 350, hunger: 26, mood: 3, energy: 2 },
  ],
}

export const MEAL_BY_KEY: Record<string, MealDef> = Object.fromEntries(
  FOOD.meals.map((m) => [m.key, m]),
)
