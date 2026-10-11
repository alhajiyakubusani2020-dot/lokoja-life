'use client'

/**
 * LOKOJA LIFE — World HUD (Stage 3D)
 * -----------------------------------
 * The DOM layer floating over the 3D canvas: R1-styled status chips,
 * the virtual joystick + sprint + interact controls (touch), drag-look
 * surface, the contextual interact prompt, and the two bottom sheets —
 * the location activities panel (real actions) and the travel sheet
 * (real fares from the EXISTING travel system).
 *
 * No economy logic lives here: sheets call store.travel / store.rest and
 * display values computed by systems/travel.calculateTravel.
 */

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { LOCATION_BY_ID, type LokojaLocation } from '@/game/data/locations'
import { NPCS } from '@/game/data/npcs'
import { HUSTLES } from '@/game/data/hustles'
import { WORLD3D, FOOD } from '@/game/data/config'
import { ANCHORS, POINTS_OF_INTEREST } from '@/game/world3d/layout'
import { calculateTravel } from '@/game/systems/travel'
import { formatNaira } from '@/game/systems/progression'
import type { TransportId } from '@/game/types'
import { audio } from '@/game/systems/audio'
import {
  ArrowLeftIcon, CheckIcon, ClockIcon, CoinsIcon, EnergyIcon, KekeIcon,
  LockIcon, MapIcon, MoonIcon, PinIcon, PlaceIcon, TaxiIcon, WalkIcon,
  WeatherIcon, WorkIcon, TimeIcon,
} from '../icons'
import {
  attachControls, consumeInteract, cycleCamMode, freezeInput, getCamMode, getTutProgress,
  getWalkedMeters, isPhotoMode, playerPos, queueInteract, resetTutProgress, resetWalkedMeters,
  setJoystick, setPhotoMode, setSprint, togglePhotoMode, CAM_MODES,
} from './controls'

const TRANSPORT_ICON: Record<TransportId, (p: { size?: number }) => React.ReactNode> = {
  walk: (p) => <WalkIcon {...p} />,
  keke: (p) => <KekeIcon {...p} />,
  taxi: (p) => <TaxiIcon {...p} />,
}

/** anchors AND physical props (job boards) resolve to a real location panel */
function resolveAnchorLoc(id: string): LokojaLocation | null {
  if (id.startsWith('poi:')) {
    const poi = POINTS_OF_INTEREST.find((p) => p.id === id.slice(4))
    return poi ? LOCATION_BY_ID[poi.locationId] ?? null : null
  }
  return LOCATION_BY_ID[id] ?? null
}

/* --------------------------------- joystick --------------------------------- */

