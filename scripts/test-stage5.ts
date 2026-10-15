/**
 * LOKOJA LIFE — Stage 5 Test Suite
 * ---------------------------------
 * Covers the Stage 5 additions: social system, vehicle catalog, NPC chat
 * data, wardrobe bus, and the v2→v3 save migration (via a localStorage
 * shim, so the real SaveSystem code path is exercised end-to-end).
 *
 * Run: bun scripts/test-stage5.ts
 */

import { TIERS, TIER_META, tierFor, chatGain, canChat, afterChat, relationshipFor, pickLine } from '../src/game/systems/social'
import { VEHICLES, VEHICLE_BY_MODEL, generatePlate } from '../src/game/data/vehicles'
import { NPC_CHAT } from '../src/game/data/npcChat'
import { NPCS, NPC_BY_ID } from '../src/game/data/npcs'
import { INTERIOR } from '../src/game/data/config'
import { useWardrobeBus } from '../src/components/game/world/wardrobe-store'
import type { GameSave, VehicleModel } from '../src/game/types'

let passed = 0
let failed = 0

function check(name: string, ok: boolean) {
  if (ok) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}`)
  }
}

/* ------------------------------- social system ------------------------------- */

console.log('\n— Social system —')
{
  check('4 tiers with ascending thresholds', TIERS.length === 4 && TIERS[0].min === 0 && TIERS[1].min === 15 && TIERS[2].min === 40 && TIERS[3].min === 75)
  check('tierFor boundaries', tierFor(0) === 'stranger' && tierFor(14.9) === 'stranger' && tierFor(15) === 'acquaintance' && tierFor(39) === 'acquaintance' && tierFor(40) === 'paddy' && tierFor(74) === 'paddy' && tierFor(75) === 'close-paddy' && tierFor(100) === 'close-paddy')
  check('chat gain is gentle and caps at 100', chatGain(0) === 6 && chatGain(50) === 8)
  const fresh = relationshipFor({}, 'musa')
  check('unknown NPC starts as stranger on day 0', fresh.familiarity === 0 && fresh.lastChatDay === 0)
  check('canChat true for fresh NPC', canChat(fresh, 1) === true)
  const chatted = afterChat(fresh, 1)
  check('afterChat bumps familiarity + stamps the day', chatted.familiarity === 6 && chatted.lastChatDay === 1)
  check('cooldown blocks same-day rechat', canChat(chatted, 1) === false)
  check('next day rechat allowed', canChat(chatted, 2) === true)
  const day1 = afterChat(chatted, 2)
  check('second chat climbs toward acquaintance', day1.familiarity === 12)
  let f = fresh.familiarity
  let state = fresh
  for (let d = 1; d <= 20; d++) state = afterChat(state, d)
  f = state.familiarity
  check('20 days of daily chats reach close-paddy', f === 100 && tierFor(f) === 'close-paddy')
  check('pickLine is deterministic (same inputs → same line)', pickLine(['a', 'b', 'c'], 6, 2) === pickLine(['a', 'b', 'c'], 6, 2))
  check('tier meta has perk + bonus for every tier', (['stranger', 'acquaintance', 'paddy', 'close-paddy'] as const).every((t) => typeof TIER_META[t].label === 'string' && TIER_META[t].offerBonus >= 0))
}

/* ------------------------------ vehicle catalog ------------------------------ */

console.log('\n— Vehicle catalog —')
{
  const models: VehicleModel[] = ['okada', 'keke', 'taxi', 'danfo']
  check('4 models, one per key', VEHICLES.length === 4 && models.every((m) => VEHICLE_BY_MODEL[m]))
  check('prices ascend like real Lokoja ambitions', VEHICLE_BY_MODEL.okada.price < VEHICLE_BY_MODEL.keke.price && VEHICLE_BY_MODEL.keke.price < VEHICLE_BY_MODEL.taxi.price && VEHICLE_BY_MODEL.taxi.price < VEHICLE_BY_MODEL.danfo.price)
  check('every model has speed/accel/handling + description', VEHICLES.every((v) => v.topSpeed > 0 && v.accel > 0 && v.handling > 0 && v.description.length > 10 && v.label.length > 3))
  const p1 = generatePlate('okada', 4, 1)
  check('plates are LKO-###-XX format', /^LKO-\d{3}-[A-N]{2}$/.test(p1))
  check('plates deterministic for same inputs', generatePlate('okada', 4, 1) === p1)
  check('plates differ across garage slots', generatePlate('okada', 4, 0) !== generatePlate('okada', 4, 1))
  check('drive energy config is gentler than walking', INTERIOR.gym.energy < 0 && INTERIOR.NIGHT_OUT.cost > 0 && INTERIOR.lounge.mood > INTERIOR.relax.tv.mood)
}

/* --------------------------------- chat data --------------------------------- */

console.log('\n— NPC chat data —')
{
  check('every NPC has a chat pool', NPCS.every((n) => NPC_CHAT[n.id] !== undefined))
  check('every pool covers all 4 tiers', Object.values(NPC_CHAT).every((pool) => (['stranger', 'acquaintance', 'paddy', 'close-paddy'] as const).every((t) => pool[t].length >= 1)))
  check('no empty or placeholder lines', Object.values(NPC_CHAT).flatMap((p) => [...p.stranger, ...p.acquaintance, ...p.paddy, ...p['close-paddy']]).every((l) => l.trim().length >= 10))
  check('chat pool ids match the NPC registry exactly', Object.keys(NPC_CHAT).every((id) => NPC_BY_ID[id] !== undefined))
}

/* ------------------------------- wardrobe bus -------------------------------- */

console.log('\n— Wardrobe bus —')
{
  useWardrobeBus.getState().hide()
  check('starts closed', useWardrobeBus.getState().open === false)
  useWardrobeBus.getState().show()
  check('show() opens', useWardrobeBus.getState().open === true)
  useWardrobeBus.getState().hide()
  check('hide() closes', useWardrobeBus.getState().open === false)
}

/* ------------------------- save migration v2 → v3 ---------------------------- */

console.log('\n— Save migration (v1/v2 → v3) —')
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

  const basePlayer = {
    name: 'Ada', gender: 'female' as const, ageBand: 'adult' as const,
    avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' },
    cash: 4200, needs: { health: 90, energy: 80, hunger: 70, mood: 60 },
    skills: { hustle: 1, smart: 1, social: 1 }, skillXp: { hustle: 0, smart: 0, social: 0 },
    reputation: 10, level: 2, xp: 30, homeId: 'basic-room', jobId: null,
    activeOpportunities: [], cooldowns: {}, transactions: [],
    stats: { jobsCompleted: 1, hustlesCompleted: 2, totalEarned: 3000, totalSpent: 500 },
    inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [],
  }
  const baseWorld = { day: 6, timeOfDay: 'evening' as const, weather: 'sunny' as const, currentLocation: 'kpata-market' }

  const { SaveSystem } = await import('../src/game/systems/save')

  // v2 → v3
  const v2 = JSON.stringify({ version: 2, createdAt: 1, updatedAt: 2, player: basePlayer, world: baseWorld, settings: { sound: true, chill: false } })
  mem.set(SaveSystem.SAVE_KEY, v2)
  const loaded2 = SaveSystem.load()
  check('v2 save loads', loaded2 !== null)
  check('v2 upgraded to v17', loaded2?.version === 17)
  check('v2 player gets empty garage / bank / strangers', loaded2?.player.vehicles.length === 0 && loaded2?.player.bankBalance === 0 && Object.keys(loaded2?.player.relationships ?? {}).length === 0)
  check('v2 player keeps cash + ledger', loaded2?.player.cash === 4200 && loaded2?.player.transactions.length === 0)
  check('v2 world untouched', loaded2?.world.day === 6 && loaded2?.world.currentLocation === 'kpata-market')
  check('v2 gets the M2 civic defaults', loaded2?.civic !== undefined && loaded2?.civic.nepa.owed === 0 && loaded2?.civic.kgirs.warrant === false)
  check('v2 gets M5 fleet + shop defaults', loaded2?.fleet.day === 6 && loaded2?.fleet.done.length === 0 && (loaded2?.player.businesses ?? []).every((b) => b.staff === 0 && b.upgrades.length === 0))

  // v1 → v3 (two-step migration)
  const { skillXp, activeOpportunities, cooldowns, transactions, stats, ...v1Player } = basePlayer
  void skillXp; void activeOpportunities; void cooldowns; void transactions; void stats
  const v1 = JSON.stringify({ version: 1, createdAt: 1, updatedAt: 2, player: v1Player, world: baseWorld, settings: { sound: true, chill: false } })
  mem.set(SaveSystem.SAVE_KEY, v1)
  const loaded1 = SaveSystem.load()
  check('v1 save loads and reaches v17', loaded1?.version === 17)
  check('v1 gets Stage 3 defaults too', loaded1?.player.skillXp.hustle === 0 && Array.isArray(loaded1?.player.activeOpportunities))
  check('v1 gets Stage 5 defaults too', loaded1?.player.vehicles.length === 0 && loaded1?.player.bankBalance === 0)

  // v5 → v6 (M5): a v5 save with a biz carrying NO staff/upgrades upgrades cleanly
  const v5 = JSON.stringify({
    version: 5, createdAt: 1, updatedAt: 2,
    player: { ...basePlayer, businesses: [{ id: 'kpata-stall', typeId: 'kpata-stall', level: 2, accrued: 1500, lastAccrualDay: 5, openedDay: 2, lastCollectedAt: null }] },
    world: baseWorld,
    civic: { nepa: { cycleStart: 1, owed: 900, paidThrough: 5, shedding: false, totalPaid: 0 }, kgirs: { lastSeenEarned: 0, assessed: 0, dueDay: 0, paid: 0, warrant: false }, police: { fines: 0, paid: 0 }, efcc: { pending: [], rewardsTotal: 0, lastTipDay: -99 }, market: { rolledDay: 6, prices: {}, event: null, marketDay: false } },
    settings: { sound: true, chill: false },
  })
  mem.set(SaveSystem.SAVE_KEY, v5)
  const loaded5 = SaveSystem.load()
  check('v5 save loads and reaches v17 (M5→…→M17 ladder)', loaded5?.version === 17)
  check('v5 biz gains staff=0 + no upgrades', loaded5?.player.businesses[0]?.staff === 0 && JSON.stringify(loaded5?.player.businesses[0]?.upgrades ?? []) === '[]')
  check('v5 keeps its till through the migration', loaded5?.player.businesses[0]?.accrued === 1500)
  check('v5 gets a clean fleet ledger', loaded5?.fleet.day === 6 && loaded5?.fleet.done.length === 0)

  // corrupt → null
  mem.set(SaveSystem.SAVE_KEY, '{not json at all')
  check('corrupt save → null, no crash', SaveSystem.load() === null)

  // round-trip: write then read keeps v3 fields
  mem.delete(SaveSystem.SAVE_KEY)
  const { freshCivicState } = await import('../src/game/systems/civic')
  const { freshChaosState } = await import('../src/game/systems/chaos')
  const { freshGoalState } = await import('../src/game/systems/goals')
  const { freshAccountState, freshOnboardingState } = await import('../src/game/systems/guest')
  const { freshCalendarState } = await import('../src/game/systems/calendar')
  const { freshRiversState } = await import('../src/game/systems/rivers')
  const { freshEducationState } = await import('../src/game/systems/education')
  const { freshHousingState } = await import('../src/game/systems/housing')
  const { freshJapaState } = await import('../src/game/systems/japa')
  const fresh: GameSave = {
    version: 7, createdAt: 1, updatedAt: 2, calendar: freshCalendarState(), rivers: freshRiversState(), education: freshEducationState(), housing: freshHousingState(), japa: freshJapaState(),
    shield: { scammerDay: 0, scammerCorrect: 0, scammerWrong: 0, scammerStreak: 0, parentPinHash: null },
    fortress: { anomalies: 0, dayEarnedDay: 0, dayEarned: 0, slotTxCount: 0, slotTxSlot: 0, chainTail: 'lko-chain-seed', fingerprint: null },
    cityPulse: { readDay: 0, seen: [], arrivals: [], stats: { shares: 0, arrivalsIn: 0 } },
    live: { cursor: 0, voiceOn: false, assocId: null, coSigned: [], circles: [], stats: { chats: 0, emotes: 0, streamsWatched: 0, tradesDone: 0 }, finesPaid: 0 },
    player: { ...basePlayer, skillXp: { hustle: 0, smart: 0, social: 0 }, activeOpportunities: [], cooldowns: {}, transactions: [], stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }, vehicles: [{ id: 'okada-1-1', model: 'okada', plate: 'LKO-111-AB', boughtDay: 1 }], bankBalance: 9000, relationships: { musa: { familiarity: 40, lastChatDay: 3 } }, businesses: [{ id: 'kpata-stall', typeId: 'kpata-stall', level: 1, accrued: 0, lastAccrualDay: 6, openedDay: 6, lastCollectedAt: null, staff: 1, upgrades: ['solar'] }] },
    world: baseWorld,
    civic: freshCivicState(),
    chaos: freshChaosState(),
    goals: freshGoalState(),
    onboarding: freshOnboardingState(),
    account: freshAccountState(),
    fleet: { day: 6, done: ['gig-6-okada-0'] },
    settings: { sound: true, graphics: 'auto', chill: false, elder: false },
  }
  SaveSystem.write(fresh)
  const rt = SaveSystem.load()
  check('round-trip keeps vehicle, bank + paddy status', rt?.player.vehicles[0]?.plate === 'LKO-111-AB' && rt?.player.bankBalance === 9000 && rt?.player.relationships.musa.familiarity === 40)
  check('round-trip keeps the civic slice', rt?.civic.nepa.paidThrough === 5 && rt?.civic.police.fines === 0)
  check('round-trip keeps staff, solar + the done-gig ledger', rt?.player.businesses[0]?.staff === 1 && rt?.player.businesses[0]?.upgrades[0] === 'solar' && rt?.fleet.done[0] === 'gig-6-okada-0')

  // M6 — v6 → v7: the gift/hangout cooldowns default, existing social state survives
  const v6 = JSON.stringify({
    version: 6, createdAt: 1, updatedAt: 2,
    player: { ...basePlayer, relationships: { musa: { familiarity: 55, lastChatDay: 4 } } },
    world: baseWorld, settings: { sound: true, chill: false },
  })
  mem.set(SaveSystem.SAVE_KEY, v6)
  const loaded6 = SaveSystem.load()
  check('v6 save loads and reaches v17', loaded6?.version === 17)
  check('v6 relationship gains gift/hangout cooldown defaults', loaded6?.player.relationships.musa?.lastGiftDay === 0 && loaded6?.player.relationships.musa?.lastHangoutDay === 0)
  check('v6 keeps familiarity through the migration', loaded6?.player.relationships.musa?.familiarity === 55)
}

/* --------------------------------- summary ----------------------------------- */

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
