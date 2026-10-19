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

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import type { AvatarConfig, TimeOfDay, Weather } from '@/game/types'
import { ANCHOR_BY_ID, makeRng } from '@/game/world3d/layout'
import { atmoLive, getAtmosphere, sunVec } from './atmosphere'
import { isNightMarketOpen } from '@/game/systems/seasons'
import { WorldTerrain } from './WorldTerrain'
import { CityMesh } from './CityMesh'
import { SchoolMesh } from './SchoolMesh'
import { Birds, Npcs, PlayerController, Rain, SmokeWisps, Traffic } from './Actors'
import { RemoteWalkers } from './RemoteWalkers'
import { RemoteVehicles } from './RemoteVehicles'
import { StageCapture } from './StageCapture'
import { DriveSystem } from './DriveSystem'
import { PolishLayer } from './polish'
import { setPerfRenderer, readFrameStats } from '@/game/systems/perfProbe'
import { getDeviceProfile, nextDynRes, QUALITY_PRESETS, type DeviceProfile, type DynResState } from '@/game/systems/device'
import { updateExtrasLevel, extrasLive } from '@/game/systems/extras'
import { music } from '@/game/systems/music'
import { useGameStore } from '@/game/store/useGameStore'

/* ------------------------------ perf governors (M3+M7) ------------------------- */

/** the governed renderer, captured once at canvas creation (module scratch —
 *  keeps the frame loop free of hook-returned objects it must mutate) */
const governedRenderer = { gl: null as THREE.WebGLRenderer | null }
/** where the shadow frustum currently sits (player pos, copied per frame) */
const shadowGovFollow = { x: 0, z: 0 }
const shadowGovScratch = { x: 9999, z: 9999, t: -1 }

/** copies the follow target into module scratch each frame (ref writes from a
 *  hook-owned ref inside useFrame trip the immutability lint; this doesn't) */
function FollowCopier({ followRef }: { followRef: React.MutableRefObject<THREE.Vector3> }) {
  useFrame(() => {
    shadowGovFollow.x = followRef.current.x
    shadowGovFollow.z = followRef.current.z
  })
  return null
}

/**
 * The shadow map used to re-render EVERY frame — a second full pass over every
 * shadow caster at 30-60fps. The Governor flips to on-demand: the map refreshes
 * when the player moves ≥3u (frustum follows), when rigs have had time to walk
 * on (0.4s heartbeat), or on the first frame. Three.js renders the map exactly
 * once per needsUpdate and then parks it — the sun's EASING is handled because
 * any real sun move coincides with player movement or the heartbeat.
 */
function ShadowGovernor() {
  useFrame((state) => {
    const gl = governedRenderer.gl
    if (!gl) return
    const sm = gl.shadowMap
    if (sm.autoUpdate) return // not governed (defensive)
    const p = shadowGovFollow
    const now = state.clock.elapsedTime
    if (
      shadowGovScratch.t < 0 ||
      Math.hypot(p.x - shadowGovScratch.x, p.z - shadowGovScratch.z) >= 3 ||
      now - shadowGovScratch.t >= 0.4
    ) {
      shadowGovScratch.x = p.x
      shadowGovScratch.z = p.z
      shadowGovScratch.t = now
      sm.needsUpdate = true
    }
  })
  return null
}

/**
 * Low tier only: paces the render loop at ~30Hz in demand mode — same visual
 * pacing on weak phones, half the GPU energy, and thermal headroom that keeps
 * the GPU from throttling into stutter. M7: a hidden tab never invalidates —
 * background phones keep their battery.
 */
function FramePacer({ hz }: { hz: number }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (!hz) return
    const t = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return
      invalidate()
    }, 1000 / hz)
    return () => clearInterval(t)
  }, [hz, invalidate])
  return null
}

/* ------------------------- M7 — dynamic resolution governor --------------------- */

/** live dyn-res state (module scratch — read by the E2E hook + settings UI) */
const dynResLive: DynResState = { cap: 1, dir: 'steady', sinceMs: 0, changes: 0 }

/**
 * RUN ON ANY DEVICE, part 1: the governor that fights lag while you play.
 * Every ~2s it reads the perf probe's frame ring; sustained frame stress
 * (p95 over 40ms) walks the render resolution DOWN a step — the game gets
 * lighter without moving a single gameplay law. Sustained headroom walks
 * it back UP. Hysteresis lives in the pure law (systems/device.ts).
 */
