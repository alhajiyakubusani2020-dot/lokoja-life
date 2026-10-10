'use client'

/**
 * LOKOJA LIFE — Location markers (Stage 3.5)
 * -------------------------------------------
 * Every stable location id gets a physical presence in the 3D world:
 * a coloured pin, a floating name label, a "you are here" ring, and a
 * generous invisible tap target. Tapping opens the same location sheet
 * the 2D map uses — one interaction language across both views.
 */

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { makeLabelSprite } from './assets'
import { ANCHORS, groundHeight } from '@/game/data/world3d'
import { LOCATIONS, type LokojaLocation } from '@/game/data/locations'

export interface MarkerProps {
  currentLocationId: string
  playerLevel: number
  onSelect: (locationId: string) => void
}

function LocationPin({
  location,
  isCurrent,
  isLocked,
  onSelect,
}: {
  location: LokojaLocation
  isCurrent: boolean
  isLocked: boolean
  onSelect: () => void
}) {
  const pin = useRef<THREE.Group>(null!)
  const ring = useRef<THREE.Mesh>(null!)
  /** tap-vs-drag guard: walking players drag the camera constantly —
      only a genuine tap (small finger travel) opens the sheet */
  const downAt = useRef<{ x: number; y: number } | null>(null)

  const pos = useMemo(() => {
    const a = ANCHORS[location.id]
    return { x: a.standX, z: a.standZ, y: groundHeight(a.standX, a.standZ) }
  }, [location.id])

  const label = useMemo(
    () => makeLabelSprite(location.shortName, location.emoji, isLocked ? '#8a8a80' : location.color),
    [location, isLocked],
  )

  const color = useMemo(
    () => new THREE.Color(isLocked ? '#8a8a80' : location.color),
    [location.color, isLocked],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (pin.current) {
      pin.current.position.y = pos.y + 6.2 + Math.sin(t * 2 + location.mapX) * (isCurrent ? 0.55 : 0.25)
      pin.current.rotation.y = t * (isCurrent ? 1.2 : 0.4)
    }
    if (ring.current) {
      const pulse = isCurrent ? 1 + Math.sin(t * 3) * 0.12 : 1
      ring.current.scale.set(pulse, pulse, pulse)
    }
  })

  return (
    <group position={[pos.x, 0, pos.z]}>
      {/* invisible generous tap target (tap-only: drags orbit the camera) */}
      <mesh
        position={[0, 3.5, 0]}
        onPointerDown={(e) => {
          downAt.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY }
        }}
        onPointerUp={(e) => {
          e.stopPropagation()
          const d = downAt.current
          downAt.current = null
          if (d) {
            const travel = Math.hypot(e.nativeEvent.clientX - d.x, e.nativeEvent.clientY - d.y)
            if (travel > 10) return // that was a camera drag, not a tap
          }
          onSelect()
        }}
      >
        <cylinderGeometry args={[4.6, 4.6, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* ground ring — green when you stand here */}
      {isCurrent && (
        <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
          <ringGeometry args={[3.4, 4.4, 28]} />
          <meshBasicMaterial color="#1B7A43" transparent opacity={0.75} depthWrite={false} />
        </mesh>
      )}

      {/* pin: pole + floating diamond */}
      <mesh position={[0, pos.y + 2.6, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 5.2, 6]} />
        <meshLambertMaterial color="#fffdf7" />
      </mesh>
      <group ref={pin}>
        <mesh>
          <octahedronGeometry args={[1.5, 0]} />
          <meshLambertMaterial color={color} emissive={color} emissiveIntensity={isCurrent ? 0.35 : 0.12} />
        </mesh>
        {isLocked && (
          <mesh position={[0, 0, 1.35]}>
            <boxGeometry args={[0.5, 0.42, 0.2]} />
            <meshLambertMaterial color="#5a5a52" />
          </mesh>
        )}
      </group>

      {/* name label (sprite, always readable) */}
      <primitive object={label} position={[0, pos.y + 10.2, 0]} />
    </group>
  )
}

export function LocationMarkers({ currentLocationId, playerLevel, onSelect }: MarkerProps) {
  return (
    <group>
      {LOCATIONS.map((l) => (
        <LocationPin
          key={l.id}
          location={l}
          isCurrent={l.id === currentLocationId}
          isLocked={playerLevel < l.unlockLevel}
          onSelect={() => onSelect(l.id)}
        />
      ))}
    </group>
  )
}
