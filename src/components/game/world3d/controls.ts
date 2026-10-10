/**
 * LOKOJA LIFE — Player controls & movement (Stage 3.6)
 * -----------------------------------------------------
 * THE one movement controller. The virtual joystick, the keyboard and
 * the sprint button all write into the input singletons here, and
 * PlayerAvatar steps the character with the pure `stepPlayer` fn every
 * frame — so touch and keyboard share identical physics and no second
 * movement system can appear.
 *
 * The travel system stays untouched: while a keke/taxi/walk trip runs
 * the controller simply yields (input is ignored), and the avatar rides
 * the real route. Walking is exploration; travel is transport.
 *
 * Pure functions (normalizeJoystick / combineInputs / cameraRelative /
 * stepPlayer) are unit-tested headlessly in scripts/test-stage36.ts.
 */

import { MOVEMENT } from '@/game/data/config'
import { WORLD_BOUNDS, terrainSlope, WATER_LEVEL } from '@/game/systems/terrain'
import {
  groundHeight,
  ANCHORS,
  ALL_BUILDING_PLANS,
  SCATTER_HOUSES,
  LANDMARK_POSITIONS,
  type BuildingPlacement,
  type BuildingKind,
} from '@/game/data/world3d'
import { LOCATIONS } from '@/game/data/locations'

/* ------------------------------ live input state ---------------------------- */

/** Written by the Joystick DOM component (analog, -1..1, y = forward+). */
export const joystickState = { x: 0, y: 0, active: false }

/** Written by the keyboard listeners (WASD + arrows + shift). */
export const keyState = { up: false, down: false, left: false, right: false, sprint: false }

/** Written by the on-screen sprint button (hold to run). */
export const sprintButton = { held: false }

/** HUD sheets lock walking so keys never move the player behind a modal. */
export const inputLock = { locked: false }

/**
 * The player's live world position — written by PlayerAvatar every frame,
 * read by the camera rig, the near-location chip and tests. Module state
 * because exactly one world/canvas exists at a time.
 */
export const playerPos = {
  x: 0,
  z: 88,
  y: 3,
  heading: 0,
  speed: 0,
  sprinting: false,
  /** true once playerPos has been anchored to a real location */
  init: false,
  /** location id the position currently corresponds to (for re-anchoring) */
  anchorId: '' as string,
}

/** Horizontal azimuth of the camera — CameraRig writes it every frame. */
export const camState = { theta: Math.PI * 0.9 }

/* --------------------------- pure input functions --------------------------- */

export interface JoystickInput {
  x: number
  y: number
}

/**
 * Normalize a raw joystick displacement into -1..1 analog axes with a
 * dead zone. Screen-up (negative dy) is forward. The result keeps the
 * analog magnitude — small nudges walk slowly, full deflection is fast.
 */
export function normalizeJoystick(dx: number, dy: number, radius: number): JoystickInput {
  if (radius <= 0) return { x: 0, y: 0 }
  let nx = dx / radius
  let ny = -dy / radius
  let mag = Math.hypot(nx, ny)
  if (mag > 1) {
    nx /= mag
    ny /= mag
    mag = 1
  }
  const dz = MOVEMENT.deadZone
  if (mag < dz) return { x: 0, y: 0 }
  // rescale past the dead zone so output ramps 0→1 smoothly
  const scaled = (mag - dz) / (1 - dz)
  return { x: (nx / mag) * scaled, y: (ny / mag) * scaled }
}

/** Vector from the current keyboard state (WASD + arrows), -1..1 per axis. */
export function keyboardVector(keys: typeof keyState): JoystickInput {
  const x = (keys.right ? 1 : 0) - (keys.left ? 1 : 0)
  const y = (keys.up ? 1 : 0) - (keys.down ? 1 : 0)
  return { x, y }
}

export interface MoveIntent {
  /** strafe intent, -1..1 (right positive) */
  ix: number
  /** forward intent, -1..1 (forward positive) */
  iz: number
  sprint: boolean
}

/**
 * Merge joystick + keyboard into one analog intent. Diagonals never
 * exceed magnitude 1 (no faster diagonal movement) and the joystick
 * keeps its analog feel. Sprint is an explicit modifier only.
 */
export function combineInputs(
  joy: JoystickInput,
  keys: typeof keyState,
  sprintHeld: boolean,
): MoveIntent {
  const kb = keyboardVector(keys)
  let ix = joy.x + kb.x
  let iz = joy.y + kb.y
  let mag = Math.hypot(ix, iz)
  if (mag > 1) {
    ix /= mag
    iz /= mag
    mag = 1
  }
  // keyboard is binary — give it the analog scale of 1 (already ≤ 1)
  const sprint = sprintHeld && mag > 0.01
  return { ix, iz, sprint }
}

/**
 * Rotate an input intent into world-space movement relative to the
 * camera's horizontal orientation (push up = walk away from camera).
 */
