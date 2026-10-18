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

import { useEffect, useRef, useState } from 'react'
import { FOOD } from '@/game/data/config'
import { formatNaira } from '@/game/systems/progression'
import { callSeconds } from '@/game/systems/callflow'
import { previewState, GUEST_PREVIEW_MS } from '@/game/systems/profile'
import { audio } from '@/game/systems/audio'
import { useGameStore } from '@/game/store/useGameStore'
import { useMenuStore } from '@/game/store/menu-store'
import { useSocialStore } from '@/game/store/social-store'
import { useWireStore } from '@/game/systems/wire'
import { pvSync, voiceAnswer, voiceDecline, voiceHangup, voiceInit, voiceSetHandleProvider } from '@/game/systems/voicenet'
import { PhoneIcon } from '../icons'
import { PhoneScreen } from './PhoneScreen'
import { MenuAuthSheet } from './MenuAuthSheet'

/** W8 — the face above the world. Muted on PURPOSE: the voice flies
 *  through the engine's remoteAudio; a second unmuted element doubles it. */
function WorldVideoTile({ stream, testid, className }: { stream: MediaStream | null; testid: string; className: string }) {
  const ref = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream
      void ref.current.play().catch(() => {})
    }
  }, [stream])
  return <video ref={ref} autoPlay playsInline muted data-testid={testid} className={className} />
}

