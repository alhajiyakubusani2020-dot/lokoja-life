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
import { bizAtLocation, bizOwned, bizUpgradeCost, bizIncomeFor, staffCapFor, hasPowerBackup, hasGenerator, bizGeneratorFuelFor } from '@/game/systems/biz'
import { marketForDay } from '@/game/systems/civic'
import { isScarcityDay, blackoutAt } from '@/game/systems/chaos'
import { useGameStore } from '@/game/store/useGameStore'
import type { ShopUpgradeId } from '@/game/types'

export function BizBlock({ locationId }: { locationId: string }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const civic = useGameStore((s) => s.civic)!
  // M8 — the chaos state rides into the SAME income law the day roll uses
  const chaos = useGameStore((s) => s.chaos)
  const buyBiz = useGameStore((s) => s.buyBiz)
  const collectBiz = useGameStore((s) => s.collectBiz)
  const upgradeBiz = useGameStore((s) => s.upgradeBiz)
  const hireStaff = useGameStore((s) => s.hireStaff)
  const fireStaff = useGameStore((s) => s.fireStaff)
  const installBizUpgrade = useGameStore((s) => s.installBizUpgrade)

  const host = bizAtLocation(locationId)
  if (!host) return null
  const { typeId, def } = host
  const shop = bizOwned(player.businesses, typeId)

  // today's honest per-day income at the shop's current shape (staff + power included)
  const todayIncome = bizIncomeFor(
    typeId,
    shop?.level ?? 1,
    world.day,
    marketForDay(civic, world.day),
    player.reputation,
    shop ? { staff: shop.staff, upgrades: shop.upgrades, chaos } : undefined,
  )
  const darkNow = !!shop && civic.nepa.shedding && !hasPowerBackup(shop.upgrades)
  const blackoutNow = !!shop && blackoutAt(chaos, def.locationId, world.day)
  const genFuelToday = !!shop && bizGeneratorFuelFor(typeId, world.day, shop.upgrades, chaos)
  const scarcityNow = isScarcityDay(world.day) && def.pos === true

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
          {blackoutNow && (
            <p data-testid="biz-blackout" className="mt-1.5 rounded-lg bg-[#2b1a16] px-2.5 py-1.5 text-[11px] font-bold text-[#ffb4a0]">
              ⚡ TRANSFORMER DON BLOW — the whole zone dey dark{!hasPowerBackup(shop.upgrades) ? ` (shop dey run blank — −${Math.round((1 - 0.25) * 100)}%)` : ''}. {genFuelToday ? `Generator dey burn ${formatNaira(genFuelToday)}/day from the till.` : hasGenerator(shop.upgrades) ? 'Generator dey carry the light.' : 'Fit a generator below.'}
            </p>
          )}
          {scarcityNow && (
            <p data-testid="biz-pos-boom" className="mt-1.5 rounded-lg bg-[#e8f5e9] px-2.5 py-1.5 text-[11px] font-bold text-[#1b5e20]">
              📱 Cash scarcity — your POS terminal dey harvest today (+{Math.round((1.35 - 1) * 100)}% commissions).
            </p>
          )}
          {darkNow && !blackoutNow && (
            <p className="mt-1.5 rounded-lg bg-[#c0392b]/10 px-2.5 py-1.5 text-[11px] font-bold text-[#8a2a20]">
              🔌 NEPA don cut the light — the shop dey run dark today (−{Math.round((1 - BIZ.sheddingIncomeFactor) * 100)}%). Fit a generator or solar below.
            </p>
          )}
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--lko-ink-soft)]">Till today</span>
            <span className="lko-display text-xl tabular-nums text-[var(--lko-green-deep)]">
              {formatNaira(shop.accrued)}
            </span>
          </div>

          {/* M5 — staff: income boost vs the daily wage the till pays */}
          <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-black/[0.035] px-2.5 py-2">
            <span className="min-w-0 text-[11.5px] font-bold text-[var(--lko-ink-soft)]">
              👥 Attendants {shop.staff}/{staffCapFor(shop.level)}
              <span className="block text-[10px] font-semibold">
                +{Math.round(BIZ.staffIncomeBoost * 100)}% each · wage {formatNaira(BIZ.staffWagePerDay)}/day from the till
              </span>
            </span>
            <span className="flex shrink-0 gap-1.5">
              <button
                data-testid="biz-hire"
                onClick={() => { audio.play('click'); hireStaff(typeId) }}
                disabled={shop.staff >= staffCapFor(shop.level) || player.cash < BIZ.staffHireFee}
                className="lko-press rounded-lg bg-[var(--lko-green)] px-2.5 py-1.5 text-[11px] font-extrabold text-white disabled:opacity-40"
              >
                Hire · {formatNaira(BIZ.staffHireFee)}
              </button>
              {shop.staff > 0 && (
                <button
                  data-testid="biz-fire"
                  onClick={() => { audio.play('click'); fireStaff(typeId) }}
                  className="lko-press rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-[var(--lko-ink-soft)]"
                >
                  Let go
                </button>
              )}
            </span>
          </div>

          {/* M5 — power: the shedding ladder (generator → solar) */}
          <div className="mt-1.5 flex items-center justify-between gap-2 rounded-lg bg-black/[0.035] px-2.5 py-2">
            <span className="min-w-0 text-[11.5px] font-bold text-[var(--lko-ink-soft)]">
              ⚡ Power
              <span className="block text-[10px] font-semibold">
                {hasPowerBackup(shop.upgrades) ? 'Your light no dey go.' : 'Shedding go dim this shop — fit backup power.'}
              </span>
            </span>
            <span className="flex shrink-0 gap-1.5">
              {(Object.entries(BIZ.upgrades) as [ShopUpgradeId, { label: string; emoji: string; cost: number; blurb: string }][]).map(([id, up]) => {
                const installed = shop.upgrades.includes(id)
                return installed ? (
                  <span key={id} className="flex items-center gap-1 rounded-full bg-[var(--lko-green)]/15 px-2 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">
                    <Icon name="check" size={11} /> {up.emoji} {up.label}
                  </span>
                ) : (
                  <button
                    key={id}
                    data-testid={`biz-install-${id}`}
                    onClick={() => { audio.play('click'); installBizUpgrade(typeId, id) }}
                    disabled={player.cash < up.cost}
                    title={up.blurb}
                    className="lko-press rounded-lg border border-[var(--lko-green)]/40 bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-[var(--lko-green-deep)] disabled:opacity-40"
                  >
                    {up.emoji} {up.label} · {formatNaira(up.cost)}
                  </button>
                )
              })}
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
