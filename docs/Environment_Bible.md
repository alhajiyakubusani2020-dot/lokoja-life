# LOKOJA LIFE — ENVIRONMENT BIBLE
### The complete environmental production reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends `docs/phase3/02-ENVIRONMENT-DESIGN-BIBLE.md` and
> `docs/phase3/06-WEATHER-BIBLE.md` (both remain binding and unmodified) under `World_Bible.md` v2.2.
> Evidence: `research/phase3/team-1-geography.md` (claims carry URL+date+confidence), team-9 (2026),
> the visual library (team-8 v1 + v2, Part D of `Phase3_Research.md`), and the reproducible geometry
> scripts (`solar_lokoja.py`, `moon_lokoja.py`). Repo anchors cite `path:line`. Where this book adds
> detail beyond 02/06 it is marked **[EXT]**; nothing here contradicts them.
>
> **The question this book answers:** what IS the environment of Lokoja — land, water, air, life — and
> how does the engine produce it, hour by hour, season by season, without inventing?

---

## PART I — GEOLOGY & TERRAIN (the ground truth)

1. **The city is a flat riverside floor below one big hill.** Lokoja spreads across the Niger's west
   bank at the Benue confluence (7.80°N 6.73°E); Mount Patti (458 m) is the city's cradle — earliest
   settlement sat ON the hill and drifted down to the river. Terrain law: flat urban floor, hill to
   the north-west, silhouette hills ("abundance of hills", Agbaja hunting ground) at far range only.
2. **The ironstone crown [EXT — build detail].** Patti's upper third wears the **Agbaja Ironstone
   Formation cap over pale Cretaceous Lokoja-Fm sandstone** (peer-reviewed; Red Team verdict a via
   Crossref DOI). Render as a reddish-brown ferruginous band capping greener, paler slopes. The same
   formation outcrops at in-game-adjacent real places: Felele Junction, Nataco–Banda, Koto-Karfe —
   erosion-scar dressing may appear there (02-S13).
3. **Laterite red is the ground colour of everything.** Terrain base, dust, dry-season road wash, and
   the mud after rain all derive from one orange-red family (visual refs m1 foreground, zinc1 yard,
   v2-keke1 training ground). Material law: wet laterite darkens toward brown-red and muddies (W-6
   puddle law); dry laterite bleaches toward orange-pink with dust film.
4. **Erosion is a named, sourced feature.** Gully erosion devastates parts of Lokoja (Daily Trust
   2023, team-1). Felele approaches may carry gully scars, refreshed after storms (02-S13, P2).
5. **Heightfield contract.** The existing `heightAt` (sine noise + Patti mound + terraces,
   `layout.ts:834-889`) is confirmed lawful; the only terrain correction is the ironstone crown band
   (02-S6/T1). No new displacement fields may be invented.

## PART II — WATER (the rivers are characters)

1. **One scalar rules the rivers: `waterLevel`.** Season curve (NIHSA alert pattern, team-1 §2.3):
   **low Dec–May → rise Jun → peak Sep–Oct → recede Oct–Nov**. The scalar drives river width/banks,
   sandbar exposure, jetty reach, canoe positions; the existing flood-day confluence closure
   (`seasons.ts:50-54`) is the scalar's extreme end, not a separate system.
2. **Two visual truth-states + one between-state.** conf1 (dark mirror, gold sun-path at sunset) and
   flood1 (opaque brown torrent, debris) bracket the range; the dry-season middle state shows hard
   glitter and visible sandbars. Interpolate parameters between these three renderings.
3. **The tint-seam law (A4).** Niger-vs-Benue colour difference renders SUBTLE only — the viral
   two-tone confluence photograph is DEBUNKED (Dubawa 2023). No build may show a hard seam. The
   W-3 sightline (Deck + Patti summit framing the confluence) remains absolute and unoccluded.
