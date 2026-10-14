'use client'

/**
 * LOKOJA LIFE — RiversBanner (M11: THE RIVERS AWAKE)
 * ---------------------------------------------------
 * The river at a glance: the Niger's level gauge (the water keeps its
 * own year), the zones it holds today (ferry + walkway verdicts), the
 * cold-room rescue bowl when the deep surge wakes it, the sandbag
 * compound line, and the toll bowls waiting for their owner. Pure
 * presentation over the river laws — every naira moves through the
 * store's river actions.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { RIVERS } from '@/game/data/config'
import { LOCATION_BY_ID } from '@/game/data/locations'
import {
  riverLevelFor,
  zoneCut,
  cutZonesFor,
  segmentsLeft,
  walkwayOpen,
} from '@/game/systems/rivers'
import { formatNaira } from '@/game/systems/progression'

/** The level's honest word: what the water is doing to the city today. */
function levelVerdict(level: number): { label: string; tone: string } {
  if (level <= 0.01) return { label: 'Dry season — the river dey sleep inside him banks.', tone: 'text-[var(--lko-green-deep)]' }
  if (level < 0.35) return { label: 'The river dey rise small — low-lying eyes dey watch am.', tone: 'text-[#8a5a00]' }
  if (level < 0.55) return { label: 'The riverfront don go under — canoes dey work.', tone: 'text-[#0c4a6e]' }
  if (level < 0.75) return { label: 'Ganaja road don drown — the city dey paddle.', tone: 'text-[#9a4b12]' }
  return { label: 'PEAK SURGE — even Kpata dey drink. The whole city na waterfront.', tone: 'text-[#7f1d1d]' }
}

export function RiversBanner() {
  const world = useGameStore((s) => s.world)!
  const rivers = useGameStore((s) => s.rivers)

  const day = world.day
  const level = riverLevelFor(day)
  const cut = cutZonesFor(day)
  const rescue = rivers.rescue
  const walkwayZones = Object.entries(rivers.walkways).filter(([, w]) => w.laid > 0)
  const quiet = level <= 0.01 && !rescue && walkwayZones.length === 0 && rivers.sandbags === 0

  if (quiet) return null

  const verdict = levelVerdict(level)
  const pct = Math.round(level * 100)

  return (
    <div className="mb-3 space-y-2" data-testid="rivers-banner">
      {/* the river gauge */}
      <div className="rounded-2xl border border-[#0c4a6e]/20 bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe] p-3 shadow-[var(--lko-shadow-sm)]">
        <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">
          <span className="flex items-center gap-1.5">
            <span aria-hidden>🌊</span> The Niger — {pct}% full
          </span>
          <span className="tabular-nums font-bold normal-case">{RIVER_ZONE_LABEL(cut)}</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            data-testid="rivers-gauge"
            className="h-full rounded-full bg-gradient-to-r from-[#7dd3fc] via-[#38bdf8] to-[#0c4a6e] transition-[width] duration-500"
            style={{ width: `${Math.max(3, pct)}%` }}
          />
        </div>
        <p className={`mt-1.5 text-[10.5px] font-bold ${verdict.tone}`}>{verdict.label}</p>
      </div>

      {/* the zones the water holds today */}
      {cut.length > 0 && (
        <div className="flex flex-wrap gap-2" data-testid="rivers-cuts">
          {cut.map((zoneId) => {
            const left = segmentsLeft(rivers, zoneId)
            const open = walkwayOpen(rivers, zoneId)
            return (
              <span
                key={zoneId}
                data-testid={`rivers-cut-${zoneId}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0c4a6e]/10 px-3 py-1.5 text-[11px] font-extrabold text-[#0c4a6e]"
              >
                🌊 {LOCATION_BY_ID[zoneId]?.shortName ?? zoneId} cut
                {open
                  ? ' · walkway open — walk careful'
                  : left > 0
                    ? ` · walkway: ${left} segment${left === 1 ? '' : 's'} left`
                    : ' · ferry na the road now'}
              </span>
            )
          })}
        </div>
      )}

      {/* the cold-room rescue bowl */}
      {rescue && (
        <div className="rounded-2xl border border-[#9a3412]/20 bg-white p-3 shadow-[var(--lko-shadow-sm)]">
          <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]">
            <span className="flex items-center gap-1.5">
              <span aria-hidden>🧊</span> Cold-room rescue — {LOCATION_BY_ID[rescue.zoneId]?.name ?? rescue.zoneId}
            </span>
            <span className="tabular-nums">
              {formatNaira(rescue.pool)} / {formatNaira(RIVERS.rescue.poolTarget)}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              data-testid="rivers-rescue-pool"
              className="h-full rounded-full bg-gradient-to-r from-[#fdba74] to-[#ea580c] transition-[width] duration-500"
              style={{ width: `${Math.min(100, Math.round((rescue.pool / RIVERS.rescue.poolTarget) * 100))}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
            {rescue.zoneId === world.currentLocation
              ? 'You dey inside the cold-room zone — drop your tier for the day.'
              : `Contribute from inside ${LOCATION_BY_ID[rescue.zoneId]?.name ?? rescue.zoneId}. Full bowl = the trucks roll to the Patti high ground.`}
          </p>
        </div>
      )}

      {/* the compound + the toll bowls */}
      {(rivers.sandbags > 0 || walkwayZones.length > 0) && (
        <div className="flex flex-wrap gap-2" data-testid="rivers-compound">
          {rivers.sandbags > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7] px-3 py-1.5 text-[11px] font-extrabold text-[#92400e]">
              🧱 {rivers.sandbags} Crusher sack{rivers.sandbags === 1 ? '' : 's'} in your compound
            </span>
          )}
          {walkwayZones.map(([zoneId, w]) => {
            const open = walkwayOpen(rivers, zoneId)
            const tier = RIVERS.tollTiers[w.tollTier] ?? RIVERS.tollTiers[0]
            return (
              <span key={zoneId} className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-3 py-1.5 text-[11px] font-extrabold text-[#14532d]">
                🛤️ {LOCATION_BY_ID[zoneId]?.shortName ?? zoneId}: {open ? `walkway open · toll ${formatNaira(tier)} · bowl ${formatNaira(w.pot)}` : `${w.laid}/${RIVERS.segments[zoneId]} segments laid`}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** The cut-zone count's honest word for the gauge header. */
function RIVER_ZONE_LABEL(cut: string[]): string {
  if (cut.length === 0) return 'all roads open'
  return `${cut.length} zone${cut.length === 1 ? '' : 's'} under water`
}
