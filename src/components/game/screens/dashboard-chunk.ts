/**
 * PERF (M3): preload hook for the Dashboard (game) chunk.
 * Lives in its own tiny module so importing this does NOT pull the
 * Dashboard module graph (three.js, the 3D world) into the entry bundle.
 * The menu calls this once it is interactive; the browser then fetches the
 * game bundle in the background while the player reads the menu.
 */
export function preloadDashboard(): void {
  void import('./Dashboard').catch(() => {
    /* the dynamic import happens again on demand — a failed prefetch is harmless */
  })
}
