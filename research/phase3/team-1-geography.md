# Team 1 — Geography & Environment · raw evidence base (Phase 3 Prelude)

Agent: Team 1 (GEOGRAPHY & ENVIRONMENT) · Compiled 2026-10-22 · Rerun run (time-boxed)
Method note: no WebSearch tool in this sandbox — research done via Wikipedia API, sunrise-sunset.org API, Crossref API, GBIF API, Google News RSS (NG edition) and direct article fetches. Every claim carries ≥1 URL or is explicitly flagged (NIGERIA-GENERIC / Open Question). Repo facts cited as repo:path:line.

---

## 1. Executive Findings (≤25 bullets, each ends [src N])

1. **Lokoja is a tropical wet-and-dry (Aw) savanna city on the floor of the Niger–Benue confluence**: rain begins May and typically ends October (Wikipedia says rain starts May; Kogi State article says April–October) — the two are recorded as a near-contradiction and bridged as April≈onset / May≈steady. [src 1, 3]
2. Annual rainfall ≈ **1,000–1,300 mm** (Lokoja wiki ≈1,000 mm; Kogi State 1,100–1,300 mm); max temperatures ≈ **37.9 °C** fall between December and April, not in the wet season. [src 1, 3]
3. Dry season runs **November–March** and is "very dusty and cold as a result of the north-easterly winds, which bring in the harmattan" — harmattan is the Kogi-default dry-season state. [src 3]
4. **Mount Patti is 458 m / 1,503 ft** (Wikipedia), "~450 m" per the repo — the 8 m gap is a stylisation-vs-source delta, both recorded. [src 2; repo docs/World_Bible.md:75]
5. "Patti" is the **Nupe word for hill**; Mount Patti is where Flora Shaw (Lugard) coined "Nigeria" (Times essay, 8 Jan 1897), looking at the Niger and Benue "6 kilometers away" from the summit. [src 2]
6. The confluence is real and sits at the city's edge; the game's origin **6.753°E/7.790°N** matches Wikipedia's Lokoja coordinates (7.8023°N, 6.7333°E) to within ~1.5 km. [src 1; repo docs/World_Bible.md:51]
7. **Sunrise/sunset barely move** at 7.8°N: sunrise 06:17–06:41, sunset 18:21–18:52 WAT all year; day length only 11 h 40 m → 12 h 35 m. Golden hour is a *narrow* ~25-minute window (civil twilight ±~20–24 min). [src 4]
8. Solar noon is late on the clock: **~12:31–12:40 WAT** (timezone offset vs 6.75°E) — the visual "high sun" moment lands after 12:30 game-time. [src 4, computed]
9. Lokoja is inside the tropics (7.8°N): the sun passes **near-overhead twice a year** (≈April & ≈September); noon shadows are ~59° solar elevation in December vs ~84° in June — computed from latitude. [src 4 + computed, NIGERIA-GENERIC astronomy]
10. **Floods are the city's defining environmental event**: 2012 displaced 623,690 people in Kogi (87 camps, ₦63.4 bn damage, 9 LGAs); October 2022 submerged Lokoja — canoes took over the highway, FRSC diverted the Abuja route, national toll >500 dead; 2024 floods submerged ~200 communities with ~2 M displaced nationally per one report. [src 3, 5]
11. The 2022 flood peak at Lokoja was early–mid **October** — the flood state in seasons.ts belongs to Sep–Oct, after the rains slacken. [src 5]
12. NIHSA (Nigeria Hydrological Services) issues **red alerts when Niger & Benue water levels rise** (LEADERSHIP 2025-09-23) and reports Benue receding in early October 2024 — river level is a real, reported daily-ish quantity. [src 8]
13. **The famous "two-coloured waters" confluence photo circulating online is NOT the Niger–Benue at Lokoja** (Dubawa fact-check, 2023) — the in-game confluence must show a *subtle* colour seam, not a postcard hard line. [src 8]
14. Geology: Lokoja sits on the **Lokoja Formation (Campanian–Maastrichtian sandstone, southern Bida/Nupe Basin)** — studied at Felele Junction, Koton-Karfe and Nataco-Banda, all in-game places. NOT the granite basement complex. [src 7]
15. The city has "an abundance of hills" popular for hunting (Agbaja hill named); earliest settlers lived ON Mount Patti before moving down to the riverbank. [src 1]
16. GBIF holds **~1,476 occurrence records for Kogi State** (up to 2026) — species-level evidence for the flora palette is extractable. [src 10]
17. Vegetation context: Kogi tourism names Mount Patti, the confluence, and "natural land features hills and terrains that serve as hiking trails"; Ogidi's igneous rock mountains are in-state but not Lokoja's. [src 3]
18. Erosion is a live environmental story in Lokoja ("Residents fear epidemic outbreak as erosion devastates Lokoja", Daily Trust 2023-08-02) — gullies belong in the world's ground texture. [src 9]
19. Harmattan dust haze is **forecast by NiMet** in multi-day episodes (e.g. "three-day dust haze from Friday", Premium Times 2024-12-20) and disrupts aviation (LEADERSHIP 2025-12-10) — episodic, not constant. [src 6]
20. Lokoja's own Wikipedia climate section gives **average relative humidity ≈60% in the rainy season** and a Dec–Apr max-temp band of 37.9 °C. [src 1]
21. Kogi State borders ten states; the Niger is the state's western seam (Niger State "mostly across the Niger River") — the river is the boundary itself. [src 3]
22. Mount Patti carries a 1865-built first primary school of Northern Nigeria and Lugard's rest house — the summit is heritage ground, matching patti.ts secrets. [src 2, 1; repo docs/World_Bible.md:75]
23. Flood history rhyme: 2018 (Vanguard "thousands of houses submerged in Kogi"), 2020 (Ganaja road), 2022 (worst), 2024 (200 communities) — a repeating ~2-year drumbeat usable for world events. [src 5]
24. Wind: the only wind Lokoja's sources *name* is the **NE harmattan wind** (Kogi wiki); confluence thunderstorms and storm gusts are NIGERIA-GENERIC until a source lands. [src 3; NIGERIA-GENERIC]
25. Honest gap: **soil series, dust chemistry, night-sky darkness, and 2024 Lokoja-specific flood depths** remain unverified this run — see Open Questions. [—]

