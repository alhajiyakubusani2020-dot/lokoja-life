# LOKOJA LIFE — M24 "THE REAL NATION" — MULTIPLAYER-READY UPGRADE PLAN

**STATUS: PLAN ONLY. Zero code written — the user's order is "don't code yet, just the upgraded plan, and close all gaps."**
Every claim in §1 was disk-verified on this tree (HEAD `4ae7557`, clean, M23 complete at `0397cd7`).

---

## 1. SINCERE AUDIT — what ALREADY exists (verified, not assumed)

| Capability | Today's truth (verified how) | Verdict |
|---|---|---|
| Identity | `prisma/schema.prisma` `Account`: handle + scrypt `pinHash`/`salt`, `ageBand` kid/teen/adult, parent PIN (M13), bearer `token` — "the M9 identity IS the multiplayer identity, no separate signup" | ✅ multiplayer-ready |
| Cloud save | `CloudSave` row + client HMAC `sig` + M20 `LKBD` binary-delta protocol over real HTTP | ✅ ready |
| Live relay | `/api/live/sync` (POST heartbeat → `LivePresence` upsert, pull `LiveEvent` since seq-cursor ≤120, roster TTL 90s) + `/api/live/action` — the RELAY DOCTRINE: "distribute, never simulate" | ✅ designed right |
| Live cadence | **12-second HTTP polling** (`LiveApp.tsx:91 setInterval(…, 12_000)`) | ⚠️ seconds-late, not live |
| Social laws | `src/game/systems/live.ts` (pure, headless): tiered chat (kid=12 emotes only / teen=140 chars + word wall / adult=280 + LINK_PATTERNS strip of URLs, phone numbers, crypto addresses), `voiceAllowed` (adult + opt-in + same street), trade/ajo/assoc/court verdicts, `crowdMult` viewers-as-crowd, city broadcasts | ✅ laws exist, reusable verbatim |
| Social money shapes | DB rows: `TradeRow`, `AjoRow`, `AssociationRow` (two-key treasury + kobo-chain), court by hash | ✅ shapes exist |
| Money authority | **Client-side.** Settlement = "each side applies through its OWN honest engines" (`useGameStore.ts` liveSync) — server records, client mutates own save | ❌ the big gap |
| Real players in world | Roster = text rows (handle/street/status) + HUD co-presence chip. **No remote avatars, no movement sync** | ❌ gap |
| Chat reality | Broadcast channels via poll; no DMs, no history, no typing, no unread; `ChatThread` is NPC texts | ⚠️ gap |
| Voice / video | `voiceAllowed` law exists; **zero `RTCPeerConnection`/`getUserMedia`/signaling/TURN anywhere** (rg over src/ = no files) | ❌ gap |
| Transport | **Zero WebSocket/WebRTC/SSE** in the repo (rg-verified); package.json carries no realtime lib | ❌ gap |
| Whot | Real 54-card deterministic engine (`whot-engine.ts`), ₦200 stake, 16 scripted AI matches — vs AI only | ⚠️ ready to host |
| Streaming | `StreamRow` board + viewers-as-crowd multiplier — a board, not media | ⚠️ gap |
| Friends / safety ops | Contacts app = NPCs; word wall only; no friends/blocks/reports/mute/ban | ❌ gap |
| Stack | Next 16.1.1 + React 19 + R3F 9.8 + Zustand 5, **Bun runtime**, Prisma 6 + SQLite (`db/custom.db`), Playwright | ✅ Bun WS is free |

**The honest headline:** M17's architecture was drawn multiplayer-correct (pure laws + thin relay + cursor sync + tiered identity). What's missing is the four physical layers: **transport, bodies, media, and money authority.** M24 adds those four without throwing anything away.

---

## 2. THE TEN GAPS TO CLOSE

1. **No realtime transport** — 12s polling; chat and presence are seconds-late.
2. **Players are rows, not bodies** — you never see another human walk Lokoja.
3. **No DMs / chat history / unread** — broadcast-only, poll-only.
4. **No actual voice or video** — the law exists, the machine doesn't.
5. **Client-authoritative money** — wallets live inside each client's save.
6. **No social graph** — no friends, blocks, reports.
7. **No real tables** — Whot has no matchmaking, no human seats.
8. **Streaming is a board** — no real broadcast media.
9. **No moderation ops** — no report queue, mute, ban, admin door.
10. **No network ops** — no TURN, no WS proxy config, no load harness, no live-table backup law.

