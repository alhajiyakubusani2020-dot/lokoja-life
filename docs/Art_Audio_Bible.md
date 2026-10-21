# LOKOJA LIFE — ART & AUDIO BIBLE
### Version 2.1 · The book of the senses

> **Authority.** Subordinate to the **Design Constitution**. This book owns *how Lokoja looks and sounds*: art direction, color, light, camera, character, motion, effects, the UI's visual system, and the entire audio identity.
>
> **Companions.** `Experience_Bible.md` (what the senses are *for*), `World_Bible.md` (what the senses describe), `Content_Bible.md` (how new sensory content is admitted).
>
> **Ground rule.** Every token, constant, and system named here exists on disk (`globals.css`, `WorldScene.tsx`, `atmosphere.ts`, `ambience.ts`, `music.ts`, `polish.tsx`). This book never asks the engine to become something it is not — it defines what the engine's materials must *mean*.
>
> **Upgrade (v2.0, 2026-10-21).** The ERA II reverification pass: the SILK law restated as gates + dated measurements (re-measured, never assumed), the arbitrary-size census re-counted, and the living-constitution layers added (Part X). Audit of record: `docs/BIBLE_UPGRADE_AUDIT.md`.
>
> **Reverification (v2.1, 2026-10-21).** Second RULE ZERO pass: the zero-asset claim was **scoped to the truth** — the 3D world and all audio are 100% procedural (zero models, zero audio files, zero world photo-textures), but the 2D shell ships a small, named set of binaries (the painted menu hero, the PWA icons) and **13 orphaned .webp files** were discovered and entered as a debt. The type census re-counted: 1,178 exact `text-[Npx]`. Nothing doctrinal changed.

---

## PART 0 — IDENTITY

### 0.1 The one-line identity

> **Golden hour on zinc roofs, seen through warm paper.**

Lokoja Life's eye is the light of the evening slot (the game's signature amber hour) and its hand is warm paper (`--lko-cream #fbf3e4`, `--lko-surface #fffdf7` — `globals.css:141-147`). Everything the player ever sees or hears must be recognizably *that*: warm, low, honest, human-scaled. If a screenshot could be mistaken for another game's, it fails.

### 0.2 The five senses laws

1. **Law A-1 — Readable before beautiful.** A 360 px phone in afternoon sun is the reference device. If legibility and beauty conflict, legibility wins *every time* — then we find the third option that is both.
2. **Law A-2 — The world is 100% procedural.** Zero model files, zero image-sequenced animation, zero audio assets anywhere; zero photo-textures in the 3D world renderer. The city is *generated from its own parameters* — canvas-baked textures, instanced flora, synthesized sound. This is a creative law, not just a budget: a procedural city can respond to its state (weather, slot, district) in ways baked assets never can. **The 2D shell's sanctioned binaries are exactly two families, named here so the exception cannot grow quietly:** the painted menu hero (`public/art/menu-hero.webp`, consumed by `MainMenu.tsx`) and the PWA icon set + `logo.svg` (`public/icons/`, app chrome — not game art). Any other binary entering `public/` needs a Bible amendment. (The 13 orphaned `.webp` files found by the v2.1 reverification — 10 `loc-*.webp` plates whose only consumer `LocationArt.tsx` has zero importers, and 3 `ad-*.webp` generator outputs with zero consumers — are dead files awaiting deletion, §10.1's debt list.)
3. **Law A-3 — The senses agree.** What the eye says (a market, evening, rain) the ear must confirm, and the camera must respect. A conflict between senses is a bug of meaning, not of style.
4. **Law A-4 — Style is a decision, so is its boundary.** Stylized realism with warm abstractions — never photoreal envy, never cartoon pastiche. The test: does it look like *this Lokoja*?
5. **Law A-5 — Performance is an aesthetic.** The SILK posture is what a *well-made* city feels like: TTI < 3.0 s · wire < 900 KB · 0 console errors · warm click < 100 ms · heap < 300 MB (G1–G6, `scripts/silk-gates.ts`). Last measured 2.59 s / 406 KB / heap 27 MB / warm click 4 ms (2026-10-20). The numbers are **re-measured, never assumed** (C-13); a stale number in this book is a measurement debt, not a license. Jank is not a technical debt; it is an art failure.

