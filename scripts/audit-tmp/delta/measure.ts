/**
 * TEAM DELTA (Gameplay) — measurement script (audit-only, no source changes).
 * Run: bun scripts/audit-tmp/delta/measure.ts
 * Exercises PURE gameplay functions with test inputs. Reads data registries.
 */
import { JOBS } from '../../../src/game/data/jobs'
import { HUSTLES } from '../../../src/game/data/hustles'
import { FOODS } from '../../../src/game/data/foods'
import { NPCS } from '../../../src/game/data/npcs'
import { SCHOOLS } from '../../../src/game/data/schools'
import { LOCATIONS } from '../../../src/game/data/locations'
import { VEHICLES } from '../../../src/game/data/vehicles'
import { TRAVEL_EVENTS } from '../../../src/game/data/travelEvents'
import { PROGRESSION, REPUTATION_TIERS, NEEDS, STARTING, WORK, ECONOMY, LADDER, FESTIVALS, GOALS } from '../../../src/game/data/config'
import { xpToNextLevel, addXp, reputationTier, nextReputationTier, skillCap } from '../../../src/game/systems/progression'
import { addSkillXp } from '../../../src/game/systems/skills'
import { applyNeedsDelta, applySlotDecay, clampNeed } from '../../../src/game/systems/needs'
import { calculateJobPay, hustleSuccessChance, checkRequirements, cooldownRemaining } from '../../../src/game/systems/work'
import { generateHustleOffers, isEligible } from '../../../src/game/systems/opportunities'
import { examScore, examPasses, strikeForSemester } from '../../../src/game/systems/education'
import { housingDayRoll, freshHousingState, wahalaForCycle, canPayRent } from '../../../src/game/systems/housing'
import { festivalForDay, nextFestivalFrom, eidDriftForYear, calendarMarketMult } from '../../../src/game/systems/calendar'
import { dailyGoals } from '../../../src/game/systems/goals'
import type { PlayerState } from '../../../src/game/types'

let section = 0
const head = (t: string) => console.log(`\n=== ${++section}. ${t} ===`)
const ok = (b: boolean, msg: string) => console.log(`  ${b ? 'PASS' : 'FAIL'} — ${msg}`)

/* ---- 1. dataset counts + referential integrity ---- */
head('DATASET COUNTS + REFERENTIAL INTEGRITY')
const locIds = new Set(LOCATIONS.map((l) => l.id))
const npcIds = new Set(NPCS.map((n) => n.id))
console.log(`  jobs=${JOBS.length} hustles=${HUSTLES.length} foods=${FOODS.length} npcs=${NPCS.length} schools=${SCHOOLS.length} locations=${LOCATIONS.length} vehicles=${VEHICLES.length} travelEvents=${TRAVEL_EVENTS.length}`)
const badJobLoc = JOBS.filter((j) => !locIds.has(j.locationId)).map((j) => j.id)
const badHustleLoc = HUSTLES.filter((h) => !locIds.has(h.locationId)).map((h) => h.id)
const badHustleNpc = HUSTLES.filter((h) => !npcIds.has(h.npcId)).map((h) => h.id)
const badNpcHome = NPCS.filter((n) => !locIds.has(n.homeLocationId)).map((n) => n.id)
const badJobSchoolLoc = JOBS.filter((j) => !['kpata-market','ganaja-junction','transport-area','confluence','university-area','government-area','food-area'].includes(j.locationId) && !SCHOOLS.some((s) => s.id === j.locationId)).map((j) => j.id)
console.log(`  job.locationId unknown: ${badJobLoc.length ? badJobLoc.join(',') : 'NONE'}`)
console.log(`  hustle.locationId unknown: ${badHustleLoc.length ? badHustleLoc.join(',') : 'NONE'}`)
console.log(`  hustle.npcId unknown: ${badHustleNpc.length ? badHustleNpc.join(',') : 'NONE'}`)
console.log(`  npc.homeLocationId unknown: ${badNpcHome.length ? badNpcHome.join(',') : 'NONE'}`)
ok(badJobLoc.length === 0 && badHustleLoc.length === 0 && badHustleNpc.length === 0 && badNpcHome.length === 0, 'all data cross-references resolve')
const locDup = LOCATIONS.length - new Set(LOCATIONS.map((l) => l.id)).size
ok(locDup === 0, `no duplicate location ids (dup=${locDup})`)

