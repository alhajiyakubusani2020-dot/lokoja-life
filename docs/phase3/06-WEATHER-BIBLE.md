# LOKOJA LIFE — WEATHER BIBLE
### Phase 3 Prelude · Deliverable 6 of 10 · v1.0 · 2026-10-22
> **Authority.** Expansion of `World_Bible.md` (seasons) + the `seasons.ts` weather laws. Evidence:
> `research/phase3/team-1-geography.md` (climate tables, flood history, harmattan episodes),
> `team-9-2026-reality.md` (flood years 2024/25/26), `team-7-audio.md` (wet-season onset conflict).
> Adjudications A1/A6/A9 of the dossier bind.

---

## PART I — THE CLIMATE OF RECORD (sourced numbers)

| Parameter | Value (source) |
|---|---|
| Köppen | Aw — tropical wet-and-dry savanna |
| Annual rainfall | **1,000–1,300 mm** (band kept from the two-source conflict) |
| Rainy season | **Onset window Apr 15–May 10** (A6 bridge: state Apr / city May / FUL Mar kept as window edges); peak Jun–Sep; ends Oct |
| Dry season | Nov–Mar; harmattan = episodic NE dust-haze events inside it (NOT the whole season) |
| Harmattan episodes | Late Nov–mid Mar, multi-day (NiMet-forecast); deep episodes 2–5 km visibility; variable-year — 2026 reporting says it is weakening/arriving late |
| Temperature | Max ≈37.9 °C falls **Dec–Apr** (hot season, not wet); harmattan nights/mornings cool ("very dusty and cold") — reconciled as cold dawns + hot afternoons |
| Humidity | ≈60% RH rainy season |
| River regime | Low Dec–May → rise Jun → **peak Sep–Oct** → recede (NIHSA alert curve) |

## PART II — THE FIVE STATES (game: `seasons.ts` family + two refinements)

| State | Trigger window | Signature | Systems touched |
|---|---|---|---|
| `clear` (dry) | Nov–Mar non-haze days | Hard light, bleached ground, gold-brown grasses, dust devils (DI) | base |
| `harmattan` | episodic Nov–Mar (roll multi-day events, not season-long) | Warm grey-orange veil, desaturated sun disc, far-visibility cut, lamp halos, dust film | + fog/haze layer (02-S3), audio S7, crowd − |
| `rain` | Apr/May–Oct | Broken cumulus, puddle law (W-6), rain intensity 0..1, wet-red mud | + `rainIntensity` (04-S1) |
| `storm` | rainy season, afternoon-biased (confluence thunderstorms) | Anvil wall from SW, zinc roar, roof-loss aftermath (blue tarps), power flickers | heavy-sky family + storm scarring (02-S9) |
| `flood` | Sep–Oct peak, episodic years | Brown torrent, canoes on the highway, confluence closed (`seasons.ts:50-54`), sandbag/camp dressing, canoe economy (05 Part B) | heavy-sky family + `waterLevel` scalar (02-S2) |

**Rain-family law confirmed:** `rain`/`storm`/`flood` read as rain to premiums/audio/particles
(`seasons.ts:32-41`) — keep, with intensity now scaled (storm > rain).

## PART III — THE SEASONAL CALENDAR (the year at a glance)

| Game window | Weather law | Life law (cross-refs) |
|---|---|---|
| Dec–Feb | Dry + harmattan episodes; coolest dawns; haze | Water scarcity peaks (tanker queues); harmattan audio mode; fires & smoke threads; Detty December crowds/prices |
| Mar–Apr | Onset window; first storms; hottest afternoons (37.9 °C band) | Heat energy tax; Donkwo/Agbo festival window (Mar/Apr, team-5); gully erosion scars refresh |
| May–Jun | Steady rains begin; rivers rise from Jun | Puddle law live; mud season; farm-edge greens saturate |
| Jul–Aug | Peak-ish rains; cloud builds from SW; river rising | Travel delays; market prices climb (`seasons.ts:76-83` already pays this) |
| **Sep–Oct** | River peak; flood threat years (2024/25/26 pattern) | Confluence closure risk; canoe economy; aid/camp dressing; NIHSA-ticker news |
| Nov | Recede; dry begins; ember-month road gridlock (2025 AND 2026 pattern, team-9) | Intercity trip-time spikes; harmattan may arrive late |

**Flood-year law:** floods are a *season*, not a script — high-water season every year (Aug–Oct
alert posture), with *flood days* rolling episodic inside it; 2022 remains the memory-horror story
(canoes on the highway, FRSC diversions, Abuja fuel scarcity), 2024 the "70+ communities" canon (A1).

## PART IV — DESIGN RULES

1. **One day, one roll** (`world.ts` law) stays; the roll now yields `(state, rainIntensity,
   waterLevel, harmattanDepth)` — four derived scalars, all pure functions of (weather, day).
2. **Transitions:** weather changes at dawn boundaries (04:00 roll) + rare intra-day storm cells
   (afternoon-biased); no mid-sleep flips.
3. **Sky catalogue** (six renderings the sky must be able to produce): clear-dry blue · harmattan veil ·
   broken cumulus · anvil/storm shelf · rain-sheet overcast · post-storm gold-slit. Every screenshot must
   map to one (02 §II acceptance).
4. **Material response law:** laterite ground darkens and muddies when wet (puddle law); zinc rust
   streaks freshen after storms; dust film accumulates across harmattan days and washes off with rain.
5. **Gameplay couplings (already-lawful, now parameterised):** travel minute multipliers, market price
   climb, riverfront closure, misery premiums for riders (`seasons.ts:56-83`), flood canoe mode (05-B2),
   water-scarcity severity tracks dryness.
6. **2026 reality couplings (team-9):** ember-month gridlock window (Nov–Dec) as a calendar chaos
   window; water-restoration city event (target Jan-2027 arc); storm roof-loss event ("Lokoja lost its
   roofs", May 2026) as a one-off repair hustle in its aftermath year.
7. **Honesty flags:** harmattan = episodic (never claim season-wide); flood = episodic inside a reliable
   season; "two-colour confluence" is forbidden (A4); moon-phase system blocked until sourced (02-S14).

## PART V — GATES
- The weather roll's four scalars are pure & reload-proof (existing law) and each drives at least one
  visible, one audible, and one economic effect (senses agree, A-3).
- A flood day closes the confluence, opens canoe fares, and shows dressing props — all three, or it
  isn't a flood day.
- Harmattan episodes measurably cut draw distance and add the audio mode; they end.
- No state may render the debunked two-tone confluence seam.
