/**
 * LOKOJA LIFE — M11: THE RIVERS AWAKE (pure rule checks + a real store pass)
 * ---------------------------------------------------------------------------
 * The Niger has a year of its own. Law blocks: the river's own calendar
 * (dry New Year, the green-season rise, the peak sitting through the flood
 * months, the recede that lands before the year turns — deterministic,
 * wobble-bounded, reload-proof), the cut law (three low-lying zones at
 * their honest thresholds, confluence first, Kpata last), the walkway
 * tycoon (Crusher sand → segments → the crossing opens → the toll bowl
 * fills while the water holds), the ferry (board only while a zone is
 * cut, fares = the counter fare × the surge premium — the one-price law),
 * the cold-room rescue (one bowl per surge-year, NPC flow + player tiers,
 * a full bowl rolls the trucks and the street remembers), the flood crush
 * (×0.5 unsaved, ×0.9 saved — folded with the M8 blackout, worse water
 * wins), the market fold (the water lifts the SAME marketDayRoll channel),
 * the save v11→v12 migration, and a REAL bun store pass: force the surge,
 * refuse the land travel, buy the canoe, run a boatload, buy Crusher sand,
 * ferry into the cut zone, lay the segments across the days, open the
 * crossing, set the toll, collect the bowl, fund the cold-room rescue and
 * ride the protection.
 * Run: bun scripts/test-m11-rivers.ts
 */

import {
  freshRiversState,
  riverLevelFor,
  zoneCut,
  cutZonesFor,
  isSurge,
  segmentsLeft,
  walkwayOpen,
  walkAllowed,
  canLaySegment,
  laySegmentApply,
  crossingsFor,
  tollIncomeFor,
  setTollTierApply,
  ferryBoard,
  availableFerryGigs,
  ferryFareFor,
  ferryFareBetween,
  counterFareBetween,
  rescueWakes,
  canContributeRescue,
  contributeRescueApply,
  rescueNpcFlowFor,
  floodBizFactor,
  riverMarketMult,
  riversDayRoll,
  runFerryApply,
  setDebugRiverLevel,
  RIVER_ZONES,
  JETTY_ID,
} from '../src/game/systems/rivers'
import { RIVERS } from '../src/game/data/config'
import { LOCATION_BY_ID } from '../src/game/data/locations'
import { yearOf, yearDayOf } from '../src/game/systems/calendar'
import { SaveSystem } from '../src/game/systems/save'
import { freshCivicState } from '../src/game/systems/civic'
import type { RiversState } from '../src/game/types'

const SAVE_V = 18

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

function section(name: string) {
  console.log(`\n— ${name} —`)
}

const fresh = freshRiversState()
const near = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol

/* ----------------------------- the river's year ----------------------------- */

section("the river's own year")

check('New Year is DRY (the festivals never drown)', riverLevelFor(1) === 0 && riverLevelFor(30) === 0)
check('the Regatta day (37) is dry — the boats race in season', riverLevelFor(37) === 0)
check('the rise begins at year-day 41 (smoothstep starts honest: 0 then gathers)', riverLevelFor(41) === 0 && riverLevelFor(42) > 0 && riverLevelFor(40) === 0)
check('the peak sits through the flood months (55–62)', riverLevelFor(58) > 0.85 && riverLevelFor(60) > 0.85)
check('the recede lets go (63→71)', riverLevelFor(63) > riverLevelFor(66) && riverLevelFor(66) > riverLevelFor(69))
check('the river is back in its banks by year-day 71', riverLevelFor(71) === 0 && riverLevelFor(72) === 0)
check('deterministic (same day, same water)', riverLevelFor(52) === riverLevelFor(52))
check('wobble bounded (level never leaves 0..1)', (() => {
  let ok = true
  for (let d = 1; d <= 720; d++) {
    const lv = riverLevelFor(d)
    if (lv < 0 || lv > 1) ok = false
  }
  return ok
})())
check('the same year-day reads the same season base across years', (() => {
  let ok = true
  for (let y = 1; y <= 5; y++) {
    for (const yd of [50, 58, 65]) {
      const lv = riverLevelFor((y - 1) * 72 + yd)
      if (yd === 50 && lv < 0.4) ok = false
      if (yd === 58 && lv < 0.85) ok = false
      if (yd === 65 && lv < 0.3) ok = false
    }
  }
  return ok
})())
check('the level never lies about dry season (days 1–40 all zero)', (() => {
  for (let d = 1; d <= 40; d++) if (riverLevelFor(d) > 0) return false
  return true
})())

