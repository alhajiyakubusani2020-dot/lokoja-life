import { ANCHORS, BRIDGES } from '../../src/game/world3d/layout'
import { LOCATIONS } from '../../src/game/data/locations'
import { walkingEnergyCost } from '../../src/game/systems/world3d'
import { WORLD3D } from '../../src/game/data/config'
const home = ANCHORS.find((a) => a.id === 'home')!
const rows = LOCATIONS.filter((l) => l.unlockLevel === 1 && l.transport.includes('walk')).map((l) => {
  const a = ANCHORS.find((x) => x.id === l.id)
  if (!a) return null
  const tripU = Math.hypot(a.x - home.x, a.z - home.z)
  const tripM = tripU * 26
  let bd = Infinity, bi = -1
  BRIDGES.forEach((b, i) => { const d = Math.hypot(b.x - a.x, b.z - a.z); if (d < bd) { bd = d; bi = i } })
  return { id: l.id, tripU: Math.round(tripU), tripM: Math.round(tripM), walkEnergy: walkingEnergyCost(tripM), free: WORLD3D.freeMeters, bridge: bi, bridgeU: Math.round(bd) }
}).filter(Boolean) as { id: string; tripU: number; tripM: number; walkEnergy: number; free: number; bridge: number; bridgeU: number }[]
rows.sort((a, b) => (a.bridgeU) - (b.bridgeU))
console.log('free allowance:', WORLD3D.freeMeters, 'm')
for (const r of rows) console.log(`${r.id.padEnd(20)} trip ${r.tripU}u (${r.tripM}m, energy ${r.walkEnergy})  bridge#${r.bridge} ${r.bridgeU}u`)
