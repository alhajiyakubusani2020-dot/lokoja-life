(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/game/world3d/geo.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// LOKOJA LIFE — REAL GEOGRAPHY LOADER (SILK II deferred work #1, shipped)
// ------------------------------------------------------------------------
// GENERATED data, DO NOT hand-edit the tables — they live in
// `public/world/geo-v1.bin` now, encoded by scripts/geo/encode-geo-bin.ts
// from the original OpenStreetMap extract (c) OSM contributors, ODbL.
// Source generator: scripts/geo/generate_world.py.
//
// 1 world unit = 26 m. North = -Z. World center (0,0) = 6.753E, 7.790N.
// Roads: 2655 ways (752 km real, measured), rivers 16, bridges 16.
//
// THE EXACTNESS LAW: the binary stores every value as round(v × SCALE)
// (coords ×10, widths ×100, yaw ×1000) with the encoder refusing any
// unclean residue; decoding is one IEEE-754 division, so every decoded
// element `===` the original literal. PROVEN at encode time on 70,828
// comparisons (0 failures) — scripts/geo/encode-geo-bin.ts — and guarded
// at runtime by scripts/test-geo-bin.ts against the committed manifest.
//
// THE BOOT LAW: the arrays below start EMPTY. `initGeo()` fetches + decodes
// + fills them exactly once, and the world chunk's dynamic loader awaits
// that gate BEFORE any module that derives from them (layout.ts, schools.ts)
// is ever evaluated — module-scope derivations see filled arrays, nothing
// else in the app ever pays for this data (map-first sessions never
// download it; the SW runtime-caches it immutable after the first world).
__turbopack_context__.s([
    "GEO_BRIDGES",
    ()=>GEO_BRIDGES,
    "GEO_LOOPS",
    ()=>GEO_LOOPS,
    "GEO_RIVERS",
    ()=>GEO_RIVERS,
    "GEO_ROADS",
    ()=>GEO_ROADS,
    "GEO_WORLD_HALF",
    ()=>GEO_WORLD_HALF,
    "decodeGeoBin",
    ()=>decodeGeoBin,
    "geoIsReady",
    ()=>geoIsReady,
    "initGeo",
    ()=>initGeo,
    "initGeoWith",
    ()=>initGeoWith
]);
const GEO_WORLD_HALF = 310;
let GEO_ROADS = [];
let GEO_RIVERS = [];
let GEO_BRIDGES = [];
let GEO_LOOPS = [];
/* --------------------------- the binary schema ----------------------------- */ const CLS_TABLE = [
    'highway',
    'major',
    'secondary',
    'minor',
    'track',
    'foot'
];
const STYLE_TABLE = [
    'asphalt',
    'laterite',
    'dirt',
    'path'
];
const S = 10 // coordinate scale (1 decimal place, |v| ≤ 310)
;
const W = 100 // width scale (≤ 2 decimal places)
;
const Y = 1000 // yaw scale (≤ 3 decimal places)
;
const GEO_BIN_URL = '/world/geo-v1.bin';
/* ------------------------------- the decoder ------------------------------- */ /* mirrors scripts/geo/encode-geo-bin.ts bit-for-bit — same zigzag varint,
 * same section order, same scales. Pure: no fetch, no module state. */ function zigDecode(z) {
    return z & 1 ? -(z + 1) / 2 : z / 2;
}
function decodeGeoBin(buffer) {
    const view = new DataView(buffer);
    const u8 = new Uint8Array(buffer);
    const off = {
        i: 0
    };
    const magic = new TextDecoder().decode(u8.subarray(0, 4));
    if (magic !== 'LGOB') throw new Error(`geo.bin: bad magic ${magic}`);
    off.i = 4;
    const ver = view.getUint8(off.i++);
    if (ver !== 1) throw new Error(`geo.bin: bad version ${ver}`);
    const nRoads = view.getUint32(off.i, true);
    off.i += 4;
    const nRivers = view.getUint16(off.i, true);
    off.i += 2;
    const nBridges = view.getUint16(off.i, true);
    off.i += 2;
    const nLoops = view.getUint16(off.i, true);
    off.i += 2;
    const nStr = view.getUint16(off.i, true);
    off.i += 2;
    const dec = new TextDecoder();
    const strings = [];
    for(let i = 0; i < nStr; i++){
        const len = view.getUint8(off.i++);
        strings.push(dec.decode(u8.subarray(off.i, off.i + len)));
        off.i += len;
    }
    const str = (i)=>i < 0 ? null : strings[i];
    const readVarint = ()=>{
        let n = 0;
        let shift = 0;
        for(;;){
            const byte = u8[off.i++];
            n |= (byte & 0x7f) << shift;
            if (!(byte & 0x80)) break;
            shift += 7;
        }
        return zigDecode(n);
    };
    const readPts = (n)=>{
        const pts = [];
        let px = 0;
        let pz = 0;
        for(let i = 0; i < n; i++){
            const x = i === 0 ? readVarint() : px + readVarint();
            const z = i === 0 ? readVarint() : pz + readVarint();
            px = x;
            pz = z;
            pts.push([
                x / S,
                z / S
            ]);
        }
        return pts;
    };
    const roads = [];
    for(let i = 0; i < nRoads; i++){
        const osm = view.getUint32(off.i, true);
        off.i += 4;
        const name = str(view.getInt16(off.i, true));
        off.i += 2;
        const cls = CLS_TABLE[view.getUint8(off.i++)];
        const style = STYLE_TABLE[view.getUint8(off.i++)];
        const w = view.getInt16(off.i, true) / W;
        off.i += 2;
        const flags = view.getUint8(off.i++);
        const n = view.getUint16(off.i, true);
        off.i += 2;
        roads.push({
            osm,
            name,
            cls,
            style,
            w,
            major: !!(flags & 1),
            bridge: !!(flags & 2),
            pts: readPts(n)
        });
    }
    const rivers = [];
    for(let i = 0; i < nRivers; i++){
        const id = str(view.getInt16(off.i, true));
        off.i += 2;
        const name = str(view.getInt16(off.i, true));
        off.i += 2;
        const w = view.getInt16(off.i, true) / W;
        off.i += 2;
        const n = view.getUint16(off.i, true);
        off.i += 2;
        rivers.push({
            id,
            name,
            w,
            pts: readPts(n)
        });
    }
    const bridges = [];
    for(let i = 0; i < nBridges; i++){
        const x = view.getInt16(off.i, true) / S;
        off.i += 2;
        const z = view.getInt16(off.i, true) / S;
        off.i += 2;
        const yaw = view.getInt16(off.i, true) / Y;
        off.i += 2;
        const len = view.getInt16(off.i, true) / S;
        off.i += 2;
        const w = view.getInt16(off.i, true) / W;
        off.i += 2;
        const cls = STYLE_TABLE[view.getUint8(off.i++)];
        bridges.push({
            x,
            z,
            yaw,
            len,
            w,
            cls
        });
    }
    const loops = [];
    for(let i = 0; i < nLoops; i++){
        const n = view.getUint16(off.i, true);
        off.i += 2;
        loops.push(readPts(n));
    }
    if (off.i !== buffer.byteLength) throw new Error(`geo.bin: trailing bytes (${off.i}/${buffer.byteLength})`);
    return {
        roads,
        rivers,
        bridges,
        loops
    };
}
/* ------------------------------- the gate ---------------------------------- */ let initPromise = null;
function initGeoWith(buffer) {
    const d = decodeGeoBin(buffer);
    GEO_ROADS = d.roads;
    GEO_RIVERS = d.rivers;
    GEO_BRIDGES = d.bridges;
    GEO_LOOPS = d.loops;
}
function initGeo() {
    if (!initPromise) {
        initPromise = fetch(GEO_BIN_URL).then((r)=>{
            if (!r.ok) throw new Error(`geo.bin: HTTP ${r.status}`);
            return r.arrayBuffer();
        }).then((buf)=>{
            initGeoWith(buf);
        }).catch((e)=>{
            initPromise = null; // a failed boot retries on the next attempt
            throw e;
        });
    }
    return initPromise;
}
function geoIsReady() {
    return GEO_ROADS.length > 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/world3d/geo-gate.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "openWorldGeo",
    ()=>openWorldGeo,
    "warmWorldChunk",
    ()=>warmWorldChunk
]);
/**
 * SILK II — THE WORLD GEO GATE
 * ----------------------------
 * The world's data (roads/rivers/bridges/loops) now lives in
 * `/world/geo-v1.bin` (60KB binary vs 432KB decimal text — element-exact
 * round-trip proven on 70,828 comparisons). layout.ts and schools.ts
 * derive their module-scope structures from those arrays, so the data
 * MUST be filled before either module is evaluated.
 *
 * This gate is the barrier: the Dashboard's next/dynamic loader and the
 * idle preload BOTH route through `openWorldGeo()` — the geo chunk (this
 * file + geo.ts) evaluates first, the fetch fires, and only after the
 * arrays are filled does `import('../world/WorldTab')` evaluate the
 * three.js chunk with layout.ts inside. The first `import()` of the gate
 * and the WorldTab import overlap the three.js download, so on a warm
 * cache the geo fetch is effectively free; on a cold boot it rides under
 * the bigger chunk's transfer shadow.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/geo.ts [app-client] (ecmascript)");
;
let gate = null;
function openWorldGeo() {
    if (!gate) {
        gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initGeo"])().catch((e)=>{
            gate = null; // the next world attempt retries the fetch
            throw e;
        });
    }
    return gate;
}
function warmWorldChunk() {
    void openWorldGeo().then(()=>__turbopack_context__.A("[project]/src/components/game/world/WorldTab.tsx [app-client] (ecmascript, async loader)")).catch(()=>{
    /* a failed prefetch is harmless — the on-demand path retries */ });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/world3d/geo-gate.ts [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/game/world3d/geo-gate.ts [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_game_world3d_2546d2ef._.js.map