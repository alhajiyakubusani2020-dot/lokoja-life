# LOKOJA LIFE — AUDIO BIBLE
### The complete sound identity of Lokoja · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends `docs/phase3/04-AUDIO-BIBLE-EXPANSION.md` and the
> Art_Audio_Bible audio laws (A-35…A-47; all binding, unmodified). Evidence: `research/phase3/team-7-audio.md`
> (hour sound map with zero-file WebAudio recipes, dB law frame, Adang bird census), the Dossier
> adjudications (A12 generator anchoring, X8 grid-cadence), and team-3 (hour tables). All recipes are
> **zero-file synthesis** (Laws A-2/A-36/A-44/A-46). Extensions beyond 04 are marked **[EXT]**.
>
> **The audio identity in one line (carried):** birds at dawn, azan on the hour, generators as the
> metronome, zinc in the rain, crickets under a 22:00 noise law.

---

## PART I — THE IDENTITY, DEFINED (what makes this city sound like itself)

1. **Species-true birds.** Adang et al. 2018 (peer-reviewed, Red Team verdict q): **108 species / 43
   families** surveyed at the game's own districts (Mount Patti, Kpata, Ganaja ferry, FUL, Lokongoma).
   The 4-voice palette: finch chitter / dove coo / plantain-eater crackle / turaco knock; dawn window
   gain ×0.4 inside the chorus.
2. **Power is the metronome.** NBS 2024: **6.6 h/day** grid average — the hard anchor (A12); grid
   collapses at "roughly monthly" cadence (X8 law — never a hard count); 22M generators is a contested
   context figure, never shipped as fact. The generator layer has spool-up/spool-down choreography
   (1.8–3 s), not a constant drone.
3. **A legal mixing frame.** NESREA 2009 gazette: residential **50 dB(A) day / 35 night**, mixed
   55/45, legal day 06:00–22:00 — the mix audibly steps down at 22:00 (S12).
4. **The market has a measured curve** (Gwagwalada study, peer-reviewed, FUL co-author): mornings
   54–61 dB; **17:00–19:00 peak up to 98.6 dB** (means ~81–85); market days ~+4 dB. The daily gain
   curve follows it. The implausible 122 dB paper is NOT adopted (team-7 contradiction 3).
5. **Azan windows are computed, not guessed.** Aladhan, Lokoja coords: Fajr ~05:10 / Dhuhr ~12:17-36 /
   Asr ~15:38-16:35 / Maghrib ~18:15-45 / Isha ~19:21-55 → precomputed seasonal table per game-month;
   PA-band formant texture, district-gated by mosque proximity, **never lexical** (A-44).
6. **Horn honking is a language.** Sociolinguistics paper + community lexicon: gate-triple, greeting
   double, give-way long, danger freight — pattern classes, district-weighted (S6). NIGERIA-GENERIC
   label: no Lokoja-specific horn code source exists (Dossier Part 5).
7. **Rain-on-zinc is the signature.** `rainIntensity 0..1` drives Poisson tick density + roof-rattle
   swell (S1); harmattan mode: dust hiss highpass 6 kHz, far-field lowpass 4 kHz, birds ×0.6 (S7).

## PART II — THE HOUR MAP (condensed; full recipe table = team-7 §3)

