# CHARLIE 25 — NATION-WIRE SPLIT MAP (pre-edit, read from disk)

Source: `mini-services/nation-wire/index.ts` — 2,479 lines (2,480 with trailing newline), 59 `socket.on` handlers, 1 `io.use`, 1 `io.on('connection')`. Own package.json (socket.io 4.8.4 dep, @types/bun dev), own tsconfig (strict, verbatimModuleSyntax, noUnusedLocals **false**), excluded from main tsc.

## 0. Baseline (recorded BEFORE any edit)

`bunx tsc --noEmit` → **68 errors total**:
- **11 in index.ts** (see baseline-index-errors.txt): 1×TS2307 socket.io (dep not installed here), 2×TS2322 LedgerKind ('refuel'|'repair' inside `theMove` at 1062/1066), 3×TS7006 (io.use socket/next 1127×2, io.on('connection') socket 1149), 4×TS2345 Bun process.on signals (2469/2470/2474/2477), 1×TS2339 `.stack` (2475).
- 57 in law-vault src files compiled transitively: nation-sim 32, fortress 19, live 3, device 3.
GATE: post-split total must be ≤ 68; wire-file errors ≤ 11 (same message set, relocated lines/files).

## 1. Bootstrap & module-level state (lines)

- 48–51 imports: node:http, node:crypto (scryptSync/timingSafeEqual), socket.io (Server, IoSocket), bun:sqlite (Database).
- 54–147 law-vault imports (verbatim doctrine, zero copies): live (sanitizeChat/canLive/emoteById/crowdMult/PRESENCE_TTL_MS/LiveBand/LiveIdentity), stage (11 syms), socialgraph (10), ledger (6), voice (10), bodies (6), profile (DEFAULT_LOOK_JSON), wheels (17).
- 149–179 config: PORT (env WIRE_PORT ?? 3003), DB_PATH (env WIRE_DB ?? /home/z/my-project/db/custom.db), RESUME_CAP=100, CAPS (chat 5/10s, emote 6/10s, typing 3/1s, presence 1/2s, resume 1/1s, social 8/10s, wallet 4/10s, call 24/10s, pos 10Hz×2.4/1s from POS_TICK_MS, veh 12Hz×2.4/1s from VEH_TICK_MS, stage 4/10s, board 8/10s, patch 4/10s), DM_HISTORY_CAP=100.
- 183–185 db open + PRAGMA journal_mode=WAL + busy_timeout=5000.
- 547 `presence` Map<handle,WirePresence>; 552 `lastMoment` Map; 705 `calls` Map; 794 `accountBuckets` Map; 823 `relocateAt` Map; 866–867 `stages` + `stageIdByHost` Maps.
- Timers: 833–840 "eyes sweep" 60s (accountBuckets/relocateAt GC, .unref()); 2453 presence sweep 15s → `sweepPresence(io)` (.unref()).
- 1103–1112 httpServer + /health door (presence.size, headSeq(), calls.size); 1114–1125 io = new Server (path '/socket.io', cors *, ping 60s/25s, maxHttpBufferSize 4096); 1127–1134 io.use identity middleware; 1149 io.on('connection').

## 2. Shared helpers → dependency map (def @ line → users @ lines → new home)

