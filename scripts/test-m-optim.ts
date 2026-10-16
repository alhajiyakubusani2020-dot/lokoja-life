import "./geo/bootstrap"
/**
 * LOKOJA LIFE — SILK II: THE OPTIMIZATION LAWS (pure rule checks, no browser)
 * ---------------------------------------------------------------------------
 * Every optimization in SILK II is a law, and every law can fail here:
 *
 *   SECTION: river grid   — the spatial grid must return EXACTLY the
 *                           brute-force answer (distance, half-width, contact
 *                           point, and the blended heightAt) on a deterministic
 *                           sweep; the contract radius must cover every caller
 *                           cutoff; the candidate law must hold (mean unique
 *                           segments evaluated < 12, the whole point).
 * Run: bun scripts/test-m-optim.ts
 */

import {
  heightAt,
  riverNearest,
  riverQueryStats,
  __silk2BruteHeightAt,
  RIVERS,
  RIVER_Q_RADIUS,
  WALK_BOUND,
  MOUNT_PATTI,
  BRIDGES,
  type RiverDef,
} from '../src/game/world3d/layout'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

/* --------------------------- the brute reference ---------------------------- */

/** linear river nearest — river-major, point order, strict `<`, first wins.
 *  This is the EXACT winner law the pre-grid code had (collision.ts's scan
 *  had no tiebreak, so the first-encountered segment = lowest index wins
 *  every exact float tie). */
function bruteRiverNearest(x: number, z: number): { d: number; halfWidth: number; cx: number; cz: number } {
  let best = Infinity
  let halfWidth = 0
  let bestCx = x
  let bestCz = z
  for (const r of RIVERS as RiverDef[]) {
    for (let i = 0; i < r.points.length - 1; i++) {
      const [ax, az] = r.points[i]
      const [bx, bz] = r.points[i + 1]
      const dx = bx - ax
      const dz = bz - az
      const len2 = dx * dx + dz * dz
      let t = len2 === 0 ? 0 : ((x - ax) * dx + (z - az) * dz) / len2
      t = Math.max(0, Math.min(1, t))
      const px = ax + dx * t
      const pz = az + dz * t
      const d = Math.hypot(x - px, z - pz)
      if (d < best) {
        best = d
        halfWidth = r.width / 2
        bestCx = px
        bestCz = pz
      }
    }
  }
  return { d: best, halfWidth, cx: bestCx, cz: bestCz }
}

/* --------------------------- the deterministic sweep ------------------------ */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const B = WALK_BOUND + 6
const points: Array<[number, number]> = []
// seeded scatter across the whole world (in-city, riverside, bush, rim, Patti)
{
  const rng = mulberry32(0x51c2)
  for (let i = 0; i < 2600; i++) {
    points.push([(rng() * 2 - 1) * B, (rng() * 2 - 1) * B])
  }
}
// every river vertex + bank offsets at meaningful thresholds (inside/outside carve/fade)
for (const r of RIVERS as RiverDef[]) {
  for (let i = 0; i < r.points.length; i += 3) {
    const [x, z] = r.points[i]
    const j = Math.min(i + 1, r.points.length - 1)
    const [nx, nz] = r.points[j]
    const dx = nx - x
    const dz = nz - z
    const len = Math.hypot(dx, dz) || 1
    const ox = -dz / len
    const oz = dx / len
    for (const off of [0, r.width / 2 - 1, r.width / 2 + 1, r.width / 2 + 9, r.width / 2 + 26, r.width / 2 + 26.5]) {
      points.push([x + ox * off, z + oz * off])
    }
  }
}
// bridge decks + approaches (collision reads the nearest contact point)
for (const br of BRIDGES) {
  points.push([br.x, br.z], [br.x + br.length / 2 + 0.5, br.z], [br.x - br.length / 2 - 0.5, br.z])
}
// far-field probes (the ring-expansion law: raw d must be exact far away)
points.push([MOUNT_PATTI.x, MOUNT_PATTI.z], [MOUNT_PATTI.x + 40, MOUNT_PATTI.z - 30])
for (const [sx, sz] of [[-B, -B], [B, -B], [-B, B], [B, B], [0, 0]] as const) {
  points.push([sx, sz], [sx * 0.5, sz * 0.5])
}

