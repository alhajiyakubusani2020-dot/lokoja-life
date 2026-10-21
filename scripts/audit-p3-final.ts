import { initGeoWith } from '/home/z/my-project/src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
const L: any = await import('/home/z/my-project/src/game/world3d/layout')
console.log(JSON.stringify({
  PARKED_VEHICLES: Array.isArray(L.PARKED_VEHICLES) ? L.PARKED_VEHICLES.length : 'n/a',
  PATTI_TRAIL: Array.isArray(L.PATTI_TRAIL) ? L.PATTI_TRAIL.length : 'n/a',
  ROAD_RIBBONS: Array.isArray(L.ROADS) ? L.ROADS.length : (Array.isArray(L.ROAD_RIBBONS) ? L.ROAD_RIBBONS.length : 'n/a'),
}, null, 1))
