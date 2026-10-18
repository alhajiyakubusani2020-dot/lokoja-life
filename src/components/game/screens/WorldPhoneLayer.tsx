'use client'

/**
 * LOKOJA LIFE — M24-UI: THE WORLD PHONE LAYER (the diegetic seam)
 * ----------------------------------------------------------------
 * THE WORLD NEVER BLINKS, wave one: while you stand inside the 3D
 * city, your phone lives HERE — a floating rail on the world's right
 * edge (needs chips + the phone FAB), the phone itself opening as an
 * overlay ABOVE the canvas. The world tab never unmounts; nothing
 * underneath is touched. This file renders NO 3D and imports NO 3D
 * module — it is pure DOM above the canvas.
 *
 * What lives here:
 *  - THE NEEDS RAIL: hunger 🍲 / energy ⚡ / mood 😊 as honest taps —
 *    hunger opens the food sheet (the REAL eatMeal door: market
 *    prices, night law, the ledger).
 *  - THE PHONE FAB: opens the full handset as an overlay; carries
 *    the DM unread dot.
 *  - THE CALL BANNER: an incoming ring covers the world (z-50) with
 *    accept/decline; an active call lives as a pill with its timer.
 *    A REAL wire ring says LIVE WIRE; the labeled demo says demo.
 *  - THE W7 WIRE: the real answer/decline/hangup doors route through
 *    voicenet (the media plane); the demo door stays pure — a demo
 *    never touches the microphone.
 *  - THE STREET WALKIE (W7): the proximity voice sync rides here — the
 *    voiceOn toggle, the band, the wire state and the call phase are
 *    its four inputs; pvSync is idempotent, so the effect just re-runs.
 *  - THE DEMO DOOR (e2e/dev only): `__lklSocial.incoming(peer, video)`
 *    fires a labeled demo ring so the UI is witnessable headless.
 *    No real player ever gets a fake caller.
 */

import { useEffect, useState } from 'react'
import { FOOD } from '@/game/data/config'
import { formatNaira } from '@/game/systems/progression'
import { callSeconds } from '@/game/systems/callflow'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'
import { useWireStore } from '@/game/systems/wire'
import { pvSync, voiceAnswer, voiceDecline, voiceHangup, voiceInit, voiceSetHandleProvider } from '@/game/systems/voicenet'
import { PhoneIcon } from '../icons'
import { PhoneScreen } from './PhoneScreen'

