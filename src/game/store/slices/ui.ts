/**
 * UI SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1246-1246, 1249-1249, 1268-1268, 1283-1284, 1305-1305, 4227-4245, 4270-4303, 5550-5560.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, UiSlice } from '../types'
import { syncAudioWithSettings } from '../../systems/audio'
import { refreshDeviceProfile } from '../../systems/device'
import { haptics } from '../../systems/haptics'
import { music } from '../../systems/music'
import { SaveSystem } from '../../systems/save'
import { menuSetScreen } from '../menu-store'
import { scheduleAutosave, nextNotificationId } from '../shared'
import type { GameNotification } from '../../types'

export const uiSlice: StateCreator<GameStore, [], [], UiSlice> = (set, get) => ({
  screen: 'menu',

  notifications: [],

  pulse: null,

  shockwave: 0,
  settings: { sound: true, graphics: 'auto' as const, chill: false, elder: false, music: false, haptics: true },

  setScreen: (screen) => menuSetScreen(screen),

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

  /* ------------------------------ feedback ------------------------------ */

  notify: (n) => {
    // PH2.5: notificationId now lives in shared.ts — this is the same +1
    const notification: GameNotification = { ...n, id: nextNotificationId() }
    set({ notifications: [...get().notifications.slice(-2), notification] })
    setTimeout(() => get().dismissNotification(notification.id), 3200)
  },

  dismissNotification: (id) =>
    set({ notifications: get().notifications.filter((n) => n.id !== id) }),
})
