/* FIX SQUAD F1 — crafted-save battery against the REAL deserialize path
 * (src/game/systems/save.ts → SaveSystem.load). Modeled on Team Hotel's
 * scripts/audit-tmp/hotel/test-save.ts. Writes nothing outside this shim.
 *
 * Cases: negative-cash · cash-null · day-string-5 · huge-money 1e308 ·
 * version-undefined-legacy · version-21-future (bare + signed) · needs law ·
 * bank law · clean-v20 round-trip (byte-identical, cash identical).
 */

// ---- window/localStorage shim (save.ts uses window.localStorage) ----
const mem = new Map<string, string>()
const ls = {
  getItem: (k: string): string | null => (mem.has(k) ? (mem.get(k) as string) : null),
  setItem: (k: string, v: string): void => {
    mem.set(k, String(v))
  },
  removeItem: (k: string): void => {
    mem.delete(k)
  },
  clear: (): void => mem.clear(),
  key: (i: number): string | null => Array.from(mem.keys())[i] ?? null,
  get length(): number {
    return mem.size
  },
}
const g = globalThis as unknown as { window?: unknown; localStorage?: unknown }
g.window = { localStorage: ls }
g.localStorage = ls

// The REAL production module (import hoists; module scope is side-effect-free)
import { SaveSystem } from '../../../src/game/systems/save'

const SAVE_KEY = SaveSystem.SAVE_KEY
SaveSystem.setFortKey('a'.repeat(32))

/** Read a nested field off a loaded save without `any`. */
function field(o: unknown, path: string[]): unknown {
  let cur: unknown = o
  for (const k of path) {
    if (cur && typeof cur === 'object') cur = (cur as Record<string, unknown>)[k]
    else return undefined
  }
  return cur
}

function show(label: string, out: Record<string, unknown>): void {
  console.log(`\n== ${label} ==`)
  console.log(JSON.stringify(out))
}

/** Crafted v20-shaped payload (raw JSON — the deserialize path's real diet). */
function crafted(over: Record<string, unknown>): Record<string, unknown> {
  return {
    version: 20,
    createdAt: 1,
    updatedAt: 1,
    player: {
      name: 'Test',
      cash: 5000,
      needs: { health: 100, energy: 100, hunger: 100, mood: 100 },
      bankBalance: 0,
      skillXp: { hustle: 0, smart: 0, social: 0 },
      activeOpportunities: [],
      cooldowns: {},
      transactions: [],
      stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 },
      vehicles: [],
      relationships: {},
      businesses: [],
      ageBand: 'adult',
    },
    world: { day: 3, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
    settings: { sound: true, graphics: 'auto', chill: false, elder: false, music: false, haptics: true },
    ...over,
  }
}

/** Reset storage to exactly one raw primary payload, then the REAL load. */
function loadRaw(raw: string): ReturnType<typeof SaveSystem.load> {
  mem.clear()
  ls.setItem(SAVE_KEY, raw)
  return SaveSystem.load()
}

// 1) negative cash
{
  const loaded = loadRaw(JSON.stringify(crafted({ player: { ...crafted({}).player, cash: -999999 } })))
  show('negative-cash', {
    transport: SaveSystem.transportVerdict(),
    cash: field(loaded, ['player', 'cash']),
    ok: typeof field(loaded, ['player', 'cash']) === 'number' && (field(loaded, ['player', 'cash']) as number) >= 0,
  })
}

// 2) cash/bankBalance null (post-NaN serialization)
{
  const loaded = loadRaw(JSON.stringify(crafted({ player: { ...crafted({}).player, cash: null, bankBalance: null } })))
  show('cash-null', {
    transport: SaveSystem.transportVerdict(),
    cash: field(loaded, ['player', 'cash']),
    bankBalance: field(loaded, ['player', 'bankBalance']),
  })
}

