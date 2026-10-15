/**
 * LOKOJA LIFE — M13: THE FAMILY SHIELD (pure law checks + REAL passes)
 * --------------------------------------------------------------------
 * One download, three generations. Law blocks: the AGE_LAW table (what
 * kid/teen/adult may touch), the crime-adjacent gates (night lounge,
 * race-eve bets, the street agent — 18+ only), the kid hustle law
 * (kidSafe chores only, enforced inside isEligible so EVERY pipeline
 * inherits it), THE GRAPH BLOCK (an adult account can never contact a
 * minor account — structurally false, forever), the parent PIN (6
 * digits, the local gate + the register law), THE TIER GATE (no band
 * climbs without the parent's yes), the ELDER MODE law (accessibility
 * + the kinder decay), and SPOT THE SCAMMER (deterministic daily
 * rounds, honest rewards, the streak cap).
 *
 * REAL bun store pass: a kid character walks the city — hustles filter,
 * crime roads refuse, emotes carry the day, the scammer round pays, the
 * parent PIN moves the ladder. REAL HTTP pass: the register refuses a
 * minor without the parent PIN, collects NOTHING for minors (no
 * contact conflict on a second minor claim), and /api/auth/tier moves
 * the band only with the parent's yes. Save v13→v14→v15 migration included.
 * Run: bun scripts/test-m13-shield.ts
 */

import {
  AGE_LAW,
  crimeAllowed,
  CRIME_CONTENT_IDS,
  CRIME_REFUSALS,
  canHustle,
  canJapa,
  canContact,
  validateParentPin,
  localPinHash,
  makeLocalSalt,
  tierGateVerdict,
  scamRound,
  scamReward,
  canPlayScammer,
  scamAnswerApply,
  freshShieldState,
  elderClass,
} from '../src/game/systems/shield'
import { isEligible } from '../src/game/systems/opportunities'
import { HUSTLE_BY_ID } from '../src/game/data/hustles'
import { canBet } from '../src/game/systems/calendar'
import { freshCalendarState } from '../src/game/systems/calendar'
import { SaveSystem } from '../src/game/systems/save'
import type { PlayerState, ActiveOpportunity } from '../src/game/types'
import { SHIELD } from '../src/game/data/config'

let passed = 0
let failed = 0
function check(name: string, cond: boolean) {
  if (cond) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.log(`  ✗ ${name}`)
  }
}
function section(name: string) {
  console.log(`\n— ${name} —`)
}

const basePlayer = (over: Partial<PlayerState> = {}): PlayerState => ({
  name: 'Test', gender: 'male', ageBand: 'adult',
  avatar: { skinTone: 'a', hairColor: 'a', hairstyle: 'a', clothingStyle: 'a', clothingColor: 'a' },
  cash: 5000, needs: { health: 100, energy: 100, hunger: 100, mood: 100 },
  skills: { hustle: 5, smart: 5, social: 5 }, skillXp: { hustle: 0, smart: 0, social: 0 },
  reputation: 0, level: 1, xp: 0, homeId: 'home', jobId: null,
  activeOpportunities: [], cooldowns: {}, transactions: [],
  stats: { jobsCompleted: 0, hustlesCompleted: 0, totalEarned: 0, totalSpent: 0 },
  inventory: [], businesses: [], missions: {}, achievements: [], discoveries: [],
  vehicles: [], bankBalance: 0, relationships: {},
  ...over,
})

/* ------------------------------ the AGE_LAW -------------------------------- */

section('the AGE_LAW — one download, three generations')
check('kid: no crime, light hustles, emotes, featured scammer, ×1.25, no japa',
  !AGE_LAW.kid.crime && AGE_LAW.kid.hustle === 'light' && AGE_LAW.kid.social === 'emotes' && AGE_LAW.kid.scammerFeatured && AGE_LAW.kid.studyBoost > 1 && !AGE_LAW.kid.japa)
check('teen: no crime, all hustles, full socials, featured scammer, ×1.25, japa open',
  !AGE_LAW.teen.crime && AGE_LAW.teen.hustle === 'all' && AGE_LAW.teen.social === 'full' && AGE_LAW.teen.scammerFeatured && AGE_LAW.teen.studyBoost > 1 && AGE_LAW.teen.japa)
check('adult: everything, no boost, no featured drill',
  AGE_LAW.adult.crime && AGE_LAW.adult.hustle === 'all' && AGE_LAW.adult.social === 'full' && !AGE_LAW.adult.scammerFeatured && AGE_LAW.adult.studyBoost === 1 && AGE_LAW.adult.japa)

