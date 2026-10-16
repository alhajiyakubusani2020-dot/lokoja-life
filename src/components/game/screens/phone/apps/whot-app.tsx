'use client'

/**
 * M21 — WHOT! (the flagship: Nigeria's national card game, playable)
 * ------------------------------------------------------------------
 * A full match vs one real NPC (Emeka Dispatch, data/npcs.ts) with the
 * REAL 54-card Whot pack. The pure engine (deck / seeded shuffle /
 * legality / turn resolution / NPC policy / stake law) lives in
 * ./whot-engine.ts — headless, test-importable, no React in it.
 *
 * THE HOUSE RULESET (one line, exactly what the engine implements):
 * match the call card's suit or number · 1 = skip next player · 8 =
 * hold on (two-man match: both mean you go again) · 2 = pick two ·
 * 5 = pick three (a same-number card defends, e dey stack) · 14 = go
 * to market (opponent picks 1, you play again) · 20 = Whot — wild,
 * caller names the suit · no legal card? pick from the market.
 *
 * DETERMINISM: the shuffle is seeded by (world.day, match counter)
 * through mulberry32 — the same day and match number rebuild the exact
 * same shuffle, proven in scripts/test-m21-apps.ts. The RNG state
 * lives inside the match object, so reshuffles stay deterministic too.
 *
 * THE ECONOMY IS REAL: the stake (₦200 default) is paid through the
 * store's own removeMoney door (category 'fun' — the same door the
 * night out uses) and a win pays the pot (2× stake) through addMoney
 * exactly once, the same honest channel gigs and quests pay through.
 * THE KID WALL IS STRUCTURAL: AGE_LAW says a child plays for joy —
 * the kid path returns stake 0 and the money doors are never touched.
 */

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { NPC_BY_ID } from '@/game/data/npcs'
import {
  WHOT_STAKE,
  SUIT_GLYPH,
  SUIT_LABEL,
  whotSeed,
  dealMatch,
  legalMoves,
  playCard,
  pickFromMarket,
  stakeFor,
  npcTurn,
  type WhotCard,
  type WhotMatch,
  type WhotSuit,
} from './whot-engine'

export const APP_ID = 'whot'
export const APP_TITLE = 'Whot!'
export const APP_GLYPH = '🃏'

/* ============================== the component ============================= */

const NPC = NPC_BY_ID['emeka']
const NPC_NAME = NPC?.name ?? 'Emeka'

function cardLabel(c: WhotCard): string {
  return c.suit === 'whot' ? 'WHOT 20' : `${SUIT_GLYPH[c.suit]} ${c.n}`
}

