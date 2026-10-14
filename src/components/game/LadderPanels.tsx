'use client'

/**
 * LOKOJA LIFE — LadderPanels (M12: THE LADDER)
 * ---------------------------------------------
 * The venue blocks inside the shared LocationSheet AND the 2D map's own
 * inline sheet: the FUL desks (enroll / lecture / exam / convocation),
 * the housing desk (the rent book, the wahala, the ladder, the
 * furnishing), and the JAPA desks (GRA's four counters, the Ganaja
 * agent, the Motor Park send-off) + the MOPOL detail. Every naira moves
 * through the store's ladder actions — these panels only read the pure
 * gates and render honest buttons.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { LADDER } from '@/game/data/config'
import { LOCATION_BY_ID, type LokojaLocation } from '@/game/data/locations'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import {
  canEnroll,
  canAttendLecture,
  canSitExam,
  canAttendConvocation,
  isLectureWindow,
  isExamWindow,
  isStrikeDay,
  semesterDayOf,
} from '@/game/systems/education'
import {
  PROPERTIES,
  propertyFor,
  canBuyProperty,
  canFurnish,
  canPayRent,
  canResolveWahala,
  homeComfort,
} from '@/game/systems/housing'
import {
  canRequestNimc,
  canCollectNimc,
  canRequestPassport,
  canCollectPassport,
  canTryAgent,
  canClearKgirs,
  canGetPoliceCertificate,
  canTakeFlight,
  canRunEscort,
  papersComplete,
  hasPaper,
  escortAvailable,
  type JapaStep,
} from '@/game/systems/japa'

/* ------------------------------ education panel ------------------------------ */

