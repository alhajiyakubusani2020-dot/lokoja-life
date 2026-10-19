'use client'

/**
 * LOKOJA LIFE — M24 W9: THE STAGE CAPTURE (the world's own broadcast tap)
 * ----------------------------------------------------------------------
 * ONE additive component inside the world's Canvas — the W2 doctrine
 * (RemoteWalkers: one import, one JSX line, the world never knows).
 *
 * THE LAW IT SERVES: a WebGL canvas without preserveDrawingBuffer hands
 * captureStream a CLEARED buffer the moment compositing ends — the silent
 * black stage. This tap binds the world's own canvas to stagenet (the POV
 * hook) and pumps requestFrame() from R3F's addAfterEffect — the SAME task
 * that just drew the frame, so the buffer is alive. It renders nothing,
 * moves nothing, costs nothing when nobody is on air (the pump returns
 * before touching anything unless a stage is pumping).
 */

import { useEffect } from 'react'
import { useThree, addAfterEffect } from '@react-three/fiber'
import { stageBindCanvas, stagePump } from '@/game/systems/stagenet'

export function StageCapture() {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    stageBindCanvas(gl.domElement)
    const unsubscribe = addAfterEffect(() => {
      stagePump()
    })
    return () => {
      unsubscribe()
      stageBindCanvas(null)
    }
  }, [gl])
  return null
}
