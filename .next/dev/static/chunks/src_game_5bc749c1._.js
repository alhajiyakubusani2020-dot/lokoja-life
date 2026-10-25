(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/game/systems/nation-sim.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * M20 — PLANET SCALE: THE NATION SIM
 * -----------------------------------
 * THE WORKER LAW: 10,000 NPCs simulate OFF the main thread. The kernel
 * below is 100% pure TypeScript — no three.js, no React, no DOM, no
 * store — so the SAME module runs inside a Web Worker (the browser) and
 * directly under Bun (the law suite). The UI NEVER sees a per-NPC
 * array: the only thing that crosses the boundary is the small
 * CrowdSnapshot aggregate (crowdAggregate) — one plain object, ten
 * districts, four numbers each. THE UI-NEVER-STUTTERS LAW lives here:
 * stepCrowd mutates typed arrays in place with ZERO allocations, and
 * the bridge (nation-bridge.ts) rides a 2-second cadence, never rAF.
 *
 * THE DETERMINISM LAW: the same (seed, day, tick, pulse) produces the
 * same city — proven by FNV-1a city hashes in the law suite, the same
 * discipline as the M19 music patterns and the M8 chaos rolls.
 *
 * THE DISTRICT LAW: the crowd walks the city's REAL zone roster —
 * pinned by test to CHAOS_ZONE_IDS (chaos.ts) so the two can never
 * drift apart. Lokoja's crowd lives where Lokoja's chaos lives.
 */ /* ------------------------------ the city map ------------------------------ */ /**
 * The crowd's district roster — the game's real zone ids. Pinned by
 * test to CHAOS_ZONE_IDS; reorder nothing, the indices ARE the save
 * format of the snapshot.
 */ __turbopack_context__.s([
    "CROWD_ACTIVITIES",
    ()=>CROWD_ACTIVITIES,
    "NATION_DISTRICTS",
    ()=>NATION_DISTRICTS,
    "createCrowdState",
    ()=>createCrowdState,
    "crowdAggregate",
    ()=>crowdAggregate,
    "hashCrowd",
    ()=>hashCrowd,
    "quietPulse",
    ()=>quietPulse,
    "stepCrowd",
    ()=>stepCrowd
]);
const NATION_DISTRICTS = [
    'home',
    'kpata-market',
    'ganaja-junction',
    'confluence',
    'mount-patti',
    'historic-lokoja',
    'government-area',
    'university-area',
    'food-area',
    'transport-area'
];
/** Low-lying districts the flood season empties (the M11 cut law's ground). */ const LOW_DISTRICTS = NATION_DISTRICTS.reduce(_c = (acc, id, i)=>{
    if (id === 'kpata-market' || id === 'confluence' || id === 'ganaja-junction' || id === 'transport-area') acc.push(i);
    return acc;
}, []);
_c1 = LOW_DISTRICTS;
/** High ground the flood moves people TOWARD (Patti first — the real refuge). */ const HIGH_DISTRICTS = NATION_DISTRICTS.reduce(_c2 = (acc, id, i)=>{
    if (id === 'mount-patti' || id === 'government-area' || id === 'university-area') acc.push(i);
    return acc;
}, []);
_c3 = HIGH_DISTRICTS;
/** Where a market-day crowd concentrates (the M2/M8 liquidity ground). */ const MARKET_DISTRICTS = NATION_DISTRICTS.reduce(_c4 = (acc, id, i)=>{
    if (id === 'kpata-market' || id === 'food-area' || id === 'transport-area' || id === 'ganaja-junction') acc.push(i);
    return acc;
}, []);
_c5 = MARKET_DISTRICTS;
const CROWD_ACTIVITIES = [
    'idle',
    'hustle',
    'market',
    'worship',
    'football',
    'shelter'
];
/* ------------------------------ the rng law ------------------------------- */ /** xorshift32 — one source of chance, seeded, identical in worker and bun. */ function nextRandom(state) {
    let x = state.tick | 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    state.tick = x | 0;
    return (x >>> 0) / 4294967296;
}
function createCrowdState(seed, count = 10_000) {
    const safeCount = Math.max(1, Math.min(50_000, Math.floor(count)));
    const state = {
        seed: seed | 0,
        street: new Uint8Array(safeCount),
        mood: new Uint8Array(safeCount),
        wealth: new Uint16Array(safeCount),
        activity: new Uint8Array(safeCount),
        tick: seed | 0 || 0x9e3779b9,
        day: 1,
        count: safeCount
    };
    // warm the rng so the boot layout never depends on the seed's low bits alone
    for(let i = 0; i < 8; i++)nextRandom(state);
    const weights = NATION_DISTRICTS.map((id)=>{
        if (id === 'kpata-market') return 22;
        if (id === 'transport-area') return 16;
        if (id === 'food-area') return 14;
        if (id === 'ganaja-junction') return 12;
        if (id === 'historic-lokoja') return 9;
        if (id === 'home') return 9;
        if (id === 'university-area') return 7;
        if (id === 'government-area') return 5;
        if (id === 'confluence') return 4;
        return 2 // mount-patti — the quiet hill
        ;
    });
    const totalWeight = weights.reduce((a, b)=>a + b, 0);
    const cum = [];
    let acc = 0;
    for (const w of weights){
        acc += w;
        cum.push(acc / totalWeight);
    }
    for(let i = 0; i < safeCount; i++){
        const r = nextRandom(state);
        let d = 0;
        while(d < cum.length - 1 && r > cum[d])d++;
        state.street[i] = d;
        state.mood[i] = 55 + Math.floor(nextRandom(state) * 25); // 55..79 — a hopeful city
        state.wealth[i] = 800 + Math.floor(nextRandom(state) * 6400); // ₦800..₦7,199 pocket index
        // morning: most of the city is already hustling or heading to market
        const ar = nextRandom(state);
        state.activity[i] = ar < 0.42 ? 1 : ar < 0.72 ? 2 : ar < 0.86 ? 0 : ar < 0.95 ? 4 : 3;
    }
    return state;
}
function stepCrowd(state, pulse) {
    const floodActive = pulse.weather === 'flood' || pulse.floodLevel >= 0.35;
    const marketHot = pulse.marketMult >= 1.08;
    const festival = pulse.festival !== null;
    const raining = pulse.weather === 'rain' || pulse.weather === 'storm';
    for(let i = 0; i < state.count; i++){
        // --- THE FLOOD LAW: the low city walks to the high ground ---
        if (floodActive) {
            const here = state.street[i];
            const low = LOW_DISTRICTS.indexOf(here) !== -1;
            if (low && nextRandom(state) < 0.55) {
                // deterministic pick from the high roster
                state.street[i] = HIGH_DISTRICTS[Math.floor(nextRandom(state) * HIGH_DISTRICTS.length) % HIGH_DISTRICTS.length];
                state.activity[i] = 5; // shelter
                state.mood[i] = Math.max(0, state.mood[i] - 8);
            } else if (!low && nextRandom(state) < 0.04) {
                // a few brave hearts drift back down as the water breathes
                state.street[i] = LOW_DISTRICTS[Math.floor(nextRandom(state) * LOW_DISTRICTS.length) % LOW_DISTRICTS.length];
            }
        } else if (state.activity[i] === 5) {
            // the water gone: the sheltered go back to work
            state.activity[i] = nextRandom(state) < 0.6 ? 1 : 2;
        }
        // --- THE MARKET LAW: liquidity pulls the crowd to the belts ---
        if (marketHot && !floodActive) {
            const ar = nextRandom(state);
            if (ar < 0.12) {
                state.street[i] = MARKET_DISTRICTS[Math.floor(nextRandom(state) * MARKET_DISTRICTS.length) % MARKET_DISTRICTS.length];
                state.activity[i] = 2;
            }
        }
        // --- THE FESTIVAL LAW: the whole city lifts (M10's mood dividend) ---
        if (festival && nextRandom(state) < 0.2) {
            state.mood[i] = Math.min(100, state.mood[i] + 3);
            if (nextRandom(state) < 0.15) state.activity[i] = 4; // football/crowd joy
        }
        // --- THE RAIN LAW: storms press the open-air moods down ---
        if (raining && nextRandom(state) < 0.1) {
            state.mood[i] = Math.max(0, state.mood[i] - 2);
            if (pulse.weather === 'storm' && nextRandom(state) < 0.12) state.activity[i] = 0;
        }
        // --- THE WEALTH LAW: pockets follow the day's ONE liquidity channel ---
        const drift = Math.round((pulse.marketMult - 1) * 220);
        if (drift !== 0) {
            const w = state.wealth[i] + drift;
            state.wealth[i] = Math.max(0, Math.min(65535, w));
        }
        // --- THE MEAN-REVERT LAW: moods breathe back to the city's baseline ---
        if (nextRandom(state) < 0.06) {
            const target = floodActive ? 42 : festival ? 74 : 62;
            state.mood[i] = state.mood[i] + Math.round((target - state.mood[i]) * 0.25);
        }
    }
    state.day = pulse.day;
}
function crowdAggregate(state) {
    const n = NATION_DISTRICTS.length;
    const pop = new Array(n).fill(0);
    const mood = new Array(n).fill(0);
    const wealth = new Array(n).fill(0);
    const acts = new Array(n * CROWD_ACTIVITIES.length).fill(0);
    let cityMood = 0;
    let cityWealth = 0;
    for(let i = 0; i < state.count; i++){
        const d = state.street[i];
        pop[d]++;
        mood[d] += state.mood[i];
        wealth[d] += state.wealth[i];
        acts[d * CROWD_ACTIVITIES.length + state.activity[i]]++;
        cityMood += state.mood[i];
        cityWealth += state.wealth[i];
    }
    const districts = NATION_DISTRICTS.map((id, d)=>{
        let topA = 0;
        let topI = 0;
        for(let a = 0; a < CROWD_ACTIVITIES.length; a++){
            const c = acts[d * CROWD_ACTIVITIES.length + a];
            if (c > topA) {
                topA = c;
                topI = a;
            }
        }
        return {
            id,
            pop: pop[d],
            mood: pop[d] > 0 ? Math.round(mood[d] / pop[d]) : 0,
            wealth: pop[d] > 0 ? Math.round(wealth[d] / pop[d]) : 0,
            top: CROWD_ACTIVITIES[topI]
        };
    });
    return {
        tick: state.tick,
        day: state.day,
        total: state.count,
        avgMood: state.count > 0 ? Math.round(cityMood / state.count) : 0,
        avgWealth: state.count > 0 ? Math.round(cityWealth / state.count) : 0,
        districts
    };
}
function hashCrowd(state) {
    let h = 0x811c9dc5;
    const mix = (v)=>{
        h ^= v & 0xff;
        h = Math.imul(h, 0x01000193) >>> 0;
        h ^= v >>> 8 & 0xff;
        h = Math.imul(h, 0x01000193) >>> 0;
    };
    for(let i = 0; i < state.count; i++){
        mix(state.street[i]);
        mix(state.mood[i]);
        mix(state.wealth[i] & 0xff);
        mix(state.wealth[i] >>> 8 & 0xff);
    }
    return h >>> 0;
}
function quietPulse(day = 1) {
    return {
        day,
        weather: 'sunny',
        floodLevel: 0,
        marketMult: 1,
        festival: null
    };
}
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "LOW_DISTRICTS$NATION_DISTRICTS.reduce");
__turbopack_context__.k.register(_c1, "LOW_DISTRICTS");
__turbopack_context__.k.register(_c2, "HIGH_DISTRICTS$NATION_DISTRICTS.reduce");
__turbopack_context__.k.register(_c3, "HIGH_DISTRICTS");
__turbopack_context__.k.register(_c4, "MARKET_DISTRICTS$NATION_DISTRICTS.reduce");
__turbopack_context__.k.register(_c5, "MARKET_DISTRICTS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/workers/nation.worker.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * M20 — THE NATION WORKER
 * -------------------------
 * The off-thread half of the crowd sim. Owns NOTHING but the kernel
 * and its own 2-second heartbeat — no store, no DOM, no three.js.
 * Speaks three messages:
 *   {type:'init', seed, count, pulse}  → build the city
 *   {type:'pulse', pulse}              → the day's world facts
 *   {type:'stop'}                      → the quiet exit
 * and posts exactly one shape back: {type:'snapshot', snapshot} —
 * the small aggregate, never a per-NPC array.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation-sim.ts [app-client] (ecmascript)");
;
let state = null;
let pulse;
let timer = null;
function tick() {
    if (!state) return;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stepCrowd"])(state, pulse);
    self.postMessage({
        type: 'snapshot',
        snapshot: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["crowdAggregate"])(state)
    });
}
self.onmessage = (ev)=>{
    const data = ev.data;
    if (data.type === 'init') {
        state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrowdState"])(data.seed ?? 20261017, data.count ?? 10_000);
        pulse = data.pulse ?? {
            day: 1,
            weather: 'sunny',
            floodLevel: 0,
            marketMult: 1,
            festival: null
        };
        if (timer) clearInterval(timer);
        tick(); // the first snapshot is never late
        timer = setInterval(tick, 2000);
    } else if (data.type === 'pulse' && data.pulse) {
        pulse = data.pulse;
    } else if (data.type === 'stop') {
        if (timer) clearInterval(timer);
        timer = null;
        state = null;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_game_5bc749c1._.js.map