---

## PART I — ART DIRECTION

### 1.1 The four pillars

1. **Silhouette first.** Every landmark, building, tree, and vehicle reads at 200 m as a *shape* (W-41). The twelve bespoke landmarks are a silhouette alphabet; the player learns the city by shapes before names.
2. **Material honesty.** Surfaces say what they are: zinc shines and rattles (sound law), tarmac is matte and marked, mudbrick breathes, paint peels at the edges where rain writes. Canvas-baked facade textures carry this law (§2.1).
3. **Warm abstractions.** Distance softens into warm haze rather than cold fog; shadows are blue-plum, never gray-black; highlights lean gold, never white. The world is slightly more *golden* than reality, everywhere, on purpose.
4. **Life at eye level.** Detail budget lives at walking height (EX-7): road furniture, doorways, stall fronts, the first two metres of every facade. The skyline is simple; the street is rich.

### 1.2 Composition

- **The protected compositions** (World W-3/W-17): the confluence seam from the deck, the city grid from Patti's summit. No content occludes them above knee height — ever.
- **Framing law:** every district approach has *one composed view* (a landmark down an avenue, a tree framing a corner). If a new building breaks an approach composition, the approach is re-composed — never left broken.
- **The eye wanders, the hand guides:** no arrows, no markers (EX-35.1). Wayfinding is: silhouettes, light pools (W-37), road grammar, and the map. If players get lost, we build better shapes, not bigger arrows.

### 1.3 The anti-catalog clause

Nothing in Lokoja is arranged like a shop catalog. Props cluster with human logic (a bench near shade, a stall near the kerb, a keke parked where kekes park) — never evenly spaced, never facing camera. **Law A-6 — Placement is sociology:** every prop answers *who put this here and why?* before it enters the world.

---

## PART II — COLOR

### 2.1 The token registry (the only colors in the game)

UI color comes from exactly these tokens (`globals.css:132-151`) — new colors are new tokens, or they don't exist:

| Token | Hex | Meaning |
|---|---|---|
| `--lko-green` | `#146b3a` | The lawful, the safe, the go (the Color Line's green) |
| `--lko-green-deep` | `#0b3d22` | Depth, headers, the forest |
| `--lko-green-soft` | `#e3f0e6` | Green's paper tint |
| `--lko-gold` | `#e8a317` | The economy, the evening light, attention |
| `--lko-gold-deep` | `#8a5a00` | Economy's gravity |
| `--lko-gold-soft` | `#fdf0d5` | Gold's paper tint |
| `--lko-terra` | `#c4562a` | Earth, refusal warmth, terracotta |
| `--lko-river` | `#1f7a6d` | Water, calm, the confluence |
| `--lko-river-soft` | `#dcefeb` | Water's paper tint |
| `--lko-cream` | `#fbf3e4` | The paper itself |
| `--lko-sand` | `#f3e3c3` | Dry ground, harmattan |
| `--lko-ink` | `#22271f` | Text, the drawn line |
| `--lko-ink-soft` | `#6b6a5c` | Secondary text |
| `--lko-surface` | `#fffdf7` | Card surfaces |
| `--lko-line` | `rgba(34,39,31,.08)` | Hairlines |
| `--lko-shadow-sm/md/lg` | — | The three elevations |

### 2.2 The Color Line (Constitution canon, applied)

- **Green** = lawful, safe, confirmed. Money received, travel allowed, the tour's next step.
- **Gold** = economy, attention, the evening. Prices, fares, market highlights, the amber hour.
- **Terra** = earth and *warm refusal* — the boundary color that never screams (EX-43: refusals are warm-toned, not alarm-red).
- **River** = water, calm, social rest.
- **Ink on cream** = the voice of the game (all body copy).

**Law A-7 — The Color Line is machine-checkable.** Any UI state (confirm/warn/refuse/info) maps to exactly one token family. A red that isn't terra, a green that isn't lko-green, is a bug against the Color Line.

### 2.3 The 3D palette

- **Day:** sun-washed tarmac gray-green, cream walls with pigment wash (each district a wash family — D1–D10 character sheets), zinc silver with age rust, tree greens calibrated to West African dryland (olive, not emerald).
- **Golden hour:** the game's signature — everything gains `--lko-gold` warmth, long shadows, river specular turns amber. The evening slot is the box art and it must deserve it.
- **Night:** deep blue-plum ambient, sodium-orange pools (492 lamps, World W-37), window emissives as warm scatter (canvas-baked), headlight cones as the moving light. Night is *dark but readable* (EX-21.3) — the pools do the reading.
- **Harmattan:** the palette desaturates toward `--lko-sand`; distance dissolves warm (the whole city in pastel dust).
- **Storm/flood:** slate greens and steel; the world's saturation drops; the flood veil cools the riverside.

**Law A-8 — District wash families.** Each launch district owns a facade wash (from its World Bible character sheet: market = warm pigment+cloth color, GRA = institutional cream/green, university = bright student color, historic = weathered ochre...). New districts inherit a wash from their character sheet or amend it.

---

## PART III — MATERIAL & TEXTURE

### 3.1 The canvas-baked law

All textures are painted at runtime to canvas (`WorldTerrain`, `CityMesh` facades + night emissives, danfo art). **Law A-9 — One painter, one style.** The canvas painters share one grammar: flat color + paper grain + hand-weighted edges (slightly darker rims), like screen-printed posters. No phototexture slapping, no noise-for-texture's-sake.

### 3.2 Facades & the layering law

- Facades bake per-district wash (A-8) with door/window rhythm that follows building *type*, not randomness: shops have big openings and signboards, compounds have high windows and gates, schools have rhythm and verandas.
- Night emissives bake as a second canvas — windows lit in *life patterns* (a late-night reading lamp, not uniform office grids).
- **Law A-10 — Layer heights are law.** Markings sit at +0.1 vs tarmac +0.106 (the audit-verified layering); puddles at y=0.035; every new ground layer declares its height in the registry and never fights another layer's z. Z-fighting is not a bug to fix later; it is a layering *plan* we keep.

### 3.3 Vehicles & cloth

Danfo/keke/taxi/okada bodies carry hand-painted character (canvas art): route names, slogans, wear at the same edges every Nigerian vehicle wears. Cloth (awnings, clotheslines, festival bunting) flaps with the wind law (§5.4) — cloth is the city's flag; it is never static.

---

## PART IV — LIGHT

**GROUND.** ACES tone mapping @1.12; `shadowMap.autoUpdate = false` with the on-demand ShadowGovernor (≥3 u move / 0.4 s cadence); one 1024² shadow sun that follows the player; slot keyframes in `atmosphere.ts`; 492 sodium lamps at night; FramePacer 30 Hz on low tier; DynamicResGovernor walks dpr on p95 pressure (`WorldScene.tsx:479-534`, `device.ts:69-229`).

**DOCTRINE.**

- **Law A-11 — One sun, honestly governed.** The single-shadow-sun law is permanent: no second shadow caster, no per-object shadow toggles. The Governor's economy *is* the light design constraint — composition (W-41, A-6) must make the player never notice.
- **Law A-12 — Light tells time.** Slot keyframes are authored per slot (EX-21.1: light, audio, crowd, one exclusive texture each). A slot's light is its *name*: morning long and pale, afternoon hard, evening golden, night sodium.
- **Law A-13 — Interiors have their own sun.** Interior keyframes differ from exterior day (EX-14): warmer, closer, softer; the bank is the most solid light in the game, the home the warmest, the school the clearest.
- **Law A-14 — No light without a source.** Every pool, glow, and cone claims a lamp, a window, a headlight, or a fire. Unexplained glow breaks material honesty.

---

## PART V — CAMERA

### 5.1 The modes

**GROUND.** Follow (default), orbit (look around), drone (survey), chase (driving), photo mode (`controls.ts`). No cinematic wrestle-control exists and none may be added (EX-3.1).

**DOCTRINE.**

- **Law A-15 — The player owns their neck.** Camera modes are *offers*, never takeovers. The only scripted camera motion permitted is the arrival veil's first settle (EX-3) — and it is 2 seconds, gentle, and interruptible by touch.
- **Law A-16 — Every mode has a purpose test.** Follow = living; orbit = gisting/photographing; drone = planning/screenshotting the city; chase = driving. A mode that duplicates another's purpose dies (the catalog clause applies to cameras too).
- **Law A-17 — Camera weight is authored.** Chase cam lag on yaw, dip on braking, slight FOV tighten on sprint — weight lives in camera and audio because there is no physics engine (EX-10's law). If the camera feels weightless, the whole driving feel fails.

### 5.2 Photo mode

Photo mode is the game's *love letter machine* (postcards, the Confluence Test). Its laws: HUD auto-hides; the rule of thirds grid is optional and subtle; the frame gets the game's paper border; weather and slot are captured honestly (no beauty filters — harmattan *is* the filter). **Law A-18 — Screenshots must survive:** any UI change must pass the "photo with zero UI" test (EX-37.2).

---

## PART VI — CHARACTER & ANIMATION

### 6.1 Character style

**GROUND.** Procedural low-poly rigs: capsule citizens with real proportions, skin/hair/style swatches (creation), NPC hair palette on disk (`#1A1714, #2E1D12, #5C2330, #8A6A3B, #B79545` — `Actors.tsx:359`), cloth color from district wash families. No bone animation — bodies are procedurally posed.

**DOCTRINE.**

- **Law A-19 — Dignity at every distance.** Characters are *people*, not blobs: readable faces at 4 u (talk distance), believable silhouettes at 200 m. Any future character fidelity increase must keep the one-species law: NPCs, remotes, and the player share the exact same body grammar (EX-31).
- **Law A-20 — The palette is the population.** Hair and cloth colors are Nigerian-true (the on-disk palette is the seed register). Skin swatches span the region honestly. No arbitrary neon hair, no costume clichés — the Mother Test applies to every human surface.

### 6.2 The animation language

**GROUND.** Procedural walk/run bob, seat boarding, emotes, wind-shader flora, wheel spin, bird wing flaps (`lko-anim-*` CSS cousins on the 2D side: `lko-bob 4.2s`, `lko-wing 0.9s`, drift 46/78 s — `globals.css:306-340`).

**DOCTRINE.**

- **Law A-21 — Economy of motion.** Every animated thing moves for a *reason* the world believes: trees in wind, cloth in gusts, wheels on contact, birds on air. Nothing idles for attention (no "breathing" UI, no pulsing buttons outside `lko-ring-pulse`'s one lawful use: the live presence indicator).
- **Law A-22 — Weight is consistent.** The bob vocabulary (frequency + amplitude) is shared: a walking NPC and the player use the same gait math; a heavier vehicle sways with heavier easing. The city moves as one physics of *feeling*.
- **Law A-23 — Transitions are cuts where life cuts, blends where life blends.** Doors are cuts (EX-14.2); slot changes are blends; pose changes blend ~150 ms. Anything longer is a loading screen wearing a costume.

### 6.3 Effects

**GROUND.** Rain: 620 particles; puddles: fixed y=0.035 planes; DustHaze + Puddles in `polish.tsx`; smoke wisps; ambient birds.

**DOCTRINE.**

- **Law A-24 — Effects obey the weather's four-system law** (W-48): rain moves audio, crowds, economy, and guards — the particles are the *least* of rain.
- **Law A-25 — Particles are cheap and honest.** The 620-particle budget is law; low tier must hold the Rain Test (EX-22.3). No particle may exist that only looks good on a flagship.

---

## PART VII — THE UI VISUAL SYSTEM

### 7.1 Paper UI (the only UI language)

The UI is the game's *paper* — cards of `--lko-surface` on `--lko-cream`, ink text, hairline rules (`--lko-line`), the three shadows as the whole elevation story. No glassmorphism, no gradients-for-depth, no dark-mode duality, no foreign design systems. shadcn exists in the repo but ~40/48 components are unused — **Law A-26 — One UI grammar:** every new surface is built from `lko-card / lko-press / lko-display / lko-num / lko-sheet / lko-toast / lko-scrim` primitives (`globals.css:154-267`) or it does not merge.

### 7.2 Typography

**GROUND.** `lko-display` for headers, `lko-num` for figures (tabular truth — money aligns), body sizes currently scattered across ≈1,200 arbitrary values (v2.1 re-census 2026-10-21: 1,178 exact `text-[Npx]`; the audit's 1,191 used a wider regex — debt #1 in the design system pillar).

**DOCTRINE.**

- **Law A-27 — The type scale is six steps.** Display / Title / Body / Small / Whisper / Num — defined once as tokens; arbitrary font sizes are migrated, never added. A "slightly bigger" body is a bug against the scale.
- **Law A-28 — Numbers are tabular, always.** Any naira, time, distance, or count renders in `lko-num`. Money that shifts width as it counts is a broken promise.
- **Law A-29 — Copy is set like a letter, not an app.** Line length ~60 characters max on body, generous leading, ink on cream. The UI reads like the city writes.

### 7.3 The unification debts (named, from the audit)

These are the art debts that *must* die before UI feature work scales further:

1. **Three money UIs** (BankApp / BankPanel / WalletApp) — one wallet grammar by law (EX-20.4).
2. **Three button systems** — `lko-press` is the one press (the green pill in `Actors.tsx:458` is a copy to be migrated, not a second law).
3. **Six sheet implementations** — `lko-sheet` is the one sheet.
4. **Ghost classes** (`lko-glass`, `lko-label` referenced, never defined — `kit.tsx:96,125`) — defined or deleted; ghosts invite cargo cults.
5. **≈1,200 arbitrary font sizes** — the six-step scale (A-27) is the migration target.
6. **`tailwind.config.ts` untouched shadcn defaults** — the config is aligned to tokens or emptied; drift between config and `globals.css` is how two design systems are born.
7. **13 orphaned `.webp` files in `public/art/`** — the 10 `loc-*.webp` location plates (only consumer `LocationArt.tsx` has zero importers) and 3 `ad-*.webp` generator outputs (zero consumers anywhere). They ship bytes nobody sees; deletion is the cure, admission to the game (through a wired surface) would be an amendment. (v2.1 finding.)

**Law A-30 — No new visual language, ever.** A PR introducing a new button class, a new sheet, a new glass, a new shadow, or a foreign component library is rejected on sight, however pretty.

### 7.4 Motion (the UI's body language)

**GROUND.** `lko-kenburns` (hero), `lko-pop`, `lko-fade`, `lko-toast` (3.2 s life), `lko-scrim`, `lko-sheet` slide-ups, `lko-float`.

**DOCTRINE.**

- **Law A-31 — Motion is unhurried, entrances are quick.** Sheets/slides: 200–260 ms out, gentler settle in; toasts live exactly 3.2 s (the notification law); the world's own motion is the slow layer (Ken Burns 46–78 s drifts).
- **Law A-32 — Motion never gates.** No spinner is ever shown where instant truth could be (honest lane states, EX-6.4). Waiting UI is only for *real* wire waits, and it names them ("reaching the bank…", not a naked spinner).
- **Law A-33 — One bounce vocabulary.** `lko-pop`'s easing is the game's only overshoot. Confetti, shake, and attention-wiggle do not exist in this game.

### 7.5 Icons

**Law A-34 — Icons are drawn, not imported.** The icon set is the game's own hand: simple ink strokes at one weight, 24 px grid, readable at 16 px. Emoji are copy (the wry register may use them as *text*), never UI iconography. No icon font, no mixed-weight icon sets.

---

## PART VIII — AUDIO

### 8.1 The audio identity

> **The city is the instrument.**

Every sound in Lokoja Life is *synthesized from the city's own state* — there is not one audio file on disk, and there never will be (Law A-2). This is not deprivation; it is the identity: the ambience bed is a *function of where you are, what time it is, what the sky is doing, and who is near*. A procedural city can do that; a sample library can only pretend.

### 8.2 The eight layers (the bed)

**GROUND.** `ambience.ts:37-106` — breeze (lowpass 320 Hz, always on, LFO-breathed), river (bandpass 850), market (lowpass 480), rain (highpass 1,400), room (lowpass 140), crickets (bandpass 4,400), horns (bandpass 520, driven by road proximity — `:27`), zinc (bandpass 3,200). All filtered noise — the city literally hums with shaped air.

**DOCTRINE.**

- **Law A-35 — The mix is the census (W-56 applied).** Every layer's gain is a *function of truth*: near water → river; near stalls → market; in a room → room; under zinc in rain → zinc. The audio engine may never play a layer the world does not justify.
- **Law A-36 — New layers are data, not files.** A new ambience need (generator hum, stadium roar, forge rhythm) is added as another shaped-noise layer with its own truth-driver — never as a loop recording.
- **Law A-37 — Districts are mixes.** Each district's ambience fingerprint (World Bible D1–D10 Sound fields) is a gain table over the eight layers; entering a district *crossfades the census* (EX-7.3's 10-second law).

### 8.3 Music doctrine

**GROUND.** `music.ts` — the procedural afro-fusion engine: C major pentatonic scale (261.63 base), kalimba lead (octave moves ×0.5/1/2), the afro kick on steps 0/7/10 with seeded ghost notes, 16 sixteenth-steps per bar, deterministic per-bar generation.

**DOCTRINE.**

- **Law A-38 — Music accompanies; it never stars.** The bed is the city; music is what the city hums. Default posture: sparse, warm, low. The two lawful exceptions: festival days (denser drums, call-and-response, EX-25) and the stage (the crowd's own music).
- **Law A-39 — The grammar is West African, the palette is the engine's.** Afro-fusion from rhythm grammar (the 0/7/10 kick cell, shaker layers, call-and-response figures) — never pastiche loops, never "Africa mode" marimba clichés. The Mother Test applies to the music louder than to anything: it must sound like *home*, not like a holiday ad.
- **Law A-40 — Two motifs, forever.** The discovery figure (two warm kalimba notes — EX-36) and the refusal figure (low, brief — EX-40) are permanent identifiers. New motifs require Bible amendment; motif inflation kills meaning.
- **Law A-41 — Silence is a chapter.** The confluence at golden hour, the summit, the after-storm hush, the moment before sleep — these are *scored silences*: music and bed intentionally thin to near-nothing, and the silence is the beauty. A mix that cannot shut up has no restraint to sell.

### 8.4 The sound of places

- **Interiors:** the room layer (lowpass 140 Hz) is the wall between you and the street; each interior type gets a parameter set (bank: tight + stamps; school: bright murmur + chalk; home: soft + life through walls; lounge: warm + music bleed). **Law A-42 — Every interior ships its room parameters** (EX-14.1's sound clause).
- **Weather:** rain's highpass bed + zinc crackle; thunder's sub-weight with true silence after (EX-24); harmattan's wind; flood's swollen river layer. Weather mixes are authored per weather state, not tinted.
- **Vehicles:** engine drone keyed to speed (no RPM theater, EX-10); the horn band thickens with traffic; the okada's higher texture is *audible before visible* (EX-11.2); the danfo idles in ranks at the park (D10's sound).
- **The wire:** network truth has a sound language — one soft confirmation for money received, the one refusal figure, the call banner's rise. Nothing else: no message swooshes, no like sounds, no casino pings.

### 8.5 NPC voice philosophy

**GROUND.** No voice-over exists or is planned; NPCs speak in text (gist bubbles, chat, the murmur band).

**DOCTRINE.**

- **Law A-43 — Text is the voice.** The murmur band *is* the crowd's voice (a street that never resolves into words but always resolves into life); individual NPC speech is written, never synthesized speech or gibberish "animal crossing" babble. Words are the game's most human asset; they are spent carefully (Content Bible copy playbook).
- **Law A-44 — Real human voices are sacred.** The only true voices in Lokoja belong to other players (calls, walkie, stage). They are protected by the M13 walls, the block law, and the chill mode — and by the audio mix, which never processes, effects, or "gamifies" a human voice.

### 8.6 Technical audio law

- **Law A-45 — Mobile first, always.** The mix is authored on phone speakers first (mono, tiny drivers): every layer must be *identifiable* on a ₦30,000 Android. Headphone polish is the bonus layer, never the requirement.
- **Law A-46 — The bed never drops the frame.** Audio nodes are budgeted like draw calls; a mix change is a gain ramp, never a node storm. The ambience engine allocates once and breathes forever.
- **Law A-47 — Sound is consent.** Audio starts only on the player's first enabled gesture (EX-2.4); chill mode (Settings) thins music and social layers globally; every social audio path is opt-out-able without other loss (EX-33.2).

---

## PART IX — THE LOKOJA ART TEST

Every visual/audio addition passes this checklist before it merges:

1. **The squint test** — half-close your eyes: does it read as *this Lokoja* (warm, paper, golden)? Or could it be any game?
2. **The phone test** — 360 px, afternoon sun, phone speaker: still legible, still audible, still beautiful?
3. **The Color Line test** — does every state color come from the token registry (A-7)? Any new hex is a new token or a rejection.
4. **The source test** — does every light claim a source (A-14), every motion a reason (A-21), every sound a truth (A-35)?
5. **The photo test** — zero-UI screenshot survives (A-18)?
6. **The silence test** — does the addition know when to shut up (A-41)?
7. **The Mother Test** — is the cultural surface true and dignified (EX-38.1)?
8. **The budget test** — does it hold the SILK posture on low tier (A-5)?

### Law summary (A-1 → A-47)

| Pillar | Laws |
|---|---|
| Identity & direction | A-1 readable · A-2 procedural · A-3 senses agree · A-4 style boundary · A-5 performance aesthetic · A-6 placement sociology |
| Color | A-7 Color Line machine-checkable · A-8 district washes |
| Material | A-9 one painter · A-10 layer heights |
| Light | A-11 one sun · A-12 light tells time · A-13 interior suns · A-14 sourced light |
| Camera | A-15 player owns neck · A-16 purpose test · A-17 authored weight · A-18 photo survival |
| Character & motion | A-19 dignity · A-20 palette population · A-21 economy of motion · A-22 weight · A-23 cuts & blends · A-24 weather duty · A-25 honest particles |
| UI | A-26 one grammar · A-27 six-step scale · A-28 tabular numbers · A-29 letter setting · A-30 no new languages · A-31 motion law · A-32 no gate motion · A-33 one bounce · A-34 drawn icons |
| Audio | A-35 mix is census · A-36 layers are data · A-37 district mixes · A-38 accompany · A-39 grammar · A-40 two motifs · A-41 scored silence · A-42 room parameters · A-43 text is voice · A-44 real voices sacred · A-45 mobile first · A-46 budgeted nodes · A-47 consent |

**The book's last word:** beauty in Lokoja is not decoration — it is *truth, arranged warmly*. When in doubt: less, warmer, quieter, truer.

---

## PART X — THE LIVING CONSTITUTION LAYERS
### *Added in the ERA II upgrade (v2.0). The senses, instrumented.*

### 10.1 Implementation Reality

**What exists today (disk-verified 2026-10-21, second pass):** the 3D world and all audio **100% procedural** — zero models, zero audio files, zero world photo-textures · the 2D shell's only sanctioned binaries: the painted menu hero + PWA icons + logo.svg (named in A-2) · 13 orphaned `.webp` files awaiting deletion (§7.3 debt #7) · 18 `--lko-*` tokens (13 colors + surface + line + 3 shadows) as the entire color constitution · 8 ambience layers (shaped noise at 320 / 850 / 480 / 1,400 / 140 / 4,400 / 520 / 3,200 Hz, `ambience.ts:99-106`) · a 4-mood procedural afro-fusion engine (16-step bars, C-pentatonic 261.63, the 0/7/10 kick cell, deterministic per-bar) · ACES @1.12 (`WorldScene.tsx:490-492`) · one 1024² governed shadow sun (`:359`) · 620 rain particles (`Actors.tsx:1032`) · two permanent motifs (discovery, refusal) · the paper-UI primitives (`lko-card / press / display / num / sheet / toast / scrim`) · fonts: Geist (body) + Outfit (display, `layout.tsx:2`) · canvas-baked facades with per-district washes and life-pattern night emissives.

**What is planned:** the six-step type scale replacing the ≈1,200 arbitrary sizes · one wallet grammar, one button, one sheet (§7.3's unification debts) · `--lko-*` registered in Tailwind's `@theme` · the ghost classes (`lko-glass`, `lko-label`) defined or deleted · one merged icon set · festival music arrangements (the lawful density exception, A-38) · deletion of the 13 orphaned `.webp` files (§7.3 debt #7).

**What is forbidden:** any new binary art or audio asset beyond A-2's two named families (menu hero, PWA icons) · a second visual grammar (A-30) · a third motif (A-40) · unsourced light (A-14) · motion that gates truth (A-32) · beauty that spends the mobile budget without the FramePacer/DynRes valve · icon fonts, emoji as UI iconography, glassmorphism envy.

### 10.2 The Verification Layer

| Laws | Verification method | Responsible system | Failure condition |
|---|---|---|---|
| A-1 → A-5 | Art Test on 360 px + SILK G1–G6 run | `scripts/silk-gates.ts` | illegible in sun; a gate red |
| A-2 | asset scan: no model/audio file, no world photo-texture; only A-2's two named shell families in `public/` | CI sweep | any unowned asset file appears |
| A-6 → A-8 | Color Line grep: no new hex without a token; wash family check | token registry | off-palette color ships |
| A-9, A-10 | painter read-through; layer-height registry walk | WorldTerrain/CityMesh | phototexture slap; z-fighting |
| A-11 → A-14 | light audit: one sun, per-slot keyframes, sourced glow | atmosphere/WorldScene | second caster; orphan glow |
| A-15 → A-18 | camera walk; zero-UI photo test | controls, photo mode | wrestled neck; UI-littered frame |
| A-19 → A-25 | one-species check; motion-with-reason read; particle budget | Actors, animation | blob citizens; idle-for-attention |
| A-26 → A-34 | class audit: primitives only; type-scale diff; icon set diff | globals.css, kit | new grammar; new arbitrary size |
| A-35 → A-41 | eyes-closed district test; motif census | ambience/music | an unjustified layer; motif #3 |
| A-42 → A-47 | room-params per interior; phone-speaker pass; consent check | interiors, Settings | identical rooms; autoplay; un-skippable social |

### 10.3 The Production Layer

**"How do I add beauty without breaking the law?"**

- A new color is a new token first (`globals.css`), a token never a literal (A-7).
- A new motion rides an existing vocabulary (`lko-pop / fade / toast / kenburns / float`) or it is an amendment (A-31/A-33).
- A new ambience need is a shaped-noise layer with a truth-driver and a node budget (A-36/A-46) — never a loop file.
- A new icon is an ink stroke in the drawn set, never an import, never an emoji (A-34).
- Anything optional (haze, puddles, dust, polish) enters behind the extras-first tier system (`device.ts:137-148`) — beauty's lawful valve.
- Every sensory PR ends in the Art Test (Part IX): all eight checks, in order, on the worst device you own.

### 10.4 The Future Scale Layer

- **Device span:** the low/mid/high tier contract (`device.ts`) is the scale law — a flagship-only effect is a bug (A-25/A-45). DynamicRes and the 30 Hz FramePacer absorb pressure before content is cut.
- **Content scale:** procedural means a city that *responds* (weather-aware facades, season-true palettes) at zero asset cost — a new district inherits the whole sensory machine for free if it ships its mix and wash (A-8/A-37).
- **Audio scale:** the node budget (A-46) holds at any district count; layers are data, so the census scales with the map, not with files.
- **Live events:** festival arrangements, lantern light, bunting cloth — all ride existing systems within caps; spectacle never buys its way past A-5.
- **The soul clause:** ten years from now, on a phone not yet built, a screenshot must still pass the squint test — *golden hour on zinc roofs, seen through warm paper*.


