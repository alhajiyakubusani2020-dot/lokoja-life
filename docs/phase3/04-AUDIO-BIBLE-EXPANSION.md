# LOKOJA LIFE — AUDIO BIBLE EXPANSION
### Phase 3 Prelude · Deliverable 4 of 10 · v1.0 · 2026-10-22
> **Authority.** Expansion of `Art_Audio_Bible.md` (audio identity, A-35…A-47). Evidence:
> `research/phase3/team-7-audio.md` (hour sound map with WebAudio recipes, dB law frame, bird census).
> All recipes are **zero-file synthesis** (Law A-2/A-36/A-44/A-46). Music constants unchanged (S13).
>
> **The audio identity of Lokoja in one line:** birds at dawn, azan on the hour, generators as the
> metronome, zinc in the rain, crickets under a 22:00 noise law.

---

## PART I — WHAT THE EVIDENCE ESTABLISHES

1. **The bird layer can be species-true.** Lokoja has its own peer-reviewed census — Adang et al. 2018:
   **108 species / 43 families**, surveyed at Mount Patti, Kpata market, Ganaja ferry, FUL (Adankolo/
   Felele), Lokongoma — the game's own districts. GBIF adds dated Kogi records: yellow-billed kite (19),
   western plantain-eater (17), laughing dove (16), pied crow (5, FUL 2021), Egyptian plover (10,
   confluence sandbars). The current single finch-chitter recipe becomes a **4-voice palette**
   (finch / dove-coo / plantain-eater crackle / turaco knock).
2. **Power is the metronome.** NBS 2024: households average **6.6 h/day** of grid electricity; ~monthly
   grid collapses (12 recorded in 2024; counts conflict 11/12/26-in-5yr — cadence "roughly monthly" is
   the honest statement); 22M small generators nationally (context figure, A12). Generators get a real
   layer with spool-up/spool-down choreography, not a constant drone.
3. **A legal mixing frame exists.** NESREA 2009 gazette: residential **50 dB(A) day / 35 night**, mixed
   55/45, legal day = **06:00–22:00**. The mix must audibly step down at 22:00 (S12 night-law trim).
4. **The market has a measured curve.** Gwagwalada study (peer-reviewed, Dec 2024, co-author from FUL):
   mornings 54–61 dB, **17:00–19:00 peak up to 98.6 dB** (means ~81–85); market days ~4 dB louder.
   The market layer's daily gain curve follows it. (The 122 dB "night means" paper is flagged implausible
   and NOT adopted — team-7 contradiction 3.)
5. **Azan windows are computable, not guessed.** Five daily windows (Aladhan, Lokoja coords, 2026-10-22:
   05:10 / 12:17 / 15:38 / 18:15 / 19:21) → precomputed seasonal table stored per game-month. Texture =
   PA-band formant pad (saw 220–330 Hz + bandpass sweeps 800–2400 Hz through 400–3500 Hz "PA" band),
   district-gated by mosque proximity, **never lexical** (A-44).
6. **Horn honking is a documented language** (sociolinguistics paper + community lexicon): gate-triple,
   greeting double, give-way long, danger freight. Replace the single random stab with pattern classes
   (S6), district-weighted.
7. **Rain-on-zinc is the signature and needs intensity.** Current zinc layer is boolean-era; rain becomes
   `rainIntensity 0..1` with Poisson tick density (S1). Harmattan gets its own mode (S7): dust hiss
   highpass 6 kHz, far-field lowpass 4 kHz, birds ×0.6.

## PART II — THE HOUR MAP (condensed; full table with recipes = team-7 §3)

| Band | The city sounds like | New layer/event |
|---|---|---|
| 04:00–05:00 | Deep crickets, far dogs, near-silence | dog-event scheduler (rare bursts) |
| 05:10–06:20 | **Fajr azan** over thinning insects; first generators spooling | azan texture (district-gated) |
| 06:20–07:30 | Dawn chorus peaks (species voices); kekes warm; egrets commute; school drum far off; possible "Up NEPA" cheer + staggered generator shutdowns | bird palette v2; power-state idiom |
| 07:30–12:00 | Market gate-open builds; horns rise to traffic truth | murmur LFO; horn patterns |
| 12:17 | **Dhuhr azan** across quarters (market continues through it) | call-window scheduler |
| 13:00–15:30 | Heat lull; schools out ~14:00; cicadas; sudden shower cycles | rain-intensity layer |
| 15:30–17:00 | Late trade; okada peak; (harmattan: muffled distance) | harmattan mode |
| 17:00–18:15 | **Market absolute peak (81–98 dB curve)**; vendor-call blips (non-lexical); Maghrib 18:15 | vendor-call formants |
| 18:15–19:21 | Sunset; evening bird spike then cutoff; lounges warm; generator fleet at max | music-bleed (self-sourced 78 bpm through wall filter) |
| 19:21–22:00 | Isha; compound family noise; crickets re-enter; viewing-centre roar on goals | crowd-swell events |
| 22:00–02:00 | **Night-law trim** (×0.6 outdoor social layers); river layer clearest; collapse nights = audible silence (generators forced 0) | night law; collapse-silence state |

## PART III — THE THIRTEEN SEEDS (from team-7 §5, P0-first)

| # | Seed | Maps to | P |
|---|---|---|---|
| S1 | `rainIntensity` param + Poisson zinc-tick law + roof-rattle swell | `ambience.ts:21-32,169,173` | P0 |
| S2 | Generator layer (brown-noise body + 2.2 kHz whine; truth-driven by grid/district/hour; 1.8–3 s spool) | layer table + scheduler | P0 |
| S3 | Power-state idiom ("NEPA bring/take light" = cheer + spool-downs / thud + spool-ups; 1/5min rate cap) | `ambience.ts` + pulse | P1 |
| S4 | Bird palette v2 (4 species voices, dawn window ×0.4) | `ambience.ts:179-210` | P1 |
| S5 | Call-window scheduler (azan/church PA-pad, seasonal table, no speech synthesis) | new data table | P1 |
| S6 | Horn-language pattern classes | `ambience.ts:240-257` | P1 |
| S7 | Harmattan audio mode (hiss + lowpass + bird cut) | update() + calendar | P1 |
| S8 | Market vendor-call formant blips (non-lexical, peak 17:00–19:00) | market layer | P2 |
| S9 | Dog-event scheduler (night-only, far-field) | timer | P2 |
| S10 | Collapse-silence state (silence as an audible event) | update() | P2 |
| S11 | Flood river truth (radius 85→140 m + hull knocks, Sep–Oct window) | river layer | P2 |
| S12 | Night-law trim at 22:00 (×0.6 residential) | update() | P0 |
| S13 | Music: **no change** — bpm {108,100,92,78}, C-pentatonic, maxVoices 8 all stand; harmattan −2 dB trim only | `music.ts:30-46` | — |

Node budget: +2 always-on sources (generator), +1 hiss (harmattan); all other seeds are event voices
inside existing timers — A-46 compliant.

## PART IV — GATES

- At any hour, the mix's loudest element must match the hour map (A-3 senses agree; A-35 mix is census).
- 22:00 must be *audible* (measurable layer-gain step on residential districts).
- Grid restore/loss within 3 s of state change produces the S3 idiom (rate-capped).
- Zero files added; zero lexical content in any synthesized voice (A-2/A-44).
- Open questions carried: keke/okada engine spectra, zinc-rain acoustics paper, vendor-call vocabulary,
  "Up NEPA" cheer source, night-insect species (team-7 §6) — all are tuning debts, not blockers.
