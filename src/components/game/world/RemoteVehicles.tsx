'use client'

/**
 * LOKOJA LIFE — M24 W10-a: THE REMOTE VEHICLES
 * =============================================
 * Real players' cars as real rigs on the one living city's roads. This
 * layer is purely ADDITIVE: it mounts beside RemoteWalkers and touches
 * NOTHING that already exists (no world file edited — the 3D freeze
 * honoured; the W2 doctrine: one import + one line in the scene).
 *
 * THE FRAME LAW (zero React churn): the roster store only changes at
 * walk-in/walk-out cadence; the 12Hz truth lives in wheelnet's module
 * map and is consumed HERE inside useFrame — positions, headings and
 * the wheel spin animate with ZERO setState, ZERO allocation per frame.
 *
 * THE HONEST CAR: each rig is the SAME builder the player's own rides
 * wear (buildPlayerRig's own family), painted by THE PAINT LAW's real
 * vocabulary (an invented colour never renders — unknown falls to the
 * default). The wheels spin by the MEASURED speed between the wire's
 * snaps; a parked car (mv=false) stands with still wheels exactly where
 * it stopped — the buffer never stales a car (absence is the roster's
 * verdict: the driver left), the SEED LAW stands it before the first
 * tick ever arrives.
 *
 * THE RANGE LAW (wheels.ts verbatim): a car beyond CAR_RANGE from MY
 * body is culled — a car catches the eye farther than a walker (90 vs
 * 60) but the frame budget still holds few.
 *
 * THE DRIVER IS INSIDE: the name tag rides the car (the walker's own
 * body is hidden by RemoteWalkers' carried guard — one truth, no ghost).
 */

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { buildOkada, buildKeke, buildDanfo, buildSedan, type SedanVariant, type VehicleRig } from '@/game/world3d/vehicles'
import { heightAt } from '@/game/world3d/layout'
import { bridgeDeckY } from '@/game/world3d/collision'
import { playerPos } from './controls'
import { carInRenderRange } from '@/game/systems/wheels'
import { remoteCarList, remoteCarCount, useWheelsStore, parkedGhostByKey, wheelQueryParked } from '@/game/systems/wheelnet'
import { useWireStore } from '@/game/systems/wire'
import type { VehicleModel } from '@/game/types'

/* --------------------------- the rig builder (paint law) --------------------------- */

/** THE PAINT LAW'S RENDER SIDE — the vocabulary maps onto the builders'
 *  real arguments; anything else falls to the honest default. */
function buildPaintedRig(model: VehicleModel, paint: string): VehicleRig {
  if (model === 'okada') {
    const tone = ['0', '1', '2', '3'].includes(paint) ? Number(paint) : 2
    return buildOkada(tone)
  }
  if (model === 'keke') return buildKeke()
  if (model === 'danfo') return buildDanfo()
  const variant: SedanVariant =
    paint === 'white' || paint === 'silver' || paint === 'darkblue' || paint === 'maroon'
      ? paint
      : 'taxi' // 'yellow' and everything unknown = the honest taxi livery
  return buildSedan(variant)
}

/* ------------------------------ the plate tag ------------------------------ */

const tagCache = new Map<string, THREE.CanvasTexture>()

function plateTagTexture(name: string, plate: string): THREE.CanvasTexture {
  const key = `${name}\u0000${plate}`
  const cached = tagCache.get(key)
  if (cached) return cached
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 72
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 256, 72)
  ctx.fillStyle = 'rgba(12,14,10,0.72)'
  const w = Math.min(246, 40 + name.length * 12)
  ctx.beginPath()
  ctx.roundRect((256 - w) / 2, 6, w, 38, 19)
  ctx.fill()
  ctx.fillStyle = '#f5edd8'
  ctx.font = 'extrabold 24px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, 128, 26)
  // the plate — the car's own face, small and honest
  ctx.fillStyle = '#e8e4d8'
  ctx.beginPath()
  ctx.roundRect(78, 48, 100, 20, 5)
  ctx.fill()
  ctx.fillStyle = '#1a2016'
  ctx.font = 'bold 15px ui-monospace, monospace'
  ctx.fillText(plate.slice(0, 10), 128, 59)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tagCache.set(key, tex)
  return tex
}

function PlateTag({ name, plate }: { name: string; plate: string }) {
  const tex = useMemo(() => plateTagTexture(name, plate), [name, plate])
  return (
    <sprite position={[0, 2.5, 0]} scale={[1.7, 0.48, 1]}>
      <spriteMaterial map={tex} transparent depthWrite={false} fog={false} />
    </sprite>
  )
}

