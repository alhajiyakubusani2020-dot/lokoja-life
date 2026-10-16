/**
 * LOKOJA LIFE — Game Store (Zustand)
 * -----------------------------------
 * The single source of truth for live game state.
 *
 * Persistence strategy: explicit, versioned saves via SaveSystem
 * (localStorage now, Supabase later) + debounced autosave.
 * We deliberately do NOT use zustand/persist so the saved schema
 * stays clean and cloud-migratable instead of dumping raw store state.
 */

import { create } from 'zustand'
import type {
  ActiveOpportunity,
  AvatarConfig,
  ChatOutcome,
  CivicState,
  GameNotification,
  GameSave,
  GameSettings,
  Gender,
  OwnedVehicle,
  PlayerState,
  Reward,
  Screen,
  SkillId,
  Transaction,
  TransactionCategory,
  TransportId,
  VehicleModel,
  WorldState,
  FleetState,
  ChaosState,
  GoalState,
  OnboardingState,
  AccountState,
  CalendarState,
  RiversState,
  EducationState,
  HousingState,
  JapaState,
  ShieldState,
  FortressState,
  PulseState,
  FestivalDay,
  WeddingDay,
  ShopUpgradeId,
} from '../types'
import { STARTING, NEEDS, TRAVEL, WORK, HUSTLE, AUTOSAVE, WORLD3D, INTERIOR, MEAL_BY_KEY, TIME, WEATHER_META, SOCIAL, GOALS, CHILL } from '../data/config'
import { walkingEnergyCost, describeWalkSettle } from '../systems/world3d'
import { DEFAULT_AVATAR } from '../data/avatar'
import { VEHICLE_BY_MODEL, generatePlate } from '../data/vehicles'
import { NPC_CHAT } from '../data/npcChat'
import { NPC_BY_ID } from '../data/npcs'
import { LOCATION_BY_ID } from '../data/locations'
import { JOB_BY_ID } from '../data/jobs'
import { applyNeedsDelta, applySlotDecay } from '../systems/needs'
import { addXp as processXp, formatNaira } from '../systems/progression'
import { recordTransaction, pushTransaction, canAfford, rewardCash, describeReward } from '../systems/economy'
import { addSkillXp as applySkillXp, SKILL_META } from '../systems/skills'
import { checkRequirements, cooldownRemaining, resolveJob } from '../systems/work'
import { canChat, relationshipFor, tierFor, pickLine, afterChat, canGift, canHangout, afterGift, afterHangout, favorRollsToday, giftById, TIER_META } from '../systems/social'
import {
  weatherBlocksLocation,
  isNightMarketOpen,
  nightMealPrice,
  mealAvailableAt,
  NIGHT_MARKET_LOCATION_ID,
} from '../systems/seasons'
import {
  generateHustleOffers,
  hustleDefFor,
  pruneExpiredOpportunities,
  resolveOpportunity,
  makeOpportunityInstance,
  isEligible,
} from '../systems/opportunities'
import { SaveSystem } from '../systems/save'
import { refreshDeviceProfile } from '../systems/device'
import { audio, syncAudioWithSettings } from '../systems/audio'
import { useMenuStore, menuSetScreen } from './menu-store'
import {
  nextSlot,
  rollNewDayWeather,
  weatherForSlot,
  advanceWorldClock,
  absoluteSlot,
} from '../systems/world'
import { calculateTravel, rollTravelEvent } from '../systems/travel'
import { personalModelOf, resaleValue, transportAllowed } from '../systems/garage'
import {
  freshCivicState,
  civicDayRoll,
  nepaSettleCost,
  nepaApplyPayment,
  kgirsSettleCost,
  kgirsApplyPayment,
  efccFileTip,
  efccRewardFor,
  marketMealPrice,
  marketForDay,
  type CivicDayResult,
} from '../systems/civic'
import {
  bizDayRoll,
  bizDef,
  bizOwned,
  bizUpgradeCost,
  bizCollect,
  freshBusiness,
  staffCapFor,
} from '../systems/biz'
import {
  chaosDayRoll,
  freshChaosState,
  liquidityMultFor,
  fuelMultFor,
  isScarcityDay,
  atmRemaining,
  applyAtmDraw,
  posFeeFor,
  canContribute,
  applyContribution,
  blackoutAt,
  setDebugScarcity,
  type ChaosDayResult,
} from '../systems/chaos'
import { bumpGoal, freshGoalState } from '../systems/goals'
import { freshLiveState, sanitizeChat, emoteById } from '../systems/live'
import { freshForgeState, forgeCity, forgeVote as forgeVoteLaw, applyVote, recordBuild, voteWinner, PILOT_LADDER, CITY_SLA_MINUTES } from '../systems/citypack'
import type { OsmExtract } from '../systems/citypack'
import { freshStoryState, currentTask, canCarrySand, canPayNotebook, canPayFever, canSponsor as canSponsorStory, canGraduate, applyCarry, applyNotebook, applyFever, applySponsor, applyWhiteCoat, coatDay, STORY, type StoryChapter } from '../systems/story'
import { freshPattiState, PATTI_SECRETS, nearestSecret, discover, type PattiSecret } from '../systems/patti'
import { freshWardrobeState, shopBuy, equipWalk as equipWalkLaw, grantDrop, walkRigFor, WALK_BY_KEY, PREMIUM_BY_KEY } from '../systems/wardrobe'
import { music, moodForTimeOfDay } from '../systems/music'
import { haptics } from '../systems/haptics'
import { freshPulseState, pulseForDay, markPulseRead, type PulseItem } from '../systems/pulse'
import { encodeTeleport, decodeTeleport, postcardFor, type TeleportMoment } from '../systems/teleport'
import {
  freshCalendarState,
  calendarDayRoll,
  calendarMarketMult,
  festivalForDay,
  weddingForCycle,
  attendSprayFor,
  canAttendFestival,
  canBuyRam,
  buyRamApply,
  canShareMeat,
  shareMeatApply,
  canSponsor,
  sponsorApply,
  canBet,
  betApply,
  canBuyAsoEbi,
  buyAsoEbiApply,
  canAttendWedding,
  attendWeddingApply,
  canContributePaving,
  contributePavingApply,
  pavedMinutesMult,
  isIftarHour,
  type RegattaResult,
} from '../systems/calendar'
import { gateVerdict, applyGrace, freshAccountState, freshOnboardingState, validateHandle, validatePin, validateContact, ageBandForYear, mergeVerdict, backupPayload, BACKUP_KEY } from '../systems/guest'
import {
  freshRiversState,
  riversDayRoll,
  zoneCut,
  walkwayOpen,
  segmentsLeft,
  canLaySegment,
  laySegmentApply,
  setTollTierApply,
  canContributeRescue,
  contributeRescueApply,
  floodBizFactor,
  riverMarketMult,
  availableFerryGigs,
  ferryFareBetween,
  runFerryApply,
  setDebugRiverLevel,
  cutZonesFor,
  JETTY_ID,
} from '../systems/rivers'
import {
  freshEducationState,
  canEnroll,
  enrollApply,
  isLectureWindow,
  isExamWindow,
  isStrikeDay,
  strikeDaysLeft,
  canAttendLecture,
  attendLectureApply,
  earnsDeansGrant,
  grantApply,
  canSitExam,
  examApply,
  examScore,
  canAttendConvocation,
  convocationApply,
  absoluteSemesterIndex,
} from '../systems/education'
import {
  freshHousingState,
  homeComfort,
  canBuyProperty,
  buyPropertyApply,
  canFurnish,
  furnishApply,
  housingDayRoll,
  canPayRent,
  payRentApply,
  canResolveWahala,
  resolveWahalaApply,
  propertyFor,
} from '../systems/housing'
import {
  freshJapaState,
  canRequestNimc,
  requestNimcApply,
  canCollectNimc,
  collectNimcApply,
  canRequestPassport,
  requestPassportApply,
  canCollectPassport,
  collectPassportApply,
  canTryAgent,
  tryAgentApply,
  canClearKgirs,
  clearanceApply,
  canGetPoliceCertificate,
  policeCertificateApply,
  canTakeFlight,
  takeFlightApply,
  remittanceLands,
  remittanceApply,
  escortAvailable,
  canRunEscort,
  runEscortApply,
  sirenMinutesMult,
  papersComplete,
} from '../systems/japa'
import { gigBoard, gigLabel } from '../systems/fleet'
import {
  freshFortressState,
  incomeGuard,
  velocityGuard,
  chainNext,
  configFingerprint,
  CHAIN_SEED,
} from '../systems/fortress'
import { FORTRESS } from '../data/config'
import {
  freshShieldState,
  crimeAllowed,
  canHustle as shieldCanHustle,
  canJapa,
  CRIME_REFUSALS,
  canPlayScammer,
  scamRound,
  scamAnswerApply,
  validateParentPin,
  localPinHash,
  makeLocalSalt,
  tierGateVerdict,
  type CrimeContentId,
} from '../systems/shield'
import { HUSTLE_BY_ID } from '../data/hustles'
import { BIZ, CIVIC, FLEET, CHAOS, FESTIVALS, RIVERS, LADDER, SHIELD, ELDER, PULSE } from '../data/config'

/* ------------------------------- store -------------------------------- */

interface GameStore {
  /* UI-level state */
  screen: Screen
  booted: boolean
  hasSave: boolean
  notifications: GameNotification[]

