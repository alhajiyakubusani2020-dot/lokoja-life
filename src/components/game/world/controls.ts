/**
 * LOKOJA LIFE — World Input Controls (Stage 3D + Stage 5)
 * --------------------------------------------------------
 * A tiny framework-agnostic input layer shared by the DOM HUD
 * (joystick, buttons) and the R3F player controller (keyboard).
 *
 * - Movement comes from EITHER the virtual joystick (touch) or
 *   WASD/arrow keys (desktop) — joystick wins when engaged.
 * - Look drag: pointer drag anywhere on the look surface.
 * - Interact: E / Enter (keyboard) or the HUD button (touch).
 * - Stage 5 drive mode: while driving, the same joystick/key axes are
 *   re-interpreted by DriveSystem (Y = throttle/brake, X = steer) and
 *   the walking controller is held frozen. The DOM HUD and the R3F
 *   drive loop meet here — neither imports the other.
 */

import type { VehicleModel } from '@/game/types'

export interface Vec2 {
  x: number
  y: number
}

/** presentation-layer movement tuning (not economy — no fares here) */
export const MOVE = {
  walkSpeed: 4.4,
  sprintSpeed: 7.4,
  accel: 26,
  playerRadius: 0.55,
  cameraDistance: 9.6,
  cameraMinDistance: 6,
  cameraMaxDistance: 15,
  cameraHeight: 4.4,
  camPitchMin: 0.14,
  camPitchMax: 1.05,
  camAlignRate: 2.1,
  interactRadius: 8.6,
} as const

/** camera view presets — cycle with C or the HUD view button */
export type CamMode = 'follow' | 'orbit' | 'drone'
export const CAM_MODES: { id: CamMode; label: string }[] = [
  { id: 'follow', label: 'Follow' },
  { id: 'orbit', label: 'Orbit' },
  { id: 'drone', label: 'Drone' },
]
/** per-mode rig tuning: distance multiplier, height offset, auto-align rate */
export const CAM_RIG: Record<CamMode, { dist: number; height: number; align: number }> = {
  follow: { dist: 1, height: 0, align: 2.1 },
  orbit: { dist: 1.25, height: 1.2, align: 0 }, // never auto-aligns — full manual
  drone: { dist: 2.1, height: 10.5, align: 1.1 }, // high, steep, city overview
}

/* --------------------------------- state ----------------------------------- */

const keys = new Set<string>()
let joy: Vec2 = { x: 0, y: 0 } // -1..1, y+ = forward
let joyActive = false
let lookDx = 0
let lookDy = 0
let interactQueued = false
let sprintHeld = false
let attached = false

function onKeyDown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement | null)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  keys.add(e.code)
  if (e.code === 'KeyE' || e.code === 'Enter') interactQueued = true
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprintHeld = true
  if (e.code === 'KeyC') cycleCamMode()
  // photo mode (V) is owned by the HUD so it can animate chrome with it
  // stop page scroll on arrows/space while exploring
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault()
  // tutorial: any movement key counts as "moved"
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) markMoved()
}

function onKeyUp(e: KeyboardEvent) {
  keys.delete(e.code)
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprintHeld = false
}

function onBlur() {
  keys.clear()
  sprintHeld = false
}

/* ------------------------------ look dragging ------------------------------ */

let dragging = false
let lastX = 0
let lastY = 0
let dragTotal = 0

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  dragging = true
  lastX = e.clientX
  lastY = e.clientY
}

function onPointerMove(e: PointerEvent) {
  if (!dragging) return
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  lookDx += dx
  lookDy += dy
  lastX = e.clientX
  lastY = e.clientY
  // tutorial: a meaningful drag counts as "looked around"
  if (Math.hypot(dx, dy) > 2) {
    dragTotal += Math.hypot(dx, dy)
    if (dragTotal > 30) tut.looked = true
  }
}

function onPointerUp() {
  dragging = false
}

/* -------------------------------- public API -------------------------------- */

export function attachControls(surface: HTMLElement): () => void {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
  surface.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('wheel', onWheel, { passive: true })
  attached = true

  return () => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onBlur)
    surface.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    window.removeEventListener('wheel', onWheel)
    attached = false
    keys.clear()
    joy = { x: 0, y: 0 }
    joyActive = false
    dragging = false
  }
}

