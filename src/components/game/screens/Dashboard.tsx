'use client'

/**
 * LOKOJA LIFE — Dashboard (R1 visual overhaul + Stage 5 tabs)
 * The in-game shell: a compact HUD header, the living-world hero on the
 * Home tab (driven by the real world clock + weather), needs/skills/rest,
 * and the 7-tab bottom navigation (Stage 5 adds the Phone).
 * Tabs that arrive in later stages show honest "coming soon" panels with
 * real data teasers where available.
 *
 * R1 is presentation-only: every store action, guard and data source below
 * is untouched — only the visual layer was redesigned.
 */

import { useState } from 'react'
import { Avatar } from '../Avatar'
import { NeedsBar } from '../NeedsBar'
import { BottomNav, ComingSoon, type TabKey } from '../BottomNav'
import { LivingScene } from '../LivingScene'
import { MapScreen } from './MapScreen'
import { WorkScreen } from './WorkScreen'
import { PhoneScreen } from './PhoneScreen'
import { WorldTab } from '../world/WorldTab'
import {
  PlaceIcon,
  TimeIcon,
  WeatherIcon,
  SkillIcon,
  StarIcon,
  KekeIcon,
  FireIcon,
  ThumbsUpIcon,
  AlertIcon,
  MoonIcon,
  ClockIcon,
  CoinsIcon,
  TrendUpIcon,
  TrendDownIcon,
  SoundIcon,
  SaveIcon,
  ExitIcon,
  SettingsIcon,
  PinIcon,
  WorldIcon,
} from '../icons'
import { audio } from '@/game/systems/audio'
import { formatNaira, nextReputationTier, reputationTier, skillCap, xpToNextLevel } from '@/game/systems/progression'
import { skillXpToNext, SKILL_META } from '@/game/systems/skills'
import { conditionSummary } from '@/game/systems/needs'
import { LEVEL_UNLOCKS, WEATHER_META } from '@/game/data/config'
import { FOODS } from '@/game/data/foods'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { useGameStore } from '@/game/store/useGameStore'

/* --------------------------- small HUD helpers ----------------------------- */

