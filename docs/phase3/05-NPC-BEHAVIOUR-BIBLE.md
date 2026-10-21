# LOKOJA LIFE — NPC BEHAVIOUR BIBLE
### (with the Transport Simulation Bible as Part B)
### Phase 3 Prelude · Deliverable 5 of 10 · v1.0 · 2026-10-22
> **Authority.** Expansion of `World_Bible.md` (people/time) + `Content_Bible.md`. Evidence:
> `research/phase3/team-3-human-life.md` (hour tables, density shape), `team-4-transport.md`
> (mode catalogue, fares, curfews), `team-5-culture.md` (greetings/identity grammar). Repo anchors:
> `needs.ts`, `npcs.ts`, `npcChat.ts`, `calendar.ts`, `config.ts` (TIME/NEEDS/FESTIVALS), `travel.ts`,
> `teleport.ts`, `vehicles.ts`.

---

## PART A — HOW THE CITY BEHAVES, EVERY HOUR

### A.1 The daily shape (the one diagram that rules crowd systems)
**Trough 04–06 → ramp 06–08 → peak-1 08–12 → prayer/lunch dip 12:30–13:30 (Friday: Jumu'ah surge
instead) → rebuild 14–16 → peak-2 16–19 → Maghrib micro-dip 18:15-45 (Ramadan: inverted — dip then
feast spike) → peak-3 20–21 → decay to midnight.**
Weekend: no office peak-1; market/football/worship own 09:00–14:00; nightlife tail runs longer.

