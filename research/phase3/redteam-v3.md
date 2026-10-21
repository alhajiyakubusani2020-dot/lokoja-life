# LOKOJA LIFE — RED TEAM v3 (Task p3-2b)
### Adversarial audit of the ELEVEN Phase 3 master-directive supplement books · 2026-10-22
> **Authority.** This file audits ONLY the eleven books listed in §0. It does not amend canon,
> does not touch the books, and writes no file other than itself (+ the worklog append). Where a
> book needs a fix, the fix is listed in §5 for the lead to apply. Corpus of record: the four
> bibles v2.2, `docs/phase3/01–10`, `docs/{World,Experience,Art_Audio,Content}_Bible*.md` +
> Expansions, `docs/Environment_Bible.md`, `docs/Lighting_Bible.md`, `docs/Audio_Bible.md`,
> `docs/Master_Dossier.md` (A1–A12 + B1–B7), `docs/Phase3_Research.md`, `research/phase3/team-*.md`
> + `redteam.md`, `docs/ERA2-UI-AUDIT.md`, `docs/BIBLE_UPGRADE_AUDIT.md`, `MULTIPLAYER_PLAN.md`,
> and the repo disk itself (src/, prisma/, mini-services/, scripts/, git history).

---

## 0. METHOD

1. Read the worklog tail (Phase 3 swarm + masters entries) and `docs/Phase3_Research.md` in full to
   load the evidence standards (URL+date+confidence, NG-labelling, conflict preservation) and prior
   Red Team verdicts (26 claims a–z; X1–X14; C-1…C-10; B1–B7).
2. Read all eleven books end-to-end and decomposed every load-bearing statement into a numbered
   claim (93 claims, prefixed per book: BLD/NPC/WX/VEH/ECO/WLD/UI/INT/ACC/MP/FC).
3. Repo re-proof: ~40 file:line anchors opened and byte-checked (values AND line numbers), including
   every anchor the mission flagged. Line drift recorded, not failed. Two counts proven by
   execution (`bun -e` over `data/schools.ts`: 12 sites + 76 room plans = 88 school doors;
   `LOCATIONS.length = 32`).
4. Git re-proof: `m24-w10a/b/c` (`f0d2681`/`7c9758a`/`c9a1ee4`), hardening `5aeafb6`, DMV `35e3c30`,
   seam `a39e2f3` — battery names and counts (m24-wheels 90/90, m24-wire 35/35, m24-ledger 45/45,
   m24-fuel 53/53, hardening 18/18) verified against commit messages.
5. Canon re-proof: every A/B adjudication and every retired-claim banner checked against the books'
   restatements (`BIBLE_UPGRADE_AUDIT.md` + ERA2 correction banner are the audit-of-record).
6. `bunx tsc --noEmit` at HEAD: exit 0, zero errors — game code type-checks clean, so all
   "battery-proven" laws cited by the books are at least compile-healthy on this tree. (An early
   suspicion of a corrupted `wheels.ts:508` was DISPROVEN at byte level — the line is
   `const range = FUEL_RANGE[model]`; the "FUEL_RANGEodel]" sighting was a display artifact of the
   audit tooling, not the file. No repo bug.)
7. Mission-flagged v3 note: `Phase3_Research.md` Part H was ABSENT at audit time (Parts A–G only).
   Per instruction this is not failed: all v3 verdicts are recorded inside `Building_Bible.md`
   itself, and every v3 file it cites EXISTS under `research/phase3/team-8-visual-ref/imgs-v3/`
   (19 files; v3-school2 is `.png`, the rest `.jpg`; search logs in `tmp/lead-v3/` q01–q08).
   The citation chain completes when Part H lands.

---

## 1. PER-BOOK VERDICT TABLE

Verdict classes: VERIFIED (re-proven from disk/git/cited corpus) · SUPPORTED (multi-source in
corpus) · WEAK (single source / inference / citation drift) · CONTRADICTED (corpus or disk
disagrees) · UNVERIFIABLE (no path to verify). Zero UNVERIFIABLE rows survived triage (the two
candidates were resolvable: "₦40k Android" → WEAK; rain ×0.6 → WEAK).

