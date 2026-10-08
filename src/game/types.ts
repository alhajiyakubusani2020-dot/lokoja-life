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

export interface Skills {
  /** 💪 physical / market / practical */
  hustle: number
  /** 🧠 business / office / strategy */
  smart: number
  /** 🗣️ negotiation / tourism / dialogue */
  social: number
}

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

export interface PlayerState {
  name: string
  gender: Gender
  avatar: AvatarConfig

  /** 💰 Nigerian Naira */
  cash: number

  needs: Needs
  skills: Skills

  /** ⭐ 0 – 2500+ */
  reputation: number
  level: number
  xp: number

  /** 🏠 id from HOUSING data */
  homeId: string
  /** 💼 id from JOBS data, null = unemployed */
  jobId: string | null

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
