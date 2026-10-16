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
 */

import { useGameStore } from '@/game/store/useGameStore'
import { PATTI_SECRETS, secretsFound } from '@/game/systems/patti'

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

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="patti-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Mt Patti</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
          The guardian hill&apos;s book — {found}/{PATTI_SECRETS.length} found
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">The Trail Book</span>
            <span className="rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-gold-deep)]" data-testid="patti-count">
              {found}/{PATTI_SECRETS.length}
            </span>
          </div>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            Five places, discovered the old way — you WALK there. No minigame, no lottery: the ground itself is the game.
          </p>
          <div className="mt-2 space-y-1.5">
            {PATTI_SECRETS.map((sec) => {
              const day = patti.found[sec.id]
              const isFound = day !== undefined
              return (
                <div key={sec.id} className="rounded-xl bg-black/[0.03] px-2.5 py-2" data-testid={`patti-secret-${isFound ? sec.id : 'hidden'}`}>
                  {isFound ? (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <p className="min-w-0 truncate text-[11px] font-extrabold text-[var(--lko-ink)]">{sec.name}</p>
                        <span className="shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green)]">
                          day {day}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">
                        reward: {rewardLine(sec.reward.kind, sec.reward.amount, sec.reward.item)}
                      </p>
                    </>
                  ) : (
                    <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="patti-unfound">
                      — not yet found. The hill dey wait for your feet.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
          {found === PATTI_SECRETS.length ? (
            <p className="mt-2 rounded-xl bg-[var(--lko-green-soft)] px-2.5 py-1.5 text-[10px] font-extrabold text-[var(--lko-green)]" data-testid="patti-complete">
              The whole hill don open for you — five of five.
            </p>
          ) : (
            <p className="mt-2 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
              Unfound spots no get address for this book — the trailhead dey at {`Mt Patti`} in the world. Walk am.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
