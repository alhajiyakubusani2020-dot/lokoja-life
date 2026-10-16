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
 */

import { useGameStore } from '@/game/store/useGameStore'
import { NPCS } from '@/game/data/npcs'
import { LOCATION_BY_ID } from '@/game/data/locations'
import { relationshipFor, tierFor, TIER_META, TIERS, canChat } from '@/game/systems/social'

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

  return (
    <div className="flex h-full flex-col" aria-label={`${APP_TITLE} app`} data-testid="contacts-app">
      <div className="px-4 pb-2 pt-1">
        <h2 className="text-[15px] font-black text-[var(--lko-ink)]">Contacts</h2>
        <p className="text-[10px] font-bold text-[var(--lko-ink-soft)]">
          {NPCS.length} Lokoja faces · {met} met · {paddies} paddy{paddies === 1 ? '' : 's'}
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-3.5">
          <span className="text-[13px] font-extrabold text-[var(--lko-ink)]">The Paddy Book</span>
          <p className="text-[10.5px] font-semibold text-[var(--lko-ink-soft)]">
            Familiarity 0–100: {TIERS.filter((t) => t.tier !== 'stranger').map((t) => `${t.min} ${t.tier}`).join(' · ')}. One chat a day per person — the street no dey rush.
          </p>
          <div className="mt-1.5 space-y-1.5">
            {rows.map(({ npc, rel, tier, meta, openToday }) => (
              <div key={npc.id} className="rounded-xl bg-black/[0.03] px-2.5 py-2" data-testid={`contacts-row-${npc.id}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-extrabold text-[var(--lko-ink)]">
                      {npc.emoji} {npc.name}
                    </p>
                    <p className="truncate text-[9.5px] font-semibold text-[var(--lko-ink-soft)]">
                      {npc.bio} — {LOCATION_BY_ID[npc.homeLocationId]?.shortName ?? npc.homeLocationId}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${tier === 'close-paddy' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : tier === 'paddy' ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`}>
                      {meta.label}
                    </span>
                    <p className="mt-0.5 text-[9px] font-bold text-[var(--lko-ink-soft)]" data-testid={`contacts-fam-${npc.id}`}>
                      {rel.familiarity}/100 {openToday ? '' : '· talked today'}
                    </p>
                  </div>
                </div>
                <p className="mt-0.5 text-[9px] font-semibold text-[var(--lko-ink-soft)]">
                  {meta.perk}{meta.offerBonus > 0 ? ` (offers +${Math.round(meta.offerBonus * 100)}%)` : ''}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]">
            Open the Chats app to talk — one line a day is the whole law.
          </p>
        </div>
      </div>
    </div>
  )
}
