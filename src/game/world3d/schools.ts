/**
 * LOKOJA LIFE — School Compounds (Stage 7)
 * ------------------------------------------
 * Deterministic builders that turn the real-school registry
 * (data/schools.ts) into walkable, enterable 3D compounds:
 *   - perimeter wall with a real gate gap + gatehouse + painted name board
 *   - classroom blocks (long blocks, front veranda, pillars, louvre band)
 *   - admin / library / computer lab / head office blocks per school kind
 *   - swept sand assembly ground + flagpole, football pitch with markings
 *   - compound trees (mango/neem + palms at the gate) and a laterite
 *     driveway down to the nearest REAL road (the one it meets in Lokoja)
 *   - enterable interiors: classrooms with desks + chairs + blackboards,
 *     staff room, principal's office, library, computer lab, lecture theatre
 *
 * Everything is pure geometry + placement derived from the same heightAt
 * the roads and buildings use, so nothing floats or sinks. No economy,
 * no state — the study action flows through the store like every other.
 */

import {
  type SchoolSite,
  type SchoolKind,
} from '../data/schools'
import { GEO_ROADS } from './geo'
import { DOORS as LAYOUT_DOORS, SCHOOL_SITES, heightAt, makeRng, roadDistance, roadDistanceMajors, type TreeDef } from './layout'
import type { InteriorDef, FurnDef, WallSeg } from './interiors'

/** re-export for consumers that already imported DOORS from layout */
export type layoutDoor = (typeof LAYOUT_DOORS)[number]

/* ------------------------------ local transforms ----------------------------- */

interface Frame {
  x: number
  z: number
  rotY: number
}

/** local (lx, lz) → world, using the same yaw convention as layout (front = +Z) */
function toWorld(f: Frame, lx: number, lz: number): [number, number] {
  const c = Math.cos(f.rotY)
  const s = Math.sin(f.rotY)
  return [f.x + lx * c + lz * s, f.z - lx * s + lz * c]
}

/** a building box (arcade scale, matching the rest of the city) */
export type SchoolBoxKind =
  | 'wall' | 'pillar' | 'gatehouse' | 'block' | 'admin' | 'library'
  | 'lab' | 'office' | 'toilet' | 'theatre' | 'flag' | 'water' | 'veranda'

export interface SchoolBox {
  schoolId: string
  kind: SchoolBoxKind
  x: number
  z: number
  y: number
  w: number
  d: number
  h: number
  rotY: number
  /** which face carries the sign / door (degrees already baked into rotY) */
  tone: number
}

/* ------------------------------ road snapping -------------------------------- */

interface RoadPoint {
  x: number
  z: number
}

/** nearest point on the REAL road network (geo roads, pre-consumed) */
function nearestRoadPoint(x: number, z: number): RoadPoint {
  let best: RoadPoint = { x, z }
  let bestD = Infinity
  for (const r of GEO_ROADS) {
    for (let i = 0; i < r.pts.length - 1; i++) {
      const [ax, az] = r.pts[i]
      const [bx, bz] = r.pts[i + 1]
      const dx = bx - ax
      const dz = bz - az
      const len2 = dx * dx + dz * dz
      let t = len2 === 0 ? 0 : ((x - ax) * dx + (z - az) * dz) / len2
      t = Math.max(0, Math.min(1, t))
      const px = ax + dx * t
      const pz = az + dz * t
      const d = Math.hypot(x - px, z - pz)
      if (d < bestD) {
        bestD = d
        best = { x: px, z: pz }
      }
    }
  }
  return best
}

/* -------------------------------- plateaus ---------------------------------- */

// final site positions (rim-pulled + relaxed) live in the data module so
// layout.heightAt can carve the flat plateaus without an import cycle

/* ----------------------------- compound builder ------------------------------ */

export interface SchoolDoor {
  interiorId: string
  locationId: string
  x: number
  z: number
  y: number
  rotY: number
  label: string
  /** school doors skip the per-door point light (24 compounds × lights = overkill) */
  light?: false
}

