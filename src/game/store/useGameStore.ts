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
import { gigBoard, gigLabel } from '../systems/fleet'
import { HUSTLE_BY_ID } from '../data/hustles'
import { BIZ, CIVIC, FLEET, CHAOS, FESTIVALS, RIVERS } from '../data/config'

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
  setScreen: (screen: Screen) => void

  /* core actions */
  startNewGame: (name: string, gender: Gender, avatar: AvatarConfig) => void
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
  /** M9 — one life event lands on today's goals (rewards flow the engines) */
  bumpGoal: (kind: string) => void
  /** Talk with an NPC — familiarity + one warm line. Null = cooldown / guard. */
  chatNpc: (npcId: string) => ChatOutcome | null
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
  /** M9 — the Guest Loop: claim a name (register) or return (login) */
  registerAccount: (input: { handle: string; contact: string; pin: string; birthYear: number }) => Promise<{ ok: boolean; why?: string }>
  loginAccount: (input: { handle: string; pin: string }) => Promise<{ ok: boolean; why?: string }>
  /** M9 — "Maybe later": the gate buys the rest of today, tomorrow it stands */
  acceptGateGrace: () => void
  /** M9 — close the gate modal without grace */
  closeGate: () => void
  /** M9 — push the current save to the cloud (linked accounts) */
  pushCloud: () => Promise<{ ok: boolean; why?: string }>
  saveNow: () => void
  resetGame: () => void

  /* feedback */
  notify: (n: Omit<GameNotification, 'id'>) => void
  dismissNotification: (id: number) => void
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
let notificationId = 0
let pulseId = 0

/** Ledger cap — newest entries survive, old ones fall off. */
const LEDGER_CAP = 50

/** M9 — the store-wide decay law: Chill Mode runs the body at half drain. */
function slotDecay(get: () => GameStore, needs: import('../types').Needs, slots: number) {
  return applySlotDecay(needs, slots, get().settings.chill ? CHILL.decayMult : 1)
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
  totalEarned: number,
  prevDay: number,
  newDay: number,
  bizCount = 0,
  solarCount = 0,
  weather?: import('../types').Weather,
  liquidityMultOverride?: number,
  chill = false,
): { civic: CivicState; chaos: ChaosState; calendar: CalendarState; rivers: RiversState; agg: CivicAgg } {
  let cur = civic
  let curChaos = chaos
  let curCal = calendar
  let curRiv = rivers
  const agg: CivicAgg = { nepaPosted: 0, nepaShed: false, taxAssessed: 0, warrantIssued: false, tipsResolved: [], tipReward: 0, blowoutZone: null, outageFixed: null, scarcityDay: false, payoutDay: false, festivalMorning: null, weddingToday: null, pavingDone: null, pavingStalled: null, regattaResult: null, floodedZone: null, drainedZone: null, rescueWake: null, rescueDone: null, riverDamp: false, riverRelief: false }
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
  return { civic: cur, chaos: curChaos, calendar: curCal, rivers: curRiv, agg }
}

/** Execute a civic day crossing: set the slice, pay whistleblower rewards,
 *  apply the shedding mood hit and the warrant reputation hit, narrate it. */
