'use client'

/**
 * LOKOJA LIFE — Vegetation & rocks (Stage 3.5)
 * ---------------------------------------------
 * Patti's forest, riverine tree lines, district shade trees, palms,
 * bushes and scatter rocks — all instanced, all from the deterministic
 * VEGETATION registry.
 */

import { useMemo } from 'react'
import { useWorldAssets, Instances, PALETTE, pick, type PartSpec } from './assets'
import { terrainHeight } from '@/game/systems/terrain'
import { VEGETATION, type PropPlacement } from '@/game/data/world3d'

function treeParts(list: PropPlacement[]): { trunks: PartSpec[]; leaves: PartSpec[]; leaves2: PartSpec[] } {
  const trunks: PartSpec[] = []
  const leaves: PartSpec[] = []
  const leaves2: PartSpec[] = []
  for (const t of list) {
    const y = terrainHeight(t.x, t.z)
    const s = t.scale
    trunks.push({ x: t.x, y: y + 1.5 * s, z: t.z, ry: t.rot, s: [0.42 * s, 3 * s, 0.42 * s], color: PALETTE.trunk })
    const leaf = pick(PALETTE.leaf, t.variant)
    leaves.push({ x: t.x, y: y + 3.9 * s, z: t.z, ry: t.rot + t.variant, s: [3.4 * s, 3.6 * s, 3.4 * s], color: leaf })
    leaves2.push({ x: t.x + 0.4 * s, y: y + 5.4 * s, z: t.z - 0.3 * s, ry: t.rot * 1.7, s: [2.2 * s, 2.4 * s, 2.2 * s], color: leaf })
  }
  return { trunks, leaves, leaves2 }
}

function palmParts(list: PropPlacement[]): { trunks: PartSpec[]; fronds: PartSpec[] } {
  const trunks: PartSpec[] = []
  const fronds: PartSpec[] = []
  for (const t of list) {
    const y = terrainHeight(t.x, t.z)
    const s = t.scale
    trunks.push({ x: t.x, y: y + 2.6 * s, z: t.z, rz: 0.08, ry: t.rot, s: [0.3 * s, 5.2 * s, 0.3 * s], color: PALETTE.trunk })
    // 5 fronds fanned around the crown
    for (let f = 0; f < 5; f++) {
      const ang = t.rot + (f / 5) * Math.PI * 2
      fronds.push({
        x: t.x + Math.sin(ang) * 1.1 * s,
        y: y + 5.2 * s,
        z: t.z + Math.cos(ang) * 1.1 * s,
        ry: ang + Math.PI / 2,
        rz: 0.55,
        s: [0.75 * s, 0.28 * s, 2.6 * s],
        color: PALETTE.palm,
      })
    }
  }
  return { trunks, fronds }
}

function bushParts(list: PropPlacement[]): PartSpec[] {
  const out: PartSpec[] = []
  for (const b of list) {
    const y = terrainHeight(b.x, b.z)
    out.push({ x: b.x, y: y + 0.55 * b.scale, z: b.z, ry: b.rot * 2, s: [1.7 * b.scale, 1.3 * b.scale, 1.7 * b.scale], color: pick(PALETTE.leaf, b.variant) })
  }
  return out
}

function rockParts(list: PropPlacement[]): PartSpec[] {
  const out: PartSpec[] = []
  for (const r of list) {
    const y = terrainHeight(r.x, r.z)
    out.push({ x: r.x, y: y + 0.35 * r.scale, z: r.z, ry: r.rot, rx: (r.variant - 1) * 0.12, s: [1.3 * r.scale, 0.8 * r.scale, 1.1 * r.scale], color: r.variant === 1 ? PALETTE.rock : PALETTE.rockLight })
  }
  return out
}

export function Vegetation() {
  const { geos, mats } = useWorldAssets()

  const parts = useMemo(() => ({
    trees: treeParts(VEGETATION.trees),
    palms: palmParts(VEGETATION.palms),
    bushes: bushParts(VEGETATION.bushes),
    rocks: rockParts(VEGETATION.rocks),
  }), [])

  return (
    <group>
      <Instances geometry={geos.cylinder} material={mats.flat} parts={parts.trees.trunks} />
      <Instances geometry={geos.ico} material={mats.flat} parts={parts.trees.leaves} />
      <Instances geometry={geos.ico} material={mats.flat} parts={parts.trees.leaves2} />
      <Instances geometry={geos.cylinder} material={mats.flat} parts={parts.palms.trunks} />
      <Instances geometry={geos.box} material={mats.flat} parts={parts.palms.fronds} />
      <Instances geometry={geos.ico} material={mats.flat} parts={parts.bushes} />
      <Instances geometry={geos.ico} material={mats.flat} parts={parts.rocks} />
    </group>
  )
}
