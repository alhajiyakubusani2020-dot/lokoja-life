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
  type BuildingPlan,
  type BuildingKind,
  SCHOOL_PLANS,
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
  // Stage 8 — the great schools
  | 'senate' | 'faculty' | 'hostel' | 'watchtower' | 'healthsci'
  | 'workshop' | 'chapel' | 'mosque' | 'hall' | 'canteen' | 'clinic' | 'demo'

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

/* ------------------------- plan footprints (exterior) ------------------------- */

/** exterior footprint per building kind — `small` for compact compounds */
const PLAN_FOOTPRINT: Record<BuildingKind, { w: number; d: number; h: number; small?: { w: number; d: number; h: number } }> = {
  senate: { w: 9, d: 6.6, h: 6.6 },
  library: { w: 10, d: 5.6, h: 4.4, small: { w: 5.4, d: 4.2, h: 3.6 } },
  faculty: { w: 7.8, d: 5.4, h: 4.2 },
  'computer-lab': { w: 8.2, d: 5.4, h: 4, small: { w: 5, d: 4.2, h: 3.6 } },
  'science-lab': { w: 8.4, d: 5.4, h: 4, small: { w: 5.4, d: 4.2, h: 3.6 } },
  'lecture-theatre': { w: 7.6, d: 6.2, h: 5, small: { w: 6, d: 4.6, h: 4.2 } },
  hostel: { w: 11.6, d: 5.2, h: 4.6, small: { w: 7.6, d: 4.6, h: 4 } },
  watchtower: { w: 1.7, d: 1.7, h: 7.2 },
  'health-sciences': { w: 9, d: 5.6, h: 4.8 },
  workshop: { w: 8.6, d: 5.4, h: 4.6 },
  chapel: { w: 7, d: 5.2, h: 4.8 },
  mosque: { w: 5.4, d: 4.8, h: 4.4 },
  'assembly-hall': { w: 8.4, d: 5.6, h: 5, small: { w: 5.8, d: 4.2, h: 4.2 } },
  canteen: { w: 6, d: 4.4, h: 3.8, small: { w: 3.6, d: 3.4, h: 3.2 } },
  clinic: { w: 5, d: 4.2, h: 3.6, small: { w: 3.6, d: 3.6, h: 3.2 } },
  'demo-lab': { w: 7, d: 5, h: 4 },
  admin: { w: 6.6, d: 5, h: 3.8, small: { w: 5, d: 4.2, h: 3.6 } },
}

