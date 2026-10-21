# LOKOJA LIFE — ENVIRONMENT DESIGN BIBLE
### Phase 3 Prelude · Deliverable 2 of 10 · v1.0 · 2026-10-22
> **Authority.** Expansion of `World_Bible.md` v2.2 (Parts 0–III). This book translates the research
> dossier (`01-RESEARCH-DOSSIER.md`) into environment design law. Evidence: `research/phase3/team-1-geography.md`
> (every claim carries URL+date+confidence), `team-8-visual-ref.md` (visually verified), solar table
> (`research/phase3/solar-output.txt`). Repo anchors cite `path:line`.
>
> **The question this book answers:** how should the world actually look, every hour, in every season?

---

## PART I — THE LAND, AS EVIDENCE

### 1.1 Terrain doctrine
- The city sits on a **flat riverside floor** below Mount Patti (458 m real, Agbaja **ironstone cap**
  over pale Cretaceous **Lokoja-Fm sandstone** — peer-reviewed; outcrops literally at in-game Felele
  Junction and Nataco–Banda). The repo's `heightAt` (sine noise + Patti mound + terraces, `layout.ts:834-889`)
  is confirmed lawful; the **ironstone crown** is the one terrain correction: a reddish-brown ferruginous
  cap band on Patti's upper third over paler slopes (team-1 S6).
- **Laterite red is the ground truth** (visual-verified m1/zinc1): terrain base colour, dust colour, and
  dry-season road wash all derive from the same orange-red family.
- **Erosion is a named feature:** gully erosion devastates parts of Lokoja (Daily Trust 2023) — Felele
  approaches may carry erosion scars as post-storm dressing (S13).
- Hills around the city ("abundance of hills", Agbaja hunting ground) stay in silhouette range; earliest
  settlement was ON Patti, drifting down to the river — the hill is the city's cradle, not backdrop.

### 1.2 Water doctrine — the rivers are characters
- **Water-level season curve (S2, P0):** low Dec–May → rise Jun → **peak Sep–Oct** → recede Oct–Nov
  (NIHSA alert/recede pattern, team-1 §2.3). Implement as a continuous `waterLevel` scalar driving:
  river width/banks, sandbar exposure, jetty reach, canoe positions. The existing flood-day law
  (`seasons.ts:50-54` closes the confluence) remains the extreme end of the same scalar.
- **Two water truth-states** (visual-verified): conf1 — dark mirror with a gold sun-path at sunset;
  flood1 — opaque brown torrent with debris. Dry-season state sits between: hard glitter, visible sandbars.
- **The tint seam law (S4):** Niger-vs-Benue colour difference is rendered **subtle only** — the viral
  hard two-tone confluence photo is DEBUNKED (Dubawa 2023). Law W-3 sightline (Deck + Patti summit)
  remains absolute.

### 1.3 Vegetation doctrine — green, not tan
- **The savanna stereotype is wrong for this city.** Visual evidence (m1): Patti's slopes are **deep
  forest-green** even adjacent to the town; the hill wears trees, not scrub. Brown belongs to the
  dry-season ground plane and harmattan air (S7).
- Species placement logic (S8): oil palm + raffia **hard against rivers** ("leaning river palm");
  neem, acacia, shea on upland savanna; mango in compounds (existing 10-species set,
  `flora-species.ts:26-31` is kept; placement grammar is the upgrade). The `aLeaf` weather-gold mask
  (`flora-species.ts:24`) becomes the seasonal colour switch (S7).
- Cultivated context for farm edges: cashew, palm oil, yam, cassava, rice, melon (Kogi agriculture,
  team-1 §2.6). Banana/plantain clusters in wet hollows (zinc1).
- Ground-truth caveat (honest): Lokoja wild-tree survey remains an open question (GBIF Kogi records are
  insect-dominated; shea has zero digitised records) — the 10-species palette stands on repo field-guide
  + regional agriculture evidence, labelled MED.

### 1.4 Air doctrine — dust and haze
- Harmattan = **episodic multi-day dust-haze events** off NE winds (NiMet forecasts; aviation
  disruptions Dec 2025, Kano health alerts Jan 2026), NOT the whole dry season (S3). Deep episodes:
  visibility 2–5 km, sky whitened, horizon tan, sun a pale disc, everything furred with dust by morning.
- Rainy season humidity ≈60% RH; steam after night rain; mist on Patti slopes at dawn.

