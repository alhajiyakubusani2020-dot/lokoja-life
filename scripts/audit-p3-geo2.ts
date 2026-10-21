/* P3 probe 2 — confluence vertex + true segment/river intersection counts */
import { decodeGeoBin } from '../src/game/world3d/geo'
import { readFileSync } from 'node:fs'

const bin = readFileSync('public/world/geo-v1.bin')
const buf = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)
const d = decodeGeoBin(buf)

// 1) closest pair of river endpoints / vertices across ALL river pairs
let best = { dist: Infinity, a: '', b: '', va: [0, 0], vb: [0, 0] }
for (let i = 0; i < d.rivers.length; i++) for (let j = i + 1; j < d.rivers.length; j++) {
  const A = d.rivers[i], B = d.rivers[j]
  for (const p of A.pts) for (const q of B.pts) {
    const dd = Math.hypot(p[0] - q[0], p[1] - q[1])
    if (dd < best.dist) best = { dist: dd, a: A.id, b: B.id, va: p, vb: q }
  }
}
console.log('closest river vertex pair:', JSON.stringify(best))

// segment-intersection test: does road segment cross a river polyline?
function segIntersect(p1, p2, p3, p4) {
  const d1x = p2[0]-p1[0], d1z = p2[1]-p1[1], d2x = p4[0]-p3[0], d2z = p4[1]-p3[1]
  const den = d1x*d2z - d1z*d2x
  if (Math.abs(den) < 1e-12) return false
  const t = ((p3[0]-p1[0])*d2z - (p3[1]-p1[1])*d2x) / den
  const u = ((p3[0]-p1[0])*d1z - (p3[1]-p1[1])*d1x) / den
  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}
function distPtSeg(px, pz, a, b) {
  const abx = b[0]-a[0], abz = b[1]-a[1]
  const t = Math.max(0, Math.min(1, ((px-a[0])*abx + (pz-a[1])*abz) / (abx*abx + abz*abz || 1)))
  return Math.hypot(px-(a[0]+t*abx), pz-(a[1]+t*abz))
}
function distToRivers(x, z) {
  let m = Infinity, w = 0
  for (const r of d.rivers) for (let i = 1; i < r.pts.length; i++) {
    const dd = distPtSeg(x, z, r.pts[i-1], r.pts[i])
    if (dd < m) { m = dd; w = r.w }
  }
  return { d: m, w }
}

let crossing = 0
let withinHalf = 0   // midline closer than river half-width (my earlier check, per-segment nearest river width)
let withinHalfAny = 0 // midline closer than ANY river half-width
const widths = [...new Set(d.rivers.map(r => r.w))].sort((a,b)=>a-b)
console.log('river widths:', widths.join(','))
for (const r of d.roads) {
  for (let i = 1; i < r.pts.length; i++) {
    const a = r.pts[i-1], b = r.pts[i]
    let crosses = false
    for (const rv of d.rivers) {
      if (r.bridge) break
      for (let k = 1; k < rv.pts.length; k++) if (segIntersect(a, b, rv.pts[k-1], rv.pts[k])) { crosses = true; break }
      if (crosses) break
    }
    if (!r.bridge && crosses) { crossing++; continue }
    if (!r.bridge) {
      const mx = (a[0]+b[0])/2, mz = (a[1]+b[1])/2
      const { d: dd, w } = distToRivers(mx, mz)
      if (dd < w / 2) withinHalf++
      if (dd < 0.05) withinHalfAny++
    }
  }
}
console.log(JSON.stringify({ true_polyline_crossings: crossing, midline_within_river_halfwidth: withinHalf, midline_within_0_05u: withinHalfAny }))

// where are the endpoints of the two closest rivers (context for "confluence deck")?
console.log('closest pair endpoints:', JSON.stringify({ va: best.va, vb: best.vb }))
