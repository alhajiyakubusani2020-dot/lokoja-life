# LOKOJA LIFE — WILDLIFE BIBLE
### The named ecology reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends Part IV of `Environment_Bible.md` (binding) with
> the full species evidence. Evidence: `research/phase3/team-7-audio.md` §2a (Adang et al. 2018 bird
> census — Red Team verdict q), `team-1-geography.md` (vegetation, hydrology), `team-5-culture.md`
> (Donkwo fishing festival), team-7 (guard dogs, NG), repo anchors (`world3d/flora-species.ts:24-31`,
> Actors wind shader, grass tufts). Extensions are marked **[EXT]**.
>
> **The question this book answers:** what lives in this city — plants, birds, fish, animals — and
> what may the engine show without inventing?

---

## PART I — THE ONE-PARAGRAPH TRUTH

Lokoja is a green river confluence with a forested hill, 108 documented bird species over the game's
own districts, egrets commuting at dawn, kites on thermals, doves on wires, river fish busy in trade
yet scarce on plates — and NO megafauna. The vegetation palette is riverine palms at the water,
mangoes in compounds, acacia/neem/shea upland, and the hill wearing forest all year.

## PART II — THE BIRD CENSUS (the peer-reviewed core)

**Adang et al. 2018** (peer-reviewed, Red Team verdict q: docslib fetch verified text): **108
species / 43 families** surveyed Nov 2016–Feb 2018 AT THE GAME'S OWN DISTRICTS — Mount Patti, Kpata
old market, Ganaja ferry site, FUL Adankolo + Felele, Old Polytechnic quarters, Lokongoma Ph II.
Family counts match the paper (Estrildidae 9, Sylviidae 9…). This is the single strongest ecology
fact in the corpus: the game's skies can be populated with district-true species.

**The audible 4-voice palette** (Audio_Bible I.1 binding): finch chitter / dove coo / plantain-eater
crackle / turaco knock — dawn chorus gain ×0.4 inside the chorus window (06:20–07:30).

**GBIF additions** (team-7 file, bird-census context): Egyptian plover on confluence sandbars (10 records), yellow-billed
kite, western plantain-eater, laughing dove, pied crow. **Visible-fauna law:** egrets commuting at
dawn, kites riding thermals, doves on wires, crows at market; **no invented megafauna — no source
for large mammals in the city; none built** (Environment IV.3).

## PART III — THE FLORA GRAMMAR (02 §1.3 + Environment IV.2 binding)

| Zone | Species law | Source |
|---|---|---|
| River's edge | oil palm + raffia hard against water ("leaning river palm") | team-1 §2.6 + visual m1 |
| Compounds | mango (the compound tree) | team-1 + zinc1 |
| Upland savanna | neem, acacia, shea | team-1 |
| Wet hollows | banana/plantain (zinc1 evidence) | team-8 |
| Farm edges | cashew, palm, yam, cassava, rice, melon | Kogi agriculture |
| Mount Patti | deep forest-green slopes ALL YEAR — "savanna = brown" is FALSE for the hill | visual m1 (S7 law) |

**Repo contract:** the 10-species set (`flora-species.ts:26-31`) stands; `aLeaf` weather-gold mask
(`flora-species.ts:24`) is the seasonal switch — dry gold-brown ground layer vs rainy saturated
green; the hill stays green. Placement grammar is the upgrade, not new species (no invented flora;
GBIF Kogi is insect-dominated — the wild-tree survey debt stands, MED, Dossier III.6).

## PART IV — RIVER LIFE & THE FISH TENSION (X12 held by design)

Busy freshwater trade at Kpata (fishmongers 18–55, study c.2013) AND "abundant rivers, scarce fish"
(Aug 2026 feature) — both true, both modelled: crowded fish stalls, high fish prices, and the
Donkwo Fishing Festival identity (Mar/Apr window). Egyptian plover appears as sandbar context only.
Fisheries dressing: fishermen launching pre-dawn (05-A hour law), canoe fish-trade props, "point &
kill" grilled fish identity (World_Expansion VIII.2 P1).

## PART V — THE ANIMALS OF THE COMPOUND & STREET [EXT]

1. **Guard dogs are the night soundscape** (team-7: guard-dog culture, NG-labelled LOW): rare burst
   events 04:00–05:00 in the audio hour map — the compound's honest security texture.
2. **Goats, rams, chickens** = compound-street texture; the ram market (Eid family, ₦700k–1.4M rams
   2026) is the one sourced livestock economy event (World_Expansion VII.2).
3. **Insects own the night:** crickets 22:00–05:00; frogs own rainy nights; cicadas in the heat lull
   (Audio_Bible III.2). No inventing species-specific calls — synth from family-true formants.
4. **What never appears:** large mammals, reptiles beyond ambient-dressing scale, zoo animals, any
    species without a source row above. Absence is the law (Environment IV.3).

## PART VI — ECOLOGY AS SYSTEMS [EXT — couplings]

1. **Season ↔ vegetation:** `aLeaf` gold switch + grass tuft desaturation in dry; saturated green
   in rain; the hill exempt (S7).
2. **Water ↔ birds:** river rise/fall shifts sandbar shorelines — egret/plover dressing follows the
   `waterLevel` scalar's edges (Environment II.1 coupling).
3. **Weather ↔ sound:** dawn chorus inside clear/harmattan mornings; rain mutes songbirds (×0.6 —
   design target, unsourced);
   the 22:00 night-law trim hands the city to insects (S12/S7).
4. **Flood ↔ ecology:** flood days push egrets to compound rooftops, bring river mud smells into
   dialogue vocabulary (World_Expansion IX.2) — dressing, not simulation.

## PART VII — HONEST GAPS

Wild-tree survey ground truth (GBIF Kogi insect-dominated — MED debt) · bat colonies unverified ·
firefly seasonality unverified (no source — none built) · harmattan bird-behaviour shifts
unverified · Egyptian plover call (no source; context-only, never voiced).

## PART VIII — GATES

1. Every rendered/audible species traces to §II–V rows; a species without a row is a bug.
2. Dawn chorus window audibly peaks 06:20–07:30 with the ×0.4 gain law (Audio gate).
3. The hill renders green in every season; the ground plane cycles gold↔green with `aLeaf`.
4. Sandbar-visible bird dressing shifts with river width between low and peak months (screenshot
   pair, same camera — Environment VII.6).
5. No megafauna, no invented calls, no zoo content — assert on the flora/fauna registry.
