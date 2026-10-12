'use client'

/**
 * LOKOJA LIFE — World Tab (Stage 3D + INC 4)
 * -------------------------------------------
 * The container that mounts the 3D world: WebGL capability detection,
 * a first-frame loading veil, an error boundary so a failed 3D scene
 * can NEVER take the working 2D game down, and the HUD wiring between
 * the canvas and the store-driven sheets.
 *
 * INC 4 — interiors: the tab owns the exterior ⇄ interior swap with a
 * short fade. Interior state is presentation-only (never in the save);
 * leaving the world always returns you outside.
 *
 * Fallback contract: if the world can't start, the player gets a clear
 * explanation plus working buttons into the Map/Home tabs — the game
 * remains 100% usable without WebGL.
 */

import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { MapIcon, PinIcon } from '../icons'
import { audio } from '@/game/systems/audio'
import { ambience } from '@/game/systems/ambience'
import { INTERIOR_BY_ID } from '@/game/world3d/interiors'
import { getWalkedMeters, resetWalkedMeters, playerPos, setJoystick, isInputFrozen } from './controls'
import { ALL_DOORS } from '@/game/world3d/schools'
import { WorldScene } from './WorldScene'
import { InteriorScene } from './InteriorScene'
import { HudOverlay } from './HudOverlay'
import WardrobePanel from './WardrobePanel'

/* ------------------------------ capability check ------------------------------ */

function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/* -------------------------------- error boundary ------------------------------- */

class WorldErrorBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  constructor(props: { children: ReactNode; onFail: () => void }) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onFail()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/* --------------------------------- fallback UI --------------------------------- */

function WorldFallback({ onExit }: { onExit: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-[#1d2a48] to-[#0e1524] p-6">
      <div className="lko-card w-full max-w-sm p-6 text-center">
        <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--lko-river-soft)] text-[var(--lko-river)]">
          <MapIcon size={26} />
        </span>
        <h2 className="lko-display text-xl">The 3D world can't open here</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]">
          This device or browser couldn't start WebGL, which powers the 3D Lokoja.
          Nothing is lost — the whole game continues on the classic map.
        </p>
        <button
          onClick={() => {
            audio.play('click')
            onExit()
          }}
          className="lko-press mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--lko-green)] text-sm font-extrabold text-white"
        >
          <MapIcon size={17} />
          Continue on the Map
        </button>
      </div>
    </div>
  )
}

/* ----------------------------------- world tab ---------------------------------- */