/** plan kind → the exterior box kind the renderer draws */
function planBoxKind(kind: BuildingKind, schoolKind: SchoolKind): SchoolBoxKind {
  switch (kind) {
    case 'senate': return 'senate'
    case 'library': return 'library'
    case 'faculty': return 'faculty'
    case 'computer-lab':
    case 'science-lab': return 'lab'
    case 'lecture-theatre': return 'theatre'
    case 'hostel': return 'hostel'
    case 'watchtower': return 'watchtower'
    case 'health-sciences': return 'healthsci'
    case 'workshop': return 'workshop'
    case 'chapel': return 'chapel'
    case 'mosque': return 'mosque'
    case 'assembly-hall': return 'hall'
    case 'canteen': return 'canteen'
    case 'clinic': return 'clinic'
    case 'demo-lab': return 'demo'
    case 'admin': return schoolKind === 'secondary' ? 'office' : 'admin'
  }
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
  /** the plan buildings that were placed, with their LOCAL rects (tests) */
  plans: { plan: BuildingPlan; lx: number; lz: number; w: number; d: number; h: number; box: SchoolBox }[]
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
  // The footprint test is a 5×5 grid over the rect (walls, interior yards
  // and the plan buildings ALL have to stay off the majors).
  let sx = site.x
  let sz = site.z
  // score every candidate; take the first fully-clear one, else the best
  // (max majors clearance, preferring rings close to the true position)
  let bestX = site.x
  let bestZ = site.z
  let bestScore = -Infinity
  const rectMinMajors = (cx: number, cz: number): number => {
    const c = Math.cos(rotY)
    const s = Math.sin(rotY)
    let min = Infinity
    for (let gx = -2; gx <= 2; gx++) {
      for (let gz = -2; gz <= 2; gz++) {
        const lx = (gx / 2) * (site.w / 2 - 0.4)
        const lz = (gz / 2) * (site.d / 2 - 0.4)
        const wx = cx + lx * c + lz * s
        const wz = cz - lx * s + lz * c
        min = Math.min(min, roadDistanceMajors(wx, wz))
      }
    }
    return min
  }
  search: for (let ring = 0; ring <= 24; ring++) {
    const step = ring === 0 ? 0 : 2.4
    const offs: [number, number][] = ring === 0 ? [[0, 0]] : []
    for (let k = 0; k < (ring === 0 ? 1 : 8); k++) {
      const ang = (k / 8) * Math.PI * 2
      offs.push([Math.cos(ang) * step * ring, Math.sin(ang) * step * ring])
    }
    for (const [ox, oz] of offs) {
      const cx = site.x + ox
      const cz = site.z + oz
      // majors must stay live (traffic + lamps) — minor streets that cross
      // the footprint are fine, they clip at the fence like real satellite
      const minMajors = rectMinMajors(cx, cz)
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
  //   gate + assembly yard  →  classroom blocks row  →  planned special buildings
  // Small compounds carry ONE block shifted left of the gate axis, so the
  // auto-placer has an honest right-hand column for the plan buildings.
  const BLOCK_W = 13.5
  const BLOCK_D = 5.4
  const BLOCK_H = 3.5
  const frontZ = Math.max(hd - 10.5, -hd + BLOCK_D / 2 + 2)
  const blocksUsed: { lx: number; lz: number }[] = []
  const nBlocks = site.w >= 34 ? 2 : 1
  for (let k = 0; k < nBlocks; k++) {
    const lx = nBlocks === 1
      ? -hw + 1 + BLOCK_W / 2
      : (k === 0 ? -hw + 1 + BLOCK_W / 2 : hw - 1 - BLOCK_W / 2)
    add(lx, frontZ, BLOCK_W, BLOCK_D, BLOCK_H, 'block', 0)
    // front veranda slab + pillars (the classic Nigerian school walkway)
    add(lx, frontZ + BLOCK_D / 2 + 0.85, BLOCK_W + 1.6, 1.9, 0.22, 'veranda')
    for (let vx = -BLOCK_W / 2 + 0.8; vx <= BLOCK_W / 2 - 0.8; vx += 3.2) {
      add(lx + vx, frontZ + BLOCK_D / 2 + 1.45, 0.42, 0.42, 2.6, 'pillar')
    }
    blocksUsed.push({ lx, lz: frontZ })
  }

  // toilet block — back corner, real schools have the long squat block
  add(-hw + 3.4, -hd + 2.4, 4.6, 2.6, 2.4, 'toilet')

  // water tank stand — the borehole tower every compound has
  add(-hw + 1.8, hd - 2.2, 1.1, 1.1, 3.2, 'water')

  /* --------------------- planned special buildings (Stage 8) ------------------ */
  // The data plan (data/schools.ts) lists every building with its honest
  // name, position note and inside-list. The placer walks deterministic
  // candidate slots — back band rows first, then the front corners — and
  // NEVER overlaps an occupied rect. Where the plan carries explicit
  // coordinates (the FUL breakdown) they are honoured and validated.
  interface Rect { x: number; z: number; w: number; d: number }
  const occupied: Rect[] = [
    ...blocksUsed.map((b) => ({ x: b.lx, z: b.lz, w: BLOCK_W, d: BLOCK_D })),
    ...blocksUsed.map((b) => ({ x: b.lx, z: b.lz + BLOCK_D / 2 + 0.85, w: BLOCK_W + 1.6, d: 1.9 })),
    { x: -hw + 3.4, z: -hd + 2.4, w: 4.6, d: 2.6 }, // toilet
    { x: -hw + 1.8, z: hd - 2.2, w: 1.1, d: 1.1 }, // water stand
  ]
  const PAD = 0.45
  const overlaps = (r: Rect): boolean =>
    occupied.some((o) =>
      Math.abs(o.x - r.x) < (o.w + r.w) / 2 + PAD &&
      Math.abs(o.z - r.z) < (o.d + r.d) / 2 + PAD,
    )
  const placedPlans: { plan: BuildingPlan; lx: number; lz: number; w: number; d: number; h: number; box: SchoolBox }[] = []

  const tryPlace = (w: number, d: number, at?: { lx?: number; lz?: number }): Rect | null => {
    // majors stay live — no plan building parks in a carriageway
    const clearOfMajors = (r: Rect): boolean => {
      const corners: [number, number][] = [
        [r.x - r.w / 2, r.z - r.d / 2], [r.x + r.w / 2, r.z - r.d / 2],
        [r.x - r.w / 2, r.z + r.d / 2], [r.x + r.w / 2, r.z + r.d / 2], [r.x, r.z],
      ]
      return corners.every(([cx, cz]) => roadDistanceMajors(...toWorld(frame, cx, cz)) >= 3.4)
    }
    // explicit planned position first
    if (at?.lx !== undefined && at?.lz !== undefined) {
      const r: Rect = { x: at.lx, z: at.lz, w, d }
      const inside =
        Math.abs(r.x) + w / 2 <= hw - 0.75 &&
        r.z - d / 2 >= -hd + 0.55 &&
        r.z + d / 2 <= hd - 0.75
      if (inside && !overlaps(r) && clearOfMajors(r)) return r
    }
    // deterministic grid scan — back band first, then forward, then corners
    for (let z = -hd + 0.55 + d / 2; z + d / 2 <= hd - 0.75; z += 0.5) {
      for (let x = -hw + 0.75 + w / 2; x <= hw - 0.75 - w / 2 + 1e-6; x += 0.5) {
        // keep the gate → assembly → blocks walk open
        if (z + d / 2 > frontZ - 1 && Math.abs(x) < 4.2) continue
        const r: Rect = { x, z, w, d }
        if (!overlaps(r) && clearOfMajors(r)) return r
      }
    }
    return null
  }

  // essential buildings place first (the admin block is the first building
  // past the gate on every real campus) — stable sort keeps the plan order
  const ESSENTIAL = new Set<BuildingKind>(['senate', 'admin', 'health-sciences', 'workshop', 'demo-lab', 'clinic', 'mosque'])
  const plans = [...(SCHOOL_PLANS[site.id] ?? [])].sort(
    (a, b) => (ESSENTIAL.has(b.kind) ? 1 : 0) - (ESSENTIAL.has(a.kind) ? 1 : 0),
  )
  for (const plan of plans) {
    const fp = PLAN_FOOTPRINT[plan.kind]
    // full footprint first, then the small variant for compact compounds
    let rect: Rect | null = tryPlace(fp.w, fp.d, plan)
    let w = fp.w
    let d = fp.d
    let h = fp.h
    if (!rect && fp.small) {
      rect = tryPlace(fp.small.w, fp.small.d, plan)
      if (rect) {
        w = fp.small.w
        d = fp.small.d
        h = fp.small.h
      }
    }
    if (!rect) continue // tests assert every plan building placed — this surfaces it
    const box = add(rect.x, rect.z, w, d, h, planBoxKind(plan.kind, kind), 0)
    occupied.push({ x: rect.x, z: rect.z, w, d })
    placedPlans.push({ plan, lx: rect.x, lz: rect.z, w, d, h, box })
  }

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
    // the deepest placed plan building sets the pitch's back line
    let backEdge = -hd + 0.6
    for (const p of placedPlans) {
      if (p.lz + p.d / 2 > frontZ - 1) continue // yard-side buildings don't count
      backEdge = Math.max(backEdge, p.lz + p.d / 2 + 1)
    }
    const depth = topEdge - backEdge
    if (depth >= 6) {
      const pd = Math.min(depth, 12)
      const pz = (topEdge + backEdge) / 2
      // widest clear span at the pitch band (plans + toilet + blocks all count)
      const bandHits = (cx: number, testW: number): boolean => {
        const rects: Rect[] = [
          ...placedPlans.map((p) => ({ x: p.lx, z: p.lz, w: p.w, d: p.d })),
          { x: -hw + 3.4, z: -hd + 2.4, w: 4.6, d: 2.6 },
          ...blocksUsed.map((b) => ({ x: b.lx, z: b.lz, w: BLOCK_W, d: BLOCK_D })),
        ]
        return rects.some((r) =>
          Math.abs(r.z - pz) < (r.d + pd) / 2 + 0.6 &&
          Math.abs(r.x - cx) < r.w / 2 + testW / 2 + 0.8,
        )
      }
      let bestW = 0
      let bestCx = 0
      for (let cx = -hw + 4; cx <= hw - 4; cx += 0.5) {
        let half = 0
        while (half < hw - 2) {
          if (bandHits(cx, half * 2 + 1)) break
          half += 0.5
        }
        if (half * 2 > bestW) {
          bestW = half * 2
          bestCx = cx
        }
      }
      const pw = Math.min(bestW, 19, site.w * 0.72)
      if (pw >= 8) {
        const [px, pzx] = toWorld(frame, bestCx, pz)
        pitch = { x: px, z: pzx, w: pw, d: pd, rotY: frame.rotY }
      }
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

  // doors for the placed plan buildings — straight from the placer so
  // geometry, doors and interiors can never drift apart
  for (const p of placedPlans) {
    if (!p.plan.room) continue
    const [dx0, dz0] = toWorld(frame, p.lx, p.lz + p.d / 2 + 0.95)
    doors.push({
      interiorId: `${site.id}-${p.plan.room}`,
      locationId: site.id,
      x: dx0,
      z: dz0,
      y: heightAt(dx0, dz0),
      rotY: frame.rotY,
      label: `Enter ${p.plan.name.replace(/^The /, 'the ')}`,
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
    plans: placedPlans,
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

/** the admin block office — where discipline and favour happen */
function officeInterior(site: SchoolSite, label: string, adminName: string): InteriorDef {
  const w = 7
  const d = 6
  return {
    id: `${site.id}-office`,
    name: `${site.shortName} — ${adminName}`,
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
      { id: `${site.id}-gist`, kind: 'study', x: 0, z: 0.2, label },
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
function libraryInterior(site: SchoolSite, label = 'Read for a while'): InteriorDef {
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
      { id: `${site.id}-read`, kind: 'study', x: 0, z: 1.55, label },
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

/** the FUL grand library — stack corridors, e-library hub, reading halls */
function grandLibraryInterior(site: SchoolSite, label: string): InteriorDef {
  const w = 15
  const d = 11
  const furn: FurnDef[] = [
    // returns desk + quiet board
    { kind: 'counter', x: -6.1, z: 3.4, rotY: Math.PI / 2, s: 1.3, tone: 1 },
    { kind: 'sign', x: 0, z: -5.32, rotY: 0, tone: 0 },
    { kind: 'wallmap', x: 3.4, z: -5.35, rotY: 0, tone: 1 },
  ]
  // the book stack corridors — two long shelving ranks, aisle between
  for (let i = 0; i < 4; i++) {
    furn.push({ kind: 'shelf', x: -6.4, z: -3.4 + i * 1.5, rotY: 0, s: 1.3, tone: i % 3 })
    furn.push({ kind: 'shelf', x: -4.1, z: -3.4 + i * 1.5, rotY: 0, s: 1.3, tone: (i + 1) % 3 })
  }
  // the e-library network hub — bench rows of workstations
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 0.6 + col * 2.3
      const z = -3.6 + row * 1.9
      furn.push({ kind: 'table', x, z, rotY: 0, s: 1.05, tone: 2 })
      furn.push({ kind: 'computer', x, z: z - 0.12, rotY: 0, tone: 0 })
      furn.push({ kind: 'chair', x, z: z + 0.78, rotY: Math.PI, tone: 1 })
    }
  }
  // the reading hall — long shared desks in the open south half
  const desks: [number, number][] = [
    [-4.4, 1.4], [0.4, 1.4], [5.2, 1.4], [-4.4, 3.4], [0.4, 3.4], [5.2, 3.4],
  ]
  desks.forEach(([tx, tz], di) => {
    furn.push({ kind: 'table', x: tx, z: tz, rotY: 0, s: 1.35, tone: 0 })
    furn.push({ kind: 'chair', x: tx, z: tz - 0.9, rotY: 0, tone: 0 })
    // the back row keeps its walkway clear — chairs on the table ends only
    if (di < 3) {
      furn.push({ kind: 'chair', x: tx, z: tz + 0.9, rotY: Math.PI, tone: 0 })
    } else {
      furn.push({ kind: 'chair', x: tx - 1.25, z: tz, rotY: Math.PI / 2, tone: 0 })
      furn.push({ kind: 'chair', x: tx + 1.25, z: tz, rotY: -Math.PI / 2, tone: 0 })
    }
  })
  // reference & serials cabinets on the east wall
  furn.push({ kind: 'shelf', x: 6.7, z: -1.2, rotY: -Math.PI / 2, s: 1.25, tone: 2 })
  furn.push({ kind: 'shelf', x: 6.7, z: 1, rotY: -Math.PI / 2, s: 1.25, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: -2.4, z: -1.2, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.6, z: 2.2, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 4.9, rotY: 0, tone: 0 })

  return {
    id: `${site.id}-library`,
    name: `${site.shortName} — The University Library`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Book stacks', x: -5.2, z: -1.8, w: 5.4, d: 8 },
      { name: 'E-library hub', x: 2.2, z: -2.4, w: 6.4, d: 5.4 },
      { name: 'Reading hall', x: 0.4, z: 2.4, w: 13, d: 5 },
    ],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-lib-exit`, kind: 'exit', x: 0, z: 4.95, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${site.id}-read`, kind: 'study', x: 2.8, z: 4.35, label },
    ],
    spawn: { x: 0, z: 4.95, facing: Math.PI },
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
function labInterior(site: SchoolSite, label = 'Book a computer hour', flavor: 'ict' | 'gis' = 'ict'): InteriorDef {
  const w = 9
  const d = 7
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -3.28, rotY: 0, tone: 1 }, // whiteboard
    { kind: 'crate', x: -3.9, z: -2.9, rotY: 0, tone: 1 }, // server stack
    // the GIS / simulation wall charts
    ...(flavor === 'gis'
      ? ([
          { kind: 'wallmap', x: -3.7, z: -3.3, rotY: 0, tone: 0 },
          { kind: 'wallmap', x: 3.7, z: -3.3, rotY: 0, tone: 1 },
        ] as FurnDef[])
      : []),
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
    name: `${site.shortName} — ${flavor === 'gis' ? 'GIS & Simulation Lab' : 'Computer Lab'}`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Lab', x: 0, z: -0.2, w, d: 6.4 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-lab-exit`, kind: 'exit', x: 0, z: 3.1, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${site.id}-lab-study`, kind: 'study', x: 0, z: 0.9, label },
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

/** lecture theatre — tiered riser rows + podium (the FUL twin-theatre feel) */
function theatreInterior(site: SchoolSite, id: string, label: string, buildingName: string): InteriorDef {
  const w = 12
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -4.28, rotY: 0, tone: 0 },
    { kind: 'podium', x: -1.5, z: -3.4, rotY: 0, tone: 1 },
    { kind: 'table', x: 2.2, z: -3.6, rotY: 0, s: 1.05, tone: 2 }, // lecturer's desk
    { kind: 'chair', x: 2.2, z: -2.8, rotY: Math.PI, tone: 2 },
    { kind: 'wallmap', x: -3.8, z: -4.3, rotY: 0, tone: 0 },
  ]
  // stepped rows — riser platforms with benches standing on them
  for (let row = 0; row < 4; row++) {
    const z = -2.1 + row * 1.45
    furn.push({ kind: 'riser', x: 0, z, rotY: 0, s: 1, tone: row % 2 })
    for (let col = 0; col < 3; col++) {
      const x = -3.2 + col * 3.2
      furn.push({ kind: 'bench', x, z: z - 0.18, rotY: 0, s: 1.45, tone: row % 2 })
    }
  }
  furn.push({ kind: 'ceilingfan', x: -2, z: -1.2, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.4, z: 2.2, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — ${buildingName.replace(/^The /, '')}`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Auditorium', x: 0, z: -0.4, w, d: 8 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.9, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-lecture`, kind: 'study', x: 0, z: 2.75, label },
    ],
    spawn: { x: 0, z: 3.4, facing: Math.PI },
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

/* ---------------- Stage 8 interior builders — the great schools ---------------- */

/** the FUL Senate Building — VC suite, registry counters, council chamber */
function senateInterior(site: SchoolSite, label: string): InteriorDef {
  const w = 14
  const d = 10
  const furn: FurnDef[] = [
    // the council chamber — the long meeting table, seats all around
    { kind: 'table', x: -4.2, z: -2.2, rotY: 0, s: 2.5, tone: 2 },
    ...[-6.6, -5.5, -4.4, -3.3, -2.2, -1.1].map((x, i) => ({
      kind: 'chair' as const, x, z: -3.35, rotY: 0, tone: 1, s: i === 2 ? 1.15 : 1,
    })),
    ...[-6.6, -5.5, -4.4, -3.3, -2.2, -1.1].map((x) => ({
      kind: 'chair' as const, x, z: -1.05, rotY: Math.PI, tone: 1,
    })),
    // the presentation screen + crest
    { kind: 'tv', x: -4.2, z: -4.42, rotY: 0, tone: 0 },
    { kind: 'sign', x: -0.4, z: -4.45, rotY: 0, tone: 1 },
    // the registry — counters and queue board by the door
    { kind: 'counter', x: 5.6, z: 1.2, rotY: Math.PI / 2, tone: 1 },
    { kind: 'counter', x: 5.6, z: 3.2, rotY: Math.PI / 2, tone: 2 },
    { kind: 'queueboard', x: 5.9, z: -1.4, rotY: -Math.PI / 2, tone: 0 },
    // the VC's suite corner — the big desk facing the room
    { kind: 'table', x: 2.6, z: -3.3, rotY: 0, s: 1.5, tone: 2 },
    { kind: 'chair', x: 2.6, z: -4.1, rotY: 0, tone: 2 },
    { kind: 'chair', x: 1.7, z: -2.2, rotY: 0.4, tone: 1 },
    { kind: 'chair', x: 3.5, z: -2.2, rotY: -0.4, tone: 1 },
    { kind: 'rug', x: 2.6, z: -2.4, rotY: 0, s: 1.1, tone: 1 },
    // records shelves + crates
    { kind: 'shelf', x: -1.1, z: -4.4, rotY: 0, s: 1.2, tone: 2 },
    { kind: 'shelf', x: 0.8, z: -4.4, rotY: 0, s: 1.2, tone: 0 },
    { kind: 'crate', x: -6.3, z: 3.8, rotY: 0.2, tone: 1 },
    { kind: 'crate', x: -5.5, z: 4, rotY: -0.15, tone: 2 },
    { kind: 'ceilingfan', x: -4.2, z: -2, rotY: 0, tone: 0 },
    { kind: 'ceilingfan', x: 3, z: 1.4, rotY: 0, tone: 0 },
    { kind: 'mat', x: 0, z: 4.3, rotY: 0, tone: 0 },
  ]

  return {
    id: `${site.id}-senate`,
    name: `${site.shortName} — The Senate Building`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Council chamber', x: -4.2, z: -2.4, w: 7.6, d: 5.6 },
      { name: "VC's suite", x: 3.4, z: -2.6, w: 5, d: 4.4 },
      { name: 'Registry', x: 4.4, z: 2.2, w: 5, d: 4.4 },
    ],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-senate-exit`, kind: 'exit', x: 0, z: 4.45, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${site.id}-senate-study`, kind: 'study', x: 0.6, z: 1.4, label },
    ],
    spawn: { x: 0, z: 4.4, facing: Math.PI },
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

/** Faculty of Arts — language lab headsets, lecture desks, staff common room */
function facultyArtsInterior(site: SchoolSite, label: string): InteriorDef {
  const w = 11
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -4.28, rotY: 0, tone: 1 },
    { kind: 'wallmap', x: -4.4, z: -4.3, rotY: 0, tone: 0 },
    { kind: 'sign', x: 3.6, z: -4.42, rotY: 0, tone: 1 }, // departmental board
  ]
  // the language laboratory — headset desks in two rows
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const x = -3.2 + col * 2.4
      const z = -2.9 + row * 1.7
      furn.push({ kind: 'table', x, z, rotY: 0, s: 1, tone: 2 })
      furn.push({ kind: 'computer', x, z: z - 0.12, rotY: 0, tone: 0 })
      furn.push({ kind: 'chair', x, z: z + 0.75, rotY: Math.PI, tone: 1 })
    }
  }
  // the lecture room corner — shared desks
  for (let col = 0; col < 2; col++) {
    furn.push({ kind: 'school-desk', x: -2.9 + col * 2.2, z: 1.5, rotY: 0, tone: 0 })
    furn.push({ kind: 'chair', x: -2.9 + col * 2.2, z: 2.12, rotY: Math.PI, tone: 0 })
  }
  // the staff common room — east side
  furn.push({ kind: 'sofa', x: 4.2, z: 1.7, rotY: -Math.PI / 2, tone: 1 })
  furn.push({ kind: 'table', x: 3, z: 1.7, rotY: 0, s: 0.9, tone: 1 })
  furn.push({ kind: 'shelf', x: 4.85, z: -0.9, rotY: -Math.PI / 2, s: 1.1, tone: 2 })
  furn.push({ kind: 'crate', x: 4.6, z: 3.4, rotY: 0.25, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: -1.4, z: -1.4, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.2, z: 1.6, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.85, rotY: 0, tone: 0 })

  return {
    id: `${site.id}-fac-arts`,
    name: `${site.shortName} — Faculty of Arts`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Language lab', x: -1.6, z: -2.2, w: 8, d: 5 },
      { name: 'Staff common room', x: 3.4, z: 1.9, w: 4.4, d: 4.4 },
      { name: 'Lecture room', x: -2.6, z: 1.9, w: 4.4, d: 3.4 },
    ],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-arts-exit`, kind: 'exit', x: 0, z: 3.95, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${site.id}-arts-study`, kind: 'study', x: -0.6, z: 0.6, label },
    ],
    spawn: { x: 0, z: 3.9, facing: Math.PI },
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

