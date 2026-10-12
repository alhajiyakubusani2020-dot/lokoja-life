/**
 * LOKOJA LIFE — Vehicle Shop (Stage 4)
 * ------------------------------------
 * Shared low-poly builders for the town's street fleet: keke napep,
 * okada, danfo, taxi + private sedans — plus the deterministic
 * parked-car placement data and the night-light switch.
 *
 * Design rules:
 *  - every family caches its geometries/materials at module level, so
 *    13 moving rigs + the parked cars all reuse the same buffers
 *  - rig origin = ground contact, vehicle faces +Z, three.js units
 *  - Actors.Traffic owns the frame loop: it positions rig.group,
 *    banks rig.bank, spins rig.wheels and steers rig.steer — nothing
 *    in this file allocates or animates per frame
 *  - night lights flip through ONE registry (applyVehicleNight); the
 *    Traffic component calls it when the world clock crosses dusk
 *  - parked placement is seeded (makeRng) and validates clearance
 *    against buildings, stalls, anchor plazas, rivers and bridges
 *  - deterministic everywhere: no Math.random in this module
 */

import * as THREE from 'three'
import {
  ANCHOR_BY_ID, ANCHORS, BRIDGES, BUILDINGS, DOORS, LAMPS, POINTS_OF_INTEREST, ROADS, STALLS, WALK_BOUND,
  heightAt, makeRng, riverInfo,
} from './layout'
import type { VehicleModel } from '../types'

/* ------------------------------ vehicle types ------------------------------- */

export type SedanVariant = 'taxi' | 'white' | 'silver' | 'darkblue' | 'maroon'

export interface VehicleRig {
  /** root — Traffic sets world position + rotation.y (heading) */
  group: THREE.Group
  /** child of group — roll/lean is applied here so wheels bank with the body */
  bank: THREE.Group
  /** spin these around local x by (distance / wheel radius) */
  wheels: THREE.Object3D[]
  /** front-wheel/fork yaw hint (keke + okada), null on four-wheelers */
  steer: THREE.Group | null
}

export interface ParkedVehicleDef {
  x: number
  z: number
  y: number
  rotY: number
  build: 'keke' | 'sedan'
  variant: SedanVariant
}

/* --------------------------- geometry/material caches ------------------------ */

const matCache = new Map<string, THREE.MeshStandardMaterial>()

function mat(color: string, roughness = 0.6, metalness = 0.12): THREE.MeshStandardMaterial {
  const key = `${color}|${roughness}|${metalness}`
  let m = matCache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    matCache.set(key, m)
  }
  return m
}

const geoCache = new Map<string, THREE.BufferGeometry>()

function geo(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let g = geoCache.get(key)
  if (!g) {
    g = make()
    geoCache.set(key, g)
  }
  return g
}

/** tiny helper — cached box geometry by dimensions */
function bx(key: string, w: number, h: number, d: number): THREE.BufferGeometry {
  return geo(`box|${key}`, () => new THREE.BoxGeometry(w, h, d))
}

/* --------------------------------- night lights ------------------------------ */

interface NightEntry {
  m: THREE.MeshStandardMaterial
  day: number
  night: number
}

const nightRegistry: NightEntry[] = []
let nightOn = false

/** shared emissive material, registered for the day/night flip */
function emis(key: string, color: string, emissive: string, day: number, night: number): THREE.MeshStandardMaterial {
  let m = matCache.get(key)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: day, roughness: 0.35, metalness: 0.2 })
    matCache.set(key, m)
    nightRegistry.push({ m, day, night })
    if (nightOn) m.emissiveIntensity = night
  }
  return m
}

/** ONE call per dusk/dawn flips every headlight, taillight and sign in town */
export function applyVehicleNight(on: boolean): void {
  nightOn = on
  for (const n of nightRegistry) n.m.emissiveIntensity = on ? n.night : n.day
}

/* ---------------------------------- palettes --------------------------------- */

const TIRE = mat('#151515', 1, 0)
const RIM = mat('#c9c7bb', 0.4, 0.65)
const CHROME = mat('#b8bcbf', 0.25, 0.85)
const FRAME = mat('#3d4043', 0.6, 0.5)
const DARK_TRIM = mat('#26261f', 0.8, 0.1)
const GLASS_DARK = mat('#1f2830', 0.18, 0.5)
const GLASS_CLEAR = new THREE.MeshStandardMaterial({
  color: '#28343c', roughness: 0.12, metalness: 0.55, transparent: true, opacity: 0.55,
})
const KEKE_YELLOW = mat('#e9c53a', 0.5, 0.15)
const KEKE_GREEN = mat('#1c6b3a', 0.55, 0.1)
const CANOPY = mat('#20241e', 0.85, 0.05)
const DANFO_YELLOW = mat('#e5b41f', 0.5, 0.12)
const DANFO_ROOF = mat('#efe8d4', 0.8, 0)
const BLACK_STRIP = mat('#1b1b18', 0.7, 0.1)
const BUMPER = mat('#c2c2ba', 0.45, 0.55)
const SEAT = mat('#31302c', 0.95, 0)
const SKIN_DARK = mat('#5C3A21', 0.9, 0)
const PARK_HEAD = mat('#d8d2c0', 0.4, 0.5)
const PARK_TAIL = mat('#6e1f18', 0.5, 0.2)

