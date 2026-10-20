# LOKOJA LIFE — CONTENT BIBLE
### Version 2.0 · The book of growth

> **Authority.** Subordinate to the **Design Constitution**. This book owns *how the game grows*: the laws every future content addition obeys, the playbook for each content type, the wire rulebook, the save law, the performance budgets, the copy voice, and the review gates.
>
> **Companions.** `Experience_Bible.md` (the feelings content must serve — each playbook names its EX chapters), `World_Bible.md` (the place content enters — each playbook names its W laws), `Art_Audio_Bible.md` (the senses content wears — each playbook names its A laws).
>
> **Reader.** This is the book a new contributor opens on day one — and the book a veteran opens before every merge. If a rule here surprises you, the rule wins until amended.
>
> **Upgrade (v2.0, 2026-10-21).** The ERA II reverification pass: counts re-verified on disk (48 unit suites, 58 client-facing doors, 45 refusal reasons, 12/6 placed signal heads/bumps, 16 Prisma models), the three Foundation Laws enter the register (C-19 → C-21, §1.1), and the living-constitution layers added (Part XI). Audit of record: `docs/BIBLE_UPGRADE_AUDIT.md`.

---

## PART 0 — THE CONTENT DOCTRINE

### 0.1 Content is a promise

In Lokoja Life, *content* is anything the player can perceive: an NPC, a stall, a job, a meal, an app, a sound, a line of copy, a festival. Every piece of content makes a promise — the experience entries of the Experience Bible are those promises. **Content that cannot keep its promise is not shipped; content that keeps it is never removed without amendment.**

### 0.2 Wired or dead — there is no decorative

**Law C-1 — Everything the player can perceive is either wired or honestly labeled.** The audit found the cost of violating this: 15 decorative/dead world paths (stalls nobody trades at, landmarks with no handlers, unhailable rigs) — every one is now a *named debt*. New code adds zero decorative content. If it renders, it answers E; if it can't answer yet, it doesn't render (or it renders behind the stage law, §0.3).

### 0.3 The stage law

`stage: 99` is the game's honesty number: *declared unbuilt*. It is a truth-in-advertising system, not a hiding place:

- **Law C-2 — Stage is declared, never implied.** Locked content tells the player it is locked and roughly *what it will be* — never fake-loads, never gray lie. (World W-29; Experience EX-4.2: no stage-99 rows inside the first hour.)
- Stages climb only through this book's Definition of Done (§1). A stage number is a *contract with the player's patience*.

### 0.4 Identity conservation

**Law C-3 — Growth preserves identity.** The city's character (World Bible district sheets), its senses (Art & Audio Bibles), its feelings (Experience Bible) are *load-bearing*. A content addition that is good-but-foreign is rejected; a content addition that is smaller-but-true is welcomed. When in doubt: **few but true beats many but fake** (W-50).

### 0.5 The mother test and the honest wire

Two gates stand above all content gates: the **Mother Test** (cultural truth and dignity — EX-38.1) and the **Honest Wire** (all state changes through signed, idempotent, receipted paths — EX-27.4). No playbook below can waive them; the Constitution cannot be outvoted by a good idea.

---

## PART I — THE TEN CONTENT LAWS

1. **C-1 Wired or dead** — no decorative content; dead content is a named debt.
2. **C-2 Stage honesty** — locked content declares itself; no fake states.
3. **C-3 Identity conservation** — growth in-voice, in-palette, in-grammar, or not at all.
4. **C-4 The registry** — every content type has one canonical data file (the register); duplicates are bugs. *Locations → `data/locations.ts` · jobs → `data/jobs.ts` · hustles → `data/hustles.ts` · meals → `MEAL_BY_KEY` · Patti secrets → `patti.ts` · fleet/transport → `types.ts` + config · weather → `types.ts` + `config.ts` · copy why-labels → one WHY source (§7).* The phone-app manifest drift (`manifest.ts` says 10, the grid is 26 — audit) is the cautionary tale: **one register or two lies.**
5. **C-5 Caps are law** — new content respects the performance budget registry (§6) or amends it first.
6. **C-6 The save is sacred** — new player-facing state joins save v20's schema through the migration ladder (§5), or it doesn't persist and *says so*.
7. **C-7 M13 by construction** — child-safety is designed-in (band gates, wall parity with the wire), never patched on.
8. **C-8 The Refusal Covenant** — every new gate ships its Verdict Voice why + next move (EX-43.1), on the same wire reasons the server speaks (45 reasons re-counted 2026-10-21, across the registered families — the ledger lives in the wire and grows; the client speaks them all, never "Error").
9. **C-9 Test what can fail** — every law-flavored behavior gets a test (unit/e2e per §8); untestable laws are rewritten until testable.
10. **C-10 The Bibles are amended together** — a change to city facts updates World's quick sheet; a change to feelings updates Experience; a change to senses updates Art & Audio. One truth, four books, one edit wave.

