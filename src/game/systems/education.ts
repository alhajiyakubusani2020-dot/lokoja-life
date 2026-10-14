/**
 * LOKOJA LIFE — M12: THE LADDER — EDUCATION (pure rules)
 * -------------------------------------------------------
 * FUL runs a semester clock: enroll → attend lectures (real smart-skill
 * XP + the tutorial stipend) → the ASUU strike freezes the gate
 * (deterministic per semester — the union never asks permission) → the
 * exam window reads the semester's work (smart + lectures, an honest
 * bar, no dice) → pass climbs the ladder, fail repeats the semester →
 * the fourth pass calls the convocation → the certificate opens the
 * career jobs. Eight lectures in one semester earns the Dean's hustle
 * grant — the marketing ground zero pays its students.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the semester's phase, the strike, and the
 *    exam verdict are DERIVED from (day, semesterStartDay, smart) — zero
 *    strike state, reload-proof by construction.
 *  - The exam is not a lottery: it reads the semester's work. Skipped
 *    lectures are failed exam questions.
 *  - No store, no React, no DOM. Every constant lives in config.LADDER.
 */

import type { EducationState } from '../types'
import { LADDER } from '../data/config'
import { civicHash } from './civic'

const E = LADDER.education

/* ------------------------------ fresh state -------------------------------- */

export function freshEducationState(): EducationState {
  return {
    enrolled: false,
    semester: 1,
    semesterStartDay: 0,
    lecturesDone: 0,
    lastLectureDay: 0,
    lastGrantSemester: 0,
    examsPassed: 0,
    failedExams: 0,
    graduated: false,
    convocationDay: null,
    convocationAttended: false,
    stats: { lectures: 0, semestersPassed: 0, examSits: 0 },
  }
}

/* ------------------------------ phase laws --------------------------------- */

/** The absolute semester index (the ladder counts repeats honestly). */
export function absoluteSemesterIndex(ed: EducationState): number {
  return ed.examsPassed + ed.semester
}

/** Day inside the current semester (1-based; 0 before it starts). */
export function semesterDayOf(ed: EducationState, day: number): number {
  if (!ed.enrolled || ed.graduated) return 0
  return Math.max(0, day - ed.semesterStartDay + 1)
}

/** Is today in the lecture window (before the exam days)? */
export function isLectureWindow(ed: EducationState, day: number): boolean {
  const d = semesterDayOf(ed, day)
  return d >= 1 && d <= E.semesterDays - E.examDays
}

/** Is today in the exam window (the semester's last days)? */
export function isExamWindow(ed: EducationState, day: number): boolean {
  const d = semesterDayOf(ed, day)
  return d > E.semesterDays - E.examDays && d <= E.semesterDays
}

/* ------------------------------ the strike law ----------------------------- */

/**
 * THE ASUU LAW: the union strikes on a seeded share of semesters — the
 * gate freezes from lecture-day 7 for a seeded 5–8 days. Derived from
 * the absolute semester index alone: no state, no mercy, reload-proof.
 */
export function strikeForSemester(semesterIndex: number): { active: true; length: number } | { active: false } {
  const roll = civicHash('asuu', semesterIndex) / 0xffffffff
  if (roll >= E.strikeChance) return { active: false }
  const lenRoll = civicHash('asuu-len', semesterIndex) / 0xffffffff
  const length = E.strikeMinDays + Math.floor(lenRoll * (E.strikeMaxDays - E.strikeMinDays + 1))
  return { active: true, length }
}

/** Is the lecture gate frozen today (strike in session)? */
export function isStrikeDay(ed: EducationState, day: number): boolean {
  if (!ed.enrolled) return false
  const s = strikeForSemester(absoluteSemesterIndex(ed))
  if (!s.active) return false
  const start = ed.semesterStartDay + E.strikeStartDay - 1
  return day >= start && day < start + s.length
}

/** Days of strike left today (0 = the gate is open). */
export function strikeDaysLeft(ed: EducationState, day: number): number {
  if (!ed.enrolled) return 0
  const s = strikeForSemester(absoluteSemesterIndex(ed))
  if (!s.active) return 0
  const start = ed.semesterStartDay + E.strikeStartDay - 1
  return Math.max(0, start + s.length - day)
}

/* ------------------------------ the lecture law ---------------------------- */

export function canAttendLecture(
  ed: EducationState,
  day: number,
  standingAtUniversity: boolean,
): { ok: boolean; why: string } {
  if (!ed.enrolled) return { ok: false, why: 'You no be student yet — the FUL gate takes the enrollment fee.' }
  if (ed.graduated) return { ok: false, why: 'You don graduate — the certificate dey your hand already.' }
  if (!standingAtUniversity) return { ok: false, why: 'The lectures dey hold at FUL — travel there first.' }
  if (!isLectureWindow(ed, day)) return { ok: false, why: isExamWindow(ed, day) ? 'Exam season — the halls are quiet for the papers.' : 'The semester has not started yet.' }
  if (isStrikeDay(ed, day)) return { ok: false, why: `ASUU don lock gate — ${strikeDaysLeft(ed, day)} day${strikeDaysLeft(ed, day) === 1 ? '' : 's'} more.` }
  if (ed.lastLectureDay === day) return { ok: false, why: 'You don attend today one lecture already — the body needs rest.' }
  if (ed.lecturesDone >= E.lecturesNeeded) return { ok: false, why: 'You don cover the whole syllabus — go and write the exam.' }
  return { ok: true, why: '' }
}