/** virtual joystick writes here (HUD component) */
export function setJoystick(x: number, y: number) {
  joy = { x, y }
  joyActive = Math.hypot(x, y) > 0.01
  if (joyActive) markMoved()
}

export function setSprint(on: boolean) {
  sprintHeld = on
}

export function queueInteract() {
  interactQueued = true
}

/** camera look consumes the accumulated drag delta.
 *  SILK II: returns a SHARED scratch (zero allocation in the frame loop) —
 *  the single-frame-ownership law: read it in the tick that consumed it,
 *  never hold the reference across frames. */
const LOOK_SCRATCH: { dx: number; dy: number } = { dx: 0, dy: 0 }
export function consumeLook(): { dx: number; dy: number } {
  LOOK_SCRATCH.dx = lookDx
  LOOK_SCRATCH.dy = lookDy
  lookDx = 0
  lookDy = 0
  return LOOK_SCRATCH
}

let zoomDelta = 0

/** mouse wheel / pinch zoom request */
export function queueZoom(delta: number) {
  zoomDelta += delta
}

export function consumeZoom(): number {
  const d = zoomDelta
  zoomDelta = 0
  return d
}

function onWheel(e: WheelEvent) {
  zoomDelta += Math.sign(e.deltaY) * 1.1
}

/** unified movement vector, camera-relative intent (y+ = forward).
 *  SILK II: shared scratch, same single-frame-ownership law as consumeLook. */
const MOVE_SCRATCH: { x: number; y: number; sprint: boolean } = { x: 0, y: 0, sprint: false }
export function readMoveInput(): { x: number; y: number; sprint: boolean } {
  let x: number
  let y: number
  if (joyActive) {
    x = joy.x
    y = joy.y
  } else {
    let kx = 0
    let ky = 0
    if (keys.has('KeyW') || keys.has('ArrowUp')) ky += 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) ky -= 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) kx -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) kx += 1
    const len = Math.hypot(kx, ky)
    x = len > 1 ? kx / len : kx
    y = len > 1 ? ky / len : ky
  }
  MOVE_SCRATCH.x = x
  MOVE_SCRATCH.y = y
  MOVE_SCRATCH.sprint = sprintHeld
  return MOVE_SCRATCH
}

/** one-shot interact request (E / Enter / HUD button) */
export function consumeInteract(): boolean {
  const hit = interactQueued
  interactQueued = false
  return hit
}

/** HUD panels open → freeze walking input without unmounting the scene */
let inputFrozen = false

export function freezeInput(frozen: boolean) {
  inputFrozen = frozen
  if (frozen) {
    joy = { x: 0, y: 0 }
    joyActive = false
    keys.clear()
  }
}

/** panels OR the driver's seat both hold the walking controller still */
export function isInputFrozen(): boolean {
  return inputFrozen || driveActive
}

export function isAttached(): boolean {
  return attached
}

/* ------------------------------ camera modes -------------------------------- */

let camMode: CamMode = 'follow'
let photoMode = false

export function cycleCamMode(): CamMode {
  const i = CAM_MODES.findIndex((m) => m.id === camMode)
  camMode = CAM_MODES[(i + 1) % CAM_MODES.length].id
  return camMode
}

export function setCamMode(mode: CamMode) {
  camMode = mode
}

export function getCamMode(): CamMode {
  return camMode
}

/** photo mode — HUD fades out, the city becomes the picture */
export function togglePhotoMode(): boolean {
  photoMode = !photoMode
  return photoMode
}

export function setPhotoMode(on: boolean) {
  photoMode = on
}

export function isPhotoMode(): boolean {
  return photoMode
}

/* ------------------------- walk measurement + tutorial ------------------------ */

/**
 * Stage 3D increment 2 — presentation MEASURES, the store APPLIES.
 * The player controller reports metres actually walked each frame;
 * the WorldTab settles them into the real needs economy on exit via
 * store.settleWorldWalk(). Nothing here touches money/time directly.
 */
let walkedMeters = 0