export interface SchoolCompound {
  site: SchoolSite
  rotY: number
  boxes: SchoolBox[]
  doors: SchoolDoor[]
  trees: TreeDef[]
  /** swept sand yard radius */
  groundR: number
  assembly: { x: number; z: number; r: number }
  pitch: { x: number; z: number; w: number; d: number; rotY: number } | null
  /** laterite driveway from the real road to the gate (quad, world space) */
  drive: { ax: number; az: number; bx: number; bz: number } | null
  gate: { x: number; z: number; y: number }
}

/** wall height / thickness — classic school fence with coping */
const WALL_H = 2.1
const WALL_T = 0.34

function buildCompound(site: SchoolSite): SchoolCompound {
  const rng = makeRng(77000 + site.name.length * 131 + Math.round(site.x * 7))
  const boxes: SchoolBox[] = []
  const doors: SchoolDoor[] = []
  const trees: TreeDef[] = []
  const kind = site.kind

  // face the nearest REAL road — the gate opens toward the street it knows
  const road = nearestRoadPoint(site.x, site.z)
  let rotY = Math.atan2(road.x - site.x, road.z - site.z)

  // pick the compound position: a scored spiral around the relaxed site —
  // first candidate whose whole footprint clears the major carriageways
  // wins; otherwise the best-scoring (max majors clearance, rings close to
  // the true position). Minor streets may cross: they clip at the fence.
  let sx = site.x
  let sz = site.z
  // score every candidate; take the first fully-clear one, else the best
  // (max majors clearance, preferring rings close to the true position)
  let bestX = site.x
  let bestZ = site.z
  let bestScore = -Infinity
  search: for (let ring = 0; ring <= 12; ring++) {
    const step = ring === 0 ? 0 : 2.4
    const offs: [number, number][] = ring === 0 ? [[0, 0]] : []
    for (let k = 0; k < (ring === 0 ? 1 : 8); k++) {
      const ang = (k / 8) * Math.PI * 2
      offs.push([Math.cos(ang) * step * ring, Math.sin(ang) * step * ring])
    }
    for (const [ox, oz] of offs) {
      const cx = site.x + ox
      const cz = site.z + oz
      let minMajors = Infinity
      for (const [lx, lz] of [
        [-site.w / 2, site.d / 2], [0, site.d / 2], [site.w / 2, site.d / 2],
        [-site.w / 2, 0], [0, 0], [site.w / 2, 0],
        [-site.w / 2, -site.d / 2], [0, -site.d / 2], [site.w / 2, -site.d / 2],
      ]) {
        // majors must stay live (traffic + lamps) — minor streets that cross
        // the footprint are fine, they clip at the fence like real satellite
        minMajors = Math.min(minMajors, roadDistanceMajors(...toWorld({ x: cx, z: cz, rotY }, lx, lz)))
      }
      const score = minMajors - ring * 0.12
      if (minMajors > 3.4) {
        sx = cx
        sz = cz
        break search
      }
      if (score > bestScore) {
        bestScore = score
        bestX = cx
        bestZ = cz
      }
    }
    sx = bestX
    sz = bestZ
  }
  const frame: Frame = { x: sx, z: sz, rotY }
  const hw = site.w / 2
  const hd = site.d / 2

  const add = (
    lx: number,
    lz: number,
    w: number,
    d: number,
    h: number,
    boxKind: SchoolBoxKind,
    tone = 0,
    ownRot = 0,
  ): SchoolBox => {
    const [x, z] = toWorld(frame, lx, lz)
    const box: SchoolBox = {
      schoolId: site.id,
      kind: boxKind,
      x,
      z,
      y: heightAt(x, z),
      w,
      d,
      h,
      rotY: frame.rotY + ownRot,
      tone,
    }
    boxes.push(box)
    return box
  }

  /* ------------------------------ perimeter wall ----------------------------- */
  // segments run along the local rect; the gate gap (5.2 wide) sits front-centre
  const gateHalf = 2.6
  const sideHalf = 1.3 // half wall length step for corners
  const wallSeg = (
    ax: number,
    az: number,
    bx: number,
    bz: number,
  ): void => {
    const mx = (ax + bx) / 2
    const mz = (az + bz) / 2
    const horiz = az === bz
    const len = (horiz ? Math.abs(bx - ax) : Math.abs(bz - az)) + WALL_T
    add(mx, mz, horiz ? len : WALL_T, horiz ? WALL_T : len, WALL_H, 'wall')
  }

  // front wall (z = +hd): two runs leaving the gate gap
  wallSeg(-hw, hd, -gateHalf, hd)
  wallSeg(gateHalf, hd, hw, hd)
  // back + sides
  wallSeg(-hw, -hd, hw, -hd)
  wallSeg(-hw, -hd, -hw, hd)
  wallSeg(hw, -hd, hw, hd)

  // rhythm pillars along the walls
  for (let px = -hw; px <= hw; px += 4.2) {
    if (Math.abs(px) < gateHalf + 1) continue
    add(px, hd, 0.55, 0.55, WALL_H + 0.5, 'pillar')
    add(px, -hd, 0.55, 0.55, WALL_H + 0.5, 'pillar')
  }
  for (let pz = -hd + 4.2; pz <= hd - 4.2; pz += 4.2) {
    add(-hw, pz, 0.55, 0.55, WALL_H + 0.5, 'pillar')
    add(hw, pz, 0.55, 0.55, WALL_H + 0.5, 'pillar')
  }

  /* ---------------------------- gatehouse + sign ----------------------------- */
  add(-gateHalf - 0.55, hd, 1.1, 1.3, 3.6, 'gatehouse', 1)
  add(gateHalf + 0.55, hd, 1.1, 1.3, 3.6, 'gatehouse', 1)
  const [gateX, gateZ] = toWorld(frame, 0, hd)
  const gate = { x: gateX, z: gateZ, y: heightAt(gateX, gateZ) }

  /* ------------------------------ building rows ------------------------------ */
  // Band plan (all local-z, front = +Z toward the gate):
  //   gate + assembly yard  →  classroom blocks row  →  specials / pitch band
  // Small compounds skip the pitch and paint their lines on the assembly
  // ground — exactly how Nigerian school yards really double as pitches.
  const BLOCK_W = 13.5
  const BLOCK_D = 5.4
  const BLOCK_H = 3.5
  const frontZ = Math.max(hd - 10.5, -hd + BLOCK_D / 2 + 2)
  const specialZ = -hd + 5.2
  const blocksUsed: { lx: number; lz: number }[] = []
  const nBlocks = site.w >= 26 ? 2 : 1
  for (let k = 0; k < nBlocks; k++) {
    const lx = nBlocks === 1 ? 0 : (k === 0 ? -hw + 1 + BLOCK_W / 2 : hw - 1 - BLOCK_W / 2)
    add(lx, frontZ, BLOCK_W, BLOCK_D, BLOCK_H, 'block', 0)
    // front veranda slab + pillars (the classic Nigerian school walkway)
    add(lx, frontZ + BLOCK_D / 2 + 0.85, BLOCK_W + 1.6, 1.9, 0.22, 'veranda')
    for (let vx = -BLOCK_W / 2 + 0.8; vx <= BLOCK_W / 2 - 0.8; vx += 3.2) {
      add(lx + vx, frontZ + BLOCK_D / 2 + 1.45, 0.42, 0.42, 2.6, 'pillar')
    }
    blocksUsed.push({ lx, lz: frontZ })
  }

  /* --------------------------- special buildings ----------------------------- */
  // head office / admin block — every school has one beside the gate
  const adminZ = hd - 4.4
  const adminX = hw - 4.6
  add(adminX, adminZ, 6.4, 5, 3.8, 'office', 0)
  // toilet block — back corner, real schools have the long squat block
  add(-hw + 3.4, -hd + 2.4, 4.6, 2.6, 2.4, 'toilet')

  // kind-specific buildings on the back band
  const specials: { lx: number; lz: number; interior: string | null }[] = []
  if (kind === 'university' || kind === 'polytechnic') {
    add(-hw + 8, specialZ, 8.2, 5.4, 4.2, 'library')
    specials.push({ lx: -hw + 8, lz: specialZ, interior: `${site.id}-library` })
    add(hw - 8, specialZ, 8.2, 5.4, 4.2, 'lab')
    specials.push({ lx: hw - 8, lz: specialZ, interior: `${site.id}-lab` })
    add(-adminX + 1.5, adminZ, 7, 5.2, 4.6, 'admin', 0) // senate / bursary
  } else if (kind === 'college') {
    add(-hw + 8, specialZ, 7.4, 5.2, 4, 'library')
    specials.push({ lx: -hw + 8, lz: specialZ, interior: `${site.id}-library` })
  } else if (site.id === 'crowther-memorial' || site.id === 'gyb-model-adankolo') {
    add(-hw + 8, specialZ, 7.4, 5.2, 4, 'library')
    specials.push({ lx: -hw + 8, lz: specialZ, interior: `${site.id}-library` })
  }
  if (site.id === 'ful-felele') {
    // the Twin Theatre — the big auditorium at the centre of the back band
    add(0, specialZ, 10.5, 6.4, 5, 'theatre')
  }

  // water tank stand — the borehole tower every compound has
  add(-hw + 1.8, hd - 2.2, 1.1, 1.1, 3.2, 'water')

  /* -------------------------- assembly ground + flag -------------------------- */
  const asmLz = (hd + frontZ + BLOCK_D / 2) / 2 + 0.6
  const asmR = Math.min(Math.min(hw, hd) * 0.6, (hd - (frontZ + BLOCK_D / 2)) * 0.72)
  const [asmX, asmZ] = toWorld(frame, 0, asmLz)
  const assembly = { x: asmX, z: asmZ, r: asmR }
  // flagpole on a small concrete base at the ground's heart
  add(0, asmLz, 1.4, 1.4, 0.5, 'pillar')
  add(0, asmLz, 0.16, 0.16, 5.6, 'flag')

  /* ------------------------------- football pitch ----------------------------- */
  // a real grass pitch only when the middle band can honestly hold one —
  // otherwise the assembly ground's painted lines double as the field
  let pitch: SchoolCompound['pitch'] = null
  if (site.field) {
    const topEdge = frontZ - BLOCK_D / 2 - 1
    const backEdge = specialZ + 2.7 + 1 + (specials.length || site.id === 'ful-felele' ? 6.4 / 2 : 0)
    const depth = topEdge - backEdge
    if (depth >= 6) {
      const pd = Math.min(depth, 12)
      const pw = Math.min(site.w * 0.72, 19)
      const pz = (topEdge + backEdge) / 2
      const [px, pzx] = toWorld(frame, 0, pz)
      pitch = { x: px, z: pzx, w: pw, d: pd, rotY: frame.rotY }
    }
  }

  /* -------------------------------- compound trees ---------------------------- */
  const putTree = (lx: number, lz: number, palm: boolean, scale: number): void => {
    const [x, z] = toWorld(frame, lx, lz)
    // keep trees off buildings + pitch + ground
    if (boxes.some((b) => Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.62 + 1.4)) return
    trees.push({
      x,
      z,
      y: heightAt(x, z),
      scale,
      tone: Math.floor(rng() * 5),
      kind: palm ? 'palm' : 'tree',
    })
  }
  // mango/neem shade rows along the side fences + behind the blocks
  for (let i = 0; i < 7; i++) {
    putTree(-hw + 2.2, -hd + 3 + i * ((site.d - 6) / 6), false, 0.9 + rng() * 0.5)
    putTree(hw - 2.2, -hd + 3 + i * ((site.d - 6) / 6), false, 0.9 + rng() * 0.5)
  }
  // palms framing the gate drive
  putTree(-gateHalf - 2.2, hd + 2.6, true, 1.05)
  putTree(gateHalf + 2.2, hd + 2.6, true, 1.05)
  putTree(-gateHalf - 3.4, hd + 7.5, true, 0.95)
  putTree(gateHalf + 3.4, hd + 7.5, true, 0.95)

  /* ------------------------------ driveway + doors ----------------------------- */
  const [gateOutX, gateOutZ] = toWorld(frame, 0, hd + 1.2)
  const drive = { ax: road.x, az: road.z, bx: gateOutX, bz: gateOutZ }

  // classroom door — first block, front veranda centre
  const firstBlock = blocksUsed[0]
  const [cdx, cdz] = toWorld(frame, firstBlock.lx, firstBlock.lz + BLOCK_D / 2 + 0.95)
  doors.push({
    interiorId: `${site.id}-class`,
    locationId: site.id,
    x: cdx,
    z: cdz,
    y: heightAt(cdx, cdz),
    rotY: frame.rotY,
    label: 'Enter the classroom',
  })

  // doors for the back-band buildings (library / lab), straight from the
  // specials registry so geometry and doors can never drift apart
  for (const sp of specials) {
    if (!sp.interior) continue
    const suffix = sp.interior.endsWith('-lab') ? 'lab' : 'library'
    const label = suffix === 'lab' ? 'Enter the computer lab' : kind === 'college' ? 'Enter the study hall' : 'Enter the library'
    const [dx0, dz0] = toWorld(frame, sp.lx, sp.lz + 5.4 / 2 + 0.95)
    doors.push({
      interiorId: sp.interior,
      locationId: site.id,
      x: dx0,
      z: dz0,
      y: heightAt(dx0, dz0),
      rotY: frame.rotY,
      label,
    })
  }
  // the principal's office door (secondary schools) — front-right block
  if (kind === 'secondary') {
    const [ox, oz] = toWorld(frame, adminX, adminZ + 2.5 + 0.95)
    doors.push({
      interiorId: `${site.id}-office`,
      locationId: site.id,
      x: ox,
      z: oz,
      y: heightAt(ox, oz),
      rotY: frame.rotY,
      label: "Enter the principal's office",
    })
  }
  // the FUL lecture-theatre door — centre of the back band
  if (site.id === 'ful-felele') {
    const [tx, tz] = toWorld(frame, 0, specialZ + 6.4 / 2 + 0.95)
    doors.push({
      interiorId: `${site.id}-theatre`,
      locationId: site.id,
      x: tx,
      z: tz,
      y: heightAt(tx, tz),
      rotY: frame.rotY,
      label: 'Enter the lecture theatre',
    })
  }

  return {
    site,
    rotY: frame.rotY,
    boxes,
    doors,
    trees,
    groundR: Math.max(site.w, site.d) * 0.62,
    assembly,
    pitch,
    drive,
    gate,
  }
}

