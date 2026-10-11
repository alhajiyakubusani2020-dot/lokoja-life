'use client'

/**
 * LOKOJA LIFE — Actors (Stage 3D)
 * ---------------------------------
 * Everything that moves in the world:
 *  - PlayerController: unified joystick/keyboard input, collision, terrain
 *    grounding, walk-cycle animation, character tinted from the player's
 *    ACTUAL avatar config in the save.
 *  - CameraRig: smooth third-person follow with drag-look + soft auto-align.
 *  - NPCs strolling the lively districts (fewer at night — the real clock).
 *  - Keke/okada/taxi traffic driving the road loops.
 *  - Rain particles when the real weather says so.
 *
 * No gameplay logic lives here: movement is free expression, while money,
 * time and location authority stay in the store.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import type { AvatarConfig, TimeOfDay, Weather } from '@/game/types'
import {
  ANCHOR_BY_ID, DISTRICTS, heightAt, NPC_ZONES, POINTS_OF_INTEREST, TRAFFIC_LOOPS,
} from '@/game/world3d/layout'
import { bridgeDeckY, resolvePosition } from '@/game/world3d/collision'
import { NPCS } from '@/game/data/npcs'
import { WORLD3D } from '@/game/data/config'
import {
  addWalkDistance, consumeLook, consumeZoom, isInputFrozen, MOVE, playerPos,
  readMoveInput, reportPlayerPos,
} from './controls'

/* --------------------------- shared character parts -------------------------- */

/** lightweight stylised Lokoja resident */
function CharacterMesh({
  skin, cloth, hair, hairStyle, dress, speedRef,
}: {
  skin: string
  cloth: string
  hair: string
  hairStyle: 'none' | 'cap' | 'volume'
  dress: boolean
  /** live movement speed (units/s) — drives the walk cycle; 0 = idle */
  speedRef: { current: number }
}) {
  const leftArm = useRef<THREE.Mesh>(null)
  const rightArm = useRef<THREE.Mesh>(null)
  const leftLeg = useRef<THREE.Mesh>(null)
  const rightLeg = useRef<THREE.Mesh>(null)
  const body = useRef<THREE.Group>(null)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase
    const s = speedRef.current
    const walk = Math.min(1, s / 4)
    const swing = Math.sin(t * 9) * walk * 0.55
    if (leftArm.current) leftArm.current.rotation.x = swing
    if (rightArm.current) rightArm.current.rotation.x = -swing
    if (leftLeg.current) leftLeg.current.rotation.x = -swing
    if (rightLeg.current) rightLeg.current.rotation.x = swing
    if (body.current) body.current.position.y = Math.abs(Math.sin(t * 9)) * walk * 0.06
  })

  return (
    <group ref={body}>
      {/* legs */}
      <mesh ref={leftLeg} position={[-0.13, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.5, 3, 6]} />
        <meshStandardMaterial color="#2e2a26" roughness={1} />
      </mesh>
      <mesh ref={rightLeg} position={[0.13, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.5, 3, 6]} />
        <meshStandardMaterial color="#2e2a26" roughness={1} />
      </mesh>
      {/* dress cone over legs */}
      {dress && (
        <mesh position={[0, 0.62, 0]} castShadow>
          <coneGeometry args={[0.42, 0.72, 10]} />
          <meshStandardMaterial color={cloth} roughness={0.9} />
        </mesh>
      )}
      {/* torso */}
      <mesh position={[0, dress ? 1.14 : 1.02, 0]} castShadow>
        <capsuleGeometry args={[dress ? 0.2 : 0.24, dress ? 0.4 : 0.52, 4, 8]} />
        <meshStandardMaterial color={cloth} roughness={0.9} />
      </mesh>
      {/* arms */}
      <mesh ref={leftArm} position={[-0.34, dress ? 1.2 : 1.12, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.46, 3, 6]} />
        <meshStandardMaterial color={cloth} roughness={0.9} />
      </mesh>
      <mesh ref={rightArm} position={[0.34, dress ? 1.2 : 1.12, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.46, 3, 6]} />
        <meshStandardMaterial color={cloth} roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, dress ? 1.66 : 1.56, 0]} castShadow>
        <sphereGeometry args={[0.21, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.75} />
      </mesh>
      {/* hair */}
      {hairStyle === 'cap' && (
        <mesh position={[0, dress ? 1.74 : 1.64, -0.02]} scale={[1.04, 0.7, 1.04]}>
          <sphereGeometry args={[0.21, 10, 10]} />
          <meshStandardMaterial color={hair} roughness={1} />
        </mesh>
      )}
      {hairStyle === 'volume' && (
        <mesh position={[0, dress ? 1.82 : 1.72, 0]}>
          <sphereGeometry args={[0.27, 10, 10]} />
          <meshStandardMaterial color={hair} roughness={1} />
        </mesh>
      )}
    </group>
  )
}

