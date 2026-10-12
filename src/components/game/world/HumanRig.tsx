'use client'

/**
 * LOKOJA LIFE — Human Rig (Stage 5 "perfect the human")
 * -----------------------------------------------------
 * An articulated low-poly Nigerian: jointed limbs (shoulders/elbows,
 * hips/knees), hands, feet, a head with real hair shapes, and a walk
 * cycle with knee flex + counter-swinging arms + torso bob + hip sway,
 * an idle breathing loop and a run lean.
 *
 * Stage 5 refinements:
 *  - 7.5-head proportions (~1.84 m): longer legs (52% of height),
 *    relaxed shoulders, visible waist taper, smaller head.
 *  - Clothing styles rendered on the body from `colors.style`
 *    (tshirt / kaftan / ankara / senator / hoodie / lace) with clothAlt
 *    2-tone bands, collars, hoods and hems; `dress` + coarse
 *    `hairStyle` remain supported for older callers.
 *  - Hairstyle 3D hints from `colors.hairstyle`: afro cap, dreads/braids
 *    back strands, waves/low-cut/cornrows snug cap, puffs side spheres.
 *
 * Two tiers keep the frame budget honest:
 *  - HumanRig (full): the PLAYER only — every joint, casts shadows.
 *  - MidRig: NPCs — jointed legs + one-piece swinging arms, no
 *    forearm/hand meshes, no shadow casting (blob shadows carry them).
 *
 * Animation is driven entirely by a speedRef the controllers write —
 * the rig owns zero gameplay state. Frame loops allocate nothing.
 */

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export interface RigColors {
  skin: string
  cloth: string
  clothAlt?: string
  hair: string
  /** legacy coarse enum — superseded by `hairstyle` when present */
  hairStyle: 'none' | 'cap' | 'volume'
  /** legacy kaftan flag — superseded by `style` when present */
  dress?: boolean
  /** Stage 5 — raw key from AVATAR_HAIRSTYLES (bald/low-cut/waves/afro/cornrows/dreads/braids/puffs) */
  hairstyle?: string
  /** Stage 5 — raw key from AVATAR_CLOTHING_STYLES (tshirt/kaftan/ankara/senator/hoodie/lace) */
  style?: string
}

/* ------------------------- style + hair resolution ------------------------- */

export type RigStyle = 'tshirt' | 'kaftan' | 'ankara' | 'senator' | 'hoodie' | 'lace'

const KNOWN_STYLES: ReadonlySet<string> = new Set([
  'tshirt', 'kaftan', 'ankara', 'senator', 'hoodie', 'lace',
])
const DRESS_LIKE: ReadonlySet<string> = new Set(['kaftan', 'lace'])
const LONG_SLEEVE: ReadonlySet<string> = new Set(['kaftan', 'senator', 'hoodie', 'lace'])
const SENATOR_TROUSERS = 'senator'
const CAP_HAIR: ReadonlySet<string> = new Set(['low-cut', 'waves', 'cornrows'])
const STRAND_HAIR: ReadonlySet<string> = new Set(['dreads', 'braids'])

/** effective clothing style — new key wins, then the legacy `dress` flag */
export function rigStyleOf(c: RigColors): RigStyle {
  if (c.style && KNOWN_STYLES.has(c.style)) return c.style as RigStyle
  return c.dress ? 'kaftan' : 'tshirt'
}

/** effective hairstyle key — new key wins, then the legacy coarse enum */
export function rigHairOf(c: RigColors): string {
  if (c.hairstyle) return c.hairstyle
  if (c.hairStyle === 'volume') return 'afro'
  if (c.hairStyle === 'cap') return 'low-cut'
  return 'bald'
}

/* -------------------------------- proportions ------------------------------- */

/**
 * Shared proportion table (both rigs read it) — a ~1.84 m stylised human
 * on roughly 7.5 heads: legs 52% of height, relaxed shoulder line and a
 * waist that tapers between pelvis and chest.
 */
const P = {
  hipY: 0.96,
  thigh: { r: 0.088, len: 0.34, drop: 0.52 },
  shin: { r: 0.068, len: 0.28 },
  foot: { y: -0.4, z: 0.06, w: 0.13, h: 0.085, l: 0.27 },
  pelvis: { y: 0.9, r: 0.165, len: 0.1 },
  waist: { y: 1.05, r: 0.152, len: 0.12 },
  chest: { y: 1.24, r: 0.205, len: 0.32 },
  shoulder: { y: 1.45, x: 0.27 },
  upperArm: { r: 0.068, len: 0.26, elbow: 0.38 },
  foreArm: { r: 0.056, len: 0.18, handY: -0.28, handR: 0.07 },
  neck: { y: 1.565 },
  head: { y: 1.71, r: 0.127 },
}