## 2. Evidence Tables

### 2.1 Terrain & city setting
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja lies at the Niger–Benue confluence, capital of Kogi | City intro | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | HIGH |
| Coordinates ≈ 7.8023°N, 6.7333°E | ~1.5 km from game origin 6.753°E/7.790°N | https://en.wikipedia.org/wiki/Lokoja ; repo docs/World_Bible.md:51 | fetched 2026-10-22 | HIGH |
| ~165 km SW of Abuja as the crow flies | City geography | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | HIGH |
| Suburbs: Felele, Adankolo, Otokiti, Ganaja | Matches game districts | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | HIGH |
| City has "an abundance of hills", Agbaja hill hunting ground; earliest settlement ON Mount Patti | Hills around town; hilltop→riverbank settlement drift | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | MED |
| Flat riverside city with terraced slopes toward Patti (repo authored terrain) | heightAt: sine noise + Patti mound + terraces + river carving | repo src/game/world3d/layout.ts:834-889 (via docs/World_Bible.md:96,101) | v2.2 2026-10-21 | HIGH (repo) |

### 2.2 The Confluence
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Confluence renders at city edge, 0.00 u error vs real geography (repo) | Law W-3 sightline: two-river seam visible from Deck & Patti summit forever | repo docs/World_Bible.md:63-71 | v2.2 2026-10-21 | HIGH (repo) |
| Confluence of Niger and Benue is a named Kogi tourist attraction | Alongside Mount Patti, Lugard House, cenotaph | https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-22 | HIGH |
| Viral "two-colour" confluence photo is false/not Lokoja | Dubawa fact-check: picture circulating as Niger–Benue is another water body | https://dubawa.org/viral-picture-of-confluence-not-river-niger-and-benue/ (via Google News RSS item, 2023-10-26) | 2023-10-26 | MED |
| From Mount Patti summit, Niger & Benue view "6 kilometers away" (wiki phrasing) | Naming-of-Nigeria lore tied to the view | https://en.wikipedia.org/wiki/Mount_Patti | fetched 2026-10-22 | MED |
| Confluence tourism "untapped centuries after" | Daily Trust longread title | https://dailytrust.com/tourism-potentials-of-rivers-niger-benue-confluence-untapped-centuries-after/ (via GNews RSS, 2021-02-27) | 2021-02-27 | MED |

### 2.3 Hydrology — Niger & Benue at Lokoja
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Both Niger and Benue navigable waterways | Kogi transport section | https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-22 | HIGH |
| NIHSA red alert as Niger/Benue levels rise (Sep 2025) | Flood-season alarm pattern | https://leadership.ng/ (GNews RSS item "Kogi On Red Alert As Rivers Niger, Benue Water Levels Rise", 2025-09-23) | 2025-09-23 | MED |
| Benue levels recede early Oct 2024, easing flood threat — NIHSA | Seasonal level curve: peak Sep–Oct, recede Oct | The Guardian Nigeria via GNews RSS, 2024-10-05 | 2024-10-05 | MED |
| FG warned of imminent flooding along Benue & Niger (Oct 2024) | Vanguard item | via GNews RSS, 2024-10-17 | 2024-10-17 | MED |
| 2018: floods submerged thousands of houses in Kogi; 100 killed nationally (VOA/NEMA) | Prior flood years | Vanguard + VOA via GNews RSS, 2017-09-11 / 2018-09-17 | 2018 | MED |
| Rivers in-game: 16 river ways, 16 bridges, water = law-protected barrier | Repo ground | repo docs/World_Bible.md:84-90 | v2.2 2026-10-21 | HIGH (repo) |

