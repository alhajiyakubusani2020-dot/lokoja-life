# LOKOJA LIFE — ENVIRONMENT ASSET ROADMAP
### Phase 3 Prelude · Deliverable 9 of 10 · v1.0 · 2026-10-22
> **Authority.** Translates deliverables 02–08 into a build queue. **Law A-2 framing:** every "asset"
> below is a procedural parameter family, recipe, or data table — zero model files, zero audio files,
> zero photo-textures. Evidence refs: team files + visual reference verdicts.

---

## PART I — ASSET FAMILIES (what gets built, in evidence order)

### A. Terrain & water (owner: 02-Environment; evidence: team-1, visual m1/conf1/flood1)
| # | Family | Content | Params | P |
|---|---|---|---|---|
| T1 | Ironstone crown | Patti upper-third ferruginous cap band over pale sandstone slopes | heightAt band + colour split | P0 |
| T2 | `waterLevel` river system | continuous seasonal scalar; sandbar exposure; jetty reach; confluence-closure as extreme | curve table (02 §1.2) | P0 |
| T3 | Laterite ground kit | base colour + wet-darkening + dust film + puddle patches (W-6) | terrain material rules | P0 |
| T4 | Harmattan atmosphere | episodic fog/veil state + draw-distance cut + lamp halos | sky/fog params | P0 |
| T5 | Confluence tint seam (subtle) | soft colour difference only (A4) | water shader mix | P0 |
| T6 | Erosion scars | Felele-approach gully dressing, post-storm refresh | decal/geometry rule | P2 |

### B. Flora (evidence: team-1 §2.6 + m1/zinc1 verdicts)
| # | Family | Content | P |
|---|---|---|---|
| F1 | Placement grammar v2 | riverine palms/raffia hug water; compound mangoes; upland acacia/neem/shea; plantain in wet hollows | P0 |
| F2 | Seasonal colour switch | `aLeaf` weather-gold mask → dry gold-brown vs rainy saturated green; hill stays green (m1 law) | P0 |
| F3 | Species audit pass | ground-truth the 10-species set vs Kogi sources (GBIF facet pull + one academic pass) — additions/removals by evidence only | P1 |

### C. Buildings & props (owner: 03-Architecture; evidence: team-2, gov1/flood1/zinc1)
| # | Family | Content | P |
|---|---|---|---|
| B1 | Roof grammar v2 + zinc age grades | 6-form enum; weathered→painted→rust→patched; blue ridge-cap accent | P0 |
| B2 | Burglar-bar + compound kit | bar instancing; wall/gate rule; meter boards; tanks + DStv dishes | P0 |
| B3 | Market ladder kit | stall→lock-up→hall→tech-hub; engineered drainage point; Ultra-Modern location arc | P0 |
| B4 | Civic white-arch kit | twin-arch gatehouse motif (gov1); institutional palette | P1 |
| B5 | Consumer-power props | poles, strapped transformers, drop tangles, pole plaques | P1 |
| B6 | Colonial veranda kit | deep eaves, verandas, low fences (Historic/GRA) | P1 |
| B7 | School bar kit | classroom bars, yard flagpole, AGILE scaffold state | P2 |
| B8 | Flood set-dressing kit | canoes-on-highway, debris rafts, sandbag lines, camp rows, blue tarps | P0 (with flood law) |
| B9 | Stall grammar v2 | roller-shutter lock-ups, trade-colour tarps; clearance contract kept | P2 |

### D. Sky & light (owner: 07-Lighting; evidence: solar script + refs)
| # | Family | Content | P |
|---|---|---|---|
| L1 | Sun-clock binding | one table → world.ts slots + sky + shadows | P0 |
| L2 | Five light grades | state-driven fog/sun curves (07 §II) | P0 |
| L3 | Golden-hour signature | 17:00–18:20 slot tuning + Dec early-dark law | P0 |
| L4 | Shadow-vanish event | near-zenith days ≈Apr 11/Sep 4 | P2 |
| L5 | Moon-phase system | **blocked** until source pass (02-S14) | P2 (blocked) |

### E. Audio recipes (owner: 04-Audio; all zero-file)
S1 rain-intensity/zinc law · S2 generator layer · S3 power-state idiom · S4 bird palette v2 (4 species
voices from the Adang census) · S5 call-window scheduler · S6 horn patterns · S7 harmattan mode ·
S8 vendor calls · S9 dogs · S10 collapse-silence · S11 flood river · S12 night-law trim. P0 = S1, S2,
S12 (as ruled in 04 §III).

### F. Life & systems data (owner: 05/06/08 bibles)
| # | Family | Content | P |
|---|---|---|---|
| D1 | Crowd-density + schedule tables | 05 §A.3/A.4 laws → needs/calendar/npcChat wiring | P0 |
| D2 | Traffic laws | truck curfew, rush multipliers, crisis surge, flood canoe mode | P0 |
| D3 | Economy recalibration | meals/rent/staff-wage uplift + move-in rule + POS float ledger (05/10 refs; MED-confidence flags kept) | P0–P1 |
| D4 | Festival alignment | regatta re-skin (A7), Agbo/Donkwo windows, security-era gating | P1 |
| D5 | foods.ts v2 | 8 KEEP / 2 FIX / 0 DELETE + okoho (A2-labelled) + kilishi/kosai/grilled fish | P0 |
| D6 | 2026 reality layer | ember gridlock window, water-restoration arc, CNG queue, rent surge, campus/hospital beats (team-9 register) | P1–P2 |

## PART II — ACCEPTANCE CRITERIA (per family, testable)
- T2: river width visibly differs low-vs-peak months; confluence closes only at flood extreme.
- B1: three visibly distinct zinc ages within one screenshot of a market street.
- L1/L2: any screenshot attributable to exactly one weather state; December 18:40 = lamps-only.
- E: 22:00 trim audible; grid event → idiom within 3 s (rate-capped); zero new files.
- D5: every dish traceable to 08 §III; okoho copy carries the A2 label.
- All families: no invented Lokoja specifics (NG-labelled or open-question-blocked).

## PART III — SEQUENCING (dependencies)
T1/T2/T3 (terrain truth) → L1/L2/L3 (light on truthful land) → B1–B4 (fabric) → F1/F2 (life) →
E-Audio S1/S2/S12 (sound on the new world) → D1/D2 (population & traffic) → D3–D6 (systems depth) →
P2 delight band. Full sprint mapping: 10-PHASE3-MASTER-IMPLEMENTATION-ROADMAP.md.