/** soft blob shadow — reads as contact shadow, costs one quad */
function BlobShadow({ scale = 1 }: { scale?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
      <circleGeometry args={[0.5 * scale, 12]} />
      <meshBasicMaterial color="#1a2016" transparent opacity={0.28} depthWrite={false} />
    </mesh>
  )
}

/* ------------------------------- player character ----------------------------- */

const VOLUME_HAIR = new Set(['afro', 'puffs', 'dreads', 'braids'])
const CAP_HAIR = new Set(['low-cut', 'waves', 'cornrows'])
const DRESS_STYLES = new Set(['kaftan'])

export function PlayerAvatar({ avatar, speedRef }: { avatar: AvatarConfig; speedRef: { current: number } }) {
  return (
    <CharacterMesh
      skin={avatar.skinTone}
      cloth={avatar.clothingColor}
      hair={avatar.hairColor}
      hairStyle={
        VOLUME_HAIR.has(avatar.hairstyle) ? 'volume' : CAP_HAIR.has(avatar.hairstyle) ? 'cap' : 'none'
      }
      dress={DRESS_STYLES.has(avatar.clothingStyle)}
      speedRef={speedRef}
    />
  )
}

/* -------------------------------- player controller ---------------------------- */

export function PlayerController({
  avatar,
  spawnLocationId,
  onPosition,
  onNearestAnchor,
  onDistrict,
}: {
  avatar: AvatarConfig
  spawnLocationId: string
  onPosition?: (x: number, z: number) => void
  onNearestAnchor?: (anchorId: string | null) => void
  onDistrict?: (districtId: string | null) => void
}) {
  const group = useRef<THREE.Group>(null)
  const playerSpeed = useRef(0)

  const state = useRef({
    x: 0,
    z: 0,
    vx: 0,
    vz: 0,
    yaw: 0,
    camYaw: 0,
    camPitch: 0.42,
    camDist: MOVE.cameraDistance as number,
    speed: 0,
    anchorId: null as string | null,
    districtId: null as string | null,
    teleport: null as { x: number; z: number } | null,
  })

  const { camera } = useThree()

  // spawn at the player's actual current location
  useEffect(() => {
    const a = ANCHOR_BY_ID[spawnLocationId]
    if (!a || !group.current) return
    const s = state.current
    s.x = a.x + 4
    s.z = a.z + 5
    // face the camera toward the anchor
    s.camYaw = Math.atan2(a.x - s.x, a.z - s.z)
    const groundY = heightAt(s.x, s.z)
    group.current.position.set(s.x, groundY, s.z)
    // snap the camera to the correct rig position on the FIRST frame
    // (no slow lerp from the default canvas position)
    const cosP = Math.cos(s.camPitch)
    camera.position.set(
      s.x - Math.sin(s.camYaw) * s.camDist * cosP,
      groundY + MOVE.cameraHeight + Math.sin(s.camPitch) * s.camDist * 0.9,
      s.z - Math.cos(s.camYaw) * s.camDist * cosP,
    )
    camera.lookAt(a.x, a.y + 1.6, a.z)

    // dev/E2E debug bridge (stripped from production builds)
    if (process.env.NODE_ENV !== 'production') {
      ;(window as unknown as Record<string, unknown>).__lko = {
        teleport: (x: number, z: number) => {
          state.current.teleport = { x, z }
        },
        pos: () => ({ x: state.current.x, z: state.current.z }),
        anchors: Object.fromEntries(
          Object.entries(ANCHOR_BY_ID).map(([id, an]) => [id, { x: an.x, z: an.z }]),
        ),
        // E2E: feed the walked-meters accumulator directly (the frame loop
        // feeds it via addWalkDistance(s.speed*dt) — this skips terrain fights)
        walk: (m: number) => addWalkDistance(m),
      }
    }
    return () => {
      delete (window as unknown as Record<string, unknown>).__lko
    }
  }, [spawnLocationId])

  useFrame((_, rawDt) => {
    const s = state.current
    const dt = Math.min(rawDt, 0.05)
    const g = group.current
    if (!g) return

    // debug teleport (E2E)
    if (s.teleport) {
      s.x = s.teleport.x
      s.z = s.teleport.z
      s.vx = 0
      s.vz = 0
      s.teleport = null
    }

    const frozen = isInputFrozen()

    // ---- look ----
    const look = consumeLook()
    s.camYaw -= look.dx * 0.0042
    s.camPitch = THREE.MathUtils.clamp(s.camPitch + look.dy * 0.0032, MOVE.camPitchMin, MOVE.camPitchMax)

    // ---- movement (camera-relative) ----
    const input = readMoveInput()
    const moving = !frozen && (Math.abs(input.x) > 0.01 || Math.abs(input.y) > 0.01)
    const targetSpeed = moving ? (input.sprint ? MOVE.sprintSpeed : MOVE.walkSpeed) : 0

    let tx = 0
    let tz = 0
    if (moving) {
      const sin = Math.sin(s.camYaw)
      const cos = Math.cos(s.camYaw)
      // forward = -z when yaw=0 → rotate input by camYaw
      tx = (input.x * cos - input.y * sin)
      tz = (-input.x * sin - input.y * cos)
      const len = Math.hypot(tx, tz) || 1
      tx = (tx / len) * targetSpeed
      tz = (tz / len) * targetSpeed
    }

    const accel = MOVE.accel * dt
    s.vx += THREE.MathUtils.clamp(tx - s.vx, -accel, accel)
    s.vz += THREE.MathUtils.clamp(tz - s.vz, -accel, accel)

    let nx = s.x + s.vx * dt
    let nz = s.z + s.vz * dt
    ;[nx, nz] = resolvePosition(nx, nz)
    s.x = nx
    s.z = nz
    s.speed = Math.hypot(s.vx, s.vz)

    // presentation MEASURES (the store APPLIES on exit) — metres walked
    if (!frozen) addWalkDistance(s.speed * dt)
    reportPlayerPos(s.x, s.z)

    // slide dampening when blocked
    if (s.speed > 0.01) {
      const dot = (s.vx * tx + s.vz * tz) / (s.speed * (targetSpeed || 1) + 1e-6)
      if (targetSpeed > 0 && dot < 0.4) {
        s.vx *= 0.6
        s.vz *= 0.6
      }
    }

    // ---- ground ----
    const deckY = bridgeDeckY(s.x, s.z)
    const groundY = deckY ?? heightAt(s.x, s.z)
    g.position.set(s.x, groundY, s.z)

    // face movement direction
    if (s.speed > 0.4) {
      const targetYaw = Math.atan2(s.vx, s.vz)
      let d = targetYaw - s.yaw
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      s.yaw += d * Math.min(1, dt * 10)
    }
    g.rotation.y = s.yaw

    // ---- nearest anchor / point of interest (interaction discovery) ----
    let nearestId: string | null = null
    let nearestD = Infinity
    for (const [id, a] of Object.entries(ANCHOR_BY_ID)) {
      const d = Math.hypot(a.x - s.x, a.z - s.z)
      if (d < MOVE.interactRadius && d < nearestD) {
        nearestD = d
        nearestId = id
      }
    }
    // physical props (job boards) are interactables too — namespaced ids
    for (const p of POINTS_OF_INTEREST) {
      const d = Math.hypot(p.x - s.x, p.z - s.z)
      if (d < MOVE.interactRadius * 0.62 && d < nearestD) {
        nearestD = d
        nearestId = `poi:${p.id}`
      }
    }
    const changed = nearestId !== s.anchorId
    s.anchorId = nearestId
    if (onNearestAnchor && changed) {
      onNearestAnchor(nearestId)
    }

    // ---- district awareness (the HUD shows arrival toasts) ----
    let districtNow: string | null = null
    for (const d of DISTRICTS) {
      if (Math.hypot(d.x - s.x, d.z - s.z) <= d.radius) {
        districtNow = d.id
        break
      }
    }
    if (onDistrict && districtNow !== s.districtId) {
      s.districtId = districtNow
      onDistrict(districtNow)
    }

    if (onPosition) onPosition(s.x, s.z)
    playerSpeed.current = s.speed

    // ---- camera ----
    s.camDist = THREE.MathUtils.clamp(s.camDist + consumeZoom(), MOVE.cameraMinDistance, MOVE.cameraMaxDistance)

    // soft auto-align behind the running player
    if (s.speed > 1.5 && look.dx === 0) {
      let d = s.yaw - s.camYaw
      while (d > Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      s.camYaw += d * Math.min(1, dt * MOVE.camAlignRate * 0.12)
    }

    // third-person rig — parked BEHIND the player (opposite the view dir)
    const cosP = Math.cos(s.camPitch)
    const desired = new THREE.Vector3(
      s.x - Math.sin(s.camYaw) * s.camDist * cosP,
      groundY + MOVE.cameraHeight + Math.sin(s.camPitch) * s.camDist * 0.9,
      s.z - Math.cos(s.camYaw) * s.camDist * cosP,
    )
    // keep the camera above terrain
    const camGround = heightAt(desired.x, desired.z) + 1.2
    if (desired.y < camGround) desired.y = camGround
    camera.position.lerp(desired, Math.min(1, dt * 6.5))
    camera.lookAt(s.x, groundY + 1.7, s.z)
  })

  return (
    <group ref={group}>
      <PlayerAvatar avatar={avatar} speedRef={playerSpeed} />
      <BlobShadow scale={1.2} />
    </group>
  )
}

/* ----------------------------------- NPCs ------------------------------------- */

const NPC_SKINS = ['#4A2C17', '#5C3A21', '#6E4326', '#8A5A32', '#A9714B']
const NPC_CLOTHES = ['#c94f2e', '#2e7d5b', '#d99a2b', '#3a6ea3', '#8a5aa3', '#b03a5b', '#e8dcc3']

export function Npcs({
  timeOfDay,
  onGist,
}: {
  timeOfDay: TimeOfDay
  /** reports the nearest named NPC's id (real NPCS registry) — null when none near */
  onGist?: (npcId: string | null) => void
}) {
  const COUNT = 12
  const refs = useRef<(THREE.Group | null)[]>([])
  const gistRef = useRef<string | null>(null)
  const data = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const zone = NPC_ZONES[i % NPC_ZONES.length]
        const rng = Math.random
        // real identities — the same registry that powers hustle offers
        const pool = NPCS.filter((n) => n.homeLocationId === zone.locationId)
        return {
          zone,
          identity: pool.length ? pool[i % pool.length] : null,
          ang0: rng() * Math.PI * 2,
          radius: 5 + rng() * (zone.radius - 7),
          speed: 0.25 + rng() * 0.4,
          dir: rng() > 0.5 ? 1 : -1,
          skin: NPC_SKINS[Math.floor(rng() * NPC_SKINS.length)],
          cloth: NPC_CLOTHES[Math.floor(rng() * NPC_CLOTHES.length)],
          hairStyle: (['none', 'cap', 'volume'] as const)[Math.floor(rng() * 3)],
          dress: rng() > 0.6,
          walk: { current: 1.2 + rng() * 0.6 },
        }
      }),
    [],
  )

  // at night most residents head home — the real clock makes the city breathe
  const activeCount = timeOfDay === 'night' ? 4 : COUNT

  useFrame((s) => {
    const t = s.clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      const g = refs.current[i]
      if (!g) continue
      const d = data[i]
      const ang = d.ang0 + t * d.speed * d.dir
      const x = d.zone.x + Math.cos(ang) * d.radius
      const z = d.zone.z + Math.sin(ang) * d.radius
      g.visible = i < activeCount
      if (!g.visible) continue
      g.position.set(x, heightAt(x, z), z)
      g.rotation.y = -ang + (d.dir > 0 ? Math.PI / 2 : -Math.PI / 2)
    }

    // gist discovery — the nearest NAMED resident to the player
    if (onGist) {
      let best: string | null = null
      let bestD: number = WORLD3D.npcGistRadius
      for (let i = 0; i < COUNT; i++) {
        if (i >= activeCount) break
        const d = data[i]
        if (!d.identity) continue
        const g = refs.current[i]
        if (!g) continue
        const dist = Math.hypot(g.position.x - playerPos.x, g.position.z - playerPos.z)
        if (dist < bestD) {
          bestD = dist
          best = d.identity.id
        }
      }
      if (best !== gistRef.current) {
        gistRef.current = best
        onGist(best)
      }
    }
  })

  return (
    <group>
      {data.map((d, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el }}>
          <CharacterMesh
            skin={d.skin}
            cloth={d.cloth}
            hair="#1A1714"
            hairStyle={d.hairStyle}
            dress={d.dress}
            speedRef={d.walk}
          />
          <BlobShadow scale={0.9} />
        </group>
      ))}
    </group>
  )
}

