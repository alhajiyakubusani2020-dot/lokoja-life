import { BUILDINGS, ANCHOR_BY_ID } from '../../src/game/world3d/layout'
console.log('buildings total:', BUILDINGS.length)
console.log('tagged:', BUILDINGS.filter((b) => (b as { tag?: string }).tag).length)
const gov = ANCHOR_BY_ID['government-area']
console.log('gov anchor:', gov)
console.log('blocks near gov:', BUILDINGS.filter((b) => b.kind === 'block' && Math.hypot(b.x - gov.x, b.z - gov.z) < 40).length)