### 2.4 Mount Patti
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Height **458 m (1,503 ft)** above sea level | Wikipedia infobox claim in lede | https://en.wikipedia.org/wiki/Mount_Patti | fetched 2026-10-22 | HIGH |
| Repo models "~450 m real" compressed to 30 u mound | Lawful stylisation | repo docs/World_Bible.md:55,75 | v2.2 2026-10-21 | HIGH (repo) |
| "Patti" = Nupe for hill | Etymology | https://en.wikipedia.org/wiki/Mount_Patti | fetched 2026-10-22 | HIGH |
| Flora Shaw coined "Nigeria" (Times, 8 Jan 1897) viewing from Patti | Naming lore, respectful tradition | https://en.wikipedia.org/wiki/Mount_Patti | fetched 2026-10-22 | HIGH |
| Lugard & colonial officials resided on the mountain 1900; Rest House | Colonial heritage layer | https://en.wikipedia.org/wiki/Mount_Patti | fetched 2026-10-22 | MED |
| First primary school in Northern Nigeria (1865) on Patti | Heritage | https://en.wikipedia.org/wiki/Mount_Patti | fetched 2026-10-22 | MED |
| Hunter-names tree (Ajami + Latin script) on Patti | Living-culture detail | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | MED |
| Kogi Govt inaugurated committee for **maiden Mount Patti Race** + facility upgrade (2026) | Modern use of the hill | Kogi State Government via GNews RSS, 2026-05-07 | 2026-05-07 | HIGH (official) |
| 2021 MOU: Lokoja International Resort on Mt Patti | Development threat/ambition | Kogi Reports via GNews RSS, 2021-07-07 | 2021-07-07 | LOW |

### 2.5 Geology & soil
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja Formation = Upper Cretaceous (Campanian–Maastrichtian) sediments, southern Bida Basin | Facies/depositional environments paper | https://doi.org/10.4314/jmg.v39i1.18789 (J. Mining & Geology 39(1), 2003) | 2003 | HIGH |
| Lokoja Formation exposed at **Felele Junction** (in-game district) | Sandstone facies at the city's own ground | https://doi.org/10.54908/iljs.2018.05.01.001 (Ilorin J. Science 5(1), 2018) | 2018 | HIGH |
| Nataco–Banda sediments of Lokoja Formation studied | Nataco = in-game transport park area | https://doi.org/10.4314/jasem.v26i11.15 (JASEM 26(11), 2022) | 2022 | HIGH |
| Outcropping sandstone facies at Koton-Karfe (across the Benue) | Hydraulic-conductivity study — sandy, permeable ground | https://doi.org/10.65760/paaujs.v1i1.10 (Paaua Science J., 2026) | 2026 | MED |
| Gully erosion devastating parts of Lokoja, epidemic fears | Daily Trust report | Daily Trust via GNews RSS, 2023-08-02 | 2023-08-02 | MED |
| Basement complex / younger granite claims for Lokoja | NOT verified for Lokoja city itself — nearby Ogidi igneous mountains are in-state; Kogi basement-complex mapping unresolved this run | https://en.wikipedia.org/wiki/Kogi_State (Ogidi igneous rock) | fetched 2026-10-22 | LOW → Open Question |

### 2.6 Vegetation (species-level)
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja in "tropical wet and dry savanna climate zone" (= Guinean forest–savanna mosaic setting) | Zone statement | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | HIGH |
| Game flora = 10 Kogi species (neem, mango, cashew, shea, oilpalm, raffia, plantain, iroko, baobab, acacia) with silhouettes | Repo species set | repo src/game/world3d/flora-species.ts:26-31 | current | HIGH (repo) |
| GBIF: 1,476 occurrences recorded for Kogi State (incl. 2026 records) | Species-level corroboration pending facet pull | https://api.gbif.org/v1/occurrence/search?country=NG&stateProvince=Kogi | fetched 2026-10-22 | MED |
| Kogi agriculture: cashew, palm oil, cocoa, coffee, groundnut, maize, cassava, yam, rice, melon | Cultivated tree/field species context | https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-22 | HIGH |
| Savanna tree species of Kogi (shea, locust-bean, iroko, neem, acacia…) in the wild | NOT yet pinned to Lokoja-specific sources this run | Open Question | — | LOW |

### 2.7 Soil & dust
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Dry season "very dusty… north-easterly winds bring in the harmattan" | Kogi-wide | https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-22 | HIGH |
| NiMet forecasts multi-day dust haze episodes (Dec 2024) | Episodic harmattan dust | Premium Times via GNews RSS, 2024-12-20 | 2024-12-20 | MED |
| Harmattan disrupts aviation (Dec 2025), Kano health alerts (Jan 2026) | Nigeria-wide harmattan intensity 2025-26 | LEADERSHIP via GNews RSS 2025-12-10; Peoples Gazette 2026-01-19 | 2025-12/2026-01 | MED |
| Sandy, permeable sandstone-derived soils (Lokoja Fm outcrops) | Hydraulic conductivity of Lokoja Fm sandstone | https://doi.org/10.65760/paaujs.v1i1.10 | 2026 | MED |
| Soil series/chemistry for Lokoja | Unverified this run | — | — | Open Question |