/* --------------------------- the rig cache (the DriveSystem doctrine) --------------------------- */

/** ONE base rig per (model, paint), OUTSIDE React entirely — built once,
 *  geometry/material caches shared (vehicles.ts matCache/geoCache), and
 *  NEVER mounted directly: two same-model cars mounting one THREE.Group
 *  fought over the same transforms (one car vanished, wheels fought).
 *  rigFor clones the base per VIEWER key — Object3D.clone shares every
 *  geometry and material reference, so the GPU cost of a clone is zero. */
const RIGS = new Map<string, VehicleRig>()
const RIG_CLONES = new Map<string, VehicleRig>()

/** the viewer keys rigFor touched since the last prune — the layer evicts
 *  clones whose car left the roster/parked set, so the cache stays bounded */
const RIG_CLONE_USES = new Set<string>()

/** clone a rig for ONE viewer. Object3D.clone(true) shares all geometry +
 *  material references; the only work is remapping wheels/steer/bank onto
 *  the CLONED nodes (traverse order is deterministic, so index-matched) —
 *  the frame loop must spin THIS mount's wheels, never the base rig's. */
function cloneRig(base: VehicleRig): VehicleRig {
  const group = base.group.clone(true)
  const originals: THREE.Object3D[] = []
  base.group.traverse((o) => originals.push(o))
  const clones: THREE.Object3D[] = []
  group.traverse((o) => clones.push(o))
  const map = new Map<THREE.Object3D, THREE.Object3D>()
  originals.forEach((o, i) => map.set(o, clones[i]))
  return {
    group,
    bank: (map.get(base.bank) as THREE.Group | undefined) ?? group,
    wheels: base.wheels
      .map((w) => map.get(w))
      .filter((w): w is THREE.Object3D => !!w),
    frontWheels: base.frontWheels
      .map((w) => map.get(w))
      .filter((w): w is THREE.Object3D => !!w),
    steer: base.steer ? ((map.get(base.steer) as THREE.Group | undefined) ?? null) : null,
  }
}

function rigFor(model: VehicleModel, paint: string, viewer: string): VehicleRig {
  const k = `${model}:${paint}`
  let base = RIGS.get(k)
  if (!base) {
    base = buildPaintedRig(model, paint)
    RIGS.set(k, base)
  }
  const ck = `${k}\u0000${viewer}`
  RIG_CLONE_USES.add(ck)
  let r = RIG_CLONES.get(ck)
  if (!r) {
    r = cloneRig(base)
    RIG_CLONES.set(ck, r)
  }
  return r
}

/* -------------------------------- one remote car -------------------------------- */

function RemoteCarView({ handle }: { handle: string }) {
  const group = useRef<THREE.Group>(null)
  const lastPos = useRef<{ x: number; z: number } | null>(null)
  const lastHd = useRef(0)
  const car = remoteCarList().find((c) => c.handle === handle)
  // the meta is a plain per-render object (the compiler memoizes; no manual deps to lie)
  const meta = car ? { model: car.model, paint: car.paint, plate: car.plate, name: car.name } : null
  // the render reads the MODULE cache — one CLONE per (model, paint, viewer):
  // this handle's own rig, never another car's THREE.Group
  const rig = meta ? rigFor(meta.model, meta.paint, handle) : null

  useFrame(() => {
    const g = group.current
    if (!g) return
    // THE FRAME LAW: the module map is re-read HERE (the RemoteWalkers
    // pattern) — the rig comes from the module cache, never a render local
    const c = remoteCarList().find((x) => x.handle === handle)
    if (!c) return
    const r = rigFor(c.model, c.paint, handle)
    const s = c.buf.sample(Date.now())
    if (!s.alive) {
      g.visible = false
      return
    }
    // THE RANGE LAW — culled from MY body, not deleted (they may drive back)
    if (!carInRenderRange(playerPos.x, playerPos.z, s.x, s.z)) {
      g.visible = false
      return
    }
    g.visible = true
    // THE GROUND LAW: the bridge deck first, the earth second — the same
    // priority the player's own ride rides
    g.position.set(s.x, bridgeDeckY(s.x, s.z) ?? heightAt(s.x, s.z), s.z)
    g.rotation.y = s.hd
    // THE WHEEL TRUTH: the measured speed drives the spin — the wheels
    // turn when the car actually moved, stand still when it is parked
    if (lastPos.current) {
      const d = Math.hypot(s.x - lastPos.current.x, s.z - lastPos.current.z)
      if (d > 0.0005) {
        const radius = WHEEL_R[c.model] ?? 0.34
        const spin = radius > 0 ? d / radius : 0
        for (const w of r.wheels) w.rotation.x += spin
        if (r.steer && d > 0.02) r.steer.rotation.y = Math.max(-0.5, Math.min(0.5, (s.hd - lastHd.current) * 8))
      }
    }
    lastHd.current = s.hd
    lastPos.current = { x: s.x, z: s.z }
  })

  if (!car || !meta || !rig) return null
  return (
    <group ref={group} visible={false}>
      {/* the clone is owned by THIS mount — dispose={null} keeps R3F's
          unmount teardown from ever touching the shared geometry/materials */}
      <primitive object={rig.group} dispose={null} />
      <PlateTag name={meta.name} plate={meta.plate} />
    </group>
  )
}

