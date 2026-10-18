'use client'

/**
 * LOKOJA LIFE — M24-UI → W7: CALLS (the face of the voice wire)
 * ---------------------------------------------------------
 * The full call UI — dialing, ringing, the active screen (mute /
 * hangup / timer), the video face with its PiP frame, the ended
 * card that tells the truth about why — driven by the PURE callflow
 * machine through the social store, and WIRED by voicenet (W7): a
 * dial really rings a real online paddy, the answer really opens the
 * peer-to-peer voice.
 *
 * THE HONESTY LAWS:
 *  - NO FAKE ANSWER: nobody ever answers by themselves. An outgoing
 *    ring rings until the peer answers, YOU end it, or THE TIMEOUT
 *    LAW ends it. The demo ring stays behind the e2e/dev door,
 *    labeled demo, and never touches the microphone.
 *  - THE MINOR WALL: a minor never places and never receives a voice
 *    call — the UI hides the doors AND the server refuses anyway
 *    (fail-closed on both sides of the wire).
 *  - THE GUEST WALL: a guest's mic is dark (M17); the directory
 *    says so instead of pretending.
 *  - NO FAKE PEOPLE: the street NPCs have no phones yet — the rows
 *    say so instead of dialing a ghost.
 *  - THE END TRUTH: hangup / declined / missed / no-answer / busy /
 *    no-mic — the recents list never invents a why.
 */

import { useEffect, useRef, useState } from 'react'
import { NPCS } from '@/game/data/npcs'
import { callSeconds } from '@/game/systems/callflow'
import { getDeviceProfile } from '@/game/systems/device'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'
import { useWireStore, wireEnsure } from '@/game/systems/wire'
import {
  voiceAnswer, voiceDecline, voiceDial, voiceHangup, voiceInit, voiceSetHandleProvider, voiceToggleCam, voiceToggleMute,
} from '@/game/systems/voicenet'

type Tab = 'people' | 'recents'

interface RecentRow { peer: string; why: string; video: boolean; at: number }

/** session recents (the ended-truth list) */
const recents: RecentRow[] = []

function pushRecent(peer: string, why: string, video: boolean) {
  recents.unshift({ peer, why, video, at: Date.now() })
  if (recents.length > 24) recents.pop()
}

function fmtSecs(n: number): string {
  const m = Math.floor(n / 60)
  const s = n % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** W8 — a live picture on a <video>. Muted on PURPOSE: the audio flies
 *  through the engine's remoteAudio element; a second unmuted element
 *  would double every voice. */
function VideoTile({ stream, testid, className }: { stream: MediaStream | null; testid: string; className: string }) {
  const ref = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream
      void ref.current.play().catch(() => {})
    }
  }, [stream])
  return <video ref={ref} autoPlay playsInline muted data-testid={testid} className={className} />
}