### 2.8 Floods (2012 / 2018 / 2020 / 2022 / 2024)
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| 2012: 623,690 displaced, 87 camps in Kogi; ₦63.4 bn damage; roads unmotorable; schools = refugee camps | Kogi wiki flooding section | https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-22 | HIGH |
| Oct 2022: 9 riverine LGAs hit incl. Lokoja (gov. Bello) | Kogi wiki | https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-22 | HIGH |
| 2022-10-07: **Canoes take over highway, streets** as flood ravages Lokoja | Daily Trust | https://dailytrust.com/ (GNews RSS item) | 2022-10-07 | MED |
| 2022-10-07: FRSC diverts traffic off Lokoja–Abuja highway | Premium Times | GNews RSS item | 2022-10-07 | MED |
| 2022-10-08: Lokoja floods → fuel scarcity in Abuja (transporters) | Guardian NG | GNews RSS item | 2022-10-08 | MED |
| 2022-10-14: national death toll >500 (ministries) | Reuters | GNews RSS item | 2022-10-14 | MED |
| ReliefWeb synoptic damage map of Lokoja 4 Oct 2022 | Satellite extent product | ReliefWeb via GNews RSS, 2022-10-11 | 2022-10-11 | MED |
| 2024-10-14: "Over 2 million displaced, 200 communities submerged as severe floods hit Kogi" | The Watchers | GNews RSS item | 2024-10-14 | MED (single source, headline-level) |
| 2018 floods: thousands of houses submerged in Kogi | Vanguard | GNews RSS item, 2017-09-11 & 2018-09 items | 2017-2018 | LOW-MED |
| Repo flood law: flood day closes the Confluence location; storm/flood read as rain family | weatherBlocksLocation / RAIN_FAMILY | repo src/game/systems/seasons.ts:32-54 | current | HIGH (repo) |

### 2.9 Seasons & timing
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Rainy season April–October (Kogi); rain begins May–ends October (Lokoja city) | CONTRADICTION recorded — bridge: April onset possible, May steady | https://en.wikipedia.org/wiki/Kogi_State ; https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | HIGH both, mutually off-by-a-month |
| Dry season November–March, harmattan dust NE winds | Kogi | https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-22 | HIGH |
| Rainfall 1,000 mm (Lokoja) vs 1,100–1,300 mm (Kogi state) | Range recorded | src 1 / src 3 | fetched 2026-10-22 | HIGH |
| Max temp 37.9 °C Dec–April | Lokoja wiki climate | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | MED |
| RH ≈60% rainy season | Lokoja wiki climate | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | MED |

### 2.10 Sky, sun, night
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Sunrise/sunset (equinox, 2026-03-20): 06:37:02 / 18:43:51 WAT; civil twilight 06:16:15 / 19:04:38 | API for 7.790N 6.753E | https://api.sunrise-sunset.org/json?lat=7.790&lng=6.753&date=2026-03-20&tzid=Africa/Lagos | fetched 2026-10-22 | HIGH |
| June solstice: 06:17:29 / 18:52:08, day 12:34:39 | Longest-ish day but sunrise EARLIEST near June | same API, date=2026-06-21 | 2026-06-21 | HIGH |
| December solstice: 06:40:52 / 18:21:12, day 11:40:20 | Shortest day; sunset before 18:30 | same API, date=2026-12-21 | 2026-12-21 | HIGH |
| Solar noon ~12:31–12:40 WAT; astronomical twilight ~05:00–05:28 | Derived from API fields | same API | fetched 2026-10-22 | HIGH |
| Sun near-overhead twice yearly (Apr/Sep); Dec noon elevation ≈59°, Jun ≈84° | Computed from lat 7.8°N + solar declination | computed (astronomy, NIGERIA-GENERIC) | — | MED (computation) |
| Night sky / moonlight / light pollution | Unverified this run | — | — | Open Question |

**Method for §3.** The sun clock below is *sourced* (sunrise-sunset.org API for 7.790°N/6.753°E, [src 4]); all five weather states share it — only the *look* changes. Colour/air/water/land/sound descriptions are design translations of the sourced facts (harmattan dust [src 3, 6], rainy humidity + May–Oct rain [src 1, 3], storm roof-loss [src 11], flood canoe streets [src 5], repo weather states `seasons.ts:32-54`). Items marked **(DI)** are design inference from those facts, not independent observations. Sound hints align with research/phase3/team-7-audio.md layers.