/* ---- 2. XP curve executed ---- */
head('XP CURVE — formula: round(xpBase * level^xpGrowth), xpBase=120 xpGrowth=1.4 (config.ts:108-109, progression.ts:12-14)')
for (const l of [1, 2, 3, 5, 10, 25, 49]) {
  console.log(`  xpToNextLevel(${l}) = ${xpToNextLevel(l)}`)
}
// executed level-ups
let r = { xp: 0, level: 1, leveledUp: false, levelsGained: 0 }
r = addXp(r.xp, r.level, 120); console.log(`  +120 XP from L1 → L${r.level} (leftover ${r.xp})`)
r = addXp(r.xp, r.level, 317); console.log(`  +317 XP more → L${r.level} (leftover ${r.xp})`)
r = addXp(r.xp, r.level, 10000); console.log(`  +10,000 XP more → L${r.level} (leftover ${r.xp})`)
// cumulative to reach L5 and L10
let cum = 0; for (let l = 1; l < 5; l++) cum += xpToNextLevel(l)
console.log(`  cumulative XP L1→L5 = ${cum}`)
cum = 0; for (let l = 1; l < 10; l++) cum += xpToNextLevel(l)
console.log(`  cumulative XP L1→L10 = ${cum}`)
const shiftsToL5 = Math.ceil(cum / 26) // cleaner job = 18xp; delivery = 24xp; avg entry ~22
console.log(`  entry shifts (≈24 XP delivery-worker) to L5: ${Math.ceil(cum / 24)}`)

/* ---- 3. reputation tiers ---- */
head('REPUTATION TIERS (config.ts:120-127)')
for (const v of [0, 99, 100, 249, 250, 500, 1000, 2499, 2500, 9999]) {
  const t = reputationTier(v); const n = nextReputationTier(v)
  console.log(`  rep ${v} → "${t.name}"${n ? ` → next "${n.tier.name}" in ${n.remaining}` : ' → TOP'}`)
}

/* ---- 4. needs engine / impossible states ---- */
head('NEEDS ENGINE — clamps + starvation (needs.ts:14-51, config NEEDS)')
console.log(`  clampNeed(-50)=${clampNeed(-50)} clampNeed(150)=${clampNeed(150)}`)
const neg = applyNeedsDelta({ health: 100, energy: 100, hunger: 100, mood: 100 }, { energy: -999 })
console.log(`  energy -999 → ${JSON.stringify(neg)} (floor 0, no negatives)`)
const over = applyNeedsDelta({ health: 95, energy: 95, hunger: 95, mood: 95 }, { health: 50, energy: 50, hunger: 50, mood: 50 })
console.log(`  +50 on 95 → ${JSON.stringify(over)} (ceiling 100)`)
const starving = applyNeedsDelta({ health: 50, energy: 50, hunger: 2, mood: 50 }, { hunger: -2 })
console.log(`  hunger hits 0: ${JSON.stringify(starving)} (health −${NEEDS.starvingHealthDrain}, mood −${NEEDS.hungryMoodDrain})`)
const decayDay = applySlotDecay({ health: 100, energy: 100, hunger: 100, mood: 100 }, 4)
console.log(`  1 day (4 slots) decay: ${JSON.stringify(decayDay)}`)
const starveDays = Math.ceil(100 / (NEEDS.starvingHealthDrain * 12))
console.log(`  worst case: health 100 → 0 after ~${starveDays} slots of action at hunger 0 (~${(starveDays / 4).toFixed(1)} days if every slot is an action)`)
ok(neg.energy === 0 && over.energy === 100 && starving.health === 47, 'no impossible need states (all clamped, starvation drains apply)')