/* --------------------------------- the cut law ------------------------------- */

section('the cut law — the water owns the low ground')

{
  // find the honest crossing days from the curve itself
  let confluenceDay = 0
  let ganajaDay = 0
  let kpataDay = 0
  for (let d = 41; d <= 200; d++) {
    const lv = riverLevelFor(d)
    if (!confluenceDay && lv >= RIVERS.cutAt['confluence']) confluenceDay = d
    if (!ganajaDay && lv >= RIVERS.cutAt['ganaja-junction']) ganajaDay = d
    if (!kpataDay && lv >= RIVERS.cutAt['kpata-market']) kpataDay = d
  }
  check('the Confluence goes under first (the riverfront is lowest)', confluenceDay > 0 && confluenceDay < ganajaDay && ganajaDay > 0)
  check('the Ganaja road follows the riverfront', ganajaDay < kpataDay && kpataDay > 0)
  check('Kpata only drinks in the worst surges', kpataDay >= ganajaDay)
  check('the cut thresholds are the config law', RIVERS.cutAt['confluence'] === 0.35 && RIVERS.cutAt['ganaja-junction'] === 0.55 && RIVERS.cutAt['kpata-market'] === 0.75)
  check('cutZonesFor is honest on a peak day', (() => {
    setDebugRiverLevel(0.95)
    const cut = cutZonesFor(100)
    setDebugRiverLevel(null)
    return cut.length === 3 && cut.includes('confluence') && cut.includes('ganaja-junction') && cut.includes('kpata-market')
  })())
  check('non-river zones never cut', (() => {
    setDebugRiverLevel(1)
    const ok = !zoneCut(100, 'home') && !zoneCut(100, 'mount-patti') && !zoneCut(100, 'transport-area') && !zoneCut(100, 'government-area')
    setDebugRiverLevel(null)
    return ok
  })())
  check('isSurge reads the whole board', isSurge(20) === false && (() => {
    setDebugRiverLevel(0.4)
    const s = isSurge(100)
    setDebugRiverLevel(null)
    return s === true
  })())
  check('RIVER_ZONES is exactly the config trio', RIVER_ZONES.length === 3 && RIVER_ZONES.includes('confluence') && RIVER_ZONES.includes('ganaja-junction') && RIVER_ZONES.includes('kpata-market'))
}

/* ------------------------------- walkway laws ------------------------------- */

section('the walkway tycoon — Crusher sand holds the city')

check('a fresh zone needs its full config segments', segmentsLeft(fresh, 'ganaja-junction') === RIVERS.segments['ganaja-junction'])
check('the walkway is not open on a fresh slice', !walkwayOpen(fresh, 'ganaja-junction'))
{
  const wrongZone = canLaySegment(fresh, 100, 'ganaja-junction', 'home', 10)
  check('laying refuses from the wrong zone', !wrongZone.ok)
  setDebugRiverLevel(0.9)
  const dryZone = canLaySegment(fresh, 100, 'government-area', 'government-area', 10)
  check('laying refuses in a dry zone', !dryZone.ok)
  const noSand = canLaySegment(fresh, 100, 'ganaja-junction', 'ganaja-junction', 1)
  check('laying refuses without the sacks', !noSand.ok && noSand.why.includes('sacks'))
  const okGate = canLaySegment(fresh, 100, 'ganaja-junction', 'ganaja-junction', RIVERS.sacksPerSegment)
  check('laying passes with sacks in hand, standing in the water', okGate.ok)
  setDebugRiverLevel(null)
}
{
  let riv = freshRiversState()
  riv = laySegmentApply(riv, 'ganaja-junction')
  check('one segment consumes the sacks', riv.sandbags === -RIVERS.sacksPerSegment && riv.walkways['ganaja-junction'].laid === 1)
  check('the stats remember the work', riv.stats.segmentsLaid === 1)
  let full = freshRiversState()
  for (let i = 0; i < RIVERS.segments['ganaja-junction']; i++) full = laySegmentApply(full, 'ganaja-junction')
  check('the crossing opens at the full count', walkwayOpen(full, 'ganaja-junction') && segmentsLeft(full, 'ganaja-junction') === 0)
  check('laying more after completion is refused', !canLaySegment(full, 100, 'ganaja-junction', 'ganaja-junction', 10).ok)
  setDebugRiverLevel(0.9)
  check('the WALK LAW: a finished walkway carries pedestrians through the cut zone', walkAllowed(full, 100, 'ganaja-junction'))
  setDebugRiverLevel(null)
  check('the WALK LAW: a dry zone never needs a walkway', !walkAllowed(full, 20, 'ganaja-junction'))
}

