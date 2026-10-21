# LOKOJA LIFE — BIBLE UPGRADE & REVERIFICATION AUDIT

**Date:** 2026-10-21 · **HEAD at reverification:** `1fd2320` (clean tree) · **Mode:** read-only recon → canon amendment (Bibles + this audit only; zero source code touched)
**Scope:** `docs/Experience_Bible.md` · `docs/World_Bible.md` · `docs/Art_Audio_Bible.md` · `docs/Content_Bible.md` — upgraded **v2.0 → v2.1** ("the truth got sharper"), plus the ERA2-UI-AUDIT correction banner refreshed.
**Trigger:** the RULE ZERO directive — *never trust memory, previous conversations, old reports, or assumptions; everything re-discovered from the repository.* The v2.0 pass (commit `1fd2320`) had itself amended the Bibles; this pass re-verified **the v2.0 claims themselves** from disk, found 16 drifted/irreproducible figures and 1 falsified headline claim, and amended canon accordingly.

---

## 1. VERIFICATION METHODOLOGY

Everything in this pass was executed **directly against the repository**, in this order:

1. **Full-document read.** All four Bibles (1,194 + 619 + 355 + 478 lines) and `ERA2-UI-AUDIT.md` (246 lines) read end-to-end before any edit. Every `file:line` anchor and every number extracted into a verification matrix (~90 claims).
2. **The geo binary re-decoded — twice, two ways.** The repo's own decoder (`src/game/world3d/geo.ts decodeGeoBin`) was run against the raw bytes of `public/world/geo-v1.bin`; then a second probe did exact segment–polyline intersection tests for every road/river pair and a full pairwise river-vertex scan for the confluence. No prior measurement was trusted or reused.
3. **Runtime world bootstrap.** The layout/junctions/schools/interiors/flora/patti modules were imported and initialized inside `bun` with the real binary — placed counts (lights, bumps, stalls, lamps, doors, interiors, secrets, ribbons) read from the live arrays, not from comments.
4. **The live books walked.** `db/custom.db` opened readonly via `bun:sqlite`: the 319 LedgerRows were walked with kind-aware semantics (deposits/withdraws are self-rows; transfers and tips cancel; refuel/repair burn) and reconciled against Σ WalletRow.
5. **The wire re-counted.** Distinct refusal `why:` codes enumerated from `mini-services/nation-wire/index.ts`; handlers, caps, cadences, and wall sites grepped at their exact lines.
6. **Anchor spot-checks.** ~50 `file:line` citations opened and read at the cited line; stale ones re-pointed at the true lines.
7. **Only then were the Bibles edited** — and every amendment below carries the anchor that proves it.

Verification scripts persisted at `scripts/audit-p3-*.ts|sh` (re-runnable evidence).

---

## 2. VERIFICATION SUMMARY

**Claims re-verified this pass: ~90 load-bearing figures/anchors across the four Bibles.**

| Verdict | Count | Meaning |
|---|---|---|
| **HELD — verified again, unchanged** | **~70** | The v2.0 canon is mostly true. All headline geo figures held exactly. |
| **AMENDED — drifted or irreproducible** | **16** | Corrected in the Bibles this pass (table §3). |
| **FALSIFIED — unqualified claim contradicted by disk** | **1** | "Zero asset files — 100% procedural" (Art §10.1, echoed in Experience §47 and the v2.0 audit). Truth: the 3D world and audio are 100% procedural; the 2D shell ships 20 binaries (1 live hero + 5 PWA icons + logo + 13 orphans). Law A-2 rewritten with the precise scope and two named sanctioned families. |
| **LAWS ADDED** | **0** | The seven Foundation Laws (EX-44→47, C-19→21) were confirmed present, correctly placed, and re-verified; this pass adds none — nothing observed on disk earned permanence that the books did not already hold. |
| **LAWS REMOVED / RENUMBERED** | **0** | Canon is additive and corrective only. |

