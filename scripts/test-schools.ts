import "./geo/bootstrap"
/**
 * LOKOJA LIFE — Stage 7: THE SCHOOLS OF LOKOJA
 * ---------------------------------------------
 * Deterministic checks for the school layer:
 *   - the registry (12 real schools, real projections, honest anchors)
 *   - site separation + rim containment (the Felele corridor campuses)
 *   - compound geometry off the real carriageways, on flat dry plateaus
 *   - the gate gap is REALLY walkable (full world-collision walk sim)
 *   - every school interior is registered, spawns resolve, and is BFS-pathable
 *   - doors ↔ interiors ↔ locations joins, 2D map grid agreement
 * Run: bun scripts/test-schools.ts
 */

import {
  SCHOOLS, SCHOOL_BY_ID, projectLatLon, LEGACY_ANCHOR_XY, SCHOOL_PLANS,
} from '../src/game/data/schools'
import { LOCATION_BY_ID, LOCATIONS } from '../src/game/data/locations'
import {
  heightAt, WALK_BOUND, WATER_Y, roadDistance, roadDistanceMajors, MAP_SCALE, ANCHOR_BY_ID, SCHOOL_SITES,
} from '../src/game/world3d/layout'
import {
  SCHOOL_COMPOUNDS, SCHOOL_BOXES, SCHOOL_DOORS, SCHOOL_TREES, ALL_DOORS,
  isSchoolCollider,
} from '../src/game/world3d/schools'
import {
  INTERIORS, INTERIOR_BY_ID, interiorColliders, resolveInteriorPosition,
  FURN_FOOTPRINT, INTERIOR_PLAYER_RADIUS,
} from '../src/game/world3d/interiors'
import { INTERIOR as INTERIOR_CFG } from '../src/game/data/config'
import { resolvePosition } from '../src/game/world3d/collision'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

/* ------------------------------- the registry -------------------------------- */

console.log('\nSTAGE 7 — THE SCHOOL REGISTRY')
check('twelve real schools', SCHOOLS.length === 12)
check('school ids unique', new Set(SCHOOLS.map((s) => s.id)).size === SCHOOLS.length)
check('every school registered as a first-class location', SCHOOLS.every((s) => !!LOCATION_BY_ID[s.id]))
// G2-SPACES appended 10 district spaces to the same registry (append-only
// law) — the LEGACY LAW this check guards is still "the ten launch rows keep
// their identity": now pinned by id AND by honest count (10 legacy + 10 G2).
const LEGACY_CITY_IDS = ['home', 'kpata-market', 'ganaja-junction', 'confluence', 'mount-patti', 'historic-lokoja', 'government-area', 'university-area', 'food-area', 'transport-area']
check('stable city ids untouched (the ten launch rows, pinned by id)', LEGACY_CITY_IDS.every((id) => !!LOCATION_BY_ID[id] && !SCHOOL_BY_ID[id]))
check('non-school roster = 10 legacy + 10 G2 spaces', LOCATIONS.filter((l) => !SCHOOL_BY_ID[l.id]).length === 20, `got ${LOCATIONS.filter((l) => !SCHOOL_BY_ID[l.id]).length}`)
check(
  'kind coverage — 3 university, 1 polytechnic, 7 secondary, 1 college',
  SCHOOLS.filter((s) => s.kind === 'university').length === 3 &&
    SCHOOLS.filter((s) => s.kind === 'polytechnic').length === 1 &&
    SCHOOLS.filter((s) => s.kind === 'secondary').length === 7 &&
    SCHOOLS.filter((s) => s.kind === 'college').length === 1,
)
check('every school carries motto + founded + real-source note', SCHOOLS.every((s) => s.motto.length > 3 && s.founded.length === 4 && s.sourceNote.length > 10))
check(
  'anchor honesty — FUL + Faithview from OSM, Crowther + Julitola from plus-codes',
  SCHOOL_BY_ID['ful-felele'].anchor === 'osm' &&
    SCHOOL_BY_ID['faithview-academy'].anchor === 'osm' &&
    SCHOOL_BY_ID['crowther-memorial'].anchor === 'plus-code' &&
    SCHOOL_BY_ID['julitola-intl'].anchor === 'plus-code',
)