export function EducationPanel({ location }: { location: LokojaLocation }) {
  const world = useGameStore((s) => s.world)!
  const player = useGameStore((s) => s.player)!
  const education = useGameStore((s) => s.education)
  const enrollFul = useGameStore((s) => s.enrollFul)
  const attendLecture = useGameStore((s) => s.attendLecture)
  const sitExam = useGameStore((s) => s.sitExam)
  const attendConvocation = useGameStore((s) => s.attendConvocation)

  const day = world.day
  const atUniversity = world.currentLocation.startsWith('ful-')
  const E = LADDER.education

  const enrollGate = canEnroll(education, player.level)
  const lectureGate = canAttendLecture(education, day, atUniversity)
  const examGate = canSitExam(education, day, atUniversity)
  const convGate = canAttendConvocation(education, day, atUniversity)
  const semDay = semesterDayOf(education, day)

  const nothing = education.graduated && education.convocationAttended
  if (nothing) return null

  return (
    <div className="mt-3 space-y-2" data-testid="education-panel">
      <h4 className="lko-label">The Ladder — FUL</h4>

      {!education.enrolled && !education.graduated && (
        <div className="rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]">
            🎓 Enroll — {formatNaira(E.enrollFee)} a semester
          </p>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[#1d5c8a]/80">
            {E.semesterDays}-day semesters · {E.lecturesNeeded} lectures · {E.semestersToGraduate} semesters to the certificate. The career desks dey wait at the top.
          </p>
          <button
            data-testid="ful-enroll"
            disabled={!enrollGate.ok || player.cash < E.enrollFee}
            onClick={() => {
              audio.play('click')
              enrollFul()
            }}
            className="lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
          >
            {enrollGate.ok ? `Enroll — ${formatNaira(E.enrollFee)}` : enrollGate.why}
          </button>
        </div>
      )}

      {education.enrolled && !education.graduated && (
        <div className="rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]">
            📚 Semester {education.semester}/{E.semestersToGraduate} — lecture day {semDay}
          </p>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[#1d5c8a]/80">
            Lectures {education.lecturesDone}/{E.lecturesNeeded} · exam reads smart + lectures (the honest bar: {E.examPassScore})
          </p>
          {isLectureWindow(education, day) && !isStrikeDay(education, day) && (
            <button
              data-testid="ful-lecture"
              disabled={!lectureGate.ok || player.needs.energy < 8}
              onClick={() => {
                audio.play('click')
                attendLecture()
              }}
              className="lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
            >
              {lectureGate.ok ? `Attend the lecture (smart +${E.lectureSmartXp}, ${formatNaira(E.lectureStipend)})` : lectureGate.why}
            </button>
          )}
          {isStrikeDay(education, day) && (
            <p data-testid="ful-strike" className="mt-2 rounded-lg bg-[#fff7ed] px-3 py-2 text-[11px] font-extrabold text-[#9a3412]">
              🚧 ASUU strike dey run — the gate don lock. {lectureGate.why}
            </p>
          )}
          {isExamWindow(education, day) && (
            <button
              data-testid="ful-exam"
              disabled={!examGate.ok}
              onClick={() => {
                audio.play('click')
                sitExam()
              }}
              className="lko-press mt-2 w-full rounded-lg bg-[#9a3412] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
            >
              {examGate.ok ? 'Sit the exam — the work decides' : examGate.why}
            </button>
          )}
        </div>
      )}

      {education.graduated && (
        <div className="rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]">
            🎓 {education.convocationAttended ? 'CERTIFICATE IN HAND' : 'CONVOCATION — the gown dey wait'}
          </p>
          {!education.convocationAttended && (
            <button
              data-testid="ful-convocation"
              disabled={!convGate.ok}
              onClick={() => {
                audio.play('click')
                attendConvocation()
              }}
              className="lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
            >
              {convGate.ok ? `Collect the certificate (rep +${E.graduateRep}, mood +${E.graduateMood})` : convGate.why}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------- housing panel ------------------------------- */

export function HousingPanel({ location }: { location: LokojaLocation }) {
  const world = useGameStore((s) => s.world)!
  const player = useGameStore((s) => s.player)!
  const housing = useGameStore((s) => s.housing)
  const payRent = useGameStore((s) => s.payRent)
  const buyProperty = useGameStore((s) => s.buyProperty)
  const furnishHome = useGameStore((s) => s.furnishHome)
  const resolveWahala = useGameStore((s) => s.resolveWahala)

  const atHome = world.currentLocation === 'home'
  const prop = housing.owned ? propertyFor(housing.owned) : null
  const rentGate = canPayRent(housing, player.cash)
  const wahalaGate = canResolveWahala(housing, player.cash)
  const comfort = homeComfort(housing)
  const currentTier = housing.owned ? (housing.furnishing[housing.owned] ?? 0) : 0
  const furnishGate = canFurnish(housing, currentTier + 1)

  const housingForSale = PROPERTIES.filter((p) => p.locationId === location.id)
  const nothing = !atHome && housingForSale.length === 0
  if (nothing) return null

  return (
    <div className="mt-3 space-y-2" data-testid="housing-panel">
      <h4 className="lko-label">The Ladder — Housing</h4>

      {/* the rent book + the wahala + the owned roof: at HOME */}
      {atHome && (
        <div className="rounded-xl border border-black/[0.06] bg-white p-3">
          {prop ? (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#14532d]">
                🏠 {prop.name} — YOURS · comfort {comfort}
              </p>
              <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                No rent again. Every sleep dey restore +{comfort * LADDER.housing.sleepEnergyPerComfort} extra energy.
              </p>
              {currentTier < LADDER.housing.furnishTiers.length && (
                <button
                  data-testid={`furnish-tier-${currentTier + 1}`}
                  disabled={!furnishGate.ok || player.cash < furnishGate.cost}
                  onClick={() => {
                    audio.play('click')
                    furnishHome(currentTier + 1)
                  }}
                  className="lko-press mt-2 w-full rounded-lg bg-[#14532d] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
                >
                  {furnishGate.ok
                    ? `Furnish tier ${currentTier + 1} — ${LADDER.housing.furnishTiers.find((f) => f.tier === currentTier + 1)?.label} (${formatNaira(furnishGate.cost)})`
                    : furnishGate.why}
                </button>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">
                <span>🔑 The rent book</span>
                <span className="tabular-nums">{formatNaira(Math.round(housing.rentOwed))} due</span>
              </div>
              {housing.wahala && (
                <p data-testid="housing-wahala" className="mt-1 rounded-lg bg-[#fff7ed] px-2.5 py-1.5 text-[10.5px] font-bold text-[#9a3412]">
                  ⚠️ {housing.wahala.note}
                </p>
              )}
              <div className="mt-2 flex gap-1.5">
                <button
                  data-testid="pay-rent"
                  disabled={!rentGate.ok}
                  onClick={() => {
                    audio.play('click')
                    payRent('home')
                  }}
                  className="lko-press flex-1 rounded-lg bg-[#14532d] px-2 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40"
                >
                  {rentGate.ok ? `Pay rent — ${formatNaira(rentGate.amount)}` : rentGate.why}
                </button>
                {housing.wahala && housing.wahala.cost > 0 && (
                  <button
                    data-testid="resolve-wahala"
                    disabled={!wahalaGate.ok}
                    onClick={() => {
                      audio.play('click')
                      resolveWahala()
                    }}
                    className="lko-press flex-1 rounded-lg bg-[var(--lko-gold)] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40"
                  >
                    Settle wahala — {formatNaira(wahalaGate.cost)}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* the ladder for sale here */}
      {housingForSale.map((p) => {
        const gate = canBuyProperty(housing, p.id, player.level, player.cash)
        const owned = housing.owned === p.id
        return (
          <div key={p.id} className="rounded-xl border border-black/[0.06] bg-white p-3">
            <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">
              <span>🏠 {p.name}</span>
              <span className="tabular-nums">{formatNaira(p.price)}</span>
            </div>
            <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
              Level {p.level} · comfort {p.comfort} · no more rent when you own
            </p>
            <button
              data-testid={`buy-property-${p.id}`}
              disabled={owned || !gate.ok}
              onClick={() => {
                audio.play('click')
                buyProperty(p.id)
              }}
              className="lko-press mt-2 w-full rounded-lg bg-[var(--lko-green)] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
            >
              {owned ? '★ You own this one' : gate.ok ? `Buy — ${formatNaira(p.price)}` : gate.why}
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* --------------------------------- japa panel -------------------------------- */

const STEP_META: Record<JapaStep, { label: string; emoji: string }> = {
  nimc: { label: 'NIMC slip', emoji: '🪪' },
  passport: { label: 'Passport', emoji: '📜' },
  clearance: { label: 'KGIRS clearance', emoji: '🧾' },
  police: { label: 'Police certificate', emoji: '👮' },
  flight: { label: 'The send-off', emoji: '✈️' },
}

export function JapaPanel({ location }: { location: LokojaLocation }) {
  const world = useGameStore((s) => s.world)!
  const player = useGameStore((s) => s.player)!
  const japa = useGameStore((s) => s.japa)
  const civic = useGameStore((s) => s.civic)
  const account = useGameStore((s) => s.account)
  const requestNimc = useGameStore((s) => s.requestNimc)
  const collectNimc = useGameStore((s) => s.collectNimc)
  const requestPassport = useGameStore((s) => s.requestPassport)
  const collectPassport = useGameStore((s) => s.collectPassport)
  const tryAgent = useGameStore((s) => s.tryAgent)
  const kgirsClearance = useGameStore((s) => s.kgirsClearance)
  const policeCertificate = useGameStore((s) => s.policeCertificate)
  const takeFlight = useGameStore((s) => s.takeFlight)
  const runEscort = useGameStore((s) => s.runEscort)

  const day = world.day
  const J = LADDER.japa
  const atGrades = location.id === 'government-area' && world.currentLocation === 'government-area'
  const atGanaja = location.id === 'ganaja-junction' && world.currentLocation === 'ganaja-junction'
  const atPark = location.id === 'transport-area' && world.currentLocation === 'transport-area'
  const warrant = !!civic && civic.kgirs.warrant
  const escortGate = civic ? canRunEscort(japa, day, warrant, atGrades) : { ok: false, why: '' }
  const escortLive = civic ? escortAvailable(japa, day, warrant) : false

  const gradesRows: { step: JapaStep; gate: { ok: boolean; why: string }; label: string; run: () => void; testId: string }[] = atGrades
    ? [
        { step: 'nimc', gate: japa.nimcReadyDay > 0 && !hasPaper(japa, 'nimc') ? canCollectNimc(japa, day, atGrades) : canRequestNimc(japa, player.level, atGrades), label: japa.nimcReadyDay > 0 && !hasPaper(japa, 'nimc') ? `Collect the NIMC slip (queue: ${japa.nimcReadyDay > day ? `${japa.nimcReadyDay - day}d` : 'ready'})` : `Request the NIMC slip — ${formatNaira(J.nimcFee)}`, run: () => (japa.nimcReadyDay > 0 && !hasPaper(japa, 'nimc') ? collectNimc() : requestNimc()), testId: japa.nimcReadyDay > 0 && !hasPaper(japa, 'nimc') ? 'japa-collect-nimc' : 'japa-request-nimc' },
        { step: 'passport', gate: japa.passportReadyDay > 0 && !hasPaper(japa, 'passport') ? canCollectPassport(japa, day, atGrades) : canRequestPassport(japa, player.cash, atGrades), label: japa.passportReadyDay > 0 && !hasPaper(japa, 'passport') ? `Collect the passport (${japa.passportReadyDay > day ? `${japa.passportReadyDay - day}d to print` : 'ready'})` : `Apply — official window (${formatNaira(J.passportFee)}, ${J.passportQueueDays} days)`, run: () => (japa.passportReadyDay > 0 && !hasPaper(japa, 'passport') ? collectPassport() : requestPassport()), testId: japa.passportReadyDay > 0 && !hasPaper(japa, 'passport') ? 'japa-collect-passport' : 'japa-request-passport' },
        { step: 'clearance', gate: canClearKgirs(japa, warrant, atGrades), label: 'KGIRS clearance — the taxman dey sign', run: kgirsClearance, testId: 'japa-clearance' },
        { step: 'police', gate: canGetPoliceCertificate(japa, civic?.police.fines ?? 0, player.cash, atGrades), label: `Police character certificate — ${formatNaira(J.policeFee)}`, run: policeCertificate, testId: 'japa-police' },
      ]
    : []

  const nothing =
    japa.flownDay > 0 ||
    (!atGrades && !atGanaja && !atPark)
  if (nothing) return null

  return (
    <div className="mt-3 space-y-2" data-testid="japa-panel">
      <h4 className="lko-label">The Ladder — JAPA file</h4>

      {/* the file: five honest steps */}
      <div className="flex flex-wrap gap-1.5">
        {(['nimc', 'passport', 'clearance', 'police', 'flight'] as JapaStep[]).map((s) => (
          <span key={s} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${hasPaper(japa, s) || (s === 'flight' && japa.flownDay > 0) ? 'bg-[#ecfdf5] text-[#14532d]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`}>
            {STEP_META[s].emoji} {hasPaper(japa, s) ? `✓ ${STEP_META[s].label}` : STEP_META[s].label}
          </span>
        ))}
      </div>

      {/* GRA's four counters */}
      {atGrades && (
        <div className="rounded-xl border border-black/[0.06] bg-white p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">🏛️ The desks</p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {gradesRows.map((row) => {
              const done = hasPaper(japa, row.step)
              return (
                <button
                  key={row.step}
                  data-testid={row.testId}
                  disabled={done || !row.gate.ok}
                  onClick={() => {
                    audio.play('click')
                    row.run()
                  }}
                  className="lko-press flex min-h-[44px] items-center justify-between rounded-lg border border-black/[0.05] bg-[var(--lko-cream)] px-2.5 py-1.5 text-left disabled:opacity-45"
                >
                  <span className="min-w-0 flex-1 truncate text-[11.5px] font-extrabold text-[var(--lko-ink)]">
                    {done ? `✓ ${STEP_META[row.step].label} — in the file` : row.label}
                  </span>
                  {!done && <span className="shrink-0 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">{row.gate.ok ? '' : row.gate.why.slice(0, 42)}</span>}
                </button>
              )
            })}
          </div>
          {/* the MOPOL detail */}
          {japa.policeShifts > 0 && (
            <div className="mt-2 rounded-lg bg-[#7f1d1d]/[0.06] px-2.5 py-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#7f1d1d]">
                👮 MOPOL detail — {japa.policeShifts}/{LADDER.mopol.shiftsToUnlock} police shifts of trust
              </p>
              <button
                data-testid="mopol-escort"
                disabled={!escortGate.ok}
                onClick={() => {
                  audio.play('click')
                  runEscort()
                }}
                className="lko-press mt-1.5 w-full rounded-lg bg-[#7f1d1d] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
              >
                {escortGate.ok
                  ? `Run the VIP escort — ${formatNaira(LADDER.mopol.escortPay)} + the siren ×${LADDER.mopol.sirenMinutesMult}`
                  : escortLive ? escortGate.why : `The convoy moves every ${LADDER.mopol.escortEvery} days`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* the Ganaja agent */}
      {atGanaja && !hasPaper(japa, 'passport') && hasPaper(japa, 'nimc') && (
        <div className="rounded-xl border border-[#9a3412]/20 bg-[#fff7ed] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]">
            🕶️ The agent — "express passport, half price"
          </p>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[#9a3412]/80">
            {formatNaira(J.agentFee)} today, the book today... maybe. The street sabi {japa.agentTries > 0 ? `his record: ${japa.agentTries} tries, ${japa.agentScams} wash` : 'am well — ask around'}.
          </p>
          <button
            data-testid="japa-agent"
            disabled={!canTryAgent(japa, player.cash, atGanaja).ok}
            onClick={() => {
              audio.play('click')
              tryAgent()
            }}
            className="lko-press mt-2 w-full rounded-lg bg-[#ea580c] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
          >
            {canTryAgent(japa, player.cash, atGanaja).ok ? `Take the gamble — ${formatNaira(J.agentFee)}` : canTryAgent(japa, player.cash, atGanaja).why}
          </button>
        </div>
      )}

      {/* the send-off */}
      {atPark && (
        <div className="rounded-xl border border-[#1d5c8a]/20 bg-[#eff6ff] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#1d5c8a]">
            ✈️ The send-off — the Abuja motor
          </p>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[#1d5c8a]/80">
            {papersComplete(japa) ? 'The file complete — the whole park go spray you.' : 'The motor dey wait for the complete file — the desks dey at GRA.'}
          </p>
          {japa.flownDay > 0 ? (
            <p className="mt-2 rounded-lg bg-[#ecfdf5] px-3 py-2 text-[11px] font-extrabold text-[#14532d]">
              ✓ You don JAPA — the remittance dey come, the village dey proud.
            </p>
          ) : (
            <button
              data-testid="japa-flight"
              disabled={!canTakeFlight(japa, player.cash, atPark).ok || player.cash < J.ticketFee}
              onClick={() => {
                audio.play('click')
                takeFlight()
              }}
              className="lko-press mt-2 w-full rounded-lg bg-[#1d5c8a] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
            >
              {canTakeFlight(japa, player.cash, atPark).ok ? `Take the send-off — ${formatNaira(J.ticketFee)} (rep +${J.repReward})` : canTakeFlight(japa, player.cash, atPark).why}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