export function cameraRelative(ix: number, iz: number, camTheta: number): { mx: number; mz: number } {
  // camera sits at target + (sinθ, cosθ); forward = away from camera
  const fx = -Math.sin(camTheta)
  const fz = -Math.cos(camTheta)
  // right = forward rotated -90° around Y
  const rx = -fz
  const rz = fx
  return {
    mx: fx * iz + rx * ix,
    mz: fz * iz + rz * ix,
  }
}

/* ------------------------------- collision grid ------------------------------ */

export interface Collider {
  x: number
  z: number
  r: number
}

/** Footprint radii per building kind (world units, slightly generous). */
const COLLIDER_RADIUS: Partial<Record<BuildingKind, number>> = {
  house: 4.0,
  bungalow: 4.6,
  compound: 5.6,
  flat: 5.2,
  shop: 3.6,
  block: 4.8,
  hostel: 6.2,
  stall: 1.7,
  kiosk: 2.1,
  buka: 2.6,
  workshop: 5.0,
  office: 5.6,
  colonial: 5.8,
  school: 7.2,
  shelter: 4.6,
  resthouse: 5.2,
  mosque: 8.5,
  church: 7.5,
  monument: 2.8,
}

function collidersOfPlacement(p: BuildingPlacement): Collider | null {
  const r = COLLIDER_RADIUS[p.kind]
  if (!r) return null
  return { x: p.x, z: p.z, r: r * p.scale }
}

/**
 * Uniform-grid collision index over every building in the world.
 * Built once (deterministic data) — queries touch only 3×3 cells.
 */
export interface ColliderGrid {
  cell: number
  buckets: Map<number, Collider[]>
  query(x: number, z: number): Collider[]
}

export function buildColliderGrid(): ColliderGrid {
  const cell = 24
  const buckets = new Map<number, Collider[]>()
  const key = (cx: number, cz: number) => (cx + 512) * 1024 + (cz + 512)

  const add = (c: Collider) => {
    const cx = Math.floor(c.x / cell)
    const cz = Math.floor(c.z / cell)
    const k = key(cx, cz)
    const arr = buckets.get(k)
    if (arr) arr.push(c)
    else buckets.set(k, [c])
  }

  for (const plan of ALL_BUILDING_PLANS) {
    for (const b of plan.buildings) {
      const c = collidersOfPlacement(b)
      if (c) add(c)
    }
  }
  for (const b of SCATTER_HOUSES) {
    const c = collidersOfPlacement(b)
    if (c) add(c)
  }
  // landmarks (mosque / church / monument) — single source of truth
  const mosque = collidersOfPlacement({ kind: 'mosque', x: LANDMARK_POSITIONS.mosque.x, z: LANDMARK_POSITIONS.mosque.z, rot: 0, scale: 1, color: 0 })
  const church = collidersOfPlacement({ kind: 'church', x: LANDMARK_POSITIONS.church.x, z: LANDMARK_POSITIONS.church.z, rot: 0, scale: 1, color: 0 })
  const monument = collidersOfPlacement({ kind: 'monument', x: LANDMARK_POSITIONS.monument.x, z: LANDMARK_POSITIONS.monument.z, rot: 0, scale: 1, color: 0 })
  if (mosque) add(mosque)
  if (church) add(church)
  if (monument) add(monument)

  return {
    cell,
    buckets,
    query(x: number, z: number): Collider[] {
      const cx = Math.floor(x / cell)
      const cz = Math.floor(z / cell)
      const out: Collider[] = []
      for (let ix = cx - 1; ix <= cx + 1; ix++) {
        for (let iz = cz - 1; iz <= cz + 1; iz++) {
          const arr = buckets.get(key(ix, iz))
          if (arr) out.push(...arr)
        }
      }
      return out
    },
  }
}

/** The one grid (module singleton — one world at a time). */
let gridCache: ColliderGrid | null = null
export function colliderGrid(): ColliderGrid {
  if (!gridCache) gridCache = buildColliderGrid()
  return gridCache
}

/* ------------------------------ movement solver ----------------------------- */

const BOUNDS_MARGIN = 4

/** Circle colliders push the walker out; two passes settle corners. */
function resolveCircles(x: number, z: number, grid: ColliderGrid): { x: number; z: number } {
  const r = MOVEMENT.playerRadius
  for (let pass = 0; pass < 2; pass++) {
    const near = grid.query(x, z)
    let moved = false
    for (const c of near) {
      const dx = x - c.x
      const dz = z - c.z
      const min = c.r + r
      const d2 = dx * dx + dz * dz
      if (d2 < min * min) {
        const d = Math.max(0.001, Math.sqrt(d2))
        const push = min - d
        x += (dx / d) * push
        z += (dz / d) * push
        moved = true
      }
    }
    if (!moved) break
  }
  return { x, z }
}

/** True when the ground at a point is not walkable (water / cliff). */
export function blockedGround(x: number, z: number): boolean {
  if (groundHeight(x, z) < WATER_LEVEL + 0.18) return true // river
  if (terrainSlope(x, z) > MOVEMENT.maxClimbSlope) return true // cliffs
  return false
}