/* ------------------------------- projections --------------------------------- */

console.log('\nSTAGE 7 — REAL-WORLD PROJECTION')
check(
  'projectLatLon matches the geo pipeline (Kpata road-snapped anchor sanity)',
  (() => {
    // the raw Crowther decode must sit NW of the centre, near Patti's foot
    const [x, z] = projectLatLon(7.80591, 6.74163)
    return x < -30 && z < -40 && Math.abs(x + 48) < 3 && Math.abs(z + 68) < 3
  })(),
)
check(
  'FUL raw projection is genuinely ~10 km out (rim-pulled for playability)',
  (() => {
    const [x, z] = projectLatLon(7.85343, 6.68416)
    return Math.hypot(x, z) > 380
  })(),
)
check(
  'every pulled site honestly records rimPulled',
  SCHOOL_SITES.every((s) => {
    const raw = Math.hypot(...projectLatLon(s.lat, s.lon))
    return s.rimPulled === (raw > 272)
  }),
)

/* --------------------------------- sites ------------------------------------- */

console.log('\nSTAGE 7 — SITE LAYOUT')
check('every site inside the playable rim', SCHOOL_SITES.every((s) => Math.hypot(s.x, s.z) <= 272.5))
check(
  'no two campuses collide (relaxation held)',
  (() => {
    for (let i = 0; i < SCHOOL_SITES.length; i++) {
      for (let j = i + 1; j < SCHOOL_SITES.length; j++) {
        const a = SCHOOL_SITES[i]
        const b = SCHOOL_SITES[j]
        const minD = (a.plateauR + b.plateauR) * 0.62 + 8
        if (Math.hypot(a.x - b.x, a.z - b.z) < minD - 0.01) return false
      }
    }
    return true
  })(),
)
check('map grid agrees with world geometry', SCHOOL_SITES.every((s) =>
  Math.abs(s.mapX - (50 + s.x / MAP_SCALE)) < 0.01 && Math.abs(s.mapY - (50 + s.z / MAP_SCALE)) < 0.01,
))
check('map pins inside the canvas', SCHOOL_SITES.every((s) => s.mapX > 1 && s.mapX < 99 && s.mapY > 1 && s.mapY < 99))
check('every site has a flat buildable plateau', SCHOOL_SITES.every((s) => {
  const h0 = heightAt(s.x, s.z)
  for (const [dx, dz] of [[s.plateauR * 0.4, 0], [-s.plateauR * 0.4, 0], [0, s.plateauR * 0.4], [0, -s.plateauR * 0.4]]) {
    if (Math.abs(heightAt(s.x + dx, s.z + dz) - h0) > 0.06) return false
  }
  return true
}))
check(
  'LEGACY_ANCHOR_XY matches the real anchors (drift-proof)',
  LEGACY_ANCHOR_XY.every(({ id, x, z }) => {
    const a = ANCHOR_BY_ID[id]
    return a && Math.abs(a.x - x) < 0.06 && Math.abs(a.z - z) < 0.06
  }),
)
check(
  'schools do not stomp the LEGACY anchors (plateaus clear them)',
  SCHOOL_SITES.every((s) =>
    LEGACY_ANCHOR_XY.every((a) => Math.hypot(a.x - s.x, a.z - s.z) > s.plateauR + 16.9),
  ),
)
check(
  'school anchors + 2D registry adopted the final relaxed positions',
  SCHOOL_SITES.every((s) => {
    const a = ANCHOR_BY_ID[s.id]
    const l = LOCATION_BY_ID[s.id]
    return Math.abs(a.x - s.x) < 0.01 && Math.abs(l.mapX - s.mapX) < 0.01
  }),
)

/* ------------------------------ compounds ------------------------------------- */