function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${className}`}>
      {children}
    </span>
  )
}

/** Section heading with the shared icon language (replaces emoji prefixes). */
function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
      <span className="text-[var(--lko-gold-deep)]" aria-hidden>
        {icon}
      </span>
      {children}
    </h2>
  )
}

/* --------------------------------- home tab -------------------------------- */

function HomeTab({ onExploreWorld }: { onExploreWorld: () => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const isTravelling = useGameStore((s) => s.isTravelling)
  const rest = useGameStore((s) => s.rest)

  const condition = conditionSummary(player.needs)
  const location = LOCATION_BY_ID[world.currentLocation]
  const xpNeeded = xpToNextLevel(player.level)

  return (
    <div className="px-4 pt-3 sm:px-6">
      {/* ---- the living world hero ---- */}
      <section
        className="lko-fade relative h-44 overflow-hidden rounded-3xl border border-black/[0.07] shadow-[var(--lko-shadow-md)] sm:h-52"
        aria-label={`You are at ${location.name}`}
      >
        <LivingScene timeOfDay={world.timeOfDay} weather={world.weather} className="absolute inset-0 h-full w-full" />
        {/* legibility scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/25" aria-hidden />

        {/* location — bottom left */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between gap-2">
          <div className="min-w-0 drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/85">
              <PinIcon size={12} />
              You are here
            </p>
            {isTravelling ? (
              <p className="lko-display mt-0.5 flex items-center gap-1.5 text-xl text-white animate-pulse">
                <KekeIcon size={20} /> Travelling…
              </p>
            ) : (
              <p className="lko-display mt-0.5 flex items-center gap-2 text-xl leading-tight text-white">
                <PlaceIcon id={location.id} size={20} className="shrink-0 text-[#ffd88a]" />
                <span className="truncate">{location.name}</span>
              </p>
            )}
            {!isTravelling && (
              <p className="mt-0.5 truncate text-[11.5px] font-semibold italic text-white/80">
                “{location.tagline}”
              </p>
            )}
          </div>
        </div>

        {/* 3D world CTA — top left of the hero */}
        <div className="absolute left-3 top-3">
          <button
            onClick={() => {
              audio.play('click')
              onExploreWorld()
            }}
            className="lko-press flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur-sm"
          >
            <WorldIcon size={13} />
            Explore in 3D
          </button>
        </div>

        {/* day / time / weather — top right */}
        <div className="absolute right-3 top-12 flex flex-col items-end gap-1.5 sm:top-3">
          <Chip className="bg-black/30 text-white backdrop-blur-sm">Day {world.day}</Chip>
          <Chip className="bg-black/30 text-white backdrop-blur-sm">
            <TimeIcon name={world.timeOfDay} size={13} className="text-[#ffd88a]" />
            <span className="capitalize">{world.timeOfDay}</span>
          </Chip>
          <Chip className="bg-black/30 text-white backdrop-blur-sm">
            <WeatherIcon name={world.weather} size={13} className="text-[#ffd88a]" />
            {/* M6 — the one weather dictionary: no hand-rolled label ternaries */}
            <span>{WEATHER_META[world.weather]?.label ?? world.weather}</span>
          </Chip>
        </div>
      </section>

      {/* condition summary — one quiet line */}
      <div
        className={`lko-fade mt-3 flex items-center gap-2 rounded-2xl px-4 py-2.5 ${
          condition.tone === 'bad' ? 'border border-red-200 bg-red-50' : 'lko-card'
        }`}
      >
        <span className="text-[var(--lko-terra)]" aria-hidden>
          {condition.tone === 'good' ? <FireIcon size={17} /> : condition.tone === 'bad' ? <AlertIcon size={17} /> : <ThumbsUpIcon size={17} />}
        </span>
        <p className="text-[13px] font-semibold text-[var(--lko-ink)]">{condition.text}</p>
      </div>

      {/* needs + skills — side by side from small tablets up */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="lko-card p-4" aria-label="Player needs">
          <SectionTitle icon={<FireIcon size={13} />}>Condition</SectionTitle>
          <div className="flex flex-col gap-2.5">
            <NeedsBar need="health" value={player.needs.health} />
            <NeedsBar need="energy" value={player.needs.energy} />
            <NeedsBar need="hunger" value={player.needs.hunger} />
            <NeedsBar need="mood" value={player.needs.mood} />
          </div>
        </section>

        <section className="lko-card p-4" aria-label="Skills">
          <SectionTitle icon={<TrendUpIcon size={13} />}>Skills</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {(
              ['hustle', 'smart', 'social'] as const
            ).map((key) => {
              const meta = SKILL_META[key]
              const cap = skillCap(player.level)
              const capped = player.skills[key] >= cap
              const toNext = skillXpToNext()
              return (
                <div
                  key={key}
                  className="flex flex-col items-center rounded-xl border border-black/[0.05] bg-[var(--lko-cream)] py-2.5"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      key === 'hustle'
                        ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]'
                        : key === 'smart'
                          ? 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]'
                          : 'bg-[var(--lko-green-soft)] text-[var(--lko-green)]'
                    }`}
                    aria-hidden
                  >
                    <SkillIcon name={key} size={16} />
                  </span>
                  <span className="mt-1 text-[11px] font-bold text-[var(--lko-ink-soft)]">{meta.label}</span>
                  <span className="lko-display lko-num text-lg text-[var(--lko-green-deep)]">{player.skills[key]}</span>
                  {/* skill XP bar — work grinds visibly fill this */}
                  <div className="mt-1 h-1.5 w-3/4 overflow-hidden rounded-full bg-black/[0.08]">
                    <div
                      className="h-full rounded-full bg-[var(--lko-gold)] transition-[width] duration-500"
                      style={{ width: capped ? '100%' : `${Math.min(100, (player.skillXp[key] / toNext) * 100)}%` }}
                    />
                  </div>
                  <span className="lko-num mt-0.5 text-[9px] font-bold text-[var(--lko-ink-soft)]">
                    {capped ? 'MAX' : `${player.skillXp[key]}/${toNext}`}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* rest actions — only while actually at home (Stage 1 mechanic, preserved) */}
      <section className="lko-card mt-3 p-4" aria-label="Time and rest">
        <SectionTitle icon={<MoonIcon size={13} />}>Rest at home</SectionTitle>
        {world.currentLocation === 'home' ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                audio.play('click')
                rest('nap')
              }}
              className="lko-press flex min-h-[56px] items-center gap-2.5 rounded-xl bg-[var(--lko-gold)] px-3 py-2 text-left text-sm font-extrabold text-[#3d2a00] shadow-[inset_0_-3px_0_rgba(0,0,0,0.14)]"
            >
              <ClockIcon size={19} className="shrink-0" />
              <span>
                Nap
                <span className="mt-0.5 block text-[10px] font-bold opacity-80">+22 Energy • 1 slot</span>
              </span>
            </button>
            <button
              onClick={() => {
                audio.play('click')
                rest('sleep')
              }}
              className="lko-press flex min-h-[56px] items-center gap-2.5 rounded-xl bg-[var(--lko-green)] px-3 py-2 text-left text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]"
            >
              <MoonIcon size={19} className="shrink-0" />
              <span>
                Sleep
                <span className="mt-0.5 block text-[10px] font-bold opacity-80">Full rest • next morning</span>
              </span>
            </button>
          </div>
        ) : (
          <p className="rounded-xl bg-black/[0.03] px-4 py-3 text-center text-xs font-semibold text-[var(--lko-ink-soft)]">
            Rest is only possible at your place. Open the Map to head home.
          </p>
        )}
        {/* honest XP hint */}
        <p className="lko-num mt-2.5 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
          {Math.max(0, xpNeeded - player.xp)} XP to Level {player.level + 1}
        </p>
      </section>
    </div>
  )
}

