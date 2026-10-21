/* TEAM HOTEL (QA) — crafted-save round-trip tests against src/game/systems/save.ts
 * AUDIT ONLY — writes nothing outside this temp dir / in-memory shim.
 */
// ---- window/localStorage shim (save.ts uses window.localStorage) ----
const mem = new Map<string, string>()
let failNextSet = false
const ls = {
  getItem: (k: string) => (mem.has(k) ? (mem.get(k) as string) : null),
  setItem: (k: string, v: string) => {
    if (failNextSet) throw new Error('QuotaExceededError: DOM Exception 22')
    mem.set(k, String(v))
  },
  removeItem: (k: string) => {
    mem.delete(k)
  },
  clear: () => mem.clear(),
  key: (i: number) => Array.from(mem.keys())[i] ?? null,
  get length() {
    return mem.size
  },
}
;(globalThis as any).window = { localStorage: ls }
;(globalThis as any).localStorage = ls

// @ts-ignore - direct import of the real production module
import { SaveSystem } from '../../../src/game/systems/save'

const KEY = 'a'.repeat(32)
SaveSystem.setFortKey(KEY)

function minimalSave(over: any = {}): any {
  return {
    version: 20,
    createdAt: 1,
    updatedAt: 1,
    player: {
      name: 'Test', cash: 5000, bankBalance: 0, skillXp: { hustle: 0, smart: 0, social: 0 },
      activeOpportunities: [], cooldowns: {}, transactions: [],
      stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 },
      vehicles: [], relationships: {}, businesses: [], ageBand: 'adult',
    },
    world: { day: 3, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
    settings: { sound: true, graphics: 'auto', chill: false, elder: false, music: false, haptics: true },
    ...over,
  }
}

function show(label: string, out: any) {
  console.log(`\n== ${label} ==`)
  console.log(JSON.stringify(out))
}

// 0) NaN/Infinity serialization behavior
show('JSON.stringify NaN/Infinity', { nan: JSON.stringify({ v: NaN }), inf: JSON.stringify({ v: Infinity }), negInf: JSON.stringify({ v: -Infinity }) })

// 1) happy path signed round trip
{
  const s = minimalSave()
  const w = SaveSystem.write(s)
  const loaded = SaveSystem.load()
  show('happy-path write ok?', { write: w, verdict: SaveSystem.writeVerdict(), transport: SaveSystem.transportVerdict(), loadedVersion: loaded?.version, loadedCash: (loaded?.player as any)?.cash })
}

// 2) NEWER version (21)
{
  const s = minimalSave({ version: 21, player: { ...(minimalSave().player), cash: 777, futureField_v21: 'PRECIOUS' } })
  ls.setItem('lokoja-life:save', JSON.stringify({ fmt: 2, data: s, sig: 'x' })) // sig wrong BUT key present -> tampered; instead write properly:
  SaveSystem.write(s)
  const loaded = SaveSystem.load()
  show('newer-version-21', { transport: SaveSystem.transportVerdict(), loadedVersion: loaded?.version, cash: (loaded as any)?.player?.cash, futureFieldSurvives: (loaded as any)?.player?.futureField_v21 })
}

// 3) version undefined (crafted bare object, no version)
{
  const bare = minimalSave()
  delete bare.version
  ls.setItem('lokoja-life:save', JSON.stringify(bare)) // legacy bare payload
  const loaded = SaveSystem.load()
  show('version-undefined-legacy', { transport: SaveSystem.transportVerdict(), loadedVersion: loaded?.version, ok: !!loaded })
}

// 4) v1 legacy
{
  const bare = minimalSave({ version: 1 })
  ls.setItem('lokoja-life:save', JSON.stringify(bare))
  const loaded = SaveSystem.load()
  show('v1-legacy', { transport: SaveSystem.transportVerdict(), loadedVersion: loaded?.version, bankBalance: (loaded as any)?.player?.bankBalance })
}

// 5) negative money from crafted save
{
  const s = minimalSave({ player: { ...(minimalSave().player), cash: -999999, totalEarned: -5 } })
  SaveSystem.write(s, { force: true })
  const loaded = SaveSystem.load()
  show('negative-cash', { loadedCash: (loaded as any)?.player?.cash, totalEarned: (loaded as any)?.player?.stats?.totalEarned, clamped: (loaded as any)?.player?.cash === -999999 })
}

// 6) money null (post-NaN serialization)
{
  const raw = JSON.stringify({ ...minimalSave(), player: { ...(minimalSave().player), cash: null, bankBalance: null } })
  ls.setItem('lokoja-life:save', raw)
  const loaded = SaveSystem.load()
  show('cash-null', { transport: SaveSystem.transportVerdict(), loadedCash: (loaded as any)?.player?.cash, bankBalance: (loaded as any)?.player?.bankBalance })
}

