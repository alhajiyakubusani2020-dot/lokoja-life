'use client'

/**
 * LOKOJA LIFE — LiveApp (M17: THE LIVE NATION + M21: THE LIVING ROOM)
 * ------------------------------------------------------------------
 * The phone's live wire: the street roster, the tiered chat (kid
 * emotes / teen wall / adult links-law), the join-postcard, the
 * stream board (viewers-as-crowd), the co-op unions (sealed treasuries,
 * the two-key law, the Market Union court) and the real-player ajo
 * circles (the ladder, the panic, the court guarantee).
 *
 * M21 — THE ROOM sits pinned at the top: the REAL roster of whoever
 * is standing on your street right now (presence TTL honored), the
 * honest empty state, the SIM crowd line (labeled, muted, separate —
 * the ONLY sanctioned way the NPC crowd shows), a room-scoped mic
 * riding the SAME liveSendChat/law path, and — adults only — the
 * SPRAY: real ₦ through the store's honest engine, broadcast on the
 * room's street channel. THE PRIME LAW: this screen never fakes a
 * person; the roster is real presence, the crowd is clearly (sim).
 *
 * This UI never simulates: every move rides the store's live actions,
 * the relay books the truth, and the local engines move the local
 * naira. THE IDENTITY LAW shows itself here: an unclaimed guest sees
 * the nation but the mic stays dark until claim.
 */

