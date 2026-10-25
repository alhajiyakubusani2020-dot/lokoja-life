module.exports = [
"[project]/src/components/game/screens/phone/LiveApp.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LiveApp",
    ()=>LiveApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * LOKOJA LIFE — LiveApp (M17: THE LIVE NATION + M21: THE LIVING ROOM)
 * ------------------------------------------------------------------
 * The phone's live wire: the street roster, the tiered chat (kid
 * emotes / teen wall / adult links-law), the join-postcard, the
 * stream board (viewers-as-crowd), the co-op unions (sealed treasuries,
 * the two-key law, the Market Union court) and the real-player ajo
 * circles (the ladder, the panic, the court guarantee).
 *
 * M21 — THE ROOM sits pinned at the top: the REAL roster of whoever
 * is standing on your street right now (presence TTL honored), the
 * honest empty state, the SIM crowd line (labeled, muted, separate —
 * the ONLY sanctioned way the NPC crowd shows), a room-scoped mic
 * riding the SAME liveSendChat/law path, and — adults only — the
 * SPRAY: real ₦ through the store's honest engine, broadcast on the
 * room's street channel. THE PRIME LAW: this screen never fakes a
 * person; the roster is real presence, the crowd is clearly (sim).
 *
 * This UI never simulates: every move rides the store's live actions,
 * the relay books the truth, and the local engines move the local
 * naira. THE IDENTITY LAW shows itself here: an unclaimed guest sees
 * the nation but the mic stays dark until claim.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/stagenet.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/stage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/liveRoom.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
