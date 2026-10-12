'use client'

/**
 * LOKOJA LIFE — ChatThread (Stage 5-c)
 * ------------------------------------
 * One NPC conversation inside the phone. The message list lives in
 * COMPONENT state only — threads do NOT persist across sessions
 * (gist dey cool). What DOES persist is the relationship itself:
 * familiarity, tier and the once-per-day cooldown live in the store
 * and save with the game.
 *
 * Flow: warm empty state → player taps the canned opener ("Abeg how
 * body?") → typing dots (~700ms) → NPC reply bubble → familiarity bar
 * fills → tier-up flourish when the tier changes. The store's chatNpc
 * enforces the one-chat-per-day gate; the UI mirrors it as a
 * "You don talk today" composer state.
 */

import { useEffect, useRef, useState } from 'react'
import { audio } from '@/game/systems/audio'
import { canChat, relationshipFor, tierFor, TIER_META } from '@/game/systems/social'
import { NPC_BY_ID } from '@/game/data/npcs'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { useGameStore } from '@/game/store/useGameStore'
import type { FamiliarityTier } from '@/game/data/npcChat'
import { ArrowLeftIcon, CheckIcon, SparkleIcon } from '../../icons'

/* ------------------------------- tier chips ------------------------------- */

const TIER_CHIP: Record<FamiliarityTier, string> = {
  stranger: 'bg-black/[0.05] text-[var(--lko-ink-soft)]',
  acquaintance: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
  paddy: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
  'close-paddy': 'bg-[var(--lko-terra)]/15 text-[var(--lko-terra)]',
}

/** Shared tier-chip tint (also used by the chat list in PhoneScreen). */
export function tierChipClass(tier: FamiliarityTier): string {
  return TIER_CHIP[tier]
}

/* --------------------------------- types ---------------------------------- */

interface ChatMsg {
  from: 'me' | 'npc' | 'sys'
  text: string
}

const OPENER = 'Abeg how body?'
const TYPING_MS = 700

/* ------------------------------ typing bubble ----------------------------- */

function TypingBubble({ emoji }: { emoji: string }) {
  return (
    <div className="flex items-end gap-1.5 self-start">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[13px]"
        aria-hidden
      >
        {emoji}
      </span>
      <span
        className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-black/[0.06] bg-white px-3.5 py-3"
        role="status"
        aria-label="Typing"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-black/30"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </span>
    </div>
  )
}

/* ------------------------------- ChatThread ------------------------------- */

