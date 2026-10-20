# LOKOJA LIFE — EXPERIENCE BIBLE
### Version 2.0 · The book of how the player should feel

> **Authority.** This Bible is subordinate to the **Design Constitution** (the Philosophy Bible). Where this document and the Constitution disagree, the Constitution wins. This document turns the Constitution's laws into felt experience, one experience at a time.
>
> **Companions.** `World_Bible.md` (the place), `Art_Audio_Bible.md` (the senses), `Content_Bible.md` (the growth rules). This document owns **the player's inner weather**.
>
> **Ground rule.** Every anchor marked `file:line` was verified on disk. Lokoja Life's engine truth is the floor this book builds on — nothing here asks the engine to become something it is not.
>
> **Upgrade (v2.0, 2026-10-21).** The ERA II reverification pass: every claim re-verified against disk, stale scar anchors corrected, numeric drift amended — and the living-constitution layers added: Implementation Reality (§47), Verification (§48), Production (§49), Future Scale (§50), plus the four Foundation Laws (EX-44 → EX-47, Part X). Audit of record: `docs/BIBLE_UPGRADE_AUDIT.md`.

---

## PART 0 — HOW TO READ THIS BOOK

### 0.1 What this document is

This is not a UI specification. It does not describe buttons, sheets, or layouts — the UI audit (`ERA2-UI-AUDIT.md`) owns those. This book answers a single question for every experience the game offers:

**How should the player feel?**

A "feature" is code. An "experience" is what the code does to a human being. Lokoja Life has plenty of features — 63 systems, 26 phone apps, a 750 km road network decoded from real OSM data (`public/world/geo-v1.bin`, 2,655 ways). What it needs now, and what this book provides, is the felt contract for each of them: the emotion we promise, the senses we use to promise it, the mistakes that would break the promise, and the rules that keep it whole.

Any designer, programmer, writer, or QA engineer should be able to open this book, find the experience they are touching, and know — without asking anyone — what the player must feel when they are done.

### 0.2 The anatomy of every experience

Every experience in this book is written in one fixed format. If you add a new experience to the game (see `Content_Bible.md`), you write its entry in this same format or it does not count:

| Field | Question it answers |
|---|---|
| **Purpose** | Why does this experience exist at all? What would be lost without it? |
| **Emotions** | The exact feelings we promise, in order. Not "fun" — precise words. |
| **Visual language** | What the player's eye is given (light, color, motion, composition). |
| **Audio language** | What the player's ear is given (the 8 procedural ambience layers, music, silence). |
| **Animation philosophy** | How the world moves during this experience, and why it moves that way. |
| **Interaction philosophy** | What the player's hands do, and why that and nothing else. |
| **Common mistakes** | The specific failures we have already seen (real bugs from real audits) or can predict. |
| **Design principles** | The numbered, testable laws. |

### 0.3 How QA reads this book

Every experience entry ends with laws phrased so they can fail. "The player should feel safe" is not testable. "A first-hour player must never lose naira to a system they did not knowingly touch" is testable. QA files bugs against the **law numbers** (`EX-12.3`), not against vibes. If a law cannot be tested, it is rewritten until it can be.

---

## PART I — THE FEELING DOCTRINE

### 1.1 The one question

When a player closes Lokoja Life, the thing they keep is not the geometry. It is a temperature in the chest. Our whole craft is aimed at one sentence:

> **"I was in Lokoja today, and Lokoja knew me."**

Everything else — the 3D city, the phone, the economy, the multiplayer wire — exists only to make that sentence true. If a change improves a metric but cools that sentence, the change is wrong. If a change costs performance but warms it, we still measure twice and cut once — but we never forget which side wins.

### 1.2 The emotional band

Lokoja Life lives inside a narrow, deliberate emotional band, and every experience in this book stays inside it:

**Warm · wry · honest · unhurried.**

- **Warm** — the city leans toward the player. Sunlight, food, greetings, the neem tree's shade. Even refusals are warm (they explain themselves — the Verdict Voice).
- **Wry** — Nigerian humor lives in the copy: the danfo conductor's shout, the "no be small money o" flavor of prices, the gentle tease of a gossip chip. Never at the player's expense; always alongside them.
- **Honest** — the game never lies about state. If the wire is down, the HUD says the wire is down (`wire.ts` honest lane states). If the save is tampered, it fails closed and narrates. If content is unbuilt, it says `stage: 99` — "arrives later" — instead of pretending.
- **Unhurried** — Lokoja is not a game that grabs. Nothing ticks down at the player. The world never pauses (`NO-PAUSE` canon), but it also never rushes. Pressure is the one emotion this game refuses to manufacture.

**Forbidden feelings** (any experience that produces these is broken, whatever its metrics say): *manipulated, hurried, spied upon, cheated, condescended to, small.*

### 1.3 Feel over feature

**Law EX-1: No feature ships without a feeling contract.**
Every PR that adds or changes a player-facing system must name, in the description, which entry of this Bible it serves and which emotion it promises. A PR that cannot name the feeling is not ready to merge. This is the single cheapest quality gate we own, and it costs one sentence.

**Law EX-2: The body remembers.**
Players forget UI states; they remember textures — the crunch of harmattan underfoot, the sodium-orange pools at night, the first time a stranger's car stopped and they rode along. Budget attention accordingly: one unforgettable texture beats ten forgettable features.

**Law EX-3: One world, no exits.**
The city is the interface. Every experience in this book must be reachable from *inside the world* — through a door, a person, a phone that exists in the world's pocket — not through an abstract menu layer that yanks the player out. Where a menu is unavoidable (creation, settings), it must be styled as part of Lokoja's paper world, not as foreign software.

### 1.4 The ten-question spine

Every experience entry below implicitly answers the classic ten: Why does it exist · How does it feel · What does the player do · What do they see · What do they hear · What do they touch · What emotion remains · What mistakes must we avoid · What rules govern it · What does the future hold. Where a chapter's "future" matters for planning, it carries its own short *Horizon* note.

---

## PART II — THE THRESHOLD
### *The first contact experiences. A player decides what Lokoja is here, in minutes.*

### EX-2 · First Launch

**Purpose.** First launch is the handshake. Its only job is to make the player *glad they came* before they have done anything. The game already earns this honestly: the menu is interactive immediately, world chunks idle-preload, and the geo binary is a 60 KB file behind the world gate (`page.tsx:89-110`, `sw.js:36-45`). The player waited nothing; the game must make that feel like generosity, not luck.

**Emotions.** Curiosity → ease → "this place is warm." No anxiety. No choice paralysis. No login wall — **guest-first is doctrine** (`MainMenu.tsx`): a stranger may walk in without giving anything.

**Visual language.** Painted key art with a slow Ken Burns breath, live-wire ribbon (proof other people are alive in this city right now), four stat chips. Paper and ink, not glass and chrome — this is a *place's* poster, not a SaaS landing page.

**Audio language.** Silence on boot is correct — mobile browsers forbid autoplay and surprise sound would be a violation of consent. The first sound should be *chosen by the player* (their first tap that enables audio), and it should be the city: breeze and distant horns (ambience layer stack, `ambience.ts:37-106`).

**Animation philosophy.** One breath, slowly. Ken Burns on the hero, a gentle ribbon marquee. Nothing bounces for attention; nothing spins to fake speed.

**Interaction philosophy.** Four doors, clearly painted: Start, Continue, Log in, Settings. A returning player must reach their city in one tap. A new player must reach creation in two. Never more than that.

**Common mistakes.**
1. *Banner stacking.* The audit found five banners + onboarding + goals above the hero — first real content ~1.5 screens down on a 360px phone (`Dashboard.tsx:125-141`). The threshold must breathe.
2. *Login dead-ends.* The 60-second guest preview wall can dead-end an inattentive newcomer behind signup. Walls must always show the *why* (Verdict Voice) and a way *around or through*.
3. *Stale era copy.* "Stage 4/Stage 5" strings scattered in copy (`PhoneScreen.tsx:87`, `Dashboard.tsx:363`) tell the player the hand on the wheel is unsure. Era copy belongs to exactly one owned constant.

**Design principles.**
- EX-2.1: A brand-new player reaches character creation in ≤ 2 taps from cold boot.
- EX-2.2: No authentication is ever required to *enter the world*; identity is an upgrade, not a gate.
- EX-2.3: The menu contains no metric, banner, or number the player did not earn.
- EX-2.4: TTI stays under the SILK gate (gate < 3.0 s, `scripts/silk-gates.ts`; last measured 2.59 s, 2026-10-20 — re-measured per Content C-13, never assumed). First launch *is* the first feeling of the city's unhurried honesty — a slow, janky boot contradicts everything.

### EX-3 · First Arrival

**Purpose.** The moment the veil lifts and the player is *standing in it*. This is the game's opening sentence and its thesis: you have arrived in a real place. Spawn is at the player's location anchor +4/+5 units with a "Entering Lokoja…" veil until the first frame renders (`Dashboard.tsx:878-977`, `WorldTab.tsx:56-110`).

**Emotions.** Disorientation (brief, deliberate) → orientation → first awe (the city stretches toward the horizon) → possessiveness ("this is *mine* to walk").

**Visual language.** The veil lifts like morning fog, not like a loading screen — it should feel like opening your eyes, not like software finishing. First light of the day slot the save carries; the camera low enough that streets read as streets, high enough that the horizon reads as *somewhere*.

**Audio language.** The ambience bed fades in over ~2 s, never a cut: breeze base layer (always present), river layer if near water, horns distant (all procedural, `ambience.ts:82-106`). No sting, no jingle. Cities do not have soundtracks when you enter them; they have *air*.

**Animation philosophy.** The player rig does not drop from the sky or pop. It *is* there. NPCs continue their strolls mid-stride — **the city never blinks**: the world was moving before you arrived and will move after you leave.

**Interaction philosophy.** The only prompt in the first 30 seconds is the 3-step tour (walk → look → interact, once per device, `HudOverlay.tsx:394-919`), phrased as a neighbor's advice, not a tutorial. No quest text. No objectives. The first objective is the city itself.

**Common mistakes.**
1. *Cinematic seizure.* Camera flyovers that wrestle control from the player. Awe is earned by letting them turn their own head.
2. *Popup storm.* Notifications crowding the first minute. The city speaks when spoken to.
3. *Dead horizon.* If the geo gate fails, the fallback is the 2D map — honest, but the *arrival* must never be allowed to look broken; the veil stays until the first real frame.

**Design principles.**
- EX-3.1: The veil lifts only on a fully rendered first frame; never on "assets almost ready."
- EX-3.2: The player's first 30 seconds contain at most one prompt (the tour step).
- EX-3.3: At least 12 NPCs and 14 traffic rigs are alive within sight or earshot of spawn on every arrival (`NPC_COUNT = 12`, `Actors.tsx:356`; `TRAFFIC_MIX`, `Actors.tsx:749`) — the arrival must never feel like an empty stage.
- EX-3.4: The world does not pause for the tour. The tour is advice shouted over a living street, not a freeze-frame.

### EX-4 · The First Five Minutes

**Purpose.** To convert curiosity into a body. In five minutes the player should have: walked, turned their head, pressed E on something real, and earned or spent their first naira *inside the world*. Day 1 grants ₦5,000 (`config.ts:14`) — enough to touch the economy, not enough to skip it.

**Emotions.** Competence ("I know how to move") → appetite ("what's down that street?") → first transaction warmth.

**Visual language.** Ground-level richness: road markings underfoot, kerbs, drains, zebra stripes — the city is legible at shoe height (`WorldTerrain.tsx` markings/kerbs/zebras). Landmarks visible down avenues give the eye somewhere to walk.

**Audio language.** Footsteps implied by surface (procedural), market layer swells near Kpata, crickets at the edges of town. The audio must always be telling the truth about what is near.

**Animation philosophy.** Movement is weight, not glide: 4.4 u/s walk, 7.4 sprint (`controls.ts`), a bob that lives in the body, and NPCs whose strolls cross the player's path naturally.

**Interaction philosophy.** The distance-loop registries make the world grabbable: anchors at 8.6 u, POIs 5.3 u, doors 3.2 u, hotspots 2.1 u (`Actors.tsx:259-291`). One button — E — opens whatever is nearest and honest. The first E-press should grant a *result within one second* (an activity sheet, a fare, a door).

**Common mistakes.**
1. *The empty five minutes.* If spawn lands where nothing is interactive in range, the game has lied about being a city. Anchor placement is a feel decision, not just data.
2. *Money tutorial-itis.* Forcing the ₦5,000 into a guided shop. The money should itch in the pocket, not wave a flag.
3. *Prompt flooding.* Multiple competing interaction chips. The priority order in the HUD poll is law.

