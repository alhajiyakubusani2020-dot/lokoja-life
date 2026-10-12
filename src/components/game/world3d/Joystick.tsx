'use client'

/**
 * LOKOJA LIFE — Virtual joystick + sprint button (Stage 3.6)
 * -----------------------------------------------------------
 * A polished analog thumbstick for the lower-left of the world view.
 * It is a DOM overlay ABOVE the WebGL canvas, so its pointer never
 * reaches the camera rig — the player can walk and orbit the camera at
 * the same time (real multitouch, no gesture fighting).
 *
 * Writes into the ONE movement controller (controls.ts); it never moves
 * the character directly. Pointer capture + cancel handling keep input
 * honest when the finger slides off or the OS interrupts the touch.
 */

import { useRef, useState } from 'react'
import { joystickState, sprintButton } from './controls'

interface JoystickProps {
  /** disabled while travelling — the keke is driving */
  disabled?: boolean
}

const RADIUS = 46 // thumb travel in px (the base is 2× this + padding)

export function Joystick({ disabled = false }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null)
  const pointerId = useRef<number | null>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const [engaged, setEngaged] = useState(false)

  const apply = (dx: number, dy: number) => {
    // clamp the knob inside the base circle
    const mag = Math.hypot(dx, dy)
    const clamped = mag > RADIUS ? RADIUS / mag : 1
    const kx = dx * clamped
    const ky = dy * clamped
    setKnob({ x: kx, y: ky })
    // normalized analog input (radius-scaled, dead zone applied downstream)
    joystickState.x = kx / RADIUS
    joystickState.y = -ky / RADIUS // screen up = forward
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || pointerId.current !== null) return
    pointerId.current = e.pointerId
    try {
      baseRef.current?.setPointerCapture(e.pointerId)
    } catch {
      // synthetic pointers cannot be captured — safe to ignore
    }
    setEngaged(true)
    joystickState.active = true
    const rect = baseRef.current?.getBoundingClientRect()
    if (rect) {
      apply(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2))
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return
    const rect = baseRef.current?.getBoundingClientRect()
    if (rect) {
      apply(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2))
    }
  }

  const release = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return
    pointerId.current = null
    try {
      baseRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      // pointer already gone
    }
    setEngaged(false)
    setKnob({ x: 0, y: 0 })
    joystickState.x = 0
    joystickState.y = 0
    joystickState.active = false
  }

  return (
    <div
      ref={baseRef}
      role="application"
      aria-label="Movement joystick"
      className={`pointer-events-auto absolute bottom-[calc(env(safe-area-inset-bottom)+1.1rem)] left-3 select-none touch-none transition-opacity duration-200 ${
        disabled ? 'pointer-events-none opacity-30' : 'opacity-90'
      }`}
      style={{ width: RADIUS * 2 + 26, height: RADIUS * 2 + 26 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      {/* outer base */}
      <div
        className={`absolute inset-0 rounded-full border transition-colors duration-150 ${
          engaged
            ? 'border-white/75 bg-white/30 shadow-[0_4px_18px_rgba(18,26,20,0.25)]'
            : 'border-white/45 bg-black/22'
        } backdrop-blur-[6px]`}
      >
        {/* cross guide */}
        <div className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px -translate-x-1/2 bg-white/18" />
        <div className="absolute top-1/2 left-2.5 h-px w-[calc(100%-1.25rem)] -translate-y-1/2 bg-white/18" />
      </div>
      {/* thumbstick */}
      <div
        className={`absolute left-1/2 top-1/2 rounded-full border shadow-[0_6px_18px_rgba(18,26,20,0.3)] transition-[background-color,border-color] duration-150 ${
          engaged ? 'border-[var(--lko-green)]/70 bg-[var(--lko-surface)]' : 'border-white/70 bg-[var(--lko-surface)]/88'
        }`}
        style={{
          width: 52,
          height: 52,
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      >
        <div
          className={`absolute inset-[9px] rounded-full transition-colors duration-150 ${
            engaged ? 'bg-[var(--lko-green)]' : 'bg-[var(--lko-green)]/75'
          }`}
        />
        {/* direction nub — a quiet affordance, not decoration */}
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85" />
      </div>
    </div>
  )
}

/** Hold-to-run button — the clearly indicated sprint modifier. */
export function SprintButton({ disabled = false }: JoystickProps) {
  const [held, setHeld] = useState(false)

  const press = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.preventDefault()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // ignore synthetic pointer errors
    }
    sprintButton.held = true
    setHeld(true)
  }
  const release = () => {
    sprintButton.held = false
    setHeld(false)
  }

  if (disabled) return null

  return (
    <button
      type="button"
      aria-label={held ? 'Sprinting (hold)' : 'Hold to sprint'}
      aria-pressed={held}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      className={`lko-press pointer-events-auto flex h-[54px] w-[54px] touch-none select-none items-center justify-center rounded-full border lko-glass transition-colors ${
        held
          ? 'border-[var(--lko-gold)] bg-[var(--lko-gold)]/95 text-white'
          : 'border-white/55 text-[var(--lko-ink)]'
      }`}
    >
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="13.5" cy="4.8" r="1.9" />
        <path d="M4.2 9.2 9.8 8l2.6 2.9 3.2 1.2" />
        <path d="m9.8 8-1.6 4.4 2.9 2 .9 4.2" />
        <path d="m12.4 10.9-1.3 4.6-4.1 3.5" />
        <path d="m12.4 13.9 3.5 1 1.6 4" />
      </svg>
    </button>
  )
}