const SEDAN_COLORS: Record<Exclude<SedanVariant, 'taxi'>, string> = {
  white: '#e8e6de',
  silver: '#b9bec4',
  darkblue: '#2c3f63',
  maroon: '#6e2a26',
}

const OKADA_TONES = ['#b33a2b', '#2b62b3', '#2e7d5b', '#3d4043']
const OKADA_SHIRTS = ['#c94f2e', '#2e7d5b', '#d99a2b', '#3a6ea3', '#e8dcc3']
const OKADA_HELMETS = ['#d9482b', '#f0c020', '#2a2a2a']

/* ------------------------------- canvas textures ----------------------------- */

let sideTex: THREE.CanvasTexture | null = null

/** danfo side livery — original fleet name, black on transparent */
function danfoSideTexture(): THREE.CanvasTexture {
  if (sideTex) return sideTex
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 96
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, 512, 96)
  ctx.fillStyle = '#191713'
  ctx.font = 'bold 58px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('LOKOJA TRANSIT', 256, 40)
  ctx.fillRect(66, 74, 380, 7)
  sideTex = new THREE.CanvasTexture(c)
  sideTex.colorSpace = THREE.SRGBColorSpace
  return sideTex
}

let routeTex: THREE.CanvasTexture | null = null

/** danfo route board — the classic "where this bus is going" sign */
function routeBoardTexture(): THREE.CanvasTexture {
  if (routeTex) return routeTex
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#f2efe2'
  ctx.fillRect(0, 0, 256, 64)
  ctx.strokeStyle = '#1b1b18'
  ctx.lineWidth = 6
  ctx.strokeRect(3, 3, 250, 58)
  ctx.fillStyle = '#1b1b18'
  ctx.font = 'bold 34px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('TOWN — FELELE', 128, 34)
  routeTex = new THREE.CanvasTexture(c)
  routeTex.colorSpace = THREE.SRGBColorSpace
  return routeTex
}

let taxiTex: THREE.CanvasTexture | null = null

/** taxi roof sign — amber board, black TAXI */
function taxiSignTexture(): THREE.CanvasTexture {
  if (taxiTex) return taxiTex
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 56
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#f0c020'
  ctx.fillRect(0, 0, 128, 56)
  ctx.fillStyle = '#151310'
  ctx.font = 'bold 40px Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('TAXI', 64, 30)
  taxiTex = new THREE.CanvasTexture(c)
  taxiTex.colorSpace = THREE.SRGBColorSpace
  return taxiTex
}

let coneTex: THREE.CanvasTexture | null = null

/** warm light pool that fades forward — one texture, four shared cones */
function headlightConeTexture(): THREE.CanvasTexture {
  if (coneTex) return coneTex
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 22, 6, 64, 60, 118)
  g.addColorStop(0, 'rgba(255,242,200,0.55)')
  g.addColorStop(0.45, 'rgba(255,236,180,0.22)')
  g.addColorStop(1, 'rgba(255,232,170,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  coneTex = new THREE.CanvasTexture(c)
  coneTex.colorSpace = THREE.SRGBColorSpace
  return coneTex
}

let coneMat: THREE.MeshBasicMaterial | null = null

/** shared additive material for the fake headlight pools (night only) */
export function headlightConeMaterial(): THREE.MeshBasicMaterial {
  if (!coneMat) {
    coneMat = new THREE.MeshBasicMaterial({
      map: headlightConeTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    })
  }
  return coneMat
}

/* --------------------------------- light discs -------------------------------- */

function headDisc(r: number, parked: boolean): THREE.Mesh {
  const g = geo(`headDisc|${r}`, () => new THREE.CircleGeometry(r, 10))
  const m = parked
    ? PARK_HEAD
    : emis('head', '#fff3cf', '#ffe9a8', 0.45, 3.2)
  return new THREE.Mesh(g, m)
}

function tailDisc(r: number, parked: boolean): THREE.Mesh {
  const g = geo(`tailDisc|${r}`, () => new THREE.CircleGeometry(r, 8))
  const m = parked ? PARK_TAIL : emis('tail', '#ff5340', '#ff2a1a', 0.35, 2.6)
  return new THREE.Mesh(g, m)
}

/* ----------------------------------- wheels ----------------------------------- */

/**
 * One wheel = tire torus + rim + hubcap (+ spokes). The returned group
 * sits with its origin at the axle; Traffic spins group.rotation.x.
 */
