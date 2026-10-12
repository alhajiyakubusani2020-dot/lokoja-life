'use client'

/**
 * LOKOJA LIFE — The City (Stage 3.5)
 * -----------------------------------
 * Every building in Lokoja, laid out from DISTRICT_PLANS + scatter data
 * and rendered as ~15 instanced batches (walls, roofs, awnings, windows,
 * posts, canopies…) so a whole city costs a handful of draw calls.
 *
 * Building recipes give each district its real character: pitched family
 * homes, zinc-roof shops, market stall rows, bukas with benches, colonial
 * relics, offices, hostels, motor-park shelters — plus the landmarks:
 * central mosque, church, confluence monument & jetty, Patti rest house
 * and radio mast, and the Crusher quarry at the hill's foot.
 */

import { useMemo } from 'react'
import * as THREE from 'three'
import { useWorldAssets, Instances, PALETTE, pick, WINDOW_MAT, type PartSpec } from './assets'
import { terrainHeight } from '@/game/systems/terrain'
import {
  DISTRICT_PLANS, SCATTER_HOUSES, CITY_LANDMARKS, ANCHORS, LANDMARK_POSITIONS,
  ALL_BUILDING_PLANS, type BuildingKind, type BuildingPlacement,
} from '@/game/data/world3d'

/* ------------------------------ recipe builder ----------------------------- */

interface BuildCtx {
  walls: PartSpec[]
  roofs: PartSpec[]
  slabs: PartSpec[]
  awnings: PartSpec[]
  windows: PartSpec[]
  doors: PartSpec[]
  posts: PartSpec[]
  canopies: PartSpec[]
  domes: PartSpec[]
  drums: PartSpec[]
  benches: PartSpec[]
  signs: PartSpec[]
  white: PartSpec[] // unpainted (white/cream) parts
  gold: PartSpec[]
  dark: PartSpec[]
}

function newCtx(): BuildCtx {
  return {
    walls: [], roofs: [], slabs: [], awnings: [], windows: [], doors: [],
    posts: [], canopies: [], domes: [], drums: [], benches: [], signs: [],
    white: [], gold: [], dark: [],
  }
}

/**
 * Emit the parts of one building at world position (x, z) facing rot.
 * Local frame: +Z is the front (door side). All units are world units.
 */
