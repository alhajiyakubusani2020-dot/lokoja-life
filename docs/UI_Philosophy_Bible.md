# LOKOJA LIFE — UI PHILOSOPHY BIBLE
### The named interface-doctrine reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES and extends: `docs/Experience_Bible.md` v2.2 Part 0
> (interaction philosophy — canon, unmodified), `docs/Art_Audio_Bible.md` §7 (Paper UI law — canon,
> unmodified), `docs/ERA2-UI-AUDIT.md` (the audit of record — preserved as-is), and the M24 diegetic
> law vault (`src/game/systems/diegetic.ts` — the built law). Evidence also: m24-ui/m24-diegetic
> commits (all battery-proven). Extensions are marked **[EXT]**.
>
> **The directive's law this book implements:** *the player should never feel like they are
> navigating menus; they should feel like they are living inside Lokoja. Menus disappear. The city
> becomes the interface.*

---

## PART I — THE DOCTRINE (the five diegetic laws, as built)

The diegetic vault (`diegetic.ts`) is pure, headless-testable, and binding — the Dashboard runs the
SAME verdict, no copies:

1. **THE NEVER-BLINK LAW:** once a walker ENTERS the world, the world stays mounted until they
   return to the Main menu. Every other tab (home/map/work/phone/bag/profile) opens as an OVERLAY
   SHEET above the living street. The street never blinks for chrome.
2. **THE ONE-UNMOUNT LAW:** the only lawful unmount of the living world is the `menu` intent
   (auto-saves). Not a tab switch, not a deep-link, not an overlay close.
3. **THE N11 GATE:** an open overlay may cost at most **+3 ms per frame**, measured on real rAF
   deltas by the witness.
4. **THE NO-PAUSE LAW:** an overlay NEVER pauses the street — the clock advances, needs decay, the
   wire keeps talking. There is no pause API in the vault; structurally impossible.
5. **THE IDENTITY-BLIND LAW:** the overlay law is for EVERY walker — claimed or guest, kid or
   senator. The walls that ask who you are live at the doors (M13/M17 vaults), never in the overlay.

## PART II — THE CITY BECOMES THE INTERFACE (the mapping law)

| Need | NOT a menu | IS the world (built or ruled) |
|---|---|---|
| Phone | app launcher in the sky | **the physical phone**: WorldPhoneLayer rail + FAB above the living street; 26 apps on one grid (7 wire-backed / 12 store-backed / 7 read-only) |
| Bank | a banking screen | **the bank building**: walk in — teller → real BankPanel inside a bank interior (ERA2 §4 wired list) |
| Garage | a vehicle shop dialog | **the garage**: buy/sell/paint/plate at the GaragePanel in-world; rig materialises parked near you |
| Market | a shop inventory | **the market**: stall sheets at shops; the food strip; kerb spill |
| Hospital | a health menu | **FTH/civic desks**: KGIRS/NEPA/police/EFCC desks → CivicPanel at the building |
| Police | a security tab | **the police station**: civic desk inside the building (same wired path) |
| School | an education menu | **88 school doors + interiors** (20 builders); the school clock app reads the world's clock |
| Friends | a friends list | **real people existing in the city**: same-street walkers render as rigs; Connect app mirrors the wire graph |
| Map | a pause-map | **the living city itself**; the 2D map sheet opens ABOVE the living street (m24-diegetic evidence) |
| Travel | a fast-travel dialog | **the travel board / park / jetty** with real fares, guards in order (level→flood→river-cut→guest→fare→energy) |
| Settings | an options screen | the phone's Settings app — a phone app, not a HUD menu |

Law: every new system MUST answer "which world object is its interface?" before a screen may be
drawn. A feature with no world-object home is a design smell — escalate to the Content_Bible red
lines before building UI.

## PART III — THE PAPER UI & TRUTH LAWS (canon carried)

1. **Paper UI is the only UI language** (Art_Audio §7.1): world states surface in UI as CONTENT, not
   reskins — weather tags, prayer-window chips, market-day badges, flood/canoe banners on the paper
   system.
2. **The interface never lies about the world** (Constitution truth law): the phone's ambience/power
   indicator must reflect the night-law trim and grid state; the landing ribbon renders the REAL
   wire answer (m24-ui evidence); security badge = the Dashboard chain chip gated by `verifyChain`
   (v2.2 correction).
3. **Law A-1 — Readable before beautiful:** the 360 px phone in afternoon sun is the reference
   device; legibility wins every time (Art_Audio:28).
4. **Law A-3 — The senses agree:** what the eye says the ear must confirm — UI included (Art_Audio:30).

## PART IV — THE ONE-WORLD, NO-EXITS ARCHITECTURE [EXT — from ERA2 audit]

The six-pillar architecture (ERA2 audit): one SPA route; the world as a tab that never unmounts; the
phone as an overlay of the world; the dashboard as an overlay of the phone's absence; the wire
beneath everything; SILK perf gates as the frame around all of it. ≈140 inventoried interfaces
resolve into: 26 phone apps (7 wire-backed / 12 store-backed / 7 read-only books) + the HUD +
the dashboard tabs. Known UI debts remain honestly listed in ERA2 §3 (Location-detail duplication,
HudOverlay god component, three parallel money UIs, travel-row triplication…) — consolidation work
is W-banded in `Master_Implementation_Roadmap.md`, never silent refactors.

## PART V — DEBT-DISCIPLINE LAWS [EXT]

1. No new duplicated surface: before adding UI, check the ERA2 §3 duplication list — the fix is
   consolidation, not a fourth money UI.
2. Era copy must be data-driven (APP_VERSION, app-count chips read the manifest — the "26 vs 10"
   drift lesson).
3. Module-global UI state (phoneDeepLink, recents, wireBuffer) migrates into stores when touched —
   the StrictMode defense lesson (ERA2 §3.6).
4. Every overlay ships with its N11 measurement; every new phone app ships with its tier-wall
   re-application (Content_Expansion II.3).

## PART VI — GATES

1. Enter world → open every tab in sequence → street visible behind every sheet, never unmounted
   (witness); the only unmount returns to Main menu (diegetic suite).
2. Open the phone mid-drive: input frozen behind the overlay (freeze law), street still animating
   (no-pause), frame cost ≤ +3 ms (N11 witness).
3. UI state flip test: toggle grid state / night trim — every world-truth chip updates (Part III.2).
4. 360 px × afternoon-sun readability pass on any new surface (A-1 explicit test).
5. Zero new world-truth lies: grep-able rule — no chip states what a probe contradicts.