| Band | The city sounds like | Layer/event |
|---|---|---|
| 04:00–05:00 | Deep crickets, far dogs, near-silence | dog-event scheduler (rare bursts) |
| 05:10–06:20 | **Fajr azan** over thinning insects; first generators spooling | azan texture (district-gated) |
| 06:20–07:30 | Dawn chorus peaks; kekes warm; egrets commute; far school drum; possible "Up NEPA" cheer + staggered generator shutdowns | bird palette v2; power-state idiom S3 |
| 07:30–12:00 | Market gate-open builds; horns rise to traffic truth | murmur LFO; horn patterns |
| 12:17–12:36 | **Dhuhr azan** across quarters (market continues through it) | call-window scheduler |
| 13:00–15:30 | Heat lull; schools out; cicadas; sudden shower cycles | rain-intensity layer |
| 15:30–17:00 | Late trade; okada peak; (harmattan: muffled distance) | harmattan mode |
| 17:00–18:15 | **Market absolute peak (81–98 dB curve)**; vendor-call blips; Maghrib 18:15 | vendor-call formants (non-lexical) |
| 18:15–19:21 | Sunset; evening bird spike then cutoff; lounges warm; generator fleet at max | music-bleed (78 bpm through wall filter) |
| 19:21–22:00 | Isha; compound family noise; crickets re-enter; viewing-centre roar on goals | crowd-swell events |
| 22:00–02:00 | **Night-law trim (×0.6 outdoor social)**; river layer clearest; collapse nights = audible silence | night law; collapse-silence S10 |

## PART III — DOMAIN LAWS [EXT — the directive's coverage items]

1. **City ambience:** the 8-layer bed (Art_Audio §8.2) carries murmur/horns/texture; density is the
   crowd multiplier × market dB curve × hour map. No layer may play at flat gain all day.
2. **Wildlife:** birds per Part I.1; crickets/insects own 22:00–05:00; frogs own rainy nights; Egyptian
   plover context only on sandbar shorelines (no invented calls — synth from family-true formants).
3. **Markets:** the dB curve IS the law; vendor calls are formant blips, never words; night-market
   (19:00+) runs a warmer, smaller mix.
4. **Prayer ambience:** azan per window table; church PA-band pads Sunday mornings (same non-lexical
   grammar); both district-gated; never mutually exclusive in the mix — the city overlaps them.
5. **Rain & storms:** S1 zinc law; storm adds distant thunder rolls (filtered noise bursts), gutter
   rush, and the "roof drum" swell; aftermath = dripping on multiple surfaces at varied rates.
6. **Traffic:** horn language (Part I.6); okada/keke engine textures remain tuning debts (04 §IV);
   truck absence 23:00–05:00 is audible (curfew law pairs with engine bed).
7. **Interiors:** wall-filtered exterior (lowpass + gain cut), room tone, interior sources (fan whirr,
   TV murmur, fridge hum where power allows) — interior mixes must flip audibly with power state.
8. **Vehicles:** as moving sources with doppler-lite pitch envelopes; CNG kekes get a cleaner engine
   tone (P2, NG flag).
9. **Silence:** two engineered silences — the 22:00 trim (relative) and the **collapse-silence**
   (generators forced to 0 across the district for minutes = the rarest, most readable event in the
   city; S10).
10. **Music philosophy:** unchanged constants — bpm {108,100,92,78}, C-pentatonic, maxVoices 8
    (`music.ts:30-46`); harmattan −2 dB trim only (S13). Music never masks the hour map.
11. **Emotional sound design [EXT]:** comfort = dawn chorus + compound life + food sounds; tension =
    storm build (SW anvil + wind + zinc rattle) and flood-water body; loneliness = dark-moon night
    (crickets + far dogs + river); joy = festival bands + viewing-centre goals + market peak. Each
    emotion maps to EXISTING layers — no new one-shot events.

## PART IV — SEEDS & GATES (carried)

Seeds S1–S13 with priorities as ruled in 04 §III (P0: S1 rainIntensity/zinc, S2 generator layer,
S12 night trim). Node budget: +2 always-on (generator), +1 hiss (harmattan); all else event voices.

**Gates:**
- At any hour the loudest element matches the hour map (A-3; A-35 mix is census).
- 22:00 is *audible* (measurable layer-gain step on residential districts).
- Grid restore/loss produces the S3 idiom within 3 s (rate-capped).
- Zero files added; zero lexical content in any synthesized voice (A-2/A-44).
- Collapse-silence is recognisable within 10 s of onset (playtest probe).
- Open tuning debts carried (04 §IV): keke/okada engine spectra, zinc-rain acoustics, vendor-call
  vocabulary, "Up NEPA" source, night-insect species — debts, not blockers.