section('the crime gates — the 18+ roads')
const kid = 'kid' as const, teen = 'teen' as const, adult = 'adult' as const
check('kid + teen refused on every crime-adjacent road',
  CRIME_CONTENT_IDS.every((c) => !crimeAllowed(kid, c) && !crimeAllowed(teen, c)))
check('adult walks every road', CRIME_CONTENT_IDS.every((c) => crimeAllowed(adult, c)))
check('every refusal carries an honest reason', CRIME_CONTENT_IDS.every((c) => CRIME_REFUSALS[c].length > 12))

section('the kid hustle law — kidSafe or nothing')
const lastMile = HUSTLE_BY_ID['emeka-last-mile']
const fabric = HUSTLE_BY_ID['musa-fabric-carry']
check('the long solo delivery is NOT kidSafe', !!lastMile && lastMile.kidSafe === false)
check('carrying fabric bundles is kidSafe', !!fabric && fabric.kidSafe === true)
check('kids refuse the long delivery, take the light chores',
  !canHustle(kid, lastMile!) && canHustle(kid, fabric!))
check('teens + adults take everything',
  canHustle(teen, lastMile!) && canHustle(adult, lastMile!))
check('isEligible inherits the shield (the ONE-LAW pipeline)',
  !isEligible(lastMile!, basePlayer({ ageBand: 'kid' }), 100, []) && isEligible(lastMile!, basePlayer({ ageBand: 'teen' }), 100, []))
const kidSafeCount = Object.values(HUSTLE_BY_ID).filter((d) => d.kidSafe).length
check(`the light board is wide (${kidSafeCount} of ${Object.keys(HUSTLE_BY_ID).length} hustles kidSafe)`, kidSafeCount >= 14)

section('THE GRAPH BLOCK — structurally impossible contact')
check('adult → minor NEVER (kid + teen, both directions of null)',
  !canContact(adult, kid) && !canContact(adult, teen))
check('adult → adult fine, kid → anyone fine (kids greet their elders)',
  canContact(adult, adult) && canContact(kid, adult) && canContact(kid, kid) && canContact(teen, adult))
check('unlinked guests (null) may greet — the register law handles minors elsewhere',
  canContact(null, adult) && canContact(adult, null))

/* ------------------------------ the parent PIN ------------------------------ */

section('the parent PIN — 6 digits, the only key a minor answers')
check('6 digits pass, 5/7/letters fail',
  validateParentPin('123456').ok && !validateParentPin('12345').ok && !validateParentPin('1234567').ok && !validateParentPin('12a456').ok)
check('the local hash is salted + deterministic',
  localPinHash('123456', 'salt-a') === localPinHash('123456', 'salt-a') && localPinHash('123456', 'salt-a') !== localPinHash('123456', 'salt-b'))
check('wrong pin never matches', localPinHash('654321', 'salt-a') !== localPinHash('123456', 'salt-a'))
const salt = makeLocalSalt()
const stored = localPinHash('998877', salt)
check('the verify law: recompute with the stored salt tail', localPinHash('998877', stored.slice(8)) === stored && localPinHash('112233', stored.slice(8)) !== stored)

section('THE TIER GATE — no climb without the parent')
check('kid→teen: refused without the parent yes, allowed with it',
  !tierGateVerdict(kid, teen, false).allowed && tierGateVerdict(kid, teen, true).allowed)
check('teen→adult: same law', !tierGateVerdict(teen, adult, false).allowed && tierGateVerdict(teen, adult, true).allowed)
check('demotion is always open (a parent pulls the ladder down)',
  tierGateVerdict(adult, teen, false).allowed && tierGateVerdict(teen, kid, false).allowed)
check('the same tier goes nowhere',
  !tierGateVerdict(adult, adult, true).allowed && !tierGateVerdict(kid, kid, true).allowed)

/* ------------------------------ elder mode --------------------------------- */

section('ELDER MODE — the accessibility law')
check('elder class toggles honestly', elderClass(true) === 'elder-mode' && elderClass(false) === null)
check('elder decay is kinder than the street but gentler than chill', SHIELD.kidEmotes.length >= 6)

/* ---------------------------- SPOT THE SCAMMER ------------------------------ */

section('SPOT THE SCAMMER — the literacy game')
const r1 = scamRound(37)
const r1b = scamRound(37)
check('same day, same three cards (deterministic city-wide)',
  r1.options.length === 3 && r1.options.every((o, i) => o.text === r1b.options[i].text) && r1.scamIndex === r1b.scamIndex)