/* ---------------------------------- traffic ----------------------------------- */

function KekeMesh({ night }: { night: boolean }) {
  const wheel = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (wheel.current) wheel.current.children.forEach((w) => (w.rotation.x += dt * 6))
  })
  return (
    <group>
      {/* body */}
      <mesh position={[0, 0.72, -0.1]} castShadow>
        <boxGeometry args={[1.3, 0.9, 2.1]} />
        <meshStandardMaterial color="#e8c832" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* canopy */}
      <mesh position={[0, 1.5, -0.25]} castShadow>
        <boxGeometry args={[1.34, 0.75, 1.7]} />
        <meshStandardMaterial color="#22261f" roughness={0.8} />
      </mesh>
      {/* nose */}
      <mesh position={[0, 0.68, 1.05]} castShadow>
        <sphereGeometry args={[0.5, 10, 10]} />
        <meshStandardMaterial color="#e8c832" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* headlight */}
      <mesh position={[0, 0.8, 1.52]}>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color="#fff6d8" emissive="#ffe9a8" emissiveIntensity={night ? 2.4 : 0.4} />
      </mesh>
      {/* wheels */}
      <group ref={wheel}>
        <mesh position={[-0.62, 0.34, 1.0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.18, 10]} />
          <meshStandardMaterial color="#1c1c1c" roughness={1} />
        </mesh>
        <mesh position={[0.62, 0.34, 1.0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.18, 10]} />
          <meshStandardMaterial color="#1c1c1c" roughness={1} />
        </mesh>
        <mesh position={[0, 0.38, -1.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.2, 10]} />
          <meshStandardMaterial color="#1c1c1c" roughness={1} />
        </mesh>
      </group>
      {/* driver */}
      <mesh position={[0.45, 1.15, 0.6]}>
        <capsuleGeometry args={[0.14, 0.34, 3, 6]} />
        <meshStandardMaterial color="#4A2C17" roughness={1} />
      </mesh>
    </group>
  )
}

