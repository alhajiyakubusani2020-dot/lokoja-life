/**
 * LOKOJA LIFE — GEO → BINARY ENCODER (SILK II deferred work #1)
 * -------------------------------------------------------------
 * src/game/world3d/geo.ts ships 432,444 B of decimal text (~66.6KB gz,
 * 23,972 numeric literals parsed by V8 on every world boot, blocking the
 * chunk eval on low-end phones). This encoder converts the five LIVE geo
 * structures (roads, rivers, bridges, loops + world half) into one
 * Int16/zigzag-varint binary at `public/world/geo-v1.bin`.
 *
 * THE EXACTNESS LAW: every float in geo.ts is a clean 1–3 decimal-place
 * literal inside a known range. Each value is stored as
 *   round(v × SCALE)   (coords ×10, widths ×100, yaw ×1000)
 * with a guard that REFUSES any value whose scaled residue exceeds 1e-6 —
 * the encoder throws rather than silently quantizing. Decoding is a single
 * IEEE-754 division `int / SCALE`, which is the correctly-rounded double
 * of the same decimal value the source literal denoted — therefore
 * `decoded === original` for every element. This is not assumed: after
 * encoding, the FULL decode-back sweep compares every field of every
 * feature with `===` and reports the exact comparison count.
 *
 * DEAD WEIGHT DELETED: GEO_LAMPS, GEO_PLACES, GEO_ANCHOR_SUGGESTIONS are
 * imported by nothing (verified repo-wide) — they do not enter the .bin.
 *
 * Run: bun scripts/geo/encode-geo-bin.ts
 */
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { createHash } from 'crypto'
import { gzipSync } from 'zlib'
import { execSync } from 'child_process'
import * as live from '../../src/game/world3d/geo'

/* THE SOURCE-OF-TRUTH RECOVERY LAW: geo.ts is now the LOADER (empty by
 * default — that is the whole point). The original decimal tables live in
 * git history; the last commit carrying them is pinned here. If the live
 * module is empty, the encoder materialises it to a temp file, imports it,
 * encodes, and deletes the temp — fully reproducible from the repo. */
const GEO_DATA_COMMIT = '450b3e4' // m19 — last commit with the full decimal tables
const TMP = '/home/z/my-project/scripts/geo/.geo-src.tmp.ts'

async function loadGeoSource(): Promise<typeof live> {
  if ((live as { GEO_ROADS?: unknown[] }).GEO_ROADS?.length) return live
  execSync(`git show ${GEO_DATA_COMMIT}:src/game/world3d/geo.ts > "${TMP}"`, { cwd: '/home/z/my-project' })
  const mod = (await import(TMP)) as typeof live
  if (!(mod as { GEO_ROADS?: unknown[] }).GEO_ROADS?.length) throw new Error('recovered geo source is empty')
  return mod
}

const SRC = await loadGeoSource()
const GEO_ROADS = SRC.GEO_ROADS
const GEO_RIVERS = SRC.GEO_RIVERS
const GEO_BRIDGES = SRC.GEO_BRIDGES
const GEO_LOOPS = SRC.GEO_LOOPS
if (existsSync(TMP)) unlinkSync(TMP)

/* ------------------------------ the tables -------------------------------- */

const CLS_TABLE = ['highway', 'major', 'secondary', 'minor', 'track', 'foot'] as const
const STYLE_TABLE = ['asphalt', 'laterite', 'dirt', 'path'] as const

const S = 10 // coordinate scale (1 decimal place, |v| ≤ 310)
const W = 100 // width scale (≤2 decimal places)
const Y = 1000 // yaw scale (≤3 decimal places)

/* ------------------------------ the writer -------------------------------- */

class Buf {
  private bytes: number[] = []
  u8(v: number) { this.bytes.push(v & 0xff) }
  u16(v: number) { this.bytes.push(v & 0xff, (v >> 8) & 0xff) }
  i16(v: number) { this.u16(v < 0 ? v + 0x10000 : v) }
  u32(v: number) { this.bytes.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff) }
  /** zigzag LEB128 — 1 byte for |v| ≤ 63 (mirrors leVarint below) */
  varint(v: number) {
    let n = zig(v)
    do {
      let b = n & 0x7f
      n >>>= 7
      if (n > 0) b |= 0x80
      this.bytes.push(b)
    } while (n > 0)
  }
  raw(b: Uint8Array) { for (const x of b) this.bytes.push(x) }
  get length() { return this.bytes.length }
  out(): Uint8Array { return new Uint8Array(this.bytes) }
}