function buildWheel(r: number, halfW: number, spokes = 0): THREE.Group {
  const g = new THREE.Group()
  const tube = Math.max(0.05, r * 0.24)
  const tire = new THREE.Mesh(
    geo(`tire|${r.toFixed(2)}`, () => new THREE.TorusGeometry(r - tube, tube, 8, 16)),
    TIRE,
  )
  tire.rotation.y = Math.PI / 2
  tire.castShadow = true
  g.add(tire)
  const rim = new THREE.Mesh(
    geo(`rim|${r.toFixed(2)}|${halfW.toFixed(2)}`, () => new THREE.CylinderGeometry(r * 0.5, r * 0.5, halfW * 0.7, 10)),
    RIM,
  )
  rim.rotation.z = Math.PI / 2
  g.add(rim)
  const cap = new THREE.Mesh(
    geo('hubcap', () => new THREE.CylinderGeometry(r * 0.16, r * 0.16, halfW * 0.92, 8)),
    CHROME,
  )
  cap.rotation.z = Math.PI / 2
  g.add(cap)
  if (spokes > 0) {
    const len = (r - tube) * 1.8
    const spGeo = geo(`spoke|${len.toFixed(2)}`, () => new THREE.BoxGeometry(0.028, len, 0.045))
    for (let i = 0; i < spokes; i++) {
      const sp = new THREE.Mesh(spGeo, RIM)
      sp.rotation.x = (i / spokes) * Math.PI
      g.add(sp)
    }
  }
  return g
}

/* -------------------------------- rig scaffolding ------------------------------ */

function makeRig(): { rig: VehicleRig; bank: THREE.Group } {
  const group = new THREE.Group()
  const bank = new THREE.Group()
  group.add(bank)
  return { rig: { group, bank, wheels: [], steer: null }, bank }
}

/** add a mesh to the bank group at a position (optional shadow casting) */
function put(bank: THREE.Group, m: THREE.Mesh, x: number, y: number, z: number, shadow = false): THREE.Mesh {
  m.position.set(x, y, z)
  if (shadow) m.castShadow = true
  bank.add(m)
  return m
}

/* ---------------------------------- KEKE NAPEP --------------------------------- */

/**
 * Auto-rickshaw: rounded yellow cowl, green livery stripe, black canopy
 * dome, windscreen, handlebar + driver hint, one front / two rear wheels.
 */
export function buildKeke(parked = false): VehicleRig {
  const { rig, bank } = makeRig()

  // floor pan + nose
  put(bank, new THREE.Mesh(bx('kekeFloor', 1.05, 0.1, 1.9), DARK_TRIM), 0, 0.4, -0.05)
  const nose = new THREE.Mesh(geo('kekeNose', () => new THREE.SphereGeometry(0.52, 14, 10)), KEKE_YELLOW)
  nose.scale.set(0.95, 0.82, 1.0)
  put(bank, nose, 0, 0.84, 1.0, true)
  put(bank, new THREE.Mesh(bx('kekeFork', 0.2, 0.55, 0.34), KEKE_YELLOW), 0, 0.62, 1.18)

  // tub + cabin + livery
  put(bank, new THREE.Mesh(bx('kekeTub', 1.28, 0.62, 1.5), KEKE_YELLOW), 0, 0.78, -0.35, true)
  put(bank, new THREE.Mesh(bx('kekeStripe', 1.32, 0.14, 1.2), KEKE_GREEN), 0, 0.6, -0.3)
  put(bank, new THREE.Mesh(bx('kekeCab', 1.28, 0.58, 1.5), KEKE_YELLOW), 0, 1.34, -0.35, true)
  put(bank, new THREE.Mesh(bx('kekeGlass', 1.32, 0.34, 1.26), GLASS_DARK), 0, 1.38, -0.38)

  // windscreen between nose and canopy
  const ws = new THREE.Mesh(geo('kekeWs', () => new THREE.PlaneGeometry(0.8, 0.52)), GLASS_CLEAR)
  ws.rotation.x = -0.35
  put(bank, ws, 0, 1.28, 0.66)

  // black canopy dome
  const dome = new THREE.Mesh(
    geo('kekeDome', () => new THREE.SphereGeometry(0.8, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2)),
    CANOPY,
  )
  dome.scale.set(0.85, 0.42, 1.05)
  put(bank, dome, 0, 1.6, -0.3, true)

  // handlebar + driver + passenger bench
  const bar = new THREE.Mesh(geo('kekeBar', () => new THREE.CylinderGeometry(0.02, 0.02, 0.56, 6)), FRAME)
  bar.rotation.z = Math.PI / 2
  put(bank, bar, 0, 1.12, 0.8)
  put(bank, new THREE.Mesh(geo('kekeSeat', () => new THREE.BoxGeometry(0.4, 0.1, 0.42)), SEAT), 0, 0.92, 0.24)
  const torso = new THREE.Mesh(geo('kekeDriver', () => new THREE.CapsuleGeometry(0.13, 0.3, 3, 8)), mat('#2e7d5b', 0.9, 0))
  put(bank, torso, 0, 1.14, 0.3)
  put(bank, new THREE.Mesh(geo('kekeHead', () => new THREE.SphereGeometry(0.11, 8, 8)), SKIN_DARK), 0, 1.4, 0.26)
  put(bank, new THREE.Mesh(bx('kekeBench', 0.9, 0.12, 0.36), mat('#5a2a22', 0.9, 0)), 0, 0.98, -0.72)

  // exhaust hint
  const pipe = new THREE.Mesh(geo('kekePipe', () => new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8)), CHROME)
  pipe.rotation.x = Math.PI / 2
  put(bank, pipe, 0.38, 0.44, -0.55)

  // lights — headlight on the nose, taillights on the tub
  put(bank, headDisc(0.1, parked), 0, 0.98, 1.53)
  for (const sx of [-1, 1]) {
    const tl = tailDisc(0.06, parked)
    tl.rotation.y = Math.PI
    put(bank, tl, sx * 0.48, 0.95, -1.11)
  }

  // wheels: one steerable front + two rear
  const steer = new THREE.Group()
  steer.position.set(0, 0.32, 1.18)
  bank.add(steer)
  const fw = buildWheel(0.32, 0.12)
  steer.add(fw)
  rig.steer = steer
  rig.wheels.push(fw)
  for (const sx of [-1, 1]) {
    const rw = buildWheel(0.36, 0.14)
    rw.position.set(sx * 0.56, 0.36, -0.78)
    bank.add(rw)
    rig.wheels.push(rw)
  }
  return rig
}

