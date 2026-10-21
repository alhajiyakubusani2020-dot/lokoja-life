# LOKOJA LIFE — WEATHER BIBLE
### The named weather reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends `docs/phase3/06-WEATHER-BIBLE.md` (binding,
> unmodified) and Part V of `Environment_Bible.md`. Evidence: `research/phase3/team-1-geography.md`
> (climate tables, flood history, harmattan episodes), team-9 (flood years), team-7 (onset conflict),
> adjudications A1/A6, B1 (moon unblock), repo anchors (`systems/world.ts` four-scalar roll,
> `systems/seasons.ts`, `data/config.ts:306-312` travel multipliers). Extensions beyond 06 are
> marked **[EXT]**.
>
> **The question this book answers:** what weather does this city get, when, and what does each
> state DO to gameplay, sound, and image?

---

## PART I — THE CLIMATE OF RECORD (06 §I binding, restated)

| Parameter | Value (source) |
|---|---|
| Köppen | Aw — tropical wet-and-dry savanna |
| Annual rainfall | **1,000–1,300 mm** (band kept from the two-source conflict) |
| Rainy season | **Onset window Apr 15–May 10** (A6: state-Apr / city-May / FUL-Mar kept as window edges); peak Jun–Sep; ends Oct |
| Dry season | Nov–Mar; harmattan = episodic NE dust-haze events inside it, NOT the whole season |
| Harmattan episodes | Late Nov–mid Mar, multi-day (NiMet-forecast); deep = 2–5 km visibility; weakening years documented (RT verdict f) |
| Temperature | Max ≈37.9 °C falls **Dec–Apr** (hot season is DRY); harmattan = cold dawns + hot afternoons |
| Humidity | ≈60% RH rainy season |
| River regime | Low Dec–May → rise Jun → **peak Sep–Oct** → recede (NIHSA curve) |

## PART II — THE FIVE STATES (06 §II binding + one-roll law)

| State | Trigger | Signature | Touches |
|---|---|---|---|
| Clear dry | Nov–Mar non-haze days | hard light, bleached ground, gold-brown grass, dust devils (DI) | base |
| Harmattan | episodic Nov–Mar (multi-day rolls) | warm grey-orange veil, far-cut, lamp halos, dust film | +02-S3 haze, audio S7, crowds − |
| Rain | Apr/May–Oct | broken cumulus, puddles (W-6), `rainIntensity 0..1`, wet-red mud | +04-S1 |
| Storm | rainy season, afternoon-biased | SW anvil wall, zinc roar, blue-tarp aftermath, power flickers | +02-S9 scarring |
| Flood | Sep–Oct peak, episodic years | brown torrent, canoes on the highway, confluence closed (`seasons.ts:50-54`), camp dressing | +`waterLevel` scalar |

**The one-roll law** (06 §III.1 DESIGN LAW — scheduled with W1's world-truth foundation; the current
`world.ts` rolls a single weather enum, so do not write tests against the four-scalar API until it
lands): one roll per dawn (04:00) yields `(state, rainIntensity, waterLevel, harmattanDepth)` —
four derived scalars, pure functions of (weather, day), each driving at least one visible, one
audible, one economic effect (A-3 senses agree). Rare intra-day storm cells allowed; no mid-sleep
flips.

## PART III — THE SEASONAL CALENDAR (06 §III binding, restated)

Dec–Feb dry+haze+water-scarcity peak (tanker queues; Detty December) · Mar–Apr onset + hottest
afternoons + Agbo/Donkwo festival window + gully-scar refresh · May–Jun steady rains, rivers rise,
mud season · Jul–Aug peak-ish rains, SW build-ups, market prices climb (`seasons.ts:76-83`) ·
**Sep–Oct river peak + flood threat (flood years 2024/25/26 canon)** · Nov recede + ember-month
gridlock (2025 AND 2026 pattern) + harmattan may arrive late.

**Flood-year law:** floods are a SEASON (Aug–Oct alert posture every year) with episodic flood DAYS
rolled inside it; 2022 = memory-horror story; 2024 = "70+ Kogi communities" (A1); NIHSA-ticker news
each Aug–Oct.

## PART IV — WHAT WEATHER DOES TO GAMEPLAY [EXT — the coupling table]

| Scalar/State | Visible | Audible | Economic/Gameplay (repo anchors) |
|---|---|---|---|
| `rainIntensity` | puddles, wet-red mud, rain sheet | rain-on-zinc Poisson density (S1) | okada misery premium (`seasons.ts:56-83`) |
| Storm | SW anvil, lightning | zinc roar + thunder rolls | storm travel multipliers (config.ts:311), repair hustle arc |
| `harmattanDepth` | veil, far-cut, desaturation, dust film | dust hiss + muffled distance (S7) | harmattan multipliers (config.ts:310), lamp halos |
| `waterLevel` | river width, sandbars, jetty reach | river layer clarity | flood multipliers (config.ts:312), confluence closure, canoe fares ×2–2.5 |
| Clear/hot | hard light, bleached ground | cicada lull | heat energy tax 12:00–16:00 |

**Travel multiplier truth (already shipped, `config.ts:306-312`):** walk ×1.9 on flood days,
×1.75 storm, ×1.15 harmattan; okada own-ride ×1.8 flood / ×1.65 storm; keke ×1.5 flood — these
constants ARE the weather bible's gameplay teeth; they carry dated anchors via W5 law.

## PART V — SKY, MOON & NIGHT COUPLING [EXT]

1. **Six-sky catalogue** (06 §III.3 binding): clear-dry blue · harmattan veil · broken cumulus ·
   anvil/storm shelf · rain-sheet overcast · post-storm gold-slit. Every screenshot maps to one.
2. **Moon coupling (B1 — UNBLOCKED):** phase values from `research/phase3/moon-output.txt` (gate
   ±1 day); full-moon nights silhouette Patti; dark-moon windows (~3–4 nights/month) are
   compound-lamp nights; harmattan veils both.
3. **Night law:** dark by civil-twilight end (≈19:15 worst case); December law — by 18:30 the world
   is lamps-only (Lighting_Bible §V.3).

## PART VI — HONESTY FLAGS (carried)

Harmattan is episodic — never claim season-wide · flood = episodic days inside a reliable season ·
the two-tone confluence is FORBIDDEN (the tint-seam law, Environment_Bible II.3) · Lokoja-specific monthly climate table remains an open
research debt (C-9; the 1,000–1,300 mm band + A6 window stand meanwhile) · wind law is
NIGERIA-GENERIC MED (flag/dust/tree parameters only).

## PART VII — GATES (06 §V + Environment VII, restated as tests)

1. Once W1/W6 land the roll law: the four scalars are pure, reload-proof, and each drives visible
   + audible + economic effects (A-3). Until then this gate is pending, not green.
2. A flood day closes the confluence, opens canoe fares, shows dressing props — all three.
3. Harmattan measurably cuts draw distance, adds the audio mode — and ENDS.
4. No state renders the debunked two-tone confluence.
5. Weather travel multipliers match `config.ts:306-312` per state (assert on the constants).
6. Moon phase matches `moon-output.txt` within one day on 3 sampled nights (B1 gate).
