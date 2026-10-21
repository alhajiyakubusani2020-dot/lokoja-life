# Team 6 — Economy · raw evidence base (Phase 3 Prelude)

Date of research: 2026-10-22 (all "accessed" dates = this session). Compiler: Team 6 (Economy).
Method: ~30 web search queries (Bing News RSS, DuckDuckGo HTML, Google News RSS) + ~20 article fetches. Web rate-limits blocked some fetches (Tribune, Premium Times body, FIJ body, Jiji listing pages) — for those, the search-result snippet is cited and labelled accordingly. Rules: every claim carries ≥1 URL; prices carry observation dates; conflicts live in §4; NIGERIA-GENERIC is flagged where a fact is national, not Lokoja-verified.

**Repo grounding (calibration targets)** — current in-game values, cited repo:path:line:
- Job pay per shift `basePay`: cleaner ₦800 `src/game/data/jobs.ts:138`, market-worker ₦900 `:47`, nursery-assistant ₦900 `:306`, delivery ₦1,100 `:62`, fisherman ₦1,400 `:92`, driver ₦1,600 `:77`, photographer ₦1,800 `:107`, tour-guide ₦2,200 `:153`, entrepreneur ₦2,400 `:183`, government-worker ₦2,600 `:168`, police-recruit ₦2,800 `:353`, lec-assistant ₦3,200 `:337`, govt-officer ₦3,800 `:322`.
- Hustles ₦300–₦1,500 per errand (`src/game/data/hustles.ts:70,140,248` ranges e.g. wash basins 300–500 `:140`, laptop fix 900–1,500 `:248`).
- Meals: bread+akara ₦250, suya ₦300, amala+goat ₦450, catfish peppersoup ₦650, party jollof+chicken ₦700 `src/game/data/config.ts:386-394`; groceries basket ₦350 `:391`.
- Rent per 7-day cycle: basic-room ₦2,500, apartment ₦15,000, house ₦45,000 `config.ts:170-172`.
- Transport: keke base ₦100 + ₦60/km (≈₦300 at 3 km), taxi ₦300 + ₦220/km (≈₦1,000 at 3 km) `config.ts:155-156`; own-vehicle fuel ₦40–130/km `:160-163`.
- Businesses: stall ₦18,000 buy / ₦1,100/day, kiosk ₦22,000 / ₦1,250/day (POS), okada stand ₦30,000 / ₦1,450/day, buka ₦42,000 / ₦1,900/day `config.ts:825-860`; staff wage ₦400/day, hire fee ₦2,000 `config.ts:798-800`; generator ₦28,000, solar ₦65,000 `config.ts:810-816`.
- Ledger: every flow recorded as Transaction, capped 50 `src/game/systems/economy.ts:25-47`; KGIRS assesses business income `src/game/systems/biz.ts:15-16`; economy slice verbatim-migrated `src/game/store/slices/economy.ts:2-6`.

---

## 1. Executive Findings (≤30 bullets, each ends [src N])

