/**
 * M1 diagnostic — how many buildings/props sit ON the rendered carriageway?
 * Mirrors the render half-widths used by WorldTerrain + the road spatial grid.
 */
import { BUILDINGS, ROADS, ROAD_RENDER_W, STALLS, LAMPS, WORLD_HALF } from '../src/game/world3d/layout'

interface Seg { ax: number; az: number; bx: number; bz: number; half: number; major: boolean }
const CELL = 16
const GRID = new Map<string, Seg[]>()
const halfOf = (cls: string) => (ROAD_RENDER_W[cls] ?? 2.2) / 2

for (const r of ROADS) {
  const half = halfOf(r.cls)
  for (let i = 0; i < r.pts.length - 1; i++) {
    const s: Seg = { ax: r.pts[i][0], az: r.pts[i][1], bx: r.pts[i + 1][0], bz: r.pts[i + 1][1], half, major: r.major }
    const minX = Math.floor(Math.min(s.ax, s.bx) / CELL)
    const maxX = Math.floor(Math.max(s.ax, s.bx) / CELL)
    const minZ = Math.floor(Math.min(s.az, s.bz) / CELL)
    const maxZ = Math.floor(Math.max(s.az, s.bz) / CELL)
    for (let cx = minX; cx <= maxX; cx++) for (let cz = minZ; cz <= maxZ; cz++) {
      const k = `${cx}:${cz}`
      let a = GRID.get(k); if (!a) { a = []; GRID.set(k, a) }
      a.push(s)
    }
  }
}

function gapAt(x: number, z: number, radius: number): number {
  let best = 99
  const minX = Math.floor((x - radius) / CELL), maxX = Math.floor((x + radius) / CELL)
  const minZ = Math.floor((z - radius) / CELL), maxZ = Math.floor((z + radius) / CELL)
  for (let cx = minX; cx <= maxX; cx++) for (let cz = minZ; cz <= maxZ; cz++) {
    const arr = GRID.get(`${cx}:${cz}`); if (!arr) continue
    for (const s of arr) {
      const dx = s.bx - s.ax, dz = s.bz - s.az
      const len2 = dx * dx + dz * dz
      let t = len2 === 0 ? 0 : ((x - s.ax) * dx + (z - s.az) * dz) / len2
      t = Math.max(0, Math.min(1, t))
      const d = Math.hypot(x - (s.ax + dx * t), z - (s.az + dz * t)) - s.half
      if (d < best) best = d
    }
  }
  return best
}

// worst-case corner of each building (rotated rect)
function corners(b: { x: number; z: number; w: number; d: number; rotY: number }): [number, number][] {
  const c = Math.cos(b.rotY), s = Math.sin(b.rotY)
  const out: [number, number][] = []
  for (const [hw, hd] of [[b.w / 2, b.d / 2], [-b.w / 2, b.d / 2], [b.w / 2, -b.d / 2], [-b.w / 2, -b.d / 2]]) {
    out.push([b.x + c * hw + s * hd, b.z - s * hw + c * hd])
  }
  return out
}

const MARGIN = 0.15
const offenders: { kind: string; gap: number; x: number; z: number }[] = []
for (const b of BUILDINGS) {
  let minGap = 99
  for (const [cx, cz] of corners(b)) minGap = Math.min(minGap, gapAt(cx, cz, 8))
  if (minGap < MARGIN) offenders.push({ kind: b.kind, gap: minGap, x: b.x, z: b.z })
}
console.log(`BUILDINGS total=${BUILDINGS.length} onRoad=${offenders.length}`)
const byKind: Record<string, number> = {}
for (const o of offenders) byKind[o.kind] = (byKind[o.kind] ?? 0) + 1
console.log('by kind:', byKind)
console.log('worst 8:', offenders.sort((a, b) => a.gap - b.gap).slice(0, 8).map(o => `${o.kind}@(${o.x.toFixed(0)},${o.z.toFixed(0)}) gap=${o.gap.toFixed(2)}`).join('  '))

let sOff = 0, sMin = 99
for (const st of STALLS) { const g = gapAt(st.x, st.z, 6); if (g < MARGIN) sOff++; sMin = Math.min(sMin, g) }
console.log(`STALLS total=${STALLS.length} onRoad=${sOff} minGap=${sMin.toFixed(2)}`)

let lOff = 0, lMin = 99
const lampWorst: { x: number; z: number; gap: number }[] = []
for (const l of LAMPS) {
  const g = gapAt(l.x, l.z, 6)
  if (g < MARGIN) {
    lOff++
    lampWorst.push({ x: l.x, z: l.z, gap: g })
  }
  lMin = Math.min(lMin, g)
}
lampWorst.sort((a, b) => a.gap - b.gap)
console.log(`LAMPS total=${LAMPS.length} onRoad(carriageway)=${lOff} minGap=${lMin.toFixed(2)}`)
console.log(
  'lamp worst 5:',
  lampWorst
    .slice(0, 5)
    .map((o) => `(${o.x.toFixed(1)},${o.z.toFixed(1)}) gap=${o.gap.toFixed(2)}`)
    .join('  '),
)
// histogram of lamp gaps
const buckets = [0, 0, 0, 0, 0]
for (const l of LAMPS) {
  const g = gapAt(l.x, l.z, 6)
  if (g < -1) buckets[0]++
  else if (g < 0) buckets[1]++
  else if (g < 0.5) buckets[2]++
  else if (g < 1) buckets[3]++
  else buckets[4]++
}
console.log(`lamp gap histogram  <-1: ${buckets[0]}  -1..0: ${buckets[1]}  0..0.5: ${buckets[2]}  0.5..1: ${buckets[3]}  >1: ${buckets[4]}`)
