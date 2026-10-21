/**
 * Charlie probe 2: the 4 negative-center-roadGap buildings + stall survival
 * + corner-law pass rate + school-yard/river overlap + traffic loop usage.
 */
import './bootstrap-shim'
async function main() {
  const layout = await import('../../../src/game/world3d/layout')
  const L = layout as any
  console.log('== NEGATIVE center roadGap buildings ==')
  for (const b of L.BUILDINGS) {
    const gap = L.roadGap(b.x, b.z)
    if (gap < 0) {
      const inCivic = L.inCivicCampus(b.x, b.z)
      const cornerOk = L.buildingClearOfRoad(b.x, b.z, b.w, b.d)
      console.log(`  kind=${b.kind} tag=${b.tag ?? '-'} pos=(${b.x.toFixed(1)},${b.z.toFixed(1)}) centerGap=${gap.toFixed(2)} inCivicCampus=${inCivic} cornerLawPass=${cornerOk}`)
    }
  }
  console.log('== corner law audit over all BUILDINGS ==')
  let fail = 0
  for (const b of L.BUILDINGS) if (!L.buildingClearOfRoad(b.x, b.z, b.w, b.d)) fail++
  console.log(`buildings failing buildingClearOfRoad=${fail}/${L.BUILDINGS.length}`)

  console.log('== STALL rows survival ==')
  // re-run the row math to show per-row survival
  const rows = [
    { id: 'kpata-market', n: 14 },
    { id: 'food-area', n: 10 },
    { id: 'ganaja-junction', n: 8 },
  ]
  for (const row of rows) {
    const a = L.ANCHOR_BY_ID[row.id]
    let ok = 0
    for (let i = 0; i < row.n; i++) {
      const gx = (i % 4) - 1.5
      const gz = Math.floor(i / 4) - 1
      const rot = row.id === 'kpata-market' ? 0.35 : row.id === 'food-area' ? -0.5 : 1.1
      const x = a.x + Math.cos(rot) * (gx * 4.6) - Math.sin(rot) * (gz * 5.4)
      const z = a.z + Math.sin(rot) * (gx * 4.6) + Math.cos(rot) * (gz * 5.4)
      if (L.roadGap(x, z) >= 0.45) ok++
    }
    console.log(`  ${row.id}: ${ok}/${row.n} candidates pass roadGap>=0.45`)
  }
  console.log(`actual STALLS=${L.STALLS.length} at ${L.STALLS.map((s: any) => `(${s.x.toFixed(0)},${s.z.toFixed(0)})`).join(' ')}`)

  console.log('== school yards vs rivers (collision exemption sanity) ==')
  let worst = 0
  for (const s of L.SCHOOL_SITES) {
    // sample the yard at plateauR*0.9 (inside inSchoolYard radius plateauR*0.92)
    const r = s.plateauR * 0.9
    for (let k = 0; k < 16; k++) {
      const ang = (k / 16) * Math.PI * 2
      const x = s.x + Math.cos(ang) * r
      const z = s.z + Math.sin(ang) * r
      const h = L.heightAt(x, z)
      if (h <= L.WATER_Y) worst++
    }
  }
  console.log(`school-yard samples under water: ${worst} (0 = no walk-into-water hole via the school exemption)`)

  console.log('== confluence identity ==')
  console.log(`RIVERS[1] name=${L.RIVERS[1].name} lastPt=${JSON.stringify(L.RIVERS[1].points[L.RIVERS[1].points.length - 1])} CONFLUENCE_POINT=${JSON.stringify(L.CONFLUENCE_POINT)}`)
  console.log(`RIVERS[0] name=${L.RIVERS[0].name} lenPts=${L.RIVERS[0].points.length}`)
}
main()
