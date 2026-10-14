'use client'

/**
 * LOKOJA LIFE — M7 Graphics Picker
 * ---------------------------------
 * The one settings row that makes "run on any device" a promise the
 * player can see: Auto (trust the device law) or force Low / Mid / High.
 * Shows the device verdict underneath — WHAT this device is, and WHY it
 * got its tier — so the choice is informed, not superstitious. The pick
 * persists in the save (settings.graphics, v8) and is applied on the
 * next world entry.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { getDeviceProfile, deviceLine, type QualitySetting } from '@/game/systems/device'
import { audio } from '@/game/systems/audio'

const OPTIONS: Array<{ value: QualitySetting; label: string }> = [
  { value: 'auto', label: 'Auto' },
  { value: 'low', label: 'Low' },
  { value: 'mid', label: 'Mid' },
  { value: 'high', label: 'High' },
]

export function GraphicsPicker() {
  const settings = useGameStore((s) => s.settings)
  const setGraphics = useGameStore((s) => s.setGraphics)
  const profile = getDeviceProfile(settings.graphics)

  return (
    <div className="rounded-xl border border-black/[0.06] px-4 py-3">
      <div className="flex items-center gap-2 text-sm font-bold">
        <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-[var(--lko-ink-soft)]">
          <path d="M3.5 17.5 8 9.5l3.5 5 2.5-3.5 6.5 6.5" />
          <path d="M2.5 4.5h19v15h-19z" />
        </svg>
        Graphics
      </div>

      {/* the four-way pick — segmented, thumb-friendly */}
      <div className="mt-2.5 grid grid-cols-4 gap-1" role="radiogroup" aria-label="Graphics quality">
        {OPTIONS.map((o) => {
          const active = settings.graphics === o.value
          return (
            <button
              key={o.value}
              role="radio"
              aria-checked={active}
              onClick={() => {
                audio.play('click')
                setGraphics(o.value)
              }}
              className={`lko-press min-h-[38px] rounded-lg border text-[12px] font-extrabold transition-colors ${
                active
                  ? 'border-[var(--lko-green)] bg-[var(--lko-green)] text-white'
                  : 'border-black/[0.08] bg-white text-[var(--lko-ink)]'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      {/* the verdict — why this device got its tier */}
      <p className="mt-2 text-[11px] font-semibold leading-relaxed text-[var(--lko-ink-soft)]" data-testid="device-line">
        {settings.graphics === 'auto' ? 'Auto · ' : ''}
        {deviceLine(profile)}
        {!profile.gl.webgl1 && !profile.gl.webgl2 ? ' — the world opens in Map Mode' : ''}
      </p>
      <p className="mt-1 text-[10px] leading-relaxed text-[var(--lko-ink-soft)] opacity-75">
        Applied on the next world entry. The game also tunes itself while you play — if frames sag, it quietly lowers
        render detail, and climbs back when there is headroom.
      </p>
    </div>
  )
}
