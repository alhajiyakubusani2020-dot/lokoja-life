/**
 * LOKOJA LIFE — Save System
 * --------------------------
 * Versioned localStorage persistence with a migration hook.
 *
 * The schema (GameSave) maps 1:1 to a future Supabase table —
 * switching to cloud saves later means swapping the transport
 * functions below for async Supabase calls, nothing else.
 */

import type { GameSave, PlayerState, CivicState } from '../types'
import { freshCivicState } from './civic'

const SAVE_KEY = 'lokoja-life:save'
const SAVE_VERSION = 4

/** Check localStorage availability without throwing (private mode etc). */
function storageAvailable(): boolean {
  try {
    const probe = '__lko_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/** Serialize the save into the storage-safe JSON string. */
function serialize(save: GameSave): string {
  return JSON.stringify({ ...save, version: SAVE_VERSION })
}

/**
 * Parse + migrate an old save string into the current shape.
 * Each case below upgrades one version step; future versions
 * add their own `case N` — never break existing players.
 */
function deserialize(raw: string): GameSave | null {
  try {
    const parsed = JSON.parse(raw) as GameSave

    if (!parsed || typeof parsed !== 'object' || !parsed.player) return null

    let save = parsed
    switch (save.version) {
      case 1:
        // v1 → v2 (Stage 3): economy/work fields added to the player.
        // All are defaulted below — nothing a v1 player had is lost.
        save.version = 2
        break
      case 2:
        // v2 → v3 (Stage 5): vehicles, bank balance, NPC relationships.
        // Defaults applied below — a v2 player wakes up with an empty
        // garage, an empty bank account, and strangers for friends.
        save.version = 3
        break
      case 3:
        // v3 → v4 (M2): the civic mesh — NEPA/KGIRS/police/EFCC/market.
        // freshCivicState() below gives a v3 player a clean civic slate:
        // no bills owed, no warrant, a rolled market for their current day.
        save.version = 4
        break
      case 4:
        // current version
        break
      default:
        // Unknown / newer save from a newer app version — keep it, best effort.
        break
    }

    // --- defensive defaults (never break a loadable save) ---
    if (!save.world) {
      save.world = {
        day: 1,
        timeOfDay: 'morning',
        weather: 'sunny',
        currentLocation: 'home',
      }
    }
    if (!save.world.currentLocation) save.world.currentLocation = 'home'
    if (!save.settings) save.settings = { sound: true }

    // --- Stage 3 player fields (missing on v1 saves / corrupt data) ---
    const p = save.player as PlayerState
    if (!p.skillXp) p.skillXp = { hustle: 0, smart: 0, social: 0 }
    if (!p.activeOpportunities) p.activeOpportunities = []
    if (!p.cooldowns) p.cooldowns = {}
    if (!p.transactions) p.transactions = []
    if (!p.stats) {
      p.stats = { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }
    }

    // --- Stage 5 player fields (missing on v2-and-older saves) ---
    if (!p.vehicles) p.vehicles = []
    if (typeof p.bankBalance !== 'number') p.bankBalance = 0
    if (!p.relationships) p.relationships = {}

    // --- M2 civic mesh (missing on v3-and-older saves) ---
    if (!save.civic) {
      save.civic = freshCivicState()
    } else {
      // defensive merge — a partially-written civic slice still loads
      const fresh = freshCivicState()
      save.civic = {
        nepa: { ...fresh.nepa, ...save.civic.nepa },
        kgirs: { ...fresh.kgirs, ...save.civic.kgirs },
        police: { ...fresh.police, ...save.civic.police },
        efcc: { ...fresh.efcc, ...save.civic.efcc, pending: save.civic.efcc?.pending ?? [] },
        market: { ...fresh.market, ...save.civic.market },
      }
    }

    save.version = SAVE_VERSION
    return save
  } catch {
    return null
  }
}

export const SaveSystem = {
  SAVE_KEY,
  SAVE_VERSION,

  /** Does a local save exist? */
  hasSave(): boolean {
    if (!storageAvailable()) return false
    return window.localStorage.getItem(SAVE_KEY) !== null
  },

  /** Load and validate the save, or null if none / corrupt. */
  load(): GameSave | null {
    if (!storageAvailable()) return null
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    return deserialize(raw)
  },

  /** Persist the save. Returns false if storage is unavailable. */
  write(save: GameSave): boolean {
    if (!storageAvailable()) return false
    try {
      window.localStorage.setItem(SAVE_KEY, serialize(save))
      return true
    } catch {
      return false
    }
  },

  /** Remove the save (used by "Start Over"). */
  clear(): void {
    if (!storageAvailable()) return
    window.localStorage.removeItem(SAVE_KEY)
  },

  /**
   * Shape a save for future cloud upload (Supabase row).
   * Kept as a pure function so the online migration is a transport swap.
   */
  toCloudPayload(save: GameSave) {
    return {
      schema_version: save.version,
      data: save,
      updated_at: new Date(save.updatedAt).toISOString(),
    }
  },
}