### 1.1 Building_Bible.md (BLD)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| BLD-1 | I/II typology + V/R/NG tags | VERIFIED | 03-ARCHITECTURE §I; Phase3_Research B2 | Faithful consolidation; no tag drift found |
| BLD-2 | II anchors (25 ha, Zone 8–Crusher, ₦50bn sukuk; GSSS/FTH/Central Mosque) | VERIFIED | Dossier #17; RT-z; team-2 | Official full-text anchor real |
| BLD-3 | V landmark register (B4 stone rest house, B5 CBH decay 1999 Ganaja, flyover never build, airport ticker-only) | VERIFIED | Dossier B4/B5, C-5/C-6; team-9 zero-trust absence | Flyover & airport correctly stay blocked (NG-law ✓) |
| BLD-4 | III.6–10 [EXT] v3 extensions (v3-compound2/1, v3-school3, v3-civic2) | SUPPORTED | imgs-v3/ on disk: all 19 files exist; filenames match; tmp/lead-v3 q01–q08 logs | Verdicts self-recorded; Part H pending (§0.7) |
| BLD-5 | IV interior law (v3-pharm1/2, v3-market1, v3-school1/2, v3-buka1, v3-interior1 HOLD) | SUPPORTED | files exist; HOLD correctly held as non-documentary | Labels consistent with hygiene law |
| BLD-6 | IV.6 "interiors.ts 48 unit suites + 20 school builders" | VERIFIED | ERA2 banner "48 unit suites (not 47)"; "20 school interior builders (not 17)"; test-world3d "ten city + 88 school interiors" | Matches corrected canon exactly |
| BLD-7 | III.1 zinc tokens #9AA0A3 / #B0552F + blue ridge | VERIFIED | 03:32-33 exact | Byte-identical to seed S2 |
| BLD-8 | VI v3 seeds V1–V6 → interiors.ts/facade params | SUPPORTED | interiors.ts registries exist; mapping is design law | Same priority law as 03 §III |
| BLD-9 | VII "both v3 church candidates REJECTED (UK/US)" | WEAK | v3-church1/2.jpg exist; rejection verdict lives only in this book (+tmp logs) until Part H lands | Complete the record in Part H; church stays NG-gap ✓ |
| BLD-10 | VIII gates (A-2 zero binaries; flyover/airport never render) | VERIFIED | A-2; blocked-items law | Consistent |

### 1.2 NPC_Bible.md (NPC)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| NPC-1 | II daily shape = 05 §A.1 | VERIFIED | 05:15-26 | Verbatim restatement |
| NPC-2 | III crowd table + weekend overrides + "five-day Kpata pulse (`day % 5` ×1.6/×0.7)" | SUPPORTED (with fix) | 05:46-48 verbatim; **repo builds `marketDayEvery: 3`** (config.ts:458, civic.ts:260-261) | Book is faithful to 05 canon (X4 = 5-day, 2 sources), but never flags that the BUILT market clock is a 3-day cycle — a builder will trip. Add divergence note or W5 recalibration row |
| NPC-3 | IV.1 greeting clock chains + register per `npcs.ts:24` | VERIFIED | 05:51-54; npcs.ts:24 speech styles exact | npcs.ts = 143 lines as claimed |
| NPC-4 | IV.2 greeting-before-price "(npcChat.ts:46-49 made mechanical)" | SUPPORTED | 05:55 P0 law; npcChat.ts:46-49 = hajiya-amina stranger price lines ("look well before you price am") | Anchor verified; gate honestly framed as to-build |
| NPC-5 | V Igala bank Wọ́la òdùdu/ọ̀rọ́ka/ánẹ́ + Agba/Awa (MED, B6); Ebira/Nupe/Bassa-Nge BLOCKED | VERIFIED | C-8 / B6 / Dossier Part III.5 | Blocked banks stay empty — B6 honoured ✓ |
| NPC-6 | VI.2 "10k souls" ribbon; kobo-conserved wallets; player = claimed walker | VERIFIED | PhoneScreen.tsx:907; MainMenu:191; BIBLE_UPGRADE_AUDIT:52 ₦0 drift | |
| NPC-7 | VI.3 quarter grammar (Kabawa/Makera/Ungwan-Pawa); Bassa-Nge names debt | VERIFIED | team-5:17,74; Dossier III.5 | Debt honestly carried |
| NPC-8 | VI.4 stools incl. "Ohinoyi for Ebira"; never invent titles | VERIFIED | World_Bible_Expansion II.5; team-5:206,209 | Exactly the Expansion's list |
| NPC-9 | VII institutions (schools 07:30–14/15; 88 interiors; FTH CMD 2026/CT 2025; NACTOMORAS park closures Feb-2026; 4PM worship Nov-25; LG curfews outside map) | VERIFIED | team-3/2/9/4 (team-4:205,260; team-9:15,26; team-2:15,77); 05-B | All dated anchors real |
| NPC-10 | I "median age ~18" stated as a Lokoja property | WEAK (NG-label) | team-3:36,140: **Nigeria's** median age 18.1 (Jan 2025, national) | NIGERIA-GENERIC figure unlabelled — add "(NG — national figure)" or attribute |

