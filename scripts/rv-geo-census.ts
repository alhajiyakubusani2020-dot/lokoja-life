/**
 * RV-1 — NO-TRUST GEO + RUNTIME WORLD CENSUS (independent re-derivation)
 * Re-decodes public/world/geo-v1.bin directly and bootstraps the real
 * layout-family modules via the repo's own CLI gate. Every printed number
 * is computed here, not quoted from any Bible or prior audit.
 * Run: bun run scripts/rv-geo-census.ts
 */
import './geo/bootstrap'
import { readFileSync } from 'fs'
import { decodeGeoBin } from '../src/game/world3d/geo'

// ---------- PART A: raw binary decode (no layout module involved) ----------
const binPath = '/home/z/my-project/public/world/geo-v1.bin'
const bytes = readFileSync(binPath)
const buf = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
const d = decodeGeoBin(buf)

let segs = 0, pts = 0, roadLen = 0
for (const w of d.roads) {
  segs += w.pts.length - 1
  pts += w.pts.length
  for (let i = 0; i < w.pts.length - 1; i++) roadLen += Math.hypot(w.pts[i + 1][0] - w.pts[i][0], w.pts[i + 1][1] - w.pts[i][1])
}
let rivSegs = 0, rivLen = 0
for (const r of d.rivers) {
  rivSegs += r.pts.length - 1
  for (let i = 0; i < r.pts.length - 1; i++) rivLen += Math.hypot(r.pts[i + 1][0] - r.pts[i][0], r.pts[i + 1][1] - r.pts[i][1])
}
const namedWays = d.roads.filter(w => w.name && w.name.length > 0)
const distinctNames = new Set(namedWays.map(w => w.name))
// dead-end fraction: count endpoints that appear in exactly 1 segment
const endpointCount = new Map<string, number>()
for (const w of d.roads) for (const p of w.pts) {
  const k = `${p[0].toFixed(2)},${p[1].toFixed(2)}`
  endpointCount.set(k, (endpointCount.get(k) ?? 0) + 1)
}
const ends: number[] = d.roads.map(w => {
  const a = endpointCount.get(`${w.pts[0][0].toFixed(2)},${w.pts[0][1].toFixed(2)}`) ?? 0
  const b = endpointCount.get(`${w.pts[w.pts.length - 1][0].toFixed(2)},${w.pts[w.pts.length - 1][1].toFixed(2)}`) ?? 0
  return (a <= 1 ? 1 : 0) + (b <= 1 ? 1 : 0)
})
const totalEnds = d.roads.length * 2
const deadEnds = ends.reduce((a, b) => a + b, 0)

// confluence: closest river-vertex pair
let best = { dist: Infinity, a: '', b: '', va: [0, 0], vb: [0, 0] }
for (let i = 0; i < d.rivers.length; i++) for (let j = i + 1; j < d.rivers.length; j++) {
  const A = d.rivers[i], B = d.rivers[j]
  for (const p of A.pts) for (const q of B.pts) {
    const dd = Math.hypot(p[0] - q[0], p[1] - q[1])
    if (dd < best.dist) best = { dist: dd, a: A.id, b: B.id, va: p as number[], vb: q as number[] }
  }
}

