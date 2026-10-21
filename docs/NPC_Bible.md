# LOKOJA LIFE — NPC BIBLE
### The named people reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends `docs/phase3/05-NPC-BEHAVIOUR-BIBLE.md` Part A
> (binding, unmodified) and the people/society rows of `World_Bible_Expansion.md` Parts II & IV.
> Evidence: `research/phase3/team-3-human-life.md` (hour tables, routines), team-5 (identity,
> greetings, names), team-9 (2026 institutions), Dossier B6 (Igala greetings), repo anchors
> (`data/npcs.ts`, `data/npcChat.ts`, `systems/needs.ts`, `systems/calendar.ts`, `data/config.ts`).
> Extensions beyond 05-A are marked **[EXT]**.
>
> **The question this book answers:** who lives in this city, what do they do hour by hour, and what
> are the social laws no NPC may break?

---

## PART I — THE ONE-PARAGRAPH TRUTH

Lokoja is a young confluence of nations (median age ~18 — NIGERIA-GENERIC national anchor, team-3;
Lokoja-specific figure unverified) where belonging is measured in generations,
greetings are law before money, worship windows structure the day, and the market — not the office —
is the city's true clock. No single group owns the city; the NPC population must read as Bassa-Nge,
Oworo, Nupe, Hausa, Ebira, Igala, Igbo, Edo, Tiv and Okun-Yoruba quarters meeting at one river's edge.

## PART II — THE DAILY SHAPE (05 §A.1 binding, restated)

Trough 04–06 → ramp 06–08 → peak-1 08–12 → prayer/lunch dip 12:30–13:30 (Friday: Jumu'ah surge
instead) → rebuild 14–16 → peak-2 16–19 → Maghrib micro-dip 18:15–45 (Ramadan: inverted) →
peak-3 20–21 → decay to midnight. Weekend: no office peak; market/football/worship own 09:00–14:00;
nightlife tail runs longer. The full hour-by-hour table with hooks = 05 §A.2 (binding).

## PART III — CROWD DENSITY LAW (05 §A.3 binding)

The 8-district-type × 8-band multiplier table (market / government / university / transport /
food strip / river-landmark / heritage / nightlife) is THE crowd law, with weekend overrides
(market ×1.5, offices 0, nightlife ×1.6 Fri/Sat, churches ×2 Sunday, viewing centres ×2) and the
five-day Kpata pulse (`day % 5`: market day ×1.6 + canoe vendors; off-day ×0.7). **Repo divergence
note (honest):** the built calendar currently fires the pulse with `marketDayEvery: 3`
(`config.ts:458`, `civic.ts:260`); the 5-day canon is the W3/W7 target — reconciliation rides the
roadmap, not this book. Implementation is
a multiplier on the existing ambient system — never a new animation system (Art_Audio_Expansion V).

## PART IV — THE SOCIAL LAWS (05 §A.4 binding; P0 items restated)

1. **Greeting clock:** slot-decided chains prefix every interaction — "Ina kwana"/"Ẹ káárọ̀" (morning),
   "Ina wuni"/"Ẹ káàsán" (afternoon), "Ina yini"/"Ẹ kú ìrọ̀lẹ́" (evening), "Barka da dare" (night);
   register per NPC speech style (`npcs.ts:24`); respect gestures to elders once daily; ignoring a
   greeting costs reputation.
2. **Greeting-before-price:** stranger-tier market NPCs refuse to quote until greeted
   (`npcChat.ts:46-49` made mechanical).
