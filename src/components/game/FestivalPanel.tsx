'use client'

/**
 * LOKOJA LIFE — FestivalPanel (M10: THE LIVING CALENDAR)
 * -------------------------------------------------------
 * The venue block inside the shared LocationSheet: today's festival
 * attendance, the Regatta's crews + bookie, the ram market + meat
 * sharing, the wedding's gift table (with aso-ebi respect), and the
 * paving pool's tiers. Every naira moves through the store's festival
 * actions — this panel only reads the pure gates and renders honest
 * buttons.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { FESTIVALS } from '@/game/data/config'
import { LOCATION_BY_ID, type LokojaLocation } from '@/game/data/locations'
import { NPC_BY_ID } from '@/game/data/npcs'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import {
  festivalForDay,
  weddingForCycle,
  canAttendFestival,
  ramMarketDayIndex,
  ramPriceFor,
  canBuyRam,
  canShareMeat,
  inMeatSeason,
  canSponsor,
  canBet,
  regattaTeamsFor,
  yearOf,
  canAttendWedding,
  canContributePaving,
} from '@/game/systems/calendar'

export function FestivalPanel({ location }: { location: LokojaLocation }) {
  const world = useGameStore((s) => s.world)!
  const player = useGameStore((s) => s.player)!
  const calendar = useGameStore((s) => s.calendar)
  const account = useGameStore((s) => s.account)
  const attendFestival = useGameStore((s) => s.attendFestival)
  const buyRam = useGameStore((s) => s.buyRam)
  const shareMeat = useGameStore((s) => s.shareMeat)
  const sponsorBoat = useGameStore((s) => s.sponsorBoat)
  const betBoat = useGameStore((s) => s.betBoat)
  const attendWedding = useGameStore((s) => s.attendWedding)
  const contributePaving = useGameStore((s) => s.contributePaving)

  const day = world.day
  const standingHere = world.currentLocation === location.id
  const festival = festivalForDay(day)
  const wedding = weddingForCycle(day)
  const ramDay = ramMarketDayIndex(day)
  const year = yearOf(day)

  const atFestivalVenue = !!festival && festival.venueId === location.id
  const atWeddingVenue = wedding.isToday && wedding.venueId === location.id
  const atRamMarket = ramDay > 0 && location.id === 'kpata-market'
  const atPaving = !!calendar.paving && calendar.paving.zoneId === location.id
  const nothingHere = !atFestivalVenue && !atWeddingVenue && !atRamMarket && !atPaving

  if (nothingHere) return null

  const festivalGate = atFestivalVenue ? canAttendFestival(calendar, day, world.currentLocation) : null
  const weddingGate = atWeddingVenue ? canAttendWedding(calendar, world.currentLocation, wedding) : null
  const ramGate = atRamMarket ? canBuyRam(day, world.currentLocation, player.cash) : null
  const pavingGate = atPaving ? canContributePaving(calendar, day, world.currentLocation) : null
  const hasAsoEbi = calendar.asoEbi.includes(wedding.id)

  /* travelling eyes: the venue is elsewhere — show the honest pointer */
  if (!standingHere) {
    const here = atFestivalVenue ? festival! : atWeddingVenue ? { icon: '💍', name: `${wedding.couple} wedding` } : atRamMarket ? { icon: '🐏', name: 'Ram market' } : { icon: '🛣️', name: 'Paving project' }
    return (
      <div data-testid="festival-here-hint" className="mt-3 rounded-xl border border-[#8a5a00]/20 bg-[#fff8ec] px-3 py-2 text-[11px] font-bold text-[#8a5a00]">
        <span aria-hidden>{here.icon}</span> {here.name} dey here — travel first to join.
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-2" data-testid="festival-panel">
      <h4 className="lko-label">The Calendar</h4>

      {/* ---- today's festival: attend ---- */}
      {festival && atFestivalVenue && (
        <div className="rounded-xl border border-[#8a5a00]/25 bg-gradient-to-r from-[#fff8ec] to-[#fdeecd] p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#8a5a00]">
            <span aria-hidden>{festival.icon}</span> {festival.name} {festival.daysLeft > 1 ? `— day ${festival.daysLeft} to go` : '— today'}
          </p>
          <p className="mt-0.5 text-[11px] font-semibold text-[#4a3200]">{festival.note}</p>
          <button
            data-testid="festival-attend"
            disabled={!festivalGate?.ok}
            onClick={() => {
              audio.play('click')
              attendFestival()
            }}
            className="lko-press mt-2 w-full rounded-lg bg-[#ffd166] px-3 py-2 text-[12px] font-extrabold text-[#4a3200] disabled:opacity-40"
          >
            {festivalGate?.ok ? `Join the celebration (mood +${FESTIVALS.attend.mood}${FESTIVALS.attend.repFestivals.includes(festival.id) ? `, rep +${FESTIVALS.attend.rep}` : ''}, naira spray)` : festivalGate?.why ?? '…'}
          </button>
        </div>
      )}

      {/* ---- the regatta: crews + the bookie ---- */}
      {festival?.id === 'regatta' && atFestivalVenue && standingHere && (
        <div className="rounded-xl border border-[#0c4a6e]/20 bg-[#f0f9ff] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">🚤 The crews — sponsor one for {formatNaira(FESTIVALS.sponsorFee)}</p>
          {(() => {
            const sponsoredThisYear = calendar.sponsored.find((s) => s.year === year)
            return (
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {regattaTeamsFor(year).map((team) => (
                  <button
                    key={team}
                    data-testid={`regatta-team-${team.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                    disabled={!!sponsoredThisYear || player.cash < FESTIVALS.sponsorFee}
                    onClick={() => {
                      audio.play('click')
                      sponsorBoat(team)
                    }}
                    className={`lko-press rounded-lg px-2 py-1.5 text-[10.5px] font-extrabold disabled:opacity-40 ${
                      sponsoredThisYear?.teamId === team ? 'bg-[#0c4a6e] text-white' : 'bg-white text-[#0c4a6e] shadow-sm'
                    }`}
                  >
                    {sponsoredThisYear?.teamId === team ? `★ ${team}` : team}
                  </button>
                ))}
              </div>
            )
          })()}
          {festival.daysLeft === FESTIVALS.anchors.regattaDays && (
            <div className="mt-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#0c4a6e]">
                🎲 Bookie — race-eve stakes ({FESTIVALS.betOdds}× if your boat carries the day)
              </p>
              {(() => {
                const bet = canBet(calendar, day, world.currentLocation, account.ageBand)
                const staked = calendar.bets.find((b) => b.year === year)
                return (
                  <div className="mt-1.5 flex gap-1.5">
                    {FESTIVALS.betTiers.map((tier) => (
                      <button
                        key={tier}
                        data-testid={`bet-tier-${tier}`}
                        disabled={!bet.ok || player.cash < tier || !!staked}
                        onClick={() => {
                          audio.play('click')
                          betBoat(staked?.teamId ?? regattaTeamsFor(year)[0], tier)
                        }}
                        className="lko-press flex-1 rounded-lg bg-white px-2 py-1.5 text-[11px] font-extrabold text-[#0c4a6e] shadow-sm disabled:opacity-40"
                      >
                        {formatNaira(tier)}
                      </button>
                    ))}
                  </div>
                )
              })()}
              {!canBet(calendar, day, world.currentLocation, account.ageBand).ok && (
                <p className="mt-1 text-[10px] font-bold text-[#0c4a6e]/70">{canBet(calendar, day, world.currentLocation, account.ageBand).why}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---- the ram market ---- */}
      {atRamMarket && (
        <div className="rounded-xl border border-[#9a3412]/20 bg-[#fff7ed] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]">
            🐏 Ram market — day {ramDay} · one ram = {FESTIVALS.meatPacksPerRam} meat packs
          </p>
          <button
            data-testid="ram-buy"
            disabled={!ramGate?.ok}
            onClick={() => {
              audio.play('click')
              buyRam()
            }}
            className="lko-press mt-2 w-full rounded-lg bg-[#ea580c] px-3 py-2 text-[12px] font-extrabold text-white disabled:opacity-40"
          >
            {ramGate?.ok ? `Buy the ram — ${formatNaira(ramPriceFor(day))}` : ramGate?.why ?? '…'}
          </button>
          {calendar.meatPacks > 0 && inMeatSeason(day) && (
            <div className="mt-2">
              <p className="text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#9a3412]">
                🍖 Share the meat ({calendar.meatPacks} pack{calendar.meatPacks === 1 ? '' : 's'} left) — +{FESTIVALS.meatShareFamiliarity} familiarity each
              </p>
              {(() => {
                const paddies = Object.keys(player.relationships).filter((id) => NPC_BY_ID[id])
                const shareable = paddies.filter((id) => canShareMeat(calendar, day, id).ok)
                if (paddies.length === 0) {
                  return <p className="mt-1 text-[10.5px] font-bold text-[#9a3412]/70">Make friends first — meat follows familiarity.</p>
                }
                return (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {paddies.slice(0, 8).map((id) => (
                      <button
                        key={id}
                        data-testid={`share-meat-${id}`}
                        disabled={!shareable.includes(id)}
                        onClick={() => {
                          audio.play('click')
                          shareMeat(id)
                        }}
                        className="lko-press rounded-full bg-white px-2.5 py-1 text-[10.5px] font-extrabold text-[#9a3412] shadow-sm disabled:opacity-35"
                      >
                        {NPC_BY_ID[id].name}
                      </button>
                    ))}
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* ---- the wedding ---- */}
      {wedding.isToday && atWeddingVenue && (
        <div className="rounded-xl border border-[#9d174d]/20 bg-[#fdf2f8] p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#9d174d]">
            💍 {wedding.couple} — the canopies dey up {hasAsoEbi ? '· aso-ebi dey body you ✔' : '· you no buy aso-ebi'}
          </p>
          <div className="mt-2 flex gap-1.5">
            {FESTIVALS.weddingGiftTiers.map((tier) => (
              <button
                key={tier}
                data-testid={`wedding-gift-${tier}`}
                disabled={!weddingGate?.ok || player.cash < tier}
                onClick={() => {
                  audio.play('click')
                  attendWedding(tier)
                }}
                className="lko-press flex-1 rounded-lg bg-white px-2 py-1.5 text-[11px] font-extrabold text-[#9d174d] shadow-sm disabled:opacity-40"
              >
                Gift {formatNaira(tier)}
              </button>
            ))}
          </div>
          {weddingGate && !weddingGate.ok && <p className="mt-1 text-[10px] font-bold text-[#9d174d]/70">{weddingGate.why}</p>}
        </div>
      )}

      {/* ---- the paving pool ---- */}
      {calendar.paving && atPaving && (
        <div className="rounded-xl border border-black/[0.06] bg-white p-3">
          <div className="flex items-center justify-between text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]">
            <span>🛣️ Paving pool</span>
            <span className="tabular-nums">
              {formatNaira(calendar.paving.pool)} / {formatNaira(FESTIVALS.pavingTarget)}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#86c99b] to-[var(--lko-green)] transition-[width] duration-500"
              style={{ width: `${Math.min(100, Math.round((calendar.paving.pool / FESTIVALS.pavingTarget) * 100))}%` }}
            />
          </div>
          <div className="mt-2 flex gap-1.5">
            {FESTIVALS.pavingTiers.map((tier) => (
              <button
                key={tier}
                data-testid={`paving-give-${tier}`}
                disabled={!pavingGate?.ok || player.cash < tier}
                onClick={() => {
                  audio.play('click')
                  contributePaving(tier)
                }}
                className="lko-press flex-1 rounded-lg bg-[var(--lko-gold)] px-2 py-1.5 text-[11px] font-extrabold text-[#4a3200] disabled:opacity-40"
              >
                Drop {formatNaira(tier)}
              </button>
            ))}
          </div>
          {pavingGate && !pavingGate.ok && <p className="mt-1 text-[10px] font-bold text-[var(--lko-ink-soft)]">{pavingGate.why}</p>}
        </div>
      )}
    </div>
  )
}
