import { ANCHOR_BY_ID, roadGap, roadGapMajors, riverInfo, SCHOOL_SITES } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
// islands where min-gap >= threshold, on a 2u grid out to 90u
for (const thr of [5.5, 6.6, 7.9]) {
  const found: string[] = []
  for (let x = gov.x - 90; x <= gov.x + 90; x += 2) {
    for (let z = gov.z - 90; z <= gov.z + 90; z += 2) {
      if (Math.hypot(x, z) > 280) continue
      if (Math.min(roadGap(x, z), roadGapMajors(x, z)) >= thr && riverInfo(x, z).d >= 16
        && !SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 8)) {
        found.push(`${x.toFixed(0)},${z.toFixed(0)}:${Math.hypot(x - gov.x, z - gov.z).toFixed(0)}u`)
      }
    }
  }
  console.log(`gap>=${thr}: ${found.length} spots → ${found.slice(0, 8).join(' | ')}`)
}