export function ChatThread({ npcId, onBack }: { npcId: string; onBack: () => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const chatNpc = useGameStore((s) => s.chatNpc)

  const npc = NPC_BY_ID[npcId]
  const rel = relationshipFor(player.relationships, npcId)
  const tier = tierFor(rel.familiarity)
  const meta = TIER_META[tier]
  const chattedToday = !canChat(rel, world.day)

  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const [typing, setTyping] = useState(false)
  const [tierUp, setTierUp] = useState<FamiliarityTier | null>(null)
  const chatTimer = useRef<number | null>(null)
  const bannerTimer = useRef<number | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  /** tier captured at mount = tier before this thread's one chat */
  const tierBefore = useRef<FamiliarityTier>(tier)

  /* clear pending timers when the thread closes */
  useEffect(() => {
    return () => {
      if (chatTimer.current) window.clearTimeout(chatTimer.current)
      if (bannerTimer.current) window.clearTimeout(bannerTimer.current)
    }
  }, [])

  /* keep the newest bubble in view */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs.length, typing])

  if (!npc) return null

  const locName = LOCATION_BY_ID[npc.homeLocationId]?.name ?? 'Lokoja'

  const sendOpener = () => {
    if (typing || chattedToday) return
    audio.play('click')
    setMsgs((m) => [...m, { from: 'me', text: OPENER }])
    setTyping(true)
    chatTimer.current = window.setTimeout(() => {
      setTyping(false)
      const outcome = chatNpc(npcId)
      if (!outcome) {
        // cooldown race (shouldn't happen through this UI) — stay honest
        setMsgs((m) => [...m, { from: 'sys', text: 'You don talk today. Tomorrow another level.' }])
        return
      }
      if (outcome.tier !== tierBefore.current) {
        setTierUp(outcome.tier)
        audio.play('levelup')
        bannerTimer.current = window.setTimeout(() => setTierUp(null), 5000)
      } else {
        audio.play('notify')
      }
      tierBefore.current = outcome.tier
      setMsgs((m) => [
        ...m,
        { from: 'npc', text: outcome.reply },
        ...(outcome.firstMeeting
          ? [{ from: 'sys' as const, text: `You don add ${npc.name} — small small na im paddy dey grow.` }]
          : []),
      ])
    }, TYPING_MS)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* thread header */}
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-white/70 py-2 pl-1 pr-3 backdrop-blur">
        <button
          onClick={() => {
            audio.play('click')
            onBack()
          }}
          aria-label="Back to chats"
          className="lko-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--lko-ink-soft)]"
        >
          <ArrowLeftIcon size={18} />
        </button>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white text-lg"
          aria-hidden
        >
          {npc.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold leading-tight">{npc.name}</p>
          <p className="truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            {meta.label} • {locName}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${TIER_CHIP[tier]}`}>
          {meta.label}
        </span>
      </div>

      {/* familiarity track */}
      <div className="flex items-center gap-2 border-b border-black/[0.05] bg-white/50 px-3.5 py-2">
        <span className="text-[9.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-ink-soft)]">
          Familiarity
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.08]">
          <div
            className="h-full rounded-full bg-[var(--lko-terra)] transition-[width] duration-700"
            style={{ width: `${Math.min(100, rel.familiarity)}%` }}
          />
        </div>
        <span className="lko-num text-[10px] font-bold text-[var(--lko-ink-soft)]">{rel.familiarity}/100</span>
      </div>

      {/* messages */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
        {tierUp && (
          <div className="lko-pop mb-3 flex items-center gap-2.5 rounded-2xl border border-[var(--lko-gold)]/40 bg-[var(--lko-gold-soft)] px-3.5 py-2.5">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[var(--lko-gold-deep)]"
              aria-hidden
            >
              <SparkleIcon size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold leading-tight text-[var(--lko-gold-deep)]">
                Friendship level up — {TIER_META[tierUp].label}!
              </p>
              <p className="truncate text-[11px] font-semibold text-[var(--lko-gold-deep)]/80">
                {TIER_META[tierUp].perk}
              </p>
            </div>
          </div>
        )}

        {msgs.length === 0 && !typing ? (
          /* warm empty states */
          <div className="my-auto flex flex-col items-center px-4 pb-4 text-center">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border border-black/[0.06] bg-white text-3xl shadow-[var(--lko-shadow-sm)]"
              aria-hidden
            >
              {npc.emoji}
            </span>
            {rel.familiarity === 0 ? (
              <>
                <p className="lko-display mt-3 text-[15px]">You never talk before — break the ice.</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
                  One chat a day dey grow friendship small small.
                </p>
              </>
            ) : (
              <>
                <p className="lko-display mt-3 text-[15px]">You don talk today.</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
                  Tomorrow another level with {npc.name}.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {msgs.map((msg, i) =>
              msg.from === 'sys' ? (
                <p
                  key={i}
                  className="mx-auto my-1 max-w-[85%] text-center text-[10.5px] font-bold text-[var(--lko-ink-soft)]"
                >
                  {msg.text}
                </p>
              ) : msg.from === 'me' ? (
                <p
                  key={i}
                  className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-[var(--lko-green)] px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.12)]"
                >
                  {msg.text}
                </p>
              ) : (
                <div key={i} className="flex max-w-[85%] items-end gap-1.5 self-start">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[13px]"
                    aria-hidden
                  >
                    {npc.emoji}
                  </span>
                  <p className="rounded-2xl rounded-bl-md border border-black/[0.06] bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-[var(--lko-ink)] shadow-[var(--lko-shadow-sm)]">
                    {msg.text}
                  </p>
                </div>
              ),
            )}
            {typing && <TypingBubble emoji={npc.emoji} />}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* composer — one canned opener per day, store enforces the gate */}
      <div className="border-t border-black/[0.06] bg-white/70 px-3 py-2.5 backdrop-blur">
        {chattedToday ? (
          <div className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-black/[0.05] px-4 text-[13px] font-bold text-[var(--lko-ink-soft)]">
            <CheckIcon size={15} className="text-[var(--lko-green)]" aria-hidden />
            You don talk today
          </div>
        ) : (
          <button
            onClick={sendOpener}
            disabled={typing}
            className="lko-press flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--lko-green)] px-4 text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] disabled:bg-black/10 disabled:text-white/60 disabled:shadow-none"
          >
            {OPENER}
          </button>
        )}
      </div>
    </div>
  )
}
