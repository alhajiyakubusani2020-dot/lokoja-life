# LOKOJA LIFE — LIGHTING BIBLE
### The physically believable light guide · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends `docs/phase3/07-LIGHTING-BIBLE.md` (binding,
> unmodified) under `Art_Audio_Bible.md` v2.2 (ACES 1.12, A-1 readability). Evidence: the reproducible
> solar table (`research/phase3/solar-output.txt`, `scripts/phase3/solar_lokoja.py`, API-cross-validated
> ≤1 min) **plus the new lunar table** (`research/phase3/moon-output.txt`, `scripts/phase3/moon_lokoja.py`,
> cross-validated ≤24 min vs timeanddate anchors — Phase3_Research C-7), team-1 §2.10/§3, and the
> visual references (m1, conf1, flood1, harm1, v2 set). Extensions beyond 07 are marked **[EXT]**.
>
> **The one-paragraph truth (carried from 07):** the sun barely changes all year. Day runs
> 11h40m–12h35m, sunrise 06:17–06:41, sunset 18:21–18:52 — a 40-minute annual swing where temperate
> games build whole seasons. Seasonality is not the sun's angle; it is the AIR. Build the sky around
> the air.

---

## PART I — SOLAR GEOMETRY (reproducible; regenerate via the script)

### 1.1 Key dates (WAT) — from `solar-output.txt`
| Date | Sunrise | Solar noon (elev) | Sunset | Day | Civil twilight |
|---|---|---|---|---|---|
| Dec solstice | 06:41 | 12:31 (58.8°) | 18:21 | 11h40m | 06:18 / 18:44 |
| Equinox Mar | 06:38 | 12:41 (81.7°) | 18:44 | 12h06m | 06:17 / 19:05 |
| Zenith pass #1 (≈Apr 11) | 06:26 | 12:35 (≈88°) | 18:45 | 12h19m | — |
| Jun solstice | 06:17 | 12:34 (74.3°) | 18:52 | 12h35m | 05:54 / 19:14 |
| Zenith pass #2 (≈Sep 4) | 06:26 | 12:35 (≈88°) | 18:44 | 12h19m | — |
| Equinox Sep | 06:22 | 12:25 (82.5°) | 18:29 | 12h07m | 06:01 / 18:50 |

### 1.2 The shading table (hourly elevation/azimuth, deg from true north)
Full table lives in 07 §1.2 and `solar-output.txt` Part B — the load-bearing reads:
- **December's sun lives in the south** (az 113°→247°, max 58.8°): north-facing walls go golden all
  day; shadows long and southerly.
- **June's sun rises/sets north of east/west** (az 66.6°→293°): the signature "everything glows"
  symmetry at dawn and dusk.
- **Near-zenith days (≈Apr 11, Sep 4)** cast near-zero noon shadows — ship the shadow-vanish moment.

### 1.3 Golden-hour law (carried)
AM ≈ sunrise→+50 min; PM ≈ sunset−55min→sunset. **The game's signature amber slot maps to 17:00–18:20
game time** — inside the real PM golden window every month. December sunsets before 18:30: evenings
go dark early (the December law, 07 §III.3).

### 1.4 Blue hour [EXT]
In the tropics the terminator is steep: civil twilight lasts only **23–29 minutes**
(`solar-output.txt`: ends 18:44 Dec / 19:14 Jun), so blue hour is a SHORT, RARE-flavoured slot, not an
evening-long state. Build law: civil-twilight end minus civil-twilight start-of-window gives a
~25-minute band after sunset (and before sunrise) where the sky runs deep blue with warm horizon
band; lamps, phone lights and shopfronts dominate earlier here than in temperate scenes. Night begins
at civil-twilight end (≈19:15 worst case) — the night law in 07 §III.1 stands.

## PART II — THE FIVE LIGHT GRADES (per weather state; carried from 07 §II)

