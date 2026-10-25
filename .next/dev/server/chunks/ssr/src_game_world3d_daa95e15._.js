module.exports = [
"[project]/src/game/world3d/geo.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACACIA_TONES",
    ()=>ACACIA_TONES,
    "ANCHORS",
    ()=>ANCHORS,
    "ANCHOR_BY_ID",
    ()=>ANCHOR_BY_ID,
    "BAOBAB_TONES",
    ()=>BAOBAB_TONES,
    "BRIDGES",
    ()=>BRIDGES,
    "BUILDINGS",
    ()=>BUILDINGS,
    "CIVIC_CAMPUS",
    ()=>CIVIC_CAMPUS,
    "CONFLUENCE_POINT",
    ()=>CONFLUENCE_POINT,
    "DISTRICTS",
    ()=>DISTRICTS,
    "DOORS",
    ()=>DOORS,
    "GRASS",
    ()=>GRASS,
    "GRASS_TONES",
    ()=>GRASS_TONES,
    "LAMPS",
    ()=>LAMPS,
    "MAP_SCALE",
    ()=>MAP_SCALE,
    "MOUNT_PATTI",
    ()=>MOUNT_PATTI,
    "NPC_ZONES",
    ()=>NPC_ZONES,
    "PALM_TONES",
    ()=>PALM_TONES,
    "POINTS_OF_INTEREST",
    ()=>POINTS_OF_INTEREST,
    "RIVERS",
    ()=>RIVERS,
    "RIVER_Q_RADIUS",
    ()=>RIVER_Q_RADIUS,
    "ROADS",
    ()=>ROADS,
    "ROAD_RENDER_W",
    ()=>ROAD_RENDER_W,
    "ROCKS",
    ()=>ROCKS,
    "ROCK_TONES",
    ()=>ROCK_TONES,
    "ROOF_TONES",
    ()=>ROOF_TONES,
    "SCHOOL_SITES",
    ()=>SCHOOL_SITES,
    "STALLS",
    ()=>STALLS,
    "STALL_TONES",
    ()=>STALL_TONES,
    "TRAFFIC_LOOPS",
    ()=>TRAFFIC_LOOPS,
    "TREE_TONES",
    ()=>TREE_TONES,
    "WALK_BOUND",
    ()=>WALK_BOUND,
    "WALL_TONES",
    ()=>WALL_TONES,
    "WATER_Y",
    ()=>WATER_Y,
    "WORLD_HALF",
    ()=>WORLD_HALF,
    "__silk2BruteHeightAt",
    ()=>__silk2BruteHeightAt,
    "buildingClearOfRoad",
    ()=>buildingClearOfRoad,
    "heightAt",
    ()=>heightAt,
    "inCivicCampus",
    ()=>inCivicCampus,
    "inSchoolYard",
    ()=>inSchoolYard,
    "makeRng",
    ()=>makeRng,
    "riverInfo",
    ()=>riverInfo,
    "riverNearest",
    ()=>riverNearest,
    "riverQueryStats",
    ()=>riverQueryStats,
    "roadDistance",
    ()=>roadDistance,
    "roadDistanceMajors",
    ()=>roadDistanceMajors,
    "roadGap",
    ()=>roadGap,
    "roadGapMajors",
    ()=>roadGapMajors,
    "worldX",
    ()=>worldX,
    "worldZ",
    ()=>worldZ
]);
/**
 * LOKOJA LIFE — 3D World Layout (Stage 6: Real Geography)
 * ---------------------------------------------------------
 * The world is now built on the REAL Lokoja road network (OpenStreetMap,
 * ODbL — the same dataset Google Maps/Earth render). `world3d/geo.ts` is
 * GENERATED from raw OSM tiles by `scripts/geo/` and holds every mapped
 * road (2,656 ways, ~752 km (measured)), the Niger/Benue/streams, bridges and place
 * names, projected so that 1 world unit = 26 m and north = -Z.
 *
 * This file fuses that real geography with the GAMEPLAY layer:
 *  - district anchors derived from the LOCATIONS registry (same ids, same
 *    mapX/mapY grid the 2D map uses — 3D world and map can never disagree)
 *  - the Patti summit trail (the real hike route, gameplay-walkable)
 *  - plateaus, buildings, the savanna tree guild (broadleaf/palm/acacia/
 *    baobab), Patti boulders, grass, lamps, stalls, traffic loops
 *
 * Nothing in this file mutates game state and nothing here knows about
 * the economy: it is pure geometry + placement, generated once from a
 * fixed seed so every player sees the same Lokoja.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/schools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/geo.ts [app-ssr] (ecmascript)");
;
;
;
const MAP_SCALE = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_WORLD_HALF"] * 2 / 100;
const WORLD_HALF = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_WORLD_HALF"];
const WALK_BOUND = WORLD_HALF - 18;
const WATER_Y = -1.1;
function worldX(mapX) {
    return (mapX - 50) * MAP_SCALE;
}
function worldZ(mapY) {
    return (mapY - 50) * MAP_SCALE;
}
function makeRng(seed) {
    let a = seed >>> 0;
    return ()=>{
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
/** flat plateau radius so every anchor has a buildable, walkable site */ const PLATEAU_R = 14;
const ANCHORS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].map((l)=>({
        id: l.id,
        location: l,
        x: worldX(l.mapX),
        z: worldZ(l.mapY),
        plateauH: 0,
        y: 0
    }));
const ANCHOR_BY_ID = Object.fromEntries(ANCHORS.map((a)=>[
        a.id,
        a
    ]));
const MOUNT_PATTI = ANCHOR_BY_ID['mount-patti'];
const RIVERS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_RIVERS"].map((r)=>({
        id: r.id,
        name: r.name,
        width: r.w,
        points: r.pts
    }));
const CONFLUENCE_POINT = RIVERS[1].points[RIVERS[1].points.length - 1];
const RIVER_Q_RADIUS = 34;
/** uniform query-grid cell, shared by the river/anchor/school grids */ const QCELL = 32;
/** deterministic numeric cell key — avoids per-lookup string building */ function qcellKey(cx, cz) {
    return (cx + 512) * 1024 + (cz + 512);
}
const RIVER_GRID = new Map();
// built ONCE, in segment order — idx ascending is the brute-force scan order
{
    let idx = 0;
    for (const r of RIVERS){
        for(let i = 0; i < r.points.length - 1; i++){
            const [ax, az] = r.points[i];
            const [bx, bz] = r.points[i + 1];
            const s = {
                idx: idx++,
                ax,
                az,
                bx,
                bz,
                half: r.width / 2,
                minX: Math.min(ax, bx),
                maxX: Math.max(ax, bx),
                minZ: Math.min(az, bz),
                maxZ: Math.max(az, bz)
            };
            const minX = Math.floor(Math.min(ax, bx) / QCELL);
            const maxX = Math.floor(Math.max(ax, bx) / QCELL);
            const minZ = Math.floor(Math.min(az, bz) / QCELL);
            const maxZ = Math.floor(Math.max(az, bz) / QCELL);
            for(let cx = minX; cx <= maxX; cx++){
                for(let cz = minZ; cz <= maxZ; cz++){
                    const k = qcellKey(cx, cz);
                    const arr = RIVER_GRID.get(k);
                    if (arr) arr.push(s);
                    else RIVER_GRID.set(k, [
                        s
                    ]);
                }
            }
        }
    }
}// per-query duplicate marker — REUSED across queries via an epoch stamp
// (single-threaded world3d, queries never nest; epoch wraps reset the array)
const Q_SEEN = new Int32Array(RIVERS.reduce((n, r)=>n + r.points.length - 1, 0));
let qEpoch = 0;
function riverNearest(x, z) {
    qEpoch = qEpoch + 1 | 0;
    if (qEpoch === 0) {
        Q_SEEN.fill(0);
        qEpoch = 1;
    }
    let evaluated = 0;
    let cells = 0;
    let best = Infinity;
    let bestHalf = 0;
    let bestCx = x;
    let bestCz = z;
    let bestIdx = -1;
    // evaluate one candidate segment under the (d, idx) winner law — the
    // formula is the brute-force scan body, byte for byte. The AABB gate is
    // an EXACT pre-reject: if the segment's box lies beyond `best` on either
    // axis, every point of it is farther than best (no beat, no tie), so the
    // lexicographic winner is untouched — only the hypot body is skipped.
    const scan = (s)=>{
        if (Q_SEEN[s.idx] === qEpoch) return; // segment spans several query cells
        if (best < Infinity && (s.maxX < x - best || s.minX > x + best || s.maxZ < z - best || s.minZ > z + best)) return;
        Q_SEEN[s.idx] = qEpoch;
        evaluated++;
        const dx = s.bx - s.ax;
        const dz = s.bz - s.az;
        const len2 = dx * dx + dz * dz;
        let t = len2 === 0 ? 0 : ((x - s.ax) * dx + (z - s.az) * dz) / len2;
        t = Math.max(0, Math.min(1, t));
        const px = s.ax + dx * t;
        const pz = s.az + dz * t;
        const d = Math.hypot(x - px, z - pz);
        if (d < best || d === best && s.idx < bestIdx) {
            best = d;
            bestHalf = s.half;
            bestCx = px;
            bestCz = pz;
            bestIdx = s.idx;
        }
    };
    // phase 1 — the contract square: sees every segment with d ≤ RIVER_Q_RADIUS.
    // Per-cell rect prune (exact-safe: a segment inside a cell lies at or beyond
    // the cell's rect distance, so rx > best means it can neither beat nor tie
    // the current winner — the lexicographic (d, idx) min is untouched).
    const minX = Math.floor((x - RIVER_Q_RADIUS) / QCELL);
    const maxX = Math.floor((x + RIVER_Q_RADIUS) / QCELL);
    const minZ = Math.floor((z - RIVER_Q_RADIUS) / QCELL);
    const maxZ = Math.floor((z + RIVER_Q_RADIUS) / QCELL);
    for(let cx = minX; cx <= maxX; cx++){
        const rx = x < cx * QCELL ? cx * QCELL - x : x > (cx + 1) * QCELL ? x - (cx + 1) * QCELL : 0;
        for(let cz = minZ; cz <= maxZ; cz++){
            if (best < Infinity) {
                const rz = z < cz * QCELL ? cz * QCELL - z : z > (cz + 1) * QCELL ? z - (cz + 1) * QCELL : 0;
                if (rx > best || rz > best) continue;
            }
            const arr = RIVER_GRID.get(qcellKey(cx, cz));
            if (!arr) continue;
            cells++;
            for(let i = 0; i < arr.length; i++)scan(arr[i]);
        }
    }
    // phase 2 — ring expansion for far points (nothing within the contract
    // radius): grow the square until no unscanned cell can hold a strictly
    // closer segment. A segment outside the square grown by g rings lies
    // strictly beyond `clear + g*QCELL`, so the stop is exact; the strict
    // per-cell rect prune only ever skips cells that cannot beat OR TIE best.
    if (best > RIVER_Q_RADIUS) {
        const clear = Math.min(x - minX * QCELL, (maxX + 1) * QCELL - x, z - minZ * QCELL, (maxZ + 1) * QCELL - z);
        for(let g = 1; g <= 40; g++){
            const loX = minX - g;
            const hiX = maxX + g;
            const loZ = minZ - g;
            const hiZ = maxZ + g;
            const loPrev = g - 1;
            for(let cx = loX; cx <= hiX; cx++){
                for(let cz = loZ; cz <= hiZ; cz++){
                    // skip cells already scanned in earlier rings
                    if (cx >= minX - loPrev && cx <= maxX + loPrev && cz >= minZ - loPrev && cz <= maxZ + loPrev) continue;
                    const rx = x < cx * QCELL ? cx * QCELL - x : x > (cx + 1) * QCELL ? x - (cx + 1) * QCELL : 0;
                    const rz = z < cz * QCELL ? cz * QCELL - z : z > (cz + 1) * QCELL ? z - (cz + 1) * QCELL : 0;
                    if (best < Infinity && (rx > best || rz > best)) continue;
                    const arr = RIVER_GRID.get(qcellKey(cx, cz));
                    if (!arr) continue;
                    cells++;
                    for(let i = 0; i < arr.length; i++)scan(arr[i]);
                }
            }
            if (best < clear + g * QCELL) break;
        }
    }
    return {
        d: best,
        halfWidth: bestHalf,
        cx: bestCx,
        cz: bestCz,
        evaluated,
        cells
    };
}
function riverInfo(x, z) {
    const q = riverNearest(x, z);
    return {
        d: q.d,
        halfWidth: q.halfWidth
    };
}
function riverQueryStats(x, z) {
    const q = riverNearest(x, z);
    return {
        evaluated: q.evaluated,
        cells: q.cells
    };
}
/** the real hike/touring route up Mount Patti — switchbacks to the summit */ const PATTI_TRAIL = {
    osm: 0,
    name: 'Patti Road',
    cls: 'track',
    style: 'dirt',
    w: 0.26,
    major: false,
    pts: [
        [
            -51.7,
            -85.2
        ],
        [
            -60,
            -91
        ],
        [
            -69,
            -100
        ],
        [
            -66,
            -111
        ],
        [
            -75,
            -119
        ],
        [
            -83,
            -129
        ],
        [
            -85,
            -136
        ]
    ]
};
const ROADS = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_ROADS"].map((r)=>({
            osm: r.osm,
            name: r.name,
            cls: r.cls,
            style: r.style,
            w: r.w,
            major: r.major,
            pts: r.pts
        })),
    PATTI_TRAIL
];
const ROAD_RENDER_W = {
    highway: 6.2,
    major: 5.2,
    secondary: 4.6,
    minor: 2.6,
    track: 2.8,
    path: 1.6,
    foot: 1.6
};
/* ------------------------- road spatial grid (fast) ------------------------ */ const GRID_CELL = 16;
const SEG_GRID = new Map();
function gridAdd(s) {
    const minX = Math.floor(Math.min(s.ax, s.bx) / GRID_CELL);
    const maxX = Math.floor(Math.max(s.ax, s.bx) / GRID_CELL);
    const minZ = Math.floor(Math.min(s.az, s.bz) / GRID_CELL);
    const maxZ = Math.floor(Math.max(s.az, s.bz) / GRID_CELL);
    for(let cx = minX; cx <= maxX; cx++){
        for(let cz = minZ; cz <= maxZ; cz++){
            const k = `${cx}:${cz}`;
            let arr = SEG_GRID.get(k);
            if (!arr) {
                arr = [];
                SEG_GRID.set(k, arr);
            }
            arr.push(s);
        }
    }
}
for (const r of ROADS){
    const half = (ROAD_RENDER_W[r.cls] ?? 2.2) / 2;
    for(let i = 0; i < r.pts.length - 1; i++){
        const [ax, az] = r.pts[i];
        const [bx, bz] = r.pts[i + 1];
        gridAdd({
            ax,
            az,
            bx,
            bz,
            half,
            major: r.major
        });
    }
}
const ROAD_Q_CAP = 30;
function segsNear(x, z, radius) {
    const out = [];
    const minX = Math.floor((x - radius) / GRID_CELL);
    const maxX = Math.floor((x + radius) / GRID_CELL);
    const minZ = Math.floor((z - radius) / GRID_CELL);
    const maxZ = Math.floor((z + radius) / GRID_CELL);
    for(let cx = minX; cx <= maxX; cx++){
        for(let cz = minZ; cz <= maxZ; cz++){
            const arr = SEG_GRID.get(`${cx}:${cz}`);
            if (arr) out.push(...arr);
        }
    }
    return out;
}
function segDist(s, x, z) {
    const dx = s.bx - s.ax;
    const dz = s.bz - s.az;
    const len2 = dx * dx + dz * dz;
    let t = len2 === 0 ? 0 : ((x - s.ax) * dx + (z - s.az) * dz) / len2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(x - (s.ax + dx * t), z - (s.az + dz * t));
}
function roadDistance(x, z) {
    let best = ROAD_Q_CAP;
    for (const s of segsNear(x, z, ROAD_Q_CAP)){
        const d = segDist(s, x, z);
        if (d < best) best = d;
    }
    return best;
}
function roadDistanceMajors(x, z) {
    let best = ROAD_Q_CAP;
    for (const s of segsNear(x, z, ROAD_Q_CAP)){
        if (!s.major) continue;
        const d = segDist(s, x, z);
        if (d < best) best = d;
    }
    return best;
}
function roadGap(x, z, radius = ROAD_Q_CAP) {
    let best = radius;
    for (const s of segsNear(x, z, radius)){
        const d = segDist(s, x, z) - s.half;
        if (d < best) best = d;
    }
    return best;
}
function roadGapMajors(x, z, radius = ROAD_Q_CAP) {
    let best = radius;
    for (const s of segsNear(x, z, radius)){
        if (!s.major) continue;
        const d = segDist(s, x, z) - s.half;
        if (d < best) best = d;
    }
    return best;
}
function buildingClearOfRoad(x, z, w, d) {
    const cornerR = Math.hypot(w, d) * 0.5;
    // M2 — inside the fenced civic campus the mapped MINOR lanes stop at the
    // fence (satellite-true, the school-compound precedent): only the major
    // classes bind the law there. Majors/highways still bind EVERYWHERE.
    if (inCivicCampus(x, z)) return roadGapMajors(x, z) >= cornerR + 0.7;
    return roadGap(x, z) >= cornerR + 0.3 && roadGapMajors(x, z) >= cornerR + 0.7;
}
function inSchoolYard(x, z) {
    for (const sp of SCHOOL_SITES){
        if (Math.hypot(sp.x - x, sp.z - z) < sp.plateauR * 0.92) return true;
    }
    return false;
}
const CIVIC_CAMPUS = {
    /** fence rect (world units) */ minX: -135.5,
    maxX: -120.5,
    minZ: 7,
    maxZ: 31,
    /** gate gap on the EAST fence, facing the GRA anchor */ gateZmin: 18,
    gateZmax: 20.6
};
function inCivicCampus(x, z) {
    return x >= CIVIC_CAMPUS.minX && x <= CIVIC_CAMPUS.maxX && z >= CIVIC_CAMPUS.minZ && z <= CIVIC_CAMPUS.maxZ;
}
/* --------------------------------- terrain --------------------------------- */ function smoothstep(a, b, t) {
    const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return x * x * (3 - 2 * x);
}
/** deterministic layered sine noise — no dependencies, stable forever */ function baseNoise(x, z) {
    return Math.sin(x * 0.045 + z * 0.02) * 0.45 + Math.sin(x * 0.017 - z * 0.051 + 1.7) * 0.6 + Math.sin((x + z) * 0.028 + 4.1) * 0.35;
}
/** terrace band period in height units — the real Patti's laterite strata */ const PATTI_TERRACE_PERIOD = 7.4;
/**
 * Sedimentary terracing for Mount Patti. The real hill is a chain of small
 * plateaus, not a smooth cone: heights inside the mound's influence are
 * gently pulled toward band centres so the flanks read as strata from the
 * plain while the risers between bands stay steep. The pull is capped at
 * ~0.45u so walking and driving the summit trail stays perfectly smooth.
 */ function pattiTerrace(h) {
    if (h < 3.2 || h > 31) return h;
    const k = h / PATTI_TERRACE_PERIOD;
    const f = k - Math.floor(k);
    const flat = smoothstep(0.18, 0.42, f) * (1 - smoothstep(0.58, 0.82, f));
    return h - (f - 0.5) * PATTI_TERRACE_PERIOD * flat * 0.6;
}
// plateau heights must exist before heightAt is ever called
for (const a of ANCHORS){
    a.plateauH = Math.max(0.4, baseNoise(a.x, a.z) * 0.55 + (a.id === 'mount-patti' ? 30 : 0));
}
/* --------------------------- school site relaxation ---------------------------
 * Final school-site placement runs HERE (it needs the legacy anchor geometry
 * this module owns): campus-vs-campus separation, clearance from the legacy
 * anchors, and a rim clamp that keeps every compound fully inside the
 * playable circle — iterated together so the clamp can never re-bunch the
 * Felele-corridor campuses. The 2D map grid derives from the FINAL positions.
 * --------------------------------------------------------------------------- */ function relaxSchoolSites() {
    const sites = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_SITES_PROJECTED"].map((s)=>({
            ...s
        }));
    // the CENTER must sit far enough in that the whole compound (gate, front
    // wall, doors, gate palms) stays inside the playable circle
    const rimFor = (s)=>272 - s.d / 2 - 1.5;
    const outerR = (s)=>Math.max(s.plateauR, Math.hypot(s.w, s.d) / 2) + 4;
    for(let sweep = 0; sweep < 14; sweep++){
        // campus ↔ campus separation
        for(let i = 0; i < sites.length; i++){
            for(let j = i + 1; j < sites.length; j++){
                const a = sites[i];
                const b = sites[j];
                const minD = outerR(a) + outerR(b) + 6;
                const dx = b.x - a.x;
                const dz = b.z - a.z;
                const d = Math.hypot(dx, dz);
                if (d >= minD || d < 1e-4) continue;
                const push = (minD - d) / 2;
                const ux = dx / d;
                const uz = dz / d;
                a.x -= ux * push;
                a.z -= uz * push;
                b.x += ux * push;
                b.z += uz * push;
            }
        }
        // school plateaus must not stomp the legacy anchors
        for (const s of sites){
            for (const a of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEGACY_ANCHOR_XY"]){
                const dx = s.x - a.x;
                const dz = s.z - a.z;
                const d = Math.hypot(dx, dz);
                const minD = s.plateauR + 17;
                if (d >= minD || d < 1e-4) continue;
                const push = minD - d;
                s.x += dx / d * push;
                s.z += dz / d * push;
            }
        }
        // rim clamp INSIDE the loop so separation survives
        for (const s of sites){
            const rim = Math.hypot(s.x, s.z);
            const limit = rimFor(s);
            if (rim > limit) {
                s.x = s.x / rim * limit;
                s.z = s.z / rim * limit;
            }
        }
    }
    // final map grid from the FINAL positions — map pin and 3D gate agree forever
    for (const s of sites){
        s.mapX = 50 + s.x / MAP_SCALE;
        s.mapY = 50 + s.z / MAP_SCALE;
    }
    return sites;
}
const SCHOOL_SITES = relaxSchoolSites();
// the school ANCHORS (same stable ids) and the 2D map registry adopt the
// final relaxed positions — anchors, map pins, travel fares and the 3D
// gate all read the one truth
for (const a of ANCHORS){
    const s = SCHOOL_SITES.find((sp)=>sp.id === a.id);
    if (!s) continue;
    a.x = s.x;
    a.z = s.z;
    a.plateauH = Math.max(0.4, baseNoise(a.x, a.z) * 0.55);
    const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][s.id];
    if (loc) {
        loc.mapX = s.mapX;
        loc.mapY = s.mapY;
    }
}
/** school sites get their own flat buildable plateau (Stage 7 compounds) */ const SCHOOL_PLATEAU_H = {};
for (const sp of SCHOOL_SITES){
    SCHOOL_PLATEAU_H[sp.id] = Math.max(0.4, baseNoise(sp.x, sp.z) * 0.55);
}
function pointGridAdd(grid, gp) {
    const minX = Math.floor((gp.p.x - gp.r) / QCELL);
    const maxX = Math.floor((gp.p.x + gp.r) / QCELL);
    const minZ = Math.floor((gp.p.z - gp.r) / QCELL);
    const maxZ = Math.floor((gp.p.z + gp.r) / QCELL);
    for(let cx = minX; cx <= maxX; cx++){
        for(let cz = minZ; cz <= maxZ; cz++){
            const k = qcellKey(cx, cz);
            const arr = grid.get(k);
            if (arr) arr.push(gp);
            else grid.set(k, [
                gp
            ]);
        }
    }
}
/**
 * Fill `out` (reused scratch, zero allocation) with every grid point whose
 * cell overlaps [x±radius]² — a superset of every point within `radius` —
 * sorted by insertion index with duplicates dropped. Returns the count.
 *
 * DEDUP IS MARK-FIRST: a point that spans several query cells arrives once
 * per cell, so every candidate is admitted by the epoch mark BEFORE the
 * sorted insert — the sort then never sees a duplicate and the scratch
 * arrays stay exactly as long as the unique candidate set. (An earlier
 * drop-after-shift variant left ghost tail entries behind every `continue`
 * and double-blended plateau anchors — the m-optim equality sweep caught it.)
 */ let pqEpoch = 0;
function pointGridQuery(grid, marks, outIdx, out, x, z, radius) {
    pqEpoch = pqEpoch + 1 | 0;
    if (pqEpoch === 0) {
        marks.fill(0);
        pqEpoch = 1;
    }
    out.length = 0;
    outIdx.length = 0;
    const minX = Math.floor((x - radius) / QCELL);
    const maxX = Math.floor((x + radius) / QCELL);
    const minZ = Math.floor((z - radius) / QCELL);
    const maxZ = Math.floor((z + radius) / QCELL);
    for(let cx = minX; cx <= maxX; cx++){
        for(let cz = minZ; cz <= maxZ; cz++){
            const arr = grid.get(qcellKey(cx, cz));
            if (!arr) continue;
            for(let i = 0; i < arr.length; i++){
                const gp = arr[i];
                if (marks[gp.idx] === pqEpoch) continue; // spans several cells — admitted already
                marks[gp.idx] = pqEpoch;
                // insertion sort by idx (tiny candidate sets, no duplicates remain)
                let j = out.length;
                while(j > 0 && outIdx[j - 1] > gp.idx){
                    outIdx[j] = outIdx[j - 1];
                    out[j] = out[j - 1];
                    j--;
                }
                outIdx[j] = gp.idx;
                out[j] = gp;
            }
        }
    }
    return out.length;
}
const ANCHOR_GRID = new Map();
const ANCHOR_MARKS = new Int32Array(ANCHORS.length);
for(let i = 0; i < ANCHORS.length; i++){
    pointGridAdd(ANCHOR_GRID, {
        idx: i,
        p: ANCHORS[i],
        r: PLATEAU_R * 1.9
    });
}
const ANCHOR_Q = [];
const ANCHOR_Q_IDX = [];
const SCHOOL_GRID = new Map();
const SCHOOL_MARKS = new Int32Array(SCHOOL_SITES.length);
let SCHOOL_Q_RADIUS = 0;
for(let i = 0; i < SCHOOL_SITES.length; i++){
    const r = SCHOOL_SITES[i].plateauR * 2.0;
    if (r > SCHOOL_Q_RADIUS) SCHOOL_Q_RADIUS = r;
    pointGridAdd(SCHOOL_GRID, {
        idx: i,
        p: SCHOOL_SITES[i],
        r
    });
}
const SCHOOL_Q = [];
const SCHOOL_Q_IDX = [];
function heightAt(x, z) {
    // rolling savanna base
    let h = baseNoise(x, z) * 0.55;
    // gentle rise toward the world rim (natural boundary)
    const rim = Math.hypot(x, z);
    h += smoothstep(WALK_BOUND - 26, WALK_BOUND + 14, rim) * 14;
    // Mount Patti — the guardian ridge at its REAL position north-west of
    // the town, ~480 m above the Niger plain. The plateau top carries the
    // summit anchor (Lugard's rest house site).
    const pd = Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z);
    const pattiRise = smoothstep(85, 8, pd) // 1 at summit → 0 at the plains
    ;
    h += Math.pow(pattiRise, 1.3) * 34;
    // sedimentary terracing on the Patti flanks (strata bands, see above)
    if (pd < 96) h = pattiTerrace(h);
    // anchor plateaus — flat buildable/walkable sites
    // (SILK II: point-grid candidates in idx order — the blend is sequential,
    // so the ORDER of the original array scan is part of the contract)
    const nA = pointGridQuery(ANCHOR_GRID, ANCHOR_MARKS, ANCHOR_Q_IDX, ANCHOR_Q, x, z, PLATEAU_R * 1.9);
    for(let i = 0; i < nA; i++){
        const a = ANCHOR_Q[i].p;
        const d = Math.hypot(x - a.x, z - a.z);
        if (d < PLATEAU_R * 1.9) {
            const w = 1 - smoothstep(PLATEAU_R * 0.62, PLATEAU_R * 1.9, d);
            h = h * (1 - w) + a.plateauH * w;
        }
    }
    // river carving — big rivers carve wide valleys, streams cut narrow gullies
    const { d, halfWidth } = riverInfo(x, z);
    const margin = Math.min(9, 2 + halfWidth);
    if (d < halfWidth + margin) {
        const carve = 1 - smoothstep(halfWidth - 2, halfWidth + margin, d);
        h = h * (1 - carve) + (WATER_Y - 1.7) * carve;
    }
    // school compound plateaus — carved AFTER the rivers so no mapped stream
    // can gully through a school yard (a stream that meets a compound simply
    // runs to its fence; the yard itself stays honest, flat and dry).
    // Fully flat across the whole compound footprint, fading to the plain beyond.
    // (SILK II: point-grid candidates in idx order, same sequential contract)
    const nS = pointGridQuery(SCHOOL_GRID, SCHOOL_MARKS, SCHOOL_Q_IDX, SCHOOL_Q, x, z, SCHOOL_Q_RADIUS);
    for(let i = 0; i < nS; i++){
        const sp = SCHOOL_Q[i].p;
        const dS = Math.hypot(x - sp.x, z - sp.z);
        if (dS < sp.plateauR * 2.0) {
            const w = 1 - smoothstep(sp.plateauR * 1.02, sp.plateauR * 2.0, dS);
            h = h * (1 - w) + SCHOOL_PLATEAU_H[sp.id] * w;
        }
    }
    return h;
}
function __silk2BruteHeightAt(x, z) {
    const bruteRiver = (px, pz)=>{
        let best = Infinity;
        let halfWidth = 0;
        for (const r of RIVERS){
            const pts = r.points;
            for(let i = 0; i < pts.length - 1; i++){
                const [ax, az] = pts[i];
                const [bx, bz] = pts[i + 1];
                const dx = bx - ax;
                const dz = bz - az;
                const len2 = dx * dx + dz * dz;
                let t = len2 === 0 ? 0 : ((px - ax) * dx + (pz - az) * dz) / len2;
                t = Math.max(0, Math.min(1, t));
                const qx = ax + dx * t;
                const qz = az + dz * t;
                const d = Math.hypot(px - qx, pz - qz);
                if (d < best) {
                    best = d;
                    halfWidth = r.width / 2;
                }
            }
        }
        return {
            d: best,
            halfWidth
        };
    };
    let h = baseNoise(x, z) * 0.55;
    const rim = Math.hypot(x, z);
    h += smoothstep(WALK_BOUND - 26, WALK_BOUND + 14, rim) * 14;
    const pd = Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z);
    const pattiRise = smoothstep(85, 8, pd);
    h += Math.pow(pattiRise, 1.3) * 34;
    if (pd < 96) h = pattiTerrace(h);
    for (const a of ANCHORS){
        const d = Math.hypot(x - a.x, z - a.z);
        if (d < PLATEAU_R * 1.9) {
            const w = 1 - smoothstep(PLATEAU_R * 0.62, PLATEAU_R * 1.9, d);
            h = h * (1 - w) + a.plateauH * w;
        }
    }
    const { d, halfWidth } = bruteRiver(x, z);
    const margin = Math.min(9, 2 + halfWidth);
    if (d < halfWidth + margin) {
        const carve = 1 - smoothstep(halfWidth - 2, halfWidth + margin, d);
        h = h * (1 - carve) + (WATER_Y - 1.7) * carve;
    }
    for (const sp of SCHOOL_SITES){
        const dS = Math.hypot(x - sp.x, z - sp.z);
        if (dS < sp.plateauR * 2.0) {
            const w = 1 - smoothstep(sp.plateauR * 1.02, sp.plateauR * 2.0, dS);
            h = h * (1 - w) + SCHOOL_PLATEAU_H[sp.id] * w;
        }
    }
    return h;
}
// final anchor ground heights
for (const a of ANCHORS){
    a.y = heightAt(a.x, a.z);
}
const BRIDGES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_BRIDGES"].map((b)=>({
        x: b.x,
        z: b.z,
        y: WATER_Y + 1.5,
        rotY: b.yaw,
        length: b.len,
        width: b.w,
        cls: b.cls === 'asphalt' ? 'asphalt' : b.cls === 'laterite' ? 'laterite' : 'dirt'
    }));
const KIND_BY_ID = {
    home: 'home',
    'kpata-market': 'market',
    'ganaja-junction': 'junction',
    confluence: 'landmark-river',
    'mount-patti': 'landmark-hill',
    'historic-lokoja': 'historic',
    'government-area': 'gov',
    'university-area': 'university',
    'food-area': 'food',
    'transport-area': 'park',
    // Stage 7 — the schools are their own district kind (bespoke compounds)
    'ful-felele': 'school',
    'ful-adankolo': 'school',
    'ksp-felele': 'school',
    'salem-university': 'school',
    'college-nursing': 'school',
    'crowther-memorial': 'school',
    'gyb-model-adankolo': 'school',
    'faithview-academy': 'school',
    'al-azhar-college': 'school',
    'baptist-high': 'school',
    'julitola-intl': 'school',
    'christfield-school': 'school'
};
const DISTRICTS = ANCHORS.map((a)=>({
        id: a.id,
        kind: KIND_BY_ID[a.id] ?? 'home',
        x: a.x,
        z: a.z,
        y: a.y,
        radius: a.id === 'mount-patti' || a.id === 'confluence' ? 34 : 30
    }));
const WALL_TONES = [
    '#e8dcc3',
    '#d9b98a',
    '#c96f3b',
    '#9fb98a',
    '#b9a06a',
    '#d8cbb0',
    '#a8683f',
    '#cbb682'
];
const ROOF_TONES = [
    '#8a4a2a',
    '#6e4530',
    '#7a6a55',
    '#96543a',
    '#5a6e5c',
    '#8a3a28'
];
function isClearOf(x, z, r, w, d) {
    if (riverInfo(x, z).d < 16) return false;
    // school compounds own their ground — never scatter a generic house inside
    if (SCHOOL_SITES.some((sp)=>Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + r)) return false;
    // THE ROAD-CLEARANCE LAW — the whole footprint stays off the tarmac
    return buildingClearOfRoad(x, z, w, d);
}
function buildDistrictBuildings(d, rng) {
    const out = [];
    const push = (b)=>out.push({
            ...b,
            y: heightAt(b.x, b.z)
        });
    /**
   * Anchor-placed signature buildings (the family house, market sheds, the
   * civic block…) get the SAME road-clearance law as everything else — if
   * their hand-set spot would touch a carriageway they slide outward along
   * a deterministic spoke scan until the whole footprint is clear.
   */ const pushSafe = (b)=>{
        const ok = (x, z)=>riverInfo(x, z).d >= 16 && !SCHOOL_SITES.some((sp)=>Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + Math.max(b.w, b.d) * 0.72) && buildingClearOfRoad(x, z, b.w, b.d) && !out.some((o)=>Math.hypot(o.x - x, o.z - z) < (Math.max(o.w, o.d) + Math.max(b.w, b.d)) * 0.62) && Math.hypot(x, z) <= WALK_BOUND - 6;
        if (!ok(b.x, b.z)) {
            outer: for(let step = 1; step <= 14; step++){
                for(let k = 0; k < 12; k++){
                    const dir = k / 12 * Math.PI * 2 + 0.2617;
                    const x = b.x + Math.cos(dir) * step * 1.5;
                    const z = b.z + Math.sin(dir) * step * 1.5;
                    if (ok(x, z)) {
                        b = {
                            ...b,
                            x,
                            z
                        };
                        break outer;
                    }
                }
            }
        }
        // absolute law: if even the spoke scan found no clear spot, the building
        // does not get built standing on the road — it is skipped entirely
        if (ok(b.x, b.z)) push(b);
    };
    const tryPlace = (radiusMin, radiusMax, w, dd, h, kind, roof, rotJitter = 0.5)=>{
        // DETERMINISTIC RING SCAN — exhaustive first-fit: every radius step from
        // the anchor outward, 24 spokes around, the first fully-legal spot wins.
        // The road-clearance law is absolute, so density yields to correctness.
        for(let rad = radiusMin; rad <= radiusMax; rad += 1.5){
            for(let k = 0; k < 24; k++){
                const ang = k / 24 * Math.PI * 2;
                const x = d.x + Math.cos(ang) * rad;
                const z = d.z + Math.sin(ang) * rad;
                if (Math.hypot(x, z) > WALK_BOUND - 6) continue;
                if (!isClearOf(x, z, Math.max(w, dd) * 0.72, w, dd)) continue;
                // avoid overlapping earlier buildings
                if (out.some((b)=>Math.hypot(b.x - x, b.z - z) < (Math.max(b.w, b.d) + Math.max(w, dd)) * 0.62)) continue;
                push({
                    x,
                    z,
                    w,
                    d: dd,
                    h,
                    rotY: ang + Math.PI / 2 + (rng() - 0.5) * rotJitter,
                    kind,
                    tone: Math.floor(rng() * WALL_TONES.length),
                    roof,
                    roofTone: Math.floor(rng() * ROOF_TONES.length)
                });
                return;
            }
        }
    };
    switch(d.kind){
        case 'home':
            {
                // the player's place — proud compound beside the anchor clearing
                // (roads terminate at the anchor, so the centre stays open)
                pushSafe({
                    x: d.x + 6.5,
                    z: d.z - 5,
                    w: 6.4,
                    d: 5.4,
                    h: 3.4,
                    rotY: -0.5,
                    kind: 'house',
                    tone: 5,
                    roof: 'hip',
                    roofTone: 0
                });
                for(let i = 0; i < 5; i++)tryPlace(13, 28, 4.6 + rng() * 1.6, 4 + rng(), 2.9, 'house', 'hip');
                break;
            }
        case 'market':
            {
                // permanent sheds beside the clearing; dense stall rows are placed separately
                pushSafe({
                    x: d.x - 10,
                    z: d.z - 6,
                    w: 9,
                    d: 5.6,
                    h: 3.8,
                    rotY: 0.4,
                    kind: 'shed',
                    tone: 2,
                    roof: 'shed',
                    roofTone: 4
                });
                pushSafe({
                    x: d.x + 11,
                    z: d.z + 7,
                    w: 8,
                    d: 5,
                    h: 3.4,
                    rotY: -0.3,
                    kind: 'shed',
                    tone: 1,
                    roof: 'shed',
                    roofTone: 3
                });
                for(let i = 0; i < 5; i++)tryPlace(14, 30, 4.4, 4, 3, 'shop', 'flat');
                break;
            }
        case 'food':
            {
                for(let i = 0; i < 5; i++)tryPlace(13, 28, 4.6, 4.2, 3.1, 'shop', 'flat');
                for(let i = 0; i < 3; i++)tryPlace(14, 29, 4, 3.6, 2.7, 'house', 'hip');
                break;
            }
        case 'junction':
            {
                for(let i = 0; i < 8; i++)tryPlace(13, 30, 5 + rng() * 2.4, 4.4, 3.6 + rng() * 1.4, 'shop', 'flat');
                break;
            }
        case 'park':
            {
                pushSafe({
                    x: d.x,
                    z: d.z,
                    w: 12,
                    d: 6.4,
                    h: 4,
                    rotY: 0.2,
                    kind: 'shed',
                    tone: 3,
                    roof: 'shed',
                    roofTone: 1
                });
                for(let i = 0; i < 4; i++)tryPlace(14, 29, 4.8, 4, 3, 'shop', 'flat');
                break;
            }
        case 'historic':
            {
                // colonial relics — pale walls, dark hip roofs
                pushSafe({
                    x: d.x - 6,
                    z: d.z + 2,
                    w: 8.4,
                    d: 6,
                    h: 4.6,
                    rotY: 0.9,
                    kind: 'colonial',
                    tone: 0,
                    roof: 'hip',
                    roofTone: 2
                });
                pushSafe({
                    x: d.x + 7,
                    z: d.z - 4,
                    w: 6.6,
                    d: 5.4,
                    h: 4.1,
                    rotY: -0.6,
                    kind: 'colonial',
                    tone: 5,
                    roof: 'hip',
                    roofTone: 2
                });
                for(let i = 0; i < 2; i++)tryPlace(14, 28, 5.4, 4.8, 3.6, 'colonial', 'hip', 0.3);
                break;
            }
        case 'gov':
            {
                // M2 — THE CIVIC MESH. The hand-set clearing died under the road law
                // (this quarter is blanket road-dense — probe: best gap 3.4u), so the
                // five signature buildings stand on their own fenced campus ~30u west
                // (THE GOVERNMENT GROUNDS), where the majors-clear plain allows them.
                // Placement is direct and hand-set (the school-compound trust level);
                // the campus law (majors never touched) is asserted below and the M1
                // suite re-verifies every corner. A building that would ever break
                // the majors law is SKIPPED — nothing stands on tarmac, period.
                const campus = [
                    // rotY = π/2 (front faces EAST, the gate): w runs along Z, d along X
                    [
                        'gov-house',
                        -128,
                        26,
                        9.5,
                        6.5,
                        6.8
                    ],
                    [
                        'kgirs',
                        -132.2,
                        11,
                        5.4,
                        4.4,
                        4.4
                    ],
                    [
                        'nepa',
                        -123.8,
                        11,
                        5.4,
                        4.4,
                        4.2
                    ],
                    [
                        'police',
                        -132.2,
                        17.5,
                        5.6,
                        4.6,
                        4.6
                    ],
                    [
                        'efcc',
                        -123.8,
                        17.5,
                        5.4,
                        4.4,
                        4.2
                    ]
                ];
                for (const [tag, x, z, w, dd, h] of campus){
                    if (!inCivicCampus(x, z) || !buildingClearOfRoad(x, z, w, dd)) continue;
                    if (riverInfo(x, z).d < 16) continue;
                    push({
                        x,
                        z,
                        w,
                        d: dd,
                        h,
                        rotY: Math.PI / 2,
                        kind: 'block',
                        tone: 6,
                        roof: 'flat',
                        roofTone: 4,
                        tag
                    });
                }
                // the microfinance bank keeps its old spot by the anchor — pushSafe
                // slides it as the road law demands (never inside the campus)
                pushSafe({
                    x: d.x,
                    z: d.z,
                    w: 12.5,
                    d: 7.5,
                    h: 6.2,
                    rotY: 0,
                    kind: 'block',
                    tone: 6,
                    roof: 'flat',
                    roofTone: 4
                });
                break;
            }
        case 'university':
            {
                pushSafe({
                    x: d.x - 5,
                    z: d.z + 3,
                    w: 10.5,
                    d: 6,
                    h: 5.4,
                    rotY: 0.3,
                    kind: 'hostel',
                    tone: 4,
                    roof: 'flat',
                    roofTone: 5
                });
                for(let i = 0; i < 5; i++)tryPlace(13, 29, 4.4, 4, 3.1, 'shop', 'flat');
                break;
            }
        case 'school':
            {
                break;
            }
        case 'landmark-river':
        case 'landmark-hill':
            break;
    }
    return out;
}
const BUILDINGS = DISTRICTS.flatMap((d)=>buildDistrictBuildings(d, makeRng(1860 + d.x * 7 + d.z)));
function doorFor(interiorId, locationId, b, fallback) {
    if (b) {
        const out = 0.95 + b.d / 2;
        const x = b.x + Math.sin(b.rotY) * out;
        const z = b.z + Math.cos(b.rotY) * out;
        return {
            interiorId,
            locationId,
            x,
            z,
            y: heightAt(x, z),
            rotY: b.rotY
        };
    }
    const a = ANCHOR_BY_ID[locationId];
    const x = a.x + fallback.dx;
    const z = a.z + fallback.dz;
    return {
        interiorId,
        locationId,
        x,
        z,
        y: heightAt(x, z),
        rotY: 0
    };
}
const DOORS = (()=>{
    // the player's house — the signature home building nearest its design spot
    // (pushSafe may have nudged it off a road, so match by nearest, not exact)
    const homeA = ANCHOR_BY_ID['home'];
    const homeSpot = BUILDINGS.filter((b)=>b.kind === 'house' && b.tone === 5 && Math.hypot(b.x - (homeA.x + 6.5), b.z - (homeA.z - 5)) < 14).sort((a, b)=>Math.hypot(a.x - (homeA.x + 6.5), a.z - (homeA.z - 5)) - Math.hypot(b.x - (homeA.x + 6.5), b.z - (homeA.z - 5)))[0] ?? null;
    // Mama's buka — the first shop placed in the food district
    const foodShop = BUILDINGS.find((b)=>b.kind === 'shop' && Math.hypot(b.x - ANCHOR_BY_ID['food-area'].x, b.z - ANCHOR_BY_ID['food-area'].z) < 34) ?? null;
    // the provision store — the first shed in the market district
    const marketShed = BUILDINGS.find((b)=>b.kind === 'shed' && Math.hypot(b.x - ANCHOR_BY_ID['kpata-market'].x, b.z - ANCHOR_BY_ID['kpata-market'].z) < 34) ?? null;
    // Stage 5-b — the campus gym: a shop building in the university district
    const uniGym = BUILDINGS.find((b)=>b.kind === 'shop' && Math.hypot(b.x - ANCHOR_BY_ID['university-area'].x, b.z - ANCHOR_BY_ID['university-area'].z) < 34) ?? null;
    // Stage 5-b — the microfinance bank: the untagged civic block at the gov
    // anchor (the nearest plain 'block' to the clearing centre)
    const govA = ANCHOR_BY_ID['government-area'];
    const govBlock = BUILDINGS.filter((b)=>b.kind === 'block' && !b.tag && Math.hypot(b.x - govA.x, b.z - govA.z) < 34).sort((a, b)=>Math.hypot(a.x - govA.x, a.z - govA.z) - Math.hypot(b.x - govA.x, b.z - govA.z))[0] ?? null;
    // M2 — the civic mesh offices (matched by tag — pushSafe may slide them,
    // the door follows the building wherever the law puts it)
    const byTag = (t)=>BUILDINGS.find((b)=>b.tag === t) ?? null;
    // Stage 5-b — the lounge: the SECOND shop in the food strip (the first is Mama's)
    const foodShop2 = BUILDINGS.filter((b)=>b.kind === 'shop' && Math.hypot(b.x - ANCHOR_BY_ID['food-area'].x, b.z - ANCHOR_BY_ID['food-area'].z) < 34)[1] ?? null;
    return [
        doorFor('home-interior', 'home', homeSpot, {
            dx: 5,
            dz: 2
        }),
        doorFor('mamas-kitchen', 'food-area', foodShop, {
            dx: -4,
            dz: -4.5
        }),
        doorFor('kpata-shop', 'kpata-market', marketShed, {
            dx: -10,
            dz: -6
        }),
        doorFor('peak-gym', 'university-area', uniGym, {
            dx: 6.5,
            dz: -4.5
        }),
        doorFor('lokoja-microfinance', 'government-area', govBlock, {
            dx: -6.5,
            dz: -5.5
        }),
        doorFor('golden-nights', 'food-area', foodShop2, {
            dx: 4.5,
            dz: 4.5
        }),
        // M2 — the civic mesh: revenue, power, police, anti-graft
        doorFor('kgirs-office', 'government-area', byTag('kgirs'), {
            dx: -11,
            dz: 7
        }),
        doorFor('nepa-office', 'government-area', byTag('nepa'), {
            dx: 12,
            dz: 6
        }),
        doorFor('police-station', 'government-area', byTag('police'), {
            dx: -12,
            dz: -7
        }),
        doorFor('efcc-office', 'government-area', byTag('efcc'), {
            dx: 13,
            dz: -8
        })
    ];
})();
const TREE_TONES = [
    '#3d6b2f',
    '#4c7a2e',
    '#5d8a37',
    '#6ea344',
    '#446e3a'
];
const PALM_TONES = [
    '#5d8a37',
    '#6ea344',
    '#4c7a2e'
];
const ACACIA_TONES = [
    '#6e7a34',
    '#7d8a3c',
    '#8a8f45'
];
const BAOBAB_TONES = [
    '#5d7038',
    '#6a7c40'
];
const ROCK_TONES = [
    '#8f7f63',
    '#7a6a50',
    '#9a8868'
];
const ROCKS = (()=>{
    const rng = makeRng(61223);
    const out = [];
    let guard = 0;
    while(out.length < 110 && guard < 9000){
        guard++;
        const ang = rng() * Math.PI * 2;
        const rad = 12 + Math.pow(rng(), 0.72) * 88 // denser toward the crown
        ;
        const x = MOUNT_PATTI.x + Math.cos(ang) * rad;
        const z = MOUNT_PATTI.z + Math.sin(ang) * rad;
        const y = heightAt(x, z);
        if (y < 2.2) continue; // the Niger plain has no Patti stone
        const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4;
        // steep flanks and the cliff bands carry the rock; gentle foot slopes get few
        if (slope < 0.26 && rng() > 0.18) continue;
        if (roadDistance(x, z) < 4.6) continue; // trail + streets stay walkable
        if (Math.hypot(x - MOUNT_PATTI.x, z - MOUNT_PATTI.z) < PLATEAU_R * 1.75) continue;
        if (ANCHORS.some((a)=>a.id !== 'mount-patti' && Math.hypot(a.x - x, a.z - z) < 15)) continue;
        if (SCHOOL_SITES.some((sp)=>Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 3)) continue;
        if (BUILDINGS.some((b)=>Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.75 + 2.2)) continue;
        out.push({
            x,
            z,
            y: y - 0.3,
            scale: 0.5 + Math.pow(rng(), 1.6) * 2.1,
            rotY: rng() * Math.PI * 2,
            tone: Math.floor(rng() * ROCK_TONES.length),
            squash: 0.55 + rng() * 0.4
        });
    }
    return out;
})();
const GRASS_TONES = [
    '#7a9a3a',
    '#8aa844',
    '#9db050',
    '#b3b45c',
    '#c2b45f'
];
const GRASS = (()=>{
    const rng = makeRng(90210);
    const out = [];
    let guard = 0;
    while(out.length < 800 && guard < 150000){
        guard++;
        const x = (rng() * 2 - 1) * (WALK_BOUND - 2);
        const z = (rng() * 2 - 1) * (WALK_BOUND - 2);
        const y = heightAt(x, z);
        if (y < WATER_Y + 0.4) continue;
        if (y > 28) continue; // rocky Patti crown stays bare
        // steep ground sheds the terrain mesh's faceting — tufts would float
        const slope = (Math.abs(heightAt(x + 2, z) - y) + Math.abs(heightAt(x, z + 2) - y)) / 4;
        if (slope > 0.45) continue;
        const river = riverInfo(x, z);
        if (river.d < river.halfWidth + 2.5) continue;
        if (roadDistance(x, z) < 5.2) continue;
        if (ANCHORS.some((a)=>Math.hypot(a.x - x, a.z - z) < 12.5)) continue;
        if (SCHOOL_SITES.some((sp)=>Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 1.5)) continue;
        if (BUILDINGS.some((b)=>Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.7 + 1.5)) continue;
        // moisture gradient — greener close to water
        const moisture = Math.max(0, 1 - river.d / 60);
        // THE RIVERSIDE BAND — these 800 exist to feed the riverside Flower
        // dots (WorldTerrain walks this array and keeps only tufts within
        // halfWidth + 11 of a river — the pool IS the flower band, so every
        // candidate the Flowers walk samples passes its river law; the wide
        // plains belong to flora.ts's 10k tufts
        if (river.d > river.halfWidth + 11) continue;
        const tone = Math.min(GRASS_TONES.length - 1, Math.floor((1 - moisture) * GRASS_TONES.length * (0.75 + rng() * 0.5)));
        // sink tufts: the crown pokes out, the base is safely under the mesh
        out.push({
            x,
            z,
            y: y - 0.35 * slope - 0.1,
            scale: 0.7 + rng() * 0.7,
            tone
        });
    }
    return out;
})();
const LAMPS = (()=>{
    const SPACING = {
        highway: 13,
        major: 14,
        secondary: 15,
        minor: 19
    };
    const out = [];
    const seen = new Set();
    const put = (x, z, rotY, tall, serveX, serveZ, serveHalf, force = false)=>{
        const k = `${Math.round(x / 3.5)}:${Math.round(z / 3.5)}`;
        if (!force && seen.has(k)) return;
        if (heightAt(x, z) <= WATER_Y + 0.15) return; // never standing in carved water ground
        if (inSchoolYard(x, z) || inCivicCampus(x, z)) return; // yards clip mapped streets — no lamps either
        if (Math.hypot(x, z) > WALK_BOUND) return;
        // THE LAW: the lamp must clear EVERY carriageway — its own shoulder spot
        // is invalid where a highway/feeder road runs through it (dual carriageways)
        if (roadGap(x, z) < 0.3) return;
        seen.add(k);
        // THE OUTREACH LAW — the arm reaches toward the carriageway it serves,
        // stopping 0.35 short of the sample so the lens hangs over the inner
        // lane (real outer-rim masts carry longer brackets; quack is a lamp
        // whose light never touches its road)
        const serveDist = Math.hypot(serveX - x, serveZ - z);
        const reach = Math.min(tall ? 3.4 : 3.0, Math.max(1.05, serveDist - 0.35));
        out.push({
            x,
            z,
            y: heightAt(x, z),
            rotY,
            tall,
            reach,
            serveX,
            serveZ,
            serveHalf
        });
    };
    // corner masts on every real bridge — on dry bank ground just past each
    // abutment, arms over the deck so the crossing is lit. Stream valleys carve
    // wide, so each mast searches a small along×across grid for a spot that is
    // dry AND clear of every carriageway.
    for (const b of BRIDGES){
        const dirX = Math.sin(b.rotY);
        const dirZ = Math.cos(b.rotY);
        const nx = -dirZ;
        const nz = dirX;
        for (const end of [
            -1,
            1
        ]){
            for (const sd of [
                -1,
                1
            ]){
                for(let along = 1.0; along <= 5.6; along += 0.9){
                    let placed = false;
                    for(let side = b.width / 2 + 0.55; side <= b.width / 2 + 4.6; side += 0.5){
                        const lx = b.x + dirX * ((b.length + 3) / 2 + along) * end + nx * side * sd;
                        const lz = b.z + dirZ * ((b.length + 3) / 2 + along) * end + nz * side * sd;
                        if (heightAt(lx, lz) <= WATER_Y + 0.15) continue;
                        if (roadGap(lx, lz) < 0.3) continue;
                        if (inSchoolYard(lx, lz)) continue;
                        // serve the deck point NEAREST this mast: project the mast onto
                        // the deck centreline (clamped to the span) — the arm lights the
                        // crossing at the abutment, not some far mid-span fantasy
                        const alongDeck = Math.max(-b.length / 2, Math.min(b.length / 2, ((b.length + 3) / 2 + along) * end));
                        // every bridge mast is a MAST — tall pole, long bracket, the
                        // reach clamp that suits a structure lighting a wide deck
                        put(lx, lz, Math.atan2(-nx * sd, -nz * sd), true, b.x + dirX * alongDeck, b.z + dirZ * alongDeck, b.width / 2 + 1.0, true);
                        placed = true;
                        break;
                    }
                    if (placed) break;
                }
            }
        }
    }
    for (const r of ROADS){
        const spacing = SPACING[r.cls];
        if (!spacing) continue;
        const half = (ROAD_RENDER_W[r.cls] ?? 2.2) / 2;
        const offset = half + 0.62;
        const tall = r.cls === 'highway';
        let side = 1;
        let acc = spacing * 0.45;
        for(let i = 0; i < r.pts.length - 1; i++){
            const [ax, az] = r.pts[i];
            const [bx, bz] = r.pts[i + 1];
            const seg = Math.hypot(bx - ax, bz - az);
            const nx = -(bz - az) / Math.max(seg, 1e-6);
            const nz = (bx - ax) / Math.max(seg, 1e-6);
            while(acc < seg){
                const t = acc / seg;
                const px = ax + (bx - ax) * t;
                const pz = az + (bz - az) * t;
                // minors only through the built-up fabric around the districts
                if (r.cls !== 'minor' || DISTRICTS.some((dd)=>Math.hypot(dd.x - px, dd.z - pz) < 58)) {
                    // candidate shoulders: near rim first, then farther out on either
                    // side — dual carriageways swallow the inner shoulders, so their
                    // lighting lands on the outer rim (exactly how real ones are lit)
                    const rims = [
                        [
                            nx * offset * side,
                            nz * offset * side
                        ],
                        [
                            -nx * offset * side,
                            -nz * offset * side
                        ],
                        [
                            nx * (offset + 0.55) * side,
                            nz * (offset + 0.55) * side
                        ],
                        [
                            nx * (offset + 1.0) * side,
                            nz * (offset + 1.0) * side
                        ],
                        [
                            -nx * (offset + 0.7) * side,
                            -nz * (offset + 0.7) * side
                        ]
                    ];
                    for (const [ox, oz] of rims){
                        const lx = px + ox;
                        const lz = pz + oz;
                        if (roadGap(lx, lz) < 0.3) continue;
                        put(lx, lz, Math.atan2(px - lx, pz - lz), tall, px, pz, half);
                        break;
                    }
                    side = -side;
                }
                acc += spacing;
            }
            acc -= seg;
        }
    }
    return out.slice(0, 1500);
})();
const STALL_TONES = [
    '#c94f2e',
    '#d99a2b',
    '#2e7d5b',
    '#b03a5b',
    '#3a6ea3',
    '#8a5aa3'
];
/**
 * The job-board spots — the POI props at the end of this file stand here
 * (anchor + fixed offset). Lifted above STALLS so the stall placement can
 * keep its counters clear of the boards without a forward reference.
 */ const POI_BOARD_SPOTS = [
    {
        locationId: 'kpata-market',
        dx: 3.4,
        dz: 3.2
    },
    {
        locationId: 'government-area',
        dx: -3.6,
        dz: 3.4
    },
    {
        locationId: 'food-area',
        dx: -3.2,
        dz: -3.6
    },
    {
        locationId: 'transport-area',
        dx: 3.6,
        dz: 3.2
    }
];
const STALLS = (()=>{
    const rng = makeRng(4402);
    const out = [];
    const rows = [
        {
            cx: ANCHOR_BY_ID['kpata-market'].x,
            cz: ANCHOR_BY_ID['kpata-market'].z,
            n: 14,
            spread: 17,
            rot: 0.35
        },
        {
            cx: ANCHOR_BY_ID['food-area'].x,
            cz: ANCHOR_BY_ID['food-area'].z,
            n: 10,
            spread: 14,
            rot: -0.5
        },
        {
            cx: ANCHOR_BY_ID['ganaja-junction'].x,
            cz: ANCHOR_BY_ID['ganaja-junction'].z,
            n: 8,
            spread: 12,
            rot: 1.1
        }
    ];
    // THE STALL LAW — a stall never stands on the carriageway, in carved water,
    // on a job-board spot, inside a building, or on top of another stall.
    // Grid candidates that fail it slide along a deterministic spoke search
    // (16 compass directions × 9 radii out to 11.7u, start angle seeded per
    // candidate — the pushSafe pattern at a stall's scale, and within its
    // reach: the building law slides up to 14 spokes × 1.5u. The market rows
    // straddle real mapped streets, so the slide has to reach the pockets
    // between them); a stall with NO legal spoke is dropped, same absolute
    // end law as the buildings. Bounded by the row sizes; fully seeded.
    const boards = POI_BOARD_SPOTS.map(({ locationId, dx, dz })=>{
        const a = ANCHOR_BY_ID[locationId];
        return {
            x: a.x + dx,
            z: a.z + dz
        };
    });
    const stallOk = (x, z)=>heightAt(x, z) > WATER_Y + 0.15 && roadGap(x, z) >= 0.45 && boards.every((b)=>Math.hypot(b.x - x, b.z - z) >= 2.4) && BUILDINGS.every((b)=>Math.hypot(b.x - x, b.z - z) >= Math.max(b.w, b.d) * 0.5 + 1.2) && out.every((o)=>Math.hypot(o.x - x, o.z - z) >= 2.0) // market rows pack tight — counters may nearly touch
    ;
    for (const row of rows){
        for(let i = 0; i < row.n; i++){
            const gx = i % 4 - 1.5;
            const gz = Math.floor(i / 4) - 1;
            const x0 = row.cx + Math.cos(row.rot) * (gx * 4.6) - Math.sin(row.rot) * (gz * 5.4);
            const z0 = row.cz + Math.sin(row.rot) * (gx * 4.6) + Math.cos(row.rot) * (gz * 5.4);
            const start = rng() * Math.PI * 2 // drawn for EVERY candidate — the stream stays aligned
            ;
            let x = x0;
            let z = z0;
            if (!stallOk(x0, z0)) {
                let found = false;
                outer: for (const r of [
                    1.5,
                    2.7,
                    3.9,
                    5.1,
                    6.3,
                    8.1,
                    9.3,
                    10.5,
                    11.7
                ]){
                    for(let k = 0; k < 16; k++){
                        const dir = start + k / 16 * Math.PI * 2;
                        const sx = x0 + Math.cos(dir) * r;
                        const sz = z0 + Math.sin(dir) * r;
                        if (stallOk(sx, sz)) {
                            x = sx;
                            z = sz;
                            found = true;
                            break outer;
                        }
                    }
                }
                if (!found) continue; // no legal ground — no stall
            }
            out.push({
                x,
                z,
                y: heightAt(x, z),
                rotY: row.rot + (rng() - 0.5) * 0.3,
                tone: Math.floor(rng() * STALL_TONES.length)
            });
        }
    }
    return out;
})();
const NPC_ZONES = [
    'kpata-market',
    'food-area',
    'ganaja-junction',
    'home',
    'transport-area',
    'university-area',
    'historic-lokoja',
    // the schools — students in the yard, teachers at the block
    'ful-felele',
    'ful-adankolo',
    'ksp-felele',
    'crowther-memorial',
    'gyb-model-adankolo',
    'college-nursing'
].map((id)=>{
    const a = ANCHOR_BY_ID[id];
    return {
        locationId: id,
        x: a.x,
        z: a.z,
        y: a.y,
        radius: 15
    };
});
const POINTS_OF_INTEREST = POI_BOARD_SPOTS.map(({ locationId, dx, dz })=>{
    const a = ANCHOR_BY_ID[locationId];
    const x = a.x + dx;
    const z = a.z + dz;
    return {
        id: `board-${locationId}`,
        kind: 'jobboard',
        locationId,
        x,
        z,
        y: heightAt(x, z),
        rotY: Math.atan2(a.x - x, a.z - z)
    };
});
const TRAFFIC_LOOPS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_LOOPS"];
}),
"[project]/src/game/world3d/schools.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALL_DOORS",
    ()=>ALL_DOORS,
    "SCHOOL_BOXES",
    ()=>SCHOOL_BOXES,
    "SCHOOL_COMPOUNDS",
    ()=>SCHOOL_COMPOUNDS,
    "SCHOOL_DOORS",
    ()=>SCHOOL_DOORS,
    "SCHOOL_INTERIORS",
    ()=>SCHOOL_INTERIORS,
    "SCHOOL_INTERIOR_IDS",
    ()=>SCHOOL_INTERIOR_IDS,
    "SCHOOL_TREES",
    ()=>SCHOOL_TREES,
    "isSchoolCollider",
    ()=>isSchoolCollider
]);
/**
 * LOKOJA LIFE — School Compounds (Stage 7)
 * ------------------------------------------
 * Deterministic builders that turn the real-school registry
 * (data/schools.ts) into walkable, enterable 3D compounds:
 *   - perimeter wall with a real gate gap + gatehouse + painted name board
 *   - classroom blocks (long blocks, front veranda, pillars, louvre band)
 *   - admin / library / computer lab / head office blocks per school kind
 *   - swept sand assembly ground + flagpole, football pitch with markings
 *   - compound trees (mango/neem + palms at the gate) and a laterite
 *     driveway down to the nearest REAL road (the one it meets in Lokoja)
 *   - enterable interiors: classrooms with desks + chairs + blackboards,
 *     staff room, principal's office, library, computer lab, lecture theatre
 *
 * Everything is pure geometry + placement derived from the same heightAt
 * the roads and buildings use, so nothing floats or sinks. No economy,
 * no state — the study action flows through the store like every other.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/schools.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/geo.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
;
;
;
/** local (lx, lz) → world, using the same yaw convention as layout (front = +Z) */ function toWorld(f, lx, lz) {
    const c = Math.cos(f.rotY);
    const s = Math.sin(f.rotY);
    return [
        f.x + lx * c + lz * s,
        f.z - lx * s + lz * c
    ];
}
/* ------------------------- plan footprints (exterior) ------------------------- */ /** exterior footprint per building kind — `small` for compact compounds */ const PLAN_FOOTPRINT = {
    senate: {
        w: 9,
        d: 6.6,
        h: 6.6
    },
    library: {
        w: 10,
        d: 5.6,
        h: 4.4,
        small: {
            w: 5.4,
            d: 4.2,
            h: 3.6
        }
    },
    faculty: {
        w: 7.8,
        d: 5.4,
        h: 4.2
    },
    'computer-lab': {
        w: 8.2,
        d: 5.4,
        h: 4,
        small: {
            w: 5,
            d: 4.2,
            h: 3.6
        }
    },
    'science-lab': {
        w: 8.4,
        d: 5.4,
        h: 4,
        small: {
            w: 5.4,
            d: 4.2,
            h: 3.6
        }
    },
    'lecture-theatre': {
        w: 7.6,
        d: 6.2,
        h: 5,
        small: {
            w: 6,
            d: 4.6,
            h: 4.2
        }
    },
    hostel: {
        w: 11.6,
        d: 5.2,
        h: 4.6,
        small: {
            w: 7.6,
            d: 4.6,
            h: 4
        }
    },
    watchtower: {
        w: 1.7,
        d: 1.7,
        h: 7.2
    },
    'health-sciences': {
        w: 9,
        d: 5.6,
        h: 4.8
    },
    workshop: {
        w: 8.6,
        d: 5.4,
        h: 4.6
    },
    chapel: {
        w: 7,
        d: 5.2,
        h: 4.8
    },
    mosque: {
        w: 5.4,
        d: 4.8,
        h: 4.4
    },
    'assembly-hall': {
        w: 8.4,
        d: 5.6,
        h: 5,
        small: {
            w: 5.8,
            d: 4.2,
            h: 4.2
        }
    },
    canteen: {
        w: 6,
        d: 4.4,
        h: 3.8,
        small: {
            w: 3.6,
            d: 3.4,
            h: 3.2
        }
    },
    clinic: {
        w: 5,
        d: 4.2,
        h: 3.6,
        small: {
            w: 3.6,
            d: 3.6,
            h: 3.2
        }
    },
    'demo-lab': {
        w: 7,
        d: 5,
        h: 4
    },
    admin: {
        w: 6.6,
        d: 5,
        h: 3.8,
        small: {
            w: 5,
            d: 4.2,
            h: 3.6
        }
    }
};
/** plan kind → the exterior box kind the renderer draws */ function planBoxKind(kind, schoolKind) {
    switch(kind){
        case 'senate':
            return 'senate';
        case 'library':
            return 'library';
        case 'faculty':
            return 'faculty';
        case 'computer-lab':
        case 'science-lab':
            return 'lab';
        case 'lecture-theatre':
            return 'theatre';
        case 'hostel':
            return 'hostel';
        case 'watchtower':
            return 'watchtower';
        case 'health-sciences':
            return 'healthsci';
        case 'workshop':
            return 'workshop';
        case 'chapel':
            return 'chapel';
        case 'mosque':
            return 'mosque';
        case 'assembly-hall':
            return 'hall';
        case 'canteen':
            return 'canteen';
        case 'clinic':
            return 'clinic';
        case 'demo-lab':
            return 'demo';
        case 'admin':
            return schoolKind === 'secondary' ? 'office' : 'admin';
    }
}
/** nearest point on the REAL road network (geo roads, pre-consumed) */ function nearestRoadPoint(x, z) {
    let best = {
        x,
        z
    };
    let bestD = Infinity;
    for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GEO_ROADS"]){
        for(let i = 0; i < r.pts.length - 1; i++){
            const [ax, az] = r.pts[i];
            const [bx, bz] = r.pts[i + 1];
            const dx = bx - ax;
            const dz = bz - az;
            const len2 = dx * dx + dz * dz;
            let t = len2 === 0 ? 0 : ((x - ax) * dx + (z - az) * dz) / len2;
            t = Math.max(0, Math.min(1, t));
            const px = ax + dx * t;
            const pz = az + dz * t;
            const d = Math.hypot(x - px, z - pz);
            if (d < bestD) {
                bestD = d;
                best = {
                    x: px,
                    z: pz
                };
            }
        }
    }
    return best;
}
/** wall height / thickness — classic school fence with coping */ const WALL_H = 2.1;
const WALL_T = 0.34;
function buildCompound(site) {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(77000 + site.name.length * 131 + Math.round(site.x * 7));
    const boxes = [];
    const doors = [];
    const trees = [];
    const kind = site.kind;
    // face the nearest REAL road — the gate opens toward the street it knows
    const road = nearestRoadPoint(site.x, site.z);
    let rotY = Math.atan2(road.x - site.x, road.z - site.z);
    // pick the compound position: a scored spiral around the relaxed site —
    // first candidate whose whole footprint clears the major carriageways
    // wins; otherwise the best-scoring (max majors clearance, rings close to
    // the true position). Minor streets may cross: they clip at the fence.
    // The footprint test is a 5×5 grid over the rect (walls, interior yards
    // and the plan buildings ALL have to stay off the majors).
    let sx = site.x;
    let sz = site.z;
    // score every candidate; take the first fully-clear one, else the best
    // (max majors clearance, preferring rings close to the true position)
    let bestX = site.x;
    let bestZ = site.z;
    let bestScore = -Infinity;
    const rectMinMajors = (cx, cz)=>{
        const c = Math.cos(rotY);
        const s = Math.sin(rotY);
        let min = Infinity;
        for(let gx = -2; gx <= 2; gx++){
            for(let gz = -2; gz <= 2; gz++){
                const lx = gx / 2 * (site.w / 2 - 0.4);
                const lz = gz / 2 * (site.d / 2 - 0.4);
                const wx = cx + lx * c + lz * s;
                const wz = cz - lx * s + lz * c;
                min = Math.min(min, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistanceMajors"])(wx, wz));
            }
        }
        return min;
    };
    search: for(let ring = 0; ring <= 24; ring++){
        const step = ring === 0 ? 0 : 2.4;
        const offs = ring === 0 ? [
            [
                0,
                0
            ]
        ] : [];
        for(let k = 0; k < (ring === 0 ? 1 : 8); k++){
            const ang = k / 8 * Math.PI * 2;
            offs.push([
                Math.cos(ang) * step * ring,
                Math.sin(ang) * step * ring
            ]);
        }
        for (const [ox, oz] of offs){
            const cx = site.x + ox;
            const cz = site.z + oz;
            // majors must stay live (traffic + lamps) — minor streets that cross
            // the footprint are fine, they clip at the fence like real satellite
            const minMajors = rectMinMajors(cx, cz);
            const score = minMajors - ring * 0.12;
            if (minMajors > 3.4) {
                sx = cx;
                sz = cz;
                break search;
            }
            if (score > bestScore) {
                bestScore = score;
                bestX = cx;
                bestZ = cz;
            }
        }
        sx = bestX;
        sz = bestZ;
    }
    const frame = {
        x: sx,
        z: sz,
        rotY
    };
    const hw = site.w / 2;
    const hd = site.d / 2;
    const add = (lx, lz, w, d, h, boxKind, tone = 0, ownRot = 0)=>{
        const [x, z] = toWorld(frame, lx, lz);
        const box = {
            schoolId: site.id,
            kind: boxKind,
            x,
            z,
            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
            w,
            d,
            h,
            rotY: frame.rotY + ownRot,
            tone
        };
        boxes.push(box);
        return box;
    };
    /* ------------------------------ perimeter wall ----------------------------- */ // segments run along the local rect; the gate gap (5.2 wide) sits front-centre
    const gateHalf = 2.6;
    const sideHalf = 1.3 // half wall length step for corners
    ;
    const wallSeg = (ax, az, bx, bz)=>{
        const mx = (ax + bx) / 2;
        const mz = (az + bz) / 2;
        const horiz = az === bz;
        const len = (horiz ? Math.abs(bx - ax) : Math.abs(bz - az)) + WALL_T;
        add(mx, mz, horiz ? len : WALL_T, horiz ? WALL_T : len, WALL_H, 'wall');
    };
    // front wall (z = +hd): two runs leaving the gate gap
    wallSeg(-hw, hd, -gateHalf, hd);
    wallSeg(gateHalf, hd, hw, hd);
    // back + sides
    wallSeg(-hw, -hd, hw, -hd);
    wallSeg(-hw, -hd, -hw, hd);
    wallSeg(hw, -hd, hw, hd);
    // rhythm pillars along the walls
    for(let px = -hw; px <= hw; px += 4.2){
        if (Math.abs(px) < gateHalf + 1) continue;
        add(px, hd, 0.55, 0.55, WALL_H + 0.5, 'pillar');
        add(px, -hd, 0.55, 0.55, WALL_H + 0.5, 'pillar');
    }
    for(let pz = -hd + 4.2; pz <= hd - 4.2; pz += 4.2){
        add(-hw, pz, 0.55, 0.55, WALL_H + 0.5, 'pillar');
        add(hw, pz, 0.55, 0.55, WALL_H + 0.5, 'pillar');
    }
    /* ---------------------------- gatehouse + sign ----------------------------- */ add(-gateHalf - 0.55, hd, 1.1, 1.3, 3.6, 'gatehouse', 1);
    add(gateHalf + 0.55, hd, 1.1, 1.3, 3.6, 'gatehouse', 1);
    const [gateX, gateZ] = toWorld(frame, 0, hd);
    const gate = {
        x: gateX,
        z: gateZ,
        y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(gateX, gateZ)
    };
    /* ------------------------------ building rows ------------------------------ */ // Band plan (all local-z, front = +Z toward the gate):
    //   gate + assembly yard  →  classroom blocks row  →  planned special buildings
    // Small compounds carry ONE block shifted left of the gate axis, so the
    // auto-placer has an honest right-hand column for the plan buildings.
    const BLOCK_W = 13.5;
    const BLOCK_D = 5.4;
    const BLOCK_H = 3.5;
    const frontZ = Math.max(hd - 10.5, -hd + BLOCK_D / 2 + 2);
    const blocksUsed = [];
    const nBlocks = site.w >= 34 ? 2 : 1;
    for(let k = 0; k < nBlocks; k++){
        const lx = nBlocks === 1 ? -hw + 1 + BLOCK_W / 2 : k === 0 ? -hw + 1 + BLOCK_W / 2 : hw - 1 - BLOCK_W / 2;
        add(lx, frontZ, BLOCK_W, BLOCK_D, BLOCK_H, 'block', 0);
        // front veranda slab + pillars (the classic Nigerian school walkway)
        add(lx, frontZ + BLOCK_D / 2 + 0.85, BLOCK_W + 1.6, 1.9, 0.22, 'veranda');
        for(let vx = -BLOCK_W / 2 + 0.8; vx <= BLOCK_W / 2 - 0.8; vx += 3.2){
            add(lx + vx, frontZ + BLOCK_D / 2 + 1.45, 0.42, 0.42, 2.6, 'pillar');
        }
        blocksUsed.push({
            lx,
            lz: frontZ
        });
    }
    // toilet block — back corner, real schools have the long squat block
    add(-hw + 3.4, -hd + 2.4, 4.6, 2.6, 2.4, 'toilet');
    // water tank stand — the borehole tower every compound has
    add(-hw + 1.8, hd - 2.2, 1.1, 1.1, 3.2, 'water');
    const occupied = [
        ...blocksUsed.map((b)=>({
                x: b.lx,
                z: b.lz,
                w: BLOCK_W,
                d: BLOCK_D
            })),
        ...blocksUsed.map((b)=>({
                x: b.lx,
                z: b.lz + BLOCK_D / 2 + 0.85,
                w: BLOCK_W + 1.6,
                d: 1.9
            })),
        {
            x: -hw + 3.4,
            z: -hd + 2.4,
            w: 4.6,
            d: 2.6
        },
        {
            x: -hw + 1.8,
            z: hd - 2.2,
            w: 1.1,
            d: 1.1
        }
    ];
    const PAD = 0.45;
    const overlaps = (r)=>occupied.some((o)=>Math.abs(o.x - r.x) < (o.w + r.w) / 2 + PAD && Math.abs(o.z - r.z) < (o.d + r.d) / 2 + PAD);
    const placedPlans = [];
    const tryPlace = (w, d, at)=>{
        // majors stay live — no plan building parks in a carriageway
        const clearOfMajors = (r)=>{
            const corners = [
                [
                    r.x - r.w / 2,
                    r.z - r.d / 2
                ],
                [
                    r.x + r.w / 2,
                    r.z - r.d / 2
                ],
                [
                    r.x - r.w / 2,
                    r.z + r.d / 2
                ],
                [
                    r.x + r.w / 2,
                    r.z + r.d / 2
                ],
                [
                    r.x,
                    r.z
                ]
            ];
            return corners.every(([cx, cz])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistanceMajors"])(...toWorld(frame, cx, cz)) >= 3.4);
        };
        // explicit planned position first
        if (at?.lx !== undefined && at?.lz !== undefined) {
            const r = {
                x: at.lx,
                z: at.lz,
                w,
                d
            };
            const inside = Math.abs(r.x) + w / 2 <= hw - 0.75 && r.z - d / 2 >= -hd + 0.55 && r.z + d / 2 <= hd - 0.75;
            if (inside && !overlaps(r) && clearOfMajors(r)) return r;
        }
        // deterministic grid scan — back band first, then forward, then corners
        for(let z = -hd + 0.55 + d / 2; z + d / 2 <= hd - 0.75; z += 0.5){
            for(let x = -hw + 0.75 + w / 2; x <= hw - 0.75 - w / 2 + 1e-6; x += 0.5){
                // keep the gate → assembly → blocks walk open
                if (z + d / 2 > frontZ - 1 && Math.abs(x) < 4.2) continue;
                const r = {
                    x,
                    z,
                    w,
                    d
                };
                if (!overlaps(r) && clearOfMajors(r)) return r;
            }
        }
        return null;
    };
    // essential buildings place first (the admin block is the first building
    // past the gate on every real campus) — stable sort keeps the plan order
    const ESSENTIAL = new Set([
        'senate',
        'admin',
        'health-sciences',
        'workshop',
        'demo-lab',
        'clinic',
        'mosque'
    ]);
    const plans = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_PLANS"][site.id] ?? []
    ].sort((a, b)=>(ESSENTIAL.has(b.kind) ? 1 : 0) - (ESSENTIAL.has(a.kind) ? 1 : 0));
    for (const plan of plans){
        const fp = PLAN_FOOTPRINT[plan.kind];
        // full footprint first, then the small variant for compact compounds
        let rect = tryPlace(fp.w, fp.d, plan);
        let w = fp.w;
        let d = fp.d;
        let h = fp.h;
        if (!rect && fp.small) {
            rect = tryPlace(fp.small.w, fp.small.d, plan);
            if (rect) {
                w = fp.small.w;
                d = fp.small.d;
                h = fp.small.h;
            }
        }
        if (!rect) continue; // tests assert every plan building placed — this surfaces it
        const box = add(rect.x, rect.z, w, d, h, planBoxKind(plan.kind, kind), 0);
        occupied.push({
            x: rect.x,
            z: rect.z,
            w,
            d
        });
        placedPlans.push({
            plan,
            lx: rect.x,
            lz: rect.z,
            w,
            d,
            h,
            box
        });
    }
    /* -------------------------- assembly ground + flag -------------------------- */ const asmLz = (hd + frontZ + BLOCK_D / 2) / 2 + 0.6;
    const asmR = Math.min(Math.min(hw, hd) * 0.6, (hd - (frontZ + BLOCK_D / 2)) * 0.72);
    const [asmX, asmZ] = toWorld(frame, 0, asmLz);
    const assembly = {
        x: asmX,
        z: asmZ,
        r: asmR
    };
    // flagpole on a small concrete base at the ground's heart
    add(0, asmLz, 1.4, 1.4, 0.5, 'pillar');
    add(0, asmLz, 0.16, 0.16, 5.6, 'flag');
    /* ------------------------------- football pitch ----------------------------- */ // a real grass pitch only when the middle band can honestly hold one —
    // otherwise the assembly ground's painted lines double as the field
    let pitch = null;
    if (site.field) {
        const topEdge = frontZ - BLOCK_D / 2 - 1;
        // the deepest placed plan building sets the pitch's back line
        let backEdge = -hd + 0.6;
        for (const p of placedPlans){
            if (p.lz + p.d / 2 > frontZ - 1) continue; // yard-side buildings don't count
            backEdge = Math.max(backEdge, p.lz + p.d / 2 + 1);
        }
        const depth = topEdge - backEdge;
        if (depth >= 6) {
            const pd = Math.min(depth, 12);
            const pz = (topEdge + backEdge) / 2;
            // widest clear span at the pitch band (plans + toilet + blocks all count)
            const bandHits = (cx, testW)=>{
                const rects = [
                    ...placedPlans.map((p)=>({
                            x: p.lx,
                            z: p.lz,
                            w: p.w,
                            d: p.d
                        })),
                    {
                        x: -hw + 3.4,
                        z: -hd + 2.4,
                        w: 4.6,
                        d: 2.6
                    },
                    ...blocksUsed.map((b)=>({
                            x: b.lx,
                            z: b.lz,
                            w: BLOCK_W,
                            d: BLOCK_D
                        }))
                ];
                return rects.some((r)=>Math.abs(r.z - pz) < (r.d + pd) / 2 + 0.6 && Math.abs(r.x - cx) < r.w / 2 + testW / 2 + 0.8);
            };
            let bestW = 0;
            let bestCx = 0;
            for(let cx = -hw + 4; cx <= hw - 4; cx += 0.5){
                let half = 0;
                while(half < hw - 2){
                    if (bandHits(cx, half * 2 + 1)) break;
                    half += 0.5;
                }
                if (half * 2 > bestW) {
                    bestW = half * 2;
                    bestCx = cx;
                }
            }
            const pw = Math.min(bestW, 19, site.w * 0.72);
            if (pw >= 8) {
                const [px, pzx] = toWorld(frame, bestCx, pz);
                pitch = {
                    x: px,
                    z: pzx,
                    w: pw,
                    d: pd,
                    rotY: frame.rotY
                };
            }
        }
    }
    /* -------------------------------- compound trees ---------------------------- */ const putTree = (lx, lz, palm, scale)=>{
        const [x, z] = toWorld(frame, lx, lz);
        // keep trees off buildings + pitch + ground
        if (boxes.some((b)=>Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.62 + 1.4)) return;
        trees.push({
            x,
            z,
            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
            scale,
            tone: Math.floor(rng() * 5),
            kind: palm ? 'palm' : 'tree'
        });
    };
    // mango/neem shade rows along the side fences + behind the blocks
    for(let i = 0; i < 7; i++){
        putTree(-hw + 2.2, -hd + 3 + i * ((site.d - 6) / 6), false, 0.9 + rng() * 0.5);
        putTree(hw - 2.2, -hd + 3 + i * ((site.d - 6) / 6), false, 0.9 + rng() * 0.5);
    }
    // palms framing the gate drive
    putTree(-gateHalf - 2.2, hd + 2.6, true, 1.05);
    putTree(gateHalf + 2.2, hd + 2.6, true, 1.05);
    putTree(-gateHalf - 3.4, hd + 7.5, true, 0.95);
    putTree(gateHalf + 3.4, hd + 7.5, true, 0.95);
    /* ------------------------------ driveway + doors ----------------------------- */ const [gateOutX, gateOutZ] = toWorld(frame, 0, hd + 1.2);
    const drive = {
        ax: road.x,
        az: road.z,
        bx: gateOutX,
        bz: gateOutZ
    };
    // classroom door — first block, front veranda centre
    const firstBlock = blocksUsed[0];
    const [cdx, cdz] = toWorld(frame, firstBlock.lx, firstBlock.lz + BLOCK_D / 2 + 0.95);
    doors.push({
        interiorId: `${site.id}-class`,
        locationId: site.id,
        x: cdx,
        z: cdz,
        y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(cdx, cdz),
        rotY: frame.rotY,
        label: 'Enter the classroom'
    });
    // doors for the placed plan buildings — straight from the placer so
    // geometry, doors and interiors can never drift apart
    for (const p of placedPlans){
        if (!p.plan.room) continue;
        const [dx0, dz0] = toWorld(frame, p.lx, p.lz + p.d / 2 + 0.95);
        doors.push({
            interiorId: `${site.id}-${p.plan.room}`,
            locationId: site.id,
            x: dx0,
            z: dz0,
            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(dx0, dz0),
            rotY: frame.rotY,
            label: `Enter ${p.plan.name.replace(/^The /, 'the ')}`
        });
    }
    return {
        site,
        rotY: frame.rotY,
        boxes,
        doors,
        trees,
        groundR: Math.max(site.w, site.d) * 0.62,
        assembly,
        pitch,
        drive,
        gate,
        plans: placedPlans
    };
}
/* --------------------------- interiors (inside the schools) ------------------- */ /** interior-local wall from (ax,az)→(bx,bz) — same shape as interiors.ts */ function iwall(ax, az, bx, bz) {
    const horiz = az === bz;
    const T = 0.3;
    return {
        x: (ax + bx) / 2,
        z: (az + bz) / 2,
        w: horiz ? Math.abs(bx - ax) + T : T,
        d: horiz ? T : Math.abs(bz - az) + T
    };
}
/** door gap on the SOUTH wall of every school interior (uniform + simple) */ function schoolShell(w, d) {
    return [
        iwall(-w / 2, -d / 2, w / 2, -d / 2),
        iwall(-w / 2, -d / 2, -w / 2, d / 2),
        iwall(w / 2, -d / 2, w / 2, d / 2),
        iwall(-w / 2, d / 2, -0.9, d / 2),
        iwall(0.9, d / 2, w / 2, d / 2)
    ];
}
/** classroom: rows of shared desks + chairs, blackboard, teacher table, map */ function classroomInterior(site) {
    const w = 9;
    const d = 7;
    const furn = [
        // blackboard + chalk tray on the north wall, facing the class
        {
            kind: 'blackboard',
            x: 0,
            z: -3.28,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'wallmap',
            x: -3.6,
            z: -3.3,
            rotY: 0,
            tone: 0
        },
        // teacher's table + chair front-right
        {
            kind: 'table',
            x: 3.2,
            z: -2.4,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'chair',
            x: 3.2,
            z: -1.55,
            rotY: Math.PI,
            tone: 1
        },
        {
            kind: 'shelf',
            x: 4.15,
            z: -3.2,
            rotY: 0,
            s: 0.8,
            tone: 2
        }
    ];
    // four rows × three columns of long shared desks, aisles kept walkable
    for(let row = 0; row < 4; row++){
        for(let col = 0; col < 3; col++){
            const x = -2.6 + col * 2.6;
            const z = -1.3 + row * 1.0;
            furn.push({
                kind: 'school-desk',
                x,
                z,
                rotY: 0,
                tone: row % 2
            });
            // two chairs tucked behind each shared desk
            furn.push({
                kind: 'chair',
                x: x - 0.55,
                z: z + 0.62,
                rotY: Math.PI,
                tone: 0
            });
            furn.push({
                kind: 'chair',
                x: x + 0.55,
                z: z + 0.62,
                rotY: Math.PI,
                tone: 0
            });
        }
    }
    furn.push({
        kind: 'ceilingfan',
        x: -1.2,
        z: -0.6,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2.4,
        z: 1.9,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.05,
        rotY: 0,
        tone: 0
    });
    return {
        id: `${site.id}-class`,
        name: `${site.shortName} — Classroom`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Classroom',
                x: 0,
                z: -0.2,
                w,
                d: 6.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${site.id}-class-exit`,
                kind: 'exit',
                x: 0,
                z: 3.05,
                label: `Back to ${site.shortName}`
            }
        ],
        actions: [
            {
                id: `${site.id}-study`,
                kind: 'study',
                x: 0,
                z: 2.55,
                label: 'Sit for a lesson'
            }
        ],
        spawn: {
            x: 0,
            z: 3.05,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#b99a68',
            floorAlt: '#a8875a',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the admin block office — where discipline and favour happen */ function officeInterior(site, label, adminName) {
    const w = 7;
    const d = 6;
    return {
        id: `${site.id}-office`,
        name: `${site.shortName} — ${adminName}`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Office',
                x: 0,
                z: -0.3,
                w,
                d: 5.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: [
            // the big desk facing the door, visitor chairs opposite
            {
                kind: 'table',
                x: 0,
                z: -1.9,
                rotY: 0,
                s: 1.35,
                tone: 2
            },
            {
                kind: 'chair',
                x: 0,
                z: -2.6,
                rotY: 0,
                tone: 2
            },
            {
                kind: 'chair',
                x: -1.1,
                z: -0.4,
                rotY: Math.PI + 0.25,
                tone: 1
            },
            {
                kind: 'chair',
                x: 1.1,
                z: -0.4,
                rotY: Math.PI - 0.25,
                tone: 1
            },
            // certificates + notice board on the wall (sign) + shelf of files
            {
                kind: 'sign',
                x: -1.9,
                z: -2.82,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'shelf',
                x: 2.9,
                z: -1.4,
                rotY: -Math.PI / 2,
                tone: 2
            },
            {
                kind: 'crate',
                x: -2.9,
                z: 1.6,
                rotY: 0.2,
                tone: 0
            },
            {
                kind: 'rug',
                x: 0,
                z: -0.2,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'ceilingfan',
                x: 0,
                z: -0.4,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'fan',
                x: 2.9,
                z: 2.2,
                rotY: Math.PI,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: `${site.id}-office-exit`,
                kind: 'exit',
                x: 0,
                z: 2.4,
                label: 'Step out of the office'
            }
        ],
        actions: [
            {
                id: `${site.id}-gist`,
                kind: 'study',
                x: 0,
                z: 0.2,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 2.2,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#a8875a',
            floorAlt: '#96754b',
            wall: site.paint,
            accent: site.accent
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** library / study hall — shelf rows and reading tables */ function libraryInterior(site, label = 'Read for a while') {
    const w = 10;
    const d = 8;
    const furn = [
        // returns desk along the west wall, facing into the room
        {
            kind: 'counter',
            x: -4.15,
            z: 2.6,
            rotY: Math.PI / 2,
            s: 1.2,
            tone: 1
        },
        {
            kind: 'sign',
            x: 0,
            z: -3.82,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'wallmap',
            x: 2.6,
            z: -3.85,
            rotY: 0,
            tone: 1
        }
    ];
    // shelf stacks along the side walls, reading tables in an open middle —
    // chairs sit north/south of each table so the centre aisle stays honest
    for(let i = 0; i < 3; i++){
        furn.push({
            kind: 'shelf',
            x: -3.6,
            z: -2.5 + i * 1.35,
            rotY: 0,
            s: 1.2,
            tone: i
        });
        furn.push({
            kind: 'shelf',
            x: 3.6,
            z: -2.5 + i * 1.35,
            rotY: 0,
            s: 1.2,
            tone: (i + 1) % 3
        });
    }
    const tables = [
        [
            -1.35,
            0.4
        ],
        [
            1.35,
            0.4
        ],
        [
            -1.35,
            1.9
        ],
        [
            1.35,
            1.9
        ]
    ];
    for (const [tx, tz] of tables){
        furn.push({
            kind: 'table',
            x: tx,
            z: tz,
            rotY: 0,
            s: 1.1,
            tone: 0
        });
        furn.push({
            kind: 'chair',
            x: tx,
            z: tz - 0.8,
            rotY: 0,
            tone: 0
        });
        furn.push({
            kind: 'chair',
            x: tx,
            z: tz + 0.8,
            rotY: Math.PI,
            tone: 0
        });
    }
    furn.push({
        kind: 'ceilingfan',
        x: 0,
        z: 0.6,
        rotY: 0,
        tone: 0
    });
    return {
        id: `${site.id}-library`,
        name: `${site.shortName} — Library`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Reading hall',
                x: 0,
                z: -0.4,
                w,
                d: 7
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${site.id}-lib-exit`,
                kind: 'exit',
                x: 0,
                z: 3.3,
                label: 'Back outside'
            }
        ],
        actions: [
            {
                id: `${site.id}-read`,
                kind: 'study',
                x: 0,
                z: 1.55,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.4,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#b98d5f',
            floorAlt: '#a87a4e',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the FUL grand library — stack corridors, e-library hub, reading halls */ function grandLibraryInterior(site, label) {
    const w = 15;
    const d = 11;
    const furn = [
        // returns desk + quiet board
        {
            kind: 'counter',
            x: -6.1,
            z: 3.4,
            rotY: Math.PI / 2,
            s: 1.3,
            tone: 1
        },
        {
            kind: 'sign',
            x: 0,
            z: -5.32,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'wallmap',
            x: 3.4,
            z: -5.35,
            rotY: 0,
            tone: 1
        }
    ];
    // the book stack corridors — two long shelving ranks, aisle between
    for(let i = 0; i < 4; i++){
        furn.push({
            kind: 'shelf',
            x: -6.4,
            z: -3.4 + i * 1.5,
            rotY: 0,
            s: 1.3,
            tone: i % 3
        });
        furn.push({
            kind: 'shelf',
            x: -4.1,
            z: -3.4 + i * 1.5,
            rotY: 0,
            s: 1.3,
            tone: (i + 1) % 3
        });
    }
    // the e-library network hub — bench rows of workstations
    for(let row = 0; row < 2; row++){
        for(let col = 0; col < 3; col++){
            const x = 0.6 + col * 2.3;
            const z = -3.6 + row * 1.9;
            furn.push({
                kind: 'table',
                x,
                z,
                rotY: 0,
                s: 1.05,
                tone: 2
            });
            furn.push({
                kind: 'computer',
                x,
                z: z - 0.12,
                rotY: 0,
                tone: 0
            });
            furn.push({
                kind: 'chair',
                x,
                z: z + 0.78,
                rotY: Math.PI,
                tone: 1
            });
        }
    }
    // the reading hall — long shared desks in the open south half
    const desks = [
        [
            -4.4,
            1.4
        ],
        [
            0.4,
            1.4
        ],
        [
            5.2,
            1.4
        ],
        [
            -4.4,
            3.4
        ],
        [
            0.4,
            3.4
        ],
        [
            5.2,
            3.4
        ]
    ];
    desks.forEach(([tx, tz], di)=>{
        furn.push({
            kind: 'table',
            x: tx,
            z: tz,
            rotY: 0,
            s: 1.35,
            tone: 0
        });
        furn.push({
            kind: 'chair',
            x: tx,
            z: tz - 0.9,
            rotY: 0,
            tone: 0
        });
        // the back row keeps its walkway clear — chairs on the table ends only
        if (di < 3) {
            furn.push({
                kind: 'chair',
                x: tx,
                z: tz + 0.9,
                rotY: Math.PI,
                tone: 0
            });
        } else {
            furn.push({
                kind: 'chair',
                x: tx - 1.25,
                z: tz,
                rotY: Math.PI / 2,
                tone: 0
            });
            furn.push({
                kind: 'chair',
                x: tx + 1.25,
                z: tz,
                rotY: -Math.PI / 2,
                tone: 0
            });
        }
    });
    // reference & serials cabinets on the east wall
    furn.push({
        kind: 'shelf',
        x: 6.7,
        z: -1.2,
        rotY: -Math.PI / 2,
        s: 1.25,
        tone: 2
    });
    furn.push({
        kind: 'shelf',
        x: 6.7,
        z: 1,
        rotY: -Math.PI / 2,
        s: 1.25,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: -2.4,
        z: -1.2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2.6,
        z: 2.2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 4.9,
        rotY: 0,
        tone: 0
    });
    return {
        id: `${site.id}-library`,
        name: `${site.shortName} — The University Library`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Book stacks',
                x: -5.2,
                z: -1.8,
                w: 5.4,
                d: 8
            },
            {
                name: 'E-library hub',
                x: 2.2,
                z: -2.4,
                w: 6.4,
                d: 5.4
            },
            {
                name: 'Reading hall',
                x: 0.4,
                z: 2.4,
                w: 13,
                d: 5
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${site.id}-lib-exit`,
                kind: 'exit',
                x: 0,
                z: 4.95,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${site.id}-read`,
                kind: 'study',
                x: 2.8,
                z: 4.35,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 4.95,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#b98d5f',
            floorAlt: '#a87a4e',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** computer lab — bench rows with monitors + a server crate */ function labInterior(site, label = 'Book a computer hour', flavor = 'ict') {
    const w = 9;
    const d = 7;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -3.28,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'crate',
            x: -3.9,
            z: -2.9,
            rotY: 0,
            tone: 1
        },
        // the GIS / simulation wall charts
        ...flavor === 'gis' ? [
            {
                kind: 'wallmap',
                x: -3.7,
                z: -3.3,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'wallmap',
                x: 3.7,
                z: -3.3,
                rotY: 0,
                tone: 1
            }
        ] : []
    ];
    // two bench rows of computers (wide centre aisle — the lab monitor row)
    for(let row = 0; row < 3; row++){
        for(let col = 0; col < 2; col++){
            const x = col === 0 ? -1.6 : 1.6;
            const z = -1.7 + row * 1.8;
            furn.push({
                kind: 'table',
                x,
                z,
                rotY: 0,
                s: 1.05,
                tone: 2
            });
            furn.push({
                kind: 'computer',
                x,
                z: z - 0.12,
                rotY: 0,
                tone: 0
            });
            furn.push({
                kind: 'chair',
                x,
                z: z + 0.75,
                rotY: Math.PI,
                tone: 1
            });
        }
    }
    furn.push({
        kind: 'ceilingfan',
        x: 0,
        z: -0.4,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 0,
        z: 1.8,
        rotY: 0,
        tone: 0
    });
    return {
        id: `${site.id}-lab`,
        name: `${site.shortName} — ${flavor === 'gis' ? 'GIS & Simulation Lab' : 'Computer Lab'}`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Lab',
                x: 0,
                z: -0.2,
                w,
                d: 6.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${site.id}-lab-exit`,
                kind: 'exit',
                x: 0,
                z: 3.1,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${site.id}-lab-study`,
                kind: 'study',
                x: 0,
                z: 0.9,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.0,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#cfc8b8',
            floorAlt: '#bfb6a2',
            wall: site.paint,
            accent: site.color
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
/** lecture theatre — tiered riser rows + podium (the FUL twin-theatre feel) */ function theatreInterior(site, id, label, buildingName) {
    const w = 12;
    const d = 9;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -4.28,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'podium',
            x: -1.5,
            z: -3.4,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'table',
            x: 2.2,
            z: -3.6,
            rotY: 0,
            s: 1.05,
            tone: 2
        },
        {
            kind: 'chair',
            x: 2.2,
            z: -2.8,
            rotY: Math.PI,
            tone: 2
        },
        {
            kind: 'wallmap',
            x: -3.8,
            z: -4.3,
            rotY: 0,
            tone: 0
        }
    ];
    // stepped rows — riser platforms with benches standing on them
    for(let row = 0; row < 4; row++){
        const z = -2.1 + row * 1.45;
        furn.push({
            kind: 'riser',
            x: 0,
            z,
            rotY: 0,
            s: 1,
            tone: row % 2
        });
        for(let col = 0; col < 3; col++){
            const x = -3.2 + col * 3.2;
            furn.push({
                kind: 'bench',
                x,
                z: z - 0.18,
                rotY: 0,
                s: 1.45,
                tone: row % 2
            });
        }
    }
    furn.push({
        kind: 'ceilingfan',
        x: -2,
        z: -1.2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2.4,
        z: 2.2,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — ${buildingName.replace(/^The /, '')}`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Auditorium',
                x: 0,
                z: -0.4,
                w,
                d: 8
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.9,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-lecture`,
                kind: 'study',
                x: 0,
                z: 2.75,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.4,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#c8bfa8',
            floorAlt: '#b6ac94',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/* ---------------- Stage 8 interior builders — the great schools ---------------- */ /** the FUL Senate Building — VC suite, registry counters, council chamber */ function senateInterior(site, label) {
    const w = 14;
    const d = 10;
    const furn = [
        // the council chamber — the long meeting table, seats all around
        {
            kind: 'table',
            x: -4.2,
            z: -2.2,
            rotY: 0,
            s: 2.5,
            tone: 2
        },
        ...[
            -6.6,
            -5.5,
            -4.4,
            -3.3,
            -2.2,
            -1.1
        ].map((x, i)=>({
                kind: 'chair',
                x,
                z: -3.35,
                rotY: 0,
                tone: 1,
                s: i === 2 ? 1.15 : 1
            })),
        ...[
            -6.6,
            -5.5,
            -4.4,
            -3.3,
            -2.2,
            -1.1
        ].map((x)=>({
                kind: 'chair',
                x,
                z: -1.05,
                rotY: Math.PI,
                tone: 1
            })),
        // the presentation screen + crest
        {
            kind: 'tv',
            x: -4.2,
            z: -4.42,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'sign',
            x: -0.4,
            z: -4.45,
            rotY: 0,
            tone: 1
        },
        // the registry — counters and queue board by the door
        {
            kind: 'counter',
            x: 5.6,
            z: 1.2,
            rotY: Math.PI / 2,
            tone: 1
        },
        {
            kind: 'counter',
            x: 5.6,
            z: 3.2,
            rotY: Math.PI / 2,
            tone: 2
        },
        {
            kind: 'queueboard',
            x: 5.9,
            z: -1.4,
            rotY: -Math.PI / 2,
            tone: 0
        },
        // the VC's suite corner — the big desk facing the room
        {
            kind: 'table',
            x: 2.6,
            z: -3.3,
            rotY: 0,
            s: 1.5,
            tone: 2
        },
        {
            kind: 'chair',
            x: 2.6,
            z: -4.1,
            rotY: 0,
            tone: 2
        },
        {
            kind: 'chair',
            x: 1.7,
            z: -2.2,
            rotY: 0.4,
            tone: 1
        },
        {
            kind: 'chair',
            x: 3.5,
            z: -2.2,
            rotY: -0.4,
            tone: 1
        },
        {
            kind: 'rug',
            x: 2.6,
            z: -2.4,
            rotY: 0,
            s: 1.1,
            tone: 1
        },
        // records shelves + crates
        {
            kind: 'shelf',
            x: -1.1,
            z: -4.4,
            rotY: 0,
            s: 1.2,
            tone: 2
        },
        {
            kind: 'shelf',
            x: 0.8,
            z: -4.4,
            rotY: 0,
            s: 1.2,
            tone: 0
        },
        {
            kind: 'crate',
            x: -6.3,
            z: 3.8,
            rotY: 0.2,
            tone: 1
        },
        {
            kind: 'crate',
            x: -5.5,
            z: 4,
            rotY: -0.15,
            tone: 2
        },
        {
            kind: 'ceilingfan',
            x: -4.2,
            z: -2,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'ceilingfan',
            x: 3,
            z: 1.4,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'mat',
            x: 0,
            z: 4.3,
            rotY: 0,
            tone: 0
        }
    ];
    return {
        id: `${site.id}-senate`,
        name: `${site.shortName} — The Senate Building`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Council chamber',
                x: -4.2,
                z: -2.4,
                w: 7.6,
                d: 5.6
            },
            {
                name: "VC's suite",
                x: 3.4,
                z: -2.6,
                w: 5,
                d: 4.4
            },
            {
                name: 'Registry',
                x: 4.4,
                z: 2.2,
                w: 5,
                d: 4.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${site.id}-senate-exit`,
                kind: 'exit',
                x: 0,
                z: 4.45,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${site.id}-senate-study`,
                kind: 'study',
                x: 0.6,
                z: 1.4,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 4.4,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#cfc8b8',
            floorAlt: '#bfb6a2',
            wall: site.paint,
            accent: site.color
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
/** Faculty of Arts — language lab headsets, lecture desks, staff common room */ function facultyArtsInterior(site, label) {
    const w = 11;
    const d = 9;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -4.28,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'wallmap',
            x: -4.4,
            z: -4.3,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'sign',
            x: 3.6,
            z: -4.42,
            rotY: 0,
            tone: 1
        }
    ];
    // the language laboratory — headset desks in two rows
    for(let row = 0; row < 2; row++){
        for(let col = 0; col < 3; col++){
            const x = -3.2 + col * 2.4;
            const z = -2.9 + row * 1.7;
            furn.push({
                kind: 'table',
                x,
                z,
                rotY: 0,
                s: 1,
                tone: 2
            });
            furn.push({
                kind: 'computer',
                x,
                z: z - 0.12,
                rotY: 0,
                tone: 0
            });
            furn.push({
                kind: 'chair',
                x,
                z: z + 0.75,
                rotY: Math.PI,
                tone: 1
            });
        }
    }
    // the lecture room corner — shared desks
    for(let col = 0; col < 2; col++){
        furn.push({
            kind: 'school-desk',
            x: -2.9 + col * 2.2,
            z: 1.5,
            rotY: 0,
            tone: 0
        });
        furn.push({
            kind: 'chair',
            x: -2.9 + col * 2.2,
            z: 2.12,
            rotY: Math.PI,
            tone: 0
        });
    }
    // the staff common room — east side
    furn.push({
        kind: 'sofa',
        x: 4.2,
        z: 1.7,
        rotY: -Math.PI / 2,
        tone: 1
    });
    furn.push({
        kind: 'table',
        x: 3,
        z: 1.7,
        rotY: 0,
        s: 0.9,
        tone: 1
    });
    furn.push({
        kind: 'shelf',
        x: 4.85,
        z: -0.9,
        rotY: -Math.PI / 2,
        s: 1.1,
        tone: 2
    });
    furn.push({
        kind: 'crate',
        x: 4.6,
        z: 3.4,
        rotY: 0.25,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: -1.4,
        z: -1.4,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2.2,
        z: 1.6,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.85,
        rotY: 0,
        tone: 0
    });
    return {
        id: `${site.id}-fac-arts`,
        name: `${site.shortName} — Faculty of Arts`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Language lab',
                x: -1.6,
                z: -2.2,
                w: 8,
                d: 5
            },
            {
                name: 'Staff common room',
                x: 3.4,
                z: 1.9,
                w: 4.4,
                d: 4.4
            },
            {
                name: 'Lecture room',
                x: -2.6,
                z: 1.9,
                w: 4.4,
                d: 3.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${site.id}-arts-exit`,
                kind: 'exit',
                x: 0,
                z: 3.95,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${site.id}-arts-study`,
                kind: 'study',
                x: -0.6,
                z: 0.6,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.9,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#b99a68',
            floorAlt: '#a8875a',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** Faculty of Science — chemistry benches, fume hood, microscopes, boardroom */ function facultyScienceInterior(site, label) {
    const w = 11;
    const d = 9;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -4.28,
            rotY: 0,
            tone: 1
        },
        // fume hood + safety basins on the north wall
        {
            kind: 'fume-hood',
            x: -4.6,
            z: -3.85,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'basin',
            x: -2.9,
            z: -3.95,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'basin',
            x: -2.2,
            z: -3.95,
            rotY: 0,
            tone: 0
        },
        // specimen cabinet + prep shelves
        {
            kind: 'specimen-cabinet',
            x: 4.8,
            z: -3.8,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'shelf',
            x: 3.2,
            z: -3.9,
            rotY: 0,
            s: 1.1,
            tone: 2
        }
    ];
    // two lab bench rows with microscopes + stools
    for(let row = 0; row < 2; row++){
        const z = -1.5 + row * 2;
        furn.push({
            kind: 'lab-bench',
            x: -2.2,
            z,
            rotY: 0,
            tone: row
        });
        furn.push({
            kind: 'lab-bench',
            x: 1.6,
            z,
            rotY: 0,
            tone: row
        });
        furn.push({
            kind: 'microscope',
            x: -2.2,
            z: z - 0.12,
            rotY: 0,
            tone: 0
        });
        furn.push({
            kind: 'microscope',
            x: 1.6,
            z: z - 0.12,
            rotY: 0.4,
            tone: 0
        });
        for (const bx of [
            -2.9,
            -1.5,
            0.9,
            2.3
        ]){
            furn.push({
                kind: 'chair',
                x: bx,
                z: z + 0.85,
                rotY: Math.PI,
                tone: 1
            });
        }
    }
    // the faculty boardroom corner
    furn.push({
        kind: 'table',
        x: 4.3,
        z: 2.4,
        rotY: 0,
        s: 1.6,
        tone: 2
    });
    furn.push({
        kind: 'chair',
        x: 4.3,
        z: 1.35,
        rotY: 0,
        tone: 1
    });
    furn.push({
        kind: 'chair',
        x: 4.3,
        z: 3.45,
        rotY: Math.PI,
        tone: 1
    });
    furn.push({
        kind: 'chair',
        x: 3.1,
        z: 2.4,
        rotY: Math.PI / 2,
        tone: 1
    });
    furn.push({
        kind: 'ceilingfan',
        x: -1.6,
        z: -0.6,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2,
        z: 2.2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: -0.4,
        z: 3.75,
        rotY: 0,
        tone: 0
    });
    return {
        id: `${site.id}-fac-sci`,
        name: `${site.shortName} — Faculty of Science`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Chemistry lab',
                x: -1.8,
                z: -1.8,
                w: 8.4,
                d: 6
            },
            {
                name: 'Boardroom',
                x: 4.2,
                z: 2.6,
                w: 3.8,
                d: 3.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${site.id}-sci-exit`,
                kind: 'exit',
                x: 0,
                z: 3.95,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${site.id}-sci-study`,
                kind: 'study',
                x: -0.4,
                z: 0.7,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.9,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#cfc8b8',
            floorAlt: '#bfb6a2',
            wall: site.paint,
            accent: site.color
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
/** student hostel — bunk rooms, lockers, the common study lounge, ablution */ function hostelInterior(site, id, label) {
    const w = 13;
    const d = 9;
    const furn = [
        {
            kind: 'sign',
            x: 0,
            z: -4.32,
            rotY: 0,
            tone: 0
        }
    ];
    // two bunk rooms worth of beds, lockers between them
    for(let i = 0; i < 4; i++){
        const x = -5.4 + i % 2 * 3.1;
        const z = -3.3 + Math.floor(i / 2) * 1.5;
        furn.push({
            kind: 'bunk',
            x,
            z,
            rotY: 0,
            tone: i
        });
    }
    for(let i = 0; i < 5; i++){
        furn.push({
            kind: 'locker',
            x: -0.2 + i * 0.62,
            z: -3.9,
            rotY: 0,
            tone: i % 3
        });
    }
    // the common study lounge — long table + benches
    furn.push({
        kind: 'table',
        x: 0.4,
        z: -0.4,
        rotY: 0,
        s: 1.7,
        tone: 1
    });
    furn.push({
        kind: 'bench',
        x: 0.4,
        z: -1.35,
        rotY: 0,
        s: 1.5,
        tone: 0
    });
    furn.push({
        kind: 'bench',
        x: 0.4,
        z: 0.55,
        rotY: 0,
        s: 1.5,
        tone: 0
    });
    furn.push({
        kind: 'shelf',
        x: -6.1,
        z: -0.6,
        rotY: Math.PI / 2,
        s: 1.2,
        tone: 2
    });
    furn.push({
        kind: 'crate',
        x: -6,
        z: 1.4,
        rotY: 0.2,
        tone: 1
    });
    // the ablution block corner
    furn.push({
        kind: 'shower',
        x: 5.8,
        z: 3.6,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'shower',
        x: 4.5,
        z: 3.6,
        rotY: 0,
        tone: 1
    });
    furn.push({
        kind: 'basin',
        x: 3.3,
        z: 3.9,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'locker',
        x: 5.9,
        z: 1.9,
        rotY: Math.PI,
        tone: 2
    });
    furn.push({
        kind: 'ceilingfan',
        x: -3.4,
        z: -1.6,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 1.8,
        z: 1.8,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.85,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — Student Hostels`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Bunk room',
                x: -3.4,
                z: -2.6,
                w: 8,
                d: 4.4
            },
            {
                name: 'Common lounge',
                x: 0.4,
                z: 0.4,
                w: 8,
                d: 3.8
            },
            {
                name: 'Ablution',
                x: 5,
                z: 3.2,
                w: 3,
                d: 2.8
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.95,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-prep`,
                kind: 'study',
                x: 2.3,
                z: 0.4,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.9,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#b99a68',
            floorAlt: '#a8875a',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the school canteen — serving counter, dining benches, cold drinks */ function canteenInterior(site, id) {
    const w = 9;
    const d = 8;
    return {
        id,
        name: `${site.shortName} — School Canteen`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Serving',
                x: 0.4,
                z: -1.9,
                w: 8,
                d: 3.2
            },
            {
                name: 'Dining',
                x: -0.4,
                z: 1.7,
                w: 7.4,
                d: 3.8
            }
        ],
        walls: schoolShell(w, d),
        furniture: [
            // the serving counter with hot pots
            {
                kind: 'counter',
                x: 0.6,
                z: -2.9,
                rotY: 0,
                s: 1.7,
                tone: 1
            },
            {
                kind: 'pot',
                x: -0.9,
                z: -3,
                rotY: 0,
                tone: 0,
                s: 1.3
            },
            {
                kind: 'pot',
                x: 0.7,
                z: -3,
                rotY: 0,
                tone: 1,
                s: 1.15
            },
            {
                kind: 'pot',
                x: 2.1,
                z: -3,
                rotY: 0,
                tone: 2,
                s: 1.25
            },
            {
                kind: 'stove',
                x: 3.7,
                z: -3.1,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'menu',
                x: 0.6,
                z: -2.1,
                rotY: Math.PI,
                tone: 0
            },
            {
                kind: 'fridge',
                x: -3.9,
                z: -3,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'crate',
                x: 3.9,
                z: -1.7,
                rotY: 0.2,
                tone: 0
            },
            // dining benches
            {
                kind: 'table',
                x: -1.9,
                z: 1.4,
                rotY: 0,
                s: 1.15,
                tone: 1
            },
            {
                kind: 'bench',
                x: -1.9,
                z: 0.45,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'bench',
                x: -1.9,
                z: 2.35,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'table',
                x: 1.7,
                z: 1.4,
                rotY: 0,
                s: 1.15,
                tone: 2
            },
            {
                kind: 'bench',
                x: 1.7,
                z: 0.45,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'bench',
                x: 1.7,
                z: 2.35,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'ceilingfan',
                x: 0,
                z: -0.4,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'fan',
                x: -4.1,
                z: 3.3,
                rotY: -Math.PI / 4,
                tone: 0
            },
            {
                kind: 'mat',
                x: 0,
                z: 3.4,
                rotY: 0,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: `${id}-menu`,
                kind: 'menu',
                x: 0.6,
                z: -1.5,
                label: 'Order from the canteen'
            },
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.3,
                label: 'Back to the campus'
            }
        ],
        actions: [],
        spawn: {
            x: 0,
            z: 3.2,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#ad8756',
            floorAlt: '#9c774a',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: true,
        shopSpot: false
    };
}
/** the sick bay — observation beds, medicine cabinet, duty desk */ function clinicInterior(site, id) {
    const w = 8;
    const d = 7;
    return {
        id,
        name: `${site.shortName} — Sick Bay`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Ward',
                x: 0,
                z: -0.2,
                w,
                d: 6.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: [
            {
                kind: 'bed',
                x: -2.5,
                z: -2.2,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'bed',
                x: -2.5,
                z: 0.2,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'specimen-cabinet',
                x: 3.4,
                z: -3.05,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'basin',
                x: 1.9,
                z: -3.15,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'table',
                x: 3,
                z: 0.6,
                rotY: 0,
                s: 1.05,
                tone: 2
            },
            {
                kind: 'chair',
                x: 3,
                z: 1.5,
                rotY: Math.PI,
                tone: 2
            },
            {
                kind: 'locker',
                x: -3.6,
                z: 2.4,
                rotY: Math.PI / 2,
                tone: 1
            },
            {
                kind: 'sign',
                x: 0.4,
                z: -3.32,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'ceilingfan',
                x: 0,
                z: -0.4,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'mat',
                x: 0,
                z: 2.9,
                rotY: 0,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 2.85,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-rest`,
                kind: 'study',
                x: 0,
                z: 0.4,
                label: 'Rest a while in the sick bay'
            }
        ],
        spawn: {
            x: 0,
            z: 2.8,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#cfc8b8',
            floorAlt: '#bfb6a2',
            wall: '#f4f1e6',
            accent: site.color
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
/** the secondary-school science lab — benches, fume hood, specimen cabinets */ function scienceLabInterior(site, id, label) {
    const w = 10;
    const d = 8;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -3.78,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'fume-hood',
            x: -4.2,
            z: -3.35,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'basin',
            x: -2.6,
            z: -3.45,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'basin',
            x: -1.95,
            z: -3.45,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'specimen-cabinet',
            x: 4.2,
            z: -3.3,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'specimen-cabinet',
            x: 3,
            z: -3.3,
            rotY: 0,
            tone: 2
        },
        {
            kind: 'table',
            x: 3.4,
            z: -1.6,
            rotY: 0,
            s: 1.1,
            tone: 1
        },
        {
            kind: 'chair',
            x: 3.4,
            z: -0.75,
            rotY: Math.PI,
            tone: 1
        }
    ];
    for(let row = 0; row < 3; row++){
        const z = -1.6 + row * 1.7;
        furn.push({
            kind: 'lab-bench',
            x: -0.4,
            z,
            rotY: 0,
            tone: row
        });
        furn.push({
            kind: 'microscope',
            x: -0.4,
            z: z - 0.12,
            rotY: row * 0.4,
            tone: 0
        });
        for (const bx of [
            -1.2,
            0.4
        ]){
            furn.push({
                kind: 'chair',
                x: bx,
                z: z + 0.82,
                rotY: Math.PI,
                tone: 1
            });
        }
    }
    furn.push({
        kind: 'ceilingfan',
        x: -1.4,
        z: -0.6,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 1.4,
        z: 1.8,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.35,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — Science Laboratory`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Lab',
                x: 0,
                z: -0.2,
                w,
                d: 6.9
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.3,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-practical`,
                kind: 'study',
                x: 1.7,
                z: 0.9,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.25,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#cfc8b8',
            floorAlt: '#bfb6a2',
            wall: site.paint,
            accent: site.color
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
/** the assembly hall — stage, podium, long bench rows */ function hallInterior(site, id, label) {
    const w = 12;
    const d = 10;
    const furn = [
        // the stage
        {
            kind: 'riser',
            x: 0,
            z: -3.6,
            rotY: 0,
            s: 1.15,
            tone: 0
        },
        {
            kind: 'podium',
            x: -1.4,
            z: -3.9,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'table',
            x: 1.8,
            z: -3.9,
            rotY: 0,
            s: 1,
            tone: 2
        },
        {
            kind: 'sign',
            x: 3.4,
            z: -4.42,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'blackboard',
            x: 0,
            z: -4.78,
            rotY: 0,
            tone: 0
        }
    ];
    for(let row = 0; row < 5; row++){
        const z = -1.9 + row * 1.25;
        furn.push({
            kind: 'bench',
            x: -2.2,
            z,
            rotY: 0,
            s: 1.7,
            tone: row % 2
        });
        furn.push({
            kind: 'bench',
            x: 2.2,
            z,
            rotY: 0,
            s: 1.7,
            tone: row % 2
        });
    }
    furn.push({
        kind: 'ceilingfan',
        x: -2.4,
        z: -1.2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2.4,
        z: 2.4,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 4.35,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — Assembly Hall`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Hall',
                x: 0,
                z: -0.4,
                w,
                d: 9
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 4.3,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-assembly`,
                kind: 'study',
                x: 0,
                z: 2.6,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.9,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#c8bfa8',
            floorAlt: '#b6ac94',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the gross anatomy lab — dissection tables, specimen tanks, histology bays */ function anatomyLabInterior(site, id, label) {
    const w = 12;
    const d = 9;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -4.28,
            rotY: 0,
            tone: 1
        },
        // the dissection tables — steel, drained, hose at the corner
        {
            kind: 'dissection-table',
            x: -2.6,
            z: -2.3,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'dissection-table',
            x: 1.8,
            z: -2.3,
            rotY: 0,
            tone: 0
        },
        // specimen preservation tanks + models
        {
            kind: 'specimen-cabinet',
            x: -5.4,
            z: -3.6,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'specimen-cabinet',
            x: 5.4,
            z: -3.6,
            rotY: 0,
            tone: 2
        },
        {
            kind: 'skeleton',
            x: -4.6,
            z: -1.2,
            rotY: 0.3,
            tone: 0
        },
        {
            kind: 'skeleton',
            x: 4.6,
            z: -1.2,
            rotY: -0.4,
            tone: 0
        },
        // histology bays — bench + scopes
        {
            kind: 'lab-bench',
            x: -3.4,
            z: 1.4,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'lab-bench',
            x: 1,
            z: 1.4,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'microscope',
            x: -3.4,
            z: 1.28,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'microscope',
            x: 1,
            z: 1.28,
            rotY: 0.5,
            tone: 0
        }
    ];
    for (const bx of [
        -4.2,
        -2.6,
        0.2,
        1.8
    ]){
        furn.push({
            kind: 'chair',
            x: bx,
            z: 2.25,
            rotY: Math.PI,
            tone: 1
        });
    }
    furn.push({
        kind: 'basin',
        x: 5.2,
        z: -4.15,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: -2,
        z: -0.8,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2.6,
        z: 2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.85,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — Gross Anatomy Lab`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Dissection floor',
                x: -0.4,
                z: -1.8,
                w: 10,
                d: 5
            },
            {
                name: 'Histology bays',
                x: -1.2,
                z: 1.8,
                w: 8.4,
                d: 3.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.9,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-practical`,
                kind: 'study',
                x: -0.4,
                z: 0.6,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.9,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#cfc8b8',
            floorAlt: '#bfb6a2',
            wall: '#eef0e6',
            accent: site.color
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
/** the pre-clinical lecture theatre — stepped rows, medical posters, skeleton */ function preclinicInterior(site, id, label) {
    const w = 11;
    const d = 9;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -4.28,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'podium',
            x: -1.4,
            z: -3.5,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'skeleton',
            x: 2.4,
            z: -3.5,
            rotY: 0.2,
            tone: 0
        },
        {
            kind: 'wallmap',
            x: -3.8,
            z: -4.3,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'wallmap',
            x: 0.2,
            z: -4.32,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'specimen-cabinet',
            x: 4.6,
            z: -3.7,
            rotY: 0,
            tone: 1
        }
    ];
    for(let row = 0; row < 3; row++){
        const z = -2 + row * 1.5;
        furn.push({
            kind: 'riser',
            x: -0.6,
            z,
            rotY: 0,
            s: 0.95,
            tone: row % 2
        });
        for(let col = 0; col < 2; col++){
            furn.push({
                kind: 'bench',
                x: -2.1 + col * 3,
                z: z - 0.18,
                rotY: 0,
                s: 1.4,
                tone: row % 2
            });
        }
    }
    furn.push({
        kind: 'ceilingfan',
        x: -1.8,
        z: -0.8,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 2.2,
        z: 1.8,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.85,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — Pre-Clinical Lecture Theatre`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Theatre',
                x: 0,
                z: -0.4,
                w,
                d: 8
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.9,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-lecture`,
                kind: 'study',
                x: 0,
                z: 2.5,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.85,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#c8bfa8',
            floorAlt: '#b6ac94',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the KSP engineering workshop — machines, workbenches, tool crates */ function workshopInterior(site, id, label) {
    const w = 12;
    const d = 9;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -4.28,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'machine',
            x: -3.8,
            z: -2.6,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'machine',
            x: 0.4,
            z: -2.6,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'machine',
            x: 4.4,
            z: -2.6,
            rotY: 0,
            tone: 2
        },
        {
            kind: 'lab-bench',
            x: -3.6,
            z: 0.6,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'lab-bench',
            x: 0.2,
            z: 0.6,
            rotY: 0,
            tone: 2
        },
        {
            kind: 'shelf',
            x: 5.4,
            z: 0.4,
            rotY: -Math.PI / 2,
            s: 1.2,
            tone: 1
        },
        {
            kind: 'crate',
            x: -5.2,
            z: 3,
            rotY: 0.2,
            tone: 0
        },
        {
            kind: 'crate',
            x: -4.4,
            z: 3.3,
            rotY: -0.15,
            tone: 1
        },
        {
            kind: 'crate',
            x: -4.8,
            z: 2.4,
            rotY: 0.4,
            tone: 2
        },
        {
            kind: 'ceilingfan',
            x: -1.8,
            z: -1,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'ceilingfan',
            x: 2.2,
            z: 2,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'mat',
            x: 0.6,
            z: 3.75,
            rotY: 0,
            tone: 0
        }
    ];
    return {
        id,
        name: `${site.shortName} — Engineering Workshops`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Machine bay',
                x: -0.4,
                z: -1.8,
                w: 10,
                d: 4.6
            },
            {
                name: 'Workbenches',
                x: 0,
                z: 1.9,
                w: 9.4,
                d: 3.4
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.85,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-work`,
                kind: 'study',
                x: 0.6,
                z: 1.4,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.8,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#8f8a7c',
            floorAlt: '#7f7a6c',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the chapel — pew columns, pulpit, altar table */ function chapelInterior(site, id, label) {
    const w = 10;
    const d = 9;
    const furn = [
        // the altar + pulpit on the raised front
        {
            kind: 'riser',
            x: 0,
            z: -3.5,
            rotY: 0,
            s: 1.05,
            tone: 0
        },
        {
            kind: 'counter',
            x: 0,
            z: -3.7,
            rotY: 0,
            s: 1.1,
            tone: 2
        },
        {
            kind: 'podium',
            x: 2.2,
            z: -3.8,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'sign',
            x: -2.6,
            z: -4.32,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'shelf',
            x: -4.35,
            z: -2.6,
            rotY: Math.PI / 2,
            s: 1.1,
            tone: 2
        },
        {
            kind: 'shelf',
            x: 4.35,
            z: -2.6,
            rotY: -Math.PI / 2,
            s: 1.1,
            tone: 0
        }
    ];
    for(let row = 0; row < 4; row++){
        const z = -2.2 + row * 1.25;
        furn.push({
            kind: 'bench',
            x: -1.95,
            z,
            rotY: 0,
            s: 1.5,
            tone: row % 2
        });
        furn.push({
            kind: 'bench',
            x: 1.95,
            z,
            rotY: 0,
            s: 1.5,
            tone: row % 2
        });
    }
    furn.push({
        kind: 'rug',
        x: 0,
        z: -1.4,
        rotY: 0,
        s: 1.1,
        tone: 1
    });
    furn.push({
        kind: 'ceilingfan',
        x: -1.8,
        z: -0.6,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 1.8,
        z: 2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.85,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — The Chapel`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Nave',
                x: 0,
                z: -0.2,
                w,
                d: 8
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.9,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-service`,
                kind: 'study',
                x: 0,
                z: 1.6,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.9,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#b99a68',
            floorAlt: '#a8875a',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the campus mosque — prayer mats in rows, the mihrab niche, Quran shelves */ function mosqueInterior(site, id, label) {
    const w = 9;
    const d = 8;
    const furn = [
        {
            kind: 'sign',
            x: 0,
            z: -3.82,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'shelf',
            x: -4.1,
            z: -2.2,
            rotY: Math.PI / 2,
            s: 1.1,
            tone: 1
        },
        {
            kind: 'shelf',
            x: 4.1,
            z: -2.2,
            rotY: -Math.PI / 2,
            s: 1.1,
            tone: 2
        },
        {
            kind: 'crate',
            x: 3.7,
            z: 2.9,
            rotY: 0.2,
            tone: 0
        },
        {
            kind: 'basin',
            x: -3.6,
            z: 3.2,
            rotY: 0,
            tone: 0
        }
    ];
    for(let row = 0; row < 4; row++){
        for(let col = 0; col < 4; col++){
            furn.push({
                kind: 'mat',
                x: -2.1 + col * 1.4,
                z: -2.4 + row * 1.35,
                rotY: 0,
                tone: (row + col) % 2
            });
        }
    }
    furn.push({
        kind: 'rug',
        x: 0,
        z: -2.4,
        rotY: 0,
        s: 1.3,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 0,
        z: -0.4,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.2,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — The Campus Mosque`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Prayer hall',
                x: 0,
                z: -0.2,
                w,
                d: 6.9
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.3,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-prayer`,
                kind: 'study',
                x: 0,
                z: 0.8,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.25,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#b9a568',
            floorAlt: '#a8945a',
            wall: site.paint,
            accent: site.color
        },
        mealSpot: false,
        shopSpot: false
    };
}
/** the nursing demonstration room — dummies on beds, procedure cabinet */ function demoInterior(site, id, label) {
    const w = 10;
    const d = 8;
    const furn = [
        {
            kind: 'blackboard',
            x: 0,
            z: -3.78,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'skeleton',
            x: 3.6,
            z: -3.2,
            rotY: 0.2,
            tone: 0
        },
        {
            kind: 'wallmap',
            x: -2.4,
            z: -3.82,
            rotY: 0,
            tone: 1
        },
        {
            kind: 'specimen-cabinet',
            x: 4.3,
            z: -1.6,
            rotY: -Math.PI / 2,
            tone: 1
        },
        {
            kind: 'basin',
            x: -4.3,
            z: -3.35,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'basin',
            x: -3.65,
            z: -3.35,
            rotY: 0,
            tone: 0
        },
        {
            kind: 'table',
            x: 0,
            z: -2.9,
            rotY: 0,
            s: 1.2,
            tone: 1
        }
    ];
    for(let i = 0; i < 3; i++){
        furn.push({
            kind: 'bed',
            x: -3.6 + i * 2.5,
            z: 0.2 + i % 2 * 1.2,
            rotY: 0,
            tone: 0
        });
    }
    furn.push({
        kind: 'chair',
        x: 3.4,
        z: 1.6,
        rotY: Math.PI,
        tone: 2
    });
    furn.push({
        kind: 'ceilingfan',
        x: -1.2,
        z: -0.8,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'ceilingfan',
        x: 1.6,
        z: 2,
        rotY: 0,
        tone: 0
    });
    furn.push({
        kind: 'mat',
        x: 0,
        z: 3.35,
        rotY: 0,
        tone: 0
    });
    return {
        id,
        name: `${site.shortName} — Demonstration Room`,
        locationId: site.id,
        size: {
            w,
            d
        },
        rooms: [
            {
                name: 'Demo ward',
                x: 0,
                z: -0.2,
                w,
                d: 6.9
            }
        ],
        walls: schoolShell(w, d),
        furniture: furn,
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.3,
                label: 'Back to the campus'
            }
        ],
        actions: [
            {
                id: `${id}-practice`,
                kind: 'study',
                x: 0,
                z: 1.2,
                label
            }
        ],
        spawn: {
            x: 0,
            z: 3.25,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: d / 2 - 0.1
        },
        palette: {
            floor: '#dfe2da',
            floorAlt: '#cfd2ca',
            wall: '#f4f1e6',
            accent: site.color
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
/* --------------------------------- assembly ---------------------------------- */ function interiorsFor(c) {
    const site = c.site;
    const list = [
        classroomInterior(site)
    ];
    for (const p of c.plans){
        if (!p.plan.room) continue;
        const id = `${site.id}-${p.plan.room}`;
        const label = p.plan.studyLabel ?? 'Sit for a lesson';
        switch(p.plan.room){
            case 'library':
                list.push(site.id === 'ful-felele' ? grandLibraryInterior(site, label) : libraryInterior(site, label));
                break;
            case 'lab':
                list.push(labInterior(site, label, p.plan.kind === 'faculty' ? 'gis' : 'ict'));
                break;
            case 'office':
                list.push(officeInterior(site, label, p.plan.name.replace(/^The /, '')));
                break;
            case 'senate':
                list.push(senateInterior(site, label));
                break;
            case 'fac-arts':
                list.push(facultyArtsInterior(site, label));
                break;
            case 'fac-sci':
                list.push(facultyScienceInterior(site, label));
                break;
            case 'theatre':
            case 'lt-b':
                list.push(theatreInterior(site, id, label, p.plan.name));
                break;
            case 'hostel':
                list.push(hostelInterior(site, id, label));
                break;
            case 'canteen':
                list.push(canteenInterior(site, id));
                break;
            case 'clinic':
                list.push(clinicInterior(site, id));
                break;
            case 'sci-lab':
                list.push(scienceLabInterior(site, id, label));
                break;
            case 'hall':
                list.push(hallInterior(site, id, label));
                break;
            case 'anatomy':
                list.push(anatomyLabInterior(site, id, label));
                break;
            case 'preclinic':
                list.push(preclinicInterior(site, id, label));
                break;
            case 'workshop':
                list.push(workshopInterior(site, id, label));
                break;
            case 'chapel':
                list.push(chapelInterior(site, id, label));
                break;
            case 'mosque':
                list.push(mosqueInterior(site, id, label));
                break;
            case 'demo':
                list.push(demoInterior(site, id, label));
                break;
            default:
                break;
        }
    }
    return list;
}
const SCHOOL_COMPOUNDS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_SITES"].map(buildCompound);
const SCHOOL_BOXES = SCHOOL_COMPOUNDS.flatMap((c)=>c.boxes);
/** collide against everything except the open gate arch + walkable veranda */ const COLLIDING_KINDS = new Set([
    'wall',
    'pillar',
    'gatehouse',
    'block',
    'admin',
    'library',
    'lab',
    'office',
    'toilet',
    'theatre',
    'flag',
    'water',
    'senate',
    'faculty',
    'hostel',
    'watchtower',
    'healthsci',
    'workshop',
    'chapel',
    'mosque',
    'hall',
    'canteen',
    'clinic',
    'demo'
]);
function isSchoolCollider(b) {
    return COLLIDING_KINDS.has(b.kind);
}
const SCHOOL_DOORS = SCHOOL_COMPOUNDS.flatMap((c)=>c.doors);
const ALL_DOORS = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOORS"],
    ...SCHOOL_DOORS
];
const SCHOOL_TREES = SCHOOL_COMPOUNDS.flatMap((c)=>c.trees);
const SCHOOL_INTERIORS = SCHOOL_COMPOUNDS.flatMap((c)=>interiorsFor(c));
const SCHOOL_INTERIOR_IDS = new Set(SCHOOL_INTERIORS.map((i)=>i.id));
}),
"[project]/src/game/world3d/interiors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Interior Definitions (INC 4 "life inside")
 * ---------------------------------------------------------
 * Pure, deterministic definitions of the enterable interiors: your own
 * flat at Home, Mama's buka at the Food Strip and the Kpata provision
 * store. Rooms, wall segments (with real doorway gaps), furniture and
 * the interaction hotspots are ALL data — so geometry, collision and
 * rendering can never disagree, and the whole layer is unit-testable
 * (scripts/test-world3d.ts BFS-pathability).
 *
 * Coordinates are interior-local METRES, origin at the room centre,
 * floor at y = 0. +x is east, +z is south (three.js ground plane).
 * Nothing here mutates game state and nothing knows about the economy.
 */ /* --------------------------------- furniture -------------------------------- */ __turbopack_context__.s([
    "DISTRICT_INTERIORS",
    ()=>DISTRICT_INTERIORS,
    "FURN_FOOTPRINT",
    ()=>FURN_FOOTPRINT,
    "INTERIORS",
    ()=>INTERIORS,
    "INTERIOR_BY_ID",
    ()=>INTERIOR_BY_ID,
    "INTERIOR_PLAYER_RADIUS",
    ()=>INTERIOR_PLAYER_RADIUS,
    "collidersFor",
    ()=>collidersFor,
    "interiorColliders",
    ()=>interiorColliders,
    "resolveInteriorPosition",
    ()=>resolveInteriorPosition
]);
/* ------------------------- school interiors (Stage 7) -------------------------
 * Registered here so INTERIOR_BY_ID stays the single source every consumer
 * already trusts. The type-only import above erased at runtime means this
 * adds no import cycle (schools → layout happens on the value side).
 * --------------------------------------------------------------------------- */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/schools.ts [app-ssr] (ecmascript)");
const FURN_FOOTPRINT = {
    bed: {
        w: 2.1,
        d: 1.5,
        solid: true,
        h: 0.55
    },
    wardrobe: {
        w: 1.2,
        d: 0.6,
        solid: true,
        h: 2.0
    },
    stove: {
        w: 0.9,
        d: 0.65,
        solid: true,
        h: 0.9
    },
    fridge: {
        w: 0.8,
        d: 0.75,
        solid: true,
        h: 1.75
    },
    sofa: {
        w: 2.2,
        d: 0.95,
        solid: true,
        h: 0.85
    },
    tv: {
        w: 1.5,
        d: 0.45,
        solid: true,
        h: 1.1
    },
    table: {
        w: 1.4,
        d: 0.9,
        solid: true,
        h: 0.75
    },
    chair: {
        w: 0.5,
        d: 0.5,
        solid: true,
        h: 0.9
    },
    shelf: {
        w: 1.8,
        d: 0.45,
        solid: true,
        h: 1.9
    },
    counter: {
        w: 2.8,
        d: 0.9,
        solid: true,
        h: 0.95
    },
    bench: {
        w: 1.6,
        d: 0.45,
        solid: true,
        h: 0.45
    },
    shower: {
        w: 1.0,
        d: 1.0,
        solid: true,
        h: 0.25
    },
    mirror: {
        w: 0.9,
        d: 0.35,
        solid: true,
        h: 1.9
    },
    rug: {
        w: 2.6,
        d: 1.8,
        solid: false,
        h: 0.02
    },
    mat: {
        w: 1.1,
        d: 0.65,
        solid: false,
        h: 0.02
    },
    crate: {
        w: 0.7,
        d: 0.7,
        solid: true,
        h: 0.6
    },
    pot: {
        w: 0.4,
        d: 0.4,
        solid: false,
        h: 0.35
    },
    fan: {
        w: 0.4,
        d: 0.4,
        solid: false,
        h: 1.3
    },
    menu: {
        w: 1.1,
        d: 0.12,
        solid: false,
        h: 0.8
    },
    // Stage 5-b — gym / bank / lounge fittings
    'dumbbell-rack': {
        w: 1.7,
        d: 0.55,
        solid: true,
        h: 1.0
    },
    'bench-press': {
        w: 1.5,
        d: 0.7,
        solid: true,
        h: 1.35
    },
    treadmill: {
        w: 0.85,
        d: 1.95,
        solid: true,
        h: 1.25
    },
    'mirror-strip': {
        w: 2.4,
        d: 0.1,
        solid: false,
        h: 1.9
    },
    sign: {
        w: 1.7,
        d: 0.08,
        solid: false,
        h: 0.7
    },
    ceilingfan: {
        w: 1.3,
        d: 1.3,
        solid: false,
        h: 0.5
    },
    vault: {
        w: 1.7,
        d: 0.35,
        solid: true,
        h: 2.25
    },
    partition: {
        w: 2.9,
        d: 0.12,
        solid: true,
        h: 1.95
    },
    queueboard: {
        w: 0.95,
        d: 0.35,
        solid: true,
        h: 1.7
    },
    booth: {
        w: 1.75,
        d: 0.95,
        solid: true,
        h: 1.05
    },
    'bottle-shelf': {
        w: 3.2,
        d: 0.42,
        solid: true,
        h: 2.1
    },
    'dj-deck': {
        w: 1.7,
        d: 0.85,
        solid: true,
        h: 1.05
    },
    speaker: {
        w: 0.55,
        d: 0.55,
        solid: true,
        h: 1.45
    },
    'drink-table': {
        w: 0.85,
        d: 0.85,
        solid: true,
        h: 0.78
    },
    // Stage 7 — school fittings
    'school-desk': {
        w: 1.5,
        d: 0.62,
        solid: true,
        h: 0.75
    },
    blackboard: {
        w: 2.6,
        d: 0.14,
        solid: false,
        h: 1.25
    },
    wallmap: {
        w: 1.5,
        d: 0.1,
        solid: false,
        h: 1.0
    },
    computer: {
        w: 0.85,
        d: 0.62,
        solid: false,
        h: 0.95
    },
    // Stage 8 — the great schools
    bunk: {
        w: 2.05,
        d: 1.05,
        solid: true,
        h: 1.75
    },
    locker: {
        w: 0.55,
        d: 0.6,
        solid: true,
        h: 1.8
    },
    'lab-bench': {
        w: 2.3,
        d: 0.9,
        solid: true,
        h: 0.95
    },
    'fume-hood': {
        w: 1.35,
        d: 0.85,
        solid: true,
        h: 2.25
    },
    basin: {
        w: 0.6,
        d: 0.5,
        solid: true,
        h: 1.05
    },
    'specimen-cabinet': {
        w: 1.1,
        d: 0.5,
        solid: true,
        h: 1.9
    },
    microscope: {
        w: 0.3,
        d: 0.38,
        solid: false,
        h: 0.42
    },
    skeleton: {
        w: 0.5,
        d: 0.5,
        solid: true,
        h: 1.72
    },
    'dissection-table': {
        w: 2.0,
        d: 0.85,
        solid: true,
        h: 0.92
    },
    podium: {
        w: 0.62,
        d: 0.5,
        solid: true,
        h: 1.18
    },
    riser: {
        w: 3.6,
        d: 1.4,
        solid: false,
        h: 0.32
    },
    machine: {
        w: 1.7,
        d: 0.85,
        solid: true,
        h: 1.3
    }
};
const T = 0.3 // wall thickness
;
/** axis-aligned wall from (ax,az) to (bx,bz) — lengths pad by T to close corners */ function wall(ax, az, bx, bz) {
    const horiz = az === bz;
    return {
        x: (ax + bx) / 2,
        z: (az + bz) / 2,
        w: horiz ? Math.abs(bx - ax) + T : T,
        d: horiz ? T : Math.abs(bz - az) + T
    };
}
/* ------------------------------- your own flat ------------------------------- */ const HOME = (()=>{
    const walls = [
        // perimeter — 12 × 9 m, entrance gap on the WEST wall (z −0.9..0.9)
        wall(-6, -4.5, 6, -4.5),
        wall(-6, 4.5, 6, 4.5),
        wall(6, -4.5, 6, 4.5),
        wall(-6, -4.5, -6, -0.9),
        wall(-6, 0.9, -6, 4.5),
        // inner wall A at x=2 — living ↔ back rooms, wide doorway z −3.9..−2.1
        // (gaps are declared 1.8 so they stay ≥1.5 after the wall-cap padding)
        wall(2, -4.5, 2, -3.9),
        wall(2, -2.1, 2, 4.5),
        // inner wall B at z=0.5 — bedroom ↔ kitchen+bath, doorway x 3.1..4.9
        wall(2, 0.5, 3.1, 0.5),
        wall(4.9, 0.5, 6, 0.5),
        // inner wall C at z=-1.9 — kitchen ↔ bathroom, doorway x 2.8..4.6
        wall(2, -1.9, 2.8, -1.9),
        wall(4.6, -1.9, 6, -1.9)
    ];
    return {
        id: 'home-interior',
        name: 'Your place',
        locationId: 'home',
        size: {
            w: 12,
            d: 9
        },
        rooms: [
            {
                name: 'Living room',
                x: -2,
                z: 0,
                w: 8,
                d: 9
            },
            {
                name: 'Bedroom',
                x: 4,
                z: 2.5,
                w: 4,
                d: 4
            },
            {
                name: 'Kitchen',
                x: 4,
                z: -0.7,
                w: 4,
                d: 2.4
            },
            {
                name: 'Bathroom',
                x: 4,
                z: -3.2,
                w: 4,
                d: 2.6
            }
        ],
        walls,
        furniture: [
            // living room
            {
                kind: 'rug',
                x: -2.4,
                z: 0.5,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'sofa',
                x: -2.4,
                z: -3.6,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'tv',
                x: -2.4,
                z: 4.0,
                rotY: Math.PI,
                tone: 0
            },
            {
                kind: 'table',
                x: -2.4,
                z: 0.6,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'chair',
                x: -4.9,
                z: -1.7,
                rotY: Math.PI / 2,
                tone: 0
            },
            {
                kind: 'shelf',
                x: -5.6,
                z: 2.8,
                rotY: Math.PI / 2,
                tone: 0
            },
            {
                kind: 'fan',
                x: -5.5,
                z: -3.8,
                rotY: Math.PI / 4,
                tone: 0
            },
            // bedroom
            {
                kind: 'bed',
                x: 4.8,
                z: 3.1,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'wardrobe',
                x: 2.7,
                z: 4.0,
                rotY: Math.PI,
                tone: 0
            },
            // kitchen
            {
                kind: 'stove',
                x: 5.4,
                z: -0.6,
                rotY: -Math.PI / 2,
                tone: 0
            },
            {
                kind: 'pot',
                x: 5.4,
                z: -0.35,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'fridge',
                x: 2.6,
                z: -0.2,
                rotY: Math.PI / 2,
                tone: 0
            },
            // bathroom
            {
                kind: 'shower',
                x: 2.8,
                z: -3.9,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'mirror',
                x: 4.6,
                z: -4.2,
                rotY: Math.PI,
                tone: 0
            },
            // welcome mat by the door
            {
                kind: 'mat',
                x: -4.9,
                z: 0,
                rotY: 0,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'home-bed',
                kind: 'bed',
                x: 4.8,
                z: 1.8,
                label: 'Rest on the bed'
            },
            {
                id: 'home-stove',
                kind: 'stove',
                x: 4.6,
                z: -0.6,
                label: "Cook at the stove"
            },
            {
                id: 'home-tv',
                kind: 'tv',
                x: -2.4,
                z: 3.15,
                label: 'Watch some TV'
            },
            {
                id: 'home-bath',
                kind: 'bath',
                x: 4.6,
                z: -3.3,
                label: 'Freshen up'
            },
            {
                id: 'home-exit',
                kind: 'exit',
                x: -5.35,
                z: 0,
                label: 'Step outside'
            }
        ],
        // Stage 5-b — the bedroom wardrobe now opens your look
        actions: [
            {
                id: 'home-wardrobe',
                kind: 'wardrobe',
                x: 2.7,
                z: 3.1,
                label: 'Change your look'
            }
        ],
        spawn: {
            x: -3.4,
            z: 1.7,
            facing: Math.PI / 2
        },
        door: {
            x: -5.6,
            z: 0
        },
        palette: {
            floor: '#b98d5f',
            floorAlt: '#a87a4e',
            wall: '#e8dcc3',
            accent: '#2e7d5b'
        },
        mealSpot: false,
        shopSpot: false
    };
})();
/* -------------------------------- mama's buka -------------------------------- */ const MAMAS = (()=>{
    const walls = [
        // 10 × 8 m, door gap on the EAST wall (z −0.9..0.9)
        wall(-5, -4, 5, -4),
        wall(-5, 4, 5, 4),
        wall(-5, -4, -5, 4),
        wall(5, -4, 5, -0.9),
        wall(5, 0.9, 5, 4)
    ];
    return {
        id: 'mamas-kitchen',
        name: "Mama's Kitchen",
        locationId: 'food-area',
        size: {
            w: 10,
            d: 8
        },
        rooms: [
            {
                name: 'Kitchen',
                x: 0.8,
                z: 1.4,
                w: 8.4,
                d: 5.2
            },
            {
                name: 'Seating',
                x: -2.2,
                z: -1.6,
                w: 5.6,
                d: 4.8
            }
        ],
        walls,
        furniture: [
            // the long serving counter with pots
            {
                kind: 'counter',
                x: 0.6,
                z: 2.6,
                rotY: 0,
                s: 2.1,
                tone: 0
            },
            {
                kind: 'pot',
                x: -0.9,
                z: 2.5,
                rotY: 0,
                tone: 0,
                s: 1.4
            },
            {
                kind: 'pot',
                x: 0.7,
                z: 2.5,
                rotY: 0,
                tone: 1,
                s: 1.2
            },
            {
                kind: 'pot',
                x: 2.1,
                z: 2.5,
                rotY: 0,
                tone: 2,
                s: 1.3
            },
            {
                kind: 'stove',
                x: 3.6,
                z: 3.2,
                rotY: Math.PI,
                tone: 1
            },
            {
                kind: 'shelf',
                x: -1.4,
                z: 3.6,
                rotY: Math.PI,
                tone: 0
            },
            {
                kind: 'fridge',
                x: 4.4,
                z: 1.9,
                rotY: -Math.PI / 2,
                tone: 1
            },
            {
                kind: 'menu',
                x: 0.6,
                z: 1.75,
                rotY: Math.PI,
                tone: 0
            },
            // seating
            {
                kind: 'table',
                x: -2.3,
                z: -1.3,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'bench',
                x: -2.3,
                z: -0.35,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'bench',
                x: -2.3,
                z: -2.25,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'table',
                x: -4.1,
                z: -2.6,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'chair',
                x: -4.1,
                z: -3.4,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'crate',
                x: -4.5,
                z: 3.3,
                rotY: 0.3,
                tone: 0
            },
            {
                kind: 'crate',
                x: -3.7,
                z: 3.5,
                rotY: -0.2,
                tone: 1
            },
            {
                kind: 'fan',
                x: 4.5,
                z: -3.4,
                rotY: -Math.PI / 4,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'mamas-menu',
                kind: 'menu',
                x: 0.6,
                z: 1.25,
                label: "Order from Mama's menu"
            },
            {
                id: 'mamas-exit',
                kind: 'exit',
                x: 4.4,
                z: 0,
                label: 'Step back to the food strip'
            }
        ],
        spawn: {
            x: 3.9,
            z: 0,
            facing: -Math.PI / 2
        },
        door: {
            x: 4.5,
            z: 0
        },
        palette: {
            floor: '#9c7a4f',
            floorAlt: '#8a6a42',
            wall: '#f0e4cc',
            accent: '#c94f2e'
        },
        mealSpot: true,
        shopSpot: false
    };
})();
/* ----------------------------- kpata provision store ---------------------------- */ const KPATA_SHOP = (()=>{
    const walls = [
        // 9 × 7 m, door gap on the SOUTH wall (x −0.9..0.9)
        wall(-4.5, -3.5, 4.5, -3.5),
        wall(-4.5, -3.5, -4.5, 3.5),
        wall(4.5, -3.5, 4.5, 3.5),
        wall(-4.5, 3.5, -0.9, 3.5),
        wall(0.9, 3.5, 4.5, 3.5)
    ];
    return {
        id: 'kpata-shop',
        name: 'Kpata Provision Store',
        locationId: 'kpata-market',
        size: {
            w: 9,
            d: 7
        },
        rooms: [
            {
                name: 'Shop floor',
                x: 0,
                z: 0,
                w: 9,
                d: 7
            }
        ],
        walls,
        furniture: [
            // three shelf rows with goods — the east side stays open to the door
            {
                kind: 'shelf',
                x: -0.7,
                z: -2.4,
                rotY: 0,
                s: 1.5,
                tone: 0
            },
            {
                kind: 'shelf',
                x: -0.7,
                z: -0.3,
                rotY: 0,
                s: 1.5,
                tone: 1
            },
            {
                kind: 'shelf',
                x: -0.7,
                z: 1.9,
                rotY: 0,
                s: 1.5,
                tone: 2
            },
            // the provisions counter
            {
                kind: 'counter',
                x: 2.9,
                z: -2.2,
                rotY: Math.PI / 2,
                tone: 0
            },
            {
                kind: 'crate',
                x: 3.9,
                z: -0.6,
                rotY: 0.2,
                tone: 0
            },
            {
                kind: 'crate',
                x: 3.9,
                z: 0.2,
                rotY: -0.1,
                tone: 1
            },
            {
                kind: 'crate',
                x: 3.9,
                z: 1.0,
                rotY: 0.35,
                tone: 2
            },
            {
                kind: 'fridge',
                x: -3.9,
                z: 2.8,
                rotY: Math.PI / 2,
                tone: 0
            },
            {
                kind: 'fan',
                x: 4.0,
                z: 3.0,
                rotY: Math.PI,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'kpata-counter',
                kind: 'shop',
                x: 2.0,
                z: -1.2,
                label: 'Buy foodstuff at the counter'
            },
            {
                id: 'kpata-exit',
                kind: 'exit',
                x: 0,
                z: 2.8,
                label: 'Step back to the market'
            }
        ],
        spawn: {
            x: 0,
            z: 2.75,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: 3.05
        },
        palette: {
            floor: '#ad8756',
            floorAlt: '#9c774a',
            wall: '#e2d5b8',
            accent: '#3a6ea3'
        },
        mealSpot: false,
        shopSpot: true
    };
})();
/* ------------------------------- peak fitness gym ------------------------------- */ const GYM = (()=>{
    const walls = [
        // 11 × 8 m, door gap on the SOUTH wall (x −0.9..0.9)
        wall(-5.5, -4, 5.5, -4),
        wall(-5.5, -4, -5.5, 4),
        wall(5.5, -4, 5.5, 4),
        wall(-5.5, 4, -0.9, 4),
        wall(0.9, 4, 5.5, 4)
    ];
    return {
        id: 'peak-gym',
        name: 'Peak Fitness Gym',
        locationId: 'university-area',
        size: {
            w: 11,
            d: 8
        },
        rooms: [
            {
                name: 'Weights corner',
                x: -3,
                z: -1,
                w: 5,
                d: 6
            },
            {
                name: 'Cardio row',
                x: 3.2,
                z: -1.6,
                w: 4.2,
                d: 4.4
            }
        ],
        walls,
        furniture: [
            // wall mirror strip + the house motto (both hang on the north wall)
            {
                kind: 'mirror-strip',
                x: 1.4,
                z: -3.83,
                rotY: 0,
                s: 1.4,
                tone: 0
            },
            {
                kind: 'sign',
                x: -2.9,
                z: -3.82,
                rotY: 0,
                tone: 0
            },
            // weights corner
            {
                kind: 'dumbbell-rack',
                x: -5.02,
                z: 0.1,
                rotY: -Math.PI / 2,
                tone: 0
            },
            {
                kind: 'crate',
                x: -5.0,
                z: 1.9,
                rotY: 0.2,
                tone: 0
            },
            {
                kind: 'bench-press',
                x: -3.3,
                z: -2.4,
                rotY: 0,
                tone: 0
            },
            // cardio row
            {
                kind: 'treadmill',
                x: 4.5,
                z: -2.4,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'shelf',
                x: 4.0,
                z: -3.68,
                rotY: 0,
                s: 0.9,
                tone: 2
            },
            {
                kind: 'bench',
                x: 4.95,
                z: 0.6,
                rotY: -Math.PI / 2,
                tone: 1
            },
            // open floor: mats for stretching under the ceiling fan
            {
                kind: 'ceilingfan',
                x: 0,
                z: 0.4,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'mat',
                x: -1.2,
                z: 1.5,
                rotY: 0.1,
                tone: 0
            },
            {
                kind: 'mat',
                x: 0.2,
                z: 1.7,
                rotY: -0.12,
                tone: 1
            },
            {
                kind: 'fan',
                x: -4.9,
                z: 3.3,
                rotY: -Math.PI / 4,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'gym-exit',
                kind: 'exit',
                x: 0,
                z: 3.2,
                label: 'Step back to the campus'
            }
        ],
        actions: [
            {
                id: 'gym-workout',
                kind: 'workout',
                x: -1.5,
                z: -0.9,
                label: 'Hit a workout'
            }
        ],
        spawn: {
            x: 0,
            z: 2.6,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: 3.55
        },
        palette: {
            floor: '#3a3e44',
            floorAlt: '#2f3237',
            wall: '#e6ddc8',
            accent: '#c94f2e'
        },
        mealSpot: false,
        shopSpot: false
    };
})();
/* ---------------------------- lokoja microfinance bank ---------------------------- */ const BANK = (()=>{
    const walls = [
        // 12 × 9 m, door gap on the SOUTH wall (x −0.9..0.9)
        wall(-6, -4.5, 6, -4.5),
        wall(-6, -4.5, -6, 4.5),
        wall(6, -4.5, 6, 4.5),
        wall(-6, 4.5, -0.9, 4.5),
        wall(0.9, 4.5, 6, 4.5)
    ];
    return {
        id: 'lokoja-microfinance',
        name: 'Lokoja Microfinance Bank',
        locationId: 'government-area',
        size: {
            w: 12,
            d: 9
        },
        rooms: [
            {
                name: 'Banking hall',
                x: 0,
                z: 0.4,
                w: 12,
                d: 7.4
            },
            {
                name: 'Teller row',
                x: 2.2,
                z: -2.4,
                w: 6.4,
                d: 3.4
            }
        ],
        walls,
        furniture: [
            // the teller counter + glass partition, queue board beside it
            {
                kind: 'counter',
                x: 2.2,
                z: -2.6,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'partition',
                x: 2.2,
                z: -1.82,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'queueboard',
                x: 4.9,
                z: -2.6,
                rotY: -Math.PI / 2,
                tone: 0
            },
            // the vault — back wall, very serious
            {
                kind: 'vault',
                x: -3.8,
                z: -4.15,
                rotY: 0,
                tone: 0
            },
            // queue benches
            {
                kind: 'bench',
                x: -1.9,
                z: 0.9,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'bench',
                x: -1.9,
                z: 2.1,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'shelf',
                x: 5.6,
                z: 1.4,
                rotY: -Math.PI / 2,
                tone: 1
            },
            {
                kind: 'fridge',
                x: 5.4,
                z: -4.0,
                rotY: -Math.PI / 2,
                tone: 1
            },
            {
                kind: 'crate',
                x: -5.3,
                z: 3.7,
                rotY: 0.25,
                tone: 0
            },
            {
                kind: 'ceilingfan',
                x: -2.2,
                z: -1.6,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'ceilingfan',
                x: 2.6,
                z: 1.6,
                rotY: 0,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'bank-exit',
                kind: 'exit',
                x: 0,
                z: 3.2,
                label: 'Step back to the secretariat'
            }
        ],
        actions: [
            {
                id: 'bank-teller',
                kind: 'bank-teller',
                x: 2.2,
                z: -1.05,
                label: 'Join the queue'
            }
        ],
        spawn: {
            x: 0,
            z: 2.6,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: 4.05
        },
        palette: {
            floor: '#cfc8b8',
            floorAlt: '#bfb6a2',
            wall: '#eee6d2',
            accent: '#1d5c8a'
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
})();
/* ----------------------------- golden nights lounge ------------------------------ */ const LOUNGE = (()=>{
    const walls = [
        // 10 × 8 m, door gap on the EAST wall (z −0.9..0.9)
        wall(-5, -4, 5, -4),
        wall(-5, 4, 5, 4),
        wall(-5, -4, -5, 4),
        wall(5, -4, 5, -0.9),
        wall(5, 0.9, 5, 4)
    ];
    return {
        id: 'golden-nights',
        name: 'Golden Nights Lounge',
        locationId: 'food-area',
        size: {
            w: 10,
            d: 8
        },
        rooms: [
            {
                name: 'Dance floor',
                x: 0.4,
                z: -0.8,
                w: 7.6,
                d: 5.6
            },
            {
                name: 'Bar counter',
                x: -1,
                z: 2.6,
                w: 6.4,
                d: 2.8
            }
        ],
        walls,
        furniture: [
            // the dark wood bar + backlit bottle shelf
            {
                kind: 'counter',
                x: -1.0,
                z: 2.8,
                rotY: 0,
                s: 1.5,
                tone: 0
            },
            {
                kind: 'bottle-shelf',
                x: -1.0,
                z: 3.6,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'crate',
                x: -4.5,
                z: 3.4,
                rotY: 0.25,
                tone: 0
            },
            // booth seats with drink tables on the west side
            {
                kind: 'booth',
                x: -4.4,
                z: -0.8,
                rotY: Math.PI / 2,
                tone: 1
            },
            {
                kind: 'booth',
                x: -4.4,
                z: -2.8,
                rotY: Math.PI / 2,
                tone: 2
            },
            {
                kind: 'drink-table',
                x: -3.3,
                z: -0.8,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'drink-table',
                x: -3.3,
                z: -2.8,
                rotY: 0,
                tone: 0
            },
            // DJ corner + speaker stacks
            {
                kind: 'dj-deck',
                x: 3.6,
                z: -3.3,
                rotY: Math.PI,
                tone: 0
            },
            {
                kind: 'speaker',
                x: 4.55,
                z: -3.35,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'speaker',
                x: 2.4,
                z: -3.4,
                rotY: 0,
                tone: 1
            },
            // scattered tables with glasses on the dance floor
            {
                kind: 'drink-table',
                x: 2.6,
                z: -1.5,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'drink-table',
                x: 0.6,
                z: 0.8,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'rug',
                x: 0.6,
                z: -0.6,
                rotY: 0,
                s: 1.3,
                tone: 2
            },
            // accents
            {
                kind: 'sign',
                x: -2.0,
                z: -3.8,
                rotY: 0,
                s: 1.2,
                tone: 1
            },
            {
                kind: 'fan',
                x: 4.4,
                z: 2.9,
                rotY: Math.PI,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'lounge-exit',
                kind: 'exit',
                x: 4.1,
                z: 0,
                label: 'Step back to the food strip'
            }
        ],
        actions: [
            {
                id: 'lounge-night-out',
                kind: 'night-out',
                x: -1.0,
                z: 0.9,
                label: 'Pull up a booth'
            }
        ],
        spawn: {
            x: 3.5,
            z: 0,
            facing: -Math.PI / 2
        },
        door: {
            x: 4.5,
            z: 0
        },
        palette: {
            floor: '#4a3524',
            floorAlt: '#3e2c1e',
            wall: '#2e2620',
            accent: '#e8a317'
        },
        mealSpot: false,
        shopSpot: false
    };
})();
/* --------------------------- M2 — the civic mesh ------------------------------
 * Four service halls around the GRA clearing. One shared anatomy — a service
 * counter with its queue, waiting benches, a ceiling fan that actually
 * spins, the agency's notice wall — because every Nigerian office is the
 * same room with a different colour of paint. The desks carry ONE action
 * kind ('civic-desk'); CivicPanel reads the interior id and serves the
 * right agency. Payments flow through the same store actions the phone uses.
 * ---------------------------------------------------------------------------- */ function civicHall(opts) {
    const { id, name, deskLabel, palette, counterTone } = opts;
    // 10 × 8 m, door gap on the SOUTH wall (x −0.9..0.9) — the bank's plan,
    // one size smaller: government offices never built big since '76
    const walls = [
        wall(-5, -4, 5, -4),
        wall(-5, -4, -5, 4),
        wall(5, -4, 5, 4),
        wall(-5, 4, -0.9, 4),
        wall(0.9, 4, 5, 4)
    ];
    return {
        id,
        name,
        locationId: 'government-area',
        size: {
            w: 10,
            d: 8
        },
        rooms: [
            {
                name: 'Waiting hall',
                x: 0,
                z: 1.2,
                w: 10,
                d: 5.2
            },
            {
                name: 'Service row',
                x: 0,
                z: -2.4,
                w: 10,
                d: 3
            }
        ],
        walls,
        furniture: [
            // the service counter + glass partition, queue board beside it
            {
                kind: 'counter',
                x: 0,
                z: -2.6,
                rotY: 0,
                tone: counterTone
            },
            {
                kind: 'partition',
                x: 0,
                z: -1.82,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'queueboard',
                x: 2.9,
                z: -2.6,
                rotY: -Math.PI / 2,
                tone: 0
            },
            // the officer's side — desk, chair, filing shelf, the agency notice wall
            {
                kind: 'table',
                x: -1.6,
                z: -3.3,
                rotY: 0,
                tone: counterTone
            },
            {
                kind: 'chair',
                x: -1.6,
                z: -3.9,
                rotY: Math.PI,
                tone: counterTone
            },
            {
                kind: 'shelf',
                x: -4.55,
                z: -3,
                rotY: Math.PI / 2,
                tone: counterTone
            },
            {
                kind: 'sign',
                x: 4.3,
                z: -3.8,
                rotY: 0,
                s: 1.1,
                tone: counterTone
            },
            // the queue — patient benches under a spinning fan
            {
                kind: 'bench',
                x: -1.8,
                z: 1.4,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'bench',
                x: -1.8,
                z: 2.7,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'ceilingfan',
                x: 0,
                z: 0.2,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'crate',
                x: 4.4,
                z: 3.4,
                rotY: 0.2,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: `${id}-exit`,
                kind: 'exit',
                x: 0,
                z: 3.1,
                label: 'Step back to the GRA'
            }
        ],
        actions: [
            {
                id: `${id}-desk`,
                kind: 'civic-desk',
                x: 0,
                z: -1.05,
                label: deskLabel
            }
        ],
        spawn: {
            x: 0,
            z: 2.4,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: 3.55
        },
        palette,
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
}
const KGIRS_OFFICE = civicHall({
    id: 'kgirs-office',
    name: 'KGIRS Revenue Office',
    deskLabel: 'Join the revenue queue',
    palette: {
        floor: '#cfd4c2',
        floorAlt: '#bfc5ae',
        wall: '#e9ecd8',
        accent: '#5C6E3A'
    },
    counterTone: 3
});
const NEPA_OFFICE = civicHall({
    id: 'nepa-office',
    name: 'NEPA District Office',
    deskLabel: 'Join the light queue',
    palette: {
        floor: '#d8d2c4',
        floorAlt: '#c6bfae',
        wall: '#efe9da',
        accent: '#b9821f'
    },
    counterTone: 1
});
const POLICE_STATION = civicHall({
    id: 'police-station',
    name: 'GRA Police Station',
    deskLabel: 'Approach the duty desk',
    palette: {
        floor: '#c9ccd4',
        floorAlt: '#b6bac4',
        wall: '#e6e8ee',
        accent: '#1f3a5c'
    },
    counterTone: 5
});
const EFCC_OFFICE = civicHall({
    id: 'efcc-office',
    name: 'EFCC Zonal Command',
    deskLabel: 'Speak to the commission',
    palette: {
        floor: '#d4cdc4',
        floorAlt: '#c2bab0',
        wall: '#ece5da',
        accent: '#2e5c46'
    },
    counterTone: 2
});
const INTERIORS = [
    HOME,
    MAMAS,
    KPATA_SHOP,
    GYM,
    BANK,
    LOUNGE,
    KGIRS_OFFICE,
    NEPA_OFFICE,
    POLICE_STATION,
    EFCC_OFFICE
];
;
INTERIORS.push(...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_INTERIORS"]);
const INTERIOR_BY_ID = Object.fromEntries(INTERIORS.map((i)=>[
        i.id,
        i
    ]));
function interiorColliders(def) {
    const boxes = [];
    for (const w of def.walls){
        boxes.push({
            cx: w.x,
            cz: w.z,
            hw: w.w / 2,
            hd: w.d / 2,
            cos: 1,
            sin: 0,
            rotY: 0
        });
    }
    for (const f of def.furniture){
        const fp = FURN_FOOTPRINT[f.kind];
        if (!fp.solid) continue;
        const s = f.s ?? 1;
        boxes.push({
            cx: f.x,
            cz: f.z,
            hw: fp.w * s / 2 + 0.08,
            hd: fp.d * s / 2 + 0.08,
            cos: Math.cos(-f.rotY),
            sin: Math.sin(-f.rotY),
            rotY: f.rotY
        });
    }
    return boxes;
}
const COLLIDER_CACHE = new Map();
function collidersFor(def) {
    let c = COLLIDER_CACHE.get(def.id);
    if (!c) {
        c = interiorColliders(def);
        COLLIDER_CACHE.set(def.id, c);
    }
    return c;
}
/** push a circle out of an oriented box (same math as the world resolver) */ function resolveBox(x, z, r, b) {
    const dx = x - b.cx;
    const dz = z - b.cz;
    const lx = dx * b.cos - dz * b.sin;
    const lz = dx * b.sin + dz * b.cos;
    const clampedX = Math.max(-b.hw, Math.min(b.hw, lx));
    const clampedZ = Math.max(-b.hd, Math.min(b.hd, lz));
    const ox = lx - clampedX;
    const oz = lz - clampedZ;
    const dist2 = ox * ox + oz * oz;
    if (dist2 > r * r) return [
        x,
        z
    ];
    if (dist2 > 1e-6) {
        const dist = Math.sqrt(dist2);
        const push = (r - dist) / dist;
        const rx = ox * push;
        const rz = oz * push;
        const wcos = Math.cos(b.rotY);
        const wsin = Math.sin(b.rotY);
        return [
            x + (rx * wcos - rz * wsin),
            z + (rx * wsin + rz * wcos)
        ];
    }
    const dxFace = b.hw - Math.abs(lx);
    const dzFace = b.hd - Math.abs(lz);
    if (dxFace < dzFace) {
        const nl = lx >= 0 ? b.hw + r : -b.hw - r;
        const rx = nl - lx;
        const wcos = Math.cos(b.rotY);
        const wsin = Math.sin(b.rotY);
        return [
            x + rx * wcos,
            z + rx * wsin
        ];
    }
    const nl = lz >= 0 ? b.hd + r : -b.hd - r;
    const rz = nl - lz;
    const wcos = Math.cos(b.rotY);
    const wsin = Math.sin(b.rotY);
    return [
        x + -rz * wsin,
        z + rz * wcos
    ];
}
const INTERIOR_PLAYER_RADIUS = 0.42;
function resolveInteriorPosition(def, x, z, r = INTERIOR_PLAYER_RADIUS) {
    for (const b of collidersFor(def)){
        const dx = x - b.cx;
        const dz = z - b.cz;
        if (dx * dx + dz * dz > (b.hw + b.hd + r) ** 2) continue;
        [x, z] = resolveBox(x, z, r, b);
    }
    const hx = def.size.w / 2 - r - 0.05;
    const hz = def.size.d / 2 - r - 0.05;
    x = Math.max(-hx, Math.min(hx, x));
    z = Math.max(-hz, Math.min(hz, z));
    return [
        x,
        z
    ];
}
/* ------------------- G2 — district interiors (spaces breadth) -------------------
 * Door-worthy rooms for the G2 roster expansion, schema-identical to the
 * interiors above. They register in INTERIOR_BY_ID (so every consumer keeps
 * one honest lookup) but intentionally stay OUT of the INTERIORS array: the
 * 3D door mesh in world3d/layout.ts is pinned one-door-per-INTERIORS-entry
 * by scripts/test-world3d.ts, and the new pins' exterior door positions are
 * the parent's next wiring step. scripts/test-m21-spaces.ts runs the SAME
 * laws over this registry: footprint validity, spawn/clamp, exit hotspot,
 * BFS pathability from spawn to every hotspot and action.
 * ------------------------------------------------------------------------------ */ const PALACE_HALL = (()=>{
    const walls = [
        // 12 × 9 m, door gap on the SOUTH wall (x −0.9..0.9)
        wall(-6, -4.5, 6, -4.5),
        wall(-6, -4.5, -6, 4.5),
        wall(6, -4.5, 6, 4.5),
        wall(-6, 4.5, -0.9, 4.5),
        wall(0.9, 4.5, 6, 4.5)
    ];
    return {
        id: 'palace-reception-hall',
        name: "Maigari's Reception Hall",
        locationId: 'maigari-palace',
        size: {
            w: 12,
            d: 9
        },
        rooms: [
            {
                name: 'Audience floor',
                x: 0,
                z: 1.1,
                w: 12,
                d: 6.2
            },
            {
                name: 'Throne dais',
                x: 0,
                z: -3.4,
                w: 12,
                d: 2.2
            }
        ],
        walls,
        furniture: [
            // the dais — a low riser, the throne chair, flanking stools
            {
                kind: 'riser',
                x: 0,
                z: -3.6,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'podium',
                x: 0,
                z: -3.75,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'chair',
                x: -1.4,
                z: -3.7,
                rotY: Math.PI,
                tone: 1
            },
            {
                kind: 'chair',
                x: 1.4,
                z: -3.7,
                rotY: Math.PI,
                tone: 2
            },
            {
                kind: 'sign',
                x: 0,
                z: -4.3,
                rotY: 0,
                s: 1.3,
                tone: 0
            },
            // visitors' benches down both sides of the audience floor
            {
                kind: 'bench',
                x: -2.7,
                z: 0.4,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'bench',
                x: 2.7,
                z: 0.4,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'bench',
                x: -2.7,
                z: 1.9,
                rotY: 0,
                tone: 2
            },
            {
                kind: 'bench',
                x: 2.7,
                z: 1.9,
                rotY: 0,
                tone: 2
            },
            // the mat where petitioners stand, and the hall's dignity
            {
                kind: 'rug',
                x: 0,
                z: 0.6,
                rotY: 0,
                s: 1.4,
                tone: 0
            },
            {
                kind: 'shelf',
                x: -5.55,
                z: -1.2,
                rotY: Math.PI / 2,
                tone: 1
            },
            {
                kind: 'ceilingfan',
                x: 0,
                z: -1.2,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'pot',
                x: -3.9,
                z: 3.5,
                rotY: 0,
                tone: 0,
                s: 1.3
            },
            {
                kind: 'pot',
                x: 3.9,
                z: 3.5,
                rotY: 0,
                tone: 1,
                s: 1.3
            }
        ],
        hotspots: [
            {
                id: 'palace-exit',
                kind: 'exit',
                x: 0,
                z: 3.2,
                label: 'Step out of the palace'
            }
        ],
        spawn: {
            x: 0,
            z: 2.4,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: 4.05
        },
        palette: {
            floor: '#a8824f',
            floorAlt: '#93713f',
            wall: '#efe2c4',
            accent: '#8A3A6E'
        },
        mealSpot: false,
        shopSpot: false
    };
})();
const STADIUM_OFFICE = (()=>{
    const walls = [
        // 10 × 8 m, door gap on the SOUTH wall (x −0.9..0.9)
        wall(-5, -4, 5, -4),
        wall(-5, -4, -5, 4),
        wall(5, -4, 5, 4),
        wall(-5, 4, -0.9, 4),
        wall(0.9, 4, 5, 4)
    ];
    return {
        id: 'stadium-office',
        name: 'Township Stadium Office',
        locationId: 'township-stadium',
        size: {
            w: 10,
            d: 8
        },
        rooms: [
            {
                name: 'Waiting hall',
                x: 0,
                z: 1.2,
                w: 10,
                d: 5.2
            },
            {
                name: 'Fixtures desk',
                x: 0,
                z: -2.4,
                w: 10,
                d: 3
            }
        ],
        walls,
        furniture: [
            // the secretary's counter + queue board (every Nigerian office, one plan)
            {
                kind: 'counter',
                x: 0,
                z: -2.6,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'partition',
                x: 0,
                z: -1.82,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'queueboard',
                x: 2.9,
                z: -2.6,
                rotY: -Math.PI / 2,
                tone: 0
            },
            {
                kind: 'table',
                x: -1.6,
                z: -3.3,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'chair',
                x: -1.6,
                z: -3.9,
                rotY: Math.PI,
                tone: 1
            },
            {
                kind: 'shelf',
                x: -4.55,
                z: -3,
                rotY: Math.PI / 2,
                tone: 1
            },
            {
                kind: 'sign',
                x: 4.3,
                z: -3.8,
                rotY: 0,
                s: 1.1,
                tone: 0
            },
            // matchday queue benches under the fan
            {
                kind: 'bench',
                x: -1.8,
                z: 1.4,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'bench',
                x: -1.8,
                z: 2.7,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'ceilingfan',
                x: 0,
                z: 0.2,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'crate',
                x: 4.4,
                z: 3.4,
                rotY: 0.2,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'stadium-office-exit',
                kind: 'exit',
                x: 0,
                z: 3.1,
                label: 'Step back to the stands'
            }
        ],
        spawn: {
            x: 0,
            z: 2.4,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: 3.55
        },
        palette: {
            floor: '#b4a886',
            floorAlt: '#a2966f',
            wall: '#ece6d2',
            accent: '#3D8A37'
        },
        floorTiles: true,
        mealSpot: false,
        shopSpot: false
    };
})();
const SOKAMMS_ROOM = (()=>{
    const walls = [
        // 8 × 6 m, door gap on the EAST wall (z −0.9..0.9)
        wall(-4, -3, 4, -3),
        wall(-4, 3, 4, 3),
        wall(-4, -3, -4, 3),
        wall(4, -3, 4, -0.9),
        wall(4, 0.9, 4, 3)
    ];
    return {
        id: 'sokamms-room',
        name: 'Sokamms Room 4',
        locationId: 'sokamms-motel',
        size: {
            w: 8,
            d: 6
        },
        rooms: [
            {
                name: 'Bedside',
                x: -1.4,
                z: -0.4,
                w: 5,
                d: 5
            },
            {
                name: 'Wash corner',
                x: 3.1,
                z: -2,
                w: 1.8,
                d: 2
            }
        ],
        walls,
        furniture: [
            {
                kind: 'bed',
                x: -2.5,
                z: -1.4,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'wardrobe',
                x: -0.8,
                z: -2.55,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'tv',
                x: 0.6,
                z: -1.3,
                rotY: Math.PI,
                tone: 0
            },
            {
                kind: 'shower',
                x: 3.2,
                z: -2.2,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'mirror',
                x: 3.7,
                z: -1.1,
                rotY: -Math.PI / 2,
                tone: 0
            },
            {
                kind: 'table',
                x: -2.9,
                z: 1.9,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'chair',
                x: -1.9,
                z: 1.9,
                rotY: -Math.PI / 2,
                tone: 0
            },
            {
                kind: 'fan',
                x: 2.9,
                z: 2.3,
                rotY: -Math.PI / 4,
                tone: 0
            },
            {
                kind: 'mat',
                x: 2.9,
                z: 0,
                rotY: 0,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'sokamms-bed',
                kind: 'bed',
                x: -2.5,
                z: -0.5,
                label: 'Rest on the bed'
            },
            {
                id: 'sokamms-bath',
                kind: 'bath',
                x: 3.1,
                z: -1.4,
                label: 'Freshen up'
            },
            {
                id: 'sokamms-tv',
                kind: 'tv',
                x: 0.6,
                z: -0.5,
                label: 'Watch some TV'
            },
            {
                id: 'sokamms-exit',
                kind: 'exit',
                x: 3.2,
                z: 0.6,
                label: 'Check out to the road'
            }
        ],
        spawn: {
            x: 2.7,
            z: 0,
            facing: -Math.PI / 2
        },
        door: {
            x: 3.7,
            z: 0
        },
        palette: {
            floor: '#8a7454',
            floorAlt: '#79654a',
            wall: '#efe6d0',
            accent: '#4A6E8A'
        },
        mealSpot: false,
        shopSpot: false
    };
})();
const ADANKOLO_READING_ROOM = (()=>{
    const walls = [
        // 10 × 8 m, door gap on the SOUTH wall (x −0.9..0.9)
        wall(-5, -4, 5, -4),
        wall(-5, -4, -5, 4),
        wall(5, -4, 5, 4),
        wall(-5, 4, -0.9, 4),
        wall(0.9, 4, 5, 4)
    ];
    return {
        id: 'adankolo-reading-room',
        name: 'Adankolo Community Study Room',
        locationId: 'adankolo',
        size: {
            w: 10,
            d: 8
        },
        rooms: [
            {
                name: 'Desk rows',
                x: 0,
                z: -0.3,
                w: 10,
                d: 5.4
            },
            {
                name: 'Welcome mat',
                x: 0,
                z: 3,
                w: 10,
                d: 1.8
            }
        ],
        walls,
        furniture: [
            // two rows of two school desks facing the blackboard
            {
                kind: 'blackboard',
                x: 0,
                z: -3.8,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'school-desk',
                x: -2.2,
                z: -1.5,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'school-desk',
                x: 0.6,
                z: -1.5,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'school-desk',
                x: -2.2,
                z: 0.9,
                rotY: 0,
                tone: 2
            },
            {
                kind: 'school-desk',
                x: 0.6,
                z: 0.9,
                rotY: 0,
                tone: 0
            },
            // the lending shelf and the wall map of Kogi
            {
                kind: 'shelf',
                x: -4.55,
                z: 2.4,
                rotY: Math.PI / 2,
                tone: 1
            },
            {
                kind: 'wallmap',
                x: 3.2,
                z: -3.85,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'ceilingfan',
                x: -0.8,
                z: -0.3,
                rotY: 0,
                tone: 0
            },
            {
                kind: 'sign',
                x: -3.6,
                z: -3.8,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'fan',
                x: 4.5,
                z: 3.3,
                rotY: Math.PI,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'adankolo-reading-exit',
                kind: 'exit',
                x: 0,
                z: 3.1,
                label: 'Step back to the ward'
            }
        ],
        actions: [
            {
                id: 'adankolo-reading-study',
                kind: 'study',
                x: -0.9,
                z: -0.3,
                label: 'Read for a while'
            }
        ],
        spawn: {
            x: 0,
            z: 2.6,
            facing: Math.PI
        },
        door: {
            x: 0,
            z: 3.55
        },
        palette: {
            floor: '#9c7a4f',
            floorAlt: '#8a6a42',
            wall: '#e9e0c8',
            accent: '#2E7D5B'
        },
        mealSpot: false,
        shopSpot: false
    };
})();
const EMIWOZIRI_FISH_SHED = (()=>{
    const walls = [
        // 8 × 6 m, door gap on the EAST wall (z −0.9..0.9)
        wall(-4, -3, 4, -3),
        wall(-4, 3, 4, 3),
        wall(-4, -3, -4, 3),
        wall(4, -3, 4, -0.9),
        wall(4, 0.9, 4, 3)
    ];
    return {
        id: 'emiwoziri-fish-shed',
        name: 'Emiwoziri Fish Shed',
        locationId: 'emiwoziri',
        size: {
            w: 8,
            d: 6
        },
        rooms: [
            {
                name: 'Shed floor',
                x: 0,
                z: 0,
                w: 8,
                d: 6
            }
        ],
        walls,
        furniture: [
            // the gutting counter with its pots, crates of the morning catch
            {
                kind: 'counter',
                x: -1.0,
                z: -2.2,
                rotY: 0,
                s: 1.2,
                tone: 0
            },
            {
                kind: 'pot',
                x: -1.7,
                z: -2.1,
                rotY: 0,
                tone: 0,
                s: 1.1
            },
            {
                kind: 'pot',
                x: -0.4,
                z: -2.1,
                rotY: 0,
                tone: 1,
                s: 1.1
            },
            {
                kind: 'crate',
                x: -3.3,
                z: 1.6,
                rotY: 0.2,
                tone: 0
            },
            {
                kind: 'crate',
                x: -2.5,
                z: 2.0,
                rotY: -0.15,
                tone: 1
            },
            {
                kind: 'crate',
                x: -3.1,
                z: -1.6,
                rotY: 0.4,
                tone: 2
            },
            {
                kind: 'shelf',
                x: -3.65,
                z: 0,
                rotY: Math.PI / 2,
                tone: 0
            },
            {
                kind: 'bench',
                x: 1.6,
                z: 1.9,
                rotY: 0,
                tone: 1
            },
            {
                kind: 'fan',
                x: 3.4,
                z: 2.4,
                rotY: -Math.PI / 4,
                tone: 0
            }
        ],
        hotspots: [
            {
                id: 'emiwoziri-shed-exit',
                kind: 'exit',
                x: 3.1,
                z: 0,
                label: 'Step out to the landing'
            }
        ],
        spawn: {
            x: 2.5,
            z: 0,
            facing: -Math.PI / 2
        },
        door: {
            x: 3.7,
            z: 0
        },
        palette: {
            floor: '#7d6a4a',
            floorAlt: '#6d5b3e',
            wall: '#ddd2b4',
            accent: '#2C6E8A'
        },
        mealSpot: false,
        shopSpot: false
    };
})();
const DISTRICT_INTERIORS = [
    PALACE_HALL,
    STADIUM_OFFICE,
    SOKAMMS_ROOM,
    ADANKOLO_READING_ROOM,
    EMIWOZIRI_FISH_SHED
];
// keep INTERIOR_BY_ID the single source every consumer trusts
for (const gi of DISTRICT_INTERIORS)INTERIOR_BY_ID[gi.id] = gi;
}),
"[project]/src/game/world3d/terrainArt.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hash1",
    ()=>hash1,
    "makeAsphaltRoadTexture",
    ()=>makeAsphaltRoadTexture,
    "makeGroundGrainTexture",
    ()=>makeGroundGrainTexture,
    "makeLateriteRoadTexture",
    ()=>makeLateriteRoadTexture,
    "mergeGeoms",
    ()=>mergeGeoms,
    "roadTextures",
    ()=>roadTextures
]);
/**
 * LOKOJA LIFE — terrain art helpers (Stage 4C)
 * ---------------------------------------------
 * Baked-once canvas textures and geometry utilities for the ground half of
 * the world (terrain grain, road surfaces). Everything here is DETERMINISTIC
 * — seeded PRNG only, no Math.random — so Lokoja renders identically every
 * run. Textures stay ≤ 512px and are generated on the client only.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
;
/* ------------------------------- seeded noise ------------------------------ */ /** tiny deterministic PRNG (mulberry32) — same family as layout.ts */ function rng(seed) {
    let a = seed >>> 0;
    return ()=>{
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
function hash1(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
}
function canvas2d(w, h) {
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d');
    if (!ctx) throw new Error('2d canvas unavailable');
    return {
        cv,
        ctx
    };
}
/** per-pixel warm speckle so flat fills get grain (in place) */ function speckle(ctx, w, h, amp, r) {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for(let i = 0; i < d.length; i += 4){
        const n = (r() - 0.5) * amp;
        d[i] = Math.max(0, Math.min(255, d[i] + n));
        d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n * 0.92));
        d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * 0.74));
    }
    ctx.putImageData(img, 0, 0);
}
/** soft radial blob (mottling) */ function blob(ctx, x, y, r, color, r2) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    void r2;
}
function makeGroundGrainTexture(size = 256) {
    const { cv, ctx } = canvas2d(size, size);
    const r = rng(40211);
    ctx.fillStyle = 'rgb(238,234,222)';
    ctx.fillRect(0, 0, size, size);
    // soft mottling — darker earth patches and pale dry patches
    for(let i = 0; i < 230; i++){
        const x = r() * size;
        const y = r() * size;
        const rad = 7 + r() * 34;
        const dark = r() < 0.52;
        blob(ctx, x, y, rad, dark ? 'rgba(118,106,78,0.055)' : 'rgba(255,252,238,0.05)', r);
    }
    // sparse micro speckle (pebbles/twigs hint)
    for(let i = 0; i < 420; i++){
        const x = r() * size;
        const y = r() * size;
        ctx.fillStyle = r() < 0.5 ? 'rgba(96,86,64,0.10)' : 'rgba(236,228,200,0.10)';
        ctx.fillRect(x, y, 1.4, 1.4);
    }
    speckle(ctx, size, size, 16, r);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](cv);
    tex.wrapS = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RepeatWrapping"];
    tex.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RepeatWrapping"];
    tex.anisotropy = 8;
    return tex;
}
function makeLateriteRoadTexture() {
    const W = 128;
    const H = 256;
    const { cv, ctx } = canvas2d(W, H);
    const r = rng(73317);
    ctx.fillStyle = 'rgb(196,132,80)';
    ctx.fillRect(0, 0, W, H);
    // mottling — patches of paler dust and redder gravel
    for(let i = 0; i < 60; i++){
        const x = r() * W;
        const y = r() * H;
        const rad = 6 + r() * 22;
        blob(ctx, x, y, rad, r() < 0.5 ? 'rgba(150,92,50,0.16)' : 'rgba(224,178,120,0.14)', r);
    }
    // wheel-track bands (two darker polished strips)
    for (const u of [
        0.3,
        0.7
    ]){
        const x = u * W;
        const g = ctx.createLinearGradient(x - 15, 0, x + 15, 0);
        g.addColorStop(0, 'rgba(74,42,22,0)');
        g.addColorStop(0.5, 'rgba(74,42,22,0.34)');
        g.addColorStop(1, 'rgba(74,42,22,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - 15, 0, 30, H);
    }
    // transverse wear — faint washout bands where rain crossed the road
    for(let i = 0; i < 18; i++){
        const y = r() * H;
        const h = 3 + r() * 9;
        ctx.fillStyle = `rgba(210,170,120,${0.05 + r() * 0.08})`;
        ctx.fillRect(0, y, W, h);
    }
    // dusty shoulders — lighter at both edges
    for (const side of [
        0,
        1
    ]){
        const g = side === 0 ? ctx.createLinearGradient(0, 0, 16, 0) : ctx.createLinearGradient(W, 0, W - 16, 0);
        g.addColorStop(0, 'rgba(226,196,140,0.30)');
        g.addColorStop(1, 'rgba(226,196,140,0)');
        ctx.fillStyle = g;
        ctx.fillRect(side === 0 ? 0 : W - 16, 0, 16, H);
    }
    speckle(ctx, W, H, 26, r);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](cv);
    tex.wrapS = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClampToEdgeWrapping"];
    tex.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RepeatWrapping"];
    tex.anisotropy = 8;
    return tex;
}
function makeAsphaltRoadTexture() {
    const W = 128;
    const H = 256;
    const { cv, ctx } = canvas2d(W, H);
    const r = rng(99017);
    ctx.fillStyle = 'rgb(88,92,96)';
    ctx.fillRect(0, 0, W, H);
    // patchy repairs / tar seams
    for(let i = 0; i < 46; i++){
        const x = r() * W;
        const y = r() * H;
        const rad = 5 + r() * 20;
        blob(ctx, x, y, rad, r() < 0.55 ? 'rgba(52,56,60,0.18)' : 'rgba(130,134,132,0.12)', r);
    }
    // wheel polish — slightly darker sheen bands
    for (const u of [
        0.3,
        0.7
    ]){
        const x = u * W;
        const g = ctx.createLinearGradient(x - 14, 0, x + 14, 0);
        g.addColorStop(0, 'rgba(38,40,42,0)');
        g.addColorStop(0.5, 'rgba(38,40,42,0.26)');
        g.addColorStop(1, 'rgba(38,40,42,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - 14, 0, 28, H);
    }
    // grime at the edges (dust blowing onto the shoulder line)
    for (const side of [
        0,
        1
    ]){
        const g = side === 0 ? ctx.createLinearGradient(0, 0, 14, 0) : ctx.createLinearGradient(W, 0, W - 14, 0);
        g.addColorStop(0, 'rgba(140,124,96,0.26)');
        g.addColorStop(1, 'rgba(140,124,96,0)');
        ctx.fillStyle = g;
        ctx.fillRect(side === 0 ? 0 : W - 14, 0, 14, H);
    }
    // centre dashed line — painted, then worn back
    const lx = W * 0.5;
    const dashTop = H * 0.16;
    const dashH = H * 0.42;
    ctx.fillStyle = 'rgb(216,212,196)';
    ctx.fillRect(lx - 2.2, dashTop, 4.4, dashH);
    // wear: chip the paint with dark specks
    for(let i = 0; i < 90; i++){
        const y = dashTop + r() * dashH;
        ctx.fillStyle = `rgba(88,92,96,${0.35 + r() * 0.4})`;
        ctx.fillRect(lx - 2.2 + r() * 4.4, y, 0.9 + r() * 1.6, 1 + r() * 2.4);
    }
    speckle(ctx, W, H, 22, r);
    const tex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](cv);
    tex.wrapS = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClampToEdgeWrapping"];
    tex.wrapT = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RepeatWrapping"];
    tex.anisotropy = 8;
    return tex;
}
/* ---------------------------- shared road textures ------------------------- */ let roadTexCache = null;
function roadTextures() {
    if (!roadTexCache) {
        roadTexCache = {
            asphalt: makeAsphaltRoadTexture(),
            laterite: makeLateriteRoadTexture()
        };
    }
    return roadTexCache;
}
function mergeGeoms(list) {
    if (list.length === 1) return list[0];
    const hasUV = list.every((g)=>!!g.attributes.uv);
    const hasCol = list.every((g)=>!!g.attributes.color);
    let vTotal = 0;
    let iTotal = 0;
    for (const g of list){
        vTotal += g.attributes.position.count;
        iTotal += g.index ? g.index.count : 0;
    }
    const pos = new Float32Array(vTotal * 3);
    const uv = hasUV ? new Float32Array(vTotal * 2) : null;
    const col = hasCol ? new Float32Array(vTotal * 3) : null;
    const idx = new Uint32Array(iTotal);
    let vo = 0;
    let io = 0;
    for (const g of list){
        pos.set(g.attributes.position.array, vo * 3);
        if (uv) uv.set(g.attributes.uv.array, vo * 2);
        if (col) col.set(g.attributes.color.array, vo * 3);
        if (g.index) {
            const gi = g.index.array;
            for(let k = 0; k < gi.length; k++)idx[io + k] = gi[k] + vo;
            io += gi.length;
        }
        vo += g.attributes.position.count;
        g.dispose();
    }
    const out = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
    out.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](pos, 3));
    if (uv) out.setAttribute('uv', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](uv, 2));
    if (col) out.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](col, 3));
    out.setIndex(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferAttribute"](idx, 1));
    return out;
}
}),
"[project]/src/game/world3d/roads.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KERB_RUNS",
    ()=>KERB_RUNS,
    "ZEBRAS",
    ()=>ZEBRAS,
    "kerbStats",
    ()=>kerbStats,
    "zebraStats",
    ()=>zebraStats
]);
/**
 * LOKOJA LIFE — ROAD FURNITURE DATA (kerbs + zebra crossings)
 * ----------------------------------------------------------
 * Pure deterministic placement data derived from the real Lokoja road graph
 * in `./layout`. NO three.js, NO React, NO DOM — plain TypeScript numbers so
 * bun can run it headless and the renderer can drape/extrude the geometry.
 *
 *  - KERB_RUNS: raised concrete kerb segments along BOTH edges of every
 *    asphalt artery (highway/major/secondary). Each segment is one
 *    `KerbRun`; chains break at junction mouths (so the mouths stay open),
 *    at school/civic fences, over carved water and on bridge spans (the
 *    bridges carry their own structure), and at the walk boundary.
 *  - ZEBRAS: zebra crossings where major arteries meet — one per artery
 *    arm entering a junction cluster (the same endpoint clustering the
 *    road renderer's junctionDiscs uses), pulled back onto the mouth.
 *
 * THE GEO GATE (repo law): layout.ts derives everything at module scope
 * from the geo arrays, which the browser fills before the world chunk is
 * ever evaluated. Headless bun scripts must import scripts/geo/bootstrap.ts
 * FIRST (the established CLI pattern for every layout-derived module) —
 * this file itself only ever imports from './layout'.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
;
/* ------------------------------ tunable laws ------------------------------- */ const KERB_STEP = 4 // resample pitch along the polyline (world units)
;
const KERB_SHOULDER = 0.34 // kerb offset beyond the rendered carriageway edge
;
const KERB_CHAIN_MAX = 5 // max distance between chained kerb points
;
const KERB_GAP_MIN = 0.05 // roadGap floor — junction mouths must stay open
;
const KERB_WATER_MIN = 0.12 // height margin above the water line
;
const KERB_RIVER_MIN = 1.0 // clearance beyond a channel's half width
;
const KERB_CAP = 6000 // sanity cap on emitted segments
;
const ZEBRA_CLUSTER_R = 5 // endpoint clustering radius (junctionDiscs law)
;
const ZEBRA_PULL = 2.2 // crossing sits (renderHalf + 2.2) from cluster centre
;
const ZEBRA_WATER_MIN = 0.12 // height margin above the water line
;
const ZEBRA_RIVER_MIN = 1.5 // clearance beyond a channel's half width
;
const ZEBRA_TARMAC_MAX = 0.6 // roadGap ceiling — must sit ON the mouth
;
const ZEBRA_DEDUPE = 4 // skip a zebra if another stands within this range
;
const ZEBRA_CAP = 48;
/** the asphalt artery classes that carry kerbs */ function isArtery(r) {
    return r.cls === 'highway' || r.cls === 'major' || r.cls === 'secondary';
}
function renderHalf(cls) {
    return (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][cls] ?? 2.2) / 2;
}
/**
 * THE KERB LAWS — a candidate kerb point is valid only if ALL hold:
 *  1. heightAt > WATER_Y + 0.12            (never in carved water)
 *  2. outside school yards + civic campus  (fenced ground owns itself)
 *  3. riverInfo.d > halfWidth + 1.0        (never on a bridge span)
 *  4. roadGap >= 0.05                      (on the shoulder — junction
 *                                           mouths break the kerb open)
 *  5. within the walk boundary
 *
 * The chord law extends 4 to the whole run: a prospective segment's
 * midpoint must satisfy the same laws before it may chain (otherwise a
 * sharp-corner chord between two valid samples would cut across the very
 * carriageway the kerb lines). ~97% of law-4 breaks are real junction
 * mouths — the dense Lokoja fabric meeting the arteries.
 */ function validKerbPoint(x, z) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + KERB_WATER_MIN) return false;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) return false;
    const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
    if (ri.d <= ri.halfWidth + KERB_RIVER_MIN) return false;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < KERB_GAP_MIN) return false;
    if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) return false;
    return true;
}
const kerbRuns = [];
const kerbRoads = {};
let kerbPoints = 0;
// the two chain buffers (side 0 = +perpendicular, side 1 = −perpendicular)
const chains = [
    [],
    []
];
function flushChain(side) {
    const c = chains[side];
    for(let i = 0; i + 1 < c.length; i++){
        kerbRuns.push({
            ax: c[i].x,
            az: c[i].z,
            bx: c[i + 1].x,
            bz: c[i + 1].z
        });
    }
    kerbPoints += c.length;
    c.length = 0;
}
for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
    if (!isArtery(r)) continue;
    kerbRoads[r.cls] = (kerbRoads[r.cls] ?? 0) + 1;
    chains[0].length = 0;
    chains[1].length = 0;
    const offset = renderHalf(r.cls) + KERB_SHOULDER;
    const pts = r.pts;
    let next = 0 // arc position of the next resample
    ;
    let walked = 0 // arc position at the start of the current segment
    ;
    for(let i = 0; i < pts.length - 1; i++){
        const [ax, az] = pts[i];
        const [bx, bz] = pts[i + 1];
        const seg = Math.hypot(bx - ax, bz - az);
        if (seg < 1e-9) continue;
        // unit perpendicular of this segment (markings-builder convention)
        const nx = -(bz - az) / seg;
        const nz = (bx - ax) / seg;
        while(next <= walked + seg){
            const t = (next - walked) / seg;
            const x = ax + (bx - ax) * t;
            const z = az + (bz - az) * t;
            next += KERB_STEP;
            for(let side = 0; side < 2; side++){
                const s = side === 0 ? 1 : -1;
                const px = x + nx * offset * s;
                const pz = z + nz * offset * s;
                const c = chains[side];
                if (!validKerbPoint(px, pz)) {
                    flushChain(side); // any invalid point terminates the run
                    continue;
                }
                const last = c[c.length - 1];
                if (last) {
                    const span = Math.hypot(px - last.x, pz - last.z);
                    // chord law: the run is only as strong as its weakest point — the
                    // midpoint of a prospective segment must satisfy the same laws
                    const midOk = validKerbPoint((last.x + px) / 2, (last.z + pz) / 2);
                    if (span > KERB_CHAIN_MAX || !midOk) {
                        flushChain(side); // a gap > 5u or an invalid point terminates the run
                    }
                }
                chains[side].push({
                    x: px,
                    z: pz
                });
            }
        }
        walked += seg;
    }
    flushChain(0);
    flushChain(1);
}
const KERB_RUNS_BEFORE_CAP = kerbRuns.length;
const KERB_RUNS = KERB_RUNS_BEFORE_CAP > KERB_CAP ? kerbRuns.slice(0, KERB_CAP) : kerbRuns;
function kerbStats() {
    return {
        runs: KERB_RUNS.length,
        points: kerbPoints,
        roads: {
            ...kerbRoads
        },
        runsBeforeCap: KERB_RUNS_BEFORE_CAP,
        truncated: KERB_RUNS_BEFORE_CAP > KERB_CAP
    };
}
// every MAJOR artery's first/last polyline point, in ROADS array order —
// the exact input set the road renderer's junctionDiscs clusters
const arteryEnds = [];
for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
    if (!r.major) continue;
    arteryEnds.push({
        x: r.pts[0][0],
        z: r.pts[0][1],
        road: r,
        isStart: true
    });
    const last = r.pts[r.pts.length - 1];
    arteryEnds.push({
        x: last[0],
        z: last[1],
        road: r,
        isStart: false
    });
}
const zebras = [];
const zebraClasses = [] // parallel to zebras — source road's cls
;
const endUsed = arteryEnds.map(()=>false);
for(let i = 0; i < arteryEnds.length; i++){
    if (zebras.length >= ZEBRA_CAP) break;
    if (endUsed[i]) continue;
    endUsed[i] = true;
    const first = arteryEnds[i];
    const members = [
        first
    ];
    let cx = first.x;
    let cz = first.z;
    for(let j = i + 1; j < arteryEnds.length; j++){
        if (endUsed[j]) continue;
        if (Math.hypot(first.x - arteryEnds[j].x, first.z - arteryEnds[j].z) < ZEBRA_CLUSTER_R) {
            endUsed[j] = true;
            members.push(arteryEnds[j]);
            cx += arteryEnds[j].x;
            cz += arteryEnds[j].z;
        }
    }
    if (members.length < 2) continue; // a lone endpoint is no junction
    cx /= members.length;
    cz /= members.length;
    // one crossing per artery arm that ENTERS the cluster, in member order
    for (const m of members){
        if (zebras.length >= ZEBRA_CAP) break;
        // arm direction: from the cluster centre toward this arm's endpoint
        let dx = m.x - cx;
        let dz = m.z - cz;
        let len = Math.hypot(dx, dz);
        if (len < 0.25) {
            // degenerate (endpoint sits on the cluster centre) — fall back to the
            // arm's own direction "from the endpoint back along the road"
            const p = m.isStart ? m.road.pts[1] : m.road.pts[m.road.pts.length - 2];
            dx = p[0] - m.x;
            dz = p[1] - m.z;
            len = Math.hypot(dx, dz);
            if (len < 1e-9) continue;
        }
        const dirX = dx / len;
        const dirZ = dz / len;
        const half = renderHalf(m.road.cls);
        const x = cx - dirX * (half + ZEBRA_PULL);
        const z = cz - dirZ * (half + ZEBRA_PULL);
        // THE ZEBRA LAWS — all must hold:
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + ZEBRA_WATER_MIN) continue;
        const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
        if (ri.d <= ri.halfWidth + ZEBRA_RIVER_MIN) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) > ZEBRA_TARMAC_MAX) continue; // must sit ON the mouth
        // dedupe: skip if another zebra already stands within 4u
        let dup = false;
        for (const zb of zebras){
            if (Math.hypot(zb.x - x, zb.z - z) < ZEBRA_DEDUPE) {
                dup = true;
                break;
            }
        }
        if (dup) continue;
        zebras.push({
            x,
            z,
            rotY: Math.atan2(dirX, dirZ),
            half
        });
        zebraClasses.push(m.road.cls);
    }
}
const ZEBRAS = zebras;
function zebraStats() {
    const byClass = {};
    for (const cls of zebraClasses){
        byClass[cls] = (byClass[cls] ?? 0) + 1;
    }
    return {
        count: ZEBRAS.length,
        byClass
    };
}
}),
"[project]/src/game/world3d/props.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANTENNAS",
    ()=>ANTENNAS,
    "AWNINGS",
    ()=>AWNINGS,
    "AWNING_TONES",
    ()=>AWNING_TONES,
    "BARRELS",
    ()=>BARRELS,
    "BASKETS",
    ()=>BASKETS,
    "CLOTH_TONES",
    ()=>CLOTH_TONES,
    "CRATES",
    ()=>CRATES,
    "GATE_LEAVES",
    ()=>GATE_LEAVES,
    "LAUNDRY_LINES",
    ()=>LAUNDRY_LINES,
    "ROAD_SIGNS",
    ()=>ROAD_SIGNS,
    "SHELTERS",
    ()=>SHELTERS,
    "SHOP_NAMES",
    ()=>SHOP_NAMES,
    "SIGNBOARDS",
    ()=>SIGNBOARDS,
    "TIRES",
    ()=>TIRES,
    "UTILITY_POLES",
    ()=>UTILITY_POLES,
    "WALL_SEGMENTS",
    ()=>WALL_SEGMENTS,
    "WATER_TANKS",
    ()=>WATER_TANKS,
    "WIRE_SPANS",
    ()=>WIRE_SPANS
]);
/**
 * LOKOJA LIFE — Derived 3D Props (Stage 4-b)
 * ------------------------------------------
 * Street furniture + compound life, derived DETERMINISTICALLY from the
 * frozen `world3d/layout` data (BUILDINGS / ROADS / STALLS / anchors).
 * Everything here is baked once at import from a fixed-seed RNG — every
 * reload produces the exact same Lokoja, and it can never drift from the
 * map the 2D game uses.
 *
 * SAFETY CONTRACT (visual-only decor):
 *  • adds NO colliders — collision data stays exactly as layout defines it;
 *  • every ground-level placement clears the road centre-lines, river,
 *    building footprints and the interactive spots (DOORS, job boards)
 *    so prompts and walk paths are never visually blocked;
 *  • rooftops props are the only things allowed near buildings (they sit
 *    ON them).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
;
/* ------------------------------ shared helpers ------------------------------ */ /** conservative circle clearance against every building footprint */ function clearOfBuildings(x, z, r) {
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
        if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.62 + r) return false;
    }
    return true;
}
/** same, but tolerates ONE building (its own compound / roof) */ function clearOfOtherBuildings(x, z, r, own) {
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
        if (b.x === own.x && b.z === own.z) continue;
        if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.62 + r) return false;
    }
    return true;
}
/** keep away from doorways + job boards so prompts/approaches stay readable */ function clearOfInteractives(x, z, r) {
    for (const d of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOORS"])if (Math.hypot(d.x - x, d.z - z) < r + 1.7) return false;
    for (const p of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POINTS_OF_INTEREST"])if (Math.hypot(p.x - x, p.z - z) < r + 1.3) return false;
    return true;
}
/** not standing in the river / on its banks */ function clearOfWater(x, z, margin) {
    const { d, halfWidth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
    return d > halfWidth + margin;
}
/** closest point on the MAJOR road graph, plus that segment's unit direction */ function nearestRoadPoint(x, z) {
    let bx = x;
    let bz = z;
    let bd = Infinity;
    let bdx = 0;
    let bdz = 1;
    for (const road of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        if (!road.major) continue;
        for(let i = 0; i < road.pts.length - 1; i++){
            const ax = road.pts[i][0];
            const az = road.pts[i][1];
            const bx2 = road.pts[i + 1][0];
            const bz2 = road.pts[i + 1][1];
            const dx = bx2 - ax;
            const dz = bz2 - az;
            const len2 = dx * dx + dz * dz;
            let t = len2 === 0 ? 0 : ((x - ax) * dx + (z - az) * dz) / len2;
            t = Math.max(0, Math.min(1, t));
            const px = ax + dx * t;
            const pz = az + dz * t;
            const d = Math.hypot(x - px, z - pz);
            if (d < bd) {
                bd = d;
                bx = px;
                bz = pz;
                const len = Math.sqrt(len2) || 1;
                bdx = dx / len;
                bdz = dz / len;
            }
        }
    }
    return {
        px: bx,
        pz: bz,
        d: bd,
        dirX: bdx,
        dirZ: bdz
    };
}
const SHOP_NAMES = [
    'MAMA NGOZI PROVISIONS',
    'BUKA & JOLLOF SPOT',
    'TAILOR & FABRICS',
    'KPAKA PHOTOSTUDIO',
    'SUYA & PEPPER SOUP',
    'BEAUTY PLAZA',
    'PHONE CLINIC',
    'FROZEN FOODS',
    'BARBER SHOP',
    'ADEOLA BOOKSHOP',
    'KEKE & OKADA PARTS',
    'MODERN PATENT MEDICINE',
    'LOKOJA CITY COUNCIL',
    'STUDENT AFFAIRS BLOCK',
    'KOGI TRANSPORT UNION'
];
const AWNING_TONES = [
    '#c94f2e',
    '#2e7d5b',
    '#b03a5b',
    '#3a6ea3',
    '#d99a2b'
];
const CLOTH_TONES = [
    '#c94f2e',
    '#2e7d5b',
    '#e8c14a',
    '#3a6ea3',
    '#d9d2c0',
    '#b03a5b'
];
const AWNINGS = [];
const SIGNBOARDS = [];
const WALL_SEGMENTS = [];
const GATE_LEAVES = [];
const LAUNDRY_LINES = [];
const UTILITY_POLES = [];
const WIRE_SPANS = [];
const ROAD_SIGNS = [];
const SHELTERS = [];
const CRATES = [];
const BASKETS = [];
const TIRES = [];
const BARRELS = [];
const WATER_TANKS = [];
const ANTENNAS = [];
/* ============================================================================
 * DERIVATION (runs once at import — deterministic, seeded, in-order)
 * ========================================================================== */ /* ---- 1. utility poles + wire spans along the real major roads ----
 *
 * W1 — THE NEPA SKYLINE, REBUILT. The old derivation died in the dense
 * fabric: its centreline law (roadDistance < 2.4 from EVERY road) is
 * unsatisfiable beside parallel streets, so the whole grid produced only
 * ~15 poles and 3 wires — measured, not assumed. The rebuilt laws are
 * EDGE-based and give the pole a small lateral search so it steps back
 * when the verge is blocked (real poles do):
 *
 *   SPAN LAW — real NEPA distribution runs keep 35–45 m between poles;
 *   at this world's furniture scale (the 5.5 u pole ≈ 10 m real, i.e.
 *   1 m ≈ 0.55 u) the walk is a 21 u pitch = 38 furniture-m, dead centre.
 *   Wires chain consecutive survivors; a junction gap > 33.6 u drops the
 *   span (the honest break — no wire across a junction mouth).
 *
 *   VERGE LADDER — the pole stands beyond the kerb (0.34) and the W1
 *   U-drain band (0.875–1.425): tarmac | kerb | drain | POLE | trees.
 *   Its roadGap ≥ 0.7 (edge law), dry ground, outside fenced yards,
 *   clear of buildings 0.6, ≥ 9 u from any other pole, ≥ 0.5 from a
 *   lamp pole (no pole-in-pole doubles).
 */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41001);
    let roadIdx = 0;
    for (const road of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        if (!road.major) continue;
        roadIdx++;
        const side = roadIdx % 2 === 0 ? 1 : -1;
        const half = (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][road.cls] ?? 2.2) / 2;
        const chain = [];
        // walk the arc at the exact pitch — spans stay at the span law
        let next = 10 // skip the first 10u (junction mouths cluster at ends)
        ;
        let walked = 0;
        for(let i = 0; i < road.pts.length - 1; i++){
            const ax = road.pts[i][0];
            const az = road.pts[i][1];
            const bx = road.pts[i + 1][0];
            const bz = road.pts[i + 1][1];
            const segLen = Math.hypot(bx - ax, bz - az);
            if (segLen < 1e-9) continue;
            const dirX = (bx - ax) / segLen;
            const dirZ = (bz - az) / segLen;
            while(next <= walked + segLen){
                if (UTILITY_POLES.length >= 150) break;
                const t = (next - walked) / segLen;
                const cx = ax + (bx - ax) * t;
                const cz = az + (bz - az) * t;
                // THE SITING SEARCH — real poles dodge what the verge holds:
                // first the verge line, then step back from the road, then nudge
                // along the street (a junction mouth shifts the pole, it never
                // stands on tarmac). First valid spot wins, deterministically.
                let placed = null;
                for (const nudge of [
                    0,
                    3,
                    -3,
                    6
                ]){
                    const tt = Math.max(0, Math.min(1, t + nudge / segLen));
                    const nx2 = ax + (bx - ax) * tt;
                    const nz2 = az + (bz - az) * tt;
                    for (const back of [
                        0,
                        0.6,
                        1.2,
                        1.8,
                        2.5
                    ]){
                        const off = half + 2.0 + back;
                        const x = nx2 + dirZ * side * off;
                        const z = nz2 - dirX * side * off;
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) < 0) continue;
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + 0.15) continue;
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < 0.7) continue; // edge law — never on any tarmac
                        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
                        if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 12) continue;
                        if (!clearOfBuildings(x, z, 0.6)) continue;
                        if (UTILITY_POLES.some((p)=>Math.hypot(p.x - x, p.z - z) < 9)) continue;
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"].some((l)=>Math.hypot(l.x - x, l.z - z) < 0.5)) continue;
                        placed = {
                            x,
                            z,
                            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
                            rotY: Math.atan2(dirX, dirZ)
                        };
                        break;
                    }
                    if (placed) break;
                }
                if (placed) {
                    UTILITY_POLES.push(placed);
                    chain.push(placed);
                }
                next += 21;
            }
            walked += segLen;
        }
        // the catenary wires between consecutive poles of the same road
        for(let i = 0; i < chain.length - 1; i++){
            const a = chain[i];
            const b = chain[i + 1];
            const len = Math.hypot(b.x - a.x, b.z - a.z);
            if (len > 33.6) continue; // junction gap — no wire (1.6 × the pitch)
            WIRE_SPANS.push({
                ax: a.x,
                ay: a.y + 5.35,
                az: a.z,
                bx: b.x,
                by: b.y + 5.35,
                bz: b.z,
                sag: 0.35 + rng() * 0.4
            });
        }
    }
}/* ---- 2. shopfronts: awnings + signboards on shop-like buildings ---- */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41002);
    let lastSlot = -1;
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
        const isShopFace = b.kind === 'shop' || b.kind === 'shed';
        const isOffice = b.kind === 'block' || b.kind === 'hostel';
        if (!isShopFace && !isOffice) continue;
        const fx = Math.sin(b.rotY);
        const fz = Math.cos(b.rotY);
        const frontX = b.x + fx * (b.d / 2);
        const frontZ = b.z + fz * (b.d / 2);
        // a doorway prop already dresses this face — leave it alone
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOORS"].some((d)=>Math.hypot(d.x - frontX, d.z - frontZ) < 2.1)) continue;
        // signboard slot: offices get their civic plates, shops cycle the names
        let slot;
        if (b.kind === 'block') slot = 12;
        else if (b.kind === 'hostel') slot = 13;
        else if (b.kind === 'shed' && Math.hypot(b.x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['transport-area'].x, b.z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['transport-area'].z) < 17) slot = 14;
        else {
            do {
                slot = Math.floor(rng() * 12);
            }while (slot === lastSlot)
            lastSlot = slot;
        }
        SIGNBOARDS.push({
            x: frontX + fx * 0.1,
            y: isOffice ? b.y + 2.98 : b.y + Math.min(b.h, 3.5) - 0.5,
            z: frontZ + fz * 0.1,
            rotY: b.rotY,
            w: Math.min(Math.max(b.w * 0.62, 2.0), 3.3),
            h: 0.68,
            slot
        });
        if (isShopFace && rng() < 0.9) {
            AWNINGS.push({
                x: b.x + fx * (b.d / 2 + 0.52),
                y: b.y + 2.4,
                z: b.z + fz * (b.d / 2 + 0.52),
                rotY: b.rotY,
                width: Math.min(Math.max(b.w * 0.72, 2.2), 3.8),
                tone: Math.floor(rng() * AWNING_TONES.length)
            });
        }
    }
}/* ---- 3. compound walls around some residential buildings ---- */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41003);
    let compounds = 0;
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
        if (compounds >= 7) break;
        if (b.kind !== 'house' && b.kind !== 'colonial') continue;
        if (rng() > 0.68) continue;
        const halfW = b.w / 2 + 2.3;
        const halfD = b.d / 2 + 2.3;
        const cos = Math.cos(b.rotY);
        const sin = Math.sin(b.rotY);
        const toWorld = (lx, lz)=>[
                b.x + lx * cos + lz * sin,
                b.z - lx * sin + lz * cos
            ];
        // gate side: the edge the door faces, else the edge facing the road
        const doorInside = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOORS"].some((d)=>{
            const wx = d.x - b.x;
            const wz = d.z - b.z;
            const lx = wx * cos - wz * sin;
            const lz = wx * sin + wz * cos;
            return Math.abs(lx) < halfW + 1 && Math.abs(lz) < halfD + 1;
        });
        let gateEdge = 2 // +z (front)
        ;
        if (!doorInside) {
            const road = nearestRoadPoint(b.x, b.z);
            const dx = road.px - b.x;
            const dz = road.pz - b.z;
            const lx = dx * cos - dz * sin;
            const lz = dx * sin + dz * cos;
            gateEdge = Math.abs(lz) >= Math.abs(lx) ? lz > 0 ? 2 : 3 : lx > 0 ? 1 : 0;
        }
        const edges = [
            {
                n: [
                    -1,
                    0
                ],
                dir: 'z',
                along: halfD,
                cross: halfW
            },
            {
                n: [
                    1,
                    0
                ],
                dir: 'z',
                along: halfD,
                cross: halfW
            },
            {
                n: [
                    0,
                    1
                ],
                dir: 'x',
                along: halfW,
                cross: halfD
            },
            {
                n: [
                    0,
                    -1
                ],
                dir: 'x',
                along: halfW,
                cross: halfD
            }
        ];
        let placed = 0;
        edges.forEach((edge, ei)=>{
            const nSeg = Math.max(2, Math.ceil(edge.along * 2 / 2.7));
            const segLen = edge.along * 2 / nSeg;
            for(let s = 0; s < nSeg; s++){
                const along = -edge.along + segLen * (s + 0.5);
                // the gate gap sits mid-edge
                if (ei === gateEdge && Math.abs(along) < 1.35) continue;
                const lx = edge.dir === 'x' ? along : edge.n[0] * edge.cross;
                const lz = edge.dir === 'z' ? along : edge.n[1] * edge.cross;
                const [wx, wz] = toWorld(lx, lz);
                if (!clearOfWater(wx, wz, 3.5)) continue;
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(wx, wz) < 2.9) continue; // leave a gap where the road passes
                if (!clearOfOtherBuildings(wx, wz, 0.5, b)) continue; // never clip a neighbour
                if (!clearOfInteractives(wx, wz, 0.7)) continue; // never wall off a door approach
                if (Math.hypot(wx, wz) > 150) continue;
                const yaw = edge.dir === 'x' ? b.rotY : b.rotY + Math.PI / 2;
                WALL_SEGMENTS.push({
                    x: wx,
                    z: wz,
                    y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(wx, wz),
                    rotY: yaw,
                    len: segLen + 0.12,
                    tone: b.tone
                });
                placed++;
            }
        });
        if (placed >= 6) {
            compounds++;
            // gate leaves, slightly swung open
            const gEdge = edges[gateEdge];
            const gYaw = gEdge.dir === 'x' ? b.rotY : b.rotY + Math.PI / 2;
            for (const sideSign of [
                -1,
                1
            ]){
                const along = sideSign * 1.5;
                const lx = gEdge.dir === 'x' ? along : gEdge.n[0] * gEdge.cross;
                const lz = gEdge.dir === 'z' ? along : gEdge.n[1] * gEdge.cross;
                const [wx, wz] = toWorld(lx, lz);
                GATE_LEAVES.push({
                    x: wx,
                    z: wz,
                    y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(wx, wz),
                    rotY: gYaw + sideSign * 0.55
                });
            }
            // laundry line along the back edge of some compounds
            if (rng() < 0.62) {
                const p1 = toWorld(-halfW + 0.8, -halfD + 0.8);
                const p2 = toWorld(halfW - 0.8, -halfD + 0.8);
                const mx = (p1[0] + p2[0]) / 2;
                const mz = (p1[1] + p2[1]) / 2;
                if (clearOfWater(mx, mz, 3.5) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(mx, mz) > 3.0 && clearOfInteractives(mx, mz, 0.6)) {
                    LAUNDRY_LINES.push({
                        x1: p1[0],
                        z1: p1[1],
                        x2: p2[0],
                        z2: p2[1],
                        y: Math.max((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(p1[0], p1[1]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(p2[0], p2[1])) + 1.78
                    });
                }
            }
        }
    }
}/* ---- 4. rooftop clutter: water tanks + antennas on flat roofs ---- */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41004);
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
        if (b.roof !== 'flat') continue;
        if (b.kind !== 'block' && b.kind !== 'hostel' && b.kind !== 'shop') continue;
        const cos = Math.cos(b.rotY);
        const sin = Math.sin(b.rotY);
        const place = ()=>{
            const lx = (rng() * 2 - 1) * (b.w / 2 - 1.15);
            const lz = (rng() * 2 - 1) * (b.d / 2 - 1.15);
            return [
                b.x + lx * cos + lz * sin,
                b.z - lx * sin + lz * cos
            ];
        };
        if (rng() < 0.62) {
            const [x, z] = place();
            WATER_TANKS.push({
                x,
                y: b.y + b.h,
                z
            });
        }
        if (rng() < 0.45) {
            const [x, z] = place();
            ANTENNAS.push({
                x,
                y: b.y + b.h,
                z,
                h: 1.6 + rng() * 1.6
            });
        }
    }
}/* ---- 5. market life: crates, baskets, barrels around the stalls ---- */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41005);
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"].forEach((s, i)=>{
        const cos = Math.cos(s.rotY);
        const sin = Math.sin(s.rotY);
        const sideOf = (dx, dz)=>[
                s.x + dx * cos + dz * sin,
                s.z - dx * sin + dz * cos
            ];
        if (i % 3 === 0 && rng() < 0.85) {
            const [cx, cz] = sideOf((rng() - 0.5) * 1.2, 1.75);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(cx, cz) > 2.5 && clearOfWater(cx, cz, 2.5) && clearOfBuildings(cx, cz, 0.35) && clearOfInteractives(cx, cz, 0.7)) {
                const gy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(cx, cz);
                const stackH = rng() < 0.4 ? 2 : 1;
                const n = 1 + Math.floor(rng() * 2);
                for(let k = 0; k < n; k++){
                    for(let layer = 0; layer < stackH; layer++){
                        CRATES.push({
                            x: cx + (k - (n - 1) / 2) * 0.62 * cos + (rng() - 0.5) * 0.1,
                            y: gy + 0.19 + layer * 0.37,
                            z: cz - (k - (n - 1) / 2) * 0.62 * sin + (rng() - 0.5) * 0.1,
                            rotY: s.rotY + (rng() - 0.5) * 0.5,
                            s: 0.9 + rng() * 0.25
                        });
                    }
                }
                if (rng() < 0.75) {
                    BASKETS.push({
                        x: cx + 0.9 * sin,
                        y: gy + 0.24,
                        z: cz + 0.9 * cos,
                        s: 0.85 + rng() * 0.4
                    });
                }
                if (rng() < 0.5) {
                    BASKETS.push({
                        x: cx - 0.85 * sin,
                        y: gy + 0.24,
                        z: cz - 0.85 * cos,
                        s: 0.8 + rng() * 0.4
                    });
                }
            }
        }
        if (i % 4 === 1) {
            const [bx, bz] = sideOf(0, -1.9);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(bx, bz) > 2.5 && clearOfWater(bx, bz, 2.5) && clearOfBuildings(bx, bz, 0.3) && clearOfInteractives(bx, bz, 0.7)) {
                BARRELS.push({
                    x: bx,
                    y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(bx, bz) + 0.39,
                    z: bz,
                    tone: Math.floor(rng() * 3)
                });
            }
        }
    });
}/* ---- 5b. extra street-life clusters by the market sheds + food strip ---- */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41008);
    const spots = [];
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
        if (b.kind === 'shed') spots.push({
            x: b.x,
            z: b.z
        });
    }
    spots.forEach((sp, idx)=>{
        const n = 2 + Math.floor(rng() * 2);
        for(let k = 0; k < n; k++){
            const ang = rng() * Math.PI * 2;
            const rad = 5.2 + rng() * 3.4 + idx % 2 * 1.4;
            const x = sp.x + Math.cos(ang) * rad;
            const z = sp.z + Math.sin(ang) * rad;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(x, z) < 2.5) continue;
            if (!clearOfWater(x, z, 2.5) || !clearOfBuildings(x, z, 0.5) || !clearOfInteractives(x, z, 0.8)) continue;
            const gy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
            if (k % 2 === 0) {
                CRATES.push({
                    x,
                    y: gy + 0.19,
                    z,
                    rotY: rng() * Math.PI,
                    s: 0.95 + rng() * 0.2
                });
                if (rng() < 0.6) CRATES.push({
                    x,
                    y: gy + 0.56,
                    z,
                    rotY: rng() * Math.PI,
                    s: 0.9 + rng() * 0.15
                });
            } else {
                BASKETS.push({
                    x,
                    y: gy + 0.24,
                    z,
                    s: 0.9 + rng() * 0.4
                });
                if (rng() < 0.5) BASKETS.push({
                    x: x + 0.8,
                    y: gy + 0.24,
                    z: z + 0.4,
                    s: 0.8 + rng() * 0.3
                });
            }
        }
    });
}/* ---- 6. tire stacks + keke-stop shelters around the motor park / market ---- */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41006);
    // tire stacks by the transport sheds
    const park = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"]['transport-area'];
    for (const ang of [
        0.5,
        2.3,
        4.2
    ]){
        const x = park.x + Math.cos(ang) * 9.2;
        const z = park.z + Math.sin(ang) * 9.2;
        if (!clearOfWater(x, z, 2.5) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(x, z) < 3.2) continue;
        if (!clearOfBuildings(x, z, 0.7) || !clearOfInteractives(x, z, 1.0)) continue;
        const gy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
        const n = 3 + Math.floor(rng() * 2);
        for(let k = 0; k < n; k++)TIRES.push({
            x,
            y: gy + 0.15 + k * 0.27,
            z
        });
    }
    // keke-stop shelters: motor park + Kpata market, set back from the road
    for (const [locId, tone] of [
        [
            'transport-area',
            0
        ],
        [
            'kpata-market',
            1
        ]
    ]){
        const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"][locId];
        const road = nearestRoadPoint(a.x, a.z);
        // try a few roadside spots (sidewalk side × along-road) until one clears
        const variants = [
            [
                4.5,
                3.3
            ],
            [
                -4.5,
                3.3
            ],
            [
                7.5,
                -3.3
            ],
            [
                -7.5,
                -3.3
            ],
            [
                10.5,
                3.3
            ],
            [
                -10.5,
                3.3
            ],
            [
                2.0,
                -3.3
            ],
            [
                -2.0,
                -3.3
            ]
        ];
        for (const [along, side] of variants){
            const x = road.px + road.dirX * along + road.dirZ * side;
            const z = road.pz + road.dirZ * along - road.dirX * side;
            if (!clearOfWater(x, z, 2.5) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(x, z) < 2.7) continue;
            if (!clearOfBuildings(x, z, 1.0) || !clearOfInteractives(x, z, 1.0)) continue;
            SHELTERS.push({
                x,
                z,
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
                rotY: Math.atan2(-road.dirZ * side, road.dirX * side),
                tone
            });
            break;
        }
    }
}/* ---- 7. road signs at the district gateways ---- */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(41007);
    const spots = [
        'ganaja-junction',
        'kpata-market',
        'food-area',
        'university-area',
        'transport-area'
    ];
    spots.forEach((locId, i)=>{
        const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"][locId];
        const road = nearestRoadPoint(a.x, a.z);
        // a little way along the road from the plaza, set on the shoulder
        const variants = [
            [
                6 + rng() * 3,
                2.7
            ],
            [
                -(6 + rng() * 3),
                2.7
            ],
            [
                9 + rng() * 3,
                -2.7
            ],
            [
                -(9 + rng() * 3),
                -2.7
            ]
        ];
        for (const [along, side] of variants){
            const x = road.px + road.dirX * along + road.dirZ * side;
            const z = road.pz + road.dirZ * along - road.dirX * side;
            if (!clearOfWater(x, z, 2.5) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadDistance"])(x, z) < 2.0) continue;
            if (!clearOfBuildings(x, z, 0.5) || !clearOfInteractives(x, z, 0.9)) continue;
            ROAD_SIGNS.push({
                x,
                z,
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
                rotY: Math.atan2(a.x - x, a.z - z),
                kind: i % 3
            });
            return;
        }
    });
}}),
"[project]/src/game/world3d/drains.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DRAIN_CULVERTS",
    ()=>DRAIN_CULVERTS,
    "DRAIN_FALL",
    ()=>DRAIN_FALL,
    "DRAIN_MAX_DIG",
    ()=>DRAIN_MAX_DIG,
    "DRAIN_MIN_COVER",
    ()=>DRAIN_MIN_COVER,
    "DRAIN_PITS",
    ()=>DRAIN_PITS,
    "DRAIN_SEGS",
    ()=>DRAIN_SEGS,
    "drainStats",
    ()=>drainStats
]);
/**
 * LOKOJA LIFE — W1 ROAD SIDES: OPEN U-DRAINS (the corridor law)
 * -------------------------------------------------------------
 * A Nigerian arterial street without open drainage gutters is not real.
 * This module derives the roadside U-drain network from the same real
 * Lokoja road graph the kerbs come from (roads.ts pattern: pure
 * deterministic numbers, NO three.js, NO React, NO DOM).
 *
 * THE CHANNEL: one concrete U-channel per artery side, centre at
 * renderHalf + 1.15, half-width 0.275 (channel band renderHalf+0.875
 * .. +1.425). The band clears the kerb line (+0.34, its outer edge
 * +0.45), clears the lamp shoulders (+0.62), and stays inside the
 * flora street-row floor (+2.2) — the corridor ladder reads:
 *   tarmac | kerb 0.34 | DRAIN 0.875–1.425 | lamp 0.62* | poles 2.0 | trees 2.54+
 *   (* lamp arm reaches ACROSS the carriageway; its pole stands clear)
 *
 * THE 1:100 FALL LAW (the heart of W1): drain water flows by gravity,
 * so along the downstream direction the invert (channel floor) is
 * monotonic non-increasing and EVERY segment falls at least 1:100
 * (drop ≥ 0.01 × segment length). Where the terrain itself falls
 * faster than 1:100 the floor hugs a minimum 0.22 cover below the
 * surface; where the surface is flat the floor digs deeper as real
 * gutters do, until the dig exceeds MAX_DIG (0.55) — there a CATCH PIT
 * resets the invert (a real municipal drain resets at pits/outfalls,
 * it never digs to China). Depth invariant: cover ∈ [0.22, 0.55].
 *
 * THE CROSSING LAWS:
 *  - SLAB COVERS where pedestrians cross: every drain segment within
 *    ZEBRA_COVER_R of a zebra crossing gets a concrete slab cover (the
 *    footpath lands on the gutter — it is covered, not jumped).
 *  - BOX CULVERTS where side roads cross: when a drain candidate is
 *    invalid ONLY because a carriageway crosses the band (all other
 *    laws pass), that break point is a crossing — the drain goes under
 *    the side road through a box culvert with headwalls. Never on its
 *    own artery (the channel runs parallel to it, by construction).
 *
 * THE GEO GATE (repo law): headless bun consumers must import
 * scripts/geo/bootstrap.ts FIRST — this file only ever imports from
 * './layout' and './roads', both gate-safe.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/props.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/roads.ts [app-ssr] (ecmascript)");
;
;
;
/* ------------------------------ tunable laws ------------------------------- */ const DRAIN_STEP = 4 // resample pitch along the artery polyline (kerb-walk law)
;
const DRAIN_OFFSETS = [
    1.15,
    1.75
] // candidate verge offsets — the drain
;
// steps OUTSIDE frontage roads, but never past the W2 contract: the flora
// street rows stand 2.54+ from the edge, so the band stays ≤ 2.075
const DRAIN_HALF_W = 0.275 // channel half-width (0.55 wide band)
;
const DRAIN_GAP_MIN = 0.45 // roadGap floor at the channel centre — the whole
;
// band (centre ±0.325) stays clear of every carriageway edge
const CROSS_GAP_MAX = 0.8 // a carriageway edge within this = a crossing (culvert)
;
const FURNITURE_CLEAR = 0.45 // the channel jogs around lamp/pole posts (real gutters)
;
const DRAIN_WATER_MIN = 0.12 // height margin above the water line
;
const DRAIN_RIVER_MIN = 1.0 // clearance beyond a channel's half width
;
const DRAIN_CHAIN_MAX = 5 // max distance between chained points (kerb law)
;
const DRAIN_CAP = 1800 // sanity cap on emitted channel segments
;
const MIN_COVER = 0.22 // floor never shallower than this under the surface
;
const START_DEPTH = 0.30 // invert depth at the head of every run
;
const MAX_DIG = 0.55 // deeper than this → catch pit resets the invert
;
const FALL = 0.01 // THE 1:100 LAW — gravity drainage, water flows the right way
;
const ZEBRA_COVER_R = 2.6 // a drain segment this close to a zebra gets a slab
;
const CULVERT_DEDUPE = 3.5 // skip a second culvert within this range of one
;
const CULVERT_CAP = 90;
/** the asphalt artery classes that carry open drains (the loud corridors) */ function isDrainRoad(r) {
    return r.cls === 'highway' || r.cls === 'major';
}
function renderHalf(cls) {
    return (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][cls] ?? 2.2) / 2;
}
const segs = [];
const pits = [];
const culverts = [];
let chainCount = 0;
let outfalls = 0;
let worstCover = Infinity;
let worstFall = Infinity;
let arcLen = 0;
/**
 * THE DRAIN POINT LAWS — a candidate channel point is valid only if ALL
 * hold: height above water, outside fenced ground, off bridge spans, not
 * ON any carriageway (gap ≥ 0.12 — the channel dies only on tarmac), not
 * inside a lamp/pole post (the channel jogs around furniture, 0.45 clear
 * — a gutter never swallows a pole), inside the walk bound.
 */ function validDrainPoint(x, z) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + DRAIN_WATER_MIN) return false;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) return false;
    const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
    if (ri.d <= ri.halfWidth + DRAIN_RIVER_MIN) return false;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < DRAIN_GAP_MIN) return false;
    for (const l of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"]){
        if (Math.hypot(l.x - x, l.z - z) < FURNITURE_CLEAR) return false;
    }
    for (const p of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UTILITY_POLES"]){
        if (Math.hypot(p.x - x, p.z - z) < FURNITURE_CLEAR) return false;
    }
    return Math.hypot(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"];
}
/** a crossing point: a carriageway encroaches the band — the drain's
 *  chain breaks there and the gap later grows a box culvert */ function isCrossingPoint(x, z) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + DRAIN_WATER_MIN) return false;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) return false;
    const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
    if (ri.d <= ri.halfWidth + DRAIN_RIVER_MIN) return false;
    if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) return false;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < CROSS_GAP_MAX;
}
/** nearest NON-artery road segment yaw within 3.5u (for the culvert record) */ function nearestSideRoadYaw(x, z, own) {
    let best = 3.5;
    let hit = null;
    for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        if (r === own || isDrainRoad(r)) continue;
        for(let i = 0; i < r.pts.length - 1; i++){
            const ax = r.pts[i][0];
            const az = r.pts[i][1];
            const bx = r.pts[i + 1][0];
            const bz = r.pts[i + 1][1];
            const dx = bx - ax;
            const dz = bz - az;
            const len2 = dx * dx + dz * dz;
            if (len2 < 1e-9) continue;
            let t = ((x - ax) * dx + (z - az) * dz) / len2;
            t = t < 0 ? 0 : t > 1 ? 1 : t;
            const px = ax + dx * t;
            const pz = az + dz * t;
            const d = Math.hypot(px - x, pz - z);
            if (d < best) {
                best = d;
                hit = {
                    yaw: Math.atan2(dx, dz),
                    cls: r.cls
                };
            }
        }
    }
    return hit;
}
/** THE FALL LAW, applied to one chain in flow order — see the header maths */ function layInvert(chain, cls, lastYaw) {
    if (chain.length < 2) return;
    chainCount++;
    // downstream = the end that stands lower; the profile runs that way
    const downstream = chain[chain.length - 1].y < chain[0].y;
    const flow = downstream ? chain : [
        ...chain
    ].reverse();
    // natural outfall: the run's mouth reaches carved water
    const mouth = flow[flow.length - 1];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(mouth.x, mouth.z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + 0.12) outfalls++;
    const n = flow.length;
    const floors = new Array(n);
    floors[0] = flow[0].y - START_DEPTH;
    for(let i = 1; i < n; i++){
        const px = flow[i - 1].x;
        const pz = flow[i - 1].z;
        const qx = flow[i].x;
        const qz = flow[i].z;
        const segLen = Math.hypot(qx - px, qz - pz);
        const want = floors[i - 1] - FALL * segLen // gravity: always ≥ 1:100 down
        ;
        const cap = flow[i].y - MIN_COVER // never shallower than MIN_COVER
        ;
        let f = Math.min(want, cap);
        const dig = flow[i].y - f;
        let isPit = 0;
        if (dig > MAX_DIG) {
            f = flow[i].y - START_DEPTH; // CATCH PIT — the invert resets, depth 0.30
            isPit = 1;
            pits.push({
                x: qx,
                z: qz,
                y: flow[i].y,
                rotY: lastYaw
            });
        }
        floors[i] = f;
        if (!isPit) {
            worstCover = Math.min(worstCover, flow[i].y - f);
            worstFall = Math.min(worstFall, (floors[i - 1] - f) / Math.max(segLen, 1e-9));
        }
        arcLen += segLen;
        segs.push({
            ax: px,
            az: pz,
            ay: flow[i - 1].y,
            bx: qx,
            bz: qz,
            by: flow[i].y,
            fa: floors[i - 1],
            fb: f,
            cls,
            cover: isPit ? 2 : 0,
            pit: isPit
        });
    }
}
/* --------------------- the walk (roads.ts kerb pattern) -------------------- */ const chainsBuf = [];
/**
 * THE SIDE-SELECTION + SIDE-SWITCH LAW (municipal honesty). Where a
 * parallel carriageway (dual way / service road) occupies a verge, the
 * gutter cannot run there — real engineers put it on the buildable side,
 * and when the buildable side dies mid-street the gutter crosses UNDER
 * the road at a junction and continues on the far verge. So: each artery
 * starts on its more viable side (8u pre-scan), walks the arc, and when
 * the running side fails while the far side stands free, the channel
 * switches sides through a road-width culvert. Both sides viable for the
 * whole street → the walk never switches; the street simply drains both
 * verges across its life.
 */ function sideViability(r, side, offset) {
    const s = side === 0 ? 1 : -1;
    let total = 0;
    let ok = 0;
    const pts = r.pts;
    for(let i = 0; i < pts.length - 1; i++){
        const [ax, az] = pts[i];
        const [bx, bz] = pts[i + 1];
        const seg = Math.hypot(bx - ax, bz - az);
        if (seg < 1e-9) continue;
        const nx = -(bz - az) / seg;
        const nz = (bx - ax) / seg;
        for(let d = 0; d <= seg; d += 8){
            const t = d / seg;
            const x = ax + (bx - ax) * t + nx * offset * s;
            const z = az + (bz - az) * t + nz * offset * s;
            total++;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + DRAIN_WATER_MIN) continue;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
            const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
            if (ri.d <= ri.halfWidth + DRAIN_RIVER_MIN) continue;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < DRAIN_GAP_MIN) continue;
            if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) continue;
            ok++;
        }
    }
    return total ? ok / total : 0;
}
/** dedupe + record a culvert */ function putCulvert(x, z, y, rotY, crossCls, span) {
    if (culverts.length >= CULVERT_CAP) return false;
    for (const c of culverts){
        if (Math.hypot(c.x - x, c.z - z) < CULVERT_DEDUPE) return false;
    }
    culverts.push({
        x,
        z,
        y,
        rotY,
        crossCls,
        span,
        covered: 0
    });
    return true;
}
{
    for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        if (!isDrainRoad(r)) continue;
        const half = renderHalf(r.cls);
        const pts = r.pts;
        // THE OFFSET LAW: each side drains at its OWN best offset of the
        // candidates — the gutter runs at the corridor's buildable outer edge,
        // stepping outside minor frontage roads that would bury it in tarmac.
        // A side with no buildable offset simply has no gutter (the mapped
        // fabric owns the verge — the same siting truth the M22 kerbs follow).
        const offsets = [];
        const sides = [];
        for (const side of [
            0,
            1
        ]){
            let bestV = -1;
            let bestOff = -1;
            for (const off of DRAIN_OFFSETS){
                const v = sideViability(r, side, half + off);
                if (v > bestV) {
                    bestV = v;
                    bestOff = off;
                }
            }
            if (bestV > 0.12) {
                sides.push(side);
                offsets.push(half + bestOff);
            }
        }
        for(let si = 0; si < sides.length; si++){
            const side = sides[si];
            const offset = offsets[si];
            const s = side === 0 ? 1 : -1;
            let cur = [];
            let curYaw = 0;
            let next = 0;
            let walked = 0;
            const flush = ()=>{
                if (cur.length) {
                    chainsBuf.push({
                        pts: cur,
                        lastYaw: curYaw,
                        cls: r.cls,
                        side,
                        road: r
                    });
                    cur = [];
                }
            };
            for(let i = 0; i < pts.length - 1; i++){
                const [ax, az] = pts[i];
                const [bx, bz] = pts[i + 1];
                const seg = Math.hypot(bx - ax, bz - az);
                if (seg < 1e-9) continue;
                const nx = -(bz - az) / seg;
                const nz = (bx - ax) / seg;
                const yaw = Math.atan2(bx - ax, bz - az);
                while(next <= walked + seg){
                    const t = (next - walked) / seg;
                    const x = ax + (bx - ax) * t;
                    const z = az + (bz - az) * t;
                    next += DRAIN_STEP;
                    const px = x + nx * offset * s;
                    const pz = z + nz * offset * s;
                    const last = cur[cur.length - 1];
                    if (validDrainPoint(px, pz)) {
                        if (last) {
                            const span = Math.hypot(px - last.x, pz - last.z);
                            const midOk = validDrainPoint((last.x + px) / 2, (last.z + pz) / 2);
                            if (span > DRAIN_CHAIN_MAX || !midOk) flush();
                        }
                        cur.push({
                            x: px,
                            z: pz,
                            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(px, pz)
                        });
                        curYaw = yaw;
                    } else {
                        // THE CHAIN BREAK: a carriageway encroaches the band. The
                        // culvert is derived AFTER the walk from the chain gaps —
                        // a box culvert connects two live channels; a gutter that
                        // dead-ends into nowhere gets none (real engineering).
                        flush();
                    }
                }
                walked += seg;
            }
            flush();
        }
    }
    // lay every chain's invert, then derive culverts from the gaps
    for (const c of chainsBuf)layInvert(c.pts, c.cls, c.lastYaw);
    for(let i = 0; i + 1 < chainsBuf.length; i++){
        const A = chainsBuf[i];
        const B = chainsBuf[i + 1];
        if (A.road !== B.road || A.side !== B.side) continue; // only same-run gaps on the SAME street
        if (A.pts.length < 2 || B.pts.length < 2) continue; // a one-point chain laid no channel — nothing to bridge
        const tail = A.pts[A.pts.length - 1];
        const head = B.pts[0];
        const gap = Math.hypot(head.x - tail.x, head.z - tail.z);
        if (gap < DRAIN_STEP + 0.5 || gap > 11) continue;
        const mx = (tail.x + head.x) / 2;
        const mz = (tail.z + head.z) / 2;
        // a culvert needs a ROAD to pass under — furniture jogs get none
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(mx, mz) > 0.95) continue;
        const yaw = Math.atan2(head.x - tail.x, head.z - tail.z);
        const cross = nearestSideRoadYaw(mx, mz, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"][0]);
        const crossSpan = cross ? (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][cross.cls] ?? 2.2) + 1.4 : 2.4;
        putCulvert(mx, mz, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(mx, mz), yaw, cross?.cls ?? '', crossSpan);
    }
    chainsBuf.length = 0;
}const SEGS_BEFORE_CAP = segs.length;
const DRAIN_SEGS = SEGS_BEFORE_CAP > DRAIN_CAP ? segs.slice(0, DRAIN_CAP) : segs;
const DRAIN_PITS = pits;
const DRAIN_CULVERTS = culverts;
/* ------------------------- slab covers at zebras --------------------------- */ // THE PEDESTRIAN LAW: where a zebra lands on the drain line the gutter is
// covered, never hopped. Two cases: (1) a channel segment within 2.6u of
// the crossing gets a slab; (2) the mouths — exactly where the culverts
// sit — get the deck itself slabbed (real streets: you cross ON the
// culvert). One cover per zebra, never double-slapping a grate.
let zebraCovers = 0;
for (const z of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZEBRAS"]){
    // the drain runs PARALLEL to the zebra's street, ~half+1.15..1.75 to the
    // side — centre-to-centre distance is the wrong metric. Decompose the
    // offset into the zebra's own axes: across = perpendicular to rotY (the
    // lateral hop onto the verge), along = parallel (the mouth arc).
    const ux = Math.sin(z.rotY);
    const uz = Math.cos(z.rotY);
    let served = false;
    for (const s of DRAIN_SEGS){
        if (s.cover !== 0) continue;
        const mx = (s.ax + s.bx) / 2;
        const mz = (s.az + s.bz) / 2;
        const dx = mx - z.x;
        const dz = mz - z.z;
        const along = Math.abs(dx * ux + dz * uz);
        const across = Math.abs(dx * -uz + dz * ux);
        if (across <= z.half + 2.2 && along <= 3.0) {
            s.cover = 1;
            zebraCovers++;
            served = true;
            break;
        }
    }
    if (served) continue;
    // no channel at the mouth — the culvert deck is the cover (real streets:
    // you cross ON the culvert)
    let bestC = 4.0;
    let bestCul = null;
    for (const c of culverts){
        const d = Math.hypot(c.x - z.x, c.z - z.z);
        if (d < bestC) {
            bestC = d;
            bestCul = c;
        }
    }
    if (bestCul && bestCul.covered === 0) {
        bestCul.covered = 1;
        zebraCovers++;
    }
}
function drainStats() {
    return {
        segs: DRAIN_SEGS.length,
        segsBeforeCap: SEGS_BEFORE_CAP,
        truncated: SEGS_BEFORE_CAP > DRAIN_CAP,
        chains: chainCount,
        pits: pits.length,
        culverts: culverts.length,
        covers: DRAIN_SEGS.filter((s)=>s.cover !== 0).length,
        length: arcLen,
        minCover: Number.isFinite(worstCover) ? worstCover : 0,
        minFallRatio: Number.isFinite(worstFall) ? worstFall : 0,
        outfalls,
        zebraCovers
    };
}
const DRAIN_MIN_COVER = MIN_COVER;
const DRAIN_MAX_DIG = MAX_DIG;
const DRAIN_FALL = FALL;
}),
"[project]/src/game/world3d/vehicles.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PARKED_VEHICLES",
    ()=>PARKED_VEHICLES,
    "applyVehicleNight",
    ()=>applyVehicleNight,
    "buildDanfo",
    ()=>buildDanfo,
    "buildKeke",
    ()=>buildKeke,
    "buildLorry",
    ()=>buildLorry,
    "buildOkada",
    ()=>buildOkada,
    "buildPlayerRig",
    ()=>buildPlayerRig,
    "buildSedan",
    ()=>buildSedan,
    "findPlayerVehicleSpot",
    ()=>findPlayerVehicleSpot,
    "headlightConeMaterial",
    ()=>headlightConeMaterial
]);
/**
 * LOKOJA LIFE — Vehicle Shop (Stage 4)
 * ------------------------------------
 * Shared low-poly builders for the town's street fleet: keke napep,
 * okada, danfo, taxi, private sedans + the interstate lorry — plus the
 * deterministic parked-car placement data and the night-light switch.
 *
 * Design rules:
 *  - every family caches its geometries/materials at module level, so
 *    13 moving rigs + the parked cars all reuse the same buffers
 *  - rig origin = ground contact, vehicle faces +Z, three.js units
 *  - Actors.Traffic owns the frame loop: it positions rig.group,
 *    banks rig.bank, spins rig.wheels and steers rig.steer — nothing
 *    in this file allocates or animates per frame
 *  - night lights flip through ONE registry (applyVehicleNight); the
 *    Traffic component calls it when the world clock crosses dusk
 *  - parked placement is seeded (makeRng) and validates clearance
 *    against buildings, stalls, anchor plazas, rivers and bridges
 *  - deterministic everywhere: no Math.random in this module
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
;
;
/* --------------------------- geometry/material caches ------------------------ */ const matCache = new Map();
function mat(color, roughness = 0.6, metalness = 0.12) {
    const key = `${color}|${roughness}|${metalness}`;
    let m = matCache.get(key);
    if (!m) {
        m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color,
            roughness,
            metalness
        });
        matCache.set(key, m);
    }
    return m;
}
const geoCache = new Map();
function geo(key, make) {
    let g = geoCache.get(key);
    if (!g) {
        g = make();
        geoCache.set(key, g);
    }
    return g;
}
/** tiny helper — cached box geometry by dimensions */ function bx(key, w, h, d) {
    return geo(`box|${key}`, ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](w, h, d));
}
const nightRegistry = [];
let nightOn = false;
/** shared emissive material, registered for the day/night flip */ function emis(key, color, emissive, day, night) {
    let m = matCache.get(key);
    if (!m) {
        m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            color,
            emissive,
            emissiveIntensity: day,
            roughness: 0.35,
            metalness: 0.2
        });
        matCache.set(key, m);
        nightRegistry.push({
            m,
            day,
            night
        });
        if (nightOn) m.emissiveIntensity = night;
    }
    return m;
}
function applyVehicleNight(on) {
    nightOn = on;
    for (const n of nightRegistry)n.m.emissiveIntensity = on ? n.night : n.day;
}
/* ---------------------------------- palettes --------------------------------- */ const TIRE = mat('#151515', 1, 0);
const RIM = mat('#c9c7bb', 0.4, 0.65);
const CHROME = mat('#b8bcbf', 0.25, 0.85);
const FRAME = mat('#3d4043', 0.6, 0.5);
const DARK_TRIM = mat('#26261f', 0.8, 0.1);
const GLASS_DARK = mat('#1f2830', 0.18, 0.5);
const GLASS_CLEAR = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
    color: '#28343c',
    roughness: 0.12,
    metalness: 0.55,
    transparent: true,
    opacity: 0.55
});
const KEKE_YELLOW = mat('#e9c53a', 0.5, 0.15);
const KEKE_GREEN = mat('#1c6b3a', 0.55, 0.1);
const CANOPY = mat('#20241e', 0.85, 0.05);
const DANFO_YELLOW = mat('#e5b41f', 0.5, 0.12);
const DANFO_ROOF = mat('#efe8d4', 0.8, 0);
const BLACK_STRIP = mat('#1b1b18', 0.7, 0.1);
const BUMPER = mat('#c2c2ba', 0.45, 0.55);
const SEAT = mat('#31302c', 0.95, 0);
const SKIN_DARK = mat('#5C3A21', 0.9, 0);
const PARK_HEAD = mat('#d8d2c0', 0.4, 0.5);
const PARK_TAIL = mat('#6e1f18', 0.5, 0.2);
const LORRY_CAB = mat('#3a5a7a', 0.55, 0.18) // faded freight blue
;
const LORRY_CANVAS = mat('#6b6350', 0.95, 0) // weathered tarp
;
const SEDAN_COLORS = {
    white: '#e8e6de',
    silver: '#b9bec4',
    darkblue: '#2c3f63',
    maroon: '#6e2a26'
};
const OKADA_TONES = [
    '#b33a2b',
    '#2b62b3',
    '#2e7d5b',
    '#3d4043'
];
const OKADA_SHIRTS = [
    '#c94f2e',
    '#2e7d5b',
    '#d99a2b',
    '#3a6ea3',
    '#e8dcc3'
];
const OKADA_HELMETS = [
    '#d9482b',
    '#f0c020',
    '#2a2a2a'
];
/* ------------------------------- canvas textures ----------------------------- */ let sideTex = null;
/** danfo side livery — original fleet name, black on transparent */ function danfoSideTexture() {
    if (sideTex) return sideTex;
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 96;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, 512, 96);
    ctx.fillStyle = '#191713';
    ctx.font = 'bold 58px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LOKOJA TRANSIT', 256, 40);
    ctx.fillRect(66, 74, 380, 7);
    sideTex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    sideTex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return sideTex;
}
let routeTex = null;
/** danfo route board — the classic "where this bus is going" sign */ function routeBoardTexture() {
    if (routeTex) return routeTex;
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f2efe2';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#1b1b18';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 58);
    ctx.fillStyle = '#1b1b18';
    ctx.font = 'bold 34px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TOWN — FELELE', 128, 34);
    routeTex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    routeTex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return routeTex;
}
let taxiTex = null;
/** taxi roof sign — amber board, black TAXI */ function taxiSignTexture() {
    if (taxiTex) return taxiTex;
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 56;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f0c020';
    ctx.fillRect(0, 0, 128, 56);
    ctx.fillStyle = '#151310';
    ctx.font = 'bold 40px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TAXI', 64, 30);
    taxiTex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    taxiTex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return taxiTex;
}
let coneTex = null;
/** warm light pool that fades forward — one texture, four shared cones */ function headlightConeTexture() {
    if (coneTex) return coneTex;
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 22, 6, 64, 60, 118);
    g.addColorStop(0, 'rgba(255,242,200,0.55)');
    g.addColorStop(0.45, 'rgba(255,236,180,0.22)');
    g.addColorStop(1, 'rgba(255,232,170,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    coneTex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CanvasTexture"](c);
    coneTex.colorSpace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SRGBColorSpace"];
    return coneTex;
}
let coneMat = null;
function headlightConeMaterial() {
    if (!coneMat) {
        coneMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
            map: headlightConeTexture(),
            transparent: true,
            blending: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdditiveBlending"],
            depthWrite: false,
            side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DoubleSide"],
            toneMapped: false
        });
    }
    return coneMat;
}
/* --------------------------------- light discs -------------------------------- */ function headDisc(r, parked) {
    const g = geo(`headDisc|${r}`, ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleGeometry"](r, 10));
    const m = parked ? PARK_HEAD : emis('head', '#fff3cf', '#ffe9a8', 0.45, 3.2);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](g, m);
}
function tailDisc(r, parked) {
    const g = geo(`tailDisc|${r}`, ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircleGeometry"](r, 8));
    const m = parked ? PARK_TAIL : emis('tail', '#ff5340', '#ff2a1a', 0.35, 2.6);
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](g, m);
}
/* ----------------------------------- wheels ----------------------------------- */ /**
 * One wheel = tire torus + rim + hubcap (+ spokes). The returned group
 * sits with its origin at the axle; Traffic spins group.rotation.x.
 */ function buildWheel(r, halfW, spokes = 0) {
    const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    const tube = Math.max(0.05, r * 0.24);
    const tire = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo(`tire|${r.toFixed(2)}`, ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TorusGeometry"](r - tube, tube, 8, 16)), TIRE);
    tire.rotation.y = Math.PI / 2;
    tire.castShadow = true;
    g.add(tire);
    const rim = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo(`rim|${r.toFixed(2)}|${halfW.toFixed(2)}`, ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](r * 0.5, r * 0.5, halfW * 0.7, 10)), RIM);
    rim.rotation.z = Math.PI / 2;
    g.add(rim);
    const cap = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('hubcap', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](r * 0.16, r * 0.16, halfW * 0.92, 8)), CHROME);
    cap.rotation.z = Math.PI / 2;
    g.add(cap);
    if (spokes > 0) {
        const len = (r - tube) * 1.8;
        const spGeo = geo(`spoke|${len.toFixed(2)}`, ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.028, len, 0.045));
        for(let i = 0; i < spokes; i++){
            const sp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](spGeo, RIM);
            sp.rotation.x = i / spokes * Math.PI;
            g.add(sp);
        }
    }
    return g;
}
/* -------------------------------- rig scaffolding ------------------------------ */ function makeRig() {
    const group = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    const bank = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    group.add(bank);
    return {
        rig: {
            group,
            bank,
            wheels: [],
            frontWheels: [],
            steer: null
        },
        bank
    };
}
/** add a mesh to the bank group at a position (optional shadow casting) */ function put(bank, m, x, y, z, shadow = false) {
    m.position.set(x, y, z);
    if (shadow) m.castShadow = true;
    bank.add(m);
    return m;
}
function buildKeke(parked = false) {
    const { rig, bank } = makeRig();
    // floor pan + nose
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('kekeFloor', 1.05, 0.1, 1.9), DARK_TRIM), 0, 0.4, -0.05);
    const nose = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekeNose', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](0.52, 14, 10)), KEKE_YELLOW);
    nose.scale.set(0.95, 0.82, 1.0);
    put(bank, nose, 0, 0.84, 1.0, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('kekeFork', 0.2, 0.55, 0.34), KEKE_YELLOW), 0, 0.62, 1.18);
    // tub + cabin + livery
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('kekeTub', 1.28, 0.62, 1.5), KEKE_YELLOW), 0, 0.78, -0.35, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('kekeStripe', 1.32, 0.14, 1.2), KEKE_GREEN), 0, 0.6, -0.3);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('kekeCab', 1.28, 0.58, 1.5), KEKE_YELLOW), 0, 1.34, -0.35, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('kekeGlass', 1.32, 0.34, 1.26), GLASS_DARK), 0, 1.38, -0.38);
    // windscreen between nose and canopy
    const ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekeWs', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](0.8, 0.52)), GLASS_CLEAR);
    ws.rotation.x = -0.35;
    put(bank, ws, 0, 1.28, 0.66);
    // black canopy dome
    const dome = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekeDome', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](0.8, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2)), CANOPY);
    dome.scale.set(0.85, 0.42, 1.05);
    put(bank, dome, 0, 1.6, -0.3, true);
    // handlebar + driver + passenger bench
    const bar = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekeBar', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.02, 0.02, 0.56, 6)), FRAME);
    bar.rotation.z = Math.PI / 2;
    put(bank, bar, 0, 1.12, 0.8);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekeSeat', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BoxGeometry"](0.4, 0.1, 0.42)), SEAT), 0, 0.92, 0.24);
    const torso = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekeDriver', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](0.13, 0.3, 3, 8)), mat('#2e7d5b', 0.9, 0));
    put(bank, torso, 0, 1.14, 0.3);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekeHead', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](0.11, 8, 8)), SKIN_DARK), 0, 1.4, 0.26);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('kekeBench', 0.9, 0.12, 0.36), mat('#5a2a22', 0.9, 0)), 0, 0.98, -0.72);
    // exhaust hint
    const pipe = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('kekePipe', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.05, 0.05, 0.7, 8)), CHROME);
    pipe.rotation.x = Math.PI / 2;
    put(bank, pipe, 0.38, 0.44, -0.55);
    // lights — headlight on the nose, taillights on the tub
    put(bank, headDisc(0.1, parked), 0, 0.98, 1.53);
    for (const sx of [
        -1,
        1
    ]){
        const tl = tailDisc(0.06, parked);
        tl.rotation.y = Math.PI;
        put(bank, tl, sx * 0.48, 0.95, -1.11);
    }
    // wheels: one steerable front + two rear
    const steer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    steer.position.set(0, 0.32, 1.18);
    bank.add(steer);
    const fw = buildWheel(0.32, 0.12);
    steer.add(fw);
    rig.steer = steer;
    rig.wheels.push(fw);
    for (const sx of [
        -1,
        1
    ]){
        const rw = buildWheel(0.36, 0.14);
        rw.position.set(sx * 0.56, 0.36, -0.78);
        bank.add(rw);
        rig.wheels.push(rw);
    }
    return rig;
}
function buildOkada(toneIdx = 0, parked = false) {
    const { rig, bank } = makeRig();
    const bike = mat(OKADA_TONES[toneIdx % OKADA_TONES.length], 0.45, 0.35);
    const shirt = mat(OKADA_SHIRTS[(toneIdx + 2) % OKADA_SHIRTS.length], 0.9, 0);
    const helmet = mat(OKADA_HELMETS[toneIdx % OKADA_HELMETS.length], 0.35, 0.2);
    // frame spar + tank + seat + rack
    const spar = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('okSpar', 0.1, 0.12, 1.3), FRAME);
    spar.rotation.x = 0.16;
    put(bank, spar, 0, 0.6, 0.05);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('okTank', 0.3, 0.22, 0.5), bike), 0, 0.95, 0.28, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('okSeat', 0.28, 0.1, 0.56), SEAT), 0, 0.92, -0.32);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('okRack', 0.24, 0.05, 0.3), FRAME), 0, 1.0, -0.62);
    const exh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('okExh', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.04, 0.04, 0.6, 8)), CHROME);
    exh.rotation.x = Math.PI / 2;
    put(bank, exh, 0.17, 0.42, -0.4);
    // rider — legs, leaning torso, arms to the bars, helmeted head
    for (const sx of [
        -1,
        1
    ]){
        const leg = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('okLeg', 0.09, 0.42, 0.11), mat('#3a4a5c', 0.9, 0));
        leg.rotation.x = 0.3;
        put(bank, leg, sx * 0.13, 0.68, -0.1);
    }
    const rider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('okRider', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](0.14, 0.32, 3, 8)), shirt);
    rider.rotation.x = 0.5;
    put(bank, rider, 0, 1.16, 0.05, true);
    for (const sx of [
        -1,
        1
    ]){
        const arm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('okArm', 0.07, 0.07, 0.42), shirt);
        arm.rotation.x = 0.85;
        put(bank, arm, sx * 0.14, 1.08, 0.34);
    }
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('okHead', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](0.11, 8, 8)), SKIN_DARK), 0, 1.4, 0.26);
    const helm = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('okHelm', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](0.135, 10, 8)), helmet);
    helm.scale.set(1, 0.92, 1.08);
    put(bank, helm, 0, 1.44, 0.24);
    // taillight on the rack
    const tl = tailDisc(0.05, parked);
    tl.rotation.y = Math.PI;
    put(bank, tl, 0, 0.94, -0.79);
    // wheels — spoked; front fork + bars + headlight live in the steer group
    const rw = buildWheel(0.33, 0.13, 4);
    rw.position.set(0, 0.33, -0.68);
    bank.add(rw);
    rig.wheels.push(rw);
    const steer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
    steer.position.set(0, 0.33, 0.82);
    bank.add(steer);
    const fw = buildWheel(0.33, 0.11, 4);
    steer.add(fw);
    for (const sx of [
        -1,
        1
    ]){
        const fork = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('okFork', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.025, 0.025, 0.55, 6)), FRAME);
        fork.rotation.x = -0.4;
        fork.position.set(sx * 0.07, 0.3, -0.18);
        steer.add(fork);
    }
    const bars = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('okBars', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.02, 0.02, 0.52, 6)), FRAME);
    bars.rotation.z = Math.PI / 2;
    bars.position.set(0, 0.67, -0.22);
    steer.add(bars);
    const hl = headDisc(0.09, parked);
    hl.position.set(0, 0.58, -0.1);
    steer.add(hl);
    rig.steer = steer;
    rig.wheels.push(fw);
    return rig;
}
function buildDanfo(parked = false) {
    const { rig, bank } = makeRig();
    // body + off-white roof cap
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoBody', 1.9, 1.3, 4.2), DANFO_YELLOW), 0, 0.98, 0, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoRoof', 1.94, 0.1, 4.24), DANFO_ROOF), 0, 1.66, 0, true);
    // black horizontal stripe (sides + front)
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoStripe', 1.94, 0.14, 4.0), BLACK_STRIP), 0, 0.6, 0);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoStripeF', 1.92, 0.14, 0.06), BLACK_STRIP), 0, 0.6, 2.11);
    // glazing — windscreen (clear), side windows + rear (dark), pillars stay yellow
    const wsGeo = geo('danfoWs', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](1.66, 0.5));
    const ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](wsGeo, GLASS_CLEAR);
    ws.rotation.x = -0.06;
    put(bank, ws, 0, 1.38, 2.105);
    for (const sx of [
        -1,
        1
    ]){
        for (const [z, w] of [
            [
                0.95,
                1.0
            ],
            [
                -0.5,
                1.0
            ],
            [
                -1.62,
                0.5
            ]
        ]){
            put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx(`danfoWin${z}`, 0.05, 0.44, w), GLASS_DARK), sx * 0.955, 1.36, z);
        }
    }
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoWinR', 1.4, 0.4, 0.05), GLASS_DARK), 0, 1.4, -2.115);
    // baked side text, both flanks, readable each way
    const sideMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        map: danfoSideTexture(),
        transparent: true,
        roughness: 0.55,
        metalness: 0.1
    });
    for (const sx of [
        -1,
        1
    ]){
        const txt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('danfoTxt', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](2.0, 0.38)), sideMat);
        txt.rotation.y = sx * Math.PI / 2;
        put(bank, txt, sx * 0.965, 0.92, 0.15);
    }
    // route board above the windscreen
    const board = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('danfoBoard', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](0.95, 0.24)), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
        map: routeBoardTexture(),
        roughness: 0.6
    }));
    board.rotation.x = -0.12;
    put(bank, board, 0, 1.7, 2.09);
    // grille + bumpers + mirrors
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoGrille', 1.2, 0.3, 0.08), DARK_TRIM), 0, 0.78, 2.13);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoBumpF', 1.94, 0.18, 0.3), BUMPER), 0, 0.5, 2.2, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoBumpR', 1.94, 0.18, 0.3), BUMPER), 0, 0.5, -2.2, true);
    for (const sx of [
        -1,
        1
    ]){
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoMirA', 0.24, 0.04, 0.04), DARK_TRIM), sx * 1.07, 1.44, 1.95);
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoMirH', 0.06, 0.22, 0.14), DARK_TRIM), sx * 1.2, 1.44, 1.95);
    }
    // driver silhouette behind the windscreen
    const drv = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('danfoDrv', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CapsuleGeometry"](0.13, 0.26, 3, 8)), mat('#23423a', 0.9, 0));
    put(bank, drv, -0.5, 1.16, 1.62);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('danfoDrvH', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SphereGeometry"](0.1, 8, 8)), SKIN_DARK), -0.5, 1.42, 1.58);
    // roof rack: two rails + three crossbars
    for (const sx of [
        -1,
        1
    ])put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoRail', 0.05, 0.07, 3.3), FRAME), sx * 0.6, 1.78, -0.05);
    for (const z of [
        -1.3,
        0,
        1.3
    ])put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoCross', 1.5, 0.05, 0.06), FRAME), 0, 1.8, z);
    // rear ladder hint
    for (const sx of [
        -1,
        1
    ])put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoLadV', 0.05, 1.1, 0.05), FRAME), sx * 0.3, 1.15, -2.17);
    for (const y of [
        0.75,
        1.15,
        1.55
    ])put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('danfoLadH', 0.65, 0.04, 0.04), FRAME), 0, y, -2.17);
    // lights
    for (const sx of [
        -1,
        1
    ]){
        put(bank, headDisc(0.12, parked), sx * 0.55, 1.05, 2.115);
        const tl = tailDisc(0.08, parked);
        tl.rotation.y = Math.PI;
        put(bank, tl, sx * 0.78, 1.05, -2.125);
    }
    // wheels — THE FRONT AXLE IS STEERABLE: each front wheel rides in a yaw
    // pivot so the DriveSystem can lay the true Ackermann angles on it
    for (const sx of [
        -1,
        1
    ]){
        const w = buildWheel(0.38, 0.22);
        const pivot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        pivot.position.set(sx * 0.86, 0.38, 1.35);
        w.position.set(0, 0, 0);
        pivot.add(w);
        bank.add(pivot);
        rig.wheels.push(w);
        rig.frontWheels.push(pivot);
    }
    for (const sx of [
        -1,
        1
    ]){
        for (const z of [
            -1.35
        ]){
            const w = buildWheel(0.38, 0.22);
            w.position.set(sx * 0.86, 0.38, z);
            bank.add(w);
            rig.wheels.push(w);
        }
    }
    return rig;
}
function buildSedan(variant, parked = false) {
    const { rig, bank } = makeRig();
    const isTaxi = variant === 'taxi';
    const body = isTaxi ? mat('#d9cf2e', 0.45, 0.2) : mat(SEDAN_COLORS[variant], 0.4, 0.25);
    // lower body + bumpers + grille
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('sedLow', 1.72, 0.52, 3.9), body), 0, 0.56, 0, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('sedBumpF', 1.74, 0.16, 0.24), DARK_TRIM), 0, 0.42, 1.96, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('sedBumpR', 1.74, 0.16, 0.24), DARK_TRIM), 0, 0.42, -1.96, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('sedGrille', 0.9, 0.16, 0.06), DARK_TRIM), 0, 0.66, 1.955);
    // cabin + glass band (pillars show body colour above/below the band)
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('sedCab', 1.56, 0.52, 2.0), body), 0, 1.08, -0.18, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('sedBand', 1.6, 0.3, 1.28), GLASS_DARK), 0, 1.16, -0.35);
    // tilted windscreen + rear glass
    const wsGeo = geo('sedWs', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](1.36, 0.44));
    const ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](wsGeo, isTaxi || parked ? GLASS_CLEAR : GLASS_DARK);
    ws.rotation.x = -0.5;
    put(bank, ws, 0, 1.14, 0.68);
    const rwGeo = geo('sedRw', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](1.3, 0.4));
    const rw = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](rwGeo, GLASS_DARK);
    rw.rotation.x = 0.5;
    put(bank, rw, 0, 1.16, -1.24);
    // taxi livery — green band + amber roof sign (both flanks)
    if (isTaxi) {
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('taxiBand', 1.75, 0.12, 3.94), KEKE_GREEN), 0, 0.66, 0);
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('taxiSign', 0.5, 0.14, 0.2), mat('#f0c020', 0.5, 0.2)), 0, 1.42, -0.1);
        const signMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
            map: taxiSignTexture(),
            roughness: 0.5
        });
        for (const sx of [
            -1,
            1
        ]){
            const p = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('taxiSignP', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](0.44, 0.13)), signMat);
            p.rotation.y = sx * Math.PI / 2;
            put(bank, p, sx * 0.256, 1.42, -0.1);
        }
    }
    // lights
    for (const sx of [
        -1,
        1
    ]){
        put(bank, headDisc(0.1, parked), sx * 0.55, 0.66, 1.965);
        const tl = tailDisc(0.08, parked);
        tl.rotation.y = Math.PI;
        put(bank, tl, sx * 0.55, 0.68, -1.965);
    }
    // wheels — front axle steerable (Ackermann pivots, same as the danfo)
    for (const sx of [
        -1,
        1
    ]){
        const w = buildWheel(0.34, 0.2);
        const pivot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        pivot.position.set(sx * 0.8, 0.34, 1.28);
        w.position.set(0, 0, 0);
        pivot.add(w);
        bank.add(pivot);
        rig.wheels.push(w);
        rig.frontWheels.push(pivot);
    }
    for (const sx of [
        -1,
        1
    ]){
        for (const z of [
            -1.28
        ]){
            const w = buildWheel(0.34, 0.2);
            w.position.set(sx * 0.8, 0.34, z);
            bank.add(w);
            rig.wheels.push(w);
        }
    }
    return rig;
}
function buildLorry(parked = false) {
    const { rig, bank } = makeRig();
    // chassis spine — full length, bridging all three axles
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorChassis', 1.2, 0.24, 5.0), FRAME), 0, 0.52, 0, true);
    // cab — boxy interstate nose with a flat roof cap
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorCab', 1.9, 1.7, 1.5), LORRY_CAB), 0, 1.3, 1.5, true);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorRoof', 1.94, 0.12, 1.54), LORRY_CAB), 0, 2.21, 1.5, true);
    // glazing — tilted windscreen + side windows, pillars stay blue
    const ws = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('lorWs', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaneGeometry"](1.6, 0.6)), GLASS_DARK);
    ws.rotation.x = -0.08;
    put(bank, ws, 0, 1.62, 2.255);
    for (const sx of [
        -1,
        1
    ]){
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorWin', 0.06, 0.5, 0.7), GLASS_DARK), sx * 0.955, 1.6, 1.35);
    }
    // chrome grille + front bumper
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorGrille', 1.1, 0.55, 0.1), CHROME), 0, 0.95, 2.27);
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorBumpF', 2.0, 0.24, 0.32), BUMPER), 0, 0.5, 2.42, true);
    // cargo bed: floor, 4 corner posts, low wooden side slats + tailboard
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorFloor', 1.9, 0.14, 3.3), DARK_TRIM), 0, 0.74, -0.85, true);
    for (const sx of [
        -1,
        1
    ]){
        for (const z of [
            0.78,
            -2.48
        ]){
            put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorPost', 0.1, 0.9, 0.1), FRAME), sx * 0.9, 1.26, z, true);
        }
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorSlat', 0.07, 0.34, 3.1), DARK_TRIM), sx * 0.93, 0.98, -0.85);
    }
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorSlatR', 1.86, 0.34, 0.07), DARK_TRIM), 0, 0.98, -2.5);
    // arched canvas tarp — half cylinder laced between the corner posts
    const tarp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('lorTarp', ()=>{
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.86, 0.86, 3.1, 10, 1, false, Math.PI / 2, Math.PI);
        g.rotateX(Math.PI / 2);
        return g;
    }), LORRY_CANVAS);
    put(bank, tarp, 0, 1.13, -0.85, true);
    // mudguards bridging both rear axles
    for (const sx of [
        -1,
        1
    ]){
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorMud', 0.28, 0.08, 1.9), DARK_TRIM), sx * 0.9, 0.92, -1.5, true);
    }
    // vertical exhaust stack behind the cab
    put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](geo('lorStack', ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.05, 0.05, 1.7, 6)), CHROME), -0.98, 1.55, 0.72);
    // side mirrors
    for (const sx of [
        -1,
        1
    ]){
        put(bank, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Mesh"](bx('lorMir', 0.05, 0.22, 0.14), DARK_TRIM), sx * 1.08, 1.7, 2.02);
    }
    // lights — the same registry the danfo uses, so applyVehicleNight flips them
    for (const sx of [
        -1,
        1
    ]){
        put(bank, headDisc(0.11, parked), sx * 0.72, 1.0, 2.255);
        const tl = tailDisc(0.08, parked);
        tl.rotation.y = Math.PI;
        put(bank, tl, sx * 0.7, 0.98, -2.545);
    }
    // wheels — steerable front axle pair (Ackermann pivots) + twin rear axles (6 total)
    for (const sx of [
        -1,
        1
    ]){
        const w = buildWheel(0.4, 0.24);
        const pivot = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Group"]();
        pivot.position.set(sx * 0.85, 0.4, 1.35);
        w.position.set(0, 0, 0);
        pivot.add(w);
        bank.add(pivot);
        rig.wheels.push(w);
        rig.frontWheels.push(pivot);
    }
    for (const sx of [
        -1,
        1
    ]){
        for (const z of [
            -1.1,
            -1.9
        ]){
            const w = buildWheel(0.42, 0.26);
            w.position.set(sx * 0.85, 0.42, z);
            bank.add(w);
            rig.wheels.push(w);
        }
    }
    return rig;
}
function buildPlayerRig(model) {
    if (model === 'okada') return buildOkada(2) // the green tone — the hero ride
    ;
    if (model === 'keke') return buildKeke();
    if (model === 'danfo') return buildDanfo();
    return buildSedan('taxi');
}
function playerSpotIsClear(x, z) {
    if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 6) return false;
    const river = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
    if (river.d < river.halfWidth + 2.5) return false // never in the water
    ;
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"])if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.5 + 1.6) return false;
    for (const s of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"])if (Math.hypot(s.x - x, s.z - z) < 2.2) return false;
    for (const l of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"])if (Math.hypot(l.x - x, l.z - z) < 1.4) return false;
    for (const p of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POINTS_OF_INTEREST"])if (Math.hypot(p.x - x, p.z - z) < 2.4) return false;
    for (const dr of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DOORS"])if (Math.hypot(dr.x - x, dr.z - z) < 2.6) return false // never block a doorway
    ;
    for (const a of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"])if (Math.hypot(a.x - x, a.z - z) < 3.2) return false // keep plazas' centre open
    ;
    for (const p of PARKED_VEHICLES)if (Math.hypot(p.x - x, p.z - z) < 4.2) return false;
    return true;
}
function findPlayerVehicleSpot(px, pz, fallbackYaw) {
    let bx = 0;
    let bz = 0;
    let byaw = 0;
    let bd = Infinity;
    for (const road of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        for(let i = 0; i < road.pts.length - 1; i++){
            const [ax, az] = road.pts[i];
            const [cx, cz] = road.pts[i + 1];
            const dx = cx - ax;
            const dz = cz - az;
            const len2 = dx * dx + dz * dz || 1e-6;
            let t = ((px - ax) * dx + (pz - az) * dz) / len2;
            t = Math.max(0, Math.min(1, t));
            const qx = ax + dx * t;
            const qz = az + dz * t;
            const d = Math.hypot(px - qx, pz - qz);
            if (d < bd) {
                bd = d;
                bx = qx;
                bz = qz;
                byaw = Math.atan2(dx, dz);
            }
        }
    }
    const candidates = [];
    if (bd < 14) {
        // both shoulders of the nearest road, facing along the traffic flow
        for (const side of [
            1,
            -1
        ]){
            const lat = 2.15 * side;
            candidates.push({
                x: bx + -Math.cos(byaw) * lat,
                z: bz + Math.sin(byaw) * lat,
                rotY: byaw + (side < 0 ? Math.PI : 0)
            });
        }
    }
    // fallback: kerbside right next to whoever called it
    candidates.push({
        x: px + Math.sin(fallbackYaw) * 2.4,
        z: pz + Math.cos(fallbackYaw) * 2.4,
        rotY: fallbackYaw
    });
    for (const c of candidates)if (playerSpotIsClear(c.x, c.z)) return c;
    return candidates[candidates.length - 1];
}
/* ------------------------------ parked vehicles -------------------------------- */ /** arc position along a road polyline (t = fraction of total length) */ function roadPointAt(road, t) {
    const roadPts = road.pts;
    const n = roadPts.length - 1;
    const lens = [];
    let total = 0;
    for(let i = 0; i < n; i++){
        const l = Math.hypot(roadPts[i + 1][0] - roadPts[i][0], roadPts[i + 1][1] - roadPts[i][1]);
        lens.push(l);
        total += l;
    }
    let rem = (t % 1 + 1) % 1 * total;
    for(let i = 0; i < n; i++){
        if (rem <= lens[i]) {
            const k = lens[i] === 0 ? 0 : rem / lens[i];
            const dx = roadPts[i + 1][0] - roadPts[i][0];
            const dz = roadPts[i + 1][1] - roadPts[i][1];
            return {
                x: roadPts[i][0] + dx * k,
                z: roadPts[i][1] + dz * k,
                yaw: Math.atan2(dx, dz)
            };
        }
        rem -= lens[i];
    }
    const last = roadPts[n];
    const prev = roadPts[n - 1];
    return {
        x: last[0],
        z: last[1],
        yaw: Math.atan2(last[0] - prev[0], last[1] - prev[1])
    };
}
const BAY_CLEARANCE_ATTEMPTS = [
    0,
    0.045,
    -0.045,
    0.09,
    -0.09,
    0.15,
    -0.15,
    0.22,
    -0.22
];
const BAY_LATERALS = [
    4.8,
    5.2,
    4.5,
    5.5,
    4.3
];
/**
 * Bays along real major-road edges near the named game districts. Each
 * spec snaps to the nearest MAJOR road point by the district anchor, so
 * parked cars sit on real street shoulders (IBB Way, the market streets,
 * the motor-park road) wherever the graph actually runs.
 */ const BAY_SPECS = [
    {
        anchor: 'kpata-market',
        dx: -16,
        dz: 8,
        side: -1,
        build: 'sedan',
        variant: 'silver'
    },
    {
        anchor: 'ganaja-junction',
        dx: 8,
        dz: -14,
        side: 1,
        build: 'sedan',
        variant: 'taxi'
    },
    {
        anchor: 'home',
        dx: 2,
        dz: 18,
        side: 1,
        build: 'sedan',
        variant: 'white'
    },
    {
        anchor: 'transport-area',
        dx: 16,
        dz: 4,
        side: 1,
        build: 'sedan',
        variant: 'darkblue'
    },
    {
        anchor: 'historic-lokoja',
        dx: -12,
        dz: 6,
        side: -1,
        build: 'keke',
        variant: 'white'
    },
    {
        anchor: 'food-area',
        dx: 14,
        dz: -10,
        side: 1,
        build: 'sedan',
        variant: 'maroon'
    },
    // — heavy + transit variety (Stage 4b, append-only): offsets walked on the
    // real major-road graph; each lands on the first shoulder that clears
    {
        anchor: 'transport-area',
        dx: -48,
        dz: 18,
        side: -1,
        build: 'lorry',
        variant: 'white'
    },
    {
        anchor: 'kpata-market',
        dx: 33,
        dz: -12,
        side: 1,
        build: 'danfo',
        variant: 'white'
    },
    {
        anchor: 'food-area',
        dx: -48,
        dz: 36,
        side: 1,
        build: 'danfo',
        variant: 'white'
    },
    {
        anchor: 'ganaja-junction',
        dx: 16,
        dz: 18,
        side: -1,
        build: 'okada',
        variant: 'white'
    },
    {
        anchor: 'government-area',
        dx: 12,
        dz: -20,
        side: 1,
        build: 'taxi',
        variant: 'taxi'
    },
    {
        anchor: 'sokamms-motel',
        dx: -18,
        dz: -10,
        side: 1,
        build: 'sedan',
        variant: 'maroon'
    }
];
/** nearest point on any MAJOR road to (px,pz) */ function nearestMajorPoint(px, pz) {
    let bd = Infinity;
    let bx = 0;
    let bz = 0;
    let byaw = 0;
    for (const road of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        if (!road.major) continue;
        for(let i = 0; i < road.pts.length - 1; i++){
            const [ax, az] = road.pts[i];
            const [cx, cz] = road.pts[i + 1];
            const dx = cx - ax;
            const dz = cz - az;
            const len2 = dx * dx + dz * dz || 1e-6;
            let t = ((px - ax) * dx + (pz - az) * dz) / len2;
            t = Math.max(0, Math.min(1, t));
            const qx = ax + dx * t;
            const qz = az + dz * t;
            const d = Math.hypot(px - qx, pz - qz);
            if (d < bd) {
                bd = d;
                bx = qx;
                bz = qz;
                byaw = Math.atan2(dx, dz);
            }
        }
    }
    return {
        x: bx,
        z: bz,
        yaw: byaw
    };
}
function bayIsClear(x, z, taken) {
    if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 8) return false;
    for (const a of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"])if (Math.hypot(a.x - x, a.z - z) < 14.5) return false // plazas stay open
    ;
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"])if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.5 + 2.2) return false;
    for (const s of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"])if (Math.hypot(s.x - x, s.z - z) < 2.6) return false;
    for (const l of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"])if (Math.hypot(l.x - x, l.z - z) < 1.3) return false // no lamp through the roof
    ;
    const river = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
    if (river.d < river.halfWidth + 3.5) return false // never in the water
    ;
    for (const br of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BRIDGES"])if (Math.hypot(br.x - x, br.z - z) < br.length / 2 + 3.5) return false;
    for (const p of taken)if (Math.hypot(p.x - x, p.z - z) < 6.5) return false;
    return true;
}
const PARKED_VEHICLES = (()=>{
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(4711);
    const out = [];
    for (const spec of BAY_SPECS){
        const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"][spec.anchor];
        if (!a) continue;
        const ref = nearestMajorPoint(a.x + spec.dx, a.z + spec.dz);
        const dirX = Math.sin(ref.yaw);
        const dirZ = Math.cos(ref.yaw);
        for(let ai = 0; ai < BAY_CLEARANCE_ATTEMPTS.length; ai++){
            const along = BAY_CLEARANCE_ATTEMPTS[ai] * 60;
            const lat = BAY_LATERALS[ai % BAY_LATERALS.length];
            // right of travel = (-cos yaw, sin yaw); side -1 parks on the left shoulder
            const rx = -Math.cos(ref.yaw) * spec.side;
            const rz = Math.sin(ref.yaw) * spec.side;
            const x = ref.x + dirX * along + rx * lat;
            const z = ref.z + dirZ * along + rz * lat;
            if (!bayIsClear(x, z, out)) continue;
            out.push({
                x,
                z,
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
                rotY: ref.yaw + (spec.side < 0 ? Math.PI : 0) + (rng() - 0.5) * 0.12,
                build: spec.build,
                variant: spec.variant
            });
            break;
        }
    // a bay that never finds clearance is silently skipped — one car
    // short is fine, blocking a doorway or the water is not
    }
    return out;
})();
}),
"[project]/src/game/world3d/junctions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BUMP_AMPLITUDE",
    ()=>BUMP_AMPLITUDE,
    "BUMP_HALF_LEN",
    ()=>BUMP_HALF_LEN,
    "DANFO_STOPS",
    ()=>DANFO_STOPS,
    "JUNCTION_CLUSTERS",
    ()=>JUNCTION_CLUSTERS,
    "PHASE_AMBER",
    ()=>PHASE_AMBER,
    "PHASE_CYCLE",
    ()=>PHASE_CYCLE,
    "PHASE_GREEN",
    ()=>PHASE_GREEN,
    "PHASE_RED",
    ()=>PHASE_RED,
    "SPEED_BUMPS",
    ()=>SPEED_BUMPS,
    "TRAFFIC_LIGHTS",
    ()=>TRAFFIC_LIGHTS,
    "bumpHeightAt",
    ()=>bumpHeightAt,
    "bumpProfile",
    ()=>bumpProfile,
    "junctionStats",
    ()=>junctionStats,
    "lightPhaseAt",
    ()=>lightPhaseAt,
    "secondsToPhaseChange",
    ()=>secondsToPhaseChange
]);
/**
 * LOKOJA LIFE — W3: JUNCTION PHYSICS & HARDWARE (pure data + laws)
 * ---------------------------------------------------------------
 * The hardware that makes junctions JUNCTIONS:
 *
 *  - TRAFFIC LIGHTS at the top artery mouths — the junctionDiscs
 *    clustering law (the zebra pattern) finds the mouths; the biggest
 *    ones (major members first) get a signal mast. THE PHASE LAW is a
 *    fixed table — GREEN 12s → AMBER 3s → RED 15s (30s cycle) — pure
 *    function of the running world seconds plus a position-hashed
 *    junction offset, so the city's signals are deterministic and
 *    desynchronised (a real grid never runs one green wave).
 *
 *  - SPEED BUMPS at the school frontages — the real sinusoidal profile
 *    h(u) = A·cos²(π·u/2) for u ∈ [−1, 1] across the carriageway's
 *    throat, painted. bumpHeightAt(x, z) is THE shared truth: the
 *    renderer extrudes it, the DriveSystem lifts the body over it, the
 *    suite verifies continuity — one law, three consumers.
 *
 *  - DANFO STOPS at the existing bays — where the parked danfo fleet
 *    clusters, a shelter + a painted board post. No bay, no stop.
 *
 * Pure TypeScript: layout + vehicles imports only, deterministic by
 * construction (hash/seeding only), headless-suite safe behind the geo
 * gate.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/vehicles.ts [app-ssr] (ecmascript)");
;
;
/* ------------------------------ tunable laws ------------------------------- */ const CLUSTER_R = 5 // endpoint clustering radius (junctionDiscs law)
;
const LIGHT_CAP = 14;
const LIGHT_VERGE = 1.9 // mast setback beyond the carriageway edge
;
const LIGHT_GAP_MIN = 0.5 // roadGap floor at the mast
;
const WATER_MIN = 0.12;
const PHASE_GREEN = 12;
const PHASE_AMBER = 3;
const PHASE_RED = 15;
const PHASE_CYCLE = PHASE_GREEN + PHASE_AMBER + PHASE_RED;
const BUMP_AMPLITUDE = 0.09 // metres of hump — a car-feel bump, not a wall
;
const BUMP_HALF_LEN = 2.6 // half-length along the road (the sinusoid's u ∈ [−1,1])
;
const BUMPS_PER_SCHOOL = 2;
const BUMP_SPACING = 4.4 // between the pair, along the road
;
const BUMP_CAP = 12;
const STOP_MIN_BAYS = 1 // a lone danfo at a bay IS a stop — but clusters win
;
const STOP_CLUSTER_R = 9;
const STOP_CAP = 6;
const STOP_VERGE = 1.8;
const arteryEnds = [];
for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
    if (!r.major) continue;
    arteryEnds.push({
        x: r.pts[0][0],
        z: r.pts[0][1],
        road: r,
        isStart: true
    });
    const last = r.pts[r.pts.length - 1];
    arteryEnds.push({
        x: last[0],
        z: last[1],
        road: r,
        isStart: false
    });
}
const usedEnd = arteryEnds.map(()=>false);
const clusters = [];
for(let i = 0; i < arteryEnds.length; i++){
    if (usedEnd[i]) continue;
    usedEnd[i] = true;
    const first = arteryEnds[i];
    const members = [
        first
    ];
    let cx = first.x;
    let cz = first.z;
    for(let j = i + 1; j < arteryEnds.length; j++){
        if (usedEnd[j]) continue;
        if (Math.hypot(first.x - arteryEnds[j].x, first.z - arteryEnds[j].z) < CLUSTER_R) {
            usedEnd[j] = true;
            members.push(arteryEnds[j]);
            cx += arteryEnds[j].x;
            cz += arteryEnds[j].z;
        }
    }
    if (members.length < 2) continue; // a lone endpoint is no junction
    cx /= members.length;
    cz /= members.length;
    const majors = members.filter((m)=>m.road.cls !== 'secondary').length;
    // the mouth faces along the first major arm — the mast stands on that corner
    const firstMajor = members.find((m)=>m.road.cls !== 'secondary') ?? members[0];
    let dx = firstMajor.x - cx;
    let dz = firstMajor.z - cz;
    const len = Math.hypot(dx, dz);
    const rotY = len > 1e-9 ? Math.atan2(dx / len, dz / len) : 0;
    clusters.push({
        x: cx,
        z: cz,
        y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(cx, cz),
        members: members.length,
        majors,
        rotY
    });
}
const JUNCTION_CLUSTERS = clusters.sort((a, b)=>b.majors - a.majors || b.members - a.members || a.x - b.x || a.z - b.z);
function lightPhaseAt(offset, worldSec) {
    const t = ((worldSec + offset) % PHASE_CYCLE + PHASE_CYCLE) % PHASE_CYCLE;
    if (t < PHASE_GREEN) return 'green';
    if (t < PHASE_GREEN + PHASE_AMBER) return 'amber';
    return 'red';
}
function secondsToPhaseChange(offset, worldSec) {
    const t = ((worldSec + offset) % PHASE_CYCLE + PHASE_CYCLE) % PHASE_CYCLE;
    if (t < PHASE_GREEN) return PHASE_GREEN - t;
    if (t < PHASE_GREEN + PHASE_AMBER) return PHASE_GREEN + PHASE_AMBER - t;
    return PHASE_CYCLE - t;
}
/** deterministic position hash → seconds offset inside the cycle */ function phaseOffsetOf(x, z) {
    const h = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453);
    return (h - Math.floor(h)) * PHASE_CYCLE;
}
const TRAFFIC_LIGHTS = [];
{
    for(let ci = 0; ci < JUNCTION_CLUSTERS.length && TRAFFIC_LIGHTS.length < LIGHT_CAP; ci++){
        const c = JUNCTION_CLUSTERS[ci];
        if (c.majors < 2) continue; // signals live where two real roads meet
        if (c.y <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + WATER_MIN) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(c.x, c.z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(c.x, c.z)) continue;
        const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(c.x, c.z);
        if (ri.d <= ri.halfWidth + 1.2) continue;
        if (Math.hypot(c.x, c.z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) continue;
        // the mast stands on the corner the first major arm opens toward —
        // probe several distances/sides; a real mouth always has one legal corner
        const half = (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"].highway + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"].major) / 4 // blended verge
        ;
        const nx = -Math.cos(c.rotY);
        const nz = Math.sin(c.rotY);
        let placed = null;
        for (const back of [
            1.6,
            2.6,
            3.8,
            5.2
        ]){
            if (placed) break;
            for (const s of [
                1,
                -1
            ]){
                const bx = c.x + Math.sin(c.rotY) * (half + back);
                const bz = c.z + Math.cos(c.rotY) * (half + back);
                for (const out of [
                    LIGHT_VERGE,
                    LIGHT_VERGE + 0.9,
                    LIGHT_VERGE + 1.9
                ]){
                    const x = bx + nx * out * s;
                    const z = bz + nz * out * s;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + WATER_MIN) continue;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < LIGHT_GAP_MIN) continue;
                    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
                    if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) continue;
                    placed = {
                        x,
                        z
                    };
                    break;
                }
                if (placed) break;
            }
        }
        if (!placed) continue;
        TRAFFIC_LIGHTS.push({
            x: placed.x,
            z: placed.z,
            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(placed.x, placed.z),
            rotY: c.rotY,
            offset: phaseOffsetOf(c.x, c.z),
            cluster: ci
        });
    }
}function bumpProfile(u) {
    const a = Math.max(-1, Math.min(1, u));
    if (a <= -1 || a >= 1) return 0 // the exact endpoints — cos(±π/2) is float dust
    ;
    const c = Math.cos(Math.PI * a / 2);
    return BUMP_AMPLITUDE * c * c;
}
function bumpHeightAt(x, z) {
    for (const b of SPEED_BUMPS){
        const dx = x - b.x;
        const dz = z - b.z;
        const along = dx * Math.sin(b.rotY) + dz * Math.cos(b.rotY);
        if (Math.abs(along) > BUMP_HALF_LEN) continue;
        const across = Math.abs(dx * -Math.cos(b.rotY) + dz * Math.sin(b.rotY));
        if (across > b.half) continue;
        return bumpProfile(along / BUMP_HALF_LEN);
    }
    return 0;
}
const SPEED_BUMPS = [];
{
    // the artery sample nearest each school's frontage — bumps guard the gate
    for (const site of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_SITES"]){
        if (SPEED_BUMPS.length >= BUMP_CAP) break;
        // find the nearest point on any major artery within 7u of the site
        let best = 7;
        let hit = null;
        for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
            if (!r.major) continue;
            const half = (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][r.cls] ?? 2.2) / 2;
            for(let i = 0; i < r.pts.length - 1; i++){
                const ax = r.pts[i][0];
                const az = r.pts[i][1];
                const bx = r.pts[i + 1][0];
                const bz = r.pts[i + 1][1];
                const dx = bx - ax;
                const dz = bz - az;
                const l2 = dx * dx + dz * dz;
                if (l2 < 1e-9) continue;
                let t = ((site.x - ax) * dx + (site.z - az) * dz) / l2;
                t = t < 0 ? 0 : t > 1 ? 1 : t;
                const px = ax + dx * t;
                const pz = az + dz * t;
                const d = Math.hypot(px - site.x, pz - site.z);
                if (d < best) {
                    best = d;
                    hit = {
                        x: px,
                        z: pz,
                        yaw: Math.atan2(dx, dz),
                        half,
                        road: r
                    };
                }
            }
        }
        if (!hit) continue;
        const ux = Math.sin(hit.yaw);
        const uz = Math.cos(hit.yaw);
        for(let k = 0; k < BUMPS_PER_SCHOOL; k++){
            const along = (k - (BUMPS_PER_SCHOOL - 1) / 2) * BUMP_SPACING;
            const x = hit.x + ux * along;
            const z = hit.z + uz * along;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + WATER_MIN) continue;
            const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
            if (ri.d <= ri.halfWidth + 1.2) continue; // bridges carry their own deck
            SPEED_BUMPS.push({
                x,
                z,
                y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
                rotY: hit.yaw,
                half: hit.half
            });
        }
    }
}const DANFO_STOPS = [];
{
    // THE BAY LAW — a stop marks a TRANSIT bay: the danfo, taxi, keke and
    // okada bays of the BAY_SPECS fleet (private sedans get no stop). The
    // shelter stands on the shoulder behind the bay, on whichever side is
    // legally off the carriageway.
    const TRANSIT = new Set([
        'danfo',
        'taxi',
        'keke',
        'okada'
    ]);
    const bays = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PARKED_VEHICLES"].filter((v)=>TRANSIT.has(v.build));
    for (const bay of bays){
        if (DANFO_STOPS.length >= STOP_CAP) break;
        // THE SITING SEARCH — the bay shoulders are tight; probe behind and
        // beside the bay until a spot clears every carriageway by 0.6
        let placed = null;
        const ux = Math.sin(bay.rotY);
        const uz = Math.cos(bay.rotY);
        for (const along of [
            0,
            -1.6,
            1.6,
            -3.2,
            3.2
        ]){
            if (placed) break;
            for (const across of [
                -2.6,
                2.6,
                -3.6,
                3.6,
                -4.8,
                4.8,
                -6.2,
                6.2
            ]){
                const x = bay.x + ux * along + -Math.cos(bay.rotY) * across;
                const z = bay.z + uz * along + Math.sin(bay.rotY) * across;
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + WATER_MIN) continue;
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < 0.6) continue;
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
                if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) continue;
                placed = {
                    x,
                    z
                };
                break;
            }
        }
        if (!placed) continue;
        DANFO_STOPS.push({
            x: placed.x,
            z: placed.z,
            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(placed.x, placed.z),
            rotY: bay.rotY,
            bays: 1
        });
    }
}function junctionStats() {
    return {
        clusters: JUNCTION_CLUSTERS.length,
        bigMouths: JUNCTION_CLUSTERS.filter((c)=>c.majors >= 2).length,
        lights: TRAFFIC_LIGHTS.length,
        bumps: SPEED_BUMPS.length,
        stops: DANFO_STOPS.length
    };
}
}),
"[project]/src/game/world3d/flora-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M23 W2: THE GREEN (shared flora contract)
 * ---------------------------------------------------
 * The single contract both swarm builders compile against:
 *  • flora-species.ts — deterministic per-species merged geometry
 *  • flora.ts         — clearance-probe placement over the real geo
 *
 * LAWS OF THIS FILE:
 *  - Pure types + one constant table. No three.js, no DOM, no store.
 *  - SPECIES_META is the PLACEMENT truth (crown radius, mature height,
 *    sway weight, minimum spacing) — both sides read the same numbers so
 *    no species can be placed tighter than its crown or sway allows.
 */ /** The Kogi guild. Ten families, each a real Lokoja presence:
 *  neem/mango street + compound shade, cashew orchards, shea on the
 *  dry plains, oil palm + raffia on the wet margins, plantain in the
 *  compounds, iroko + baobab as landmarks, acacia on the open savanna. */ __turbopack_context__.s([
    "SPECIES_IDS",
    ()=>SPECIES_IDS,
    "SPECIES_META",
    ()=>SPECIES_META
]);
const SPECIES_IDS = [
    'neem',
    'mango',
    'cashew',
    'shea',
    'oilpalm',
    'raffia',
    'plantain',
    'iroko',
    'baobab',
    'acacia'
];
const SPECIES_META = {
    neem: {
        crownR: 2.6,
        height: 6.5,
        swayAmp: 0.55,
        minSpacing: 7.5,
        maxTris: 420
    },
    mango: {
        crownR: 2.9,
        height: 6.0,
        swayAmp: 0.5,
        minSpacing: 8.0,
        maxTris: 460
    },
    cashew: {
        crownR: 3.0,
        height: 4.5,
        swayAmp: 0.6,
        minSpacing: 8.0,
        maxTris: 380
    },
    shea: {
        crownR: 3.1,
        height: 7.0,
        swayAmp: 0.45,
        minSpacing: 9.0,
        maxTris: 420
    },
    oilpalm: {
        crownR: 3.0,
        height: 8.0,
        swayAmp: 0.75,
        minSpacing: 7.5,
        maxTris: 520
    },
    raffia: {
        crownR: 2.6,
        height: 5.5,
        swayAmp: 0.8,
        minSpacing: 6.5,
        maxTris: 480
    },
    plantain: {
        crownR: 1.7,
        height: 2.8,
        swayAmp: 1.0,
        minSpacing: 3.0,
        maxTris: 300
    },
    iroko: {
        crownR: 5.2,
        height: 18.0,
        swayAmp: 0.35,
        minSpacing: 16.0,
        maxTris: 700
    },
    baobab: {
        crownR: 3.4,
        height: 9.0,
        swayAmp: 0.25,
        minSpacing: 20.0,
        maxTris: 620
    },
    acacia: {
        crownR: 3.6,
        height: 7.0,
        swayAmp: 0.4,
        minSpacing: 11.0,
        maxTris: 400
    }
};
}),
"[project]/src/game/world3d/flora.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FLORA_TREES",
    ()=>FLORA_TREES,
    "GRASS_TUFTS",
    ()=>GRASS_TUFTS,
    "floraStats",
    ()=>floraStats,
    "grassStats",
    ()=>grassStats
]);
/**
 * LOKOJA LIFE — M23 W2: THE GREEN (flora placement engine)
 * --------------------------------------------------------
 * Pure deterministic placement data for the Kogi tree guild + the 10k
 * savanna grass scatter. NO three.js, NO React, NO DOM — plain TypeScript
 * numbers so bun can run it headless and the renderer can instance the
 * rows straight from these arrays (geometry lives in flora-species.ts,
 * which this module NEVER imports — placement and geometry are siblings).
 *
 *  - FLORA_TREES: one TreeInstance array per SpeciesId — STREET ROWS of
 *    alternating neem/mango along every asphalt artery, RIVERINE GROVES
 *    of raffia + oil palm on the wet margins, PLANTAIN clusters tucked
 *    behind compound buildings, iroko + baobab LANDMARKS, and the
 *    open-savanna SCATTER (acacia/shea/cashew + spare mango/neem) that
 *    fills the remaining cap. The legacy 'tree'/'palm' keys ship EMPTY
 *    (the generic blobs are superseded; school compounds plant their own
 *    SCHOOL_TREES at render time).
 *  - GRASS_TUFTS: layout.GRASS's moisture-gradient law at 10k tufts,
 *    upgraded to the M22 clearance grade (off the tarmac AND shoulders).
 *
 * THE PLACEMENT LAW (the W2 upgrade): trees are clearance-probed like the
 * M22 parked fleet, never scattered blind. Every candidate must clear the
 * rendered carriageways (roadGap), the kerb lines, the zebra mouths, the
 * lamps, the parked bays, the stalls, every building footprint, the
 * anchor plazas, the street furniture, the school compounds and the
 * water, and honour its species minSpacing against every accepted trunk
 * through ONE 8u cell hash built over the accepted set (grid-reuse
 * spirit — no O(n²) sweep, no new spatial index beyond that one hash).
 * A candidate that fails any law is counted in stats and skipped; nothing
 * is ever forced (landmark shortfalls are recorded honestly).
 *
 * W1 FUTURE-PROOFING: street rows stand 2.2..3.4 beyond the kerb line
 * (roads.ts's kerb sits at renderHalf + 0.34), so the W1 U-drain band
 * that will occupy the kerb-1.2u strip never collides with a trunk.
 *
 * THE GEO GATE (repo law): layout.ts derives its module-scope world from
 * the geo arrays, which the browser fills before the world chunk is ever
 * evaluated. Headless bun consumers must import scripts/geo/bootstrap.ts
 * FIRST (the established CLI pattern for every layout-derived module —
 * see roads.ts). In-app this module is imported from behind the geo gate
 * (the world chunk) exactly like layout/roads; it imports vehicles.ts +
 * props.ts for their parked-bay and street-furniture probe lists only.
 *
 * Determinism: makeRng with fixed seeds only, one draw per decision where
 * practical, single module-scope build cached in consts. Math.random is
 * forbidden by repo law and appears nowhere in this file.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/roads.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/props.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/flora-types.ts [app-ssr] (ecmascript)");
;
;
;
;
;
/* ------------------------------ tunable laws ------------------------------- */ const TAU = Math.PI * 2;
// — street rows —
const STREET_STEP = 4 // resample pitch along the artery polyline (kerb-walk law)
;
const KERB_LINE = 0.34 // kerb offset beyond the rendered edge (roads.ts law)
;
const STREET_SETBACK = 2.2 // min setback beyond the kerb line (W1 drain band)
;
const STREET_SETBACK_JITTER = 1.0 // seeded jitter → setback 2.2..3.2
;
const STREET_SIDE_SPACING = 9 // per-side arc spacing — the rows must READ as
;
// rows: the first draft's 13u starved the showpiece to a tree every other
// streetlight (the home stretch stood bare for 30u — caught by the witness)
const ROW_GAP_MIN = 1.5 // carriageway/tarmac law
;
const ROW_WATER_MIN = 0.35 // height floor above the water line
;
const ROW_RIVER_MIN = 3.0 // clearance beyond a channel's half width
;
// — the shared clearance set (every placement path, ×mult for landmarks) —
const KERB_CLEAR = 2.0 // trunk vs any kerb point
;
const ZEBRA_CLEAR = 4.4;
const LAMP_CLEAR = 1.7;
const BAY_CLEAR = 5.5 // parked-vehicle bays
;
const STALL_CLEAR = 2.6;
const BUILDING_PAD = 2.2 // beyond max(w,d)*0.75
;
const ANCHOR_CLEAR = 9 // anchor plazas keep an open ring — the first draft's
;
// 12u starved every anchor-adjacent street (home stood bare for 30u); the
// buildings/plaza structures themselves stay law-cleared by BUILDINGS
const POLE_CLEAR = 1.6 // utility poles / road signs / shelters
;
const SCHOOL_CLEAR = 2 // beyond a compound's plateauR
;
const BOUND_MARGIN = 2 // inside WALK_BOUND - 2
;
// — scatter / groves / plantain / landmarks —
const TREE_CAP = 720 // hard total-tree cap (law G) — the guild sits at
;
// ~5 tris/tree average, so +60 slots cost ~300 tris and zero draw calls
const SCATTER_GUARD = 26000 // the old scatterTrees guard discipline
;
const TREELINE_Y = 26 // sparse above the Patti slopes' treeline
;
const PATTI_BOOST_R = 110 // denser around the guardian hill (old law)
;
const GROVE_CENTRES = 14 // 14-16 grove centres — the wet-margin show the
;
// guild promises (the first draft's 6 starved to 11 palms: the near-river
// band is eaten by anchor plazas, riverfront roads and marsh)
const GROVE_CENTRE_GUARD = 3000;
const GROVE_RIVER_MIN = 4 // palms in [halfWidth+4, halfWidth+34]
;
const GROVE_RIVER_MAX = 34 // wide enough to hold the ring around a +26 centre
;
const GROVE_WET_SPLIT = 16 // raffia below, oil palm above (d < hw + 16)
;
const GROVE_WATER_MIN = 0.4 // grove height floor (wetter ground than rows)
;
const PLANTAIN_CLUSTERS = 14;
const PLANTAIN_GAP_MIN = 1.2 // behind-building roadGap floor (law E)
;
const PLANTAIN_PAD = 2.3 // beyond the 0.75 envelope (task's 1.8 nominal,
;
//  lifted to hold the suite's +2.15 envelope law with margin — the true
//  wall sits deeper inside the envelope, so the wall gap is larger still)
const PLANTAIN_PAD_JITTER = 1.1 // → stems 2.3..3.4 beyond the envelope
;
const LANDMARK_DRAWS = 4000;
const LANDMARK_GAP_MULT = 2 // landmarks clear EVERYTHING at twice standard
;
const IROKO_TARGET = 3;
const BAOBAB_TARGET = 2;
const IROKO_SLOPE_MAX = 0.12;
const BAOBAB_SLOPE_MAX = 0.15;
const BAOBAB_MOISTURE_MAX = 0.4 // laterite flats, away from the wet margins
;
const CORE_RING_MIN = 60 // landmark preference ring around the city core
;
const CORE_RING_MAX = 110;
// — grass —
const GRASS_TARGET = 10000;
const GRASS_GUARD = 60000;
const GRASS_GAP_MIN = 0.7 // off the tarmac AND its shoulders (W2 upgrade)
;
const GRASS_WATER_MIN = 0.15;
const GRASS_RIVER_MIN = 0.5;
const GRASS_MARGIN = 0.05 // acceptance cushion — no razor-thin tufts
;
// — the one spacing structure: an 8u cell hash over ACCEPTED trunks —
const SPACING_CELL = 8;
const SPACING_Q_R = 3 // ceil(max meta minSpacing 20 / 8) — provably covers
;
//  every trunk within hypot < 20 of a candidate (the largest meta law)
/** flora-species.ts owns the colours; placement only needs the row count
 *  (3 tones per species, which the geometry side mirrors) */ const TONE_ROWS = 3;
/* ------------------------- the building cell hash --------------------------- */ /**
 * BUILDINGS bucketed into 16u cells, registered at the WORST-case reach
 * (0.75 envelope + BUILDING_PAD × 2 — landmarks probe at mult 2), so no
 * probe ever sweeps the whole building array: the grass's 10k candidates
 * each touch ~1 cell of ~2 buildings instead of ~400 hypots. Grid-reuse
 * over the building set — the same law the seg-grid follows for roads.
 */ const BLD_CELL = 16;
const bldCells = new Map();
for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
    const r = Math.max(b.w, b.d) * 0.75 + BUILDING_PAD * 2;
    for(let ix = Math.floor((b.x - r) / BLD_CELL); ix <= Math.floor((b.x + r) / BLD_CELL); ix++){
        for(let iz = Math.floor((b.z - r) / BLD_CELL); iz <= Math.floor((b.z + r) / BLD_CELL); iz++){
            const k = `${ix}:${iz}`;
            const arr = bldCells.get(k);
            if (arr) arr.push(b);
            else bldCells.set(k, [
                b
            ]);
        }
    }
}
/** the one building-envelope probe (pad = the 0.75-envelope margin) */ function nearBuilding(x, z, pad) {
    const arr = bldCells.get(`${Math.floor(x / BLD_CELL)}:${Math.floor(z / BLD_CELL)}`);
    if (!arr) return false;
    for (const b of arr){
        if (Math.hypot(b.x - x, b.z - z) < Math.max(b.w, b.d) * 0.75 + pad) return true;
    }
    return false;
}
/* ------------------------------ probe machinery ---------------------------- */ /** the asphalt artery classes that carry street rows (roads.ts law) */ function isArtery(r) {
    return r.cls === 'highway' || r.cls === 'major' || r.cls === 'secondary';
}
function renderHalf(cls) {
    return (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][cls] ?? 2.2) / 2;
}
/** KERB_RUNS flattened to its chained points (both ends of every segment) */ const KERB_PTS = [];
for (const k of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KERB_RUNS"]){
    KERB_PTS.push([
        k.ax,
        k.az
    ], [
        k.bx,
        k.bz
    ]);
}
/**
 * THE SHARED CLEARANCE PROBE — one law set for every placement path.
 * Returns a reject reason (for the honest stats) or null when the spot is
 * legal. `mult` scales the DISTANCE clearances (landmarks clear everything
 * at twice standard); `gapMin` and `waterMin` let the street rows / groves
 * / plantain tune their own tarmac and water floors.
 *
 * THE KERB/LAMP SCANS ARE UNCONDITIONAL. An earlier draft skipped them via
 * a triangle-inequality proof ("every kerb at roadGap <= 0.34, every lamp
 * at <= 1.62") — M22's own suite numbers disprove both bounds (kerb chain
 * points reach roadGap 0.584; plaza/rim lamps sit beyond 1.62 off-tarmac)
 * and the shortcut leaked a real lamp violation in the W2 smoke. A full
 * scan is ~600k hypots over the whole build — single-digit ms. LAWS OVER
 * PROOFS THAT AREN'T.
 */ function clearOfTown(x, z, mult, gapMin, waterMin) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + waterMin) return 'water';
    if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - BOUND_MARGIN) return 'bound';
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) return 'school';
    for (const sp of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_SITES"]){
        if (Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + SCHOOL_CLEAR * mult) return 'school';
    }
    const g = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z);
    if (g < gapMin) return 'roadgap';
    const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
    if (ri.d < ri.halfWidth + ROW_RIVER_MIN * mult) return 'river';
    for (const st of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"]){
        if (Math.hypot(st.x - x, st.z - z) < STALL_CLEAR * mult) return 'stall';
    }
    for (const p of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UTILITY_POLES"]){
        if (Math.hypot(p.x - x, p.z - z) < POLE_CLEAR * mult) return 'pole';
    }
    for (const sg of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_SIGNS"]){
        if (Math.hypot(sg.x - x, sg.z - z) < POLE_CLEAR * mult) return 'pole';
    }
    for (const sh of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$props$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SHELTERS"]){
        if (Math.hypot(sh.x - x, sh.z - z) < POLE_CLEAR * mult) return 'pole';
    }
    for (const zb of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$roads$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ZEBRAS"]){
        if (Math.hypot(zb.x - x, zb.z - z) < ZEBRA_CLEAR * mult) return 'zebra';
    }
    for (const a of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"]){
        if (Math.hypot(a.x - x, a.z - z) < ANCHOR_CLEAR * mult) return 'anchor';
    }
    for (const b of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"]){
        if (nearBuilding(x, z, BUILDING_PAD * mult)) return 'building';
    }
    for (const k of KERB_PTS){
        if (Math.hypot(k[0] - x, k[1] - z) < KERB_CLEAR * mult) return 'kerb';
    }
    for (const lp of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LAMPS"]){
        if (Math.hypot(lp.x - x, lp.z - z) < LAMP_CLEAR * mult) return 'lamp';
    }
    for (const pv of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PARKED_VEHICLES"]){
        if (Math.hypot(pv.x - x, pv.z - z) < BAY_CLEAR * mult) return 'bay';
    }
    return null;
}
const trunkCells = new Map();
/**
 * Pairwise minSpacing law — candidate vs every accepted trunk, answered by
 * the ONE cell hash built over the accepted set (grid-reuse over a new
 * index: no O(n²) sweep ever runs). The law honours BOTH sides: a spot is
 * illegal if it crowds a neighbour closer than either species allows.
 */ function spacingOk(x, z, minSpacing) {
    const cx = Math.floor(x / SPACING_CELL);
    const cz = Math.floor(z / SPACING_CELL);
    for(let ix = cx - SPACING_Q_R; ix <= cx + SPACING_Q_R; ix++){
        for(let iz = cz - SPACING_Q_R; iz <= cz + SPACING_Q_R; iz++){
            const arr = trunkCells.get(`${ix}:${iz}`);
            if (!arr) continue;
            for (const p of arr){
                if (Math.hypot(p.x - x, p.z - z) < Math.max(minSpacing, p.m)) return false;
            }
        }
    }
    return true;
}
/** register an accepted trunk in the cell hash (plant() + landmark picks) */ function registerTrunk(x, z, m) {
    const key = `${Math.floor(x / SPACING_CELL)}:${Math.floor(z / SPACING_CELL)}`;
    const arr = trunkCells.get(key);
    const trunk = {
        x,
        z,
        m
    };
    if (arr) arr.push(trunk);
    else trunkCells.set(key, [
        trunk
    ]);
}
/* --------------------------------- the build -------------------------------- */ const FLORA_T0 = performance.now();
const flora = {
    neem: [],
    mango: [],
    cashew: [],
    shea: [],
    oilpalm: [],
    raffia: [],
    plantain: [],
    iroko: [],
    baobab: [],
    acacia: [],
    // LEGACY KEYS (law F) — honest empties: the generic 'tree'/'palm' blobs
    // are superseded by the species-true guild above; the school compounds
    // keep planting their own trees at render time (SCHOOL_TREES mapping).
    tree: [],
    palm: []
};
const rejected = {};
function rej(k) {
    rejected[k] = (rejected[k] ?? 0) + 1;
}
function treeTotal() {
    let n = 0;
    for (const sp of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_IDS"])n += flora[sp].length;
    return n;
}
/**
 * Accept a tree: push into its species row + register the trunk in the cell
 * hash. The per-instance yaw + tone jitter are drawn HERE, inside the one
 * acceptance point, so every accepted tree carries exactly two seeded draws
 * (rot then tone) and rejects never consume them.
 */ function plant(sp, x, z, s) {
    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_META"][sp];
    const rng = plantRng;
    const t = {
        x,
        z,
        y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z),
        s,
        rot: rng() * TAU,
        tone: Math.floor(rng() * TONE_ROWS)
    };
    flora[sp].push(t);
    registerTrunk(x, z, meta.minSpacing);
    return t;
}
/** the shared acceptance RNG — rot + tone jitter at the moment of planting */ const plantRng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(3307);
/* --------------------------- A) the street rows ----------------------------- */ /* Walk every asphalt artery, resample every 5u like the kerb walk, and plant
 * alternating neem/mango on each side at setback = renderHalf + kerb line +
 * 2.2..3.4 — beyond the future W1 U-drain band. Per-side arc spacing 13u.
 * Every candidate runs the shared clearance probe + the cell-hash spacing. */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(4102);
    for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
        if (!isArtery(r)) continue;
        const half = renderHalf(r.cls);
        // seeded alternation: one draw per road, the sides start on opposite species
        const sideIsNeem = [
            rng() < 0.5,
            false
        ];
        sideIsNeem[1] = !sideIsNeem[0];
        const lastArc = [
            -Infinity,
            -Infinity
        ];
        const pts = r.pts;
        let next = 0 // arc position of the next resample
        ;
        let walked = 0 // arc position at the start of the current segment
        ;
        for(let i = 0; i < pts.length - 1; i++){
            const [ax, az] = pts[i];
            const [bx, bz] = pts[i + 1];
            const seg = Math.hypot(bx - ax, bz - az);
            if (seg < 1e-9) continue;
            const nx = -(bz - az) / seg // unit perpendicular (markings-builder law)
            ;
            const nz = (bx - ax) / seg;
            while(next <= walked + seg){
                const arc = next;
                const t = (next - walked) / seg;
                const x = ax + (bx - ax) * t;
                const z = az + (bz - az) * t;
                next += STREET_STEP;
                for(let side = 0; side < 2; side++){
                    if (arc - lastArc[side] < STREET_SIDE_SPACING) continue;
                    const s = side === 0 ? 1 : -1;
                    // THE FALLBACK-SETBACK LAW — Lokoja's real streetscape: where the
                    // fabric is dense (side streets swallow the first band — the home
                    // stretch's candidates died with NEGATIVE roadGap there), the row
                    // steps OUT into the compound margins instead of giving up. Three
                    // bands, first legal wins; every band runs the SAME full probe.
                    let planted = false;
                    for(let band = 0; band < 3 && !planted; band++){
                        const setback = STREET_SETBACK + band * 1.6 + rng() * STREET_SETBACK_JITTER;
                        const off = half + KERB_LINE + setback;
                        const px = x + nx * off * s;
                        const pz = z + nz * off * s;
                        const why = clearOfTown(px, pz, 1, ROW_GAP_MIN, ROW_WATER_MIN);
                        if (why) {
                            rej(why);
                            continue;
                        }
                        const sp = sideIsNeem[side] ? 'neem' : 'mango';
                        if (!spacingOk(px, pz, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_META"][sp].minSpacing)) {
                            rej('spacing');
                            continue;
                        }
                        plant(sp, px, pz, 0.85 + rng() * 0.55);
                        sideIsNeem[side] = !sideIsNeem[side]; // alternate down the side
                        lastArc[side] = arc;
                        planted = true;
                    }
                }
            }
            walked += seg;
        }
    }
}/* -------------------------- D) the riverine groves -------------------------- */ /* 6-8 seeded grove centres inside the river margin band, each ring-scattering
 * 5-9 palms. Raffia holds the wet end (d < halfWidth + 16), oil palm the
 * drier end. Every palm runs the shared probe + the band + spacing laws. */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(7702);
    const centreTarget = GROVE_CENTRES + Math.floor(rng() * 3) // 6-8
    ;
    let centres = 0;
    let attempts = 0;
    while(centres < centreTarget && attempts < GROVE_CENTRE_GUARD){
        attempts++;
        const x = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 6);
        const z = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 6);
        const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
        if (ri.d < ri.halfWidth + 5 || ri.d > ri.halfWidth + 26) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + GROVE_WATER_MIN) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(x, z)) continue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) < ROW_GAP_MIN) continue;
        centres++;
        const n = 6 + Math.floor(rng() * 6) // 6-11 palms per grove
        ;
        for(let i = 0; i < n; i++){
            const ang = rng() * TAU;
            const rad = 2.5 + rng() * 6.5;
            const px = x + Math.cos(ang) * rad;
            const pz = z + Math.sin(ang) * rad;
            const pri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(px, pz);
            if (pri.d < pri.halfWidth + GROVE_RIVER_MIN || pri.d > pri.halfWidth + GROVE_RIVER_MAX) {
                rej('groveband');
                continue;
            }
            const wet = pri.d < pri.halfWidth + GROVE_WET_SPLIT;
            const sp = rng() < 0.65 ? wet ? 'raffia' : 'oilpalm' : wet ? 'oilpalm' : 'raffia';
            const why = clearOfTown(px, pz, 1, ROW_GAP_MIN, GROVE_WATER_MIN);
            if (why) {
                rej(why);
                continue;
            }
            if (!spacingOk(px, pz, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_META"][sp].minSpacing)) {
                rej('spacing');
                continue;
            }
            plant(sp, px, pz, 0.9 + rng() * 0.5);
        }
    }
}/* -------------------------- E) the compound plantain ------------------------ */ /* 14 seeded clusters of 3-5 stems tucked behind BUILDINGS rows, on the side
 * AWAY from the nearest road (the back heading wins the roadGap duel). The
 * 0.75 envelope stands in for the wall edge; stems stand PLANTAIN_PAD..
 * +JITTER beyond it, so the suite's envelope law holds with margin and the
 * true wall gap is larger still. Stems run the shared probe at the relaxed
 * behind-building roadGap floor. */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(1408);
    // seeded Fisher-Yates over the building indices — one draw per swap
    const order = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].map((_, i)=>i);
    for(let i = order.length - 1; i > 0; i--){
        const j = Math.floor(rng() * (i + 1));
        const tmp = order[i];
        order[i] = order[j];
        order[j] = tmp;
    }
    let clusters = 0;
    for (const bi of order){
        if (clusters >= PLANTAIN_CLUSTERS) break;
        const b = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"][bi];
        const env = Math.max(b.w, b.d) * 0.75;
        const baseAng = rng() * TAU;
        const probeR = env + 3;
        // THE AWAY-SIDE LAW: the cluster heading is the one whose sample point
        // stands in the BIGGER roadGap (the road side loses the duel)
        const fx = Math.cos(baseAng);
        const fz = Math.sin(baseAng);
        const g1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(b.x + fx * probeR, b.z + fz * probeR);
        const g2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(b.x - fx * probeR, b.z - fz * probeR);
        const dir = g1 > g2 ? 0 : Math.PI;
        const back = baseAng + dir;
        const k = 3 + Math.floor(rng() * 3) // 3-5 stems attempted
        ;
        const stems = [];
        for(let i = 0; i < k; i++){
            const ang = back + (i - (k - 1) / 2) * 0.62 + (rng() - 0.5) * 0.16;
            const dist = env + PLANTAIN_PAD + rng() * PLANTAIN_PAD_JITTER;
            const px = b.x + Math.cos(ang) * dist;
            const pz = b.z + Math.sin(ang) * dist;
            const why = clearOfTown(px, pz, 1, PLANTAIN_GAP_MIN, ROW_WATER_MIN);
            if (why) {
                rej(why);
                continue;
            }
            if (!spacingOk(px, pz, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_META"].plantain.minSpacing)) {
                rej('spacing');
                continue;
            }
            // stem-to-stem law inside the not-yet-committed cluster
            let close = false;
            for (const st of stems){
                if (Math.hypot(st.x - px, st.z - pz) < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_META"].plantain.minSpacing) close = true;
            }
            if (close) {
                rej('spacing');
                continue;
            }
            stems.push({
                x: px,
                z: pz,
                s: 0.8 + rng() * 0.5
            });
        }
        if (stems.length < 3) {
            rej('plantainCluster'); // a host that cannot take 3 stems is skipped whole
            continue;
        }
        for (const st of stems)plant('plantain', st.x, st.z, st.s);
        clusters++;
    }
}/* ------------------------------- C) landmarks ------------------------------- */ /* Iroko + baobab giants: seeded candidate sweep, scored open flat spots that
 * clear EVERYTHING at twice standard, preferring the 60-110u ring around the
 * built-up city core. Top candidates win; shortfalls are recorded honestly. */ // the built-up core: the named non-school, non-landmark anchors, averaged
const CORE = (()=>{
    const ids = [
        'kpata-market',
        'food-area',
        'ganaja-junction',
        'government-area',
        'transport-area',
        'historic-lokoja',
        'home',
        'university-area'
    ];
    let cx = 0;
    let cz = 0;
    let n = 0;
    for (const id of ids){
        const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_BY_ID"][id];
        if (!a) continue;
        cx += a.x;
        cz += a.z;
        n++;
    }
    return {
        x: cx / n,
        z: cz / n,
        n
    };
})();
function pickLandmarks(sp, target, seed) {
    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_META"][sp];
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(seed);
    const slopeMax = sp === 'iroko' ? IROKO_SLOPE_MAX : BAOBAB_SLOPE_MAX;
    const cands = [];
    for(let i = 0; i < LANDMARK_DRAWS; i++){
        const x = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 6);
        const z = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 6);
        const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
        if (y > TREELINE_Y) continue;
        const slope = (Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x + 2, z) - y) + Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z + 2) - y)) / 4;
        if (slope >= slopeMax) continue;
        if (sp === 'baobab' && Math.max(0, 1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z).d / 60) >= BAOBAB_MOISTURE_MAX) continue;
        const why = clearOfTown(x, z, LANDMARK_GAP_MULT, ROW_GAP_MIN * LANDMARK_GAP_MULT, ROW_WATER_MIN);
        if (why) continue;
        if (!spacingOk(x, z, meta.minSpacing * LANDMARK_GAP_MULT)) continue;
        const dc = Math.hypot(x - CORE.x, z - CORE.z);
        const bandDist = dc < CORE_RING_MIN ? CORE_RING_MIN - dc : dc > CORE_RING_MAX ? dc - CORE_RING_MAX : 0;
        const score = (1 - slope / slopeMax) * 2 - bandDist * 0.03 + rng() * 0.05;
        const s = sp === 'iroko' ? 1.15 + rng() * 0.35 : 1.3 + rng() * 0.5;
        cands.push({
            x,
            z,
            y,
            s,
            score
        });
    }
    cands.sort((a, b)=>b.score - a.score); // stable sort — deterministic top-3/2
    let placed = 0;
    for (const c of cands){
        if (placed >= target) break;
        // re-check spacing against the giants committed within this same pick
        if (!spacingOk(c.x, c.z, meta.minSpacing * LANDMARK_GAP_MULT)) {
            rej('spacing');
            continue;
        }
        plant(sp, c.x, c.z, c.s);
        placed++;
    }
    if (placed < target) rejected[`${sp}Shortfall`] = target - placed;
    return placed;
}
pickLandmarks('iroko', IROKO_TARGET, 9182);
pickLandmarks('baobab', BAOBAB_TARGET, 9183);
/* ------------------------------ B) savanna scatter -------------------------- */ /* The old scatterTrees law (moisture guild + slope + Patti boost) rebuilt on
 * the species guild: dry open ground → acacia-biased, mid moisture → shea/
 * cashew, moist ground → mango/neem. Full shared clearance set + cell-hash
 * spacing, filling the remaining cap. Every reject is counted. */ {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(61217);
    const guardMax = SCATTER_GUARD;
    let guard = 0;
    while(treeTotal() < TREE_CAP && guard < guardMax){
        guard++;
        const x = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 4);
        const z = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 4);
        const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
        if (y > TREELINE_Y) {
            rej('treeline');
            continue;
        }
        const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
        const moisture = Math.max(0, 1 - ri.d / 60);
        const slope = (Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x + 2, z) - y) + Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z + 2) - y)) / 4;
        // THE GUILD — the real Guinea-savanna mix around Lokoja
        let sp;
        if (moisture > 0.6) {
            sp = rng() < 0.5 ? 'mango' : 'neem'; // moist ground
        } else if (moisture < 0.42 && slope < 0.3) {
            const g = rng() // dry open savanna — acacia-biased, spare mango/neem
            ;
            sp = g < 0.42 ? 'acacia' : g < 0.7 ? 'shea' : g < 0.92 ? 'cashew' : rng() < 0.5 ? 'mango' : 'neem';
        } else {
            const g = rng() // mid moisture — shea/cashew country
            ;
            sp = g < 0.45 ? 'shea' : g < 0.8 ? 'cashew' : 'mango';
        }
        // denser around Patti + riversides, thinner downtown (old law)
        const pattiBoost = Math.max(0, 1 - Math.hypot(x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOUNT_PATTI"].x, z - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOUNT_PATTI"].z) / PATTI_BOOST_R);
        if (rng() > 0.34 + pattiBoost * 0.5) {
            rej('thin');
            continue;
        }
        const why = clearOfTown(x, z, 1, ROW_GAP_MIN, ROW_WATER_MIN);
        if (why) {
            rej(why);
            continue;
        }
        if (!spacingOk(x, z, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_META"][sp].minSpacing)) {
            rej('spacing');
            continue;
        }
        plant(sp, x, z, 0.75 + rng() * 0.8);
    }
    if (treeTotal() >= TREE_CAP) rej('treeCap'); // the cap fired mid-scatter
    if (treeTotal() < TREE_CAP && guard >= guardMax) rej('scatterGuard');
}/* --------------------------- the exported tree map -------------------------- */ const FLORA_BUILD_MS = Math.round((performance.now() - FLORA_T0) * 100) / 100;
const FLORA_TREES = flora;
let floraStatsCache = null;
function floraStats() {
    if (floraStatsCache) return floraStatsCache;
    const perSpecies = {};
    let total = 0;
    for (const sp of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$flora$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SPECIES_IDS"]){
        perSpecies[sp] = flora[sp].length;
        total += perSpecies[sp];
    }
    floraStatsCache = {
        perSpecies,
        total,
        rejected: {
            ...rejected
        },
        ms: FLORA_BUILD_MS
    };
    return floraStatsCache;
}
/* --------------------------------- GRASS_TUFTS ------------------------------ */ /* layout.GRASS's moisture-gradient law at 10k tufts, upgraded to the M22
 * clearance grade: heightAt > WATER_Y + 0.15, roadGap > 0.7 (the old law
 * only kept roadDistance < 3.4 — this one keeps the shoulders bare too),
 * inside WALK_BOUND - 2, never in the river, tone from the moisture law,
 * s = 0.7..1.25 seeded. Slope/treeline/anchor/school/building exclusions
 * mirror the old scatter so tufts never float or poke through floors. */ const GRASS_T0 = performance.now();
function buildGrass() {
    const rng = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeRng"])(51710);
    const out = [];
    const rej = {};
    const bump = (k)=>{
        rej[k] = (rej[k] ?? 0) + 1;
    };
    let guard = 0;
    while(out.length < GRASS_TARGET && guard < GRASS_GUARD){
        guard++;
        const x = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 2);
        const z = (rng() * 2 - 1) * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 2);
        const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z);
        const slope = (Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x + 2, z) - y) + Math.abs((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(x, z + 2) - y)) / 4;
        if (slope > 0.45) {
            bump('slope'); // steep ground sheds the mesh's faceting — tufts would float
            continue;
        }
        // THE SINK LAW — the water rule judges the tuft's FINAL y. Tufts sink
        // 0.35*slope + 0.1 below the sampled ground so the base hides under the
        // mesh; the first draft checked the RAW sample and shore tufts sank
        // under the water line (caught by the W2 smoke, margin −0.242).
        const ySunk = y - 0.35 * slope - 0.1;
        if (ySunk <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + GRASS_WATER_MIN + GRASS_MARGIN) {
            bump('water');
            continue;
        }
        if (y > 28) {
            bump('treeline'); // the rocky Patti crown stays bare
            continue;
        }
        const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(x, z);
        if (ri.d <= ri.halfWidth + GRASS_RIVER_MIN + GRASS_MARGIN) {
            bump('river');
            continue;
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(x, z) <= GRASS_GAP_MIN + GRASS_MARGIN) {
            bump('roadgap');
            continue;
        }
        if (Math.hypot(x, z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"] - 2 - GRASS_MARGIN) {
            bump('bound');
            continue;
        }
        let blocked = false;
        for (const a of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHORS"]){
            if (Math.hypot(a.x - x, a.z - z) < 12.5) {
                bump('anchor');
                blocked = true;
                break;
            }
        }
        if (blocked) continue;
        for (const sp of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_SITES"]){
            if (Math.hypot(sp.x - x, sp.z - z) < sp.plateauR + 1.5) {
                bump('school');
                blocked = true;
                break;
            }
        }
        if (blocked) continue;
        if (nearBuilding(x, z, 1.5)) {
            bump('building');
            continue;
        }
        // moisture gradient — greener close to water (the old law, verbatim)
        const moisture = Math.max(0, 1 - ri.d / 60);
        const tone = Math.min(4, Math.floor((1 - moisture) * 5 * (0.75 + rng() * 0.5)));
        // the sunk final y (the sink computed and LAW-CHECKED above)
        out.push({
            x,
            z,
            y: ySunk,
            s: 0.7 + rng() * 0.55,
            tone
        });
    }
    if (out.length < GRASS_TARGET && guard >= GRASS_GUARD) rej['grassGuard'] = 1;
    return {
        tufts: out,
        rejected: rej,
        ms: Math.round((performance.now() - GRASS_T0) * 100) / 100
    };
}
const grassBuild = buildGrass();
const GRASS_TUFTS = grassBuild.tufts;
let grassStatsCache = null;
function grassStats() {
    if (grassStatsCache) return grassStatsCache;
    grassStatsCache = {
        count: GRASS_TUFTS.length,
        rejected: {
            ...grassBuild.rejected
        },
        ms: grassBuild.ms
    };
    return grassStatsCache;
}
}),
"[project]/src/game/world3d/flora-species.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SPECIES_BUILD_SEEDS",
    ()=>SPECIES_BUILD_SEEDS,
    "buildSpeciesGeometry",
    ()=>buildSpeciesGeometry,
    "speciesTriCount",
    ()=>speciesTriCount
]);
/**
 * LOKOJA LIFE — M23 W2: THE GREEN (per-species merged flora geometry)
 * ------------------------------------------------------------------
 * ONE merged BufferGeometry per species (trunk + branches + buttresses
 * + crown + fruit, a single draw-friendly mesh) for the ten Kogi
 * species defined in flora-types.ts.
 *
 * Laws of this file:
 *  - deterministic: the only randomness is the private mulberry32
 *    helper (the verbatim body of layout.makeRng, kept local so this
 *    file never imports layout) driven by SPECIES_BUILD_SEEDS —
 *    no Math.random anywhere
 *  - zero imports beyond `three` + the flora-types contract, so the
 *    build is headless-safe under bun (no geo bootstrap required)
 *  - cache law: one BufferGeometry per SpeciesId in a module-level Map;
 *    repeat calls return the identical object — build once, instance
 *    forever, nothing here ever allocates per frame
 *  - frame: origin at ground contact (bbox min y = 0), tree faces +Z
 *    (raffia walks out along +Z, fruit hangs toward +Z), total height
 *    hand-tuned within ±15% of SPECIES_META.height
 *  - vertex attributes: position / normal (computeVertexNormals) /
 *    index / color (Float32 3 vertex colors) / aSway (Float32 1, RAW
 *    0..1 weight — the material multiplies by meta.swayAmp) / aLeaf
 *    (Float32 1: 1 = crown/leaf for the weather-gold mask, 0 = wood)
 *
 * Silhouettes (flat-shaded low-poly, Kogi State field guide):
 *  neem    street umbrella · mango  compound dome · cashew  forked orchard V
 *  shea    sparse savanna  · oilpalm rosette fronds · raffia leaning river palm
 *  plantain paddle-leaf herb · iroko buttressed giant · baobab bare bottle
 *  acacia  flat-topped umbrella
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-ssr] (ecmascript)");
;
/* -------------------------------- seeded rng -------------------------------- */ /** mulberry32 — verbatim body of layout.makeRng, kept local so this
 *  module stays dependency-free (layout needs the geo bootstrap). */ function makeRng(seed) {
    let a = seed >>> 0;
    return ()=>{
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
const SPECIES_BUILD_SEEDS = {
    neem: 4101,
    mango: 4207,
    cashew: 4313,
    shea: 4409,
    oilpalm: 4523,
    raffia: 4639,
    plantain: 4741,
    iroko: 4861,
    baobab: 4933,
    acacia: 5059
};
/**
 * Accumulates transformed primitives into flat arrays, painting every
 * vertex with part color + raw sway weight + leaf mask, then bakes one
 * indexed BufferGeometry. Same cache discipline as vehicles.ts:
 * everything is built once here and reused forever.
 */ class SpeciesBuilder {
    pos = [];
    col = [];
    sway = [];
    leaf = [];
    idx = [];
    rng;
    constructor(seed){
        this.rng = makeRng(seed);
    }
    /** one draw of the species rng — for per-part silhouette jitter */ next() {
        return this.rng();
    }
    /** jittered copy of a base color — per-part tone variation, rng-driven */ tint(base, hue = 0.012, sat = 0.05, light = 0.045) {
        const c = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Color"](base);
        c.offsetHSL((this.rng() - 0.5) * 2 * hue, (this.rng() - 0.5) * 2 * sat, (this.rng() - 0.5) * 2 * light);
        return c;
    }
    /**
   * Append a primitive (we own it — disposed after the copy), transformed
   * by `m`, painted `color`, with per-vertex sway resolved from the
   * TRANSFORMED position. Non-indexed sources (icosahedra) keep their
   * per-face vertices, so blobs stay flat-faceted after
   * computeVertexNormals.
   */ part(g, m, color, swayFn, leaf) {
        const p = g.attributes.position;
        const base = this.pos.length / 3;
        const v = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"]();
        for(let i = 0; i < p.count; i++){
            v.fromBufferAttribute(p, i).applyMatrix4(m);
            this.pos.push(v.x, v.y, v.z);
            this.col.push(color.r, color.g, color.b);
            this.sway.push(swayFn(v));
            this.leaf.push(leaf);
        }
        const src = g.index;
        if (src) {
            for(let i = 0; i < src.count; i++)this.idx.push(base + src.getX(i));
        } else {
            for(let i = 0; i < p.count; i++)this.idx.push(base + i);
        }
        g.dispose();
    }
    /**
   * Append one curved blade — the CityMesh.makeFrondGeometry ribbon,
   * generalized: rings of `ringVerts` vertices stepped along a drooping
   * arc (x = out, y = rise·t − droop·t²), yawed around Y and moved to
   * the attach point. `fold` raises middle ring verts (plantain paddle
   * midrib). Sway ramps swayBase → 1.0 along the blade so tips tremble
   * hardest. Winding is consistent but arbitrary — the flora material
   * renders DoubleSide (same call as CityMesh fronds).
   */ blade(opts) {
        const { steps, len, rise, droop, width, fold, ringVerts, yaw, attach, color, swayBase, leaf } = opts;
        const base = this.pos.length / 3;
        const cy = Math.cos(yaw);
        const sy = Math.sin(yaw);
        for(let i = 0; i <= steps; i++){
            const t = i / steps;
            const x = t * len;
            const y = rise * t - droop * t * t;
            const w = width(t);
            for(let j = 0; j < ringVerts; j++){
                const edge = j === 0 ? -1 : j === ringVerts - 1 ? 1 : 0;
                const zLocal = edge * w;
                const yLocal = y + (edge === 0 ? fold : 0);
                // rotate the ring around Y, then move to the attach point
                this.pos.push(attach.x + x * cy + zLocal * sy, attach.y + yLocal, attach.z - x * sy + zLocal * cy);
                this.col.push(color.r, color.g, color.b);
                this.sway.push(swayBase + (1 - swayBase) * t);
                this.leaf.push(leaf);
            }
        }
        for(let i = 0; i < steps; i++){
            for(let j = 0; j < ringVerts - 1; j++){
                const a = base + i * ringVerts + j;
                const b = a + ringVerts;
                this.idx.push(a, b, a + 1, a + 1, b, b + 1);
            }
        }
    }
    /** bake the merged geometry — normals recomputed over the whole mesh */ finish() {
        const g = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BufferGeometry"]();
        g.setAttribute('position', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](this.pos, 3));
        g.setAttribute('color', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](this.col, 3));
        g.setAttribute('aSway', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](this.sway, 1));
        g.setAttribute('aLeaf', new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Float32BufferAttribute"](this.leaf, 1));
        g.setIndex(this.idx);
        g.computeVertexNormals();
        return g;
    }
}
/* --------------------------------- helpers ---------------------------------- */ /** composed transform: position + euler rotation + scale (T·R·S) */ function xf(px, py, pz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]().compose(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](px, py, pz), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quaternion"]().setFromEuler(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"](rx, ry, rz)), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](sx, sy, sz));
}
/** transform for a cylinder pivoted at its BASE, so it leans around the root */ function pivot(px, py, pz, rx, ry, rz, h) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]().makeTranslation(px, py, pz).multiply(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]().makeRotationFromEuler(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Euler"](rx, ry, rz))).multiply(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]().makeTranslation(0, h / 2, 0));
}
/** trunk wood: 0 at the ground ramping to ≤0.25 at the top — rigid roots,
 *  supple crown; the material scales further by meta.swayAmp. Clamped ≥0
 *  so a leaning segment's base ring can never bake a negative weight. */ function trunkSway(top) {
    return (v)=>Math.max(0, Math.min(v.y / top, 1)) * 0.25;
}
/** crown foliage: 0.3 near the trunk axis → 1.0 at the outer canopy */ function blobSway(reach) {
    return (v)=>0.3 + 0.7 * Math.min(Math.hypot(v.x, v.z) / reach, 1);
}
/** closed tapered trunk from y=0 to y=h, centered on the axis */ function addTrunk(b, rTop, rBot, h, color, seg = 6) {
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](rTop, rBot, h, seg, 1, false), xf(0, h / 2, 0), color, trunkSway(h), 0);
}
/** crown blob: icosahedron detail 1 scaled to (r, sy, r) — flat-faceted,
 *  rng-yawed so the faceting never reads stamped */ function addBlob(b, x, y, z, r, sy, color, reach) {
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](1, 1), xf(x, y, z, 0, b.next() * Math.PI * 2, 0, r, sy, r), color, blobSway(reach), 1);
}
/** bare branch wood, pivoted at its root point, open-ended (ends hidden) */ function addBranch(b, x, y, z, rTop, rBot, h, rx, rz, color, swayTop) {
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](rTop, rBot, h, 5, 1, true), pivot(x, y, z, rx, 0, rz, h), color, trunkSway(swayTop), 0);
}
/** fruit bunch — NOT leaf-masked (dry-season gold must never gild fruit),
 *  gentle constant sway */ function addFruit(b, x, y, z, r, color) {
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IcosahedronGeometry"](r, 0), xf(x, y, z), color, ()=>0.5, 0);
}
/* --------------------------- the ten species builds -------------------------- */ /** 1. neem — street tree: tapered trunk + rounded umbrella of 4 fine blobs */ function buildNeem() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.neem);
    const wood = b.tint('#6a4a2e');
    addTrunk(b, 0.14, 0.22, 2.7, wood);
    const reach = 3.0;
    addBlob(b, 0, 4.7, 0, 2.05, 1.5, b.tint('#4e7a36'), reach);
    addBlob(b, 1.45, 4.0, 0.85, 1.5, 1.05, b.tint('#568437'), reach);
    addBlob(b, -1.5, 4.25, -0.55, 1.45, 1.0, b.tint('#477332'), reach);
    addBlob(b, 0.2, 3.55, -1.6, 1.4, 0.95, b.tint('#517a38'), reach);
    return b.finish();
}
/** 2. mango — compound shade: stouter trunk + dense tight dome, deep
 *  green, widest near the middle */ function buildMango() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.mango);
    addTrunk(b, 0.18, 0.3, 2.5, b.tint('#5e3f26'));
    const reach = 3.1;
    addBlob(b, 0, 4.55, 0, 2.1, 1.45, b.tint('#3d6b2f'), reach);
    addBlob(b, 1.55, 4.0, 0.75, 1.55, 1.1, b.tint('#446f30'), reach);
    addBlob(b, -1.5, 3.95, -0.65, 1.5, 1.08, b.tint('#3a662c'), reach);
    addBlob(b, 0.6, 3.55, -1.55, 1.4, 1.0, b.tint('#416d2f'), reach);
    addBlob(b, -0.7, 3.6, 1.5, 1.35, 0.98, b.tint('#37622a'), reach);
    return b.finish();
}
/** 3. cashew — orchard: short forked trunk (two cylinders in a V from
 *  the same root), wide lopsided canopy spread wider than tall */ function buildCashew() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.cashew);
    const wood = b.tint('#6b4b30');
    // fork pivots sit a hair above ground so the tilted base rings never
    // dip below y=0 (a 0.38 rad tilt swings the r=0.15 ring ±0.056)
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.09, 0.15, 1.7, 5, 1, true), pivot(0, 0.07, 0, 0, 0, -0.38, 1.7), wood, trunkSway(3.2), 0);
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.09, 0.15, 1.7, 5, 1, true), pivot(0, 0.07, 0, 0, 0, 0.38, 1.7), wood, trunkSway(3.2), 0);
    const reach = 3.4;
    addBlob(b, 1.7, 3.2, 0.75, 1.65, 1.1, b.tint('#4f7c33'), reach);
    addBlob(b, -1.6, 3.35, -0.5, 1.5, 1.0, b.tint('#477331'), reach);
    addBlob(b, 0.15, 3.0, -1.35, 1.45, 0.95, b.tint('#557f36'), reach);
    return b.finish();
}
/** 4. shea — savanna: squat stout trunk, higher bare branches, SPARSE
 *  3-blob crown with visible gaps */ function buildShea() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.shea);
    const wood = b.tint('#71503a');
    addTrunk(b, 0.3, 0.4, 2.4, wood);
    addBranch(b, 0, 1.9, 0, 0.08, 0.13, 1.7, 0, 0.55, wood, 5);
    addBranch(b, 0, 1.9, 0, 0.08, 0.13, 1.7, 0, -0.55, wood, 5);
    const reach = 3.1;
    addBlob(b, 1.7, 4.9, 0.3, 1.5, 1.1, b.tint('#6b8a3a'), reach);
    addBlob(b, -1.5, 5.1, -0.9, 1.45, 1.05, b.tint('#5f7d34'), reach);
    addBlob(b, -0.2, 5.9, 1.5, 1.3, 0.95, b.tint('#718e3d'), reach);
    return b.finish();
}
/** 5. oilpalm — tall straight tapering bole + rosette of 12 arched
 *  fronds + two orange fruit bunches tucked under the crown */ function buildOilpalm() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.oilpalm);
    addTrunk(b, 0.16, 0.26, 7.4, b.tint('#8a6a48'));
    for(let f = 0; f < 12; f++){
        const yaw = f / 12 * Math.PI * 2 + (b.next() - 0.5) * 0.22;
        b.blade({
            steps: 6,
            len: 2.6 * (0.9 + b.next() * 0.2),
            rise: 1.5,
            droop: 1.7,
            width: (t)=>0.3 * (1 - 0.72 * t),
            fold: 0,
            ringVerts: 2,
            yaw,
            attach: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, 7.32, 0),
            color: b.tint('#4a7c34'),
            swayBase: 0.35,
            leaf: 1
        });
    }
    addFruit(b, 0.32, 6.95, 0.4, 0.22, b.tint('#d97a1f'));
    addFruit(b, -0.36, 6.9, -0.28, 0.2, b.tint('#d97a1f'));
    return b.finish();
}
/** 6. raffia — river palm: 4 trunk segments walking out along a +Z lean
 *  (the CityMesh stacked-cylinder trick), 9 arched fronds, dark-red
 *  fruit cluster */ function buildRaffia() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.raffia);
    const wood = b.tint('#7d5f42');
    const segH = 1.42;
    for(let k = 0; k < 4; k++){
        b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.16 - k * 0.018, 0.2 - k * 0.018, segH, 5, 1, true), pivot(0, k * 1.2, k * k * 0.16, k * 0.12, 0, 0, segH), wood, trunkSway(5.2), 0);
    }
    for(let f = 0; f < 9; f++){
        const yaw = f / 9 * Math.PI * 2 + (b.next() - 0.5) * 0.3;
        b.blade({
            steps: 6,
            len: 2.3 * (0.9 + b.next() * 0.2),
            rise: 1.5,
            droop: 1.65,
            width: (t)=>0.28 * (1 - 0.72 * t),
            fold: 0,
            ringVerts: 2,
            yaw,
            attach: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, 4.85, 1.55),
            color: b.tint('#4f8038'),
            swayBase: 0.35,
            leaf: 1
        });
    }
    addFruit(b, 0.2, 4.55, 1.85, 0.26, b.tint('#7a2230'));
    addFruit(b, -0.24, 4.45, 1.7, 0.18, b.tint('#7a2230'));
    return b.finish();
}
/** 7. plantain — NO woody trunk: green pseudostem + 6 large paddle
 *  leaves (folded-ribbon quads) + the rolled cigar-leaf bud on top */ function buildPlantain() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.plantain);
    addTrunk(b, 0.1, 0.16, 2.2, b.tint('#7a9a3a'));
    for(let f = 0; f < 6; f++){
        const yaw = f / 6 * Math.PI * 2 + (b.next() - 0.5) * 0.5;
        b.blade({
            steps: 6,
            len: 1.6 * (0.88 + b.next() * 0.24),
            rise: 0.9 + b.next() * 0.3,
            droop: 1.5,
            width: (t)=>0.44 * (0.12 + 0.88 * Math.pow(Math.max(Math.sin(Math.PI * t), 0), 0.8)) * (1 - 0.5 * t),
            fold: 0.055,
            ringVerts: 3,
            yaw,
            attach: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Vector3"](0, 2.05, 0.02),
            color: b.tint('#7aa03a'),
            swayBase: 0.3,
            leaf: 1
        });
    }
    // tiny bud — the rolled young leaf at the growth point, aLeaf = 1
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.035, 0.075, 0.78, 5, 1, true), pivot(0, 2.02, 0.02, 0.1, 0, 0.06, 0.78), b.tint('#6b8a30'), ()=>0.9, 1);
    return b.finish();
}
/** 8. iroko — giant: massive bole + 6 buttress fins flaring to r~1.1,
 *  clear trunk to ~9u, then a huge broad 6-blob crown */ function buildIroko() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.iroko);
    const wood = b.tint('#5c4028');
    addTrunk(b, 0.42, 0.58, 9.4, wood);
    for(let k = 0; k < 6; k++){
        const yaw = k / 6 * Math.PI * 2 + (b.next() - 0.5) * 0.3;
        // triangular wedge (3-sided tapering cone) flattened tangentially,
        // pushed out to r~1.1 at the flare — lifted h/2 so the base ring
        // sits exactly on y=0
        const m = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]().makeTranslation(Math.cos(yaw) * 0.62, 1.4, -Math.sin(yaw) * 0.62).multiply(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]().makeRotationY(yaw)).multiply(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Matrix4"]().makeScale(1, 1, 0.2));
        b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.03, 0.46, 2.8, 3, 1, false), m, wood, (v)=>Math.min(v.y / 2.8, 1) * 0.12, 0);
    }
    addBranch(b, 0, 8.6, 0, 0.09, 0.16, 2.4, 0.55, 0.3, wood, 12);
    addBranch(b, 0, 8.8, 0, 0.09, 0.15, 2.2, 0.4, -0.5, wood, 12);
    addBranch(b, 0, 8.7, 0, 0.08, 0.14, 2.1, -0.6, 0.15, wood, 12);
    const reach = 5.2;
    addBlob(b, 0.3, 15.4, 0.2, 3.0, 2.55, b.tint('#3f6e2e'), reach);
    addBlob(b, 2.6, 13.4, 1.2, 2.6, 1.9, b.tint('#3a6829'), reach);
    addBlob(b, -2.7, 13.0, -0.9, 2.5, 1.8, b.tint('#43732f'), reach);
    addBlob(b, 1.2, 12.3, -2.6, 2.4, 1.7, b.tint('#3c6a2b'), reach);
    addBlob(b, -1.4, 12.0, 2.6, 2.3, 1.65, b.tint('#477631'), reach);
    addBlob(b, 0.1, 10.9, 0.1, 2.2, 1.5, b.tint('#386226'), reach);
    return b.finish();
}
/** 9. baobab — bottle trunk (3 stacked tapering segments, bulge low) +
 *  7 short stub branches + 6 SMALL sparse leaf blobs: the bare-topped
 *  silhouette is the point */ function buildBaobab() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.baobab);
    const wood = b.tint('#84654c');
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](1.25, 1.7, 2.4, 7, 1, true), xf(0, 1.2, 0), wood, trunkSway(8), 0);
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.85, 1.25, 2.1, 7, 1, true), xf(0, 2.4 + 1.05, 0), wood, trunkSway(8), 0);
    b.part(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.5, 0.85, 2.0, 7, 1, false), xf(0, 4.5 + 1.0, 0), wood, trunkSway(8), 0);
    // 7 stubs radiating from the shoulder — one nearly vertical carries the
    // highest tuft so the silhouette tops out honestly
    for(let k = 0; k < 7; k++){
        const yaw = k / 7 * Math.PI * 2 + (b.next() - 0.5) * 0.4;
        const tilt = k === 0 ? 0.15 : 0.6 + b.next() * 0.3;
        addBranch(b, Math.cos(yaw) * 0.35, 6.15, -Math.sin(yaw) * 0.35, 0.045, 0.09, 1.15, tilt, 0, wood, 8);
    }
    const tuft = b.tint('#5d8a46');
    for(let k = 0; k < 6; k++){
        const yaw = k / 6 * Math.PI * 2 + (b.next() - 0.5) * 0.5;
        const rad = k === 0 ? 0.05 : 0.95 + b.next() * 0.25;
        const y = k === 0 ? 7.55 : 6.9 + b.next() * 0.45;
        addBlob(b, Math.cos(yaw) * rad, y, -Math.sin(yaw) * rad, 0.5, 0.42, tuft, 1.4);
    }
    return b.finish();
}
/** 10. acacia — tall slim trunk to ~5u + the classic flat-topped
 *  umbrella: two stacked squashed discs (y scaled ×0.35) */ function buildAcacia() {
    const b = new SpeciesBuilder(SPECIES_BUILD_SEEDS.acacia);
    addTrunk(b, 0.12, 0.2, 5.3, b.tint('#6a5136'));
    const reach = 3.6;
    addBlob(b, 0, 5.6, 0, 3.6, 1.26, b.tint('#55823a'), reach);
    addBlob(b, 0.5, 6.2, 0.4, 2.8, 0.98, b.tint('#5d893e'), reach);
    return b.finish();
}
/* --------------------------------- public API -------------------------------- */ const BUILDERS = {
    neem: buildNeem,
    mango: buildMango,
    cashew: buildCashew,
    shea: buildShea,
    oilpalm: buildOilpalm,
    raffia: buildRaffia,
    plantain: buildPlantain,
    iroko: buildIroko,
    baobab: buildBaobab,
    acacia: buildAcacia
};
const cache = new Map();
function buildSpeciesGeometry(id) {
    const hit = cache.get(id);
    if (hit) return hit;
    const g = BUILDERS[id]();
    cache.set(id, g);
    return g;
}
function speciesTriCount(id) {
    const g = buildSpeciesGeometry(id);
    return g.index ? g.index.count / 3 : g.attributes.position.count / 3;
}
}),
"[project]/src/game/world3d/plates.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PLATE_NAME_MAX",
    ()=>PLATE_NAME_MAX,
    "STREET_PLATES",
    ()=>STREET_PLATES,
    "nearestPlate",
    ()=>nearestPlate,
    "plateStats",
    ()=>plateStats
]);
/**
 * LOKOJA LIFE — W1 ROAD SIDES: STREET NAME PLATES
 * -----------------------------------------------
 * Blue municipal name plates at the junction mouths of the streets that
 * carry REAL OSM names in our own geo data (`RoadDef.name` — Lugard Road,
 * Ibb way, Patti Road, Ahmadu Bello way… 20 unique names over 30 named
 * ways, verified by the m23-w1 law suite against the live arrays).
 *
 * THE CLUSTER LAW (zebra pattern reused): every NAMED artery's first/last
 * polyline point is clustered at junction radius 5 (the road renderer's
 * junctionDiscs law); a cluster with ≥ 2 members is a junction mouth. Each
 * named member arm gets ONE plate standing on the verge corner beside the
 * mouth, facing back up the arm so the approaching driver reads it.
 *
 * THE VERGE LAW: the plate stands at roadGap ≥ 0.55 (never on tarmac,
 * never in the W1 drain band), above water, outside fenced ground, inside
 * the walk bound. One plate per (cluster, name); ≤ PLATE_CAP total.
 *
 * THE NAME LAW: names are the raw OSM strings uppercased for the plate
 * face — spelling preserved exactly as mapped (Cementry Road stays the
 * way the survey wrote it). The renderer draws them from one canvas
 * atlas; this module stays pure data.
 *
 * THE GEO GATE (repo law): headless bun consumers must import
 * scripts/geo/bootstrap.ts FIRST.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
;
/* ------------------------------ tunable laws ------------------------------- */ const CLUSTER_R = 5 // endpoint clustering radius (junctionDiscs law)
;
const VERGE_GAP_MIN = 0.55 // roadGap floor at the plate spot (drain band ends +1.425)
;
const PULL = 1.7 // plate sits this far outside the mouth along the arm
;
const SIDE = 1.75 // plate offset beyond the carriageway EDGE — behind the drain
;
// band (outer wall +1.425), in front of the pole line (+2.0): the real corner
const WATER_MIN = 0.12;
const RIVER_MIN = 1.2;
const PLATE_CAP = 40;
const NAME_MAX = 28 // longest OSM name we will engrave (law-tested)
;
const plates = [];
let clusterCount = 0;
let truncated = false;
// every NAMED artery's first/last polyline point, in ROADS array order
const armEnds = [];
for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROADS"]){
    if (!r.name) continue;
    armEnds.push({
        x: r.pts[0][0],
        z: r.pts[0][1],
        road: r,
        isStart: true
    });
    const last = r.pts[r.pts.length - 1];
    armEnds.push({
        x: last[0],
        z: last[1],
        road: r,
        isStart: false
    });
}
const used = armEnds.map(()=>false);
for(let i = 0; i < armEnds.length; i++){
    if (plates.length >= PLATE_CAP) {
        truncated = true;
        break;
    }
    if (used[i]) continue;
    used[i] = true;
    const first = armEnds[i];
    const members = [
        first
    ];
    let cx = first.x;
    let cz = first.z;
    for(let j = i + 1; j < armEnds.length; j++){
        if (used[j]) continue;
        if (Math.hypot(first.x - armEnds[j].x, first.z - armEnds[j].z) < CLUSTER_R) {
            used[j] = true;
            members.push(armEnds[j]);
            cx += armEnds[j].x;
            cz += armEnds[j].z;
        }
    }
    if (members.length < 2) continue; // a lone endpoint is no junction mouth
    cx /= members.length;
    cz /= members.length;
    clusterCount++;
    // one plate per named arm, one per name per cluster
    const seenNames = new Set();
    for (const m of members){
        if (plates.length >= PLATE_CAP) {
            truncated = true;
            break;
        }
        const name = m.road.name;
        if (!name || seenNames.has(name)) continue;
        // arm direction: from the cluster centre toward this arm's endpoint
        let dx = m.x - cx;
        let dz = m.z - cz;
        let len = Math.hypot(dx, dz);
        if (len < 0.25) {
            const p = m.isStart ? m.road.pts[1] : m.road.pts[m.road.pts.length - 2];
            dx = p[0] - m.x;
            dz = p[1] - m.z;
            len = Math.hypot(dx, dz);
            if (len < 1e-9) continue;
        }
        const dirX = dx / len;
        const dirZ = dz / len;
        const half = renderHalf(m.road.cls);
        // u points INTO the arm (junction → endpoint); the plate pulls back
        // from the endpoint toward the mouth, then steps to whichever verge
        // side passes the laws (both sides tried — the corner must read).
        // SIDE is measured from the carriageway EDGE, not the centreline.
        const baseX = m.x - dirX * PULL;
        const baseZ = m.z - dirZ * PULL;
        const candidates = [];
        for (const s of [
            1,
            -1
        ]){
            candidates.push({
                x: baseX + -dirZ * (half + SIDE) * s,
                z: baseZ + dirX * (half + SIDE) * s
            });
        }
        let placed = null;
        for (const c of candidates){
            // THE VERGE LAWS — all must hold
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(c.x, c.z) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inCivicCampus"])(c.x, c.z)) continue;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(c.x, c.z) <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WATER_Y"] + WATER_MIN) continue;
            const ri = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverInfo"])(c.x, c.z);
            if (ri.d <= ri.halfWidth + RIVER_MIN) continue;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["roadGap"])(c.x, c.z) < VERGE_GAP_MIN) continue;
            if (Math.hypot(c.x, c.z) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) continue;
            placed = c;
            break;
        }
        if (!placed) continue;
        seenNames.add(name);
        // the plate is parallel to its street, normal +u — facing the driver
        // who is coming down the named street toward the junction
        plates.push({
            x: placed.x,
            z: placed.z,
            y: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["heightAt"])(placed.x, placed.z),
            rotY: Math.atan2(dirX, dirZ),
            name,
            cls: m.road.cls
        });
    }
}
function renderHalf(cls) {
    return (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROAD_RENDER_W"][cls] ?? 2.2) / 2;
}
const STREET_PLATES = plates;
function plateStats() {
    let longest = 0;
    const names = new Set();
    for (const p of plates){
        names.add(p.name);
        longest = Math.max(longest, p.name.length);
    }
    return {
        count: plates.length,
        uniqueNames: names.size,
        clusters: clusterCount,
        truncated,
        longestName: longest
    };
}
function nearestPlate(x, z, maxDist) {
    let best = maxDist;
    let hit = null;
    for (const p of STREET_PLATES){
        const d = Math.hypot(p.x - x, p.z - z);
        if (d < best) {
            best = d;
            hit = p;
        }
    }
    return hit ? {
        plate: hit,
        dist: best
    } : null;
}
const PLATE_NAME_MAX = NAME_MAX;
}),
"[project]/src/game/world3d/catenary.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — W1: THE CATENARY LAW (pure, headless-safe)
 * --------------------------------------------------------
 * A hanging conductor under its own weight is a catenary, y = a·cosh(x/a)
 * — not a parabola. Given span length L and sag s, the parameter a solves
 *
 *     s = a·(cosh(L / (2a)) − 1)
 *
 * which is strictly decreasing in a, so 48 bisection steps pin it to
 * double precision with zero per-frame cost (module-scope per span).
 * dip(t) then measures the true drop from the chord:
 *
 *     dip(t) = a·cosh(L/(2a)) − a·cosh((t − 0.5)·L/a)
 *
 * — exactly 0 at both ends, exactly s at mid-span. Pure TypeScript: no
 * three.js, no React, no DOM, so bun law suites can verify the equation
 * itself (scripts/test-m23-w1.ts does).
 */ /** solve the catenary parameter a for span L and sag s (bisection) */ __turbopack_context__.s([
    "catenaryA",
    ()=>catenaryA,
    "catenaryDip",
    ()=>catenaryDip
]);
function catenaryA(L, s) {
    let lo = 0.05 * L;
    let hi = 50 * L;
    for(let i = 0; i < 48; i++){
        const mid = (lo + hi) / 2;
        const f = mid * (Math.cosh(L / (2 * mid)) - 1) - s;
        if (f > 0) lo = mid;
        else hi = mid;
    }
    return (lo + hi) / 2;
}
function catenaryDip(L, s, t) {
    const a = catenaryA(L, s);
    return a * Math.cosh(L / (2 * a)) - a * Math.cosh((t - 0.5) * L / a);
}
}),
"[project]/src/game/world3d/collision.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PLAYER_RADIUS",
    ()=>PLAYER_RADIUS,
    "bridgeDeckY",
    ()=>bridgeDeckY,
    "cameraObstructionT",
    ()=>cameraObstructionT,
    "resolvePosition",
    ()=>resolvePosition
]);
/**
 * LOKOJA LIFE — 3D World Collision (Stage 3D)
 * ---------------------------------------------
 * Pure spatial resolution for the walkable world:
 *  - oriented building footprints (circle vs OBB)
 *  - rivers (blocked except on bridge decks)
 *  - the world-boundary rim
 *
 * Deterministic and dependency-free — the player controller calls
 * resolve() every frame with its intended position and gets a legal one.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/layout.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/schools.ts [app-ssr] (ecmascript)");
;
;
;
function boxFor(b) {
    const pad = 0.45 // breathing room so the player never clips walls
    ;
    return {
        cx: b.x,
        cz: b.z,
        hw: b.w / 2 + pad,
        hd: b.d / 2 + pad,
        cos: Math.cos(-b.rotY),
        sin: Math.sin(-b.rotY),
        rotY: b.rotY
    };
}
function boxForSchool(b) {
    const pad = b.kind === 'flag' ? 0.3 : 0.45;
    return {
        cx: b.x,
        cz: b.z,
        hw: b.w / 2 + pad,
        hd: b.d / 2 + pad,
        cos: Math.cos(-b.rotY),
        sin: Math.sin(-b.rotY),
        rotY: b.rotY
    };
}
/* ---------------------- walk-through props (F3 fix squad) ---------------------- */ /**
 * SLIM BAY FOOTPRINTS for the parked fleet — half width × half depth in the
 * rig's local frame (x = across, z = along, +z = the nose), matched to the
 * body boxes the builders in `vehicles.ts` lay down (keke tub 1.28×1.5 +
 * nose, danfo 1.94×4.4, sedan 1.74×4.16, lorry 1.9×5.0, okada ~0.8×2.1).
 * No breathing pad: a parked car is a walk-around obstacle, not a wall.
 */ const PARKED_FOOTPRINT = {
    keke: [
        0.72,
        1.4
    ],
    okada: [
        0.45,
        1.1
    ],
    taxi: [
        0.95,
        2.16
    ],
    sedan: [
        0.95,
        2.16
    ],
    danfo: [
        1.05,
        2.28
    ],
    lorry: [
        1.05,
        2.5
    ]
};
/**
 * THE ADDED-BOX LAW — parked bays + stall counters are the only props that
 * join the building colliders, and their total stays ≤ 30: 7 bays + the
 * first 23 stalls in deterministic array order (a stall counter is a
 * waist-high walk-blocker; its canopy stays overhead and never collides).
 */ const STALL_COLLIDER_CAP = 23;
const BOXES = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].map(boxFor),
    // Stage 7 — school compounds (walls, blocks, gatehouses… the open gate gap
    // is real: the wall runs leave a walkable gap and the arch itself collides not)
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_BOXES"].filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSchoolCollider"]).map(boxForSchool),
    // points of interest get a slim collider so you walk UP TO a job board, not through it
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["POINTS_OF_INTEREST"].map((p)=>({
            cx: p.x,
            cz: p.z,
            hw: 0.85,
            hd: 0.22,
            cos: Math.cos(-p.rotY),
            sin: Math.sin(-p.rotY),
            rotY: p.rotY
        })),
    // F3 — parked vehicles: slim oriented bays (walk around the cab, not through it)
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PARKED_VEHICLES"].map((p)=>{
        const [hw, hd] = PARKED_FOOTPRINT[p.build];
        return {
            cx: p.x,
            cz: p.z,
            hw,
            hd,
            cos: Math.cos(-p.rotY),
            sin: Math.sin(-p.rotY),
            rotY: p.rotY
        };
    }),
    // F3 — stall counters: the market's wooden tables block the walk, slim OBB
    // at the counter's 2×1 render footprint (+ a hand of pad), rotY-aware
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STALLS"].slice(0, STALL_COLLIDER_CAP).map((s)=>({
            cx: s.x,
            cz: s.z,
            hw: 1.1,
            hd: 0.6,
            cos: Math.cos(-s.rotY),
            sin: Math.sin(-s.rotY),
            rotY: s.rotY
        }))
];
/** push a circle out of an oriented box (no-op if not overlapping) */ function resolveBox(x, z, r, b) {
    const dx = x - b.cx;
    const dz = z - b.cz;
    // world → box local
    const lx = dx * b.cos - dz * b.sin;
    const lz = dx * b.sin + dz * b.cos;
    const clampedX = Math.max(-b.hw, Math.min(b.hw, lx));
    const clampedZ = Math.max(-b.hd, Math.min(b.hd, lz));
    const ox = lx - clampedX;
    const oz = lz - clampedZ;
    const dist2 = ox * ox + oz * oz;
    if (dist2 > r * r) return [
        x,
        z
    ] // no overlap
    ;
    if (dist2 > 1e-6) {
        // push out along the shortest separation vector
        const dist = Math.sqrt(dist2);
        const push = (r - dist) / dist;
        const rx = ox * push;
        const rz = oz * push;
        // local → world
        const wcos = Math.cos(b.rotY);
        const wsin = Math.sin(b.rotY);
        return [
            x + (rx * wcos - rz * wsin),
            z + (rx * wsin + rz * wcos)
        ];
    }
    // centre inside the box — push toward the nearest face
    const dxFace = b.hw - Math.abs(lx);
    const dzFace = b.hd - Math.abs(lz);
    if (dxFace < dzFace) {
        const nl = lx >= 0 ? b.hw + r : -b.hw - r;
        const wcos = Math.cos(b.rotY);
        const wsin = Math.sin(b.rotY);
        const rx = nl - lx;
        return [
            x + rx * wcos,
            z + rx * wsin
        ];
    }
    const nl = lz >= 0 ? b.hd + r : -b.hd - r;
    const wcos = Math.cos(b.rotY);
    const wsin = Math.sin(b.rotY);
    const rz = nl - lz;
    return [
        x + -rz * wsin,
        z + rz * wcos
    ];
}
const BRIDGE_ZONES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BRIDGES"].map((b)=>({
        cx: b.x,
        cz: b.z,
        hl: b.length / 2 + 1.5,
        hw: b.width / 2,
        cos: Math.cos(-b.rotY),
        sin: Math.sin(-b.rotY)
    }));
function onBridge(x, z) {
    for (const b of BRIDGE_ZONES){
        const dx = x - b.cx;
        const dz = z - b.cz;
        const lx = dx * b.cos - dz * b.sin;
        const lz = dx * b.sin + dz * b.cos;
        if (Math.abs(lx) <= b.hl && Math.abs(lz) <= b.hw) return true;
    }
    return false;
}
/* --------------------------------- rivers ---------------------------------- */ /** closest distance to any river centreline — SILK II: answered by the
 *  layout river spatial grid, EXACTLY the brute-force winner (the
 *  (distance, segment-index) lexicographic minimum the linear scan found,
 *  ties included) at a fraction of the segment evals. See layout.ts
 *  `river spatial grid` for the exactness law + the cutoff catalog. */ function riverDistance(x, z) {
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["riverNearest"])(x, z);
    return {
        d: q.d,
        halfWidth: q.halfWidth,
        cx: q.cx,
        cz: q.cz
    };
}
const PLAYER_RADIUS = 0.55;
function resolvePosition(x, z) {
    // buildings
    for (const b of BOXES){
        const rx = x - b.cx;
        const rz = z - b.cz;
        if (rx * rx + rz * rz > (b.hw + b.hd + PLAYER_RADIUS) ** 2) continue;
        [x, z] = resolveBox(x, z, PLAYER_RADIUS, b);
    }
    // rivers — blocked unless standing on a bridge deck (or inside a school yard)
    if (!onBridge(x, z) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inSchoolYard"])(x, z)) {
        const { d, halfWidth, cx, cz } = riverDistance(x, z);
        const limit = halfWidth + PLAYER_RADIUS * 0.4;
        if (d < limit && d > 1e-4) {
            const push = (limit - d) / d;
            x += (x - cx) * push;
            z += (z - cz) * push;
        }
    }
    // world rim
    const rim = Math.hypot(x, z);
    if (rim > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"]) {
        x = x / rim * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"];
        z = z / rim * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WALK_BOUND"];
    }
    return [
        x,
        z
    ];
}
function bridgeDeckY(x, z) {
    for(let i = 0; i < BRIDGE_ZONES.length; i++){
        const b = BRIDGE_ZONES[i];
        const dx = x - b.cx;
        const dz = z - b.cz;
        const lx = dx * b.cos - dz * b.sin;
        const lz = dx * b.sin + dz * b.cos;
        if (Math.abs(lx) <= b.hl && Math.abs(lz) <= b.hw) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BRIDGES"][i].y;
        }
    }
    return null;
}
/* --------------------------- camera obstruction ---------------------------- */ /**
 * INC 4 — the known "camera clips building corners" fix. Samples the
 * segment player → camera against the building OBBs (2D footprint +
 * real height) and returns the FRACTION t (0..1] along the segment of
 * the first blocked sample, or null when the view is clear. The camera
 * rig pulls in to just before t so walls never swallow the view.
 */ const CAM_SAMPLES = 10;
/** buildings only, with real top height — the camera obstruction world */ const CAM_BOXES = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$layout$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BUILDINGS"].map((b)=>({
            ...boxFor(b),
            topY: b.y + b.h
        })),
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SCHOOL_BOXES"].filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$schools$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSchoolCollider"]).map((b)=>({
            ...boxForSchool(b),
            topY: b.y + b.h
        }))
];
function cameraObstructionT(x0, z0, x1, z1, camY) {
    let hit = null;
    for(let s = 1; s <= CAM_SAMPLES; s++){
        const t = s / CAM_SAMPLES;
        const x = x0 + (x1 - x0) * t;
        const z = z0 + (z1 - z0) * t;
        let blocked = false;
        for (const b of CAM_BOXES){
            if (camY >= b.topY) continue; // camera flies over this roof
            const dx = x - b.cx;
            const dz = z - b.cz;
            if (dx * dx + dz * dz > (b.hw + b.hd + 0.3) ** 2) continue;
            const lx = dx * b.cos - dz * b.sin;
            const lz = dx * b.sin + dz * b.cos;
            if (Math.abs(lx) <= b.hw && Math.abs(lz) <= b.hd) {
                blocked = true;
                break;
            }
        }
        if (blocked) {
            hit = Math.max(0.08, t - 1 / CAM_SAMPLES);
            break;
        }
    }
    return hit;
}
}),
];

//# sourceMappingURL=src_game_world3d_daa95e15._.js.map