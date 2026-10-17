import '../scripts/geo/bootstrap'
import { FLORA_TREES } from '../src/game/world3d/flora'
import { ANCHOR_BY_ID } from '../src/game/world3d/layout'

const home = ANCHOR_BY_ID['home']
const all: { sp: string; x: number; z: number; d: number }[] = []
for (const sp of Object.keys(FLORA_TREES) as (keyof typeof FLORA_TREES)[]) {
  for (const t of FLORA_TREES[sp]) {
    all.push({ sp, x: t.x, z: t.z, d: Math.hypot(t.x - home.x, t.z - home.z) })
  }
}
all.sort((a, b) => a.d - b.d)
console.log('home anchor at', home.x.toFixed(1), home.z.toFixed(1))
console.log('nearest 14 trees to home:')
for (const t of all.slice(0, 14)) console.log(`  ${t.sp.padEnd(8)} d=${t.d.toFixed(1)}u @ (${t.x.toFixed(1)}, ${t.z.toFixed(1)})`)
console.log('aim coords:')
for (const sp of ['iroko', 'baobab', 'raffia', 'oilpalm', 'plantain', 'cashew'] as const) {
  const l = (FLORA_TREES as Record<string, { x: number; z: number }[]>)[sp] ?? []
  console.log(' ', sp, l.slice(0, 3).map((t) => `(${t.x.toFixed(1)},${t.z.toFixed(1)})`).join(' '))
}
const rings = [15, 30, 60, 120]
for (const r of rings) console.log(`trees within ${r}u of home:`, all.filter((t) => t.d < r).length)