/* --------------------------- interiors (inside the schools) ------------------- */

/** interior-local wall from (ax,az)→(bx,bz) — same shape as interiors.ts */
function iwall(ax: number, az: number, bx: number, bz: number): WallSeg {
  const horiz = az === bz
  const T = 0.3
  return {
    x: (ax + bx) / 2,
    z: (az + bz) / 2,
    w: horiz ? Math.abs(bx - ax) + T : T,
    d: horiz ? T : Math.abs(bz - az) + T,
  }
}

/** door gap on the SOUTH wall of every school interior (uniform + simple) */
function schoolShell(w: number, d: number): WallSeg[] {
  return [
    iwall(-w / 2, -d / 2, w / 2, -d / 2), // north
    iwall(-w / 2, -d / 2, -w / 2, d / 2), // west
    iwall(w / 2, -d / 2, w / 2, d / 2), // east
    iwall(-w / 2, d / 2, -0.9, d / 2), // south, left of gap
    iwall(0.9, d / 2, w / 2, d / 2), // south, right of gap
  ]
}

/** classroom: rows of shared desks + chairs, blackboard, teacher table, map */
function classroomInterior(site: SchoolSite): InteriorDef {
  const w = 9
  const d = 7
  const furn: FurnDef[] = [
    // blackboard + chalk tray on the north wall, facing the class
    { kind: 'blackboard', x: 0, z: -3.28, rotY: 0, tone: 0 },
    { kind: 'wallmap', x: -3.6, z: -3.3, rotY: 0, tone: 0 },
    // teacher's table + chair front-right
    { kind: 'table', x: 3.2, z: -2.4, rotY: 0, tone: 1 },
    { kind: 'chair', x: 3.2, z: -1.55, rotY: Math.PI, tone: 1 },
    { kind: 'shelf', x: 4.15, z: -3.2, rotY: 0, s: 0.8, tone: 2 },
  ]
  // four rows × three columns of long shared desks, aisles kept walkable
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const x = -2.6 + col * 2.6
      const z = -1.3 + row * 1.0
      furn.push({ kind: 'school-desk', x, z, rotY: 0, tone: row % 2 })
      // two chairs tucked behind each shared desk
      furn.push({ kind: 'chair', x: x - 0.55, z: z + 0.62, rotY: Math.PI, tone: 0 })
      furn.push({ kind: 'chair', x: x + 0.55, z: z + 0.62, rotY: Math.PI, tone: 0 })
    }
  }
  furn.push({ kind: 'ceilingfan', x: -1.2, z: -0.6, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.4, z: 1.9, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.05, rotY: 0, tone: 0 })

  return {
    id: `${site.id}-class`,
    name: `${site.shortName} — Classroom`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Classroom', x: 0, z: -0.2, w, d: 6.4 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-class-exit`, kind: 'exit', x: 0, z: 3.05, label: `Back to ${site.shortName}` },
    ],
    actions: [
      { id: `${site.id}-study`, kind: 'study', x: 0, z: 2.55, label: 'Sit for a lesson' },
    ],
    spawn: { x: 0, z: 3.05, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#b99a68',
      floorAlt: '#a8875a',
      wall: site.paint,
      accent: site.color,
    },
    mealSpot: false,
    shopSpot: false,
  }
}

