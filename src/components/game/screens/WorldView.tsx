'use client'

/**
 * LOKOJA LIFE — WorldView (Stage 3.6)
 * ------------------------------------
 * The 3D world as the game's main view: full-bleed canvas + HUD overlay.
 * Stage 3.6: the virtual joystick (lower-left) walks the actual player,
 * a sprint button runs, a "near" chip shows the zone you're walking
 * through, and walking into a location settles you there through the
 * store. Sheets lock walking input so keys never move a hidden avatar.
 * All game actions still flow through the store — zero new mechanics.
 */

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { LocationSheet } from '../LocationSheet'
import { StatusPanel } from './StatusPanel'
import { conditionSummary } from '@/game/systems/needs'
import { formatNaira } from '@/game/systems/progression'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { focusCameraOnPlayer, type CameraMode } from '../world3d/CameraRig'
import { Joystick, SprintButton } from '../world3d/Joystick'
import { inputLock, resetInputs } from '../world3d/controls'
import { Icon, weatherIcon } from '../ui/icons'
import { GlassChip, IconBtn, SheetShell, Btn } from '../ui/kit'
import { probeWebGL } from '@/game/systems/device'
import type { TravelAnim } from '../world3d/Life'
import type { TransportId } from '@/game/types'

/** The WebGL scene loads client-side only — the game is a browser game. */
const WorldScene = dynamic(() => import('../world3d/WorldScene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#cfe3d2]">
      <div className="lko-float text-[var(--lko-green-deep)]" aria-hidden>
        <Icon name="compass" size={44} strokeWidth={1.4} />
      </div>
      <p className="lko-display text-base text-[var(--lko-green-deep)]">Building Lokoja…</p>
      <p className="text-xs font-semibold text-[#3c5a44]">terrain • rivers • the city</p>
    </div>
  ),
})

/** matches TRAVEL.transitionMs — how long the store's trip takes */
const TRAVEL_MS = 850

