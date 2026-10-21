import { initGeoWith } from '/home/z/my-project/src/game/world3d/geo'
import { readFileSync } from 'node:fs'
const bin = readFileSync('/home/z/my-project/public/world/geo-v1.bin')
initGeoWith(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength))
const L: any = await import('/home/z/my-project/src/game/world3d/layout')
const keys = Object.keys(L).filter(k => /PARK|TRAIL|PATTI/i.test(k))
const out: Record<string, number> = {}
for (const k of keys) { const v = (L as any)[k]; if (Array.isArray(v)) out[k] = v.length }
console.log(JSON.stringify(out))