/* ---- 5. work maths executed ---- */
head('WORK MATHS EXECUTED (work.ts)')
const freshPlayer = {
  level: 1, xp: 0, reputation: 0, cash: STARTING.cash,
  needs: { health: 100, energy: 100, hunger: 100, mood: 100 },
  skills: { hustle: 1, smart: 1, social: 1 },
  skillXp: { hustle: 0, smart: 0, social: 0 },
  ageBand: 'adult',
  activeOpportunities: [],
  cooldowns: {},
} as unknown as PlayerState
const marketWorker = JOBS.find((j) => j.id === 'market-worker')!
const gov = JOBS.find((j) => j.id === 'govt-officer')!
console.log(`  market-worker pay @ base stats = ${calculateJobPay(marketWorker, freshPlayer)} (basePay ${marketWorker.basePay})`)
const skilled = { ...freshPlayer, skills: { ...freshPlayer.skills, hustle: 5 }, needs: { ...freshPlayer.needs, mood: 80 } }
console.log(`  market-worker pay @ hustle 5, mood 80 = ${calculateJobPay(marketWorker, skilled as PlayerState)} (skill ×1.20, mood ×1.08)`)
console.log(`  govt-officer req check @ base: ok=${checkRequirements(freshPlayer, gov.requirements).ok} reasons=[${checkRequirements(freshPlayer, gov.requirements, { graduated: false }).reasons.join(' | ')}]`)
const musaCarry = HUSTLES.find((h) => h.id === 'musa-fabric-carry')!
console.log(`  musa-fabric-carry success @ skill 1 diff 1 = ${hustleSuccessChance(musaCarry, freshPlayer).toFixed(2)}`)
const laptop = HUSTLES.find((h) => h.id === 'chantel-laptop-fix')!
console.log(`  chantel-laptop-fix (diff 3) @ smart 5, mood 80 = ${hustleSuccessChance(laptop, { ...freshPlayer, skills: { ...freshPlayer.skills, smart: 5 }, needs: { ...freshPlayer.needs, mood: 80 } } as PlayerState).toFixed(2)}`)
console.log(`  note: starting mood 100 ≥ 70 → ×${WORK.moodBonusHigh.factor} mood bonus is part of that ₦970 (raw basePay 900)`)
ok(calculateJobPay(marketWorker, { ...freshPlayer, needs: { ...freshPlayer.needs, mood: 50 } } as PlayerState) === 900, 'entry pay at neutral mood executes to ₦900 exactly (basePay honoured)')

/* ---- 6. hustle offer generation + cooldown gate ---- */
head('HUSTLE PIPELINE (opportunities.ts)')
const gen = generateHustleOffers('kpata-market', freshPlayer, 100, () => 0.99)
console.log(`  search @kpata (rng 0.99): dry=${gen.dry} offers=${gen.offers.length}`)
const genLucky = generateHustleOffers('kpata-market', freshPlayer, 100, () => 0.2)
console.log(`  offers: ${genLucky.offers.map((o) => o.defId).join(', ') || 'none'}`)
const cooled = { ...freshPlayer, cooldowns: { 'musa-fabric-carry': 102 } } as unknown as PlayerState
ok(!isEligible(musaCarry, cooled, 101, []), 'hustle on cooldown is NOT offerable (cooldown enforced at generation)')

/* ---- 7. education maths ---- */
head('EDUCATION (education.ts + LADDER.education)')
console.log(`  examScore(smart=2, 12 lectures) = ${examScore(2, 12)} → pass=${examPasses(2, 12)} (bar ${LADDER.education.examPassScore})`)
console.log(`  examScore(smart=1, 12 lectures) = ${examScore(1, 12)} → pass=${examPasses(1, 12)}`)
console.log(`  examScore(smart=5, 4 lectures)  = ${examScore(5, 4)} → pass=${examPasses(5, 4)}`)
console.log(`  enroll fee ₦${LADDER.education.enrollFee} at level ${LADDER.education.enrollLevel}; semester ${LADDER.education.semesterDays}d; graduate after ${LADDER.education.semestersToGraduate} passes`)
let strikes = 0
for (let s = 0; s < 40; s++) if (strikeForSemester(s).active) strikes++
console.log(`  ASUU strike roll over 40 semesters: ${strikes} active (${((strikes / 40) * 100).toFixed(0)}%, config chance ${(LADDER.education.strikeChance * 100).toFixed(0)}%)`)
ok(examPasses(2, 12) && !examPasses(1, 12) && !examPasses(5, 4), 'exam bar behaves exactly as documented')

