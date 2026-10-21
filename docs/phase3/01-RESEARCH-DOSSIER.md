# LOKOJA LIFE — RESEARCH DOSSIER
### Phase 3 Prelude · Deliverable 1 of 10 · v1.0 · 2026-10-22
> **Authority.** This dossier is the **evidence index and adjudication record** for the Phase 3 Prelude
> World Research Swarm. It is subordinate to the bibles it feeds (`World_Bible.md` v2.2,
> `Art_Audio_Bible.md` v2.2, `Content_Bible.md`, `Experience_Bible.md`). Nothing here amends those
> books; everything here arms the ten deliverables in `docs/phase3/`.
>
> **Method.** 9 research teams (8 web-research + 1 visual-reference) worked independently under
> RULE ZERO; a Red Team then adversarially verified 26 high-stakes claims. Every claim in the team
> files carries ≥1 URL + date + confidence tag. Where sources conflict, the conflict is kept — this
> dossier adjudicates only what design required, and records the choice.

---

## PART 1 — THE EVIDENCE BASE (what exists and where)

| File | Team | Domain | Size | Status |
|---|---|---|---|---|
| `research/phase3/team-1-geography.md` | 1 | Terrain, confluence, hydrology, Patti, geology, vegetation, soil/dust, floods, seasons, sun clock | 266 lines | Complete |
| `research/phase3/team-2-architecture.md` | 2 | Built environment: 11 typologies, materials, colours, street furniture | 232 lines | Complete |
| `research/phase3/team-3-human-life.md` | 3 | Hour-by-hour life, routines, prayer/school/office/market rhythm, greetings | 343 lines | Complete |
| `research/phase3/team-4-transport.md` | 4 | Modes, fares, parks, curfews, road hierarchy, horn codes | 286 lines | Complete |
| `research/phase3/team-5-culture.md` | 4-way etymologies, history, festivals, foods (foods.ts verdicts), names, identity | — | 297 lines | Complete |
| `research/phase3/team-6-economy.md` | 6 | Wages, prices, rents, POS economy, anchor institutions, IGR | 378 lines | Complete |
| `research/phase3/team-7-audio.md` | 7 | Soundscape by hour, bird census, dB law frame, generator/power truth | 279 lines | Complete |
| `research/phase3/team-8-visual-ref.md` + `imgs/` | 8 | 14 image categories, 12 visually verified references with verdicts | 71 lines + 12 images | Complete |
| `research/phase3/team-9-2026-reality.md` | 9 | 2024-2026 developments, 22-project register, timeless-vs-recent split | 335 lines | Complete |
| `research/phase3/redteam.md` | RT | Adversarial verification of 26 claims + cross-team conflicts | — | Complete |
| `research/phase3/solar-output.txt` | lead | Reproducible solar geometry (`scripts/phase3/solar_lokoja.py`), API-cross-validated | — | Complete |

Tooling honesty (recorded by the teams themselves): the sandbox's WebSearch tool was unavailable to
most teams; they built curl pipelines (Bing/Google News RSS with `after:` recency filters, DDG HTML,
direct publisher fetches — `kogistate.gov.ng`, `nema.gov.ng`, `thefact.ng`, `dailypost.ng`,
`blueprint.ng` full-text fetchable; Punch/Guardian/Vanguard/LEADERSHIP/Channels 403-walled and cited
as dated RSS items). Blocked outlets are labelled in every registry. Wikipedia was 429-walled for two
teams; salvaged via cached snapshots and later re-verified live by the Red Team.

## PART 2 — RED TEAM VERDICTS (the quality gate)

**26 high-stakes claims: 23 SUPPORTED · 1 WEAK · 2 CONTRADICTED · 0 UNVERIFIABLE.**

### 2.1 Adjudications that change design (bound by this dossier)

