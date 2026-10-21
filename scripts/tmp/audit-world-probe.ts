/**
 * Documentation-truth audit probe — world/geography exact counts.
 * Imports the geo bootstrap FIRST (the repo law), then every layout-derived
 * module, and prints exact deterministic counts.
 */
import '../geo/bootstrap'

async function main() {
  const { LOCATIONS } = await import('../../src/game/data/locations')
  const layout = await import('../../src/game/world3d/layout')
  const schoolsW3d = await import('../../src/game/world3d/schools')
  const interiors = await import('../../src/game/world3d/interiors')
  const roadsF = await import('../../src/game/world3d/roads')
  const junctions = await import('../../src/game/world3d/junctions')
  const geo = await import('../../src/game/world3d/geo')
  const flora = await import('../../src/game/world3d/flora')

  const km = (u: number) => (u * 26) / 1000
  let roadLenU = 0
  let segs = 0
  for (const r of layout.ROADS) {
    for (let i = 0; i < r.pts.length - 1; i++) {
      const [ax, az] = r.pts[i]
      const [bx, bz] = r.pts[i + 1]
      roadLenU += Math.hypot(bx - ax, bz - az)
      segs++
    }
  }
  let riverSegs = 0
  let riverLenU = 0
  for (const r of layout.RIVERS) {
    riverSegs += r.points.length - 1
    for (let i = 0; i < r.points.length - 1; i++) {
      const [ax, az] = r.points[i]
      const [bx, bz] = r.points[i + 1]
      riverLenU += Math.hypot(bx - ax, bz - az)
    }
  }
  const floraStats = flora.floraStats()
  const grassStats = flora.grassStats()
  const perSpecies = floraStats.perSpecies as Record<string, number>

  const out: Record<string, unknown> = {
    'LOCATIONS.length': LOCATIONS.length,
    'ANCHORS.length': layout.ANCHORS.length,
    'DISTRICTS.length': layout.DISTRICTS.length,
    'ROADS.length (ways incl PATTI_TRAIL)': layout.ROADS.length,
    'ROAD segments (polyline legs)': segs,
    'ROAD total length (world units)': Math.round(roadLenU * 10) / 10,
    'ROAD total length (km at 26 m/u)': Math.round(km(roadLenU) * 10) / 10,
    'RIVERS.length': layout.RIVERS.length,
    'RIVER segments': riverSegs,
    'RIVER total length (km at 26 m/u)': Math.round(km(riverLenU) * 10) / 10,
    'RIVERS names': layout.RIVERS.map((r) => r.name),
    'BRIDGES.length': layout.BRIDGES.length,
    'DOORS.length': layout.DOORS.length,
    'BUILDINGS.length': layout.BUILDINGS.length,
    'BUILDINGS by kind': layout.BUILDINGS.reduce<Record<string, number>>((m, b) => { m[b.kind] = (m[b.kind] ?? 0) + 1; return m }, {}),
    'TREES (layout scatter).length': layout.TREES.length,
    'ROCKS.length': layout.ROCKS.length,
    'GRASS (layout).length': layout.GRASS.length,
    'LAMPS.length': layout.LAMPS.length,
    'STALLS.length': layout.STALLS.length,
    'NPC_ZONES.length': layout.NPC_ZONES.length,
    'POINTS_OF_INTEREST.length': layout.POINTS_OF_INTEREST.length,
    'TRAFFIC_LOOPS.length': layout.TRAFFIC_LOOPS.length,
    'SCHOOL_SITES.length': layout.SCHOOL_SITES.length,
    'KERB_RUNS.length': roadsF.KERB_RUNS.length,
    'ZEBRAS.length': roadsF.ZEBRAS.length,
    'JUNCTION_CLUSTERS.length': junctions.JUNCTION_CLUSTERS.length,
    'bigMouths (>=2 majors)': junctions.JUNCTION_CLUSTERS.filter((c) => c.majors >= 2).length,
    'TRAFFIC_LIGHTS.length': junctions.TRAFFIC_LIGHTS.length,
    'SPEED_BUMPS.length': junctions.SPEED_BUMPS.length,
    'DANFO_STOPS.length': junctions.DANFO_STOPS.length,
    'SCHOOL_COMPOUNDS.length': schoolsW3d.SCHOOL_COMPOUNDS.length,
    'SCHOOL_BOXES.length': schoolsW3d.SCHOOL_BOXES.length,
    'SCHOOL_DOORS.length': schoolsW3d.SCHOOL_DOORS.length,
    'SCHOOL_TREES.length': schoolsW3d.SCHOOL_TREES.length,
    'SCHOOL_INTERIORS.length': schoolsW3d.SCHOOL_INTERIORS.length,
    'INTERIORS.length (base+school)': interiors.INTERIORS.length,
    'DISTRICT_INTERIORS.length': interiors.DISTRICT_INTERIORS.length,
    'INTERIOR_BY_ID total': Object.keys(interiors.INTERIOR_BY_ID).length,
    'FLORA_TREES total': floraStats.total,
    'FLORA per species': perSpecies,
    'GRASS_TUFTS.length': grassStats.count,
    'TELEPORT_ROSTER.length': (await import('../../src/game/systems/teleport')).TELEPORT_ROSTER.length,
    'GEO_ROADS.length': geo.GEO_ROADS.length,
    'GEO_RIVERS.length': geo.GEO_RIVERS.length,
    'GEO_BRIDGES.length': geo.GEO_BRIDGES.length,
    'GEO_LOOPS.length': geo.GEO_LOOPS.length,
    'GEO_LOOPS loop sizes': geo.GEO_LOOPS.map((l) => l.length),
  }
  console.log(JSON.stringify(out, null, 2))
}

main()
