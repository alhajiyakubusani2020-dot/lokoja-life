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

/**
 * M5 — one-time shop installations beyond the level ladder.
 * 'generator' keeps the shop lit through load-shedding; 'solar' does that
 * AND cuts the shop's NEPA meter load to almost nothing.
 */
export type ShopUpgradeId = 'generator' | 'solar'

/**
 * M3 — one business the player owns (data only; rules live in systems/biz).
 * `id` and `typeId` both carry the BIZ.types key (one shop per type).
 */
export interface BusinessState {
  id: string
  typeId: string
  level: number
  /** unclaimed naira sitting in the shop till */
  accrued: number
  /** absolute in-game day the shop last accrued income (accrual cap + idempotence) */
  lastAccrualDay: number
  /** in-game day the shop opened */
  openedDay: number
  /** last time income was collected (epoch ms) — legacy field, kept for old saves */
  lastCollectedAt: number | null
  /** M5 — attendants hired at the shop (each boosts income, draws a daily wage) */
  staff: number
  /** M5 — installed one-time upgrades ('generator' | 'solar') */
  upgrades: ShopUpgradeId[]
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
  | 'bank'
  | 'fun'

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

  /* Stage 5 — vehicles, bank, relationships */
  /** 🛵 owned vehicles (garage). One per model — Lokoja parking is real. */
  vehicles: OwnedVehicle[]
  /** 🏦 money kept safe at the bank — separate from pocket cash */
  bankBalance: number
  /** 👥 familiarity per NPC id (social life) */
  relationships: Record<string, RelationshipState>
}

/* --------------------------- Stage 5 — ownership --------------------------- */

export type VehicleModel = 'okada' | 'keke' | 'taxi' | 'danfo'

/** A vehicle the player owns, persisted in the save. */
export interface OwnedVehicle {
  /** unique garage id (stable once bought) */
  id: string
  model: VehicleModel
  /** display plate, e.g. "LKO-419-AB" */
  plate: string
  /** in-game day it was bought */
  boughtDay: number
}

/** Familiarity track with one NPC (pure data — social logic lives in systems/social). */
export interface RelationshipState {
  /** 0–100 */
  familiarity: number
  /** absolute day of the last chat (cooldown gate) */
  lastChatDay: number
}

/** Result of one chat exchange (Stage 5) — everything the phone/talk UI needs. */
export interface ChatOutcome {
  npcId: string
  tier: import('./data/npcChat').FamiliarityTier
  /** familiarity AFTER this chat */
  familiarity: number
  /** the NPC's reply line */
  reply: string
  /** true when this was the first-ever chat with this NPC */
  firstMeeting: boolean
}

/* ---------------------------------- World ---------------------------------- */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export type Weather = 'sunny' | 'cloudy' | 'rain' | 'night-clear'

/** Player-usable transport modes. M4: `own-*` = your garage rides (fuel, no fare). */
export type TransportId = 'walk' | 'keke' | 'taxi' | 'own-okada' | 'own-keke' | 'own-taxi' | 'own-danfo'

/** The personal (garage-owned) transport modes, one per vehicle model. */
export type PersonalTransportId = 'own-okada' | 'own-keke' | 'own-taxi' | 'own-danfo'

export function isPersonalTransport(t: TransportId): t is PersonalTransportId {
  return t.startsWith('own-')
}

export interface WorldState {
  /** in-game day counter, starts at 1 */
  day: number
  timeOfDay: TimeOfDay
  weather: Weather
  /** id from LOCATIONS data */
  currentLocation: string
}

/* --------------------------------- M2 — civic -------------------------------- */

/**
 * Milestone 2 — the civic mesh: the state as a living rule system.
 * NEPA bills, KGIRS taxes, police fines, EFCC whistleblower tips and the
 * daily market prices all live in ONE persisted slice. Every rule that
 * touches these numbers lives in systems/civic.ts — this is data only.
 */
export interface NepaState {
  /** day the current billing cycle started */
  cycleStart: number
  /** unpaid naira currently owed to the disco */
  owed: number
  /** last day a payment has covered — bills post when day > paidThrough + cycleDays */
  paidThrough: number
  /** load-shedding active (debt ran past the grace window) */
  shedding: boolean
  /** lifetime naira paid to the disco (stats) */
  totalPaid: number
}

export interface KgirsState {
  /** player.stats.totalEarned as of the last assessment — the delta IS the cycle income */
  lastSeenEarned: number
  /** assessed tax awaiting payment (0 = nothing due) */
  assessed: number
  /** day the current assessment became payable (0 = nothing due) */
  dueDay: number
  /** how many assessments have been settled (stats) */
  paid: number
  /** past grace — police holds the warrant until it is cleared in person */
  warrant: boolean
}

export interface PoliceState {
  /** outstanding fine naira (currently only KGIRS warrants land here) */
  fines: number
  /** fines settled (stats) */
  paid: number
}

export interface EfccTip {
  id: string
  /** day the tip was filed */
  filedDay: number
  /** naira recovered by the commission — the reward is a % of this */
  recovery: number
  /** short flavour label of the case */
  label: string
}

export interface EfccState {
  /** tips under investigation — resolve on the day roll */
  pending: EfccTip[]
  /** lifetime whistleblower rewards (stats) */
  rewardsTotal: number
  /** day of the last filed tip (cooldown gate) */
  lastTipDay: number
}

export interface MarketEvent {
  icon: string
  label: string
  /** one flavour line shown on the market board */
  note: string
  /** optional meal key this event biases (price leans further) */
  mealBias?: string
  /** extra multiplier applied to the biased meal (0.8 = cheaper) */
  biasMult?: number
}

export interface MarketState {
  /** last day the daily roll ran */
  rolledDay: number
  /** today's price multiplier per market location id (0.85–1.35) */
  prices: Record<string, number>
  /** today's flavour event (null on plain days) */
  event: MarketEvent | null
  /** true when today is a market day (every 3rd day) — blanket discount */
  marketDay: boolean
}

export interface CivicState {
  nepa: NepaState
  kgirs: KgirsState
  police: PoliceState
  efcc: EfccState
  market: MarketState
}

/* -------------------------------- M5 — fleet -------------------------------- */

/**
 * M5 — WORK & FLEET. The Motor Park gig board is DERIVED (deterministic per
 * day + garage), so the only thing that needs persisting is which of today's
 * gigs you already ran — otherwise a reload would double-pay the board.
 */
export interface FleetState {
  /** in-game day the done-list belongs to (stale days clear themselves) */
  day: number
  /** gig ids already run today */
  done: string[]
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
  /** M2 — the civic mesh (bills, taxes, fines, tips, market prices) */
  civic: CivicState
  /** M5 — the fleet ledger: which of today's Motor Park gigs already ran */
  fleet: FleetState
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