import { useCallback, useEffect, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { EMOTE_LIBRARY, type LiveIdentity } from '@/game/systems/live'
import {
  crowdNote, roomChannel, roomRoster, sprayAllowed, sprayEvent,
  wireToPresences, SPRAY_MIN, SPRAY_STEP, type WirePresenceRow,
} from '@/game/systems/liveRoom'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { formatNaira } from '@/game/systems/progression'

type Tab = 'street' | 'streams' | 'union' | 'ajo'

const TABS: { key: Tab; label: string }[] = [
  { key: 'street', label: 'Street' },
  { key: 'streams', label: 'Live' },
  { key: 'union', label: 'Union' },
  { key: 'ajo', label: 'Ajo' },
]

interface RosterRow { handle: string; band: string; street: string; status: string }
interface WireEvent { seq: number; kind: string; actor: string; payload: Record<string, unknown>; channel?: string }
interface StreamRow { id: string; host: string; kind: string; title: string; viewers: number }
interface TradeRow { id: string; fromHandle: string; giveCash: number; wantCash: number; terms: string }

/** the spray notes the room offers — every one a lawful ₦100 multiple inside the bounds */
const SPRAY_TIERS: number[] = [1, 5, 10, 50].map((k) => k * SPRAY_STEP)

export function LiveApp() {
  const [tab, setTab] = useState<Tab>('street')
  const [draft, setDraft] = useState('')
  const [roomDraft, setRoomDraft] = useState('')
  const [sprayAmt, setSprayAmt] = useState(SPRAY_TIERS[0] ?? SPRAY_MIN)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const account = useGameStore((s) => s.account)
  const live = useGameStore((s) => s.live)
  const wire = useGameStore((s) => s.liveWire)
  const liveSync = useGameStore((s) => s.liveSync)
  const liveSendChat = useGameStore((s) => s.liveSendChat)
  const liveSendEmote = useGameStore((s) => s.liveSendEmote)
  const liveAction = useGameStore((s) => s.liveAction)
  const liveShareJoin = useGameStore((s) => s.liveShareJoin)
  const liveToggleVoice = useGameStore((s) => s.liveToggleVoice)
  const removeMoney = useGameStore((s) => s.removeMoney)
  const addMoney = useGameStore((s) => s.addMoney)
  const nationSnapshot = useGameStore((s) => s.nationSnapshot)

  const claimed = account.linked && !!account.token
  const band = (account.ageBand ?? 'adult') as 'kid' | 'teen' | 'adult'

  const sync = useCallback(async () => {
    const res = await liveSync()
    if (!res.ok && res.why !== 'unclaimed' && res.why !== 'offline — the nation waits') {
      setNotice(res.why ?? null)
    }
  }, [liveSync])

  // the heartbeat: sync on open + every 12s while the app is open
  useEffect(() => {
    if (!claimed) return
    const first = setTimeout(() => { void sync() }, 0)
    const t = setInterval(() => { void sync() }, 12_000)
    return () => { clearTimeout(first); clearInterval(t) }
  }, [claimed, sync])

  if (!player || !world) return null

  const roster = (wire?.roster ?? []).filter((r) => r.handle !== account.handle)
  const events = (wire?.events ?? []).filter((e) => e.kind === 'chat' || e.kind === 'emote' || e.kind === 'join' || e.kind === 'stream' || e.kind === 'court')

  /* ------------------ M21 — THE ROOM (who dey here NOW) ------------------
   * keyed by the SAME location id the presence ping sends, TTL honored
   * by the pure law, refreshed by the SAME 12s heartbeat — zero new
   * timers. The sim crowd is a separate, labeled number. */
  const locId = world.currentLocation
  const locName = LOCATION_BY_ID[locId]?.name ?? locId
  const roomChannelId = roomChannel(locId)
  const nowMs = Date.now()
  const roomPresences = wireToPresences((wire?.roster ?? []) as WirePresenceRow[], nowMs)
  const roomAll = roomRoster(roomPresences, locId, nowMs)
  const roomOthers = roomAll.filter((r) => r.handle !== account.handle)
  const roomEvents = ((wire?.events ?? []) as WireEvent[])
    .filter((e) => e.channel === roomChannelId && (e.kind === 'chat' || e.kind === 'emote'))
  const simCrowd = nationSnapshot?.districts.find((d) => d.id === locId)?.pop ?? 0
  const sprayOk = sprayAllowed({ handle: account.handle, band } satisfies LiveIdentity, player.cash)

  const say = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(null), 3200)
  }

  const send = async () => {
    if (!draft.trim() || busy) return
    setBusy(true)
    const res = await liveSendChat(draft)
    setBusy(false)
    if (!res.ok) say(res.why === 'word-wall' ? 'The Union moderators no gree that word.' : res.why === 'too-long' ? 'Too long — shorten am.' : res.why ?? 'no gree')
    else setDraft('')
  }

  // the ROOM mic — the SAME liveSendChat door, the room's street channel;
  // the M17 tier laws ride inside the action (never bypassed)
  const sendRoom = async () => {
    if (!roomDraft.trim() || busy) return
    setBusy(true)
    const res = await liveSendChat(roomDraft, roomChannelId)
    setBusy(false)
    if (!res.ok) say(res.why === 'word-wall' ? 'The Union moderators no gree that word.' : res.why === 'too-long' ? 'Too long — shorten am.' : res.why ?? 'no gree')
    else setRoomDraft('')
  }

  // THE SPRAY (adult money table): real ₦ through the store's honest
  // engine, the moment broadcast on the room channel. Pay → broadcast;
  // a wire that refuses gets its naira back — no unbacked broadcast.
  const doSpray = async () => {
    if (!claimed || busy) return
    if (!sprayOk) { say('Money spray na adult table — and your pocket must reach ₦100.'); return }
    if (player.cash < sprayAmt) { say('Pocket no reach that note — pick smaller.'); return }
    const spray = sprayEvent(account.handle ?? 'me', locId, sprayAmt, world.day)
    if (!spray.ok) { say(spray.why === 'not-multiple' ? 'Spray na ₦100 notes only.' : 'That spray no fit the room law.'); return }
    setBusy(true)
    const paid = removeMoney(sprayAmt, { label: `money spray — ${locName}`, category: 'fun' })
    if (!paid) { setBusy(false); say('Pocket no reach — the spray no pass.'); return }
    const res = await liveSendChat(spray.text, spray.channel)
    setBusy(false)
    if (!res.ok) {
      addMoney(sprayAmt, { label: 'spray refund — the wire no gree', category: 'fun' })
      say(`The wire no gree — ₦${sprayAmt.toLocaleString('en-US')} don return to your pocket.`)
      return
    }
    useGameStore.getState().notify({ icon: '💰', text: `₦${sprayAmt.toLocaleString('en-US')} spray — the room see am!`, tone: 'good' })
  }

  return (
    <div className="flex h-full flex-col" data-testid="live-app">
      {/* header */}
      <div className="flex items-center justify-between px-4 pb-2 pt-1">
        <div>
          <p className="text-[15px] font-black leading-tight">Live Nation</p>
          <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
            {claimed ? `${roster.length + 1} walker${roster.length ? 's' : ''} dey the wire` : 'Spectator view — claim your name to talk'}
          </p>
        </div>
        <button
          data-testid="live-voice"
          onClick={() => { liveToggleVoice(); }}
          className={`lko-press rounded-full px-2.5 py-1 text-[10px] font-extrabold ${live?.voiceOn ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.06] text-[var(--lko-ink-soft)]'}`}
          aria-label="Toggle proximity voice (adults only)"
        >
          🎙️ {live?.voiceOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* ------------- M21 — THE ROOM: who dey here now (pinned) ------------- */}
      <div className="mx-4 mb-2 rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="live-room">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[12.5px] font-black">📍 {locName} — who dey here now</p>
          <p className="shrink-0 text-[9.5px] font-extrabold uppercase tracking-[0.06em] text-[var(--lko-ink-soft)]">
            {roomOthers.length > 0 ? `${roomOthers.length} real walker${roomOthers.length > 1 ? 's' : ''}` : 'real presence'}
          </p>
        </div>

        {roomOthers.length === 0 ? (
          <p className="mt-1 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]" data-testid="live-room-empty">
            Just you here now — real players show up here when dem enter your street.
          </p>
        ) : (
          <ul className="mt-1.5 max-h-24 space-y-1 overflow-y-auto" data-testid="live-room-roster">
            {roomOthers.map((r) => (
              <li key={r.handle} className="flex items-center justify-between text-[12px] font-bold">
                <span>{r.band === 'kid' ? '🧒' : r.band === 'teen' ? '🧑' : '🧍'} {r.handle}</span>
                <span className="text-[10px] font-extrabold text-[var(--lko-ink-soft)]">{r.status}</span>
              </li>
            ))}
          </ul>
        )}

        {roomEvents.length > 0 && (
          <div className="mt-1.5 space-y-1" data-testid="live-room-feed">
            {roomEvents.slice(-3).map((e) => (
              <p key={e.seq} className="rounded-lg bg-black/[0.03] px-2 py-1 text-[10.5px] font-semibold">
                {e.kind === 'emote'
                  ? <span><b>{e.actor}</b> <span aria-hidden>{String(e.payload.glyph ?? '👋')}</span> {String(e.payload.phrase ?? '')}</span>
                  : <span><b>{e.actor}</b>: {String(e.payload.text ?? '')}</span>}
              </p>
            ))}
          </div>
        )}

        {/* the SIM crowd — muted, smaller, separate: the roster above is the real one */}
        <p className="mt-1.5 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]" data-testid="live-room-sim">
          {crowdNote(simCrowd)} · the roster na real people — the crowd na simulation.
        </p>

        {/* the room mic — the SAME tiered laws on the room channel */}
        {claimed && (band === 'teen' || band === 'adult') ? (
          <div className="mt-2 flex gap-2">
            <input
              data-testid="live-room-composer"
              value={roomDraft}
              onChange={(e) => setRoomDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') void sendRoom() }}
              maxLength={band === 'teen' ? 140 : 280}
              placeholder={band === 'teen' ? 'Talk to the room (moderated, 140)' : 'Talk to the room (no links — the law)'}
              className="min-w-0 flex-1 rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none"
              aria-label="Room chat message"
            />
            <button data-testid="live-room-send" onClick={() => void sendRoom()} disabled={busy}
              className="lko-press rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[11px] font-extrabold text-white">
              Send
            </button>
          </div>
        ) : claimed && band === 'kid' ? (
          <div className="mt-2 grid grid-cols-6 gap-1" data-testid="live-room-emotes">
            {EMOTE_LIBRARY.map((em) => (
              <button key={em.id} onClick={() => void liveSendEmote(em.id, roomChannelId)}
                className="lko-press rounded-lg bg-[var(--lko-green-soft)] py-1 text-center text-[14px]"
                aria-label={`Send room emote: ${em.phrase}`}>
                <span aria-hidden>{em.glyph}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[11px] font-semibold text-[var(--lko-ink-soft)]">🎤 The room mic is dark — claim your name to talk here.</p>
        )}

        {/* THE SPRAY — adult money table ONLY; structurally absent for minors */}
        {claimed && band === 'adult' && (
          <div className="mt-2 border-t border-black/[0.05] pt-2" data-testid="live-room-spray">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.06em] text-[var(--lko-ink-soft)]">🧺 Spray — real ₦, the room sees am</p>
              <div className="flex gap-1">
                {SPRAY_TIERS.map((a) => (
                  <button key={a} onClick={() => setSprayAmt(a)} aria-label={`Spray amount ₦${a}`}
                    className={`lko-press rounded-lg px-1.5 py-0.5 text-[9.5px] font-extrabold ${sprayAmt === a ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`}>
                    {a >= 1000 ? `₦${a / 1000}k` : `₦${a}`}
                  </button>
                ))}
              </div>
            </div>
            <button
              data-testid="live-room-spray-fire"
              disabled={busy || !sprayOk || player.cash < sprayAmt}
              onClick={() => void doSpray()}
              title={player.cash < sprayAmt ? 'Your pocket no reach this note — pick smaller' : 'Real naira leaves your pocket — the broadcast carries the truth'}
              className="lko-press mt-1.5 w-full rounded-xl bg-[var(--lko-amber)] py-1.5 text-[10.5px] font-black text-[#1a1e18] disabled:opacity-40"
            >
              Spray {formatNaira(sprayAmt)} for {locName}
            </button>
          </div>
        )}
      </div>

      {/* tabs */}
      <div className="flex gap-1 px-4 pb-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`lko-press flex-1 rounded-xl py-1.5 text-[11px] font-extrabold ${tab === t.key ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`}
            aria-label={`Live tab: ${t.label}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {notice && (
        <p className="mx-4 mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800" role="status">{notice}</p>
      )}

      {!claimed && (
        <div className="mx-4 mb-2 rounded-2xl border border-dashed border-[var(--lko-green)]/40 bg-[var(--lko-green-soft)]/60 p-3" data-testid="live-spectate">
          <p className="text-[12px] font-extrabold">👁️ Spectator view</p>
          <p className="mt-0.5 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
            The nation moves in front of you — but the mic stays dark and the money tables stay shut until you claim your name. No new signup: your name, one PIN.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* ------------------------------- STREET ------------------------------- */}
        {tab === 'street' && (
          <div className="space-y-2">
            {/* the roster */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="live-roster">
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Who dey around</p>
              {roster.length === 0 ? (
                <p className="mt-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]">The wire dey quiet — nobody else don claim yet.</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {roster.map((r: RosterRow) => (
                    <li key={r.handle} className="flex items-center justify-between text-[12px] font-bold">
                      <span>{r.band === 'kid' ? '🧒' : r.band === 'teen' ? '🧑' : '🧍'} {r.handle}</span>
                      <span className="text-[10px] font-extrabold text-[var(--lko-ink-soft)]">{r.status} · {r.street}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* the wire */}
            <div className="space-y-1.5" data-testid="live-feed">
              {events.length === 0 && (
                <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]">No talk yet — be the first voice on the wire.</p>
              )}
              {events.slice(-24).map((e: WireEvent) => (
                <div key={e.seq} className="rounded-2xl border border-black/[0.06] bg-white px-3 py-1.5 text-[12px] font-semibold">
                  {e.kind === 'emote' && <span><b>{e.actor}</b> <span aria-hidden>{String(e.payload.glyph ?? '👋')}</span> {String(e.payload.phrase ?? '')}</span>}
                  {e.kind === 'chat' && <span><b>{e.actor}</b>: {String(e.payload.text ?? '')}</span>}
                  {e.kind === 'join' && <span>📍 <b>{e.actor}</b> share <b>{String(e.payload.street ?? '')}</b> — the postcard dey fly (free arrival)</span>}
                  {e.kind === 'stream' && <span>📡 <b>{e.actor}</b> {e.payload.live === false ? 'close' : 'open'} <b>{String(e.payload.title ?? 'a stream')}</b>{typeof e.payload.viewers === 'number' ? ` — ${e.payload.viewers} watched` : ''}</span>}
                  {e.kind === 'court' && <span>⚖️ <b>Market Union Court</b>: {String(e.payload.verdict ?? e.payload.defaulter ?? 'verdict')} {e.payload.fine ? `— fine ₦${Number(e.payload.fine).toLocaleString()}` : ''}</span>}
                </div>
              ))}
            </div>

            {/* the composer — THE TIERED MIC */}
            <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
              {claimed && (band === 'teen' || band === 'adult') ? (
                <div className="flex gap-2">
                  <input
                    data-testid="live-composer"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') void send() }}
                    maxLength={band === 'teen' ? 140 : 280}
                    placeholder={band === 'teen' ? 'Talk (moderated, 140)' : 'Talk (no links — the law)'}
                    className="min-w-0 flex-1 rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none"
                    aria-label="Chat message"
                  />
                  <button data-testid="live-send" onClick={() => void send()} disabled={busy}
                    className="lko-press rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[11px] font-extrabold text-white">
                    Send
                  </button>
                </div>
              ) : claimed && band === 'kid' ? (
                <div>
                  <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Your words — the shield lexicon</p>
                  <div className="grid grid-cols-4 gap-1.5" data-testid="live-emote-grid">
                    {EMOTE_LIBRARY.map((em) => (
                      <button key={em.id} onClick={() => void liveSendEmote(em.id)}
                        className="lko-press rounded-xl bg-[var(--lko-green-soft)] px-1 py-1.5 text-center" aria-label={`Send emote: ${em.phrase}`}>
                        <span className="block text-[16px]" aria-hidden>{em.glyph}</span>
                        <span className="block text-[8.5px] font-extrabold text-[var(--lko-green-deep)]">{em.phrase}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] font-semibold text-[var(--lko-ink-soft)]">🎤 The mic is dark — claim your name to talk.</p>
              )}
            </div>

            {/* the join-postcard */}
            <JoinCard onShare={async () => {
              const { shareTeleport } = useGameStore.getState()
              const res = await shareTeleport()
              if (!res.ok) { say(res.why ?? 'no gree'); return }
              const url = res.url ?? ''
              const code = url.split('/t/')[1]?.split(/[?#]/)[0] ?? ''
              if (!code) { say('postcard no mint'); return }
              const j = await liveShareJoin(code)
              if (j.ok) say('📍 Your street don enter the wire — arrival na free!')
            }} />
          </div>
        )}

        {/* ------------------------------- STREAMS ------------------------------ */}
        {tab === 'street' ? null : tab === 'streams' && (
          <StreamsTab liveAction={liveAction} claimed={claimed} onNotice={say} band={band} />
        )}

        {/* -------------------------------- UNION ------------------------------- */}
        {tab === 'union' && (
          <UnionTab liveAction={liveAction} claimed={claimed} band={band} onNotice={say}
            assocId={live?.assocId ?? null} day={world.day} />
        )}

        {/* --------------------------------- AJO -------------------------------- */}
        {tab === 'ajo' && (
          <AjoTab liveAction={liveAction} claimed={claimed} band={band} onNotice={say}
            circles={live?.circles ?? []} day={world.day} cash={player.cash} />
        )}
      </div>
    </div>
  )
}

/* ------------------------------ the join card ------------------------------ */

function JoinCard({ onShare }: { onShare: () => void }) {
  return (
    <button
      data-testid="live-join-share"
      onClick={onShare}
      className="lko-press w-full rounded-2xl border border-[var(--lko-green)]/30 bg-[var(--lko-green-soft)] p-3 text-left"
    >
      <p className="text-[12px] font-black">📍 Call the nation to your street</p>
      <p className="mt-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
        Your postcard dey fly on the live wire — anybody wey click go land for your street FREE (no fare, no bus).
      </p>
    </button>
  )
}

/* ------------------------------ the streams tab ---------------------------- */

function StreamsTab({ liveAction, claimed, onNotice, band }: {
  liveAction: (a: string, p?: Record<string, unknown>) => Promise<{ ok: boolean; why?: string } & Record<string, unknown>>
  claimed: boolean
  onNotice: (m: string) => void
  band: string
}) {
  const [streams, setStreams] = useState<StreamRow[]>([])
  const [kind, setKind] = useState<'stall' | 'regatta' | 'wedding'>('stall')

  const load = useCallback(async () => {
    const res = await liveAction('streams')
    if (res.ok) setStreams((res.streams as StreamRow[]) ?? [])
  }, [liveAction])
  useEffect(() => {
    if (!claimed) return
    const t = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(t)
  }, [claimed, load])

  const open = async () => {
    const { liveOpenStream } = useGameStore.getState()
    const res = await liveOpenStream(kind, `${useGameStore.getState().player?.name ?? 'Me'}'s ${kind}`)
    if (!res.ok) { onNotice(res.why ?? 'no gree'); return }
    onNotice('📡 You dey live! Every viewer na one more body for your crowd.')
    void load()
  }

  return (
    <div className="space-y-2" data-testid="live-streams">
      {claimed && band === 'adult' && (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Go live — viewers na crowd</p>
          <div className="mt-2 flex gap-1.5">
            {(['stall', 'regatta', 'wedding'] as const).map((k) => (
              <button key={k} onClick={() => setKind(k)}
                className={`lko-press flex-1 rounded-xl py-1.5 text-[10px] font-extrabold capitalize ${kind === k ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05]'}`}>
                {k}
              </button>
            ))}
          </div>
          <button data-testid="live-stream-open" onClick={() => void open()}
            className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-amber)] py-2 text-[11px] font-black text-[#1a1e18]">
            📡 Start the broadcast
          </button>
          <p className="mt-1 text-[10px] font-bold text-[var(--lko-ink-soft)]">Each viewer pays ×1.25% extra crowd — cap ×1.5. The crowd dey real.</p>
        </div>
      )}
      {streams.length === 0 ? (
        <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]">Nobody dey live now. The city broadcasts (the address, election night) go appear here.</p>
      ) : (
        streams.map((s) => (
          <div key={s.id} className="rounded-2xl border border-black/[0.06] bg-white p-3">
            <p className="text-[12px] font-black">📡 {s.title}</p>
            <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">{s.host} · {s.kind} · 👁️ {s.viewers} viewers (crowd ×{(1 + Math.min(s.viewers, 40) * 0.0125).toFixed(2)})</p>
            <button data-testid={`live-stream-watch-${s.id}`}
              onClick={async () => {
                const { liveViewStream } = useGameStore.getState()
                const r = await liveViewStream(s.id)
                if (r.ok) { onNotice(`You dey watch ${s.title} — you don join the crowd.`); void load() }
                else onNotice(r.why ?? 'no gree')
              }}
              className="lko-press mt-1.5 rounded-full bg-[var(--lko-green-soft)] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">
              Watch
            </button>
          </div>
        ))
      )}
    </div>
  )
}

/* ------------------------------- the union tab ----------------------------- */

interface AssocSummary { id: string; name: string; motto: string; founder: string; members: number; treasury: number }

function UnionTab({ liveAction, claimed, band, onNotice, assocId, day }: {
  liveAction: (a: string, p?: Record<string, unknown>) => Promise<{ ok: boolean; why?: string } & Record<string, unknown>>
  claimed: boolean
  band: string
  onNotice: (m: string) => void
  assocId: string | null
  day: number
}) {
  const [assocs, setAssocs] = useState<AssocSummary[]>([])
  const [name, setName] = useState('')
  const [dues, setDues] = useState('500')
  const [cosigner, setCosigner] = useState('')

  const load = useCallback(async () => {
    const res = await liveAction('assocs')
    if (res.ok) setAssocs((res.assocs as AssocSummary[]) ?? [])
  }, [liveAction])
  useEffect(() => {
    if (!claimed || band !== 'adult') return
    const t = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(t)
  }, [claimed, band, load])

  if (!claimed || band !== 'adult') {
    return <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]" data-testid="union-locked">The money tables na adult land — you fit read the room when you grow into am.</p>
  }

  return (
    <div className="space-y-2" data-testid="live-union">
      {!assocId && (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Found a union</p>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={48}
            placeholder="Union name (e.g. Kpata Traders Union)"
            className="mt-1.5 w-full rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none" aria-label="Union name" />
          <button data-testid="live-assoc-found" disabled={name.trim().length < 3}
            onClick={async () => {
              const { liveFoundAssoc } = useGameStore.getState()
              const r = await liveFoundAssoc(name.trim(), 'One hand no fit lift the market')
              if (r.ok) { onNotice('🏛️ Union don stand! The books dey sealed — every kobo chained.'); void load() }
              else onNotice(r.why ?? 'no gree')
            }}
            className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] py-2 text-[11px] font-black text-white disabled:opacity-40">
            Found it (the treasury dey chained)
          </button>
        </div>
      )}
      {assocs.map((a) => (
        <div key={a.id} className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid={`assoc-${a.id}`}>
          <p className="text-[12px] font-black">🏛️ {a.name}</p>
          <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">{a.motto}</p>
          <p className="mt-0.5 text-[11px] font-extrabold">Treasury: {formatNaira(a.treasury)} · {a.members} member{a.members > 1 ? 's' : ''}</p>
          <div className="mt-2 space-y-1.5">
            {assocId === a.id ? (
              <>
                <div className="flex gap-1.5">
                  <input value={dues} onChange={(e) => setDues(e.target.value)} inputMode="numeric" aria-label="Dues amount"
                    className="min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-bold outline-none" />
                  <button data-testid="live-assoc-dues"
                    onClick={async () => {
                      const { livePayDues } = useGameStore.getState()
                      const r = await livePayDues(a.id, Math.max(0, Math.floor(Number(dues) || 0)))
                      if (!r.ok) onNotice(r.why ?? 'no gree')
                      else { onNotice('🤝 Dues land — the chain don grow.'); void load() }
                    }}
                    className="lko-press rounded-xl bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white">Pay dues</button>
                </div>
                <div className="flex gap-1.5">
                  <input value={cosigner} onChange={(e) => setCosigner(e.target.value)} placeholder="co-signer handle" aria-label="Co-signer handle"
                    className="min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-bold outline-none" />
                  <button data-testid="live-assoc-withdraw"
                    onClick={async () => {
                      const { liveWithdrawAssoc } = useGameStore.getState()
                      const r = await liveWithdrawAssoc(a.id, Math.max(0, Math.floor(Number(dues) || 0)), cosigner.trim())
                      if (!r.ok) onNotice(r.why === 'two-key' ? 'Two keys or nothing — the president alone no fit open the books.' : r.why ?? 'no gree')
                      else { void load() }
                    }}
                    className="lko-press rounded-xl bg-amber-500 px-3 py-1.5 text-[10px] font-extrabold text-white">Withdraw</button>
                </div>
                <CourtPanel assocId={a.id} day={day} liveAction={liveAction} onNotice={onNotice} />
              </>
            ) : (
              <button data-testid={`live-assoc-join-${a.id}`}
                onClick={async () => {
                  const { liveJoinAssoc } = useGameStore.getState()
                  const r = await liveJoinAssoc(a.id)
                  if (r.ok) { onNotice(`You don join ${a.name}.`); void load() } else onNotice(r.why ?? 'no gree')
                }}
                className="lko-press w-full rounded-xl bg-[var(--lko-green-soft)] py-1.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]">
                Join the union
              </button>
            )}
          </div>
        </div>
      ))}
      {assocs.length === 0 && <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]">No union yet — be the first to stand one. Treasuries dey sealed: every move na chain link, withdrawals need TWO keys.</p>}
    </div>
  )
}

