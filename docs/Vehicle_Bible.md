# LOKOJA LIFE — VEHICLE BIBLE
### The named transport & vehicle reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends `docs/phase3/05-NPC-BEHAVIOUR-BIBLE.md` Part B
> (the Transport Simulation Bible — binding, unmodified) and the transport rows of
> `World_Bible_Expansion.md` Part VI. Evidence: `research/phase3/team-4-transport.md` (mode table,
> dated fares, curfews), team-9 (CNG era, highway rehab), Dossier A8, and the BUILT wheel laws
> (`src/game/systems/wheels.ts`, `systems/wheelnet.ts`, `systems/travel.ts`, `systems/fleet.ts`,
> `data/config.ts:160-312`, M23 DriveSystem + M24-W10 commits). Extensions beyond 05-B are marked
> **[EXT]**.
>
> **The question this book answers:** how do people and goods actually move in Lokoja, and what is
> the vehicle — as a simulated, owned, fuel-burning, plate-wearing citizen of the world?

---

## PART I — THE ONE-PARAGRAPH TRUTH

Lokoja moves on okada, keke and foot; taxis do town runs; intercity buses load at Nataco Park;
articulated trucks obey a real 23:00–05:00 curfew; the CNG era has begun with one station's queue as
its monument; and on flood days the river replaces the road. The jam corridor Felele–Nataco–
Koton-Karfe on the A2 is the city's daily proof that transport is weather, economy and politics at once.

## PART II — THE MODE CATALOGUE (05 §B.1 binding, restated with anchors)

| Mode | Capacity | Fare anchor (dated) | Hours | Operator/union | Signature |
|---|---|---|---|---|---|
| Walking | 1 | free (energy burns past 150 m) | always | — | trekking past jams = documented flood behaviour |
| Okada | 1 pillion | NBS ₦920.95 natl (Feb 2026); crisis ×6–20 documented (₦6,000, Sep 2026) | daylight-dominant | NACTOMORAS (Kogi, verified) | weave-and-beep; jam-gap filler |
| Keke napep | 3–4 | game ₦300/3km (keep + flag; no 2025-26 local datapoint, C-4 NG range ₦200–800) | day–evening | NACTOMORAS; 50 federal CNG units (Sep 2025) | door-door boarding |
| Taxi | 4 | game ₦960/3km (built constant: base 300 + ₦220/km — NG, honest gap) | day | informal | town runs + Abuja-axis hire |
| Intercity bus | 14–59 | NBS ₦8,108.81/drop (Feb 2026); Abuja ≈2 h normal, 7–9 h in jams | all day; ember surges | private fleets (GIG/ABC unverified) | loads at **Nataco Park** |
| Truck/articulated | freight | — | **BANNED in city 23:00–05:00 (A8, Jul 2025 directive)** | NARTO-adjacent | the jam-maker |
| Canoe (flood mode) | 1–2 + goods | ₦400–500 (Sep 2022) → ≈₦800–1,200 current-era, flagged | flood days | informal/NIWA (headline) | riverfront substitute economy |
| CNG keke variant | 3–4 | cheaper-than-petrol promised | day | NACTOMORAS | **ONE station** (Jun 2026) — the queue IS the gameplay |

## PART III — TRAFFIC LAWS (05 §B.2 binding, restated)

1. **Truck-curfew clock:** 23:00–05:00 removes articulated trucks from in-city traffic (assert: any
   sighting in-window is a bug).
2. **Rush multipliers:** morning ×1.4, evening ×1.3, market day +0.2 via `minutesMult`
   (`travel.ts:62`); jam days cap ×3–4 (real 2h→7–9h ≈ 4×).
3. **Crisis surge:** flood/gridlock days surge PERSONAL rides ×5–8; public fares never surge
   (personal/public distinction `travel.ts:51-53`).
4. **Flood canoe mode:** flood-day jetty (`config.ts:988-990`) spawns canoe trips ≈2–2.5× road fare;
   riverfront vehicle access closes.
5. **Nataco discipline:** market-day marked bays; roadside pickup draws task-force dialogue.
6. **Named-street hierarchy:** the canon's 19 distinct real street names across 29 named ways (Lugard Rd, Marine Rd, Ahmadu Bello Way, IBB
   Way…) map onto the cls taxonomy; arteries get kerbs/zebras + denser lanes; laterite tracks =
   okada-only (`geo.ts:28-29`, `roads.ts:56-58`).
