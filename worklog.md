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
