'use client'

/**
 * LOKOJA LIFE — World Scene (Stage 3D)
 * -------------------------------------
 * The R3F root: canvas setup tuned per device tier, the sky dome,
 * and the atmosphere controller — which reads the REAL world clock
 * + weather (store props) and eases lights/sky/fog/night-glow toward
 * the matching keyframe. One directional light both lights the city
 * and casts the shadow frustum that follows the player.
 */

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import type { AvatarConfig, TimeOfDay, Weather } from '@/game/types'
import { atmoLive, getAtmosphere, sunVec } from './atmosphere'
import { WorldTerrain } from './WorldTerrain'
import { CityMesh } from './CityMesh'
import { Npcs, PlayerController, Rain, Traffic } from './Actors'

/* --------------------------------- device tier -------------------------------- */

function detectQuality(): 'high' | 'low' {
  if (typeof window === 'undefined') return 'high'
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return coarse || mem <= 4 ? 'low' : 'high'
}

/* ------------------------------- shared easing state --------------------------- */

const skyTargets = {
  top: new THREE.Color('#5ea8d6'),
  horizon: new THREE.Color('#c8e4da'),
  sun: new THREE.Color('#fff1d4'),
  glow: 1,
}
const starsState = { opacity: 0 }

/* ---------------------------------- sky dome ---------------------------------- */

function SkyDome({ sunRef }: { sunRef: React.MutableRefObject<THREE.Vector3> }) {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color('#5ea8d6') },
      uHorizon: { value: new THREE.Color('#c8e4da') },
      uSunDir: { value: new THREE.Vector3(0.3, 0.8, 0.2) },
      uSunColor: { value: new THREE.Color('#fff1d4') },
      uSunGlow: { value: 1 },
    }),
    [],
  )
  const mat = useRef<THREE.ShaderMaterial>(null)

  useFrame((_, dt) => {
    const m = mat.current
    if (!m) return
    const u = m.uniforms as typeof uniforms
    const k = Math.min(1, dt * 3.2)
    u.uTop.value.lerp(skyTargets.top, k)
    u.uHorizon.value.lerp(skyTargets.horizon, k)
    u.uSunColor.value.lerp(skyTargets.sun, k)
    u.uSunDir.value.lerp(sunRef.current, k)
    u.uSunGlow.value += (skyTargets.glow - u.uSunGlow.value) * k
  })

  return (
    <mesh scale={[-1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[620, 24, 16]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying vec3 vDir;
          uniform vec3 uTop;
          uniform vec3 uHorizon;
          uniform vec3 uSunDir;
          uniform vec3 uSunColor;
          uniform float uSunGlow;
          void main() {
            float h = clamp(vDir.y, 0.0, 1.0);
            vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
            float sun = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 90.0);
            col += uSunColor * sun * uSunGlow;
            float haze = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 7.0);
            col += uSunColor * haze * 0.14 * uSunGlow;
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  )
}

/* ---------------------------------- stars ------------------------------------- */

function Stars() {
  const mat = useRef<THREE.PointsMaterial>(null)
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(320 * 3)
    for (let i = 0; i < 320; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 0.85)
      const r = 560
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i * 3 + 1] = Math.cos(phi) * r * 0.9 + 40
      pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame((_, dt) => {
    if (!mat.current) return
    mat.current.opacity += (starsState.opacity - mat.current.opacity) * Math.min(1, dt * 3)
    mat.current.visible = mat.current.opacity > 0.02
  })

  return (
    <points geometry={geo} renderOrder={-9}>
      <pointsMaterial
        ref={mat}
        color="#dfe8ff"
        size={2.2}
        sizeAttenuation={false}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  )
}

/* ------------------------------ atmosphere controller --------------------------- */

const scratch = new THREE.Color()