### 3.1 State: CLEAR DRY SEASON (Nov–Mar, non-haze days)
| Hour | Sky & light | Air | Water | Land | Sound hint |
|---|---|---|---|---|---|
| 04:00 | Fully dark; astronomical twilight starts ~05:00–05:28 [src 4]; stars possible (light pollution unverified — OQ) | Cool, still, dust settled | Black sheet, faint stars; low flow | Cold laterite, dew-less (dry); lamps dominate | Deep night layer, distant dog, generator idle |
| 05:00 | First grey-blue east; nautical twilight 05:27–05:52 [src 4] | Coldest hour; crisp | Pearly reflections | Silhouettes only; Patti a black wedge | First doves; pre-dawn murmur |
| 06:00 | Civil twilight 05:54–06:18, sunrise 06:37–06:41 [src 4] — golden seam east over the Niger | Warming; dust motes at lamp-off | Gold path on water; boats stir | Long west shadows; smoke threads from cooking fires | Azan band; compound stir |
| 07:00 | Low warm sun, amber→white | Dry; dust from first traffic | Glinting; fishermen out | Shadows shorten fast; brown-grass tint | Traffic rises; keke horns |
| 08:00–10:00 | Bright white; haze-free days have hard edges | Dry, warming toward 30s °C | Hard glitter; sandbars visible | Bleached roads, gold-brown grasses, green only in compound trees | Market build; school chatter |
| 12:00–13:00 | Solar noon 12:31–12:40 WAT [src 4]; sun ≈59° up in Dec [computed] — noon shadows point N-ward, moderate length | Hot, dry; heat shimmer | Glare patch; boats hug shade lines | Flat light, bleached colour; dust devils possible (DI) | Mid-market peak (team-7: 81–98 dB) |
| 15:00–17:00 | Warm amber slant returns | Very hot, driest air | Bronze sheen | Long shadows; Patti faces catch red light | Slow afternoon; generators |
| 18:00–19:00 | **Sunset 18:21 (Dec)–18:52 (Jun)**; golden window ≈17:45–18:25; civil twilight ends 18:44–19:15 [src 4] | Cooling fast | Copper water; canoe silhouettes | Orange walls; dust lit by low sun | Maghrib azan; night-market stirs |
| 20:00–24:00 | Dark by ~19:15; moon and stars on clear nights (OQ: darkness) | Cool, calm | Black; shore lamps only | Fire-glow compounds; lamp constellations (492 lamps repo) | Night market hum; crickets |

### 3.2 State: HARMATTAN (Nov–Mar episodes, NiMet-forecast dust haze)
| Hour | Sky & light | Air | Water | Land | Sound hint |
|---|---|---|---|---|---|
| 04:00–05:00 | Dark but *milky*; no stars; skyglow dust-diffused | Coldest, dry to cracking; NE dust wind [src 3] | Invisible | Sound-carries oddly (DI) | Sparse; wind hiss |
| 06:00–07:00 | Sunrise is a *pale disc* through orange-grey haze; weak gold, no glare | Dust visible in every beam; visibility down (NiMet haze episodes [src 6]) | Matte grey-pink; no glints | Distant Patti bluish-faded; dust film on roofs and cars | Muffled morning layer; coughs |
| 08:00–11:00 | Haze thins slightly; sun white-card, shadows faint | Dry wind; lips crack; fine grit | Flat pewter | Bleached browns; hills lost behind veil | Dull market; no sparkle |
| 12:00–14:00 | Weak white overhead; sky whitish, horizon tan | Hot-but-hazy; 37.9 °C Dec–Apr max band [src 1] | Dull brown; heat shimmer cut by haze | Sun-bleached streets; tyre dust lines | Compressed city sound |
| 17:00–19:00 | **Early dirty-orange sunset 18:21–18:52 [src 4]**; sun a red smear setting through dust | Wind drops, dust hangs | Oxblood water; no reflections | Amber everything; lamp halos ring early | Maghrib; generators cough |
| 20:00–24:00 | Hazy night; moon = ringed glow (DI, NIGERIA-GENERIC optics); stars gone | Chilly nights (harmattan "cold" [src 3]) | Invisible | Everything furred with dust by morning | Quiet; wind gusts on zinc |

### 3.3 State: RAINY SEASON (Apr/May–Oct, non-storm days)
| Hour | Sky & light | Air | Water | Land | Sound hint |
|---|---|---|---|---|---|
| 04:00–05:00 | Dark, overcast grey-green; no stars | Warm-humid, RH high [src 1]; heavy | Dead matte | Frogs near drains | Frog chorus; dripping zinc |
| 06:00–07:00 | Dawn filtered pink-grey through cloud; sunrise 06:17–06:41 [src 4] behind cloud wall | Steam after night rain; petrichor | Swollen, brown, eddies at banks | Wet-red mud roads; vivid greens; mist on Patti slopes (DI) | Birds; puddle steps |
| 08:00–11:00 | Broken cumulus, white-hot patches between | Humid; drying mud | Rising brown; fishermen cautious | Rich green everywhere; rain trees drip | Market humid hum |
| 12:00–13:00 | Sun near-overhead Apr/Sep [computed]; clouds build from SW by noon | Oppressive before afternoon build | Dull glare between clouds | Puddle law live (repo W-6): water sits on clay patches | Cicadas; distant first thunder (DI) |
| 14:00–17:00 | Towering anvil heads; green-black edges; light drops a stop | Pre-stillness or downpour cycles | Silver streaks when raining | Rain-haze veils; okadas under bridges | Rain-on-zinc peaks (team-7 zinc layer) |
| 18:00–19:00 | Sunset 18:52 (Jun) under cloud deck — or **sun-glow gap on the water** when storms clear (DI) | Wet-cool | Copper-brown; high banks | Steam off asphalt; umbrellas glow | Evening azan; jollof smoke |
| 20:00–24:00 | Overcast dark; lightning flickers far off some nights | Humid, no relief | Invisible | Mosquito-lamp pockets | Frogs; generator chorus; TV rumour |

