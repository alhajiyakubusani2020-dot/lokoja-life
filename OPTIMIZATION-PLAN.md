# SILK II — THE MADLY FAST DOCTRINE
**Status: PLAN — user freeze on code. No source file has been touched this round.**
**Sources: two full repo audits (rendering pipeline + bundle/wire), 10-query state-of-the-art research battery (evidence in `research/perf-plan/`), canonical literature.**
**Date: 2026-10-16**

---

## 0. THE DOCTRINE

> "Impossible to lag" is not a wish. It is a **structure**: every device class gets a locked
> frame contract, every known stutter source is surgically removed, and every guarantee is a
> test that can fail. Beauty yields before gameplay, gameplay yields before nothing.

The game is already in the top few percent of web-3D discipline (extras-first governor,
on-demand shadows, merged roads, instancing families, zero-asset audio, delta saves, honest
SILK gates). This plan does not rebuild those wins. It attacks the **six real surgical
targets** the audits found — each with file:line evidence and a measured cost class — then
cuts the wire so hard that "a 3D city displayed like that" becomes the viral shot.

---

## 1. THE AUDIT (what the scalpels found)

### GPU / frame killers (ranked)
| # | Finding | Evidence | Cost class |
|---|---------|----------|------------|
| 1 | **98 point lights** mounted at every door — 0 opt out. Every lit fragment loops NUM_POINT_LIGHTS=98; intensity is evaluated once at mount so they are usually dead weight that still costs the loop | `CityMesh.tsx:2171-2173` | fragment fill — catastrophic on mobile |
| 2 | **686 doorway meshes**, ~686 private materials, ~400 shadow casters | `CityMesh.tsx:2136-2177` | draw calls + shadow pass |
| 3 | **~20–25k river-segment distance evals per frame** — heightAt + riverDistance scan all 333 river segments, ~55 calls/frame; roads already have a spatial grid, rivers don't | `layout.ts:536-584`, `collision.ts:148-174` | main-thread JS, multi-ms on low-end |
| 4 | **NPC/player rigs share nothing** — 13 rigs × ~17 meshes × private 7-material set ≈ 215 draws, ~91 materials, ~200 duplicated geometries | `HumanRig.tsx:112-130,523-651` | draw calls + memory |
| 5 | **Traffic ≈ 325–450 individual meshes** always in frustum road loops | `vehicles.ts:330-640` | draw calls |
| 6 | **Rain** = 620 CPU-updated points + full buffer upload every raining frame | `Actors.tsx:1033-1054` | JS + bus bandwidth |
| 7 | **22 label sprites** 512×128, depthTest:false, always drawn + per-frame bounce | `CityMesh.tsx:2095-2123` | transparent overdraw |
| 8 | **GC churn in PlayerController** — Object.entries(ANCHOR_BY_ID) per frame, fresh Vector3 ×1-2, fresh input objects | `Actors.tsx:259,323,335`, `controls.ts:169-211` | GC hitch class |
| 9 | Terrain build hitch at mount (26k verts × full heightAt + road queries, synchronous) | `WorldTerrain.tsx:80-158` | boot hitch |
| 10 | Legacy Stage-3.6 3D stack (~3,526 lines) + SceneBackdrop dead in source; 3 of 9 pre-existing tsc errors live there | `world3d/*.tsx`, `screens/WorldView.tsx` | hygiene (0 wire bytes today) |

### Wire / weight killers (ranked)
| # | Finding | Evidence | Cost class |
|---|---------|----------|------------|
| 1 | **cda9 monolith: 1.93MB raw / 491KB gz** — three + R3F + geo + world + ALL 2D tabs in one dynamic chunk; a map-first player pays for three.js | `.next` chunk census | wire + parse |
| 2 | **geo.ts 432,444 B ships as decimal text** (client-verified in cda9); geo-map.ts 100KB same | `src/game/world3d/geo.ts` | wire + 30–50% parse waste |
| 3 | **Entry carries the whole 213KB store + 417KB systems + 183KB data** for a menu needing ~5 values (f26a = 102,608 gz) | `app/page.tsx:18,32-35` | first-paint wire |
| 4 | **art/ 1.27MB webp, no AVIF**, menu-hero 132KB on first paint; no images.formats config | `public/art/`, `next.config.ts` | cache bill + first paint |
| 5 | Fonts: 3 families / 13 files / 194KB, Geist Mono unused by game UI, Outfit 4 weights | `app/layout.tsx:2-23` | render-blocking preload |
| 6 | 16 unused npm deps (framer-motion, next-auth, mdxeditor…); playwright missing from devDeps while silk-gates depends on it | `package.json` | supply-chain + CI reproducibility |
| 7 | **G2 not re-gated on the current build** (entry grew +24KB gz since the last green gate) | worklog m16 vs m19 | measurement debt |

