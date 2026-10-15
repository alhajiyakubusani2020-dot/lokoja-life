'use client'

/**
 * LOKOJA LIFE — PulseApp (M15: THE CITY PULSE + THE AWARENESS WAR)
 * -----------------------------------------------------------------
 * The phone's newspaper: the city's deterministic news (derived, never
 * stored), the signed postcard ("My Spot"), the mailbox of postcards
 * that landed you here (the ghost cards), the KNOW YOUR CITY card
 * (percent from honest ledgers only), and the Day Clip — the 9:16
 * auto-playing card the WhatsApp generation screenshots for Status.
 *
 * Every naira of street credit moves through the store's share actions
 * (shareTeleport / sharePulseCard) — this UI never mints, never signs,
 * never pays. The cooldown and the ledger live in the store.
 */

import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { pulseForDay, pulseUnread, cityKnowledge, freshPulseState, type PulseItem } from '@/game/systems/pulse'
import { decodeTeleport, postcardFor, encodeTeleport } from '@/game/systems/teleport'
import { formatNaira } from '@/game/systems/progression'
import { PULSE } from '@/game/data/config'

/* ------------------------------ the feed row ------------------------------- */

function FeedRow({ item, onShare, shared }: { item: PulseItem; onShare: () => void; shared: boolean }) {
  return (
    <div
      data-testid={`pulse-item-${item.kind}`}
      className="rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-extrabold leading-snug">
          <span className="mr-1" aria-hidden>{item.icon}</span>
          {item.headline}
        </p>
        <button
          data-testid={`pulse-share-${item.kind}`}
          onClick={onShare}
          className="lko-press shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]"
          aria-label={`Share this news: ${item.headline}`}
        >
          Share
        </button>
      </div>
      <p className="mt-1 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]">{item.body}</p>
      {shared && (
        <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-green)]">
          The street don hear — credit paid today
        </p>
      )}
    </div>
  )
}

/* ---------------------------- the ghost card ------------------------------- */

function GhostCard({ code, mineName }: { code: string; mineName: string }) {
  const dec = decodeTeleport(code)
  if (!dec.ok) return null
  const card = postcardFor(dec.moment)
  return (
    <div data-testid="ghost-card" className="rounded-2xl border border-[#ffd166]/50 bg-[#fff8e6] p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#8a6d1a]">
        📩 Postcard — {dec.moment.name === mineName ? 'your own' : dec.moment.name}'s corner
      </p>
      <p className="mt-1 text-[13px] font-extrabold leading-snug text-[#4a3200]">{card.title}</p>
      <p className="mt-0.5 text-[11px] font-semibold text-[#6b5416]">{card.body}</p>
    </div>
  )
}

/* ----------------------------- the day clip -------------------------------- */

/** THE DAY CLIP — 9:16, three honest beats, it plays itself. Screenshot it for Status. */
function DayClip({ beats, code }: { beats: { icon: string; line: string }[]; code: string }) {
  const [beat, setBeat] = useState(0)
  const clip = useMemo(() => {
    const b = beats.slice(0, 3)
    while (b.length < 3) b.push({ icon: '🌤️', line: 'Lokoja dey move — your turn to waka.' })
    b.push({ icon: '📲', line: `Join the street: ${code.slice(0, 24)}…` })
    return b
  }, [beats, code])
  useEffect(() => {
    const t = setInterval(() => setBeat((b) => (b + 1) % clip.length), 2200)
    return () => clearInterval(t)
  }, [clip.length])
  const current = clip[beat % clip.length]
  return (
    <div
      data-testid="day-clip"
      className="relative mx-auto aspect-[9/16] w-full max-w-[180px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#146b3a] via-[#0d4d2a] to-[#0b3d23] p-3 text-white shadow-[var(--lko-shadow-md)]"
    >
      <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/60">Lokoja Life · Day Clip</p>
      <div className="mt-4 flex h-[70%] flex-col items-center justify-center gap-2 text-center">
        <span className="text-3xl" aria-hidden>{current.icon}</span>
        <p key={beat} className="text-[12px] font-extrabold leading-snug">{current.line}</p>
      </div>
      <div className="absolute inset-x-3 bottom-2 flex justify-center gap-1">
        {clip.map((_, i) => (
          <span key={i} className={`h-1 w-4 rounded-full ${i === beat % clip.length ? 'bg-white' : 'bg-white/30'}`} />
        ))}
      </div>
    </div>
  )
}