function emitBuilding(kind: BuildingKind, p: BuildingPlacement, ctx: BuildCtx) {
  const { x, z, rot, scale } = p
  const y = terrainHeight(x, z)
  const wall = PALETTE.wall[p.color % PALETTE.wall.length]
  const roof = PALETTE.roof[(p.color * 3 + 1) % PALETTE.roof.length]
  const awn = PALETTE.awning[(p.color * 5 + 2) % PALETTE.awning.length]
  const zinc = PALETTE.zinc

  // helper — local → world offsets (rot around Y; local +Z front)
  const at = (lx: number, ly: number, lz: number): { x: number; y: number; z: number } => {
    const sin = Math.sin(rot)
    const cos = Math.cos(rot)
    return {
      x: x + lx * cos + lz * sin,
      y: y + ly,
      z: z - lx * sin + lz * cos,
    }
  }
  const S = (sx: number, sy: number, sz: number): [number, number, number] => [sx * scale, sy * scale, sz * scale]

  switch (kind) {
    case 'house': {
      const w = 6.4, d = 5.4, h = 3
      ctx.slabs.push({ ...at(0, 0.18, 0), s: S(w + 0.7, 0.36, d + 0.7), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.36 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.36 + h + 1.05, 0), ry: rot + Math.PI / 4, s: S(Math.max(w, d) * 0.78, 2.2, Math.max(w, d) * 0.78), color: roof })
      ctx.doors.push({ ...at(0, 0.36 + 1.05, d / 2 + 0.06), ry: rot, s: S(1.05, 2.1, 0.14), color: PALETTE.woodDark })
      ctx.windows.push({ ...at(w / 4 - 0.4, 0.36 + 1.7, d / 2 + 0.06), ry: rot, s: S(1.15, 1.05, 0.1) })
      ctx.windows.push({ ...at(-w / 4 + 0.4, 0.36 + 1.7, d / 2 + 0.06), ry: rot, s: S(1.15, 1.05, 0.1) })
      break
    }
    case 'bungalow': {
      const w = 7.4, d = 6.4, h = 3.4
      ctx.slabs.push({ ...at(0, 0.18, 0), s: S(w + 0.8, 0.36, d + 0.8), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.36 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.36 + h + 0.16, 0), ry: rot, s: S(w + 0.6, 0.32, d + 0.6), color: zinc })
      ctx.doors.push({ ...at(0, 0.36 + 1.05, d / 2 + 0.06), ry: rot, s: S(1.1, 2.1, 0.14), color: PALETTE.woodDark })
      ctx.windows.push({ ...at(w / 4, 0.36 + 1.85, d / 2 + 0.06), ry: rot, s: S(1.5, 1.15, 0.1) })
      ctx.windows.push({ ...at(-w / 4, 0.36 + 1.85, d / 2 + 0.06), ry: rot, s: S(1.5, 1.15, 0.1) })
      break
    }
    case 'compound': {
      // Stage 3.6: walled family compound — house + perimeter wall + gate
      const w = 6.6, d = 5.6, h = 3
      const yardW = 12.4, yardD = 10.4
      ctx.slabs.push({ ...at(0, 0.18, 0), s: S(w + 0.7, 0.36, d + 0.7), color: PALETTE.rock })
      ctx.walls.push({ ...at(-1, 0.36 + h / 2, -1), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(-1, 0.36 + h + 1.05, -1), ry: rot + Math.PI / 4, s: S(Math.max(w, d) * 0.78, 2.2, Math.max(w, d) * 0.78), color: roof })
      ctx.doors.push({ ...at(-1, 0.36 + 1.05, -1 + d / 2 + 0.06), ry: rot, s: S(1.05, 2.1, 0.14), color: PALETTE.woodDark })
      ctx.windows.push({ ...at(-1 + w / 4 - 0.4, 0.36 + 1.7, -1 + d / 2 + 0.06), ry: rot, s: S(1.15, 1.05, 0.1) })
      // perimeter wall (front gap = gate)
      const gateW = 3
      const wallH = 1.9, wallT = 0.28
      ctx.walls.push({ ...at(0, wallH / 2, -yardD / 2), ry: rot, s: S(yardW, wallH, wallT), color: PALETTE.sand })
      ctx.walls.push({ ...at(0, wallH / 2, yardD / 2), ry: rot, s: S(yardW, wallH, wallT), color: PALETTE.sand })
      const sideW = (yardW - gateW) / 2
      ctx.walls.push({ ...at(-(gateW / 2 + sideW / 2), wallH / 2, yardD / 2), ry: rot, s: S(sideW, wallH, wallT), color: PALETTE.sand })
      ctx.walls.push({ ...at(gateW / 2 + sideW / 2, wallH / 2, yardD / 2), ry: rot, s: S(sideW, wallH, wallT), color: PALETTE.sand })
      ctx.walls.push({ ...at(-yardW / 2, wallH / 2, 0), ry: rot, s: S(wallT, wallH, yardD), color: PALETTE.sand })
      // metal gate + pillars
      ctx.doors.push({ ...at(0, 0.95, yardD / 2), ry: rot, s: S(gateW - 0.3, 1.7, 0.1), color: PALETTE.zinc })
      ctx.posts.push({ ...at(-gateW / 2 - 0.2, 1.15, yardD / 2), ry: rot, s: S(0.45, 2.3, 0.45), color: PALETTE.rockLight })
      ctx.posts.push({ ...at(gateW / 2 + 0.2, 1.15, yardD / 2), ry: rot, s: S(0.45, 2.3, 0.45), color: PALETTE.rockLight })
      break
    }
    case 'flat': {
      // Stage 3.6: 3-storey walk-up with balconies
      const w = 9.4, d = 6.8, h = 9.2
      ctx.slabs.push({ ...at(0, 0.2, 0), s: S(w + 0.9, 0.4, d + 0.9), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.4 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.4 + h + 0.35, 0), ry: rot, s: S(w + 0.7, 0.5, d + 0.7), color: zinc })
      // water tank on the roof — every Nigerian block has one
      ctx.drums.push({ ...at(w / 4, 0.4 + h + 1.15, 0), ry: rot, s: [1.15 * scale, 1.5 * scale, 1.15 * scale], color: PALETTE.dark })
      for (let floor = 0; floor < 3; floor++) {
        for (let i = 0; i < 4; i++) {
          ctx.windows.push({ ...at(-w / 2 + 1.5 + i * 2.2, 0.4 + 1.7 + floor * 2.9, d / 2 + 0.06), ry: rot, s: S(1.35, 1.5, 0.1) })
        }
        // balcony slab + rail on each floor above ground
        if (floor > 0) {
          ctx.benches.push({ ...at(0, 0.4 + floor * 2.9 + 0.12, d / 2 + 0.55), ry: rot, s: S(w - 1.6, 0.24, 1.2), color: PALETTE.rockLight })
          ctx.signs.push({ ...at(0, 0.4 + floor * 2.9 + 0.75, d / 2 + 1.1), ry: rot, s: S(w - 1.6, 0.85, 0.1), color: PALETTE.white })
        }
      }
      ctx.doors.push({ ...at(-w / 4, 0.4 + 1.1, d / 2 + 0.06), ry: rot, s: S(1.3, 2.2, 0.14), color: PALETTE.woodDark })
      break
    }
    case 'shop': {
      const w = 5.6, d = 4.6, h = 3
      ctx.slabs.push({ ...at(0, 0.16, 0), s: S(w + 0.6, 0.32, d + 0.6), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.32 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.32 + h + 0.15, 0), ry: rot, s: S(w + 0.5, 0.3, d + 0.5), color: zinc })
      ctx.awnings.push({ ...at(0, 0.32 + h - 0.75, d / 2 + 0.75), rx: 0.22, ry: rot, s: S(w + 0.4, 0.12, 1.5), color: awn })
      ctx.signs.push({ ...at(0, 0.32 + h + 0.65, d / 2 + 0.02), ry: rot, s: S(3.4, 0.85, 0.16), color: awn })
      ctx.doors.push({ ...at(-w / 4, 0.32 + 1, d / 2 + 0.06), ry: rot, s: S(1.1, 2, 0.14), color: PALETTE.woodDark })
      ctx.windows.push({ ...at(w / 4, 0.32 + 1.5, d / 2 + 0.06), ry: rot, s: S(2, 1.3, 0.1) })
      break
    }
    case 'block':
    case 'hostel': {
      const w = kind === 'hostel' ? 11 : 8.6, d = 6.6, h = 6.1
      ctx.slabs.push({ ...at(0, 0.18, 0), s: S(w + 0.8, 0.36, d + 0.8), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.36 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.36 + h + 0.16, 0), ry: rot, s: S(w + 0.5, 0.32, d + 0.5), color: zinc })
      for (let floor = 0; floor < 2; floor++) {
        for (let i = 0; i < Math.floor(w / 2.4); i++) {
          ctx.windows.push({ ...at(-w / 2 + 1.4 + i * 2.4, 0.36 + 1.6 + floor * 3, d / 2 + 0.06), ry: rot, s: S(1.3, 1.2, 0.1) })
        }
      }
      ctx.doors.push({ ...at(0, 0.36 + 1.05, d / 2 + 0.06), ry: rot, s: S(1.2, 2.1, 0.14), color: PALETTE.woodDark })
      break
    }
    case 'stall': {
      // market stall: table + goods + canopy on posts
      ctx.benches.push({ ...at(0, 0.45, 0), ry: rot, s: S(2.6, 0.9, 1.6), color: PALETTE.wood })
      const py = 1.15
      for (const [px, pz] of [[-1.25, -0.7], [1.25, -0.7], [-1.25, 0.7], [1.25, 0.7]] as const) {
        ctx.posts.push({ ...at(px, py / 2, pz), s: S(0.12, py, 0.12), color: PALETTE.woodDark })
      }
      ctx.canopies.push({ ...at(0, py + 0.28, 0), rz: 0.06, ry: rot, s: S(3.1, 0.12, 2.2), color: awn })
      ctx.walls.push({ ...at(-0.6, 1.05, 0.15), ry: rot + 0.2, s: S(0.55, 0.4, 0.55), color: pick(PALETTE.awning, p.color + 1) })
      ctx.walls.push({ ...at(0.5, 1.05, -0.2), ry: rot - 0.15, s: S(0.5, 0.35, 0.5), color: pick(PALETTE.awning, p.color + 3) })
      break
    }
    case 'kiosk': {
      const w = 3, d = 3, h = 2.6
      ctx.walls.push({ ...at(0, h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, h + 0.14, 0), ry: rot, s: S(w + 0.5, 0.26, d + 0.5), color: zinc })
      ctx.awnings.push({ ...at(0, h - 0.7, d / 2 + 0.4), rx: 0.3, ry: rot, s: S(w, 0.1, 0.9), color: awn })
      break
    }
    case 'buka': {
      // open food stand: counter, roof on posts, benches, steaming pot
      ctx.benches.push({ ...at(0, 0.45, -0.8), ry: rot, s: S(3.1, 0.9, 1.2), color: PALETTE.wood })
      ctx.benches.push({ ...at(0, 0.24, 1.5), ry: rot, s: S(2.6, 0.48, 0.55), color: PALETTE.wood })
      ctx.benches.push({ ...at(0, 0.24, 2.6), ry: rot, s: S(2.6, 0.48, 0.55), color: PALETTE.wood })
      for (const [px, pz] of [[-1.5, -1.3], [1.5, -1.3]] as const) {
        ctx.posts.push({ ...at(px, 1.2, pz), s: S(0.12, 2.4, 0.12), color: PALETTE.woodDark })
      }
      ctx.canopies.push({ ...at(0, 2.5, -0.3), rx: -0.12, ry: rot, s: S(3.8, 0.12, 3), color: awn })
      ctx.drums.push({ ...at(0.8, 0.55, -0.8), ry: rot, s: [0.55 * scale, 0.7 * scale, 0.55 * scale], color: PALETTE.dark })
      break
    }
    case 'workshop': {
      const w = 8.6, d = 6.6, h = 3.8
      ctx.slabs.push({ ...at(0, 0.16, 0), s: S(w + 0.6, 0.32, d + 0.6), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.32 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.32 + h + 0.15, 0), ry: rot, s: S(w + 0.5, 0.3, d + 0.5), color: zinc })
      ctx.doors.push({ ...at(0, 0.32 + 1.3, d / 2 + 0.06), ry: rot, s: S(2.8, 2.6, 0.14), color: PALETTE.woodDark })
      ctx.drums.push({ ...at(w / 2 + 0.7, 0.45, d / 4), s: [0.6 * scale, 0.9 * scale, 0.6 * scale], color: PALETTE.roof[3] })
      ctx.drums.push({ ...at(w / 2 + 1.5, 0.45, d / 4 + 0.8), s: [0.6 * scale, 0.9 * scale, 0.6 * scale], color: PALETTE.roof[0] })
      break
    }
    case 'office': {
      const w = 9.6, d = 7.6, h = 7.4
      ctx.slabs.push({ ...at(0, 0.18, 0), s: S(w + 1, 0.36, d + 1), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.36 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.36 + h + 0.18, 0), ry: rot, s: S(w + 0.6, 0.36, d + 0.6), color: zinc })
      for (let floor = 0; floor < 3; floor++) {
        ctx.windows.push({ ...at(-w / 4, 0.36 + 1.5 + floor * 2.4, d / 2 + 0.06), ry: rot, s: S(w / 2 - 0.8, 1.25, 0.1) })
        ctx.windows.push({ ...at(w / 4, 0.36 + 1.5 + floor * 2.4, d / 2 + 0.06), ry: rot, s: S(w / 2 - 0.8, 1.25, 0.1) })
      }
      ctx.doors.push({ ...at(0, 0.36 + 1.2, d / 2 + 0.06), ry: rot, s: S(1.6, 2.4, 0.16), color: PALETTE.woodDark })
      // flag pole with the green-white-green
      ctx.posts.push({ ...at(w / 2 + 1.6, 3, d / 2 - 1), s: S(0.14, 6, 0.14), color: PALETTE.white })
      ctx.signs.push({ ...at(w / 2 + 1.9, 5.4, d / 2 - 1), ry: rot, s: S(0.1, 0.7, 1.4), color: new THREE.Color('#1B7A43') })
      break
    }
    case 'colonial': {
      const w = 9.6, d = 7.6, h = 4.2
      ctx.slabs.push({ ...at(0, 0.24, 0), s: S(w + 1.2, 0.48, d + 1.2), color: PALETTE.rockLight })
      ctx.white.push({ ...at(0, 0.48 + h / 2, 0), ry: rot, s: S(w, h, d) })
      ctx.roofs.push({ ...at(0, 0.48 + h + 1.2, 0), ry: rot + Math.PI / 4, s: S(Math.max(w, d) * 0.8, 2.4, Math.max(w, d) * 0.8), color: PALETTE.roof[2] })
      for (let i = 0; i < 4; i++) {
        ctx.posts.push({ ...at(-w / 2 + 1.2 + i * 2.4, 0.48 + 1.5, d / 2 + 0.7), s: S(0.34, 3, 0.34), color: PALETTE.white })
      }
      ctx.windows.push({ ...at(-w / 4, 0.48 + 2.2, d / 2 + 0.06), ry: rot, s: S(1.3, 1.7, 0.12) })
      ctx.windows.push({ ...at(w / 4, 0.48 + 2.2, d / 2 + 0.06), ry: rot, s: S(1.3, 1.7, 0.12) })
      ctx.doors.push({ ...at(0, 0.48 + 1.3, d / 2 + 0.06), ry: rot, s: S(1.5, 2.6, 0.16), color: PALETTE.woodDark })
      break
    }
    case 'school': {
      const w = 13, d = 7.4, h = 3.8
      ctx.slabs.push({ ...at(0, 0.18, 0), s: S(w + 0.8, 0.36, d + 0.8), color: PALETTE.rock })
      ctx.walls.push({ ...at(0, 0.36 + h / 2, 0), ry: rot, s: S(w, h, d), color: wall })
      ctx.roofs.push({ ...at(0, 0.36 + h + 0.9, 0), ry: rot + Math.PI / 4, s: S(d * 0.75, 1.8, Math.max(w, d) * 0.76), color: roof })
      for (let i = 0; i < 6; i++) {
        ctx.windows.push({ ...at(-w / 2 + 1.5 + i * 2, 0.36 + 1.9, d / 2 + 0.06), ry: rot, s: S(1.25, 1.3, 0.1) })
      }
      ctx.doors.push({ ...at(0, 0.36 + 1.05, d / 2 + 0.06), ry: rot, s: S(1.3, 2.1, 0.14), color: PALETTE.woodDark })
      ctx.posts.push({ ...at(w / 2 + 1.4, 2.6, d / 2), s: S(0.13, 5.2, 0.13), color: PALETTE.white })
      ctx.signs.push({ ...at(w / 2 + 1.7, 4.7, d / 2), ry: rot, s: S(0.1, 0.6, 1.2), color: new THREE.Color('#1B7A43') })
      break
    }
    case 'shelter': {
      // motor-park waiting shelter
      ctx.slabs.push({ ...at(0, 0.12, 0), s: S(8.4, 0.24, 4.2), color: PALETTE.rock })
      for (const [px, pz] of [[-3.6, -1.5], [3.6, -1.5], [-3.6, 1.5], [3.6, 1.5]] as const) {
        ctx.posts.push({ ...at(px, 1.4, pz), s: S(0.2, 2.8, 0.2), color: PALETTE.woodDark })
      }
      ctx.canopies.push({ ...at(0, 2.9, 0), ry: rot, s: S(9, 0.22, 4.8), color: awn })
      ctx.benches.push({ ...at(0, 0.35, -1.3), ry: rot, s: S(7.4, 0.7, 0.6), color: PALETTE.wood })
      break
    }
    case 'resthouse': {
      // Mount Patti rest house — the reward for the climb
      const w = 8, d = 6.4, h = 3.8
      ctx.slabs.push({ ...at(0, 0.24, 0), s: S(w + 1, 0.48, d + 1), color: PALETTE.rockLight })
      ctx.white.push({ ...at(0, 0.48 + h / 2, 0), ry: rot, s: S(w, h, d) })
      ctx.roofs.push({ ...at(0, 0.48 + h + 1.1, 0), ry: rot + Math.PI / 4, s: S(Math.max(w, d) * 0.8, 2.2, Math.max(w, d) * 0.8), color: PALETTE.roof[2] })
      for (let i = 0; i < 4; i++) {
        ctx.posts.push({ ...at(-w / 2 + 1 + i * 2, 0.48 + 1.4, d / 2 + 0.6), s: S(0.3, 2.8, 0.3), color: PALETTE.white })
      }
      ctx.windows.push({ ...at(-w / 4, 0.48 + 2, d / 2 + 0.06), ry: rot, s: S(1.3, 1.5, 0.12) })
      ctx.windows.push({ ...at(w / 4, 0.48 + 2, d / 2 + 0.06), ry: rot, s: S(1.3, 1.5, 0.12) })
      break
    }
    default:
      break
  }
}