/* --------------------------------- materials -------------------------------- */

interface RigMats {
  skin: THREE.MeshStandardMaterial
  cloth: THREE.MeshStandardMaterial
  clothAlt: THREE.MeshStandardMaterial
  trim: THREE.MeshStandardMaterial
  hair: THREE.MeshStandardMaterial
  dark: THREE.MeshStandardMaterial
  shoe: THREE.MeshStandardMaterial
}

function useRigMaterials(c: RigColors): RigMats {
  return useMemo(() => {
    const trim = new THREE.Color(c.cloth).multiplyScalar(0.68)
    return {
      skin: new THREE.MeshStandardMaterial({ color: c.skin, roughness: 0.72 }),
      cloth: new THREE.MeshStandardMaterial({ color: c.cloth, roughness: 0.9 }),
      clothAlt: new THREE.MeshStandardMaterial({ color: c.clothAlt ?? c.cloth, roughness: 0.9 }),
      trim: new THREE.MeshStandardMaterial({ color: trim, roughness: 0.92 }),
      hair: new THREE.MeshStandardMaterial({ color: c.hair, roughness: 1 }),
      dark: new THREE.MeshStandardMaterial({ color: '#26221e', roughness: 1 }),
      shoe: new THREE.MeshStandardMaterial({ color: '#3a332c', roughness: 0.95 }),
    }
  }, [c.skin, c.cloth, c.clothAlt, c.hair, c.hairstyle, c.style, c.hairStyle, c.dress])
}

/* ------------------------------ hairstyle hints ----------------------------- */

/**
 * 3D hair shapes for one head (head-local space, back = −z).
 * `detail` = player tier (5 strands), false = NPC tier (3 strands).
 */
function HairPieces({ hair, m, detail, seg }: { hair: string; m: RigMats; detail: boolean; seg: number }) {
  if (hair === 'bald') return null
  if (CAP_HAIR.has(hair)) {
    // waves / low-cut / cornrows — snug cap hugging the skull
    return (
      <mesh position={[0, 0.035, -0.015]} scale={[1.07, 0.82, 1.07]} material={m.hair}>
        <sphereGeometry args={[P.head.r, seg, seg]} />
      </mesh>
    )
  }
  if (hair === 'afro') {
    // rounded cap sphere, slightly flattened and pushed back
    return (
      <mesh position={[0, 0.05, -0.012]} scale={[1.04, 0.94, 1.04]} material={m.hair}>
        <sphereGeometry args={[P.head.r * 1.22, seg, seg]} />
      </mesh>
    )
  }
  if (hair === 'puffs') {
    // snug base + two side spheres
    return (
      <>
        <mesh position={[0, 0.035, -0.015]} scale={[1.07, 0.82, 1.07]} material={m.hair}>
          <sphereGeometry args={[P.head.r, seg, seg]} />
        </mesh>
        <mesh position={[0.125, 0.085, -0.02]} material={m.hair}>
          <sphereGeometry args={[0.072, seg, seg]} />
        </mesh>
        <mesh position={[-0.125, 0.085, -0.02]} material={m.hair}>
          <sphereGeometry args={[0.072, seg, seg]} />
        </mesh>
      </>
    )
  }
  if (STRAND_HAIR.has(hair)) {
    // dreads / braids — thin strands hanging from the back of the head
    const long = hair === 'braids'
    const strands: [number, number, number, number][] = detail
      ? long
        ? [ // braids — five long strands to the shoulders
            [0.088, -0.13, -0.058, 0.4],
            [-0.088, -0.13, -0.058, 0.4],
            [0.042, -0.12, -0.1, 0.34],
            [-0.042, -0.12, -0.1, 0.34],
            [0, -0.125, -0.112, 0.32],
          ]
        : [ // dreads — four mid-length locs
            [0.075, -0.1, -0.082, 0.26],
            [-0.075, -0.1, -0.082, 0.26],
            [0.028, -0.115, -0.105, 0.28],
            [-0.028, -0.115, -0.105, 0.28],
          ]
      : [ // NPC tier — three strands
          [0.07, -0.1, -0.08, 0.24],
          [-0.07, -0.1, -0.08, 0.24],
          [0, -0.11, -0.104, 0.22],
        ]
    return (
      <>
        <mesh position={[0, 0.035, -0.015]} scale={[1.07, 0.82, 1.07]} material={m.hair}>
          <sphereGeometry args={[P.head.r, seg, seg]} />
        </mesh>
        {strands.map(([x, y, z, len], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[long ? 0.08 : 0.12, 0, -x * 1.6]} material={m.hair}>
            <boxGeometry args={[0.034, len, 0.034]} />
          </mesh>
        ))}
      </>
    )
  }
  return null
}

