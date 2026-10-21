# LOKOJA LIFE — WORLD BIBLE
### Version 2.1 · The book of the city itself

> **Authority.** Subordinate to the **Design Constitution**. This book owns *the place*: its land, districts, landmarks, fabric, nature, seasons, people, and time. The Experience Bible owns how the place *feels*; this one owns how the place *is*.
>
> **Companions.** `Experience_Bible.md` (the feelings), `Art_Audio_Bible.md` (the senses), `Content_Bible.md` (how to grow the place without breaking it).
>
> **Ground rule.** Every number below was verified on disk (source files cited). Where the city today falls short of the city this book describes, the gap is named as a **debt** — never hidden, never faked. Honesty about the city is part of the city.
>
> **Upgrade (v2.0, 2026-10-21).** The ERA II reverification pass: the geo layer re-decoded from the binary itself (2,655 ways / 5,894 segments / **750.4 km**), street-craft counts re-verified at runtime, stale figures amended, and the living-constitution layers added (Part X). Audit of record: `docs/BIBLE_UPGRADE_AUDIT.md`.
>
> **Reverification (v2.1, 2026-10-21).** Second RULE ZERO pass: the binary re-decoded again (all headline figures held), the door census corrected (**98 doors = 10 layout + 88 school** — the old "108" double-counted `ALL_DOORS`), the underwater-segment measure replaced with a reproducible one (**23 unbridged crossings / 3 within half-width**), parked cars 12 → **7**, school interior builders 17 → **20**, and the road-fabric W-32 figure aligned with §3.5. Every change below carries its own anchor.

---

## PART 0 — THE CITY DOCTRINE

### 0.1 A real place, not a collection of assets

Lokoja is a real city — the capital of Kogi State, Nigeria, sitting where the Niger and Benue rivers meet. Lokoja Life is built from its *actual geography*: the road network is decoded from real OpenStreetMap data (`public/world/geo-v1.bin` — 2,655 ways / 5,894 segments / **750.4 km of real roads**, 16 rivers, 16 bridges, loaded before any layout module evaluates, `geo-gate.ts`). The districts carry their real names. The hill is the real hill. The confluence is the real confluence.

This is the founding decision of the whole project and it is **permanent law**:

> **Law W-1 — Geography is law.** The city's shape comes from the real world. We may *stylise* the representation; we may never *invent* geography. A new road, river, hill, or district enters the game only through the OSM pipeline or a Bible amendment with cultural review.

Why: the diaspora player (Experience Bible EX-38) must be able to stand in the game and say *that is our road*. Every invented shortcut spends that trust; every honest kilometre earns it.

### 0.2 The city is a place, not a level

Lokoja was not "designed" for the player. It existed before them, and it would exist without them (The City Never Blinks). Every design decision in this book flows from that inversion: we are not placing content in a level; we are opening a window onto a place. The player is a *resident*, never a hero, never a tourist. The city's buildings do not face the player; the player joins the city's face.

### 0.3 The two truths of this book

Each district and system below carries two registers, and both are true:

- **GROUND** — what is on disk today, with anchors.
- **DOCTRINE** — what the place must become, as law.

The DOCTRINE is not fiction; it is commitment. Any content work that touches a district must serve its DOCTRINE entry or amend this book first (`Content_Bible.md` review gates).

### 0.4 Scale, measures, and the map

The city's measures are engine law (`geo.ts:7-38`, `layout.ts:36-49`):

| Measure | Value | Meaning |
|---|---|---|
| World unit | **1 u = 26 real metres** | Distances feel like real distances |
| Heading | North = −Z | Sun, rivers, and wayfinding agree with reality |
| Origin | 6.753°E / 7.790°N | The real Lokoja |
| World half-extent | 310 u ≈ **16 km across** | The playable city |
| 2D map grid | 0–100 ↔ world via `MAP_SCALE = 6.2` | The paper map and the 3D city are one truth |
| Playable water | None — rivers are law-protected barriers | Bridge decks excepted (`collision.ts`) |
| Rendered widths | Stylised | Plan geometry is 1:1 (W-1); road ribbons render widened for readability (minor ≈ 2.6 u visual) and Patti's 30 u mound compresses its real ~450 m — lawful stylisation, never presented as survey truth |

**Law W-2 — One truth, two renderings.** The 2D map and the 3D world are renderings of the same data. Nothing may appear on one and not the other (except UI affordances). A place added to the map that is not in the world is a lie; so is the reverse.

---

## PART I — THE LAND

### 1.1 The Confluence

**GROUND.** The Niger–Benue confluence renders at the city's edge: the two rivers meet at 0.00 u of error against real geography, the Confluence Deck and its flag stand on the bank, a canoe rests nearby, boats ride the water (`CityMesh.tsx` landmarks; rivers static, motion supplied by boats). The geo layer carries 16 rivers and 16 bridges city-wide.

**DOCTRINE.** The confluence is the city's *meaning made visible* — Lokoja is called "the confluence place," and the game must make every player feel why. It is the single most protected composition in the project:

- **Law W-3 — The Sightline.** From the Confluence Deck and from Mount Patti's summit, the two-river seam must remain visible forever. No building, stall, tree, UI element, or future landmark may occlude it above knee height. Violations are Bible amendments, not content PRs.
- The rivers are characters, not textures: they get *presence* (boats, ferries, moored canoes, the sand landings' G2 future) before they get *physics* (flow, swimming). Still water honestly composed beats fake water badly simulated.
- The water is inviolable: no body enters uninvited (`collision.ts` blocks it). Any future swimming is a Bible amendment with its own doctrine — the river is respected before it is conquered.

### 1.2 Mount Patti

**GROUND.** The real hill (~450 m in reality) is the world's high ground, authored into the analytic terrain (`heightAt` — sine noise + Patti mound + terraces + river carving, `layout.ts:834-889`). The authored trail (`PATTI_TRAIL`), 110 rocks, the Patti Tower, the ranger hut, and **five secrets** exist: the mast, the baobab, the quarry cave, the Rest House, the summit stone (`patti.ts:64-116`), each with idempotent discovery and its own honest paragraph of history.

**DOCTRINE.** Patti is the city's *crown and memory*:

- The climb is the game's longest effort→view arc (Experience EX-13). The trail is the experience; no shortcut, teleport, or "skip" may ever be cheaper than walking it.
- The five secrets are a **closed set** (Law W-4): five is the number of Patti's secrets until the Content Bible's collectible playbook amends it. Their rewards reward *knowledge and view*, modest and story-flavored.
- The Rest House is colonial history handled with dignity: the hill is where the region's colonial chapter is *remembered*, not celebrated — the in-world copy tells what happened with a resident's voice, not a brochure's.
- The mast, the baobab, the quarry, the summit stone each carry one job: mast = the modern city's signal (you can see the whole grid from it), baobab = the ancient land's memory, quarry = the working land's history, summit stone = the naming lore — *the hill where the name Nigeria is said to have been born*, held as respectful tradition.

### 1.3 The Rivers & Bridges

**GROUND.** 16 river ways and 16 bridges from the OSM layer; the river block is hard law with bridge-deck exceptions (`collision.ts:30-211`); the ferry is a real fare path (`rivers.ts`); boats exist as landmark craft.

**DOCTRINE.**

- **Law W-5 — Bridges are promises.** A bridge rendered must be walkable/drivable, and a road that crosses water must do it on a bridge. The known fabric debt (**23 unbridged road segments geometrically cross a river centerline; 3 more lie within a river's half-width at midpoint** — the reproducible v2.1 re-decode of `geo-v1.bin`; earlier "15/6/18" figures were threshold-dependent and are retired) is a *lie the city tells*; it is scheduled fabric repair (§3.5), and until then no content may route the player onto one.
- Ferry fares follow the universal consent law (quote → consent → pay → receipt).
- The rivers have moods with the weather: flood days raise them (Experience EX-24); storm makes them loud (the river ambience layer swells). A river that ignores the sky is a texture, not a river.

### 1.4 Terrain & Ground

**GROUND.** Terrain is analytic, 161×161 heightfield time-sliced at 6 ms/frame; grass is a real system (10,000 tufts with a wind shader, `flora.ts`); roads are draped ribbons with markings (+0.106), kerbs, zebras, and drains as layered geometry (`WorldTerrain.tsx`).

**DOCTRINE.**

- **Law W-6 — The ground never floats.** Every placed thing (stall, lamp, drain, tree, prop, puddle) must read as *sitting on* the terrain. Floating geometry is a fabric bug of the first order (the puddle law: fixed y=0.035 is tolerated only while it is invisible in play).
- Terrain composition follows real Lokoja: flat riverside city, terraced slopes toward Patti, sandy banks near the water. The analytic noise is calibrated, not decorative.

---

## PART II — THE DISTRICTS

The launch city is ten places (`data/locations.ts` — `home`, `kpata-market`, `ganaja-junction`, `confluence`, `mount-patti`, `historic-lokoja`, `government-area`, `university-area`, `food-area`, `transport-area`), each an anchor with real coordinates projected from the OSM layer, plus ten **G2 wards** carrying their real Lokoja ward names. Thirty-two district anchors are wired for activities/travel (`Actors.tsx:259-291`).

Each entry below is a *character sheet for a place*. Content added to a district must serve its character or amend it.

### D1 · Your Place (home)

**GROUND.** The player's anchor and interior (bed, stove, TV, bath, wardrobe hotspots — `interiors.ts`), ₦5,000 Day 1 (`config.ts:14`), the rent book and ownership ladder (`housing.ts`). **Debt (named):** district attribution ended with 0 generic buildings at the home anchor (audit §4.14) — the block around home must be repaired, not ignored.

**Character.** A modest room in a living compound — zinc roof, shared wall, a door that locks. Not a mansion, not a slum: *the first honest rung*. Home is where every player starts equal.

**Architecture.** Compound vernacular: plastered block walls, burglar-proofing bars, a curtain for a door in the cheapest tier, a proper door once earned. Furnishing visibly changes the room (housing law).

**Sound.** The room layer at its softest; compound life through the wall (murmur band); rain on zinc is the signature home sound.

**Rhythm.** Morning: the day's launchpad (stove, bath, wardrobe). Evening: TV and compound gist. Night: the best sleep in the game (comfort bonus — real, `housing.ts`).

**People.** Neighbors (future compound NPCs), the landlord's rent book, the wardrobe.

**Doctrine.**
- W-7: Home is never lost. The rent system may cost face and comfort; it may never produce a dead-end state (Soft Failure).
- W-8: The compound around home must contain at least three neighborly affordances (a bench, a stall, a tree) — home is in a *community*, never an void.

### D2 · Kpata Market

**GROUND.** The commercial heart. **Debt (named, blocking):** the `roadGap < 0.45` stall filter (`layout.ts:1660`) wipes Kpata's stall rows to **zero** (live-computed: STALLS_TOTAL=2, both at Ganaja). The audit ranks this the top world-truth defect. No market feature ships until stalls live here (Experience EX-16.1).

**Character.** The roaring heart of the city — Kpata is *the* market: goods in proud disorder, prices negotiated like music, everything in the world is sold somewhere in these rows. The market's soul is *abundance with hustle*: every stall is someone's living.

**Architecture.** Low, dense, improvised-forever: tarpaulins, awnings, stacked crates, handcarts. The market is *tight to the road* — commerce crowds the kerb because the kerb is where the customers are.

**Sound.** The loudest mix in the game: market layer (lowpass 480 Hz) leading, horns at full, the murmur band at full crowd. Loud enough to hear two streets away — the market *announces* the city.

**Rhythm.** Morning: stalls open one by one, the market wakes in sections. Afternoon: full roar — the market's hour. Evening: thinning, discounts (the night-market bulb strings + discount law exist in code), the last bargaining. Night: a few night rows under bulbs, the market sleeps light.

**People.** Traders who remember you (familiarity), porters, the OK-ride okada men circling for loads, buyers from every district.

**Doctrine.**
- W-9: The stall resurrection is Gate-0-adjacent and blocking (W-law, mirrors EX-16.1).
- W-10: Kpata's density is its truth — no future re-layout may space it into mall-like tidiness. Markets crowd; that is what markets are.

### D3 · Ganaja Junction

**GROUND.** The crossroads district; one of the two live stall rows (2 stalls); the Ganaja roundabout is a bespoke landmark (`CityMesh.tsx`); traffic lights sit nearby (masts rendered, heads unlit — fabric debt, §3.5).

**Character.** The city's elbow — where roads argue and everyone passes through. Ganaja Junction is *movement made visible*: kekes circling, hawkers working the traffic line, the roundabout's constant negotiation. If Kpata is the heart, Ganaja is the pulse.

**Architecture.** Junction vernacular: shops sliced by the road corner, fuel pumps, the roundabout island, hand-painted signage. Buildings lean back from the junction's chaos.

**Sound.** The horns layer's home turf (road-proximity drives it — `ambience.ts:27`); conductor calls and horn language; the traffic's mechanical mumble.

**Rhythm.** Morning: the commute surge. Afternoon: peak horn. Evening: the homeward tide. Night: quieter but never still — junctions sleep last.

**People.** Hawkers, conductors, the vehicle-shop presence (28 u chip), travelers deciding their next ride.

**Doctrine.**
- W-11: The junction is the city's wayfinding heart — its roundabout must stay visible down its approaches (composition protection, same mechanism as W-3).
- W-12: Traffic lights are *promised hardware*: until the heads light, no copy may claim signal behavior (honesty law).

### D4 · The Confluence

**GROUND.** The deck, the flag, the canoe, the boats (`CityMesh.tsx`); the river layer of the ambience bed; stage-99 rows for net-mending and sand-landing (G2 honesty). The sightline law (W-3) anchors here.

**Character.** The city's *soul on display* — where two great rivers marry and the land remembers it. The confluence is contemplative ground: the whole city can be seen being small between two waters. This is the place players screenshot (Experience EX-37, the Confluence Test).

**Architecture.** Minimal and dignified: the deck, the flag, the rail. Nothing crowds the view — the confluence's architecture is the *absence* of architecture. Sand landing piles appear and shift with the river's moods (future).

**Sound.** The river layer (bandpass 850 Hz) leads; the city falls away; water-on-hull, gulls, the deck's wood. The quietest loud place in Lokoja.

**Rhythm.** Morning: fishermen's hour (copy + future activity). Afternoon: tourists and postcards. Evening: *golden hour owns it* — the game's signature amber light on water. Night: the rivers turn ink; the deck is a lamp-lit perch.

**People.** Fishermen, lovers, photographers, elders watching the water, the occasional stage crowd for big moments.

**Doctrine.**
- W-13: The Confluence is a rest space forever — no objectives, no timers, no commerce within the deck's composition (Experience EX-37.2). Generosity happens here; vending happens elsewhere.
- W-14: At all times the confluence offers: one seat, one photographic affordance, one social affordance (EX-12.1).

### D5 · Mount Patti

**GROUND.** The trail, 110 rocks, the tower, the ranger hut, the five secrets (`patti.ts:64-116`); the farm-shift and harvest-market rows live in this district's orbit as stage-99 honesty.

**Character.** The city's crown and its memory — green heights above the tin roofs, cool air, the whole city laid out like a map that breathes. Patti is *effort and reward* in landscape form: the climb is the game's pilgrimage.

**Architecture.** Almost none, deliberately: the tower (view), the Rest House (history), the ranger hut (the hill's keeper), the mast (the modern city's reach). The hill's architecture is the trail itself.

**Sound.** Altitude mix: breeze rises, city thins, birds own the middle, summit is wind-and-silence. Climbing is audibly leaving the city.

**Rhythm.** Morning: cool, long views, the walker's hour. Afternoon: harsh light, thin shade — the honest cost of a midday climb. Evening: the day's best light on the city below. Night: closed to strolls in spirit (the trail is a day place; the city's night belongs below).

**People.** Walkers, courting couples, the ranger, history-minded elders, the occasional picnic.

**Doctrine.**
- W-15: The five secrets are a closed set (Law W-4); each discovery is idempotent forever.
- W-16: The trail's length is doctrine — shortening it for convenience is a Bible amendment (Earned Convenience).
- W-17: Patti's summit composition (both rivers + grid) is protected composition W-3's twin.

### D6 · Historic Lokoja

**GROUND.** The old town anchor; the monument and the suya grill are bespoke landmarks (`CityMesh.tsx`); the colonial chapter is carried by Patti's Rest House and the district's memory.

**Character.** The city's *long memory* — the streets where the colonial chapter happened, where the Niger trade breathed, where the name "Nigeria" is said to have first been spoken over the water. Historic Lokoja carries its past the way a family carries an heirloom: present, worn, discussed, not displayed behind glass. The tone is a resident's honesty — pride and complication together.

**Architecture.** The oldest bones: weathered colonial bungalows with deep eaves, the old administrative mass, courtyard compounds layered over centuries, the monument square. Height stays low; dignity stays high.

**Sound.** A softer, older register: less horn, more murmur; the river audible; church and mosque edges nearby. Historic streets sound like they are *remembering*.

**Rhythm.** Morning: quiet, elders, sweeping. Afternoon: school groups and visitors. Evening: the grill lights — history and suya share a bench. Night: earliest-sleeping district.

**People.** Elders with stories, caretakers, students sketching, the grill master.

**Doctrine.**
- W-18: History is told with a resident's voice, never a brochure's: colonial chapters are remembered with dignity and complication (the Mother Test, EX-38.1, governs every history line).
- W-19: The monument square is protected composition: it may gain context and seating, never vendors' clutter.

### D7 · Government Area

**GROUND.** The civic campus: KGIRS / NEPA / police / EFCC desks wired to CivicPanel (`interiors.ts`, InteriorScene); the GRA gateposts are a bespoke landmark. **Debt (named):** the campus fence/gate has no collider — walk-through (`collision.ts:56-71`).

**Character.** The city's *stately quarter* — wide roads, old trees, the quiet confidence of institutions. GRA is Lokoja at its most composed: manicured edges, gateposts, the hum of officialdom behind fences. Respectful, slightly formal, ultimately *of the people* — the bills paid here keep the city's lights on.

**Architecture.** Institutional vernacular: bungalow offices with deep verandas, flagpoles, fences with gates that mean it, old shade trees planted by someone's grandfather.

**Sound.** The quietest outdoor district: breeze through trees, distant horns, gate radio chatter as texture. Officialdom whispers.

**Rhythm.** Morning: queues form (the civic queue is a real experience — bring a book). Afternoon: the desks grind. Evening: the campus empties early — government keeps city hours. Night: gates closed, lights on poles.

**People.** Clerks, queue companions (the game's best stranger-conversations), guards, the occasional pastor-imam duo arguing kindly about the state of the road.

**Doctrine.**
- W-20: Civic processes are rituals with dignity (queue → desk → stamp → receipt); gamifying them into instant clicks is forbidden — *but* their wait must be honest minutes, never artificial hours.
- W-21: The campus fence is a real boundary: the collider debt is scheduled; until then the gate stands open and *says so* in copy if asked.

### D8 · University Area

**GROUND.** The anchor + Adankolo's orbit (G2: student lodges, the university's first home in the ward's name — `locations.ts:347`); grazing-route and front-yard-league rows as stage-99 honesty.

**Character.** The city's *appetite* — young, loud, ambitious, always mid-argument about the future. The university quarter is Lokoja's engine of becoming: lodges, photocopy shops, suya at midnight, a whole economy of hustle around the lecture hall. Here the future is negotiated daily.

**Architecture.** Student vernacular: tight lodge blocks (face-me-I-face-you energy), hand-painted course notices, kiosks, the campus edge. Everything is temporary-looking and permanent-really.

**Sound.** The youngest mix: argument and laughter, ringtone history (the game's synth grammar keeps it musical, never literal), generator hum as texture (procedural, of course).

**Rhythm.** Morning: the lecture rush. Afternoon: trading between classes — the area's commercial peak. Evening: gist circles, football arguments, night reading under bulbs. Night: the quarter sleeps last and eats latest.

**People.** Students, lecturers known by face (the okada men know them — the ward copy says so), photocopy men, pepper-soup aunts.

**Doctrine.**
- W-22: The university quarter is the *voice* district — its copy is the game's youngest register, and its M13 pathways (school → skills → career) must always be the most visible ladder in the game.
- W-23: Student money is honest money: no gambling-adjacent systems may ever open here (betting shops are a real Nigerian presence and an explicit *never* in this game — see Content Bible red lines).

### D9 · Mama's Food Strip

**GROUND.** The evening stomach anchor. **Debt (named):** 0 stalls survive the filter here (live-computed) — the food strip renders as its street, not its stalls.

**Character.** The city's *kitchen door* — steam, firewood smoke, the hiss of oil, and the best smells in the game (implied by light, sound, and copy: the engine has no smell channel, so the food strip must *overdeliver* in the other senses). Mama's is where the day's money becomes the day's comfort.

**Architecture.** Food vernacular: open-fire sheds, benches that have seen decades, pots the size of drums, stacked crates, bulb strings (the night-market lighting law lives here too).

**Sound.** The sizzle band — cooking as percussion; order-shout call-and-response; the market layer at food-truth volume. The strip is *audibly edible*.

**Rhythm.** Morning: quiet prep — pepper ground, pots set. Afternoon: office takeway hour. Evening: **the strip's hour** — the whole city's appetite arrives. Night: the last warm plates for the late shift.

**People.** Mama herself (the strip's soul), the regulars, the hungry, the broke-but-hungry (the strip's kindness law: EX-29.4 — the cheapest plate is always respectable here).

**Doctrine.**
- W-24: The food strip resurrection is blocked on the same stall law as Kpata (W-9); its stalls must arrive *with* their sizzle mix — a food strip without its sound is a cafeteria.
- W-25: At least one meal at the strip is always within a fresh player's pocket (the ₦ ladder's bottom rung is food).

### D10 · Motor Park

**GROUND.** The transport anchor (`GIG_ORIGIN_ID = 'transport-area'`, `fleet.ts:55`); the travel system's street home; danfo stops are 3D furniture city-wide (`junctions.ts`), but boarding is currently multiplayer-only (audit §4).

**Character.** The city's *lungs* — where every journey begins and ends, named after its noise: the conductor's chant, engines idling in ranks, the argument over twenty naira that ends in laughter. The park is organized chaos in the specifically Nigerian way: no signage, total order.

**Architecture.** Park vernacular: shade sheds, ranks of waiting vehicles by route, wooden tables of ticket boys, hand-painted route boards, the mechanic's corner at the edge.

**Sound.** The most *verbal* mix: conductor chants (procedural cadence, not recordings), engine idle ranks, the horn language of departure. The park is the horns layer's other home.

**Rhythm.** Morning: the great departure. Afternoon: steady churn. Evening: the last full loads, prices creeping with dark. Night: skeleton ranks, night routes only.

**People.** Conductors, drivers, ticket boys, loaders, the park mama who fixes every dispute, travelers waiting with their bags and their stories.

**Doctrine.**
- W-26: The park is where the travel system *must* feel most alive: ambient danfo/keke boarding (currently decorative-only, 14 unhailable rigs — audit §4.6) is the named horizon; the park's truth depends on it.
- W-27: Fares are never silently metered: the conductor announces, the player consents (universal fare consent law).

### 2.1 The G2 Wards — the city's honest breadth

**GROUND.** Ten wards with their real Lokoja names (`locations.ts:340-574`): **Adankolo · Ewoziri (emiwoziri) · Filele · Numai · Kpatakpoli · Kpato · Township Stadium · Maigari Palace · Pati Ridge Hill · Sokamms Motel.** Each carries a district claim into the CHAOS zone system, an honest description, and activity rows stamped `stage: 99` (a *declared* unbuilt state — the honesty law, not a lie). Most launch-district activities beyond the ten anchors also declare their stage.

**Character.** The G2 wards are the city's *breath* — where Lokoja stops being a curated itinerary and becomes a spread of neighborhoods. Adankolo squeezes student lodges between family compounds; Filele and Kpatakpoli run the long roads toward the water and the farm belt; the Maigari's palace grounds hold the city's traditional heart; Township Stadium is the city's roar; Sokamms Motel is where travelers sleep.

**DOCTRINE.**

- **Law W-28 — Real names only.** G2 ward names are the community's own names, taken with respect. They are never renamed, "improved," or re-spelled for aesthetics.
- **Law W-29 — Stage honesty.** A ward with `stage: 99` rows presents its locked activities as *honest future* ("arrives with a later stage"), never as broken or fake. The stage system is the city's truth-in-advertising.
- **Law W-30 — Promotion, not decoration.** A G2 ward is promoted toward play only through the Content Bible's district playbook (wired affordances, ambience mix, anchor activity, description) — a ward that only gains props has been decorated, not promoted. The G2 gate order is: *name → description → ambience → one wired activity → anchor*.
- The ward copy already written is canon: Adankolo's okada men knowing a lecturer by face is exactly the register (specific, warm, true-sounding). New ward copy passes the Mother Test before it ships.

---

## PART III — THE FABRIC
### *Roads, junctions, drains, lamps — the city's circulatory system.*

### 3.1 The Road Network

**GROUND.** 2,655 ways / 5,894 segments / **750.4 km of real Lokoja roads** decoded from `geo-v1.bin` (60,071 B) into draped ribbon geometry with markings, kerbs, zebras (`WorldTerrain.tsx:499-662`, `CityMesh.tsx:71-160`; 2,656 ribbons render = 2,655 ways + the Patti trail, `ROAD_RIBBONS`). Only **19 distinct OSM names across 29 named ways** — the wayfinding load rests on the 32 anchors and the landmark silhouettes (W-41), which is why they are law. Five traffic loops exist; **three carry rigs** (loops 0/1/2 — `TRAFFIC_MIX`, `Actors.tsx:749`; loops 3/4 have tables, zero rigs — audit §4.4). **Stale-header debt:** `layout.ts:7` still claims "3,000+ ways, ~930 km" — a fossil comment; the binary and `geo.ts` are the truth.

**DOCTRINE.**

- **Law W-31 — The ribbon is the truth.** Roads follow the OSM layer; no road may be nudged for aesthetics. Beauty comes from dressing, not from bending.
- **Law W-32 — Fabric honesty budget.** The known fabric debts are named and scheduled, never normalized: 72% of way-endpoints dead-end; **23 unbridged segments cross a river centerline, 3 more sit within a river's half-width** (the reproducible v2.1 measure — see W-5 and §3.5); school-yard clips leave open ribbon holes; no end caps. Each is a *lie the city tells* — repair is World Bible work, tracked in the debt ledger (§3.5). New content must not route the player onto fabric lies.
- **Law W-33 — Loops earn their rigs.** Traffic loops 3/4 may not carry "traffic" until rigs are budgeted (Content Bible caps); an empty table is fine, a fake-feeling flow is not.

### 3.2 Junctions, Signals & Bumps

**GROUND.** **12 signal heads placed** (cap `LIGHT_CAP = 14`, `junctions.ts:46`, placement `:168-212`); the phase law is GREEN 12 s → AMBER 3 s → RED 15 s (30 s cycle, `junctions.ts:52-54`); **6 speed bumps placed** (cap `BUMP_CAP = 12`); danfo stops placed as street furniture. **Debt (named):** light heads are unlit — the hardware exists, the behavior is not rendered (`CityMesh.tsx:1358`).

**DOCTRINE.**

- **Law W-34 — The phase law is one truth.** When light heads render, they *must* render the existing phase law (12/3/15) — the simulation already believes it; the picture will catch up to the simulation, never the reverse.
- **Law W-35 — Junctions are drama without danger.** Bumps, phases, and merges create *rhythm* (the driving feel), never damage. There are no crashes in Lokoja (Soft Failure; see Content Bible red lines).

### 3.3 Drains, Lamps & Street Hardware

**GROUND.** Drains are real geometry (204 live; cap 1,800) — 204 gutters is also a *truth of Lokoja's seasons*: open drains are part of the city's rain story. Lamps: 492 rendered (cap 1,500), sodium pools at night. Plates: unique by DMV law (post-ERA I). Kerbs, zebras, catenary props: present.

**DOCTRINE.**

- **Law W-36 — Hardware serves the seasons.** Drains exist *because of rain* — rainy-day copy and future drain-flow effects reference them; the gutters are the rain's stage machinery.
- **Law W-37 — Light pools are composition.** The sodium lamp law (Art Bible) makes night streets *readable islands*: content placed at night must sit in or near a pool, or justify its own light.
- **Law W-38 — Plates are identity.** A plate is forever unique (DMV wall + `@unique`); plates are the city's fingerprint registry — future systems (parking, parks, checkpoints) read plates, never invent them.

### 3.4 Bridges & Water Crossings

**GROUND.** 16 bridges in the geo layer; the river block with bridge-deck exception is collision law.

**DOCTRINE.** Every bridge is a *place* (a view, a crossing moment), not just a road over water. Future landmark content may dress crossings; W-5 (bridges are promises) governs: if it renders, it carries.

### 3.5 The Fabric Debt Ledger

Named, ranked, and honest — these are the repairs the city owes its own truth (all audit-verified):

| # | Debt | Truth broken | Where |
|---|---|---|---|
| 1 | Kpata + food-area stall resurrection | The commercial heart renders empty | `layout.ts:1660` filter |
| 2 | 23 unbridged road segments cross a river centerline; 3 more lie within a river half-width (reproducible re-decode; the "15/6/18" era is retired) | Roads that drown | geo layer dressing |
| 3 | 72% dead-end way-ends | Suburbs that go nowhere | geo layer + rim logic |
| 4 | Unlit signal heads | Hardware with no behavior | `CityMesh.tsx:1358` |
| 5 | Civic fence walk-through | Boundaries that aren't | `collision.ts:56-71` |
| 6 | School-yard clip holes | Fabric with gaps | school mesh |
| 7 | Traffic loops 3/4 empty | Promised flow, no flow | `Actors.tsx:749` |
| 8 | Home anchor 0 generic buildings; stray house in christfield-school yard | District attribution lies | layout attribution |

**Law W-39 — Debts are never silently normalized.** No copy, quest, or system may be written that *pretends* a debt doesn't exist (e.g., a quest sending the player down an underwater road). Debt work follows the Content Bible's Definition of Done.

---

## PART IV — THE BESPOKE LANDMARKS

Twelve hand-built landmarks exist (`CityMesh.tsx`): **Confluence Deck + flag + canoe · Patti Tower + ranger hut · Ganaja roundabout · suya grill · the monument · GRA gateposts · Lugard Rest House · Town Stadium · Central Mosque · Church Hall · the boats.** **Debt (named):** none carry handlers — E on any opens the generic location sheet (audit §4.5).

**DOCTRINE.**

- **Law W-40 — A landmark is a promise of meaning.** Each of the twelve gets, in time, its own *one true interaction* (the deck seats you; the roundabout tells you where you are; the grill feeds you; the monument remembers; the mosque and church receive you quietly; the stadium roars). Until wired, each stays honest (generic sheet, no fake claims).
- **Law W-41 — Landmarks are wayfinding anchors.** Every landmark is visible from at least two districts' approaches (silhouette-first, Art Bible); the player learns the city by its twelve shapes before its street names.
- **Law W-42 — Sacred and civic landmarks get equal craft.** The mosque and the church hall are twins in budget, care, and dignity (EX-19.2); the stadium and the deck are twins in communal joy.

---

## PART V — NATURE

### 5.1 The Tree Guild

**GROUND.** 720 trees across 10 species (`TREE_CAP = 720`, `flora.ts:115`; `SPECIES_IDS`/`SPECIES_META` from `flora-species.ts`), instanced with a wind shader; species placement obeys spacing and guild laws. The 2026-10-21 stand: neem 181 · mango 227 · cashew 94 · shea 92 · acacia 54 · plantain 45 · raffia 16 · oilpalm 6 · iroko 3 · baobab 2. **Debt (named):** `layout.TREES` (700 legacy trees) computes at import with zero render consumers — dead compute, ~0.4–0.8 s of world-boot (audit §4); flora's guild is the real forest.

**DOCTRINE.**

- **Law W-43 — The guild is calibrated, not random.** The guild calibrates toward Lokoja's real green: neem in the older quarters, mango and cashew near homes, shea and acacia at the edges. Locust-bean and citrus are *future* species — admitted only through the flora-species register (a Bible amendment), never by a content PR. A species list change is a Bible amendment (flora-species is the register).
- **Law W-44 — Trees are shade, and shade is architecture.** Every gathering place (neem trees per the Constitution) earns its shade: sitting spots, conversation geometry (EX-33.4). Trees exist for *life under them*, not for skyline garnish.
- The legacy TREES array dies in the boot-diet work (Gate 0 adjacent) — the guild is the only forest.

### 5.2 Grass, Rocks & the Ground Layer

**GROUND.** 10,000 grass tufts with wind (`GRASS_TUFTS`), moisture-gradient placement (the layout.GRASS law reborn); 110 Patti rocks; flowers (≤72 dots consumer — a known thin spot).

**DOCTRINE.** The ground layer reads seasons (harmattan dusts the grass; rain greens it — future weather-law coupling). Rocks are Patti's bones — they never spawn in city streets.

### 5.3 Wildlife

**GROUND.** Birds exist (3 flocks, 18 birds, day-only — confluence 7, Patti 6, market 5, `Actors.tsx:1111-1171`); goats, lizards, and the rest are not yet simulated (they live in copy only — `locVibes.ts`).

**DOCTRINE.**

- **Law W-45 — Wildlife is texture with rights.** Animals in Lokoja are *residents*: birds own the sky and the Patti middles; goats have right of way in the streets (they always did). No animal is ever a target, a collectible, or a mechanic — they are neighbors (Constitution: the city is a place, not a system to optimize).
- Adding species follows the Content Bible's NPC playbook with a "wildlife" profile: ambient motion, no interaction capture, no economy.

---

## PART VI — SKY & SEASONS

### 6.1 The Clock

**GROUND.** Four slots — morning, afternoon, evening, night (`config.ts:192`); night is always night-clear (`world.ts:31-34`); `advanceClock` is the one true clock-advancing function (`world.ts:39-51`); the absolute slot is `(day-1)×4 + slot`.

**DOCTRINE.**

- **Law W-46 — One clock, one hand.** All time passes through `advanceClock`. No system may keep private time. (The 4-slot law is engine truth and creative doctrine: slot poetry over clock bureaucracy, EX-21.3.)
- **Law W-47 — Night is a different city.** NPC 12→4, sodium pools, headlight cones, the crickets' band — night content must be authored *for* night, never tinted from day.

### 6.2 The Seven Skies

**GROUND.** `Weather = 'sunny' | 'cloudy' | 'rain' | 'night-clear' | 'harmattan' | 'storm' | 'flood'` (`types.ts:289`); weighted daily draw with rarity law — harmattan, storms, and flood days are *rare, dramatic days the whole city feels* (`config.ts:194-196`); 620 rain particles, DustHaze, puddles, flood veil (`polish.tsx`).

**DOCTRINE.**

- **Law W-48 — Every weather touches four systems.** Audio mix, crowd behavior, economy (prices/copy), and travel guards (the flood guard is real, `useGameStore.ts:3503-3604`) — weather that skins without touching is forbidden (EX-22.1).
- **Law W-49 — Rarity is drama.** The weather weights are Bible-amendment-locked; storm/flood/harmattan keep their event status. The flood is the city's humility — routes close, nobody drowns (EX-24.4).
- Flood days raise the rivers *visibly* (the veil today; waterline honesty is the horizon). The city's response — sandbags, ferries working, market rows moving uphill — is content duty, not weather duty.

---

## PART VII — THE LIVING CITY

### 7.1 The People (NPC truth & the crowd horizon)

**GROUND.** 12 NPC strollers across 13 zones (`NPC_COUNT = 12`, `Actors.tsx:356`; night 4), with familiarity, favors → real hustle offers, gifts, hangouts, and gist chips (talk 4 u, chip 24 u). Ambient traffic: 14 rigs; **7 parked cars** (`PARKED_VEHICLES`, `vehicles.ts:940` — decorative, static visual-only rigs, `Actors.tsx:1007-1010`).

**DOCTRINE.**

- **Law W-50 — Few but true beats many but fake.** Every future NPC is *someone*: a name, a corner, a rhythm, a memory of you. The city grows people the way neighborhoods do — one at a time, each known. Crowd AI may add *bodies* (market bustle first, per EX-16), but *characters* stay hand-authored under the Content Bible's NPC playbook.
- **Law W-51 — NPCs are not content dispensers.** They are neighbors with lives that intersect yours (familiarity → favors → friendship). No NPC exists to hand out tasks like a vending machine; work offers come *through relationship* (the familiarity law that already exists).

### 7.2 Economy Geography

**GROUND.** 21 jobs (`data/jobs.ts`), 20 hustles (`data/hustles.ts`), 4 job-board POIs, market/biz tills, the three money surfaces (bank debt — Experience EX-20), rent book and housing ladder, meals by key (`MEAL_BY_KEY`).

**DOCTRINE.**

- **Law W-52 — Work lives at places.** Every job/hustle is anchored to a district that fits its trade (the mechanic at the park's edge, the fisher at the confluence's orbit). Economy is *geography*: where money is made and spent tells the city's story.
- **Law W-53 — The ₦ ladder is a map of the city.** Cheap comfort (food strip, keke) and big money (vehicles, property, biz) must be reachable through honest work in honest places; no district is money-locked.

### 7.3 Institutions

**GROUND.** Schools (12 sites · **88 school doors** · 88 rooms, **20 interior builders**, `schools.ts`); city-wide the door census is **98 doors = 10 layout + 88 school** (`ALL_DOORS`, `schools.ts:1761`), with 98 registered interiors and **103 interior spaces** once the 5 doorless G2 rooms are counted (`INTERIORS` + `DISTRICT_INTERIORS`), civic desks (KGIRS/NEPA/police/EFCC → CivicPanel), the bank (teller → BankPanel in a real bank building — the healthiest interior path), the clinics' orbit (no dedicated hospital interior yet — a named horizon). **Built but doorless (named horizon):** five G2 rooms — the Maigari palace hall, stadium office, Sokamms room, Adankolo reading room, Emiwoziri fish shed — are schema-valid and registered, excluded from the door array pending their exterior pins (the one-door law, `interiors.ts:758-768`); they are the next rooms, not decoration.

**DOCTRINE.**

- **Law W-54 — Institutions are the city's spine, rendered with dignity.** A hospital interior arrives when it can be *honestly* a hospital (Soft Failure: it is where the bad day gets better, never where the game ends — EX-40).
- **Law W-55 — The school system is M13's home ground** (EX-17.3): age-band law identical in-world and on the wire, forever.

### 7.4 Religion

**GROUND.** Central Mosque and Church Hall as bespoke landmarks (W-42 twins); prayer times in the city's rhythm; the hush doctrine (EX-19).

**DOCTRINE.** Faith is *atmosphere and community*, never mechanics: no worship stats, no buffs, no gates (EX-19.1/19.4). Both houses get identical craft. The call to prayer is handled by the Audio Bible's most careful chapter — atmosphere, distance-true, ignorable with respect.

### 7.5 Food Culture

**GROUND.** Meals by key (stove + strip), needs law (`needs.ts`), the evening strip's hour (D9).

**DOCTRINE.** The food ladder is a class ladder told with kindness (EX-29.4): the cheapest plate is always respectable. Foods follow the Content Bible playbook (name it truly, price it honestly, place it rightly — no invented "exotic" dishes; the Mother Test governs every plate).

### 7.6 Music & Sound of the City

**GROUND.** 100% procedural audio — zero audio assets in `public/`; the 8-layer ambience bed (`ambience.ts:37-106`: breeze, river, market, rain, room, crickets, horns, zinc); the afro-fusion music engine (`music.ts` — C major pentatonic, kalimba lead, the afro kick on 0/7/10, 16-step bars).

**DOCTRINE.**

- **Law W-56 — The city's sound is its census.** Districts are identifiable with eyes closed (EX-7.3); the ambience mix is a *function of who is around*: market rows, river bends, junction horns, compound rooms. New districts ship with their mix or they don't ship.
- **Law W-57 — Procedural forever.** The zero-asset audio law is a creative law, not just a budget law (Art & Audio Bible, Audio Identity): the city's sound must remain *generated from the city's own parameters*.

### 7.7 Language & Voice

**GROUND.** Copy registers: the Verdict Voice (refusals), ward descriptions (Adankolo's register is canon), NPC gist, street wry.

**DOCTRINE.**

- **Law W-58 — The street's grammar or silence.** Names, greetings, and figures of speech follow the real Lokoja mix (English with Nigerian cadence, Hausa/Igala/Ebira/Yoruba seasoning where true). Fake pidgin and translated-from-English formality are both forbidden (EX-38.2). The Content Bible's copy playbook owns the register table.
- **Law W-59 — One voice, many mouths.** Every text the game speaks is the same narrator with different mouths (the Verdict Voice + district registers). A system that ships its own tone is a Bible amendment.

### 7.8 History

**GROUND.** Lugard Rest House (Patti), the monument, Historic Lokoja's register (D6); the naming lore at the summit stone.

**DOCTRINE.**

- **Law W-60 — Remembered, not exhibited.** History is delivered the way a city remembers: in conversation, in places, in weather-worn stones — never in museum panels or lore dumps. Each historical site carries *one honest paragraph* (the Patti secrets' pattern) and the Mother Test's dignity.

### 7.9 Transportation

**GROUND.** Vehicle kinds: okada, keke, taxi, danfo (`types.ts:227`); transport modes: walk, keke, taxi, own-okada/keke/taxi/danfo (`types.ts:292`); the fare law (base + distance rate, rounded, `travel.ts:70-73`; per-location modifier); the ferry (`rivers.ts`); danfo stops; the park (D10); postcards as the only sanctioned teleport (`teleport.ts` — story-true share codes).

**DOCTRINE.**

- **Law W-61 — Every transport is a culture, not a speed.** Okada = the people's zip; keke = the family's tin can; taxi = the negotiated city; danfo = the long road's chorus; ferry = the river's patience. Vehicle additions must bring a *culture* (sound, fare tier, social contract), not just a mesh (Content Bible vehicle playbook).
- **Law W-62 — Teleport is bought with story.** The only instant travel in Lokoja is the postcard (`/t/[code]`) — a shared memory, not a convenience. Any future fast-travel must pay a story/fare price first (Earned Convenience) and amend this Bible.

---

## PART VIII — TIME

### 8.1 The Daily Rhythm (the city's day, slot by slot)

| Slot | The city | Outdoors | Commerce | Sacred | Sound |
|---|---|---|---|---|---|
| **Morning** | Waking, sweeping, the commute | Walkers, joggers at Patti's foot, queues forming at GRA | Kpata opens in sections; food strip preps | First prayers; church bells' day off | Breeze + early horns, market layer rising |
| **Afternoon** | Full tilt — the working heat | Harsh light, thin shade, hawkers at junctions | Kpata's roar; parks churn | Midday quiet at the mosque | Horns at peak; murmur at full |
| **Evening** | Homecoming, the golden hour | The strip's hour; the deck's hour; gist circles | Evening discounts; last full loads | Evening prayers; fellowship | Amber mix — zinc settling, sizzle band |
| **Night** | The city goes home (NPC 12→4) | Sodium pools, headlight cones, late gists | Night rows under bulbs only | Night's hush | Crickets own the bed; horns thin |

**Law W-63 — The rhythm is canon.** Systems that ignore it (a 24-hour market, a midnight civic queue) break the city's truth. Night commerce is *night rows*, not day rows in the dark.

### 8.2 The Seasonal Rhythm

The rare skies (W-49) mark the year: harmattan's dust weeks (the pale sun, the cold mornings), the storm builds, the flood's humility days. The calendar year is **72 days** (`yearDays`, `config.ts:658`); **ten festivals** recur on it, among them Ramadan's drifting night market and Detty December (`calendar.ts:159-173`; Content Bible festival playbook — crowd + sound + signed economy + dress, all four or none, EX-25.1). **Law W-64 — Seasons are felt in the body:** each season changes at least one meal, one price, one activity, and one sound in the city.

---

## PART IX — PLACE LAWS (summary)

1. **W-1 Geography is law** — real OSM, real names, no invented land.
2. **W-2 One truth, two renderings** — map and world agree.
3. **W-3/W-17 The Sightline** — the confluence and Patti summit views are protected forever.
4. **W-5 Bridges are promises** — if it renders, it carries.
5. **W-6 The ground never floats.**
6. **W-9 The stall resurrection is blocking** for market/food features.
7. **W-28–30 Real names · stage honesty · promotion over decoration.**
8. **W-31–39 Fabric honesty** — roads follow OSM; debts are named, never normalized.
9. **W-40–42 Landmarks promise meaning, anchor wayfinding, get equal craft.**
10. **W-43–45 Nature is residents** — the guild, the shade, the wildlife's rights.
11. **W-46–49 One clock · night is another city · weather touches four systems · rarity is drama.**
12. **W-50–51 Few but true** — NPCs are neighbors, not dispensers.
13. **W-56–59 Sound is census · procedural forever · the street's grammar · one voice.**
14. **W-60 History remembered, not exhibited.**
15. **W-61–62 Transport is culture · teleport is bought with story.**
16. **W-63–64 The rhythm is canon · seasons are felt in the body.**
17. **The Foundation Laws bind the place too** (EX-44 → EX-47, C-19 → C-21): memory, human scale, consequence, truth over spectacle, performance-before-expansion, AI citizens, cultural respect.

### Appendix — The City Quick Sheet (disk truth)

| Fact | Value | Anchor |
|---|---|---|
| Real roads | 2,655 ways / 5,894 segs / 750.4 km (+ Patti trail = 2,656 ribbons) | `geo-v1.bin`, layout |
| Rivers / bridges | 16 / 16 · confluence vertex-exact 0.00 u | geo layer |
| Scale | 1 u = 26 m · ≈16 km across | `geo.ts:7-38` |
| Launch places | 10 anchors · 32 district anchors wired | `locations.ts`, `layout.DISTRICTS` |
| G2 wards | 10 real wards, stage-honest | `locations.ts:340-574` |
| Trees / grass / rocks | 720 / 10 sp · 10,000 tufts · 110 | `flora.ts:115`, layout |
| Lamps / drains / lights / bumps | 492 / 204 / 12 placed (cap 14) / 6 placed (cap 12) | junctions, layout |
| Calendar | 72-day year · 10 festivals | `config.ts:658`, `calendar.ts:159-173` |
| Clock / weather | 4 slots · 7 skies | `config.ts:192`, `types.ts:289` |
| Ambience layers | 8, procedural (the audio bed; zero audio assets) | `ambience.ts:99-106` |
| NPCs / rigs / parked | 12 (night 4) / 14 on loops 0–2 / 7 decorative | `Actors.tsx:356,749`, `vehicles.ts:940` |
| Jobs / hustles / boards | 21 / 20 / 4 | `data/jobs.ts`, `data/hustles.ts` |
| Doors / interiors / spaces | 98 doors (10 + 88 school) · 98 interiors · 103 spaces | `schools.ts:1761`, `interiors.ts` |
| Patti secrets | 5, idempotent | `patti.ts:64-116` |
| Vehicles / modes | 4 kinds · 7 modes · ferry | `types.ts:227,292` |
| Money | ₦5,000 Day 1 · pocket + purse · v20 save | `config.ts:14`, `save.ts:45` |

This sheet is the shared vocabulary of every Bible. When a number here changes, all four documents are amended together.

---

## PART X — THE LIVING CONSTITUTION LAYERS
### *Added in the ERA II upgrade (v2.0). The place, instrumented.*

### 10.1 Implementation Reality

**What exists today (disk-verified 2026-10-21, second pass):** 2,655 OSM ways / 5,894 segments / 750.4 km (plus the authored Patti trail → 2,656 rendered ribbons, `ROAD_RIBBONS`) · 16 rivers / 16 bridges, confluence vertex-exact (0.00 u — the `niger` and `benu` ways share the identical vertex (−3, 172.3)) · 32 district anchors (10 launch places + 10 G2 wards + 12 school sites) · analytic terrain with a reachable, authored Patti summit (5 secrets, 110 rocks, the +30 u mound, `layout.ts:625`) · 204 drains / 492 lamps / 12 signal heads (unlit) / 6 bumps placed · 720 trees in 10 species / 10,000 grass tufts / 3 bird flocks (18 birds) · **98 doors (10 layout + 88 school) + 5 built-but-doorless G2 rooms = 103 registered interior spaces** · 21 jobs / 20 hustles / 4 boards / 14 named NPCs / 12 strollers (night 4) + 14 traffic rigs + 7 decorative parked cars · 72-day year, 10 festivals · 7 skies, 4 slots · 1 u = 26 m, confluence origin-true.

**What is planned (the honest horizon):** the stall resurrection (W-9, with count assertions) · lit signal heads on the existing 12/3/15 phase law (W-34) · exterior door pins for the five G2 rooms · loop 3/4 rigs or their deletion (W-33) · NPC event memory (EX-44) · the fabric ledger's repairs (§3.5, in order) · flood waterline honesty beyond the veil · river moods deepening.

**What is forbidden:** invented geography (W-1) · decorative dressing without wiring (C-1) · content routed onto known fabric lies (W-39) · anything above knee height in the protected sightlines (W-3/W-17) · renaming or re-spelling the community's wards (W-28) · a swimming body in the rivers until a full amendment with doctrine exists (W-3).

### 10.2 The Verification Layer

| Laws | Verification method | Responsible system | Failure condition |
|---|---|---|---|
| W-1, W-31 | Every new way traces to the geo pipeline; no nudged ribbon | `geo-gate.ts`, pipeline | invented or bent geometry |
| W-2 | Map↔world parity spot checks per district | `locations.ts`, MapScreen | a pin without a place (or reverse) |
| W-3, W-17 | Deck + summit screenshots at golden hour | composition review | occlusion above knee height |
| W-5, W-32 | Bridge/segment walk: rendered crossings carry; debt ledger walked each release | collision, §3.5 | a routed underwater road; a normalized lie |
| W-6, W-9 | Ground walk (nothing floats); stall count assertion | `test-world3d.ts` | floating prop; stall wipe (kpata = 0) |
| W-28 → W-30 | Ward list vs register; stage-99 copy check; gate-order audit | `locations.ts`, Content P3 | renamed ward; decoration promoted |
| W-33 → W-35 | Loop rig audit; phase law 12/3/15 vs rendered heads | `junctions.ts`, Actors | fake flow; phase drift; crash mechanics |
| W-38 | Plate uniqueness query | schema `@unique` | a duplicate plate |
| W-46, W-47 | Clock walk (only `advanceClock`); night census check | `world.ts`, Actors | private clock; day-tinted night |
| W-48, W-49 | Four-system weather check; weight drift audit | weather weights, guards | wallpaper weather; FOMO skies |
| W-50, W-51 | NPC roster: every NPC has corner + rhythm + memory line | NPC register | a dispenser NPC |
| W-56, W-57 | Eyes-closed district test; zero-asset scan | ambience tables, CI sweep | silent district; a sample sneaks in |
| W-58 → W-60 | Copy register read-through; one-paragraph history check | copy register | fake pidgin; brochure voice |
| W-61, W-62 | Vehicle culture sheet; teleport audit | transport register | mesh-only vehicle; free fast travel |
| W-63, W-64 | Rhythm table vs systems; seasonal meal/price/sound check | calendar, seasons | a 24-hour market |

### 10.3 The Production Layer

**"How do I build in this city without breaking it?"**

- **Boot order first:** `geo-gate.ts` gates every layout-family module — nothing in that family may evaluate before `initGeo()`; a careless new import silently empties the world.
- **Terrain:** `heightAt` is an equality law (grid == brute force). Terrain-touching code drinks from the grid, never re-derives; placed things sit at ground truth (W-6).
- **A building:** door id joins the location namespace · interior with ≥ 3 wired hotspots · wash family · room parameters · sightline check · both-way exit test (Content P2).
- **A district:** the G2 gate order — name → description → ambience → one wired activity → anchor (W-30) — with its mix and wash, or nothing.
- **Nature:** the flora-species register + caps (720 trees / 10,000 tufts / 110 rocks); wildlife follows the wildlife profile (W-45).
- **The one-door law:** door meshes are pinned one-per-INTERIORS-entry by `scripts/test-world3d.ts`; a room without its pin stays doorless by design (the five G2 rooms are the standing pattern).
- **Every world PR** ends with the fabric walk (§3.5) and the caps check (Content §6) — measured, not assumed.

### 10.4 The Future Scale Layer

- **More city:** growth enters through the OSM pipeline (geo binary versioning + the gate), never hand-placed roads; the binary format is the scaling seam.
- **More life:** crowd systems may add bodies to markets first (EX-16's bustle law); the nation-sim kernel (10k NPCs off-thread) is weather, not cast (C-20).
- **More river:** flow physics, flood waterlines, and swimming remain amendments with doctrine — the rivers are characters before they are fluid simulations.
- **More players:** presence stays street-scoped; the roster fan-out must go district-scoped before nation scale (a named debt).
- **The soul clause:** every scale-up passes W-50 — few but true beats many but fake — and the Ten-Year Test: a player from today must recognize this city in ten years. The answer stays yes only if the anchors, the sightlines, and the names never move.



