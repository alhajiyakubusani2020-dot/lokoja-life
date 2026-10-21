# LOKOJA LIFE — MASTER IMPLEMENTATION ROADMAP
### Phase 3 production plan · milestones, dependencies, gates, acceptance criteria · v1.0 · 2026-10-22
> **Authority.** The execution plan the research gate unlocks. EXPANDS `docs/phase3/10-PHASE3-MASTER-
> IMPLEMENTATION-ROADMAP.md` (W1–W7, M1–M7 — binding, unmodified) into the measurable plan required by
> the directive. Subordinate to the Design Constitution and the bible stack; evidence per
> `Master_Dossier.md`; every milestone measurable; every gate testable.
>
> Mission (restated, unchanged): *not a beautiful city — a city that people who know Lokoja recognize
> instantly, and people who have never been there believe could be real.*

---

## PART I — WORKSTREAMS (W1–W7, carried; supplements folded in)

| WS | Name | Evidence base | Repo touchpoints | Definition of done |
|---|---|---|---|---|
| W1 | World Truth Foundation | 02, 06, 07, Lighting_Bible, moon tables | `layout.ts` heightAt/ironstone, `world.ts` 4-scalar roll, sky/fog/water, `flora-species.ts` | Sun-clock bound; `waterLevel` live; harmattan + 5 grades screenshot-verifiable; tint seam subtle; ironstone crown; **moon states from validated table** |
| W2 | Architectural Fabric | 03, Art_Audio_Expansion II–IV | `layout.ts` BUILDINGS, `props.ts`, `interiors.ts`, tokens | Roof grammar v2 + zinc ages; burglar-bar + compound kit; **mural + dado bands**; market ladder; civic motif; W-3 unoccluded |
| W3 | Population & Rhythm | 05-A, World_Expansion II | `needs.ts`-adjacent, `npcs.ts`, `npcChat.ts`, `calendar.ts` | Density table live (8 district types); greeting clock + Igala greetings (B6); greeting-before-price; prayer breaks; 5-day pulse |
| W4 | Transport Truth | 05-B, World_Expansion VI | `travel.ts`, `config.ts` TRAVEL, `travelEvents.ts`, Actors, `teleport.ts` | Curfew literal; rush multipliers; surge ×5–8 personal-only; flood canoe mode; named go-slows; CNG queue |
| W5 | Economy Recalibration | Dossier D1–D3, B3, team-6 | `config.ts` ECONOMY, jobs/hustles, `housing.ts`, POS float | Meals ×1.5–2.5 (MED flag); rent ≈×2.3 + move-in rule; staff ≥₦1,200; POS hustle; all with dated anchors |
| W6 | Sound & Weather Depth | 04, Audio_Bible, 06 | `ambience.ts`, `music.ts` (no change), `seasons.ts` | S1/S2/S12 live; harmattan mode; collapse-silence; 4-scalar roll drives visible+audible+economic |
| W7 | Culture & 2026 Reality | 08, team-9, World_Expansion VII–XI | `calendar.ts`/FESTIVALS, `foods.ts` v2, radio ticker, name pools | Regatta re-skin (A7); Agbo/Donkwo; security gating; foods shipped (A2 label); ember gridlock + water-restoration arcs |

**Sequencing law:** W1 → W2 → (W3 ∥ W4) → W6 → (W5 ∥ W7) → delight band. Dependencies: W2 needs W1's
sun/water states for material law; W3/W4 need W1 district states; W6 needs W1's weather scalars; W5/W7
independent of each other; delight band needs all prior.

## PART II — MILESTONES (each with measurable acceptance criteria)

| M | Name | Content | Acceptance criteria (all testable) |
|---|---|---|---|
| M1 | The air is true | W1 | 1) Screenshot at any hour attributable to exactly one of five states; 2) Dec 18:40 = lamps-only; 3) river width differs low-vs-peak from same camera; 4) flood day closes confluence + opens canoe fares + shows dressing (all three); 5) moon phase matches `moon-output.txt` ±1 day on 3 sampled nights |
| M2 | The fabric is true | W2 core | 1) Three zinc ages in one market-street frame; 2) burglar bars on ≥90% residential facades sampled; 3) W-3 sightline pixel-clean at Deck + Patti summit; 4) census re-run green (`rv-geo-census` invariants hold) |
| M3 | The city breathes | W3+W4 | 1) Density table live ×8 district types (probe script prints multipliers); 2) truck sightings 23:00–05:00 = 0 (assert); 3) rush vs midday travel minutes differ ×1.3–1.4; 4) flood-day canoe trip offered at jetty; 5) greeting chain in 100% of first-touch dialogues sampled |
| M4 | The money is 2026 | W5 | 1) All price constants carry dated-anchor comments; 2) move-in rule ≈₦250k cash demonstrable in a fresh save; 3) kobo-chain conservation battery F1/F2 green after recalibration; 4) POS float ledger round-trips |
| M5 | The city sounds like itself | W6 | 1) 22:00 trim audible (layer-gain step measured); 2) grid event → idiom ≤3 s (rate-capped); 3) rain-on-zinc scales with `rainIntensity`; 4) zero audio files added (build diff) |
| M6 | A Lokoja person nods | W7+polish | 1) Festival/foods/name pools pass 08 §VI gates; 2) 2026 arcs live with dated anchors; 3) **resident-playtest session recorded + transcribed into worklog** |
| M7 | The stranger believes | Whole-phase polish | 1) Cold-start playthrough with zero W-1 violations (audit); 2) zero NG-dressed-as-verified claims in copy (grep + review); 3) SILK gates G1–G6 green on final build; 4) five light grades + two moon states in one screenshot album |

