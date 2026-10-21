# LOKOJA LIFE — ARCHITECTURE BIBLE
### Phase 3 Prelude · Deliverable 3 of 10 · v1.0 · 2026-10-22
> **Authority.** Expansion of `World_Bible.md` (districts/landmarks) + `Art_Audio_Bible.md` §2.
> Evidence: `research/phase3/team-2-architecture.md` (typology evidence with V/R/NG tags),
> `team-9-2026-reality.md` (project register), `team-8-visual-ref.md` (visually verified: gov1, flood1, zinc1).
> **Law A-2 restated:** architecture enters the engine only as **procedural parameters** — no models,
> no photo-textures. Every rule below is a parameter or grammar rule.

---

## PART I — THE TYPOLOGY CATALOGUE (the architectural language)

Legend: **V** Lokoja-verified (web+repo) · **R** repo-verified · **NG** NIGERIA-GENERIC (sourced
nationally, plausible locally, labelled in build copy) · **GAP** no evidence — do not invent.

| Typology | Roofs | Walls | Colour | Silhouette & furniture | Named Lokoja anchors | Tag |
|---|---|---|---|---|---|---|
| Residential compound | Corrugated zinc mono/gable, 12–20° pitch; rust graded by age | Plastered sandcrete; **burglar bars near-universal** ("higher gauge than prisons" — Daily Post 2023 full-text); walls 2–2.5 m + taller sheet gates | Weathered zinc grey → red-oxide paint → rust streaks (flood1 evidence); cream/ochre/terracotta render | 1–2 storey boxes in walled compounds; water tanks + DStv dishes on roofs; clotheslines, water drums | Game `home` anchor; burglar bars match existing D1 compound law (`World_Bible.md:115-118`) | R+NG |
| Government / colonial | Hipped/gabled sheets on low bungalows; **white twin-arch gatehouse motif** (gov1, verified) | Rendered masonry, deep eaves, verandas | White/cream institutional wash, dark-green trim | Low, wide, set back behind low fences; flagpoles | Lugard's Rest House (Patti), Lokoja Museum, European cemetery, Government House | V existence / NG form (Rest House form = GAP) |
| Markets | Plank/tarp stalls + umbrella rows (today) → **lock-up shop rows + market halls under one roof** (Ultra-Modern, 25 ha, Zone 8–Crusher — official full-text) | Roller shutters + block cores; open trading spaces | Shade-cloth/tarp colour chaos; sign-painted shutters | Head-load porters, weigh scales, loading bays; **engineered open drainage** with one enlarged high-volume point | Kpata, Nataco International (the congested "before"), Ultra-Modern (the "after") | V |
| Schools | Long 1-storey classroom bars, mono-pitch zinc | Rendered block, painted bands + dados, burglar bars | Faded ochre/brown | Yard with flagpole + assembly lines; AGILE renovation scaffolding state (728 schools flagged off 2026) | GSSS Lokoja (renovation pledged Oct 2026); 88 school interiors on disk | R+NG |
| Hospital | Flat-slab multi-storey | Rendered concrete, canopy over entrance | White/green institutional | Ambulance bay, queue lines under canopy | FTH Lokoja (new CMD 2026, CT scanner 2025) | V existence / NG form |
| Mosque | Dome + minaret (central) | Rendered block, arched openings | White/green, gold trim | Shoe racks, prayer mats outside; azan PA (5 windows/day, team-7) | Lokoja Central Mosque (state-events venue) | V existence / NG form |
| Church | Gable zinc hall + tower/billboard cross | Rendered block, banner-draped facades | Whitewash + signage boards | Plastic chairs spilling outside | CAN city-wide events verified | NG form |
| Hotels | Flat roofs, 2–4 storey garden compounds | Rendered + painted, gated, guarded (security-framed business, 2025) | Bright paint, lit signage | Boom barrier, guard post | Confluence Beach Hotel (decay→revival arc, current state = open question) | V existence / NG form |
| Transport | Big-span open sheds + offices | Open-sided steel/post | Painted zinc + union signage | Benches, loading bays, park touts; "last bus to Abuja is always just leaving" | Motor Park (launch district), Federal Bus Terminal (announced 2025), Nataco loading bays | V/R |
| Shops & stalls | Umbrella/tarp/plank stalls; lock-ups with shutters | Timber/plank + block | Product-colour chaos + signboards | Kerb-spill rows; clearance contract (`props.ts:10-17`) | Kpata periphery, Food Strip; GSM village (fire 2024 → rebuild story) | R+NG |
| Utilities | — | — | — | Concrete poles + strapped transformers, service-drop tangles, wall meter boards (consumers fund them — ICIR 2019); **492 lamps on disk**; open storm gutters at market spines | — | R+NG |