  /* live game state (null until a game starts) */
  player: PlayerState | null
  world: WorldState | null
  /** M2 — the civic mesh: NEPA debt, KGIRS assessment, fines, tips, market */
  civic: CivicState | null
  /** M5 — the fleet ledger: which of today's Motor Park gigs already ran */
  fleet: FleetState
  /** M8 — the chaos engine: transformer outages, scarcity, the fix pool */
  chaos: ChaosState
  /** M10 — the living calendar: festivals, weddings, paving, participation */
  calendar: CalendarState
  /** M11 — the rivers: sandbags, walkways, tolls, the canoe, the rescue bowl */
  rivers: RiversState
  /** M12 — the ladder: education, housing, the JAPA gauntlet */
  education: EducationState
  housing: HousingState
  japa: JapaState
  /** M13 — the family shield: the scammer game's book + the local parent gate */
  shield: ShieldState
  /** M14 — the fortress: anomalies, the income ledgers, the chain tail */
  fortress: FortressState
  /** M15 — the city pulse: the read book, the arrival book, the share ledger */
  cityPulse: PulseState | null
  /** M15 — a postcard waiting to land (URL arrival / the gate's hold). Session-only. */
  pendingArrival: { code: string; moment: TeleportMoment } | null
  /** M17 — the live nation: my cursor, my voice, my memberships */
  live: import('../types').LiveState | null
  /** M18 — the city forge: the vote book + the ledger */
  forge: import('../types').ForgeState | null
  /** M19 — the story: THE CONFLUENCE PATH quest book */
  story: import('../types').StoryState
  /** M19 — the Patti secrets: which of the five are yours */
  patti: import('../types').PattiState
  /** M19 — the wardrobe: owned outfits/walk styles + the equipped walk */
  wardrobe: import('../types').WardrobeState
  /** M17 — the nation's last sync snapshot (session-only — the wire) */
  liveWire: { roster: { handle: string; band: string; street: string; status: string }[]; events: { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[] } | null
  /** M16 — a cloud push failed offline; the queue flushes when the network returns */
  cloudPending: boolean
  /** M9 — the casual shell: today's goals, the onboarding arc, the account */
  goals: GoalState
  onboarding: OnboardingState
  account: AccountState
  /** M9 — the Guest Loop gate modal (UI transient, never persisted) */
  gateOpen: boolean
  /** M9 — juice: +₦ money pops (transient) and the level-up shockwave count */
  pulse: { id: number; amount: number } | null
  shockwave: number
  settings: GameSettings

  /* lifecycle */
  boot: () => void
  /** M15/M16 world-boot hooks (postcard + offline queue) — idempotent, safe
   *  to call from the dashboard idle preload or before continueGame */
  bootWorldHooks: () => void
  setScreen: (screen: Screen) => void

  /* core actions */
  startNewGame: (name: string, gender: Gender, avatar: AvatarConfig, ageBand?: import('../types').AgeBand) => void
  continueGame: () => boolean
  returnToMenu: () => void

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
  /** M5 — run a Motor Park gig: passenger pays, your ride drinks the fuel. */
  runGig: (gigId: string) => boolean

  /* Stage 5 — ownership, banking, social life */
  /** Buy a vehicle at the motor park (one per model). False = couldn't afford / owned. */
  buyVehicle: (model: VehicleModel) => boolean
  /** M4 — sell a garage ride back at the park (deterministic depreciation). */
  sellVehicle: (vehicleId: string) => boolean
  /** Wardrobe — change appearance (merges over DEFAULT_AVATAR). */
  setAvatar: (avatar: AvatarConfig) => void
  /** Gym workout — needs shift + one honest clock slot. */
  workout: () => void
  /** School study hour — needs shift + smart-skill XP + one clock slot. */
  study: (label?: string) => void
  /** Night out at the lounge — cash cost, big mood, one clock slot. */
  nightOut: () => void
  /** Bank: pocket cash → bankBalance. */
  bankDeposit: (amount: number) => boolean
  /** Bank: bankBalance → pocket cash. M8 — 'atm' honors the scarcity cap;
   *  'pos' takes the agent's levy but always pays. */
  bankWithdraw: (amount: number, channel?: 'atm' | 'pos') => boolean
  /** M8 — give to the community light fund while YOUR zone is dark. */
  contributeToPool: (tier: number) => boolean
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
  /** M9 — one life event lands on today's goals (rewards flow the engines) */
  bumpGoal: (kind: string) => void
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
  /** Stage 3D — settle the (small) energy cost of driving your own vehicle. */
  settleDrive: (meters: number) => void

  /* travel (Stage 2) */
  isTravelling: boolean
  travel: (destinationId: string, transport: TransportId) => void

  /* work & opportunities (Stage 3) */
  /** true while a job-shift/hustle resolution transition plays */
  isWorking: boolean
  /** label shown on the working overlay */
  workingLabel: string | null
  /** transient hustle offers found by searching — NOT persisted (gist goes cold) */
  offers: ActiveOpportunity[]

  /** economy services — every naira flows through these */
  addMoney: (amount: number, meta: { label: string; category: TransactionCategory }) => void
  removeMoney: (amount: number, meta: { label: string; category: TransactionCategory }) => boolean
  giveReward: (reward: Reward, meta: { label: string; category: TransactionCategory }) => void
  addSkillXp: (skill: SkillId, amount: number) => void

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
  addXp: (amount: number) => void
  addReputation: (amount: number) => void

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
  /** M13 — SPOT THE SCAMMER: play today's round (once per in-game day). */
  playScammer: (pickIndex: number) => void
  /** M13 — the local parent-PIN gate (guests): set it the first time. */
  setLocalParentPin: (pin: string) => boolean
  /** M13 — the local tier gate: climb the band ladder with the parent's yes. */
  unlockTierLocal: (to: import('../types').AgeBand, parentPin: string) => boolean
  /** M9 — the Guest Loop: claim a name (register) or return (login) */
  registerAccount: (input: { handle: string; contact: string; pin: string; birthYear: number; parentPin?: string }) => Promise<{ ok: boolean; why?: string }>
  loginAccount: (input: { handle: string; pin: string }) => Promise<{ ok: boolean; why?: string }>
  /** M9 — "Maybe later": the gate buys the rest of today, tomorrow it stands */
  acceptGateGrace: () => void
  /** M9 — close the gate modal without grace */
  closeGate: () => void
  /** M9 — push the current save to the cloud (linked accounts) */
  pushCloud: () => Promise<{ ok: boolean; why?: string }>
  /** M15 — open the city paper: marks today's feed read */
  openCityPulse: () => void
  /** M15 — share THIS MOMENT as a signed teleport postcard (street credit once/day) */
  shareTeleport: () => Promise<{ ok: boolean; why?: string; url?: string }>
  /** M15 — share a City Pulse headline (same street-credit cooldown) */
  sharePulseCard: (item: PulseItem) => Promise<{ ok: boolean; why?: string }>
  /** M15 — arrive by postcard: verify, land free, book the ghost */
  arriveByTeleport: (code: string) => { ok: boolean; why?: string }
  /** M16 — the offline law: flush the queued push when the network returns */
  flushCloudQueue: () => Promise<void>

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
  saveNow: () => void
  resetGame: () => void

  /* feedback */
  notify: (n: Omit<GameNotification, 'id'>) => void
  dismissNotification: (id: number) => void
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
let notificationId = 0
let pulseId = 0
/** M16 — the online listener wires itself exactly once. */
let cloudQueueWired = false

/**
 * M15 — THE ARRIVAL LAW: a verified postcard lands the walker on the
 * sender's street, free, no fare, no clock cost. The code joins the
 * arrival book (the ghost card reads it back), the URL cleans itself,
 * and the street credit is NEVER paid to the arrival — credit buys
 * shares, not landings.
 */
function applyArrival(
  set: (partial: Partial<GameStore>) => void,
  get: () => GameStore,
  code: string,
  m: TeleportMoment,
  opts?: { silent?: boolean },
): void {
  const world = get().world
  if (!world) return
  const pl = get().cityPulse ?? freshPulseState()
  set({
    world: { ...world, currentLocation: m.locId },
    pendingArrival: null,
    cityPulse: {
      ...pl,
      arrivals: [...pl.arrivals, code].slice(-PULSE.arrivalCap),
      stats: { ...pl.stats, arrivalsIn: pl.stats.arrivalsIn + 1 },
    },
  })
  try {
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  } catch { /* the URL is cosmetic — the arrival already landed */ }
  if (!opts?.silent) {
    const place = LOCATION_BY_ID[m.locId]?.name ?? m.locId
    get().notify({ icon: '📍', text: `You land for ${place} — ${m.name}'s postcard, Day ${m.day}. No fare.`, tone: 'good' })
    audio.play('notify')
    haptics.fire('arrival') // M19 — the postcard buzzes in the pocket
  }
  scheduleAutosave(get)
}

/**
 * M15 — THE DAY TALLY: the ghost card's honest numbers, read off the
 * ledger (the deterministic kernel's own record of the day).
 */
function dayTally(transactions: Transaction[], day: number): { earned: number; moves: number; trail: number[] } {
  const today = transactions.filter((t) => t.day === day)
  const earned = today.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const cats = new Set<string>()
  const ordered: string[] = []
  for (const t of today) {
    if (!cats.has(t.category)) {
      cats.add(t.category)
      ordered.push(t.category)
    }
  }
  const CATS = ['job', 'hustle', 'transport', 'shop', 'tip', 'other', 'bank', 'fun']
  const trail = ordered.slice(-3).map((c) => Math.max(0, CATS.indexOf(c)))
  while (trail.length < 3) trail.push(0)
  return { earned, moves: today.length, trail }
}

/**
 * M15 — THE SHARE LAW: the Web Share sheet first (WhatsApp sits right
 * there), the clipboard catches the fall. A share only counts when a
 * channel actually accepted it — and the street credit pays once per
 * in-game day, whatever was shared.
 */
async function shareText(get: () => GameStore, title: string, body: string, url: string): Promise<{ ok: boolean; why?: string }> {
  const text = `${title}\n${body}\n${url}`
  let shared = false
  try {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      await navigator.share({ title: 'Lokoja Life', text, url })
      shared = true
    }
  } catch { /* the user closed the sheet — not a share */ }
  if (!shared) {
    try {
      await navigator.clipboard.writeText(text)
      shared = true
      get().notify({ icon: '📋', text: 'Copied — paste am for WhatsApp.', tone: 'good' })
    } catch {
      return { ok: false, why: 'share-refused' }
    }
  }
  return { ok: shared }
}

/**
 * M15 — THE STREET CREDIT: a real share pays +2 rep once per in-game
 * day, through the reward engine (the kobo-chain records it, the
 * income guard watches it). The second share of the day is free
 * labour — the city respects the first one.
 */
function payStreetCredit(get: () => GameStore, set: (partial: Partial<GameStore>) => void): void {
  const p = get().player
  const world = get().world
  if (!p || !world) return
  // the share book counts every real share — the credit only pays once a day
  const pl0 = get().cityPulse ?? freshPulseState()
  set({ cityPulse: { ...pl0, stats: { ...pl0.stats, shares: pl0.stats.shares + 1 } } })
  const key = PULSE.shareCooldownKey
  if (p.cooldowns[key] === world.day) return
  get().giveReward({ reputation: PULSE.shareStreetCredit }, { label: 'Street credit — shared the city', category: 'other' })
  set({ player: { ...get().player!, cooldowns: { ...get().player!.cooldowns, [key]: world.day } } })
  get().notify({ icon: '🌆', text: `Street credit +${PULSE.shareStreetCredit} — the city hears you.`, tone: 'good' })
}

/** Ledger cap — newest entries survive, old ones fall off. */
const LEDGER_CAP = 50

/** M9 — the store-wide decay law: Chill Mode runs the body at half drain.
 *  M13 — Elder mode runs it at 0.75×; the kinder law wins when both on. */
function slotDecay(get: () => GameStore, needs: import('../types').Needs, slots: number) {
  const chill = get().settings.chill ? CHILL.decayMult : 1
  const elder = get().settings.elder ? ELDER.decayMult : 1
  return applySlotDecay(needs, slots, Math.min(chill, elder))
}

/** M9 — the onboarding bump: steps land once, the ₦1,000 lands once. */
function bumpOnboarding(
  get: () => GameStore,
  set: (partial: Partial<GameStore>) => void,
  step: string,
): void {
  const ob = get().onboarding
  if (ob.done.includes(step)) return
  const done = [...ob.done, step]
  set({ onboarding: { ...ob, done } })
  if (done.length >= GOALS.onboardingSteps.length && !get().onboarding.rewarded) {
    set({ onboarding: { ...get().onboarding, rewarded: true } })
    get().addMoney(GOALS.onboardingReward, { label: 'Street Certified — onboarding complete', category: 'tip' })
    get().notify({ icon: '🏅', text: `STREET CERTIFIED! You don learn the ropes — ${formatNaira(GOALS.onboardingReward)} don land.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
  }
}

/* ------------------------- M2 — civic day machinery ------------------------- */

/** Aggregated results of rolling the civic mesh across one or more days. */
interface CivicAgg {
  nepaPosted: number
  nepaShed: boolean
  taxAssessed: number
  warrantIssued: boolean
  tipsResolved: import('../types').EfccTip[]
  tipReward: number
  /** M8 — chaos narration flags */
  blowoutZone: string | null
  outageFixed: { zoneId: string; fixedBy: 'community' | 'disco' } | null
  scarcityDay: boolean
  payoutDay: boolean
  /** M10 — calendar narration flags */
  festivalMorning: FestivalDay | null
  weddingToday: WeddingDay | null
  pavingDone: { zoneId: string } | null
  pavingStalled: { zoneId: string } | null
  regattaResult: RegattaResult | null
  /** M11 — river narration flags */
  floodedZone: string | null
  drainedZone: string | null
  rescueWake: string | null
  rescueDone: string | null
  riverDamp: boolean
  riverRelief: boolean
  /** M12 — ladder narration flags */
  rentPosted: { amount: number; cycle: number } | null
  wahalaArrived: { kind: string; cost: number; note: string } | null
  lateNotice: boolean
  remittance: boolean
}

/** Pure: roll the civic mesh + the chaos engine + the calendar + the rivers
 *  forward day by day (assessments land on exact days). M6 — the NEW day's
 *  weather rides in so the market roll folds weather stress. M8 — the chaos
 *  roll runs in the SAME loop and its liquidity fold (crunch / payout) rides
 *  into the SAME prices. M10 — the calendar's festival folds ride the SAME
 *  channel too, and the year's parties narrate themselves at the day
 *  crossings. M11 — the river rolls in the SAME loop: the surge lifts every
 *  price through the SAME channel, the bowls take yesterday's crossings and
 *  the deep water wakes the cold-room rescue. */
function civicRollForDays(
  civic: CivicState,
  chaos: ChaosState,
  calendar: CalendarState,
  rivers: RiversState,
  housing: HousingState,
  japa: JapaState,
  totalEarned: number,
  prevDay: number,
  newDay: number,
  bizCount = 0,
  solarCount = 0,
  weather?: import('../types').Weather,
  liquidityMultOverride?: number,
  chill = false,
): { civic: CivicState; chaos: ChaosState; calendar: CalendarState; rivers: RiversState; housing: HousingState; japa: JapaState; agg: CivicAgg } {
  let cur = civic
  let curChaos = chaos
  let curCal = calendar
  let curRiv = rivers
  let curHou = housing
  let curJap = japa
  const agg: CivicAgg = { nepaPosted: 0, nepaShed: false, taxAssessed: 0, warrantIssued: false, tipsResolved: [], tipReward: 0, blowoutZone: null, outageFixed: null, scarcityDay: false, payoutDay: false, festivalMorning: null, weddingToday: null, pavingDone: null, pavingStalled: null, regattaResult: null, floodedZone: null, drainedZone: null, rescueWake: null, rescueDone: null, riverDamp: false, riverRelief: false, rentPosted: null, wahalaArrived: null, lateNotice: false, remittance: false }
  for (let d = prevDay + 1; d <= newDay; d++) {
    // chaos first: today's grid + naira mood decide the market's liquidity
    const c = chaosDayRoll(curChaos, d, weather ?? 'sunny')
    curChaos = c.next
    if (c.blowout) agg.blowoutZone = c.blowout.zoneId
    if (c.fixed) agg.outageFixed = c.fixed
    agg.scarcityDay = agg.scarcityDay || c.scarcity
    agg.payoutDay = agg.payoutDay || c.payout
    // M10 — the year turns: paving lifecycle, regatta stakes, festivals
    const cal = calendarDayRoll(curCal, d)
    curCal = cal.next
    if (cal.pavingDone) agg.pavingDone = cal.pavingDone
    if (cal.pavingStalled) agg.pavingStalled = cal.pavingStalled
    if (cal.regattaResult) agg.regattaResult = cal.regattaResult
    const todayFestival = festivalForDay(d)
    if (todayFestival) agg.festivalMorning = todayFestival
    const wedding = weddingForCycle(d)
    if (wedding.isToday) agg.weddingToday = wedding
    // M11 — the river turns: bowls, rescue, the flood narrations
    const riv = riversDayRoll(curRiv, d)
    curRiv = riv.next
    if (riv.flooded) agg.floodedZone = riv.flooded.zoneId
    if (riv.drained) agg.drainedZone = riv.drained.zoneId
    if (riv.rescueWake) agg.rescueWake = riv.rescueWake.zoneId
    if (riv.rescueDone) agg.rescueDone = riv.rescueDone.zoneId
    agg.riverDamp = agg.riverDamp || riv.damp
    agg.riverRelief = agg.riverRelief || riv.relief
    // M12 — the ladder turns: the rent book, the landlord, the remittance
    const hou = housingDayRoll(curHou, d)
    curHou = hou.next
    if (hou.rentPosted) agg.rentPosted = hou.rentPosted
    if (hou.wahalaArrived) agg.wahalaArrived = hou.wahalaArrived
    agg.lateNotice = agg.lateNotice || hou.lateNotice
    if (remittanceLands(curJap, d)) {
      curJap = remittanceApply(curJap, d)
      agg.remittance = true
    }
    // the water lifts the SAME roll the weather, chaos and calendar ride
    const r = civicDayRoll(cur, totalEarned, d, bizCount, solarCount, weather, liquidityMultOverride ?? liquidityMultFor(d) * calendarMarketMult(d) * riverMarketMult(d), chill)
    cur = r.next
    agg.nepaPosted += r.nepaPosted
    agg.nepaShed = agg.nepaShed || r.nepaShed
    agg.taxAssessed += r.taxAssessed
    agg.warrantIssued = agg.warrantIssued || r.warrantIssued
    agg.tipsResolved = [...agg.tipsResolved, ...r.tipsResolved]
    agg.tipReward += r.tipReward
  }
  return { civic: cur, chaos: curChaos, calendar: curCal, rivers: curRiv, housing: curHou, japa: curJap, agg }
}

/** Execute a civic day crossing: set the slice, pay whistleblower rewards,
 *  apply the shedding mood hit and the warrant reputation hit, narrate it. */
function commitCivicDays(
  get: () => GameStore,
  set: (partial: Partial<GameStore>) => void,
  prevDay: number,
  newDay: number,
): void {
  const { civic, chaos, calendar, rivers, housing, japa, player, world } = get()
  if (!civic || !player || !world || newDay <= prevDay) return
  const bizCount = player.businesses.length
  // M5 — solar shops draw from the sun: their share of the meter load drops
  const solarCount = player.businesses.filter((b) => b.upgrades.includes('solar')).length
  // M6 — the NEW day's weather (already set by the clock before this call)
  // folds its market stress into the day's prices
  const newWeather = get().world?.weather
  // M9 — Chill Mode runs the whole civic roll kinder (2× disco grace, 3× warrant)
  const chill = get().settings.chill
  const { civic: rolled, chaos: rolledChaos, calendar: rolledCal, rivers: rolledRiv, housing: rolledHou, japa: rolledJap, agg } = civicRollForDays(civic, chaos, calendar, rivers, housing, japa, player.stats.totalEarned, prevDay, newDay, bizCount, solarCount, newWeather, undefined, chill)
  set({ civic: rolled, chaos: rolledChaos, calendar: rolledCal, rivers: rolledRiv, housing: rolledHou, japa: rolledJap })

  // M3 — the shops earn while the city turns: accrue into each till (market
  // multipliers read the ALREADY-ROLLED civic slice; M8 — the chaos thread
  // prices the dark days and the scarcity harvest). Tax only sees this
  // money when it is collected (addMoney → ledger → totalEarned).
  if (player.businesses.length > 0) {
    // M11 — the flood crush folds with the grid laws: the worse water wins,
    // the rescue trucks soften the saved zones for the rest of the surge-year
    const bizRes = bizDayRoll(player.businesses, prevDay, newDay, rolled, player.reputation, rolledChaos, (zoneId, day) => floodBizFactor(rolledRiv, zoneId, day))
    if (bizRes.total > 0) {
      const p0 = get().player!
      set({ player: { ...p0, businesses: bizRes.next } })
      get().notify({ icon: '🧺', text: `Your shop${player.businesses.length > 1 ? 's' : ''} made ${formatNaira(bizRes.total)} — go collect am.`, tone: 'good' })
    } else {
      const p0 = get().player!
      set({ player: { ...p0, businesses: bizRes.next } })
    }
  }

  // whistleblower rewards land as honest hustle income (ledger remembers)
  if (agg.tipReward > 0) {
    get().addMoney(agg.tipReward, {
      label: `Whistleblower reward — ${agg.tipsResolved.map((t) => t.label).join(', ')}`,
      category: 'hustle',
    })
  }
  // the day the light goes stings a little
  if (agg.nepaShed) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -CIVIC.nepa.sheddingMoodHit }) } })
  }  // a warrant makes the state learn your name — the wrong way
  if (agg.warrantIssued) {
    get().addReputation(-CIVIC.kgirs.warrantReputationHit)
  }

  // M8 — chaos narration: the boom, the light, the dry naira, the payout
  if (agg.blowoutZone) {
    const zoneName = LOCATION_BY_ID[agg.blowoutZone]?.name ?? agg.blowoutZone
    const p = get().player
    const inZone = world.currentLocation === agg.blowoutZone
    if (p && inZone) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -CHAOS.fixMood }) } })
    get().notify({
      icon: '⚡',
      text: inZone
        ? `BOOM! Transformer don blow for ${zoneName} — your area don go dark!`
        : `Transformer don blow for ${zoneName} — the whole area don go dark.`,
      tone: 'bad',
    })
  }
  if (agg.outageFixed) {
    const zoneName = LOCATION_BY_ID[agg.outageFixed.zoneId]?.name ?? agg.outageFixed.zoneId
    const contributed = agg.outageFixed.fixedBy === 'community'
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: CHAOS.fixMood }) } })
    if (contributed) get().addReputation(CHAOS.fixReputation)
    get().notify({
      icon: '💡',
      text: contributed
        ? `UP NEPA! Community power don return to ${zoneName} — the street go remember you.`
        : `UP NEPA! NEPA don repair the ${zoneName} transformer.`,
      tone: 'good',
    })
  }
  if (agg.scarcityDay) {
    get().notify({ icon: '💸', text: 'Cash scarcity today — ATM dey dry, POS agents don increase price, fuel na black market.', tone: 'neutral' })
  }
  if (agg.payoutDay) {
    get().notify({ icon: '🐷', text: 'Ajo payout day — market traders carry cash today, prices soft small.', tone: 'neutral' })
  }

  // M10 — the calendar narrates itself: festivals, weddings, streets, stakes
  if (agg.festivalMorning) {
    const f = agg.festivalMorning
    const p = get().player
    const mood = FESTIVALS.mood[f.id] ?? 0
    if (p && mood > 0) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood }) } })
    get().notify({ icon: f.icon, text: `${f.name}${f.daysLeft > 1 ? ' (final day)' : ''} — ${f.note}`, tone: 'good' })
  }
  if (agg.weddingToday) {
    const w = agg.weddingToday
    const p = get().player
    const venueName = LOCATION_BY_ID[w.venueId]?.name ?? w.venueId
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: FESTIVALS.mood.wedding }) } })
    get().notify({ icon: '💍', text: `Wedding today! ${w.couple} don tie knot at ${venueName} — aso-ebi dey Kpata.`, tone: 'good' })
  }
  if (agg.pavingDone) {
    const zoneName = LOCATION_BY_ID[agg.pavingDone.zoneId]?.name ?? agg.pavingDone.zoneId
    get().addReputation(FESTIVALS.pavedRep)
    get().notify({ icon: '🛣️', text: `The union don finish paving ${zoneName} — smooth road for the next ${FESTIVALS.pavedDays} days!`, tone: 'good' })
  }
  if (agg.pavingStalled) {
    const zoneName = LOCATION_BY_ID[agg.pavingStalled.zoneId]?.name ?? agg.pavingStalled.zoneId
    get().notify({ icon: '🧱', text: `The ${zoneName} paving pool never full — the union don carry am go next project.`, tone: 'neutral' })
  }
  if (agg.regattaResult) {
    const rr = agg.regattaResult
    if (rr.sponsorWin) {
      get().addMoney(rr.sponsorWin.payout, { label: `Regatta sponsor payout — ${rr.sponsorWin.teamId} win the trophy`, category: 'hustle' })
      get().addReputation(FESTIVALS.sponsorWinRep)
      get().notify({ icon: '🏆', text: `${rr.winner} don win the Regatta! Your sponsorship pay ${formatNaira(rr.sponsorWin.payout)} — the whole shoreline dey call your name.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else if (rr.sponsorLose) {
      get().addReputation(FESTIVALS.sponsorLoseRep)
      get().notify({ icon: '🚤', text: `${rr.winner} carry the Regatta trophy. Your crew no win but the street respect the support.`, tone: 'neutral' })
    }
    if (rr.betWin) {
      get().addMoney(rr.betWin.payout, { label: `Regatta bet won — ${rr.betWin.teamId} at ${FESTIVALS.betOdds}×`, category: 'other' })
      get().notify({ icon: '💸', text: `Your bet don land! ${formatNaira(rr.betWin.payout)} from the shoreline bookie.`, tone: 'good' })
    } else if (rr.betLose > 0) {
      get().notify({ icon: '🎲', text: `Your boat no win — ${formatNaira(rr.betLose)} stay for the bookie hand. Next year again.`, tone: 'bad' })
    }
  }

  // M11 — the river narrates itself: the water, the bowls, the damp
  if (agg.floodedZone) {
    const zoneName = LOCATION_BY_ID[agg.floodedZone]?.name ?? agg.floodedZone
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -2 }) } })
    get().notify({
      icon: '🌊',
      text: `The Niger don rise — ${zoneName} road don go under water. Canoe ferry dey run from the Motor Park.`,
      tone: 'bad',
    })
  }
  if (agg.drainedZone) {
    const zoneName = LOCATION_BY_ID[agg.drainedZone]?.name ?? agg.drainedZone
    get().notify({ icon: '💧', text: `The water don leave ${zoneName} — the road dey open again.`, tone: 'good' })
  }
  if (agg.rescueWake) {
    get().notify({ icon: '🧊', text: `Deep water don reach the cold rooms — the street don pass the rescue bowl for ${LOCATION_BY_ID[agg.rescueWake]?.name ?? agg.rescueWake}.`, tone: 'neutral' })
  }
  if (agg.rescueDone) {
    const zoneName = LOCATION_BY_ID[agg.rescueDone]?.name ?? agg.rescueDone
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: RIVERS.rescue.moodReward }) } })
    get().addReputation(RIVERS.rescue.repReward)
    get().notify({ icon: '🛻', text: `COLD-ROOM RESCUE COMPLETE! The trucks don move the stock to the Patti road high ground — ${zoneName} go hear am for the season.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
  }
  if (agg.riverRelief) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: RIVERS.reliefMood }) } })
    get().notify({ icon: '☀️', text: 'The river don enter back inside him banks — the whole city dey breathe.', tone: 'good' })
  } else if (agg.riverDamp) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -RIVERS.dampMoodHit }) } })
  }

  // M12 — the ladder narrates itself: the rent book, the wahala, the japa money
  if (agg.rentPosted) {
    get().notify({ icon: '🏠', text: `Rent cycle posted — ${formatNaira(agg.rentPosted.amount)} due for the room.`, tone: 'neutral' })
  }
  if (agg.wahalaArrived) {
    get().notify({ icon: '🔑', text: `Landlord wahala: ${agg.wahalaArrived.note}.`, tone: 'neutral' })
  }
  if (agg.lateNotice) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -4 }) } })
    get().addReputation(-2)
    get().notify({ icon: '📄', text: 'QUIT NOTICE: the rent book don fall two cycles behind — the landlord no dey smile again.', tone: 'bad' })
  }
  if (agg.remittance) {
    get().addMoney(LADDER.japa.remittance, { label: 'First remittance — from abroad', category: 'tip' })
    get().notify({ icon: '💸', text: `The first remittance don land — ${formatNaira(LADDER.japa.remittance)} from abroad. The village dey proud of you.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
  }

  if (agg.nepaPosted > 0) {
    get().notify({ icon: '🧾', text: `NEPA bill posted — ${formatNaira(agg.nepaPosted)} due.`, tone: 'neutral' })
  }
  if (agg.nepaShed) {
    get().notify({ icon: '🔌', text: 'Load-shedding: NEPA don cut your light. Settle the bill to reconnect.', tone: 'bad' })
  }
  if (agg.taxAssessed > 0) {
    get().notify({ icon: '🧮', text: `KGIRS assessment: ${formatNaira(agg.taxAssessed)} tax due.`, tone: 'neutral' })
  }
  if (agg.warrantIssued) {
    get().notify({ icon: '🚨', text: 'Tax warrant issued — settle it at the police station.', tone: 'bad' })
  }
  for (const t of agg.tipsResolved) {
    get().notify({ icon: '🕵️', text: `EFCC recovered funds from “${t.label}” — your share: ${formatNaira(efccRewardFor(t))}.`, tone: 'good' })
  }
}