console.log('\nSTAGE 7 — COMPOUNDS (walls, gate, blocks, yard)')
check('one compound per school', SCHOOL_COMPOUNDS.length === SCHOOLS.length)
check('every compound carries boxes + a gate + a yard', SCHOOL_COMPOUNDS.every((c) => c.boxes.length > 20 && c.gate && c.groundR > 4))
check('every compound faces its real road (gate offset present)', SCHOOL_COMPOUNDS.every((c) => c.drive !== null))
check(
  'no compound structure sits IN a live major carriageway',
  SCHOOL_BOXES.filter(isSchoolCollider).every((b) => roadDistanceMajors(b.x, b.z) > 2.4),
)
check('every structure on dry, in-bounds ground', SCHOOL_BOXES.every(
  (b) => b.y > WATER_Y + 0.5 && Math.hypot(b.x, b.z) < WALK_BOUND,
))
check('assembly ground has a flagpole inside it', SCHOOL_COMPOUNDS.every((c) => {
  const flag = c.boxes.find((b) => b.kind === 'flag')
  return flag && Math.hypot(flag.x - c.assembly.x, flag.z - c.assembly.z) < c.assembly.r + 2
}))
check('every school has classroom blocks + veranda + pillars', SCHOOL_COMPOUNDS.every((c) =>
  c.boxes.some((b) => b.kind === 'block') &&
  c.boxes.some((b) => b.kind === 'veranda') &&
  c.boxes.filter((b) => b.kind === 'pillar').length >= 10,
))
check('perimeter wall is a closed ring with ONE gate gap', SCHOOL_COMPOUNDS.every((c) => {
  const walls = c.boxes.filter((b) => b.kind === 'wall')
  return walls.length === 5 // front-left, front-right, back, left, right
}))
check('compound trees are on dry land, in-bounds, sane scale', SCHOOL_TREES.every((t) =>
  t.y > WATER_Y + 0.5 && Math.hypot(t.x, t.z) < WALK_BOUND && t.scale > 0.5,
))

console.log('\nSTAGE 7 — THE GATE IS REALLY WALKABLE (world-collision walk sim)')
for (const c of SCHOOL_COMPOUNDS) {
  // walk from just outside the gate to the assembly ground through the gap
  const gx = c.gate.x + Math.sin(c.rotY) * 3.5
  const gz = c.gate.z + Math.cos(c.rotY) * 3.5
  let x = gx
  let z = gz
  let blocked = false
  for (let step = 0; step < 80; step++) {
    const dx = c.assembly.x - x
    const dz = c.assembly.z - z
    const d = Math.hypot(dx, dz)
    if (d < 2.5) break // close enough — the flag base owns the exact centre
    const intended = 0.5
    const px = x
    const pz = z
    ;[x, z] = resolvePosition(x + (dx / d) * intended, z + (dz / d) * intended)
    // the resolver should never eat most of an open-yard step
    if (Math.hypot(x - px, z - pz) < intended * 0.35) {
      blocked = true
      break
    }
  }
  const arrived = Math.hypot(x - c.assembly.x, z - c.assembly.z) < 5
  check(`${c.site.shortName}: street → gate → assembly ground walkable`, !blocked && arrived, `stuck at (${x.toFixed(1)},${z.toFixed(1)})`)
}

/* ------------------------------- interiors ------------------------------------ */

console.log('\nSTAGE 7 — SCHOOL INTERIORS (inside and out)')
const schoolInteriors = INTERIORS.filter((i) => !!SCHOOL_BY_ID[i.locationId])
const roomCount = (suffix: string): number =>
  schoolInteriors.filter((i) => i.id === `${i.locationId}-${suffix}`).length