| helper | def | users | new home |
|---|---|---|---|
| bandOf/BANDS | 190 | 1131 (io.use only) | identity.ts |
| accountByToken + AccountRow | 200 | 1129 (io.use only) | identity.ts (closure) |
| accountFullByToken + AccountFullRow | 219 | 1922 1943 2343 (all purse) | economy.ts |
| pinVerifies | 233 | 1929 1951 2354 | economy.ts |
| persistEvent | 249 | 736(endCall) 1086(deliverReceipt) 1627 1647 1672 1875 2324 | context.ts |
| headSeq | 260 | 1107 1159 1715 2456 | context.ts |
| eventsSince | 265 | 1715 (resume only) | transport.ts |
| profileOf | 351 | 367 (freshPresence only) | world.ts |
| freshPresence | 366 | 1170 1211 (hello/presence) | world.ts |
| vehicleRowOf | 396 | 1285 1475 (hello/patch) | world.ts |
| vehiclePersist | 429 | 626 1283 1312 1349 1370 1554 1587 2443 | context.ts |
| plateOwnerOf | 444 | 1277 1477 | world.ts |
| crewKeyOf | 459 | 606 607 (crewZoneOk only) | transport.ts |
| pushCarCrew | 469 | 1429 1453 (board/unboard) | world.ts |
| broadcastParked | 498 | 627 1371 2444 | context.ts |
| dropCrew | 519 | 625 1282 1369 2442 | context.ts |
| snapBodyToCar | 594 | 527(dropCrew) 1376 1459 | context.ts |
| WALK_MAX_SPEED + clampBodyStep | 563/571 | 1240 (pos only) | world.ts |
| crewZoneOk | 605 | 2135 2151 2166 (pv doors) | transport.ts |
| sweepPresence | 612 | 2453 (interval) | transport.ts (export; index keeps the setInterval) |
| rosterFor | 640 | 763 765 (broadcastRoster) 1187 (hello ack) | context.ts |
| relayPos | 681 | 1250 (pos only) | world.ts |
| callOfHandle | 707 | 1989 1990 2433 | transport.ts |
| pushCall | 712 | 733 734 (endCall) 1997 2010 2045 2060 2074 2093 | context.ts (endCall lives there) |
| pushPv | 720 | 2138 2154 2169 | transport.ts |
| endCall | 729 | 634 2020 2031 2434 | context.ts (sweep+disconnect+call doors share it) |
| iceServersFor | 746 | 2011 (call:accept) | transport.ts |
| broadcastRoster | 760 | 636 1185 1213 1313 1377 1393 1428 1460 1493 2447 | context.ts |
| rateKeeper | 771 | 1151 (wrapper) | context.ts |
| accountBuckets + accountAllow | 794 | 833(sweep) 1155 | context.ts |
| RELOCATE_WINDOW + relocateAt + relocateGate | 822/823/824 | 828–839(sweep) 1292 | context.ts (RELOCATE_RADIUS=60 → world.ts, handler-only) |
| stageRow | 869 | 895 (endStage only) | context.ts |
| stageBoard | 885 | 2389 (stage:list) | world.ts |
| endStage | 891 | 2382 2400 (stage:end + disconnect) | context.ts |
| pushViewers | 900 | 2229 2245 2406 2421 | context.ts |
| mintStageId | 904 | 2190 (stage:start) | world.ts |
| edgeGet | 918 | 686 1353 1414 1606 1610 1611 1667 1729 1730 1757 1773 1784 1810 1871 1991 | context.ts (W+S+T) |
| edgePut | 925 | 1737 1738 1742 1743 1760 1761 1798 | social.ts |
| edgeDel | 931 | 1775 1776 1785 1786 1799 1811 | social.ts |
| graphFor + FriendRowT | 935/910 | 1721; FriendRowT also 921 (edgeGet) | graphFor → social.ts; FriendRowT → context.ts (shared shape) |
| accountExists | 954 | 1669 1733 1873 1987 | context.ts |
| accountBand | 958 | 1956 1986 2359 | context.ts |
| walletGet/WalletT | 979/966 | theMove ×6 + 1543 1556 1577 1589 1894 1913 1930 1934 1955 1960 1965 2358 2360 2366 | economy.ts |
| ledgerTail | 986 | 1039 1049 1062 1074 (theMove) | economy.ts |
| dayTransferred | 995 | 1895 1960 2360 | economy.ts |
| dayDeposited | 1005 | 1909 | economy.ts |
| recentLedger | 1012 | 1895 | economy.ts |
| ledgerByIdem + LedgerT | 1019/967 | 1033 1541 1575 1954 2357 | economy.ts |
| theMove | 1025 | 1552 1585 1912 1933 1963 2363 (ALL purse doors) | economy.ts |
| deliverTransferReceipt | 1083 | 1555 1588 1964 2364 (ALL economy) | economy.ts |
| pushSocial | 1096 | 1739 1744 1762 1879 | social.ts |
| identityOf | 1136 | 1150 (wrapper) | context.ts |
| handshakeTokenOf | 1141 | 1922 1943 2343 | economy.ts |
| dmRoom | 1145 | 1679 1696 1697 1878 | social.ts |

## 3. The 59 socket.on handlers → domain files (verbatim order inside each file)

**world.ts — 18** (world-sync, plates, wheels+bodies lanes, stage board):
hello(1162), presence(1191), pos(1223), vehicle:hello(1260), vehicle:pos(1323), vehicle:bye(1364), vehicle:seats(1386), vehicle:board(1402), vehicle:unboard(1440), vehicle:patch(1469), vehicle:parked(1502), where(1599), stage:start(2184), stage:watch(2214), stage:leave(2236), stage:chat(2315), stage:end(2375), stage:list(2388)

**economy.ts — 7** (purse: wallet/ledger/tip — theMove, its replay law and its receipt lane are economy-only per the census):
wallet(1888), wallet:deposit(1898), wallet:withdraw(1919), wallet:transfer(1940), vehicle:refuel(1531), vehicle:repair(1567), stage:tip(2340)

**social.ts — 15** (chat lanes + the connect graph):
chat(1620), emote(1639), dm(1660), dm:open(1691), typing(1701), social:list(1719), social:add(1724), social:accept(1752), social:decline(1769), social:remove(1780), social:block(1790), social:unblock(1806), social:report(1815), social:dms(1830), social:invite(1865)

**transport.ts — 19** (cursor replay, voice signaling incl. the stage mesh envelope doors, heartbeat/disconnect plumbing):
resume(1710), call:ring(1978), call:accept(2001), call:decline(2014), call:hangup(2024), call:offer(2035), call:answer(2049), call:ice(2064), call:cam(2083), voice:join(2100), voice:leave(2113), pv:offer(2123), pv:answer(2142), pv:ice(2158), stage:offer(2258), stage:answer(2273), stage:ice(2288), ping(2174), disconnect(2392)