// 7) bankBalance NaN in-memory -> serialize -> reload
{
  const s = minimalSave()
  s.player.bankBalance = NaN
  const str = JSON.stringify(s)
  show('NaN-bankBalance-serialized-as', { json: str.match(/"bankBalance":[^,}]*/)?.[0] })
  ls.setItem('lokoja-life:save', str)
  const loaded = SaveSystem.load()
  show('NaN-bankBalance-reloaded', { bankBalance: (loaded as any)?.player?.bankBalance, isNan: Number.isNaN((loaded as any)?.player?.bankBalance) })
}

// 8) world.day as string
{
  const s = minimalSave({ world: { day: '5', timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' } })
  SaveSystem.write(s, { force: true })
  const loaded = SaveSystem.load()
  show('day-string-5', { day: (loaded as any)?.world?.day, type: typeof (loaded as any)?.world?.day })
}

// 9) corrupted JSON primary -> shadow fallback
{
  SaveSystem.write(minimalSave(), { force: true }) // establishes shadow too on next write
  SaveSystem.write(minimalSave({ player: { ...(minimalSave().player), cash: 1234 } }), { force: true })
  ls.setItem('lokoja-life:save', '{"fmt":2,"data":{"ver') // torn write
  const loaded = SaveSystem.load()
  show('torn-primary', { transport: SaveSystem.transportVerdict(), cash: (loaded as any)?.player?.cash })
}

// 10) tampered signature
{
  const s = minimalSave({ player: { ...(minimalSave().player), cash: 42 } })
  SaveSystem.write(s, { force: true })
  const env = JSON.parse(ls.getItem('lokoja-life:save')!)
  const evil = { ...env, data: { ...env.data, player: { ...env.data.player, cash: 999999999 } } }
  ls.setItem('lokoja-life:save', JSON.stringify(evil)) // same sig, changed data
  const loaded = SaveSystem.load()
  show('tampered-sig', { transport: SaveSystem.transportVerdict(), loaded: loaded ? (loaded as any).player.cash : null })
}

// 11) tamper + key deleted (missing-key path)
{
  const s = minimalSave({ player: { ...(minimalSave().player), cash: 42 } })
  SaveSystem.write(s, { force: true })
  const env = JSON.parse(ls.getItem('lokoja-life:save')!)
  const evil = { ...env, data: { ...env.data, player: { ...env.data.player, cash: 999999999 } } }
  ls.setItem('lokoja-life:save', JSON.stringify(evil))
  ls.removeItem('lokoja-life:fortkey')
  ;(SaveSystem as any).setFortKey('') // try empty key
  const loaded = SaveSystem.load()
  show('tamper+key-deleted', { transport: SaveSystem.transportVerdict(), cash: loaded ? (loaded as any).player.cash : null })
  SaveSystem.setFortKey(KEY)
}

// 12) quota exceeded during write
{
  SaveSystem.write(minimalSave(), { force: true })
  failNextSet = true
  const ok = SaveSystem.write(minimalSave({ player: { ...(minimalSave().player), cash: 31337 } }), { force: true })
  failNextSet = false
  const loaded = SaveSystem.load()
  show('quota-exceeded', { writeReturned: ok, verdict: SaveSystem.writeVerdict(), survivingCash: (loaded as any)?.player?.cash })
}

// 13) missing player -> rejected?
{
  ls.setItem('lokoja-life:save', JSON.stringify({ version: 20, world: { day: 1 } }))
  const loaded = SaveSystem.load()
  show('no-player', { transport: SaveSystem.transportVerdict(), loaded: loaded })
}

// 14) huge money (1e308) + Infinity in totalEarned
{
  const s = minimalSave({ player: { ...(minimalSave().player), cash: 1e308, stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: Infinity, totalSpent: 0 } } })
  SaveSystem.write(s, { force: true })
  const loaded = SaveSystem.load()
  show('huge-money+infinity', { cash: (loaded as any)?.player?.cash, totalEarned: (loaded as any)?.player?.stats?.totalEarned })
}

// 15) migration chain length
{
  const src = require('fs').readFileSync('src/game/systems/save.ts', 'utf8')
  const cases = [...src.matchAll(/^\s{4}case (\d+):/gm)].map((m) => Number(m[1]))
  const version = src.match(/const SAVE_VERSION = (\d+)/)?.[1]
  show('migration-census', { SAVE_VERSION: version, caseLabels: cases, realSteps: cases.filter((c) => c < 20).length })
}

console.log('\nDONE')
