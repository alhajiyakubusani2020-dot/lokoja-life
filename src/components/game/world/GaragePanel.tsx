'use client'

/**
 * LOKOJA LIFE — Garage / Vehicle Shop (Stage 5-a + M24 W10-a)
 * -----------------------------------------------------------
 * The motor park bottom sheet: the showroom (buy through the ONE store
 * action, buyVehicle), your garage (Drive hands the request to the 3D
 * DriveSystem through controls.ts) and THE WHEELS' FACE (W10 — paint +
 * custom plate through the SAME laws the wire door runs; the street
 * sees your ride exactly as you paint it here). Presentation only —
 * prices, plates, affordability and the paint vocabulary live in
 * data/vehicles.ts + systems/wheels.ts + the store.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { VEHICLES, VEHICLE_BY_MODEL } from '@/game/data/vehicles'
import type { VehicleModel } from '@/game/types'
import { formatNaira } from '@/game/systems/progression'
import { resaleValue } from '@/game/systems/garage'
import { PAINT_VOCAB } from '@/game/systems/wheels'
import { audio } from '@/game/systems/audio'
import { CheckIcon, CoinsIcon } from '../icons'
import { requestEnterVehicle } from './controls'

/** the swatch the paint key shows — the rigs' REAL tones (presentation
 *  mirror of world3d/vehicles.ts; the vocabulary itself is the law's) */
const PAINT_SWATCH: Record<string, { label: string; css: string }> = {
  '0': { label: 'Red', css: '#b33a2b' },
  '1': { label: 'Blue', css: '#2b62b3' },
  '2': { label: 'Green', css: '#2e7d5b' },
  '3': { label: 'Black', css: '#3d4043' },
  stock: { label: 'Stock', css: 'linear-gradient(135deg,#e3b53a,#3e8e5a)' },
  yellow: { label: 'Yellow', css: '#e3b53a' },
  white: { label: 'White', css: '#e8e8e8' },
  silver: { label: 'Silver', css: '#b8bcc2' },
  darkblue: { label: 'Navy', css: '#24466e' },
  maroon: { label: 'Maroon', css: '#6e2430' },
}

