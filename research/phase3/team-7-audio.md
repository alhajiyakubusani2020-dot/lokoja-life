# Team 7 — Audio · raw evidence base (Phase 3 Prelude)

**Agent:** Team 7 (AUDIO) · **Date of research:** 2026-10-22 · **Mission:** soundscape identity of Lokoja — hour-by-hour sound map + per-sound synthesis guidance, all grounded in real web research under RULE ZERO (every claim cites ≥1 URL; no URL → Open Questions).

**Repo grounding (cited as repo:path:line):** `src/game/systems/ambience.ts:99-106` — 8 shaped-noise layers (breeze lowpass 320 Hz · river bandpass 850 · market lowpass 480 · rain highpass 1,400 · room lowpass 140 · crickets bandpass 4,400 Q6 · horns bandpass 520 Q2.5 · zinc bandpass 3,200); blend law `ambience.ts:154-177`; bird chirp scheduler `ambience.ts:179-210` (sine blips 2.3–4.2 kHz); horn-stab + zinc-tick scheduler `ambience.ts:217-264`; `src/game/systems/music.ts:30-46` (C-pentatonic 261.63, bpm {108,100,92,78}, maxVoices 8); `src/game/systems/audio.ts:14` (click/chime/levelup/notify); `docs/Art_Audio_Bible.md:231-280` (Part VIII: A-35 mix-is-census … A-47 consent), `docs/Art_Audio_Bible.md:29` (Law A-2 — 100% procedural, zero audio files), `docs/World_Bible.md:119,137,155,173,191,210,228,246,264,282` (district Sound fields), `docs/World_Bible.md:475-476,501` (W-56 sound-is-census, W-57 procedural forever, W-61 transport cultures).

**Method note (honest):** WebSearch was unavailable in this sandbox; research was done via DuckDuckGo-HTML queries, Google News RSS, direct page/PDF fetches, and open APIs (Aladhan prayer-times, GBIF occurrence API). Xeno-canto and eBird pages were bot-blocked (Anubis/JS challenges) on 2026-10-22 — species evidence therefore rests on (a) Lokoja-specific peer-reviewed/field studies, and (b) GBIF occurrence records with dates. Search count this session: ~20 distinct queries + ~14 full-page/PDF/API fetches.

---

## 1. Executive Findings (each bullet ends [src N])

