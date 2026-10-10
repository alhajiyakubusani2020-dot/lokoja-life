# -*- coding: utf-8 -*-
"""Report content part C: Chapters 6-8 + Appendix A (Gap Analysis, Roadmap, Final Answer, Sources)."""

C = []

# ============================ CHAPTER 6 ============================
C.append(("h1", "Deliverable 5 - Gap Analysis: the Ten Most Important Improvements"))

C.append(("body",
 "Ten candidate improvements were ranked by four criteria: player impact (how many players feel it, how soon), "
 "implementation cost against our current architecture, risk of breaking working systems, and strategic value "
 "(whether it builds a moat Lagos Life cannot cheaply copy). Cost is expressed in units of focused work on our "
 "existing stack - S is roughly one to three days, M is one to two weeks, L is three to six weeks - since our "
 "architecture's readiness changes each estimate materially. The ranking deliberately front-loads presentation "
 "and first-session work, because the evidence says that is where we are losing players, and it protects the "
 "engineered core, because that is where we are winning."))

C.append(("table", {
 "caption": "Table 6.1 - Top ten improvements, ranked",
 "widths": [0.05, 0.30, 0.13, 0.10, 0.14, 0.28],
 "header": ["#", "Improvement", "Impact", "Cost", "Risk", "Strategic value"],
 "rows": [
  ["1", "First-session story pass: identity moment, guided first tasks, first-paycheck beat", "Very high", "M", "Low", "Directly attacks the five-minute drop-off the feedback represents"],
  ["2", "Aliveness layer: live-feel ticker, daily Lokoja event, ambient world activity", "Very high", "M", "Low", "Cheap, honest single-player analogue of their social proof"],
  ["3", "Phone v1: Jobs, Messages, Map and Status as one in-world shell", "High", "L", "Medium", "Unifies existing systems; NPC chat with memory is our moat"],
  ["4", "Content art bar: replace emoji squares with consistent illustrated or 3D props", "High", "M", "Low", "Removes the single most visible tell of unpolish"],
  ["5", "Venue activities: 8-12 named, cultural, mechanical activities per location", "High", "M", "Low", "Turns 10 correct locations into 10 places worth visiting"],
  ["6", "Menu-to-world continuity: menu shows the living world behind the wordmark", "Medium", "S", "Low", "Fixes the first-screen impression at trivial cost"],
  ["7", "Motion and transition pass: screen transitions, skeletons, press feedback", "Medium", "S", "Low", "Perceived-quality multiplier across every screen"],
  ["8", "Home interior and Saturday rent: a furnished room the player owns", "High", "L", "Medium", "Gives money a sink and homecoming a feeling; rent cycle adds cadence"],
  ["9", "NPC routines and memory made visible", "High", "M", "Medium", "Our differentiator; no browser competitor has NPC memory"],
  ["10", "Signature vistas: Mount Patti sunrise and confluence moments as composed scenes", "Medium", "S", "Low", "Identity only Lokoja can claim; screenshot bait"],
 ]}))

C.append(("h2", "Why these ten, in detail"))
C.append(("body",
 "1 through 3 form the response to the actual complaint. The first-session pass converts our character form "
 "into a story with an identity beat of equivalent memorability to the birth lottery, then uses task cards "
 "with destination affordances - the pattern their Eat something card proves - to remove every silent moment "
 "from the first five minutes. The aliveness layer is the honest single-player translation of their social "
 "proof: a Lokoja news ticker driven by the one world clock, a daily server-independent event with a shared "
 "counter, and crowds that thicken with the time of day. The phone is the largest item and the most strategic, "
 "because our data layer was explicitly built phone-ready: offers are typed with source fields, NPCs are a "
 "registry with homes and speech styles, and the UI kit already contains the sheet chrome a phone app needs."))
C.append(("body",
 "4 through 7 are the presentation multiplier. Replacing emoji-as-art with a consistent illustrated set "
 "(or instanced 3D props for street objects) removes the mixed art bar our own audit flagged as the biggest "
 "single tell. Venue activities give every pin on the map something to do - their Library sheet, with ten "
 "named activities and five transport prices, is the exact shape we should match and then exceed with "
 "location-specific mechanics like Patti hikes and riverside fishing. The menu continuity and motion passes "
 "are small, low-risk changes with outsized perceived effect, precisely because our token system and kit "
 "make them systematic rather than bespoke."))
C.append(("body",
 "8 through 10 build the parts of the game only we can claim. A home interior with Saturday rent gives the "
 "economy a heartbeat and the player a private space; our locations already carry home as a stable ID, and "
 "the terrain and building registries can anchor an interior without touching the save schema beyond new "
 "fields. Visible NPC routines and memory - Musa at the junction remembering your last carry, Hajiya Amina "
 "paying better on market day - convert our existing silent registries into the feature nobody else in this "
 "genre has shipped in a browser. And the vista work costs almost nothing because the world already exists: "
 "it is camera choreography and a postcard moment, and it is the screenshot that answers Lagos Life on its "
 "own terms."))

