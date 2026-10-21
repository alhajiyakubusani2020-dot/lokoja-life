/**
 * CHARLIE PH2.5 — public-API surface extractor for useGameStore.
 * Usage: bun scripts/audit-tmp/charlie25/api-surface.ts <file...> > out.json
 * Pulls: every named export (values + types) and every member key of every
 * interface/type-alias reachable via the "GameStore" composition chain.
 * Purely syntactic (ts.createSourceFile) — no type-checker needed, so it runs
 * identically BEFORE (monolith) and AFTER (slices + composition) the refactor.
 */
import * as ts from 'typescript'
import * as fs from 'node:fs'
import * as path from 'node:path'

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('usage: api-surface.ts <file...>')
  process.exit(2)
}

const ROOT = '/home/z/my-project'

// ---- resolution: follow relative imports so we see the whole composed surface ----
function resolveImport(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null // external — no member extraction
  const base = path.resolve(path.dirname(fromFile), spec)
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`]
  for (const c of candidates) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c
  return null
}

const memberKeys = new Set<string>() // interface member keys (state + actions)
const namedExports = new Set<string>() // named exports of the whole reachable graph
const moduleExports = new Set<string>() // named exports of the ENTRY file only (files[0])
const seen = new Set<string>()
const ENTRY = path.resolve(ROOT, files[0])
let sliceInterfaces: string[] = [] // names like GameStore / PlayerSlice...

// interfaces/types whose members we harvest (GameStore itself + slice compositions)
const harvest = new Set<string>()

function interfaceMemberKeys(node: ts.Node): void {
  if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
    if (!harvest.has(node.name.text)) return
    // walk the type node for member lists (interfaces) and intersections
    if (ts.isInterfaceDeclaration(node)) {
      for (const m of node.members) {
        const name = m.name
        if (!name) continue
        memberKeys.add(name.getText())
      }
    } else if (ts.isTypeAliasDeclaration(node) && node.type) {
      const t = node.type
      if (ts.isTypeIntersectionNode(t)) {
        for (const part of t.types) {
          if (ts.isTypeReferenceNode(part)) sliceInterfaces.push(part.typeName.getText())
        }
      } else if (ts.isTypeLiteralNode(t)) {
        for (const m of t.members) if (m.name) memberKeys.add(m.name.getText())
      }
    }
  }
}

function visit(file: string, sf: ts.SourceFile): void {
  if (seen.has(file)) return
  seen.add(file)
  const isEntry = file === ENTRY
  const grab = (name: string): void => {
    namedExports.add(name)
    if (isEntry) moduleExports.add(name)
  }
  sf.statements.forEach((st) => {
    interfaceMemberKeys(st)
    if (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) {
      const nm = st.name.text
      if (nm === 'GameStore' || /Slice$/.test(nm)) harvest.add(nm)
    }
    if (ts.isExportDeclaration(st) && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const el of st.exportClause.elements) grab(el.name.text)
    }
    if (ts.isImportDeclaration(st)) {
      const res = resolveImport(file, (st.moduleSpecifier as ts.StringLiteral).text)
      if (res) queue.push(res)
    }
    // inline export const X = ... / export type X = ...
    if (ts.canHaveModifiers(st)) {
      const mods = ts.getModifiers(st) ?? []
      const isExport = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      if (isExport) {
        if (ts.isVariableStatement(st)) {
          for (const d of st.declarationList.declarations) {
            if (ts.isIdentifier(d.name)) grab(d.name.text)
          }
        } else if (ts.isFunctionDeclaration(st) && st.name) grab(st.name.text)
        else if (ts.isClassDeclaration(st) && st.name) grab(st.name.text)
        else if (ts.isTypeAliasDeclaration(st)) {
          grab(st.name.text)
          // harvest slice interface members referenced by a GameStore alias is done above
        }
      }
    }
    if (ts.isExportDeclaration(st) && st.exportClause && ts.isNamespaceExport(st.exportClause)) {
      grab(st.exportClause.name.text)
    }
  })
}

const queue = files.map((f) => path.resolve(ROOT, f))
for (const f of files) {
  // seed harvest: any name ending Slice or equal GameStore counts as entry point
  const text = fs.readFileSync(path.resolve(ROOT, f), 'utf8')
  for (const m of text.matchAll(/interface (GameStore|\w+Slice)\b|type (GameStore|\w+Slice) =/g)) {
    harvest.add(m[1] ?? m[2]!)
  }
}
while (queue.length) {
  const f = queue.shift()!
  if (seen.has(f)) continue
  const text = fs.readFileSync(f, 'utf8')
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true)
  visit(f, sf)
}

const out = {
  files: files.map((f) => path.relative(ROOT, f)),
  harvestInterfaces: [...harvest].sort(),
  memberKeys: [...memberKeys].sort(),
  memberCount: memberKeys.size,
  moduleExports: [...moduleExports].sort(),
  moduleExportCount: moduleExports.size,
  graphExports: [...namedExports].sort(),
  graphExportCount: namedExports.size,
}
console.log(JSON.stringify(out, null, 2))