## PART III — GATE SYSTEM (review · verification · quality)

1. **Standard per-workstream gate (review):** tsc 0 · eslint 0 · build PASS · batteries green ·
   worklog entry · bible amendment if doctrine changed. No workstream merges partial.
2. **Verification gates (evidence):** every new constant cites a bible line; every bible line cites
   a source or open-question flag (Content_Expansion Part I.1 — reviewer-enforced).
3. **Quality gates (product):** A-1 readability (360px, afternoon sun, harmattan grade explicit);
   A-3 senses-agree per state; A-2 audit line (zero reference binaries shipped); SILK budgets per
   milestone; conservation laws (kobo-chain, save migration) untouched except W5 constants.
4. **Checkpoint cadence:** each milestone ends with a screenshot album (state matrix) + probe-script
   outputs archived under `scripts/audit-tmp/` — reproducible, dated.

## PART IV — SCHEDULE SHAPE (relative order, no invented dates)

M1 → M2 are the foundation pair; M3/M4/M5 can overlap after their dependencies; M6 requires all;
M7 is the closing gate. Delight items (shadow-vanish, moon polish, Patti Race, erosion scars,
collapse-silence, vendor calls) schedule inside their owning workstream's tail, never before its DoD.

## PART V — RISK REGISTER (carried + additions)

| Risk | Evidence | Mitigation |
|---|---|---|
| Evidence-thin zones get invented | team-2/5 open questions | NG-labelling law; blocked items stay blocked (flyover, durbar, curfew-in-city, attire sets) |
| Price recalibration breaks conservation | W5 touches `config.ts` | Constants only; F1/F2 batteries rerun (M4 criteria) |
| Crowd density hurts SILK budgets | 05 §A.3 multipliers | Density = multiplier on existing caps; perfProbe per M3 |
| Regatta deviation reads as "changed the truth" | A7 | Deviation logged (08 §II); venue/edition truth as dressing |
| Real-place sensitivity | team-3/5/9 | Factual register; disputes as voices; C8 curfew law; hawker framing |
| Research debt silently becomes canon | open questions §III | Citation-path law (Content_Expansion I); reviewer-enforced |
| **Moon table drifts from reality** | B1 new | Gate M1.5 (±1 day); script is regenerable; recomputation on any calendar change |
| **AI/stock contamination of references** | v2-cloth1 case | Visual review verdicts only; reject list documented (Part D) |

## PART VI — RESEARCH DEBTS CARRIED (named; from 10 §IV + Part C updates)

Intra-city keke fare local datapoint (LOW; NG confirmed) · monthly climate table (MEDIUM) · school
bell times · buka plate prices · stall-right prices · mosque/cathedral + Government House full
facades · FUL permanent-site status · Bassa-Nge names/festivals · Ebira/Nupe greeting formulas ·
Bortle/skyglow class · street-level Lokoja photo pass (v3) · Confluence Beach Hotel revival intent.
Each has where-to-look in `Master_Dossier.md` Part III; none blocks Phase 3.

## PART VII — THE GATE (acceptance terms)

Phase 3 implementation begins only when the research gate is accepted. Acceptance means:
1. The research corpus (`docs/phase3/01–10` + `research/phase3/`) is reviewed as a set.
2. The bibles of this phase (Environment, Lighting, Audio, World_Expansion, Art_Audio_Expansion,
   Content_Expansion, Phase3_Research, Master_Dossier, Master_Implementation_Roadmap) are reviewed
   as extensions — canon preserved, no contradictions.
3. Adjudications A1–A12 + B1–B7 are ratified or overturned (each overturn cites a source).
4. The W1–W7 order and M1–M7 criteria are confirmed as the Phase 3 work queue.

**Evidence trail:** 9 team files + red team + solar/moon outputs + visual library v1/v2 under
`research/phase3/`; supplementary verification in `Phase3_Research.md` Parts C–G; worklog Task IDs
6-a…6-t, PH3R-GATE, and this phase's entry.