// unbridged crossings: segment intersects a river polyline (not near a bridge)
function segIntersect(p1: number[], p2: number[], p3: number[], p4: number[]) {
  const d1x = p2[0] - p1[0], d1z = p2[1] - p1[1], d2x = p4[0] - p3[0], d2z = p4[1] - p3[1]
  const den = d1x * d2z - d1z * d2x
  if (Math.abs(den) < 1e-12) return false
  const t = ((p3[0] - p1[0]) * d2z - (p3[1] - p1[1]) * d2x) / den
  const u = ((p3[0] - p1[0]) * d1z - (p3[1] - p1[1]) * d1x) / den
  return t >= 0 && t <= 1 && u >= 0 && u <= 1
}
function distPtSeg(px: number, pz: number, a: number[], b: number[]) {
  const abx = b[0] - a[0], abz = b[1] - a[1]
  const len2 = abx * abx + abz * abz
  if (len2 === 0) return Math.hypot(px - a[0], pz - a[1])
  let t = ((px - a[0]) * abx + (pz - a[1]) * abz) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (a[0] + t * abx), pz - (a[1] + t * abz))
}
const bridgePts = d.bridges
let crossings = 0, halfWidth = 0
const RIVER_HALF = 6.25 // Niger half-width from manifest (w 12.5); widest channel law
for (const w of d.roads) for (let i = 0; i < w.pts.length - 1; i++) {
  const p1 = w.pts[i], p2 = w.pts[i + 1]
  let crosses = false, near = false
  for (const r of d.rivers) {
    for (let j = 0; j < r.pts.length - 1; j++) {
      if (segIntersect(p1, p2, r.pts[j], r.pts[j + 1])) { crosses = true; break }
    }
    if (!crosses) {
      for (const p of r.pts) { if (distPtSeg(p[0], p[1], p1, p2) < RIVER_HALF) { near = true; break } }
    }
    if (crosses) break
  }
  if (!crosses && !near) continue
  // near a bridge?
  let nearBridge = false
  for (const bp of bridgePts) {
    if (distPtSeg(bp[0], bp[1], p1, p2) < 14) { nearBridge = true; break }
    const p = bp as unknown as number[]
    if (p.length >= 2 && Math.hypot(p[0] - p1[0], p[1] - p1[1]) < 14) { nearBridge = true; break }
  }
  const mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
  let midNearBridge = false
  for (const bp of bridgePts) {
    const p = bp as unknown as number[]
    if (Math.hypot(p[0] - mid[0], p[1] - mid[1]) < 14) { midNearBridge = true; break }
  }
  if (crosses && !midNearBridge) crossings++
  else if (!crosses && near && !midNearBridge) halfWidth++
}

console.log('== RAW BINARY CENSUS ==')
console.log('file_bytes:', bytes.length, '(manifest claims 60071)')
console.log('ways:', d.roads.length, 'segments:', segs, 'points:', pts)
console.log('road_len_units:', roadLen.toFixed(1), 'km@26m:', (roadLen * 26 / 1000).toFixed(1))
console.log('rivers:', d.rivers.length, 'river_segs:', rivSegs, 'river_km:', (rivLen * 26 / 1000).toFixed(1))
console.log('bridges:', d.bridges.length, 'loops:', (d as any).loops?.length ?? 'n/a')
console.log('named_ways:', namedWays.length, 'distinct_names:', distinctNames.size, JSON.stringify([...distinctNames]))
console.log('dead_end_fraction:', (deadEnds / totalEnds * 100).toFixed(1) + '%', `(${deadEnds}/${totalEnds})`)
console.log('unbridged_crossings:', crossings, 'within_half_width:', halfWidth)
console.log('confluence:', JSON.stringify(best))

// ---------- PART B: runtime world census (bootstrap first, then modules) ----------
const L = await import('../src/game/world3d/layout')
const J = await import('../src/game/world3d/junctions')
const S = await import('../src/game/world3d/schools')
const I = await import('../src/game/world3d/interiors')
const F = await import('../src/game/world3d/flora')
const P = await import('../src/game/world3d/props')
const V = await import('../src/game/world3d/vehicles')
const DR = await import('../src/game/world3d/drains')
const PL = await import('../src/game/world3d/plates')

