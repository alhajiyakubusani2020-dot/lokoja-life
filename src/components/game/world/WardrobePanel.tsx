'use client'

/**
 * LOKOJA LIFE — Wardrobe (Stage 5)
 * --------------------------------
 * Self-contained, mobile-first bottom sheet for the player's look:
 * skin tone, hair colour + hairstyle, outfit style + colour — with a
 * live 2D preview from the original SVG Avatar.
 *
 * Wiring contract (INTEGRATOR):
 *   - listens to `useWardrobeBus` (agent 5-b's interior hotspot calls
 *     `useWardrobeBus.getState().show()`; nothing else needed).
 *   - Mount ONCE anywhere above the world, e.g. in WorldTab:
 *       import WardrobePanel from './WardrobePanel'
 *       <WardrobePanel />
 *   - "Wear it" commits through useGameStore.setAvatar — no direct
 *     player-state mutation happens here, no economy logic either.
 *
 * House style: the same frosted-glass language the HUD uses over the 3D
 * world (lko-sheet slide, backdrop blur, 44px+ touch targets).
 */

import { useEffect, useState } from 'react'
import { Avatar } from '../Avatar'
import { Icon } from '../ui/icons'
import { audio } from '@/game/systems/audio'
import { useGameStore } from '@/game/store/useGameStore'
import { useWardrobeBus } from './wardrobe-store'
import {
  AVATAR_CLOTHING_STYLES,
  AVATAR_HAIRSTYLES,
  CLOTHING_COLORS,
  HAIR_COLORS,
  SKIN_TONES,
} from '@/game/data/avatar'
import type { AvatarConfig, PlayerState } from '@/game/types'

/* ------------------------------ small controls ------------------------------ */

function Swatch({
  color,
  active,
  label,
  onSelect,
}: {
  color: string
  active: boolean
  label: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        audio.play('click')
        onSelect()
      }}
      aria-label={label}
      aria-pressed={active}
      className={`lko-press h-11 w-11 shrink-0 rounded-full border-2 transition-shadow ${
        active
          ? 'border-[var(--lko-green)] shadow-[0_0_0_3px_var(--lko-green-soft)]'
          : 'border-black/15'
      }`}
      style={{ background: color }}
    />
  )
}

function StyleChip({
  active,
  label,
  hint,
  onSelect,
}: {
  active: boolean
  label: string
  hint: string
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={() => {
        audio.play('click')
        onSelect()
      }}
      aria-pressed={active}
      title={hint}
      className={`lko-press flex min-h-[44px] shrink-0 flex-col items-start justify-center rounded-xl border px-3.5 py-1.5 text-left ${
        active
          ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]'
          : 'border-[var(--lko-line)] bg-[var(--lko-surface)] text-[var(--lko-ink)]'
      }`}
    >
      <span className="text-[13px] font-extrabold leading-tight">{label}</span>
      <span className="max-w-[15rem] truncate text-[10.5px] font-semibold opacity-70">{hint}</span>
    </button>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section aria-label={label} className="mt-4 first:mt-0">
      <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]">
        {label}
      </h3>
      <div className="lko-scroll-x flex gap-2 overflow-x-auto pb-1">{children}</div>
    </section>
  )
}

/* ------------------------------- the component ------------------------------ */

/**
 * Bus listener — the actual sheet mounts fresh on every open, so the
 * draft look is seeded from the real save in the useState initializer
 * (no effect-setState cascades).
 */
export default function WardrobePanel() {
  const open = useWardrobeBus((s) => s.open)
  const player = useGameStore((s) => s.player)
  if (!open || !player) return null
  return <WardrobeSheet player={player} />
}

