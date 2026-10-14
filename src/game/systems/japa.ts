/**
 * LOKOJA LIFE — M12: THE LADDER — JAPA (pure rules)
 * --------------------------------------------------
 * The endgame gauntlet, played at the real desks: the NIMC slip at the
 * GRA office (a queue with an honest tomorrow), the passport (the
 * official window takes three days — or the street agent at Ganaja
 * takes half the money and sometimes disappears), the KGIRS clearance
 * (the taxman's signature reads your record), the police character
 * certificate (a clean fine book), and the send-off at the Motor Park
 * when the Abuja motor loads. The morning after, the first remittance
 * lands — the japa is real, and the city still needs you.
 *
 * THE MOPOL DETAIL: serve enough police shifts and the VIP escort
 * calls — every third day, the siren clears the road for your next
 * journeys (×0.8 minutes while it lasts).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the agent's honesty is a hash of
 *    (day, handle) — same day, same agent, same character.
 *  - The gauntlet is a chain: every desk refuses without the previous
 *    paper. The state is a progress ledger; nothing else persists.
 *  - No store, no React, no DOM. Every naira constant lives in config.LADDER.
 */

import type { JapaState } from '../types'
import { LADDER } from '../data/config'
import { civicHash } from './civic'

const J = LADDER.japa
const M = LADDER.mopol

/* ------------------------------ fresh state -------------------------------- */

export function freshJapaState(): JapaState {
  return {
    nimcReadyDay: 0,
    nimcDay: 0,
    passportReadyDay: 0,
    passportDay: 0,
    agentTries: 0,
    agentScams: 0,
    clearanceDay: 0,
    policeDay: 0,
    flownDay: 0,
    remitDay: 0,
    policeShifts: 0,
    sirenUntilDay: 0,
    lastEscortDay: 0,
    stats: { escorts: 0, escortEarned: 0 },
  }
}

/* -------------------------------- the chain -------------------------------- */

/** The gauntlet's honest step names (the banner + panel read these). */
export type JapaStep = 'nimc' | 'passport' | 'clearance' | 'police' | 'flight'

/** Is this step's paper in hand? */
export function hasPaper(japa: JapaState, step: JapaStep): boolean {
  switch (step) {
    case 'nimc': return japa.nimcDay > 0
    case 'passport': return japa.passportDay > 0
    case 'clearance': return japa.clearanceDay > 0
    case 'police': return japa.policeDay > 0
    case 'flight': return japa.flownDay > 0
  }
}

/** All four papers in hand — the motor can load. */
export function papersComplete(japa: JapaState): boolean {
  return hasPaper(japa, 'nimc') && hasPaper(japa, 'passport') && hasPaper(japa, 'clearance') && hasPaper(japa, 'police')
}

/* ------------------------------ 1. the NIMC slip ---------------------------- */

export function canRequestNimc(japa: JapaState, level: number, standingAtGrades: boolean): { ok: boolean; why: string } {
  if (hasPaper(japa, 'nimc')) return { ok: false, why: 'You get your NIMC slip already.' }
  if (level < J.unlockLevel) return { ok: false, why: `The JAPA desks open at Level ${J.unlockLevel}.` }
  if (japa.nimcReadyDay > 0) return { ok: false, why: `The slip dey print — come back in ${Math.max(1, japa.nimcReadyDay)} day(s)... the queue no dey forget anybody.` }
  if (!standingAtGrades) return { ok: false, why: 'The NIMC desk dey at the Government Area — go there in person.' }
  return { ok: true, why: '' }
}

export function requestNimcApply(japa: JapaState, day: number): JapaState {
  return { ...japa, nimcReadyDay: day + J.nimcQueueDays }
}

export function canCollectNimc(japa: JapaState, day: number, standingAtGrades: boolean): { ok: boolean; why: string } {
  if (hasPaper(japa, 'nimc')) return { ok: false, why: 'You don collect am already.' }
  if (japa.nimcReadyDay === 0) return { ok: false, why: 'You never request the slip.' }
  if (day < japa.nimcReadyDay) return { ok: false, why: `Come back tomorrow — the queue dey move slow.` }
  if (!standingAtGrades) return { ok: false, why: 'The slip collects at the Government Area desk.' }
  return { ok: true, why: '' }
}

