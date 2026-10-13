import { ANCHOR_BY_ID, roadGapMajors, roadGap } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
// scan for MAJORS-free pockets (fence-clip makes minors yield inside a compound)
for (let r = 8; r <= 40; r += 4) {
  let bestM = -99, bestSpot: [number, number] = [0, 0]
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2
    const x = gov.x + Math.cos(a) * r
    const z = gov.z + Math.sin(a) * r
    const g = roadGapMajors(x, z)
    if (g > bestM) { bestM = g; bestSpot = [x, z] }
  }
  console.log(`r=${String(r).padStart(2)} majors-gap best:${bestM.toFixed(1)} at (${bestSpot[0].toFixed(0)},${bestSpot[1].toFixed(0)})`)
}
// majors-gap field in the 12..32u band, 2u grid — contiguous campus candidates (>= 6.5)
const pts: string[] = []
for (let x = gov.x - 32; x <= gov.x + 32; x += 2) {
  for (let z = gov.z - 32; z <= gov.z + 32; z += 2) {
    if (roadGapMajors(x, z) >= 6.5) pts.push(`${x.toFixed(0)},${z.toFixed(0)}:${roadGapMajors(x, z).toFixed(1)}/${roadGap(x, z).toFixed(1)}`)
  }
}
console.log('campus candidates (majors>=6.5):', pts.length)
console.log(pts.slice(0, 20).join(' | '))
