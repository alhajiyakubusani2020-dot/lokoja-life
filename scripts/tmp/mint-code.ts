import { encodeTeleport } from '/home/z/my-project/src/game/systems/teleport'
const enc = encodeTeleport({ v: 1, day: 41, locId: 'kpata-market', name: 'Ada', level: 6, rep: 38, earned: 4300, moves: 9, trail: [1, 2, 0] })
if (!enc.ok) { console.error(enc.why); process.exit(1) }
console.log(enc.code)
console.log('url:', enc.url, '| bytes:', enc.bytes, '| code len:', enc.code.length)
