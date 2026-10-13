import { ANCHORS, BRIDGES } from '../../src/game/world3d/layout'
const rows: { id: string; bridge: number; dist: number }[] = []
for (const a of ANCHORS) {
  let best = -1, bd = Infinity
  BRIDGES.forEach((b, i) => {
    const d = Math.hypot(b.x - a.x, b.z - a.z)
    if (d < bd) { bd = d; best = i }
  })
  rows.push({ id: a.id, bridge: best, dist: Math.round(bd) })
}
rows.sort((r, r2) => r.dist - r2.dist)
for (const r of rows) console.log(`${r.id.padEnd(22)} bridge#${r.bridge}  ${r.dist}u`)