/* ----------------------------------- full rig -------------------------------- */

interface LimbRefs {
  lArm: THREE.Group | null
  rArm: THREE.Group | null
  lFore: THREE.Group | null
  rFore: THREE.Group | null
  lLeg: THREE.Group | null
  rLeg: THREE.Group | null
  lShin: THREE.Group | null
  rShin: THREE.Group | null
  chest: THREE.Mesh | null
  body: THREE.Group | null
}

/**
 * The full articulated human — ~1.84 m, pivot-based limbs.
 * speedRef: units/s movement speed (0 = idle breathing).
 */
export function HumanRig({ colors, speedRef, castShadow = true }: { colors: RigColors; speedRef: { current: number }; castShadow?: boolean }) {
  const m = useRigMaterials(colors)
  const style = rigStyleOf(colors)
  const hairstyle = rigHairOf(colors)
  const dressLike = DRESS_LIKE.has(style)
  const refs = useRef<LimbRefs>({
    lArm: null, rArm: null, lFore: null, rFore: null,
    lLeg: null, rLeg: null, lShin: null, rShin: null,
    chest: null, body: null,
  })
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const r = refs.current
    const t = state.clock.elapsedTime + phase
    const s = speedRef.current
    const walk = Math.min(1, s / 4.4)
    const run = Math.max(0, Math.min(1, (s - 4.4) / 3))
    const f = 8.4 + run * 2.6
    const swing = Math.sin(t * f) * (0.52 + run * 0.22) * walk

    // arms counter-swing (phase-locked to the legs), elbows flex more while running
    if (r.lArm) r.lArm.rotation.x = -swing
    if (r.rArm) r.rArm.rotation.x = swing
    if (r.lFore) r.lFore.rotation.x = -0.26 - run * 0.72 - Math.max(0, -swing) * 0.55
    if (r.rFore) r.rFore.rotation.x = -0.26 - run * 0.72 - Math.max(0, swing) * 0.55

    // legs: thigh swing + knee flex on the back-swing (toe-off)
    if (r.lLeg) r.lLeg.rotation.x = swing
    if (r.rLeg) r.rLeg.rotation.x = -swing
    if (r.lShin) r.lShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 0.5)) * 0.82 * walk
    if (r.rShin) r.rShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 1.5)) * 0.82 * walk

    // torso bob (two beats per stride) + run lean + gentle hip sway
    if (r.body) {
      r.body.position.y = Math.abs(Math.sin(t * f)) * walk * 0.05
      r.body.rotation.x = run * 0.16
      r.body.rotation.z = Math.sin(t * f) * 0.035 * walk
    }
    // idle breathing — chest scale 1 ± 0.01, faster and subtler than before
    if (r.chest) {
      const breathe = 1 + Math.sin(t * 2.6) * 0.01 * (1 - walk * 0.7)
      r.chest.scale.set(breathe, 1, breathe)
    }
  })

  const sh = castShadow
  // limb + trouser materials by style
  const thighMat = dressLike ? m.cloth : style === SENATOR_TROUSERS ? m.cloth : m.dark
  const shinMat = dressLike ? m.skin : style === SENATOR_TROUSERS ? m.cloth : style === 'hoodie' ? m.dark : m.skin
  const pelvisMat = dressLike || style === SENATOR_TROUSERS ? m.cloth : m.dark
  const foreMat = LONG_SLEEVE.has(style) ? m.cloth : m.skin

  const Arm = ({ side }: { side: -1 | 1 }) => (
    <group
      ref={(el) => {
        if (side === -1) refs.current.lArm = el
        else refs.current.rArm = el
      }}
      position={[side * P.shoulder.x, P.shoulder.y, 0]}
    >
      {/* upper arm pivots at the shoulder */}
      <mesh position={[0, -0.21, 0]} castShadow={sh} material={m.cloth}>
        <capsuleGeometry args={[P.upperArm.r, P.upperArm.len, 3, 7]} />
      </mesh>
      <group
        ref={(el) => {
          if (side === -1) refs.current.lFore = el
          else refs.current.rFore = el
        }}
        position={[0, -P.upperArm.elbow, 0]}
      >
        {/* forearm pivots at the elbow */}
        <mesh position={[0, -0.13, 0]} castShadow={sh} material={foreMat}>
          <capsuleGeometry args={[P.foreArm.r, P.foreArm.len, 3, 7]} />
        </mesh>
        {/* hand */}
        <mesh position={[0, P.foreArm.handY, 0]} castShadow={sh} material={m.skin}>
          <sphereGeometry args={[P.foreArm.handR, 8, 8]} />
        </mesh>
      </group>
    </group>
  )

  const Leg = ({ side }: { side: -1 | 1 }) => (
    <group
      ref={(el) => {
        if (side === -1) refs.current.lLeg = el
        else refs.current.rLeg = el
      }}
      position={[side * 0.12, P.hipY, 0]}
    >
      {/* thigh pivots at the hip */}
      <mesh position={[0, -0.26, 0]} castShadow={sh} material={thighMat}>
        <capsuleGeometry args={[P.thigh.r, P.thigh.len, 3, 7]} />
      </mesh>
      <group
        ref={(el) => {
          if (side === -1) refs.current.lShin = el
          else refs.current.rShin = el
        }}
        position={[0, -P.thigh.drop, 0]}
      >
        {/* shin pivots at the knee */}
        <mesh position={[0, -0.21, 0]} castShadow={sh} material={shinMat}>
          <capsuleGeometry args={[P.shin.r, P.shin.len, 3, 7]} />
        </mesh>
        {/* foot */}
        <mesh position={[0, P.foot.y, P.foot.z]} castShadow={sh} material={m.shoe}>
          <boxGeometry args={[P.foot.w, P.foot.h, P.foot.l]} />
        </mesh>
      </group>
    </group>
  )

  return (
    <group ref={(el) => { refs.current.body = el }} position={[0, 0, 0]}>
      <Leg side={-1} />
      <Leg side={1} />
      {/* pelvis */}
      <mesh position={[0, P.pelvis.y, 0]} castShadow={sh} material={pelvisMat}>
        <capsuleGeometry args={[P.pelvis.r, P.pelvis.len, 3, 8]} />
      </mesh>
      {/* waist taper — the subtle inward curve between pelvis and chest */}
      <mesh position={[0, P.waist.y, 0]} castShadow={sh} material={m.cloth}>
        <capsuleGeometry args={[P.waist.r, P.waist.len, 3, 9]} />
      </mesh>
      {/* chest */}
      <mesh
        ref={(el) => { refs.current.chest = el }}
        position={[0, P.chest.y, 0]}
        castShadow={sh}
        material={m.cloth}
      >
        <capsuleGeometry args={[P.chest.r, P.chest.len, 4, 10]} />
      </mesh>

      {/* ---- clothing styles ---- */}
      {style === 'kaftan' && (
        <>
          {/* long tunic to mid-thigh */}
          <mesh position={[0, 0.94, 0]} castShadow={sh} material={m.cloth}>
            <cylinderGeometry args={[0.215, 0.35, 0.8, 12]} />
          </mesh>
          {/* V collar + placket */}
          <mesh position={[0.05, 1.415, 0.145]} rotation={[0, 0, 0.5]} castShadow={sh} material={m.trim}>
            <boxGeometry args={[0.035, 0.14, 0.012]} />
          </mesh>
          <mesh position={[-0.05, 1.415, 0.145]} rotation={[0, 0, -0.5]} castShadow={sh} material={m.trim}>
            <boxGeometry args={[0.035, 0.14, 0.012]} />
          </mesh>
          <mesh position={[0, 1.31, 0.192]} castShadow={sh} material={m.trim}>
            <boxGeometry args={[0.018, 0.16, 0.012]} />
          </mesh>
        </>
      )}
      {style === 'lace' && (
        <>
          {/* occasion gown below the knee + contrast hem */}
          <mesh position={[0, 0.9, 0]} castShadow={sh} material={m.cloth}>
            <cylinderGeometry args={[0.205, 0.375, 0.95, 12]} />
          </mesh>
          <mesh position={[0, 0.45, 0]} castShadow={sh} material={m.clothAlt}>
            <cylinderGeometry args={[0.382, 0.382, 0.055, 12]} />
          </mesh>
        </>
      )}
      {style === 'ankara' && (
        <>
          {/* 2-tone print bands (clothAlt) over the base cloth */}
          <mesh position={[0, 1.08, 0]} castShadow={sh} material={m.clothAlt}>
            <cylinderGeometry args={[0.212, 0.212, 0.1, 12]} />
          </mesh>
          <mesh position={[0, 1.35, 0]} castShadow={sh} material={m.clothAlt}>
            <cylinderGeometry args={[0.185, 0.185, 0.07, 12]} />
          </mesh>
        </>
      )}
      {style === SENATOR_TROUSERS && (
        <>
          {/* crisp 2-piece: straight collar + button line */}
          <mesh position={[0.055, 1.42, 0.15]} rotation={[0, 0, 0.55]} castShadow={sh} material={m.trim}>
            <boxGeometry args={[0.11, 0.035, 0.012]} />
          </mesh>
          <mesh position={[-0.055, 1.42, 0.15]} rotation={[0, 0, -0.55]} castShadow={sh} material={m.trim}>
            <boxGeometry args={[0.11, 0.035, 0.012]} />
          </mesh>
          <mesh position={[0, 1.3, 0.198]} castShadow={sh} material={m.trim}>
            <boxGeometry args={[0.018, 0.2, 0.01]} />
          </mesh>
        </>
      )}
      {style === 'hoodie' && (
        <>
          {/* hood bunched behind the neck + kangaroo pocket */}
          <mesh position={[0, 1.5, -0.1]} scale={[1.18, 0.72, 0.9]} castShadow={sh} material={m.cloth}>
            <sphereGeometry args={[0.13, 10, 10]} />
          </mesh>
          <mesh position={[0, 1.06, 0.182]} castShadow={sh} material={m.trim}>
            <boxGeometry args={[0.17, 0.085, 0.03]} />
          </mesh>
        </>
      )}

      <Arm side={-1} />
      <Arm side={1} />
      {/* neck + head */}
      <mesh position={[0, P.neck.y, 0]} material={m.skin}>
        <cylinderGeometry args={[0.055, 0.065, 0.09, 8]} />
      </mesh>
      <group position={[0, P.head.y, 0]}>
        <mesh castShadow={sh} material={m.skin}>
          <sphereGeometry args={[P.head.r, 14, 14]} />
        </mesh>
        {/* subtle jaw */}
        <mesh position={[0, -0.04, 0.028]} scale={[0.88, 0.72, 0.92]} material={m.skin}>
          <sphereGeometry args={[0.115, 12, 12]} />
        </mesh>
        <HairPieces hair={hairstyle} m={m} detail seg={12} />
      </group>
    </group>
  )
}

