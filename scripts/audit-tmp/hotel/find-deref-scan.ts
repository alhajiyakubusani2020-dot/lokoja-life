// TEAM HOTEL — .find() dereference crash-candidate scan
// heuristic: `const X = <expr>.find(...)` where within the next 8 lines X.prop is
// accessed WITHOUT an `if (X)` / `if (!X)` / `X ??` / `X &&` / optional chain on first use.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.(tsx?|ts)$/.test(e) && !/\.test\.|\.e2e\./.test(e)) out.push(p)
  }
  return out
}

const files = walk('/home/z/my-project/src')
let candidates = 0
const samples: string[] = []
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n')
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*.*\.find\s*\(/)
    if (!m) continue
    const v = m[1]
    // find first use of v in next 8 lines
    for (let j = i + 1; j < Math.min(i + 9, lines.length); j++) {
      const use = lines[j]
      if (!use.includes(v)) continue
      const guarded = new RegExp(`(if\\s*\\(!?${v}\\b|${v}\\s*\\?\\?|${v}\\s*&&|if\\s*\\(${v}\\b)`).test(use) || /\?\./.test(use.split(v)[1] ?? '')
      const deref = new RegExp(`${v}\\s*\\.\\s*[\\w$]+`).test(use) || new RegExp(`${v}\\[`).test(use)
      if (deref && !guarded) {
        candidates++
        if (samples.length < 12) samples.push(`${f}:${j + 1}  [var=${v} @${i + 1}]  ${use.trim().slice(0, 110)}`)
      }
      break
    }
  }
}
console.log('files scanned:', files.length)
console.log('CRASH CANDIDATES (unguarded deref within 8 lines of .find assignment):', candidates)
for (const s of samples) console.log('  ', s)
