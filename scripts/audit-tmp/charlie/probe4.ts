/**
 * Charlie probe 4: 2D map (geo-map.ts polylines) vs location pins.
 * Each location pin (mapX,mapY 0-100 grid) should lie near a 2D map road/rivers polyline
 * (the same OSM projection the 3D world uses). Measure nearest-vertex distance.
 */
import './bootstrap-shim'
async function main() {
  const gm: any = await import('../../../src/components/game/geo-map')
  const locMod = await import('../../../src/game/data/locations')
  const layout = await import('../../../src/game/world3d/layout')

  const paths: { x: number; y: number }[][] = []
  for (const key of ['GEO_MAP_TRUNK', 'GEO_MAP_MAIN', 'GEO_MAP_MINOR', 'GEO_MAP_RIVERS', 'GEO_MAP_WATER']) {
    for (const d of (gm as any)[key] ?? []) {
      const pts: { x: number; y: number }[] = []
      const re = /([-\d.]+) ([-\d.]+)/g
      let m: RegExpExecArray | null
      while ((m = re.exec(d))) pts.push({ x: parseFloat(m[1]), y: parseFloat(m[2]) })
      if (pts.length) paths.push(pts)
    }
  }
  let vtx = 0
  for (const p of paths) vtx += p.length
  console.log(`2D map: paths=${paths.length} vertices=${vtx}`)

  const near = (x: number, y: number): number => {
    let best = Infinity
    for (const p of paths) {
      for (const q of p) {
        const d = Math.hypot(q.x - x, q.y - y)
        if (d < best) best = d
      }
    }
    return best
  }
  console.log('== pin-to-nearest-2D-map-vertex distance (grid units; 1u=6.2 map grid? no: map grid 0-100) ==')
  let worst = 0, worstId = ''
  for (const l of locMod.LOCATIONS) {
    const d = near(l.mapX, l.mapY)
    if (d > worst) { worst = d; worstId = l.id }
    console.log(`  ${l.id}: pin=(${l.mapX},${l.mapY}) nearest2D=${d.toFixed(2)} grid-units`)
  }
  console.log(`worst=${worstId} @${worst.toFixed(2)} grid-units (a 100-grid unit = 310u world = 8.06 km, so 1 grid unit ≈ 80.6 m)`)

  // 3D side: nearest road distance per anchor (world units)
  const L = layout as any
  console.log('== anchor-to-nearest-3D-road distance (world units) ==')
  for (const a of L.ANCHORS) {
    const d = L.roadDistance(a.x, a.z)
    if (d > 6) console.log(`  FAR: ${a.id} roadDistance=${d.toFixed(1)}u`)
  }
  console.log('done (only anchors >6u from any road centreline listed)')
}
main()