/* ------------------------------- the app ----------------------------------- */

export function PulseApp() {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const civic = useGameStore((s) => s.civic)!
  const chaos = useGameStore((s) => s.chaos)
  const rivers = useGameStore((s) => s.rivers)
  const calendar = useGameStore((s) => s.calendar)
  const education = useGameStore((s) => s.education)
  const housing = useGameStore((s) => s.housing)
  const japa = useGameStore((s) => s.japa)
  const cityPulse = useGameStore((s) => s.cityPulse)
  const openCityPulse = useGameStore((s) => s.openCityPulse)
  const shareTeleport = useGameStore((s) => s.shareTeleport)
  const sharePulseCard = useGameStore((s) => s.sharePulseCard)
  const creditPaid = player.cooldowns[PULSE.shareCooldownKey] === world.day

  // mark today read on open (the store action is idempotent by law)
  useEffect(() => {
    openCityPulse()
  }, [world.day])

  const items = useMemo(
    () => pulseForDay({ day: world.day, weather: world.weather, chaos, civic, rivers, calendar }),
    [world.day, world.weather, chaos, civic, rivers, calendar],
  )
  const unread = pulseUnread(cityPulse ?? freshPulseState(), items)
  const knowledge = useMemo(
    () => cityKnowledge(player, { calendar, rivers, education, housing, japa, chaos }),
    [player, calendar, rivers, education, housing, japa, chaos],
  )

  const [spot, setSpot] = useState<{ url: string; title: string; body: string } | null>(null)
  const [spotBusy, setSpotBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const shareSpot = async () => {
    setSpotBusy(true)
    setErr(null)
    const res = await shareTeleport()
    setSpotBusy(false)
    if (res.ok && res.url) {
      const title = `${player.name} na Day ${world.day} dey ${world.currentLocation === 'home' ? 'Home' : world.currentLocation}`
      setSpot({ url: res.url, title, body: 'Signed postcard — open am to land here.' })
    } else {
      setErr(res.why ?? 'The share no gree.')
    }
  }

  const shareTop = async (item: PulseItem) => {
    setErr(null)
    const res = await sharePulseCard(item)
    if (!res.ok) setErr(res.why ?? 'The share no gree.')
  }

  // the clip's beats: the day's loudest news, then the ledger's biggest move
  const beats = useMemo(() => {
    const news = items.slice(0, 2).map((i) => ({ icon: i.icon, line: i.headline }))
    const biggest = [...player.transactions]
      .filter((t) => t.day === world.day && t.amount > 0)
      .sort((a, b) => b.amount - a.amount)[0]
    if (biggest) news.push({ icon: '💸', line: `Biggest move: ${biggest.label} +${formatNaira(biggest.amount)}` })
    return news
  }, [items, player.transactions, world.day])

  // my current spot's postcard (derived fresh — the same bytes the share mints)
  const mySpot = useMemo(() => {
    const tally = { earned: 0, moves: 0, trail: [0, 0, 0] as number[] }
    const enc = encodeTeleport({
      v: 1,
      day: world.day,
      locId: world.currentLocation,
      name: player.name,
      level: player.level,
      rep: player.reputation,
      earned: tally.earned,
      moves: tally.moves,
      trail: tally.trail,
    })
    return enc.ok ? enc : null
  }, [player, world])

  return (
    <div className="space-y-3" data-testid="pulse-app">
      {/* header */}
      <div className="rounded-2xl bg-[var(--lko-green)] p-3 text-white">
        <div className="flex items-center justify-between">
          <p className="lko-display text-[15px]">📰 City Pulse</p>
          <span data-testid="pulse-unread" className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-extrabold">
            {unread > 0 ? `${unread} new` : 'all read'}
          </span>
        </div>
        <p className="mt-0.5 text-[10.5px] font-semibold text-white/75">
          The city talk wetin e see — Day {world.day}, {items.length} headline{items.length === 1 ? '' : 's'}.
        </p>
      </div>

      {err && (
        <p className="rounded-xl bg-[#fdecea] px-3 py-2 text-[11px] font-bold text-[#8a2a20]">{err}</p>
      )}

      {/* the feed */}
      <div className="space-y-2">
        {items.map((item) => (
          <FeedRow key={item.id} item={item} onShare={() => shareTop(item)} shared={creditPaid} />
        ))}
      </div>

      {/* MY SPOT — the signed postcard */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]" data-testid="my-spot">
        <p className="text-[13px] font-extrabold">📍 My Spot</p>
        <p className="mt-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
          Sign where you stand — anyone wey open the link go land here, no fare.
        </p>
        <button
          data-testid="share-spot"
          disabled={spotBusy}
          onClick={shareSpot}
          className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-50"
        >
          {spotBusy ? 'Signing…' : `Share this spot${creditPaid ? ' (+credit done today)' : ` (+${PULSE.shareStreetCredit} rep)`}`}
        </button>
        {spot && (
          <div className="mt-2 rounded-xl bg-[var(--lko-green-soft)] p-2" data-testid="spot-preview">
            <p className="text-[11px] font-extrabold text-[var(--lko-green-deep)]">{spot.title}</p>
            <p className="mt-0.5 break-all text-[10px] font-bold text-[var(--lko-green)]">{spot.url}</p>
            <p className="lko-num mt-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
              {spot.url.length} chars — e fit WhatsApp.
            </p>
          </div>
        )}
        {mySpot && (
          <p className="lko-num mt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
            Postcard: {mySpot.code.length} chars, {mySpot.bytes} bytes of payload — e fit WhatsApp.
          </p>
        )}
      </div>

      {/* THE MAILBOX — postcards that landed here */}
      {(cityPulse?.arrivals.length ?? 0) > 0 && (
        <div className="space-y-2" data-testid="mailbox">
          <p className="px-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-ink-soft)]">
            The mailbox — who don call you
          </p>
          {[...(cityPulse?.arrivals ?? [])].reverse().slice(0, 3).map((code) => (
            <GhostCard key={code} code={code} mineName={player.name} />
          ))}
        </div>
      )}

      {/* KNOW YOUR CITY */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[var(--lko-shadow-sm)]" data-testid="know-city">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-extrabold">🌍 Know Your City</p>
          <span className="lko-num rounded-full bg-[var(--lko-river-soft)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--lko-river)]">
            {knowledge.percent}%
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--lko-river)] to-[var(--lko-green)] transition-[width] duration-500"
            style={{ width: `${knowledge.percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] font-extrabold text-[var(--lko-green-deep)]">
          You be {knowledge.grade} — {knowledge.checked}/{knowledge.total} roads don see your footprint.
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {knowledge.checks.map((c) => (
            <span
              key={c.id}
              title={c.label}
              className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ${c.done ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`}
            >
              {c.done ? '✓' : '·'} {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* THE DAY CLIP */}
      <div>
        <p className="px-1 pb-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-ink-soft)]">
          The Day Clip — screenshot for Status
        </p>
        <DayClip beats={beats} code={mySpot?.code ?? 'lkt1.share-your-spot'} />
      </div>
    </div>
  )
}

/* ------------------------------ (no helpers below) -------------------------- */