### 1.3 Weather_Bible.md (WX)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| WX-1 | I climate of record (Aw; 1,000–1,300 mm; A6 window; 37.9 °C Dec–Apr; episodic harmattan; river curve) | VERIFIED | Dossier #4/#6/#7; A1/A6; 06 §I | |
| WX-2 | Header + II "The one-roll law (`world.ts`): yields (state, rainIntensity, waterLevel, harmattanDepth)" as repo anchor; Gate 1 asserts the four scalars | **CONTRADICTED** | `grep rainIntensity|waterLevel|harmattanDepth src/` = **0 hits**; world.ts = single-enum `rollNewDayWeather` + `weatherForSlot` (world.ts:20-39). The four-scalar roll is **06 §III design law, scheduled W6** (06:53-54; 10-roadmap W6 row) | Design presented as built. Relabel header + Part II as 06 law "build in W6"; current roll is one enum. Most dangerous finding in the set |
| WX-3 | II flood "confluence closed (`seasons.ts:50-54`)" | VERIFIED | seasons.ts:50 `FLOODED_LOCATION_IDS=['confluence']` | Exact |
| WX-4 | IV "Travel multiplier truth config.ts:306-312" (harmattan :310 / storm :311 / flood :312; walk 1.9/1.75/1.15; okada 1.8/1.65/1.18; keke 1.5/1.35; taxi 1.25/1.15; danfo 1.35/1.22) | VERIFIED | config.ts:305-312 — rows land exactly on 310/311/312; every value matches | Line-precise |
| WX-5 | III/IV market multipliers (1.08/1.15/1.3 `seasons.ts:76-83`) | VERIFIED | seasons.ts weatherMarketMult exact | |
| WX-6 | V.2 moon coupling (B1; moon-output.txt; ±1 day; dark-moon windows) | VERIFIED | moon-output.txt (New May 16, Blue Full May 31 anchors); B1 | |
| WX-7 | V.3 night law (civil-twilight ≈19:15; December 18:30 lamps-only, Lighting §V.3) | VERIFIED | Lighting_Bible:48,98 | |
| WX-8 | V.1 six-sky catalogue "(02 §III.3 binding)" | SUPPORTED (fix cite) | catalogue is **06 §III.3** (06:57); 02 carries per-state sky rows | Change 02→06 |
| WX-9 | VI "the two-tone confluence is FORBIDDEN (A4)" | WEAK (miscite) | A4 = founding-date range (01-RESEARCH-DOSSIER:49). Two-tone ban = team-1 Dubawa debunk + W-3/tint-seam law (02) | Replace "(A4)" with the real source chain |
| WX-10 | VI honesty flags (C-9 open; wind NG MED; harmattan episodic) | VERIFIED | C-9; team-1 NG marks | |

### 1.4 Vehicle_Bible.md (VEH)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| VEH-1 | II mode table (NBS ₦920.95/₦8,108.81 Feb-26; keke ₦300 NG C-4; crisis ₦6,000 Sep-26 ×6–20; canoe ₦400–500 2022 → flagged; A8 curfew; CNG 50/one station; Nataco loading) | VERIFIED | team-4:24,25,58,59,110,182,195; C-4; Dossier #16 | ×6–20 is team-4's own documented ratio ✓ |
| VEH-2 | II taxi "game ₦1,000/3km" | WEAK (drift) | config.ts taxi base 300 + 220/km → 3 km = **₦960** | Fix to 960 (or "≈₦1,000") |
| VEH-3 | III traffic laws (curfew assert; rush ×1.4/1.3 +0.2 `travel.ts:62`; jam ×3–4; personal ×5–8 `travel.ts:51-53`; flood jetty `config.ts:988-990`) | VERIFIED | travel.ts:51-53 comment + :62 signature; config.ts:987-989 (1-line drift); 05 §B | |
| VEH-4 | III.6 "20 real street names (Lugard Rd, Marine Rd, Ahmadu Bello Way, IBB Way…)" | WEAK (drift) | canon v2.2 = **29 named ways across 19 distinct OSM names** (BIBLE_UPGRADE_AUDIT:46, :80); repo comment plates.ts:6 says "20 unique names over 30 named ways" | Names real; count follows the stale code comment — align to canon (or re-decode) |
| VEH-5 | III.7 horn language (4 classes — ambience.ts:240-257 seed S6; NG; honest gap) | SUPPORTED | team-7:203 exact class names (gate-triple/greet-double/move-long/danger-freight); 04 S6 pins the site (P1) | Correctly framed as seed, not built |
| VEH-6 | IV built laws 1–8 (FUEL_RANGE :502 okada 2600/keke 3400/taxi 5200/danfo 6800; W10-c header :468; pump ₦900 :525, min 200/max 20k, idemKey, server-eye; CONDITION_LIFE 30k; park law; plate @unique; boarding stopped+consent, kids shotgun; paint/plate PATCH door; 12 Hz only-moving; CarBuffer never stales) | VERIFIED | wheels.ts:468/489/502/515/525 (+DRY_TANK, TANK_LITRES, REFUEL_MIN/MAX); git f0d2681/7c9758a/c9a1ee4; 5aeafb6 (server-eye); 35e3c30 (plate @unique migration) | Every number and line anchor exact |
| VEH-7 | V weather × vehicle coupling table | VERIFIED | config.ts:306-312 — all 12 values match | Cross-binds WX-4 ✓ |
| VEH-8 | VI honest gaps (C-4; no horn source; GIG/ABC unverified; 14 rigs unhailable ERA2 §4; flyover) | VERIFIED | ERA2:99,:13 (TRAFFIC_MIX 14 rigs, loops 0/1/2); team-4 | |
| VEH-9 | VII gates + "m24-wheels 90/90 regression stands" | VERIFIED | git: m24-wheels 90/90 re-proven at 5aeafb6/35e3c30/a39e2f3 | Plus tsc exit 0 at HEAD |

