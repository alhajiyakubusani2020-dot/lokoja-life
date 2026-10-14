'use client'

/**
 * LOKOJA LIFE — PhoneScreen (Stage 5-c)
 * -------------------------------------
 * The in-game handset. A phone works anywhere in Lokoja — this tab is
 * NOT location-bound — but it waits politely while you travel or work
 * (honest overlay, no half-states underneath).
 *
 * Home screen = 2×2 app grid:
 *   💬 Chats        — NPC contacts, one chat per NPC per in-game day
 *                     (store's chatNpc enforces; threads are component
 *                     state, see phone/ChatThread.tsx)
 *   🏦 Bank         — pocket cash ↔ bank balance via store actions only
 *   📋 Hustle Board — read-only shortcut view of accepted opportunities
 *                     + a jump into the real Work tab
 *   ⚙️ Settings     — sound toggle, autosave note, version
 *
 * Every naira moves through store actions (bankDeposit/bankWithdraw);
 * this UI never mutates player state directly. No new economy constants.
 */

import { useState } from 'react'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { canChat, relationshipFor, tierFor, TIER_META } from '@/game/systems/social'
import { hustleDefFor } from '@/game/systems/opportunities'
import { absoluteSlot } from '@/game/systems/world'
import { nepaSettleCost, kgirsSettleCost, marketForDay } from '@/game/systems/civic'
import { BIZ_TYPES, bizIncomeFor, bizUpgradeCost, staffCapFor, hasPowerBackup } from '@/game/systems/biz'
import { BIZ, CIVIC } from '@/game/data/config'
import type { BusinessState, ShopUpgradeId } from '@/game/types'
import { NPCS } from '@/game/data/npcs'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { useGameStore } from '@/game/store/useGameStore'
import { ChatThread, tierChipClass } from './phone/ChatThread'
import { GraphicsPicker } from './GraphicsPicker'
import {
  ArrowLeftIcon,
  BankIcon,
  CoinsIcon,
  CheckIcon,
  ChevronRightIcon,
  HourglassIcon,
  PlaceIcon,
  SaveIcon,
  SettingsIcon,
  SocialIcon,
  SoundIcon,
  TargetIcon,
} from '../icons'

type PhoneApp = 'grid' | 'chats' | 'bank' | 'hustle' | 'civic' | 'biz' | 'settings'

const APP_VERSION = 'Lokoja Life • Stage 5'

/* ------------------------------ tiny pieces ------------------------------- */

/** Battery flourish in the status bar — honestly tied to player energy. */
function Battery({ energy }: { energy: number }) {
  const level = Math.max(5, Math.min(100, energy))
  return (
    <span className="flex items-center" title={`Energy ${Math.round(energy)}%`}>
      <span className="flex h-[11px] w-[21px] items-center rounded-[3.5px] border border-black/40 p-[1.5px]">
        <span
          className={`h-full rounded-[2px] ${energy < 20 ? 'bg-red-500' : energy < 45 ? 'bg-[var(--lko-gold)]' : 'bg-[var(--lko-green)]'}`}
          style={{ width: `${level}%` }}
        />
      </span>
      <span className="ml-px h-[4px] w-[2px] rounded-r bg-black/40" aria-hidden />
    </span>
  )
}

interface AppDef {
  key: Exclude<PhoneApp, 'grid'>
  label: string
  sub: string
  tint: string
  icon: typeof SocialIcon
}