function DynamicResGovernor({ profile }: { profile: DeviceProfile }) {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const floor = profile.preset.dprFloor
    const initialCap = Math.min(profile.preset.dprCap, window.devicePixelRatio || 1)
    dynResLive.cap = initialCap
    const id = setInterval(() => {
      if (document.hidden) return // a background tab is not rendering truth
      const stats = readFrameStats()
      if (!stats) return
      const { state, action } = nextDynRes(dynResLive, { p95ms: stats.p95ms, nowMs: performance.now() }, {
        floor,
        initialCap,
      })
      Object.assign(dynResLive, state)
      if (action !== 'hold') {
        gl.setPixelRatio(Math.min(dynResLive.cap, window.devicePixelRatio || 1))
      }
      // M19 — THE EXTRAS-FIRST HEARTBEAT: the same ~2s tick recomputes the
      // polish verdict; beauty strips tier-by-tier BEFORE resolution moves.
      const p95 = stats ? stats.p95ms : null
      updateExtrasLevel(profile.effective, p95, dynResLive.dir)
      try {
        music.setIntensity(extrasLive.level) // the drum kit thins under stress too
      } catch {
        /* audio is best-effort */
      }
    }, 2000)
    return () => clearInterval(id)
  }, [gl, profile])
  return null
}

/* ------------------------------- shared easing state --------------------------- */

const skyTargets = {
  top: new THREE.Color('#4f9fd8'),
  horizon: new THREE.Color('#cfe4d4'),
  sun: new THREE.Color('#fff2d0'),
  glow: 1,
  /** M19 — the Confluence sunset band strength (eased toward the keyframe) */
  band: 0,
  /** M19 — the band's colour: rose-gold at dusk, soft gold at sunrise */
  bandColor: new THREE.Color('#ff8a5e'),
}
const starsState = { opacity: 0 }

/* ---------------------------------- sky dome ---------------------------------- */