function commitCivicDays(
  get: () => GameStore,
  set: (partial: Partial<GameStore>) => void,
  prevDay: number,
  newDay: number,
): void {
  const { civic, chaos, calendar, rivers, player, world } = get()
  if (!civic || !player || !world || newDay <= prevDay) return
  const bizCount = player.businesses.length
  // M5 — solar shops draw from the sun: their share of the meter load drops
  const solarCount = player.businesses.filter((b) => b.upgrades.includes('solar')).length
  // M6 — the NEW day's weather (already set by the clock before this call)
  // folds its market stress into the day's prices
  const newWeather = get().world?.weather
  // M9 — Chill Mode runs the whole civic roll kinder (2× disco grace, 3× warrant)
  const chill = get().settings.chill
  const { civic: rolled, chaos: rolledChaos, calendar: rolledCal, rivers: rolledRiv, agg } = civicRollForDays(civic, chaos, calendar, rivers, player.stats.totalEarned, prevDay, newDay, bizCount, solarCount, newWeather, undefined, chill)
  set({ civic: rolled, chaos: rolledChaos, calendar: rolledCal, rivers: rolledRiv })

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
  }
  if (agg.riverRelief) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: RIVERS.reliefMood }) } })
    get().notify({ icon: '☀️', text: 'The river don enter back inside him banks — the whole city dey breathe.', tone: 'good' })
  } else if (agg.riverDamp) {
    const p = get().player
    if (p) set({ player: { ...p, needs: applyNeedsDelta(p.needs, { mood: -RIVERS.dampMoodHit }) } })
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
      goals: get().goals,
      onboarding: get().onboarding,
      account: get().account,
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
  goals: freshGoalState(),
  onboarding: freshOnboardingState(),
  account: freshAccountState(),
  gateOpen: false,
  pulse: null,
  shockwave: 0,
  settings: { sound: true, graphics: 'auto' as const, chill: false },

  isTravelling: false,
  isWorking: false,
  workingLabel: null,
  offers: [],

  /* ----------------------------- lifecycle ----------------------------- */

  boot: () => {
    const save = SaveSystem.load()
    syncAudioWithSettings(save?.settings ?? { sound: true, graphics: 'auto', chill: false })
    set({ booted: true, hasSave: SaveSystem.hasSave(), settings: save?.settings ?? { sound: true, graphics: 'auto', chill: false } })
  },

  setScreen: (screen) => set({ screen }),

  /* ---------------------------- core actions ---------------------------- */

  startNewGame: (name, gender, avatar) => {
    const player: PlayerState = {
      name: name.trim() || 'New Hustler',
      gender,
      avatar: { ...DEFAULT_AVATAR, ...avatar },
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
      goals: freshGoalState(),
      onboarding: freshOnboardingState(),
      account: freshAccountState(),
      gateOpen: false,
      fleet: { day: 1, done: [] },
      screen: 'game',
      offers: [],
    })
    scheduleAutosave(get)
  },

  continueGame: () => {
    const save = SaveSystem.load()
    if (!save) return false
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
      goals: save.goals ?? freshGoalState(),
      onboarding: save.onboarding ?? freshOnboardingState(),
      account: save.account ?? freshAccountState(),
      fleet: save.fleet,
      settings,
      screen: 'game',
    })
    return true
  },

  returnToMenu: () => {
    get().saveNow()
    set({ screen: 'menu', hasSave: SaveSystem.hasSave() })
  },

  /* --------------------------- needs / time ----------------------------- */

  rest: (kind) => {
    const { player, world } = get()
    if (!player || !world) return

    // rest values come from the central config — never hard-coded
    const { energy, hunger, mood, health } = NEEDS.rest[kind]
    const delta = { energy, hunger, mood, health }

    const needs = applyNeedsDelta(player.needs, delta)

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
    const needs = applySlotDecay(applyNeedsDelta(player.needs, cfg), 1, get().settings.chill ? CHILL.decayMult : 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...player, needs }, world: { ...world, ...clock } })
    // the skill gain flows through the SAME authority every other XP uses
    get().addSkillXp('smart', cfg.smartXp)
    get().notify({ icon: '📚', text: `${label ?? 'Lesson'} done. Brain dey sharp.`, tone: 'good' })
    get().bumpGoal('study')
    audio.play('notify')
    scheduleAutosave(get)
  },

  nightOut: () => {
    const { player, world } = get()
    if (!player || !world) return
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
    scheduleAutosave(get)
    return true
  },

  /** Back a boat on race-eve — adults only; the bookie settles the morning after. */
  betBoat: (teamId, tier) => {
    const { player, world, calendar, account } = get()
    if (!player || !world) return false
    if (!(FESTIVALS.betTiers as readonly number[]).includes(tier)) return false
    const gate = canBet(calendar, world.day, world.currentLocation, account.ageBand)
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
    } else {
      get().notify({ icon: '🧱', text: `One more segment stand — ${segmentsLeft(after, zoneId)} left for ${zoneName}.`, tone: 'neutral' })
    }
    audio.play('chime')
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
        (transportId === 'walk' && zoneCut(world.day, destinationId) && walkwayOpen(get().rivers, destinationId) ? RIVERS.walkwayMinutesMult : 1),
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
    const { player, world } = get()
    if (!player || !world || amount <= 0) return
    const slot = absoluteSlot(world.day, world.timeOfDay)
    const tx = recordTransaction(meta.label, meta.category, amount, world.day, slot)
    set({
      player: {
        ...player,
        cash: player.cash + amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
        stats: { ...player.stats, totalEarned: player.stats.totalEarned + amount },
      },
      // M9 — juice: every honest naira pops (transform/opacity only)
      pulse: { id: ++pulseId, amount },
    })
    // M9 — the first ₦500 earned completes the onboarding 'earn' step
    if (get().player!.stats.totalEarned >= 500) bumpOnboarding(get, set, 'earn')
    audio.play('chime')
    scheduleAutosave(get)
  },

  removeMoney: (amount, meta) => {
    const { player, world } = get()
    if (!player || !world || amount <= 0) return false
    if (!canAfford(player.cash, amount)) {
      get().notify({ icon: '💸', text: 'You no get that kind money.', tone: 'bad' })
      return false
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    const tx = recordTransaction(meta.label, meta.category, -amount, world.day, slot)
    set({
      player: {
        ...player,
        cash: player.cash - amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
        stats: { ...player.stats, totalSpent: player.stats.totalSpent + amount },
      },
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
    const { player, world } = get()
    if (!player || !world) return

    // 1) cash + ledger entry
    const cash = rewardCash(reward)
    if (cash > 0) {
      const slot = absoluteSlot(world.day, world.timeOfDay)
      const tx = recordTransaction(meta.label, meta.category, cash, world.day, slot)
      set({
        player: {
          ...player,
          cash: player.cash + cash,
          transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
          stats: { ...player.stats, totalEarned: player.stats.totalEarned + cash },
        },
        pulse: { id: ++pulseId, amount: cash },
      })
      audio.play('chime')
      if (get().player!.stats.totalEarned >= 500) bumpOnboarding(get, set, 'earn')
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
    const req = checkRequirements(player, job.requirements)
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

      get().notify({
        icon: result.outcome === 'great' ? '🌟' : '💼',
        text: result.headline,
        tone: 'good',
      })
      get().giveReward(result.reward, { label: job.name, category: 'job' })
      get().bumpGoal('job')
      bumpOnboarding(get, set, 'work')
      if (result.outcome === 'great') audio.play('levelup')
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

  /** M9 — the Guest Loop: claim a name. The account lives on the city's
   *  register (SQLite); the guest save merges into it, nothing is lost. */
  registerAccount: async (input) => {
    const vHandle = validateHandle(input.handle)
    if (!vHandle.ok) return { ok: false, why: vHandle.why }
    const vPin = validatePin(input.pin)
    if (!vPin.ok) return { ok: false, why: vPin.why }
    const vContact = validateContact(input.contact)
    if (!vContact.ok) return { ok: false, why: vContact.why }
    const year = new Date().getFullYear()
    const band = ageBandForYear(input.birthYear, year)
    if (!band) return { ok: false, why: 'Enter the year you were born.' }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: input.handle.trim(), contact: input.contact.trim(), pin: input.pin, ageBand: band }),
      })
      const data = (await res.json()) as { ok?: boolean; why?: string; token?: string }
      if (!res.ok || !data.ok || !data.token) return { ok: false, why: data.why ?? 'The register no gree — try again.' }
      set({
        account: { linked: true, handle: input.handle.trim(), token: data.token, ageBand: band, gateGraceDay: get().world?.day ?? 0 },
        gateOpen: false,
      })
      get().notify({ icon: '🪪', text: `You don claim your name — welcome, ${input.handle.trim()}! Your hustle don dey cloud now.`, tone: 'good' })
      audio.play('levelup')
      scheduleAutosave(get)
      void get().pushCloud()
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
      const data = (await res.json()) as { ok?: boolean; why?: string; token?: string; save?: import('../types').GameSave | null }
      if (!res.ok || !data.ok || !data.token) return { ok: false, why: data.why ?? 'The register no gree — try again.' }
      const local = SaveSystem.load()
      const cloud = data.save ?? null
      if (cloud && local) {
        const verdict = mergeVerdict(local, cloud)
        const winner = verdict.winner === 'cloud' ? cloud : local
        const loser = verdict.backup
        if (loser) {
          // never-lose-progress: the loser lands in the backup slot, byte-safe
          try { localStorage.setItem(BACKUP_KEY, backupPayload(loser)) } catch { /* storage full — the save itself still loads */ }
        }
        set({
          account: { linked: true, handle: input.handle.trim(), token: data.token, ageBand: (cloud.player as unknown as { ageBand?: AccountState['ageBand'] }).ageBand ?? null, gateGraceDay: get().world?.day ?? 0 },
          player: winner.player,
          world: winner.world,
          civic: winner.civic,
          chaos: winner.chaos ?? freshChaosState(),
          calendar: winner.calendar ?? freshCalendarState(),
          rivers: winner.rivers ?? freshRiversState(),
          fleet: winner.fleet ?? { day: winner.world.day, done: [] },
          goals: winner.goals ?? freshGoalState(),
          onboarding: winner.onboarding ?? freshOnboardingState(),
          gateOpen: false,
        })
        get().notify({ icon: '🪪', text: `Welcome back, ${input.handle.trim()}! ${verdict.why}`, tone: 'good' })
      } else {
        set({
          account: { linked: true, handle: input.handle.trim(), token: data.token, ageBand: null, gateGraceDay: get().world?.day ?? 0 },
          gateOpen: false,
        })
        get().notify({ icon: '🪪', text: `Welcome back, ${input.handle.trim()}!`, tone: 'good' })
      }
      audio.play('chime')
      scheduleAutosave(get)
      void get().pushCloud()
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
  },

  closeGate: () => set({ gateOpen: false }),

  /** M9 — push the current save to the cloud (linked accounts only). */
  pushCloud: async () => {
    const { player, world, civic, account } = get()
    if (!player || !world || !civic) return { ok: false, why: 'no game' }
    if (!account.linked || !account.token) return { ok: false, why: 'not linked' }
    get().saveNow()
    const save = SaveSystem.load()
    if (!save) return { ok: false, why: 'no save' }
    try {
      const res = await fetch('/api/cloud/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${account.token}` },
        body: JSON.stringify(SaveSystem.toCloudPayload(save)),
      })
      if (!res.ok) return { ok: false, why: 'cloud refused' }
      return { ok: true }
    } catch {
      return { ok: false, why: 'network' }
    }
  },

  saveNow: () => {
    const { player, world, civic, fleet, chaos, calendar, rivers, goals, onboarding, account, settings } = get()
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
      goals,
      onboarding,
      account,
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
      goals: freshGoalState(),
      onboarding: freshOnboardingState(),
      account: freshAccountState(),
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
