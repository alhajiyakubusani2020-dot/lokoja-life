/**
 * PLAYER SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1251-1251, 1261-1261, 1486-1621, 2165-2249, 3486-3560, 3898-3912, 4202-4218, 4220-4225, 4247-4268.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, PlayerSlice } from '../types'
import { DEFAULT_AVATAR } from '../../data/avatar'
import {
  NEEDS,
  WORLD3D,
  INTERIOR,
  MEAL_BY_KEY,
  TIME,
  WEATHER_META,
  CHILL,
  FESTIVALS,
  LADDER,
  SHIELD,
} from '../../data/config'
import { LOCATION_BY_ID } from '../../data/locations'
import { audio } from '../../systems/audio'
import { isIftarHour } from '../../systems/calendar'
import { blackoutAt } from '../../systems/chaos'
import {
  freshCivicState,
  marketMealPrice,
  marketForDay,
} from '../../systems/civic'
import { canAfford } from '../../systems/economy'
import { bumpGoal, freshGoalState } from '../../systems/goals'
import { haptics } from '../../systems/haptics'
import { homeComfort } from '../../systems/housing'
import { applyNeedsDelta, applySlotDecay } from '../../systems/needs'
import { addXp as processXp, formatNaira } from '../../systems/progression'
import {
  isNightMarketOpen,
  nightMealPrice,
  mealAvailableAt,
} from '../../systems/seasons'
import { crimeAllowed, CRIME_REFUSALS } from '../../systems/shield'
import { addSkillXp as applySkillXp, SKILL_META } from '../../systems/skills'
import {
  nextSlot,
  rollNewDayWeather,
  weatherForSlot,
  advanceWorldClock,
} from '../../systems/world'
import { walkingEnergyCost, describeWalkSettle } from '../../systems/world3d'
import {
  scheduleAutosave,
  commitCivicDays,
  bumpOnboarding,
  slotDecay,
} from '../shared'
import type { WorldState } from '../../types'

export const playerSlice: StateCreator<GameStore, [], [], PlayerSlice> = (set, get) => ({
  player: null,

  goals: freshGoalState(),

  /* --------------------------- needs / time ----------------------------- */

  rest: (kind) => {
    const { player, world } = get()
    if (!player || !world) return
    // busy-guard: no clock-advancing actions mid-shift/mid-travel
    if (get().isWorking || get().isTravelling) return

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
    // busy-guard: no clock-advancing actions mid-shift/mid-travel
    if (get().isWorking || get().isTravelling) return
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
    // busy-guard: no clock-advancing actions mid-shift/mid-travel
    if (get().isWorking || get().isTravelling) return
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
    // busy-guard: no clock-advancing actions mid-shift/mid-travel
    if (get().isWorking || get().isTravelling) return
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
})
