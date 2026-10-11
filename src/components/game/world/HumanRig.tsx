'use client'

/**
 * LOKOJA LIFE — Human Rig (INC 4 "perfect the human")
 * ----------------------------------------------------
 * Replaces the capsule-person with a proper articulated low-poly human:
 * jointed limbs (shoulders/elbows, hips/knees), hands, feet, a head with
 * real hair shapes, and a walk cycle with knee flex + counter-swinging
 * arms + torso bob, an idle breathing loop and a run lean.
 *
 * Two tiers keep the frame budget honest:
 *  - HumanRig (full): the PLAYER only — every joint, casts shadows.
 *  - MidRig: NPCs — jointed legs + one-piece swinging arms, no
 *    forearm/hand meshes, no shadow casting (blob shadows carry them).
 *
 * Animation is driven entirely by a speedRef the controllers write —
 * the rig owns zero gameplay state.
 */

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export interface RigColors {
  skin: string
  cloth: string
  clothAlt?: string
  hair: string
  hairStyle: 'none' | 'cap' | 'volume'
  dress?: boolean
}

/* --------------------------------- materials -------------------------------- */

function useRigMaterials(c: RigColors) {
  return useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: c.skin, roughness: 0.72 }),
      cloth: new THREE.MeshStandardMaterial({ color: c.cloth, roughness: 0.9 }),
      clothAlt: new THREE.MeshStandardMaterial({ color: c.clothAlt ?? c.cloth, roughness: 0.9 }),
      hair: new THREE.MeshStandardMaterial({ color: c.hair, roughness: 1 }),
      dark: new THREE.MeshStandardMaterial({ color: '#26221e', roughness: 1 }),
      shoe: new THREE.MeshStandardMaterial({ color: '#3a332c', roughness: 0.95 }),
    }),
    [c.skin, c.cloth, c.clothAlt, c.hair, c.hairStyle, c.dress],
  )
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
 * The full articulated human — ~1.78 m tall, pivot-based limbs.
 * speedRef: units/s movement speed (0 = idle breathing).
 */