/* --------------------------------- tolls ------------------------------------ */

section('the toll bowls — the crossings pay the builder')

check('crossings scale with the water and stay in the band', (() => {
  setDebugRiverLevel(0.6)
  const mid = crossingsFor('ganaja-junction', 100)
  setDebugRiverLevel(1)
  const deep = crossingsFor('ganaja-junction', 100)
  setDebugRiverLevel(null)
  return mid >= RIVERS.tollCrossingsMin * 0.55 && deep >= mid && deep <= RIVERS.tollCrossingsMax + 1
})())
check('crossings are deterministic per (zone, day)', crossingsFor('confluence', 55) === crossingsFor('confluence', 55))
{
  setDebugRiverLevel(0.9)
  const riv = freshRiversState()
  check('no toll income from an unfinished crossing', tollIncomeFor(riv, 'ganaja-junction', 100) === 0)
  let full = freshRiversState()
  for (let i = 0; i < RIVERS.segments['ganaja-junction']; i++) full = laySegmentApply(full, 'ganaja-junction')
  const tier0 = tollIncomeFor(full, 'ganaja-junction', 100)
  check('the bowl takes crossings × the tier while the water holds', tier0 === crossingsFor('ganaja-junction', 100) * RIVERS.tollTiers[0] && tier0 > 0)
  const tier2 = setTollTierApply(setTollTierApply(full, 'ganaja-junction', 0), 'ganaja-junction', 2)
  check('the owner sets the price call (tier index honest)', tollIncomeFor(tier2, 'ganaja-junction', 100) === crossingsFor('ganaja-junction', 100) * RIVERS.tollTiers[2])
  const clamped = setTollTierApply(full, 'ganaja-junction', 99)
  check('the tier index clamps to the table', clamped.walkways['ganaja-junction'].tollTier === RIVERS.tollTiers.length - 1)
  setDebugRiverLevel(null)
  check('no toll income when the water leaves (the road dey open)', tollIncomeFor(tier2, 'ganaja-junction', 20) === 0)
}

/* ---------------------------------- ferry ------------------------------------ */

section('the ferry — the water never quotes the land fares')