/** principal's office — where discipline and favour happen */
function officeInterior(site: SchoolSite): InteriorDef {
  const w = 7
  const d = 6
  return {
    id: `${site.id}-office`,
    name: `${site.shortName} — Principal's Office`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Office', x: 0, z: -0.3, w, d: 5.4 }],
    walls: schoolShell(w, d),
    furniture: [
      // the big desk facing the door, visitor chairs opposite
      { kind: 'table', x: 0, z: -1.9, rotY: 0, s: 1.35, tone: 2 },
      { kind: 'chair', x: 0, z: -2.6, rotY: 0, tone: 2 },
      { kind: 'chair', x: -1.1, z: -0.4, rotY: Math.PI + 0.25, tone: 1 },
      { kind: 'chair', x: 1.1, z: -0.4, rotY: Math.PI - 0.25, tone: 1 },
      // certificates + notice board on the wall (sign) + shelf of files
      { kind: 'sign', x: -1.9, z: -2.82, rotY: 0, tone: 1 },
      { kind: 'shelf', x: 2.9, z: -1.4, rotY: -Math.PI / 2, tone: 2 },
      { kind: 'crate', x: -2.9, z: 1.6, rotY: 0.2, tone: 0 },
      { kind: 'rug', x: 0, z: -0.2, rotY: 0, tone: 1 },
      { kind: 'ceilingfan', x: 0, z: -0.4, rotY: 0, tone: 0 },
      { kind: 'fan', x: 2.9, z: 2.2, rotY: Math.PI, tone: 0 },
    ],
    hotspots: [
      { id: `${site.id}-office-exit`, kind: 'exit', x: 0, z: 2.4, label: 'Step out of the office' },
    ],
    actions: [
      { id: `${site.id}-gist`, kind: 'study', x: 0, z: 0.2, label: 'Greet the principal' },
    ],
    spawn: { x: 0, z: 2.2, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#a8875a',
      floorAlt: '#96754b',
      wall: site.paint,
      accent: site.accent,
    },
    mealSpot: false,
    shopSpot: false,
  }
}