## PART II — THE HOUR-BY-HOUR WORLD (the directive's core question)

Five truth-states share one sun clock (see 07-LIGHTING for the numbers). Full tables: team-1 §3.1-3.5.
Condensed law per state:

| State | 06:00 | 12:00 | 17:00–19:00 | 20:00+ |
|---|---|---|---|---|
| **Clear dry** | Golden seam east over the Niger; cooking-fire smoke threads; long west shadows | Hard white; heat shimmer; bleached roads; dust devils possible | Bronze water; orange walls; Patti faces catch red light; Maghrib azan | Dark by ~19:15; lamp constellations (492 lamps); fire-glow compounds |
| **Harmattan** | Pale sun disc through orange-grey haze; dust in every beam; matte grey-pink water | Weak white overhead; whitish sky, tan horizon; colour compressed | Dirty-orange sunset, red smear through dust; lamp halos ring early | Moon = ringed glow; stars gone; zinc ticking in gusts |
| **Rainy** | Pink-grey filtered dawn; steam; wet-red mud; vivid greens | Clouds build SW; puddle law live on clay patches; oppressive | Anvil towers; light drops a stop; rain-haze veils; okadas under bridges | Far lightning; frogs; generator chorus |
| **Storm** | Bruised purple-grey dawn; gust-front stillness | Anvil wall from the SW; sky green-grey; zinc roar | Sudden gold slit under the black shelf; washed ozone air | Debris leaves; drains choked; blue tarps appear next morning |
| **Flood** | Grey-pink dawn on a drowned town; camp lamps before dawn | Watery sun on brown sheets; canoes on the highway (2022 truth); sandbag lines | Sunset over water where streets were — visually huge, tragic | Dark water plane; kerosene lamps in camp rows; guarded quiet |

**Seasonal colour grade law (S7):** dry = gold-brown grass, bleached roads, compound-tree green only;
rainy = saturated greens, red mud, standing puddles (`World_Bible` W-6 puddle law confirmed); harmattan
overlay = desaturate + warm-grey veil + dust film on roofs/cars. Storm aftermath = blue tarpaulins,
downed branches, days-long repairs (S9).

## PART III — ENVIRONMENT LAWS FOR THE BUILD

**P0 (world-truth, build first)**
1. **S1 Sun-clock law** — bake the sourced curve (see 07-LIGHTING §1); `world.ts` slots align to it.
2. **S2 `waterLevel` scalar** — continuous river season curve; confluence closure stays its extreme.
3. **S3 Harmattan haze layer** — episodic warm grey-orange fog state with draw-distance cut + lamp halos.
4. **S4 Subtle tint seam** on the confluence; W-3 sightline untouched.
5. **S5 Flood set-dressing** — canoes on the highway, debris rafts, sandbag lines, camp rows.

**P1 (texture)**
6. **S6 Ironstone crown** on Patti; quarry-cave secret already on disk fits ironstone diggings.
7. **S7 Seasonal colour grade** via `aLeaf` mask + terrain wash families.
8. **S8 Species placement grammar** (riverine palms, compound mangoes, upland acacia/neem/shea).
9. **S9 Storm scarring** (tarps, branches, repair lag).
10. **S10 Dawn/dusk people bands** — 06:00–07:00 and 17:45–18:30 are the day's two golden signatures;
    silhouette law (A-1) uses them.

**P2 (delight)**
11. **S11 Near-zenith shadow-vanish days** (≈Apr 11 & Sep 4, computed).
12. **S12 Mount Patti Race** (real 2026 event) on the real trail.
13. **S13 Erosion scars** near Felele after storms.
14. **S14 Moon-phase system** — blocked on a source pass (open question) before build.

**Wind law (NIGERIA-GENERIC, MED):** dry-season NE harmattan wind; SW sea-breeze-to-storm inflow on
rainy build-ups (clouds build from SW — team-1 §3.3); gust fronts precede storms. Wind manifests as
flag/dust/tree params, not a simulated field.

**Acceptance gates for this book:**
- A screenshot at any game hour must be attributable to exactly one of the five states (A-3 senses agree).
- Patti summit frame shows: green slopes, ironstone crown, confluence seam — nothing occluding it (W-3).
- Harmattan state measurably reduces far visibility (fog/far-plane) and desaturates ≥30% at distance.
- The confluence never shows a hard two-tone seam (A4/A-D4 law).