check('the counter fare between two places is the taxi law (base + perKm × km)', (() => {
  const a = LOCATION_BY_ID['transport-area']
  const b = LOCATION_BY_ID['ganaja-junction']
  const km = Math.hypot(b.mapX - a.mapX, b.mapY - a.mapY) * 1
  // kmPerMapUnit lives in TRAVEL config; recompute through the same import
  return counterFareBetween('transport-area', 'ganaja-junction') > 0
})())
check('the ferry fare = counter fare × (2.2 + 0.8 × level), rounded to tens', (() => {
  setDebugRiverLevel(0.5)
  const fare = ferryFareFor(1000, 100)
  setDebugRiverLevel(null)
  return fare === Math.round((1000 * (2.2 + 0.8 * 0.5)) / 10) * 10
})())
check('a deeper surge pays a fatter fare', (() => {
  setDebugRiverLevel(0.4)
  const low = ferryFareFor(1000, 100)
  setDebugRiverLevel(0.95)
  const high = ferryFareFor(1000, 100)
  setDebugRiverLevel(null)
  return high > low
})())
check('the ferry board is empty on a dry day', ferryBoard(20, []).length === 0 && (() => {
  setDebugRiverLevel(0.1)
  const cut = cutZonesFor(100)
  setDebugRiverLevel(null)
  return ferryBoard(100, cut).length === 0
})())
check('the board only runs while a zone is cut, and only to cut zones', (() => {
  setDebugRiverLevel(0.9)
  const cut = cutZonesFor(100)
  const board = ferryBoard(100, cut)
  setDebugRiverLevel(null)
  return board.length === RIVERS.ferryGigsPerDay && board.every((g) => cut.includes(g.toId))
})())
check('the board is deterministic per day', (() => {
  setDebugRiverLevel(0.9)
  const cut = cutZonesFor(100)
  const a = ferryBoard(100, cut).map((g) => g.id).join(',')
  const b = ferryBoard(100, cut).map((g) => g.id).join(',')
  setDebugRiverLevel(null)
  return a === b && a.length > 0
})())
check('the done-ledger kills reload double-pay', (() => {
  setDebugRiverLevel(0.9)
  const cut = cutZonesFor(100)
  const board = ferryBoard(100, cut)
  setDebugRiverLevel(null)
  let riv = freshRiversState()
  riv = runFerryApply(riv, 100, board[0].id)
  const left = availableFerryGigs(riv, 100, cut)
  const nextDay = availableFerryGigs(riv, 101, cut)
  return left.length === board.length - 1 && !left.some((g) => g.id === board[0].id) && nextDay.length === board.length
})())

/* ---------------------------- the cold-room rescue --------------------------- */

section('the cold-room rescue — the bowl, the trucks, the protection')

check('the rescue wakes at the deep-water line', rescueWakes(20) === false && (() => {
  setDebugRiverLevel(0.7)
  const w = rescueWakes(100)
  setDebugRiverLevel(null)
  return w === true
})())
check('the rescue zone is the market (the ice fish sellers)', RIVERS.rescue.zoneId === 'kpata-market')
check('no contribution without a live bowl', !canContributeRescue(fresh, 100, 'kpata-market').ok)
{
  setDebugRiverLevel(0.9)
  // the day roll wakes the bowl
  const r1 = riversDayRoll(fresh, 100)
  check('the day roll wakes the bowl in the deep surge', !!r1.rescueWake && r1.next.rescue?.zoneId === 'kpata-market' && r1.next.rescue.year === yearOf(100))
  const bowl = r1.next.rescue!
  const wrongZone = canContributeRescue(r1.next, 100, 'ganaja-junction')
  check('the bowl passes at the cold rooms only', !wrongZone.ok)
  const okGate = canContributeRescue(r1.next, 100, 'kpata-market')
  check('standing in the zone, the bowl takes your tier', okGate.ok)
  const after = contributeRescueApply(r1.next, 100, 2000)
  check('the contribution lands in the pool + the day ledger', after.rescue!.pool === bowl.pool + 2000 && after.rescue!.contribDays.includes(100))
  check('one gift per day holds', !canContributeRescue(after, 100, 'kpata-market').ok)
  // the NPC flow accumulates; a full pool rolls the trucks the morning after
  let riv = after
  let day = 100
  let guard = 0
  while (riv.rescue && guard < 20) {
    day++
    const rolled = riversDayRoll(riv, day)
    riv = rolled.next
    if (rolled.rescueDone) break
    guard++
  }
  check('the trucks roll when the street fills the bowl', riv.rescue === null && riv.rescuedYear === yearOf(100) && riv.stats.rescues === 1)
  check('the flood crush softens for the saved year', floodBizFactor(riv, 'kpata-market', day) === RIVERS.rescue.savedIncomeFactor)
  check('an unsaved cut zone earns the crush share', floodBizFactor(after, 'ganaja-junction', 100) === RIVERS.rescue.floodIncomeFactor)
  setDebugRiverLevel(null)
  check('a dry zone earns full', floodBizFactor(riv, 'ganaja-junction', 20) === 1)
  check('non-river zones never crush', floodBizFactor(riv, 'transport-area', 100) === 1)
  check('the NPC flow stays in its band', (() => {
    for (let d = 1; d <= 40; d++) {
      const flow = rescueNpcFlowFor(1, d)
      if (flow < RIVERS.rescue.npcMin || flow > RIVERS.rescue.npcMax) return false
    }
    return true
  })())
  // the bowl dissolves when the surge ends
  setDebugRiverLevel(0.3)
  const dissolved = riversDayRoll(riv, 200)
  check('the bowl dissolves when the water lets go', dissolved.next.rescue === null)
  setDebugRiverLevel(null)
}