function AtmosphereController({
  timeOfDay,
  weather,
  sunRef,
  followRef,
}: {
  timeOfDay: TimeOfDay
  weather: Weather
  sunRef: React.MutableRefObject<THREE.Vector3>
  followRef: React.MutableRefObject<THREE.Vector3>
}) {
  const target = useMemo(() => getAtmosphere(timeOfDay, weather), [timeOfDay, weather])
  const sun = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const moon = useRef<THREE.Mesh>(null)
  const fog = useRef<THREE.FogExp2>(null)

  useFrame((_, dt) => {
    const k = Math.min(1, dt * 3.2)
    const f = fog.current
    if (f) {
      f.color.lerp(scratch.set(target.fogColor), k)
      f.density += (target.fogDensity - f.density) * k
    }
    skyTargets.top.lerp(scratch.set(target.skyTop), k)
    skyTargets.horizon.lerp(scratch.set(target.skyHorizon), k)
    skyTargets.sun.lerp(scratch.set(target.sunColor), k)
    skyTargets.glow = target.showMoon ? 0.25 : 1

    const sv = sunVec(target.sunDir)
    sunRef.current.set(sv[0], sv[1], sv[2])

    if (sun.current) {
      sun.current.intensity += (target.sunIntensity - sun.current.intensity) * k
      sun.current.color.lerp(scratch.set(target.sunColor), k)
      // keep the shadow frustum centred on the action
      sun.current.position.set(followRef.current.x + sv[0] * 90, sv[1] * 90, followRef.current.z + sv[2] * 90)
      sun.current.target.position.set(followRef.current.x, 0, followRef.current.z)
      sun.current.target.updateMatrixWorld()
    }
    if (hemi.current) {
      hemi.current.intensity += (target.hemiIntensity - hemi.current.intensity) * k
      hemi.current.color.lerp(scratch.set(target.hemiSky), k)
      hemi.current.groundColor.lerp(scratch.set(target.hemiGround), k)
    }
    if (moon.current) moon.current.visible = target.showMoon

    // shared glow for windows/lamps (CityMesh reads this) + star opacity
    atmoLive.nightGlow += (target.nightGlow - atmoLive.nightGlow) * k
    starsState.opacity = target.stars
  })

  const sv = sunVec(target.sunDir)

  return (
    <>
      <fogExp2 ref={fog} attach="fog" args={[target.fogColor, target.fogDensity]} />
      <hemisphereLight ref={hemi} args={[target.hemiSky, target.hemiGround, target.hemiIntensity]} />
      <directionalLight
        ref={sun}
        castShadow
        position={[sv[0] * 90, sv[1] * 90, sv[2] * 90]}
        intensity={target.sunIntensity}
        color={target.sunColor}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={20}
        shadow-camera-far={220}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0006}
      />
      {/* moon disc */}
      <mesh ref={moon} position={[-160, 250, -230]}>
        <sphereGeometry args={[13, 16, 16]} />
        <meshBasicMaterial color="#e8edf8" fog={false} />
      </mesh>
    </>
  )
}

/* --------------------------------- the scene ----------------------------------- */

export function WorldScene({
  avatar,
  currentLocationId,
  timeOfDay,
  weather,
  onReady,
  onNearestAnchor,
  onDistrict,
  onGist,
}: {
  avatar: AvatarConfig
  currentLocationId: string
  timeOfDay: TimeOfDay
  weather: Weather
  onReady?: () => void
  onNearestAnchor?: (anchorId: string | null) => void
  onDistrict?: (districtId: string | null) => void
  onGist?: (npcId: string | null) => void
}) {
  const quality = useMemo(() => detectQuality(), [])
  const sunRef = useRef(new THREE.Vector3(0.3, 0.8, 0.2))
  const camTarget = useRef(new THREE.Vector3())

  return (
    <Canvas
      shadows={quality === 'high'}
      dpr={quality === 'high' ? [1, 2] : [0.8, 1.4]}
      gl={{ antialias: quality === 'high', powerPreference: 'high-performance' }}
      camera={{ fov: 55, near: 0.5, far: 900, position: [8, 8, 8] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        onReady?.()
      }}
      style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
    >
      <AtmosphereController timeOfDay={timeOfDay} weather={weather} sunRef={sunRef} followRef={camTarget} />
      <SkyDome sunRef={sunRef} />
      <Stars />

      <WorldTerrain />
      <CityMesh />

      <PlayerController
        avatar={avatar}
        spawnLocationId={currentLocationId}
        onNearestAnchor={onNearestAnchor}
        onDistrict={onDistrict}
        onPosition={(x, z) => camTarget.current.set(x, 0, z)}
      />
      <Npcs timeOfDay={timeOfDay} onGist={onGist} />
      <Traffic timeOfDay={timeOfDay} />
      <Rain weather={weather} />
    </Canvas>
  )
}
