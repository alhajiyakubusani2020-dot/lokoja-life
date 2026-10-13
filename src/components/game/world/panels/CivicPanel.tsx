'use client'

/**
 * LOKOJA LIFE — Civic Panel (M2)
 * ------------------------------
 * The service counter as a bottom sheet, opened from inside any of the four
 * GRA offices (KGIRS, NEPA, Police, EFCC). One component, four agencies —
 * because the queue is the same queue, only the stamp changes.
 *
 * Pure presentation over the store authority: every naira moves through
 * payNepa / payKgirs / fileEfccTip (they validate, ledger, notify, autosave).
 * The panel is only reachable INSIDE the government-area, so the in-person
 * (free) rules apply — the phone app carries the +fee variant.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { formatNaira } from '@/game/systems/progression'
import { audio } from '@/game/systems/audio'
import { nepaSettleCost, kgirsSettleCost } from '@/game/systems/civic'
import { CIVIC } from '@/game/data/config'
import { SheetShell } from '../../ui/kit'

type CivicOffice = 'kgirs-office' | 'nepa-office' | 'police-station' | 'efcc-office'

const OFFICE_META: Record<CivicOffice, { title: string; line: string; icon: string; tint: string }> = {
  'kgirs-office': {
    title: 'KGIRS Revenue Office',
    line: '“If you earn am, the state sabi am.”',
    icon: '🧮',
    tint: '#5C6E3A',
  },
  'nepa-office': {
    title: 'NEPA District Office',
    line: '“NEPA don bring light — bring money join am.”',
    icon: '💡',
    tint: '#b9821f',
  },
  'police-station': {
    title: 'GRA Police Station',
    line: '“The warrant desk na here — bail no dey free.”',
    icon: '🚨',
    tint: '#1f3a5c',
  },
  'efcc-office': {
    title: 'EFCC Zonal Command',
    line: '“Nobody dey above the law — whisper am to us.”',
    icon: '🕵️',
    tint: '#2e5c46',
  },
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-2.5 py-2">
      <span className="text-[11.5px] font-bold text-[var(--lko-ink-soft)]">{label}</span>
      <span
        className={`lko-num text-[12px] font-extrabold ${
          tone === 'bad' ? 'text-red-600' : tone === 'good' ? 'text-[var(--lko-green)]' : 'text-[var(--lko-ink)]'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function ActionButton({
  label,
  disabled,
  onClick,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="lko-press flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[var(--lko-green)] px-3 text-[13.5px] font-extrabold text-white disabled:bg-black/[0.07] disabled:text-[var(--lko-ink-soft)]"
    >
      {label}
    </button>
  )
}

export function CivicPanel({ office, onClose }: { office: CivicOffice; onClose: () => void }) {
  const civic = useGameStore((s) => s.civic)
  const cash = useGameStore((s) => s.player?.cash ?? 0)
  const payNepa = useGameStore((s) => s.payNepa)
  const payKgirs = useGameStore((s) => s.payKgirs)
  const fileEfccTip = useGameStore((s) => s.fileEfccTip)

  const meta = OFFICE_META[office]
  if (!civic) return null

  const act = (fn: () => boolean) => {
    audio.play('click')
    fn()
  }

  return (
    <SheetShell label={meta.title} onClose={onClose}>
      <div className="flex items-start gap-3 px-1.5 pt-1">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[20px] text-white"
          style={{ background: meta.tint }}
        >
          {meta.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="lko-display truncate text-lg leading-tight">{meta.title}</h2>
          <p className="truncate text-[11.5px] font-semibold italic text-[var(--lko-ink-soft)]">{meta.line}</p>
        </div>
        <span className="lko-num shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 text-[10.5px] font-extrabold">
          {formatNaira(cash)}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {office === 'nepa-office' && (
          <>
            <Row label="Electricity bill owed" value={formatNaira(civic.nepa.owed)} tone={civic.nepa.owed > 0 ? 'bad' : 'good'} />
            {civic.nepa.shedding && <Row label="Load-shedding" value="LIGHT CUT" tone="bad" />}
            {civic.nepa.shedding && <Row label="Reconnection fee" value={formatNaira(CIVIC.nepa.reconnectFee)} />}
            <Row label="Lifetime paid" value={formatNaira(civic.nepa.totalPaid)} />
            <ActionButton
              label={
                civic.nepa.owed <= 0 && !civic.nepa.shedding
                  ? 'Nothing to settle — meter dey smile'
                  : `Settle NEPA — ${formatNaira(nepaSettleCost(civic))}`
              }
              disabled={civic.nepa.owed <= 0 && !civic.nepa.shedding}
              onClick={() => act(() => payNepa('office'))}
            />
            <p className="px-1 text-[10.5px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
              Paying here costs exactly the bill — no online fee. Unpaid debt past three days puts your compound on load-shedding.
            </p>
          </>
        )}

        {office === 'kgirs-office' && (
          <>
            <Row label="Tax assessment due" value={formatNaira(civic.kgirs.assessed)} tone={civic.kgirs.assessed > 0 ? 'bad' : 'good'} />
            {civic.kgirs.warrant ? (
              <>
                <Row label="STATUS" value="WARRANT ACTIVE" tone="bad" />
                <p className="px-1 text-[10.5px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
                  A warrant cannot clear here — walk to the police station next door, settle the fine, come back clean.
                </p>
              </>
            ) : (
              <ActionButton
                label={civic.kgirs.assessed <= 0 ? 'No assessment dey wait' : `Pay assessment — ${formatNaira(kgirsSettleCost(civic))}`}
                disabled={civic.kgirs.assessed <= 0}
                onClick={() => act(() => payKgirs('office'))}
              />
            )}
            <Row label="Assessments settled" value={String(civic.kgirs.paid)} />
          </>
        )}

        {office === 'police-station' && (
          <>
            {civic.kgirs.warrant && civic.kgirs.assessed > 0 ? (
              <>
                <Row label="KGIRS tax warrant" value="ACTIVE" tone="bad" />
                <Row label="Fine (25% on top)" value={formatNaira(kgirsSettleCost(civic))} tone="bad" />
                <ActionButton label={`Clear warrant — ${formatNaira(kgirsSettleCost(civic))}`} onClick={() => act(() => payKgirs('police'))} />
              </>
            ) : (
              <p className="rounded-lg bg-black/[0.03] px-2.5 py-3 text-center text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
                Your name clean for the warrant book. Keep am so.
              </p>
            )}
            <Row label="Outstanding fines" value={formatNaira(civic.police.fines)} tone={civic.police.fines > 0 ? 'bad' : 'good'} />
            <Row label="Fines settled (life)" value={String(civic.police.paid)} />
          </>
        )}

        {office === 'efcc-office' && (
          <>
            <p className="rounded-lg bg-black/[0.03] px-2.5 py-2 text-[11px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
              Whistleblower programme: file a credible tip; when the commission recovers, you chop{' '}
              <b className="text-[var(--lko-green)]">5%</b> of the recovery. One tip at a time — investigations take two days.
            </p>
            {civic.efcc.pending.map((t) => (
              <Row key={t.id} label={`Under investigation — ${t.label}`} value={`day ${t.filedDay + 2}`} />
            ))}
            <ActionButton label="File a tip" onClick={() => act(() => fileEfccTip())} />
            <Row label="Rewards collected (life)" value={formatNaira(civic.efcc.rewardsTotal)} tone="good" />
          </>
        )}
      </div>
    </SheetShell>
  )
}
