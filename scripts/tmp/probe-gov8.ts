import { ANCHOR_BY_ID, roadGap, roadGapMajors, riverInfo, SCHOOL_SITES } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
const spots: { x: number; z: number; d: number; g: number }[] = []
for (let x = gov.x - 90; x <= gov.x + 90; x += 1.5) {
  for (let z = gov.z - 90; z <= gov.z + 90; z += 1.5) {
    if (Math.hypot(x, z) > 280) continue
    const g = Math.min(roadGap(x, z), roadGapMajors(x, z))
    if (g >= 5.5 && riverInfo(x, z).d >= 16 && !SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 8)) {
      spots.push({ x, z, d: Math.hypot(x - gov.x, z - gov.z), g })
    }
  }
}
spots.sort((a, b) => a.d - b.d)
console.log('total islands:', spots.length)
for (const s of spots.slice(0, 14)) console.log(`(${s.x.toFixed(0)},${s.z.toFixed(0)}) dist:${s.d.toFixed(0)}u gap:${s.g.toFixed(1)}`)