/** Faculty of Science — chemistry benches, fume hood, microscopes, boardroom */
function facultyScienceInterior(site: SchoolSite, label: string): InteriorDef {
  const w = 11
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -4.28, rotY: 0, tone: 1 },
    // fume hood + safety basins on the north wall
    { kind: 'fume-hood', x: -4.6, z: -3.85, rotY: 0, tone: 0 },
    { kind: 'basin', x: -2.9, z: -3.95, rotY: 0, tone: 0 },
    { kind: 'basin', x: -2.2, z: -3.95, rotY: 0, tone: 0 },
    // specimen cabinet + prep shelves
    { kind: 'specimen-cabinet', x: 4.8, z: -3.8, rotY: 0, tone: 0 },
    { kind: 'shelf', x: 3.2, z: -3.9, rotY: 0, s: 1.1, tone: 2 },
  ]
  // two lab bench rows with microscopes + stools
  for (let row = 0; row < 2; row++) {
    const z = -1.5 + row * 2
    furn.push({ kind: 'lab-bench', x: -2.2, z, rotY: 0, tone: row })
    furn.push({ kind: 'lab-bench', x: 1.6, z, rotY: 0, tone: row })
    furn.push({ kind: 'microscope', x: -2.2, z: z - 0.12, rotY: 0, tone: 0 })
    furn.push({ kind: 'microscope', x: 1.6, z: z - 0.12, rotY: 0.4, tone: 0 })
    for (const bx of [-2.9, -1.5, 0.9, 2.3]) {
      furn.push({ kind: 'chair', x: bx, z: z + 0.85, rotY: Math.PI, tone: 1 })
    }
  }
  // the faculty boardroom corner
  furn.push({ kind: 'table', x: 4.3, z: 2.4, rotY: 0, s: 1.6, tone: 2 })
  furn.push({ kind: 'chair', x: 4.3, z: 1.35, rotY: 0, tone: 1 })
  furn.push({ kind: 'chair', x: 4.3, z: 3.45, rotY: Math.PI, tone: 1 })
  furn.push({ kind: 'chair', x: 3.1, z: 2.4, rotY: Math.PI / 2, tone: 1 })
  furn.push({ kind: 'ceilingfan', x: -1.6, z: -0.6, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2, z: 2.2, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: -0.4, z: 3.75, rotY: 0, tone: 0 })

  return {
    id: `${site.id}-fac-sci`,
    name: `${site.shortName} — Faculty of Science`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Chemistry lab', x: -1.8, z: -1.8, w: 8.4, d: 6 },
      { name: 'Boardroom', x: 4.2, z: 2.6, w: 3.8, d: 3.4 },
    ],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${site.id}-sci-exit`, kind: 'exit', x: 0, z: 3.95, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${site.id}-sci-study`, kind: 'study', x: -0.4, z: 0.7, label },
    ],
    spawn: { x: 0, z: 3.9, facing: Math.PI },
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

