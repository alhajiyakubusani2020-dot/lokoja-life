'use client'

/**
 * M21 — WARDROBE APP (the Bend-Down Select in your pocket)
 * --------------------------------------------------------
 * The wardrobe book, honest: the walks you own and which one is
 * equipped, the premium outfits and their real cloth states — bought
 * (agbada, jersey), earned-only (confluence-gold, lab-coat — the drops
 * the hill and the white coat pay), and the six base styles you owned
 * by birth. Every move goes through the store's REAL doors:
 *   wardrobeBuy / wardrobeEquipWalk (systems/wardrobe.ts laws)
 *   setAvatar (the appearance commit the 3D rig reads)
 * Every number here is a catalogue price or a save fact — nothing
 * is invented, the earned twins carry no price tag.
 *
 * M24-UI wave 2 — the face: gold-toned hero with the wearing chip,
 * the cloth rows with wear/buy doors, the birthright six as chips.
 * Every number, every testid, every law: unchanged.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { audio } from '@/game/systems/audio'
import { formatNaira } from '@/game/systems/progression'
import { WALK_STYLES, PREMIUM_OUTFITS, WALK_BY_KEY, BASE_STYLE_KEYS, STREET_WALK } from '@/game/systems/wardrobe'
import { AVATAR_CLOTHING_STYLES } from '@/game/data/avatar'
import type { AvatarConfig } from '@/game/types'
import { FaceHero, SectionLabel, StatusChip } from './app-face'

export const APP_ID = 'wardrobe'
export const APP_TITLE = 'Wardrobe'
export const APP_GLYPH = '👕'

export default function WardrobeApp() {
  const player = useGameStore((s) => s.player)
  const wardrobe = useGameStore((s) => s.wardrobe)
  const wardrobeBuy = useGameStore((s) => s.wardrobeBuy)
  const wardrobeEquipWalk = useGameStore((s) => s.wardrobeEquipWalk)
  const setAvatar = useGameStore((s) => s.setAvatar)
  if (!player) return null

  const activeWalk = WALK_BY_KEY.get(wardrobe.activeWalk)
  const ownsWalk = (key: string) => key === STREET_WALK || wardrobe.ownedWalks.includes(key)
  const ownsOutfit = (key: string) => BASE_STYLE_KEYS.has(key) || wardrobe.ownedStyles.includes(key)
  const wearStyle = (key: string) => setAvatar({ ...player.avatar, clothingStyle: key } as AvatarConfig)
  const wornOutfit = PREMIUM_OUTFITS.find((o) => player.avatar.clothingStyle === o.key)

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="wardrobe-app">
      <FaceHero
        id="wardrobe"
        glyph="👕"
        title="Wardrobe"
        sub="The Bend-Down Select — same laws as the mirror at home"
        hue="gold"
        right={
          <span className="rounded-full bg-white/15 px-2 py-1 text-[9px] font-black backdrop-blur-sm">
            {wornOutfit ? wornOutfit.label : 'base cloth'}
          </span>
        }
      />

      <div className="mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        {/* the equipped walk */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5" data-testid="wardrobe-active">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-[15px]" aria-hidden>🚶</span>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold text-[var(--lko-ink)]">Your Walk — {activeWalk?.label ?? 'Street Walk'}</p>
              <p className="text-[10px] font-semibold text-[var(--lko-ink-soft)]">
                {activeWalk ? activeWalk.blurb : 'The Lokoja stride you were born with'}
              </p>
            </div>
          </div>
        </div>

        {/* walk styles — real buy/equip doors */}
        <SectionLabel>Walk Styles</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <div className="mt-0.5 space-y-1.5">
            {WALK_STYLES.map((w) => {
              const owned = ownsWalk(w.key)
              const active = wardrobe.activeWalk === w.key
              return (
                <div key={w.key} className={`rounded-xl px-2.5 py-2 ${active ? 'bg-[var(--lko-gold-soft)]/50' : 'bg-black/[0.03]'}`} data-testid={`wardrobe-walk-${w.key}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-[var(--lko-ink)]">
                        {w.label}{active ? ' · wearing' : ''}
                      </p>
                      <p className="truncate text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">{w.blurb}</p>
                    </div>
                    {owned ? (
                      active ? (
                        <StatusChip tone="ok">ON</StatusChip>
                      ) : (
                        <button
                          type="button"
                          data-testid={`wardrobe-walk-equip-${w.key}`}
                          className="lko-press shrink-0 rounded-lg bg-[var(--lko-green)] px-2.5 py-1.5 text-[9.5px] font-black text-white"
                          onClick={() => { audio.play('click'); void wardrobeEquipWalk(w.key) }}
                        >
                          WEAR
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        data-testid={`wardrobe-walk-buy-${w.key}`}
                        className="lko-press lko-num shrink-0 rounded-lg bg-[var(--lko-gold-deep)] px-2.5 py-1.5 text-[9.5px] font-black text-white"
                        onClick={() => { audio.play('click'); void wardrobeBuy('walk', w.key) }}
                      >
                        {formatNaira(w.price)}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* premium outfits — the honest cloth states */}
        <SectionLabel>Premium Outfits</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <div className="mt-0.5 space-y-1.5">
            {PREMIUM_OUTFITS.map((o) => {
              const owned = wardrobe.ownedStyles.includes(o.key)
              const worn = player.avatar.clothingStyle === o.key
              const earnedOnly = o.price <= 0
              return (
                <div key={o.key} className={`rounded-xl px-2.5 py-2 ${worn ? 'bg-[var(--lko-gold-soft)]/50' : 'bg-black/[0.03]'}`} data-testid={`wardrobe-outfit-${o.key}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-[var(--lko-ink)]">
                        {o.label}{worn ? ' · wearing' : ''}
                      </p>
                      <p className="truncate text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">
                        {o.blurb}{earnedOnly ? ' — not sold, earned.' : ''}
                      </p>
                    </div>
                    {owned ? (
                      worn ? (
                        <StatusChip tone="ok">ON</StatusChip>
                      ) : (
                        <button
                          type="button"
                          data-testid={`wardrobe-outfit-wear-${o.key}`}
                          className="lko-press shrink-0 rounded-lg bg-[var(--lko-green)] px-2.5 py-1.5 text-[9.5px] font-black text-white"
                          onClick={() => { audio.play('click'); wearStyle(o.key) }}
                        >
                          WEAR
                        </button>
                      )
                    ) : earnedOnly ? (
                      <StatusChip tone="plain">EARN IT</StatusChip>
                    ) : (
                      <button
                        type="button"
                        data-testid={`wardrobe-outfit-buy-${o.key}`}
                        className="lko-press lko-num shrink-0 rounded-lg bg-[var(--lko-gold-deep)] px-2.5 py-1.5 text-[9.5px] font-black text-white"
                        onClick={() => { audio.play('click'); void wardrobeBuy('outfit', o.key) }}
                      >
                        {formatNaira(o.price)}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* the birthright six */}
        <SectionLabel>Base Styles</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">Owned by birth — wear any, no price tag.</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {AVATAR_CLOTHING_STYLES.filter((s) => BASE_STYLE_KEYS.has(s.key)).map((s) => {
              const worn = player.avatar.clothingStyle === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  data-testid={`wardrobe-base-${s.key}`}
                  className={`lko-press rounded-full px-3 py-1.5 text-[9.5px] font-black ${worn ? 'bg-[var(--lko-green)] text-white shadow-[var(--lko-shadow-sm)]' : 'bg-black/[0.05] text-[var(--lko-ink)]'}`}
                  onClick={() => { audio.play('click'); wearStyle(s.key) }}
                >
                  {s.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