export function GaragePanel({ onClose }: { onClose: () => void }) {
  const player = useGameStore((s) => s.player)!
  const world = useGameStore((s) => s.world)!
  const buyVehicle = useGameStore((s) => s.buyVehicle)
  const sellVehicle = useGameStore((s) => s.sellVehicle)
  const setVehicleStyle = useGameStore((s) => s.setVehicleStyle)
  const cash = player.cash
  const owned = player.vehicles

  const drive = (model: VehicleModel) => {
    audio.play('click')
    onClose()
    requestEnterVehicle(model)
  }

  const buy = (model: VehicleModel) => {
    audio.play('click')
    buyVehicle(model) // store notifies + plays its own reward sound
  }

  const sell = (vehicleId: string) => {
    audio.play('click')
    sellVehicle(vehicleId) // store notifies with the honest resale price
  }

  return (
    <div className="flex flex-col gap-2.5 px-5 pb-4 pt-3">
      <p className="text-[12px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
        Buy your own ride, and Lokoja opens up. Your keke waits by the roadside near you — walk up
        and enter, or press Drive.
      </p>

      {/* pocket cash — affordability context for every row */}
      <p className="flex items-center justify-between rounded-lg bg-black/[0.04] px-3 py-2 text-[11px] font-bold text-[var(--lko-ink-soft)]">
        <span className="flex items-center gap-1.5">
          <CoinsIcon size={13} className="text-[var(--lko-gold-deep)]" /> Pocket cash
        </span>
        <span className="lko-num text-[12.5px] font-extrabold text-[var(--lko-green)]">{formatNaira(cash)}</span>
      </p>

      {/* ---------- your garage ---------- */}
      {owned.length > 0 && (
        <div className="rounded-xl border border-black/[0.06] bg-[var(--lko-green)]/[0.07] p-2.5">
          <p className="mb-1.5 px-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-green-deep)]">
            Your rides
          </p>
          <div className="flex flex-col gap-1.5">
            {owned.map((v) => {
              const def = VEHICLE_BY_MODEL[v.model]
              return (
                <div key={v.id} className="lko-card flex items-center gap-2.5 p-2.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-cream)] text-[19px]">
                    {def.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-extrabold leading-tight">{def.label}</span>
                    <span className="lko-num block truncate text-[10.5px] font-bold text-[var(--lko-green)]">
                      OWNED · plate {v.plate} · sells for {formatNaira(resaleValue(v.model, v.boughtDay, world.day))}
                    </span>
                  </span>
                  <button
                    onClick={() => drive(v.model)}
                    className="lko-press flex h-10 shrink-0 items-center gap-1 rounded-xl bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold text-white"
                  >
                    Drive
                  </button>
                  <button
                    data-testid="garage-sell"
                    onClick={() => sell(v.id)}
                    aria-label={`Sell ${def.short} for ${formatNaira(resaleValue(v.model, v.boughtDay, world.day))}`}
                    className="lko-press flex h-10 shrink-0 items-center rounded-xl border border-black/10 bg-black/[0.04] px-3 text-[12px] font-extrabold text-[var(--lko-ink-soft)]"
                  >
                    Sell
                  </button>
                </div>
              )
            })}
          </div>
          {/* ---------- W10 — THE WHEELS' FACE (paint + plate) ---------- */}
          {owned.map((v) => {
            const def = VEHICLE_BY_MODEL[v.model]
            const vocab = PAINT_VOCAB[v.model] ?? []
            const current = v.paint ?? vocab[0] ?? 'stock'
            return (
              <div key={`${v.id}-style`} className="lko-card mt-1.5 p-2.5">
                <p className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]">
                  {def.short} — the face the street sees
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {vocab.map((p) => {
                    const sw = PAINT_SWATCH[p] ?? PAINT_SWATCH.stock
                    const on = current === p
                    return (
                      <button
                        key={p}
                        data-testid={`paint-${v.model}-${p}`}
                        aria-label={`Paint ${def.short} ${sw.label}`}
                        onClick={() => {
                          audio.play('click')
                          setVehicleStyle(v.id, { paint: p })
                        }}
                        className={`lko-press h-7 w-7 rounded-full border-2 ${on ? 'border-[var(--lko-green)] ring-2 ring-[var(--lko-green)]/30' : 'border-black/10'}`}
                        style={{ background: sw.css }}
                      />
                    )
                  })}
                  <span className="ml-1 text-[10.5px] font-bold text-[var(--lko-ink-soft)]">
                    {(PAINT_SWATCH[current] ?? PAINT_SWATCH.stock).label}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <input
                    data-testid={`plate-${v.model}`}
                    defaultValue={v.plate}
                    maxLength={10}
                    aria-label={`Custom plate for ${def.short}`}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '')
                    }}
                    className="lko-num h-8 w-32 rounded-lg border border-black/10 bg-black/[0.03] px-2 text-[11.5px] font-extrabold tracking-wider text-[var(--lko-ink)] outline-none focus:border-[var(--lko-green)]"
                  />
                  <button
                    data-testid={`plate-save-${v.model}`}
                    onClick={(e) => {
                      const input = (e.currentTarget.previousElementSibling as HTMLInputElement | null)?.value ?? v.plate
                      audio.play('click')
                      setVehicleStyle(v.id, { plate: input })
                    }}
                    className="lko-press flex h-8 items-center rounded-lg bg-black/[0.05] px-3 text-[11px] font-extrabold text-[var(--lko-ink-soft)]"
                  >
                    Set plate
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ---------- showroom ---------- */}
      <p className="px-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]">
        Showroom
      </p>
      {VEHICLES.map((def) => {
        const mine = owned.find((v) => v.model === def.model)
        const afford = cash >= def.price
        return (
          <div key={def.model} className={`lko-card flex items-center gap-3 p-3 ${mine ? 'opacity-90' : ''}`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-[21px]">
              {def.emoji}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-extrabold leading-tight">{def.label}</span>
              <span className="block truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]">
                {def.description}
              </span>
              <span className="lko-num mt-0.5 block text-[11.5px] font-extrabold text-[var(--lko-green-deep)]">
                {formatNaira(def.price)}
              </span>
            </span>
            {mine ? (
              <span className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-[var(--lko-green)]/15 px-2.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]">
                <CheckIcon size={13} /> OWNED
              </span>
            ) : (
              <button
                disabled={!afford}
                onClick={() => buy(def.model)}
                className="lko-press flex h-10 shrink-0 items-center rounded-xl bg-[var(--lko-green)] px-3.5 text-[12.5px] font-extrabold text-white disabled:cursor-not-allowed disabled:bg-black/15"
              >
                {afford ? 'Buy' : 'Save up'}
              </button>
            )}
          </div>
        )
      })}

      <p className="text-center text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
        One ride per model. Your rides run on FUEL on the map — no fare. Driving sip small energy — no be trekking.
      </p>

      <button
        onClick={onClose}
        className="lko-press mt-0.5 flex min-h-[44px] items-center justify-center rounded-xl bg-black/[0.05] text-[13px] font-extrabold text-[var(--lko-ink-soft)]"
      >
        Close
      </button>
    </div>
  )
}
