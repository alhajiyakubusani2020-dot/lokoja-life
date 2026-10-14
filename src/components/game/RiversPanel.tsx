'use client'

/**
 * LOKOJA LIFE — RiversPanel (M11: THE RIVERS AWAKE)
 * --------------------------------------------------
 * The river block inside the shared LocationSheet AND the 2D map's own
 * inline sheet: Crusher sand on the Patti road, sandbag segments in the
 * cut zones, the toll tier + the bowl, the fishermen's canoe + the day's
 * ferry board at the jetty, the ride fares across the water, and the
 * cold-room rescue tiers. Every naira moves through the store's river
 * actions — this panel only reads the pure gates and renders honest
 * buttons.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { RIVERS } from '@/game/data/config'
import { LOCATION_BY_ID, type LokojaLocation } from '@/game/data/locations'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import {
  riverLevelFor,
  zoneCut,
  cutZonesFor,
  segmentsLeft,
  walkwayOpen,
  canLaySegment,
  canContributeRescue,
  availableFerryGigs,
  ferryFareBetween,
  JETTY_ID,
} from '@/game/systems/rivers'

export function RiversPanel({ location }: { location: LokojaLocation }) {
  const world = useGameStore((s) => s.world)!
  const player = useGameStore((s) => s.player)!
  const rivers = useGameStore((s) => s.rivers)
  const buySand = useGameStore((s) => s.buySand)
  const laySegment = useGameStore((s) => s.laySegment)
  const setTollTier = useGameStore((s) => s.setTollTier)
  const collectTolls = useGameStore((s) => s.collectTolls)
  const buyCanoe = useGameStore((s) => s.buyCanoe)
  const takeFerry = useGameStore((s) => s.takeFerry)
  const runFerryGig = useGameStore((s) => s.runFerryGig)
  const contributeRescue = useGameStore((s) => s.contributeRescue)

  const day = world.day
  const level = riverLevelFor(day)
  const standingHere = world.currentLocation === location.id
  const cut = cutZonesFor(day)

  const isSandVendor = location.id === RIVERS.sandVendorZone
  const isJetty = location.id === JETTY_ID
  const isCutZone = zoneCut(day, location.id)
  const rescueHere = !!rivers.rescue && rivers.rescue.zoneId === location.id

  const nothingHere =
    !isSandVendor && !isJetty && !isCutZone && !rescueHere && level <= 0.01
  if (nothingHere) return null

  const w = rivers.walkways[location.id]
  const left = segmentsLeft(rivers, location.id)
  const open = walkwayOpen(rivers, location.id)
  const layGate = canLaySegment(rivers, day, location.id, world.currentLocation, rivers.sandbags)
  const rescueGate = rescueHere ? canContributeRescue(rivers, day, world.currentLocation) : null
  const gigs = isJetty ? availableFerryGigs(rivers, day, cut) : []

  return (
    <div className="mt-3 space-y-2" data-testid="rivers-panel">
      <h4 className="lko-label">The River</h4>

      {/* ---- the Crusher: sand for the walkways ---- */}
      {isSandVendor && (
        <div className="rounded-xl border border-[#92400e]/20 bg-[#fffbeb] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#92400e]">
            ⛰️ The Crusher — {formatNaira(RIVERS.sackPrice)} a sack
          </p>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[#92400e]/80">
            Sandbags hold the walkways when the Niger comes. You carry {rivers.sandbags} sack{rivers.sandbags === 1 ? '' : 's'}.
          </p>
          <div className="mt-2 flex gap-1.5">
            {[1, 5].map((n) => (
              <button
                key={n}
                data-testid={`buy-sand-${n}`}
                disabled={player.cash < n * RIVERS.sackPrice}
                onClick={() => {
                  audio.play('click')
                  buySand(n)
                }}
                className="lko-press flex-1 rounded-lg bg-[#d97706] px-2 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40"
              >
                Buy {n} sack{n > 1 ? 's' : ''} — {formatNaira(n * RIVERS.sackPrice)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- a cut zone: the walkway, the tolls, the ride out ---- */}
      {isCutZone && (
        <div className="rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">
            🌊 The water dey here — {(level * 100).toFixed(0)}% of the river dey flow
          </p>
          {!open && (
            <>
              <p className="mt-0.5 text-[10.5px] font-semibold text-[#0c4a6e]/80">
                Walkway: {RIVERS.segments[location.id] - left}/{RIVERS.segments[location.id]} segments laid ({left} left, {RIVERS.sacksPerSegment} sacks each)
              </p>
              <button
                data-testid="lay-segment"
                disabled={!layGate.ok || player.needs.energy < RIVERS.layEnergy}
                onClick={() => {
                  audio.play('click')
                  laySegment()
                }}
                className="lko-press mt-2 w-full rounded-lg bg-[#0c4a6e] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
              >
                {layGate.ok
                  ? `Lay one segment — ${RIVERS.sacksPerSegment} sacks + ${RIVERS.layEnergy} energy`
                  : layGate.why}
              </button>
              {rivers.sandbags < RIVERS.sacksPerSegment && (
                <p className="mt-1 text-[10px] font-bold text-[#0c4a6e]/70">
                  You carry {rivers.sandbags} sack{rivers.sandbags === 1 ? '' : 's'} — the Crusher dey sell on the Patti road.
                </p>
              )}
            </>
          )}
          {open && w && (
            <div className="mt-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">
                🎫 Your walkway dey open — toll {formatNaira(RIVERS.tollTiers[w.tollTier] ?? RIVERS.tollTiers[0])} · bowl {formatNaira(w.pot)}
              </p>
              <div className="mt-1.5 flex gap-1.5">
                {RIVERS.tollTiers.map((tier, i) => (
                  <button
                    key={tier}
                    data-testid={`toll-tier-${tier}`}
                    disabled={w.tollTier === i}
                    onClick={() => {
                      audio.play('click')
                      setTollTier(i)
                    }}
                    className={`lko-press flex-1 rounded-lg px-2 py-1.5 text-[11px] font-extrabold disabled:opacity-100 ${
                      w.tollTier === i ? 'bg-[#0c4a6e] text-white' : 'bg-white text-[#0c4a6e] shadow-sm'
                    }`}
                  >
                    {w.tollTier === i ? `★ ${formatNaira(tier)}` : formatNaira(tier)}
                  </button>
                ))}
                <button
                  data-testid="collect-tolls"
                  disabled={w.pot <= 0}
                  onClick={() => {
                    audio.play('click')
                    collectTolls()
                  }}
                  className="lko-press flex-1 rounded-lg bg-[var(--lko-gold)] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40"
                >
                  Collect {formatNaira(w.pot)}
                </button>
              </div>
            </div>
          )}
          {location.id !== RIVERS.cutReturnId && (
            <button
              data-testid="ferry-ride-back"
              onClick={() => {
                audio.play('click')
                takeFerry(RIVERS.cutReturnId)
              }}
              className="lko-press mt-2 w-full rounded-lg border border-[#0c4a6e]/30 bg-white px-3 py-2 text-[12px] font-extrabold text-[#0c4a6e]"
            >
              🛶 Take the canoe back — {formatNaira(ferryFareBetween(location.id, RIVERS.cutReturnId, day))}
            </button>
          )}
        </div>
      )}

      {/* ---- the jetty: the canoe, the ferry board, the rides out ---- */}
      {isJetty && cut.length > 0 && (
        <div className="rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">
            🛶 The jetty — the canoes dey wait
          </p>
          {!rivers.canoe && (
            <button
              data-testid="buy-canoe"
              disabled={player.cash < RIVERS.canoeCost}
              onClick={() => {
                audio.play('click')
                buyCanoe()
              }}
              className="lko-press mt-2 w-full rounded-lg bg-[#0c4a6e] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
            >
              Buy the fishermen's canoe — {formatNaira(RIVERS.canoeCost)} (unlock the ferry gigs)
            </button>
          )}
          {gigs.length > 0 && (
            <div className="mt-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">
                🚣 Today's boatloads{rivers.canoe ? '' : ' (need a canoe)'}
              </p>
              {gigs.map((gig) => {
                const dest = LOCATION_BY_ID[gig.toId]
                return (
                  <button
                    key={gig.id}
                    data-testid={`ferry-gig-${gig.toId}`}
                    disabled={!rivers.canoe || player.needs.energy < gig.energyCost}
                    onClick={() => {
                      audio.play('click')
                      runFerryGig(gig.id)
                    }}
                    className="lko-press mt-1.5 flex min-h-[48px] w-full items-center gap-2.5 rounded-lg border border-black/[0.05] bg-white px-2.5 py-1.5 text-left disabled:opacity-45"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-extrabold leading-tight">Boatload to {dest?.shortName ?? gig.toId}</span>
                      <span className="block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">surge price — the water dey pay</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end">
                      <span className="lko-num text-[12px] font-extrabold text-[var(--lko-green)]">+{formatNaira(gig.payout)}</span>
                      <span className="text-[9.5px] font-bold text-[var(--lko-ink-soft)]">−{gig.energyCost} energy</span>
                    </span>
                  </button>
                )
              })}
            </div>
          )}
          <p className="mt-2 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">Ride across</p>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {cut.map((zoneId) => (
              <button
                key={zoneId}
                data-testid={`ferry-ride-${zoneId}`}
                disabled={player.cash < ferryFareBetween(JETTY_ID, zoneId, day)}
                onClick={() => {
                  audio.play('click')
                  takeFerry(zoneId)
                }}
                className="lko-press flex min-h-[44px] items-center justify-between rounded-lg border border-black/[0.05] bg-white px-2.5 py-1.5 text-left disabled:opacity-45"
              >
                <span className="truncate text-[12px] font-extrabold text-[var(--lko-ink)]">🛶 To {LOCATION_BY_ID[zoneId]?.shortName ?? zoneId}</span>
                <span className="lko-num shrink-0 text-[12px] font-extrabold text-[var(--lko-terra)]">
                  {formatNaira(ferryFareBetween(JETTY_ID, zoneId, day))}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---- the jetty on a dry day: the canoe still sells ---- */}
      {isJetty && cut.length === 0 && (
        <div className="rounded-xl border border-black/[0.06] bg-white p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">
            🛶 The jetty — the river dey sleep
          </p>
          <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            Dry season. The fishermen dey mend nets — but a smart hustler buys the canoe BEFORE the water comes.
          </p>
          {!rivers.canoe && (
            <button
              data-testid="buy-canoe-dry"
              disabled={player.cash < RIVERS.canoeCost}
              onClick={() => {
                audio.play('click')
                buyCanoe()
              }}
              className="lko-press mt-2 w-full rounded-lg border border-[#0c4a6e]/30 bg-[#f0f9ff] px-3 py-2 text-[12px] font-extrabold text-[#0c4a6e] disabled:opacity-40"
            >
              Buy the fishermen's canoe — {formatNaira(RIVERS.canoeCost)}
            </button>
          )}
        </div>
      )}

      {/* ---- the cold-room rescue bowl ---- */}
      {rescueHere && rivers.rescue && (
        <div className="rounded-xl border border-[#9a3412]/20 bg-[#fff7ed] p-3">
          <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]">
            <span>🧊 Cold-room rescue bowl</span>
            <span className="tabular-nums">
              {formatNaira(rivers.rescue.pool)} / {formatNaira(RIVERS.rescue.poolTarget)}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#fdba74] to-[#ea580c] transition-[width] duration-500"
              style={{ width: `${Math.min(100, Math.round((rivers.rescue.pool / RIVERS.rescue.poolTarget) * 100))}%` }}
            />
          </div>
          <div className="mt-2 flex gap-1.5">
            {RIVERS.rescue.tiers.map((tier) => (
              <button
                key={tier}
                data-testid={`rescue-give-${tier}`}
                disabled={!rescueGate?.ok || player.cash < tier}
                onClick={() => {
                  audio.play('click')
                  contributeRescue(tier)
                }}
                className="lko-press flex-1 rounded-lg bg-[#ea580c] px-2 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40"
              >
                Drop {formatNaira(tier)}
              </button>
            ))}
          </div>
          {rescueGate && !rescueGate.ok && <p className="mt-1 text-[10px] font-bold text-[#9a3412]/70">{rescueGate.why}</p>}
        </div>
      )}

      {/* travelling eyes: the river is elsewhere — the honest pointer */}
      {!standingHere && isCutZone && (
        <div className="rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] px-3 py-2 text-[11px] font-bold text-[#0c4a6e]">
          🌊 The water dey here — take the canoe from the Motor Park jetty{open ? ', or waka the sandbag walkway' : ''}.
        </div>
      )}
    </div>
  )
}