const roads = (L as any).ROADS as { pts: number[][]; name?: string; kind?: string }[]
let rtSegs = 0, rtLen = 0
for (const w of roads) {
  rtSegs += w.pts.length - 1
  for (let i = 0; i < w.pts.length - 1; i++) rtLen += Math.hypot(w.pts[i + 1][0] - w.pts[i][0], w.pts[i + 1][1] - w.pts[i][1])
}
console.log('== RUNTIME CENSUS ==')
console.log('ROADS:', roads.length, 'segs:', rtSegs, 'km:', (rtLen * 26 / 1000).toFixed(1))
const districts = (L as any).DISTRICTS
console.log('DISTRICTS:', districts.length, 'LOCATIONS:', ((await import('../src/game/data/locations')) as any).LOCATIONS.length)
console.log('BUILDINGS:', ((L as any).BUILDINGS) as any ? ((L as any).BUILDINGS as any[]).length : 'n/a')
const stalls = (L as any).STALLS as { x: number; z: number }[]
const anchors = (L as any).ANCHOR_BY_ID as Record<string, { x: number; z: number }>
const stallByDist: Record<string, number> = {}
for (const s of stalls) {
  let bestId = 'unknown', bestD = Infinity
  for (const [id, a] of Object.entries(anchors)) {
    const dd = Math.hypot(a.x - s.x, a.z - s.z)
    if (dd < bestD) { bestD = dd; bestId = id }
  }
  stallByDist[bestId] = (stallByDist[bestId] ?? 0) + 1
}
console.log('STALLS:', stalls.length, 'by_nearest_anchor:', JSON.stringify(stallByDist))
console.log('TREES_legacy:', ((L as any).TREES as any[])?.length, 'GRASS_legacy:', ((L as any).GRASS as any[])?.length, 'ROCKS:', ((L as any).ROCKS as any[])?.length)
console.log('NPC_ZONES:', ((L as any).NPC_ZONES as any[])?.length, 'NPC_COUNT(Actors const checked separately)')
console.log('RIVERS:', ((L as any).RIVERS as any[])?.length, 'BRIDGES:', ((L as any).BRIDGES as any[])?.length)
console.log('ALL_DOORS:', (S as any).ALL_DOORS?.length, 'SCHOOL_INTERIORS:', (S as any).SCHOOL_INTERIORS?.length, 'SCHOOL_COMPOUND_BOXES:', (S as any).SCHOOL_COMPOUNDS?.length)
const inters = (I as any).INTERIORS as any[]
const byId = (I as any).INTERIOR_BY_ID as Map<string, any>
console.log('INTERIORS_array:', inters.length, 'INTERIOR_BY_ID_keys:', byId instanceof Map ? byId.size : Object.keys(byId ?? {}).length)
const floraMap = (F as any).FLORA_TREES as Record<string, any[]>
const bySpecies: Record<string, number> = {}
let floraTotal = 0
for (const [k, arr] of Object.entries(floraMap ?? {})) { bySpecies[k] = arr.length; floraTotal += arr.length }
console.log('FLORA_TREES:', floraTotal, JSON.stringify(bySpecies))
console.log('GRASS_TUFTS(flora):', ((F as any).GRASS_TUFTS as any[])?.length)
const lights = (J as any).TRAFFIC_LIGHTS as any[]
const bumps = (J as any).SPEED_BUMPS as any[]
const stops = (J as any).DANFO_STOPS as any[]
const clusters = (J as any).JUNCTION_CLUSTERS as any[]
console.log('LIGHTS_placed:', lights?.length, 'BUMPS_placed:', bumps?.length, 'DANFO_STOPS:', stops?.length, 'JUNCTION_CLUSTERS:', clusters?.length)
const lamps = (L as any).LAMPS as any[]
console.log('LAMPS:', lamps?.length)
const kerbs = (P as any).KERB_RUNS as any[]
const zebras = (P as any).ZEBRAS as any[]
console.log('KERB_RUNS:', kerbs?.length, 'ZEBRAS:', zebras?.length)
const drains = (DR as any).DRAINS as any[]
console.log('DRAINS:', drains?.length)
const plates = (PL as any).PLATES ?? null
console.log('PLATE_cap_const: see plates.ts (grep)')