/** Debounced autosave — called after every state-mutating action. */
function scheduleAutosave(get: () => GameStore) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const { player, world, civic, settings } = get()
    if (!player || !world || !civic) return
    const existing = SaveSystem.load()
    SaveSystem.write({
      version: SaveSystem.SAVE_VERSION,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      player,
      world,
      civic,
      fleet: get().fleet,
      chaos: get().chaos,
      calendar: get().calendar,
      rivers: get().rivers,
      education: get().education,
      housing: get().housing,
      japa: get().japa,
      goals: get().goals,
      onboarding: get().onboarding,
      account: get().account,
      shield: get().shield,
      fortress: get().fortress,
      cityPulse: get().cityPulse ?? freshPulseState(),
      live: get().live ?? freshLiveState(),
      forge: get().forge ?? freshForgeState(),
      story: get().story,
      patti: get().patti,
      wardrobe: get().wardrobe,
      settings,
    })
  }, AUTOSAVE.debounceMs)
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'menu',
  booted: false,
  hasSave: false,
  notifications: [],

  player: null,
  world: null,
  civic: null,
  fleet: { day: 1, done: [] },
  chaos: freshChaosState(),
  calendar: freshCalendarState(),
  rivers: freshRiversState(),
  education: freshEducationState(),
  housing: freshHousingState(),
  japa: freshJapaState(),
  goals: freshGoalState(),
  onboarding: freshOnboardingState(),
  account: freshAccountState(),
  shield: freshShieldState(),
  fortress: freshFortressState(),
  gateOpen: false,
  pulse: null,
  cityPulse: null,
  live: null,
  liveWire: null,
  forge: null,
  story: freshStoryState(),
  patti: freshPattiState(),
  wardrobe: freshWardrobeState(),
  pendingArrival: null,
  cloudPending: false,
  shockwave: 0,
  settings: { sound: true, graphics: 'auto' as const, chill: false, elder: false, music: false, haptics: true },

  isTravelling: false,
  isWorking: false,
  workingLabel: null,
  offers: [],

  /* ----------------------------- lifecycle ----------------------------- */

  boot: () => {
    const save = SaveSystem.load()
    const bootSettings = save?.settings ?? { sound: true, graphics: 'auto', chill: false, elder: false, music: false, haptics: true }
    syncAudioWithSettings(bootSettings)
    // M19 — the audio/haptic engines ride the settings at boot
    haptics.setEnabled(bootSettings.haptics)
    haptics.setElder(bootSettings.elder)
    music.setEnabled(bootSettings.sound && bootSettings.music)
    set({ booted: true, hasSave: SaveSystem.hasSave(), settings: bootSettings })
    get().bootWorldHooks()
  },

  setScreen: (screen) => menuSetScreen(screen),

  /** M15/M16 world-boot hooks — the parts of boot() that only matter once
   *  the FAT store exists (postcard decode + the offline queue). Idempotent:
   *  the postcard decode just re-sets the same value, the listener wires
   *  itself exactly once. boot() runs it; the dashboard idle preload and
   *  continueGame run it too, so the menu-only boot can stay thin. */
  bootWorldHooks: () => {
    // M15 — a postcard in the URL: decode it now, land when the city opens
    try {
      const t = new URLSearchParams(window.location.search).get('t')
      if (t) {
        const dec = decodeTeleport(t)
        if (dec.ok) set({ pendingArrival: { code: t.trim(), moment: dec.moment } })
        else set({ pendingArrival: null })
      }
    } catch { /* no window (tests) — the boot continues without a postcard */ }
    // M16 — the offline law: a queued push rides again when the network returns
    try {
      const queued = window.localStorage.getItem('lokoja-life:cloud-queue') === '1'
      if (queued) set({ cloudPending: true })
      if (!cloudQueueWired) {
        cloudQueueWired = true
        window.addEventListener('online', () => { void useGameStore.getState().flushCloudQueue() })
      }
      if (queued && navigator.onLine) void get().flushCloudQueue()
    } catch { /* no window — the queue law sleeps */ }
  },

  /* ---------------------------- core actions ---------------------------- */

  startNewGame: (name, gender, avatar, ageBand = 'adult') => {
    const player: PlayerState = {
      name: name.trim() || 'New Hustler',
      gender,
      avatar: { ...DEFAULT_AVATAR, ...avatar },
      ageBand,
      cash: STARTING.cash,
      needs: { ...STARTING.needs },
      skills: { ...STARTING.skills },
      reputation: STARTING.reputation,
      level: STARTING.level,
      xp: STARTING.xp,
      homeId: STARTING.homeId,
      jobId: STARTING.jobId,
      skillXp: { hustle: 0, smart: 0, social: 0 },
      activeOpportunities: [],
      cooldowns: {},
      transactions: [],
      stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 },
      inventory: [],
      businesses: [],
      missions: {},
      achievements: [],
      discoveries: [],
      vehicles: [],
      bankBalance: 0,
      relationships: {},
    }
    const world: WorldState = {
      day: 1,
      timeOfDay: 'morning',
      weather: 'sunny',
      currentLocation: 'home',
    }
    set({
      player,
      world,
      civic: freshCivicState(),
      chaos: freshChaosState(),
      calendar: freshCalendarState(),
      rivers: freshRiversState(),
      education: freshEducationState(),
      housing: freshHousingState(),
      japa: freshJapaState(),
      goals: freshGoalState(),
      onboarding: freshOnboardingState(),
      account: freshAccountState(),
      shield: freshShieldState(),
      fortress: freshFortressState(),
      cityPulse: freshPulseState(),
      live: freshLiveState(),
      forge: freshForgeState(),
      pendingArrival: get().pendingArrival,
      gateOpen: false,
      fleet: { day: 1, done: [] },
      offers: [],
    })
    // M15 — a postcard was waiting for a fresh life: land at that street
    const pending = get().pendingArrival
    if (pending) {
      applyArrival(set, get, pending.code, pending.moment, { silent: true })
    }
    scheduleAutosave(get)
    menuSetScreen('game') // the menu store owns screen — this is the writer
  },

  continueGame: () => {
    const save = SaveSystem.load()
    if (!save) return false
    get().bootWorldHooks() // the postcard must exist before the landing reads it
    // M7: defensive graphics default (saves restored from older backups)
    const settings = { ...save.settings, graphics: save.settings.graphics ?? 'auto' }
    syncAudioWithSettings(settings)
    refreshDeviceProfile(settings.graphics)
    set({
      player: save.player,
      world: save.world,
      civic: save.civic,
      chaos: save.chaos ?? freshChaosState(),
      calendar: save.calendar ?? freshCalendarState(),
      rivers: save.rivers ?? freshRiversState(),
      education: save.education ?? freshEducationState(),
      housing: save.housing ?? freshHousingState(),
      japa: save.japa ?? freshJapaState(),
      goals: save.goals ?? freshGoalState(),
      onboarding: save.onboarding ?? freshOnboardingState(),
      account: save.account ?? freshAccountState(),
      shield: save.shield ?? freshShieldState(),
      fortress: save.fortress ?? freshFortressState(),
      cityPulse: save.cityPulse ?? freshPulseState(),
      live: save.live ?? freshLiveState(),
      forge: save.forge ?? freshForgeState(),
      fleet: save.fleet,
      settings,
    })
    // M15 — a postcard came with the boot URL: land the moment the city opens
    const pendingBoot = get().pendingArrival
    if (pendingBoot) {
      const verdict = gateVerdict(get().account, pendingBoot.moment.locId, save.world.day)
      if (!verdict.blocked) applyArrival(set, get, pendingBoot.code, pendingBoot.moment)
      else set({ gateOpen: true })
    }
    menuSetScreen('game') // the menu store owns screen — this is the writer
    return true
  },

  returnToMenu: () => {
    get().saveNow()
    set({ hasSave: SaveSystem.hasSave() })
    menuSetScreen('menu') // the menu store owns screen — this is the writer
    useMenuStore.getState().refreshFromDisk() // the menu re-reads disk truth
  },

  /* --------------------------- needs / time ----------------------------- */

  rest: (kind) => {
    const { player, world } = get()
    if (!player || !world) return

    // rest values come from the central config — never hard-coded
    const { energy, hunger, mood, health } = NEEDS.rest[kind]
    const delta = { energy, hunger, mood, health }

    // M12 — THE COMFORT LAW: an owned, furnished home restores the body
    // warmer (energy + comfort × the config step; the furnishing mood too)
    let needs = applyNeedsDelta(player.needs, delta)
    if (kind === 'sleep') {
      const comfort = homeComfort(get().housing)
      if (comfort > 0) {
        needs = applyNeedsDelta(needs, { energy: comfort * LADDER.housing.sleepEnergyPerComfort })
      }
    }

    let newWorld: WorldState
    if (kind === 'nap') {
      const { timeOfDay, dayDelta } = nextSlot(world.timeOfDay)
      newWorld = {
        ...world,
        timeOfDay,
        day: world.day + dayDelta,
        weather: weatherForSlot(world.weather, timeOfDay),
      }
    } else {
      // sleep till next morning — fresh day, fresh weather
      newWorld = {
        ...world,
        day: world.day + 1,
        timeOfDay: 'morning',
        weather: rollNewDayWeather(),
      }
    }

    set({ player: { ...player, needs }, world: newWorld })
    get().notify({
      icon: kind === 'nap' ? '😴' : '🌙',
      text: kind === 'nap' ? 'You took a short nap.' : `Day ${newWorld.day} begins!`,
      tone: 'good',
    })
    audio.play('notify')

    // M6 — LIVING WORLD: the day the sky turns, the city tells you. A
    // harmattan haze, a confluence thunderstorm or a flood day announces
    // itself, and the weather's mood lands on the same sleep (the config's
    // weatherEffects table finally does its honest work).
    if (kind === 'sleep') {
      const meta = WEATHER_META[newWorld.weather]
      const moodHit = Math.round((TIME.weatherEffects[newWorld.weather]?.mood ?? 0) * (get().settings.chill ? CHILL.weatherMoodMult : 1))
      const p0 = get().player
      if (p0 && moodHit !== 0) {
        set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { mood: moodHit }) } })
      }
      if (meta?.dayNote) {
        get().notify({ icon: meta.icon === 'flood' ? '🌊' : meta.icon === 'storm' ? '⛈️' : '🌫️', text: meta.dayNote, tone: 'neutral' })
      }
    }

    // M2 — the civic mesh rolls as the day (or days) turn
    commitCivicDays(get, set, world.day, newWorld.day)
    scheduleAutosave(get)
  },

  advanceTime: (slots = 1) => {
    const { player, world } = get()
    if (!world) return
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, slots)
    // INC 4 — the body quietly spends itself while the clock runs
    const player2 = player
      ? { ...player, needs: applySlotDecay(player.needs, slots) }
      : player
    set({ player: player2, world: { ...world, ...clock } })
    // M2 — slots can cross midnight; the civic mesh follows the day
    commitCivicDays(get, set, world.day, clock.day)
    scheduleAutosave(get)
  },

  /** INC 4 — home downtime: watch TV or freshen up. Costs one honest clock
   *  slot (time really passes) + small needs shift from INTERIOR config. */
  relaxIndoors: (kind) => {
    const { player, world, civic } = get()
    if (!player || !world) return
    // M2 — load-shedding is real: no light, no TV. M8 — a blown transformer
    // is darker still: the whole feeder is down, the screen is furniture.
    if (kind === 'tv') {
      const darkHome = blackoutAt(get().chaos, 'home', world.day)
      if (civic?.nepa.shedding || darkHome) {
        get().notify({
          icon: '🔌',
          text: darkHome
            ? 'Transformer don blow for your area — the TV just dey look you. E no get light to show anything.'
            : 'NEPA don take the light — the TV just dey look you. Settle the bill first.',
          tone: 'bad',
        })
        audio.play('notify')
        return
      }
    }
    const r = INTERIOR.relax[kind]
    const needs = applyNeedsDelta(slotDecay(get, player.needs, 1), r)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...player, needs }, world: { ...world, ...clock } })
    get().notify({
      icon: kind === 'tv' ? '📺' : '🚿',
      text: kind === 'tv' ? 'You relaxed with some TV.' : 'You freshened up. Feeling sharp.',
      tone: 'good',
    })
    audio.play('notify')
    scheduleAutosave(get)
  },

  /** Stage 3D — walking in the 3D world costs a little energy past the free
   *  allowance. Pure system computes the cost from WORLD3D config; the needs
   *  engine applies it. No clock change (walking is not travelling). */
  settleWorldWalk: (meters) => {
    const { player } = get()
    if (!player) return
    const cost = walkingEnergyCost(meters)
    if (cost <= 0) return
    const needs = applyNeedsDelta(player.needs, { energy: -cost })
    set({ player: { ...player, needs } })
    const label = describeWalkSettle(meters, cost)
    if (label) {
      get().notify({ icon: '🚶', text: `${label} — ${cost} energy spent.`, tone: 'neutral' })
    }
    scheduleAutosave(get)
  },

  /* --------------------- M2 — the civic mesh actions --------------------- */

  /** Settle the electricity bill. In the GRA office it costs the debt
   *  (+ reconnection once cut); from the phone it adds the convenience fee. */
  payNepa: (channel) => {
    const { player, world, civic } = get()
    if (!player || !world || !civic) return false
    if (civic.nepa.owed <= 0 && !civic.nepa.shedding) {
      get().notify({ icon: '💡', text: 'You no owe NEPA anything. Enjoy the light.', tone: 'neutral' })
      return false
    }
    if (channel === 'office' && world.currentLocation !== 'government-area') {
      get().notify({ icon: '🏢', text: 'The NEPA counter is in the Government Area — or pay from your phone for a small fee.', tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    const cost = nepaSettleCost(civic) + fee
    if (!get().removeMoney(cost, {
      label: fee ? 'NEPA bill — online payment (incl. fee)' : civic.nepa.shedding ? 'NEPA bill + reconnection fee' : 'NEPA bill',
      category: 'other',
    })) {
      get().notify({ icon: '🧾', text: `You need ${formatNaira(cost)} to clear the disco.`, tone: 'bad' })
      return false
    }
    set({ civic: nepaApplyPayment(get().civic!, world.day) })
    get().notify({
      icon: '💡',
      text: civic?.nepa.shedding ? 'Light don come back! NEPA staff dey smile small.' : 'NEPA bill settled — meter dey smile.',
      tone: 'good',
    })
    get().bumpGoal('nepa')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Settle the KGIRS assessment. A clean assessment pays anywhere (office
   *  free / phone + fee); a WARRANT only clears at the police desk in the GRA,
   *  where the fine comes on top. */
  payKgirs: (channel) => {
    const { player, world, civic } = get()
    if (!player || !world || !civic) return false
    if (civic.kgirs.assessed <= 0) {
      get().notify({ icon: '🧮', text: 'No tax assessment dey wait. KGIRS dey sleep — for now.', tone: 'neutral' })
      return false
    }
    const warrant = civic.kgirs.warrant
    if (channel === 'phone' && warrant) {
      get().notify({ icon: '🚨', text: 'A warrant no fit clear by phone. Walk to the police station.', tone: 'bad' })
      return false
    }
    if (channel !== 'phone' && world.currentLocation !== 'government-area') {
      get().notify({ icon: '🏢', text: warrant ? 'The warrant desk is at the GRA police station.' : 'KGIRS office dey Government Area — or use the phone app (+fee).', tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    const cost = kgirsSettleCost(civic) + fee
    if (!get().removeMoney(cost, {
      label: warrant ? 'KGIRS tax + warrant fine (police)' : fee ? 'KGIRS tax — online payment (incl. fee)' : 'KGIRS tax assessment',
      category: 'other',
    })) {
      get().notify({ icon: '🧮', text: `You need ${formatNaira(cost)} to settle the taxman.`, tone: 'bad' })
      return false
    }
    set({ civic: kgirsApplyPayment(get().civic!, warrant) })
    get().notify({
      icon: '🧮',
      text: warrant ? 'Warrant cleared at the desk — the police sef smile.' : 'Tax settled. Your name clean for KGIRS book.',
      tone: 'good',
    })
    get().bumpGoal('tax')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** File a whistleblower tip at the EFCC zonal command (in person only). */
  fileEfccTip: () => {
    const { player, world, civic } = get()
    if (!player || !world || !civic) return false
    if (world.currentLocation !== 'government-area') {
      get().notify({ icon: '🏢', text: 'The commission sits in the Government Area. Carry your gist there.', tone: 'neutral' })
      return false
    }
    if (world.day - civic.efcc.lastTipDay < CIVIC.efcc.tipCooldownDays) {
      get().notify({ icon: '🕵️', text: 'The commission dey still investigate your last tip. Come back small later.', tone: 'neutral' })
      return false
    }
    const { next, tip } = efccFileTip(civic, world.day)
    set({ civic: next })
    get().notify({
      icon: '🕵️',
      text: `Tip filed: “${tip.label}”. If EFCC recover, your cut na ${Math.round(CIVIC.efcc.rewardRate * 100)}%.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Today's honest market price of a meal at a spot — the ONE source the
   *  menu rows and eatMeal both read, so display can never drift from charge.
   *  M6 — night dishes price by the night-market law: the seeded per-day
   *  discount at the food strip after dark, and NOWHERE else. */
  mealPriceAt: (mealKey, locationId) => {
    const { world, civic } = get()
    const meal = MEAL_BY_KEY[mealKey]
    if (!meal || !world) return meal?.price ?? 0
    if (meal.night) {
      return mealAvailableAt(true, locationId, world.timeOfDay)
        ? nightMealPrice(meal.price, world.day)
        : meal.price
    }
    const c = marketForDay(civic ?? freshCivicState(), world.day, world.weather)
    return marketMealPrice(meal.price, mealKey, locationId, c, world.day)
  },

  /* ---------------------- M3 — OWN THE CITY (biz) ---------------------- */

  buyBiz: (typeId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const def = bizDef(typeId)
    if (!def) return false
    if (bizOwned(player.businesses, typeId)) {
      get().notify({ icon: def.emoji, text: `You already run the ${def.name}. One per man for now.`, tone: 'neutral' })
      return false
    }
    if (player.level < def.unlockLevel) {
      get().notify({ icon: '🔒', text: `${def.name} opens at Level ${def.unlockLevel}. Keep pushing.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(def.buyCost, { label: `Bought: ${def.name}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `${def.name} costs ${formatNaira(def.buyCost)}. You no reach yet.`, tone: 'bad' })
      return false
    }
    const shop = freshBusiness(typeId, world.day)
    const p = get().player!
    set({ player: { ...p, businesses: [...p.businesses, shop] } })
    get().notify({ icon: def.emoji, text: `${def.name} na yours now! Income go dey enter the till daily.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  collectBiz: (typeId, channel) => {
    const { player, world } = get()
    if (!player || !world) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    if (!def || !shop) return false
    if (channel === 'shop' && world.currentLocation !== def.locationId) {
      const where = LOCATION_BY_ID[def.locationId]?.shortName ?? def.locationId
      get().notify({ icon: def.emoji, text: `The ${def.name} dey ${where} — the money dey wait for you there.`, tone: 'neutral' })
      return false
    }
    const gross = Math.round(shop.accrued)
    if (gross <= 0) {
      get().notify({ icon: '🧺', text: 'The till is empty — come back tomorrow.', tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    const net = Math.max(0, gross - fee)
    if (net <= 0) {
      get().notify({ icon: '📱', text: 'The money never even reach transfer fee. Wait small.', tone: 'neutral' })
      return false
    }
    const { next } = bizCollect(shop, world.day)
    const p = get().player!
    set({ player: { ...p, businesses: p.businesses.map((b) => (b.typeId === typeId ? next : b)) } })
    get().addMoney(net, {
      label: fee ? `${def.name} till (phone, incl. fee)` : `${def.name} till`,
      category: 'hustle',
    })
    get().notify({
      icon: def.emoji,
      text: fee ? `Collected ${formatNaira(net)} by transfer (₦${fee} fee don go).` : `Collected ${formatNaira(net)} from the till. Solid.`,
      tone: 'good',
    })
    get().bumpGoal('collect')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  upgradeBiz: (typeId) => {
    const { player } = get()
    if (!player) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    if (!def || !shop) return false
    const cost = bizUpgradeCost(typeId, shop.level)
    if (cost === null) {
      get().notify({ icon: def.emoji, text: `${def.name} don reach max level. Na big name you be.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(cost, { label: `Upgraded: ${def.name} → L${shop.level + 1}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `Upgrade costs ${formatNaira(cost)}. Gather am first.`, tone: 'bad' })
      return false
    }
    const p = get().player!
    set({ player: { ...p, businesses: p.businesses.map((b) => (b.typeId === typeId ? { ...b, level: b.level + 1 } : b)) } })
    get().notify({ icon: def.emoji, text: `${def.name} don level up to L${shop.level + 1} — income go show am.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* ------------------ M5 — staff, power & the fleet ------------------ */

  hireStaff: (typeId) => {
    const { player } = get()
    if (!player) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    if (!def || !shop) return false
    const cap = staffCapFor(shop.level)
    if (shop.staff >= cap) {
      get().notify({
        icon: '👥',
        text: `The ${def.name} no fit carry more hands at L${shop.level} — upgrade am first.`,
        tone: 'neutral',
      })
      return false
    }
    if (!get().removeMoney(BIZ.staffHireFee, { label: `Hired attendant — ${def.name}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `Hiring costs ${formatNaira(BIZ.staffHireFee)}. You no reach yet.`, tone: 'bad' })
      return false
    }
    const p = get().player!
    set({ player: { ...p, businesses: p.businesses.map((b) => (b.typeId === typeId ? { ...b, staff: b.staff + 1 } : b)) } })
    get().notify({
      icon: '👥',
      text: `One more attendant join the ${def.name} — income +${Math.round(BIZ.staffIncomeBoost * 100)}%, wage ${formatNaira(BIZ.staffWagePerDay)}/day from the till.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  fireStaff: (typeId) => {
    const { player } = get()
    if (!player) return false
    const shop = bizOwned(player.businesses, typeId)
    if (!shop || shop.staff <= 0) return false
    set({ player: { ...player, businesses: player.businesses.map((b) => (b.typeId === typeId ? { ...b, staff: b.staff - 1 } : b)) } })
    get().notify({ icon: '👋', text: 'You let one attendant go. The wage stops tomorrow.', tone: 'neutral' })
    scheduleAutosave(get)
    return true
  },

  installBizUpgrade: (typeId, upgradeId) => {
    const { player } = get()
    if (!player) return false
    const def = bizDef(typeId)
    const shop = bizOwned(player.businesses, typeId)
    const up = (BIZ.upgrades as Record<string, { label: string; emoji: string; cost: number } | undefined>)[upgradeId]
    if (!def || !shop || !up) return false
    if (shop.upgrades.includes(upgradeId)) {
      get().notify({ icon: up.emoji, text: `${up.label} already dey run for the ${def.name}.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(up.cost, { label: `${up.label} — ${def.name}`, category: 'other' })) {
      get().notify({ icon: '💰', text: `${up.label} costs ${formatNaira(up.cost)}. Gather am first.`, tone: 'bad' })
      return false
    }
    const p = get().player!
    set({
      player: {
        ...p,
        businesses: p.businesses.map((b) => (b.typeId === typeId ? { ...b, upgrades: [...b.upgrades, upgradeId] } : b)),
      },
    })
    get().notify({
      icon: up.emoji,
      text: `${up.label} installed at the ${def.name} — ${upgradeId === 'solar' ? 'dark days no fit touch am again, and NEPA load don drop.' : 'NEPA fit cut the whole street — your shop go still glow.'}`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  runGig: (gigId) => {
    const { player, world, fleet, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return false

    const gig = gigBoard(world.day, player.vehicles, player.level, world.weather, fuelMultFor(world.day), get().calendar).find((g) => g.id === gigId)
    if (!gig) return false
    if (fleet.day === world.day && fleet.done.includes(gigId)) {
      get().notify({ icon: '🛵', text: 'You don run this one today — tomorrow get their own runs.', tone: 'neutral' })
      return false
    }
    if (world.currentLocation !== 'transport-area') {
      get().notify({ icon: '📍', text: 'The passengers dey wait at the Motor Park — travel come first.', tone: 'bad' })
      return false
    }
    if (player.needs.energy < gig.energyCost) {
      get().notify({ icon: '🥵', text: 'You are too tired for that run. Rest small first.', tone: 'bad' })
      return false
    }

    const label = gigLabel(gig)
    set({ isWorking: true, workingLabel: `Driving — ${label}` })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      // fuel first — the pump does not take promises
      const fueled = get().removeMoney(gig.fuel, {
        label: `Fuel — ${label.split(' run ')[0]} (gig)`,
        category: 'transport',
      })
      if (!fueled) {
        set({ isWorking: false, workingLabel: null })
        get().notify({ icon: '💸', text: `The run needs ${formatNaira(gig.fuel)} fuel and your pocket no carry am.`, tone: 'bad' })
        return
      }
      // the passenger's fare — honest hustle income the KGIRS can see
      get().addMoney(gig.payout, { label: `Gig — ${label}`, category: 'hustle' })

      const paid = get().player!
      const needs = applySlotDecay(applyNeedsDelta(paid.needs, { energy: -gig.energyCost }), 1, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, 1)
      const nextFleet = { day: w.day, done: [...(get().fleet.day === w.day ? get().fleet.done : []), gig.id] }

      set({
        player: {
          ...paid,
          needs,
          stats: { ...paid.stats, jobsCompleted: paid.stats.jobsCompleted + 1 },
        },
        world: { ...w, currentLocation: gig.toId, ...clock },
        fleet: nextFleet,
        isWorking: false,
        workingLabel: null,
        offers: [], // left the park — unclaimed gist goes cold
      })

      get().addXp(FLEET.gigXp)
      get().addSkillXp('hustle', FLEET.gigHustleXp)
      get().notify({
        icon: '🛵',
        text: `${label} done — passenger paid ${formatNaira(gig.payout)}${gig.rainPremium ? ' (rain price)' : ''}, fuel chop ${formatNaira(gig.fuel)}.`,
        tone: 'good',
      })
      get().notify({
        icon: '📍',
        text: `You drop the passenger at ${LOCATION_BY_ID[gig.toId]?.name ?? 'the drop-off'}.`,
        tone: 'neutral',
      })
      // M9 — the run lands on the daily goals + the onboarding arc
      get().bumpGoal('gig')
      bumpOnboarding(get, set, 'work')
      // a run can cross midnight — the civic mesh follows the day
      commitCivicDays(get, set, w.day, clock.day)
      audio.play('chime')
      haptics.fire('reward')
      scheduleAutosave(get)
    }

    setTimeout(applyDone, WORK.transitionMs)
    return true
  },

  /* ------------------ Stage 5 — ownership, bank, social ------------------ */

  buyVehicle: (model) => {
    const { player, world } = get()
    if (!player || !world) return false
    const def = VEHICLE_BY_MODEL[model]
    if (!def) return false
    if (player.vehicles.some((v) => v.model === model)) {
      get().notify({
        icon: def.emoji,
        text: `You already own a ${def.label}. One per model — garage space na premium.`,
        tone: 'neutral',
      })
      return false
    }
    if (!canAfford(player.cash, def.price)) {
      get().notify({
        icon: '💰',
        text: `${def.label} costs ${formatNaira(def.price)}. Keep pushing — e go reach.`,
        tone: 'bad',
      })
      return false
    }
    const vehicle: OwnedVehicle = {
      id: `${model}-${world.day}-${player.vehicles.length + 1}`,
      model,
      plate: generatePlate(model, world.day, player.vehicles.length),
      boughtDay: world.day,
    }
    const ok = get().removeMoney(def.price, {
      label: `${def.label} (${vehicle.plate})`,
      category: 'shop',
    })
    if (!ok) return false
    const paid = get().player
    if (!paid) return false
    set({ player: { ...paid, vehicles: [...paid.vehicles, vehicle] } })
    get().notify({
      icon: def.emoji,
      text: `Congratulations! ${def.label} na yours — plate ${vehicle.plate}.`,
      tone: 'good',
    })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  sellVehicle: (vehicleId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const vehicle = player.vehicles.find((v) => v.id === vehicleId)
    if (!vehicle) return false
    const def = VEHICLE_BY_MODEL[vehicle.model]
    const value = resaleValue(vehicle.model, vehicle.boughtDay, world.day)
    set({ player: { ...player, vehicles: player.vehicles.filter((v) => v.id !== vehicleId) } })
    get().addMoney(value, {
      label: `Sold ${def.short} (${vehicle.plate})`,
      category: 'other',
    })
    get().notify({
      icon: def.emoji,
      text: `${def.short} sold for ${formatNaira(value)}. The park sabi your price.`,
      tone: 'neutral',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  setAvatar: (avatar) => {
    const { player } = get()
    if (!player) return
    set({ player: { ...player, avatar: { ...DEFAULT_AVATAR, ...avatar } } })
    get().notify({ icon: '👕', text: 'Fresh look don land. Who be this?', tone: 'good' })
    audio.play('notify')
    scheduleAutosave(get)
  },

  workout: () => {
    const { player, world } = get()
    if (!player || !world) return
    const needs = applySlotDecay(applyNeedsDelta(player.needs, INTERIOR.gym), 1, get().settings.chill ? CHILL.decayMult : 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...player, needs }, world: { ...world, ...clock } })
    get().notify({ icon: '💪', text: 'Gym session done. Body dey thank you.', tone: 'good' })
    get().bumpGoal('workout')
    audio.play('notify')
    scheduleAutosave(get)
  },

  study: (label) => {
    const { player, world } = get()
    if (!player || !world) return
    const cfg = INTERIOR.study
    // M13 — education-first: young bands' brains harvest the boost
    const boost = player.ageBand === 'adult' ? 1 : SHIELD.studyBoost
    const needs = applySlotDecay(applyNeedsDelta(player.needs, cfg), 1, get().settings.chill ? CHILL.decayMult : 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...player, needs }, world: { ...world, ...clock } })
    // the skill gain flows through the SAME authority every other XP uses
    get().addSkillXp('smart', Math.round(cfg.smartXp * boost))
    get().notify({ icon: '📚', text: boost > 1 ? `${label ?? 'Lesson'} done. Young brain dey sharp ×${boost}.` : `${label ?? 'Lesson'} done. Brain dey sharp.`, tone: 'good' })
    get().bumpGoal('study')
    audio.play('notify')
    scheduleAutosave(get)
  },

  nightOut: () => {
    const { player, world } = get()
    if (!player || !world) return
    // M13 — THE FAMILY SHIELD: the night lounge is crime-adjacent, 18+ only
    if (!crimeAllowed(player.ageBand, 'night-out')) {
      get().notify({ icon: '🛡️', text: CRIME_REFUSALS['night-out'], tone: 'neutral' })
      audio.play('notify')
      return
    }
    const isNight = world.timeOfDay === 'evening' || world.timeOfDay === 'night'
    if (!canAfford(player.cash, INTERIOR.NIGHT_OUT.cost)) {
      get().notify({
        icon: '🍾',
        text: `Night out costs ${formatNaira(INTERIOR.NIGHT_OUT.cost)} — pocket no reach today.`,
        tone: 'bad',
      })
      return
    }
    const ok = get().removeMoney(INTERIOR.NIGHT_OUT.cost, {
      label: 'Night out at the lounge',
      category: 'fun',
    })
    if (!ok) return
    const paid = get().player
    if (!paid) return
    const shift = {
      ...INTERIOR.lounge,
      mood: INTERIOR.lounge.mood + (isNight ? INTERIOR.NIGHT_OUT.nightMoodBonus : 0),
    }
    const needs = applySlotDecay(applyNeedsDelta(paid.needs, shift), 1, get().settings.chill ? CHILL.decayMult : 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...paid, needs }, world: { ...world, ...clock } })
    get().notify({
      icon: '🍾',
      text: isNight
        ? 'Night life done you well. Lokoja no go sleep tonight!'
        : 'Small chill for the lounge. Evening own go pass this one.',
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
  },

  bankDeposit: (amount) => {
    const { player, world } = get()
    if (!player || !world || amount <= 0) return false
    if (!canAfford(player.cash, amount)) {
      get().notify({ icon: '🏦', text: 'Cash wey dey your pocket no reach that amount.', tone: 'bad' })
      return false
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    const tx = recordTransaction('Bank deposit', 'bank', -amount, world.day, slot)
    set({
      player: {
        ...player,
        cash: player.cash - amount,
        bankBalance: player.bankBalance + amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
      },
    })
    get().notify({ icon: '🏦', text: `${formatNaira(amount)} don enter bank. Money wey dey bank dey safe.`, tone: 'good' })
    get().bumpGoal('deposit')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  bankWithdraw: (amount, channel = 'atm') => {
    const { player, world } = get()
    if (!player || !world || amount <= 0) return false
    if (player.bankBalance < amount) {
      get().notify({ icon: '🏦', text: 'Your bank balance no reach that amount.', tone: 'bad' })
      return false
    }
    const day = world.day
    let net = amount
    let label = 'ATM withdrawal'
    let fee = 0
    if (channel === 'pos') {
      // M8 — the agent's levy: instant, no cap, the kiosk network always has cash
      fee = posFeeFor(amount)
      net = Math.max(0, amount - fee)
      label = `POS withdrawal (agent fee ${formatNaira(fee)})`
      const c0 = get().chaos
      set({ chaos: { ...c0, stats: { ...c0.stats, posFees: c0.stats.posFees + fee } } })
    } else if (isScarcityDay(day)) {
      // M8 — THE SCARCITY LAW: the ATM pays a capped trickle on dry days
      const remaining = atmRemaining(get().chaos, day)
      if (remaining <= 0) {
        get().notify({ icon: '🏧', text: 'ATM don dry for today — na only POS agent fit help you now.', tone: 'bad' })
        return false
      }
      if (amount > remaining) {
        get().notify({
          icon: '🏧',
          text: `Cash scarcity: the ATM fit pay ${formatNaira(remaining)} more today. Queue for tomorrow or take the POS agent levy.`,
          tone: 'neutral',
        })
        return false
      }
      set({ chaos: applyAtmDraw(get().chaos, day, amount) })
    }
    const slot = absoluteSlot(day, world.timeOfDay)
    const tx = recordTransaction(label, 'bank', net, day, slot)
    set({
      player: {
        ...player,
        cash: player.cash + net,
        bankBalance: player.bankBalance - amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
      },
    })
    get().notify({
      icon: channel === 'pos' ? '🏧' : '🏦',
      text:
        channel === 'pos'
          ? `${formatNaira(net)} enter your hand — the agent don chop ${formatNaira(fee)}.`
          : `${formatNaira(net)} don comot from bank.`,
      tone: 'good',
    })
    audio.play('notify')
    scheduleAutosave(get)
    return true
  },

  /** M8 — drop your own naira into the community light fund. In person,
   *  once per dark day; when the pool fills, the technician comes overnight. */
  contributeToPool: (tier) => {
    const { player, world, chaos } = get()
    if (!player || !world) return false
    if (!(CHAOS.poolTiers as readonly number[]).includes(tier)) return false
    const gate = canContribute(chaos, world.currentLocation, world.day)
    if (!gate.ok) {
      get().notify({ icon: '💡', text: gate.why, tone: 'neutral' })
      return false
    }
    const zoneName = LOCATION_BY_ID[chaos.active!.zoneId]?.name ?? chaos.active!.zoneId
    if (!get().removeMoney(tier, { label: `Community light fund — ${zoneName}`, category: 'other' })) {
      get().notify({ icon: '⚡', text: `Contribution na ${formatNaira(tier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const after = applyContribution(get().chaos, world.day, tier)
    set({ chaos: after })
    const need = Math.max(0, CHAOS.poolTarget - after.active!.pool)
    get().notify({
      icon: '⚡',
      text:
        need <= 0
          ? `Pool don complete! Technician go reach ${zoneName} tomorrow morning.`
          : `You drop ${formatNaira(tier)} — ${formatNaira(need)} more and the technician go come.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* --------------------- M10 — the living calendar ---------------------- */

  /** Join today's festival in person — mood, rep where it is due, and the
   *  crowd's seeded naira spray. Venue-gated, once per festival-day. */
  attendFestival: () => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const gate = canAttendFestival(calendar, world.day, world.currentLocation)
    if (!gate.ok || !gate.festival) {
      get().notify({ icon: '🎉', text: gate.why, tone: 'neutral' })
      return false
    }
    const f = gate.festival
    const after = {
      ...calendar,
      attended: [...calendar.attended, `${world.day}:${f.id}`],
      stats: { ...calendar.stats, festivalsAttended: calendar.stats.festivalsAttended + 1 },
    }
    set({ calendar: after })
    const p0 = get().player!
    const rep = FESTIVALS.attend.repFestivals.includes(f.id) ? FESTIVALS.attend.rep : 0
    const spray = attendSprayFor(world.day, f.id)
    set({
      player: {
        ...p0,
        needs: applyNeedsDelta(p0.needs, { mood: FESTIVALS.attend.mood }),
        reputation: Math.max(0, p0.reputation + rep),
        cash: p0.cash + spray,
        transactions: [recordTransaction(`Naira spray — ${f.name}`, 'tip', spray, world.day, absoluteSlot(world.day, world.timeOfDay)), ...p0.transactions].slice(0, LEDGER_CAP),
        stats: { ...p0.stats, totalEarned: p0.stats.totalEarned + spray },
      },
    })
    get().notify({
      icon: f.icon,
      text: rep > 0
        ? `You don attend ${f.name}! The street see you — +${rep} rep, and the crowd spray ${formatNaira(spray)}.`
        : `You don attend ${f.name}! Mood don lift, and the crowd spray ${formatNaira(spray)}.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    get().bumpGoal('festival')
    scheduleAutosave(get)
    return true
  },

  /** Buy a ram at the Kpata ram market — the butcher cuts 6 meat packs. */
  buyRam: () => {
    const { player, world } = get()
    if (!player || !world) return false
    const gate = canBuyRam(world.day, world.currentLocation, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🐏', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gate.price, { label: 'Ram — Sallah', category: 'shop' })) {
      get().notify({ icon: '🐏', text: `The ram na ${formatNaira(gate.price)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: buyRamApply(get().calendar) })
    get().notify({
      icon: '🐏',
      text: `Ram don land — ${FESTIVALS.meatPacksPerRam} meat packs ready. Share am around before the season pass.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Share a meat pack with a paddy — +familiarity, +mood, +rep, once each. */
  shareMeat: (npcId) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const gate = canShareMeat(calendar, world.day, npcId)
    if (!gate.ok) {
      get().notify({ icon: '🍖', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ calendar: shareMeatApply(calendar, world.day, npcId) })
    const rel = player.relationships[npcId]
    const nextFam = Math.min(100, (rel?.familiarity ?? 0) + FESTIVALS.meatShareFamiliarity)
    const p0 = get().player!
    set({
      player: {
        ...p0,
        needs: applyNeedsDelta(p0.needs, { mood: FESTIVALS.meatShareMood }),
        reputation: p0.reputation + FESTIVALS.meatShareRep,
        relationships: {
          ...p0.relationships,
          [npcId]: { familiarity: nextFam, lastChatDay: rel?.lastChatDay ?? 0, lastGiftDay: rel?.lastGiftDay ?? 0, lastHangoutDay: rel?.lastHangoutDay ?? 0 },
        },
      },
    })
    const npcName = NPC_BY_ID[npcId]?.name ?? npcId
    get().notify({
      icon: '🍖',
      text: `Meat don reach ${npcName} hand — blessing dey flow. (+${FESTIVALS.meatShareFamiliarity} familiarity)`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Sponsor a regatta crew — ₦2k on the shoreline, the trophy pays back. */
  sponsorBoat: (teamId) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const gate = canSponsor(calendar, world.day, world.currentLocation, teamId)
    if (!gate.ok) {
      get().notify({ icon: '🚤', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(FESTIVALS.sponsorFee, { label: `Regatta sponsorship — ${teamId}`, category: 'fun' })) {
      get().notify({ icon: '🚤', text: `Sponsorship na ${formatNaira(FESTIVALS.sponsorFee)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: sponsorApply(get().calendar, world.day, teamId) })
    get().notify({
      icon: '🚤',
      text: `You don sponsor ${teamId}! If they carry the trophy, ${formatNaira(FESTIVALS.sponsorWinPayout)} dey wait you.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Back a boat on race-eve — adults only; the bookie settles the morning after. */
  betBoat: (teamId, tier) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    if (!(FESTIVALS.betTiers as readonly number[]).includes(tier)) return false
    // M13 — the family shield reads the CHARACTER's life stage (the honest law)
    const gate = canBet(calendar, world.day, world.currentLocation, player.ageBand)
    if (!gate.ok) {
      get().notify({ icon: '🎲', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(tier, { label: `Regatta bet — ${teamId}`, category: 'fun' })) {
      get().notify({ icon: '🎲', text: `The stake na ${formatNaira(tier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: betApply(get().calendar, world.day, teamId, tier) })
    get().notify({
      icon: '🎲',
      text: `Stake don drop on ${teamId} — if they win, ${formatNaira(Math.round(tier * FESTIVALS.betOdds))} dey wait you tomorrow morning.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Buy the wedding fabric at Kpata — the aunties respect the uniform. */
  buyAsoEbi: () => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    const wedding = weddingForCycle(world.day)
    const gate = canBuyAsoEbi(calendar, world.day, world.currentLocation, wedding)
    if (!gate.ok) {
      get().notify({ icon: '👗', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(FESTIVALS.asoEbiPrice, { label: `Aso-ebi — ${wedding.couple} wedding`, category: 'shop' })) {
      get().notify({ icon: '👗', text: `The fabric na ${formatNaira(FESTIVALS.asoEbiPrice)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ calendar: buyAsoEbiApply(get().calendar, wedding.id) })
    get().notify({
      icon: '👗',
      text: `Aso-ebi don set for ${wedding.couple} wedding — you go shine for the canopy.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Attend today's wedding with a gift — aso-ebi doubles the respect. */
  attendWedding: (giftTier) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    if (!(FESTIVALS.weddingGiftTiers as readonly number[]).includes(giftTier)) return false
    const wedding = weddingForCycle(world.day)
    const gate = canAttendWedding(calendar, world.currentLocation, wedding)
    if (!gate.ok) {
      get().notify({ icon: '💍', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(giftTier, { label: `Wedding gift — ${wedding.couple}`, category: 'fun' })) {
      get().notify({ icon: '💍', text: `The gift na ${formatNaira(giftTier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const hasAsoEbi = calendar.asoEbi.includes(wedding.id)
    const rep = hasAsoEbi ? FESTIVALS.weddingRepAsoEbi : FESTIVALS.weddingRep
    set({ calendar: attendWeddingApply(get().calendar, wedding.id) })
    const p0 = get().player!
    set({
      player: {
        ...p0,
        needs: applyNeedsDelta(p0.needs, { mood: FESTIVALS.weddingMood }),
        reputation: p0.reputation + rep,
      },
    })
    get().notify({
      icon: '💍',
      text: hasAsoEbi
        ? `You don flex the aso-ebi at ${wedding.couple} wedding — the aunties dey nod. (+${rep} rep, mood don high)`
        : `You don attend ${wedding.couple} wedding. Next time buy the aso-ebi — the aunties dey look.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    get().bumpGoal('festival')
    scheduleAutosave(get)
    return true
  },

  /** Give to the town union's paving pool — a smooth road repays everybody. */
  contributePaving: (tier) => {
    const { player, world, calendar } = get()
    if (!player || !world) return false
    if (!(FESTIVALS.pavingTiers as readonly number[]).includes(tier)) return false
    const gate = canContributePaving(calendar, world.day, world.currentLocation)
    if (!gate.ok) {
      get().notify({ icon: '🛣️', text: gate.why, tone: 'neutral' })
      return false
    }
    const zoneName = LOCATION_BY_ID[calendar.paving!.zoneId]?.name ?? calendar.paving!.zoneId
    if (!get().removeMoney(tier, { label: `Street paving fund — ${zoneName}`, category: 'other' })) {
      get().notify({ icon: '🛣️', text: `Contribution na ${formatNaira(tier)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const after = contributePavingApply(get().calendar, world.day, tier)
    set({ calendar: after })
    const need = Math.max(0, FESTIVALS.pavingTarget - after.paving!.pool)
    get().notify({
      icon: '🛣️',
      text: need <= 0
        ? `Pool don complete! The union crew go finish ${zoneName} tomorrow morning.`
        : `You drop ${formatNaira(tier)} — ${formatNaira(need)} more and ${zoneName} road go smooth.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* --------------------- M11 — THE RIVERS AWAKE --------------------- */

  /** The Crusher sells sand on the Patti road — sacks for the walkways. */
  buySand: (sacks) => {
    const { player, world } = get()
    if (!player || !world) return false
    const count = Math.max(1, Math.min(10, Math.floor(sacks)))
    if (world.currentLocation !== RIVERS.sandVendorZone) {
      get().notify({ icon: '⛰️', text: 'The Crusher dey sell sand for the Patti road — go there in person.', tone: 'bad' })
      return false
    }
    const cost = count * RIVERS.sackPrice
    if (!get().removeMoney(cost, { label: `Crusher sand ×${count}`, category: 'shop' })) {
      get().notify({ icon: '💸', text: `${count} sack${count > 1 ? 's' : ''} na ${formatNaira(cost)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const riv = get().rivers
    set({
      rivers: {
        ...riv,
        sandbags: riv.sandbags + count,
        stats: { ...riv.stats, sandBought: riv.stats.sandBought + count },
      },
    })
    get().notify({ icon: '🧱', text: `${count} sack${count > 1 ? 's' : ''} of Crusher sand don land for your compound — the walkway dey wait.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Lay one walkway segment in the cut zone you stand in. */
  laySegment: () => {
    const { player, world, rivers } = get()
    if (!player || !world) return false
    const zoneId = world.currentLocation
    const gate = canLaySegment(rivers, world.day, zoneId, world.currentLocation, rivers.sandbags)
    if (!gate.ok) {
      get().notify({ icon: '🌊', text: gate.why, tone: 'neutral' })
      return false
    }
    if (player.needs.energy < RIVERS.layEnergy) {
      get().notify({ icon: '🥵', text: 'Wading with sand on your head dey chop energy — rest small first.', tone: 'bad' })
      return false
    }
    const p0 = get().player!
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { energy: -RIVERS.layEnergy }) } })
    const after = laySegmentApply(get().rivers, zoneId)
    set({ rivers: after })
    const zoneName = LOCATION_BY_ID[zoneId]?.name ?? zoneId
    if (segmentsLeft(after, zoneId) === 0) {
      get().notify({ icon: '🛤️', text: `THE WALKWAY DEY OPEN! ${zoneName} crossing don complete — set your toll and collect.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().notify({ icon: '🧱', text: `One more segment stand — ${segmentsLeft(after, zoneId)} left for ${zoneName}.`, tone: 'neutral' })
    }
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Set the crossing toll tier on the walkway you stand on. */
  setTollTier: (tierIndex) => {
    const { world, rivers } = get()
    if (!world) return false
    const zoneId = world.currentLocation
    if (!walkwayOpen(rivers, zoneId)) {
      get().notify({ icon: '🛤️', text: 'Finish the walkway first — then the toll bowl dey open.', tone: 'bad' })
      return false
    }
    set({ rivers: setTollTierApply(rivers, zoneId, tierIndex) })
    const tier = RIVERS.tollTiers[Math.min(RIVERS.tollTiers.length - 1, Math.max(0, tierIndex))]
    get().notify({ icon: '🎫', text: `Crossing toll na ${formatNaira(tier)} now — the walkers go pay into your bowl.`, tone: 'good' })
    audio.play('click')
    scheduleAutosave(get)
    return true
  },

  /** Collect the toll bowl of the walkway you stand on. */
  collectTolls: () => {
    const { world, rivers } = get()
    if (!world) return false
    const zoneId = world.currentLocation
    const w = rivers.walkways[zoneId]
    if (!w || w.pot <= 0) {
      get().notify({ icon: '🎫', text: 'The toll bowl dey empty — the crossings go fill am.', tone: 'neutral' })
      return false
    }
    const amount = Math.round(w.pot)
    set({
      rivers: { ...rivers, walkways: { ...rivers.walkways, [zoneId]: { ...w, pot: 0 } }, stats: { ...rivers.stats, tollsCollected: rivers.stats.tollsCollected + amount } },
    })
    get().addMoney(amount, { label: `Crossing tolls — ${LOCATION_BY_ID[zoneId]?.name ?? zoneId} walkway`, category: 'hustle' })
    get().notify({ icon: '💰', text: `You collect ${formatNaira(amount)} from the toll bowl — the walkers dey pay.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Buy the fishermen's canoe at the jetty (unlocks the ferry gigs). */
  buyCanoe: () => {
    const { player, world, rivers } = get()
    if (!player || !world) return false
    if (world.currentLocation !== JETTY_ID) {
      get().notify({ icon: '🛶', text: 'The fishermen dey sell canoes at the Motor Park jetty.', tone: 'bad' })
      return false
    }
    if (rivers.canoe) {
      get().notify({ icon: '🛶', text: 'You already get canoe — one boat, one hustler.', tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(RIVERS.canoeCost, { label: 'Fisherman’s canoe', category: 'shop' })) {
      get().notify({ icon: '💸', text: `The canoe na ${formatNaira(RIVERS.canoeCost)} — the fishermen no dey take credit.`, tone: 'bad' })
      return false
    }
    set({ rivers: { ...rivers, canoe: true } })
    get().notify({ icon: '🛶', text: 'The canoe don land! When the river rise, the ferry board go pay you like a landlord.', tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Ride the canoe ferry across the water (jetty ↔ a cut zone). */
  takeFerry: (toId) => {
    const { player, world } = get()
    if (!player || !world) return
    const from = world.currentLocation
    const destination = LOCATION_BY_ID[toId]
    if (!destination || from === toId) return

    // the water's route law: jetty → a cut zone, or a cut zone → the return jetty
    const goingIn = from === JETTY_ID && zoneCut(world.day, toId)
    const goingOut = zoneCut(world.day, from) && toId === RIVERS.cutReturnId
    if (!goingIn && !goingOut) {
      get().notify({ icon: '🛶', text: zoneCut(world.day, toId) ? 'The canoes dey wait at the Motor Park jetty.' : 'The canoe no dey go there — that road dey dry, waka or ride.', tone: 'neutral' })
      return
    }

    const fare = ferryFareBetween(from, toId, world.day)
    const energyCost = Math.ceil(RIVERS.ferryEnergy / 2)
    if (player.cash < fare) {
      audio.play('notify')
      get().notify({ icon: '💸', text: `The fishermen want ${formatNaira(fare)} for the crossing — water no dey take credit.`, tone: 'bad' })
      return
    }
    if (player.needs.energy < energyCost) {
      get().notify({ icon: '🥵', text: 'You are too tired for the crossing. Rest small.', tone: 'bad' })
      return
    }

    set({ isTravelling: true })
    const applyArrival = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return
      const needs = applySlotDecay(applyNeedsDelta(p.needs, { energy: -energyCost }), 1, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, 1)
      const slot = absoluteSlot(clock.day, clock.timeOfDay)
      const tx = recordTransaction(`Canoe ferry — ${LOCATION_BY_ID[from]?.shortName ?? from} → ${destination.shortName}`, 'transport', -fare, clock.day, slot)
      set({
        player: {
          ...p,
          cash: Math.max(0, p.cash - fare),
          needs,
          transactions: [tx, ...p.transactions].slice(0, LEDGER_CAP),
          stats: { ...p.stats, totalSpent: p.stats.totalSpent + fare },
        },
        world: { ...w, currentLocation: toId, ...clock },
        isTravelling: false,
        offers: [],
      })
      // a crossing can cross midnight — the whole mesh follows the day
      commitCivicDays(get, set, w.day, clock.day)
      get().notify({ icon: '🛶', text: `The canoe land you for ${destination.name} — the water still dey, hold the rail.`, tone: 'neutral' })
      audio.play('notify')
      scheduleAutosave(get)
    }
    setTimeout(applyArrival, TRAVEL.transitionMs)
  },

  /** Run a ferry gig with your own canoe (passengers pay the surge fare). */
  runFerryGig: (gigId) => {
    const { player, world, rivers, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return false
    if (!rivers.canoe) {
      get().notify({ icon: '🛶', text: 'You need your own canoe — the fishermen dey sell at the jetty.', tone: 'bad' })
      return false
    }
    const cut = availableFerryGigs(rivers, world.day, cutZonesFor(world.day))
    const gig = cut.find((g) => g.id === gigId)
    if (!gig) return false
    if (world.currentLocation !== JETTY_ID) {
      get().notify({ icon: '📍', text: 'The passengers dey wait at the Motor Park jetty — the bus go stop there.', tone: 'bad' })
      return false
    }
    if (player.needs.energy < gig.energyCost) {
      get().notify({ icon: '🥵', text: 'You are too tired to paddle a loaded canoe. Rest small first.', tone: 'bad' })
      return false
    }

    const destName = LOCATION_BY_ID[gig.toId]?.name ?? gig.toId
    set({ isWorking: true, workingLabel: `Ferry — crossing to ${destName}` })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return
      get().addMoney(gig.payout, { label: `Ferry run — boatload to ${destName}`, category: 'hustle' })
      const paid = get().player!
      const needs = applySlotDecay(applyNeedsDelta(paid.needs, { energy: -gig.energyCost }), 1, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, 1)
      set({
        player: { ...paid, needs, stats: { ...paid.stats, jobsCompleted: paid.stats.jobsCompleted + 1 } },
        world: { ...w, currentLocation: gig.toId, ...clock },
        rivers: runFerryApply(get().rivers, w.day, gig.id),
        isWorking: false,
        workingLabel: null,
        offers: [],
      })
      const riv = get().rivers
      set({ rivers: { ...riv, stats: { ...riv.stats, ferryEarned: riv.stats.ferryEarned + gig.payout } } })
      get().addXp(FLEET.gigXp)
      get().addSkillXp('hustle', FLEET.gigHustleXp)
      get().notify({ icon: '🛶', text: `Boatload done — the passengers pay ${formatNaira(gig.payout)} at ${destName}. The water dey pay today.`, tone: 'good' })
      get().bumpGoal('gig')
      bumpOnboarding(get, set, 'work')
      commitCivicDays(get, set, w.day, clock.day)
      audio.play('chime')
      haptics.fire('reward')
      scheduleAutosave(get)
    }
    setTimeout(applyDone, WORK.transitionMs)
    return true
  },

  /** Give to the cold-room rescue bowl while standing at the zone. */
  contributeRescue: (tier) => {
    const { player, world, rivers } = get()
    if (!player || !world) return false
    if (!(RIVERS.rescue.tiers as readonly number[]).includes(tier)) return false
    const gate = canContributeRescue(rivers, world.day, world.currentLocation)
    if (!gate.ok) {
      get().notify({ icon: '🧊', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(tier, { label: 'Cold-room rescue bowl', category: 'other' })) {
      get().notify({ icon: '💸', text: `The bowl dey take ${formatNaira(tier)} tiers — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    const after = contributeRescueApply(rivers, world.day, tier)
    set({ rivers: after })
    const need = Math.max(0, RIVERS.rescue.poolTarget - after.rescue!.pool)
    get().notify({
      icon: '🧊',
      text: need <= 0
        ? 'Bowl don full! The rescue trucks go roll tomorrow morning.'
        : `You drop ${formatNaira(tier)} — ${formatNaira(need)} more and the trucks go roll.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* ---------------------- M12 — THE LADDER ---------------------- */

  /** Enroll at FUL: the fee, the level, the semester clock starts tomorrow. */
  enrollFul: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    // M13 — the family shield: FUL na teen/adult road (kids dey primary/secondary)
    if (player.ageBand === 'kid') {
      get().notify({ icon: '🛡️', text: 'University na teen/adult road — your school na the scammer game and the library.', tone: 'neutral' })
      return false
    }
    const gate = canEnroll(education, player.level)
    if (!gate.ok) {
      get().notify({ icon: '🎓', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.education.enrollFee, { label: 'FUL enrollment — semester fee', category: 'other' })) {
      get().notify({ icon: '💸', text: `The enrollment na ${formatNaira(LADDER.education.enrollFee)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ education: enrollApply(education, world.day) })
    get().notify({ icon: '🎓', text: 'You don enroll at FUL! Lectures start tomorrow — the semester clock dey run (18 days, 12 lectures, then the exam).', tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Attend one lecture at FUL: smart XP + the tutorial stipend (+ the Dean's grant at 8). */
  attendLecture: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    const atUniversity = world.currentLocation.startsWith('ful-')
    const gate = canAttendLecture(education, world.day, atUniversity)
    if (!gate.ok) {
      get().notify({ icon: '🎓', text: gate.why, tone: 'neutral' })
      return false
    }
    if (player.needs.energy < 8) {
      get().notify({ icon: '🥵', text: 'You are too tired for the lecture hall. Rest small.', tone: 'bad' })
      return false
    }
    let ed = attendLectureApply(education, world.day)
    const grant = earnsDeansGrant(ed)
    if (grant) ed = grantApply(ed)
    set({ education: ed })
    get().addSkillXp('smart', LADDER.education.lectureSmartXp)
    get().addMoney(LADDER.education.lectureStipend, { label: 'Tutorial stipend — FUL lecture', category: 'hustle' })
    if (grant) {
      get().addMoney(LADDER.education.deansGrant, { label: "Dean's hustle grant — 8 lectures", category: 'tip' })
      get().addReputation(LADDER.education.deansGrantRep)
      get().notify({ icon: '🏅', text: `THE DEAN'S GRANT! ${LADDER.education.deansLectures} lectures don land — ${formatNaira(LADDER.education.deansGrant)} + the street dey respect the book.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().notify({ icon: '📚', text: `Lecture ${ed.lecturesDone}/${LADDER.education.lecturesNeeded} done — smart XP +${LADDER.education.lectureSmartXp}, stipend ${formatNaira(LADDER.education.lectureStipend)}.`, tone: 'good' })
    }
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Sit the semester exam at FUL: the work decides, no dice. */
  sitExam: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    const atUniversity = world.currentLocation.startsWith('ful-')
    const gate = canSitExam(education, world.day, atUniversity)
    if (!gate.ok) {
      get().notify({ icon: '📝', text: gate.why, tone: 'neutral' })
      return false
    }
    const { next, passed, graduatedNow } = examApply(education, world.day, player.skills.smart)
    set({ education: next })
    if (graduatedNow) {
      get().notify({ icon: '🎓', text: `FINAL EXAM PASSED! The convocation holds in ${LADDER.education.convocationInDays} days — the gown dey press.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else if (passed) {
      get().notify({ icon: '✅', text: `Semester ${education.semester} passed (score ${examScore(player.skills.smart, education.lecturesDone).toFixed(1)}) — semester ${next.semester} starts tomorrow.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().notify({ icon: '📕', text: `The exam no pass (score ${examScore(player.skills.smart, education.lecturesDone).toFixed(1)} — you need ${LADDER.education.examPassScore}). The semester repeats — the lectures don reset.`, tone: 'bad' })
    }
    scheduleAutosave(get)
    return true
  },

  /** Collect the certificate at the convocation: the career gates open. */
  attendConvocation: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    const atUniversity = world.currentLocation.startsWith('ful-')
    const gate = canAttendConvocation(education, world.day, atUniversity)
    if (!gate.ok) {
      get().notify({ icon: '🎓', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ education: convocationApply(education) })
    get().addReputation(LADDER.education.graduateRep)
    const p0 = get().player!
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { mood: LADDER.education.graduateMood }) } })
    get().notify({ icon: '🎓', text: `CONVOCATION! The FUL certificate dey your hand — +${LADDER.education.graduateRep} rep, the career desks don open (Civil Servant, Tutorial Assistant).`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Pay the rent book (in person at home free; phone +₦50). */
  payRent: (channel) => {
    const { player, world, housing } = get()
    if (!player || !world) return false
    const gate = canPayRent(housing, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🏠', text: gate.why, tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    if (channel === 'phone' && world.currentLocation !== 'home') {
      get().notify({ icon: '📱', text: 'The rent pays free in person — the phone transfer carries the ₦50 fee.', tone: 'neutral' })
      return false
    }
    if (fee > 0 && player.cash < gate.amount + fee) {
      get().notify({ icon: '💸', text: `The transfer fee na ${formatNaira(fee)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    if (fee > 0 && !get().removeMoney(fee, { label: 'Transfer fee — rent', category: 'bank' })) return false
    set({ housing: payRentApply(housing, gate.amount) })
    get().removeMoney(gate.amount, { label: 'Rent — one cycle', category: 'other' })
    get().notify({ icon: '🏠', text: `Rent don clear — ${formatNaira(gate.amount)} paid, the book moves ${LADDER.housing.rentCycleDays} days forward.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Buy a rung of the housing ladder (the agent visits your sheet). */
  buyProperty: (propertyId) => {
    const { player, housing } = get()
    if (!player) return false
    const gate = canBuyProperty(housing, propertyId, player.level, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🏠', text: gate.why, tone: 'neutral' })
      return false
    }
    const prop = propertyFor(propertyId)!
    if (!get().removeMoney(prop.price, { label: `Property — ${prop.name}`, category: 'shop' })) return false
    set({ housing: buyPropertyApply(housing, propertyId) })
    get().notify({ icon: '🏠', text: `KEYS DON LAND! ${prop.name} na your own — no more rent, comfort +${prop.comfort} on every sleep.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Furnish the owned home: one honest tier at a time. */
  furnishHome: (tier) => {
    const { player, housing } = get()
    if (!player) return false
    const gate = canFurnish(housing, tier)
    if (!gate.ok) {
      get().notify({ icon: '🛋️', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gate.cost, { label: `Furnishing tier ${tier} — ${LADDER.housing.furnishTiers.find((f) => f.tier === tier)?.label ?? ''}`, category: 'shop' })) return false
    set({ housing: furnishApply(housing, tier) })
    const p0 = get().player!
    const def = LADDER.housing.furnishTiers.find((f) => f.tier === tier)
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { mood: 2 }) } })
    get().notify({ icon: '🛋️', text: `${def?.label ?? 'Furnishing'} don land — the house don warm (+${def?.mood ?? 0} comfort).`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Settle the landlord's wahala (the cost buys peace). */
  resolveWahala: () => {
    const { player, housing } = get()
    if (!player) return false
    const gate = canResolveWahala(housing, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🔑', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gate.cost, { label: 'Landlord wahala settlement', category: 'other' })) return false
    set({ housing: resolveWahalaApply(housing) })
    get().notify({ icon: '🤝', text: `Wahala settle — ${formatNaira(gate.cost)} and the compound dey quiet again.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The JAPA gauntlet — request the NIMC slip at the GRA desk. */
  requestNimc: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    // M13 — the JAPA gauntlet is adult paperwork (kids dey grow first)
    if (!canJapa(player.ageBand)) {
      get().notify({ icon: '🛡️', text: 'JAPA na adult road — grow first, the documents go wait.', tone: 'neutral' })
      return false
    }
    const atGrades = world.currentLocation === 'government-area'
    const gate = canRequestNimc(japa, player.level, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🪪', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.nimcFee, { label: 'NIMC enrollment fee', category: 'other' })) {
      get().notify({ icon: '💸', text: `The NIMC fee na ${formatNaira(LADDER.japa.nimcFee)}.`, tone: 'bad' })
      return false
    }
    set({ japa: requestNimcApply(japa, world.day) })
    get().notify({ icon: '🪪', text: `NIMC slip don enter queue — come back in ${LADDER.japa.nimcQueueDays} day(s). The queue no dey forget anybody.`, tone: 'neutral' })
    audio.play('click')
    scheduleAutosave(get)
    return true
  },

  collectNimc: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canCollectNimc(japa, world.day, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🪪', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: collectNimcApply(japa, world.day) })
    get().notify({ icon: '🪪', text: 'NIMC slip dey your hand — step 1 of 5 don land. The passport window dey wait.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The official passport window: 3 days, the full fee, zero drama. */
  requestPassport: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canRequestPassport(japa, player.cash, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '📜', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.passportFee, { label: 'Passport application — official window', category: 'other' })) return false
    set({ japa: requestPassportApply(japa, world.day) })
    get().notify({ icon: '📜', text: `Passport application dey process — ${LADDER.japa.passportQueueDays} days, no drama.`, tone: 'neutral' })
    audio.play('click')
    scheduleAutosave(get)
    return true
  },

  collectPassport: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canCollectPassport(japa, world.day, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '📜', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: collectPassportApply(japa, world.day) })
    get().notify({ icon: '📜', text: 'The green book don land — passport dey your hand! The KGIRS clearance dey next.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The Ganaja street agent: half the fee, sometimes a wash. */
  tryAgent: () => {
    const { player, world, japa, account } = get()
    if (!player || !world) return false
    // M13 — THE FAMILY SHIELD: the street agent is crime-adjacent — kids
    // can't japa at all, teens can't touch the 419 road. 18+ only.
    if (!canJapa(player.ageBand) || !crimeAllowed(player.ageBand, 'japa-agent')) {
      get().notify({ icon: '🛡️', text: CRIME_REFUSALS['japa-agent'], tone: 'neutral' })
      return false
    }
    const atGanaja = world.currentLocation === 'ganaja-junction'
    const gate = canTryAgent(japa, player.cash, atGanaja)
    if (!gate.ok) {
      get().notify({ icon: '🕶️', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.agentFee, { label: 'Agent express passport — Ganaja', category: 'other' })) return false
    const { next, real } = tryAgentApply(japa, world.day, account.handle)
    set({ japa: next })
    if (real) {
      get().notify({ icon: '🕶️', text: 'The agent sabi somebody! The passport don land TODAY — the street go respect the connect.', tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().addReputation(-LADDER.japa.agentRepHit)
      get().notify({ icon: '🚬', text: `NA WASH! The agent don disappear with ${formatNaira(LADDER.japa.agentFee)} — the street don laugh at you (-${LADDER.japa.agentRepHit} rep). The official window dey wait.`, tone: 'bad' })
      audio.play('notify')
    }
    scheduleAutosave(get)
    return true
  },

  /** KGIRS clearance: the taxman's signature reads your record. */
  kgirsClearance: () => {
    const { player, world, japa, civic } = get()
    if (!player || !world || !civic) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canClearKgirs(japa, civic.kgirs.warrant, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🧾', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: clearanceApply(japa, world.day) })
    get().notify({ icon: '🧾', text: 'KGIRS clearance don stamp — the taxman dey shake your hand. The police certificate dey next.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The police character certificate: a clean fine book + the fee. */
  policeCertificate: () => {
    const { player, world, japa, civic } = get()
    if (!player || !world || !civic) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canGetPoliceCertificate(japa, civic.police.fines, player.cash, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '👮', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.policeFee, { label: 'Police character certificate', category: 'other' })) return false
    set({ japa: policeCertificateApply(japa, world.day) })
    get().notify({ icon: '👮', text: 'The character certificate don land — your file complete! The send-off dey wait at the Motor Park.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** THE SEND-OFF: the complete file + the ticket = the Abuja motor loads. */
  takeFlight: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    // M13 — the send-off na adult departure (the shield holds the gate)
    if (!canJapa(player.ageBand)) {
      get().notify({ icon: '🛡️', text: 'The send-off na adult road — grow first, JAPA go wait.', tone: 'neutral' })
      return false
    }
    const atPark = world.currentLocation === 'transport-area'
    const gate = canTakeFlight(japa, player.cash, atPark)
    if (!gate.ok) {
      get().notify({ icon: '✈️', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.ticketFee, { label: 'The Abuja ticket — JAPA send-off', category: 'transport' })) return false
    set({ japa: takeFlightApply(japa, world.day) })
    get().addReputation(LADDER.japa.repReward)
    const p0 = get().player!
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { mood: LADDER.japa.moodReward }) } })
    if (!player.achievements.includes('japa')) {
      set({ player: { ...get().player!, achievements: [...player.achievements, 'japa'] } })
    }
    get().notify({ icon: '✈️', text: `THE SEND-OFF! The whole motor park don spray you — JAPA DON LAND (+${LADDER.japa.repReward} rep). The first remittance go reach tomorrow morning.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** The MOPOL VIP escort: the siren clears your road for two days. */
  runEscort: () => {
    const { player, world, japa, civic } = get()
    if (!player || !world || !civic) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canRunEscort(japa, world.day, civic.kgirs.warrant, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🚨', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: runEscortApply(japa, world.day) })
    get().addMoney(LADDER.mopol.escortPay, { label: 'MOPOL VIP escort detail', category: 'job' })
    get().addReputation(LADDER.mopol.escortRep)
    get().notify({ icon: '🚨', text: `Escort detail done — ${formatNaira(LADDER.mopol.escortPay)} + the siren don clear your road for ${LADDER.mopol.sirenDays} days (journeys ×${LADDER.mopol.sirenMinutesMult}).`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  chatNpc: (npcId) => {
    const { player, world } = get()
    if (!player || !world) return null
    const npc = NPC_BY_ID[npcId]
    if (!npc) return null
    const today = world.day
    const rel = relationshipFor(player.relationships, npcId)
    if (!canChat(rel, today)) {
      get().notify({
        icon: '💬',
        text: `You don talk with ${npc.name} today. Tomorrow another level.`,
        tone: 'neutral',
      })
      return null
    }
    const next = afterChat(rel, today)
    const tier = tierFor(next.familiarity)
    const pool = NPC_CHAT[npcId]
    const firstMeeting = rel.familiarity === 0
    const reply = pool
      ? firstMeeting
        ? pool.stranger[0]
        : pickLine(pool[tier], rel.familiarity, today)
      : npc.bio

    // M6 — a paddy pays back: on a lucky (deterministic) day, a real paddy
    // drops REAL gist — an eligible hustle from THEIR OWN offers, through
    // the SAME opportunity pipeline. Transient: accept now or it goes cold.
    let favorOffer: ActiveOpportunity | undefined
    if (favorRollsToday(next.familiarity, npcId, today)) {
      const slot = absoluteSlot(today, world.timeOfDay)
      const def = Object.values(HUSTLE_BY_ID).find(
        (d) => d.npcId === npcId && isEligible(d, player, slot, player.activeOpportunities),
      )
      if (def) favorOffer = { ...makeOpportunityInstance(def, slot), source: 'gist' }
    }

    set({ player: { ...player, relationships: { ...player.relationships, [npcId]: next } } })
    get().addSkillXp('social', 2)
    get().bumpGoal('chat')
    if (favorOffer) {
      get().notify({ icon: '🤝', text: `${npc.name} get small work for you — check the chat.`, tone: 'good' })
    }
    scheduleAutosave(get)
    return { npcId, tier, familiarity: next.familiarity, reply, firstMeeting, favorOffer }
  },

  /** M13 — KID SOCIALS: the emote road. Same relationship clock, same
   *  cooldown law, same familiarity ledger — but the words are preset
   *  emotes and the replies are preset warmth. No free text, ever. */
  emoteChat: (npcId, emoteId) => {
    const { player, world } = get()
    if (!player || !world) return null
    if (player.ageBand !== 'kid') return null
    const npc = NPC_BY_ID[npcId]
    const emote = SHIELD.kidEmotes.find((e) => e.id === emoteId)
    if (!npc || !emote) return null
    const rel = relationshipFor(player.relationships, npcId)
    if (!canChat(rel, world.day)) {
      get().notify({ icon: '💬', text: `You don greet ${npc.name} today — tomorrow another level.`, tone: 'neutral' })
      return null
    }
    const next = afterChat(rel, world.day)
    next.familiarity = Math.min(100, rel.familiarity + emote.fam)
    const tier = tierFor(next.familiarity)
    set({ player: { ...player, relationships: { ...player.relationships, [npcId]: next } } })
    get().addSkillXp('social', 1)
    get().bumpGoal('chat')
    audio.play('click')
    scheduleAutosave(get)
    return { npcId, tier, familiarity: next.familiarity, reply: emote.reply, firstMeeting: rel.familiarity === 0 }
  },

  /* --------------------- M6 — social depth (gifts / hangout) --------------------- */

  giveGift: (npcId, giftId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const npc = NPC_BY_ID[npcId]
    const gift = giftById(giftId)
    if (!npc || !gift) return false
    const rel = relationshipFor(player.relationships, npcId)
    if (!canGift(rel, world.day)) {
      get().notify({ icon: '🎁', text: `You don give ${npc.name} gift today — no overdo am.`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gift.cost, { label: `Gift — ${gift.label} for ${npc.name}`, category: 'other' })) {
      get().notify({ icon: '🎁', text: `${gift.label} costs ${formatNaira(gift.cost)} — you no carry am.`, tone: 'bad' })
      return false
    }
    const paid = get().player!
    const next = afterGift(rel, gift, world.day)
    const beforeTier = tierFor(rel.familiarity)
    const afterTier = tierFor(next.familiarity)
    set({
      player: {
        ...paid,
        needs: applyNeedsDelta(paid.needs, { mood: SOCIAL.giftMood }),
        relationships: { ...paid.relationships, [npcId]: next },
      },
    })
    get().notify({
      icon: gift.emoji,
      text: `${npc.name} collect the ${gift.label} — familiarity +${gift.familiarity}.${afterTier !== beforeTier ? ` You two na ${TIER_META[afterTier].label} now!` : ''}`,
      tone: 'good',
    })
    get().bumpGoal('gift')
    audio.play(afterTier !== beforeTier ? 'levelup' : 'chime')
    scheduleAutosave(get)
    return true
  },

  hangout: (npcId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const npc = NPC_BY_ID[npcId]
    if (!npc) return false
    const rel = relationshipFor(player.relationships, npcId)
    if (!(SOCIAL.hangout.slots as readonly string[]).includes(world.timeOfDay)) {
      get().notify({ icon: '🌙', text: 'Hangout na after-work something — evening or night.', tone: 'neutral' })
      return false
    }
    if (!canHangout(rel, world.day)) {
      get().notify({ icon: '🍻', text: `You and ${npc.name} just hang out — give am small space (every ${SOCIAL.hangout.cooldownDays} days).`, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(SOCIAL.hangout.cost, { label: `Night out with ${npc.name}`, category: 'fun' })) {
      get().notify({ icon: '🍻', text: `Pulling ${npc.name} out costs ${formatNaira(SOCIAL.hangout.cost)} — you no reach.`, tone: 'bad' })
      return false
    }
    const paid = get().player!
    const next = afterHangout(rel, world.day)
    set({
      player: {
        ...paid,
        needs: applyNeedsDelta(applySlotDecay(paid.needs, 1, get().settings.chill ? CHILL.decayMult : 1), { mood: SOCIAL.hangout.mood }),
        relationships: { ...paid.relationships, [npcId]: next },
      },
      world: { ...world, ...advanceWorldClock(world.timeOfDay, world.day, world.weather, 1) },
    })
    get().notify({
      icon: '🍻',
      text: `You and ${npc.name} catch evening together — mood +${SOCIAL.hangout.mood}, familiarity +${SOCIAL.hangout.familiarity}.`,
      tone: 'good',
    })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Accept a paddy's favour — the acceptOffer guards (hands-full, duplicate)
   *  apply exactly; only the transport differs (chat hands the instance over). */
  acceptFavorOffer: (offer) => {
    const { player } = get()
    if (!player) return
    if (player.activeOpportunities.length >= HUSTLE.maxActive) {
      audio.play('notify')
      get().notify({
        icon: '🎒',
        text: `Your hands are full — finish or drop something first (max ${HUSTLE.maxActive}).`,
        tone: 'bad',
      })
      return
    }
    if (player.activeOpportunities.some((o) => o.defId === offer.defId)) {
      audio.play('notify')
      get().notify({ icon: '🤔', text: 'You already took this one.', tone: 'bad' })
      return
    }
    set({ player: { ...player, activeOpportunities: [...player.activeOpportunities, offer] } })
    audio.play('click')
    get().notify({ icon: '🤝', text: 'Favour accepted — it goes cold if you wait too long!', tone: 'good' })
    scheduleAutosave(get)
  },

  settleDrive: (meters) => {
    const { player } = get()
    if (!player || meters <= 0) return
    const cost = Math.min(4, (meters / 1000) * WORLD3D.driveEnergyPerKm)
    if (cost < 0.5) return
    const needs = applyNeedsDelta(player.needs, { energy: -Math.round(cost * 10) / 10 })
    set({ player: { ...player, needs } })
    scheduleAutosave(get)
  },

  /** Stage 4 — the eating loop. A meal costs REAL cash (ledger entry), fills
   *  hunger, lifts mood, tops a little energy, and the clock moves one slot
   *  (eating takes time). Same authority pattern as rest/travel.
   *  M6 — night dishes are the night market's alone: right stall, after dark,
   *  priced by the seeded night discount — refused honestly otherwise. */
  eatMeal: (mealKey, atLocationId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const meal = MEAL_BY_KEY[mealKey]
    if (!meal) return false
    const spot = atLocationId ?? world.currentLocation
    if (meal.night && !mealAvailableAt(true, spot, world.timeOfDay)) {
      get().notify({
        icon: '🌙',
        text: isNightMarketOpen(world.timeOfDay)
          ? `${meal.label} na night-market food — e dey the Food Strip.`
          : `${meal.label} dey wake after dark — the night market no open yet.`,
        tone: 'neutral',
      })
      return false
    }
    // M2 — markets breathe: today's honest price at this spot (base outside markets)
    let civic = get().civic ?? freshCivicState()
    const rolled = marketForDay(civic, world.day, world.weather)
    if (rolled !== civic) {
      civic = rolled
      set({ civic })
    }
    const price = meal.night
      ? nightMealPrice(meal.price, world.day)
      : marketMealPrice(meal.price, mealKey, spot, civic, world.day)
    if (!canAfford(player.cash, price)) {
      get().notify({
        icon: '🍲',
        text: `${meal.label} costs ${formatNaira(price)}${price !== meal.price ? ' today' : ''} — you no carry enough cash.`,
        tone: 'bad',
      })
      return false
    }
    // ledger label: eaten there, or delivered to where you actually are
    const spotName = LOCATION_BY_ID[spot]?.name ?? 'Lokoja'
    const delivered = atLocationId !== undefined && atLocationId !== world.currentLocation
    const label = delivered
      ? `${meal.label} — delivery to ${LOCATION_BY_ID[world.currentLocation]?.name ?? 'home'}`
      : `${meal.label} at ${spotName}`
    // pay first — the ledger remembers every plate
    const ok = get().removeMoney(price, {
      label,
      category: 'shop',
    })
    if (!ok) return false
    // re-read AFTER payment — removeMoney already updated the player object
    const paid = get().player
    if (!paid) return false
    const needs = applySlotDecay(applyNeedsDelta(paid.needs, {
      hunger: meal.hunger,
      mood: meal.mood + (isIftarHour(world.day, world.timeOfDay) ? FESTIVALS.iftarMood : 0),
      energy: meal.energy,
    }), 1, get().settings.chill ? CHILL.decayMult : 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...paid, needs }, world: { ...world, ...clock } })
    get().notify({
      icon: '🍲',
      text: isIftarHour(world.day, world.timeOfDay)
        ? `${meal.label} — iftar blessing! The fast don break proper.`
        : `${meal.label} — hunger restored. You feel better.`,
      tone: 'good',
    })
    get().bumpGoal('meal')
    bumpOnboarding(get, set, 'meal')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /* ------------------------------- travel ------------------------------- */

  travel: (destinationId, transportId) => {
    const { player, world, isTravelling } = get()
    if (!player || !world || isTravelling) return

    const origin = LOCATION_BY_ID[world.currentLocation]
    const destination = LOCATION_BY_ID[destinationId]
    if (!origin || !destination || origin.id === destination.id) return

    // --- guards (all feedback through notifications, never silent) ---
    if (player.level < destination.unlockLevel) {
      audio.play('notify')
      get().notify({
        icon: '🔒',
        text: `${destination.name} unlocks at Level ${destination.unlockLevel}.`,
        tone: 'bad',
      })
      return
    }
    // M6 — THE FLOOD LAW: a flood day closes the riverfront. Nobody wades
    // into the Confluence while the Niger owns it.
    if (weatherBlocksLocation(world.weather, destinationId)) {
      audio.play('notify')
      get().notify({
        icon: '🌊',
        text: `Flood don close ${destination.name} — the water don take the riverfront. Try tomorrow.`,
        tone: 'bad',
      })
      return
    }
    // M11 — THE RIVER LAW: the water owns the low ground. Land transport
    // refuses a cut zone in EITHER direction; a finished sandbag walkway
    // carries pedestrians only (slow, careful steps), and the canoe ferry
    // is its own action — the water never quotes the land sheets' fares.
    if (zoneCut(world.day, destinationId) && !(transportId === 'walk' && walkwayOpen(get().rivers, destinationId))) {
      audio.play('notify')
      get().notify({
        icon: '🌊',
        text: `The river don take ${destination.name} — the road dey under water. Canoe ferry dey run from the Motor Park.`,
        tone: 'bad',
      })
      return
    }
    if (zoneCut(world.day, origin.id) && !(transportId === 'walk' && walkwayOpen(get().rivers, origin.id))) {
      audio.play('notify')
      get().notify({
        icon: '🌊',
        text: `The water don lock ${origin.name} in — you go need the canoe ferry or the sandbag walkway.`,
        tone: 'bad',
      })
      return
    }
    // M4 — personal transport: the ride must be IN the garage first
    const ownModel = personalModelOf(transportId)
    if (ownModel && !player.vehicles.some((v) => v.model === ownModel)) {
      audio.play('notify')
      get().notify({
        icon: '🔑',
        text: `You no own that ride yet — the Motor Park sells them.`,
        tone: 'bad',
      })
      return
    }
    // the ONE offer law: location data for public modes, ownership + road
    // access for personal modes (a danfo cannot follow a keke trail)
    if (!transportAllowed(destination, transportId, player.vehicles)) return

    // M9 — THE GUEST LOOP: the gate stands before forward travel. Linked
    // accounts and the starter trio ride free; anywhere else asks for a name
    // (with an honest one-day grace when they ask for it).
    const verdict = gateVerdict(get().account, destinationId, world.day)
    if (verdict.blocked) {
      set({ gateOpen: true })
      audio.play('notify')
      return
    }

    // pure calculation — same inputs always give the same plan
    // M8 — the pump surges on scarcity days (personal rides pay black-market)
    // M10 — a paved destination rides the union's smooth road (minutes ×0.85)
    // M11 — a walkway crossing rides slow and careful (minutes ×1.35, walk only)
    const plan = calculateTravel(
      origin,
      destination,
      transportId,
      world.weather,
      world.timeOfDay,
      fuelMultFor(world.day),
      pavedMinutesMult(get().calendar, world.day, destinationId) *
        (transportId === 'walk' && zoneCut(world.day, destinationId) && walkwayOpen(get().rivers, destinationId) ? RIVERS.walkwayMinutesMult : 1) *
        sirenMinutesMult(get().japa, world.day),
    )
    const event = rollTravelEvent(transportId, world.weather)

    if (player.cash < plan.cost) {
      audio.play('notify')
      get().notify({
        icon: '💸',
        text: `The fare is ${formatNaira(plan.cost)} — you no get am.`,
        tone: 'bad',
      })
      return
    }
    if (player.needs.energy < plan.energyCost) {
      audio.play('notify')
      get().notify({
        icon: '🥵',
        text: 'You are too tired for that journey. Rest first.',
        tone: 'bad',
      })
      return
    }

    // travelling state drives the 📍 HUD + map transition
    set({ isTravelling: true })

    // apply the completed trip on the EXISTING clock through proper systems
    const applyArrival = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      const cash = Math.max(0, p.cash - plan.cost + (event?.cashDelta ?? 0))
      const needs = applySlotDecay(applyNeedsDelta(p.needs, {
        energy: -(plan.energyCost + (event?.energyDelta ?? 0)),
        mood: event?.moodDelta ?? 0,
      }), plan.slots, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, plan.slots)

      // Stage 3: record the fare (and any event tip) in the player's ledger
      const arrivalSlot = absoluteSlot(clock.day, clock.timeOfDay)
      const txs: Transaction[] = []
      if (plan.cost > 0) {
        txs.push(
          recordTransaction(
            ownModel
              ? `Fuel — ${VEHICLE_BY_MODEL[ownModel].short} to ${destination.name}`
              : `Fare to ${destination.name}`,
            'transport',
            -plan.cost,
            clock.day,
            arrivalSlot,
          ),
        )
      }
      if (event?.cashDelta && event.cashDelta > 0) {
        txs.push(recordTransaction(event.title, 'tip', event.cashDelta, clock.day, arrivalSlot))
      }
      const stats = {
        ...p.stats,
        totalEarned:
          p.stats.totalEarned + (event?.cashDelta && event.cashDelta > 0 ? event.cashDelta : 0),
        totalSpent: p.stats.totalSpent + plan.cost,
      }

      set({
        player: {
          ...p,
          cash,
          needs,
          transactions: [...txs, ...p.transactions].slice(0, LEDGER_CAP),
          stats,
        },
        world: { ...w, currentLocation: destination.id, ...clock },
        isTravelling: false,
        offers: [], // left the area — unclaimed gist goes cold
      })

      // M2 — a trip can cross midnight; the civic mesh follows the day
      commitCivicDays(get, set, w.day, clock.day)

      // M9 — the journey lands on the daily goals + the onboarding arc
      get().bumpGoal('travel')
      bumpOnboarding(get, set, 'travel')

      // arrival feedback: destination + a compact time/money/energy summary
      get().notify({
        icon: destination.emoji,
        text: `You arrived at ${destination.name}.`,
        tone: 'neutral',
      })
      get().notify({
        icon: '🧾',
        text: `${formatNaira(cash)} • ⚡ ${Math.round(needs.energy)}`,
        tone: 'neutral',
      })
      if (event) {
        get().notify({ icon: event.icon, text: event.description, tone: event.tone })
        if (event.xpDelta && event.xpDelta > 0) get().addXp(event.xpDelta)
      }
      audio.play('notify')
      scheduleAutosave(get)
    }

    setTimeout(applyArrival, TRAVEL.transitionMs)
  },

  /* ------------------------ work & opportunities ------------------------ */

  addMoney: (amount, meta) => {
    const { player, world, fortress } = get()
    if (!player || !world || amount <= 0) return
    const slot = absoluteSlot(world.day, world.timeOfDay)

    // M14 — THE VELOCITY GUARD: no flood of micro-events in one clock slot
    const inSlot = fortress.slotTxSlot === slot ? fortress.slotTxCount : 0
    const vel = velocityGuard(inSlot, FORTRESS.velocityCap)
    if (!vel.allow) {
      set({ fortress: { ...fortress, anomalies: fortress.anomalies + 1, slotTxSlot: slot, slotTxCount: inSlot } })
      get().notify({ icon: '🛡️', text: 'The fortress shut the flood gate — too many money events in one slot.', tone: 'bad' })
      audio.play('notify')
      return
    }

    // M14 — THE INCOME GUARD: ceilings, not crashes; the overflow is clamped + counted
    const dayEarned = fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0
    const guard = incomeGuard(amount, dayEarned, FORTRESS)
    const paid = guard.allowed
    if (guard.clamped) {
      set({ fortress: { ...get().fortress, anomalies: get().fortress.anomalies + 1 } })
      get().notify({ icon: '🛡️', text: `The fortress clamped an impossible income to ${formatNaira(paid)} (${guard.law === 'single' ? 'single-event' : 'day'} ceiling).`, tone: 'bad' })
      audio.play('notify')
      if (paid <= 0) return
    }

    // M14 — THE KOBO-CHAIN: the entry signs onto the ledger's chain
    const sig = chainNext(get().fortress.chainTail, { day: world.day, slot, amount: paid, category: meta.category, label: meta.label })
    const tx = { ...recordTransaction(meta.label, meta.category, paid, world.day, slot), sig }
    set({
      player: {
        ...player,
        cash: player.cash + paid,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
        stats: { ...player.stats, totalEarned: player.stats.totalEarned + paid },
      },
      // the fortress ledgers ride along (day earnings + the slot flood counter + the chain tail)
      fortress: { ...get().fortress, dayEarnedDay: world.day, dayEarned: (fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0) + paid, slotTxSlot: slot, slotTxCount: inSlot + 1, chainTail: sig },
      // M9 — juice: every honest naira pops (transform/opacity only)
      pulse: { id: ++pulseId, amount: paid },
    })
    // M9 — the first ₦500 earned completes the onboarding 'earn' step
    if (get().player!.stats.totalEarned >= 500) bumpOnboarding(get, set, 'earn')
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
  },

  removeMoney: (amount, meta) => {
    const { player, world, fortress } = get()
    if (!player || !world || amount <= 0) return false
    if (!canAfford(player.cash, amount)) {
      get().notify({ icon: '💸', text: 'You no get that kind money.', tone: 'bad' })
      return false
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    // M14 — the velocity guard rides spending too (the flood gate is symmetric)
    const inSlot = fortress.slotTxSlot === slot ? fortress.slotTxCount : 0
    if (!velocityGuard(inSlot, FORTRESS.velocityCap).allow) {
      set({ fortress: { ...fortress, anomalies: fortress.anomalies + 1, slotTxSlot: slot, slotTxCount: inSlot } })
      get().notify({ icon: '🛡️', text: 'The fortress shut the flood gate — too many money events in one slot.', tone: 'bad' })
      return false
    }
    // M14 — the kobo-chain signs the spend too (a full ledger, not a half one)
    const sig = chainNext(fortress.chainTail, { day: world.day, slot, amount: -amount, category: meta.category, label: meta.label })
    const tx = { ...recordTransaction(meta.label, meta.category, -amount, world.day, slot), sig }
    set({
      player: {
        ...player,
        cash: player.cash - amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
        stats: { ...player.stats, totalSpent: player.stats.totalSpent + amount },
      },
      fortress: { ...fortress, slotTxSlot: slot, slotTxCount: inSlot + 1, chainTail: sig },
    })
    audio.play('notify')
    scheduleAutosave(get)
    return true
  },

  /**
   * Apply a full reward bundle (cash + xp + skill xp + reputation) through
   * the proper engine actions, with ONE ledger entry for the cash part.
   * Jobs, hustles, events and future systems all pay through here.
   */
  giveReward: (reward, meta) => {
    const { player, world, fortress } = get()
    if (!player || !world) return

    // 1) cash + ledger entry — M14: the SAME income guard + kobo-chain every payout rides
    const cash = rewardCash(reward)
    if (cash > 0) {
      const slot = absoluteSlot(world.day, world.timeOfDay)
      const dayEarned = fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0
      const guard = incomeGuard(cash, dayEarned, FORTRESS)
      const paid = guard.allowed
      if (guard.clamped) {
        set({ fortress: { ...fortress, anomalies: fortress.anomalies + 1 } })
        get().notify({ icon: '🛡️', text: `The fortress clamped an impossible income to ${formatNaira(paid)} (${guard.law === 'single' ? 'single-event' : 'day'} ceiling).`, tone: 'bad' })
      }
      if (paid > 0) {
        const sig = chainNext(fortress.chainTail, { day: world.day, slot, amount: paid, category: meta.category, label: meta.label })
        const tx = { ...recordTransaction(meta.label, meta.category, paid, world.day, slot), sig }
        set({
          player: {
            ...player,
            cash: player.cash + paid,
            transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
            stats: { ...player.stats, totalEarned: player.stats.totalEarned + paid },
          },
          fortress: { ...fortress, dayEarnedDay: world.day, dayEarned: dayEarned + paid, slotTxSlot: slot, slotTxCount: (fortress.slotTxSlot === slot ? fortress.slotTxCount : 0) + 1, chainTail: sig },
          pulse: { id: ++pulseId, amount: paid },
        })
        audio.play('chime')
        haptics.fire('reward')
        if (get().player!.stats.totalEarned >= 500) bumpOnboarding(get, set, 'earn')
      }
    }

    // 2) player XP (level-ups handled by the existing engine action)
    if (reward.xp && reward.xp > 0) get().addXp(reward.xp)

    // 3) skill XP
    for (const [skill, amount] of Object.entries(reward.skillXp ?? {})) {
      if (amount && amount > 0) get().addSkillXp(skill as SkillId, amount)
    }

    // 4) reputation
    if (reward.reputation && reward.reputation !== 0) get().addReputation(reward.reputation)

    // 5) one compact summary toast
    const summary = describeReward(reward)
    if (summary) get().notify({ icon: '🧾', text: summary, tone: 'good' })

    scheduleAutosave(get)
  },

  addSkillXp: (skill, amount) => {
    const { player } = get()
    if (!player || amount <= 0) return
    const result = applySkillXp(player.skillXp, player.skills, player.level, skill, amount)
    set({ player: { ...player, skillXp: result.skillXp, skills: result.skills } })
    if (result.leveledUp) {
      audio.play('chime')
      haptics.fire('reward')
      get().notify({
        icon: SKILL_META[skill].emoji,
        text: `${SKILL_META[skill].label} is now Level ${result.newLevel}!`,
        tone: 'good',
      })
    }
  },

  /** Work a formal job shift — reliable pay, real time + energy cost. */
  workShift: (jobId) => {
    const { player, world, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return

    const job = JOB_BY_ID[jobId]
    if (!job) return

    // --- guards: location, requirements, cooldown, energy ---
    if (world.currentLocation !== job.locationId) {
      const loc = LOCATION_BY_ID[job.locationId]
      get().notify({
        icon: '📍',
        text: `This shift is at ${loc?.name ?? 'another part of Lokoja'}.`,
        tone: 'bad',
      })
      return
    }
    // M12 — the career gate reads the FUL certificate from the live slice
    const req = checkRequirements(player, job.requirements, { graduated: get().education.graduated && get().education.convocationAttended })
    if (!req.ok) {
      audio.play('notify')
      get().notify({ icon: '🔒', text: req.reasons[0], tone: 'bad' })
      return
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    const cd = cooldownRemaining(player.cooldowns, job.id, slot)
    if (cd > 0) {
      audio.play('notify')
      get().notify({
        icon: '⏳',
        text: `${job.name} needs a breather — ready in ${cd} time slot${cd > 1 ? 's' : ''}.`,
        tone: 'bad',
      })
      return
    }
    if (player.needs.energy < job.energyCost) {
      audio.play('notify')
      get().notify({ icon: '🥵', text: 'You are too tired for this shift. Rest first.', tone: 'bad' })
      return
    }

    const result = resolveJob(job, player)
    set({ isWorking: true, workingLabel: job.name })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      const needs = applySlotDecay(applyNeedsDelta(p.needs, { energy: -job.energyCost }), job.timeSlots, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, job.timeSlots)
      const afterSlot = absoluteSlot(clock.day, clock.timeOfDay)
      const cooldownSlots = job.cooldownSlots ?? WORK.defaultCooldownSlots

      set({
        player: {
          ...p,
          needs,
          cooldowns: { ...p.cooldowns, [job.id]: afterSlot + cooldownSlots },
          stats: { ...p.stats, jobsCompleted: p.stats.jobsCompleted + 1 },
        },
        world: { ...w, ...clock },
        isWorking: false,
        workingLabel: null,
      })
      // M12 — the uniform builds the MOPOL trust ledger
      if (job.id === 'police-recruit') {
        set({ japa: { ...get().japa, policeShifts: get().japa.policeShifts + 1 } })
      }

      get().notify({
        icon: result.outcome === 'great' ? '🌟' : '💼',
        text: result.headline,
        tone: 'good',
      })
      get().giveReward(result.reward, { label: job.name, category: 'job' })
      get().bumpGoal('job')
      bumpOnboarding(get, set, 'work')
      if (result.outcome === 'great') audio.play('levelup')
    haptics.fire('levelup')
      scheduleAutosave(get)
    }

    setTimeout(applyDone, WORK.transitionMs)
  },

  /** Look around the current area for personal hustles (gist). */
  searchHustles: () => {
    const { player, world } = get()
    if (!player || !world) return

    const slot = absoluteSlot(world.day, world.timeOfDay)
    if (cooldownRemaining(player.cooldowns, 'hustle-search', slot) > 0) {
      audio.play('notify')
      get().notify({ icon: '⏳', text: 'You just checked around. Give the streets a moment.', tone: 'bad' })
      return
    }

    const generation = generateHustleOffers(world.currentLocation, player, slot)
    set({
      player: {
        ...player,
        cooldowns: { ...player.cooldowns, 'hustle-search': slot + HUSTLE.searchCooldownSlots },
      },
      offers: generation.offers,
    })

    if (generation.dry) {
      audio.play('notify')
      get().notify({ icon: '👀', text: 'You looked around but nothing came up this time.', tone: 'neutral' })
    } else {
      audio.play('notify')
      get().notify({
        icon: '🗣️',
        text: `Fresh gist! ${generation.offers.length} offer${generation.offers.length > 1 ? 's' : ''} came up.`,
        tone: 'good',
      })
    }
    scheduleAutosave(get)
  },

  /** Accept a hustle offer — it joins the player's active opportunities. */
  acceptOffer: (instanceId) => {
    const { player, offers } = get()
    if (!player) return
    const offer = offers.find((o) => o.instanceId === instanceId)
    if (!offer) return

    if (player.activeOpportunities.length >= HUSTLE.maxActive) {
      audio.play('notify')
      get().notify({
        icon: '🎒',
        text: `Your hands are full — finish or drop something first (max ${HUSTLE.maxActive}).`,
        tone: 'bad',
      })
      return
    }
    if (player.activeOpportunities.some((o) => o.defId === offer.defId)) {
      audio.play('notify')
      get().notify({ icon: '🤔', text: 'You already took this one.', tone: 'bad' })
      return
    }

    set({
      player: { ...player, activeOpportunities: [...player.activeOpportunities, offer] },
      offers: offers.filter((o) => o.instanceId !== instanceId),
    })
    audio.play('click')
    get().notify({ icon: '🤝', text: 'Offer accepted — it goes cold if you wait too long!', tone: 'good' })
    scheduleAutosave(get)
  },

  declineOffer: (instanceId) => {
    const { offers } = get()
    const offer = offers.find((o) => o.instanceId === instanceId)
    if (!offer) return
    set({ offers: offers.filter((o) => o.instanceId !== instanceId) })
    audio.play('click')
    get().notify({ icon: '🚶', text: 'You declined. No wahala.', tone: 'neutral' })
  },

  /** Do an accepted hustle at its real location — outcome rolls in work.ts. */
  completeOpportunity: (instanceId) => {
    const { player, world, isWorking, isTravelling } = get()
    if (!player || !world || isWorking || isTravelling) return

    const instance = player.activeOpportunities.find((o) => o.instanceId === instanceId)
    if (!instance) return
    const def = hustleDefFor(instance)
    if (!def) {
      // data changed between versions — drop the orphan quietly but honestly
      set({
        player: {
          ...player,
          activeOpportunities: player.activeOpportunities.filter((o) => o.instanceId !== instanceId),
        },
      })
      return
    }

    if (world.currentLocation !== instance.locationId) {
      const loc = LOCATION_BY_ID[instance.locationId]
      audio.play('notify')
      get().notify({
        icon: '📍',
        text: `This hustle is at ${loc?.name ?? 'another part of Lokoja'}.`,
        tone: 'bad',
      })
      return
    }
    if (player.needs.energy < def.energyCost) {
      audio.play('notify')
      get().notify({ icon: '🥵', text: 'Too tired for this hustle. Rest small first.', tone: 'bad' })
      return
    }

    const result = resolveOpportunity(instance, player)
    if (!result) return
    set({ isWorking: true, workingLabel: def.title })

    const applyDone = () => {
      const { player: p, world: w } = get()
      if (!p || !w) return

      const needs = applySlotDecay(applyNeedsDelta(p.needs, {
        energy: -def.energyCost,
        mood: result.outcome === 'fail' ? WORK.fail.moodDelta : 0,
      }), def.timeSlots, get().settings.chill ? CHILL.decayMult : 1)
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, def.timeSlots)
      const afterSlot = absoluteSlot(clock.day, clock.timeOfDay)

      set({
        player: {
          ...p,
          needs,
          cooldowns: { ...p.cooldowns, [def.id]: afterSlot + def.cooldownSlots },
          activeOpportunities: p.activeOpportunities.filter((o) => o.instanceId !== instanceId),
          stats: { ...p.stats, hustlesCompleted: p.stats.hustlesCompleted + 1 },
        },
        world: { ...w, ...clock },
        isWorking: false,
        workingLabel: null,
      })

      get().notify({
        icon: result.outcome === 'great' ? '🌟' : result.outcome === 'fail' ? '😐' : '🤝',
        text: result.headline,
        tone: result.outcome === 'fail' ? 'bad' : 'good',
      })
      get().giveReward(result.reward, { label: def.title, category: 'hustle' })
      get().bumpGoal('hustle')
      bumpOnboarding(get, set, 'work')
      audio.play(result.outcome === 'fail' ? 'notify' : result.outcome === 'great' ? 'levelup' : 'chime')
      scheduleAutosave(get)
    }

    setTimeout(applyDone, WORK.transitionMs)
  },

  dropOpportunity: (instanceId) => {
    const { player } = get()
    if (!player) return
    const dropped = player.activeOpportunities.find((o) => o.instanceId === instanceId)
    if (!dropped) return
    const def = hustleDefFor(dropped)
    set({
      player: {
        ...player,
        activeOpportunities: player.activeOpportunities.filter((o) => o.instanceId !== instanceId),
      },
    })
    audio.play('click')
    get().notify({ icon: '🚶', text: `You dropped “${def?.title ?? 'the offer'}”.`, tone: 'neutral' })
    scheduleAutosave(get)
  },

  /** Lazily remove expired offers — the Work screen calls this on mount. */
  pruneExpired: () => {
    const { player, world, offers } = get()
    if (!player || !world) return
    const slot = absoluteSlot(world.day, world.timeOfDay)

    const { kept, expired } = pruneExpiredOpportunities(player.activeOpportunities, slot)
    const keptOffers = offers.filter((o) => o.expiresAtSlot > slot)

    if (kept.length === player.activeOpportunities.length && keptOffers.length === offers.length) {
      return
    }

    set({ player: { ...player, activeOpportunities: kept }, offers: keptOffers })
    for (const o of expired) {
      const def = hustleDefFor(o)
      get().notify({ icon: '⌛', text: `“${def?.title ?? 'An offer'}” went cold.`, tone: 'neutral' })
    }
    scheduleAutosave(get)
  },

  /* -------------------------- engine actions ---------------------------- */

  addCash: (amount) => {
    const { player } = get()
    if (!player || amount === 0) return
    set({ player: { ...player, cash: Math.max(0, player.cash + amount) } })
    if (amount > 0) audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
  },

  addXp: (amount) => {
    const { player } = get()
    if (!player || amount <= 0) return
    const result = processXp(player.xp, player.level, amount)
    set({ player: { ...player, xp: result.xp, level: result.level } })
    if (result.leveledUp) {
      set({ shockwave: get().shockwave + 1 })
      audio.play('levelup')
      haptics.fire('levelup')
      get().notify({
        icon: '🎉',
        text: `Level up! You are now Level ${result.level}.`,
        tone: 'good',
      })
    }
    scheduleAutosave(get)
  },

  addReputation: (amount) => {
    const { player } = get()
    if (!player || amount === 0) return
    set({ player: { ...player, reputation: Math.max(0, player.reputation + amount) } })
    scheduleAutosave(get)
  },

  /* --------------------------- settings/save ---------------------------- */

  toggleSound: () => {
    const settings = { ...get().settings, sound: !get().settings.sound }
    syncAudioWithSettings(settings)
    set({ settings })
    // the debounced autosave only runs inside a live game — on the menu, patch the save directly
    if (get().player) scheduleAutosave(get)
    else SaveSystem.patchSettings(settings)
  },

  setGraphics: (q) => {
    const settings = { ...get().settings, graphics: q }
    refreshDeviceProfile(q) // the session profile re-resolves against the pick
    set({ settings })
    // M7: a pick made on the MAIN MENU must survive — autosave is dormant there
    if (get().player) scheduleAutosave(get)
    else SaveSystem.patchSettings(settings)
  },

  /** M9 — one life event lands on today's goals; completions pay the engines. */
  bumpGoal: (kind) => {
    const { player, world, goals } = get()
    if (!player || !world) return
    const res = bumpGoal(goals, kind, world.day)
    if (res.completed.length === 0) {
      if (res.next !== goals) set({ goals: res.next })
      return
    }
    set({ goals: res.next })
    for (const g of res.completed) {
      get().addMoney(g.cash, { label: `Daily goal — ${g.label}`, category: 'tip' })
      get().addXp(g.xp)
      get().notify({ icon: '🎯', text: `Goal complete — ${g.label} (+${formatNaira(g.cash)})`, tone: 'good' })
    }
    if (res.perfectDay) {
      get().notify({ icon: '🔥', text: `PERFECT DAY! Goal streak don reach ${res.next.streak}.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    }
    scheduleAutosave(get)
  },

  /** M9 — Chill Mode: a gentler Lokoja, persisted like every setting. */
  setChill: (chill) => {
    const settings = { ...get().settings, chill }
    set({ settings })
    if (get().player) scheduleAutosave(get)
    else SaveSystem.patchSettings(settings)
  },

  /** M13 — Elder mode: large text, high contrast, reduced motion, slow pacing. */
  setElder: (elder) => {
    const settings = { ...get().settings, elder }
    set({ settings })
    if (get().player) scheduleAutosave(get)
    else SaveSystem.patchSettings(settings)
    get().notify({ icon: elder ? '🔍' : '👓', text: elder ? 'Elder mode on — bigger text, kinder streets.' : 'Elder mode off.', tone: 'neutral' })
  },

  /** M19 — the soundtrack toggle: music rides the master sound switch too. */
  setMusic: (on) => {
    const settings = { ...get().settings, music: on }
    music.setEnabled(settings.sound && on)
    set({ settings })
    if (get().player) scheduleAutosave(get)
    else SaveSystem.patchSettings(settings)
  },

  /** M19 — haptics toggle; elder mode keeps the phone still regardless. */
  setHaptics: (on) => {
    const settings = { ...get().settings, haptics: on }
    haptics.setEnabled(on)
    set({ settings })
    if (get().player) scheduleAutosave(get)
    else SaveSystem.patchSettings(settings)
  },

  /* --------------------------- M19 — the wardrobe --------------------------- */

  /** THE SHOP DOOR: the law verdicts first, the wallet pays second. */
  wardrobeBuy: (kind, itemKey) => {
    const { player, wardrobe } = get()
    if (!player) return { ok: false, why: 'Start a life first.' }
    const v = shopBuy(wardrobe, kind, itemKey)
    if (!v.ok) return { ok: false, why: v.why }
    if (player.cash < v.price) return { ok: false, why: `You need ${formatNaira(v.price)} — the wallet no reach.` }
    get().removeMoney(v.price, { label: `${kind === 'walk' ? 'Walk style' : 'Outfit'} — ${kind === 'walk' ? WALK_BY_KEY.get(itemKey)?.label : PREMIUM_BY_KEY.get(itemKey)?.label ?? itemKey}`, category: 'shop' })
    const next = kind === 'walk'
      ? { ...wardrobe, ownedWalks: [...wardrobe.ownedWalks, v.itemKey] }
      : { ...wardrobe, ownedStyles: [...wardrobe.ownedStyles, v.itemKey] }
    set({ wardrobe: next })
    get().notify({ icon: kind === 'walk' ? '🕺' : '👑', text: `${kind === 'walk' ? 'Walk' : 'Outfit'} secured — ${v.itemKey} na yours now.`, tone: 'good' })
    haptics.fire('reward')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** THE EQUIP DOOR: an owned walk only — the rig never takes credit. */
  wardrobeEquipWalk: (walkKey) => {
    const { wardrobe } = get()
    const v = equipWalkLaw(wardrobe, walkKey)
    if (!v.ok) return { ok: false, why: v.why }
    set({ wardrobe: { ...wardrobe, activeWalk: v.walkKey } })
    audio.play('click')
    scheduleAutosave(get)
    return { ok: true }
  },

  /* ------------------------ M19 — THE CONFLUENCE PATH ----------------------- */

  /** Chapter 1: one carry of sand per day beside the crusher boy. */
  storyCarrySand: () => {
    const { player, world, story } = get()
    if (!player || !world) return { ok: false, why: 'Start a life first.' }
    if (world.currentLocation !== STORY.meetPlace) return { ok: false, why: 'Find the crusher boy at the Patti trail base.' }
    const v = canCarrySand(story, { day: world.day, chapter: story.chapter as StoryChapter, energy: player.needs.energy })
    if (!v.ok) return { ok: false, why: v.why }
    // the honest needs engine pays the sand's energy, the wallet pays the split
    set({ player: { ...player, needs: applyNeedsDelta(player.needs, { energy: -STORY.sandEnergy }) } })
    get().addMoney(STORY.sandPay, { label: 'Sand run with the crusher boy', category: 'hustle' })
    set({ story: applyCarry(story, world.day) })
    const after = get().story
    get().notify({
      icon: '⛏️',
      text: after.chapter >= 2
        ? `Three days of sand — the boy talk say him wan go school. Him name na Musa.`
        : `Sand carried — ${formatNaira(STORY.sandPay)} split. Musa nod for you.`,
      tone: 'good',
    })
    haptics.fire('quest')
    get().bumpGoal('work')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 2: the notebook — ₦3,500 or the school's own trust (level ≥ 5). */
  storyPayNotebook: () => {
    const { player, story } = get()
    if (!player) return { ok: false, why: 'Start a life first.' }
    const v = canPayNotebook(story, { chapter: story.chapter as StoryChapter, cash: player.cash, level: player.level })
    if (!v.ok) return { ok: false, why: v.why }
    if (v.cost > 0) get().removeMoney(v.cost, { label: "Musa's school levy + notebook", category: 'shop' })
    set({ story: applyNotebook(story) })
    get().addReputation(4)
    get().notify({ icon: '📒', text: v.cost > 0 ? `Notebook + levy paid — ${formatNaira(v.cost)}. Musa dey smile for the first time.` : 'Your word stand in for the levy — the school sabi your face.', tone: 'good' })
    haptics.fire('quest')
    get().bumpGoal('work')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 3: the fever night at the hospital — ₦2,000 or the story stops here. */
  storyPayFever: () => {
    const { player, story } = get()
    if (!player) return { ok: false, why: 'Start a life first.' }
    const v = canPayFever(story, { chapter: story.chapter as StoryChapter, cash: player.cash })
    if (!v.ok) return { ok: false, why: v.why }
    get().removeMoney(v.cost, { label: 'FTH fever night — Musa', category: 'shop' })
    set({ story: applyFever(story) })
    get().addReputation(5)
    get().notify({ icon: '🏥', text: `The fever break — ${formatNaira(v.cost)} settle am. Musa say he go become doctor, mark am.`, tone: 'good' })
    haptics.fire('quest')
    get().bumpGoal('work')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 4: ₦500 a day on the desk — six days. */
  storySponsor: () => {
    const { player, world, story } = get()
    if (!player || !world) return { ok: false, why: 'Start a life first.' }
    const v = canSponsorStory(story, { day: world.day, chapter: story.chapter as StoryChapter, cash: player.cash })
    if (!v.ok) return { ok: false, why: v.why }
    get().removeMoney(v.cost, { label: "Sponsor Musa's desk", category: 'shop' })
    set({ story: applySponsor(story, world.day) })
    const after = get().story
    get().notify({
      icon: '🪑',
      text: after.sponsoredDays >= STORY.sponsorDays
        ? `Six days complete — the exams dey come. Wait small.`
        : `Desk sponsored (${after.sponsoredDays}/${STORY.sponsorDays}) — ${formatNaira(v.cost)} well spent.`,
      tone: 'good',
    })
    haptics.fire('quest')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** Chapter 5: the white coat — the wait served, the city celebrates. */
  storyGraduate: () => {
    const { player, world, story } = get()
    if (!player || !world) return { ok: false, why: 'Start a life first.' }
    const v = canGraduate(story, { day: world.day })
    if (!v.ok) return { ok: false, why: v.why }
    set({ story: applyWhiteCoat(story, world.day) })
    get().addReputation(STORY.whiteCoatRep)
    // THE DROPS: the earned agbada + the Chairman Strut — one clean set()
    const wd = get().wardrobe
    set({
      wardrobe: {
        ...wd,
        ownedStyles: [...new Set([...wd.ownedStyles, STORY.whiteCoatOutfit])],
        ownedWalks: [...new Set([...wd.ownedWalks, STORY.whiteCoatWalk])],
      },
    })
    get().notify({ icon: '🎓', text: `DR. MUSA! The white coat don land — Confluence Gold agbada + Chairman Strut na YOURS. Day ${world.day}.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return { ok: true }
  },

  /** M19 — THE HILL'S WHISPER: the HUD poll asks; the law answers.
   *  Rewards pay through the honest engines; the discovery book is idempotent. */
  checkPatti: (x, z) => {
    const { world, patti } = get()
    if (!world) return null
    const hit = nearestSecret(x, z, patti)
    if (!hit) return null
    const res = discover(patti, hit.secret.id, world.day)
    if (!res.isNew) return null
    set({ patti: res.state })
    // the reward rides the SAME engines as every other naira/xp/rep
    const r = hit.secret.reward
    if (r.kind === 'cash' && r.amount) get().addMoney(r.amount, { label: `Patti secret — ${hit.secret.name}`, category: 'tip' })
    if (r.kind === 'xp' && r.amount) get().addXp(r.amount)
    if (r.kind === 'rep' && r.amount) get().addReputation(r.amount)
    if (r.kind === 'outfit' && r.item) {
      const wd = get().wardrobe
      set({ wardrobe: { ...wd, ownedStyles: [...new Set([...wd.ownedStyles, r.item])] } })
    }
    get().notify({ icon: '🗿', text: `SECRET FOUND — ${hit.secret.name}: ${hit.secret.line}`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('secret')
    scheduleAutosave(get)
    return hit.secret
  },

  /** M13 — SPOT THE SCAMMER: one round per day, honest money for sharp eyes. */
  playScammer: (pickIndex) => {
    const { player, world, shield } = get()
    if (!player || !world) return
    if (!canPlayScammer(shield.scammerDay, world.day)) {
      get().notify({ icon: '⏳', text: 'The street teaches once a day — come back tomoro.', tone: 'neutral' })
      audio.play('notify')
      return
    }
    const round = scamRound(world.day)
    const res = scamAnswerApply(shield, round, pickIndex, world.day)
    set({ shield: res.next })
    if (res.correct && res.reward) {
      get().addMoney(res.reward.cash, { label: 'Spot the Scammer — sharp eye', category: 'tip' })
      get().addSkillXp('smart', res.reward.smartXp)
      set({ player: { ...get().player!, needs: applyNeedsDelta(get().player!.needs, { mood: res.reward.mood }) } })
      get().notify({ icon: '🛡️', text: `Correct! ${res.lesson} (+${formatNaira(res.reward.cash)})`, tone: 'good' })
      audio.play('chime')
      haptics.fire('reward')
      get().bumpGoal('study')
    } else {
      get().notify({ icon: '📚', text: `That one na honest talk. Lesson: ${res.lesson}`, tone: 'neutral' })
      audio.play('notify')
    }
    scheduleAutosave(get)
  },

  /** M13 — the local parent-PIN gate (guests): first set stores the salted hash. */
  setLocalParentPin: (pin) => {
    const v = validateParentPin(pin)
    if (!v.ok) {
      get().notify({ icon: '🔒', text: v.why, tone: 'bad' })
      audio.play('notify')
      return false
    }
    if (get().shield.parentPinHash) {
      get().notify({ icon: '🔒', text: 'A parent PIN already guards this device.', tone: 'bad' })
      return false
    }
    set({ shield: { ...get().shield, parentPinHash: localPinHash(pin, makeLocalSalt()) } })
    get().notify({ icon: '🛡️', text: 'Parent PIN set — the tier ladder dey under your watch now.', tone: 'good' })
    scheduleAutosave(get)
    return true
  },

  /** M13 — the local tier gate: climb kid→teen→adult with the parent's yes. */
  unlockTierLocal: (to, parentPin) => {
    const { player, shield } = get()
    if (!player) return false
    const from = player.ageBand
    const pinOk = shield.parentPinHash !== null && localPinHash(parentPin, shield.parentPinHash.slice(8)) === shield.parentPinHash
    const verdict = tierGateVerdict(from, to, pinOk)
    if (!verdict.allowed) {
      get().notify({ icon: '🔒', text: verdict.why, tone: 'bad' })
      audio.play('notify')
      return false
    }
    set({ player: { ...player, ageBand: to } })
    get().notify({ icon: '🛡️', text: `Life stage moved to ${to.toUpperCase()} — the city adjusts to you.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** M13 — THE FAMILY SHIELD register law: a minor account only exists
   *  behind a parent's PIN and collects NOTHING — no contact, no recovery
   *  line. The birth year is the honest truth: if it yields a different
   *  band than the character's, the birth year wins (and the city tells you). */
  registerAccount: async (input) => {
    const vHandle = validateHandle(input.handle)
    if (!vHandle.ok) return { ok: false, why: vHandle.why }
    const vPin = validatePin(input.pin)
    if (!vPin.ok) return { ok: false, why: vPin.why }
    const year = new Date().getFullYear()
    const band = ageBandForYear(input.birthYear, year)
    if (!band) return { ok: false, why: 'Enter the year you were born.' }
    const minor = band !== 'adult'
    // M13 — zero collection: minors answer to the parent PIN alone
    let contact = input.contact.trim()
    let parentPin: string | undefined
    if (minor) {
      if (!input.parentPin) return { ok: false, why: 'A parent must set the shield PIN — minors dey register behind a parent.' }
      const vParent = validateParentPin(input.parentPin)
      if (!vParent.ok) return { ok: false, why: vParent.why }
      parentPin = input.parentPin
      contact = '' // never stored for a minor — zero data collection
    } else {
      const vContact = validateContact(input.contact)
      if (!vContact.ok) return { ok: false, why: vContact.why }
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: input.handle.trim(), contact, pin: input.pin, ageBand: band, parentPin }),
      })
      const data = (await res.json()) as { ok?: boolean; why?: string; token?: string }
      if (!res.ok || !data.ok || !data.token) return { ok: false, why: data.why ?? 'The register no gree — try again.' }
      // the birth year is the law: the character's band syncs to it
      const p = get().player
      const changed = p && p.ageBand !== band
      if (p && changed) set({ player: { ...p, ageBand: band } })
      set({
        account: { linked: true, handle: input.handle.trim(), token: data.token, ageBand: band, gateGraceDay: get().world?.day ?? 0 },
        gateOpen: false,
      })
      get().notify({ icon: '🪪', text: changed
        ? `You don claim your name — welcome, ${input.handle.trim()}! (Birth year say ${band.toUpperCase()} — the city adjust to am.)`
        : `You don claim your name — welcome, ${input.handle.trim()}! Your hustle don dey cloud now.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
      scheduleAutosave(get)
      void get().pushCloud()
      // M15 — the postcard the gate held lands behind the claimed name
      const pendingReg = get().pendingArrival
      const worldReg = get().world
      if (pendingReg && worldReg) applyArrival(set, get, pendingReg.code, pendingReg.moment)
      return { ok: true }
    } catch {
      return { ok: false, why: 'Network no gree — check connection and try again.' }
    }
  },

  /** M9 — return to a claimed name: the merge law decides, nothing is lost. */
  loginAccount: async (input) => {
    const vHandle = validateHandle(input.handle)
    if (!vHandle.ok) return { ok: false, why: vHandle.why }
    const vPin = validatePin(input.pin)
    if (!vPin.ok) return { ok: false, why: vPin.why }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: input.handle.trim(), pin: input.pin }),
      })
      const data = (await res.json()) as { ok?: boolean; why?: string; token?: string; save?: import('../types').GameSave | null; band?: string | null }
      if (!res.ok || !data.ok || !data.token) return { ok: false, why: data.why ?? 'The register no gree — try again.' }
      const local = SaveSystem.load()
      const cloud = data.save ?? null
      // M17 — the account row's band is the canonical tier law (the
      // register stored it; the save's player band is the fallback)
      const bandFromRegister = (['kid', 'teen', 'adult'].includes(String(data.band)) ? data.band : null) as AccountState['ageBand']
      if (cloud && local) {
        const verdict = mergeVerdict(local, cloud)
        const winner = verdict.winner === 'cloud' ? cloud : local
        const loser = verdict.backup
        if (loser) {
          // never-lose-progress: the loser lands in the backup slot, byte-safe
          try { localStorage.setItem(BACKUP_KEY, backupPayload(loser)) } catch { /* storage full — the save itself still loads */ }
        }
        set({
          account: { linked: true, handle: input.handle.trim(), token: data.token, ageBand: bandFromRegister ?? (cloud.player as unknown as { ageBand?: AccountState['ageBand'] }).ageBand ?? null, gateGraceDay: get().world?.day ?? 0 },
          player: winner.player,
          world: winner.world,
          civic: winner.civic,
          chaos: winner.chaos ?? freshChaosState(),
          calendar: winner.calendar ?? freshCalendarState(),
          rivers: winner.rivers ?? freshRiversState(),
          education: winner.education ?? freshEducationState(),
          housing: winner.housing ?? freshHousingState(),
          japa: winner.japa ?? freshJapaState(),
          fleet: winner.fleet ?? { day: winner.world.day, done: [] },
          goals: winner.goals ?? freshGoalState(),
          onboarding: winner.onboarding ?? freshOnboardingState(),
          shield: winner.shield ?? freshShieldState(),
          fortress: winner.fortress ?? freshFortressState(),
          cityPulse: winner.cityPulse ?? freshPulseState(),
          live: winner.live ?? freshLiveState(),
          forge: winner.forge ?? freshForgeState(),
          story: winner.story ?? freshStoryState(),
          patti: winner.patti ?? freshPattiState(),
          wardrobe: winner.wardrobe ?? freshWardrobeState(),
          gateOpen: false,
        })
        get().notify({ icon: '🪪', text: `Welcome back, ${input.handle.trim()}! ${verdict.why}`, tone: 'good' })
      } else {
        set({
          account: { linked: true, handle: input.handle.trim(), token: data.token, ageBand: bandFromRegister, gateGraceDay: get().world?.day ?? 0 },
          gateOpen: false,
        })
        get().notify({ icon: '🪪', text: `Welcome back, ${input.handle.trim()}!`, tone: 'good' })
      }
      audio.play('chime')
      haptics.fire('reward')
      scheduleAutosave(get)
      void get().pushCloud()
      // M15 — the postcard the gate held lands behind the claimed name
      const pendingLog = get().pendingArrival
      const worldLog = get().world
      if (pendingLog && worldLog) applyArrival(set, get, pendingLog.code, pendingLog.moment)
      return { ok: true }
    } catch {
      return { ok: false, why: 'Network no gree — check connection and try again.' }
    }
  },

  /** M9 — "Maybe later": today rides free, tomorrow the gate stands again. */
  acceptGateGrace: () => {
    const day = get().world?.day ?? 0
    set({ account: applyGrace(get().account, day), gateOpen: false })
    get().notify({ icon: '🤝', text: 'Today na free ride — tomorrow, come claim your name.', tone: 'neutral' })
    audio.play('notify')
    // M15 — a postcard the gate was holding lands the moment the grace lands
    const pending = get().pendingArrival
    const world = get().world
    if (pending && world) applyArrival(set, get, pending.code, pending.moment)
  },

  closeGate: () => set({ gateOpen: false }),

  /* --------------------------- M15 — the city pulse --------------------------- */

  /** Opening the paper marks today's feed read — the unread dot dies honestly. */
  openCityPulse: () => {
    const { player, world, civic, chaos, rivers, calendar, cityPulse } = get()
    if (!player || !world || !civic) return
    const items = pulseForDay({ day: world.day, weather: world.weather, chaos, civic, rivers, calendar })
    set({ cityPulse: markPulseRead(cityPulse ?? freshPulseState(), world.day, items) })
    scheduleAutosave(get)
  },

  /** THE POSTCARD: this moment, signed, ~100 bytes, WhatsApp-ready. */
  shareTeleport: async () => {
    const { player, world } = get()
    if (!player || !world) return { ok: false, why: 'no game' }
    const tally = dayTally(player.transactions, world.day)
    const moment: TeleportMoment = {
      v: 1,
      day: world.day,
      locId: world.currentLocation,
      name: player.name,
      level: player.level,
      rep: player.reputation,
      earned: tally.earned,
      moves: tally.moves,
      trail: tally.trail,
    }
    const enc = encodeTeleport(moment)
    if (!enc.ok) return { ok: false, why: enc.why }
    const card = postcardFor(moment)
    const share = await shareText(get, card.title, card.body, enc.url)
    if (!share.ok) return { ok: false, why: share.why }
    payStreetCredit(get, set)
    scheduleAutosave(get)
    return { ok: true, url: enc.url }
  },

  /** THE HEADLINE: a City Pulse item rides the same share law. */
  sharePulseCard: async (item) => {
    const { world } = get()
    if (!world) return { ok: false, why: 'no game' }
    const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : ''
    const share = await shareText(get, `${item.icon} ${item.headline}`, item.body, origin || 'Lokoja Life')
    if (!share.ok) return { ok: false, why: share.why }
    payStreetCredit(get, set)
    scheduleAutosave(get)
    return { ok: true }
  },

  /** THE ARRIVAL: a verified postcard lands you on the sender's street — free. */
  arriveByTeleport: (code) => {
    const dec = decodeTeleport(code)
    if (!dec.ok) {
      get().notify({
        icon: '📩',
        text: dec.why === 'tampered'
          ? 'This postcard don break — somebody don edit am. E no go load.'
          : 'This postcard no readable — the code cut off for road.',
        tone: 'bad',
      })
      audio.play('notify')
      return { ok: false, why: dec.why }
    }
    const m = dec.moment
    const { player, world, account } = get()
    if (!player || !world) {
      // a fresh arrival — the postcard waits for the creation flow
      set({ pendingArrival: { code: code.trim(), moment: m } })
      return { ok: true }
    }
    // THE GUEST LAW: the gate stands before a forward leap, even by postcard
    const verdict = gateVerdict(account, m.locId, world.day)
    if (verdict.blocked) {
      set({ gateOpen: true, pendingArrival: { code: code.trim(), moment: m } })
      return { ok: false, why: 'gate' }
    }
    applyArrival(set, get, code.trim(), m)
    return { ok: true }
  },

  /** THE OFFLINE LAW: the queued push rides again the moment the network returns. */
  flushCloudQueue: async () => {
    const { cloudPending, account } = get()
    if (!cloudPending || !account.linked) return
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return
    const res = await get().pushCloud()
    if (res.ok) {
      set({ cloudPending: false })
      try { window.localStorage.removeItem('lokoja-life:cloud-queue') } catch { /* the flag is cosmetic now */ }
      get().notify({ icon: '☁️', text: 'Network don come back — your save don reach the cloud.', tone: 'good' })
    }
  },

  /* --------------------------- M17 — the live nation --------------------------- */

  /** THE IDENTITY LAW, client side: the mic and the money tables open at
   *  claim. A guest syncs nothing — spectating happens in the UI. */
  liveSync: async () => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    try {
      const res = await fetch('/api/live/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
        body: JSON.stringify({
          since: live?.cursor ?? 0,
          presence: { street: world?.currentLocation ?? 'home', status: 'hustling' },
        }),
      })
      const data = (await res.json()) as {
        ok?: boolean; why?: string; cursor?: number
        events?: { seq: number; kind: string; actor: string; payload: Record<string, unknown> }[]
        roster?: { handle: string; band: string; street: string; status: string }[]
      }
      if (!res.ok || !data.ok) return { ok: false, why: data.why ?? 'relay no gree' }
      const me = account.handle
      const lv = get().live ?? freshLiveState()
      const moves: { cash: number; why: string }[] = []
      for (const ev of data.events ?? []) {
        // THE TRADE LAW: each side applies the accepted trade through its
        // OWN honest engines (the kobo-chain + the income guard chain it)
        if (ev.kind === 'trade' && ev.payload?.accepted) {
          const t = ev.payload as { from: string; to: string; giveCash: number; wantCash: number }
          if (t.from === me) moves.push({ cash: (t.wantCash ?? 0) - (t.giveCash ?? 0), why: `trade with ${t.to}` })
          if (t.to === me) moves.push({ cash: (t.giveCash ?? 0) - (t.wantCash ?? 0), why: `trade with ${t.from}` })
        }
        // THE COURT GUARANTEE: a fine against me lands through my engines
        if (ev.kind === 'court' && ev.payload?.defaulter === me) {
          const fine = Number(ev.payload.fine ?? 0)
          if (fine > 0) moves.push({ cash: -fine, why: 'Market Union fine — the round still paid' })
        }
      }
      set({
        live: { ...lv, cursor: data.cursor ?? lv.cursor },
        liveWire: { roster: data.roster ?? [], events: data.events ?? [] },
      })
      for (const m of moves) {
        if (m.cash > 0) get().addMoney(m.cash, { label: m.why, category: 'other' })
        else if (m.cash < 0) {
          const ok = get().removeMoney(-m.cash, { label: 'Market Union fine — the round still paid', category: 'other' })
          if (ok) {
            const cur = get().live ?? freshLiveState()
            set({ live: { ...cur, finesPaid: cur.finesPaid + -m.cash } })
            get().notify({ icon: '⚖️', text: `The court collected ₦${(-m.cash).toLocaleString()} — the circle still paid.`, tone: 'bad' })
          }
        }
      }
      return { ok: true, roster: data.roster ?? [], events: data.events ?? [] }
    } catch {
      return { ok: false, why: 'offline — the nation waits' }
    }
  },

  /** a raw relay read (boards + inboxes) — thin, tokened, honest */
  liveAction: async (action, payload = {}) => {
    const { account } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    try {
      const res = await fetch('/api/live/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
        body: JSON.stringify({ action, payload }),
      })
      const data = (await res.json()) as { ok?: boolean; why?: string } & Record<string, unknown>
      return res.ok && data.ok ? { ok: true, ...data } : { ok: false, why: data.why ?? 'relay no gree' }
    } catch {
      return { ok: false, why: 'offline' }
    }
  },

  /** THE TIERED CHAT LAW, client side first (the relay re-judges). */
  liveSendChat: async (text, channel = 'global') => {
    const { account, live, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'guest-mic-dark' }
    const band = (account.ageBand ?? 'adult') as 'kid' | 'teen' | 'adult'
    const verdict = sanitizeChat({ handle: account.handle, band }, text)
    if (!verdict.ok) return { ok: false, why: verdict.why }
    const res = await get().liveAction('chat', { text: verdict.text, channel })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, stats: { ...lv.stats, chats: lv.stats.chats + 1 } } })
    if (verdict.stripped) {
      get().notify({ icon: '🚫', text: 'Link no dey pass for here — the words went, the talk stayed.', tone: 'neutral' })
    }
    void world
    return { ok: true, stripped: verdict.stripped }
  },

  liveSendEmote: async (emoteId, channel = 'global') => {
    const { account, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'guest-mic-dark' }
    const emote = emoteById(emoteId)
    if (!emote) return { ok: false, why: 'no-such-emote' }
    const res = await get().liveAction('emote', { emoteId, channel })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, stats: { ...lv.stats, emotes: lv.stats.emotes + 1 } } })
    return { ok: true }
  },

  /** THE JOIN-TELEPORT LAW: my street travels as an M15 postcard. */
  liveShareJoin: async (code) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const street = world?.currentLocation ?? 'home'
    const res = await get().liveAction('join', { code, street })
    return res.ok ? { ok: true } : { ok: false, why: res.why }
  },

  liveOpenStream: async (kind, title) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('stream-open', { kind, title, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    get().notify({ icon: '📡', text: `You dey live — ${String((res as { title?: string }).title ?? title)}. Viewers na crowd!`, tone: 'good' })
    return { ok: true, streamId: (res as { streamId?: string }).streamId }
  },

  liveViewStream: async (streamId) => {
    const { live } = get()
    const res = await get().liveAction('stream-view', { streamId })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, stats: { ...lv.stats, streamsWatched: lv.stats.streamsWatched + 1 } } })
    return { ok: true, viewers: (res as { viewers?: number }).viewers }
  },

  liveCloseStream: async (streamId) => {
    const res = await get().liveAction('stream-close', { streamId })
    if (!res.ok) return { ok: false, why: res.why }
    return { ok: true, peakViewers: (res as { peakViewers?: number }).peakViewers }
  },

  liveFoundAssoc: async (name, motto) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-found', { name, motto, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const assocId = (res as { assocId?: string }).assocId ?? null
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, assocId } })
    get().notify({ icon: '🏛️', text: `${name} don stand — the books dey sealed.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    return { ok: true, assocId: assocId ?? undefined }
  },

  liveJoinAssoc: async (assocId) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-join', { assocId, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, assocId } })
    return { ok: true }
  },

  /** THE TREASURY LAW: the wallet pays AFTER the relay books the move. */
  livePayDues: async (assocId, amount) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, why: 'bad-amount' }
    const res = await get().liveAction('assoc-dues', { assocId, amount, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const ok = get().removeMoney(amount, { label: 'Union dues — the books dey sealed', category: 'other' })
    if (ok) get().notify({ icon: '🤝', text: `₦${amount.toLocaleString()} dues land for the union books.`, tone: 'neutral' })
    return { ok: true }
  },

  /** THE TWO-KEY LAW: president + one officer, or the books don't move. */
  liveWithdrawAssoc: async (assocId, amount, coSigner) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-withdraw', { assocId, amount, coSigner, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    get().addMoney(amount, { label: `union withdrawal (co-signed by ${coSigner})`, category: 'other' })
    const lv = get().live ?? freshLiveState()
    set({ live: { ...lv, coSigned: [...lv.coSigned, `${amount}:${coSigner}`].slice(-24) } })
    get().notify({ icon: '🏛️', text: `₦${amount.toLocaleString()} out of the union books — two keys turned.`, tone: 'good' })
    return { ok: true }
  },

  liveFileContract: async (assocId, terms, stake, parties) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-contract', { assocId, terms, stake, parties, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    return { ok: true }
  },

  /** THE COURT LAW: file it, the hash judges it. */
  liveFileDispute: async (assocId, contractId, evidence) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('assoc-dispute', { assocId, contractId, evidence, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const verdict = (res as { verdict?: string }).verdict
    get().notify({ icon: '⚖️', text: `The Market Union talk: ${verdict === 'broken' ? 'THE CONTRACT BREAK — the liable party pays the stake.' : 'the contract stands.'}`, tone: verdict === 'broken' ? 'neutral' : 'good' })
    return { ok: true, verdict }
  },

  liveOfferTrade: async (to, giveCash, wantCash, terms) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('trade-offer', { to, giveCash, wantCash, terms, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    return { ok: true }
  },

  /** THE TRADE LAW: the relay books it, MY engines move MY money. */
  liveAcceptTrade: async (tradeId) => {
    const { account } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('trade-accept', { tradeId })
    if (!res.ok) return { ok: false, why: res.why }
    const t = (res as { trade?: { from: string; to: string; giveCash: number; wantCash: number; terms: string } }).trade
    if (t && t.to === account.handle) {
      get().addMoney(t.giveCash, { label: `accepted trade from ${t.from}`, category: 'other' })
      if (t.wantCash > 0) get().removeMoney(t.wantCash, { label: `paid for trade from ${t.from}`, category: 'other' })
      const lv = get().live ?? freshLiveState()
      set({ live: { ...lv, stats: { ...lv.stats, tradesDone: lv.stats.tradesDone + 1 } } })
      get().notify({ icon: '🤝', text: `Trade sealed with ${t.from} — ₦${t.giveCash.toLocaleString()} don enter.`, tone: 'good' })
      audio.play('chime')
      haptics.fire('reward')
    }
    return { ok: true }
  },

  liveFoundAjo: async (name, contribution) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('ajo-found', { name, contribution, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const ajoId = (res as { ajoId?: string }).ajoId ?? null
    const lv = live ?? freshLiveState()
    set({ live: { ...lv, circles: [...lv.circles, ajoId ?? ''].filter(Boolean).slice(-12) } })
    get().notify({ icon: '♻️', text: `${name} don open — the ladder don set, nobody dey skip.`, tone: 'good' })
    return { ok: true, ajoId: ajoId ?? undefined }
  },

  liveJoinAjo: async (ajoId) => {
    const { account, world, live } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('ajo-join', { ajoId, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    const lv = live ?? freshLiveState()
    if (!lv.circles.includes(ajoId)) set({ live: { ...lv, circles: [...lv.circles, ajoId].slice(-12) } })
    return { ok: true }
  },

  /** THE ROUND LAW: my contribution leaves my pocket through the honest
   *  engines (the relay counts the pot, MY wallet pays for it); when the
   *  ladder completes and the pot walks to ME, the payout lands too. */
  livePayAjo: async (ajoId) => {
    const { account, world } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const board = await get().liveAction('ajos', {})
    const circles = (board as { circles?: { id: string; contribution: number; name: string }[] }).circles ?? []
    const mine = circles.find((c) => c.id === ajoId)
    if (!mine) return { ok: false, why: 'no-circle' }
    const res = await get().liveAction('ajo-pay', { ajoId, day: world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    get().removeMoney(mine.contribution, { label: `${mine.name} contribution`, category: 'other' })
    get().notify({ icon: '♻️', text: `₦${mine.contribution.toLocaleString()} enter the ${mine.name} pot.`, tone: 'neutral' })
    // the ladder completed and the pot walked to ME (the relay says so)
    if ((res as { paidOut?: string }).paidOut === account.handle) {
      const payout = Number((res as { payout?: number }).payout ?? 0)
      if (payout > 0) {
        get().addMoney(payout, { label: `${mine.name} round payout`, category: 'other' })
        get().notify({ icon: '🎉', text: `${mine.name} pays YOU ₦${payout.toLocaleString()} — the ladder reach your turn!`, tone: 'good' })
        audio.play('chime')
        haptics.fire('reward')
      }
    }
    return { ok: true, paidOut: (res as { paidOut?: string }).paidOut, payout: (res as { payout?: number }).payout }
  },

  liveCourtAjo: async (ajoId) => {
    const { account } = get()
    if (!account.linked || !account.token) return { ok: false, why: 'unclaimed' }
    const res = await get().liveAction('ajo-court', { ajoId, day: get().world?.day ?? 1 })
    if (!res.ok) return { ok: false, why: res.why }
    return { ok: true }
  },

  liveToggleVoice: () => {
    const lv = get().live ?? freshLiveState()
    const band = get().account.ageBand ?? 'adult'
    if (band !== 'adult') {
      get().notify({ icon: '🎙️', text: 'Voice na adult table — the shield holds.', tone: 'bad' })
      return
    }
    set({ live: { ...lv, voiceOn: !lv.voiceOn } })
    get().notify({ icon: '🎙️', text: !lv.voiceOn ? 'Voice dey ON — same-street proximity only.' : 'Voice don off.', tone: 'neutral' })
  },

  /* --------------------------- M18 — the city forge --------------------------- */

  /** THE FORGE, live on the sample extract: the same honest pipeline the
   *  pilots ride — import → classify → blueprint → QA → ship. The run
   *  records its ledger entry whether it ships or refuses. */
  runForge: () => {
    const world = get().world
    const day = world?.day ?? 1
    // the honest sample extract: a small Lokoja-shaped wire (the same
    // shape a real OSM pull lands in — nodes + ways + tags)
    const extract: OsmExtract = {
      city: 'lokoja',
      nodes: [
        { id: 'n1', lat: 7.79, lon: 6.73 },
        { id: 'n2', lat: 7.80, lon: 6.74 },
        { id: 'n3', lat: 7.81, lon: 6.75 },
        { id: 'n4', lat: 7.795, lon: 6.745 },
        { id: 'n5', lat: 7.785, lon: 6.735 },
        { id: 'n6', lat: 7.805, lon: 6.752 },
      ],
      ways: [
        { id: 'w1', nodes: ['n1', 'n2'], tags: { highway: 'primary', name: 'Ganaja Road' } },
        { id: 'w2', nodes: ['n2', 'n3'], tags: { highway: 'residential', name: 'Zango Street' } },
        { id: 'w3', nodes: ['n4'], tags: { amenity: 'marketplace', name: 'New Market' } },
        { id: 'w4', nodes: ['n5'], tags: { amenity: 'bank', name: 'Community Bank' } },
        { id: 'w5', nodes: ['n6'], tags: { amenity: 'restaurant', name: 'Mama Put' } },
        { id: 'w6', nodes: ['n5', 'n6'], tags: { waterway: 'river', name: 'The Niger' } },
        { id: 'w7', nodes: ['n3'], tags: { building: 'yes' }, }, // unnamed — the import refuses it honestly
      ],
    }
    // the honest stage wall-clock (recorded, never faked — the SLA law
    // audits these against the budgets)
    const stageMinutes = { osm: 12, classify: 31, blueprint: 44, qa: 9, ship: 6 }
    const run = forgeCity(extract, {
      city: 'lokoja' as import('../systems/citypack').CityId<'lokoja'>,
      name: 'Lokoja',
      country: 'Nigeria',
      version: `lokoja-v1.${day}`,
      colIndex: 100,
      bbox: { minLat: 7.75, maxLat: 7.85, minLon: 6.70, maxLon: 6.80 },
      stageMinutes,
    })
    const fg = get().forge ?? freshForgeState()
    const ledger = recordBuild(fg.ledger, run, day)
    set({ forge: { ...fg, ledger, ranLokoja: true } })
    get().notify(run.manifest
      ? { icon: '🏗️', text: `${run.pack?.name ?? 'Lokoja'} don SHIP — QA ${run.qa?.score ?? 0}/100 in ${run.sla.total} min. A city na data!`, tone: 'good' }
      : { icon: '🚫', text: 'The forge refuse the pack — the QA battery no gree.', tone: 'bad' })
    audio.play(run.manifest ? 'chime' : 'notify')
    return ledger
  },

  /** THE VOTE: the local book moves at once; the ballot box (the relay)
   *  gets it whenever the connection appears — the offline-first law. */
  forgeVote: async (city) => {
    const fg = get().forge ?? freshForgeState()
    const verdict = forgeVoteLaw(fg.votes, city)
    if (!verdict.ok) {
      get().notify({ icon: '🗳️', text: verdict.why === 'capped' ? `Your vote card full — ${fg.votes.mine.length} cities dey your heart already.` : 'You don vote this city before.', tone: 'bad' })
      return { ok: false, why: verdict.why }
    }
    set({ forge: { ...fg, votes: applyVote(fg.votes, city) } })
    get().notify({ icon: '🗳️', text: `Your vote land for ${city} — ${voteWinner(get().forge?.votes ?? fg.votes) === city ? 'and e dey lead!' : 'the race still open.'}`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    // the relay vote rides when claimed (the ballot box keeps the world book)
    const { account } = get()
    if (account.linked && account.token) {
      try {
        await fetch('/api/forge/vote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
          body: JSON.stringify({ city }),
        })
      } catch { /* offline: the local book holds, the box waits */ }
    }
    return { ok: true }
  },

  /** pull the world's counts (the local seed stays until the box talks) */
  forgeVotesPull: async () => {
    try {
      const res = await fetch('/api/forge/vote')
      const data = (await res.json()) as { ok?: boolean; counts?: Record<string, number> }
      if (!res.ok || !data.ok || !data.counts) return
      const fg = get().forge ?? freshForgeState()
      set({ forge: { ...fg, votes: { ...fg.votes, counts: { ...fg.votes.counts, ...data.counts } } } })
    } catch { /* offline — the seeded book reads */ }
  },

  /** M9 — push the current save to the cloud (linked accounts only). M14: the
   *  envelope's signature rides along. M15: THE ZERO-BYTE PUSH — an unchanged
   *  life costs the network nothing; M16: an offline push QUEUES, it never dies. */
  pushCloud: async () => {
    const { player, world, civic, account } = get()
    if (!player || !world || !civic) return { ok: false, why: 'no game' }
    if (!account.linked || !account.token) return { ok: false, why: 'not linked' }
    // M16 — THE OFFLINE LAW: the queue flag lights NOW (the flush rides the
    // 'online' event), and the honest toast says the network, not the player.
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      set({ cloudPending: true })
      try { window.localStorage.setItem('lokoja-life:cloud-queue', '1') } catch { /* the flag rides the session */ }
      return { ok: false, why: 'offline' }
    }
    get().saveNow()
    const save = SaveSystem.load()
    if (!save) return { ok: false, why: 'no save' }
    // M15 — THE ZERO-BYTE PUSH: the vault already holds this exact life
    const pushed = SaveSystem.lastPushedHash()
    if (pushed && pushed === SaveSystem.fingerprintOf(save)) {
      return { ok: true, why: 'delta-skip' }
    }
    // M14 — the signed envelope's sig: the vault stores it beside the save
    let sig = ''
    try {
      const env = JSON.parse(SaveSystem.readEnvelope() ?? '{}') as { sig?: string }
      sig = typeof env.sig === 'string' ? env.sig : ''
    } catch { /* unsigned legacy — the pull treats it as legacy-ok */ }
    try {
      const res = await fetch('/api/cloud/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
        body: JSON.stringify({ ...SaveSystem.toCloudPayload(save), sig }),
      })
      if (!res.ok) return { ok: false, why: 'cloud refused' }
      SaveSystem.markPushed(save)
      set({ cloudPending: false })
      try { window.localStorage.removeItem('lokoja-life:cloud-queue') } catch { /* done */ }
      return { ok: true }
    } catch {
      // M16 — a network failure queues the push; it never dies silently
      set({ cloudPending: true })
      try { window.localStorage.setItem('lokoja-life:cloud-queue', '1') } catch { /* the flag rides the session */ }
      return { ok: false, why: 'network' }
    }
  },

  saveNow: () => {
    const { player, world, civic, fleet, chaos, calendar, rivers, education, housing, japa, goals, onboarding, account, settings } = get()
    if (!player || !world || !civic) return
    const existing = SaveSystem.load()
    SaveSystem.write({
      version: SaveSystem.SAVE_VERSION,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      player,
      world,
      civic,
      fleet,
      chaos,
      calendar,
      rivers,
      education,
      housing,
      japa,
      goals,
      onboarding,
      account,
      shield: get().shield,
      fortress: { ...get().fortress, fingerprint: configFingerprint({ STARTING, WORK, BIZ, CHAOS, LADDER, FORTRESS, PULSE }) },
      cityPulse: get().cityPulse ?? freshPulseState(),
      live: get().live ?? freshLiveState(),
      forge: get().forge ?? freshForgeState(),
      story: get().story,
      patti: get().patti,
      wardrobe: get().wardrobe,
      settings,
    })
    set({ hasSave: true })
  },

  resetGame: () => {
    SaveSystem.clear()
    set({
      player: null,
      world: null,
      civic: null,
      fleet: { day: 1, done: [] },
      chaos: freshChaosState(),
      calendar: freshCalendarState(),
      rivers: freshRiversState(),
      education: freshEducationState(),
      housing: freshHousingState(),
      japa: freshJapaState(),
      goals: freshGoalState(),
      onboarding: freshOnboardingState(),
      account: freshAccountState(),
      shield: freshShieldState(),
      fortress: freshFortressState(),
      cityPulse: freshPulseState(),
      live: freshLiveState(),
      forge: freshForgeState(),
      liveWire: null,
      pendingArrival: null,
      cloudPending: false,
      gateOpen: false,
      screen: 'menu',
      hasSave: false,
    })
  },

  /* ------------------------------ feedback ------------------------------ */

  notify: (n) => {
    notificationId += 1
    const notification: GameNotification = { ...n, id: notificationId }
    set({ notifications: [...get().notifications.slice(-2), notification] })
    setTimeout(() => get().dismissNotification(notification.id), 3200)
  },

  dismissNotification: (id) =>
    set({ notifications: get().notifications.filter((n) => n.id !== id) }),
}))

/* THE SCREEN MIRROR — the menu store owns `screen` (SILK II: the menu
 * slice is all the entry chunk carries); the fat store mirrors it so every
 * in-game reader stays reactive without a repo-wide migration. One writer,
 * one mirror, zero drift. Wired at module scope so tests and the browser
 * share the exact same law. */
useMenuStore.subscribe((s, prev) => {
  if (s.screen !== prev.screen && useGameStore.getState().screen !== s.screen) {
    useGameStore.setState({ screen: s.screen })
  }
})
