/**
 * LOKOJA LIFE — M12: THE LADDER (pure rule checks + a real store pass)
 * ---------------------------------------------------------------------
 * The life above the hustle. Law blocks: the FUL semester clock (phase
 * windows, the ASUU strike that freezes the gate deterministically per
 * semester, the once-a-day lecture law, the Dean's grant at exactly 8),
 * the HONEST EXAM (score = smart + lectures × 0.5 — no dice; a skiving
 * genius repeats the semester), the convocation, the career gate
 * (requiresDegree reads the certificate through checkRequirements), the
 * rent book (cycles post, the landlord's wahala rides its cycle hash,
 * two cycles behind posts the quit notice), the housing ladder (level +
 * cash gates, comfort warms the sleep, furnishing climbs one honest
 * tier at a time), the JAPA gauntlet (every desk refuses without the
 * previous paper; the Ganaja agent's honesty is a hash — same day, same
 * character; the send-off pays the street and the remittance lands the
 * morning after), the MOPOL detail (five shifts of trust, every third
 * day, the siren ×0.8 for two days), the save v12→v13 migration, and a
 * REAL bun store pass: enroll, live through a strike, sit four exams,
 * collect the certificate, take the career desk, climb the housing
 * ladder, run the whole JAPA chain and land the remittance.
 * Run: bun scripts/test-m12-ladder.ts
 */

import {
  freshEducationState,
  canEnroll,
  enrollApply,
  isLectureWindow,
  isExamWindow,
  semesterDayOf,
  strikeForSemester,
  isStrikeDay,
  strikeDaysLeft,
  canAttendLecture,
  attendLectureApply,
  earnsDeansGrant,
  grantApply,
  examScore,
  examPasses,
  canSitExam,
  examApply,
  canAttendConvocation,
  convocationApply,
  absoluteSemesterIndex,
} from '../src/game/systems/education'
import {
  freshHousingState,
  PROPERTIES,
  homeComfort,
  canBuyProperty,
  buyPropertyApply,
  canFurnish,
  furnishApply,
  housingDayRoll,
  wahalaForCycle,
  canPayRent,
  payRentApply,
  canResolveWahala,
  resolveWahalaApply,
  propertyFor,
} from '../src/game/systems/housing'
import {
  freshJapaState,
  hasPaper,
  papersComplete,
  canRequestNimc,
  requestNimcApply,
  canCollectNimc,
  collectNimcApply,
  canRequestPassport,
  requestPassportApply,
  canCollectPassport,
  collectPassportApply,
  agentDelivers,
  canTryAgent,
  tryAgentApply,
  canClearKgirs,
  clearanceApply,
  canGetPoliceCertificate,
  policeCertificateApply,
  canTakeFlight,
  takeFlightApply,
  remittanceLands,
  remittanceApply,
  escortAvailable,
  canRunEscort,
  runEscortApply,
  sirenMinutesMult,
} from '../src/game/systems/japa'
import { checkRequirements } from '../src/game/systems/work'
import { LADDER } from '../src/game/data/config'
import { SaveSystem } from '../src/game/systems/save'
import { freshCivicState } from '../src/game/systems/civic'

const SAVE_V = 13
const E = LADDER.education
const H = LADDER.housing
const J = LADDER.japa
const M = LADDER.mopol

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

/* ------------------------------- the FUL clock ------------------------------- */

section('the FUL semester clock')

const enrolled = enrollApply(freshEducationState(), 10) // enroll day 10 → semester starts day 11
check('enrollment starts the semester TOMORROW', enrolled.enrolled && enrolled.semester === 1 && enrolled.semesterStartDay === 11)
check('before the start day the semester reads day 0', semesterDayOf(enrolled, 10) === 0)
check('the lecture window is days 1..15 of 18', isLectureWindow(enrolled, 11) && isLectureWindow(enrolled, 25) && !isLectureWindow(enrolled, 26))
check('the exam window is the last 3 days', !isExamWindow(enrolled, 25) && isExamWindow(enrolled, 26) && isExamWindow(enrolled, 28) && !isExamWindow(enrolled, 29))
check('enrollment gates: already enrolled, graduated, level', !canEnroll(enrolled, 5).ok && !canEnroll(freshEducationState(), 1).ok && (() => {
  const g = { ...freshEducationState(), graduated: true }
  return !canEnroll(g, 9).ok && canEnroll(freshEducationState(), 3).ok
})())