1. **Lokoja has its own peer-reviewed avifauna baseline:** 108 bird species, 56 taxonomic groups, 43 families recorded Nov 2016–Feb 2018 across sites that are exactly the game's districts — FUL Adankolo, FUL Felele, Ganaja ferry site, Mount Patti, Old Polytechnic quarters, Kpata old market, Lokongoma Phase II (Adang, Tanko, Kachi & Abdulwahab, Proc. 6th NSCB Biodiversity Conf., 2018, pp.117-124). [src 1.1]
2. The most-encountered Lokoja bird family is **Estrildidae (finches/mannikins, 9 spp.)**, then Sylviidae (9), Turdidae (8, incl. African thrush), Accipitridae (7 kites/harriers), **Columbidae (6 doves)**, Nectariniidae (5 sunbirds), **Ploceidae (5 weavers)** — i.e. the audible dawn palette is finch-chatter, dove coos, thrush song, weaver squabbles, not generic "birdsong". [src 1.1]
3. Lokoja-area new records include the **Violet Turaco and Green Turaco** (loud clonking/kok-kok callers), **Egyptian Plover** (river-sandbar bird at the confluence) and Pallid Harrier (near-threatened) — the river and Patti ridge own distinctive voices. [src 1.1]
4. GBIF occurrence records for Kogi State (retrieved 2026-10-22; 471 Aves records total) confirm with dated points: **Western plantain-eater 17 records, Yellow-billed kite 19, Laughing dove 16, Senegal coucal 10, Egyptian plover 10, African thrush 8, Red-billed firefinch 7, Pied crow 5 (Oct–Nov 2021, Federal University Lokoja campus), Cattle egret 5, Senegal parrot 4, Village weaver 4, Pied kingfisher 4**. [src 2.1]
5. **Prayer-call times are computable, not guessable:** for Lokoja (7.8024 N, 6.7431 E) on 2026-10-22 (Muslim World League convention): Fajr 05:10, Sunrise 06:20, Dhuhr 12:17, Asr 15:38, Maghrib/Sunset 18:15, Isha 19:21 — five fixed call windows that structure the day's sound. [src 3.1]
6. Mosque loudspeakers broadcast the adhan **five times a day**, a practice dating to the 1930s (first 1936 installation "carry more than a mile"); amplification is the global norm — so a synthesized azan *texture* (never a voice recording) must sit in a loudspeaker band, not a natural-voice band. [src 3.2]
7. Nigerian law gives concrete mix targets: **NESREA National Environmental (Noise Standards & Control) Regulations 2009 — residential 50 dB(A) day / 35 night; mixed residential+commercial 55/45; hospital 45/35; day = 06:00–22:00, night = 22:00–06:00**; the rules explicitly cover "yelling, …pounding, whistling and singing" and religious loudspeakers. [src 4.1]
8. NESREA has publicly asserted it can **prosecute churches/mosques for uncontrolled loudspeaker noise** (Premium Times, 2021); Lagos has repeatedly cracked down on noisy worship (2019 shutdowns; May 2025 clampdown) — enforcement is NIGERIA-GENERIC; no Kogi-specific enforcement news was found. [src 4.2, 4.3]
9. **Power is the city's metronome:** the average Nigerian household received only **6.6 hours of electricity per day** (NBS Residential Energy Demand-Side Survey 2024), the grid collapsed **12 times in 2024** (11 per one state-broadcaster count; NERC's annual report counts 26 collapses 2020–2024), with further collapses in 2025 (incl. Sept 10, 2025) and a TCN-announced blackout in Kogi Sept 1, 2026. [src 5.1, 5.2, 5.3, 5.4]
10. **~22 million small gasoline generators** (0–4 kVA) power Nigerian households/MSMEs — 27% of households and 29% of MSMEs rely on them; ~50% of Nigerians are not grid-connected (Dalberg/A2EI, data year 2018); AfDB (Jun 2026) puts **70.7% of firms** on owned/shared generators. A generator-hum layer with truth-driven on/off logic is evidence-grade, not decoration. [src 5.5, 5.6]
11. Measured generator noise in Nigerian residential buildings: **indoor means ~79.97–87.4 dB during generator use** (Ibadan study) — far above the NESREA 50/35 residential limits; Akure and Benin City studies corroborate generators as top residential noise source. [src 5.7, 5.8]
12. **Market sound is quantified:** at Gwagwalada market (FCT), gate-open mornings measure 54.5–61.5 dB, evening peak (17:00–19:00) 61.4–**98.6 dB**, highest point-means 84.64/81.38 dB, and traditional market days run ~4 dB louder than ordinary days (70.28±10.15 vs 66.16±8.28 dB) vs the NESREA 75 dB commercial limit (Azojete 20(4), Dec 2024). [src 6.1]
13. An Abuja market survey claims night means up to **122.1 dB(A)** (Gosa) — implausible against the same paper's own 70/75 dB commercial standard; recorded as a contradiction, not adopted. [src 6.2]
14. Lokoja's biggest market is literally under construction: the **Lokoja Ultra-Modern Market** (₦50bn Sukuk-funded) was inspected by the Kogi Commerce Ministry on 2026-10-08 — the game's market ambience (D2, `World_Bible.md:137`) can inherit a "new market" narrative. [src 6.3, 6.4]
15. **Kogi banned okada/keke-NAPEP from highways** (township routes only, mobile courts constituted) — Lokoja street sound is keke/okada *inside* town, heavy-truck only on bypass/highway. [src 7.1]
16. Horn-honking in Nigeria is a documented **non-verbal language** with a "rich unwritten vocabulary" (sociolinguistic study; SCIRP overview) — meanings include "open the gate", "Daddy is back", "give way", greeting, danger — the game's horn stabs should be patterned (short-short, long, double-tone), not random. [src 7.2, 7.3, 7.4]
17. **Lokoja climate for the wind/rain law:** Köppen **Aw** (tropical savanna); rain May–October, ~1,000 mm/yr, RH ~60% in the rainy season, max temp ~37.9 °C (Adang et al. citing Alabi 2012; Wikipedia). [src 8.1, 1.1]
18. **Harmattan** = late November–mid-March dusty NE trade wind; routine visibility 2–5 km, severe episodes a few hundred metres (Wikipedia; SKYbrary); Nigerian outlets report the season weakening/shifting under climate change (2026 reports). A harmattan mode = brighter dust hiss + attenuated far-field sounds + thin birds. [src 8.2, 8.3, 8.4]
19. **Rain-on-zinc is the signature Nigerian roof sound** — culturally iconic ("If you grew up in Nigeria, you KNOW this sound"), documented as a known noise complaint for zinc roofing — the existing `zinc` layer (3.2 kHz band + 4–6 kHz ticks, `ambience.ts:224-239`) is directionally right and should scale with rain intensity. [src 8.5, 8.6]
20. **Floods re-shape the soundscape:** 2022 floods killed 600+ (VOA, Oct 16 2022); October 2024 floods submerged ~200 communities and displaced 2M+ in Kogi (The Watchers, Oct 14 2024); 2026 season has NEMA/Navy flood-preparedness operations with Kogi. Flood = more ferry/boat sound, generators, market re-location. [src 9.1, 9.2, 9.3]
21. Lokoja fishing is active but paradoxical — "Abundant Rivers, Scarce Fish" (National Focus, Aug 14 2026): confluence city with protein-poor households; Ganaja ferry site is an established birding point; river layer truth is real. [src 9.4, 1.1]
22. **Lokoja nightlife exists and is mappable:** ~29 bars and ~10 nightclubs listed for the city (review aggregators); Lounge 1 markets itself as "EXCLUSIVE NITE CLUB… in the CONFLUENCE CITY"; Dabs Lounge operates in Lokogoma Phase 2 — supports an evening music-bleed texture per `World_Bible.md:246`. [src 10.1, 10.2, 10.3]
23. **Night vigil noise is a live national flashpoint** (2026 incidents: Onitsha residents petition; Umuahia man stormed a vigil; neighbours switched off a church's generator mid-vigil) — in-game religious sound must stay factual and non-caricatured (A-44; team brief). [src 4.4, 4.5, 4.6]
24. WHO anchors the quiet end: **<30 dB(A) in bedrooms at night, <35 dB(A) classrooms, <40 dB(A) annual night average outside bedrooms** — useful for the "silence" districts (Government Ridge, `World_Bible.md:228`) and school interiors. [src 10.4]
25. **Guard dogs are a documented night-security soundscape** element of Nigerian compounds (guard-on-night-duty reports; community advice "deterrence … through barking at night") — NIGERIA-GENERIC. [src 10.5, 10.6]
26. The cultural grammar of power cuts is documented: "**NEPA don take light**" / "NEPA don bring light" (Nairaland 2023 thread; how-to guides; viral TikTok) — a procedural "power-state changed" audio idiom (distant cheer, generator spool-up/down) is culturally grounded. [src 5.9]
27. The repo's bird layer is one generic 2.3–4.2 kHz sine-slide chirp; the evidence (finch/dove/thrush/turaco/plantain-eater palette, dawn-window weighting) supports a **species-flavoured multi-call scheduler** without adding a single file (A-36 layers-are-data). [repo:ambience.ts:179-210, src 1.1, 2.1]
28. The music engine's four moods (108/100/92/78 bpm) need **no bpm change** from this research; but harmattan (W-64 "each season changes … one sound") suggests a detune/lowpass seasonal trim, not a new mood. [repo:music.ts:30-46, src 8.2]

---

## 2. Evidence Tables

Confidence: HIGH = ≥2 independent sources · MED = 1 reputable source · LOW = weak/secondary/anecdotal. All retrieval dates: 2026-10-22.

### 2a. Birds & wildlife

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| 108 species, 43 families recorded in Lokoja & environs | Point counts + line transects; sites incl. Mount Patti, Kpata old market, Ganaja ferry site, FUL Adankolo/Felele, Old Polytechnic quarters, Lokongoma Ph II; species identified partly *by ear against recorded songs* | https://docslib.org/doc/6017970/bird-species-richness-and-diversity-of-lokoja-and-environs-kogi-state-nigeria (full text) | field Nov 2016–Feb 2018 (pub. 2018) | HIGH (also RG mirror: https://www.researchgate.net/publication/346416175) |
| Top families = finches, doves, thrushes, weavers, sunbirds | Estrildidae 9, Sylviidae 9, Turdidae 8, Accipitridae 7, Columbidae 6, Nectariniidae 5, Ploceidae 5, Ardeidae 3, Musophagidae 3, Corvidae 2 | same as above | 2018 | HIGH |
| New Lokoja records: Magpie Mannikin, Green Turaco, Violet Turaco, Egyptian Plover, Pallid Harrier (NT) | Turacos = loud knocking calls; Egyptian plover = confluence sandbars | same as above | 2018 | HIGH |
| Pied crow & cattle egret present in Kogi (dated records) | GBIF: Corvus albus 5 records (Oct–Nov 2021, FUL campus); Bubulcus ibis 5 records; 471 total Aves records for Kogi | https://api.gbif.org/v1/occurrence/search?country=NG&stateProvince=Kogi&taxonKey=2482519 (also 2480830, classKey 212 facet) | records 2021 (retrieved 2026-10-22) | HIGH (GBIF + Adang's Corvidae/Ardeidae counts) |
| Vocal "city" species in Kogi: Western plantain-eater (17 records), Yellow-billed kite (19), Laughing dove (16), Senegal coucal (10), African thrush (8), Village weaver (4), Senegal parrot (4), Pied kingfisher (4) | GBIF occurrence counts per species in Kogi State | https://api.gbif.org/v1/occurrence/search?country=NG&stateProvince=Kogi&classKey=212 (count=471; per-taxon queries keys 2475211/5229167/6101223/5231999/9348895/2494058/2479964/2475679) | various, retrieved 2026-10-22 | MED (GBIF presence ≠ abundance) |
| Mount Patti holds a distinct relatively-undisturbed avifauna | "Birds species composition and abundance of a relatively undisturbed vegetation at Mount Patti, Lokoja" — Brazilian Journal of Biological Sciences 6(12):271-282 | https://www.researchgate.net/publication/333345746_Birds_species_composition_and_abundance_of_a_relativelly_undisturbed_vegetation_at_Mount_Pati_Lokoja_Kogi_State | Jan 2019 | MED (abstract-level only; RG bot-blocked full text) |
| Habitat structure changes bird diversity in Lokoja (Zone 8 study) | Farmland vs gallery forest vs rocky outcrop vs uncultivated grassland, Federal Univ. Lokoja Zone 8; 3 months; birds as ecosystem-health indicators | https://www.ajol.info/index.php/tzool/article/view/237124 | n.d. (AJOL listing, ~2023) | MED |
| Dawn chorus as the day-opening sound | Lokoja papers record identification by ear; specific dawn-chorus timing for Lokoja NOT sourced (Xeno-canto/eBird bot-blocked) → Open Question #6.1; sunrise 06:20 on 2026-10-22 bounds the window | Adang et al. (above) + https://api.aladhan.com/v1/timings/22-10-2026?latitude=7.8024&longitude=6.7431&method=3 | 2018 / 2026-10-22 | LOW (Lokoja-specific timing) |

### 2b. Prayer & religion

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja's five prayer windows (MWL calc) | Fajr 05:10 · Sunrise 06:20 · Dhuhr 12:17 · Asr 15:38 · Maghrib 18:15 · Isha 19:21 (2026-10-22; times drift ±1h across the year) | https://api.aladhan.com/v1/timings/22-10-2026?latitude=7.8024&longitude=6.7431&method=3 | retrieved 2026-10-22 | HIGH (computed, reproducible) |
| Adhan is loudspeaker-amplified, 5×/day, since the 1930s | First mic+loudspeaker 1936 (Sultan Mosque, Singapore), "could carry more than a mile"; article documents noise-pollution controversies | https://en.wikipedia.org/wiki/Loudspeakers_in_mosques | current wiki (retrieved 2026-10-22) | HIGH |
| NESREA can prosecute churches/mosques for loudspeaker noise | Agency statement on regulating worship loudspeakers | https://www.premiumtimesng.com/news/more-news/470220-we-can-prosecute-churches-mosques-for-noise-pollution-nesrea.html · https://dailynigerian.com/churches-mosques-loudspeakers/ | Premium Times page (article ID 470220 → 2021, exact date unverified); Daily Nigerian n.d. | HIGH (2 sources) |
| Lagos-style enforcement exists (NIGERIA-GENERIC) | 2019 shutdown of noisy worship centres; May 2025 clampdown on churches, mosques, hotels, lounges | https://www.rfi.fr/en/international/20191118-nigeria-lagos-shuts-down-places-worship-flouting-anti-noise-pollution-laws · https://www.vanguardngr.com/2025/05/noise-pollution-lagos-talks-tough-clamps-down-on-churches-mosques-others/ | 2019-11-18 · 2025-05 | MED (Lagos ≠ Kogi) |
| Night vigils generate real neighbourhood conflict (context, not caricature) | Onitsha residents demand vigil/loudspeaker restrictions (2026-07); Umuahia vigil-noise incident; neighbours switched off a church generator during a vigil (2026-03-07) | https://www.channelstv.com/2026/07/09/anambra-community-seeks-govt-action-against-noise-pollution/ · https://thenigerialawyer.com/i-cant-take-the-noise-anymore-frustrated-resident-storms-church-with-cutlass-during-night-vigil-over-noise-disturbance-in-umuahia/ · https://gwg.ng/2026/03/07/drama-as-man-switches-off-church-generator-during-night-vigil-over-noise-video/ | 2026-07-09 · 2026 · 2026-03-07 | MED |
| Lokoja religion texture is multi-faith | Lokoja wiki: "Given the multi-ethnic nature of the town, there are various festivals, events and socio-cultural activities depending on the people's group" | https://en.wikipedia.org/wiki/Lokoja | retrieved 2026-10-22 | MED (specific mosque/church counts for Lokoja NOT found → Open Question #6.2) |

### 2c. Market & vendors

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Market dB by time-of-day (Gwagwalada, FCT — closest measured proxy) | Gate-open morning 54.5–61.5 dB; peak 17:00–19:00 61.4–98.6 dB; highest point-means 84.64 dB & 81.38 dB; market days 70.28±10.15 dB vs ordinary 66.16±8.28 dB; authors cite NESREA 75 dB commercial limit | https://azojete.com.ng/index.php/azojete/article/download/987/564/ (Azojete 20(4):855-862; co-author H.O. John-Nwagwu is of Federal University Lokoja) | Dec 2024 | HIGH (peer-reviewed measurement) |
| Abuja market noise survey (outlier values) | Range 57.8–127.8 dB(A); loudest "night means" 122.1 (Gosa) / 119.2 dB(A) (Nyanya) — treated as suspect (see §4) | https://www.ijisrt.com/assets/upload/files/IJISRT25MAY1228.pdf | May 2025 | LOW |
| Aba markets study exists (May 2017 measurements) | Noise at radial distances in Aba markets + questionnaires | https://www.researchgate.net/publication/343306246_Noise_level_at_Major_markets_in_Aba_Nigeria_and_its_effects_on_Humanity | study May 2017 | MED |
| Lokoja Ultra-Modern Market under construction (2026) | Kogi Commerce Ministry inspection demanded quality delivery (2026-10-08); ₦50bn Sukuk bond funds airport + Lokoja market | https://kogistate.gov.ng (via Google News item, 2026-10-08) · https://muslimvoice.com.ng (2026-01-31) | 2026-09/10 | HIGH (government statement + 2 outlets) |
| Vendor-calling/hawking vocal texture | NOT directly sourced this session (searches returned nothing citable) → Open Question #6.3; design must use non-lexical formant texture (A-43/A-44) | — | — | — (open) |

### 2d. Traffic & vehicles

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Kogi restricts okada/keke to township routes | Kogi Ministry of Transportation banned okada + keke NAPEP from highways; mobile courts constituted; commuters report hardship | https://www.latestnigeriannews.com/p/1246875/kogi-govt-bans-okada-keke-napep-from-lying-highway-constitutes-mobile-courts.html · https://thenigerianpost.com.ng/ban-on-okada-tricycles-from-lying-highways-commuters-in-lokoja-face-untold-hardship/ | n.d. in snippets ("last two weeks" phrasing; undated) | MED (2 outlets, same event) |
| Lokoja motorcycle-taxi operations studied | "Impact of Commercial Motorcycle Operations in Lokoja" (Ibrahim et al.) | https://www.researchgate.net/publication/400340512_Impact_of_Commercial_Motorcycle_Operations_in_Lokoja | 2026-02-10 | MED |
| Keke/okada economy strain in Kogi | Drivers "struggle to break even amid economic hardship" (feature from Lokoja) | https://thereporters.com.ng/2024/09/09/keke-napep-driversokada-riders-in-kogi-struggle-to-break-even-amid-economic-hardship/ | 2024-09-09 | MED |
| Horn language is real and patterned | "The Horn Speaks: A Sociolinguistic Analysis of Horn Honking as a Non-Verbal Communication Among Nigerian Road Users" (conclusion: "rich unwritten vocabulary"); SCIRP overview of honking-as-communication; community lexicon: "open the gate / Daddy is back / leave the way / how far / danger ahead / light don change" | http://seemjournals.fedpolyado.edu.ng/.../TheHornSpeaks...pdf (fetch timed out; title/abstract via search) · https://www.scirp.org/pdf/jss_2021082510324815.pdf · https://www.nairaland.com/8189957/safe-driving-101-understanding-road · https://www.nairaland.com/8708058/why-nigerians-honk-car-horn | journal n.d.; SCIRP 2021; Nairaland 2024/2025 | HIGH for the concept (multi-source); LOW for specific pattern→meaning mapping |
| Free shuttles launched in Lokoja (2026-09-30) | "Karimi launches free shuttle service to ease transport burden in Lokoja" | Tribune Online via Google News RSS | 2026-09-30 | MED |
| Keke vs okada engine spectral character | No measured spectra found this session → Open Question #6.4; repo law EX-11.2 "okada audible before visible" stands as design law, NIGERIA-GENERIC | — (repo: docs/Art_Audio_Bible.md:264) | — | LOW |

### 2e. Generators & power

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Avg household gets 6.6 h electricity/day | NBS Nigeria Residential Energy Demand-Side Survey 2024 (9 states, with Federal Ministry of Power) | https://www.nigerianstat.gov.ng/pdfuploads/NIGERIA_RESIDENTIAL_ENERGY_DEMAND_SIDE_SURVEY_2024.pdf · https://www.premiumtimesng.com/business/business-news/748606-average-nigerian-home-gets-only-seven-hours-electricity-daily-nbs.html | 2024 (pub. Oct 2024) | HIGH |
| Grid collapsed 12× in 2024 | Guardian + Intelpoint timeline + allAfrica; Radio Nigeria says 11; NERC 2024 annual report: 26 collapses in 5 years (see §4) | https://guardian.ng/news/nigeria-suffers-first-national-grid-collapse-in-2025/ · https://intelpoint.co/insights/nigerias-national-grid-has-collapsed-12-times-in-2024/ · https://allafrica.com/stories/202502130056.html · https://radionigerialagos.gov.ng/national-grid-collapses-for-the-first-time-in-2025/ · https://newtelegraphng.com/nigeria-a-nation-challenged-by-grid-collapses/ | 2025-02 (first 2025 collapse); ICIR: 2025-09-10 collapse https://www.icirnigeria.org/nigerians-face-more-grid-collapses-as-nerc-reports-unresolved-weaknesses/ | HIGH |
| TCN announced blackout in Kogi | "TCN announces blackout in Kogi, gives reasons" | Daily Post via Google News RSS | 2026-09-01 | MED |
| 22M small gasoline generators; 27% households, 29% MSMEs; ~50% unconnected | Dalberg/A2EI deck "Putting an End to Nigeria's Generator Crisis" (household/SME surveys n=910; alternative estimates 17M; external range 17–60M) | https://a2ei.org/resources/uploads/2019/06/A2EI_Dalberg_Putting_an_End_to_Nigeria%E2%80%99s_Generator-Crisis_The_Path_Forward.pdf | data 2018, pub. 2019 | HIGH |
| 70.7% of firms own/share generators | AfDB statement; outages cost businesses ~3 (hours/days — quote truncated in snippet) | https://www.nigeriacommunicationsweek.com.ng/2026/06/01/afdb-says-70-percent-of-nigerian-firms-depend-on-generators | 2026-06-01 | MED |
| Generator indoor noise ~80–87 dB | Ibadan residential study: mean indoor 79.97 dB, 87.4 dB during generator use (core zone), above permissible; Akure study; Benin City source-ranking | https://www.researchgate.net/publication/328582836_Characterization_and_Effects_of_Noise_Levels_of_Portable_Generators_Used_in_Residential_Buildings_in_Ibadan_Metropolis_Nigeria_A_Case_Study_Journal_of_Sustainable_Architecture_and_Civil_Engineering_49 · https://www.researchgate.net/publication/327321653_Assessment_of_noise_pollution_due_to_generators_in_Akure_Ondo_State_Nigeria · https://eajournals.org/wp-content/uploads/Comparative-Assessment-of-Noise-Sources-in-Two-Residential-Neighbourhoods-in-Benin-City-Nigeria.pdf | 2016–2018 era | MED (NIGERIA-GENERIC) |
| Kogi power institutions (for generator logic hooks) | Kogi State Electricity Regulatory Commission unveiled cost-reflective tariff plan; KERC–Geregu Power collaboration; "Okunland still trapped in darkness" feature | https://kerc.kg.gov.ng/regulations/ · LEADERSHIP 2026-06-28 & 2026-07-10 via Google News RSS · https://kogireports.com (2026-09-20) | 2026 | MED |
| "NEPA don take light / bring light" idiom | Community lexicography of power-cut phrases (Nairaland thread + guides + viral video) | https://www.nairaland.com/7920615/how-say-nepa-don-bring/3 · https://howtosayguide.com/how-to-say-nepa-has-taken-the-light/ | thread Nov 2023 | LOW (anecdotal, cultural) |
| Solar substitution trend | "Nigeria's solar boom faces cost and policy barriers" (DW) — long-run quieting factor | DW via Google News RSS | 2026-05-11 | LOW |

### 2f. Rain & wind

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja wet season May–October; ~1,000 mm/yr; RH ~60% rainy season; max 37.9 °C; Köppen Aw | Field-study climate description (Alabi 2012, cited in Adang et al.) + Wikipedia infobox | docslib paper (src 1.1) · https://en.wikipedia.org/wiki/Lokoja | 2018 / retrieved 2026-10-22 | HIGH |
| Harmattan = late Nov–mid-March, dusty NE trade wind | Routine visibility 2–5 km, severe <500 m; cool mornings, hot afternoons | https://en.wikipedia.org/wiki/Harmattan · https://skybrary.aero/articles/harmattan · https://africameteo.com/en/seasons/harmattan | retrieved 2026-10-22 | HIGH |
| Harmattan weakening/shifting (2026 discourse) | "Where did the harmattan go?" — vanishing cold season; late first haze reaching far north | https://nigeriaclimatewatch.org/where-did-the-harmattan-go-how-a-vanishing-dust-dry-season-is-redrawing-nigerias-climate/ · https://parrotnigeria.com/2026/01/07/where-is-harmattan-nigerias-vanishing-cold-season-and-questions-it-raises/ | 2026 | MED |
| Rain-on-zinc is THE Nigerian rain sound (cultural) | "Rain on Corrugated Iron Roof – Lagos Night Ambience (NEPA No Light)"; "Rain on Zinc Roof at Night… If you grew up in Nigeria, you KNOW this sound"; zinc-roof industry page: "Zinc is known to be… noisy when it rains" | https://www.youtube.com/watch?v=LncOQjYMlVg · https://www.youtube.com/watch?v=9_CmjF0wM5U · https://intisumberbajasakti.com/zinc-noisy-when-it-rains-heres-a-trick-to-reduce-it | retrieved 2026-10-22 | MED (existence/culture); acoustics numbers unsourced → synthesis by design (Open Q #6.5) |
| Floods (2022, 2024) reshape the soundscape | 2022: 600+ dead (VOA); Oct 2024: ~200 communities submerged, 2M+ displaced in Kogi; 2026: NEMA/Navy flood-preparedness in Kogi | https://www.thewatchers.us/news/2024/10/14/nigeria-floods.html (via Google News RSS; page fetch blocked) · VOA/DW/EnviroNews via RSS | 2022-10-16 · 2024-10-14 · 2026-07 | HIGH |

### 2g. River

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja = Niger/Benue confluence city | Definitional, city identity | https://en.wikipedia.org/wiki/Lokoja · https://en.wikipedia.org/wiki/Benue_River | retrieved 2026-10-22 | HIGH |
| Fishing economy paradox (Lokoja feature) | "Abundant Rivers, Scarce Fish: The Paradox of Fishing in Lokoja" — confluence city with fish scarcity; fishermen/traders profiled | https://nationalfocusng.com/2026/08/14/abundant-rivers-scarce-fish-the-paradox-of-fishing-in-lokoja/ (page fetch blocked; content via search/news index) | 2026-08-14 | MED |
| Ganaja ferry site is a documented activity node | Used as a bird-survey site (human activity + riverine habitat); supports ferry-deck sound field (repo D4) | Adang et al. (src 1.1) | 2018 | MED |
| Riverine bird palette for the river layer | Egyptian plover (10 GBIF records), pied kingfisher (4), herons/egrets (Ardeidae 3 spp.) | GBIF (src 2.1) + Adang et al. | 2018–2021 | MED |
| Dawn canoe fishing | Nigeria-generic (lake community, women inshore fishers) — NOT Lokoja-verified | https://www.theafricangourmet.com/2026/02/nigerian-fishing-lake-canoe-dawn.html | 2026-02 | LOW (NIGERIA-GENERIC) |

### 2h. Children & schools

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Street football by children is common in Nigerian streets | Photo documentation Enugu + Abuja (visual, not audio) | https://www.pexels.com/photo/children-playing-football-on-a-sunny-street-in-nigeria-35336074/ · https://www.pexels.com/photo/children-playing-football-on-abuja-street-31533073/ · https://commons.wikimedia.org/wiki/Category:Street_football_in_Nigeria | retrieved 2026-10-22 | MED (NIGERIA-GENERIC) |
| School assembly = drum/march + prayers | Field-recorded "School Assembly Morning Prayer Marching Drum" (anecdote, non-Nigeria-specific); Nigerian assembly culture blog | https://soundopedia.com/sounds/school-assembly-morning-prayer-marching-drum-sound · https://ulearngo.com (search hit: "Nigerian School Assembly: Why It Still Matters") | retrieved 2026-10-22 | LOW (assembly start-time for Lokoja unsourced → Open Q #6.6) |
| Classroom noise target | WHO: <35 dB(A) in classrooms for good teaching conditions | https://www.who.int/europe/news-room/fact-sheets/item/noise | retrieved 2026-10-22 | HIGH |
| NESREA expressly lists school-relevant behaviours as offences | "yelling, laughing, clapping, shouting, hooting, pounding, whistling and singing" in residential areas; cultural/marriage events allowed 10:00–20:00 | NESREA 2009 gazette PDF (src 4.1) | 2009-09-30 | HIGH |

### 2i. Night & insects

| Claim | Detail | Source(s) URL | Source(s) date | Confidence |
|---|---|---|---|---|
| Legal night quiet starts 22:00 | NESREA day 06:00–22:00 / night 22:00–06:00; residential night limit 35 dB(A) | src 4.1 | 2009 | HIGH |
| Bedroom-sleep target 30 dB(A) | WHO Q&A: <30 dB(A) in bedrooms; <40 dB(A) annual Lnight outside bedrooms | https://www.who.int/europe/news-room/fact-sheets/item/noise | retrieved 2026-10-22 | HIGH |
| Guard dogs barking at night = security practice | Guardian feature (estate guard attacked on night duty; guard-dog culture); Reddit r/Nigeria advice: "deterrence … through barking at night" | https://guardian.ng/features/dangerous-dog-breeds-flood-nigeria-amid-dormant-regulatory-laws/ · https://www.reddit.com/r/Nigeria/comments/18wra9q/uncles_farm_keep_getting_robbed_in_ph_any_advice/ | retrieved 2026-10-22 / 2023-12 | LOW (NIGERIA-GENERIC) |
| Cricket/frog night layer | Nigerian species-level night-insect sound evidence NOT obtainable this session (Xeno-canto blocked; searches returned generic sleep-audio channels) → Open Question #6.7; repo cricket layer 4.4 kHz band + 16 Hz square tremolo stays, NIGERIA-GENERIC | — (repo:ambience.ts:104,117-126) | — | LOW |
| Nightlife venues in Lokoja (music-bleed texture) | 29 bars, 10 nightclubs listed (review aggregator); Lounge 1 ("EXCLUSIVE NITE CLUB… CONFLUENCE CITY"); Dabs Lounge, Lokogoma Ph II | https://ranked.ng/bars/lokoja · https://ranked.ng/nightclubs/lokoja · https://www.facebook.com/lounge1lokoja/ · https://www.africa2trust.com/B2BAfrica/nigeria/entertainment/discoth-ques-night-clubs/dabs-lounge-ng/Profile/AboutUs/1/6/74039/3 | retrieved 2026-10-22 | MED |
| Night vigils (church generator + PA) run late | 2026 incident reporting (see §2b) — supports sparse late-night event generator in residential wards | src 4.4–4.6 | 2026 | MED |

### 2j. Silence & lulls

| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Quietest window is pre-dawn | Bounded by: legal night ends 06:00 (NESREA), Fajr 05:10 first scheduled call, sunrise 06:20; no source asserts a measured 02:00–04:00 minimum for Lokoja → Open Question #6.8 | src 3.1, 4.1 | 2026-10-22 / 2009 | MED (inference, not measurement) |
| "Silence" as governance | NESREA noise-control zones can be declared around hospitals/schools/residential areas; prohibited-hour offences defined | src 4.1 (regs 4-6, 14) | 2009 | HIGH |
| Midday lull not found | No source documents a Nigerian midday market lull; Gwagwalada shows the opposite (evening peak). Morning gate-open quietest at 54.5–61.5 dB | src 6.1 | Dec 2024 | MED (negative finding) |

---

## 3. The Hour-by-Hour Sound Map (04:00 → 02:00)

Grounding: prayer times = Lokoja 2026-10-22 [src 3.1]; market dB curve = Gwagwalada [src 6.1]; legal day/night = 06:00/22:00 [src 4.1]; sunrise 06:20 [src 3.1]; school/market/club activity = sources in §2; synthesis column maps to the repo's 8-layer shaped-noise grammar (A-36/A-46). Confidence reflects the *hour row* as a whole.

| Hour | Dominant sounds | Background | Occasional events | Synthesis recipe sketch (WebAudio, zero files) | Confidence |
|---|---|---|---|---|---|
| 04:00–05:00 | Deep night bed: crickets (4.4 kHz band, 16 Hz tremolo), far dogs | Room tone indoors; breeze near-silent; no grid hum if power is out (6.6 h/day truth) | Dog barking bursts (compound guard); generator of a night vigil spooling down; Lastthird 02:18 passed | Crickets: bandpass 4400 Q6 noise + square LFO 14–18 Hz, gain 0.03; dogs: filtered noise burst + saw growl 120–180 Hz envelope, random 8–20 min; everything else gain→0.0 | MED |
| 05:00–05:30 | **Fajr azan window (05:10)** over receding insects | Pre-dawn hush; late crickets thinning | Loudspeaker azan texture across Muslim quarters; first house generators starting (pre-work) | Azan texture: NON-voice — formant-ish 2-osc stack (saw 220–330 Hz + bandpass sweeps 800–2400 Hz) through a mild "PA" bandpass 400–3500 Hz + slight drive, gain by district truth (mosque proximity), 3–5 min envelope; never lexical (A-44). Generator onset: lowpass 120 Hz saw-pair + brown-noise clatter bed, 2 s rise | MED (times HIGH; texture design) |
| 05:30–06:20 | **Dawn chorus builds** to sunrise (06:20); first kekes warming | Cooler harmattan-season air carries sound further | Turaco knocking from Mount Patti slopes; plantain-eater cackles; first horn "gate" triple-beeps | Bird scheduler v2: species voices as oscillator recipes — finch chatter (sine slides 2.3–4.2 kHz, existing), dove coo (low sine 350–450 Hz w/ 4 Hz vibrato bursts), African thrush (short melodic sine phrases, pentatonic bias), plantain-eater (bandpassed noise crackle 900–1400 Hz in 3–6 burst runs), turaco (dry 0.8–1.0 kHz square knocks ×4–8). Dawn window 05:30–07:30: interval multiplier ×0.4 | MED (species presence HIGH; timing LOW) |
| 06:20–07:30 | **Legal "day" begins 06:00**; school-run traffic; children's voices return; cattle egrets commuting | Kite whistles overhead; river layer audible near confluence paths | "Up NEPA" moment if grid supply window opens (cheer + many small generators shutting down — inverse chorus); school assembly drum far off | Power-state hook: on grid-restore, global generator-gain ramp −, thin bright "cheer" band (noise, 1–2 s, distant, no words); school drum: bandpass noise thump 90–150 Hz, pattern 4/4 at ~90 bpm, district-gated | MED |
| 07:30–09:00 | **School assembly & morning classes**; keke/okada ramp to full; market gate-open (~55–61 dB per Gwagwalada) | Horns layer rises (bandpass 520); church PA tests (Sunday scale) | Assembly drum/bell; hawker motorbikes; morning azan silent (Fajr passed) | Market layer: keep lowpass 480 Hz bed; add murmur LFO 0.3 Hz; horn stabs get pattern types (see §5); assembly: room-tone + drum + crowd-murmur band (lowpass 600) gated by school proximity | MED |
| 09:00–12:00 | Market crescendo; workshops/forger rhythm; strong traffic | Sun high, breeze LFO shallower | Passing government convoy sirens (Ridge district, sparse); kite calling | Horn layer gain ×traffic truth (existing `ambience.ts:172`); add periodic "engine idle rank" (low sawtooth cluster 85–110 Hz detuned, transport district only) | MED |
| 12:00–13:00 | **Dhuhr azan (12:17)** across quarters; market continues through it | Heat lull in residential wards (fans, not sourced — LOW) | Azan + church midday service (Sundays) | Azan texture re-trigger (time-of-day truth from game clock, seasonal table from Aladhan-style calc); consider +1 h annual drift, not exact | MED |
| 13:00–15:30 | Market peak trade; schools out ~14:00–15:00 (unsourced exact time — Open Q #6.6) | Children spill into streets; street football chatter | Asr 15:38 azan; sudden shower in wet season (May–Oct truth) | Rain trigger: if wet season & event → rain layer (highpass 1400) + zinc layer per §5 rules; children: pitched "playground band" 900–1800 Hz filtered noise bursts with random pitch, daytime only | MED |
| 15:30–17:00 | Late-afternoon trade; okada peak; harmattan season: dust haze hiss, muffled distance | Distant stadium/viewing-centre murmur on match days (LOW, anecdotal) | Generator fleets on in commercial streets as evening approaches | Harmattan mode (Nov–Mar, W-64): +highpass 6 kHz hiss bed 0.015, breeze LFO depth ×1.4, global far-sound lowpass 4 kHz, bird gain ×0.6 | LOW (season MED, match-day LOW) |
| 17:00–18:15 | **Market absolute peak (Gwagwalada: 61–98.6 dB, means ~81–85)**; horns at full; **Maghrib 18:15** | Food-strip sizzle band (repo W-24); ferry horn at Ganaja | Evening church choir audible from compounds (anecdotal LOW); generator chorus at max | Market murmur + vendor-call formant blips (non-lexical, 2-note falling figure, formant band 700–1300 Hz, random 6–14 s, market-gain-scaled); Maghrib azan texture; NO new files | MED (dB curve HIGH; figures LOW) |
| 18:15–19:21 | Sunset → Isha (19:21): azan; birds' evening chorus spike then cutoff; clubs warming up | Lounges' music bleed begins (Lokogoma/nightclub wards) | Nightclubs' bass thump starts (20:00-ish, LOW) | Music-bleed: muffled loop of the game's own night mood (78 bpm) through lowpass 500 Hz + wall resonance — self-sourced, zero assets; bass: 55–70 Hz sine kicks, room-gated | MED |
| 19:21–21:00 | Isha call; compound family noise; generators at full fleet; crickets re-entering | TV/viewing-centre roar spikes (football goal moments — LOW) | Mosque PA lecture tail; party generator + music (owambe — NIGERIA-GENERIC, LOW) | Cricket layer crossfades in as bird layer exits (night boolean, existing `ambience.ts:171`); viewing-centre roar: mid-band crowd noise swell 3 s attack / 8 s decay, event-scheduled | MED (structure) / LOW (events) |
| 21:00–22:00 | **Legal night begins 22:00** — the mix must audibly *step down* (50→35 dB law) | Lounges at peak (exists until late, real city truth) | Final keke runs; vigil generator starts (some Fridays) | Master "night law" trim: all outdoor social layers ×0.6 after 22:00 in residential districts; vigil generator = single lowpass 110 Hz bed + PA mid-band murmur, rare, ward-gated | MED (law) / LOW (vigil events) |
| 22:00–00:00 | Crickets dominant; dogs as punctuation; generator hum where fuel allows; nightclub bleed pockets | River layer at its daily max clarity (city falls away) | Dog chorus triggered by strangers; distant last-bus horns | Existing night truth (crickets 4400 Q6 + night flag) + new dog-event scheduler (04:00 row recipe); keep horns ≤0.25 traffic gate (already: `ambience.ts:242`) | MED |
| 00:00–02:00 | Deepest quiet the city has: insects, one far dog, an occasional generator at a vigil or bar | Room tone indoors (lowpass 140) | Vigil song surge (event, rare); grid-collapse night silence (ALL generators already off = quieter than quiet) | "Collapse night" state: generator layer forced 0, crickets +breeze only, room layer +0.01 — the game can make grid collapse *audible as silence* (A-35 truth) | MED (structure) / LOW (frequency) |

---

## 4. Contradictions & Data Conflicts

1. **Grid collapse count, 2024:** 12 (Guardian, Intelpoint, allAfrica) **vs** 11 (Radio Nigeria Lagos) **vs** NERC's 2024 annual report "26 system collapses in the last five years" (New Telegraph). Different counting rules (full vs partial collapses). All three recorded; the game should treat "roughly monthly" as the honest cadence. 
2. **NESREA residential limits:** official 2009 gazette = **50 dB(A) day / 35 night**; AcousPlan's Nigeria summary claims "45 day / 35 night". Gazette (primary source) is authoritative; AcousPlan recorded as wrong/older draft. 
3. **Market peak levels:** Gwagwalada (Dec 2024, peer-reviewed) max 98.6 dB **vs** IJISRT (May 2025) night "means" of 122.1/119.2 dB(A) and a 127.8 dB(A) max — values that would exceed pain thresholds and the same paper's cited 70/75 dB commercial standard; likely meter misuse or non-Leq readings. Recorded; not adopted for design. 
4. **Generator dependence:** 22M small gensets / 27% of households (Dalberg 2018) vs AfDB "70.7% of firms" (2026) vs popular "over 40% of households" claims — different units (small gensets vs all gensets; households vs firms). Design uses: households ~27%+ (and higher for commerce), not a single number. 
5. **Wet-season start:** Lokoja study says rain begins **May** (Alabi 2012 via Adang) vs Nigeria-generic April-onset in popular sources. Lokoja-specific source wins for the game calendar; conflict recorded. 
6. **Harmattan strength:** classic climatology (late Nov–mid Mar, routine 2–5 km visibility) vs 2026 Nigerian reporting that the season is vanishing/arriving late. Both true across years; the game should treat harmattan as variable-year, not guaranteed. 

---

## 5. Design Seeds for the Game

All seeds obey A-2 (zero files), A-36 (layers are data), A-46 (node budget), A-44 (real voices sacred — nothing below is a voice recording or fake lexical speech), and W-57. P0 = do first.

| # | Seed | Maps to | Rule detail | Priority |
|---|---|---|---|---|
| S1 | **Rain-intensity parameter** (`rainIntensity: 0..1` instead of boolean `rain`) | `ambience.ts:21-32,169,173` | Zinc law: tick density = Poisson(λ = 2 + 30·rainIntensity) per second; tick band 4–6 kHz stays (`:230`), tick gain 0.02–0.05; rain bed gain 0.075·(0.4+0.6·rainIntensity); first 90 s of a downpour adds a low "roof-rattle swell" (brown noise, lowpass 300 Hz, ramp 4 s) — door-shutter truth. Zinc only while `rainIndoors` (existing). | P0 |
| S2 | **Generator layer** (`generator` shaped-noise layer + event scheduler) | `ambience.ts:37` layer table + `docs/World_Bible.md:246` | Band: brown-noise lowpass 120 Hz (body) + bandpass 2.2 kHz Q4 (mechanical whine, −12 dB under body); truth-drivers: `power.grid == false`, district commercial weight, hour ∈ {07–09, 17–23}; 1.8–3 s spool-up ramp with a 15 Hz LFO flutter; on grid-restore: staggered spool-downs over 4–9 s (neighbours' units off-set), matching 6.6 h/day + 12-collapse reality. | P0 |
| S3 | **Power-state audio idiom** ("NEPA don bring/take light") | `ambience.ts` + `src/game/systems/net.ts`-adjacent pulse | On restore: 0.8 s distant street "cheer" band (bandpass 900–1500 Hz noise swell, non-lexical) + S2 spool-downs; on loss: 0.4 s low thud + S2 spool-ups. Rate-limit: max 1 idiom / 5 min. | P1 |
| S4 | **Bird palette v2 (species voices)** | `ambience.ts:179-210` | Keep the finch-chitter recipe as base; add 3 voice types as data: dove-coo (sine 380 Hz, 5 Hz vibrato, 3-note phrase), plantain-eater crackle (bandpass 1000 Hz Q2 noise, 4–8 burst run), turaco knock (square 900 Hz, 5–9 dry knocks). Dawn window 05:30–07:30 → interval ×0.4; night/indoors gates unchanged. Palette justified by Adang's family census + GBIF. | P1 |
| S5 | **Azan/church "call window" scheduler** (factual, non-caricature) | new data table consumed by `ambience.ts` | 5 daily windows from a precomputed seasonal table (Aladhan MWL for 7.8024 N, 6.7431 E; store per-game-month times, not live API). Texture = PA-band formant pad (see §3 05:00 row), district-gated by mosque proximity, gain capped under NESREA "mixed residential" vibe. Church side: Sunday-morning + evening choir-bleed via the same PA-band pad on a different melodic bias (the music engine's pentatonic vs a mode shifted +3 semitones). No speech synthesis of any kind. | P1 |
| S6 | **Horn-language patterns** | `ambience.ts:240-257` | Replace single random stab with pattern classes: gate-triple (3×120 ms), greet-double (2×200 ms, fifth interval up), move-long (600–900 ms), danger-freight (1.2 s + repeat). Base 300–500 Hz detuned saw pair stays; class weights by district (transport park → greet-heavy; junction → move-long). Grounded in the sociolinguistics sources. | P1 |
| S7 | **Harmattan mode** | `ambience.ts` update() + calendar (`config.ts:658` yearDays) | Nov 15–Mar 15 window (game-calendar equivalent): breeze LFO depth ×1.4, +dust hiss layer (highpass 6 kHz, gain 0.012), global far-field lowpass 4 kHz (muffles market/horn at distance), bird gain ×0.6, music lead −2 dB. Matches W-64 (season changes one sound) and harmattan sources. | P1 |
| S8 | **Market vendor-call texture** (non-lexical) | `ambience.ts` market layer | Two-note falling formant blips (osc through 2 bandpass formants 700/1300 Hz), random 6–14 s, gain ∝ market proximity × time-of-day curve peaking 17:00–19:00 (Gwagwalada truth). Must never resemble words (A-43). | P2 |
| S9 | **Dog-event scheduler** | `ambience.ts` (new timer alongside `scheduleBirds`) | Night-only (21:00–04:30), 8–20 min spacing, 2–4 bark bursts (bandpass noise 400–900 Hz + saw 150 Hz envelope), far-field by default. NIGERIA-GENERIC, LOW — keep gain small. | P2 |
| S10 | **Collapse-silence state** | ambience update() | When `power.grid == false` all night AND generator fuel-scarcity flag: generator layer forced 0, crickets +0.01, room +0.005 — silence becomes an event the player *hears*. (A-35: the mix is the census.) | P2 |
| S11 | **Flood-season river truth** | river layer (`:167`) | During flood calendar window (Sep–Oct game-months, per 2022/2024 history): river gain radius 85 → 140 m, +hull-knock events near Ganaja/ferry (bandpass 180 Hz, 3 s spacing jitter). | P2 |
| S12 | **Night-law trim** | update() | 22:00 game-time: outdoor social layers ×0.6 in residential districts (NESREA night 22:00 anchor); government ridge district already quiet — enforce WHO 30–35 dB vibe as "quietest outdoor district" (`World_Bible.md:228`). | P0 (cheap constant) |
| S13 | **Music**: no bpm/scale change; harmattan trim only (S7) | `music.ts:30-46` | Keep C-pentatonic 261.63, bpm {108,100,92,78}, maxVoices 8 — nothing in the evidence contradicts the grammar; the night 78 bpm mood already sits under the 22:00 law. | — (no change) |

Node-budget note (A-46): S1 adds ~0 nodes (reuses zinc timer), S2 = 2 sources + 2 filters + 1 gain, S4 = per-call short-lived voices inside the existing bird budget, S5/S8 = event voices inside existing timers. No new always-on nodes beyond S2's one pair and S7's one hiss node — total always-on layers 8→10, still far under the "budgeted like draw calls" law.

---

## 6. Open Questions

1. **Xeno-canto / eBird for Kogi** — both bot-blocked on 2026-10-22; need a later pass for actual Nigerian field recordings of: violet turaco knock, western plantain-eater cackle, laughing-dove phrase, Senegal coucal, African thrush — to tune the S4 oscillator recipes by ear. 
2. **Mosque/church counts per Lokoja ward** — no source found for density; needed to place the S5 call-window scheduler truthfully (sensitive — keep factual). 
3. **Vendor/hawker call vocabulary in Lokoja specifically** — searches returned nothing citable; a Nairaland/Youtube pass may yield the local (Oworo/Ebira/Yoruba/Nupe/Hausa mix) call figures; until then S8 stays non-lexical. 
4. **Keke vs okada engine spectra** — no measured data found; would like an in-field recording reference (any Nigerian city) to set the saw-pair fundamentals. 
5. **Rain-on-zinc acoustics numbers** — no dB/spectrum paper found; current 3.2 kHz band + 4–6 kHz ticks are design choices, plausible but unmeasured; an acoustics paper on corrugated-metal rain noise would firm S1. 
6. **Exact school assembly start time in Kogi public schools** (~07:30–08:00 assumed, unsourced) — check Kogi State Ministry of Education or a school's public timetable. 
7. **Nigerian night-insect species & chirp rates** (Lokoja floodplain frogs?) — needs Xeno-canto or a Nigerian bioacoustics source; current cricket layer is NIGERIA-GENERIC. 
8. **Measured pre-dawn minimum for Lokoja** (02:00–04:00 as quietest) — inferred, not measured; any Kogi noise survey would settle it. 
9. **"Up NEPA" cheer documentation** — related idiom threads found ("NEPA don bring light"), but the cheer itself needs a citable clip/source before S3's cheer band is more than anecdote-grounded. 
10. **Kogi State noise-enforcement analog** (Kogi Ministry of Environment / KESWAMA?) — does a LASEPA-equivalent operate in Kogi? Determines whether an in-game "noise complaint" civic mechanic has a real-world anchor. 

---

## 7. Source Registry

**Scientific / peer-reviewed**
- Adang, K.L., Tanko, D., Kachi, J., Abdulwahab, U.A. (2018). *Bird Species Richness and Diversity of Lokoja and Environs, Kogi State, Nigeria.* Proc. 6th NSCB Biodiversity Conf., 117–124. https://docslib.org/doc/6017970/bird-species-richness-and-diversity-of-lokoja-and-environs-kogi-state-nigeria (RG mirror: https://www.researchgate.net/publication/346416175)
- Makwe, E., Uka, C., John-Nwagwu, H.O. (Dec 2024). *Evaluation of Noise Levels in an Urban Market, FCT, Nigeria.* Azojete 20(4):855-862. https://azojete.com.ng/index.php/azojete/article/download/987/564/
- Ayoola, O.J., Afeonkhai, E., Ayenajeyi, D.S. (May 2025). *Characterization of Noise Pollution in Market Environments Across AMAC, FCT.* IJISRT. https://www.ijisrt.com/assets/upload/files/IJISRT25MAY1228.pdf
- *Characterization and Effects of Noise Levels of Portable Generators Used in Residential Buildings in Ibadan Metropolis* (JSACE / RG). https://www.researchgate.net/publication/328582836
- *Birds species composition and abundance … Mount Patti, Lokoja.* Braz. J. Biol. Sci. 6(12):271-282. https://www.researchgate.net/publication/333345746
- Tanko, D. et al. *Comparison of avian species diversity and abundance … Zone 8, Lokoja.* https://www.ajol.info/index.php/tzool/article/view/237124
- *What Do Car Horns Say? An Overview of the Non-Verbal Communication of Horn Honking.* JSS (SCIRP), 2021. https://www.scirp.org/pdf/jss_2021082510324815.pdf
- *The Horn Speaks: A Sociolinguistic Analysis of Horn Honking … Among Nigerian Road Users.* SEEM Journals (fedpolyado). http://seemjournals.fedpolyado.edu.ng/storage/published/JEES-VASTBD-7101760-TheHornSpeaks...pdf
- GBIF.org occurrence API, Kogi State Aves (retrieved 2026-10-22). https://api.gbif.org/v1/occurrence/search?country=NG&stateProvince=Kogi&classKey=212

**Official / primary**
- Federal Republic of Nigeria. *National Environmental (Noise Standards and Control) Regulations 2009* (Official Gazette; NESREA). https://nesrea.gov.ng/wp-content/uploads/2025/05/Noise_Standards_and_Control_Regulation-2009-.pdf
- NBS. *Nigeria Residential Energy Demand-Side Survey Report 2024.* https://www.nigerianstat.gov.ng/pdfuploads/NIGERIA_RESIDENTIAL_ENERGY_DEMAND_SIDE_SURVEY_2024.pdf
- Dalberg / A2EI (2019). *Putting an End to Nigeria's Generator Crisis.* https://a2ei.org/resources/uploads/2019/06/A2EI_Dalberg_Putting_an_End_to_Nigeria%E2%80%99s_Generator-Crisis_The_Path_Forward.pdf
- Aladhan prayer-times API, Lokoja coords (retrieved 2026-10-22). https://api.aladhan.com/v1/timings/22-10-2026?latitude=7.8024&longitude=6.7431&method=3
- Kogi State Government / Kogi State Electricity Regulatory Commission. https://kogistate.gov.ng · https://kerc.kg.gov.ng/regulations/
- WHO Europe. *Noise fact sheet.* https://www.who.int/europe/news-room/fact-sheets/item/noise
- Wikipedia: *Lokoja*, *Harmattan*, *Loudspeakers in mosques*, *Benue River*. https://en.wikipedia.org/wiki/Lokoja etc.

**News / features**
- Guardian (2025-02): first grid collapse of 2025 — https://guardian.ng/news/nigeria-suffers-first-national-grid-collapse-in-2025/
- Intelpoint (2024): 12 collapses timeline — https://intelpoint.co/insights/nigerias-national-grid-has-collapsed-12-times-in-2024/
- allAfrica (2025-02-13); ICIR (2025-09-10 collapse); New Telegraph (NERC 26-in-5-years) — URLs in §2e
- Premium Times (2021): NESREA vs worship loudspeakers — https://www.premiumtimesng.com/news/more-news/470220-...
- Vanguard (2025-05): Lagos noise clampdown — https://www.vanguardngr.com/2025/05/noise-pollution-lagos-talks-tough-...
- RFI (2019-11-18): Lagos worship shutdowns — https://www.rfi.fr/en/international/20191118-...
- Premium Times (2024-10): 6.6 h/day NBS finding — https://www.premiumtimesng.com/business/business-news/748606-...
- The Reporters (2024-09-09): keke/okada hardship in Kogi — https://thereporters.com.ng/2024/09/09/...
- latestnigeriannews/Tribune + Nigerian Post: Kogi okada/keke highway ban — URLs in §2d
- Tribune (2026-09-30): Lokoja free shuttles; Kogi State Govt (2026-10-08): ultra-modern market inspection; muslimvoice (2026-01-31): ₦50bn Sukuk — via Google News RSS
- National Focus (2026-08-14): *Abundant Rivers, Scarce Fish: fishing in Lokoja* — https://nationalfocusng.com/2026/08/14/abundant-rivers-scarce-fish-the-paradox-of-fishing-in-lokoja/
- The Watchers (2024-10-14); VOA (2022-10-16); EnviroNews (2026-07-20); Channels TV (2026-07-09); gwg.ng (2026-03-07); The Nigerian Lawyer (2026) — flood & vigil noise items, URLs in §2
- NigeriaClimateWatch (2026); ParrotNigeria (2026-01-07): harmattan shift — URLs in §2f
- Nigeria Communications Week (2026-06-01): AfDB 70.7% firms on generators — https://www.nigeriacommunicationsweek.com.ng/2026/06/01/...
- DW (2026-05-11): Nigeria's solar boom — via Google News RSS

**Community / anecdotal**
- Nairaland: horn lexicon threads (8189957, 8708058); "NEPA don bring light" thread (7920615, Nov 2023)
- Reddit r/Nigeria (2023-12): guard dogs at night — https://www.reddit.com/r/Nigeria/comments/18wra9q/
- YouTube field-ambience channels: "Rain on Corrugated Iron Roof – Lagos Night Ambience (NEPA No Light)" https://www.youtube.com/watch?v=LncOQjYMlVg · "Rain on Zinc Roof at Night" https://www.youtube.com/watch?v=9_CmjF0wM5U (label: ambience channels, possibly synthesized — culture evidence, not acoustics evidence)
- Soundopedia: school assembly drum recording anecdote — https://soundopedia.com/sounds/school-assembly-morning-prayer-marching-drum-sound
- ranked.ng bar/nightclub lists for Lokoja; Lounge 1 Facebook; Dabs Lounge profile — URLs in §2i
- Pexels/Wikimedia street-football photo documentation — URLs in §2h

*End of Team 7 raw evidence base — no files outside this document and the worklog were touched.*
