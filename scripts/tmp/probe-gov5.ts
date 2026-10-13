import { ANCHOR_BY_ID, roadGap, riverInfo, SCHOOL_SITES, WALK_BOUND, heightAt } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
// needed clearance = worst-case corner radius × margin (mirrors buildingClearOfRoad's requirement)
const want = [
  { name: 'gov-house', w: 13, d: 7.5 },
  { name: 'kgirs', w: 8, d: 5.5 },
  { name: 'nepa', w: 7.5, d: 5.2 },
  { name: 'police', w: 7.8, d: 5.4 },
  { name: 'efcc', w: 7.2, d: 5 },
]
const clear = (x: number, z: number, w: number, d: number, taken: { x: number; z: number; w: number; d: number }[]) => {
  const need = Math.hypot(w, d) / 2 * 1.02 + 0.6
  if (roadGap(x, z) < need) return false
  if (riverInfo(x, z).d < 16) return false
  if (SCHOOL_SITES.some((sp) => Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + Math.max(w, d) * 0.72)) return false
  if (Math.hypot(x, z) > WALK_BOUND - 6) return false
  if (taken.some((t) => Math.hypot(t.x - x, t.z - z) < (Math.max(t.w, t.d) + Math.max(w, d)) * 0.75)) return false
  return true
}
const taken: { x: number; z: number; w: number; d: number }[] = []
for (const wl of want) {
  let found: { x: number; z: number } | null = null
  // deterministic spiral outward from the anchor, 2u steps, 16 spokes
  outer: for (let r = 6; r <= 44; r += 2) {
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2 + 0.19
      const x = gov.x + Math.cos(a) * r
      const z = gov.z + Math.sin(a) * r
      if (clear(x, z, wl.w, wl.d, taken)) { found = { x, z }; break outer }
    }
  }
  if (found) {
    taken.push({ x: found.x, z: found.z, w: wl.w, d: wl.d })
    const rot = Math.atan2(found.x - gov.x, found.z - gov.z) // face the anchor
    console.log(`${wl.name.padEnd(10)} @ (${found.x.toFixed(1)}, ${found.z.toFixed(1)}) r:${Math.hypot(found.x - gov.x, found.z - gov.z).toFixed(1)} rotY:${rot.toFixed(2)} y:${heightAt(found.x, found.z).toFixed(1)}`)
  } else {
    console.log(`${wl.name}: NO SPOT within 44u`)
  }
}