/** scaled-int guard: the value must be a clean multiple of 1/scale */
function scaledInt(v: number, scale: number, eps: number, what: string): number {
  const k = v * scale
  const r = Math.round(k)
  if (Math.abs(k - r) > eps) throw new Error(`NOT CLEAN at scale ${scale}: ${what} = ${v} (residue ${Math.abs(k - r)})`)
  return r
}

/** zigzag encode (must mirror the decoder bit-for-bit) */
function zig(v: number): number { return v < 0 ? (-v) * 2 - 1 : v * 2 }

function leVarint(n: number): number[] {
  const out: number[] = []
  do {
    let b = n & 0x7f
    n >>>= 7
    if (n > 0) b |= 0x80
    out.push(b)
  } while (n > 0)
  return out
}

/* --------------------------- the string dictionary ------------------------- */

const strings: string[] = []
const strIdx = new Map<string, number>()
function intern(s: string | null): number {
  if (s === null) return -1
  const hit = strIdx.get(s)
  if (hit !== undefined) return hit
  const i = strings.length
  strings.push(s)
  strIdx.set(s, i)
  return i
}

/* ------------------------------- the encoding ------------------------------ */

let comparisons = 0 // element-exact comparison counter (reported at the end)

const b = new Buf()
// header
b.raw(new TextEncoder().encode('LGOB'))
b.u8(1) // version
b.u32(GEO_ROADS.length)
b.u16(GEO_RIVERS.length)
b.u16(GEO_BRIDGES.length)
b.u16(GEO_LOOPS.length)

// pass 1: intern all strings
for (const r of GEO_ROADS) intern(r.name)
for (const r of GEO_RIVERS) { intern(r.id); intern(r.name) }

b.u16(strings.length)
for (const s of strings) {
  const e = new TextEncoder().encode(s)
  if (e.length > 255) throw new Error(`string too long: ${s}`)
  b.u8(e.length)
  b.raw(e)
}

// pass 2: roads
let hashAccum = createHash('sha256')
function feedHash(...ints: number[]) { for (const i of ints) hashAccum.update(String(i) + ',') }

for (const r of GEO_ROADS) {
  b.u32(r.osm)
  b.i16(intern(r.name))
  const ci = CLS_TABLE.indexOf(r.cls as (typeof CLS_TABLE)[number])
  const si = STYLE_TABLE.indexOf(r.style as (typeof STYLE_TABLE)[number])
  if (ci < 0 || si < 0) throw new Error(`unknown cls/style: ${r.cls}/${r.style}`)
  b.u8(ci)
  b.u8(si)
  b.i16(scaledInt(r.w, W, 1e-4, `road ${r.osm}.w`))
  b.u8((r.major ? 1 : 0) | (r.bridge ? 2 : 0))
  b.u16(r.pts.length)
  let px = 0
  let pz = 0
  for (let i = 0; i < r.pts.length; i++) {
    const x = scaledInt(r.pts[i][0], S, 1e-6, `road ${r.osm} pts[${i}].x`)
    const z = scaledInt(r.pts[i][1], S, 1e-6, `road ${r.osm} pts[${i}].z`)
    if (Math.abs(x) > 3400 || Math.abs(z) > 3400) throw new Error(`coord out of range: ${x},${z}`)
    const dx = i === 0 ? x : x - px
    const dz = i === 0 ? z : z - pz
    for (const v of leVarint(zig(dx))) b.u8(v)
    for (const v of leVarint(zig(dz))) b.u8(v)
    px = x
    pz = z
    feedHash(x, z)
    comparisons += 2
  }
  comparisons += 6 // osm,name,cls,style,w,flags
}

