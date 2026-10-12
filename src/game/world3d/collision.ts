/**
 * LOKOJA LIFE — 3D World Collision (Stage 3D)
 * ---------------------------------------------
 * Pure spatial resolution for the walkable world:
 *  - oriented building footprints (circle vs OBB)
 *  - rivers (blocked except on bridge decks)
 *  - the world-boundary rim
 *
 * Deterministic and dependency-free — the player controller calls
 * resolve() every frame with its intended position and gets a legal one.
 */

import { BUILDINGS, BRIDGES, inSchoolYard, POINTS_OF_INTEREST, RIVERS, WALK_BOUND, type BuildingDef } from './layout'
import { SCHOOL_BOXES, isSchoolCollider, type SchoolBox } from './schools'

/** (layout.inSchoolYard re-exported locally for the river override) */

/* ---------------------------- building colliders ---------------------------- */

interface BoxCollider {
  cx: number
  cz: number
  hw: number // half width (local x)
  hd: number // half depth (local z)
  cos: number
  sin: number
  rotY: number
}

function boxFor(b: BuildingDef): BoxCollider {
  const pad = 0.45 // breathing room so the player never clips walls
  return {
    cx: b.x,
    cz: b.z,
    hw: b.w / 2 + pad,
    hd: b.d / 2 + pad,
    cos: Math.cos(-b.rotY),
    sin: Math.sin(-b.rotY),
    rotY: b.rotY,
  }
}

function boxForSchool(b: SchoolBox): BoxCollider {
  const pad = b.kind === 'flag' ? 0.3 : 0.45
  return {
    cx: b.x,
    cz: b.z,
    hw: b.w / 2 + pad,
    hd: b.d / 2 + pad,
    cos: Math.cos(-b.rotY),
    sin: Math.sin(-b.rotY),
    rotY: b.rotY,
  }
}

const BOXES: BoxCollider[] = [
  ...BUILDINGS.map(boxFor),
  // Stage 7 — school compounds (walls, blocks, gatehouses… the open gate gap
  // is real: the wall runs leave a walkable gap and the arch itself collides not)
  ...SCHOOL_BOXES.filter(isSchoolCollider).map(boxForSchool),
  // points of interest get a slim collider so you walk UP TO a job board, not through it
  ...POINTS_OF_INTEREST.map((p) => ({
    cx: p.x,
    cz: p.z,
    hw: 0.85,
    hd: 0.22,
    cos: Math.cos(-p.rotY),
    sin: Math.sin(-p.rotY),
    rotY: p.rotY,
  })),
]

/** push a circle out of an oriented box (no-op if not overlapping) */
function resolveBox(x: number, z: number, r: number, b: BoxCollider): [number, number] {
  const dx = x - b.cx
  const dz = z - b.cz
  // world → box local
  const lx = dx * b.cos - dz * b.sin
  const lz = dx * b.sin + dz * b.cos
  const clampedX = Math.max(-b.hw, Math.min(b.hw, lx))
  const clampedZ = Math.max(-b.hd, Math.min(b.hd, lz))
  const ox = lx - clampedX
  const oz = lz - clampedZ
  const dist2 = ox * ox + oz * oz
  if (dist2 > r * r) return [x, z] // no overlap
  if (dist2 > 1e-6) {
    // push out along the shortest separation vector
    const dist = Math.sqrt(dist2)
    const push = (r - dist) / dist
    const rx = ox * push
    const rz = oz * push
    // local → world
    const wcos = Math.cos(b.rotY)
    const wsin = Math.sin(b.rotY)
    return [x + (rx * wcos - rz * wsin), z + (rx * wsin + rz * wcos)]
  }
  // centre inside the box — push toward the nearest face
  const dxFace = b.hw - Math.abs(lx)
  const dzFace = b.hd - Math.abs(lz)
  if (dxFace < dzFace) {
    const nl = (lx >= 0 ? b.hw + r : -b.hw - r)
    const wcos = Math.cos(b.rotY)
    const wsin = Math.sin(b.rotY)
    const rx = nl - lx
    return [x + (rx * wcos), z + (rx * wsin)]
  }
  const nl = (lz >= 0 ? b.hd + r : -b.hd - r)
  const wcos = Math.cos(b.rotY)
  const wsin = Math.sin(b.rotY)
  const rz = nl - lz
  return [x + (-rz * wsin), z + (rz * wcos)]
}

/* -------------------------------- bridges ---------------------------------- */

interface BridgeZone {
  cx: number
  cz: number
  hl: number
  hw: number
  cos: number
  sin: number
}

const BRIDGE_ZONES: BridgeZone[] = BRIDGES.map((b) => ({
  cx: b.x,
  cz: b.z,
  hl: b.length / 2 + 1.5,
  hw: b.width / 2,
  cos: Math.cos(-b.rotY),
  sin: Math.sin(-b.rotY),
}))