/** student hostel — bunk rooms, lockers, the common study lounge, ablution */
function hostelInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 13
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'sign', x: 0, z: -4.32, rotY: 0, tone: 0 }, // the block notice board
  ]
  // two bunk rooms worth of beds, lockers between them
  for (let i = 0; i < 4; i++) {
    const x = -5.4 + (i % 2) * 3.1
    const z = -3.3 + Math.floor(i / 2) * 1.5
    furn.push({ kind: 'bunk', x, z, rotY: 0, tone: i })
  }
  for (let i = 0; i < 5; i++) {
    furn.push({ kind: 'locker', x: -0.2 + i * 0.62, z: -3.9, rotY: 0, tone: i % 3 })
  }
  // the common study lounge — long table + benches
  furn.push({ kind: 'table', x: 0.4, z: -0.4, rotY: 0, s: 1.7, tone: 1 })
  furn.push({ kind: 'bench', x: 0.4, z: -1.35, rotY: 0, s: 1.5, tone: 0 })
  furn.push({ kind: 'bench', x: 0.4, z: 0.55, rotY: 0, s: 1.5, tone: 0 })
  furn.push({ kind: 'shelf', x: -6.1, z: -0.6, rotY: Math.PI / 2, s: 1.2, tone: 2 })
  furn.push({ kind: 'crate', x: -6, z: 1.4, rotY: 0.2, tone: 1 })
  // the ablution block corner
  furn.push({ kind: 'shower', x: 5.8, z: 3.6, rotY: 0, tone: 0 })
  furn.push({ kind: 'shower', x: 4.5, z: 3.6, rotY: 0, tone: 1 })
  furn.push({ kind: 'basin', x: 3.3, z: 3.9, rotY: 0, tone: 0 })
  furn.push({ kind: 'locker', x: 5.9, z: 1.9, rotY: Math.PI, tone: 2 })
  furn.push({ kind: 'ceilingfan', x: -3.4, z: -1.6, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 1.8, z: 1.8, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.85, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — Student Hostels`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Bunk room', x: -3.4, z: -2.6, w: 8, d: 4.4 },
      { name: 'Common lounge', x: 0.4, z: 0.4, w: 8, d: 3.8 },
      { name: 'Ablution', x: 5, z: 3.2, w: 3, d: 2.8 },
    ],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.95, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-prep`, kind: 'study', x: 2.3, z: 0.4, label },
    ],
    spawn: { x: 0, z: 3.9, facing: Math.PI },
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

