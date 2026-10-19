/**
 * LOKOJA LIFE — Core Game Types
 * ------------------------------
 * Single source of truth for all game data shapes.
 * The save schema below is designed to map 1:1 onto a future
 * Supabase `saves` table (JSONB column), so online migration later
 * is a transport change, not a redesign.
 */

import type { QualitySetting } from './systems/device'

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

/**
 * M13 — THE FAMILY SHIELD: the life stage. One download, three
 * generations — the band decides what the game offers (systems/shield.ts
 * holds the pure laws). Defined here so the save, the guest loop and the
 * shield all speak the same type without import cycles.
 */
export type AgeBand = 'kid' | 'teen' | 'adult'

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
  /** M14 — the kobo-chain link (undefined = legacy pre-Fortress entry) */
  sig?: string
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
  /** M13 — the life stage this character plays (kid/teen/adult content law) */
  ageBand: AgeBand

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
  /** W10 — the paint the street sees (the PAINT VOCABULARY only; '' = stock) */
  paint?: string
  /** in-game day it was bought */
  boughtDay: number
}

/** Familiarity track with one NPC (pure data — social logic lives in systems/social). */
export interface RelationshipState {
  /** 0–100 */
  familiarity: number
  /** absolute day of the last chat (cooldown gate) */
  lastChatDay: number
  /** M6 — absolute day of the last gift given to this NPC (cooldown gate) */
  lastGiftDay?: number
  /** M6 — absolute day of the last hangout with this NPC (cooldown gate) */
  lastHangoutDay?: number
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
  /** M6 — a paddy's favour: an un-accepted hustle instance the chat dropped.
   *  NOT persisted — accept it through acceptFavorOffer or it goes cold. */
  favorOffer?: ActiveOpportunity
}

/* ---------------------------------- World ---------------------------------- */

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

/**
 * M6 — LIVING WORLD: the sky beyond rain. Harmattan dust, confluence
 * thunderstorms and Niger/Benue flood days are REAL Lokoja weather —
 * they travel the same pipelines (travel minutes, market stress, mood)
 * the M2 rain already uses.
 */
/**
 * M6 — LIVING WORLD: the sky beyond rain. Harmattan dust, confluence
 * thunderstorms and Niger/Benue flood days are REAL Lokoja weather —
 * they travel the same pipelines (travel minutes, market stress, mood)
 * the M2 rain already uses.
 */
export type Weather = 'sunny' | 'cloudy' | 'rain' | 'night-clear' | 'harmattan' | 'storm' | 'flood'

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

/* -------------------------------- M8 — chaos -------------------------------- */

/**
 * M8 — THE CHAOS ENGINE. The grid is alive and the naira has moods:
 * transformers blow on heavy-sky days, whole zones go dark, the community
 * gathers money for the technician, cash dries up some days and the POS
 * agents eat. One dark zone at a time; every number lives in config.CHAOS.
 */
/** One transformer outage — ACTIVE while `pool` gathers, RECENT after it ends. */
export interface ChaosOutage {
  /** the dark zone (a location id — the whole area shares one transformer) */
  zoneId: string
  /** the day it blew */
  startedDay: number
  /** ACTIVE outage only: earliest day the disco fixes it without the pool */
  minUntilDay: number
  /** naira gathered for the technician so far (NPC + player) */
  pool: number
  /** days the player already contributed (idempotence: one gift per day) */
  playerContribDays: number[]
}

/** A finished outage kept briefly so multi-day sleeps can still price the dark days. */
export interface ChaosOutageRecord {
  zoneId: string
  startedDay: number
  /** last DARK day (power returned the morning after) */
  untilDay: number
  /** who restored the light */
  fixedBy: 'community' | 'disco'
}

export interface ChaosState {
  /** last rolled day (idempotence marker) */
  day: number
  /** the live outage — the zone that is dark RIGHT NOW */
  active: ChaosOutage | null
  /** recent finished outages (pruned to the last few days at each roll) */
  recent: ChaosOutageRecord[]
  /** scarcity law: naira drawn from the ATM today (the cap resets daily) */
  atmDrawnDay: number
  atmDrawn: number
  stats: {
    blowouts: number
    fixes: number
    contributed: number
    posFees: number
  }
}

/* ------------------------------- M9 — casual shell --------------------------- */

/**
 * M9 — THE CASUAL SHELL. Today's three goals + the streak, the onboarding
 * arc (Street Certified), and the account line the Guest Loop writes.
 * Pure data — the laws live in systems/goals.ts and systems/guest.ts.
 */