/* ------------------------------- the big batch ------------------------------ */

export function CityBuildings() {
  const { geos, mats } = useWorldAssets()

  const batch = useMemo(() => {
    const ctx = newCtx()
    const all: BuildingPlacement[] = [
      ...ALL_BUILDING_PLANS.flatMap((d) => d.buildings),
      ...SCATTER_HOUSES,
      ...CITY_LANDMARKS,
    ]
    for (const p of all) emitBuilding(p.kind, p, ctx)
    return ctx
  }, [])

  return (
    <group>
      <Instances geometry={geos.box} material={mats.flat} parts={batch.walls} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.roofs} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.slabs} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.awnings} />
      <Instances geometry={geos.box} material={WINDOW_MAT} parts={batch.windows} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.doors} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.posts} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.canopies} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.signs} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.benches} />
      <Instances geometry={geos.cylinder} material={mats.flat} parts={batch.domes} />
      <Instances geometry={geos.cylinder} material={mats.flat} parts={batch.drums} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.white} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.gold} />
      <Instances geometry={geos.box} material={mats.flat} parts={batch.dark} />
    </group>
  )
}

/* ------------------------------- the landmarks ------------------------------ */

/** Central mosque, church, confluence monument + jetty, Patti mast, crusher. */
export function Landmarks() {
  const { geos, mats } = useWorldAssets()

  const mosque = useMemo(() => {
    const { x, z, rot } = LANDMARK_POSITIONS.mosque
    const y = terrainHeight(x, z)
    const parts: BuildCtx = newCtx()
    const at = (lx: number, ly: number, lz: number) => {
      const sin = Math.sin(rot), cos = Math.cos(rot)
      return { x: x + lx * cos + lz * sin, y: y + ly, z: z - lx * sin + lz * cos }
    }
    parts.slabs.push({ ...at(0, 0.24, 0), s: [13, 0.48, 13], color: PALETTE.sand })
    parts.white.push({ ...at(0, 0.48 + 2.4, 0), ry: rot, s: [12, 4.8, 12] })
    parts.domes.push({ ...at(0, 0.48 + 4.8, 0), ry: rot, s: [8, 5.5, 8], color: PALETTE.gold })
    for (const [mx, mz] of [[-7.4, -7.4], [7.4, -7.4], [-7.4, 7.4], [7.4, 7.4]] as const) {
      parts.white.push({ ...at(mx, 0.48 + 5, mz), s: [1.3, 10, 1.3] })
      parts.domes.push({ ...at(mx, 0.48 + 10.4, mz), s: [1.7, 2.2, 1.7], color: PALETTE.gold })
    }
    parts.doors.push({ ...at(0, 0.48 + 1.5, 6.06), ry: rot, s: [2.6, 3, 0.3], color: PALETTE.woodDark })
    parts.windows.push({ ...at(-3.4, 0.48 + 2.6, 6.06), ry: rot, s: [1.5, 1.9, 0.12] })
    parts.windows.push({ ...at(3.4, 0.48 + 2.6, 6.06), ry: rot, s: [1.5, 1.9, 0.12] })
    return parts
  }, [])

  const church = useMemo(() => {
    const { x, z, rot } = LANDMARK_POSITIONS.church
    const y = terrainHeight(x, z)
    const parts: BuildCtx = newCtx()
    const at = (lx: number, ly: number, lz: number) => {
      const sin = Math.sin(rot), cos = Math.cos(rot)
      return { x: x + lx * cos + lz * sin, y: y + ly, z: z - lx * sin + lz * cos }
    }
    parts.slabs.push({ ...at(0, 0.22, 0), s: [10.4, 0.44, 15], color: PALETTE.rock })
    parts.white.push({ ...at(0, 0.44 + 2.4, 0), ry: rot, s: [9.6, 4.8, 14.2] })
    parts.roofs.push({ ...at(0, 0.44 + 4.8 + 0.9, 0), rx: 0, ry: rot + Math.PI / 4, s: [10.6, 1.9, 10.6], color: PALETTE.roof[2] })
    // front tower + cross
    parts.white.push({ ...at(0, 0.44 + 4, 8), ry: rot, s: [3.4, 8, 3.4] })
    parts.roofs.push({ ...at(0, 0.44 + 8.6, 8), ry: rot + Math.PI / 4, s: [3, 1.5, 3], color: PALETTE.roof[2] })
    parts.signs.push({ ...at(0, 0.44 + 10.4, 8), ry: rot, s: [0.34, 1.7, 0.34], color: PALETTE.gold })
    parts.signs.push({ ...at(0, 0.44 + 10.7, 8), ry: rot, s: [1, 0.34, 0.34], color: PALETTE.gold })
    parts.doors.push({ ...at(0, 0.44 + 1.4, 9.8), ry: rot, s: [1.8, 2.8, 0.2], color: PALETTE.woodDark })
    parts.windows.push({ ...at(-3, 0.44 + 2.6, 7.16), ry: rot, s: [1.2, 2, 0.12] })
    parts.windows.push({ ...at(3, 0.44 + 2.6, 7.16), ry: rot, s: [1.2, 2, 0.12] })
    return parts
  }, [])

  const confluence = useMemo(() => {
    const a = ANCHORS['confluence']
    const parts: BuildCtx = newCtx()

    // monument on the viewpoint (offset beside the arrival spot)
    {
      const x = LANDMARK_POSITIONS.monument.x
      const z = LANDMARK_POSITIONS.monument.z
      const y = terrainHeight(x, z)
      const at = (lx: number, ly: number, lz: number) => ({ x: x + lx, y: y + ly, z: z + lz })
      parts.slabs.push({ ...at(0, 0.4, 0), s: [6, 0.8, 6], color: PALETTE.rockLight })
      parts.white.push({ ...at(0, 4.2, 0), rx: 0, s: [1.1, 6.6, 1.1] })
      parts.gold.push({ ...at(0, 8.1, 0), s: [1.7, 1.7, 1.7] })
    }
    // jetty reaching into the meeting of the waters
    {
      const jx = a.standX + 10
      const jz = a.standZ + 4
      const deckY = 2.75
      const at = (lx: number, ly: number, lz: number) => ({ x: jx + lx, y: deckY + ly, z: jz + lz })
      parts.slabs.push({ ...at(0, 0, 0), s: [5, 0.4, 16], color: PALETTE.wood })
      for (const [px, pz] of [[-1.8, -6.5], [1.8, -6.5], [-1.8, 0], [1.8, 0], [-1.8, 6.5], [1.8, 6.5]] as const) {
        parts.posts.push({ ...at(px, -1.6, pz), s: [0.5, 3.4, 0.5], color: PALETTE.woodDark })
      }
      for (const side of [-1, 1]) {
        parts.signs.push({ ...at(side * 2.4, 0.7, 0), s: [0.14, 0.14, 15.4], color: PALETTE.white })
        for (const pz of [-6.5, 0, 6.5]) {
          parts.posts.push({ ...at(side * 2.4, 0.45, pz), s: [0.16, 1.1, 0.16], color: PALETTE.white })
        }
      }
    }
    return parts
  }, [])

  const patti = useMemo(() => {
    const a = ANCHORS['mount-patti']
    const parts: BuildCtx = newCtx()
    // radio mast near the summit
    const mx = a.standX + 12
    const mz = a.standZ - 10
    const my = terrainHeight(mx, mz)
    parts.white.push({ x: mx, y: my + 6, z: mz, s: [0.5, 12, 0.5], color: PALETTE.zinc })
    parts.signs.push({ x: mx, y: my + 12.4, z: mz, s: [0.2, 0.2, 0.2], color: PALETTE.dark })
    // guy posts
    for (const [gx, gz] of [[-4, -3], [4, 3], [3, -4]] as const) {
      parts.posts.push({ x: mx + gx, y: terrainHeight(mx + gx, mz + gz) + 0.8, z: mz + gz, s: [0.3, 1.6, 0.3], color: PALETTE.dark })
    }
    return parts
  }, [])

  // the Crusher — rock quarry at the foot of the Patti road
  const crusher = useMemo(() => {
    const parts: BuildCtx = newCtx()
    const cx = -116
    const cz = -66
    for (let i = 0; i < 10; i++) {
      const x = cx + Math.sin(i * 2.4) * 7
      const z = cz + Math.cos(i * 1.7) * 6
      const y = terrainHeight(x, z)
      parts.dark.push({
        x, y: y + 0.5, z,
        ry: i * 0.9,
        s: [1.4 + (i % 3) * 0.8, 1 + (i % 4) * 0.5, 1.2 + (i % 2) * 0.9],
        color: i % 2 ? PALETTE.rock : PALETTE.rockLight,
      })
    }
    // the machine shed
    const sy = terrainHeight(cx + 9, cz + 6)
    parts.walls.push({ x: cx + 9, y: sy + 1.6, z: cz + 6, ry: 0.5, s: [7, 3.2, 5], color: PALETTE.roof[3] })
    parts.roofs.push({ x: cx + 9, y: sy + 3.4, z: cz + 6, ry: 0.5, s: [7.6, 0.3, 5.6], color: PALETTE.zinc })
    return parts
  }, [])

  return (
    <group>
      {[mosque, church, confluence, patti, crusher].map((b, i) => (
        <group key={i}>
          <Instances geometry={geos.box} material={mats.flat} parts={b.walls} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.roofs} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.slabs} />
          <Instances geometry={geos.box} material={WINDOW_MAT} parts={b.windows} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.doors} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.posts} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.signs} />
          <Instances geometry={geos.dome} material={mats.flat} parts={b.domes} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.white} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.gold} />
          <Instances geometry={geos.box} material={mats.flat} parts={b.dark} />
        </group>
      ))}
    </group>
  )
}