function AppTile({ app, onOpen }: { app: AppDef; onOpen: () => void }) {
  const IconCmp = app.icon
  return (
    <button
      onClick={onOpen}
      className="lko-press flex min-h-[100px] flex-col items-start gap-2 rounded-3xl border border-black/[0.05] bg-white p-3.5 text-left shadow-[var(--lko-shadow-sm)]"
      aria-label={`Open ${app.label} app`}
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${app.tint}`} aria-hidden>
        <IconCmp size={21} />
      </span>
      <span className="w-full">
        <span className="block text-[13.5px] font-extrabold leading-tight">{app.label}</span>
        <span className="lko-num block truncate text-[10.5px] font-bold text-[var(--lko-ink-soft)]">{app.sub}</span>
      </span>
    </button>
  )
}

/** Shared in-phone app header (back chevron + title). */
function AppHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-1 px-2 pt-1.5">
      <button
        onClick={onBack}
        aria-label="Back to apps"
        className="lko-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--lko-ink-soft)]"
      >
        <ArrowLeftIcon size={18} />
      </button>
      <h2 className="lko-display flex-1 truncate text-lg">{title}</h2>
    </div>
  )
}

/* -------------------------------- chats app ------------------------------- */

function ChatsApp({ onOpenThread }: { onOpenThread: (npcId: string) => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!

  return (
    <div className="flex flex-col gap-2 pb-2">
      <p className="px-1 pb-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
        One chat per paddy per day — small small na im friendship dey grow.
      </p>
      {NPCS.map((npc) => {
        const rel = relationshipFor(player.relationships, npc.id)
        const tier = tierFor(rel.familiarity)
        const today = !canChat(rel, world.day)
        const fresh = rel.familiarity === 0
        return (
          <button
            key={npc.id}
            onClick={() => {
              audio.play('click')
              onOpenThread(npc.id)
            }}
            className="lko-press flex min-h-[68px] items-center gap-3 rounded-2xl border border-black/[0.05] bg-white p-3 text-left shadow-[var(--lko-shadow-sm)]"
            aria-label={`Chat with ${npc.name}`}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-[var(--lko-cream)] text-xl"
              aria-hidden
            >
              {npc.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-extrabold leading-tight">{npc.name}</span>
              <span className="mt-1 flex items-center gap-1.5">
                <span className={`rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ${tierChipClass(tier)}`}>
                  {TIER_META[tier].label}
                </span>
                <span className="truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                  {LOCATION_BY_ID[npc.homeLocationId]?.name ?? 'Lokoja'}
                </span>
              </span>
            </span>
            {today ? (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[var(--lko-green-deep)]">
                <CheckIcon size={12} aria-hidden />
                Today
              </span>
            ) : (
              <span
                className={`flex shrink-0 items-center gap-0.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-extrabold ${
                  fresh ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : 'bg-[var(--lko-green)] text-white'
                }`}
              >
                {fresh ? 'Say hi' : 'Chat'}
                <ChevronRightIcon size={12} aria-hidden />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* --------------------------------- bank app -------------------------------- */

type Pick = number | 'all' | null

function BankApp() {
  const player = useGameStore((s) => s.player)!
  const deposit = useGameStore((s) => s.bankDeposit)
  const withdraw = useGameStore((s) => s.bankWithdraw)
  const [pick, setPick] = useState<Pick>(null)

  const chips: Array<{ key: string; label: string; value: number | 'all' }> = [
    { key: '1k', label: '₦1k', value: 1000 },
    { key: '5k', label: '₦5k', value: 5000 },
    { key: '25k', label: '₦25k', value: 25000 },
    { key: 'all', label: 'All', value: 'all' },
  ]

  const depAmt = pick === 'all' ? player.cash : (pick ?? 0)
  const wdrAmt = pick === 'all' ? player.bankBalance : (pick ?? 0)
  const canDep = depAmt > 0 && player.cash >= depAmt
  const canWdr = wdrAmt > 0 && player.bankBalance >= wdrAmt
  const bankRows = player.transactions.filter((t) => t.category === 'bank').slice(0, 5)

  return (
    <div className="flex flex-col gap-3 pb-2">
      {/* balances */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-black/[0.05] bg-[var(--lko-gold-soft)] p-3.5">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-gold-deep)]">
            <CoinsIcon size={13} aria-hidden />
            Pocket cash
          </p>
          <p className="lko-display lko-num mt-1 text-[19px] leading-tight text-[var(--lko-gold-deep)]">
            {formatNaira(player.cash)}
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.05] bg-[var(--lko-green-soft)] p-3.5">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-green-deep)]">
            <BankIcon size={13} aria-hidden />
            Bank balance
          </p>
          <p className="lko-display lko-num mt-1 text-[19px] leading-tight text-[var(--lko-green-deep)]">
            {formatNaira(player.bankBalance)}
          </p>
        </div>
      </div>
      <p className="-mt-1.5 px-1 text-center text-[11px] font-semibold italic text-[var(--lko-ink-soft)]">
        “Money wey dey bank dey safe.”
      </p>

      {/* amount chips */}
      <div>
        <p className="mb-1.5 px-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
          Amount
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {chips.map((c) => {
            const active = pick === c.value
            return (
              <button
                key={c.key}
                onClick={() => {
                  audio.play('click')
                  setPick(active ? null : c.value)
                }}
                aria-pressed={active}
                className={`lko-press min-h-[44px] rounded-xl border text-[13px] font-extrabold ${
                  active
                    ? 'border-[var(--lko-green)] bg-[var(--lko-green)] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.15)]'
                    : 'border-black/[0.08] bg-white text-[var(--lko-ink)]'
                }`}
              >
                {c.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => deposit(depAmt)}
          disabled={!canDep}
          className="lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--lko-green)] px-2 text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] disabled:bg-black/10 disabled:text-white/60 disabled:shadow-none"
        >
          Deposit{pick !== null && canDep ? ` ${formatNaira(depAmt)}` : ''}
        </button>
        <button
          onClick={() => withdraw(wdrAmt)}
          disabled={!canWdr}
          className="lko-press flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--lko-gold)] px-2 text-sm font-extrabold text-[#3d2a00] shadow-[inset_0_-3px_0_rgba(0,0,0,0.14)] disabled:bg-black/10 disabled:text-white/60 disabled:shadow-none"
        >
          Withdraw{pick !== null && canWdr ? ` ${formatNaira(wdrAmt)}` : ''}
        </button>
      </div>

      {/* last bank ledger rows */}
      <div>
        <p className="mb-1.5 px-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]">
          Last movements
        </p>
        {bankRows.length === 0 ? (
          <p className="rounded-2xl border border-black/[0.05] bg-white px-3.5 py-3 text-center text-[12px] font-semibold text-[var(--lko-ink-soft)]">
            No bank movement yet — your money dey wait for pocket.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {bankRows.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-black/[0.05] bg-white px-3.5 py-2.5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-bold">{t.label}</span>
                  <span className="lko-num block text-[10px] font-bold text-[var(--lko-ink-soft)]">Day {t.day}</span>
                </span>
                <span
                  className={`lko-num shrink-0 text-[12.5px] font-extrabold ${
                    t.amount < 0 ? 'text-[var(--lko-terra)]' : 'text-[var(--lko-green-deep)]'
                  }`}
                >
                  {t.amount < 0 ? '−' : '+'}
                  {formatNaira(Math.abs(t.amount))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

/* ------------------------------- hustle app ------------------------------- */

function HustleApp({ onOpenWork }: { onOpenWork: () => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const abs = absoluteSlot(world.day, world.timeOfDay)
  const rows = player.activeOpportunities

  return (
    <div className="flex flex-col gap-2 pb-2">
      {rows.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-8 text-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[var(--lko-terra)]"
            aria-hidden
          >
            <TargetIcon size={26} />
          </span>
          <p className="lko-display mt-3 text-[15px]">No hustle dey wait for you now.</p>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
            Gist dey cold fast — check the Work board make you see wetin dey hot.
          </p>
        </div>
      ) : (
        rows.map((opp) => {
          const def = hustleDefFor(opp)
          if (!def) return null
          const slotsLeft = opp.expiresAtSlot - abs
          const urgent = slotsLeft <= 2
          return (
            <div key={opp.instanceId} className="rounded-2xl border border-black/[0.05] bg-white p-3 shadow-[var(--lko-shadow-sm)]">
              <p className="text-[13.5px] font-extrabold leading-tight">{def.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
                <PlaceIcon id={opp.locationId} size={11} aria-hidden />
                {LOCATION_BY_ID[opp.locationId]?.name ?? 'Somewhere'}
                <span className="text-black/25">•</span>
                <HourglassIcon size={11} className={urgent ? 'text-[var(--lko-terra)]' : ''} aria-hidden />
                {slotsLeft <= 0 ? 'going cold!' : `${slotsLeft} slot${slotsLeft === 1 ? '' : 's'} left`}
              </p>
            </div>
          )
        })
      )}

      <button
        onClick={() => {
          audio.play('click')
          onOpenWork()
        }}
        className="lko-press mt-1 flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[var(--lko-green)] text-sm font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]"
      >
        <TargetIcon size={16} aria-hidden />
        Open the Work tab
      </button>
      <p className="px-1 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
        Accepting and doing hustles happen inside Work — this na quick look.
      </p>
    </div>
  )
}

/* ------------------------------ settings app ------------------------------ */

function SettingsApp() {
  const settings = useGameStore((s) => s.settings)
  const toggleSound = useGameStore((s) => s.toggleSound)

  return (
    <div className="flex flex-col gap-2.5 pb-2">
      <div className="flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-4 py-3">
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

      {/* M7 — RUN ON ANY DEVICE: the phone carries the device law too */}
      <GraphicsPicker />

      <div className="flex items-start gap-2.5 rounded-2xl border border-black/[0.05] bg-white px-4 py-3">
        <SaveIcon size={16} className="mt-0.5 shrink-0 text-[var(--lko-ink-soft)]" aria-hidden />
        <p className="text-[12.5px] font-semibold leading-relaxed text-[var(--lko-ink)]">
          Game dey save imself every small time.
          <span className="mt-0.5 block text-[11px] font-semibold text-[var(--lko-ink-soft)]">
            Relationships, bank balance and your progress all dey inside the save. Chat gist na per-session.
          </span>
        </p>
      </div>

      <p className="lko-num pt-1 text-center text-[10.5px] font-bold text-[var(--lko-ink-soft)]">{APP_VERSION}</p>
    </div>
  )
}

/* -------------------------------- civic app -------------------------------- */

/**
 * M2 — the civic mesh in your pocket: what you owe, what the state owes
 * you, today's market truth. Payments from the phone carry the convenience
 * fee; warrants refuse the phone entirely — some things demand a presence.
 */
function CivicApp() {
  const civic = useGameStore((s) => s.civic)
  const world = useGameStore((s) => s.world)!
  const payNepa = useGameStore((s) => s.payNepa)
  const payKgirs = useGameStore((s) => s.payKgirs)
  const mealPriceAt = useGameStore((s) => s.mealPriceAt)
  const day = world.day

  if (!civic) return null
  const m = civic.market
  const nepaCost = nepaSettleCost(civic) + CIVIC.phonePayFee
  const taxCost = kgirsSettleCost(civic) + (civic.kgirs.warrant ? 0 : CIVIC.phonePayFee)

  return (
    <div className="flex flex-col gap-2 pb-2">
      {/* NEPA */}
      <div className="rounded-2xl border border-black/[0.05] bg-white p-3">
        <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold">
          💡 NEPA
          {civic.nepa.shedding && (
            <span className="ml-auto rounded-full bg-red-50 px-2 py-0.5 text-[9.5px] font-extrabold text-red-600">LIGHT CUT</span>
          )}
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11.5px] font-bold text-[var(--lko-ink-soft)]">
          <span>{civic.nepa.owed > 0 || civic.nepa.shedding ? 'Bill due' : 'You dey current'}</span>
          <span className="lko-num font-extrabold text-[var(--lko-ink)]">
            {(civic.nepa.owed > 0 || civic.nepa.shedding) ? formatNaira(nepaCost) : formatNaira(0)}
          </span>
        </div>
        {(civic.nepa.owed > 0 || civic.nepa.shedding) && (
          <button
            onClick={() => { audio.play('click'); payNepa('phone') }}
            className="lko-press mt-2 min-h-[42px] w-full rounded-xl bg-[var(--lko-gold)] text-[12.5px] font-extrabold text-[#33230a]"
          >
            Pay online (+{formatNaira(CIVIC.phonePayFee)} fee)
          </button>
        )}
      </div>

      {/* KGIRS */}
      <div className="rounded-2xl border border-black/[0.05] bg-white p-3">
        <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold">
          🧮 KGIRS Tax
          {civic.kgirs.warrant && (
            <span className="ml-auto rounded-full bg-red-50 px-2 py-0.5 text-[9.5px] font-extrabold text-red-600">WARRANT</span>
          )}
        </p>
        <div className="mt-1.5 flex items-center justify-between text-[11.5px] font-bold text-[var(--lko-ink-soft)]">
          <span>{civic.kgirs.assessed > 0 ? `Assessment (day ${civic.kgirs.dueDay})` : 'No assessment dey wait'}</span>
          <span className="lko-num font-extrabold text-[var(--lko-ink)]">
            {civic.kgirs.assessed > 0 ? formatNaira(taxCost) : formatNaira(0)}
          </span>
        </div>
        {civic.kgirs.warrant && (
          <p className="mt-1 text-[10.5px] font-semibold leading-relaxed text-red-600">
            Warrants no fit clear by phone — walk to the police station for GRA.
          </p>
        )}
        {civic.kgirs.assessed > 0 && !civic.kgirs.warrant && (
          <button
            onClick={() => { audio.play('click'); payKgirs('phone') }}
            className="lko-press mt-2 min-h-[42px] w-full rounded-xl bg-[var(--lko-gold)] text-[12.5px] font-extrabold text-[#33230a]"
          >
            Pay online (+{formatNaira(CIVIC.phonePayFee)} fee)
          </button>
        )}
      </div>

      {/* EFCC */}
      <div className="rounded-2xl border border-black/[0.05] bg-white p-3">
        <p className="text-[12.5px] font-extrabold">🕵️ EFCC Whistleblower</p>
        {civic.efcc.pending.length === 0 ? (
          <p className="mt-1 text-[11px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]">
            No tip dey investigate. File one at the zonal command for GRA — your cut na 5% of any recovery.
          </p>
        ) : (
          <div className="mt-1.5 flex flex-col gap-1">
            {civic.efcc.pending.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-2.5 py-1.5">
                <span className="truncate text-[11px] font-bold">{t.label}</span>
                <span className="lko-num shrink-0 text-[10.5px] font-extrabold text-[var(--lko-ink-soft)]">
                  day {t.filedDay + CIVIC.efcc.resolveDays}
                </span>
              </div>
            ))}
          </div>
        )}
        {civic.efcc.rewardsTotal > 0 && (
          <p className="mt-1.5 text-[11px] font-bold text-[var(--lko-green)]">
            Rewards so far: <span className="lko-num">{formatNaira(civic.efcc.rewardsTotal)}</span>
          </p>
        )}
      </div>

      {/* Market board */}
      <div className="rounded-2xl border border-black/[0.05] bg-white p-3">
        <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold">
          🛒 Market Board
          {m.marketDay && (
            <span className="ml-auto rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9.5px] font-extrabold text-[var(--lko-green-deep)]">
              MARKET DAY
            </span>
          )}
        </p>
        {m.event && (
          <p className="mt-1.5 rounded-lg bg-[var(--lko-gold-soft)]/50 px-2.5 py-1.5 text-[11px] font-semibold leading-relaxed">
            {m.event.icon} <b>{m.event.label}</b> — {m.event.note}
          </p>
        )}
        <div className="mt-1.5 flex flex-col gap-1">
          {CIVIC.market.markets.map((mk) => {
            const mult = m.prices[mk] ?? 1
            const sample = mealPriceAt('amala', mk)
            const loc = LOCATION_BY_ID[mk]
            return (
              <div key={mk} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-2.5 py-1.5">
                <span className="text-[11px] font-bold">{loc?.shortName ?? mk}</span>
                <span className="lko-num text-[10.5px] font-extrabold text-[var(--lko-ink-soft)]">
                  ×{mult.toFixed(2)} · amala {formatNaira(sample)}
                </span>
              </div>
            )
          })}
        </div>
        <p className="mt-1 text-[10px] font-semibold text-[var(--lko-ink-soft)]">
          Day {day} — every {CIVIC.market.marketDayEvery}rd day na market day: prices soft small everywhere.
        </p>
      </div>
    </div>
  )
}

/* ------------------------------- PhoneScreen ------------------------------ */

export function PhoneScreen({ onOpenWork }: { onOpenWork?: () => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const civic = useGameStore((s) => s.civic)
  const settings = useGameStore((s) => s.settings)
  const isTravelling = useGameStore((s) => s.isTravelling)
  const isWorking = useGameStore((s) => s.isWorking)

  const [app, setApp] = useState<PhoneApp>('grid')
  const [openNpc, setOpenNpc] = useState<string | null>(null)

  const busy = isTravelling || isWorking

  const go = (next: Exclude<PhoneApp, 'grid'>) => {
    audio.play('click')
    setOpenNpc(null)
    setApp(next)
  }
  const backToGrid = () => {
    audio.play('click')
    setOpenNpc(null)
    setApp('grid')
  }

  const paddyCount = NPCS.filter((n) => tierFor(relationshipFor(player.relationships, n.id).familiarity) !== 'stranger').length

  const apps: AppDef[] = [
    {
      key: 'chats',
      label: 'Chats',
      sub: `${paddyCount} paddy dem`,
      tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green)]',
      icon: SocialIcon,
    },
    {
      key: 'bank',
      label: 'Bank',
      sub: formatNaira(player.bankBalance),
      tint: 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
      icon: BankIcon,
    },
    {
      key: 'hustle',
      label: 'Hustle Board',
      sub: `${player.activeOpportunities.length} dey wait`,
      tint: 'bg-orange-50 text-[var(--lko-terra)]',
      icon: TargetIcon,
    },
    {
      key: 'civic',
      label: 'Civic',
      sub: civic?.nepa.shedding ? 'NEPA don cut light' : civic && (civic.nepa.owed > 0 || civic.kgirs.assessed > 0) ? 'Bills dey wait' : 'Everything dey calm',
      tint: 'bg-emerald-50 text-emerald-700',
      icon: CoinsIcon,
    },
    {
      key: 'biz',
      label: 'My Biz',
      sub: bizTileSub(player.businesses),
      tint: 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
      icon: TargetIcon,
    },
    {
      key: 'settings',
      label: 'Settings',
      sub: settings.sound ? 'Sound dey on' : 'Sound dey off',
      tint: 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
      icon: SettingsIcon,
    },
  ]

  const titles: Record<Exclude<PhoneApp, 'grid'>, string> = {
    chats: 'Chats',
    bank: 'Bank',
    hustle: 'Hustle Board',
    civic: 'Civic',
    biz: 'My Biz',
    settings: 'Settings',
  }

  return (
    <div className="flex justify-center px-4 pt-3 sm:pt-4" aria-label="Your phone">
      <div className="w-full max-w-[380px]">
        {/* bezel */}
        <div className="rounded-[2.7rem] bg-[#1a1e18] p-[7px] shadow-[var(--lko-shadow-lg)]">
          {/* screen */}
          <div className="relative flex h-[clamp(560px,calc(100dvh-15rem),740px)] flex-col overflow-hidden rounded-[2.25rem] bg-[var(--lko-cream)]">
            {/* status bar */}
            <div className="relative z-10 flex shrink-0 items-center justify-between px-5 pb-1 pt-2.5">
              <span className="lko-num text-[11px] font-extrabold text-[var(--lko-ink)]">
                Day {world.day} · <span className="capitalize">{world.timeOfDay}</span>
              </span>
              <span
                className="absolute left-1/2 top-1.5 h-[20px] w-[88px] -translate-x-1/2 rounded-full bg-[#1a1e18]"
                aria-hidden
              />
              <span className="flex items-center gap-2">
                <span className="lko-num text-[11px] font-extrabold text-[var(--lko-green-deep)]">
                  {formatNaira(player.cash)}
                </span>
                <Battery energy={player.needs.energy} />
              </span>
            </div>

            {/* body */}
            {app === 'chats' && openNpc ? (
              <div className="min-h-0 flex-1">
                <ChatThread npcId={openNpc} onBack={() => setOpenNpc(null)} />
              </div>
            ) : (
              <>
                {app !== 'grid' && <AppHeader title={titles[app]} onBack={backToGrid} />}
                <div className="min-h-0 flex-1 overflow-y-auto px-3.5 pb-3 pt-1.5">
                  {app === 'grid' && (
                    <div className="flex flex-col">
                      <div className="px-1 pb-3 pt-1">
                        <p className="lko-display text-[21px] leading-tight">Wetin dey happen,</p>
                        <p className="lko-display text-[21px] leading-tight text-[var(--lko-green-deep)]">
                          {player.name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {apps.map((a) => (
                          <AppTile key={a.key} app={a} onOpen={() => go(a.key)} />
                        ))}
                      </div>
                      <p className="px-1 pb-1 pt-3 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
                        Phone dey work anywhere for Lokoja — even for keke.
                      </p>
                    </div>
                  )}
                  {app === 'chats' && <ChatsApp onOpenThread={(npcId) => setOpenNpc(npcId)} />}
                  {app === 'bank' && <BankApp />}
                  {app === 'hustle' && <HustleApp onOpenWork={() => onOpenWork?.()} />}
                  {app === 'civic' && <CivicApp />}
                  {app === 'biz' && <BizApp />}
                  {app === 'settings' && <SettingsApp />}
                </div>
              </>
            )}

            {/* home indicator */}
            <div className="pointer-events-none mx-auto mb-1.5 h-1 w-24 shrink-0 rounded-full bg-black/15" aria-hidden />

            {/* travel/work gate — the phone waits politely */}
            {busy && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(14,20,15,0.38)] backdrop-blur-[2px]">
                <p className="lko-pop mx-6 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[13px] font-extrabold text-[var(--lko-ink)] shadow-[var(--lko-shadow-md)]">
                  {isTravelling ? 'Keke dey move — phone go wait.' : 'You dey work now — phone go wait.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------- biz app --------------------------------- */

/** tile subtitle: shops owned + the total waiting in their tills */
function bizTileSub(list: BusinessState[]): string {
  if (!list.length) return 'Own a shop for Lokoja'
  const till = list.reduce((s, b) => s + b.accrued, 0)
  return till > 0 ? `${list.length} shop${list.length > 1 ? 's' : ''} · ${formatNaira(till)} inside` : `${list.length} shop${list.length > 1 ? 's' : ''} · tills empty`
}

/**
 * M3 — My Biz: every Lokoja shopfront, owned or not. Owned shops collect
 * by phone (the same ₦50 convenience fee every remote civic payment pays)
 * or in person at the shop for free; upgrades land right here too.
 */
function BizApp() {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const civic = useGameStore((s) => s.civic)!
  const collectBiz = useGameStore((s) => s.collectBiz)
  const upgradeBiz = useGameStore((s) => s.upgradeBiz)
  const hireStaff = useGameStore((s) => s.hireStaff)
  const fireStaff = useGameStore((s) => s.fireStaff)
  const installBizUpgrade = useGameStore((s) => s.installBizUpgrade)

  return (
    <div className="flex flex-col gap-2 pb-2">
      {Object.entries(BIZ_TYPES).map(([typeId, def]) => {
        const shop = player.businesses.find((b) => b.typeId === typeId)
        const where = LOCATION_BY_ID[def.locationId]?.shortName ?? def.locationId
        const today = bizIncomeFor(
          typeId,
          shop?.level ?? 1,
          world.day,
          marketForDay(civic, world.day),
          player.reputation,
          shop ? { staff: shop.staff, upgrades: shop.upgrades } : undefined,
        )
        const cost = shop ? bizUpgradeCost(typeId, shop.level) : null
        return (
          <div key={typeId} className="rounded-2xl border border-black/[0.05] bg-white p-3">
            <p className="flex items-center gap-1.5 text-[12.5px] font-extrabold">
              <span aria-hidden>{def.emoji}</span> {def.name}
              <span className="ml-auto rounded-full bg-[var(--lko-cream)] px-2 py-0.5 text-[9.5px] font-extrabold text-[var(--lko-ink-soft)]">
                {where}
              </span>
            </p>
            {!shop && (
              <p className="mt-1.5 text-[11.5px] font-bold text-[var(--lko-ink-soft)]">
                {player.level < def.unlockLevel
                  ? `Opens at Level ${def.unlockLevel} · ${formatNaira(def.buyCost)}`
                  : `For sale at ${where} · ${formatNaira(def.buyCost)} — go there buy am`}
              </p>
            )}
            {shop && (
              <>
                <div className="mt-1.5 flex items-center justify-between text-[11.5px] font-bold text-[var(--lko-ink-soft)]">
                  <span>L{shop.level}/{BIZ.maxLevel} · ~{formatNaira(today)}/day</span>
                  <span className="lko-num font-extrabold text-[var(--lko-ink)]">{formatNaira(shop.accrued)}</span>
                </div>
                {civic.nepa.shedding && !hasPowerBackup(shop.upgrades) && (
                  <p className="mt-1.5 rounded-lg bg-[#c0392b]/10 px-2 py-1 text-[10.5px] font-bold text-[#8a2a20]">
                    🔌 Shop dey run dark today — shedding take −{Math.round((1 - BIZ.sheddingIncomeFactor) * 100)}%.
                  </p>
                )}
                {/* M5 — staff + power, manageable from anywhere */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">
                    👥 {shop.staff}/{staffCapFor(shop.level)} · wage {formatNaira(BIZ.staffWagePerDay)}/day
                  </span>
                  <button
                    data-testid="phone-biz-hire"
                    onClick={() => { audio.play('click'); hireStaff(typeId) }}
                    disabled={shop.staff >= staffCapFor(shop.level) || player.cash < BIZ.staffHireFee}
                    className="lko-press min-h-[34px] rounded-lg bg-[var(--lko-green)] px-2.5 text-[10.5px] font-extrabold text-white disabled:opacity-40"
                  >
                    Hire · {formatNaira(BIZ.staffHireFee)}
                  </button>
                  {shop.staff > 0 && (
                    <button
                      onClick={() => { audio.play('click'); fireStaff(typeId) }}
                      className="lko-press min-h-[34px] rounded-lg border border-black/10 bg-white px-2.5 text-[10.5px] font-extrabold text-[var(--lko-ink-soft)]"
                    >
                      Let go
                    </button>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {(Object.entries(BIZ.upgrades) as [ShopUpgradeId, { label: string; emoji: string; cost: number }][]).map(([id, up]) =>
                    shop.upgrades.includes(id) ? (
                      <span key={id} className="rounded-full bg-[var(--lko-green)]/15 px-2 py-0.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]">
                        {up.emoji} {up.label} fitted
                      </span>
                    ) : (
                      <button
                        key={id}
                        data-testid={`phone-biz-install-${id}`}
                        onClick={() => { audio.play('click'); installBizUpgrade(typeId, id) }}
                        disabled={player.cash < up.cost}
                        className="lko-press min-h-[34px] rounded-lg border border-[var(--lko-green)]/40 bg-white px-2.5 text-[10.5px] font-extrabold text-[var(--lko-green-deep)] disabled:opacity-40"
                      >
                        {up.emoji} {up.label} · {formatNaira(up.cost)}
                      </button>
                    ),
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => { audio.play('click'); collectBiz(typeId, 'phone') }}
                    disabled={shop.accrued <= CIVIC.phonePayFee}
                    className="lko-press min-h-[40px] flex-1 rounded-xl bg-[var(--lko-green)] text-[12px] font-extrabold text-white disabled:opacity-45"
                  >
                    Collect (+{formatNaira(CIVIC.phonePayFee)} fee)
                  </button>
                  {cost !== null && (
                    <button
                      onClick={() => { audio.play('click'); upgradeBiz(typeId) }}
                      disabled={player.cash < cost}
                      className="lko-press min-h-[40px] flex-1 rounded-xl border border-[var(--lko-green)]/40 bg-white text-[12px] font-extrabold text-[var(--lko-green-deep)] disabled:opacity-45"
                    >
                      Upgrade · {formatNaira(cost)}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )
      })}
      <p className="px-1.5 pt-1 text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
        Collecting in person at the shop is always free — the fee na for phone transfer.
      </p>
    </div>
  )
}
