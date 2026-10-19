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

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { LOCATION_BY_ID, type LokojaLocation } from '@/game/data/locations'
import { NPCS } from '@/game/data/npcs'
import { HUSTLES } from '@/game/data/hustles'
import { WORLD3D, FOOD, INTERIOR, WEATHER_META } from '@/game/data/config'
import { isNightMarketOpen, isRainSky } from '@/game/systems/seasons'
import { ANCHORS, ANCHOR_BY_ID, POINTS_OF_INTEREST, RIVERS, WORLD_HALF } from '@/game/world3d/layout'
import { INTERIOR_BY_ID, type HotspotKind, type InteriorDef } from '@/game/world3d/interiors'
import { VEHICLE_BY_MODEL } from '@/game/data/vehicles'
import type { TransportId, VehicleModel } from '@/game/types'
import { calculateTravel } from '@/game/systems/travel'
import { allTravelOptions } from '@/game/systems/garage'
import { fuelMultFor } from '@/game/systems/chaos'
import { playerCountIn, wireToPresences, type WirePresenceRow } from '@/game/systems/liveRoom'
import { formatNaira } from '@/game/systems/progression'
import { ambience } from '@/game/systems/ambience'
import { audio } from '@/game/systems/audio'
import {
  boardableNear, wheelIsRiding, wheelRequestBoard, wheelRequestUnboard, wheelRequestSeats,
} from '@/game/systems/wheelnet' // W10-b — the boarding chips read the net's own truth
import { useWireStore } from '@/game/systems/wire'
import { GaragePanel } from './GaragePanel'
import { PerfChip } from './PerfChip'
import {
  ArrowLeftIcon, CheckIcon, ClockIcon, CoinsIcon, EnergyIcon, KekeIcon,
  LockIcon, MapIcon, MoonIcon, PinIcon, PlaceIcon, TaxiIcon, WalkIcon,
  WeatherIcon, WorkIcon, TimeIcon,
} from '../icons'
import {
  attachControls, consumeInteract, cycleCamMode, freezeInput, getCamMode, getDriveModel,
  getDriveSpeed, getDriveStartedAt, getNearVehicle, getTutProgress, getWalkedMeters, isDriveActive,
  isPhotoMode, playerPos, queueInteract, requestE2eTeleport, requestEnterVehicle, requestParkVehicle,
  resetTutProgress, resetWalkedMeters, setJoystick, setPhotoMode, setSprint, speedToKmh, togglePhotoMode, CAM_MODES,
} from './controls'
import { nearestPlate } from '@/game/world3d/plates' // W4 — the banner law

