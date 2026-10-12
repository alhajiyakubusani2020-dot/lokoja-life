import { ROADS } from '../../src/game/world3d/layout'
let bad = 0
for (const r of ROADS) {
  for (let i = 0; i < r.pts.length - 1; i++) {
    const d = Math.hypot(r.pts[i+1][0] - r.pts[i][0], r.pts[i+1][1] - r.pts[i][1])
    if (d > 40) {
      bad++
      if (bad < 8) console.log('JUMP', r.osm, r.name, r.cls, `d=${d.toFixed(0)}`, r.pts[i], '->', r.pts[i+1])
    }
  }
}
console.log('total >40u jumps:', bad)
