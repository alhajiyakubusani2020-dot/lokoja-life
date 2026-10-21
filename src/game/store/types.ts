/**
 * LOKOJA LIFE — Game Store Types (PH2.5 god-store split)
 * ------------------------------------------------------
 * The GameStore interface of the old 5,575-line monolith, split by domain
 * cohesion into slice interfaces. Member texts (types, doc comments, order
 * within each slice) are moved VERBATIM from the original interface — no
 * type changed, no member renamed. The public store type is the same
 * intersection of all slices:
 *
 *   export type GameStore = UiSlice & SaveBootSlice & PlayerSlice & ...
 *
 * `import('@/game/store/useGameStore')` keeps compiling untouched; these
 * type exports are ADDITIVE (the monolith never exported GameStore).
 */

import type {
  ActiveOpportunity,
  AccountState,
  AvatarConfig,
  CalendarState,
  ChatOutcome,
  CivicState,
  EducationState,
  FleetState,
  FortressState,
  GameNotification,
  GameSettings,
  Gender,
  GoalState,
  HousingState,
  JapaState,
  OnboardingState,
  PlayerState,
  PulseState,
  Reward,
  RiversState,
  Screen,
  ShieldState,
  ShopUpgradeId,
  SkillId,
  TransactionCategory,
  TransportId,
  VehicleModel,
  WorldState,
  ChaosState,
} from '../types'
import type { PattiSecret } from '../systems/patti'
import type { PulseItem } from '../systems/pulse'
import type { TeleportMoment } from '../systems/teleport'
import type { NationState } from '../systems/nation'
import type { CrowdSnapshot } from '../systems/nation-sim'
import type { FlagKey } from '../systems/flags'
import type { TelemetryBook } from '../systems/telemetry'

/* ------------------------------ UI ------------------------------ */

export interface UiSlice {
  /* UI-level state */
  screen: Screen
  notifications: GameNotification[]
  /** M9 — juice: +₦ money pops (transient) and the level-up shockwave count */
  pulse: { id: number; amount: number } | null
  shockwave: number
  settings: GameSettings

  setScreen: (screen: Screen) => void

  /* settings & save */
  toggleSound: () => void
  /** M7 — pick the graphics tier ('auto' = trust the device law); persists in the save */
  setGraphics: (q: GameSettings['graphics']) => void
  /** M9 — Chill Mode: a gentler Lokoja (half decay, kinder grace windows) */
  setChill: (chill: boolean) => void
  /** M13 — Elder mode: large text, high contrast, reduced motion, slow pacing */
  setElder: (elder: boolean) => void
  /** M19 — the procedural afro-fusion soundtrack (rides the master sound switch) */
  setMusic: (on: boolean) => void
  /** M19 — haptic pulses on rewards/arrivals (touch only; elder keeps still) */
  setHaptics: (on: boolean) => void

  /* feedback */
  notify: (n: Omit<GameNotification, 'id'>) => void
  dismissNotification: (id: number) => void
}

/* ------------------------- save / boot / account ------------------------- */

export interface SaveBootSlice {
  booted: boolean
  hasSave: boolean
  /** M9 — the casual shell: today's goals, the onboarding arc, the account */
  onboarding: OnboardingState
  account: AccountState
  /** W1 — the 60-second guest preview clock (session-scope, never saved) */
  guestPreviewStartedAt: number | null
  /** M9 — the Guest Loop gate modal (UI transient, never persisted) */
  gateOpen: boolean

  /* lifecycle */
  boot: () => void
  /** M15/M16 world-boot hooks (postcard + offline queue) — idempotent, safe
   *  to call from the dashboard idle preload or before continueGame */
  bootWorldHooks: () => void

  /* core actions */
  startNewGame: (name: string, gender: Gender, avatar: AvatarConfig, ageBand?: import('../types').AgeBand) => void
  continueGame: () => boolean
  returnToMenu: () => void