/** the school canteen — serving counter, dining benches, cold drinks */
function canteenInterior(site: SchoolSite, id: string): InteriorDef {
  const w = 9
  const d = 8
  return {
    id,
    name: `${site.shortName} — School Canteen`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Serving', x: 0.4, z: -1.9, w: 8, d: 3.2 },
      { name: 'Dining', x: -0.4, z: 1.7, w: 7.4, d: 3.8 },
    ],
    walls: schoolShell(w, d),
    furniture: [
      // the serving counter with hot pots
      { kind: 'counter', x: 0.6, z: -2.9, rotY: 0, s: 1.7, tone: 1 },
      { kind: 'pot', x: -0.9, z: -3, rotY: 0, tone: 0, s: 1.3 },
      { kind: 'pot', x: 0.7, z: -3, rotY: 0, tone: 1, s: 1.15 },
      { kind: 'pot', x: 2.1, z: -3, rotY: 0, tone: 2, s: 1.25 },
      { kind: 'stove', x: 3.7, z: -3.1, rotY: 0, tone: 1 },
      { kind: 'menu', x: 0.6, z: -2.1, rotY: Math.PI, tone: 0 },
      { kind: 'fridge', x: -3.9, z: -3, rotY: 0, tone: 0 },
      { kind: 'crate', x: 3.9, z: -1.7, rotY: 0.2, tone: 0 },
      // dining benches
      { kind: 'table', x: -1.9, z: 1.4, rotY: 0, s: 1.15, tone: 1 },
      { kind: 'bench', x: -1.9, z: 0.45, rotY: 0, tone: 0 },
      { kind: 'bench', x: -1.9, z: 2.35, rotY: 0, tone: 0 },
      { kind: 'table', x: 1.7, z: 1.4, rotY: 0, s: 1.15, tone: 2 },
      { kind: 'bench', x: 1.7, z: 0.45, rotY: 0, tone: 0 },
      { kind: 'bench', x: 1.7, z: 2.35, rotY: 0, tone: 0 },
      { kind: 'ceilingfan', x: 0, z: -0.4, rotY: 0, tone: 0 },
      { kind: 'fan', x: -4.1, z: 3.3, rotY: -Math.PI / 4, tone: 0 },
      { kind: 'mat', x: 0, z: 3.4, rotY: 0, tone: 0 },
    ],
    hotspots: [
      { id: `${id}-menu`, kind: 'menu', x: 0.6, z: -1.5, label: 'Order from the canteen' },
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.3, label: 'Back to the campus' },
    ],
    actions: [],
    spawn: { x: 0, z: 3.2, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#ad8756',
      floorAlt: '#9c774a',
      wall: site.paint,
      accent: site.color,
    },
    mealSpot: true,
    shopSpot: false,
  }
}

