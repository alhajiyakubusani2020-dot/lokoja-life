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
  GameNotification,
  GameSave,
  GameSettings,
  Gender,
  PlayerState,
  Reward,
  Screen,
  SkillId,
  Transaction,
  TransactionCategory,
  TransportId,
  WorldState,
} from '../types'
import { STARTING, NEEDS, TRAVEL, WORK, HUSTLE, AUTOSAVE, WORLD3D, MEAL_BY_KEY } from '../data/config'
import { walkingEnergyCost, describeWalkSettle } from '../systems/world3d'
import { DEFAULT_AVATAR } from '../data/avatar'
import { LOCATION_BY_ID } from '../data/locations'
import { JOB_BY_ID } from '../data/jobs'
import { applyNeedsDelta } from '../systems/needs'
import { addXp as processXp, formatNaira } from '../systems/progression'
import { recordTransaction, pushTransaction, canAfford, rewardCash, describeReward } from '../systems/economy'
import { addSkillXp as applySkillXp, SKILL_META } from '../systems/skills'
import { checkRequirements, cooldownRemaining, resolveJob } from '../systems/work'
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
  /** Stage 4 — buy and eat a real meal (cash → hunger/mood, clock moves).
   *  atLocationId: which spot's menu was used — when it differs from where
   *  the player actually is, the ledger records it as a delivery. */
  eatMeal: (mealKey: string, atLocationId?: string) => boolean
  /** Stage 3D — settle the energy cost of one 3D-world visit's walking (0 → no-op) */
  settleWorldWalk: (meters: number) => void

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

/** Debounced autosave — called after every state-mutating action. */
function scheduleAutosave(get: () => GameStore) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    const { player, world, settings } = get()
    if (!player || !world) return
    const existing = SaveSystem.load()
    SaveSystem.write({
      version: SaveSystem.SAVE_VERSION,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      player,
      world,
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
    }
    const world: WorldState = {
      day: 1,
      timeOfDay: 'morning',
      weather: 'sunny',
      currentLocation: 'home',
    }
    set({ player, world, screen: 'game', offers: [] })
    scheduleAutosave(get)
  },

  continueGame: () => {
    const save = SaveSystem.load()
    if (!save) return false
    syncAudioWithSettings(save.settings)
    set({ player: save.player, world: save.world, settings: save.settings, screen: 'game' })
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
    scheduleAutosave(get)
  },

  advanceTime: (slots = 1) => {
    const { world } = get()
    if (!world) return
    const clock = advanceWorldClock(world.timeOfDay, world.day, world.weather, slots)
    set({ world: { ...world, ...clock } })
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

  /** Stage 4 — the eating loop. A meal costs REAL cash (ledger entry), fills
   *  hunger, lifts mood, tops a little energy, and the clock moves one slot
   *  (eating takes time). Same authority pattern as rest/travel. */
  eatMeal: (mealKey, atLocationId) => {
    const { player, world } = get()
    if (!player || !world) return false
    const meal = MEAL_BY_KEY[mealKey]
    if (!meal) return false
    if (!canAfford(player.cash, meal.price)) {
      get().notify({
        icon: '🍲',
        text: `${meal.label} costs ${formatNaira(meal.price)} — you no carry enough cash.`,
        tone: 'bad',
      })
      return false
    }
    // ledger label: eaten there, or delivered to where you actually are
    const spotName = LOCATION_BY_ID[atLocationId ?? world.currentLocation]?.name ?? 'Lokoja'
    const delivered = atLocationId !== undefined && atLocationId !== world.currentLocation
    const label = delivered
      ? `${meal.label} — delivery to ${LOCATION_BY_ID[world.currentLocation]?.name ?? 'home'}`
      : `${meal.label} at ${spotName}`
    // pay first — the ledger remembers every plate
    const ok = get().removeMoney(meal.price, {
      label,
      category: 'shop',
    })
    if (!ok) return false
    // re-read AFTER payment — removeMoney already updated the player object
    const paid = get().player
    if (!paid) return false
    const needs = applyNeedsDelta(paid.needs, {
      hunger: meal.hunger,
      mood: meal.mood,
      energy: meal.energy,
    })
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
    if (!destination.transport.includes(transportId)) return

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
      const needs = applyNeedsDelta(p.needs, {
        energy: -(plan.energyCost + (event?.energyDelta ?? 0)),
        mood: event?.moodDelta ?? 0,
      })
      const clock = advanceWorldClock(w.timeOfDay, w.day, w.weather, plan.slots)

      // Stage 3: record the fare (and any event tip) in the player's ledger
      const arrivalSlot = absoluteSlot(clock.day, clock.timeOfDay)
      const txs: Transaction[] = []
      if (plan.cost > 0) {
        txs.push(
          recordTransaction(`Fare to ${destination.name}`, 'transport', -plan.cost, clock.day, arrivalSlot),
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

      const needs = applyNeedsDelta(p.needs, { energy: -job.energyCost })
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

      const needs = applyNeedsDelta(p.needs, {
        energy: -def.energyCost,
        mood: result.outcome === 'fail' ? WORK.fail.moodDelta : 0,
      })
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
    const { player, world, settings } = get()
    if (!player || !world) return
    const existing = SaveSystem.load()
    SaveSystem.write({
      version: SaveSystem.SAVE_VERSION,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
      player,
      world,
      settings,
    })
    set({ hasSave: true })
  },

  resetGame: () => {
    SaveSystem.clear()
    set({ player: null, world: null, screen: 'menu', hasSave: false })
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