# ============================ CHAPTER 7 ============================
C.append(("h1", "Deliverable 6 - Recommended Roadmap"))

C.append(("body",
 "Five stages, ordered by dependency and evidence, each with the specific files it touches, the evidence that "
 "motivates it, and how we will know it worked. Nothing here rewrites working systems; every stage composes "
 "existing primitives. The roadmap deliberately does not include multiplayer, real-money currency, or an ads "
 "platform - chasing those would abandon our advantages for someone else's game, and chapter 8 explains why."))

C.append(("h2", "Stage R1 - Raise the visual bar to premium (1-2 weeks)"))
C.append(("body",
 "Motivation: chapter 4's finding that our craft is coherent but quiet, and their screens feel alive. Work: "
 "menu-to-world continuity (render the 3D world or an animated scene behind the menu); screen transition "
 "system beyond the current three keyframes; replace emoji content art with a consistent illustrated set "
 "beginning with locations and jobs; MapScreen and WorkScreen density passes to remove empty regions; "
 "NeedsBar colours moved onto tokens. Files: MainMenu.tsx, SceneBackdrop.tsx, globals.css, ui/icons.tsx, "
 "MapScreen.tsx, WorkScreen.tsx, NeedsBar.tsx, Dashboard.tsx; new ui/illustrations set. Guardrails: no store, "
 "data or save changes; 136 checks must stay green. Success measures: side-by-side screenshots at 360, 390 "
 "and 1280 px no longer read as older in a blind comparison of any single screen; zero emoji rendered as "
 "UI art; every screen transition animated under 250 ms."))

C.append(("h2", "Stage R2 - First-session story pass (2-3 weeks, overlaps R1 tail)"))
C.append(("body",
 "Motivation: their five-step wizard ends in a room with a task in under five minutes; our creation is a form "
 "and our first minute is silent. Work: restructure creation into 3-4 guided steps with a named identity beat "
 "(a Lokoja welcome moment with the same memorability as the birth lottery - for example a starting hustle "
 "story that grants an honest starting bonus and a first contact); add a first-session task rail using the "
 "task-card pattern with destination deep-links we already have; ensure the first naira is earned within "
 "three minutes on default paths. Files: CharacterCreation.tsx, new systems/onboarding.ts (pure, testable), "
 "config.ts STARTING block, store boot path, Dashboard task cards. Guardrails: startNewGame contract and save "
 "v2 schema unchanged; onboarding is pure functions over existing state. Success measures: new-save players "
 "reach first payout inside 180 seconds; D0 task completion measurable in stats; no regression in the 48 "
 "economy tests."))

C.append(("h2", "Stage R3 - Phone v1: one shell for Jobs, Messages, Map, Status (3-4 weeks)"))
C.append(("body",
 "Motivation: their phone is the retention engine; our architecture was built phone-ready and the audit "
 "confirms the seams. Work: a PhoneShell overlay (not a rewrite of BottomNav) hosting four apps that wrap "
 "existing screens as panels: Jobs (WorkScreen content), Messages (new NPC chat over the opportunity system - "
 "offers arrive as messages from NPC registries with source phone), Map (MapScreen), and My Status "
 "(StatusPanel); notification badges reuse the existing has-opportunities selector. Files: new "
 "components/game/phone/*, WorkScreen refactor into panels, npcs.ts (message templates), opportunities.ts "
 "(source already supports phone), store selectors. Guardrails: opportunity eligibility, cooldowns and ledger "
 "untouched; the same data must render in both the old tab layout and the phone during migration. Success "
 "measures: share of offers accepted via Messages in analytics events; session length delta; zero change in "
 "payout maths across both surfaces."))

C.append(("h2", "Stage R4 - World aliveness and venue activities (4-6 weeks)"))
C.append(("body",
 "Motivation: their world demonstrates itself everywhere; ours needs reasons to be in it. Work: a Lokoja "
 "ticker and daily event driven by the one world clock (no second time system); 8-12 named activities per "
 "location wired to real mechanics - eat at Food Strip via the existing foods data, carry fabric at Kpata via "
 "hustles, hike Patti with an energy-and-view reward, fish the confluence; NPC routines surfaced (schedule "
 "tables per NPC home and workplace) and a memory layer for greetings that reference past interactions. "
 "Files: world.ts (event roll on the existing clock), new data/activities.ts, LocationSheet.tsx, Life.tsx "
 "idler positions, npcs.ts routines, store interactions. Guardrails: all outcomes flow through giveReward "
 "and the ledger; activity rewards are config-tuned. Success measures: interactions per session up; venue "
 "sheets show zero coming-soon chips for launched locations; every activity outcome deterministic under the "
 "seeded RNG used by tests."))

