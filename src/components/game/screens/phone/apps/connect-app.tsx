'use client'

/**
 * LOKOJA LIFE — M24-UI: CONNECT (the social graph's face)
 * --------------------------------------------------------
 * Paddies (friends), requests (in/out), find people (the REAL live
 * roster first, then street suggestions), and the block wall —
 * rendered from the social store's DEVICE truth (labeled honestly).
 * The W5 server wave swaps the transport; these shapes stay.
 *
 * THE BLOCK LAW is visible here: blocked handles vanish from DMs,
 * calls and finds, and the wall lists them with an unblock door.
 */

import { useState } from 'react'
import { NPCS } from '@/game/data/npcs'
import { useGameStore } from '@/game/store/useGameStore'
import { useSocialStore } from '@/game/store/social-store'

type Tab = 'paddies' | 'requests' | 'find'

export function ConnectApp({ onOpenDm }: { onOpenDm: (handle: string) => void }) {
  const [tab, setTab] = useState<Tab>('paddies')
  const [handle, setHandle] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const account = useGameStore((s) => s.account)
  const wire = useGameStore((s) => s.liveWire)

  const friends = useSocialStore((s) => s.friends)
  const requests = useSocialStore((s) => s.requests)
  const blocked = useSocialStore((s) => s.blocked)
  const addFriend = useSocialStore((s) => s.addFriend)
  const acceptRequest = useSocialStore((s) => s.acceptRequest)
  const declineRequest = useSocialStore((s) => s.declineRequest)
  const removeFriend = useSocialStore((s) => s.removeFriend)
  const blockHandle = useSocialStore((s) => s.blockHandle)
  const unblockHandle = useSocialStore((s) => s.unblockHandle)

  const me = account.handle
  const online = (wire?.roster ?? []).map((r) => r.handle).filter((h) => h && h !== me && !blocked.includes(h) && !friends.includes(h))
  const inReqs = requests.filter((r) => r.dir === 'in')
  const outReqs = requests.filter((r) => r.dir === 'out')
  const suggestions = NPCS.slice(0, 6).filter((n) => !friends.includes(n.name) && !blocked.includes(n.name))

  const tryAdd = (h: string) => {
    const res = addFriend(h)
    setNotice(
      res.ok
        ? `@${h} don enter your paddies 🤝`
        : res.why === 'already' ? `@${h} dey your paddies already.`
        : res.why === 'blocked' ? `@${h} dey for your block wall — unblock first.`
        : res.why === 'self' ? 'Na you be that 😄'
        : 'Type the handle first.',
    )
    if (res.ok) setHandle('')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-black/[0.05] p-1">
        {([['paddies', `🤝 Paddies${friends.length ? ` (${friends.length})` : ''}`], ['requests', `📥 Requests${inReqs.length ? ` (${inReqs.length})` : ''}`], ['find', '🔍 Find']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`lko-press rounded-lg px-1 py-1.5 text-[10.5px] font-extrabold ${tab === k ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`}>
            {label}
          </button>
        ))}
      </div>
      <p className="px-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
        Paddies dey on this device for now — the W5 server wave go sync dem everywhere.
      </p>

      {tab === 'paddies' && (
        <div className="flex flex-col gap-1.5" data-testid="connect-paddies">
          {friends.length === 0 && (
            <p className="rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
              No paddy yet — check Find. The city full of people.
            </p>
          )}
          {friends.map((f) => (
            <div key={f} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-extrabold">@{f}</span>
                {online.includes(f) && <span className="text-[9.5px] font-black text-[var(--lko-green-deep)]">● online now</span>}
              </span>
              <span className="flex shrink-0 gap-1.5">
                <button onClick={() => onOpenDm(f)} className="lko-press rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]" aria-label={`Message ${f}`}>💬</button>
                <button onClick={() => { removeFriend(f); setNotice(`@${f} comot from paddies.`) }} className="lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]" aria-label={`Remove ${f}`}>✕</button>
                <button onClick={() => { blockHandle(f); setNotice(`@${f} block — dem no fit reach you again.`) }} className="lko-press rounded-full bg-[#fdecea] px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]" aria-label={`Block ${f}`}>🚫</button>
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 'requests' && (
        <div className="flex flex-col gap-1.5" data-testid="connect-requests">
          {inReqs.length === 0 && outReqs.length === 0 && (
            <p className="rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]">
              No request dey wait. When somebody wan be your paddy, e go land here.
            </p>
          )}
          {inReqs.map((r) => (
            <div key={r.handle} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5">
              <span className="text-[12.5px] font-extrabold">@{r.handle}</span>
              <span className="flex gap-1.5">
                <button data-testid={`connect-accept-${r.handle}`} onClick={() => { acceptRequest(r.handle); setNotice(`@${r.handle} na your paddy now 🤝`) }} className="lko-press rounded-full bg-[var(--lko-green)] px-3 py-1 text-[10px] font-extrabold text-white">Accept</button>
                <button onClick={() => declineRequest(r.handle)} className="lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">Nah</button>
              </span>
            </div>
          ))}
          {outReqs.map((r) => (
            <div key={r.handle} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5">
              <span className="text-[12px] font-bold text-[var(--lko-ink-soft)]">@{r.handle}</span>
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
            <button data-testid="connect-add-btn" onClick={() => tryAdd(handle)} className="lko-press rounded-xl bg-[var(--lko-green)] px-4 py-2 text-[12px] font-extrabold text-white">Add</button>
          </div>

          {online.length > 0 && (
            <>
              <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Online now (the real roster)</p>
              {online.map((h) => (
                <div key={h} className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5">
                  <span className="text-[12.5px] font-extrabold">@{h} <span className="text-[9.5px] font-black text-[var(--lko-green-deep)]">● online</span></span>
                  <button onClick={() => tryAdd(h)} className="lko-press rounded-full bg-[var(--lko-green-soft)] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">+ Paddy</button>
                </div>
              ))}
            </>
          )}

          <p className="px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Street suggestions</p>
          {suggestions.map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5">
              <span className="text-[12.5px] font-extrabold">{n.name}</span>
              <button onClick={() => tryAdd(n.name)} className="lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">+ Paddy</button>
            </div>
          ))}
        </div>
      )}

      {blocked.length > 0 && (
        <div className="rounded-2xl border border-[#f3c8c4] bg-[#fdf1f0] p-2.5" data-testid="connect-blocked">
          <p className="text-[10px] font-black uppercase tracking-wide text-[#a63d33]">🚫 Block wall — dem no fit reach you</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {blocked.map((b) => (
              <button key={b} onClick={() => { unblockHandle(b); setNotice(`@${b} unblocked.`) }} className="lko-press rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]">
                @{b} ✕
              </button>
            ))}
          </div>
        </div>
      )}

      {notice && <p className="px-1 text-[10.5px] font-bold text-[var(--lko-green-deep)]">{notice}</p>}
    </div>
  )
}