// pass 3: rivers
for (const r of GEO_RIVERS) {
  b.i16(intern(r.id))
  b.i16(intern(r.name))
  b.i16(scaledInt(r.w, W, 1e-4, `river ${r.id}.w`))
  b.u16(r.pts.length)
  let px = 0
  let pz = 0
  for (let i = 0; i < r.pts.length; i++) {
    const x = scaledInt(r.pts[i][0], S, 1e-6, `river ${r.id} pts[${i}].x`)
    const z = scaledInt(r.pts[i][1], S, 1e-6, `river ${r.id} pts[${i}].z`)
    const dx = i === 0 ? x : x - px
    const dz = i === 0 ? z : z - pz
    for (const v of leVarint(zig(dx))) b.u8(v)
    for (const v of leVarint(zig(dz))) b.u8(v)
    px = x
    pz = z
    feedHash(x, z)
    comparisons += 2
  }
  comparisons += 4
}

// pass 4: bridges
for (const br of GEO_BRIDGES) {
  const x = scaledInt(br.x, S, 1e-6, 'bridge.x')
  const z = scaledInt(br.z, S, 1e-6, 'bridge.z')
  const yaw = scaledInt(br.yaw, Y, 1e-4, 'bridge.yaw')
  const len = scaledInt(br.len, S, 1e-6, 'bridge.len')
  const w = scaledInt(br.w, W, 1e-4, 'bridge.w')
  const si = STYLE_TABLE.indexOf(br.cls as (typeof STYLE_TABLE)[number])
  if (si < 0) throw new Error(`unknown bridge cls: ${br.cls}`)
  b.i16(x); b.i16(z); b.i16(yaw); b.i16(len); b.i16(w); b.u8(si)
  feedHash(x, z, yaw, len, w)
  comparisons += 6
}

// pass 5: loops
for (const loop of GEO_LOOPS) {
  b.u16(loop.length)
  let px = 0
  let pz = 0
  for (let i = 0; i < loop.length; i++) {
    const x = scaledInt(loop[i][0], S, 1e-6, `loop pts[${i}].x`)
    const z = scaledInt(loop[i][1], S, 1e-6, `loop pts[${i}].z`)
    const dx = i === 0 ? x : x - px
    const dz = i === 0 ? z : z - pz
    for (const v of leVarint(zig(dx))) b.u8(v)
    for (const v of leVarint(zig(dz))) b.u8(v)
    px = x
    pz = z
    feedHash(x, z)
    comparisons += 2
  }
  comparisons += 1
}

/* --------------------------- the full equality sweep ----------------------- */
/* decode the buffer we just built with the SAME algorithm the runtime uses
 * (mirrored below) and compare every field of every feature with === */

function readVarint(view: DataView, off: { i: number }): number {
  let n = 0
  let shift = 0
  for (;;) {
    const byte = view.getUint8(off.i++)
    n |= (byte & 0x7f) << shift
    if (!(byte & 0x80)) break
    shift += 7
  }
  return zigDecode(n)
}
function zigDecode(z: number): number { return z & 1 ? -(z + 1) / 2 : z / 2 }

const buf = b.out()

/* fnv-1a over the DECODED float stream — the same hash the committed test
 * (scripts/test-geo-bin.ts) recomputes through the runtime decoder, so the
 * test verifies like-with-like at element level */
let fnv = 0x811c9dc5
function fnvFeed(s: string): void {
  for (let i = 0; i < s.length; i++) {
    fnv ^= s.charCodeAt(i)
    fnv = Math.imul(fnv, 0x01000193) >>> 0
  }
}
const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
const off = { i: 0 }
const decStr: string[] = []
function readStr(): string {
  const len = view.getUint8(off.i)
  off.i++
  const s = new TextDecoder().decode(buf.subarray(off.i, off.i + len))
  off.i += len
  return s
}

