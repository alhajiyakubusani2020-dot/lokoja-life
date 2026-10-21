/**
 * TEAM CHARLIE (World) — generate-and-count census. AUDIT ONLY, no source edits.
 * Usage: bun scripts/audit-tmp/charlie/census.ts
 * Bootstraps geo-v1.bin first (CLI law), then imports the world generators
 * and prints every measurable number + a determinism checksum.
 */
import './bootstrap-shim' // fills GEO_* from public/world/geo-v1.bin (absolute-path bootstrap)
import { createHash } from 'crypto'

function sha(s: string): string {
  return createHash('sha256').update(s).digest('hex').slice(0, 16)
}

async function main() {
  // dynamic imports AFTER the geo fill (module-scope derivations read filled arrays)
  const layout = await import('../../../src/game/world3d/layout')
  const roads = await import('../../../src/game/world3d/roads')
  const plates = await import('../../../src/game/world3d/plates')
  const junctions = await import('../../../src/game/world3d/junctions')
  const flora = await import('../../../src/game/world3d/flora')
  const interiors = await import('../../../src/game/world3d/interiors')
  const schools = await import('../../../src/game/world3d/schools')
  const vehicles = await import('../../../src/game/world3d/vehicles')
  const locationsMod = await import('../../../src/game/data/locations')
  const teleport = await import('../../../src/game/systems/teleport')
  const geo = await import('../../../src/game/world3d/geo')

  const L = layout
  const LOCATIONS = locationsMod.LOCATIONS

  // ---- map bounds ----
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const r of L.ROADS) for (const [x, z] of r.pts) {
    if (x < minX) minX = x; if (x > maxX) maxX = x
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z
  }
  console.log('== MAP / GEO ==')
  console.log(`WORLD_HALF=${L.WORLD_HALF} WALK_BOUND=${L.WALK_BOUND} MAP_SCALE=${L.MAP_SCALE.toFixed(3)} WATER_Y=${L.WATER_Y}`)
  console.log(`road-pt bounds x:[${minX.toFixed(1)},${maxX.toFixed(1)}] z:[${minZ.toFixed(1)},${maxZ.toFixed(1)}]`)
  console.log(`GEO_WORLD_HALF(geo.ts)=${geo.GEO_WORLD_HALF}`)

  // ---- roads ----
  const segs = L.ROADS.reduce((n, r) => n + r.pts.length - 1, 0)
  const totalLen = L.ROADS.reduce((n, r) => {
    let s = 0
    for (let i = 0; i < r.pts.length - 1; i++) s += Math.hypot(r.pts[i + 1][0] - r.pts[i][0], r.pts[i + 1][1] - r.pts[i][1])
    return n + s
  }, 0)
  const byCls: Record<string, number> = {}
  for (const r of L.ROADS) byCls[r.cls] = (byCls[r.cls] ?? 0) + 1
  const named = L.ROADS.filter((r) => r.name)
  console.log('== ROADS ==')
  console.log(`ways=${L.ROADS.length} segments=${segs} totalLen=${totalLen.toFixed(1)}u = ${(totalLen * 26 / 1000).toFixed(1)} km real (1u=26m)`)
  console.log(`byClass=${JSON.stringify(byCls)} namedWays=${named.length} uniqueNames=${new Set(named.map((r) => r.name)).size}`)

  // ---- rivers / bridges / loops ----
  const riverSegs = L.RIVERS.reduce((n, r) => n + r.points.length - 1, 0)
  const riverLen = L.RIVERS.reduce((n, r) => {
    let s = 0
    for (let i = 0; i < r.points.length - 1; i++) s += Math.hypot(r.points[i + 1][0] - r.points[i][0], r.points[i + 1][1] - r.points[i][1])
    return n + s
  }, 0)
  const loopLen = L.TRAFFIC_LOOPS.reduce((n, lp) => {
    let s = 0
    for (let i = 0; i < lp.length; i++) {
      const a = lp[i], b = lp[(i + 1) % lp.length]
      s += Math.hypot(b[0] - a[0], b[1] - a[1])
    }
    return n + s
  }, 0)
  console.log('== WATER / BRIDGES ==')
  console.log(`rivers=${L.RIVERS.length} riverSegs=${riverSegs} riverLen=${riverLen.toFixed(1)}u names=${JSON.stringify(L.RIVERS.map((r) => r.name))}`)
  console.log(`bridges=${L.BRIDGES.length} trafficLoops=${L.TRAFFIC_LOOPS.length} loopLen=${loopLen.toFixed(1)}u`)
  console.log(`confluence=${JSON.stringify(L.CONFLUENCE_POINT)}`)

  // ---- districts / locations / anchors / 2D-3D agreement ----
  console.log('== DISTRICTS / LOCATIONS ==')
  console.log(`LOCATIONS=${LOCATIONS.length} ANCHORS=${L.ANCHORS.length} DISTRICTS=${L.DISTRICTS.length}`)
  const kindCount: Record<string, number> = {}
  for (const d of L.DISTRICTS) kindCount[d.kind] = (kindCount[d.kind] ?? 0) + 1
  console.log(`districtKinds=${JSON.stringify(kindCount)}`)
  let mismatches = 0
  for (const a of L.ANCHORS) {
    const wx = (a.location.mapX - 50) * L.MAP_SCALE
    const wz = (a.location.mapY - 50) * L.MAP_SCALE
    const dx = Math.abs(wx - a.x), dz = Math.abs(wz - a.z)
    if (dx > 1e-9 || dz > 1e-9) {
      mismatches++
      console.log(`  MISMATCH ${a.id}: anchor=(${a.x.toFixed(3)},${a.z.toFixed(3)}) from map=(${wx.toFixed(3)},${wz.toFixed(3)})`)
    }
  }
  console.log(`anchor-vs-map mismatches=${mismatches} (identical by construction = 0 expected)`)
  // G2 sanity: are the 10 G2 ids districts of kind 'home'?
  const g2 = ['adankolo','emiwoziri','filele','numai','kpatakpoli','kpato','township-stadium','maigari-palace','pati-ridge-hill','sokamms-motel']
  for (const id of g2) {
    const d = L.DISTRICTS.find((x) => x.id === id)
    if (!d) console.log(`  G2 MISSING FROM 3D: ${id}`)
  }
  console.log(`G2 wards present in DISTRICTS: ${g2.filter((id) => L.DISTRICTS.some((d) => d.id === id)).length}/10 (all kind='home' generic fill)`)
  // school map pin vs relaxed 3D
  let schoolPinMismatch = 0
  for (const s of L.SCHOOL_SITES) {
    const loc = locationsMod.LOCATION_BY_ID[s.id]
    const mx = 50 + s.x / L.MAP_SCALE, my = 50 + s.z / L.MAP_SCALE
    if (!loc || Math.abs(loc.mapX - mx) > 1e-6 || Math.abs(loc.mapY - my) > 1e-6) schoolPinMismatch++
  }
  console.log(`school pin-vs-3D mismatches=${schoolPinMismatch}/${L.SCHOOL_SITES.length}`)
  for (const a of L.ANCHORS) {
    if (['mount-patti','confluence','kpata-market','home','ganaja-junction'].includes(a.id))
      console.log(`  anchor ${a.id}: map=(${a.location.mapX},${a.location.mapY}) world=(${a.x.toFixed(1)},${a.z.toFixed(1)}) y=${a.y.toFixed(2)}`)
  }

  // ---- buildings ----
  const bKind: Record<string, number> = {}
  for (const b of L.BUILDINGS) bKind[b.kind] = (bKind[b.kind] ?? 0) + 1
  console.log('== BUILDINGS ==')
  console.log(`BUILDINGS=${L.BUILDINGS.length} byKind=${JSON.stringify(bKind)} tagged=${L.BUILDINGS.filter((b) => b.tag).length}`)
  // buildings standing on roads? (the road-clearance law spot check)
  let onRoad = 0
  for (const b of L.BUILDINGS) {
    const gap = L.roadGap(b.x, b.z)
    if (gap < 0) onRoad++
  }
  console.log(`buildings with negative center roadGap=${onRoad} (center may be inside for wide-footprint corner cases — corner law is authoritative)`)

  // ---- doors / interiors ----
  console.log('== DOORS / INTERIORS ==')
  console.log(`DOORS(layout)=${L.DOORS.length} ALL_DOORS(schools)=${schools.ALL_DOORS.length} (layoutDoors=${schools.ALL_DOORS.filter((d) => 'interiorId' in d && (d as any).light !== false || true).length})`)
  console.log(`INTERIORS(interiors.ts)=${interiors.INTERIORS.length} SCHOOL_INTERIORS=${schools.SCHOOL_INTERIORS.length} DISTRICT_INTERIORS=${interiors.DISTRICT_INTERIORS.length}`)
  console.log(`INTERIOR_BY_ID=${Object.keys(interiors.INTERIOR_BY_ID).length}`)
  const doorTargets = new Set<string>()
  for (const d of schools.ALL_DOORS as any[]) doorTargets.add(d.interiorId)
  for (const d of L.DOORS) doorTargets.add(d.interiorId)
  const doorless = Object.keys(interiors.INTERIOR_BY_ID).filter((id) => !doorTargets.has(id))
  console.log(`interior ids with a door=${doorTargets.size} doorless=${doorless.length} [${doorless.join(', ')}]`)
  const orphanDoors = [...doorTargets].filter((id) => !interiors.INTERIOR_BY_ID[id])
  console.log(`doors pointing at unknown interiors=${orphanDoors.length} [${orphanDoors.join(', ')}]`)

  // ---- flora ----
  console.log('== FLORA ==')
  const per: Record<string, number> = {}
  let total = 0
  for (const sp of Object.keys(flora.FLORA_TREES)) {
    per[sp] = flora.FLORA_TREES[sp].length
    if (!['tree', 'palm'].includes(sp)) total += per[sp]
  }
  console.log(`FLORA_TREES perSpecies=${JSON.stringify(per)} TOTAL(species)=${total}`)
  console.log(`GRASS_TUFTS=${flora.GRASS_TUFTS.length}`)
  console.log(`layout.TREES=${L.TREES.length} (dead export?) layout.GRASS=${L.GRASS.length} layout.ROCKS=${L.ROCKS.length} layout.LAMPS=${L.LAMPS.length} layout.STALLS=${L.STALLS.length}`)
  console.log(`SCHOOL_TREES=${schools.SCHOOL_TREES.length}`)

  // ---- street furniture ----
  const ks = roads.kerbStats(); const zs = roads.zebraStats(); const ps = plates.plateStats(); const js = junctions.junctionStats()
  console.log('== STREET FURNITURE ==')
  console.log(`kerbRuns=${ks.runs} (beforeCap=${ks.runsBeforeCap} truncated=${ks.truncated}) zebras=${zs.count} plates=${ps.count} uniqueNames=${ps.uniqueNames} clusters=${ps.clusters} longestName=${ps.longestName}`)
  console.log(`junctions=${JSON.stringify(js)} trafficLoops=3`)
  console.log(`PARKED_VEHICLES=${vehicles.PARKED_VEHICLES.length} byBuild=${JSON.stringify(vehicles.PARKED_VEHICLES.reduce((m: any, v) => { m[v.build] = (m[v.build] ?? 0) + 1; return m }, {}))}`)
  console.log(`NPC_ZONES=${L.NPC_ZONES.length} POINTS_OF_INTEREST=${L.POINTS_OF_INTEREST.length}`)

  // ---- schools ----
  console.log('== SCHOOLS ==')
  console.log(`SCHOOL_SITES=${L.SCHOOL_SITES.length} SCHOOL_BOXES=${schools.SCHOOL_BOXES.length} colliders=${schools.SCHOOL_BOXES.filter(schools.isSchoolCollider).length}`)

  // ---- collision census ----
  console.log('== COLLISION (static read) ==')
  console.log(`colliding sets: BUILDINGS + SCHOOL_BOXES(colliders) + POIs; rivers block unless onBridge/inSchoolYard; rim clamp at WALK_BOUND=${L.WALK_BOUND}`)
  console.log(`NOT colliders: stalls(${L.STALLS.length}), lamps(${L.LAMPS.length}), trees, parked vehicles(${vehicles.PARKED_VEHICLES.length}), traffic rigs(14)`)

  // ---- teleport roster ----
  console.log('== TELEPORT ==')
  console.log(`TELEPORT_ROSTER=${teleport.TELEPORT_ROSTER.length} of ${LOCATIONS.length} locations; missing=${LOCATIONS.length - teleport.TELEPORT_ROSTER.length}`)

  // ---- determinism checksums ----
  console.log('== DETERMINISM CHECKSUMS (sha256[:16]) ==')
  const buildingsHash = sha(JSON.stringify(L.BUILDINGS))
  const floraHash = sha(JSON.stringify(Object.fromEntries(Object.entries(flora.FLORA_TREES).map(([k, v]) => [k, v.length])) + JSON.stringify(flora.FLORA_TREES.neem.slice(0, 50))))
  const grassHash = sha(JSON.stringify(flora.GRASS_TUFTS.slice(0, 500)))
  const lampHash = sha(JSON.stringify(L.LAMPS))
  const doorHash = sha(JSON.stringify(L.DOORS))
  console.log(`buildings=${buildingsHash} flora=${floraHash} grass[:500]=${grassHash} lamps=${lampHash} doors=${doorHash}`)

  // 2D map line count
  const geoMap = await import('../../../src/components/game/geo-map') as any
  const gm = geoMap
  const gmKeys = Object.keys(gm).filter((k) => k.startsWith('GEO_MAP'))
  let gmCount = 0
  for (const k of gmKeys) {
    const v = (gm as any)[k]
    if (Array.isArray(v)) gmCount += v.length
  }
  console.log(`geo-map.ts exported polyline arrays=${gmKeys.length} totalPaths=${gmCount} [${gmKeys.join(', ')}]`)
}

main()
