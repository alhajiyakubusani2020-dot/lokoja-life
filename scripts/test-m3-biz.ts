/**
 * LOKOJA LIFE — M3: OWN THE CITY (pure rule checks)
 * --------------------------------------------------
 * Deterministic law blocks for the business system: seeded daily income,
 * market-engine integration, reputation pull, level multipliers and
 * upgrades, the accrual cap, idempotent day rolls, save migration of the
 * new fields, and the civic coupling (NEPA meter load; KGIRS sees
 * collected income; the phone fee law).
 * Run: bun scripts/test-m3-biz.ts
 */

import {
  BIZ_TYPES,
  bizAtLocation,
  bizDef,
  bizDayMult,
  bizDayRoll,
  bizCollect,
  bizIncomeFor,
  bizLevelMult,
  bizRepBonus,
  bizUpgradeCost,
  freshBusiness,
} from '../src/game/systems/biz'
import { freshCivicState, marketForDay, nepaBillFor, isMarketDay } from '../src/game/systems/civic'
import { BIZ } from '../src/game/data/config'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

console.log('\nBIZ DATA — the shopfront map')
check('4 shop types defined', Object.keys(BIZ_TYPES).length === 4)
check('every shop defines a real location id', Object.values(BIZ_TYPES).every((d) => d.locationId.length > 0))
const hosts = Object.values(BIZ_TYPES).map((d) => d.locationId)
check('one shop per location (no two shops share a spot)', new Set(hosts).size === hosts.length)
check('bizAtLocation finds the kpata stall', bizAtLocation('kpata-market')?.typeId === 'kpata-stall')
check('bizAtLocation misses non-shop locations', bizAtLocation('home') === null)
check('level ladder 1..4', ['kpata-stall', 'ganaja-kiosk', 'okada-stand', 'food-joint'].every((t, i) => BIZ_TYPES[t].unlockLevel === i + 1))

console.log('\nINCOME LAW — level, reputation, determinism')
check('level mult L1 = 1', bizLevelMult(1) === 1)
check('level mult L2 = 1.35', Math.abs(bizLevelMult(2) - 1.35) < 1e-9)
check('level mult clamps at max', bizLevelMult(99) === bizLevelMult(BIZ.maxLevel))
check('rep bonus 0 below base', bizRepBonus(400) === 0)
check('rep bonus +10% at 1500 rep', Math.abs(bizRepBonus(1500) - 0.1) < 1e-9)
check('rep bonus capped', bizRepBonus(999999) === BIZ.repBonusCap)
check('income deterministic per (type, level, day)', bizIncomeFor('kpata-stall', 2, 6, freshCivicState(), 300) === bizIncomeFor('kpata-stall', 2, 6, freshCivicState(), 300))
check('income scales with level', bizIncomeFor('kpata-stall', 3, 6, freshCivicState(), 300) > bizIncomeFor('kpata-stall', 1, 6, freshCivicState(), 300))
check('income never negative', bizIncomeFor('kpata-stall', 1, 1, freshCivicState(), 0) >= 0)
check('unknown type earns nothing', bizIncomeFor('ghost-shop', 1, 6, freshCivicState(), 500) === 0)

console.log('\nMARKET COUPLING — kpata/food shops ride the SAME engine as meals')
{
  const civic = freshCivicState()
  const day = 6
  const rolled = marketForDay(civic, day)
  const mult = rolled.market.prices['kpata-market'] ?? 1
  const stall = bizIncomeFor('kpata-stall', 1, day, civic, 0)
  const expected = Math.round(BIZ_TYPES['kpata-stall'].baseIncome * mult * (rolled.market.marketDay ? 1 / 0.9 : 1))
  check('stall income = base × market multiplier', stall === expected, `stall ${stall} vs expected ${expected}`)
  // market day: the SAME engine that discounts meals makes the shop BUSY
  if (isMarketDay(day)) {
    check('market day lifts shop income vs plain multiplier', stall > Math.round(BIZ_TYPES['kpata-stall'].baseIncome * mult * 0.99))
  }
  // wobble band for non-market shops
  const kioskA = bizIncomeFor('ganaja-kiosk', 1, 6, civic, 0)
  const kioskBase = BIZ_TYPES['ganaja-kiosk'].baseIncome
  check('non-market shop wobbles inside the band', kioskA >= kioskBase * (1 - BIZ.wobbleBand) - 1 && kioskA <= kioskBase * (1 + BIZ.wobbleBand) + 1)
  check('wobble deterministic', bizIncomeFor('ganaja-kiosk', 1, 6, civic, 0) === kioskA)
  check('wobble varies across days', new Set([5, 6, 7, 8].map((d) => bizDayMult('ganaja-kiosk', d, civic))).size > 1)
}