export function WorldTab({
  onExit,
  onOpenWork,
  onOpenMap,
}: {
  onExit: () => void
  onOpenWork: () => void
  onOpenMap: (locationId: string) => void
}) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const soundOn = useGameStore((s) => s.settings.sound)

  const [canWebGL, setCanWebGL] = useState<boolean | null>(() =>
    typeof document === 'undefined' ? null : webglAvailable(),
  )
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [nearest, setNearest] = useState<string | null>(null)
  const [district, setDistrict] = useState<string | null>(null)
  const [gistNpc, setGistNpc] = useState<string | null>(null)

  // INC 4 — interior mode (presentation-only state, never in the save)
  const [interiorId, setInteriorId] = useState<string | null>(null)
  const [hotspot, setHotspot] = useState<string | null>(null)
  const [fade, setFade] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const handleReady = useCallback(() => setReady(true), [])
  const handleFail = useCallback(() => setFailed(true), [])
  const handleAnchor = useCallback((id: string | null) => setNearest(id), [])
  const handleDistrict = useCallback((id: string | null) => setDistrict(id), [])
  const handleGist = useCallback((id: string | null) => setGistNpc(id), [])
  const handleHotspot = useCallback((id: string | null) => setHotspot(id), [])

  // fade out → swap scene → fade back in
  const swapTo = useCallback((id: string | null) => {
    setFade(true)
    setNearest(null)
    setHotspot(null)
    timers.current.push(
      setTimeout(() => {
        setInteriorId(id)
        setReady(false)
      }, 240),
    )
    timers.current.push(setTimeout(() => setFade(false), 620))
  }, [])

  const enterInterior = useCallback(
    (id: string) => {
      if (!INTERIOR_BY_ID[id] || interiorId) return
      audio.play('chime')
      swapTo(id)
    },
    [interiorId, swapTo],
  )

  // E2E TEST HOOK — active ONLY when the URL carries ?e2e=1. Gives the
  // automated browser a honest steering wheel (travel / position / stick /
  // door list) because driving a follow-cam world blind with synthetic
  // keystrokes is impractical. Normal play never touches this.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.location.search.includes('e2e=1')) return
    ;(window as unknown as { __lkl: unknown }).__lkl = {
      travel: (id: string) => useGameStore.getState().travel(id, 'walk'),
      pos: () => ({ ...playerPos }),
      stick: (x: number, y: number) => setJoystick(x, y),
      frozen: () => isInputFrozen(),
      doors: () => ALL_DOORS.map((d) => ({ id: d.interiorId, x: d.x, z: d.z })),
      enter: (id: string) => enterInterior(id),
      scene: () => (interiorId ? 'interior' : 'world'),
    }
    return () => {
      delete (window as unknown as { __lkl?: unknown }).__lkl
    }
  }, [enterInterior, interiorId])

  const exitInterior = useCallback(() => {
    if (!interiorId) return
    audio.play('click')
    swapTo(null)
  }, [interiorId, swapTo])

  // clear any pending swap timers on unmount
  useEffect(() => {
    const t = timers.current
    return () => t.forEach(clearTimeout)
  }, [])

  // procedural ambience — starts with the world, follows the sound setting
  useEffect(() => {
    ambience.setEnabled(soundOn)
    if (soundOn) ambience.start()
    return () => ambience.stop()
  }, [soundOn])

  // settle walking energy no matter HOW the world closes (Exit path resets to
  // zero first, so this only ever catches abnormal unmounts — 0 m is a no-op)
  const settleWalk = useGameStore((s) => s.settleWorldWalk)
  useEffect(() => {
    return () => {
      settleWalk(getWalkedMeters())
      resetWalkedMeters()
    }
  }, [settleWalk])

  // keep the "leave world" action reliable even if the scene died
  const exit = useCallback(() => {
    audio.play('click')
    onExit()
  }, [onExit])

  const interiorDef = interiorId ? INTERIOR_BY_ID[interiorId] ?? null : null

  const scene = useMemo(() => {
    if (canWebGL !== true || failed) return null
    if (interiorDef) {
      return (
        <InteriorScene
          def={interiorDef}
          avatar={player.avatar}
          timeOfDay={world.timeOfDay}
          onReady={handleReady}
          onHotspot={handleHotspot}
        />
      )
    }
    return (
      <WorldScene
        avatar={player.avatar}
        currentLocationId={world.currentLocation}
        timeOfDay={world.timeOfDay}
        weather={world.weather}
        onReady={handleReady}
        onNearestAnchor={handleAnchor}
        onDistrict={handleDistrict}
        onGist={handleGist}
      />
    )
  }, [
    canWebGL, failed, interiorDef, player.avatar, world.currentLocation, world.timeOfDay, world.weather,
    handleReady, handleAnchor, handleDistrict, handleGist, handleHotspot,
  ])

  return (
    <div className="fixed inset-0 z-30 bg-[#0e1524]" aria-label="3D Lokoja world">
      {/* WebGL missing → honest fallback, game continues elsewhere */}
      {canWebGL === false || failed ? (
        <WorldFallback onExit={onExit} />
      ) : (
        <>
          <WorldErrorBoundary onFail={handleFail}>{scene}</WorldErrorBoundary>

          {/* loading veil — disappears at the first rendered frame */}
          {!ready && !fade && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#f6d489] via-[#e8a355] to-[#1c6b5e]">
              <div className="lko-float flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--lko-surface)] shadow-[var(--lko-shadow-lg)]">
                <PinIcon size={26} className="text-[var(--lko-green)]" />
              </div>
              <p className="lko-display text-xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                {interiorId ? 'Stepping inside…' : 'Entering Lokoja…'}
              </p>
              <p className="text-[12px] font-semibold text-white/85">
                {interiorId ? 'Opening the door' : 'Building the confluence, Mount Patti and your streets'}
              </p>
            </div>
          )}

          {/* scene swap fade */}
          <div
            className={`pointer-events-none absolute inset-0 z-20 bg-[#100e0a] transition-opacity duration-300 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden
          />

          {/* the HUD */}
          {ready && !failed && (
            <HudOverlay
              nearestAnchor={interiorId ? null : nearest}
              district={district}
              gistNpc={gistNpc}
              interior={interiorDef}
              hotspot={hotspot}
              onExit={exit}
              onOpenWork={onOpenWork}
              onOpenMap={onOpenMap}
              onEnterInterior={enterInterior}
              onExitInterior={exitInterior}
            />
          )}

          {/* STAGE 5 — wardrobe (interior hotspot rings the bus; panel lives here) */}
          <WardrobePanel />
        </>
      )}
    </div>
  )
}