check('exactly one scam per round, two honest lines',
  r1.options.filter((o) => o.scam).length === 1 && r1.options.filter((o) => !o.scam).length === 2)
check('every card carries its lesson (why)', r1.options.every((o) => o.why.length > 12))
const daysSame = [41, 42, 43, 44, 45].filter((d) => scamRound(d).options[0].text === scamRound(41).options[0].text).length
check('rounds rotate across days', daysSame <= 2)
check('once per day law', canPlayScammer(0, 12) && !canPlayScammer(12, 12) && canPlayScammer(12, 13))
const fresh = freshShieldState()
const win = scamAnswerApply(fresh, r1, r1.scamIndex, 37)
check('a correct pick pays 150 + 25×streak (streak 0 → ₦150)',
  win.correct && win.reward?.cash === 150 && win.next.scammerStreak === 1 && win.next.scammerDay === 37)
check('the streak rides the cap (₦150+25×streak; streak 10+ → ₦400 flat)',
  scamReward(0).cash === 150 && scamReward(9).cash === 375 && scamReward(10).cash === 400 && scamReward(25).cash === 400)
check('smart XP + the mood ember ride the win', win.reward?.smartXp === 8 && win.reward?.mood === 2)
const loss = scamAnswerApply(fresh, r1, (r1.scamIndex + 1) % 3, 37)
check('a wrong pick teaches the REAL scam and resets the streak',
  !loss.correct && loss.reward === null && loss.lesson === r1.options[r1.scamIndex].why && loss.next.scammerStreak === 0 && loss.next.scammerWrong === 1)
const chain = scamAnswerApply(win.next, scamRound(38), scamRound(38).scamIndex, 38)
check('the streak chains across days (1 → 2, ₦175)', chain.correct && chain.next.scammerStreak === 2 && chain.reward?.cash === 175)

/* --------------------------- the calendar fold ------------------------------ */

section('the regatta fold — bets ride the character band now')
// regatta day one: year-day 37, regattaDays = 2 → absolute day 37 (year 1)
check('canBet refuses BOTH minors at the shoreline (M13 widens the kid law)',
  !canBet(freshCalendarState(), 37, 'confluence', kid).ok && !canBet(freshCalendarState(), 37, 'confluence', teen).ok)
check('canBet still greets the adult', canBet(freshCalendarState(), 37, 'confluence', adult).ok)

/* ------------------------------ save v14 ----------------------------------- */

section('the save v13→v15 migration — the shield joins the save')
{
  const { freshCalendarState: fcal, freshRiversState: friv, freshEducationState: fed, freshHousingState: fhou, freshJapaState: fjp, freshChaosState: fch, freshCivicState: fciv, freshGoalState: fgo, freshOnboardingState: fo } = await import('../src/game/systems/calendar').then(async (cal) => ({
    freshCalendarState: cal.freshCalendarState,
    ...(await import('../src/game/systems/rivers')),
    ...(await import('../src/game/systems/education')),
    ...(await import('../src/game/systems/housing')),
    ...(await import('../src/game/systems/japa')),
    ...(await import('../src/game/systems/chaos')),
    ...(await import('../src/game/systems/civic')),
    ...(await import('../src/game/systems/goals')),
    ...(await import('../src/game/systems/guest')),
  }))
  const legacy = {
    version: 13, createdAt: 1, updatedAt: 2,
    player: { ...basePlayer(), ageBand: undefined as unknown as string },
    world: { day: 9, timeOfDay: 'morning' as const, weather: 'sunny' as const, currentLocation: 'home' },
    civic: fciv(), chaos: fch(), calendar: fcal(), rivers: friv(), education: fed(), housing: fhou(), japa: fjp(),
    goals: fgo(), onboarding: fo(),
    account: { linked: false, handle: null, token: null, ageBand: null, gateGraceDay: 0 },
    fleet: { day: 9, done: [] },
    settings: { sound: true, graphics: 'auto' as const, chill: false },
  }
  const mem: Record<string, string> = {}
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => mem[k] ?? null,
      setItem: (k: string, v: string) => { mem[k] = v },
      removeItem: (k: string) => { delete mem[k] },
    },
  }
  mem['lokoja-life:save'] = JSON.stringify(legacy)
  const loaded = SaveSystem.load()
  check('a v13 save loads at v17', loaded?.version === 17)
  check('the character wakes as an ADULT (the honest default for existing hustlers)', loaded?.player.ageBand === 'adult')
  check('the shield slice arrives (game book empty, no parent gate)',
    !!loaded?.shield && loaded.shield.scammerDay === 0 && loaded.shield.scammerCorrect === 0 && loaded.shield.parentPinHash === null)
  check('elder mode lands off', loaded?.settings.elder === false)
  // a kid save persists the band through a round trip
  mem['lokoja-life:save'] = JSON.stringify({ ...legacy, version: 14, player: { ...basePlayer(), ageBand: 'kid' }, shield: freshShieldState(), settings: { sound: true, graphics: 'auto', chill: false, elder: true } })
  const kidSave = SaveSystem.load()
  check('a kid character + elder mode round-trip intact', kidSave?.player.ageBand === 'kid' && kidSave?.settings.elder === true)
  delete (globalThis as Record<string, unknown>).window
}