export function WorldPhoneLayer({ onOpenWork }: { onOpenWork?: () => void }) {
  const eatMeal = useGameStore((s) => s.eatMeal)
  const hunger = useGameStore((s) => Math.round(s.player?.needs.hunger ?? 100))
  const energy = useGameStore((s) => Math.round(s.player?.needs.energy ?? 100))
  const mood = useGameStore((s) => Math.round(s.player?.needs.mood ?? 100))

  const call = useSocialStore((s) => s.call)
  const callDemo = useSocialStore((s) => s.callDemo)
  const cam = useSocialStore((s) => s.cam)
  const answer = useSocialStore((s) => s.answer)
  const decline = useSocialStore((s) => s.decline)
  const hangupStore = useSocialStore((s) => s.hangup)
  const tickCall = useSocialStore((s) => s.tickCall)
  const incomingDemoCall = useSocialStore((s) => s.incomingDemoCall)
  const overlayOpen = useSocialStore((s) => s.overlayOpen)
  const setOverlayOpen = useSocialStore((s) => s.setOverlayOpen)
  const unread = useSocialStore((s) => s.unread)

  const account = useGameStore((s) => s.account)
  const guestPreviewStartedAt = useGameStore((s) => s.guestPreviewStartedAt)
  const markGuestPreview = useGameStore((s) => s.markGuestPreview)
  const voiceOn = useGameStore((s) => !!s.live?.voiceOn)
  const wireState = useWireStore((s) => s.state)

  const [foodOpen, setFoodOpen] = useState(false)
  const [now, setNow] = useState(Date.now())
  const [claimOpen, setClaimOpen] = useState(false)

  // W1 — THE PREVIEW CLOCK: an unlinked walker's 60 seconds start at
  // world entry (the store guards: linked → no-op, twice → no-op).
  useEffect(() => {
    markGuestPreview()
  }, [markGuestPreview])

  // the preview heartbeat: one 1s tick while the clock runs unlinked
  useEffect(() => {
    if (account.linked || !guestPreviewStartedAt) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [account.linked, guestPreviewStartedAt])

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
    const w = window as unknown as { __lklSocial?: { incoming: (peer: string, video: boolean) => void; previewLeft: (ms: number) => void } }
    w.__lklSocial = {
      incoming: (peer, video) => incomingDemoCall(peer, video),
      // W1 — the witness door: jump the preview clock honestly (the LAW
      // itself is untouched — this only moves the started-at timestamp).
      previewLeft: (ms) => {
        const clamped = Math.max(0, Math.min(GUEST_PREVIEW_MS, ms))
        useGameStore.setState({ guestPreviewStartedAt: Date.now() - (GUEST_PREVIEW_MS - clamped) })
      },
    }
    return () => { delete w.__lklSocial }
  }, [incomingDemoCall])

  const unreadTotal = Object.values(unread).reduce((a, b) => a + b, 0)
  const incoming = call.phase === 'ringing' && !call.outgoing
  // W1 — the 60-second law, computed: the chip counts, the wall stands
  const preview = previewState(guestPreviewStartedAt ?? 0, now)
  const previewLive = !account.linked && !!guestPreviewStartedAt && !preview.expired
  const wallUp = !account.linked && !!guestPreviewStartedAt && preview.expired && !claimOpen

  return (
    <>
      {/* ---- the right-edge rail (hidden while the phone overlay is up) ---- */}
      {!overlayOpen && (
        <div className="pointer-events-none fixed right-2.5 top-[52%] z-30 flex flex-col items-end gap-1.5">
          {previewLive && (
            <button
              data-testid="preview-chip"
              onClick={() => setClaimOpen(true)}
              aria-label={`Guest preview — ${Math.ceil(preview.remainingMs / 1000)} seconds left. Tap to claim your name now.`}
              className="lko-press pointer-events-auto flex items-center gap-1.5 rounded-full border border-[#ffd88a]/50 bg-[#1a1e18]/90 px-2.5 py-1.5 text-[11px] font-extrabold text-[#ffd88a] shadow-sm backdrop-blur-sm"
            >
              ⏳ {Math.ceil(preview.remainingMs / 1000)}s — claim your name
            </button>
          )}
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
            <span className="lko-ring-pulse flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lko-green)] text-[11px]" aria-hidden>{call.video ? '📹' : '📞'}</span>
            <span className="text-[11px] font-extrabold">@{call.peer}</span>
            <span className="lko-num text-[11px] font-extrabold tabular-nums text-white/80">{fmt(callSeconds(call, now))}</span>
            <button onClick={() => { if (callDemo) hangupStore(); else void voiceHangup() }} aria-label="Hang up" className="lko-press flex h-7 w-7 items-center justify-center rounded-full bg-[#d64541] text-[11px]">✕</button>
          </div>
        </div>
      )}

      {/* ---- W8: THE FLOATING FACE — an active video call shows the
           picture above the living street (the diegetic law: the phone
           lives IN the world; the 3D never unmounts beneath it) ---- */}
      {call.phase === 'active' && call.video && cam.remote && !overlayOpen && (
        <div data-testid="world-video-face" className="fixed bottom-[124px] right-3 z-30 w-40 overflow-hidden rounded-2xl border border-white/30 bg-black shadow-[0_14px_36px_-12px_rgba(0,0,0,0.55)] sm:w-48">
          <WorldVideoTile stream={cam.remoteStream} testid="world-video-remote" className="aspect-[3/4] w-full object-cover" />
          <div className="flex items-center justify-between bg-[#1a1e18]/95 px-2 py-1.5">
            <span className="text-[9.5px] font-extrabold text-white">@{call.peer} · live video</span>
            <span className="lko-num text-[9.5px] font-extrabold tabular-nums text-white/80">{fmt(callSeconds(call, now))}</span>
          </div>
        </div>
      )}

      {/* ---- W1: THE REGISTER WALL — the 60 seconds end, the door stands.
           Not a dead end: claim (the in-world sheet — the life continues,
           nothing lost) or back to the menu. The wall floats ABOVE the
           living street; the 3D never unmounts beneath it. ---- */}
      {wallUp && (
        <div className="fixed inset-0 z-[47] flex items-end justify-center bg-black/55 backdrop-blur-[3px] sm:items-center" role="dialog" aria-modal aria-label="Your guest preview has ended">
          <div data-testid="register-wall" className="lko-fade w-full max-w-md rounded-t-3xl border border-white/15 bg-[#0e1512]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:rounded-3xl">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffd88a]/15 text-2xl" aria-hidden>⏳</span>
              <div className="min-w-0">
                <h2 className="lko-display text-xl leading-tight">Your free look don finish</h2>
                <p className="mt-0.5 text-[11.5px] font-semibold text-white/60">
                  60 seconds preview done. Claim your name to keep walking — your hustle dey safe, nothing dey lost.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[11.5px] font-semibold text-white/75">
              <p className="flex items-center gap-2"><span aria-hidden>🪪</span> One name + one PIN — your save, your paddies and your pocket ride am.</p>
              <p className="flex items-center gap-2"><span aria-hidden>😌</span> Design your face — wetin the street go see (W2 bodies go render am).</p>
              <p className="flex items-center gap-2"><span aria-hidden>🛡️</span> Minors dey behind the family shield — we collect nothing.</p>
            </div>
            <button
              type="button"
              data-testid="wall-claim"
              onClick={() => { audio.play('click'); setClaimOpen(true) }}
              className="lko-press mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#ffd88a] text-[15px] font-extrabold tracking-wide text-[#123528] shadow-[0_10px_28px_-10px_rgba(255,216,138,0.5)]"
            >
              Claim your name — keep your life 🪪
            </button>
            <button
              type="button"
              data-testid="wall-menu"
              onClick={() => { audio.play('click'); useMenuStore.getState().setScreen('menu') }}
              className="lko-press mt-2 flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] text-[12.5px] font-extrabold text-white/80"
            >
              Back to the menu
            </button>
          </div>
        </div>
      )}

      {/* ---- W1: the in-world claim sheet (the wall's honest door) ---- */}
      {claimOpen && <MenuAuthSheet inWorld onClose={() => setClaimOpen(false)} />}

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
