/* P3 probe 3 — runtime world counts via the repo's own bootstrap:
 * placed lights/bumps, stalls, doors, interiors, secrets, species stand, rocks. */
import { initGeoWith } from '../src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))

const out: Record<string, any> = {}

// junctions
try {
  const j: any = await import('../src/game/world3d/junctions')
  for (const k of Object.keys(j)) {
    const v = (j as any)[k]
    if (Array.isArray(v)) out['junctions.' + k] = v.length
    else if (typeof v === 'number' && /CAP|cap/.test(k)) out['junctions.' + k] = v
  }
} catch (e: any) { out.junctions_error = String(e).slice(0, 120) }

// layout + schools + interiors
const L: any = await import('../src/game/world3d/layout')
for (const k of ['DOORS', 'STALLS', 'LAMPS', 'DRAINS', 'ROCKS', 'TREES', 'GRASS', 'NPC_ZONES', 'POINTS_OF_INTEREST', 'PATTI_TRAIL']) {
  if (Array.isArray((L as any)[k])) out['layout.' + k] = (L as any)[k].length
}
const S: any = await import('../src/game/world3d/schools')
for (const k of Object.keys(S)) {
  const v = (S as any)[k]
  if (Array.isArray(v)) out['schools.' + k] = v.length
}
const I: any = await import('../src/game/world3d/interiors')
for (const k of Object.keys(I)) {
  const v = (I as any)[k]
  if (Array.isArray(v)) out['interiors.' + k] = v.length
  else if (v && typeof v === 'object' && k !== 'default') out['interiors.' + k + ' (keys)'] = Object.keys(v).length
}
// flora species stand
const F: any = await import('../src/game/world3d/flora')
if (Array.isArray((F as any).TREES)) {
  const bySp: Record<string, number> = {}
  for (const t of (F as any).TREES) bySp[(t as any).sp ?? (t as any).species ?? '?'] = (bySp[(t as any).sp ?? (t as any).species ?? '?'] ?? 0) + 1
  out['flora.TREES_by_species'] = bySp
  out['flora.TREES_total'] = (F as any).TREES.length
}
if (Array.isArray((F as any).GRASS_TUFTS)) out['flora.GRASS_TUFTS'] = (F as any).GRASS_TUFTS.length
const FS: any = await import('../src/game/world3d/flora-species')
for (const k of Object.keys(FS)) {
  const v = (FS as any)[k]
  if (Array.isArray(v)) out['flora-species.' + k] = v.length
  else if (v && typeof v === 'object') out['flora-species.' + k + ' (keys)'] = Object.keys(v).length
}
// patti secrets
const P: any = await import('../src/game/systems/patti')
for (const k of Object.keys(P)) {
  const v = (P as any)[k]
  if (Array.isArray(v)) out['patti.' + k] = v.length
}
console.log(JSON.stringify(out, null, 1))