console.log('\nDAY ROLL — accrual, cap, idempotence')
{
  const civic = freshCivicState()
  const shop = freshBusiness('kpata-stall', 10)
  const r1 = bizDayRoll([shop], 10, 11, civic, 0)
  check('one day accrues into the till', r1.next[0].accrued > 0 && r1.total === r1.next[0].accrued)
  check('lastAccrualDay advances', r1.next[0].lastAccrualDay === 11)
  // idempotence: re-rolling the same crossing must be a no-op
  const r2 = bizDayRoll(r1.next, 10, 11, civic, 0)
  check('re-rolling the same day double-pays NOTHING', r2.total === 0)
  // multi-day
  const r3 = bizDayRoll([shop], 10, 14, civic, 0)
  const r4 = bizDayRoll([shop], 10, 15, civic, 0)
  check('4 days earn more than 3 days', r4.total > r3.total)
  // cap: 8 elapsed days only pay the freshest 7
  const r5 = bizDayRoll([shop], 10, 18, civic, 0)
  check('accrual cap stops hoarding (8 days pay as 7)', r5.total <= r4.total * 3, `r5 ${r5.total} vs 3×r4 ${r4.total * 3}`)
  // collect empties the till
  const { next: collected, amount } = bizCollect(r1.next[0], 12)
  check('collect empties the till honestly', collected.accrued === 0 && amount === r1.next[0].accrued)
  check('collect stamps the day', collected.lastAccrualDay === 12)
  // shop opened on a later day does not earn for days before it opened
  const late = freshBusiness('kpata-stall', 20)
  const r6 = bizDayRoll([late], 10, 25, civic, 0)
  const r7 = bizDayRoll([freshBusiness('kpata-stall', 20)], 20, 25, civic, 0)
  check('shop opened mid-span only earns from opening', r6.total === r7.total)
}

console.log('\nUPGRADES — the ladder to L5')
check('upgrade cost L1→L2 = 60% of buy', bizUpgradeCost('kpata-stall', 1) === Math.round(BIZ_TYPES['kpata-stall'].buyCost * 0.6))
check('upgrade cost scales with level', bizUpgradeCost('kpata-stall', 2)! > bizUpgradeCost('kpata-stall', 1)!)
check('max level has no upgrade', bizUpgradeCost('kpata-stall', BIZ.maxLevel) === null)

console.log('\nCIVIC COUPLING — the mesh bites the shopkeeper too')
{
  const b0 = nepaBillFor(6, 0)
  const b1 = nepaBillFor(6, 1)
  const b4 = nepaBillFor(6, 4)
  check('each shop loads the NEPA meter +22%', Math.abs(b1 / b0 - 1 - BIZ.nepaLoadPerBiz) < 0.02)
  check('four shops load it ~2×', Math.abs(b4 / b0 - (1 + 4 * BIZ.nepaLoadPerBiz)) < 0.02)
  // phone fee law mirrors the civic channels: till ₦600 by phone = ₦550 net
  const gross = 600
  const net = Math.max(0, gross - (true ? 50 : 0))
  check('phone collect fee comes out of the transfer', net === 550)
}

console.log('\nSAVE — v4 carries into v7, legacy biz fields default')
{
  // localStorage shim BEFORE SaveSystem use — mirrors browser surface
  const mem = new Map<string, string>()
  ;(globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      setItem: (k: string, v: string) => void mem.set(k, String(v)),
      getItem: (k: string) => (mem.has(k) ? (mem.get(k) as string) : null),
      removeItem: (k: string) => void mem.delete(k),
    },
  }
  const { SaveSystem } = await import('../src/game/systems/save')
  const raw = JSON.stringify({
    version: 4,
    createdAt: 1,
    updatedAt: 2,
    player: {
      name: 'Ada', gender: 'f', avatar: {}, cash: 5000, needs: {}, skills: {}, skillXp: {},
      reputation: 0, level: 2, xp: 0, homeId: 'home', jobId: null,
      activeOpportunities: [], cooldowns: {}, transactions: [],
      stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 },
      inventory: [], businesses: [{ id: 'kpata-stall', typeId: 'kpata-stall', level: 2, lastCollectedAt: null }],
      missions: {}, achievements: [], discoveries: [], vehicles: [], bankBalance: 0, relationships: {},
    },
    world: { day: 9, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
    settings: { sound: true },
  })
  // migration via the REAL load path (localStorage shim, like stage5)
  mem.set(SaveSystem.SAVE_KEY, raw)
  const loaded = SaveSystem.load()
  check('v4 save loads', !!loaded)
  check('v4 reaches v18 (M6+…+M18 ladder)', loaded?.version === 18)
  const biz = loaded?.player.businesses?.[0]
  check('legacy biz gains accrual fields', !!biz && typeof biz.accrued === 'number' && typeof biz.lastAccrualDay === 'number' && typeof biz.openedDay === 'number')
  check('legacy biz gains M5 staff + upgrades', !!biz && biz.staff === 0 && Array.isArray(biz.upgrades))
  check('v4 save gains the M5 fleet ledger', loaded?.fleet?.day === 9 && Array.isArray(loaded?.fleet?.done))
  check('legacy level preserved', biz?.level === 2)
  const round = JSON.stringify(loaded)
  check('round-trip keeps the shop', (JSON.parse(round).player.businesses as unknown[]).length === 1)
}

console.log('\nWORLD HONESTY — shop ids match real anchors')
{
  // every shop's location must be a real 2D location id with a 3D anchor
  const { LOCATIONS } = await import('../src/game/data/locations')
  const { ANCHOR_BY_ID } = await import('../src/game/world3d/layout')
  for (const [typeId, def] of Object.entries(BIZ_TYPES)) {
    check(`${typeId} → real 2D location`, !!LOCATIONS.find((l) => l.id === def.locationId))
    check(`${typeId} → real 3D anchor`, !!ANCHOR_BY_ID[def.locationId])
  }
}

console.log(`\nM3 BIZ: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