const TABS = [
    {
        key: 'street',
        label: 'Street'
    },
    {
        key: 'streams',
        label: 'Live'
    },
    {
        key: 'union',
        label: 'Union'
    },
    {
        key: 'ajo',
        label: 'Ajo'
    }
];
/** the spray notes the room offers — every one a lawful ₦100 multiple inside the bounds */ const SPRAY_TIERS = [
    1,
    5,
    10,
    50
].map((k)=>k * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPRAY_STEP"]);
function LiveApp() {
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('street');
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [roomDraft, setRoomDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [sprayAmt, setSprayAmt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(SPRAY_TIERS[0] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPRAY_MIN"]);
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.player);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.world);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.account);
    const live = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.live);
    const wire = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveWire);
    const liveSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveSync);
    const liveSendChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveSendChat);
    const liveSendEmote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveSendEmote);
    const liveAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveAction);
    const liveShareJoin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveShareJoin);
    const liveToggleVoice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.liveToggleVoice);
    const removeMoney = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.removeMoney);
    const addMoney = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.addMoney);
    const nationSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"])((s)=>s.nationSnapshot);
    const claimed = account.linked && !!account.token;
    const band = account.ageBand ?? 'adult';
    const sync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const res = await liveSync();
        if (!res.ok && res.why !== 'unclaimed' && res.why !== 'offline — the nation waits') {
            setNotice(res.why ?? null);
        }
    }, [
        liveSync
    ]);
    // the heartbeat: sync on open + every 12s while the app is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!claimed) return;
        const first = setTimeout(()=>{
            void sync();
        }, 0);
        const t = setInterval(()=>{
            void sync();
        }, 12_000);
        return ()=>{
            clearTimeout(first);
            clearInterval(t);
        };
    }, [
        claimed,
        sync
    ]);
    if (!player || !world) return null;
    const roster = (wire?.roster ?? []).filter((r)=>r.handle !== account.handle);
    const events = (wire?.events ?? []).filter((e)=>e.kind === 'chat' || e.kind === 'emote' || e.kind === 'join' || e.kind === 'stream' || e.kind === 'court');
    /* ------------------ M21 — THE ROOM (who dey here NOW) ------------------
   * keyed by the SAME location id the presence ping sends, TTL honored
   * by the pure law, refreshed by the SAME 12s heartbeat — zero new
   * timers. The sim crowd is a separate, labeled number. */ const locId = world.currentLocation;
    const locName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][locId]?.name ?? locId;
    const roomChannelId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roomChannel"])(locId);
    const nowMs = Date.now();
    const roomPresences = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireToPresences"])(wire?.roster ?? [], nowMs);
    const roomAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roomRoster"])(roomPresences, locId, nowMs);
    const roomOthers = roomAll.filter((r)=>r.handle !== account.handle);
    const roomEvents = (wire?.events ?? []).filter((e)=>e.channel === roomChannelId && (e.kind === 'chat' || e.kind === 'emote'));
    const simCrowd = nationSnapshot?.districts.find((d)=>d.id === locId)?.pop ?? 0;
    const sprayOk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sprayAllowed"])({
        handle: account.handle,
        band
    }, player.cash);
    const say = (msg)=>{
        setNotice(msg);
        setTimeout(()=>setNotice(null), 3200);
    };
    const send = async ()=>{
        if (!draft.trim() || busy) return;
        setBusy(true);
        const res = await liveSendChat(draft);
        setBusy(false);
        if (!res.ok) say(res.why === 'word-wall' ? 'The Union moderators no gree that word.' : res.why === 'too-long' ? 'Too long — shorten am.' : res.why ?? 'no gree');
        else setDraft('');
    };
    // the ROOM mic — the SAME liveSendChat door, the room's street channel;
    // the M17 tier laws ride inside the action (never bypassed)
    const sendRoom = async ()=>{
        if (!roomDraft.trim() || busy) return;
        setBusy(true);
        const res = await liveSendChat(roomDraft, roomChannelId);
        setBusy(false);
        if (!res.ok) say(res.why === 'word-wall' ? 'The Union moderators no gree that word.' : res.why === 'too-long' ? 'Too long — shorten am.' : res.why ?? 'no gree');
        else setRoomDraft('');
    };
    // THE SPRAY (adult money table): real ₦ through the store's honest
    // engine, the moment broadcast on the room channel. Pay → broadcast;
    // a wire that refuses gets its naira back — no unbacked broadcast.
    const doSpray = async ()=>{
        if (!claimed || busy) return;
        if (!sprayOk) {
            say('Money spray na adult table — and your pocket must reach ₦100.');
            return;
        }
        if (player.cash < sprayAmt) {
            say('Pocket no reach that note — pick smaller.');
            return;
        }
        const spray = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sprayEvent"])(account.handle ?? 'me', locId, sprayAmt, world.day);
        if (!spray.ok) {
            say(spray.why === 'not-multiple' ? 'Spray na ₦100 notes only.' : 'That spray no fit the room law.');
            return;
        }
        setBusy(true);
        const paid = removeMoney(sprayAmt, {
            label: `money spray — ${locName}`,
            category: 'fun'
        });
        if (!paid) {
            setBusy(false);
            say('Pocket no reach — the spray no pass.');
            return;
        }
        const res = await liveSendChat(spray.text, spray.channel);
        setBusy(false);
        if (!res.ok) {
            addMoney(sprayAmt, {
                label: 'spray refund — the wire no gree',
                category: 'fun'
            });
            say(`The wire no gree — ₦${sprayAmt.toLocaleString('en-US')} don return to your pocket.`);
            return;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().notify({
            icon: '💰',
            text: `₦${sprayAmt.toLocaleString('en-US')} spray — the room see am!`,
            tone: 'good'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "data-testid": "live-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-4 pb-2 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[15px] font-black leading-tight",
                                children: "Live Nation"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                children: claimed ? `${roster.length + 1} walker${roster.length ? 's' : ''} dey the wire` : 'Spectator view — claim your name to talk'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "live-voice",
                        onClick: ()=>{
                            liveToggleVoice();
                        },
                        className: `lko-press rounded-full px-2.5 py-1 text-[10px] font-extrabold ${live?.voiceOn ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.06] text-[var(--lko-ink-soft)]'}`,
                        "aria-label": "Toggle proximity voice (adults only)",
                        children: [
                            "🎙️ ",
                            live?.voiceOn ? 'ON' : 'OFF'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-4 mb-2 rounded-2xl border border-black/[0.06] bg-white p-3",
                "data-testid": "live-room",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-baseline justify-between gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[12.5px] font-black",
                                children: [
                                    "📍 ",
                                    locName,
                                    " — who dey here now"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "shrink-0 text-[9.5px] font-extrabold uppercase tracking-[0.06em] text-[var(--lko-ink-soft)]",
                                children: roomOthers.length > 0 ? `${roomOthers.length} real walker${roomOthers.length > 1 ? 's' : ''}` : 'real presence'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    roomOthers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                        "data-testid": "live-room-empty",
                        children: "Just you here now — real players show up here when dem enter your street."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mt-1.5 max-h-24 space-y-1 overflow-y-auto",
                        "data-testid": "live-room-roster",
                        children: roomOthers.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center justify-between text-[12px] font-bold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            r.band === 'kid' ? '🧒' : r.band === 'teen' ? '🧑' : '🧍',
                                            " ",
                                            r.handle
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 206,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                        children: r.status
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, r.handle, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 205,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    roomEvents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 space-y-1",
                        "data-testid": "live-room-feed",
                        children: roomEvents.slice(-3).map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-lg bg-black/[0.03] px-2 py-1 text-[10.5px] font-semibold",
                                children: e.kind === 'emote' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: e.actor
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 218,
                                            columnNumber: 27
                                        }, this),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": true,
                                            children: String(e.payload.glyph ?? '👋')
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 218,
                                            columnNumber: 44
                                        }, this),
                                        " ",
                                        String(e.payload.phrase ?? '')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 218,
                                    columnNumber: 21
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: e.actor
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 219,
                                            columnNumber: 27
                                        }, this),
                                        ": ",
                                        String(e.payload.text ?? '')
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 219,
                                    columnNumber: 21
                                }, this)
                            }, e.seq, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 216,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 214,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                        "data-testid": "live-room-sim",
                        children: [
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$liveRoom$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crowdNote"])(simCrowd),
                            " · the roster na real people — the crowd na simulation."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    claimed && (band === 'teen' || band === 'adult') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                "data-testid": "live-room-composer",
                                value: roomDraft,
                                onChange: (e)=>setRoomDraft(e.target.value),
                                onKeyDown: (e)=>{
                                    if (e.key === 'Enter') void sendRoom();
                                },
                                maxLength: band === 'teen' ? 140 : 280,
                                placeholder: band === 'teen' ? 'Talk to the room (moderated, 140)' : 'Talk to the room (no links — the law)',
                                className: "min-w-0 flex-1 rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none",
                                "aria-label": "Room chat message"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "live-room-send",
                                onClick: ()=>void sendRoom(),
                                disabled: busy,
                                className: "lko-press rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[11px] font-extrabold text-white",
                                children: "Send"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 243,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this) : claimed && band === 'kid' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 grid grid-cols-6 gap-1",
                        "data-testid": "live-room-emotes",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMOTE_LIBRARY"].map((em)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void liveSendEmote(em.id, roomChannelId),
                                className: "lko-press rounded-lg bg-[var(--lko-green-soft)] py-1 text-center text-[14px]",
                                "aria-label": `Send room emote: ${em.phrase}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "aria-hidden": true,
                                    children: em.glyph
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 254,
                                    columnNumber: 17
                                }, this)
                            }, em.id, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 251,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 249,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "🎤 The room mic is dark — claim your name to talk here."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this),
                    claimed && band === 'adult' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 border-t border-black/[0.05] pt-2",
                        "data-testid": "live-room-spray",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-black uppercase tracking-[0.06em] text-[var(--lko-ink-soft)]",
                                        children: "🧺 Spray — real ₦, the room sees am"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 266,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1",
                                        children: SPRAY_TIERS.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSprayAmt(a),
                                                "aria-label": `Spray amount ₦${a}`,
                                                className: `lko-press rounded-lg px-1.5 py-0.5 text-[9.5px] font-extrabold ${sprayAmt === a ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`,
                                                children: a >= 1000 ? `₦${a / 1000}k` : `₦${a}`
                                            }, a, false, {
                                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                lineNumber: 269,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "live-room-spray-fire",
                                disabled: busy || !sprayOk || player.cash < sprayAmt,
                                onClick: ()=>void doSpray(),
                                title: player.cash < sprayAmt ? 'Your pocket no reach this note — pick smaller' : 'Real naira leaves your pocket — the broadcast carries the truth',
                                className: "lko-press mt-1.5 w-full rounded-xl bg-[var(--lko-amber)] py-1.5 text-[10.5px] font-black text-[#1a1e18] disabled:opacity-40",
                                children: [
                                    "Spray ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(sprayAmt),
                                    " for ",
                                    locName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 276,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-1 px-4 pb-2",
                children: TABS.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(t.key),
                        className: `lko-press flex-1 rounded-xl py-1.5 text-[11px] font-extrabold ${tab === t.key ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]'}`,
                        "aria-label": `Live tab: ${t.label}`,
                        children: t.label
                    }, t.key, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 292,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 290,
                columnNumber: 7
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mx-4 mb-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-bold text-amber-800",
                role: "status",
                children: notice
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 304,
                columnNumber: 9
            }, this),
            !claimed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-4 mb-2 rounded-2xl border border-dashed border-[var(--lko-green)]/40 bg-[var(--lko-green-soft)]/60 p-3",
                "data-testid": "live-spectate",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[12px] font-extrabold",
                        children: "👁️ Spectator view"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-[11px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                        children: "The nation moves in front of you — but the mic stays dark and the money tables stay shut until you claim your name. No new signup: your name, one PIN."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 308,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto px-4 pb-4",
                children: [
                    tab === 'street' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                                "data-testid": "live-roster",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                                        children: "Who dey around"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 322,
                                        columnNumber: 15
                                    }, this),
                                    roster.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                        children: "The wire dey quiet — nobody else don claim yet."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 324,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "mt-1 space-y-1",
                                        children: roster.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "flex items-center justify-between text-[12px] font-bold",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            r.band === 'kid' ? '🧒' : r.band === 'teen' ? '🧑' : '🧍',
                                                            " ",
                                                            r.handle
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                                        children: [
                                                            r.status,
                                                            " · ",
                                                            r.street
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, r.handle, true, {
                                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                lineNumber: 328,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 326,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 321,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5",
                                "data-testid": "live-feed",
                                children: [
                                    events.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                        children: "No talk yet — be the first voice on the wire."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 340,
                                        columnNumber: 17
                                    }, this),
                                    events.slice(-24).map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-2xl border border-black/[0.06] bg-white px-3 py-1.5 text-[12px] font-semibold",
                                            children: [
                                                e.kind === 'emote' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: e.actor
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 344,
                                                            columnNumber: 48
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            "aria-hidden": true,
                                                            children: String(e.payload.glyph ?? '👋')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 344,
                                                            columnNumber: 65
                                                        }, this),
                                                        " ",
                                                        String(e.payload.phrase ?? '')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                    lineNumber: 344,
                                                    columnNumber: 42
                                                }, this),
                                                e.kind === 'chat' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: e.actor
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 345,
                                                            columnNumber: 47
                                                        }, this),
                                                        ": ",
                                                        String(e.payload.text ?? '')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 41
                                                }, this),
                                                e.kind === 'join' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "📍 ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: e.actor
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 50
                                                        }, this),
                                                        " share ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: String(e.payload.street ?? '')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 73
                                                        }, this),
                                                        " — the postcard dey fly (free arrival)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 41
                                                }, this),
                                                e.kind === 'stream' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "📡 ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: e.actor
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 347,
                                                            columnNumber: 52
                                                        }, this),
                                                        " ",
                                                        e.payload.live === false ? 'close' : 'open',
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: String(e.payload.title ?? 'a stream')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 347,
                                                            columnNumber: 115
                                                        }, this),
                                                        typeof e.payload.viewers === 'number' ? ` — ${e.payload.viewers} watched` : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 43
                                                }, this),
                                                e.kind === 'court' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "⚖️ ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                            children: "Market Union Court"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 51
                                                        }, this),
                                                        ": ",
                                                        String(e.payload.verdict ?? e.payload.defaulter ?? 'verdict'),
                                                        " ",
                                                        e.payload.fine ? `— fine ₦${Number(e.payload.fine).toLocaleString()}` : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                    lineNumber: 348,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, e.seq, true, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 343,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 338,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                                children: claimed && (band === 'teen' || band === 'adult') ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            "data-testid": "live-composer",
                                            value: draft,
                                            onChange: (e)=>setDraft(e.target.value),
                                            onKeyDown: (e)=>{
                                                if (e.key === 'Enter') void send();
                                            },
                                            maxLength: band === 'teen' ? 140 : 280,
                                            placeholder: band === 'teen' ? 'Talk (moderated, 140)' : 'Talk (no links — the law)',
                                            className: "min-w-0 flex-1 rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none",
                                            "aria-label": "Chat message"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 357,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": "live-send",
                                            onClick: ()=>void send(),
                                            disabled: busy,
                                            className: "lko-press rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[11px] font-extrabold text-white",
                                            children: "Send"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 367,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 356,
                                    columnNumber: 17
                                }, this) : claimed && band === 'kid' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                                            children: "Your words — the shield lexicon"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 374,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-4 gap-1.5",
                                            "data-testid": "live-emote-grid",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EMOTE_LIBRARY"].map((em)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>void liveSendEmote(em.id),
                                                    className: "lko-press rounded-xl bg-[var(--lko-green-soft)] px-1 py-1.5 text-center",
                                                    "aria-label": `Send emote: ${em.phrase}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "block text-[16px]",
                                                            "aria-hidden": true,
                                                            children: em.glyph
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 379,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "block text-[8.5px] font-extrabold text-[var(--lko-green-deep)]",
                                                            children: em.phrase
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                            lineNumber: 380,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, em.id, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 375,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 373,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                    children: "🎤 The mic is dark — claim your name to talk."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 386,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 354,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(JoinCard, {
                                onShare: async ()=>{
                                    const { shareTeleport } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                    const res = await shareTeleport();
                                    if (!res.ok) {
                                        say(res.why ?? 'no gree');
                                        return;
                                    }
                                    const url = res.url ?? '';
                                    const code = url.split('/t/')[1]?.split(/[?#]/)[0] ?? '';
                                    if (!code) {
                                        say('postcard no mint');
                                        return;
                                    }
                                    const j = await liveShareJoin(code);
                                    if (j.ok) say('📍 Your street don enter the wire — arrival na free!');
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 391,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 319,
                        columnNumber: 11
                    }, this),
                    tab === 'street' ? null : tab === 'streams' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StreamsTab, {
                        claimed: claimed,
                        onNotice: say,
                        band: band,
                        myHandle: account.handle
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 406,
                        columnNumber: 11
                    }, this),
                    tab === 'union' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UnionTab, {
                        liveAction: liveAction,
                        claimed: claimed,
                        band: band,
                        onNotice: say,
                        assocId: live?.assocId ?? null,
                        day: world.day
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 411,
                        columnNumber: 11
                    }, this),
                    tab === 'ajo' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AjoTab, {
                        liveAction: liveAction,
                        claimed: claimed,
                        band: band,
                        onNotice: say,
                        circles: live?.circles ?? [],
                        day: world.day,
                        cash: player.cash
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 417,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
/* ------------------------------ the join card ------------------------------ */ function JoinCard({ onShare }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        "data-testid": "live-join-share",
        onClick: onShare,
        className: "lko-press w-full rounded-2xl border border-[var(--lko-green)]/30 bg-[var(--lko-green-soft)] p-3 text-left",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[12px] font-black",
                children: "📍 Call the nation to your street"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 434,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: "Your postcard dey fly on the live wire — anybody wey click go land for your street FREE (no fare, no bus)."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 435,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 429,
        columnNumber: 5
    }, this);
}
/* ------------------------- the streams tab (W9 THE STAGE) ------------------- */ const STAGE_WHY_TEXT = {
    'guest-mic-dark': 'Claim your name first — guests watch, never talk.',
    'stage-adults-only': 'The stage na adult land.',
    'bad-title': 'Give the stage a name (1–64 letters).',
    'stage-live-already': 'You already dey live.',
    'stage-not-live': 'That stage don end.',
    'minors-no-money': 'The purse na adult land.',
    'bad-pin': 'PIN no match.',
    'insufficient': 'Purse no carry that amount.',
    'too-fast': 'Slow down small.',
    'self': 'No tip yourself.',
    'bad-stage': 'Which stage be that?',
    'stage-no-canvas': 'The world no dey render — no POV to show.',
    'stage-ended': 'The stage don end.',
    'stage-dark': 'The media house dey dark — try again.',
    'no-such-paddy': 'That paddy no exist.',
    'minors-collect-nothing': 'Minors no dey collect money.'
};
function stageWhy(why) {
    if (!why) return 'no gree';
    if (STAGE_WHY_TEXT[why]) return STAGE_WHY_TEXT[why];
    if (why.startsWith('stage-dark')) return 'The media house dey dark — try again.';
    return why;
}
function StageVideo({ remoteStream, muted, videoRef }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const v = videoRef.current;
        if (!v) return;
        if (remoteStream) {
            if (v.srcObject !== remoteStream) v.srcObject = remoteStream;
            v.play().catch(()=>{});
        } else {
            v.srcObject = null;
        }
    }, [
        remoteStream,
        videoRef
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const v = videoRef.current;
        if (v) v.muted = muted;
    }, [
        muted,
        videoRef
    ]);
    if (!remoteStream) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-28 items-center justify-center rounded-2xl bg-black/85",
            "data-testid": "stage-video-dark",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-black uppercase tracking-[0.14em] text-white/70",
                children: "connecting to the stage…"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 492,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
            lineNumber: 491,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "overflow-hidden rounded-2xl bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            ref: videoRef,
            autoPlay: true,
            playsInline: true,
            muted: muted,
            "data-testid": "stage-video",
            className: "h-40 w-full bg-black object-contain"
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
            lineNumber: 498,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 497,
        columnNumber: 5
    }, this);
}
function StageChatRoom({ streamId, claimed, band, onNotice }) {
    const feed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWireStore"])((s)=>s.feed);
    const rows = feed.filter((e)=>e.channel === `stream:${streamId}` && (e.kind === 'chat' || e.kind === 'emote'));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (rows.length > 0) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageNoteChat"])();
    }, [
        rows.length
    ]);
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const send = async ()=>{
        const text = draft.trim();
        if (!text) return;
        setDraft('');
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageSendChat"])(streamId, text);
        if (!r.ok) onNotice(stageWhy(r.why));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-black/[0.06] bg-white p-2",
        "data-testid": "stage-chat",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                children: "Stage chat"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 525,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 max-h-24 space-y-0.5 overflow-y-auto",
                "data-testid": "stage-chat-feed",
                children: rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-[10px] font-semibold text-[var(--lko-ink-soft)]",
                    children: "The room quiet — yarn something."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                    lineNumber: 528,
                    columnNumber: 11
                }, this) : rows.slice(-8).map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-semibold",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-black text-[var(--lko-green-deep)]",
                                children: [
                                    e.actor,
                                    ":"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 531,
                                columnNumber: 13
                            }, this),
                            " ",
                            String(e.payload.text ?? '')
                        ]
                    }, e.seq, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 530,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 526,
                columnNumber: 7
            }, this),
            claimed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1.5 flex gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: draft,
                        onChange: (e)=>setDraft(e.target.value),
                        maxLength: 280,
                        placeholder: band === 'kid' ? 'Kids dey talk with emotes for street' : 'Yarn the room…',
                        className: "min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-semibold outline-none",
                        "aria-label": "Stage chat",
                        "data-testid": "stage-chat-input"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 537,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void send(),
                        "data-testid": "stage-chat-send",
                        className: "lko-press rounded-xl bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-black text-white",
                        children: "Send"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 541,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 536,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1.5 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                children: "Claim your name to yarn — guests fit watch."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 545,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 524,
        columnNumber: 5
    }, this);
}
function StreamsTab({ claimed, onNotice, band, myHandle }) {
    const board = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.board);
    const publishing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.publishing);
    const myStreamId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.myStreamId);
    const myTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.myTitle);
    const myMic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.myMic);
    const watchingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.watchingId);
    const watchingTitle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.watchingTitle);
    const remoteStream = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.remoteStream);
    const viewerMuted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.viewerMuted);
    const tipNote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.tipNote);
    const lastWhy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"])((s)=>s.lastWhy);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [pin, setPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [tipAmt, setTipAmt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageSeedBoard"])();
    }, []);
    const goLive = async ()=>{
        const t = title.trim() || `${myHandle ?? 'me'}'s waka`;
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageGoLive"])(t);
        if (r.ok) {
            setTitle('');
            onNotice('📡 You dey live! Your waka na the show.');
        } else onNotice(stageWhy(r.why));
    };
    const stopLive = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageStop"])();
        onNotice('The stage don rest.');
    };
    const watch = async (id)=>{
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageWatch"])(id);
        if (!r.ok) onNotice(stageWhy(r.why));
    };
    const stopWatch = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageUnwatch"])();
    };
    const tip = async (amount)=>{
        if (!watchingId) return;
        if (!pin.trim()) {
            setTipAmt(amount);
            onNotice('Enter your PIN to spray.');
            return;
        }
        const idemKey = `tip-${watchingId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageSendTip"])(watchingId, amount, pin.trim(), idemKey);
        if (r.ok) {
            onNotice(`💸 ₦${amount} don fly to the host — the room see am.`);
            setTipAmt(null);
            setPin('');
        } else {
            onNotice(stageWhy(r.why));
            setTipAmt(null);
        }
    };
    const watchingRow = board.find((r)=>r.id === watchingId) ?? null;
    const adult = claimed && band === 'adult';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        "data-testid": "live-streams",
        children: [
            lastWhy === 'stage-ended' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-2xl bg-white/70 p-2.5 text-[11px] font-black text-[var(--lko-ink-soft)]",
                "data-testid": "stage-ended-note",
                children: "The stage don end — the eye don close."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 608,
                columnNumber: 9
            }, this),
            publishing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-[var(--lko-amber)] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex items-center gap-1.5 text-[12px] font-black",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block h-2 w-2 animate-pulse rounded-full bg-red-500",
                                        "data-testid": "stage-live-chip"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 617,
                                        columnNumber: 15
                                    }, this),
                                    "LIVE · ",
                                    myTitle
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 616,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                "data-testid": "stage-mic-note",
                                children: myMic ? '🎙️ mic on' : '🔇 no mic (POV only)'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 620,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 615,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                        "data-testid": "stage-viewers",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crowdNoteText"])(board.find((r)=>r.id === myStreamId)?.viewers ?? 0)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 624,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void stopLive(),
                        "data-testid": "stage-stop",
                        className: "lko-press mt-2 w-full rounded-xl bg-red-600 py-2 text-[11px] font-black text-white",
                        children: "End the stage"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 627,
                        columnNumber: 11
                    }, this),
                    tipNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1.5 rounded-xl bg-[var(--lko-amber)]/15 px-2.5 py-1.5 text-[10px] font-black text-[#1a1e18]",
                        "data-testid": "stage-tip-note",
                        children: tipNote
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 632,
                        columnNumber: 13
                    }, this),
                    myStreamId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StageChatRoom, {
                            streamId: myStreamId,
                            claimed: claimed,
                            band: band,
                            onNotice: onNotice
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 638,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 637,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 614,
                columnNumber: 9
            }, this) : adult ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: "Go live — your waka na the show"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 644,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: title,
                        onChange: (e)=>setTitle(e.target.value),
                        maxLength: 64,
                        placeholder: "Stage title (e.g. Market waka wey sweet)",
                        className: "mt-1.5 w-full rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none",
                        "aria-label": "Stage title",
                        "data-testid": "stage-title-input"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 645,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>void goLive(),
                        "data-testid": "stage-go-live",
                        className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-amber)] py-2 text-[11px] font-black text-[#1a1e18]",
                        children: "📡 Go live (your POV dey stream)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 649,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                        children: "Your POV dey go out real-time. Viewers fit spray real ₦ — the ledger dey chain every kobo."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 653,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 643,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                "data-testid": "stage-locked",
                children: claimed ? 'The stage na adult land — you fit watch, never broadcast.' : 'The stage dey open for every eye — claim your name to broadcast.'
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 656,
                columnNumber: 9
            }, this),
            watchingId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-2.5",
                "data-testid": "stage-watcher",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-1.5 flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-black",
                                children: [
                                    "👀 ",
                                    watchingTitle ?? watchingRow?.title ?? watchingId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 665,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crowdNoteText"])(watchingRow?.viewers ?? 0)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 666,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 664,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StageVideo, {
                        remoteStream: remoteStream,
                        muted: viewerMuted,
                        videoRef: videoRef
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 668,
                        columnNumber: 11
                    }, this),
                    tipNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 rounded-xl bg-[var(--lko-amber)]/15 px-2.5 py-1.5 text-[10px] font-black text-[#1a1e18]",
                        "data-testid": "stage-tip-note",
                        children: tipNote
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 670,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stagenet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStageStore"].setState({
                                        viewerMuted: !viewerMuted
                                    }),
                                "data-testid": "stage-unmute",
                                className: "lko-press flex-1 rounded-xl bg-black/[0.05] py-1.5 text-[10px] font-extrabold",
                                children: viewerMuted ? '🔊 Unmute' : '🔇 Mute'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 675,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void stopWatch(),
                                "data-testid": "stage-stop-watch",
                                className: "lko-press flex-1 rounded-xl bg-black/[0.05] py-1.5 text-[10px] font-extrabold",
                                children: "Leave"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 679,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 674,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StageChatRoom, {
                        streamId: watchingId,
                        claimed: claimed,
                        band: band,
                        onNotice: onNotice
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 682,
                        columnNumber: 11
                    }, this),
                    adult && watchingRow && watchingRow.host !== myHandle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 rounded-xl bg-[var(--lko-amber)]/10 p-2",
                        "data-testid": "stage-tip-box",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-black uppercase tracking-[0.08em] text-[#1a1e18]",
                                children: "Spray the host (real ₦, the ledger dey chain am)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 685,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 flex gap-1.5",
                                children: [
                                    100,
                                    500
                                ].map((amt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setTipAmt(amt);
                                            void tip(amt);
                                        },
                                        "data-testid": `stage-tip-${amt}`,
                                        className: "lko-press flex-1 rounded-xl bg-[var(--lko-amber)] py-1.5 text-[10px] font-black text-[#1a1e18]",
                                        children: [
                                            "₦",
                                            amt
                                        ]
                                    }, amt, true, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 688,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 686,
                                columnNumber: 15
                            }, this),
                            tipAmt !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 flex gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        value: pin,
                                        onChange: (e)=>setPin(e.target.value),
                                        maxLength: 8,
                                        inputMode: "numeric",
                                        type: "password",
                                        placeholder: "PIN",
                                        "aria-label": "Wallet PIN",
                                        "data-testid": "stage-tip-pin",
                                        className: "min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-bold outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 696,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void tip(tipAmt),
                                        "data-testid": "stage-tip-send",
                                        className: "lko-press rounded-xl bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-black text-white",
                                        children: [
                                            "Spray ₦",
                                            tipAmt
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 699,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 695,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 684,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 663,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "stage-board",
                children: board.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                    children: "Nobody dey live now. When a walker go live, their stage go show here — real eyes, real spray."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                    lineNumber: 713,
                    columnNumber: 11
                }, this) : board.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 rounded-2xl border border-black/[0.06] bg-white p-3",
                        "data-testid": `stage-row-${s.host}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[12px] font-black",
                                children: [
                                    "📡 ",
                                    s.title
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 719,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                children: [
                                    s.host,
                                    " · ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crowdNoteText"])(s.viewers)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 720,
                                columnNumber: 15
                            }, this),
                            s.host === myHandle ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-[10px] font-black text-[var(--lko-green-deep)]",
                                children: "na your stage dey shine"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 724,
                                columnNumber: 17
                            }, this) : watchingId === s.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1.5 text-[10px] font-black text-[var(--lko-green-deep)]",
                                children: "you dey watch"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 726,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>void watch(s.id),
                                "data-testid": `stage-watch-${s.host}`,
                                className: "lko-press mt-1.5 rounded-full bg-[var(--lko-green-soft)] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                children: "Watch"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 728,
                                columnNumber: 17
                            }, this)
                        ]
                    }, s.id, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 718,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 711,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 606,
        columnNumber: 5
    }, this);
}
function UnionTab({ liveAction, claimed, band, onNotice, assocId, day }) {
    const [assocs, setAssocs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [dues, setDues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('500');
    const [cosigner, setCosigner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const res = await liveAction('assocs');
        if (res.ok) setAssocs(res.assocs ?? []);
    }, [
        liveAction
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!claimed || band !== 'adult') return;
        const t = setTimeout(()=>{
            void load();
        }, 0);
        return ()=>clearTimeout(t);
    }, [
        claimed,
        band,
        load
    ]);
    if (!claimed || band !== 'adult') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
            "data-testid": "union-locked",
            children: "The money tables na adult land — you fit read the room when you grow into am."
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
            lineNumber: 769,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        "data-testid": "live-union",
        children: [
            !assocId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: "Found a union"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 776,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: name,
                        onChange: (e)=>setName(e.target.value),
                        maxLength: 48,
                        placeholder: "Union name (e.g. Kpata Traders Union)",
                        className: "mt-1.5 w-full rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none",
                        "aria-label": "Union name"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 777,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "live-assoc-found",
                        disabled: name.trim().length < 3,
                        onClick: async ()=>{
                            const { liveFoundAssoc } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                            const r = await liveFoundAssoc(name.trim(), 'One hand no fit lift the market');
                            if (r.ok) {
                                onNotice('🏛️ Union don stand! The books dey sealed — every kobo chained.');
                                void load();
                            } else onNotice(r.why ?? 'no gree');
                        },
                        className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] py-2 text-[11px] font-black text-white disabled:opacity-40",
                        children: "Found it (the treasury dey chained)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 780,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 775,
                columnNumber: 9
            }, this),
            assocs.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                    "data-testid": `assoc-${a.id}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[12px] font-black",
                            children: [
                                "🏛️ ",
                                a.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 794,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                            children: a.motto
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 795,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-0.5 text-[11px] font-extrabold",
                            children: [
                                "Treasury: ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(a.treasury),
                                " · ",
                                a.members,
                                " member",
                                a.members > 1 ? 's' : ''
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 796,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 space-y-1.5",
                            children: assocId === a.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: dues,
                                                onChange: (e)=>setDues(e.target.value),
                                                inputMode: "numeric",
                                                "aria-label": "Dues amount",
                                                className: "min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-bold outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                lineNumber: 801,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                "data-testid": "live-assoc-dues",
                                                onClick: async ()=>{
                                                    const { livePayDues } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                                    const r = await livePayDues(a.id, Math.max(0, Math.floor(Number(dues) || 0)));
                                                    if (!r.ok) onNotice(r.why ?? 'no gree');
                                                    else {
                                                        onNotice('🤝 Dues land — the chain don grow.');
                                                        void load();
                                                    }
                                                },
                                                className: "lko-press rounded-xl bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white",
                                                children: "Pay dues"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                lineNumber: 803,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 800,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: cosigner,
                                                onChange: (e)=>setCosigner(e.target.value),
                                                placeholder: "co-signer handle",
                                                "aria-label": "Co-signer handle",
                                                className: "min-w-0 flex-1 rounded-xl bg-black/[0.04] px-2.5 py-1.5 text-[11px] font-bold outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                lineNumber: 813,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                "data-testid": "live-assoc-withdraw",
                                                onClick: async ()=>{
                                                    const { liveWithdrawAssoc } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                                    const r = await liveWithdrawAssoc(a.id, Math.max(0, Math.floor(Number(dues) || 0)), cosigner.trim());
                                                    if (!r.ok) onNotice(r.why === 'two-key' ? 'Two keys or nothing — the president alone no fit open the books.' : r.why ?? 'no gree');
                                                    else {
                                                        void load();
                                                    }
                                                },
                                                className: "lko-press rounded-xl bg-amber-500 px-3 py-1.5 text-[10px] font-extrabold text-white",
                                                children: "Withdraw"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                                lineNumber: 815,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 812,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CourtPanel, {
                                        assocId: a.id,
                                        day: day,
                                        liveAction: liveAction,
                                        onNotice: onNotice
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                        lineNumber: 824,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": `live-assoc-join-${a.id}`,
                                onClick: async ()=>{
                                    const { liveJoinAssoc } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                    const r = await liveJoinAssoc(a.id);
                                    if (r.ok) {
                                        onNotice(`You don join ${a.name}.`);
                                        void load();
                                    } else onNotice(r.why ?? 'no gree');
                                },
                                className: "lko-press w-full rounded-xl bg-[var(--lko-green-soft)] py-1.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                children: "Join the union"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 827,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 797,
                            columnNumber: 11
                        }, this)
                    ]
                }, a.id, true, {
                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                    lineNumber: 793,
                    columnNumber: 9
                }, this)),
            assocs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: "No union yet — be the first to stand one. Treasuries dey sealed: every move na chain link, withdrawals need TWO keys."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 840,
                columnNumber: 31
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 773,
        columnNumber: 5
    }, this);
}
/* ------------------------------ the court panel ---------------------------- */ function CourtPanel({ assocId, day, liveAction, onNotice }) {
    const [terms, setTerms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [stake, setStake] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('1000');
    const [evidence, setEvidence] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filed, setFiled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-xl bg-black/[0.03] p-2",
        "data-testid": "live-court",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                children: "⚖️ Market Union Court"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 860,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                value: terms,
                onChange: (e)=>setTerms(e.target.value),
                placeholder: "contract terms (e.g. AjoWealth supply 20 bags monthly)",
                className: "mt-1 w-full rounded-lg bg-white px-2 py-1.5 text-[10.5px] font-bold outline-none",
                "aria-label": "Contract terms"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 861,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 flex gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: stake,
                        onChange: (e)=>setStake(e.target.value),
                        inputMode: "numeric",
                        "aria-label": "Stake",
                        className: "min-w-0 flex-1 rounded-lg bg-white px-2 py-1.5 text-[10.5px] font-bold outline-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 864,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "live-contract-file",
                        onClick: async ()=>{
                            const { liveFileContract } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                            const r = await liveFileContract(assocId, terms.trim(), Math.max(0, Math.floor(Number(stake) || 0)), []);
                            if (!r.ok) {
                                onNotice(r.why ?? 'no gree');
                                return;
                            }
                            const c = r.contract;
                            if (c) setFiled((f)=>[
                                    ...f,
                                    c
                                ]);
                            setTerms('');
                            onNotice('📜 Contract file — the stake dey court hand now.');
                        },
                        className: "lko-press rounded-lg bg-[var(--lko-green)] px-3 py-1.5 text-[10px] font-extrabold text-white",
                        children: "File"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 866,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 863,
                columnNumber: 7
            }, this),
            filed.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-1.5 rounded-lg bg-white p-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10.5px] font-bold",
                            children: [
                                "📜 ",
                                c.terms,
                                " — stake ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(c.stake)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 880,
                            columnNumber: 11
                        }, this),
                        c.status === 'open' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1 flex gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: evidence,
                                    onChange: (e)=>setEvidence(e.target.value),
                                    placeholder: "your evidence",
                                    "aria-label": "Dispute evidence",
                                    className: "min-w-0 flex-1 rounded-lg bg-black/[0.04] px-2 py-1 text-[10px] font-bold outline-none"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 883,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `live-dispute-${c.id}`,
                                    onClick: async ()=>{
                                        const { liveFileDispute } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                        const r = await liveFileDispute(assocId, c.id, evidence.trim());
                                        if (!r.ok) {
                                            onNotice(r.why ?? 'no gree');
                                            return;
                                        }
                                        onNotice(r.verdict === 'broken' ? '⚖️ BROKEN — the liable party pays the stake.' : '⚖️ The contract stands.');
                                        void evidence;
                                        void day;
                                    },
                                    className: "lko-press rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold text-white",
                                    children: "Dispute"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 885,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 882,
                            columnNumber: 13
                        }, this)
                    ]
                }, c.id, true, {
                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                    lineNumber: 879,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                children: "The verdict na hash — deterministic, bribe-proof. Fee ₦200."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 899,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 859,
        columnNumber: 5
    }, this);
}
function AjoTab({ liveAction, claimed, band, onNotice, circles, day, cash }) {
    const [list, setList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [inbox, setInbox] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('1000');
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        const [a, t] = await Promise.all([
            liveAction('ajos'),
            liveAction('trades')
        ]);
        if (a.ok) setList(a.circles ?? []);
        if (t.ok) setInbox(t.trades ?? []);
    }, [
        liveAction
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!claimed || band !== 'adult') return;
        const t = setTimeout(()=>{
            void load();
        }, 0);
        return ()=>clearTimeout(t);
    }, [
        claimed,
        band,
        load
    ]);
    if (!claimed || band !== 'adult') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
            "data-testid": "ajo-locked",
            children: "Ajo circles na adult land — the ladder and the court wait for you."
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
            lineNumber: 935,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        "data-testid": "live-ajo",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: "Open a circle"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 941,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: name,
                        onChange: (e)=>setName(e.target.value),
                        maxLength: 48,
                        placeholder: "Circle name (e.g. Market Women Ajo)",
                        className: "mt-1.5 w-full rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none",
                        "aria-label": "Circle name"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 942,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: amount,
                                onChange: (e)=>setAmount(e.target.value),
                                inputMode: "numeric",
                                "aria-label": "Contribution",
                                className: "min-w-0 flex-1 rounded-xl bg-black/[0.04] px-3 py-2 text-[12px] font-semibold outline-none"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 945,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "live-ajo-found",
                                disabled: name.trim().length < 3 || (Number(amount) || 0) < 100,
                                onClick: async ()=>{
                                    const { liveFoundAjo } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                    const r = await liveFoundAjo(name.trim(), Math.max(100, Math.floor(Number(amount) || 0)));
                                    if (r.ok) {
                                        onNotice('♻️ Circle don open — the ladder don set.');
                                        void load();
                                    } else onNotice(r.why ?? 'no gree');
                                },
                                className: "lko-press rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[11px] font-extrabold text-white disabled:opacity-40",
                                children: "Open"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                lineNumber: 947,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 944,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 940,
                columnNumber: 7
            }, this),
            list.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                    "data-testid": `circle-${c.id}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[12px] font-black",
                            children: [
                                "♻️ ",
                                c.name,
                                " ",
                                c.status === 'panic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-black text-red-700",
                                    children: "PANIC"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 960,
                                    columnNumber: 86
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 960,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                            children: [
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(c.contribution),
                                " per head · round ",
                                c.round,
                                " · pot ",
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(c.pot),
                                " · ",
                                c.members,
                                " member",
                                c.members > 1 ? 's' : ''
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 961,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1.5 flex gap-1.5",
                            children: [
                                !circles.includes(c.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `live-ajo-join-${c.id}`,
                                    onClick: async ()=>{
                                        const { liveJoinAjo } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                        const r = await liveJoinAjo(c.id);
                                        if (r.ok) {
                                            onNotice(`You don enter ${c.name} — your turn go reach.`);
                                            void load();
                                        } else onNotice(r.why ?? 'no gree');
                                    },
                                    className: "lko-press flex-1 rounded-xl bg-[var(--lko-green-soft)] py-1.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                    children: "Join"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 964,
                                    columnNumber: 15
                                }, this),
                                circles.includes(c.id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `live-ajo-pay-${c.id}`,
                                    disabled: cash < c.contribution,
                                    onClick: async ()=>{
                                        const { livePayAjo } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                        const r = await livePayAjo(c.id);
                                        if (!r.ok) onNotice(r.why ?? 'no gree');
                                        else {
                                            void load();
                                        }
                                    },
                                    className: "lko-press flex-1 rounded-xl bg-[var(--lko-green)] py-1.5 text-[10px] font-extrabold text-white disabled:opacity-40",
                                    children: [
                                        "Pay ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(c.contribution)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 973,
                                    columnNumber: 15
                                }, this),
                                c.status === 'panic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `live-ajo-court-${c.id}`,
                                    onClick: async ()=>{
                                        const { liveCourtAjo } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                        const r = await liveCourtAjo(c.id);
                                        if (!r.ok) onNotice(r.why ?? 'no gree');
                                        else {
                                            onNotice('⚖️ The court don act — the defaulter go pay 1.5×, the round still pay.');
                                            void load();
                                        }
                                        void day;
                                    },
                                    className: "lko-press rounded-xl bg-amber-500 px-2.5 py-1.5 text-[10px] font-extrabold text-white",
                                    children: "Court"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 983,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 962,
                            columnNumber: 11
                        }, this)
                    ]
                }, c.id, true, {
                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                    lineNumber: 959,
                    columnNumber: 9
                }, this)),
            inbox.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-black/[0.06] bg-white p-3",
                "data-testid": "trade-inbox",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-black uppercase tracking-[0.08em] text-[var(--lko-ink-soft)]",
                        children: "Trade offers"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                        lineNumber: 999,
                        columnNumber: 11
                    }, this),
                    inbox.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-1.5 rounded-xl bg-black/[0.03] p-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] font-bold",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                            children: t.fromHandle
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                            lineNumber: 1002,
                                            columnNumber: 52
                                        }, this),
                                        " dey give ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(t.giveCash),
                                        " want ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(t.wantCash),
                                        " — ",
                                        t.terms
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 1002,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `live-trade-accept-${t.id}`,
                                    onClick: async ()=>{
                                        const { liveAcceptTrade } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
                                        const r = await liveAcceptTrade(t.id);
                                        if (!r.ok) onNotice(r.why === 'partner-gone' ? 'The other walker don leave the wire — the trade no fit close.' : r.why ?? 'no gree');
                                        else void load();
                                    },
                                    className: "lko-press mt-1 rounded-lg bg-[var(--lko-green)] px-3 py-1 text-[10px] font-extrabold text-white",
                                    children: "Accept"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                                    lineNumber: 1003,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, t.id, true, {
                            fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                            lineNumber: 1001,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 998,
                columnNumber: 9
            }, this),
            list.length === 0 && inbox.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-2xl bg-white/70 p-3 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                children: "No circle yet, no trade yet. Ajo na trust wey the court carry — miss contribute, the Union fine you 1.5× and the round STILL pays."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
                lineNumber: 1017,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/LiveApp.tsx",
        lineNumber: 939,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_game_screens_phone_LiveApp_tsx_be595046._.js.map