### A.2 Hour-by-hour law (condensed; full table with game hooks = team-3 §3)
- **04:00** — mai ruwa fill first jerrycans; bakers relight; Tahajjud prayers. *Water-scarcity micro-event.*
- **05:00** — Fajr (~05:10–35); first keke shifts; market trucks arrive; fishermen launch. *Greeting window opens ("Ina kwana").*
- **06:00** — sunrise ≈06:17-41; water queues peak; school gates 07:30; shops unbolt; pots light.
- **07:00–08:00** — assembly window; civil servants in; Kpata morning best-buys (fish just landed); **offices 08:00–16:00**; lessons 08:30.
- **09:00–11:00** — trading full swing; artisans; lectures; hospital queues; pre-lunch foodstuff rush.
- **12:00–13:00** — Dhuhr (~12:20–36; Friday Jumu'ah surge with khutbah ~13:00); pupils home 13:00–15:00 (NG); buka lunch peak; **crowd trough 12:30–13:30** (siesta heat).
- **14:00–15:00** — schools close (type-dependent, NG); **hawkers' golden hour**; Asr ~15:45–16:35; weekend EPL early kickoffs pull viewing-centre crowds.
- **16:00–17:00** — offices close 16:00; commuter flood at Motor Park; Kpata second rush; confluence walks.
- **17:00–18:15** — suya grills light; night-market stalls assemble; market absolute peak (audio law 04 §II).
- **18:15–19:00** — Maghrib (~18:15–45; Ramadan iftar = dates+water then feast); grid-power gamble hour; keke shift change.
- **19:00–21:00** — Isha (~19:15–55); dinner; viewing centres packed (UCL midweek); bars fill; street-food peak; weddings in swing.
- **21:00–23:00** — city winds down; last keke routes; generator symphony fades; sleep resets energy (`config.ts:41-46`).

### A.3 Crowd-density table (multiplier on ambient NPC count, per district type × hour band)
| District type | 04–06 | 06–08 | 08–12 | 12–14 | 14–16 | 16–19 | 19–21 | 21–24 |
|---|---|---|---|---|---|---|---|---|
| Market (kpata-market) | 0.1 | 0.9 | 1.5 | 0.8 | 1.0 | 1.4 | 0.6 | 0.1 |
| Government (government-area) | 0 | 0.4 | 1.2 | 0.7 | 1.1 | 0.5 | 0 | 0 |
| University (university-area) | 0 | 0.5 | 1.3 | 0.6 | 1.2 | 0.8 | 0.4 | 0.1 |
| Transport (transport-area, ganaja-junction) | 0.4 | 1.4 | 1.2 | 0.9 | 1.0 | 1.6 | 0.8 | 0.2 |
| Food strip (food-area) | 0.2 | 1.0 | 0.8 | 1.5 | 0.9 | 1.2 | 1.6 | 0.5 |
| River/landmark (confluence, mount-patti) | 0.1 | 0.3 | 0.4 | 0.3 | 0.5 | 1.2 | 0.6 | 0 |
| Heritage (historic-lokoja, maigari-palace) | 0 | 0.2 | 0.7 | 0.4 | 0.5 | 0.6 | 0.1 | 0 |
| Nightlife (sokamms-motel, bars) | 0 | 0 | 0 | 0 | 0.1 | 0.3 | 1.4 | 1.0 |

Weekend overrides: market day ×1.5 · offices 0 · nightlife ×1.6 Fri/Sat · churches Sunday morning ×2 ·
viewing centres ×2 Sat 15:00–21:00 + UCL midweek. **Five-day pulse:** `day % 5` sets Kpata ×1.6 +
canoe-vendor NPCs on market day, ×0.7 off-day (5-day cycle: 2 independent sources, A-canon).

### A.4 Social laws (what NPCs must do, not just say)
1. **Greeting clock (P0):** slot-decided greeting chain prefixes every interaction — morning "Ina kwana"/
   "Ẹ káárọ̀", afternoon "Ina wuni"/"Ẹ káàsán", evening "Ina yini"/"Ẹ kú ìrọ̀lẹ́", night "Barka da dare";
   register by NPC speech style (`npcs.ts:24`). Respect gestures: prostrate/kneel flavour line to elders,
   once daily; ignoring a greeting = reputation cost.
2. **Greeting-before-price (P0):** stranger-tier market NPCs refuse to quote until greeted (make the
   existing flavour line at `npcChat.ts:46-49` mechanical).
3. **Hospitality ladder (P0):** close-paddy tier food NPCs offer one free meal/day ("I don cook extra") —
   matches the documented "you must eat before you leave" norm.
4. **Prayer breaks (P0):** Muslim NPCs (Alhaji Sule, Hajiya Amina) leave posts ~12:30 and ~18:30; Friday
   Jumu'ah surge 12:00–14:00, market trough.
5. **Office clock (P0):** civil-servant NPCs in government-area 08:00–16:00 weekdays; GRA crowd peaks
   08–11 and 15–16.
6. **Identity grammar (P0, from team-5):** belonging = generations in town ("My grandfather sell fish for
   Kabawa — we be natives here"); multi-ethnic rotation of greeting language per NPC (Hausa/Yoruba/Igala/
   pidgin); the city's name etymology is **argued by NPCs, never settled by the UI**.
7. **Meal windows (P0):** 07–09 / 12–14 / 19–21 buka crowd ×1.5, mood-weighted eating.
8. **P1 band:** Ramadan mode (hunger decay doubles pre-Maghrib, feast after; tarawih night crowds);
   Detty December multiplier; water-fetch micro-task (jerrycan ~₦200, 2024 anchor; persistent scarcity
   texture, worse on flood days); heat energy tax 12:00–16:00; football mood spikes at viewing centres.
9. **P2 band:** power-flicker mood nudge (interior TV gives less mood in outages; viewing centres immune
   — they own generators); elders' visit hour 16:00–19:00; rain ×0.8 outdoor crowds.

---

## PART B — THE TRANSPORT SIMULATION BIBLE

### B.1 Mode catalogue (fares carry dates; NG = NIGERIA-GENERIC)
| Mode | Capacity | Fare anchor (date) | Hours | Operator | Behaviour signature |
|---|---|---|---|---|---|
| Walking | 1 | free (energy) | always | — | trekking past jams is the documented flood/jam behaviour |
| Okada | 1 pillion | NBS natl avg ₦920.95 (Feb 2026); crisis ×6–20 documented (₦6,000, Sep 2026) | daylight-dominant | NACTOMORAS (Kogi, verified) | weave-and-beep; jam-gap filler |
| Keke | 3–4 | game ₦300/3km (keep, flagged — no 2025-26 local source) | day–evening | NACTOMORAS; 50 federal CNG units arrived Sep 2025 | door-door boarding = the enforcement target |
| Taxi | 4 | game ₦1,000/3km (NG, honest gap) | day | informal | town runs + Abuja-axis hire |
| Intercity bus | 14–59 | NBS ₦8,108.81/drop (Feb 2026); Abuja ≈2h normal, 7–9h in jams | departures all day; ember surges | private fleets (GIG/ABC unverified) | loads at **Nataco Park** |
| Truck/articulated | freight | — | **BANNED in city 23:00–05:00** (Kogi directive Jul 2025; canon A8) | NARTO-adjacent | the jam-maker; market offloading banned |
| Canoe/ferry (flood mode) | 1–2 + goods | ₦400–500/trip (Sep 2022) → ≈₦800–1,200 current-era, flagged | flood days | informal/NIWA partnership (headline) | riverfront substitute economy |
| CNG keke variant | 3–4 | cheaper-than-petrol promised | day | NACTOMORAS | **ONE station** serves them (Jun 2026) — the queue IS the gameplay |

### B.2 Traffic laws
1. **Truck-curfew clock (P0):** 23:00–05:00 removes articulated trucks from in-city traffic; A2 artery
   keeps through-freight outside the built-up edge. Cheap, datable, recognizable.
2. **Rush multipliers (P0):** via existing `minutesMult` (`travel.ts:62`) — morning ×1.4, evening ×1.3,
   market day +0.2; jam days cap ×3–4 for playability (real 2h→7-9h = ~4×).
3. **Crisis surge law (P0):** flood/gridlock days surge PERSONAL rides ×5–8 (documented ₦6,000 vs ₦920);
   public fares never surge (city-rate fiction, M8 personal/public distinction in `travel.ts:51-53`).
4. **Flood canoe mode (P0):** on flood days the jetty (`config.ts:988-990`) spawns canoe trips at
   ~2–2.5× road fare; riverfront vehicle access closes.
5. **Nataco Park + International Market discipline (P1):** kekes stop at marked bays on market days;
   roadside pickup attracts task-force dialogue (the real May 2026 campaign).
6. **Named-street hierarchy (P1):** the binary's 20 real street names (Lugard Rd, Marine Rd, Ahmadu Bello
   Way, IBB Way…) map onto cls taxonomy — arteries get kerbs/zebras + denser lanes; laterite tracks =
   okada-only (`geo.ts:28-29`, `roads.ts:56-58`).
