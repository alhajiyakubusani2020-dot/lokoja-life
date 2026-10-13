import { ANCHORS, BRIDGES } from '../../src/game/world3d/layout'
import { LOCATIONS } from '../../src/game/data/locations'
const lvl = new Map(LOCATIONS.map((l) => [l.id, l.unlockLevel]))
const rows: { id: string; lvl: number; bridge: number; dist: number }[] = []
for (const a of ANCHORS) {
  let best = -1, bd = Infinity
  BRIDGES.forEach((b, i) => {
    const d = Math.hypot(b.x - a.x, b.z - a.z)
    if (d < bd) { bd = d; best = i }
  })
  rows.push({ id: a.id, lvl: lvl.get(a.id) ?? 99, bridge: best, dist: Math.round(bd) })
}
rows.sort((r, r2) => r.dist - r2.dist)
console.log('--- level-1 reachable ---')
for (const r of rows.filter((r) => r.lvl === 1)) console.log(`${r.id.padEnd(20)} bridge#${r.bridge}  ${r.dist}u`)
console.log('--- locked ---')
for (const r of rows.filter((r) => r.lvl > 1)) console.log(`${r.id.padEnd(20)} L${r.lvl}  bridge#${r.bridge}  ${r.dist}u`)
