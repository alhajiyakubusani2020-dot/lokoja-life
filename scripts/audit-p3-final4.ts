import { initGeoWith } from '/home/z/my-project/src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('/home/z/my-project/public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
const v: any = await import('/home/z/my-project/src/game/world3d/vehicles')
console.log('PARKED_VEHICLES:', Array.isArray(v.PARKED_VEHICLES) ? v.PARKED_VEHICLES.length : typeof v.PARKED_VEHICLES)
const j: any = await import('/home/z/my-project/src/game/world3d/junctions')
console.log('TRANSIT bays:', Array.isArray(j.DANFO_STOPS) ? j.DANFO_STOPS.length : '?')
