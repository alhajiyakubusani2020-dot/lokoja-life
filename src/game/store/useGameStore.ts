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
  ShopUpgradeId,
} from '../types'
import { STARTING, NEEDS, TRAVEL, WORK, HUSTLE, AUTOSAVE, WORLD3D, INTERIOR, MEAL_BY_KEY } from '../data/config'
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
import { canChat, relationshipFor, tierFor, pickLine, afterChat } from '../systems/social'
import {
  generateHustleOffers,
  hustleDefFor,
  pruneExpiredOpportunities,
  resolveOpportunity,
} from '../systems/opportunities'
import { SaveSystem } from '../systems/save'
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
import { gigBoard, gigLabel } from '../systems/fleet'
import { BIZ, CIVIC, FLEET } from '../data/config'

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
  /** Bank: bankBalance → pocket cash. */
  bankWithdraw: (amount: number) => boolean
  /** Talk with an NPC — familiarity + one warm line. Null = cooldown / guard. */
  chatNpc: (npcId: string) => ChatOutcome | null
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
  saveNow: () => void
  resetGame: () => void

  /* feedback */
  notify: (n: Omit<GameNotification, 'id'>) => void
  dismissNotification: (id: number) => void
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
let notificationId = 0

/** Ledger cap — newest entries survive, old ones fall off. */
const LEDGER_CAP = 50

/* ------------------------- M2 — civic day machinery ------------------------- */

/** Aggregated results of rolling the civic mesh across one or more days. */
interface CivicAgg {
  nepaPosted: number
  nepaShed: boolean
  taxAssessed: number
  warrantIssued: boolean
  tipsResolved: import('../types').EfccTip[]
  tipReward: number
}

/** Pure: roll the civic mesh forward day by day (assessments land on exact days). */
function civicRollForDays(civic: CivicState, totalEarned: number, prevDay: number, newDay: number, bizCount = 0, solarCount = 0): { civic: CivicState; agg: CivicAgg } {
  let cur = civic
  const agg: CivicAgg = { nepaPosted: 0, nepaShed: false, taxAssessed: 0, warrantIssued: false, tipsResolved: [], tipReward: 0 }
  for (let d = prevDay + 1; d <= newDay; d++) {
    const r = civicDayRoll(cur, totalEarned, d, bizCount, solarCount)
    cur = r.next
    agg.nepaPosted += r.nepaPosted
    agg.nepaShed = agg.nepaShed || r.nepaShed
    agg.taxAssessed += r.taxAssessed
    agg.warrantIssued = agg.warrantIssued || r.warrantIssued
    agg.tipsResolved = [...agg.tipsResolved, ...r.tipsResolved]
    agg.tipReward += r.tipReward
  }
  return { civic: cur, agg }
}

/** Execute a civic day crossing: set the slice, pay whistleblower rewards,
 *  apply the shedding mood hit and the warrant reputation hit, narrate it. */