export interface GoalState {
  /** the day the current goals belong to (stale days re-roll lazily) */
  day: number
  /** the three goal ids rolled for that day */
  ids: string[]
  /** progress per goal id */
  progress: Record<string, number>
  /** completion flags, same order as ids */
  done: boolean[]
  /** consecutive perfect days */
  streak: number
  /** the last day a perfect set landed (the streak continuity law) */
  lastDoneDay: number
}

export interface OnboardingState {
  /** completed step ids ('travel' | 'work' | 'meal' | 'earn') */
  done: string[]
  /** the ₦1,000 Street Certified reward has landed */
  rewarded: boolean
}

export interface AccountState {
  /** the Guest Loop's verdict: has this player claimed a name? */
  linked: boolean
  handle: string | null
  /** session token from the auth API (M14 Fortress hardens this) */
  token: string | null
  /** 'kid' | 'teen' | 'adult' — the family shield reads this later (M13) */
  ageBand: 'kid' | 'teen' | 'adult' | null
  /** the in-game day the gate grace was granted ("Maybe later") */
  gateGraceDay: number
  /** W1 — what the street sees: the ProfileRow mirror (server truth;
   * avatarLook is the JSON of the REAL vocabularies from data/avatar.ts) */
  displayName: string | null
  avatarLook: string | null
  bio: string | null
}

/* ------------------------------ M10 — calendar ------------------------------ */

/**
 * M10 — THE LIVING CALENDAR. Lokoja runs on a 72-day year: the Confluence
 * Regatta, the two Eids (which drift a little every year — the Islamic
 * calendar never sits still), the Ramadan fast before them, the ram market
 * before THAT, New Yam, the national days, Detty December and a wedding
 * in somebody's compound every nine days. Pure data — every law lives in
 * systems/calendar.ts.
 */
/** A day-festival the player can attend: one venue, one day (or a run). */
export interface FestivalDay {
  /** stable id — 'new-year' | 'eid-fitr' | 'regatta' | … */
  id: string
  name: string
  icon: string
  /** where the action happens (a location id) */
  venueId: string
  /** the year-day (1–72) of this instance's FIRST day */
  dayOfYear: number
  /** days from today through the festival's last day (1 = last day) */
  daysLeft: number
  /** flavour line for the banner */
  note: string
}

/** A seeded wedding: one compound, one couple, one day every ~9 days. */
export interface WeddingDay {
  /** stable per-cycle id — `w<cycle>` */
  id: string
  /** "Musa & Hauwa" — seeded from the streets' name pool */
  couple: string
  /** where the canopies stand (a location id) */
  venueId: string
  /** the absolute in-game day of the wedding */
  day: number
  /** true when the wedding happens TODAY */
  isToday: boolean
  /** days until the wedding (0 when today) */
  inDays: number
}

/** The town union's paving project — one zone at a time, every 14 days. */
export interface PavingProject {
  /** the project's cycle index (stable id for ledgers/tests) */
  cycle: number
  /** the zone being paved (a location id) */
  zoneId: string
  /** naira gathered so far (NPC flow + player tiers) */
  pool: number
  /** absolute days the player already contributed (one gift per day) */
  contribDays: number[]
}

/** The persisted M10 slice — participation and stats only. The schedule
 *  itself is DERIVED from the day (reload-proof, zero state). */
export interface CalendarState {
  /** last rolled day (idempotence marker) */
  day: number
  /** ram meat packs ready to share (a bought ram = 6 packs) */
  meatPacks: number
  /** `${year}:${npcId}` keys already shared this Eid (once per paddy per Eid) */
  meatShares: string[]
  /** this year's regatta sponsorships (one team per player per year) */
  sponsored: { year: number; teamId: string }[]
  /** this year's regatta bets (resolve the morning after the race) */
  bets: { year: number; teamId: string; amount: number }[]
  /** wedding ids the player bought aso-ebi for */
  asoEbi: string[]
  /** attended keys — `${day}:${festivalId}` for festivals, wedding ids for weddings */
  attended: string[]
  /** streets the union finished — smooth roads for a season */
  paved: { zoneId: string; untilDay: number }[]
  /** the live paving project (null between cycles / after completion) */
  paving: PavingProject | null
  stats: {
    festivalsAttended: number
    ramsBought: number
    meatShared: number
    regattaWins: number
    weddings: number
    projectsDone: number
  }
}


/* -------------------------------- M12 — ladder ------------------------------ */

/**
 * M12 — THE LADDER. The life above the hustle: education (FUL's semester
 * clock — only PARTICIPATION persists, the strikes and phases derive from
 * the day), housing (ownership, furnishing, the rent book), and the JAPA
 * document gauntlet. Pure data — the laws live in systems/education.ts,
 * housing.ts and japa.ts.
 */