/* ------------------------------ the strike law ------------------------------- */

section('the ASUU strike — deterministic, no mercy')

{
  let struck = 0
  let calm = 0
  let lengths = new Set<number>()
  for (let i = 1; i <= 60; i++) {
    const s = strikeForSemester(i)
    if (s.active) {
      struck++
      lengths.add(s.length)
    } else calm++
  }
  check('the strike lands on a seeded share of semesters (~30%)', struck >= 8 && struck <= 35, `${struck}/60`)
  check('the strike length sits in the 5-8 band', [...lengths].every((l) => l >= E.strikeMinDays && l <= E.strikeMaxDays), `lengths=${[...lengths].join(',')}`)
  check('deterministic per semester index', strikeForSemester(7).active === strikeForSemester(7).active)
}
{
  // build a semester whose index strikes, then check the freeze window
  let idx = 0
  for (let i = 1; i <= 60; i++) {
    if (strikeForSemester(i).active) {
      idx = i
      break
    }
  }
  check('a striking semester index exists in the first 60', idx > 0)
  const ed: typeof enrolled = { ...enrolled, examsPassed: idx - 1, semester: 1 } // absolute index = idx
  const start = ed.semesterStartDay + E.strikeStartDay - 1
  const strike = strikeForSemester(idx)
  const len = strike.active ? strike.length : 0
  check('the gate freezes from lecture-day 7', isStrikeDay(ed, start) && isStrikeDay(ed, start + len - 1) && !isStrikeDay(ed, start - 1) && !isStrikeDay(ed, start + len))
  check('the days-left count is honest', strikeDaysLeft(ed, start) === len && strikeDaysLeft(ed, start + len - 1) === 1 && strikeDaysLeft(ed, start + len) === 0)
}

/* ----------------------------- the lecture law ------------------------------- */

section('the lecture law — once a day, the syllabus caps')

check('a non-student cannot lecture', !canAttendLecture(freshEducationState(), 12, true).ok)
check('a graduate cannot lecture', !canAttendLecture({ ...freshEducationState(), graduated: true }, 12, true).ok)
check('wrong campus refuses', !canAttendLecture(enrolled, 12, false).ok)
check('the exam window quiets the halls', !canAttendLecture(enrolled, 26, true).ok && canAttendLecture(enrolled, 26, true).why.includes('Exam'))
check('the first lecture passes', canAttendLecture(enrolled, 11, true).ok)
{
  // run this block on a CALM semester (no strike) so the full window is open
  let calmIdx = 0
  for (let i = 1; i <= 60; i++) if (!strikeForSemester(i).active) { calmIdx = i; break }
  const calm = { ...enrolled, examsPassed: calmIdx - 1, semester: 1 }
  let ed = attendLectureApply(calm, 11)
  check('one lecture lands (count + stat + last day)', ed.lecturesDone === 1 && ed.stats.lectures === 1 && ed.lastLectureDay === 11)
  check('twice a day refuses', !canAttendLecture(ed, 11, true).ok)
  check('tomorrow it opens again', canAttendLecture(ed, 12, true).ok)
  for (let d = 12; d <= 25; d++) if (canAttendLecture(ed, d, true).ok) ed = attendLectureApply(ed, d)
  check('the syllabus caps at 12', ed.lecturesDone === 12 && !canAttendLecture(ed, 25, true).ok && canAttendLecture(ed, 25, true).why.includes('syllabus'), `calmIdx=${calmIdx} lectures=${ed.lecturesDone}`)
}
{
  // the Dean's grant: exactly at 8, once per absolute semester
  let ed = attendLectureApply(enrolled, 11)
  let grantSeen = false
  for (let d = 12; d <= 18; d++) {
    ed = attendLectureApply(ed, d)
    if (earnsDeansGrant(ed)) {
      grantSeen = true
      ed = grantApply(ed)
      check('the grant pays exactly at the 8th lecture', ed.lecturesDone === E.deansLectures && ed.lastGrantSemester === absoluteSemesterIndex(ed))
      break
    }
  }
  check('the grant arrives inside the semester', grantSeen)
  check('the grant never pays twice in one semester', (() => {
    let e = attendLectureApply(enrolled, 11)
    e = grantApply(attendLectureApply(e, 11)) // mark the semester paid at count 1
    for (let d = 12; d <= 25; d++) {
      e = attendLectureApply(e, d)
      if (e.lecturesDone === E.deansLectures) return !earnsDeansGrant(e)
    }
    return false
  })())
}

