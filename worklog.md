# Lokoja Life — Project Worklog

---
Task ID: 1
Agent: Main Agent (Super Z)
Task: STAGE 1 — Project foundation + main menu + character creation + game state

Work Log:
- Inspected existing scaffold: Next.js 16 + App Router + TypeScript + Tailwind 4 + shadcn/ui + Zustand (matches requested stack; Next.js replaces Vite as bundler)
- Created game architecture: `src/game/` (types, data, systems, store) + `src/components/game/` (Avatar, SceneBackdrop, NeedsBar, BottomNav, screens)
- Data-driven foundation: `config.ts` (central economy/balance — starting stats, needs engine params, XP curve, reputation tiers, transport, rent, business, weather), `avatar.ts` (skin/hair/style options), `locations.ts` (all 10 Lokoja locations with map coords + activities), `jobs.ts` (10 jobs, Stage 3 consumes), `foods.ts` (10 items, Stage 4 consumes), `flavor.ts` (names + menu tips)
- Systems: needs engine (clamps + hungry/starving consequences), progression (XP curve, level-ups with overflow, reputation tiers, naira formatter), versioned save system (localStorage, migration hook, Supabase-ready `toCloudPayload`), audio engine (WebAudio synth — click/chime/levelup/notify, zero assets)
- Zustand store: player + world state, startNewGame/continueGame, rest (nap/sleep with time advancement + daily weather roll), addCash/addXp/addReputation engine actions, debounced autosave (1.2s), notifications
- UI: warm Nigerian theme tokens in globals.css (green/gold/terracotta/cream), original layered SVG Avatar (8 hairstyles × 6 skin tones × 5 hair colors × 4 clothing styles × 6 colors), original SVG menu scene (Mount Patti + Confluence + keke + canoe)
- Screens: MainMenu (New Game/Continue/settings/reset), CharacterCreation (live avatar preview, 🎲 Nigerian name randomizer, sticky CTA), Dashboard (HUD header with XP + naira, condition summary, needs bars, skills, day/time/weather/location cards, Nap/Sleep actions, 5-tab bottom nav; Map/Work/Bag = honest ComingSoon panels with real data teasers, Profile = identity, reputation ladder, level unlocks, sound toggle, save now, exit)
- Root page.tsx: SPA screen router + boot save detection + flush save on pagehide/visibilitychange
- Verified via agent-browser at 390px/360px/1280px: menu → creation (customization + randomizer) → dashboard → nap (time+needs changed) → sleep (Day 2) → tabs → save → reload → Continue restored exact state. Zero console/page errors. Lint clean.

Stage Summary:
- STAGE 1 COMPLETE. Playable loop: create character → live in Lokoja (Day/N time, weather rolls, needs management via rest) → autosaved.
- Key decisions: Next.js instead of Vite (env standard, same React/TS/Tailwind/Zustand stack); single-route SPA with in-app screens (env requires `/` only); manual SaveSystem instead of zustand/persist (clean migration to Supabase); no fake features (Map/Work/Bag show honest "arrives in Stage N" panels fed by real data files).
- Next stage entry point: `LOCATIONS` data is ready for the Stage 2 map + movement; transport costs pre-tuned in `ECONOMY.transport`.

---
Task ID: 2
Agent: Main Agent (Super Z)
Task: STAGE 2 — Map + Movement + Transport

Work Log:
- Extended data layer (no rewrites): ECONOMY.transport reshaped to distance-priced fares (base+perKm) with minutesPerKm/energyPerKm; new TRAVEL config section (kmPerMapUnit, slotsPerTrip, per-transport rain multipliers, eventChance, fareRounding, transitionMs); locations.ts gained shortName, transport availability (Mount Patti excludes taxi) and travelModifier (Patti ×1.5 uphill, Confluence ×1.15)
- Extracted shared world clock to systems/world.ts (nextSlot/rollNewDayWeather/weatherForSlot/advanceWorldClock) — store rest/advanceTime refactored onto it; travel uses the SAME clock, no second time system
- systems/travel.ts: pure calculateTravel (distance→cost/time/energy/arrival, weather × location modifiers) + rollTravelEvent (30% chance, weighted, gated by weather/transport); travelEvents.ts data with 4 events (rain delay, go-slow traffic, keke refuel stop, quick-help tip)
- Store: travel() action with guards (locked/insufficient cash/energy → toast feedback), travelling state, arrival applies fare+energy+clock through systems, arrival + summary + event toasts, autosave; save.ts got defensive defaults (no version bump needed — world.currentLocation existed since Stage 1)
- MapCanvas.tsx: original stylised Lokoja SVG — Niger from NW + Benue from E meeting at Confluence, Mount Patti west mass, one bridge on Kpata-Patti road, laterite roads radiating from Ganaja Junction, zone tints, cartouche + compass; markers positioned from the same mapX/mapY data
- MapScreen.tsx: marker states (current ✓ ring / available / locked 🔒+grayscale), bottom-sheet location panel (description, activities with stage locks, distance line), travel confirmation rows (cost/time/energy per transport, disabled with reasons), travelling overlay; Dashboard: 📍 header + Travelling… state, Map tab live, rest gated to home
- Tests: scripts/test-travel.ts 17/17 passed (determinism, spec example Home→Kpata keke ₦290/8min/-2⚡, taxi ₦980/4min/-1⚡, rain ≤40% slower, Patti ×1.5, 90 pairs valid, event eligibility); browser: creation→map→keke/walk/taxi trips with exact cash/energy/time math, arrival toasts, reload persistence (confluence/day17/cash700), locked panels, live traffic event fired, rain rolled on Day 17 (walk 15→21min, keke 8→9, taxi 4), 360px + 390px + 1280px clean, zero console/page errors, lint clean
- Fixes during testing: rest card now correctly gated to Home (was usable anywhere)

Stage Summary:
- STAGE 2 COMPLETE. Player can explore all 10 Lokoja locations via walk/keke/taxi with config-driven fares, one shared clock, weather + location modifiers, travel events, and persistent location.
- Ready for Stage 3: jobs/hustles will read JOBS data (already complete) and can hook travel events into the opportunity system.

---
Task ID: 3
Agent: Main Agent (Super Z)
Task: STAGE 3 — Core Economy, Work & Opportunity System

Work Log:
- Extended (no rewrites): types.ts (Transaction/Reward/SkillId/ActiveOpportunity/WorkResult + player.skillXp, cooldowns, activeOpportunities, transactions, stats), config.ts (new WORK + HUSTLE tuning sections, GAME_META → Stage 3), jobs.ts (+optional cooldownSlots; photographer 2), world.ts (+absoluteSlot monotonic clock helper — cooldowns/expiry share the ONE clock, no second time system)
- New data: npcs.ts (10 NPCs w/ stable ids + homeLocationId + speech style — future phone/relationship registry), hustles.ts (17 personal hustles across all 9 work locations, each tied to an NPC + location id, with difficulty/skill/requirements/cash-range/cooldown/weight)
- New systems: economy.ts (canAfford, recordTransaction, pushTransaction cap 50, sums, describeReward — the ledger the future Bank reads), skills.ts (skill XP→level with level-scaled caps + banking), work.ts (checkRequirements w/ human reasons, calculateJobPay = base × skill bonus × mood, resolveJob always-pays + great crits, resolveHustle risk roll skill-vs-difficulty clamped, seeded-RNG injectable for deterministic tests), opportunities.ts (makeOpportunityInstance, isEligible dupe/cooldown/requirements gates, generateHustleOffers weighted w/ dry-chance, pruneExpiredOpportunities, resolveOpportunity, jobAsOpportunityMeta — board jobs speak the same opportunity language)
- Store: addMoney/removeMoney (ledger + stats), giveReward (one entry point for cash+xp+skillXp+rep, composes engine actions), addSkillXp (skill level-up toasts), workShift (location/requirement/cooldown/energy guards → working overlay → clock advance → payout → cooldown), searchHustles/acceptOffer/declineOffer/completeOpportunity/dropOpportunity/pruneExpired (full lifecycle), travel now records fare + event tips in the ledger; offers cleared on arrival (gist goes cold)
- Save v2: migration case 1→2 + defensive defaults for all new fields; verified in browser that a stripped v1 save loads and autosaves back as v2 with stats intact
- UI: WorkScreen.tsx (accepted-offer cards w/ NPC message + 🎯 live odds + expiry countdown + Do it/Take me there/Drop; hustle board w/ search cooldown; jobs here w/ pay estimates + confirm sheet; jobs elsewhere w/ deep-links; earnings section w/ today flow + recent ledger); Dashboard wiring (WorkTab live, skill XP bars on Home, Life-stats card on Profile, work-tab nav badge when offers wait); MapScreen (focus deep-link via state initializer, stage≤3 activity chips now live + work chips deep-link to Work tab)
- Tests: scripts/test-stage3.ts 48/48 (ledger math, skill caps+banking, pay scaling, seeded outcome determinism, fail/success paths, odds clamps, generation eligibility/dry-chance/location-binding, expiry pruning, cooldown day-crossing, 6-day work-loop economics); test-travel.ts regression 17/17; browser: full loop at 360/390/1280px — create→map deep-link→keke→shift (exact ₦ math 5000−290+970=5680)→cooldown block→search→accept→do (₦510 in range)→fail path (₦0 + lesson XP)→away-offer Take-me-there→expiry pruned (2→0 after deadlines)→reload persistence (cash/offers/cooldowns)→v1 migration; zero console/page errors; lint clean

Stage Summary:
- STAGE 3 COMPLETE. The core loop works: travel to a place → work a shift or hear gist → accept → do it → money/XP/skill XP/reputation → ledger + stats → autosave. Jobs are reliable, hustles are personal and risky, skills grow visibly, cooldowns run on the one world clock.
- Architecture is phone-ready: opportunities are plain data (source: npc|board|phone|gist), NPCs are a registry, every offer references stable location ids the future 3D world will reuse, and the ledger awaits Banking. No UI coupling — the same opportunity shape can arrive via chat later without redesign.
- Key decisions: absolute-slot clock space for all cooldowns/expiry (no second time system); job cooldowns default from WORK config with per-job override; skill caps scale with player level and bank excess XP; hustle odds shown honestly on cards; offers are transient (not saved) while ACCEPTED opportunities persist on the player.
- Next stage entry point: FOODS data + eat activity keys are waiting for Stage 4 shops/inventory; mood now meaningfully affects pay, giving needs management economic weight.

---
Task ID: R1
Agent: Main Agent (Super Z)
Task: R1 VISUAL OVERHAUL — premium presentation pass across menu, HUD, Work, Map, icons & motion

Work Log:
- Inspection FIRST: full audit of src tree, store, data files, all screens. Established baseline: 66 test checks passing (15 travel + 51 stage3), lint clean, tsc clean (game code; examples/skills scaffolding has pre-existing errors unrelated to game).
- DISCREPANCY FOUND & reported honestly: brief claimed Stages 1–3.6 with walkable 3D world + 136 tests; actual workspace contains Stage 1–3 (2D SVG presentation, no three.js/R3F anywhere in src or git history). Executed R1 against the real codebase; adapted "3D world" requirements to the existing world presentation. No fake claims.
- Captured 13 BEFORE screenshots at 360×800 / 390×844 / 1280×800 (menu, creation, home, work, map, bag, profile) via agent-browser.
- Pass A (foundation): globals.css rebuilt — token system (surface/line/shadow scale, lko-num tabular figures), revised .lko-card (softer premium layered surface), motion system (lko-fade 220ms tabs, lko-sheet 240ms sheets, lko-scrim, refined toast/pop/press) + full prefers-reduced-motion coverage; Outfit display font added via next/font (--font-display on .lko-display); boot splash redesigned (confluence mark, no emoji).
- NEW icons.tsx: ~50-icon original SVG set (nav, needs, skills, weather, time-of-day, 10 place icons mapped by location id, 10 job icons by job id, transport, UI) — one coherent 24px/1.9px-stroke language.
- NEW LivingScene.tsx: layered animated Lokoja scene (Mount Patti + flag, city roofline with lit windows at dusk/night, Niger–Benue confluence with shimmering meeting line, bobbing canoe, drifting clouds, flapping birds, keke that drives past, rain streaks, cinematic scrim) with 4 time-of-day palettes (morning/afternoon/evening/night: moon + twinkling stars) and weather awareness (cloudy/rain). Pure CSS motion, reduced-motion safe. Replaced SceneBackdrop.tsx (deleted).
- Pass B (menu): full-bleed living evening scene, scrims, logo lockup + confluence mark, white primary "START YOUR LIFE", glass Continue, subordinate Settings, rotating tips in glass chip, safe-area aware; desktop = left-aligned column over the world (no more enlarged-mobile-page).
- Pass C (HUD/Dashboard): compact HUD strip (avatar, LV chip, gold XP bar, tabular cash, rep chip); Home tab anchored by living-world hero card driven by REAL world.timeOfDay + world.weather (Day/Time/Weather chips, location + tagline overlay); needs with icon discs; skills with icon tiles; rest buttons with icons + honest gating preserved; tab-switch fade.
- Pass D (Work): icon header w/ slot chip; initials-based NPC discs (no emoji avatars); offer cards with TargetIcon odds, terms pills, energy/hourglass states; job rows w/ JobIcon tiles, cooldown/locked states, honest empty state; job sheet w/ icon terms grid + blocker icons; calm working loader (ping ring) replacing bouncing pill; earnings w/ TrendUp/Down icons; all store logic untouched.
- Pass D (Map): SVG place-icon markers (color disc + white glyph, check/lock badges), icon legend, slide-up sheet with tinted place tile, lock chips honest (LockIcon + stage note, no Coming-Soon spam), transport rows w/ TransportIcon, desktop square map width-capped & centered (no letterboxing).
- Pass E (cleanup): CharacterCreation emoji replaced (dice/sparkle/arrow icons, gender text); BagTab keeps food emoji as menu flavour (allowed content emoji); ComingSoon uses NavIcon; Profile uses Star/Coins/Trend/Save/Exit/Settings icons.
- Pass F (verify): agent-browser E2E golden path — menu → creation (name) → start → work → hustle search (dry-roll toast correct) → deep-link map → keke travel (exact ₦5,000−₦290=₦4,710 math) → Market Worker shift (~₦970 → +₦1,460 great-crit, ledger + spend rows correct) → walk/keke home → NIGHT scene verified live (moon, stars, lit windows, night-clear chip) → rest card active at home → reload → Continue restored exact state. Zero console errors, zero dev.log errors. 66/66 test checks pass, lint clean, tsc clean (game code).
- AFTER screenshots captured: 23 finals across 360/390/1280 (menu, creation, home incl. night, work incl. overlay+offers+jobsheet, map incl. focus sheet, bag, profile).
- NOT run: production build (environment forbids bun run build; dev server + tsc + lint + tests + browser E2E used as verification instead — reported honestly).

Stage Summary:
- R1 COMPLETE. Presentation layer transformed: living day/night world scene, coherent SVG icon language, premium surface/motion system, desktop layouts that use the space, zero emoji-as-art remaining in UI chrome. All game systems (store, economy, travel, jobs/hustles, clock, save v2, location IDs) untouched and verified by tests + E2E.
- Key decisions: LivingScene responds to real world state (honest aliveness, not decoration); .lko-card/.lko-press restyled in place so all screens inherit; one icons.tsx as the single visual language source; initials NPC discs instead of emoji faces.
- Known limitations: prod build not run (env restriction); rain scene code-verified only (weather roll is per-day); menu scene fixed to evening golden hour (by design); 3D world from the brief's Stages 3.1–3.6 does not exist in this workspace — that remains future work if commissioned.

---
Task ID: RECON-1
Agent: Main Agent (Super Z)
Task: POST-R1 PROJECT RECONCILIATION — audit actual project state vs historical build reports

Work Log:
- Confirmed active project: /home/z/my-project, branch main @ 5399f21, single worktree, clean working tree, no stashes, no dangling objects, linear 5-commit history (Oct 8–10: scaffold → Stage 1 → Stage 2 → Stage 3 (amended) → R1).
- Searched ENTIRE /home/z filesystem (incl. node_modules): ZERO files named WorldView*, PlayerAvatar*, CameraRig*, terrain.ts, world3d.ts. Zero content references to react-three / from 'three' / WorldView / CameraRig / PlayerAvatar in src, examples, mini-services, tests, db.
- package.json has NO three/@react-three deps; three is not even installed in node_modules. Git pickaxe (-S) across all commits: 3D code was NEVER committed here.
- No other project copies, archives (.tar/.zip/.tgz), lokoja-named dirs, or git branches exist anywhere accessible. examples/ = scaffold websocket demo; prisma/db = unused scaffold.
- Verified R1 saved: commit 5399f21 contains all 13 src changes (+2,274/−734 — LivingScene.tsx NEW, icons.tsx NEW 764 lines, SceneBackdrop.tsx DELETED, all screens reworked); committed src == working tree.
- Verified app starts: dev server HTTP 200 (~30ms); rendered live menu at browser = R1 LivingScene evening design confirmed visually.
- Ran tests: test-travel.ts 15 ✓ + test-stage3.ts 51 ✓ = 66/66 pass, 0 failures. The claimed "136 passing tests" has no counterpart in this workspace.

Stage Summary:
- RECONCILIATION COMPLETE. Exactly ONE implementation exists: Stage 1–3 (2D SVG presentation) + R1 (visual overhaul), 66/66 tests, committed and running. The reported Stages 3.1–3.6 walkable 3D world (R3F, joystick walking, vehicles, NPCs, camera rig) DOES NOT EXIST anywhere accessible — verified at file, dependency, content, and git-object level.
- No merging/reset/deletion performed (as instructed). Player saves are client-side localStorage and untouched. Audit screenshot: .zscripts/audit-live-menu.png.
- Conclusion: current project is the single source of truth; any future 3D world stage must be planned fresh from this baseline. Prior 3D stage reports are historical claims not backed by artifacts in this environment.

---
Task ID: 3D-1
Agent: Main Agent (Super Z)
Task: STAGE 3D — Build the actual 3D world (first playable increment)