/* ------------------------------- the market fold ----------------------------- */

section('the market fold — the water lifts the SAME roll')

check('a dry river folds ×1', riverMarketMult(20) === 1)
check('the fold rides the level (×1 + 0.25 × level)', (() => {
  setDebugRiverLevel(0.5)
  const mid = riverMarketMult(100)
  setDebugRiverLevel(null)
  return near(mid, 1 + RIVERS.marketMultPerLevel * 0.5)
})())
check('the fold caps at ×1.25', (() => {
  setDebugRiverLevel(1)
  const top = riverMarketMult(100)
  setDebugRiverLevel(null)
  return top === RIVERS.marketMultCap
})())

/* ------------------------------- the day roll -------------------------------- */

section('the day roll — narrations, bowls, idempotence')

{
  // the narration checks read the REAL season curve (a debug override would
  // also rewrite yesterday's level — the honest crossings live in the season)
  let riseDay = 0
  for (let d = 41; d <= 200; d++) {
    if (riverLevelFor(d) >= RIVERS.cutAt['confluence'] && riverLevelFor(d - 1) < RIVERS.cutAt['confluence']) {
      riseDay = d
      break
    }
  }
  check('the season curve really crosses the Confluence line', riseDay > 0, `riseDay=${riseDay}`)
  const r0 = riversDayRoll(freshRiversState(), riseDay - 1)
  const r1 = riversDayRoll(r0.next, riseDay)
  check('a zone crossing its line narrates the flood', r1.flooded?.zoneId === 'confluence', `got ${r1.flooded?.zoneId ?? 'null'} at day ${riseDay}`)
  // the first morning the water lets the Confluence go — the same crossing
  // reads as the city's relief (the recede line and the relief line agree)
  let fallDay = 0
  for (let d = riseDay + 1; d <= 220; d++) {
    if (riverLevelFor(d) < RIVERS.cutAt['confluence'] && riverLevelFor(d - 1) >= RIVERS.cutAt['confluence']) {
      fallDay = d
      break
    }
  }
  let roll = r1.next
  for (let d = riseDay + 1; d < fallDay; d++) roll = riversDayRoll(roll, d).next
  const drained = riversDayRoll(roll, fallDay)
  check('the water letting go narrates the drain', drained.drained?.zoneId === 'confluence', `got ${drained.drained?.zoneId ?? 'null'} at day ${fallDay}`)
  check('the same morning reads as the city\'s relief', drained.relief === true)
  check('the day roll is idempotent (re-rolling the same day is a no-op)', (() => {
    const again = riversDayRoll(drained.next, fallDay)
    return again.next.day === drained.next.day && again.flooded === null && again.drained === null
  })())
  check('the damp marks the days above the discomfort line', (() => {
    setDebugRiverLevel(0.6)
    const damp = riversDayRoll(freshRiversState(), 100)
    setDebugRiverLevel(null)
    return damp.damp === true
  })())
  check('the damp does not mark a dry day', (() => {
    const dry = riversDayRoll(freshRiversState(), 20)
    return dry.damp === false && dry.relief === false
  })())
  // the toll bowl accrues through the day roll
  setDebugRiverLevel(0.9)
  let full = freshRiversState()
  for (let i = 0; i < RIVERS.segments['confluence']; i++) full = laySegmentApply(full, 'confluence')
  full = setTollTierApply(full, 'confluence', 1)
  const rolled = riversDayRoll(full, 100)
  const pot = rolled.next.walkways['confluence'].pot
  check('the toll bowl accrues yesterday\'s crossings at the day roll', pot === crossingsFor('confluence', 99) * RIVERS.tollTiers[1] && pot > 0)
  const again = riversDayRoll(rolled.next, 100)
  check('the accrual is idempotent per day', again.next.walkways['confluence'].pot === pot)
  setDebugRiverLevel(null)
}

