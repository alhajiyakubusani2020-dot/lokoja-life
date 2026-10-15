'use client'

/**
 * LOKOJA LIFE — ForgeApp (M18: THE CITY FORGE)
 * --------------------------------------------
 * The phone's forge yard: run the 3-hour pipeline on the honest
 * sample extract (import → classify → blueprint → QA → ship), read
 * the pilot ladder (Abuja first, Accra proving the continent), and
 * cast "YOUR CITY NEXT?" votes (the ballot box rides the relay when
 * claimed; the local book moves at once — offline-first).
 *
 * This UI never forges: the pipeline is pure law, the store records
 * the ledger, and the QA battery stands between every pack and ship.
 */

import { useEffect, useState } from 'react'
import { useGameStore } from '@/game/store/useGameStore'
import { PILOT_LADDER, PIPELINE, CITY_SLA_MINUTES, lokojaDefaultPack } from '@/game/systems/citypack'

export function ForgeApp() {
  const [running, setRunning] = useState(false)
  const [stageIdx, setStageIdx] = useState(-1)
  const [notice, setNotice] = useState<string | null>(null)
  const [worldCounts, setWorldCounts] = useState<Record<string, number>>({})

  const forge = useGameStore((s) => s.forge)
  const account = useGameStore((s) => s.account)
  const world = useGameStore((s) => s.world)
  const runForge = useGameStore((s) => s.runForge)
  const forgeVote = useGameStore((s) => s.forgeVote)
  const forgeVotesPull = useGameStore((s) => s.forgeVotesPull)

  useEffect(() => {
    const t = setTimeout(() => { void forgeVotesPull() }, 0)
    return () => clearTimeout(t)
  }, [forgeVotesPull])
  useEffect(() => {
    // the pull lands asynchronously — mirror the world book for the read
    const t = setInterval(() => {
      const fg = useGameStore.getState().forge
      if (fg) setWorldCounts({ ...fg.votes.counts })
    }, 4000)
    return () => clearInterval(t)
  }, [])

  if (!forge || !world) return null

  const pack = lokojaDefaultPack()
  const say = (m: string) => { setNotice(m); setTimeout(() => setNotice(null), 3400) }

  const run = async () => {
    if (running) return
    setRunning(true)
    // the stages light one by one (the honest pacing — the real run is
    // instant math; the walk-through shows the SLA's shape)
    for (let i = 0; i < PIPELINE.length; i++) {
      setStageIdx(i)
      await new Promise((r) => setTimeout(r, 550))
    }
    runForge()
    setRunning(false)
    setStageIdx(-1)
    say('🏗️ The forge ran — check the ledger below.')
  }

  return (
    <div className="flex h-full flex-col" data-testid="forge-app">
      {/* header */}
      <div className="px-4 pb-2 pt-1">
        <p className="text-[15px] font-black leading-tight">City Forge</p>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">A city na data — 3 hours, one pipeline, no program.</p>
      </div>

      {notice && <p className="mx-4 mb-2 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-800" role="status">{notice}</p>}

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {/* the home pack */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="forge-home-pack">
          <p className="text-[12px] font-black">🏗️ {pack.name} — {pack.version}</p>
          <p className="mt-0.5 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
            {pack.streets.length} streets · {pack.locations.length} doors · COL {pack.economy.colIndex} · {pack.culture.dishes.length} dishes · {pack.civic.powerZones.length} grid zones
          </p>
          <button
            data-testid="forge-run"
            onClick={() => { void run() }}
            disabled={running}
            className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] py-2 text-[11px] font-black text-white disabled:opacity-50"
          >
            {running ? 'The forge dey run…' : `Run the forge (the ${CITY_SLA_MINUTES}-min SLA)`}
          </button>
          {running && (
            <div className="mt-2 space-y-1" data-testid="forge-stages">
              {PIPELINE.map((st, i) => (
                <p key={st.key} className={`text-[10.5px] font-extrabold ${i <= stageIdx ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-ink-soft)]/60'}`}>
                  {i < stageIdx ? '✓' : i === stageIdx ? '▸' : '·'} {st.label} <span className="font-bold">({st.startsAtMinute}–{st.startsAtMinute + st.budgetMinutes} min)</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* the ledger */}
        {forge.ledger.length > 0 && (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="forge-ledger">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">The forge ledger</p>
            {forge.ledger.slice(-4).reverse().map((e, i) => (
              <p key={i} className="mt-1 text-[11px] font-bold">
                {e.verdict === 'shipped' ? '✅' : '🚫'} {e.city} · {e.version} — QA {e.qaScore}/100 · {e.totalMinutes} min · Day {e.atDay}
              </p>
            ))}
          </div>
        )}

        {/* the pilot ladder */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3" data-testid="forge-pilots">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">The pilot ladder</p>
          {PILOT_LADDER.map((c) => {
            const votes = worldCounts[c.city] ?? 0
            return (
              <div key={c.city} className="mt-1.5 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-extrabold">{c.name} <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">COL {c.colIndex}</span></p>
                  <p className="text-[9.5px] font-bold text-[var(--lko-ink-soft)] capitalize">{c.status}{votes > 0 ? ` · 🗳️ ${votes}` : ''}</p>
                </div>
                {c.status === 'voting' || c.status === 'queued' ? (
                  <button
                    data-testid={`forge-vote-${c.city}`}
                    onClick={async () => {
                      const r = await forgeVote(c.city)
                      if (!r.ok) say(r.why === 'capped' ? 'Your vote card full (3 cities).' : 'You don vote this one before.')
                    }}
                    className={`lko-press rounded-full px-2.5 py-1 text-[10px] font-extrabold ${forge.votes.mine.includes(c.city) ? 'bg-[var(--lko-green)] text-white' : 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'}`}
                  >
                    {forge.votes.mine.includes(c.city) ? '✓ Voted' : 'Vote'}
                  </button>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-800">{c.status}</span>
                )}
              </div>
            )
          })}
        </div>

        {/* the student-draft note */}
        <div className="rounded-2xl border border-dashed border-[var(--lko-green)]/40 bg-[var(--lko-green-soft)]/50 p-3">
          <p className="text-[11.5px] font-extrabold">🎓 YOUR CITY NEXT?</p>
          <p className="mt-0.5 text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
            Student-drafted packs dey welcome — you draft the extract + the Culture Pack, the QA battery checks am, the nation votes. UGC at city scale.
          </p>
          {!account.linked && <p className="mt-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">Claim your name to vote — the ballot dey check identity.</p>}
        </div>
      </div>
    </div>
  )
}
