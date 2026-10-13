import { riverInfo, SCHOOL_SITES, roadGap, ANCHOR_BY_ID, heightAt } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
const spots = [
  { name: 'center-bank', x: gov.x, z: gov.z, w: 12.5, d: 7.5 },
  { name: 'gov-house', x: gov.x + 2, z: gov.z - 13, w: 14, d: 8.5 },
  { name: 'kgirs', x: gov.x - 11, z: gov.z + 7, w: 8.5, d: 6 },
  { name: 'nepa', x: gov.x + 12, z: gov.z + 6, w: 8, d: 5.6 },
  { name: 'police', x: gov.x - 12, z: gov.z - 7, w: 8.2, d: 5.8 },
  { name: 'efcc', x: gov.x + 13, z: gov.z - 8, w: 7.6, d: 5.4 },
]
for (const s of spots) {
  const river = riverInfo(s.x, s.z).d
  const school = SCHOOL_SITES.some((sp) => Math.hypot(sp.x - s.x, sp.z - s.z) < sp.plateauR + Math.max(s.w, s.d) * 0.72)
  const gap = roadGap(s.x, s.z)
  console.log(`${s.name.padEnd(12)} river:${river.toFixed(1)} schoolHit:${school} roadGap:${gap.toFixed(2)}`)
}
console.log('heightAt center:', heightAt(gov.x, gov.z))