export function addWalkDistance(meters: number) {
  if (Number.isFinite(meters) && meters > 0) walkedMeters += meters
}

export function getWalkedMeters(): number {
  return walkedMeters
}

export function resetWalkedMeters() {
  walkedMeters = 0
}

/** the player's last known world position + facing (HUD/minimap read this) */
export const playerPos = { x: 0, z: 0, heading: 0 }

export function reportPlayerPos(x: number, z: number, heading = playerPos.heading) {
  playerPos.x = x
  playerPos.z = z
  playerPos.heading = heading
}

/* --------------------------- one-time onboarding ------------------------------ */

/** tutorial progress flags — the HUD drives a 3-step first-visit tour */
const tut = { moved: false, looked: false }

/** called by the input layer itself so ANY input path (touch/keyboard) counts */
function markMoved() {
  tut.moved = true
}

export function getTutProgress(): { moved: boolean; looked: boolean } {
  return { ...tut }
}

export function resetTutProgress() {
  tut.moved = false
  tut.looked = false
}

/* ============================ Stage 5 — drive mode ============================ */

/**
 * Drive-mode handshake between the DOM HUD and the R3F DriveSystem.
 * Nothing here touches money or time — the store's settleDrive stays the
 * only authority; this layer only MEASURES (metres driven, speed feel).
 *
 * Seat protocol: while driving, DriveSystem writes the vehicle's ground
 * position here every frame. The player rig should be hidden (or seated)
 * at that spot — DriveSystem applies it best-effort via the scene graph;
 * if PlayerController is ever given the one-line hook (INTEGRATOR note in
 * the worklog), reading getDriveSeat() after its own position update is
 * the guaranteed version of the same contract.
 */

let driveActive = false
let driveModel: VehicleModel | null = null
let driveMeters = 0
let driveSpeed = 0
let driveStartedAt = 0
let nearVehicle: VehicleModel | null = null
let enterRequest: VehicleModel | null = null
let parkRequest = false

export interface DriveSeat {
  x: number
  y: number
  z: number
  yaw: number
  /** true while the driver is "inside" — rig should be hidden/occupied */
  hide: boolean
}

let driveSeat: DriveSeat | null = null

export function setDriveSeat(seat: DriveSeat | null) {
  driveSeat = seat
}

export function getDriveSeat(): DriveSeat | null {
  return driveSeat
}

/** enter drive mode (or leave it) — also dumps held input so the walking
 *  controller never inherits a stuck joystick from behind the wheel */
export function setDriveActive(on: boolean, model: VehicleModel | null = null) {
  driveActive = on
  driveModel = on ? model : null
  if (on) {
    driveStartedAt = performance.now()
    joy = { x: 0, y: 0 }
    joyActive = false
    keys.clear()
    nearVehicle = null
  } else {
    driveSeat = null
    driveSpeed = 0
  }
}

export function isDriveActive(): boolean {
  return driveActive
}

export function getDriveModel(): VehicleModel | null {
  return driveModel
}

export function addDriveMeters(meters: number) {
  if (Number.isFinite(meters) && meters > 0) driveMeters += meters
}

export function getDriveMeters(): number {
  return driveMeters
}

export function resetDriveMeters() {
  driveMeters = 0
}

export function reportDriveSpeed(speed: number) {
  driveSpeed = speed
}

export function getDriveSpeed(): number {
  return driveSpeed
}

export function getDriveStartedAt(): number {
  return driveStartedAt
}

/** DriveSystem reports which owned vehicle is in walk-up range (null = none) */
export function reportNearVehicle(model: VehicleModel | null) {
  nearVehicle = model
}

export function getNearVehicle(): VehicleModel | null {
  return nearVehicle
}

/** HUD: "Enter {label}" chip or the garage Drive button */
export function requestEnterVehicle(model: VehicleModel) {
  enterRequest = model
}

export function consumeEnterRequest(): VehicleModel | null {
  const m = enterRequest
  enterRequest = null
  return m
}

/** HUD: "Park & Step Out" button (or stop + E) */
export function requestParkVehicle() {
  parkRequest = true
}

export function consumeParkRequest(): boolean {
  const hit = parkRequest
  parkRequest = false
  return hit
}
