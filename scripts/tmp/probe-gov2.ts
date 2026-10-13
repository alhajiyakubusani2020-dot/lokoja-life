import { BUILDINGS, ANCHOR_BY_ID, WALK_BOUND } from '../../src/game/world3d/layout'
const gov = ANCHOR_BY_ID['government-area']
console.log('WALK_BOUND:', WALK_BOUND, '| gov |x,z|:', Math.hypot(gov.x, gov.z).toFixed(1))
const byDistrict: Record<string, number> = {}
for (const a of ['home','kpata-market','ganaja-junction','confluence','mount-patti','historic-lokoja','government-area','university-area','food-area','transport-area']) {
  const n = BUILDINGS.filter((b) => Math.hypot(b.x - ANCHOR_BY_ID[a].x, b.z - ANCHOR_BY_ID[a].z) < 45).length
  byDistrict[a] = n
}
console.log(byDistrict)
