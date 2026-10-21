/* RULE ZERO P3 — personal spot verification: geo binary re-decode.
 * Uses the repo's own decoder (src/game/world3d/geo.ts) on the raw bytes.
 * Produces: ways / segments / points / km / rivers / bridges / loops /
 * named ways / confluence proximity / channel crossings / submerged segs. */
import { decodeGeoBin } from '../src/game/world3d/geo'
import { readFileSync, statSync } from 'node:fs'

const bin = readFileSync('public/world/geo-v1.bin')
const buf = bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)
const bytes = statSync('public/world/geo-v1.bin').size

const d = decodeGeoBin(buf)
let segs = 0
let pts = 0
let km2 = 0 // raw polyline length in units
let km1 = 0 // chord-summed per segment
const named = new Set<string>()
for (const r of d.roads) {
  segs += Math.max(0, r.pts.length - 1)
  pts += r.pts.length
  if (r.name) named.add(r.name)
  for (let i = 1; i < r.pts.length; i++) {
    const dx = r.pts[i][0] - r.pts[i - 1][0]
    const dz = r.pts[i][1] - r.pts[i - 1][1]
    km2 += Math.hypot(dx, dz)
  }
}
// segment-level length (same thing since each consecutive pair is a segment)
for (const r of d.roads) for (let i = 1; i < r.pts.length; i++) km1 += Math.hypot(r.pts[i][0] - r.pts[i-1][0], r.pts[i][1] - r.pts[i-1][1])

const riverPts = d.rivers.reduce((a, r) => a + r.pts.length, 0)
const riverSegs = d.rivers.reduce((a, r) => a + Math.max(0, r.pts.length - 1), 0)
const loopPts = d.loops.reduce((a, l) => a + l.length, 0)

// confluence: closest approach between Niger & Benue polylines (units)
function minDist(a: [number,number][], b: [number,number][]): number {
  let m = Infinity
  for (const p of a) for (const q of b) { const dd = Math.hypot(p[0]-q[0], p[1]-q[1]); if (dd < m) m = dd }
  return m
}
// identify the two big rivers by point count
const byPts = [...d.rivers].sort((a, b) => b.pts.length - a.pts.length)
const confluence = minDist(byPts[0].pts, byPts[1].pts)

// channel crossings + submerged: segment midpoint vs nearest river polyline
function distToRiver(x: number, z: number): number {
  let m = Infinity
  for (const r of d.rivers) for (let i = 1; i < r.pts.length; i++) {
    // point-segment distance
    const ax = r.pts[i-1][0], az = r.pts[i-1][1], bx = r.pts[i][0], bz = r.pts[i][1]
    const abx = bx-ax, abz = bz-az
    const t = Math.max(0, Math.min(1, ((x-ax)*abx + (z-az)*abz) / (abx*abx + abz*abz || 1)))
    const dd = Math.hypot(x-(ax+t*abx), z-(az+t*abz))
    if (dd < m) m = dd
  }
  return m
}
let cross = 0, halfSub = 0, fullSub = 0
const crossings: string[] = []
for (const r of d.roads) {
  if (r.bridge) continue
  for (let i = 1; i < r.pts.length; i++) {
    const ax = r.pts[i-1][0], az = r.pts[i-1][1], bx = r.pts[i][0], bz = r.pts[i][1]
    const mx = (ax+bx)/2, mz = (az+bz)/2
    const dA = distToRiver(ax, az), dB = distToRiver(bx, bz)
    const dM = distToRiver(mx, mz)
    if (dM < 0.05 && dA > 0.05 && dB > 0.05) { cross++; crossings.push(`${r.osm}`) }
    else if (dM < r.w/2) halfSub++
  }
}

console.log(JSON.stringify({
  file_bytes: bytes,
  roads_ways: d.roads.length,
  segments: segs,
  points: pts,
  km_units: +(km2/1000).toFixed(2),
  km_at_26m: +((km2*26)/1000).toFixed(1),
  rivers: d.rivers.length,
  river_pts: riverPts, river_segs: riverSegs,
  bridges: d.bridges.length,
  loops: d.loops.length, loop_pts: loopPts,
  named_way_names: named.size,
  named_ways: d.roads.filter(r=>r.name).length,
  two_biggest_rivers: byPts.slice(0,4).map(r=>({id:r.id, pts:r.pts.length})),
  confluence_min_dist_units: +confluence.toFixed(4),
  channel_crossings_midpoint: cross,
  halfwidth_submerged: halfSub,
}, null, 2))