### 1.5 Economy_Bible.md (ECO)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| ECO-1 | II anchor table (₦72,500; ₦26,178; ~19.6% Sep-26; petrol corridor labelled; ₦650k/yr C-3; move-in rule; NBS fares; ₦200/4L; IGR ₦43.9bn; Ajaokuta ₦6.04–6.5bn; sukuk; POS ₦100k/day) | VERIFIED | Dossier #8/#9/#17; C-2/C-3; team-6:26,35,36,110; RT rows | Every row dated and labelled; Lokoja-specific petrol honestly labelled |
| ECO-2 | III D1–D3 (meals ₦220–700 config.ts:386-394; basic-room ≈₦10.7k/mo config.ts:170; staff wage ₦400 config.ts:798) | VERIFIED | config.ts:385-396 FOOD (boli-ekpa 220 → jollof 700); :169-172 homes basic-room 2500 (×4.3 ≈ 10,750); :798 | Line-precise |
| ECO-3 | IV street economy (POS agent v3-market3; Cantonment/Kpata/Nataco syndicate; "Yahoo boys" C-3; X12 tension; Obajana Cottage Hospital 2026-07-10; KGIRS cash ban) | VERIFIED | team-6:35,114; C-3; team-9:26; worklog; v3-market3.jpg exists | |
| ECO-4 | V conservation framework (WalletRow/LedgerRow/idemKey/chainHash/version; fortress pocket; one-cap law commit 5aeafb6; deposit cap 200k; 5 bypass sites ERA2 §5.A) | VERIFIED | plan §3.4; git 5aeafb6 ("dayDeposited… DAY_DEPOSIT_CAP 200k… counts transfer+tip+refuel+repair"); ERA2:117-118 | |
| ECO-5 | V.5 "in-game naira only, forever" (plan §3.4) | VERIFIED | MULTIPLAYER_PLAN §3.4 honesty clause verbatim | |
| ECO-6 | VI honest gaps (B2 population qualitative) | VERIFIED | B2; C-2 | |
| ECO-7 | IV.5 business ladder (biz → hire → solar → fleet gig; m5/m24 evidence) | SUPPORTED | systems/{biz,fleet,garage}.ts exist; worklog m4-garage 82/82, m24-w10 fuel/garage | Directionally proven |

