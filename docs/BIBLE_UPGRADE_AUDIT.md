# LOKOJA LIFE — INDEPENDENT CANON REVERIFICATION AUDIT (NO TRUST MODE)

**Date:** 2026-10-21 · **HEAD at reverification:** `411f119` (four Bibles at v2.1 + this file's v2.1 predecessor) · **Mode:** read-only recon → canon amendment (4 Bibles → v2.2, ERA2 banner addendum, this document; zero source code touched)
**Scope:** `Experience_Bible.md` · `World_Bible.md` · `Art_Audio_Bible.md` · `Content_Bible.md` → **v2.2**, plus the ERA2-UI-AUDIT correction strip. Supersedes the v2.1 audit (recoverable at git `411f119~1`); the retired-claims discipline carries forward.
**Trigger:** the INDEPENDENT CANON REVERIFICATION directive — *every Bible, every previous audit, every worklog, every prior commit message treated as potentially wrong; only the repository is canon; nothing survives without reproducible evidence; if evidence cannot be produced the claim is marked UNKNOWN or leaves canon.*

---

## 1. METHODOLOGY (what was actually done, in order)

1. **Recon before reading.** Per the anti-bias order, four parallel read-only recon agents rebuilt the project from source only — World/Geography, Economy/Gameplay, UI/Audio/Performance, Architecture/Assets/Infra — with file:line evidence for every figure. **No Bible was opened until the recon was complete.**
2. **Full-document read.** All four Bibles + `ERA2-UI-AUDIT.md` + the prior `BIBLE_UPGRADE_AUDIT.md` read end-to-end (3050 lines total), every number and anchor extracted into a verification matrix (~120 claims).
3. **Independent re-derivation.** Three new re-runnable scripts were written and executed against the live repo (persisted, unlike some prior-pass evidence):
   - `scripts/rv-geo-census.ts` — raw binary decode + runtime bootstrap census (geo gate first, then layout/junctions/schools/interiors/flora/vehicles/data registries).
   - `scripts/rv-data-census.ts` — config constants, anchor greps, UI census, wire census, suite counts.
   - `scripts/rv-spot-checks.ts` — dead-end tolerance variants, festival/teleport/POI registries, app-key enumeration, orphan-asset importer census, **the live-books walk**, Prisma model count.
4. **The live books walked.** `db/custom.db` opened readonly via `bun:sqlite`; every LedgerRow kind summed; reconciled against Σ WalletRow.
5. **The wire re-counted.** `mini-services/nation-wire/index.ts` (2,395 lines): every `socket.on` enumerated, every `why:` code extracted with a strict literal pattern, wall sites counted.
6. **Method forensics on every claim that failed.** Where a reproduced value differed from canon (dead-end %, crossings, migration steps), the *method* was investigated before any edit — three independent dead-end variants were computed; the crossing test was re-run using the binary's own bridge flag after the first method proved naive.
7. **Only then were the Bibles edited** — every amendment carries the anchor that proves it.

## 2. EVIDENCE INVENTORY (all re-runnable)

| Script | Produces |
|---|---|
| `scripts/rv-geo-census.ts` | ways/segs/points/km · rivers/bridges/loops · confluence vertex · named ways · dead-end variants · bridge-flag crossings · runtime census (districts, buildings, stalls-by-anchor, trees-by-species, grass, rocks, doors, interiors, lights, bumps, lamps, clusters, parked) · data registries (jobs, hustles, meals, foods, NPCs, vehicles, weather, loc-actions) |
| `scripts/rv-data-census.ts` | config constants (freeMeters, autosave, FORTRESS, GAME_META, xp) · line counts · ACES/dpr/far/frameHz · phase law · caps (drains/plates) · patti · music/ambience · SAVE_VERSION + migration cases · teleport · file-existence ledger · text-[Npx] · lko tokens · ghost classes · shadcn count · app grid · e2e/unit counts |
| `scripts/rv-spot-checks.ts` | dead-end tolerance curves · cash/yearDays/xp anchors · festival names · job-board POIs · teleport roster/categories · systems file count · BAY_SPECS/PARKED · silk gates G1–G6 · OPTIMIZATION-PLAN baseline · app keys · public/art inventory + importer census · SW_VERSION · **DB walk** · Prisma models · API route count |

Prior-pass evidence (`scripts/audit-p3-*.ts|sh`, `scripts/geo/bootstrap.ts`) remains on disk and was used to understand *methods*, never as a source of numbers.

## 3. VERIFICATION SUMMARY

**Claims re-verified this pass: ~120 load-bearing figures/anchors across the four Bibles, the ERA2 audit, and the prior audit.**

| Verdict | Count | Meaning |
|---|---|---|
| **HELD — reproduced exactly** | **~104** | Re-derived independently; value and anchor both held. All headline geo, economy, wire, UI, audio, save, and suite figures held. |
| **AMENDED — drifted, mis-anchored, or method-dependent** | **6** | Corrected in the Bibles this pass (table §5). |
| **REJECTED — claim left canon** | **0 new** | The v2.1 pass already falsified the one unqualified claim ("zero asset files"); its rescope was re-verified and holds. |
| **UNRESOLVED — marked UNKNOWN** | **6** | Listed §7 with the exact reason evidence could not be produced. |
| **LAWS ADDED / REMOVED** | **0 / 0** | Nothing observed earned permanence the books lack; no law was contradicted by disk. Canon stays additive-and-corrective. |

## 4. THE HELD CLAIMS (headline, each re-proven this pass)

- **Geo binary** (decoded from `public/world/geo-v1.bin` bytes, 60,071 B): **2,655 ways / 5,894 segments / 8,549 points / 750.4 km** (28,863.0 u × 26 m) · 16 rivers (333 segments, 72.0 km) · 16 bridges · 5 loops · **29 named ways across 19 distinct OSM names** · **confluence vertex-exact 0.00 u** (`niger` and `benu` share vertex (−3, 172.3)) · **23 unbridged centerline crossings + 3 segments within a river's half-width at midpoint** — reproduced with the binary's own bridge flag (the correct method; my first naive distance-to-bridge method gave 27/396 and was discarded as a method artifact).
- **Runtime world**: 2,656 rendered ribbons / 5,900 segs / 752.2 km (incl. the Patti trail) · 32 anchors (10 launch + 10 G2 + 12 schools) · 61 generic buildings · **STALLS = 2, both nearest `ganaja-junction`** (kpata 0, food-area 0 — `roadGap(x,z) < 0.45` at `layout.ts:1660` exactly) · legacy `TREES` 700 + `GRASS` 7,500 (≤72 flower dots, `WorldTerrain.tsx:956`) + `ROCKS` 110 · `NPC_ZONES` = **13** · flora **720 trees with the exact species split** (neem 181 · mango 227 · cashew 94 · shea 92 · acacia 54 · plantain 45 · raffia 16 · oilpalm 6 · iroko 3 · baobab 2) · 10,000 flora tufts · lights 12 placed / cap 14 · bumps 6 / cap 12 · phases 12/3/15 · danfo stops 3 · junction clusters 39 · **lamps 492** (cap 1,500 at `layout.ts:1630`) · drains cap 1,800 · plates cap 40 · **PARKED_VEHICLES = 7** (`vehicles.ts:940`; 12 BAY_SPECS are the input, the shoulder-clearance filter decides) · **ALL_DOORS = 98 (10 layout + 88 school)** · `SCHOOL_INTERIORS` 88 · `INTERIORS` array 98 · `INTERIOR_BY_ID` 103 (5 doorless G2 rooms) · **20 school interior builders** (`classroomInterior` … `demoInterior`, counted by name) · **birds: 3 flocks / 18 birds (confluence 7, Patti 6, market 5), day-only** (`Actors.tsx:1111-1130`).
- **Data registries**: 21 jobs · 20 hustles · 8 meals · 10 display-only foods · 14 named NPCs · 4 vehicle models · **4 job-board POIs** (`POINTS_OF_INTEREST`) · **10 attendable festivals** (my first regex count said 8 — the miss was a curly apostrophe in "Workers' Day"; the register is 10) · yearDays 72 (`config.ts:658`) · weather weights {sunny 55, cloudy 25, rain 14, harmattan 3.5, storm 1.8, flood 0.7} · 107 location-action rows over 32 keys · ₦5,000 day 1 (`config.ts:14`) · xp 120·L^1.4, cap 50 · FORTRESS {1.5M, 3M, 24} · autosave 1,200 ms · freeMeters 150 (`config.ts:349`) · teleport roster 10 (append-only) + 8 categories · Patti 5 secrets, radius 9, ~2 Hz poll (`patti.ts:7/:138`).
- **Interaction constants** (registry-spread, not one table): anchor 8.6 (`controls.ts` interactRadius) · POI 5.3 (= 8.6 × 0.62, `Actors.tsx:275`) · door 3.2 (`config.ts:101`) · hotspot 2.1 (`config.ts:73`) · talk 4.0 (`Actors.tsx:376`) · gist 24 (`config.ts:353`) · car 4.6 (`DriveSystem.tsx:51`) · pump/garage **26 = `SERVICE_RADIUS` (`wheels.ts:489`)** · shop 28 (`HudOverlay.tsx:273`) · secret 9.
- **Rendering/perf**: ACESFilmicToneMapping + exposure 1.12 · dpr caps 1.75/1.4/1.05 · far 900/820/720 · frameHz 0/0/30 · NPC_COUNT 12 → night 4 (`Actors.tsx:629`) · rain COUNT 620 (`Actors.tsx:1032`) · hair palette `#1A1714…#B79545` present.
- **Audio**: 8 ambience layers at 320/850/480/1,400/140/4,400/520/3,200 Hz · music bpm {108, 100, 92, 78} · C-pentatonic 261.63 · maxVoices 8 · zero audio files in `public/`.
- **The books** (`db/custom.db`, readonly): 18 tables (16 app + `_prisma_migrations` + `sqlite_sequence`) · **319 LedgerRows** — deposits 148 = ₦3,610,200 · withdraws 19 = ₦9,500 · refuel 11 = ₦22,000 · repair 5 = ₦1,594 · tips 30 = ₦11,100 · transfers 106 = ₦3,414,400 · **125 WalletRows, Σ = ₦3,577,106 = deposits − withdraws − refuel − repair, drift ₦0, reproduced to the naira**.
- **The wire** (`mini-services/nation-wire/index.ts`): **59 `socket.on` handlers = 58 client-facing doors + `disconnect`** · **45 distinct refusal why-codes** (strict literal pattern; a looser pattern yields 46 by matching a non-literal — the strict count is the count) · minor walls 5 `minors-no-money` + 3 `minors-no-voice` + 2 `minors-collect-nothing` + 1 `kid-text-refused` = **11** · RESUME_CAP 100 (`index.ts:151`) · maxHttpBufferSize 4_096 · port 3003.
- **Chain mechanics**: signed doors attach `sig` (`useGameStore.ts:3719/:3756/:3793` via `chainNext`); the 5 bypass sites push **unsigned** rows (`:2205` bankDeposit · `:2258` bankWithdraw · `:2341` festival spray · `:2730` canoe ferry · `:3626-38` travel events; `recordTransaction` at `economy.ts:27-42` builds rows with no `sig`). The wolf alarm is real and live.
- **UI**: **26 app keys enumerated** (chats…patti) · **1,178 exact `text-[Npx]`** · **18 `--lko-*` tokens** · `lko-glass`/`lko-label` defined in no stylesheet · 48 shadcn `ui/` files at audit time (2 remain — dialog + switch — after the Phase-2.5 dead-UI purge) · APP_VERSION `'Lokoja Life • Stage 5'` vs GAME_META `version 0.3.0 / 'Stage 3 — Economy, Work & Opportunities'` · menu chip `'26 phone apps'` hardcoded · `SW_VERSION 'm16.1'` · fonts Geist + Outfit only.
- **Suites**: 48 `scripts/test-*` unit scripts + 58 `scripts/e2e-*` scripts · silk-gates G1 TTI<3s / G2 wire<900KB / G3 click<100ms / G4 heap<300MB / G5 cache<30MB / G6 matrix (`scripts/silk-gates.ts`).
- **Save**: SAVE_VERSION 20 · **19 real migration steps** (`case 1…19` mutate; `case 20` is the current-version no-op at `save.ts:310`) · flags.ts / guest.ts / social.ts (TIERS stranger→acquaintance→paddy→…) / story.ts (`STORY_BEATS` at `:371`) / needs.ts all exist · LocationArt.tsx had **0 importers** (deleted, Phase-2.5).
- **Assets**: `public/` = 12 files — 1 `art/*.webp` (menu-hero, 1 consumer; the 10 `loc-*` + 3 `ad-*` orphans deleted, Phase-2.5) + 5 PWA PNGs + logo.svg + manifest.json + sw.js + offline.html + robots.txt + `world/geo-v1.bin`. Zero audio/video/model files.
- **Infra**: 13 API handlers (12 `route.ts` + 1 `route.tsx` OG) · 16 Prisma models · `.env` = DATABASE_URL only · Caddy `?XTransformPort` split · `output: "standalone"` · `next.config.ts` `/rt`→LiveKit rewrite present with zero `/rt` references in src (dormant).

## 5. THE 6 AMENDMENTS

| # | Was (v2.1 canon) | Now (v2.2, disk-proven) | Where |
|---|---|---|---|
| 1 | "72% of way-endpoints dead-end" (ERA2 `[computed]`, never script-persisted) | **65.3%** — degree-≤1 test on the decoded binary (3,465 of 5,310 endpoints). The metric is tolerance-sensitive: 79.6% at 1 u endpoint-proximity, 49.2% at 2 u, 21.2% at 3 u; 84.3% of *ways* have ≥1 dead end. The old "72%" is retired as an unpersisted method. | World W-32, §3.5 row 3 · Experience EX-35.3 · ERA2 banner |
| 2 | "20-step migration ladder" (Experience §47, Content Part V) | **19 real steps** — `case 1…19` migrate v1→v20; `case 20` (`save.ts:310`) is the current-version no-op. "20-step" counted the no-op. | Experience EX-header note + §47 · Content Part V |
| 3 | "the Profile screen claims Fortress SECURE" (EX-20, EX-34, ERA2 §2) | The security badge is the **Dashboard chain chip** (`Dashboard.tsx:621`), gated by `verifyChain(...)` — it shows 🔒 SECURE only when the chain verifies and ⚠️ CHAIN otherwise. The live symptom is the **wolf alarm** (unsigned bank/festival/ferry/travel rows flip it), not a false badge. Profile carries no security copy (grep-verified). | Experience EX-20 purpose + mistake #1, EX-34 · ERA2 banner |
| 4 | A-5 "Last measured 2.59 s / 406 KB / heap 27 MB / warm click 4 ms (2026-10-20)" — one sentence, two different runs | Provenance split: **m24-fuel-era fresh prod run — 2.59 s / 406 KB / click 15 ms / heap 56 MB / SW 2.4 MB** (worklog-anchored; build since deleted); **m19 run — 2.54 s / 389 KB / heap 27 MB / click 4 ms / SW 3.1 MB**. No prod build exists on disk now (`.next/` holds only dev/) — the next gate run re-derives all six. | Art A-5 · Experience EX-2.4 |
| 5 | Clock anchors: "`advanceClock` (world.ts:39-51)", "night is always night-clear (world.ts:31-34 / :33-34)" | The function is **`advanceWorldClock`** (`world.ts:42-58`; `nextSlot` :13-17, `absoluteSlot` :65-67) — no `advanceClock` symbol exists anywhere in src. Night forcing is **`weatherForSlot`** (`world.ts:32-38`). | World §6.1 + W-46 + verification table · Experience EX-6, EX-21, EX-30 |
| 6 | EX-35 "20 launch places + 10 G2 wards" | **10 launch places + 10 G2 wards** (32 anchors once the 12 school sites are counted). "20" was an arithmetic slip. | Experience EX-35 |

## 6. REJECTED / RETIRED (do not quote these again)

1. "72% dead-end way-ends" — replaced by 65.3% (degree-≤1) with the tolerance curve stated.
2. "20-step migration ladder" — 19 real steps + the no-op arm.
3. "Profile shows/claims Fortress SECURE" — Dashboard chain chip, `verifyChain`-gated.
4. One measurement run wearing another's numbers (A-5) — runs now cited separately.
5. `advanceClock` as a symbol name — it does not exist; `advanceWorldClock` does.
6. "20 launch places" — 10.
7. (Carried from v2.1, re-verified still retired): "108 doors", "98 school doors", "15/6/18 underwater", "12 parked cars", "13 M13 walls", "17 interior builders", "only 19 named ways", unqualified "zero asset files", "plateau 30.03 u".

## 7. UNRESOLVED (marked UNKNOWN, with the reason)

1. **Wire runtime state**: `nation-wire` is **not running in this sandbox** (nothing listens on :3003). The 2,395-line server is real, imports game laws verbatim, and writes the real DB — but "multiplayer works" is currently *code-true, runtime-unproven here*. `wire-status` will honestly report `{live:false, online:0}`; the 12 s relay lane is the functional fallback. Remains UNKNOWN until a wire process is booted and a two-client walk is run.
2. **SILK G1–G6 current values**: no prod build on disk (`.next/` holds only dev/) — the last recorded run (2.59 s / 406 KB, worklog line 1585) is historical. Requires a fresh `next build` + gate run. All six gate *thresholds* are disk-verified.
3. **ERA2's "≈140 distinct user-facing interfaces" and "≈152 store actions"** — historical census estimates from the archived audit; not re-derived this pass (not load-bearing in canon; marked as audit-of-record estimates, not engine truth).
4. **`ui/icons.tsx` `IconName` union exact size** — pattern-dependent (39–44 by regex); non-load-bearing. The other icon count (73 exported glyphs in `icons.tsx`) held exactly.
5. **DB row counts beyond the ledger/wallet census** (Account/LiveEvent/etc.) — not needed for any Bible claim; left unread rather than half-read.
6. **Dev-log CSS 500** (`dev.log`: GET / 500, compile error at `globals.css:2676` in an older run) — the log predates the current 430-line globals.css; treated as a stale dev artifact, not current truth. Not resolvable without a dev-server boot, which this read-only pass did not perform.

## 8. NEWLY DISCOVERED DEBT (entered this pass)

1. **Dead economy config block** — `ECONOMY.rent` (7-day cycle, basic-room/apartment/house ₦2.5k/15k/45k), `ECONOMY.shopMargin`, `ECONOMY.business` (`config.ts:166-185`) have **zero consumers**; only `ECONOMY.transport` is read (travel/garage/fleet/rivers). The live rent law is `LADDER.housing` (`config.ts:1063+`). Two rent laws in one config, one dead — the same pattern the Bibles call "two homes for one truth" (C-4). Deletion is the cure.
2. **`jobs.ts:4` header fossil** — "Ten launch jobs" above a 21-entry register (10 launch + 8 school + 3 M12 careers). The Bibles say 21 (correct); the code header lies.
3. **`layout.ts:720-721` comment fossil** — "ALL 22 anchors … ALL 12 school sites" describing code that now walks 32 anchors.
4. **Era-copy drift is three-headed**: GAME_META `'Stage 3 — Economy, Work & Opportunities'` / APP_VERSION `'Lokoja Life • Stage 5'` / Bag tab `'Stage 4'` — three era strings, one game (Experience EX-2 mistake #3 already names the pattern; the census now shows three simultaneous values).
5. **`foods.ts` confirmed prototype** — 10 display-only items; the only consumer is the Bag "ComingSoon" teaser + health-app top-3 readout; `FOOD_BY_ID` has no external consumers.
6. **Achievements stub** — `player.achievements` receives exactly one value ever (`'japa'`); no redemption surface.
7. (Carried, re-confirmed live): the 5 unsigned bypass sites + wolf alarm · shared-rig `RemoteVehicles.tsx:114/:179/:221` · stall wipe (`layout.ts:1660`) · presence street staleness (`wire.ts:645-648`) · unlit signal heads (`CityMesh.tsx:1358`) · loops 3/4 table-only · civic fence walk-through · `layout.TREES`/`GRASS` dead compute · 13 orphan `.webp` · `manifest.ts` 10-vs-26 register drift · stale `layout.ts:7` header ("3,000+ ways, ~930 km") · dormant `/rt`→LiveKit rewrite · `tailwind.config.ts` staleness · ghost classes.

## 9. CONTRADICTION HUNT (repo-wide)

Resolved or documented this pass:
- **Method-dependency made explicit**: dead-end % and (historically) underwater crossings are threshold-sensitive; canon now states the method with every figure.
- **Counting-convention traps documented**: "58 doors / 59 handlers" (disconnect), "45 codes" (strict pattern), "19 steps" (no-op arm), "10 festivals" (curly apostrophe broke a naive count), "7 parked / 12 specs" (filter input vs live output).
- **Archive vs canon**: ERA2 §1 still says "14 Prisma models" and "57 doors" in its body — its correction banner now covers both (the banner is the archive's truth-lens; the archive text stays as written by policy).
- **Cross-Bible coherence**: the four books' shared figures (750.4 km, 98/103 doors, 720 trees, 26 apps, 45 codes, 319 rows, ₦0 drift, 19 steps) now all agree with each other and with disk.

## 10. IMPLEMENTATION REALITY REGISTER (Phase-4 labels, current)

| System | State |
|---|---|
| Geo pipeline + binary + gate | **IMPLEMENTED** |
| 3D world (terrain/roads/flora/buildings/landmarks/interiors/schools) | **IMPLEMENTED** (named fabric debts §8) |
| Stalls at Kpata/food-area | **DEBT** (filter wipe; 2 survive at Ganaja) |
| Traffic-light *behavior* rendering | **DEBT** (phase law simulated; heads unlit) |
| Pocket economy (fortress guards, kobo-chain, HMAC save v20) | **IMPLEMENTED** |
| Bank deposit/withdraw, festival spray, canoe ferry, travel fares | **PARTIAL — unsigned bypass paths** (5 sites; wolf alarm live) |
| Purse/server ledger (idemKey, chainHash, PIN, caps) | **IMPLEMENTED** (code + live books ₦0) |
| Nation-wire multiplayer (socket.io, 58 doors) | **IMPLEMENTED — runtime dormant in this sandbox** |
| WebRTC voice/stage (signaling on wire, media P2P) | **IMPLEMENTED — unproven at runtime here** |
| Cloud save (push/pull, delta, offline queue) | **IMPLEMENTED** |
| Auth (scrypt PIN, tiers, parent PIN, guest-first) | **IMPLEMENTED** (`/api/auth/tier` has no game-client caller — test-only) |
| PWA (manifest, sw m16.1, offline) | **IMPLEMENTED** |
| Foods/bag inventory | **PROTOTYPE** (display-only) |
| Achievements | **PROTOTYPE** (1 value ever) |
| `/api` hello route, `/rt` rewrite, `ECONOMY.rent/business/shopMargin` | **DEAD** |
| NPC event memory, hospital interior, swimming | **PLANNED** (with doctrine gates) |

## 11. PHILOSOPHY AUDIT (Phase 6)

- **The Design Constitution is still chat-canon, not a file.** All four Bibles declare subordination to it; `docs/Design_Constitution.md` does not exist (directory listing re-verified). This is the standing Ten-Year-Test condition (prior audit Risk #11) and it remains **unmet**. Persisting it — verbatim, as a *persist not a rewrite* — is still the recommended future pass.
- **Law-by-law spot verdicts** (the audit's Phase-6 sample): W-46's law text named a non-existent symbol (`advanceClock`) — the *law* was timeless, its anchor wasn't; fixed by naming the real hand (`advanceWorldClock`). W-32 carried an unpersisted statistic — fixed by stating method + tolerance curve. EX-20's law was sound; its badge-location example had drifted — fixed. No law was found contradictory, implementation-bound beyond repair, or valueless. The seven Foundation Laws (EX-44→47, C-19→21) re-verified in place.

## 12. ASSET AUDIT (Phase 7 — classification)

| Asset | Class |
|---|---|
| `public/world/geo-v1.bin` (60,071 B) | **Intentional binary** — OSM pipeline product, gated load |
| `public/art/menu-hero.webp` | **Sanctioned 2D-shell art** (A-2 family 1; 1 live consumer) |
| `public/icons/*.png` (5) + `logo.svg` | **PWA shell** (A-2 family 2) |
| `public/art/loc-*.webp` (10) + `ad-*.webp` (3) | **Legacy debt** — zero importers/consumers; deletion is the cure |
| `public/manifest.json`, `sw.js`, `offline.html`, `robots.txt` | **PWA shell** |
| 3D world geometry, textures, all audio | **Runtime-generated** (procedural; zero shipped models/audio/photo-textures) |
| `research/competitor-zip/`, `download/**`, `scripts/tmp/**`, root `worklog.md` | **Non-shipped dev artifacts** (not part of the Next app) |
| `examples/websocket/` | **Orphan scaffold** |

## 13. PRODUCTION REALITY (Phase 8)

- **Measured, with records**: conservation ₦0 (reproduced to the naira this pass); wire census (58/45/11); suite file counts (48+58); save ladder (19 steps); asset bytes (60,071 B binary; 1.5 MB `public/`).
- **Recorded but stale — remeasure owed**: SILK G1–G6 (last run m24-fuel-era: 2.59 s / 406 KB / 56 MB heap; no prod build exists now).
- **Code-true, runtime-unproven here**: multiplayer wire (nothing on :3003 in this sandbox), WebRTC voice, cloud push/pull round-trip, PWA update cycle.
- **Never measured / no artifact**: boot-time wall-clock on device targets beyond the SILK TTI proxy; memory profile beyond PerfChip's live readout (no persistent heap metric exists by design).

## 14. REPOSITORY STATUS & CONFIDENCE

- **canon ↔ disk**: the four Bibles v2.2 now agree with the repository on every figure this pass could re-derive (~104 held, 6 amended, 0 new falsified). Every number is re-derivable from the three persisted `rv-*` scripts plus the prior `audit-p3-*` battery.
- **Docs ecosystem**: Bibles v2.2 + this audit + ERA2 (with both banner strips) are mutually consistent. The v2.1 audit survives at git `411f119~1`.
- **Confidence assessment**: **HIGH** for every held figure (double-derived, script-persisted); **HIGH** for the six amendments (each carries the exact anchor and, where relevant, the method forensics); **MEDIUM** for multiplayer/voice/cloud runtime behavior (code-true, sandbox-dormant); **EXPLICITLY UNKNOWN** where listed in §7 — never papered over.

## 15. NEXT ENGINEERING PRIORITIES (unchanged in substance, re-anchored)

1. Sign the 5 bypass paths (EX-20.1) — the wolf alarm dies with the last unsigned row.
2. RemoteVehicles rig-per-view + tagCache LRU (EX-31.2).
3. Kpata stall resurrection with count assertions (`STALLS ≥ 20`, kpata ≥ 8) in `test-world3d.ts`.
4. Presence street refresh on district change (EX-31.1).
5. Boot diet: delete `layout.TREES`/`GRASS` dead compute.
6. Fresh prod build + full SILK re-gate (the first act under "re-measured, never assumed").
7. Cheap hygiene riding any commit: delete the 13 orphan `.webp`; fix the `layout.ts:7`, `jobs.ts:4`, `layout.ts:720` fossils; delete the dead `ECONOMY.rent/business/shopMargin` block; persist `docs/Design_Constitution.md` (Risk #11, still open).

---

*Evidence artifacts: `scripts/rv-geo-census.ts`, `scripts/rv-data-census.ts`, `scripts/rv-spot-checks.ts` (this pass; re-runnable), plus the retained `scripts/audit-p3-*` battery of prior passes. Zero source files modified — this pass amended canon only (4 Bibles → v2.2, 1 archive banner addendum, this document).*
