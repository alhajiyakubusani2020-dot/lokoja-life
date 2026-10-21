# Team 5 — Culture · raw evidence base (Phase 3 Prelude)

Task ID: 6-e · Agent: Team 5 (Culture) · Date: 2026-10-22
Method note: WebSearch tool unavailable in sandbox. Pipelines used: Bing News RSS (worked, HK-localized but genuine), Wikipedia REST/API (hard 429 rate-limited all session — **salvaged via Team 1's cached Wikipedia snapshots in `research/phase3/tmp/team1/html_Lokoja.html` + `html_Kogi.html`**, fetched 2026-10-21, cited as `wikipedia:Lokoja (cached)`), DBpedia SPARQL/JSON, direct article fetches (blueprint.ng, thesun.ng, independent.ng OK; kogireports/wikiwand/britannica blocked). ~19 search queries, ~10 page fetches. RULE ZERO applied throughout.

---

## 1. Executive Findings

1. **Lokoja is a deliberately multi-ethnic city — no single "owner" group exists.** Wikipedia's own lead lists Bassa Nge, Yoruba (Oworo subgroup) and Nupe as *indigenous*, with Kupa-Nupe, Hausa, Ebira, Igala, Igbo, Bini/Edo and Tiv as later arrivals. [src 1, HIGH]
2. **The name Lokoja is contested — and the contest itself is lore.** Oworo/Yoruba claim "Ilu Oke Oja" (market town on the hill); Hausa claim "Loko Ja" (red corner, named by the emir of Zazzau); Nupe claim "Patti Lukongi" (hill of doves); the Maiyaki of Lokoja insists the only true origin is Baikie's interpreter Abiga naming it after the red-sapped **loko tree** on Mount Patti ("Lokongoma" = tenth loko tree, Hausa *goma* = ten). [src 2, src 3, HIGH (as a dispute), MED (per-claim)]
3. **William Balfour Baikie founded the modern town in 1857** as a trading post on the Niger; the game's "1860 model town" framing sits within his 1857–1864 anti-malaria (quinine-prophylaxis) period on the river. [src 1, MED]
4. **Flora Shaw coined the name "Nigeria" in Lokoja, on Mount Patti** — a world-class trivia fact for NPC dialogue. [src 2 (Kogi cached), MED]
5. **Lokoja was the capital of the British Northern Nigeria Protectorate under Lugard (1900)**; first chief in that era was Alhaji Muhammadu Maikarfi; the Maigari line still rules — today **HRH Alhaji Ibrahim Gambo Kabir Maikarfi IV**. [src 1, src 4, HIGH]
6. **The traditional hierarchy is explicitly plural:** one Maigari over all, plus Onu Igala Lokoja, Odeyani Anegbira Lokoja, Olu of Oworo Lokoja and district heads — a designed-in NPC power map. [src 3, MED]
7. **Nupe-first vs Oworo-first founding dispute is live in 2025:** the Etsu Lokoja (HRH Emmanuel Akamisoko Dauda Shelika Nyamkpa IV, a Nupe native) publicly claims the Nupe of Lokoja are "the earliest inhabitants," and asked the governor to upgrade his stool to second-class — indigene counter-actors dispute this. [src 5, MED]
8. **Hausa is the connective lingua franca:** per the Maiyaki of Lokoja, "everyone can speak and communicate in Hausa," and old quarters carry Hausa names (Ungwan-Pawa, Ungwan-Shashi, Kabawa, Makera, Ungwan-Hamza). [src 3, MED]
9. **The signature festival is REAL and annual:** the Lokoja Boat Regatta — 7th edition, Oct 2026, at the **Kabawa Waterfront (New Market)**, run by the **Forum of Lokoja Patriots** with the Maigari's blessing; programme = canoe racing, open-water swimming, hand-canoe racing, cultural displays by riverine communities, water-safety awareness; organisers beg the state for sponsorship. [src 4, HIGH]
10. Wikipedia separately records **irregular** boat regattas plus the **Agbo masquerade festival (Oworo, Mar/Apr)**, **Oro/Egungun (Okun)** and the **Donkwo fishing festival (fishermen, Mar/Apr)** — a whole festival shelf the game hasn't used. [src 1, MED]
11. Named state festivals for the wider Kogi calendar: **Rigata (in Lokoja, per the Maiyaki), Italo (Igala), Ekwechi (Egbira), Ovia Osese (Ogori)**. [src 3, MED]
12. **Ebira culture surfaced in hard news 2026:** the **Echane Masquerade Festival** (Ogaminana, Adavi LGA) saw a fatal clash with soldiers (Jun 2026); **AJEMO**, an Okene artist, is consciously pushing Ebira heritage into Nigerian music (Aug 2026); the **Ebira Vonya Women Association, Lokoja** is an active sociocultural body (Sep 2026). [src 6, src 7, src 8, MED each]
13. **Religious life is tripartite and visible:** Islam, Christianity and traditional religion all operate in Lokoja; Kogi State is "about equal" Christian/Muslim with a substantial traditional-religion minority. [src 1, src 2, HIGH]
14. **Early Lokoja chiefs converted to Islam after installation** because the town's Muslim population was dominant — evidence that interfaith assimilation, not segregation, is the historical pattern. [src 3, MED]
15. **Bishop Samuel Ajayi Crowther did missionary work in 19th-century Lokoja** — the Christian strand is as old as the colonial era here. [src 3, MED]
16. **Security law touches worship:** Gov. Ododo ordered a statewide **4 PM shutdown of worship centres** (2025-11-27) during the security blitz — a real calendar/weather-like constraint for evening services. [src 9, HIGH (measure)]
17. **Eid/Sallah is the big meat economy:** ram prices hit ~₦700k–₦1.4m in the 2026 Eid-el-Kabir run-up, families pooled resources/shared cows — validates the game's ram market + meat-sharing mechanics. [src 10, HIGH]
18. **Wedding culture is aso-ebi-driven ("every Saturday somebody is getting married")** — Team 3's sources corroborate the game's "wedding every ~9 days" compression. [src 11, MED, NIGERIA-GENERIC]
19. **Language inventory for NPCs** (Kogi-wide): Igala, Ebira (Anebira), Okun (Yoruba), Nupe (incl. Bassa-Nge, Kakanda, Kupa subgroups), Bassa, Oworo, Ogori-Magongo, Idoma — with Hausa + Nigerian Pidgin as urban bridges. [src 2, src 12, MED]
20. **Ethnic population anchors (DBpedia/Wikipedia infobox, undated scrapes):** Nupe ~3.5m, Igala ~2.6m, Ebira ~2m — useful for relative NPC weighting, weak for precision. [src 12, LOW-MED]
21. **Lokoja LGA population 692,050 (2020 est.)** — third-fastest-growing African city 2020–25 projected (5.93%/yr): the city is a young-migrant melting pot. [src 1, MED]
22. **food.ts is a NIGERIA-GENERIC set with zero Lokoja-specific dish** — verdict table in §5 recommends KEEP×8 / FIX×2 / DELETE×0 and P0 addition of **okoho soup** (the Igala signature; DBpedia confirms it as "Nigerian soup") + river-fish grills. [src 13, repo:src/game/data/foods.ts:24-120, MED]
23. **Identity grammar: "natives" vs "indigenes" vs "visitors" is a live social distinction** — families with 5th–7th generations in town are "natives" regardless of origin tribe; the Lokoja Indigenous Peoples Union cuts across tribes. Dialogue should encode this. [src 3, src 5, MED]
24. **Lokoja trades as the north-south hinge:** pre-colonial groups passed through for trade but avoided permanent settlement because of riverine slave raids; today vessels arrive from riverine areas ahead of Lokoja market days. [src 3, MED]

---

## 2. Evidence Tables

### 2.1 History & etymology
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Founded 1857 by William Balfour Baikie | British explorer set up trading post on Niger bank | wikipedia:Lokoja (cached) https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-21 | MED (1 enc.) |
| "1860 model town" | Baikie's 1857–1864 Niger expeditions (quinine prophylaxis) built the settlement; game framing compatible, exact "1860" not independently confirmed | wikipedia:Lokoja (cached); pressandjournal.co.uk "forgotten King of Lokoja" (headline only) https://www.pressandjournal.co.uk/ | 2022-04-22 | MED |
| 1917 township ordinance = second-class township | Marks Lokoja as an "old city" in colonial law | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| Lugard ruled Northern Nigeria from Lokoja | Capital of British Northern Nigeria Protectorate; chief then = Alhaji Muhammadu Maikarfi | wikipedia:Lokoja (cached); blueprint.ng "Lokoja: Story behind the first capital of Nigeria" https://blueprint.ng/lokoja-story-behind-the-first-capital-of-nigeria/ | 2026-05-01 | HIGH |
| "First capital of Nigeria" claim | Blueprint: Lokoja was Nigeria's first capital "long before Calabar, Lagos and Abuja"; Wikipedia phrasing = protectorate capital; allafrica 2004 "North's first capital" — see Contradictions C4 | blueprint.ng (above); allafrica.com/stories/200402010* (headline) | 2026-05-01 / 2004-01-31 | LOW (phrase contested) |
| Flora Shaw coined "Nigeria" at Mount Patti, Lokoja | Standard Kogi-heritage claim | wikipedia:Kogi_State (cached) https://en.wikipedia.org/wiki/Kogi_State | fetched 2026-10-21 | MED |
| Etymology A — Oworo | "Ilu Oke Oja" = market settlement on the hill | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED (attributed claim) |
| Etymology B — Hausa | "Loko Ja" = red corner; credited to emir of Zazzau (Wikipedia tags [citation needed]) | wikipedia:Lokoja (cached) | fetched 2026-10-21 | LOW |
| Etymology C — Nupe | "Patti Lukongi" = hill of doves (Wikipedia tags [citation needed]) | wikipedia:Lokoja (cached) | fetched 2026-10-21 | LOW |
| Etymology D — official version | Baikie + interpreter Abiga climbed Mount Patti; loko tree with red sap; "Lokongoma" (Hausa *goma*=ten) corroborates loko-tree place-naming; Maiyaki says all other versions come from Pedraza's 1960 questionnaire mishap | blueprint.ng (above) | 2026-05-01 | MED (single detailed oral source) |
| Colonial Cemetery in Lokoja | One of Nigeria's oldest; holds 19th-c. missionaries, explorers, colonial officers | blueprint.ng (above) | 2026-05-01 | MED |
| Lord Lugard Foot Bridge | Named by NCMM (National Museum) as key national heritage site (Mar 2026 news) | punchng.com headline via Bing RSS "National Museum highlights Dufuna Canoe, Lugard Bridge" | 2026-03-14 | MED (headline) |

### 2.2 Ethnic composition & traditional rule
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Indigenous groups of Lokoja | Bassa Nge, Yoruba (Oworo = Yoruba subgroup), Nupe | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| Later-established groups | Kupa-Nupe, Hausa, Ebira, Igala, Igbo, Bini/Edo, Tiv | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| Nupe origin story | First settlers from Gbara near Bida settled on Mount Patti; Kupa & Kakanda came downstream from Baro (Niger State); Oworo/Yoruba "from Ile-Ife joined later" | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED (enc. oral compilation) |
| Oworo counter-claim | Oworo community "strongly dispute" Nupe priority, insisting their ancestors were earliest settlers | blueprint.ng | 2026-05-01 | MED |
| Etsu Lokoja | HRH Emmanuel Akamisoko Dauda Shelika Nyamkpa IV; Nupe native; demands second-class stool grading; "native Nupe of Lokoja are… the earliest inhabitants" | thesun.ng/how-lokoja-was-formed-etsu-lokoja/ | 2025-01-13 | MED |
| Current Maigari of Lokoja | HRH Alhaji Ibrahim Gambo Kabir Maikarfi IV (approved the 2026 regatta) | independent.ng/lokoja-patriots-seek-government-support-for-annual-boat-regatta/ | 2026-10-11 | HIGH |
| Ethnic-specific stools in Lokoja | Onu Igala Lokoja; Odeyani Anegbira Lokoja; Olu of Oworo Lokoja | blueprint.ng | 2026-05-01 | MED |
| First chief of Lokoja | Jacobs Nims/Mieux appointed 1870, approved by Etsu Masaba of Nupe (Bida); successor Abiga (Abubakar) — both later converted to Islam | blueprint.ng | 2026-05-01 | MED (oral account) |
| Kogi three "main" groups | Igala, Anebira (Ebira), Okun (Yoruba); others incl. Bassa Nge, Kupa, Kakanda, Bassa, Oworo, Ogori-Magongo, Idoma | wikipedia:Kogi_State (cached) | fetched 2026-10-21 | MED |
| Kupa, Kakanda, Oworo, Eggan communities | Traditional rulers of these Lokoja-LGA communities collectively praised Ododo's security (Apr 2026) | msn.com/en-xl (Punch-syndicated) via Bing RSS | 2026-04-08 | MED (headline) |
| Ethnic populations (Kogi's groups) | Nupe 3,500,000; Igala 2,600,000; Ebira 2,000,000 (undated infobox values) | dbpedia.org/resource/Nupe_people; /Igala_people; /Ebira_people | DBpedia 2025-ish scrape | LOW-MED |
| Natives vs indigenes framing | 5th–7th-generation families = "natives"; Lokoja Indigenous Peoples Union is cross-tribal; "ethnic boundaries no longer exist anymore in Lokoja" (Maiyaki) | blueprint.ng | 2026-05-01 | MED |

### 2.3 Languages
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Hausa = urban lingua franca | "Everyone can speak and communicate in Hausa"; old quarters have Hausa names (Ungwan-Pawa, Ungwan-Shashi, Kabawa, Makera, Ungwan-Hamza) | blueprint.ng | 2026-05-01 | MED |
| Kogi language list | Igala, Anebira, Okun (Yoruba variant), Nupe (Bassa-Nge/Kakanda/Kupa), Bassa, Oworo, Ogori-Magongo, Idoma | wikipedia:Kogi_State (cached) | fetched 2026-10-21 | MED |
| Per-group languages | Ebira language, Igala language, Nupe language = each group's primary tongue | dbpedia.org/resource/Ebira_language etc. | DBpedia | MED |
| Nigerian Pidgin in Kogi | English-based creole "Asụsụ creole dabere na bekee" (DBpedia multilingual scrape) — Lokoja-specific usage % NOT verified | dbpedia.org/resource/Nigerian_Pidgin | DBpedia | LOW (Lokoja) / HIGH (national) |
| English | Admin/school language (colonial continuity; Lugard-era administration) | blueprint.ng (context) | 2026-05-01 | MED, NIGERIA-GENERIC |

### 2.4 Food & drink
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Okoho soup exists | DBpedia/Wikipedia classifies Okoho as a "Nigerian soup" (Igala-associated; Cissus-based — ingredient detail NOT source-verified this session) | dbpedia.org/resource/Okoho | DBpedia | MED (existence) / LOW (ingredients) |
| Lokoja eats Hausa-Northern foods | Large, old Hausa population; fura da nuunu, kosai etc. implied (NIGERIA-GENERIC) | blueprint.ng (Hausa population) | 2026-05-01 | MED (population) / LOW (dishes) |
| Confluence = river-fish country | Regatta/fishing-festival culture; fisherman identity (Donkwo fishing festival) | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| Eid meat economy | 2026 Eid-el-Kabir: rams ₦700k (Kano) – ₦1.4m; families pool/share cows & camels | leadership.ng + pulse.ng + vanguardngr.com via Bing RSS | 2026-05-23/27 | HIGH |
| Market-day food trade | Vessels arrive from riverine areas the day before Lokoja market day; trade routes to Okene, Idah, Auchi | blueprint.ng | 2026-05-01 | MED |
| GSM Village @ Kpata Market | Phone-accessory village by Kpata Market burned Sept 2024, millions lost; gov paid compensation Jan 2025 — food/hustle adjacency | punchng.com + dailypost.ng via Bing RSS; kogistate.gov.ng (team-9 registry O9/O10) | 2024-09-12 | HIGH |

### 2.5 Clothing & fashion
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Aso-ebi / owambe Saturdays | National institution; trillions-of-naira aso-ebi economy; weddings saturate Saturdays | talktalknigeria.com + asoebiassist.com (via team-3-human-life.md §116) | 2026-08-15 | MED, NIGERIA-GENERIC |
| Muslim northern dress context | Old Hausa/Muslim establishment in Lokoja ( chiefs converted to Islam; quarters named in Hausa) → babban riga/kaftan/hijab normal wear (NIGERIA-GENERIC inference — garment names not source-verified) | blueprint.ng | 2026-05-01 | LOW (inference, labeled) |
| Regatta as dress-up moment | "Cultural displays by riverine communities" at the regatta (performance dress implied) | independent.ng | 2026-10-11 | MED (existence) / LOW (garments) |
| Ebira sociocultural body in Lokoja | Ebira Vonya Women Association, Lokoja, active publicly (campaign materials unveiling) | leadership.ng via Bing RSS | 2026-09-21 | MED (headline) |
| Egungun masquerade garment | Wikipedia photo caption "Egungun masquerade dance garment" illustrates masquerade costume culture in Lokoja-area festivals | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| Kogi traditional attire specifics | **No Lokoja-verified source captured this session** — Ebira weaving/Igala royal dress → Open Questions | — | — | GAP |

### 2.6 Festivals & calendar
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja Boat Regatta | 7th edition, Kabawa Waterfront (New Market), one-day, "traditionally organised towards the end of the year"; canoe racing, open-water swimming, hand-canoe racing, cultural displays, water safety; organiser = Forum of Lokoja Patriots (chair Alhaji Idris Babango); chief guest ex-Sen. Tunde Ogbeha; Speaker Aliyu Umar Yusuf promises sponsorship law | independent.ng | 2026-10-11 | HIGH |
| Regatta irregularity + Donkwo fishing festival | "Editions of Lokoja boat regatta are held, though not regularly"; Donkwo fishing festival Mar/Apr; Agbo masquerade (Oworo) Mar/Apr; Oro/Egungun (Okun) | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| Regatta political economy | Patriots beg Kogi govt to "take over the sponsorship" (2025 and again 2026) → festival is private/charity-run today | leadership.ng + kogireports.com via Bing RSS | 2025-10-12 / 2026-10-10 | HIGH (headline-level) |
| Regatta hype 2018 | The Nation: state upgraded "its boat feast," Lokoja "will wear a new look" | thenationonlineng.net via Bing RSS | 2018-10-15 | MED (headline) |
| Named Kogi festivals (Maiyaki's list) | Rigata (Lokoja), Italo (Igala), Ekwechi (Egbira), Ovia Osese (Ogori) — "can be developed into international standard" | blueprint.ng | 2026-05-01 | MED |
| Echane Masquerade Festival (Ebira) | Ogaminana, Adavi LGA; soldiers-vs-masqueraders clash, ≥2 dead (Jun 2026) — festivals are high-spirited and can turn | msn.com (Punch-syndicated) via Bing RSS | 2026-06-01 | MED (headline) |
| Eid family | Eid-el-Fitr + Eid-el-Kabir + ram market; 2026 ram prices ₹700k–1.4m, resource-pooling | leadership.ng / pulse.ng / vanguardngr.com via Bing RSS | 2026-05-23/27 | HIGH |
| New Yam Festival in Kogi | **Not source-verified for Lokoja/Igala this session** (game already has it, calendar.ts:169) → Open Questions | — | — | GAP |
| Durbar | Nationwide northern-Emirate institution (DBpedia: "annual festival celebrated in several cities of Nigeria") — **no evidence of durbar in Lokoja specifically** | dbpedia.org/resource/Durbar_festival | DBpedia | LOW for Lokoja |
| Worship-centre shutdown law | Ododo ordered 4PM shutdown of worship/public centres statewide (security blitz) | kogistate.gov.ng/just-in-gov-ododo-unleashes-security-blitz-on-kogi-orders-4pm-shutdown-of-worship-centres/ (via team-9 registry O11) | 2025-11-27 | HIGH (order) |

### 2.7 Religion
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Three religions active in Lokoja | "Islam, Christianity and traditional religion exist in Lokoja"; Muslims→mosques, Christians→churches (Wikipedia) | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| Kogi balance | "About equal percentages of Christians and Muslims along with a substantial minority" of traditional religion | wikipedia:Kogi_State (cached) | fetched 2026-10-21 | MED |
| Nupe religions | Sunni Islam + Christianity + African religion (DBpedia structured) | dbpedia.org/resource/Nupe_people | DBpedia | MED |
| Igala religions | Islam + Christianity | dbpedia.org/resource/Igala_people | DBpedia | MED |
| Ebira religion | Islam (DBpedia single-value) | dbpedia.org/resource/Ebira_people | DBpedia | MED |
| Christian missionary antiquity | Bishop Samuel Ajayi Crowther did missionary + community work in Lokoja | blueprint.ng | 2026-05-01 | MED |
| Elite conversion pattern | Chiefs Mieux & Abiga converted to Islam after installation (dominant Muslim population) | blueprint.ng | 2026-05-01 | MED |
| Religion & the state | 4PM worship shutdown (Nov-25); Kogi govt publicly reaffirms "commitment to culture, girl-child education and unity" | kogistate.gov.ng O11; leadership.ng via Bing RSS | 2025-11-27 / 2026-04-19 | HIGH / MED |

### 2.8 Music & art
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| AJEMO (Usman Ochi Ajemo) | Okene-born artist deliberately fusing Ebira heritage into Nigerian mainstream music ("In the bustling town of Okene… where the hills echo with the rhythms of Ebira heritage") | vanguardngr.com via Bing RSS | 2026-08-15 | MED |
| Masquerade as performance art | Agbo masquerade (Oworo), Egungun (Okun), Echane (Ebira) — masks + dance garments are the region's visual-performance tradition | wikipedia:Lokoja (cached); msn.com via Bing RSS | fetched 2026-10-21 | MED |
| Regatta as spectacle | Entertainment boat performances, cultural displays, prize-giving at Kabawa Waterfront | independent.ng | 2026-10-11 | MED |
| Naira spraying culture | Implied by game + aso-ebi/owambe sources (team-3:116,186) — spraying at parties is national practice | team-3-human-life.md (talktalknigeria.com) | 2026-08-15 | MED, NIGERIA-GENERIC |
| Kogi hip-hop/street genres | **No Lokoja-verified source captured** → Open Questions | — | — | GAP |

### 2.9 Family & community values
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| "Natives" identity rule | 5th–7th-generation families = natives, "do you call them settlers? No"; belonging is generation-based, not tribe-based | blueprint.ng | 2026-05-01 | MED |
| Cross-tribal civic bodies | Lokoja Indigenous Peoples Union cuts across tribes; town-union self-help (game's paving mechanic) consistent with team-3 findings | blueprint.ng; team-3-human-life.md | 2026-05-01 | MED |
| Festivals as unity engines | Regatta chairman: festival "provided a platform for fostering unity and social interaction among the diverse ethnic groups in Lokoja"; families attend as recreation | independent.ng | 2026-10-11 | MED |
| Meat-sharing at Eid | Game mechanic (meat packs/shares) mirrors real "shared cows, pooled resources" Eid practice | leadership.ng/vanguardngr.com via Bing RSS | 2026-05-24 | HIGH |
| Marriage culture | Wedding-saturated Saturdays, aso-ebi solidarity economics (₦12tn claim) | talktalknigeria.com via team-3 | 2026-08-15 | MED, NIGERIA-GENERIC |
| Founding tripod | Maiyaki: town established on "freedom, merit and religious harmony"; Etsu Masaba appointed chiefs on merit, "not sentimental" | blueprint.ng | 2026-05-01 | MED (oral) |

### 2.10 Humour & etiquette (honest: thinnest table)
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Cultural-erosion discourse | Igala Students Association decries "alarming erosion" of culture + education collapse (Feb 2026) — elders lecture youth, students push back: a real comedic/friction vein | vanguardngr.com via Bing RSS | 2026-02-09 | MED (headline) |
| Hijab/heritage pride politics | AJEMO's Okene pride; "Kogi: The confluence that has never converged" (Okun marginalization op-ed) — identity banter between regions is a live theme | vanguardngr.com; thesun.ng via Bing RSS | 2026-08-15 / 2026-10-07 | MED (headlines) |
| Greeting etiquette specifics | **NOT source-verified** (Hausa/Igala/Ebira/Nupe greeting formulas) → design via NIGERIA-GENERIC + P1 verification task | — | — | GAP |

### 2.11 Identity
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| "Confluence City" is THE brand | Regatta organisers, Blueprint, Wikipedia all anchor identity on the Niger-Benue meeting | independent.ng; blueprint.ng; wikipedia (cached) | 2026 | HIGH |
| "The bride every ethnic group lays claim to" | Maiyaki: pre-colonial groups traversed but none stayed permanently due to slave raids; today all claim Lokoja | blueprint.ng | 2026-05-01 | MED |
| Third-fastest-growing African city | 5.93% growth 2020–2025 projected; LGA pop 692,050 (2020) | wikipedia:Lokoja (cached) | fetched 2026-10-21 | MED |
| North-south hinge identity | Links Okene, Idah, Kabba, Anyigba + highways to Abuja/Lagos/Kano/Enugu; administrative capital pulling the state | blueprint.ng | 2026-05-01 | MED |
| Political-identity tension | Okun (Yoruba-west) has never produced a civilian governor — "the confluence that has never converged" | thesun.ng via Bing RSS | 2026-10-07 | MED (headline; handle gently in-game) |

---

## 3. Cultural Grammar Table (theme → rule → example → source → confidence → tag)

| Theme | Authentic rule | Example phrase/item | Source | Confidence | Tag |
|---|---|---|---|---|---|
| City brand | Never say one group owns Lokoja; the confluence IS the identity | "Na we meet point" framing; Confluence Regatta as city festival | independent.ng; blueprint.ng | HIGH | Lokoja-verified |
| Belonging | Belonging = generations in town, not ethnicity | NPC line: "My grandfather sell fish for Kabawa — we be natives here, no be settlers." | blueprint.ng | MED | Lokoja-verified |
| Language layering | Hausa for the street/market, ethnic tongue at home, Pidgin for playful cross-ethnic talk, English formal | Market haggle in Hausa; clan meeting in Igala/Ebira; banter in Pidgin | blueprint.ng; wikipedia:Kogi (cached) | MED | Lokoja-verified (layering) |
| Etymology lore | Let NPCs ARGUE about the name; all four etymologies get a voice | Oworo elder: "Ilu Oke Oja!"; Nupe chief: "Patti Lukongi!"; Hausa mallam: "Loko ja, red corner"; Maiyaki loyalist: "Loko tree, red blood sap!" | wikipedia+blueprint | MED | Lokoja-verified |
| History flex | Lokoja = Nigeria's original capital city + Nigeria's name was coined here | Tour guide NPC on Mount Patti: "Na here Flora Shaw name Naijeria." | blueprint.ng; wikipedia:Kogi (cached) | MED | Lokoja-verified |
| Regatta | Late-year, one-day, waterfront crowd event run by community patriots with royal blessing, govt begged for cash | Kabawa Waterfront; canoe racing; prize-giving; Speaker promises law | independent.ng | HIGH | Lokoja-verified |
| Fishing identity | Fishermen hold a March/April festival (Donkwo); boats = pride | Donkwo fishing festival | wikipedia (cached) | MED | Lokoja-verified |
| Masquerades | Each group has its own masquerade; seasonal, can flare | Agbo (Oworo, Mar/Apr); Egungun (Okun); Echane (Ebira) | wikipedia (cached); msn/Punch | MED | Lokoja-region |
| Islam | Sallah = ram economy + meat sharing; prayer times shape the day (team-7) | Ram at ₦700k-1.4m; pooling to share a cow | leadership/pulse/vanguard RSS | HIGH | Lokoja-relevant (state news) |
| Christianity | Historic missionary roots (Crowther); worship centres obey security curfews | 4PM worship shutdown days | blueprint.ng; kogistate.gov.ng | MED/HIGH | Lokoja-verified |
| Traditional religion | Real minority presence, not caricature | Kogi "substantial minority" | wikipedia:Kogi (cached) | MED | Lokoja-verified |
| Weddings | Saturdays = weddings; aso-ebi is the social tax | Aso-ebi pickup at Kpata tailors (team-3 already seeds this) | talktalknigeria via team-3 | MED | NIGERIA-GENERIC |
| Youth vs heritage | Students complain culture is eroding; elders defend it | ISAN statement vein | vanguardngr RSS | MED | Kogi-verified |
| Music pride | Regional-heritage music is a rising identity flex | AJEMO (Ebira heritage from Okene) | vanguardngr RSS | MED | Kogi-verified |
| Respect for stools | Maigari is THE central stool; sub-stools per group; don't invent titles in dialogue | Maigari / Onu Igala Lokoja / Odeyani Anegbira / Olu of Oworo | blueprint.ng; independent.ng | MED | Lokoja-verified |
| Greetings | Use standard Nigerian greetings as placeholder; verify per-language formulas before final | "Sannu!" (Hausa), "How far?" (Pidgin), "Good morning o" | none for formulas | LOW | NIGERIA-GENERIC |

---

## 4. Contradictions & Data Conflicts

- **C1 — Who founded/settled first?** Wikipedia: Nupe from Gbara settled Mount Patti first, Oworo "joined later" [src 1]. Blueprint's Maiyaki: Nupe were first, Oworo "strongly dispute" [src 3]. The Sun's Etsu: Nupe natives are "the earliest inhabitants" [src 5]. → KEEP ALL THREE AS FACTIONS. The dispute is itself the most authentic content.
- **C2 — Etymology (4-way):** Oworo "Ilu Oke Oja" [src 1] vs Hausa "Loko Ja" [src 1] vs Nupe "Patti Lukongi" [src 1] vs official loko-tree/Abiga story [src 3]; plus The Sun 2023 headline claims the town was "named after… William Balfour Baikie" [src 14] — a fifth, almost certainly sloppy, version. Record all; Maiyaki explicitly rejects the Nupe "land of dove" version.
- **C3 — "First capital of WHAT?"** Blueprint: "first capital of Nigeria… before Calabar" [src 3]; Wikipedia: capital of British **Northern Nigeria** Protectorate [src 1]; allafrica 2004: "North's first capital" [src 15]. Wikipedia's is the safest formulation for the game.
- **C4 — Regatta regularity:** Wikipedia: "held, though not regularly" [src 1] vs Independent 2026: "annual Boat Regatta Festival… seventh edition" [src 4] vs 2018 The Nation state-upgrade report [src 16]. Reconciliation: attempted annually by patriots in recent years, but early editions irregular; keep game event annual (good play) with NPC line acknowledging spotty history.
- **C5 — Regatta venue/season:** Game anchors regatta year-day 37, mid-year (repo:src/game/systems/calendar.ts:166, config.ts:668) vs real event "towards the end of the year" at Kabawa Waterfront [src 4]. Design note, not silent fix.
- **C6 — Oworo identity:** DBpedia classifies Oworo_people as "subgroup of the Yoruba people" [src 12]; Blueprint lists Oworo as one of the pre-colonial groups *alongside* "Nupe, Oworo, Egbira, Hausa, Bassa-nge, Igala" without Yoruba framing [src 3]. Both can be true (Oworo = Yoruba subgroup resident since pre-colonial times) — but NPC casting should not assume "Okun = Oworo": Kogi wiki lists Okun and Oworo as separate western subgroups [src 2].
- **C7 — Ethnic population numbers:** DBpedia Nupe 3.5m / Igala 2.6m / Ebira 2m [src 12] — no collection dates; treat as ordinal not cardinal.
- **C8 — Durbar in Lokoja:** Durbar is real in Nigeria's emirate cities [src 12] but no evidence of Lokoja durbar — the game should not auto-add one. (Team 9's "statewide 4PM worship shutdown" is the verified religious-order event instead.)
- **C9 — Traditional religion visibility:** Wikipedia says traditional religion exists in Lokoja [src 1] yet also calls Lokoja's chiefs "reverted to Islam because of the high population of Muslims" [src 3]. Not strictly contradictory — syncretic coexistence — but design must avoid both erasure and exaggeration.

---

## 5. Design Seeds for the Game

### 5.1 NPC name pools (sourced from evidence above; surname-style usage)
- **Hausa/Muslim Lokoja:** Ibrahim, Gambo, Maikarfi, Idris, Babango, Naseer, Aliyu, Abdullahi, Usman, Ahmadu, Muhammadu, Abubakar, Aliu, Lawal, Hassan, Makera (from quarter names) — HIGH density in town.
- **Nupe:** Masaba, Nyamkpa, Akamisoko, Dauda, Shelika, Jiya, Etsu-lineage; Kupa, Kakanda as clan names.
- **Igala:** Ameh, Erico, Egbe, Onu (title), Idah-linked names.
- **Ebira:** Ochi, Ajemo, Adavi/Ogaminana-linked; Ohinoyi (title).
- **Okun/Yoruba:** Tunde, Ogbeha, Jacobs, Samuel, Toyin.
- **Bassa-Nge:** no sourced names captured — P1 research task.
- **Titles for elders:** Maigari, Maiyaki, Dan Darman, Etsu, Onu, Odeyani, Olu, Ohinoyi (all sourced).

### 5.2 Greeting dialogue banks (P1 verification flagged)
- NIGERIA-GENERIC placeholders now: Hausa "Sannu / Ina wuni", Pidgin "How far? / Wetin dey happen?", English "You're welcome to the confluence." → LOW confidence until native-speaker pass; task P1: record Igala ("Ojala"-family greetings?), Ebira, Nupe, Bassa-Nge greeting formulas + Oworo Yoruba dialect flavour.

### 5.3 Festival-calendar alignment (calendar.ts:159-173 + config.ts:656-694)
| Game festival | Evidence check | Verdict |
|---|---|---|
| Confluence Regatta (anchor 37, 2d) | Real regatta is late-year, 1-day, Kabawa Waterfront, 7th edition 2026, private-run | **P1:** keep anchor (play clarity) but re-skin venue to Kabawa/New Market waterfront; add "7th edition" numbering and "Patriots seek govt takeover" questline; note contradiction C5 in design doc |
| Eid family + ram market (13/51 + drift) | Validated by 2026 ram-price coverage (₦700k-1.4m, pooling) | KEEP; P2 add "share a cow" pooling option for poor households |
| Ramadan 10 days | Real Ramadan ~29-30 days; game compresses | KEEP (abstraction), document |
| New Yam (57) | No Lokoja source this session | P1 verify Igala/Oworo new-yam timing before deepening |
| Detty December (64+) | Consistent with late-year regatta timing | P1 option: let Regatta window overlap Detty in later game years (edition drift) |
| NEW: Agbo Masquerade (Oworo) | Mar/Apr sourced [src 1] | P1 add as window-festival (no market fold needed) |
| NEW: Donkwo Fishing Festival | Mar/Apr sourced [src 1] | P1 add; pairs with river economy (team-4 ferry/canoe data) |
| NEW: Echane Masquerade (Ebira) | Sourced w/ 2026 incident | P2 flavor event + safety-crowd mechanic |
| NEW: Italo (Igala) / Ekwechi (Egbira) / Ovia Osese (Ogori) / Rigata (Nupe riverine) | Maiyaki's list | P2: distant festivals NPC talk about, "travel to" gossip lines |

### 5.4 REQUIRED — Per-dish verdict table for src/game/data/foods.ts
| Dish (foods.ts id) | Verdict | Rationale / fix | Confidence |
|---|---|---|---|
| rice-and-stew | KEEP | Staple nationwide incl. Kogi markets; price sanity owned by team-6 board | MED |
| beans ('Ewa agoyin style') | FIX | Keep beans+bread; drop the Lagos-specific "ewa agoyin" name → "Beans & Bread (ewa)" or plain beans; Lokoja bean porridge (ewa agoyin is Lagos-Yoruba branded) | LOW, NIGERIA-GENERIC |
| agege-bread | KEEP | Bread culture is universal street food; rename optional "Bread (Agege)" | MED, NIGERIA-GENERIC |
| akara | KEEP | Morning bean-cake; Hausa twin "kosai" for Muslim quarter vendors | MED, NIGERIA-GENERIC |
| yam-and-egg | KEEP | Yam-belt city; New Yam festival already in calendar | MED |
| suya | KEEP | Northern-anchored, Lokoja-plausible; FIX description to mention mallam grill spots; P1 add kilishi sibling | MED, NIGERIA-GENERIC |
| egusi-and-pounded-yam | KEEP | Swallow culture verified (Igala/Nupe/Okun all swallow-eaters generally); no deletion | MED, NIGERIA-GENERIC |
| pepper-soup ('Fish Pepper Soup') | FIX | Best-fit game dish: rename "River Fish Pepper Soup" — confluence fishing identity (Donkwo) makes river fish THE local protein story | MED |
| zobo | KEEP | Ubiquitous; fine as-is | MED, NIGERIA-GENERIC |
| fura-de-nunu | KEEP | Hausa/Northern presence in Lokoja is documented ("highest figure in all censuses" claim) | MED |
| **ADD P0: Okoho Soup** | ADD | The missing Igala signature; DBpedia-verified soup; gives Igala plurality (city's largest group per Kogi wiki) a dish | MED (existence) |
| **ADD P1: Kilishi** | ADD | Suya-adjacent, ram/Sallah economy tie-in | MED, NIGERIA-GENERIC |
| **ADD P1: Kosai (with akara)** | ADD | Morning Muslim-quarter pairing; dual-vendor flavour | MED, NIGERIA-GENERIC |
| **ADD P1: Confluence Grilled Fish ("point & kill")** | ADD | Anchors river identity + Kpata/Ganaja waterfront | MED (inference from fishing culture) |
| **ADD P2: Tuwo / local swallow variant** | ADD | Northern-Nupe touch; needs naming verification | LOW |

### 5.5 Clothing / wardrobe additions
- P1: aso-ebi wardrobe slot for Saturday weddings (already implied by calendar weddings; team-3 sources) — NIGERIA-GENERIC.
- P1: babban riga + kaftan + hijab for Muslim-quarter NPCs (dress context verified; garments NIGERIA-GENERIC — P1 visual-verification pass).
- P2: masquerade costume assets tied to Agbo/Egungun/Echane festivals (photo evidence: "Egungun masquerade dance garment" caption [src 1]).
- P2: regatta-culture waterfront attire ( fishermen/prize-ceremony) — LOW, art-led.
- **Do NOT** ship "traditional Kogi attire" sets until Ebira weaving/Igala royal dress are sourced (Open Questions).

### 5.6 Priorities
- **P0:** okoho soup + river-fish rename in foods.ts; "natives vs settlers" identity rule in dialogue; Maigari/stool NPC map; regatta venue/edition truth.
- **P1:** Agbo/Donkwo festival windows; name pools; aso-ebi/babban-riga wardrobe; Hausa-lingua-franca market dialogue; "Nigeria was named here" tourist lines; greeting verification task.
- **P2:** distant-festival gossip (Italo/Ekwechi/Ovia Osese/Rigata); masquerade assets; pooling-to-share-a-cow Eid mechanic; Okun-political-tension as light radio banter (sensitive: keep neutral).

---

## 6. Open Questions
1. Igala/Ebira/Nupe/Bassa-Nge greeting formulas and honorifics (needs native-speaker or academic source).
2. New Yam festival: is it actually celebrated in Lokoja, and when (game anchor day 57 currently unsourced)?
3. Okoho soup: ingredient/recipe details (Cissus producta?) + where in Lokoja it's sold.
4. Bassa-Nge personal names + any Bassa-Nge festival (Bassa-Nge are indigenous but zero cultural detail captured).
5. Traditional attire specifics: Ebira weaving tradition? Igala royal regalia? Oworo aso-oke usage?
6. Durbar: does Lokoja's Maigari institution stage any durbar-style procession at Eid?
7. Kogi music scene beyond AJEMO: Lokoja-based artists, Igala-language pop, church/nightlife music (team-7 covers ambience only).
8. Lokoja LGA population: 692,050 (2020, wiki infobox) — no census-grade verification; 2026 figure unknown.
9. Humour/etiquette: proverbs and joke registers per group (zero sourced material).
10. The Sun's "white lion" Lokoja claim (Sep 2023) — article body unfetchable; is there a real fifth etymology?
11. Pedraza questionnaire (1960): primary source location (Kaduna archives per Maiyaki) for the etymology file.

## 7. Source Registry
**Fetched full-text this session (HIGH for what they contain):**
- [S1] wikipedia:Lokoja — https://en.wikipedia.org/wiki/Lokoja (cached by Team 1: research/phase3/tmp/team1/html_Lokoja.html, fetched 2026-10-21; direct fetch 429 on 2026-10-22)
- [S2] wikipedia:Kogi_State — https://en.wikipedia.org/wiki/Kogi_State (cached: tmp/team1/html_Kogi.html)
- [S3] Blueprint Newspapers — "Lokoja: Story behind the first capital of Nigeria" — https://blueprint.ng/lokoja-story-behind-the-first-capital-of-nigeria/ — 2026-05-01 (Maiyaki Alhaji Aliu Lawal Jiya interview; etymology; stools; festivals list)
- [S4] Independent Newspapers — "Lokoja Patriots Seek Government Support For Annual Boat Regatta" — https://independent.ng/lokoja-patriots-seek-government-support-for-annual-boat-regatta/ — 2026-10-11 (7th edition, Kabawa Waterfront)
- [S5] The Sun — "How Lokoja was formed — Etsu Lokoja" — https://thesun.ng/how-lokoja-was-formed-etsu-lokoja/ — 2025-01-13 (Nupe-native stool dispute)
- [S12] DBpedia — https://dbpedia.org/resource/Nupe_people · /Igala_people · /Ebira_people · /Oworo_people · /Okoho · /Durbar_festival · /Nigerian_Pidgin · /Lokoja (SPARQL/JSON, accessed 2026-10-22)
**Headline-verified via Bing News RSS (MED for headline facts):**
- [S6] Punch via MSN — "Two killed as soldiers, masqueraders clash at Kogi festival" (Echane, Ogaminana) — 2026-06-01
- [S7] Vanguard — "AJEMO brings Ebira heritage to the forefront of Nigeria's music scene" — https://www.vanguardngr.com/ — 2026-08-15
- [S8] Leadership — "2027: Ebira Women Unveil Campaign Materials… (Ebira Vonya Women Association, Lokoja)" — 2026-09-21
- [S9] Kogi State Govt — "Gov Ododo… Orders 4PM Shutdown of Worship Centres" — https://kogistate.gov.ng/just-in-gov-ododo-unleashes-security-blitz-on-kogi-orders-4pm-shutdown-of-worship-centres/ — 2025-11-27 (full URL verified via team-9 registry)
- [S10] Leadership/Pulse/Vanguard — Eid-el-Kabir ram prices ₦700k–₦1.4m; shared cows — 2026-05-23/27
- [S11] TalkTalk Nigeria + Asoebi Assist — aso-ebi/owambe economics — 2026-08-15 (via team-3-human-life.md)
- [S13] Kogi Govt Reaffirms Commitment To Culture, Girl-Child Education — leadership.ng — 2026-04-19
- [S14] The Sun — "Lokoja: Navigating the territory of the white lion in total darkness" — 2023-09-02 (body unfetched)
- [S15] allAfrica — "Lokoja: Untold Story of the North's First Capital" — 2004-01-31 (headline)
- [S16] The Nation — "Regatta to change the face of Lokoja" — 2018-10-15 (headline)
- [S17] Vanguard — "Igala Students association decries declining education, cultural erosion" — 2026-02-09 (headline)
- [S18] The Sun — "Kogi: The confluence that has never converged" — 2026-10-07 (headline)
- [S19] Punch via MSN — "Kupa, Kakanda, Oworo, Eggan leaders commend Ododo over improved security" — 2026-04-08 (headline)
- [S20] Punch — "National Museum highlights Dufuna Canoe, Lugard Bridge as key heritage sites" — 2026-03-14 (headline)
**Repo citations:** src/game/data/foods.ts:24-120 (10 dishes); src/game/systems/calendar.ts:4-31,159-173 (festival law); src/game/data/config.ts:656-715 (FESTIVALS anchors/mults); src/components/game/FestivalPanel.tsx (exists, confirmed via Glob).