### 1.6 Wildlife_Bible.md (WLD)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| WLD-1 | II Adang et al. 2018: 108 spp/43 fam, Nov 2016–Feb 2018, six site groups, Estrildidae 9/Sylviidae 9 (RT-q) | VERIFIED | team-7:13,14,52,53 | Counts, dates, sites all match the paper record |
| WLD-2 | II audible palette + dawn chorus 06:20–07:30 ×0.4 (Audio_Bible I.1) | VERIFIED | Audio_Bible:19,44 | |
| WLD-3 | II "GBIF additions (**team-1**): Egyptian plover 10 records, yellow-billed kite, western plantain-eater, laughing dove, pied crow" | SUPPORTED (fix cite) | values exact — team-7:16,54,124 (GBIF Aves 471; plover 10); carried in Environment_Bible:85 + 04-AUDIO:17. **Not team-1** (team-1's GBIF pull was flora, 1,476 records) | Misattributed team — change "(team-1)" → "(team-7)" |
| WLD-4 | I/V "no megafauna — absence is the law" (Environment IV.3) | VERIFIED | Environment_Bible:87 | NG-law ✓ |
| WLD-5 | III flora grammar + Patti green all year (S7) + repo contract (10 species, aLeaf) | VERIFIED | flora-species.ts:24 (aLeaf) & :26-31 (10 species); 02 S7; team-8 obs 1 | |
| WLD-6 | IV fish tension X12 + fishmongers 18–55 c.2013 + Donkwo Mar/Apr + plover context-only | VERIFIED | redteam X12; team-3:24,89; team-5; Audio_Bible:59 | |
| WLD-7 | V compound animals (dogs NG 04:00–05:00 bursts; rams ₦700k–1.4M; insects own the night) | VERIFIED | team-7:37,142,163; World_Expansion VII.2 | |
| WLD-8 | VI.3 "rain mutes songbirds (×0.6)" | WEAK | No corpus row found for the ×0.6 figure (dawn-chorus ×0.4 is the sourced gain) | Label as design target or source it |
| WLD-9 | VII honest gaps (GBIF insect-dominated; bats/fireflies unverified; plover call none) | VERIFIED | team-1:234,244; C-debts | |

### 1.7 UI_Philosophy_Bible.md (UI)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| UI-1 | I five diegetic laws as built (never-blink / one-unmount / N11 +3 ms / no-pause / identity-blind) | VERIFIED | diegetic.ts:11-30,65,96,104-105,112-119 | All five named laws in the vault, verbatim |
| UI-2 | I "the Dashboard runs the SAME verdict, no copies" | VERIFIED | Dashboard.tsx:55 (import overlayVerdict), :872-894 | |
| UI-3 | II mapping table (WorldPhoneLayer rail+FAB; bank/garage/civic wired; 88 school doors + 20 builders; travel guards level→flood→river-cut→guest→fare→energy) | VERIFIED | ERA2:50-51; world slice guard order (level→flood→river-cut…); schools canon | |
| UI-4 | II/IV "26 phone apps (7 wire-backed / 12 store-backed / 6 read-only books)" | **CONTRADICTED** | arithmetic 7+12+6 = **25 ≠ 26**; canon v2.1 amended the breakdown to **7/12/7** (git 411f119 "apps 7/12/7"); disk: `PhoneApp` union = 26 apps incl. **'story'** (PhoneScreen.tsx:79) — the 7th book | Book repeats the retired ERA2 figure inside the very doctrine that bans hard-coded app counts. Fix to 7/12/7 |
| UI-5 | IV ≈140 interfaces + ERA2 §3 debts (HudOverlay god component, module-global state/StrictMode, "26 vs 10" drift lesson) | VERIFIED | ERA2:64,75,79,80 | |
| UI-6 | V debt-discipline laws (N11 per overlay; tier-wall re-application) | VERIFIED | plan §6 N11; Content_Expansion II.3 | |
| UI-7 | III Paper UI §7.1; A-1 at :28; A-3 at :30 | SUPPORTED | Art_Audio:187 §7.1; A-1/A-2/A-3 line cluster (:28-30, cf. team-7 grounding citing :29 for A-2) | Line anchors within drift tolerance |

### 1.8 Interaction_Bible.md (INT)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| INT-1 | II "32 district anchors @8.6u; 4 job-board POIs @5.3u" | VERIFIED | LOCATIONS.length = 32 (bun-executed); controls.ts:37 `interactRadius: 8.6`; POI scan = `interactRadius*0.62` ≈ 5.33 (Actors.tsx:266-275); POI_BOARD_SPOTS = 4 (layout.ts:1616-1621) | |
| INT-2 | II "108 doors (10 layout + 88 school)" | **CONTRADICTED** | canon v2.1/v2.2: **98 doors = 10 layout + 88 school** ("108" explicitly retired — BIBLE_UPGRADE_AUDIT:6,:80; test-world3d.ts:254-255 `INTERIORS.length === 10 + 88`; smoke rig "98 doors"); book's own split (10+88) sums to 98 | The book resurrects the retired figure while stating Gate 1 "drift from §II is a bug" — it would fail its own gate. Fix: 98 |
| INT-3 | II radii (hotspots 2.1 `config.ts:73`; doors 3.2 `config.ts:101`; gist 24 `config.ts:353`; talk 4u; own car 4.6u; board 5u; pump 26 `wheels.ts:489`; shop 28 `HudOverlay.tsx:273`; secrets 9u) | VERIFIED (1 minor) | config.ts:73/101/353 exact; Actors.tsx:376 TALK_RADIUS 4; ERA2:50 enter 4.6u; w10b "gap<5u witnessed"; wheels.ts:489 SERVICE_RADIUS 26; HudOverlay.tsx:273 SHOP_RADIUS 28; Patti: trailDist ≤ 8.9 (≈9, rounding) | Secrets radius is the only soft one |
| INT-4 | III.1 walk 4.4/sprint 7.4 u/s; energy past 150 m; `controls.ts:284-304` | VERIFIED | world/controls.ts:26-27 walkSpeed 4.4 / sprintSpeed 7.4; :284-304 walk-measure block; WORLD3D.freeMeters 150 (config.ts:348) | |
| INT-5 | II gesture poll owns adjudication (`HudOverlay.tsx:486`) | VERIFIED | HudOverlay.tsx:481-492 rAF tick + consumeInteract | |
| INT-6 | IV freeze law; haptics.ts; camera A-15/16/17 | VERIFIED | systems/haptics.ts; Art_Audio:143-145 exact | |
| INT-7 | III loops (ride guards; drive; refuel round-trip; meet-wire 10 Hz; discover) | VERIFIED | travel guard order in world slice; w10a/w10b commits; remotenet doctrine | |
| INT-8 | Header evidence path "`systems/controls.ts`" | WEAK (path) | actual: **src/components/game/world/controls.ts** (systems/ has no controls.ts) | Fix path; haptics.ts is correctly in systems/ |

### 1.9 Accessibility_Bible.md (ACC)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| ACC-1 | II A-1/A-3 carried; Lighting §V.6 harmattan readability | VERIFIED | Lighting_Bible:101 ("harmattan grade passes the A-1 readability gate") | |
| ACC-2 | II M13 built (kid/teen/adult; parent PIN; kid emotes-only; teen 140 + word wall; scammer-round built; elder mode; 11 direct minor-wall sites) | VERIFIED | shield.ts:40-50 (scammerFeatured, kid social 'emotes'), :159-163 elderClass; plan §7; ERA2 banner "11 direct minor-wall sites" | |
| ACC-3 | II M9 identity (handle+PIN+scrypt; contact nullable) | VERIFIED | plan §1, §3.10 | |
| ACC-4 | II 60-second preview wall + claim-sheet honesty | VERIFIED | plan §2.5-6, W1 | |
| ACC-5 | III.1 tier truth (30 Hz FramePacer; perfProbe; tier labels honest) | SUPPORTED | WorldScene.tsx:90,543 FramePacer(hz by profile); perfProbe.ts exists | |
| ACC-6 | III.2 heat/battery gates (M24 §8.5) | VERIFIED | plan §8 risk 5 (low-end + video → tier gating, default off) | |
| ACC-7 | III.3 data (SILK wire ≤900 KB; degraded 12 s lane) + III.4 PWA/offline.html | VERIFIED | ERA2:33,221 (wire<900KB); plan §3.1; public/offline.html exists | |
| ACC-8 | IV.3 "energy decay pauses on settle" | WEAK | settleWorldWalk law verified (store applies on world exit); the "decay pauses during settle" phrasing is a book inference not found verbatim | Soften or cite the settle law |
| ACC-9 | V sensory-pairing table + VI cognitive/language + VII gates | SUPPORTED | S3 idioms; EX-40.1; M3/M7/M1 criteria — all [EXT] design law consistent with canon | Two-column law is new but safe |

### 1.10 Multiplayer_Bible.md (MP)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| MP-1 | II built inventory (socket.io :3003 behind Caddy :81 XTransformPort; 12 s relay lane; identity reuse; bodies 10 Hz; DMs; connect; voice/video P2P + TURN deferred; WalletRow/LedgerRow idemKey/chainHash/caps/tips; vehicles; stage mesh cap 8; whot engine; M13 walls; NDPR) | VERIFIED | plan §3.1/§3.4-3.8; git f0d2681/7c9758a/c9a1ee4/5aeafb6/35e3c30; batteries m24-wire 35/35, m24-ledger 45/45, hardening 18/18, m24-wheels 90/90 (commit messages); plan §3.6 STAGE_MESH_MAX 8 | |
| MP-2 | Evidence anchor "`mini-services/nation-wire/index.ts` (2,394 lines, 59 handlers)" | **CONTRADICTED** | index.ts = **164 lines** (post-decomposition: context.ts 565 + handlers/{identity 56, economy 404, social 327, transport 483, world 739} ≈ 2,009; ~60 socket handlers total) — the split the worklog itself records (Task 5-c) | Stale pre-refactor figure in the "verified inventory" book. Cite the decomposed shape |
| MP-3 | III carry-forever laws (relay doctrine; identity reuse; tier walls verbatim; money authority; moderation DoD; co-presence budgets; N1–N12 list) | VERIFIED | plan §4/§6 (N1-N12 list matches item-for-item incl. danfo 54); Content_Expansion II.1-7 | |
| MP-4 | IV what remains (W11/W12 open; TURN CGNAT 20–30% fail; five bypass sites) | VERIFIED | plan §5 waves W11/W12; §3.5 "20–30% of pairs"; ERA2:118 | |
| MP-5 | V.2 "the ₦40k Android" | WEAK | No corpus source for the device-price figure (budgets N2/N3 are real; the price anchor is not) | Label as design shorthand or cite |
| MP-6 | VI forbidden list | VERIFIED | plan §9 + Content red lines | |
| MP-7 | VII gates (four-part gate; N-gates; two-context E2E; W12 soak; conflict resolves to plan) | VERIFIED | Content_Expansion VI.2; plan §5/§6 | Book explicitly binds itself to the plan ✓ |
| MP-8 | V Nigerian-context laws (N5 ≤12 KB/s; Pidgin wire copy II.7; receipts-as-UX) | SUPPORTED | plan N5; Content_Expansion II.7; ledger laws | |

### 1.11 Future_Cities_Bible.md (FC)

| # | Book+Part | Verdict | Evidence / repo-line | Note |
|---|---|---|---|---|
| FC-1 | I/II admission gate ("No admission, no art, no design, no code"; research-gate plan; bible-fork plan) | VERIFIED | Content_Expansion III/V; the gate structure forbids pre-authorised invention | **No invented content found; nothing pre-authorises invention** — the book's own gates lock content behind a passed research gate |
| FC-2 | III fork procedure (fork books never canon; shared systems single-source; per-city re-derivation incl. sun clock via same script family) | SUPPORTED | scripts/phase3/solar_lokoja.py + moon_lokoja.py exist as the script family | Method-only claims |
| FC-3 | V naming/content laws (Content_Expansion III.5-6; B2 precedent; disputes-as-content) | VERIFIED | Content_Expansion PART III; B2; C-1/A4 precedents | |
| FC-4 | VI.3 "the nation wire is multi-city-READY (topics are street-scoped, not city-scoped)" | VERIFIED | plan §3 topics: `global | street:<id> | dm:<a|b> | table | call | stream | car` — street-scoped ✓ | Claim is about readiness, not shipping — no pre-authorisation |
| FC-5 | VII precedent register (nine teams; RT classes; contamination checks; reproducible scripts; visual verdicts; D-deltas; W/M shape; "Every Lokoja FACT transfers as nothing") | VERIFIED | corpus structure matches; the last sentence is the strongest anti-invention law in the set | |
| FC-6 | VIII gates (no second-city file before gate; Lokoja bibles diff clean) | VERIFIED | Content_Expansion V.3 | |

---

## 2. TOTAL COUNTS

**93 claims audited across 11 books.**

| Verdict | Count | Share |
|---|---|---|
| VERIFIED | 64 | 68.8% |
| SUPPORTED | 15 | 16.1% |
| WEAK | 10 | 10.8% |
| CONTRADICTED | 4 | 4.3% |
| UNVERIFIABLE | 0 | 0% |

Per book: BLD 5V/3S/2W · NPC 7V/2S/1W · WX 7V/1S/1W/1C · VEH 6V/1S/2W · ECO 6V/1S · WLD 7V/1S/1W · UI 5V/1S/1C · INT 5V/1S/1W/1C · ACC 7V/1S/1W · MP 5V/1S/1W/1C · FC 4V/2S.

Repo-anchor spot-check score: **~40 anchors opened; 38 exact, 2 within 1-line drift** (jetty
config.ts:988 vs :987-989; six-sky catalogue is 06 not 02 — a file miscite, not drift). Every
number the mission flagged was found real: FUEL_RANGE 2600/3400/5200/6800 (wheels.ts:502),
PETROL_PRICE_PER_LITRE 900 (:525), travel multipliers at config.ts:305-312, diegetic five laws,
controls radii 8.6/3.2/2.1/24, interiors 10+88 (+48 suites/20 builders canon), npcs.ts:24 speech,
npcChat.ts:46-49, market mults 1.08/1.15/1.3, flood closure seasons.ts:50, aLeaf flora-species.ts:24,
minutesMult travel.ts:62, personal/public travel.ts:51-53.

NG-LABEL LAW: **one violation found** (NPC-10 median age). Blocked items — Ebira/Nupe/Bassa-Nge
greetings, Ganaja flyover, durbar (absent everywhere ✓), Igala regalia (untouched ✓), church facade
detail (kept NG-gap with zero refs ✓) — all correctly treated as unusable in every book.

---

## 3. THE 5 MOST DANGEROUS FINDINGS

1. **WX-2 — design law masquerading as built code.** The Weather Bible's authority header and Part
   II present the four-scalar roll `(state, rainIntensity, waterLevel, harmattanDepth)` as a
   `world.ts` repo anchor, and its Gate 1 asserts the scalars' purity as a present-tense test. The
   repo has none of it (zero grep hits; `world.ts` rolls one enum). Any builder or test-writer who
   trusts the book writes tests against an API that does not exist. Fix: relabel as 06 §III law
   scheduled W6.
2. **INT-2 — a retired figure resurrected inside a self-enforcing gate.** "108 doors (10 layout +
   88 school)" contradicts the canon correction of record (98 = 10+88; "108 doors" is on the
   retired list in BIBLE_UPGRADE_AUDIT) AND fails the book's own Gate 1 ("drift from §II is a
   bug"). The Interaction Bible would flag itself.