check(
  'every school has a classroom; the great-schools inventory adds up',
  schoolInteriors.length === 88 &&
    SCHOOLS.every((s) => schoolInteriors.some((i) => i.locationId === s.id && i.id === `${s.id}-class`)) &&
    roomCount('office') === 11 &&
    roomCount('library') === 8 &&
    roomCount('lab') === 5 &&
    roomCount('canteen') === 11 &&
    roomCount('clinic') === 12 &&
    roomCount('sci-lab') === 7 &&
    roomCount('hall') === 7 &&
    roomCount('hostel') === 4,
)
check(
  'the Stage 8 great buildings exist — FUL senate + faculties + twin theatres + hostels',
  schoolInteriors.some((i) => i.id === 'ful-felele-senate') &&
    schoolInteriors.some((i) => i.id === 'ful-felele-fac-arts') &&
    schoolInteriors.some((i) => i.id === 'ful-felele-fac-sci') &&
    schoolInteriors.some((i) => i.id === 'ful-felele-lt-b') &&
    schoolInteriors.some((i) => i.id === 'ful-felele-hostel') &&
    schoolInteriors.some((i) => i.id === 'ful-adankolo-anatomy') &&
    schoolInteriors.some((i) => i.id === 'ful-adankolo-preclinic') &&
    schoolInteriors.some((i) => i.id === 'ksp-felele-workshop') &&
    schoolInteriors.some((i) => i.id === 'salem-university-chapel') &&
    schoolInteriors.some((i) => i.id === 'al-azhar-college-mosque') &&
    schoolInteriors.some((i) => i.id === 'college-nursing-demo') &&
    ['crowther-memorial', 'gyb-model-adankolo', 'faithview-academy', 'baptist-high', 'al-azhar-college', 'julitola-intl', 'christfield-school']
      .every((id) => schoolInteriors.some((i) => i.id === `${id}-office`)),
)
check(
  'every plan building placed — no school drops a planned structure',
  SCHOOL_COMPOUNDS.every((c) => c.plans.length === (SCHOOL_PLANS[c.site.id]?.length ?? 0)),
)
check('school interior ids unique across the whole registry', new Set(INTERIORS.map((i) => i.id)).size === INTERIORS.length)
check('INTERIOR_BY_ID is a full index over the school set', schoolInteriors.every((i) => INTERIOR_BY_ID[i.id] === i))
check('school furniture uses real footprints (desks, boards, maps, computers)', schoolInteriors.every((i) =>
  i.furniture.every((f) => !!FURN_FOOTPRINT[f.kind]),
))
check('classrooms carry the full lesson set (desks + board + map + study action)', schoolInteriors
  .filter((i) => i.id.endsWith('-class'))
  .every((i) =>
    i.furniture.some((f) => f.kind === 'school-desk') &&
    i.furniture.some((f) => f.kind === 'blackboard') &&
    i.furniture.some((f) => f.kind === 'wallmap') &&
    (i.actions ?? []).some((a) => a.kind === 'study'),
  ))
check('desks + chairs counts read like a real classroom', (() => {
  const room = INTERIOR_BY_ID['crowther-memorial-class']
  const desks = room.furniture.filter((f) => f.kind === 'school-desk').length
  const chairs = room.furniture.filter((f) => f.kind === 'chair').length
  return desks === 12 && chairs >= 24 // 4 rows × 3 cols, two pupils per desk
})())
check('study economy lives in config (smart XP > 0, honest slot cost)', INTERIOR_CFG.study.smartXp > 0 && INTERIOR_CFG.study.energy < 0 && INTERIOR_CFG.study.hunger < 0)