export default function WhotApp() {
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const addMoney = useGameStore((s) => s.addMoney)
  const removeMoney = useGameStore((s) => s.removeMoney)
  const [dealt, setDealt] = useState(0)
  const [match, setMatch] = useState<WhotMatch | null>(null)
  const [stakePaid, setStakePaid] = useState(0)
  const [awaitCall, setAwaitCall] = useState(false)
  const paidRef = useRef(false)

  // the NPC's move (and the hold-on chains) resolve off the render pass
  useEffect(() => {
    if (!match || match.over || match.turn !== 'npc') return
    const t = setTimeout(() => setMatch((m) => (m && !m.over && m.turn === 'npc' ? npcTurn(m) : m)), 600)
    return () => clearTimeout(t)
  }, [match])

  // THE POT — the winner takes 2× stake through the store's own door, once.
  // (External-system write only — the banner derives the pot from stakePaid,
  // so no setState ever runs inside this effect.)
  useEffect(() => {
    if (!match?.over || match.winner !== 'you') return
    if (paidRef.current || stakePaid <= 0) return
    paidRef.current = true
    addMoney(stakePaid * 2, {
      label: `Whot pot — match #${dealt} vs ${NPC_NAME}`,
      category: 'fun',
    })
  }, [match, stakePaid, dealt, addMoney])

  if (!player || !world) return null

  // THE KID WALL (structural): the Age Law through stakeFor — a child
  // plays for joy, ₦0, and the wallet door is never touched on the kid
  // path. A pocket that cannot carry the stake plays free too — honestly
  // labelled, never blocked.
  const stake = stakeFor(player.ageBand, player.cash)
  const stakeWhy =
    player.ageBand === 'kid'
      ? 'kids play for fun — the Age Law keeps money out'
      : 'your pocket no carry ₦200 today — fun only'

  const startMatch = () => {
    audio.play('click')
    const n = dealt + 1
    paidRef.current = false
    setAwaitCall(false)
    if (stake > 0) {
      const ok = removeMoney(stake, {
        label: `Whot stake — match #${n} vs ${NPC_NAME}`,
        category: 'fun',
      })
      setStakePaid(ok ? stake : 0)
    } else {
      setStakePaid(0)
    }
    setDealt(n)
    setMatch(dealMatch(whotSeed(world.day, n)))
  }

  const legal = match && !match.over && match.turn === 'you' ? legalMoves(match, match.hands.you) : []
  const top = match && match.pile.length > 0 ? match.pile[match.pile.length - 1]! : null

  const onPlay = (i: number) => {
    if (!match || match.over || match.turn !== 'you' || awaitCall) return
    const c = match.hands.you[i]!
    if (!legal.includes(i)) return
    audio.play('click')
    if (c.suit === 'whot') {
      setAwaitCall(true) // hold the play until the suit is named
      return
    }
    setMatch(playCard(match, 'you', i))
  }

  const onCall = (s: WhotSuit) => {
    if (!match) return
    audio.play('click')
    setAwaitCall(false)
    const idx = match.hands.you.findIndex((c) => c.suit === 'whot' && legal.includes(match.hands.you.indexOf(c)))
    if (idx < 0) return
    setMatch(playCard(match, 'you', idx, s))
  }

  const onPick = () => {
    if (!match || match.over || match.turn !== 'you' || awaitCall) return
    audio.play('click')
    setMatch(pickFromMarket(match))
  }

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="whot-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Whot! vs {NPC_NAME}</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
          54-card pack · winner takes the pot (2× {formatNaira(WHOT_STAKE)})
          {stake === 0 ? ` · today na ₦0 — ${stakeWhy}` : ''}
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* the ruleset — stated, as the house law demands */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">House Rules</span>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="whot-rules">
            Match the call card&apos;s suit or number · 1 = skip next player · 8 = hold on (two-man match: both mean
            you go again) · 2 = pick two · 5 = pick three (a same-number card defends, e dey stack) · 14 = go to
            market (opponent picks 1, you play again) · 20 = Whot — wild, caller names the suit · no legal card?
            Pick from the market.
          </p>
        </div>

        {/* the table */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="whot-table">
          {!match ? (
            <div className="text-center">
              <p className="text-[11px] font-extrabold text-[var(--lko-ink)]">The table dey set</p>
              <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                {stake > 0
                  ? `Stake ${formatNaira(stake)} — winner takes ${formatNaira(stake * 2)}. The stake pays through the wallet when you deal.`
                  : `Free match — ${stakeWhy}.`}
              </p>
              <button
                type="button"
                data-testid="whot-deal"
                className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[10.5px] font-black text-white"
                onClick={startMatch}
              >
                DEAL — match #{dealt + 1} · day {world.day}
              </button>
            </div>
          ) : (
            <>
              {/* opponent row */}
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-extrabold text-[var(--lko-ink)]">
                  {NPC?.emoji ?? '🏍️'} {NPC_NAME}
                </span>
                <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]" data-testid="whot-npc-count">
                  {match.hands.npc.length} card{match.hands.npc.length === 1 ? '' : 's'} in hand
                </span>
              </div>

              {/* the call card */}
              <div className="mt-2 flex items-center justify-center gap-3">
                <div className="rounded-xl border border-black/[0.08] bg-[var(--lko-green-soft)] px-4 py-3 text-center">
                  <p className="text-[8.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">call card</p>
                  <p className="text-[18px] font-black leading-tight text-[var(--lko-ink)]" data-testid="whot-call-card">
                    {top ? cardLabel(top) : '—'}
                  </p>
                  {match.activeN === 20 && (
                    <p className="text-[8.5px] font-black text-[var(--lko-terra)]" data-testid="whot-active-suit">
                      called: {SUIT_LABEL[match.activeSuit]}
                    </p>
                  )}
                </div>
                <div className="text-[9px] font-bold text-[var(--lko-ink-soft)]">
                  market: {match.deck.length}
                  {match.pendingPick > 0 && match.turn === 'you' && (
                    <p className="text-[10px] font-black text-red-700" data-testid="whot-debt">YOU OWE {match.pendingPick} — a {match.pendingKind} defends</p>
                  )}
                  {match.pendingPick > 0 && match.turn === 'npc' && <p className="text-[10px] font-black text-[var(--lko-terra)]">{NPC_NAME} owes {match.pendingPick}</p>}
                </div>
              </div>

              {/* your hand */}
              <div className="mt-2 border-t border-black/[0.05] pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[var(--lko-ink)]">Your hand ({match.hands.you.length})</span>
                  {match.turn === 'you' && !match.over && !awaitCall && (
                    <button
                      type="button"
                      data-testid="whot-pick"
                      className="lko-press rounded-lg bg-black/[0.06] px-2.5 py-1 text-[9.5px] font-black text-[var(--lko-ink)]"
                      onClick={onPick}
                    >
                      PICK {match.pendingPick > 0 ? match.pendingPick : 1}
                    </button>
                  )}
                </div>
                {match.over ? (
                  <p className="mt-2 text-[12px] font-black" data-testid="whot-result">
                    {match.winner === 'you'
                      ? stakePaid > 0
                        ? `🏆 YOU WIN — the pot pays ${formatNaira(stakePaid * 2)}`
                        : '🏆 YOU WIN — free match, the bragging is the pot'
                      : `😔 ${NPC_NAME} wins — ${stakePaid > 0 ? `${formatNaira(stakePaid)} stake don go` : 'free match, no money moved'}`}
                  </p>
                ) : awaitCall ? (
                  <div className="mt-2">
                    <p className="text-[10px] font-extrabold text-[var(--lko-ink)]">CALL THE SUIT:</p>
                    <div className="mt-1 grid grid-cols-5 gap-1">
                      {(['circle', 'triangle', 'square', 'cross', 'star'] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          data-testid={`whot-call-${s}`}
                          className="lko-press rounded-lg bg-[var(--lko-gold-deep)] px-1 py-1.5 text-[10px] font-black text-white"
                          onClick={() => onCall(s)}
                        >
                          {SUIT_GLYPH[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-1.5 flex flex-wrap gap-1.5" data-testid="whot-hand">
                    {match.hands.you.map((c, i) => {
                      const canPlay = legal.includes(i)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          data-testid={`whot-card-${c.id}`}
                          className={`rounded-lg border px-2 py-2 text-[10px] font-black ${canPlay ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)] text-[var(--lko-ink)] lko-press' : 'border-black/[0.06] bg-black/[0.03] text-[var(--lko-ink-soft)] opacity-60'}`}
                          onClick={() => onPlay(i)}
                        >
                          {cardLabel(c)}
                        </button>
                      )
                    })}
                  </div>
                )}
                {match.note && !match.over && (
                  <p className="mt-1.5 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="whot-note">{match.note}</p>
                )}
                {!match.over && match.turn === 'npc' && (
                  <p className="mt-1 text-[9.5px] font-bold text-[var(--lko-terra)]">{NPC_NAME} dey think…</p>
                )}
                {match.over && (
                  <button
                    type="button"
                    data-testid="whot-again"
                    className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[10px] font-black text-white"
                    onClick={startMatch}
                  >
                    PLAY AGAIN — match #{dealt + 1}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* the honest book */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">The Book</span>
          <div className="mt-1 space-y-0.5 text-[10px] font-bold text-[var(--lko-ink-soft)]">
            <p>stake: {formatNaira(stake)} {stake > 0 ? `(pot ${formatNaira(WHOT_STAKE * 2)})` : '— fun only'} · matches dealt: {dealt}</p>
            <p>deck law: circles 12 · triangles 12 · squares 9 · crosses 9 · stars 7 · whots 5 = 54 (no 6, no 9 — na Whot law)</p>
            <p>shuffle seed: day {world.day} × match — same day, same match, same shuffle. Determinism na law.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