### 3.4 State: STORM (confluence thunderstorm, seasons.ts heavy-sky)
| Hour | Sky & light | Air | Water | Land | Sound hint |
|---|---|---|---|---|---|
| 04:00–06:00 | Night storm: sheet lightning silhouettes Patti | Wind gusts precede rain (NIGERIA-GENERIC) | Rain-dimpled black | Streets running with water | Zinc drumming; thunder rolls |
| 06:00–09:00 | Storm-dawn: bruised purple-grey, light like dusk | Pressure-drop stillness, then gusts | Wind-white streaks | Palm fronds torn; branches down | Azan fights the wind |
| 10:00–16:00 | Classic afternoon confluence storm: anvil wall from the southwest, sky goes green-grey (DI) | Grit-laden gusts then drumming rain | Chopped brown; boats beached | **Roofs lost** (LEADERSHIP 2026-05-13: "Lokoja lost its roofs"); blue tarps after; power flickers (team-9 power row) | Thunder cracks; zinc roar; shouting |
| 17:00–19:00 | Storm-sunset: sudden gold slit under black shelf | Washed, cool, ozone | Silver-gold churn | Debris leaves; drains choked | Drip-off zinc; hawkers resume |
| 20:00–24:00 | After-storm haze; moon breaks through torn cloud | Dripping calm | Swollen, loud (repo W-5 "storm makes rivers loud", World_Bible.md:92) | Wet lamp-glitter | Late generators; radios on batteries |

### 3.5 State: FLOOD (Sep–Oct peak; the year's worst day)
| Hour | Sky & light | Air | Water | Land | Sound hint |
|---|---|---|---|---|---|
| 04:00–06:00 | Overcast; relief-camp lamps before dawn | Heavy, mud-and-wet-weed smell (DI) | Bank-to-bank brown torrent | **Confluence location closed** (seasons.ts:50–54); streets canals | Pumps; outboard motors; camp murmur |
| 06:00–09:00 | Grey-pink dawn on a drowned town | Damp grit | Debris rafts ride the current | **Canoes on the highway** [src 5, Daily Trust 2022-10-07]; shop fronts wading-deep | Paddle knocks; corridor splashes |
| 10:00–16:00 | Watery sun on brown sheets | Humid; flies | Sand landings drowned; fuel jetty idle | Sandbag lines; displaced camp rows (2012: 87 camps [src 3]) | Aid trucks;loudspeaker directives |
| 17:00–19:00 | Sunset over water where streets were — visually huge, tragic (DI) | Cooling, mosquitoes rise | Copper flood to the horizon | Boats moored to lamp posts | Evening prayers in camps |
| 20:00–24:00 | Dark water plane mirrors nothing | Settled dread | Current pulls at submerged fences | Kerosene lamps in camp rows | Water gurgle; dogs; guarded talk |

## 4. Contradictions & Data Conflicts
| # | Conflict | Side A | Side B | Handling |
|---|---|---|---|---|
| C1 | Rainy-season onset | "Rain begins in May" (Lokoja wiki) [src 1] | "Rainy season lasts from April to October" (Kogi wiki) [src 3] | Both recorded; bridge = April onset possible, May steady. Game: onset window Apr 15–May 10 (DI) |
| C2 | Annual rainfall | ≈1,000 mm (Lokoja wiki) [src 1] | 1,100–1,300 mm (Kogi wiki) [src 3] | Both kept; use 1,000–1,300 mm band |
| C3 | Mount Patti height | 458 m / 1,503 ft (Wikipedia) [src 2] | ~450 m (repo World_Bible.md:75,55) | 8 m delta; repo value is lawful stylisation — keep both, 458 m is the real-world anchor |
| C4 | Confluence look | Viral two-colour-waters photo (postcard trope) | Dubawa fact-check: picture is NOT Niger–Benue [src 8] | Never render a hard two-tone seam; subtle tint seam only |
| C5 | 2024 flood scale | "200 communities submerged, 2 M displaced" (The Watchers headline, 2024-10-14) [src 5] | Team 9 recorded "70+ communities submerged 2024" (their sources) — see research/phase3/team-9-2026-reality.md | Both recorded; cross-team contradiction flagged, not resolved |
| C6 | Harmattan feel | "Dry season is very dusty and cold" (Kogi wiki) [src 3] | Max temps 37.9 °C fall Dec–April (Lokoja wiki) [src 1] | Reconcile as cold nights/mornings + hot afternoons; sibling team also heard "vanishing harmattan" reports (team-7) |
| C7 | Lokoja geology | Popular "basement complex" framing for Kogi hills | Peer-reviewed Lokoja Fm sandstone (Bida Basin) + Agbaja ironstone at Mount Patti [src 7] | Papers win for the city ground; basement complex belongs to OTHER Kogi hills (e.g. Ogidi) — OQ for full mapping |
| C8 | Flood years rhythm | 2022 described as worst-ever | NIHSA alerts + situation reports show 2012/2018/2020/2024/2025/2026 near-misses and repeats [src 5, 8, 11] | Both true: 2022 = worst, others = recurring drumbeat |

