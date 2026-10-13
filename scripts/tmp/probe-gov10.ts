import { roadGapMajors, roadGap, heightAt, riverInfo } from '../../src/game/world3d/layout'
let minMajors = 99, minAt = [0, 0]
let minY = 99, maxY = -99
for (let x = -135.5; x <= -120.5; x += 1) {
  for (let z = 7; z <= 31; z += 1) {
    const m = roadGapMajors(x, z)
    if (m < minMajors) { minMajors = m; minAt = [x, z] }
    const y = heightAt(x, z)
    if (y < minY) minY = y
    if (y > maxY) maxY = y
    if (riverInfo(x, z).d < 16) console.log('RIVER INSIDE at', x.toFixed(0), z.toFixed(0))
  }
}
console.log('campus majors-gap min:', minMajors.toFixed(1), 'at', minAt.join(','))
console.log('campus heights:', minY.toFixed(1), '..', maxY.toFixed(1))
// building spots final check (majors law with corner radius + 0.7)
const spots: [string, number, number, number, number][] = [
  ['gov-house', -128, 27, 12, 7],
  ['kgirs', -132.2, 11.5, 6, 4.4],
  ['nepa', -123.8, 11.5, 6, 4.4],
  ['police', -132.2, 16.7, 6.4, 4.6],
  ['efcc', -123.8, 16.7, 6, 4.4],
]
for (const [n, x, z, w, d] of spots) {
  const need = Math.hypot(w, d) / 2 + 0.7
  console.log(`${n.padEnd(10)} majorsGap:${roadGapMajors(x, z).toFixed(1)} need:${need.toFixed(1)} OK:${roadGapMajors(x, z) >= need}`)
}
