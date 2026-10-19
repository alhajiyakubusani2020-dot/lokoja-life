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
 *
 * M24-UI wave 2 — the face: terra-toned hero with the level ring, the
 * XP bar tall, the skill tiles, the rep chip, the honest board. Every
 * number, every testid, every honest law: unchanged.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { formatNaira, xpToNextLevel, skillCap, reputationTier, nextReputationTier } from '@/game/systems/progression'
import { JOBS, JOB_BY_ID } from '@/game/data/jobs'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { PROGRESSION } from '@/game/data/config'
import { FaceHero, SectionLabel, StatusChip, MiniBar } from './app-face'

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
      <FaceHero
        id="career"
        glyph="💼"
        title="Career"
        sub="The ladder no dey lie — every gate na the real table"
        hue="terra"
        right={
          <span className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/15 backdrop-blur-sm" aria-hidden>
            <span className="lko-num text-[14px] font-black leading-none">{player.level}</span>
            <span className="mt-0.5 text-[6.5px] font-extrabold uppercase tracking-wider text-white/70">level</span>
          </span>
        }
      />

      <div className="mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* the XP ladder */}
        <SectionLabel>The Ladder</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="career-ladder">
          <div className="flex items-center justify-between">
            <span className="lko-num text-[20px] font-black leading-none text-[var(--lko-terra)]" data-testid="career-level">L{player.level}</span>
            <span className="text-[9px] font-bold text-[var(--lko-ink-soft)]">cap {PROGRESSION.maxLevel} · {player.xp}/{need} XP → L{player.level + 1}</span>
          </div>
          <div className="mt-2">
            <MiniBar pct={pct} tone="terra" tall />
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
            {(['hustle', 'smart', 'social'] as const).map((k) => (
              <div key={k} className="rounded-xl bg-black/[0.03] px-1 py-1.5" data-testid={`career-skill-${k}`}>
                <div className="lko-num text-[12px] font-black text-[var(--lko-ink)]">{player.skills[k]}/{skillCap(player.level)}</div>
                <div className="text-[8px] font-bold uppercase tracking-wide text-[var(--lko-ink-soft)]">{k} · cap L{player.level}</div>
              </div>
            ))}
          </div>
        </div>

        {/* current job */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="career-job">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Current Job</span>
          {job ? (
            <div className="mt-1 flex items-start gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[16px]" aria-hidden>{job.emoji}</span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold text-[var(--lko-ink)]">{job.name}</p>
                <p className="text-[10px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
                  {job.description} — base {formatNaira(job.basePay)}/shift, {job.energyCost}⚡, +{job.xpReward} XP, +{job.reputationReward} rep. Shifts dey {LOCATION_BY_ID[job.locationId]?.name ?? job.locationId}.
                </p>
              </div>
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
            <StatusChip tone="gold">{tier.name}</StatusChip>
          </div>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            {player.reputation} rep — {tier.title}.
            {nextTier ? ` ${nextTier.tier.name} at ${nextTier.tier.threshold} (${nextTier.remaining} to go).` : ' The top of the table — Lokoja knows your name.'}
          </p>
        </div>

        {/* the job board — real requirements, honest locks */}
        <SectionLabel>Job Board</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
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
                <div key={j.id} className={`rounded-xl px-2.5 py-2 ${open ? 'bg-[var(--lko-green-soft)]/50' : 'bg-black/[0.03]'}`} data-testid={`career-jobrow-${j.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-[11px] font-extrabold text-[var(--lko-ink)]">
                      {j.emoji} {j.name}
                      {player.jobId === j.id ? ' · yours' : ''}
                    </p>
                    <StatusChip tone={open ? 'ok' : 'plain'}>{open ? 'QUALIFIES' : `L${j.unlockLevel}+`}</StatusChip>
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