export function HumanRig({ colors, speedRef, castShadow = true }: { colors: RigColors; speedRef: { current: number }; castShadow?: boolean }) {
  const m = useRigMaterials(colors)
  const dress = colors.dress ?? false
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
    const swing = Math.sin(t * (8.6 + run * 2.2)) * (0.5 + run * 0.25) * walk

    // arms counter-swing, elbows flex more while running
    if (r.lArm) r.lArm.rotation.x = -swing
    if (r.rArm) r.rArm.rotation.x = swing
    if (r.lFore) r.lFore.rotation.x = -0.25 - run * 0.7 - Math.max(0, -swing) * 0.6
    if (r.rFore) r.rFore.rotation.x = -0.25 - run * 0.7 - Math.max(0, swing) * 0.6

    // legs: thigh swing + knee flex on the back-swing (toe-off)
    if (r.lLeg) r.lLeg.rotation.x = swing
    if (r.rLeg) r.rLeg.rotation.x = -swing
    if (r.lShin) r.lShin.rotation.x = Math.max(0, Math.sin(t * (8.6 + run * 2.2) + Math.PI * 0.5)) * 0.85 * walk
    if (r.rShin) r.rShin.rotation.x = Math.max(0, Math.sin(t * (8.6 + run * 2.2) + Math.PI * 1.5)) * 0.85 * walk

    // torso bob + run lean + idle breathing
    if (r.body) {
      r.body.position.y = Math.abs(Math.sin(t * (8.6 + run * 2.2))) * walk * 0.05
      r.body.rotation.x = run * 0.14
    }
    if (r.chest) {
      const breathe = 1 + Math.sin(t * 1.7) * 0.02 * (1 - walk)
      r.chest.scale.set(breathe, 1, breathe)
    }
  })

  const sh = castShadow
  const Arm = ({ side }: { side: -1 | 1 }) => (
    <group
      ref={(el) => {
        if (side === -1) refs.current.lArm = el
        else refs.current.rArm = el
      }}
      position={[side * 0.31, 1.42, 0]}
    >
      {/* upper arm pivots at the shoulder */}
      <mesh position={[0, -0.19, 0]} castShadow={sh} material={m.cloth}>
        <capsuleGeometry args={[0.072, 0.26, 3, 7]} />
      </mesh>
      <group
        ref={(el) => {
          if (side === -1) refs.current.lFore = el
          else refs.current.rFore = el
        }}
        position={[0, -0.38, 0]}
      >
        {/* forearm pivots at the elbow */}
        <mesh position={[0, -0.15, 0]} castShadow={sh} material={m.skin}>
          <capsuleGeometry args={[0.06, 0.2, 3, 7]} />
        </mesh>
        {/* hand */}
        <mesh position={[0, -0.31, 0]} castShadow={sh} material={m.skin}>
          <sphereGeometry args={[0.075, 8, 8]} />
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
      position={[side * 0.12, 0.88, 0]}
    >
      {/* thigh pivots at the hip */}
      <mesh position={[0, -0.22, 0]} castShadow={sh} material={dress ? m.cloth : m.dark}>
        <capsuleGeometry args={[0.095, 0.32, 3, 7]} />
      </mesh>
      <group
        ref={(el) => {
          if (side === -1) refs.current.lShin = el
          else refs.current.rShin = el
        }}
        position={[0, -0.44, 0]}
      >
        {/* shin pivots at the knee */}
        <mesh position={[0, -0.2, 0]} castShadow={sh} material={dress ? m.skin : m.dark}>
          <capsuleGeometry args={[0.075, 0.28, 3, 7]} />
        </mesh>
        {/* foot */}
        <mesh position={[0, -0.4, 0.055]} castShadow={sh} material={m.shoe}>
          <boxGeometry args={[0.13, 0.09, 0.26]} />
        </mesh>
      </group>
    </group>
  )

  return (
    <group ref={(el) => { refs.current.body = el }} position={[0, 0, 0]}>
      {dress && (
        // wrapper dress cone over the hips
        <mesh position={[0, 0.78, 0]} castShadow={sh} material={m.cloth}>
          <coneGeometry args={[0.4, 0.85, 12]} />
        </mesh>
      )}
      <Leg side={-1} />
      <Leg side={1} />
      {/* pelvis */}
      <mesh position={[0, 0.92, 0]} castShadow={sh} material={m.dark}>
        <capsuleGeometry args={[0.17, 0.1, 3, 8]} />
      </mesh>
      {/* chest */}
      <mesh
        ref={(el) => { refs.current.chest = el }}
        position={[0, 1.2, 0]}
        castShadow={sh}
        material={m.cloth}
      >
        <capsuleGeometry args={[0.21, 0.34, 4, 10]} />
      </mesh>
      <Arm side={-1} />
      <Arm side={1} />
      {/* neck + head */}
      <mesh position={[0, 1.51, 0]} material={m.skin}>
        <cylinderGeometry args={[0.06, 0.07, 0.09, 8]} />
      </mesh>
      <group position={[0, 1.66, 0]}>
        <mesh castShadow={sh} material={m.skin}>
          <sphereGeometry args={[0.155, 14, 14]} />
        </mesh>
        {/* subtle jaw */}
        <mesh position={[0, -0.045, 0.03]} scale={[0.9, 0.75, 0.95]} material={m.skin}>
          <sphereGeometry args={[0.14, 12, 12]} />
        </mesh>
        {colors.hairStyle === 'cap' && (
          <mesh position={[0, 0.035, -0.015]} scale={[1.07, 0.82, 1.07]} material={m.hair}>
            <sphereGeometry args={[0.155, 12, 12]} />
          </mesh>
        )}
        {colors.hairStyle === 'volume' && (
          <>
            <mesh position={[0, 0.06, -0.01]} material={m.hair}>
              <sphereGeometry args={[0.2, 12, 12]} />
            </mesh>
            <mesh position={[0, 0.13, -0.12]} scale={[1.1, 0.8, 0.9]} material={m.hair}>
              <sphereGeometry args={[0.17, 10, 10]} />
            </mesh>
          </>
        )}
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
  body: THREE.Group | null
}

