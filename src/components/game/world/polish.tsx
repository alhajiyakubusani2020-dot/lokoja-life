'use client'

/**
 * LOKOJA LIFE — M19: NEXT-GEN POLISH LAYER
 * -----------------------------------------
 * The beauty extras, each one governed by THE EXTRAS-FIRST LAW:
 * under frame stress these layers strip tier-by-tier BEFORE the dynres
 * governor touches pixel ratio — gameplay never waits for beauty.
 *
 *   • DustHaze  — "volumetric" harmattan: a few huge soft drifting
 *     planes with a 2-octave procedural noise shader. NO raymarching,
 *     NO render targets, NO post — the Sahara on a budget.
 *   • Puddles   — rain-wet ellipses on the roads: ONE merged geometry
 *     (one draw call) with a fake-fresnel wet shader that glints at the
 *     sun. Fade in with the rain family, dry out under a clear sky.
 *
 * Both read the shared `atmoLive` weather + the `extrasLive` level —
 * zero React state churn, everything eases inside useFrame.
 */

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { makeRng, ROADS } from '@/game/world3d/layout'
import { atmoLive } from './atmosphere'
import { extrasLive, wetnessFor } from '@/game/systems/extras'

/* --------------------------------- DustHaze -------------------------------- */

const DUST_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

const DUST_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uTint;
  // two-octave value noise from a hash — no textures, THE ZERO-ASSET LAW
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  void main() {
    vec2 p = vWorld.xz * 0.018;
    p += vec2(uTime * 0.014, uTime * 0.006); // the slow Sahara drift
    float n = noise(p) * 0.65 + noise(p * 2.7 + 13.1) * 0.35;
    float veil = smoothstep(0.28, 0.85, n);
    // fade the plane's own edge so no rectangle seam ever shows
    float edge = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x)
               * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
    float a = veil * edge * uOpacity;
    if (a < 0.004) discard;
    gl_FragColor = vec4(uTint, a);
  }
`

/**
 * THE HAZE LAW: planes hug the ground (dust does), drift deterministically
 * with the shared clock, and their opacity answers ONLY to the weather +
 * extras level. `visible` flips at true zero — an invisible layer costs
 * exactly nothing.
 */
function DustHaze({ tier }: { tier: string }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)

  const planes = useMemo(() => {
    const rng = makeRng(1973) // seeded — every player sees the same dust
    const out: Array<{ x: number; z: number; y: number; w: number; h: number; rot: number }> = []
    for (let i = 0; i < 4; i++) {
      out.push({
        x: (rng() - 0.5) * 160,
        z: (rng() - 0.5) * 160,
        y: 1.6 + i * 1.9 + rng() * 0.8,
        w: 130 + rng() * 50,
        h: 26 + rng() * 14,
        rot: (rng() - 0.5) * 0.6,
      })
    }
    return out
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uTint: { value: new THREE.Color('#d9bd8c') },
    }),
    [],
  )

  useFrame((state, dt) => {
    const mat = matRef.current
    const grp = groupRef.current
    if (!mat || !grp) return
    const tierCap = tier === 'high' ? 0.34 : 0.26 // mid sees slightly less dust
    // EXTRAS-FIRST: the live level multiplies the weather target — under
    // frame stress level 0 strips the haze to nothing BEFORE dynres moves
    const stress = extrasLive.level === 2 ? 1 : extrasLive.level === 1 ? 0.5 : 0
    const target = atmoLive.weather === 'harmattan' ? tierCap * stress : 0
    const u = mat.uniforms as typeof uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uOpacity.value += (target - u.uOpacity.value) * Math.min(1, dt * 0.8)
    const on = u.uOpacity.value > 0.01
    grp.visible = on
    if (!on) return
    // the whole group drifts imperceptibly east — dust rides the wind
    grp.position.x = Math.sin(state.clock.elapsedTime * 0.02) * 6
  })

  return (
    <group ref={groupRef} visible={false}>
      {planes.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]} rotation={[0, p.rot, 0]} renderOrder={4}>
          <planeGeometry args={[p.w, p.h]} />
          <shaderMaterial
            ref={i === 0 ? matRef : undefined}
            uniforms={uniforms}
            vertexShader={DUST_VERT}
            fragmentShader={DUST_FRAG}
            transparent
            depthWrite={false}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* --------------------------------- Puddles --------------------------------- */

/**
 * THE PUDDLE BOOK: seeded ellipses scattered along the real roads (the
 * same ROADS the traffic drives), kept off the centres where feet walk.
 * ONE merged geometry → ONE draw call for the whole wet city (THE DRAW
 * LAW). The shader fakes it all: fresnel sky tint + one sun glint.
 */
function buildPuddleGeometry(count: number): THREE.BufferGeometry {
  const rng = makeRng(88421)
  const verts: number[] = []
  const idx: number[] = []
  const vertsPer = 10
  let placed = 0
  let guard = 0
  while (placed < count && guard < count * 40) {
    guard++
    const road = ROADS[Math.floor(rng() * ROADS.length)]
    if (!road.pts || road.pts.length < 2) continue
    const seg = Math.floor(rng() * (road.pts.length - 1))
    const [ax, az] = road.pts[seg]
    const [bx, bz] = road.pts[seg + 1]
    const t = 0.15 + rng() * 0.7
    const px = ax + (bx - ax) * t
    const pz = az + (bz - az) * t
    // sit at the road edge, not the crown — puddles hug the gutters
    const dx = bx - ax
    const dz = bz - az
    const len = Math.hypot(dx, dz) || 1
    const nx = (-dz / len) * (road.w * 0.5) * (rng() < 0.5 ? -1 : 1)
    const nz = (dx / len) * (road.w * 0.5) * (rng() < 0.5 ? -1 : 1)
    const cx = px + nx + (rng() - 0.5) * 1.2
    const cz = pz + nz + (rng() - 0.5) * 1.2
    const rx = 0.9 + rng() * 1.7
    const rz = 0.7 + rng() * 1.4
    const rot = Math.atan2(dz, dx) + (rng() - 0.5) * 0.5
    const base = verts.length / 3
    const cos = Math.cos(rot)
    const sin = Math.sin(rot)
    for (let k = 0; k < vertsPer; k++) {
      const a = (k / vertsPer) * Math.PI * 2
      const lx = Math.cos(a) * rx
      const lz = Math.sin(a) * rz
      verts.push(cx + lx * cos - lz * sin, 0.035, cz + lx * sin + lz * cos)
    }
    for (let k = 1; k < vertsPer - 1; k++) {
      idx.push(base, base + k, base + k + 1)
    }
    placed++
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

const PUDDLE_VERT = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;
  void main() {
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const PUDDLE_FRAG = /* glsl */ `
  varying vec3 vWorld;
  varying vec3 vNormal;
  uniform float uOpacity;
  uniform vec3 uSky;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uTime;
  void main() {
    // fake fresnel — grazing angles read the sky, steep angles read mud
    vec3 viewDir = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - abs(dot(viewDir, vNormal)), 2.2);
    vec3 col = mix(vec3(0.16, 0.15, 0.13), uSky, 0.25 + fres * 0.6);
    // one cheap sun glint, wobbling slightly — the whole "reflection"
    vec3 h = normalize(viewDir + normalize(uSunDir));
    float spec = pow(max(dot(vNormal, h), 0.0), 90.0) * (0.85 + 0.15 * sin(uTime * 2.0 + vWorld.x));
    col += uSunColor * spec * 0.9;
    gl_FragColor = vec4(col, uOpacity * (0.55 + fres * 0.45));
  }