/* ------------------------------------ OKADA ------------------------------------ */

/**
 * Motorcycle taxi: angled frame, spoked wheels, leaning rider with a
 * helmet, headlight + taillight. The whole rig banks into curves (the
 * Traffic loop rotates rig.bank) — that lean is the okada's charm.
 */
export function buildOkada(toneIdx = 0, parked = false): VehicleRig {
  const { rig, bank } = makeRig()
  const bike = mat(OKADA_TONES[toneIdx % OKADA_TONES.length], 0.45, 0.35)
  const shirt = mat(OKADA_SHIRTS[(toneIdx + 2) % OKADA_SHIRTS.length], 0.9, 0)
  const helmet = mat(OKADA_HELMETS[toneIdx % OKADA_HELMETS.length], 0.35, 0.2)

  // frame spar + tank + seat + rack
  const spar = new THREE.Mesh(bx('okSpar', 0.1, 0.12, 1.3), FRAME)
  spar.rotation.x = 0.16
  put(bank, spar, 0, 0.6, 0.05)
  put(bank, new THREE.Mesh(bx('okTank', 0.3, 0.22, 0.5), bike), 0, 0.95, 0.28, true)
  put(bank, new THREE.Mesh(bx('okSeat', 0.28, 0.1, 0.56), SEAT), 0, 0.92, -0.32)
  put(bank, new THREE.Mesh(bx('okRack', 0.24, 0.05, 0.3), FRAME), 0, 1.0, -0.62)
  const exh = new THREE.Mesh(geo('okExh', () => new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8)), CHROME)
  exh.rotation.x = Math.PI / 2
  put(bank, exh, 0.17, 0.42, -0.4)

  // rider — legs, leaning torso, arms to the bars, helmeted head
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(bx('okLeg', 0.09, 0.42, 0.11), mat('#3a4a5c', 0.9, 0))
    leg.rotation.x = 0.3
    put(bank, leg, sx * 0.13, 0.68, -0.1)
  }
  const rider = new THREE.Mesh(geo('okRider', () => new THREE.CapsuleGeometry(0.14, 0.32, 3, 8)), shirt)
  rider.rotation.x = 0.5
  put(bank, rider, 0, 1.16, 0.05, true)
  for (const sx of [-1, 1]) {
    const arm = new THREE.Mesh(bx('okArm', 0.07, 0.07, 0.42), shirt)
    arm.rotation.x = 0.85
    put(bank, arm, sx * 0.14, 1.08, 0.34)
  }
  put(bank, new THREE.Mesh(geo('okHead', () => new THREE.SphereGeometry(0.11, 8, 8)), SKIN_DARK), 0, 1.4, 0.26)
  const helm = new THREE.Mesh(geo('okHelm', () => new THREE.SphereGeometry(0.135, 10, 8)), helmet)
  helm.scale.set(1, 0.92, 1.08)
  put(bank, helm, 0, 1.44, 0.24)

  // taillight on the rack
  const tl = tailDisc(0.05, parked)
  tl.rotation.y = Math.PI
  put(bank, tl, 0, 0.94, -0.79)

  // wheels — spoked; front fork + bars + headlight live in the steer group
  const rw = buildWheel(0.33, 0.13, 4)
  rw.position.set(0, 0.33, -0.68)
  bank.add(rw)
  rig.wheels.push(rw)

  const steer = new THREE.Group()
  steer.position.set(0, 0.33, 0.82)
  bank.add(steer)
  const fw = buildWheel(0.33, 0.11, 4)
  steer.add(fw)
  for (const sx of [-1, 1]) {
    const fork = new THREE.Mesh(geo('okFork', () => new THREE.CylinderGeometry(0.025, 0.025, 0.55, 6)), FRAME)
    fork.rotation.x = -0.4
    fork.position.set(sx * 0.07, 0.3, -0.18)
    steer.add(fork)
  }
  const bars = new THREE.Mesh(geo('okBars', () => new THREE.CylinderGeometry(0.02, 0.02, 0.52, 6)), FRAME)
  bars.rotation.z = Math.PI / 2
  bars.position.set(0, 0.67, -0.22)
  steer.add(bars)
  const hl = headDisc(0.09, parked)
  hl.position.set(0, 0.58, -0.1)
  steer.add(hl)
  rig.steer = steer
  rig.wheels.push(fw)
  return rig
}