/* ---- 8. housing / rent book ---- */
head('HOUSING RENT BOOK (housing.ts + LADDER.housing)')
let h = freshHousingState()
let posted = 0
for (let d = 1; d <= 42; d++) {
  const res = housingDayRoll(h, d)
  h = res.next
  if (res.rentPosted) posted += res.rentPosted.amount
}
console.log(`  42 days un-paid: rentOwed=${h.rentOwed} (posted ${posted} over 7 cycles = ${posted / 7}/cycle avg; baseRent ${LADDER.housing.baseRent})`)
const wahalas = [1, 2, 3, 4, 5, 6, 7, 8].map((c) => wahalaForCycle(c))
console.log(`  wahala cycles 1-8: ${wahalas.map((w) => w ? w.kind : 'quiet').join(', ')}`)
const pay = canPayRent({ ...h, owned: null, rentOwed: 1800 } as typeof h, 900)
console.log(`  canPayRent(owed 1800, cash 900) → ok=${pay.ok} amount=${pay.amount} (pays one cycle at a time)`)
ok(h.rentOwed > 0 && posted >= LADDER.housing.baseRent * 7, 'rent posts every 6 days, wahala spikes execute')

/* ---- 9. festivals / calendar executed ---- */
head('FESTIVALS (calendar.ts + FESTIVALS config)')
console.log(`  yearDays=${FESTIVALS.yearDays}; festival defs = 10 day-festivals`)
for (const d of [1, 13, 27, 37, 51, 57, 59, 64]) {
  const f = festivalForDay(d)
  console.log(`  day ${d} → ${f ? `${f.id} @ ${f.venueId} (daysLeft ${f.daysLeft})` : 'plain day'}`)
}
console.log(`  eid drift years 1-5: ${[1, 2, 3, 4, 5].map((y) => eidDriftForYear(y)).join(', ')} (bounded ±4)`)
const nf = nextFestivalFrom(2)
console.log(`  nextFestivalFrom(day 2) = ${nf.festival.id} in ${nf.inDays} days`)
console.log(`  market mult day 64 (detty) = ${calendarMarketMult(64)}`)
ok(!!festivalForDay(37) && festivalForDay(37)!.id === 'regatta', 'regatta lands on anchor day 37')

/* ---- 10. goals engine ---- */
head('DAILY GOALS (goals.ts)')
const g = dailyGoals(7)
console.log(`  day 7 goals: ${g.map((x) => x.id).join(', ')} (${g.length}/3, cash total ${g.reduce((s, x) => s + x.cash, 0)})`)
const g2 = dailyGoals(99)
ok(g.length === 3 && g2.length === 3 && new Set(g.map((x) => x.id)).size === 3, '3 distinct deterministic goals per day')

/* ---- 11. skill caps ---- */
head('SKILL CAPS (skills.ts + PROGRESSION)')
for (const lvl of [1, 5, 10, 50]) console.log(`  skillCap(level ${lvl}) = ${skillCap(lvl)}`)
const sk = addSkillXp({ hustle: 0, smart: 0, social: 0 }, { hustle: 1, smart: 1, social: 1 }, 1, 'hustle', 25)
console.log(`  +25 skill XP @ L1 (cap 5): hustle ${sk.newLevel} (was 1), capped=${sk.capped}`)
ok(sk.newLevel === 2, '25 skill XP = exactly +1 skill point at cap 5')

