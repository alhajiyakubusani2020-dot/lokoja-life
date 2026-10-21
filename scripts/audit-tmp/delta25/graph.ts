/**
 * TEAM DELTA (Task 5-d) — IMPORT-GRAPH TRUTH for the menu first-load entry.
 *
 * Computes the STATIC import closure of src/app/page.tsx (the "/" route):
 * every src/** module Turbopack must ship in the menu's first-load JS
 * because it is reachable WITHOUT crossing a dynamic import() boundary.
 * Dynamic import() edges are recorded as CUTS (they leave the first load).
 *
 * Run: bun scripts/audit-tmp/delta25/graph.ts
 * Output: table (module, LOC, first importer, depth) + cut-edge summary +
 *         node_modules packages on the static closure.
 */

import { readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dir, '../../..')
const SRC = join(ROOT, 'src')

/** resolve a specifier to a repo file (or null if external/non-file) */
function resolveSpec(spec: string, fromFile: string): string | null {
  let base: string | null = null
  if (spec.startsWith('@/')) base = join(SRC, spec.slice(2))
  else if (spec.startsWith('.')) base = resolve(dirname(fromFile), spec)
  else return null // node_modules external
  for (const cand of [
    base,
    base + '.ts',
    base + '.tsx',
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ]) {
    try {
      if (statSync(cand).isFile()) return cand
    } catch {
      /* try next */
    }
  }
  return null
}

const STATIC_RE =
  /(?:^|\n)\s*(?:import\s+(?:type\s+)?[\s\S]*?|export\s+(?:type\s+)?[\s\S]*?)?\s*from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g

/** static import specifiers of a file (type-only imports INCLUDED — they
 * are erased at build, so we mark them separately to keep the table honest) */
function staticImports(file: string): Array<{ spec: string; typeOnly: boolean }> {
  const src = readFileSync(file, 'utf8')
  const out: Array<{ spec: string; typeOnly: boolean }> = []
  // single-pass: catch "import ... from 'x'", "export ... from 'x'", bare "import 'x'"
  const re =
    /\b(import|export)\b([\s\S]*?)?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const clause = m[2] ?? ''
    const spec = m[3] ?? m[4]
    if (!spec) continue
    // type-only if the clause starts with `type ` after import/export keyword
    const typeOnly = /^\s*type\s/.test(clause)
    out.push({ spec, typeOnly })
  }
  return out
}

const loc = (file: string) => readFileSync(file, 'utf8').split('\n').length

interface Node {
  file: string
  loc: number
  depth: number
  via: string
  typeOnlyVia: boolean
}

const entry = join(SRC, 'app/page.tsx')
const seen = new Map<string, Node>()
const cuts = new Set<string>() // dynamic-import targets (resolved)
const externals = new Map<string, Set<string>>() // pkg -> importer files
const typeOnlyErased = new Set<string>() // reached ONLY via type imports (erased)
const queue: Array<{ file: string; depth: number; via: string; typeOnly: boolean }> = [
  { file: entry, depth: 0, via: '(entry)', typeOnly: false },
]

while (queue.length) {
  const { file, depth, via, typeOnly } = queue.shift()!
  if (seen.has(file)) {
    // if previously reached only via a type import and now via a value
    // import, promote it (value imports actually ship)
    if (seen.get(file)!.typeOnlyVia && !typeOnly) seen.get(file)!.typeOnlyVia = false
    continue
  }
  seen.set(file, { file, loc: loc(file), depth, via, typeOnlyVia: typeOnly })
  if (!typeOnly) typeOnlyErased.delete(file)
  else typeOnlyErased.add(file)

  for (const imp of staticImports(file)) {
    if (imp.typeOnly) {
      const r = resolveSpec(imp.spec, file)
      if (r) queue.push({ file: r, depth: depth + 1, via: file, typeOnly: true })
      else externals.set(imp.spec, (externals.get(imp.spec) ?? new Set()).add(file))
      continue
    }
    const r = resolveSpec(imp.spec, file)
    if (r) {
      queue.push({ file: r, depth: depth + 1, via: file, typeOnly: false })
    } else {
      const pkg = imp.spec.startsWith('@/')
        ? imp.spec
        : imp.spec.startsWith('.')
          ? `UNRESOLVED:${imp.spec}`
          : imp.spec.replace(/^([^@][^/]*)\/.*$/, '$1').replace(/^(@[^/]+\/[^/]+).*$/, '$1')
      const key = imp.spec.startsWith('.') || imp.spec.startsWith('@/')
        ? imp.spec
        : imp.spec.startsWith('@')
          ? imp.spec.split('/').slice(0, 2).join('/')
          : imp.spec.split('/')[0]
      externals.set(key, (externals.get(key) ?? new Set()).add(file))
      void pkg
    }
  }

  // record dynamic import() edges as CUTS (do NOT walk)
  const dsrc = readFileSync(file, 'utf8')
  const dre = /import\(\s*['"]([^'"]+)['"]\s*\)/g
  let dm: RegExpExecArray | null
  while ((dm = dre.exec(dsrc))) {
    const r = resolveSpec(dm[1], file)
    cuts.add(r ? `${r.replace(ROOT + '/', '')}  ←dynamic  ${file.replace(ROOT + '/', '')}` : `${dm[1]} (unresolved) ← ${file.replace(ROOT + '/', '')}`)
  }
}

const rows = [...seen.values()].sort((a, b) => b.loc - a.loc)
const rel = (f: string) => f.replace(ROOT + '/', '')
const totalLoc = rows.reduce((s, r) => s + r.loc, 0)
const valueLoc = rows.filter((r) => !r.typeOnlyVia).reduce((s, r) => s + r.loc, 0)

console.log('=== STATIC FIRST-LOAD CLOSURE of src/app/page.tsx (menu entry) ===')
console.log(`modules reached: ${rows.length}  (value-graph: ${rows.filter((r) => !r.typeOnlyVia).length})`)
console.log(`src LOC on static closure: ${totalLoc}  (value-graph: ${valueLoc})`)
console.log('')
console.log('LOC  depth  type-only?  module   [first importer]')
for (const r of rows) {
  console.log(
    `${String(r.loc).padStart(5)}  ${String(r.depth).padStart(5)}  ${r.typeOnlyVia ? 'TYPEONLY' : 'value   '}  ${rel(r.file).padEnd(62)} ← ${rel(r.via)}`,
  )
}

console.log('')
console.log('=== DYNAMIC CUTS (left the first load) ===')
for (const c of [...cuts].sort()) console.log('  ' + c)

console.log('')
console.log('=== node_modules packages on the STATIC closure ===')
for (const [pkg, importers] of [...externals.entries()].sort()) {
  console.log(`  ${pkg.padEnd(28)} imported by ${importers.size} file(s): ${[...importers].map(rel).join(', ')}`)
}

/* the markers the mission cares about, as sanity facts */
const interesting = ['useGameStore', 'data/schools', 'data/config', 'data/locations', 'data/npcChat', 'systems/wire', 'walletnet']
console.log('')
console.log('=== MISSION MARKERS on the static closure ===')
for (const marker of interesting) {
  const hits = rows.filter((r) => r.file.includes(marker) && !r.typeOnlyVia)
  console.log(`  ${marker.padEnd(20)} ${hits.length ? 'IN FIRST LOAD: ' + hits.map((h) => `${rel(h.file)} (${h.loc}L)`).join(', ') : 'not on value closure'}`)
}