/** the sick bay — observation beds, medicine cabinet, duty desk */
function clinicInterior(site: SchoolSite, id: string): InteriorDef {
  const w = 8
  const d = 7
  return {
    id,
    name: `${site.shortName} — Sick Bay`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Ward', x: 0, z: -0.2, w, d: 6.4 }],
    walls: schoolShell(w, d),
    furniture: [
      { kind: 'bed', x: -2.5, z: -2.2, rotY: 0, tone: 0 },
      { kind: 'bed', x: -2.5, z: 0.2, rotY: 0, tone: 1 },
      { kind: 'specimen-cabinet', x: 3.4, z: -3.05, rotY: 0, tone: 1 }, // medicine cabinet
      { kind: 'basin', x: 1.9, z: -3.15, rotY: 0, tone: 0 },
      { kind: 'table', x: 3, z: 0.6, rotY: 0, s: 1.05, tone: 2 }, // duty desk
      { kind: 'chair', x: 3, z: 1.5, rotY: Math.PI, tone: 2 },
      { kind: 'locker', x: -3.6, z: 2.4, rotY: Math.PI / 2, tone: 1 },
      { kind: 'sign', x: 0.4, z: -3.32, rotY: 0, tone: 0 },
      { kind: 'ceilingfan', x: 0, z: -0.4, rotY: 0, tone: 0 },
      { kind: 'mat', x: 0, z: 2.9, rotY: 0, tone: 0 },
    ],
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 2.85, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-rest`, kind: 'study', x: 0, z: 0.4, label: 'Rest a while in the sick bay' },
    ],
    spawn: { x: 0, z: 2.8, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#cfc8b8',
      floorAlt: '#bfb6a2',
      wall: '#f4f1e6',
      accent: site.color,
    },
    floorTiles: true,
    mealSpot: false,
    shopSpot: false,
  }
}

/** the secondary-school science lab — benches, fume hood, specimen cabinets */
function scienceLabInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 10
  const d = 8
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -3.78, rotY: 0, tone: 1 },
    { kind: 'fume-hood', x: -4.2, z: -3.35, rotY: 0, tone: 0 },
    { kind: 'basin', x: -2.6, z: -3.45, rotY: 0, tone: 0 },
    { kind: 'basin', x: -1.95, z: -3.45, rotY: 0, tone: 0 },
    { kind: 'specimen-cabinet', x: 4.2, z: -3.3, rotY: 0, tone: 0 },
    { kind: 'specimen-cabinet', x: 3, z: -3.3, rotY: 0, tone: 2 },
    { kind: 'table', x: 3.4, z: -1.6, rotY: 0, s: 1.1, tone: 1 }, // teacher bench
    { kind: 'chair', x: 3.4, z: -0.75, rotY: Math.PI, tone: 1 },
  ]
  for (let row = 0; row < 3; row++) {
    const z = -1.6 + row * 1.7
    furn.push({ kind: 'lab-bench', x: -0.4, z, rotY: 0, tone: row })
    furn.push({ kind: 'microscope', x: -0.4, z: z - 0.12, rotY: row * 0.4, tone: 0 })
    for (const bx of [-1.2, 0.4]) {
      furn.push({ kind: 'chair', x: bx, z: z + 0.82, rotY: Math.PI, tone: 1 })
    }
  }
  furn.push({ kind: 'ceilingfan', x: -1.4, z: -0.6, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 1.4, z: 1.8, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.35, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — Science Laboratory`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Lab', x: 0, z: -0.2, w, d: 6.9 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.3, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-practical`, kind: 'study', x: 1.7, z: 0.9, label },
    ],
    spawn: { x: 0, z: 3.25, facing: Math.PI },
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

/** the assembly hall — stage, podium, long bench rows */
function hallInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 12
  const d = 10
  const furn: FurnDef[] = [
    // the stage
    { kind: 'riser', x: 0, z: -3.6, rotY: 0, s: 1.15, tone: 0 },
    { kind: 'podium', x: -1.4, z: -3.9, rotY: 0, tone: 1 },
    { kind: 'table', x: 1.8, z: -3.9, rotY: 0, s: 1, tone: 2 },
    { kind: 'sign', x: 3.4, z: -4.42, rotY: 0, tone: 1 }, // honours board
    { kind: 'blackboard', x: 0, z: -4.78, rotY: 0, tone: 0 },
  ]
  for (let row = 0; row < 5; row++) {
    const z = -1.9 + row * 1.25
    furn.push({ kind: 'bench', x: -2.2, z, rotY: 0, s: 1.7, tone: row % 2 })
    furn.push({ kind: 'bench', x: 2.2, z, rotY: 0, s: 1.7, tone: row % 2 })
  }
  furn.push({ kind: 'ceilingfan', x: -2.4, z: -1.2, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.4, z: 2.4, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 4.35, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — Assembly Hall`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Hall', x: 0, z: -0.4, w, d: 9 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 4.3, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-assembly`, kind: 'study', x: 0, z: 2.6, label },
    ],
    spawn: { x: 0, z: 3.9, facing: Math.PI },
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

/** the gross anatomy lab — dissection tables, specimen tanks, histology bays */
function anatomyLabInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 12
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -4.28, rotY: 0, tone: 1 },
    // the dissection tables — steel, drained, hose at the corner
    { kind: 'dissection-table', x: -2.6, z: -2.3, rotY: 0, tone: 0 },
    { kind: 'dissection-table', x: 1.8, z: -2.3, rotY: 0, tone: 0 },
    // specimen preservation tanks + models
    { kind: 'specimen-cabinet', x: -5.4, z: -3.6, rotY: 0, tone: 0 },
    { kind: 'specimen-cabinet', x: 5.4, z: -3.6, rotY: 0, tone: 2 },
    { kind: 'skeleton', x: -4.6, z: -1.2, rotY: 0.3, tone: 0 },
    { kind: 'skeleton', x: 4.6, z: -1.2, rotY: -0.4, tone: 0 },
    // histology bays — bench + scopes
    { kind: 'lab-bench', x: -3.4, z: 1.4, rotY: 0, tone: 1 },
    { kind: 'lab-bench', x: 1, z: 1.4, rotY: 0, tone: 1 },
    { kind: 'microscope', x: -3.4, z: 1.28, rotY: 0, tone: 0 },
    { kind: 'microscope', x: 1, z: 1.28, rotY: 0.5, tone: 0 },
  ]
  for (const bx of [-4.2, -2.6, 0.2, 1.8]) {
    furn.push({ kind: 'chair', x: bx, z: 2.25, rotY: Math.PI, tone: 1 })
  }
  furn.push({ kind: 'basin', x: 5.2, z: -4.15, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: -2, z: -0.8, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.6, z: 2, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.85, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — Gross Anatomy Lab`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Dissection floor', x: -0.4, z: -1.8, w: 10, d: 5 },
      { name: 'Histology bays', x: -1.2, z: 1.8, w: 8.4, d: 3.4 },
    ],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.9, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-practical`, kind: 'study', x: -0.4, z: 0.6, label },
    ],
    spawn: { x: 0, z: 3.9, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#cfc8b8',
      floorAlt: '#bfb6a2',
      wall: '#eef0e6',
      accent: site.color,
    },
    floorTiles: true,
    mealSpot: false,
    shopSpot: false,
  }
}

