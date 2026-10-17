'use client'

/**
 * LOKOJA LIFE — M24 W5: CONNECT (the nation's social graph face)
 * ---------------------------------------------------------------
 * TWO TRUTHS, BOTH LABELED (the honesty law of the whole wave):
 *  - NATION PADDIES: the SERVER's FriendRow graph — requests, blocks and
 *    paddies are true on every device, delivered by the live wire ack
 *    (instant) or the 12s relay door (degraded lane, N10), plus the
 *    wire:social PUSH lane (a request lands on you the moment it's sent).
 *  - DEVICE PADDIES: the social-store's own rows — labeled "on this
 *    device", exactly what they always were. Nothing pretends.
 *
 * THE BLOCK LAW is server truth now: a blocked handle receives NOTHING
 * through the door — the wire refuses their DMs with the real why.
 * THE REPORT LAW: 🚩 files evidence into the union's queue (W12 console
 * reads it); nothing automatic happens to the reported handle.
 * THE KID WALL is server law: minors DM accepted paddies only.
 */

import { useEffect, useState } from 'react'
import { NPCS } from '@/game/data/npcs'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'
import { useWireStore, wireEnsure } from '@/game/systems/wire'
import {
  useSocialNetStore, socialNetInit, socialNetSync,
  socialNetAdd, socialNetAccept, socialNetDecline,
  socialNetRemove, socialNetBlock, socialNetUnblock, socialNetReport,
} from '@/game/systems/socialnet'
import { REPORT_REASONS } from '@/game/systems/socialgraph'

type Tab = 'paddies' | 'requests' | 'find'

const REASON_LABEL: Record<string, string> = {
  'bad-handle': 'That name no fit the register shape.',
  self: 'Na you be that 😄',
  'no-such-paddy': 'Nobody claim that name yet.',
  already: '@ dem dey your paddies already.',
  'already-sent': 'Your request don dey wait — patience.',
  'they-blocked-you': 'Dem block you — the door no open.',
  'you-blocked-them': 'You block dem — unblock first.',
  'not-requested': 'No request dey wait there.',
  'not-friends': 'You no be paddies with dem.',
  'paddies-only': 'Minors waka with paddies only — na the law.',
  blocked: 'Dem block you.',
  unclaimed: 'Claim your name first.',
}