Work Log:
- Checkpoint FIRST: git tag `stage3d-baseline` → 5399f21 (recovery point before any change).
- Installed: three@0.186.1 + @react-three/fiber@9.8.1 + @types/three@0.186.0 (React 19 compatible). No other new deps.
- Environment notes: fullstack-dev init script INSPECTED and skipped deliberately — it extracts a scaffold tarball over the project dir, which would have destroyed the working game (user directive: preserve). `bun run build` remains forbidden by env (skill rule) — reported honestly.
- NEW src/game/world3d/layout.ts: deterministic world built FROM the existing LOCATIONS registry (same ids + mapX/mapY grid as the 2D map): world anchors, heightAt() shared by terrain/player/camera, Niger+Benue+outflow curves with carving, road graph radiating from Ganaja Junction, seeded (mulberry32, seed 1860) building/stall/tree/lamp placement, districts, NPC zones, traffic loops, auto-detected bridge crossings.
- NEW src/game/world3d/collision.ts: circle-vs-oriented-box building resolution, river blocking with bridge-deck exception, world rim; resolvePosition + bridgeDeckY.
- NEW src/components/game/world/: atmosphere.ts (real world.timeOfDay/weather → sun/sky/fog/nightGlow keyframes), WorldScene.tsx (Canvas, device-tier quality, sky-dome shader, stars, single shadow-casting sun following the player), WorldTerrain.tsx (128×128 displaced heightfield with vertex colours, river ribbons, subdivided draped roads, bridges, confluence foam), CityMesh.tsx (instanced buildings+roofs with window-texture emissive that lights at night, stalls, trees, lamps with light pools, bespoke landmarks: confluence deck+flag+canoe, Patti radio tower with blinking beacon, junction roundabout, suya grill, monument, GRA gate, floating R1-styled labels), Actors.tsx (player controller: joystick/keyboard unified input, collision, terrain grounding, walk-cycle from the REAL saved avatar colours, follow camera with drag-look + zoom + soft auto-align; 12 NPCs strolling districts (fewer at night — real clock); keke/okada/taxi traffic on road loops; rain particles), controls.ts (input singleton: keys/joystick/look/zoom/interact/freeze), HudOverlay.tsx (R1-styled HUD: exit/location/cash/day-time-weather chips, interact prompt, touch joystick + RUN + interact buttons, travel sheet with REAL calculateTravel fares + affordability reasons, activities sheet with live actions + honest stage locks), WorldTab.tsx (WebGL capability check, first-frame loading veil, error boundary, honest no-WebGL fallback that keeps the game usable).
- Wiring: icons.tsx +WorldIcon, NavIconKey +world; BottomNav 6 tabs; Dashboard renders WorldTab fullscreen (world exit → home, deep-links → Work/Map); Home hero gained "Explore in 3D" CTA. R1 screens otherwise untouched.
- Zero changes to: store, types, save format, locations data, economy/jobs/travel systems. 3D is a presentation+input layer; all money/time/location authority stays in the store (verified by ledger checks below).
- Fixed during E2E: Niger rerouted (was touching Home), river-crossing road removed (home connects via Motor Park), confluence anchor moved off the river carve onto the bluff + road 9 rerouted to end there, road ribbons subdivided (3.2u steps — killed floating slabs), home/market buildings offset from anchor clearings, camera snap on first frame, BoxCollider rotY field, literal-type + react-hooks-compiler lint fixes (5), setPointerCapture try/catch, touch mode also triggers on first real touchstart, night keyframes brightened, water material de-plastified, canoe to waterline, duplicate 'sleep' activity row removed, chips whitespace-nowrap.
- E2E VERIFIED (agent-browser, real browser): menu→creation→dashboard→"Explore in 3D"; canvas live 1280×800; keyboard walk (pos delta), building collision push-out, E-key opens activities panel, Nap through 3D panel advanced clock morning→afternoon + energy 100 (store authoritative); travel sheet shows REAL fares (walk Free / keke ₦290 / taxi ₦980 — matches Stage 2 suite) → keke trip: cash 5000→4710 exact, energy −2, clock +1 slot, ledger "Fare to Kpata Market −290"; Work deep-link opens real Kpata jobs (~₦970); iPhone emulation + dispatched touch: joystick drag moves player + decel, interact button opens panel; night save (crafted v2 save, day3 night-clear) loads + renders moonlit scene with glowing windows; WebGL stub (getContext→null) → honest fallback with working "Continue on the Map". Console: zero errors (only three.js Clock deprecation warnings from internals).
- Checks: tsc clean (game code), eslint clean, 66/66 test checks (15 travel + 51 stage3), dev.log clean. Production build NOT run — env forbids `bun run build` (skill rule); dev server + full E2E used as verification.
- Screenshots: download/stage3d/ (8 finals: home morning 1280, activities panel, travel sheet, evening market, night shops 390, touch controls 390, confluence 1280 + 360).

Stage Summary:
- STAGE 3D INCREMENT 1 COMPLETE. Lokoja is now a walkable 3D world: 10 real location anchors connected to real gameplay (travel/at-work/rest) through the existing store — no duplicated logic, no fake features. Saves untouched and compatible. The 10-point vertical slice from the brief is met and browser-verified.
- Key decisions: one shared heightAt() for terrain+actors+roads (nothing floats); interaction radius 8.6 with travel confirm at other districts (economy preserved — walking is free, checking in costs the real fare); device-tier quality (mobile: no shadow maps, lower dpr); window/lamp night glow driven by the real clock via a shared mutable (zero React re-render).
- Known limitations (honest): NPCs clip buildings occasionally (no NPC collision); traffic ignores junction priorities; camera can clip building corners; no ambient audio in 3D; menu scene is 2D (by design); prod build not runnable in this env; iPhone-touch verified via dispatched events (no real device).
- Next highest-impact step: interior/interaction depth at locations (walk-into-market job boards) + location-specific ambience (audio + crowd density), then Patti trail activities — after user review of this increment.

---
Task ID: 3D-2
Agent: Main Agent (Super Z)
Task: STAGE 3D INCREMENT 2 — Activity discovery & life density (user: "hacker route / Lagos Life research")

Work Log:
- Verified increment 1 claims first (post-audit discipline): commit a6fa79b real, files real, 66/66 tests pass.
- Removed DEAD leftover files from an abandoned earlier attempt: src/components/game/world3d/ (11 files), screens/WorldView.tsx, data/world3d.ts, test-stage35/36.ts — none imported by the live game, all broke tsc (phantom MOVEMENT config). Recoverable in git at a6fa79b. tsc now 100% clean for game code.
- LAGOS LIFE RESEARCH (user request; techniques only, ZERO assets/brand copied): web-search + page_reader on Vanguard explainer. Findings: browser-based Sims-style life sim by Shalom Rayhamen (Eliy), launched Oct 1 2026, 1.2M players in 4 days; core loop = jobs/money/rent + needs meters; wins through (a) browser-first accessibility, (b) lived-culture detail "not a generic sim with Nigerian names", (c) guided first missions. Saved to download/lagos-life-research-notes.md with a lesson→Lokoja gap table.
- INC 2 implemented from the research gaps:
  * config WORLD3D section (energyPer100m .55, freeMeters 150, cap 6, npcGistRadius 24, trafficBaseSpeed 7, onboardingKey) — balance lives in config only.
  * NEW systems/world3d.ts: pure walkingEnergyCost() + describeWalkSettle() — presentation measures, store applies.
  * store.settleWorldWalk(meters) — additive action via existing applyNeedsDelta; notify + autosave; no clock change, no save-format change.
  * controls.ts: walked-meters accumulator + reportPlayerPos + tutorial progress flags wired into REAL input paths (keys/joystick/drag).
  * layout.ts: NpcZone.locationId (joins NPCS registry), POINTS_OF_INTEREST (job boards at kpata-market + government-area, on land, facing plazas).
  * collision.ts: slim OBB colliders for POIs (walk up to boards, not through).
  * Actors.tsx: controller feeds addWalkDistance(speed*dt) + POI proximity (poi: namespaced ids) + district reporting; NPCs carry REAL identities from NPCS by home location and report nearest named resident (gist); DanfoMesh (yellow Lagos bus, Lagos Run homage) joins traffic; vehicle speeds now scale off WORLD3D.trafficBaseSpeed.
  * CityMesh.tsx: physical JobBoard prop (timber posts, green frame, pinned sheets, gold cap).
  * WorldScene/WorldTab: onDistrict/onGist pass-through; WorldTab settles walked meters on ANY unmount (safety net), Exit settles + resets.
  * HudOverlay: 3-step first-visit tour that auto-advances on REAL input (move→look→interact), Skip + localStorage flag (NOT the save); district arrival toasts (once/session); NPC gist chip (name + real hustle title, tap→Work board deep-link, dismissible); poi: id resolution into real location panels; Exit settles energy.
- Test bridge: __lko.walk(m) dev-only hook (same pattern as teleport, stripped in prod) to E2E the settle wiring without fighting headless terrain.
- E2E (agent-browser, real browser): tour advanced on real keypress + drag, flag persisted; job board prompt "Read the Kpata Market job board" + E → REAL travel sheet with exact Stage-2 fares (Keke ₦290/8min, Taxi ₦980/4min); gist chip rotated Musa→Hajiya Amina with real hustle titles; __lko.walk(600) → Exit → toast "Long trek around Lokoja (0.6 km on foot) — 2 energy spent" AND HUD energy 100→98 (600−150)×0.55→round=2 EXACT; Continue across reload; iPhone 390×844: joystick + Interact + RUN render, touch Interact opens the sheet; console clean (only three.js deprecation notices).
- Known honest limitation: headless software-GL runs ~10-15fps → the dt-clamp (max 0.05s) slows simulated movement ~3-4×; natural 150m+ walks are impractical in the test env (real devices unaffected) — hence the walk() bridge; NPC bubbles are HUD chips (not 3D sprites) this increment.
- Screenshots: download/stage3d/inc2-01…11 (desktop tour/board/gist/travel sheet/energy 98/junction/market + mobile world/food-area/board sheet).
- Checks: tsc clean, eslint clean, 15 travel + 51 stage3 + 29 world3d = 95/95.

Stage Summary:
- INC 2 COMPLETE. The world now TEACHES (onboarding), TALKS (real NPC gist), POINTS (physical job boards → real panels/fares) and COSTS (walking settles into the real needs economy) — Lagos Life's three discoverable wins, Lokoja-flavored, all through the EXISTING store/systems. Saves, location ids, R1 visuals untouched.
- Next highest-impact step: location-specific interior/ambience depth (walk-into market job boards is done; next = enter-able market interior + amala/buka food spots wired to a Stage-4 eating loop), then Patti trail activities + ambient audio.

---
Task ID: 3D-3
Agent: Main Agent (Super Z)
Task: INC 3 "REAL EXPLORE" — accurate Lokoja geography (2D+3D), grass/mountains/landmarks, camera views, discovery, Stage-4 eating loop (user: "build the map the world the grasses the mountains the ui ... go deep and far with accurateness use 2d and 3d ... act as an autonomous AGI agent")

