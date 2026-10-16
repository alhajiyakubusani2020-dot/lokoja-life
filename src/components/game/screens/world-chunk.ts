/**
 * SILK II — preload hook for the WORLD chunk (the same law as
 * dashboard-chunk.ts, one layer deeper): three.js + the OSM geo stack ride
 * their own chunk since the Dashboard no longer static-imports WorldTab.
 * The Dashboard calls this once mounted; the browser warms the 3D bundle
 * in the first idle window, so a player heading for the streets never
 * waits — and a map-first / phone-first session never downloads it at all.
 */
export function preloadWorldChunk(): void {
  void import('../world/WorldTab').catch(() => {
    /* the dynamic import happens again on demand — a failed prefetch is harmless */
  })
}
