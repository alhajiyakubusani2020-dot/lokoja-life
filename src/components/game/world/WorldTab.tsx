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
import { getWalkedMeters, resetWalkedMeters, playerPos, setJoystick, isInputFrozen, requestE2eTeleport, setDriveActive, reportDriveSpeed, reportPlayerPos } from './controls'
import {
  boardableNear, myRideState, wheelCrewHandles, wheelFuelEstimate, wheelIsRiding, wheelQueryParkedWhenLive,
  wheelRequestBoard, wheelRequestRefuel, wheelRequestRepair, wheelRequestSeats, wheelRequestUnboard,
  wheelsWitness,
} from '@/game/systems/wheelnet' // W10-b/W10-c — the boarding + tank seams the witness reads
import { useWireStore, wireSendVehicleParkedQuery, wireWalletDeposit } from '@/game/systems/wire'
import { generatePlate } from '@/game/data/vehicles'
import { music, moodForTimeOfDay } from '@/game/systems/music'
import { extrasLive } from '@/game/systems/extras'
import { PATTI_SECRETS } from '@/game/systems/patti'

/** M19 E2E — an honest snapshot of the extras-first state */
function extrasLevelSnapshot() {
  return { level: extrasLive.level, tier: extrasLive.tier }
}
import { sampleFor } from '@/game/systems/perfProbe'
import { getDeviceProfile } from '@/game/systems/device'
import { setDebugScarcity } from '@/game/systems/chaos'
import { setDebugYearDay, festivalForDay, weddingForCycle } from '@/game/systems/calendar'
import { setDebugRiverLevel, riverLevelFor, cutZonesFor } from '@/game/systems/rivers'
import { ALL_DOORS } from '@/game/world3d/schools'
import { BRIDGES } from '@/game/world3d/layout'
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
  /** M7 — the GPU context was evicted (phone memory pressure); the scene rebuilds itself */
  const [glLost, setGlLost] = useState(false)
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
  const handleGlLost = useCallback(() => setGlLost(true), [])
  const handleGlBack = useCallback(() => setGlLost(false), [])

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
  // The api lives in a ref that refreshes EVERY render, so a hook captured
  // earlier always reaches the live closure even across scene swaps.
  const e2eApi = useRef({
    enter: (_id: string) => {},
    scene: () => 'world' as string,
    interior: () => null as string | null,
  })
  useEffect(() => {
    e2eApi.current.enter = (id: string) => enterInterior(id)
    e2eApi.current.scene = () => (interiorId ? 'interior' : 'world')
    e2eApi.current.interior = () => interiorId
  })
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.location.search.includes('e2e=1')) return
    ;(window as unknown as { __lkl: unknown }).__lkl = {
      travel: (id: string) => useGameStore.getState().travel(id, 'walk'),
      pos: () => ({ ...playerPos }),
      /** M23 E2E — teleport the walker to real coordinates (the flora
       *  witness stands next to individual trees; at 1-2 fps headless
       *  capture, walking 40u is not an option) */
      tp: (x: number, z: number) => requestE2eTeleport(x, z),
      stick: (x: number, y: number) => setJoystick(x, y),
      frozen: () => isInputFrozen(),
      doors: () => ALL_DOORS.map((d) => ({ id: d.interiorId, x: d.x, z: d.z })),
      enter: (id: string) => e2eApi.current.enter(id),
      scene: () => e2eApi.current.scene(),
      interior: () => e2eApi.current.interior(),
      /** M1 E2E — advance the world clock honestly through the rest system */
      rest: (kind: 'nap' | 'sleep') => useGameStore.getState().rest(kind),
      /** M1 E2E — the real bridge crossings (deck centres) for the bridge walk */
      bridges: () => BRIDGES.map((b) => ({ x: b.x, z: b.z, len: b.length, w: b.width, cls: b.cls })),
      /** M1 E2E — the current world clock slot (night screenshots) */
      timeOfDay: () => useGameStore.getState().world?.timeOfDay ?? 'morning',
      /** M4 E2E — real-device fps capture: sample fresh frames, return the report */
      fpsReport: (ms?: number) => sampleFor(ms ?? 3000, 'e2e capture'),
      /** M7 E2E — the device law's verdict for THIS device (tier + preset + reasons) */
      deviceProfile: () => {
        const p = getDeviceProfile(useGameStore.getState().settings.graphics)
        return { tier: p.tier, effective: p.effective, setting: p.setting, preset: p.preset, reasons: p.reasons, gl: p.gl }
      },
      /** M7 E2E — context-loss status ('ok' | 'lost' | 'restored') */
      glStatus: () => (window as unknown as Record<string, unknown>).__lklGlStatus ?? 'ok',
      /** M7 E2E — dynamic-resolution governor state */
      dynRes: () => (window as unknown as Record<string, unknown>).__lklDynRes ?? null,
      /** M7 E2E — the tier the 3D scene actually mounted with */
      tier: () => (window as unknown as Record<string, unknown>).__lklTier ?? null,
      /** M6 E2E — force today's sky (storm / harmattan / flood shots must be deterministic) */
      forceWeather: (w: string) => {
        const s = useGameStore.getState()
        if (s.world) useGameStore.setState({ world: { ...s.world, weather: w as import('@/game/types').Weather } })
      },
      forceDrive: (on: boolean, speed?: number, model?: 'okada' | 'keke' | 'taxi' | 'danfo') => {
        // W4 E2E — feeds the REAL HUD pipeline (the same setDriveActive /
        // reportDriveSpeed the DriveSystem calls). Never mutates player cash
        // or world state; lets the speedo cluster be witnessed headless.
        // W10 — the model rides as an arg (defaults danfo, the W4 law).
        setDriveActive(on, model ?? 'danfo')
        reportDriveSpeed(on ? (speed ?? 5.2) : 0)
      },
      driveStep: (dx: number, dz: number) => {
        // W10 E2E — steps the car's SHARED truth along the road: the same
        // reportPlayerPos the real drive loop feeds every frame (the HUD,
        // the minimap, the bodies AND the wheels all read it). The speed is
        // implied honestly: one 0.5u step per 12Hz tick ≈ 6 u/s. Never
        // mutates cash or world state — ?e2e=1 gates this whole hook.
        const p = playerPos
        const nx = p.x + dx
        const nz = p.z + dz
        reportPlayerPos(nx, nz, Math.atan2(dx, dz))
        reportDriveSpeed(Math.hypot(dx, dz) * 12)
      },
      grantRide: (model: 'okada' | 'keke' | 'taxi' | 'danfo', paint?: string) => {
        // W10 E2E — the ownership seam the wire witness needs (the same
        // class of shortcut as forceDrive: the speedo drove without a road;
        // the wheels witness drives without the ₦750k grind). ONE honest
        // OwnedVehicle with a REAL generated plate; the ECONOMY suites own
        // the purchase laws — this hook only puts a lawful key in the hand.
        const s = useGameStore.getState()
        if (!s.player) return false
        if (s.player.vehicles.some((v) => v.model === model)) {
          // already granted this session — just paint it if asked
          if (paint !== undefined) {
            const mine = s.player.vehicles.find((v) => v.model === model)!
            s.setVehicleStyle(mine.id, { paint })
          }
          return true
        }
        const world = s.world
        const vehicle = {
          id: `${model}-e2e-${Date.now().toString(36)}`,
          model,
          plate: generatePlate(model, world?.day ?? 1, s.player.vehicles.length),
          paint: paint ?? '',
          boughtDay: world?.day ?? 1,
        }
        useGameStore.setState({ player: { ...s.player, vehicles: [...s.player.vehicles, vehicle] } })
        return true
      },
      /* ── W10-b E2E — the boarding seams (the same class of honest
       *   shortcut as grantRide: the REAL wire doors run; the witness
       *   reads REALITY — the UI chips click their own testids too) ── */
      boardable: () => boardableNear(playerPos.x, playerPos.z),
      board: (handle: string) => wheelRequestBoard(handle),
      unboard: () => wheelRequestUnboard(),
      seats: (open: boolean) => wheelRequestSeats(open),
      riding: () => wheelIsRiding(),
      ride: () => myRideState(),
      crew: () => wheelCrewHandles(),
      wheels: () => wheelsWitness(),
      queryParked: (x: number, z: number) => wheelQueryParkedWhenLive(x, z),
      parkedProbe: async (x: number, z: number) => {
        const r = await wireSendVehicleParkedQuery(x, z)
        return { ok: r.ok, why: r.why, n: (r.parked ?? []).length }
      },
      wireState: () => useWireStore.getState().state,
      /** W10-b E2E — the DMV seams: the REAL store style door (the garage
       * panel's save button runs the same one — the patch rides the wire
       * and the plate-taken refusal reverts, all inside the store) */
      setPlate: (model: string, plate: string) => {
        const st = useGameStore.getState()
        const v = st.player?.vehicles.find((vv) => vv.model === model)
        return v ? st.setVehicleStyle(v.id, { plate }) : false
      },
      myPlate: (model: string) => useGameStore.getState().player?.vehicles.find((vv) => vv.model === model)?.plate ?? null,
      /* ── W10-c E2E — the tank seams (the REAL ledger doors run; the
       *   witness reads REALITY — the UI chips click their own testids) ── */
      refuel: (amount: number) => {
        const p = playerPos
        const st = useGameStore.getState()
        const model = st.player?.vehicles[0]?.model
        return model ? wheelRequestRefuel(model, amount, p.x, p.z) : Promise.resolve({ ok: false, why: 'no-car' })
      },
      repair: () => {
        const p = playerPos
        const st = useGameStore.getState()
        const model = st.player?.vehicles[0]?.model
        return model ? wheelRequestRepair(model, p.x, p.z) : Promise.resolve({ ok: false, why: 'no-car' })
      },
      fuel: () => wheelFuelEstimate(),
      /** W10-c E2E — the purse seam (the deposit door's own honest shortcut,
       *  the grantRide class: the ECONOMY suites own the deposit laws) */
      fund: (amount: number) => wireWalletDeposit(amount, `e2e-fund-${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`),
      /** M8 E2E — the live chaos slice (outage / pool / scarcity bookkeeping) */
      chaos: () => {
        const s = useGameStore.getState()
        return { active: s.chaos.active, day: s.chaos.day, stats: s.chaos.stats }
      },
      /** M8 E2E — force a transformer blowout in a zone (or null to clear) */
      forceChaos: (zoneId?: string) => {
        const s = useGameStore.getState()
        if (!s.world) return
        if (!zoneId) {
          useGameStore.setState({ chaos: { ...s.chaos, active: null } })
          return
        }
        useGameStore.setState({
          chaos: {
            ...s.chaos,
            active: {
              zoneId,
              startedDay: s.world.day,
              minUntilDay: s.world.day + 2,
              pool: 0,
              playerContribDays: [],
            },
          },
        })
      },
      /** M8 E2E — force/clear the cash-scarcity day law (deterministic shots) */
      forceScarcity: (v: boolean) => setDebugScarcity(v),
      /** M10 E2E — force the calendar's year-day reading (1–72; null = the real year) */
      forceYearDay: (n: number | null) => setDebugYearDay(n),
      /** M11 E2E — force the river's level reading (0–1; null = the real season) */
      forceRiver: (v: number | null) => setDebugRiverLevel(v),
      /** M10/M11 E2E — the live calendar + river slices and today's derived laws */
      calendar: () => {
        const s = useGameStore.getState()
        return {
          slice: s.calendar,
          today: s.world ? festivalForDay(s.world.day) : null,
          wedding: s.world ? weddingForCycle(s.world.day) : null,
          yearDay: s.world ? ((s.world.day - 1) % 72) + 1 : 0,
        }
      },
      rivers: () => {
        const s = useGameStore.getState()
        return {
          slice: s.rivers,
          level: s.world ? riverLevelFor(s.world.day) : 0,
          cut: s.world ? cutZonesFor(s.world.day) : [],
        }
      },
      /** M19 E2E — force the day slot (sunset band / dusk shots are deterministic) */
      forceTime: (t: 'morning' | 'afternoon' | 'evening' | 'night') => {
        const s = useGameStore.getState()
        if (s.world) useGameStore.setState({ world: { ...s.world, timeOfDay: t } })
      },
      /** M19 E2E — the polish books (story / hill / wardrobe) for honest asserts */
      m19: () => {
        const s = useGameStore.getState()
        return {
          story: s.story,
          patti: s.patti,
          wardrobe: s.wardrobe,
          settings: s.settings,
          extras: extrasLevelSnapshot(),
          secrets: PATTI_SECRETS.map((p) => ({ id: p.id, x: p.x, z: p.z })),
        }
      },
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

  // M19 — the afro-fusion soundtrack: starts with the world, follows
  // sound × music, and the mood answers the in-world clock. The engine
  // handles mood changes itself (crossfade on the same context).
  const musicOn = useGameStore((s) => s.settings.sound && s.settings.music)
  const tod = useGameStore((s) => s.world?.timeOfDay)
  useEffect(() => {
    music.setEnabled(musicOn)
    if (musicOn) music.start(moodForTimeOfDay(tod ?? 'morning'))
    else music.stop()
    return () => {
      music.stop()
    }
  }, [musicOn])
  useEffect(() => {
    if (musicOn && music.isStarted()) music.setMood(moodForTimeOfDay(tod ?? 'morning'))
  }, [tod, musicOn])

  // M19 — THE HILL'S WHISPER: a 2Hz poll for undiscovered Patti secrets
  // (rides the same cadence as the ambience blend — one cheap distance math
  // per tick, zero React churn unless a secret actually lands)
  const checkPatti = useGameStore((s) => s.checkPatti)
  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return
      checkPatti(playerPos.x, playerPos.z)
    }, 2000)
    return () => clearInterval(id)
  }, [checkPatti])

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
        onContextLost={handleGlLost}
        onContextRestored={handleGlBack}
      />
    )
  }, [
    canWebGL, failed, interiorDef, player.avatar, world.currentLocation, world.timeOfDay, world.weather,
    handleReady, handleAnchor, handleDistrict, handleGist, handleHotspot, handleGlLost, handleGlBack,
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

          {/* M7 — the GPU blinked: calm, honest, temporary */}
          {glLost && ready && (
            <div className="pointer-events-none absolute left-1/2 top-[calc(env(safe-area-inset-top)+14px)] z-30 -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-black/62 px-4 py-2 text-[12px] font-bold text-white backdrop-blur-sm">
                <span aria-hidden className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-400" />
                Screen rebuild — recovering…
              </div>
            </div>
          )}

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