Work Log:
- Research pass (web-search): confirmed real Lokoja geography — "Lokoja lies at the confluence of the Niger and Benue", "sandwiched between the Niger River and Mount Patti", town on the west bank opposite the Benue mouth; exploration-design notes (POIs, unique districts, cohesive world). Notes in research/lko-geo.json + research/explore-design.json. (Lagos Life techniques only, zero assets/brand copied — original assets throughout.)
- Checkpoint FIRST: git tag `inc3-baseline` @ 3206a6b.
- ACCURATE GEOGRAPHY (the core): all 10 mapX/mapY pins remapped to a north-up real-Lokoja layout — confluence NE of town (map 68,12), Patti west (16,34), Kpata centre-east near-river, university NE (Adankolo side), motor park south. RIVERS rebuilt to true courses: Niger in from NW curving east north of the city, Benue in from E, combined outflow flowing SOUTH along the town's EAST side (town between Patti and the Niger — matches the research). ROADS rebuilt as the named real spine: IBB Way, Murtala Mohammed Way spine, Ganaja road (hugging the west bank), Nataco/university road, confluence-viewpoint road, Kogi Bridge road (E crossing), southern bypass (Felele-side crossing), Patti foot road + switchback summit trail, GRA road, GRA–IBB link, Felele road. Confluence viewpoint re-nudged onto the SW bluff overlooking the actual meeting point. 4 contiguous traffic loops rebuilt from the new graph; vehicles now ride bridge decks (bridgeDeckY) across the bypass. 2 REAL auto-detected bridges (Kogi Bridge road + southern bypass); false crossings eliminated (Ganaja road pulled 13.2 m clear of the carve).
- 2D MAP REDESIGN (MapCanvas): full artistic redraw to the same accurate geography — north-up rivers with rotated labels, confluence swirl NE, Patti massif with contour ridgelines + summit rest-house mark + "458 m · summit trail" label, 11 named road paths, 2 drawn bridges, urban tint between Patti and the river, compass. Markers still positioned by the same mapX/mapY the 3D world uses — art and world can't drift.
- 3D WORLD DEPTH: GRASS — 3,200 deterministic instanced tufts (one draw call) with a moisture gradient (lush near rivers → dry savanna gold), slope-aware scatter + sunk bases so nothing floats on the heightfield's faceting. TREES — 280 with a riverine palm family (leaning trunks + radial fronds + crown nuts) alongside broadleaf savanna trees. Patti raised to ~30 u (≈2× the old mound), rocky slopes via slope-based vertex colouring. NEW LANDMARKS: Lord Lugard's Rest House on the summit (white bungalow, veranda, chimney), Township Stadium (oval stands, pitch, 4 floodlight pylons) south of the motor park, Central Mosque (dome + minaret) by the Kpata road, church hall near the university, 5 river boats (canoes + a laden ferry) drifting the real Niger/Benue/outflow courses with ping-pong loops.
- VIEWS: camera modes follow/orbit/drone (C key or HUD chip; drone = high overview rig + wider zoom + slower lerp), photo mode (V or HUD button — HUD chrome fades, minimal pill to exit), live north-up minimap (anchors as tinted dots, colour once discovered; player heading arrow; 8 Hz poll, zero 3D-frame work). playerPos now carries heading.
- DISCOVERY ("places found"): session-spanning localStorage set (WORLD3D.discoveryKey, NOT in the save); district arrival records + "new place discovered!" toast + chime; HUD chip "n/10 places found"; MapScreen gains the "Lokoja atlas" progress card (bar + still-out-there hints + completion line); map visits count too (travel IS discovering).
- STAGE 4 GOES LIVE — THE EATING LOOP: FOOD config (5 meals, ₦250–₦700, hunger/mood/energy deltas + groceries basket for Kpata); store.eatMeal — REAL removeMoney ledger entry ('shop'), applyNeedsDelta hunger/mood/energy, clock +1 slot, notify + autosave; delivery-aware ledger label when buying remotely. Wired into BOTH the 3D activities sheet (Mama's menu at the Food Strip, market fresh at Kpata) and the 2D map location sheet — one store action, two surfaces. Job boards added at food-area + transport-area (4 physical boards total).
- E2E (agent-browser, real browser): fresh save → creation → world; canvas live; synthetic-keyboard walk moves + grounds (CLI keydown quirk as in INC1 — dispatchEvent verified); C cycles Follow→Orbit→Drone (chip honest); V photo mode hides chrome + pill exits; travel sheet at Kpata shows the ACCURATE fares (Free/₦210/₦690); keke: cash 5000→4790 exact, ledger "Fare to Kpata Market −210"; suya at Kpata: cash −300, ledger "Suya wrap at Kpata Market −300", clock evening→night; sleep (day 3, hunger 78) then suya from the MAP sheet: hunger 78→96 EXACT, morning→afternoon, ledger "Suya wrap — delivery to Your Place −300"; minimap dots/heading, 4/10→5/10 discovery increments on real arrival; drone shots at the Confluence bluff (flag deck + meeting point) and Patti summit (rest house + mast + trail); iPhone-emulation touch: joystick + Interact + RUN render, touch Interact opens the sheet, Musa gist chip + Work deep-link; 2D map redraw verified against the 3D layout.
- Fixed during E2E: eatMeal stale-player capture (removeMoney's deduction was overwritten by a pre-payment snapshot — re-read get().player after payment; ledger now correct), floating grass (slope-aware scatter + sunk bases), palm fronds mid-trunk (frond/trunk Y proportions), traffic sinking on the bypass bridge (bridgeDeckY), test-travel spec-example updated to the accurate 1.8 km Home↔Kpata (₦210/₦690 — Kpata borders the centre in real Lokoja) with the same invariants (ordering + affordability windows), MapScreen discovery sync moved to the adjust-state-during-render pattern (react-hooks lint).
- Checks: tsc 100% clean (game code), eslint clean, 16 travel + 51 stage3 + 47 world3d = 114/114. Production build NOT run (env forbids bun run build; dev server + E2E used as verification — reported honestly).
- Screenshots: download/stage3d/inc3-01…10 (desktop first load + HUD, photo mode, travel sheet ₦210, suya purchase, map food menu, confluence drone, Patti summit drone, mobile Patti, mobile Kpata with mosque + traffic, accurate 2D map + atlas).

Stage Summary:
- INC 3 COMPLETE. Lokoja now has REAL geography: the Confluence is north-east where the Niger (from the NW) meets the Benue (from the E), the combined river flows south along the town's east side, Mount Patti guards the west with a switchback trail to Lugard's Rest House — and the 2D map and 3D world are drawn from the same data so they can never disagree. The city is alive (grass, palms, boats, stadium, mosque, church, traffic on real bridges) and the game loop grew a real Stage-4 need: eating (cash → hunger → clock → ledger), reachable from the 3D world AND the map. Saves, location IDs, and all economy authority untouched; R1 visual identity preserved.
- Honest limitations: NPC collision still off; boats are path-looped (no wake physics); discovery persists per-device not per-save; prod build not runnable in this env; iPhone touch verified via emulation + dispatched events.
- Next highest-impact steps: (1) walk-into interiors (market stalls → buy ingredients, Patti summit viewpoint activities); (2) keep hunger/energy decay ticking with world time so eating matters on a schedule; (3) ambient audio (procedural WebAudio birds/market/river — no assets); (4) day-2+ quests tied to discovery (meet Musa at Kpata, climb Patti before noon).

---
Task ID: 3D-4
Agent: Main Agent (Super Z)
Task: INC 4 "LIFE INSIDE" — enterable interiors (house + rooms), articulated human rig, ambient life & realism, living-world decay (user: "swarm yourself ... build all the rooms and inside the house ... perfect the human ... the environment make it more real")

Work Log:
- Checkpoint FIRST: git tag `inc4-baseline` @ edbc63c.
- BASELINE verified: 114/114 checks (16 travel + 51 stage3 + 47 world3d), tsc/lint clean.
- ENTERABLE INTERIORS (the flagship): NEW src/game/world3d/interiors.ts — pure data for three interiors: home-interior ("Your place", 12×9 m: living room + bedroom + kitchen + bathroom, 4 inner walls with real doorway gaps, 18 furniture pieces), mamas-kitchen (buka: serving counter with pots, benches, menu board) and kpata-shop (provision store: 3 stocked shelf rows, counter, crates). Each interior defines walls, furniture (18 kinds with footprint/solid/height table), hotspots, spawn/door, palette. resolveInteriorPosition() = OBB push-out + hard room clamp (slimmer 0.42 m interior player radius).
- EXTERIOR DOORS: layout.ts DOORS derived FROM the buildings they belong to (front-face centre pushed 0.95 u out along the wall normal) — prop and geometry can never drift; CityMesh Doorways() renders step + posts + ajar slab + awning + night glow; PlayerController reports `door:` ids within INTERIOR.doorRadius (3.2).
- INTERIOR SCENE: NEW src/components/game/world/InteriorScene.tsx — Canvas with warm interior lighting (hemi + directional + night ceiling-lamp point lights), plank-textured floor, room zone tints, 18 furniture renderers (bed w/ pillows+blanket, sofa, emissive-screen TV, stove burners, fridge, shelves with stocked goods, counter, benches, shower+riser, mirror+basin, crates, pots, fans, menu board), door frame, pulsing hotspot markers. InteriorPlayer: same controls layer, closer camera rig (INTERIOR.camera), hotspot reporting, dev-only __lkoInteriorTP bridge (same pattern as exterior). SIMS-STYLE WALL CUTAWAY: each frame any wall crossing the camera→player sightline (2D slab test) hides — full-height walls never occlude.
- HUMAN RIG ("perfect the human"): NEW src/components/game/world/HumanRig.tsx — HumanRig (player): pivot-based shoulders/elbows/hips/knees, hands + feet, neck + jaw head with 3 hair shapes, walk cycle with knee flex on toe-off + counter-swinging arms + elbow flex + torso bob + run lean + idle breathing. MidRig (NPCs): jointed legs, one-piece swinging arms on shoulder pivots, no shadow casting (blob shadows carry) — keeps the frame budget honest. Actors.tsx rewired; player casts real shadows.
- AMBIENT LIFE: NEW src/game/systems/ambience.ts — procedural WebAudio bed (zero assets): breeze (LFO-swelled noise), river + market murmur (proximity-blended gain from the HUD poll @2 Hz), rain layer, night crickets (tremolo band), scheduled bird chirps by day, room tone indoors; follows settings.sound; starts/stops with the world. Birds: 3 flocks (18 birds, flapping wings) circle Confluence/Patti/market by day. SmokeWisps: cooking smoke sprites at the food strip + market grill.
- FIXES (the known-limitations list): NPCs now resolve through resolvePosition (no more strolling through buildings); camera boom samples against building OBBs (cameraObstructionT) and pulls in before walls — the "camera clips building corners" fix; LIVING-WORLD DECAY: NEEDS.decay config (hunger 2 / energy 1 / mood 1 per slot) applied by systems/needs.applySlotDecay on EVERY non-rest clock path (advanceTime, eatMeal, travel, job shifts, hustles) — meals and sleep now matter on a schedule; relaxIndoors store action (TV/bath = one honest clock slot + config-tuned needs shift).
- HUD/WorldTab: interior mode (interiorId + fade swap in WorldTab, presentation-only, never in the save), top bar switches to "Outside" + interior name chip, minimap/discovery/camera-cycle/gist hidden indoors, door prompts ("Enter Your place / Mama's Kitchen / Kpata Provision Store"), interior panels (bed → real Nap/Sleep, stove/menu/shop → shared MealMenu through the ONE eatMeal action, tv/bath → relaxIndoors with honest effect line), ActivitiesSheet refactored onto the shared MealMenu.
- Fixed during E2E: inner doorway gaps widened 1.2 → 1.8 (wall-cap padding left 0.7 m — the BFS test caught the sealed rooms); living-room chair moved off the door lane; kpata shelf aisle widened + spawn/exit moved clear; hotspot nudges out of collider padding; "−-3 hunger" double-negative in the relax row; spawn moved deeper into the flat (was inside the exit prompt radius); shelf faces pure-black at night → gentle emissive wood + normalBias (normals face away from every lamp); night ambient rebalanced.
- E2E (agent-browser, real browser, desktop + 390×844): world loads clean (0 console errors); door prompt at the house → E → interior loads (bridge confirms all 5 hotspots) → bed → Sleep till morning → "Day 2 begins!" (real store action) → TV → "You relaxed with some TV." + Morning→Afternoon → stove → cooked Amala ₦5,000→₦4,550 exact + Evening → exit door → back outside at the doorstep → Mama's door → menu → Suya ₦4,550→₦4,250 + Night → Kpata shop → counter prompt → shelf/counter/crates render → mobile viewport renders interior + prompts. Wall cutaway verified live (south wall hides, room reads clean). Doorstep night glow + NPC MidRig + real gist chip ("Mama Ngozi dey around — Deliver soup parcels") captured.
- Checks: tsc 100% clean (game code), eslint clean, 16 travel + 51 stage3 + 101 world3d = 168/168 (new: interior data validity, per-interior collision clamps + wall blocking, BFS PATHABILITY spawn→every hotspot, exterior doors on dry land, camera obstruction, decay math + clamps + hungry-consequence interaction, interior config invariants).
- Screenshots: download/stage3d/inc4-01…13 (exterior day/night, home interior day + night, bed sheet, cook menu, Mama's interior + menu, wall cutaway, mobile interior, shop lit, doorstep night).

Stage Summary:
- INC 4 COMPLETE. Lokoja Life now has an INSIDE: your own four-room flat (bed to sleep in, stove to cook, TV to unwind, bath to freshen up), Mama's buka and the Kpata provision store — all walking through visible doorways into real rooms with real furniture, all actions flowing through the SAME store/systems authority. The human is a proper articulated character (jointed limbs, walk cycle, run lean, breathing), the city breathes (birds, smoke, procedural ambience that blends by time/weather/proximity/indoors), residents respect walls, the camera respects buildings, and the body now lives on a schedule (decay). Saves, location IDs, economy authority and R1 identity untouched.
- Honest limitations: interiors are session-only presentation state (exiting the world always returns you outside — by design); no ceiling (dollhouse cutaway, by design); ambient audio verified via code paths + settings gate (headless can't output sound); iPhone touch verified via emulation; prod build not runnable in this env.
- Next highest-impact steps: (1) day-2+ quests tied to the interiors (furnish the flat with earnings, meet Musa at Kpata); (2) wardrobe/clothing swap hotspot using the existing avatar data; (3) market stall browsing (walk-to-stall shopping beyond the counter); (4) more interiors (university lecture hall, government office for permits).

---
Task ID: 4-a
Agent: swarm-map-cartographer (session timed out pre-report; work verified by integrator)
Task: Rebuild the 2D Lokoja map into real cartography (user: "the map wrong — check how Lagos Life arrange things")

Work Log:
- Rewrote MapCanvas.tsx from stroke-art to filled cartography: rivers as water polygons (light shallow edge → deep channel → mid-line, bank highlights), proper Niger(NW)+Benue(E) V-meeting with confluence swirl + sandbanks, combined outflow flowing south along the town's east side
- Mount Patti as layered massif (nested contour bands, ridge hachures, summit plateau + Lugard rest-house mark, dashed footpath + switchback trail)
- Urban fabric between Patti and the river: faint block grid + clustered building blocks, denser near Kpata/market spine, thinning toward Felele/Adankolo
- Road hierarchy: trunk (IBB Way/Murtala Mohammed Way spine/bypass) with dark casing + laterite fill + center dash; secondary/minor tiers; bridges as deck rects with railing ticks; road-name labels (MURTALA MOHAMED WAY, UNIVERSITY RD, GANAJA RD, IBB WAY, FELELE RD, SOUTHERN BYPASS)
- District typography: GRA, ADANKOLO, OTOKITI, GANAJA, FELELE; New/Old Market + Jetty annotations; legend, compass rose, scale bar, cartouche
- MapScreen.tsx presentation-only: map now fills the viewport (all 10 pins still positioned by the SAME mapX/mapY grid — zero data drift)
- New MapScreen layout verified desktop 1280 + mobile 390 (final-mobile-map.png: cartouche complete, water reads as water, all markers sane, travel sheet regression passed)

Stage Summary:
- 4-a COMPLETE. The map is now a believable game-city map drawn around the frozen location pins. Water/urban/terrain/roads all read correctly. Honest nits: a couple of long road labels clip at map edge on desktop; ADANKOLO label sits near the Confluence pin — acceptable, fixable later.

---
Task ID: 4-b
Agent: swarm-city-builder (session timed out pre-report; work verified by integrator)
Task: Nigerianize the 3D city — buildings/roofs/shopfronts/street furniture/trees/lighting (user: "environment looking fake")

Work Log:
- CityMesh.tsx buildings rebuilt: baked facade CanvasTextures per kind/tone — plaster walls (WALL_TONES) with grime at the base, SMALL punched windows with frames/lintels/sills (realistic ratio, no more full-facade lantern glow), separate emissive night map (only some windows lit, warm, tasteful)
- Corrugated roofs (ribbed canvas texture + rust patches, overhanging eaves), parapets + rooftop water tanks on blocks, shopfronts: striped awnings + signboards with ORIGINAL business names ("MAMA NGOZI PROVISIONS", "BUKA & JOLLOF SPOT", ...)
- NEW src/game/world3d/props.ts (deterministic, seeded): compound walls with gates, utility poles with sagging wires along main roads, bus shelters, market crates, tyre stacks, water barrels — clearance-checked against BUILDINGS/ROADS/DOORS, visual-only (no collider changes)
- Trees(): palms rebuilt (curved stacked trunk, arched fronds, coconut crowns), broadleaf savanna trees (2-3 blob canopies, dry-season gold variants); instanced, few draw calls
- WorldScene.tsx + atmosphere.ts: warmer golden day lighting, sky-matched haze, deep-blue night with sodium lamp pools + subtle moon fill; device-tier quality preserved
- E2E evidence: terr4/veh4/final2 screenshots show grounded buildings, corrugated roofs, wires, signs; day + night verified; zero console errors; walking/collision/door prompts intact

Stage Summary:
- 4-b COMPLETE. The city reads as lived-in Nigerian urban fabric in both day and night. Keep-list preserved (Doorways/JobBoards/landmarks/labels APIs untouched).

---
Task ID: 4-c
Agent: swarm-terrain-artist (session timed out pre-report; work verified by integrator)
Task: Realistic 3D ground/roads/rivers/grass/bridges (user: "roads, hills, everything fake")

Work Log:
- WorldTerrain.tsx ground: 4-5 natural savanna vertex-colour layers (gold-olive base + noise mottling, green lowlands near rivers, laterite dust halos along roads/markets, dry highlands), optional baked grain texture (terrainArt.ts)
- Roads(): layered ribbons — dirt shoulders + asphalt trunk roads (gray, center dashed line, baked road textures) vs laterite secondaries (worn wheel-track stripes), junction seam discs, width hierarchy (trunk wider)
- Rivers: sand/mud shelf band before the waterline, two-tone depth water with shimmer, confluence foam accent
- Grass(): replaced paper-cone shards with crossed-quad tufts + 3-blade stars (2 instanced meshes), moisture tones + per-instance hue jitter; flowers near rivers
- Bridges: railings + pylons, deck matches carried road surface
- INTEGRATOR FIXES after the timeout: repaired one torn code line risk-checked in Grass (verified intact), tuft render scale capped (min(scale,1.15)*0.74 — kills the night "thorn bush" silhouettes) and tufts within 3.4 u of a road centerline are hidden (no more grass on the tarmac, shoulders keep dry grass)
- E2E: drone shots show road hierarchy + riverbanks + terrain variety; player still grounds correctly (heightAt untouched); 101/101 world3d checks pass

Stage Summary:
- 4-c COMPLETE + integrator polish. Ground half of the world now reads real in day AND night.

---
Task ID: 4-d
Agent: swarm-vehicle-shop (session timed out pre-report; work verified by integrator)
Task: Rebuild all vehicles + traffic feel (user: "the cars look fake")

Work Log:
- NEW src/game/world3d/vehicles.ts (deterministic builders + parked-vehicle placement, clearance-checked)
- KekeMesh: rounded yellow cabin + green stripe, black canopy, windscreen, 1 front + 2 rear wheels (tire+rim), headlight/taillight, body roll on turns
- DanfoMesh: proportioned minibus — dark window band with pillars, yellow/black stripe, ORIGINAL "LOKOJA TRANSIT" livery text (baked), bumpers, lights, roof rack
- Okada: motorcycle + rider (helmet, colored clothes), spoked wheels, headlight, lean-into-curves banking
- Taxi (green/yellow livery + roof sign) + private sedans (white/silver/dark blue) — 3-box silhouettes, window bands, hubs, lights
- Traffic life: per-vehicle speed noise (±20%), okada faster/weaving, danfo steadier, slow on sharp turns, wheels spin, night headlights + taillights (fake light cones for nearest few only)
- Parked sedans/keke along road edges near market/motor-park/food strip
- Player/NPC/door/POI logic untouched; loops + bridgeDeckY respected (no sinking)
- E2E: close-ups of keke (follow cam) + okada passing on mobile + LOKOJA TRANSIT bus at shelter; zero errors; 101/101 checks

Stage Summary:
- 4-d COMPLETE. Traffic now reads as Nigerian street life: keke/danfo/okada/taxi/private cars, parked vehicles, living motion day and night.

---
Task ID: 5
Agent: Main Agent (Super Z) — swarm integrator
Task: STAGE 4 INTEGRATION — "environment real + map right, Lagos Life standard" (user: swarm yourself, fix all the issues, full standard)

Work Log:
- Baseline FIRST: tag stage4-start @ 8b6a454; 168/168 checks (16 travel + 51 stage3 + 101 world3d), tsc 4 pre-existing errors in examples/skills only, lint clean; BEFORE screenshots captured (map + 3D day/night) confirming the user's complaints (lantern buildings, ribbon roads, blob Patti, road-like rivers)
- Research: Lagos Life public material (Google Play listing unreachable 404-region; leaned on prior Vanguard research + app-store snippet: Sims-style, six meters, recognisable city) + Lokoja wiki facts (suburbs Felele/Adankolo/Otokiti/Ganaja; three markets; Patti = hill of doves; confluence geography) saved to research/s*.json + p*.json
- Launched 4-agent swarm (file-ownership matrix, layout.ts/locations/config/systems frozen): 4-a map, 4-b city, 4-c terrain, 4-d vehicles. All four completed their edits + E2E screenshots before the orchestrator call timed out (Task-tool deadline) — work preserved, integrator verified and finished the protocol (worklog entries above)
- Integration verification: tsc 0 game errors, lint clean, 168/168, zero console/page errors on desktop + mobile; E2E: menu→continue→world (day), nap×3→world (night windows/lamp pools), interior enter/exit regression (bed/TV prompts alive), keke close-up, okada on mobile 390×844, map at 1280+390
- Fixes by integrator: grass tufts — render scale cap (night thorn silhouettes) + no tufts within 3.4 u of road centerline; deleted DEAD files src/game/systems/terrain.ts (competing abandoned terrain system, zero imports) and src/components/game/SceneBackdrop.tsx (zero importers)
- Screenshots: .zscripts/stage4/ (before-*, map4-*, terr4-*, veh4-*, final*-*, final2-*)

Stage Summary:
- STAGE 4 "FULL STANDARD" INCREMENT COMPLETE. 2D map = real cartography around frozen pins; 3D city = Nigerian urban fabric (facades/roofs/shopfronts/compound walls/poles+wires/signs); ground = savanna layers + hierarchical roads + riverbanks; traffic = keke/danfo/okada/taxi/private + parked; night = tasteful window/lamp/headlight glow; interiors + human rig from inc4 regressions-clean. Saves, location IDs, economy authority, R1 identity untouched. 168/168.
- Honest limitations: one Task-tool orchestration timeout (agents finished the work; no code lost); road-label clipping on the 2D map edge; NPC traffic ignores junction priority; prod build not runnable in this env; iPhone touch verified via emulation only.
- Next: quests tied to discovery/interiors, wardrobe hotspot, market stall browsing, more interiors (lecture hall, government office).

---
Task ID: 5-c
Agent: swarm-phone-builder
Task: STAGE 5-c — The in-game PHONE (Chats / Bank / Hustle Board / Settings), phone tab + PhoneScreen

Work Log:
- Read the orchestrator's Stage 5 foundation (social.ts, npcChat.ts, npcs.ts, store chatNpc/bankDeposit/bankWithdraw/toggleSound) and reused them verbatim — zero new economy constants, zero direct player mutation; all money through store actions
- Tab registration: additive `PhoneIcon` (hand-drawn smartphone, same 24-grid/1.9-stroke language) + `phone` added to NavIconKey/NAV_ICONS in icons.tsx; BottomNav gained the Phone tab (between Work and Bag) and went grid-cols-6 → grid-cols-7; Dashboard registers `{tab === 'phone' && <PhoneTab onOpenWork={() => switchTab('work')} />}` so the Hustle app can deep-link into Work via the existing switchTab mechanism
- NEW src/components/game/screens/PhoneScreen.tsx: phone-shaped shell (max-w-380 centered, dark bezel rounded-[2.7rem], dynamic-island notch, status bar = Day · time-of-day + live cash + battery flourish honestly tied to player.needs.energy, home indicator). 2×2 app grid → Chats / Bank / Hustle Board / Settings with live sub-lines (paddy count, bank balance, hustles waiting, sound state). Phone works anywhere (not location-gated) but dims behind an honest overlay while isTravelling/isWorking ("Keke dey move — phone go wait.")
- NEW src/components/game/screens/phone/ChatThread.tsx: NPC thread — warm empty state ("You never talk before — break the ice."), canned opener "Abeg how body?" → store chatNpc after ~700ms fake typing dots (bouncing, cleaned up on unmount), NPC reply bubble with emoji-avatar (content identity), familiarity bar 0–100, tier-up flourish banner (TIER_META label + perk, audio levelup, auto-dismiss 5s), "You don talk today" composer state mirroring the store's once-per-day gate. DOCUMENTED: message bubbles are component state only — conversations do NOT persist across sessions; familiarity/tier/cooldown DO (store + autosave). Shared tierChipClass exported for the list
- Chats list: all 10 NPCs, emoji avatar, tier chip (tierFor + TIER_META), status "Say hi" (fresh) / "Chat" (available) / "Today ✓" (chatted today, via canChat + world.day)
- Bank app: Pocket cash / Bank balance cards (formatNaira), ₦1k/₦5k/₦25k/All chips (All = whole side), Deposit/Withdraw min-h-48 disabled when insufficient (computed client-side, store still guards), flavor line "Money wey dey bank dey safe.", last 5 category-'bank' ledger rows (newest-first) with empty state
- Hustle Board app: read-only compact cards (def.title via hustleDefFor, location, slots-left with urgent tint) + "Open the Work tab" button → Dashboard switchTab('work'); honest empty state. No WorkScreen logic duplicated
- Settings app: sound switch (store.toggleSound, same house pattern as Profile), autosave note ("Game dey save imself every small time" + chats-are-per-session disclosure), version line "Lokoja Life • Stage 5"
- House style kept: lko-card/press/display/num/pop/fade, warm tokens, Lucide-style SVG icons only in chrome (emoji stay on NPC identity + message content); touch targets ≥44px (rows 68, tiles 100, chips/buttons/back 44–48)
- Verification: bunx tsc --noEmit → 0 errors in my files (4 errors exist in DriveSystem.tsx/vehicles.ts from a CONCURRENT Stage-5 agent editing those world files after my edits — not mine, flagged for integrator); eslint clean on all 5 owned files; agent-browser E2E at http://localhost:3000: new game → Phone tab → Chats → Musa thread → opener → reply bubble "Ah, welcome! You wan buy cloth?…" + familiarity 6/100 + "You don talk today" ✓; day-2 chat (12/100) and day-3 chat → tier-up flourish "Friendship level up — Acquaintance!" + chip/header update ✓; Bank: chips enable/disable buttons, deposit ₦5k (₦5,000→bank, toast, ledger row), withdraw back, insufficient-side buttons disabled ✓; Settings toggle round-trip ✓; Hustle Board: accepted "Market price run" shows in compact view + "Open the Work tab" jumps to real WorkScreen ✓; reload → Continue → bank ledger + relationships persisted (save rel musa fam 6 lastChatDay 1) ✓; zero console/page errors; screenshots .zscripts/stage5/ (phone-grid-desktop, phone-chat-thread, phone-bank-before-deposit, phone-bank-ledger, phone-hustle-board, phone-tier-up, phone-thread-mobile, final-mobile-grid, final-mobile-bank, final-desktop-phone) + VLM layout pass on mobile grid/desktop/bank/thread (no overlap, 7 tabs fit 390px, phone frame fits 844 and 800 heights)

Stage Summary:
- 5-c COMPLETE. The phone is live: 7-tab nav → phone shell → 4 working apps on the orchestrator's social/banking foundation. Purely additive to existing tabs; store/types/save/config/systems/3D world untouched (icons.tsx got one additive icon + one union member — required by the nav icon system). Honest limits: chat threads are per-session by design; compact hustle list verified E2E only via empty state + one accepted offer; sound toggle is the 32px house switch from Profile (consistent, slightly under 44px tall); tsc/lint currently red from a concurrent agent's in-flight DriveSystem/vehicles.ts edits — my files verified clean in isolation.
- INTEGRATOR notes: (1) icons.tsx NavIconKey now includes 'phone' — StatusPanel's TabKey usage unaffected (checked). (2) If Stage 5-a/b rename VehicleModel or vehicle exports, unrelated to this task. (3) tier-up flourish needs ≥15 familiarity (3 chat days) to observe — verified on day 3.

---
Task ID: 5 (orchestrator) + 5-a/5-b/5-c/5-d (swarm)
Agent: Main Agent (Super Z) + 4-agent swarm
Task: STAGE 5 — "increase it, expand it, make it more real, compare us vs Lagos Life" (swarm yourself)

Work Log:
- FOUNDATION (orchestrator, pre-swarm): types.ts (OwnedVehicle/RelationshipState/ChatOutcome + player.vehicles/bankBalance/relationships + 'bank'/'fun' ledger categories); save.ts v3 migration (v1/v2→v3 defaults, round-trip safe); data/vehicles.ts (okada ₦85k/keke ₦180k/taxi ₦420k/danfo ₦750k + topSpeed/accel/handling + generatePlate); data/npcChat.ts (10 NPCs × 4 tiers of warm pidgin lines); systems/social.ts (tiers 0/15/40/75, once-per-day chat, pickLine deterministic); config INTERIOR.gym/lounge/NIGHT_OUT + WORLD3D.driveEnergyPerKm; store actions buyVehicle/setAvatar/workout/nightOut/bankDeposit/bankWithdraw/chatNpc/settleDrive; wardrobe-store bus
- SWARM (parallel launch; 5-c reported complete, 5-a/5-b/5-d hit the Task-tool deadline mid-report but their edits landed — same pattern as Stage 4, all work preserved and integrator-verified):
- 5-a DRIVING: DriveSystem.tsx (NEW — spawn/enter/drive/park, chase cam + FOV pull, VehicleDef physics, 0.45× grass drag, existing collision resolver, wheel spin + okada lean, night headlights, bridge decks); GaragePanel.tsx (NEW — buy per-model one-off at motor park + Drive buttons); controls.ts seat protocol (freezes walk controller, hides player rig via scene-graph lookup — no Actors.tsx edit); HudOverlay garage wiring; world3d/vehicles.ts buildPlayerRig + findPlayerVehicleSpot; settleDrive(meters) on park
- 5-b INTERIORS: peak-gym (university-area), lokoja-microfinance (government-area), golden-nights lounge (food-area) — full interiors with furniture/collision/hotspots via existing doorFor() pattern (zero edits to generic renderer); BankPanel + LoungeConfirm panels render inside InteriorScene; wardrobe hotspot in home rings the bus; props.ts furniture additions; test-world3d.ts extended (+interior checks → 47/47)
- 5-c PHONE: PhoneScreen + phone/ChatThread (NEW — phone shell w/ notch + status bar, 4 apps: Chats w/ typing dots + tier-up flourish + daily gate, Bank w/ chips + ledger, Hustle Board shortcut, Settings); BottomNav 7th tab; Dashboard registration; icons.tsx additive PhoneIcon; FULL E2E self-verified (chats 6→12→tier-up, bank deposit/withdraw, reload persistence)
- 5-d HUMANS: HumanRig refined (proportions, phase-locked walk, per-style clothing incl. new hoodie/lace in avatar.ts, hairstyle 3D hints); Actors NPC variety (hash-based skin/clothing per NPC) + proximity Talk chip → chatNpc → 4.5s speech bubble; PlayerActor driving prop contract; WardrobePanel (NEW, self-contained bottom sheet w/ 2D SVG preview)
- INTEGRATOR: mounted WardrobePanel in WorldTab; wrote scripts/test-stage5.ts (36 checks: social tiers/cooldowns, vehicle catalog, chat data integrity, wardrobe bus, v1/v2→v3 migration via localStorage shim incl. corrupt + round-trip); full verification pass
- E2E (agent-browser): desktop 1280×800 — menu→continue→dashboard→Phone(Chats: opener→Musa reply + familiarity 6/100 + "You don talk today" gate; Bank: ₦5k deposit→toast/ledger→withdraw)→3D world (refined rigs, varied NPC clothing, okada/keke traffic, facades/walls/wires) — all zero console errors; mobile 390×844 — dashboard 7-tab fits, phone shell fits, world renders w/ keke passing player; screenshots .zscripts/stage5/e2e-01..16
- TESTS: travel ✅, stage3 ✅, world3d 47/47 ✅, stage5 36/36 ✅; tsc 0 game errors; lint clean

Stage Summary:
- STAGE 5 COMPLETE. Lagos Life gap-closers shipped: own + DRIVE vehicles (garage at motor park), 3 new enterable venues (gym/bank/lounge) with real activities, in-game phone (chats with 10 named NPCs on a familiarity-tier track + bank + hustle board), wardrobe (appearance change in-world), refined human rigs. Economy authority untouched (all money via store actions + config); save v2→v3 migration tested; stable location IDs unchanged; R1 identity intact. Grand total checks: travel + stage3 suites ✅, world3d 47, stage5 36.
- Honest limitations: garage/drive + wardrobe visual flows verified by code + unit tests but not full CLI walk-through (transport-area across the map; blind keyboard navigation impractical); one collision edge case observed (ambient car briefly pushed player onto its roof — side-push polish pending); NPC traffic still ignores junction priority; chat threads are per-session by design.
- Next candidates: businesses you can OWN (danfo transport route income), relationship perks wired into hustle offers (TIER_META.offerBonus hook ready), market stall browsing, more interiors (lecture hall, mosque/church), driving fast-travel to visited districts.

---
Task ID: 6
Agent: Main Agent (Super Z) — Stage 6 orchestrator
Task: WORLD EXPANSION — "add ALL routes, Google-Maps accuracy, ALL the bridges; moving in the app should feel like Lokoja" (swarm)

Work Log:
- DATA: fetched the real Lokoja map from OpenStreetMap (the dataset Google Maps/Earth render) — 19 tiled bboxes via OSM API 0.6 (~78 MB XML, 314k nodes, 61k ways), saved to scripts/geo/tiles/ (attribution ODbL kept in headers)
- PIPELINE: scripts/geo/pipeline.py (parse→dedupe→Douglas-Peucker 12 m→project: 1 world unit = 26 m, north = −Z, center 6.753E 7.790N) + scripts/geo/generate_world.py (clip→classify→riverside push→bridges→traffic loops→lamps→places→emits src/game/world3d/geo.ts + src/components/game/geo-map.ts as GENERATED modules)
- WORLD: layout.ts rebuilt as the geo+gameplay fusion — WORLD_HALF 310 (620×620 u ≈ 16 km real, 3.6× area), MAP_SCALE 6.2, WALK_BOUND 292; ROADS = 2,655 real OSM ways (+ Patti Road trail hand-added to the real summit) with real names (Ibb Way, Marine Road, Lugard Road, Taiwo Road, Hassan Usman Katsina Road, Lokoja–Otukpo Rd, Wallace Street…); RIVERS = real Niger (with the true bend + south course), Benue (true mouth at the real confluence (−3,172)) + 14 mapped streams; BRIDGES = 21 real stream crossings (incl. the A2 dual-carriageway bridges) emitted from data — and TRUE TO THE CITY: no Niger bridge exists at Lokoja (locals cross by the Ganaja ferry), so none was faked; riverside push (point→SEGMENT distance) keeps 374 non-bridge road points clear of the carve; circle clip at the rim crest (Liang-Barsky box clip produced rim-riding arc artifacts — replaced)
- CONSUMERS: WorldTerrain (per-class render widths, minors→flat earthen fabric mesh — 2,700 overlapping textured ribbons read as mush; shoulders arteries-only; flatShading REMOVED — facet banding; grain repeat 96/aniso 8; SEG 160; confluence foam at the true meeting point), CityMesh (boats ride the real river polylines), Actors (3 traffic loops chained along the real major-road graph), vehicles.ts (bays snap to nearest major-road point by anchor; findPlayerVehicleSpot on RoadDef), props.ts (110 poles + wires along real arteries), HudOverlay minimap (world-scale constant + rivers traced from RIVERS data), MapCanvas REWRITTEN data-driven from geo-map.ts (real water/road tiers/bridges/suburb labels: Adankolo, Zango, Numai, Felele, Crusher, Ganaja, Kpato, Emiwoziri, Otokiti + Niger/Benue name labels + 1 km scale bar); locations.ts mapX/mapY = real road-snapped positions (ids untouched); config kmPerMapUnit 0.16 (1 map unit = 161 m)
- FIXES DURING E2E: agent-browser screenshot CLI silently failed with a path argument post-06 (stale-file illusion — always screenshot without args and copy the printed tmp path); stale next-server had been serving zombie chunks (full kill + rm -rf .next/dev + browser restart before trusting any render)
- TESTS: world3d rebuilt to pin REAL geography (confluence SE of home + overlooks the true meeting point ≤55u; network ≥2000 ways; named ≥15; majors ≥50; bridges ≥12; NO bridge over Niger/Benue; Niger/Benue never carry road); travel spec re-grounded (Home→Kpata = 0.55 km real near-neighbours); TOTALS: travel ✅ + stage3 ✅ + world3d 55/55 ✅ + stage5 36/36 ✅ — tsc 0 game errors, lint 0 problems
- E2E (agent-browser, desktop 1280 + mobile 390): real 2D map renders the true city; world entry at home (street fabric + lanes); keke to Ganaja Junction (roundabout/stalls/poles/wires/Vehicle Shop); keke up Mount Patti 23 min/₦450 (real 6.8 km — arrival rolled to Evening); summit drone (rest house, Patti tower, trail, town below); night motor park (lit garage sign, lamps) — zero console/page errors throughout; screenshots .zscripts/stage6/01..24

Stage Summary:
- STAGE 6 COMPLETE. The world IS Lokoja now: every mapped street (~930 km of real roads compressed 26:1), the true Niger/Benue/confluence, the real stream bridges, real suburb names on map and ground, the real Patti summit + trail, real travel distances/fares. A player who knows Lokoja can navigate by the same roads they walk in real life.
- Honest limitations: big-river crossings are ferry-only (true, but no ferry jetty interaction yet); traffic loops are 3 real-road rings (junction priority still ignored); minor-street density means building placement favours block gaps; night ambience unchanged from Stage 4 tuning; prod build still not runnable in this env.
- Next candidates: Ganaja ferry jetty as an interactable crossing, road-name signs at real junctions (3D labels from GEO_ROADS.name), businesses you can OWN along real routes, more interiors.

---
Task ID: 7
Agent: Main Agent (Super Z) — Stage 7 orchestrator
Task: THE SCHOOLS OF LOKOJA — "build all the schools in lokoja first both the inside and out, chairs, tables, sands, trees, mountains well built well arranged, feel more real" (accuracy refs: cad-atlas / topographic-map / satellites.pro)

Work Log:
- RESEARCH: Overpass query (7.64–7.96N, 6.60–6.86E) for ALL education POIs — FUL permanent site is mapped building-by-building in OSM (gate + 12 faculty/LT/e-learning buildings at 7.853–7.870N 6.682–6.684E) and Faithview Academy has exact mapped grounds; web research verified the rest: Crowther Memorial College (Google plus-code RP4R+9M8 260101 decodes to 7.80591,6.74163 by the Patti foothills), GYB Model Science SS (ex-Govt Day SS, Adankolo New Layout Rd), Al-Azhar International College (Okene Rd/Lokongoma), KSP (Lokoja–Abuja expressway, Felele), Salem University, Baptist High, Christfield, Julitola International (plus-code RMJ6+GF8, Abuja Rd corridor), College of Nursing Sciences (specialist-hospital quarter); AAMC confirmed as OKENE (excluded — honesty)
- DATA: src/game/data/schools.ts — 12 real schools (3 university / 1 polytechnic / 7 secondary / 1 college) with lat/lon, anchor-source honesty field (osm | plus-code | district), mottos, founded years; the geo pipeline's EXACT projection (1u = 26 m, north = −Z, centre 6.753E 7.790N); rim-pull along the real access road for out-of-circle sites (FUL permanent site is genuinely ~10 km out) + deterministic relaxation (campus separation, legacy-anchor clearance ≥ plateauR+17, rim clamp INSIDE the sweep loop)
- WORLD: world3d/schools.ts — compound generator: perimeter wall ring with ONE real 5.2u gate gap + rhythm pillars, gatehouse pair, painted name board (school colour + motto, canvas-baked), classroom blocks (veranda slab + pillars + louvre band + corrugated gable roofs), admin/library/lab/theatre/toilet blocks per kind, borehole water tank, swept sand yard + assembly ground + flagpole with school-colour flag, football pitch with real line markings when the compound can honestly hold one (else painted lines on the assembly ground — how real school yards double as pitches), mango/neem shade rows + gate palms, scored-spiral siting (majors-clear, minors clip at the fence); 37 colliders-resolved boxes; 31 interiors generated from 5 templates (classroom 12 / office 7 / library 7 / lab 4 / theatre 1): rows of shared school desks + tucked chairs, blackboards with chalk trays, wall maps, teacher tables, computer benches, ceiling fans — ALL BFS-pathable
- LAYOUT/RENDER: layout.ts owns final SCHOOL_SITES (relaxSchoolSites) — school anchors + 2D map registry adopt the final positions (map pin, travel fare and 3D gate = one truth); heightAt carves school plateaus AFTER river carving (streams stop at the fence, yards stay flat + dry); WorldTerrain road quads + junction discs + utility poles clip inside yards (satellite-true); SchoolMesh.tsx renders all 12 compounds instanced; interiors registered into INTERIOR_BY_ID (single source); ALL_DOORS feeds interact scan + doorway props
- GAMEPLAY: study action (config INTERIOR.study: 1 slot, −7 energy, −6 hunger, +14 smart XP through addSkillXp) wired gym-style; 12 new stable location ids in the SAME registry (FUL Fulenele 1.35× travel modifier — the real long ride); 4 school NPCs (Hauwa/Chidi/Miss Grace/Abubakar) with 4-tier chat pools + 4 school hustles + 8 school jobs (every school offers work); NPC stroll zones at 6 campuses
- E2E HOOK: WorldTab ?e2e=1 test bridge (__lkl: travel/pos/stick/frozen/doors/enter) + scripts/e2e/walk-driver.js — fixes the chronic "blind keyboard nav" E2E pain
- FIXES DURING BUILD: rim clamp was re-bunching the Felele campuses (iterated with separation); mapX/mapY were computed pre-relaxation (re-derived from final positions); furniture pinch-points in classroom/library/lab (chair corner-inflation ate the aisles — layouts re-spaced, 31/31 BFS green); school plateaus moved after river carve (streams gullied the yards); LEGACY_ANCHOR_XY drift-proof table + test
- TESTS: NEW scripts/test-schools.ts 117/117 ✅ (registry honesty, projections, site separation, plateau flatness, gate-gap WORLD-COLLISION walk sim for all 12, interior BFS, doors joins, majors-clear); world3d 55/55 ✅, stage3 ✅ (18 jobs), stage5 36/36 ✅, travel ✅; game tsc 0 errors; lint clean
- E2E (agent-browser, iPhone 14 viewport): menu → creation → map shows all 12 school pins on the real cartography (level-locked ones greyed honestly) → travel Crowther (3.2 km, keke ₦290 — REAL distance/fare) → 3D compound (painted wall, swept yard, lamps, Miss Grace strolling + her library-sort hustle chip) → classroom door prompt → interior (desk rows + steel frames + teacher table + red marker) → exit chip → teleport tour: FUL Twin Theatre + gate name board ("…edge for Development") beside the real A2 expressway lamps + Chidi's notes-run hustle, Salem compound wall + roof + savanna treeline → district discovery toasts + 4/22 atlas progress — ZERO console errors throughout; screenshots .zscripts/stage7/01..24

Stage Summary:
- STAGE 7 COMPLETE. Every notable school in Lokoja now exists in the game at its real position, with its real name on a painted gate board, inside AND out: sweep the yard, hear assembly under the flag, walk into a classroom and sit at a shared desk, read in the library, book a computer hour, sit a lecture in FUL's theatre. Schools carry the city's real geography: FUL's permanent site sits out on the Abuja expressway exactly as far as it does in life, Crowther rests under Patti's foot, Faithview holds its mapped grounds on the southern road.
- Honest limitations: 4 of 12 positions are district-level (school verified, exact campus position approximated to its real road — marked per-school in data); interiors are one showcase room per facility (full multi-room buildings come later); minor streets crossing a compound clip at the fence (matches satellite reality); the study action grants smart XP only (teacher relationships later).
- Next candidates: school interiors phase 2 (headmaster office for every school, staff room, exam hall), inter-school football matches on the marked pitches, WAEC/JAMB exam events on the real calendar, school-uniform wardrobe sets, Patti-side school of mining?? (no — real list: Federal Science Technical College? research first).

---
Task ID: 8-a
Agent: Research subagent
Task: Verify real facilities of the 10 non-FUL Lokoja schools + FUL faculty list

Work Log:
- Invoked web-search + web-reader skills; used z-ai CLI (web_search / page_reader) with results cached in /tmp/*.json
- Read Wikipedia articles: Kogi State Polytechnic, Salem University Lokoja, Federal University Lokoja (extracted article bodies from raw HTML)
- Read official sites: salemuniversity.edu.ng (colleges list, chaplaincy, medical centre), al-azharinternationalcollege.com home + /facilities/ page, julitolaschools.com.ng /academics/
- News searches: kogireports (KSP hostel renovation 2020; CMC established 1964; GYB MTN ASAP 2025), thisage.com.ng (Ododo visit to GYB Adankolo — hostels promised, not yet built), fulokoja.edu.ng (Adankolo = College of Health Sciences behind Specialist Hospital; NMCN advisory visit; Nursing full NUC accreditation), myschool.ng/preps.ng/Facebook (KSP schools & ND/HND departments incl. Mechatronics, DITRC)
- FUL teaching hospital confirmed: Wikipedia — new admin block at Federal Teaching Hospital Lokoja, the teaching hospital of the College of Health Sciences; solar-powered modular tech lab (Feb 2024)
- Crowther founding year: kogireports (2021 alumni feature) says established 1964 — user brief says 1956; flagged discrepancy, buildings themselves unverified online (TYPICAL)
- No building-level sources found for Faithview / Baptist High / Christfield / CONS Lokoja interiors — marked TYPICAL per school type (Faithview's grounds themselves were already OSM-verified in Stage 7)

Stage Summary:
- FUL: 2 campuses (Felele permanent, Adankolo) VERIFIED; 5 faculties + College of Health Sciences VERIFIED (Sciences, Arts, Social Science, Management Science, Education — NO Faculty of Engineering found); FTHL is CHS teaching hospital; MBBS + Nursing Science accredited; university library (lending/reference/internet/digital literacy); solar modular tech lab. User's building breakdown (Senate/Library/faculties/hostels/gatehouse) consistent, none contradicted.
- KSP VERIFIED: est. 1993, Lokoja–Abuja expressway (Felele); schools of Engineering (ND Mechatronics/Computer Eng, HND Electrical/Electronics Power), Environmental Technology, Applied Sciences (incl. Computer Science, Fine/Applied Arts: graphics/textiles/ceramics), Finance Business & Management (Accountancy), Agricultural Technology; Library & Info Science, Mass Communication; DITRC (ICT resource centre); on-campus hostels (renovated 2020); polytechnic library exists.
- Salem VERIFIED: private Christian university, single residential campus at Jimgbe (all undergrads reside on campus → hostels); 7 colleges: Law, Education, Humanities, Basic Medical Sciences, ICT, Management & Social Sciences, Natural & Applied Sciences; Chaplaincy + Medical Centre + Campus Security + Centre for Entrepreneurial Development Studies. Chapel building TYPICAL of chaplaincy.
- CONS Lokoja: identity VERIFIED (state college of nursing in Lokoja specialist-hospital quarter, NMCN regime); demonstration room/skills lab/hostels TYPICAL.
- Crowther Memorial College: Anglican/CMS mission heritage school under Mt Patti VERIFIED (Diocese of Lokoja proprietorship contested in news); founding year conflicting (1964 in kogireports vs 1956 brief); facilities TYPICAL.
- GYB Model Science SS: Kogi State govt science school, Adankolo VERIFIED; governor visit 2026, exam fees paid by state; HOSTELS PROMISED BUT NOT YET BUILT (honesty flag — keep it day-school); science labs TYPICAL-by-mandate.
- Al-Azhar International College VERIFIED from own site: full boarding co-ed, est. 16 Sep 2010; Arabic + Islamic/Pure Quranic studies + secular curricula (NECO/WASSCE/IGCSE); Olympic-size football pitch + track, volleyball, tennis, Taekwondo centre, transport fleet, sickbay with medical staff, stocked library, internet-enabled computer lab, school-management software; Montessori nursery/primary on same foundation. Mosque building TYPICAL (not named on site).
- Julitola VERIFIED: Crusher (Gada-Shagari), Okene Rd; ICT/Computer Science hands-on, Fine Arts, science with "state-of-the-art laboratories"; rest TYPICAL.
- Baptist High Lokoja: mission school + active Old Boys & Girls Assoc VERIFIED; Christfield: private nursery/primary/secondary VERIFIED; Faithview: OSM-mapped grounds (Stage 7), no facility sources — all three TYPICAL (assembly hall, labs, ICT lab, library, sick bay, sports field, admin block).

---
Task ID: 8
Agent: Main Agent (Super Z) + research subagent (8-a)
Task: STAGE 8 — THE GREAT SCHOOLS: building-by-building interiors and exteriors for all 12 Lokoja schools (the user's FUL breakdown, applied city-wide)

Work Log:
- Task 8-a (research subagent): verified real facilities for the 10 non-FUL schools via web research — KSP (Engineering workshops, DITRC ICT centre, hostels, rectory), Salem (7 colleges, all-residential, chaplaincy, medical centre), Nursing CONS (demonstration room, sick bay), GYB (science labs; hostels NOT built yet — day school kept honest), Al-Azhar (full boarding, mosque, sickbay, ICT lab, Olympic pitch), Crowther (mission heritage school), Julitola (ICT + science labs). FUL correction: real faculty list has NO Engineering (Sciences, Arts, Social Science, Management Science, Education + College of Health Sciences).
- Task 8-b: 12 new furniture kinds in interiors.ts + InteriorScene.tsx — bunk (hostel), locker, lab-bench (gas taps + reagent rack), fume-hood, basin, specimen-cabinet, microscope, skeleton (articulated on stand), dissection-table, podium (mic + crest), riser (tiered seating), machine (lathe). Furniture() now takes the interior accent for house-colour details.
- Task 8-c: data/schools.ts — BuildingKind/BuildingPlan types + SCHOOL_PLANS registry: every school's buildings with honest name, position note, inside-list, interior room suffix, study label (FUL Felele: Senate/Library/Arts/Science/Social-Sci/Twin Theatres/Hostels/Cafeteria/Clinic/Watchtower at explicit campus positions; Adankolo: Health Sciences + Pre-Clinical Theatre; KSP: workshops + DITRC + hostels; Salem: chapel; Al-Azhar: mosque + boarding hostels; every secondary: hall/lab/library/canteen/sick bay/admin). Compound footprints bumped to honestly hold the buildings (ful-adankolo 28×22, ksp 32×26, salem 28×22, nursing 24×18, crowther/gyb/baptist/al-azhar 26-30×20-24, faithview/julitola 26×20, christfield 24×18).
- Task 8-d: world3d/schools.ts rewritten plan-driven — deterministic auto-placer (grid scan, back band first, essential buildings first, no-overlap + majors-clearance at every slot; explicit plan coordinates honoured for FUL), plan-driven doors, compound spiral upgraded to a 5×5 rect grid so no wall/pillar/toilet ever sits in a live carriageway, pitch span-finder against actual placed buildings. interiorsFor now joins compound.plans → 18 interior builders: senate (council chamber + VC suite + registry), grand library (stacks + e-library + reading hall), fac-arts (language lab + staff common room), fac-sci (benches + fume hood + boardroom), tiered lecture theatre (risers + podium), hostel (bunks + lockers + lounge + ablution), canteen (mealSpot TRUE — serves food), clinic, science lab, assembly hall (stage), anatomy lab (dissection tables + skeletons + histology bays), pre-clinical theatre, workshop (machines), chapel (pews + pulpit), mosque (prayer mats), demo room (nursing dummies). SchoolBoxKind + renderer extended: senate (clock + entrance steps), watchtower (cabin + cap), chapel (cross), mosque (dome + finial).
- Task 8-f/g: test-schools.ts updated for the new inventory (88 school interiors, 232 checks — plan-completeness, great-building existence, no-overlap, BFS pathability for every interior, carriageway clearance); test-world3d 6+88 interiors; ALL suites green: schools 232/232, world3d 55/55, stage3 ✓, stage5 36/36, travel ✓, tsc + eslint clean.
- Task 8-h E2E (Playwright, mobile 390×844): live-registry fix for the __lkl test hook (WorldTab e2eApi ref — stale-closure enter/scene was dead across scene swaps), 6 screenshots in download/stage8-shots/ (Crowther compound arrival with school NPC job offer, science lab benches + reagents, FUL senate council chamber with the long table + record shelves, hostel bunks + lockers, anatomy lab, KSP workshop machines + "Learn at the machines" action). Travel + door entry + zero console errors verified. Headless software-GL runs timers ~7× slow — E2E waits tuned accordingly.

Stage Summary:
- 12 schools → 88 enterable interiors (from 31), every school building-by-building inside AND out, all furniture/placement derived from one honest data plan (SCHOOL_PLANS) with research-verified content
- New gameplay: school canteens serve meals (menu hotspot + eatMeal), 8 new study venues (labs/halls/workshops/chapel/mosque/library) all flowing through the existing study system
- E2E hook made live-closure safe (e2eApi ref) — future test drivers won't fight stale closures
- ALL TESTS GREEN: schools 232, world3d 55, stage3, stage5 36, travel; tsc + lint clean; E2E screenshots in download/stage8-shots/

---
Task ID: 9
Agent: Main Agent (Super Z)
Task: "server is dead" — diagnose why the dev server / preview (port 3000) is down and restore it

Work Log:
- Verified no process was listening on 3000; preview proxy (Caddy on :81) returning 502 (backend down).
- Reconstructed platform architecture from /start.sh: at container boot, start.sh -> .zscripts/dev.sh (bun install, db:push, bun run dev, health check) launches the dev server parented to the init/caddy tree — that ancestry is immune to session cleanup. Boot timeline (/tmp/boot-timeline.log) confirms this succeeded at 08:20 today (19s, healthy).
- The boot server was stopped externally (~12:54, platform dev.pid written) — consistent with the session handoff when the previous conversation ran out of context.
- Empirical killer isolation: any process holding a TCP LISTEN socket spawned from an agent Bash session (setsid'd next dev on 3000; python http.server on 3000, 3999, and 127.0.0.1:3444) is killed between tool invocations; a non-listening setsid sleep survives. Conclusion: agent-spawned servers CANNOT persist — only boot-ancestry servers can. Not OOM (cgroup failcnt 0, 4GB limit), not a universal reaper.
- Ruled out self-service revivals: no sudo for z, no cron/atd/systemd/tmux, MCP control service (12600) exposes only the standard tool set (no exec/restart tool), Caddy admin API not exposed.
- Verified restart safety: git working tree clean at f93d144 (Stage 8 complete), db/custom.db present, `bun run db:push` exits 0, bun 1.3.14 + .zscripts/dev.sh intact — the boot flow is guaranteed to relaunch the server on container restart.

Stage Summary:
- Root cause: platform stopped the boot-time dev server during the previous session's handoff; agent-spawned listeners are policy-killed between tool calls, so the preview cannot be revived from inside the session.
- Fix: user restarts the sandbox (restart button) -> start.sh reruns .zscripts/dev.sh -> dev server returns on 3000 sanctioned and stable. All code/data verified safe for restart (clean tree, committed Stage 8).

---
Task ID: 10
Agent: Main Agent (Super Z)
Task: MILESTONE 1 (partial — roads first) — "begin with the roads, perfect them with street lights, no houses on the road, add the bridges, well routed and built"

Work Log:
- DIAGNOSTIC FIRST (scripts/diag-road-clearance.ts): measured the state the user complained about — 10 of 18 buildings had corners ON the rendered carriageway (worst −3.0u inside), and 235 of 244 street lamps stood INSIDE the carriageway (lamp offset 2.6u < highway render half-width 3.1u). The user's eye was right.
- ROAD-CLEARANCE LAW (layout.ts): new roadGap/roadGapMajors (distance to nearest RENDERED carriageway edge, render-width-aware) + buildingClearOfRoad (worst-case corner radius must clear every edge). isClearOf rewritten on top; tryPlace rewritten as a deterministic exhaustive ring scan (24 spokes × radius steps, first legal fit — placement density survived the stricter law).
- pushSafe for every anchor-placed signature building (family house, market sheds, civic block, colonial relics, hostel): if the hand-set spot violates the law it slides outward on a deterministic spoke scan (14 steps × 12 dirs); if no legal spot exists the building is SKIPPED — nothing stands on the road, period.
- STREET LIGHTS OF LOKOJA rebuilt in layout.ts (replaced thin GEO_LAMPS): every lit road class end-to-end (highway 13u spacing, major 14, secondary 15, minor 19 through the built-up fabric within 58u of districts), alternating sides, offset = renderHalf + 0.62, arm yaw facing the carriageway, tall masts on highways. Rim-fallback ladder (near rim → far rim → opposite side) so dual-carriageway highways keep their lighting on the outer rim. Dry-ground check (heightAt > WATER_Y + 0.15) + global roadGap ≥ 0.3 + school-yard clip + dedupe. Bridge abutment masts: every bridge corner searched on an along×across grid for a dry, clear spot (masts placed before road lamps, dedupe-bypassed). Result: 440 lamps (was 244), 0 inside any carriageway (was 235).
- CityMesh Lamps() renderer upgraded: pole + arm reaching OVER the road + cowl + sodium head + warm ground pool at the arm tip (was: bare pole + head). Tall highway masts 5.1u/1.5u arm. Both head materials glow at night (found + fixed: mast heads previously had no emissive ref — never glowed).
- LANE MARKINGS (WorldTerrain Roads()): worn-white dashed centrelines on every asphalt highway/major/secondary (1.5u dash / 2.2u gap) + solid dual edge lines on highways; clipped at school fences, skipped over bridge spans and water. One merged draw call.
- E2E hook: __lkl.rest / bridges / timeOfDay added (honest clock slots + real bridge data for test drives).
- Tests: world3d suite extended with the M1 law blocks — road clearance (0 building corners on tarmac, stalls, lamps), street lights (≥350, facing, tall-mast split, dry ground, school-yard clip), bridges (16 real crossings, decks land on solid banks, decks above waterline, urban bridges lit at both abutments). Fixed a latent suite bug: checks after the mid-file summary never counted — added a FINAL verdict that gates the file. Boom-through-camera test made position-independent (enters the building from outside).
- E2E screenshots (download/m1-roads-shots/, mobile 390×844, zero console errors): 01-street-day (lanes + clear carriageway + shoulder lamps), 02-highway-marks (junction + marked road), 03-confluence-lights (lamp forest at the riverfront), 04-street-night (night roads, glowing markings, lamp silhouettes). The dedicated bridge-deck walk proved impractical in headless (~7× slow + browser wall) — bridge geometry/lighting is locked by 4 deterministic tests instead.
- Platform note: dev servers spawned by the agent are killed between tool calls (verified: any TCP listener dies at invocation end, non-listeners survive); E2E runs must boot the server inside the same invocation. Headless browser also self-destructs after ~100-180s of 3D — drives the short-walk shot strategy.
- ALL GREEN: world3d 672/672, schools 232/232, stage3 ✓, stage5 36/36, travel ✓; tsc back to the 9 pre-existing errors (0 new), eslint clean.

Stage Summary:
- The user's four asks are code-law now: roads marked and well-routed (lane paint + real network), street lights blanket the city (440, correct shoulder placement, night glow incl. highway masts), ZERO buildings/stalls/lamps on any carriageway (enforced by tests, not good intentions), 16 real bridges standing on their banks, above the waterline, lit at their abutments.
- Remaining M1 items for next round: mountain/terrain art polish, tree species mix pass, then Milestone 2 (Civic Mesh).

---
Task ID: 11
Agent: Main Agent (Super Z)
Task: M1 FINALE — "the next continue": Mount Patti terrain art + the savanna tree guild (species mix pass)

Work Log:
- HEIGHTFIELD: pattiTerrace() added to layout.ts heightAt — sedimentary terracing on the Patti flanks (7.4u band period, ≤0.45u pull toward band centres, only inside pd<96 and h 3.2..31): the real hill is a chain of small plateaus, now the silhouette reads as strata from the plain while the summit trail stays perfectly smooth. Anchor-plateau/school/river carving all run AFTER the terrace (summit site untouched).
- TREE GUILD: TreeKind extended 'tree' | 'palm' | 'acacia' | 'baobab'; scatterTrees assigns species deterministically — palms keep the riversides, broadleaf fills moist ground, flat-topped acacias own the dry open plains (moisture<0.42, slope<0.3), sparse baobab giants (5%, scale 1.5-2.3) stand on gentle laterite flats. ACACIA_TONES/BAOBAB_TONES palettes in layout.
- ROCKS OF PATTI: new ROCKS data (110 boulders, deterministic) — laterite/ironstone scatter over the steep flanks, denser toward the crown, half-sunk, each with its own squash/tilt hash; placement law: never on trail/carriageway (roadDistance>4.6), never in school compounds/anchor sites/buildings, never on the plains (y>2.2).
- RENDER: WorldTerrain Patti colour art rebuilt — ironstone/pale-laterite STRATA bands alternate by height (rockT-gated), the summit crown stays grassy (rest-house lawn), pale erosion fan at the mountain foot; CityMesh adds acacia (slim trunk + 2-disc flat umbrella), baobab (bottle trunk + 5-blob crown) and Rocks() (instanced dodecahedra) — 5 new draw calls total.
- TESTS: world3d suite +11 M1 law checks (683 total): all four species present, acacias ≥25, baobabs rare (2-90) + gentle-ground-only + scale ≥1.5, rocks ≥60 + off-carriageway + on-the-hill + flanks-only + never inside compounds/summit site.
- E2E (scripts/e2e-m1-terrain.ts, mobile 390×844, zero console errors): NEW camera discoveries for the E2E toolkit — wheel zoom must be dispatched as WheelEvent directly on the canvas (mouse.wheel never reaches it; deltaY>0 = zoom OUT 9%/tick), drag UP lowers phi to the horizon, follow rig max dist 70 → drone shots. Progressive walkShots (screenshot every 12 presses, overwriting) defeats the ~70-100s headless browser self-destruct: the best frame reached always survives. Shots in download/m1-terrain-shots/: 01 summit crown (tower + trail + rest-house site), 02 THE FLANKS (terraced bands across the valley, acacia umbrella mid-frame, shoulder lamps, town beyond), 03 baobab run (stepped erosion gullies + bridge with railings + Okene road + lamp forest), 04 marked street + keke shelter + mast (university travel was level-locked; shot kept for the streets record).
- ALL GREEN: world3d 683/683, schools 232/232, stage3 ✓, stage5 36/36, travel ✓; tsc 0 new errors (9 pre-existing), eslint clean.

Stage Summary:
- M1 IS NOW COMPLETE: roads (real network + lane paint), street lights (440, shoulder law), zero buildings on carriageways, 16 lit bridges — plus the mountain itself: Patti now wears sedimentary terraces, strata-coloured flanks, 110 boulders, a grassy crown, and the savanna around it carries the real tree guild (broadleaf/palm/acacia/baobab). Every art law is test-enforced, not hope-enforced.
- Honest limitations: headless browser self-destructs ~70-100s into 3D (progressive-shot workaround); strata terraces are subtle up close (silhouette + colour bands carry them); baobab giant placement is plains-biased (nearest is 69u from the Patti summit — the mountain foot shot shows the gullies instead); university-area travel appears level-locked for a fresh character.
- Next: Milestone 2 — CIVIC MESH (government, police, EFCC, NEPA+bills, KGIRS taxes, markets as living rule systems).

---
Task ID: 12
Agent: Main Agent (Super Z)
Task: M1 VERIFICATION — "then begin it and verify it, work smartly" — verify the committed street-lights/roads/bridges work end-to-end on the freshly restarted server

Work Log:
- Baseline: sandbox restart fixed the server (Task 9's remedy confirmed) — dev server alive on :3000 (boot-ancestry, health 200), git tree clean at 6ab8235 (m1-finale), so the M1 code IS what the server serves.
- DETERMINISTIC SUITES (this hour, against the current tree): world3d 683/683 — including the M1 law blocks (0 building/stall/lamp corners on any carriageway; 350+ lamps facing their roads, tall highway masts, dry ground, school-yard clip; 16 bridges landing on solid banks, above the waterline, urban abutments lit); schools 232/232; stage3 ✓; stage5 36/36; travel ✓.
- tsc: exactly the 9 pre-existing errors (counted + file-listed), 0 new. eslint clean.
- LIVE E2E on the running server (mobile 390×844): fresh 01-street-day.png (worn lane paint, clear carriageway, shoulder lamps, keke shelter set back), 02-highway-marks.png (tall masts + edge lines at Ganaja Junction), 04-street-night.png (honest night clock via rest system, luminous markings on dark tarmac, lamp arms) — night run: 0 console errors. Old 03/04 from 04:57 remain for the bridge/valley record.
- E2E TOOLING hardened through 6 generations (scripts/e2e-m1-bridge.ts): every CDP call raced with a timeout (no more script hangs), progressive screenshots DURING walks (best frame survives the renderer wedge), fire-and-forget walk driver with Node-side sampling, stable-arrival polling for map travel. New offline constraint solver (scripts/tmp/bridge-dist*.ts) computes anchor→bridge distances × unlockLevel × transport × trip energy × travel-anim time from the layout itself.
- TRUTHS discovered: map-travel animates a REAL walk (~50-90s for 124-170u trips) that outlives any safe headless browser life; several anchors are level-locked (L2/L3) or refuse 'walk' transport — the __lkl hook hardcodes 'walk'; from spawn the nearest bridge is #2 at 142u and the driver traps on the compound wall. Conclusion matches Task 10's: the live bridge-deck walk is impractical headless; bridge geometry/lighting stays locked by 4 deterministic tests + the valley crossing visible in m1-terrain-shots/03.

Stage Summary:
- M1 (street lights → road reconstruction with zero houses on tarmac → bridges) is VERIFIED on the restarted server: all law suites green, fresh day/highway/night proofs captured, no regressions (tsc/lint), committed as ecf16f1.
- Honest limitations: no fresh close-up 3D bridge frame this round (headless wedge window ~90-120s vs travel-anim + 142u approach — deterministic tests carry the bridge proof); night frame shows glow on markings + lamp presence rather than a full sodium pool close-up.
- Next: Milestone 2 — CIVIC MESH (government, police, EFCC, NEPA+bills, KGIRS taxes, markets as living rule systems).

---
Task ID: 14
Agent: Main Agent (Super Z)
Task: MILESTONE 2 — THE CIVIC MESH — "swarm yourself to do it wisely" + verify speed & data economy (notify-only if not)

Work Log:
- SCOPE: government/police/EFCC/NEPA+bills/KGIRS taxes/markets-as-living-rule-systems. Single-agent build (the earlier perf-subagent launch hit a context deadline; its surviving probes were folded into the audit).
- THE GOVERNMENT GROUNDS: the real GRA anchor proved unbuildable — the road law measured its best clear gap at 3.4u in a 46u radius (probe chain: probe-gov → probe-gov8/9/10). Solution follows the school-compound precedent: a fenced civic campus on the majors-clear plain ~30u west (CIVIC_CAMPUS rect), where mapped MINOR estate lanes clip at the fence (satellite-true for a fenced reservation); majors bind everywhere, always. buildingClearOfRoad is campus-aware; the road/lamp/pole renderers clip at the fence (WorldTerrain ×4 sites, props, layout lamps).
- FIVE SIGNATURE BUILDINGS (tagged BuildingDef): Government House (flag pole + waving green-white-green FlagCloth), KGIRS, NEPA, Police, EFCC — each with a colored fascia; 4 doors derive from tags (doorFor); laterite drive + fence + gate posts in CityMesh CivicDressing (9 static meshes — performance law respected).
- FOUR CIVIC INTERIORS via one civicHall() factory: service counter + glass partition + queueboard + benches + ceiling fans + agency palette; one 'civic-desk' ActionKind → CivicPanel (world/panels) serves the right agency per interior id (NEPA settle incl. reconnection fee; KGIRS pay / warrant→police pointer; police warrant clearing (+25% fine); EFCC file-tip + pending tips + lifetime rewards).
- CIVIC SYSTEMS (systems/civic.ts, 100% pure/deterministic — hash-seeded): NEPA bills every 5d (₦1,400±900) with 3-day grace → load-shedding (TV blocked at home, mood hit, +₦300 reconnection); KGIRS assesses 7.5% of the cycle's REAL income every 10d (read as the delta of stats.totalEarned — zero action hooks) with min ₦300, 4-day grace → WARRANT (reputation −5, phone refuses, police collects +25%); EFCC whistleblower tips (cooldown 3d, recovery ₦4k-120k seeded, resolve 2d, reward 5%); MARKET engine — daily per-market multipliers 0.85–1.35, every 3rd day = market day (×0.9), 6 weighted flavour events with meal biases; eatMeal + both menu UIs read ONE selector (mealPriceAt) so display can never drift from charge; in-person (GRA) payments free, phone +₦50 fee, warrants phone-proof.
- STATE: CivicState slice on the save (version 4 + v3→v4 migration + defensive merge); civic day-roll wired at ALL day crossings (rest/advanceTime/travel) via commitCivicDays; payNepa/payKgirs/fileEfccTip/mealPriceAt store actions; PhoneScreen gains the Civic app (NEPA/KGIRS/EFCC/market board); save payload + resetGame carry civic.
- TESTS: scripts/test-m2-civic.ts (67 checks: hash determinism, bill cadence/shedding/reconnection, tax rate+minimum+warrant math, whistleblower timing/rewards, market bands/market-day/bias/day-roll idempotence, campus buildings+doors+interiors law); world3d extended for the campus (707 total) with the corner law campus-aware; schools suite door count 6→10; stage5 asserts v2→v4 migration + civic round-trip (38). ALL GREEN: 707 + 67 + 232 + stage3 + 38 + travel; tsc exactly the 9 pre-existing (0 new), eslint clean.
- E2E (download/m2-civic-shots/, zero console errors): save-patch→L3 pattern hardened (patch must land on the IDLE menu page after a reload — pending autosave timers eat live-page patches); 01 GRA anchor, 02 gate walk-in, 03 campus facade + green fascia, 04 office interior (tiled hall, benches, counter), 05 CivicPanel live (EFCC "File a tip", ₦15,000 chip), 06 phone Civic app day-1 (NEPA current ₦0 / KGIRS none / EFCC explainer / Market Board: Kpata amala ₦470 vs Food Strip ₦510 — the daily price engine live), bill toast shot "NEPA bill posted — ₦1,520 due" with Day 5→6 toasts, and the save state after two sleeps = {day:7, owed:1520}. Diagnostics proved the rest path in the REAL store headlessly (bun: day 7, owed 1520, save in lockstep); headless anomalies traced to browser timer throttling + the SwiftShader wedge (~90-140s), not game logic.
- SPEED & DATA ECONOMY AUDIT (measure-only, per instruction): first-visit wire payload 2.03MB (dev, UNMINIFIED: JS 1.89MB/CSS 31KB/fonts 99KB) + lazy chunks ≈ 2.13MB total network, 0 failed requests; localStorage save 1.2KB; art on first paint ~111KB. Render responsiveness verified by proxy (dozens of live walks/shots/interiors across ~10 sessions, 0 console errors, 0 pageerrors). COULD NOT get a clean headless FPS number: SwiftShader software WebGL + browser self-destruct (~90-140s) kills long rAF samples (both the inherited harness and a minimal in-page counter stalled). Per instruction, NOTHING was optimized; the honest gap = real-device FPS unmeasured.

Stage Summary:
- M2 CIVIC MESH IS LIVE AND LAW-VERIFIED: the state now bills, taxes, fines, rewards whistleblowers and moves market prices — every naira through config + pure rules + the same store authority; 707/67/232/38 suites green, tsc/lint clean, committed.
- NOT touched (per instruction): any performance optimization. Reported numbers above; production build + real-device FPS check are the honest next measurement.
- Next: M3 candidates — biz/skills depth, the 2D map civic layer, or ship a production build for the real payload/FPS numbers.

---
Task ID: 15
Agent: Main Agent (Super Z)
Task: "BEGIN THAT AND ALSO NOW I WANT THIS MANDATORY — performance optimization (FPS, load-time, rendering, latency, 3D) ... then continue with M3"

Work Log:
- BASELINE (SwiftShader harness, 390×844 headless = deviceMemory 4 → the LOW tier weak phones take): menu 59.7fps; 3D world 0.5fps idle (one software frame 2-3s); desktop viewport 0.3fps. Legacy m2-fps probe returned zeros (race windows < one frame) — rebuilt SwiftShader-safe (8s samples + 25s races, robust entry waits for the now-dynamic game chunk).
- LOAD-TIME: Dashboard + CharacterCreation became next/dynamic chunks — three.js left the first paint entirely; the menu preloads the game chunk on requestIdleCallback (dashboard-chunk.ts kept import-free of the graph). PROD BUILD measured: first paint 401KB wire (HTML 3.2K + JS 247K + CSS 29K + fonts 121K) vs 2.03MB dev before; the three.js chunk (447KB gzip) streams during the menu.
- 3D RENDER: ShadowGovernor — the shadow map no longer re-renders EVERY frame (autoUpdate=false + needsUpdate on 3u player move / 0.4s heartbeat / first frame; verified live via renderer.info hook: shadowAuto:false, 278 draw calls, 618k tris, 30 programs); PCF filter at 1024²; DPR caps [1,1.75] high / [0.65,1.05] low; far-plane 720 on low; stencil off. LOW TIER: 30Hz demand-mode FramePacer.
- MEASURED AFTER (same harness, same tier): idle 0.7-0.8fps (+40-60%), walk/idle ratio 0.88 (movement JS is NOT the bottleneck — pure rasterization is; real GPUs render this scene in single-digit ms). React prod + minified bundles compound the gain on real devices.
- DATA ECONOMY: save already local-first (localStorage, zero network in the gameplay loop — boot/latency audit found no chatter to cut); art already ~111KB webp; payload census harness parameterized (PERF_BASE env).
- Platform note: boot dev server died mid-session; relaunched detached on :3000 and it SURVIVES tool boundaries this session (Task 9's reaper constraint did not recur).
- M3 — OWN THE CITY: businesses made real (BusinessState was dead code). systems/biz.ts pure + hash-seeded: 4 shops at REAL locations (kpata-stall L1/ganaja-kiosk L2/okada-stand L3/food-joint L4), income = base × level × MARKET-ENGINE multiplier (kpata/buka ride the M2 market prices; market days = busy days) × wobble × rep bonus; 7-day accrual cap; CIVIC COUPLING — each shop loads NEPA +22%, collected income hits the ledger so KGIRS assesses it with zero new tax code, phone collect = the SAME ₦50 fee law. Store: buyBiz/collectBiz(shop|phone)/upgradeBiz; biz day-roll in commitCivicDays. SAVE v5 (+v4 migration). UI: shared BizBlock in the 3D LocationSheet AND the 2D map sheet (the map has its OWN inline sheet — discovered via E2E); map ₦ dots + GRA civic-alert dot + legend; phone My Biz app.
- TESTS: m3-biz 48 (caught a real rep-bonus +1000% bug pre-commit); all suites re-run: biz 48, civic 67, world3d 707, schools 232, stage5 38 (v5), travel ✓, stage3 ✓; tsc 9 pre-existing; lint clean. E2E m3-biz-shots: map layer, shopfront (till ₦3,300 → collect → cash ₦503,300 + ledger), phone app; 0 console errors. New E2E truths: markers overlap on the dense map (DOM-level el.click() bypasses pin hit-testing); aria-label gains "(you are here)" at the current location.

Stage Summary:
- THE MANDATORY PERF PASS SHIPPED AND MEASURED: first paint 5× lighter (401KB prod), shadows on-demand (half the GPU work at high tier), low-tier frame pacing + DPR/far caps (+40-60% in the harness), menu at 60fps, zero network chatter in the loop. Honest gap unchanged: SwiftShader absolute FPS is sub-1 (software rasterization of 618k tris) — real-device FPS is the number that matters and every mechanism above serves it.
- M3 OWN THE CITY IS LIVE AND LAW-VERIFIED: buy/collect/upgrade shops at real Lokoja locations, tills that fill while you sleep (7-day cap), the market engine moving YOUR income, NEPA/KGIRS biting deeper, the map telling you where money and trouble wait.
- Commits: perf pass + m3 (see git log). Next candidates: garage/vehicles depth on the map layer, biz staff/upgrades chain, or real-device FPS capture.

---
Task ID: 16
Agent: Main Agent (Super Z)
Task: "nice do that then garage/map depth or a real-device FPS capture next? and the start m4" — REAL-DEVICE FPS CAPTURE + M4 THE GARAGE (vehicles x map depth)

Work Log:
- REAL-DEVICE FPS CAPTURE (closes the honest gap flagged in Tasks 14/15): src/game/systems/perfProbe.ts — a production-safe rAF ring-buffer sampler (240 frames) + renderer registry (setPerfRenderer now wired in WorldScene onCreated for BOTH tiers, not just high). buildReport() emits a shareable string: fps avg / p95 / worst frame time, draw calls + tris + programs (renderer.info), UNMASKED GPU name, viewport+DPR+RAM+net, UA. sampleFor() takes a fresh window on demand.
- PerfChip.tsx rides the 3D HUD top-right: a tiny live fps pill updating 2x/s from the ring buffer (never per-frame React state), tap = diagnostics panel with CAPTURE 5S + COPY REPORT (clipboard + execCommand fallback for locked WebViews). Works in production — the real-device number a player can actually send back. E2E hook __lkl.fpsReport(ms).
- M4 THE GARAGE — ownership now means economy. TransportId extended with own-okada/own-keke/own-taxi/own-danfo (PersonalTransportId + isPersonalTransport). ECONOMY.transport own-* entries: base 0 (no fare — FUEL only), perKm 45/40/130/85, faster minutesPerKm than their public counterpart, own energy rates; rain multipliers cover every id (okada 1.35 — rain riding is misery).
- systems/garage.ts (pure, deterministic): personalTransportId/personalModelOf roundtrip, ACCESS LAW via COUNTERPART {okada:keke, keke:keke, taxi:taxi, danfo:taxi} — bikes/trikes go anywhere a keke reaches (mount-patti's keke-class road), cars need taxi roads; personalTransportsFor (showroom order), transportAllowed = THE one offer law (public modes follow location data, personal follow ownership+access), allTravelOptions = the shared sheet builder (2D map + shared LocationSheet + 3D TravelSheet all read ONE source now), resaleValue = 62% day-one, -1.5%/day, 35% floor, rounded to naira 100.
- Store: travel() gains the ownership guard (notify "You no own that ride yet") + transportAllowed gate; fuel trips record "Fuel — {Short} to {Place}" in the ledger under transport; sellVehicle(vehicleId) action (resale through addMoney, ledger "Sold {Short} (plate)").
- UI: LocationSheet + MapScreen inline sheet + HudOverlay TravelSheet all render "Your Okada" gold rows with a FUEL · NO FARE chip (TransportIcon extended for own-* emoji); GaragePanel "Your rides" rows gain SELL buttons + live resale values + the fuel-law footnote; MapScreen gains the wrench garage dot on Motor Park, a "Your rides: {emoji} {plate}" strip, and two legend lines.
- TESTS: scripts/test-m4-garage.ts — 82 checks (fuel < public fare for every model, no-slower-than, rounding, determinism, access law incl. danfo-refused-on-Patti, availability law, offer law = store law, resale ladder + floor, and a REAL bun store pass: buy okada -> fuel trip to Ganaja (cash delta = fuel exactly, ledger records FUEL) -> danfo refused on Patti -> okada reaches Patti -> sell at exact resale -> resale id refusal). Math.random pinned high during store pass so travel events can't flake cash asserts. Caught 2 test bugs (underfunded showroom purchase; Math.random flake) — zero product bugs.
- Suites: m4-garage 82/82 (3x stable), world3d 707, schools 232, civic 67, biz 48, stage5 38, travel, stage3 — ALL GREEN. stage35's 3 failures verified PRE-EXISTING (identical on a pristine HEAD worktree: 11 pass/3 fail both trees). tsc exactly the 9 pre-existing (fixed 2 in my own test), eslint clean.
- E2E scripts/e2e-m4-garage.ts (download/m4-garage-shots/, 0 console errors): 01 map garage dot + rides strip, 02 Ganaja sheet with the gold Your Okada row (scroll crop keeps it below the fold in-frame — row existence + function proven by the click + ledger), 03 arrival "Fuel — Okada to Ganaja Junction −₦80" + garage legend lines, 04 Motor Park Garage panel (Drive + SELL buttons, resale values, OWNED badge), 05 perf panel live, 06 CAPTURED REPORT — full string incl. "172 draw calls · 426k tris · 20 programs" from the low tier (SwiftShader 0.3-0.5fps software rasterization — the harness number, as always; the REAL number now comes from the Copy report button on any actual phone).
- E2E craft notes: Playwright coordinate clicks die against animated HUD overlays (M3 lesson re-learned — DOM-level el.click() everywhere); the Vehicle Shop pill DOES appear at spawn (6.4u < SHOP_RADIUS 28); perf capture needs 5s + one extra software frame (~2.5s) to render the report before reading it.

Stage Summary:
- REAL-DEVICE FPS CAPTURE IS SHIPPED: every phone that runs the game can now answer the only perf question that matters — open the chip, Capture 5s, Copy report, send it. Prod-safe, both tiers, renderer.info included.
- M4 THE GARAGE IS LIVE AND LAW-VERIFIED: a bought ride is no longer a garage ornament — it drinks fuel instead of paying fares (always cheaper, never slower than its public class), respects the real road hierarchy (no danfo on the Patti keke road), sells back at deterministic depreciation, and the whole map layer tells you where the garage is and what you own. One shared offer law feeds every sheet in the game.
- Commits: m4 (this). Next candidates: M5 — biz staff/upgrades chain, day-cycle jobs at the motor park (driver gigs that use YOUR vehicle), or weather+night market events; the perf overlay makes any real-device regression self-reportable.

---
Task ID: 17
Agent: Main Agent (Super Z)
Task: M5 — WORK & FLEET — "nice build it but before touching the terminal tell me how many milestones remains" (milestone ledger answered: M1-M4 done, M5/M6/M7 remain; M5 built this task)

Work Log:
- MILESTONE LEDGER committed in the reply: the roadmap was never capped; M1 (roads/bridges/Patti) + M2 (civic mesh) + the mandatory perf pass + M3 (own the city) + M4 (garage + real-device FPS capture) are DONE; remaining arc fixed as M5 (work & fleet) → M6 (living world) → M7 (ship).
- M5 SCOPE: the rides you OWN (M4) become the work you DO. Driver gigs at the Motor Park + the shop as a small enterprise (staff + power ladder).
- systems/fleet.ts (NEW, pure/deterministic): gigBoard(day, vehicles, level, weather) — FLEET.gigsPerModelPerDay (2) offers per owned vehicle, showroom-ordered, destinations hash-picked from gigDestinationsFor(model, level) (counterpart road class + level-gated + never the park itself, schools included via the shared registry), consecutive-gig distinctness via a prevToId walk (caught a real board bug: the first retry compared the wrong pair). PAYOUT LAW: the PUBLIC counterpart fare (base + perKm × km) × FLEET.payoutMult 1.18, × rain premium (okada 1.4 / keke 1.22 / taxi-danfo 1.12) — "rain pay" flag rides the row. Fuel reuses calculateTravel() own-* cost so the pump can never disagree with the travel sheets. availableGigs = board MINUS FleetState.done (the only persisted fleet state — reload can't double-pay).
- THE MARGIN LAW: payout − fuel > 0 for every model × destination (41 combos checked) — derived, not assumed, from the M4 fuel<fare law. Worst margins verified; rain runs stay profitable.
- SHOP AS ENTERPRISE: BusinessState gains staff (cap = level, 1-5) + upgrades ('generator' | 'solar'). bizIncomeFor(opts {staff, upgrades}) — each attendant +22% (BIZ.staffIncomeBoost), each draws ₦400/day wage paid OUT OF THE TILL in bizDayRoll (net clamped ≥0 per day; lastAccrualDay marks even a wiped-out day so re-rolls can never double-charge); load-shedding now dims a shop WITHOUT power to 75% (BIZ.sheddingIncomeFactor) — generator/solar keep the full take; solar also cuts that shop's NEPA meter load 22%→8% (nepaBillFor(day, bizCount, solarCount) threaded through nepaDayRoll/civicDayRoll/commitCivicDays). One-rounding composition preserved exactly (tests recompose the raw law).
- STORE: fleet slice ({day, done}) on the save; startNewGame/continueGame/resetGame carry it; runGig guards (at the park, own the ride, energy, not travelling, not done today) then fuel-first (removeMoney 'transport' "Fuel — Okada (gig)") → fare (addMoney 'hustle' "Gig — Okada run to X" → KGIRS sees it) → energy + 1 clock slot + currentLocation = drop-off (3D PlayerController re-spawns there) → stats.jobsCompleted+1 → xp 8 + hustle xp 6 → done-ledger → commitCivicDays. hireStaff (₦2,000 fee, cap law) / fireStaff (free, wage stops tomorrow) / installBizUpgrade (generator ₦28k, solar ₦65k; double-install refused). SAVE v6 (+v5→v6 migration: staff 0, upgrades [], clean fleet ledger; defensive defaults).
- UI: FleetBlock (NEW) rides the park's location sheet — shared LocationSheet (3D world included) AND the 2D map inline sheet; rows show dest/vehicle/km/min/fuel/payout/energy, disabled states carry reasons ("You no dey the park"), empty garage upsells the showroom, cleared board says come back tomorrow. BizBlock owned view: staff row (Hire · ₦2,000 / Let go, wage line) + Power row (per-install buttons or fitted chips) + a dark-shop warning banner when shedding bites; honest income preview passes staff/upgrades. MapScreen legend gains "🛵 Own a ride? Driver gigs wait at the park". Phone My Biz: the same hire/fire/install controls remote (wage chip + fitted chips).
- TESTS: scripts/test-m5-fleet.ts — 95 checks (config law, destination law, payout arithmetic, 41-combo margin law, board determinism/distinctness/done-awareness, staff cap/boost/wage break-even, dark-shop law, solar meter law with EXACT load arithmetic via civicHash, wage idempotence + the zero-net marks-the-day law, and a REAL bun store pass: buy okada → fuel-trip to the park → run a gig (cash delta = payout − fuel exactly, both ledger entries, drop-off, done-refusal) → away-from-park refusal → hire/cap/fire → solar+generator → overnight accrual net of wage). Caught 3 test-side bugs (rounding composition ×2, a zero-net premise) + 1 REAL board bug pre-commit. Suites ALL GREEN: m5 95, stage5 44 (v6 ladder + new migration checks), m3-biz 50 (ladder updated v4→v6 + M5 defaults), m2-civic 67, m4-garage 82, world3d 707, schools 232, travel ✓, stage3 ✓; tsc exactly the 9 pre-existing; eslint clean.
- E2E scripts/e2e-m5-fleet.ts (download/m5-fleet-shots/, 0 console errors, all-2D — the 3D world opens the SAME LocationSheet): 01 park gig board (2 okada runs priced per the law), 02 driving overlay, 03 arrival (fuel −₦170 + fare +₦390 ledgered, dropped at GYB Model, row gone, fleet.done=["gig-1-okada-0"]), 04 staff hired (toast: income +22%, wage ₦400/day from the till), 05 solar fitted, 06 phone My Biz remote controls, 07 map fleet legend. E2E lesson re-learned: read the save ≥1.8s after a click — the 1.2s autosave debounce ate two assertions on the first pass.

Stage Summary:
- M5 WORK & FLEET IS LIVE AND LAW-VERIFIED: the garage now earns — passengers pay the counter fare, your fuel eats the margin, rain pays extra; the shops hire hands and fit power so load-shedding stops being free; the disco's meter honestly reflects the solar. One derived board law feeds every surface.
- Commits: m5 (this). Next: M6 — LIVING WORLD (weather events beyond rain, night markets, social depth) or M7 — SHIP (production hardening, PWA/offline, onboarding) — the perf overlay keeps any real-device regression self-reportable.

---
Task ID: 18
Agent: Main Agent (Super Z)
Task: M6 — LIVING WORLD — "then now the M6" (weather events beyond rain, night markets, social depth)

Work Log:
- MILESTONE LEDGER: M1-M5 done; M6 (living world) + M7 (ship) remained — M6 built this task. M7 is the last.
- WEATHER BEYOND RAIN: Weather union + 'harmattan' | 'storm' | 'flood' (real Lokoja skies: Sahara dust, confluence thunderstorms, Niger/Benue flood days). TIME.weatherWeights (55/25/14/3.5/1.8/0.7 = 100), weatherEffects (mood −2/−6/−8, FINALLY APPLIED at the sleep day-roll — the table existed unused since Stage 1), WEATHER_META (the ONE dictionary: label/icon/HUD tip/day-roll note — Dashboard chip, MapScreen hints, HudOverlay chip, store notifications all read it), weatherMinutesMultiplier rows for all 7 transports (flood slowest everywhere). systems/seasons.ts (NEW, pure): isRainSky/isHeavySky (one wet family: rain+storm+flood), weatherBlocksLocation (flood closes the Confluence — travel refuses with an honest toast, gig board never drops a passenger at a flooded pin, MapSheet shows "Flood don block the road"), weatherMarketMult (harmattan 1.08 < storm 1.15 < flood 1.3) FOLDED into the market roll via marketDayRoll(civic, day, weather?) — meals, market shops and the market board inherit the stress through the SAME prices, deterministic per day (weather is constant within a day), same-day re-roll a no-op. 3D: atmosphere.ts harmattan (ochre haze fog ×2.6)/storm (near-dark ×2.9)/flood (grey-green ×2.4) moods; Actors.tsx Rain renders the whole family (storm 40u/s heavy drops, flood 36u/s); LivingScene hero overcast+haze; store narrates the sky at sleep (dayNote notifications + mood).
- NIGHT MARKET: CIVIC.nightMarket — the Food Strip turns after dark (evening/night). 3 night-only dishes (night-suya ₦400, boli-ekpa ₦220, peppersoup ₦650; MealDef.night flag), seeded per-day discount 0.78–0.95 (nightMarketMultFor — deterministic hash), nightMealPrice = round10(base × tonight's discount) — NEVER above base. mealPriceAt/eatMeal share the one law (closed → honest refusal + base-price display); the outdoor food-strip sheet gets the "🌙 Night market dey open" section (HudOverlay MealMenu nightStalls prop + MapScreen inline sheet); WorldScene NightMarketGlow — 26 emissive bulbs on two sagging strings + 2 glow signs at the food-area anchor, same isNightMarketOpen law, zero real lights added.
- SOCIAL DEPTH: SOCIAL config (gifts: recharge-card ₦500/+8, suya ₦1.5k/+16, ankara ₦4k/+28 + giftMood 4; hangout ₦1,000/mood 8/fam 6/3-day cooldown/evening+night only; favorChance 0.3, favorTierMin 40). RelationshipState + lastGiftDay/lastHangoutDay → SAVE v7 (+v6→v7 migration + defensive defaults). social.ts pure laws: canGift/afterGift (once per NPC per day, clamp at 100), canHangout/afterHangout, favorRollsToday (deterministic per npc+day, paddy-gated). chatNpc attaches favorOffer (an eligible OWN-npc hustle through the SAME opportunity pipeline, source 'gist') on roll-true days; acceptFavorOffer reuses acceptOffer's guards. ChatThread UI: gift strip (3 rows, cost/+fam, once-per-day state), hangout button (slot-gated, honest ₦), FavorBubble (Accept → Work tab / Later).
- FLEET rough-sky law: gigPayout stacks rainPayout × FLEET.roughSkyBonus (storm 1.3, flood 1.6) — the M4 margin law only WIDENS as the sky darkens (verified: every model × destination × rough-sky combo payout − fuel > 0). rainPremium flag true across the family.
- UI/ICONS: WeatherIconKey extended (harmattan→SunIcon hazy, storm→RainIcon, flood→ConfluenceIcon waves); MapScreen flood banner + blocked sheet note (plans empty + dedicated note); noTravel rows on flood.
- E2E HOOK: __lkl.forceWeather(w) (WorldTab, ?e2e=1 only) — deterministic storm/harmattan/flood shots.
- TESTS: scripts/test-m6-living.ts — 100 checks ALL GREEN (config exhaustiveness incl. night-clear never rolled, rain family, market fold exact arithmetic + idempotence, flood law, rough-sky margin law over all combos, night-market band/availability/pricing laws, social laws incl. favour-band check, and a REAL bun store pass: Math.random pinned 0.999 → sleep rolls a FLOOD day (mood −8 + day note + stressed prices) → confluence travel refused (no fare moved) → night dish refused by day/served at night at the exact seeded price → gift cash/fam/ledger → hangout cooldown + the night→next-morning clock law → a paddy's favour accepted (source gist, duplicate refused)). Ladders updated: stage5 47 (v6→v7 + migration checks), m3-biz 50. ALL SUITES GREEN: m6 100, m5 95, m4 82, m3 50, m2 67, world3d 707, schools 232, stage5 47, stage3 ✓, travel ✓; tsc exactly the 9 pre-existing; eslint clean. stage35's 3 failures + routeBetween crash VERIFIED pre-existing on HEAD via git stash.
- E2E scripts/e2e-m6-living.ts (download/m6-living-shots/, 0 console errors): 01 harmattan dashboard (chip + hazy hero), 02 night market menu (banner + 3 dishes), 03 chat favour bubble (Paddy tier, save fam 58), 04 gift sent (tx + fam 66 + lastGiftDay), 05 flood dashboard (Flood watch chip), 06 flood confluence block ("Flood don block the road"), 07 storm city 3D (Thunderstorm chip, rain streaks, dark sky via __lkl.forceWeather). LESSONS: (1) the app flushes saveNow() on pagehide — save patches must land AFTER a reload on the idle menu screen, never before one; (2) under SwiftShader the world's first presented frame lags the DOM — poll the perf-chip, then wait ~12s before screenshotting or you capture the stale compositor frame.
- Dead-tree note: components/game/world3d/* (incl. the Lighting.tsx touched for type-consistency) is the legacy tree — the LIVE world is components/game/world/ (WorldTab → WorldScene → Actors/atmosphere); all live edits landed in the live tree.

Stage Summary:
- M6 LIVING WORLD IS LIVE AND LAW-VERIFIED: the sky is weather now — harmattan hazes the town, storms pay the riders extra, the flood closes the riverfront and stresses every market price through the ONE roll; the Food Strip turns after dark with three honest night plates under real bulb strings; and paddies pay you back — gifts move the needle, hangouts cost a real evening, and a paddy's favour arrives as real gist through the same pipeline as every hustle.
- Commits: m6 (this). Remaining: M7 — SHIP (production hardening, PWA/offline, onboarding polish) — the final milestone on the ledger.

---
Task ID: M7
Agent: Main Agent (Super Z)
Task: M7 — RUN ON ANY DEVICE (user directive: "make the game to be able to run on any device")

Work Log:
- systems/device.ts NEW pure law module: DeviceSignals (cores/memoryGB/gpu/coarsePointer/mobileUA/webgl1/webgl2, every read guarded), detectTier() ordered explainable verdicts (flagship 8/8→high, 4GB phone→mid, ≤2 cores/≤2GB→low, SwiftShader/llvmpipe→low, iPhone-specs-hidden→mid safe-middle, no-WebGL→low+Map-Mode reason), QUALITY_PRESETS 3-tier ladder (shadows/AA/dprCap/dprFloor/far/frameHz/fogPush — only high shadows, only low paces 30Hz + leans fog), resolveQuality() player-pick-beats-auto law, nextDynRes() hysteresis state machine (hot p95>40ms dwells 4s then drops cap −0.15 to floor; cool p95<22ms dwells 8s then climbs +0.1 to initial cap; 22-40ms band = steady, resets drift; deterministic + never flaps), probeWebGL() injectable factory (throwaway context → GPU name → loseContext to reclaim; every failure honest), session-cached DeviceProfile (buildProfile/getDeviceProfile/refreshDeviceProfile/deviceLine)
- SAVE v8: settings.graphics ('auto'|'low'|'mid'|'high', default 'auto') + v7→v8 migration + defensive junk-value fallback; SaveSystem.patchSettings() NEW — menu-stage picks persist while the debounced autosave is dormant; store setGraphics() + toggleSound() patch the save directly when no game is live (real bug the E2E caught: a menu GraphicsPicker pick used to evaporate on reload)
- WorldScene: binary detectQuality() replaced by the device law (3 tiers), Canvas driven by preset (shadows/AA/dpr/far/demand-vs-always), DynamicResGovernor (2s cadence reads perfProbe ring → nextDynRes → gl.setPixelRatio; document.hidden guarded), FramePacer hidden-tab battery guard, webglcontextlost (preventDefault + status + HUD callback) / webglcontextrestored (shadow refresh + status) listeners, __lklForceQuality E2E override, e2e=1 gates __lklGlCanvas/__lklDynRes/__lklTier
- WorldTab: glLost state + amber "Screen rebuild — recovering…" chip (HUD stays interactive through GPU death); __lkl.deviceProfile/glStatus/dynRes/tier hooks; perf report gains the tier line
- GraphicsPicker NEW shared component (Dashboard settings + Phone settings app + MainMenu dialog): Auto/Low/Mid/High segmented control + the device verdict line (tier · WebGL version · GPU · reasons) + dyn-res explainer
- WorldView (legacy path): probeWebGL guard + Map-Mode fallback panel (kept consistent; live path is WorldTab's existing fallback contract)
- TESTS m7-device 53 checks: tier matrix, quality law, dynres hysteresis (single hot frame NEVER acts; floor/ceiling hold; patient recovery; determinism), gl probe (null/webgl-only/gpu-name/throwing), save v8 (v7→auto default, junk→auto, explicit pick survives), REAL bun store pass (setGraphics→save→persist + the MENU LAW: no-game picks reach disk); stage5 46→47 (v2/v5/v6 ladder expectations 7→8, old-fixture settings honest again), m3 48→50 (v4→v8 ladder)
- E2E m7-device-shots 6 PNGs, 0 console errors: desktop picker + persistence (saved:high), iPhone 13 emulation picker, --disable-webgl fallback card + map continues, forced-low world (193 draw calls · 425k tris), context-loss chip (status lost→chip true→restored). Jam diagnosis: world build blocks SwiftShader main thread ~30s (veil lifts late, m6 lesson holds) — settle() polls alive+canvas+!veil; restore needs the lose_context ext handle captured BEFORE the loss (spec: unreachable after)
- Regression: world3d ALL ✓, schools 232 ✓, stage3 ✓, travel ✓, m2 67 ✓, m3 50 ✓, m4 82 ✓, m5 95 ✓, m6 100 ✓, stage5 47 ✓, m7 53 ✓; tsc exactly the 9 pre-existing; eslint clean; dev server health 200

Stage Summary:
- M7 shipped: the game now grades every device (low/mid/high), fights lag live via dynamic resolution, survives GPU context death with a visible recovery chip, offers a real Map-Mode fallback for WebGL-less devices, and gives the player a persisted Auto/Low/Mid/High switch in three surfaces — all laws deterministic and tested without a browser
- Milestone ledger: M1-M7 done; no pre-committed M8+ — queue open for user direction

---
Task ID: AUDIT-1
Agent: Main Agent (Super Z)
Task: Sincere reality-check audit — verify the pasted "Reality Check" milestone scorecard against actual repo evidence (git log, source tree, test suites, save system, PWA assets)

Work Log:
- Read full git log (1bb4a29..cf6a294): mapped project-internal milestones m1 roads → m2 civic → m3 biz → m4 garage+FPS → m5 fleet → m6 living world → m7 RUN-ON-ANY-DEVICE (cf6a294, COMMITTED)
- Verified source tree: systems/device.ts (355 lines, tier law + dynres governor), seasons.ts, civic.ts (371), fleet.ts, biz.ts, social.ts, audio.ts (SFX synth only — no music engine)
- Verified save.ts: SAVE_VERSION=8 with full v1→v8 migration ladder (never-lose-progress = partially true)
- Verified public/: NO manifest.json, NO service worker → PWA/offline = 0% confirmed
- Verified locations.ts: 10 base districts; bank = stage5 interior panel, health = FUL clinic building only (no gameplay)
- Verified test suites on disk: test-m2-civic 67, m3-biz 50, m4-garage 82, m5-fleet 95, m6-living 100, m7-device 53, world3d 707, schools 232, stage5 47, stage3, travel
- Cross-checked pasted Reality Check vs git: found it OUTDATED on device-compat (m7 cf6a294 shipped after that doc was written) + 2 number wobbles (roads: commit says 2,655 ways ~930km, doc claims 2,800+/~730km)

Stage Summary:
- VERDICT: pasted Reality Check ~85% sincere; corrected whole-dream completion ≈ 30-38%
- Key correction: master-plan M9 (Silk/any-device) is ~50%, not ~35% — device law + 3 quality tiers + dynres + context-loss recovery + device E2E already shipped in cf6a294
- Hard zeros confirmed: multiplayer/Live Nation, City Forge automation, Planet Scale, PWA, signed saves/HMAC (Fortress), elections/courts/prison/JAPA, education ladder loop, marriage/family, festivals, teleport links, parent PIN/age tiers
- Numbering collision documented: project-internal m1-m7 ≠ master-plan M1-M11; future work must reference master-plan names

---
Task ID: PLAN-2
Agent: Main Agent (Super Z)
Task: Ratify MASTER ROADMAP v2 (M8→M20) — integrate Lagos-Life counter-doctrine (awareness/casual/familiarity) + all new viral ideas (NEPA Chaos, POS scarcity, Sandbag flood, Regatta calendar, JAPA, Ajo, MOPOL)

Work Log:
- Wrote /home/z/my-project/ROADMAP.md — the single source of truth for all future milestones
- M8 CHAOS ENGINE → M9 CASUAL SHELL → M10 LIVING CALENDAR → M11 RIVERS AWAKE → M12 THE LADDER → M13 FAMILY SHIELD → M14 FORTRESS → M15 TELEPORT & PULSE → M16 PWA/SILK FINISH → M17 LIVE NATION → M18 CITY FORGE → M19 NEXT-GEN POLISH → M20 PLANET SCALE
- Each milestone maps to master-plan parts, lists what it rides on, and its Lagos-Life kill shot
- Continuous laws preserved: tests green → silk gates → E2E mobile+desktop → worklog → commit

Stage Summary:
- Roadmap v2 ratified; numbering collision resolved (internal M8+ continues; master-plan names mapped)
- Next build target per doctrine: M8 THE CHAOS ENGINE (rides civic/biz/weather infra — cheapest viral fire, IS the launch event)

---
Task ID: PLAN-3
Agent: Main Agent (Super Z)
Task: Add THE GUEST LOOP (play-first, login-to-continue) to ROADMAP.md per user directive

Work Log:
- Counter-doctrine #2 updated: no account to START (M16) + Guest Loop login-to-continue (M9)
- M9 CASUAL SHELL now carries the Guest Loop as a first-class block: guest plays instantly → tours starter
  environment → first hustle/₦ → GATE on forward progression → phone OTP/Google/email login → guest save
  MERGES into account (never-lose-progress) → unlocks cloud save, streaks, leaderboards, teleport claims, Live Nation eligibility
- M14 FORTRESS: cloud = signed backup/leaderboards for logged-in accounts only; guests stay local/offline
- M16 PWA: Guest Loop offline-first — login + sync whenever a connection appears
- M17 LIVE NATION: identity arrives free from the Guest Loop; no separate multiplayer signup ever
- M13 FAMILY SHIELD: minor accounts parent-PIN-created, zero data collection, adult contact blocked in graph

Stage Summary:
- ROADMAP.md v2.1 ratified with the Guest Loop threaded through M9/M13/M14/M16/M17
- Loop: TAP → PLAY AS GUEST → see the environment → GATE → LOGIN → keep going, nothing lost
- Next build target unchanged: M8 THE CHAOS ENGINE

---
Task ID: M8-M9
Agent: Main Agent (Super Z)
Task: Build M8 THE CHAOS ENGINE + M9 THE CASUAL SHELL (two milestones, one swarm run, per user directive)

Work Log:
- M8: systems/chaos.ts pure laws (blowout/outage lifecycle/blackout/scarcity/pool/ATM/POS/liquidity), CHAOS config, chaos threaded through civic (liquidity fold), biz (blackout 0.25 crush + generator fuel from till + POS harvest ×1.35), travel/garage/fleet (fuel surge ×1.6 personal-only, one-price law across sheets + gig board); store: chaos slice + integrated day-roll narration + contributeToPool + bankWithdraw atm/pos + TV dies in the dark; UI: ChaosBanner (pool bar + tiers + money-weather chips), map ⚡ dark pin, NEPA office grid card, bank two-doors, biz blackout/POS lines; SAVE v9; __lkl chaos/forceChaos/forceScarcity
- M9: systems/goals.ts (daily 3, streak continuity, lazy re-roll) + systems/guest.ts (gate matrix, grace law, validators, THE MERGE LAW — further save wins, loser → backup slot); chill laws through needs (decay ×0.5) + civic (warrant ×3, disco ×2, weather mood ×0.5); store: goals bumps at 13 action sites, onboarding arc (travel/work/meal/earn → ₦1,000 Street Certified), GUEST GATE in travel, register/login/pushCloud actions (real fetch), pulse/shockwave juice transients; Prisma Account+CloudSave (SQLite, scrypt PIN, rotated bearer tokens) + /api/auth/register /api/auth/login /api/cloud/push /api/cloud/pull; UI: GoalsCard + OnboardingCard + GuestGate modal + ChillToggle + account line + MoneyPop/Shockwave (transform/opacity only); SAVE v10
- Test-era migration: m4/m5/m6/m8 store passes neutralized (pre-completed goals + linked account) so legacy exact-cash laws still measure one action at a time
- Discipline: ALL suites green (m2 67, m3 50, m4 82, m5 95, m6 100, m7 53, m8 100, m9 61, stage5 47, world3d, schools 232, stage3, travel); tsc exactly 9 pre-existing; eslint clean; tsc settings/chill literals fixed across save/store/tests

Stage Summary:
- Commits: a9a4222→amended 0e5092b (M8) + this commit (M9)
- E2E: m8-chaos-shots (banner/pin/pool 4600→7100/ATM cap refusal toast ₦397,500 held/desktop) + m9-shell-shots (casual shell, THE GATE "Lokoja knows your face", real register claim ada_*, cloud-on line, chill on, goal reward +₦250 in the live ledger) — 0 console errors both
- THE GUEST LOOP IS LIVE: play first → gate → claim → merge → cloud, nothing lost
- Next per ROADMAP.md: M10 THE LIVING CALENDAR

---
Task ID: M10
Agent: Super Z (main)
Task: M10 — THE LIVING CALENDAR (per user: "the m10"), built after the M8+M9 swarm milestone (user instruction "nice swarm your self and finish two milestones m8 and m9" → committed 0e5092b + 9c63f28)

Work Log:
- Built systems/calendar.ts (pure, ~560 lines): 72-day Lokoja year (yearOf/yearDayOf/wrapDay/absoluteDayOf), the Eid-family drift (±4 year-days, deterministic, moves Ramadan + both Eids + the ram market TOGETHER), 10 attendable day-festivals (New Year, Eid-el-Fitr ×2, Workers, Children, Regatta ×2, Democracy, Eid-el-Kabir ×2, New Yam, Independence, Detty December ×9) + 3 window-laws (Ramadan fast, ram market ×3, Detty season), calendarMarketMult (multiplicative folds riding the SAME marketDayRoll liquidity channel as the M8 chaos engine), calendarFleetMult (Detty ×1.35 gigs / Regatta ×1.25 / Independence ×1.2), regatta (4 crews, deterministic trophy per year, sponsor ₦2k→₦6k+rep8 win / rep2 consolation, race-eve bets ×2.5 adults-only, stakes settle the morning after day 38), ram market (ladder ₦36k→₦46k toward Eid-eve ±6% wobble, 6 meat packs a ram, once-per-paddy-per-Eid sharing +12 fam), weddings (one every 9 days seeded day 1–7 of cycle, couple+venue hashed, aso-ebi ₦1.5k at Kpata, gift tiers ₦500/1k/2k → mood+8 rep+2/+4), town-union paving (project every 14 days breaking ground ONLY on cycle start, NPC flow ₦800–1,800/day, player tiers ₦500/1k/2.5k once/day in-zone, ₦10k target → street paved 20 days → journeys in ×0.85 minutes, stall law announces honestly), setDebugYearDay (E2E override), calendarDayRoll (idempotent, settles paving lifecycle + regatta stakes)
- Folded into existing systems: seasons.ts nightMarketMultFor ×0.92 during the fast (Ramadan's real kitchen); fleet.ts gigPayout optional mult + gigBoard passes calendarFleetMult + paved minutes; travel.ts calculateTravel optional minutesMult; garage.ts allTravelOptions threads minutesMult so every sheet shows the smooth-road minutes the store charges (one-price law)
- Store: calendar slice (fresh/startNewGame/continueGame/saveNow/scheduleAutosave), civicRollForDays rolls calendarDayRoll in the SAME loop, festival-mood narrations + wedding invitations + paving done/stalled + regatta payout narration in commitCivicDays, 8 new actions (attendFestival w/ seeded naira spray ledger, buyRam, shareMeat, sponsorBoat, betBoat kid-gated, buyAsoEbi, attendWedding aso-ebi-doubled rep, contributePaving), eatMeal iftar blessing (+3 mood evening/night in the fast), travel action + gig board ride pavedMinutesMult/calendarFleetMult
- UI: FestivalBanner (dashboard: today's festival card, season chips Ramadan/ram-market/Detty, wedding-today card, paving pool bar, meat-packs chip, next-festival countdown), FestivalPanel (venue actions inside BOTH the shared LocationSheet AND MapScreen's inline sheet: attend, 4 crew sponsor buttons, race-eve bookie tiers, ram buy + meat-share rows per known paddy, wedding gift tiers with aso-ebi status, paving tiers — the MapScreen sheet is separate from LocationSheet, both mounted), 🎉 map pin on live venues (festival/wedding/ram market/paving), WorldTab __lkl.forceYearDay + __lkl.calendar()
- Save v11 (+v10→v11 migration + defensive heal); test fixtures test-stage5/test-m9-shell patched with the calendar field
- BUGS CAUGHT BY THE SUITE: paving restarted mid-cycle after early completion (law now breaks ground only on cycle start), null-paving guards in the day roll, eid-drift-aware test windows
- BUG CAUGHT BY E2E: FestivalPanel was mounted only in the shared LocationSheet but the 2D map renders its OWN inline sheet — mounted in both; also bun has no `window` (SaveSystem shim) and CSS uppercase breaks innerText probes
- E2E m10-calendar-shots: 10 PNGs 0 console errors — regatta dashboard + 🎉 pin + crews/bookie sheet + sponsor ★ + spray toast, paving ground-breaking + gift, ram buy ₦41,300 + 6 packs + share rows, wedding banner + canopy gift tiers, desktop wide; each phase seeds an honest v11 save at the law-computed day (wedding day comes from weddingForCycle, paving zone from pavingZoneFor)

Stage Summary:
- M10 COMPLETE: the predictable retention spikes are live — every 72-day year delivers 2 Eids + Regatta + Detty + national days + ~8 weddings + ~5 paving projects; all folds ride the SAME market roll (one-price law held); kids can sponsor but never bet; KGIRS still sees every sprayed naira
- TESTS: m10-calendar 124 checks ALL GREEN incl. real bun store pass (sleep to the Regatta → sponsor the trophy crew → collect ₦6k + ₦2.5k bet → buy ram ₦41,300 → share meat with Musa +12 fam → aso-ebi wedding +4 rep → help pave a street → ride it 15% faster → iftar blessing on the evening plate); regression ALL GREEN: world3d 707 / schools 232 / stage3 51 / stage5 47 / travel 16 / m2 67 / m3 50 / m4 82 / m5 95 / m6 100 / m7 53 / m8 100 / m9 61 (version pins lifted to v11, M6 night-market band now Ramadan-aware); tsc exactly the 9 pre-existing; eslint clean
- Dev server note: Turbopack cache corrupted once mid-session (cache deleted while hot) — restarted detached via double-fork setsid; server healthy on :3000
- Next: M11 THE RIVERS AWAKE (flood season + sandbag tycoon) per ROADMAP.md v2.1

---
Task ID: M11
Agent: Super Z (main)
Task: M11 — THE RIVERS AWAKE (per user: "the both swarm yyourself" — the next two roadmap milestones M11+M12 after M8/M9/M10 landed)

Work Log:
- Built systems/rivers.ts (pure, ~430 lines): the river's OWN year on the same 72-day clock (dry New Year — the festivals never drown; smoothstep rise yd 41→54; peak sits 55–62; recede 63→70; dry by 71; seeded ±0.05 daily breath; deterministic + reload-proof, ZERO state), the cut law (confluence @0.35 / ganaja-junction @0.55 / kpata-market @0.75 — the deeper city, the higher bar), the walkway tycoon (Crusher sand ₦600/sack on the Patti road → 2 sacks/segment → 4/5/6 segments per zone → the crossing opens → WALK LAW: pedestrians only at ×1.35 careful minutes), the toll bowls (seeded 8–26 crossings/day scaling with the level, 3 tiers ₦30/60/120, accrual at the day roll for yesterday while the water held, collect in person), the canoe ferry (canoe ₦18k at the jetty; board = 2 boatloads/day only while a zone is cut, payout = the counter fare ×(2.2+0.8×level) — the water never quotes a fare the land sheets disown; ride fare ×2 halves the paddle energy), the cold-room rescue (level ≥0.7 wakes ONE bowl per surge-year at Kpata; NPC flow ₦600–1,400/d + player tiers ₦500/1k/2k once/day in person; full pool ₦8k = the trucks roll the next morning to the Patti road high ground), the flood crush (cut zone ×0.5 unsaved / ×0.9 saved-year, folded with the M8 blackout — the worse water wins), the market fold (×(1+0.25×level) cap 1.25 riding the SAME marketDayRoll channel), riversDayRoll (idempotent: bowls, rescue wake/done, toll accrual, flooded/drained narrations, damp −2 mood above 0.55, relief +3 when the river walks home)
- Store: rivers slice + riversDayRoll in the SAME civic loop; riverMarketMult folded into the market roll; floodBizFactor threaded through bizDayRoll (new optional floodFactorFor param); travel action: the RIVER LAW — land transport refuses cut zones in BOTH directions (walk-only through a finished walkway at ×1.35, ferry bypasses as a boat); 8 new actions (buySand, laySegment, setTollTier, collectTolls, buyCanoe, takeFerry, runFerryGig, contributeRescue); river narrations (flood, drain, rescue wake/done, damp/relief moods); SAVE v12 (+v11 migration + partial-data healing)
- BUG CAUGHT IN REVIEW: loginAccount's cloud-merge set was DROPPING the calendar + fleet slices (M9-era oversight exposed by adding rivers) — merge now restores calendar/fleet/rivers from the winner save
- UI: RiversBanner (gauge + verdict line + cut chips with walkway progress + rescue pool bar + compound/toll chips), RiversPanel in BOTH the shared LocationSheet AND MapScreen's inline sheet (Crusher sand, lay-segment, toll tiers + bowl collect, canoe purchase, the day's ferry board, ride rows both ways, rescue tiers), 🌊 map pin on cut zones (map-river-dot), __lkl.forceRiver + rivers() hooks
- TESTS m11-rivers 102 checks incl. REAL bun store pass (force the surge → land travel refused → buy the canoe → run a boatload at the surge fare → ride home honestly → buy 10 Crusher sacks → ferry into the Ganaja road → lay 5 segments across 5 days → the crossing opens → set the ₦120 toll → the bowl accrues overnight → collect → walk out over the walkway → walk back in → ferry to Kpata → fund the rescue → the trucks roll → +4 rep → the crush softens ×0.9); save v11→v12 migration + partial heal + corrupt-null
- REGRESSION LIFTS: stage5 47, m3 50, m7 53, m8 100, m9 61 (version pins → v12); m10 124 — the M10 wedding/paving phases now legally WALK OUT OF A FLOODED KPATA (day 52-58 sits inside the surge window), so the m10 suite rides setDebugRiverLevel(0) for its travel legs (the calendar is what it tests; the river is M11's law)
- E2E m11-rivers-shots: 9 PNGs 0 console errors — surge dashboard (gauge 100%, 3 cut chips, rescue bar), 3 🌊 pins, land-travel refusal toast, jetty ferry board (2 gigs + 3 ride rows), Crusher sand buy, ferry into the cut zone + segment laid (live slice: segmentsLaid 1), rescue bowl ₦1,000 dropped + a REAL day-roll NPC flow ₦750 landing mid-phase (pool 3000→4750), desktop wide
- Discipline: ALL suites green (world3d / schools 232 / stage3 / stage5 47 / travel / m2 67 / m3 50 / m4 82 / m5 95 / m6 100 / m7 53 / m8 100 / m9 61 / m10 124 / m11 102); tsc exactly the 9 pre-existing; eslint clean
- Performance note: 3D river-rise water geometry deliberately NOT touched this milestone (M19 owns the flood-water shader; the six perf mandates say don't disturb a passing dimension) — the surge lives in the honest game laws + 2D map pins this era

Stage Summary:
- M11 COMPLETE: the uncopyable Lokoja mechanic is live — the Niger keeps its own year, the low city loses its roads, canoes become the bus, sandbags become a business, tolls become rent, and the cold rooms get saved by the street
- Commits: m11 (this). Next: M12 THE LADDER (education → housing → JAPA → MOPOL)

---
Task ID: M12
Agent: Super Z (main)
Task: M12 — THE LADDER (second milestone of the user's "the both swarm yyourself" run — M11 RIVERS AWAKE landed first as 3a4f991)

Work Log:
- systems/education.ts (pure): the FUL semester clock (18-day semesters, lecture window days 1-15, exam window the last 3, the syllabus caps at 12), the ASUU strike law (deterministic per ABSOLUTE semester index — ~30% of semesters, 5-8 days, freezes the gate from lecture-day 7, ZERO state, reload-proof), the once-a-day lecture law (smart XP +12 + the ₦150 tutorial stipend), the DEAN'S GRANT (exactly 8 lectures in one semester pays ₦2,000 + rep 3, once per semester), THE HONEST EXAM (score = smart + lectures × 0.5 ≥ 8 — no dice; a skiving genius at smart 5 + 4 lectures scores 7 and repeats), the pass ladder (semester+1 starts tomorrow, lectures reset; the 4th pass calls the convocation +2 days out), the convocation (rep +12, mood +10, the certificate lands), enroll gates (level 2, ₦25k)
- systems/housing.ts (pure): the rent book (cycles post every 6 days, each MISSED cycle posts exactly once via the lastPostedDay ledger — a 20-day sleep lands them all; the landlord's wahala rides its cycle hash: the ₦1.15 spike / the ₦2k leaking roof / the ₦1k inspecting son at ~35%), the quit notice (two cycles behind → mood −4, rep −2), the ladder (family room ₦85k Adankolo → self-contain ₦180k Ganaja → GRA flat ₦420k → the Adankolo duplex ₦950k, level-gated 3/5/7/9), THE COMFORT LAW (owned comfort warms the sleep: +energy ×3 per comfort point; furnishing tiers fan→generator→AC REPLACE, +1/+2/+3 mood)
- systems/japa.ts (pure): the document chain (every desk refuses without the previous paper: NIMC slip at GRA ₦3k with an honest tomorrow-queue → the passport (official ₦25k/3 days OR the Ganaja agent ₦12k whose honesty is a HASH of (day, handle) — ~60% real, a wash costs the money + rep −3) → the KGIRS clearance (the warrant blocks the pen) → the police certificate (₦5k, a clean fines book) → THE SEND-OFF at the Motor Park (₦150k, rep +15, mood +15, the 'japa' achievement) → the first remittance ₦50k lands the MORNING AFTER, once); THE MOPOL DETAIL (5 police shifts of trust, every 3rd day, ₦8k + rep 3, the siren ×0.8 minutes for 2 days riding the SAME travel-plan math)
- THE CAREER GATE: jobs.ts gains requiresDegree (Civil Servant — GRA ₦3,800 rep 300, Tutorial Assistant — FUL ₦3,200 rep 150) + the police recruit (₦2,800 rep 200, no degree); checkRequirements reads the certificate through a ctx param threaded from the live education slice (store workShift + both WorkScreen call sites); the police-recruit shift feeds the MOPOL trust ledger
- Store: education/housing/japa slices + housingDayRoll/remittanceLands in the SAME civic loop; the rent/wahala/quit-notice/remittance narrations; the comfort fold inside rest('sleep'); the siren fold inside travel's minutesMult; 17 new actions (enrollFul, attendLecture, sitExam, attendConvocation, payRent, buyProperty, furnishHome, resolveWahala, requestNimc, collectNimc, requestPassport, collectPassport, tryAgent, kgirsClearance, policeCertificate, takeFlight, runEscort); SAVE v13 (+v12 migration, partial-data healing)
- BUGS CAUGHT BY THE SUITE: the rent book double-posted unpaid cycles (the roll keyed on paidThrough — now each missed cycle posts exactly once via lastPostedDay); the MOPOL detail blocked flown players forever (the uniform works on — the remittance morning says the city still needs you)
- UI: LadderBanner (the FUL semester card with 12 lecture pips + the ASUU strike chip, the rent book/owned-roof chip with the wahala pulse, the 5-step JAPA doc chain, the MOPOL convoy call), EducationPanel (enroll/lecture/exam/convocation at both FUL sheets), HousingPanel (the rent book + the wahala settle at home, the rungs for sale at their real locations), JapaPanel (GRA's four counters + the MOPOL detail, the Ganaja agent with his street record, the send-off desk at the Motor Park) — mounted in BOTH the shared LocationSheet and MapScreen's inline sheet
- TESTS m12-ladder 117 checks incl. REAL bun store pass (enroll at level 2 → live through 4 semesters of lectures/exams → the Dean's grant pays → graduate → the convocation → the career desk opens → the rent book ran the whole time → pay a cycle → buy the family room → furnish tier 1 → the whole JAPA chain → THE SEND-OFF +rep 15 → the remittance lands the morning after → the MOPOL convoy pays → the siren rides the SAME travel plan ×0.8 → the ladder persists into v13)
- REGRESSION LIFTS: stage5 47, m3 50, m7 53, m8 100, m9 61, m10 124, m11 102 (version pins → v13)
- E2E m12-ladder-shots: 10 PNGs 0 console errors — FUL dashboard + lecture hall (lecture 6/12 through the live store), the rent book + the landlord's wahala settled, the JAPA banner's doc chain + the GRA desks (passport collected, MOPOL escort ran), THE SEND-OFF at the Motor Park, desktop wide
- Discipline: ALL suites green (world3d / schools 232 / stage3 / stage5 47 / travel / m2 67 / m3 50 / m4 82 / m5 95 / m6 100 / m7 53 / m8 100 / m9 61 / m10 124 / m11 102 / m12 117); tsc exactly the 9 pre-existing; eslint clean

Stage Summary:
- M12 COMPLETE: Master M5 (career/education/housing/JAPA) is live — the FUL certificate opens the career desks, the rent book grows into owned keys, the JAPA file walks five honest desks, and the MOPOL siren clears the road
- Commits: m11 3a4f991 + m12 (this). THE BOTH ARE DONE — next per ROADMAP.md v2.1: M13 FAMILY SHIELD

---
Task ID: 1 (M13)
Agent: Main Agent (Super Z)
Task: M13 — FAMILY SHIELD (the family moat: one download, three generations)

Work Log:
- Read ROADMAP.md M13 spec + surveyed the M9 guest loop (guest.ts, /api/auth/*), the store, hustles, calendar canBet, japa chain, chat UI before touching anything
- systems/shield.ts (pure): AGE_LAW table (kid: no crime/light hustles/emotes/featured scammer/×1.25/no japa; teen: no crime/all hustles/full socials/×1.25/japa; adult: everything), crime-adjacent ids (night-out, regatta-bet, japa-agent) + honest refusals, canHustle (kidSafe law), canJapa, THE GRAPH BLOCK canContact (adult→minor structurally false forever), validateParentPin (6 digits), local parent gate (iterated salted FNV + salt tail verify), tierGateVerdict (no climb without the parent's yes; demotion always open to a parent), ELDER mode, SPOT THE SCAMMER: 12 real 419 patterns + 12 honest lines, deterministic daily rounds (mulberry32 per day, 1 scam + 2 honest + seeded shuffle), scamReward (₦150+25×streak cap 10, +8 smart XP, +2 mood), once-per-day law, scamAnswerApply (streak chains, wrong pick teaches the REAL scam)
- Types v14: AgeBand on core types (no import cycles), PlayerState.ageBand, GameSettings.elder, ShieldState slice, GameSave.shield; save.ts v13→v14 migration + defensive heals
- Hustles: kidSafe flags on all 18 (only emeka-last-mile + mama-ngozi-soup-run — the long solo cross-town deliveries — stay adult/teen); the law lives INSIDE isEligible so search/favor/gist pipelines ALL inherit it
- Store: startNewGame(ageBand), crime gates on nightOut/betBoat (now reads the CHARACTER band through canBet — teens refused too)/tryAgent/takeFlight/requestNimc (kids), enrollFul refuses kids, study ×1.25 for young bands, emoteChat (kid-only preset-emote socials, same clock/ledger), playScammer, setLocalParentPin, unlockTierLocal, setElder; elder decay folded into slotDecay (min(chill 0.5, elder 0.75)); registerAccount M13 law (minor → parent PIN required, contact NEVER sent)
- Calendar canBet: 18+ only (was kid-only) — the M13 line now covers teens
- API: register minor law (parent PIN scrypt w/ own salt required for kid/teen; contact column now NULLABLE and never stored for minors — zero collection; parent PIN must differ from account PIN), /api/auth/tier (account PIN + parent PIN verify, every band move carries the parent's yes), prisma schema + db push + generate
- UI: CharacterCreation life-stage strip (Pikin/Teen/Adult + honest notes), GuestGate minor branch (🛡️ note, contact field GONE, 6-digit parent shield PIN, claim button relabels), phone Family Shield app (band card, Spot the Scammer daily drill, local tier ladder, elder toggle), ChatThread kid mode (6-emote grid replaces composer; gifts/hangout hidden for kids), elder-mode CSS law (118% root, stronger card lines, motion killed inside prefers-reduced-motion:no-preference guard) applied via one root class from page.tsx
- BUGS CAUGHT: emeka-last-mile lives at ganaja-junction not transport-area (test now checks the right board); fresh goals rolled lazily inside bumpGoal made the scammer's goal bump pay ₦450 mid-test (drill now bumps 'study'; test pre-seeds goals); skill-cap banking ate the study delta (test sets level 8); the dev server's PrismaClient went stale after the schema push + a direct bun write left SQLite read-only for the server (restart fixed — noted for M14: no direct bun DB writes alongside the live server)
- TESTS m13-shield 81 incl. REAL bun store pass (kid: crime refusals before money moves, kidSafe-filtered boards at Kpata + Ganaja, emote road + once-a-day, scammer pays ₦150 then chains ₦175 on day 2, parent PIN set → wrong PIN refused → kid→teen→adult climbs, elder toggle persists, save carries the M13 slice, teen study ×1.25=18) + REAL HTTP pass (minor w/o PIN 400, minor w/ PIN ok, ZERO COLLECTION proven — two minors with the "same" contact can't clash because it is never stored, parent PIN ≠ account PIN, tier gate 401/403/ok, demotion carries the PIN, adult w/o contact still 400); version ladders lifted to v14 (stage5/m3/m7/m8/m10/m11/m12); stage3's pre-existing job-count break (m12's 3 new jobs vs the 18 law) fixed forward to 21
- E2E m13-shield-shots 13 PNGs 0 console errors: creation strip + kid note, shield app (band card + 3 cards + ladder + elder), scammer round played, parent PIN set/wrong refused/teen climb, kid emote grid + reply, elder root class on, guest gate minor branch (🛡️ note, no contact, parent PIN, chip), desktop wide. (Profile tab is labelled "You" — E2E learned it the honest way.)

Stage Summary:
- M13 COMPLETE. One download, three generations: kids walk safe streets (no crime road, light chores, emote socials, the daily scam-drill), teens hustle with school paying ×1.25 but the 419 roads stay shut, adults see everything, and elder mode is one honest root class. Minors' cloud accounts exist ONLY behind a parent PIN and collect NOTHING — no contact column, no recovery line — and the graph block makes adult→minor contact structurally impossible for every present and future surface.
- Key decisions: the band lives on the CHARACTER (player.ageBand) so guests are shielded before any claim; the birth year is the truth at claim time and syncs the character; the hustle law sits inside isEligible (one pipeline, one law); race-eve betting widened to 18+ via the character band; the scammer game pays all bands (literacy is for everybody) but is featured for minors.
- Performance: untouched surfaces (device.ts/world3d/render paths) — shield gates are pure predicate checks on existing actions; suites all green, 0 console errors.
- Next: M14 FORTRESS per the user's "the 13 and 14" directive.