/** the pre-clinical lecture theatre — stepped rows, medical posters, skeleton */
function preclinicInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 11
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -4.28, rotY: 0, tone: 0 },
    { kind: 'podium', x: -1.4, z: -3.5, rotY: 0, tone: 1 },
    { kind: 'skeleton', x: 2.4, z: -3.5, rotY: 0.2, tone: 0 },
    { kind: 'wallmap', x: -3.8, z: -4.3, rotY: 0, tone: 0 },
    { kind: 'wallmap', x: 0.2, z: -4.32, rotY: 0, tone: 1 },
    { kind: 'specimen-cabinet', x: 4.6, z: -3.7, rotY: 0, tone: 1 },
  ]
  for (let row = 0; row < 3; row++) {
    const z = -2 + row * 1.5
    furn.push({ kind: 'riser', x: -0.6, z, rotY: 0, s: 0.95, tone: row % 2 })
    for (let col = 0; col < 2; col++) {
      furn.push({ kind: 'bench', x: -2.1 + col * 3, z: z - 0.18, rotY: 0, s: 1.4, tone: row % 2 })
    }
  }
  furn.push({ kind: 'ceilingfan', x: -1.8, z: -0.8, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 2.2, z: 1.8, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.85, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — Pre-Clinical Lecture Theatre`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Theatre', x: 0, z: -0.4, w, d: 8 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.9, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-lecture`, kind: 'study', x: 0, z: 2.5, label },
    ],
    spawn: { x: 0, z: 3.85, facing: Math.PI },
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

/** the KSP engineering workshop — machines, workbenches, tool crates */
function workshopInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 12
  const d = 9
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -4.28, rotY: 0, tone: 1 },
    { kind: 'machine', x: -3.8, z: -2.6, rotY: 0, tone: 0 },
    { kind: 'machine', x: 0.4, z: -2.6, rotY: 0, tone: 1 },
    { kind: 'machine', x: 4.4, z: -2.6, rotY: 0, tone: 2 },
    { kind: 'lab-bench', x: -3.6, z: 0.6, rotY: 0, tone: 0 },
    { kind: 'lab-bench', x: 0.2, z: 0.6, rotY: 0, tone: 2 },
    { kind: 'shelf', x: 5.4, z: 0.4, rotY: -Math.PI / 2, s: 1.2, tone: 1 },
    { kind: 'crate', x: -5.2, z: 3, rotY: 0.2, tone: 0 },
    { kind: 'crate', x: -4.4, z: 3.3, rotY: -0.15, tone: 1 },
    { kind: 'crate', x: -4.8, z: 2.4, rotY: 0.4, tone: 2 },
    { kind: 'ceilingfan', x: -1.8, z: -1, rotY: 0, tone: 0 },
    { kind: 'ceilingfan', x: 2.2, z: 2, rotY: 0, tone: 0 },
    { kind: 'mat', x: 0.6, z: 3.75, rotY: 0, tone: 0 },
  ]

  return {
    id,
    name: `${site.shortName} — Engineering Workshops`,
    locationId: site.id,
    size: { w, d },
    rooms: [
      { name: 'Machine bay', x: -0.4, z: -1.8, w: 10, d: 4.6 },
      { name: 'Workbenches', x: 0, z: 1.9, w: 9.4, d: 3.4 },
    ],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.85, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-work`, kind: 'study', x: 0.6, z: 1.4, label },
    ],
    spawn: { x: 0, z: 3.8, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#8f8a7c',
      floorAlt: '#7f7a6c',
      wall: site.paint,
      accent: site.color,
    },
    mealSpot: false,
    shopSpot: false,
  }
}

/** the chapel — pew columns, pulpit, altar table */
function chapelInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 10
  const d = 9
  const furn: FurnDef[] = [
    // the altar + pulpit on the raised front
    { kind: 'riser', x: 0, z: -3.5, rotY: 0, s: 1.05, tone: 0 },
    { kind: 'counter', x: 0, z: -3.7, rotY: 0, s: 1.1, tone: 2 },
    { kind: 'podium', x: 2.2, z: -3.8, rotY: 0, tone: 1 },
    { kind: 'sign', x: -2.6, z: -4.32, rotY: 0, tone: 0 },
    { kind: 'shelf', x: -4.35, z: -2.6, rotY: Math.PI / 2, s: 1.1, tone: 2 },
    { kind: 'shelf', x: 4.35, z: -2.6, rotY: -Math.PI / 2, s: 1.1, tone: 0 },
  ]
  for (let row = 0; row < 4; row++) {
    const z = -2.2 + row * 1.25
    furn.push({ kind: 'bench', x: -1.95, z, rotY: 0, s: 1.5, tone: row % 2 })
    furn.push({ kind: 'bench', x: 1.95, z, rotY: 0, s: 1.5, tone: row % 2 })
  }
  furn.push({ kind: 'rug', x: 0, z: -1.4, rotY: 0, s: 1.1, tone: 1 })
  furn.push({ kind: 'ceilingfan', x: -1.8, z: -0.6, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 1.8, z: 2, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.85, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — The Chapel`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Nave', x: 0, z: -0.2, w, d: 8 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.9, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-service`, kind: 'study', x: 0, z: 1.6, label },
    ],
    spawn: { x: 0, z: 3.9, facing: Math.PI },
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

