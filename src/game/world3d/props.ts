/**
 * LOKOJA LIFE — Derived 3D Props (Stage 4-b)
 * ------------------------------------------
 * Street furniture + compound life, derived DETERMINISTICALLY from the
 * frozen `world3d/layout` data (BUILDINGS / ROADS / STALLS / anchors).
 * Everything here is baked once at import from a fixed-seed RNG — every
 * reload produces the exact same Lokoja, and it can never drift from the
 * map the 2D game uses.
 *
 * SAFETY CONTRACT (visual-only decor):
 *  • adds NO colliders — collision data stays exactly as layout defines it;
 *  • every ground-level placement clears the road centre-lines, river,
 *    building footprints and the interactive spots (DOORS, job boards)
 *    so prompts and walk paths are never visually blocked;
 *  • rooftops props are the only things allowed near buildings (they sit
 *    ON them).
 */

import {
  ANCHOR_BY_ID,
  BUILDINGS,
  DOORS,
  POINTS_OF_INTEREST,
  ROADS,
  STALLS,
  heightAt,
  makeRng,
  riverInfo,
  roadDistance,
} from '@/game/world3d/layout'

/* ------------------------------ shared helpers ------------------------------ */

/** conservative circle clearance against every building footprint */
function clearOfBuildings(x: number, z: number, r: number): boolean {
  for (const b of BUILDINGS) {
    if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.62 + r) return false
  }
  return true
}

/** same, but tolerates ONE building (its own compound / roof) */
function clearOfOtherBuildings(x: number, z: number, r: number, own: { x: number; z: number }): boolean {
  for (const b of BUILDINGS) {
    if (b.x === own.x && b.z === own.z) continue
    if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.62 + r) return false
  }
  return true
}

/** keep away from doorways + job boards so prompts/approaches stay readable */
function clearOfInteractives(x: number, z: number, r: number): boolean {
  for (const d of DOORS) if (Math.hypot(d.x - x, d.z - z) < r + 1.7) return false
  for (const p of POINTS_OF_INTEREST) if (Math.hypot(p.x - x, p.z - z) < r + 1.3) return false
  return true
}

/** not standing in the river / on its banks */
function clearOfWater(x: number, z: number, margin: number): boolean {
  const { d, halfWidth } = riverInfo(x, z)
  return d > halfWidth + margin
}

/** closest point on the road graph, plus that segment's unit direction */
function nearestRoadPoint(x: number, z: number): { px: number; pz: number; d: number; dirX: number; dirZ: number } {
  let bx = x
  let bz = z
  let bd = Infinity
  let bdx = 0
  let bdz = 1
  for (const road of ROADS) {
    for (let i = 0; i < road.length - 1; i++) {
      const ax = road[i][0]
      const az = road[i][1]
      const bx2 = road[i + 1][0]
      const bz2 = road[i + 1][1]
      const dx = bx2 - ax
      const dz = bz2 - az
      const len2 = dx * dx + dz * dz
      let t = len2 === 0 ? 0 : ((x - ax) * dx + (z - az) * dz) / len2
      t = Math.max(0, Math.min(1, t))
      const px = ax + dx * t
      const pz = az + dz * t
      const d = Math.hypot(x - px, z - pz)
      if (d < bd) {
        bd = d
        bx = px
        bz = pz
        const len = Math.sqrt(len2) || 1
        bdx = dx / len
        bdz = dz / len
      }
    }
  }
  return { px: bx, pz: bz, d: bd, dirX: bdx, dirZ: bdz }
}

/* --------------------------- shopfront name plates --------------------------- */

/** ORIGINAL painted signboard names — no real brands, pure Lokoja flavour */
export const SHOP_NAMES: readonly string[] = [
  'MAMA NGOZI PROVISIONS',
  'BUKA & JOLLOF SPOT',
  'TAILOR & FABRICS',
  'KPAKA PHOTOSTUDIO',
  'SUYA & PEPPER SOUP',
  'BEAUTY PLAZA',
  'PHONE CLINIC',
  'FROZEN FOODS',
  'BARBER SHOP',
  'ADEOLA BOOKSHOP',
  'KEKE & OKADA PARTS',
  'MODERN PATENT MEDICINE',
  'LOKOJA CITY COUNCIL',
  'STUDENT AFFAIRS BLOCK',
  'KOGI TRANSPORT UNION',
]