### 1.1 The three Foundation Laws (ERA II canon)

Seven foundation laws were reviewed in the ERA II reverification; four entered the Experience Bible (EX-44 → EX-47). Three belong here, where growth is governed:

- **Law C-19 — Performance Before Expansion.** *Never expand the world before the current world breathes.* A new district, app, or festival cannot enter review while a Gate-0 trust debt or a red SILK gate stands — the budget gate (§8.1) is not a formality. The caps registry (§6) is measured per release; the stall resurrection, the fabric ledger, and the boot diet precede all new playbooks. Why: expansion on a limping world multiplies the limp.
- **Law C-20 — AI Citizen.** *AI enhances humanity; it never replaces it.* The procedural crowd kernel, the murmur band, the nation sim — these are *weather*, filling the world's bustle. What they may never do: replace a named NPC, author gist, grant quests, or hold money. Every AI-assisted contribution follows the same playbooks and gates as human work, and a named NPC's voice is always human-written. Why: the city's soul is specific people (W-50); simulated specificity is the one thing this book exists to prevent.
- **Law C-21 — Cultural Respect.** *Lokoja is represented, never exploited.* Every cultural surface — faith, markets, language, festivals, history, clothing — enters as a resident's truth. The Mother Test is a gate with veto power, not a vibe. Real ward names are never rebranded; no sacred practice becomes a mechanic; no hardship becomes a toy; no stereotype becomes content. Why: the game's deepest purpose (EX-38) dies the day the culture becomes decoration.

---

## PART II — THE DEFINITION OF DONE

A content item is **Done** when *all* of these hold — for any type:

1. **Registered** — in its canonical register (C-4), with id, name, description.
2. **Wired** — perceivable *and* answerable in-world (E answers, app opens, fare pays). Wired paths pass the Exit Test (EX-44: no stuck states).
3. **In-identity** — passes its playbook's chapter checks + the Art Test (A-IX) + Mother Test.
4. **Economically honest** — any money path is signed/idempotent/receipted (C-0.5); any grant conserved.
5. **Voiced** — every refusal has its Verdict Voice line; every why-label in the single source (C-4).
6. **Capped** — respects §6 budgets; measured, not assumed.
7. **Saved** — state persists through the v20 ladder or declares session-only.
8. **Tested** — per §8's gates; the law it claims is the law a test checks.
9. **Documented** — the Bibles it touched are amended (C-10) and the worklog records the anchor.

*If an item cannot meet 1–9, it is not Done — it is either a debt (named here and in the worklog) or it waits.*

---

## PART III — THE PLAYBOOKS

Each playbook: **where it lives** (register) · **laws it serves** · **the rules** · **the checklist**. A playbook violation is a failed review, not a discussion.

### P1 · NPCs (and wildlife)