/* --------------------------------- map tab --------------------------------- */

/** Stage 2: the map is live — see MapScreen. */
function MapTab({
  focusLocationId,
  onFocusHandled,
  onOpenWork,
}: {
  focusLocationId?: string | null
  onFocusHandled?: () => void
  onOpenWork?: () => void
}) {
  return (
    <MapScreen
      focusLocationId={focusLocationId}
      onFocusHandled={onFocusHandled}
      onOpenWork={onOpenWork}
    />
  )
}

/* --------------------------------- work tab -------------------------------- */

/** Stage 3: the economy is live — see WorkScreen. */
function WorkTab({ onGoToMap }: { onGoToMap: (locationId: string) => void }) {
  return <WorkScreen onGoToMap={onGoToMap} />
}

/* -------------------------------- phone tab -------------------------------- */

/** Stage 5: the handset — chats, bank, hustle shortcut, settings (see PhoneScreen). */
function PhoneTab({ onOpenWork }: { onOpenWork: () => void }) {
  return <PhoneScreen onOpenWork={onOpenWork} />
}

/* ---------------------------------- bag tab --------------------------------- */

function BagTab() {
  return (
    <div>
      <ComingSoon
        icon="bag"
        title="Inventory & Shops"
        stage="Stage 4"
        description="Buy food, drinks and tools; keep your pace meals and fishing gear close. A hungry hustler cannot hustle."
      />
      {/* real data teaser: actual launch menu — food emoji kept as menu flavour */}
      <section className="px-4 sm:px-6" aria-label="Coming food menu">
        <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
          The menu is getting ready
        </h3>
        <ul className="flex flex-col gap-2">
          {FOODS.slice(0, 6).map((f) => (
            <li key={f.id} className="lko-card flex items-center gap-3 p-3 opacity-80">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-lg" aria-hidden>
                {f.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">{f.name}</p>
                <p className="truncate text-[11px] text-[var(--lko-ink-soft)]">{f.description}</p>
              </div>
              <span className="lko-num text-xs font-extrabold text-[var(--lko-terra)]">{formatNaira(f.price)}</span>
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
    <div className="px-4 pt-3 sm:px-6">
      {/* identity card */}
      <section className="lko-card flex items-center gap-4 p-4" aria-label="Identity">
        <Avatar config={player.avatar} gender={player.gender} withBackdrop className="h-24 w-24 shrink-0" />
        <div className="min-w-0">
          <h2 className="lko-display truncate text-xl">{player.name}</h2>
          <p className="text-xs font-semibold capitalize text-[var(--lko-ink-soft)]">
            Hustler • {tier.name}
          </p>
          <p className="mt-1 text-[11px] italic leading-snug text-[var(--lko-ink-soft)]">
            “{tier.title}”
          </p>
        </div>
      </section>

      {/* reputation ladder */}
      <section className="lko-card mt-3 p-4" aria-label="Reputation">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
            <StarIcon size={13} className="text-[var(--lko-gold-deep)]" aria-hidden />
            Reputation
          </h3>
          <span className="lko-display lko-num text-lg text-[var(--lko-terra)]">{player.reputation}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.07]">
          <div
            className="h-full rounded-full bg-[var(--lko-terra)] transition-[width] duration-500"
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

      {/* life stats */}
      <section className="lko-card mt-3 p-4" aria-label="Life stats">
        <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
          <CoinsIcon size={13} className="text-[var(--lko-gold-deep)]" aria-hidden />
          Life so far
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">Shifts worked</p>
            <p className="lko-display lko-num text-lg text-[var(--lko-green-deep)]">{player.stats.jobsCompleted}</p>
          </div>
          <div className="rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">Hustles done</p>
            <p className="lko-display lko-num text-lg text-[var(--lko-green-deep)]">{player.stats.hustlesCompleted}</p>
          </div>
          <div className="rounded-xl bg-[var(--lko-green-soft)] px-3 py-2 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-green-deep)]">Total earned</p>
            <p className="lko-display lko-num text-base text-[var(--lko-green-deep)]">{formatNaira(player.stats.totalEarned)}</p>
          </div>
          <div className="rounded-xl bg-red-50 px-3 py-2 text-center">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-700">Total spent</p>
            <p className="lko-display lko-num text-base text-red-700">{formatNaira(player.stats.totalSpent)}</p>
          </div>
        </div>
      </section>

      {/* path & unlocks */}
      <section className="lko-card mt-3 p-4" aria-label="Your path">
        <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
          <TrendUpIcon size={13} className="text-[var(--lko-gold-deep)]" aria-hidden />
          Your path so far
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
        <p className="lko-num mt-2 text-[11px] text-[var(--lko-ink-soft)]">
          XP to Level {player.level + 1}: {Math.max(0, xpNeeded - player.xp)}
        </p>
      </section>

      {/* settings & save */}
      <section className="lko-card mt-3 mb-4 p-4" aria-label="Settings">
        <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
          <SettingsIcon size={13} className="text-[var(--lko-gold-deep)]" aria-hidden />
          Settings
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between rounded-xl border border-black/[0.06] px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-bold">
              <SoundIcon size={16} className="text-[var(--lko-ink-soft)]" aria-hidden />
              Sound
            </span>
            <button
              role="switch"
              aria-checked={settings.sound}
              aria-label="Toggle sound"
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
            className="lko-press flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)] py-3 text-sm font-extrabold text-[var(--lko-green-deep)]"
          >
            <SaveIcon size={16} />
            Save now
          </button>
          <button
            onClick={() => {
              audio.play('click')
              returnToMenu()
            }}
            className="lko-press flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white py-3 text-sm font-bold text-[var(--lko-ink)]"
          >
            <ExitIcon size={16} />
            Main menu (auto-saves)
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
  const hasActiveOpportunities = useGameStore((s) => (s.player?.activeOpportunities.length ?? 0) > 0)
  const [tab, setTab] = useState<TabKey>('home')
  /** map deep-link: which location the map should open (from work screen links) */
  const [focusLoc, setFocusLoc] = useState<string | null>(null)
  /** remount key so tab switches replay the gentle fade */
  const [tabTick, setTabTick] = useState(0)

  const xpNeeded = xpToNextLevel(player.level)
  const tier = reputationTier(player.reputation)

  const switchTab = (next: TabKey) => {
    setTab(next)
    setTabTick((t) => t + 1)
  }

  return (
    <div className="lko-root min-h-dvh">
      {/* floating notifications */}
      <div className="pointer-events-none fixed inset-x-0 top-2 z-50 mx-auto flex w-full max-w-xl flex-col items-center gap-1.5 px-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`lko-toast flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold shadow-[var(--lko-shadow-lg)] backdrop-blur-sm ${
              n.tone === 'good'
                ? 'border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)]/95 text-[var(--lko-green-deep)]'
                : n.tone === 'bad'
                  ? 'border-red-200 bg-red-50/95 text-red-700'
                  : 'border-black/10 bg-white/95 text-[var(--lko-ink)]'
            }`}
            role="status"
          >
            <span aria-hidden>{n.icon}</span>
            {n.text}
          </div>
        ))}
      </div>

      {/* the 3D world is a fullscreen mode — it replaces the page chrome */}
      {tab === 'world' && (
        <WorldTab
          onExit={() => switchTab('home')}
          onOpenWork={() => switchTab('work')}
          onOpenMap={(locId) => {
            setFocusLoc(locId)
            switchTab('map')
          }}
        />
      )}

      {tab !== 'world' && (
        <>
          {/* HUD header — one compact strip, no heavy card stack */}
          <header className="mx-auto w-full max-w-md px-4 pt-3 sm:max-w-3xl sm:px-6">
            <div className="lko-card flex items-center gap-3 px-3.5 py-2.5">
              <Avatar config={player.avatar} gender={player.gender} withBackdrop className="h-11 w-11 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="lko-display truncate text-[15px] leading-tight">{player.name}</p>
                  <span className="flex h-[18px] shrink-0 items-center rounded-full bg-[var(--lko-green)] px-1.5 text-[10px] font-extrabold text-white">
                    LV {player.level}
                  </span>
                </div>
                {/* xp bar */}
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.07]">
                  <div
                    className="h-full rounded-full bg-[var(--lko-gold)] transition-[width] duration-500"
                    style={{ width: `${Math.min(100, (player.xp / xpNeeded) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end">
                <span className="lko-display lko-num text-[17px] leading-tight text-[var(--lko-green-deep)]">
                  {formatNaira(player.cash)}
                </span>
                <Chip className="mt-0.5 bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]">
                  <StarIcon size={11} />
                  {tier.name}
                </Chip>
              </div>
            </div>
          </header>

          {/* tab content */}
          <main
            className="mx-auto w-full max-w-md pb-28 sm:max-w-3xl"
            role="tabpanel"
            aria-label={tab}
          >
            <div key={tabTick} className="lko-fade">
              {tab === 'home' && <HomeTab onExploreWorld={() => switchTab('world')} />}
              {tab === 'map' && (
                <MapTab
                  focusLocationId={focusLoc}
                  onFocusHandled={() => setFocusLoc(null)}
                  onOpenWork={() => switchTab('work')}
                />
              )}
              {tab === 'work' && (
                <WorkTab
                  onGoToMap={(locId) => {
                    setFocusLoc(locId)
                    switchTab('map')
                  }}
                />
              )}
              {tab === 'phone' && <PhoneTab onOpenWork={() => switchTab('work')} />}
              {tab === 'bag' && <BagTab />}
              {tab === 'profile' && <ProfileTab />}
            </div>
          </main>

          <BottomNav active={tab} onChange={switchTab} badge={{ work: hasActiveOpportunities }} />
        </>
      )}
    </div>
  )
}
