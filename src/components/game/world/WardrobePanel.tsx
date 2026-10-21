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
import { formatNaira } from '@/game/systems/progression'
import {
  AVATAR_CLOTHING_STYLES,
  AVATAR_HAIRSTYLES,
  CLOTHING_COLORS,
  HAIR_COLORS,
  SKIN_TONES,
} from '@/game/data/avatar'
import { WALK_STYLES, PREMIUM_OUTFITS, PREMIUM_BY_KEY, WALK_BY_KEY } from '@/game/systems/wardrobe'
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
  // M19 — the two tabs: the free look + the Bend-Down Select premium rail
  const [tab, setTab] = useState<'look' | 'shop'>('look')
  const wardrobe = useGameStore((s) => s.wardrobe)
  const playerCash = useGameStore((s) => s.player?.cash ?? 0)

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
                  {tab === 'look' ? 'Fresh look — who dey show today?' : 'Bend-Down Select — walks + premium cloth'}
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
            {/* M19 — the tab rail */}
            <div className="mt-2 flex gap-1.5">
              {(['look', 'shop'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  data-testid={`wardrobe-tab-${t}`}
                  onClick={() => { audio.play('click'); setTab(t) }}
                  aria-pressed={tab === t}
                  className={`lko-press flex-1 rounded-lg py-1.5 text-[11px] font-extrabold uppercase tracking-wide ${
                    tab === t ? 'bg-[var(--lko-green)] text-white' : 'border border-[var(--lko-line)] bg-[var(--lko-surface)] text-[var(--lko-ink-soft)]'
                  }`}
                >
                  {t === 'look' ? '🪞 Look' : '🛍️ Shop'}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4">
            {tab === 'shop' ? (
              /* ---------------- M19 — THE BEND-DOWN SELECT SHOP ---------------- */
              <div data-testid="wardrobe-shop">
                <p className="mt-2 rounded-lg bg-[var(--lko-gold-soft,#faf3df)] px-3 py-2 text-[11px] font-semibold leading-snug text-[#6b4e12]">
                  Walks change how you MOVE — the 3D rig obeys. Premium cloth na real cloth: your
                  3D self wears it the moment you step out. Wallet: {formatNaira(playerCash)}.
                </p>
                <Section label="Walk styles">
                  <div className="w-full space-y-2">
                    {WALK_STYLES.map((w) => {
                      const owned = w.key === 'street' || wardrobe.ownedWalks.includes(w.key)
                      const active = wardrobe.activeWalk === w.key
                      return (
                        <div key={w.key} className="lko-card flex items-center justify-between gap-3 p-3">
                          <div className="min-w-0">
                            <p className="text-[12px] font-extrabold">{w.label}</p>
                            <p className="text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]">{w.blurb}</p>
                          </div>
                          {active ? (
                            <span data-testid={`walk-${w.key}`} className="shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">WALKING</span>
                          ) : owned ? (
                            <button
                              type="button"
                              data-testid={`walk-${w.key}`}
                              onClick={() => { audio.play('click'); useGameStore.getState().wardrobeEquipWalk(w.key) }}
                              className="lko-press shrink-0 rounded-full bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white"
                            >
                              Walk it
                            </button>
                          ) : (
                            <button
                              type="button"
                              data-testid={`walk-${w.key}`}
                              onClick={() => { audio.play('click'); useGameStore.getState().wardrobeBuy('walk', w.key) }}
                              className="lko-press shrink-0 rounded-full bg-[var(--lko-gold)] px-3 py-1.5 text-[10px] font-extrabold text-[#33230a]"
                            >
                              {formatNaira(w.price)}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Section>
                <Section label="Premium outfits">
                  <div className="w-full space-y-2">
                    {PREMIUM_OUTFITS.map((o) => {
                      const owned = wardrobe.ownedStyles.includes(o.key)
                      const worn = draft.clothingStyle === o.key
                      const buyable = o.price > 0
                      return (
                        <div key={o.key} className="lko-card flex items-center justify-between gap-3 p-3">
                          <div className="min-w-0">
                            <p className="text-[12px] font-extrabold">{o.label}</p>
                            <p className="text-[10.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]">{o.blurb}</p>
                          </div>
                          {owned ? (
                            worn ? (
                              <span data-testid={`outfit-${o.key}`} className="shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]">ON YOU</span>
                            ) : (
                              <button
                                type="button"
                                data-testid={`outfit-${o.key}`}
                                onClick={() => { audio.play('click'); patch({ clothingStyle: o.key }); setTab('look') }}
                                className="lko-press shrink-0 rounded-full bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white"
                              >
                                Wear it
                              </button>
                            )
                          ) : buyable ? (
                            <button
                              type="button"
                              data-testid={`outfit-${o.key}`}
                              onClick={() => { audio.play('click'); useGameStore.getState().wardrobeBuy('outfit', o.key) }}
                              className="lko-press shrink-0 rounded-full bg-[var(--lko-gold)] px-3 py-1.5 text-[10px] font-extrabold text-[#33230a]"
                            >
                              {formatNaira(o.price)}
                            </button>
                          ) : (
                            <span className="shrink-0 rounded-full border border-[var(--lko-line)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]">EARN IT</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Section>
              </div>
            ) : (
            /* ------------------------- the free LOOK tab ------------------------ */
            <>
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
              {[
                ...AVATAR_CLOTHING_STYLES.map((s) => ({ key: s.key, label: s.label, hint: s.description })),
                // M19 — owned premium outfits join the rail (wear what you own)
                ...PREMIUM_OUTFITS.filter((o) => wardrobe.ownedStyles.includes(o.key)).map((o) => ({ key: o.key, label: o.label, hint: o.blurb })),
              ].map((s) => (
                <StyleChip
                  key={s.key}
                  label={s.label}
                  hint={s.hint}
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
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