export interface EducationState {
  enrolled: boolean
  /** the semester in session (1..semestersToGraduate; repeats on a fail) */
  semester: number
  /** absolute day the current semester started */
  semesterStartDay: number
  /** lectures attended this semester */
  lecturesDone: number
  /** absolute day of the last lecture (one per day) */
  lastLectureDay: number
  /** the absolute semester index the Dean's grant last paid (0 = never) */
  lastGrantSemester: number
  examsPassed: number
  failedExams: number
  graduated: boolean
  /** absolute day of the convocation (null until the final exam passes) */
  convocationDay: number | null
  convocationAttended: boolean
  stats: { lectures: number; semestersPassed: number; examSits: number }
}

export interface HousingState {
  /** the owned property id (null = still renting the basic room) */
  owned: string | null
  /** propertyId → furnishing tier (1-3) */
  furnishing: Record<string, number>
  /** day through which the rent book is settled */
  rentPaidThrough: number
  /** the last day a cycle POSTED (each cycle lands once, paid or not) */
  lastPostedDay: number
  /** unpaid rent waiting for the landlord */
  rentOwed: number
  /** the landlord's live wahala (null = quiet compound) */
  wahala: { day: number; kind: string; cost: number; note: string } | null
  stats: { rentPaid: number; wahalaResolved: number; cyclesLate: number }
}

export interface JapaState {
  /** day the NIMC slip is ready for collection (0 = not requested) */
  nimcReadyDay: number
  /** day the slip was collected (0 = not yet) */
  nimcDay: number
  passportReadyDay: number
  passportDay: number
  /** the street agent's ledger */
  agentTries: number
  agentScams: number
  clearanceDay: number
  policeDay: number
  /** day of THE SEND-OFF (0 = still here) */
  flownDay: number
  /** day the first remittance landed (0 = not yet) */
  remitDay: number
  /** MOPOL: police shifts served + the escort detail's book */
  policeShifts: number
  sirenUntilDay: number
  lastEscortDay: number
  stats: { escorts: number; escortEarned: number }
}

/* --------------------------------- Settings -------------------------------- */

export interface GameSettings {
  /** master toggle for the (synthesised) audio engine */
  sound: boolean
  /** M7 — graphics pick: 'auto' trusts the device law, explicit tiers override it */
  graphics: QualitySetting
  /** M9 — Chill Mode: a gentler Lokoja (half decay, kinder grace windows) */
  chill: boolean
  /** M13 — Elder mode: large text, high contrast, reduced motion, slow pacing */
  elder: boolean
  /** M19 — the procedural afro-fusion soundtrack (needs sound too) */
  music: boolean
  /** M19 — haptic pulses on rewards/arrivals (touch devices only, elder keeps still) */
  haptics: boolean
}

/* ------------------------------- M13 — shield ------------------------------- */

/**
 * M13 — THE FAMILY SHIELD slice. Participation and bookkeeping only:
 * the Spot-the-Scammer game's once-a-day book, the streak the reward
 * rides, and the LOCAL parent-PIN gate (guests). The pure laws live in
 * systems/shield.ts; the real minor-account PIN law lives on the server.
 */
export interface ShieldState {
  /** absolute day the scammer game was last played (0 = never) */
  scammerDay: number
  scammerCorrect: number
  scammerWrong: number
  /** consecutive correct picks (the streak the reward rides) */
  scammerStreak: number
  /** the LOCAL parent-PIN gate (guests): salted hash, null = not set */
  parentPinHash: string | null
}

/* ------------------------------ M14 — fortress ------------------------------ */

/**
 * M14 — THE FORTRESS slice. The save's guard book: the anomaly counter,
 * the day's earned total (the income-guard ledger), the chain tail hash
 * (the kobo-chain anchor for the next entry), and the config fingerprint
 * this save was written by. Pure data — the laws live in
 * systems/fortress.ts.
 */
export interface FortressState {
  /** honest counter: how many income clamps have landed (narrated, never hidden) */
  anomalies: number
  /** the day the day-earnings ledger belongs to */
  dayEarnedDay: number
  /** naira earned TODAY (the day-ceiling ledger) */
  dayEarned: number
  /** transactions recorded in the current clock slot (the velocity ledger) */
  slotTxCount: number
  /** the clock slot the velocity ledger belongs to */
  slotTxSlot: number
  /** the kobo-chain tail (the hash the NEXT ledger entry chains from) */
  chainTail: string
  /** the config fingerprint of the build that wrote this save (null = legacy) */
  fingerprint: string | null
}

