'use client'

/**
 * LOKOJA LIFE — WorldScene (Stage 3.6)
 * -------------------------------------
 * The react-three-fiber canvas: assembles terrain, water, roads, the
 * city, vegetation, life, markers, lighting and the camera rig into one
 * continuous Lokoja. Player state flows in through props from the store
 * — the scene never mutates game state. Stage 3.6: the avatar walks the
 * world via the shared movement controller and settles into zones.
 */

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { WorldAssetsProvider } from './assets'
import { Lighting } from './Lighting'
import { TerrainMesh, WaterMesh, ConfluenceLife, RoadsMesh, RoadDetails, BridgeMesh, StreetLights, NightGlow } from './Ground'
import { CityBuildings, Landmarks, Billboards } from './City'
import { Vegetation } from './Nature'
import { People, Vehicles, PlayerAvatar, type TravelAnim } from './Life'
import { LocationMarkers } from './Markers'
import { CameraRig, type CameraMode } from './CameraRig'
import { initKeyboardControls, playerPos } from './controls'
import type { TimeOfDay, Weather } from '@/game/types'

export interface WorldSceneProps {
  timeOfDay: TimeOfDay
  weather: Weather
  currentLocationId: string
  playerLevel: number
  travel: TravelAnim | null
  avatar: { skinTone: string; hairColor: string; clothingColor: string }
  cameraMode: CameraMode
  onSelectLocation: (id: string) => void
  onSettle: (id: string) => void
  onNearChange: (id: string | null) => void
  onWalkDrain: (units: number) => void
}

/** Loading placeholder shown while geometries build (fast, but honest). */
function SceneLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial />
    </mesh>
  )
}

function SceneContent(props: WorldSceneProps) {
  return (
    <>
      <Lighting timeOfDay={props.timeOfDay} weather={props.weather} />
      <CameraRig mode={props.cameraMode} focusKey={props.currentLocationId} />

      <Suspense fallback={<SceneLoader />}>
        <TerrainMesh />
        <WaterMesh />
        <RoadsMesh />
        <RoadDetails />
        <BridgeMesh />
        <StreetLights />
        <NightGlow />
        <CityBuildings />
        <Landmarks />
        <Billboards />
        <Vegetation />
        <People />
        <Vehicles />
        <ConfluenceLife />
        <PlayerAvatar
          currentLocationId={props.currentLocationId}
          travel={props.travel}
          avatar={props.avatar}
          onSettle={props.onSettle}
          onNearChange={props.onNearChange}
          onWalkDrain={props.onWalkDrain}
        />
        <LocationMarkers
          currentLocationId={props.currentLocationId}
          playerLevel={props.playerLevel}
          onSelect={props.onSelectLocation}
        />
      </Suspense>
    </>
  )
}

export default function WorldScene(props: WorldSceneProps) {
  // keyboard movement (WASD / arrows / shift) — one controller for all input
  useEffect(() => initKeyboardControls(), [])

  // tiny debug/testing handle (player world position) — read-only for tools
  useEffect(() => {
    ;(window as unknown as { __lko?: { playerPos: typeof playerPos } }).__lko = { playerPos }
    return () => {
      delete (window as unknown as { __lko?: unknown }).__lko
    }
  }, [])

  return (
    <Canvas
      id="lko-world-canvas"
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.5, far: 1000, position: [40, 55, 150] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      flat
      style={{ touchAction: 'none' }}
    >
      <WorldAssetsProvider>
        <SceneContent {...props} />
      </WorldAssetsProvider>
    </Canvas>
  )
}
