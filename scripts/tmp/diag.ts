import { ROADS, BRIDGES, riverInfo, RIVERS, CONFLUENCE_POINT } from '../../src/game/world3d/layout'
let n = 0
for (const r of ROADS) {
  for (const [x, z] of r.pts) {
    const deck = riverInfo(x, z)
    if (deck.d < deck.halfWidth + 2.5) {
      const onBridge = BRIDGES.some((b) => Math.hypot(b.x - x, b.z - z) < b.length / 2 + 3)
      if (!onBridge) {
        n++
        if (n < 14) console.log('WATER', r.osm, r.name, r.cls, `(${x.toFixed(1)},${z.toFixed(1)})`, 'd=', deck.d.toFixed(1), 'hw=', deck.halfWidth.toFixed(1))
      }
    }
  }
}
console.log('total water-touch pts:', n)
const clss = new Set(ROADS.map((r) => r.cls))
console.log('cls present:', [...clss])
console.log('CONFLUENCE_POINT =', CONFLUENCE_POINT)
for (const rv of RIVERS.slice(0, 2)) {
  console.log(rv.id, 'first', rv.points[0], 'last', rv.points[rv.points.length - 1], 'n=', rv.points.length)
}