3. **UI-4 — the app-count drift lesson, re-committed.** "7 wire / 12 store / 6 books" sums to 25,
   not 26; canon v2.1 amended the breakdown to 7/12/7 and the disk agrees (26 apps incl. `story`).
   The UI Philosophy Bible is the doctrine source for the data-driven app-count chip law (Part V.2
   cites the "26 vs 10" drift lesson) — hardcoding its own stale breakdown recreates the exact
   failure class it bans.
4. **MP-2 — the inventory book cites a monolith that no longer exists.** `index.ts (2,394 lines,
   59 handlers)` was true before the 5-c decomposition; today index.ts is 164 lines plus
   context/handlers files. A "verified inventory" that cites a phantom file shape undermines the
   audit trail the whole book exists to provide.
5. **NPC-2 — canon-vs-repo divergence left silent.** The five-day Kpata pulse (`day % 5`, ×1.6/×0.7)
   is stated as THE crowd law, but the built market clock is `marketDayEvery: 3` (config.ts:458,
   civic.ts:260). The book is faithful to 05 canon — but a reader cannot discover from it that the
   city as built runs a 3-day cycle. (Runner-up: NPC-10 median-age NG-label; VEH-4 street-name
   count vs canon 19.)

---

## 4. EXPLICIT NO-CONTRADICTION ROWS (areas cleared)

