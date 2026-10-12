'use client'

/**
 * LOKOJA LIFE — Camera rig (Stage 3.5)
 * -------------------------------------
 * Two exploration modes over ONE smooth damped rig:
 *   • follow — orbits the player avatar (default; drag to orbit,
 *     pinch/scroll to zoom)
 *   • free   — pans across the whole city (drag to pan, pinch to zoom,
 *     two-finger drag to orbit)
 * Works with touch and mouse, clamps to the city bounds, and keeps the
 * camera above the terrain so the hills never swallow the view.
 *
 * The rig state lives at module scope (one canvas exists at a time), the
 * standard pattern for imperative three.js state.
 */

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { terrainHeight, WORLD_BOUNDS } from '@/game/systems/terrain'
import { playerPos, camState } from './controls'

export type CameraMode = 'follow' | 'free'

interface RigState {
  mode: CameraMode
  theta: number // azimuth
  phi: number // polar angle from vertical (0.2 = near top-down)
  dist: number
  target: THREE.Vector3
  // goal values the inputs nudge; smoothed every frame
  gTheta: number
  gPhi: number
  gDist: number
  gTarget: THREE.Vector3
}

const FOLLOW_OFFSET_Y = 2
const ZOOM = { followMin: 10, followMax: 70, freeMin: 24, freeMax: 190 }

/**
 * The one rig — imperative camera state, mutated by input + frame loop.
 * Stage 3.6: follow mode chases the PLAYER's real position (walking or
 * riding), not a district anchor — walking down a street feels like
 * walking down a street.
 */
const rig: RigState = {
  mode: 'follow',
  theta: Math.PI * 0.9,
  phi: 0.98,
  dist: 46,
  target: new THREE.Vector3(0, 0, 88),
  gTheta: Math.PI * 0.9,
  gPhi: 0.98,
  gDist: 46,
  gTarget: new THREE.Vector3(0, 0, 88),
}