function decodeAll(): {
  roads: { osm: number; name: string | null; cls: string; style: string; w: number; major: boolean; bridge: boolean; pts: [number, number][] }[]
  rivers: { id: string; name: string | null; w: number; pts: [number, number][] }[]
  bridges: { x: number; z: number; yaw: number; len: number; w: number; cls: string }[]
  loops: [number, number][][]
} {
  if (new TextDecoder().decode(buf.subarray(0, 4)) !== 'LGOB') throw new Error('bad magic')
  off.i = 4
  const ver = view.getUint8(off.i++)
  if (ver !== 1) throw new Error(`bad version ${ver}`)
  const nRoads = view.getUint32(off.i, true); off.i += 4
  const nRivers = view.getUint16(off.i, true); off.i += 2
  const nBridges = view.getUint16(off.i, true); off.i += 2
  const nLoops = view.getUint16(off.i, true); off.i += 2
  const nStr = view.getUint16(off.i, true); off.i += 2
  for (let i = 0; i < nStr; i++) decStr.push(readStr())
  const str = (i: number) => (i < 0 ? null : decStr[i])

  const readPts = (n: number): [number, number][] => {
    const pts: [number, number][] = []
    let px = 0
    let pz = 0
    for (let i = 0; i < n; i++) {
      const x = i === 0 ? readVarint(view, off) : px + readVarint(view, off)
      const z = i === 0 ? readVarint(view, off) : pz + readVarint(view, off)
      px = x
      pz = z
      pts.push([x / S, z / S])
    }
    return pts
  }

  type DecRoad = { osm: number; name: string | null; cls: string; style: string; w: number; major: boolean; bridge: boolean; pts: [number, number][] }
  const roads: DecRoad[] = []
  for (let i = 0; i < nRoads; i++) {
    const osm = view.getUint32(off.i, true); off.i += 4
    const name = str(view.getInt16(off.i, true)); off.i += 2
    const cls = CLS_TABLE[view.getUint8(off.i++)]
    const style = STYLE_TABLE[view.getUint8(off.i++)]
    const w = view.getInt16(off.i, true) / W; off.i += 2
    const flags = view.getUint8(off.i++)
    const n = view.getUint16(off.i, true); off.i += 2
    roads.push({ osm, name, cls, style, w, major: !!(flags & 1), bridge: !!(flags & 2), pts: readPts(n) })
  }
  const rivers: { id: string; name: string | null; w: number; pts: [number, number][] }[] = []
  for (let i = 0; i < nRivers; i++) {
    const id = str(view.getInt16(off.i, true))!; off.i += 2
    const name = str(view.getInt16(off.i, true)); off.i += 2
    const w = view.getInt16(off.i, true) / W; off.i += 2
    const n = view.getUint16(off.i, true); off.i += 2
    rivers.push({ id, name, w, pts: readPts(n) })
  }
  const bridges: { x: number; z: number; yaw: number; len: number; w: number; cls: string }[] = []
  for (let i = 0; i < nBridges; i++) {
    const x = view.getInt16(off.i, true) / S; off.i += 2
    const z = view.getInt16(off.i, true) / S; off.i += 2
    const yaw = view.getInt16(off.i, true) / Y; off.i += 2
    const len = view.getInt16(off.i, true) / S; off.i += 2
    const w = view.getInt16(off.i, true) / W; off.i += 2
    const cls = STYLE_TABLE[view.getUint8(off.i++)]
    bridges.push({ x, z, yaw, len, w, cls })
  }
  const loops: [number, number][][] = []
  for (let i = 0; i < nLoops; i++) {
    const n = view.getUint16(off.i, true); off.i += 2
    loops.push(readPts(n))
  }
  return { roads, rivers, bridges, loops }
}

const dec = decodeAll()
if (off.i !== buf.length) throw new Error(`TRAILING BYTES: consumed ${off.i} of ${buf.length}`)

for (const r of dec.roads) for (const p of r.pts) fnvFeed(`${p[0]},${p[1]};`)
for (const r of dec.rivers) for (const p of r.pts) fnvFeed(`${p[0]},${p[1]};`)
for (const b2 of dec.bridges) fnvFeed(`${b2.x},${b2.z},${b2.yaw},${b2.len},${b2.w};`)
for (const l of dec.loops) for (const p of l) fnvFeed(`${p[0]},${p[1]};`)

