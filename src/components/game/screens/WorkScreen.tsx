'use client'

/**
 * LOKOJA LIFE — WorkScreen (Stage 3)
 * -----------------------------------
 * Jobs + hustles + earnings. The UI reads every number from the systems
 * (work.ts / opportunities.ts / economy.ts) — nothing is hard-coded.
 *
 * Structure:
 *   1. Active offers   — accepted hustles waiting at real locations
 *   2. Hustle board    — search the current area for personal gist
 *   3. Jobs here       — formal shifts available at the current location
 *   4. Jobs elsewhere  — honest pointers that deep-link to the map
 *   5. Earnings        — today's flow + the recent ledger
 */

import { useEffect, useMemo, useState } from 'react'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { calculateJobPay, checkRequirements, cooldownRemaining, hustleSuccessChance } from '@/game/systems/work'
import { hustleDefFor } from '@/game/systems/opportunities'
import { absoluteSlot } from '@/game/systems/world'
import { SKILL_META } from '@/game/systems/skills'
import { sumEarned, sumSpent, transactionsOnDay } from '@/game/systems/economy'
import { JOBS, type JobDef } from '@/game/data/jobs'
import { NPC_BY_ID } from '@/game/data/npcs'
import type { HustleDef } from '@/game/data/hustles'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { HUSTLE, WORK } from '@/game/data/config'
import type { ActiveOpportunity } from '@/game/types'
import { useGameStore } from '@/game/store/useGameStore'

/* ------------------------------- helpers -------------------------------- */

/** One-line reward preview for a hustle def: ₦range • skill • rep. */
function rewardPreview(def: HustleDef): string {
  const parts = [
    `${formatNaira(def.reward.cashMin)}–${formatNaira(def.reward.cashMax)}`,
    `${SKILL_META[def.skill].emoji}+${def.reward.skillXp}`,
    `⭐+${def.reward.reputation}`,
  ]
  return parts.join(' • ')
}

function SkillPill({ skillId }: { skillId: string }) {
  const meta = SKILL_META[skillId as keyof typeof SKILL_META]
  if (!meta) return null
  return (
    <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-bold text-[var(--lko-ink-soft)]">
      {meta.emoji} {meta.label}
    </span>
  )
}

/* ---------------------------- opportunity card --------------------------- */

function OfferCard({
  instance,
  isHere,
  onDo,
  onDrop,
  onGo,
}: {
  instance: ActiveOpportunity
  isHere: boolean
  onDo: () => void
  onDrop: () => void
  onGo: () => void
}) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const def = hustleDefFor(instance)
  if (!def) return null

  const npc = NPC_BY_ID[instance.npcId ?? '']
  const loc = LOCATION_BY_ID[instance.locationId]
  const abs = absoluteSlot(world.day, world.timeOfDay)
  const slotsLeft = instance.expiresAtSlot - abs
  const urgent = slotsLeft <= 2
  const tooTired = player.needs.energy < def.energyCost
  const odds = Math.round(hustleSuccessChance(def, player) * 100)

  return (
    <div className={`lko-card p-4 ${urgent ? 'border-[var(--lko-terra)]/40' : ''}`}>
      {/* npc header */}
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--lko-gold-soft)] text-lg"
          aria-hidden
        >
          {npc?.emoji ?? '🙂'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold leading-tight">{npc?.name ?? 'Someone'}</p>
          <p className="text-[11px] font-semibold text-[var(--lko-ink-soft)]">
            📍 {loc?.name ?? 'Somewhere'} • ⏛ {urgent ? 'going cold soon!' : `${slotsLeft} slot${slotsLeft === 1 ? '' : 's'} left`}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]">
          🎯 {odds}%
        </span>
      </div>

      {/* the personal message */}
      <p className="mt-2.5 rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-[13px] italic leading-relaxed text-[var(--lko-ink)]">
        “{def.message}”
      </p>

      {/* terms */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-[var(--lko-ink-soft)]">
        <span className="rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[#8a5a00]">
          {formatNaira(def.reward.cashMin)}–{formatNaira(def.reward.cashMax)}
        </span>
        <SkillPill skillId={def.skill} />
        <span className="rounded-full bg-black/[0.05] px-2 py-0.5">−{def.energyCost} ⚡</span>
        {def.timeSlots > 0 && (
          <span className="rounded-full bg-black/[0.05] px-2 py-0.5">{def.timeSlots} slot</span>
        )}
      </div>

      {/* actions */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {isHere ? (
          <button
            onClick={onDo}
            disabled={tooTired}
            className={`lko-press min-h-[46px] rounded-xl border-b-4 px-2 py-2 text-sm font-extrabold ${
              tooTired
                ? 'cursor-not-allowed border-black/10 bg-black/10 text-white/70'
                : 'border-[#0a5c2e] bg-[var(--lko-green)] text-white'
            }`}
          >
            {tooTired ? '🥵 Too tired' : '💪 Do it'}
          </button>
        ) : (
          <button
            onClick={onGo}
            className="lko-press min-h-[46px] rounded-xl border-b-4 border-[#b57d0a] bg-[var(--lko-gold)] px-2 py-2 text-sm font-extrabold text-[#3d2a00]"
          >
            🗺️ Take me there
          </button>
        )}
        <button
          onClick={onDrop}
          className="lko-press min-h-[46px] rounded-xl border-2 border-black/[0.08] bg-white px-2 py-2 text-sm font-bold text-[var(--lko-ink)]"
        >
          Drop
        </button>
      </div>
    </div>
  )
}