  /** M13 — THE FAMILY SHIELD register law: a minor account only exists
   *  behind a parent's PIN and collects NOTHING — no contact, no recovery
   *  line. The birth year is the honest truth: if it yields a different
   *  band than the character's, the birth year wins (and the city tells you). */
  registerAccount: (input: { handle: string; contact: string; pin: string; birthYear: number; parentPin?: string; displayName: string; avatarLook: string; bio?: string }) => Promise<{ ok: boolean; why?: string }>
  loginAccount: (input: { handle: string; pin: string }) => Promise<{ ok: boolean; why?: string }>
  /** W1 — the face edits itself: PATCH /api/profile, the server wins */
  updateProfile: (input: { displayName?: string; avatarLook?: string; bio?: string }) => Promise<{ ok: boolean; why?: string }>
  markGuestPreview: () => void
  /** M9 — "Maybe later": the gate buys the rest of today, tomorrow it stands */
  acceptGateGrace: () => void
  /** M9 — close the gate modal without grace */
  closeGate: () => void
  saveNow: () => void
  resetGame: () => void
}

/* ------------------------------ player ------------------------------ */

export interface PlayerSlice {
  /* live game state (null until a game starts) */
  player: PlayerState | null
  /** M9 — the casual shell: today's goals, the onboarding arc, the account */
  goals: GoalState

  /* needs / time actions (Stage 1: rest; Stage 2: travel — both use the same clock) */
  rest: (kind: 'nap' | 'sleep') => void
  advanceTime: (slots?: number) => void
  /** INC 4 — unwind at home (TV / bath): small needs shift + one honest clock slot */
  relaxIndoors: (kind: 'tv' | 'bath') => void
  /** Stage 4 — buy and eat a real meal (cash → hunger/mood, clock moves).
   *  atLocationId: which spot's menu was used — when it differs from where
   *  the player actually is, the ledger records it as a delivery. */
  eatMeal: (mealKey: string, atLocationId?: string) => boolean
  /** Stage 3D — settle the energy cost of one 3D-world visit's walking (0 → no-op) */
  settleWorldWalk: (meters: number) => void

  /** Wardrobe — change appearance (merges over DEFAULT_AVATAR). */
  setAvatar: (avatar: AvatarConfig) => void
  /** Gym workout — needs shift + one honest clock slot. */
  workout: () => void
  /** School study hour — needs shift + smart-skill XP + one clock slot. */
  study: (label?: string) => void
  /** Night out at the lounge — cash cost, big mood, one clock slot. */
  nightOut: () => void

  /** M9 — one life event lands on today's goals (rewards flow the engines) */
  bumpGoal: (kind: string) => void

  addSkillXp: (skill: SkillId, amount: number) => void

  /* engine actions used by all future systems */
  addXp: (amount: number) => void
  addReputation: (amount: number) => void
}

/* ------------------------- world / travel / festivals ------------------------- */

export interface WorldSlice {
  world: WorldState | null
  /** M10 — the living calendar: festivals, weddings, paving, participation */
  calendar: CalendarState
  /** M11 — the rivers: sandbags, walkways, tolls, the canoe, the rescue bowl */
  rivers: RiversState

  /* travel (Stage 2) */
  isTravelling: boolean
  travel: (destinationId: string, transport: TransportId) => void

  /* M10 — THE LIVING CALENDAR (venue-gated, ledgered, festival-hearted) */
  /** Join today's festival in person (mood, rep, the crowd's naira spray). */
  attendFestival: () => boolean
  /** Buy a ram at the Kpata ram market — butchers into 6 meat packs. */
  buyRam: () => boolean
  /** Share a meat pack with a paddy (once per paddy per Eid). */
  shareMeat: (npcId: string) => boolean
  /** Sponsor a regatta crew (₦2k — the trophy pays the faithful back). */
  sponsorBoat: (teamId: string) => boolean
  /** Back a boat on race-eve (adults only; resolves the morning after). */
  betBoat: (teamId: string, tier: number) => boolean
  /** Buy the wedding fabric at Kpata (once per wedding). */
  buyAsoEbi: () => boolean
  /** Attend today's wedding with a gift tier (aso-ebi doubles the respect). */
  attendWedding: (giftTier: number) => boolean
  /** Give to the town union's paving pool while standing in the zone. */
  contributePaving: (tier: number) => boolean