/* ------------------------------ the court panel ---------------------------- */

function CourtPanel({ assocId, day, liveAction, onNotice }: {
  assocId: string
  day: number
  liveAction: (a: string, p?: Record<string, unknown>) => Promise<{ ok: boolean; why?: string } & Record<string, unknown>>
  onNotice: (m: string) => void
}) {
  const [terms, setTerms] = useState('')
  const [stake, setStake] = useState('1000')
  const [evidence, setEvidence] = useState('')
  const [filed, setFiled] = useState<{ id: string; terms: string; stake: number; status: string }[]>([])

  return (
    <div className="rounded-xl bg-black/[0.03] p-2" data-testid="live-court">
      <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">⚖️ Market Union Court</p>
      <input value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="contract terms (e.g. AjoWealth supply 20 bags monthly)"
        className="mt-1 w-full rounded-lg bg-white px-2 py-1.5 text-[10.5px] font-bold outline-none" aria-label="Contract terms" />
      <div className="mt-1 flex gap-1.5">
        <input value={stake} onChange={(e) => setStake(e.target.value)} inputMode="numeric" aria-label="Stake"
          className="min-w-0 flex-1 rounded-lg bg-white px-2 py-1.5 text-[10.5px] font-bold outline-none" />
        <button data-testid="live-contract-file"
          onClick={async () => {
            const { liveFileContract } = useGameStore.getState()
            const r = await liveFileContract(assocId, terms.trim(), Math.max(0, Math.floor(Number(stake) || 0)), [])
            if (!r.ok) { onNotice(r.why ?? 'no gree'); return }
            const c = (r as { contract?: { id: string; terms: string; stake: number; status: string } }).contract
            if (c) setFiled((f) => [...f, c])
            setTerms('')
            onNotice('📜 Contract file — the stake dey court hand now.')
          }}
          className="lko-press rounded-lg bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white">File</button>
      </div>
      {filed.map((c) => (
        <div key={c.id} className="mt-1.5 rounded-lg bg-white p-2">
          <p className="text-[10.5px] font-bold">📜 {c.terms} — stake {formatNaira(c.stake)}</p>
          {c.status === 'open' && (
            <div className="mt-1 flex gap-1.5">
              <input value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="your evidence" aria-label="Dispute evidence"
                className="min-w-0 flex-1 rounded-lg bg-black/[0.04] px-2 py-1 text-[10px] font-bold outline-none" />
              <button data-testid={`live-dispute-${c.id}`}
                onClick={async () => {
                  const { liveFileDispute } = useGameStore.getState()
                  const r = await liveFileDispute(assocId, c.id, evidence.trim())
                  if (!r.ok) { onNotice(r.why ?? 'no gree'); return }
                  onNotice(r.verdict === 'broken' ? '⚖️ BROKEN — the liable party pays the stake.' : '⚖️ The contract stands.')
                  void evidence
                  void day
                }}
                className="lko-press rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold text-white">Dispute</button>
            </div>
          )}
        </div>
      ))}
      <p className="mt-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">The verdict na hash — deterministic, bribe-proof. Fee ₦200.</p>
    </div>
  )
}

