# Team 3 — Human Life · raw evidence base (Phase 3 Prelude)

Task ID: 6-c · Agent: Team 3 (HUMAN LIFE) · Compiled: 2026-10-22 ·
Mission: how Lokoja actually lives, hour by hour (04:00→24:00), as an evidence-grade base an NPC-scheduler can execute.

**Rules honoured:** every claim carries ≥1 URL; statistics carry observation dates; conflicts live in §4; Nigeria-generic items are labelled `NIGERIA-GENERIC`; vlog/Reddit/forum texture is labelled anecdotal LOW/MED. REPO grounding citations use `repo:path:line`.

**Repo facts this file maps onto (read first):**
- Needs engine = 4 needs (health/energy/hunger/mood), slot-based decay + hungry/starving consequences — repo:src/game/systems/needs.ts:34-51; decay constants repo:src/game/data/config.ts:55-61; rest (nap/sleep) repo:src/game/data/config.ts:41-46.
- Day = 4 slots: morning/afternoon/evening/night — repo:src/game/data/config.ts:190-192. Weather weights incl. harmattan/storm/flood — repo:src/game/data/config.ts:197-231.
- Work: formal JOBS reliable, personal HUSTLES risky — repo:src/game/systems/work.ts:7-18; degree gate reads the FUL certificate — repo:src/game/systems/work.ts:31-54.
- Calendar: 72-day year; Confluence Regatta (yr-day 37, 2d); Eid family drifts (Fitr 13, Kabir 51, Ramadan 10d, drift ±3); national days; New Yam; Detty December; a wedding every ~9 days; town-union paving every 14 days — repo:src/game/systems/calendar.ts:4-31, repo:src/game/data/config.ts:656-712.
- NPCs = named faces tied to stable location ids, 4 speech styles — repo:src/game/data/npcs.ts:15-25 (Musa @kpata-market, Hajiya Amina @kpata-market, Mama Ngozi @food-area, Emeka @ganaja-junction, Baba T. @transport-area, Chantel @university-area, Alhaji Sule @government-area, Uncle Ben @historic-lokoja …) — repo:src/game/data/npcs.ts:27-90.
- Chat lines by familiarity tier stranger→acquaintance→paddy→close-paddy, warm pidgin — repo:src/game/data/npcChat.ts:8-24.
- Ten launch locations w/ taglines: home, kpata-market, ganaja-junction, confluence, mount-patti, historic-lokoja, government-area, university-area, food-area, transport-area — repo:src/game/data/locations.ts:51-243; later ring: adankolo, emiwoziri, filele, numai, kpatakpoli, kpato, township-stadium, maigari-palace, pati-ridge-hill, sokamms-motel — repo:src/game/data/locations.ts:342-553.
- Night market has open slots; hangouts are evening/night only — repo:src/game/data/config.ts:481, repo:src/game/data/config.ts:924-925.

---

## 1. Executive Findings (≤30 bullets)