function OkadaMesh({ night }: { night: boolean }) {
  const wheel = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (wheel.current) wheel.current.children.forEach((w) => (w.rotation.x += dt * 7))
  })
  return (
    <group>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.34, 0.34, 1.7]} />
        <meshStandardMaterial color="#8a3a28" roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.92, -0.42]} castShadow>
        <boxGeometry args={[0.4, 0.24, 0.6]} />
        <meshStandardMaterial color="#22261f" roughness={1} />
      </mesh>
      <mesh position={[0, 1.05, 0.4]}>
        <capsuleGeometry args={[0.15, 0.36, 3, 6]} />
        <meshStandardMaterial color="#5C3A21" roughness={1} />
      </mesh>
      <mesh position={[0, 0.86, 0.78]}>
        <sphereGeometry args={[0.17, 8, 8]} />
        <meshStandardMaterial color="#4A2C17" roughness={1} />
      </mesh>
      <mesh position={[0, 0.62, 0.86]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#fff6d8" emissive="#ffe9a8" emissiveIntensity={night ? 2.2 : 0.3} />
      </mesh>
      <group ref={wheel}>
        <mesh position={[0, 0.34, 0.78]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.14, 10]} />
          <meshStandardMaterial color="#1c1c1c" roughness={1} />
        </mesh>
        <mesh position={[0, 0.34, -0.72]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.14, 10]} />
          <meshStandardMaterial color="#1c1c1c" roughness={1} />
        </mesh>
      </group>
    </group>
  )
}