export function CameraRig({ mode, focusKey }: { mode: CameraMode; focusKey: string }) {
  const { camera } = useThree()

  // mode switches adjust zoom limits gently
  const prevMode = useRef<CameraMode | null>(null)
  useEffect(() => {
    if (prevMode.current !== null && prevMode.current !== mode) {
      rig.gDist =
        mode === 'follow'
          ? THREE.MathUtils.clamp(rig.gDist, ZOOM.followMin, ZOOM.followMax)
          : THREE.MathUtils.clamp(rig.gDist, ZOOM.freeMin, ZOOM.freeMax)
    }
    prevMode.current = mode
    rig.mode = mode
  }, [mode])

  // re-anchor when the followed thing changes (arrival after travel)
  const prevKey = useRef<string | null>(null)
  useEffect(() => {
    if (prevKey.current !== null && prevKey.current !== focusKey) {
      rig.gTarget.set(playerPos.x, 0, playerPos.z)
    }
    prevKey.current = focusKey
  }, [focusKey])

  /* --------------------------------- input --------------------------------- */

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinchDist = useRef(0)
  const dragMode = useRef<'none' | 'orbit' | 'pan'>('none')

  useEffect(() => {
    const canvas = document.getElementById('lko-world-canvas')?.querySelector('canvas') ?? null
    if (!canvas) return

    const onDown = (ev: PointerEvent) => {
      try {
        canvas.setPointerCapture?.(ev.pointerId)
      } catch {
        // synthetic/foreign pointer ids have no active pointer — safe to ignore
      }
      pointers.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY })
      if (pointers.current.size === 1) {
        dragMode.current = rig.mode === 'follow' ? 'orbit' : 'pan'
      } else if (pointers.current.size === 2) {
        dragMode.current = 'orbit'
        const [a, b] = [...pointers.current.values()]
        pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y)
      }
    }

    const onMove = (ev: PointerEvent) => {
      const prev = pointers.current.get(ev.pointerId)
      if (!prev) return
      const dx = ev.clientX - prev.x
      const dy = ev.clientY - prev.y
      pointers.current.set(ev.pointerId, { x: ev.clientX, y: ev.clientY })

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (pinchDist.current > 0) {
          const ratio = pinchDist.current / Math.max(1, d)
          const min = rig.mode === 'follow' ? ZOOM.followMin : ZOOM.freeMin
          const max = rig.mode === 'follow' ? ZOOM.followMax : ZOOM.freeMax
          rig.gDist = THREE.MathUtils.clamp(rig.gDist * ratio, min, max)
        }
        pinchDist.current = d
        // two-finger drag orbits in both modes
        rig.gTheta -= dx * 0.006
        rig.gPhi = THREE.MathUtils.clamp(rig.gPhi - dy * 0.004, 0.28, 1.32)
        return
      }

      if (dragMode.current === 'orbit') {
        rig.gTheta -= dx * 0.0065
        rig.gPhi = THREE.MathUtils.clamp(rig.gPhi - dy * 0.0042, 0.28, 1.32)
      } else if (dragMode.current === 'pan' && rig.mode === 'free') {
        // pan on the XZ plane, scaled by zoom so it feels 1:1
        const scale = rig.gDist * 0.0016
        const sin = Math.sin(rig.gTheta)
        const cos = Math.cos(rig.gTheta)
        rig.gTarget.x = THREE.MathUtils.clamp(rig.gTarget.x + (dx * cos - dy * sin) * scale, WORLD_BOUNDS.minX - 30, WORLD_BOUNDS.maxX + 30)
        rig.gTarget.z = THREE.MathUtils.clamp(rig.gTarget.z + (-dx * sin - dy * cos) * scale, WORLD_BOUNDS.minZ - 30, WORLD_BOUNDS.maxZ + 30)
      }
    }

    const onUp = (ev: PointerEvent) => {
      pointers.current.delete(ev.pointerId)
      if (pointers.current.size < 2) pinchDist.current = 0
      if (pointers.current.size === 0) dragMode.current = 'none'
      else if (pointers.current.size === 1) dragMode.current = rig.mode === 'follow' ? 'orbit' : 'pan'
    }

    const onWheel = (ev: WheelEvent) => {
      ev.preventDefault()
      const min = rig.mode === 'follow' ? ZOOM.followMin : ZOOM.freeMin
      const max = rig.mode === 'follow' ? ZOOM.followMax : ZOOM.freeMax
      rig.gDist = THREE.MathUtils.clamp(rig.gDist * (1 + Math.sign(ev.deltaY) * 0.09), min, max)
    }

    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [])

  /** external "find me" pulse — re-anchors onto the player */
  useEffect(() => {
    const handler = () => {
      rig.gTarget.set(playerPos.x, 0, playerPos.z)
    }
    window.addEventListener('lko-world-focus', handler)
    return () => window.removeEventListener('lko-world-focus', handler)
  }, [])

  /* --------------------------------- frame --------------------------------- */

  const camPos = useRef(new THREE.Vector3(60, 60, 140))

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.1)
    const k = 1 - Math.exp(-dt * 7)

    // share the camera azimuth with the movement controller (one source)
    camState.theta = rig.theta

    if (rig.mode === 'follow') {
      rig.gTarget.x += (playerPos.x - rig.gTarget.x) * (1 - Math.exp(-dt * 4.5))
      rig.gTarget.z += (playerPos.z - rig.gTarget.z) * (1 - Math.exp(-dt * 4.5))
    }

    rig.theta += (rig.gTheta - rig.theta) * k
    rig.phi += (rig.gPhi - rig.phi) * k
    rig.dist += (rig.gDist - rig.dist) * k
    rig.target.lerp(rig.gTarget, k)

    const groundY = Math.max(terrainHeight(rig.target.x, rig.target.z), 1.6)
    const targetY = groundY + FOLLOW_OFFSET_Y

    const sinPhi = Math.sin(rig.phi)
    const cosPhi = Math.cos(rig.phi)
    const x = rig.target.x + rig.dist * sinPhi * Math.sin(rig.theta)
    const z = rig.target.z + rig.dist * sinPhi * Math.cos(rig.theta)
    let y = targetY + rig.dist * cosPhi

    // never dip under the terrain at the camera's own position
    const camGround = terrainHeight(x, z) + 2.2
    if (y < camGround) y = camGround

    camPos.current.lerp(new THREE.Vector3(x, y, z), 1 - Math.exp(-dt * 9))
    camera.position.copy(camPos.current)
    camera.lookAt(rig.target.x, targetY + 1.2, rig.target.z)
  })

  return null
}

/** Convenience: dispatch the "find me" pulse from UI buttons. */
export function focusCameraOnPlayer() {
  window.dispatchEvent(new Event('lko-world-focus'))
}