// 3) world.day as string "5" (the "+1 → 51" bug)
{
  const loaded = loadRaw(JSON.stringify(crafted({ world: { day: '5', timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' } })))
  show('day-string-5', {
    transport: SaveSystem.transportVerdict(),
    day: field(loaded, ['world', 'day']),
    type: typeof field(loaded, ['world', 'day']),
    dayAfterPlusOne: (field(loaded, ['world', 'day']) as number) + 1,
  })
}

// 4) huge money 1e308 + Infinity totalEarned (Infinity → null on the wire)
{
  const loaded = loadRaw(
    JSON.stringify(
      crafted({ player: { ...crafted({}).player, cash: 1e308, stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: Infinity, totalSpent: 0 } } }),
    ),
  )
  show('huge-money-1e308', {
    transport: SaveSystem.transportVerdict(),
    cash: field(loaded, ['player', 'cash']),
    cashIsFinite: Number.isFinite(field(loaded, ['player', 'cash']) as number),
    totalEarned: field(loaded, ['player', 'stats', 'totalEarned']),
    totalSpent: field(loaded, ['player', 'stats', 'totalSpent']),
  })
}

// 5) version undefined — legacy bare payload must STILL load with sane defaults
{
  const bare = crafted({})
  delete (bare as Record<string, unknown>).version
  const loaded = loadRaw(JSON.stringify(bare))
  show('version-undefined-legacy', {
    transport: SaveSystem.transportVerdict(),
    loaded: loaded !== null,
    version: field(loaded, ['version']),
    cash: field(loaded, ['player', 'cash']),
    day: field(loaded, ['world', 'day']),
    dayType: typeof field(loaded, ['world', 'day']),
  })
}

// 6) version 21 — from a NEWER app version: bare AND signed
{
  const bareLoaded = loadRaw(JSON.stringify({ ...crafted({}), version: 21 }))
  const data21 = crafted({ player: { ...crafted({}).player, cash: 777 }, futureField_v21: 'PRECIOUS' })
  const dataStr = JSON.stringify({ ...data21, version: 21 })
  const signedLoaded = loadRaw(JSON.stringify({ fmt: 2, data: JSON.parse(dataStr), sig: SaveSystem.sigForString(dataStr) }))
  show('version-21-future', {
    bareRejected: bareLoaded === null,
    signedRejected: signedLoaded === null,
    bareTransport: SaveSystem.transportVerdict(),
    signedTransport: SaveSystem.transportVerdict(),
  })
}

// 7) the needs law: over/under/corrupt needs clamp into [0,100]
{
  const loaded = loadRaw(
    JSON.stringify(crafted({ player: { ...crafted({}).player, needs: { health: 999, energy: -50, hunger: null, mood: 50 } } })),
  )
  const needs = field(loaded, ['player', 'needs']) as Record<string, unknown> | undefined
  show('needs-law', {
    health_999: needs?.health,
    energy_neg50: needs?.energy,
    hunger_null: needs?.hunger,
    mood_50: needs?.mood,
    allIn01to100: ['health', 'energy', 'hunger', 'mood'].every(
      (k) => typeof needs?.[k] === 'number' && (needs[k] as number) >= 0 && (needs[k] as number) <= 100,
    ),
  })
}

// 8) the bank law: negative / fractional / huge ride to finite whole naira
{
  const loaded = loadRaw(JSON.stringify(crafted({ player: { ...crafted({}).player, bankBalance: -100.5 } })))
  const loaded2 = loadRaw(JSON.stringify(crafted({ player: { ...crafted({}).player, bankBalance: 12.9 } })))
  show('bank-law', {
    negFractional_100_5: field(loaded, ['player', 'bankBalance']),
    fractional_12_9: field(loaded2, ['player', 'bankBalance']),
  })
}

// 9) CLEAN valid v20 round-trip — the healed output of the first load IS what
// the game writes; loading it again must be byte-identical (cash identical).
{
  const first = loadRaw(JSON.stringify(crafted({})))
  if (!first) throw new Error('clean v20 save failed to load')
  const canonical = JSON.stringify(first)
  SaveSystem.write(first, { force: true })
  const second = SaveSystem.load()
  show('clean-v20-roundtrip', {
    byteIdentical: second !== null && JSON.stringify(second) === canonical,
    cashIdentical: field(second, ['player', 'cash']) === field(first, ['player', 'cash']),
    cash: field(second, ['player', 'cash']),
    day: field(second, ['world', 'day']),
    version: field(second, ['version']),
    transport: SaveSystem.transportVerdict(),
  })
}

console.log('\nF1 BATTERY DONE')