function commitCivicDays(
  get: () => GameStore,
  set: (partial: Partial<GameStore>) => void,
  prevDay: number,
  newDay: number,
): void {
  const { civic, player, world } = get()
  if (!civic || !player || !world || newDay <= prevDay) return
  const bizCount = player.businesses.length
  // M5 — solar shops draw from the sun: their share of the meter load drops
  const solarCount = player.businesses.filter((b) => b.upgrades.includes('solar')).length
  const { civic: rolled, agg } = civicRollForDays(civic, player.stats.totalEarned, prevDay, newDay, bizCount, solarCount)
  set({ civic: rolled })

  // M3 — the shops earn while the city turns: accrue into each till (market
  // multipliers read the ALREADY-ROLLED civic slice). Tax only sees this
  // money when it is collected (addMoney → ledger → totalEarned).
  if (player.businesses.length > 0) {
    const bizRes = bizDayRoll(player.businesses, prevDay, newDay, rolled, player.reputation)
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
  settings: { sound: true },

  isTravelling: false,
  isWorking: false,
  workingLabel: null,
  offers: [],

  /* ----------------------------- lifecycle ----------------------------- */

  boot: () => {
    const save = SaveSystem.load()
    syncAudioWithSettings(save?.settings ?? { sound: true })
    set({ booted: true, hasSave: SaveSystem.hasSave(), settings: save?.settings ?? { sound: true } })
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
    set({ player, world, civic: freshCivicState(), fleet: { day: 1, done: [] }, screen: 'game', offers: [] })
    scheduleAutosave(get)
  },

  continueGame: () => {
    const save = SaveSystem.load()
    if (!save) return false
    syncAudioWithSettings(save.settings)
    set({ player: save.player, world: save.world, civic: save.civic, fleet: save.fleet, settings: save.settings, screen: 'game' })
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
    // M2 — load-shedding is real: no light, no TV
    if (kind === 'tv' && civic?.nepa.shedding) {
      get().notify({
        icon: '🔌',
        text: 'NEPA don take the light — the TV just dey look you. Settle the bill first.',
        tone: 'bad',
      })
      audio.play('notify')
      return
    }
    const r = INTERIOR.relax[kind]
    const needs = applyNeedsDelta(applySlotDecay(player.needs, 1), r)
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
   *  menu rows and eatMeal both read, so display can never drift from charge. */
  mealPriceAt: (mealKey, locationId) => {
    const { world, civic } = get()
    const meal = MEAL_BY_KEY[mealKey]
    if (!meal || !world) return meal?.price ?? 0
    const c = marketForDay(civic ?? freshCivicState(), world.day)
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

    const gig = gigBoard(world.day, player.vehicles, player.level, world.weather).find((g) => g.id === gigId)
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
      const needs = applySlotDecay(applyNeedsDelta(paid.needs, { energy: -gig.energyCost }), 1)
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
    const needs = applySlotDecay(applyNeedsDelta(player.needs, INTERIOR.gym), 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...player, needs }, world: { ...world, ...clock } })
    get().notify({ icon: '💪', text: 'Gym session done. Body dey thank you.', tone: 'good' })
    audio.play('notify')
    scheduleAutosave(get)
  },

  study: (label) => {
    const { player, world } = get()
    if (!player || !world) return
    const cfg = INTERIOR.study
    const needs = applySlotDecay(applyNeedsDelta(player.needs, cfg), 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...player, needs }, world: { ...world, ...clock } })
    // the skill gain flows through the SAME authority every other XP uses
    get().addSkillXp('smart', cfg.smartXp)
    get().notify({ icon: '📚', text: `${label ?? 'Lesson'} done. Brain dey sharp.`, tone: 'good' })
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
    const needs = applySlotDecay(applyNeedsDelta(paid.needs, shift), 1)
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
    audio.play('chime')
    scheduleAutosave(get)
    return true
  },

  bankWithdraw: (amount) => {
    const { player, world } = get()
    if (!player || !world || amount <= 0) return false
    if (player.bankBalance < amount) {
      get().notify({ icon: '🏦', text: 'Your bank balance no reach that amount.', tone: 'bad' })
      return false
    }
    const slot = absoluteSlot(world.day, world.timeOfDay)
    const tx = recordTransaction('Bank withdrawal', 'bank', amount, world.day, slot)
    set({
      player: {
        ...player,
        cash: player.cash + amount,
        bankBalance: player.bankBalance - amount,
        transactions: pushTransaction(player.transactions, tx, LEDGER_CAP),
      },
    })
    get().notify({ icon: '🏦', text: `${formatNaira(amount)} don comot from bank.`, tone: 'good' })
    audio.play('notify')
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
    set({ player: { ...player, relationships: { ...player.relationships, [npcId]: next } } })
    get().addSkillXp('social', 2)
    scheduleAutosave(get)
    return { npcId, tier, familiarity: next.familiarity, reply, firstMeeting }
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
   *  (eating takes time). Same authority pattern as rest/travel. */
  eatMeal: (mealKey, atLocationId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const meal = MEAL_BY_KEY[mealKey]
    if (!meal) return false
    // M2 — markets breathe: today's honest price at this spot (base outside markets)
    const spot = atLocationId ?? world.currentLocation
    let civic = get().civic ?? freshCivicState()
    const rolled = marketForDay(civic, world.day)
    if (rolled !== civic) {
      civic = rolled
      set({ civic })
    }
    const price = marketMealPrice(meal.price, mealKey, spot, civic, world.day)
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
      mood: meal.mood,
      energy: meal.energy,
    }), 1)
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, 1)
    set({ player: { ...paid, needs }, world: { ...world, ...clock } })
    get().notify({
      icon: '🍲',
      text: `${meal.label} — hunger restored. You feel better.`,
      tone: 'good',
    })
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

    // pure calculation — same inputs always give the same plan
    const plan = calculateTravel(origin, destination, transportId, world.weather, world.timeOfDay)
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
      }), plan.slots)
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
    })
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
      })
      audio.play('chime')
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

      const needs = applySlotDecay(applyNeedsDelta(p.needs, { energy: -job.energyCost }), job.timeSlots)
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
      }), def.timeSlots)
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
    scheduleAutosave(get)
  },

  saveNow: () => {
    const { player, world, civic, fleet, settings } = get()
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
      settings,
    })
    set({ hasSave: true })
  },

  resetGame: () => {
    SaveSystem.clear()
    set({ player: null, world: null, civic: null, fleet: { day: 1, done: [] }, screen: 'menu', hasSave: false })
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
