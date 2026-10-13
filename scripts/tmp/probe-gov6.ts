import { ANCHOR_BY_ID, roadGap, roadGapMajors } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
let bestAny = -99, bestSpot: [number, number] = [0, 0]
for (let r = 4; r <= 46; r += 2) {
  let bestRing = -99
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2
    const x = gov.x + Math.cos(a) * r
    const z = gov.z + Math.sin(a) * r
    const g = Math.min(roadGap(x, z), roadGapMajors(x, z))
    if (g > bestRing) { bestRing = g; if (g > bestAny) { bestAny = g; bestSpot = [x, z] } }
  }
  if (r % 6 === 0) console.log(`r=${r} best gap on ring: ${bestRing.toFixed(2)}`)
}
console.log('BEST min-gap within 46u:', bestAny.toFixed(2), 'at', bestSpot.map((v) => v.toFixed(1)).join(','))
