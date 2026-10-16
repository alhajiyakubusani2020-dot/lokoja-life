'use client'

/**
 * M21 — CAREER APP (the ladder in your pocket)
 * --------------------------------------------
 * The progression ladder, honest: level + XP against the REAL curve
 * (xpToNextLevel = 120 × level^1.4, cap 50), the current job from the
 * save, the reputation tier table, the skill cap law, and the job
 * board's next-rank requirements exactly as data/jobs.ts stores them —
 * unlock level, skill bars, reputation floor, and the FUL certificate
 * gate. Read-only by design: shifts happen at the desks (workShift
 * lives at the Work tab and at the job's own location), this app shows
 * you WHICH door to walk through and what it still asks of you.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { formatNaira, xpToNextLevel, skillCap, reputationTier, nextReputationTier } from '@/game/systems/progression'
import { JOBS, JOB_BY_ID } from '@/game/data/jobs'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { PROGRESSION } from '@/game/data/config'

export const APP_ID = 'career'
export const APP_TITLE = 'Career'
export const APP_GLYPH = '💼'

export default function CareerApp() {
  const player = useGameStore((s) => s.player)
  const education = useGameStore((s) => s.education)
  if (!player) return null

  const need = xpToNextLevel(player.level)
  const pct = Math.min(100, (player.xp / need) * 100)
  const job = player.jobId ? JOB_BY_ID[player.jobId] ?? null : null
  const tier = reputationTier(player.reputation)
  const nextTier = nextReputationTier(player.reputation)
  const sorted = [...JOBS].sort((a, b) => a.unlockLevel - b.unlockLevel || a.basePay - b.basePay)

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="career-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Career</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">The ladder no dey lie — every gate na the real table</p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* the XP ladder */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="career-ladder">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">The Ladder</span>
            <span className="text-[9px] font-bold text-[var(--lko-ink-soft)]">cap {PROGRESSION.maxLevel}</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[22px] font-black leading-none text-[var(--lko-green)]" data-testid="career-level">L{player.level}</span>
            <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">{player.xp}/{need} XP → L{player.level + 1}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
            <div className="h-full rounded-full bg-[var(--lko-green)]" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
            {(['hustle', 'smart', 'social'] as const).map((k) => (
              <div key={k} className="rounded-xl bg-black/[0.03] px-1 py-1.5" data-testid={`career-skill-${k}`}>
                <div className="text-[12px] font-black text-[var(--lko-ink)]">{player.skills[k]}/{skillCap(player.level)}</div>
                <div className="text-[8.5px] font-bold text-[var(--lko-ink-soft)]">{k} · cap at L{player.level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* current job */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="career-job">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Current Job</span>
          {job ? (
            <div className="mt-1">
              <p className="text-[11px] font-extrabold text-[var(--lko-ink)]">{job.emoji} {job.name}</p>
              <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                {job.description} — base {formatNaira(job.basePay)}/shift, {job.energyCost}⚡, +{job.xpReward} XP, +{job.reputationReward} rep. Shifts dey {LOCATION_BY_ID[job.locationId]?.name ?? job.locationId}.
              </p>
            </div>
          ) : (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="career-job-none">
              No job yet — the boards dey wait. Take a job at its own location and shifts open.
            </p>
          )}
        </div>

        {/* reputation */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="career-rep">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Reputation</span>
            <span className="rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-gold-deep)]">{tier.name}</span>
          </div>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            {player.reputation} rep — {tier.title}.
            {nextTier ? ` ${nextTier.tier.name} at ${nextTier.tier.threshold} (${nextTier.remaining} to go).` : ' The top of the table — Lokoja knows your name.'}
          </p>
        </div>

        {/* the job board — real requirements, honest locks */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Job Board</span>
          <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">{JOBS.length} jobs — the desk requirements below na the data&apos;s own words.</p>
          <div className="mt-1.5 space-y-1.5">
            {sorted.map((j) => {
              const lockedLevel = player.level < j.unlockLevel
              const reqs: string[] = []
              if (j.requirements.minSkills) {
                for (const [k, v] of Object.entries(j.requirements.minSkills)) {
                  const have = player.skills[k as 'hustle' | 'smart' | 'social']
                  reqs.push(`${k} ${have}/${v}${have >= (v ?? 0) ? ' ✓' : ''}`)
                }
              }
              if (j.requirements.minReputation) reqs.push(`rep ${player.reputation}/${j.requirements.minReputation}${player.reputation >= j.requirements.minReputation ? ' ✓' : ''}`)
              if (j.requirements.requiresDegree) reqs.push(education.graduated ? 'certificate ✓' : 'needs FUL certificate')
              const open = !lockedLevel && reqs.every((r) => r.endsWith('✓'))
              return (
                <div key={j.id} className="rounded-xl bg-black/[0.03] px-2.5 py-2" data-testid={`career-jobrow-${j.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-[11px] font-extrabold text-[var(--lko-ink)]">
                      {j.emoji} {j.name}
                      {player.jobId === j.id ? ' · yours' : ''}
                    </p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black ${open ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`}>
                      {open ? 'QUALIFIES' : `L${j.unlockLevel}+`}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">
                    {formatNaira(j.basePay)}/shift · {j.energyCost}⚡ · {LOCATION_BY_ID[j.locationId]?.shortName ?? j.locationId}
                    {reqs.length > 0 ? ` · ${reqs.join(' · ')}` : ' · no requirements'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
