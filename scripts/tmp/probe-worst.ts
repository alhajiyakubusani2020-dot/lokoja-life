import { BUILDINGS, roadGap, roadGapMajors, inCivicCampus } from '../../src/game/world3d/layout'
const cornerGapWorst = (b: { x: number; z: number; w: number; d: number; rotY: number }): number => {
  const c = Math.cos(b.rotY)
  const s = Math.sin(b.rotY)
  let worst = Infinity
  for (const [hw, hd] of [[b.w / 2, b.d / 2], [-b.w / 2, b.d / 2], [b.w / 2, -b.d / 2], [-b.w / 2, -b.d / 2]]) {
    const cx = b.x + c * hw + s * hd
    const cz = b.z - s * hw + c * hd
    worst = Math.min(worst, inCivicCampus(cx, cz) ? roadGapMajors(cx, cz) : roadGap(cx, cz))
  }
  return worst
}
const rows = BUILDINGS.map((b) => ({ b, g: cornerGapWorst(b) })).sort((a, r) => a.g - r.g)
for (const r of rows.slice(0, 5)) {
  console.log(`gap:${r.g.toFixed(2)} kind:${r.b.kind} tag:${(r.b as { tag?: string }).tag ?? '—'} @(${r.b.x.toFixed(1)},${r.b.z.toFixed(1)}) w:${r.b.w} d:${r.b.d} campus:${inCivicCampus(r.b.x, r.b.z)}`)
}