// dead-end method variants
const ep2 = new Map<string, number>()
for (const w of d.roads) for (const p of w.pts) {
  const k = `${p[0]},${p[1]}`
  ep2.set(k, (ep2.get(k) ?? 0) + 1)
}
const endsExact: number[] = d.roads.map(w => {
  const a = ep2.get(`${w.pts[0]},${w.pts[0][1]}`.replace(',[[Object', '')) ?? 0
  return 0
})
// variant B: ways with >=1 dead endpoint / total ways
let waysWithDead = 0
for (const w of d.roads) {
  const ka = `${w.pts[0][0].toFixed(2)},${w.pts[0][1].toFixed(2)}`
  const kb = `${w.pts[w.pts.length - 1][0].toFixed(2)},${w.pts[w.pts.length - 1][1].toFixed(2)}`
  if ((endpointCount.get(ka) ?? 0) <= 1 || (endpointCount.get(kb) ?? 0) <= 1) waysWithDead++
}
console.log('deadend_variant_B ways_with_dead_end/ways:', waysWithDead + '/' + d.roads.length, '=', (waysWithDead / d.roads.length * 100).toFixed(1) + '%')
// variant C: exact-float endpoints degree<=1
const ep3 = new Map<string, number>()
for (const w of d.roads) for (const p of w.pts) {
  const k = `${p[0]}|${p[1]}`
  ep3.set(k, (ep3.get(k) ?? 0) + 1)
}
let deadExact = 0
for (const w of d.roads) {
  if ((ep3.get(`${w.pts[0][0]}|${w.pts[0][1]}`) ?? 0) <= 1) deadExact++
  if ((ep3.get(`${w.pts[w.pts.length - 1][0]}|${w.pts[w.pts.length - 1][1]}`) ?? 0) <= 1) deadExact++
}
console.log('deadend_variant_C exact-float dead_ends/total:', deadExact + '/' + totalEnds, '=', (deadExact / totalEnds * 100).toFixed(1) + '%')
// bridge-flag crossing method (the binary's own flag)
let crossFlag = 0, halfFlag = 0
const anyBridgeFlag = d.roads.filter(w => (w as any).bridge).length
for (const w of d.roads) {
  if ((w as any).bridge) continue
  for (let i = 0; i < w.pts.length - 1; i++) {
    const a = w.pts[i], b = w.pts[i + 1]
    let crosses = false
    for (const rv of d.rivers) {
      for (let k = 0; k < rv.pts.length - 1; k++) if (segIntersect(a, b, rv.pts[k], rv.pts[k + 1])) { crosses = true; break }
      if (crosses) break
    }
    if (crosses) { crossFlag++; continue }
    const mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2
    let bestHalf = Infinity
    for (const rv of d.rivers) {
      for (let k = 0; k < rv.pts.length - 1; k++) {
        const dd = distPtSeg(mx, mz, rv.pts[k], rv.pts[k + 1])
        if (dd < bestHalf) bestHalf = dd
      }
      if (bestHalf < (rv as any).w / 2) { halfFlag++; break }
    }
  }
}
console.log('bridge_flag_ways:', anyBridgeFlag, 'crossings(flag method):', crossFlag, 'midpoint_within_river_halfwidth:', halfFlag)
const parked = (V as any).PARKED_VEHICLES as any[]
const bays = (V as any).BAY_SPECS as any[]
console.log('PARKED_VEHICLES:', parked?.length, 'BAY_SPECS:', bays?.length)

// ---------- PART C: data registries ----------
const jobs = (await import('../src/game/data/jobs')) as any
const hustles = (await import('../src/game/data/hustles')) as any
const foods = (await import('../src/game/data/foods')) as any
const cfg = (await import('../src/game/data/config')) as any
const cal = (await import('../src/game/systems/calendar')) as any
const npcs = (await import('../src/game/data/npcs')) as any
const veh = (await import('../src/game/data/vehicles')) as any
const locA = (await import('../src/game/data/locActions')) as any
console.log('== DATA CENSUS ==')
console.log('JOBS:', jobs.JOBS?.length ?? jobs.JOB_LIST?.length, 'HUSTLES:', hustles.HUSTLES?.length)
console.log('FOODS(display):', foods.FOODS?.length)
console.log('MEALS:', Object.keys(cfg.FOOD?.meals ?? cfg.FOOD?.MEALS ?? {}).length, JSON.stringify(Object.keys(cfg.FOOD?.meals ?? {})))
console.log('WEATHER weights:', JSON.stringify(cfg.TIME?.weatherWeights))
console.log('slots:', JSON.stringify(cfg.TIME?.slots), 'yearDays:', cfg.CALENDAR?.yearDays ?? cfg.TIME?.yearDays)
console.log('NAMED_NPCS:', npcs.NPCS?.length ?? npcs.NPC_ROSTER?.length)
console.log('VEHICLE_MODELS:', veh.VEHICLES?.length ?? veh.VEHICLE_CATALOG?.length, JSON.stringify((veh.VEHICLES ?? veh.VEHICLE_CATALOG ?? []).map((v: any) => v.model ?? v.id)))
console.log('FESTIVALS:', (cal.FESTIVALS ?? cal.CITY_FESTIVALS)?.length)
const la = locA.LOC_ACTIONS as Record<string, any[]>
console.log('LOC_ACTIONS_keys:', Object.keys(la).length, 'rows:', Object.values(la).reduce((a: number, b: any[]) => a + b.length, 0))
console.log('START_CASH:', cfg.DEFAULT_PLAYER?.cash ?? cfg.PLAYER_DEFAULTS?.cash)
console.log('SAVE-related constants: checked by grep')
console.log('JOB_BOARDS_POI: see locations.ts job-board entries (grep)')