function WardrobeSheet({ player }: { player: PlayerState }) {
  const hide = useWardrobeBus((s) => s.hide)

  // draft look — re-seeded from the real save each time the sheet opens
  const [draft, setDraft] = useState<AvatarConfig>(() => ({ ...player.avatar }))

  // Escape closes (desktop nicety, matches every other sheet — the sheet
  // only exists while the bus says open, so no gate needed here)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hide])

  const patch = (p: Partial<AvatarConfig>) => setDraft((d) => ({ ...d, ...p }))
  const gender = player.gender
  const styleLabel = AVATAR_CLOTHING_STYLES.find((s) => s.key === draft.clothingStyle)?.label ?? 'Custom'

  const wear = () => {
    audio.play('click')
    useGameStore.getState().setAvatar({ ...draft })
    hide()
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Wardrobe">
      <button
        type="button"
        aria-label="Close wardrobe"
        onClick={hide}
        className="lko-scrim absolute inset-0 bg-[rgba(14,20,15,0.42)] backdrop-blur-[2px]"
      />

      <div className="lko-pop absolute inset-x-0 bottom-0 mx-auto w-full max-w-md">
        <div className="lko-sheet max-h-[84dvh] overflow-y-auto rounded-t-3xl border-t border-black/[0.08] bg-[var(--lko-surface)]/95 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] shadow-[var(--lko-shadow-lg)] backdrop-blur-xl">
          {/* handle + header */}
          <div className="sticky top-0 z-10 rounded-t-3xl bg-[var(--lko-surface)]/95 px-4 pb-2 pt-2.5 backdrop-blur-xl">
            <div className="mx-auto mb-2.5 h-1 w-10 rounded-full bg-black/15" aria-hidden />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="lko-display text-lg text-[var(--lko-green-deep)]">Wardrobe</h2>
                <p className="text-[11px] font-semibold text-[var(--lko-ink-soft)]">
                  Fresh look — who dey show today?
                </p>
              </div>
              <button
                type="button"
                onClick={hide}
                aria-label="Close"
                className="lko-press flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--lko-line)] bg-[var(--lko-surface)] text-[var(--lko-ink)]"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>

          <div className="px-4">
            {/* live preview */}
            <div className="mt-1 flex items-center gap-4">
              <div className="lko-card shrink-0 p-2">
                <Avatar config={draft} gender={gender} className="h-32 w-32" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="lko-display truncate text-base text-[var(--lko-ink)]">
                  {player?.name ?? 'You'}
                </p>
                <p className="mt-0.5 text-[12px] font-bold text-[var(--lko-gold-deep)]">{styleLabel}</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]">
                  Preview shows the 2D portrait — your 3D self wears the same cloth the moment you
                  step out.
                </p>
              </div>
            </div>

            {/* skin */}
            <Section label="Skin tone">
              {SKIN_TONES.map((s) => (
                <Swatch
                  key={s.key}
                  color={s.value}
                  label={s.label}
                  active={draft.skinTone === s.value}
                  onSelect={() => patch({ skinTone: s.value })}
                />
              ))}
            </Section>

            {/* hair */}
            <Section label="Hair colour">
              {HAIR_COLORS.map((h) => (
                <Swatch
                  key={h.key}
                  color={h.value}
                  label={h.label}
                  active={draft.hairColor === h.value}
                  onSelect={() => patch({ hairColor: h.value })}
                />
              ))}
            </Section>

            <Section label="Hairstyle">
              {AVATAR_HAIRSTYLES.map((h) => (
                <StyleChip
                  key={h.key}
                  label={h.label}
                  hint={h.gender === 'all' ? 'Unisex' : h.gender === 'male' ? 'Male' : 'Female'}
                  active={draft.hairstyle === h.key}
                  onSelect={() => patch({ hairstyle: h.key })}
                />
              ))}
            </Section>

            {/* outfit */}
            <Section label="Outfit style">
              {AVATAR_CLOTHING_STYLES.map((s) => (
                <StyleChip
                  key={s.key}
                  label={s.label}
                  hint={s.description}
                  active={draft.clothingStyle === s.key}
                  onSelect={() => patch({ clothingStyle: s.key })}
                />
              ))}
            </Section>

            <Section label="Outfit colour">
              {CLOTHING_COLORS.map((c) => (
                <Swatch
                  key={c.key}
                  color={c.value}
                  label={c.label}
                  active={draft.clothingColor === c.value}
                  onSelect={() => patch({ clothingColor: c.value })}
                />
              ))}
            </Section>

            {/* actions */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  audio.play('click')
                  hide()
                }}
                className="lko-press min-h-[46px] flex-1 rounded-xl border border-[var(--lko-line)] bg-[var(--lko-surface)] text-sm font-bold text-[var(--lko-ink)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={wear}
                className="lko-press min-h-[46px] flex-[1.4] rounded-xl bg-[var(--lko-green)] text-sm font-extrabold text-white shadow-[0_8px_20px_-10px_rgba(16,101,61,0.65)]"
              >
                Wear it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