C.append(("h2", "Stage R5 - Home, ownership and signature moments (6-10 weeks)"))
C.append(("body",
 "Motivation: rent Saturdays give their economy cadence; our player has money with nothing permanent to buy. "
 "Work: a furnished home interior anchored to the existing home location (room scene with interactive props: "
 "cooler, stove, bed wired to needs actions); a Saturday rent cycle as a config-driven ledger event with "
 "consequences; furniture purchases as cash sinks; then the differentiators - Mount Patti sunrise vista "
 "moment, confluence festival day, and business ownership (kiosk upgrades) built on the existing building "
 "registry positions. Files: new HomeInterior.tsx, progression or new systems/ownership.ts, config ECONOMY "
 "rent block, Life.tsx interactive props, CameraRig vista choreography. Guardrails: save v2 fields added "
 "additively with migration defaults; no existing ID changes. Success measures: rent cycle executes on the "
 "shared clock with ledger entries; furniture spend visible in stats; the Patti vista produces a screenshot "
 "we would publish."))

C.append(("table", {
 "caption": "Table 7.1 - Roadmap summary and dependency order",
 "widths": [0.14, 0.30, 0.28, 0.28],
 "header": ["Stage", "Theme", "Primary evidence answered", "Exit criterion"],
 "rows": [
  ["R1", "Premium visual bar", "Chapter 4 screenshot gaps", "Blind single-screen comparison no longer reads older"],
  ["R2", "First-session story", "5-minute experience gap (4.1-4.3)", "First payout within 3 minutes on default path"],
  ["R3", "Phone v1", "Phone and social gap (4.6)", "Offers accepted through Messages without payout drift"],
  ["R4", "Aliveness and activities", "Live-layer gap (4.3, 4.4)", "Zero coming-soon chips at launched locations"],
  ["R5", "Home, ownership, vistas", "Housing and identity gaps (Table 5.1)", "Rent cycle live; publishable Patti vista"],
 ]}))

# ============================ CHAPTER 8 ============================
C.append(("h1", "The Final Question Answered"))

C.append(("body",
 "The question: if a new player opens Lagos Life and Lokoja Life today, why might they prefer Lagos Life, and "
 "what are the five highest-impact things we should change to make them choose Lokoja Life instead? The honest "
 "answer has three layers. In the first sixty seconds, Lagos Life feels alive and ours feels quiet: their "
 "landing screen is a city full of real people with live counters, our landing screen is a poster; their "
 "creation flow is a story with suspense, ours is a form. In the first session, theirs hands the player a "
 "furnished home, a phone, a job and a named next action within about four minutes, while ours drops the "
 "player into a beautiful but under-explained world where the strongest early option is reading a noticeboard. "
 "And across days, their reason to return is other people - chat, elections, shared events, visible player "
 "homes - where ours currently has none, because the systems that would carry it are built but unexposed. "
 "None of these are engine gaps. All three are presentation, pacing and exposure gaps over an engineered core "
 "that is, by the measures we can verify, ahead of theirs."))

C.append(("body",
 "The uncomfortable findings, stated without cushioning. First, our UI modernisation pass succeeded on its own "
 "terms - tokens, icons, consistency - and still loses the comparison, because consistency is not the axis "
 "players judge; aliveness and density of meaning are. Second, our most technically impressive strength, the "
 "walkable 3D world, is at first touch our least impressive screen: sparse at rest, without street-level "
 "interactions or a task layer, it under-delivers relative to its ambition. Third, the competitor ships daily "
 "in public with monetisation from day one; we ship in disciplined stages - right for systems, but it means "
 "every week we wait, their lead in perceived momentum compounds. Fourth, their social layer is a genuine "
 "moat we cannot and should not fake; pretending single-player notifications are friends would be worse than "
 "silence. Our answer must be a different moat: the world, the NPCs, the culture of Kogi state, and honest "
 "simulation depth."))

C.append(("h2", "The five highest-impact changes"))
C.append(("num", [
 "Make the first five minutes a story: guided creation steps with one memorable identity beat, then task "
 "cards with destinations so the first naira is earned inside three minutes (Stage R2).",
 "Build the aliveness layer: a Lokoja news ticker, a daily shared event with a visible counter, time-of-day "
 "crowd rhythms - the honest single-player equivalent of their social proof (Stage R4, first slice).",
 "Ship Phone v1: Jobs, Messages from NPCs with memory, Map and Status in one shell over the existing "
 "opportunity system - the retention surface they proved, implemented our way (Stage R3).",
 "Raise the content art bar: replace every emoji-as-art surface with consistent illustration and give the "
 "3D world street-level interactive props, so the craft matches the engineering (Stage R1 plus R4 props).",
 "Claim the identity only we can claim: Mount Patti and the confluence as composed signature moments, "
 "NPC routines and memory made visible, and a home with a Saturday rent heartbeat - Lokoja, not Lagos-lite "
 "(Stage R5).",
]))