const WHEEL_R: Record<VehicleModel, number> = { okada: 0.33, keke: 0.34, taxi: 0.34, danfo: 0.38 }

/* ------------------------- W10-b — one parked ghost ------------------------- */

/**
 * THE PARKED GHOST VIEW — an ABSENT driver's disk row, spawned where the
 * car was left: the same rig, the same plate tag, NO buffer (nothing
 * moves), the same range law. A live roster row for the same (handle,
 * model) erases the ghost client-side (the LIVE-WINS law in wheelnet) —
 * here the ghost simply disappears with the key.
 */
function ParkedGhostView({ gkey }: { gkey: string }) {
  const group = useRef<THREE.Group>(null)
  const [, handle, model, plate, paint] = gkey.split('\u0000')
  const rig = rigFor(model as VehicleModel, paint, gkey)

  useFrame(() => {
    const g = group.current
    if (!g) return
    const gh = parkedGhostByKey(gkey)
    if (!gh) {
      g.visible = false
      return
    }
    if (!carInRenderRange(playerPos.x, playerPos.z, gh.x, gh.z)) {
      g.visible = false
      return
    }
    g.visible = true
    g.position.set(gh.x, bridgeDeckY(gh.x, gh.z) ?? heightAt(gh.x, gh.z), gh.z)
    g.rotation.y = gh.hd
  })

  if (!rig) return null
  return (
    <group ref={group} visible={false}>
      {/* per-ghost clone, same law as the live view above */}
      <primitive object={rig.group} dispose={null} />
      <PlateTag name={handle} plate={plate} />
    </group>
  )
}

/* ---------------------------------- the layer ---------------------------------- */

/**
 * THE LAYER — mount inside the world canvas beside RemoteWalkers. Renders
 * one honest rig per roster car + one parked ghost per disk row; the
 * roster cadence mounts/unmounts the delta only.
 */
export function RemoteVehicles() {
  const count = useWheelsStore((s) => s.count)
  const plates = useWheelsStore((s) => s.plates)
  const parkedKeys = useWheelsStore((s) => s.parkedKeys)

  useEffect(() => {
    // W10-b — THE PARKED SPAWN: one honest query per world mount, landed
    // when BOTH truths exist — a LIVE wire AND a real body pos (a query
    // fired at (0,0) or before the handshake is a wasted beat). The
    // wire:parked broadcast lane keeps the map warm after this first ask.
    let alive = true
    void (async () => {
      for (let i = 0; i < 40 && alive; i++) {
        const p = playerPos
        if (useWireStore.getState().state === 'live' && (p.x !== 0 || p.z !== 0)) {
          await wheelQueryParked(p.x, p.z)
          return
        }
        await new Promise((r) => setTimeout(r, 1500))
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const platesKey = plates.join('|')
  const handles = useMemo(
    () => remoteCarList().map((c) => `${c.handle}\u0000${c.plate}\u0000${c.paint}\u0000${c.model}`),
    [count, platesKey],
  )

  // THE CLONE PRUNE — every mount registers its clone key through rigFor
  // (render + every frame), so after each roster/parked change anything NOT
  // re-registered belongs to an unmounted viewer: evict it. The clone cache
  // stays bounded by the live roster exactly like the old RIGS map was.
  useEffect(() => {
    for (const k of [...RIG_CLONES.keys()]) {
      if (!RIG_CLONE_USES.has(k)) RIG_CLONES.delete(k)
    }
    RIG_CLONE_USES.clear()
  }, [count, platesKey, parkedKeys])

  return (
    <group>
      {handles.map((k) => (
        <RemoteCarView key={k} handle={k.split('\u0000')[0]} />
      ))}
      {parkedKeys.map((k) => (
        <ParkedGhostView key={k} gkey={k} />
      ))}
    </group>
  )
}

export { remoteCarCount }