/** the campus mosque — prayer mats in rows, the mihrab niche, Quran shelves */
function mosqueInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 9
  const d = 8
  const furn: FurnDef[] = [
    { kind: 'sign', x: 0, z: -3.82, rotY: 0, tone: 0 },
    { kind: 'shelf', x: -4.1, z: -2.2, rotY: Math.PI / 2, s: 1.1, tone: 1 },
    { kind: 'shelf', x: 4.1, z: -2.2, rotY: -Math.PI / 2, s: 1.1, tone: 2 },
    { kind: 'crate', x: 3.7, z: 2.9, rotY: 0.2, tone: 0 }, // ablution store
    { kind: 'basin', x: -3.6, z: 3.2, rotY: 0, tone: 0 },
  ]
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      furn.push({ kind: 'mat', x: -2.1 + col * 1.4, z: -2.4 + row * 1.35, rotY: 0, tone: (row + col) % 2 })
    }
  }
  furn.push({ kind: 'rug', x: 0, z: -2.4, rotY: 0, s: 1.3, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 0, z: -0.4, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.2, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — The Campus Mosque`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Prayer hall', x: 0, z: -0.2, w, d: 6.9 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.3, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-prayer`, kind: 'study', x: 0, z: 0.8, label },
    ],
    spawn: { x: 0, z: 3.25, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#b9a568',
      floorAlt: '#a8945a',
      wall: site.paint,
      accent: site.color,
    },
    mealSpot: false,
    shopSpot: false,
  }
}

/** the nursing demonstration room — dummies on beds, procedure cabinet */
function demoInterior(site: SchoolSite, id: string, label: string): InteriorDef {
  const w = 10
  const d = 8
  const furn: FurnDef[] = [
    { kind: 'blackboard', x: 0, z: -3.78, rotY: 0, tone: 1 },
    { kind: 'skeleton', x: 3.6, z: -3.2, rotY: 0.2, tone: 0 },
    { kind: 'wallmap', x: -2.4, z: -3.82, rotY: 0, tone: 1 }, // anatomy charts
    { kind: 'specimen-cabinet', x: 4.3, z: -1.6, rotY: -Math.PI / 2, tone: 1 }, // procedures
    { kind: 'basin', x: -4.3, z: -3.35, rotY: 0, tone: 0 },
    { kind: 'basin', x: -3.65, z: -3.35, rotY: 0, tone: 0 },
    { kind: 'table', x: 0, z: -2.9, rotY: 0, s: 1.2, tone: 1 }, // the demo trolley
  ]
  for (let i = 0; i < 3; i++) {
    furn.push({ kind: 'bed', x: -3.6 + i * 2.5, z: 0.2 + (i % 2) * 1.2, rotY: 0, tone: 0 })
  }
  furn.push({ kind: 'chair', x: 3.4, z: 1.6, rotY: Math.PI, tone: 2 })
  furn.push({ kind: 'ceilingfan', x: -1.2, z: -0.8, rotY: 0, tone: 0 })
  furn.push({ kind: 'ceilingfan', x: 1.6, z: 2, rotY: 0, tone: 0 })
  furn.push({ kind: 'mat', x: 0, z: 3.35, rotY: 0, tone: 0 })

  return {
    id,
    name: `${site.shortName} — Demonstration Room`,
    locationId: site.id,
    size: { w, d },
    rooms: [{ name: 'Demo ward', x: 0, z: -0.2, w, d: 6.9 }],
    walls: schoolShell(w, d),
    furniture: furn,
    hotspots: [
      { id: `${id}-exit`, kind: 'exit', x: 0, z: 3.3, label: 'Back to the campus' },
    ],
    actions: [
      { id: `${id}-practice`, kind: 'study', x: 0, z: 1.2, label },
    ],
    spawn: { x: 0, z: 3.25, facing: Math.PI },
    door: { x: 0, z: d / 2 - 0.1 },
    palette: {
      floor: '#dfe2da',
      floorAlt: '#cfd2ca',
      wall: '#f4f1e6',
      accent: site.color,
    },
    floorTiles: true,
    mealSpot: false,
    shopSpot: false,
  }
}

/* --------------------------------- assembly ---------------------------------- */

function interiorsFor(c: SchoolCompound): InteriorDef[] {
  const site = c.site
  const list: InteriorDef[] = [classroomInterior(site)]
  for (const p of c.plans) {
    if (!p.plan.room) continue
    const id = `${site.id}-${p.plan.room}`
    const label = p.plan.studyLabel ?? 'Sit for a lesson'
    switch (p.plan.room) {
      case 'library':
        list.push(site.id === 'ful-felele' ? grandLibraryInterior(site, label) : libraryInterior(site, label))
        break
      case 'lab':
        list.push(labInterior(site, label, p.plan.kind === 'faculty' ? 'gis' : 'ict'))
        break
      case 'office':
        list.push(officeInterior(site, label, p.plan.name.replace(/^The /, '')))
        break
      case 'senate': list.push(senateInterior(site, label)); break
      case 'fac-arts': list.push(facultyArtsInterior(site, label)); break
      case 'fac-sci': list.push(facultyScienceInterior(site, label)); break
      case 'theatre':
      case 'lt-b':
        list.push(theatreInterior(site, id, label, p.plan.name))
        break
      case 'hostel': list.push(hostelInterior(site, id, label)); break
      case 'canteen': list.push(canteenInterior(site, id)); break
      case 'clinic': list.push(clinicInterior(site, id)); break
      case 'sci-lab': list.push(scienceLabInterior(site, id, label)); break
      case 'hall': list.push(hallInterior(site, id, label)); break
      case 'anatomy': list.push(anatomyLabInterior(site, id, label)); break
      case 'preclinic': list.push(preclinicInterior(site, id, label)); break
      case 'workshop': list.push(workshopInterior(site, id, label)); break
      case 'chapel': list.push(chapelInterior(site, id, label)); break
      case 'mosque': list.push(mosqueInterior(site, id, label)); break
      case 'demo': list.push(demoInterior(site, id, label)); break
      default: break
    }
  }
  return list
}

/* --------------------------------- assembly ---------------------------------- */

export const SCHOOL_COMPOUNDS: SchoolCompound[] = SCHOOL_SITES.map(buildCompound)

export const SCHOOL_BOXES: SchoolBox[] = SCHOOL_COMPOUNDS.flatMap((c) => c.boxes)

/** collide against everything except the open gate arch + walkable veranda */
const COLLIDING_KINDS = new Set<SchoolBoxKind>([
  'wall', 'pillar', 'gatehouse', 'block', 'admin', 'library',
  'lab', 'office', 'toilet', 'theatre', 'flag', 'water',
  'senate', 'faculty', 'hostel', 'watchtower', 'healthsci',
  'workshop', 'chapel', 'mosque', 'hall', 'canteen', 'clinic', 'demo',
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
export const SCHOOL_INTERIORS: InteriorDef[] = SCHOOL_COMPOUNDS.flatMap((c) => interiorsFor(c))

/** every school compound interior id set (for door validation) */
export const SCHOOL_INTERIOR_IDS = new Set(SCHOOL_INTERIORS.map((i) => i.id))