  /* M11 — THE RIVERS AWAKE */
  /** Buy Crusher sand (sacks for the walkways) on the Patti road. */
  buySand: (sacks: number) => boolean
  /** Lay one walkway segment in the cut zone you stand in. */
  laySegment: () => boolean
  /** Set the crossing toll tier on the walkway you stand on. */
  setTollTier: (tierIndex: number) => boolean
  /** Collect the toll bowl of the walkway you stand on. */
  collectTolls: () => boolean
  /** Buy the fishermen's canoe at the jetty (unlocks the ferry gigs). */
  buyCanoe: () => boolean
  /** Ride the canoe ferry across the water (jetty ↔ a cut zone). */
  takeFerry: (toId: string) => void
  /** Run a ferry gig with your own canoe (passengers pay the surge fare). */
  runFerryGig: (gigId: string) => boolean
  /** Give to the cold-room rescue bowl while standing at the zone. */
  contributeRescue: (tier: number) => boolean
}

/* ------------------------- economy (cash / bank / biz / work) ------------------------- */

export interface EconomySlice {
  /** M2 — the civic mesh: NEPA debt, KGIRS assessment, fines, tips, market */
  civic: CivicState | null
  /** M8 — the chaos engine: transformer outages, scarcity, the fix pool */
  chaos: ChaosState
  /** M14 — the fortress: anomalies, the income ledgers, the chain tail */
  fortress: FortressState

  /* work & opportunities (Stage 3) */
  /** true while a job-shift/hustle resolution transition plays */
  isWorking: boolean
  /** label shown on the working overlay */
  workingLabel: string | null
  /** transient hustle offers found by searching — NOT persisted (gist goes cold) */
  offers: ActiveOpportunity[]

  /* M2 — the civic mesh (payments all validate, ledger, notify, autosave) */
  /** Settle the electricity bill. 'office' (in GRA) is free; 'phone' adds the convenience fee. */
  payNepa: (channel: 'office' | 'phone') => boolean
  /** Settle the tax assessment. 'police' pays the warrant fine too; 'phone' refuses warrants. */
  payKgirs: (channel: 'office' | 'police' | 'phone') => boolean
  /** File a whistleblower tip at the commission (cooldown per CIVIC config). */
  fileEfccTip: () => boolean
  /** Today's honest market price of a meal at a given spot (UI display + eatMeal agree). */
  mealPriceAt: (mealKey: string, locationId: string) => number

  /* M3 — OWN THE CITY (businesses) */
  /** Buy the shop hosted at its real location (cash + level gated). */
  buyBiz: (typeId: string) => boolean
  /** Empty a shop's till. 'shop' = in person, free; 'phone' = transfer, minus fee. */
  collectBiz: (typeId: string, channel: 'shop' | 'phone') => boolean
  /** Upgrade a shop one level (cost from bizUpgradeCost). */
  upgradeBiz: (typeId: string) => boolean
  /** M5 — hire an attendant (hire fee in cash, daily wage draws from the till). */
  hireStaff: (typeId: string) => boolean
  /** M5 — let an attendant go (no cost; the wage stops tomorrow). */
  fireStaff: (typeId: string) => boolean
  /** M5 — install a one-time shop upgrade ('generator' | 'solar'). */
  installBizUpgrade: (typeId: string, upgradeId: ShopUpgradeId) => boolean

  /** Bank: pocket cash → bankBalance. */
  bankDeposit: (amount: number) => boolean
  /** Bank: bankBalance → pocket cash. M8 — 'atm' honors the scarcity cap;
   *  'pos' takes the agent's levy but always pays. */
  bankWithdraw: (amount: number, channel?: 'atm' | 'pos') => boolean
  /** M8 — give to the community light fund while YOUR zone is dark. */
  contributeToPool: (tier: number) => boolean

  /** economy services — every naira flows through these */
  addMoney: (amount: number, meta: { label: string; category: TransactionCategory }) => void
  removeMoney: (amount: number, meta: { label: string; category: TransactionCategory }) => boolean
  giveReward: (reward: Reward, meta: { label: string; category: TransactionCategory }) => void

  /** formal jobs (source: board) */
  workShift: (jobId: string) => void
  /** hustle lifecycle: find → accept → do (or drop) — same shape the phone will use */
  searchHustles: () => void
  acceptOffer: (instanceId: string) => void
  declineOffer: (instanceId: string) => void
  completeOpportunity: (instanceId: string) => void
  dropOpportunity: (instanceId: string) => void
  /** remove offers whose time is up (called lazily by the work screen) */
  pruneExpired: () => void