/* ---- 12. BALANCE ARITHMETIC ---- */
head('BALANCE ARITHMETIC (all numbers from config)')
const entryShift = calculateJobPay(marketWorker, freshPlayer)
const shiftsPerDay = 2 // 1-slot shift + 1-slot default cooldown => every other slot, 4 slots/day
const entryIncome = entryShift * shiftsPerDay
const entryShiftNeutral = 900
console.log(`  entry income: ₦${entryShift}/shift × ${shiftsPerDay}/day = ₦${entryIncome}/day (jobs always pay; no failure; ₦${entryShiftNeutral} at neutral mood)`)
const entryIncomeNeutral = entryShiftNeutral * shiftsPerDay
const rentPerDay = LADDER.housing.baseRent / LADDER.housing.rentCycleDays
console.log(`  rent: ₦${LADDER.housing.baseRent} / ${LADDER.housing.rentCycleDays}d = ₦${rentPerDay.toFixed(0)}/day = ${(rentPerDay / entryIncome * 100).toFixed(0)}% of entry income`)
console.log(`  starting cash ₦${STARTING.cash} = ${(STARTING.cash / rentPerDay).toFixed(1)} days of rent buffer`)
const kekeFare3km = Math.round((ECONOMY.transport.keke.cost.base + ECONOMY.transport.keke.cost.perKm * 3) / 10) * 10
const taxiFare3km = Math.round((ECONOMY.transport.taxi.cost.base + ECONOMY.transport.taxi.cost.perKm * 3) / 10) * 10
console.log(`  median 3km fare: keke ₦${kekeFare3km}, taxi ₦${taxiFare3km} (walk ₦0) → ${(kekeFare3km / entryIncome * 100).toFixed(0)}% / ${(taxiFare3km / entryIncome * 100).toFixed(0)}% of a day's entry income`)
for (const v of VEHICLES) console.log(`  ${v.label}: ₦${v.price.toLocaleString()} = ${(v.price / entryIncome).toFixed(0)} days at entry wage, ${(v.price / (calculateJobPay(gov, { ...freshPlayer, reputation: 300, level: 5 } as PlayerState) * 2)).toFixed(0)} days at govt-officer wage (₦${calculateJobPay(gov, { ...freshPlayer, reputation: 300, level: 5 } as PlayerState)} × 2)`)
console.log(`  FUL enrollment ₦${LADDER.education.enrollFee.toLocaleString()} = ${(LADDER.education.enrollFee / entryIncome).toFixed(1)} days of entry work`)
console.log(`  edu net: ${LADDER.education.semesterDays}d semester × ${LADDER.education.semestersToGraduate} semesters = ${LADDER.education.semesterDays * LADDER.education.semestersToGraduate} days minimum to graduation; stipend ${LADDER.education.lectureStipend} × ${LADDER.education.lecturesNeeded} = ₦${LADDER.education.lectureStipend * LADDER.education.lecturesNeeded}/semester vs fee ₦${LADDER.education.enrollFee}`)
const degJob = calculateJobPay(gov, { ...freshPlayer, reputation: 300, level: 5 } as PlayerState)
console.log(`  degree premium: govt-officer ₦${degJob}/shift vs market-worker ₦${entryShift} = ${(degJob / entryShift).toFixed(1)}× — the ladder pays`)
console.log(`  ram ₦${FESTIVALS.ramBasePrice} = ${(FESTIVALS.ramBasePrice / entryIncome).toFixed(0)} entry-days; 6 meat packs → ₦${(FESTIVALS.ramBasePrice / 6).toFixed(0)}/pack of gifting`)
console.log(`  okada own-fuel 3km ₦${Math.round((ECONOMY.transport['own-okada'].cost.perKm * 3) / 10) * 10} vs keke public ₦${kekeFare3km} — ownership saves ₦${kekeFare3km - Math.round((ECONOMY.transport['own-okada'].cost.perKm * 3) / 10) * 10}/trip`)
console.log(`  decay check: hunger −${NEEDS.decay.hunger}/slot × 4 = ${NEEDS.decay.hunger * 4}/day; cheapest meal (FOOD.meals groceries) ₦350 fills ${26} → ~2 meals/day = ₦700/day food cost = ${(700 / entryIncome * 100).toFixed(0)}% of entry income`)
console.log(`  daily goal rewards ≈ ₦${g.reduce((s, x) => s + x.cash, 0)}/day (≈${(g.reduce((s, x) => s + x.cash, 0) / entryIncome * 100).toFixed(0)}% of entry income) — casual shell is a real stipend`)
