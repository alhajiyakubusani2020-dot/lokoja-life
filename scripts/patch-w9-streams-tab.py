#!/usr/bin/env python3
"""W9 patch 3 — replace the sim StreamsTab with the REAL stage tab in LiveApp.tsx."""
import sys, re

P = '/home/z/my-project/src/components/game/screens/phone/LiveApp.tsx'
src = open(P, encoding='utf-8').read()

START = '/* ------------------------------ the streams tab ---------------------------- */'
END = '/* ------------------------------- the union tab ----------------------------- */'

NEW = r'''/* ------------------------- the streams tab (W9 THE STAGE) ------------------- */

const STAGE_WHY_TEXT: Record<string, string> = {
  'guest-mic-dark': 'Claim your name first — guests watch, never talk.',
  'stage-adults-only': 'The stage na adult land.',
  'bad-title': 'Give the stage a name (1–64 letters).',
  'stage-live-already': 'You already dey live.',
  'stage-not-live': 'That stage don end.',
  'minors-no-money': 'The purse na adult land.',
  'bad-pin': 'PIN no match.',
  'insufficient': 'Purse no carry that amount.',
  'too-fast': 'Slow down small.',
  'self': 'No tip yourself.',
  'bad-stage': 'Which stage be that?',
  'stage-no-canvas': 'The world no dey render — no POV to show.',
  'stage-ended': 'The stage don end.',
  'stage-dark': 'The media house dey dark — try again.',
  'no-such-paddy': 'That paddy no exist.',
  'minors-collect-nothing': 'Minors no dey collect money.',
}

function stageWhy(why: string | undefined): string {
  if (!why) return 'no gree'
  if (STAGE_WHY_TEXT[why]) return STAGE_WHY_TEXT[why]
  if (why.startsWith('stage-dark')) return 'The media house dey dark — try again.'
  return why
}

function StageVideo({ remoteStream, muted, videoRef }: {
  remoteStream: MediaStream | null
  muted: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
}) {
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (remoteStream) {
      if (v.srcObject !== remoteStream) v.srcObject = remoteStream
      v.play().catch(() => { /* autoplay honest: the unmute thumb is right there */ })
    } else {
      v.srcObject = null
    }
  }, [remoteStream, videoRef])
  useEffect(() => {
    const v = videoRef.current
    if (v) v.muted = muted
  }, [muted, videoRef])
  if (!remoteStream) {
    return (
      <div className="flex h-28 items-center justify-center rounded-2xl bg-black/85" data-testid="stage-video-dark">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/70">connecting to the stage…</p>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-2xl bg-black">
      <video ref={videoRef} autoPlay playsInline muted={muted} data-testid="stage-video"
        className="h-40 w-full bg-black object-contain" />
    </div>
  )
}

function StageChatRoom({ streamId, claimed, band, onNotice }: {
  streamId: string
  claimed: boolean
  band: string
  onNotice: (m: string) => void
}) {
  const feed = useWireStore((s) => s.feed)
  const rows = feed.filter((e) => e.channel === `stream:${streamId}` && (e.kind === 'chat' || e.kind === 'emote'))
  useEffect(() => {
    if (rows.length > 0) stageNoteChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length])
  const [draft, setDraft] = useState('')
  const send = async () => {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    const r = await stageSendChat(streamId, text)
    if (!r.ok) onNotice(stageWhy(r.why))
  }
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-white p-2" data-testid="stage-chat">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Stage chat</p>
      <div className="mt-1 max-h-24 space-y-0.5 overflow-y-auto" data-testid="stage-chat-feed">
        {rows.length === 0 ? (
          <p className="text-[10px] font-semibold text-[var(--lko-ink-soft)]">The room quiet — yarn something.</p>
        ) : rows.slice(-8).map((e) => (
          <p key={e.seq} className="text-[10px] font-semibold">
            <span className="font-black text-[var(--lko-green-deep)]">{e.actor}:</span> {String((e.payload as { text?: string }).text ?? '')}
          </p>
        ))}
      </div>
      {claimed ? (
        <div className="mt-1.5 flex gap-1.5">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={280}
            placeholder={band === 'kid' ? 'Kids dey talk with emotes for street' : 'Yarn the room…'}
            className="min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-semibold outline-none"
            aria-label="Stage chat" data-testid="stage-chat-input" />
          <button onClick={() => void send()} data-testid="stage-chat-send"
            className="lko-press rounded-xl bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-black text-white">Send</button>
        </div>
      ) : (
        <p className="mt-1.5 text-[10px] font-bold text-[var(--lko-ink-soft)]">Claim your name to yarn — guests fit watch.</p>
      )}
    </div>
  )
}

function StreamsTab({ claimed, onNotice, band, myHandle }: {
  claimed: boolean
  onNotice: (m: string) => void
  band: string
  myHandle: string | null
}) {
  const board = useStageStore((s) => s.board)
  const publishing = useStageStore((s) => s.publishing)
  const myStreamId = useStageStore((s) => s.myStreamId)
  const myTitle = useStageStore((s) => s.myTitle)
  const myMic = useStageStore((s) => s.myMic)
  const watchingId = useStageStore((s) => s.watchingId)
  const watchingTitle = useStageStore((s) => s.watchingTitle)
  const remoteStream = useStageStore((s) => s.remoteStream)
  const viewerMuted = useStageStore((s) => s.viewerMuted)

  const [title, setTitle] = useState('')
  const [pin, setPin] = useState('')
  const [tipAmt, setTipAmt] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => { void stageSeedBoard() }, [])

  const goLive = async () => {
    const t = title.trim() || `${myHandle ?? 'me'}'s waka`
    const r = await stageGoLive(t)
    if (r.ok) { setTitle(''); onNotice('📡 You dey live! Your waka na the show.') }
    else onNotice(stageWhy(r.why))
  }
  const stopLive = async () => {
    await stageStop()
    onNotice('The stage don rest.')
  }
  const watch = async (id: string) => {
    const r = await stageWatch(id)
    if (!r.ok) onNotice(stageWhy(r.why))
  }
  const stopWatch = async () => {
    await stageUnwatch()
  }
  const tip = async (amount: number) => {
    if (!watchingId) return
    if (!pin.trim()) { setTipAmt(amount); onNotice('Enter your PIN to spray.') ; return }
    const idemKey = `tip-${watchingId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const r = await stageSendTip(watchingId, amount, pin.trim(), idemKey)
    if (r.ok) { onNotice(`💸 ₦${amount} don fly to the host — the room see am.`); setTipAmt(null); setPin('') }
    else { onNotice(stageWhy(r.why)); setTipAmt(null) }
  }

  const watchingRow = board.find((r) => r.id === watchingId) ?? null
  const adult = claimed && band === 'adult'

  return (
    <div className="space-y-2" data-testid="live-streams">
      {/* ---------- GO LIVE (the broadcast door — adults, server law) ---------- */}
      {publishing ? (
        <div className="rounded-2xl border border-[var(--lko-amber)] bg-white p-3">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[12px] font-black">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" data-testid="stage-live-chip" />
              LIVE · {myTitle}
            </p>
            <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]" data-testid="stage-mic-note">
              {myMic ? '🎙️ mic on' : '🔇 no mic (POV only)'}
            </span>
          </div>
          <p className="mt-1 text-[10px] font-bold text-[var(--lko-ink-soft)]" data-testid="stage-viewers">
            {crowdNoteText(board.find((r) => r.id === myStreamId)?.viewers ?? 0)}
          </p>
          <button onClick={() => void stopLive()} data-testid="stage-stop"
            className="lko-press mt-2 w-full rounded-xl bg-red-600 py-2 text-[11px] font-black text-white">
            End the stage
          </button>
        </div>
      ) : adult ? (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Go live — your waka na the show</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={64}
            placeholder="Stage title (e.g. Market waka wey sweet)"
            className="mt-1.5 w-full rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none"
            aria-label="Stage title" data-testid="stage-title-input" />
          <button onClick={() => void goLive()} data-testid="stage-go-live"
            className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-amber)] py-2 text-[11px] font-black text-[#1a1e18]">
            📡 Go live (your POV dey stream)
          </button>
          <p className="mt-1 text-[10px] font-bold text-[var(--lko-ink-soft)]">Your POV dey go out real-time. Viewers fit spray real ₦ — the ledger dey chain every kobo.</p>
        </div>
      ) : (
        <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]" data-testid="stage-locked">
          {claimed ? 'The stage na adult land — you fit watch, never broadcast.' : 'The stage dey open for every eye — claim your name to broadcast.'}
        </p>
      )}

      {/* ------------------------------ THE WATCHER ---------------------------- */}
      {watchingId && (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-2.5" data-testid="stage-watcher">
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[11px] font-black">👀 {watchingTitle ?? watchingRow?.title ?? watchingId}</p>
            <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">{crowdNoteText(watchingRow?.viewers ?? 0)}</span>
          </div>
          <StageVideo remoteStream={remoteStream} muted={viewerMuted} videoRef={videoRef} />
          <div className="mt-1.5 flex gap-1.5">
            <button onClick={() => useStageStore.setState({ viewerMuted: !viewerMuted })} data-testid="stage-unmute"
              className="lko-press flex-1 rounded-xl bg-black/[0.05] py-1.5 text-[10px] font-extrabold">
              {viewerMuted ? '🔊 Unmute' : '🔇 Mute'}
            </button>
            <button onClick={() => void stopWatch()} data-testid="stage-stop-watch"
              className="lko-press flex-1 rounded-xl bg-black/[0.05] py-1.5 text-[10px] font-extrabold">Leave</button>
          </div>
          <StageChatRoom streamId={watchingId} claimed={claimed} band={band} onNotice={onNotice} />
          {adult && watchingRow && watchingRow.host !== myHandle && (
            <div className="mt-1.5 rounded-xl bg-[var(--lko-amber)]/10 p-2" data-testid="stage-tip-box">
              <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#1a1e18]">Spray the host (real ₦, the ledger dey chain am)</p>
              <div className="mt-1 flex gap-1.5">
                {[100, 500].map((amt) => (
                  <button key={amt} onClick={() => { setTipAmt(amt); void tip(amt) }} data-testid={`stage-tip-${amt}`}
                    className="lko-press flex-1 rounded-xl bg-[var(--lko-amber)] py-1.5 text-[10px] font-black text-[#1a1e18]">
                    ₦{amt}
                  </button>
                ))}
              </div>
              {tipAmt !== null && (
                <div className="mt-1.5 flex gap-1.5">
                  <input value={pin} onChange={(e) => setPin(e.target.value)} maxLength={8} inputMode="numeric" type="password"
                    placeholder="PIN" aria-label="Wallet PIN" data-testid="stage-tip-pin"
                    className="min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-bold outline-none" />
                  <button onClick={() => void tip(tipAmt)} data-testid="stage-tip-send"
                    className="lko-press rounded-xl bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-black text-white">
                    Spray ₦{tipAmt}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------- THE BOARD ----------------------------- */}
      <div data-testid="stage-board">
        {board.length === 0 ? (
          <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
            Nobody dey live now. When a walker go live, their stage go show here — real eyes, real spray.
          </p>
        ) : (
          board.map((s) => (
            <div key={s.id} className="mt-1 rounded-2xl border border-black/[0.06] bg-white p-3" data-testid={`stage-row-${s.host}`}>
              <p className="text-[12px] font-black">📡 {s.title}</p>
              <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
                {s.host} · {crowdNoteText(s.viewers)}
              </p>
              {s.host === myHandle ? (
                <p className="mt-1.5 text-[10px] font-black text-[var(--lko-green-deep)]">na your stage dey shine</p>
              ) : watchingId === s.id ? (
                <p className="mt-1.5 text-[10px] font-black text-[var(--lko-green-deep)]">you dey watch</p>
              ) : (
                <button onClick={() => void watch(s.id)} data-testid={`stage-watch-${s.host}`}
                  className="lko-press mt-1.5 rounded-full bg-[var(--lko-green-soft)] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">
                  Watch
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

'''

if 'Go live — your waka na the show' in src:
    print('already patched — skip')
    sys.exit(0)
i0 = src.find(START)
i1 = src.find(END)
if i0 < 0 or i1 < 0 or i1 <= i0:
    print(f'FATAL anchors: start={i0} end={i1}')
    sys.exit(1)
src = src[:i0] + NEW.lstrip('\n') + src[i1:]
open(P, 'w', encoding='utf-8').write(src)
print('StreamsTab replaced OK')