export interface StepResult {
  speed: number
  blocked: boolean
}

/**
 * Advance the walking player one frame. Mutates `pos` and `vel` in place
 * (zero allocation in the hot loop). Framerate-independent: all terms
 * are dt-scaled, and dt is clamped by the caller.
 *
 * Collision model: buildings push out (slide along walls); rivers and
 * too-steep slopes block with an axis-separated slide fallback so the
 * player glides along banks instead of sticking.
 */
export function stepPlayer(
  pos: { x: number; z: number },
  vel: { x: number; z: number },
  intent: MoveIntent,
  dt: number,
  camTheta: number,
  grid: ColliderGrid,
): StepResult {
  const dir = cameraRelative(intent.ix, intent.iz, camTheta)
  // |dir| == |input| ≤ 1, so analog magnitude carries through naturally
  const raw = intent.sprint ? MOVEMENT.runSpeed : MOVEMENT.walkSpeed
  const targetX = dir.mx * raw
  const targetZ = dir.mz * raw

  const accelerating = raw * Math.hypot(dir.mx, dir.mz) > Math.hypot(vel.x, vel.z)
  const k = 1 - Math.exp(-dt * (accelerating ? MOVEMENT.accel : MOVEMENT.decel))
  vel.x += (targetX - vel.x) * k
  vel.z += (targetZ - vel.z) * k

  let nx = pos.x + vel.x * dt
  let nz = pos.z + vel.z * dt

  // solid obstacles: slide along walls
  const solved = resolveCircles(nx, nz, grid)
  nx = solved.x
  nz = solved.z

  // water / cliffs: block with axis-separated slide
  let blocked = false
  if (blockedGround(nx, nz)) {
    if (!blockedGround(nx, pos.z)) {
      nz = pos.z
      vel.z *= 0.1
    } else if (!blockedGround(pos.x, nz)) {
      nx = pos.x
      vel.x *= 0.1
    } else {
      nx = pos.x
      nz = pos.z
      vel.x *= 0.1
      vel.z *= 0.1
    }
    blocked = true
  }

  // world bounds
  nx = Math.max(WORLD_BOUNDS.minX + BOUNDS_MARGIN, Math.min(WORLD_BOUNDS.maxX - BOUNDS_MARGIN, nx))
  nz = Math.max(WORLD_BOUNDS.minZ + BOUNDS_MARGIN, Math.min(WORLD_BOUNDS.maxZ - BOUNDS_MARGIN, nz))

  pos.x = nx
  pos.z = nz
  return { speed: Math.hypot(vel.x, vel.z), blocked }
}

/* ------------------------------- keyboard hook ------------------------------- */

/**
 * Attach global keyboard controls (idempotent — mounted once per page).
 * Arrow keys are prevented from scrolling the page; typing in real
 * inputs is never hijacked.
 */
export function initKeyboardControls(): () => void {
  const down = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
    switch (e.key) {
      case 'w': case 'W': case 'ArrowUp': keyState.up = true; e.preventDefault(); break
      case 's': case 'S': case 'ArrowDown': keyState.down = true; e.preventDefault(); break
      case 'a': case 'A': case 'ArrowLeft': keyState.left = true; e.preventDefault(); break
      case 'd': case 'D': case 'ArrowRight': keyState.right = true; e.preventDefault(); break
      case 'Shift': keyState.sprint = true; break
    }
  }
  const up = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'w': case 'W': case 'ArrowUp': keyState.up = false; break
      case 's': case 'S': case 'ArrowDown': keyState.down = false; break
      case 'a': case 'A': case 'ArrowLeft': keyState.left = false; break
      case 'd': case 'D': case 'ArrowRight': keyState.right = false; break
      case 'Shift': keyState.sprint = false; break
    }
  }
  const blur = () => {
    keyState.up = false
    keyState.down = false
    keyState.left = false
    keyState.right = false
    keyState.sprint = false
  }
  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  window.addEventListener('blur', blur)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
    window.removeEventListener('blur', blur)
  }
}

/** Reset all input (called when the world unmounts or travel starts). */
export function resetInputs() {
  joystickState.x = 0
  joystickState.y = 0
  joystickState.active = false
  sprintButton.held = false
  keyState.up = false
  keyState.down = false
  keyState.left = false
  keyState.right = false
  keyState.sprint = false
}

/* --------------------------- nearest location zone --------------------------- */

/**
 * The location zone the player currently stands inside (or null).
 * Uses MOVEMENT.nearRadius around every anchor's stand point.
 */
export function nearestLocationZone(x: number, z: number): string | null {
  let best: string | null = null
  let bestD: number = MOVEMENT.nearRadius
  for (const loc of LOCATIONS) {
    const a = ANCHORS[loc.id]
    if (!a) continue
    const d = Math.hypot(x - a.standX, z - a.standZ)
    if (d < bestD) {
      bestD = d
      best = loc.id
    }
  }
  return best
}