/** library / study hall — shelf rows and reading tables */
function libraryInterior(site: SchoolSite): InteriorDef {
  const w = 10
  const d = 8
  const furn: FurnDef[] = [
    // returns desk along the west wall, facing into the room
    { kind: 'counter', x: -4.15, z: 2.6, rotY: Math.PI / 2, s: 1.2, tone: 1 },
    { kind: 'sign', x: 0, z: -3.82, rotY: 0, tone: 0 }, // "QUIET" board
    { kind: 'wallmap', x: 2.6, z: -3.85, rotY: 0, tone: 1 },
  ]
  // shelf stacks along the side walls, reading tables in an open middle —
  // chairs sit north/south of each table so the centre aisle stays honest
  for (let i = 0; i < 3; i++) {
    furn.push({ kind: 'shelf', x: -3.6, z: -2.5 + i * 1.35, rotY: 0, s: 1.2, tone: i })
    furn.push({ kind: 'shelf', x: 3.6, z: -2.5 + i * 1.35, rotY: 0, s: 1.2, tone: (i + 1) % 3 })
  }
  const tables: [number, number][] = [
    [-1.35, 0.4], [1.35, 0.4], [-1.35, 1.9], [1.35, 1.9],
  ]
  for (const [tx, tz] of tables) {
    furn.push({ kind: 'table', x: tx, z: tz, rotY: 0, s: 1.1, tone: 0 })
    furn.push({ kind: 'chair', x: tx, z: tz - 0.8, rotY: 0, tone: 0 })
    furn.push({ kind: 'chair', x: tx, z: tz + 0.8, rotY: Math.PI, tone: 0 })
  }
  furn.push({ kind: 'ceilingfan', x: 0, z: 0.6, rotY: 0, tone: 0 })

  return {
    id: `${site.id}-library`,
    name: `${site.shortName} — Library`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Reading hall', x: 0, z: -0.4, w, d: 7 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-lib-exit`, kind: 'exit', x: 0, z: 3.3, label: 'Back outside' },
    ],
    actions: [
      { id: `${site.id}-read`, kind: 'study', x: 0, z: 1.55, label: 'Read for a while' },
    ],
    spawn: { x: 0, z: 3.4, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#b98d5f',
      floorAlt: '#a87a4e',
      wall: site.paint,
      accent: site.color,
    },
    mealSpot: false,
    shopSpot: false,
  }
}