| # | Question | Adjudication (canon for Phase 3) | Rationale |
|---|---|---|---|
| A1 | 2024 Kogi flood scale — "70+ communities" (Daily Trust, Kogi-scoped) vs "200 communities / 2M displaced" (The Watchers headline) | **70+ communities in Kogi** is the in-game truth; "200/2M" may appear only as Nigeria-wide radio context | Kogi-scoped government-sourced reporting beats an aggregator headline bundling a whole nation |
| A2 | Okoho soup as "the Igala signature dish" | **Ship okoho as a named regional delicacy (Idoma/Igala borderlands), never as "the" Igala dish** | Daily Trust 2024 attributes it to Idoma cuisine; DBpedia says only "Nigerian soup" |
| A3 | ₦650k Lokoja rent figure (THISDAY, with a "N650,0000" typo; Jiji header says "/month") | **Use directionally: rents roughly tripled 2024→2026**; do not canonise ₦650k/yr as an exact figure in-game | Single article + typo + unit conflict (Red Team verdict WEAK) |
| A4 | Founding date: 1857 (Wikipedia, live re-verified) vs 1860 (Britannica-adjacent styling, repo texts) | **Documented range 1857–1860**; NPC dialogue may carry the dispute; UI never states one year | Two real traditions; conflict preserved per RULE ZERO |
| A5 | 2006 LGA population: 195,261 (team-3) vs 196,988 (team-9) | **"≈196k (2006 census, transcription variance)"**; no verified 2025-26 city figure exists — population stays qualitative in-game | Same census, one-digit drift; honest gap recorded by both teams |
| A6 | Rain onset: March (FUL 2014) vs April (Kogi wiki) vs May (Lokoja wiki + field study) | **Onset window Apr–May with March possible** (bridge, don't pick); peak Jun–Sep universal | Three sources, one phenomenon; the game rolls onset inside the window |
| A7 | Confluence Regatta: in-game anchor mid-year vs real late-year 1-day Kabawa event (7th edition 2026) | **Re-skin venue to Kabawa Waterfront + "7th edition" numbering; keep the game anchor for play clarity** — recorded as a conscious, logged deviation (team-5 C5) | Play rhythm wins; the truth enters as dressing + questline ("Patriots seek government takeover") |
| A8 | Truck curfew 22:00–06:00 (Reps) vs 23:00–05:00 (state directive) | **23:00–05:00 canon** (actual Kogi directive, Jul 2025); Reps motion = political dialogue | State directive is the operative law |
| A9 | Nataco vs Natako spelling | **"Nataco"** in-game; variant noted | 2 of 3 press usages |
| A10 | "First capital of Nigeria" phrasing | **"Capital of the British Northern Protectorate (1900–)"** — the repo's existing phrasing (locations.ts:163) | Safest formulation; national-first framing is a live 3-way dispute (Blueprint vs repo vs Calabar claim) |
| A11 | Team-3 water-scarcity list included Adankolo | **Removed** — Daily Trust's list (Kabawa, Gadumo, Lokogoma, Ganaja) did not include it | Red Team transcription-drift catch |
| A12 | Generator dependence numbers (22M gensets/27% households vs 70.7% firms) | **Anchor audio/power truth on NBS 6.6 h/day grid supply; "22M" kept as context only** | Unit confusion; Red Team WEAK leg |

### 2.2 Claims verified hard (design can lean on these)
Sun clock reproduced to the second (sunrise-sunset.org + independent NOAA script); Mount Patti 458 m
+ Agbaja Ironstone cap over Lokoja-Fm sandstone (peer-reviewed, 7 DOIs in team-1 §2.5); Kogi wage
₦72,500 (state govt fetch); Greater Lokoja Water Works → Gamji, handover 2026-10-13, target Jan-2027
(official); NBS Feb-2026 fare anchors; pump ₦1,370–1,429/L Oct 2026; Adang et al. 2018 bird census
(108 species/43 families at Mount Patti, Kpata, Ganaja ferry, FUL, Lokongoma — the game's own
districts); NESREA 50/35 dB(A) residential day/night with 06:00–22:00 legal day (gazette parsed);
₦26,178 SBM Jollof Index pot (4 outlets).

## PART 3 — MASTER FACT SHEET (the one-screen Lokoja)

| Domain | Canon facts (each sourced in the team file cited) |
|---|---|
| Setting | Confluence city, Kogi State capital, ≈165 km SW of Abuja; 7.80°N 6.73°E; real OSM road fabric 750.4 km in-game |
| Land | Flat riverside city below Mount Patti (458 m, Agbaja ironstone cap over Cretaceous Lokoja-Fm sandstone — exposed at Felele Junction, Nataco-Banda, Koton-Karfe); laterite red soils; gully erosion documented (Felele) |
| Water | Niger + Benue meet at the city's edge; seasonal curve: low Dec–May, rise Jun, peak Sep–Oct, recede Oct–Nov (NIHSA alert pattern); viral two-colour confluence photo DEBUNKED — subtle tint seam only |
| Climate | Aw savanna; 1,000–1,300 mm rain, onset window Apr–May, peak Jun–Sep, ends Oct; dry Nov–Mar; harmattan = episodic multi-day dust haze (late Nov–mid Mar, weakening in recent years), 2–5 km visibility when deep; max ~37.9 °C falls Dec–Apr |
| Sun | Sunrise 06:17–06:41, sunset 18:21–18:52 all year (day 11h40m–12h35m); solar noon 12:25–12:41; near-zenith passes ≈Apr 11 & Sep 4; Dec noon elevation 58.8° |
| People | Multi-ethnic confluence city: Bassa-Nge, Oworo, Nupe indigenous + Hausa, Ebira, Igala, Igbo, Edo, Tiv, Okun-Yoruba; Hausa = street lingua franca, Pidgin the playful bridge; belonging = generations in town ("natives vs settlers"); median age ~18 |
| Rhythm | Fajr ~05:10–35 · offices 08–16 · Dhuhr ~12:20-36 · schools 07:30–14/15 · Asr ~15:45-16:35 · market peak 16:00–19:00 · Maghrib ~18:15-45 · Isha ~19:15-55 · Kpata market day every 5 days · Friday Jumu'ah surge · Sunday church morning |
| Money | Kogi minimum wage ₦72,500/mo (Oct 2024); food inflation ~19.6% y/y (Sep 2026); jollof pot ₦26,178; rents tripled since 2024; move-in = 1 yr upfront + 10% agency + caution (≈₦250k cash); petrol ₦1,370–1,429/L (Oct 2026); POS agents = the documented street economy (caps ₦100k/day personal cash-out); IGR ₦43.9bn (2025) |
| Transport | Okada/keke = street texture (NACTOMORAS union); truck curfew 23:00–05:00; Felele–Nataco–Koton-Karfe = the jam corridor; no mass-transit buses; Nataco Park = intercity loading; CNG kekes arrived (50, Sep 2025) but ONE station (Jun 2026); flood = canoe economy (fares ×2–2.5) |
| Sound | 108-species bird census at the game's own districts; 5 azan windows/day; generators are the metronome (6.6 h/day grid; ~monthly grid collapses); market peaks 17:00–19:00 at ~81–98 dB; NESREA night law from 22:00 |
| 2026 | Abuja-Lokoja highway in stop-go rehab + ember gridlock; Ultra-Modern Market (25 ha, Zone 8-Crusher) rising; water works under rehab (target Jan-2027); Zariagi airport announced + contract; CNG era began; 4PM worship shutdown order (Nov-25); floods recur 2024/25/26 |
| Symbols | "Patti" = Nupe for hill; Flora Shaw coined "Nigeria" from Patti (1897); first primary school in Northern Nigeria (1865) on Patti; 4-way name etymology dispute (ship as dialogue, not fact) |

## PART 4 — REPO TRUTH vs RESEARCH (deltas the bibles must close)

| # | Repo today | Research says | Deliverable that owns the fix |
|---|---|---|---|
| D1 | Game meals ₦220–700 (`config.ts:386-394`) | ≈2× too cheap vs 2026 food evidence | 10-Roadmap W5 (economy recalibration, MED confidence, uplift ×1.5–2.5) |
| D2 | Basic-room rent ≈₦10.7k/mo (`config.ts:170`) | Cheapest real room ≈₦20.8–25k/mo | 10-Roadmap W5 (P0 uplift + move-in cash rule) |
| D3 | `biz staffWagePerDay` ₦400 (`config.ts:798`) | ≈1/6 of the sourced minimum-wage day-rate | 10-Roadmap W5 (P1 → ₦1,200–2,500) |
| D4 | Rain boolean (`ambience.ts`) | Intensity-scaled rain + zinc law needed | 04-Audio S1 + 06-Weather |
| D5 | Regatta anchor mid-year, venue generic | Real: late-year, Kabawa Waterfront, 7th edition, private-run | 08-Culture (A7 adjudication) |
| D6 | Flora = 10 species, "savanna" instinct | Patti slopes are deep green (visual-verified m1); riverine palms hug water | 02-Environment (S7/S8) + 09-Asset-Roadmap |
| D7 | No truck curfew, no rush multipliers, no crisis surge | All three documented real | 05-NPC/Transport Part B |
| D8 | No water-scarcity or power-state texture | Both are daily 2026 realities (6.6 h/day; tanker queues) | 02-Environment / 04-Audio / 10-Roadmap |
| D9 | Harmattan treated as season-wide | Episodic multi-day haze events (NiMet), variable-year | 06-Weather |
| D10 | foods.ts dead dataset (10 dishes) | 8 KEEP / 2 FIX / 0 DELETE + 4-5 additions (okoho flagged A2) | 08-Culture §5 |

## PART 5 — WHAT REMAINS UNKNOWN (honest gaps, by team)

Cross-cutting: **no verified 2025-26 city population** (keep qualitative); **no Lokoja intra-city keke
fare datapoint 2025-26** (game keeps ₦300/3km, flagged); **no Lokoja-specific horn/conductor code
sources** (stays NIGERIA-GENERIC, labelled); **mosque/cathedral facade detail, Government House facade
pre-verified only via gov1.jpg**; **no Lokoja flyover exists or is announced — none may be invented**
(World_Bible Law W-1); school bell times, Kpata closing hour, FUL permanent-site status, Bukka plate
prices, stall-right prices, hotel naira rates, whole-house rents: all open (per-file lists in §6 of
each team file). These are research debts with named sources-to-try — not blockers for Phase 3.

## PART 6 — EVIDENCE STANDARDS FOR PHASE 3 (law carried forward)

1. A Phase 3 content claim enters a bible only with: source URL + date + confidence tag, OR repo anchor.
2. NIGERIA-GENERIC material must be labelled as such in the build (dialogue may use it; "encyclopaedia"
   UI copy may not present it as Lokoja-specific).
3. Conflicts ship as content (NPC disputes) or stay unresolved in this dossier — never silently won.
4. Prices age: every naira value in-game carries an implicit 2026 anchor and a Bible amendment path.
5. Images are reference-only under Art_Audio_Bible Law A-2 (zero shipped binaries).
