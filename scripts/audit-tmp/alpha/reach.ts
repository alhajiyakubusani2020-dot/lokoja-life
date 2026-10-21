// Reachability from app entry points (src/app/**, layout.tsx, page.tsx) over static+dynamic imports
import { readFileSync, statSync, readdirSync } from 'node:fs';
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
const all = walk(join(ROOT, 'src')).concat(walk(join(ROOT, 'mini-services')));
const resolve = (from: string, spec: string): string => {
  let base = '';
  if (spec.startsWith('.')) base = join(from, '..', spec);
  else if (spec.startsWith('@/')) base = join(ROOT, 'src', spec.slice(2));
  else return '';
  for (const c of [base + '.ts', base + '.tsx', base + '/index.ts', base]) { try { statSync(c); return c; } catch {} }
  return '';
};
const graph: Record<string, string[]> = {};
for (const f of all) {
  const src = readFileSync(f, 'utf8');
  const re = /(?:from\s+['"]([^'"]+)['"])|(?:import\s*\(\s*['"]([^'"]+)['"]\s*\))|(?:require\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
  const outs: string[] = []; let m;
  while ((m = re.exec(src))) { const spec = m[1] || m[2] || m[3]; if (!spec) continue; const r = resolve(f, spec); if (r) outs.push(r); }
  graph[f] = outs;
}
const entries = all.filter(f => f.startsWith(join(ROOT, 'src/app')));
const seen = new Set<string>();
const stack = [...entries];
while (stack.length) { const f = stack.pop()!; if (seen.has(f)) continue; seen.add(f); for (const o of graph[f] || []) if (!seen.has(o)) stack.push(o); }
const sysDir = join(ROOT, 'src/game/systems');
const unreachable = readdirSync(sysDir).filter(f => f.endsWith('.ts') && !seen.has(join(sysDir, f)));
console.log('ENTRY POINTS:', entries.length);
console.log('REACHABLE TOTAL (from src/app):', seen.size);
console.log('UNREACHABLE systems (not reachable from src/app, static+dynamic):');
unreachable.forEach(u => console.log('  ' + u.replace(ROOT + '/', '')));
console.log('UNREACHABLE COUNT:', unreachable.length);
// who imports each unreachable system (maybe scripts only)
for (const u of unreachable) {
  const name = u.split('/').pop()!;
  const importers = all.filter(f => graph[f]?.includes(u) && f !== u);
  console.log(`  ${name} <- static importers in src:`, importers.map(i => i.replace(ROOT + '/', '')).join(', ') || 'NONE');
}