**Design principles.**
- EX-4.1: From spawn, at least one interactive door, POI, or anchor is reachable within 20 seconds of walking, in every launch district.
- EX-4.2: The player's first E-press must open a real, wired activity — never a stub, never "coming soon" inside the first hour (locked `stage: 99` rows may only appear after the first hour).
- EX-4.3: ₦5,000 must be *touchable* in the first five minutes (a fare, a meal, a market row) without being *required to*.

### EX-5 · The First Hour

**Purpose.** The hour that decides whether Lokoja becomes *a place the player lives* or *a demo they saw*. By minute 60 the player should have: a name they chose, one meal eaten, one transaction that moved real ledger state, one discovery logged, and — the real prize — one *plan* ("tomorrow I'll climb Patti").

**Emotions.** Ownership → rhythm (morning/afternoon/evening begins to mean something) → anticipation. The Constitution's arrival arc names this the move from **Stranger** toward **Regular**.

**Visual language.** The 4-slot day clock should complete at least one visible transition in the first hour (morning → afternoon light keyframes, `atmosphere.ts`). Light change is the cheapest proof that time here is real.

**Audio language.** The player should be able to *hear* the day turn: horns thin out, crickets rise, the zinc layer settles. If a player can close their eyes and guess the slot, the audio bible is working.

**Animation philosophy.** The city's loops (traffic on loops 0/1/2, NPC strolls) must visibly *differ* by slot — night thins crowds to 4 strollers and adds headlight cones (`Actors.tsx`). Repetition with variation, never repetition.

**Interaction philosophy.** By now the phone has appeared as the second OS (26 apps, `PhoneScreen.tsx:797-1155`). It must be introduced by *need*, not by tour: the first fare, the first transfer, the first friend. The phone is discovered like a drawer in a new flat.

**Common mistakes.**
1. *The wall.* The 60 s guest wall arriving mid-flow and cutting a first hour in half. Walls must be scheduled against the player's momentum, and always carry an honest why.
2. *Feature dump.* Showing 26 apps at once. The phone grows as the player's life does.
3. *Discovery inflation.* Firing the discovery toast for merely passing through. Discovery must cost attention.

**Design principles.**
- EX-5.1: Within the first hour every player completes: 1 meal, 1 real ledger transaction, 1 district discovery, 1 conversation (NPC or player).
- EX-5.2: No wall, gate, or paywall interrupts an in-progress first interaction.
- EX-5.3: At least one visible day-slot transition occurs in the first hour, with matching light + audio.
- EX-5.4: The first hour ends with the game *smaller and warmer*, not bigger and louder: fewer visible systems than exist, all of them real.

### EX-6 · Leaving and Returning

**Purpose.** The experience of trust. Lokoja Life is played in stolen minutes on phones — the game must treat every exit as temporary and every return as a homecoming. Autosave debounces at 1.2 s with a pagehide flush (`useGameStore.ts:1433-1438`, `:1394-1419`); Continue restores position, money, vehicles, story.

**Emotions.** On leaving: nothing — leaving should be boring, safe, invisible. On returning: being *remembered*. Your car where you left it, your money intact, your day resumed. **This is Lokoja Knows Your Name made mechanical.**

**Visual language.** Continue drops you where you stood, at the location anchor, with the veil's briefest version. No menus recap; the world itself is the recap.

**Audio language.** The ambience bed resumes exactly as it left. Continuity of air is continuity of trust.

**Animation philosophy.** No splash, no replayed intro. Return is a *cut*, not a ceremony.

**Interaction philosophy.** One tap from cold boot to standing in your street. If reconnecting to the wire, the hello re-claim keeps the last honest moment and `resume` replays the gap, capped at 100 (`index.ts:537-540`) — the player should perceive none of this machinery, only that *things kept happening honestly*.

**Common mistakes.**
1. *The lost minute.* Any loss of state on return — even a cosmetic one — is a betrayal. The save's HMAC envelope + shadow + backup descent (`save.ts`, fortress) exists so this never happens; every new system must save through it.
2. *The silent wire.* Reconnecting without narration. If the wire is down, say so; if it just healed, don't celebrate — just be whole.
3. *Two writers, one save.* Multi-tab double-writes. Until a session lock exists, copy must warn honestly when another tab is alive (open audit item).

**Design principles.**
- EX-6.1: Return-to-city from cold boot in ≤ 2 taps, ≤ 3 s to first interactive frame.
- EX-6.2: Zero state loss across any exit path (crash, pagehide, tab kill, wire drop). QA treats every loss as a P0.
- EX-6.3: The world moves *while you are gone* where the simulation honestly can (day clock advances via slots), and *never fakes* what it cannot (no invented "while you were away" events).
- EX-6.4: Reconnect gaps replay silently, honestly, and capped; the player is never shown raw ledger machinery.

---

## PART III — THE BODY IN THE CITY
### *Movement experiences. The city is only real if the body believes it.*

### EX-7 · Walking

**Purpose.** Walking is the base experience — the heartbeat of "I live here." Every other movement is a deviation from walking, and must be justified against it. Walking is how the city introduces itself: its smells (implied), its sounds, its people, its distances. It is deliberately *not* fast.

**Emotions.** Presence → rhythm → noticing. The emotion of walking in a real Nigerian town: nobody hurries without a reason; you walk because walking *is* the day.

**Visual language.** Ground truth first: tarmac, markings (+0.106 layer), kerbs, drains, zebra crossings underfoot; facades at eye level; the horizon only when a street opens. The eye-level world must be richer than the skyline — if the player stares down and it's empty, the city is a lie.

**Audio language.** Surface truth: the lowpass breeze bed (320 Hz base, `ambience.ts:99`), market swell near commerce, river band (850 Hz) near water, horns band rising with traffic proximity (`ambience.ts:27` — road proximity drives horns). Walking must be *listenable* with eyes closed.

**Animation philosophy.** Weight and economy. The procedural bob lives in the hips, arms counter. NPCs use the same grammar — 12 strollers in 13 zones (`Actors.tsx:356`) share the player's motion language so the city feels like one species.

**Interaction philosophy.** Walking is not a menu. It *is* the menu: the distance-loop registries (anchors 8.6 u / POIs 5.3 u / doors 3.2 u / hotspots 2.1 u, `Actors.tsx:259-291`) turn proximity into affordance. The player should feel that *being near a thing is the interface for the thing*.

**Common mistakes.**
1. *Walking as waiting.* If walking feels like dead time to skip, we have failed and fast-travel will eat the game. Walking must reliably drop discoveries, gist, and small money.
2. *Distance lie.* OSM honesty says roads are real (750 km). Distances must *feel* real — 1 u = 26 m is law (`geo.ts:7-38`). Never silently shrink the city to please impatience; give impatience a keke instead.
3. *Silent streets.* No ambience variation by district makes walking a screensaver.

**Design principles.**
- EX-7.1: Every 60 s of walking in a launch district passes at least one wired affordance (door, POI, anchor, NPC, parked car).
- EX-7.2: Energy only burns past 150 m of continuous travel, settled on world exit (`controls.ts:284-304`) — the tiredness law. Never let a 30 s walk punish the player.
- EX-7.3: Every district has a distinguishable ambience mix within 10 s of entering it.
- EX-7.4: Walking speed is sacred: 4.4 u/s walk / 7.4 sprint. Changes require a Bible amendment.

### EX-8 · Running & Tiredness

**Purpose.** Sprint exists for *intent*, not escape: you run because you are late for something you chose. The tiredness that follows (energy burn settled on exit) is the city reminding the player that bodies cost — softly, never punitively (Soft Failure doctrine).

**Emotions.** Urgency (self-chosen) → the pleasant cost of it → the satisfaction of sitting down after.

**Visual/Animation.** Sprint lengthens the stride, tightens the camera FOV slightly, raises wind layer. Tiredness shows in the body first (slower bob) before any UI says a word.

**Interaction philosophy.** Running past things is allowed — the world doesn't punish it. But the affordance loop notices: sprinting through a market drops no discovery. Attention is the currency; the city pays it.

**Common mistakes.** Making energy a *timer* (anxiety manufacture — forbidden). Making rest a chore (sitting must be one press, anywhere a bench exists).

**Design principles.**
- EX-8.1: Sprint never triggers negative consequences beyond energy cost; nothing chases, nothing times out.
- EX-8.2: Energy low-state is narrated by the body and one honest HUD whisper, never by an alarm.
- EX-8.3: Rest is always ≤ 1 interaction away from where tiredness can be earned.

### EX-9 · Riding as a Passenger (Keke · Taxi · Danfo)

**Purpose.** The passenger experience is *Lokoja as cinema for the poor man's price*: ₦ fares from the real pricing law (base + distance rate, rounded to the naira step, `travel.ts:70-73`), windows on the world, and the small social contract of shared rides. It is also the honest answer to distance: **Earned Convenience** — the city doesn't shrink; you pay a brother.

**Emotions.** Relief (arriving without the walk) → spectatorship (the city from a moving frame) → the tiny negotiation warmth of paying a fare.

**Visual language.** Camera rides slightly outside the vehicle's frame — a little wider than walking, a little lower than drone. Motion blur is forbidden (cheap); parallax through real streets is the effect. Other rigs and walkers stream past honestly at their real cadences.

**Audio language.** The horns layer peaks; engine drone (procedural) sits under conversation; when multiplayer passengers share the ride, voices come through the real call stack (P2P, M13-walled).

**Animation philosophy.** The vehicle obeys the road fabric: loops 0/1/2 (`TRAFFIC_MIX`, `Actors.tsx:749`), junction phases (GREEN 12 / AMBER 3 / RED 15, `junctions.ts:52-54`), speed bumps (`BUMP_CAP 12`). A ride that ignores signals is a broken promise.

**Interaction philosophy.** Boarding and leaving are single intents. Fares are quoted before boarding, guarded in order (level → flood → river-cut → guest → fare → energy, `useGameStore.ts:3503-3604`) — the player must always know the price *before* the commitment.

**Common mistakes.**
1. *Fast travel in disguise.* Rides must traverse the real world along real roads. Any teleport is a lie and requires its own telecard fiction (postcards/`/t/[code]` are the only sanctioned teleport — they *cost* a story beat on purpose).
2. *Free convenience.* Fares are conserved economy: no fare-free rides after the first session.
3. *The vanishing ride.* Vehicles popping in/out at ride edges. Streaming seams are a feel crime at passenger speed.

**Design principles.**
- EX-9.1: Fare is quoted, consented, then paid — never silently debited (the double-pay bug, `useGameStore.ts:4999`/:4801, is the eternal shame; one-intent-one-payment is law).
- EX-9.2: Rides cross the city on the real road graph, junction law included.
- EX-9.3: Travel guards always narrate the *why* of a refusal in Verdict Voice.

### EX-10 · Driving

**Purpose.** Ownership made physical. The car is the player's biggest purchase, and driving is the experience that must *justify* it: speed with responsibility, fuel with real weight, and the city reshaped by your windshield. Fuel and odometer are **disk truth via the wire** — the server re-judges the pump on its own clamped car position (`index.ts:1460-1464`), debits through the chain-hashed ledger (`index.ts:963-1019`). This is the healthiest path in the game, and every driving feel depends on its trustworthiness.