/** NPC tier — jointed legs, one-piece arms, no shadow casting. */
export function MidRig({ colors, speedRef }: { colors: RigColors; speedRef: { current: number } }) {
  const m = useRigMaterials(colors)
  const dress = colors.dress ?? false
  const refs = useRef<MidRefs>({ lArm: null, rArm: null, lLeg: null, rLeg: null, lShin: null, rShin: null, body: null })
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state) => {
    const r = refs.current
    const t = state.clock.elapsedTime + phase
    const walk = Math.min(1, speedRef.current / 4.4)
    const swing = Math.sin(t * 8.6) * 0.5 * walk
    if (r.lArm) r.lArm.rotation.x = -swing
    if (r.rArm) r.rArm.rotation.x = swing
    if (r.lLeg) r.lLeg.rotation.x = swing
    if (r.rLeg) r.rLeg.rotation.x = -swing
    if (r.lShin) r.lShin.rotation.x = Math.max(0, Math.sin(t * 8.6 + Math.PI * 0.5)) * 0.8 * walk
    if (r.rShin) r.rShin.rotation.x = Math.max(0, Math.sin(t * 8.6 + Math.PI * 1.5)) * 0.8 * walk
    if (r.body) r.body.position.y = Math.abs(Math.sin(t * 8.6)) * walk * 0.045
  })

  const Leg = ({ side }: { side: -1 | 1 }) => (
    <group
      ref={(el) => {
        if (side === -1) refs.current.lLeg = el
        else refs.current.rLeg = el
      }}
      position={[side * 0.12, 0.88, 0]}
    >
      <mesh position={[0, -0.22, 0]} material={dress ? m.cloth : m.dark}>
        <capsuleGeometry args={[0.095, 0.32, 3, 6]} />
      </mesh>
      <group
        ref={(el) => {
          if (side === -1) refs.current.lShin = el
          else refs.current.rShin = el
        }}
        position={[0, -0.44, 0]}
      >
        <mesh position={[0, -0.2, 0]} material={dress ? m.skin : m.dark}>
          <capsuleGeometry args={[0.075, 0.28, 3, 6]} />
        </mesh>
        <mesh position={[0, -0.4, 0.055]} material={m.shoe}>
          <boxGeometry args={[0.13, 0.09, 0.26]} />
        </mesh>
      </group>
    </group>
  )

  return (
    <group ref={(el) => { refs.current.body = el }}>
      {dress && (
        <mesh position={[0, 0.78, 0]} material={m.cloth}>
          <coneGeometry args={[0.4, 0.85, 10]} />
        </mesh>
      )}
      <Leg side={-1} />
      <Leg side={1} />
      <mesh position={[0, 0.92, 0]} material={m.dark}>
        <capsuleGeometry args={[0.17, 0.1, 3, 8]} />
      </mesh>
      <mesh position={[0, 1.2, 0]} material={m.cloth}>
        <capsuleGeometry args={[0.21, 0.34, 4, 9]} />
      </mesh>
      {/* one-piece arms on real shoulder pivots */}
      <group
        position={[-0.31, 1.42, 0]}
        ref={(el) => { refs.current.lArm = el }}
      >
        <mesh position={[0, -0.28, 0]} material={m.cloth}>
          <capsuleGeometry args={[0.068, 0.42, 3, 6]} />
        </mesh>
      </group>
      <group
        position={[0.31, 1.42, 0]}
        ref={(el) => { refs.current.rArm = el }}
      >
        <mesh position={[0, -0.28, 0]} material={m.cloth}>
          <capsuleGeometry args={[0.068, 0.42, 3, 6]} />
        </mesh>
      </group>
      <mesh position={[0, 1.51, 0]} material={m.skin}>
        <cylinderGeometry args={[0.06, 0.07, 0.09, 8]} />
      </mesh>
      <group position={[0, 1.66, 0]}>
        <mesh material={m.skin}>
          <sphereGeometry args={[0.155, 12, 12]} />
        </mesh>
        {colors.hairStyle === 'cap' && (
          <mesh position={[0, 0.035, -0.015]} scale={[1.07, 0.82, 1.07]} material={m.hair}>
            <sphereGeometry args={[0.155, 10, 10]} />
          </mesh>
        )}
        {colors.hairStyle === 'volume' && (
          <mesh position={[0, 0.06, -0.01]} material={m.hair}>
            <sphereGeometry args={[0.2, 10, 10]} />
          </mesh>
        )}
      </group>
    </group>
  )
}