1. Lokoja is a mixed, working state capital on the Niger–Benue confluence, ~160 km south of Abuja; rainfall ~1,000–1,150 mm; Niger floods run July → peak October → end December, and flood exposure (not crime) is the #1 safety reality residents plan around. [HIGH] (https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance, Feb 2014; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi, 2026-08-17; https://en.wikipedia.org/wiki/Lokoja, fetched 2026-10-22)
2. The city has three major markets — New/International Market, Old Market, Kpata Market — and **Kpata + New Market run a five-day market-day cycle** that still shapes trading rhythms (grains, vegetables, household goods). [HIGH] (https://en.wikipedia.org/wiki/Lokoja, fetched 2026-10-22; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi, 2026-08-17)
3. Kpata is a riverbank market: villagers canoe in to sell dried fish, grains, bush meat, produce; a fish-market study found most Kpata fishmongers are 18–55, trading mainly freshwater species for domestic demand. [MED] (https://www.nigeriantrend.com.ng/lokoja-kpata-river-market-assorted-food-commodities-to-buy/; https://www.iiste.org/Journals/index.php/JNSR/article/viewFile/815/721)
4. Public water supply is effectively collapsed; hundreds scramble at borehole points; a 4-litre jerrycan that cost ₦20–50 now sells ~₦200 and mai ruwa (water vendors) take day-ahead bookings — this structures the morning for many households. [MED] observation 2024-06-22 (https://dailytrust.com/lokoja-story-of-capital-city-with-great-rivers-no-potable-water/)
5. Lokoja suffers chronic power shortages — an opinion feature calls it "total darkness," undermining businesses and study hours; borehole owners who sell water are called "the unsung heroes of Lokoja." [MED] (https://dailytrust.com/lokoja-navigating-the-territory-of-white-lion-in-total-darkness/, 2023-08-19; https://thereporters.com.ng/2024/06/02/magnanimity-without-borders-borehole-owners-as-the-unsung-heroes-of-lokoja/, 2024-06-02)
6. Prayer structure is real and daily: Fajr ≈ 05:10–05:35, Dhuhr ≈ 12:20–12:36, Asr ≈ 15:45–16:36, Maghrib ≈ 18:15–18:45, Isha ≈ 19:15–19:55 (two services differ by calculation method); Jumu'ah replaces Dhuhr on Fridays. [HIGH for pattern, MED for exact minutes] (https://www.islamicfinder.org/world/nigeria/2331939/lokoja-prayer-times/, Oct 2026; https://islamic-prayer-times.com/nigeria/lokoja/, 2026-10; https://www.prayertime.online/nigeria/lokoja/)
7. In Ramadan the fast runs dawn→sunset, broken with dates and water; sahur/iftar timetables govern the day for Muslim households and food markets spike toward Maghrib. [MED] (https://en.wikipedia.org/wiki/Ramadan_in_Nigeria; https://www.legit.ng/nigeria/1697905-ramadan-2026-sahur-iftar-times-lagos-ibadan-kano-abeokuta-places-nigeria/, Feb 2026)
8. Nigerian schools commonly run: gates ~7:30am, morning assembly ~8:00, lessons ~8:30 — verified for a Lagos international school; treat exact minutes as NIGERIA-GENERIC until a Kogi circular is found. [MED, NIGERIA-GENERIC] (https://isl.unilag.edu.ng/rules-and-regulations/)
9. Federal civil servants observe 8am–4pm (a 2020 directive for GL12+ during COVID, widely remembered as "office time"); generic Nigeria office hours are quoted as 08:00–17:00 Mon–Fri. [MED] (https://pmnewsnigeria.com/2020/08/06/fg-orders-senior-civil-servants-to-observe-8am-4pm-schedule/; https://usebasetime.com/working-hours/nigeria/)
10. Kogi State civil servants are on ~₦72,500 minimum wage since October 2024 (up from ₦30,000), with a year-long tax relief; state blogs list HAPSS grade-level pay. [HIGH for the wage; LOW for per-grade figures] (https://www.pulse.ng/story/kogi-govt-approves-naira72500-minimum-wage-for-workers-2024102811051183029, 2024-10-28; https://kogistate.gov.ng/october-salary-kogi-civil-servants-commend-governor-ododo-for-implementation-of-%E2%82%AC%8E72500-minimum-wage/; https://kashgain.net/blog/official-salary-structure-of-kogi-state-civil-service-allowances-and-benefits-for-public-servants/)
11. Football viewing centres are the weekend/midweek-evening social engine: young men packed into halls for the Premier League, stadium-like banter; entry fees anecdotal ₦150–200 per match (2021–22 forum reports). [MED + anecdotal LOW] (https://nairametrics.com/2021/04/18/the-football-viewing-centre-experience/, 2021-04-18; https://www.nairaland.com/7063461/how-much-pay-viewing-centre)
12. Lokoja nightlife is hospitality-led (hotels, lounges, suya spots around GRA and the highway strip) — 29 bars are listed city-wide with Lounge1 ranked #1 (4.0★/269 reviews); residents do "bigger nights" in Abuja. [MED] (https://www.naijaproperty.com/blog/area-guides/lokoja-kogi, 2026-08-17; https://ranked.ng/bars/lokoja, 2026-09-20)
13. Owambe/asọ-ebi Saturdays are a national institution — "every Saturday, somebody is getting married," with aso-ebi economics estimated in the ₦ trillions (2026 feature). The game's "wedding every ~9 days" reads as credible compression. [MED, NIGERIA-GENERIC] (https://www.talktalknigeria.com/home/2026/8/15/every-saturday-somebody-is-getting-married-the-12-trillion-economics-of-asoebi, 2026-08-15; https://asoebiassist.com/blog/what-is-an-owambe-understanding-nigerias-greatest-party-tradition)
14. Respect for elders is performative and physical: Yoruba men prostrate, women kneel; Hausa greetings are timed chains — Ina kwana (morning), Ina wuni (afternoon), Ina yini (evening), Barka da dare (night). Lokoja's mix (Bassa-Nge, Oworo-Yoruba, Nupe, Igala, Hausa, Ebira, Igbo…) means greetings differ street by street. [MED] (https://discoveryoruba.com/bridges-between-yoruba-and-world-cultures-respect-for-elders/; https://elon.io/grammar/hausa/expressions/social/morning-afternoon-and-evening-greeting-chains; https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance)
15. Nigeria's median age is 18.1 (Jan 2025): 47.5% of the population is under 18; 107m internet users, 38.7m social-media identities, 150m mobile connections — youth data-and-social life is the texture of evenings. [HIGH] (https://datareportal.com/reports/digital-2025-nigeria, Jan 2025)
16. Street hawking by school-age children remains a documented reality — selling before/after school hours, carrying loads; researchers tie it to dropout risk and abuse hazards. [HIGH for the pattern] (https://www.researchgate.net/publication/343696660_IMPLICATION_OF_STREET_HAWKING_ON_CHILDREN'S_FUTURE_CAREER_AMBITIONS_IN_NIGERIA; https://www.idosr.org/wp-content/uploads/2024/03/IDOSR-JCE-92-7-11-2024.pdf, 2024; https://thedevelopmentreport.org/from-classrooms-to-streets-how-school-dropouts-fuel-street-hawking-in-nigeria/)
17. FUL (two campuses: Felele main + Adankolo) anchors a student economy — hostels prioritise 100/400-level in scarce campus accommodation; the Crusher Village/Wada Estate corridor markets land "good for hostel"; cheap eateries, viewing centres and grill spots ring the campus. [MED] (https://fulokoja.edu.ng/news-page.php?i=1001&a=apply-now-ful-felele-campus-accommodation-now-open, 2024/25 session; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi, 2026-08-17)
18. Flood days rewrite the city: in Sept–Oct 2022 canoes replaced commuter buses on the Ganaja–Lokoja highway; boat operators cashed in; the 2022 flood also destroyed the main water works (6 of 8 pumps). [HIGH] (https://dailytrust.com/canoes-take-over-highway-streets-as-flood-ravages-lokoja/, 2022; https://pmnewsnigeria.com/2022/09/25/flooding-commuters-resort-to-canoes-in-lokoja/, 2022-09-25; https://dailytrust.com/lokoja-story-of-capital-city-with-great-rivers-no-potable-water/, 2024-06-22)
19. Religion is tripartite and visible — Islam, Christianity, traditional practice; mosques (incl. Lokoja Central Mosque) and churches (Catholic Diocese of Lokoja, Immaculate Conception Cathedral on Ibrahim Taiwo Rd) both structure Sunday/Friday crowds. [MED] (https://en.wikipedia.org/wiki/Lokoja; https://www.assabile.com/mosque/nigeria/lokoja-central-mosque; https://www.africabizinfo.com/NG/immaculate-conception-catholic-cathedral-0803-913-3260)
20. Traditional authority is live: the Maigari of Lokoja (Etsu) is the city's recognized ruler; FUL news publicly documents FUL–Etsu Lokoja Palace partnership (2026-10-18). The game's maigari-palace location has a real, functioning referent. [MED] (https://en.wikipedia.org/wiki/Lokoja; https://fulokoja.edu.ng/ news ticker, 2026-10-18)
21. Donkwo fishing festival (Mar/Apr) and boat regattas are recorded in Lokoja itself; regatta editions "not regularly" — supporting the game's festival-anchored calendar. [MED] (https://en.wikipedia.org/wiki/Lokoja)
22. Housing reality: rooms/self-cons among the cheapest state-capital rents; GRA duplexes ₦100M–₦650M (2026 asking); elevation beats every other criterion — riverside quarters (Kabawa, low Adankolo) flood repeatedly. [MED] (https://www.naijaproperty.com/blog/area-guides/lokoja-kogi, 2026-08-17)
23. Population is contested: 2006 census LGA 195,261; ~285.5k (2026 LGA projection); UN metro 839k (2023); blogs quote 692k; Wikipedia carries a stale "over 90,000" line. Design for ~300k feel, flag as fuzzy. [contradiction recorded §4] (https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance; https://worldpopulationreview.com/cities/nigeria/lokoja, 2026; https://www.macrotrends.net/global-metrics/cities/206383/lokoja/population; https://en.wikipedia.org/wiki/Lokoja)
24. Lokoja is projected 3rd-fastest-growing African city 2020–2025 (5.93%/yr) — students + civil service + transit trade are the pull. [MED] (https://en.wikipedia.org/wiki/Lokoja, fetched 2026-10-22)
25. Suya spots are the after-dark social institution — grills light up after sunset; in Lokoja they cluster with bars/lounges around GRA and the highway strip. [MED + NIGERIA-GENERIC pattern] (https://locate.ng/suya-spots/lagos; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi, 2026-08-17)
26. Detty December is a real, measured season (Lagos alone ~₦396bn injected; IJGB returnees); the game's Detty December price-inflation event mirrors national reality. [MED] (https://en.wikipedia.org/wiki/Detty_December_(Nigeria); https://echonews.ng/us-uk-drive-lagos-detty-december-to-%E2%82%A6396bn-boom/, 2026; https://cowrywise.com/detty-december-2025)
27. Community life runs on associations and levies: town unions/CDAs collect development levies and run projects (Imo case study; legal limits on compulsion) — matching the game's town-union paving pool. [MED, NIGERIA-GENERIC] (https://eziokwubundu.com/article/community-development-levies-in-imo-explained; https://www.lawtalks.com.ng/can-a-registered-community-development-association-enforce-compulsory-monthly-security-levies-in-nigeria/)
28. Children's evenings: after-school reset — bath, homework, cooking family soup — is documented vlog texture; "chaotic when it's time for homework." [anecdotal LOW] (https://www.youtube.com/watch?v=20XCuO1GUao; https://www.facebook.com/ogom.ogbuefi/videos/1843468203109664/)
29. Water, not crime, is the safety story; roadside/transport economy (Ganaja junction, motor parks, highway strip) is unusually developed because everyone passes through Kogi (borders 10 states). [MED] (https://www.naijaproperty.com/blog/area-guides/lokoja-kogi, 2026-08-17; https://dailytrust.com/lokoja-story-of-capital-city-with-great-rivers-no-potable-water/, 2024-06-22)
30. Prayer-time sources disagree by minutes (method-dependent) and population figures disagree by 4× — but the *hour-shape* (pre-dawn start, midday pause, Maghrib pivot, 20:00–23:00 social peak) is consistent across all sources. Design the scheduler on the shape, not the minutes. [synthesis]

---

## 2. Evidence Tables

### 2.1 Morning (04:00–08:00)
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Fajr opens the Muslim day | Fajr ≈ 05:09–05:34 in Lokoja (method-dependent); sunrise ≈ 06:20; mosque loudspeakers carry the call | https://www.islamicfinder.org/world/nigeria/2331939/lokoja-prayer-times/ ; https://islamic-prayer-times.com/nigeria/lokoja/ | Oct 2026 | HIGH (pattern) |
| Water queue is a morning act | Residents gather "in hundreds to scramble for drinking water at borehole points"; jerrycan 4L now ~₦200; mai ruwa booked days ahead; worst-hit areas incl. Kabawa, Madabo, Gadumo, Lokogoma Ph1&2, Ganaja, Mount Patti area | https://dailytrust.com/lokoja-story-of-capital-city-with-great-rivers-no-potable-water/ | 2024-06-22 | MED |
| Villagers bring goods by canoe at dawn-side hours | Kpata riverbank market receives villagers who "cross with canoe boats" to sell dried fish, grains, bush meat, fruits, vegetables | https://www.nigeriantrend.com.ng/lokoja-kpata-river-market-assorted-food-commodities-to-buy/ | undated (c.2023) | LOW-MED |
| Schools gate early, assembly ~8:00 | "School starts at 7.30am, morning assembly is at 8:00am, lessons start at 8:30am" (Lagos example; NIGERIA-GENERIC) | https://isl.unilag.edu.ng/rules-and-regulations/ | prospectus 2009-2010, live page 2026 | MED |
| Office resumption 8am | Federal directive 8am–4pm (GL12+, COVID-era, still the public's mental model); generic 08:00–17:00 Mon–Fri | https://pmnewsnigeria.com/2020/08/06/fg-orders-senior-civil-servants-to-observe-8am-4pm-schedule/ ; https://usebasetime.com/working-hours/nigeria/ | 2020-08-06; 2026 | MED |
| Harmattan/heat shapes morning timing | Max temps ≈37.9°C Dec–Apr; guides advise planning activity for mornings & evenings | https://en.wikipedia.org/wiki/Lokoja ; https://citylens.blog/pros-and-cons-of-living-in-lokoja/ | fetched 2026-10-22; Oct 2026 | MED |

### 2.2 School
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Lokoja school inventory | Public + private primaries/secondaries; best privates cluster around GRA; examples: Confluence International Academy (private co-ed), Army Day Sec. School, Baptist High School, Government Sec. School, Bassa Nge Anglican Grammar | https://nigerianinformer.com/top-best-secondary-schools-in-lokoja-kogi-state/ ; https://www.finelib.com/cities/lokoja/education ; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | 2025/2026 | MED |
| FUL = two campuses | Main campus Felele (permanent site) + Adankolo campus; faculties across health/law/engineering etc. | https://fulokoja.edu.ng/ (nav: Campuses — Adankolo; Main Campus, Felele) | fetched 2026-10-22 | MED |
| Hostel scarcity, priority by level | Felele campus accommodation opened 2024/25; priority to 100-level and final-year students; VCs inspected renovated hostels to ease off-campus pressure | https://fulokoja.edu.ng/news-page.php?i=1001&a=apply-now-ful-felele-campus-accommodation-now-open ; https://allschool.ng/fulokoja-notice-to-100-level-and-400-level-students-on-hostel-accommodation/ | 2024 | MED |
| Student-housing economy | Land/buildings marketed "good for hostel" along Crusher Village/Wada Estate/campus corridor; Old Poly Quarters nearby; Kogi State Polytechnic + COEs add weight | https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | 2026-08-17 | MED |
| Term dates NIGERIA-GENERIC | 2nd term 2025/26 resumed 12 Jan 2026; state calendars vary | https://suresuccess.ng/news/school-resumption-date-in-nigeria/ ; https://edunile.ng/school-calendar | 2026 | MED |

### 2.3 Office & civil service
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| 8am–4pm civil-service day | Federal directive for GL12+ (Aug 2020); remembered as standard office time; generic Nigeria office 08:00–17:00 | https://pmnewsnigeria.com/2020/08/06/fg-orders-senior-civil-servants-to-observe-8am-4pm-schedule/ ; https://dailypost.ng/2020/08/07/covid-19-nigerian-govt-announces-new-working-hours-for-civil-servants/ ; https://usebasetime.com/working-hours/nigeria/ | 2020-08-06/07 | MED |
| Kogi wage floor ₦72,500 | Gov. Ododo approved ₦72,500/mo minimum wage Oct 2024 (state + LG workers), + 1-yr tax relief; up from ₦30,000 | https://www.pulse.ng/story/kogi-govt-approves-naira72500-minimum-wage-for-workers-2024102811051183029 ; https://kogistate.gov.ng/october-salary-kogi-civil-servants-commend-governor-ododo-for-implementation-of-%E2%82%A672500-minimum-wage/ ; https://www.arise.tv/kogi-state-approves-n72-500-minimum-wage-for-workers/ | 2024-10-28 | HIGH |
| Pay ladder | HAPSS structure; blog example GL7 ≈ ₦108,620 basic (10 yrs) — unverified against official table | https://kashgain.net/blog/official-salary-structure-of-kogi-state-civil-service-allowances-and-benefits-for-public-servants/ ; https://konnect.com.ng/blog/civil-service-salaries-in-kogi-state-new-minimum-wage-allowances-benefits-more-for-public-servants | 2026 | LOW |
| "Most expensive state" paradox + darkness | Chronic power shortages; costs high vs income; resilience via community initiatives (opinion feature) | https://dailytrust.com/lokoja-navigating-the-territory-of-white-lion-in-total-darkness/ | 2023-08-19 | MED (opinion) |
| GRA = official district | Government quarters, senior officials concentrate on high ground | https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | 2026-08-17 | MED |

### 2.4 Market rhythms
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Three big markets, 5-day cycle | New (International) Market, Old Market, Kpata Market; Kpata + New Market market day every five days; grains/vegetables/household goods | https://en.wikipedia.org/wiki/Lokoja ; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | fetched 2026-10-22; 2026-08-17 | HIGH |
| Kpata = river fish trade | Fishmongers 18–55 yrs; freshwater species dominate; meets domestic Lokoja demand; riverside setting | https://www.iiste.org/Journals/index.php/JNSR/article/viewFile/815/721 | c.2013 | MED |
| Canoe-borne vendors | Neighbouring villagers cross by canoe to sell dried fish, bush meat, produce at Kpata | https://www.nigeriantrend.com.ng/lokoja-kpata-river-market-assorted-food-commodities-to-buy/ ; vlog https://www.youtube.com/watch?v=0XoFX-FM3Z8 | c.2023; 2023 video | LOW-MED |
| Roadside economy | Because Kogi borders 10 states, Lokoja's roadside commerce/hospitality for travellers is unusually developed; formal mall retail limited | https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | 2026-08-17 | MED |
| Night market exists in-game | Night market open slots already configured | repo:src/game/data/config.ts:481 | — | repo fact |

### 2.5 Prayer rhythm
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Five daily times | Fajr 05:09/05:34 · Dhuhr 12:36/12:18 · Asr 15:44/16:36 · Maghrib 18:45/18:15 · Isha 19:54/19:13 (two calculators, Oct 2026; Asr gap = method) | https://www.islamicfinder.org/world/nigeria/2331939/lokoja-prayer-times/ ; https://islamic-prayer-times.com/nigeria/lokoja/ | Oct 2026 | HIGH pattern / MED minutes |
| Jumu'ah Friday | Replaces Dhuhr (~12:20–12:36 window); "each mosque sets its own khutbah time"; Lokoja Central Mosque exists w/ Friday & Eid prayers | https://www.prayertime.online/nigeria/lokoja/ ; https://www.assabile.com/mosque/nigeria/lokoja-central-mosque | 2026-10; 2026 | MED |
| Ramadan day | Fast dawn→sunset; iftar starts with dates & water; sahur/iftar timetables published city tables; Ramadan calendar tools exist for Lokoja | https://en.wikipedia.org/wiki/Ramadan_in_Nigeria ; https://www.legit.ng/nigeria/1697905-ramadan-2026-sahur-iftar-times-lagos-ibadan-kano-abeokuta-places-nigeria/ ; https://www.islamicfinder.org/world/nigeria/2331939/lokoja-prayer-times/ | 2026-02; 2026 | MED |
| Christians | Churches run Sunday services (examples 9am–12pm + evening 6–7pm; Catholic multi-mass Sundays); Lokoja Catholic Diocese & Immaculate Conception Cathedral on Ibrahim Taiwo Rd | https://churchofchristlekki.org/ ; https://weekdaymasses.org.uk/en/area/nigeria/churches ; https://www.africabizinfo.com/NG/immaculate-conception-catholic-cathedral-0803-913-3260 | 2026 | MED (NIGERIA-GENERIC times) |

### 2.6 Family & evening
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Evening reset vlog texture | After-school: bath → homework → cooking favourite soup; "chaotic… when it's time for homework" | https://www.youtube.com/watch?v=20XCuO1GUao ; https://www.facebook.com/ogom.ogbuefi/videos/1843468203109664/ | 2025 | LOW anecdotal |
| Homework time is evening's contested hour | "Have you done your homework?!" shouting begins after screen time — naijaschools explainer | https://naijaschools.com.ng/screen-time-and-homework-how-nigerian-parents-can-balance-both/ | 2026 | LOW-MED |
| Suya = after-dark institution | "Where people gather after work"; grills set up after sunset; Lokoja nightlife clusters include suya spots (GRA + highway strip) | https://locate.ng/suya-spots/lagos ; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | 2026 | MED |
| Darkness shapes evenings | Chronic outages push generators, early closures, street-lamp gaps (opinion + water feature's generator/borehole economics) | https://dailytrust.com/lokoja-navigating-the-territory-of-white-lion-in-total-darkness/ | 2023-08-19 | MED |

### 2.7 Weekends
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Viewing centres fill weekend afternoons + midweek evenings | "From mid-day on weekends and some midweek evenings… young men crammed into halls… mainly the EPL"; stadium-like banter | https://nairametrics.com/2021/04/18/the-football-viewing-centre-experience/ | 2021-04-18 | MED |
| Entry fees anecdotal | ₦150 normal EPL, ₦200 star/UCL matches; "posh" centres charge more | https://www.nairaland.com/7063461/how-much-pay-viewing-centre | 2021/22 thread | LOW anecdotal |
| EPL + NPFL weekend watchlists exist | Weekend fixtures drive group chats and viewing parties | https://nigerianeyenewspaper.com/2026/10/17/weekend-football-watchlist-must-see-epl-and-npfl-matches-for-nigerian-fans/ | 2026-10-17 | MED |
| Owambe Saturdays | Aso-ebi solidarity + big money; weddings saturate Saturdays nationally | https://www.talktalknigeria.com/home/2026/8/15/every-saturday-somebody-is-getting-married-the-12-trillion-economics-of-asoebi ; https://www.bellanaijastyle.com/aso-ebi-owambe-arike-alaso/ | 2026-08-15 | MED NIGERIA-GENERIC |
| Sunday double services | Morning + evening services common (examples: 9–12 & 6–7pm) | https://churchofchristlekki.org/ | 2026 | LOW-MED NIGERIA-GENERIC |
| Detty December | Season-long economic phenomenon; Lagos ~₦396bn injected (2025); returnees = IJGB | https://cowrywise.com/detty-december-2025 ; https://echonews.ng/us-uk-drive-lagos-detty-december-to-%E2%82%A6396bn-boom/ ; https://en.wikipedia.org/wiki/Detty_December_(Nigeria) | 2025/2026 | MED |

### 2.8 Children
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| After-school hawking is common | Children sell "carrying heavy loads on their heads for several hours during or after school" (urban Nigeria) | https://www.researchgate.net/publication/343696660_IMPLICATION_OF_STREET_HAWKING_ON_CHILDREN'S_FUTURE_CAREER_AMBITIONS_IN_NIGERIA | 2020 | HIGH pattern |
| Hazards documented | Abuse/insults from customers (Minna wara seller); cholera/accident risks; associated with school disruption | https://thedevelopmentreport.org/from-classrooms-to-streets-how-school-dropouts-fuel-street-hawking-in-nigeria/ ; https://iwpr.net/global-voices/nigeria-school-dropouts-face-hardship-and-abuse | 2024/2026 | MED |
| Academic cost | Street hawking ↔ academic wellbeing studies (Jos North; national reviews) | https://www.idosr.org/wp-content/uploads/2024/03/IDOSR-JCE-92-7-11-2024.pdf ; https://www.multiresearchjournal.com/admin/uploads/archives/archive-1753969373.pdf | 2024; 2025 | MED |
| Youth bulge context | 0–4: 14.4%; 5–12: 21.2%; 13–17: 11.9% of population (Jan 2025) | https://datareportal.com/reports/digital-2025-nigeria | 2025-01 | HIGH |

### 2.9 Elders
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Physical respect gestures | Yoruba: men prostrate (ìdọ̀bálẹ̀), women kneel (kúnlè); taught from childhood; "elders are living libraries" | https://discoveryoruba.com/bridges-between-yoruba-and-world-cultures-respect-for-elders/ ; https://nigeriannewsdirect.com/prostration-a-culture-between-respect-and-civilization/ | 2024/2026 | MED |
| Hausa greeting chains | Ina kwana? (morning) → Ina wuni? (afternoon) → Ina yini? (evening); each opens a social exchange leading to health/work/family questions | https://elon.io/grammar/hausa/expressions/social/morning-afternoon-and-evening-greeting-chains ; https://polyglotclub.com/wiki/Language/Hausa/Vocabulary/Basic-Greetings | 2026 | MED |
| Igala respect | Igala culture: truthfulness, loyalty, respect for one's word; strong traditional structures (Idah historic capital) | https://theafricanarchives.org/article/igala-culture- ; https://chatafrik.com/blog/2026/05/15/what-makes-the-igala-distinct-part-1-why-the-igala-people-are-often-regarded-as-a-people-of-integrity/ | 2026-05-15 | LOW-MED |
| Traditional ruler live | Maigari of Lokoja lineage (Hamza→Dauda→Musa→Maikarfi→…→Kabiru); palace at Yaragi Madabo junction historically; FUL–Etsu partnership news 2026 | https://en.wikipedia.org/wiki/Lokoja ; https://fulokoja.edu.ng/ | fetched 2026-10-22 | MED |
| Lokoja ethnic mix | Bassa-Nge, Oworo-Yoruba, Nupe indigenous; Kupa-Nupe, Hausa, Ebira, Igala, Igbo, Bini/Edo, Tiv established; FUL adds: Bunu, Kakanda, Gbagyi | https://en.wikipedia.org/wiki/Lokoja ; https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance | fetched 2026-10-22; 2014-02 | MED |

### 2.10 Youth
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Nigeria is young | Median age 18.1; 13.9% aged 18–24, 14.1% 25–34 (Jan 2025) | https://datareportal.com/reports/digital-2025-nigeria | 2025-01 | HIGH |
| Connected evenings | 107m internet users (45.4%); 38.7m social media identities; 150m mobile connections | https://datareportal.com/reports/digital-2025-nigeria | 2025-01 | HIGH |
| Student layer in Lokoja | Cheap eateries, viewing centres, grill spots around Crusher Village/campus approaches during term | https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | 2026-08-17 | MED |
| Nightlife venues | 29 bars listed; Lounge1 #1 (4.0★, 269 reviews, "open 24 hours" per listing); Essence Place/Uptown nightlife TikTok circuit | https://ranked.ng/bars/lokoja ; https://www.tiktok.com/@uptownnightlife/video/7692115820918459656 | 2026-09-20; 2026 | MED + LOW |
| Abuja is the big night out | "For a bigger night out, Abuja is the two-hour option, and many residents treat it that way" | https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | 2026-08-17 | MED |

### 2.11 Greetings & hospitality
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Time-of-day greetings are a system | Hausa chains open exchanges; replies lead into health/work/travel/household questions — dialogue designers can model greeting→gist→business as a ladder | https://elon.io/grammar/hausa/expressions/social/morning-afternoon-and-evening-greeting-chains | 2026 | MED |
| Greeting before business | "Market respect people wey get patience" — greeting precedes price talk (cultural rule, Nigeria-wide) | https://elon.io/grammar/hausa/expressions/social/morning-afternoon-and-evening-greeting-chains ; game echo repo:src/game/data/npcChat.ts:46-49 | 2026 | MED |
| Feed-the-guest hospitality | "You must eat before you leave today" — hajiya hospitality norm; game's close-paddy lines already encode it | game echo repo:src/game/data/npcChat.ts:58-61; cultural context https://asoebiassist.com/blog/what-is-an-owambe-understanding-nigerias-greatest-party-tradition | — | MED (cultural pattern) |
| Multilingual city | Greetings land differently per quarter: Hausa (Sarki/Madabo quarters), Yoruba (Oworo), Igala, Nupe, Ebira; English/pidgin lingua franca of the young | https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance ; https://en.wikipedia.org/wiki/Lokoja | 2014; fetched 2026-10-22 | MED |

### 2.12 Community behaviour
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Borehole owners as heroes | Private borehole owners serve families/interests or sell commercially; community sharing is survival infrastructure | https://thereporters.com.ng/2024/06/02/magnanimity-without-borders-borehole-owners-as-the-unsung-heroes-of-lokoja/ ; https://dailytrust.com/lokoja-story-of-capital-city-with-great-rivers-no-potable-water/ | 2024-06-02; 2024-06-22 | MED |
| CDA/town-union levies fund projects | Town unions collect development levies; project levies need transparency; compulsion legally contested | https://eziokwubundu.com/article/community-development-levies-in-imo-explained ; https://ng.rateweb.africa/how-to-run-a-transparent-levy-system-for-a-community-project-nigeria/ ; https://www.lawtalks.com.ng/can-a-registered-community-development-association-enforce-compulsory-monthly-security-levies-in-nigeria/ | 2025/2026 | MED NIGERIA-GENERIC |
| Flood solidarity + adaptation | 2022: canoes on Ganaja highway; boat operators profited; NIWA staff on duty; residents moved in with relatives | https://dailytrust.com/canoes-take-over-highway-streets-as-flood-ravages-lokoja/ ; https://nwachukwupeace.substack.com/p/lokoja-the-devastating-flood | 2022-09/10 | MED |
| Religious coexistence | Islam, Christianity, traditional religion coexist; Eids + Christmas/Easter are the public festivals | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | MED |
| Regatta + Donkwo fishing festival | Donkwo fishing festival Mar/Apr; boat regattas held (irregularly) | https://en.wikipedia.org/wiki/Lokoja | fetched 2026-10-22 | MED |

---

## 3. The Hour-by-Hour City Table (04:00→24:00)

Slot mapping to repo: `morning`/`afternoon`/`evening`/`night` (repo:src/game/data/config.ts:190-192). Rows 04:00–07:59 = morning slot, 08:00–15:59 afternoon, 16:00–19:59 evening, 20:00–23:59 night (designer-adjustable). "Who is out" lists the NPC registry anchors (repo:src/game/data/npcs.ts:27-90).

| Hour | What happens | Who is out | Where | Sound hint | Game hook | Weekend variant |
|---|---|---|---|---|---|---|
| 04:00 | Pre-dawn: last sleep cycle; mai ruwa fill first jerrycans at boreholes; bakers + suya charcoal relight; Tahajjud prayers | Mai ruwa, night bakers, Tahajjud worshippers | Borehole points (Gadumo, Lokogoma, Kabawa); mosques | Drips, distant generator, faint adhan prep | Water-scarcity flavor event (flood season): morning water task; energy −, mood − | Near-empty; only street dogs + first kekes |
| 05:00 | Fajr (05:10–05:35); first keke/okada shifts start; market-bound trucks arrive; school-run parents wake children | Muslim men; transport shift starters; loading touts | Mosques (Central Mosque, Aniebo Masjid); Motor Park; Ganaja junction | Adhan from loudspeakers; keke engines | NPC morning-greeting window opens ("Ina kwana"); Alhaji Sule prays before work | Quiet; fishermen launch canoes on Niger |
| 06:00 | Sunrise ≈ 06:20; water queues peak; schools open gates (7:30); pupils in uniform stream out; shops unbolt; Mama's pots light | Schoolchildren, parents, shop openers, canoe vendors | School streets; borehole lines; Kpata riverbank | Zinc-roof rain patter (wet season), chatter, charcoal smoke | Crowd ramp at kpata-market & food-area; hunger decay accelerates (config decay hunger 2 — repo:src/game/data/config.ts:55-61) | Late wake; joggers at Confluence viewpoint (LOW anecdotal) |
| 07:00 | School resumption/assembly window (7:30–8:00); civil servants drive in; Kpata morning best-buys (fish just landed); booking water for evening | Pupils, teachers, civil servants, fish buyers | Government Area; schools; kpata-market; transport-area | Assembly drum/bell; okada horns | Baba T. at park demand peak; Musa's stall opens; school-run dialogue lines | Saturday: market day if 5-day cycle lands — biggest crowd of week |
| 08:00 | Offices resume (8am–4pm); lessons start (8:30); market bargaining peak; banks/plazas open | Civil servants (Alhaji Sule), traders (Musa, Hajiya Amina), students (Chantel) | government-area, kpata-market, university-area | Typewriters & generators; market hubbub | Work shifts start (work.ts requirement gates — repo:src/game/systems/work.ts:33-57); crowd peak GRA | Church-prep on Sunday; no offices; Saturday markets peak |
| 09:00 | Trading full swing; lectures running; artisans (tailors, welders) working; roadside economy serves through-travellers | Traders, artisans, FUL students, travellers | kpata-market, ganaja-junction, university-area, highway strip | Hammering, haggling, bus departure calls | Hustle offers fire (Emeka dispatch peak); viewing centres dark | Saturday: owambe prep — aso-ebi pickups at Kpata/tailors |
| 10:00 | Heat builds; offices quiet-busy; market mid-morning lull begins; FUL lectures; hospital queues (FMC) | Traders, clerks, patients | government-area, kpata-market, food-area | Fans, generator drone | Energy decay ticks harder (heat); drink/water micro-task | Sunday: main church service window (9am–12pm pattern) |
| 11:00 | Pre-lunch market rush: foodstuffs for afternoon cooking; hawkers load trays | Market women, cooks, hawkers | kpata-market, food-area | Pepper-grinding, tray calls | Mama Ngozi's buka preps; hunger curves crest toward lunch | Saturday: wedding guest convoys start; Sunday: after-church greetings |
| 12:00 | Dhuhr ~12:20–12:36 (Jumu'ah Friday: sermon crowd, khutbah ~1pm); offices break; pupils home ~1:00–2:30 (NIGERIA-GENERIC); lunch peak at bukas | Muslim men → mosques; office workers; school kids | mosques, food-area, government-area | Adhan; radio news; lunch queues | Midday pause: shops shutter briefly (crowd dip 12:30–13:30); lunch = hunger reset | Friday: Jumu'ah surge; Saturday: receptions begin 1–2pm; Sunday: family rice hour |
| 13:00 | Post-prayer/lunch lull; siesta heat (≈30°C feels hotter, humidity high); artisans rest; students out | Elders resting, tailors napping | interiors, verandas | Ceiling fans, snores, cicadas | Crowd trough; mood + if player naps (config INTERIOR relax) | Saturday: owambe peak at Kpata/event centres |
| 14:00 | Schools closing (public primaries early, secondaries later — NIGERIA-GENERIC); hawkers' golden hour begins; Asr approaches (15:44–16:36) | Pupils, child hawkers (respectful framing), traders | school streets, ganaja-junction, kpata-market | School bells, "buy my groundnut" calls | Post-school world activates; child-hawker NPC texture (2.8 sources) | Saturday: football watch-parties assemble 14:30 for 15:00/16:00 kickoffs |
| 15:00 | Asr (≈15:45–16:35); office day winds down; viewing centres tune to EPL early kickoff (weekend); JAMB-lesson kids head to lessons | Worshippers, football fans, students | mosques, viewing centres, university-area | Radio commentary bleeding from parlours | Viewing-centre activity unlocks (evening/night slots per repo:src/game/data/config.ts:924-925) | EPL Saturday triple-header: crowd spikes on goals (mood event) |
| 16:00 | Offices close 4pm; commuters flood Motor Park; Kpata second rush; Confluence viewpoint walks; students free | Workers, commuters, traders, students, families | transport-area, kpata-market, confluence | Keke horns, conductors' chants | Evening slot opens: crowd peak at transport-area & market; Emeka's delivery rush | Saturday: weddings' second wave; Sunday: visits to elders |
| 17:00 | Suya grills light; night market stalls assemble; prayers Asr latecomers; Harmattan haze or rain reshapes all of it | Suya men, night traders, gym-goers, football fans | food-area, kpata-market night stalls, township-stadium | Sizzling meat, banter, dust wind | Suya mood-buff + small cash sink; harmattan weather effect (config weatherEffects) | Patti Ridge sunset climbers (LOW anecdotal); Sunday: evening service 6–7pm pattern |
| 18:00 | Maghrib 18:15–18:45 — iftar in Ramadan (dates + water → full meal); grid power gamble (NEPA dey bring light?); keke shift change | Muslim households, families, shift drivers | homes, mosques, food-area | Adhan; kettle clinks; TV decoder hum | Ramadan modifier: hunger crash pre-18:15, feast after (calendar Ramadan 10d — repo:src/game/data/config.ts:665); flood days: generator chorus | Saturday nightlife ignition; Sunday: quiet family hour |
| 19:00 | Isha ≈ 19:15–19:55; dinner hour; viewing centres packed for UCL midweek / NPFL; bars Lounge1/Dabs fill; students grill-spot circuits | Families, worshippers, football fans, youth | mosques, food-area, viewing centres, Lounge1 | Goal-shouts from centres; DJ warm-up | Night slot opens: hangouts live (config:924-925); Chantel's student crew out | Owambe full-blare: band, spraying, aso-ebi crowds |
| 20:00 | Street food peak; shops close ~20:00-21:00; wedding parties in full swing; family TV (novelas, AFRI Mag) | Party guests, food vendors, youth, families | event centres, food-area, homes, bars | Loudspeakers, horns at receptions | Wedding events (calendar weddings) pay social/rep; Detty December multiplies crowds/prices | Owambe peak hour; Friday-Saturday only in smaller quarters |
| 21:00 | Winding down city-wide; last keke routes; generators vs grid; bottle stores busy; homework-checked kids to bed | Night workers, bar-goers, keke men | transport-area, bars, homes | Generator symphony fading, crickets, last horns | Crowd decay starts; travel risk: night travel on highway advised against (2.10 sources) | Lounges peak; Detty December extends to 02:00 (LOW anecdotal) |
| 22:00 | Quiet residential streets; bars' late crowd thins (Lounge1 listed "open 24 hours" — treat as listing claim, not norm); night guard shifts | Bar stragglers, guards, suya late grill | bars, food-area remnants, streets | Dogs, distant music, generator of a boutique | Player should head home: sleep resets energy (config rest sleep — repo:src/game/data/config.ts:41-46) | Weekends: Uptown/Lounge1 sets run late (anecdotal TikTok LOW) |
| 23:00 | City sleeps; night watchmen, last buses out; mosques quiet; river sound at Adankolo | Watchmen, long-distance drivers | highways, maigari-palace grounds, riverbank | Frogs off the Niger, cold breeze | Sleep hook + next-day weather roll (config weatherWeights); 04:00 cycle begins | Fri/Sat: only nightlife pockets awake |

**Density shape (designer-readable):** trough 04:00–05:59 → ramp 06:00–07:59 → peak-1 08:00–11:59 → prayer/lunch dip 12:30–13:30 (Fri = Jumu'ah surge instead) → rebuild 14:00–15:59 → peak-2 16:00–19:00 → Maghrib micro-dip (Ramadan: inverted — big dip then feast spike) → peak-3 20:00–21:00 → decay to 23:59. Weekend: no office peak-1; market/football/worship dominates 09:00–14:00; nightlife tail longer.

---

## 4. Contradictions & Data Conflicts

| # | Conflict | Source A | Source B | Resolution for design |
|---|---|---|---|---|
| C1 | Population: 195,261 (2006 census, Kogi LGA) vs ~285,521 (2026 LGA projection) vs 839,000 (2023 UN metro) vs 692,000 (blog) vs "over 90,000" (stale Wikipedia line) | https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance ; https://worldpopulationreview.com/cities/nigeria/lokoja | https://www.macrotrends.net/global-metrics/cities/206383/lokoja/population ; https://citylens.blog/is-lokoja-a-good-place-to-live/ ; https://en.wikipedia.org/wiki/Lokoja | Keep in-world census ambiguous; size crowds to a ~300k mid-capital feel. Do not state a canon number. |
| C2 | Kpata market cycle: "every Five Days" vs "weekly popular market" | https://en.wikipedia.org/wiki/Lokoja ; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | https://www.nigeriantrend.com.ng/lokoja-kpata-river-market-assorted-food-commodities-to-buy/ | Two independent sources say 5-day cycle → use 5-day; keep a weekly "big market" as flavor, flagged LOW. |
| C3 | Rain onset: "rains begin March" (FUL Geography 2014) vs "rain begins in May, ends October" (Wikipedia) | https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance | https://en.wikipedia.org/wiki/Lokoja | Both agree peak Jun–Sep, dry from Nov. Game weather table (rain weight 14) unaffected. |
| C4 | Prayer minutes differ across calculators (Fajr 05:09 vs 05:34; Asr 15:44 vs 16:36; Maghrib 18:45 vs 18:15; Isha 19:54 vs 19:13) | https://www.islamicfinder.org/world/nigeria/2331939/lokoja-prayer-times/ | https://islamic-prayer-times.com/nigeria/lokoja/ | Use hour-bands, not minutes: Fajr ~5, Dhuhr ~12:30, Asr ~16, Maghrib ~18:30, Isha ~19:30. Note both in-game clock drift as "local sighting variance." |
| C5 | Nightlife: "nightlife options are limited" vs 29 bars + #1 venue 4.0★/269 reviews + "the night life here is crazy" | https://citylens.blog/pros-and-cons-of-living-in-lokoja/ | https://ranked.ng/bars/lokoja ; https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | Both true: nightlife is real but hospitality-led and small-scale — not Lagos clubland. Model as 6–10 active night venues, weekend-peaked. |
| C6 | Office hours 8am–4pm directive (GL12+, 2020, COVID-era) vs generic 8am–5pm | https://pmnewsnigeria.com/2020/08/06/fg-orders-senior-civil-servants-to-observe-8am-4pm-schedule/ | https://usebasetime.com/working-hours/nigeria/ | Use 8:00–16:00 for state civil servants (matches directive memory), 8–17 for private/plaza shops. |
| C7 | School close times not Lokoja-verified (only Lagos ISL 7:30/8:00/8:30 chain found) | https://isl.unilag.edu.ng/rules-and-regulations/ | (absence) | Keep closing flexible 13:00–15:00 by school type; marked NIGERIA-GENERIC; open question. |
| C8 | Water: "no respite in sight" vs same article's promise Old Waterworks pumps ~1m gallons "in July" 2024 | https://dailytrust.com/lokoja-story-of-capital-city-with-great-rivers-no-potable-water/ | same | Status unresolved in sources → keep water scarcity as persistent background, not binary. |
| C9 | "Most expensive state to live in" moniker vs "everyday living markedly cheaper than FCT" | https://dailytrust.com/lokoja-navigating-the-territory-of-white-lion-in-total-darkness/ (opinion) | https://www.naijaproperty.com/blog/area-guides/lokoja-kogi | Reconcile: cheap vs Abuja, expensive vs income (wage ₦72,500). Model prices low, wages lower. |

---

## 5. Design Seeds for the Game

### 5.0 Mapping targets
- Needs curves → repo:src/game/systems/needs.ts:34-51 (applyNeedsDelta), repo:src/game/data/config.ts:55-61 (decay), :41-46 (rest).
- NPC schedules → repo:src/game/data/npcs.ts:15-25 (NpcDef: homeLocationId + speech), repo:src/game/data/npcChat.ts:8-24 (familiarity tiers).
- Festival hooks → repo:src/game/systems/calendar.ts:4-31 + repo:src/game/data/config.ts:656-712 (anchors: eidFitr 13 / regatta 37 / eidKabir 51; ramadanDays 10; drift 3).
- Slots → repo:src/game/data/config.ts:190-192 (morning/afternoon/evening/night); hangouts evening/night repo:src/game/data/config.ts:924-925; night market repo:src/game/data/config.ts:481.

### 5.1 NPC schedule rules (P0)
1. **Greeting clock (P0):** before any business line, the slot decides the greeting chain — morning "Ina kwana"/"Ẹ káárọ̀", afternoon "Ina wuni"/"Ẹ káàsán", evening "Ina yini"/"Ẹ kú ìrọ̀lẹ́", night "Barka da dare". Hausa chain source: https://elon.io/grammar/hausa/expressions/social/morning-afternoon-and-evening-greeting-chains. Wire as a prefix layer in npcChat voice rules (repo:src/game/data/npcChat.ts:8-11) so every NPC inherits it; speech style ('respectful' vs 'playful', repo:src/game/data/npcs.ts:24) picks the register.
2. **Respect gestures (P0):** greetings to elders (Baba T., Alhaji Sule, Hajiya Amina, Uncle Ben, Maigari) get a "prostrate/kneel" flavor line on first daily talk; refusal of greeting = reputation penalty. Sources §2.9, §2.11.
3. **Five-day market pulse (P0):** `yearDay % 5` (or day % 5) sets Kpata crowd ×1.6 and extra village-vendor NPCs (canoe sellers) on market day; off-day ×0.7. Evidence: §2.4. Implement in calendar-derived daily multiplier (calendar.ts is day-derived & pure — repo:src/game/systems/calendar.ts:19-31).
4. **Prayer breaks (P0):** at ~12:30 (Dhuhr) and ~18:30 (Maghrib), Muslim NPCs (Alhaji Sule, Hajiya Amina) leave posts for ~1 slot; shops' crowd dip. Friday: Jumu'ah surge 12:00–14:00 at mosques, market trough.
5. **School rhythm (P1):** Chantel (student, repo:src/game/data/npcs.ts:69-75) is at university-area during morning/afternoon slots in term, at food-area/viewing centres evening, free weekend. Child-hawker cameo NPCs appear ganaja-junction/kpata-market after school-close in afternoon slot (respectful framing: side-hustle flavor, no abuse content in-game).
6. **Office clock (P0):** Alhaji Sule in government-area 08:00–16:00 weekdays; office quest turns only during those slots; GRA crowd peak 08:00–11:00 & 15:00–16:00.
7. **Transport peaks (P1):** Emeka & Baba T. crowd/demand ×1.5 at 05:00–08:00 and 16:00–19:00 slots (commuter waves — §3 hours 05/07/16).
8. **Ramadan mode (P1):** during calendar Ramadan days: hunger decay doubles pre-Maghrib, big feast bonus after Maghrib; night slot crowd up (tarawih); market busiest pre-dawn + pre-iftar. Source §2.5; calendar hook config:665.
9. **Detty December (P1):** already in calendar; multiply nightlife/event crowds + prices (calendar comment "every price knows it" — repo:src/game/systems/calendar.ts:12-13; evidence §2.7).
10. **Elders' pace (P2):** elders appear at mosque/palace mornings, rest midday (13:00 slot), receive visitors 16:00–19:00 (visit-elder mood activity).

### 5.2 Needs curves & events (P0–P1)
- **Hunger anchors (P0):** three meal windows — morning (07–09), lunch (12–14), dinner (19–21). Outside windows, eating gives less mood; inside windows buka crowd ×1.5 at food-area. Maps to hunger decay 2/slot (repo:src/game/data/config.ts:55-61).
- **Heat energy tax (P1):** afternoon slots (12:00–16:00) add extra energy −1 in sunny weather; harmattan/storm/flood already exist (config:197-215) — stack with crowd penalties.
- **Water event (P1):** "fetch water" morning micro-task when a `waterScarcity` flag is on (persistently on, worse in flood days per Daily Trust 2024 + 2022 pump destruction); small cash cost (jerrycan ₦200 — 2024 observation date) or energy cost; feeds `health` if skipped (hygiene). New flag in world state; do NOT touch needs.ts — use store-level event.
- **Power flicker (P2):** evening slots randomly "light dey blink": interior relax (TV, config:76-78) gives less mood during outage; viewing centres unaffected (they own generators) — subtle nudge to go out at night.
- **Football mood spike (P1):** weekend/midweek-evening viewing-centre activity: mood + on attendance, extra + if "your team" wins (random), crowd shout SFX hint. Evidence §2.7.

### 5.3 Dialogue & greeting rules (P0–P1)
- Greeting-before-price: market NPCs refuse to quote until player greets (stranger tier) — mirrors "Market respect people wey get patience" (repo:src/game/data/npcChat.ts:46-49 already nods to it; make it a mechanic, not flavor).
- Hospitality ladder: at close-paddy tier, food NPCs (Mama Ngozi, Hajiya Amina) offer free meal once/day ("I don cook extra" — repo:src/game/data/npcChat.ts:58-61 matches documented "you must eat before you leave" norm).
- Time-aware idle lines: Musa morning = stock talk; evening = gist/suya; night = "make you waka go house before everywhere dark" (darkness sources §2.6).
- Multi-ethnic flavor: rotate greeting language by NPC (Hausa/Yoruba/Igala/pidgin) per §2.9 ethnic mix; keep translations in flavor data, no new system.

### 5.4 Crowd density per hour per district type (P0 table; multiplier on ambient NPC count)
| District type (launch loc ids) | 04–06 | 06–08 | 08–12 | 12–14 | 14–16 | 16–19 | 19–21 | 21–24 |
|---|---|---|---|---|---|---|---|---|
| Market (kpata-market) | 0.1 | 0.9 | 1.5 | 0.8 | 1.0 | 1.4 | 0.6 (night mkt 0.5) | 0.1 |
| Government (government-area) | 0 | 0.4 | 1.2 | 0.7 | 1.1 | 0.5 | 0 | 0 |
| University (university-area) | 0 | 0.5 | 1.3 | 0.6 | 1.2 | 0.8 | 0.4 | 0.1 |
| Transport (transport-area, ganaja-junction) | 0.4 | 1.4 | 1.2 | 0.9 | 1.0 | 1.6 | 0.8 | 0.2 |
| Food strip (food-area) | 0.2 | 1.0 | 0.8 | 1.5 | 0.9 | 1.2 | 1.6 | 0.5 |
| River/landmark (confluence, mount-patti, pati-ridge) | 0.1 | 0.3 | 0.4 | 0.3 | 0.5 | 1.2 | 0.6 | 0 |
| Heritage (historic-lokoja, maigari-palace) | 0 | 0.2 | 0.7 | 0.4 | 0.5 | 0.6 | 0.1 | 0 |
| Nightlife (sokamms-motel, bars) | 0 | 0 | 0 | 0 | 0.1 | 0.3 | 1.4 | 1.0 |
| Weekend override | markets ×1.5 (market day), offices 0, nightlife ×1.6 Fri/Sat, landmarks ×1.5 Sat / churches Sun morning ×2, viewing centres ×2 Sat 15:00–21:00 & midweek UCL nights |

### 5.5 Priorities
- **P0:** greeting clock; prayer-break schedule; five-day market pulse; office clock; crowd-density table; meal windows.
- **P1:** Ramadan mode; transport peaks; viewing-centre activity; water event; Detty December crowd/price bump; child-hawker cameo framing.
- **P2:** power-flicker mood nudge; elders' visit hour; per-quarter greeting language rotation; harmattan/rain crowd suppressors (rain ×0.8 outdoor).

---

## 6. Open Questions

1. Kogi State primary/secondary school bell times in Lokoja specifically (resumption/closing) — need a Kogi SUBEB circular or a Lokoja parent's account. (C7)
2. Actual closing time of Kpata Market on market days vs everyday trading; whether Old Market has its own cycle.
3. Civil-service lunch break convention at Kogi secretariat (12:00–13:00? prayer-split?).
4. Church service-time table for a named Lokoja parish (Catholic Cathedral mass times page not fetchable — https://catholicdirectory.org/catholic-information.asp?ID=76784 lists the diocese; times unverified).
5. Whether FUL "Market Days" (nav item on https://fulokoja.edu.ng/) is a recurring campus market day students follow — would be a great university-area event hook.
6. Wedding start-time conventions in Lokoja specifically (church 10am + reception 1–2pm is NIGERIA-GENERIC; no Lokoja-specific source found).
7. Keke/okada base fare within Lokoja (NBS fare watch is national; local 2025/26 fare unverified).
8. Youth slang/phrases specific to Lokoja (found none; pidgin + Hausa/Yoruba/Igala mixing is inferred, not documented).
9. Exact prevalence of child hawking in Lokoja (national studies strong; Lokoja-specific enumeration not found).
10. Ramadan-shifted market hours in Lokoja (national pattern documented; local confirmation absent).

---

## 7. Source Registry

### Official / institutional
- Federal University Lokoja — "Lokoja at a Glance" (Geography Dept, Feb 2014): https://fulokoja.edu.ng/about-us.php?i=lokoja-at-a-glance
- FUL homepage + news ticker (FUL–Etsu Palace partnership 2026-10-18; campuses): https://fulokoja.edu.ng/
- FUL Felele accommodation notice (2024/25): https://fulokoja.edu.ng/news-page.php?i=1001&a=apply-now-ful-felele-campus-accommodation-now-open
- Kogi State Government — ₦72,500 minimum wage commendation: https://kogistate.gov.ng/october-salary-kogi-civil-servants-commend-governor-ododo-for-implementation-of-%E2%82%A672500-minimum-wage/
- ISL UNILAG school rules (assembly/lessons times; NIGERIA-GENERIC): https://isl.unilag.edu.ng/rules-and-regulations/
- NBS via republishers — telecom/data subscriber reports (Q4 2025): https://theheron.ng/tech/nigeria-records-179-6-million-active-voice-subscribers-in-q4-2025-nbs/ ; https://thisnigeria.com/active-voice-subscribers-in-nigerias-telecom-sector-hit-179-6m-in-q4-2025-nbs/

### News / analysis
- Daily Trust — Lokoja water scarcity feature (2024-06-22): https://dailytrust.com/lokoja-story-of-capital-city-with-great-rivers-no-potable-water/
- Daily Trust — "White Lion in Total Darkness" power opinion (2023-08-19): https://dailytrust.com/lokoja-navigating-the-territory-of-white-lion-in-total-darkness/
- Daily Trust — 2022 flood, canoes on Ganaja highway (2022): https://dailytrust.com/canoes-take-over-highway-streets-as-flood-ravages-lokoja/
- PM News — civil servants 8am–4pm (2020-08-06): https://pmnewsnigeria.com/2020/08/06/fg-orders-senior-civil-servants-to-observe-8am-4pm-schedule/
- Daily Post — same directive (2020-08-07): https://dailypost.ng/2020/08/07/covid-19-nigerian-govt-announces-new-working-hours-for-civil-servants/
- Pulse — Kogi ₦72,500 wage (2024-10-28): https://www.pulse.ng/story/kogi-govt-approves-naira72500-minimum-wage-for-workers-2024102811051183029
- Arise TV — same: https://www.arise.tv/kogi-state-approves-n72-500-minimum-wage-for-workers/
- PM News — 2022 flood canoes (2022-09-25): https://pmnewsnigeria.com/2022/09/25/flooding-commuters-resort-to-canoes-in-lokoja/
- Nairametrics — viewing-centre experience (2021-04-18): https://nairametrics.com/2021/04/18/the-football-viewing-centre-experience/
- Nigerian Eye — EPL/NPFL weekend watchlist (2026-10-17): https://nigerianeyenewspaper.com/2026/10/17/weekend-football-watchlist-must-see-epl-and-npfl-matches-for-nigerian-fans/
- Legit.ng — Ramadan 2026 sahur/iftar times (2026-02): https://www.legit.ng/nigeria/1697905-ramadan-2026-sahur-iftar-times-lagos-ibadan-kano-abeokuta-places-nigeria/
- The Reporters — borehole owners (2024-06-02): https://thereporters.com.ng/2024/06/02/magnanimity-without-borders-borehole-owners-as-the-unsung-heroes-of-lokoja/
- TalkTalk Nigeria — aso-ebi ₦1.2tn economics (2026-08-15): https://www.talktalknigeria.com/home/2026/8/15/every-saturday-somebody-is-getting-married-the-12-trillion-economics-of-asoebi
- Echo News — Detty December ₦396bn (2026): https://echonews.ng/us-uk-drive-lagos-detty-december-to-%E2%82%A6396bn-boom/
- Nigerian Trend — Kpata river market (undated, c.2023): https://www.nigeriantrend.com.ng/lokoja-kpata-river-market-assorted-food-commodities-to-buy/
- Nigerian Informer — top secondary schools Lokoja (2025/26): https://nigerianinformer.com/top-best-secondary-schools-in-lokoja-kogi-state/
- Finelib — Lokoja education directory: https://www.finelib.com/cities/lokoja/education

### Academic / data
- Kpata fish market study (JNSR/IISTE, c.2013): https://www.iiste.org/Journals/index.php/JNSR/article/viewFile/815/721
- DataReportal — Digital 2025 Nigeria (Jan 2025): https://datareportal.com/reports/digital-2025-nigeria
- IDOSR — street hawking & academic wellbeing (2024): https://www.idosr.org/wp-content/uploads/2024/03/IDOSR-JCE-92-7-11-2024.pdf
- ResearchGate — street hawking & career ambitions (2020): https://www.researchgate.net/publication/343696660_IMPLICATION_OF_STREET_HAWKING_ON_CHILDREN'S_FUTURE_CAREER_AMBITIONS_IN_NIGERIA
- IWPR — school dropouts & hardship: https://iwpr.net/global-voices/nigeria-school-dropouts-face-hardship-and-abuse
- Macrotrends — Lokoja metro population (2023): https://www.macrotrends.net/global-metrics/cities/206383/lokoja/population
- World Population Review — Lokoja 2026: https://worldpopulationreview.com/cities/nigeria/lokoja
- Wikipedia — Lokoja (fetched 2026-10-22 via API): https://en.wikipedia.org/wiki/Lokoja
- Wikipedia — Ramadan in Nigeria: https://en.wikipedia.org/wiki/Ramadan_in_Nigeria
- Wikipedia — Detty December (Nigeria): https://en.wikipedia.org/wiki/Detty_December_(Nigeria)
- Cowrywise — Detty December 2025 report: https://cowrywise.com/detty-december-2025
- Africarrieres — Nigeria working hours guide 2026: https://africarrieres.com/nigeria/en/guide/droit-du-travail/working-hours-leave

### Community / anecdotal (labelled LOW-MED)
- IslamicFinder — Lokoja prayer times (Oct 2026): https://www.islamicfinder.org/world/nigeria/2331939/lokoja-prayer-times/
- islamic-prayer-times.com — Lokoja (Oct 2026): https://islamic-prayer-times.com/nigeria/lokoja/
- prayertime.online — Jumu'ah note: https://www.prayertime.online/nigeria/lokoja/
- Assabile — Lokoja Central Mosque: https://www.assabile.com/mosque/nigeria/lokoja-central-mosque
- NaijaProperty — Lokoja area guide (2026-08-17): https://www.naijaproperty.com/blog/area-guides/lokoja-kogi
- Ranked.ng — 29 bars in Lokoja (2026-09-20): https://ranked.ng/bars/lokoja
- TikTok — Uptown Nightlife @ Essence Place: https://www.tiktok.com/@uptownnightlife/video/7692115820918459656
- Nairaland — viewing-centre fees thread: https://www.nairaland.com/7063461/how-much-pay-viewing-centre
- YouTube — Kpata market vlog: https://www.youtube.com/watch?v=0XoFX-FM3Z8
- YouTube — family after-school evening routine vlog: https://www.youtube.com/watch?v=20XCuO1GUao
- Facebook — Nigerian mum evening routine: https://www.facebook.com/ogom.ogbuefi/videos/1843468203109664/
- Substack — Lokoja flood essay (2022): https://nwachukwupeace.substack.com/p/lokoja-the-devastating-flood
- Elon.io / PolyglotClub — Hausa greeting chains: https://elon.io/grammar/hausa/expressions/social/morning-afternoon-and-evening-greeting-chains ; https://polyglotclub.com/wiki/Language/Hausa/Vocabulary/Basic-Greetings
- DiscoverYoruba / Nigerian NewsDirect — respect gestures: https://discoveryoruba.com/bridges-between-yoruba-and-world-cultures-respect-for-elders/ ; https://nigeriannewsdirect.com/prostration-a-culture-between-respect-and-civilization/
- The African Archives / Chatafrik — Igala culture: https://theafricanarchives.org/article/igala-culture- ; https://chatafrik.com/blog/2026/05/15/what-makes-the-igala-distinct-part-1-why-the-igala-people-are-often-regarded-as-a-people-of-integrity/
- Eziokwubundu / RateWeb / LawTalks — CDA levies: https://eziokwubundu.com/article/community-development-levies-in-imo-explained ; https://ng.rateweb.africa/how-to-run-a-transparent-levy-system-for-a-community-project-nigeria/ ; https://www.lawtalks.com.ng/can-a-registered-community-development-association-enforce-compulsory-monthly-security-levies-in-nigeria/
- Church service-time examples (NIGERIA-GENERIC): https://churchofchristlekki.org/ ; https://weekdaymasses.org.uk/en/area/nigeria/churches
- citylens.blog — pros/cons living in Lokoja (Oct 2026, editorial city-guide quality): https://citylens.blog/pros-and-cons-of-living-in-lokoja/
- Kashgain / Konnect — Kogi salary structure blogs (LOW): https://kashgain.net/blog/official-salary-structure-of-kogi-state-civil-service-allowances-and-benefits-for-public-servants/ ; https://konnect.com.ng/blog/civil-service-salaries-in-kogi-state-new-minimum-wage-allowances-benefits-more-for-public-servants