7. **P1 texture:** CNG keke skin + "CNG queue" event; 'Go-slow' event gains named locations ("Felele
   crawl", "Gegu-Eba stretch", "Banda standstill"); park-closure days (security orders, Feb 2026) lock
   intercity and spike okada; FRSC/task-force flavour names (period-accurate: Tsukwam 2025, Lalu-Fagge
   2026); student commuter pulse on the Felele corridor.
8. **P2 ambition (flagged):** horn-audio grammar (NG, LOW — pairs with audio S6); Ganaja flyover stays
   town-gossip ONLY (no evidence it exists — Dossier A-law: none may be invented); NNPC smart-station
   skin (NG).

### B.3 Calibration quick-table
| Knob | Now | Evidence anchor | Verdict |
|---|---|---|---|
| keke ₦300/3km | `config.ts:151` | no 2025-26 local datapoint (last: ₦200, Sep 2022 + fuel ×1.4) | keep + weather multipliers |
| Abuja intercity | not payable | NBS ₦8,108.81 (Feb 2026) | if payable trips land: ₦7–9k |
| jam multiplier | param exists | 2h vs 7–9h | cap ×3–4 |
| crisis surge | absent | ₦6,000 event (Sep 2026) | ×5–8 personal only |
| truck curfew | absent | state directive (Jul 2025) | implement literally |
| flood canoe | absent | ₦400–500 (2022) | ₦800–1,200 flagged approximate |

### B.4 Transport gates
- Any in-city truck sighting between 23:00–05:00 is a bug.
- Rush-hour travel minutes measurably differ from midday (×1.3/×1.4 bands active).
- On a flood day, at least one jetty canoe trip is offered and the confluence stays closed (W-law).
- No mode's fare lacks a dated anchor in this file or a Bible amendment.