export const AWNING_TONES: readonly string[] = ['#c94f2e', '#2e7d5b', '#b03a5b', '#3a6ea3', '#d99a2b']
export const CLOTH_TONES: readonly string[] = ['#c94f2e', '#2e7d5b', '#e8c14a', '#3a6ea3', '#d9d2c0', '#b03a5b']

/* --------------------------------- shopfronts -------------------------------- */

export interface AwningDef {
  x: number
  y: number
  z: number
  /** yaw facing OUT of the wall (same convention as DOORS) */
  rotY: number
  width: number
  tone: number
}

export interface SignDef {
  x: number
  y: number
  z: number
  rotY: number
  w: number
  h: number
  /** atlas slot in the baked signboard texture (0..15) */
  slot: number
}

export const AWNINGS: AwningDef[] = []
export const SIGNBOARDS: SignDef[] = []

/* --------------------------------- compounds --------------------------------- */

export interface WallSegDef {
  x: number
  z: number
  y: number
  rotY: number
  len: number
  tone: number
}

export interface GateLeafDef {
  x: number
  z: number
  y: number
  rotY: number
}

export interface LaundryDef {
  /** line runs from (x1,z1) to (x2,z2) at height y */
  x1: number
  z1: number
  x2: number
  z2: number
  y: number
}

export const WALL_SEGMENTS: WallSegDef[] = []
export const GATE_LEAVES: GateLeafDef[] = []
export const LAUNDRY_LINES: LaundryDef[] = []

/* ------------------------------- utility poles ------------------------------- */

export interface PoleDef {
  x: number
  z: number
  y: number
  /** yaw aligned with the road (crossarm spans perpendicular) */
  rotY: number
}

export interface WireSpanDef {
  ax: number
  ay: number
  az: number
  bx: number
  by: number
  bz: number
  sag: number
}

export const UTILITY_POLES: PoleDef[] = []
export const WIRE_SPANS: WireSpanDef[] = []

/* -------------------------------- road signs --------------------------------- */

export interface RoadSignDef {
  x: number
  z: number
  y: number
  rotY: number
  /** 0 green direction, 1 blue info, 2 white municipal */
  kind: number
}

export const ROAD_SIGNS: RoadSignDef[] = []

/* ---------------------------- keke-stop shelters ----------------------------- */

export interface ShelterDef {
  x: number
  z: number
  y: number
  rotY: number
  tone: number
}

export const SHELTERS: ShelterDef[] = []

/* --------------------------- crates / tires / drums --------------------------- */

export interface CrateDef {
  x: number
  y: number
  z: number
  rotY: number
  s: number
}

export interface BasketDef {
  x: number
  y: number
  z: number
  s: number
}

export interface TireDef {
  x: number
  y: number
  z: number
}

export interface BarrelDef {
  x: number
  y: number
  z: number
  /** 0 blue, 1 red, 2 green */
  tone: number
}

export const CRATES: CrateDef[] = []
export const BASKETS: BasketDef[] = []
export const TIRES: TireDef[] = []
export const BARRELS: BarrelDef[] = []

/* ------------------------------ rooftop clutter ------------------------------ */

export interface TankDef {
  x: number
  y: number
  z: number
}

export interface AntennaDef {
  x: number
  y: number
  z: number
  h: number
}

export const WATER_TANKS: TankDef[] = []
export const ANTENNAS: AntennaDef[] = []

/* ============================================================================
 * DERIVATION (runs once at import — deterministic, seeded, in-order)
 * ========================================================================== */

