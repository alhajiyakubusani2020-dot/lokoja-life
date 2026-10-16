/**
 * SILK II — THE WORLD GEO GATE
 * ----------------------------
 * The world's data (roads/rivers/bridges/loops) now lives in
 * `/world/geo-v1.bin` (60KB binary vs 432KB decimal text — element-exact
 * round-trip proven on 70,828 comparisons). layout.ts and schools.ts
 * derive their module-scope structures from those arrays, so the data
 * MUST be filled before either module is evaluated.
 *
 * This gate is the barrier: the Dashboard's next/dynamic loader and the
 * idle preload BOTH route through `openWorldGeo()` — the geo chunk (this
 * file + geo.ts) evaluates first, the fetch fires, and only after the
 * arrays are filled does `import('../world/WorldTab')` evaluate the
 * three.js chunk with layout.ts inside. The first `import()` of the gate
 * and the WorldTab import overlap the three.js download, so on a warm
 * cache the geo fetch is effectively free; on a cold boot it rides under
 * the bigger chunk's transfer shadow.
 */
import { initGeo } from './geo'

let gate: Promise<void> | null = null

/** open the gate once — idempotent across every caller */
export function openWorldGeo(): Promise<void> {
  if (!gate) {
    gate = initGeo().catch((e) => {
      gate = null // the next world attempt retries the fetch
      throw e
    })
  }
  return gate
}

/** idle preload — warms the gate AND the three.js chunk in one idle window */
export function warmWorldChunk(): void {
  void openWorldGeo()
    .then(() => import('../../components/game/world/WorldTab'))
    .catch(() => {
      /* a failed prefetch is harmless — the on-demand path retries */
    })
}
