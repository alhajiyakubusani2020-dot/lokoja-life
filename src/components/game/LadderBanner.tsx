'use client'

/**
 * LOKOJA LIFE — LadderBanner (M12: THE LADDER)
 * ---------------------------------------------
 * The life above the hustle, one glance: the FUL semester clock (with
 * the ASUU strike when the gate freezes), the rent book / the owned
 * roof, the JAPA document chain (five honest steps), and the MOPOL
 * detail when the convoy calls. Pure presentation over the ladder
 * laws — every naira moves through the store's ladder actions.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { LADDER } from '@/game/data/config'
import { isLectureWindow, isExamWindow, isStrikeDay, strikeDaysLeft, semesterDayOf } from '@/game/systems/education'
import { homeComfort, propertyFor } from '@/game/systems/housing'
import { hasPaper, escortAvailable } from '@/game/systems/japa'
import { formatNaira } from '@/game/systems/progression'

export function LadderBanner() {
  const world = useGameStore((s) => s.world)!
  const player = useGameStore((s) => s.player)!
  const education = useGameStore((s) => s.education)
  const housing = useGameStore((s) => s.housing)
  const japa = useGameStore((s) => s.japa)
  const civic = useGameStore((s) => s.civic)

  const day = world.day
  const ed = education
  const prop = housing.owned ? propertyFor(housing.owned) : null
  const comfort = homeComfort(housing)
  const escort = civic ? escortAvailable(japa, day, civic.kgirs.warrant) : false

  const quiet =
    !ed.enrolled &&
    !ed.graduated &&
    !prop &&
    housing.rentOwed === 0 &&
    japa.nimcDay === 0 &&
    japa.flownDay === 0 &&
    !escort
  if (quiet) {
    return (
      <div className="mb-3">
        <div
          data-testid="ladder-next"
          className="flex items-center gap-2 rounded-2xl border border-black/[0.06] bg-white px-3 py-2 text-[11px] font-extrabold text-[var(--lko-ink-soft)] shadow-[var(--lko-shadow-sm)]"
        >
          <span aria-hidden>🪜</span>
          <span className="min-w-0 flex-1 truncate">
            The ladder dey wait — <span className="text-[var(--lko-ink)]">FUL enrollment · your own house · the JAPA file</span>
          </span>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 'nimc', label: 'NIMC', done: hasPaper(japa, 'nimc') },
    { id: 'passport', label: 'Passport', done: hasPaper(japa, 'passport') },
    { id: 'clearance', label: 'KGIRS', done: hasPaper(japa, 'clearance') },
    { id: 'police', label: 'Police', done: hasPaper(japa, 'police') },
    { id: 'flight', label: 'JAPA', done: japa.flownDay > 0 },
  ]
  const semDay = semesterDayOf(ed, day)

  return (
    <div className="mb-3 space-y-2" data-testid="ladder-banner">
      {/* education */}
      {(ed.enrolled || ed.graduated) && (
        <div className="rounded-2xl border border-[#1d5c8a]/20 bg-gradient-to-r from-[#eff6ff] to-[#dbeafe] p-3 shadow-[var(--lko-shadow-sm)]">
          <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]">
            <span className="flex items-center gap-1.5">
              <span aria-hidden>🎓</span> FUL — {ed.graduated ? 'GRADUATE' : `Semester ${ed.semester}/${LADDER.education.semestersToGraduate}`}
            </span>
            {!ed.graduated && (
              <span className="tabular-nums font-bold normal-case">
                {isExamWindow(ed, day) ? 'EXAM WINDOW' : `lecture day ${semDay}`}
              </span>
            )}
          </div>
          {!ed.graduated && (
            <div className="mt-1.5 flex items-center gap-1.5">
              {Array.from({ length: LADDER.education.lecturesNeeded }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i < ed.lecturesDone ? 'bg-[#1d5c8a]' : 'bg-black/[0.08]'}`}
                />
              ))}
              <span className="ml-1 text-[10px] font-black tabular-nums text-[#1d5c8a]">
                {ed.lecturesDone}/{LADDER.education.lecturesNeeded}
              </span>
            </div>
          )}
          {!ed.graduated && isStrikeDay(ed, day) && (
            <p data-testid="ladder-strike" className="mt-1.5 text-[10.5px] font-extrabold text-[#9a3412]">
              🚧 ASUU strike — the gate don lock ({strikeDaysLeft(ed, day)} day{strikeDaysLeft(ed, day) === 1 ? '' : 's'} more)
            </p>
          )}
          {ed.graduated && !ed.convocationAttended && (
            <p className="mt-1.5 text-[10.5px] font-extrabold text-[#1d5c8a]">🎓 Convocation coming — go collect the certificate</p>
          )}
          {ed.convocationAttended && (
            <p className="mt-1.5 text-[10.5px] font-bold text-[#1d5c8a]/80">Certificate in hand — the career desks don open</p>
          )}
        </div>
      )}

      {/* housing */}
      {(prop || housing.rentOwed > 0) && (
        <div data-testid="ladder-housing" className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-[11px] font-extrabold ${prop ? 'border-[#14532d]/20 bg-[#f0fdf4] text-[#14532d]' : housing.rentOwed >= LADDER.housing.baseRent * 2 ? 'border-[#7f1d1d]/25 bg-[#fef2f2] text-[#7f1d1d]' : 'border-black/[0.06] bg-white text-[var(--lko-ink)]'}`}>
          <span aria-hidden>{prop ? '🏠' : '🔑'}</span>
          <span className="min-w-0 flex-1 truncate">
            {prop
              ? `${prop.name} — yours · comfort ${comfort}`
              : `Rent owed: ${Math.round(housing.rentOwed) >= LADDER.housing.baseRent * 2 ? 'TWO CYCLES BEHIND — quit notice dey table' : formatNaira(housing.rentOwed)}`}
          </span>
          {housing.wahala && <span aria-hidden className="animate-pulse">⚠️</span>}
        </div>
      )}

      {/* japa docs + escort */}
      {(japa.nimcReadyDay > 0 || japa.flownDay > 0 || escort) && (
        <div className="flex flex-wrap items-center gap-1.5" data-testid="ladder-japa">
          {steps.map((s) => (
            <span
              key={s.id}
              data-testid={`japa-step-${s.id}`}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${s.done ? 'bg-[#ecfdf5] text-[#14532d]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`}
            >
              {s.done ? '✓' : '·'} {s.label}
            </span>
          ))}
          {escort && (
            <span data-testid="ladder-escort" className="inline-flex items-center gap-1 rounded-full bg-[#7f1d1d] px-2.5 py-1 text-[10.5px] font-extrabold text-white">
              🚨 MOPOL detail dey call — the convoy assembles at GRA
            </span>
          )}
        </div>
      )}
    </div>
  )
}