export function WorldView({ onOpenTab }: { onOpenTab?: (tab: 'map' | 'work' | 'bag' | 'profile') => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const isTravelling = useGameStore((s) => s.isTravelling)

  const [sheetId, setSheetId] = useState<string | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [cameraMode, setCameraMode] = useState<CameraMode>('follow')
  const [nearId, setNearId] = useState<string | null>(null)
  /** captured the moment a journey starts — drives the 3D journey */
  const [travelAnim, setTravelAnim] = useState<TravelAnim | null>(null)
  /** M7 — can this device do 3D at all? One throwaway probe context at mount */
  const [gl] = useState(() => probeWebGL())
  const webglCapable = gl.webgl1 || gl.webgl2

  const condition = conditionSummary(player.needs)
  const location = LOCATION_BY_ID[world.currentLocation] ?? LOCATION_BY_ID['home']
  const nearLocation = nearId ? LOCATION_BY_ID[nearId] : null

  /* ------------------------- travel animation capture ------------------------- */

  // remember the last settled location so journeys can start from it
  const settledLocation = useRef(world.currentLocation)
  useEffect(() => {
    if (!isTravelling) settledLocation.current = world.currentLocation
  }, [isTravelling, world.currentLocation])

  // when the store's trip completes, retire the animation
  useEffect(() => {
    if (isTravelling || !travelAnim) return
    const t = setTimeout(() => setTravelAnim(null), 260)
    return () => clearTimeout(t)
  }, [isTravelling, travelAnim])

  /**
   * Travel interceptor for the world's own location sheet: capture the
   * journey (origin → destination by transport) BEFORE the store action
   * runs, then hand off to the ONE travel action — same fares, same
   * clock, same guards. Journeys started from the 2D map simply play no
   * animation (the avatar is re-anchored on return).
   */
  const handleTravel = (destinationId: string, transport: TransportId) => {
    if (isTravelling) return
    setTravelAnim({
      fromId: settledLocation.current,
      toId: destinationId,
      transport,
      startedAt: performance.now(),
    })
    useGameStore.getState().travel(destinationId, transport)
  }

  /* --------------------------- free walking wiring ---------------------------- */

  // sheets lock walking so keyboard input never moves a hidden avatar
  useEffect(() => {
    inputLock.locked = sheetId !== null || statusOpen || isTravelling
    if (inputLock.locked) resetInputs()
    return () => {
      inputLock.locked = false
    }
  }, [sheetId, statusOpen, isTravelling])

  const handleSettle = (locationId: string) => {
    useGameStore.getState().settleAt(locationId)
  }
  const handleWalkDrain = (units: number) => {
    useGameStore.getState().drainWalkingEnergy(units)
  }

  const handleSelect = (id: string) => {
    audio.play('click')
    setSheetId(id)
  }

  const cash = formatNaira(player.cash)

  return (
    <div className="relative h-[calc(100dvh-57px-env(safe-area-inset-bottom))] min-h-[360px] w-full overflow-hidden">
      {!webglCapable ? (
        /* -------- M7 — NO-WEBGL FALLBACK: the game never dead-ends. The
           2D map is the same city (travel, sheets, phone all work), so a
           device without WebGL plays Lokoja in Map Mode instead of
           staring at a black canvas. -------- */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#cfe3d2] p-6 text-center">
          <div className="lko-float text-[var(--lko-green-deep)]" aria-hidden>
            <Icon name="map" size={44} strokeWidth={1.4} />
          </div>
          <p className="lko-display text-lg text-[var(--lko-green-deep)]">Map Mode</p>
          <p className="max-w-[300px] text-[13px] font-semibold leading-relaxed text-[#3c5a44]">
            This device can’t open the 3D world — so Lokoja runs on the living map instead.
            Travel, work, markets and your phone all work exactly the same.
          </p>
          <Btn
            onClick={() => {
              audio.play('click')
              onOpenTab?.('map')
            }}
          >
            Open the map
          </Btn>
        </div>
      ) : (
        <WorldScene
          timeOfDay={world.timeOfDay}
          weather={world.weather}
          currentLocationId={world.currentLocation}
          playerLevel={player.level}
          travel={travelAnim}
          avatar={{
            skinTone: player.avatar.skinTone,
            hairColor: player.avatar.hairColor,
            clothingColor: player.avatar.clothingColor,
          }}
          cameraMode={cameraMode}
          onSelectLocation={handleSelect}
          onSettle={handleSettle}
          onNearChange={setNearId}
          onWalkDrain={handleWalkDrain}
        />
      )}

      {/* ------------------------------ HUD overlay ------------------------------ */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3">
        {/* top clusters */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-1.5">
            {/* where am I — opens the location sheet */}
            <button
              onClick={() => handleSelect(world.currentLocation)}
              className="lko-press pointer-events-auto flex min-h-[40px] items-center gap-1.5 rounded-full lko-glass px-3.5 pr-2.5 text-[13px] font-extrabold text-[var(--lko-ink)]"
            >
              <Icon name="pin" size={14} className="text-[var(--lko-green)]" />
              {isTravelling ? (
                <span className="animate-pulse text-[#8a5a00]">Travelling…</span>
              ) : (
                location.shortName
              )}
              {!isTravelling && <Icon name="chevron-down" size={13} className="opacity-45" />}
            </button>
            {/* quick controls */}
            <div className="flex items-center gap-1.5">
              <IconBtn icon="heart" label="My status" onClick={() => { audio.play('click'); setStatusOpen(true) }} />
              <IconBtn icon="map" label="Open the 2D map" onClick={() => { audio.play('click'); onOpenTab?.('map') }} />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <GlassChip className="tabular-nums">
              <Icon name="cash" size={14} className="text-[var(--lko-green-deep)]" />
              {cash}
              <span className="mx-0.5 opacity-30">•</span>
              <Icon name="star" size={13} className="text-[var(--lko-gold)]" />
              {player.level}
            </GlassChip>
            <GlassChip tone="gold">
              <Icon name={weatherIcon(world.weather)} size={14} />
              Day {world.day} • {TIME_LABEL[world.timeOfDay] ?? 'Lokoja'}
            </GlassChip>
            <GlassChip
              tone={condition.tone === 'bad' ? 'bad' : 'plain'}
              className="max-w-[168px]"
            >
              <span
                aria-hidden
                className={`h-2 w-2 shrink-0 rounded-full ${
                  condition.tone === 'bad'
                    ? 'bg-red-500'
                    : condition.tone === 'good'
                      ? 'bg-[var(--lko-green)]'
                      : 'bg-[var(--lko-gold)]'
                }`}
              />
              <span className="truncate">{condition.text}</span>
            </GlassChip>
          </div>
        </div>

        {/* bottom controls — joystick lower-left (own layer), actions lower-right */}
        <div className="flex items-end justify-between gap-2">
          <div className="h-[124px]" /> {/* reserves the joystick's touch zone */}
          <div className="flex flex-col items-end gap-1.5">
            {/* near-location hint while exploring on foot */}
            {nearLocation && !isTravelling && nearLocation.id !== world.currentLocation && (
              <button
                onClick={() => handleSelect(nearLocation.id)}
                className="lko-press pointer-events-auto flex max-w-[210px] items-center gap-1.5 rounded-full bg-[var(--lko-green)]/92 px-3.5 py-2 text-[12px] font-extrabold text-white shadow-[0_8px_24px_-8px_rgba(10,61,38,0.7)] backdrop-blur-sm"
              >
                <Icon name="pin" size={13} />
                <span className="truncate">Near {nearLocation.shortName}</span>
                <span className="rounded-full bg-white/20 px-1.5 py-px text-[10px]">tap</span>
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <IconBtn
                icon={cameraMode === 'follow' ? 'camera-follow' : 'camera-free'}
                label={cameraMode === 'follow' ? 'Switch to free camera' : 'Switch to follow camera'}
                active={cameraMode === 'free'}
                onClick={() => {
                  audio.play('click')
                  setCameraMode((m) => (m === 'follow' ? 'free' : 'follow'))
                }}
              />
              <IconBtn
                icon="locate"
                label="Find me — back to follow camera"
                onClick={() => {
                  audio.play('click')
                  setCameraMode('follow') // a clear way back to the player camera
                  focusCameraOnPlayer()
                }}
              />
            </div>
            <SprintButton disabled={isTravelling || !webglCapable} />
            <p className="pointer-events-none rounded-full bg-black/32 px-2.5 py-1 text-[10px] font-bold text-white/90 backdrop-blur-[2px]">
              {cameraMode === 'follow' ? 'drag orbit • pinch zoom' : 'drag pan • pinch zoom'}
            </p>
          </div>
        </div>
      </div>

      {/* the joystick mounts ABOVE the overlay (its own pointer space) */}
      <Joystick disabled={isTravelling || !webglCapable} />

      {/* ------------------------------- sheets -------------------------------- */}

      {sheetId && (
        <LocationSheet
          locationId={sheetId}
          onClose={() => setSheetId(null)}
          onOpenWork={() => onOpenTab?.('work')}
          onTravel={handleTravel}
        />
      )}

      {statusOpen && (
        <SheetShell label="Your status" onClose={() => setStatusOpen(false)}>
          <StatusPanel onOpenMap={onOpenTab ? () => onOpenTab('map') : undefined} />
          <Btn variant="ghost" onClick={() => { audio.play('click'); setStatusOpen(false) }} className="mt-2">
            Close
          </Btn>
        </SheetShell>
      )}
    </div>
  )
}

const TIME_LABEL: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  night: 'Night',
}