function TaxiMesh({ night }: { night: boolean }) {
  return (
    <group>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[1.7, 0.72, 3.4]} />
        <meshStandardMaterial color="#9fb83a" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.22, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.6, 1.9]} />
        <meshStandardMaterial color="#c8d44a" roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.56, -0.2]}>
        <boxGeometry args={[0.7, 0.22, 0.4]} />
        <meshStandardMaterial color="#e8c832" emissive="#e8c832" emissiveIntensity={night ? 1.2 : 0.15} />
      </mesh>
      {[[-0.78, 1.05], [0.78, 1.05], [-0.78, -1.15], [0.78, -1.15]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.34, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.34, 0.34, 0.2, 10]} />
          <meshStandardMaterial color="#1c1c1c" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function DanfoMesh({ night }: { night: boolean }) {
  const wheel = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (wheel.current) wheel.current.children.forEach((w) => (w.rotation.x += dt * 5.5))
  })
  return (
    <group>
      {/* body — the classic yellow Lagos danfo silhouette (Lagos Run homage) */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[1.9, 1.3, 4.2]} />
        <meshStandardMaterial color="#e8b820" roughness={0.55} metalness={0.1} />
      </mesh>
      {/* roof */}
      <mesh position={[0, 1.66, 0]} castShadow>
        <boxGeometry args={[1.7, 0.14, 3.4]} />
        <meshStandardMaterial color="#f2ead8" roughness={0.8} />
      </mesh>
      {/* green side stripes */}
      {[1, -1].map((sx) => (
        <mesh key={sx} position={[sx * 0.96, 0.72, 0]}>
          <boxGeometry args={[0.03, 0.26, 3.9]} />
          <meshStandardMaterial color="#1c5c3a" roughness={0.7} />
        </mesh>
      ))}
      {/* windshield band */}
      <mesh position={[0, 1.35, 2.11]}>
        <boxGeometry args={[1.7, 0.5, 0.05]} />
        <meshStandardMaterial color="#28323a" roughness={0.25} metalness={0.4} />
      </mesh>
      {/* side windows */}
      {[1, -1].map((sx) =>
        [0.95, -0.45].map((z, i) => (
          <mesh key={`${sx}-${i}`} position={[sx * 0.96, 1.4, z]}>
            <boxGeometry args={[0.03, 0.42, 1.05]} />
            <meshStandardMaterial color="#28323a" roughness={0.3} metalness={0.35} />
          </mesh>
        )),
      )}
      {/* headlights */}
      {[0.6, -0.6].map((x) => (
        <mesh key={x} position={[x, 0.75, 2.12]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#fff6d8" emissive="#ffe9a8" emissiveIntensity={night ? 2.2 : 0.35} />
        </mesh>
      ))}
      {/* wheels */}
      <group ref={wheel}>
        {[[-0.92, 1.4], [0.92, 1.4], [-0.92, -1.35], [0.92, -1.35]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.38, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.38, 0.38, 0.22, 10]} />
            <meshStandardMaterial color="#1c1c1c" roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

interface Vehicle {
  loop: number
  s: number
  speed: number
  kind: 'keke' | 'okada' | 'taxi' | 'danfo'
  offset: number
}

// speeds are presentation feel, scaled off the shared config base
const BASE = WORLD3D.trafficBaseSpeed

const VEHICLES: Vehicle[] = [
  { loop: 0, s: 0.05, speed: 1.07 * BASE, kind: 'keke', offset: 1.6 },
  { loop: 0, s: 0.55, speed: 0.91 * BASE, kind: 'keke', offset: -1.6 },
  { loop: 1, s: 0.2, speed: 1.17 * BASE, kind: 'okada', offset: 1.4 },
  { loop: 1, s: 0.75, speed: 1.0 * BASE, kind: 'keke', offset: -1.4 },
  { loop: 2, s: 0.3, speed: 1.29 * BASE, kind: 'taxi', offset: 1.8 },
  { loop: 2, s: 0.8, speed: 0.89 * BASE, kind: 'okada', offset: -1.8 },
  { loop: 0, s: 0.33, speed: 0.86 * BASE, kind: 'danfo', offset: 1.9 },
  { loop: 1, s: 0.62, speed: 0.8 * BASE, kind: 'danfo', offset: -1.9 },
]

/** position along a loop polyline at arc-length s */
function loopPosition(loop: [number, number][], s: number): { x: number; z: number; yaw: number } {
  const segs: { ax: number; az: number; bx: number; bz: number; len: number }[] = []
  let total = 0
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i]
    const b = loop[(i + 1) % loop.length]
    const len = Math.hypot(b[0] - a[0], b[1] - a[1])
    segs.push({ ax: a[0], az: a[1], bx: b[0], bz: b[1], len })
    total += len
  }
  let rem = ((s % total) + total) % total
  for (const seg of segs) {
    if (rem <= seg.len) {
      const t = seg.len === 0 ? 0 : rem / seg.len
      const x = seg.ax + (seg.bx - seg.ax) * t
      const z = seg.az + (seg.bz - seg.az) * t
      return { x, z, yaw: Math.atan2(seg.bx - seg.ax, seg.bz - seg.az) }
    }
    rem -= seg.len
  }
  return { x: loop[0][0], z: loop[0][1], yaw: 0 }
}