---

## 3. TARGET ARCHITECTURE

```
Browser (Next.js 16 + React Three Fiber)
 ├─ HTTP   :3000/:3001  Next API routes — auth, cloud save, telemetry   [unchanged]
 ├─ WSS    /rt → :3010  REALTIME SERVER (Bun.serve native WebSocket)
 │     topics: global | street:<id> | dm:<a|b> | table:<id> | call:<id> | stream:<id>
 │     presence + room state in memory; durable rows → SQLite (WAL)
 │     THE RELAY DOCTRINE KEPT: server distributes + validates, never simulates
 └─ WebRTC media (P2P mesh, 1:1 / ≤4) — STUN public + coturn TURN self-host
       W6+: LiveKit OSS (self-host) for group video + broadcast ingest

SQLite (Prisma) — Accounts, CloudSaves, WalletRow+LedgerRow, FriendRow,
                  ChatRow, TableRow, ReportRow
```

### 3.1 Transport decision (my pick + the honest alternatives)

| Option | Verdict |
|---|---|
| **Bun native WebSocket (CHOSEN)** | Zero new deps; Bun's built-in pub/sub per topic; the repo is already Bun-lawful; one sibling process `server/realtime.ts` on :3010. Next 16 route handlers cannot hold a raw WS upgrade — a sibling process is the honest path. |
| socket.io / Colyseus | Heavy deps that would replace our own laws; rejected. |
| SSE | One-way; call signaling needs bidirectional at ms latency; rejected. |
| HTTP polling (today) | Stays as the **degraded-mode fallback lane** — the existing `/api/live/sync` is not deleted, it becomes the fallback. Nothing thrown away. |

### 3.2 Auth on the socket
Same bearer `Account.token` at the WS door — no new signup. Guests spectate (read-only) per the M17 identity law. Reconnect resumes from the seq cursor (the pattern already exists).

### 3.3 Bodies (movement sync)
Client posts pos @10Hz (street, x/z, heading) → server plausibility-checks (speed clamp) → fans out to the street topic. New renderer renders remote players reusing `HumanRig`; 100ms interpolation buffer. AOI = street/district topics (the 10 CHAOS districts) — bounded fan-out, bounded bandwidth.

### 3.4 Money authority (the W4 heart)
New `WalletRow` (balance, version) + `LedgerRow` (from, to, amount, kind, **idemKey UNIQUE**, fortress `chainHash` link, ts). Server commits atomically; both sides get a receipt event; the save mirrors the balance and the server wins at reconciliation. Idempotency keys kill double-spend. **The M13 money law enforced at the door:** kid/teen P2P money structurally refused.
**Honesty clause: in-game naira only, forever. Real P2P money transmission in Nigeria = CBN PSP-license territory; we do not touch it.**

### 3.5 Media
WebRTC 1:1 mesh (voice first, video adds a track), signaling rides the WS on `call:<id>`; public STUN + **coturn TURN self-host** (Nigeria mobile networks are CGNAT-heavy — TURN is mandatory for ~20–30% of pairs, stated plainly). The existing `voiceAllowed` law (adults, opt-in, same street) gets enforced at the server door too. Group video/stage = LiveKit OSS self-host from W6. Low device tier = audio-only default (heat/battery honesty).

### 3.6 Streaming ("Lokoja Live")
W7: broadcast your POV via WHIP ingest into LiveKit; viewers watch in the phone app; live chat rides `stream:<id>`; viewer count honors `crowdMult` (viewers-as-crowd law); tips move through the server ledger. VOD/clips honestly deferred (storage cost).

### 3.7 Real Whot tables
The existing deterministic engine is headless-pure — the same property that made it testable makes it hostable: run it **on the server** per table; clients send intents, server broadcasts states; 2–6 seats + spectators; stakes through the server ledger. The 16 AI matches remain for solo play.

---

## 4. LAWS THAT CARRY OVER VERBATIM (already written, now enforced at the server door)

Tiered chat (kid emotes / teen word wall / adult link-strip) · voice law (adult + opt-in + same street) · relay doctrine (distribute, never simulate) · presence TTL · seq-cursor resume · join-teleport postcard · two-key treasury · court-by-hash · viewers-as-crowd · kid wall at the API door.

---

## 5. M24 WAVES — each ships alone, the full closure every time