/* -------------------------------- M11 — rivers ------------------------------ */

/**
 * M11 — THE RIVERS AWAKE. The Niger's surge is DERIVED from the day
 * (the river has a year of its own); only the player's fight against the
 * water persists — sandbags, walkways, tolls, the canoe, the cold-room
 * rescue bowl. Pure data — every law lives in systems/rivers.ts.
 */
/** One zone's sandbag walkway: segments laid + the crossing toll book. */
export interface WalkwayState {
  /** segments laid so far (opens at RIVERS.segments[zoneId]) */
  laid: number
  /** the toll tier a crossing pays (index into RIVERS.tollTiers; 0 = first) */
  tollTier: number
  /** naira sitting in the toll bowl, waiting for the owner to collect */
  pot: number
  /** last day the pot accrued (idempotence) */
  tollDay: number
}

/** The cold-room rescue bowl — one per surge-year, at the deep-water zone. */
export interface RescueState {
  /** the zone whose cold rooms the trucks are saving */
  zoneId: string
  /** the year the rescue belongs to (one rescue per surge-year) */
  year: number
  /** naira gathered (NPC flow + player tiers) */
  pool: number
  /** absolute days the player already contributed (one gift per day) */
  contribDays: number[]
}

/** The persisted M11 slice — participation and bookkeeping only. */
export interface RiversState {
  /** last rolled day (idempotence marker) */
  day: number
  /** sacks of Crusher sand in your compound */
  sandbags: number
  /** the fisherman's canoe you bought — the ferry GIGS need your own boat */
  canoe: boolean
  /** one walkway per low-lying zone */
  walkways: Record<string, WalkwayState>
  /** the live rescue bowl (null outside the deep surge) */
  rescue: RescueState | null
  /** the surge-year whose cold rooms were saved (protection law) */
  rescuedYear: number
  /** M5-style done-ledger: which of today's ferry gigs already ran */
  ferryDay: number
  ferryDone: string[]
  stats: {
    sandBought: number
    segmentsLaid: number
    tollsCollected: number
    ferryRuns: number
    ferryEarned: number
    rescues: number
  }
}

/* ------------------------------- M15 — pulse -------------------------------- */

/**
 * M15 — THE CITY PULSE slice. The read book for the city's newspaper,
 * the arrival book for teleport postcards, and the share ledger. The
 * NEWS itself derives from the day — only participation persists.
 * Pure data — the laws live in systems/pulse.ts and systems/teleport.ts.
 */
export interface PulseState {
  /** the last day the feed was marked read (0 = never opened) */
  readDay: number
  /** read item ids (`${day}:${kind}[:${zone}]`) — pruned to the last 64 */
  seen: string[]
  /** teleport codes that landed here (capped — the arrival book) */
  arrivals: string[]
  stats: {
    /** postcards shared (the street-credit book rides the cooldown) */
    shares: number
    /** postcards that landed YOU here */
    arrivalsIn: number
  }
}

/* ------------------------------- M17 — live -------------------------------- */

/**
 * M17 — THE LIVE NATION slice. The player's own book inside the live
 * relay: the sync cursor, the voice opt-in, the memberships. The
 * NATION's memory (treasuries, trades, pots, the wire) lives in the
 * relay — this slice only carries what is HERS. Pure data — the laws
 * live in systems/live.ts.
 */
export interface LiveState {
  /** the event cursor — the relay hands back everything after this seq */
  cursor: number
  /** the voice opt-in (the law: adults only, same street, never minors) */
  voiceOn: boolean
  /** the association whose books I co-sign (null = none yet) */
  assocId: string | null
  /** the co-signed withdrawals I've put my key to (capped — the key book) */
  coSigned: string[]
  /** the ajo circles I stand in (ids, capped at the 12-member law) */
  circles: string[]
  /** the nation ledger — my honest participation book */
  stats: { chats: number; emotes: number; streamsWatched: number; tradesDone: number }
  /** court fines the Market Union ordered against me (paid through the engines) */
  finesPaid: number
}

/* ------------------------------- M18 — forge ------------------------------- */

/**
 * M18 — THE CITY FORGE slice. The vote book ("YOUR CITY NEXT?"), the
 * forge ledger (every build recorded honestly), and whether the player
 * has run the forge on the home city. Pure data — the laws live in
 * systems/citypack.ts.
 */
export interface ForgeState {
  /** the community vote book — counts + my own votes (capped) */
  votes: { counts: Record<string, number>; mine: string[] }
  /** the forge ledger — the last 20 builds, shipped or refused */
  ledger: { city: string; version: string; verdict: 'shipped' | 'refused'; qaScore: number; totalMinutes: number; atDay: number }[]
  /** has the player run the forge on lokoja-v1 */
  ranLokoja: boolean
}