function Joystick() {
  const base = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const active = useRef(false)

  const setKnob = (dx: number, dy: number) => {
    if (knob.current) knob.current.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const handle = (e: React.PointerEvent) => {
    const el = base.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    let dx = e.clientX - cx
    let dy = e.clientY - cy
    const max = r.width / 2 - 14
    const len = Math.hypot(dx, dy)
    if (len > max) {
      dx = (dx / len) * max
      dy = (dy / len) * max
    }
    setKnob(dx, dy)
    // screen up = forward
    setJoystick(dx / max, -dy / max)
  }

  return (
    <div
      ref={base}
      className="pointer-events-auto absolute bottom-5 left-4 h-[118px] w-[118px] touch-none rounded-full border border-white/25 bg-black/25 backdrop-blur-sm"
      style={{ boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.35)' }}
      role="application"
      aria-label="Movement joystick"
      onPointerDown={(e) => {
        try {
          e.currentTarget.setPointerCapture(e.pointerId)
        } catch {
          /* synthetic/test pointers have no active capture target */
        }
        active.current = true
        handle(e)
      }}
      onPointerMove={(e) => {
        if (active.current) handle(e)
      }}
      onPointerUp={() => {
        active.current = false
        setKnob(0, 0)
        setJoystick(0, 0)
      }}
      onPointerCancel={() => {
        active.current = false
        setKnob(0, 0)
        setJoystick(0, 0)
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={knob}
          className="h-12 w-12 rounded-full border border-white/40 bg-white/85 shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-transform duration-75"
        />
      </div>
    </div>
  )
}

/* --------------------------------- minimap --------------------------------- */

/**
 * North-up live minimap: every location anchor as a tinted dot, the player
 * as a heading arrow, the rivers as faint strokes. Polls the input layer's
 * playerPos at ~8 Hz (zero React work in the 3D frame loop).
 */
function MiniMap({ discovered }: { discovered: Set<string> }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => setTick((t) => t + 1), 125)
    return () => clearInterval(iv)
  }, [])
  void tick

  // world (±160) → minimap viewbox (0..44)
  const toMap = (v: number) => 22 + (v / 160) * 21
  const px = toMap(Math.max(-160, Math.min(160, playerPos.x)))
  const pz = toMap(Math.max(-160, Math.min(160, playerPos.z)))
  // heading: world yaw 0 faces +z (south) — minimap up is north (-z)
  const headingDeg = (Math.atan2(Math.sin(playerPos.heading), -Math.cos(playerPos.heading)) * 180) / Math.PI

  return (
    <div className="pointer-events-none rounded-full border border-white/25 bg-black/40 shadow-[var(--lko-shadow-md)] backdrop-blur-md">
      <svg viewBox="0 0 44 44" className="h-[74px] w-[74px] sm:h-[92px] sm:w-[92px]" role="img" aria-label="Live minimap of Lokoja">
        <defs>
          <radialGradient id="lkoMiniLand" cx="0.5" cy="0.55" r="0.72">
            <stop offset="0" stopColor="#8a9a5e" stopOpacity="0.9" />
            <stop offset="1" stopColor="#6d7d47" stopOpacity="0.9" />
          </radialGradient>
        </defs>
        <circle cx="22" cy="22" r="21" fill="url(#lkoMiniLand)" />
        {/* rivers — faint north-up traces */}
        <path d="M 1 6 C 8 6.8 14 8 22 7.8 C 28 7.7 31 7.6 34.3 7.5" stroke="#3d9481" strokeWidth="1.6" fill="none" opacity="0.85" />
        <path d="M 43 6.9 C 38 7 35 7.4 34.3 7.5" stroke="#3d9481" strokeWidth="1.4" fill="none" opacity="0.85" />
        <path d="M 34.3 7.5 C 35.2 10.5 35.9 14 36.2 18 C 36.6 24 36 30 35.5 35 C 35.2 39 35.1 41.5 35 43.5" stroke="#2f8fa0" strokeWidth="1.9" fill="none" opacity="0.85" />
        {/* Mount Patti mass */}
        <ellipse cx="9.9" cy="14.9" rx="6.4" ry="5.6" fill="#4C7A2E" opacity="0.8" />
        {/* anchors */}
        {ANCHORS.map((a) => (
          <circle
            key={a.id}
            cx={toMap(a.x)}
            cy={toMap(a.z)}
            r={a.id === 'mount-patti' || a.id === 'confluence' ? 1.5 : 1.3}
            fill={discovered.has(a.id) ? a.location.color : 'rgba(255,255,255,0.55)'}
            stroke="rgba(0,0,0,0.45)"
            strokeWidth="0.3"
          />
        ))}
        {/* player arrow */}
        <g transform={`translate(${px} ${pz}) rotate(${headingDeg})`}>
          <path d="M 0 -2.6 L 1.7 2 L 0 0.9 L -1.7 2 Z" fill="#ffd88a" stroke="rgba(0,0,0,0.5)" strokeWidth="0.3" />
        </g>
        {/* N marker */}
        <text x="21" y="3.4" fontSize="3" fontWeight="800" fill="rgba(255,255,255,0.9)" textAnchor="middle">N</text>
      </svg>
    </div>
  )
}

/* ------------------------------ district discovery ------------------------------ */

/** load discovered districts (session-spanning, NOT part of the save) */
function loadDiscovered(): Set<string> {
  try {
    const raw = localStorage.getItem(WORLD3D.discoveryKey)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {
    /* storage unavailable — discovery just resets */
  }
  return new Set()
}

function persistDiscovered(set: Set<string>) {
  try {
    localStorage.setItem(WORLD3D.discoveryKey, JSON.stringify([...set]))
  } catch {
    /* ignore */
  }
}

/* ------------------------------- world HUD root ------------------------------ */

type PanelState =
  | { kind: 'none' }
  | { kind: 'activities'; loc: LokojaLocation }
  | { kind: 'travel'; loc: LokojaLocation }

export function HudOverlay({
  nearestAnchor,
  district,
  gistNpc,
  onExit,
  onOpenWork,
  onOpenMap,
}: {
  /** anchor or `poi:` prop currently in interact range (from the 3D scene), null = none */
  nearestAnchor: string | null
  /** district the player is inside right now (drives arrival toasts) */
  district: string | null
  /** nearest named NPC's registry id (drives the gist chip), null = none */
  gistNpc: string | null
  onExit: () => void
  onOpenWork: () => void
  onOpenMap: (locationId: string) => void
}) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const isTravelling = useGameStore((s) => s.isTravelling)
  const travelAction = useGameStore((s) => s.travel)
  const restAction = useGameStore((s) => s.rest)
  const settleWalk = useGameStore((s) => s.settleWorldWalk)
  const eatAction = useGameStore((s) => s.eatMeal)

  const surfaceRef = useRef<HTMLDivElement>(null)
  const nearestRef = useRef<string | null>(null)
  const [panel, setPanel] = useState<PanelState>({ kind: 'none' })

  /* ----------------------- views: camera modes + photo mode ----------------------- */

  const [camMode, setCamModeState] = useState(getCamMode())
  const [photo, setPhoto] = useState(false)

  const togglePhoto = () => {
    const next = togglePhotoMode() // the input layer owns the flag
    setPhoto(next)
    audio.play(next ? 'click' : 'chime')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyV' && !e.repeat) {
        const tag = (e.target as HTMLElement | null)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        togglePhoto()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // keep the polling loop's view of the nearest anchor fresh (ref write in effect)
  useEffect(() => {
    nearestRef.current = nearestAnchor
  }, [nearestAnchor])

  /* --------------------------- one-time onboarding --------------------------- */

  // lazy init — the tour shows on every first visit (per device, not in the save)
  const [tutStep, setTutStep] = useState<number | null>(() => {
    resetTutProgress()
    if (typeof document === 'undefined') return null
    try {
      return localStorage.getItem(WORLD3D.onboardingKey) === '1' ? null : 0
    } catch {
      return 0
    }
  })
  const tutStepRef = useRef<number | null>(null)
  useEffect(() => {
    tutStepRef.current = tutStep
  }, [tutStep])

  const finishTut = () => {
    try {
      localStorage.setItem(WORLD3D.onboardingKey, '1')
    } catch {
      /* storage unavailable — the tour just shows again next visit */
    }
    audio.play('chime')
    setTutStep(null)
  }

  /* ---------------------------- arrival toasts + discovery ----------------------------- */

  const [arrival, setArrival] = useState<string | null>(null)
  const [discovered, setDiscovered] = useState<Set<string>>(() => loadDiscovered())
  const discoveredRef = useRef<Set<string>>(discovered)
  const seenDistricts = useRef<Set<string>>(new Set())
  const arrivalTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const districtRef = useRef<string | null>(null)
  const lastDistrictRef = useRef<string | null>(null)
  useEffect(() => {
    districtRef.current = district
  }, [district])

  /** record a newly visited district into session-spanning discovery */
  const discover = (id: string) => {
    if (discoveredRef.current.has(id)) return false
    const next = new Set(discoveredRef.current)
    next.add(id)
    discoveredRef.current = next
    setDiscovered(next)
    persistDiscovered(next)
    return true
  }

  /* ------------------------------- gist chip ------------------------------- */

  const [dismissedGists, setDismissedGists] = useState<Set<string>>(() => new Set())
  const npcDef = gistNpc ? NPCS.find((n) => n.id === gistNpc) ?? null : null
  const npcHustle = gistNpc ? HUSTLES.find((h) => h.npcId === gistNpc) ?? null : null
  const gistVisible =
    npcDef !== null && npcHustle !== null && !dismissedGists.has(npcDef.id) && panel.kind === 'none' && !isTravelling

  const isTouchDevice = () =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0)
  const [touchMode, setTouchMode] = useState(isTouchDevice)

  useEffect(() => {
    // pointer capability can change (detachable keyboards); keep it fresh
    const mq = window.matchMedia('(pointer: coarse)')
    const onChange = () => {
      if (mq.matches) setTouchMode(true)
    }
    mq.addEventListener?.('change', onChange)
    // some WebViews/hybrids never report coarse — the first real touch proves it
    const onTouch = () => setTouchMode(true)
    window.addEventListener('touchstart', onTouch, { once: true, passive: true })
    return () => {
      mq.removeEventListener?.('change', onChange)
      window.removeEventListener('touchstart', onTouch)
    }
  }, [])

  // look-drag + keyboard wiring on the full-screen surface
  useEffect(() => {
    const el = surfaceRef.current
    if (!el) return
    return attachControls(el)
  }, [])

  // interact polling (E / Enter / HUD button) + Escape closes sheets + tour steps
  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (consumeInteract() && nearestRef.current) {
        const anchorId = nearestRef.current
        const loc = resolveAnchorLoc(anchorId)
        if (loc) {
          audio.play('click')
          setPanel({ kind: loc.id === world.currentLocation ? 'activities' : 'travel', loc })
        }
      }
      // onboarding auto-advance — the tour watches the REAL input layer
      const step = tutStepRef.current
      if (step !== null) {
        const tp = getTutProgress()
        if (step === 0 && tp.moved) {
          tutStepRef.current = 1
          setTutStep(1)
        } else if (step === 1 && tp.looked) {
          tutStepRef.current = 2
          setTutStep(2)
        } else if (step === 2 && nearestRef.current) {
          tutStepRef.current = 3
          setTutStep(3)
        }
      }
      // arrival toast — first entry each session + persistent discovery
      const distNow = districtRef.current
      if (distNow && distNow !== lastDistrictRef.current) {
        lastDistrictRef.current = distNow
        const fresh = discover(distNow)
        if (!seenDistricts.current.has(distNow)) {
          const loc = LOCATION_BY_ID[distNow]
          if (loc) {
            seenDistricts.current.add(distNow)
            setArrival(fresh ? `${loc.name} — new place discovered!` : loc.name)
            if (arrivalTimer.current) clearTimeout(arrivalTimer.current)
            arrivalTimer.current = setTimeout(() => setArrival(null), fresh ? 3000 : 2600)
            if (fresh) audio.play('chime')
          }
        }
      }
      // camera mode can change from the input layer (C key) — keep the chip honest
      const cm = getCamMode()
      setCamModeState((prev) => (prev === cm ? prev : cm))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setPanel({ kind: 'none' })
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
    }
  }, [world.currentLocation])

  // freeze walking while a sheet is open
  useEffect(() => {
    freezeInput(panel.kind !== 'none' || isTravelling)
  }, [panel, isTravelling])

  const openPanelFor = (anchorId: string | null) => {
    if (!anchorId) return
    const loc = resolveAnchorLoc(anchorId)
    if (!loc) return
    audio.play('click')
    setPanel({ kind: loc.id === world.currentLocation ? 'activities' : 'travel', loc })
  }

  const currentLoc = LOCATION_BY_ID[world.currentLocation]
  const promptLoc = nearestAnchor ? resolveAnchorLoc(nearestAnchor) : null
  const promptAnchor = nearestAnchor
  const isPoiPrompt = !!promptAnchor?.startsWith('poi:')

  return (
    <div className="pointer-events-none absolute inset-0 select-none" style={{ zIndex: 30 }}>
      {/* drag-look surface (below HUD controls, above canvas) */}
      <div ref={surfaceRef} className="pointer-events-auto absolute inset-0 touch-none" aria-hidden />

      {/* travelling pulse */}
      {isTravelling && (
        <div className="lko-scrim pointer-events-none absolute inset-0 flex items-center justify-center bg-[#f6d489]/12">
          <p className="lko-display flex items-center gap-2 rounded-full bg-black/45 px-5 py-2.5 text-lg text-white backdrop-blur-sm">
            <KekeIcon size={22} /> Travelling…
          </p>
        </div>
      )}

      {/* ---------- top bar ---------- */}
      <div className={`absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] transition-opacity duration-300 ${photo ? 'pointer-events-none opacity-0' : 'opacity-100'}`}>
        <div className="pointer-events-auto flex min-w-0 items-center gap-2">
          <button
            onClick={() => {
              audio.play('click')
              // settle the visit's walking into the real needs economy
              settleWalk(getWalkedMeters())
              resetWalkedMeters()
              onExit()
            }}
            aria-label="Leave the 3D world"
            className="lko-press flex h-10 items-center gap-1.5 rounded-full bg-black/40 px-3.5 text-[13px] font-extrabold text-white backdrop-blur-md"
          >
            <ArrowLeftIcon size={15} />
            Exit
          </button>
          <span className="flex min-w-0 items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
            <PlaceIcon id={currentLoc.id} size={14} className="shrink-0 text-[#ffd88a]" />
            <span className="truncate text-[13px] font-extrabold text-white">{currentLoc.name}</span>
          </span>
        </div>

        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-black/40 px-3 py-1.5 text-[12px] font-extrabold text-white backdrop-blur-md">
            <CoinsIcon size={13} className="shrink-0 text-[#ffd88a]" />
            <span className="lko-num">{formatNaira(player.cash)}</span>
          </span>
          <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-1.5 text-[10.5px] font-bold text-white backdrop-blur-md">
            <span className="flex items-center gap-1">
              <TimeIcon name={world.timeOfDay} size={11} className="shrink-0 text-[#ffd88a]" />
              Day {world.day}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <ClockIcon size={11} className="shrink-0 text-[#ffd88a]" />
              {world.timeOfDay}
            </span>
            <span className="flex items-center gap-1">
              <WeatherIcon name={world.weather} size={11} className="shrink-0 text-[#ffd88a]" />
              {world.weather === 'night-clear' ? 'Clear' : world.weather.charAt(0).toUpperCase() + world.weather.slice(1)}
            </span>
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-1 text-[10.5px] font-bold text-white/90 backdrop-blur-md">
            <PinIcon size={10} className="shrink-0 text-[#ffd88a]" />
            {discovered.size}/{ANCHORS.length} places found
          </span>
          {/* view mode + photo mode */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                audio.play('click')
                cycleCamMode()
                setCamModeState(getCamMode())
              }}
              aria-label="Cycle camera view (C)"
              title="Cycle view — C"
              className="lko-press flex h-8 items-center gap-1 rounded-full bg-black/40 px-2.5 text-[10.5px] font-extrabold text-white backdrop-blur-md"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              {CAM_MODES.find((m) => m.id === camMode)?.label ?? 'View'}
            </button>
            <button
              onClick={togglePhoto}
              aria-label="Photo mode (V)"
              title="Photo mode — V"
              className="lko-press flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>
          {/* live minimap — north-up, discovered pins in colour */}
          <MiniMap discovered={discovered} />
        </div>
      </div>

      {/* ---------- photo-mode minimal chrome ---------- */}
      {photo && (
        <div className="pointer-events-auto absolute inset-x-0 top-3 flex justify-center pt-[max(0rem,env(safe-area-inset-top))]">
          <button
            onClick={togglePhoto}
            className="lko-press flex items-center gap-1.5 rounded-full bg-black/45 px-4 py-2 text-[12px] font-extrabold text-white backdrop-blur-md"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Photo mode — tap or press V to exit
          </button>
        </div>
      )}

      {/* ---------- one-time onboarding tour ---------- */}
      {tutStep !== null && (
        <div className="pointer-events-auto absolute inset-x-0 top-[4.9rem] z-10 flex justify-center px-4">
          <div className="lko-pop w-full max-w-sm rounded-2xl border border-white/25 bg-black/55 p-4 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <p className="lko-display text-[15px]">Welcome to Lokoja</p>
              {tutStep < 3 && (
                <button
                  onClick={finishTut}
                  className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-white/85"
                >
                  Skip
                </button>
              )}
            </div>
            {tutStep < 3 ? (
              <>
                <p className="mt-1.5 text-[13px] font-semibold leading-snug text-white/90">
                  {tutStep === 0 &&
                    (touchMode ? 'Drag the left stick to walk around.' : 'Walk with W A S D or the arrow keys.')}
                  {tutStep === 1 &&
                    (touchMode ? 'Drag anywhere on the screen to look around.' : 'Drag with the mouse to look around.')}
                  {tutStep === 2 && 'Walk to a golden pin — press E or tap the pin button.'}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-7 rounded-full transition-colors ${i <= tutStep ? 'bg-[#ffd88a]' : 'bg-white/25'}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="mt-1.5 text-[13px] font-semibold leading-snug text-white/90">
                  You're ready — explore the city, meet people and find work.
                </p>
                <button
                  onClick={finishTut}
                  className="lko-press mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[var(--lko-green)] text-[13px] font-extrabold"
                >
                  Start exploring
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------- district arrival toast ---------- */}
      {arrival && tutStep === null && !photo && (
        <div className="pointer-events-none absolute inset-x-0 top-[4.9rem] flex justify-center px-4">
          <p className="lko-pop flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-[13px] font-extrabold text-white backdrop-blur-md">
            <PinIcon size={14} className="text-[#ffd88a]" />
            Now entering {arrival}
          </p>
        </div>
      )}

      {/* ---------- interact prompt ---------- */}
      {promptLoc && panel.kind === 'none' && !isTravelling && !photo && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10">
          <button
            onClick={() => openPanelFor(promptAnchor)}
            className="lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-black/55 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <PlaceIcon id={promptLoc.id} size={17} className="shrink-0 text-[#ffd88a]" />
            <span className="truncate text-[14px] font-extrabold">
              {isPoiPrompt
                ? `Read the ${promptLoc.name} job board`
                : promptAnchor === world.currentLocation
                  ? `You're at ${promptLoc.name} — tap to see what's here`
                  : `Travel to ${promptLoc.name}`}
            </span>
            {!touchMode && (
              <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold">E</kbd>
            )}
          </button>
        </div>
      )}

      {/* ---------- NPC gist chip (real registry names + real hustle titles) ---------- */}
      {gistVisible && npcDef && npcHustle && !photo && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-52 flex justify-center px-6 sm:bottom-[6.75rem]">
          <div className="lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-black/55 py-2 pl-2 pr-2 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--lko-gold)] text-[16px]">
              {npcDef.emoji}
            </span>
            <span className="min-w-0 pl-1">
              <span className="block truncate text-[13px] font-extrabold leading-tight">{npcDef.name} dey around</span>
              <span className="block max-w-[13.5rem] truncate text-[11px] font-semibold text-white/80 sm:max-w-[18rem]">
                “{npcHustle.title}” — gist dey Work board
              </span>
            </span>
            <button
              onClick={() => {
                audio.play('click')
                onOpenWork()
              }}
              className="lko-press ml-1 flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold"
            >
              <WorkIcon size={15} />
              Work
            </button>
            <button
              aria-label="Dismiss gist"
              onClick={() =>
                setDismissedGists((prev) => {
                  const next = new Set(prev)
                  next.add(npcDef.id)
                  return next
                })
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[12px] font-extrabold text-white/80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ---------- touch controls ---------- */}
      {touchMode && panel.kind === 'none' && !photo && (
        <>
          <Joystick />
          <div className="pointer-events-auto absolute bottom-6 right-4 flex flex-col items-center gap-3">
            <button
              aria-label="Interact"
              onPointerDown={() => queueInteract()}
              className={`lko-press flex h-14 w-14 items-center justify-center rounded-full border text-white backdrop-blur-md ${
                promptAnchor ? 'border-[#ffd88a]/70 bg-[#e8a317]/85 shadow-[0_0_18px_rgba(232,163,23,0.55)]' : 'border-white/25 bg-black/35'
              }`}
            >
              <PinIcon size={22} />
            </button>
            <button
              aria-label="Sprint (hold)"
              onPointerDown={(e) => {
                try {
                  e.currentTarget.setPointerCapture(e.pointerId)
                } catch {
                  /* synthetic pointers */
                }
                setSprint(true)
              }}
              onPointerUp={() => setSprint(false)}
              onPointerCancel={() => setSprint(false)}
              className="lko-press flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/35 text-[11px] font-extrabold text-white backdrop-blur-md"
            >
              RUN
            </button>
          </div>
        </>
      )}

      {/* ---------- bottom sheets ---------- */}
      {panel.kind !== 'none' && (
        <>
          <button
            aria-label="Close panel"
            className="lko-scrim pointer-events-auto absolute inset-0 bg-black/35"
            onClick={() => setPanel({ kind: 'none' })}
          />
          <section
            className="lko-sheet pointer-events-auto absolute inset-x-0 bottom-0 mx-auto w-full max-w-md rounded-t-3xl border-t border-black/[0.08] bg-[var(--lko-surface)] pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[var(--lko-shadow-lg)] sm:max-w-lg"
            role="dialog"
            aria-label={panel.kind === 'travel' ? `Travel to ${panel.loc.name}` : `${panel.loc.name} activities`}
          >
            <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-black/10" aria-hidden />

            {/* header */}
            <div className="flex items-start gap-3 px-5 pt-3">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: panel.loc.color }}
              >
                <PlaceIcon id={panel.loc.id} size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="lko-display truncate text-lg leading-tight">{panel.loc.name}</h2>
                <p className="truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]">
                  “{panel.loc.tagline}”
                </p>
              </div>
              <button
                onClick={() => setPanel({ kind: 'none' })}
                aria-label="Close"
                className="lko-press flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]"
              >
                ✕
              </button>
            </div>

            {panel.kind === 'travel' ? (
              <TravelSheet
                loc={panel.loc}
                onConfirm={(t) => {
                  setPanel({ kind: 'none' })
                  travelAction(panel.loc.id, t)
                }}
              />
            ) : (
              <ActivitiesSheet
                loc={panel.loc}
                onRest={(k) => {
                  setPanel({ kind: 'none' })
                  restAction(k)
                }}
                onEat={(mealKey) => {
                  eatAction(mealKey, panel.loc.id)
                }}
                onOpenWork={() => {
                  setPanel({ kind: 'none' })
                  onOpenWork()
                }}
                onOpenMap={() => {
                  setPanel({ kind: 'none' })
                  onOpenMap(panel.loc.id)
                }}
              />
            )}
          </section>
        </>
      )}

      {/* scene → HUD anchor reports arrive via the nearestAnchor prop */}
    </div>
  )
}