/* -------------------------------- the exam law ------------------------------- */

section('the exam — the work decides, no dice')

check('the score law: smart + lectures × 0.5', examScore(2, 12) === 8 && examScore(5, 4) === 7 && examScore(10, 0) === 10)
check('the pass bar is honest', examPasses(2, 12) && !examPasses(5, 4) && examPasses(10, 0) && !examPasses(3, 9))
check('a skiving genius repeats the semester (smart 5 + 4 lectures = 7)', !examPasses(5, 4))
check('exam gates: non-student, wrong campus, wrong window', !canSitExam(freshEducationState(), 26, true).ok && !canSitExam(enrolled, 26, false).ok && !canSitExam(enrolled, 20, true).ok && canSitExam(enrolled, 26, true).ok)
{
  const pass = examApply(enrolled, 28, 2) // smart 2, 0 lectures → 2 < 8 → FAIL
  check('a failed exam repeats the same semester from tomorrow', !pass.passed && pass.next.failedExams === 1 && pass.next.semester === 1 && pass.next.semesterStartDay === 29 && pass.next.lecturesDone === 0)
  const twelve = { ...enrolled, lecturesDone: 12 }
  const p1 = examApply(twelve, 28, 2)
  check('a passed exam climbs the ladder (semester 2, starts tomorrow)', p1.passed && p1.next.semester === 2 && p1.next.semesterStartDay === 29 && p1.next.examsPassed === 1)
  const final = examApply({ ...enrolled, semester: E.semestersToGraduate, lecturesDone: 12 }, 28, 2)
  check('the fourth pass calls the convocation (+2 days)', final.graduatedNow && final.next.graduated && final.next.convocationDay === 30)
}

/* ------------------------------ the convocation ------------------------------ */

section('the convocation — the certificate lands')

{
  const grad = { ...freshEducationState(), graduated: true, convocationDay: 30 }
  check('the ceremony refuses before its day', !canAttendConvocation(grad, 29, true).ok)
  check('it refuses off-campus', !canAttendConvocation(grad, 30, false).ok)
  check('it lands on the day', canAttendConvocation(grad, 30, true).ok)
  const attended = convocationApply(grad)
  check('once is once', attended.convocationAttended && !canAttendConvocation(attended, 31, true).ok)
}

/* ------------------------------ the career gate ------------------------------ */

section('the career gate — the desk reads the certificate')

{
  const player = { skills: { hustle: 5, smart: 5, social: 5 }, reputation: 500, level: 9 } as unknown as Parameters<typeof checkRequirements>[0]
  const without = checkRequirements(player, { minReputation: 300, requiresDegree: true })
  check('the career desk refuses the uncertified', !without.ok && without.reasons[0].includes('FUL certificate'))
  const withCtx = checkRequirements(player, { minReputation: 300, requiresDegree: true }, { graduated: true })
  check('the certified walk through', withCtx.ok)
  const lowRep = checkRequirements(player, { minReputation: 900, requiresDegree: true }, { graduated: true })
  check('the other gates still bite', !lowRep.ok && lowRep.reasons[0].includes('reputation'))
}

/* ------------------------------- the rent book ------------------------------- */

section('the rent book — cycles, wahala, the quit notice')

