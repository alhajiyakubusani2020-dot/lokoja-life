'use client'

/**
 * LOKOJA LIFE — Dashboard (Stage 1 shell)
 * The in-game HUD: player header, needs, skills, time/weather and the
 * 5-tab bottom navigation. Tabs that arrive in later stages show honest
 * "coming soon" panels with real data teasers where available.
 */

import { useState } from 'react'
import { Avatar } from '../Avatar'
import { NeedsBar } from '../NeedsBar'
import { BottomNav, ComingSoon, type TabKey } from '../BottomNav'
import { audio } from '@/game/systems/audio'
import { formatNaira, nextReputationTier, reputationTier, xpToNextLevel } from '@/game/systems/progression'
import { conditionSummary } from '@/game/systems/needs'
import { LEVEL_UNLOCKS } from '@/game/data/config'
import { JOBS } from '@/game/data/jobs'
import { FOODS } from '@/game/data/foods'
import { LOCATIONS, LOCATION_BY_ID } from '@/game/data/locations'
import { useGameStore } from '@/game/store/useGameStore'

/* --------------------------- small HUD helpers ----------------------------- */

const TIME_META: Record<string, { icon: string; label: string; bg: string }> = {
  morning: { icon: '🌅', label: 'Morning', bg: 'bg-[var(--lko-gold-soft)]' },
  afternoon: { icon: '☀️', label: 'Afternoon', bg: 'bg-[var(--lko-gold-soft)]' },
  evening: { icon: '🌇', label: 'Evening', bg: 'bg-orange-100' },
  night: { icon: '🌙', label: 'Night', bg: 'bg-[var(--lko-green-soft)]' },
}

const WEATHER_META: Record<string, { icon: string; label: string }> = {
  sunny: { icon: '☀️', label: 'Sunny' },
  cloudy: { icon: '☁️', label: 'Cloudy' },
  rain: { icon: '🌧️', label: 'Rain' },
  'night-clear': { icon: '🌙', label: 'Clear Night' },
}

function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      {children}
    </span>
  )
}

/* --------------------------------- home tab -------------------------------- */

