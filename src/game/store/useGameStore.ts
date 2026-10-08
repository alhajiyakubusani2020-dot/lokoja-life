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
  AvatarConfig,
  GameNotification,
  GameSave,
  GameSettings,
  Gender,
  PlayerState,
  Screen,
  TimeOfDay,
  Weather,
  WorldState,
} from '../types'
import { STARTING, TIME, NEEDS, AUTOSAVE } from '../data/config'
import { DEFAULT_AVATAR } from '../data/avatar'
import { applyNeedsDelta } from '../systems/needs'
import { addXp as processXp } from '../systems/progression'
import { SaveSystem } from '../systems/save'
import { audio, syncAudioWithSettings } from '../systems/audio'

/* ------------------------------ helpers ------------------------------ */

/** Advance a time-of-day slot; returns new slot + day delta. */
function nextSlot(t: TimeOfDay): { timeOfDay: TimeOfDay; dayDelta: number } {
  const idx = TIME.slots.indexOf(t)
  const next = TIME.slots[(idx + 1) % TIME.slots.length]
  return { timeOfDay: next, dayDelta: next === 'morning' ? 1 : 0 }
}

/** Pick a random weather for a new day, weighted by config. */
function rollNewDayWeather(): Weather {
  const entries = Object.entries(TIME.weatherWeights) as Array<[Weather, number]>
  const total = entries.reduce((sum, [, w]) => sum + w, 0)
  let roll = Math.random() * total
  for (const [weather, weight] of entries) {
    roll -= weight
    if (roll <= 0) return weather
  }
  return 'sunny'
}

/** Night-time weather is always clear night. */
function weatherForSlot(weather: Weather, timeOfDay: TimeOfDay): Weather {
  if (timeOfDay === 'night') return 'night-clear'
  if (weather === 'night-clear') return 'sunny'
  return weather
}

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

  /* needs / time actions (Stage 1: rest is the first real mechanic) */
  rest: (kind: 'nap' | 'sleep') => void
  advanceTime: (slots?: number) => void

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
    set({ player, world, screen: 'game' })
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
    let { timeOfDay, day } = world
    let weather = world.weather
    for (let i = 0; i < slots; i++) {
      const r = nextSlot(timeOfDay)
      timeOfDay = r.timeOfDay
      day += r.dayDelta
      weather = weatherForSlot(weather, timeOfDay)
    }
    set({ world: { ...world, timeOfDay, day, weather } })
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
