/**
 * LOKOJA LIFE — Game Store (Zustand)
 * -----------------------------------
 * The single source of truth for live game state.
 *
 * Persistence strategy: explicit, versioned saves via SaveSystem
 * (localStorage now, Supabase later) + debounced autosave.
 * We deliberately do NOT use zustand/persist so the saved schema
 * stays clean and cloud-migratable instead of dumping raw store state.
 *
 * PH2.5 GOD-STORE SPLIT: the old 5,575-line monolith now lives in
 * src/game/store/slices/<domain>.ts (one slice per domain, code moved
 * VERBATIM) + src/game/store/shared.ts (module-level state + cross-domain
 * helpers) + src/game/store/types.ts (the slice interfaces + GameStore).
 * This file is ONLY the composition: one create() over the slice spread,
 * the store-ref binding, the menu screen mirror, and the public type
 * re-exports. The public API is unchanged — same default surface, same
 * import path '@/game/store/useGameStore', same single store instance.
 */

import { create } from 'zustand'
import type { GameStore } from './types'
import { uiSlice } from './slices/ui'
import { saveBootSlice } from './slices/saveBoot'
import { playerSlice } from './slices/player'
import { worldSlice } from './slices/world'
import { economySlice } from './slices/economy'
import { vehiclesSlice } from './slices/vehicles'
import { ladderSlice } from './slices/ladder'
import { socialSlice } from './slices/social'
import { lifestyleSlice } from './slices/lifestyle'
import { pulseSlice } from './slices/pulse'
import { netSlice } from './slices/net'
import { useGameStoreRef } from './shared'
import { useMenuStore } from './menu-store'

export const useGameStore = create<GameStore>()((...a) => ({
  ...uiSlice(...a),
  ...saveBootSlice(...a),
  ...playerSlice(...a),
  ...worldSlice(...a),
  ...economySlice(...a),
  ...vehiclesSlice(...a),
  ...ladderSlice(...a),
  ...socialSlice(...a),
  ...lifestyleSlice(...a),
  ...pulseSlice(...a),
  ...netSlice(...a),
}))

useGameStoreRef.getState = () => useGameStore.getState()
useGameStoreRef.setState = (partial) => useGameStore.setState(partial)

/* THE SCREEN MIRROR — the menu store owns `screen` (SILK II: the menu
 * slice is all the entry chunk carries); the fat store mirrors it so every
 * in-game reader stays reactive without a repo-wide migration. One writer,
 * one mirror, zero drift. Wired at module scope so tests and the browser
 * share the exact same law. */
useMenuStore.subscribe((s, prev) => {
  if (s.screen !== prev.screen && useGameStore.getState().screen !== s.screen) {
    useGameStore.setState({ screen: s.screen })
  }
})

/* PH2.5 — public type surface (additive; the monolith never exported types).
 * Consumers keep importing only { useGameStore }; these re-exports exist so
 * tests/scripts can name slice types without reaching into internals. */
export type {
  GameStore,
  UiSlice,
  SaveBootSlice,
  PlayerSlice,
  WorldSlice,
  EconomySlice,
  VehiclesSlice,
  LadderSlice,
  SocialSlice,
  LifestyleSlice,
  PulseSlice,
  NetSlice,
} from './types'
