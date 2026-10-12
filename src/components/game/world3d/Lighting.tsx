'use client'

/**
 * LOKOJA LIFE — Sky, Sun & Weather (Stage 3.5)
 * ---------------------------------------------
 * Reads the EXISTING shared world clock (world.timeOfDay + world.weather)
 * and paints the whole mood of the city from it: warm Nigerian daylight,
 * golden evenings, deep nights with glowing windows, rain showers.
 * No second clock — just visuals derived from the one true state.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useWorldAssets, worldMood } from './assets'
import type { TimeOfDay, Weather } from '@/game/types'

interface SkyMood {
  zenith: THREE.Color
  horizon: THREE.Color
  sunColor: THREE.Color
  sunIntensity: number
  sunPos: [number, number, number]
  ambient: THREE.Color
  ambientIntensity: number
  fogNear: number
  fogFar: number
}

const MOODS: Record<TimeOfDay, SkyMood> = {
  morning: {
    zenith: new THREE.Color('#8ecbf0'),
    horizon: new THREE.Color('#ffe6c0'),
    sunColor: new THREE.Color('#ffdfae'),
    sunIntensity: 1.05,
    sunPos: [150, 70, -70],
    ambient: new THREE.Color('#fff2dc'),
    ambientIntensity: 0.58,
    fogNear: 150,
    fogFar: 470,
  },
  afternoon: {
    zenith: new THREE.Color('#79c2ef'),
    horizon: new THREE.Color('#e8f2ea'),
    sunColor: new THREE.Color('#fff4e0'),
    sunIntensity: 1.25,
    sunPos: [70, 150, 40],
    ambient: new THREE.Color('#ffffff'),
    ambientIntensity: 0.62,
    fogNear: 170,
    fogFar: 500,
  },
  evening: {
    zenith: new THREE.Color('#7a86c8'),
    horizon: new THREE.Color('#ffb078'),
    sunColor: new THREE.Color('#ff9e5e'),
    sunIntensity: 0.9,
    sunPos: [-160, 45, 30],
    ambient: new THREE.Color('#ffd9b8'),
    ambientIntensity: 0.5,
    fogNear: 130,
    fogFar: 430,
  },
  night: {
    zenith: new THREE.Color('#0d1630'),
    horizon: new THREE.Color('#1c2a4a'),
    sunColor: new THREE.Color('#a8c0ff'),
    sunIntensity: 0.38,
    sunPos: [-70, 110, -90],
    ambient: new THREE.Color('#4a5a8a'),
    ambientIntensity: 0.42,
    fogNear: 110,
    fogFar: 380,
  },
}

/** Weather overlays tone the time-of-day mood down / grey it. */
function weatherify(mood: SkyMood, weather: Weather): SkyMood {
  if (weather === 'sunny' || weather === 'night-clear') return mood
  const out = {
    ...mood,
    zenith: mood.zenith.clone(),
    horizon: mood.horizon.clone(),
    sunColor: mood.sunColor.clone(),
    ambient: mood.ambient.clone(),
    sunPos: [...mood.sunPos] as [number, number, number],
  }
  if (weather === 'cloudy') {
    out.sunIntensity = mood.sunIntensity * 0.72
    out.zenith.lerp(new THREE.Color('#9aa8b5'), 0.55)
    out.horizon.lerp(new THREE.Color('#c4ccc9'), 0.55)
  }
  if (weather === 'rain') {
    out.sunIntensity = mood.sunIntensity * 0.42
    out.zenith.lerp(new THREE.Color('#6a7a86'), 0.72)
    out.horizon.lerp(new THREE.Color('#9aa8a4'), 0.72)
    out.ambientIntensity = mood.ambientIntensity * 0.92
    out.fogNear = mood.fogNear * 0.55
    out.fogFar = mood.fogFar * 0.55
  }
  return out
}

/* --------------------------------- sky dome --------------------------------- */