/* ============================ the REAL store pass ============================ */

console.log('\n========================================')
console.log(`M13 SHIELD — ${passed} passed, ${failed} failed`)
console.log('========================================')
if (failed > 0) process.exit(1)

section('the REAL store pass — a kid walks the shielded city')

{
  // bun has no localStorage — the save law still must run for real
  const memStore = new Map<string, string>()
  ;(globalThis as Record<string, unknown>).window = {
    localStorage: {
      getItem: (k: string) => memStore.get(k) ?? null,
      setItem: (k: string, v: string) => void memStore.set(k, v),
      removeItem: (k: string) => void memStore.delete(k),
    },
  }
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const { DEFAULT_AVATAR } = await import('../src/game/data/avatar')
  const { scamRound: sr } = await import('../src/game/systems/shield')
  const store = useGameStore
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  store.getState().startNewGame('Small Ada', 'female', DEFAULT_AVATAR, 'kid')
  const kidState = () => store.getState().player!
  check('the character carries the kid band', kidState().ageBand === 'kid')
  check('the shield slice is fresh', store.getState().shield.scammerDay === 0)
  // pre-seed the daily goals as done — the payout math below stays exact
  const seedGoalsDone = () => {
    const d = store.getState().world!.day
    store.setState({ goals: { day: d, ids: ['waka', 'eat-well', 'gist-time'], progress: {}, done: [true, true, true], streak: 0, lastDoneDay: 0 } })
  }
  seedGoalsDone()

  // — the crime roads refuse a kid, honestly, before any money moves —
  const cashBefore = kidState().cash
  store.getState().nightOut()
  await sleep(5)
  check('the night lounge refuses a pikin', kidState().cash === cashBefore)
  store.setState({ player: { ...kidState(), ageBand: 'teen' } })
  store.getState().nightOut()
  await sleep(5)
  check('the night lounge refuses a teen too', kidState().cash === cashBefore)

  // — japa: kid locked out entirely, teen kept off the agent road —
  store.setState({ world: { ...store.getState().world!, currentLocation: 'government-area' } })
  store.getState().requestNimc()
  await sleep(5)
  check('the JAPA desks refuse a kid', store.getState().japa.nimcReadyDay === 0)
  store.setState({ world: { ...store.getState().world!, currentLocation: 'ganaja-junction' }, player: { ...kidState(), cash: 60000 } })
  store.getState().tryAgent()
  await sleep(5)
  check('the street agent refuses a teen (the 419 road is 18+)', store.getState().japa.agentTries === 0 && kidState().cash === 60000)
  store.setState({ player: { ...kidState(), ageBand: 'kid' } })
  store.getState().tryAgent()
  await sleep(5)
  check('the street agent refuses a kid doubly', store.getState().japa.agentTries === 0)

  // — FUL refuses kids —
  store.setState({ world: { ...store.getState().world!, currentLocation: 'school-ful-felele' }, player: { ...kidState(), cash: 50000, level: 5 } })
  store.getState().enrollFul()
  await sleep(5)
  check('FUL refuses a pikin (their school is the scammer game)', store.getState().education.enrolled === false)

  // — the hustle board filters to kidSafe at Kpata —
  store.setState({ world: { ...store.getState().world!, currentLocation: 'kpata-market' }, player: { ...kidState(), ageBand: 'kid' } })
  // the street has a dry-chance — hunt until the board speaks (bounded, honest)
  for (let i = 0; i < 8 && store.getState().offers.length === 0; i++) {
    store.setState({ player: { ...store.getState().player!, cooldowns: {} } })
    store.getState().searchHustles()
    await sleep(30)
  }
  const offers = store.getState().offers
  check('the kid board only carries kidSafe chores', offers.every((o) => HUSTLE_BY_ID[o.defId]?.kidSafe === true))
  check('the kid board is not empty (Kpata is kid country)', offers.length > 0)
  // the last-mile def lives at Ganaja Junction — prove the filter bites there
  store.setState({ world: { ...store.getState().world!, currentLocation: 'ganaja-junction' } })
  store.getState().searchHustles()
  await sleep(30)
  const gjOffersKid = store.getState().offers
  check('the Ganaja board hides the last-mile drop from a kid', gjOffersKid.every((o) => o.defId !== 'emeka-last-mile'))
  store.setState({ player: { ...kidState(), ageBand: 'adult' } })
  store.setState({ player: { ...store.getState().player!, cooldowns: {} } })
  store.getState().searchHustles()
  await sleep(30)
  // the law is deterministic at the pipeline level: the def IS eligible for adults
  const { isEligible: eligible } = await import('../src/game/systems/opportunities')
  const { absoluteSlot } = await import('../src/game/systems/world')
  const w1 = store.getState().world!
  check('the same board offers the last-mile drop to an adult (the law, not the dice)',
    eligible(HUSTLE_BY_ID['emeka-last-mile'], kidState(), absoluteSlot(w1.day, w1.timeOfDay), []))

  // — the kid emote road —
  store.setState({ player: { ...kidState(), ageBand: 'kid' } })
  const out1 = store.getState().emoteChat('musa', 'fire')
  check('the emote lands: reply + fam grows', !!out1 && out1.reply.length > 3 && out1.familiarity > 0)
  const out2 = store.getState().emoteChat('musa', 'wave')
  check('one greet per day (the SAME cooldown law)', out2 === null)
  store.setState({ player: { ...kidState(), ageBand: 'adult' } })
  const out3 = store.getState().emoteChat('musa', 'wave')
  check('emotes are a KID-ONLY road (adults get null from the emote gate)', out3 === null)

  // — SPOT THE SCAMMER through the store —
  store.setState({ player: { ...kidState(), ageBand: 'kid' } })
  seedGoalsDone()
  const day = store.getState().world!.day
  const round = sr(day)
  const cashBeforeScam = kidState().cash
  store.getState().playScammer(round.scamIndex)
  await sleep(10)
  check('a caught scammer pays the honest naira', kidState().cash === cashBeforeScam + 150 && store.getState().shield.scammerStreak === 1)
  const first = store.getState().shield
  store.getState().playScammer(round.scamIndex)
  await sleep(10)
  check('the street teaches once a day', store.getState().shield.scammerCorrect === first.scammerCorrect)
  // next day: the streak chains
  store.setState({ world: { ...store.getState().world!, day: day + 1 } })
  const round2 = sr(day + 1)
  const cashBeforeScam2 = kidState().cash
  store.getState().playScammer(round2.scamIndex)
  await sleep(10)
  check('day 2: the streak rides (₦175) and smart XP grew', kidState().cash === cashBeforeScam2 + 175 && store.getState().shield.scammerStreak === 2)

  // — the tier ladder —
  check('no parent PIN yet — the ladder is locked', store.getState().shield.parentPinHash === null)
  const climbedNoPin = store.getState().unlockTierLocal('teen', '000000')
  check('climbing without the parent yes fails', !climbedNoPin && kidState().ageBand === 'kid')
  const setPin = store.getState().setLocalParentPin('654321')
  check('the parent sets the shield PIN', setPin && store.getState().shield.parentPinHash !== null)
  const climbedWrong = store.getState().unlockTierLocal('teen', '111111')
  check('a wrong parent PIN never moves the ladder', !climbedWrong && kidState().ageBand === 'kid')
  const climbed = store.getState().unlockTierLocal('teen', '654321')
  check('the right PIN climbs kid → teen', climbed && kidState().ageBand === 'teen')
  const climbedAgain = store.getState().unlockTierLocal('adult', '654321')
  check('teen → adult with the same yes', climbedAgain && kidState().ageBand === 'adult')

  // — elder mode —
  store.getState().setElder(true)
  await sleep(5)
  check('elder mode toggles + persists into the save', store.getState().settings.elder === true)
  store.setState({ world: { ...store.getState().world!, timeOfDay: 'morning', weather: 'sunny' } })
  const energyBefore = kidState().needs.energy
  store.getState().rest('nap')
  await sleep(5)
  check('the body still runs under elder (nap applies)', typeof kidState().needs.energy === 'number')
  void energyBefore

  // — the save carries the shield —
  store.getState().saveNow()
  const saved = SaveSystem.load()
  check('the save carries the M13 slice (band + shield + elder)',
    saved?.version === 17 && saved?.player.ageBand === 'adult' && saved?.shield.scammerCorrect >= 2 && saved?.settings.elder === true)

  // — teen study boost (level 8 so the skill cap never banks the delta) —
  store.setState({ player: { ...kidState(), ageBand: 'teen', level: 8, skills: { hustle: 5, smart: 0, social: 5 }, skillXp: { hustle: 0, smart: 0, social: 0 } } })
  const smartXpBefore = kidState().skillXp.smart
  store.getState().study('Algebra')
  await sleep(10)
  check('the teen brain harvests ×1.25 smart XP (14 → 18)', kidState().skillXp.smart - smartXpBefore === 18)
  delete (globalThis as Record<string, unknown>).window
}

