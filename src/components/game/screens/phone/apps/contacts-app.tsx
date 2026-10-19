'use client'

/**
 * M21 — CONTACTS APP (the paddy book in your pocket)
 * --------------------------------------------------
 * The 14 real people of Lokoja (data/npcs.ts) with their REAL
 * relationship values — the familiarity track (0–100) the save keeps
 * per NPC, and the tier that familiarity buys (stranger →
 * acquaintance → paddy → close-paddy) straight from systems/social.ts.
 * Read-only on purpose: talking happens face-to-face or in the Chats
 * app — one chat per NPC per in-game day is the law, and this book
 * only shows whether today's slot is still open. No cross-app
 * navigation, no invented friends.
 *
 * M24-UI wave 2 — the face: river-toned hero, the three-count stat
 * strip, tier-ringed avatar rows with familiarity bars. Every number,
 * every testid, every honest law: unchanged.
 */

import { useGameStore } from '@/game/store/useGameStore'
import { NPCS } from '@/game/data/npcs'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { relationshipFor, tierFor, TIER_META, TIERS, canChat } from '@/game/systems/social'
import { FaceHero, StatTile, SectionLabel, LawNote, MiniBar, StatusChip } from './app-face'

export const APP_ID = 'contacts'
export const APP_TITLE = 'Contacts'
export const APP_GLYPH = '📇'

export default function ContactsApp() {
  const player = useGameStore((s) => s.player)
  const world = useGameStore((s) => s.world)
  if (!player || !world) return null

  const day = world.day
  const rows = NPCS.map((npc) => {
    const rel = relationshipFor(player.relationships, npc.id)
    const tier = tierFor(rel.familiarity)
    return { npc, rel, tier, meta: TIER_META[tier], openToday: canChat(player.relationships[npc.id], day) }
  })
  const paddies = rows.filter((r) => r.tier === 'paddy' || r.tier === 'close-paddy').length
  const met = rows.filter((r) => r.rel.familiarity > 0).length
  const sorted = [...rows].sort((a, b) => b.rel.familiarity - a.rel.familiarity)

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="contacts-app">
      <FaceHero
        id="contacts"
        glyph="📇"
        title="Contacts"
        sub="The paddy book — who you know for Lokoja, by the numbers the street keeps"
        hue="river"
        right={
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-black backdrop-blur-sm">
            {NPCS.length} faces
          </span>
        }
      />

      <div className="mt-2 grid grid-cols-3 gap-1.5 px-4">
        <StatTile label="met" value={met} tone="river" />
        <StatTile label="paddies" value={paddies} tone="green" />
        <StatTile label="talked today" value={rows.length - rows.filter((r) => r.openToday).length} tone="gold" />
      </div>

      <div className="mt-1 flex-1 space-y-2 overflow-y-auto px-4 pb-4 pt-2">
        <SectionLabel>The Paddy Book</SectionLabel>
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <LawNote tone="river">
            Familiarity 0–100: {TIERS.filter((t) => t.tier !== 'stranger').map((t) => `${t.min} ${t.tier}`).join(' · ')}. One chat a day
            per person — the street no dey rush.
          </LawNote>
          <div className="mt-2 space-y-1.5">
            {sorted.map(({ npc, rel, tier, meta, openToday }) => {
              const ringCls =
                tier === 'close-paddy' ? 'ring-[var(--lko-gold)]'
                : tier === 'paddy' ? 'ring-[var(--lko-green)]'
                : tier === 'acquaintance' ? 'ring-[var(--lko-river)]/60'
                : 'ring-black/[0.06]'
              return (
                <div key={npc.id} className="rounded-xl bg-black/[0.03] px-2.5 py-2" data-testid={`contacts-row-${npc.id}`}>
                  <div className="flex items-center gap-2.5">
                    {/* the tier ring — the avatar wears its rank */}
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[16px] ring-2 ${ringCls}`} aria-hidden>
                      {npc.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] font-extrabold text-[var(--lko-ink)]">{npc.name}</p>
                        <StatusChip tone={tier === 'close-paddy' ? 'gold' : tier === 'paddy' ? 'ok' : 'plain'}>
                          {meta.label}
                        </StatusChip>
                      </div>
                      <p className="truncate text-[9px] font-semibold text-[var(--lko-ink-soft)]">
                        {LOCATION_BY_ID[npc.homeLocationId]?.shortName ?? npc.homeLocationId} · {meta.perk}{meta.offerBonus > 0 ? ` (offers +${Math.round(meta.offerBonus * 100)}%)` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1">
                      <MiniBar pct={rel.familiarity} tone={tier === 'close-paddy' ? 'gold' : tier === 'paddy' ? 'green' : 'river'} />
                    </div>
                    <span className="w-[86px] shrink-0 text-right text-[9px] font-bold text-[var(--lko-ink-soft)]" data-testid={`contacts-fam-${npc.id}`}>
                      {rel.familiarity}/100{openToday ? '' : ' · talked today'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="mt-2 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
            Open the Chats app to talk — one line a day is the whole law.
          </p>
        </div>
      </div>
    </div>
  )
}