**Lives:** world/Actors + a new `data/npcs.ts` register when the count outgrows constants.
**Serves:** W-50/W-51 (few but true; neighbors not dispensers), EX-18/33/42, A-19/A-20.
**Rules:**
- Every NPC is a *someone*: name (Nigerian-true), home corner (one district), one rhythm (what slot they're out), one memory (what they recall about you), one want.
- Relationship grammar stays the disk law: talk (4 u) → familiarity → favors → real hustle offers → gifts → hangouts. New NPCs plug into this grammar; they never invent a private quest system.
- NPCs enter the world at **≤ +2 per release** until crowd systems exist (C-5 budget): each must be *met*, not passed.
- M13: NPC dialogue is banded (age-appropriate registers); crime-adjacent asks stay refusals (CRIME_REFUSALS law).
- **Wildlife profile:** ambient-only, no interaction capture, no economy (W-45). Birds and goats have right of way.

**Checklist:** name · corner · slot rhythm · memory line · familiarity hooks · M13 pass · hair/cloth palette (A-20) · ambience presence (does the district's mix know they exist?) · test: familiarity → offer path.

### P2 · Buildings, interiors & doors

**Lives:** `world3d/layout.ts` (doors) · `world3d/interiors.ts` (interiors + hotspots) · `schools.ts` (school fabric).
**Serves:** EX-14/15, W-40/W-54, A-13/A-42, C-1.
**Rules:**
- **No dead rooms** (EX-14.1): an interior ships with ≥ 3 wired hotspots or not at all. Furniture IS interface (EX-14.4): functions are walkable hotspots first, panels second.
- Every building type claims: a wash family (A-8), a room-layer parameter set (A-42), a threshold cut ≤ 1 s (EX-14.2), and collision completeness (the civic-fence debt is the cautionary tale).
- Interiors never pause the world (NO-PAUSE; EX-14.3): the wire stays live, the clock keeps its slot.
- Door ids join the location namespace (32 anchors / 108 doors today) — ids are the anchor⇄map⇄travel⇄presence namespace and are never recycled.
- New buildings respect the protected sightlines (W-3/W-17) and approach compositions (A-1.2).

**Checklist:** door in namespace · interior with 3+ hotspots · wash family · room params · both-way exit test · sightline check · save integration for any state it keeps.

### P3 · Districts & G2 promotion

**Lives:** `data/locations.ts` (G2_LOCATIONS) · `systems/chaos.ts` (zone claims) · ambience mix tables (A-37).
**Serves:** W-28/W-29/W-30, EX-35/38, A-8/A-37.
**Rules:**
- Names are the community's real names (W-28); descriptions follow the Adankolo register (specific, warm, true — `locations.ts:347` is the canon sentence pattern).
- The promotion gate order is **name → description → ambience → one wired activity → anchor** (W-30). A ward skips no step; decoration without wiring is refused.
- Each new district ships its ambience fingerprint (gain table over the 8 layers) and its facade wash family — *or it doesn't ship* (W-56, A-8).
- District attribution must be truthful on the map and in the world (the home-anchor 0-buildings debt is the warning: W-39).
- Travel economics: the fare law handles distance automatically (`travel.ts:70-73`); a new district never hand-patches its own fares.

**Checklist:** real name · Adankolo-register description · wash family · 8-layer mix · one wired activity · anchor registered · map/world parity (W-2) · guards pass (flood/river-cut honest).

### P4 · Jobs

**Lives:** `data/jobs.ts` (21 today).
**Serves:** EX-18, W-52/W-53, C-7/C-8.
**Rules:**
- Every job has: a place (district-fit, W-52), a body ritual (no click-work, EX-18.1), a skill coupling (config `WORK`), an honest fail path, and a wage that grows with skill (no ladderless grind, EX-18.2).
- Job work consumes slot time honestly (EX-18.2); payday is narrated + receipted (EX-18.3).
- Job boards (4 POIs) must always surface a *now* and a *next* offer (EX-18.4).
- New jobs respect the M13 band law: hazardous/adult trades gate by band on client *and* wire (C-7).
- Max **+2 jobs per release** until the body-ritual library grows — a new ritual system is a system, not content (amend if needed).

**Checklist:** place · ritual · skill coupling · fail path · band gates · payday ceremony · board surfacing · wage curve test.

### P5 · Hustles

**Lives:** `data/hustles.ts` (20 today), `systems/work.ts`.
**Serves:** EX-18/40, W-53, the risk law (`work.ts:8` — difficulty vs skill decides).
**Rules:**
- Hustles are riskier than jobs *by design and by math* — the risk must be legible before the attempt (what can go wrong, what it costs).
- Failures narrate and cap (EX-40.1): what happened, what would help, next move. No spirals (EX-40.2).
- Hustle money is the same conserved money: no unsigned shortcuts (the 5 bypass sites are *named debts*, not precedents — EX-20.1).
- No gambling-adjacent hustle ever (betting-adjacent systems are a red line, §10) — this includes loot-box mechanics, "double or nothing" RNG on money, and gacha.

**Checklist:** risk legible · fail narrated + capped · skill curve · band gates · signed path · red-line scan.

### P6 · Foods & meals

**Lives:** `MEAL_BY_KEY` (config), needs law (`needs.ts`), stove + strip surfaces.
**Serves:** EX-29, W-24/W-25/W-64, A-3 (senses agree: food must sound and look cooked).
**Rules:**
- A meal is: named truly (no invented "exotic"; the Mother Test), priced by place/portion honestly, restorative *visibly* (needs math said plainly, EX-29.2), and available at a place (EX-29.1).
- The kindness law: the cheapest respectable plate always exists (EX-29.4/W-25); food never gates progress (EX-29.3).
- Meals join the seasonal law: each season changes ≥ 1 meal (W-64) — harmattan mornings have their dish; that's the law, not a suggestion.
- Cooking at the stove is a gesture ritual (EX-29): new recipes ship with their sizzle mix (A-37 extension) and steam/pan presence or they are menu-only *by design*.

**Checklist:** true name · honest price · visible restore · place availability · seasonal slot · sizzle/steam pass · needs test.

### P7 · Businesses & tills

**Lives:** biz systems + tills (My Biz app, store tills).
**Serves:** EX-18/27/39, W-52/W-53, C-0.5.
**Rules:**
- A business is *run*, not owned-as-number: stock, price, till, and the day's takings are visible state; biz growth follows the same conserved money as everything else.
- Till transactions are wire-signed, idempotent, receipted (C-0.5) — a till that mints is a P0.
- Business places obey district truth (a photocopy shop belongs in University Area, W-52); signage follows A-9's painter grammar.
- M13: children may *work* family-adjacent tills with band-appropriate limits (the server's minor money walls are law; the client mirrors them exactly, C-7).

**Checklist:** visible stock/price/till · signed till path · district fit · signage grammar · band walls parity · takings receipt.

### P8 · Quests & stories

**Lives:** `systems/story.ts` (the 5-chapter chain + `STORY_BEATS` — `story.ts:371`), wardrobe drops.
**Serves:** EX-36/38/39, W-60, C-2.
**Rules:**
- Stories are *lives*, not errands: the existing 5-chapter chain is the register's soul — beats arrive through places and people, never through HUD trackers (no quest-log UI exists; none may be added without amending the Whisper HUD doctrine, EX-26.1).
- Every beat is: grounded in a real place, voiced in Verdict/district registers, M13-banded, and *slot-aware* (a story that ignores the 4-slot clock breaks W-63).
- Rewards are memory-first (clothes, postcards, knowledge, views), money-second (EX-25.2); all money is signed (C-0.5).
- No FOMO: nothing missable-forever (EX-25.3). Stories wait for the player; the city is unhurried.
- New chapters join the ladder *after* the existing chain's shape is honored — the story register documents its own beats in `STORY_BEATS` (C-4).

**Checklist:** place-grounded · register entry · band pass · slot-aware · reward policy · no-tracker pass · signed rewards.

### P9 · Festivals

**Lives:** calendar config (new register when the first festival ships) + crowd/stage/spray systems (existing wire truth).
**Serves:** EX-25, W-64, A-38, C-0.5.
**Rules:**
- The four-plan law: a festival ships only with **crowd plan + audio plan + signed economy plan + dress plan** — all four or none (EX-25.1).
- Festival economy: sprays/gifts through the existing signed stage systems; *zero* new money paths without the wire rulebook (§4). The festival unsigned write (audit §5A) dies before any festival ships.
- Recurrence is kind: nothing missable-forever (EX-25.3); the calendar is honest (dates are city-truth, not engagement levers).
- Dress: wardrobes get festival cloth (P10); the city dresses (bunting/cloth under the wind law, A-3.3); crowds get the festival headroom *within caps* (EX-25.4).

**Checklist:** four plans · signed paths only · recurrence honest · crowd caps · music arrangement pass · dress register.

### P10 · Vehicles

**Lives:** `types.ts` VehicleModel (4 kinds today: okada/keke/taxi/danfo), garage/DMV law, `VehicleRow` (plate `@unique`).
**Serves:** EX-10/11, W-38/W-61, A-22.
**Rules:**
- A new vehicle brings a *culture*, not a mesh (W-61): its sound texture (A-8.4), its fare tier if hireable, its social contract (who rides, who drives), its silhouette (A-1).
- Plates are forever-unique through the DMV wall (W-38) — the duplicate-plate era is history and stays history.
- The rig law: one rig per vehicle per viewer (EX-10.4); a new vehicle that increases rig sharing is refused until the per-instance fix lands.
- Fuel/odometer truth stays on the wire (EX-10.1); the offline mirror debt (split-brain tank) must not be extended to new vehicles.
- Body art follows the canvas painter (A-9): route names, slogans, honest wear.

**Checklist:** culture sheet · sound texture · plate/DMV pass · rig-law pass · wire fuel truth · painter art · cap check (§6).

### P11 · Clothing

**Lives:** wardrobe systems (wardrobe app/panel, wardrobe drops via story).
**Serves:** EX-15/25/39, A-20, C-7.
**Rules:**
- Cloth is identity and memory: festival cloth, story cloth, milestone cloth — each with a *provenance* (where it came from is part of the garment; the wardrobe remembers).
- Palette honesty (A-20): Nigerian-true textiles and color logic; no arbitrary neon.
- Look editors stay one grammar (the audit's four/five avatar-editor debt is a unification debt, not a pattern to copy).
- M13: clothing is dignity-safe by construction (no commodified self-presentation; no social-rating-by-outfit systems — red line, §10).

**Checklist:** provenance · palette pass · editor grammar · band pass · drop source signed.

### P12 · Collectibles

**Lives:** the Patti pattern (`patti.ts` — 5 secrets, 2 Hz poll, 9 u radius, idempotent discovery).
**Serves:** EX-13/36, W-4/W-15, EX-36.2.
**Rules:**
- The Patti pattern is the *only* sanctioned collectible shape: presence-based (you arrive, you don't grind), idempotent (never pays twice), permanent, narrated (each discovery tells one honest paragraph), and *closed sets* (a set is a named number by law; growth = amendment).
- Rewards are knowledge/view-first, modest grants second (EX-13.2); collectibles never gate systems (they are love letters, not keys).
- Set closure: "exactly five secrets" is canon until amended (W-15); any new set names its count and its district-truth in the register.

**Checklist:** presence trigger · idempotency test · paragraph · set size declared · reward policy · sightline/terrain respect.

### P13 · Activities (interior & district actions)

**Lives:** `interiors.ts` hotspots (bed/stove/fridge/sofa/tv/bath/wardrobe/menu/shop grammar), location activity rows (the `stage` system).
**Serves:** EX-14/41, C-1/C-2, A-42.
**Rules:**
- An activity is one verb at one place: walkable hotspots first (EX-14.4); the hotspot grammar (bed=sleep, stove=cook, tv=evening…) is the register — new hotspot kinds amend it.
- Chill activities obey EX-41: no objective, no engineered reward; at least three no-objective activities stay within reach of home (EX-41.1).
- Locked activities use the stage law (C-2) — declared future, honest copy.
- Every activity consumes honest resources it claims (slot time, energy, money) through the signed paths (C-0.5).

**Checklist:** one verb · hotspot grammar fit · resource truth · stage honesty · chill compliance · room/district mix.

### P14 · Phone apps

**Lives:** `PhoneScreen.tsx` (the 26-app grid) — with the manifest debt (`manifest.ts` says 10, grid is 26) to be reconciled into the one register (C-4) *before* app #27.
**Serves:** EX-26, A-26/A-34, C-4.
**Rules:**
- An app exists because a *life needs it*, not because a feature needs a home (EX-26.3: the grid grows with need, never inventory). Before proposing an app: can an existing app carry it? Can the *world* carry it (buildings-as-interface)?
- Every app: one visual grammar (paper UI, A-26), drawn icons (A-34), Verdict Voice copy, freeze-law compliance (input frozen, world alive, EX-26.2), M13 parity with the wire (C-7).
- Wire-backed apps follow §4's door rules; store-backed apps follow §5's save rules; read-only books declare their truth-source.
- The grid is 2×N; icons are ink strokes; app names are the street's words, not feature names.

**Checklist:** need test · register reconciliation · grammar pass · freeze pass · band parity · data-source declaration · why-labels in the single source.

### P15 · Ambience & music content

**Lives:** `ambience.ts` (8 layers), `music.ts` (the afro-fusion engine), `atmosphere.ts` (light's twin).
**Serves:** A-35→A-47, W-56/W-57, EX-21/22.
**Rules:**
- New ambience = new shaped-noise layer + its truth-driver (A-36); no recordings, ever (A-2).
- Music changes stay in the grammar (A-39); new *motifs* are amendments (A-40); festival arrangements are the lawful density exception (A-38).
- Every new mix is authored on phone speakers first (A-45) and budgeted (A-46).
- District/interior/weather mixes ship with their content (A-37/A-42/W-56) — a place without its mix is half-shipped.

**Checklist:** truth-driver · phone-speaker pass · node budget · grammar pass · mix shipped with place.

---

## PART IV — THE WIRE RULEBOOK
### *Adding or changing anything the server owns.*

The wire (`mini-services/nation-wire/index.ts` — Bun + `bun:sqlite` on the shared `db/custom.db`, WAL; 58 client-facing doors / 59 handlers incl. disconnect; one socket lane behind Caddy :81) is the city's honest spine. **The server imports game systems verbatim — editing shared systems edits the server too.**

**Law C-11 — New money = new door = the full ritual.** Any feature that moves ₦ across players or between pocket and purse ships as a server door with ALL of:

1. **Server authority** — the server re-judges the world's claims (position, proximity, state) from *its own* truth (the refuel pattern: `index.ts:1460-1464` — client coordinates are a claim, never a fact).
2. **Idempotency** — `idemKey` minted by the client intent, UNIQUE-constrained (`LedgerRow.idemKey @unique`); replays return the first verdict, never a second debit.
3. **Conservation** — every move touches two sides; drift ₦0 (the 319/319 proof posture is the bar).
4. **Chain integrity** — writes through the chainHash ledger (`index.ts:963-1019` theHealthiestPath pattern); no direct cash writes anywhere (the 5 bypass sites are debts to kill, not patterns to copy).
5. **Walls** — M13 band checks, PIN checks on purse paths, LEDGER_LIMITS caps, per-socket *and* per-account rate buckets (`index.ts:711-780`).
6. **Size & cadence law** — 4 KB packet cap (`index.ts:1064`); body 10 Hz / vehicles 12 Hz only-while-moving; a new channel respects the cadence table or amends it.
7. **Refusal parity** — every new refusal reason joins the 45-reason ledger AND its Verdict Voice line ships in the same PR (C-8).
8. **Relay honesty** — if the door matters during wire-down, the degraded relay lane (`/api/live/sync`, 12 s) carries it or the feature says it doesn't work offline. No silent assumption.
9. **Tests** — a door test proves: replay-safe, wall-enforced, conservation ₦0, refusal voiced. (Test-DB seam law: tests never write production books — the pre-ERA I scar.)

**Checklist for the PR:** server re-judge · idemKey · chain write · walls · caps · packet size · cadence · refusal copy · relay statement · door test · worklog anchor.

---

## PART V — SAVE & MIGRATION LAW

**GROUND.** Save v20 (`save.ts:45`), HMAC envelope + shadow + backup descent, a 20-step migration ladder; 16 Prisma models with migrations baselined (`0_init` + hardening indexes); autosave 1.2 s debounce + pagehide flush; reconnect `resume` gap cap 100.

**Law C-12 — The ladder is the only way in.** New persisted state: extend the schema → write the migration step (`vN → vN+1`) → bump `SAVE_VERSION` → keep *every* old step runnable (a player on v1 must reach v21 through the same ladder). Migrations never lose data (the `--accept-data-loss` era is dead; `prisma/migrations` is baselined).

- Guest-to-account merge keeps the *further of local/cloud* law (`guest.ts:106-141`) — new state participates in the merge law or declares itself device-local honestly.
- Session-only state (UI prefs, phone deep-links) declares itself; it never pretends to persist.
- The **multi-tab truth**: until a session lock exists, no new system may assume single-writer safety (the audit's two-writers scar); copy warns honestly.

**Checklist:** schema step · migration · version bump · old-ladder test · merge-law participation · session-only declaration (if so).

---

## PART VI — PERFORMANCE BUDGETS (the caps registry)

These numbers are law (disk-verified). A PR that exceeds one amends this table *first*:

| Budget | Value | Anchor |
|---|---|---|
| Trees (render guild) | **720** | `flora.ts:115` |
| Grass tufts | **10,000** | flora |
| Patti rocks | 110 | layout |
| Traffic lights | **12 placed / 14 cap** | `junctions.ts:46,168-212` |
| Signal phase | GREEN 12 / AMBER 3 / RED 15 | `junctions.ts:52-54` |
| Speed bumps | **6 placed / 12 cap** | junctions |
| Lamps | 492 live / **1,500** cap | layout |
| Drains | 204 live / **1,800** cap | drains.ts |
| Plates | **40** cap · unique forever | plates.ts |
| Rain particles | **620** | polish |
| NPCs | **12** (night 4) | `Actors.tsx:356` |
| Ambient traffic rigs | **14** (loops 0–2) | `Actors.tsx:749` |
| Terrain grid | 161×161, 6 ms/frame slice | WorldTerrain |
| Shadow | ONE 1024² sun, Governor-cadenced | WorldScene |
| Tone mapping | ACES @1.12 | WorldScene |
| Packet size | **4 KB** | `index.ts:1064` |
| Body / vehicle cadence | 10 Hz / 12 Hz moving-only | wire law |
| Reconnect gap replay | cap **100** | `index.ts:537-540` |
| Toasts | 3.2 s life · max 3 | UI law |
| Walk / sprint | 4.4 / 7.4 u/s | controls |
| Energy burn | past 150 m, settled on exit | `controls.ts:284-304` |
| SILK posture | TTI < 3.0 s · wire < 900 KB · 0 errors | `scripts/silk-gates.ts` |
| FramePacer (low tier) | 30 Hz | device.ts |
| Interaction radii | anchor 8.6 · POI 5.3 · door 3.2 · hotspot 2.1 · talk 4.0 · gist 24 · car 4.6 · pump 26 · shop 28 · secret 9 | `Actors.tsx` registries |

**Law C-13 — Budgets are measured, not assumed.** The measurement tools exist (SILK gates, PerfChip, the audit's computed probes); a PR that says "should be fine" is not done.

---

## PART VII — COPY & VOICE

### 7.1 One voice, many mouths

The game speaks with **one narrator** (W-59) through registers:

| Register | Where | Sound |
|---|---|---|
| **The Verdict Voice** | Refusals, walls, guards, why-labels | Warm, precise, brief: reason + feeling + path, ≤ 2 sentences (EX-43.1) |
| **The Street (wry)** | NPC gist, conductors, market copy | Nigerian humor, alongside never at |
| **The Ward register** | District/ward descriptions | Specific, warm, true (Adankolo pattern) |
| **The Rememberer** | History, Patti secrets, monument | Dignified, resident's voice, one paragraph |
| **The Whisper** | HUD chips, prompts | Minimum words, zero exclamation marks |

### 7.2 The copy laws

- **C-14 — The Mother Test governs all of it** (EX-38.1). Real grammar or silence (W-58); no fake pidgin, no brochure history.
- **C-15 — Why-labels have one home.** The audit found why-maps duplicated per surface (refuel whys in HudOverlay AND GaragePanel). One WHY source in the register; every surface reads it. A why written twice is a why that will lie once.
- **C-16 — Numbers speak Verdict.** "₦200 — the fare, base + 4 km" beats "Fare applied." Every price says what it is.
- **C-17 — No exclamation marks in system copy.** The city is unhurried; the punctuation proves it. (NPC speech may laugh.)
- **C-18 — English names the thing; the street names the feeling.** "Ganaja Junction" on the pin; "you don reach junction" in the gist. Both true; never mixed in one line.

---

## PART VIII — TEST & REVIEW GATES

### 8.1 The gate order

1. **Playbook gate** — the content's playbook checklist (P1–P15) passes.
2. **Identity gate** — Art Test (A-IX) + Mother Test + district/feel check.
3. **Wire gate** — §4 checklist for anything the server owns.
4. **Save gate** — §5 checklist for anything persisted.
5. **Budget gate** — §6 measured, not assumed.
6. **Feel gate** — the PR names its EX entries; the relevant Feel Test (EX-44) is run.
7. **Bible gate** — C-10: the books amended together, the worklog anchored.

### 8.2 The test floor

- Every law-flavored behavior has a test (C-9): unit for math/laws, e2e for journeys (the 48 unit + 58 e2e suites are the floor, not the ceiling).
- The scar tests never regress: double-pay, unsigned bank, duplicate plates, tests-on-prod-books, accept-data-loss boot, shared-rig theft, presence staleness — each has or gets a regression test; a PR that breaks one is a P0 regardless of review.
- The e2e suite owns the Exit Test (Experience §44's Feel Tests): every door both ways, every fare quoted-then-paid, the whole Patti trail.

---

## PART IX — ONBOARDING A NEW CONTRIBUTOR

**Day one reading order (in this order, no skipping):**

1. The **Design Constitution** — the laws above all laws.
2. `Experience_Bible.md` Part 0–I (the doctrine) — then the chapters your work touches.
3. `World_Bible.md` §0 + the district sheets you'll touch.
4. `Art_Audio_Bible.md` Part 0 + your medium's parts.
5. This book, whole.
6. `docs/ERA2-UI-AUDIT.md` — the honest state of the machine you're joining.

**Then:** pair on one small playbook item (a meal, a stall row, a gist line) with its full gate run. Your first PR teaches you the gates; the gates teach you the city.

**The contributor's oath (informal but real):** *I will not fake the city. I will not mint its money, lie in its copy, exceed its budgets, or break its trust. When I don't know, I will measure. When I add, I will amend the books.*

---

## PART X — RED LINES
### *What must never be added, whatever the metrics say.*

1. **Any real-money purchase of in-game advantage** (pay-to-win, pay-to-mean, pay-to-skip-the-city). The city's dignity is not for sale (EX-43.4).
2. **Gambling or loot-box mechanics of any kind** — no betting shops, no gacha, no double-or-nothing RNG on money (W-23's law, generalized).
3. **Timers that manufacture anxiety** — energy alarms, decay threats, FOMO windows (the unhurried law).
4. **Crashes, death, or gore as mechanics** — Soft Failure is permanent (W-35, EX-40).
5. **Dark patterns** — confirm-shaming, hidden costs, subscription traps, streak blackmail (the Refusal Covenant's opposite).
6. **Surveillance of players** — location history of others, map stalking, read receipts as pressure (EX-32.3).
7. **Fake social proof** — bot crowds, fake "X is playing" strings, rented presence (The Honest Wire's social face; the Live roster is real or absent).
8. **Cultural caricature** — fake pidgin, exotic-ized rituals, museum Africa (EX-38; the Mother Test fails it).
9. **Assets that break the procedural law** — model files, audio files, photo textures without amendment (A-2).
10. **A second visual, audio, or narrative language** (A-30, W-59) — one grammar, forever.

Breaking a red line is not a review note; it is a refusal — and the Constitution itself, not any reviewer, is the author of the refusal.

---

## PART XI — THE LIVING CONSTITUTION LAYERS
### *Added in the ERA II upgrade (v2.0). The growth book, instrumented.*

### 11.1 Implementation Reality

**What exists today (disk-verified 2026-10-21):** 15 playbooks with a live review order · save v20 over 16 Prisma models, migrations baselined · 48 unit suites + 58 e2e suites · 26 apps (7 wire-backed, 12 store-backed, 6 read-only) · 21 jobs / 20 hustles / 4 boards · 5 Patti secrets · 10 festivals on a 72-day calendar · 58 client-facing wire doors with the full C-11 ritual on money · the refusal ledger at 45 reasons · conservation ₦0 drift on the live books.

**What is planned:** the one-register reconciliation for phone apps (before app #27) · the WHY single-source (C-15) · discovery moved from localStorage into the save (the v21 candidate) · market content after the stall resurrection · the festival playbook's first live run · exterior door pins for the five G2 rooms · per-NPC event memory (EX-44's horizon).

**What is forbidden:** everything in Part X's red lines · decorative content (C-1) · unsigned money (C-11) · data-loss migrations (C-12) · unmeasured budgets (C-13) · expansion while a Gate-0 debt stands (C-19).

### 11.2 The Verification Layer

| Laws | Verification method | Responsible system | Failure condition |
|---|---|---|---|
| C-1, C-2 | decorative-path sweep; stage-99 copy check | `test-world3d.ts` + copy register | dead content; fake state |
| C-3, C-21 | playbook identity pass + Art Test + Mother Test | review gates | good-but-foreign content; exploited culture |
| C-4 | register grep: two homes for one truth | data registers | manifest-style drift |
| C-5, C-13 | caps diff + SILK run on the PR | §6 registry, `silk-gates.ts` | unmeasured "should be fine" |
| C-6, C-12 | migration ladder test v1 → current; merge-law check | `save.ts` | lost state; a broken ladder |
| C-7, C-8 | child-band sweep both sides; refusal-copy parity | wire walls + client | wall mismatch; bare "Error" |
| C-9 | suite run: 48 + 58 green | run-battery | a red law test |
| C-10 | four-book diff in the PR | the Bibles | one book amended alone |
| C-11 | the 9-point door ritual checklist | wire review | a mint, a replay, or a silent wall |
| C-14 → C-18 | copy read-through against the register | copy register | fake pidgin; a why written twice |
| C-19, C-20 | gate-order proof; AI-content provenance check | review board | expansion on a limp; AI-authored voice |

### 11.3 The Production Layer

This whole book is the production layer — its daily shape:

- **The 9-point Definition of Done (Part II)** is the checklist every item lives or dies by.
- **The gate order (§8.1)** is the review's spine: playbook → identity → wire → save → budget → feel → Bible.
- **The scar tests (§8.2)** never regress: double-pay, unsigned bank, duplicate plates, tests-on-prod-books, accept-data-loss boot, shared-rig theft, presence staleness.
- **Onboarding (Part IX)** is the first-day script; the oath is the culture.
- **Facing "how do I build X?"** — answer from the playbook first (P1–P15), then the fifteen load-bearing files (`ERA2-UI-AUDIT.md` §1), then the gates. A silent playbook is a bug in this book: the nearest playbook's spirit governs, and the gap is amended.

### 11.4 The Future Scale Layer

- **Millions of players:** the wire's per-account eyes and idempotent doors already assume strangers at scale; what must change first is the roster fan-out (district-scope it) and the books' backend — the chain-ledger *format* is the portability contract (SQLite today, anything verifiable tomorrow). The relay lane already models degraded honesty.
- **Live content:** flags, calendar, and Forge votes are the only lawful live levers; every live lever passes the same gates — live does not mean ungated.
- **Team scale:** the playbooks and gates are designed for contributors who have never met; the amendment procedure (C-10) keeps four books coherent without a meeting.
- **The soul clause:** at any scale, the four unfalsifiable gates — the Mother Test, the Honest Wire, the caps, the Feel Tests — are never waived. Growth that cannot pass them is not growth; it is drift with momentum.

---

## The books in one breath

**The Constitution** says: the city is real, the player is a resident, nothing lies, nobody dies.
**The Experience Bible** says: here is how every hour *feels* — stranger to elder.
**The World Bible** says: here is the place that earns the feeling — 750 km of truth.
**The Art & Audio Bible** says: here is how the truth looks and sounds — golden hour, warm paper, the city as instrument.
**This book** says: here is how the truth *grows* — wired, voiced, capped, tested, amended together.

Build accordingly.

