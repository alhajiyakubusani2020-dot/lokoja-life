/**
 * LOKOJA LIFE — GEO BINARY PROOF (m-optim law #7)
 * -----------------------------------------------
 * The committed guarantee for deferred work #1: the shipped
 * `public/world/geo-v1.bin` decodes, through the RUNTIME decoder in
 * src/game/world3d/geo.ts, to a structure that matches the manifest the
 * encoder committed at encode time — where a 70,828-comparison element
 * sweep proved every field `===` the original geo.ts literals.
 *
 * This suite asserts the chain end-to-end:
 *  1. the .bin exists and its sha256 === the manifest's sha256 (the file
 *     on disk is the exact buffer the sweep proved)
 *  2. the runtime decoder produces the manifest's counts
 *  3. a fresh FNV-1a coordinate hash over every decoded point === the
 *     manifest's coordHash (element-level integrity, not just counts)
 *  4. spot checks: named road by osm id, its exact first point, the
 *     Niger's width, the bridge count — every value compared with ===
 *  5. bounds law: every decoded coordinate inside ±GEO_WORLD_HALF + rim
 *  6. THE EMPTY-BY-DEFAULT LAW: the module's exported arrays start empty
 *     — the 432KB text must never re-enter any bundle
 *
 * Run: bun scripts/test-geo-bin.ts
 */
import { readFileSync } from 'fs'
import { createHash } from 'crypto'

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

/* 1. the file on disk is the exact buffer the encode-time sweep proved */
const MANIFEST = JSON.parse(readFileSync('/home/z/my-project/scripts/geo/geo-bin-manifest.json', 'utf8'))
const bin = readFileSync('/home/z/my-project/public/world/geo-v1.bin')
const sha = createHash('sha256').update(bin).digest('hex')
console.log('1. FILE IDENTITY')
law('sha256 === manifest', sha === MANIFEST.sha256, `${bin.length.toLocaleString('en-US')} B`)
law('byte length === manifest', bin.length === MANIFEST.bytes)