**identity.ts — 0 handlers** (the door itself): io.use middleware(1127) + bandOf/BANDS + accountByToken.

Boundary judgment (mandate allows it — "the map decides"): vehicle:refuel/vehicle:repair are wallet-capped ledger moves over car state → economy (theMove/receipt lane are economy-exclusive per census); stage:offer/answer/ice are sealed-envelope voice signaling (sdpOk/iceOk, W7's own envelope laws) → transport; the rest of stage:* stays world (broadcast registry domain). hello/presence stay world (street rooms + roster = world sync).

## 4. Cross-handler dependencies (which helper reads/writes which state)

- presence: read/written by world (hello/presence/pos/vehicle:*/where), transport (sweep, pv, disconnect, call:ring targetOnline), economy (deliverTransferReceipt), context (rosterFor/broadcastRoster/crewKeyOf via transport/pushCall/endCall/dropCrew).
- lastMoment: world (pos set, freshPresence read), transport (disconnect set).
- calls: transport (ring/set, all doors), context (endCall/pushCall), index health door (size).
- stages/stageIdByHost: world (start/watch/leave/chat/end/list), transport (offer/answer/ice, disconnect), economy (stage:tip reads stages).
- accountBuckets/relocateAt: context (accountAllow/relocateGate + 60s eyes sweep).
- db: every domain via ctx.db (account/presence face/vehicle/ledger/friend/event SQL — all statements byte-identical, moved with their helpers).

## 5. Mechanical adaptations (declared, zero logic changes)

1. Per-connection wrapper state (identity, sockAllow/allow, claimed, currentStreet, wire:global join, welcome emit) stays in index.ts's io.on('connection'); a `WireConn` object (context.ts) carries them into the four handler registers — `socket/identity/allow/claimed` are destructured at each register's top so handler BODIES stay byte-verbatim; only `currentStreet` is reached as `conn.currentStreet` inside hello + presence (it is the one per-connection value handlers MUTATE: hello writes it, presence reads+writes it). claimed is never reassigned after init (verified: single assignment at 1156).
2. `register(io, ctx)` gains a third param `conn: WireConn` (identity's register keeps `(io, ctx)` — the middleware is pre-connection). Deviation from the mandate's two-param sketch is forced by the per-connection closures; documented here.
3. socket.io is imported ONCE (context.ts) and re-exported (`export { Server }`, `export type { Socket as IoSocket }`); handler files import Server/IoSocket from ../context — keeps the single TS2307 site count identical to the monolith (deps uninstalled in this service).
4. Module-level helpers become either ctx methods (cross-domain, see §2) or closures inside their single domain's register — bodies byte-verbatim either way.
5. Registration ORDER: file-internal order is the original relative order per §3; the global interleaving (world→social→transport-resume→social→economy→transport-call→world-stage→economy-tip→transport-disconnect) flattens to world→social→economy→transport called once each inside the connection wrapper. Every event name is registered exactly once (verified: 59 unique), so socket.io registration order across distinct events has no behavioral effect; identity's io.use is still registered before io.on('connection').
6. The 60s eyes sweep moves with accountBuckets/relocateAt into makeCtx (same module-eval moment: index.ts calls makeCtx at top level, before server creation — identical to the monolith's module-level setInterval). The 15s presence sweep stays in index.ts (`setInterval(() => sweepPresence(io, ctx), 15_000).unref()`).
7. SQL statements byte-identical (moved with their helpers); CAPS table byte-identical in context.ts.

## 6. PH2.5-NOTE deferrals (suspected bugs found while mapping — commented in code, left verbatim)

1. `theMove` kind union includes 'refuel'|'repair' but ledger.ts's LedgerKind does not — TS2322 ×2 (baseline index.ts:1062/1066). Runtime-fine (SQLite takes the string); real fix belongs in src/game/systems/ledger.ts (out of scope). → economy.ts.
2. `wallet:withdraw` passes `transferredToday: 0` while `wallet:transfer` passes `dayTransferred()` — the documented day-cap asymmetry debt (worklog Task 3+4+5+6). → economy.ts.
3. `stage:answer` guard `if (!claimed && identity.band !== 'guest')` is vacuous (!claimed implies band==='guest', so it can never fire); the mesh answer path for guest eyes is the designed behavior, so the dead check just stays. → transport.ts.
4. `social:dms` is an unthrottled DB door (no allow() — the exact shape the account eye was added to `wallet` for). → social.ts.
5. Unused verbatim imports kept (noUnusedLocals is false): PRESENCE_TTL_MS (context.ts), crowdMult (social.ts), stageTitleOk + StageWhy (world.ts) — import-only hits at lines 58/59/74/76.
6. Cosmetic, noted only: vehicle doors refuse with two different guest strings ('guest-mic-dark' on hello/pos/bye vs 'guest-dark' on board/unboard/patch/parked/refuel/repair) — both honest refusals, left as-is.