4. **Flood dressing is evidence-based.** 2012 (623,690 displaced / 87 camps — effectively
   single-source, MED, flag kept), 2022 (worst in recent memory; canoes on the highway, FRSC
   diversions), 2024 (**70+ Kogi communities** — A1 canon; "200 communities/2M" only as Nigeria-wide
   radio context), 2025/26 recurrence (team-9). Set dressing: canoes on arterial roads, debris rafts,
   sandbag lines, camp rows with kerosene lamps, blue tarpaulins after storms (02-S5/S9).

## PART III — AIR & SKY (the atmosphere of record)

1. **Haze, not fog, is the default distance treatment.** Every verified reference agrees: distance
   dissolves in warm pale veils (m1 Patti mist, conf1 sunset, harm1 dust veil, v2-mosque2 tree-canopy
   aerial perspective). "Warm haze over cold fog" (Art_Audio pillar 3) is photographically correct here.
2. **Harmattan is episodic.** Multi-day dust-haze events late Nov–mid-Mar (NiMet-forecast), deep
   episodes cut visibility to 2–5 km, whiten the sky, tan the horizon, reduce the sun to a disc, and
   fur everything with dust by morning; 2026 reporting documents years it weakens or arrives late
   (Red Team verdict f). NEVER a season-wide constant (06 Part I).
3. **The six-sky catalogue** (06 §III.3, binding): clear-dry blue · harmattan veil · broken cumulus ·
   anvil/storm shelf · rain-sheet overcast · post-storm gold-slit. Every sky rendering must map to one.
4. **Wind law (NIGERIA-GENERIC, MED).** Dry-season NE harmattan flow; SW inflow feeding rainy-season
   build-ups (clouds build from the SW — team-1 §3.3); gust fronts precede storms. Manifested as
   flag/dust/tree parameters, never a simulated field.
5. **Humidity & heat.** Rainy season ≈60% RH; steam after night rain; mist on Patti slopes at dawn.
   The hottest maxima (≈37.9 °C) fall Dec–Apr — the hot season is DRY, not wet; harmattan dawns are
   the cool pockets ("very dusty and cold" reconciled as cold dawns + hot afternoons).

## PART IV — VEGETATION & ECOLOGY (green, not tan)

1. **The hill wears forest.** Patti's slopes are deep forest-green even beside the town (visual m1;
   v2-mosque2 shows tree canopy swallowing ridgelines). The "savanna = brown" instinct is FALSE for
   the hill and its foot; brown belongs to the dry-season ground plane and harmattan air (S7 law).
2. **Placement grammar (S8/T-F1).** Oil palm + raffia hard against water ("leaning river palm");
   mango in compounds; neem/acacia/shea on upland savanna; banana/plantain in wet hollows (zinc1);
   cashew/palm/yam/cassava/rice/melon on farm edges (Kogi agriculture). The existing 10-species set
   (`flora-species.ts:26-31`) stands; the grammar is the upgrade. `aLeaf` weather-gold mask
   (`flora-species.ts:24`) is the seasonal colour switch: dry gold-brown ground layer vs rainy
   saturated green, hill stays green all year.
3. **Wildlife that must exist [EXT].** The bird layer is peer-reviewed for the game's own districts:
   **108 species / 43 families** (Adang et al. 2018, surveyed at Mount Patti, Kpata market, Ganaja
   ferry, FUL Adankolo/Felele, Lokongoma); GBIF adds Egyptian plover on confluence sandbars (10
   records), yellow-billed kite, western plantain-eater, laughing dove, pied crow. Visible-fauna law:
   egrets commuting at dawn, kites riding thermals, doves on wires — no invented megafauna; no source
   for large mammals in the city (none built).
4. **The fish tension is canon (X12).** Busy freshwater trade at Kpata AND "abundant rivers, scarce
   fish" (Aug 2026 feature) — model both: crowded fish stalls, high fish prices, Donkwo fishing-
   festival identity (Mar/Apr window).

## PART V — SEASONS & WEATHER STATES (the five-state year)