check('the wahala rides its cycle hash (deterministic)', wahalaForCycle(4)?.kind === wahalaForCycle(4)?.kind)
{
  let struck = 0
  for (let c = 1; c <= 100; c++) if (wahalaForCycle(c)) struck++
  check('the wahala lands on a seeded share of cycles (~35%)', struck >= 20 && struck <= 55, `${struck}/100`)
}
{
  const h0 = freshHousingState()
  const r1 = housingDayRoll(h0, H.rentCycleDays) // the first cycle posts on day 6
  check('the first cycle posts on day 6', r1.rentPosted !== null && r1.next.rentOwed === H.baseRent)
  check('no wahala arrives with a quiet cycle if none seeded', r1.wahalaArrived === null || r1.wahalaArrived.kind !== 'spike' || r1.next.rentOwed === Math.round(H.baseRent * 1.15))
  const r2 = housingDayRoll(r1.next, H.rentCycleDays + 1)
  check('the roll is idempotent inside a cycle (no double posting)', r2.rentPosted === null && r2.next.rentOwed === r1.next.rentOwed)
  // the spike cycle: find one and verify the ×1.15
  let spikeCycle = 0
  for (let c = 1; c <= 100; c++) if (wahalaForCycle(c)?.kind === 'spike') { spikeCycle = c; break }
  check('a spike cycle exists and prices ×1.15', spikeCycle > 0)
  if (spikeCycle > 0) {
    const day = spikeCycle * H.rentCycleDays
    const rs = housingDayRoll(h0, day)
    check('the spike cycle posts the raised rent', rs.rentPosted?.amount === Math.round(H.baseRent * 1.15) && rs.wahalaArrived?.kind === 'spike')
  }
}
{
  // two cycles behind → the notice
  let h = freshHousingState()
  h = housingDayRoll(h, H.rentCycleDays).next
  const late = housingDayRoll(h, H.rentCycleDays * 2)
  check('two cycles behind posts the quit notice', late.lateNotice === true && late.next.stats.cyclesLate === 1)
  const payGate = canPayRent(late.next, 5000)
  check('the rent pays one cycle at a time', payGate.ok && payGate.amount === H.baseRent)
  const paid = payRentApply(late.next, payGate.amount)
  check('the book moves a full cycle forward per payment', paid.rentOwed === H.baseRent && paid.rentPaidThrough === H.rentCycleDays && paid.stats.rentPaid === H.baseRent)
  check('paying refuses when clean', !canPayRent(freshHousingState(), 5000).ok)
}
{
  // the wahala settlement
  let repairCycle = 0
  for (let c = 1; c <= 100; c++) if (wahalaForCycle(c)?.kind === 'repair') { repairCycle = c; break }
  check('a repair cycle exists (the roof dey leak)', repairCycle > 0)
  if (repairCycle > 0) {
    const day = repairCycle * H.rentCycleDays
    const rs = housingDayRoll(freshHousingState(), day)
    check('the repair wahala carries its cost (₦2,000)', rs.next.wahala?.cost === 2000)
    const gate = canResolveWahala(rs.next, 5000)
    check('the settlement buys peace', gate.ok && gate.cost === 2000 && resolveWahalaApply(rs.next).wahala === null)
  }
}

/* ----------------------------- the housing ladder ---------------------------- */

section('the housing ladder — the rungs and the comfort')

check('the four rungs sit at their real locations', PROPERTIES.length === 4 && propertyFor('family-room')?.locationId === 'university-area' && propertyFor('self-contain')?.locationId === 'ganaja-junction' && propertyFor('flat-gra')?.locationId === 'government-area')
check('the ladder gates: level then cash', !canBuyProperty(freshHousingState(), 'family-room', 2, 999999).ok && !canBuyProperty(freshHousingState(), 'family-room', 3, 100).ok && canBuyProperty(freshHousingState(), 'family-room', 3, 999999).ok)
check('a renter reads comfort 0', homeComfort(freshHousingState()) === 0)
{
  const owned = buyPropertyApply(freshHousingState(), 'family-room')
  check('ownership lands', owned.owned === 'family-room' && homeComfort(owned) === 1)
  check('furnishing refuses out of order', !canFurnish(owned, 2).ok && canFurnish(owned, 1).ok)
  const t1 = furnishApply(owned, 1)
  check('tier 1 warms the comfort (+1)', homeComfort(t1) === 2 && t1.furnishing['family-room'] === 1)
  const t3 = furnishApply(furnishApply(t1, 2), 3)
  check('the tiers REPLACE — tier 3 reads the property comfort + the AC mood', homeComfort(t3) === 1 + 3 && t3.furnishing['family-room'] === 3)
  check('buying the same rung twice refuses', !canBuyProperty(t3, 'family-room', 3, 999999).ok)
}

/* ----------------------------- the JAPA gauntlet ----------------------------- */

section('the JAPA gauntlet — the chain, the agent, the send-off')

