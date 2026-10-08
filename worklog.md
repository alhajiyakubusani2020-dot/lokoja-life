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