/* ------------------------------------ DANFO ------------------------------------ */

/**
 * Yellow minibus: window band with body-colour pillars, black horizontal
 * stripe, baked side text ("LOKOJA TRANSIT") + route board, grille,
 * bumpers, mirrors, roof rack, ladder hint, hubbed wheels.
 */
export function buildDanfo(parked = false): VehicleRig {
  const { rig, bank } = makeRig()

  // body + off-white roof cap
  put(bank, new THREE.Mesh(bx('danfoBody', 1.9, 1.3, 4.2), DANFO_YELLOW), 0, 0.98, 0, true)
  put(bank, new THREE.Mesh(bx('danfoRoof', 1.94, 0.1, 4.24), DANFO_ROOF), 0, 1.66, 0, true)

  // black horizontal stripe (sides + front)
  put(bank, new THREE.Mesh(bx('danfoStripe', 1.94, 0.14, 4.0), BLACK_STRIP), 0, 0.6, 0)
  put(bank, new THREE.Mesh(bx('danfoStripeF', 1.92, 0.14, 0.06), BLACK_STRIP), 0, 0.6, 2.11)

  // glazing — windscreen (clear), side windows + rear (dark), pillars stay yellow
  const wsGeo = geo('danfoWs', () => new THREE.PlaneGeometry(1.66, 0.5))
  const ws = new THREE.Mesh(wsGeo, GLASS_CLEAR)
  ws.rotation.x = -0.06
  put(bank, ws, 0, 1.38, 2.105)
  for (const sx of [-1, 1]) {
    for (const [z, w] of [[0.95, 1.0], [-0.5, 1.0], [-1.62, 0.5]] as const) {
      put(bank, new THREE.Mesh(bx(`danfoWin${z}`, 0.05, 0.44, w), GLASS_DARK), sx * 0.955, 1.36, z)
    }
  }
  put(bank, new THREE.Mesh(bx('danfoWinR', 1.4, 0.4, 0.05), GLASS_DARK), 0, 1.4, -2.115)

  // baked side text, both flanks, readable each way
  const sideMat = new THREE.MeshStandardMaterial({
    map: danfoSideTexture(), transparent: true, roughness: 0.55, metalness: 0.1,
  })
  for (const sx of [-1, 1]) {
    const txt = new THREE.Mesh(geo('danfoTxt', () => new THREE.PlaneGeometry(2.0, 0.38)), sideMat)
    txt.rotation.y = sx * Math.PI / 2
    put(bank, txt, sx * 0.965, 0.92, 0.15)
  }

  // route board above the windscreen
  const board = new THREE.Mesh(
    geo('danfoBoard', () => new THREE.PlaneGeometry(0.95, 0.24)),
    new THREE.MeshStandardMaterial({ map: routeBoardTexture(), roughness: 0.6 }),
  )
  board.rotation.x = -0.12
  put(bank, board, 0, 1.7, 2.09)

  // grille + bumpers + mirrors
  put(bank, new THREE.Mesh(bx('danfoGrille', 1.2, 0.3, 0.08), DARK_TRIM), 0, 0.78, 2.13)
  put(bank, new THREE.Mesh(bx('danfoBumpF', 1.94, 0.18, 0.3), BUMPER), 0, 0.5, 2.2, true)
  put(bank, new THREE.Mesh(bx('danfoBumpR', 1.94, 0.18, 0.3), BUMPER), 0, 0.5, -2.2, true)
  for (const sx of [-1, 1]) {
    put(bank, new THREE.Mesh(bx('danfoMirA', 0.24, 0.04, 0.04), DARK_TRIM), sx * 1.07, 1.44, 1.95)
    put(bank, new THREE.Mesh(bx('danfoMirH', 0.06, 0.22, 0.14), DARK_TRIM), sx * 1.2, 1.44, 1.95)
  }

  // driver silhouette behind the windscreen
  const drv = new THREE.Mesh(geo('danfoDrv', () => new THREE.CapsuleGeometry(0.13, 0.26, 3, 8)), mat('#23423a', 0.9, 0))
  put(bank, drv, -0.5, 1.16, 1.62)
  put(bank, new THREE.Mesh(geo('danfoDrvH', () => new THREE.SphereGeometry(0.1, 8, 8)), SKIN_DARK), -0.5, 1.42, 1.58)

  // roof rack: two rails + three crossbars
  for (const sx of [-1, 1]) put(bank, new THREE.Mesh(bx('danfoRail', 0.05, 0.07, 3.3), FRAME), sx * 0.6, 1.78, -0.05)
  for (const z of [-1.3, 0, 1.3]) put(bank, new THREE.Mesh(bx('danfoCross', 1.5, 0.05, 0.06), FRAME), 0, 1.8, z)

  // rear ladder hint
  for (const sx of [-1, 1]) put(bank, new THREE.Mesh(bx('danfoLadV', 0.05, 1.1, 0.05), FRAME), sx * 0.3, 1.15, -2.17)
  for (const y of [0.75, 1.15, 1.55]) put(bank, new THREE.Mesh(bx('danfoLadH', 0.65, 0.04, 0.04), FRAME), 0, y, -2.17)

  // lights
  for (const sx of [-1, 1]) {
    put(bank, headDisc(0.12, parked), sx * 0.55, 1.05, 2.115)
    const tl = tailDisc(0.08, parked)
    tl.rotation.y = Math.PI
    put(bank, tl, sx * 0.78, 1.05, -2.125)
  }

  // wheels
  for (const sx of [-1, 1]) {
    for (const z of [1.35, -1.35]) {
      const w = buildWheel(0.38, 0.22)
      w.position.set(sx * 0.86, 0.38, z)
      bank.add(w)
      rig.wheels.push(w)
    }
  }
  return rig
}