## 5. Design Seeds for the Game
**P0 (world-truth, do first)**
- **S1 · Sun clock law** — bake the sourced curve: sunrise 06:17–06:41, sunset 18:21–18:52, civil twilight ±20–24 min, solar noon 12:31–12:40 (Africa/Lagos) [src 4]. Maps to `world.ts` weatherForSlot + any sky-fog sun position; shadows: noon elevation ≈59° (Dec) → ≈84° (Jun) [computed]. Sunset before 18:30 in Dec = game evenings are dark early.
- **S2 · Water-level curve** — low Dec–May, rise Jun, peak Sep–Oct, recede Oct–Nov (NIHSA alerts/recede reports [src 8, 11]); `flood` state already closes the confluence (`seasons.ts:50-54`) — extend with a continuous waterLevel scalar driving river width/banks + sandbar exposure.
- **S3 · Harmattan haze layer** — warm grey-orange fog, desaturated sun disc, cut draw distance, lamp halos; episodic (NiMet multi-day forecasts [src 6]), not the whole dry season.
- **S4 · Confluence tint seam** — subtle Niger-vs-Benue colour difference only; the viral hard-line photo is a debunked trope [src 8]. Protect Law W-3 sightline (World_Bible.md:69).
- **S5 · Flood set-dressing** — canoes on the highway, debris rafts, sandbag lines, camp rows, closed confluence [src 5, 3]; market stress ×1.3 already in `seasons.ts:76-83`.

**P1 (texture & colour)**
- **S6 · Patti = ironstone crown** — reddish-brown ferruginous cap over pale Lokoja-Fm sandstone slopes [src 7: doi 10.66922/jmg.v58n2.005 — Agbaja Ironstone *Exposed at Mount Patti*]; quarry cave secret fits ironstone diggings; Felele gully-erosion scars [src 9].
- **S7 · Seasonal colour grade** — dry: gold-brown grass, bleached roads; rainy: saturated greens, red mud, puddle law (repo W-6); use `aLeaf` weather-gold mask already in `flora-species.ts:24` as the species-level colour switch.
- **S8 · Species placement logic** — oilpalm/raffia hard against rivers ("leaning river palm" silhouette, `flora-species.ts:26-31`), acacia/neem/shea on upland savanna, mango in compounds; ground-truth via OQ below.
- **S9 · Storm scarring** — post-storm blue tarpaulins, downed branches, days-long repairs [src 11]; storm makes rivers loud (World_Bible.md:92).
- **S10 · Dawn/dusk people** — 06:00–07:00 and 18:00–19:00 golden bands carry azan, canoe silhouettes, smoke threads (sound hooks per team-7).

**P2 (delight, evidence-light)**
- **S11 · Two-overhead-sun days** — near-zenith passes ≈Apr & ≈Sep [computed]; one-off shadow-vanish event.
- **S12 · Mount Patti Race** — annual event on the real trail (Kogi Gov 2026-05-07 [src 9]) feeding calendar.ts.
- **S13 · Erosion gullies** — after-storm gully growth near Felele [src 9].
- **S14 · Moon phase system** — needs a source pass (OQ) before building.