**Emotions.** Pride (it's mine) → flow (the road) → responsibility (fuel gauge is honest; the tank is a bill).

**Visual language.** Chase cam with weight: lag on yaw, dip on braking, the hood visible on keke/taxi/danfo. Speedometer as HUD whisper (W4 law — analog face, digital truth, `HudOverlay.tsx:931-962`).

**Audio language.** Engine drone keyed to speed, not RPM theater; horns layer thickens; rain on the roof during storms. The engine must never mask the city — you drive *through* Lokoja, not out of it.

**Animation philosophy.** The N12 server clamp is the physics of honesty: no nitro, no drift heroics the wire would have to forgive. Weight transfer is felt in camera, not in fake physics — there is **no physics engine** (custom 2.5D, `collision.ts:30-211`); the *feel* of weight must be authored in camera and audio, and it must be.

**Interaction philosophy.** Enter at 4.6 u, park as an intent (park mode exists), refuel as a ritual (pump chip at 26 u, server re-judged). The car is also social: players board each other's real cars (seats), and the disconnect path persists the car honestly (`VehicleRow`) — the car outlives the session, like a real one.

**Common mistakes.**
1. *The split-brain tank.* Offline tank never burns while the server's does (open audit item). One car, one truth — until unified, never show two fuel numbers.
2. *The shared-rig theft.* Two cars with same model:paint mounting one `rig.group` — cars vanish/teleport (`RemoteVehicles.tsx:114/:179/:221`). Multiplayer presence trust dies here; the per-instance rig fix is a feel-blocker, not a polish item.
3. *Ghost economy.* Client-side minting anywhere near driving (the historic deposit-mint scar — dead since the server's day-cap and rate eyes; `ledger.ts` today holds only pure verdicts). The wire is the only wallet that matters at the pump.

**Design principles.**
- EX-10.1: All money mutations while driving are server-authoritative and idempotent (idemKey replay law).
- EX-10.2: The car persists across sessions at its last honest state, always.
- EX-10.3: Speed clamps are server law (N12); the client may not feel faster than the truth.
- EX-10.4: One vehicle = one rig instance, per viewer, forever (until fixed, do not add features that increase rig sharing).
- EX-10.5: The speedometer, fuel whisper, and park prompt must never compete with each other — one whisper at a time (Whisper HUD).

### EX-11 · Riding an Okada

**Purpose.** The okada is Lokoja's folk transport — the lean, loud, negotiation-flavored one. As an *experience* it is the spice between walking and driving: cheap, fast, exposed, a little thrilling. It is also the aspirational first vehicle: the player's first taste of *owning* the road.

**Emotions.** Zip → exposure (wind, near-misses as theater, not danger) → street smarts ("I know what a ride should cost").

**Visual language.** Narrower camera, higher lean into turns, the driver's silhouette ahead of you. At npc/ambient level okadas thread gaps cars cannot — the *texture* of Lokoja traffic.

**Audio language.** Higher-pitch drone, louder presence in the horn band, the okada's own texture. It should be identifiable *by ear* in traffic.

**Animation philosophy.** Lean is the whole performance: banking into junctions, feet down at stops. Okadas obey the same junction law as everything else — folklore, not anarchy.

**Interaction philosophy.** As passenger: hail, agree fare (verbal contract in copy), ride. As owner: it lives in the garage like the others, carries the plate law (unique plates, DMV wall). Okada-specific hustles (delivery runs) may later make it an *income* machine — Content Bible playbook governs.

**Common mistakes.** Making okadas physics clown-cars (wobble for comedy); pricing them as taxis (they are the people's tier — the fare law's modifier per location handles this honestly, `travel.ts:9`).

**Design principles.**
- EX-11.1: Okada rides cost distinctly less than taxi for the same route, by data not by exception.
- EX-11.2: Okada presence is audible before visible (if the fleet renders it, the fleet sounds it).
- EX-11.3: Okadas never clip the collision law — folklore in flavor, honest in physics.

### EX-12 · On the River (Boats & the Confluence)

**Purpose.** The Niger–Benue confluence is Lokoja's soul made water — the thing the city is *named for* (Lokoja ≈ "the confluence place"). Riding the ferry or watching the sand landings is the experience of *scale*: the city suddenly small between two great rivers. Boats exist in the world as craft (`CityMesh` boats; deck + canoe at the Confluence), and the ferry is a real fare path (`rivers.ts` ferry).

**Emotions.** Awe → humility → the pleasure of being small. Then the *pull of the far bank* — the classic Lokoja daydream.

**Visual language.** Wide compositions. The confluence seam where two waters meet (honest to real hydrology — the geo layer carries 16 rivers and 16 bridges), boats as slow punctuation. Golden hour owns this place.

**Audio language.** The river layer (bandpass 850 Hz) takes the lead; city layers fall away. Water against hull is procedural texture, not a loop. Silence here is load-bearing (Art & Audio Bible, Silence chapter).

**Animation philosophy.** Boats move like *weight in water*: slow, deliberate, no bobbing for cuteness. The water itself is currently still (`Actors` — no flow animation; boats supply motion) — boats moving on still water must be composed so the stillness reads as calm, not error.

**Interaction philosophy.** The river is a *place*, not just a road: the deck, the canoe, the (future) sand landing activities are experiences of watching and being watched. Fishing, net-mending, sand-landing activities exist as G2 honesty rows (`stage: 99` — they arrive when they can be real).

**Common mistakes.**
1. *Swimming lie.* Collision blocks water entry today — the river refuses the body. Until swimming exists (it may never), the refusal must be *narrated* (Verdict Voice: the river is strong), never a silent wall.
2. *Postcard scenery.* If nothing at the river can be touched, it's a wallpaper. At minimum: the deck is a seat, the flag is a mark, the canoe is a photograph.
3. *Ferry as teleport.* Same law as rides: real water, real distance, real fare.

**Design principles.**
- EX-12.1: The Confluence is a *destination*, not a decor: at least one seated, one photographic, and one social affordance exist there at all times.
- EX-12.2: Water is respected: no body enters it uninvited; every refusal narrates.
- EX-12.3: Ferry fares follow the same consent law as road fares (quote → consent → pay).
- EX-12.4: The confluence view must be protected by the composition law: no building, UI, or future content may occlude the two-rivers sightline from the deck or Patti (see World Bible, Landmarks).

### EX-13 · Climbing Mount Patti

**Purpose.** The pilgrimage. Mount Patti (1u≈26m world's high ground with the Patti mound authored into `heightAt`, `layout.ts`) is the city's crown and its *meaning*: history (Lugard's Rest House), nature (baobab, quarry cave), signal (the mast), and reward (the summit stone). Five secrets exist and are idempotently rewarded (2 Hz poll, 9 u radius, `patti.ts:64-116`). The climb is the game's longest single arc of effort → view.

**Emotions.** Resolve (the trail is long on purpose) → curiosity (five secrets pull like breadcrumbs) → awe (the city below, both rivers) → quiet pride (Elder status energy).

**Visual language.** The trail is authored (`PATTI_TRAIL`, `layout.ts`), terraced and rocky (110 rocks, `layout ROCKS`); the summit view is the one composition in the game allowed to be *epic*. Rest House and tower are waypoints the eye trusts.

**Audio language.** City layers thin with altitude; wind rises; birds own the middle altitudes; at the summit — near-silence with air. The climb should be *audibly* an escape from the city's noise.

**Animation philosophy.** Slopes slow the body honestly (terrain cost in movement); the rig leans into grades. No teleport shortcuts — the trail is the experience (Earned Convenience: the cable-car, if it ever comes, must *cost* a story or a fare, never a button).

**Interaction philosophy.** Secrets discover at 9 u with a 2 Hz check — presence-based, not button-based: you *arrive* at a secret, you don't grind it. Each discovery narrates its own history in one honest paragraph.

**Common mistakes.**
1. *Skip culture.* Any exploit that lands the player at the summit without the trail breaks the entire economy of the climb. Collision law covers slopes; QA walks the trail every release.
2. *Secret spam.* Rewards that trivialize the climb (money bombs). Secrets reward *knowledge and view*, with modest, story-flavored grants.
3. *Dead summit.* The summit stone must always be a *place* — seat, photo, mark — never just a trigger.

**Design principles.**
- EX-13.1: The full climb must take long enough to feel earned (target: several real minutes from base) and short enough to retry (no fail states, Soft Failure).
- EX-13.2: Exactly five secrets; the set is closed by law until the Content Bible's collectible playbook amends it.
- EX-13.3: Discovery rewards are idempotent — a secret never pays twice (disk law today; keep it eternal).
- EX-13.4: The summit sightline (both rivers + city grid) is a protected composition; see EX-12.4.

---

## PART IV — DOORS & ROOMS
### *The enclosed experiences. Inside is where the city becomes personal.*

### EX-14 · Entering Buildings

**Purpose.** A door is a promise: *something different is in here.* Crossing a threshold must always change the sensory contract — light, sound, scale, air. Today 10 interiors exist with data-authored hotspots (bed, stove, fridge, sofa, TV, bath, wardrobe, menu, shop — `interiors.ts`), plus 98 school doors (108 doors total across layout + schools). The promise must hold at every one.

**Emotions.** Threshold curiosity (what's in here?) → intimacy (the world narrows) → ownership or welcome (mine, or someone else's place that receives me).

**Visual language.** The interior is warmer, closer, quieter in palette: interior lighting keyframes differ from exterior day light; walls near, ceiling present. The seam must be instant — no fade long enough to read as a loading screen; doors are *cuts* in space.

**Audio language.** The `room` layer (lowpass 140 Hz, `ambience.ts:103`) engages: city sounds muffle to memory, interior surfaces answer. A bank must sound different from a lounge — the room layer is a parameter, not a switch.

**Animation philosophy.** The player does not shrink into a door; the door *admits*. NPCs inside use the same body grammar. Nothing inside jitters — interior collision is solid furniture law (`solid: true` on hotspot geometry, `interiors.ts:39-57`).

**Interaction philosophy.** Hotspots at 2.1 u are the *furniture-as-interface* law: the bed is sleeping, the stove is cooking, the TV is evening, the wardrobe is self. You never open a menu to use a room — you walk to the thing. **Buildings are the interface** is the Constitution's doctrine; interiors are where it is most literal.

**Common mistakes.**
1. *Dead rooms.* An interior with nothing to touch is a broken promise — worse than no interior. Every interior ships with ≥ 3 wired hotspots or it doesn't ship.
2. *The stuck door.* Interior exit must be as instant and reliable as entry. QA walks every door both ways each release.
3. *Copy-paste air.* All interiors sounding/feeling identical. Room layer parameters are per-building-type data.

**Design principles.**
- EX-14.1: Every door leads somewhere *different* — no interior may be a reskin of another (type + hotspots + room layer must all differ).
- EX-14.2: Threshold transition ≤ 1 s of non-interactive time, in both directions.
- EX-14.3: Inside, the city remains honest: the wire stays live, time keeps its slot, the phone still works (the world never pauses — NO-PAUSE canon).
- EX-14.4: Furniture IS interface: any future interior must express its functions as walkable hotspots first, panels second.

### EX-15 · Being Home

**Purpose.** The emotional base camp. The home is where the day starts and ends, where the ₦5,000 began, where the wardrobe and bed and stove mean *you*. Home must feel like the one place in Lokoja that is unconditionally yours — the anchor of belonging (Constitution: Stranger → Regular → Elder).

**Emotions.** Safety → privacy → the soft pride of a place kept → the ache to improve it (housing ladder is real: rent book, wahala, ownership, furnishing, comfort sleep bonus — `housing.ts`).

**Visual language.** Warm interior key, personal light; furnishing visibly *changes* the room as the player invests. The room is a diary: what you own is on display.

**Audio language.** The room layer at its most intimate; rain on the roof is a home-only pleasure; night brings the softest city bed ever — you hear Lokoja *from your pillow*.

**Animation philosophy.** Domestic gestures are slower than street gestures. The body relaxes here — longer idle fidgets, slower bob.

**Interaction philosophy.** Bed = sleep = save (Sleep Is Saving). Stove = eating economy. TV = evening slot pleasure. Wardrobe = identity. Bath = refresh. Every domestic loop is one hotspot away. Rent, wahala, and the ownership ladder live here too — home is also a *responsibility*, handled with Soft Failure (a rent miss never ends the game; it costs face, comfort, and a neighbor's remark).

**Common mistakes.**
1. *Home as menu.* If the dashboard tab feels more like "home" than the 3D room does, the doctrine has failed — the room must always be the truest home; the dashboard is its paper shadow.
2. *Punitive rent.* Money stress is allowed; eviction spirals and homelessness are forbidden (Soft Failure).
3. *Silent furnishing.* Upgrades that don't show. Every naira spent on home must be *visible* in it.

**Design principles.**
- EX-15.1: Sleep at home is always the best save: comfort bonus is real (`housing.ts`) and narrated.
- EX-15.2: Home state is always visible in the room itself (furnishing level, wear, comfort) — no hidden stats.
- EX-15.3: Rent/ownership systems never produce a dead-end state; every wahala has a next move in Verdict Voice.
- EX-15.4: The word "home" in copy always means the place, never the UI.

### EX-16 · The Market

**Purpose.** The market is the city's heartbeat and its loudest *proof of life*: commerce with a body — haggling texture, crowd energy, the roar of the horn band at full color. Kpata Market is the commercial heart; Ganaja Junction the crossroads; Mama's Food Strip the evening stomach. **Current disk truth is a debt we name: stalls computed live = 2 (both Ganaja), Kpata 0, food-area 0** — the `roadGap < 0.45` filter (`layout.ts:1660`) wipes the rows. Until that dies, the Market chapter is aspirational law; the fix is Gate-0-adjacent and must land before any market feature ships.

**Emotions.** Stimulation (sound, color, crowd) → negotiation play → the small triumph of a good price → abundance.

**Visual language.** Density and color: stalls tight to the road edge, awnings, goods stacked with proud disorder, crowd silhouettes. Market light is warm even at noon.

**Audio language.** The market layer (lowpass 480 Hz) leads; horns at full presence; the murmur band doing its work. A market should be *louder than its signage*.

**Animation philosophy.** Vendors work (procedural gestures), crowd streams between stalls, nothing stands still. When crowd AI arrives (Horizon), it must first make markets *bustle* before it makes streets *populated*.

**Interaction philosophy.** Buying is a conversation, not a list: rows with honest prices, a why for every cost (Verdict Voice), and — when NPC trade AI arrives — haggling as a *skill*, not a random tax. Selling (player goods) must follow the same conversational contract.

**Common mistakes.**
1. *Shop in market clothes.* A grid of price buttons under an awning is a shop, not a market. The market feel lives in *talk, crowd, and bustle* around the transaction.
2. *The zero-stall lie.* Rendering a "great market" with two stalls. Honest scale or fix the filter — never fake abundance with signage.
3. *Price soup.* Twenty rows of numbers. Markets sell *six things beautifully* before they sell sixty things adequately.

**Design principles.**
- EX-16.1: The stall resurrection (Kpata ≥ 1 row, food-area ≥ 1) is a blocking debt for all market features.
- EX-16.2: Every market transaction shows the price, the why, and the result in one breath.
- EX-16.3: Market ambience is the city's loudest mix; if the market is quieter than the street, the mix is broken.
- EX-16.4: All player economy passes the same conservation law — markets mint nothing (Constitution: Money With A Body; The Honest Wire).

### EX-17 · School

**Purpose.** Education as a *place* with dignity: 98 school doors across the mapped school sites (`schools.ts ALL_DOORS`, 17 interior builders), classrooms, and the School app in the phone. School is the long game — the skill ladder that makes hustles stable and careers real. It is also M13's home ground: age bands are picked at creation, and the school must be the safest room in the game.

**Emotions.** Purpose (studying moves me forward) → gentle discipline (the day has a shape) → pride of progress.

**Visual language.** Order and light: chalk, desks, courtyards with the school-yard law respected (yard clips currently leave open ribbon holes — a fabric debt). Uniform color reads the band.

**Audio language.** The room layer tuned bright (hard surfaces, young voices as murmur band), the yard's break-time roar as texture.

**Animation philosophy.** Sitting is a posture, not a teleport: the study pose, the hand-raise gesture when answers land.

**Interaction philosophy.** Study is a *ritual* (sit → time passes → skill gains), honest to the slot clock: a study session consumes the slot it claims. Skills feed work outcomes (the `WORK`/`HUSTLE` config law) — school must *visibly* pay later; the career book in the phone shows the road ahead.

**Common mistakes.**
1. *Study = progress bar.* If studying is a bar with no room-feel, it's a spreadsheet. The ritual must live in a room, with time and body.
2. *The locked-lie.* `stage: 99` school activities are honest filler — but only after the first hour (EX-4.2) and always labeled with arrival honesty.
3. *M13 theater.* Safety walls that humiliate. Refusals are care, in Verdict Voice, never sirens.

**Design principles.**
- EX-17.1: Every study action maps to a skill with a visible future use (job, hustle, or civic).
- EX-17.2: School interiors are the calmest mix in the game — never combat-loud, never alarm-red.
- EX-17.3: Age-band law is enforced identically in-world and on the wire (13 M13 walls exist across money/voice/DM paths — keep them one truth).

### EX-18 · Working (Jobs & Hustles)

**Purpose.** Work is how Lokoja becomes *real*: 21 jobs and 20 hustles (`data/jobs.ts`, `data/hustles.ts`), job boards as POIs (4 boards), NPC familiarity gates that convert favors into real offers. Work is the experience of *being useful* — time exchanged for money with a body, skills compounding into identity.

**Emotions.** Competence → fatigue-with-dignity → payday satisfaction → ambition (the next job, the next skill).

**Visual language.** Work happens *at places*: the garage's grease, the market's scale, the clinic's calm. Job locations are styled by their trade; the uniform/prop of the job appears while working.

**Audio language.** Trade-true rooms: hammer rhythms at the mechanic, murmur at the market, keys at the bank. Work ambience is the trade's voice.

**Animation philosophy.** Work gestures are *rituals with weight* — repetition with micro-variation, hands that look practiced. Never a progress bar where a body can nod, lift, wipe, or count.

**Interaction philosophy.** Two honest paths: **jobs** (stable, skill-gated, salary law) and **hustles** (riskier, difficulty vs skill decides success — `work.ts:8`). The choice between stability and hustle is the game's first real *character* decision, and it must be presented as a life choice, not a min-max. NPC familiarity (talk → favors → offers) makes work *social*: who you know matters, and the game tracks it honestly.

**Common mistakes.**
1. *Click-work.* Any job that reduces to tapping a button N times. If the body can't act it out, the pay should not pretend it happened (Money With A Body).
2. *Grind without ladder.* Pay that never grows with skill. The wage/skill coupling is config law (`WORK`, `HUSTLE` in `config.ts`); violations break the ambition emotion.
3. *Hidden failure.* Hustle failures must narrate (what went wrong, what would help) — Soft Failure with teeth of *information*, not punishment.

**Design principles.**
- EX-18.1: Every job/hustle has: a place, a body ritual, a skill coupling, and an honest fail path.
- EX-18.2: Work time consumes slot time honestly (the 4-slot clock is the boss no one resents).
- EX-18.3: Payday is a *moment* — narrated, tactile, and conserved (no minting outside the ledger laws).
- EX-18.4: Job boards (4 POIs) always show at least one offer the player qualifies for *now* and one they could qualify for *next*.

### EX-19 · Prayer Times & Houses of Worship

**Purpose.** Lokoja lives its faith in the open — the Central Mosque and Church Hall stand as bespoke landmarks (`CityMesh.tsx`), and prayer times are part of the city's daily rhythm. The experience we promise is *belonging to something bigger than the player*, rendered with respect: the hush that falls over streets at prayer, the gather, the calm after. Religion in Lokoja Life is atmosphere and community — never mechanics, never scorekeeping, never the player's tool.

**Emotions.** Hush → belonging → peace. For players of other/no faith: the *respectful witness* — the beauty of a city that keeps its devotions without demanding the player's.

**Visual language.** At prayer times the city's tempo changes visibly: fewer strollers, more stillness near the mosque/church, light doing quiet work. Architecture is dignified (silhouette-first, see Art Bible).

**Audio language.** The most delicate mix in the game: the call to prayer rendered as *atmosphere* (procedural melisma over the murmur bed — distance-attenuated, never a performance the player "uses"), church singing as warm choral texture at slot edges. Both must be beautiful at any distance and *ignorable* with respect — faith is offered, never pushed.

**Animation philosophy.** Gather and disperse are slow, dignified crowd motions. No hurry anywhere near worship.

**Interaction philosophy.** The player may join (a quiet seated presence — no mini-game, no buff economy) or pass by (no guilt, no gate). Faith-adjacent *kindness* mechanics (helping a stranger carry water past the mosque) belong to the community chapter, not this one.

**Common mistakes.**
1. *Faith as content grind.* Prayer buffs, worship XP, donation leaderboards — all forbidden. (Constitution: the city is a place, not a slot machine.)
2. *Wrong-note sound.* Any synthetic call that sounds like a ringtone. If procedural synthesis cannot do it justice, the *murmur of gathering* carries the moment instead — less is respectful.
3. *Sectarian mechanics.* One faith getting mechanical advantages. Both houses get equal craft, equal stillness, equal dignity.

**Design principles.**
- EX-19.1: Prayer times modulate the *city* (crowds, sound, tempo), never the *player's stats*.
- EX-19.2: Both mosque and church receive identical craft budget and compositional care.
- EX-19.3: All religious audio is opt-out-able in Settings (chill mode) without any other loss.
- EX-19.4: No religious content may ever gate money, movement, or relationships.

### EX-20 · The Bank

**Purpose.** The bank is where trust becomes architecture. Today it is also our most public debt: three money UIs (BankApp, BankPanel, WalletApp — `PhoneScreen:219`, `BankPanel.tsx:52`, `wallet-app.tsx:62`), and **bank deposit/withdraw still writes unsigned ledger rows** (`useGameStore.ts:2205/:2258`) while the Profile screen claims Fortress SECURE. The *experience* we promise: money moved with the gravity it deserves — a teller, a PIN, a receipt, a ledger that cannot lie. The experience we must *never* ship: numbers that change with no body and no witness.

**Emotions.** Gravity → trust → the pleasure of receipts. (For the ₦5,000 Day-1 player: the first "my money is somewhere safe" feeling.)

**Visual language.** The most *solid* room in the game: queue, teller desk, the ledger's paper texture. UI inside the bank is teller-language, not app-language: stamped, sequential, witnessed.

**Audio language.** Quietest commerce: the room layer tight, pen scratches and stamp thumps as procedural punctuation, the murmur band at library volume.

**Animation philosophy.** Deliberate slowness — the bank is allowed to be *unhurried* as character (the one place a 400 ms confirm is a feature, not a lag).

**Interaction philosophy.** Deposit/withdraw/transfer as a three-beat ritual: state intent → verify (PIN on purse paths) → receive receipt. Every receipt is a first-class object (WalletApp keeps them). The fortress chain (SHA-256+HMAC, idemKey replay law) is the *reason* the feeling is honest — and until bank paths are signed (open P1), the bank must *say so* in its honest lane rather than claim a security it does not yet have.

**Common mistakes.**
1. *The SECURE lie.* Any UI claiming fortress-grade safety for an unsigned path. Copy must match the ledger truth (audit-verified debt).
2. *Silent money.* Any mutation without a receipt object. If it didn't receipt, it didn't happen.
3. *Three wallets.* Three visual languages for one truth. The money-UI unification is a feel debt of the first order — one wallet law, one visual grammar (see Art Bible, UI).
4. *The wolf alarm.* Unsigned rows written after signed rows make the fortress verifier report the whole chain broken — a false tamper alarm that cries wolf after ordinary banking, ferry rides, or festival joy. The cure is signing the paths (EX-20.1), never muting the alarm.

**Design principles.**
- EX-20.1: No money mutation in the game may bypass a signed path; the 5 direct-cash bypass sites (bank deposit/withdraw ×2, festival spray, canoe ferry, travel fare — re-verified 2026-10-21; the dev-bridge `addCash` is production-stripped and adds none) are the last sanctioned debts and each must die behind its own narrated ceremony.
- EX-20.2: Every financial screen shows *which* money it touches (pocket vs purse) — the split-brain may exist in code, never in the player's mind.
- EX-20.3: Receipts are eternal, searchable, and player-owned.
- EX-20.4: The bank never gamifies: no streaks, no bonus spins, no confetti. Gravity is the brand.

---

## PART V — SKY & WEATHER
### *The sky experiences. Weather is the city's mood made visible.*

### EX-21 · The Four Lights (Morning · Afternoon · Evening · Night)

**Purpose.** Time in Lokoja is told in four honest slots (`config.ts:192` — morning/afternoon/evening/night; night is always night-clear, `world.ts:33-34`). Discrete slots are an engine truth, and they are a *gift*: each slot can be a fully authored mood rather than a mush of interpolation. The experience: a day that has *phases a player can feel in their body* — when to hustle, when to eat, when to gist, when to sleep.

**Emotions.** Morning: appetite and clean energy. Afternoon: full-tilt commerce heat. Evening: golden warmth and social pull. Night: intimacy, sodium-orange streets, and the pleasant vulnerability of being out late.

**Visual language.** Four authored keyframes per slot (`atmosphere.ts`): morning long shadows and pale gold; afternoon hard top-light and high contrast; evening the game's signature amber hour; night sodium pools (492 lamps, `layout` lamp law), headlight cones, darkened windows with lit emissives (canvas-baked). The **Color Line** holds in every slot (green lawful, amber economy, red refusal).

**Audio language.** The bed re-mixes by slot: horns thickest in afternoon, crickets owning night (bandpass 4,400 Hz, `ambience.ts:104`), zinc settling at dusk. Evening is the day's warmest mix; night is its most spacious.

**Animation philosophy.** NPC counts by slot (12 day / 4 night, `Actors.tsx`) — the city visibly *goes home*. Traffic thins. The transition between slots should take seconds and be *noticed once per session*, like a change in weather, never a visible "time changed" UI event.

**Interaction philosophy.** Slots are the honest time currency: work consumes them, sleep advances them, study claims them. The HUD tells time as a slot whisper, never a ticking clock (no hour-hand exists in the engine, and none is needed — the *light* is the clock).

**Common mistakes.**
1. *Slot pop.* If the change between slots reads as a switch thrown, the mood breaks. Transitions are authored keyframe blends.
2. *Night as dark day.* Night is not "the same city darker" — it is a *different city*: fewer people, more stars, different sound. Any content that ignores night's distinct character is half-built.
3. *Clock UI envy.* Adding a fake hour clock to look "sim-like" contradicts the engine's honest 4-slot law. Slot poetry over clock bureaucracy.

**Design principles.**
- EX-21.1: Every slot has authored light, audio mix, crowd density, and at least one *exclusive* activity or texture.
- EX-21.2: Slot transitions are blended and one-way in feel (a day moves forward; no slot ever "snaps back" without a sleep that narrates it).
- EX-21.3: Night must always feel *safe* (Soft Failure city) while feeling *night*: dark streets are atmospheric, never threatening-by-mechanics.

### EX-22 · Rain

**Purpose.** Rain is Lokoja's communal event — the sky opening, the street emptying, zinc roaring, puddles becoming mirrors. It exists on disk as real weather (`types.ts:289` weather states; 620 rain particles, puddles at fixed y=0.035, flood veil in `polish.tsx`). Rain is the cheapest wow we own and the deepest mood we sell.

**Emotions.** The dash for shelter (delight, not stress) → cozy observation → the smell of it (implied by light and sound together) → the fresh-washed world after.

**Visual language.** Vertical streaking particles (cheap, readable, honest), surface darkening, puddle mirrors with the sodium/emissive night magic, the flood veil near the rivers. Rain is *composed*, not simulated: it should frame the city beautifully.

**Audio language.** The rain layer (highpass 1,400 Hz, `ambience.ts:102`) rises over the whole bed; zinc roofs get their own crackle character; thunder is rare and *felt* (see Storm). After-rain silence with drips is its own composed moment.

**Animation philosophy.** Rain changes *behavior*, not just visuals: NPCs seek cover (future crowd law), traffic turns careful, market rows thin. A rain that only skins the world is a screensaver.

**Interaction philosophy.** Rain is a *choice point*: dash on (energy cost feels right in rain), shelter (under awnings — future hotspot), or keep working (hustles that continue in rain get their moment). Rain should *temporarily change prices and crowds* (the market's rainy-day law) — the city adapting is the whole point.

**Common mistakes.**
1. *Weather as wallpaper.* Rain that affects nothing. Every weather state must touch at least: audio, crowd, and one economy behavior.
2. *Puddle lie.* Puddles you can't see yourself near, floating above geometry (fixed y is fine for now, but must never visibly float).
3. *Drown-lag.* Rain dropping the frame budget. The 620-particle law and low-tier FramePacer (30 Hz) are the budget; rain may never be the reason a low-end phone stutters.

**Design principles.**
- EX-22.1: Rain modulates: ambience mix, NPC behavior, market economy, and travel guards (flood guard is real, `useGameStore.ts:3503-3604`) — all four or it doesn't ship.
- EX-22.2: Rain begins and ends with narrated transitions (first drops → downpour → dripping after), never binary.
- EX-22.3: Performance law: rain's worst frame must stay within the SILK posture on low tier.

### EX-23 · Harmattan

**Purpose.** The dust season — the rare, dramatic day the whole city feels (`config.ts:194-196` comment law: harmattan, storms, and flood days are *rare, dramatic days*). Harmattan is Lokoja's haze of memory: pale sun, soft edges, cold mornings, dust gold light. It is the game's most *poetic* weather and its most distinctive against generic city games.

**Emotions.** Nostalgia for a place (even for players who've never been) → quiet → the particular beauty of a muted world.

**Visual language.** Dust haze layers (`DustHaze` in `polish.tsx`), desaturated distance (fog does the work), sun as a pale coin, long soft shadows. The palette cools and dusts — but the Color Line still reads.

**Audio language.** Wind rises in the breeze bed; the city sounds *closer* (haze absorbs distance); horns softer, murmur warmer. Harmattan is the quietest loud day.

**Animation philosophy.** Dust drifts, cloth flaps, trees move more. NPCs walk with purpose into the wind (micro-bias in stroll direction — cheap and true).

**Interaction philosophy.** Harmattan days are *story days*: market sellers complain (copy), cold-morning meals sell better (economy law), photos taken in harmattan get their own frame character (photo mode). The weather should *feed* content, not just cover it.

**Common mistakes.** Making harmattan merely "fog mode." Treating it as a debuff. Overusing it (rarity is the drama — the weights in `config.ts` are law).

**Design principles.**
- EX-23.1: Harmattan is rare by config law; its arrival is an event the copy acknowledges.
- EX-23.2: Its palette still passes legibility (wayfinding, Color Line, prompts all readable at worst haze).
- EX-23.3: At least one content behavior changes on harmattan days (meal, market row, or copy).

### EX-24 · Storm & Flood

**Purpose.** The sky's authority. Thunderstorms and the Niger/Benue flood days are the city humbled — power in the world that is *not the player's*. These are the rarest days and the only ones allowed to *interrupt*: travel guards refuse river-cut routes, the flood veil rises, the city stays indoors. This is Soft Failure's skyline: drama with no cruelty — the flood closes roads, it does not drown anyone.

**Emotions.** Awe (thunder, the sky's light show) → humility (routes refused) → cozy refusal (staying in is its own content) → the dramatic beauty of the river high.

**Visual language.** Storm: deep slate palette, wind-flattened trees, lightning as whole-frame flashes (authored, not random strobe). Flood: the veil near rivers, waterline reading honestly against banks, the confluence *swollen*.

**Audio language.** Thunder as sub-heavy procedural events with real silence after; rain layer at full; the river layer swollen. The *after*-storm hush is the most composed silence in the game.

**Animation philosophy.** The world braces: trees lean hard, debris in wind, boats pulled in (if boats are moored, they must read moored). The city's *posture* changes.

**Interaction philosophy.** Storm/flood refuse travel honestly (guard order: flood → river-cut, `useGameStore.ts:3503-3604`) with Verdict Voice whys. The refusal is content: what do you *do* on a flood day? Neighbors, indoors, radio (future), sleep, story. The flood day should be remembered as a *day*, not a block.

**Common mistakes.**
1. *Punishment weather.* Storms that damage the player's things. Never — drama is free of loss (Soft Failure).
2. *The unexplained no.* Flood travel refusals without a visible flood. The world must *show* the reason it says no.
3. *Cheapskate thunder.* Stock "rumble.mp3" energy is impossible anyway (100% procedural law) — but a *thin* synth thunder is worse than none. Author it with sub-weight or don't ship it.

**Design principles.**
- EX-24.1: Storm/flood days are rare, narrated, and dramatic; weights live in `config.ts` and are Bible-amendment-locked.
- EX-24.2: Every refusal they cause is visible in the world and voiced in copy.
- EX-24.3: A flood day always offers at least three indoor or near-home activities.
- EX-24.4: No loss, no damage, no fear mechanics — only closure, coziness, and spectacle.

### EX-25 · Festival Days

**Purpose.** The city's peak experiences — days the calendar owns. Festivals are how Lokoja expresses collective joy: the crowd, the drum, the food, the new clothes. **Disk truth:** festival money paths are among the 5 unsigned bypass sites (festival write, audit §5A) — no festival feature may ship until its economy is signed. Festivals are also the natural home for the community systems (sprays, stages, crowds) already built for multiplayer.

**Emotions.** Collective joy → spectacle → generosity (sprays, gifts, new clothes) → memory ("the day the whole city came out").

**Visual language.** Color at maximum: clothes, bunting, stall dress-up, crowd density pushes (the crowd systems get festival headroom), light allowed one extra degree of warmth. The city *dresses*.

**Audio language.** Music doctrine shifts: the procedural afro-fusion engine (`music.ts`) gets festival arrangements — denser drums, call-and-response figures, higher tempo ceilings. This is the one day the music may lead rather than accompany.

**Animation philosophy.** Crowds gather in rounds (circles at squares), dancers, processions along real roads. Festival motion is *communal* — never a player-only spectacle.

**Interaction philosophy.** Festivals are *given*, not ground: the player attends, eats, sprays, dances, greets elders. The economy of generosity (real-₦ sprays on the stage system, gifts) already exists on the wire — festivals are its stage. Every festival transaction must be signed and receipted like all others.

**Common mistakes.**
1. *Unsigned joy.* Festival spending bypassing the ledger (today's live debt). Joy that mints money is the deepest violation of The Honest Wire.
2. *Skybox festival.* Bunting on a dead street. Festival = crowd + sound + economy + dress, all four or none.
3. *FOMO engineering.* Missable limited-time rewards that punish absence. Festivals recur; the calendar is kind (unhurried law).

**Design principles.**
- EX-25.1: A festival ships only with: crowd plan, audio plan, signed economy plan, and dress plan — all four.
- EX-25.2: Festival rewards are memory-first (clothes, story, photos), money-second.
- EX-25.3: Festivals recur on the honest calendar; nothing is missable forever.
- EX-25.4: Festival crowds use the same rig budgets as every crowd (caps registry, Content Bible) — spectacle never buys its way past performance law.

---

## PART VI — THE SECOND OS
### *The handheld and the body's economy. The phone, the money, the meals, the sleep.*

### EX-26 · Using the Phone

**Purpose.** The phone is the one lawful screen — the Constitution's diegetic doctrine made concrete: 26 apps on a cream bezel (`PhoneScreen.tsx`), opened in-world by the rail + FAB (`WorldPhoneLayer.tsx:89-99`), with the deep-link door letting the *world open the phone* (`lko:phone-open`, `:101-108`). The experience: *your phone*, with Lokoja's weight — a tool that belongs to the street, not to a laboratory.

**Emotions.** Agency (my device, my apps) → intimacy (messages, wallet, music) → the small thrill of *diegetic* truth: the phone exists in the world's pocket; opening it never leaves the world.

**Visual language.** The cream handset bezel, the paper-ui apps, lko tokens throughout. The phone must always look like it was designed by the same hand that designed the city — no dark-mode SaaS, no glassmorphism envy.

**Audio language.** Soft UI ticks (procedural), the deep-link *lift* when the world opens the phone for you (a call banner's rise is the phone's most musical moment).

**Animation philosophy.** App opens are confident, quick, small-travel — the phone is snappy *because* the world around it is unhurried (contrast is composition).

**Interaction philosophy.** The freeze law is the contract: opening the phone freezes world input (`freezeInput(worldUiOpen)`, `WorldPhoneLayer.tsx:89-99`) — one attention at a time, no accidental walking while reading money. The deep-link doctrine: when the *world* wants the phone (a shop, a fare, a job), the world opens it — the player is never made to hunt menus for what the street is offering.

**Common mistakes.**
1. *Menu-itis relapse.* Any new feature that ships as a HUD panel instead of an app. The phone is the interface; HUD is a whisper.
2. *The unfrozen walk.* Input bleeding through the phone (audit: WorldPhoneLayer zero freezeInput claim was checked — the freeze law exists; regressions here are P0s).
3. *Notification flood.* Toasts beyond the 3.2 s / max-3 law turn the phone into a slot machine. Notifications are weather, not projectiles.

**Design principles.**
- EX-26.1: Every player-facing system is reachable through the phone; the HUD never hosts a system, only whispers about one.
- EX-26.2: Phone open = world input frozen, world *rendering* alive (the street keeps breathing behind the glass).
- EX-26.3: New apps follow the Content Bible phone playbook; the grid grows only with need, never with inventory.
- EX-26.4: One visual grammar for all 26 apps (Art Bible); a new app in foreign clothes breaks the device's soul.

### EX-27 · Money (Pocket & Purse)

**Purpose.** Money in Lokoja has *two honest bodies*: the **pocket** (offline fortress chain — signed save, velocity + income guards, HMAC) and the **purse** (server hash-chained ledger — idemKey replay law, PIN, caps). The experience must make this split *feel* like real Nigerian money: cash in the pocket vs bank in the app. The Constitution calls this Money With A Body and The Honest Wire; this chapter is their felt contract.

**Emotions.** Tangibility (cash counts out, visible) → security (purse behind PIN + receipts) → the *appropriate anxiety* of spending (money means something because it is conserved and embodied — 319/319 conservation proofs exist; keep it eternal).

**Visual language.** Pocket money renders in the world's paper language (counted notes, tells); purse money renders in teller language (stamped, receipted). The two grammars must never blur — the player must always know which money they are touching.

**Audio language.** Cash: soft paper ticks. Purse: the stamp. Transfers: one warm confirmation tone — the *only* celebratory money sound in the game.

**Animation philosophy.** Money never just changes number. It *moves*: counted, handed, stamped, receipted. Every transaction has a visible hand-off, however small.

**Interaction philosophy.** Every spend asks the body first (E at a teller, a market row, a fare chip) and answers with a why. The Verdict Voice governs all refusals (insufficient funds, caps, M13 walls): the *reason*, warmly and precisely, every time.

**Common mistakes.**
1. *Number shrink-wrapped in silence.* A balance changing with no ritual. (The store's historic double-pay scar — since fenced by the one-application book — is why this law has teeth.)
2. *The invisible split.* UIs that hide which money is touched. EX-20.2 applies to every screen, not just the bank.
3. *Free money.* Any grant outside the signed paths (the 5 bypass sites are sanctioned debts — new code may add zero more).

**Design principles.**
- EX-27.1: Every transaction is: intended → embodied → receipted. No exceptions, ever.
- EX-27.2: Conservation is visible: the player can always reconcile their money through receipts.
- EX-27.3: Refusals teach (why + what would make it possible), never scold.
- EX-27.4: No money feature ships until its ledger path is signed and idempotent (Content Bible wire rulebook).

### EX-28 · Banking

Covered in EX-20 (The Bank) — the ritual, the gravity, the receipts, the honest-lane copy debt. Banking's *feel* law in one line: **the bank is the room where the game proves it deserves the player's trust; it must always be the most honest room we ship.**

### EX-29 · Eating

**Purpose.** Food is Lokoja's warmest language. Meals are the body's honest economy: cooked at the stove hotspot, bought at Mama's Food Strip (the evening stomach), priced honestly, eaten with consequence (needs refill — `needs.ts`). The experience: *food as care* — for the body, for the day's rhythm, for memory.

**Emotions.** Appetite → comfort → the social warmth of eating where people eat → the pleasant cost of hunger ignored (soft, narrated — never starvation dread).

**Visual language.** Steam, color, portion honesty: what ₦ buys is what the plate shows. Food areas glow warm in the evening slots (their time to shine).

**Audio language.** The market layer swells; cooking has its own procedural sizzle texture at the stove; eating is a brief, warm hush.

**Animation philosophy.** Eating is seated, unhurried, with the body's small pleasures (the lean back after). Cooking at the stove is a *gesture ritual*, not a progress bar.

**Interaction philosophy.** One intent, one meal, one price, one why. The meal law (`MEAL_BY_KEY`, config) prices by place and portion; no meal is ever hidden behind bundles or gacha. Hunger is a *rhythm*, not a timer: it rises across slots, is settled by eating or sleep, and never kills (Soft Failure — needs 0 is a bad day, not a death).

**Common mistakes.**
1. *Hunger terrorism.* Escalating alarms, screen vignettes, forced eating. Hunger is information with a body, in Verdict Voice.
2. *The bag-less economy.* The Bag tab is the one true stub ("Stage 4", `Dashboard.tsx:359-390`) while food lives elsewhere — the split confuses. Until Bag is real, food flows must be *fully* completable in-world without inventory juggling.
3. *Menu food.* Meals as list rows in the phone only. The stove and the strip are the true tables.

**Design principles.**
- EX-29.1: Every meal is purchasable, cookable, or both, in-world, at a place.
- EX-29.2: Needs math is honest and visible (what the meal restores, said plainly).
- EX-29.3: Food never gates progress (no "you must eat to work" walls) — it prices energy, gently.
- EX-29.4: Mama's Food Strip and the stove must always be cheaper than the luxurious option — the food ladder is a class ladder told with kindness.

### EX-30 · Sleeping

**Purpose.** Sleep is the game's most sacred ritual: **Sleep Is Saving** (Constitution). The bed hotspot advances the slot clock honestly, restores the body, applies the comfort bonus (`housing.ts`), and writes the save. The experience: *closing the day* — the world's sounds settling, the slot turning, the trust that the day was kept.

**Emotions.** Completion → safety → the soft excitement of tomorrow (what the next slot holds).

**Visual language.** The dimming: room light falls, the city's sound bed settles to its night mix, and the world *lets go* of the player. Waking is a light change, not a UI screen.

**Audio language.** The full bed at its most gentle: crickets, distant zinc, the room layer's softest setting. Sleep is the audio bible's lullaby chapter.

**Animation philosophy.** The body lies down *in* the bed (position matters — the hotspot is the bed, not the room), a breath, and the cut to morning. No spinning loaders, no screens.

**Interaction philosophy.** One intent: sleep. The game answers with: slot advance (honest day delta, `world.ts:39-51` advance law), needs restored, comfort bonus applied, save written (the autosave 1.2 s debounce means the bed is a *ceremony* over an already-safe system). Sleeping anywhere but home costs comfort — the ladder rewards the kept home.

**Common mistakes.**
1. *Sleep as skip button.* Sleep advances time but *never skips content* (no "while you slept" invented events — EX-6.3 honesty).
2. *The unsafe bed.* Any path where sleeping loses state. The bed is the save; it must be the safest interaction in the game.
3. *Forced sleep.* Energy systems that black-screen the player. Tiredness narrates; the player chooses when the day ends.

**Design principles.**
- EX-30.1: Sleep always: advances the clock honestly, restores honestly, saves honestly, and is narrated by light + sound, never by UI.
- EX-30.2: Home sleep is always the best sleep (comfort law is visible at the pillow).
- EX-30.3: The player can always refuse sleep; the city never sleeps for them (unhurried law).
- EX-30.4: Waking always lands in a *changed* world (slot light, audio, crowd) — proof the world moved.

---

## PART VII — OTHER PEOPLE
### *The social experiences. The wire is not infrastructure; it is the neighborhood.*

### EX-31 · Seeing Another Player

**Purpose.** The moment the city stops being a diorama: another *real person* walking Lokoja's real streets, rendered from their real look, driving their real car (same-street walkers render as real rigs at 10 Hz bodies / 12 Hz vehicles, `index.ts`). This is the game's deepest differentiator — a multiplayer city that is *always on* and never demands it. The experience: the small jolt of "oh! person!" followed by the etiquette of strangers.

**Emotions.** Recognition → curiosity → the polite dance of strangers (wave or not) → the comfort of *company without obligation*.

**Visual language.** Their real look (creation swatches), their real name, their real car with its real plate. Presence is legible: co-presence chip tells you who's on your street (`HudOverlay` top bar). No floating names unless introductions happened — strangers are strangers (names come with greeting).

**Audio language.** Their emotes, their proximity walkie (adult, opt-in, mesh cap 4 — `index.ts:1886-2088`), their car engines. Another player *sounds* present before you find them with your eyes.

**Animation philosophy.** Remote bodies obey the same body grammar as NPCs and the player — one species law. **The shared-rig bug is the enemy of this entire chapter** (same model:paint cars mounting one `rig.group` — `RemoteVehicles.tsx:114/:179/:221`): a vanishing car is not a visual bug, it is a *social wound* — the city lied to you about a person.

**Interaction philosophy.** All the classic street verbs: greet (emote), gist (chat), walk together, board their car (with their consent), call (P2P with M13 walls), DM (walled), block (instant, respected). Every verb exists on the wire today — the experience law is that they are *offered with street etiquette*, never with game-y popups.

**Common mistakes.**
1. *Presence lies.* The `street` field only refreshes at world entry/paddy-join (`wire.ts:645-648`) — co-presence can misjudge while you walk. A "X is here" that is false is a *social* lie; fix is Gate-0 adjacent.
2. *Emoji riot.* Emote spam without restraint. Emotes are gestures, not fireworks.
3. *Forced sociality.* Nothing in Lokoja requires another person. Solo is a full life (unhurried law); company is a gift, never a quota.

**Design principles.**
- EX-31.1: Remote presence must be *true* (position, street, look, car) — any falseness is P0 social damage.
- EX-31.2: One rig per body per viewer (the shared-rig law) — until it holds, do not market co-presence features.
- EX-31.3: Strangers are anonymous until they speak; names are earned by greeting.
- EX-31.4: Every social verb is consent-first and M13-walled identically to the wire law.

### EX-32 · Friendship

**Purpose.** The long arc: stranger → gist → friend. Friends live in Connect (friend graph), talk in Messages/DMs, ride together (seats), call (P2P), spray each other on the stage. The experience: *making a friend the way you do in a real city* — by showing up in the same places, repeatedly, until you're not strangers.

**Emotions.** The risk of a first hello → the ease of an inside joke → loyalty → the small pride of a friend list that means something.

**Visual language.** Friends are visually *known*: once introduced, their name rides their body; their favorite haunts become yours by co-presence; the Connect roster is warm paper, not a contacts database.

**Audio language.** DM chime is soft; calls ring with the phone's own personality; voice is real (the only real human voices in the game — treat with reverence: the M13 walls and the mute/block are sacred).

**Animation philosophy.** Walking together is *matching pace* (co-walk alignment), not teleport-follow. Sitting together under the neem tree is a shared idle — two bodies at rest is the game's warmest animation.

**Interaction philosophy.** Friendship accrues by *co-presence and mutual verbs* (rides given, gists shared, favors done), never by clicking a "Add Friend" button on a stranger's popup. The Connect app records; the street creates.

**Common mistakes.**
1. *Social questing.* "Make 3 friends" tasks. Friendship is never a metric.
2. *The invisible friend.* Friends exist in Connect but not on the map/street — the audit's "friends invisible on the map" gap. Fix by *street truth* (presence), not by map stalking.
3. *Voice without walls.* Any voice path that skips the M13/parent-PIN law is a P0 (the server walls are law; client copy must match them).

**Design principles.**
- EX-32.1: Friendship is earned through repeated co-presence and mutual verbs; the UI records it, never grants it.
- EX-32.2: All friendship surfaces are consent-first, blockable in one gesture, and M13-safe by construction.
- EX-32.3: Friends can always find each other through *truth* (presence, streets) — never through surveillance.

### EX-33 · Gist & Community (Under the Neem Tree)

**Purpose.** The Constitution's Under The Neem Tree made experiential: the city's *gossip layer* — NPC gist chips at 24 u (`Actors.tsx`), street chat, the Live app's roster, stage broadcasts. Community is the experience of *belonging to the street's conversation*: hearing it, joining it, occasionally being the subject of it (kindly).

**Emotions.** Inclusion (the conversation makes room for me) → amusement (the wry band) → rootedness (the street has a memory and I'm in it).

**Visual language.** Gist bubbles are paper speech, not chat bubbles from a messaging app — they belong to the *air*. The stage is a *place* (a real square), the audience real bodies.

**Audio language.** The murmur band is the community's instrument — a street's worth of voices that never resolve into words but always resolve into *life*. Stage moments can cut the music for the speaker's real voice.

**Animation philosophy.** Circles: bodies facing bodies. Under the neem tree, idles orient inward. The geometry of conversation is compositional law.

**Interaction philosophy.** Joining gist is walking closer + one verb. The NPC familiarity system (talk → favors → offers) is community's economic shadow: kindness literally compounds into opportunity. Stage broadcasts let any player hold the square — with real-₦ tips (signed, receipted).

**Common mistakes.**
1. *NPC chat theater.* Threads that pretend to be real people (today's NPC threads are component-state theater — audit §3). Theater is allowed only if *labeled* by its texture (NPCs feel like neighbors, not hidden players).
2. *Stage as influencer economy.* Follower counts, verification, clout leaderboards. The stage is a square, not a platform.
3. *Loud default.* Community systems on by default for players who came for quiet. Every social layer has a chill mode (Settings chill law exists — keep it real).

**Design principles.**
- EX-33.1: Community systems amplify the street's conversation; they never replace it with feeds.
- EX-33.2: Every social surface is opt-out-able without loss of other content.
- EX-33.3: Money in community (sprays, tips, trades) is always signed, receipted, and capped (LEDGER_LIMITS law).
- EX-33.4: The neem tree (and its future siblings) is protected composition: shade + seat + conversation geometry.

### EX-34 · Multiplayer Trust

**Purpose.** The meta-experience that makes all others possible: the player's *felt security* — my money cannot be stolen, my car cannot be ghosted, my child cannot be reached by the wrong adult, the world will not lie to me. This is The Honest Wire as a *feeling*. The machinery (58 client-facing doors / 59 handlers, idemKey, chainHash, dual rate buckets, M13 walls, PIN/scrypt) exists; the experience is that the machinery is *invisible and absolute*.

**Emotions.** Safety → relaxed openness → the confidence to be generous (I can give because taking is impossible).

**Interaction philosophy.** Trust is felt at three temperatures: *invisible* (everything just works), *explained* (when a refusal protects — Verdict Voice), and *ceremonied* (when something big happens — first PIN, first large transfer: a deliberate, respectful ritual, not a modal).

**Common mistakes.** Security theater (Fortress SECURE labels on unsigned paths — the live debt), silent walls, and blame-the-player copy ("invalid input" energy). All three are forbidden.

**Design principles.**
- EX-34.1: Every security refusal explains the *reason and the remedy* in one breath.
- EX-34.2: No security state may be claimed in copy that the ledger does not enforce in code.
- EX-34.3: M13 protection is invisible to the child (they feel *care*, not cage) and visible to the parent (PIN ladder, ShieldApp tiers).

---

## PART VIII — THE INNER JOURNEY
### *The private experiences. What the game does for the player's inner life.*

### EX-35 · Exploration

**Purpose.** The pleasure of the map with legs: 2,655 real ways, 750 km of real Lokoja roads, 20 launch places + 10 G2 wards, and the promise that *around any corner is something true*. Exploration is the game's quietest compulsion loop — no markers, no fog-of-war gameification; just streets that keep being real.

**Emotions.** Wanderlust → the collector's itch (districts found, 32 anchors) → the *patina of familiarity* (routes becoming mine).

**Visual language.** Wayfinding by *landmark*, not by UI: Mount Patti south-visible, the confluence seam, tower silhouettes, the roundabout. A player who learns Lokoja should be able to navigate it like a local — by eye.

**Audio language.** District ambience shifts are the explorer's sonar (EX-7.3): the ear knows the neighborhood changed before the eye confirms.

**Animation philosophy.** The world rewards attention, not speed: discoveries trigger at *arriving* (proximity + dwell), never at passing.

**Interaction philosophy.** The map (2D stylised OSM, `MapScreen.tsx:261-759`) records where you've been — session-spanning discovery is real. The map is a *diary*, not a checklist: pins from places found, no exclamation marks, no percentages. Completionism is offered to the player's own nature, never engineered.

**Common mistakes.**
1. *Quest-ifying space.* "Explore 5 districts" tasks. The city is the quest.
2. *Marker litter.* Compass strips, floating icons, minimap noise. Whisper HUD law.
3. *Empty far corners.* If the OSM suburbs render as streets with nothing true, they must at least be *honest* (G2 naming, stage law) — never fake-alive.

**Design principles.**
- EX-35.1: No navigation UI may ever point at content; the world points at itself.
- EX-35.2: Discovery requires arrival + attention (the 8.6 u anchor law + a dwell sense).
- EX-35.3: Every launch district is walkable end-to-end on real roads (the road-fabric dead-end debt, 72% of way-endpoints, is the known budget — closing it is World Bible work).

### EX-36 · Discovery

**Purpose.** The molecule of joy: *finding* something — a place, a view, a secret, a person, a price. Lokoja's discovery grammar: the places-found chip, the district discovery toast, the five Patti secrets, the first-time-everything firsts (first fare, first friend, first ₦10k). Discovery is how the game says *look what lives here*.

**Emotions.** Surprise → delight → the urge to share (postcards exist precisely for this — `/t/[code]` share codes, `teleport.ts` is postcard-truth, not fast travel).

**Visual language.** The discovery toast is a *postcard moment*: the place's name in the game's display type, one warm line of copy, the paper stamp feel. Never a generic "New area discovered!"

**Audio language.** One discovery figure — a two-note warm motif on the kalimba voice (music.ts's instrument set). The same figure always means *you found something*. Consistency is the charm.

**Animation philosophy.** The toast rises once, holds, fades — 3.2 s law. Never stacked (max 3 toasts — the notification law).

**Interaction philosophy.** Discoveries are *kept*: places-found count, secrets found, story beats remembered. The discovery ledger is the player's autobiography in miniature.

**Common mistakes.** Inflation (discovering the same place twice), noise (discovery toasts for trivialities), and *spoiler maps* (revealing undiscovered places on the map). All forbidden.

**Design principles.**
- EX-36.1: One discovery = one toast = one memory; never batch, never repeat.
- EX-36.2: Discoveries are idempotent and permanent.
- EX-36.3: The share verb (postcard) is one tap from any discovery.

### EX-37 · Wonder (The Confluence Test)

**Purpose.** The Constitution's Confluence Test is this book's peak experience: standing where two rivers meet, the whole city behind you, and feeling *the scale of the world* — and the scale of yourself in it. Wonder is the emotion that makes players screenshot Lokoja and send it to family.

**Emotions.** Awe → gratitude (that this exists) → the quiet that follows big views → the itch to *bring someone here* (the social destiny of all wonder).

**Visual language.** The protected compositions (EX-12.4, EX-13.4): the deck sightline, the Patti summit, the river bends at golden hour. Wonder is composed — the Art Bible's composition chapter is this chapter's engine.

**Audio language.** The river bed at its widest, city noise gone, the music engine allowed one sparse, slow figure. Then — often — silence (the Art & Audio Bible's Silence chapter).

**Interaction philosophy.** Wonder spaces are *rest spaces*: seats, photo mode, the postcard verb. No timers, no tasks, no prompts. The game's only job is to stay out of the way.

**Common mistakes.** Adding objectives to viewpoints. Playing music too busily over the view. Letting UI (banners, chips) litter the frame. All forbidden — wonder is protected by law.

**Design principles.**
- EX-37.1: Every wonder space passes the Confluence Test: screenshot with zero UI, send to a friend, they say "what is this game?" — or it fails.
- EX-37.2: Wonder spaces are UI-free by default (HUD whispers auto-hide; photo mode is one tap away).
- EX-37.3: No future content may build above knee height in the protected sightlines.

### EX-38 · Homesickness

**Purpose.** The experience of the diaspora player — the Nigerian abroad who opens Lokoja Life and *recognizes* the place. This is the game's deepest purpose and its most sacred trust: every zinc roof, every "abeg," every keke fare is a letter home. The experience must be *recognition without caricature*: love with accuracy.

**Emotions.** Recognition (that's *our* road shape) → warmth → the good ache (saudade of home) → pride (this is us, made with care).

**Visual/Audio language.** Everything the Art & Audio Bibles define serves this chapter first: real OSM roads, real ward names (Adankolo, Filele, Kpatakpoli — `locations.ts` G2), harmattan light, the call to prayer handled with respect, afro-fusion that comes from the culture's grammar not its clichés.

**Interaction philosophy.** The diaspora player needs no tutorial for the *meaning* of things — only the controls. Every culturally-true detail (haggling texture, greeting elders, the fare negotiation, Sunday clothes) must be *behaviorally* true, not just visually present.

**Common mistakes.**
1. *Museum Africa.* Freezing the city in postcard clichés. Lokoja is *alive and modern*: phones, transfers, hustles — the culture is living, not taxidermied.
2. *Copy approximation.* Fake pidgin, wrong greetings, translated-from-English formality. Copy law: write with the street's voice (Content Bible) or not at all.
3. *Spectacle without respect.* Turning faith, Markets, or festivals into exotic wallpaper for tourists. The player is a *resident*, never an anthropologist.

**Design principles.**
- EX-38.1: Every cultural surface passes the Mother Test: would someone's Nigerian mother say "yes, that's how it is"?
- EX-38.2: Real names, real places, real grammar — always. Invented names require a Bible amendment with cultural review.
- EX-38.3: The city must remain *playable as home*, not visitable as exhibit.

### EX-39 · Success

**Purpose.** The long climbs: first ₦10k, first car, first rented room upgraded, first festival clothes, Elder status. Success in Lokoja is *financial and social maturation* — the quiet pride of a life building. The experience must make each milestone *feel like the neighborhood noticed* (Lokoja Knows Your Name).

**Emotions.** Pride → the urge to share/give (success in a community is distributive — sprays, gifts, helping) → the next appetite (Earned Convenience: money buys *less waiting*, never *more meaning*).

**Visual language.** Milestones are *world events* in miniature: the car appearing parked near you, the room's furnishing change, the wardrobe's new cloth. Success is always *visible in the world*, never just a number crossing a threshold.

**Audio language.** One warm rising figure for milestones — rarer and warmer than the discovery motif. The bank stamp is success's true sound.

**Animation philosophy.** Others *react*: NPCs who know you greet warmer (familiarity), the stage crowd sprays. Success is social by construction.

**Interaction philosophy.** Milestones are received with dignity: a narrated moment, a receipt where money moved, no confetti spam. The ladder (jobs → biz → property) is legible in the Career book — the player always knows the *next* honest step.

**Common mistakes.** Number-go-up celebrations, milestone spam, and pay-to-meaning confusion (money buying story shortcuts). All forbidden.

**Design principles.**
- EX-39.1: Every milestone is world-visible, socially witnessed, and receipted.
- EX-39.2: Success never trivializes earlier struggles (no late-game currency that makes Day-1 hardships mocking).
- EX-39.3: The ladder never ends in a ceiling — there is always one more honest rung (and it is always *work + community*, never lottery).

### EX-40 · Failure (Soft Failure)

**Purpose.** The Constitution's Soft Failure doctrine: **nobody dies in Lokoja.** Health 0 is a bad day (`needs.ts:77-84` — nothing happens today; the doctrine needs a *narrated* bad day, not silence). Hustles can fail; rent can be missed; the wire can drop. The experience: failure as *information and redirection*, never as punishment, loss spiral, or shame.

**Emotions.** Disappointment (honest, brief) → understanding (the why, in Verdict Voice) → the next move (always offered) → resilience (the Lokoja way).

**Visual language.** Failure is legible but gentle: no red screen washes, no death animations. The *world* shows consequence (a closed shop at closing time, a missed keke, a landlord's remark) — never a game-over card.

**Audio language.** The refusal tone: low, warm, brief — the same figure every time (consistency = the voice of a fair city). No dramatic failure stings.

**Animation philosophy.** The body shows disappointment (a slouch, a slow turn) and *recovers* visibly. The city does not gawk.

**Interaction philosophy.** Every failure has: the why (precise), the cost (honest, capped), and the next move (offered, never forced). Consequences are *recoverable by play* — never by grinding grief, never by payment.

**Common mistakes.**
1. *The silent zero.* Health 0 doing nothing at all (today's truth) is not Soft Failure — it's an unshipped idea. Ship the narrated bad day.
2. *Spiral design.* Any loop where failure makes future failure more likely (debt traps, eviction → hunger → weaker → poorer). Forbidden by law.
3. *Mockery.* NPCs or copy that shame the failed player. The city is kind; the hustler's luck turns.

**Design principles.**
- EX-40.1: Every failure state is narrated, capped, and offers a next move in one breath.
- EX-40.2: No loss is unrecoverable by ordinary play within a session and a day.
- EX-40.3: Failure never touches: identity, friendships, or the save's integrity.
- EX-40.4: The *possibility* of failure is never removed (risk is what makes hustles meaningful — `work.ts` difficulty vs skill law).

### EX-41 · Relaxation

**Purpose.** The chill: sitting under the neem tree, fishing views at the deck, the lounge, TV evenings, photo walks, Whot with friends. Lokoja must be a place where *nothing is the optimal move* sometimes — the anti-grind valve that keeps the whole economy humane.

**Emotions.** Ease → presence → the day slowing to the body's pace → gratitude for small pleasures.

**Visual/Audio language.** The game's softest compositions and mixes; chill mode (Settings `CHILL` config) leans the whole presentation gentler.

**Interaction philosophy.** Chill activities are *low-system*: one verb, no menus, no rewards engineered (rewards may *happen* — a gist, a fish — but are never the point; the moment the game optimizes chill, chill dies).

**Common mistakes.** Achievements for relaxing ("sit 10 times"), chill-as-buff systems, and filling quiet with content. All forbidden.

**Design principles.**
- EX-41.1: At least three no-objective activities exist within reach of home at all times.
- EX-41.2: Chill time is never mechanically rewarded or punished; it is simply *good*.
- EX-41.3: Chill mode is honored in every system (audio, toasts, tempo) — it is a first-class way to play.

### EX-42 · Belonging

**Purpose.** The destination emotion — the Constitution's arc landing: **Stranger → Regular → Elder.** Belonging is when Lokoja stops being *a game about a city* and becomes *my city*: routes are mine, faces greet me, the market knows my price, the hill knows my steps. Every system in every Bible serves this arc; this chapter is its heartbeat.

**Emotions.** Recognition returned (the city greets back) → responsibility (I keep my corner; I help my street) → rootedness → *home*.

**Visual/Audio language.** Belonging is *earned visibility*: NPC greetings warm with familiarity, the 60 s guest wall long forgotten, your car known at the pump, your seat under the neem tree implied.

**Interaction philosophy.** The game tracks belonging honestly (familiarity, story beats, discoveries, relationships) and *shows* it in the world — never as a meter. An Elder knows they're an Elder because the city treats them like one.

**Common mistakes.** Levels, titles, badges, and progress bars for belonging. The moment belonging is a number, it is fake.

**Design principles.**
- EX-42.1: Belonging is expressed only through world behavior (greetings, prices, recognition), never through UI metrics.
- EX-42.2: The Stranger→Regular→Elder arc is authorable in Content Bible terms (familiarity thresholds drive copy/behavior), but is never displayed as a stat.
- EX-42.3: New players must be able to *watch* belonging on others (an NPC elder treated warmly by the market) — the arc is visible as culture, teaching without tutorial.

### EX-43 · Being Told No (Refusals, M13, and Care)

**Purpose.** The most underestimated experience in the game: the wall that *respects you*. Lokoja's refusals — guest walls, M13 protections, money caps, flood guards, closing times — are all one voice: the Verdict Voice. Each refusal is: the reason (precise), the feeling (care, not judgment), and the path (what would make it possible). M13 is the flagship: the child player must feel *cared for*, never caged; the parent must feel *in command* (ShieldApp tier ladder, parent PIN).

**Emotions.** Being taken seriously (the why is real) → safety (the wall protects, it doesn't patronize) → trust (a game that explains its no's can be trusted with everything else).

**Visual language.** Refusal cards are paper, warm-toned (the Color Line's red is a *boundary*, not an alarm), with the reason in display type and the remedy in body type.

**Audio language.** The one refusal figure (EX-40). Identical every time. The player should hear it once and *never fear it again*.

**Interaction philosophy.** Every refusal offers the *next legal move* in the same breath (a guest wall offers registration *after* the moment completes; an M13 wall offers the parent's tier path; a flood guard offers tomorrow).

**Common mistakes.**
1. *The dead end.* Any wall without a way through, around, or a reason. (The 60 s guest preview wall dead-ending newcomers is the canonical scar.)
2. *Server says, client shrugs.* Copy that contradicts the wire's actual refusal reasons (45 distinct reasons re-counted 2026-10-21, across the registered families — the ledger lives in the wire and grows; the client must speak them all in Verdict Voice, never "Error").
3. *Cage theater.* M13 walls that humiliate the child. Protection is dignity.

**Design principles.**
- EX-43.1: Every refusal in the game uses: reason + feeling + path, in ≤ 2 sentences, in Verdict Voice.
- EX-43.2: Refusals never interrupt a completed action retroactively (walls land between intents, never mid-completion).
- EX-43.3: M13 refusals are identical on client and wire (one law, one voice, both sides).
- EX-43.4: No refusal may be dismissible by payment. Ever.

---

## PART IX — VERIFYING FEELINGS

### 44. The Feel Tests

Feelings are verified by *tests*, not by opinions. These are permanent QA rituals; each maps to the chapters above:

| Test | Ritual | Passes when | Guards |
|---|---|---|---|
| **Confluence Test** | Stand at the deck, zero UI, screenshot, send to a friend | They ask "what is this game?" | EX-37, Art composition law |
| **Silence Test** | Close eyes for one full slot change | The slot is guessable by ear alone | EX-21, Audio Bible |
| **Pocket Test** | Reconcile all money from receipts alone | Every naira accounted for; pocket/purse never confused | EX-27, EX-20 |
| **Blackout Test** | Kill the tab mid-anything; relaunch | Zero state loss; world resumes honestly | EX-6 |
| **Mother Test** | Show any cultural surface to a Nigerian elder | "Yes — that's how it is" | EX-38 |
| **Elder Test** | Play one full session as a returning Elder | The city greets, prices, and remembers | EX-42 |
| **Stranger Test** | Fresh device, cold boot, no guide | First E-press opens something real ≤ 5 min | EX-3, EX-4 |
| **Child Test** | Play as an M13 band with a parent watching | Walls feel like care; parent in command | EX-43 |
| **Rain Test** | Play a full storm slot on a low-tier device | Frame budget held; behavior changed; no lag crime | EX-22 |
| **Exit Test** | Walk every door, ride every fare, climb the whole Patti trail | No stuck states; every refusal voiced | EX-14, EX-9, EX-13 |

### 45. The Feel Registry

Every player-facing PR names its experience entry (Law EX-1). The registry below is the canonical map — keep it in sync when chapters are added:

| Part | Entries | Themes |
|---|---|---|
| II Threshold | EX-2 → EX-6 | First contact, arrival, trust of return |
| III Body | EX-7 → EX-13 | Walking, riding, driving, river, mountain |
| IV Rooms | EX-14 → EX-20 | Interiors, home, market, school, work, worship, bank |
| V Sky | EX-21 → EX-25 | Slots, rain, harmattan, storm/flood, festivals |
| VI Second OS | EX-26 → EX-30 | Phone, money, banking, eating, sleeping |
| VII People | EX-31 → EX-34 | Presence, friendship, community, trust |
| VIII Inner | EX-35 → EX-43 | Exploration, discovery, wonder, homesickness, success, failure, chill, belonging, refusal |
| X Foundations | EX-44 → EX-47 | City memory, human scale, consequence, truth over spectacle |
| IX Verify | 44–45 | Tests and registry |
| XI Layers | 47–50 | Reality, verification, production, future scale |

### 46. Amendment Procedure

This book is a living constitution's right hand. Amendments follow the Content Bible's review gates: a proposal names the chapter, the law changed, the feel preserved, and the test that proves it. Laws EX-1 through EX-43.4 change only by Bible amendment; every amendment is recorded in the chapter's *Horizon* notes and the worklog. Where the Constitution speaks, this book listens — and where this book is silent, build from the nearest chapter's spirit and write down what you learned.

**The last word belongs to the city:** if a proposed change makes Lokoja more *true, warm, and honest* — it is probably right. If it makes Lokoja faster, louder, or more efficient — measure twice, and ask the neem tree.

---

## PART X — THE FOUNDATION LAWS
### *Added in the ERA II upgrade. Seven foundation laws were reviewed for explicit statement; four belong to this book. Their three siblings live in the Content Bible (C-19 → C-21). Where a law here meets a chapter above, both are true and both bind.*

**Law EX-44 — The City Memory Law.** *The city remembers meaningful player actions.* Not as a database remembers — as a street remembers: a favor done becomes an offer later, a greeting repeated becomes warmth, a secret found becomes a story the city can be asked about. Disk truth today: familiarity tiers (stranger → acquaintance → paddy → close-paddy, `social.ts:22-27`), story beats (`story.ts`), idempotent discoveries, relationship state carried in save v20 — real, but shallow; no NPC yet recalls *events*. **Horizon:** per-NPC memory of meaningful acts, wired through the existing relationship grammar, never a private quest system (P1). **Failure condition:** a player action that visibly mattered produces no future difference anywhere — the city forgot; that is a bug against this law.

**Law EX-45 — The Human Scale Law.** *Small moments matter more than empty size.* Lokoja is 750 km of real roads, and the game would still be a failure if the summit view were epic and the neighbor's greeting were flat. The attention budget follows the band: a gist line, a fare negotiated, a plate of food — these outrank any square kilometre added. Every expansion PR names the small moment it deepens or the new one it creates (Content C-19 is this law's growth-rule twin). **Failure condition:** content that adds area, objects, or players without adding one new *small* human moment.

**Law EX-46 — The Consequence Law.** *Actions alter future states.* The honest city keeps what you did: spent naira are gone (conservation), parked cars persist (`VehicleRow`), discoveries are permanent, failure costs what it costs and no more. No state may silently reset behind the player's back — a reset is always a narrated, player-chosen act (the total-reset law: `startNewGame`/`resetGame` birth every life state fresh). **Failure condition:** any mutation the player can observe that leaves no trace in the world, the books, or the save.

**Law EX-47 — Truth Over Spectacle Law.** *Never fake depth.* A crowd that is a texture, a market that is signage, a security badge that outruns the ledger, a stat that implies machinery that does not exist — all are forgeries of the same kind, and all are forbidden. If a thing cannot be real, it is honestly small (`stage: 99`) or it does not ship (C-1). Spectacle is welcome only when the systems underneath it are true. **Failure condition:** any surface that implies machinery the disk does not contain.

---

## PART XI — THE LIVING CONSTITUTION LAYERS
### *The v2.0 upgrade: this book is no longer only doctrine — it is a production instrument.*

### 47. Implementation Reality

**What exists today (disk-verified 2026-10-21):** 63 systems · 26 phone apps · save v20 (HMAC envelope, shadow, backup, 20-step migration ladder) · the wire: 58 client-facing doors / 59 handlers, 4 KB cap, dual rate buckets (per-socket + per-account), idemKey UNIQUE, scrypt PIN, M13 minor walls, N12 clamp · conservation ₦0 drift on the live books (319 ledger rows, full chain walk clean) · 10 interiors + 98 school doors (108 doors) · 21 jobs / 20 hustles / 4 job boards · 14 named NPCs on the familiarity grammar · 5 Patti secrets, idempotent · ferry, postcards, stage/spray/trades on the wire · 100% procedural art and audio.

**What is planned (the honest horizon):** NPC event memory (EX-44's table) · the stall resurrection, then market economy (EX-16.1) · the Bag tab made real · the signed bank/festival/ferry/travel paths (EX-20.1) · rig-per-view co-presence (EX-31.2) · the hospital interior, when it can be honestly a hospital (W-54). Swimming is *not* planned — the river's inviolability (W-3) stands until amended.

**What is forbidden:** faking any of the above with copy or props (EX-47) · any unsigned money path (EX-27.4) · decorative content (C-1) · anxiety timers, gambling, pay-to-mean (Content red lines) · a second visual, audio, or narrative grammar (A-30, W-59).

### 48. The Verification Layer

Every major law is checkable. QA files against law numbers; this table says how each is proven and how it fails:

| Laws | Verification method | Responsible system | Failure condition |
|---|---|---|---|
| EX-2, EX-6 | Cold-boot stopwatch; kill-tab relaunch (Blackout Test) | boot path, save descent | > 2 taps to creation; any state loss |
| EX-3 → EX-5 | Stranger Test on a fresh device | spawn path, distance loops | empty spawn; stub E-press; wall mid-flow |
| EX-7, EX-8 | Walk a launch district 60 s; sprint-energy check | `controls.ts`, `needs.ts` | no affordance passed; alarm-style tiredness |
| EX-9 → EX-11 | Exit Test fares; wire refuel; plate uniqueness | `travel.ts`, wire vehicle doors | silent debit; teleport ride; shared rig |
| EX-12, EX-13 | Confluence/summit walk; secret replay | `patti.ts`, collision law | occluded sightline; double-paid secret |
| EX-14 → EX-20 | Walk every door both ways; reconcile receipts | `interiors.ts`, bank paths | dead room; unsigned row; the SECURE lie |
| EX-21 → EX-25 | Silence Test; Rain Test on low tier; festival four-plan check | `atmosphere.ts`, `ambience.ts`, calendar | slot pop; frame crime; unsigned festival joy |
| EX-26 → EX-30 | Freeze-law poke; Pocket Test; sleep-save loop | `WorldPhoneLayer`, wallet, `housing.ts` | input bleed; unreconcilable ₦; unsafe bed |
| EX-31 → EX-34 | Two-device presence walk; child-account wall sweep | wire presence, M13 walls | presence lie; client↔wire wall mismatch |
| EX-35 → EX-43 | Discovery replay; refusal sweep (all 45 reasons) | discovery ledger, Verdict Voice copy | repeat toast; "Error" in place of a why |
| EX-44 → EX-47 | Consequence walk: act → save → return → verify trace | save, books, story, memory horizon | forgotten act; fake depth |

### 49. The Production Layer

**"How do I build this without breaking Lokoja?"** — the standing answers:

- **Before any edit:** read the fifteen load-bearing files (`ERA2-UI-AUDIT.md` §1). The wire imports game systems *verbatim* — a "tweak" to `wheels.ts`, `ledger.ts`, `bodies.ts`, `socialgraph.ts`, or `live.ts` changes the server too; run both suites.
- **Player-facing feature:** name its EX entries in the PR (EX-1) → playbook (Content Part III) → gates (Content Part VIII) → the Feel Test that proves it.
- **Money:** new money = new door = the full ritual (C-11). Never add a sixth bypass site.
- **World truth:** new geometry obeys W-1/W-31/W-32; new places obey the G2 gate order (W-30); every panel freezes input (EX-26.2).
- **UI:** one grammar (A-26), the six-step type scale (A-27), one WHY source (C-15).
- **When this book and a deadline disagree:** gates may be scheduled; laws may not be skipped.

### 50. The Future Scale Layer

Lokoja must scale without losing its soul. The pre-committed rules:

- **Millions of players:** the wire is per-street truth, not a global feed. The roster fan-out (O(n²) on presence changes today — a named debt) must go district-scoped before nation scale. SQLite is the honest beginning, not the forever — the chain-ledger *format* is the portability contract. The relay lane degrades, never lies.
- **Multiple districts:** growth rides the OSM pipeline and the G2 promotion gate (W-30). A new district is a *character sheet*, a *mix*, and a *wash* before it is geometry.
- **AI citizens:** the nation-sim kernel (10k NPCs off-thread) is crowd *weather*, never a replacement for authored neighbors (W-50, C-20). AI may fill a market's bustle; it may not hand out quests, speak gist, or replace a named NPC.
- **Economic expansion:** conservation is load-bearing at any scale (C-11's ritual); new value sinks and sources amend the Bibles first.
- **Live content:** feature flags (`flags.ts`), the calendar, and the Forge vote are the lawful live levers; nothing live may break the Feel Tests.
- **The soul clause:** at any scale, a player from today must still recognize the city in ten years — the anchors, the sightlines, and the names never move.