/** computer lab — bench rows with monitors + a server crate */
function labInterior(site: SchoolSite): InteriorDef {
  const w = 9
  const d = 7
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -3.28, rotY: 0, tone: 1 }, // whiteboard
    { kind: 'crate', x: -3.9, z: -2.9, rotY: 0, tone: 1 }, // server stack
  ]
  // two bench rows of computers (wide centre aisle — the lab monitor row)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const x = col === 0 ? -1.6 : 1.6
      const z = -1.7 + row * 1.8
      furn.push({ kind: 'table', x, z, rotY: 0, s: 1.05, tone: 2 })
      furn.push({ kind: 'computer', x, z: z - 0.12, rotY: 0, tone: 0 })
      furn.push({ kind: 'chair', x, z: z + 0.75, rotY: Math.PI, tone: 1 })
    }
  }
  furn.push({ kind: 'ceilingfan', x: 0, z: -0.4, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 0, z: 1.8, rotY: 0, tone: 0 })

  return {
    id: `${site.id}-lab`,
    name: `${site.shortName} — Computer Lab`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Lab', x: 0, z: -0.2, w, d: 6.4 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-lab-exit`, kind: 'exit', x: 0, z: 3.1, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${site.id}-lab-study`, kind: 'study', x: 0, z: 0.9, label: 'Book a computer hour' },
    ],
    spawn: { x: 0, z: 3.0, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#cfc8b8',
      floorAlt: '#bfb6a2',
      wall: site.paint,
      accent: site.color,
    },
    floorTiles: true,
    mealSpot: false,
    shopSpot: false,
  }
}