/* ------------------------------- SEDAN / TAXI ---------------------------------- */

/**
 * Three-box sedan: lower body + tapered cabin + boot step, dark window
 * band, hubbed wheels, lights. `taxi` gets the green-and-yellow livery
 * and an amber roof sign; the private variants wear muted road colours.
 */
export function buildSedan(variant: SedanVariant, parked = false): VehicleRig {
  const { rig, bank } = makeRig()
  const isTaxi = variant === 'taxi'
  const body = isTaxi ? mat('#d9cf2e', 0.45, 0.2) : mat(SEDAN_COLORS[variant], 0.4, 0.25)

  // lower body + bumpers + grille
  put(bank, new THREE.Mesh(bx('sedLow', 1.72, 0.52, 3.9), body), 0, 0.56, 0, true)
  put(bank, new THREE.Mesh(bx('sedBumpF', 1.74, 0.16, 0.24), DARK_TRIM), 0, 0.42, 1.96, true)
  put(bank, new THREE.Mesh(bx('sedBumpR', 1.74, 0.16, 0.24), DARK_TRIM), 0, 0.42, -1.96, true)
  put(bank, new THREE.Mesh(bx('sedGrille', 0.9, 0.16, 0.06), DARK_TRIM), 0, 0.66, 1.955)

  // cabin + glass band (pillars show body colour above/below the band)
  put(bank, new THREE.Mesh(bx('sedCab', 1.56, 0.52, 2.0), body), 0, 1.08, -0.18, true)
  put(bank, new THREE.Mesh(bx('sedBand', 1.6, 0.3, 1.28), GLASS_DARK), 0, 1.16, -0.35)

  // tilted windscreen + rear glass
  const wsGeo = geo('sedWs', () => new THREE.PlaneGeometry(1.36, 0.44))
  const ws = new THREE.Mesh(wsGeo, isTaxi || parked ? GLASS_CLEAR : GLASS_DARK)
  ws.rotation.x = -0.5
  put(bank, ws, 0, 1.14, 0.68)
  const rwGeo = geo('sedRw', () => new THREE.PlaneGeometry(1.3, 0.4))
  const rw = new THREE.Mesh(rwGeo, GLASS_DARK)
  rw.rotation.x = 0.5
  put(bank, rw, 0, 1.16, -1.24)

  // taxi livery — green band + amber roof sign (both flanks)
  if (isTaxi) {
    put(bank, new THREE.Mesh(bx('taxiBand', 1.75, 0.12, 3.94), KEKE_GREEN), 0, 0.66, 0)
    put(bank, new THREE.Mesh(bx('taxiSign', 0.5, 0.14, 0.2), mat('#f0c020', 0.5, 0.2)), 0, 1.42, -0.1)
    const signMat = new THREE.MeshStandardMaterial({ map: taxiSignTexture(), roughness: 0.5 })
    for (const sx of [-1, 1]) {
      const p = new THREE.Mesh(geo('taxiSignP', () => new THREE.PlaneGeometry(0.44, 0.13)), signMat)
      p.rotation.y = sx * Math.PI / 2
      put(bank, p, sx * 0.256, 1.42, -0.1)
    }
  }

  // lights
  for (const sx of [-1, 1]) {
    put(bank, headDisc(0.1, parked), sx * 0.55, 0.66, 1.965)
    const tl = tailDisc(0.08, parked)
    tl.rotation.y = Math.PI
    put(bank, tl, sx * 0.55, 0.68, -1.965)
  }

  // wheels — two hubbed axles
  for (const sx of [-1, 1]) {
    for (const z of [1.28, -1.28]) {
      const w = buildWheel(0.34, 0.2)
      w.position.set(sx * 0.8, 0.34, z)
      bank.add(w)
      rig.wheels.push(w)
    }
  }
  return rig
}

/* --------------------------- player vehicle spawning --------------------------- */