/* ------------------------------- THE GRID LAWS ------------------------------ */

console.log('\nSECTION: river grid (SILK II P2)')

// 1) the cutoff catalog — the contract radius must cover every caller.
//    (audited 2026-10-16: heightAt carve 15.25 · inSchoolYard 16 · markings
//    7.45 · grass 17.25 · tree/grass scatter 13 · props/vehicles ≤ 9.75 ·
//    collision 6.47 · terrain moisture fade 32.25 = max)
check('contract radius covers the cutoff catalog (max 32.25u)', RIVER_Q_RADIUS >= 32.25, `radius ${RIVER_Q_RADIUS}`)

// 2) THE EQUALITY LAW — riverNearest must be EXACTLY brute (d, halfWidth, cx, cz)
let eq = 0
let firstBad = ''
for (const [x, z] of points) {
  const g = riverNearest(x, z)
  const b = bruteRiverNearest(x, z)
  if (Object.is(g.d, b.d) && Object.is(g.halfWidth, b.halfWidth) && Object.is(g.cx, b.cx) && Object.is(g.cz, b.cz)) {
    eq++
  } else if (!firstBad) {
    firstBad = `(${x.toFixed(2)},${z.toFixed(2)}) grid d=${g.d} hw=${g.halfWidth} cx=${g.cx} cz=${g.cz} vs brute d=${b.d} hw=${b.halfWidth} cx=${b.cx} cz=${b.cz}`
  }
}
check(`riverNearest === brute on ${points.length} sweep points (exact, ties included)`, eq === points.length, firstBad)

// 3) heightAt equality — the grid path must equal the pre-grid body verbatim
let hEq = 0
let firstHBad = ''
for (const [x, z] of points) {
  const a = heightAt(x, z)
  const b = __silk2BruteHeightAt(x, z)
  if (Object.is(a, b)) hEq++
  else if (!firstHBad) firstHBad = `(${x.toFixed(2)},${z.toFixed(2)}) grid=${a} brute=${b}`
}
check(`heightAt === pre-grid heightAt on ${points.length} points (exact)`, hEq === points.length, firstHBad)

// 4) THE SPEED LAW — mean unique segments evaluated per query must be tiny
let sumEval = 0
let maxEval = 0
for (const [x, z] of points) {
  const { evaluated } = riverQueryStats(x, z)
  sumEval += evaluated
  if (evaluated > maxEval) maxEval = evaluated
}
const meanEval = sumEval / points.length
check(`mean candidates < 12 (the whole point of the grid)`, meanEval < 12, `mean ${meanEval.toFixed(2)}, max ${maxEval}`)
console.log(`    · grid speed: mean ${meanEval.toFixed(2)} segs/query (max ${maxEval}) vs brute ${RIVERS.reduce((n, r) => n + r.points.length - 1, 0)} segs/query`)

// 5) far-field exactness — points 35–75u from any river (ring expansion law)
let farEq = 0
let farN = 0
{
  const rng = mulberry32(0xfa12)
  for (let i = 0; i < 400; i++) {
    const x = (rng() * 2 - 1) * B
    const z = (rng() * 2 - 1) * B
    const b = bruteRiverNearest(x, z)
    if (b.d < 35 || b.d > 75) continue
    farN++
    const g = riverNearest(x, z)
    if (Object.is(g.d, b.d) && Object.is(g.cx, b.cx) && Object.is(g.cz, b.cz)) farEq++
  }
}
check(`far-field (35-75u) exact on ${farN} probes (ring expansion)`, farN > 100 && farEq === farN, `${farEq}/${farN}`)

// 6) determinism — the same query twice answers byte-identically
{
  const [x, z] = points[77]
  const a = riverNearest(x, z)
  const b = riverNearest(x, z)
  check('query is deterministic (same input, same answer, twice)', Object.is(a.d, b.d) && Object.is(a.cx, b.cx) && Object.is(a.cz, b.cz))
}

/* ---------------------------------- verdict ---------------------------------- */

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
