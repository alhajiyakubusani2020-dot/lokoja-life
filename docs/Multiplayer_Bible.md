# LOKOJA LIFE — MULTIPLAYER BIBLE
### The named multiplayer reference · v1.0 · 2026-10-22
> **Authority.** This book CONSOLIDATES: `MULTIPLAYER_PLAN.md` (the M24 plan v2 — BOUND, never
> amended by this book), `docs/Content_Bible_Expansion.md` Part II (multiplayer content standards —
> binding), and the BUILT multiplayer reality (M24 waves W0–W10 shipped and battery-proven: nation-wire
> service, m24-wire 35/35, m24-wheels 90/90, m24-ledger 45/45, hardening 18/18, plus two-walker E2E
> witnesses). Evidence anchors: `mini-services/nation-wire/` (the service: `index.ts` 164 lines post-decomposition + `context.ts` 565 lines + `handlers/` ≈2,009 lines; ~60 socket handlers),
> `prisma/schema.prisma` walls, `src/game/systems/{live,wheelnet,remotenet,bodies,wheels,voice,
> voicenet,stagenet,walletnet}.ts`. Extensions are marked **[EXT]**.
>
> **The question this book answers:** what IS multiplayer in Lokoja — what is built, what is planned,
> what is forbidden, and what laws no future wave may break?

---

## PART I — THE ONE-PARAGRAPH TRUTH

Multiplayer in Lokoja is the nation wire: one socket lane behind the gateway, bearer-token identity
reuse, the relay doctrine (the server distributes and validates, never simulates), tiered safety
walls enforced server-side, server-authoritative money through a hash-chained ledger, real bodies on
real streets at 10 Hz, real cars on real roads at 12 Hz with honest fuel — and in-game naira only,
forever.

## PART II — WHAT IS BUILT (the verified inventory; each row battery-proven)

| Capability | State | Proof |
|---|---|---|
| Realtime transport | socket.io mini-service :3003 behind Caddy :81 (`XTransformPort` gateway law); 12s HTTP relay = degraded lane | m24-wire 35/35; W4 amendment (plan §3.1) |
| Identity | handle + PIN (scrypt) + ageBand + parent PIN + bearer token — THE multiplayer identity; guests spectate per amended law | M9/M24-W1; m24-register |
| Bodies | remote walkers on the street at 10 Hz; co-presence chip; join-teleport | m24 bodies E2E shots; remotenet doctrine |
| DMs & chat | global/street channels + DMs + history + typing + unread; tier laws at the server door | m24-wire suite |
| Friends | Connect graph: requests, blocks, reports path, hangout invites | m24-connect E2E |
| Voice / video | 1:1 WebRTC, signaling on the wire, media P2P; TURN honestly deferred (CGNAT debt); kid mics dark at the server door | m24-voice/face; N6 |
| Money | `WalletRow`+`LedgerRow` server-authoritative; idemKey replay law; chainHash tamper chain; day-cap eyes; tips | m24-ledger 45/45; hardening 18/18 |
| Vehicles | server-persisted `VehicleRow`; 12 Hz only-while-moving; N12 clamp; park law; boarding (stopped+consent); fuel/wear/plates | m24-wheels 90/90 |
| Stage | POV broadcast mesh (cap 8), viewer-crowd law, ledger tips | m24 stage; W9 mesh amendment |
| Whot | deterministic engine ready to host; server tables W11 (planned) | whot-engine purity |
| Safety | M13 walls server-side; report/mute/block at the door; NDPR consent per session | hardening + M13 suite |

## PART III — THE LAWS THAT CARRY FOREVER (plan §4 + Content_Expansion II, restated)

1. **The relay doctrine:** server distributes + validates, never simulates; deterministic client
   engines + thin server recording; new multiplayer content must fit this shape or it does not ship.
2. **Identity reuse:** no separate signup; the M9 identity is the multiplayer identity.
3. **Tier walls verbatim:** kid = emotes only; teen = 140 chars + word wall; adult = 280 + link/
   phone/crypto stripping. Every new surface re-applies them AT THE SERVER.
4. **Money authority:** settlement through the server ledger only; the kobo chain never forks;
   in-game naira only, forever (CBN honesty clause).
5. **Moderation is part of the feature:** a social surface without its ops door fails Definition of
   Done (Content_Expansion II.5).
6. **Co-presence budgets:** remote avatars obey crowd-system budgets; no new animation rigs beyond
   the existing grammar (Content_Expansion II.6).
7. **N1–N12 net gates:** TTI/wire/heap/reconnect/bandwidth/voice-latency/server-tick/two-context/
   WAL/degraded-lane/N11-diegetic/N12-vehicle — the permanent suite beside SILK (plan §6).

## PART IV — WHAT REMAINS (the honest gap list; plan §2 ten gaps, current state)

Closed by build: transport (W0/W4), bodies (W2), DMs (W4), connect (W5), ledger (W6), voice (W7),
face (W8), stage (W9), wheels (W10), register (W1), diegetic world (W3). Still open: **W11 real
Whot tables** (matchmaking + stakes via ledger) · **W12 the proof** (50-CCU bot soak that walks AND
drives, ops console, backup law, deploy guide) · **TURN self-host** (voice works STUN-only today;
CGNAT pairs ~20–30% fail honestly-labelled) · the plan's five remaining economy bypass sites
(Economy_Bible V.4). Nothing else may be improvised; W11/W12 follow the plan as written.

## PART V — THE NIGERIAN CONTEXT LAWS [EXT]

1. **Data is expensive:** every multiplayer feature argues its bytes (N5 ≤12 KB/s/client); the
   degraded 12s lane is a FEATURE for bad networks, not a fallback embarrassment.
2. **Devices are shared & modest:** heap/wire budgets (N2/N3) protect the modest Android (device-price shorthand, unsourced — no invented figure); heat truth
   gates video (Part III gates).
3. **Trust is the product:** the fortress ledger exists because Nigerian players have seen double-
   spend games; receipts, idempotency and tamper-evidence ARE the multiplayer UX.
4. **Language:** wire copy speaks Pidgin-English register; tier walls never translate into
   second-class copy (the city's manners are the product — Content_Expansion II.7).

## PART VI — FORBIDDEN (red lines, same force as canon Part X)

Real-money rails (CBN/PSP territory) · account-sharing design · surfaces that bypass tier walls ·
money features before moderation doors · record-without-consent voice/video · multiplayer content
that requires server simulation beyond the relay shape · any second transport lane outside the
gateway law.

## PART VII — GATES

1. Any multiplayer PR passes the four-part gate: relay shape + tier gates + money rule + moderation
   door (Content_Expansion VI.2 — all four or rejected).
2. N-gates run beside SILK on every wave (N1–N12 as specified).
3. Two-context E2E: A moves → B sees ≤500 ms; A sends ₦500 → B +₦500 exactly once; block kills
   DMs; chat survives reload; kid mics dark (N8) — re-proven per wave, not assumed.
4. The W12 soak is the multiplayer definition of "production": 50 bots walking AND driving inside
   every budget.
5. This book binds the plan; any conflict resolves in favour of `MULTIPLAYER_PLAN.md` + canon and
   is logged in the contradiction register.