/* 2-4. the RUNTIME decoder (the exact code the world boots on) */
const { decodeGeoBin, GEO_ROADS, GEO_RIVERS, GEO_BRIDGES, GEO_LOOPS, GEO_WORLD_HALF } = await import(
  '../src/game/world3d/geo'
)
console.log('2. RUNTIME DECODE')
const t0 = performance.now()
const data = decodeGeoBin(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
const dt = performance.now() - t0
law('decode completes', !!data, `${dt.toFixed(2)}ms (V8 parsed 24k literals for 5–15ms before)`)
law('counts === manifest', data.roads.length === MANIFEST.counts.roads && data.rivers.length === MANIFEST.counts.rivers && data.bridges.length === MANIFEST.counts.bridges && data.loops.length === MANIFEST.counts.loops, `${data.roads.length} roads · ${data.rivers.length} rivers · ${data.bridges.length} bridges · ${data.loops.length} loops`)

/* 3. the coordinate hash — every decoded point, element-level integrity.
 *    The encoder committed fnv-1a over the DECODED float stream; this
 *    suite recomputes the same stream through the RUNTIME decoder —
 *    like-with-like. */
console.log('3. COORDINATE HASH')
let h = 0x811c9dc5
const fnvFeed = (s: string) => {
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
}
for (const r of data.roads) for (const p of r.pts) fnvFeed(`${p[0]},${p[1]};`)
for (const r of data.rivers) for (const p of r.pts) fnvFeed(`${p[0]},${p[1]};`)
for (const b of data.bridges) fnvFeed(`${b.x},${b.z},${b.yaw},${b.len},${b.w};`)
for (const l of data.loops) for (const p of l) fnvFeed(`${p[0]},${p[1]};`)
law('fnv(decoded float stream) === manifest.coordHashFnv', h.toString(16) === MANIFEST.coordHashFnv, `runtime ${h.toString(16)} vs encoder ${MANIFEST.coordHashFnv}`)

/* 4. spot equality — the same values the encoder pinned, through the
 *    runtime decoder, compared with === */
console.log('4. SPOT EQUALITY (===)')
const road0 = data.roads.find((r) => r.osm === MANIFEST.spotChecks.road0_osm)
law(`road by osm ${MANIFEST.spotChecks.road0_osm} exists`, !!road0)
law('road0 first point === [−235.4, −110.8]', !!road0 && road0.pts[0][0] === MANIFEST.spotChecks.road0_first[0] && road0.pts[0][1] === MANIFEST.spotChecks.road0_first[1], JSON.stringify(road0?.pts[0]))
const niger = data.rivers.find((r) => r.id === MANIFEST.spotChecks.river0_id)
law(`river "${MANIFEST.spotChecks.river0_id}" w === ${MANIFEST.spotChecks.river0_w}`, !!niger && niger.w === MANIFEST.spotChecks.river0_w, String(niger?.w))
law('bridge count === 16', data.bridges.length === MANIFEST.spotChecks.bridges)

/* 4b. EXACT LITERAL PINS — decoded floats must equal the original source
 *     literals (the encode sweep proved all 70,828; these pins re-prove
 *     representative members of every table through the RUNTIME decoder) */
console.log('4b. EXACT LITERAL PINS')
const otukpo = data.roads.find((r) => r.osm === 267587003)
law('Lokoja-Otukpo Road name', otukpo?.name === 'Lokoja-Otukpo Road', String(otukpo?.name))
law('Otukpo cls/style/w', otukpo?.cls === 'highway' && otukpo?.style === 'asphalt' && otukpo?.w === 0.44, `${otukpo?.cls}/${otukpo?.style}/${otukpo?.w}`)
law('Otukpo is major non-bridge', otukpo?.major === true && otukpo?.bridge === false)
const benu = data.rivers.find((r) => r.id === 'benu')
law('Benue name === "Benué"', benu?.name === 'Benu\u00e9', String(benu?.name))
law('Benue w === 10.0', benu?.w === 10.0, String(benu?.w))
const bridge0 = data.bridges[0]
law('bridge0 exact', bridge0.x === -278.3 && bridge0.z === 80.6 && bridge0.yaw === -2.731 && bridge0.len === 7 && bridge0.w === 6.6 && bridge0.cls === 'laterite', JSON.stringify(bridge0))

/* 5. the bounds law — every coordinate inside the world rim (+2u rim) */
console.log('5. BOUNDS LAW')
let out = 0
let n = 0
const rim = GEO_WORLD_HALF + 2
for (const r of data.roads) for (const p of r.pts) { n++; if (Math.abs(p[0]) > rim || Math.abs(p[1]) > rim) out++ }
for (const r of data.rivers) for (const p of r.pts) { n++; if (Math.abs(p[0]) > rim || Math.abs(p[1]) > rim) out++ }
for (const l of data.loops) for (const p of l) { n++; if (Math.abs(p[0]) > rim || Math.abs(p[1]) > rim) out++ }
law(`all ${n.toLocaleString('en-US')} points within ±${rim}u`, out === 0, `${out} escapes`)

/* 6. THE EMPTY-BY-DEFAULT LAW — module state before initGeo() */
console.log('6. EMPTY-BY-DEFAULT LAW')
law('GEO_ROADS starts empty (no static data ships)', GEO_ROADS.length === 0)
law('GEO_RIVERS starts empty', GEO_RIVERS.length === 0)
law('GEO_BRIDGES starts empty', GEO_BRIDGES.length === 0)
law('GEO_LOOPS starts empty', GEO_LOOPS.length === 0)

/* 7. the wire law — the old text must be gone from the source tree */
console.log('7. WIRE LAW')
const geoSrc = readFileSync('/home/z/my-project/src/game/world3d/geo.ts', 'utf8')
law('geo.ts no longer embeds the decimal tables', geoSrc.length < 20_000, `${geoSrc.length.toLocaleString('en-US')} B (was 432,444 B)`)
law('binary beats the old gz text', bin.length < 66_601, `${bin.length.toLocaleString('en-US')} B vs 66,601 B gz text`)

console.log('---')
console.log(`${pass} laws pass, ${fail} fail`)
process.exit(fail === 0 ? 0 : 1)
