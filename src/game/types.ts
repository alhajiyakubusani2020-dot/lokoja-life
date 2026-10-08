/**
 * LOKOJA LIFE — Core Game Types
 * ------------------------------
 * Single source of truth for all game data shapes.
 * The save schema below is designed to map 1:1 onto a future
 * Supabase `saves` table (JSONB column), so online migration later
 * is a transport change, not a redesign.
 */

/* ---------------------------------- Avatar --------------------------------- */

export type Gender = 'male' | 'female'

export interface AvatarConfig {
  skinTone: string
  hairColor: string
  hairstyle: string // key from AVATAR_HAIRSTYLES
  clothingStyle: string // key from AVATAR_CLOTHING_STYLES
  clothingColor: string
}

/* --------------------------------- Player ---------------------------------- */

export interface Needs {
  /** ❤️ 0–100 */
  health: number
  /** ⚡ 0–100 */
  energy: number
  /** 🍲 0–100 (100 = fully fed) */
  hunger: number
  /** 🙂 0–100 */
  mood: number
}

export type SkillId = 'hustle' | 'smart' | 'social'

export interface Skills {
  /** 💪 physical / market / practical */
  hustle: number
  /** 🧠 business / office / strategy */
  smart: number
  /** 🗣️ negotiation / tourism / dialogue */
  social: number
}

/** XP earned toward the next level of each skill (Stage 3). */
export type SkillXpMap = Record<SkillId, number>

export interface InventoryItem {
  id: string
  quantity: number
}

export interface BusinessState {
  id: string
  typeId: string
  level: number
  /** last time income was collected (epoch ms) */
  lastCollectedAt: number | null
}

export type MissionStatus = 'active' | 'completed'

export interface MissionProgress {
  status: MissionStatus
  progress: number
}

/* ------------------------------ Economy (St.3) ------------------------------ */

export type TransactionCategory =
  | 'job'
  | 'hustle'
  | 'transport'
  | 'shop'
  | 'tip'
  | 'other'

/** One money event in the player's life — the ledger the phone/Bank reads later. */
export interface Transaction {
  id: string
  /** in-game day + absolute slot when it happened */
  day: number
  slot: number
  label: string
  category: TransactionCategory
  /** positive = earned, negative = spent */
  amount: number
}

/** A bundle of gains produced by any activity (job, hustle, event, gift). */
export interface Reward {
  cash?: number
  xp?: number
  skillXp?: Partial<SkillXpMap>
  reputation?: number
}

/** Player life counters — shown on the profile and read by future systems. */
export interface LifeStats {
  jobsCompleted: number
  hustlesCompleted: number
  totalEarned: number
  totalSpent: number
}

/* ---------------------------- Opportunities (St.3) --------------------------- */

export type OpportunityType = 'job' | 'hustle'

/**
 * Where an opportunity came from. Stage 3 uses 'npc' (personal hustle) and
 * 'board' (location job). The phone/chat/gist systems of later stages will
 * emit the SAME shape through 'phone' / 'gist' — no redesign needed.
 */
export type OpportunitySource = 'npc' | 'board' | 'phone' | 'gist'

/**
 * An accepted, not-yet-done opportunity instance living on the player.
 * References its data definition by id (stays small in saves + data-driven).
 */
export interface ActiveOpportunity {
  /** unique instance id — `defId@absSlot` so the same hustle can reappear later */
  instanceId: string
  defId: string
  type: OpportunityType
  source: OpportunitySource
  /** who offered it (id from NPCS data) — future relationships hook */
  npcId: string | null
  /** stable world location id — the 3D world will use this exact id */
  locationId: string
  /** absolute world-clock slot when accepted (world.ts helper) */
  acceptedAtSlot: number
  /** absolute slot after which the offer goes cold */
  expiresAtSlot: number
}

/** Job cooldowns etc. — activity key → absolute slot when it becomes usable. */
export type Cooldowns = Record<string, number>

export interface PlayerState {
  name: string
  gender: Gender
  avatar: AvatarConfig

  /** 💰 Nigerian Naira */
  cash: number

  needs: Needs
  skills: Skills
  /** progress toward the next level of each skill (Stage 3) */
  skillXp: SkillXpMap

  /** ⭐ 0 – 2500+ */
  reputation: number
  level: number
  xp: number

  /** 🏠 id from HOUSING data */
  homeId: string
  /** 💼 id from JOBS data, null = unemployed */
  jobId: string | null

  /** accepted hustles/offers not yet done (Stage 3) */
  activeOpportunities: ActiveOpportunity[]
  /** activity key → absolute slot when the activity is ready again (Stage 3) */
  cooldowns: Cooldowns
  /** last money events, newest first, capped (Stage 3) */
  transactions: Transaction[]
  /** life counters (Stage 3) */
  stats: LifeStats

  inventory: InventoryItem[]
  businesses: BusinessState[]
  missions: Record<string, MissionProgress>
  achievements: string[]
  discoveries: string[]
}

/* ---------------------------------- World ---------------------------------- */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export type Weather = 'sunny' | 'cloudy' | 'rain' | 'night-clear'

/** Player-usable transport modes (Stage 2). Future: bus, motorcycle, car, boat. */
export type TransportId = 'walk' | 'keke' | 'taxi'

export interface WorldState {
  /** in-game day counter, starts at 1 */
  day: number
  timeOfDay: TimeOfDay
  weather: Weather
  /** id from LOCATIONS data */
  currentLocation: string
}

/* --------------------------------- Settings -------------------------------- */

export interface GameSettings {
  /** master toggle for the (synthesised) audio engine */
  sound: boolean
}

/* ---------------------------------- Save ----------------------------------- */

/**
 * The full persisted shape. Versioned so future releases can
 * run `migrateSave()` against old local saves (and later cloud rows).
 */
export interface GameSave {
  version: number
  createdAt: number
  updatedAt: number
  player: PlayerState
  world: WorldState
  settings: GameSettings
}

/* ---------------------------------- Meta ----------------------------------- */

/** Which top-level screen the SPA is showing. */
export type Screen = 'menu' | 'creation' | 'game'

/** Result returned by need-effect helpers so the UI can flash feedback. */
export interface EffectResult {
  needs?: Partial<Needs>
  cash?: number
  xp?: number
  reputation?: number
  skills?: Partial<Skills>
}

/** A floating toast/flash message produced by game actions. */
export interface GameNotification {
  id: number
  icon: string
  text: string
  tone: 'good' | 'bad' | 'neutral'
}

/* ------------------------------- Work results ------------------------------- */

/** How an activity ended — drives the outcome toast + reward scaling. */
export type WorkOutcome = 'great' | 'good' | 'fail'

/** Everything the UI needs to show after a shift or hustle resolves. */
export interface WorkResult {
  outcome: WorkOutcome
  headline: string
  reward: Reward
  /** final ₦ actually paid (after performance scaling) — 0 on most fails */
  cash: number
  skillId: SkillId | null
}