| Grade | Sun disc | Colour temp (design) | Shadows | Distance |
|---|---|---|---|---|
| Clear dry | Hard white by 08:00 | 5500–6500K midday; 2000–2500K golden edges | Hard, southerly-tilted in Dec | Long; warm haze far range |
| Harmattan | Pale disc, no glare | 3500–4500K haze-diffused | Faint/soft | Short; tan-pink veil; lamp halos |
| Rainy | Filtered white between cumulus | 6000–7000K flat | Soft-edged | Mid; rain veils |
| Storm | None (shelf) | Green-grey 6500–7500K, one gold slit at break | None → sudden hard | Very short under shelf |
| Flood | Watery white | 5500K flat over brown plane | None | Short; brown absorption |

ACES exposure 1.12 stays; grades are fog-colour/density + sun-intensity/saturation curves per state.

## PART III — NIGHT LAW (carried + moon extension)

1. **Dark by ≈19:15** year-round; the 492 lamps + fire-glow + phone lights carry the city.
2. **Moon-phase system [EXT — UNBLOCKED]:** build from `moon-output.txt` (S14/L5 unblocked this
   phase). Binding rules:
   a. **Full-moon nights** (illum >97% at 18:30; 13 in 2026 incl. Blue Moon May 31): moonlight
      bright enough to silhouette Patti and read the confluence plain — a rare gift-state.
   b. **Dark-moon nights** (illum <5% at 18:30 AND 21:00; ~3–4-night windows monthly): compound-lamp
      nights — lantern/phone/fire pools only, deepest blacks of the year.
   c. Monthly mean evening illumination ≈45–53% with the moon near-horizon half the time: the
      DEFAULT night is a half-lit, changeable night — not a constant moon.
   d. Phase values must match `moon-output.txt` within one day (gate 7 of Environment_Bible).
3. **Harmattan nights:** moon = ringed glow, stars gone (DI dust optics, labelled); clear dry nights
   show stars (Bortle quantification remains an open debt — C-10).
4. **Interior law [EXT]:** warm bulb pools through burglar bars (03 §II grammar); interiors read as
   **orange-warm islands in blue dusk** at blue hour; power-state coupling — grid loss flicks
   interiors to generator/battery/or-dark per district wealth, light and audio follow ONE power state.

## PART IV — PRACTICAL & INTERIOR LIGHTING [EXT]

1. **The practical is the light source.** Shops: single fluorescent tube (cool 4000–4500K) or warm
   bulb; bars/lounges: string bulbs + TV glow; homes: bulb pools per room, kerosene/firess in
   low-power compounds; mosques/churches: cool floods on facade at prayer windows. Every fixture is
   a prop with a state, tied to the district power law.
2. **Street lamps (492 on disk):** high-pressure-sodium amber in older grid streets, cool-white LED
   on newer arteries — the mix itself is a district-age signal (03 §I utilities row).
3. **Vehicle lights:** okada headlight always-on (day and night), keke marker lamps, danfo brake
   lights as moving colour accents in dusk; no invented light types.
4. **Viewing centres & market halls at night:** the brightest non-street things in the city — TV-blue
   spill and stall fluorescents; they dim with the 22:00 night-law trim (audio pairing, 04 §II).

## PART V — BUILD RULES & GATES (carried + additions)

1. One sun-clock table drives `world.ts` slots, sky, shadows — no second clock.
2. Slot map aligned to solar table (morning slot centers 07:00–08:30 low-sun band; evening slot
   centers 17:00–18:20 golden window; night begins at civil-twilight end).
3. December law: by 18:30 the world is lamps-only.
4. Blue-hour band is generated FROM the table (twilight end/start), never hand-tuned per season.
5. Moon law per §III.2 — phases from the validated table; no decorative constant moon.
6. All five grades reachable in screenshots; harmattan grade passes the A-1 readability gate on a
   360px device in afternoon sun (explicit test).
7. NEW gate: a full-moon-night screenshot must show Patti readable by moonlight; a dark-moon-night
   screenshot must show lamp-pools only.