/* ---- 1. utility poles + wire spans along the main roads ---- */
{
  const rng = makeRng(41001)
  const POLE_ROADS = [0, 1, 2, 3, 5, 6, 7, 11] // the named town roads, not the Patti trail
  for (const ri of POLE_ROADS) {
    const road = ROADS[ri]
    const side = ri % 2 === 0 ? 1 : -1
    const chain: PoleDef[] = []
    for (let i = 0; i < road.length - 1; i++) {
      const ax = road[i][0]
      const az = road[i][1]
      const bx = road[i + 1][0]
      const bz = road[i + 1][1]
      const segLen = Math.hypot(bx - ax, bz - az)
      const dirX = (bx - ax) / segLen
      const dirZ = (bz - az) / segLen
      const steps = Math.max(1, Math.floor(segLen / 12))
      for (let s = 0; s < steps; s++) {
        if (UTILITY_POLES.length >= 30) break
        const t = (s + 0.5) / steps
        const cx = ax + (bx - ax) * t
        const cz = az + (bz - az) * t
        // roadside offset, perpendicular to the road
        const x = cx + dirZ * side * 3.9
        const z = cz - dirX * side * 3.9
        if (!clearOfWater(x, z, 5)) continue
        if (roadDistance(x, z) < 2.4) continue
        if (!clearOfBuildings(x, z, 0.8)) continue
        if (Math.hypot(x, z) > 150) continue
        const y = heightAt(x, z)
        if (y < 0) continue
        // avoid stacking poles at junctions where roads meet
        if (UTILITY_POLES.some((p) => Math.hypot(p.x - x, p.z - z) < 9)) continue
        const pole: PoleDef = { x, z, y, rotY: Math.atan2(dirX, dirZ) }
        UTILITY_POLES.push(pole)
        chain.push(pole)
      }
    }
    // sagging wires between consecutive poles of the same road
    for (let i = 0; i < chain.length - 1; i++) {
      const a = chain[i]
      const b = chain[i + 1]
      const len = Math.hypot(b.x - a.x, b.z - a.z)
      if (len > 24) continue // gap in the chain (junction skip) — no wire
      WIRE_SPANS.push({
        ax: a.x, ay: a.y + 5.35, az: a.z,
        bx: b.x, by: b.y + 5.35, bz: b.z,
        sag: 0.35 + rng() * 0.4,
      })
    }
  }
}

/* ---- 2. shopfronts: awnings + signboards on shop-like buildings ---- */
{
  const rng = makeRng(41002)
  let lastSlot = -1
  for (const b of BUILDINGS) {
    const isShopFace = b.kind === 'shop' || b.kind === 'shed'
    const isOffice = b.kind === 'block' || b.kind === 'hostel'
    if (!isShopFace && !isOffice) continue
    const fx = Math.sin(b.rotY)
    const fz = Math.cos(b.rotY)
    const frontX = b.x + fx * (b.d / 2)
    const frontZ = b.z + fz * (b.d / 2)
    // a doorway prop already dresses this face — leave it alone
    if (DOORS.some((d) => Math.hypot(d.x - frontX, d.z - frontZ) < 2.1)) continue

    // signboard slot: offices get their civic plates, shops cycle the names
    let slot: number
    if (b.kind === 'block') slot = 12
    else if (b.kind === 'hostel') slot = 13
    else if (b.kind === 'shed' && Math.hypot(b.x - ANCHOR_BY_ID['transport-area'].x, b.z - ANCHOR_BY_ID['transport-area'].z) < 17) slot = 14
    else {
      do {
        slot = Math.floor(rng() * 12)
      } while (slot === lastSlot)
      lastSlot = slot
    }

    SIGNBOARDS.push({
      x: frontX + fx * 0.1,
      y: isOffice ? b.y + 2.98 : b.y + Math.min(b.h, 3.5) - 0.5,
      z: frontZ + fz * 0.1,
      rotY: b.rotY,
      w: Math.min(Math.max(b.w * 0.62, 2.0), 3.3),
      h: 0.68,
      slot,
    })

    if (isShopFace && rng() < 0.9) {
      AWNINGS.push({
        x: b.x + fx * (b.d / 2 + 0.52),
        y: b.y + 2.4,
        z: b.z + fz * (b.d / 2 + 0.52),
        rotY: b.rotY,
        width: Math.min(Math.max(b.w * 0.72, 2.2), 3.8),
        tone: Math.floor(rng() * AWNING_TONES.length),
      })
    }
  }
}

