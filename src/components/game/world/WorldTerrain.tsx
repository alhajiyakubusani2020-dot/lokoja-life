'use client'

/**
 * LOKOJA LIFE — 3D Terrain (Stage 4C — "the ground half of the world")
 * --------------------------------------------------------------------
 * The land itself, painted like a place instead of a prototype:
 *  • heightfield from layout.heightAt (shared with the player controller —
 *    feet always meet ground) with layered savanna vertex colours:
 *    gold-olive base, river lowlands, laterite road halos, market dust
 *    bowls, parched high ground, Patti rock — plus a baked grain texture.
 *  • rivers with proper banks: a sand/mud shelf that dips under a wider
 *    two-tone water surface (shallow rim → deep channel), wet dark line at
 *    the waterline, confluence foam accent.
 *  • roads that read as roads: width hierarchy (trunk asphalt 6.5 → minor
 *    laterite 4.5 → trail 3.6), baked wheel-track wear + centre dashes,
 *    dirt shoulders, junction patches at shared endpoints.
 *  • grass as crossed-blade tufts (two instanced variants) with per-instance
 *    hue jitter, plus a few dry-season flower dots near the rivers.
 *  • bridges with railings, pylons and abutments carrying their road's
 *    surface style.
 * Everything is baked/memoised once; no per-frame allocations; no shadows
 * added; ~21 draw calls total. Zero Math.random — seeded helpers only.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import {
  BRIDGES, CONFLUENCE_POINT, DISTRICTS, GRASS, GRASS_TONES, heightAt, inCivicCampus, inSchoolYard, MOUNT_PATTI, riverInfo, ROADS,
  ROAD_RENDER_W, RIVERS,
  WATER_Y, WORLD_HALF, roadDistance, roadDistanceMajors,
} from '@/game/world3d/layout'
import { hash1, mergeGeoms, makeGroundGrainTexture, roadTextures } from '@/game/world3d/terrainArt'
import { KERB_RUNS, ZEBRAS } from '@/game/world3d/roads'
import { GRASS_TUFTS } from '@/game/world3d/flora' // W2 — the 10k savanna
import { applyFloraShader } from './flora-shader' // W2 — shared wind + weather
import { atmoLive } from './atmosphere' // M19 — the flood veil reads the live weather

function smoothstep(a: number, b: number, t: number): number {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

/* -------------------------------- terrain ---------------------------------- */

const SEG = 160

/** districts that kick up real dust: market, motor park, junction, food strip */
const DUSTY_DISTRICTS = DISTRICTS.filter((d) =>
  d.kind === 'market' || d.kind === 'junction' || d.kind === 'park' || d.kind === 'food',
)