`

function Puddles({ tier }: { tier: string }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geo = useMemo(() => buildPuddleGeometry(16), [])
  const uniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uSky: { value: new THREE.Color('#cfe0e8') },
      uSunDir: { value: new THREE.Vector3(0.3, 0.8, 0.2) },
      uSunColor: { value: new THREE.Color('#fff2d0') },
      uTime: { value: 0 },
    }),
    [],
  )

  useFrame((state, dt) => {
    const mat = matRef.current
    if (!mat) return
    const u = mat.uniforms as typeof uniforms
    u.uTime.value = state.clock.elapsedTime
    const wet = wetnessFor(atmoLive.weather)
    // EXTRAS-FIRST: the live level dries the streets under stress too
    const stress = extrasLive.level === 2 ? 1 : extrasLive.level === 1 ? 0.6 : 0
    const target = wet * (tier === 'high' ? 0.85 : 0.7) * stress
    u.uOpacity.value += (target - u.uOpacity.value) * Math.min(1, dt * 0.5) // rain fills, sun dries
    const on = u.uOpacity.value > 0.015
    mat.visible = on
    if (!on) return
    u.uSunColor.value.set(atmoLive.sunsetBand > 0.5 ? '#ff9a5e' : '#fff2d0')
  })

  return (
    <mesh geometry={geo} renderOrder={3} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={PUDDLE_VERT}
        fragmentShader={PUDDLE_FRAG}
        transparent
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  )
}

/* ------------------------------ the polish root ----------------------------- */

/**
 * Mounts the beauty layer for the CURRENT tier. The tier gate is
 * structural: on low tier this renders null — the extras can never
 * reach a weak phone. Live stress response happens inside each layer
 * through `extrasLive` (mutated by the scene's governor loop).
 */
export function PolishLayer({ tier }: { tier: string }) {
  if (tier === 'low') return null
  return (
    <>
      <DustHaze tier={tier} />
      <Puddles tier={tier} />
    </>
  )
}