function onBridge(x: number, z: number): boolean {
  for (const b of BRIDGE_ZONES) {
    const dx = x - b.cx
    const dz = z - b.cz
    const lx = dx * b.cos - dz * b.sin
    const lz = dx * b.sin + dz * b.cos
    if (Math.abs(lx) <= b.hl && Math.abs(lz) <= b.hw) return true
  }
  return false
}

/* --------------------------------- rivers ---------------------------------- */

/** closest distance to any river centreline */
function riverDistance(x: number, z: number): { d: number; halfWidth: number; cx: number; cz: number } {
  let best = Infinity
  let halfWidth = 0
  let bestCx = x
  let bestCz = z
  for (const r of RIVERS) {
    for (let i = 0; i < r.points.length - 1; i++) {
      const [ax, az] = r.points[i]
      const [bx, bz] = r.points[i + 1]
      const dx = bx - ax
      const dz = bz - az
      const len2 = dx * dx + dz * dz
      let t = len2 === 0 ? 0 : ((x - ax) * dx + (z - az) * dz) / len2
      t = Math.max(0, Math.min(1, t))
      const px = ax + dx * t
      const pz = az + dz * t
      const d = Math.hypot(x - px, z - pz)
      if (d < best) {
        best = d
        halfWidth = r.width / 2
        bestCx = px
        bestCz = pz
      }
    }
  }
  return { d: best, halfWidth, cx: bestCx, cz: bestCz }
}

/* ------------------------------- the resolver ------------------------------- */

export const PLAYER_RADIUS = 0.55

/**
 * Resolve a would-be player position into a legal one.
 * Order: buildings → rivers (bridge-aware) → world rim.
 */
export function resolvePosition(x: number, z: number): [number, number] {
  // buildings
  for (const b of BOXES) {
    const rx = x - b.cx
    const rz = z - b.cz
    if (rx * rx + rz * rz > (b.hw + b.hd + PLAYER_RADIUS) ** 2) continue // broad phase
    ;[x, z] = resolveBox(x, z, PLAYER_RADIUS, b)
  }

  // rivers — blocked unless standing on a bridge deck (or inside a school yard)
  if (!onBridge(x, z) && !inSchoolYard(x, z)) {
    const { d, halfWidth, cx, cz } = riverDistance(x, z)
    const limit = halfWidth + PLAYER_RADIUS * 0.4
    if (d < limit && d > 1e-4) {
      const push = (limit - d) / d
      x += (x - cx) * push
      z += (z - cz) * push
    }
  }

  // world rim
  const rim = Math.hypot(x, z)
  if (rim > WALK_BOUND) {
    x = (x / rim) * WALK_BOUND
    z = (z / rim) * WALK_BOUND
  }

  return [x, z]
}

/**
 * Bridge deck height — the player walks flat across the span.
 * Returns null when not on a bridge (caller then uses terrain height).
 */
export function bridgeDeckY(x: number, z: number): number | null {
  for (let i = 0; i < BRIDGE_ZONES.length; i++) {
    const b = BRIDGE_ZONES[i]
    const dx = x - b.cx
    const dz = z - b.cz
    const lx = dx * b.cos - dz * b.sin
    const lz = dx * b.sin + dz * b.cos
    if (Math.abs(lx) <= b.hl && Math.abs(lz) <= b.hw) {
      return BRIDGES[i].y
    }
  }
  return null
}

/* --------------------------- camera obstruction ---------------------------- */

/**
 * INC 4 — the known "camera clips building corners" fix. Samples the
 * segment player → camera against the building OBBs (2D footprint +
 * real height) and returns the FRACTION t (0..1] along the segment of
 * the first blocked sample, or null when the view is clear. The camera
 * rig pulls in to just before t so walls never swallow the view.
 */
const CAM_SAMPLES = 10

/** buildings only, with real top height — the camera obstruction world */
const CAM_BOXES: (BoxCollider & { topY: number })[] = [
  ...BUILDINGS.map((b) => ({ ...boxFor(b), topY: b.y + b.h })),
  ...SCHOOL_BOXES.filter(isSchoolCollider).map((b) => ({ ...boxForSchool(b), topY: b.y + b.h })),
]

export function cameraObstructionT(
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  camY: number,
): number | null {
  let hit: number | null = null
  for (let s = 1; s <= CAM_SAMPLES; s++) {
    const t = s / CAM_SAMPLES
    const x = x0 + (x1 - x0) * t
    const z = z0 + (z1 - z0) * t
    let blocked = false
    for (const b of CAM_BOXES) {
      if (camY >= b.topY) continue // camera flies over this roof
      const dx = x - b.cx
      const dz = z - b.cz
      if (dx * dx + dz * dz > (b.hw + b.hd + 0.3) ** 2) continue
      const lx = dx * b.cos - dz * b.sin
      const lz = dx * b.sin + dz * b.cos
      if (Math.abs(lx) <= b.hw && Math.abs(lz) <= b.hd) {
        blocked = true
        break
      }
    }
    if (blocked) {
      hit = Math.max(0.08, t - 1 / CAM_SAMPLES)
      break
    }
  }
  return hit
}