const TRANSPORT_ICON: Record<TransportId, (p: { size?: number }) => React.ReactNode> = {
  walk: (p) => <WalkIcon {...p} />,
  keke: (p) => <KekeIcon {...p} />,
  taxi: (p) => <TaxiIcon {...p} />,
  // M4 — personal rides ride their vehicle emoji (the garage is the icon source)
  'own-okada': (p) => <span style={{ fontSize: (p.size ?? 20) * 0.95, lineHeight: 1 }} aria-hidden>🏍️</span>,
  'own-keke': (p) => <span style={{ fontSize: (p.size ?? 20) * 0.95, lineHeight: 1 }} aria-hidden>🛺</span>,
  'own-taxi': (p) => <span style={{ fontSize: (p.size ?? 20) * 0.95, lineHeight: 1 }} aria-hidden>🚕</span>,
  'own-danfo': (p) => <span style={{ fontSize: (p.size ?? 20) * 0.95, lineHeight: 1 }} aria-hidden>🚐</span>,
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

  // world (±WORLD_HALF) → minimap viewbox (0..44)
  const B = WORLD_HALF
  const toMap = (v: number) => 22 + (v / B) * 21
  const px = toMap(Math.max(-B, Math.min(B, playerPos.x)))
  const pz = toMap(Math.max(-B, Math.min(B, playerPos.z)))
  // heading: world yaw 0 faces +z (south) — minimap up is north (-z)
  const headingDeg = (Math.atan2(Math.sin(playerPos.heading), -Math.cos(playerPos.heading)) * 180) / Math.PI

  // the REAL rivers, traced from the same data as the 3D world
  const riverPaths = useMemo(
    () =>
      RIVERS.map((r) => {
        const step = Math.max(1, Math.floor(r.points.length / 14))
        const pts = r.points.filter((_, i) => i % step === 0 || i === r.points.length - 1)
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toMap(p[0]).toFixed(1)} ${toMap(p[1]).toFixed(1)}`).join(' ')
        return { id: r.id, d, w: Math.max(1.3, (r.width / B) * 21 * 0.55) }
      }),
    [],
  )
  const patti = ANCHOR_BY_ID['mount-patti']

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
        {/* rivers — the real courses, north-up */}
        {riverPaths.map((r) => (
          <path key={r.id} d={r.d} stroke={r.id === 'niger' ? '#2f8fa0' : '#3d9481'} strokeWidth={r.w} fill="none" opacity="0.85" strokeLinecap="round" />
        ))}
        {/* Mount Patti mass — at its real summit position */}
        <ellipse cx={toMap(patti.x)} cy={toMap(patti.z)} rx="7.5" ry="6.2" fill="#4C7A2E" opacity="0.8" />
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
  | { kind: 'interior'; hotspot: HotspotKind }
  | { kind: 'garage' }

/** polled from the input layer each frame — re-rendered only on real changes */
interface DriveUi {
  driving: boolean
  model: VehicleModel | null
  /** an owned parked vehicle in walk-up range ("Enter …" chip) */
  near: VehicleModel | null
  /** first-5-seconds drive hints */
  hints: boolean
  /** W10-b — I ride in somebody's car right now (the body follows the wheels) */
  riding: boolean
  /** W10-b — a stopped, consenting car in walk-up range ("Board …" chip) */
  boardable: { handle: string; name: string; model: VehicleModel; plate: string } | null
  /** W10-b — my own live car's standing consent (the seats toggle's truth) */
  seatsOpen: boolean | null
}

const DRIVE_UI_IDLE: DriveUi = { driving: false, model: null, near: null, hints: false, riding: false, boardable: null, seatsOpen: null }

/** the motor park — the Vehicle Shop button lives within this radius */
const SHOP_RADIUS = 28

export function HudOverlay({
  nearestAnchor,
  district,
  gistNpc,
  interior,
  hotspot,
  onExit,
  onOpenWork,
  onOpenMap,
  onEnterInterior,
  onExitInterior,
}: {
  /** anchor / `poi:` prop / `door:` interior door in interact range (3D scene), null = none */
  nearestAnchor: string | null
  /** district the player is inside right now (drives arrival toasts) */
  district: string | null
  /** nearest named NPC's registry id (drives the gist chip), null = none */
  gistNpc: string | null
  /** when non-null the HUD is in interior mode (INC 4) */
  interior: InteriorDef | null
  /** active interior hotspot id, null = none */
  hotspot: string | null
  onExit: () => void
  onOpenWork: () => void
  onOpenMap: (locationId: string) => void
  onEnterInterior: (interiorId: string) => void
  onExitInterior: () => void
}) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const liveWire = useGameStore((s) => s.liveWire)
  const isTravelling = useGameStore((s) => s.isTravelling)
  const travelAction = useGameStore((s) => s.travel)
  const restAction = useGameStore((s) => s.rest)
  const settleWalk = useGameStore((s) => s.settleWorldWalk)
  const eatAction = useGameStore((s) => s.eatMeal)
  const relaxAction = useGameStore((s) => s.relaxIndoors)

  const surfaceRef = useRef<HTMLDivElement>(null)
  const nearestRef = useRef<string | null>(null)
  const [panel, setPanel] = useState<PanelState>({ kind: 'none' })
  const panelRef = useRef<PanelState>(panel)
  useEffect(() => {
    panelRef.current = panel
  }, [panel])

  /* Stage 5 — drive chrome state (polled, cheap) */
  const [driveUi, setDriveUi] = useState<DriveUi>(DRIVE_UI_IDLE)
  const driveUiRef = useRef<DriveUi>(DRIVE_UI_IDLE)
  const [nearShop, setNearShop] = useState(false)
  const nearShopRef = useRef(false)

  /* W4 — THE SPEEDOMETER: ref-driven (the poll law forbids a setState per
   * frame) — the km/h text, needle transform and gear chip write straight
   * to the DOM only when the rounded value changes. */
  const speedoRef = useRef<HTMLDivElement>(null)
  const speedoNumRef = useRef<HTMLSpanElement>(null)
  const speedoNeedleRef = useRef<HTMLDivElement>(null)
  const speedoGearRef = useRef<HTMLSpanElement>(null)
  const lastKmhRef = useRef(-999)
  /* W4 — THE JUNCTION BANNERS: entering a real OSM-named street (the W1
   * plates) raises a banner — once per crossing, deduped 24s per name. */
  const [banner, setBanner] = useState<{ name: string; at: number } | null>(null)
  const bannerShownAtRef = useRef(new Map<string, number>())
  const lastPlateNameRef = useRef<string | null>(null)

  // INC 4 — interior mode: refs so the rAF poll can read them without re-subscribing
  const travellingRef = useRef(isTravelling)
  useEffect(() => {
    travellingRef.current = isTravelling
  }, [isTravelling])
  const interiorRef = useRef<InteriorDef | null>(interior)
  const hotspotRef = useRef<string | null>(hotspot)
  useEffect(() => {
    interiorRef.current = interior
  }, [interior])
  useEffect(() => {
    hotspotRef.current = hotspot
  }, [hotspot])
  // keep the poll's copies of the callbacks fresh too
  const enterRef = useRef(onEnterInterior)
  const exitInteriorRef = useRef(onExitInterior)
  useEffect(() => {
    enterRef.current = onEnterInterior
  }, [onEnterInterior])
  useEffect(() => {
    exitInteriorRef.current = onExitInterior
  }, [onExitInterior])

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
    npcDef !== null && npcHustle !== null && !dismissedGists.has(npcDef.id) && panel.kind === 'none' && !isTravelling && !interior

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
    let lastAmbience = 0
    const tick = () => {
      if (consumeInteract()) {
        // INC 4 — inside: the nearest hotspot drives the panel
        const hot = hotspotRef.current
        const inside = interiorRef.current
        if (hot && inside) {
          const h = inside.hotspots.find((x) => x.id === hot)
          if (h) {
            audio.play('click')
            if (h.kind === 'exit') exitInteriorRef.current()
            else setPanel({ kind: 'interior', hotspot: h.kind })
          }
        } else if (
          driveUiRef.current.near &&
          panelRef.current.kind === 'none' &&
          !driveUiRef.current.driving
        ) {
          // STAGE 5 — walk-up entry to your own parked ride
          audio.play('click')
          requestEnterVehicle(driveUiRef.current.near)
        } else if (driveUiRef.current.driving && getDriveSpeed() < 2.6) {
          // STAGE 5 — stopped + interact = park & step out
          audio.play('click')
          requestParkVehicle()
        } else if (nearestRef.current && !driveUiRef.current.driving) {
          const anchorId = nearestRef.current
          if (anchorId.startsWith('door:')) {
            audio.play('click')
            enterRef.current(anchorId.slice(5))
          } else {
            const loc = resolveAnchorLoc(anchorId)
            if (loc) {
              audio.play('click')
              setPanel({ kind: loc.id === world.currentLocation ? 'activities' : 'travel', loc })
            }
          }
        }
      }
      // ambience proximity blend — throttled to ~2 Hz, zero React work
      const nowMs = performance.now()
      if (nowMs - lastAmbience > 500) {
        lastAmbience = nowMs
        const riverA = ANCHOR_BY_ID['confluence']
        const marketA = ANCHOR_BY_ID['kpata-market']
        ambience.update({
          night: world.timeOfDay === 'night',
          rain: isRainSky(world.weather),
          indoors: interiorRef.current !== null,
          river: Math.hypot(riverA.x - playerPos.x, riverA.z - playerPos.z),
          market: Math.hypot(marketA.x - playerPos.x, marketA.z - playerPos.z),
        })
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

      // STAGE 5 — drive chrome: poll the input layer, re-render on real changes only
      const driving = isDriveActive()
      const riding = wheelIsRiding()
      const boardable = !driving && !riding ? boardableNear(playerPos.x, playerPos.z) : null
      // my own live car's consent — the roster row is the wire's truth
      let seatsOpen: boolean | null = null
      if (driving) {
        const me = useGameStore.getState().account.handle
        const row = me ? useWireStore.getState().roster.find((r) => r.handle === me) : null
        seatsOpen = row?.car?.seatsOpen === true
      }
      const dui: DriveUi = {
        driving,
        model: getDriveModel(),
        near: driving || riding ? null : getNearVehicle(),
        hints:
          driving && getDriveStartedAt() > 0 && performance.now() - getDriveStartedAt() < 5200,
        riding,
        boardable: boardable
          ? { handle: boardable.handle, name: boardable.name, model: boardable.model, plate: boardable.plate }
          : null,
        seatsOpen,
      }
      const prevDui = driveUiRef.current
      if (
        prevDui.driving !== dui.driving ||
        prevDui.model !== dui.model ||
        prevDui.near !== dui.near ||
        prevDui.hints !== dui.hints ||
        prevDui.riding !== dui.riding ||
        prevDui.seatsOpen !== dui.seatsOpen ||
        prevDui.boardable?.handle !== dui.boardable?.handle ||
        (dui.boardable && prevDui.boardable && prevDui.boardable.plate !== dui.boardable.plate)
      ) {
        driveUiRef.current = dui
        setDriveUi(dui)
      }
      /* W4 — the speedo writes: DOM only, only when the km/h tick changes */
      if (!driveUiRef.current.driving && lastKmhRef.current !== -999) lastKmhRef.current = -999
      if (speedoRef.current) {
        const kmh = Math.round(speedToKmh(driving ? getDriveSpeed() : 0))
        if (kmh !== lastKmhRef.current) {
          lastKmhRef.current = kmh
          if (speedoNumRef.current) speedoNumRef.current.textContent = String(kmh)
          if (speedoGearRef.current) speedoGearRef.current.textContent = getDriveSpeed() < -0.05 ? 'R' : 'D'
          if (speedoNeedleRef.current) {
            const frac = Math.max(0, Math.min(1, kmh / 80))
            speedoNeedleRef.current.style.transform = `rotate(${-120 + frac * 240}deg)`
          }
        }
      }
      /* W4 — the banner law: nearest named-artery plate within 7u raises
       * ENTERING <NAME>, once per crossing, deduped 24s per name */
      if (!isPhotoMode() && panelRef.current.kind === 'none' && !travellingRef.current) {
        const near = nearestPlate(playerPos.x, playerPos.z, 7)
        const now = performance.now()
        if (near && near.plate.name !== lastPlateNameRef.current) {
          const shownAt = bannerShownAtRef.current.get(near.plate.name) ?? -1e9
          if (now - shownAt > 24_000) {
            bannerShownAtRef.current.set(near.plate.name, now)
            lastPlateNameRef.current = near.plate.name
            setBanner({ name: near.plate.name, at: now })
          } else {
            lastPlateNameRef.current = near.plate.name
          }
        } else if (!near && lastPlateNameRef.current) {
          lastPlateNameRef.current = null // left the mouth — the next street may speak
        }
        if (banner && now - banner.at > 2800) setBanner(null)
      } else if (banner) {
        setBanner(null)
      }

      const shopA = ANCHOR_BY_ID['transport-area']
      const shopNow =
        !driving && !!shopA && Math.hypot(shopA.x - playerPos.x, shopA.z - playerPos.z) < SHOP_RADIUS
      if (shopNow !== nearShopRef.current) {
        nearShopRef.current = shopNow
        setNearShop(shopNow)
      }
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
  }, [world.currentLocation, world.timeOfDay, world.weather])

  // freeze walking while a sheet is open
  useEffect(() => {
    freezeInput(panel.kind !== 'none' || isTravelling)
  }, [panel, isTravelling])

  const openPanelFor = (anchorId: string | null) => {
    if (!anchorId) return
    // INC 4 — doors and interior hotspots speak their own protocol
    if (interior && hotspot) {
      const h = interior.hotspots.find((x) => x.id === hotspot)
      if (h) {
        audio.play('click')
        if (h.kind === 'exit') onExitInterior()
        else setPanel({ kind: 'interior', hotspot: h.kind })
      }
      return
    }
    if (anchorId.startsWith('door:')) {
      audio.play('click')
      onEnterInterior(anchorId.slice(5))
      return
    }
    const loc = resolveAnchorLoc(anchorId)
    if (!loc) return
    audio.play('click')
    setPanel({ kind: loc.id === world.currentLocation ? 'activities' : 'travel', loc })
  }

  const currentLoc = LOCATION_BY_ID[world.currentLocation]
  // M21 — the co-presence chip: REAL presence rows ONLY, TTL honored at
  // render (a stale ping is an absent neighbor). It re-evaluates with the
  // live slice's own sync cadence — this component adds ZERO new intervals.
  // The sim crowd is deliberately NOT shown here: the nation snapshot is
  // not subscribed in this tree, and no heavy subscription gets added for
  // a decoration (the phone's Live room carries the labeled (sim) line).
  const copresenceNow = Date.now()
  const coPresent = playerCountIn(
    wireToPresences((liveWire?.roster ?? []) as WirePresenceRow[], copresenceNow),
    world.currentLocation,
    copresenceNow,
  )
  const hotDef = interior && hotspot ? interior.hotspots.find((h) => h.id === hotspot) ?? null : null
  const doorDef = !interior && nearestAnchor?.startsWith('door:') ? INTERIOR_BY_ID[nearestAnchor.slice(5)] ?? null : null
  const promptLoc = !interior && !doorDef && nearestAnchor ? resolveAnchorLoc(nearestAnchor) : null
  const promptAnchor = nearestAnchor
  const isPoiPrompt = !!promptAnchor?.startsWith('poi:')
  // STAGE 5 — your parked ride is close enough to enter; it wins the prompt slot
  const nearVehicleDef = driveUi.near ? VEHICLE_BY_MODEL[driveUi.near] : null
  const vehicleChip =
    nearVehicleDef && panel.kind === 'none' && !driveUi.driving && !driveUi.riding && !interior && !isTravelling && !photo
  const boardableDef = driveUi.boardable ? VEHICLE_BY_MODEL[driveUi.boardable.model] : null
  const boardChip =
    boardableDef && driveUi.boardable && panel.kind === 'none' && !driveUi.driving && !driveUi.riding && !vehicleChip && !interior && !isTravelling && !photo

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
              if (interior) {
                // stepping back outside — WorldTab settles the interior visit
                onExitInterior()
                return
              }
              // settle the visit's walking into the real needs economy
              settleWalk(getWalkedMeters())
              resetWalkedMeters()
              onExit()
            }}
            aria-label={interior ? 'Step back outside' : 'Leave the 3D world'}
            className="lko-press flex h-10 items-center gap-1.5 rounded-full bg-black/40 px-3.5 text-[13px] font-extrabold text-white backdrop-blur-md"
          >
            <ArrowLeftIcon size={15} />
            {interior ? 'Outside' : 'Exit'}
          </button>
          <span className="flex min-w-0 items-center gap-1.5 rounded-full bg-black/40 px-3 py-2 backdrop-blur-md">
            {interior ? (
              <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] bg-[#ffd88a]/90 text-[8px] font-black text-[#3d2a00]">in</span>
            ) : (
              <PlaceIcon id={currentLoc.id} size={14} className="shrink-0 text-[#ffd88a]" />
            )}
            <span className="truncate text-[13px] font-extrabold text-white">
              {interior ? interior.name : currentLoc.name}
            </span>
          </span>
          {/* M21 — co-presence: exists ONLY when a real OTHER player shares this street (count 1 = just you) */}
          {coPresent >= 2 && (
            <span
              data-testid="hud-copresence"
              aria-label={`${coPresent} real players on this street`}
              className="flex items-center gap-1 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-2 text-[10.5px] font-extrabold text-white/85 backdrop-blur-md"
            >
              👥 {coPresent} here
            </span>
          )}
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
              {/* M6 — the one weather dictionary */}
              {WEATHER_META[world.weather]?.label ?? world.weather}
            </span>
          </span>
          <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-black/40 px-2.5 py-1 text-[10.5px] font-bold text-white/90 backdrop-blur-md">
            <PinIcon size={10} className="shrink-0 text-[#ffd88a]" />
            {discovered.size}/{ANCHORS.length} places found
          </span>
          {/* view mode + photo mode — camera presets are an outdoor thing */}
          <div className="flex items-center gap-1.5">
            {!interior && (
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
            )}
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
          {/* live minimap — north-up, discovered pins in colour (outdoors only) */}
          {!interior && <MiniMap discovered={discovered} />}
          {/* M4 — real-device fps capture: live number + report the player can share */}
          <PerfChip />
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

      {/* ---------- W4 — THE SPEEDOMETER (ref-driven, no per-frame setState) ---------- */}
      {driveUi.driving && !photo && (
        <div ref={speedoRef} className="pointer-events-none absolute right-4 z-10" style={{ bottom: touchMode ? '17rem' : '6.75rem' }}>
          <div className="relative flex h-24 w-24 items-end justify-center rounded-full border-2 border-[#ffd88a]/55 bg-black/65 shadow-[var(--lko-shadow-lg)] backdrop-blur-md">
            {/* gauge ticks */}
            {[-120, -60, 0, 60, 120].map((deg) => (
              <div
                key={deg}
                className="absolute bottom-1/2 left-1/2 h-[42px] w-px origin-bottom bg-white/25"
                style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
              />
            ))}
            {/* the needle — rotation written by the poll */}
            <div
              ref={speedoNeedleRef}
              className="absolute bottom-1/2 left-1/2 h-9 w-[3px] origin-bottom rounded-full bg-[#ff5040]"
              style={{ transform: 'translateX(-50%) rotate(-120deg)' }}
            />
            <div className="relative mb-3 flex flex-col items-center">
              <span ref={speedoNumRef} className="text-[26px] font-black leading-none text-white">0</span>
              <span className="mt-0.5 text-[8.5px] font-black tracking-[0.18em] text-white/70">KM/H</span>
            </div>
            <span
              ref={speedoGearRef}
              className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-black text-[#ffd88a]"
            >
              D
            </span>
          </div>
        </div>
      )}

      {/* ---------- W4 — THE PHOTO FRAME: thirds grid + postcard mark ---------- */}
      {photo && (
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-y-0 left-1/3 w-px bg-white/20" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-white/20" />
          <div className="absolute inset-x-0 top-1/3 h-px bg-white/20" />
          <div className="absolute inset-x-0 top-2/3 h-px bg-white/20" />
          {/* framing corners */}
          {['left-3 top-3 border-l-2 border-t-2', 'right-3 top-3 border-r-2 border-t-2', 'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((pos) => (
            <div key={pos} className={`absolute h-7 w-7 border-white/70 ${pos}`} />
          ))}
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 backdrop-blur-md">
            <span className="text-[10px] font-black tracking-[0.3em] text-white/90">LOKOJA LIFE</span>
            <span className="h-1 w-1 rounded-full bg-[#e8a317]" />
            <span className="text-[10px] font-bold capitalize text-white/70">{world.timeOfDay} · {world.weather.replace('night-', '')}</span>
          </div>
        </div>
      )}

      {/* ---------- W4 — THE JUNCTION BANNER: entering a named street ---------- */}
      {banner && !isPhotoMode() && (
        <div className="pointer-events-none absolute inset-x-0 top-[4.6rem] flex justify-center px-4">
          <div
            key={banner.name}
            className="lko-pop flex flex-col items-center rounded-2xl border border-[#ffd88a]/45 bg-black/60 px-6 py-2.5 text-center shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ffd88a]">Now entering</span>
            <span className="text-[17px] font-black uppercase tracking-wide text-white">{banner.name}</span>
          </div>
        </div>
      )}

      {/* ---------- STAGE 5 — drive hints (first 5 seconds) ---------- */}
      {driveUi.driving && driveUi.hints && !photo && (
        <div className="pointer-events-none absolute inset-x-0 top-[4.9rem] flex justify-center px-4">
          <p className="lko-pop max-w-full rounded-full bg-black/55 px-4 py-2 text-center text-[12px] font-extrabold text-white backdrop-blur-md">
            {touchMode
              ? 'Stick up = gas · down = brake · sides = steer'
              : 'W / ↑ gas · S / ↓ brake · A D steer'}
            {' '}— slow down, then PARK
          </p>
        </div>
      )}

      {/* ---------- STAGE 5 — Vehicle Shop pill (near the motor park) ---------- */}
      {nearShop && !driveUi.driving && panel.kind === 'none' && !isTravelling && !photo && !interior && (
        <div
          className="pointer-events-auto absolute left-4 z-10"
          style={{ bottom: touchMode ? '10.9rem' : '5.75rem' }}
        >
          <button
            onClick={() => {
              audio.play('click')
              setPanel({ kind: 'garage' })
            }}
            className="lko-press lko-pop flex items-center gap-2 rounded-full border border-[#ffd88a]/50 bg-black/60 px-4 py-2.5 text-[13px] font-extrabold text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="text-[15px]" aria-hidden>🏍️</span>
            Vehicle Shop
          </button>
        </div>
      )}

      {/* ---------- interact prompt ---------- */}
      {interior && hotDef && panel.kind === 'none' && !photo && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10">
          <button
            onClick={() => openPanelFor(hotDef.id)}
            className="lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-black/55 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffd88a] text-[11px] font-black text-[#3d2a00]">
              {hotDef.kind === 'exit' ? '→' : hotDef.kind === 'bed' ? '🛏' : hotDef.kind === 'stove' ? '🍲' : hotDef.kind === 'tv' ? '📺' : hotDef.kind === 'bath' ? '🚿' : hotDef.kind === 'shop' ? '🧺' : '📋'}
            </span>
            <span className="truncate text-[14px] font-extrabold">{hotDef.label}</span>
            {!touchMode && (
              <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold">E</kbd>
            )}
          </button>
        </div>
      )}
      {/* ---------- STAGE 5 — enter-your-ride prompt ---------- */}
      {vehicleChip && nearVehicleDef && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10">
          <button
            onClick={() => {
              audio.play('click')
              requestEnterVehicle(nearVehicleDef.model)
            }}
            className="lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-[#ffd88a]/45 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[12px]">
              {nearVehicleDef.emoji}
            </span>
            <span className="truncate text-[14px] font-extrabold">Enter {nearVehicleDef.label}</span>
            {!touchMode && (
              <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold">E</kbd>
            )}
          </button>
        </div>
      )}
      {/* ---------- W10-b — the boarding chips (board / hop off) ---------- */}
      {driveUi.riding && panel.kind === 'none' && !photo && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10">
          <button
            data-testid="unboard-chip"
            onClick={async () => {
              audio.play('click')
              const r = await wheelRequestUnboard()
              if (r.ok) {
                if (typeof r.x === 'number' && typeof r.z === 'number') requestE2eTeleport(r.x, r.z)
                useGameStore.getState().notify({ icon: '🚌', text: 'You hop off — safe journey.', tone: 'good' })
              } else if (r.why === 'moving') {
                useGameStore.getState().notify({ icon: '🚌', text: 'The danfo still dey move — wait make e stop.', tone: 'neutral' })
              }
            }}
            className="lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[12px]">🚏</span>
            <span className="truncate text-[14px] font-extrabold">Hop off</span>
          </button>
        </div>
      )}
      {boardChip && driveUi.boardable && boardableDef && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10">
          <button
            data-testid="board-chip"
            onClick={async () => {
              audio.play('click')
              const target = driveUi.boardable!
              const r = await wheelRequestBoard(target.handle)
              const notify = useGameStore.getState().notify
              if (r.ok) {
                notify({ icon: '🚌', text: `You enter ${target.name}'s ${boardableDef.label} — hold well.`, tone: 'good' })
              } else {
                const why: Record<string, string> = {
                  'seats-shut': 'The driver no open seat.',
                  moving: 'The danfo still dey move — wait make e stop.',
                  full: 'The motor don full.',
                  blocked: 'You no fit enter this one.',
                  'guest-dark': 'Claim your name first — guests no dey ride.',
                  'already-aboard': 'You don dey inside already.',
                }
                notify({ icon: '🚫', text: why[r.why ?? ''] ?? 'The motor don go.', tone: 'bad' })
              }
            }}
            className="lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-[#ffd88a]/45 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[12px]">
              {boardableDef.emoji}
            </span>
            <span className="truncate text-[14px] font-extrabold">Board {driveUi.boardable.name}'s {boardableDef.label}</span>
          </button>
        </div>
      )}
      {!interior && doorDef && panel.kind === 'none' && !isTravelling && !photo && !vehicleChip && !driveUi.driving && !driveUi.riding && !boardChip && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10">
          <button
            onClick={() => openPanelFor(promptAnchor)}
            className="lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-[#ffd88a]/45 bg-black/60 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8a317] text-[11px] font-black text-white">→</span>
            <span className="truncate text-[14px] font-extrabold">
              Enter {doorDef.name}
            </span>
            {!touchMode && (
              <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold">E</kbd>
            )}
          </button>
        </div>
      )}
      {promptLoc && panel.kind === 'none' && !isTravelling && !photo && !interior && !doorDef && !vehicleChip && !driveUi.driving && (
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
            {driveUi.driving ? (
              /* behind the wheel: PARK replaces the walk buttons (stop + E also parks) */
              <button
                aria-label="Park and step out"
                onClick={() => {
                  audio.play('click')
                  requestParkVehicle()
                }}
                className="lko-press flex h-14 w-14 items-center justify-center rounded-full border border-[#ffd88a]/70 bg-[#e8a317]/90 text-[10.5px] font-extrabold text-[#3d2a00] shadow-[0_0_18px_rgba(232,163,23,0.5)] backdrop-blur-md"
              >
                PARK
              </button>
            ) : (
              <>
                <button
                  aria-label="Interact"
                  onPointerDown={() => queueInteract()}
                  className={`lko-press flex h-14 w-14 items-center justify-center rounded-full border text-white backdrop-blur-md ${
                    promptAnchor || vehicleChip ? 'border-[#ffd88a]/70 bg-[#e8a317]/85 shadow-[0_0_18px_rgba(232,163,23,0.55)]' : 'border-white/25 bg-black/35'
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
              </>
            )}
          </div>
        </>
      )}

      {/* ---------- STAGE 5 — desktop park button (always visible while driving) ---------- */}
      {driveUi.driving && !touchMode && panel.kind === 'none' && !photo && (
        <div className="pointer-events-auto absolute bottom-6 right-4">
          <button
            onClick={() => {
              audio.play('click')
              requestParkVehicle()
            }}
            title="Park & step out (or stop + E)"
            className="lko-press flex min-h-[44px] items-center gap-2 rounded-full border border-[#ffd88a]/70 bg-[#e8a317]/90 px-4 text-[12.5px] font-extrabold text-[#3d2a00] shadow-[0_0_18px_rgba(232,163,23,0.5)] backdrop-blur-md"
          >
            🅿 Park & Step Out
          </button>
        </div>
      )}

      {/* ---------- W10-b — the driver's standing consent (the seats toggle) ---------- */}
      {driveUi.driving && driveUi.seatsOpen !== null && panel.kind === 'none' && !photo && (
        <div className="pointer-events-auto absolute bottom-[5.6rem] right-4">
          <button
            data-testid="seats-toggle"
            onClick={async () => {
              audio.play('click')
              const next = !(driveUi.seatsOpen === true)
              const ok = await wheelRequestSeats(next)
              const notify = useGameStore.getState().notify
              if (ok) {
                notify({
                  icon: '🚪',
                  text: next ? 'Seats open — paddies fit board when you stop.' : 'Seats shut — na you alone dey inside.',
                  tone: next ? 'good' : 'neutral',
                })
              } else {
                notify({ icon: '🚫', text: 'The wire no gree — try again.', tone: 'bad' })
              }
            }}
            className={`lko-press flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 text-[11.5px] font-extrabold shadow-[var(--lko-shadow-lg)] backdrop-blur-md ${
              driveUi.seatsOpen
                ? 'border-[#7ee2a8]/60 bg-[#146b3a]/85 text-[#eafff2]'
                : 'border-white/25 bg-black/55 text-white/90'
            }`}
          >
            🚪 {driveUi.seatsOpen ? 'Seats: Open' : 'Seats: Shut'}
          </button>
        </div>
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
            aria-label={
              panel.kind === 'travel'
                ? `Travel to ${panel.loc.name}`
                : panel.kind === 'interior'
                  ? `${interior?.name ?? 'Indoors'} — inside`
                  : panel.kind === 'garage'
                    ? 'Motor Park garage — buy and drive your own ride'
                    : `${panel.loc.name} activities`
            }
          >
            <div className="mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-black/10" aria-hidden />

            {/* header */}
            <div className="flex items-start gap-3 px-5 pt-3">
              {panel.kind === 'interior' ? (
                <>
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[15px] font-black text-white"
                    style={{ backgroundColor: interior?.palette.accent ?? '#2e7d5b' }}
                  >
                    {panel.hotspot === 'bed' ? '🛏' : panel.hotspot === 'stove' ? '🍲' : panel.hotspot === 'tv' ? '📺' : panel.hotspot === 'bath' ? '🚿' : panel.hotspot === 'shop' ? '🧺' : '📋'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="lko-display truncate text-lg leading-tight">{interior?.name ?? 'Indoors'}</h2>
                    <p className="truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]">
                      Inside your own four walls
                    </p>
                  </div>
                </>
              ) : panel.kind === 'garage' ? (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--lko-gold)] text-[20px]">
                    🏍️
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="lko-display truncate text-lg leading-tight">Motor Park Garage</h2>
                    <p className="truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]">
                      Buy your own — drive Lokoja your way
                    </p>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
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
            ) : panel.kind === 'interior' ? (
              <InteriorSheet
                def={interior!}
                hotspotKind={panel.hotspot}
                onClose={() => setPanel({ kind: 'none' })}
                onRest={(k) => {
                  setPanel({ kind: 'none' })
                  restAction(k)
                }}
                onEat={(mealKey, locId) => {
                  eatAction(mealKey, locId)
                }}
                onRelax={(k) => {
                  setPanel({ kind: 'none' })
                  relaxAction(k)
                }}
              />
            ) : panel.kind === 'garage' ? (
              <GaragePanel onClose={() => setPanel({ kind: 'none' })} />
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
  const player = useGameStore((s) => s.player)!
  const origin = LOCATION_BY_ID[world.currentLocation]

  // M4 — public modes + YOUR rides, one shared offer law with the 2D map
  // M8 — the sheet's pump price = the store's pump price (scarcity surge rides)
  const options = allTravelOptions(origin, loc, world.weather, world.timeOfDay, player.vehicles, fuelMultFor(world.day))

  return (
    <div className="flex flex-col gap-2 px-5 pb-4 pt-3">
      <p className="text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
        {loc.description}
      </p>
      {options.map((option) => (
        <TravelRow
          key={option.transport}
          transport={option.transport}
          loc={loc}
          plan={option.plan}
          label={option.label}
          personal={option.personal}
          onConfirm={() => onConfirm(option.transport)}
        />
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
  label,
  personal,
  onConfirm,
}: {
  transport: TransportId
  loc: LokojaLocation
  plan: ReturnType<typeof calculateTravel>
  /** M4 — display label ("Keke" / "Your Okada") */
  label?: string
  /** M4 — your own ride: fuel, not a fare */
  personal?: boolean
  onConfirm: () => void
}) {
  const player = useGameStore((s) => s.player)!
  const noCash = player.cash < plan.cost
  const noEnergy = player.needs.energy < plan.energyCost
  const disabled = noCash || noEnergy

  const reason = noCash
    ? `You need ${formatNaira(plan.cost)}${personal ? ' for fuel' : ''}`
    : noEnergy
      ? 'Too tired for this trip'
      : null

  return (
    <div className={`lko-card flex items-center gap-3 p-3 ${disabled ? 'opacity-60' : ''} ${personal && !disabled ? 'border border-[var(--lko-gold)]/45' : ''}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-[var(--lko-green-deep)]">
        {TRANSPORT_ICON[transport]({ size: 20 })}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-extrabold leading-tight">
          {label ?? (transport === 'walk' ? 'Walk' : transport)}
          {personal && (
            <span className="ml-1.5 rounded-full bg-[var(--lko-gold)]/25 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-[#8a5a00]">
              fuel · no fare
            </span>
          )}
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
  const timeOfDay = useGameStore((s) => s.world?.timeOfDay ?? 'morning')
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
          <MealMenu
            key={a.key}
            title={loc.id === 'food-area' ? '🍲 Mama’s menu — eat now' : '🧺 Market fresh — buy foodstuff'}
            atLocationId={loc.id}
            onEat={onEat}
            // M6 — the outdoor food strip hosts the night stalls after dark
            nightStalls={loc.id === 'food-area' && isNightMarketOpen(timeOfDay)}
          />
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

/* -------------------------------- meal menu --------------------------------- */

/**
 * Shared FOOD.meals list — one store action (eatMeal) behind every row,
 * used by the outdoor activities sheet AND the interior surfaces (stove,
 * Mama's counter, the provisions store).
 */
function MealMenu({
  title,
  atLocationId,
  onEat,
  nightStalls = false,
}: {
  title: string
  atLocationId: string
  onEat: (mealKey: string, atLocationId?: string) => void
  /** M6 — the OUTDOOR food-strip sheet only: the night stalls wake after dark */
  nightStalls?: boolean
}) {
  const cash = useGameStore((s) => s.player?.cash ?? 0)
  const hunger = useGameStore((s) => s.player?.needs.hunger ?? 100)
  const mealPriceAt = useGameStore((s) => s.mealPriceAt)
  const timeOfDay = useGameStore((s) => s.world?.timeOfDay ?? 'morning')
  const nightOpen = nightStalls && atLocationId === 'food-area' && isNightMarketOpen(timeOfDay)
  return (
    <div className="rounded-xl border border-black/[0.06] bg-[var(--lko-gold-soft)]/40 p-2.5">
      <p className="mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]">
        {title}
        <span className="ml-auto rounded-full bg-black/[0.06] px-2 py-0.5 text-[9.5px] font-bold normal-case text-[var(--lko-ink-soft)]">
          hunger {Math.round(hunger)}%
        </span>
      </p>
      <div className="flex flex-col gap-1.5">
        {FOOD.meals.map((m) => {
          // M6 — night dishes live at the night stalls, and only after dark
          if (m.night) return null
          const price = mealPriceAt(m.key, atLocationId)
          const afford = cash >= price
          return (
            <button
              key={m.key}
              disabled={!afford}
              onClick={() => {
                audio.play('click')
                onEat(m.key, atLocationId)
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
                <span className="lko-num text-[12px] font-extrabold text-[var(--lko-green)]">{formatNaira(price)}{price !== m.price && <span className="ml-0.5 text-[9px] font-bold text-[var(--lko-gold-deep)]">today</span>}</span>
                <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">+{m.hunger} 🍲</span>
              </span>
            </button>
          )
        })}
        {nightOpen && (
          <>
            <p className="mt-1 flex items-center justify-between rounded-lg bg-[#0a1230] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[#ffd88a]">
              <span>🌙 Night market dey open</span>
              <span className="font-bold opacity-80">late plates, fair price</span>
            </p>
            {FOOD.meals.filter((m) => m.night).map((m) => {
              const price = mealPriceAt(m.key, atLocationId)
              const afford = cash >= price
              return (
                <button
                  key={m.key}
                  disabled={!afford}
                  onClick={() => {
                    audio.play('click')
                    onEat(m.key, atLocationId)
                  }}
                  className={`lko-press flex min-h-[48px] items-center gap-2.5 rounded-lg border border-[#0a1230]/15 bg-[#0a1230]/[0.04] px-2.5 py-1.5 text-left ${
                    afford ? '' : 'cursor-not-allowed opacity-55'
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-extrabold leading-tight">🌙 {m.label}</span>
                    <span className="block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">{m.detail}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end">
                    <span className="lko-num text-[12px] font-extrabold text-[var(--lko-green)]">{formatNaira(price)}</span>
                    <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">+{m.hunger} 🍲</span>
                  </span>
                </button>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

/* ------------------------------- interior sheet ------------------------------- */

const INTERIOR_ICON: Record<HotspotKind, string> = {
  bed: '🛏',
  stove: '🍲',
  tv: '📺',
  bath: '🚿',
  menu: '📋',
  shop: '🧺',
  exit: '→',
}

const INTERIOR_COPY: Record<HotspotKind, { title: string; sub: string }> = {
  bed: { title: 'Rest a while', sub: 'Sleep till morning restores the most; naps top you up.' },
  stove: { title: 'Cook at the stove', sub: 'The pot at home is the cheapest belly filler.' },
  tv: { title: 'Watch some TV', sub: 'One slot — mood up, small energy back.' },
  bath: { title: 'Freshen up', sub: 'A quick bath — energy and mood, one slot.' },
  menu: { title: 'Food is ready', sub: 'Hot plates straight from the pot.' },
  shop: { title: 'Provisions counter', sub: 'Foodstuff and small chops for the pot.' },
  exit: { title: 'Step outside', sub: '' },
}

function InteriorSheet({
  def,
  hotspotKind,
  onClose,
  onRest,
  onEat,
  onRelax,
}: {
  def: InteriorDef
  hotspotKind: HotspotKind
  onClose: () => void
  onRest: (k: 'nap' | 'sleep') => void
  onEat: (mealKey: string, atLocationId?: string) => void
  onRelax: (k: 'tv' | 'bath') => void
}) {
  const cash = useGameStore((s) => s.player?.cash ?? 0)
  const relax = INTERIOR.relax
  const copy = INTERIOR_COPY[hotspotKind]

  return (
    <div className="flex flex-col gap-2 px-5 pb-4 pt-3">
      <p className="text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]">{copy.sub}</p>

      {/* the bed — real rest through the one store action */}
      {hotspotKind === 'bed' && (
        <div className="grid grid-cols-2 gap-2">
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
      )}

      {/* TV / bath — honest downtime: one clock slot + config-tuned shift */}
      {(hotspotKind === 'tv' || hotspotKind === 'bath') && (
        <button
          onClick={() => {
            audio.play('click')
            onRelax(hotspotKind)
          }}
          className="lko-press lko-card flex min-h-[56px] items-center gap-3 p-3 text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-river-soft)] text-lg">
            {INTERIOR_ICON[hotspotKind]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-extrabold leading-tight">{copy.title}</span>
            <span className="block text-[11px] font-semibold text-[var(--lko-ink-soft)]">
              +{relax[hotspotKind].mood} mood · +{relax[hotspotKind].energy} energy · −{Math.abs(relax[hotspotKind].hunger)} hunger · 1 slot
            </span>
          </span>
          <CheckIcon size={16} className="text-[var(--lko-green)]" />
        </button>
      )}

      {/* cook at home — same meal menu, ledger labels it "at Your Place" */}
      {hotspotKind === 'stove' && (
        <MealMenu title="🍲 Cook at home" atLocationId={def.locationId} onEat={onEat} />
      )}

      {/* Mama's counter + Kpata provisions — the same eating loop, indoors */}
      {(hotspotKind === 'menu' || hotspotKind === 'shop') && (
        <MealMenu
          title={hotspotKind === 'menu' ? '🍲 Mama’s menu — eat now' : '🧺 Market fresh — buy foodstuff'}
          atLocationId={def.locationId}
          onEat={onEat}
        />
      )}

      {/* cash strip so the player always sees affordability context */}
      {(hotspotKind === 'stove' || hotspotKind === 'menu' || hotspotKind === 'shop') && (
        <p className="flex items-center justify-between rounded-lg bg-black/[0.04] px-3 py-2 text-[11px] font-bold text-[var(--lko-ink-soft)]">
          <span>Wallet</span>
          <span className="lko-num text-[12px] font-extrabold text-[var(--lko-green)]">{formatNaira(cash)}</span>
        </p>
      )}

      <button
        onClick={onClose}
        className="lko-press mt-1 flex min-h-[44px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]"
      >
        Close
      </button>
    </div>
  )
}