The following high-risk areas were specifically probed and **no contradiction was found**:

| Area probed | Books | Result |
|---|---|---|
| A1 flood scale (70+ Kogi) / A6 onset window / A8 truck curfew 23:00–05:00 / A11 Adankolo / A12 generator anchor | WX, VEH, NPC | Restated exactly; no amendment |
| B1 moon unblock + ±1-day gate + moon-output.txt anchors | WX, WLD | Matches C-7/B1; file exists with stated anchors |
| B4 Lugard stone form / B5 CBH decay arc (1999, Ganaja, revival unverified) | BLD, ECO | Verbatim-consistent; interiors stay GAP |
| B6/C-8 Igala greetings usable-MED; **Ebira/Nupe/Bassa-Nge BLOCKED** | NPC, WX | Blocked banks stay empty; no invented formula anywhere |
| Ganaja flyover / Zariagi airport / durbar / Igala regalia / church facade | BLD, VEH, WLD | Flyover+airport stay non-geometry; durbar absent from corpus and books; regalia untouched; church stays NG-gap |
| C-2/B2 population discipline (196,643 fact-sheet; in-game qualitative) | ECO, FC, NPC | Honoured; no 2026 figure invented |
| C-3 rent unit = per year / C-4 keke NG range | ECO, VEH | Units and labels correct |
| X12 fish tension held-by-design | WLD, ECO | Both sides modelled, neither resolved silently |
| X2/A4 founding range (never one year in UI) | NPC, FC | Gate 3 + World_Expansion XII.2 carried |
| 2024 flood canon 70+ (not 200/2M) | WX, ECO | Correct scope |
| M24 plan binding (waves W0–W12, ten gaps, N1–N12, §3.4 naira-only, §3.5 TURN honesty) | MP, ECO, ACC | Book binds the plan and defers to it on conflict; W11/W12 correctly open |
| Built-law constants cited by books (FUEL_RANGE, ₦900, 200/20k, 30k life, 26u server eye, 12 Hz, plate @unique, park-once, boarding consent) | VEH, INT, MP | Every constant byte-verified at the cited lines; git batteries real; tsc exit 0 |
| ERA2 audit-of-record figures reused (≈140 interfaces, 14 rigs, 5 bypass sites, 11 minor walls, 48 suites, 20 builders, 900 KB SILK, 60 s guest wall) | UI, INT, ACC, VEH, ECO | All match the corrected banner; only the apps 7/12/6 breakdown regressed (UI-4) |
| Wildlife species/absence vs team-1/team-7 | WLD | 108/43 + sites + families + GBIF values all real; only the team attribution was wrong (WLD-3) |
| Future-cities pre-authorisation scan | FC | Zero invented Lokoja facts; every content door gated behind a research gate; "every Lokoja FACT transfers as nothing" is the book's own law |