3. **Hospitality ladder:** close-paddy food NPCs offer one free meal/day ("I don cook extra").
4. **Prayer breaks:** Muslim NPCs leave posts ~12:30 and ~18:30; Friday Jumu'ah surge 12:00–14:00.
5. **Office clock:** civil servants 08:00–16:00 weekdays; GRA crowd peaks 08–11 and 15–16.
6. **Identity grammar:** belonging = generations ("My grandfather sell fish for Kabawa — we be
   natives here"); greeting language rotates per NPC; the city-name etymology is ARGUED by NPCs
   (Oworo "Ilu Oke Oja" / Hausa "Loko Ja" / Nupe "Patti Lukongi" / the loko tree), never settled by UI.
7. **Meal windows:** 07–09 / 12–14 / 19–21 buka crowd ×1.5, mood-weighted.
8. **P1/P2 bands:** Ramadan mode, Detty December, water-fetch micro-task (~₦200/4L, 2024 anchor),
   heat tax 12:00–16:00, football mood spikes, power-flicker mood nudge, elders' visit hour
   16:00–19:00, rain ×0.8 outdoor crowds.

## PART V — LANGUAGE & GREETING BANKS [EXT — consolidated]

| Bank | Content | Confidence / source |
|---|---|---|
| Hausa timed chains | Ina kwana / Ina wuni / Ina yini / Barka da dare | HIGH (team-5, multi-source) |
| Yoruba timed chains | Ẹ káárọ̀ / Ẹ káàsán / Ẹ kú ìrọ̀lẹ́ | HIGH (repo existing) |
| **Igala time-greetings** | **Wọ́la òdùdu** (morning) · **Wọ́lọ ọ̀rọ́ka** (afternoon) · **Wọ́lọ ánẹ́** (evening) · **Agba/Awa** (thank you) | MED (community-sourced, B6 — usable) |
| Pidgin bridge | the playful cross-ethnic register; greeting-adjacent flavour | MED (team-5) |
| Ebira / Nupe / Bassa-Nge formulas | **BLOCKED — no verified source; do not invent** | Dossier Part 5 / C-8 |

## PART VI — THE NPC POPULATION AS BUILT [EXT — repo reality]

1. **The named cast** lives in `data/npcs.ts` (143 lines) with speech styles (`npcs.ts:24`) —
   Alhaji Sule, Hajiya Amina and the named few who leave prayer posts; the familiarity/favour/gift/
   hangout machinery is wired (`systems/socialnet.ts`, ERA2 audit §4 "NPC talk").
2. **The population** is the city census the wire already mirrors: "10k souls" on the live ribbon,
   wallets conserved to the kobo chain (BIBLE_UPGRADE_AUDIT v2.2 re-verification; hardening battery
   F1/F2). NPC-vs-player distinction: a player is a claimed walker on the wire; every other body is
   the crowd system — the density table, not a per-soul simulation.
3. **Names:** pools draw from the quarter grammar (Hausa-named old quarters Kabawa/Makera/Ungwan-Pawa
   anchor the map); Bassa-Nge personal names remain a named research debt (zero captured — Dossier
   Part 5); name pools never invent outside sourced pools + the NG label.
4. **Society texture:** greetings as social law; "natives vs settlers" as dialogue content; the
   Maigari's stool + sub-stools (Onu Igala Lokoja, Odeyani Anegbira, Olu of Oworo, Ohinoyi for Ebira)
   — never invent titles, never skip a stool's style (World_Expansion II.5).

## PART VII — INSTITUTIONS THE NPCs INHABIT [EXT]

Offices 08–16 (government-area) · schools 07:30–14/15 (88 school interiors on disk) · FTH Lokoja
hospital queues (new CMD 2026, CT scanner 2025 — team-2/9) · motor parks (NACTOMORAS; park-closure
days Feb-2026 security orders can lock intercity — 05-B) · viewing centres (EPL/UCL pull ×2) ·
4PM worship-shutdown era (Nov-25 order — NPC evening routines acknowledge it; LG curfews stay
OUTSIDE the city map, C8 law). Healthcare/security/security-era texture is dressing: neutral register,
factual, no caricature (World_Expansion IV.5).

## PART VIII — GATES

1. In 100% of sampled first-touch dialogues a greeting chain precedes any transaction (M3 criterion).
2. Crowd density at any probe hour matches the Part III table × the active overrides (probe script
   prints multipliers; M3 criterion).
3. No NPC line states a single founding year, a current population figure, or any Ebira/Nupe
   greeting (the blocked banks stay empty).
4. Prayer-break departure is observable on Muslim NPCs at the two windows (05 §A.4.4).
5. The name-etymology dispute appears as NPC voices, never as UI copy (World_Expansion XII.2).
