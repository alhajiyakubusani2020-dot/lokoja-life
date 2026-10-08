/**
 * LOKOJA LIFE — Save System
 * --------------------------
 * Versioned localStorage persistence with a migration hook.
 *
 * The schema (GameSave) maps 1:1 to a future Supabase table —
 * switching to cloud saves later means swapping the transport
 * functions below for async Supabase calls, nothing else.
 */

import type { GameSave } from '../types'

const SAVE_KEY = 'lokoja-life:save'
const SAVE_VERSION = 1

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
        // current version — nothing to do yet
        break
      default:
        // Unknown / newer save from a newer app version — keep it, best effort.
        break
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