C.append(("h2", "What we deliberately will not build"))
C.append(("body",
 "Multiplayer servers, real-money currency, withdrawals and a self-serve ad platform are out of scope for the "
 "coming stages. Multiplayer is a company-scale operational burden the competitor is still learning to carry - "
 "economy floods, resets, moderation, device fingerprinting per its own Terms - and it would abandon our "
 "advantage in verified, deterministic quality. Real-money naira would import regulatory and trust obligations "
 "our fictional ledger should never touch. This is not timidity; it is choosing the game we can be best in "
 "the world at: the most alive, most honest, most deeply Nigerian single-player life sim in a browser, set "
 "in a city whose name literally means the confluence - where two rivers meet and make something stronger."))

# ============================ APPENDIX ============================
C.append(("h1", "Appendix A - Source Register"))

C.append(("body",
 "All sources were accessed on 10 October 2026 from within this session unless noted. Player-facing statistics "
 "and revenue figures are self-reported by the developer unless the row says otherwise. Screenshots referenced "
 "in chapter 4 are stored under research/screenshots in the repository."))

C.append(("table", {
 "compact": True,
 "caption": "Table A.1 - Sources consulted, with role in this report",
 "widths": [0.06, 0.30, 0.42, 0.22],
 "header": ["#", "Source", "URL", "Used for"],
 "rows": [
  ["A1", "Lagos Life official site", "https://lagoslife.app/", "Landing UI, venue list, live counters, cookie policy"],
  ["A2", "Official live stats", "https://lagoslife.app/stats", "Player/visit counters, creator attribution"],
  ["A3", "Terms of Use", "https://lagoslife.app/terms", "Accounts, Game Naira rules, ads products, moderation, 18+"],
  ["A4", "Game and Brand Disclaimer", "https://lagoslife.app/disclaimer", "Fictionalisation, brands, institutions, no endorsement"],
  ["A5", "Google Play listing", "https://play.google.com/store/apps/details?id=com.greatcallie.lagoslife", "Android wrapper, six needs, multi-city, GreatCallie"],
  ["A6", "Vanguard explainer", "https://www.vanguardngr.com/2026/10/lagos-life-game-crosses-2-million-users-heres-how-to-play", "2M players, city expansion, how-to-play (6-7 Oct)"],
  ["A7", "Techpoint valuation", "https://techpoint.africa/news/lagos-life-10m-valuation", "Funding, infra costs, revenue streams, economy admits (9 Oct)"],
  ["A8", "TechCabal funding note", "https://techcabal.com (Lagos Life maker Vatar raises $500,000)", "Five revenue streams, 4.3M players (8-9 Oct)"],
  ["A9", "TechBrief billboards", "https://techbrief.africa/lagos-life-virtual-billboard-advertising", "Ad pricing, 38 percent tap-through, risks (6 Oct)"],
  ["A10", "Technext history", "https://technext24.com/reviews/lagos-life-5-lagos-themed-games-ai", "Launch curve, Nigerian gaming history, AI-built (7 Oct)"],
  ["A11", "Fan wiki (independent)", "https://lagoslifeguide.com/", "Onboarding data, careers, rents, birth lottery, FAQ"],
  ["A12", "Fosudo interview", "YouTube, Fisayo Fosudo channel (7 Oct 2026, via press reports)", "Founder claims, valuation quote, apps plan"],
  ["A13", "Arise TV segment", "https://www.arise.tv (How Lagos Life is capturing young Nigerians)", "Independent player-count anchor, cultural framing"],
  ["A14", "Nairaland thread", "https://www.nairaland.com (Lagos Life hype thread, 6 Oct)", "Community discussion surface"],
  ["A15", "TikTok tutorials", "https://www.tiktok.com/discover (4-5 Oct 2026)", "Install behaviour, audience hand-holding"],
  ["A16", "Lagos Life live session", "lagoslife.app via research account lokoresearch01 (10 Oct 2026)", "All chapter 4 observations and screenshots"],
  ["A17", "Lokoja Life repository audit", "/home/z/my-project (worklog Task 5-a)", "Our component inventory, styling census, test counts"],
  ["A18", "Lokoja Life test suite", "scripts/test-travel|stage3|stage35|stage36 (bun)", "136 passing checks verified during this audit"],
  ["A19", "Lokoja Life screenshots", "research/screenshots/ours/ (10 Oct 2026)", "Chapter 4 comparison panels"],
  ["A20", "Worklog Tasks 1-6", "/home/z/my-project/worklog.md", "Stage 1-3.6 and UI-pass history, architecture facts"],
 ]}))