/* ------------------------------ offer (fresh) ---------------------------- */

function FreshOfferCard({
  instance,
  onAccept,
  onDecline,
}: {
  instance: ActiveOpportunity
  onAccept: () => void
  onDecline: () => void
}) {
  const player = useGameStore((s) => s.player)!
  const def = hustleDefFor(instance)
  if (!def) return null
  const npc = NPC_BY_ID[instance.npcId ?? '']
  const handsFull = player.activeOpportunities.length >= HUSTLE.maxActive

  return (
    <div className="lko-card lko-pop border-[var(--lko-gold)]/40 p-4">
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--lko-gold-soft)] text-lg"
          aria-hidden
        >
          {npc?.emoji ?? '🙂'}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold leading-tight">{npc?.name ?? 'Someone'}</p>
          <p className="truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]">{def.title}</p>
        </div>
      </div>
      <p className="mt-2.5 rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-[13px] italic leading-relaxed">
        “{def.message}”
      </p>
      <p className="mt-2 text-[11px] font-bold text-[var(--lko-ink-soft)]">{rewardPreview(def)}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={onAccept}
          disabled={handsFull}
          className={`lko-press min-h-[46px] rounded-xl border-b-4 px-2 py-2 text-sm font-extrabold ${
            handsFull
              ? 'cursor-not-allowed border-black/10 bg-black/10 text-white/70'
              : 'border-[#0a5c2e] bg-[var(--lko-green)] text-white'
          }`}
        >
          {handsFull ? `Hands full (${HUSTLE.maxActive})` : '🤝 Accept'}
        </button>
        <button
          onClick={onDecline}
          className="lko-press min-h-[46px] rounded-xl border-2 border-black/[0.08] bg-white px-2 py-2 text-sm font-bold text-[var(--lko-ink)]"
        >
          Not interested
        </button>
      </div>
    </div>
  )
}

/* -------------------------------- job row -------------------------------- */