### Current honest baseline (last green gates, m19)
G1 TTI 2.54s · G2 wire 389KB · G3 warm 4ms · G4 heap 27MB · G5 SW 3.1MB · 0 console errors.

---

## 2. THE LITERATURE (books & sources this plan stands on)

- **Real-Time Rendering, 4th ed.** (Akenine-Möller, Haines, Hoffman) — acceleration chapter:
  culling, LOD, fill-rate vs vertex-bound diagnosis; the frame-budget mindset.
- **Game Programming Patterns** (Nystrom) — **Spatial Partition** (the river-grid fix),
  **Object Pool** (the scratch-vector discipline), **Dirty Flag** (on-demand shadows we
  already run), **Update Method** (the frame-loop laws).
- **WebGL Insights** (Cozzi, ed.) — draw-call discipline, real-case budget tables.
- **Game Engine Architecture** (Gregory) — tiered scalability budgets (our tier law's text).
- **High Performance Browser Networking** (Grigorik) — wire weight, latency, cold-cache reality.
- **web.dev / MDN** — INP/TTI guidance; WebGPU Baseline (Nov 2025) noted as horizon, not core.
- **three.js docs "How to run things cheaply"** + **R3F "Scaling performance"** — demand
  frameloop, per-frame allocation bans, shared materials/geometry.
- **Research battery** (`research/perf-plan/s1…s10.json`): draw-call minimization, point-light
  fragment cost, KTX2/Basis, Draco/quantization, spatial hashing (Müller et al.),
  OffscreenCanvas workers, Android jank/GC, Next.js splitting.

---

## 3. THE COMPARISON (where the world's best 3D-web sits vs us)

| Technique | Best-in-class web 3D (PlayCanvas showcases, configurators, three.js showcase) | Lokoja Life today |
|---|---|---|
| Merged static geometry | everywhere | ✅ roads/markings/bridges already merged |
| Instancing families | everywhere | ✅ ~70 families (buildings/trees/lamps/schools) |
| Shared materials/geometry | universal | ⚠ vehicles only — rigs/doors private |
| Light discipline (≤8 real lights, fake glow) | universal | ❌ **98 point lights** |
| Binary/quantized assets | universal (Draco/meshopt/KTX2) | ❌ geo.ts as decimal text |
| Spatial partitioning for queries | universal | ⚠ roads yes, rivers no |
| Chunk discipline (2D never pays for 3D) | universal | ❌ one 491KB gz monolith |
| Adaptive quality governor | rare | ✅ best-in-class already |
| Zero-asset procedural audio | rare | ✅ already |
| Honest perf gates in CI | rare | ✅ already (SILK) |

**Verdict:** our weakness is not architecture — it is **five specific hot spots + a fat wire**.
That is exactly the kind of war we win fast.

---

## 4. THE PLAN — six phases, each ends green or doesn't merge

### P0 — RE-BASELINE (size S, ~30 min)
1. Re-run `scripts/silk-gates.ts` on the CURRENT build (G2 measurement debt).
2. Run `scripts/perf/draw-census.ts` + payload snapshot → before-numbers in `research/perf-plan/baseline.json`.
3. Add one gate: **world-playable TTI** (menu → first settled world frame, Fast 3G).
   *Exit: numbers on disk, screenshots before.*

### P1 — THE FRAME (GPU; size M)
1. **The Light Law**: doorway lights gated to the ≤6 nearest doors around the player
   (real point lights), every other door gets emissive fake-glow planes — visually the same
   night city, fragment loop collapses 98→≤6.
2. **Doors instanced/merged**: 686 meshes → ≤8 buckets (frame+lintel+glow), shadow casters ≤ tier law.
3. **Rig sharing**: module-level material/geometry caches (the vehicles.ts pattern) — 13 rigs ≈ 1 shared set + palette tint.
4. Labels: distance-cull + drop depthTest:false always-draw; shrink label atlas.
5. Verify: draw-census delta, m7 real-device capture, world3d 707 + full battery green.

### P2 — THE LOOP (CPU; size M)
1. **River spatial grid** (Game Programming Patterns: Spatial Partition) — mirror the road grid; heightAt/riverDistance become O(cell). Determinism preserved (same math, fewer candidates — verify equal results on a sweep).
2. PlayerController scratch discipline: hoisted ANCHORS array, Vector3 pool, preallocated input objects — **zero allocations in the frame loop** becomes a tested law.
3. Rain → GPU shader-time falloff (no per-frame CPU upload).
4. Terrain build: split into time-sliced chunks (kill the mount hitch) or worker-assisted vertex paint behind a flag.
5. Verify: perfProbe p95, allocation audit, full battery green.

### P3 — THE WIRE (lightweight; size M-L)
1. **geo.ts → quantized binary**: Int16 delta-encoded `.bin` fetched from /public (SW-cached), decoder + equality tests vs the text source; geo-map.ts same. Est. −100–170KB gz, −30–50% parse.
2. **cda9 split**: World chunk (three+R3F+world/) vs 2D-tabs chunk — map-first players never download three.js. Est. −150–250KB gz for 2D-first sessions.
3. **Menu-store slice**: entry keeps ~5 values; the 213KB store graph moves behind Dashboard. Est. −60–80KB gz off first paint.
4. Fonts: drop Geist Mono, Outfit → 2 weights (−30–60KB); `images.formats: ['image/avif','image/webp']`; art/ re-encode menu-hero.
5. Delete legacy world3d scene stack + SceneBackdrop + 16 dead deps; playwright → devDeps. tsc errors 9 → ~6.
6. Verify: all six SILK gates green on the new shape, payload snapshot delta.

### P4 — THE SHOCK (elite layer; size M)
1. **Warm-boot fast path**: session 2+ boots the world with cached shaders/pipelines — first frame lands before the eye finishes the blink.
2. Prerendered menu paint; world chunk boots behind first interaction (already idle-preloaded — tighten to pointerdown).
3. Thermal/battery hint → extras step-down (where the API exists; honest no-op elsewhere).
4. Timeboxed OffscreenCanvas spike (R3F-in-worker) — **only ships if it cannot destabilize** the 30-device law; otherwise documented and dropped.
5. WebGPU: documented horizon (Baseline Nov 2025, adoption growing), stays behind the WebGL2 primary path this plan.

### P5 — THE PROOF (size M)
- New deterministic suite `m-optim` (~60–100 law checks): light-cap law, spatial-grid equality sweep, binary-geo equality, zero-alloc frame law, chunk-split invariants, store-slice equality, warm-boot idempotence.
- Full battery (world3d 707 → +new) + all six SILK gates + E2E matrix + draw census before/after + real-device capture.
- Honest verdict table per performance dimension: improved / held / **skipped-with-reason** (the standing user law).

---

## 5. TARGET BUDGETS (the shock table)

| Dimension | Today | Target |
|---|---|---|
| G1 TTI (Fast 3G cold) | 2.54s | **< 1.5s** |
| G2 menu wire | 389–430KB | **< 220KB gz** |
| G2 game-path wire | ~491KB gz (+geo) | **< 300KB gz** |
| World-playable TTI (new gate) | unmeasured | **< 4s Fast 3G / < 1.5s warm** |
| Draw calls (main pass) | ~1,500–1,700 | **< 800** |
| Point lights | 98 | **≤ 6 real + fake glow** |
| Frame-loop allocations | ~10–20/frame | **0 (tested law)** |
| River-query cost | 333 segs × ~55/frame | **O(cell) (~<100 evals/frame)** |
| p95 frame | tier-dependent | **low ≤33ms · mid/high ≤16.6ms** |
| Heap with world up | 27MB | **hold < 30MB** |
| INP / warm interaction | 4ms | **< 50ms** |
| tsc errors | 9 pre-existing | **≤ 6 (dead stack deleted)** |

---

## 6. WHAT I THINK (the honest verdict)

1. **The foundation is already elite** — the governor stack, extras-first law, merged geometry
   and honest gates are things most shipped web games never build. We are not rescuing a slow
   app; we are **removing five known tumors from a healthy body and putting it on a diet**.
2. **The 98 point lights are the scandal and the gift** — one of the cheapest fixes in the
   whole plan carries the biggest mobile win. Fixing it plus door instancing plus the river
   grid alone should take low-end p95 frame time to the locked-30fps contract with headroom.
3. **"Impossible to lag" = a floor contract, honestly stated.** Physics forbids promising a
   2016 potato renders like a 4090. What we CAN promise — and test — is: low tier locked 30
   with zero >50ms hitches, mid at 60, high at 60+, every beauty layer dies before gameplay,
   and no known stutter source survives the plan. That is a stronger guarantee than most
   native games ship.
4. **The wire cut is the shock multiplier.** Most people have never seen a 3D city open in
   ~1.5s on a phone browser over 3G. Binary geo + chunk split + menu slim is exactly how we
   make the impossible look casual — and it compounds with the PWA shell we already ship.
5. **Risks I am watching:** the cda9 split touches the import graph (regression risk — gated
   by full battery), binary geo must prove byte-equality on every law check before it
   replaces the text source, and the OffscreenCanvas spike is timeboxed because thread
   boundaries have eaten teams alive. Everything else here is low-risk, high-yield surgery.
6. **Nothing in this plan touches gameplay data or laws.** Money, saves, chaos, rivers,
   story — untouched by design. The deterministic suites stay the referee.

**What remains after this plan ships (the full honest list):** only **M20 PLANET SCALE + OPS**
per ROADMAP.md v2.1 — M8→M19 are all shipped and gated. Plus whatever P0–P5 skips honestly.

---

*Standing law honored: if any phase cannot hit its budget, that part is left untouched and
reported to the user at the end — no fudging, no fake green.*
