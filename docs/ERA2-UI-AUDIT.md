# LOKOJA LIFE — ERA II GATE: UI EVOLUTION & WORLD EXPERIENCE AUDIT

**Date:** 2026-10-20 · **HEAD at audit:** `d36ac8d` (clean tree) · **Mode:** read-only, zero code changed
**Method:** 6 parallel read-only auditors (engine architecture · player journey · UI inventory · world-touch map · visual quality · design system + performance). Every claim carries `file:line`. 13 headline claims were then personally re-verified by the orchestrator (12 confirmed, 1 falsified and excluded). Where a number is marked **[computed]** it was produced by executing the repo's own world bootstrap, not by reading code.

> **Correction banner (2026-10-21, ERA II Bible reverification).** This document is an audit *of record* and is left as written. Where its figures drifted on re-decoding the binary, the corrected canon lives in the four Bibles v2.1 and `BIBLE_UPGRADE_AUDIT.md`: **750.4 km / 5,894 segments** (not 754 / 5,900) · **58 client-facing doors** (not 57) · **23 unbridged river-crossing road segments, 3 more within river half-width — reproducible re-decode** (this audit's "18" and the v2.0 banner's "15/6" were threshold-dependent; all retired) · **12 signal heads and 6 bumps placed** (14/12 are caps) · **98 doors = 10 layout + 88 school** (this audit's "108 doors (10 layout + 98 school)" double-counted `ALL_DOORS`; school doors are 88) · **7 decorative parked cars** (not 12) · **20 school interior builders** (not 17) · **1,178 exact `text-[Npx]`** (this audit's 1,191 used a wider regex) · **48 unit suites** (not 47) · **11 direct minor-wall sites** on the wire (the "13 walls" figure was not reproducible). SILK posture re-measured same day: 2.59 s / 406 KB. Second-pass evidence in `BIBLE_UPGRADE_AUDIT.md`.
>
> **Correction banner addendum (2026-10-21, v2.2 NO-TRUST pass).** Further figures corrected by the third independent pass (evidence in `BIBLE_UPGRADE_AUDIT.md`): **16 Prisma models** (this §1 table says 14) · the migration ladder is **19 real steps** (SAVE_VERSION 20; "20-step" counted the no-op `case 20` arm) · **65.3% dead-end way-ends, tolerance-sensitive** (this audit's "72%" was an unpersisted method no script reproduces) · the security badge is the **Dashboard chain chip** (`Dashboard.tsx:621`, gated by `verifyChain` — not "Profile shows Fortress SECURE") · 620 rain particles sit at `Actors.tsx:1032` · the interaction radii are registry-spread (anchor `controls.ts` 8.6, POI = ×0.62, door `config.ts:101` 3.2, hotspot `config.ts:73` 2.1, gist `config.ts:353` 24, pump/garage `wheels.ts:489` 26, shop `HudOverlay.tsx:273` 28), not one `Actors.tsx` table.

**Honesty ledger (RULE ZERO):**
- A stale session summary claimed ERA I Phase 1 was 0% started. Git truth: **Phase 1 is complete** (`5aeafb6`→`d36ac8d`, 5 commits, 6 P0s dead). This report builds on the *actual* state.
- One agent finding was falsified on re-check: `WorldPhoneLayer.tsx:351` holds a **valid** `pb-[max(env(safe-area-inset-bottom),1rem)]` class — not a defect. Excluded.
- Agent claim "loops 3&4 unused" verified precisely: `TRAFFIC_MIX` (Actors.tsx:749-764) assigns 14 rigs to loops 0/1/2 only; `LOOP_TABLES` (Actors.tsx:795) builds tables for all 5 — loops 3–4 have tables, zero rigs.

---

## 1. CURRENT ARCHITECTURE

**One sentence:** Lokoja Life is a single-route Next.js SPA (`/`) that boots a 2D warm-paper dashboard app, inside which a fully procedural R3F 3D Lokoja ("a tab that never unmounts") runs against a local Zustand save + a socket.io "nation wire" server with a SQLite fortress ledger.

| Layer | Implementation | Evidence |
|---|---|---|
| Routing | SPA screen router via Zustand enum `menu→creation→game` (page.tsx:112-118, menu-store.ts:60-76); 7 in-game tabs (BottomNav.tsx:14-23); world = fullscreen fixed overlay `z-30` (WorldTab.tsx:495) | verified |
| Rendering | R3F Canvas mounted only for the World tab; ACES @1.12, `shadowMap.autoUpdate=false` + on-demand ShadowGovernor (≥3u move / 0.4s), FramePacer 30Hz on low tier, DynamicResGovernor p95-driven dpr walk (WorldScene.tsx:479-534, :62-146; device.ts:69-229) | verified |
| Physics | **No physics engine.** Custom 2.5D: circle-vs-OBB push-out, analytic `heightAt()` (sine noise + Patti mound + terraces + river carving), river block w/ bridge-deck exception, world rim (collision.ts:30-211, layout.ts:834-889) | verified |
| Coordinates | **1 u = 26 real metres**, north = −Z, origin 6.753°E/7.790°N; 2D map grid (0–100) ↔ world via `MAP_SCALE=6.2` (geo.ts:7-38, layout.ts:36-49); world half-extent 310u ≈ 16 km across | verified |
| World data | OSM pipeline → `public/world/geo-v1.bin` (60,071 B): **2,655 ways / 5,900 segments (754 km real), 16 rivers, 16 bridges, 5 traffic loops** decoded before any layout module evaluates (geo-gate.ts; geo-bin-manifest.json) | verified |
| State | `useGameStore.ts` **5,487 lines, ≈152 actions** (player/world/civic/fortress/story/nation/live…); menu-store, social-store, wire/wheels stores; save v20 with 20-step migration ladder, HMAC envelope + shadow + backup (save.ts, fortress.ts) | verified |
| Networking | ONE socket.io lane `/?XTransformPort=3003` behind Caddy :81 (wire.ts:186-193); server = Bun + bun:sqlite on the same `db/custom.db`, WAL, **57 game doors**, 59 handlers (nation-wire/index.ts); body pos 10Hz, vehicles 12Hz only-while-moving; 4KB packet cap (index.ts:1064); per-socket **and** per-account rate buckets (index.ts:711-780); degraded 12s HTTP relay lane (`/api/live/sync`) | verified |
| Database | Prisma 6 / SQLite, 14 models. Integrity walls: `LedgerRow.idemKey @unique` (replay law), `VehicleRow.plate @unique`, `Account.token` index, `chainHash` tamper chain, `WalletRow.version` optimistic lock (schema.prisma) | verified |
| UI framework | Tailwind 4 + `lko-*` semantic classes in globals.css; bespoke game chrome; shadcn/ui present but ~40/48 components unused; DOM HUD (HudOverlay.tsx **1,919 lines**) over canvas; DOM⇄3D input contract via framework-agnostic `controls.ts` with `freezeInput` law | verified |
| Assets | **100% procedural — zero model files.** Canvas-baked textures (facades + night emissives, terrain, danfo art); instanced flora (10 species, wind shader); draped road ribbons (CityMesh.tsx:71-160, WorldTerrain.tsx:499-662) | verified |
| Perf posture | SILK gates (prod, Playwright): TTI<3.0s (last **2.54s**), wire<900KB (last **389KB**), warm click **4ms**, heap **27MB**, SW **3.1MB**, 0 console errors (scripts/silk-gates.ts; OPTIMIZATION-PLAN.md:50) | verified |

**Data-flow proof (fuel purchase, end-to-end):** E while stopped at pump → HUD 60fps poll consumes gesture (HudOverlay.tsx:486) → pump chip → `wheelRequestRefuel` mints idemKey → `vehicle:refuel` (wheelnet.ts:515-517) → server door re-judges proximity on **its own clamped car pos** (index.ts:1460-1464), replays idemKey, runs `theMove`: WalletRow debit + chain-hashed LedgerRow, transactional (index.ts:963-1019) → persists `VehicleRow.fuel` → ack → client mirrors tank + toast. **This is the healthiest path in the game: server-authoritative, idempotent, chain-signed.**

**The 15 load-bearing files** (what breaks if edited carelessly): useGameStore (the game's API) · menu-store (screen ownership) · save.ts+fortress.ts (every player's save) · world3d/layout.ts (module-scope world gen; `heightAt` equality law; mutates LOCATIONS at import :700-711) · geo.ts+geo-v1.bin+geo-gate.ts (boot ordering — modules evaluating before `initGeo()` see an empty world) · collision.ts · Actors.tsx · controls.ts (DOM⇄3D contract) · WorldTab.tsx (composition root + e2e hooks) · HudOverlay.tsx · wire.ts (the one socket) · wheelnet/remotenet/bodies/wheels (cadence laws shared with the server) · **nation-wire/index.ts (imports game systems VERBATIM — editing shared systems breaks the server too)** · schema.prisma · data/locations.ts (ids are the anchor⇄map⇄travel⇄presence namespace).

---

## 2. CURRENT PLAYER EXPERIENCE (the journey as it actually is)

| # | Step | What really happens | Evidence |
|---|---|---|---|
| 1 | First launch | Boot splash waits only on localStorage; menu chunk interactive immediately; Dashboard/world chunks idle-preloaded; geo bin 60KB behind the world gate. PWA shell precached | page.tsx:89-110, :22-65; sw.js:36-45 |
| 2 | Landing | Painted key-art hero (static webp + Ken Burns), live-wire ribbon, 4 stat chips, START/Continue/Log in/Settings. **No login gate; guest-first product** | MainMenu.tsx:81-293 |
| 3 | Identity | Character creation (name randomizer, skin/hair/style, M13 band picker) → ₦5,000, Day 1 at `home`. Claim-your-name (handle+PIN+scrypt+parent PIN) optional at menu sheet or in-world GuestGate; merge law on login (further of local/cloud) | CharacterCreation.tsx:93-324; MenuAuthSheet.tsx:134-409; guest.ts:106-141 |
| 4 | Entering city | "Explore in 3D" chip → world tab; WebGL probe; "Entering Lokoja…" veil until first frame; spawn at saved location's anchor +4/+5; 3-step onboarding tour (walk→look→E) once per device; **post-entry the world never unmounts — every other tab is an overlay above the living street** | Dashboard.tsx:878-977; WorldTab.tsx:56-110, :503-516; HudOverlay.tsx:394-919 |
| 5 | Walking | Joystick/WASD 4.4 u/s, sprint 7.4; per-frame distance loop over anchors (8.6u) / POIs (5.3u) / doors (3.2u); E opens activities/travel/interiors; walking burns energy past 150m (settled on world exit) | controls.ts; Actors.tsx:259-291; controls.ts:284-304 |
| 6 | Driving | Buy in phone Garage (one per model, ₦ ledger); last-driven car materialises parked near you; enter at 4.6u; N12 server clamp; fuel/odometer are **disk truth via wire**; refuel/repair at 3 pumps; disconnect persists the car + crew drops + ghost broadcast | useGameStore.ts:1950-1994; DriveSystem.tsx:96-99, :299-376; index.ts:1247-1299 |
| 7 | Phone | Right-edge rail + FAB in-world; freeze law works (WASD/E dead behind overlay); **26 apps**: 7 wire-backed (Live, Messages, Calls, Connect, Wallet, Profile, Forge-hybrid), 12 store-backed, 6 read-only books; shell + grid hardcoded in one 1,155-line file | WorldPhoneLayer.tsx:89-99; PhoneScreen.tsx:797-1155 |
| 8 | Map | 2D stylised OSM canvas, pins from LOCATIONS, travel sheet with real fares (walk/keke/taxi/own rides), guards in order (level→flood→river-cut→guest→fare→energy); **friends/presence NOT shown on the map**; discovery session-spanning but not in save | MapScreen.tsx:261-759; travel guards useGameStore.ts:3503-3604 |
| 9 | Economy | Pocket = signed fortress chain (velocity + income guards + HMAC); purse = server hash-chained ledger w/ idemKey replay law; **bank deposit/withdraw = direct unsigned writes (verified today)**; ~30 in/out touchpoints listed in the audit | useGameStore.ts:3691-3820 (signed) vs :2197-2220 (unsigned) |
| 10 | Meeting players | Socket-is-presence; same-street walkers render as real rigs 10Hz; chat/emote/DM w/ block+M13 walls; 1:1 voice/video P2P; proximity walkie (adult, opt-in, mesh cap 4); stage broadcast (world canvas as host camera) w/ real-₦ tips; trades via relay | index.ts:1101-1123, :1886-2088, :2099-2305 |
| 11 | Leaving/returning | Autosave 1.2s debounce + pagehide flush; Continue restores everything (position=location anchor, money, vehicles, story); reconnect: hello re-claim keeps last honest moment, `resume` replays gap cap 100; **no multi-tab lock exists** | useGameStore.ts:1433-1438, :1394-1419; index.ts:537-540 |
| 12 | Failure paths | Wire-down → honest lane states + degraded relay; bad token → guest spectate; WebGL fail → map fallback; tampered save → fails closed + narrates; context loss → recovery chip; **health 0 = nothing happens (no death/hospital loop)** | wire.ts:35-213; WorldTab.tsx:85-110; needs.ts:77-84 |

**Top journey gaps (ranked by player pain):** no health consequence loop · Bag tab is a "Stage 4" stub while food economy lives elsewhere · no multi-tab/duplicate-session lock (one save, two writers) · bank moves bypass the signed chain while Profile shows "Fortress 🔒 SECURE" · the 60s guest wall dead-ends an inattentive newcomer behind signup · friends invisible on the map · registration has no offline retry queue · driving economy split-brain (offline tank never burns; relocation gate can refuse a lawful cross-town hello 1/5min) · mic walls are honest but silent in space (STUN-only, no TURN) · stage/union live only while sockets do.

---

## 3. EXISTING UI INVENTORY

**≈140 distinct user-facing interfaces.** Counts: chrome/HUD **30** · dashboard tabs+screens **17** · phone shell+layers **6** · phone apps **26** · world-3D UI **17** · economy/business **11** · social **7** · system **11** · loading states **15**.

**Phone (26 apps) wire-status:** wire-backed 7 — Live (roster/chat/spray/stage), Messages (nation+DMs), Calls (WebRTC), Connect (friend graph), Wallet (purse ledger + receipts), Profile (server face), Forge (hybrid). Store-backed 12 — Bank, Hustle, Civic, My Biz, Settings, Shield, School, Houses, Garage, Wardrobe, Whot!, Chats. Read-only books 6 — Pulse, Nation, Career, Health, Contacts, Mt Patti. Stubs: none inside the phone; the only true stub is the dashboard **Bag tab** ("Arrives in Stage 4", Dashboard.tsx:359-390).

**Orphans (dead UI shipped):** `StatusPanel.tsx` (pre-3D Home, zero importers) · `LocationArt.tsx` · `LocationSheet` body (re-implemented inline in MapScreen) · radix Toaster mounted at layout.tsx:77 with **zero producers** · ~40/48 shadcn components · `phone/apps/manifest.ts` (documents 10 apps; consumed by tests only — the real grid is 26, hardcoded).
**RESOLVED (Phase-2.5, Team Foxtrot):** StatusPanel.tsx, LocationArt.tsx, 46/48 shadcn ui components (closure of dialog+switch kept), the Toaster mount + use-toast, 13 orphaned art webps, and 38 dead dependencies removed after a fresh zero-reference sweep. Remaining: LocationSheet inline body (design choice) · manifest.ts (consumed by tests only) · use-mobile.ts (now zero importers).

**Stubs/fakes (honestly labeled):** Whot vs local NPC · NPC chat threads (component-state) · Forge "run" theatrical pacing · Nation crowd sim · "street paddies — no phone yet" rows.

**TOP 10 UI DEBTS (ranked):**
1. **Location-detail duplication with a dead canonical version** — MapScreen.tsx:496-756 re-implements orphaned LocationSheet.tsx:245-427; every new system must be wired twice (already drifting).
2. **HudOverlay god component (1,919 lines)** — master rAF poll effect re-subscribes on every `banner` dep flip (HudOverlay.tsx:482-678, deps :678); speedo writes DOM via refs (:613-637); joystick+tour+discovery+banners+prompts+sheets in one file.
3. **Three parallel money UIs** — BankApp (PhoneScreen:219) / BankPanel (BankPanel.tsx:52) / WalletApp (wallet-app.tsx:62), three visual languages, duplicated "last movements".
4. **Travel-row triplication** — MapScreen:177 / LocationSheet:33 / HudOverlay:1499 re-render the same fare law.
5. **Four/five avatar-look editors** — Creation, MenuAuthSheet LookBust, ProfileApp, WardrobePanel, wardrobe-app; swatch helpers copy-pasted per file.
6. **Hidden module-global UI state** — phoneDeepLink (PhoneScreen:82-85), calls recents (calls-app:45), messages wireBuffer/dmSeenSeq (messages-app:36-44) — session state outside stores with hand-rolled StrictMode defenses.
7. **Stale era copy** — APP_VERSION "Stage 5" (PhoneScreen.tsx:87), BagTab "Stage 4" (Dashboard.tsx:363), menu chip "26 phone apps" hardcoded (MainMenu.tsx:177) while the manifest says 10.
8. **Home banner stack** — 5 banners + onboarding + goals above the hero (Dashboard.tsx:125-141); first real content ~1.5 screens down on 360px.
9. **Dead code shipped** — the 4 orphans + shadcn carcass (entry-bundle weight + maintenance noise).
10. **"Why" copy dictionaries duplicated per surface** — refuel why-maps in HudOverlay:1313 AND GaragePanel:148; per-app WHY_LABEL tables everywhere — one law, many fragile translations.

---

## 4. EXISTING WORLD INTERACTION MAP

**Interaction model:** no raycasting — a per-frame distance loop over three registries (Actors.tsx:259-291): 32 district anchors @8.6u · 4 job-board POIs @5.3u · 108 doors (10 layout + 98 school) @3.2u · interior hotspots @2.1u · 12 NPCs (talk @4u, gist chip @24u) · own vehicle @4.6u · other players' cars @5u · pump @26u (server-re-judged) · Vehicle Shop @28u · 5 Patti secrets @9u. Gesture = E/Enter/touch pin, consumed by the HUD rAF poll with a priority order.

**FULLY WIRED (20 systems):** anchors→activities/travel · job boards · 10 interiors + 98 school doors · interior hotspots (bed/stove/TV/bath/menu/shop) · gym workout · **bank teller → real BankPanel inside a bank building** · civic desks (KGIRS/NEPA/police/EFCC) → CivicPanel · lounge/wardrobe · NPC talk (familiarity, favors→real hustle offers, gifts, hangouts) · own-vehicle enter/drive/park · garage buy/sell/paint/plate (server DMV wall) · refuel/repair (server-eye + ledger) · boarding/seats on real players' cars · remote walkers/cars + co-presence chip · 5 Patti secrets (idempotent rewards) · district discovery · disconnect→VehicleRow persistence + parked ghosts · stage broadcast w/ canvas capture + ledger tips.

**DECORATIVE-ONLY / DEAD (15 paths):**
1. **Market stalls: 2 of 32 survive** **[computed live today: STALLS_TOTAL=2, both ganaja-junction; kpata-market=0, food-area=0]** — the `roadGap<0.45` filter (layout.ts:1660) wipes the rows; zero interaction path exists anyway.
2. `layout.TREES` (700 trees) — computed at import, **zero render consumers** (grep-verified: only the definition, layout.ts:1391).
3. `layout.GRASS` (7,500 tufts) — sole consumer renders **≤72 flower dots** (WorldTerrain.tsx:956); the real grass is flora.GRASS_TUFTS (10k).
4. Traffic loops 3–4 — tables built, zero rigs assigned (TRAFFIC_MIX covers 0/1/2 only).
5. All 12 bespoke landmarks (Confluence deck+flag+canoe, Patti tower+ranger hut, Ganaja roundabout, suya grill, monument, GRA gateposts, Lugard Rest House, stadium, mosque, church hall, boats) — no handlers; E on them opens the generic location sheet.
6. Ambient traffic (14 rigs) — unhailable, unboardable.
7. Ambient parked cars (12) — static, not enterable, not from DB.
8. Civic campus fence/gate — **no collider**, walk-through (collision.ts:56-71).
9. Traffic lights — masts with **unlit heads**, no signal logic (CityMesh.tsx:1358).
10. Road fabric: **72% of way-endpoints dead-end** **[computed]**; 18 underwater segments **[computed]**; school-yard clips leave open ribbon holes; no end caps.
11. Presence `street` is set at world entry/paddy-join only — walking to another district does NOT update it (wire.ts:645-648), so co-presence walls (`not-here`, index.ts:1331) can misjudge.
12. RemoteVehicles shared-rig: two cars with same model:paint mount **one `rig.group` twice** via `<primitive>` (RemoteVehicles.tsx:114-124, :179, :221 — both re-verified today) — cars vanish/teleport, wheels double-spin. Same-class issue: unbounded `tagCache` textures.
13. G2/school activity rows at `stage:99` — honest locked filler.
14. District attribution artifacts: `home` anchor ended with 0 generic buildings; a stray house sits in christfield-school's yard **[computed]**.
15. Driving body-handoff finds the player rig by **blob-shadow fingerprint traversal** (DriveSystem.tsx:183-200) — works, but it's a fragile seam.

**Nature & atmosphere:** 720 flora trees/10 species (real render path) · 10k grass tufts w/ wind shader · 110 Patti rocks · terrain 161×161 time-sliced (6ms/frame) · 16 rivers static (no flow animation; boats supply motion; not swimmable — collision blocks) · 4-slot day/night (store clock, not continuous sun) · weather: 620 rain particles + harmattan haze + puddles + flood veil · one 1024² shadow sun following the player · 492 lamps + sodium pools at night.

---

## 5. CURRENT PROBLEMS (merged, ranked)

**A. Legacy engineering kill-list — status after ERA I Phase 1 (verified from git + code today):**
- DEAD (6 P0): deposit mint (server day-cap + rate eyes, `5aeafb6`) · tests-on-prod-books (test-db seam, `a39e2f3`) · boot `--accept-data-loss` (migrations baselined, `ce57de2`) · duplicate plates (DMV dedupe + `@unique`, `35e3c30`) · fortress chain lie (orientation fixed, `1b6620a`) · trade double-pay (one-application book, `1b6620a`).
- STILL OPEN (from the phase1-close honest list, re-verified): **5 direct-cash bypass sites** — festival/ferry/travel + **bank deposit/withdraw write unsigned ledger rows (bank confirmed today at useGameStore.ts:2205/:2258)** · RemoteVehicles rig-cache per-instance (confirmed today) · mid-drive re-hello wall · async scrypt · gateway allowlist for scratch WS (e2e) · battery runner exit codes + CI wiring.

**B. World-truth defects (new this audit, player-visible every session):**
1. Kpata market — the game's commercial heart — renders **0 stalls** (food-area 0, ganaja 2) **[computed]**. layout.ts:1660.
2. RemoteVehicles shared-rig theft — multiplayer's most visible bug (cars vanish/teleport between players). RemoteVehicles.tsx:114/:179/:221.
3. Presence street staleness — co-presence and join laws misjudge while you walk. wire.ts:645-648.
4. ~1.8s synchronous module eval on world boot (layout 811ms + flora 1,021ms measured), of which **~0.4–0.8s is provably dead compute** (TREES 700 unused, GRASS 7,500→72 dots).
5. Road fabric artifacts: 72% dead-end way-ends, 18 underwater segments, open clip holes, no end caps **[computed]**.
6. Road-marking planes can sit *under* their own tarmac (markings +0.10 vs lift max +0.106; saved only by polygonOffset). WorldTerrain.tsx:617/:633 vs :661.
7. Puddles at fixed world y=0.035 — float above / bury under terrain across most of the map. polish.tsx:189.
8. Landmarks, traffic lights, ambient cars: all dead dressing (§4).

**C. UI debt (§3 top-10):** duplication family (location sheets, travel rows, money UIs, look editors), god components (HudOverlay 1,919 lines, PhoneScreen 1,155), hidden module-globals, stale era copy, dead orphans, and the design-system gaps in §6-P1 below.

**D. Design-system reality (score 6.5/10 — one identity, weakly enforced):**
- Two token generations coexist: dead shadcn oklch block (incl. a dark theme **nobody can reach** — no ThemeProvider) vs the real `--lko-*` palette (14 colors), which is **not registered in `@theme`** → ~1,300 arbitrary `bg-[var(--lko-star)]` usages (* wildcard class shown abstractly — the star stands for any lko colour token; the literal bracketed star once got harvested by Tailwind's docs scan and 500'd dev, F4 FIX 1) instead of real utilities.
- **Load-bearing classes that don't exist:** `lko-glass` used in 10+ files (kit.tsx:96,125 + BankPanel, LadderPanels…) and `lko-label` (kit.tsx:136) — zero definitions in globals.css (grep-verified).
- **Type scale broken in practice:** 171 standard sizes vs **1,191 arbitrary `text-[Npx]` across 25 distinct sizes (6.5px→26px)**; elder mode remaps only 4 of them.
- Three button systems (kit `Btn` / dead shadcn Button / raw `lko-press` in 45 files) · **≥6 sheet/modal implementations** with 4 different backdrop strengths and a hand-wedged z-ladder (z-[44]/[45]/[46]/[47]).
- Two parallel icon systems (icons.tsx 73 glyphs vs ui/icons.tsx 39, overlapping) + 420 emoji occurrences in content/chrome (🚏🔑💬🏍️ in controls-adjacent chrome).
- Currency drift: canonical `formatNaira` exists, but 38 `toLocaleString` sites remain (4 use `en-US`!) + ~136 raw `₦` template literals.
- Strengths worth keeping: spacing discipline (2,544 standard vs 2 arbitrary), tabular-num law, reduced-motion coverage, one motion vocabulary.

**E. Performance safety (where the margins really are):**
- SILK posture is genuinely good: TTI 2.54s, wire 389KB, heap 27MB, draw-call discipline (7 facade draws, doors 98×7→6 instanced buckets, K-nearest door-light pool, allocation-free traffic loops, zero whole-store zustand subscriptions).
- Real risks, ranked for mid-range mobile: (1) the 1.8s boot module-eval incl. dead compute; (2) HudOverlay rAF churn (per-frame `DriveUi` allocation HudOverlay.tsx:583-596, re-subscription on banner :678, 8Hz MiniMap re-render :155); (3) RemoteVehicles shared-rig + unbounded tagCache; (4) `frustumCulled={false}` grass/instanced layers (WorldTerrain.tsx:943-944, :989) — 10k tufts always submitted; (5) wire fan-out `broadcastRoster` on every presence change = O(n²) chatter at nation scale (index.ts:700-707); (6) no prod-build wire re-measurement on the current tree (G2 debt acknowledged in the plan itself).

**F. Journey gaps:** §2 closing list (no death loop, Bag stub, no multi-tab lock, guest-wall dead end, map has no friends, offline registration dead-end, split-brain driving economy, silent mic walls, memory-only stages).

---

## 6. RECOMMENDED UPGRADE ARCHITECTURE — "one world, no exits"

**Principle:** stop adding surfaces; make the ~140 existing ones read as ONE place. Six pillars, each anchored to what already exists (verified) so nothing is rebuilt.

**P1 — ONE DESIGN SYSTEM (the constitution).**
Register `--lko-*` in Tailwind 4 `@theme` (real utilities, kill ~1,300 arbitrary usages progressively); define the ghost classes (`lko-glass`, `lko-label`); one type scale (6 steps: 10/12/13.5/15/17/20 + display), elder-mode covers all small text; one button (`kit Btn`), one sheet (`SheetShell`) with a documented z-scale (20 scrim / 40 HUD / 50 sheet / 60 phone); one icon set (merge ui/icons.tsx into icons.tsx); route every currency through `formatNaira`; delete the dead shadcn block + radix Toaster + 40 unused primitives. Files: globals.css, ui/kit.tsx, icons.tsx, layout.tsx:77. **This is the multipliers layer — every later pixel lands cheaper.**

**P2 — THE WORLD ANSWERS (kill the 15 dead paths).**
Fix in order: stall filter (place rows OFF the carriageway by construction, not by rejection; add a count assertion to test-world3d.ts — the wipe-out was invisible because no test counts stalls) · RemoteVehicles rig-per-view (clone or key by handle) · presence street refresh on district change · wire loops 3–4 or delete them · drive-by handlers for landmarks (E on Confluence deck = the deck's own panel, not the generic sheet) · civic fence collider · lit traffic-light heads on the existing 3-phase law (junctions.ts:52-55 already computes it!) · road end-caps + water law on ribbons · delete TREES/GRASS dead compute. **No new systems — the existing 20 wired paths simply stop being surrounded by dead dressing.**

**P3 — BUILDINGS ARE THE INTERFACE.**
The bank-teller pattern (interior door → real panel inside a real building) is the proven template (BankPanel, CivicPanel, LoungeConfirm, WardrobePanel already work this way). Extend it: market stalls become the MealMenu's physical anchor (interact with a stall = eat/buy at that stall, reusing the existing eatMeal law); the GaragePanel gains a physical Motor-Park door instead of a radius pill; school interiors already exist for 98 doors. Wallet/transfer stays phone-only (it's the nation lane), but the Bank interior panel and the Bank app must become ONE component with two mounts (P1's shared MoneyHome).

**P4 — THE PHONE IS A WORLD OBJECT.**
The diegetic base is already laid and verified: overlay above the living street, freeze law, call banner + PiP video above the world, register-wall countdown. Evolve along the grain: NPC contacts unified into the same directory as real players (Chats is local-only today — migrate threads into social-store so the world doesn't eat them); speaking indicators (ring) on proximity-voice bodies; hunger/energy/mood rail chips fully tappable; the phone's app grid driven by the existing manifest (kill the hardcoded 26-grid drift).

**P5 — THE MAP BECOMES THE CITY'S INTELLIGENCE LAYER.**
Same MapCanvas pins, more truth: live friends/paddies from the roster (the data already flows — `wire:roster` carries street=location ids), garage/festival/business layers that deep-link into the same LocationSheet (after de-duplication), discovery moved from localStorage into the save. The 3D world's district banner + the 2D map must agree on the same presence source.

**P6 — THE LANDING IS THE DOORWAY.**
Replace the static key-art with a **live Lokoja**: the actual 3D scene (already procedural and cheap — buildings/terrain/atmosphere render in ~2s on mid tiers) as a slow cinematic fly-through (Patti → confluence → Ganaja junction), menu actions floating over it, "START" dissolving directly into spawn at your last location (world chunk + geo gate already idle-preload behind the menu). This is the single highest-emotion change and it reuses the engine — no new scene, just a camera path + composited menu. Fallback stays honest: static art on low tier / no-WebGL.

---

## 7. SAFE UPGRADE ORDER

**Gate 0 — Engineering debts that block trust in any UI layer (small, surgical):**
1. Fold bank deposit/withdraw (and the other 4 direct-cash sites: festival/ferry/travel) into the signed fortress path — the Profile "SECURE" badge must never lie again.
2. RemoteVehicles rig-per-view (multiplayer's ugliest visible bug).
3. Presence street refresh on district change.
4. Delete TREES/GRASS dead compute (free ~0.5–0.8s of world boot) + stall filter fix with a count test.
Each: fail-test → fix → green → commit (the Phase-1 protocol that worked).

**Phase A — Design System Core (P1).** Zero gameplay risk, unblocks everything; migrate chrome-first (HUD chips, sheets, buttons), measure SILK after (G2 wire must stay <900KB).
**Phase B — Landing doorway (P6).** Isolated from sim logic (menu chunk + a camera path); biggest first-impression ROI; honest fallback retained.
**Phase C — HUD + Phone (P4 + HudOverlay split into HudChrome/DriveHud/Sheets).** The god-component split rides the P1 primitives; touch targets and freeze law untouched.
**Phase D — Map intelligence (P5).** After LocationSheet de-duplication (§3 debt #1) so there's ONE sheet to extend.
**Phase E — World answers (P2 remainder) + Buildings-as-interface (P3).** Landmark handlers, stalls interactive, garage door.
**Continuous rule carried from ERA I:** no NEW gameplay systems until Gate 0 is green; every phase ends with the full regression loop (hardening 18/18, m24-wheels 90/90, m24-ledger 45/45, m24-fuel 53/53, SILK gates) and a commit.

---

## 8. POTENTIAL RISKS

1. **`ignoreBuildErrors: true`** (next.config.ts:6-8) — tsc currently reports 9 pre-existing errors outside src/; UI refactors can silently add type holes. Mitigation: tsc diff-gate per commit (the Phase-1 habit).
2. **Dual render paths in Dashboard** (mobile Dashboard.tsx:1019-1037 vs desktop :825-836) — every HUD/phone change must land twice or drift; P1 primitives + a responsive shell collapse are the cure.
3. **5,487-line store + 1,919-line HudOverlay** — highest blast radius in the client; slice-by-slice extraction with behavior-preserving commits only.
4. **Module-scope world gen + geo-gate ordering** — any new import into layout.ts family that evaluates before `initGeo()` sees an empty world; the P2/P6 work touches exactly this seam.
5. **Shared-systems zero-drift doctrine** — the wire server imports game systems verbatim (bodies/wheels/ledger/socialgraph); "just tweak" edits to those files change server behavior. Any touch = both suites.
6. **Save v20 migration ladder** — moving discovery/localStorage state INTO the save (P5) must ride the existing migration hook, not a new key sprawl.
7. **The 1u=26m arcade compression** — the landing fly-through will make the compression more noticeable (Patti is a 34u mound vs "480m real" comment); keep camera altitudes low and honest, or rescale deliberately as one decision.
8. **M13 laws** — any phone/landing redesign must keep all 40 minor-protection doors green (age bands, parent PIN, kid lexicon, mic walls).
9. **Platform gateway WS 502 on dynamic ports** (sid-bound routing, not ours) — staging for P4/P6 must use the :3003 lane or polling witnesses, or tests will lie.
10. **SILK regression risk from beauty** — landing cinematics, puddle shaders, fades all spend the mobile budget; DynResGovernor's extras-first stripping (device.ts:137-148) is the prescribed insertion point for anything optional.

---

## 9. SYSTEMS THAT MUST NOT BE BROKEN

| System | Anchor | The law |
|---|---|---|
| Fortress conservation | useGameStore.ts addMoney/removeMoney :3691-3820; wire theMove index.ts:963-1019 | every ₦ traceable; ₦0 drift; idemKey UNIQUE replay law |
| Server authority | index.ts proximity/relocation/clamp doors; N12 clamp wheels.ts:152-180 | server's own eye, never client coords |
| Identity & minors | scrypt PIN + salt; M13 40 doors; guest spectate | fail closed |
| Integrity walls | plate @unique, token index, 4KB cap, per-account rate buckets | structural, not check-then-write |
| Save v20 + envelope | save.ts (primary→shadow→backup descent, HMAC) | tamper fails closed |
| heightAt contract | layout.ts:834-952 (grid == brute-force equality law) | terrain/collision/camera all drink from it |
| geo-gate boot ordering | geo-gate.ts, Dashboard.tsx:76-86 | no layout-family module evaluates before initGeo |
| DOM⇄3D input contract | controls.ts (freeze law, consume-once gestures, drive handshake) | every new panel must freezeInput |
| The world never pauses | diegetic.ts:81-123 (no-pause, overlay verdicts) | tabs are sheets above the living street |
| Wire cadences | 10Hz bodies / 12Hz wheels only-while-moving; resume cursor cap 100 | mobile data + battery budget |
| OSM geography honesty | geo-v1.bin manifest; confluence 0.00u; 16 real bridges | the world stays the real Lokoja |
| SILK budgets | silk-gates.ts (TTI<3s, wire<900KB, 0 console errors) | every phase re-runs them |
| The 20 wired interaction systems | §4 list | upgrades extend, never bypass |
| Regression suites | hardening 18 · wheels 90 · ledger 45 · fuel 53 + test-db seam | green before every commit |

---

## 10. FIRST IMPLEMENTATION TARGET

**"Gate 0 + Design System Sprint 1"** — two commits' worth of work, ordered by trust-then-beauty:

**Gate 0 (engineering, ~half-day, protocol per item: fail-test → fix → green → commit):**
1. Signed bank ledger: `bankDeposit`/`bankWithdraw` (useGameStore.ts:2197-2278) route through the fortress kobo-chain like every other pocket move; assert chain verifies after deposit+withdraw; the Profile badge becomes true.
2. RemoteVehicles: rig per view (clone on cache hit, or key RIGS by handle) + tagCache LRU; regression: two same-model+paint cars render and move independently (e2e via roster seed).
3. Presence street follows the walker: publish street on district change (throttled, server-clamped), co-presence chip re-eval on a 5s tick.
4. World boot diet: delete `layout.TREES` scatter + reduce `GRASS` to the flowers' actual need (or derive flowers from GRASS_TUFTS); measure layout module eval before/after (target: −0.4s+ on the veil).
5. Stall resurrection: place stall rows by offset-from-road-edge construction; add `STALLS.length >= 20` and per-district minimums to scripts/test-world3d.ts (kpata ≥ 8).

**Design System Sprint 1 (pure addition, zero behavior change):**
- globals.css: register `--lko-*` in `@theme`; define `lko-glass`/`lko-label`; document the z-scale.
- ui/kit.tsx: `MoneyPill`, `GlassChip`-based HUD chip, `SheetShell` adopted by WorldPhoneLayer's three overlays (z-[45]/[46]/[47] → z-scale).
- One `LookPicker` extracted; `formatNaira` for the 4 `en-US` sites.
- Acceptance: SILK G1–G6 green on prod build, all regression suites green, zero console errors, screenshots at 360/390/1280 diffed against before.

**Why this first:** it clears the last trust debts (players can't see the ledger, but they *can* see two cars merge into one), deletes real boot time, resurrects the game's most-Nigerian scene (Kpata's stall rows) with a one-law fix, and builds the shared vocabulary every subsequent pillar (landing, HUD, map, phone) will be written in — the cheapest possible point to make the next ten upgrades land as one world.

---

*Audit artifacts: 6 auditor reports (engine, journey, inventory, world-touch, visual, design+perf) + this synthesis. Working notes preserved in the session transcript; this document is the canonical record. No code was modified (audit-only directive).*

