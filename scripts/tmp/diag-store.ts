// drive the REAL store outside React — rest must advance days and save
const mem = new Map<string, string>()
;(globalThis as any).window = {
  localStorage: {
    setItem: (k: string, v: string) => void mem.set(k, v),
    getItem: (k: string) => mem.get(k) ?? null,
    removeItem: (k: string) => void mem.delete(k),
  },
  dispatchEvent: () => {},
  AudioContext: class {},
}
const { useGameStore } = await import('../../src/game/store/useGameStore')
const s = useGameStore.getState()
s.boot()
s.startNewGame('Tester', 'female', {} as never)
console.log('day after start:', useGameStore.getState().world?.day)
s.rest('sleep')
console.log('day after rest#1:', useGameStore.getState().world?.day)
s.rest('sleep')
console.log('day after rest#2:', useGameStore.getState().world?.day)
await new Promise((r) => setTimeout(r, 1600))
const save = JSON.parse(mem.get('lokoja-life:save') ?? '{}')
console.log('save day:', save.world?.day, '| civic owed:', save.civic?.nepa?.owed, '| market rolled:', save.civic?.market?.rolledDay)
// now push to day 6 — the NEPA bill must post
for (let i = 0; i < 4; i++) s.rest('sleep')
console.log('day after 4 more:', useGameStore.getState().world?.day)
console.log('nepa owed in store:', useGameStore.getState().civic?.nepa.owed)
await new Promise((r) => setTimeout(r, 1600))
const save2 = JSON.parse(mem.get('lokoja-life:save') ?? '{}')
console.log('save day final:', save2.world?.day, '| save owed:', save2.civic?.nepa?.owed)

export {}