/* --------------------------------- mid rig ---------------------------------- */

interface MidRefs {
  lArm: THREE.Group | null
  rArm: THREE.Group | null
  lLeg: THREE.Group | null
  rLeg: THREE.Group | null
  lShin: THREE.Group | null
  rShin: THREE.Group | null
  chest: THREE.Mesh | null
  body: THREE.Group | null
}

/** NPC tier — jointed legs, one-piece arms, no shadow casting. */
export function MidRig({ colors, speedRef }: { colors: RigColors; speedRef: { current: number } }) {
  const m = useRigMaterials(colors)
  const style = rigStyleOf(colors)
  const hairstyle = rigHairOf(colors)
  const dressLike = DRESS_LIKE.has(style)
  const refs = useRef<MidRefs>({ lArm: null, rArm: null, lLeg: null, rLeg: null, lShin: null, rShin: null, chest: null, body: null })
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const r = refs.current
    const t = state.clock.elapsedTime + phase
    const s = speedRef.current
    const walk = Math.min(1, s / 4.4)
    const run = Math.max(0, Math.min(1, (s - 4.4) / 3))
    const f = 8.4 + run * 2.6
    const swing = Math.sin(t * f) * 0.5 * walk
    if (r.lArm) r.lArm.rotation.x = -swing
    if (r.rArm) r.rArm.rotation.x = swing
    if (r.lLeg) r.lLeg.rotation.x = swing
    if (r.rLeg) r.rLeg.rotation.x = -swing
    if (r.lShin) r.lShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 0.5)) * 0.8 * walk
    if (r.rShin) r.rShin.rotation.x = Math.max(0, Math.sin(t * f + Math.PI * 1.5)) * 0.8 * walk
    if (r.body) {
      r.body.position.y = Math.abs(Math.sin(t * f)) * walk * 0.045
      r.body.rotation.z = Math.sin(t * f) * 0.03 * walk
    }
    if (r.chest) {
      const breathe = 1 + Math.sin(t * 2.6) * 0.01 * (1 - walk * 0.7)
      r.chest.scale.set(breathe, 1, breathe)
    }
  })

  // simplified cloth rules (same logic as the full rig, fewer meshes)
  const thighMat = dressLike || style === SENATOR_TROUSERS ? m.cloth : m.dark
  const shinMat = dressLike ? m.skin : style === SENATOR_TROUSERS ? m.cloth : style === 'hoodie' ? m.dark : m.skin
  const pelvisMat = dressLike || style === SENATOR_TROUSERS ? m.cloth : m.dark

  const Leg = ({ side }: { side: -1 | 1 }) => (
    <group
      ref={(el) => {
        if (side === -1) refs.current.lLeg = el
        else refs.current.rLeg = el
      }}
      position={[side * 0.12, P.hipY, 0]}
    >
      <mesh position={[0, -0.26, 0]} material={thighMat}>
        <capsuleGeometry args={[P.thigh.r, P.thigh.len, 3, 6]} />
      </mesh>
      <group
        ref={(el) => {
          if (side === -1) refs.current.lShin = el
          else refs.current.rShin = el
        }}
        position={[0, -P.thigh.drop, 0]}
      >
        <mesh position={[0, -0.21, 0]} material={shinMat}>
          <capsuleGeometry args={[P.shin.r, P.shin.len, 3, 6]} />
        </mesh>
        <mesh position={[0, P.foot.y, P.foot.z]} material={m.shoe}>
          <boxGeometry args={[P.foot.w, P.foot.h, P.foot.l]} />
        </mesh>
      </group>
    </group>
  )

  return (
    <group ref={(el) => { refs.current.body = el }}>
      <Leg side={-1} />
      <Leg side={1} />
      <mesh position={[0, P.pelvis.y, 0]} material={pelvisMat}>
        <capsuleGeometry args={[P.pelvis.r, P.pelvis.len, 3, 8]} />
      </mesh>
      <mesh position={[0, P.waist.y, 0]} material={m.cloth}>
        <capsuleGeometry args={[P.waist.r, P.waist.len, 3, 8]} />
      </mesh>
      <mesh ref={(el) => { refs.current.chest = el }} position={[0, P.chest.y, 0]} material={m.cloth}>
        <capsuleGeometry args={[P.chest.r, P.chest.len, 4, 9]} />
      </mesh>

      {/* style silhouettes — one or two meshes each */}
      {style === 'kaftan' && (
        <mesh position={[0, 0.94, 0]} material={m.cloth}>
          <cylinderGeometry args={[0.215, 0.34, 0.8, 10]} />
        </mesh>
      )}
      {style === 'lace' && (
        <mesh position={[0, 0.9, 0]} material={m.cloth}>
          <cylinderGeometry args={[0.2, 0.36, 0.95, 10]} />
        </mesh>
      )}
      {style === 'ankara' && (
        <mesh position={[0, 1.08, 0]} material={m.clothAlt}>
          <cylinderGeometry args={[0.212, 0.212, 0.1, 10]} />
        </mesh>
      )}
      {style === 'hoodie' && (
        <mesh position={[0, 1.5, -0.1]} scale={[1.18, 0.72, 0.9]} material={m.cloth}>
          <sphereGeometry args={[0.13, 9, 9]} />
        </mesh>
      )}

      {/* one-piece arms on real shoulder pivots */}
      <group
        position={[-P.shoulder.x, P.shoulder.y, 0]}
        ref={(el) => { refs.current.lArm = el }}
      >
        <mesh position={[0, -0.28, 0]} material={m.cloth}>
          <capsuleGeometry args={[0.064, 0.42, 3, 6]} />
        </mesh>
      </group>
      <group
        position={[P.shoulder.x, P.shoulder.y, 0]}
        ref={(el) => { refs.current.rArm = el }}
      >
        <mesh position={[0, -0.28, 0]} material={m.cloth}>
          <capsuleGeometry args={[0.064, 0.42, 3, 6]} />
        </mesh>
      </group>
      <mesh position={[0, P.neck.y, 0]} material={m.skin}>
        <cylinderGeometry args={[0.055, 0.065, 0.09, 8]} />
      </mesh>
      <group position={[0, P.head.y, 0]}>
        <mesh material={m.skin}>
          <sphereGeometry args={[P.head.r, 12, 12]} />
        </mesh>
        <HairPieces hair={hairstyle} m={m} detail={false} seg={9} />
      </group>
    </group>
  )
}