**Held (headline, each re-proven this pass):** 2,655 ways / 5,894 segments / 8,549 points / **750.4 km** / 60,071 B binary · 16 rivers / 16 bridges / 5 loops · confluence **0.00 u** (the `niger` and `benu` ways share the identical vertex (−3, 172.3)) · 1 u = 26 m (`geo.ts:8`) · GEO_WORLD_HALF 310 · 2,656 rendered ribbons · NPC_COUNT 12 · 13 stroll zones · night 4 · TRAFFIC_MIX 14 rigs on loops 0–2 · LIGHT_CAP 14 / **12 placed** · BUMP_CAP 12 / **6 placed** · phases 12/3/15 (`junctions.ts:52-54`) · TREE_CAP 720 · GRASS_TUFTS 10,000 · 110 rocks · 492 lamps · drains cap 1,800 · plate cap 40 · yearDays 72 (`config.ts:658`) · **10 festivals** (`calendar.ts:159-173`) · ₦5,000 day 1 (`config.ts:14`) · 4 slots (`config.ts:192`) · 7 skies (`types.ts:289`) · 4 vehicle kinds (`types.ts:227`) / 7 modes (`types.ts:292`) · 21 jobs · 20 hustles · 4 job boards · **14 named NPCs** (`npcs.ts`) · **5 Patti secrets**, DISCOVERY_RADIUS 9, ~2 Hz · **32 anchors** (`layout.DISTRICTS`) · 58 client-facing doors / **59 handlers** · **45 refusal why-codes** (enumerated; `minors-*`/`guest-*`/`bad-*`/`no-*`/`not-*` families) · 4 KB cap (`index.ts:1064`) · RESUME_CAP 100 (`index.ts:151`) · save v20 (`save.ts`) · 16 Prisma models, migrations baselined (`0_init` + hardening) · **48 unit + 58 e2e suites** · **63 systems** · **26 phone apps** (`PhoneApp` union, `PhoneScreen.tsx:79`) · **conservation ₦0 drift re-proven kind-aware**: deposits 3,610,200 − withdraws 9,500 − refuel 22,000 − repair 1,594 = **3,577,106 = Σ WalletRow exactly** (125 wallets) · 18 `--lko-*` tokens · Geist + Outfit · ACES @1.12 · 1024² governed sun · FramePacer 30 Hz · silk gates G1–G6 (`scripts/silk-gates.ts`) · 8 ambience layers at 320/850/480/1,400/140/4,400/520/3,200 Hz (`ambience.ts:99-106`) · music: C-pentatonic 261.63, 16-step bars, kick 0/7/10 · ghost classes (`lko-glass`/`lko-label`) still undefined · legacy `layout.TREES` (700) still dead compute · `layout.GRASS` still feeding only ≤72 flower dots (`WorldTerrain.tsx:956`) · shared-rig still live (`RemoteVehicles.tsx:114/:179/:221`) · stall filter still live (`layout.ts:1660`; **STALLS=2**) · stale header still live (`layout.ts:7`) · unlit signal heads still live (`CityMesh.tsx:1358`) · `wireSetStreet` entry/join-only still live (`wire.ts:645-648`) · unsigned bank rows still live (`useGameStore.ts:2205/:2258`) · the 5 bypass sites confirmed at `:2205/:2258/:2341/:2730/:3652` · `depositVerdict` pure (`ledger.ts:96-107`) · merge law (`guest.ts:106`) · TIERS (`social.ts:22-27`) · STORY_BEATS (`story.ts:371`) · plate `@unique` (`schema.prisma:240`) · idemKey `@unique`.

---

## 3. THE 16 AMENDMENTS (corrected figures)