/* -------------------------------- billboards -------------------------------- */

export function Billboards() {
  const { geos, mats } = useWorldAssets()

  const boards = useMemo(() => {
    const parts: PartSpec[] = []
    const posts: PartSpec[] = []
    const spots: Array<[number, number, number]> = [
      [52, 4, 0.3], // along ganaja-kpata
      [16, 66, 1.2], // near home
      [84, 108, 2.1], // near motor park
    ]
    const texts = [PALETTE.awning[0], PALETTE.awning[1], PALETTE.awning[2]]
    spots.forEach(([x, z, rot], i) => {
      const y = terrainHeight(x, z)
      posts.push({ x, y: y + 1.7, z, ry: rot, s: [0.28, 3.4, 0.28], color: PALETTE.woodDark })
      posts.push({ x: x + Math.sin(rot) * 2.6, y: y + 1.7, z: z + Math.cos(rot) * 2.6, ry: rot, s: [0.28, 3.4, 0.28], color: PALETTE.woodDark })
      parts.push({ x, y: y + 4.1, z, ry: rot, s: [7.4, 2.6, 0.24], color: texts[i % texts.length] })
    })
    return { parts, posts }
  }, [])

  return (
    <group>
      <Instances geometry={geos.box} material={mats.flat} parts={boards.parts} />
      <Instances geometry={geos.box} material={mats.flat} parts={boards.posts} />
    </group>
  )
}
