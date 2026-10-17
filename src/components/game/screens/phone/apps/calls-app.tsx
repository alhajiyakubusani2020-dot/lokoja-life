'use client'

/**
 * LOKOJA LIFE — M24-UI: CALLS (the face of the voice wire)
 * ---------------------------------------------------------
 * The full call UI — dialing, ringing, the active screen (mute /
 * hangup / timer), the video face with its PiP frame, the ended
 * card that tells the truth about why — driven by the PURE callflow
 * machine through the social store.
 *
 * THE HONESTY LAWS:
 *  - NO FAKE ANSWER: nobody ever answers by themselves. An outgoing
 *    practice ring rings until YOU end it or THE TIMEOUT LAW ends it
 *    (no-answer). The active screen is reached by answering a call —
 *    the demo ring behind the e2e/dev door is labeled "demo".
 *  - THE MEDIA TRUTH: the voice/video wire lands with W7/W8. Every
 *    call screen carries the honest chip, and the audio you "hear"
 *    is silence until the wire speaks.
 */

import { useEffect, useState } from 'react'
import { NPCS } from '@/game/data/npcs'
import { callSeconds } from '@/game/systems/callflow'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'

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

export function CallsApp() {
  const [tab, setTab] = useState<Tab>('people')
  const [target, setTarget] = useState<string | null>(null)

  const account = useGameStore((s) => s.account)
  const wire = useGameStore((s) => s.liveWire)

  const call = useSocialStore((s) => s.call)
  const dial = useSocialStore((s) => s.dial)
  const answer = useSocialStore((s) => s.answer)
  const decline = useSocialStore((s) => s.decline)
  const hangup = useSocialStore((s) => s.hangup)
  const toggleMute = useSocialStore((s) => s.toggleMute)
  const tickCall = useSocialStore((s) => s.tickCall)
  const clearEnded = useSocialStore((s) => s.clearEnded)
  const friends = useSocialStore((s) => s.friends)
  const blocked = useSocialStore((s) => s.blocked)

  // THE TIMEOUT LAW heartbeat: a 1s tick while a ring is alive
  useEffect(() => {
    if (call.phase !== 'ringing' && call.phase !== 'dialing') return
    const t = setInterval(() => tickCall(Date.now()), 1000)
    return () => clearInterval(t)
  }, [call.phase, tickCall])

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
              @{call.peer} · {call.endedWhy === 'hangup' ? 'you hang up' : call.endedWhy === 'declined' ? 'declined' : call.endedWhy === 'missed' ? 'you missed am' : 'no answer'}
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
              <span className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--lko-green-soft)] text-4xl ${call.phase !== 'active' ? 'lko-ring-pulse' : ''}`} aria-hidden>
                {call.video ? '📹' : '📞'}
              </span>
              <p className="lko-display text-[18px]">@{call.peer}</p>
              <p className="text-[12px] font-extrabold tabular-nums text-[var(--lko-ink-soft)]" data-testid="calls-status">
                {call.phase === 'dialing' && 'Dey ring…'}
                {call.phase === 'ringing' && (call.outgoing ? 'Dey ring…' : 'Incoming call')}
                {call.phase === 'active' && fmtSecs(secs)}
              </p>
              <span className="rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]">
                {call.video ? 'video' : 'voice'} · the {call.video ? 'camera (W8)' : 'voice (W7)'} wire dey come
              </span>
            </div>
            {call.phase === 'active' ? (
              <div className="flex items-center justify-center gap-3 pb-3" data-testid="calls-active-controls">
                <button
                  onClick={toggleMute}
                  aria-pressed={call.muted}
                  aria-label={call.muted ? 'Unmute' : 'Mute'}
                  className={`lko-press flex h-13 w-13 items-center justify-center rounded-full p-3.5 text-xl ${call.muted ? 'bg-[var(--lko-ink)] text-white' : 'bg-black/[0.06]'}`}
                >
                  {call.muted ? '🔇' : '🎤'}
                </button>
                <button
                  data-testid="calls-hangup"
                  onClick={() => { hangup() }}
                  aria-label="Hang up"
                  className="lko-press flex h-16 w-16 items-center justify-center rounded-full bg-[#d64541] text-2xl text-white shadow-[0_8px_20px_-6px_rgba(214,69,65,0.6)]"
                >
                  ✕
                </button>
                <button
                  onClick={() => { audio('click') }}
                  aria-label="Speaker (lands with the W7 wire)"
                  className="lko-press flex h-13 w-13 items-center justify-center rounded-full bg-black/[0.06] p-3.5 text-xl opacity-50"
                  disabled
                >
                  🔊
                </button>
              </div>
            ) : call.outgoing ? (
              <div className="flex items-center justify-center pb-3">
                <button
                  data-testid="calls-cancel"
                  onClick={() => decline()}
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
                  onClick={() => decline()}
                  className="lko-press flex h-14 w-14 items-center justify-center rounded-full bg-[#d64541] text-xl text-white"
                  aria-label="Decline the call"
                >
                  ✕
                </button>
                <button
                  data-testid="calls-answer"
                  onClick={() => answer()}
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
  const online = (wire?.roster ?? []).map((r) => r.handle).filter((h) => h && h !== account.handle && !blocked.includes(h))
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
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  data-testid="calls-dial-voice"
                  onClick={() => { const r = dial(target, false); if (!r.ok) return }}
                  className="lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[11.5px] font-extrabold text-white"
                >
                  📞 Voice call
                </button>
                <button
                  data-testid="calls-dial-video"
                  onClick={() => { const r = dial(target, true); if (!r.ok) return }}
                  className="lko-press rounded-xl bg-[var(--lko-ink)] py-2.5 text-[11.5px] font-extrabold text-white"
                >
                  📹 Video call
                </button>
              </div>
              <p className="mt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
                Practice ring — nobody go answer by demself; the W7 wire go carry the real voice.
              </p>
            </div>
          ) : (
            <>
              {people.length > 0 && (
                <p className="px-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Real people</p>
              )}
              {people.map((h) => (
                <button key={h} onClick={() => setTarget(h)} className="lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left">
                  <span className="text-[12.5px] font-extrabold">@{h}</span>
                  {online.includes(h) && <span className="rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green-deep)]">● online</span>}
                </button>
              ))}
              <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Street paddies</p>
              {paddies.map((n) => (
                <button key={n.id} onClick={() => setTarget(n.name)} className="lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left">
                  <span className="text-[12.5px] font-extrabold">{n.name}</span>
                  <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">paddy</span>
                </button>
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}

/** tiny local click sound helper (the app keeps house audio discipline) */
function audio(kind: 'click') {
  import('@/game/systems/audio').then((m) => m.audio.play(kind)).catch(() => {})
}