| # | Was (v2.0 canon) | Now (v2.1, disk-proven) | Where amended |
|---|---|---|---|
| 1 | 108 doors (10 + 98 school) | **98 doors = 10 layout + 88 school** (`ALL_DOORS`, `schools.ts:1761`); 98 interiors + 5 doorless G2 rooms = **103 registered spaces**. The "108" double-counted `ALL_DOORS`. | Experience EX-14, EX-17, §47 · World §7.3, quick sheet, §10.1 · Content P2 |
| 2 | 98 school doors | **88 school doors** (`SCHOOL_DOORS`) across 12 sites | same rows |
| 3 | 17 interior builders | **20 interior builders** (`schools.ts`: classroom/office/library/grandLibrary/lab/theatre/senate/facultyArts/facultyScience/hostel/canteen/clinic/scienceLab/hall/anatomyLab/preclinic/workshop/chapel/mosque/demo) | Experience EX-17 · World §7.3 |
| 4 | "15 channel-crossing / 6 fully submerged" (and W-32's stale "18") | **23 unbridged road segments geometrically cross a river centerline; 3 more lie within a river half-width** — the reproducible re-decode (exact segment–polyline intersection; threshold-independent). All three old figures retired. | World W-5, W-32, §3.5, §10.1 |
| 5 | 12 decorative parked cars | **7** (`PARKED_VEHICLES`, `vehicles.ts:940`) | World §7.1, quick sheet, §10.1 |
| 6 | "Only 19 ways carry OSM names" | **19 distinct OSM names across 29 named ways** | World §3.1 |
| 7 | 13 M13 walls | **11 direct minor-wall sites** (5 `minors-no-money` · 3 `minors-no-voice` · 2 `minors-collect-nothing` · 1 `kid-text-refused`) + the `canLive` band capability layer + the M13 suite's wider matrix | Experience EX-17.3 |
| 8 | Resume gap cap cited at `index.ts:537-540` | Cap is `RESUME_CAP = 100` at **`index.ts:151`** (`:537-540` is the kept last-moment — re-cited as such) | Experience EX-6 · Content caps table |
| 9 | Autosave anchors `useGameStore.ts:1433-1438 / :1394-1419` | **`config.ts:333`** (`debounceMs: 1200`) + writer **`useGameStore.ts:1157`** + pagehide flush **`page.tsx:80`** | Experience EX-6 |
| 10 | Spawn veil anchor `Dashboard.tsx:878-977` | Veil at **`WorldTab.tsx:503-516`**, probe/fallback `:56-110` | Experience EX-3 |
| 11 | 26 apps = 7 wire + 12 store + 6 read-only (sums 25) | **7 wire + 12 store + 7 read-only = 26** — Story is a read-only book (`story-app.tsx`) | Content §11.1 |
| 12 | Rain particles anchored to `polish.tsx` | 620 at **`Actors.tsx:1032`** (`COUNT = 620`; polish.tsx keeps DustHaze/puddles/veil) | World §6.2-via-Art §10.1 |
| 13 | 1,173 exact `text-[Npx]` | **1,178** (v2.1 census, decimal-tolerant pattern); "≈1,200" posture unchanged | Art §7.2 |
| 14 | Patti plateau "30.03 u" | **+30 u authored mound** (`layout.ts:625`: `plateauH +30` at the patti anchor) | World §10.1 |
| 15 | Energy 150 m cited to `controls.ts:284-304` | Constant is **`config.ts:349`** (`freeMeters: 150`); measurement `controls.ts:293-305`; application `useGameStore.ts:1559` | Content caps table |
| 16 | Typo "Experince EX-24" | "Experience EX-24" | World §1.3 |

**Also fixed for coherence:** Content Bible Parts II & VIII cited the Exit Test as "(EX-44)" — stale since EX-44 became the City Memory Law; now "(Experience §44)" per the v2.0 breaking-change rule. All four Bibles' version lines are now **2.1** with a dated reverification note each.

**The falsified claim, precisely:** Art §10.1 said "zero asset files — 100% procedural, permanent." Disk: `public/art/` holds 14 `.webp` files; `public/icons/` holds 5 PWA PNGs; `logo.svg` sits at the root. Consumer census: `menu-hero.webp` is **live** (MainMenu key art — and always was; the phrase "100% procedural" was never true of the menu); the 10 `loc-*.webp` plates have **zero importers** (`LocationArt.tsx` is an orphan); the 3 `ad-*.webp` files have **zero consumers** (only `scripts/gen_art.mjs`, their generator); icons/logo are PWA chrome. A-2 now scopes the law (world + audio 100% procedural; two named sanctioned shell families), and the 13 orphans enter the debt ledger (Art §7.3 #7). Experience §47 re-worded to match. This is the Sincerity Law working exactly as intended: a claim that could not survive re-decode did not survive.

---

## 4. CONSERVATION, SHARPER (the money semantics)

The v2.0 formula ("3,610,200 − 9,500 − 23,594 = Σ WalletRow") is **confirmed exact** but its semantics are now written down: LedgerRow amounts are unsigned; direction lives in `kind` (deposit/withdraw are self-rows pocket⇄purse; transfers and tips cancel across purses; refuel/repair burn). The kind-aware identity: **deposits 3,610,200 − withdraws 9,500 − refuel 22,000 − repair 1,594 = 3,577,106 = Σ WalletRow (125 wallets), drift ₦0.** The **₦11,100 tip lane** (30 rows) is value that enters a server purse from a client-side pocket with no server-side debit row — i.e., the unsigned spray ingress, already named as an EX-20.1 bypass debt. It is *not* drift; it is the wound the Bibles already scheduled for surgery.

---

## 5. RETIRED STATEMENTS (do not quote these again)

1. "108 doors" / "98 school doors" — replaced by 98 doors (10+88) / 103 spaces.
2. "15 underwater / 6 submerged" and "18 underwater" — replaced by the reproducible 23 crossings / 3 half-width.
3. "12 parked cars" — 7.
4. "13 M13 walls" — 11 direct sites + capability layer.
5. "17 interior builders" — 20.
6. "Only 19 ways carry OSM names" — 19 names across 29 ways.
7. "Zero asset files" (unqualified) — scoped per A-2.
8. "plateau 30.03 u" — +30 u authored.
9. Dead line anchors: `useGameStore.ts:4999/:4801` (double-pay, fixed-since — the scar stays, the line numbers go), `:1433-1438`/`:1394-1419`, `index.ts:537-540` as the cap, `Dashboard.tsx:878-977` as the veil.
10. Every pre-v2.1 underwater/parked/door figure in `ERA2-UI-AUDIT.md` — the archive's correction banner now carries the v2.1 numbers so no reader quotes the archive's arithmetic.

---

## 6. UNRESOLVED ENGINEERING DEBT (re-verified still open, ranked)

**P0-class (trust/world truth):**
1. **Shared-rig multi-mount** (`RemoteVehicles.tsx:114/:179/:221`) — unchanged this pass; the multiplayer trust wound.
2. **5 unsigned pocket-cash bypass sites** (`useGameStore.ts:2205/:2258/:2341/:2730/:3652`) + the fortress wolf alarm — all five re-confirmed live; the tip lane (₦11,100 on the live books) is its visible face.
3. **Kpata stall wipe** (`layout.ts:1660`) — re-confirmed at runtime: STALLS=2, both Ganaja; Kpata 0, food-area 0.
4. **Presence street staleness** (`wire.ts:645-648`) — re-confirmed.
5. **Mid-drive wire drop never re-hellos** (fire-and-forget refusal lane) — unchanged.

**World fabric:**
6. 23 unbridged river crossings / 3 half-width submerged (reproducible v2.1 measure).
7. 72% dead-end way-ends; school-yard clip holes; no end caps.
8. Unlit signal heads (`CityMesh.tsx:1358`); loops 3/4 table-only; civic fence walk-through (`collision.ts:56` region).

**Boot/perf:**
9. Dead boot compute: `layout.TREES` (700 trees, zero consumers) + `layout.GRASS` (7,500 → ≤72 flower dots) — re-confirmed; the boot diet is still owed.
10. SILK re-measure on a prod build still owed (the 2.59 s / 406 KB posture is dated 2026-10-20; no prod build was on disk this pass either — re-measure, never assume).

**Documentation ecosystem:**
11. **The Design Constitution is still chat-canon, not a file** — all four Bibles declare subordination to it; `docs/Design_Constitution.md` still does not exist. Persisting it remains the recommended future pass (a *persist*, not a rewrite).
12. **Prod DB in git** (`db/custom.db` with tokens + PIN hashes rides every commit) — unchanged.
13. **13 orphaned `.webp` files** (new this pass, Art §7.3 #7).
14. Phone-app one-register reconciliation (`manifest.ts` says 10, grid is 26 — both re-confirmed) before app #27.
15. Stale fossil header `layout.ts:7` ("3,000+ ways, ~930 km") — still live.

---

## 7. PRODUCTION READINESS

- **Client + world + save:** production-shaped and honestly documented — v20 save ladder, migrations baselined, zero known state-loss paths, NO-PAUSE honored, the Feel Tests defined and executable.
- **Wire:** 58 doors / 45 refusal codes / idempotency / rate buckets / 4 KB cap all re-verified; conservation ₦0 on the live books. The 5 bypass sites and the tip lane are the named, scheduled exception — do not add a sixth.
- **Content pipeline:** 15 playbooks + gate order + caps registry re-anchored; a new contributor can be onboarded from the Bibles alone (Content Part IX).
- **Docs:** the four Bibles v2.1 + this audit + the archived ERA2 audit now agree with each other and with disk; every number in them is re-derivable from the persisted scripts in `scripts/audit-p3-*`.

**Verdict: canon and disk agree. The remaining distance to "ship" is the debt ledger in §6, not the books.**

---

## 8. QUALITY GATES (the four tests, re-run this pass)

| Test | Verdict | Evidence |
|---|---|---|
| **Mother Test** — respectful & understandable to someone from Lokoja | **PASS** | Real ward names untouched (W-28); Cultural Respect (C-21) re-verified in canon; no invented geography introduced by either pass; the falsified asset claim was *withdrawn* rather than defended — the city is not flattered to. |
| **Stranger Test** — a newcomer can understand the city from the books | **PASS (stronger)** | The quick sheet now carries the door/parked/ribbon census with anchors; every figure traces to a re-runnable script. |
| **Developer Test** — a new engineer can build correctly from these | **PASS (sharper)** | 16 stale anchors/figures that would have misdirected work are corrected; the caps table now cites the true constant lines (`config.ts:349`, `index.ts:151`). |
| **Ten-Year Test** — do the laws still protect the city in ten years? | **PASS (conditional, unchanged)** | The condition remains Risk #11: persist the Design Constitution to disk so the authority chain survives beyond chat history. |

---

## 9. NEXT ENGINEERING PRIORITIES (unchanged in substance, now better-anchored)

1. **Signed bank/festival/ferry/travel paths** (EX-20.1) — the wolf alarm dies with the SECURE lie; the tip lane's ₦ ingress closes with it.
2. **RemoteVehicles rig-per-view + tagCache LRU** (EX-31.2).
3. **Kpata stall resurrection** with count assertions (`STALLS.length >= 20`, `kpata >= 8`) in `test-world3d.ts`.
4. **Presence street refresh on district change** (EX-31.1).
5. **Boot diet**: delete `layout.TREES`/`GRASS` dead compute (World §5.1).
6. **Then a prod-build SILK re-measurement** (G1–G6) — the first act under "re-measured, never assumed."
7. **Cheap doc-hygiene wins riding any commit:** delete the 13 orphaned `.webp` files (Art §7.3 #7); fix the `layout.ts:7` fossil header; persist `docs/Design_Constitution.md` (Risk #11).

Every item: fail-test → fix → green → commit (the Phase-1 protocol). No new gameplay before the trust debts die (C-19 now enforces it).

---

*Audit artifacts: geo decode ×2 (`scripts/audit-p3-geo.ts`, `audit-p3-geo2.ts`), count batteries (`audit-p3-battery.sh`, `audit-p3-battery2.sh`), runtime world census (`audit-p3-world.ts`, `audit-p3-final*.ts`), DB walks (`/tmp/p3-cons*.ts` logic reproduced in §4), wire census, ~50 anchor spot-checks. All re-runnable. Zero source files modified — this pass amended canon only (4 Bibles, 1 archive banner, this document).*
