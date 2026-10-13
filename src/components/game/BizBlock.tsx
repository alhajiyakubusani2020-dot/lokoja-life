/**
 * The business hosted at this location (if any): not-yet-owned shows the
 * buy row; owned shows the live till, a free in-person collect and the
 * next upgrade. Income preview reads the SAME pure law the day roll uses,
 * so the number on the sheet is the number the till will get.
 */

import { Icon } from './ui/icons'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { BIZ } from '@/game/data/config'
import { bizAtLocation, bizOwned, bizUpgradeCost, bizIncomeFor } from '@/game/systems/biz'
import { marketForDay } from '@/game/systems/civic'
import { useGameStore } from '@/game/store/useGameStore'

export function BizBlock({ locationId }: { locationId: string }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const civic = useGameStore((s) => s.civic)!
  const buyBiz = useGameStore((s) => s.buyBiz)
  const collectBiz = useGameStore((s) => s.collectBiz)
  const upgradeBiz = useGameStore((s) => s.upgradeBiz)

  const host = bizAtLocation(locationId)
  if (!host) return null
  const { typeId, def } = host
  const shop = bizOwned(player.businesses, typeId)

  // today's honest per-day income at the shop's current level
  const todayIncome = bizIncomeFor(typeId, shop?.level ?? 1, world.day, marketForDay(civic, world.day), player.reputation)

  const buy = () => {
    audio.play('click')
    buyBiz(typeId)
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-3">
      <h4 className="lko-label mb-1.5 flex items-center gap-1.5">
        <span aria-hidden>{def.emoji}</span> {shop ? 'Your business here' : 'Shop for sale here'}
      </h4>

      {!shop && (
        <>
          <p className="text-xs leading-relaxed text-[var(--lko-ink-soft)]">{def.blurb}</p>
          {player.level < def.unlockLevel ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[var(--lko-ink-soft)]">
              <Icon name="lock" size={12} /> Opens at Level {def.unlockLevel} — you are Level {player.level}.
            </p>
          ) : (
            <button
              onClick={buy}
              disabled={player.cash < def.buyCost}
              className={`lko-press mt-2 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left ${
                player.cash < def.buyCost
                  ? 'cursor-not-allowed border-[var(--lko-line)] opacity-55'
                  : 'border-[var(--lko-green)]/50 bg-white hover:border-[var(--lko-green)]'
              }`}
            >
              <span className="text-sm font-extrabold text-[var(--lko-ink)]">Buy the {def.name}</span>
              <span className="text-sm font-extrabold tabular-nums text-[var(--lko-terra)]">
                {formatNaira(def.buyCost)}
              </span>
            </button>
          )}
        </>
      )}

      {shop && (
        <>
          <div className="flex items-center justify-between text-xs font-bold text-[var(--lko-ink-soft)]">
            <span>Level {shop.level}/{BIZ.maxLevel} · ~{formatNaira(todayIncome)}/day</span>
            {bizUpgradeCost(typeId, shop.level) === null && <span>MAX LEVEL</span>}
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--lko-ink-soft)]">Till today</span>
            <span className="lko-display text-xl tabular-nums text-[var(--lko-green-deep)]">
              {formatNaira(shop.accrued)}
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => { audio.play('click'); collectBiz(typeId, 'shop') }}
              disabled={shop.accrued <= 0 || world.currentLocation !== def.locationId}
              className="lko-press flex-1 rounded-lg bg-[var(--lko-green)] px-3 py-2 text-sm font-extrabold text-white disabled:opacity-45"
            >
              Collect (free here)
            </button>
            {(() => {
              const cost = bizUpgradeCost(typeId, shop.level)
              if (cost === null) return null
              return (
                <button
                  onClick={() => { audio.play('click'); upgradeBiz(typeId) }}
                  disabled={player.cash < cost}
                  className="lko-press flex-1 rounded-lg border border-[var(--lko-green)]/50 bg-white px-3 py-2 text-sm font-extrabold text-[var(--lko-green-deep)] disabled:opacity-45"
                >
                  Upgrade · {formatNaira(cost)}
                </button>
              )
            })()}
          </div>
          {shop.accrued > 0 && world.currentLocation !== def.locationId && (
            <p className="mt-1.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]">
              You no dey here — travel come collect free, or use the phone (+fee).
            </p>
          )}
        </>
      )}
    </div>
  )
}
