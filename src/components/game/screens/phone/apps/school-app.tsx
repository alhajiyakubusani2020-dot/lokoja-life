'use client'

/**
 * M21 — SCHOOL APP (the FUL gate in your pocket)
 * ----------------------------------------------
 * The M12 education ladder exactly as the save keeps it: enrolment
 * state, the semester clock (18 days, 12 lectures, 3 exam days), the
 * ASUU strike (derived per semester — the union never asks permission),
 * the exam's honest math (smart + lectures × 0.5 ≥ 8), and the real
 * stats (examsPassed / failedExams / graduated). The one store door
 * this app offers is the REAL enrolment action — enrollFul() takes the
 * ₦25,000 fee through the wallet, and it refuses a kid by the family
 * shield (university na teen/adult road). The 12 schools listed are
 * the city's REAL registry (data/schools.ts — OSM/plus-code anchors),
 * not a brochure.
 *
 * M24-UI wave 2 — the face: FUL-green hero with the status chip, the
 * semester clock as a tall honest bar, the exam math card, the real
 * campus registry. Every number, every testid, every law: unchanged.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import {
  absoluteSemesterIndex,
  semesterDayOf,
  isLectureWindow,
  isExamWindow,
  isStrikeDay,
  strikeDaysLeft,
  examScore,
  canEnroll,
} from '@/game/systems/education'
import { LADDER } from '@/game/data/config'
import { SCHOOLS } from '@/game/data/schools'
import { FaceHero, SectionLabel, StatusChip, MiniBar } from './app-face'

export const APP_ID = 'school'
export const APP_TITLE = 'School'
export const APP_GLYPH = '🎓'

const E = LADDER.education
const FUL = SCHOOLS.find((s) => s.id === 'ful-felele')

export default function SchoolApp() {
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const education = useGameStore((s) => s.education)
  const enrollFul = useGameStore((s) => s.enrollFul)
  if (!player || !world) return null

  const day = world.day
  const semesterDay = semesterDayOf(education, day)
  const gate = canEnroll(education, player.level)
  const strike = isStrikeDay(education, day)
  const exam = examScore(player.skills.smart, education.lecturesDone)

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="school-app">
      <FaceHero
        id="school"
        glyph="🎓"
        title="School"
        sub={FUL ? `${FUL.name} — ${FUL.motto}` : 'The Lokoja ladder'}
        hue="green"
        right={
          <StatusChip tone={education.graduated ? 'gold' : education.enrolled ? 'ok' : 'plain'}>
            <span data-testid="school-status">{education.graduated ? 'GRADUATE' : education.enrolled ? `SEM ${education.semester}` : 'NOT ENROLLED'}</span>
          </StatusChip>
        }
      />

      <div className="mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* enrolment */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="school-enrolment">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Enrolment</span>
          {education.enrolled || education.graduated ? (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
              {education.graduated
                ? `The FUL certificate dey your hand — the career desks (Civil Servant, Tutorial Assistant) don open. Convocation ${education.convocationAttended ? 'attended' : `holds day ${education.convocationDay ?? '—'} at FUL`}.`
                : `Ladder: exam ${education.examsPassed}/${E.semestersToGraduate} passed toward the certificate (absolute semester ${absoluteSemesterIndex(education)}).`}
            </p>
          ) : (
            <>
              <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                The FUL gate: {formatNaira(E.enrollFee)} enrollment fee, Level {E.enrollLevel}+,
                then the clock runs — {E.semesterDays}-day semesters, {E.lecturesNeeded} lectures, 4 semesters to the certificate.
              </p>
              <p className="mt-0.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
                {gate.ok ? 'The gate is open for you.' : gate.why}
                {player.ageBand === 'kid' ? ' University na teen/adult road — your school na the library and the scammer game.' : ''}
              </p>
              <button
                type="button"
                data-testid="school-enroll"
                className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] py-2.5 text-[11px] font-black tracking-wide text-white shadow-[var(--lko-shadow-sm)] disabled:opacity-50"
                onClick={() => { audio.play('click'); enrollFul() }}
              >
                ENROLL — {formatNaira(E.enrollFee)}
              </button>
            </>
          )}
        </div>

        {/* the semester clock */}
        {education.enrolled && !education.graduated && (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="school-semester">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Semester {education.semester}</span>
              <span className="lko-num text-[9px] font-bold text-[var(--lko-ink-soft)]">day {semesterDay}/{E.semesterDays}</span>
            </div>
            <div className="mt-2">
              <MiniBar pct={(semesterDay / E.semesterDays) * 100} tall />
            </div>
            <div className="mt-2 space-y-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
              <p>lectures: {education.lecturesDone}/{E.lecturesNeeded} · each pays {formatNaira(E.lectureStipend)} + {E.lectureSmartXp} smart XP · the Dean pays {formatNaira(E.deansGrant)} at {E.deansLectures}</p>
              {isLectureWindow(education, day) && !strike && <p className="font-bold text-[var(--lko-green-deep)]">lecture window open — one lecture a day, at FUL only.</p>}
              {strike && <p className="font-bold text-red-700" data-testid="school-strike">ASUU don lock gate — {strikeDaysLeft(education, day)} day{strikeDaysLeft(education, day) === 1 ? '' : 's'} more. The union never asks permission.</p>}
              {isExamWindow(education, day) && <p className="font-bold text-[var(--lko-terra)]">exam window — the halls quiet for the papers.</p>}
            </div>
          </div>
        )}

        {/* the exam math */}
        <SectionLabel>The Exam Math</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="school-exam">
          <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            score = smart + lectures × 0.5 ≥ {E.examPassScore}. No dice — the semester&apos;s work decides.
          </p>
          <p className="mt-1 rounded-lg bg-black/[0.02] px-2 py-1.5 text-[10.5px] font-bold text-[var(--lko-ink)]" data-testid="school-exam-score">
            your standing now: {player.skills.smart} + {education.lecturesDone} × 0.5 = <span className="lko-num font-black">{exam.toFixed(1)}</span>{' '}
            {exam >= E.examPassScore ? '— that one pass' : '— that one no pass yet'}
          </p>
          <div className="mt-1.5 space-y-0.5 text-[10px] font-bold text-[var(--lko-ink-soft)]">
            <p>exams passed ×{education.examsPassed} · failed ×{education.failedExams} · sats ×{education.stats.examSits}</p>
            <p>lifetime lectures ×{education.stats.lectures} · semesters cleared ×{education.stats.semestersPassed}</p>
          </div>
        </div>

        {/* the city's real schools */}
        <SectionLabel>The Schools of Lokoja</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            {SCHOOLS.length} real campuses — OSM ground truth and plus-code anchors, same projection as the 3D city.
          </p>
          <div className="mt-1.5 space-y-1">
            {SCHOOLS.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg bg-black/[0.02] px-2 py-1 text-[10px] font-bold" data-testid={`school-site-${s.id}`}>
                <span className="truncate text-[var(--lko-ink-soft)]">{s.emoji} {s.name}</span>
                <span className="shrink-0 text-[9.5px] font-extrabold text-[var(--lko-ink-soft)]">{s.kind}{s.anchor === 'osm' ? ' · OSM' : s.anchor === 'plus-code' ? ' · plus-code' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