/* ------------------------------- travel sheet -------------------------------- */

function TravelSheet({ loc, onConfirm }: { loc: LokojaLocation; onConfirm: (t: TransportId) => void }) {
  const world = useGameStore((s) => s.world)!
  const origin = LOCATION_BY_ID[world.currentLocation]

  const plans = loc.transport.map((t) => ({
    t,
    plan: calculateTravel(origin, loc, t, world.weather, world.timeOfDay),
  }))

  return (
    <div className="flex flex-col gap-2 px-5 pb-4 pt-3">
      <p className="text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
        {loc.description}
      </p>
      {plans.map(({ t, plan }) => (
        <TravelRow key={t} transport={t} loc={loc} plan={plan} onConfirm={() => onConfirm(t)} />
      ))}
      <p className="lko-num mt-1 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
        Trip time and fares follow the real weather and road conditions.
      </p>
    </div>
  )
}

function TravelRow({
  transport,
  loc,
  plan,
  onConfirm,
}: {
  transport: TransportId
  loc: LokojaLocation
  plan: ReturnType<typeof calculateTravel>
  onConfirm: () => void
}) {
  const player = useGameStore((s) => s.player)!
  const noCash = player.cash < plan.cost
  const noEnergy = player.needs.energy < plan.energyCost
  const disabled = noCash || noEnergy

  const reason = noCash
    ? `You need ${formatNaira(plan.cost)}`
    : noEnergy
      ? 'Too tired for this trip'
      : null

  return (
    <div className={`lko-card flex items-center gap-3 p-3 ${disabled ? 'opacity-60' : ''}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-[var(--lko-green-deep)]">
        {TRANSPORT_ICON[transport]({ size: 20 })}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-extrabold capitalize leading-tight">
          {transport === 'walk' ? 'Walk' : transport}
        </p>
        <p className="lko-num truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          {plan.minutes} min · {plan.energyCost} energy · {plan.distanceKm.toFixed(1)} km
          {plan.weatherModifier > 1 ? ` · ${loc.travelModifier > 1 ? 'hilly route' : 'slow roads'}` : ''}
        </p>
        {reason && <p className="text-[11px] font-bold text-red-600">{reason}</p>}
      </div>
      <button
        disabled={disabled}
        onClick={() => {
          audio.play('chime')
          onConfirm()
        }}
        className="lko-press flex h-10 shrink-0 items-center gap-1 rounded-xl bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold text-white disabled:cursor-not-allowed disabled:bg-black/15"
      >
        {plan.cost > 0 ? (
          <span className="lko-num">{formatNaira(plan.cost)}</span>
        ) : (
          'Free'
        )}
      </button>
    </div>
  )
}

/* ----------------------------- activities sheet ------------------------------ */

function ActivitiesSheet({
  loc,
  onRest,
  onEat,
  onOpenWork,
  onOpenMap,
}: {
  loc: LokojaLocation
  onRest: (k: 'nap' | 'sleep') => void
  onEat: (mealKey: string, atLocationId?: string) => void
  onOpenWork: () => void
  onOpenMap: () => void
}) {
  const cash = useGameStore((s) => s.player?.cash ?? 0)
  const hunger = useGameStore((s) => s.player?.needs.hunger ?? 100)
  const isHome = loc.id === 'home'
  // Stage 4 eating loop — real meals (food strip) + market groceries (Kpata)
  const isFoodSpot = loc.id === 'food-area' || loc.id === 'kpata-market'

  return (
    <div className="flex flex-col gap-2 px-5 pb-4 pt-3">
      <p className="text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]">{loc.description}</p>

      {/* ---------- the eating loop — Stage 4 is LIVE ---------- */}
      {isFoodSpot &&
        (loc.id === 'food-area'
          ? loc.activities.filter((a) => a.key === 'eat')
          : loc.activities.filter((a) => a.key === 'shop-food')
        ).map((a) => (
          <div key={a.key} className="rounded-xl border border-black/[0.06] bg-[var(--lko-gold-soft)]/40 p-2.5">
            <p className="mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]">
              {loc.id === 'food-area' ? '🍲 Mama’s menu — eat now' : '🧺 Market fresh — buy foodstuff'}
              <span className="ml-auto rounded-full bg-black/[0.06] px-2 py-0.5 text-[9.5px] font-bold normal-case text-[var(--lko-ink-soft)]">
                hunger {Math.round(hunger)}%
              </span>
            </p>
            <div className="flex flex-col gap-1.5">
              {FOOD.meals.map((m) => {
                const afford = cash >= m.price
                return (
                  <button
                    key={m.key}
                    disabled={!afford}
                    onClick={() => {
                      audio.play('click')
                      onEat(m.key)
                    }}
                    className={`lko-press flex min-h-[48px] items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left ${
                      afford ? 'lko-card' : 'cursor-not-allowed opacity-55'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-extrabold leading-tight">{m.label}</span>
                      <span className="block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">{m.detail}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end">
                      <span className="lko-num text-[12px] font-extrabold text-[var(--lko-green)]">{formatNaira(m.price)}</span>
                      <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">+{m.hunger} 🍲</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

      {loc.activities.map((a) => {
        // 'rest' renders as the Nap/Sleep pair; its sibling 'sleep' key is the
        // same action in data — skip the duplicate row
        if (a.key === 'sleep') return null
        // eat / shop-food render as the meal menu above when this is a food spot
        if ((a.key === 'eat' || a.key === 'shop-food') && isFoodSpot) return null
        if (a.stage <= 3 && a.key === 'rest' && isHome) {
          return (
            <div key={a.key} className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  audio.play('click')
                  onRest('nap')
                }}
                className="lko-press flex min-h-[52px] items-center gap-2 rounded-xl bg-[var(--lko-gold)] px-3 text-left text-[13px] font-extrabold text-[#3d2a00]"
              >
                <ClockIcon size={17} /> Nap
              </button>
              <button
                onClick={() => {
                  audio.play('click')
                  onRest('sleep')
                }}
                className="lko-press flex min-h-[52px] items-center gap-2 rounded-xl bg-[var(--lko-green)] px-3 text-left text-[13px] font-extrabold text-white"
              >
                <MoonIcon size={17} /> Sleep till morning
              </button>
            </div>
          )
        }
        if (a.stage <= 3 && (a.key.startsWith('job-') || a.key === 'hustle')) {
          return (
            <button
              key={a.key}
              onClick={() => {
                audio.play('click')
                onOpenWork()
              }}
              className="lko-press lko-card flex min-h-[52px] items-center gap-3 p-3 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]">
                <WorkIcon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-extrabold leading-tight">{a.label}</span>
                <span className="block text-[11px] font-semibold text-[var(--lko-ink-soft)]">
                  Open the Work board
                </span>
              </span>
              <CheckIcon size={16} className="text-[var(--lko-green)]" />
            </button>
          )
        }
        if (a.stage <= 3 && (a.key === 'travel' || a.key === 'transport-hub')) {
          return (
            <button
              key={a.key}
              onClick={() => {
                audio.play('click')
                onOpenMap()
              }}
              className="lko-press lko-card flex min-h-[52px] items-center gap-3 p-3 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-river-soft)] text-[var(--lko-river)]">
                <MapIcon size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-extrabold leading-tight">{a.label}</span>
                <span className="block text-[11px] font-semibold text-[var(--lko-ink-soft)]">Open the full map</span>
              </span>
            </button>
          )
        }
        // honestly locked — later stage
        return (
          <div key={a.key} className="flex min-h-[48px] items-center gap-3 rounded-xl border border-dashed border-black/10 px-3 opacity-70">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-[var(--lko-ink-soft)]">
              <LockIcon size={15} />
            </span>
            <span className="min-w-0 flex-1 text-[12.5px] font-bold text-[var(--lko-ink-soft)]">{a.label}</span>
            <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">
              Arrives in Stage {a.stage}
            </span>
          </div>
        )
      })}
    </div>
  )
}
