/**
 * LOKOJA LIFE — M23 W2 smoke: flora-species.ts geometry laws
 * ---------------------------------------------------------
 * Prints per species: tri count, bbox min.y / height, attribute
 * presence, cache identity — and asserts the merge contract:
 *   • aSway ∈ [0,1] (raw weight; material scales by meta.swayAmp)
 *   • aLeaf ∈ {0,1} (tiny float noise tolerated)
 *   • bbox min.y within ±0.05 of 0 (origin = ground contact)
 *   • total height within ±15% of SPECIES_META.height
 *   • tris ≤ SPECIES_META.maxTris
 *   • two buildSpeciesGeometry calls return the identical object
 *
 * NO geo bootstrap needed — flora-species imports only `three` +
 * flora-types, so it is headless-safe under bun.
 *
 * Run: bun scripts/smoke-flora-species.ts
 */
import { SPECIES_IDS, SPECIES_META } from '../src/game/world3d/flora-types'
import { buildSpeciesGeometry, speciesTriCount, SPECIES_BUILD_SEEDS } from '../src/game/world3d/flora-species'

let pass = 0
let fail = 0
function law(name: string, ok: boolean, detail = ''): void {
  if (ok) {
    pass++
    console.log(`  ✅ ${name}${detail ? ` — ${detail}` : ''}`)
  } else {
    fail++
    console.error(`  ❌ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

console.log('M23 W2 THE GREEN — flora-species smoke')
console.log('='.repeat(64))

for (const id of SPECIES_IDS) {
  const meta = SPECIES_META[id]
  console.log(`\n${id}  (seed ${SPECIES_BUILD_SEEDS[id]} · meta h ${meta.height} · cap ${meta.maxTris} tris)`)

  const g = buildSpeciesGeometry(id)
  const again = buildSpeciesGeometry(id)
  g.computeBoundingBox()
  const bb = g.boundingBox!
  const h = bb.max.y - bb.min.y
  const tris = speciesTriCount(id)

  const p = g.attributes.position
  const attr = ['position', 'normal', 'color', 'aSway', 'aLeaf'].map((n) => {
    const a = g.getAttribute(n)
    return `${n}:${a ? a.count : 'MISSING'}`
  })
  console.log(`  tris ${tris} · bbox min.y ${bb.min.y.toFixed(4)} · height ${h.toFixed(3)} · z [${bb.min.z.toFixed(2)}, ${bb.max.z.toFixed(2)}]`)
  console.log(`  attrs ${attr.join(' ')} · index ${g.index ? g.index.count : 'NONE'} · ${p.count} verts`)

  law(`${id}: cache identity (two calls === same object)`, g === again)
  law(`${id}: ${tris} ≤ maxTris ${meta.maxTris}`, tris > 0 && tris <= meta.maxTris)
  law(`${id}: bbox min.y ${bb.min.y.toFixed(4)} within ±0.05 of 0`, Math.abs(bb.min.y) <= 0.05)
  law(`${id}: height ${h.toFixed(3)} within ±15% of ${meta.height}`, Math.abs(h - meta.height) <= meta.height * 0.15, `${(((h / meta.height) - 1) * 100).toFixed(1)}%`)
  law(`${id}: all attributes present & sized`, attr.every((s) => !s.endsWith('MISSING') && !s.includes(':0')) && g.index !== null,
    `color ${g.getAttribute('color')?.itemSize} · aSway ${g.getAttribute('aSway')?.itemSize} · aLeaf ${g.getAttribute('aLeaf')?.itemSize}`)

  const sway = g.getAttribute('aSway')!
  let sMin = Infinity
  let sMax = -Infinity
  for (let i = 0; i < sway.count; i++) {
    const v = sway.getX(i)
    if (v < sMin) sMin = v
    if (v > sMax) sMax = v
  }
  law(`${id}: aSway in [0,1]`, sMin >= -1e-4 && sMax <= 1 + 1e-4, `[${sMin.toFixed(3)}, ${sMax.toFixed(3)}]`)

  const leaf = g.getAttribute('aLeaf')!
  let leafOk = true
  let wood = 0
  let crown = 0
  for (let i = 0; i < leaf.count; i++) {
    const v = leaf.getX(i)
    if (Math.abs(v) < 1e-4) wood++
    else if (Math.abs(v - 1) < 1e-4) crown++
    else leafOk = false
  }
  law(`${id}: aLeaf binary`, leafOk, `${wood} wood · ${crown} leaf`)
}

console.log('\ncross-species')
law('SPECIES_BUILD_SEEDS covers all 10 species', SPECIES_IDS.every((id) => typeof SPECIES_BUILD_SEEDS[id] === 'number'),
  Object.values(SPECIES_BUILD_SEEDS).join(','))
law('seeds distinct', new Set(Object.values(SPECIES_BUILD_SEEDS)).size === SPECIES_IDS.length)
law('every geometry unique per species', new Set(SPECIES_IDS.map((id) => buildSpeciesGeometry(id))).size === SPECIES_IDS.length)

console.log('='.repeat(64))
console.log(`${pass} laws pass · ${fail} fail`)
if (fail > 0) process.exit(1)