export function CallsApp() {
  const [tab, setTab] = useState<Tab>('people')
  const [target, setTarget] = useState<string | null>(null)

  const account = useGameStore((s) => s.account)
  const wireRoster = useWireStore((s) => s.roster)
  const wireState = useWireStore((s) => s.state)

  const isAdult = account.ageBand === 'adult'
  const isClaimed = !!account.handle
  const canVoice = isClaimed && isAdult
  const wireLive = wireState === 'live'

  const call = useSocialStore((s) => s.call)
  const callDemo = useSocialStore((s) => s.callDemo)
  const cam = useSocialStore((s) => s.cam)
  const answerStore = useSocialStore((s) => s.answer)
  const declineStore = useSocialStore((s) => s.decline)
  const tickCall = useSocialStore((s) => s.tickCall)
  const clearEnded = useSocialStore((s) => s.clearEnded)
  const friends = useSocialStore((s) => s.friends)
  const blocked = useSocialStore((s) => s.blocked)
  // W8 — the heat honesty: a low device sleeps video by default
  const tier = getDeviceProfile().effective
  const videoOkTier = tier !== 'low'

  // THE TIMEOUT LAW heartbeat: a 1s tick while a ring is alive
  useEffect(() => {
    if (call.phase !== 'ringing' && call.phase !== 'dialing') return
    const t = setInterval(() => tickCall(Date.now()), 1000)
    return () => clearInterval(t)
  }, [call.phase, tickCall])

  // THE WIRE LANE — the directory rides the LIVE roster (instant presence);
  // connect once, refresh presence, re-handshake on token rotation
  useEffect(() => {
    wireEnsure(
      () => useGameStore.getState().account.token ?? null,
      () => ({ street: useGameStore.getState().world?.currentLocation ?? 'home', status: 'hustling' }),
    )
    // THE ONE BOOT lives here too — the call face owns the voice engine
    // wherever it opens (the layer's world mount is the other door; both
    // are idempotent)
    voiceSetHandleProvider(() => useGameStore.getState().account.handle ?? null)
    voiceInit()
  }, [account.handle, account.token])

  // record ended truth into recents (once per ended call)
  const endedKey = call.phase === 'ended' ? `${call.peer}:${call.endedAt}` : null
  const [lastEndedKey, setLastEndedKey] = useState<string | null>(null)
  useEffect(() => {
    if (endedKey && endedKey !== lastEndedKey && call.peer && call.endedWhy) {
      pushRecent(call.peer, call.endedWhy, call.video)
      setLastEndedKey(endedKey)
    }
  }, [endedKey, lastEndedKey, call.peer, call.endedWhy, call.video])

  /* ------------------------- the live call screens ------------------------- */
  if (call.phase !== 'idle') {
    const secs = callSeconds(call, Date.now())
    return (
      <div className="flex flex-col" data-testid={`calls-screen-${call.phase}`}>
        {call.phase === 'ended' ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.05] text-3xl" aria-hidden>{call.video ? '📹' : '📞'}</span>
            <p className="lko-display text-[16px]">Call ended</p>
            <p className="text-[11.5px] font-bold text-[var(--lko-ink-soft)]">
              @{call.peer} · {call.endedWhy === 'hangup' ? 'you hang up' : call.endedWhy === 'declined' ? 'declined' : call.endedWhy === 'missed' ? 'you missed am' : call.endedWhy === 'busy' ? 'line busy' : call.endedWhy === 'no-mic' ? 'mic no gree — check permission' : 'no answer'}
            </p>
            <button
              data-testid="calls-done"
              onClick={() => { clearEnded(); setTab('recents') }}
              className="lko-press mt-2 rounded-xl bg-[var(--lko-green)] px-6 py-2.5 text-[12.5px] font-extrabold text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center">
              <p className="lko-display text-[18px]">@{call.peer}</p>
              <p className="text-[12px] font-extrabold tabular-nums text-[var(--lko-ink-soft)]" data-testid="calls-status">
                {call.phase === 'dialing' && 'Dey ring…'}
                {call.phase === 'ringing' && (call.outgoing ? 'Dey ring…' : 'Incoming call')}
                {call.phase === 'active' && fmtSecs(secs)}
              </p>
              <span className="rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]" data-testid="calls-chip">
                {callDemo ? `${call.video ? 'video' : 'voice'} · demo ring — labeled, no mic` : call.video ? 'live video · peer-to-peer' : 'live voice · peer-to-peer'}
              </span>
              {call.phase === 'active' && call.video && (
                cam.remote ? (
                  <div className="relative mt-1 w-full overflow-hidden rounded-2xl bg-black shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]" data-testid="calls-video-stage">
                    <VideoTile stream={cam.remoteStream} testid="calls-video-remote" className="aspect-[4/3] w-full object-cover" />
                    {cam.local && (
                      <div className="absolute bottom-2 right-2 w-20 overflow-hidden rounded-lg border border-white/40 shadow-md sm:w-24">
                        <VideoTile stream={cam.localStream} testid="calls-video-pip" className="aspect-[4/3] w-full object-cover" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-black/[0.06]" data-testid="calls-video-dark">
                    <span className="text-3xl" aria-hidden>📹</span>
                    <p className="text-[11px] font-extrabold text-[var(--lko-ink-soft)]">
                      {cam.local ? 'Their camera dark — audio only' : 'Your camera dark — audio only'}
                    </p>
                    <p className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">The call dey live — the voice na the floor, the face na wish.</p>
                  </div>
                )
              )}
            </div>
            {call.phase === 'active' ? (
              <div className="flex items-center justify-center gap-3 pb-3" data-testid="calls-active-controls">
                <button
                  onClick={callDemo ? () => useSocialStore.getState().toggleMute() : () => voiceToggleMute()}
                  aria-pressed={call.muted}
                  aria-label={call.muted ? 'Unmute' : 'Mute'}
                  className={`lko-press flex h-13 w-13 items-center justify-center rounded-full p-3.5 text-xl ${call.muted ? 'bg-[var(--lko-ink)] text-white' : 'bg-black/[0.06]'}`}
                >
                  {call.muted ? '🔇' : '🎤'}
                </button>
                {call.video && !callDemo && (
                  <button
                    data-testid="calls-cam-toggle"
                    onClick={() => voiceToggleCam()}
                    aria-pressed={cam.local}
                    aria-label={cam.local ? 'Camera off' : 'Camera on'}
                    className={`lko-press flex h-13 w-13 items-center justify-center rounded-full p-3.5 text-xl ${cam.local ? 'bg-black/[0.06]' : 'bg-[var(--lko-ink)] text-white'}`}
                  >
                    {cam.local ? '📹' : '🚫'}
                  </button>
                )}
                <button
                  data-testid="calls-hangup"
                  onClick={() => { if (callDemo) useSocialStore.getState().hangup(); else void voiceHangup() }}
                  aria-label="Hang up"
                  className="lko-press flex h-16 w-16 items-center justify-center rounded-full bg-[#d64541] text-2xl text-white shadow-[0_8px_20px_-6px_rgba(214,69,65,0.6)]"
                >
                  ✕
                </button>
              </div>
            ) : call.outgoing ? (
              <div className="flex items-center justify-center pb-3">
                <button
                  data-testid="calls-cancel"
                  onClick={() => { if (callDemo) declineStore(); else void voiceDecline() }}
                  className="lko-press flex h-14 w-14 items-center justify-center rounded-full bg-[#d64541] text-xl text-white"
                  aria-label="Cancel the call"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 pb-3" data-testid="calls-incoming-controls">
                <button
                  data-testid="calls-decline"
                  onClick={() => { if (callDemo) declineStore(); else void voiceDecline() }}
                  className="lko-press flex h-14 w-14 items-center justify-center rounded-full bg-[#d64541] text-xl text-white"
                  aria-label="Decline the call"
                >
                  ✕
                </button>
                <button
                  data-testid="calls-answer"
                  onClick={() => { if (callDemo) answerStore(); else void voiceAnswer() }}
                  className="lko-press flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lko-green)] text-xl text-white"
                  aria-label="Answer the call"
                >
                  ✓
                </button>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  /* ------------------------------ the directory ------------------------------ */
  const online = wireRoster.map((r) => r.handle).filter((h) => h && h !== account.handle && !blocked.includes(h))
  const people = [...new Set([...friends, ...online])]
  const paddies = NPCS.filter((n) => !blocked.some((b) => b === n.id)).slice(0, 8)

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/[0.05] p-1">
        {([['people', '👥 People'], ['recents', '🕘 Recents']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`lko-press rounded-lg px-2 py-1.5 text-[11.5px] font-extrabold ${tab === k ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'recents' && (
        <div className="flex flex-col gap-1.5" data-testid="calls-recents">
          {recents.length === 0 && (
            <p className="rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
              No call yet. The ended truth go show here — never a lie.
            </p>
          )}
          {recents.map((r, i) => (
            <div key={`${r.at}-${i}`} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2">
              <span>
                <span className="block text-[12px] font-extrabold">@{r.peer} {r.video ? '📹' : '📞'}</span>
                <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
                  {new Date(r.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {r.why}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'people' && (
        <>
          {target ? (
            <div className="rounded-2xl border border-black/[0.05] bg-white p-3" data-testid="calls-target">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-extrabold">@{target}</p>
                <button onClick={() => setTarget(null)} className="lko-press text-[11px] font-bold text-[var(--lko-ink-soft)]" aria-label="Pick somebody else">change</button>
              </div>
              {canVoice ? (
                <>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      data-testid="calls-dial-voice"
                      onClick={() => { void voiceDial(target, false) }}
                      className="lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[11.5px] font-extrabold text-white"
                    >
                      📞 Voice call
                    </button>
                    <button
                      data-testid="calls-dial-video"
                      onClick={() => { void voiceDial(target, true) }}
                      className="lko-press rounded-xl bg-[var(--lko-ink)] py-2.5 text-[11.5px] font-extrabold text-white"
                    >
                      📹 Video call
                    </button>
                  </div>
                  <p className="mt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
                    {wireLive
                      ? videoOkTier
                        ? 'The real wire dey ring — voice and face, peer-to-peer.'
                        : 'This device dey rest small — video dey burn heat and data; the voice na the default.'
                      : 'The wire rest small — reconnect go make the ring real.'}
                  </p>
                </>
              ) : (
                <p className="mt-2 rounded-xl bg-[var(--lko-gold-soft)] px-3 py-2 text-[10.5px] font-extrabold text-[var(--lko-gold-deep)]" data-testid="calls-wall">
                  {isClaimed ? 'Voice na adult table — minors no dey carry call (the M13 shield).' : 'Claim your phone first — the mic dey dark for guests (M17).'}
                </p>
              )}
            </div>
          ) : (
            <>
              {people.length > 0 && (
                <p className="px-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Real people</p>
              )}
              {people.map((h) => (
                <button key={h} onClick={() => canVoice && setTarget(h)} className="lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left">
                  <span className="text-[12.5px] font-extrabold">@{h}</span>
                  {online.includes(h) && <span className="rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green-deep)]">● online</span>}
                </button>
              ))}
              <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Street paddies</p>
              {paddies.map((n) => (
                <div key={n.id} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white/60 px-3 py-2.5 opacity-70">
                  <span className="text-[12.5px] font-extrabold">{n.name}</span>
                  <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">no phone yet</span>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}