/* ---- 3. compound walls around some residential buildings ---- */
{
  const rng = makeRng(41003)
  let compounds = 0
  for (const b of BUILDINGS) {
    if (compounds >= 7) break
    if (b.kind !== 'house' && b.kind !== 'colonial') continue
    if (rng() > 0.68) continue

    const halfW = b.w / 2 + 2.3
    const halfD = b.d / 2 + 2.3
    const cos = Math.cos(b.rotY)
    const sin = Math.sin(b.rotY)
    const toWorld = (lx: number, lz: number): [number, number] => [
      b.x + lx * cos + lz * sin,
      b.z - lx * sin + lz * cos,
    ]

    // gate side: the edge the door faces, else the edge facing the road
    const doorInside = DOORS.some((d) => {
      const wx = d.x - b.x
      const wz = d.z - b.z
      const lx = wx * cos - wz * sin
      const lz = wx * sin + wz * cos
      return Math.abs(lx) < halfW + 1 && Math.abs(lz) < halfD + 1
    })
    let gateEdge = 2 // +z (front)
    if (!doorInside) {
      const road = nearestRoadPoint(b.x, b.z)
      const dx = road.px - b.x
      const dz = road.pz - b.z
      const lx = dx * cos - dz * sin
      const lz = dx * sin + dz * cos
      gateEdge = Math.abs(lz) >= Math.abs(lx) ? (lz > 0 ? 2 : 3) : lx > 0 ? 1 : 0
    }

    const edges: { n: [number, number]; dir: 'x' | 'z'; along: number; cross: number }[] = [
      { n: [-1, 0], dir: 'z', along: halfD, cross: halfW },
      { n: [1, 0], dir: 'z', along: halfD, cross: halfW },
      { n: [0, 1], dir: 'x', along: halfW, cross: halfD },
      { n: [0, -1], dir: 'x', along: halfW, cross: halfD },
    ]

    let placed = 0
    edges.forEach((edge, ei) => {
      const nSeg = Math.max(2, Math.ceil((edge.along * 2) / 2.7))
      const segLen = (edge.along * 2) / nSeg
      for (let s = 0; s < nSeg; s++) {
        const along = -edge.along + segLen * (s + 0.5)
        // the gate gap sits mid-edge
        if (ei === gateEdge && Math.abs(along) < 1.35) continue
        const lx = edge.dir === 'x' ? along : edge.n[0] * edge.cross
        const lz = edge.dir === 'z' ? along : edge.n[1] * edge.cross
        const [wx, wz] = toWorld(lx, lz)
        if (!clearOfWater(wx, wz, 3.5)) continue
        if (roadDistance(wx, wz) < 2.9) continue // leave a gap where the road passes
        if (!clearOfOtherBuildings(wx, wz, 0.5, b)) continue // never clip a neighbour
        if (!clearOfInteractives(wx, wz, 0.7)) continue // never wall off a door approach
        if (Math.hypot(wx, wz) > 150) continue
        const yaw = edge.dir === 'x' ? b.rotY : b.rotY + Math.PI / 2
        WALL_SEGMENTS.push({ x: wx, z: wz, y: heightAt(wx, wz), rotY: yaw, len: segLen + 0.12, tone: b.tone })
        placed++
      }
    })

    if (placed >= 6) {
      compounds++
      // gate leaves, slightly swung open
      const gEdge = edges[gateEdge]
      const gYaw = gEdge.dir === 'x' ? b.rotY : b.rotY + Math.PI / 2
      for (const sideSign of [-1, 1]) {
        const along = sideSign * 1.5
        const lx = gEdge.dir === 'x' ? along : gEdge.n[0] * gEdge.cross
        const lz = gEdge.dir === 'z' ? along : gEdge.n[1] * gEdge.cross
        const [wx, wz] = toWorld(lx, lz)
        GATE_LEAVES.push({ x: wx, z: wz, y: heightAt(wx, wz), rotY: gYaw + sideSign * 0.55 })
      }
      // laundry line along the back edge of some compounds
      if (rng() < 0.62) {
        const p1 = toWorld(-halfW + 0.8, -halfD + 0.8)
        const p2 = toWorld(halfW - 0.8, -halfD + 0.8)
        const mx = (p1[0] + p2[0]) / 2
        const mz = (p1[1] + p2[1]) / 2
        if (
          clearOfWater(mx, mz, 3.5) &&
          roadDistance(mx, mz) > 3.0 &&
          clearOfInteractives(mx, mz, 0.6)
        ) {
          LAUNDRY_LINES.push({
            x1: p1[0], z1: p1[1], x2: p2[0], z2: p2[1],
            y: Math.max(heightAt(p1[0], p1[1]), heightAt(p2[0], p2[1])) + 1.78,
          })
        }
      }
    }
  }
}

