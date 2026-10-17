import '../scripts/geo/bootstrap'
import { FLORA_TREES } from '../src/game/world3d/flora'
import { ANCHOR_BY_ID, ROADS, ROAD_RENDER_W, roadGap, riverInfo, heightAt, WATER_Y, WALK_BOUND } from '../src/game/world3d/layout'

const home = ANCHOR_BY_ID['home']
console.log('home @', home.x.toFixed(1), home.z.toFixed(1))

// roads passing near home
for (const r of ROADS) {
  let best = Infinity
  for (const [x, z] of r.pts) best = Math.min(best, Math.hypot(x - home.x, z - home.z))
  if (best < 80) console.log(`road cls=${r.cls.padEnd(10)} name=${(r.name ?? r.id ?? '').toString().slice(0, 30).padEnd(30)} nearest=${best.toFixed(1)}u pts=${r.pts.length}`)
}

// replay the candidate walk on the nearest artery and count rejects by law
const artery = ROADS.filter((r) => r.cls === 'major' || r.cls === 'secondary' || r.cls === 'highway')
  .map((r) => ({ r, d: Math.min(...r.pts.map(([x, z]) => Math.hypot(x - home.x, z - home.z))) }))
  .sort((a, b) => a.d - b.d)[0]
console.log('\nnearest artery:', artery.r.cls, 'd=', artery.d.toFixed(1))
const half = (ROAD_RENDER_W[artery.r.cls] ?? 2.2) / 2
const pts = artery.r.pts
let walked = 0
let next = 0
const counts: Record<string, number> = {}
const samples: string[] = []
for (let i = 0; i < pts.length - 1; i++) {
  const [ax, az] = pts[i]
  const [bx, bz] = pts[i + 1]
  const seg = Math.hypot(bx - ax, bz - az)
  if (seg < 1e-9) continue
  const nx = -(bz - az) / seg
  const nz = (bx - ax) / seg
  while (next <= walked + seg) {
    const t = (next - walked) / seg
    const x = ax + (bx - ax) * t
    const z = az + (bz - az) * t
    const dHome = Math.hypot(x - home.x, z - home.z)
    for (const side of [1, -1] as const) {
      if (dHome > 70) continue
      const off = half + 0.34 + 2.6
      const px = x + nx * off * side
      const pz = z + nz * off * side
      // which law kills it? approximate with the same order as clearOfTown
      let why = 'ACCEPT?'
      if (heightAt(px, pz) <= WATER_Y + 0.35) why = 'water'
      else if (Math.hypot(px, pz) > WALK_BOUND - 2) why = 'bound'
      else if (roadGap(px, pz) < 1.5) why = 'roadgap'
      const ri = riverInfo(px, pz)
      if (why === 'ACCEPT?' && ri.d < ri.halfWidth + 3) why = 'river'
      counts[why] = (counts[why] ?? 0) + 1
      if (dHome < 45 && samples.length < 16) samples.push(`dHome=${dHome.toFixed(0)} (${px.toFixed(0)},${pz.toFixed(0)}) roadGap=${roadGap(px, pz).toFixed(2)} -> ${why}`)
    }
    next += 4
  }
  walked += seg
}
console.log('reject tally (70u ring):', counts)
console.log('samples within 45u of home:')
for (const s of samples) console.log('  ', s)