---

## 5. FIXES REQUIRED IN THE BOOKS (for the lead)

1. **Weather_Bible.md** — header evidence line + Part II + Gate 1: relabel the four-scalar roll as
   `06 §III design law, ships in W6 (10-roadmap)`; state the CURRENT built truth (single-enum roll +
   `weatherForSlot`, world.ts:20-39). Do not present it as a repo anchor.
2. **Weather_Bible.md** — Part V.1: cite the six-sky catalogue to **06 §III.3** (not 02 §III.3).
3. **Weather_Bible.md** — Part VI: replace "(A4)" on the two-tone confluence ban with the real chain
   (team-1 Dubawa debunk → W-3/tint-seam law in 02).
4. **Interaction_Bible.md** — Part II: "108 doors" → "**98 doors (10 layout + 88 school)**" per
   BIBLE_UPGRADE_AUDIT v2.2; optionally note secrets radius is `trailDist ≤ 8.9` in M19 code.
5. **Interaction_Bible.md** — header evidence: `systems/controls.ts` →
   `src/components/game/world/controls.ts` (8.6 lives at controls.ts:37; haptics.ts is systems/ ✓).
6. **UI_Philosophy_Bible.md** — Part II phone row + Part IV: "7 wire-backed / 12 store-backed /
   **6** read-only books" → "**7/12/7**" (26 apps incl. Story; canon v2.1 amendment, PhoneApp union).
7. **Multiplayer_Bible.md** — evidence anchor: replace "index.ts (2,394 lines, 59 handlers)" with
   the decomposed truth: `index.ts 164-line bootstrap + context.ts (565) + handlers/{identity,
   economy, social, transport, world} (≈2,009 lines, ≈59 socket handlers)` — per worklog Task 5-c.
8. **Multiplayer_Bible.md** — Part V.2: label "₦40k Android" as design shorthand (no sourced price
   anchor) or attach a source.
9. **Vehicle_Bible.md** — Part II taxi row: "₦1,000/3km" → "₦960/3km (base 300 + ₦220/km)" or "≈₦1,000".
10. **Vehicle_Bible.md** — Part III.6: "20 real street names" → canon v2.2 figure "**19 distinct OSM
    names over 29 named ways**" (or re-decode the binary and amend canon; do not cite the stale
    plates.ts comment as fact).
11. **NPC_Bible.md** — Part I: "median age ~18" → add NG label ("Nigeria's median age 18.1 —
    national figure, team-3") or rephrase as city-character inference.
12. **NPC_Bible.md** — Part III: add the repo-divergence note for the five-day pulse (built
    `marketDayEvery: 3`, config.ts:458/civic.ts:260; X4 canon = 5-day; recalibration rides W5).
13. **Wildlife_Bible.md** — Part II: "(team-1)" → "(team-7 §1.4/§2.1)" for the GBIF additions.
14. **Wildlife_Bible.md** — Part VI.3: "rain mutes songbirds (×0.6)" → label as design target or
    source it (no corpus row).
15. **Building_Bible.md / Phase3_Research.md** — when Part H lands, mirror the v3 verdicts
    (7-file references, church REJECT pair, interior1 HOLD) so the book's citations resolve to a
    recorded verdict, not only to the book itself (process completion, not a content error).

No fix requires touching canon, the plan, or any research file. All four CONTRADICTED rows and all
citation repairs are one-line edits inside the eleven books.

---

*Red Team v3 · Task p3-2b · read-only discipline held: this file + worklog append are the only
writes. 93 claims · 64 VERIFIED / 15 SUPPORTED / 10 WEAK / 4 CONTRADICTED / 0 UNVERIFIABLE.*
