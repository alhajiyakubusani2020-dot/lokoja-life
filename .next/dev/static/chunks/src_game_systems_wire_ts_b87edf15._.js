(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/game/systems/wire.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWireStore",
    ()=>useWireStore,
    "wireCallRing",
    ()=>wireCallRing,
    "wireCallSend",
    ()=>wireCallSend,
    "wireCursor",
    ()=>wireCursor,
    "wireEmitAck",
    ()=>wireEmitAck,
    "wireEnsure",
    ()=>wireEnsure,
    "wireForget",
    ()=>wireForget,
    "wireOnCall",
    ()=>wireOnCall,
    "wireOnCar",
    ()=>wireOnCar,
    "wireOnCarCrew",
    ()=>wireOnCarCrew,
    "wireOnLedger",
    ()=>wireOnLedger,
    "wireOnParked",
    ()=>wireOnParked,
    "wireOnPos",
    ()=>wireOnPos,
    "wireOnPv",
    ()=>wireOnPv,
    "wireOnSocial",
    ()=>wireOnSocial,
    "wireOnStage",
    ()=>wireOnStage,
    "wireOnVoice",
    ()=>wireOnVoice,
    "wireOpenDm",
    ()=>wireOpenDm,
    "wireSendCarBye",
    ()=>wireSendCarBye,
    "wireSendCarHello",
    ()=>wireSendCarHello,
    "wireSendCarPos",
    ()=>wireSendCarPos,
    "wireSendChat",
    ()=>wireSendChat,
    "wireSendDm",
    ()=>wireSendDm,
    "wireSendEmote",
    ()=>wireSendEmote,
    "wireSendInvite",
    ()=>wireSendInvite,
    "wireSendPos",
    ()=>wireSendPos,
    "wireSendVehicleBoard",
    ()=>wireSendVehicleBoard,
    "wireSendVehicleParkedQuery",
    ()=>wireSendVehicleParkedQuery,
    "wireSendVehiclePatch",
    ()=>wireSendVehiclePatch,
    "wireSendVehicleRefuel",
    ()=>wireSendVehicleRefuel,
    "wireSendVehicleRepair",
    ()=>wireSendVehicleRepair,
    "wireSendVehicleSeats",
    ()=>wireSendVehicleSeats,
    "wireSendVehicleUnboard",
    ()=>wireSendVehicleUnboard,
    "wireSetStreet",
    ()=>wireSetStreet,
    "wireWalletDeposit",
    ()=>wireWalletDeposit,
    "wireWalletState",
    ()=>wireWalletState,
    "wireWalletTransfer",
    ()=>wireWalletTransfer,
    "wireWalletWithdraw",
    ()=>wireWalletWithdraw,
    "wireWhere",
    ()=>wireWhere
]);
/**
 * LOKOJA LIFE — M24 W4: THE WIRE CLIENT
 * =====================================
 * The game's fast lane to the nation-wire service (:3003 through the
 * gateway). ONE singleton socket, idempotent ensure, honest states.
 *
 * LAWS OF THIS FILE:
 *  - THE NOTHING-THROWN-AWAY LAW: the 12s relay heartbeat (/api/live/sync)
 *    stays EXACTLY as it is — it is the DEGRADED lane. When the wire is
 *    'live' the faces stop polling (bandwidth law N5); the moment the
 *    socket drops they fall back automatically. Two lanes, one nation.
 *  - THE HONEST-STATE LAW: 'off' | 'connecting' | 'live' | 'degraded' —
 *    the faces label the lane with the REAL state, never a fake green.
 *  - THE SPECTATE LAW (M17 identity law, client side): the socket connects
 *    even for a guest (listening is free); the mic stays dark — the
 *    server door enforces it and the faces already do too.
 *  - THE CURSOR LAW (client side): every event seen updates lastSeq; a
 *    reconnect resumes from it (server replays the gap). One cursor.
 *  - THE DEDUPE LAW: the feed is keyed by seq — the wire echo, the relay
 *    lane and the resume replay can all collide; seq wins, exactly once.
 *  - THE BANDWIDTH LAW (N5): idle traffic = one 24-byte ping every 12s.
 *    Presence updates ride the same cadence (≤1/2s server cap, we send
 *    1/12s). No other idle chatter.
 *  - THE 3s GATE: reconnectionDelay 500ms, reconnectionDelayMax 3000ms —
 *    the socket is back or the state says 'degraded' (the relay takes over).
 *  - THE TOKEN-ROTATION LAW: the auth is captured per handshake; when the
 *    account's token changes (login/claim/rotate) the socket re-handshakes
 *    with the fresh token. A stale token never sits on the wire.
 *  - THE OFF-SWITCH: wireForget() closes the lane (logout/reset paths).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
;
;
const useWireStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])(()=>({
        state: 'off',
        feed: [],
        roster: [],
        latencyMs: null
    }));
/* ───────────────────────── the singleton ───────────────────────── */ const WIRE_URL = '/?XTransformPort=3003';
const FEED_CAP = 200;
const PING_EVERY_MS = 12_000;
let socket = null;
let handshakeToken = null;
let lastSeq = 0;
let presence = {
    street: 'home',
    status: 'hustling'
};
let pingTimer = null;
function setState(s) {
    useWireStore.setState({
        state: s
    });
}
function pushFeed(events) {
    if (!events.length) return;
    const cur = useWireStore.getState().feed;
    // THE DEDUPE LAW: seq is the identity; only the unseen pass
    const seen = new Set(cur.map((e)=>e.seq));
    const fresh = events.filter((e)=>e.seq > 0 && !seen.has(e.seq));
    if (!fresh.length) return;
    for (const e of fresh)if (e.seq > lastSeq) lastSeq = e.seq;
    const merged = [
        ...cur,
        ...fresh
    ].sort((a, b)=>a.seq - b.seq);
    useWireStore.setState({
        feed: merged.length > FEED_CAP ? merged.slice(merged.length - FEED_CAP) : merged
    });
}
function startPing(s) {
    stopPing();
    pingTimer = setInterval(()=>{
        if (!s.connected) return;
        const t0 = Date.now();
        s.timeout(4000).emit('ping', {}, (err)=>{
            if (err) return;
            useWireStore.setState({
                latencyMs: Date.now() - t0
            });
        });
    }, PING_EVERY_MS);
}
function stopPing() {
    if (pingTimer) clearInterval(pingTimer);
    pingTimer = null;
}
function wirePresence() {
    if (socket?.connected) socket.emit('presence', presence);
}
function wireEnsure(getToken, getPresence) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const token = getToken() ?? null;
    if (getPresence) presence = getPresence();
    if (socket && handshakeToken === token) {
        wirePresence();
        return;
    }
    // token rotated (or first connect) — the old lane closes honestly
    if (socket) {
        stopPing();
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
    handshakeToken = token;
    setState('connecting');
    const s = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(WIRE_URL, {
        transports: [
            'websocket',
            'polling'
        ],
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionDelayMax: 3000,
        timeout: 10_000,
        auth: token ? {
            token
        } : {}
    });
    socket = s;
    s.on('connect', ()=>{
        setState('live');
        s.emit('hello', presence);
        // THE CURSOR LAW: whatever flew while we were away, replay it
        if (lastSeq > 0) {
            s.timeout(5000).emit('resume', {
                since: lastSeq
            }, (err, res)=>{
                if (!err && res?.ok && res.events) pushFeed(res.events);
            });
        }
        startPing(s);
    });
    s.on('disconnect', (reason)=>{
        // the honest lane flip: the relay heartbeat takes over (nothing thrown away)
        setState(reason === 'io client disconnect' || reason === 'io server disconnect' ? 'off' : 'degraded');
    });
    s.io.on('reconnect', ()=>setState('connecting'));
    s.on('wire:event', (ev)=>pushFeed([
            ev
        ]));
    // W5: the social push lane — forward to every registered listener
    s.on('wire:social', (p)=>{
        if (p && typeof p.type === 'string') for (const fn of socialPushFns)fn(p);
    });
    // W9: the stage push lane — board truth, viewer counts, tips
    s.on('wire:stage', (p)=>{
        if (p && typeof p === 'object' && typeof p.type === 'string') {
            for (const fn of stageFns)fn(p);
        }
    });
    // W6: the ledger push lane — a receipt for MY wallet (the receiver's door)
    s.on('wire:ledger', (r)=>{
        if (r && typeof r.idemKey === 'string') for (const fn of ledgerFns)fn(r);
    });
    // W7: the call push lane — the ring, the accept, the sealed envelopes, the end
    s.on('wire:call', (p)=>{
        if (p && typeof p === 'object' && typeof p.type === 'string') {
            for (const fn of callFns)fn(p);
        }
    });
    // W7: the proximity voice lane — a street neighbour joined / left the walkie
    s.on('wire:voice', (p)=>{
        if (p && typeof p === 'object' && typeof p.type === 'string') {
            for (const fn of voiceFns)fn(p);
        }
    });
    // W7: the walkie mesh lane — the street's sealed pv envelopes ride the person
    s.on('wire:pv', (p)=>{
        if (p && typeof p === 'object' && typeof p.type === 'string') {
            for (const fn of pvFns)fn(p);
        }
    });
    // W2: the body lane — a same-street walker's 10Hz moment (ephemeral,
    // memory-only; remotenet owns the buffers)
    s.on('wire:pos', (p)=>{
        if (p && typeof p.h === 'string' && typeof p.x === 'number' && typeof p.z === 'number') {
            for (const fn of posFns)fn(p);
        }
    });
    // W10: the car lane — a same-street driver's 12Hz wheel moment
    // (ephemeral, memory-only; wheelnet owns the buffers)
    s.on('wire:car', (p)=>{
        if (p && typeof p.h === 'string' && typeof p.model === 'string' && typeof p.x === 'number' && typeof p.z === 'number') {
            for (const fn of carFns)fn(p);
        }
    });
    // W10-b: the crew lane — a member boarded, hopped off, or was dropped
    s.on('wire:car-crew', (p)=>{
        if (p && typeof p.type === 'string' && typeof p.driver === 'string' && typeof p.who === 'string') {
            for (const fn of carCrewFns)fn(p);
        }
    });
    // W10-b: the parked lane — a car left behind stays visible where it stopped
    s.on('wire:parked', (p)=>{
        if (p?.op === 'park' && p.row && typeof p.row.handle === 'string') {
            for (const fn of parkedFns)fn(p);
        }
    });
    s.on('wire:roster', (r)=>{
        if (r?.roster) useWireStore.setState({
            roster: r.roster
        });
    });
    s.on('wire:welcome', (w)=>{
        // a fresh cursor only when we never saw one (boot); else the resume carries
        if (lastSeq === 0 && typeof w.head === 'number') lastSeq = w.head;
    });
}
function wireForget() {
    if (socket) {
        stopPing();
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
    handshakeToken = null;
    lastSeq = 0;
    useWireStore.setState({
        state: 'off',
        feed: [],
        roster: [],
        latencyMs: null
    });
}
function wireCursor() {
    return lastSeq;
}
function wireEmitAck(ev, body) {
    return new Promise((resolve)=>{
        if (!socket?.connected) return resolve({
            ok: false,
            why: 'wire-down'
        });
        socket.timeout(5000).emit(ev, body, (err, res)=>{
            if (err) return resolve({
                ok: false,
                why: 'wire-slow'
            });
            if (!res) return resolve({
                ok: false,
                why: 'wire-slow'
            });
            resolve({
                ok: !!res.ok,
                why: res.why,
                ...res
            });
        });
    });
}
const socialPushFns = new Set();
function wireOnSocial(fn) {
    // registration only — the ensure-time forwarder on the live socket is the
    // ONE listener (a direct socket.on here would double-deliver every push)
    socialPushFns.add(fn);
    return ()=>{
        socialPushFns.delete(fn);
    };
}
const ledgerFns = new Set();
function wireOnLedger(fn) {
    ledgerFns.add(fn);
    return ()=>{
        ledgerFns.delete(fn);
    };
}
const stageFns = new Set();
function wireOnStage(fn) {
    stageFns.add(fn);
    return ()=>{
        stageFns.delete(fn);
    };
}
const callFns = new Set();
function wireOnCall(fn) {
    callFns.add(fn);
    return ()=>{
        callFns.delete(fn);
    };
}
const voiceFns = new Set();
function wireOnVoice(fn) {
    voiceFns.add(fn);
    return ()=>{
        voiceFns.delete(fn);
    };
}
const pvFns = new Set();
function wireOnPv(fn) {
    pvFns.add(fn);
    return ()=>{
        pvFns.delete(fn);
    };
}
const posFns = new Set();
function wireOnPos(fn) {
    posFns.add(fn);
    return ()=>{
        posFns.delete(fn);
    };
}
function wireSendPos(p) {
    if (socket?.connected) socket.emit('pos', p);
}
const carFns = new Set();
function wireOnCar(fn) {
    carFns.add(fn);
    return ()=>{
        carFns.delete(fn);
    };
}
const carCrewFns = new Set();
function wireOnCarCrew(fn) {
    carCrewFns.add(fn);
    return ()=>{
        carCrewFns.delete(fn);
    };
}
const parkedFns = new Set();
function wireOnParked(fn) {
    parkedFns.add(fn);
    return ()=>{
        parkedFns.delete(fn);
    };
}
function wireSendCarHello(p) {
    return wireEmitAck('vehicle:hello', p);
}
function wireSendCarPos(p) {
    if (socket?.connected) socket.emit('vehicle:pos', p);
}
function wireSendCarBye() {
    return wireEmitAck('vehicle:bye', {});
}
function wireSendVehicleSeats(open) {
    return wireEmitAck('vehicle:seats', {
        open
    });
}
function wireSendVehicleBoard(driverHandle) {
    return wireEmitAck('vehicle:board', {
        handle: driverHandle
    });
}
function wireSendVehicleUnboard() {
    return wireEmitAck('vehicle:unboard', {});
}
function wireSendVehiclePatch(model, style) {
    return wireEmitAck('vehicle:patch', {
        model,
        ...style
    });
}
function wireSendVehicleParkedQuery(x, z) {
    return wireEmitAck('vehicle:parked', {
        x,
        z
    });
}
function wireSendVehicleRefuel(model, amount, x, z, idemKey) {
    return wireEmitAck('vehicle:refuel', {
        model,
        amount,
        x,
        z,
        idemKey
    });
}
function wireSendVehicleRepair(model, x, z, idemKey) {
    return wireEmitAck('vehicle:repair', {
        model,
        x,
        z,
        idemKey
    });
}
function wireWhere(handle) {
    return wireEmitAck('where', {
        handle
    });
}
function wireSetStreet(street) {
    presence = {
        ...presence,
        street: street.slice(0, 48) || 'home'
    };
    wirePresence();
}
function wireCallRing(to, video) {
    return wireEmitAck('call:ring', {
        to,
        video
    });
}
function wireCallSend(ev, body) {
    return wireEmitAck(ev, body);
}
function emitAck(ev, body) {
    return wireEmitAck(ev, body);
}
function wireSendChat(text, channel = 'global') {
    return emitAck('chat', {
        channel,
        text
    });
}
function wireSendEmote(emoteId, channel = 'global') {
    return emitAck('emote', {
        channel,
        emoteId
    });
}
function wireOpenDm(withHandle) {
    if (socket?.connected) socket.emit('dm:open', {
        with: withHandle
    });
}
function wireSendDm(toHandle, text) {
    return emitAck('dm', {
        to: toHandle,
        text
    });
}
function wireSendInvite(toHandle, street) {
    return emitAck('social:invite', {
        to: toHandle,
        street
    });
}
function wireWalletState() {
    return wireEmitAck('wallet', {});
}
function wireWalletDeposit(amount, idemKey) {
    return wireEmitAck('wallet:deposit', {
        amount,
        idemKey
    });
}
function wireWalletWithdraw(amount, pin, idemKey) {
    return wireEmitAck('wallet:withdraw', {
        amount,
        pin,
        idemKey
    });
}
function wireWalletTransfer(to, amount, pin, idemKey, note) {
    return wireEmitAck('wallet:transfer', {
        to,
        amount,
        pin,
        idemKey,
        note
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_game_systems_wire_ts_b87edf15._.js.map