/** lecture theatre — bench rows facing the board (the FUL experience) */
function theatreInterior(site: SchoolSite): InteriorDef {
  const w = 12
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -4.28, rotY: 0, tone: 0 },
    { kind: 'table', x: 2.9, z: -3.2, rotY: 0, s: 1.1, tone: 2 }, // lectern
    { kind: 'chair', x: 2.9, z: -2.4, rotY: Math.PI, tone: 2 },
    { kind: 'wallmap', x: -3.4, z: -4.3, rotY: 0, tone: 0 },
  ]
  for (let row = 0; row < 4; row++) {
    const z = -1.9 + row * 1.3
    for (let col = 0; col < 3; col++) {
      const x = -3.4 + col * 3.4
      furn.push({ kind: 'bench', x, z, rotY: 0, s: 1.5, tone: row % 2 })
    }
  }
  furn.push({ kind: 'ceilingfan', x: -2, z: -1, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.4, z: 2, rotY: 0, tone: 0 })

  return {
    id: `${site.id}-theatre`,
    name: `${site.shortName} — Lecture Theatre`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Theatre', x: 0, z: -0.4, w, d: 8 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-th-exit`, kind: 'exit', x: 0, z: 3.9, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${site.id}-lecture`, kind: 'study', x: 0, z: 2.75, label: 'Attend the lecture' },
    ],
    spawn: { x: 0, z: 3.3, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#c8bfa8',
      floorAlt: '#b6ac94',
      wall: site.paint,
      accent: site.color,
    },
    mealSpot: false,
    shopSpot: false,
  }
}