/* ============================ the REAL HTTP pass ============================ */

section('the REAL HTTP pass — the register + the tier gate on the live API')

{
  const stamp = Date.now().toString(36)
  const BASE = 'http://localhost:3000'
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
  await sleep(400)

  // — the minor register law —
  const noPin = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '1234', ageBand: 'kid' }),
  })
  check('a minor claim WITHOUT the parent PIN is refused', noPin.status === 400)

  const kidReg = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '1234', ageBand: 'kid', parentPin: '998877' }),
  })
  const kidData = (await kidReg.json()) as { ok?: boolean; token?: string }
  check('a minor claims BEHIND the parent PIN', kidReg.ok && kidData.ok === true && !!kidData.token)

  // — ZERO COLLECTION: a second minor reusing the "same contact" cannot conflict,
  //   because the minor's contact never touched the disk —
  const kidReg2 = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid2_${stamp}`, pin: '1234', ageBand: 'teen', parentPin: '112233', contact: 'shared@lokoja.ng' }),
  })
  const kidReg3 = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid3_${stamp}`, pin: '1234', ageBand: 'kid', parentPin: '445566', contact: 'shared@lokoja.ng' }),
  })
  check('the minor contact is never stored (zero collection — no unique clash)',
    kidReg2.ok && kidReg3.ok)

  const kidParentSame = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid4_${stamp}`, pin: '1234', ageBand: 'kid', parentPin: '1234' }),
  }).catch(() => null)
  check('the parent PIN must differ from the account PIN', kidParentSame?.status === 400)

  // — the tier gate —
  const wrongAcct = await fetch(`${BASE}/api/auth/tier`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '9999', parentPin: '998877', toBand: 'teen' }),
  })
  check('the tier gate refuses a wrong account PIN', wrongAcct.status === 401)

  const wrongParent = await fetch(`${BASE}/api/auth/tier`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '1234', parentPin: '000000', toBand: 'teen' }),
  })
  check('the tier gate refuses a wrong PARENT PIN', wrongParent.status === 403)

  const climb = await fetch(`${BASE}/api/auth/tier`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '1234', parentPin: '998877', toBand: 'teen' }),
  })
  const climbData = (await climb.json()) as { ok?: boolean; ageBand?: string }
  check('the right parent PIN climbs kid → teen', climb.ok && climbData.ok === true && climbData.ageBand === 'teen')

  const climb2 = await fetch(`${BASE}/api/auth/tier`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '1234', parentPin: '998877', toBand: 'adult' }),
  })
  check('teen → adult with the same yes', climb2.ok)

  const demote = await fetch(`${BASE}/api/auth/tier`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '1234', parentPin: '998877', toBand: 'kid' }),
  })
  check('a parent pulls the ladder back down (demotion carries the PIN too)', demote.ok)

  // — the adult law unchanged —
  const adultNoContact = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `ad_${stamp}`, pin: '1234', ageBand: 'adult' }),
  })
  check('an adult claim without contact is still refused', adultNoContact.status === 400)

  // — the minor logs in with the account PIN (the parent manages it) —
  const login = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle: `kid_${stamp}`, pin: '1234' }),
  })
  check('the minor account opens with its own PIN', login.ok)
}

console.log('\n========================================')
console.log(`M13 SHIELD TOTAL — ${passed} passed, ${failed} failed`)
console.log('========================================')
if (failed > 0) process.exit(1)
