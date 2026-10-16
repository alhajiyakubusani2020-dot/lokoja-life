/**
 * LOKOJA LIFE — THE MENU STORE (SILK II deferred work #2: the store slice)
 * ------------------------------------------------------------------------
 * The audit found the entry chunk carrying the ENTIRE 213KB game store for
 * the menu's five values. This module is the slice: screen, boot, hasSave,
 * settings — and NOTHING else. It statically imports only the save system
 * and the small engines (audio/haptics/music/device); the fat game store
 * (`useGameStore.ts`, every slice and every action) is reached through
 * DYNAMIC imports inside the click handlers, so the menu never pays for
 * the game and the game never disagrees with the menu.
 *
 * THE OWNERSHIP LAW:
 *  - `screen` is OWNED here. The fat store MIRRORS it via a subscription
 *    wired in its own module scope, and every fat screen write routes
 *    through `setScreen` — one writer, one mirror, zero drift.
 *  - `settings` are DISK truth at every boundary: menu toggles patch the
 *    save directly (`SaveSystem.patchSettings` — the same primitive the
 *    fat store uses when autosave is dormant); returning to the game and
 *    back re-reads the disk (`refreshFromDisk`, called by returnToMenu).
 *  - `continueGame`/`resetGame` delegate into the fat store at click time —
 *    by then the dashboard preload has usually already fetched it.
 */
import { create } from 'zustand'
import { SaveSystem } from '../systems/save'
import { syncAudioWithSettings } from '../systems/audio'
import { haptics } from '../systems/haptics'
import { music } from '../systems/music'
import { refreshDeviceProfile } from '../systems/device'
import type { GameSettings, Screen } from '../types'

const DEFAULT_SETTINGS: GameSettings = {
  sound: true,
  graphics: 'auto',
  chill: false,
  elder: false,
  music: false,
  haptics: true,
}

interface MenuState {
  screen: Screen
  booted: boolean
  hasSave: boolean
  settings: GameSettings

  /** menu-critical boot: save detection + settings + the feel engines */
  boot: () => void
  /** THE one screen writer — the fat store mirrors this */
  setScreen: (screen: Screen) => void
  toggleSound: () => void
  setGraphics: (q: GameSettings['graphics']) => void
  /** re-read disk truth (hasSave + settings) — called at menu boundaries */
  refreshFromDisk: () => void
  /** continue: loads the save through the fat store (dynamic, click-time) */
  continueGame: () => Promise<boolean>
  /** delete the save + reset the fat store if it is already loaded */
  resetGame: () => Promise<void>
}

export const useMenuStore = create<MenuState>()((set, get) => ({
  screen: 'menu',
  booted: false,
  hasSave: false,
  settings: { ...DEFAULT_SETTINGS },

  boot: () => {
    const save = SaveSystem.load()
    const settings = save?.settings ?? { ...DEFAULT_SETTINGS }
    syncAudioWithSettings(settings)
    haptics.setEnabled(settings.haptics)
    haptics.setElder(settings.elder)
    music.setEnabled(settings.sound && settings.music)
    set({ booted: true, hasSave: SaveSystem.hasSave(), settings })
  },

  setScreen: (screen) => set({ screen }),

  toggleSound: () => {
    const settings = { ...get().settings, sound: !get().settings.sound }
    syncAudioWithSettings(settings)
    set({ settings })
    // the debounced autosave only runs inside a live game — on the menu, patch the save directly
    SaveSystem.patchSettings(settings)
    // if a live session exists in memory, bring it along (the fat chunk is
    // already loaded in that case — the import resolves instantly)
    void import('./useGameStore')
      .then((m) => {
        const gs = m.useGameStore.getState()
        if (gs.player) m.useGameStore.setState({ settings })
      })
      .catch(() => {})
  },

  setGraphics: (q) => {
    const settings = { ...get().settings, graphics: q }
    refreshDeviceProfile(q) // the session profile re-resolves against the pick
    set({ settings })
    // M7: a pick made on the MAIN MENU must survive — autosave is dormant there
    SaveSystem.patchSettings(settings)
    void import('./useGameStore')
      .then((m) => {
        const gs = m.useGameStore.getState()
        if (gs.player) m.useGameStore.setState({ settings })
      })
      .catch(() => {})
  },

  refreshFromDisk: () => {
    const save = SaveSystem.load()
    set({
      hasSave: SaveSystem.hasSave(),
      settings: save?.settings ?? get().settings,
    })
  },

  continueGame: async () => {
    const { useGameStore } = await import('./useGameStore')
    const ok = useGameStore.getState().continueGame()
    if (ok) get().setScreen('game')
    return ok
  },

  resetGame: async () => {
    SaveSystem.clear()
    set({ hasSave: false })
    try {
      const { useGameStore } = await import('./useGameStore')
      useGameStore.getState().resetGame()
    } catch {
      /* the fat chunk not being loaded is fine — the disk is already clean */
    }
  },
}))

/** the imperative writer the fat store delegates to */
export const menuSetScreen = (s: Screen): void => useMenuStore.getState().setScreen(s)
