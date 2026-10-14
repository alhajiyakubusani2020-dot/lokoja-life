'use client'

/**
 * LOKOJA LIFE — M9 JUICE (the dopamine layer)
 * --------------------------------------------
 * MoneyPop: every honest naira earned floats a "+₦X" chip up from the
 * money pill. Shockwave: every level-up sends one expanding ring across
 * the screen. SILK law: transform/opacity ONLY, zero effect-setState,
 * zero layout reads — the CSS animation runs its course and the fill
 * leaves the node invisible until the next pulse remounts it.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { formatNaira } from '@/game/systems/progression'

/** +₦ money pop — keyed by the store's pulse id so each earn fires once. */
export function MoneyPop() {
  const pulse = useGameStore((s) => s.pulse)
  if (!pulse) return null
  return (
    <div
      key={pulse.id}
      data-testid="money-pop"
      className="pointer-events-none absolute inset-x-0 top-2 z-30 flex justify-center"
      aria-hidden
    >
      <span
        className="lko-display rounded-full bg-[var(--lko-green)] px-3 py-1 text-sm text-white shadow-lg"
        style={{ animation: 'lko-pop-rise 1s ease-out forwards' }}
      >
        +{formatNaira(pulse.amount)}
      </span>
    </div>
  )
}

/** Level-up shockwave — one ring per increment, expand + fade, gone. */
export function Shockwave() {
  const shockwave = useGameStore((s) => s.shockwave)
  if (shockwave <= 0) return null
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden data-testid="shockwave-layer">
      <span
        key={shockwave}
        className="absolute left-1/2 top-1/3 h-24 w-24 rounded-full border-4 border-[var(--lko-gold)]"
        style={{ animation: 'lko-shockwave 0.85s ease-out forwards', transform: 'translate(-50%, -50%)', opacity: 0 }}
      />
    </div>
  )
}