/* ------------------------------ M19 — next-gen polish ----------------------- */

/**
 * M19 — THE STORY slice: THE CONFLUENCE PATH. One deterministic quest
 * chain — the Crusher boy on the Patti trail → the notebook → the FTH
 * fever night → the sponsorship desk → the white coat. Pure bookkeeping:
 * the laws live in systems/story.ts, this is only the save's memory.
 */
export interface StoryState {
  /** the chapter the player has REACHED (0 = not met him yet, 5 = white coat) */
  chapter: number
  /** sand carries done for chapter 1 (needs 3 distinct days) */
  sandDays: number
  /** the last absolute day a sand carry landed (one per day) */
  lastSandDay: number
  /** chapter 2: the notebook paid (₦ or the school path) */
  notePaid: boolean
  /** chapter 3: the FTH fever night settled */
  feverPaid: boolean
  /** chapter 4: sponsorship days banked (needs 6) */
  sponsoredDays: number
  /** the last absolute day a sponsorship ₦500 landed */
  lastSponsorDay: number
  /** the absolute day the white coat landed (0 = still waiting) */
  doctorDay: number
}

/**
 * M19 — MT PATTI SECRETS. Five seeded spots on the hill; walk near one
 * and it is yours forever. The save records which and on what day.
 */
export interface PattiState {
  /** secret id → the absolute day it was found */
  found: Record<string, number>
}

/**
 * M19 — THE WARDROBE slice: the walk-cycle shop + the outfit drops.
 * Premium clothing styles and walk styles are bought with naira (the
 * honest engine — no money moves outside addMoney/removeMoney) or
 * granted by quests/festivals as drops. `activeWalk` is the equipped
 * walk style key ('street' = the classic default, always owned).
 */
export interface WardrobeState {
  /** premium clothing style keys owned (base styles need no book) */
  ownedStyles: string[]
  /** walk style keys owned ('street' is owned by birth) */
  ownedWalks: string[]
  /** the equipped walk style key */
  activeWalk: string
}

/* ---------------------------------- Save ----------------------------------- */

/**
 * The full persisted shape. Versioned so future releases can
 * run `migrateSave()` against old local saves (and later cloud rows).
 */
export interface GameSave {
  /** v8 (M7): settings.graphics joins the schema
   *  v9 (M8): the chaos slice joins the schema
   *  v10 (M9): goals, onboarding, account + settings.chill join the schema
   *  v11 (M10): the living calendar joins the schema
   *  v12 (M11): the rivers slice joins the schema
   *  v16 (M15): the pulse slice joins the schema
   *  v17 (M17): the live nation slice joins the schema
   *  v18 (M18): the city forge slice joins the schema
   *  v19 (M19): the story, patti and wardrobe slices + settings.music/haptics
   *  join the schema
   *  v20 (M20): the nation slice joins the schema — the crowd switch, the
   *  inflation ledger, the moderation book and the telemetry opt-in */
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
  /** M8 — the chaos engine: transformer outages, scarcity, the fix pool */
  chaos: ChaosState
  /** M9 — the casual shell: today's goals, the onboarding arc, the account */
  goals: GoalState
  onboarding: OnboardingState
  account: AccountState
  /** M10 — the living calendar: festivals, weddings, paving, participation */
  calendar: CalendarState
  /** M11 — the rivers: sandbags, walkways, tolls, the canoe, the rescue bowl */
  rivers: RiversState
  /** M12 — the ladder: education, housing, and the JAPA gauntlet */
  education: EducationState
  housing: HousingState
  japa: JapaState
  /** M13 — the family shield: the scammer game's book + the local parent gate */
  shield: ShieldState
  /** M14 — the fortress: anomalies, the income ledgers, the chain tail */
  fortress: FortressState
  /** M15 — the pulse: the read book, the arrival book, the share ledger */
  cityPulse: PulseState
  /** M17 — the live nation: my cursor, my voice, my memberships */
  live: LiveState
  /** M18 — the city forge: the vote book + the ledger */
  forge: ForgeState
  /** M19 — the story: THE CONFLUENCE PATH quest book */
  story: StoryState
  /** M19 — the Patti secrets: which of the five are yours */
  patti: PattiState
  /** M19 — the wardrobe: owned outfits/walk styles + the equipped walk */
  wardrobe: WardrobeState
  /** M20 — the nation ops slice: crowd switch + inflation ledger +
   *  moderation book (no text, by type) + telemetry opt-in */
  nation: import('./systems/nation').NationState
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