/* ------------------------------- the ajo tab ------------------------------- */

interface CircleSummary { id: string; name: string; contribution: number; members: number; round: number; pot: number; status: string }
interface TradeInbox { trades: TradeRow[] }

function AjoTab({ liveAction, claimed, band, onNotice, circles, day, cash }: {
  liveAction: (a: string, p?: Record<string, unknown>) => Promise<{ ok: boolean; why?: string } & Record<string, unknown>>
  claimed: boolean
  band: string
  onNotice: (m: string) => void
  circles: string[]
  day: number
  cash: number
}) {
  const [list, setList] = useState<CircleSummary[]>([])
  const [inbox, setInbox] = useState<TradeRow[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('1000')

  const load = useCallback(async () => {
    const [a, t] = await Promise.all([liveAction('ajos'), liveAction('trades')])
    if (a.ok) setList((a.circles as CircleSummary[]) ?? [])
    if (t.ok) setInbox(((t as unknown as TradeInbox).trades as TradeRow[]) ?? [])
  }, [liveAction])
  useEffect(() => {
    if (!claimed || band !== 'adult') return
    const t = setTimeout(() => { void load() }, 0)
    return () => clearTimeout(t)
  }, [claimed, band, load])

  if (!claimed || band !== 'adult') {
    return <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]" data-testid="ajo-locked">Ajo circles na adult land — the ladder and the court wait for you.</p>
  }

  return (
    <div className="space-y-2" data-testid="live-ajo">
      <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
        <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Open a circle</p>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={48} placeholder="Circle name (e.g. Market Women Ajo)"
          className="mt-1.5 w-full rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none" aria-label="Circle name" />
        <div className="mt-1.5 flex gap-1.5">
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" aria-label="Contribution"
            className="min-w-0 flex-1 rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none" />
          <button data-testid="live-ajo-found" disabled={name.trim().length < 3 || (Number(amount) || 0) < 100}
            onClick={async () => {
              const { liveFoundAjo } = useGameStore.getState()
              const r = await liveFoundAjo(name.trim(), Math.max(100, Math.floor(Number(amount) || 0)))
              if (r.ok) { onNotice('♻️ Circle don open — the ladder don set.'); void load() }
              else onNotice(r.why ?? 'no gree')
            }}
            className="lko-press rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[11px] font-extrabold text-white disabled:opacity-40">Open</button>
        </div>
      </div>

      {list.map((c) => (
        <div key={c.id} className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid={`circle-${c.id}`}>
          <p className="text-[12px] font-black">♻️ {c.name} {c.status === 'panic' && <span className="ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-black text-red-700">PANIC</span>}</p>
          <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">{formatNaira(c.contribution)} per head · round {c.round} · pot {formatNaira(c.pot)} · {c.members} member{c.members > 1 ? 's' : ''}</p>
          <div className="mt-1.5 flex gap-1.5">
            {!circles.includes(c.id) && (
              <button data-testid={`live-ajo-join-${c.id}`}
                onClick={async () => {
                  const { liveJoinAjo } = useGameStore.getState()
                  const r = await liveJoinAjo(c.id)
                  if (r.ok) { onNotice(`You don enter ${c.name} — your turn go reach.`); void load() } else onNotice(r.why ?? 'no gree')
                }}
                className="lko-press flex-1 rounded-xl bg-[var(--lko-green-soft)] py-1.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]">Join</button>
            )}
            {circles.includes(c.id) && (
              <button data-testid={`live-ajo-pay-${c.id}`} disabled={cash < c.contribution}
                onClick={async () => {
                  const { livePayAjo } = useGameStore.getState()
                  const r = await livePayAjo(c.id)
                  if (!r.ok) onNotice(r.why ?? 'no gree')
                  else { void load() }
                }}
                className="lko-press flex-1 rounded-xl bg-[var(--lko-green)] py-1.5 text-[10px] font-extrabold text-white disabled:opacity-40">Pay {formatNaira(c.contribution)}</button>
            )}
            {c.status === 'panic' && (
              <button data-testid={`live-ajo-court-${c.id}`}
                onClick={async () => {
                  const { liveCourtAjo } = useGameStore.getState()
                  const r = await liveCourtAjo(c.id)
                  if (!r.ok) onNotice(r.why ?? 'no gree')
                  else { onNotice('⚖️ The court don act — the defaulter go pay 1.5×, the round still pay.'); void load() }
                  void day
                }}
                className="lko-press rounded-xl bg-amber-500 px-2.5 py-1.5 text-[10px] font-extrabold text-white">Court</button>
            )}
          </div>
        </div>
      ))}

      {inbox.length > 0 && (
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="trade-inbox">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">Trade offers</p>
          {inbox.map((t) => (
            <div key={t.id} className="mt-1.5 rounded-xl bg-black/[0.03] p-2">
              <p className="text-[11px] font-bold"><b>{t.fromHandle}</b> dey give {formatNaira(t.giveCash)} want {formatNaira(t.wantCash)} — {t.terms}</p>
              <button data-testid={`live-trade-accept-${t.id}`}
                onClick={async () => {
                  const { liveAcceptTrade } = useGameStore.getState()
                  const r = await liveAcceptTrade(t.id)
                  if (!r.ok) onNotice(r.why === 'partner-gone' ? 'The other walker don leave the wire — the trade no fit close.' : r.why ?? 'no gree')
                  else void load()
                }}
                className="lko-press mt-1 rounded-lg bg-[var(--lko-green)] px-3 py-1 text-[10px] font-extrabold text-white">Accept</button>
            </div>
          ))}
        </div>
      )}

      {list.length === 0 && inbox.length === 0 && (
        <p className="rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]">No circle yet, no trade yet. Ajo na trust wey the court carry — miss contribute, the Union fine you 1.5× and the round STILL pays.</p>
      )}
    </div>
  )
}
