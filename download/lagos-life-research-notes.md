# Lagos Life — Build Research Notes (for Lokoja Life)

> Method: public web research only (Vanguard explainer + app-store listing + search snippets).
> No assets, code, or brand material copied — techniques and design lessons only.

## What Lagos Life actually is
- **NOT Roblox** — a free **browser-based** Sims-style life sim set in Lagos, Nigeria.
- Created by Nigerian developer **Shalom Rayhamen** (aka **Eliy**), inspired by The Sims 3
  ("what would this look like if it reflected MY environment?") and the viral danfo-driving
  browser game **Lagos Run**.
- Launched **Oct 1, 2026** (Independence Day). ~1.2M players within 4 days; 109k peak concurrent.
- Plays directly in the browser on phones and computers — zero download friction.
- 18+ (real-player chat), in-game naira has no real-world value; revenue via IAP + virtual
  billboards/plots rented to businesses.

## The 10 design lessons (Vanguard, Oct 2026)
1. "The Sims, but Lagos": work → earn → pay rent → socialise → go out → build a life.
2. Founder designed from lived culture, not a generic template.
3. Launch timing on a national identity day amplified virality.
4. **Browser-first accessibility is a core competitive advantage.**
5. **Making a living is the core loop**: multiple career paths (banking, tech,
   entertainment...), level progression, rent pressure.
6. **Recognisable local detail is the appeal** — "not a generic simulator with Nigerian
   names added": real places (Amala Shitta, Quilox), transport, nightlife, food, pop culture.
7. Virtual economy stays in-game (honest terms; IAP for naira).
8. The city itself became ad inventory (virtual billboards).
9. Social/multiplayer layer (chat) with safety rules.
10. Part of a wave (Lagos Run → Lagos Life) proving culturally-specific + accessible +
    humorous Nigerian browser games win big.

## Direct implications for Lokoja Life (already true / to do)
| Lagos Life lesson | Lokoja Life status |
|---|---|
| Browser-based, no download | ✅ Same (Next.js SPA) |
| Needs meters (hunger/energy/fun/social/hygiene) | ✅ Needs engine exists (Stage 1) |
| Jobs → money → career levels | ✅ Jobs/hustles/skills/ledger (Stage 3) |
| Recognisable locations | ✅ 10 real Lokoja locations (Confluence, Mount Patti...) |
| Local-detail density (transport, food, street life) | ⚠️ keke/okada/taxi exist; danfo missing; food spots thin |
| Guided first missions / tutorial | ❌ Gap — no onboarding inside 3D world |
| Activity discovery surfaced everywhere | ⚠️ Activities exist per-location but discovery is passive |
| Walking/living costs energy | ✅ Travel drains energy (config-driven); walking in 3D doesn't yet |
| Career/rent pressure | ⏳ Later stage (banking/rent) |

## Increment 2 decisions (this session)
1. **Onboarding**: one-time 3-step world tutorial chips (move → look → interact), stored in
   a separate localStorage key (NOT the save format — zero migration risk).
2. **District discovery toasts**: first entry into each district shows a real location chip.
3. **Physical job board at Kpata Market + buka food stall**: walk-up interactables that
   deep-link into the REAL Work tab at that location (no economy logic in 3D components).
4. **NPC hint bubbles**: NPCs emit real hints drawn from hustles.ts (NPC name + their
   hustle gist) → tap deep-links to Work tab.
5. **Yellow danfo bus** added to traffic (the iconic Nigerian browser-game vehicle).
6. All balance numbers → new `WORLD3D` section in config.ts (never hardcoded in components).
