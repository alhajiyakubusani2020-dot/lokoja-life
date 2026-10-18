'use client'

/**
 * LOKOJA LIFE — M24 W2: THE REMOTE WALKERS
 * =========================================
 * Real players as real bodies in the one living city. This layer is
 * purely ADDITIVE: it mounts beside Traffic/Rain and touches NOTHING
 * that already exists (no world file edited — the 3D freeze honoured).
 *
 * THE FRAME LAW (zero React churn): the roster store only changes at
 * walk-in/walk-out cadence; the 10Hz truth lives in remotenet's module
 * map and is consumed HERE inside useFrame — positions, headings and
 * the walk cycle animate with ZERO setState, ZERO allocation per frame.
 *
 * THE HONEST BODY: each walker wears the REAL avatarLook the register
 * law minted (W1's ProfileRow read at the wire door), rendered by the
 * SAME MidRig the NPCs wear (the perf law: the player keeps the only
 * full HumanRig; remote bodies are street people, not heroes). The walk
 * cycle is driven by the MEASURED speed between the wire's snaps — the
 * body walks when the walker actually walks, and stands when they stand.
 *
 * THE STALE + RANGE LAWS (bodies.ts verbatim): a body whose snaps died
 * is hidden, a body out of render range is culled — the street can hold
 * many walkers, the frame budget holds few.
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { MidRig, type RigColors } from './HumanRig'
import { heightAt } from '@/game/world3d/layout'
import { playerPos, requestE2eTeleport } from './controls'
import { inRenderRange } from '@/game/systems/bodies'
import {
  remoteStartSending,
  remoteStopSending,
  remoteBody,
  remoteBodyList,
  bodiesWitness,
  setPosReader,
  setJoinExecutor,
  useBodiesStore,
} from '@/game/systems/remotenet'
import { DEFAULT_AVATAR } from '@/game/data/avatar'

/* ------------------------------ rig colour mapping ---------------------------- */

const VOLUME_HAIR = new Set(['afro', 'puffs', 'dreads', 'braids'])
const CAP_HAIR = new Set(['low-cut', 'waves', 'cornrows'])
const DRESS_STYLES = new Set(['kaftan', 'lace'])

/** a remote walker's rig colours from their REAL look (same mapping the
 *  local player's body rides — one nation, one wardrobe law) */
export function remoteRigColors(look: {
  skinTone: string
  hairColor: string
  hairstyle: string
  clothingStyle: string
  clothingColor: string
} | null): RigColors {
  const l = look ?? DEFAULT_AVATAR
  return {
    skin: l.skinTone,
    cloth: l.clothingColor,
    clothAlt: l.clothingColor,
    hair: l.hairColor,
    hairStyle: VOLUME_HAIR.has(l.hairstyle) ? 'volume' : CAP_HAIR.has(l.hairstyle) ? 'cap' : 'none',
    dress: DRESS_STYLES.has(l.clothingStyle),
    hairstyle: l.hairstyle,
    style: l.clothingStyle,
  }
}

/* --------------------------------- the name tag -------------------------------- */

const tagCache = new Map<string, THREE.CanvasTexture>()

function nameTagTexture(name: string): THREE.CanvasTexture {
  const cached = tagCache.get(name)
  if (cached) return cached
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 256, 64)
  ctx.fillStyle = 'rgba(12,14,10,0.72)'
  const w = Math.min(246, 28 + name.length * 13)
  ctx.beginPath()
  ctx.roundRect((256 - w) / 2, 10, w, 44, 22)
  ctx.fill()
  ctx.fillStyle = '#f5edd8'
  ctx.font = 'extrabold 26px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, 128, 33)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tagCache.set(name, tex)
  return tex
}

function NameTag({ name }: { name: string }) {
  const tex = useMemo(() => nameTagTexture(name), [name])
  return (
    <sprite position={[0, 2.35, 0]} scale={[1.5, 0.375, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} fog={false} />
    </sprite>
  )
}

/* -------------------------------- one remote body ------------------------------- */

function RemoteBodyView({ handle }: { handle: string }) {
  const group = useRef<THREE.Group>(null)
  const speedRef = useRef(0)
  const body = remoteBody(handle)
  const colors = useMemo(() => remoteRigColors(body?.look ?? null), [body?.look])

  useFrame(() => {
    const g = group.current
    if (!g) return
    const b = remoteBody(handle)
    if (!b) return
    // the snaps are wall-clock anchored (Date.now() at the wire push) — the
    // sample clock is the SAME wall clock, never the R3F scene clock
    const s = b.buf.sample(Date.now())
    // THE STALE LAW: sample() answers alive=false the moment the newest
    // snap is STALE_MS old — a dead body does not stand.
    if (!s.alive) {
      g.visible = false
      return
    }
    // THE RANGE LAW — culled from MY body, not deleted (they may walk back)
    if (!inRenderRange(playerPos.x, playerPos.z, s.x, s.z)) {
      g.visible = false
      return
    }
    g.visible = true
    g.position.set(s.x, heightAt(s.x, s.z), s.z)
    g.rotation.y = s.hd
    // THE WALK TRUTH: the measured speed drives the cycle — the body walks
    // when the walker actually walked, stands when they stood
    speedRef.current = s.speed
  })

  if (!body) return null
  return (
    <group ref={group} visible={false}>
      <MidRig colors={colors} speedRef={speedRef} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[0.5, 12]} />
        <meshBasicMaterial color="#1a2016" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      {body.name ? <NameTag name={body.name} /> : null}
    </group>
  )
}

/* ---------------------------------- the layer ---------------------------------- */

/**
 * THE LAYER — mount inside the world canvas. Brackets the sender (my body
 * speaks while I stand here), registers the teleport seam for the join law,
 * and renders one honest body per roster walker.
 */
export function RemoteWalkers() {
  const count = useBodiesStore((s) => s.count)
  const names = useBodiesStore((s) => s.names)

  useEffect(() => {
    // the local moment + the join seam — the walker's own truths, brought here
    setPosReader(() => ({ x: playerPos.x, z: playerPos.z, hd: playerPos.heading }))
    setJoinExecutor((x, z) => requestE2eTeleport(x, z))
    remoteStartSending()
    // the E2E witness reads REALITY (the net's counters + the body list)
    ;(window as unknown as Record<string, unknown>).__lklBodies = bodiesWitness
    return () => {
      remoteStopSending()
      delete (window as unknown as Record<string, unknown>).__lklBodies
    }
  }, [])

  // keyed by handle+name: a rename remounts the view (the tag texture follows
  // the truth); a roster change only mounts/unmounts the delta
  const namesKey = names.join('|')
  const handles = useMemo(
    () => remoteBodyList().map((b) => `${b.handle}\u0000${b.name}`),
    [count, namesKey],
  )

  return (
    <group>
      {handles.map((k) => (
        <RemoteBodyView key={k} handle={k.split('\u0000')[0]} />
      ))}
    </group>
  )
}