function HomeTab() {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const rest = useGameStore((s) => s.rest)

  const condition = conditionSummary(player.needs)
  const timeMeta = TIME_META[world.timeOfDay]
  const weatherMeta = WEATHER_META[world.weather]
  const location = LOCATION_BY_ID[world.currentLocation]
  const xpNeeded = xpToNextLevel(player.level)

  return (
    <div className="px-4 pt-3">
      {/* condition banner */}
      <div
        className={`lko-card mb-3 flex items-center gap-2 px-4 py-2.5 ${
          condition.tone === 'bad' ? 'border-red-200 bg-red-50' : ''
        }`}
      >
        <span className="text-lg" aria-hidden>
          {condition.tone === 'good' ? '🔥' : condition.tone === 'bad' ? '⚠️' : '👍'}
        </span>
        <p className="text-[13px] font-semibold text-[var(--lko-ink)]">{condition.text}</p>
      </div>

      {/* needs */}
      <section className="lko-card p-4" aria-label="Player needs">
        <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          Condition
        </h2>
        <div className="flex flex-col gap-2.5">
          <NeedsBar need="health" value={player.needs.health} />
          <NeedsBar need="energy" value={player.needs.energy} />
          <NeedsBar need="hunger" value={player.needs.hunger} />
          <NeedsBar need="mood" value={player.needs.mood} />
        </div>
      </section>

      {/* skills */}
      <section className="lko-card mt-3 p-4" aria-label="Skills">
        <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          Skills
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { key: 'hustle', label: 'Hustle', emoji: '💪' },
              { key: 'smart', label: 'Smart', emoji: '🧠' },
              { key: 'social', label: 'Social', emoji: '🗣️' },
            ] as const
          ).map((s) => (
            <div
              key={s.key}
              className="flex flex-col items-center rounded-xl border-2 border-black/[0.05] bg-[var(--lko-cream)] py-2.5"
            >
              <span className="text-xl" aria-hidden>
                {s.emoji}
              </span>
              <span className="mt-0.5 text-[11px] font-bold text-[var(--lko-ink-soft)]">{s.label}</span>
              <span className="lko-display text-lg text-[var(--lko-green-deep)]">{player.skills[s.key]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* world card + rest actions */}
      <section className="mt-3 grid grid-cols-2 gap-3" aria-label="Time and rest">
        <div className={`lko-card flex flex-col justify-center p-4 ${timeMeta.bg}`}>
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            Lokoja • Day {world.day}
          </p>
          <p className="lko-display mt-1 text-lg">
            {timeMeta.icon} {timeMeta.label}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-[var(--lko-ink-soft)]">
            {weatherMeta.icon} {weatherMeta.label}
          </p>
        </div>
        <div className="lko-card flex flex-col justify-center p-4">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            You are at
          </p>
          <p className="lko-display mt-1 flex items-center gap-1.5 text-lg leading-tight">
            <span aria-hidden>{location.emoji}</span> {location.name}
          </p>
          <p className="mt-0.5 text-xs font-semibold italic text-[var(--lko-ink-soft)]">
            “{location.tagline}”
          </p>
        </div>

        {/* Stage 1 real mechanic: rest at home */}
        <div className="col-span-2 lko-card p-4">
          <h2 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            Rest at home
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                audio.play('click')
                rest('nap')
              }}
              className="lko-press min-h-[52px] rounded-xl border-b-4 border-[#b57d0a] bg-[var(--lko-gold)] px-2 py-2 text-sm font-extrabold text-[#3d2a00]"
            >
              😴 Nap
              <span className="mt-0.5 block text-[10px] font-bold opacity-80">+22 Energy • 1 slot</span>
            </button>
            <button
              onClick={() => {
                audio.play('click')
                rest('sleep')
              }}
              className="lko-press min-h-[52px] rounded-xl border-b-4 border-[#0a5c2e] bg-[var(--lko-green)] px-2 py-2 text-sm font-extrabold text-white"
            >
              🛏️ Sleep
              <span className="mt-0.5 block text-[10px] font-bold opacity-80">Full rest • next morning</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

/* --------------------------------- map tab --------------------------------- */

