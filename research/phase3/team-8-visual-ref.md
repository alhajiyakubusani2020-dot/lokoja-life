# Team 8 — Visual Reference Library · Phase 3 Prelude (Task 6-i)

> **Compliance law first:** the game is 100% procedural (Art_Audio_Bible Law A-2). Every image in this
> library is a **reference for procedural parameters** (colour tokens, silhouette grammar, material
> behaviour, composition). **No image may ship as a game asset, texture, or bitmap.** OSS URLs are
> embeddable for doc use only; the local copies under `imgs/` are working references, not game content.
>
> Method: 14 image-search categories (z-ai image-search, gl=us, count 4–6, ~68 candidates).
> The 12 highest-value candidates were downloaded to `imgs/` and **visually verified by inspection**
> before acceptance. Verdicts: ACCEPT (verified fit) / HOLD (regional or unconfirmed) / REJECT (wrong content).

## 1. Verified reference table (the 12 inspected images)

| File | Query cat. | Source (via OSS) | Verdict | What it actually shows + design use |
|---|---|---|---|---|
| `imgs/m1.jpg` | Mount Patti | Dreamstime (ID 152620724) | **ACCEPT** | Summit view DOWN through mist: dense green forest slopes (much greener than savanna stereotype), red-brown laterite soil + pebbles in foreground, town below dissolved in pale haze, winding tarmac up the hill. Use: Patti slope vegetation density, haze depth, summit sightline framing, laterite trail colour. |
| `imgs/m2.jpg` | Mount Patti | "Tour with MiCi" 2560px | **HOLD** (location unconfirmed) | Town of rust-brown zinc roofs packed among BARE dark rock inselbergs/domes. Plausibly Kogi region (granite dome country) but not verifiably Lokoja. Use: regional "rock + roof" palette only; do not cite as Lokoja. |
| `imgs/conf1.jpg` | Confluence | YouTube (davidnkwa, confluence explainer thumb) | **ACCEPT** | Confluence at sunset: very broad water, low dark ridge horizon, golden sun-path on water, lone boat silhouette, dim orange-grey sky. Use: confluence sunset grading, water scale, ridge silhouette (Law W-3 composition). |
| `imgs/conf2.jpg` | Confluence | Shutterstock | **REJECT** | Not the confluence at all — a Shutterstock marketing page ("We have great content", two people at a laptop). Excluded from library. |
| `imgs/city1.jpg` | Lokoja city | CNN | **HOLD** (NIGERIA-GENERIC; likely northern city, procession scene) | Wide dual carriageway, 3–4 storey mixed-use blocks with shopfronts + signage, dense walking crowd (green-leaf procession), many okadas, concrete poles, blue dry-season sky. Use: street furniture + crowd energy + shopfront grammar; not citable as Lokoja. |
| `imgs/bridge1.jpg` | Niger bridge | Britannica (map) | **ACCEPT (as map)** | Not a bridge photo — Britannica Niger/Benue basin map: Lokoja labelled at the confluence, elevation bands 200/500 m, "areas subject to flooding" shading, full river course. Use: cartographic evidence for hydrology + flood zones (Lighting/Weather bible context figure). |
| `imgs/flood1.jpg` | Flood (Kogi) | Premium Times | **ACCEPT** | Flood at window-sill height: brown turbid water, rust-streaked zinc roofs (one red-oxide painted, one with BLUE-painted ridge cap), rendered-then-patched block walls, DStv satellite dish, concrete-block fence, grey harmattan-ish sky, palms on far shore. Use: flood-state set dressing, zinc rust + paint behaviour, satellite-dish prop, wall patchwork texture. |
| `imgs/harm1.jpg` | Harmattan | Alamy K1EWD1 | **HOLD** (Sahel village, north of Lokoja) | Conical thatched huts in a dense tan-pink dust veil; sun diffused to a disc; trees ghosted in layers. Use: harmattan haze COLOUR/DEPTH/fade-curve only. NOT an architecture reference (cone huts are Sahel, not Lokoja). |
| `imgs/gov1.jpg` | Govt building | The Guardian Nigeria | **ACCEPT** (verified Lokoja — "KOGI STATE GOVERNMENT HOUSE" signage) | White twin-arch gatehouse, green-white flag, ornate black steel gates, mosaic-pebble low wall, NSCDC/police/military officers + white Hilux, mosque dome behind. Use: civic white-arch motif, security posture at government sites, flag placement, mosaic wall texture. |
| `imgs/zinc1.jpg` | Zinc roofs | Pexels | **ACCEPT (NIGERIA-GENERIC vernacular)** | Mud-block house: orange-red laterite walls (unrendered), deeply overhanging rusted zinc gable on round-timber posts, zinc window shutters, plank door, plantain + neem-like trees, orange sand ground, deep blue sky. Use: vernacular palette (laterite wall vs rust roof vs blue sky), overhang silhouette, yard props. |

## 2. Category catalogue (all 14 searches; verified picks above, remaining URLs unverified)