  /* engine actions used by all future systems */
  addCash: (amount: number) => void
}

/* ------------------------- vehicles / fleet / drive ------------------------- */

export interface VehiclesSlice {
  /** M5 — the fleet ledger: which of today's Motor Park gigs already ran */
  fleet: FleetState

  /** M5 — run a Motor Park gig: passenger pays, your ride drinks the fuel. */
  runGig: (gigId: string) => boolean

  /* Stage 5 — ownership, banking, social life */
  /** Buy a vehicle at the motor park (one per model). False = couldn't afford / owned. */
  buyVehicle: (model: VehicleModel) => boolean
  /** M4 — sell a garage ride back at the park (deterministic depreciation). */
  sellVehicle: (vehicleId: string) => boolean
  /** W10 — the wheels' face: repaint / re-plate a garage ride (the plate
   *  and paint LAWS validate — an invented colour or a bad plate refuses). */
  setVehicleStyle: (vehicleId: string, style: { paint?: string; plate?: string }) => boolean
  /** W10-c — the tank/condition wear the disk's truth (wheelnet's readbacks + acks write here) */
  patchVehicleMeters: (model: import('../types').VehicleModel, patch: { fuel?: number; condition?: number }) => void
  /** Stage 3D — settle the (small) energy cost of driving your own vehicle. */
  settleDrive: (meters: number) => void
}

/* ------------------------- the ladder (education / housing / japa) ------------------------- */

export interface LadderSlice {
  /** M12 — the ladder: education, housing, the JAPA gauntlet */
  education: EducationState
  housing: HousingState
  japa: JapaState

  /* M12 — THE LADDER */
  enrollFul: () => boolean
  attendLecture: () => boolean
  sitExam: () => boolean
  attendConvocation: () => boolean
  payRent: (channel: 'home' | 'phone') => boolean
  buyProperty: (propertyId: string) => boolean
  furnishHome: (tier: number) => boolean
  resolveWahala: () => boolean
  requestNimc: () => boolean
  collectNimc: () => boolean
  requestPassport: () => boolean
  collectPassport: () => boolean
  tryAgent: () => boolean
  kgirsClearance: () => boolean
  policeCertificate: () => boolean
  takeFlight: () => boolean
  runEscort: () => boolean
}

/* ------------------------- social / npc / shield ------------------------- */

export interface SocialSlice {
  /** M13 — the family shield: the scammer game's book + the local parent gate */
  shield: ShieldState

  /** Talk with an NPC — familiarity + one warm line. Null = cooldown / guard. */
  chatNpc: (npcId: string) => ChatOutcome | null
  /** M13 — kid socials: preset emotes ONLY (no free lines, ever). */
  emoteChat: (npcId: string, emoteId: string) => ChatOutcome | null
  /** M6 — hand a paddy a gift (cash → familiarity, once per NPC per day). */
  giveGift: (npcId: string, giftId: string) => boolean
  /** M6 — pull a paddy out for the evening (cash + mood + familiarity, night only). */
  hangout: (npcId: string) => boolean
  /** M6 — accept a favour a paddy dropped in chat (goes through acceptOffer's guards). */
  acceptFavorOffer: (offer: ActiveOpportunity) => void

  /** M13 — SPOT THE SCAMMER: play today's round (once per in-game day). */
  playScammer: (pickIndex: number) => void
  /** M13 — the local parent-PIN gate (guests): set it the first time. */
  setLocalParentPin: (pin: string) => boolean
  /** M13 — the local tier gate: climb the band ladder with the parent's yes. */
  unlockTierLocal: (to: import('../types').AgeBand, parentPin: string) => boolean
}

/* ------------------------- lifestyle (wardrobe / story / patti) ------------------------- */

export interface LifestyleSlice {
  /** M19 — the story: THE CONFLUENCE PATH quest book */
  story: import('../types').StoryState
  /** M19 — the Patti secrets: which of the five are yours */
  patti: import('../types').PattiState
  /** M19 — the wardrobe: owned outfits/walk styles + the equipped walk */
  wardrobe: import('../types').WardrobeState