const j0 = freshJapaState()
check('the empty file completes nothing', !papersComplete(j0))
check('every desk refuses the empty file', !canCollectNimc(j0, 50, true).ok && !canRequestPassport(j0, 999999, true).ok && !canClearKgirs(j0, false, true).ok && !canGetPoliceCertificate(j0, 0, 999999, true).ok && !canTakeFlight(j0, 999999, true).ok)
check('the NIMC desk wants level 8', !canRequestNimc(j0, 7, true).ok && canRequestNimc(j0, 8, true).ok)
{
  const requested = requestNimcApply(j0, 100)
  check('the queue is honest (tomorrow)', requested.nimcReadyDay === 100 + J.nimcQueueDays)
  check('the slip collects on its day', !canCollectNimc(requested, 100, true).ok && canCollectNimc(requested, 100 + J.nimcQueueDays, true).ok)
  const slipped = collectNimcApply(requested, 101)
  check('step 1 lands', hasPaper(slipped, 'nimc'))
  check('the passport chain gates on the slip (both routes open after it)', canRequestPassport(slipped, 999999, true).ok && canTryAgent(slipped, 999999, true).ok && (() => {
    const noSlip = requestNimcApply(j0, 100)
    return !canRequestPassport({ ...noSlip, nimcDay: 0 }, 999999, true).ok && !canTryAgent({ ...noSlip, nimcDay: 0 }, 999999, true).ok
  })())
  const official = requestPassportApply(slipped, 101)
  check('the official window takes 3 days', official.passportReadyDay === 101 + J.passportQueueDays)
  const passport = collectPassportApply(official, 104)
  check('step 2 lands (official route)', hasPaper(passport, 'passport'))
  const cleared = clearanceApply(passport, 105)
  check('the clearance gates on the warrant', hasPaper(cleared, 'clearance') && !canClearKgirs(cleared, true, true).ok)
  const certified = policeCertificateApply(cleared, 106)
  check('the police certificate gates on the fines book', hasPaper(certified, 'police') && !canGetPoliceCertificate(certified, 500, 999999, true).ok)
  check('the file completes for the send-off', papersComplete(certified))
  check('the flight gates on the park + the ticket', canTakeFlight(certified, 999999, true).ok && !canTakeFlight(certified, 999999, false).ok && !canTakeFlight(certified, 100, true).ok)
  const flown = takeFlightApply(certified, 107)
  check('the send-off lands once', flown.flownDay === 107 && !canTakeFlight(flown, 999999, true).ok)
  check('the remittance lands the MORNING AFTER, once', remittanceLands(flown, 108) && !remittanceLands(flown, 107) && !remittanceLands(remittanceApply(flown, 108), 109))
}
{
  // the agent: same day, same character — and the street learns the odds
  const slip = collectNimcApply(requestNimcApply(j0, 1), 2)
  check('the agent is deterministic per (day, handle)', agentDelivers(50, 'ada') === agentDelivers(50, 'ada'))
  {
    let real = 0
    for (let d = 1; d <= 200; d++) if (agentDelivers(d, 'ada')) real++
    check('the agent delivers on ~60% of days', real >= 90 && real <= 150, `${real}/200`)
  }
  check('the agent refuses without the slip or a live application', !canTryAgent(j0, 999999, true).ok)
  const fake = tryAgentApply(slip, 1, 'unlucky')
  const realTry = tryAgentApply(slip, 1, 'unlucky')
  check('the try ledger records honestly', fake.next.agentTries === 1 && realTry.next.agentTries === 1 && fake.next.agentScams + realTry.next.agentScams <= 2)
}

/* ------------------------------ the MOPOL detail ----------------------------- */

section('the MOPOL detail — trust, the convoy, the siren')

check('the detail wants its shifts', !escortAvailable({ ...j0, policeShifts: M.shiftsToUnlock - 1 }, 9, false) && escortAvailable({ ...j0, policeShifts: M.shiftsToUnlock }, 9, false))
check('the convoy moves every 3rd day', !escortAvailable({ ...j0, policeShifts: M.shiftsToUnlock }, 8, false) && escortAvailable({ ...j0, policeShifts: M.shiftsToUnlock }, 9, false))
check('a wanted man walks', !escortAvailable({ ...j0, policeShifts: M.shiftsToUnlock }, 9, true))
{
  const j = { ...j0, policeShifts: M.shiftsToUnlock }
  const gate = canRunEscort(j, 9, false, true)
  check('the escort runs on its day at GRA', gate.ok)
  const ran = runEscortApply(j, 9)
  check('the detail pays + the siren lasts 2 days', ran.stats.escorts === 1 && ran.stats.escortEarned === M.escortPay && ran.sirenUntilDay === 9 + M.sirenDays)
  check('the siren rides ×0.8 while it lasts', sirenMinutesMult(ran, 10) === M.sirenMinutesMult && sirenMinutesMult(ran, 11) === M.sirenMinutesMult && sirenMinutesMult(ran, 12) === 1)
  check('the next detail waits its 3 days', !escortAvailable(ran, 10, false) && !escortAvailable(ran, 11, false) && escortAvailable(ran, 12, false))
}

