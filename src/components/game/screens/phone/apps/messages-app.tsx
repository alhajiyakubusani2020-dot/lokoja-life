'use client'

/**
 * LOKOJA LIFE — M24-UI: MESSAGES (the nation wire + honest DMs)
 * --------------------------------------------------------------
 * Two channels, two truths, both labeled:
 *  - THE NATION WIRE: the REAL relay (kind chat/emote on channel global).
 *    W4: the LIVE SOCKET carries it now — sub-second through the
 *    nation-wire service — and the honest ~12s relay heartbeat stays as
 *    the DEGRADED fallback lane (nothing thrown away). The face labels
 *    which lane is speaking, always.
 *    Session-scoped buffer: the wire shows what flies while you watch.
 *  - THE DMs: person-to-person threads from the social store — honest
 *    DEVICE truth, and when both paddies stand on the live wire the
 *    words ALSO fly sub-second through the wire door (labeled per thread).
 *
 * THE TIER LAW rides at the mic exactly like LiveApp: a kid's keyboard
 * IS the emote grid; teens feel the word wall; adults lose their links
 * before the relay ever sees them. The BLOCK law: a blocked handle
 * cannot be dialed, friended, or messaged — the composer says why.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'
import { EMOTE_LIBRARY, sanitizeChat, type LiveIdentity } from '@/game/systems/live'
import { useWireStore, wireEnsure, wireSendChat, wireSendEmote, wireOpenDm, wireSendDm } from '@/game/systems/wire'

type Tab = 'wire' | 'dms'

interface WireEvent { seq: number; kind: string; actor: string; payload: Record<string, unknown>; channel?: string }

/** session-scoped accumulation of the nation's chat wire (the relay sends deltas) */
const wireBuffer: { key: string; actor: string; text: string; glyph?: string; ts: number }[] = []
let wireHighSeq = 0
const WIRE_CAP = 120
/** module-scope DM dedupe — survives StrictMode's dev double-mount, so one
 * wire DM lands exactly once no matter how many times effects re-run */
const dmSeenSeq = new Set<number>()

function absorbWire(events: WireEvent[], me: string): number {
  let fresh = 0
  for (const e of events) {
    if (e.seq <= wireHighSeq) continue
    wireHighSeq = e.seq
    if (e.channel && e.channel !== 'global') continue
    if (e.kind === 'chat') {
      const text = typeof e.payload?.text === 'string' ? e.payload.text : ''
      if (!text) continue
      wireBuffer.push({ key: `w${e.seq}`, actor: e.actor, text, ts: Date.now() })
      if (e.actor !== me) fresh++
    } else if (e.kind === 'emote') {
      const glyph = typeof e.payload?.glyph === 'string' ? e.payload.glyph : '✨'
      const phrase = typeof e.payload?.phrase === 'string' ? e.payload.phrase : ''
      wireBuffer.push({ key: `w${e.seq}`, actor: e.actor, text: phrase, glyph, ts: Date.now() })
      if (e.actor !== me) fresh++
    }
  }
  if (wireBuffer.length > WIRE_CAP) wireBuffer.splice(0, wireBuffer.length - WIRE_CAP)
  return fresh
}