function TerrainMesh() {
  const grain = useMemo(() => {
    const t = makeGroundGrainTexture(256)
    t.repeat.set(96, 96)
    return t
  }, [])

  /* SILK II — THE TIME-SLICE LAW: the heightfield used to build in ONE
   * synchronous useMemo (25,921 vertices × 3 heightAt + 2 road queries
   * each) — a 50–150ms mount jam on low-end phones. The geometry shell is
   * allocated instantly and the per-vertex work is sliced into useFrame
   * with a 6ms frame budget, so the land RISES over a handful of frames
   * under the entering veil instead of freezing one. The per-vertex math
   * and its row-major order are UNCHANGED — bit-identical output, only the
   * schedule moved. */
  const build = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, SEG, SEG)
    geo.rotateX(-Math.PI / 2)
    return {
      geo,
      pos: geo.attributes.position as THREE.BufferAttribute,
      colors: new Float32Array(geo.attributes.position.count * 3),
    }
  }, [])

  /* the frame loop mutates the buffers through this holder — the render
   * path only ever READS the memo (react-hooks immutability law) */
  const holder = useRef<typeof build | null>(null)
  useEffect(() => {
    holder.current = build
  }, [build])

  /* the palette + scratch, hoisted out of the frame loop (zero-alloc law) */
  const paint = useMemo(() => {
    const mk = (hex: string) => new THREE.Color(hex)
    return {
      c: mk('#000000'),
      base: mk('#7f8f4c'), // gold-olive savanna
      mottD: mk('#6d7f40'), // richer olive mottling
      mottL: mk('#9d9a5c'), // dry gold mottling
      lush: mk('#59763a'), // river lowland green
      dust: mk('#b58a58'), // laterite dust halo
      dustD: mk('#a1764a'), // packed earth right by roads
      dryHi: mk('#a39a5e'), // parched high ground
      rock: mk('#8f7f63'), // Patti stone on slopes
      iron: mk('#7c5c40'), // ironstone strata band
      paleBand: mk('#a58f66'), // pale laterite strata band
      footFan: mk('#b09a68'), // erosion fan at the mountain foot
      sand: mk('#c2aa72'), // bank sand
      mud: mk('#66543a'), // wet waterline mud
      bed: mk('#4c5a40'), // riverbed, hints through the water
    }
  }, [])

  const buildState = useRef({ row: 0, done: false })
  const [ready, setReady] = useState(false)

  useFrame(() => {
    const s = buildState.current
    if (s.done) return
    const h = holder.current
    if (!h) return
    const { geo, pos, colors } = h
    const t0 = performance.now()
    const perRow = SEG + 1
    const { c, base, mottD, mottL, lush, dust, dustD, dryHi, rock, iron, paleBand, footFan, sand, mud, bed } = paint
    while (s.row < perRow && performance.now() - t0 < 6) {
      const rowStart = s.row * perRow
      for (let col = 0; col < perRow; col++) {
        const i = rowStart + col
        const x = pos.getX(i)
        const z = pos.getZ(i)
        const y = heightAt(x, z)
        pos.setY(i, y)
        c.copy(base)

        // low-frequency mottling — two octave bands, never the same twice
        const n1 = Math.sin(x * 0.052 + z * 0.031) * 0.5 + Math.sin(x * 0.021 - z * 0.047 + 1.3) * 0.5
        const n2 = Math.sin(x * 0.14 + z * 0.11 + 2.1) * 0.5 + Math.sin(x * 0.09 - z * 0.16 + 0.6) * 0.5
        c.lerp(n1 > 0 ? mottL : mottD, Math.abs(n1) * 0.34)
        c.lerp(n2 > 0 ? mottL : mottD, Math.abs(n2) * 0.13)

        // parched patches on high ground, broken up by the second noise band
        const dryT = Math.max(0, (y - 4.5) / 9) * (0.55 + 0.45 * n2)
        if (dryT > 0) c.lerp(dryHi, Math.min(1, dryT) * 0.65)

        // richer green lowlands near the rivers (moisture gradient)
        const { d, halfWidth } = riverInfo(x, z)
        const moist = 1 - smoothstep(2, 26, d - halfWidth)
        if (moist > 0) c.lerp(lush, moist * 0.6)

        // dusty laterite halos: a wide soft band along the MAJOR roads (smooth
        // on the coarse mesh) plus a tight packed-earth rim on every street
        const rd = roadDistance(x, z)
        const rm = roadDistanceMajors(x, z)
        const halo = 1 - smoothstep(2.4, 13, rm)
        if (halo > 0) c.lerp(dust, halo * 0.6)
        const packed = 1 - smoothstep(1.0, 2.8, rd)
        if (packed > 0) c.lerp(dustD, packed * 0.75)

        // dust bowls around the market / motor park / junction / food strip
        for (const dd of DUSTY_DISTRICTS) {
          const ddx = x - dd.x
          const ddz = z - dd.z
          const dd2 = ddx * ddx + ddz * ddz
          const rOut = dd.radius * 1.9
          if (dd2 < rOut * rOut) {
            const t = 1 - smoothstep(dd.radius * 0.62, rOut, Math.sqrt(dd2))
            if (t > 0) c.lerp(dust, t * 0.5)
          }
        }

        // rocky slopes — steeper ground reveals the Patti stone, but the real
        // hill wears its geology in BANDS: ironstone and pale laterite strata
        // alternate as the mountain rises, the grassy savanna crown keeps its
        // top (the rest house lawn), and a pale erosion fan spreads at the foot
        const slope =
          (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4
        const pd = Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z)
        let rockT = 0
        if (slope > 0.32) rockT = Math.min(1, (slope - 0.32) * 2.2)
        if (y > 16) rockT = Math.max(rockT, Math.min(1, (y - 16) / 14))
        // the summit crown stays grassy — pull the stone back where the hill tops out
        const crownT = 1 - smoothstep(24, 40, pd)
        if (crownT > 0 && y > 20) rockT *= 1 - crownT * 0.85
        if (rockT > 0.02) {
          const band = Math.sin(y * 1.35 + Math.sin(x * 0.11 + z * 0.09) * 0.85)
          c.lerp(band > 0 ? iron : paleBand, rockT * 0.82)
        } else if (slope > 0.32) {
          // non-Patti steep ground (stream gullies) keeps the neutral stone
          c.lerp(rock, Math.min(1, (slope - 0.32) * 2.2))
        }
        // the erosion fan — where the hill sheds into the plain, on gentle ground only
        const fanT = (1 - Math.abs(pd - 76) / 14) * (1 - smoothstep(0.26, 0.48, slope))
        if (fanT > 0) c.lerp(footFan, Math.min(0.42, fanT * 0.55))

        // river banks — sand shelf, wet dark line, darker bed under the water
        if (d < halfWidth + 9) {
          const sandT = 1 - smoothstep(halfWidth + 1.5, halfWidth + 9, d)
          if (sandT > 0) c.lerp(sand, sandT * 0.75)
        }
        if (d < halfWidth + 1.2) c.lerp(mud, 1 - smoothstep(halfWidth - 1, halfWidth + 1.2, d))
        if (d < halfWidth - 0.6) c.lerp(bed, 1 - smoothstep(halfWidth - 4, halfWidth - 0.6, d))

        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }
      s.row++
    }
    pos.needsUpdate = true // the land rises live under the veil
    if (s.row >= perRow) {
      s.done = true
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      geo.computeVertexNormals()
      setReady(true) // the painted land takes over from the flat shell
    }
  })

  return (
    <mesh geometry={build.geo} receiveShadow>
      {/* the flat savanna shell renders while the heightfield rises; the
          painted vertex colours + grain take over the frame it completes */}
      <meshStandardMaterial
        vertexColors={ready}
        map={grain}
        color={ready ? '#ffffff' : '#7f8f4c'}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  )
}

/* --------------------------------- rivers ---------------------------------- */