/** a place the player's own ride can sit: ground position + facing */
export interface SpawnSpot {
  x: number
  z: number
  rotY: number
}

/** what the player's chosen model builds as — traffic-grade shared rigs */
export function buildPlayerRig(model: VehicleModel): VehicleRig {
  if (model === 'okada') return buildOkada(2) // the green tone — the hero ride
  if (model === 'keke') return buildKeke()
  if (model === 'danfo') return buildDanfo()
  return buildSedan('taxi')
}

function playerSpotIsClear(x: number, z: number): boolean {
  if (Math.hypot(x, z) > WALK_BOUND - 6) return false
  const river = riverInfo(x, z)
  if (river.d < river.halfWidth + 2.5) return false // never in the water
  for (const b of BUILDINGS) if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.5 + 1.6) return false
  for (const s of STALLS) if (Math.hypot(s.x - x, s.z - z) < 2.2) return false
  for (const l of LAMPS) if (Math.hypot(l.x - x, l.z - z) < 1.4) return false
  for (const p of POINTS_OF_INTEREST) if (Math.hypot(p.x - x, p.z - z) < 2.4) return false
  for (const dr of DOORS) if (Math.hypot(dr.x - x, dr.z - z) < 2.6) return false // never block a doorway
  for (const a of ANCHORS) if (Math.hypot(a.x - x, a.z - z) < 3.2) return false // keep plazas' centre open
  for (const p of PARKED_VEHICLES) if (Math.hypot(p.x - x, p.z - z) < 4.2) return false
  return true
}

/**
 * Stage 5 — a road-adjacent parking spot for the player's own ride.
 * Projects the player onto the nearest road centreline (the same graph
 * the traffic lanes keep), pushes out to a shoulder, then falls back to
 * "just beside the player" when no road is close. Clearance-checked so
 * the keke never materialises inside a wall, stall or doorway.
 */
export function findPlayerVehicleSpot(px: number, pz: number, fallbackYaw: number): SpawnSpot {
  let bx = 0
  let bz = 0
  let byaw = 0
  let bd = Infinity
  for (const road of ROADS) {
    for (let i = 0; i < road.pts.length - 1; i++) {
      const [ax, az] = road.pts[i]
      const [cx, cz] = road.pts[i + 1]
      const dx = cx - ax
      const dz = cz - az
      const len2 = dx * dx + dz * dz || 1e-6
      let t = ((px - ax) * dx + (pz - az) * dz) / len2
      t = Math.max(0, Math.min(1, t))
      const qx = ax + dx * t
      const qz = az + dz * t
      const d = Math.hypot(px - qx, pz - qz)
      if (d < bd) {
        bd = d
        bx = qx
        bz = qz
        byaw = Math.atan2(dx, dz)
      }
    }
  }
  const candidates: SpawnSpot[] = []
  if (bd < 14) {
    // both shoulders of the nearest road, facing along the traffic flow
    for (const side of [1, -1] as const) {
      const lat = 2.15 * side
      candidates.push({
        x: bx + -Math.cos(byaw) * lat,
        z: bz + Math.sin(byaw) * lat,
        rotY: byaw + (side < 0 ? Math.PI : 0),
      })
    }
  }
  // fallback: kerbside right next to whoever called it
  candidates.push({
    x: px + Math.sin(fallbackYaw) * 2.4,
    z: pz + Math.cos(fallbackYaw) * 2.4,
    rotY: fallbackYaw,
  })
  for (const c of candidates) if (playerSpotIsClear(c.x, c.z)) return c
  return candidates[candidates.length - 1]
}

/* ------------------------------ parked vehicles -------------------------------- */

/** arc position along a road polyline (t = fraction of total length) */
function roadPointAt(road: { pts: [number, number][] }, t: number): { x: number; z: number; yaw: number } {
  const roadPts = road.pts
  const n = roadPts.length - 1
  const lens: number[] = []
  let total = 0
  for (let i = 0; i < n; i++) {
    const l = Math.hypot(roadPts[i + 1][0] - roadPts[i][0], roadPts[i + 1][1] - roadPts[i][1])
    lens.push(l)
    total += l
  }
  let rem = (((t % 1) + 1) % 1) * total
  for (let i = 0; i < n; i++) {
    if (rem <= lens[i]) {
      const k = lens[i] === 0 ? 0 : rem / lens[i]
      const dx = roadPts[i + 1][0] - roadPts[i][0]
      const dz = roadPts[i + 1][1] - roadPts[i][1]
      return { x: roadPts[i][0] + dx * k, z: roadPts[i][1] + dz * k, yaw: Math.atan2(dx, dz) }
    }
    rem -= lens[i]
  }
  const last = roadPts[n]
  const prev = roadPts[n - 1]
  return { x: last[0], z: last[1], yaw: Math.atan2(last[0] - prev[0], last[1] - prev[1]) }
}

const BAY_CLEARANCE_ATTEMPTS = [0, 0.045, -0.045, 0.09, -0.09, 0.15, -0.15, 0.22, -0.22]
const BAY_LATERALS = [4.8, 5.2, 4.5, 5.5, 4.3]