export function MessagesApp({ openDm, onOpenDmChange }: { openDm: string | null; onOpenDmChange: (handle: string | null) => void }) {
  const [tab, setTab] = useState<Tab>('wire')
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [wireTick, forceTick] = useState(0)

  // THE DEEP-LINK LAW (render-phase derivation, React's blessed pattern — no
  // effect, no loop): when Connect hands us a handle, the thread OPENS —
  // tapping Message on a paddy must never land on the wrong tab.
  const [lastLinked, setLastLinked] = useState<string | null | undefined>(undefined)
  if (openDm !== lastLinked) {
    setLastLinked(openDm)
    if (openDm) setTab('dms')
  }

  const account = useGameStore((s) => s.account)
  const live = useGameStore((s) => s.live)
  const wire = useGameStore((s) => s.liveWire)
  const liveSync = useGameStore((s) => s.liveSync)
  const liveSendChat = useGameStore((s) => s.liveSendChat)
  const liveSendEmote = useGameStore((s) => s.liveSendEmote)

  // THE WIRE — the live socket lane (W4)
  const wireState = useWireStore((s) => s.state)
  const wireFeed = useWireStore((s) => s.feed)
  const wireLive = wireState === 'live'

  const friends = useSocialStore((s) => s.friends)
  const blocked = useSocialStore((s) => s.blocked)
  const dms = useSocialStore((s) => s.dms)
  const unread = useSocialStore((s) => s.unread)
  const sendDm = useSocialStore((s) => s.sendDm)
  const receiveDm = useSocialStore((s) => s.receiveDm)
  const markDmRead = useSocialStore((s) => s.markDmRead)

  const claimed = account.linked && !!account.token
  const band = (account.ageBand ?? 'adult') as 'kid' | 'teen' | 'adult'
  const me = account.handle

  // THE DEMO DOOR (e2e/dev only, honestly labeled): receiveDm so the thread
  // UI is witnessable headless. Never runs for a real player's session.
  useEffect(() => {
    const w = window as unknown as { __lkl?: Record<string, unknown> }
    w.__lkl = { ...w.__lkl, socialReceiveDm: (handle: string, text: string) => receiveDm(handle, text) }
  }, [receiveDm])

  // deep-link: Connect opens a thread through the controlled openDm prop —
  // no effect, no render-phase setState (the house deep-link law).

  // THE WIRE LANE — connect once, refresh presence, re-handshake on token rotation
  useEffect(() => {
    wireEnsure(
      () => useGameStore.getState().account.token ?? null,
      () => ({ street: useGameStore.getState().world?.currentLocation ?? 'home', status: 'hustling' }),
    )
  }, [claimed, account.token])

  // the same 12s heartbeat the whole nation rides — THE DEGRADED LANE:
  // when the live socket carries the wire, the polling stands down (N5)
  useEffect(() => {
    if (!claimed || tab !== 'wire' || wireLive) return
    let alive = true
    const beat = async () => {
      const res = await liveSync()
      if (!alive) return
      if (res.ok) forceTick((n) => n + 1)
    }
    const t0 = setTimeout(() => { void beat() }, 0)
    const t = setInterval(() => { void beat() }, 12_000)
    return () => { alive = false; clearTimeout(t0); clearInterval(t) }
  }, [claimed, tab, liveSync, wireLive])

  // absorb whatever the last sync carried (the relay lane)
  useEffect(() => {
    if (wire?.events?.length) absorbWire(wire.events as WireEvent[], me ?? '')
  }, [wire, me])

  // absorb whatever the LIVE SOCKET carried (the fast lane) + live DM delivery.
  // No setState here — the wireFeed subscription itself is the render driver;
  // the rows memo below re-derives on every feed change (absorbWire is
  // seq-deduped, so re-running it is always harmless).
  useEffect(() => {
    if (!wireFeed.length) return
    for (const e of wireFeed) {
      if (e.kind === 'dm' && e.actor !== me && e.payload?.to === me && !dmSeenSeq.has(e.seq)) {
        dmSeenSeq.add(e.seq)
        receiveDm(e.actor, typeof e.payload.text === 'string' ? e.payload.text : '')
      }
    }
  }, [wireFeed, me, receiveDm])

  // join the DM room when a thread opens — both online paddies receive live
  useEffect(() => {
    if (openDm && wireLive) wireOpenDm(openDm)
  }, [openDm, wireLive])

  const wireRows = useMemo(() => {
    if (wireFeed.length) absorbWire(wireFeed as WireEvent[], me ?? '')
    return [...wireBuffer].reverse()
  }, [wireFeed, wire, me, wireTick])

  const dmHandles = useMemo(() => {
    const set = new Set<string>([...friends, ...Object.keys(dms)])
    return [...set].filter((h) => !blocked.includes(h))
  }, [friends, dms, blocked])

  const identity: LiveIdentity = { handle: me || null, band }
  const verdict = claimed && tab === 'wire' ? sanitizeChat(identity, draft) : { ok: true, text: draft }

  const sendWire = async () => {
    const check = sanitizeChat(identity, draft)
    if (!check.ok) {
      setNotice(WHY_LABEL[check.why ?? ''] ?? 'The mic no gree — check am.')
      return
    }
    // THE LANE LAW: the live socket when it lives, the honest relay when it doesn't
    const res = wireLive ? await wireSendChat(draft, 'global') : await liveSendChat(draft, 'global')
    if (!res.ok) {
      setNotice(WHY_LABEL[res.why ?? ''] ?? (wireLive ? 'The wire no gree — try again.' : 'The relay no gree — try again.'))
      return
    }
    setDraft('')
    setNotice(null)
  }

  const sendEmote = async (id: string) => {
    const res = wireLive ? await wireSendEmote(id, 'global') : await liveSendEmote(id, 'global')
    if (!res.ok) setNotice(WHY_LABEL[res.why ?? ''] ?? 'Emote no fly.')
  }

  if (!claimed) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center" data-testid="messages-locked">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--lko-green-soft)] text-2xl" aria-hidden>💬</span>
        <p className="lko-display mt-3 text-[15px]">The nation wire dey wait for your name.</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
          Claim your handle first — after that, the whole city fit hear you.
        </p>
      </div>
    )
  }

  /* ---------------------------- the DM thread view ---------------------------- */
  if (tab === 'dms' && openDm) {
    const thread = dms[openDm] ?? []
    const isBlocked = blocked.includes(openDm)
    return (
      <div className="flex flex-col gap-2" data-testid="messages-thread">
        <button
          onClick={() => { onOpenDmChange(null) }}
          className="lko-press flex items-center gap-1.5 self-start rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-extrabold text-[var(--lko-ink-soft)]"
        >
          ← All chats
        </button>
        <div className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2">
          <p className="text-[13px] font-extrabold">@{openDm}</p>
          <span className="rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]">
            on this device{wireLive ? ' + live wire' : ''}
          </span>
        </div>
        <div className="flex max-h-[300px] min-h-[160px] flex-col gap-1.5 overflow-y-auto rounded-2xl bg-white/70 p-2.5">
          {thread.length === 0 && (
            <p className="py-6 text-center text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
              The thread dey quiet. Talk first.
            </p>
          )}
          {thread.map((m) => (
            <div key={m.id} className={`max-w-[85%] rounded-2xl px-3 py-1.5 ${m.from === 'me' ? 'self-end bg-[var(--lko-green)] text-white' : 'self-start bg-black/[0.05]'}`}>
              <p className="text-[12px] font-semibold leading-snug break-words">{m.text}</p>
              <p className={`mt-0.5 text-right text-[8.5px] font-bold ${m.from === 'me' ? 'text-white/70' : 'text-[var(--lko-ink-soft)]'}`}>
                {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
        {isBlocked ? (
          <p className="rounded-xl bg-[#fdecea] px-3 py-2 text-[11px] font-bold text-[#a63d33]">
            You block @{openDm} — the mic dey off for am. Unblock for Connect first.
          </p>
        ) : (
          <div className="flex gap-1.5">
            <input
              data-testid="messages-dm-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={280}
              placeholder={`Talk to @${openDm}…`}
              className="min-w-0 flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
            />
            <button
              data-testid="messages-dm-send"
              onClick={() => {
                if (!draft.trim()) {
                  setNotice('Empty message no dey fly.')
                  return
                }
                const res = sendDm(openDm, draft)
                if (res.ok) {
                  // the DEVICE truth landed; when the wire lives, the words ALSO
                  // fly to the paddy sub-second (the server door runs the laws)
                  if (wireLive) void wireSendDm(openDm, draft)
                  setDraft('')
                } else setNotice(res.why === 'too-long' ? 'Too long — 280 max.' : 'Empty message no dey fly.')
              }}
              className="lko-press rounded-xl bg-[var(--lko-green)] px-4 py-2 text-[12px] font-extrabold text-white"
            >
              Send
            </button>
          </div>
        )}
        {notice && <p className="px-1 text-[10.5px] font-bold text-[var(--lko-terra)]">{notice}</p>}
      </div>
    )
  }

  /* ------------------------------ the tab bodies ------------------------------ */
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-black/[0.05] p-1">
        {([['wire', '🌍 Nation wire'], ['dms', `💬 DMs${dmHandles.length ? ` (${dmHandles.length})` : ''}`]] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`lko-press rounded-lg px-2 py-1.5 text-[11.5px] font-extrabold ${tab === k ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'wire' && (
        <div data-testid="messages-wire">
          <p className="px-1 pb-1 text-[10px] font-bold text-[var(--lko-ink-soft)]" data-testid="messages-lane">
            {wireLive
              ? 'Live wire — messages land instant. The ~12s relay stands as fallback.'
              : 'Relay lane — messages land ~12s. The live wire takes over when it connects.'}
          </p>
          <div className="flex max-h-[300px] min-h-[180px] flex-col gap-1.5 overflow-y-auto rounded-2xl bg-white/70 p-2.5">
            {wireRows.length === 0 && (
              <p className="py-6 text-center text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
                The wire dey quiet now — talk make the city hear you.
              </p>
            )}
            {wireRows.map((r) => (
              <div key={r.key} className={`max-w-[85%] rounded-2xl px-3 py-1.5 ${r.actor === me ? 'self-end bg-[var(--lko-green)] text-white' : 'self-start bg-black/[0.05]'}`}>
                {r.actor !== me && <p className="text-[9px] font-black uppercase tracking-wide text-[var(--lko-green-deep)]">@{r.actor}</p>}
                <p className="text-[12px] font-semibold leading-snug break-words">{r.glyph ? `${r.glyph} ` : ''}{r.text}</p>
              </div>
            ))}
          </div>
          {band === 'kid' ? (
            <div className="mt-1 rounded-2xl border border-black/[0.05] bg-white p-2.5">
              <p className="pb-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Your words — pick one</p>
              <div className="grid grid-cols-4 gap-1.5">
                {EMOTE_LIBRARY.slice(0, 8).map((e) => (
                  <button key={e.id} onClick={() => void sendEmote(e.id)} title={e.phrase}
                    className="lko-press rounded-xl bg-black/[0.04] py-2 text-lg" aria-label={`Send ${e.phrase}`}>
                    {e.glyph}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="mt-1 flex gap-1.5">
                <input
                  data-testid="messages-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={band === 'teen' ? 140 : 280}
                  placeholder={band === 'teen' ? 'Talk (140 max)…' : 'Talk to the city…'}
                  className="min-w-0 flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
                />
                <button
                  data-testid="messages-send"
                  onClick={() => void sendWire()}
                  className="lko-press rounded-xl bg-[var(--lko-green)] px-4 py-2 text-[12px] font-extrabold text-white"
                >
                  Send
                </button>
              </div>
              {draft.trim().length > 0 && !verdict.ok && verdict.why && (
                <p className="px-1 pt-0.5 text-[10px] font-bold text-[var(--lko-terra)]">{WHY_LABEL[verdict.why]}</p>
              )}
            </>
          )}
          {notice && <p className="px-1 pt-0.5 text-[10.5px] font-bold text-[var(--lko-terra)]">{notice}</p>}
        </div>
      )}

      {tab === 'dms' && (
        <div className="flex flex-col gap-1.5" data-testid="messages-dm-list">
          {dmHandles.length === 0 && (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--lko-green-soft)] text-xl" aria-hidden>🤝</span>
              <p className="mt-2 text-[12px] font-bold">Your paddies go show here.</p>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]">Add people for the Connect app — the thread go open itself.</p>
            </div>
          )}
          {dmHandles.map((h) => (
            <button
              key={h}
              onClick={() => { onOpenDmChange(h); markDmRead(h) }}
              className="lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left"
            >
              <span className="min-w-0">
                <span className="block text-[12.5px] font-extrabold">@{h}</span>
                <span className="block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                  {dms[h]?.length ? dms[h][dms[h].length - 1].text : 'New paddy — talk first'}
                </span>
              </span>
              {!!unread[h] && (
                <span data-testid={`messages-unread-${h}`} className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--lko-terra)] px-1.5 text-[10px] font-black text-white">
                  {unread[h]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const WHY_LABEL: Record<string, string> = {
  'guest-mic-dark': 'Claim your name first — the mic dey dark for guests.',
  'kid-text-refused': 'Kids talk with emotes only — pick one for the grid.',
  'word-wall': 'That word no dey pass the teen wall.',
  'no-links-ever': 'No links, no numbers, no wallet address — the wire no carry am.',
  'too-long': 'Too long — trim am down.',
  'empty': 'Empty message no dey fly.',
  'too-fast': 'Easy o — the wire dey cap speed. Wait small make e reset.',
  'wire-down': 'The wire drop — the relay lane don take over.',
  'wire-slow': 'The wire slow — try again small.',
  'bad-emote': 'That emote no dey the lexicon.',
}