function interiorsFor(site: SchoolSite): InteriorDef[] {
  const list = [classroomInterior(site)]
  if (site.kind === 'university' || site.kind === 'polytechnic') {
    list.push(libraryInterior(site), labInterior(site))
  } else if (site.kind === 'college') {
    list.push(libraryInterior(site))
  } else if (site.kind === 'secondary') {
    list.push(officeInterior(site))
    if (site.id === 'crowther-memorial' || site.id === 'gyb-model-adankolo') {
      list.push(libraryInterior(site))
    }
  }
  if (site.id === 'ful-felele') list.push(theatreInterior(site))
  return list
}

/* --------------------------------- assembly ---------------------------------- */

export const SCHOOL_COMPOUNDS: SchoolCompound[] = SCHOOL_SITES.map(buildCompound)

export const SCHOOL_BOXES: SchoolBox[] = SCHOOL_COMPOUNDS.flatMap((c) => c.boxes)

/** collide against everything except the open gate arch + walkable veranda */
const COLLIDING_KINDS = new Set<SchoolBoxKind>([
  'wall', 'pillar', 'gatehouse', 'block', 'admin', 'library',
  'lab', 'office', 'toilet', 'theatre', 'flag', 'water',
])

export function isSchoolCollider(b: SchoolBox): boolean {
  return COLLIDING_KINDS.has(b.kind)
}

export const SCHOOL_DOORS: SchoolDoor[] = SCHOOL_COMPOUNDS.flatMap((c) => c.doors)

/**
 * Every interior door in the world — the city doors (layout) + the school
 * doors. Consumers (player interact scan, doorway props) use this one list
 * so nothing can drift between the two sets.
 */
export const ALL_DOORS: (layoutDoor | SchoolDoor)[] = [...LAYOUT_DOORS, ...SCHOOL_DOORS]

export const SCHOOL_TREES: TreeDef[] = SCHOOL_COMPOUNDS.flatMap((c) => c.trees)

/** all school interiors — registered alongside the city interiors */
export const SCHOOL_INTERIORS: InteriorDef[] =
  SCHOOL_SITES.flatMap((site) => interiorsFor(site))

/** every school compound interior id set (for door validation) */
export const SCHOOL_INTERIOR_IDS = new Set(SCHOOL_INTERIORS.map((i) => i.id))