/**
 * Bays along real major-road edges near the named game districts. Each
 * spec snaps to the nearest MAJOR road point by the district anchor, so
 * parked cars sit on real street shoulders (IBB Way, the market streets,
 * the motor-park road) wherever the graph actually runs.
 */
const BAY_SPECS: { anchor: string; dx: number; dz: number; side: 1 | -1; build: 'keke' | 'sedan'; variant: SedanVariant }[] = [
  { anchor: 'kpata-market', dx: -16, dz: 8, side: -1, build: 'sedan', variant: 'silver' },  // market street
  { anchor: 'ganaja-junction', dx: 8, dz: -14, side: 1, build: 'sedan', variant: 'taxi' },  // junction shoulder
  { anchor: 'home', dx: 2, dz: 18, side: 1, build: 'sedan', variant: 'white' },             // street below home
  { anchor: 'transport-area', dx: 16, dz: 4, side: 1, build: 'sedan', variant: 'darkblue' }, // motor-park road
  { anchor: 'historic-lokoja', dx: -12, dz: 6, side: -1, build: 'keke', variant: 'white' }, // Patti foot road — a resting keke
  { anchor: 'food-area', dx: 14, dz: -10, side: 1, build: 'sedan', variant: 'maroon' },     // food strip
]

/** nearest point on any MAJOR road to (px,pz) */
function nearestMajorPoint(px: number, pz: number): { x: number; z: number; yaw: number } {
  let bd = Infinity
  let bx = 0
  let bz = 0
  let byaw = 0
  for (const road of ROADS) {
    if (!road.major) continue
    for (let i = 0; i < road.pts.length - 1; i++) {
      const [ax, az] = road.pts[i]
      const [cx, cz] = road.pts[i + 1]
      const dx = cx - ax
      const dz = cz - az
      const len2 = dx * dx + dz * dz || 1e-6
      let t = ((px - ax) * dx + (pz - az) * dz) / len2
      t = Math.max(0, Math.min(1, t))
      const qx = ax + dx * t
      const qz = az + dz * t
      const d = Math.hypot(px - qx, pz - qz)
      if (d < bd) {
        bd = d
        bx = qx
        bz = qz
        byaw = Math.atan2(dx, dz)
      }
    }
  }
  return { x: bx, z: bz, yaw: byaw }
}

function bayIsClear(x: number, z: number, taken: ParkedVehicleDef[]): boolean {
  if (Math.hypot(x, z) > WALK_BOUND - 8) return false
  for (const a of ANCHORS) if (Math.hypot(a.x - x, a.z - z) < 14.5) return false       // plazas stay open
  for (const b of BUILDINGS) if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.5 + 2.2) return false
  for (const s of STALLS) if (Math.hypot(s.x - x, s.z - z) < 2.6) return false
  for (const l of LAMPS) if (Math.hypot(l.x - x, l.z - z) < 1.3) return false          // no lamp through the roof
  const river = riverInfo(x, z)
  if (river.d < river.halfWidth + 3.5) return false                                     // never in the water
  for (const br of BRIDGES) if (Math.hypot(br.x - x, br.z - z) < br.length / 2 + 3.5) return false
  for (const p of taken) if (Math.hypot(p.x - x, p.z - z) < 6.5) return false
  return true
}

/**
 * Deterministic parked fleet: walk each bay spec along its road, offset
 * laterally onto the shoulder, keep the first spot that clears every
 * obstacle. Seeded — every player sees the same parked cars.
 */
export const PARKED_VEHICLES: ParkedVehicleDef[] = (() => {
  const rng = makeRng(4711)
  const out: ParkedVehicleDef[] = []
  for (const spec of BAY_SPECS) {
    const a = ANCHOR_BY_ID[spec.anchor]
    if (!a) continue
    const ref = nearestMajorPoint(a.x + spec.dx, a.z + spec.dz)
    const dirX = Math.sin(ref.yaw)
    const dirZ = Math.cos(ref.yaw)
    for (let ai = 0; ai < BAY_CLEARANCE_ATTEMPTS.length; ai++) {
      const along = BAY_CLEARANCE_ATTEMPTS[ai] * 60
      const lat = BAY_LATERALS[ai % BAY_LATERALS.length]
      // right of travel = (-cos yaw, sin yaw); side -1 parks on the left shoulder
      const rx = -Math.cos(ref.yaw) * spec.side
      const rz = Math.sin(ref.yaw) * spec.side
      const x = ref.x + dirX * along + rx * lat
      const z = ref.z + dirZ * along + rz * lat
      if (!bayIsClear(x, z, out)) continue
      out.push({
        x,
        z,
        y: heightAt(x, z),
        rotY: ref.yaw + (spec.side < 0 ? Math.PI : 0) + (rng() - 0.5) * 0.12,
        build: spec.build,
        variant: spec.variant,
      })
      break
    }
    // a bay that never finds clearance is silently skipped — one car
    // short is fine, blocking a doorway or the water is not
  }
  return out
})()