console.log('\nSTAGE 7 — INTERIOR SPAWN + PATHABILITY')
for (const def of schoolInteriors) {
  const [sx, sz] = resolveInteriorPosition(def, def.spawn.x, def.spawn.z)
  check(`${def.id} spawn resolves inside`, Math.abs(sx) < def.size.w / 2 && Math.abs(sz) < def.size.d / 2)

  // BFS over the collision raster — spawn must reach every hotspot + action
  const step = 0.15
  const nx = Math.floor(def.size.w / step)
  const nz = Math.floor(def.size.d / step)
  const boxes = interiorColliders(def)
  const blocked = new Set<string>()
  const key = (ix: number, iz: number) => `${ix},${iz}`
  const toIdx = (x: number) => Math.floor((x + def.size.w / 2) / step)
  const toIdz = (z: number) => Math.floor((z + def.size.d / 2) / step)
  for (let ix = 0; ix < nx; ix++) {
    for (let iz = 0; iz < nz; iz++) {
      const x = -def.size.w / 2 + (ix + 0.5) * step
      const z = -def.size.d / 2 + (iz + 0.5) * step
      for (const b of boxes) {
        const dx = x - b.cx
        const dz = z - b.cz
        if (dx * dx + dz * dz > (b.hw + b.hd + INTERIOR_PLAYER_RADIUS) ** 2) continue
        const lx = dx * b.cos - dz * b.sin
        const lz = dx * b.sin + dz * b.cos
        if (Math.abs(lx) <= b.hw + INTERIOR_PLAYER_RADIUS && Math.abs(lz) <= b.hd + INTERIOR_PLAYER_RADIUS) {
          blocked.add(key(ix, iz))
          break
        }
      }
    }
  }
  const [rsx, rsz] = resolveInteriorPosition(def, def.spawn.x, def.spawn.z)
  const start: [number, number] = [toIdx(rsx), toIdz(rsz)]
  const reach = new Set<string>([key(start[0], start[1])])
  const queue: [number, number][] = [start]
  while (queue.length) {
    const [cx, cz] = queue.shift()!
    for (const [ddx, ddz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const tx = cx + ddx
      const tz = cz + ddz
      if (tx < 0 || tz < 0 || tx >= nx || tz >= nz) continue
      const k = key(tx, tz)
      if (reach.has(k) || blocked.has(k)) continue
      reach.add(k)
      queue.push([tx, tz])
    }
  }
  const targets = [
    ...def.hotspots.map((h) => h.id),
    ...(def.actions ?? []).map((a) => a.id),
  ]
  const unreachable: string[] = []
  for (const t of def.hotspots.map((h) => ({ id: h.id, x: h.x, z: h.z }))
    .concat((def.actions ?? []).map((a) => ({ id: a.id, x: a.x, z: a.z })))) {
    let ok = false
    for (let ox = -3; ox <= 3 && !ok; ox++) {
      for (let oz = -3; oz <= 3 && !ok; oz++) {
        if (reach.has(key(toIdx(t.x) + ox, toIdz(t.z) + oz))) ok = true
      }
    }
    if (!ok) unreachable.push(t.id)
  }
  check(`${def.id} BFS: ${targets.length} hotspots/actions reachable`, unreachable.length === 0, `blocked: ${unreachable.join(', ')}`)
}

/* --------------------------------- doors -------------------------------------- */

console.log('\nSTAGE 7 — DOORS + JOINS')
check('school doors exist for every school interior', SCHOOL_DOORS.length === schoolInteriors.length)
check('every school door resolves to a registered interior', SCHOOL_DOORS.every((d) => !!INTERIOR_BY_ID[d.interiorId]))
check('door ↔ interior location agreement', SCHOOL_DOORS.every((d) => INTERIOR_BY_ID[d.interiorId].locationId === d.locationId))
check('school doors on dry land + inside the walk bound', SCHOOL_DOORS.every((d) =>
  heightAt(d.x, d.z) > WATER_Y + 0.5 && Math.hypot(d.x, d.z) < WALK_BOUND,
))
check('ALL_DOORS = city doors + school doors', ALL_DOORS.length === SCHOOL_DOORS.length + 10)
check('no two doors collide within 1.5u', (() => {
  for (let i = 0; i < ALL_DOORS.length; i++) {
    for (let j = i + 1; j < ALL_DOORS.length; j++) {
      const a = ALL_DOORS[i]
      const b = ALL_DOORS[j]
      if (Math.hypot(a.x - b.x, a.z - b.z) < 1.5) return false
    }
  }
  return true
})())

/* ------------------------------ 2D map + travel ------------------------------- */

console.log('\nSTAGE 7 — MAP + TRAVEL READINESS')
check(
  'school locations carry travel data (transport + modifier)',
  SCHOOLS.every((s) => LOCATION_BY_ID[s.id].transport.length > 0 && LOCATION_BY_ID[s.id].travelModifier > 0),
)
check(
  'FUL permanent site honestly costs more travel time (1.35×) than town schools',
  LOCATION_BY_ID['ful-felele'].travelModifier === 1.35 && LOCATION_BY_ID['crowther-memorial'].travelModifier === 1,
)

console.log(`\n=== STAGE 7 SCHOOLS: ${passed} passed, ${failed} failed ===`)
if (failed > 0) process.exit(1)