function MapTab() {
  const world = useGameStore((s) => s.world)!
  return (
    <div>
      <ComingSoon
        icon="🗺️"
        title="The Lokoja Map"
        stage="Stage 2"
        description="Walking, keke rides and taxis will take you across ten hand-crafted neighbourhoods — from Kpata Market to the Confluence."
      />
      {/* real data teaser: the actual launch locations */}
      <section className="px-4" aria-label="Coming locations">
        <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          10 neighbourhoods are being mapped
        </h3>
        <ul className="flex flex-col gap-2">
          {LOCATIONS.map((l) => {
            const isCurrent = l.id === world.currentLocation
            return (
              <li
                key={l.id}
                className={`lko-card flex items-center gap-3 p-3 ${isCurrent ? 'border-[var(--lko-green)]/40 bg-[var(--lko-green-soft)]' : 'opacity-70'}`}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: `${l.color}22` }}
                  aria-hidden
                >
                  {l.emoji}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight">
                    {l.name}
                    {isCurrent && (
                      <span className="ml-2 rounded-full bg-[var(--lko-green)] px-2 py-0.5 text-[9px] font-extrabold uppercase text-white">
                        You are here
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-[var(--lko-ink-soft)]">{l.tagline}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

/* --------------------------------- work tab -------------------------------- */

function WorkTab() {
  return (
    <div>
      <ComingSoon
        icon="💼"
        title="Jobs & Hustles"
        stage="Stage 3"
        description="Take shifts, run deliveries, hear about quick hustles — every job pays in naira, XP and reputation. The grind begins here."
      />
      {/* real data teaser: actual launch jobs */}
      <section className="px-4" aria-label="Coming jobs">
        <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          {JOBS.length} jobs are hiring soon
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {JOBS.map((j) => (
            <div key={j.id} className="lko-card p-3 opacity-75">
              <p className="text-sm font-bold leading-tight">
                <span aria-hidden>{j.emoji}</span> {j.name}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-[var(--lko-gold)]">
                up to {formatNaira(j.basePay)} / shift
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ---------------------------------- bag tab --------------------------------- */

function BagTab() {
  return (
    <div>
      <ComingSoon
        icon="🎒"
        title="Inventory & Shops"
        stage="Stage 4"
        description="Buy food, drinks and tools; keep your pace meals and fishing gear close. A hungry hustler cannot hustle."
      />
      {/* real data teaser: actual launch menu */}
      <section className="px-4" aria-label="Coming food menu">
        <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          The menu is getting ready
        </h3>
        <ul className="flex flex-col gap-2">
          {FOODS.slice(0, 6).map((f) => (
            <li key={f.id} className="lko-card flex items-center gap-3 p-3 opacity-75">
              <span className="text-xl" aria-hidden>
                {f.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">{f.name}</p>
                <p className="truncate text-[11px] text-[var(--lko-ink-soft)]">{f.description}</p>
              </div>
              <span className="text-xs font-extrabold text-[var(--lko-terra)]">{formatNaira(f.price)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/* -------------------------------- profile tab ------------------------------- */

function ProfileTab() {
  const player = useGameStore((s) => s.player)!
  const settings = useGameStore((s) => s.settings)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const saveNow = useGameStore((s) => s.saveNow)
  const returnToMenu = useGameStore((s) => s.returnToMenu)

  const tier = reputationTier(player.reputation)
  const nextTier = nextReputationTier(player.reputation)
  const xpNeeded = xpToNextLevel(player.level)

  const unlocked = Object.entries(LEVEL_UNLOCKS)
    .filter(([lvl]) => Number(lvl) <= player.level)
    .flatMap(([, items]) => items)

  return (
    <div className="px-4 pt-3">
      {/* identity card */}
      <section className="lko-card flex items-center gap-4 p-4" aria-label="Identity">
        <Avatar config={player.avatar} gender={player.gender} withBackdrop className="h-24 w-24 shrink-0" />
        <div className="min-w-0">
          <h2 className="lko-display truncate text-xl">{player.name}</h2>
          <p className="text-xs font-semibold capitalize text-[var(--lko-ink-soft)]">
            {player.gender === 'male' ? '👨' : '👩'} Hustler • {tier.name}
          </p>
          <p className="mt-1 text-[11px] italic leading-snug text-[var(--lko-ink-soft)]">
            “{tier.title}”
          </p>
        </div>
      </section>

      {/* reputation ladder */}
      <section className="lko-card mt-3 p-4" aria-label="Reputation">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
            ⭐ Reputation
          </h3>
          <span className="lko-display text-lg text-[var(--lko-terra)]">{player.reputation}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-black/[0.08]">
          <div
            className="h-full rounded-full bg-[var(--lko-terra)] transition-all duration-500"
            style={{
              width: nextTier
                ? `${Math.min(100, (player.reputation / nextTier.tier.threshold) * 100)}%`
                : '100%',
            }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-[var(--lko-ink-soft)]">
          {nextTier
            ? `${nextTier.remaining} rep to “${nextTier.tier.name}”`
            : 'You are a certified Big Player 🏆'}
        </p>
      </section>

      {/* path & unlocks */}
      <section className="lko-card mt-3 p-4" aria-label="Your path">
        <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          🛤️ Your path so far
        </h3>
        {unlocked.length === 0 ? (
          <p className="text-xs text-[var(--lko-ink-soft)]">
            Level up to unlock new jobs, places and businesses.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {unlocked.map((u) => (
              <li
                key={u}
                className="rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-green-deep)]"
              >
                {u}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[11px] text-[var(--lko-ink-soft)]">
          XP to Level {player.level + 1}: {Math.max(0, xpNeeded - player.xp)}
        </p>
      </section>

      {/* settings & save */}
      <section className="lko-card mt-3 mb-4 p-4" aria-label="Settings">
        <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
          ⚙️ Settings
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between rounded-xl border-2 border-black/[0.06] px-4 py-3">
            <span className="text-sm font-bold">🔊 Sound</span>
            <button
              role="switch"
              aria-checked={settings.sound}
              onClick={toggleSound}
              className={`lko-press h-8 w-14 rounded-full transition-colors ${
                settings.sound ? 'bg-[var(--lko-green)]' : 'bg-black/15'
              }`}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  settings.sound ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <button
            onClick={() => {
              audio.play('chime')
              saveNow()
            }}
            className="lko-press min-h-[48px] rounded-xl border-2 border-[var(--lko-green)]/30 bg-[var(--lko-green-soft)] py-3 text-sm font-extrabold text-[var(--lko-green-deep)]"
          >
            💾 Save now
          </button>
          <button
            onClick={() => {
              audio.play('click')
              returnToMenu()
            }}
            className="lko-press min-h-[48px] rounded-xl border-2 border-black/[0.08] bg-white py-3 text-sm font-bold text-[var(--lko-ink)]"
          >
            🚪 Main menu (auto-saves)
          </button>
        </div>
      </section>
    </div>
  )
}

/* -------------------------------- dashboard -------------------------------- */

export function Dashboard() {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const notifications = useGameStore((s) => s.notifications)
  const [tab, setTab] = useState<TabKey>('home')

  const xpNeeded = xpToNextLevel(player.level)
  const tier = reputationTier(player.reputation)

  return (
    <div className="lko-root min-h-dvh">
      {/* floating notifications */}
      <div className="pointer-events-none fixed inset-x-0 top-2 z-50 mx-auto flex w-full max-w-md flex-col items-center gap-1.5 px-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`lko-toast flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[13px] font-bold shadow-lg ${
              n.tone === 'good'
                ? 'border-[var(--lko-green)]/30 bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
                : n.tone === 'bad'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-black/10 bg-white text-[var(--lko-ink)]'
            }`}
            role="status"
          >
            <span aria-hidden>{n.icon}</span>
            {n.text}
          </div>
        ))}
      </div>

      {/* header */}
      <header className="mx-auto w-full max-w-md px-4 pt-3">
        <div className="lko-card p-3">
          <div className="flex items-center gap-3">
            <Avatar config={player.avatar} gender={player.gender} withBackdrop className="h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="lko-display truncate text-base leading-tight">{player.name}</p>
              {/* xp bar */}
              <div className="mt-1 flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--lko-green)] text-[10px] font-extrabold text-white">
                  {player.level}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.08]">
                  <div
                    className="h-full rounded-full bg-[var(--lko-green)] transition-all duration-500"
                    style={{ width: `${Math.min(100, (player.xp / xpNeeded) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="lko-display text-lg leading-tight text-[var(--lko-green-deep)]">
                {formatNaira(player.cash)}
              </p>
              <Chip className="bg-[var(--lko-gold-soft)] text-[#8a5a00]">⭐ {tier.name}</Chip>
            </div>
          </div>
        </div>
      </header>

      {/* tab content */}
      <main
        className="mx-auto w-full max-w-md pb-24"
        role="tabpanel"
        aria-label={tab}
      >
        {tab === 'home' && <HomeTab />}
        {tab === 'map' && <MapTab />}
        {tab === 'work' && <WorkTab />}
        {tab === 'bag' && <BagTab />}
        {tab === 'profile' && <ProfileTab />}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