export function Traffic({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const refs = useRef<(THREE.Group | null)[]>([])
  const night = timeOfDay === 'night'

  useFrame((_, dt) => {
    for (let i = 0; i < VEHICLES.length; i++) {
      const v = VEHICLES[i]
      const g = refs.current[i]
      if (!g) continue
      v.s += v.speed * dt
      const p = loopPosition(TRAFFIC_LOOPS[v.loop], v.s)
      // lateral offset so opposing traffic doesn't share a lane
      const ox = Math.sin(p.yaw) * v.offset
      const oz = Math.cos(p.yaw) * v.offset
      const x = p.x + ox
      const z = p.z + oz
      g.position.set(x, heightAt(x, z) + 0.05, z)
      g.rotation.y = p.yaw
    }
  })

  return (
    <group>
      {VEHICLES.map((v, i) => (
        <group key={i} ref={(el) => { refs.current[i] = el }}>
          {v.kind === 'keke' && <KekeMesh night={night} />}
          {v.kind === 'okada' && <OkadaMesh night={night} />}
          {v.kind === 'taxi' && <TaxiMesh night={night} />}
          {v.kind === 'danfo' && <DanfoMesh night={night} />}
          <BlobShadow scale={1.6} />
        </group>
      ))}
    </group>
  )
}

/* ----------------------------------- rain -------------------------------------- */

export function Rain({ weather }: { weather: Weather }) {
  const COUNT = 620
  const ref = useRef<THREE.Points>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44
      pos[i * 3 + 1] = Math.random() * 26
      pos[i * 3 + 2] = (Math.random() - 0.5) * 44
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame((state, dt) => {
    const pts = ref.current
    if (!pts || weather !== 'rain') return
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const fall = 27 * Math.min(dt, 0.05)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] -= fall
      if (arr[i * 3 + 1] < 0) {
        arr[i * 3] = (Math.random() - 0.5) * 44
        arr[i * 3 + 1] = 24 + Math.random() * 4
        arr[i * 3 + 2] = (Math.random() - 0.5) * 44
      }
    }
    attr.needsUpdate = true
    // follow the camera area in coarse steps so the shower is always around you
    pts.position.set(
      Math.round(state.camera.position.x / 22) * 22,
      0,
      Math.round(state.camera.position.z / 22) * 22,
    )
  })

  if (weather !== 'rain') return null
  return (
    <points ref={ref} geometry={geo} frustumCulled={false}>
      <pointsMaterial color="#aebfc9" size={0.09} transparent opacity={0.62} sizeAttenuation />
    </points>
  )
}

/* ------------------------------ joystick bridge -------------------------------- */

/** The HUD joystick writes straight into controls.setJoystick(); both input
 *  paths (touch + keyboard) meet in controls.ts and are read here. */
