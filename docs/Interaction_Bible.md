# LOKOJA LIFE — INTERACTION BIBLE
### The named interaction reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends `docs/Experience_Bible.md` v2.2 (the interaction
> anatomy, Parts 0/I — canon, unmodified) and the built interaction map of `docs/ERA2-UI-AUDIT.md`
> §4 (preserved as-is). Evidence: repo anchors (`components/game/world/controls.ts`, `systems/haptics.ts`,
> `components/game/world/HudOverlay.tsx`, `Actors.tsx`, `systems/wheelnet.ts`, M23 DriveSystem,
> camera laws A-15…A-17 of `Art_Audio_Bible.md`). Extensions are marked **[EXT]**.
>
> **The question this book answers:** what do the player's hands DO, moment to moment — and what
> does the world answer back?

---

## PART I — THE ONE-PARAGRAPH TRUTH

Interaction in Lokoja is proximity plus one gesture: walk close enough and the world offers; press
E (or tap the prompt) and the world opens; everything you open is a sheet above a street that never
stopped living. There is no raycasting, no crosshair world — the city is felt through distance
registries, and every interaction inherits the freeze law: the world holds your input still while
you read, but never holds its breath.

## PART II — THE REGISTRY MODEL (built; ERA2 §4 binding)

No raycasting — a per-frame distance loop over the registries, each with its own radius:

| Registry | Radius | Answer |
|---|---|---|
| 32 district anchors | 8.6u | activities/travel sheets |
| 4 job-board POIs | 5.3u | job offers |
| 98 doors (10 layout + 88 school) | 3.2u (`config.ts:101`) | interiors |
| Interior hotspots | 2.1u (`config.ts:73`) | bed/stove/TV/bath/menu/shop |
| NPCs (12 bespoke) | talk 4u, gist chip 24u (`config.ts:353`) | dialogue/favours/hangouts |
| Own vehicle | 4.6u | enter/drive |
| Other players' cars | 5u | board (stopped + consent) |
| Pump / garage | 26u — SERVER re-judged (`wheels.ts:489`) | fuel/repair |
| Vehicle shop | 28u (`HudOverlay.tsx:273`) | buy |
| 5 Patti secrets | 9u | idempotent rewards |

**The gesture:** E/Enter or touch-pin, consumed by the HUD's rAF poll with a fixed priority order —
one gesture per frame; the poll owns adjudication (`HudOverlay.tsx:486`).

## PART III — THE CORE LOOPS (built paths, each battery-proven)

1. **Walk:** joystick/WASD 4.4 u/s, sprint 7.4; energy burns past 150 m, settled on world exit
   (`controls.ts:284-304`). 3-step onboarding tour (walk→look→E) once per device.
2. **Enter & dwell:** doors at 3.2u → interior scene; hotspots at 2.1u → actions (rest, cook, watch);
   the interior is its own light/sound world (A-13).
3. **Ride (as fare):** map/travel sheet → guards in order (level→flood→river-cut→guest→fare→energy)
   → the trip is a scene, not a cut (travel events).
4. **Drive (owned):** buy in garage → car materialises parked → enter at 4.6u → N12-clamped honest
   physics-free driving (camera weight is authored, A-17) → park persists the row once.
5. **Refuel/repair:** stand within the server's eye (26u re-judged on clamped pos) → pump chip →
   idemKey pour → ledger debit → readback. The healthiest path in the game (ERA2 §1 data-flow proof).
6. **Talk:** NPC talk 4u (familiarity, favours→hustle offers, gifts, hangouts); greeting clock
   prefixes everything (NPC_Bible IV.1); gist chip at 24u invites approach.
7. **Meet (wire):** same-street walkers render as rigs at 10 Hz; DM/call/connect through the phone;
   board a consenting stopped car; proximity walkie (adult, opt-in, cap 4).
8. **Discover:** district discovery (session-spanning); Patti secrets at 9u; W-3 sightline as the
   city's standing invitation.

## PART IV — THE INPUT CONTRACT (built laws)

1. **DOM⇄3D contract:** framework-agnostic `controls.ts` owns intent; the HUD poll consumes
   gestures; **the freeze law** — any phone face or overlay freezes WASD/E/C/V so the world can
   never act behind a dialog (m24 evidence).
2. **Haptics exist** (`systems/haptics.ts`) — mobile confirmation taps ride the same intent bus;
   a UI action without its tap signature is unfinished mobile work [EXT law].
3. **One gesture, one owner:** no double-consumption; the poll's priority order is law — the
   nearest-registry offer wins ties deterministically.
4. **Camera:** the player owns their neck (A-15 — modes are offers, the only scripted motion is the
   2 s interruptible arrival veil); four modes with purpose tests (A-16); weight is authored
   (A-17 chase lag/dip/FOV).

## PART V — FAILURE & SUCCESS LANGUAGE [EXT]

1. **Every refusal narrates with a why** (the why-maps pattern — refuel's why-map in HudOverlay +
   GaragePanel) and offers the next move in one breath (EX-40.1 canon).
2. **Failure states are capped and survivable:** health 0 = rest required, never death; travel
   guards refuse with reasons; the wire-down lane degrades honestly (12s relay) instead of failing;
   tampered saves fail closed and narrate (fortress law).
3. **Success confirms in-world:** money lands with a ledger receipt; the car's tank gauge mirrors
   the ack; the plate renders on the rig — success is always a state change the world can show,
   not just a toast.

## PART VI — NEW-INTERACTION CHECKLIST [EXT — the expansion law]

Any new interaction must declare: (1) its registry + radius, (2) its gesture path through the poll
priority, (3) its freeze scope, (4) its why-map refusals, (5) its haptic signature, (6) its world
success signal, (7) its guest/minor walls at the door, (8) its N11 overlay cost if it opens a sheet.
Missing any row = not ready to build.

## PART VII — GATES

1. Probe script prints the full registry table live (radii + counts) — drift from §II is a bug.
2. Freeze test: open phone while walking/driving — zero world input leaks (m24 suite re-run).
3. Why-map audit: every refusal string sampled from a real run has a why + next move (EX-40.1).
4. Poll priority determinism: two overlapping offers resolve identically across 100 runs.
5. Arrival veil interruptible within 2 s by touch (A-15 assert).
