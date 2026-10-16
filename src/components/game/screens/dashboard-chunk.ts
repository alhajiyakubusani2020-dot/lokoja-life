/**
 * PERF (M3 + SILK II): preload hook for the Dashboard (game) chunk.
 * Lives in its own tiny module so importing this does NOT pull the
 * Dashboard module graph (the fat store, three.js, the 3D world) into the
 * entry bundle. The menu calls this once it is interactive; the browser
 * then fetches the game bundle in the background while the player reads
 * the menu — and once it lands, the fat store's world-boot hooks (the
 * postcard decode + the offline queue) run, so a continue click is instant.
 */
export function preloadDashboard(): void {
  void import('./Dashboard')
    .then(() => import('@/game/store/useGameStore'))
    .then((m) => m.useGameStore.getState().bootWorldHooks())
    .catch(() => {
      /* the dynamic import happens again on demand — a failed prefetch is harmless */
    })
}