/* ---- 4. rooftop clutter: water tanks + antennas on flat roofs ---- */
{
  const rng = makeRng(41004)
  for (const b of BUILDINGS) {
    if (b.roof !== 'flat') continue
    if (b.kind !== 'block' && b.kind !== 'hostel' && b.kind !== 'shop') continue
    const cos = Math.cos(b.rotY)
    const sin = Math.sin(b.rotY)
    const place = (): [number, number] => {
      const lx = (rng() * 2 - 1) * (b.w / 2 - 1.15)
      const lz = (rng() * 2 - 1) * (b.d / 2 - 1.15)
      return [b.x + lx * cos + lz * sin, b.z - lx * sin + lz * cos]
    }
    if (rng() < 0.62) {
      const [x, z] = place()
      WATER_TANKS.push({ x, y: b.y + b.h, z })
    }
    if (rng() < 0.45) {
      const [x, z] = place()
      ANTENNAS.push({ x, y: b.y + b.h, z, h: 1.6 + rng() * 1.6 })
    }
  }
}

/* ---- 5. market life: crates, baskets, barrels around the stalls ---- */
{
  const rng = makeRng(41005)
  STALLS.forEach((s, i) => {
    const cos = Math.cos(s.rotY)
    const sin = Math.sin(s.rotY)
    const sideOf = (dx: number, dz: number): [number, number] => [
      s.x + dx * cos + dz * sin,
      s.z - dx * sin + dz * cos,
    ]
    if (i % 3 === 0 && rng() < 0.85) {
      const [cx, cz] = sideOf((rng() - 0.5) * 1.2, 1.75)
      if (
        roadDistance(cx, cz) > 2.5 &&
        clearOfWater(cx, cz, 2.5) &&
        clearOfBuildings(cx, cz, 0.35) &&
        clearOfInteractives(cx, cz, 0.7)
      ) {
        const gy = heightAt(cx, cz)
        const stackH = rng() < 0.4 ? 2 : 1
        const n = 1 + Math.floor(rng() * 2)
        for (let k = 0; k < n; k++) {
          for (let layer = 0; layer < stackH; layer++) {
            CRATES.push({
              x: cx + (k - (n - 1) / 2) * 0.62 * cos + (rng() - 0.5) * 0.1,
              y: gy + 0.19 + layer * 0.37,
              z: cz - (k - (n - 1) / 2) * 0.62 * sin + (rng() - 0.5) * 0.1,
              rotY: s.rotY + (rng() - 0.5) * 0.5,
              s: 0.9 + rng() * 0.25,
            })
          }
        }
        if (rng() < 0.75) {
          BASKETS.push({ x: cx + 0.9 * sin, y: gy + 0.24, z: cz + 0.9 * cos, s: 0.85 + rng() * 0.4 })
        }
        if (rng() < 0.5) {
          BASKETS.push({ x: cx - 0.85 * sin, y: gy + 0.24, z: cz - 0.85 * cos, s: 0.8 + rng() * 0.4 })
        }
      }
    }
    if (i % 4 === 1) {
      const [bx, bz] = sideOf(0, -1.9)
      if (roadDistance(bx, bz) > 2.5 && clearOfWater(bx, bz, 2.5) && clearOfBuildings(bx, bz, 0.3) && clearOfInteractives(bx, bz, 0.7)) {
        BARRELS.push({ x: bx, y: heightAt(bx, bz) + 0.39, z: bz, tone: Math.floor(rng() * 3) })
      }
    }
  })
}