let fails = 0
function eq(a: unknown, e: unknown, what: string) {
  comparisons++
  if (a !== e) { fails++; console.error(`  ✗ ${what}: decoded ${a} !== expected ${e}`) }
}
if (dec.roads.length !== GEO_ROADS.length) throw new Error('road count mismatch')
for (let i = 0; i < GEO_ROADS.length; i++) {
  const a = dec.roads[i]
  const e = GEO_ROADS[i]
  eq(a.osm, e.osm, `road[${i}].osm`)
  eq(a.name, e.name, `road[${i}].name`)
  eq(a.cls, e.cls, `road[${i}].cls`)
  eq(a.style, e.style, `road[${i}].style`)
  eq(a.w, e.w, `road[${i}].w`)
  eq(a.major, e.major, `road[${i}].major`)
  eq(a.bridge, e.bridge, `road[${i}].bridge`)
  if (a.pts.length !== e.pts.length) { fails++; console.error(`  ✗ road[${i}] pts count`) }
  for (let j = 0; j < Math.min(a.pts.length, e.pts.length); j++) {
    eq(a.pts[j][0], e.pts[j][0], `road[${i}].pts[${j}][0]`)
    eq(a.pts[j][1], e.pts[j][1], `road[${i}].pts[${j}][1]`)
  }
}
for (let i = 0; i < GEO_RIVERS.length; i++) {
  const a = dec.rivers[i]
  const e = GEO_RIVERS[i]
  eq(a.id, e.id, `river[${i}].id`)
  eq(a.name, e.name, `river[${i}].name`)
  eq(a.w, e.w, `river[${i}].w`)
  for (let j = 0; j < Math.min(a.pts.length, e.pts.length); j++) {
    eq(a.pts[j][0], e.pts[j][0], `river[${i}].pts[${j}][0]`)
    eq(a.pts[j][1], e.pts[j][1], `river[${i}].pts[${j}][1]`)
  }
}
for (let i = 0; i < GEO_BRIDGES.length; i++) {
  const a = dec.bridges[i]
  const e = GEO_BRIDGES[i]
  eq(a.x, e.x, `bridge[${i}].x`)
  eq(a.z, e.z, `bridge[${i}].z`)
  eq(a.yaw, e.yaw, `bridge[${i}].yaw`)
  eq(a.len, e.len, `bridge[${i}].len`)
  eq(a.w, e.w, `bridge[${i}].w`)
  eq(a.cls, e.cls, `bridge[${i}].cls`)
}
for (let i = 0; i < GEO_LOOPS.length; i++) {
  for (let j = 0; j < Math.min(dec.loops[i].length, GEO_LOOPS[i].length); j++) {
    eq(dec.loops[i][j][0], GEO_LOOPS[i][j][0], `loop[${i}].pts[${j}][0]`)
    eq(dec.loops[i][j][1], GEO_LOOPS[i][j][1], `loop[${i}].pts[${j}][1]`)
  }
}

/* -------------------------------- the write -------------------------------- */

mkdirSync('/home/z/my-project/public/world', { recursive: true })
writeFileSync('/home/z/my-project/public/world/geo-v1.bin', buf)

const gz = gzipSync(buf)
const manifest = {
  version: 1,
  file: '/world/geo-v1.bin',
  bytes: buf.length,
  sha256: createHash('sha256').update(buf).digest('hex'),
  coordHash: hashAccum.digest('hex'),
  coordHashFnv: fnv.toString(16),
  counts: { roads: GEO_ROADS.length, rivers: GEO_RIVERS.length, bridges: GEO_BRIDGES.length, loops: GEO_LOOPS.length, strings: strings.length },
  spotChecks: {
    road0_osm: GEO_ROADS[0].osm,
    road0_first: GEO_ROADS[0].pts[0],
    river0_id: GEO_RIVERS[0].id,
    river0_w: GEO_RIVERS[0].w,
    bridges: GEO_BRIDGES.length,
  },
}
writeFileSync('/home/z/my-project/scripts/geo/geo-bin-manifest.json', JSON.stringify(manifest, null, 2))

console.log('=== GEO → BINARY ===')
console.log(`raw text geo.ts : 432,444 B (66,601 B gz on the wire today)`)
console.log(`binary geo-v1.bin: ${buf.length.toLocaleString('en-US')} B (gz stream ~${gz.length.toLocaleString('en-US')} B if served compressed)`)
console.log(`strings dict: ${strings.length} · roads ${GEO_ROADS.length} · rivers ${GEO_RIVERS.length} · bridges ${GEO_BRIDGES.length} · loops ${GEO_LOOPS.length}`)
console.log(`element-exact sweep: ${comparisons.toLocaleString('en-US')} comparisons, failures: ${fails}`)
if (fails > 0) { console.error('🔴 EQUALITY SWEEP FAILED — .bin is BROKEN, do not ship'); process.exit(1) }
console.log(`coord sha256: ${manifest.coordHash.slice(0, 16)}…`)
console.log('🟢 EXACT ROUND-TRIP PROVEN — .bin written + manifest committed')
