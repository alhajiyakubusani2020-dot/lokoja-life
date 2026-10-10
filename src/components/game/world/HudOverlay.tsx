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
import { calculateTravel } from '@/game/systems/travel'
import { formatNaira } from '@/game/systems/progression'
import type { TransportId } from '@/game/types'
import { audio } from '@/game/systems/audio'
import {
  ArrowLeftIcon, CheckIcon, ClockIcon, CoinsIcon, EnergyIcon, KekeIcon,
  LockIcon, MapIcon, MoonIcon, PinIcon, PlaceIcon, TaxiIcon, WalkIcon,
  WeatherIcon, WorkIcon, TimeIcon,
} from '../icons'
import { attachControls, consumeInteract, freezeInput, queueInteract, setJoystick, setSprint } from './controls'

const TRANSPORT_ICON: Record<TransportId, (p: { size?: number }) => React.ReactNode> = {
  walk: (p) => <WalkIcon {...p} />,
  keke: (p) => <KekeIcon {...p} />,
  taxi: (p) => <TaxiIcon {...p} />,
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

/* ------------------------------- world HUD root ------------------------------ */

type PanelState =
  | { kind: 'none' }
  | { kind: 'activities'; loc: LokojaLocation }
  | { kind: 'travel'; loc: LokojaLocation }

export function HudOverlay({
  nearestAnchor,
  onExit,
  onOpenWork,
  onOpenMap,
}: {
  /** anchor currently in interact range (reported by the 3D scene), null = none */
  nearestAnchor: string | null
  onExit: () => void
  onOpenWork: () => void
  onOpenMap: (locationId: string) => void
}) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const isTravelling = useGameStore((s) => s.isTravelling)
  const travelAction = useGameStore((s) => s.travel)
  const restAction = useGameStore((s) => s.rest)

  const surfaceRef = useRef<HTMLDivElement>(null)
  const nearestRef = useRef<string | null>(null)
  const [panel, setPanel] = useState<PanelState>({ kind: 'none' })

  // keep the polling loop's view of the nearest anchor fresh (ref write in effect)
  useEffect(() => {
    nearestRef.current = nearestAnchor
  }, [nearestAnchor])

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

  // interact polling (E / Enter / HUD button) + Escape closes sheets
  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (consumeInteract() && nearestRef.current) {
        const anchorId = nearestRef.current
        const loc = LOCATION_BY_ID[anchorId]
        if (loc) {
          audio.play('click')
          setPanel({ kind: anchorId === world.currentLocation ? 'activities' : 'travel', loc })
        }
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
  }, [world.currentLocation])

  // freeze walking while a sheet is open
  useEffect(() => {
    freezeInput(panel.kind !== 'none' || isTravelling)
  }, [panel, isTravelling])

  const openPanelFor = (anchorId: string | null) => {
    if (!anchorId) return
    const loc = LOCATION_BY_ID[anchorId]
    if (!loc) return
    audio.play('click')
    setPanel({ kind: anchorId === world.currentLocation ? 'activities' : 'travel', loc })
  }

  const currentLoc = LOCATION_BY_ID[world.currentLocation]
  const promptLoc = nearestAnchor ? LOCATION_BY_ID[nearestAnchor] : null
  const promptAnchor = nearestAnchor

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
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex min-w-0 items-center gap-2">
          <button
            onClick={() => {
              audio.play('click')
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
        </div>
      </div>

      {/* ---------- interact prompt ---------- */}
      {promptLoc && panel.kind === 'none' && !isTravelling && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-32 flex justify-center px-6 sm:bottom-10">
          <button
            onClick={() => openPanelFor(promptAnchor)}
            className="lko-press lko-pop flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-black/55 px-5 py-3 text-white shadow-[var(--lko-shadow-lg)] backdrop-blur-md"
          >
            <PlaceIcon id={promptLoc.id} size={17} className="shrink-0 text-[#ffd88a]" />
            <span className="truncate text-[14px] font-extrabold">
              {promptAnchor === world.currentLocation
                ? `You're at ${promptLoc.name} — tap to see what's here`
                : `Travel to ${promptLoc.name}`}
            </span>
            {!touchMode && (
              <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold">E</kbd>
            )}
          </button>
        </div>
      )}

      {/* ---------- touch controls ---------- */}
      {touchMode && panel.kind === 'none' && (
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
  onOpenWork,
  onOpenMap,
}: {
  loc: LokojaLocation
  onRest: (k: 'nap' | 'sleep') => void
  onOpenWork: () => void
  onOpenMap: () => void
}) {
  const isHome = loc.id === 'home'

  return (
    <div className="flex flex-col gap-2 px-5 pb-4 pt-3">
      <p className="text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]">{loc.description}</p>

      {loc.activities.map((a) => {
        // 'rest' renders as the Nap/Sleep pair; its sibling 'sleep' key is the
        // same action in data — skip the duplicate row
        if (a.key === 'sleep') return null
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