1. Kogi State's civil-service minimum wage is ₦72,500/month — ABOVE the federal ₦70,000 — approved Oct 2024 with a 1-year PAYE suspension on the sum; first paid in the Oct-2024 salary run (Oct 23, 2024). [src 1,2,3,4]
2. The federal ₦70,000 minimum wage (July 2024 Act) is now called a "poverty wage" by the NLC; labour is preparing a fresh negotiation (workers benchmark ≈$365 vs current ≈$51/month). [src 5,6]
3. Kogi IGR exploded from ~₦600m/yr (2016) to ₦43.9bn in 2025; target ₦66.4bn for 2027; cash collection by roadside agents is BANNED and automated ticketing is being rolled out — the state tax layer has gone digital. [src 7,8,9,10]
4. Kogi recorded ₦308.22bn TOTAL revenue in H1 2026 (IGR + FAAC inflows) — the two figures are different measures, not a contradiction. [src 11]
5. Lokoja rents have exploded: a room-and-parlour that was ₦200,000/yr is now ~₦650,000/yr; self-contained ₦250,000–300,000/yr (Aug 2026). [src 12]
6. Standard move-in cost = 1 YEAR rent upfront + 10% agency fee + caution fee (≈₦250k cash to enter a ₦200k/yr flat) — a defining Lokoja cash-flow mechanic. [src 13]
7. Kogi is one of Nigeria's MOST affordable states by price growth: NBS Sep 2026 CPI gives Kogi headline inflation 7.5% y/y, food 8.6% y/y — 9th best in Nigeria, credited to its transit-hub role. [src 14]
8. National food inflation is still 19.59% y/y (Sep 2026); the SBM "Jollof Index" pot costs ₦26,178 (Sep 2026) = 37.4% of a ₦70,000 minimum wage. [src 15,16]
9. Petrol is the economy's heartbeat: NBS average ₦1,596.25/L (May 2026); NNPCL pump ₦1,370→₦1,405/L oscillating in Oct 2026; 2025 had been stable ~₦970–1,061/L. [src 17,18,19]
10. FX context: official ≈₦1,331/$, parallel ≈₦1,355–1,390/$ (mid-Oct 2026). [src 20,21]
11. Obajana (Dangote Cement) is Africa's largest single cement plant: 16.25 Mta across 5 lines, 2,370-truck fleet, ~647m tonnes limestone; operating normally as of a Feb 2026 plant visit; deep CSR footprint (new hospital Jul 2026, scholarships/empowerment Oct 2026). [src 22,23,24,25]
12. Obajana's ownership dispute (Kogi Assembly shutdown Sep–Oct 2022 → FG National Security Council reopening order) is settled in practice: reopened since Oct 2022; the plant produces. [src 26,27,28]
13. Ajaokuta Steel has produced ZERO steel for 47 years yet consumes ₦6.04bn/yr in personnel (2026 budget, zero independent revenue) — a salary town, not a factory. [src 29,30]
14. Ajaokuta revival is a live 2026 storyline: NNPCL signed a 20-year gas supply deal (Jul 2026) and FG is near a $2bn deal with a Chinese investor — while Dangote said publicly it "will never work" (Sep 2025). [src 31,32,33]
15. The Lokoja Ultra-Modern Market (25 ha, Zone 8–Crusher Road axis, 17 sections, 8 km internal roads, banks, clinic, food court, tech hub, independent power) will consolidate traders from SEVEN existing Lokoja markets; contractor SABC; ongoing inspections Oct 2026; funded in part by a ₦50bn Kogi Sukuk bond. [src 34,35,36,37]
16. The OLD International Market sits at a road junction and is a gridlock hazard; Kogi govt + FRSC run market task-force enforcement (May 2026). [src 38,35]
17. Lokoja POS agents are a real, exposed business class: KSVS arrested a syndicate defrauding agents at Cantonment, Kpata and Nataco Junction (Nov 2024); a Lokoja operator's ₦244,000 was locked by a PalmPay PND for ~1 year (lifted Apr 2026 after FIJ coverage). [src 39,40,41]
18. CBN's cash rules now shape street liquidity: individuals capped at ₦100,000/day cash-out (Dec 2025 policy); PoS agents capped at ₦1.2m daily transactions (2024 directive); PoS volumes fell ~20% in 2026 after ATM-fee changes. [src 42,43,44]
19. Intra-city transport: residents complain of "rising transport fares" (FRCN, Mar 2026) and keke/okada "indiscriminate charges" (Kogi Assembly, Sep 2024); the last Lokoja-specific fare datapoint is ₦200 normal vs ₦400–500 flood canoe fare (Sep 2022). [src 45,46,47]
20. A free senatorial shuttle bus launched in Lokoja (Sep 30, 2026) — a visible income-eater for keke/okada drivers. [src 48]
21. NURTW daily union levies were banned statewide (Jan 2025) — the park "loading fee" layer is officially dead, even if informally resilient. [src 49]
22. Fishing paradox: Lokoja sits on two great rivers yet suffers FISH SCARCITY (feature, Aug 2026); academic work documents Kpata & Ganaja Ferry as the active fishing sites; catfish farming is profitable (gross margin ≈1.91 per ₦1). [src 50,51,52]
23. Kpata river-market structure: village vendors cross by canoe to sell dried fish, grains, bush meat cheaper than town prices — a living floodplain supply chain. [src 53]
24. Poverty: the viral claim "Kogi is Nigeria's poorest state" is FALSE — NBS MPI 2022 spans 27% (Ondo) to 91% (Sokoto) and Kogi sits near the low end; national MPI = 63%. [src 54,55]
25. Lokoja hotel market floors: booking platforms list stays from US$10–15/night (~₦13,300–20,000 at Oct 2026 rates); 122 properties listed on Hotels.ng; the state-owned Confluence Beach Hotel famously rotted away (2016) with revival attempts (2019). [src 56,57,58,59,60]
26. Kogi civil servants' pain points in Oct 2026: unpaid 2025 leave allowances, pending promotions/arrears (payments back to 2007 have begun under a "cash-back" policy), and unaffordable housing. [src 61,62]
27. Flood = price shock engine (game's flood weather is real): Sep 2022 floods pushed Lokoja food+transport fares up sharply; 2024 floods displaced ~2 million across Kogi/Nigeria with 200+ communities submerged. [src 47,63]
28. Real market-street price color (undated Facebook vendor post, LOW): red oil 25L ₦62,000; mudu of beans ₦2,000; meat ₦6,000/kg; rice "10 rubbers" ₦103,000; tomatoes basket ₦35,000; atarodo ₦55,000; garri paint-rubber ₦1,500. [src 64]
29. Abuja–Lokoja corridor works are economically decisive: FG N2.5tn road programme includes Abuja–Lokoja; gridlock there "cripples economy and security" (Lokoja chamber); FG slammed slow contractors (Jan 2026). [src 65,66,67]
30. Workforce scale anchors: Dangote Cement group ≈9,981–21,418 employees depending on source; Ajaokuta was designed for 10,000 direct + 500,000 indirect jobs but currently lists ~312–325 staff on aggregator sites. [src 68,69,70]

---

## 2. Evidence Tables

### 2.1 Earnings & wages
| Claim | Detail (₦ figure + date) | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Kogi civil-service minimum wage | ₦72,500/month, "immediate effect", 1-yr tax suspension | https://kogistate.gov.ng/breaking-gov-ododo-approves-72-500-minimum-wage-for-kogi-workers-suspends-tax-burden-on-the-approved-sum-for-one-year/ ; https://fmino.gov.ng/governor-ododo-approves-ngn72500-for-kogi-workers/ ; https://dailytrust.com/kogi-gov-approves-n72500-minimum-wage-for-workers/ ; https://www.arise.tv/kogi-state-approves-n72-500-minimum-wage-for-workers/ | Oct 2024 (announced ~Oct 7) | HIGH |
| First ₦72,500 salary actually paid | Oct 2024 payroll included the new wage; worker quotes receiving alert | https://kogistate.gov.ng/october-salary-kogi-civil-servants-commend-governor-ododo-for-implementation-of-%E2%82%A672500-minimum-wage/ ; https://radiokogi.ng/october-salary-kogi-senior-civil-servant-lauds-gov-ododo-over-payment-of-%E2%82%A672500-minimum-wage/ | Oct 23, 2024 | HIGH |
| Federal minimum wage baseline | ₦70,000/month (2024 Act), still current; NLC calls it "poverty wage"; fresh negotiation prep | https://businessday.ng/business-economy/article/nigerians-spend-37-of-minimum-wage-to-cook-pot-of-jollof-rice/ ; https://www.pulse.ng/story/naira70000-now-a-poverty-wage-nlc-tells-nigerian-workers-to-prepare-for-fresh-minimum-wage-battle-2026072804384344372 ; https://www.msn.com/en-za/money/economy/nigerian-workers-push-for-365-minimum-wage-as-current-51-monthly-pay-loses-value-and-falls-behind-african-peers/ar-AA29DlFx | Jul 2024 → Jul-Aug 2026 | HIGH |
| Civil-servant arrears pressure | 2025 leave allowances unpaid; promotions/salary increments pending; appeal to Ododo | https://kogireports.com/kogi-workers-cry-out-to-ododo-pay-our-leave-allowances-promotion-arrears-provide-affordable-housing/ (mirror: https://thenigerianpost.com.ng/kogi-workers-cry-out-to-ododo-pay-our-leave-allowances-promotion-arrears-provide-affordable-housing/) | Oct 4, 2026 | MED |
| Promotion arrears being cleared | Promotion arrears dating back to 2007 being paid ("cash-back promotion" policy) | https://theparliamentdiary.com/kogi-clears-promotion-arrears-dating-back-to-2007-as-ododos-cash-back-policy-boosts-workers-welfare/ ; https://www.thefreelibrary.com/Kogi+Govt+Approves+Cash-Back+Promotion%2c+Boosts+Workers%27+Welfare%2c+Says...-a0873603754 | 2026 (undated fetch) | MED |
| Pensions outlay | ₦1.8bn released yearly for pensions | https://kogireports.com (via Google News item "Kogi Govt Committed to Workers' Welfare, Releases N1.8b Yearly for Pensions", Sep 4, 2026) | Sep 2026 | MED |
| Ajaokuta payroll (anchor-employer wage pool) | ₦6.04bn personnel budget for 2026, zero output, zero own revenue | https://nairametrics.com/2026/01/10/fg-budgets-n6-04-billion-for-ajaokuta-staff-in-2026-despite-zero-output/ ; https://parrotnigeria.com/2026/01/10/2026-budget-ajaokuta-workers-to-get-n6-4bn-despite-zero-output/ | Jan 10, 2026 | HIGH |
| Informal wage floor example | Sales girl ₦40,000/month (Lagos, Computer Village) — NIGERIA-GENERIC context for informal pay | https://businessday.ng/business-economy/article/nigerians-spend-37-of-minimum-wage-to-cook-pot-of-jollof-rice/ | Oct 20, 2026 | MED |
| Catfish farming viability (Lokoja LGA) | Gross margin ≈ 1.91 return per ₦1 invested — academically measured | https://www.scribd.com/document/939943164/5221-Article-Text-8599-1-10-20240701 | Jul 2024 (study) | MED |

Derived calibration anchors (arithmetic on sourced numbers, no new facts): ₦72,500/mo ≈ ₦2,417/day ≈ ₦604 per 6-hour game slot; ₦70,000/mo ≈ ₦2,333/day.

### 2.2 Markets & food prices
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Pot-of-jollof index (NIGERIA-GENERIC) | ₦26,178 (Sep 2026), −11.5% q/q from ₦29,578 (Jun 2026), +5.8% y/y, +540% vs Jul 2016; = 37.4% of ₦70k MW | https://businessday.ng/business-economy/article/nigerians-spend-37-of-minimum-wage-to-cook-pot-of-jollof-rice/ ; https://hallmarknews.com/food-prices-fall-but-high-living-costs-keep-nigerians-struggling-report/ | Oct 20–21, 2026 | HIGH |
| NBS inflation (national) | headline 14.63% Sep 2026 (20.98% Sep 2025); food +19.59% y/y; food −1.55% m/m (harvest); core 12.95% | https://nairametrics.com/2026/10/18/nigerias-inflation-mirage-food-prices-fall-but-core-pressures-mount/ ; https://proshare.co/articles/nigerias-headline-inflation-falls-to-14.63-in-september-2026-as-food-prices-decline ; https://www.ecofinagency.com/news-finances/1610-59856-nigerias-inflation-eases-further-to-14-6-in-september-2026 | Sep–Oct 2026 | HIGH |
| Kogi state CPI | Kogi headline 7.5% y/y, food 8.6% y/y — 9th most affordable state; "major transit hub" credited | https://nairametrics.com/2026/10/16/top-10-most-affordable-states-to-live-in-nigeria-as-inflation-falls-to-14-63-in-september-2026/ | Oct 16, 2026 | HIGH |
| Lokoja street foodstuff sheet (LOKOJA, vendor post) | red oil 25L ₦62,000; swan-water rubber red oil ₦1,800; mudu beans ₦2,000; meat ₦6,000/kg; rice 10 rubbers ₦103,000 / 11 rubbers clean ₦110,000; okro sack ₦7,000; tomatoes basket ₦35,000; atarodo ₦55,000; garri paint-rubber ₦1,500 | https://www.facebook.com/groups/749323967560456/ (LOKOJA INTERNATIONAL MARKET group, vendor price list) | undated (accessed Oct 2026) | LOW |
| Kpata river market (LOKOJA) | Vendors from neighbouring villages cross by canoe; dried fish, grains, bush meat, fruits/veg "cheaper prices"; weekly popular market on the confluence bank | https://www.nigeriantrend.com.ng/lokoja-kpata-river-market-assorted-food-commodities-to-buy/ | undated (older blog) | LOW |
| Flood price shock (LOKOJA) | Flood Sep 2022: food + transport fares "skyrocket"; traders passed canoe-fare cost into goods | https://dailypost.ng/2022/09/30/flood-prices-of-food-transport-skyrocket-in-lokoja-other-parts-of-kogi/ | Sep 30, 2022 | MED (dated context) |
| Harvest-season price dip | Sep 2026 national food m/m −1.55% (grains, rice, eggs, onions, palm oil, vegetables, potatoes, plantain, tomatoes named) | https://nairametrics.com/2026/10/18/nigerias-inflation-mirage-food-prices-fall-but-core-pressures-mount/ | Oct 18, 2026 | HIGH |
| Govt narrative on food prices | Kogi claims farm-input investment (₦7bn+ implements since 2024) crashing food prices | https://kogistate.gov.ng (Google News item "Ododo's Agricultural Policies Crashing Food Prices in Kogi – Fanwo", Sep 17, 2025) ; https://www.thecable.in.net article item "We've invested over N7bn in farm implements" (Jun 2, 2024) | Sep 2025 / Jun 2024 | MED (official claim) |
| Food insecurity (national) | 36.29m Nigerians at crisis-level food insecurity or worse | https://guardian.ng/business-services/agro-care/nigerias-36-29m-food-insecure-population-raises-pressure-on-agricultural-investment/ | Oct 19, 2026 | MED |

### 2.3 Housing
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Room & parlour rent (LOKOJA) | "used to be ₦200,000 → now ₦650,000" per year | https://www.thisdaylive.com/index.php/2026/08/14/concerns-mount-over-indiscriminate-increase-of-house-rent-in-kogi | Aug 14, 2026 | MED |
| Self-contained rent (LOKOJA) | ₦250,000–₦300,000/yr depending on location/facilities | same THISDAY | Aug 14, 2026 | MED |
| Self-cont / 2-bed (LOKOJA, second source) | self-cont 1-bed ₦200,000–₦250,000/yr; 2-bed from ₦350,000, >₦500,000 in highbrow areas; areas named: Felele, Ganaja Junction, Gadumo, Crusher | https://kogireports.com/when-shelter-becomes-a-shark-high-cost-of-accommodation-in-lokoja-as-a-helping-hand-to-poverty/ (mirror text: https://thenigerianpost.com.ng/when-shelter-becomes-a-shark-how-lokojas-rent-crisis-is-feeding-poverty/) | Jun 14, 2026 | MED |
| Move-in cash rule (LOKOJA) | 1-year rent upfront + 10% agency + caution fee → ≈₦250,000 to occupy a ₦200,000/yr flat (>3 months' gross MW salary) | same Kogi Reports / Nigerian Post | Jun 14, 2026 | MED |
| Rent-crisis drivers (LOKOJA) | FUL + Kogi Poly student demand ("hostage market"); "Yahoo boys" paying any amount; no effective rent-control law; tenants demand tenancy reform on live radio | THISDAY (above); https://www.ait.live (Google News item "Rising House Rents Deepen Hardship In Kogi As Residents Demand Tenancy Reforms", Aug 6, 2026) | Aug 2026 | MED |
| Jiji listing header (LOKOJA) | "Flat for Rent in Lokoja — From ₦650,000/month" (site-normalized header; conflicts with annual figures → §4) | https://jiji.ng/lokoja/42-flats-for-rent (snippet via search) | Oct 2026 | LOW |
| Student hostels | Kogi Poly hostel fees REDUCED by Rector (welfare drive) | https://kogireports.com (Google News item, Sep 30, 2026) | Sep 2026 | LOW |
| Govt estates idle | Residents explain why government housing sits unoccupied (Kogi among examples) | https://guardian.ng (Google News item "Niger, Kogi, residents give reasons for unoccupied government housing", Feb 5, 2025) | Feb 2025 | LOW |
| Rent poverty op-ed (LOKOJA) | "Landlords take 60–70% of income" framing; UNICEF 30% shelter-cost threshold cited | https://thenigerianpost.com.ng/when-shelter-becomes-a-shark-how-lokojas-rent-crisis-is-feeding-poverty/ | Jun 2026 | LOW (opinion) |

### 2.4 Transport costs
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Intra-city fare (LOKOJA, only hard datapoint) | new market → Ganaja village: ₦200 normal (Sep 2022); ₦400–500 by canoe during flood; Kabawa crossing with goods ₦200 | https://dailypost.ng/2022/09/30/flood-prices-of-food-transport-skyrocket-in-lokoja-other-parts-of-kogi/ | Sep 30, 2022 | MED (dated) |
| Fare-rise sentiment (LOKOJA) | "Lokoja residents raise concerns over rising transport fares" | FRCN via Google News (https://news.google.com/rss/search?q=Lokoja+transport+fare, item Mar 10, 2026) | Mar 10, 2026 | MED |
| Keke/okada charge complaints | Kogi Assembly urges govt to save residents from riders' "indiscriminate charges" | https://kogireports.com (Google News item, Sep 12, 2024) | Sep 12, 2024 | MED |
| Union levies banned | Kogi bans daily NURTW revenue collection (affects park fees) | https://www.vanguardngr.com (Google News item "Kogi Govt bans daily revenue collection by NURTW unions", Jan 29, 2025) | Jan 29, 2025 | MED |
| Free shuttle (LOKOJA) | Sen. Karimi launches free shuttle bus to "ease transport burden" | https://tribuneonlineng.com/karimi-launches-free-shuttle-service-to-ease-transport-burden/ (snippet; body 403) | Sep 30, 2026 | MED |
| Petrol-price transmission | Petrol ₦970.59–1,061.35/L most of 2025 → ₦1,532.93 (Apr 2026) → ₦1,596.25 (May 2026): fares climbed with fuel | https://thewhistler.ng/petrol-price-hits-%E2%82%A61596-litre-as-north-west-records-lowest-pms-cost/ ; https://saharareporters.com/2026/06/24/nigerias-n70000-minimum-wage-can-now-buy-just-44-litres-petrol-nbs-data | 2025–Jun 2026 | HIGH |
| Corridor gridlock | Abuja–Lokoja gridlock "crippling economy, security" (chamber); FG slams slow contractors; ₦2.5tn federal road vote incl. Abuja–Lokoja | https://leadership.ng (Google News item) ; https://punchng.com/fg-slams-contractors-over-slow-progress-on-lokoja-abuja-highway-project/ ; Punch item "FG votes N2.5tn for Abuja-Lokoja, Enugu-PH, 122 Roads" | 2025–Jan 2026 | MED |
| Mass-transit advocacy | INGRA urges Kogi to invest in affordable mass transit, water, sanitation | https://www.msn.com/en-xl/urban-infrastructure/transportation-infrastructure/ingra-urges-kogi-govt-to-prioritise-mass-transit-water-supply-sanitation/ar-AA29nv5l | Aug 4, 2026 | MED |

### 2.5 Banking & POS
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Personal cash-out cap | ₦100,000/day for individuals (revised CBN cash policy) | https://www.bbc.com/pidgin/articles/cn98jv57d48o.amp | Dec 3, 2025 | HIGH |
| PoS agent caps | CBN restricted PoS agents to ₦1.2m daily transactions, ₦100,000 per customer | https://dailytrust.com/cbn-restricts-pos-agents-to-n1-2m-daily-transaction-n100000-for-customers/ (related-headline on DT POS story) | 2024 (headline; date not fetched — flag) | MED |
| PoS volume dip | PoS transaction volumes fell ~20% amid tightening regulation + ATM-fee revision | https://www.msn.com/en-xl/africa/nigeria/why-pos-transactions-are-falling-as-cbn-revises-charges/ar-AA2ajk8p | Aug 17, 2026 | MED |
| Fintech risk case (LOKOJA) | PalmPay PND locked a Lokoja PoS operator's ₦244,000 for ~1 year (from 2024); lifted Apr 2026 after FIJ reports | https://fij.ng/article/palmpays-pnd-leaves-lokoja-pos-operators-n244000-for-1-year/ ; https://fij.ng/article/after-fijs-story-palmpay-lifts-pnd-on-pos-operators-account-releases-trapped-n244000/ | Feb 7, 2026 / Apr 6, 2026 | MED |
| PoS crime wave (LOKOJA) | KSVS arrested 2 for defrauding PoS agents at Cantonment, Kpata area, Nataco Junction; separate ₦400k employee fraud at a NUJ-frontage kiosk on day one; PoS operator attacked in bush (Dec 2024) | https://dailytrust.com/2-arrested-for-defrauding-pos-operators-in-lokoja/ ; https://tribuneonlineng.com/two-arrested-for-defrauding-pos-operators-in-kogi/ ; https://dailytrust.com/5-hours-after-resumption-2-pos-employees-defraud-owners-n-4m/ ; https://newswirengr.com/2024/12/26/man-allegedly-lures-friend-who-runs-pos-business-into-bush-slits-his-throat/ | Nov–Dec 2024 | HIGH |
| Cash-scarcity history (LOKOJA) | 2023 naira-swap: Lokoja residents accused POS operators of "high charges"; banks charged for new notes; "outrageous POS charges abated" by Mar 2023 | https://realnewsmagazine.net/redesigned-naira-notes-residents-of-lokoja-accuse-pos-operators-of-high-charges/ ; https://dailypost.ng/2023/03/15/cash-withdrawal-improves-in-lokoja-outrageous-pos-charges-abate/ ; https://kogireports.com (Google News item, Feb 1, 2023) | Jan–Mar 2023 | MED (context) |
| Banks in Lokoja | Zenith branch: Old Kabba Rd, opp. Stella Obasanjo Library; UBA: 4 Wharf Rd; First Bank Lokoja branch listed; 46 bank listings citywide | https://zenith.banklocationmaps.com/en/branch/999269-zenith-branch-old-kabba-road-opp-stella-obasanjo-library ; https://corporate.org.ng/uba-bank-branch-in-lokoja/ ; https://ranked.ng/banks/lokoja ; https://ranked.ng/vs/first-bank-lokoja-branch-10uez0/zenith-bank-xi-0ey | accessed Oct 2026 | MED (directories) |
| State revenue digitization | Kogi bans roadside cash revenue collection; automated ticketing framework; "cash collection remains criminal offence"; KGIRS targets ₦66.4bn | https://kogireports.com (Google News item, Sep 19, 2026) ; https://leadership.ng (Google News item, Sep 25, 2026) ; https://tribuneonlineng.com (Google News item "KGIRS sets N66.4bn IGR target for 2027") | Sep 2026 | HIGH |
| IGR level | ₦600m/yr (2016) → ₦43.9bn (2025) | https://blueprint.ng/we-raised-kogi-annual-revenue-from-n600m-to-n43-9bn-in-10-years-kgirs/ ; https://independent.ng/we-raised-kogi-revenue-from-n600-to-n43-9bn-annually-in-10-years-kgirs-chairman/ ; https://newtelegraphng.com/kogi-igr-hits-n43-9bn-as-kgirs-targets-further-growth/ | Oct 10–13, 2026 | HIGH |

### 2.6 Anchor institutions (Obajana, Ajaokuta, government)
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Obajana scale | 16.25 Mta across 5 lines; flagship + largest plant; commissioned 2007 (2 lines, 5 Mta) | https://cement.dangote.com/nigeria-operations/ | accessed Oct 2026 | HIGH |
| "Africa's largest single cement plant" | Restated Apr 2026 alongside Q1-2026 profit ($233m) | https://www.billionaires.africa/2026/04/30/nigerian-billionaire-aliko-dangotes-dangote-cement-posts-233-million-profit-in-q1-2026/ | Apr 30, 2026 | HIGH |
| Obajana logistics endowment | Fleet of 2,370 trucks; 647m tonnes limestone reserves ("70 years") | https://www.billionaires.africa/2022/10/16/nigerian-govt-orders-immediate-reopening-of-dangotes-obajana-cement-plant/ ; https://www.mynigeria.com/NigeriaHomePage/business/It-will-last-for-70-years-Dangote-reveals-amount-of-cement-reserves-at-Obajana-plant-674729 | Oct 2022 / undated | MED |
| Obajana shutdown & reopening | Kogi Assembly shut it (Sep–Oct 2022) over acquisition/tax allegations; FG National Security Council ordered immediate reopening; plant reopened | https://www.tvcnews.tv/obajana-cement-plant-remains-closed-despite-fgs-reopening-order/ ; https://dailytrust.com/national-security-council-orders-reopening-of-dangote-cement-factory/ ; https://www.nairaland.com/7387010/fg-reopens-dangotes-obajana-cement ; https://www.premiumtimesng.com/news/top-news/558285-manufacturers-body-criticises-kogi-govts-closure-of-dangote-cements-obajana-plant-seeks-fgs-intervention.html | Sep–Oct 2022 | HIGH |
| Obajana operating today | Proshare plant visit report (Feb 2026); CSR: multimillion-naira hospital commissioned at Obajana (Jul 2026); Jakura scholarships + farmer/market-women empowerment (Oct 2026); 2026 Unity Football Tournament (Oct 16) | https://news.google.com Proshare item "Dangote Cement Plc: A Visit to Obajana Plant" (Feb 2, 2026) ; https://leadership.ng/dangote-cement-inaugurates-multi-million-naira-hospital-in-kogi/ ; https://nannews.ng/dangote-cement-obajana-awards-scholarships-empowers-farmers-women-at-jakura-community/ ; https://leadership.ng/dangote-cement-to-hold-inter-community-football-tournament/ | Feb–Oct 2026 | HIGH |
| Ajaokuta: zero output, big payroll | ₦6.04bn personnel 2026; "not produced a single sheet of steel" in 4+ decades; zero projected own revenue | https://nairametrics.com/2026/01/10/fg-budgets-n6-04-billion-for-ajaokuta-staff-in-2026-despite-zero-output/ ; https://verilynews.com/fg-budgets-n6-04bn-for-ajaokuta-staff-salaries-in/ | Jan 10, 2026 | HIGH |
| Ajaokuta revival attempts | NNPCL 20-year gas supply deal ("Tinubu breaks 46-year jinx"); FG nears $2bn revival deal with Chinese investor; 400,000 t/yr iron-rod supply plan (light section mill, 2024) | https://www.vanguardngr.com (Google News item, Jul 8, 2026) ; https://thesun.ng (Google News item "FG nears $2bn Ajaokuta Steel revival deal with Chinese investor", Jul 9, 2026) ; https://punchng.com/ajaokuta-steel-to-supply-400000-metric-tonnes-of-iron-rods-for-road-construction/ | Jul 2026 / May 2024 | MED |
| Ajaokuta skeptic-in-chief | Dangote: "Ajaokuta steel company will never work" (TVC interview) | https://www.premiumtimesng.com/business/business-news/821600-ajaokuta-steel-company-will-never-work-dangote.html (snippet; body fetch blocked) | Sep 15, 2025 | MED |
| Ajaokuta jobs design vs reality | Designed: 10,000 direct + 500,000 indirect (when 1.3 Mt liquid steel commissioned); aggregators list ~312–325 current employees | https://mofi.com.ng/wp-content/uploads/2026/04/Ajaokuta-Steel-Company-Limited-_-2021-AFS.pdf ; https://contactout.com/company/Ajaokuta-Steel-Company-Limited-1876 ; https://rocketreach.co/ajaokuta-steel-company-limited-profile_b745e333c539ee67 | 2021 AFS / 2026 aggregators | MED/LOW |
| State finances | ₦308.22bn total revenue H1 2026; ₦50bn Sukuk bond planned for airport + Lokoja market; 2027 IGR target ₦66.4bn; int'l airport site handed to contractors | https://tribuneonlineng.com (Google News item, Oct 12, 2026) ; https://www.vanguardngr.com (Google News item "Kogi plans ₦50bn Sukuk Bond", Jan 22, 2026) ; https://kogistate.gov.ng (Google News item "Ododo Hands Over Airport Project", Apr 8, 2026) | Jan–Oct 2026 | MED |

### 2.7 Informal economy
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Petty trade = the city's base | "Lokoja's economy runs on petty traders — women selling yam flour, groundnuts, akpu, roasted corn, second-hand clothes" | https://kogireports.com/when-shelter-becomes-a-shark... (mirror: thenigerianpost.com.ng) | Jun 14, 2026 | MED |
| Fish scarcity paradox (LOKOJA) | Feature: despite the confluence, residents face fish scarcity, protein access limited | https://nationalfocusng.com/2026/08/14/abundant-rivers-scarce-fish-the-paradox-of-fishing-in-lokoja/ (snippet; site unreachable from this host) | Aug 14, 2026 | MED |
| Fishing sites (academic) | Indigenous fish diversity + socioeconomic importance studied at Kpata and Ganaja Ferry sites, Lower Niger (Lokoja) | https://cjpas.org.ng/index.php/pub/article/view/103 (snippet; fetch timeout) | 2024–2025 (journal) | MED |
| Fingerling trade (LOKOJA) | Fingerlings/juveniles offered at ₦50 (Lokoja listing) | https://opor.ng/en/board/m-2010/ | Oct 15, 2026 | LOW |
| Catfish sizes on sale (LOKOJA) | Table-size catfish 1 kg / 1.5 kg / 2 kg + broodstock (Jiji listing) | https://jiji.ng/lokoja/meals-and-drinks/table-sized-cat-fish-vQmVDkcVOMN11vSon5q1cld.html | undated (accessed Oct 2026) | LOW |
| Catfish feed prices (Kogi) | 3mm ₦4,200 / 4mm ₦4,100 / 5mm ₦3,900 (Itape-Lokoja expressway seller, FB group) | https://www.facebook.com/groups/235194371792159/posts/302463415065254/ | undated | LOW |
| Vending community | Lokoja Vendors Community FB group; night-time street vending documented informally (pool tables, roadside stalls, passing traffic) | https://www.facebook.com/groups/3219121224994111/ ; https://www.collectivememory.ai/events/cl_e1a9f11fd541773f85ae/nightlife-along-lokojas-streets-pool-vendors-and-passing-tra | accessed Oct 2026 | LOW |
| Markets inventory (Kogi) | Lokoja Main Market (Ibrahim Taiwo Rd) = largest/busiest in capital; foodstuffs, clothing, electronics, building materials; Lokoja Shopping Centre ~15,000 sqm | https://kashgain.net/blog/full-list-of-local-markets-in-kogi-state/ ; https://getoccupi.com/malls/lokoja-shopping-centre | accessed Oct 2026 | LOW |

### 2.8 Hotels–restaurants–retail
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| Hotel price floor (LOKOJA) | Booking.com "from US$10"; Tripadvisor "deals from $13"; Expedia/Hotels.com "from $15" (per night) | https://www.booking.com/city/ng/lokoja.html ; https://www.tripadvisor.com/Hotels-g1072067-Lokoja_Kogi_State-Hotels.html ; https://www.expedia.com/Lokoja-Hotels.d6360079.Travel-Guide-Hotels ; https://www.hotels.com/de1911274/hotels-lokoja-nigeria/ | accessed Oct 2026 | MED |
| Hotel supply count | 122 hotels/lodges/short-lets listed for Lokoja (Hotels.ng); 34 on trivago; 46 "bank listings" n/a — ranked.ng lists 46 banks; ~19–20 properties on EaseMyTrip | https://hotels.ng/hotels-in-kogi/lokoja/ ; https://www.trivago.com/en-US/odr/hotels-lokoja-nigeria?search=200-66322 ; https://www.easemytrip.com/hotels/hotels-in-lokoja/ | accessed Oct 2026 | MED |
| Signature decayed asset | Confluence Beach Hotel "rots away" (2016); resuscitation moves (2019) | https://allafrica.com (Google News item, May 16, 2016) ; https://kogireports.com (Google News item, Apr 12, 2019) | 2016/2019 (context) | MED |
| Hotel regulation | Tourism commissioner charged hotels with security "as a serious business" | https://kogistate.gov.ng (Google News item, Apr 23, 2025) | Apr 2025 | MED |
| Retail strip | Supermarkets cluster on Ibrahim Taiwo Rd (Bledon No 329; Rising Sun, off Ibrahim Taiwo Way) | https://nigeria.worldplaces.me/review/154870502-bledon-supermarket.html ; https://ng.worldorgs.com/catalog/lokoja/grocery-store/therisingsunsupermarket | accessed Oct 2026 | LOW |
| Ultra-modern market build-out | 25 ha; Zone 8–Crusher Rd; traders from 7 markets consolidated; 17 sections; 8 km internal roads; warehouses, tech hub, banking hall, clinic, fire/security stations, food court, worship centres, watchtower, independent power; contractor SABC Ltd | https://thesun.ng/ododo-lokoja-ultra-modern-marketll-redefine-commerce-create-jobs/ | Sep 7, 2026 | HIGH |
| Market enforcement | Govt+FRSC sensitization vs roadside offloading/parking at International Market; Market Task Force | https://leadership.ng/kogi-govt-frsc-to-end-traffic-gridlock-at-lokoja-international-market/ | May 15, 2026 | MED |

### 2.9 Macro context
| Claim | Detail | Source(s) URL | Source date | Confidence |
|---|---|---|---|---|
| FX | official ≈₦1,331.09/$ ; parallel ₦1,355–1,390/$ ; naira appreciated vs $/€ at official window (Oct 21) | https://www.gistreel.com/naira-to-dollar-exchange-rate-today-friday-october-16-2026/ ; https://investorsking.com/2026/10/19/dollar-to-naira-black-market-exchange-rate-rate-today-monday-october-19-2026/ (see registry for exact URL) ; https://www.legit.ng/business-economy/money/1737197-naira-exchange-rates-dollar-euro-pound-prices-official-market/ | Oct 16–21, 2026 | MED |
| Petrol timeline | 2025 mostly ₦970.59–1,061.35/L; Feb 2026 ₦1,051.47; May 2026 avg ₦1,596.25 (+55.31% y/y); Sep 2026 several states ≥₦1,500 incl. Kogi; Oct 2026 NNPCL ₦1,370 → ₦1,405/L; landing cost ₦1,283.81/L; Brent >$100 | https://thewhistler.ng/petrol-price-hits-%E2%82%A61596-litre-as-north-west-records-lowest-pms-cost/ ; https://microdata.nigerianstat.gov.ng/index.php/catalog/157 ; https://saharareporters.com/2026/06/24/nigerias-n70000-minimum-wage-can-now-buy-just-44-litres-petrol-nbs-data ; https://www.msn.com/en-xl/africa/nigeria/petrol-price-shock-see-states-where-1-litre-of-fuel-now-sells-for-1500/ar-AA2cqaTv ; https://politicsnigeria.com/2026/10/17/nnpc-increases-petrol-price-despite-30-day-discount/ ; https://dailypost.ng/2026/10/21/petrol-landing-cost-drops-to-n1283-litre-as-depot-prices-remain-high/ | 2025–Oct 2026 | HIGH |
| Inflation path | 27.6% (Jan 2025) → 15.2% (Dec 2025), "stalled" ~15.5% 2026 (World Bank NDU); headline 14.63% Sep 2026 | https://nairametrics.com/2026/10/18/nigerias-inflation-mirage-food-prices-fall-but-core-pressures-mount/ | Oct 2026 | HIGH |
| Purchasing-power erosion | ₦70,000 MW = 43.9 litres of petrol (May 2026 prices) | https://saharareporters.com/2026/06/24/nigerias-n70000-minimum-wage-can-now-buy-just-44-litres-petrol-nbs-data | Jun 24, 2026 | HIGH |
| Poverty (MPI 2022) | National MPI 63% multidimensionally poor (40.1% monetary, 2018/19); state range 27% (Ondo)–91% (Sokoto); claim "Kogi poorest" FALSE | https://nigerianstat.gov.ng/news/78/ ; https://nigerianstat.gov.ng/pdfuploads/NIGERIA%20MULTIDIMENSIONAL%20POVERTY%20INDEX%20SURVEY%20RESULTS%202022.pdf ; https://factcheckhub.com/claim-that-kogi-is-the-poorest-nigerian-state-is-false/ (snippet) ; https://factcheckafrica.net (Google News item, Nov 25, 2024) | Nov–Dec 2024 | HIGH (for the falsity; Kogi's exact % = §6) |
| Flood displacement | Oct 2024: ~2m displaced, 200+ communities submerged as severe floods hit Kogi/Nigeria | https://the-watchers (Google News item "Over 2 million displaced, 200 communities submerged as severe floods hit Kogi, Nigeria", Oct 14, 2024) ; https://reliefweb.int (Situation Report, Oct 28, 2024) | Oct 2024 | MED |

---

## 3. The Price Board (calibration table for the game economy)

| Item / service | Naira range | Observation date | Source | Confidence |
|---|---|---|---|---|
| Kogi civil-servant monthly minimum wage | ₦72,500 | Oct 2024 (still current Oct 2026) | kogistate.gov.ng [src 1] | HIGH |
| Federal monthly minimum wage | ₦70,000 | Jul 2024 → Oct 2026 | businessday [src 5] | HIGH |
| Informal sales-girl wage (NIGERIA-GENERIC floor) | ~₦40,000/mo | Oct 2026 | businessday [src 5] | MED |
| Pot of jollof rice (home-cook, national avg) | ₦26,178 (Jun 2026: ₦29,578) | Sep 2026 | SBM via businessday [src 16] | HIGH |
| Derived jollof ingredient cost per plate (pot ÷ 10–12 plates) | ~₦2,200–2,600 | derived from Sep 2026 pot cost | derivation [src 16] | MED (derivation) |
| Room & parlour rent (Lokoja, per YEAR) | ₦650,000 (was ₦200,000) | Aug 2026 | THISDAY [src 12] | MED |
| Self-contained rent (Lokoja, per YEAR) | ₦200,000–₦300,000 | Jun–Aug 2026 | Kogi Reports [src 13] + THISDAY [src 12] | MED |
| 2-bedroom flat rent (Lokoja, per YEAR) | ₦350,000–₦500,000+ | Jun 2026 | Kogi Reports [src 13] | MED |
| Move-in cash multiplier (Lokoja) | rent ×1.10 + caution (≈ +25% on yr-1 cash) | Jun 2026 | Kogi Reports [src 13] | MED |
| Flat listing header on Jiji (Lokoja) | "from ₦650,000/month" (§4 conflict) | Oct 2026 | jiji.ng | LOW |
| Petrol, NNPCL pump | ₦1,370–₦1,405/L | Oct 2026 | politicsnigeria [src 18] | HIGH |
| Petrol, national retail average (NBS) | ₦1,596.25/L | May 2026 | NBS via SaharaReporters [src 17] | HIGH |
| Petrol, Kogi state level | ≥₦1,500/L (grouped in high-price states) | Sep 2026 | NBS via MSN [src 19] | MED |
| Petrol, 2025 baseline | ₦970.59–₦1,061.35/L | 2025 | TheWhistler/NBS | MED |
| USD/NGR official | ≈₦1,331/$ | Oct 16, 2026 | gistreel [src 20] | MED |
| USD/NGR parallel | ₦1,355–1,390/$ | Oct 14–19, 2026 | investorsking [src 21] | MED |
| Individual daily cash-out cap (CBN) | ₦100,000/day | Dec 2025 | BBC [src 42] | HIGH |
| PoS agent daily transaction cap | ₦1,200,000 (₦100,000/customer) | 2024 directive | Daily Trust headline | MED (date flag) |
| PoS operator float seen frozen in fraud case (Lokoja) | ₦244,000 | 2024–Apr 2026 | fij.ng [src 41] | MED |
| Intra-city keke/okada fare (Lokoja, road, 1 drop) | ₦200 (last hard datapoint) | Sep 2022 | dailypost [src 47] | MED (dated — pre-fuel-hike) |
| Canoe fare new-market→Ganaja (flood) | ₦400–500/trip | Sep 2022 | dailypost [src 47] | MED (dated) |
| Canoe crossing Kabawa with goods | ₦200 | Sep 2022 | dailypost [src 47] | MED (dated) |
| Red oil 25 L (Lokoja vendor) | ₦62,000 | undated (accessed Oct 2026) | Facebook vendor list [src 64] | LOW |
| Beans, per mudu (Lokoja vendor) | ₦2,000 | undated | Facebook [src 64] | LOW |
| Meat, per kg (Lokoja vendor) | ₦6,000 | undated | Facebook [src 64] | LOW |
| Rice, ~10 "rubbers" (Lokoja vendor) | ₦103,000 (11 rubbers clean: ₦110,000) | undated | Facebook [src 64] | LOW |
| Tomatoes, basket (Lokoja vendor) | ₦35,000 | undated | Facebook [src 64] | LOW |
| Atarodo pepper (Lokoja vendor) | ₦55,000 | undated | Facebook [src 64] | LOW |
| Garri, paint-rubber (Lokoja vendor) | ₦1,500 | undated | Facebook [src 64] | LOW |
| Catfish fingerling (Lokoja) | ₦50 each | Oct 15, 2026 | opor.ng | LOW |
| Catfish feed 3–5 mm (Kogi) | ₦3,900–4,200/bag | undated | Facebook sellers group | LOW |
| Table-size catfish (Lokoja listing) | 1–2 kg sizes offered (no ₦ in snippet) | accessed Oct 2026 | jiji.ng | LOW |
| Hotel room, cheapest listed (Lokoja) | US$10–15/night ≈ ₦13,300–20,000 | accessed Oct 2026 | booking/tripadvisor/expedia | MED |
| Ajaokuta annual payroll (state-adjacent wage pool) | ₦6.04bn/yr, zero output | Jan 2026 | nairametrics [src 29] | HIGH |
| Kogi IGR (annual) | ₦43.9bn (2025); ₦66.4bn target (2027) | Oct 2026 / Sep 2026 | blueprint [src 7] / Leadership [src 9] | HIGH |
| Kogi total revenue (H1) | ₦308.22bn | Oct 2026 | Tribune/MSN [src 11] | MED |
| Kogi Sukuk bond (planned) | ₦50bn (airport + Lokoja market) | Jan 2026 | Vanguard [src 37] | MED |
| Obajana plant capacity | 16.25 Mta/yr (5 lines) | accessed Oct 2026 | cement.dangote.com [src 22] | HIGH |

---

## 4. Contradictions & Data Conflicts (both sides recorded — no silent winners)

1. **Obajana operating status.** TVC News: "Cement plant remains closed despite FG's reopening order" (URL undated on page; Google News stamped it 09 Mar 2025, but the body context matches the 2022 crisis) VS Daily Trust/Nairaland: reopened Oct 2022 after NSC order; Proshare: on-site plant visit report Feb 2026; CSR events continue at the site through Oct 2026. → Working verdict: OPERATING as of 2026 (weight of evidence), TVC item treated as 2022-era reporting with a bad date stamp. [src 26,27,28,24]
2. **Lokoja flat rent period.** Jiji category header: "Flat for Rent in Lokoja — From ₦650,000/**month**" (Oct 2026) VS THISDAY: room-&-parlour ₦650,000/**year** (Aug 2026) and Kogi Reports: 2-bed ₦350–500k/**year** (Jun 2026). A 12× gap — most plausible explanations: Jiji's monthly normalization artifact on annual-rent listings, or a handful of premium short-let listings dragging the header. BOTH recorded; annual figures (news-corroborated) preferred for the game. [src 12,13 + jiji]
3. **Ajaokuta's future.** Dangote: "will never work" (Sep 2025) VS Vanguard/The Sun: NNPCL 20-yr gas deal + $2bn Chinese revival "nears" (Jul 2026) VS Nairametrics: ₦6.04bn salaries, zero output, zero revenue (Jan 2026). All three coexist in Oct 2026 — a salary-paying, non-producing plant with a live revival narrative. [src 29,31,32,33]
4. **Kogi revenue scale.** KGIRS: IGR ₦43.9bn for 2025 VS Finance Commissioner: ₦308.22bn revenue in H1 2026. Not the same measure (IGR = internally generated only; the ₦308bn includes FAAC/allocations). Both true; game must not call the ₦308bn "IGR". [src 7,11]
5. **Dangote Cement headcount.** Revelio Labs: ≈9,981 employees (Mar 2026) VS stockanalysis.com: 21,418 (Dec 2025). Different methodologies (platform data vs filings-derived). Range recorded, no winner. [src 68,69]
6. **"Kogi is the poorest state" (viral claim) VS data.** FactCheckHub + factcheckafrica: FALSE — MPI 2022 state range 27%–91%, Kogi near the low end; NBS CPI Sep 2026 also puts Kogi among the most affordable. Viral claim rejected. [src 54,55,14]
7. **Minimum wage number.** Federal ₦70,000 (still the legal national floor) VS Kogi's implemented ₦72,500. Both current; the game's city sits under the Kogi figure. [src 1,5]
8. **THISDAY typographic artifact.** "now N650,0000" — interpreted as ₦650,000/yr (consistent with its own ₦250–300k self-cont figures and Kogi Reports' ₦350–500k 2-bed). Flagged, not silently fixed. [src 12]

---

## 5. Design Seeds for the Game (calibration verdicts + new activities)

### 5.1 Calibration verdicts on current values
**Scale anchor (sourced):** Kogi MW ₦72,500/mo → ≈₦2,417/day ≈ ₦604/game-slot (4 slots/day). A 1-slot job at the bottom of the market should pay a meaningful fraction of ₦1,208 (half-day MW).

| Game value (repo) | Verdict | Evidence-based reasoning |
|---|---|---|
| jobs.ts bottom tier ₦800–900/shift (cleaner `jobs.ts:138`, market-worker `:47`, nursery-assistant `:306`) | **OK, keep** (slightly low is fine for 1-slot informal shifts) | ₦850/slot ≈ 1.4× the MW slot-rate — matches a worker who can out-earn MW on a good half-day. No Lokoja day-rate source found (§6), so no strong push either way. |
| jobs.ts formal tier ₦2,600–3,800/shift (government-worker `:168`, police-recruit `:353`, govt-officer `:322`) | **OK** | ₦2,600–3,800 per 2-slot day ≈ ₦57k–₦83k/30d — straddles the sourced ₦70–72.5k civil-service floor. govt-officer ₦3,800/shift(1 slot, `jobs.ts:321` 1 slot) reads as a senior's rate ≈ ₦91k+/mo — consistent with a degree-gated GRA post. |
| hustles.ts ₦300–₦1,500/errand (`hustles.ts:70,140,248`) | **OK; top-end could stretch** | Kid chores ₦300–600 = pocket-money scale (LOW confidence, no source). Laptop-fix ₦900–1,500 is plausible vs formal tier. Consider a ₦2,000–3,500 rare "great outcome" band for skill-3 hustles to reflect festival/eid cash spikes (ram/festive inflation is sourced as a phenomenon — game already has festive multipliers). |
| meals ₦220–700 (`config.ts:386-394`) | **LIKELY TOO LOW for 2026 — P1 uplift ×1.5–2.5** | Sourced macro: food inflation +19.59% y/y (Sep 2026) after +27.6%→15.2% inflation year 2025; SBM pot of jollof ₦26,178 ⇒ derived ₦2,200–2,600/plate of INGREDIENTS alone [src 15,16]. Game jollof+chicken ₦700 is roughly a 2022 price. No Lokoja buka plate-price source found (§6), so mark verdict MED confidence; recommend amala ₦700–900, jollof+chicken ₦1,500–2,000, peppersoup ₦1,200–1,800, bread+akara ₦400–600, groceries basket ₦700–1,000. |
| rent: basic-room ₦2,500/7d (≈₦10,714/mo) (`config.ts:170`) | **TOO LOW — P0 uplift** | Cheapest real room (self-cont) = ₦20,833–25,000/mo; room&parlour ₦54,167/mo (THISDAY Aug 2026 [src 12]). Recommend basic-room ≈ ₦25,000/mo equivalent (i.e. ₦5,800/7d cycle) minimum, or re-brand the tier as "family/shared space". |
| rent: apartment ₦15,000/7d (≈₦64,286/mo) (`config.ts:171`) | **OK (accidentally realistic)** | ≈ real Lokoja room-&-parlour ₦650k/yr = ₦54,167/mo [src 12]. Keep, or re-map: this tier should BE the room&parlour; add a "self-cont" tier at ~₦22k/mo between basic-room and apartment. |
| rent: house ₦45,000/7d (≈₦192,857/mo) (`config.ts:172`) | **PLAUSIBLE-UNVERIFIED** | No whole-house Lokoja listing captured (Jiji fetch blocked). 2-bed highbrow >₦500k/yr ⇒ whole decent house ≈ ₦1.2–2.4M/yr plausible. Keep with LOW-confidence flag. |
| NEW: move-in cash rule | **ADD (P0)** | 1-yr upfront + 10% agency + caution = ≈₦250k cash to enter a ₦200k/yr flat [src 13]. Game should charge a one-time `moveInCash = rent_yr × 1.1 + caution` — this is THE Lokoja housing mechanic. |
| transport keke ₦100+₦60/km (≈₦300/3km) (`config.ts:155`) | **OK-to-slightly-low; keep with flood/weather multipliers** | Only Lokoja datapoint: ₦200/drop Sep 2022 [src 47]; fuel has since risen from ~₦1,000/L to ₦1,370–1,596/L [src 17,18] and residents complain fares "rose" (Mar 2026 [src 45]). ₦300/3km in 2026 is defensible; make fuel-surge days bite. |
| own-taxi fuel ₦130/km (`config.ts:162`) | **OK (evidence-aligned)** | At ₦1,370/L and ~10 km/L ⇒ ≈₦137/km — game value matches Oct-2026 pump reality almost exactly. |
| own-okada ₦45/km (`config.ts:160`) | **OK** | At ₦1,370/L and ~30 km/L ⇒ ≈₦46/km. |
| biz staffWagePerDay ₦400 (`config.ts:798`) | **TOO LOW — P1 uplift to ≥₦1,500** | ₦400/day ≈ 1/6 of the sourced MW day-rate (₦2,417) [src 1]. Even informal shop help can't be 16% of MW. Recommend ₦1,200–2,500/day and raise hire fee ₦2,000 → ₦5,000–10,000. |
| biz buyCosts ₦18,000–42,000 (`config.ts:825-860`) | **UNVERIFIED — flag** | No sourced price for Kpata stall rights or kiosk capital (§6). Sanity note from banking evidence: a real PoS agent's WORKING FLOAT alone was ₦244,000 [src 41]; CBN caps imply agent floats ≥₦100k/day [src 42]. ganaja-kiosk at ₦22k buy is fine as game abstraction (till ≠ float), but consider a separate `float` ledger for the POS shop. |
| biz income ₦1,100–1,900/day (`config.ts:825-860`) | **OK as margin-abstraction** | An attendant wage + NEPA load + market-day multiplier system already models the real cost stack (shedding penalty, staff boost). No direct daily-takings source (§6). |
| NEPA/generator ₦28,000 & solar ₦65,000 (`config.ts:810-816`) | **UNVERIFIED — keep, flag LOW** | No source captured for small-gen/solar street prices in 2026 Kogi. |
| KGIRS civic tax mesh (`biz.ts:15-16`) | **KEEP + sharpen (P1)** | Real KGIRS banned roadside cash collection and moved to automated ticketing (Sep 2026) [src 9,10] — the game's "zero extra tax code" design mirrors reality; add a "no cash, all digital levy" city event. |

### 5.2 New economic activities worth adding
- **P0 — PoS agent hustle (already has `pos:true` seed `config.ts:842`)**: withdrawal-fee micro-earnings that HARVEST cash-scarcity days (2023 Lokoja evidence [src 46]); failure modes sourced: PND freezes (₦244k trapped 1 yr) [src 41], fraud syndicates targeting agents at Cantonment/Kpata/Nataco [src 39], employee theft ₦400k [src 39]. This is the richest documented Lokoja street economy.
- **P0 — Flood canoe-fare economy**: during flood days, water-taxi runs at 2–2.5× road fare (₦400–500 vs ₦200, Sep 2022 [src 47]); riverfront closure + price climb already in game weather (`config.ts:230`).
- **P0 — Rent advance ladder**: annual-upfront + agency + caution as a named "move-in" event with a credit/ajo escape hatch [src 13].
- **P1 — Catfish value chain**: fingerlings ₦50 [src 51-scrip row]; feed ₦3,900–4,200/bag; pond-to-table margin 1.91/₦1 [src 52]; fish SCARCITY narrative despite two rivers [src 50] — a perfect hustle→business ladder (grow/buy/sell/peppersoup).
- **P1 — Ultra-modern Market as new location + event arc**: 17 sections, 7 markets consolidating, banking hall/clinic/food court/independent power [src 34]; traffic task-force enforcement days [src 38]; the old International Market as the "before" state. Shop-right allocation could be a late-game biz unlock.
- **P1 — Leave-allowance season**: annual lump-sum wave that lifts market spend (workers await 2025 allowances — Oct 2026 [src 61]); mirrors real cash-cycle texture.
- **P1 — Ajaokuta/Obajana aura events**: gas-deal headlines lifting iron/steel prices; Dangote CSR days (scholarships, football tournament, hospital) as city mood/PR events [src 24,31,32].
- **P2 — Free shuttle event** (Sep 2026 [src 48]) that temporarily suppresses keke gig prices; NURTW levy-ban as a park-politics storyline [src 49].
- **P2 — Kpata canoe-vendor morning influx**: village boats landing cheaper dried fish/bush meat on market days [src 53]; arbitrage hustle (buy at bank, sell in town).
- **P2 — Cement haulage side-gig** on the Obajana axis (2,370-truck fleet scale [src 23]) — truck wash, food kiosks for drivers (no direct Lokoja price source; NIGERIA-GENERIC flag).

---

## 6. Open Questions
1. **Kogi's exact MPI-2022 percentage** — sources confirm the state range (27% Ondo – 91% Sokoto) and that Kogi is near the low end, but the exact Kogi number wasn't captured (NBS PDF too heavy to parse this session). Fetch the NBS MPI 2022 state table.
2. **Lokoja buka/restaurant plate prices in 2025–2026** — no direct source found; meal uplift in §5.1 rests on national food-price evidence. Need a Nairametrics "cost of eating out" or local blog with ₦/plate.
3. **Current intra-city keke/okada per-drop fare in Lokoja (2025–2026)** — only a Sep-2022 datapoint (₦200) captured; FRCN Mar 2026 confirms rises but no figure. Need FRCN story body or local report.
4. **Kpata/old-market stall rents & shop-right prices** — Jiji listing pages blocked (403); needed to calibrate biz buyCosts.
5. **Hotel nightly rates in NAIRA** (platform pages render USD floors only; Hotels.ng rates are JS-loaded).
6. **Ajaokuta current actual headcount** (design 10,000 vs aggregator 312–325) — need the company or a 2025–2026 news payroll figure.
7. **Obajana direct workforce at the plant** (as opposed to group-wide 9,981–21,418).
8. **Whole-house (detached) rent in Lokoja** — unverified; Jiji blocked.
9. **Wedding/agricultural day-labour daily rate in Kogi** (needed to anchor bottom-tier hustles directly instead of via MW arithmetic).
10. **Date-stamp the Facebook Lokoja International Market vendor price list** (currently undated — valuable but LOW).

## 7. Source Registry

### Official / primary
1. https://kogistate.gov.ng/breaking-gov-ododo-approves-72-500-minimum-wage-for-kogi-workers-suspends-tax-burden-on-the-approved-sum-for-one-year/
2. https://fmino.gov.ng/governor-ododo-approves-ngn72500-for-kogi-workers/
3. https://kogistate.gov.ng/october-salary-kogi-civil-servants-commend-governor-ododo-for-implementation-of-%E2%82%A672500-minimum-wage/
4. https://radiokogi.ng/october-salary-kogi-senior-civil-servant-lauds-gov-ododo-over-payment-of-%E2%82%A672500-minimum-wage/
5. https://nigerianstat.gov.ng/news/78/ (national MPI 63%) + https://nigerianstat.gov.ng/pdfuploads/NIGERIA%20MULTIDIMENSIONAL%20POVERTY%20INDEX%20SURVEY%20RESULTS%202022.pdf
6. https://microdata.nigerianstat.gov.ng/index.php/catalog/157 (NBS PMS Price Watch, Feb 2026)
7. https://cement.dangote.com/nigeria-operations/
8. https://mofi.com.ng/wp-content/uploads/2026/04/Ajaokuta-Steel-Company-Limited-_-2021-AFS.pdf
9. https://www.ajaokutasteel.com.ng/about/

### News / business desks
10. https://dailytrust.com/kogi-gov-approves-n72500-minimum-wage-for-workers/
11. https://www.arise.tv/kogi-state-approves-n72-500-minimum-wage-for-workers/
12. https://businessday.ng/business-economy/article/nigerians-spend-37-of-minimum-wage-to-cook-pot-of-jollof-rice/
13. https://hallmarknews.com/food-prices-fall-but-high-living-costs-keep-nigerians-struggling-report/
14. https://www.pulse.ng/story/naira70000-now-a-poverty-wage-nlc-tells-nigerian-workers-to-prepare-for-fresh-minimum-wage-battle-2026072804384344372
15. https://nairametrics.com/2026/10/18/nigerias-inflation-mirage-food-prices-fall-but-core-pressures-mount/
16. https://proshare.co/articles/nigerias-headline-inflation-falls-to-14.63-in-september-2026-as-food-prices-decline
17. https://www.ecofinagency.com/news-finances/1610-59856-nigerias-inflation-eases-further-to-14-6-in-september-2026
18. https://nairametrics.com/2026/10/16/top-10-most-affordable-states-to-live-in-nigeria-as-inflation-falls-to-14-63-in-september-2026/
19. https://blueprint.ng/we-raised-kogi-annual-revenue-from-n600m-to-n43-9bn-in-10-years-kgirs/
20. https://independent.ng/we-raised-kogi-revenue-from-n600-to-n43-9bn-annually-in-10-years-kgirs-chairman/
21. https://newtelegraphng.com/kogi-igr-hits-n43-9bn-as-kgirs-targets-further-growth/
22. https://tribuneonlineng.com/kogi-records-%E2%82%A6308-22bn-revenue-in-half-year-finance-commissioner/ (403; via MSN mirror https://www.msn.com/en-xl/money/economy/kogi-records-n308-22bn-revenue-in-half-of-2026-commissioner/ar-AA2e4BSz)
23. https://leadership.ng/kogi-govt-frsc-to-end-traffic-gridlock-at-lokoja-international-market/
24. https://leadership.ng/dangote-cement-inaugurates-multi-million-naira-hospital-in-kogi/
25. https://leadership.ng/dangote-cement-to-hold-inter-community-football-tournament/
26. https://nannews.ng/dangote-cement-obajana-awards-scholarships-empowers-farmers-women-at-jakura-community/
27. https://www.thisdaylive.com/index.php/2026/08/14/concerns-mount-over-indiscriminate-increase-of-house-rent-in-kogi
28. https://www.ait.live (item: "Rising House Rents Deepen Hardship In Kogi…", Aug 6, 2026, via Google News)
29. https://nairametrics.com/2026/01/10/fg-budgets-n6-04-billion-for-ajaokuta-staff-in-2026-despite-zero-output/
30. https://parrotnigeria.com/2026/01/10/2026-budget-ajaokuta-workers-to-get-n6-4bn-despite-zero-output/
31. https://www.premiumtimesng.com/business/business-news/821600-ajaokuta-steel-company-will-never-work-dangote.html
32. https://www.vanguardngr.com (items: "Tinubu breaks 46-Year Ajaokuta Steel Jinx…NNPCL 20-Year gas deal" Jul 8 2026; "Kogi plans ₦50bn Sukuk Bond" Jan 22 2026; "Kogi Govt bans daily revenue collection by NURTW" Jan 29 2025 — via Google News/Bing News RSS)
33. https://punchng.com/ajaokuta-steel-to-supply-400000-metric-tonnes-of-iron-rods-for-road-construction/
34. https://punchng.com/fg-slams-contractors-over-slow-progress-on-lokoja-abuja-highway-project/
35. https://thesun.ng/ododo-lokoja-ultra-modern-marketll-redefine-commerce-create-jobs/
36. https://www.billionaires.africa/2026/04/30/nigerian-billionaire-aliko-dangotes-dangote-cement-posts-233-million-profit-in-q1-2026/
37. https://www.billionaires.africa/2022/10/16/nigerian-govt-orders-immediate-reopening-of-dangotes-obajana-cement-plant/
38. https://www.mynigeria.com/NigeriaHomePage/business/It-will-last-for-70-years-Dangote-reveals-amount-of-cement-reserves-at-Obajana-plant-674729
39. https://dailytrust.com/national-security-council-orders-reopening-of-dangote-cement-factory/
40. https://www.nairaland.com/7387010/fg-reopens-dangotes-obajana-cement
41. https://www.premiumtimesng.com/news/top-news/558285-manufacturers-body-criticises-kogi-govts-closure-of-dangote-cements-obajana-plant-seeks-fgs-intervention.html
42. https://dailytrust.com/2-arrested-for-defrauding-pos-operators-in-lokoja/
43. https://dailytrust.com/5-hours-after-resumption-2-pos-employees-defraud-owners-n-4m/
44. https://tribuneonlineng.com/two-arrested-for-defrauding-pos-operators-in-kogi/
45. https://tribuneonlineng.com/karimi-launches-free-shuttle-service-to-ease-transport-burden/ (403; snippets via Bing News RSS)
46. https://newswirengr.com/2024/12/26/man-allegedly-lures-friend-who-runs-pos-business-into-bush-slits-his-throat/
47. https://www.bbc.com/pidgin/articles/cn98jv57d48o.amp (CBN ₦100k/day cash-out)
48. https://www.bbc.com/pidgin/articles/c6je5vwyxdx4o + https://www.bbc.com/pidgin/articles/cr62yz4g069eo (NNPC ₦66 discount / fuel price policy, Oct 2026)
49. https://politicsnigeria.com/2026/10/17/nnpc-increases-petrol-price-despite-30-day-discount/
50. https://dailypost.ng/2026/10/21/petrol-landing-cost-drops-to-n1283-litre-as-depot-prices-remain-high/
51. https://dailypost.ng/2026/10/19/fuel-price-update-in-nigeria-weeks-after-tinubus-n1350-litre-announcement/
52. https://dailypost.ng/2023/03/15/cash-withdrawal-improves-in-lokoja-outrageous-pos-charges-abate/
53. https://dailypost.ng/2022/09/30/flood-prices-of-food-transport-skyrocket-in-lokoja-other-parts-of-kogi/
54. https://realnewsmagazine.net/redesigned-naira-notes-residents-of-lokoja-accuse-pos-operators-of-high-charges/
55. https://saharareporters.com/2026/06/24/nigerias-n70000-minimum-wage-can-now-buy-just-44-litres-petrol-nbs-data
56. https://thewhistler.ng/petrol-price-hits-%E2%82%A61596-litre-as-north-west-records-lowest-pms-cost/
57. https://www.msn.com/en-xl/africa/nigeria/petrol-price-shock-see-states-where-1-litre-of-fuel-now-sells-for-1500/ar-AA2cqaTv (Kogi ≥₦1,500/L, Sep 2026 NBS)
58. https://www.msn.com/en-xl/africa/nigeria/why-pos-transactions-are-falling-as-cbn-revises-charges/ar-AA2ajk8p
59. https://www.msn.com/en-xl/urban-infrastructure/transportation-infrastructure/ingra-urges-kogi-govt-to-prioritise-mass-transit-water-supply-sanitation/ar-AA29nv5l
60. https://www.msn.com/en-xl/africa/nigeria/2026-budget-ajaokuta-workers-to-get-n6-4bn-despite-zero-output/ar-AA1TV65C
61. https://guardian.ng/business-services/agro-care/nigerias-36-29m-food-insecure-population-raises-pressure-on-agricultural-investment/
62. FRCN HQ item "Lokoja residents raise concerns over rising transport fares" (Mar 10, 2026, via Google News RSS)
63. https://kogireports.com (Google News items: Ultra-Modern Market inspection Oct 8 2026; automated ticketing Sep 19 2026; Kogi Poly hostels Sep 30 2026; AIT/THISDAY rent items; NURTW/POS items; Confluence Beach Hotel 2019; airport handover Apr 8 2026)
64. https://kogireports.com/when-shelter-becomes-a-shark-high-cost-of-accommodation-in-lokoja-as-a-helping-hand-to-poverty/ (mirror: https://thenigerianpost.com.ng/when-shelter-becomes-a-shark-how-lokojas-rent-crisis-is-feeding-poverty/ ; https://corenewsnetwork.ng/2026/06/21/...)
65. https://thenigerianpost.com.ng/kogi-workers-cry-out-to-ododo-pay-our-leave-allowances-promotion-arrears-provide-affordable-housing/
66. https://theparliamentdiary.com/kogi-clears-promotion-arrears-dating-back-to-2007-as-ododos-cash-back-policy-boosts-workers-welfare/
67. https://nationalfocusng.com/2026/08/14/abundant-rivers-scarce-fish-the-paradox-of-fishing-in-lokoja/
68. https://factcheckhub.com/claim-that-kogi-is-the-poorest-nigerian-state-is-false/ + https://factcheckafrica.net (Nov 2024 items)
69. https://www.gistreel.com/naira-to-dollar-exchange-rate-today-friday-october-16-2026/
70. https://investorsking.com/2026/10/19/dollar-to-naira-black-market-exchange-rate-today-monday-october-19-2026/
71. https://www.legit.ng/business-economy/money/1737197-naira-exchange-rates-dollar-euro-pound-prices-official-market/
72. https://www.vanguardngr.com/2026/10/dollar-to-naira-exchange-rate-today-october-21-2026/ (rate pages, accessed via snippets)

### Listings / directories / booking
73. https://jiji.ng/lokoja/42-flats-for-rent (header only; page 403 to fetch)
74. https://jiji.ng/lokoja/meals-and-drinks/table-sized-cat-fish-vQmVDkcVOMN11vSon5q1cld.html
75. https://opor.ng/en/board/m-2010/ (fingerlings ₦50, Oct 15 2026)
76. https://www.booking.com/city/ng/lokoja.html ; https://www.tripadvisor.com/Hotels-g1072067-Lokoja_Kogi_State-Hotels.html ; https://www.expedia.com/Lokoja-Hotels.d6360079.Travel-Guide-Hotels ; https://www.hotels.com/de1911274/hotels-lokoja-nigeria/
77. https://hotels.ng/hotels-in-kogi/lokoja/ ; https://www.trivago.com/en-US/odr/hotels-lokoja-nigeria?search=200-66322
78. https://zenith.banklocationmaps.com/en/branch/999269-zenith-branch-old-kabba-road-opp-stella-obasanjo-library ; https://corporate.org.ng/uba-bank-branch-in-lokoja/ ; https://ranked.ng/banks/lokoja
79. https://kashgain.net/blog/full-list-of-local-markets-in-kogi-state/ ; https://getoccupi.com/malls/lokoja-shopping-centre
80. https://nigeria.worldplaces.me/review/154870502-bledon-supermarket.html ; https://ng.worldorgs.com/catalog/lokoja/grocery-store/therisingsunsupermarket
81. https://www.reveliolabs.com/companies/dangote-cement/employees ; https://stockanalysis.com/quote/ngx/DANGCEM/employees/
82. https://contactout.com/company/Ajaokuta-Steel-Company-Limited-1876 ; https://rocketreach.co/ajaokuta-steel-company-limited-profile_b745e333c539ee67

### Community / anecdotal (LOW unless corroborated)
83. https://www.facebook.com/groups/749323967560456/ (LOKOJA INTERNATIONAL MARKET — vendor price list, undated)
84. https://www.facebook.com/groups/3219121224994111/ (LOKOJA VENDORS COMMUNITY)
85. https://www.facebook.com/groups/235194371792159/posts/302463415065254/ (catfish feed prices, Kogi)
86. https://www.nigeriantrend.com.ng/lokoja-kpata-river-market-assorted-food-commodities-to-buy/
87. https://www.collectivememory.ai/events/cl_e1a9f11fd541773f85ae/nightlife-along-lokojas-streets-pool-vendors-and-passing-tra
88. https://www.scribd.com/document/939943164/5221-Article-Text-8599-1-10-20240701 (catfish profitability study, Lokoja LGA)
89. https://cjpas.org.ng/index.php/pub/article/view/103 (Kpata/Ganaja Ferry fishing study)
90. https://www.nairaland.com/8596688/fg-budgets-n6.04-billion-ajaokuta (mirror chatter — corroboration only)

*Note: Google-News RSS item URLs for kogireports/leadership/vanguard/tribune/frcn resolve through news.google.com redirects; original hosts are given above. All fetched on 2026-10-22.*
