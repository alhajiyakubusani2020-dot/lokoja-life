import { initGeoWith } from '/home/z/my-project/src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('/home/z/my-project/public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
const mod = await import('/home/z/my-project/src/game/world3d/roads')
const keys = Object.keys(mod).filter(k => /PARK/i.test(k))
for (const k of keys) { const v = (mod as any)[k]; console.log(k, Array.isArray(v) ? v.length : typeof v) }