function JobRow({ job, onOpen }: { job: JobDef; onOpen: () => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const abs = absoluteSlot(world.day, world.timeOfDay)
  const req = checkRequirements(player, job.requirements)
  const cd = cooldownRemaining(player.cooldowns, job.id, abs)
  const pay = calculateJobPay(job, player)

  return (
    <button
      onClick={onOpen}
      className={`lko-press flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left ${
        req.ok ? 'border-[var(--lko-green)]/20 bg-white hover:border-[var(--lko-green)]/50' : 'border-black/[0.06] bg-black/[0.02]'
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-green-soft)] text-xl" aria-hidden>
        {job.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-extrabold text-[var(--lko-ink)]">{job.name}</span>
        <span className="block truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          {req.ok
            ? cd > 0
              ? `⏳ Ready in ${cd} slot${cd > 1 ? 's' : ''}`
              : `−${job.energyCost} ⚡ • ${job.timeSlots} slot${job.timeSlots > 1 ? 's' : ''}`
            : req.reasons.join(' • ')}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-sm font-extrabold text-[var(--lko-terra)]">~{formatNaira(pay)}</span>
        <SkillPill skillId={job.skillTraining.skill} />
      </span>
    </button>
  )
}

/* ------------------------------- job sheet ------------------------------- */

function JobSheet({ job, onClose, onStart }: { job: JobDef; onClose: () => void; onStart: () => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const abs = absoluteSlot(world.day, world.timeOfDay)
  const req = checkRequirements(player, job.requirements)
  const cd = cooldownRemaining(player.cooldowns, job.id, abs)
  const tooTired = player.needs.energy < job.energyCost
  const pay = calculateJobPay(job, player)
  const moodNote =
    player.needs.mood >= WORK.moodBonusHigh.threshold
      ? '😊 Good vibes — better pay today'
      : player.needs.mood <= WORK.moodPenaltyLow.threshold
        ? '😞 Low vibes — pay takes a small hit'
        : null

  const blocked = !req.ok || cd > 0 || tooTired

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label={`${job.name} details`}>
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="lko-pop absolute inset-x-0 bottom-0 mx-auto w-full max-w-md">
        <div className="rounded-t-3xl border-t-2 border-black/[0.08] bg-[#fffdf7] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-2xl">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15" aria-hidden />

          <div className="flex items-start gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--lko-green-soft)] text-3xl" aria-hidden>
              {job.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="lko-display text-lg leading-tight">{job.name}</h3>
              <p className="text-[11px] font-semibold text-[var(--lko-ink-soft)]">
                📍 {LOCATION_BY_ID[job.locationId]?.name}
              </p>
            </div>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]">{job.description}</p>

          {/* terms grid */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-[var(--lko-cream)] px-3 py-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">Pay (est.)</p>
              <p className="lko-display text-base text-[var(--lko-terra)]">~{formatNaira(pay)}</p>
            </div>
            <div className="rounded-xl bg-[var(--lko-cream)] px-3 py-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">Cost</p>
              <p className="lko-display text-base">−{job.energyCost} ⚡</p>
            </div>
            <div className="rounded-xl bg-[var(--lko-cream)] px-3 py-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">Time</p>
              <p className="lko-display text-base">
                {job.timeSlots} slot{job.timeSlots > 1 ? 's' : ''}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--lko-cream)] px-3 py-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">Trains</p>
              <p className="lko-display text-base">
                {SKILL_META[job.skillTraining.skill].emoji} +{job.skillTraining.xp}
              </p>
            </div>
          </div>

          <p className="mt-2 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
            +{job.xpReward} XP • ⭐+{job.reputationReward} reputation • cooldown:{' '}
            {job.cooldownSlots ?? WORK.defaultCooldownSlots} slot{(job.cooldownSlots ?? WORK.defaultCooldownSlots) > 1 ? 's' : ''}
          </p>
          {moodNote && <p className="mt-1 text-[11px] font-bold text-[#8a5a00]">{moodNote}</p>}

          {/* blockers */}
          {!req.ok && (
            <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              🔒 {req.reasons.join(' • ')}
            </p>
          )}
          {req.ok && cd > 0 && (
            <p className="mt-2 rounded-xl bg-black/[0.04] px-3 py-2 text-xs font-bold text-[var(--lko-ink-soft)]">
              ⏳ You just worked this — ready in {cd} time slot{cd > 1 ? 's' : ''}.
            </p>
          )}
          {req.ok && cd === 0 && tooTired && (
            <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              🥵 You need {job.energyCost} energy — rest first.
            </p>
          )}

          <button
            onClick={onStart}
            disabled={blocked}
            className={`lko-press mt-3 min-h-[50px] w-full rounded-xl border-b-4 py-3 text-sm font-extrabold ${
              blocked
                ? 'cursor-not-allowed border-black/10 bg-black/10 text-white/70'
                : 'border-[#0a5c2e] bg-[var(--lko-green)] text-white'
            }`}
          >
            {blocked ? 'Not available now' : `💼 Start shift • earn ~${formatNaira(pay)}`}
          </button>
          <button
            onClick={onClose}
            className="lko-press mt-2 min-h-[48px] w-full rounded-xl border-2 border-black/[0.08] bg-white py-3 text-sm font-extrabold text-[var(--lko-ink)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- work screen ----------------------------- */

export function WorkScreen({ onGoToMap }: { onGoToMap: (locationId: string) => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const isWorking = useGameStore((s) => s.isWorking)
  const workingLabel = useGameStore((s) => s.workingLabel)
  const offers = useGameStore((s) => s.offers)
  const searchHustles = useGameStore((s) => s.searchHustles)
  const acceptOffer = useGameStore((s) => s.acceptOffer)
  const declineOffer = useGameStore((s) => s.declineOffer)
  const completeOpportunity = useGameStore((s) => s.completeOpportunity)
  const dropOpportunity = useGameStore((s) => s.dropOpportunity)
  const pruneExpired = useGameStore((s) => s.pruneExpired)
  const workShift = useGameStore((s) => s.workShift)

  const [sheetJobId, setSheetJobId] = useState<string | null>(null)

  const location = LOCATION_BY_ID[world.currentLocation]
  const abs = absoluteSlot(world.day, world.timeOfDay)
  const searchCd = cooldownRemaining(player.cooldowns, 'hustle-search', abs)

  // lazily expire cold offers whenever the work screen is open
  useEffect(() => {
    pruneExpired()
  }, [world.day, world.timeOfDay, offers.length, pruneExpired])

  const jobsHere = useMemo(() => JOBS.filter((j) => j.locationId === location.id), [location.id])
  const jobsElsewhere = useMemo(() => JOBS.filter((j) => j.locationId !== location.id), [location.id])

  const todayTxs = transactionsOnDay(player.transactions, world.day)
  const todayEarned = sumEarned(todayTxs)
  const todaySpent = sumSpent(todayTxs)

  const sheetJob = sheetJobId ? JOBS.find((j) => j.id === sheetJobId) ?? null : null

  return (
    <div className="px-4 pt-3">
      {/* working transition overlay */}
      {isWorking && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--lko-cream)]/60 backdrop-blur-[2px]">
          <span className="lko-display animate-bounce rounded-full border-2 border-[var(--lko-gold)]/40 bg-white/95 px-5 py-2.5 text-sm shadow-lg">
            💼 Working{workingLabel ? ` — ${workingLabel}` : ''}…
          </span>
        </div>
      )}

      {/* location header */}
      <div className="lko-card mb-3 flex items-center justify-between gap-2 px-4 py-2.5">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            💼 Work • you dey here
          </p>
          <p className="lko-display truncate text-base">
            {location.emoji} {location.name}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[11px] font-bold text-[#8a5a00]">
          ⏛ slot {abs % 4 + 1}/4
        </span>
      </div>

      {/* ------------------------- active offers ------------------------- */}
      {player.activeOpportunities.length > 0 && (
        <section aria-label="Active offers" className="mb-4">
          <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            🤝 Your accepted hustles ({player.activeOpportunities.length}/{HUSTLE.maxActive})
          </h2>
          <div className="flex flex-col gap-2.5">
            {player.activeOpportunities.map((o) => (
              <OfferCard
                key={o.instanceId}
                instance={o}
                isHere={o.locationId === world.currentLocation}
                onDo={() => {
                  audio.play('click')
                  completeOpportunity(o.instanceId)
                }}
                onDrop={() => {
                  audio.play('click')
                  dropOpportunity(o.instanceId)
                }}
                onGo={() => {
                  audio.play('click')
                  onGoToMap(o.locationId)
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ------------------------- hustle board ------------------------- */}
      <section aria-label="Hustle board" className="mb-4">
        <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          🗣️ Hustle board — hear the gist
        </h2>

        {offers.length > 0 && (
          <div className="mb-2.5 flex flex-col gap-2.5">
            {offers.map((o) => (
              <FreshOfferCard
                key={o.instanceId}
                instance={o}
                onAccept={() => {
                  audio.play('click')
                  acceptOffer(o.instanceId)
                }}
                onDecline={() => {
                  audio.play('click')
                  declineOffer(o.instanceId)
                }}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => {
            audio.play('click')
            searchHustles()
          }}
          disabled={searchCd > 0 || isWorking}
          className={`lko-press min-h-[52px] w-full rounded-xl border-b-4 px-2 py-2.5 text-sm font-extrabold ${
            searchCd > 0 || isWorking
              ? 'cursor-not-allowed border-black/10 bg-black/10 text-white/70'
              : 'border-[#b57d0a] bg-[var(--lko-gold)] text-[#3d2a00]'
          }`}
        >
          {searchCd > 0 ? `⏳ Streets dey rest — ${searchCd} slot${searchCd > 1 ? 's' : ''}` : '👀 Look around for hustles'}
          <span className="mt-0.5 block text-[10px] font-bold opacity-80">
            {searchCd > 0 ? 'Offers turn up when the time moves' : 'Ask around this area • quick errands from real people'}
          </span>
        </button>
      </section>

      {/* --------------------------- jobs here --------------------------- */}
      <section aria-label="Jobs here" className="mb-4">
        <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          🧰 Shifts at {location.shortName} ({jobsHere.length})
        </h2>
        <div className="flex flex-col gap-2">
          {jobsHere.map((job) => (
            <JobRow
              key={job.id}
              job={job}
              onOpen={() => {
                audio.play('click')
                setSheetJobId(job.id)
              }}
            />
          ))}
        </div>
      </section>

      {/* ------------------------ jobs elsewhere ------------------------- */}
      {jobsElsewhere.length > 0 && (
        <section aria-label="Jobs elsewhere" className="mb-4">
          <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            🗺️ Work in other parts of Lokoja
          </h2>
          <div className="flex flex-col gap-2">
            {jobsElsewhere.map((job) => {
              const loc = LOCATION_BY_ID[job.locationId]
              const lockedLoc = player.level < (loc?.unlockLevel ?? 1)
              return (
                <button
                  key={job.id}
                  onClick={() => {
                    audio.play('click')
                    onGoToMap(job.locationId)
                  }}
                  className="lko-press flex w-full items-center gap-3 rounded-xl border-2 border-black/[0.05] bg-black/[0.02] px-3 py-2.5 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.05] text-lg opacity-70" aria-hidden>
                    {job.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-[var(--lko-ink)]">{job.name}</span>
                    <span className="block truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]">
                      📍 {loc?.name ?? 'Lokoja'}{lockedLoc ? ` • 🔒 Level ${loc?.unlockLevel}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] font-extrabold text-[var(--lko-green)]">Go →</span>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* ---------------------------- earnings ---------------------------- */}
      <section aria-label="Earnings" className="mb-4">
        <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          🧾 Money — Day {world.day}
        </h2>
        <div className="lko-card p-4">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl bg-[var(--lko-green-soft)] py-2.5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-green-deep)]">Earned today</p>
              <p className="lko-display text-lg text-[var(--lko-green-deep)]">+{formatNaira(todayEarned).replace('₦', '₦')}</p>
            </div>
            <div className="rounded-xl bg-red-50 py-2.5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-700">Spent today</p>
              <p className="lko-display text-lg text-red-700">−{formatNaira(todaySpent)}</p>
            </div>
          </div>

          <h3 className="mb-1.5 mt-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            Recent
          </h3>
          {player.transactions.length === 0 ? (
            <p className="rounded-xl bg-black/[0.03] px-3 py-3 text-center text-xs font-semibold text-[var(--lko-ink-soft)]">
              No money moves yet — your first hustle dey wait.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {player.transactions.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 odd:bg-black/[0.03]">
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--lko-ink)]">
                    {t.amount > 0 ? '📈' : '📉'} {t.label}
                    <span className="ml-1 text-[10px] text-[var(--lko-ink-soft)]">D{t.day}</span>
                  </span>
                  <span
                    className={`shrink-0 text-xs font-extrabold ${
                      t.amount > 0 ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-terra)]'
                    }`}
                  >
                    {t.amount > 0 ? '+' : '−'}
                    {formatNaira(Math.abs(t.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* job confirm sheet */}
      {sheetJob && (
        <JobSheet
          job={sheetJob}
          onClose={() => {
            audio.play('click')
            setSheetJobId(null)
          }}
          onStart={() => {
            audio.play('click')
            setSheetJobId(null)
            workShift(sheetJob.id)
          }}
        />
      )}
    </div>
  )
}