/* ----------------------------- save migration ------------------------------- */

section('the save v12 → v13 migration')

{
  const mem = new Map<string, string>()
  const shim = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
  }
  ;(globalThis as unknown as Record<string, unknown>).localStorage = shim
  ;(globalThis as unknown as Record<string, unknown>).window = { localStorage: shim }
  const v12 = {
    version: 12,
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
    calendar: { day: 12, meatPacks: 0, meatShares: [], sponsored: [], bets: [], asoEbi: [], attended: [], paved: [], paving: null, stats: { festivalsAttended: 0, ramsBought: 0, meatShared: 0, regattaWins: 0, weddings: 0, projectsDone: 0 } },
    rivers: { day: 12, sandbags: 4, canoe: true, walkways: {}, rescue: null, rescuedYear: 0, ferryDay: 0, ferryDone: [], stats: { sandBought: 4, segmentsLaid: 0, tollsCollected: 0, ferryRuns: 0, ferryEarned: 0, rescues: 0 } },
  }
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify(v12))
  const loaded = SaveSystem.load()
  check('v12 save migrates to v13', loaded?.version === SAVE_V)
  check('the education slice arrives fresh and harmless', !!loaded?.education && loaded.education.enrolled === false && loaded.education.semester === 1 && loaded.education.graduated === false)
  check('the housing slice arrives fresh (renting, clean book)', !!loaded?.housing && loaded.housing.owned === null && loaded.housing.rentOwed === 0 && loaded.housing.wahala === null)
  check('the japa slice arrives fresh (empty file)', !!loaded?.japa && loaded.japa.nimcDay === 0 && loaded.japa.flownDay === 0 && loaded.japa.policeShifts === 0)
  check('nothing else moved (rivers/chaos/goals intact)', loaded?.rivers.canoe === true && loaded?.chaos.stats.blowouts === 1 && loaded?.goals.streak === 2)
  // partial heal
  const partial = { ...v12, version: 13, education: { enrolled: true }, japa: { nimcDay: 5 } }
  mem.set(SaveSystem.SAVE_KEY, JSON.stringify(partial))
  const healed = SaveSystem.load()
  check('a partial ladder heals (semester defaulted, stats present)', healed?.education.semester === 1 && typeof healed?.education.stats.lectures === 'number' && healed?.japa.nimcDay === 5 && typeof healed?.japa.stats.escorts === 'number')
  mem.set(SaveSystem.SAVE_KEY, '{broken json')
  check('a corrupt save still loads as null, no crash', SaveSystem.load() === null)
}

console.log(`\n========================================`)
console.log(`M12 THE LADDER — ${passed} passed, ${failed} failed`)
console.log(`========================================`)
if (failed > 0) process.exit(1)

/* ------------------------------- the REAL store pass ------------------------- */

section('the REAL store pass — enroll, climb, own, japa')