7. **Horn language:** NIGERIA-GENERIC, pattern classes (gate-triple, greet-double, move-long,
   danger-freight — `ambience.ts:240-257` seed S6); no Lokoja-specific source exists (honest gap).

## PART IV — THE VEHICLE AS A CITIZEN [EXT — the built laws, wheels.ts]

The vehicle is not a skin on a fare table; it is a server-truthed entity. The built law set
(M24-W10a/b/c, all battery-proven) is binding:

1. **Roster of record:** the player's fleet is per-model — okada / keke / taxi / danfo — with
   `FUEL_RANGE` honest per model (`wheels.ts:502`: okada 2600, keke 3400, taxi 5200, danfo 6800
   metres-range units) and a TRUE top-speed identity (the danfo's 54 km/h is its real top speed —
   N12 clamp, `MULTIPLAYER_PLAN.md` §6).
2. **The tank law:** the tank burns by the server's CLAMPED metres, never the client's claim; the
   dry line refuses entry; a dry engine takes no key (`wheels.ts:468+` W10-c header).
3. **The pump:** ₦900/L street price (`PETROL_PRICE_PER_LITRE`, `wheels.ts:525` — ~post-subsidy
   street truth; the Oct-2026 Abuja-corridor ₦1,370–1,429 figure is the WORLD evidence, the game
   constant carries its own dated anchor + amendment path), min ₦200 / max ₦20,000 pours,
   replay-proof by idemKey, proximity judged on the SERVER's clamped car pos.
4. **The wear law:** condition wears with the honest odometer (`CONDITION_LIFE 30k`); the garage's
   mechanic card quotes the wear's own math, paid through the fortress chain.
5. **The park law:** move→stop persists the row ONCE; disconnect keeps the books; absent drivers'
   cars spawn where they stopped; `VehicleRow.plate @unique` — the DMV wall (one plate one row).
6. **The boarding law:** passengers board a STOPPED + consenting car; kids ride shotgun never drive
   (adult-hands law, server-side); the interior is its own voice zone.
7. **The paint/plate law:** paint swatches + 4–10 char LKO plates ride the server PATCH door; the
   street sees the rig's real vocabulary — an invented colour never renders.
8. **Cadence laws:** vehicle deltas 12 Hz ONLY while moving; constant-velocity dead-reckoning
   between updates (N5 bandwidth law); CarBuffer NEVER stales — a parked car stands where it stopped.

## PART V — WEATHER × VEHICLE COUPLING [EXT — config.ts:306-312 as law]

Storm multipliers: walk ×1.75, okada ×1.65, keke ×1.35, taxi ×1.15, danfo ×1.22. Flood: walk ×1.9,
okada ×1.8, keke ×1.5, taxi ×1.25, danfo ×1.35. Harmattan: walk ×1.15, okada ×1.18. These are the
"okada dey suffer" truth as shipped constants — Weather_Bible Part IV cross-binds them.

## PART VI — HONEST GAPS & FLAGS

No Lokoja intra-city keke fare 2025-26 local datapoint (C-4; LOW) · no Lokoja horn/conductor source
(NG label) · GIG/ABC fleet presence unverified · flood canoe current fare approximate · CNG
clean-engine tone = P2 NG flag · Ganaja flyover DOES NOT EXIST (gossip only) · ambient traffic rigs
(14 on loops 0/1/2) remain unhailable texture — a known dead path (ERA2 audit §4).

## PART VII — GATES

1. Any in-city truck sighting 23:00–05:00 is a bug (assert).
2. Rush vs midday travel minutes differ ×1.3–1.4 (M3 criterion).
3. Flood day: canoe trip offered at the jetty AND confluence closed (M3/W-law).
4. Every fare constant carries a dated anchor comment or Bible amendment (M4 criterion).
5. Tank/fuel round-trip: pour at pump → ledger debit → VehicleRow.fuel readback — exactly once
   (m24-wheels 90/90 regression stands).
6. A cheating leap never moves a car farther than its model's clamp allows (N12).
