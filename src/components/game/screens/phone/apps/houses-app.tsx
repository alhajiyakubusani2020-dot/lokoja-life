'use client'

/**
 * M21 — HOUSES APP (the rent book in your pocket)
 * -----------------------------------------------
 * The roof over the hustle, honest: the M12 housing slice exactly as
 * the save keeps it — owned property or the rented room, the rent book
 * (owed, paid-through, next cycle day), the live landlord wahala, and
 * the real stats the book counts (rentPaid / wahalaResolved /
 * cyclesLate). Money moves ONLY through the store's REAL doors:
 *   payRent('phone')  — the phone transfer carries the ₦50 fee, and the
 *                       door itself refuses unless you dey house (its law)
 *   resolveWahala()   — settle the live wahala at its real cost
 *   furnishHome(tier) — one honest tier at a time, owners only
 * The ladder rows read the REAL config table (price/level/comfort) and
 * the canBuyProperty law — no invented keys, no fake "coming soon".
 */

import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { PROPERTIES, propertyFor, canBuyProperty, canFurnish, homeComfort } from '@/game/systems/housing'
import { LADDER, CIVIC } from '@/game/data/config'
import { LOCATION_BY_ID } from '@/game/data/locations'

export const APP_ID = 'houses'
export const APP_TITLE = 'Houses'
export const APP_GLYPH = '🏠'

export default function HousesApp() {
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  const housing = useGameStore((s) => s.housing)
  const payRent = useGameStore((s) => s.payRent)
  const resolveWahala = useGameStore((s) => s.resolveWahala)
  const furnishHome = useGameStore((s) => s.furnishHome)
  if (!player || !world) return null

  const H = LADDER.housing
  const owned = housing.owned ? propertyFor(housing.owned) : null
  const nextCycleDay = housing.lastPostedDay + H.rentCycleDays
  const behind = housing.rentOwed >= H.baseRent * 2
  const tier = owned ? housing.furnishing[owned.id] ?? 0 : 0
  const nextTier = canFurnish(housing, tier + 1)

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="houses-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Houses</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
          The rent book no dey lie — every naira na the book&apos;s own
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* your roof */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="houses-roof">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Your Roof</span>
          {owned ? (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="houses-owned">
              {owned.name} — yours. Comfort {owned.comfort} (+{homeComfort(housing)} to the sleep law with furnishing),
              {LOCATION_BY_ID[owned.locationId] ? ` ${LOCATION_BY_ID[owned.locationId].name}` : ''}.
            </p>
          ) : (
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]" data-testid="houses-renting">
              You dey rent the basic room at Your Place — {formatNaira(H.baseRent)} a cycle of {H.rentCycleDays} days.
              The ladder climbs by BUYING.
            </p>
          )}
        </div>

        {/* the rent book — renters only, the law says so */}
        {!housing.owned && (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="houses-rent-book">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Rent Book</span>
              {housing.rentOwed > 0 ? (
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${behind ? 'bg-red-50 text-red-700' : 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]'}`}>
                  {behind ? 'TWO CYCLES BEHIND — the notice dey load' : 'owing'}
                </span>
              ) : (
                <span className="rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green)]">clean</span>
              )}
            </div>
            <div className="mt-1.5 space-y-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
              <p>owed now: <span className="font-extrabold text-[var(--lko-ink)]">{formatNaira(housing.rentOwed)}</span></p>
              <p>next cycle posts: day {nextCycleDay} · paid through: day {housing.rentPaidThrough}</p>
              <p>lifetime paid {formatNaira(housing.stats.rentPaid)} · wahala settled ×{housing.stats.wahalaResolved} · late ×{housing.stats.cyclesLate}</p>
            </div>
            {housing.rentOwed > 0 && (
              <button
                type="button"
                data-testid="houses-pay-rent"
                className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[10px] font-black text-white"
                onClick={() => { audio.play('click'); payRent('phone') }}
              >
                PAY ONE CYCLE — {formatNaira(Math.min(housing.rentOwed, H.baseRent))} (+{formatNaira(CIVIC.phonePayFee)} phone fee, at home)
              </button>
            )}
          </div>
        )}

        {/* the live wahala */}
        {housing.wahala && (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="houses-wahala">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Landlord Wahala</span>
              <span className="text-[9px] font-bold text-[var(--lko-ink-soft)]">day {housing.wahala.day} · {housing.wahala.kind}</span>
            </div>
            <p className="mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">{housing.wahala.note}</p>
            {housing.wahala.cost > 0 ? (
              <button
                type="button"
                data-testid="houses-resolve-wahala"
                className="lko-press mt-2 w-full rounded-xl bg-[var(--lko-terra)] px-3 py-2 text-[10px] font-black text-white"
                onClick={() => { audio.play('click'); resolveWahala() }}
              >
                SETTLE — {formatNaira(housing.wahala.cost)}
              </button>
            ) : (
              <p className="mt-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">This one na rent problem — pay the rent book, the wahala follows.</p>
            )}
          </div>
        )}

        {/* furnishing — owners only */}
        {owned && (
          <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="houses-furnish">
            <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">Furnishing</span>
            <p className="mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
              {tier === 0 ? 'Bare room — the fan dey wait.' : `Tier ${tier} fitted.`}
              {' '}Sleep law: +{H.sleepEnergyPerComfort} energy per comfort point.
            </p>
            <div className="mt-1.5 space-y-1">
              {H.furnishTiers.map((f) => (
                <div key={f.tier} className="flex items-center justify-between rounded-xl bg-black/[0.03] px-2.5 py-1.5">
                  <span className="text-[10px] font-bold text-[var(--lko-ink)]">
                    T{f.tier} · {f.label} · mood +{f.mood}
                  </span>
                  {f.tier <= tier ? (
                    <span className="rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green)]">FITTED</span>
                  ) : f.tier === tier + 1 ? (
                    <button
                      type="button"
                      data-testid={`houses-furnish-${f.tier}`}
                      className="lko-press rounded-lg bg-[var(--lko-green)] px-2.5 py-1 text-[9.5px] font-black text-white"
                      onClick={() => { audio.play('click'); furnishHome(f.tier) }}
                    >
                      {formatNaira(f.cost)}
                    </button>
                  ) : (
                    <span className="text-[9px] font-bold text-[var(--lko-ink-soft)]">finish tier {tier + 1} first</span>
                  )}
                </div>
              ))}
            </div>
            {!nextTier.ok && tier >= H.furnishTiers.length && (
              <p className="mt-1 text-[9px] font-semibold text-[var(--lko-ink-soft)]">Full AC + solar — nothing left to fit.</p>
            )}
          </div>
        )}

        {/* the ladder */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">The Ladder</span>
          <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            Buying happens with the agent at the property&apos;s own street — the desks dey there.
          </p>
          <div className="mt-1.5 space-y-1.5">
            {PROPERTIES.map((p) => {
              const verdict = canBuyProperty(housing, p.id, player.level, player.cash)
              const isMine = housing.owned === p.id
              return (
                <div key={p.id} className="rounded-xl bg-black/[0.03] px-2.5 py-2" data-testid={`houses-prop-${p.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-[var(--lko-ink)]">{p.name}</p>
                      <p className="text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">
                        {formatNaira(p.price)} · Level {p.level}+ · comfort {p.comfort}
                      </p>
                    </div>
                    {isMine ? (
                      <span className="shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green)]">YOURS</span>
                    ) : (
                      <span className="shrink-0 rounded-full border border-black/[0.08] px-2 py-0.5 text-[9px] font-bold text-[var(--lko-ink-soft)]">
                        {verdict.ok ? 'affordable' : verdict.why}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