## PART II — MATERIAL & COLOUR LAW

1. **Zinc tells time (S2 tokens):** `weathered #9AA0A3` → `painted red-oxide #B0552F` → rust streaks →
   patched mismatched panels; **blue ridge-cap accent** observed in flood1. Zinc is the roof of record;
   tiles/slabs mark institutions.
2. **Burglar-bar grammar (S3):** instanced window/door bars — vertical-rod vs cross-hatch; gauge variety
   is an age/wealth signal. Near-universal on residential (evidence HIGH national, MED direction).
3. **Compound rule (S4):** wall 2–2.5 m; gate taller than wall; gate = the building's face; wall-top
   glass/bottle ridge (NG). Gate faces the street; the compound turns inward.
4. **Institutional palette (S9):** white/cream + dark-green trim + gold signage — government, mosque,
   hospital share it (anchored to repo green/gold tokens).
5. **Paint behaviour:** render peels at edges where rain writes (Art Bible material honesty); patched
   render rectangles (flood1) are the honest wall texture.
6. **Drainage is visible law (S6):** open gutters along market spines; dimension variety; the Ultra-Modern
   site's engineered enlarged drain point is a real, sourced feature (official inspection text, Sep 2026).

## PART III — BUILD SEEDS (mapped to engine)

| # | Seed | Parameters | Mapping | P |
|---|---|---|---|---|
| S1 | Roof grammar v2 | enum {ZINC_MONO, ZINC_GABLE, FLAT_SLAB, HIPPED_TILE, DOME, GABLE_HALL}; pitch 12–20° zinc | `layout.ts` BUILDINGS roof field | P0 |
| S2 | Zinc colour tokens + age grade | 4 tokens above + rust/patch rules | tokens + district wash | P0 |
| S3 | Burglar-bar facade grammar | instanced rods/cross-hatch, gauge variance | facade grammar | P0 |
| S4 | Wall+gate compound rule | wall/gate heights, gate-as-face, ridge glass | `props.ts` compound props | P0 |
| S5 | Market ladder (the Ultra-Modern arc) | stall → lock-up → hall → tech-hub block + warehouse drain point, as a location arc | `layout.ts` + `interiors.ts` | P0 |
| S6 | Visible drainage law | open gutters, dimension variety, one enlarged point | WorldTerrain drains + props | P1 |
| S7 | Colonial veranda kit | deep eaves, verandas, low fences (Historic/GRA) | BUILDINGS params | P1 |
| S8 | Consumer-power props | poles, transformers, meter boards, drop tangles | `props.ts` utility family | P1 |
| S9 | Institutional palette | white/green/gold token set | colour tokens | P1 |
| S10 | Hotel pressure kit | gated forecourt, guard post, boom; occupancy flips with events (election scarcity, 2023 evidence) | `interiors.ts` + economy hook | P1 |
| S11 | School bar kit | classroom bars, yard flagpole, AGILE scaffold state | school BUILDINGS | P2 |
| S12 | Stall grammar v2 | roller-shutter lock-ups, trade-colour tarps; keep clearance contract | STALLS params | P2 |

## PART IV — HONEST GAPS (do not invent)

Lugard Rest House current condition/form; mosque/cathedral facade detail (dome form, minaret count);
Government House full facade (gatehouse verified via gov1 only); painted-zinc colour statistics; FTH
block layout; school-block typology photos; Confluence Beach Hotel post-2019 state; Ultra-Modern site
plan numbers; walled-compound prevalence. Each has a named "where to look next" in team-2 §6. Anything
built before evidence lands must be labelled NG in build copy — encyclopaedia claims may not dress NG
as Lokoja-verified (Dossier §6 standards).