function SkyDome({ target }: { target: React.RefObject<SkyMood> }) {
  const mat = useRef<THREE.ShaderMaterial>(null!)
  const uniforms = useMemo(
    () => ({
      zenith: { value: new THREE.Color('#79c2ef') },
      horizon: { value: new THREE.Color('#e8f2ea') },
    }),
    [],
  )

  useFrame((_, dt) => {
    const t = target.current
    if (!t || !mat.current) return
    const k = 1 - Math.exp(-dt * 2.2)
    uniforms.zenith.value.lerp(t.zenith, k)
    uniforms.horizon.value.lerp(t.horizon, k)
  })

  return (
    <mesh scale={[1, 1, 1]} renderOrder={-10}>
      <sphereGeometry args={[640, 20, 12]} />
      <shaderMaterial
        ref={mat}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 zenith;
          uniform vec3 horizon;
          varying vec3 vPos;
          void main() {
            float h = normalize(vPos).y;
            float t = smoothstep(-0.06, 0.42, h);
            gl_FragColor = vec4(mix(horizon, zenith, t), 1.0);
          }
        `}
      />
    </mesh>
  )
}

/* ---------------------------------- stars ---------------------------------- */

function Stars() {
  const mat = useRef<THREE.PointsMaterial>(null!)
  const geo = useMemo(() => {
    const N = 260
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.42
      const r = 560
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi) + 30
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  useFrame((_, dt) => {
    if (mat.current) mat.current.opacity = THREE.MathUtils.lerp(mat.current.opacity, worldMood.night * 0.9, 1 - Math.exp(-dt * 2))
  })

  return (
    <points geometry={geo} renderOrder={-9}>
      <pointsMaterial ref={mat} color="#ffffff" size={2.2} sizeAttenuation={false} transparent opacity={0} fog={false} />
    </points>
  )
}

/* ---------------------------------- rain ----------------------------------- */

function Rain({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null!)
  const COUNT = 420
  const AREA = 130
  const geo = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * AREA
      pos[i * 3 + 1] = Math.random() * 46
      pos[i * 3 + 2] = (Math.random() - 0.5) * AREA
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])

  const group = useRef<THREE.Group>(null!)

  useFrame((state, dt) => {
    if (!ref.current || !group.current) return
    group.current.visible = active && worldMood.rain > 0.3
    if (!group.current.visible) return
    const attr = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] -= dt * 34
      if (arr[i * 3 + 1] < 0) arr[i * 3 + 1] = 44 + Math.random() * 4
    }
    attr.needsUpdate = true
    // keep the shower centred on the camera target
    group.current.position.set(state.camera.position.x * 0.8, 0, state.camera.position.z * 0.8)
  })

  return (
    <group ref={group}>
      <points ref={ref} geometry={geo}>
        <pointsMaterial color="#bcd8e8" size={0.32} transparent opacity={0.55} sizeAttenuation />
      </points>
    </group>
  )
}

/* --------------------------------- clouds ---------------------------------- */

function Clouds() {
  const { geos, mats } = useWorldAssets()
  const group = useRef<THREE.Group>(null!)

  const puffs = useMemo(() => {
    const rng = () => Math.random()
    const out: Array<{ x: number; y: number; z: number; s: number }> = []
    for (let c = 0; c < 9; c++) {
      const cx = (rng() - 0.5) * 560
      const cz = (rng() - 0.5) * 560
      const cy = 68 + rng() * 26
      const n = 3 + Math.floor(rng() * 3)
      for (let i = 0; i < n; i++) {
        out.push({ x: cx + (rng() - 0.5) * 26, y: cy + (rng() - 0.5) * 5, z: cz + (rng() - 0.5) * 16, s: 7 + rng() * 9 })
      }
    }
    return out
  }, [])

  useFrame((_, dt) => {
    if (!group.current) return
    group.current.children.forEach((c) => {
      c.position.x += dt * 1.1
      if (c.position.x > 320) c.position.x = -320
    })
  })

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <mesh key={i} geometry={geos.sphere} material={mats.cloud} position={[p.x, p.y, p.z]} scale={[p.s, p.s * 0.55, p.s * 0.8]} />
      ))}
    </group>
  )
}

/* --------------------------------- fog -------------------------------------- */

/**
 * Render-global fog — one canvas at a time exists, so a module singleton
 * is safe AND lets useFrame drift its values without fighting hooks lint.
 */
const fog = new THREE.Fog('#cfe8f2', 170, 500)

/* ------------------------------- lighting rig ------------------------------- */

export function Lighting({ timeOfDay, weather }: { timeOfDay: TimeOfDay; weather: Weather }) {
  const sun = useRef<THREE.DirectionalLight>(null!)
  const ambient = useRef<THREE.AmbientLight>(null!)
  const hemi = useRef<THREE.HemisphereLight>(null!)
  const moodTarget = useRef<SkyMood>(weatherify(MOODS[timeOfDay], weather))

  // recompute the target whenever the clock/weather changes
  useEffect(() => {
    moodTarget.current = weatherify(MOODS[timeOfDay], weather)
  }, [timeOfDay, weather])

  useFrame((_, dt) => {
    const t = moodTarget.current
    const k = 1 - Math.exp(-dt * 2.2)

    if (sun.current) {
      sun.current.position.lerp(tmpColorSet(t.sunPos), k)
      sun.current.color.lerp(t.sunColor, k)
      sun.current.intensity = THREE.MathUtils.lerp(sun.current.intensity, t.sunIntensity, k)
    }
    if (ambient.current) {
      ambient.current.color.lerp(t.ambient, k)
      ambient.current.intensity = THREE.MathUtils.lerp(ambient.current.intensity, t.ambientIntensity, k)
    }
    if (hemi.current) {
      hemi.current.intensity = THREE.MathUtils.lerp(hemi.current.intensity, t.sunIntensity * 0.42, k)
    }
    fog.color.lerp(t.horizon, k)
    fog.near = THREE.MathUtils.lerp(fog.near, t.fogNear, k)
    fog.far = THREE.MathUtils.lerp(fog.far, t.fogFar, k)

    // shared mood factors (windows, bulbs, rain visibility read these)
    const nightTarget = timeOfDay === 'night' ? (weather === 'rain' ? 0.85 : 1) : 0
    worldMood.night = THREE.MathUtils.lerp(worldMood.night, nightTarget, k)
    worldMood.rain = THREE.MathUtils.lerp(worldMood.rain, weather === 'rain' ? 1 : 0, k)
  })

  return (
    <>
      <SkyDome target={moodTarget} />
      <primitive object={fog} attach="fog" />
      <ambientLight ref={ambient} intensity={0.6} />
      <hemisphereLight ref={hemi} color="#cfe8ff" groundColor="#8a7a52" intensity={0.5} />
      <directionalLight ref={sun} position={[70, 150, 40]} intensity={1.2} />
      <Stars />
      <Clouds />
      <Rain active={weather === 'rain'} />
    </>
  )
}

/* temp vector helper (kept out of the component body) */
const _v = new THREE.Vector3()
function tmpColorSet(pos: [number, number, number]): THREE.Vector3 {
  return _v.set(pos[0], pos[1], pos[2])
}