export function WorldPhoneLayer({ onOpenWork }: { onOpenWork?: () => void }) {
  const eatMeal = useGameStore((s) => s.eatMeal)
  const hunger = useGameStore((s) => Math.round(s.player?.needs.hunger ?? 100))
  const energy = useGameStore((s) => Math.round(s.player?.needs.energy ?? 100))
  const mood = useGameStore((s) => Math.round(s.player?.needs.mood ?? 100))

  const call = useSocialStore((s) => s.call)
  const callDemo = useSocialStore((s) => s.callDemo)
  const answer = useSocialStore((s) => s.answer)
  const decline = useSocialStore((s) => s.decline)
  const hangupStore = useSocialStore((s) => s.hangup)
  const tickCall = useSocialStore((s) => s.tickCall)
  const incomingDemoCall = useSocialStore((s) => s.incomingDemoCall)
  const overlayOpen = useSocialStore((s) => s.overlayOpen)
  const setOverlayOpen = useSocialStore((s) => s.setOverlayOpen)
  const unread = useSocialStore((s) => s.unread)

  const account = useGameStore((s) => s.account)
  const voiceOn = useGameStore((s) => !!s.live?.voiceOn)
  const wireState = useWireStore((s) => s.state)

  const [foodOpen, setFoodOpen] = useState(false)
  const [now, setNow] = useState(Date.now())

  // the 1s heartbeats: the ring timeout law + the active call timer
  useEffect(() => {
    if (call.phase !== 'ringing' && call.phase !== 'dialing' && call.phase !== 'active') return
    const t = setInterval(() => {
      setNow(Date.now())
      tickCall(Date.now())
    }, 1000)
    return () => clearInterval(t)
  }, [call.phase, tickCall])

  // THE W7 WIRE — one boot: the push lanes, the ended watcher, the debug
  // hook. Idempotent. The handle provider feeds the walkie's polite rule.
  useEffect(() => {
    voiceSetHandleProvider(() => useGameStore.getState().account.handle ?? null)
    voiceInit()
  }, [])

  // THE STREET WALKIE SYNC — the inputs are the deps; pvSync is
  // idempotent (join once, leave once, no chatter in between).
  useEffect(() => {
    void pvSync({ voiceOn, adult: account.ageBand === 'adult', wireLive: wireState === 'live' })
  }, [voiceOn, account.ageBand, wireState, call.phase])

  // THE DEMO DOOR — e2e/dev only, honestly labeled in the banner itself.
  // It lives under its OWN namespace (`__lklSocial`) because the world's
  // e2e hook wholesale-assigns `__lkl` after its async mount — the two
  // never collide, and this file still imports zero 3D modules.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const w = window as unknown as { __lklSocial?: { incoming: (peer: string, video: boolean) => void } }
    w.__lklSocial = { incoming: (peer, video) => incomingDemoCall(peer, video) }
    return () => { delete w.__lklSocial }
  }, [incomingDemoCall])

  const unreadTotal = Object.values(unread).reduce((a, b) => a + b, 0)
  const incoming = call.phase === 'ringing' && !call.outgoing

  return (
    <>
      {/* ---- the right-edge rail (hidden while the phone overlay is up) ---- */}
      {!overlayOpen && (
        <div className="pointer-events-none fixed right-2.5 top-[52%] z-30 flex flex-col items-end gap-1.5">
          <button
            data-testid="hud-hunger"
            onClick={() => { setFoodOpen(true) }}
            aria-label={`Hunger ${hunger} percent — tap to eat`}
            className={`lko-press pointer-events-auto flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-extrabold shadow-sm backdrop-blur-sm ${
              hunger < 35 ? 'border-[#f3c8c4] bg-[#fdecea] text-[#a63d33]' : 'border-black/[0.06] bg-white/90 text-[var(--lko-ink)]'
            }`}
          >
            🍲 {hunger}%
          </button>
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-extrabold shadow-sm backdrop-blur-sm ${
              energy < 30 ? 'border-[#f3c8c4] bg-[#fdecea] text-[#a63d33]' : 'border-black/[0.06] bg-white/90 text-[var(--lko-ink)]'
            }`}
          >
            ⚡ {energy}%
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/90 px-2.5 py-1.5 text-[11px] font-extrabold text-[var(--lko-ink)] shadow-sm backdrop-blur-sm">
            😊 {mood}%
          </span>
          <button
            data-testid="world-phone-fab"
            onClick={() => setOverlayOpen(true)}
            aria-label="Open your phone"
            className="lko-press pointer-events-auto mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a1e18] text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]"
          >
            <PhoneIcon size={20} />
            {unreadTotal > 0 && (
              <span data-testid="world-phone-unread" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#1a1e18] bg-[var(--lko-terra)] px-1 text-[9px] font-black">
                {unreadTotal}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ---- the food sheet (the REAL eatMeal door) ---- */}
      {foodOpen && (
        <div className="fixed inset-0 z-[46] flex items-end justify-center bg-black/35 backdrop-blur-[2px] sm:items-center" onClick={() => setFoodOpen(false)}>
          <div className="lko-fade w-full max-w-sm rounded-t-3xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-4 shadow-2xl sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="lko-display text-[15px]">Eat something 🍲</h2>
              <button onClick={() => setFoodOpen(false)} aria-label="Close the food sheet" className="lko-press flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]">✕</button>
            </div>
            <div className="flex flex-col gap-1.5">
              {FOOD.meals.slice(0, 3).map((m) => (
                <button
                  key={m.key}
                  data-testid={`food-eat-${m.key}`}
                  onClick={() => {
                    const ok = eatMeal(m.key)
                    if (ok) setFoodOpen(false)
                  }}
                  className="lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-extrabold">{m.label}</span>
                    <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">+{m.hunger} food · +{m.mood} mood</span>
                  </span>
                  <span className="shrink-0 text-[11.5px] font-extrabold text-[var(--lko-gold-deep)]">{formatNaira(m.price)}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-center text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
              Real market prices at your spot — the night law go talk if e no be night yet.
            </p>
          </div>
        </div>
      )}

      {/* ---- the incoming call banner (covers everything, z-50) ---- */}
      {incoming && call.peer && (
        <div data-testid="call-banner" className="fixed inset-x-3 top-3 z-50 sm:left-1/2 sm:right-auto sm:w-96 sm:-translate-x-1/2">
          <div className="lko-pop flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/95 px-4 py-3 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md">
            <span className="lko-ring-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--lko-green-soft)] text-xl" aria-hidden>
              {call.video ? '📹' : '📞'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-extrabold">@{call.peer}</span>
              <span className="block text-[10px] font-bold text-[var(--lko-ink-soft)]">
                {callDemo ? `${call.video ? 'Video' : 'Voice'} call · demo ring — labeled, no mic` : `${call.video ? 'Video' : 'Voice'} call · LIVE WIRE — the real ring`}
              </span>
            </span>
            <button data-testid="call-banner-decline" onClick={() => { if (callDemo) decline(); else void voiceDecline() }} aria-label="Decline the call"
              className="lko-press flex h-10 w-10 items-center justify-center rounded-full bg-[#d64541] text-white">✕</button>
            <button data-testid="call-banner-answer" onClick={() => { if (callDemo) answer(); else void voiceAnswer() }} aria-label="Answer the call"
              className="lko-press flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lko-green)] text-white">✓</button>
          </div>
        </div>
      )}

      {/* ---- the active call pill (phone closed) ---- */}
      {call.phase === 'active' && !overlayOpen && call.peer && (
        <div data-testid="call-pill" className="fixed bottom-[72px] left-3 z-30">
          <div className="flex items-center gap-2 rounded-full bg-[#1a1e18]/95 px-3 py-2 text-white shadow-lg backdrop-blur-sm">
            <span className="lko-ring-pulse flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lko-green)] text-[11px]" aria-hidden>📞</span>
            <span className="text-[11px] font-extrabold">@{call.peer}</span>
            <span className="lko-num text-[11px] font-extrabold tabular-nums text-white/80">{fmt(callSeconds(call, now))}</span>
            <button onClick={() => { if (callDemo) hangupStore(); else void voiceHangup() }} aria-label="Hang up" className="lko-press flex h-7 w-7 items-center justify-center rounded-full bg-[#d64541] text-[11px]">✕</button>
          </div>
        </div>
      )}

      {/* ---- THE DIEGETIC PHONE: overlay above the living world ---- */}
      {overlayOpen && (
        <div
          data-testid="world-phone-overlay"
          className="fixed inset-0 z-[45] flex items-end justify-center bg-black/35 px-3 pb-[max(env(safe-area-inset-bottom),1rem)] pt-8 backdrop-blur-[2px] sm:items-center"
          onClick={() => setOverlayOpen(false)}
          role="dialog"
          aria-modal
          aria-label="Your phone"
        >
          <div className="max-h-full" onClick={(e) => e.stopPropagation()}>
            <PhoneScreen variant="overlay" onOpenWork={onOpenWork} />
          </div>
        </div>
      )}
    </>
  )
}

function fmt(n: number): string {
  const m = Math.floor(n / 60)
  const s = n % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