## 6. Open Questions
1. Monthly temperature/humidity/rain table for Lokoja city (climate-data.org & weather-atlas returned 403 this run).
2. Soil series & dust chemistry (PM10) for Lokoja — harmattan dust quantification.
3. Night sky: light-pollution class, star visibility, moon-phase behaviour in-city.
4. Wind speed/direction records for Lokoja (only the NE harmattan wind is named in sources).
5. Niger/Benue discharge (m³/s) and flood-stage heights at Lokoja; exact 2024 Lokoja flood depth.
6. Wild tree species ground-truth for Lokoja (GBIF Kogi holds 1,476 records but is insect-dominated; shea has 0 digitised occurrences) — needs a flora survey paper.
7. River Niger sand mining at Lokoja — queried but not reached in budget (query #13 of brief).
8. Ganaja river-village detail beyond repo (query #11) — not reached.
9. Lokoja LGA ward list (query #10) — not reached; sibling teams may hold it.
10. Whether the Niger at Lokoja is tidal-influenced or pure fluvial level behaviour (affects the water-level curve realism).

## 7. Source Registry

**Official / datasets**
- [src 4] sunrise-sunset.org API — Lokoja 7.790N/6.753E, dates 2026-03-20/06-21/12-21, tzid Africa/Lagos. https://api.sunrise-sunset.org/json?lat=7.790&lng=6.753 (fetched 2026-10-22)
- [src 10] GBIF occurrence API, country=NG&stateProvince=Kogi (1,476 records; species facet unsupported; Vitellaria paradoxa count 0). https://api.gbif.org/v1/occurrence/search?country=NG&stateProvince=Kogi (fetched 2026-10-22)
- Kogi State Government via GNews RSS: Mount Patti Race committee 2026-05-07; 2026 flood preparedness 2026-07-21/23 (https://kogistate.gov.ng/ — headline-level)

**Encyclopaedic / reference**
- [src 1] https://en.wikipedia.org/wiki/Lokoja (fetched 2026-10-22)
- [src 2] https://en.wikipedia.org/wiki/Mount_Patti (fetched 2026-10-22)
- [src 3] https://en.wikipedia.org/wiki/Kogi_State (fetched 2026-10-22)

**Academic**
- [src 7] Lokoja Formation: Facies/depositional environments, J. Mining & Geology 39(1) 2003 — https://doi.org/10.4314/jmg.v39i1.18789 · Felele Junction sandstone facies, Ilorin J. Science 5(1) 2018 — https://doi.org/10.54908/iljs.2018.05.01.001 · Nataco–Banda sediments, JASEM 26(11) 2022 — https://doi.org/10.4314/jasem.v26i11.15 · Koton-Karfe sandstone hydro-conductivity, Paaua Science J. 2026 — https://doi.org/10.65760/paaujs.v1i1.10 · **Agbaja Ironstone Exposed at Mount Patti & Koton-Karfe**, J. Mining & Geology 58(2) 2022 — https://doi.org/10.66922/jmg.v58n2.005 · Agbaja ironstone petrology, J. African Earth Sci. 1997 — https://doi.org/10.1016/s0899-5362(97)00096-1 · Agbaja geochemistry 2019/2025 — https://doi.org/10.24940/theijst/2019/v7/i8/st1908-021 , https://doi.org/10.1016/j.rines.2025.100118 (all via Crossref API, 2026-10-22)

**News (headline-level via Google News RSS, NG edition, unless noted)**
- [src 5] Floods: ReliefWeb 2022-10-11 (synoptic Lokoja damage map); FloodList 2022-10-05; Daily Trust 2022-10-07 (canoes on highway); Premium Times 2022-10-07 (FRSC diversion); Guardian NG 2022-10-08 (Abuja fuel scarcity); Reuters 2022-10-14 (>500 dead); Arise 2022-10-12 (45,000 houses); Vanguard 2017-09-11; The Watchers 2024-10-14 (2 M displaced / 200 communities)
- [src 6] Harmattan: Premium Times 2024-12-20 (NiMet 3-day dust haze); Daily Trust 2025-01-06; Punch 2024-11-23; LEADERSHIP 2025-12-10 (aviation); Peoples Gazette 2026-01-19; Daily Post 2026-01-15
- [src 8] Confluence/hydrology: LEADERSHIP 2025-09-23 (red alert); Guardian NG 2024-10-05 (Benue recede — NIHSA); Vanguard 2024-10-17 (FG flood warning); Dubawa 2023-10-26 (viral confluence photo false — https://dubawa.org/viral-picture-of-confluence-not-river-niger-and-benue/); Daily Trust 2021-02-27 (untapped tourism)
- [src 9] Mount Patti/erosion: Daily Trust 2023-08-02 (erosion devastates Lokoja); Guardian NG 2020-07-19 (revitalise Patti); Kogi Reports 2021-07-07 (International Resort MOU); Kogi State Gov 2026-05-07 (Patti Race)
- [src 11] Storm/2025-26: LEADERSHIP 2026-05-13 ("Lokoja lost its roofs"); Tribune 2026-06-02 (storm cuts water supply); Kogi Reports 2026-07-01 (police HQ roof); ReliefWeb 2025-10-15 (Joint Flood Situation Report — Kogi, 06 Oct 2025); Vanguard 2026-09-28 (FG alerts 24 states); Peoples Gazette 2025-09-18 (FUL climate/flood centre)

**Community / longform**
- Nigerian Voice 2010-12-09 ("Lokoja: Nostalgia over Nigeria's confluence town"); The Sun Nigeria 2016-03-21 ("A kiss of nature in Lokoja") — anecdotal colour, LOW confidence

**Fetch-failure ledger (honest):** en.climate-data.org (403), weather-atlas.com (403), floodlist.com (202 challenge), api.reliefweb.int v1 disaster query (410), api.farmsense.net moonphases (empty), DDG/Bing HTML (blocked for sibling teams; not attempted after GNews pipeline proved out).