  /** M19 — the wardrobe shop: buy a walk style or premium outfit (honest wallet) */
  wardrobeBuy: (kind: 'walk' | 'outfit', itemKey: string) => { ok: boolean; why?: string }
  /** M19 — equip an owned walk style (the rig obeys) */
  wardrobeEquipWalk: (walkKey: string) => { ok: boolean; why?: string }
  /** M19 — THE CONFLUENCE PATH: carry sand with the crusher boy (chapter 1) */
  storyCarrySand: () => { ok: boolean; why?: string }
  /** M19 — pay the school levy / fetch the notebook (chapter 2) */
  storyPayNotebook: () => { ok: boolean; why?: string }
  /** M19 — settle the FTH fever night (chapter 3) */
  storyPayFever: () => { ok: boolean; why?: string }
  /** M19 — sponsor the boy's desk for one more day (chapter 4) */
  storySponsor: () => { ok: boolean; why?: string }
  /** M19 — the white coat: claim the graduation once the wait is served */
  storyGraduate: () => { ok: boolean; why?: string }
  /** M19 — the hill's whisper: poll the player's position for an undiscovered
   *  secret (called from the HUD's ~2Hz poll); returns the secret when one
   *  was JUST discovered (so the UI can toast) else null. */
  checkPatti: (x: number, z: number) => PattiSecret | null
}

/* ------------------------- city pulse / share / cloud ------------------------- */

export interface PulseSlice {
  /** M15 — the city pulse: the read book, the arrival book, the share ledger */
  cityPulse: PulseState | null
  /** M15 — a postcard waiting to land (URL arrival / the gate's hold). Session-only. */
  pendingArrival: { code: string; moment: TeleportMoment } | null
  /** M16 — a cloud push failed offline; the queue flushes when the network returns */
  cloudPending: boolean

  /** M15 — open the city paper: marks today's feed read */
  openCityPulse: () => void
  /** M15 — share THIS MOMENT as a signed teleport postcard (street credit once/day) */
  shareTeleport: () => Promise<{ ok: boolean; why?: string; url?: string }>
  /** M15 — share a City Pulse headline (same street-credit cooldown) */
  sharePulseCard: (item: PulseItem) => Promise<{ ok: boolean; why?: string }>
  /** M15 — arrive by postcard: verify, land free, book the ghost */
  arriveByTeleport: (code: string) => { ok: boolean; why?: string }
  /** M9 — push the current save to the cloud (linked accounts) */
  pushCloud: () => Promise<{ ok: boolean; why?: string }>
  /** M16 — the offline law: flush the queued push when the network returns */
  flushCloudQueue: () => Promise<void>
}

/* ------------------------- live-net (wire / forge / nation ops) ------------------------- */

