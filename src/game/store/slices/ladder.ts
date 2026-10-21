/**
 * LADDER SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1258-1260, 2906-3298.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */
import type { StateCreator } from 'zustand'
import type { GameStore, LadderSlice } from '../types'
import { CIVIC, LADDER } from '../../data/config'
import { audio } from '../../systems/audio'
import {
  freshEducationState,
  canEnroll,
  enrollApply,
  canAttendLecture,
  attendLectureApply,
  earnsDeansGrant,
  grantApply,
  canSitExam,
  examApply,
  examScore,
  canAttendConvocation,
  convocationApply,
} from '../../systems/education'
import { haptics } from '../../systems/haptics'
import {
  freshHousingState,
  canBuyProperty,
  buyPropertyApply,
  canFurnish,
  furnishApply,
  canPayRent,
  payRentApply,
  canResolveWahala,
  resolveWahalaApply,
  propertyFor,
} from '../../systems/housing'
import {
  freshJapaState,
  canRequestNimc,
  requestNimcApply,
  canCollectNimc,
  collectNimcApply,
  canRequestPassport,
  requestPassportApply,
  canCollectPassport,
  collectPassportApply,
  canTryAgent,
  tryAgentApply,
  canClearKgirs,
  clearanceApply,
  canGetPoliceCertificate,
  policeCertificateApply,
  canTakeFlight,
  takeFlightApply,
  canRunEscort,
  runEscortApply,
} from '../../systems/japa'
import { applyNeedsDelta } from '../../systems/needs'
import { formatNaira } from '../../systems/progression'
import {
  crimeAllowed,
  canJapa,
  CRIME_REFUSALS,
} from '../../systems/shield'
import { scheduleAutosave } from '../shared'

