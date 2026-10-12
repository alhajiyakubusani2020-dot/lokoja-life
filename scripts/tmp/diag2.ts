import { ROADS, BRIDGES, riverInfo } from '../../src/game/world3d/layout'
let n = 0
for (const r of ROADS) {
  for (const [x, z] of r.pts) {
    const deck = riverInfo(x, z)
    if (deck.d < deck.halfWidth + 2.5) {
      const onBridge = BRIDGES.some((b) => Math.hypot(b.x - x, b.z - z) < b.length / 2 + 3)
      if (!onBridge && !(deck.halfWidth <= 4 && deck.d > deck.halfWidth - 0.2)) {
        n++
        if (n < 10) console.log('FAIL', r.osm, r.cls, `(${x.toFixed(1)},${z.toFixed(1)})`, 'd=', deck.d.toFixed(2), 'hw=', deck.halfWidth.toFixed(1))
      }
    }
  }
}
console.log('hard fails:', n)
