# Team 2 — Architecture · raw evidence base (Phase 3 Prelude)

Agent: Team 2 (ARCHITECTURE) · Date: 2026-10-22 · Mode: research-only (no src/docs touched, no builds)
Method note (honest tooling record): no WebSearch tool in this sandbox; DDG-HTML was captcha-walled this session (team-6/7 saw it pass; I did not), Bing web scrape JS-walled, Bing News RSS + Google News RSS (NG edition) + direct publisher fetches worked. ~18 search queries, ~10 page fetch attempts (4 full-text successes: 2× kogistate.gov.ng, 1× dailypost.ng, 1× kogistate.gov.ng 404). Wikipedia API returned HTTP 429 twice — Wikipedia background claims are therefore NOT used as load-bearing. Headline-only items are cited as verified GNews/BNews RSS items (publisher + headline + date) with MED/LOW confidence — never as fetched text.
Repo grounding: worklog.md:2781-2841 (sibling swarm context), docs/World_Bible.md:1-120, docs/Art_Audio_Bible.md:12,29 (Law A-2), src/game/world3d/layout.ts:1-100+1492, src/game/world3d/props.ts:1-60, src/game/data/locations.ts:49-260.

## 1. Executive Findings

1. Lokoja's architectural identity is dominated by the **Ultra-Modern Market**: a 25 ha, open trading spaces + lock-up shops + market halls + tech hub + warehouse complex, consolidating **seven existing markets** — the single largest documented building programme in the launch city. [src 1] [src 2] (HIGH)
2. The Kogi State Government issues **explicit drainage-dimension directives** on the market build ("specifying correct drainage dimensions", enlarging one high-water-volume point near the warehouse) — drainage is a live design conversation in Lokoja, not a generic detail. [src 2] (HIGH)
3. The replaced market, International Market at **Nataco**, is documented as "buckling under the pressure of a growing capital city, congesting major routes" — the old-market-chaos ↔ new-market-order arc is Lokoja-verified. [src 1] (HIGH)
4. Colonial memory concentrates on **Mount Patti**: Lord Lugard's rest house (in-game as a secret, repo:docs/World_Bible.md:75-82), the old European cemetery, and the colonial quarter — all on the state's own tourism-development list. [src 4] [src 6] [src 7] (HIGH existence, MED condition)
5. Lokoja is promoted as "the **first capital** of Nigeria" (Blueprint 2026-05-01) while the game's own location text says "capital of the **Northern Protectorate**" (repo:src/game/data/locations.ts:163) and national media still debate **Calabar's** claim (Pulse 2023-04-28) — a three-way narrative conflict, recorded in §4. [src 8] [src 9] (MED)
6. The state government pledged (Oct 2026) to **renovate GSSS Lokoja** and "restore the school's lost glory" — public-school renovation is an active 2026 storyline usable for school typology. [src 26] (MED)
7. **Federal Teaching Hospital Lokoja (FTH)** is operating and led by a new CMD pledging transformation (Aug 2026), with a teaching partnership with PAAU — the city's flagship medical complex. [src 16] [src 17] [src 27] (HIGH existence / MED detail)
8. **Lokoja Central Mosque** is a civic-scale landmark used for state events (burials of prominent leaders, ICPC campaigns) and has a formally turbaned Imam — the city's mosque typology anchor. [src 19] [src 20] [src 21] (MED)
9. **Confluence Beach Hotel** — government-owned riverside hotel — has a documented arc of decay ("rots away", 2016) → management deal (Capital Boutique, 2018) → revitalization pledge (2019); its current state is an honest gap. [src 13] [src 14] [src 15] (MED)
10. Hotel demand is event-driven: **scarcity of hotel rooms hit Lokoja hours before the 2023 guber election**; hotels are also regulated/sealed by government (2025). Hotels swing between empty and overflowing — good gameplay pressure. [src 11] [src 12] [src 34] (MED)
11. **Kpata Market** is flood-vulnerable — traders "count losses after flood" (Daily Trust, 2020-12-11) — matching the game's flood doctrine. [src 10] (MED) + repo:src/game/data/locations.ts:72-91 (HIGH as repo fact)
12. **Confluence Stadium** (the city's main stadium) was ordered cleared of "illegal occupants" (May 2024) and referees publicly begged for renovation (Apr 2024) — a decaying civic sports landmark. [src 22] [src 23] (MED)
13. Nigeria-wide, homes are "barricaded with **corrugated iron sheets as burglary proofs** on windows and doors… complemented with very high walls and gates" — the burglar-bar + wall + gate grammar is NIGERIA-GENERIC, sourced, and matches the game's D1 compound doctrine (repo:docs/World_Bible.md:115-118). [src 3] (HIGH as national trait; LOW as Lokoja-specific)
14. Electricity infrastructure is consumer-subsidised: DisCo investors "leave **meter, transformer burdens to consumers**" (ICIR 2019) and broken poles get replaced only after press intervention (Punch 2023) — community poles/transformers are a true-to-life prop story. [src 24] [src 25] (MED, NIGERIA-GENERIC)
15. The city's road furniture law on disk already includes **kerbs, zebra crossings, road markings and drains** as layered geometry (repo:docs/World_Bible.md:96) — the research job is to parameterise their *style*, not invent the system. (HIGH as repo fact)
16. The game is 100% procedural — "**zero model files, zero image-sequenced animation, zero audio assets… zero photo-textures in the 3D world renderer**" (Law A-2) — so every architectural fact in this file must land as **parameters** (roof forms, colour tokens, facade grammar). [repo:docs/Art_Audio_Bible.md:29] (HIGH as repo fact)
17. Lokoja's tourism assets are officially catalogued but underdeveloped — "residents urge Kogi to develop tourism sites" (FRCN, 2026-09-27); "Tourist Attraction Or Filthy Hub?" (Guardian, 2015) — buildings sit inside an honest decay/renewal tension the game already embraces as "debts". [src 7] [src 31] (MED)
18. A "Reviving Lokoja Museum" op-ed (Blueprint, 2026-06-26) proposes the colonial museum as "a low-cost path to cultural rebirth" — the old museum building is a named heritage structure. [src 29] (MED)
19. Kogi Reports describes Lokoja as "**the most underdeveloped state capital**" (2025-12-17) — useful calibration: architecture should read more "working city" than "showpiece capital", with GRA as the polished exception. [src 30] (LOW-MED, opinion piece)
20. Government/colonial quarter: the game's Government Area ("quiet roads, **low fences**", repo:src/game/data/locations.ts:183) matches the colonial-GRA pattern of low bungalows behind fences; no fetched photo evidence of Lokoja's Government House facade exists — flagged, not invented. (repo HIGH / web GAP)
21. Naming evidence for the street layer: the game's road binary already carries real street names incl. **Lugard Rd, Marine Rd, Ahmadu Bello Way, IBB Way** (worklog.md:2783) — colonial-named streets are already Lokoja-verified in-repo and can anchor the historic district's buildings. (HIGH as repo fact)
22. Zinc (corrugated metal) roofing is the dominant low-cost roof family and is culturally load-bearing: "rain on zinc is the signature home sound" (repo:docs/World_Bible.md:119; Team 7's audio findings). Painted-zinc colour claims have NO fetched source — left in Open Questions. (repo HIGH / web GAP)
23. Hotels in Kogi are under explicit security regulation by the Culture & Tourism Ministry (2025-04-23) — fences, gates and guards are hotel-typology facts, not decoration. [src 34] (MED)
24. No evidence found (and therefore no claims made) about: Lokoja mosque/cathedral facade detail, Government House appearance, hospital block layout, school-building typology photos, current Lugard rest-house condition. All go to §6 Open Questions. (RULE ZERO)
25. Deployment law for this file: architecture enters via `layout.ts` BUILDINGS/STALLS + `props.ts` derived props as parameter families — see §5 grammar tables. [repo:src/game/world3d/layout.ts:1-100; src/game/world3d/props.ts:1-17]

## 2. Evidence Tables

### 2.1 Residential (compound vernacular)
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Burglary-proofing is near-universal | "barricaded with corrugated iron sheets as burglary proofs on windows and doors… iron rods… even of a higher gauge than the ones used in the regular prisons" | src 3 (full text) | 2023-12-09 | HIGH (national) / LOW (Lokoja-specific) |
| High walls + gates complement bars | "very high walls and gates that make it impossible for air to even penetrate… impossible for outsiders to see" | src 3 (full text) | 2023-12-09 | HIGH (national) / LOW (Lokoja) |
| In-game home = compound room, zinc roof | "zinc roof, shared wall, a door that locks… plastered block walls, burglar-proofing bars" | repo:docs/World_Bible.md:115-118 | 2026-10-21 (v2.2) | HIGH (repo law) |
| Lokoja rent pressure reshapes housing | room&parlour ₦650k/yr vs ₦200k/yr history (Team 6 economy file) | worklog.md:2819 (sibling) | 2026-10-22 | HIGH (sibling-verified) |

### 2.2 Government / colonial
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Lugard's rest house is the colonial anchor | on Mount Patti; tourism-listed; in-game secret with dignity doctrine | src 4; src 5; repo:docs/World_Bible.md:75-82 | 2017-09-02 / 2017-10-25 | HIGH existence (2 sources + repo) |
| European cemetery listed for tourism | "'European cemetery' on the list as Yahaya Bello moves to boost tourism in Kogi" | src 6 | 2021-12-08 | MED |
| Lokoja Museum named as heritage structure | "Reviving Lokoja Museum: A low-cost path to cultural rebirth" | src 29 | 2026-06-26 | MED |
| Capital narrative conflict | "first capital of Nigeria" vs Northern-Protectorate capital vs Calabar claim | src 8; src 9; repo:src/game/data/locations.ts:163 | 2023→2026 | MED (conflict logged §4-C1) |
| GRA character: "quiet roads, low fences" | in-game district text (design-law, not web) | repo:src/game/data/locations.ts:183 | 2026 | HIGH (repo) |
| Government House facade | NO fetched evidence — deliberately not described | — | — | GAP → §6 |

### 2.3 Markets
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Ultra-Modern Market = 25 ha | "rising on 25 hectares of land in Lokoja" | src 1 (full text) | 2026-08-03 | HIGH |
| Programme: open trading spaces + lock-up shops | "open trading spaces and lock-up shops will absorb traders relocating from seven existing markets" | src 1 (full text) | 2026-08-03 | HIGH |
| Market halls + warehouse + tech hub | "market halls, designed to consolidate bulk trading under one roof… facilities that set this project apart… a technology hub" | src 1 (full text) | 2026-08-03 | HIGH |
| Drainage is actively engineered | "specifying correct drainage dimensions… one location, receiving a higher volume of water close to the market's warehouse section, may require further enlargement" | src 2 (full text) | 2026-09-11 | HIGH |
| Old Nataco International Market congests routes | "buckling under the pressure… congesting major routes, exposing traders and commuters… to avoidable accidents" | src 1 (full text) | 2026-08-03 | HIGH |
| Kpata Market floods | "Lokoja Kpata market traders count losses after flood" | src 10 | 2020-12-11 | MED |
| Kpata is the game's market anchor | "Colourful stalls, loud traders… Every hustle passes through Kpata" | repo:src/game/data/locations.ts:72-91 | 2026 | HIGH (repo) |
| 7 markets consolidated; Gonjo relocation petition; Zone 8–Crusher site | sibling Team 9 register (22 official pages) | worklog.md:2834-2838 | 2024→2026 | HIGH (sibling-verified) |

### 2.4 Schools
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| GSSS Lokoja renovation pledged | "Ododo Set To Renovate GSSS Lokoja, Vows to Restore School's Lost Glory" | src 26 | 2026-10-14 | MED |
| 88 school doors already on disk | school interiors are the game's largest interior family (98 doors = 10 layout + 88 school) | repo:docs/World_Bible.md:12 | 2026-10-21 | HIGH (repo) |
| AGILE program spans 728 schools in Kogi | sibling Team 9 official-page fetch | worklog.md:2834 | 2026-04-02 | HIGH (sibling) |

### 2.5 Hospitals
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| FTH Lokoja operating with new CMD (Aug 2026) | "New CMD pledges to transform FTH Lokoja, boost service delivery" | src 16; src 27 | 2026-08-02/03 | HIGH (2 sources) |
| Teaching partnership with PAAU | "PAAU, Federal Teaching Hospital Lokoja Reaffirm Partnership on Medical Education, Clinical Training" | src 17 | 2026-08-01 | MED |
| It collects real patient flows | FIJ flags personal-data handling — implies high-volume public hospital | src 18 | 2026-06-18 | LOW (indirect) |

### 2.6 Religious
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Lokoja Central Mosque is a state-events venue | burial of prominent APC leader attended by gov (photos); ICPC campaign venue | src 20; src 19 | 2023-11-10 / 2022-04-27 | MED |
| Formal Imam institution | "Sheikh Shaban turbaned as new Imam of Lokoja" | src 21 | 2019-12-27 | MED |
| Church presence city-wide | "Lokoja city CAN commences week of prayer"; Apostolic Church donation event | src 37 (GNews PM News 2022-01-01); src 38 (kogistate Apostolic item) | 2022/2026 | MED |
| Mosque/cathedral facade detail | NO fetched evidence — not described | — | — | GAP → §6 |

### 2.7 Hotels
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Event-driven demand spike | "Scarcity of hotel rooms hits Lokoja hours to governorship election" | src 11 (also PM News echo) | 2023-11-10 | MED-HIGH |
| Confluence Beach Hotel decay arc | "Rots Away" (2016) → Capital Boutique management (2018) → revitalization pledge (2019) | src 14; src 15; src 13 | 2016→2019 | MED |
| Government regulates/seals hotels | "Hotels are charged with security as a serious business" (2025); hotel sealed over death case (2025) | src 34; src 12 | 2025 | MED |

### 2.8 Transport buildings
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Motor Park is a launch district | "last bus to Abuja is always 'just leaving'" | repo:src/game/data/locations.ts:240-258 | 2026 | HIGH (repo) |
| Nataco/Natako park = intercity loading point | sibling Team 4/9 verified (International Market bottleneck + loading points) | worklog.md:2784, 2838 | 2025→2026 | HIGH (sibling) |
| Federal Bus Terminal Lokoja exists | sibling Team 9 official-page fetch | worklog.md:2834 | 2025-08-22 | HIGH (sibling) |

### 2.9 Shops & stalls
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Stall families already on disk | STALLS = 2 both at Ganaja; prop safety contract keeps stalls clear of doors | repo:docs/World_Bible.md:14; src/game/world3d/props.ts:10-17 | 2026-10-21 | HIGH (repo) |
| Lock-up shops = the official shop unit | Ultra-Modern Market programme | src 1 | 2026-08-03 | HIGH |
| GSM-village fire + compensation (phone-shop cluster) | sibling Team 9 | worklog.md:2834 | 2024-09-12 / 2025-01-08 | HIGH (sibling) |

### 2.10 Street furniture & utilities
| Claim | Detail | Source(s) | Date | Confidence |
|---|---|---|---|---|
| Lamps exist city-wide (492) | lamp roster frozen in layout | repo:docs/World_Bible.md:14; src/game/world3d/layout.ts:1492 | 2026-10-21 | HIGH (repo) |
| Markings, kerbs, zebras, drains are layered geometry | road ribbons draped with markings +0.106, kerbs, zebras, drains | repo:docs/World_Bible.md:96 | 2026-10-21 | HIGH (repo) |
| Consumers fund meters/transformers | "investors leave meter, transformer burdens to consumers" | src 24 | 2019-11-19 | MED (national) |
| Pole replacement is press-driven | "Power firm replaces broken pole after PUNCH report" | src 25 | 2023-03-17 | LOW-MED (national anecdote) |
| Floods repeatedly hit city drainage | 3-year flood cycle 2024/2025/2026; Kogi on FG/NEMA high-risk lists | worklog.md:2838 (sibling, NEMA/KOSEMA fetches) | 2024→2026 | HIGH (sibling) |

## 3. Typology Catalogue Table

Legend: V = Lokoja-verified (web+repo) · R = repo-verified · NG = NIGERIA-GENERIC (sourced nationally, plausible locally, not Lokoja-confirmed) · GAP = no evidence, do not invent.

| Typology | Roofs | Walls | Colour palette | Silhouette | Street furniture | Named Lokoja examples | V/R/NG |
|---|---|---|---|---|---|---|---|
| Residential compound | Corrugated zinc mono/gable, shallow pitch; rain-on-zinc is the signature sound (R: World_Bible.md:115-119) | Plastered sandcrete block; burglar bars on windows/doors (src 3 full text) | Weathered zinc grey; cream/ochre/terracotta painted render (NG); repo theme tokens green/gold/terracotta/cream (R: worklog.md:14) | 1-2 storey boxes inside walled compounds; tanks + satellite dishes on roofs (NG) | High walls, tall gates, clotheslines, water drums (src 3; NG details) | Game 'home' anchor (R) | R + NG |
| Government / colonial | Hipped/gabled sheet or tile roofs on single-storey bungalows (NG); Rest House roof form unverified (GAP) | Rendered masonry, deep eaves, verandas (NG — colonial-bungalow grammar) | White/cream institutional wash; dark-green drums/gates (NG) | Low, wide, set back behind low fences (R: locations.ts:183) | Flagpoles, signage, low fences | Lugard's Rest House, Mt Patti; Lokoja Museum; European cemetery (V) | V existence / NG form |
| Markets | Open trading spaces (no roof) + lock-up shop rows + "market halls… under one roof" (src 1) | Lock-up shops: roller shutters + plastered block (NG for form); stall poles + tarpaulin/umbrellas (R: STALLS) | Shade-cloth/tarp colours; sign-painted shutters (NG) | Low shed rows → new formal halls on 25 ha grid (src 1) | Head-load porters, weigh scales, loading bays (src 1) | Kpata Market; Nataco International; Ultra-Modern Market (Zone 8–Crusher) (V) | V |
| Schools | Long classroom blocks, mono-pitch zinc (NG); renovation pending (src 26) | Rendered block, painted bands; burglar bars (src 3 adjacency) | Faded ochre/brown with painted dados (NG) | 1-storey bars around a yard (NG; yard confirmed by school-yard code in repo props.ts:31) | Flagpole, assembly lines, gates | GSSS Lokoja (V, being renovated); 88 school interiors on disk (R) | R + NG |
| Hospitals | Flat-slab concrete multi-storey blocks (NG for form) | Rendered concrete, institutional signage (NG) | White/green institutional (NG) | Large slab + canopied entrance (NG) | Ambulance bay, queues under canopies (NG) | FTH Lokoja (V existence) | V existence / NG form |
| Religious (mosque) | Dome + minaret for central mosques (NG); Lokoja Central Mosque civic-scale (V existence) | Rendered block, arched openings (NG) | White/green, gold trim (NG) | Dome-dominant with minaret (NG) | Shoe racks, prayer mats outside, azan loudspeakers (NG; prayer windows verified by Team 7) | Lokoja Central Mosque (V) | V existence / NG form |
| Religious (church) | Gable zinc or flat-slab halls (NG) | Rendered block; banner-draped facades (NG) | Whitewash + painted signage boards (NG) | Gable hall + tower or billboard cross (NG) | Plastic chairs spilling outside (NG) | CAN city-wide events (V, low detail) | V existence / NG form |
| Hotels | Flat roofs, 2-4 storey (NG) | Rendered + painted, gated entry, guarded (src 34 security framing) | Bright painted facades; lit signage (NG) | Garden-compound blocks (NG) | Boom barrier, guard post, parking (src 34 adjacency) | Confluence Beach Hotel (V); unnamed sealed hotel (V) | V existence / NG form |
| Transport buildings | Big-span open shelters + offices (NG) | Open-sided steel/post sheds (NG) | Painted zinc + union signage (NG) | Shed rows around a yard (R yard=transport-area) | Park benches, loading bays, union touts (R/V via siblings) | Motor Park (R); Federal Bus Terminal (V via sibling); Nataco loading (V via sibling) | V/R |
| Shops & stalls | Umbrella/tarp/plank stalls (R); lock-up shops with shutters (V: src 1) | Timber/plank + block cores (NG) | Product-colour chaos (NG), sign boards (NG) | Street-edge rows, kerb spill (R stall clearance law: props.ts:10-17) | Awnings, crates, POS kiosks (V: sibling Team 6 POS economy) | Kpata periphery; Food Strip (R) | R + NG |
| Street furniture & utilities | — | — | — | — | 492 lamps (R: layout.ts:1492); kerbs/zebras/drains (R: World_Bible.md:96); concrete power poles with transformers, consumer-funded meters (src 24, NG); open storm gutters at market (src 2, V) | — | R + NG + V |

## 4. Contradictions & Data Conflicts

- **C1 — "First capital" narrative.** Blueprint (2026-05-01): "Lokoja: Story behind the first capital of Nigeria" [src 8]; repo text: "Lokoja was once the capital of the Northern Protectorate" (locations.ts:163); Pulse (2023-04-28) debates "Was Calabar really the first official capital?" [src 9]. Both kept: the game's phrasing (Northern Protectorate) is the safest, already in-repo; national framing is contested.
- **C2 — Confluence Beach Hotel state.** "Rots Away" (allAfrica 2016-05-16) [src 14] vs management deal (Kogi Reports 2018-04-06) [src 15] vs "set to revitalize" (Fresh Angle 2019-04-18) [src 13] vs "7star Hotel… looks like now" satirical piece (Kanyi 2012) [src 35]. No post-2019 condition source found. Both decay and revival storylines are evidenced; current state = Open Question.
- **C3 — Confluence Stadium.** Renovation begged by referees (2024-04-25) [src 23] vs government ordering "illegal occupants" out within 14 days (2024-05-20) [src 22] vs state hosting novelty match (2025-01-25, GNews Kogi Govt). Decay and active use coexist — record both.
- **C4 — Blueprint domain confusion (method note, not a fact conflict).** blueprint.africa resolved to an unrelated French printing site; Blueprint Newspapers items are therefore headline-cited via GNews only, never fetched.
- **C5 — Hotel market framing.** Room scarcity (2023) [src 11] vs "Yahoo Boys Take Over Hotels" (2024) [src 28] vs government security crackdown (2025) [src 34] — demand spike, misuse, and regulation all documented; not a factual contradiction but a tension the game should hold, not resolve.

## 5. Design Seeds for the Game (procedural grammar → layout.ts / props.ts / interiors.ts)

P0 = build now · P1 = phase next · P2 = later.

| # | Seed | Procedural parameters (Law A-2 compliant) | Mapping | Priority |
|---|---|---|---|---|
| S1 | **Roof grammar v2** | enum {ZINC_MONO, ZINC_GABLE, FLAT_SLAB, HIPPED_TILE, DOME, GABLE_HALL}; pitch 12-20° for zinc; ridge offsets; weathered-vs-painted zinc token | layout.ts BUILDINGS roof field | P0 |
| S2 | **Zinc colour tokens** | weathered #9AA0A3, rust-oxide #B0552F, faded green #6B7D5A, sky-blue #7FA8C9 (NG — verify; §6) — mapped through district wash families | globals.css theme + district wash | P0 |
| S3 | **Burglar-bar facade grammar** | window bars as instanced geometry: vertical-rod vs cross-hatch; rod-gauge variety (src 3: "higher gauge than prisons") | facade grammar in layout BUILDINGS | P0 |
| S4 | **Wall+gate compound rule** | compound walls 2-2.5 m, sheet-metal gates taller than walls; wall-top glass/broken-bottle ridge (NG) — gate as the building's face | props.ts compound props | P0 |
| S5 | **Market ladder** | old order: plank/tarp stalls, umbrella rows (existing STALLS) → new order: lock-up shop rows w/ shutters, halls with roof spans, tech-hub block, warehouse w/ enlarged drain point (src 1+2) — build the Ultra-Modern Market as a P3 location arc | layout.ts + interiors.ts | P0 |
| S6 | **Drainage as visible law** | open storm gutters along market spine; drain-dimension variety; one enlarged high-volume point near warehouse (src 2) — floods become gameplay, matching 3-year cycle | WorldTerrain drain layer + props.ts | P1 |
| S7 | **Colonial silhouette kit** | deep-eave verandas, hipped roofs, low fences for Historic Lokoja + GRA; Rest House = hilltop bungalow with dignity copy already on disk | Historic/GRA BUILDINGS params | P1 |
| S8 | **Consumer-power props** | wooden/concrete poles w/ strapped transformers, tangles of service drops, meter boards on walls, community-funded pole plaques (src 24) | props.ts utility family | P1 |
| S9 | **Institutional palette** | white/cream render + dark-green trim + gold signage for government, mosque, hospital (NG; anchor to repo green/gold/terracotta/cream) | colour tokens | P1 |
| S10 | **Hotel pressure kit** | gated forecourt, guard post, boom, lit signage; occupancy state flips with events (election-week scarcity, src 11) | interiors.ts + economy hook | P1 |
| S11 | **School bar kit** | long 1-storey classroom bars, yard-flagpole, painted dados, AGILE-style renovation scaffolding state (src 26) | school BUILDINGS + interiors | P2 |
| S12 | **Stall grammar v2** | roller-shutter lock-ups, sign-board fronts, tarp colours by trade; keep props.ts clearance contract (props.ts:10-17) | STALLS params | P2 |

## 6. Open Questions

1. Lugard Rest House current condition and roof/wall form (no fetched photos; only headline evidence).
2. Lokoja Central Mosque / cathedral facade detail — dome form, minaret count, colour.
3. Lokoja Government House facade and fence style — GAP, deliberately undescribed.
4. Painted-zinc colour statistics for Lokoja roofs (any architectural photo essay or OSM/building-tags pass).
5. FTH Lokoja block layout, bed count, canopy form.
6. School-building typology (GSSS vs AGILE new blocks) — photo evidence needed.
7. Confluence Beach Hotel post-2019 state (operational? derelict? rebuilt?).
8. Ultra-Modern Market site plan: shop counts, hall dimensions, tech-hub footprint.
9. Street-lighting density and pole style along Lugard Rd / Ahmadu Bello Way.
10. Walled-compound prevalence stats within Lokoja (vs national generic).

## 7. Source Registry

### Fetched full text this session (OD = on-disk fetch, 2026-10-22)
- src 1: https://kogistate.gov.ng/a-city-within-a-market-employment-enterprise-lokojas-commercial-future/ (Kogi State Government, "A City Within a Market…", site-dated 2026-08-03)
- src 2: https://kogistate.gov.ng/lokoja-ultra-modern-market-marks-fresh-progress-as-state-officials-tighten-oversight/ (Kogi State Government, 2026-09-11)
- src 3: https://dailypost.ng/2023/12/09/nigerians-in-self-imprisonment-as-burglary-proofs-street-gates-become-part-of-living/ (Daily Post Nigeria, 2023-12-09)
- (failed fetch recorded for honesty: kogireports.com — network unreachable; blueprint.africa — wrong site; kogistate.gov.ng GSSS slug — 404; Wikipedia API — HTTP 429 ×2)

### Verified GNews/BNews RSS items (publisher + headline + date verified; full text NOT fetched)
- src 4: Vanguard, "A visit to Lord Lugard's rest house: Kogi's unexplored goldmine", 2017-09-02
- src 5: Tribune Online, "Lugard's legacy, Kogi's untapped monument", 2017-10-25
- src 6: TheCable, "'European cemetery' on the list as Yahaya Bello moves to boost tourism in Kogi", 2021-12-08
- src 7: FRCN HQ, "Residents urge Kogi to develop tourism sites", 2026-09-27
- src 8: Blueprint Newspapers, "Lokoja: Story behind the first capital of Nigeria", 2026-05-01
- src 9: Pulse Nigeria, "Was Calabar really the first official capital of Nigeria?", 2023-04-28
- src 10: Daily Trust, "Lokoja Kpata market traders count losses after flood", 2020-12-11
- src 11: The ICIR, "Scarcity of hotel rooms hits Lokoja hours to governorship election", 2023-11-10 (PM News echo same day)
- src 12: Sahara Reporters (via BNews RSS), "Kogi Government Seals Hotel…", 2025-07-25
- src 13: Fresh Angle, "Government set to revitalize Confluence Beach Hotel- Suleiman", 2019-04-18
- src 14: allAfrica, "Confluence Beach Hotel Rots Away", 2016-05-16
- src 15: Kogi Reports, "Capital Boutique to Manage Confluence Beach Hotel – Kogi Govt.", 2018-04-06
- src 16: Tribune Online, "New CMD pledges to transform FTH Lokoja, boost service delivery", 2026-08-02
- src 17: Kogi Reports, "PAAU, Federal Teaching Hospital Lokoja Reaffirm Partnership on Medical Education, Clinical Training", 2026-08-01
- src 18: FIJ NG, "SPOTTED: Federal Teaching Hospital Lokoja Requests Patients' Personal Data Without Privacy Policy", 2026-06-18
- src 19: ICPC, "ICPC takes Anti-Corruption Campaign to Kogi State Central Mosque", 2022-04-27
- src 20: PM News Nigeria, "Yahaya Bello, others hit Lokoja Central Mosque for burial of prominent APC leader (photos)", 2023-11-10
- src 21: Daily Trust, "Sheikh Shaban turbaned as new Imam of Lokoja", 2019-12-27
- src 22: Peoples Gazette Nigeria, "Kogi government orders illegal occupants of Confluence Stadium to leave within 14 days", 2024-05-20
- src 23: Kogi Reports, "Kogi Referees Begs Sport-Loving Gov Ododo to Renovate Confluence Stadium", 2024-04-25
- src 24: The ICIR, "After acquiring $1.3bn DisCos, investors leave meter, transformer burdens to consumers", 2019-11-19
- src 25: Punch Newspapers, "Power firm replaces broken pole after PUNCH report", 2023-03-17
- src 26: Kogi State Government, "Ododo Set To Renovate GSSS Lokoja, Vows to Restore School's Lost Glory", 2026-10-14
- src 27: The Guardian Nigeria News, "FTH Lokoja CMD prioritises staff welfare, quality healthcare services", 2026-08-03
- src 28: Kogi Reports, "As Yahoo Boys Take Over Hotels", 2024-06-27
- src 29: Blueprint Newspapers, "Reviving Lokoja Museum: A low-cost path to cultural rebirth", 2026-06-26
- src 30: Kogi Reports, "Lokoja: The Most Underdeveloped State Capital", 2025-12-17
- src 31: The Guardian Nigeria News, "Lokoja: Tourist Attraction Or Filthy Hub?", 2015-06-14
- src 32: Daily Trust, "Tourism potentials of rivers Niger, Benue confluence untapped centuries after", 2021-02-27
- src 33: The Sun Nigeria, "Ododo: Lokoja ultra-modern market'll redefine commerce, create jobs", 2026-09-07
- src 34: Kogi State Government, "Hotels are charged with security as a serious business by the Culture and Tourism Commissioner", 2025-04-23
- src 35: Kanyi Daily News, "See how Naija's 7star Hotel 'THE CONFLUENCE BEACH HOTEL Lokoja looks like now", 2012-09-29
- src 36: Tribune Online, "Notable places in Nigeria to see impacts of British Colonial rule", 2025-03-20
- src 37: PM News Nigeria, "Lokoja city CAN commences week of prayer", 2022-01-01
- src 38: Kogi State Government, "Gov Ododo Charges Apostolic Church to Pray for the Greatness of Kogi State… Donates N5m, SUV", 2026-10 (via site listing, 2026-10-21)

### Repo anchors
- repo:docs/World_Bible.md:22,26 (Law W-1 geography) · :12 (doors census) · :14 (lamps 492, stalls) · :75-82 (Patti Rest House doctrine) · :96 (kerbs/zebras/drains) · :111-119 (D1 compound vernacular, zinc, rain-on-zinc)
- repo:docs/Art_Audio_Bible.md:12,29 (Law A-2 — 100% procedural, zero models/photo-textures)
- repo:src/game/data/locations.ts:49-260 (ten launch locations; :163 Northern-Protectorate capital; :183 GRA low fences)
- repo:src/game/world3d/layout.ts:36-49 (world constants) · :1492 (LAMPS)
- repo:src/game/world3d/props.ts:1-37 (derived prop families, clearance contract)
- repo:worklog.md:2783 (20 real street names incl. Lugard Rd, Marine Rd, Ahmadu Bello Way) · :2819 (Team 6 rent figures) · :2834-2838 (Team 9 official project register) · :2804 (Team 7 prayer windows/power truth)

### Community / listings
- Google News RSS (NG edition) + Bing News RSS pipelines, 2026-10-22 session; scratch tooling at /home/z/t2-tmp/ (outside repo).
