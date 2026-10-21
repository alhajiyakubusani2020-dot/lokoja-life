# LOKOJA LIFE — PHASE 3 MASTER IMPLEMENTATION ROADMAP
### Phase 3 Prelude · Deliverable 10 of 10 · v1.0 · 2026-10-22
> **Authority.** The execution plan the research gate unlocks. Subordinate to the Design Constitution
> and the existing bible stack; fed by deliverables 01–09. Mission restated: *not a beautiful city —
> a city that people who know Lokoja recognize instantly, and people who have never been there believe
> could be real.*

---

## PART I — WORKSTREAMS (evidence → build)

| WS | Name | Evidence base | Repo touchpoints | Definition of done (gate) |
|---|---|---|---|---|
| W1 | **World Truth Foundation** | 02-Environment, 06-Weather, 07-Lighting, solar script | `layout.ts` (heightAt band, ironstone), `world.ts` (4-scalar weather roll), sky/fog/water params, `flora-species.ts` | Sun-clock table bound to slots; `waterLevel` curve live; harmattan + 5 light grades screenshot-verifiable; tint seam subtle; ironstone crown on Patti |
| W2 | **Architectural Fabric** | 03-Architecture | `layout.ts` BUILDINGS, `props.ts`, `interiors.ts`, tokens | Roof grammar v2 + zinc age grades; burglar-bar + compound kit; market ladder (Ultra-Modern arc P1); white-arch civic motif; zero occlusion of W-3 sightline |
| W3 | **Population & Rhythm** | 05-NPC Part A | `needs.ts`-adjacent store events, `npcs.ts`, `npcChat.ts`, `calendar.ts`, crowd tables | Hour-by-hour density table live (8 district types); greeting clock + greeting-before-price mechanical; prayer breaks; 5-day Kpata pulse; meal windows |
| W4 | **Transport Truth** | 05-NPC Part B | `travel.ts`, `config.ts` TRAVEL, `travelEvents.ts`, Actors traffic, `teleport.ts` | Truck curfew literal; rush multipliers; crisis surge ×5–8 personal-only; flood canoe mode; named go-slow locations; CNG queue event |
| W5 | **Economy Recalibration** | 01-Dossier D1–D3, team-6 price board | `config.ts` ECONOMY, `jobs.ts`/`hustles.ts` (verdicts), `housing.ts`, POS float ledger | Meals ×1.5–2.5 (MED flag kept); basic-room rent ≈×2.3; staff wage ≥₦1,200; move-in cash rule; POS agent hustle + flood canoe fares; all with dated anchors |
| W6 | **Sound & Weather Depth** | 04-Audio, 06-Weather | `ambience.ts`, `music.ts` (no change), `seasons.ts` extensions | S1 rainIntensity/zinc law; S2 generator layer; S12 night-law trim; harmattan audio mode; 4-scalar weather roll driving visible+audible+economic effects |
| W7 | **Culture & 2026 Reality** | 08-Culture, team-9 register | `calendar.ts`/`config.ts` FESTIVALS, `foods.ts` v2, radio/news ticker, name pools | Regatta re-skin (A7); Agbo/Donkwo windows; security-era gating; foods verdicts shipped (okoho A2-labelled); ember-gridlock + water-restoration arcs; multi-ethnic name distribution |

Sequencing law: W1 → W2 → (W3 ∥ W4) → W6 → W5 ∥ W7 → delight band (02-P2, 07-L4, audio P2 seeds).
Every workstream ends with the standard gate: tsc 0 · eslint 0 · build PASS · batteries green ·
worklog entry · bible amendment if doctrine changed.

## PART II — MILESTONES

| M | Content | Exit criteria |
|---|---|---|
| M1 "The air is true" | W1 complete | Any screenshot attributable to exactly one weather state; December 18:40 = lamps-only; river width differs by season |
| M2 "The fabric is true" | W2 core (B1–B4) | Three zinc ages in one frame; W-3 sightline untouched; census re-run green |
| M3 "The city breathes" | W3 + W4 | Density table live; curfew + surge demonstrable in a reproducible script; greeting-clock in every first-touch dialogue |
| M4 "The money is 2026" | W5 | Price board deltas shipped with dated anchors; move-in rule + POS hustle playable |
| M5 "The city sounds like itself" | W6 | 22:00 trim audible; generator choreography on grid events; rain-on-zinc scales with intensity |
| M6 "A Lokoja person nods" | W7 + polish | Festivals/foods/names pass 08 §VI gates; 2026 arcs live; **resident-playtest session recorded and transcribed into the worklog** |
| M7 "The stranger believes" | Whole-phase polish | Cold-start playthrough: zero invented-geography violations (W-1 audit), zero NG-dressed-as-verified claims, SILK gates green on final build |

## PART III — RISK REGISTER (from the research itself)

| Risk | Evidence | Mitigation |
|---|---|---|
| Evidence-thin zones get invented (schools, facades, Bassa-Nge names) | team-2/5 open questions | NG-labelling law (01 §6); blocked items (moon phases, attire sets, durbar, flyover) stay blocked |
| Price recalibration breaks save conservation | team-6 verdicts touch `config.ts` | Kobo-chain laws untouched — only content constants move; F1/F2 batteries rerun per workstream |
| Crowd density hurts SILK budgets | 05 §A.3 multipliers × existing NPC budget | Density is a multiplier on existing ambient caps; perfProbe run per M3 |
| Festival anchor deviation (regatta) drifts into "we changed the truth" | A7 | Deviation is logged in 08 §II with rationale; venue/edition truth shipped as dressing |
| Real-place sensitivity (security laws, ethnic disputes, child hawking) | team-3/5/9 | Factual register only; disputes as NPC voices; no curfew inside Lokoja metro (C8); hawker cameos framed as hustle, no abuse content |
| Research debt silently becomes canon | open questions §6 each team | Phase 3 content PRs must cite the bible line; bible lines must cite a source or an open-question flag |

## PART IV — RESEARCH DEBTS CARRIED INTO PHASE 3 (named, with where-to-look)
Intra-city keke fare 2025-26 (NBS Kogi PDF, Nairaland pass) · monthly climate table (climate-data
retry) · school bell times (Kogi SUBEB) · Bukka plate prices (Nairametric-style cost-of-eating piece) ·
stall/shop-right prices (Jiji mobile) · mosque/cathedral facade photos · Lugard Rest House condition ·
FUL permanent-site status · Bassa-Nge names/festivals · greeting formulas for Igala/Ebira/Nupe/Bassa-Nge
(native-speaker pass) · moon/bird-call acoustic references (Xeno-canto retry) · Confluence Beach Hotel
state · street-level Lokoja photo pass (Team 8 §4).

## PART V — THE GATE

Phase 3 implementation may begin only after this research gate is accepted. Acceptance means:
1. The ten deliverables in `docs/phase3/` are reviewed as a set.
2. The dossier's adjudications (A1–A12) are ratified or overturned — each overturn gets a source.
3. The W1–W7 order and gates are confirmed as the Phase 3 work queue.

**Evidence trail for this gate:** 9 team files + red team + solar output + visual library under
`research/phase3/`; swarm record in `worklog.md` (Task IDs 6-a…6-t + this consolidation).