{
  const { useGameStore } = await import('../src/game/store/useGameStore')
  const { DEFAULT_AVATAR } = await import('../src/game/data/avatar')
  const { LOCATION_BY_ID } = await import('../src/game/data/locations')
  const { JOB_BY_ID } = await import('../src/game/data/jobs')
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
    store.setState({ player: { ...store.getState().player!, needs: { ...store.getState().player!.needs, energy: 100 } } })
    const modes = LOCATION_BY_ID[id].transport
    for (const t of modes) {
      store.getState().travel(id, t)
      const ok = await arrive()
      if (ok && store.getState().world!.currentLocation === id) return true
    }
    return store.getState().world!.currentLocation === id
  }
  const seed = () => {
    const p = store.getState().player!
    store.setState({ player: { ...p, needs: { ...p.needs, energy: 100, mood: 70, hunger: 80 } } })
  }

  store.getState().startNewGame('Ada', 'female', DEFAULT_AVATAR)
  store.setState({ account: { ...store.getState().account, linked: true, ageBand: 'adult' } })
  store.setState({ goals: { ...store.getState().goals, day: 1, ids: ['n1', 'n2', 'n3'], done: [false, false, false] } })
  store.getState().addMoney(400_000, { label: 'Test seed', category: 'other' })
  store.setState({ player: { ...store.getState().player!, level: 2 } })

  // — THE EDUCATION LADDER: enroll, live through the semesters, graduate —
  check('FUL enrollment takes the fee through the live store', store.getState().enrollFul() && store.getState().education.enrolled && store.getState().education.semesterStartDay === 2)
  await travelTo('ful-felele')
  let grantSeen = false
  let guard = 0
  while (!store.getState().education.graduated && guard < 130) {
    guard++
    seed()
    const ed = store.getState().education
    const day = store.getState().world!.day
    if (isExamWindow(ed, day)) {
      const repBefore = store.getState().player!.reputation
      store.getState().sitExam()
      if (store.getState().education.examsPassed > (ed.examsPassed ?? 0) && !store.getState().education.graduated) {
        check(`semester ${ed.semester} passed honestly (score ≥ ${E.examPassScore})`, store.getState().education.examsPassed === ed.examsPassed + 1)
      }
      void repBefore
      await sleepDay()
      continue
    }
    if (store.getState().attendLecture()) {
      if (store.getState().education.lastGrantSemester > 0 && !grantSeen) {
        grantSeen = true
        check("the DEAN'S GRANT pays through the live store", store.getState().player!.transactions.some((t) => t.label.includes("Dean's hustle grant")))
      }
    }
    await sleepDay()
  }
  check('the ladder climbed to graduation within the semester clock', store.getState().education.graduated && store.getState().education.examsPassed >= E.semestersToGraduate, `after ${guard} days, examsPassed=${store.getState().education.examsPassed}`)
  // the convocation: +2 days after the final exam
  while (store.getState().world!.day < (store.getState().education.convocationDay ?? 0)) await sleepDay()
  await travelTo('ful-felele')
  const repBeforeConv = store.getState().player!.reputation
  check('the convocation lands the certificate (+rep, once)', store.getState().attendConvocation() && store.getState().education.convocationAttended && store.getState().player!.reputation === repBeforeConv + E.graduateRep)
  check('the certificate opens the career desk (live gate)', (() => {
    const p = store.getState().player!
    p.reputation = 500
    store.setState({ player: { ...p } })
    const req = checkRequirements(p, JOB_BY_ID['govt-officer'].requirements, { graduated: store.getState().education.graduated && store.getState().education.convocationAttended })
    return req.ok
  })())

  // — THE HOUSING LADDER: the rent book ran during the semesters —
  check('the rent book ran honestly during the semesters', store.getState().housing.rentOwed > 0 || store.getState().housing.rentPaidThrough > 0, `owed=${store.getState().housing.rentOwed}`)
  await travelTo('home')
  if (store.getState().housing.rentOwed > 0) {
    const owedBefore = store.getState().housing.rentOwed
    check('the rent pays one cycle through the live store', store.getState().payRent('home') && store.getState().housing.rentOwed === Math.max(0, owedBefore - H.baseRent))
  }
  store.setState({ player: { ...store.getState().player!, level: Math.max(3, store.getState().player!.level) } })
  const cashBeforeHouse = store.getState().player!.cash
  check('the family room buys through the live store', store.getState().buyProperty('family-room') && store.getState().housing.owned === 'family-room' && store.getState().player!.cash === cashBeforeHouse - H.properties[0].price)
  check('furnishing tier 1 lands (the fan and the curtains)', store.getState().furnishHome(1) && store.getState().housing.furnishing['family-room'] === 1 && homeComfort(store.getState().housing) === 2)

  // — THE JAPA GAUNTLET: the whole chain, the desks in order —
  store.setState({ player: { ...store.getState().player!, level: 8, reputation: Math.max(store.getState().player!.reputation, 300) } })
  store.setState({ civic: { ...store.getState().civic!, kgirs: { ...store.getState().civic!.kgirs, warrant: false } } })
  await travelTo('government-area')
  check('the NIMC slip enters the queue', store.getState().requestNimc() && store.getState().japa.nimcReadyDay > 0)
  await sleepDay()
  await travelTo('government-area')
  check('the slip collects the morning after', store.getState().collectNimc() && store.getState().japa.nimcDay > 0)
  check('the official passport enters processing', store.getState().requestPassport() && store.getState().japa.passportReadyDay === store.getState().japa.nimcDay + J.passportQueueDays)
  for (let i = 0; i < J.passportQueueDays; i++) await sleepDay()
  await travelTo('government-area')
  check('the green book collects', store.getState().collectPassport() && store.getState().japa.passportDay > 0)
  // the ₦400k life draws real KGIRS assessments — settle the book like a payer
  const c0 = store.getState().civic!
  store.setState({ civic: { ...c0, kgirs: { ...c0.kgirs, warrant: false, assessed: 0 } } })
  check('the KGIRS clearance stamps (clean record)', store.getState().kgirsClearance() && store.getState().japa.clearanceDay > 0)
  check('the police certificate lands (clean fines book)', store.getState().policeCertificate() && store.getState().japa.policeDay > 0)
  await travelTo('transport-area')
  const repBeforeFlight = store.getState().player!.reputation
  check('THE SEND-OFF lands (+rep, the achievement, the file)', store.getState().takeFlight() && store.getState().japa.flownDay > 0 && store.getState().player!.reputation === repBeforeFlight + J.repReward && store.getState().player!.achievements.includes('japa'))
  check('the send-off refuses twice', !store.getState().takeFlight())
  await sleepDay()
  check('the first remittance lands the morning after', store.getState().japa.remitDay > 0 && store.getState().player!.transactions.some((t) => t.label.includes('First remittance')))

  // — THE MOPOL DETAIL: trust, the convoy, the siren —
  store.setState({ japa: { ...store.getState().japa!, policeShifts: M.shiftsToUnlock } })
  const cw = store.getState().civic!
  store.setState({ civic: { ...cw, kgirs: { ...cw.kgirs, warrant: false } } })
  await travelTo('government-area')
  // align at the GRA (sleeps keep the location): the convoy moves every 3rd day
  let escortGuard = 0
  while (!escortAvailable(store.getState().japa, store.getState().world!.day, false) && escortGuard < 8) {
    await sleepDay()
    escortGuard++
  }
  const escortDay = store.getState().world!.day
  check('the convoy calls and the detail pays', store.getState().runEscort() && store.getState().japa.stats.escorts === 1 && store.getState().japa.stats.escortEarned === M.escortPay)
  check('the siren clears the road for two days', sirenMinutesMult(store.getState().japa, escortDay + 1) === M.sirenMinutesMult)
  const origin = LOCATION_BY_ID[store.getState().world!.currentLocation]
  const dest = LOCATION_BY_ID['ful-felele'] // the long ride — the siren must show on real minutes
  const sirened = (await import('../src/game/systems/travel')).calculateTravel(origin, dest, 'taxi', 'sunny', 'morning', 1, sirenMinutesMult(store.getState().japa, escortDay + 1))
  const plain = (await import('../src/game/systems/travel')).calculateTravel(origin, dest, 'taxi', 'sunny', 'morning')
  check('the siren rides the SAME travel plan (×0.8 minutes)', sirened.minutes < plain.minutes, `${plain.minutes} → ${sirened.minutes}`)

  // — the ladder persists into the save (v13) —
  store.getState().saveNow()
  const raw = localStorage.getItem(SaveSystem.SAVE_KEY)
  let parsed: { version: number; education?: { graduated: boolean }; housing?: { owned: string | null }; japa?: { flownDay: number } } | null = null
  try {
    parsed = raw ? (JSON.parse(raw) as { version: number; education?: { graduated: boolean }; housing?: { owned: string | null }; japa?: { flownDay: number } }) : null
  } catch {
    parsed = null
  }
  check('the ladder persists into the v13 save', parsed?.version === SAVE_V && parsed?.education?.graduated === true && parsed?.housing?.owned === 'family-room' && typeof parsed?.japa?.flownDay === 'number' && (parsed?.japa?.flownDay ?? 0) > 0)
}

console.log(`\n========================================`)
console.log(`M12 THE LADDER — ${passed} passed, ${failed} failed`)
console.log(`========================================`)
if (failed > 0) process.exit(1)