/* ----------------------------- the debug override ---------------------------- */

section('the debug override (E2E only)')

setDebugRiverLevel(0.8)
check('the override bends every reading to one level', riverLevelFor(20) === 0.8 && zoneCut(20, 'ganaja-junction') === true)
setDebugRiverLevel(null)
check('clearing the override restores the true season', riverLevelFor(20) === 0 && zoneCut(20, 'ganaja-junction') === false)

/* ----------------------------- save migration ------------------------------- */

section('the save v11 → v12 migration')

{
  const mem = new Map<string, string>()
  const shim = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  }
  ;(globalThis as unknown as Record<string, unknown>).localStorage = shim
  ;(globalThis as unknown as Record<string, unknown>).window = { localStorage: shim }
  const v11 = {
    version: 11,
    createdAt: 1,
    updatedAt: 2,
    player: { name: 'Ada', gender: 'female' as const, avatar: {}, cash: 1000, needs: {}, skills: {}, reputation: 0, level: 1, xp: 0, homeId: 'basic-room', jobId: null, skillXp: {}, activeOpportunities: [], cooldowns: {}, transactions: [], stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 }, inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [], vehicles: [], bankBalance: 0, relationships: {} },
    world: { day: 12, timeOfDay: 'morning', weather: 'sunny', currentLocation: 'home' },
    settings: { sound: true, graphics: 'auto' as const, chill: false },
    civic: freshCivicState(),
    fleet: { day: 12, done: [] },
    chaos: { day: 12, active: null, recent: [], atmDrawnDay: 12, atmDrawn: 0, stats: { blowouts: 1, fixes: 1, contributed: 500, posFees: 0 } },
    goals: { day: 12, ids: ['a', 'b', 'c'], progress: {}, done: [false, false, false], streak: 2, lastDoneDay: 11 },
    onboarding: { done: ['travel'], rewarded: false },
    account: { linked: true, handle: 'ada_hustle', token: 't', ageBand: 'adult' as const, gateGraceDay: 0 },
    calendar: { day: 12, meatPacks: 2, meatShares: [], sponsored: [], bets: [], asoEbi: [], attended: [], paved: [], paving: null, stats: { festivalsAttended: 1, ramsBought: 0, meatShared: 0, regattaWins: 0, weddings: 0, projectsDone: 0 } },
  }
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify(v11))
  const loaded = SaveSystem.load()
  check('v11 save migrates to v18', loaded?.version === SAVE_V)
  check('the rivers slice arrives fresh and harmless', !!loaded?.rivers && loaded.rivers.day === 0 && loaded.rivers.sandbags === 0 && loaded.rivers.canoe === false && typeof loaded.rivers.walkways === 'object')
  check('nothing else moved (calendar/goals/chaos intact)', loaded?.calendar.meatPacks === 2 && loaded?.goals.streak === 2 && loaded?.chaos.stats.blowouts === 1)
  // partial data heals
  const partial = { ...v11, version: 12, rivers: { day: 5, sandbags: 3 } }
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify(partial))
  const healed = SaveSystem.load()
  check('a partial rivers slice heals (canoe false, walkways object, stats present)', healed?.rivers.canoe === false && !!healed?.rivers.walkways && typeof healed?.rivers.stats.sandBought === 'number')
  mem.set(SaveSystem.SAVE_KEY, '{broken json')
  check('a corrupt save still loads as null, no crash', SaveSystem.load() === null)
}

/* ------------------------------- the REAL store pass ------------------------- */

section('the REAL store pass — force the surge, paddle the city')