export const ladderSlice: StateCreator<GameStore, [], [], LadderSlice> = (set, get) => ({
  education: freshEducationState(),
  housing: freshHousingState(),
  japa: freshJapaState(),

  /* ---------------------- M12 — THE LADDER ---------------------- */

  /** Enroll at FUL: the fee, the level, the semester clock starts tomorrow. */
  enrollFul: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    // M13 — the family shield: FUL na teen/adult road (kids dey primary/secondary)
    if (player.ageBand === 'kid') {
      get().notify({ icon: '🛡️', text: 'University na teen/adult road — your school na the scammer game and the library.', tone: 'neutral' })
      return false
    }
    const gate = canEnroll(education, player.level)
    if (!gate.ok) {
      get().notify({ icon: '🎓', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.education.enrollFee, { label: 'FUL enrollment — semester fee', category: 'other' })) {
      get().notify({ icon: '💸', text: `The enrollment na ${formatNaira(LADDER.education.enrollFee)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    set({ education: enrollApply(education, world.day) })
    get().notify({ icon: '🎓', text: 'You don enroll at FUL! Lectures start tomorrow — the semester clock dey run (18 days, 12 lectures, then the exam).', tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Attend one lecture at FUL: smart XP + the tutorial stipend (+ the Dean's grant at 8). */
  attendLecture: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    const atUniversity = world.currentLocation.startsWith('ful-')
    const gate = canAttendLecture(education, world.day, atUniversity)
    if (!gate.ok) {
      get().notify({ icon: '🎓', text: gate.why, tone: 'neutral' })
      return false
    }
    if (player.needs.energy < 8) {
      get().notify({ icon: '🥵', text: 'You are too tired for the lecture hall. Rest small.', tone: 'bad' })
      return false
    }
    let ed = attendLectureApply(education, world.day)
    const grant = earnsDeansGrant(ed)
    if (grant) ed = grantApply(ed)
    set({ education: ed })
    get().addSkillXp('smart', LADDER.education.lectureSmartXp)
    get().addMoney(LADDER.education.lectureStipend, { label: 'Tutorial stipend — FUL lecture', category: 'hustle' })
    if (grant) {
      get().addMoney(LADDER.education.deansGrant, { label: "Dean's hustle grant — 8 lectures", category: 'tip' })
      get().addReputation(LADDER.education.deansGrantRep)
      get().notify({ icon: '🏅', text: `THE DEAN'S GRANT! ${LADDER.education.deansLectures} lectures don land — ${formatNaira(LADDER.education.deansGrant)} + the street dey respect the book.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().notify({ icon: '📚', text: `Lecture ${ed.lecturesDone}/${LADDER.education.lecturesNeeded} done — smart XP +${LADDER.education.lectureSmartXp}, stipend ${formatNaira(LADDER.education.lectureStipend)}.`, tone: 'good' })
    }
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Sit the semester exam at FUL: the work decides, no dice. */
  sitExam: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    const atUniversity = world.currentLocation.startsWith('ful-')
    const gate = canSitExam(education, world.day, atUniversity)
    if (!gate.ok) {
      get().notify({ icon: '📝', text: gate.why, tone: 'neutral' })
      return false
    }
    const { next, passed, graduatedNow } = examApply(education, world.day, player.skills.smart)
    set({ education: next })
    if (graduatedNow) {
      get().notify({ icon: '🎓', text: `FINAL EXAM PASSED! The convocation holds in ${LADDER.education.convocationInDays} days — the gown dey press.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else if (passed) {
      get().notify({ icon: '✅', text: `Semester ${education.semester} passed (score ${examScore(player.skills.smart, education.lecturesDone).toFixed(1)}) — semester ${next.semester} starts tomorrow.`, tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().notify({ icon: '📕', text: `The exam no pass (score ${examScore(player.skills.smart, education.lecturesDone).toFixed(1)} — you need ${LADDER.education.examPassScore}). The semester repeats — the lectures don reset.`, tone: 'bad' })
    }
    scheduleAutosave(get)
    return true
  },

  /** Collect the certificate at the convocation: the career gates open. */
  attendConvocation: () => {
    const { player, world, education } = get()
    if (!player || !world) return false
    const atUniversity = world.currentLocation.startsWith('ful-')
    const gate = canAttendConvocation(education, world.day, atUniversity)
    if (!gate.ok) {
      get().notify({ icon: '🎓', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ education: convocationApply(education) })
    get().addReputation(LADDER.education.graduateRep)
    const p0 = get().player!
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { mood: LADDER.education.graduateMood }) } })
    get().notify({ icon: '🎓', text: `CONVOCATION! The FUL certificate dey your hand — +${LADDER.education.graduateRep} rep, the career desks don open (Civil Servant, Tutorial Assistant).`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Pay the rent book (in person at home free; phone +₦50). */
  payRent: (channel) => {
    const { player, world, housing } = get()
    if (!player || !world) return false
    const gate = canPayRent(housing, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🏠', text: gate.why, tone: 'neutral' })
      return false
    }
    const fee = channel === 'phone' ? CIVIC.phonePayFee : 0
    if (channel === 'phone' && world.currentLocation !== 'home') {
      get().notify({ icon: '📱', text: 'The rent pays free in person — the phone transfer carries the ₦50 fee.', tone: 'neutral' })
      return false
    }
    if (fee > 0 && player.cash < gate.amount + fee) {
      get().notify({ icon: '💸', text: `The transfer fee na ${formatNaira(fee)} — your pocket no carry am.`, tone: 'bad' })
      return false
    }
    if (fee > 0 && !get().removeMoney(fee, { label: 'Transfer fee — rent', category: 'bank' })) return false
    set({ housing: payRentApply(housing, gate.amount) })
    get().removeMoney(gate.amount, { label: 'Rent — one cycle', category: 'other' })
    get().notify({ icon: '🏠', text: `Rent don clear — ${formatNaira(gate.amount)} paid, the book moves ${LADDER.housing.rentCycleDays} days forward.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Buy a rung of the housing ladder (the agent visits your sheet). */
  buyProperty: (propertyId) => {
    const { player, housing } = get()
    if (!player) return false
    const gate = canBuyProperty(housing, propertyId, player.level, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🏠', text: gate.why, tone: 'neutral' })
      return false
    }
    const prop = propertyFor(propertyId)!
    if (!get().removeMoney(prop.price, { label: `Property — ${prop.name}`, category: 'shop' })) return false
    set({ housing: buyPropertyApply(housing, propertyId) })
    get().notify({ icon: '🏠', text: `KEYS DON LAND! ${prop.name} na your own — no more rent, comfort +${prop.comfort} on every sleep.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** Furnish the owned home: one honest tier at a time. */
  furnishHome: (tier) => {
    const { player, housing } = get()
    if (!player) return false
    const gate = canFurnish(housing, tier)
    if (!gate.ok) {
      get().notify({ icon: '🛋️', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gate.cost, { label: `Furnishing tier ${tier} — ${LADDER.housing.furnishTiers.find((f) => f.tier === tier)?.label ?? ''}`, category: 'shop' })) return false
    set({ housing: furnishApply(housing, tier) })
    const p0 = get().player!
    const def = LADDER.housing.furnishTiers.find((f) => f.tier === tier)
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { mood: 2 }) } })
    get().notify({ icon: '🛋️', text: `${def?.label ?? 'Furnishing'} don land — the house don warm (+${def?.mood ?? 0} comfort).`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** Settle the landlord's wahala (the cost buys peace). */
  resolveWahala: () => {
    const { player, housing } = get()
    if (!player) return false
    const gate = canResolveWahala(housing, player.cash)
    if (!gate.ok) {
      get().notify({ icon: '🔑', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(gate.cost, { label: 'Landlord wahala settlement', category: 'other' })) return false
    set({ housing: resolveWahalaApply(housing) })
    get().notify({ icon: '🤝', text: `Wahala settle — ${formatNaira(gate.cost)} and the compound dey quiet again.`, tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The JAPA gauntlet — request the NIMC slip at the GRA desk. */
  requestNimc: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    // M13 — the JAPA gauntlet is adult paperwork (kids dey grow first)
    if (!canJapa(player.ageBand)) {
      get().notify({ icon: '🛡️', text: 'JAPA na adult road — grow first, the documents go wait.', tone: 'neutral' })
      return false
    }
    const atGrades = world.currentLocation === 'government-area'
    const gate = canRequestNimc(japa, player.level, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🪪', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.nimcFee, { label: 'NIMC enrollment fee', category: 'other' })) {
      get().notify({ icon: '💸', text: `The NIMC fee na ${formatNaira(LADDER.japa.nimcFee)}.`, tone: 'bad' })
      return false
    }
    set({ japa: requestNimcApply(japa, world.day) })
    get().notify({ icon: '🪪', text: `NIMC slip don enter queue — come back in ${LADDER.japa.nimcQueueDays} day(s). The queue no dey forget anybody.`, tone: 'neutral' })
    audio.play('click')
    scheduleAutosave(get)
    return true
  },

  collectNimc: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canCollectNimc(japa, world.day, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🪪', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: collectNimcApply(japa, world.day) })
    get().notify({ icon: '🪪', text: 'NIMC slip dey your hand — step 1 of 5 don land. The passport window dey wait.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The official passport window: 3 days, the full fee, zero drama. */
  requestPassport: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canRequestPassport(japa, player.cash, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '📜', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.passportFee, { label: 'Passport application — official window', category: 'other' })) return false
    set({ japa: requestPassportApply(japa, world.day) })
    get().notify({ icon: '📜', text: `Passport application dey process — ${LADDER.japa.passportQueueDays} days, no drama.`, tone: 'neutral' })
    audio.play('click')
    scheduleAutosave(get)
    return true
  },

  collectPassport: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canCollectPassport(japa, world.day, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '📜', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: collectPassportApply(japa, world.day) })
    get().notify({ icon: '📜', text: 'The green book don land — passport dey your hand! The KGIRS clearance dey next.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The Ganaja street agent: half the fee, sometimes a wash. */
  tryAgent: () => {
    const { player, world, japa, account } = get()
    if (!player || !world) return false
    // M13 — THE FAMILY SHIELD: the street agent is crime-adjacent — kids
    // can't japa at all, teens can't touch the 419 road. 18+ only.
    if (!canJapa(player.ageBand) || !crimeAllowed(player.ageBand, 'japa-agent')) {
      get().notify({ icon: '🛡️', text: CRIME_REFUSALS['japa-agent'], tone: 'neutral' })
      return false
    }
    const atGanaja = world.currentLocation === 'ganaja-junction'
    const gate = canTryAgent(japa, player.cash, atGanaja)
    if (!gate.ok) {
      get().notify({ icon: '🕶️', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.agentFee, { label: 'Agent express passport — Ganaja', category: 'other' })) return false
    const { next, real } = tryAgentApply(japa, world.day, account.handle)
    set({ japa: next })
    if (real) {
      get().notify({ icon: '🕶️', text: 'The agent sabi somebody! The passport don land TODAY — the street go respect the connect.', tone: 'good' })
      audio.play('levelup')
      haptics.fire('levelup')
    } else {
      get().addReputation(-LADDER.japa.agentRepHit)
      get().notify({ icon: '🚬', text: `NA WASH! The agent don disappear with ${formatNaira(LADDER.japa.agentFee)} — the street don laugh at you (-${LADDER.japa.agentRepHit} rep). The official window dey wait.`, tone: 'bad' })
      audio.play('notify')
    }
    scheduleAutosave(get)
    return true
  },

  /** KGIRS clearance: the taxman's signature reads your record. */
  kgirsClearance: () => {
    const { player, world, japa, civic } = get()
    if (!player || !world || !civic) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canClearKgirs(japa, civic.kgirs.warrant, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🧾', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: clearanceApply(japa, world.day) })
    get().notify({ icon: '🧾', text: 'KGIRS clearance don stamp — the taxman dey shake your hand. The police certificate dey next.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** The police character certificate: a clean fine book + the fee. */
  policeCertificate: () => {
    const { player, world, japa, civic } = get()
    if (!player || !world || !civic) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canGetPoliceCertificate(japa, civic.police.fines, player.cash, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '👮', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.policeFee, { label: 'Police character certificate', category: 'other' })) return false
    set({ japa: policeCertificateApply(japa, world.day) })
    get().notify({ icon: '👮', text: 'The character certificate don land — your file complete! The send-off dey wait at the Motor Park.', tone: 'good' })
    audio.play('chime')
    haptics.fire('reward')
    scheduleAutosave(get)
    return true
  },

  /** THE SEND-OFF: the complete file + the ticket = the Abuja motor loads. */
  takeFlight: () => {
    const { player, world, japa } = get()
    if (!player || !world) return false
    // M13 — the send-off na adult departure (the shield holds the gate)
    if (!canJapa(player.ageBand)) {
      get().notify({ icon: '🛡️', text: 'The send-off na adult road — grow first, JAPA go wait.', tone: 'neutral' })
      return false
    }
    const atPark = world.currentLocation === 'transport-area'
    const gate = canTakeFlight(japa, player.cash, atPark)
    if (!gate.ok) {
      get().notify({ icon: '✈️', text: gate.why, tone: 'neutral' })
      return false
    }
    if (!get().removeMoney(LADDER.japa.ticketFee, { label: 'The Abuja ticket — JAPA send-off', category: 'transport' })) return false
    set({ japa: takeFlightApply(japa, world.day) })
    get().addReputation(LADDER.japa.repReward)
    const p0 = get().player!
    set({ player: { ...p0, needs: applyNeedsDelta(p0.needs, { mood: LADDER.japa.moodReward }) } })
    if (!player.achievements.includes('japa')) {
      set({ player: { ...get().player!, achievements: [...player.achievements, 'japa'] } })
    }
    get().notify({ icon: '✈️', text: `THE SEND-OFF! The whole motor park don spray you — JAPA DON LAND (+${LADDER.japa.repReward} rep). The first remittance go reach tomorrow morning.`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },

  /** The MOPOL VIP escort: the siren clears your road for two days. */
  runEscort: () => {
    const { player, world, japa, civic } = get()
    if (!player || !world || !civic) return false
    const atGrades = world.currentLocation === 'government-area'
    const gate = canRunEscort(japa, world.day, civic.kgirs.warrant, atGrades)
    if (!gate.ok) {
      get().notify({ icon: '🚨', text: gate.why, tone: 'neutral' })
      return false
    }
    set({ japa: runEscortApply(japa, world.day) })
    get().addMoney(LADDER.mopol.escortPay, { label: 'MOPOL VIP escort detail', category: 'job' })
    get().addReputation(LADDER.mopol.escortRep)
    get().notify({ icon: '🚨', text: `Escort detail done — ${formatNaira(LADDER.mopol.escortPay)} + the siren don clear your road for ${LADDER.mopol.sirenDays} days (journeys ×${LADDER.mopol.sirenMinutesMult}).`, tone: 'good' })
    audio.play('levelup')
    haptics.fire('levelup')
    scheduleAutosave(get)
    return true
  },
})