/* ---- 5b. extra street-life clusters by the market sheds + food strip ---- */
{
  const rng = makeRng(41008)
  const spots: { x: number; z: number }[] = []
  for (const b of BUILDINGS) {
    if (b.kind === 'shed') spots.push({ x: b.x, z: b.z })
  }
  spots.forEach((sp, idx) => {
    const n = 2 + Math.floor(rng() * 2)
    for (let k = 0; k < n; k++) {
      const ang = rng() * Math.PI * 2
      const rad = 5.2 + rng() * 3.4 + (idx % 2) * 1.4
      const x = sp.x + Math.cos(ang) * rad
      const z = sp.z + Math.sin(ang) * rad
      if (roadDistance(x, z) < 2.5) continue
      if (!clearOfWater(x, z, 2.5) || !clearOfBuildings(x, z, 0.5) || !clearOfInteractives(x, z, 0.8)) continue
      const gy = heightAt(x, z)
      if (k % 2 === 0) {
        CRATES.push({ x, y: gy + 0.19, z, rotY: rng() * Math.PI, s: 0.95 + rng() * 0.2 })
        if (rng() < 0.6) CRATES.push({ x, y: gy + 0.56, z, rotY: rng() * Math.PI, s: 0.9 + rng() * 0.15 })
      } else {
        BASKETS.push({ x, y: gy + 0.24, z, s: 0.9 + rng() * 0.4 })
        if (rng() < 0.5) BASKETS.push({ x: x + 0.8, y: gy + 0.24, z: z + 0.4, s: 0.8 + rng() * 0.3 })
      }
    }
  })
}

/* ---- 6. tire stacks + keke-stop shelters around the motor park / market ---- */
{
  const rng = makeRng(41006)
  // tire stacks by the transport sheds
  const park = ANCHOR_BY_ID['transport-area']
  for (const ang of [0.5, 2.3, 4.2]) {
    const x = park.x + Math.cos(ang) * 9.2
    const z = park.z + Math.sin(ang) * 9.2
    if (!clearOfWater(x, z, 2.5) || roadDistance(x, z) < 3.2) continue
    if (!clearOfBuildings(x, z, 0.7) || !clearOfInteractives(x, z, 1.0)) continue
    const gy = heightAt(x, z)
    const n = 3 + Math.floor(rng() * 2)
    for (let k = 0; k < n; k++) TIRES.push({ x, y: gy + 0.15 + k * 0.27, z })
  }

  // keke-stop shelters: motor park + Kpata market, set back from the road
  for (const [locId, tone] of [['transport-area', 0], ['kpata-market', 1]] as const) {
    const a = ANCHOR_BY_ID[locId]
    const road = nearestRoadPoint(a.x, a.z)
    // try a few roadside spots (sidewalk side × along-road) until one clears
    const variants: [number, number][] = [
      [4.5, 3.3], [-4.5, 3.3], [7.5, -3.3], [-7.5, -3.3],
      [10.5, 3.3], [-10.5, 3.3], [2.0, -3.3], [-2.0, -3.3],
    ]
    for (const [along, side] of variants) {
      const x = road.px + road.dirX * along + road.dirZ * side
      const z = road.pz + road.dirZ * along - road.dirX * side
      if (!clearOfWater(x, z, 2.5) || roadDistance(x, z) < 2.7) continue
      if (!clearOfBuildings(x, z, 1.0) || !clearOfInteractives(x, z, 1.0)) continue
      SHELTERS.push({ x, z, y: heightAt(x, z), rotY: Math.atan2(-road.dirZ * side, road.dirX * side), tone })
      break
    }
  }
}

/* ---- 7. road signs at the district gateways ---- */
{
  const rng = makeRng(41007)
  const spots = ['ganaja-junction', 'kpata-market', 'food-area', 'university-area', 'transport-area'] as const
  spots.forEach((locId, i) => {
    const a = ANCHOR_BY_ID[locId]
    const road = nearestRoadPoint(a.x, a.z)
    // a little way along the road from the plaza, set on the shoulder
    const variants: [number, number][] = [
      [6 + rng() * 3, 2.7],
      [-(6 + rng() * 3), 2.7],
      [9 + rng() * 3, -2.7],
      [-(9 + rng() * 3), -2.7],
    ]
    for (const [along, side] of variants) {
      const x = road.px + road.dirX * along + road.dirZ * side
      const z = road.pz + road.dirZ * along - road.dirX * side
      if (!clearOfWater(x, z, 2.5) || roadDistance(x, z) < 2.0) continue
      if (!clearOfBuildings(x, z, 0.5) || !clearOfInteractives(x, z, 0.9)) continue
      ROAD_SIGNS.push({ x, z, y: heightAt(x, z), rotY: Math.atan2(a.x - x, a.z - z), kind: i % 3 })
      return
    }
  })
}
