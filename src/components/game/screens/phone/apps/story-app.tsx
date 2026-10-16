'use client'

/**
 * M21 — STORY APP (the Confluence Path in your pocket)
 * ----------------------------------------------------
 * The five-chapter chain exactly as systems/story.ts keeps it: the
 * chapter derived by the law (never the stored number alone), the ONE
 * current task with its real cost/energy/place, the six beats, and
 * the coat day the desk stamps. Read-only — the tasks happen on the
 * trail, at the GRA desk, in the world; this page is the honest map
 * of where the path stands. Every number (₦3,500 levy, ₦2,000 fever
 * night, ₦500 × 6 desk days, day-3 meeting) comes from the STORY
 * table, not from this file.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { formatNaira } from '@/game/systems/progression'
import { chapterOf, currentTask, coatDay, STORY, STORY_BEATS } from '@/game/systems/story'
import { LOCATION_BY_ID } from '@/game/data/locations'

export const APP_ID = 'story'
export const APP_TITLE = 'Confluence Path'
export const APP_GLYPH = '📖'

export default function StoryApp() {
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const story = useGameStore((s) => s.story)
  if (!player || !world) return null

  const ch = chapterOf(story)
  const task = currentTask(story, { day: world.day, level: player.level, cash: player.cash })
  const coat = coatDay(story)
  const placeName = (id: string) => LOCATION_BY_ID[id]?.name ?? id

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="story-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Confluence Path</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
          The Crusher boy&apos;s ladder — no lottery, no luck: the same grind, the same day, the same naira
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* the one current task — the law's own derivation */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="story-task">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Now</span>
          {ch === 5 ? (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="story-task-line">
              The path is walked — the white coat landed day {story.doctorDay}. The city moves on.
            </p>
          ) : task ? (
            <div className="mt-1">
              <p className="text-[11px] font-extrabold text-[var(--lko-ink)]" data-testid="story-task-line">
                {task.label}
              </p>
              <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">{task.hint}</p>
              <p className="mt-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
                {task.kind === 'carry' ? `pay ${formatNaira(STORY.sandPay)} · ${task.energy ?? STORY.sandEnergy}⚡ a carry` : ''}
                {task.kind === 'pay' ? `cost ${formatNaira(task.cost ?? 0)}` : ''}
                {task.kind === 'wait' ? (coat > 0 ? `the coat lands day ${coat}` : '') : ''} · at {placeName(task.place)}
                {task.ready ? '' : ' · not ready today'}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="story-task-line">
              The hill is quiet — the boy comes down the trail on day {STORY.meetDay}. Till then, the city dey run.
            </p>
          )}
        </div>

        {/* the six beats — the real ladder */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">The Path</span>
          <div className="mt-1.5 space-y-1.5">
            {STORY_BEATS.map((b) => {
              const done = ch > b.chapter
              const live = ch === b.chapter
              return (
                <div
                  key={b.chapter}
                  className={`rounded-xl px-2.5 py-2 ${live ? 'bg-[var(--lko-green-soft)]' : 'bg-black/[0.03]'}`}
                  data-testid={`story-beat-${b.chapter}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`min-w-0 truncate text-[11px] font-extrabold ${live ? 'text-[var(--lko-green)]' : done ? 'text-[var(--lko-ink)]' : 'text-[var(--lko-ink-soft)]'}`}>
                      {done ? '✓ ' : live ? '● ' : '○ '}{b.title}
                    </p>
                    <span className="shrink-0 text-[9px] font-bold text-[var(--lko-ink-soft)]">
                      {done ? 'done' : live ? 'you dey here' : 'ahead'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">{b.line}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* the honest book — the save's own counters */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="story-book">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">The Desk&apos;s Book</span>
          <div className="mt-1 space-y-0.5 text-[10px] font-bold text-[var(--lko-ink-soft)]">
            <p>sand carries: {story.sandDays}/{STORY.sandCarries} (₦{STORY.sandPay} + {STORY.sandEnergy}⚡ each)</p>
            <p>notebook levy: {story.notePaid ? 'settled' : `₦${STORY.notebookCost.toLocaleString()} (waived at Level ${STORY.notebookLevel}+)`}</p>
            <p>fever night: {story.feverPaid ? 'settled' : `₦${STORY.feverCost.toLocaleString()} at the ${placeName(STORY.feverPlace)}`}</p>
            <p>desk days: {story.sponsoredDays}/{STORY.sponsorDays} (₦{STORY.sponsorCost} a day)</p>
            <p>white coat: {story.doctorDay > 0 ? `worn since day ${story.doctorDay}` : coat > 0 ? `sewing — lands day ${coat}` : 'not yet earned'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
