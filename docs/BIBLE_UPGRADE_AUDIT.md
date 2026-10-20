# LOKOJA LIFE — BIBLE UPGRADE & REVERIFICATION AUDIT

**Date:** 2026-10-21 · **HEAD at upgrade:** `6b9cb23` (clean tree) · **Mode:** read-only recon → canon amendment (Bibles only; zero source code touched)
**Scope:** `docs/Experience_Bible.md` · `docs/World_Bible.md` · `docs/Art_Audio_Bible.md` · `docs/Content_Bible.md` — upgraded v1.0 → **v2.0** ("design doctrine" → "production-grade living constitutions").
**Method (Sincerity Law):** 3 parallel read-only recon agents (systems/code inventory · world/geography · economy/multiplayer/perf/debts), then the orchestrator personally re-verified every load-bearing figure about to enter canon (geo binary re-decoded from `public/world/geo-v1.bin` itself; runtime counts executed via the repo's own bootstrap; spot-greps for jobs/hustles/plates/meals/festivals/interiors/refusals). No claim was upgraded on imagination. The Constitution was not touched — never rewritten, only built upon.

---

## 1. VERIFICATION SUMMARY

**Total numbered laws checked: 172** (EX-1→EX-43.4 · W-1→W-64 · A-1→A-47 · C-1→C-18) + their sub-clauses and doctrine blocks.

| Verdict | Count | Meaning |
|---|---|---|
| **GREEN — implemented and proven** | **159** | Law verified true on disk (anchors held, or scar correctly historical) |
| **YELLOW — desired but drifted/incomplete** | **13** | Numeric drift, stale scar anchors, or cap-vs-placed confusion — all amended this pass |
| **RED — impossible/conflicting/removed** | **0** | No law was removed. Zero contradictions with the Constitution found |
| **ADDED — new canon** | **7** | EX-44 → EX-47 (Experience), C-19 → C-21 (Content) |

**Amendment families (the 13 YELLOWS):**

| # | Claim (was) | Verified reality (2026-10-21) | Amended in |
|---|---|---|---|
| 1 | 754 km of roads | **750.4 km** (binary re-decode; 752.1 incl. Patti trail) | Experience ×4, World ×3, Content ×1 |
| 2 | 5,900 segments | **5,894** (8,549 points) | World ×3 |
| 3 | 18 underwater segments | **15 channel-crossing / 6 fully submerged** (threshold-dependent; "18" not reproducible) | World ×2 |
| 4 | 14 traffic lights | **12 placed** (14 is the cap) | World ×2, Content ×1 |
| 5 | 12 speed bumps | **6 placed** (12 is the cap) | World ×1, Content ×1 |
| 6 | TTI 2.54 s / wire 389 KB as "posture" | Gates are the law; **2.59 s / 406 KB** is the dated last measurement; re-measure law (C-13) made explicit | Experience, Art |
| 7 | 40 refusal reasons / 11 families | **45 distinct reasons** (re-counted in the wire; the ledger grows) | Experience ×1, Content ×2 |
| 8 | 57 game doors | **58 client-facing doors / 59 handlers incl. disconnect** | Experience, Content |
| 9 | 47 + 58 test suites | **48 unit + 58 e2e** | Content ×1 |
| 10 | 1,191 arbitrary font sizes | **≈1,200** (1,173 exact `text-[Npx]`; 1,191 was a wider regex) | Art ×2 |
| 11 | `ledger.ts:96-107` "client mint" scar anchor | Stale — that range is now the pure `depositVerdict`; the historic mint is dead (server day-cap + rate eyes) | Experience (EX-10) |
| 12 | `useGameStore.ts:4999/:4801` double-pay scars | Fixed-since (one-application book); scar retained as history, law keeps its teeth | Experience (EX-27) |
| 13 | "5 bypass sites (festival/ferry/travel/bank ×2)" | Confirmed 5 production sites **+ 1 dev-only** (`addCash`, production-stripped) — clarified | Experience (EX-20.1) |

**Also verified GREEN (headline):** 63 systems · 26 apps · save v20 + 20-step ladder · 16 Prisma models (migrations baselined) · wire dual rate buckets + 4 KB cap + idemKey UNIQUE + scrypt PIN · M13 walls + N12 clamp · conservation **₦0 drift re-proven on the live books** (319 ledger rows, full chain walk clean: 3,610,200 − 9,500 − 23,594 = Σ WalletRow exactly) · 21 jobs / 20 hustles / 4 boards · 14 named NPCs · 5 Patti secrets idempotent · 108 doors + 5 doorless G2 rooms · 720 trees/10 species (stand counted per species) · 204 drains / 492 lamps · confluence vertex-exact 0.00 u · 72-day year / 10 festivals · 100% procedural art+audio (0 asset files) · NO-PAUSE · backup.sh anchor.

---

## 2. THE TRUTH TABLE (condensed)

| Claim | Bible location | Current reality | Status |
|---|---|---|---|
| 754 km real roads | E-0.1/EX-35/EX-7 · W-0.1/3.1/sheet · C-close | 750.4 km (binary) | AMENDED |
| Confluence 0.00 u | W-1.1 | Identical vertex (−3, 172.3) | GREEN |
| 1 u = 26 m | W-0.4 | `geo.ts:8` | GREEN |
| 12 NPC strollers, night 4 | W-7.1, EX-3.3 | `NPC_COUNT = 12` | GREEN |
| 14 traffic rigs on loops 0–2 | W-3.1 | `TRAFFIC_MIX` | GREEN |
| 14 lights / 12 bumps | W-sheet, C-§6 | 12 / 6 placed (caps 14 / 12) | AMENDED |
| 720 trees · 10 species | W-5.1 | floraStats exact | GREEN |
| Kpata 0 stalls / 2 total | W-D2, EX-16 | Filter `layout.ts:1660` — still live | GREEN (named debt) |
| 108 doors / 98 school | E-EX-14, W-7.3, C-P2 | 10 interiors + 98 school doors (+5 doorless G2 rooms, now documented) | GREEN + documented |
| Unsigned bank rows | E-EX-20 | `useGameStore.ts:2205/:2258` still unsigned | GREEN (debt) |
| "5 bypass sites" | E-EX-20.1 | 5 production + 1 dev-only | AMENDED |
| Trade double-pay scar | E-EX-27 | Fixed (one-application book); offerer-side window remains (see risks) | AMENDED |
| Fortress chain lie | E-EX-20 | Orientation fixed (`.reverse()`); NEW: false-tamper-alarm after unsigned rows (named below) | GREEN + new debt |
| 40 refusal reasons | E-EX-43, C-8/C-11 | 45 | AMENDED |
| Shared-rig theft | E-EX-31.2 | `RemoteVehicles.tsx:114→179/221` still live | GREEN (debt) |
| Presence `street` staleness | E-EX-31.1 | `wire.ts:645-648` still entry/join-only | GREEN (debt) |
| Fuel read client coords | — (old audit) | **FALSE now** — server judges on its own clamped pos (`index.ts:1460-1464`) | Already fixed; Bibles never claimed it |
| Save v20 / ladder | C-§5 | `save.ts:45`, 20 steps, migrations baselined | GREEN |
| ₦0 conservation | E-EX-27 | Re-proven live this pass | GREEN |
| 48+58 tests | C-§8.2 | 48 `test-*.ts` + 58 `e2e-*.ts` | AMENDED |
| SILK gates | E-EX-2.4, A-5, C-§6 | G1–G6 in code; last measured 2.59/406; prod build absent on disk (re-measure owed) | AMENDED |

---

## 3. BREAKING CHANGES (contributors must know)

1. **Count canon changed:** quote **750.4 km · 5,894 segments · 12/6 placed lights/bumps (caps 14/12) · 45 refusal reasons · 58 client-facing doors · 48+58 suites · 16 Prisma models**. The old figures are audit history, not current law.
2. **Cap ≠ placed discipline:** the caps registry (Content §6) now states both. A PR that reads a cap and claims it as placed count fails review.
3. **SILK numbers carry a re-measure law:** never cite a measurement without its date; the gates (`scripts/silk-gates.ts` G1–G6) are the law, the numbers are weather. A prod-build re-measurement is owed (the last one is no longer on disk).
4. **Stale scar anchors are retired:** `ledger.ts:96-107` and `useGameStore.ts:4999/:4801` are history, not current defects — do not re-open them; do regress-test them (scar tests, C-§8.2).
5. **ERA2-UI-AUDIT.md is now an archive:** a correction banner points here; do not quote its §1 architecture figures without this document.
6. **The Feel-Tests reference format changed:** "the Exit Test (Experience §44)" replaces "EX-44", because **EX-44 is now a law** (City Memory). Any doc or comment citing EX-44+ as a test must be updated.

---

## 4. NEW CANON

**The seven Foundation Laws** (reviewed per the ERA II directive; each with statement, why, and failure condition inside its Bible):

| Law | Home | One line |
|---|---|---|
| **EX-44 City Memory** | Experience Part X | The city remembers meaningful player actions (familiarity today; event-memory horizon) |
| **EX-45 Human Scale** | Experience Part X | Small moments matter more than empty size |
| **EX-46 Consequence** | Experience Part X | Actions alter future states; no silent resets |
| **EX-47 Truth Over Spectacle** | Experience Part X | Never fake depth; honest small or nothing |
| **C-19 Performance Before Expansion** | Content §1.1 | Never expand the world before the current world breathes |
| **C-20 AI Citizen** | Content §1.1 | AI enhances humanity, never replaces it (weather, not cast) |
| **C-21 Cultural Respect** | Content §1.1 | Lokoja is represented, never exploited |

**The four living-constitution layers** added to every Bible:
- **Implementation Reality** — what exists today / what is planned / what is forbidden (Experience §47, World §10.1, Art §10.1, Content §11.1).
- **Verification Layer** — every major law: method + responsible system + failure condition (Experience §48, World §10.2, Art §10.2, Content §11.2).
- **Production Layer** — "how do I build this without breaking Lokoja" recipes (Experience §49, World §10.3, Art §10.3, Content §11.3).
- **Future Scale Layer** — millions of players, more districts, AI citizens, economic expansion, live content, each with a soul clause (Experience §50, World §10.4, Art §10.4, Content §11.4).

**New named debts entering the record this pass** (verified, previously unrecorded in the Bibles):
- **The fortress wolf alarm** — unsigned rows (bank/festival/ferry/travel) written after signed rows make `verifyChain` report the whole chain broken: a false tamper alarm after ordinary play. Cure = sign the paths (EX-20.1), never mute the alarm (EX-20 mistake #4).
- **Withdraw-cap lane asymmetry** — wire `wallet:withdraw` passes `transferredToday: 0` while the relay counts it; cannot mint (drains purse only) but is cap drift between lanes.
- **Trade offerer double-apply window** — the one-application book guards only the receiver; `appliedTrades` is in-memory; a crash between application and cursor-save can double-pay the offerer.
- **Prod DB committed to git** — `db/custom.db` (with account tokens + PIN hashes) rides every commit/bundle/mirror.
- **Stale code header** — `layout.ts:7` still claims "3,000+ ways, ~930 km" (fossil comment, now named in World §3.1).
- **Five built-but-doorless G2 rooms** — palace hall, stadium office, Sokamms room, Adankolo reading room, Emiwoziri fish shed (now documented in World §7.3 as the next rooms, not decoration).
- **Render-width honesty** — road ribbons render widened (minor ≈ 2.6 u) and Patti compresses ~450 m into a 30 u mound; plan geometry stays 1:1 (now stated in World §0.4).

---

## 5. REMAINING RISKS (ranked)

**Engineering (P0-class, pre-existing and still open):**
1. **Shared-rig multi-mount** (`RemoteVehicles.tsx:114→179/221`) — any two same-model:paint cars/ghosts mount one `THREE.Group`; with the tiny paint vocabulary it fires routinely. The multiplayer trust wound.
2. **5 unsigned pocket-cash bypasses + the wolf alarm** (`useGameStore.ts:2205/2258/2341/2730/3652`) — they skip guards and poison the chain verdict after ordinary play.
3. **Mid-drive wire drop never re-hellos** — a dropped driver's car vanishes from every street; `vehicle:pos` refusals land on a fire-and-forget lane.
4. **Prod DB in git** — full books + tokens + PIN hashes in every bundle; one repo share = full leak.
5. **Kpata stall wipe** (`layout.ts:1660`) — the commercial heart renders 2 stalls (both Ganaja); fix + count assertion owed.

**Design/documentation:**
6. **SILK re-measure owed** — the 2.59 s / 406 KB posture is a dated one-time measurement; no prod build currently on disk. Gate 0 adjacent.
7. **Presence `street` staleness** — co-presence misjudges while walking (`wire.ts:645-648`).
8. **Unlit signal heads** — hardware exists, behavior unrendered (`CityMesh.tsx:1358`); W-34 promises the picture catches up to the simulation.
9. **Sync scrypt** on hot doors blocks the event loop; async scrypt still on the open list.
10. **Battery runner lacks exit codes/CI wiring** — the 106 suites are green by hand, not enforced.
11. **Road fabric** — 72% dead-end way-ends, 15 channel-crossing segments, clip holes, no end caps (World §3.5's ledger, in order).
12. **O(n²) roster fan-out** (`index.ts:700-707`) — must go district-scoped before nation scale (named in the Future Scale layers).

**Documentation ecosystem:**
13. **The Design Constitution is chat-canon, not a file** — all four Bibles declare subordination to it, but no `docs/Design_Constitution.md` exists. Recommended in a future pass (a *persist* operation, not a rewrite). Until then, the worklog's law list (The City Never Blinks · Lokoja Knows Your Name · Earned Convenience · Money With A Body · The Honest Wire · Soft Failure · The Color Line · Under The Neem Tree · Sleep Is Saving · The Verdict Voice · NO-PAUSE · Whisper HUD · Confluence Test) is the only persisted trace.

---

## 6. QUALITY GATES (the four tests)

| Test | Verdict | Evidence |
|---|---|---|
| **The Mother Test** — respectful & understandable to someone from Lokoja | **PASS** | Real ward names untouched (W-28); Cultural Respect now explicit (C-21); all cultural chapters carry the Mother Test with veto power; no invented geography was introduced by this pass |
| **The Stranger Test** — understandable to someone unfamiliar with Lokoja | **PASS** | Every Bible opens with doctrine (Part 0); the quick sheet + Implementation Reality give a newcomer the city in one table; onboarding order intact (Content Part IX) |
| **The Developer Test** — could a new engineer build correctly from these? | **PASS (stronger than before)** | v2.0 adds Verification + Production layers: every major law now has a method, a responsible system, and a failure condition; the load-bearing-files and shared-systems-zero-drift doctrine are standing answers, not folklore |
| **The Ten-Year Test** — do these laws still protect Lokoja in ten years? | **PASS (conditional)** | The Future Scale layers pre-commit the scaling rules (roster scoping, chain-format portability, AI-as-weather, soul clauses). The condition: the Constitution must be persisted to disk so the authority chain survives beyond chat history (Risk #13) |

---

## 7. RECOMMENDED NEXT ENGINEERING MILESTONE

**Complete Gate 0 (trust debts) — unchanged in substance, now Bible-enforced by C-19:**

1. Signed bank/festival/ferry/travel paths → the wolf alarm dies with the SECURE lie (EX-20.1's ceremony).
2. RemoteVehicles rig-per-view + tagCache LRU (EX-31.2's precondition for co-presence features).
3. Kpata stall resurrection with `STALLS.length >= 20` / `kpata >= 8` count assertions (W-9/EX-16.1).
4. Presence street refresh on district change (EX-31.1).
5. Boot diet: delete `layout.TREES`/`GRASS` dead compute (World §5.1's named debt).
6. **Then:** a prod-build SILK re-measurement (G1–G6) to re-date the posture — the first act under the new "re-measured, never assumed" law.

Every item: fail-test → fix → green → commit (the Phase-1 protocol). No new gameplay systems before the list is green — now codified as **Law C-19**.

---

*Audit artifacts: 3 recon reports (systems · world · economy/multiplayer/perf) + orchestrator spot-verification; working notes in the session transcript and worklog. Zero source files modified — this pass amended canon only.*
