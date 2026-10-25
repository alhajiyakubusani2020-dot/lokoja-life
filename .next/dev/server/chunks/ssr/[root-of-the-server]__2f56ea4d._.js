module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2d$debug$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm-debug/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
;
const useWireStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(()=>({
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
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const token = undefined;
    const s = undefined;
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2f56ea4d._.js.map