export function ConnectApp({ onOpenDm }: { onOpenDm: (handle: string) => void }) {
  const [tab, setTab] = useState<Tab>('paddies')
  const [handle, setHandle] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [reporting, setReporting] = useState<string | null>(null)

  const account = useGameStore((s) => s.account)
  const wire = useGameStore((s) => s.liveWire)

  // THE WIRE — live roster lane (W4) + the nation graph sync (W5)
  const wireState = useWireStore((s) => s.state)
  const wireRoster = useWireStore((s) => s.roster)
  const wireLive = wireState === 'live'
  useEffect(() => {
    wireEnsure(
      () => useGameStore.getState().account.token ?? null,
      () => ({ street: useGameStore.getState().world?.currentLocation ?? 'home', status: 'hustling' }),
    )
  }, [account.linked, account.token])

  // W5: the nation graph — push listener registered once, graph synced on
  // open and whenever the lane flips (wire connect / token rotation)
  const netLane = useSocialNetStore((s) => s.lane)
  const netSyncedAt = useSocialNetStore((s) => s.syncedAt)
  useEffect(() => {
    socialNetInit()
    void socialNetSync()
  }, [account.linked, account.token, wireState])

  const friends = useSocialStore((s) => s.friends)
  const requests = useSocialStore((s) => s.requests)
  const blocked = useSocialStore((s) => s.blocked)
  const addFriend = useSocialStore((s) => s.addFriend)
  const acceptRequest = useSocialStore((s) => s.acceptRequest)
  const declineRequest = useSocialStore((s) => s.declineRequest)
  const removeFriend = useSocialStore((s) => s.removeFriend)
  const blockHandle = useSocialStore((s) => s.blockHandle)
  const unblockHandle = useSocialStore((s) => s.unblockHandle)

  const netFriends = useSocialNetStore((s) => s.friends)
  const netIn = useSocialNetStore((s) => s.inReqs)
  const netOut = useSocialNetStore((s) => s.outReqs)
  const netBlocked = useSocialNetStore((s) => s.blocked)

  const me = account.handle
  const rosterRows = wireLive ? wireRoster : (wire?.roster ?? [])
  const onlineHandles = new Set(rosterRows.map((r) => r.handle))
  const netFriendHandles = netFriends.map((f) => f.handle)
  const online = rosterRows
    .map((r) => r.handle)
    .filter((h) => h && h !== me && !blocked.includes(h) && !netFriendHandles.includes(h) && !friends.includes(h))
  const inReqs = requests.filter((r) => r.dir === 'in')
  const outReqs = requests.filter((r) => r.dir === 'out')
  const suggestions = NPCS.slice(0, 6).filter((n) => !friends.includes(n.name) && !blocked.includes(n.name))

  const tryAdd = async (h: string) => {
    const res = await socialNetAdd(h)
    if (res.ok) {
      setNotice(res.state === 'friend' ? `@${h} na your paddy now 🤝 (nation truth)` : `Request fly reach @${h} — waiting for dem.`)
      setHandle('')
    } else {
      setNotice(`@${h}: ${REASON_LABEL[res.why ?? ''] ?? res.why ?? 'the door no gree.'}`)
    }
  }

  const laneLabel = !account.linked
    ? 'Claim your name — the nation graph dey wait.'
    : netLane === 'wire'
      ? '● Nation graph rides the LIVE WIRE — paddies, requests and blocks true everywhere.'
      : netLane === 'relay'
        ? 'Nation graph rides the ~12s relay lane (the wire dey down). Same rows, same laws.'
        : 'The nation graph never synced yet — open go retry.'

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/[0.05] p-1">
        {([['paddies', `🤝 Paddies${netFriends.length || friends.length ? ` (${netFriends.length + friends.length})` : ''}`], ['requests', `📥 Requests${netIn.length || inReqs.length ? ` (${netIn.length + inReqs.length})` : ''}`], ['find', '🔍 Find']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`lko-press rounded-lg px-1 py-1.5 text-[10.5px] font-extrabold ${tab === k ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`}>
            {label}
          </button>
        ))}
      </div>
      <p className="px-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]" data-testid="connect-lane">
        {laneLabel}
      </p>

      {tab === 'paddies' && (
        <div className="flex flex-col gap-1.5" data-testid="connect-paddies">
          {netFriends.length === 0 && friends.length === 0 && (
            <p className="rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
              No paddy yet — check Find. The city full of people.
            </p>
          )}
          {netFriends.length > 0 && (
            <p className="px-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Nation paddies (server truth)</p>
          )}
          {netFriends.map((f) => (
            <div key={f.handle} className="flex items-center justify-between rounded-2xl border border-[var(--lko-green)]/20 bg-white px-3 py-2.5" data-testid={`connect-net-paddy-${f.handle}`}>
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-extrabold">@{f.handle}</span>
                {onlineHandles.has(f.handle)
                  ? <span className="text-[9.5px] font-black text-[var(--lko-green-deep)]">● online now</span>
                  : <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">offline</span>}
              </span>
              <span className="flex shrink-0 gap-1.5">
                <button onClick={() => onOpenDm(f.handle)} className="lko-press rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]" aria-label={`Message ${f.handle}`}>💬</button>
                <button onClick={async () => { const r = await socialNetRemove(f.handle); setNotice(r.ok ? `@${f.handle} comot from nation paddies.` : REASON_LABEL[r.why ?? ''] ?? 'no gree') }} className="lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]" aria-label={`Remove ${f.handle}`}>✕</button>
                <button onClick={() => setReporting(reporting === f.handle ? null : f.handle)} className="lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]" aria-label={`Report ${f.handle}`}>🚩</button>
                <button onClick={async () => { const r = await socialNetBlock(f.handle); setNotice(r.ok ? `@${f.handle} block — nation law: dem no fit reach you again.` : REASON_LABEL[r.why ?? ''] ?? 'no gree') }} className="lko-press rounded-full bg-[#fdecea] px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]" aria-label={`Block ${f.handle}`}>🚫</button>
              </span>
            </div>
          ))}
          {friends.length > 0 && (
            <p className="px-1 pt-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">On this device (street paddies)</p>
          )}
          {friends.map((f) => (
            <div key={f} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white/70 px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-extrabold">{f}</span>
                {onlineHandles.has(f) && <span className="text-[9.5px] font-black text-[var(--lko-green-deep)]">● online now</span>}
              </span>
              <span className="flex shrink-0 gap-1.5">
                <button onClick={() => onOpenDm(f)} className="lko-press rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]" aria-label={`Message ${f}`}>💬</button>
                <button onClick={() => { removeFriend(f); setNotice(`${f} comot from device paddies.`) }} className="lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]" aria-label={`Remove ${f}`}>✕</button>
                <button onClick={() => { blockHandle(f); setNotice(`${f} block on this device.`) }} className="lko-press rounded-full bg-[#fdecea] px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]" aria-label={`Block ${f}`}>🚫</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div className="flex flex-col gap-1.5" data-testid="connect-requests">
          {netIn.length === 0 && netOut.length === 0 && inReqs.length === 0 && outReqs.length === 0 && (
            <p className="rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
              No request dey wait. When somebody wan be your paddy, e go land here — instantly.
            </p>
          )}
          {netIn.length > 0 && <p className="px-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Nation requests (server truth)</p>}
          {netIn.map((r) => (
            <div key={r.handle} className="flex items-center justify-between rounded-2xl border border-[var(--lko-green)]/20 bg-white px-3 py-2.5" data-testid={`connect-net-in-${r.handle}`}>
              <span className="text-[12.5px] font-extrabold">@{r.handle}</span>
              <span className="flex gap-1.5">
                <button data-testid={`connect-accept-${r.handle}`} onClick={async () => { const res = await socialNetAccept(r.handle); setNotice(res.ok ? `@${r.handle} na your paddy now 🤝` : REASON_LABEL[res.why ?? ''] ?? 'no gree') }} className="lko-press rounded-full bg-[var(--lko-green)] px-3 py-1 text-[10px] font-extrabold text-white">Accept</button>
                <button onClick={async () => { const res = await socialNetDecline(r.handle); setNotice(res.ok ? `@${r.handle} request comot.` : 'no gree') }} className="lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">Nah</button>
              </span>
            </div>
          ))}
          {netOut.map((r) => (
            <div key={r.handle} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white/70 px-3 py-2.5">
              <span className="text-[12px] font-bold text-[var(--lko-ink-soft)]">@{r.handle}</span>
              <span className="text-[10px] font-black uppercase text-[var(--lko-ink-soft)]">waiting…</span>
            </div>
          ))}
          {(inReqs.length > 0 || outReqs.length > 0) && (
            <p className="px-1 pt-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">On this device</p>
          )}
          {inReqs.map((r) => (
            <div key={r.handle} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5">
              <span className="text-[12.5px] font-extrabold">{r.handle}</span>
              <span className="flex gap-1.5">
                <button onClick={() => { acceptRequest(r.handle); setNotice(`${r.handle} na device paddy now.`) }} className="lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">Accept</button>
                <button onClick={() => declineRequest(r.handle)} className="lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">Nah</button>
              </span>
            </div>
          ))}
          {outReqs.map((r) => (
            <div key={r.handle} className="flex items-center justify-between rounded-2xl bg-white/50 px-3 py-2.5">
              <span className="text-[12px] font-bold text-[var(--lko-ink-soft)]">{r.handle}</span>
              <span className="text-[10px] font-black uppercase text-[var(--lko-ink-soft)]">waiting…</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'find' && (
        <div className="flex flex-col gap-2" data-testid="connect-find">
          <div className="flex gap-1.5">
            <input
              data-testid="connect-add-input"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              maxLength={16}
              placeholder="Add by handle — e.g. ada_hustle"
              className="min-w-0 flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
            />
            <button data-testid="connect-add-btn" onClick={() => void tryAdd(handle)} className="lko-press rounded-xl bg-[var(--lko-green)] px-4 py-2 text-[12px] font-extrabold text-white">Add</button>
          </div>

          {online.length > 0 && (
            <>
              <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">
                Online now ({wireLive ? 'live wire' : 'relay'})
              </p>
              {online.map((h) => (
                <div key={h} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5">
                  <span className="text-[12.5px] font-extrabold">@{h} <span className="text-[9.5px] font-black text-[var(--lko-green-deep)]">● online</span></span>
                  <button onClick={() => void tryAdd(h)} className="lko-press rounded-full bg-[var(--lko-green-soft)] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">+ Paddy</button>
                </div>
              ))}
            </>
          )}

          <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Street suggestions <span className="font-bold normal-case">(na NPC — device paddies)</span></p>
          {suggestions.map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5">
              <span className="text-[12.5px] font-extrabold">{n.name}</span>
              <button onClick={() => { const res = addFriend(n.name); setNotice(res.ok ? `${n.name} enter your device paddies.` : 'no gree') }} className="lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">+ Paddy</button>
            </div>
          ))}
        </div>
      )}

      {reporting && (
        <div className="rounded-2xl border border-[#f3c8c4] bg-[#fdf1f0] p-2.5" data-testid="connect-report">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#a63d33]">🚩 Report @{reporting} — evidence for the union</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {REPORT_REASONS.map((reason) => (
              <button key={reason}
                onClick={async () => { const r = await socialNetReport(reporting, reason); setReporting(null); setNotice(r.ok ? `Report land — the union go review @${reporting}.` : 'no gree') }}
                className="lko-press rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]">
                {reason}
              </button>
            ))}
            <button onClick={() => setReporting(null)} className="lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">cancel</button>
          </div>
        </div>
      )}

      {(netBlocked.length > 0 || blocked.length > 0) && (
        <div className="rounded-2xl border border-[#f3c8c4] bg-[#fdf1f0] p-2.5" data-testid="connect-blocked">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#a63d33]">🚫 Block wall — dem no fit reach you</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {netBlocked.map((b) => (
              <button key={b} onClick={async () => { const r = await socialNetUnblock(b); setNotice(r.ok ? `@${b} unblocked — nation law.` : 'no gree') }} className="lko-press rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]">
                @{b} ✕
              </button>
            ))}
            {blocked.map((b) => (
              <button key={b} onClick={() => { unblockHandle(b); setNotice(`${b} unblocked on this device.`) }} className="lko-press rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]">
                {b} ✕ <span className="text-[8px] font-bold">(device)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {notice && <p className="px-1 text-[10.5px] font-bold text-[var(--lko-green-deep)]">{notice}</p>}
      {!!netSyncedAt && (
        <p className="px-1 text-[8.5px] font-bold text-[var(--lko-ink-soft)] opacity-70">
          graph synced {new Date(netSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      )}
    </div>
  )
}