function SkyDome({ sunRef }: { sunRef: React.MutableRefObject<THREE.Vector3> }) {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color('#4f9fd8') },
      uHorizon: { value: new THREE.Color('#cfe4d4') },
      uSunDir: { value: new THREE.Vector3(0.3, 0.8, 0.2) },
      uSunColor: { value: new THREE.Color('#fff2d0') },
      uSunGlow: { value: 1 },
      uBand: { value: 0 },
      uBandColor: { value: new THREE.Color('#ff8a5e') },
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
    u.uBand.value += (skyTargets.band - u.uBand.value) * k
    u.uBandColor.value.lerp(skyTargets.bandColor, k)
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
          uniform float uBand;
          uniform vec3 uBandColor;
          void main() {
            float h = clamp(vDir.y, 0.0, 1.0);
            vec3 col = mix(uHorizon, uTop, pow(h, 0.55));
            float sun = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 90.0);
            col += uSunColor * sun * uSunGlow;
            float haze = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 7.0);
            col += uSunColor * haze * 0.14 * uSunGlow;
            // M19 — THE CONFLUENCE SUNSET BAND: a wide rose-gold glow hugging
            // the horizon on the sun's side. Two pows, no loops — 6 adds total.
            float bandH = exp(-h * 7.0);
            float bandSun = pow(max(dot(normalize(vDir), normalize(uSunDir)), 0.0), 2.2);
            col += uBandColor * bandH * bandSun * uBand * 0.55;
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
    // seeded so the night sky is identical for every player, every load
    const rng = makeRng(4242)
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(320 * 3)
    for (let i = 0; i < 320; i++) {
      const theta = rng() * Math.PI * 2
      const phi = Math.acos(rng() * 0.85)
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
  // M7 — low tier leans the fog in a touch: cheaper overdraw, same sky law
  const fogMult = useMemo(() => 1 + (getDeviceProfile().preset.fogPush ?? 0), [])
  const sun = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const moon = useRef<THREE.Mesh>(null)
  const fog = useRef<THREE.FogExp2>(null)

  useFrame((_, dt) => {
    const k = Math.min(1, dt * 3.2)
    const f = fog.current
    if (f) {
      f.color.lerp(scratch.set(target.fogColor), k)
      f.density += (target.fogDensity * fogMult - f.density) * k
    }
    skyTargets.top.lerp(scratch.set(target.skyTop), k)
    skyTargets.horizon.lerp(scratch.set(target.skyHorizon), k)
    skyTargets.sun.lerp(scratch.set(target.sunColor), k)
    skyTargets.glow = target.showMoon ? 0.25 : 1
    // M19 — the band eases toward its keyframe; harmattan dusk burns rose-gold
    skyTargets.band = target.sunsetBand
    skyTargets.bandColor.set(timeOfDay === 'morning' ? '#ffd08a' : '#ff7e5e')

    // M19 — the shared live state the polish layers read (zero React churn)
    atmoLive.weather = weather
    atmoLive.sunsetBand += (target.sunsetBand - atmoLive.sunsetBand) * k
    atmoLive.flood += ((weather === 'flood' ? 1 : 0) - atmoLive.flood) * Math.min(1, dt * 0.5)

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

/* --------------------------- M6 — night market glow --------------------------- */

/**
 * The Food Strip turns after dark: two strings of warm bulbs strung
 * across the stalls and two glowing stall signs. Presentation only —
 * every bulb is an unlit emissive sphere, no real lights added (the
 * night sky already carries sodium pools). Hidden outside evening/night
 * by the SAME law the menu reads — isNightMarketOpen.
 */
function NightMarketGlow({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const open = isNightMarketOpen(timeOfDay)
  const anchor = ANCHOR_BY_ID['food-area']
  const bulbs = useMemo(() => {
    const out: Array<{ x: number; y: number; z: number }> = []
    // two sagging bulb strings across the stall row (13 bulbs each)
    for (let row = 0; row < 2; row++) {
      const z = anchor.z + (row === 0 ? -6.5 : 6.5)
      for (let i = 0; i < 13; i++) {
        const t = i / 12
        out.push({
          x: anchor.x - 11 + 22 * t,
          y: 3.1 - Math.sin(t * Math.PI) * 0.75,
          z,
        })
      }
    }
    return out
  }, [anchor.x, anchor.z])

  if (!open) return null
  return (
    <group>
      {/* the bulb strings */}
      {bulbs.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <sphereGeometry args={[0.16, 6, 5]} />
          <meshBasicMaterial color="#ffd88a" toneMapped={false} />
        </mesh>
      ))}
      {/* the two strings' wires (thin dark boxes, honest cheap) */}
      {[-6.5, 6.5].map((dz, i) => (
        <mesh key={`w${i}`} position={[anchor.x, 3.1, anchor.z + dz]}>
          <boxGeometry args={[22, 0.05, 0.05]} />
          <meshBasicMaterial color="#1a1a22" />
        </mesh>
      ))}
      {/* two glow signs marking the stall row */}
      {[-8, 8].map((dx, i) => (
        <mesh key={`s${i}`} position={[anchor.x + dx, 2.4, anchor.z + (i === 0 ? -10 : 10)]}>
          <boxGeometry args={[2.6, 1.1, 0.14]} />
          <meshBasicMaterial color="#ff9e5e" toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

/* --------------------------------- the scene ---------------------------------- */

export function WorldScene({
  avatar,
  currentLocationId,
  timeOfDay,
  weather,
  onReady,
  onNearestAnchor,
  onDistrict,
  onGist,
  onContextLost,
  onContextRestored,
}: {
  avatar: AvatarConfig
  currentLocationId: string
  timeOfDay: TimeOfDay
  weather: Weather
  onReady?: () => void
  onNearestAnchor?: (anchorId: string | null) => void
  onDistrict?: (districtId: string | null) => void
  onGist?: (npcId: string | null) => void
  /** M7 — the GPU context died (background memory pressure on phones); the HUD shows a recover chip */
  onContextLost?: () => void
  onContextRestored?: () => void
}) {
  /**
   * M7 — the device law, read once per session. The player's saved pick
   * (settings.graphics) is threaded through getDeviceProfile; the E2E
   * hook __lklForceQuality overrides the EFFECTIVE tier for device-matrix
   * screenshots without touching any gameplay law.
   */
  const profile = useMemo(() => {
    const setting = useGameStore.getState().settings.graphics
    const p = getDeviceProfile(setting)
    const forced = (window as unknown as { __lklForceQuality?: string }).__lklForceQuality
    if (forced === 'low' || forced === 'mid' || forced === 'high') {
      return { ...p, effective: forced, preset: QUALITY_PRESETS[forced] } satisfies DeviceProfile
    }
    return p
  }, [])
  const sunRef = useRef(new THREE.Vector3(0.3, 0.8, 0.2))
  const camTarget = useRef(new THREE.Vector3())

  return (
    <Canvas
      shadows={profile.preset.shadows}
      dpr={Math.min(profile.preset.dprCap, window.devicePixelRatio || 1)}
      frameloop={profile.preset.frameHz ? 'demand' : 'always'}
      gl={{
        antialias: profile.preset.antialias,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ fov: 55, near: 0.5, far: profile.preset.far, position: [8, 8, 8] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        // gentle lift: warm Nigerian light without blowing the plaster out
        gl.toneMappingExposure = 1.12
        if (profile.preset.shadows) {
          // cheaper shadow filter — visually indistinguishable here at 1024², measurably faster
          gl.shadowMap.type = THREE.PCFShadowMap
          // M3: shadows render on demand via <ShadowGovernor/>, not every frame
          gl.shadowMap.autoUpdate = false
          gl.shadowMap.needsUpdate = true
          governedRenderer.gl = gl
          // honest metrics for the perf harness (dev only)
          if (process.env.NODE_ENV !== 'production') {
            ;(window as unknown as Record<string, unknown>).__lklRenderer = gl
          }
        }
        // M4: the perf probe reads renderer.info on EVERY tier — real-device
        // diagnostics must work in production and on weak phones too
        setPerfRenderer(gl)
        dynResLive.cap = Math.min(profile.preset.dprCap, window.devicePixelRatio || 1)

        /* --- M7: context-loss recovery — the black-screen killer -------------
         * Mobile OSes silently evict WebGL contexts under memory pressure
         * (a phone call is enough). Without these two listeners the player
         * is stuck on a dead canvas; with them the game rebuilds itself. */
        const canvas = gl.domElement
        canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault() // tells three.js we intend to restore
          ;(window as unknown as Record<string, unknown>).__lklGlStatus = 'lost'
          onContextLost?.()
        })
        canvas.addEventListener('webglcontextrestored', () => {
          ;(window as unknown as Record<string, unknown>).__lklGlStatus = 'restored'
          if (profile.preset.shadows) gl.shadowMap.needsUpdate = true
          onContextRestored?.()
        })

        // M7 E2E: the device matrix needs the tier + dyn-res state + the canvas
        if (window.location.search.includes('e2e=1')) {
          ;(window as unknown as Record<string, unknown>).__lklGlCanvas = canvas
          ;(window as unknown as Record<string, unknown>).__lklDynRes = dynResLive
          ;(window as unknown as Record<string, unknown>).__lklTier = profile.effective
        }
        onReady?.()
      }}
      style={{ position: 'absolute', inset: 0, touchAction: 'none' }}
    >
      {profile.preset.shadows ? (
        <ShadowGovernor />
      ) : profile.preset.frameHz ? (
        <FramePacer hz={profile.preset.frameHz} />
      ) : null}
      <DynamicResGovernor profile={profile} />
      <FollowCopier followRef={camTarget} />
      <AtmosphereController timeOfDay={timeOfDay} weather={weather} sunRef={sunRef} followRef={camTarget} />
      <SkyDome sunRef={sunRef} />
      <Stars />

      <WorldTerrain />
      <CityMesh />
      {/* STAGE 7 — the schools of Lokoja, inside and out */}
      <SchoolMesh />
      {/* M19 — the beauty extras: harmattan haze + rain puddles (tier-gated,
          EXTRAS-FIRST governed — beauty strips before resolution moves) */}
      <PolishLayer tier={profile.effective} />

      <PlayerController
        avatar={avatar}
        spawnLocationId={currentLocationId}
        onNearestAnchor={onNearestAnchor}
        onDistrict={onDistrict}
        onPosition={(x, z) => camTarget.current.set(x, 0, z)}
      />
      <Npcs timeOfDay={timeOfDay} onGist={onGist} />
      <Traffic timeOfDay={timeOfDay} />
      {/* M24 W2 — THE BODIES: real claimed walkers as real bodies (additive
          layer; the roster seeds the face, the 10Hz lane walks the body) */}
      <RemoteWalkers />
      {/* M24 W10-a — THE WHEELS: real claimed drivers' cars as real rigs
          (additive layer; the roster seeds the car, the 12Hz lane turns
          the wheels — ONLY while moving; a parked car stands where it stopped) */}
      <RemoteVehicles />
      <StageCapture />
      <Rain weather={weather} />
      {/* M6 — the food strip turns after dark: night-market bulbs */}
      <NightMarketGlow timeOfDay={timeOfDay} />
      {/* INC 4 — the city breathes: birds by day, cooking smoke at the food strip */}
      <Birds timeOfDay={timeOfDay} />
      <SmokeWisps />
      {/* STAGE 5 — your own rides: spawn/enter/drive/park (owns the camera while driving) */}
      <DriveSystem timeOfDay={timeOfDay} followRef={camTarget} />
    </Canvas>
  )
}
