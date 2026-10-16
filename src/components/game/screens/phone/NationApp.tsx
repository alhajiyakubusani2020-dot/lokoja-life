'use client'

/**
 * M20 — THE NATION DASHBOARD (the ops app)
 * -----------------------------------------
 * The city's honest mirror: the live crowd (the worker's aggregate —
 * numbers, never people), the naira's liquidity ledger, the moderation
 * book (refusal counts — no text exists to read), the forge's ledger,
 * the live nation's health, and the OPS row (flags + telemetry opt-in
 * + the last-good deploy book).
 *
 * EVERY number here is a real local fact — the dashboard invents
 * nothing, rounds nothing up, and goes quiet when the books are empty.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { moderationScore, inflationTrend } from '@/game/systems/nation'
import { readManifest } from '@/game/systems/flags'
import type { FlagKey } from '@/game/systems/flags'
import { useEffect, useState } from 'react'

const WHY_LABELS: Record<string, string> = {
  'kid-text-refused': 'Kid mic (by law)',
  'word-wall': 'Word wall',
  'no-links-ever': 'No links ever',
  'too-long': 'Too long',
  empty: 'Empty',
  'guest-mic-dark': 'Guest mic dark',
}

export function NationApp() {
  const nation = useGameStore((s) => s.nation)
  const snap = useGameStore((s) => s.nationSnapshot)
  const path = useGameStore((s) => s.nationPath)
  const opsFlags = useGameStore((s) => s.opsFlags)
  const liveWire = useGameStore((s) => s.liveWire)
  const live = useGameStore((s) => s.live)
  const forge = useGameStore((s) => s.forge)
  const nationSetCrowd = useGameStore((s) => s.nationSetCrowd)
  const opsSetFlag = useGameStore((s) => s.opsSetFlag)
  const setTelemetryOptIn = useGameStore((s) => s.setTelemetryOptIn)
  const [manifest, setManifest] = useState<{ version: string; at: number }[]>([])

  useEffect(() => {
    // deferred read — the deploy book is device-side, never on the SSR path
    const t = setTimeout(() => setManifest(readManifest()), 0)
    return () => clearTimeout(t)
  }, [])

  if (!nation) return null

  const trend = inflationTrend(nation.inflation)
  const modRows = moderationScore(nation.moderation)
  const modTotal = nation.moderation.length
  const lastForge = forge?.ledger && forge.ledger.length > 0 ? forge.ledger[forge.ledger.length - 1] : null
  const presence = liveWire?.roster?.length ?? 0
  const events = liveWire?.events?.length ?? 0
  const liveStats = live?.stats

  return (
    <div className="flex h-full flex-col" data-testid="nation-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Nation Dashboard</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
          The city&apos;s honest mirror — numbers only, no wahala
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* THE CROWD — the worker's aggregate */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="nation-crowd">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">The Crowd</span>
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-black"
              data-testid="nation-crowd-path"
            >
              {snap ? (path === 'worker' ? 'worker thread' : 'main thread') : nation.crowd.on ? 'warming…' : 'asleep'}
            </span>
          </div>
          {snap ? (
            <>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-[20px] font-black leading-none text-[var(--lko-green)]" data-testid="nation-crowd-total">
                  {snap.total.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
                  souls · mood {snap.avgMood} · pocket ₦{snap.avgWealth.toLocaleString()}
                </span>
              </div>
              <div className="space-y-1">
                {snap.districts.map((d) => (
                  <div key={d.id} className="flex items-center gap-2" data-testid={`nation-district-${d.id}`}>
                    <span className="w-[86px] shrink-0 truncate text-[9.5px] font-bold text-[var(--lko-ink-soft)]">{d.id}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                      <div
                        className="h-full rounded-full bg-[var(--lko-green)]"
                        style={{ width: `${Math.min(100, (d.pop / snap.total) * 100 * 4)}%` }}
                      />
                    </div>
                    <span className="w-[92px] shrink-0 text-right text-[9px] font-bold text-[var(--lko-ink-soft)]">
                      {d.pop} · {d.top} · {d.mood}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
              {nation.crowd.on ? 'The nation dey wake…' : 'The crowd sleeps — wake am below.'}
            </p>
          )}
          <div className="mt-2 flex items-center justify-between rounded-xl bg-[var(--lko-green-soft)] px-2.5 py-1.5">
            <span className="text-[10px] font-bold text-[var(--lko-ink)]">Crowd sim</span>
            <button
              type="button"
              data-testid="nation-crowd-toggle"
              className="lko-press rounded-lg bg-[var(--lko-green)] px-2.5 py-1 text-[9.5px] font-black text-white"
              onClick={() => nationSetCrowd(!nation.crowd.on)}
            >
              {nation.crowd.on ? 'DARK AM' : 'WAKE AM'}
            </button>
          </div>
        </div>

        {/* THE NAIRA — the inflation ledger */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="nation-inflation">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Naira Weather</span>
            {trend.rows > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${trend.hot ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`} data-testid="nation-inflation-trend">
                avg ×{trend.avg.toFixed(2)}{trend.hot ? ' HOT' : ' calm'}
              </span>
            )}
          </div>
          {nation.inflation.length === 0 ? (
            <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
              The ledger waits for the first day roll — the SAME channel the market reads.
            </p>
          ) : (
            <div className="space-y-1">
              {nation.inflation.slice(-6).reverse().map((row) => (
                <div key={row.day} className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-[var(--lko-ink-soft)]">Day {row.day}</span>
                  <span className={row.mult >= 1.1 ? 'text-red-700' : row.mult <= 0.95 ? 'text-[var(--lko-river)]' : 'text-[var(--lko-ink)]'}>
                    ×{row.mult.toFixed(2)} {row.mult >= 1.12 ? '— prices dey bite' : row.mult >= 1.08 ? '— market hot' : row.mult <= 0.95 ? '— slow waka' : '— steady'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* THE MODERATION BOOK — counts only, the type carries no text */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="nation-moderation">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Moderation</span>
            <span className="text-[9px] font-bold text-[var(--lko-ink-soft)]">{modTotal} refusals · words NEVER stored</span>
          </div>
          {modRows.length === 0 ? (
            <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">Clean streets — nothing refused yet.</p>
          ) : (
            <div className="space-y-1">
              {modRows.map((row) => (
                <div key={row.why} className="flex items-center justify-between text-[10px] font-bold" data-testid={`nation-mod-${row.why}`}>
                  <span className="text-[var(--lko-ink-soft)]">{WHY_LABELS[row.why] ?? row.why}</span>
                  <span className="text-[var(--lko-ink)]">×{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* THE LIVE NATION — health */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="nation-live">
          <span className="text-[11px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Live Nation</span>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-center">
            <div className="rounded-xl bg-[var(--lko-river-soft)] px-1 py-1.5">
              <div className="text-[14px] font-black text-[var(--lko-river)]">{presence}</div>
              <div className="text-[8.5px] font-bold text-[var(--lko-ink-soft)]">present</div>
            </div>
            <div className="rounded-xl bg-[var(--lko-green-soft)] px-1 py-1.5">
              <div className="text-[14px] font-black text-[var(--lko-green)]">{events}</div>
              <div className="text-[8.5px] font-bold text-[var(--lko-ink-soft)]">events</div>
            </div>
            <div className="rounded-xl bg-[var(--lko-gold-soft)] px-1 py-1.5">
              <div className="text-[14px] font-black text-[var(--lko-gold-deep)]">{liveStats ? liveStats.tradesDone + liveStats.chats : 0}</div>
              <div className="text-[8.5px] font-bold text-[var(--lko-ink-soft)]">my moves</div>
            </div>
          </div>
        </div>

        {/* THE FORGE — pack + last verdict */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="nation-forge">
          <span className="text-[11px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Forge</span>
          {lastForge ? (
            <p className="mt-1 text-[10.5px] font-bold text-[var(--lko-ink)]" data-testid="nation-forge-last">
              {lastForge.verdict === 'shipped' ? '✅' : '🛑'} {lastForge.city} · QA {lastForge.qaScore}/100 · {lastForge.totalMinutes}min · day {lastForge.atDay}
            </p>
          ) : (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">The ledger is empty — run the forge.</p>
          )}
        </div>

        {/* THE OPS ROW — flags + telemetry + deploys */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="nation-ops">
          <span className="text-[11px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]">Ops</span>
          <div className="mt-1.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[var(--lko-ink)]">Telemetry</span>
              <button
                type="button"
                data-testid="nation-telemetry-toggle"
                className={`lko-press rounded-lg px-2.5 py-1 text-[9.5px] font-black text-white ${nation.telemetryOptIn ? 'bg-[var(--lko-terra)]' : 'bg-[var(--lko-green)]'}`}
                onClick={() => setTelemetryOptIn(!nation.telemetryOptIn)}
              >
                {nation.telemetryOptIn ? 'ON — quiet numbers' : 'OFF — yours only'}
              </button>
            </div>
            <p className="text-[9px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
              Opt-in counts day-rolls and travels. A child&apos;s copy stays dark even if a flag says yes — the wall is structural.
            </p>
            {(Object.keys(opsFlags) as FlagKey[]).filter((k) => k !== 'telemetryAsk').map((k) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--lko-ink)]">flag: {k}</span>
                <button
                  type="button"
                  data-testid={`nation-flag-${k}`}
                  className="lko-press rounded-lg bg-black/[0.05] px-2.5 py-1 text-[9.5px] font-black text-[var(--lko-ink)]"
                  onClick={() => opsSetFlag(k, !opsFlags[k])}
                >
                  {opsFlags[k] ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
            <div className="border-t border-black/[0.05] pt-1.5">
              <span className="text-[10px] font-bold text-[var(--lko-ink)]">Last-good deploys</span>
              {manifest.length === 0 ? (
                <p className="text-[9px] font-semibold text-[var(--lko-ink-soft)]">The book fills as shells ship (one per boot).</p>
              ) : (
                <div className="mt-0.5 space-y-0.5">
                  {manifest.slice(0, 3).map((row, i) => (
                    <div key={`${row.version}-${i}`} className="flex items-center justify-between text-[9.5px] font-bold" data-testid={`nation-deploy-${i}`}>
                      <span className="text-[var(--lko-ink)]">{i === 0 ? '● ' : '○ '}{row.version}</span>
                      <span className="text-[var(--lko-ink-soft)]">{new Date(row.at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-1 text-[9px] font-semibold text-[var(--lko-ink-soft)]">Rollback na one command: bun run ops:rollback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