| State | Window | Trigger law | Signature systems |
|---|---|---|---|
| Clear dry | Nov–Mar non-haze days | base | hard light, bleached ground, gold-brown grasses, dust devils (DI) |
| Harmattan | episodic Nov–Mar | multi-day rolls | veil + far-cut + lamp halos + dust film; audio mode S7; crowds − |
| Rain | onset window Apr 15–May 10 (A6; March possible) → Oct | daily rolls | `rainIntensity 0..1` + W-6 puddles + wet-red mud |
| Storm | rainy season, afternoon-biased | cells | anvil wall from SW, zinc roar, power flickers, blue-tarp aftermath |
| Flood | Sep–Oct peak, episodic years | season + roll | `waterLevel` extreme; confluence closes; canoe economy; camp dressing |

- **One day, one roll** (`world.ts` law): the roll yields `(state, rainIntensity, waterLevel,
  harmattanDepth)` — four derived scalars, pure functions of (weather, day), each driving at least
  one visible, one audible, one economic effect (A-3 senses agree).
- **Transitions** at dawn boundaries (04:00 roll) + rare intra-day storm cells; no mid-sleep flips.
- **Seasonal calendar** (06 §III binding): Dec–Feb dry+haze+water-scarcity peak; Mar–Apr onset + hot
  season + Agbo/Donkwo; May–Jun steady rains + river rise; Jul–Aug peak-ish + SW build-ups;
  **Sep–Oct river peak + flood threat**; Nov recede + ember gridlock (2025 AND 2026 pattern).
- **Flood-year law:** floods are a season with episodic days, not a script; 2022 is the memory-horror
  story; 2024 the "70+ communities" canon; NIHSA-ticker news each Aug–Oct.

## PART VI — ENVIRONMENTAL STORYTELLING (what the world remembers) [EXT]

1. **Storms leave receipts:** blue tarpaulins, downed branches, choked drains, days-long repair
   scaffolds (S9; May-2026 "Lokoja lost its roofs" as a one-off repair-hustle arc per 06 §IV.6).
2. **Floods leave lines:** high-water stains on compound walls (flood1's window-sill brown line),
   faded sandbag piles, camp-row layouts re-dressable within a day.
3. **Power writes the skyline:** consumer-funded poles and strapped transformers, meter boards on
   walls, generator exhaust pipes at shop rear walls; grid state visibly changes interiors and
   shopfronts (03 S8; audio S2/S3).
4. **The road year:** harmattan dust wash on kerbs, rainy-season red mud streaks, post-flood silt
   fans near the waterfront — the same laterite family cycling through states.
5. **Water infrastructure as plot:** tanker queues in dry months (worst areas: Kabawa, Madabo,
   Lokoja New Layout, Gadumo, Lokongoma Ph1&2, Peace community, Ganaja-Lokoja, Mount Patti areas —
   Daily Trust list, A11-corrected), the Greater Lokoja Water Works restoration arc (handover
   2026-10-13, target Jan-2027) as a live city event.

## PART VII — BUILD LAWS & GATES

**P0:** S1 sun-clock binding · S2 `waterLevel` scalar · S3 harmattan haze layer · S4 subtle tint seam ·
S5 flood dressing · T3 laterite kit · B8 flood props · F1/F2 flora grammar + seasonal switch.
**P1:** S6 ironstone crown · S7 seasonal grade · S9 storm scarring · S10 dawn/dusk people bands.
**P2:** S11 shadow-vanish (≈Apr 11 & Sep 4) · S12 Patti Race · S13 erosion scars · **S14 moon-phase
system — UNBLOCKED this phase** (moon tables validated; build law in `Lighting_Bible.md` §IV).

**Gates (inherited from 02/06, restated as tests):**
1. Any screenshot attributable to exactly ONE of the five states (A-3 senses agree).
2. Patti summit frame: green slopes + ironstone crown + confluence seam, nothing occluding (W-3).
3. Harmattan measurably cuts far visibility and desaturates ≥30% at distance — and it ENDS.
4. The confluence never renders a hard two-tone seam.
5. A flood day closes the confluence, opens canoe fares, and shows dressing props — all three.
6. River width visibly differs low-vs-peak months from the same camera.
7. Moon phase on any night matches `moon-output.txt` within one day (S14 build gate).