New m24 law suite + full battery + tsc/lint + SILK six gates fresh prod + fresh-context two-context E2E (eyeballed) + worklog + commit.

| Wave | Name | Ships |
|---|---|---|
| W0 | THE SEAMS | Realtime server skeleton, token auth, protocol schema, cursor resume, client `NetBus` (the single transport seam), polling-fallback law. No visible change. |
| W1 | THE BODIES | Real players as avatars in the 3D city (AOI, 10Hz, interpolation); co-presence becomes real people; player→player join-teleport. |
| W2 | THE WIRE | Live chat global/street, history, typing, unread badges; tier laws at the server door. |
| W3 | THE CONNECT | Friends / requests / blocks / reports; real Contacts tab; statuses; hang-out invites. |
| W4 | THE LEDGER | Server wallets; P2P transfer (amount → PIN → receipt); idempotency; limits; minor block; trade/ajo/assoc/tips re-pointed. |
| W5 | THE VOICE | 1:1 calls (ring/accept/decline, mute, hangup), TURN, same-street proximity voice. |
| W6 | THE FACE | Video 1:1 + PiP + device-tier gating; LiveKit self-host for group. |
| W7 | THE STAGE | Real broadcast: WHIP ingest, in-app viewing, live chat overlay, viewer crowd, tips. |
| W8 | THE TABLES | Server-authoritative Whot 2–6 seats + spectate; stakes via server ledger; community crowd events. |
| W9 | THE PROOF | 50-CCU bot harness soak; ops console (mute/kick/refund); backup law; deploy guide (nginx `/rt` WS proxy + coturn); NET gates locked into the battery. |

---

## 6. THE NET GATES (new permanent law suite, beside SILK)

- **N1** TTI ≤ 2.8s fresh prod (baseline 2.53s, +10% cap) · **N2** wire ≤ 372KB (338 +10%) · **N3** heap ≤ 40MB (32 +8)
- **N4** reconnect + resume ≤ 3s from cursor · **N5** ≤ 12 KB/s down/client @10Hz, 20 bodies per street
- **N6** voice first-audio ≤ 800ms direct / ≤ 1.5s via TURN · **N7** server tick ≤ 8ms @ 100 CCU bots; zero per-frame allocations in decode
- **N8** two-context laws: A moves → B sees ≤ 500ms; A sends ₦500 → B +₦500 **exactly once**; block kills DMs; chat survives reload; kid mics dark at the server door
- **N9** SQLite WAL + batched presence writes (DB heartbeat ≥ 15s apart) · **N10** WS down → silent fallback to the 12s lane, nothing hard-crashes

---

## 7. SAFETY, KIDS, AND NIGERIAN LAW

- **M13 wall extends structurally:** kids = emotes only, never voice/video/DM-from-strangers — enforced server-side, not just UI. Teens: no money tables (already the law).
- NDPR honesty: voice/video opt-in consent per session; no recordings by default; account data export/delete on request; chat retention window stated in-app.
- Moderation is a permanent ops cost once real humans chat: report queue + mute/ban + the word wall/link law at the door. Not optional, budgeted in W3/W9.

---

## 8. HONEST RISKS

1. **Deploy surface:** a second process must be proxied (`/rt` WS upgrade). If the preview box exposes only :3001, W0 gates on proxy config — dev unaffected (:3010 direct). Stated first because it is the only infra unknown.
2. **SQLite contention** under many heartbeats — WAL + batched writes; Postgres swap triggered honestly at ~200 CCU, not before.
3. **TURN needs UDP egress** — coturn TCP/443 fallback exists; worst case is relayed media (CPU cost, capped rooms).
4. **Bun WS API** — pinned Bun version + smoke suite.
5. **Low-end phones + video** = heat/battery — tier gating, default off.
6. **Scope:** ten waves ≈ weeks of disciplined shipping; every wave lands value alone, nothing big-bangs.

## 9. WHAT I WILL NOT BUILD (now)

No code (the order). No real-money rails (CBN). No SaaS lock-in by default. No email/phone signup requirement (handle + PIN stays; contact stays nullable — the M13 law).

## 10. DECISION DEFAULTS (veto-able, nothing blocks)

Bun-native WS (no socket.io) · SQLite now → Postgres at the 200-CCU trigger · coturn self-host · LiveKit OSS at W6 · guests spectate-only (unchanged) · in-game naira only, forever.