export interface NetSlice {
  /** M17 — the live nation: my cursor, my voice, my memberships */
  live: import('../types').LiveState | null
  /** M17 — the nation's last sync snapshot (session-only — the wire) */
  liveWire: { roster: { handle: string; band: string; street: string; status: string }[]; events: { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[] } | null
  /** M18 — the city forge: the vote book + the ledger */
  forge: import('../types').ForgeState | null
  /** M20 — the nation ops slice: crowd switch + the city's honest books */
  nation: NationState
  /** M20 — the live crowd aggregate (session-only — the worker's wire) */
  nationSnapshot: CrowdSnapshot | null
  /** M20 — which path the sim took ('worker' | 'main'), session-only honesty for the dashboard */
  nationPath: 'worker' | 'main' | null
  /** M20 — the device's ops flags (outside the save — the fortress rule) */
  opsFlags: Record<FlagKey, boolean>
  /** M20 — the telemetry counter book (device-level, opt-in or dark) */
  telemetry: TelemetryBook

  /* ---------------------- M17 — the live nation ---------------------- */
  /** the heartbeat: presence up, new events down (claimed accounts only) */
  liveSync: () => Promise<{ ok: boolean; why?: string; roster?: { handle: string; band: string; street: string; status: string }[]; events?: { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[] }>
  /** a raw relay read (streams board / trades inbox / assoc list / circles) */
  liveAction: (action: string, payload?: Record<string, unknown>) => Promise<{ ok: boolean; why?: string } & Record<string, unknown>>
  /** speak on the wire (tier laws apply — kid emotes, teen wall, adult links) */
  liveSendChat: (text: string, channel?: string) => Promise<{ ok: boolean; why?: string; stripped?: boolean }>
  liveSendEmote: (emoteId: string, channel?: string) => Promise<{ ok: boolean; why?: string }>
  /** broadcast my street as an M15 postcard invite (the join-teleport law) */
  liveShareJoin: (code: string) => Promise<{ ok: boolean; why?: string }>
  liveOpenStream: (kind: 'stall' | 'regatta' | 'wedding', title: string) => Promise<{ ok: boolean; why?: string; streamId?: string }>
  liveViewStream: (streamId: string) => Promise<{ ok: boolean; why?: string; viewers?: number }>
  liveCloseStream: (streamId: string) => Promise<{ ok: boolean; why?: string; peakViewers?: number }>
  liveFoundAssoc: (name: string, motto: string) => Promise<{ ok: boolean; why?: string; assocId?: string }>
  liveJoinAssoc: (assocId: string) => Promise<{ ok: boolean; why?: string }>
  livePayDues: (assocId: string, amount: number) => Promise<{ ok: boolean; why?: string }>
  liveWithdrawAssoc: (assocId: string, amount: number, coSigner: string) => Promise<{ ok: boolean; why?: string }>
  liveFileContract: (assocId: string, terms: string, stake: number, parties: string[]) => Promise<{ ok: boolean; why?: string }>
  liveFileDispute: (assocId: string, contractId: string, evidence: string) => Promise<{ ok: boolean; why?: string; verdict?: string }>
  liveOfferTrade: (to: string, giveCash: number, wantCash: number, terms: string) => Promise<{ ok: boolean; why?: string }>
  liveAcceptTrade: (tradeId: string) => Promise<{ ok: boolean; why?: string }>
  liveFoundAjo: (name: string, contribution: number) => Promise<{ ok: boolean; why?: string; ajoId?: string }>
  liveJoinAjo: (ajoId: string) => Promise<{ ok: boolean; why?: string }>
  livePayAjo: (ajoId: string) => Promise<{ ok: boolean; why?: string; paidOut?: string; payout?: number }>
  liveCourtAjo: (ajoId: string) => Promise<{ ok: boolean; why?: string }>
  liveToggleVoice: () => void

  /* ---------------------- M18 — the city forge ---------------------- */
  /** run the 3-hour pipeline on the sample extract (the honest forge) */
  runForge: () => import('../types').ForgeState['ledger']
  /** cast a "YOUR CITY NEXT?" vote (local book + the relay when linked) */
  forgeVote: (city: string) => Promise<{ ok: boolean; why?: string }>
  /** pull the world's honest vote counts from the ballot box */
  forgeVotesPull: () => Promise<void>

  /* ---------------------- M20 — planet scale + ops ---------------------- */
  /** the day crossing speaks to the sim + the books (inflation ledger, telemetry roll) */
  nationPulseDay: (newDay: number) => void
  /** the M17 chat gate's refusal lands in the moderation book (no text, by type) */
  recordModerationHit: (why: string) => void
  /** the honest opt-in — the dashboard's telemetry switch */
  setTelemetryOptIn: (on: boolean) => void
  /** flush the counter book to the relay (opt-in + band guarded both sides) */
  telemetryFlush: () => Promise<{ ok: boolean; why?: string }>
  /** the crowd's switch — dark or alive, the seed/count ride the save */
  nationSetCrowd: (on: boolean) => void
  /** an ops flag flip (device-level, outside the save) */
  opsSetFlag: (key: FlagKey, value: boolean) => void
  /** the bridge's snapshot lands here (the ONLY crossing) */
  nationSnapshotIngest: (s: CrowdSnapshot) => void
}

/* ------------------------------ composition ------------------------------ */

/**
 * THE STORE TYPE — the exact same surface the monolith's `interface
 * GameStore` declared, now as the intersection of the domain slices.
 */
export type GameStore = UiSlice &
  SaveBootSlice &
  PlayerSlice &
  WorldSlice &
  EconomySlice &
  VehiclesSlice &
  LadderSlice &
  SocialSlice &
  LifestyleSlice &
  PulseSlice &
  NetSlice
