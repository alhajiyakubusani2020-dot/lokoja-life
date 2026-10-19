'use client'

/**
 * M21 — MT PATTI APP (the hill's book in your pocket)
 * ---------------------------------------------------
 * The trail book, honest: the five seeded secrets of systems/patti.ts
 * and the save's own found-record (secret id → the day your feet found
 * it). Found spots show their real reward; unfound spots show ONE
 * honest line — "not yet found". This app never prints an unfound
 * secret's name, coordinates, or reward: the hunt is walked, not read.
 * (Discovery itself happens in the 3D world — checkPatti polls your
 * feet at ~2Hz; a phone cannot stand on the summit for you.)
 *
 * M24-UI wave 2 — the face: a hill-green hero with the summit ring,
 * the trail as a climb (found steps glow, unfound steps stay honest
 * locks). Every number, every testid, every honest law: unchanged.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { PATTI_SECRETS, secretsFound } from '@/game/systems/patti'
import { FaceHero, SectionLabel, LawNote, MiniBar, StatusChip } from './app-face'

export const APP_ID = 'patti'
export const APP_TITLE = 'Mt Patti'
export const APP_GLYPH = '⛰️'

function rewardLine(kind: 'cash' | 'xp' | 'rep' | 'outfit' | 'walk', amount?: number, item?: string): string {
  switch (kind) {
    case 'cash': return `₦${(amount ?? 0).toLocaleString()}`
    case 'xp': return `+${amount ?? 0} XP`
    case 'rep': return `+${amount ?? 0} rep`
    case 'outfit': return `outfit: ${item ?? ''}`
    case 'walk': return `walk: ${item ?? ''}`
  }
}

export default function PattiApp() {
  const patti = useGameStore((s) => s.patti)
  const found = secretsFound(patti)
  const pct = Math.round((found / PATTI_SECRETS.length) * 100)

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="patti-app">
      <FaceHero
        id="patti"
        glyph="⛰️"
        title="Mt Patti"
        sub="The guardian hill's book — five secrets, walked not read"
        hue="green"
        right={
          <span className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/15 backdrop-blur-sm" aria-hidden>
            <span className="lko-num text-[13px] font-black leading-none" data-testid="patti-count">{found}/{PATTI_SECRETS.length}</span>
            <span className="mt-0.5 text-[6.5px] font-extrabold uppercase tracking-wider text-white/70">found</span>
          </span>
        }
      />

      <div className="mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        <SectionLabel>The Trail Book</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <LawNote>
            Five places, discovered the old way — you WALK there. No minigame, no lottery: the ground itself is the game.
          </LawNote>
          <div className="mt-2">
            <MiniBar pct={pct} tall />
          </div>
          <div className="mt-2.5 space-y-1.5">
            {PATTI_SECRETS.map((sec, i) => {
              const day = patti.found[sec.id]
              const isFound = day !== undefined
              return (
                <div
                  key={sec.id}
                  className={`rounded-xl px-2.5 py-2 ${isFound ? 'bg-[var(--lko-green-soft)]/70' : 'bg-black/[0.03]'}`}
                  data-testid={`patti-secret-${isFound ? sec.id : 'hidden'}`}
                >
                  {isFound ? (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1.5 text-[11px] font-extrabold text-[var(--lko-ink)]">
                          <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[var(--lko-green)] text-[8px] font-black text-white" aria-hidden>{i + 1}</span>
                          <span className="truncate">{sec.name}</span>
                        </p>
                        <StatusChip tone="ok">day {day}</StatusChip>
                      </div>
                      <p className="mt-0.5 pl-6 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">
                        reward: {rewardLine(sec.reward.kind, sec.reward.amount, sec.reward.item)}
                      </p>
                    </>
                  ) : (
                    <p className="flex items-center gap-1.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="patti-unfound">
                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[8px]" aria-hidden>🔒</span>
                      not yet found. The hill dey wait for your feet.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          {found === PATTI_SECRETS.length ? (
            <p className="mt-2 rounded-xl bg-[var(--lko-green-soft)] px-2.5 py-1.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]" data-testid="patti-complete">
              ⛰️ The whole hill don open for you — five of five.
            </p>
          ) : (
            <p className="mt-2 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
              Unfound spots no get address for this book — the trailhead dey at Mt Patti in the world. Walk am.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
