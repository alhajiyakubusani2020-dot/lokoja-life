import { initGeoWith } from '/home/z/my-project/src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('/home/z/my-project/public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
const L: any = await import('/home/z/my-project/src/game/world3d/layout')
console.log('DISTRICTS:', Array.isArray(L.DISTRICTS) ? L.DISTRICTS.length : '?')
console.log('district ids:', (L.DISTRICTS || []).map((d: any) => d.id).join(','))