| # | Category (file) | Best candidates (OSS URL) | Source types | Note |
|---|---|---|---|---|
| q01 | Mount Patti | `febcb6b79d36.jpg` ✅ m1 · `95fce2ee2d72.jpg` ⚠ m2 · `ec253a67b07c` / `2c625d9469cb` (YouTube thumbs, unviewed) | Dreamstime/YouTube/LinkedIn | m1 is the anchor reference |
| q02 | Confluence | `6a9c16467ab7.jpg` ✅ conf1 · `ce06bc359782` / `3b56ee680ed7` / `8662622b970c` (Shutterstock — one verified AD, others unviewed) | YouTube/Shutterstock | treat Shutterstock batch with suspicion |
| q03 | Lokoja city | `9afe1c0e06c3.jpg` ⚠ city1 · `c445da85ee2a.jpg` (Expedia 3840px, unviewed) · `c8de375d230d` / `8a030722e7fa` (My Guide Nigeria) | Expedia/Alamy/CNN/MyGuide | c445da85ee2a worth future inspection |
| q04 | Kpata market | `0597bab91bc9.jpg` (Academia.edu — likely fieldwork photo) · Alamy ×3 | Academia/Alamy | unviewed; academia source promising |
| q05 | Market generic | `2eb09d17023c` (Tripadvisor) · `a16df437537e` (Wigmore Trading) · `6edd91ad3508.png` (BoF) · `6427399dc3cd` (Shutterstock) | mixed | NIGERIA-GENERIC texture |
| q06 | Zinc roofs | `d9cdf9863a77.jpeg` ✅ zinc1 (Pexels 4000px) · `31ed9ac94d19` (Archaeology Magazine) | Pexels/others | verified |
| q07 | Okada | `9f6d1a9be226` (Guardian NG) · `10f76f2c5588` (Daily Post) · `a5ba1b7691ee` (Quartz) · `256bcdbbc4e3` (Alamy) | Nigerian press | unviewed; press sources reliable |
| q08 | Keke | `1c94fb4d02b3.jpg` (Daily Trust 1727px) · `10d3906b5c22` (Alamy) · `cd10b8c58698` (turnetfinance) | Daily Trust/Alamy | unviewed; Daily Trust pick promising |
| q09 | Niger bridge | `e3127fb01d86.jpg` ✅ bridge1 (Britannica MAP) · `acb031293d1b.jpg` (Guardian NG 1600px, unviewed) · `0f47558e4698` (Alamy) | Britannica/Guardian | acb031293d1b likely a real bridge photo — inspect later |
| q10 | Harmattan | `bd9f82bcaea2.jpg` ⚠ harm1 · `8eb207c0557e` / `a9b18c6b46e5` / `3a22a76cf581` (Alamy) · `6de334146481` (Dreamstime) | stock | atmosphere-only use |
| q11 | Flood | `db024e23a90b.jpg` ✅ flood1 (Premium Times) · `6cd05a307e60` (Guardian NG) · `c370cb1d36cd` (Phys.org) | press | verified |
| q12 | Govt House | `121471ce01e3.jpg` ✅ gov1 (Guardian NG) · `82829d353d6a` (Daily Trust) · `ef8d4f09be3f` (Alamy) | press | verified |
| q13 | Sunset river | LiveAboard / Nihi Sumba / FINNS Beach Club / Epic Fly Rods | non-Nigerian leisure sites | **CATEGORY REJECTED** — results are generic tropical/beach sunsets, not the Niger at Lokoja; do not use |
| q14 | Suya stall | `95be88158c62` (Pexels 4640px) · `758579fd246b` / `62ea0ccfcb36` (Eater London) · `319a03e0becc` (Zena's Kitchen) | food media | unviewed; NIGERIA-GENERIC food texture |

## 3. Cross-cutting design observations (from the verified set)

1. **Green, not tan.** The single biggest palette correction: Mount Patti's slopes are deep forest-green
   (m1) even adjacent to the city; the "savanna = brown" instinct is wrong for the hill and its foot.
   Brown belongs to the dry-season ground plane and harmattan air, not the hill.
2. **Haze is the atmosphere of record.** Both m1 (Patti mist) and conf1 (sunset) and harm1 (dust veil)
   agree: distance in this region dissolves in warm pale veils — the Art Bible's "warm haze over cold
   fog" (pillar 3) is not just a style choice, it is photographically correct here.
3. **Zinc tells time.** flood1 + zinc1: roofs run from fresh grey → red-oxide paint → rust-streaked →
   patched-with-mismatched-panels; blue painted ridge caps appear as an accent. Rust streaking + patchwork
   = age signal the procedural facade generator can grade on.
4. **White civic arches.** gov1: the Government House gatehouse is white-painted round arches over a
   mosaic wall — a repeatable civic motif for the Architecture Bible's government typology.
5. **Water is wide and brown-green at flood, dark at sunset.** conf1 (dark, mirror-gold path) vs flood1
   (opaque brown) give the two water states; Weather Bible water-parameters should interpolate these.
6. **Red laterite is the ground truth.** m1 foreground + zinc1 yard: the orange-red soil is saturated and
   everywhere — the terrain base colour and dust colour both derive from it.
7. **Reference hygiene law adopted:** every URL in this library carries a verdict; no unverified image may
   be cited as "Lokoja" in any bible — HOLD items may only support NIGERIA-GENERIC parameters.

## 4. Remaining work (honest gaps)

- 9 candidates unviewed (q03 Expedia 3840px, q04 Academia fieldwork, q09 Guardian bridge photo, q14 Pexels
  suya) — highest-value next inspections for a later pass.
- No verified street-level Lokoja photograph in hand yet (city1 is HOLD); a Street-View-style pass or
  resident photo call would close it.
- Satellite imagery pass (OSM + Sentinel) not yet rendered as figures — team-1's OSM evidence covers
  geography; a rendered satellite figure would strengthen the dossier.
