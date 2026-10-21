/**
 * Charlie probe 3: per-district building yield + props/drains census.
 */
import './bootstrap-shim'
async function main() {
  const layout = await import('../../../src/game/world3d/layout')
  const props = await import('../../../src/game/world3d/props')
  const drains = await import('../../../src/game/world3d/drains')
  const L = layout as any
  const P = props as any
  const D = drains as any
  console.log('== per-district BUILDINGS yield ==')
  const byDist: Record<string, number> = {}
  for (const d of L.DISTRICTS) byDist[d.id] = 0
  // rebuild the mapping by re-running the same seeded builder per district
  for (const d of L.DISTRICTS) {
    const b = L.BUILDINGS.filter((x: any) => Math.hypot(x.x - d.x, x.z - d.z) < 40)
    byDist[d.id] = b.length
  }
  const zero = Object.entries(byDist).filter(([, n]) => n === 0)
  console.log(JSON.stringify(byDist))
  console.log(`districts with zero generic buildings: ${zero.length} [${zero.map(([k]) => k).join(', ')}]`)
  console.log('== props census ==')
  const keys = ['AWNINGS','SIGNBOARDS','WALL_SEGMENTS','GATE_LEAVES','LAUNDRY_LINES','UTILITY_POLES','WIRE_SPANS','ROAD_SIGNS','SHELTERS','CRATES','BASKETS','TIRES','BARRELS','WATER_TANKS','ANTENNAS','SHOP_FRONTS']
  for (const k of keys) {
    if (Array.isArray(P[k])) console.log(`  ${k}=${P[k].length}`)
  }
  console.log('== drains census ==')
  try { console.log(`  drainStats=${JSON.stringify(D.drainStats())}`) } catch (e) { console.log(`  drainStats error: ${e}`) }
}
main()