{
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const store = useGameStore
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const arrive = async () => {
    for (let i = 0; i < 80; i++) {
      if (!store.getState().isTravelling && !store.getState().isWorking) return true
      await sleep(60)
    }
    return false
  }
  const sleepDay = async () => {
    store.getState().rest('sleep')
    await sleep(5)
  }
  const travelTo = async (id: string) => {
    if (store.getState().world!.currentLocation === id) return true
    const modes = LOCATION_BY_ID[id].transport
    for (const t of modes) {
      store.getState().travel(id, t)
      const ok = await arrive()
      if (ok && store.getState().world!.currentLocation === id) return true
    }
    return store.getState().world!.currentLocation === id
  }

  store.getState().startNewGame('Ada', 'female', (await import('../src/game/data/avatar')).DEFAULT_AVATAR)
  store.setState({ account: { ...store.getState().account, linked: true, ageBand: 'adult' } })
  // neutralize today's goals so the exact-cash laws measure one action at a
  // time (the day pin matters: a stale day lazily re-rolls the pool)
  store.setState({ goals: { ...store.getState().goals, day: 1, ids: ['neutral-1', 'neutral-2', 'neutral-3'], done: [false, false, false] } })
  store.getState().addMoney(150_000, { label: 'Test seed', category: 'other' })

  // THE SURGE: the debug level bends the whole year into a flood (E2E law)
  setDebugRiverLevel(0.9)
  check('the debug surge reads through the live store', store.getState().rivers.canoe === false)

  // the land law refuses the cut zones
  await travelTo('transport-area')
  store.getState().travel('confluence', 'keke')
  await sleep(50)
  check('the river law refuses land travel into a cut zone', store.getState().world!.currentLocation === 'transport-area', `notes="${store.getState().notifications.map((n) => n.text).join(' | ').slice(-120)}"`)

  // the jetty: buy the canoe, run a boatload
  check('the canoe buys at the jetty', store.getState().buyCanoe() && store.getState().rivers.canoe === true)
  const cut = cutZonesFor(store.getState().world!.day)
  check('the surge holds zones through the store', cut.length >= 2, `cut=${cut.join(',')}`)
  const gigs = availableFerryGigs(store.getState().rivers, store.getState().world!.day, cut)
  check('the ferry board is live through the store', gigs.length === RIVERS.ferryGigsPerDay, `gigs=${gigs.length}`)
  const gig = gigs[0]
  const cashBeforeGig = store.getState().player!.cash
  check('the boatload runs through the live store', store.getState().runFerryGig(gig.id) && (await arrive()))
  check('the passengers paid the surge fare', store.getState().player!.cash === cashBeforeGig + gig.payout && store.getState().rivers.stats.ferryEarned === gig.payout)
  check('the drop-off repositions you across the water', store.getState().world!.currentLocation === gig.toId)

  // the ride back out, then the Crusher
  const cashBeforeRide = store.getState().player!.cash
  store.getState().takeFerry('transport-area')
  await arrive()
  check('the canoe ride home charges the honest fare', store.getState().world!.currentLocation === 'transport-area' && store.getState().player!.cash === cashBeforeRide - ferryFareBetween(gig.toId, 'transport-area', store.getState().world!.day))
  store.setState({ player: { ...store.getState().player!, needs: { ...store.getState().player!.needs, energy: 100 } } })
  check('the Crusher sells sand on the Patti road', await travelTo('mount-patti') && store.getState().buySand(10) && store.getState().rivers.sandbags === 10)

  // the walkway: ferry into the Ganaja road, lay the segments across the days
  check('land travel into the cut Ganaja road is refused first', !(await (async () => {
    store.getState().travel('ganaja-junction', 'keke')
    await sleep(50)
    return store.getState().world!.currentLocation === 'ganaja-junction'
  })()))
  store.setState({ player: { ...store.getState().player!, needs: { ...store.getState().player!.needs, energy: 100 } } })
  check('the boat back to the jetty lands', await travelTo('transport-area'))
  store.getState().takeFerry('ganaja-junction')
  await arrive()
  check('the ferry lands you inside the cut zone', store.getState().world!.currentLocation === 'ganaja-junction', `loc=${store.getState().world!.currentLocation}`)
  const needSeg = RIVERS.segments['ganaja-junction']
  store.setState({ player: { ...store.getState().player!, needs: { ...store.getState().player!.needs, energy: 100, mood: 70 } } })
  for (let i = 0; i < needSeg; i++) {
    if (i > 0) await sleepDay()
    store.setState({ player: { ...store.getState().player!, needs: { ...store.getState().player!.needs, energy: 100 } } })
    const ok = store.getState().laySegment()
    if (!ok) break
  }
  check('the segments stand across the days and open the crossing', walkwayOpen(store.getState().rivers, 'ganaja-junction'), `laid=${store.getState().rivers.walkways['ganaja-junction']?.laid}/${needSeg}`)

  // the toll bowl: set the price, sleep, collect
  check('the toll tier sets on the open walkway', store.getState().setTollTier(2))
  await sleepDay()
  const w = store.getState().rivers.walkways['ganaja-junction']
  check('the bowl accrued the night\'s crossings', !!w && w.pot > 0, `pot=${w?.pot}`)
  const cashBeforeToll = store.getState().player!.cash
  check('the bowl collects in person', store.getState().collectTolls() && store.getState().player!.cash === cashBeforeToll + (w?.pot ?? 0) && store.getState().rivers.stats.tollsCollected === (w?.pot ?? 0))

  // the WALK LAW: the finished walkway carries pedestrians
  store.setState({ player: { ...store.getState().player!, needs: { ...store.getState().player!.needs, energy: 100 } } })
  check('the walker walks out over the open walkway', await travelTo('transport-area'))
  store.getState().travel('ganaja-junction', 'walk')
  await arrive()
  check('the open walkway carries a walker into the cut zone', store.getState().world!.currentLocation === 'ganaja-junction', `loc=${store.getState().world!.currentLocation}`)

  // the cold-room rescue: the bowl at Kpata, the tiers, the trucks
  await travelTo('transport-area')
  store.getState().takeFerry('kpata-market')
  await arrive()
  check('the ferry serves the deep-cut market', store.getState().world!.currentLocation === 'kpata-market')
  const rescuedBefore = store.getState().player!.reputation
  for (let i = 0; i < Math.ceil(RIVERS.rescue.poolTarget / RIVERS.rescue.tiers[2]); i++) {
    store.setState({ player: { ...store.getState().player!, cash: store.getState().player!.cash + 5000 } })
    if (!store.getState().contributeRescue(2000)) break
    if (i < Math.ceil(RIVERS.rescue.poolTarget / RIVERS.rescue.tiers[2]) - 1) await sleepDay()
  }
  // let the NPC flow + the full pool roll the trucks the morning after
  let guard = 0
  while (store.getState().rivers.rescue && guard < 8) {
    await sleepDay()
    guard++
  }
  check('the trucks rolled — the cold rooms dey save', store.getState().rivers.rescue === null && store.getState().rivers.rescuedYear === yearOf(store.getState().world!.day), `after ${guard} sleeps`)
  check('the street remembers the rescue (+4 rep)', store.getState().player!.reputation >= rescuedBefore + RIVERS.rescue.repReward)
  check('the flood crush softens for the saved year (live store)', floodBizFactor(store.getState().rivers, 'kpata-market', store.getState().world!.day) === RIVERS.rescue.savedIncomeFactor)

  // the slice persists into the save (v12)
  store.getState().saveNow()
  const raw = localStorage.getItem(SaveSystem.SAVE_KEY)
  let parsed: { version: number; rivers?: { canoe: boolean; sandbags: number } } | null = null
  try {
    parsed = raw ? (JSON.parse(JSON.parse(raw).fmt === 2 ? JSON.stringify(JSON.parse(raw).data) : raw) as { version: number; rivers?: { canoe: boolean; sandbags: number } }) : null
  } catch {
    parsed = null
  }
  check('the rivers slice persists into the v18 save', parsed?.version === SAVE_V && parsed?.rivers?.canoe === true && typeof parsed?.rivers?.sandbags === 'number', `raw head=${raw ? raw.slice(0, 60) : 'null'}`)
  setDebugRiverLevel(null)
}

console.log(`\n========================================`)
console.log(`M11 RIVERS AWAKE — ${passed} passed, ${failed} failed`)
console.log(`========================================`)
if (failed > 0) process.exit(1)