/** dense resample of a polyline every `step` units */
function resample(points: [number, number][], step: number): [number, number][] {
  const out: [number, number][] = []
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, az] = points[i]
    const [bx, bz] = points[i + 1]
    const len = Math.hypot(bx - ax, bz - az)
    const n = Math.max(1, Math.round(len / step))
    for (let s = 0; s < n; s++) {
      const t = s / n
      out.push([ax + (bx - ax) * t, az + (bz - az) * t])
    }
  }
  out.push(points[points.length - 1])
  return out
}

/**
 * Water surface: wider than the carved channel so the rim tucks under the
 * bank (the real waterline sits ≈ halfWidth+3.4 out). Four columns across
 * give a two-tone depth read — bright shallow rim, dark mid channel.
 */
function waterGeometry(points: [number, number][], width: number): THREE.BufferGeometry {
  const dense = resample(points, 4)
  const edge = width / 2 + 3.6
  const offs = [-edge, -edge * 0.42, edge * 0.42, edge]
  const shade = [1.22, 0.78, 0.78, 1.22]
  const verts: number[] = []
  const cols: number[] = []
  const idx: number[] = []
  for (let i = 0; i < dense.length; i++) {
    const [x, z] = dense[i]
    const prev = dense[Math.max(0, i - 1)]
    const next = dense[Math.min(dense.length - 1, i + 1)]
    const dx = next[0] - prev[0]
    const dz = next[1] - prev[1]
    const len = Math.hypot(dx, dz) || 1
    const nx = -dz / len
    const nz = dx / len
    for (let k = 0; k < 4; k++) {
      verts.push(x + nx * offs[k], WATER_Y, z + nz * offs[k])
      cols.push(shade[k], shade[k], shade[k])
    }
    if (i < dense.length - 1) {
      const b = i * 4
      for (let k = 0; k < 3; k++) {
        idx.push(b + k, b + 4 + k, b + k + 1, b + k + 1, b + 4 + k, b + 5 + k)
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/**
 * The bank between land and water: a draped sand/mud shelf — dark wet band
 * right at the waterline, sand above it, fading out into the terrain's own
 * sand tint so no hard seam shows.
 */
function shelfGeometry(points: [number, number][], width: number): THREE.BufferGeometry {
  const dense = resample(points, 2.5)
  const hw = width / 2
  const offs = [hw + 0.8, hw + 2.9, hw + 4.8, hw + 6.8]
  const tones = [
    new THREE.Color('#4e4234'), // submerged mud (hints through the water)
    new THREE.Color('#64513a'), // wet band at the waterline
    new THREE.Color('#c2a870'), // dry sand shelf
    new THREE.Color('#93875e'), // fading into the savanna
  ]
  const verts: number[] = []
  const cols: number[] = []
  const idx: number[] = []
  const both = [1, -1] // both banks
  for (const side of both) {
    const base = verts.length / 3
    for (let i = 0; i < dense.length; i++) {
      const [x, z] = dense[i]
      const prev = dense[Math.max(0, i - 1)]
      const next = dense[Math.min(dense.length - 1, i + 1)]
      const dx = next[0] - prev[0]
      const dz = next[1] - prev[1]
      const len = Math.hypot(dx, dz) || 1
      const nx = (-dz / len) * side
      const nz = (dx / len) * side
      for (let k = 0; k < 4; k++) {
        const px = x + nx * offs[k]
        const pz = z + nz * offs[k]
        verts.push(px, heightAt(px, pz) + 0.02, pz)
        cols.push(tones[k].r, tones[k].g, tones[k].b)
      }
      if (i < dense.length - 1) {
        const b = base + i * 4
        for (let k = 0; k < 3; k++) {
          idx.push(b + k, b + 4 + k, b + k + 1, b + k + 1, b + 4 + k, b + 5 + k)
        }
      }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

function Rivers() {
  const nigerRef = useRef<THREE.Mesh>(null)
  const foamRef = useRef<THREE.Mesh>(null)
  const foam2Ref = useRef<THREE.Mesh>(null)

  const { waters, shelf } = useMemo(
    () => ({
      waters: RIVERS.map((r) => waterGeometry(r.points, r.width)),
      shelf: mergeGeoms(RIVERS.map((r) => shelfGeometry(r.points, r.width))),
    }),
    [],
  )

  useFrame((state) => {
    // gentle water shimmer — one material trick, cheap
    const t = state.clock.elapsedTime
    if (nigerRef.current) {
      const m = nigerRef.current.material as THREE.MeshStandardMaterial
      m.roughness = 0.15 + Math.sin(t * 0.7) * 0.05
    }
    if (foamRef.current) {
      foamRef.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06)
      ;(foamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.26 + Math.sin(t * 2.1) * 0.08
    }
    if (foam2Ref.current) {
      foam2Ref.current.scale.setScalar(1 + Math.sin(t * 0.9 + 2.1) * 0.05)
      ;(foam2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.11 + Math.sin(t * 1.3 + 1.0) * 0.05
    }
  })

  const confluence = CONFLUENCE_POINT

  return (
    <group>
      {/* banks first, water over them */}
      <mesh geometry={shelf}>
        <meshStandardMaterial vertexColors flatShading side={THREE.DoubleSide} roughness={1} metalness={0} />
      </mesh>
      {waters.map((g, i) => (
        <mesh key={RIVERS[i].id} ref={i === 0 ? nigerRef : undefined} geometry={g}>
          <meshStandardMaterial
            vertexColors
            color={i === 2 ? '#2e8a80' : '#2f8fa0'}
            roughness={0.18}
            metalness={0.08}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      {/* confluence foam — where the Niger kisses the Benue (the landmark) */}
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} position={[confluence[0], WATER_Y + 0.06, confluence[1]]}>
        <circleGeometry args={[9.5, 24]} />
        <meshBasicMaterial color="#eaf5ee" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh ref={foam2Ref} rotation={[-Math.PI / 2, 0, 0]} position={[confluence[0], WATER_Y + 0.05, confluence[1]]}>
        <circleGeometry args={[15, 28]} />
        <meshBasicMaterial color="#dceee8" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      {/* M19 — the flood veil: an animated muddy ripple riding the water when
          the flood weather owns the day (reads atmoLive.flood, zero React) */}
      <FloodVeil waters={waters} />
    </group>
  )
}

/* ------------------------- M19 — the flood-water veil ------------------------ */

const FLOOD_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

/**
 * THE FLOOD LAW, rendered: the veil sits 0.09u over the water, tinted
 * the Niger's real flood brown. Two scrolling sine bands fake the ripple
 * (fragment-only — the vertices never move, so the cost is one cheap
 * plane draw). Opacity answers ONLY to atmoLive.flood; at zero the mesh
 * parks invisible — a dry-season veil costs nothing.
 */
function FloodVeil({ waters }: { waters: THREE.BufferGeometry[] }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const grpRef = useRef<THREE.Group>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uMud: { value: new THREE.Color('#5e4f36') },
      uSky: { value: new THREE.Color('#8a9488') },
    }),
    [],
  )

  useFrame((state, dt) => {
    const mat = matRef.current
    const grp = grpRef.current
    if (!mat || !grp) return
    const u = mat.uniforms as typeof uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uOpacity.value += (atmoLive.flood * 0.5 - u.uOpacity.value) * Math.min(1, dt * 0.6)
    grp.visible = u.uOpacity.value > 0.012
    if (!grp.visible) return
    // the flood sky is heavy grey-green — the veil catches it
    u.uSky.value.set('#7d8a80')
  })

  const frag = /* glsl */ `
    varying vec3 vWorld;
    uniform float uTime;
    uniform float uOpacity;
    uniform vec3 uMud;
    uniform vec3 uSky;
    void main() {
      // two travelling swells — the Niger hauling debris toward the delta
      float w1 = sin(vWorld.x * 0.55 + uTime * 1.1) * 0.5 + 0.5;
      float w2 = sin(vWorld.z * 0.43 - uTime * 0.8 + vWorld.x * 0.21) * 0.5 + 0.5;
      float ripple = w1 * 0.6 + w2 * 0.4;
      vec3 col = mix(uMud, uSky, ripple * 0.35);
      gl_FragColor = vec4(col, uOpacity * (0.65 + ripple * 0.35));
    }
  `

  return (
    <group ref={grpRef} visible={false}>
      {waters.map((g, i) => (
        <mesh key={`flood-${i}`} geometry={g} renderOrder={2}>
          <shaderMaterial
            ref={i === 0 ? matRef : undefined}
            uniforms={uniforms}
            vertexShader={FLOOD_VERT}
            fragmentShader={frag}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------- roads ----------------------------------- */

type RoadClass = 'asphalt' | 'laterite' | 'trail'

/** data style → render class (asphalt / laterite / trail) */
function roadClassOf(style: string): RoadClass {
  if (style === 'asphalt') return 'asphalt'
  if (style === 'laterite') return 'laterite'
  return 'trail'
}

/**
 * Road ribbon draping the terrain via heightAt. Resampled every 3 u so it
 * hugs slopes; tiny per-road lift offsets keep overlapping ribbons at
 * junctions from z-fighting. u across the road, v along it (tiled).
 */
function roadGeometry(
  points: [number, number][],
  width: number,
  yOff: number,
  vScale: number,
): THREE.BufferGeometry {
  const dense = resample(points, 3)
  const verts: number[] = []
  const uvs: number[] = []
  const idx: number[] = []
  let cursor = 0
  // Stage 7 — mapped streets stop at the school fence (the swept yard owns
  // its ground, exactly like a real satellite view of a Lokoja school)
  const yard = dense.map(([x, z]) => inSchoolYard(x, z) || inCivicCampus(x, z))
  for (let i = 0; i < dense.length; i++) {
    const [x, z] = dense[i]
    const prev = dense[Math.max(0, i - 1)]
    const next = dense[Math.min(dense.length - 1, i + 1)]
    const dx = next[0] - prev[0]
    const dz = next[1] - prev[1]
    const len = Math.hypot(dx, dz) || 1
    const nx = (-dz / len) * (width / 2)
    const nz = (dx / len) * (width / 2)
    const yL = heightAt(x + nx, z + nz) + yOff
    const yR = heightAt(x - nx, z - nz) + yOff
    verts.push(x + nx, yL, z + nz)
    verts.push(x - nx, yR, z - nz)
    uvs.push(0, cursor * vScale, 1, cursor * vScale)
    cursor += 1
    if (i < dense.length - 1 && !yard[i] && !yard[i + 1]) {
      const a = i * 2
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/** darker worn-earth discs where MAJOR road endpoints meet, so seams don't show */
function junctionDiscs(): THREE.BufferGeometry | null {
  const pts: [number, number][] = []
  for (const r of ROADS) {
    if (!r.major) continue
    pts.push(r.pts[0])
    pts.push(r.pts[r.pts.length - 1])
  }
  const used = pts.map(() => false)
  const geos: THREE.BufferGeometry[] = []
  for (let i = 0; i < pts.length; i++) {
    if (used[i]) continue
    if (inSchoolYard(pts[i][0], pts[i][1]) || inCivicCampus(pts[i][0], pts[i][1])) continue // yard owns its ground
    used[i] = true
    let cx = pts[i][0]
    let cz = pts[i][1]
    let n = 1
    for (let j = i + 1; j < pts.length; j++) {
      if (!used[j] && Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 5) {
        used[j] = true
        cx += pts[j][0]
        cz += pts[j][1]
        n++
      }
    }
    if (n < 2) continue
    cx /= n
    cz /= n
    const disc = new THREE.CircleGeometry(5.6, 20)
    disc.rotateX(-Math.PI / 2)
    disc.translate(cx, heightAt(cx, cz) + 0.16, cz)
    geos.push(disc)
  }
  return geos.length ? mergeGeoms(geos) : null
}

function Roads() {
  /**
   * Lane markings — worn white paint: dashed centrelines along the asphalt
   * arteries (highway/major/secondary) and solid edge lines on the highway.
   * Markings clip at school fences (the renderer's own law) and skip bridge
   * spans (each bridge deck carries its own surface).
   */
  const markings = useMemo(() => {
    const dashes: THREE.BufferGeometry[] = []
    const edges: THREE.BufferGeometry[] = []
    for (const r of ROADS) {
      if (r.style !== 'asphalt') continue
      if (r.cls !== 'highway' && r.cls !== 'major' && r.cls !== 'secondary') continue
      const hw = (ROAD_RENDER_W[r.cls] ?? 4.2) / 2
      for (let i = 0; i < r.pts.length - 1; i++) {
        const [ax, az] = r.pts[i]
        const [bx, bz] = r.pts[i + 1]
        const seg = Math.hypot(bx - ax, bz - az)
        if (seg < 2.4) continue
        const yaw = Math.atan2(bx - ax, bz - az)
        const nx = -(bz - az) / seg
        const nz = (bx - ax) / seg
        // dashed centreline
        let acc = 1.6
        while (acc + 1.5 <= seg) {
          const t = (acc + 0.75) / seg
          const x = ax + (bx - ax) * t
          const z = az + (bz - az) * t
          acc += 3.7
          if (inSchoolYard(x, z) || inCivicCampus(x, z)) continue
          const ri = riverInfo(x, z)
          if (ri.d < ri.halfWidth + 1.2) continue
          const dash = new THREE.PlaneGeometry(0.1, 1.5)
          dash.rotateX(-Math.PI / 2)
          dash.rotateY(yaw)
          dash.translate(x, heightAt(x, z) + 0.1, z)
          dashes.push(dash)
        }
        // solid edge lines — the dual-carriageway highway reads as engineered
        if (r.cls === 'highway') {
          for (let eAcc = 0.75; eAcc < seg; eAcc += 3) {
            const t = eAcc / seg
            const x = ax + (bx - ax) * t
            const z = az + (bz - az) * t
            if (inSchoolYard(x, z) || inCivicCampus(x, z)) continue
            const ri = riverInfo(x, z)
            if (ri.d < ri.halfWidth + 1.2) continue
            for (const side of [-1, 1]) {
              const edge = new THREE.PlaneGeometry(0.09, 3)
              edge.rotateX(-Math.PI / 2)
              edge.rotateY(yaw)
              edge.translate(x + nx * (hw - 0.42) * side, heightAt(x + nx * (hw - 0.42) * side, z + nz * (hw - 0.42) * side) + 0.1, z + nz * (hw - 0.42) * side)
              edges.push(edge)
            }
          }
        }
      }
    }
    const all = [...dashes, ...edges]
    return all.length ? mergeGeoms(all) : null
  }, [])

  const { shoulder, asphalt, laterite, trail, fabric, junctions } = useMemo(() => {
    const shoulders: THREE.BufferGeometry[] = []
    const byClass: Record<RoadClass, THREE.BufferGeometry[]> = {
      asphalt: [], laterite: [], trail: [],
    }
    const fabricGeos: THREE.BufferGeometry[] = []
    ROADS.forEach((r, i) => {
      const st = { w: ROAD_RENDER_W[r.cls] ?? 4.2, cls: roadClassOf(r.style) }
      // the dense residential fabric (2,700+ real minor streets) renders as
      // one flat earthen surface — textured stripes at every street angle
      // would tile over each other into visual mush
      if (r.cls === 'minor' || r.cls === 'foot') {
        fabricGeos.push(roadGeometry(r.pts, st.w, 0.07 + (i % 5) * 0.004, 0.25))
        return
      }
      // dirt shoulders only on the sparse arteries
      shoulders.push(roadGeometry(r.pts, st.w + 2.4, 0.05 + (i % 4) * 0.003, 0.25))
      byClass[st.cls].push(roadGeometry(r.pts, st.w, 0.09 + (i % 5) * 0.004, 1 / 7.2))
    })
    return {
      shoulder: mergeGeoms(shoulders),
      asphalt: byClass.asphalt.length ? mergeGeoms(byClass.asphalt) : null,
      laterite: byClass.laterite.length ? mergeGeoms(byClass.laterite) : null,
      trail: byClass.trail.length ? mergeGeoms(byClass.trail) : null,
      fabric: fabricGeos.length ? mergeGeoms(fabricGeos) : null,
      junctions: junctionDiscs(),
    }
  }, [])
  const tex = useMemo(() => roadTextures(), [])

  return (
    <group>
      {/* dirt casing/shoulder under the arteries, blending into the dust halo */}
      <mesh geometry={shoulder} receiveShadow>
        <meshStandardMaterial color="#a9885c" roughness={1} metalness={0} />
      </mesh>
      {/* the residential street fabric — one flat earthen tone */}
      {fabric && (
        <mesh geometry={fabric} receiveShadow>
          <meshStandardMaterial color="#a5825a" roughness={1} metalness={0} />
        </mesh>
      )}
      {asphalt && (
        <mesh geometry={asphalt} receiveShadow>
          <meshStandardMaterial map={tex.asphalt} roughness={0.94} metalness={0} />
        </mesh>
      )}
      {laterite && (
        <mesh geometry={laterite} receiveShadow>
          <meshStandardMaterial map={tex.laterite} roughness={1} metalness={0} />
        </mesh>
      )}
      {trail && (
        <mesh geometry={trail} receiveShadow>
          <meshStandardMaterial map={tex.laterite} color="#b08c68" roughness={1} metalness={0} />
        </mesh>
      )}
      {/* lane markings — worn white paint on the arteries */}
      {markings && (
        <mesh geometry={markings} receiveShadow>
          <meshStandardMaterial color="#ddd8c4" roughness={0.85} metalness={0} polygonOffset polygonOffsetFactor={-2} />
        </mesh>
      )}
      {/* junction patches — one worn-earth disc per shared endpoint */}
      {junctions && (
        <mesh geometry={junctions} receiveShadow>
          <meshStandardMaterial color="#8f7248" roughness={1} metalness={0} />
        </mesh>
      )}
    </group>
  )
}

/* --------------------------------- bridges ---------------------------------- */

function Bridges() {
  const tex = useMemo(() => roadTextures(), [])
  const built = useMemo(() => {
    const decks: THREE.BufferGeometry[] = []
    const rails: THREE.BufferGeometry[] = []
    const piers: THREE.BufferGeometry[] = []
    const surfA: THREE.BufferGeometry[] = []
    const surfL: THREE.BufferGeometry[] = []
    const m = new THREE.Matrix4()
    const p = new THREE.Vector3()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const s = new THREE.Vector3(1, 1, 1)
    for (const b of BRIDGES) {
      // +3 so the visible deck ends where the walkable deck zone ends
      // (collision uses length/2 + 1.5) — ends land on the bank, not mid-water
      const L = b.length + 3
      const W = b.width
      const cls: RoadClass = b.cls === 'asphalt' ? 'asphalt' : b.cls === 'laterite' ? 'laterite' : 'trail'
      e.set(0, b.rotY, 0)
      q.setFromEuler(e)
      p.set(b.x, b.y, b.z)
      m.compose(p, q, s)
      // deck slab
      const deck = new THREE.BoxGeometry(W, 0.55, L)
      deck.applyMatrix4(m)
      decks.push(deck)
      // road surface riding the deck, in the carrying road's own style
      const surf = new THREE.PlaneGeometry(W, L)
      surf.rotateX(-Math.PI / 2)
      const uvA = surf.attributes.uv as THREE.BufferAttribute
      for (let k = 0; k < uvA.count; k++) uvA.setY(k, uvA.getY(k) * (L / 7.2))
      surf.translate(0, 0.29, 0)
      surf.applyMatrix4(m)
      ;(cls === 'asphalt' ? surfA : surfL).push(surf)
      // post-and-rail railings, both sides
      for (const side of [-1, 1]) {
        const rx = side * (W / 2 - 0.28)
        const top = new THREE.BoxGeometry(0.12, 0.1, L)
        top.translate(rx, 0.98, 0)
        top.applyMatrix4(m)
        rails.push(top)
        const mid = new THREE.BoxGeometry(0.09, 0.08, L)
        mid.translate(rx, 0.66, 0)
        mid.applyMatrix4(m)
        rails.push(mid)
        for (let z = -L / 2 + 1; z <= L / 2 - 1; z += 2.6) {
          const post = new THREE.BoxGeometry(0.14, 0.62, 0.14)
          post.translate(rx, 0.58, z)
          post.applyMatrix4(m)
          rails.push(post)
        }
      }
      // two pylons down through the waterline
      for (const z of [-L * 0.28, L * 0.28]) {
        const py = new THREE.BoxGeometry(1.35, 3.6, 0.95)
        py.translate(0, -1.7, z)
        py.applyMatrix4(m)
        piers.push(py)
      }
      // stone abutments masking the deck ends down to the terrain
      const dirX = Math.sin(b.rotY)
      const dirZ = Math.cos(b.rotY)
      for (const sd of [-1, 1]) {
        const ex = b.x + dirX * (L / 2 - 1)
        const ez = b.z + dirZ * (L / 2 - 1)
        const gh = heightAt(ex, ez)
        const h = Math.max(1, b.y - 0.27 - gh + 0.5)
        const ab = new THREE.BoxGeometry(W - 0.6, h, 2.4)
        ab.translate(ex, gh - 0.5 + h / 2, ez)
        piers.push(ab)
      }
    }
    return {
      deck: mergeGeoms(decks),
      rail: mergeGeoms(rails),
      pier: mergeGeoms(piers),
      surfA: surfA.length ? mergeGeoms(surfA) : null,
      surfL: surfL.length ? mergeGeoms(surfL) : null,
    }
  }, [])

  return (
    <group>
      <mesh geometry={built.deck} castShadow receiveShadow>
        <meshStandardMaterial color="#989083" roughness={0.95} metalness={0} />
      </mesh>
      {built.surfA && (
        <mesh geometry={built.surfA} receiveShadow>
          <meshStandardMaterial map={tex.asphalt} roughness={0.94} metalness={0} />
        </mesh>
      )}
      {built.surfL && (
        <mesh geometry={built.surfL} receiveShadow>
          <meshStandardMaterial map={tex.laterite} roughness={1} metalness={0} />
        </mesh>
      )}
      <mesh geometry={built.rail} castShadow>
        <meshStandardMaterial color="#6d675c" roughness={0.8} metalness={0.25} />
      </mesh>
      <mesh geometry={built.pier}>
        <meshStandardMaterial color="#8d8474" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

/* ---------------------------------- grass ----------------------------------- */

/**
 * A tuft of `blades` crossed, tapered blades with a slight bend — reads as
 * grass from any angle instead of flat paper shards. The W2 attributes ride
 * along: aSway = the tip-ward wind weight (0 rooted, 1 at the tip) and
 * aLeaf = 1 (the weather-gold mask — grass IS leaf, harmattan owns it).
 */
function tuftGeometry(blades: number, w: number, h: number, bend: number): THREE.BufferGeometry {
  const pos: number[] = []
  const idx: number[] = []
  const sway: number[] = []
  const leaf: number[] = []
  for (let bI = 0; bI < blades; bI++) {
    const a = (bI / blades) * Math.PI
    const cos = Math.cos(a)
    const sin = Math.sin(a)
    const base = pos.length / 3
    const v: [number, number, number][] = [
      [-w, 0, 0],
      [w, 0, 0],
      [-w * 0.45 + bend * 0.35, h * 0.55, bend * 0.28],
      [w * 0.45 + bend * 0.35, h * 0.55, bend * 0.28],
      [bend, h, bend * 0.55],
    ]
    for (const [vx, vy, vz] of v) {
      pos.push(vx * cos - vz * sin, vy, vx * sin + vz * cos)
      sway.push(Math.min(1, (vy / h) * (vy / h) * 1.4)) // quadratic tip-ward
      leaf.push(1)
    }
    idx.push(base, base + 1, base + 3, base, base + 3, base + 2, base + 2, base + 3, base + 4)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aSway', new THREE.Float32BufferAttribute(sway, 1))
  g.setAttribute('aLeaf', new THREE.Float32BufferAttribute(leaf, 1))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

/**
 * Savanna ground cover — W2: 10,000 tufts (was 3.2k) placed by flora.ts's
 * law engine (off tarmac AND shoulders via roadGap, above the waterline
 * with the sink judged, out of the river, off the anchor plazas), split
 * over two InstancedMeshes with per-instance colour from the moisture
 * gradient + deterministic hue jitter. The shared flora shader gives every
 * blade its own tip-ward sway (phase from the instance position — zero
 * CPU) and hands the M6 weather the whole field: harmattan golds it, the
 * rains deepen it. No shadows (the old law), 2 draw calls.
 */
function Grass() {
  const refA = useRef<THREE.InstancedMesh>(null)
  const refB = useRef<THREE.InstancedMesh>(null)

  const { geoA, geoB, mat, countA, countB } = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 1,
      metalness: 0,
    })
    applyFloraShader(mat, 0.26) // W2 — the field breathes with the trees
    return {
      geoA: tuftGeometry(2, 0.22, 1.3, 0.34), // tall crossed pair
      geoB: tuftGeometry(3, 0.17, 0.95, 0.5), // shorter three-blade star
      mat,
      countA: Math.ceil(GRASS_TUFTS.length / 2),
      countB: Math.floor(GRASS_TUFTS.length / 2),
    }
  }, [])

  useEffect(() => () => mat.dispose(), [mat])

  useEffect(() => {
    const meshA = refA.current
    const meshB = refB.current
    if (!meshA || !meshB) return
    const meshes = [meshA, meshB]
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const sc = new THREE.Vector3()
    const p = new THREE.Vector3()
    const color = new THREE.Color()
    GRASS_TUFTS.forEach((g, i) => {
      const mesh = meshes[i % 2]
      const k = Math.floor(i / 2)
      // deterministic per-tuft jitter — yaw, lean, stretch, hue
      e.set(
        (hash1(i * 3.7 + 1.3) - 0.5) * 0.3,
        hash1(i * 12.9898) * Math.PI * 2,
        (hash1(i * 7.9 + 4.1) - 0.5) * 0.3,
      )
      q.setFromEuler(e)
      // modest cap — savanna tufts, not thorn bushes (keeps night silhouettes soft)
      const s = Math.min(g.s, 1.15) * 0.74
      const sy = s * (0.85 + hash1(i * 5.1) * 0.4)
      sc.set(s, sy, s)
      p.set(g.x, g.y, g.z)
      m.compose(p, q, sc)
      mesh.setMatrixAt(k, m)
      color.set(GRASS_TONES[g.tone])
      color.offsetHSL(
        (hash1(i * 2.3) - 0.5) * 0.035,
        (hash1(i * 8.7) - 0.5) * 0.16,
        (hash1(i * 4.9) - 0.5) * 0.07,
      )
      mesh.setColorAt(k, color)
    })
    for (const mesh of meshes) {
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  }, [])

  return (
    <group>
      <instancedMesh ref={refA} args={[geoA, mat, countA]} frustumCulled={false} />
      <instancedMesh ref={refB} args={[geoB, mat, countB]} frustumCulled={false} />
    </group>
  )
}

/** tiny dry-season flower dots near the rivers — a few dozen, one draw call */
const FLOWER_TONES = ['#e8cf6f', '#d9814f', '#efe9dc']

function Flowers() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const { geo, mat, list } = useMemo(() => {
    const list: { x: number; z: number; y: number; s: number; c: number }[] = []
    for (let i = 0; i < GRASS.length && list.length < 72; i += 11) {
      const g = GRASS[i]
      const rv = riverInfo(g.x, g.z)
      if (rv.d > rv.halfWidth + 11) continue
      list.push({ x: g.x, z: g.z, y: g.y, s: 0.75 + hash1(i * 6.6) * 0.6, c: Math.floor(hash1(i * 3.3) * 3) })
    }
    return {
      geo: new THREE.SphereGeometry(0.085, 6, 5),
      mat: new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0 }),
      list,
    }
  }, [])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const color = new THREE.Color()
    list.forEach((f, i) => {
      m.compose(
        new THREE.Vector3(f.x, f.y + 0.55 * f.s, f.z),
        q,
        new THREE.Vector3(f.s, f.s, f.s),
      )
      mesh.setMatrixAt(i, m)
      color.set(FLOWER_TONES[f.c])
      mesh.setColorAt(i, color)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [list])

  return <instancedMesh ref={ref} args={[geo, mat, list.length]} frustumCulled={false} />
}

/* --------------------------------- kerbs ------------------------------------ */

/**
 * Raised concrete kerb lines along both edges of every asphalt artery —
 * the data comes from world3d/roads.ts (pure laws: junction mouths stay
 * open, bridges carry their own structure, nothing in water/yards). Each
 * run segment becomes one draped slab that rides heightAt at both ends.
 * All merged: one draw call, one material.
 */
function Kerbs() {
  const geo = useMemo(() => {
    const slabs: THREE.BufferGeometry[] = []
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3(1, 1, 1)
    for (const r of KERB_RUNS) {
      const dx = r.bx - r.ax
      const dz = r.bz - r.az
      const len = Math.hypot(dx, dz)
      if (len < 0.4 || len > 6) continue // data guarantee: ≤ one 4u sample + chord; skip strays
      const mx = (r.ax + r.bx) / 2
      const mz = (r.az + r.bz) / 2
      const yL = heightAt(r.ax, r.az)
      const yR = heightAt(r.bx, r.bz)
      e.set(0, Math.atan2(dx, dz), 0)
      q.setFromEuler(e)
      p.set(mx, (yL + yR) / 2 + 0.075, mz)
      m.compose(p, q, s)
      const slab = new THREE.BoxGeometry(0.22, 0.15, len + 0.08)
      slab.applyMatrix4(m)
      slabs.push(slab)
    }
    return slabs.length ? mergeGeoms(slabs) : null
  }, [])
  if (!geo) return null
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#b3ad9f" roughness={0.95} metalness={0} />
    </mesh>
  )
}

/* --------------------------------- zebras ------------------------------------ */

/**
 * Zebra crossings at the artery junction mouths — 5 worn-white bands per
 * crossing, laid across the carriageway just outside each junction disc,
 * from the same deterministic roads.ts data. One merged draw call riding
 * the markings' polygon offset so the paint never z-fights the tarmac.
 */
function Zebras() {
  const geo = useMemo(() => {
    const stripes: THREE.BufferGeometry[] = []
    for (const z of ZEBRAS) {
      const ux = Math.sin(z.rotY)
      const uz = Math.cos(z.rotY)
      const across = z.half * 2 - 0.6
      if (across < 1.2) continue
      for (let i = 0; i < 5; i++) {
        const along = (i - 2) * 0.95
        const x = z.x + ux * along
        const zz = z.z + uz * along
        const stripe = new THREE.PlaneGeometry(across, 0.48)
        stripe.rotateX(-Math.PI / 2)
        stripe.rotateY(z.rotY)
        stripe.translate(x, heightAt(x, zz) + 0.115, zz)
        stripes.push(stripe)
      }
    }
    return stripes.length ? mergeGeoms(stripes) : null
  }, [])
  if (!geo) return null
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial color="#ddd8c4" roughness={0.85} metalness={0} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  )
}

/* ---------------------------------- export ---------------------------------- */

export function WorldTerrain() {
  return (
    <group>
      <TerrainMesh />
      <Grass />
      <Flowers />
      <Rivers />
      <Roads />
      <Kerbs />
      <Zebras />
      <Bridges />
    </group>
  )
}
