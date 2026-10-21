// Alpha cross-reference: for each src/game/systems file, who imports it anywhere in src/ + mini-services?
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = '/home/z/my-project';
function walk(dir: string, acc: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) { if (!/node_modules|\.next|\.git|download|research/.test(p)) walk(p, acc); }
    else if (/\.(ts|tsx)$/.test(f)) acc.push(p);
  }
  return acc;
}
const files = walk(join(ROOT, 'src')).concat(walk(join(ROOT, 'mini-services')));
const sysDir = join(ROOT, 'src/game/systems');
const systems = readdirSync(sysDir).filter(f => f.endsWith('.ts'));
const importGraph: Record<string, string[]> = {};
for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const re = /(?:from\s+['"]([^'"]+)['"])|(?:import\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
  let m;
  const outs: string[] = [];
  while ((m = re.exec(src))) {
    const spec = m[1] || m[2];
    if (!spec) continue;
    let resolved = '';
    if (spec.startsWith('.')) {
      const base = join(f, '..', spec);
      for (const cand of [base + '.ts', base + '.tsx', base + '/index.ts', base]) {
        try { statSync(cand); resolved = cand; break; } catch {}
      }
    } else if (spec.startsWith('@/')) {
      const base = join(ROOT, 'src', spec.slice(2));
      for (const cand of [base + '.ts', base + '.tsx', base + '/index.ts']) {
        try { statSync(cand); resolved = cand; break; } catch {}
      }
    }
    if (resolved) outs.push(resolved);
  }
  importGraph[f] = outs;
}
const dead: string[] = [];
const live: Array<[string, number]> = [];
for (const sys of systems) {
  const full = join(sysDir, sys);
  let importers: string[] = [];
  for (const [f, outs] of Object.entries(importGraph)) {
    if (f === full) continue;
    if (outs.includes(full)) importers.push(f);
  }
  const dyn = importers.filter(i => readFileSync(i, 'utf8').match(new RegExp(`import\\s*\\(\\s*['"][^'"]*${sys.replace('.ts','')}['"]`)));
  if (importers.length === 0) dead.push(sys); else live.push([sys, importers.length]);
}
console.log('DEAD (0 importers):', JSON.stringify(dead, null, 1));
console.log('DEAD COUNT:', dead.length);
console.log('LIVE COUNT:', live.length);
console.log('MOST-IMPORTED SYSTEMS:');
live.sort((a,b)=>b[1]-a[1]).slice(0,10).forEach(([f,n])=>console.log(`  ${n}\t${f}`));