export function collectNimcApply(japa: JapaState, day: number): JapaState {
  return { ...japa, nimcDay: day }
}

/* --------------------------- 2. the passport window ------------------------- */

export function canRequestPassport(japa: JapaState, cash: number, standingAtGrades: boolean): { ok: boolean; why: string } {
  if (hasPaper(japa, 'passport')) return { ok: false, why: 'Your passport dey your hand already.' }
  if (!hasPaper(japa, 'nimc')) return { ok: false, why: 'The window wants your NIMC slip first — the chain no dey skip.' }
  if (japa.passportReadyDay > 0) return { ok: false, why: `The passport dey process — the official window takes ${J.passportQueueDays} days.` }
  if (cash < J.passportFee) return { ok: false, why: `The official fee na ${J.passportFee.toLocaleString()}.` }
  if (!standingAtGrades) return { ok: false, why: 'The passport window dey at the Government Area.' }
  return { ok: true, why: '' }
}

export function requestPassportApply(japa: JapaState, day: number): JapaState {
  return { ...japa, passportReadyDay: day + J.passportQueueDays }
}

export function canCollectPassport(japa: JapaState, day: number, standingAtGrades: boolean): { ok: boolean; why: string } {
  if (hasPaper(japa, 'passport')) return { ok: false, why: 'You don collect am already.' }
  if (japa.passportReadyDay === 0) return { ok: false, why: 'You never apply.' }
  if (day < japa.passportReadyDay) return { ok: false, why: `The book dey print — ${japa.passportReadyDay - day} day(s) more.` }
  if (!standingAtGrades) return { ok: false, why: 'The passport collects at the Government Area window.' }
  return { ok: true, why: '' }
}

export function collectPassportApply(japa: JapaState, day: number): JapaState {
  return { ...japa, passportDay: day }
}

/* ---------------------------- 3. the street agent --------------------------- */

/**
 * THE AGENT LAW: the Ganaja "connect" offers a fast passport for half
 * the official fee. Whether he delivers is a hash of (day, handle) —
 * deterministic, so the street can learn his character. Real: the
 * passport lands instantly. Fake: the money don go, the street laughs,
 * and the rep pays for the lesson.
 */
export function agentDelivers(day: number, handle: string | null): boolean {
  return civicHash('japa-agent', day, handle ?? 'guest') / 0xffffffff < J.agentRealChance
}

export function canTryAgent(japa: JapaState, cash: number, standingAtGanaja: boolean): { ok: boolean; why: string } {
  if (hasPaper(japa, 'passport')) return { ok: false, why: 'You get passport already — the agent no fit help you.' }
  if (!hasPaper(japa, 'nimc')) return { ok: false, why: 'Even the agent wants your NIMC slip first.' }
  if (japa.passportReadyDay > 0) return { ok: false, why: 'Your official passport dey process — no double-book am.' }
  if (cash < J.agentFee) return { ok: false, why: `The agent wants ${J.agentFee.toLocaleString()} up front.` }
  if (!standingAtGanaja) return { ok: false, why: 'The agent dey hustle at Ganaja Junction.' }
  return { ok: true, why: '' }
}

export function tryAgentApply(japa: JapaState, day: number, handle: string | null): { next: JapaState; real: boolean } {
  const real = agentDelivers(day, handle)
  return {
    next: {
      ...japa,
      passportDay: real ? day : japa.passportDay,
      agentTries: japa.agentTries + 1,
      agentScams: japa.agentScams + (real ? 0 : 1),
    },
    real,
  }
}

/* --------------------------- 4. the KGIRS clearance -------------------------- */

export function canClearKgirs(japa: JapaState, warrant: boolean, standingAtGrades: boolean): { ok: boolean; why: string } {
  if (hasPaper(japa, 'clearance')) return { ok: false, why: 'The clearance dey your file already.' }
  if (!hasPaper(japa, 'passport')) return { ok: false, why: 'The clearance wants your passport in the file first.' }
  if (warrant) return { ok: false, why: 'A tax warrant dey your name — the KGIRS pen no go move. Settle am first.' }
  if (!standingAtGrades) return { ok: false, why: 'The clearance desk dey at the Government Area.' }
  return { ok: true, why: '' }
}

