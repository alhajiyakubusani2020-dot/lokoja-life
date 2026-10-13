import { BUILDINGS, ANCHOR_BY_ID, roadGap } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
const near = BUILDINGS.filter((b) => Math.hypot(b.x - gov.x, b.z - gov.z) < 45)
for (const b of near) {
  console.log(`block @(${b.x.toFixed(1)},${b.z.toFixed(1)}) dist:${Math.hypot(b.x - gov.x, b.z - gov.z).toFixed(1)} w:${b.w} d:${b.d} gap:${roadGap(b.x, b.z).toFixed(2)} tag:${(b as {tag?:string}).tag ?? '—'}`)
}