/** Apply one lecture: the count, the stat. (Cash + XP ride the store.) */
export function attendLectureApply(ed: EducationState, day: number): EducationState {
  return {
    ...ed,
    lecturesDone: ed.lecturesDone + 1,
    lastLectureDay: day,
    stats: { ...ed.stats, lectures: ed.stats.lectures + 1 },
  }
}

/** The Dean's hustle grant: 8 lectures in one semester pays once. */
export function earnsDeansGrant(ed: EducationState): boolean {
  return ed.lecturesDone === E.deansLectures && ed.lastGrantSemester !== absoluteSemesterIndex(ed)
}

export function grantApply(ed: EducationState): EducationState {
  return { ...ed, lastGrantSemester: absoluteSemesterIndex(ed) }
}

/* -------------------------------- the exam law ----------------------------- */

/**
 * THE EXAM LAW: the semester's work decides — smart + lectures × 0.5
 * against the honest bar. smart 2 with all 12 lectures passes; a skiving
 * genius (smart 5, 4 lectures = 7) repeats the semester. Deterministic:
 * same work, same verdict, forever.
 */
export function examScore(smart: number, lecturesDone: number): number {
  return smart + lecturesDone * 0.5
}

export function examPasses(smart: number, lecturesDone: number): boolean {
  return examScore(smart, lecturesDone) >= E.examPassScore
}

export function canSitExam(
  ed: EducationState,
  day: number,
  standingAtUniversity: boolean,
): { ok: boolean; why: string } {
  if (!ed.enrolled) return { ok: false, why: 'The exam hall is for students.' }
  if (ed.graduated) return { ok: false, why: 'You don graduate — leave the hall for those still climbing.' }
  if (!standingAtUniversity) return { ok: false, why: 'The exam dey hold at FUL — travel there first.' }
  if (!isExamWindow(ed, day)) return { ok: false, why: `The exam window opens on lecture-day ${E.semesterDays - E.examDays + 1}.` }
  return { ok: true, why: '' }
}

/**
 * Apply the exam verdict. PASS: the ladder climbs (semester+1 starts
 * tomorrow); the fourth pass calls the convocation. FAIL: the same
 * semester repeats from tomorrow, lectures reset — ASUU's money is
 * never wasted, only delayed.
 */
export function examApply(ed: EducationState, day: number, smart: number): { next: EducationState; passed: boolean; graduatedNow: boolean } {
  const passed = examPasses(smart, ed.lecturesDone)
  if (!passed) {
    return {
      next: {
        ...ed,
        failedExams: ed.failedExams + 1,
        semesterStartDay: day + 1,
        lecturesDone: 0,
        stats: { ...ed.stats, examSits: ed.stats.examSits + 1 },
      },
      passed: false,
      graduatedNow: false,
    }
  }
  const graduating = ed.semester >= E.semestersToGraduate
  if (graduating) {
    return {
      next: {
        ...ed,
        examsPassed: ed.examsPassed + 1,
        graduated: true,
        convocationDay: day + E.convocationInDays,
        semesterStartDay: day + 1,
        stats: { ...ed.stats, examSits: ed.stats.examSits + 1, semestersPassed: ed.stats.semestersPassed + 1 },
      },
      passed: true,
      graduatedNow: true,
    }
  }
  return {
    next: {
      ...ed,
      examsPassed: ed.examsPassed + 1,
      semester: ed.semester + 1,
      semesterStartDay: day + 1,
      lecturesDone: 0,
      stats: { ...ed.stats, examSits: ed.stats.examSits + 1, semestersPassed: ed.stats.semestersPassed + 1 },
    },
    passed: true,
    graduatedNow: false,
  }
}

/* ----------------------------- the convocation ----------------------------- */

export function canAttendConvocation(ed: EducationState, day: number, standingAtUniversity: boolean): { ok: boolean; why: string } {
  if (!ed.graduated) return { ok: false, why: 'The convocation is for graduates only.' }
  if (ed.convocationAttended) return { ok: false, why: 'You don collect the certificate — once is once.' }
  if (ed.convocationDay === null || day < ed.convocationDay) return { ok: false, why: `The ceremony holds in ${ed.convocationDay !== null ? Math.max(0, ed.convocationDay - day) : E.convocationInDays} day(s) — the gown dey press.` }
  if (!standingAtUniversity) return { ok: false, why: 'The ceremony dey at FUL — travel there first.' }
  return { ok: true, why: '' }
}

export function convocationApply(ed: EducationState): EducationState {
  return { ...ed, convocationAttended: true }
}

/* ------------------------------- the gates --------------------------------- */

export function canEnroll(ed: EducationState, level: number): { ok: boolean; why: string } {
  if (ed.enrolled) return { ok: false, why: 'You dey school already — face your books.' }
  if (ed.graduated) return { ok: false, why: 'You don graduate — FUL no dey re-admit the certified.' }
  if (level < E.enrollLevel) return { ok: false, why: `The gate opens at Level ${E.enrollLevel}.` }
  return { ok: true, why: '' }
}

export function enrollApply(ed: EducationState, day: number): EducationState {
  return { ...freshEducationState(), enrolled: true, semester: 1, semesterStartDay: day + 1 }
}