export function clearanceApply(japa: JapaState, day: number): JapaState {
  return { ...japa, clearanceDay: day }
}

/* ------------------------ 5. the police certificate -------------------------- */

export function canGetPoliceCertificate(japa: JapaState, fines: number, cash: number, standingAtGrades: boolean): { ok: boolean; why: string } {
  if (hasPaper(japa, 'police')) return { ok: false, why: 'The certificate dey your file already.' }
  if (!hasPaper(japa, 'clearance')) return { ok: false, why: 'The police wants the KGIRS clearance in the file first.' }
  if (fines > 0) return { ok: false, why: 'Your fine book no clean — settle the police first.' }
  if (cash < J.policeFee) return { ok: false, why: `The certificate na ${J.policeFee.toLocaleString()}.` }
  if (!standingAtGrades) return { ok: false, why: 'The police desk dey at the Government Area.' }
  return { ok: true, why: '' }
}

export function policeCertificateApply(japa: JapaState, day: number): JapaState {
  return { ...japa, policeDay: day }
}

/* ------------------------------- 6. the send-off ----------------------------- */

export function canTakeFlight(japa: JapaState, cash: number, standingAtPark: boolean): { ok: boolean; why: string } {
  if (japa.flownDay > 0) return { ok: false, why: 'You don fly already — the send-off na once in a life.' }
  if (!papersComplete(japa)) return { ok: false, why: 'The motor dey wait for the complete file — check the missing papers.' }
  if (cash < J.ticketFee) return { ok: false, why: `The ticket na ${J.ticketFee.toLocaleString()} — the Abuja motor no dey take credit.` }
  if (!standingAtPark) return { ok: false, why: 'The send-off dey at the Motor Park — where every journey starts.' }
  return { ok: true, why: '' }
}

export function takeFlightApply(japa: JapaState, day: number): JapaState {
  return { ...japa, flownDay: day }
}

/* ------------------------------ the remittance ------------------------------- */

/** Does the first remittance land this morning? (The morning after.) */
export function remittanceLands(japa: JapaState, day: number): boolean {
  return japa.flownDay > 0 && japa.remitDay === 0 && day > japa.flownDay
}

export function remittanceApply(japa: JapaState, day: number): JapaState {
  return { ...japa, remitDay: day }
}

/* ------------------------------ the MOPOL detail ----------------------------- */

/**
 * THE ESCORT LAW: the detail calls every Nth day once the police shifts
 * stack up and the taxman has no warrant on you. Deterministic — the
 * city knows when the convoy moves.
 */
export function escortAvailable(japa: JapaState, day: number, warrant: boolean): boolean {
  if (japa.policeShifts < M.shiftsToUnlock) return false
  if (warrant) return false
  return day % M.escortEvery === 0 && day > japa.lastEscortDay
}

export function canRunEscort(japa: JapaState, day: number, warrant: boolean, standingAtGrades: boolean): { ok: boolean; why: string } {
  if (japa.policeShifts < M.shiftsToUnlock) return { ok: false, why: `The detail wants ${M.shiftsToUnlock} police shifts of trust — you carry ${japa.policeShifts}.` }
  if (warrant) return { ok: false, why: 'No escort for a wanted man — settle the taxman.' }
  if (!standingAtGrades) return { ok: false, why: 'The convoy assembles at the Government Area.' }
  if (!escortAvailable(japa, day, warrant)) return { ok: false, why: `The detail no dey today — the convoy moves every ${M.escortEvery} days.` }
  return { ok: true, why: '' }
}

export function runEscortApply(japa: JapaState, day: number): JapaState {
  return {
    ...japa,
    lastEscortDay: day,
    sirenUntilDay: day + M.sirenDays,
    stats: { ...japa.stats, escorts: japa.stats.escorts + 1, escortEarned: japa.stats.escortEarned + M.escortPay },
  }
}

/** The siren's honest discount on the road (1 = none). */
export function sirenMinutesMult(japa: JapaState, day: number): number {
  return japa.sirenUntilDay >= day ? M.sirenMinutesMult : 1
}
