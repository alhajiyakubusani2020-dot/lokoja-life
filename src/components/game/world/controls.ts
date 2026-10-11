/**
 * LOKOJA LIFE — World Input Controls (Stage 3D)
 * -----------------------------------------------
 * A tiny framework-agnostic input layer shared by the DOM HUD
 * (joystick, buttons) and the R3F player controller (keyboard).
 *
 * - Movement comes from EITHER the virtual joystick (touch) or
 *   WASD/arrow keys (desktop) — joystick wins when engaged.
 * - Look drag: pointer drag anywhere on the look surface.
 * - Interact: E / Enter (keyboard) or the HUD button (touch).
 */

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

/** camera look consumes the accumulated drag delta */
export function consumeLook(): { dx: number; dy: number } {
  const out = { dx: lookDx, dy: lookDy }
  lookDx = 0
  lookDy = 0
  return out
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

/** unified movement vector, camera-relative intent (y+ = forward) */
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
  return { x, y, sprint: sprintHeld }
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

export function isInputFrozen(): boolean {
  return inputFrozen
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
