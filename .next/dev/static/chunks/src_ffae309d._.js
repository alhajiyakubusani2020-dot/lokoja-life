(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/game/systems/biz.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Business System (M3 — OWN THE CITY)
 * --------------------------------------------------
 * Pure, deterministic, UI-agnostic rules for the player's businesses.
 * Every shop sits at a real Lokoja location, earns into a till the player
 * must SHOW UP to empty, and plugs into the M2 civic mesh:
 *   - Kpata/Food-Strip shops follow that market's DAILY multiplier (the same
 *     engine that moves meal prices) — market days are your discount days
 *     AND your busy days.
 *   - Non-market shops (Ganaja kiosk, motor-park okada stand) wobble inside
 *     a small seeded daily band instead.
 *   - Reputation buys customers: +1% income per 100 rep above 500 (capped).
 *   - Every fridge you own loads the NEPA meter (config: BIZ.nepaLoadPerBiz).
 *   - Collected income flows through addMoney → the ledger → stats.totalEarned,
 *     so KGIRS assesses business income with ZERO extra tax code.
 *
 * Day rolls run inside the store's commitCivicDays (same seam as bills and
 * taxes) so sleeping, travelling and time-skips all accrue exactly once.
 */ __turbopack_context__.s([
    "BIZ_TYPES",
    ()=>BIZ_TYPES,
    "BIZ_TYPE_IDS",
    ()=>BIZ_TYPE_IDS,
    "bizAtLocation",
    ()=>bizAtLocation,
    "bizCollect",
    ()=>bizCollect,
    "bizDayMult",
    ()=>bizDayMult,
    "bizDayRoll",
    ()=>bizDayRoll,
    "bizDef",
    ()=>bizDef,
    "bizGeneratorFuelFor",
    ()=>bizGeneratorFuelFor,
    "bizIncomeFor",
    ()=>bizIncomeFor,
    "bizLevelMult",
    ()=>bizLevelMult,
    "bizOwned",
    ()=>bizOwned,
    "bizRepBonus",
    ()=>bizRepBonus,
    "bizUpgradeCost",
    ()=>bizUpgradeCost,
    "freshBusiness",
    ()=>freshBusiness,
    "hasGenerator",
    ()=>hasGenerator,
    "hasPowerBackup",
    ()=>hasPowerBackup,
    "staffCapFor",
    ()=>staffCapFor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
;
;
;
const BIZ_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].types;
const BIZ_TYPE_IDS = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].types);
function bizDef(typeId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].types[typeId] ?? null;
}
function bizAtLocation(locationId) {
    for (const [typeId, def] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].types)){
        if (def.locationId === locationId) return {
            typeId,
            def
        };
    }
    return null;
}
function freshBusiness(typeId, day) {
    return {
        id: typeId,
        typeId,
        level: 1,
        accrued: 0,
        lastAccrualDay: day,
        openedDay: day,
        lastCollectedAt: null,
        staff: 0,
        upgrades: []
    };
}
function staffCapFor(level) {
    return Math.min(Math.max(1, Math.floor(level)), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].maxLevel);
}
function hasPowerBackup(upgrades) {
    return upgrades.includes('generator') || upgrades.includes('solar');
}
function hasGenerator(upgrades) {
    return upgrades.includes('generator');
}
function bizRepBonus(reputation) {
    const over = Math.max(0, reputation - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].repBonusBase);
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].repBonusCap, over / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].repBonusDivisor / 100);
}
function bizLevelMult(level) {
    const lvl = Math.min(Math.max(1, Math.floor(level)), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].maxLevel);
    return 1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].levelIncomeStep * (lvl - 1);
}
function bizDayMult(typeId, day, civic) {
    const def = bizDef(typeId);
    if (!def) return 1;
    if (def.marketId) {
        const rolled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketForDay"])(civic, day);
        let mult = rolled.market.prices[def.marketId] ?? 1;
        if (rolled.market.marketDay) mult *= 1 / 0.9; // market day: cheap goods, BUSY shop
        return mult;
    }
    const u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["civicHash"])('biz', typeId, day) % 1000 / 1000;
    return 1 - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].wobbleBand + u * 2 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].wobbleBand;
}
function bizIncomeFor(typeId, level, day, civic, reputation, opts) {
    const def = bizDef(typeId);
    if (!def) return 0;
    const staff = Math.max(0, Math.floor(opts?.staff ?? 0));
    const upgrades = opts?.upgrades ?? [];
    const chaos = opts?.chaos ?? null;
    const dark = civic.nepa.shedding && !hasPowerBackup(upgrades);
    const blackedOut = chaos ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blackoutAt"])(chaos, def.locationId, day) : false;
    const posBoost = chaos && def.pos === true && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScarcityDay"])(day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].posBoostMult : 1;
    const staffMult = 1 + staff * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].staffIncomeBoost;
    // M11 — the flood crush folds with the grid laws: the WORSE water wins
    // (a generator keeps the lights on but cannot keep the river out)
    const powerMult = blackedOut && !hasPowerBackup(upgrades) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].blackoutIncomeFactor : dark ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].sheddingIncomeFactor : 1;
    const waterMult = Math.min(powerMult === 1 ? 1 : powerMult, opts?.floodFactor ?? 1);
    return Math.max(0, Math.round(def.baseIncome * bizLevelMult(level) * bizDayMult(typeId, day, civic) * (1 + bizRepBonus(reputation)) * staffMult * waterMult * posBoost));
}
function bizGeneratorFuelFor(typeId, day, upgrades, chaos) {
    if (!chaos || !hasGenerator(upgrades)) return 0;
    const def = bizDef(typeId);
    if (!def) return 0;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blackoutAt"])(chaos, def.locationId, day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].generatorFuelPerDay : 0;
}
function bizUpgradeCost(typeId, level) {
    const def = bizDef(typeId);
    if (!def || level >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].maxLevel) return null;
    return Math.round(def.buyCost * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].upgradeCostMult * level);
}
function bizDayRoll(list, prevDay, newDay, civic, reputation, chaos, floodFactorFor) {
    const earned = {};
    let total = 0;
    const next = list.map((biz)=>{
        if (newDay <= prevDay || newDay <= biz.lastAccrualDay) return biz;
        const from = Math.max(prevDay + 1, biz.lastAccrualDay + 1);
        const cappedFrom = Math.max(from, newDay - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].accrualCapDays + 1);
        const wages = Math.max(0, biz.staff) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].staffWagePerDay;
        let sum = 0;
        for(let day = cappedFrom; day <= newDay; day++){
            const gross = bizIncomeFor(biz.typeId, biz.level, day, civic, reputation, {
                staff: biz.staff,
                upgrades: biz.upgrades,
                chaos,
                floodFactor: floodFactorFor ? floodFactorFor(bizDef(biz.typeId)?.locationId ?? '', day) : 1
            });
            const genFuel = bizGeneratorFuelFor(biz.typeId, day, biz.upgrades, chaos ?? null);
            sum += Math.max(0, gross - wages - genFuel);
        }
        // advance the accrual marker even on a wiped-out day (idempotence law)
        const marked = {
            ...biz,
            lastAccrualDay: newDay
        };
        if (sum <= 0) return marked;
        earned[biz.typeId] = (earned[biz.typeId] ?? 0) + sum;
        total += sum;
        return {
            ...marked,
            accrued: biz.accrued + sum
        };
    });
    return {
        next,
        earned,
        total
    };
}
function bizCollect(biz, day) {
    const amount = Math.max(0, Math.round(biz.accrued));
    return {
        next: {
            ...biz,
            accrued: 0,
            lastCollectedAt: Date.now(),
            lastAccrualDay: day
        },
        amount
    };
}
function bizOwned(list, typeId) {
    return list.find((b)=>b.typeId === typeId) ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/flags.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * M20 — THE FEATURE FLAGS (the ops switches)
 * -------------------------------------------
 * Device-level ops prefs — they live OUTSIDE the save on their own
 * storage key (the fortress rule: the ops books live beside the life,
 * not inside it). Every M20 system reads its flag through here, so a
 * bad rollout can be darkened from one place without a rebuild.
 *
 * THE DEFAULT-DARK LAW: anything that costs the player anything
 * (telemetry) defaults OFF. Anything that is pure spectacle the
 * player already owns (the crowd sim) defaults ON but is one toggle
 * from dark.
 *
 * THE DEFENSIVE STORAGE LAW: storage is probed, never assumed —
 * private-mode browsers and Bun both read the honest defaults.
 */ __turbopack_context__.s([
    "FLAG_DEFAULTS",
    ()=>FLAG_DEFAULTS,
    "previousDeploy",
    ()=>previousDeploy,
    "readFlags",
    ()=>readFlags,
    "readManifest",
    ()=>readManifest,
    "recordDeploy",
    ()=>recordDeploy,
    "setFlag",
    ()=>setFlag
]);
const FLAG_DEFAULTS = {
    crowdSim: true,
    workerSim: true,
    /** has the player been offered the telemetry choice (the ask itself, not the answer) */ telemetryAsk: false,
    musicDefault: false
};
const FLAGS_KEY = 'lokoja-life:flags';
const MANIFEST_KEY = 'lko:sw-manifest';
const CAP_MANIFEST = 5;
/** Probe storage the way save.ts does — a refused store reads defaults. */ function flagsStore() {
    try {
        const probe = '__lko_flags_probe__';
        window.localStorage.setItem(probe, '1');
        window.localStorage.removeItem(probe);
        return window.localStorage;
    } catch  {
        return null;
    }
}
function readFlags() {
    const out = {
        ...FLAG_DEFAULTS
    };
    const store = flagsStore();
    if (!store) return out;
    try {
        const raw = store.getItem(FLAGS_KEY);
        if (!raw) return out;
        const parsed = JSON.parse(raw);
        for (const k of Object.keys(FLAG_DEFAULTS)){
            const v = parsed[k];
            if (typeof v === 'boolean') out[k] = v;
        }
    } catch  {
    /* a torn flags blob is just defaults — the game never gates on garbage */ }
    return out;
}
function setFlag(key, value) {
    const next = readFlags();
    next[key] = value;
    const store = flagsStore();
    if (store) {
        try {
            store.setItem(FLAGS_KEY, JSON.stringify(next));
        } catch  {
        /* storage full — the flags stay session-honest, the save never blocks */ }
    }
    return next;
}
function recordDeploy(version) {
    const v = String(version ?? '').slice(0, 24);
    if (!v) return readManifest();
    const rows = readManifest();
    if (rows[0]?.version === v) return rows // same deploy, no re-record
    ;
    const next = [
        {
            version: v,
            at: Date.now()
        },
        ...rows.filter((r)=>r.version !== v)
    ].slice(0, CAP_MANIFEST);
    const store = flagsStore();
    if (store) {
        try {
            store.setItem(MANIFEST_KEY, JSON.stringify(next));
        } catch  {
        /* the manifest is a gift, never a gate */ }
    }
    return next;
}
function readManifest() {
    const store = flagsStore();
    if (!store) return [];
    try {
        const raw = store.getItem(MANIFEST_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((r)=>!!r && typeof r.version === 'string').slice(0, CAP_MANIFEST);
    } catch  {
        return [];
    }
}
function previousDeploy() {
    const rows = readManifest();
    return rows.length >= 2 ? rows[1] : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/game/workers/nation.worker.ts (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/nation.worker.9a20a346.ts");}),
"[project]/src/game/workers/nation.worker.ts [app-client] (ecmascript, worker loader)", ((__turbopack_context__) => {

__turbopack_context__.v(__turbopack_context__.b([
  "static/chunks/src_game_5bc749c1._.js",
  "static/chunks/src_game_workers_nation_worker_ts_b3f8fcd6._.js",
  "static/chunks/turbopack-src_game_workers_nation_worker_ts_1ab33372._.js"
]));
}),
"[project]/src/game/systems/nation-bridge.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__nationBridgeForTests",
    ()=>__nationBridgeForTests,
    "startNationSim",
    ()=>startNationSim,
    "stopNationSim",
    ()=>stopNationSim
]);
/**
 * M20 — THE NATION BRIDGE (the worker's door)
 * --------------------------------------------
 * Owns the crowd sim's lifecycle for the store:
 *  - worker path: a real Web Worker steps the kernel off-thread and
 *    posts the small CrowdSnapshot aggregate every 2s;
 *  - fallback path (no Worker / construction refused / the workerSim
 *    flag dark): the SAME kernel steps on the main thread inside a
 *    2s setInterval — the kernel is a few ms for 10k NPCs, the same
 *    time-slice doctrine the terrain already proved. The UI never
 *    stutters either way, and the LAWS ARE THE LAWS in both paths
 *    (the suite runs the fallback path directly under Bun).
 *
 * THE BOUNDARY LAW: whatever the path, only crowdAggregate output
 * crosses into the store — per-NPC typed arrays never leave this
 * module's closure. The dashboard reads numbers, never people.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation-sim.ts [app-client] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("src/game/systems/nation-bridge.ts")}`;
    }
};
;
const CADENCE_MS = 2000;
let active = null;
/** The main-thread fallback step — the same kernel, honest and small. */ function mainStep() {
    if (!active || active.kind !== 'main' || !active.state) return;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stepCrowd"])(active.state, active.pulse);
    const snap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["crowdAggregate"])(active.state);
    active.last = snap;
    if (active.onSnapshot) active.onSnapshot(snap);
}
function startNationSim(opts) {
    stopNationSim();
    const pulse = opts.initialPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["quietPulse"])(1);
    const onSnapshot = opts.onSnapshot ?? null;
    // --- the worker path (REAL BROWSER ONLY, flag-allowed, construction guarded) ---
    // THE ENVIRONMENT LAW: Bun/Node implement Worker too, but a worker there
    // outlives the test process and hangs the suite exit. The worker path is
    // for the browser (document exists); every other runtime takes the
    // time-sliced main path — the same kernel, the same laws, honestly.
    const isRealBrowser = typeof document !== 'undefined';
    if (opts.allowWorker !== false && isRealBrowser && typeof Worker !== 'undefined') {
        try {
            const worker = new Worker(__turbopack_context__.r("[project]/src/game/workers/nation.worker.ts [app-client] (ecmascript, worker loader)"));
            const bridge = {
                kind: 'worker',
                engine: worker,
                timer: null,
                state: null,
                last: null,
                pulse,
                onSnapshot
            };
            worker.onmessage = (ev)=>{
                const data = ev.data;
                if (data && data.type === 'snapshot' && data.snapshot && active === bridge) {
                    bridge.last = data.snapshot;
                    if (onSnapshot) onSnapshot(data.snapshot);
                }
            };
            worker.postMessage({
                type: 'init',
                seed: opts.seed,
                count: opts.count,
                pulse
            });
            active = bridge;
            return {
                alive: ()=>active === bridge,
                path: ()=>'worker',
                pulse: (p)=>{
                    bridge.pulse = p;
                    worker.postMessage({
                        type: 'pulse',
                        pulse: p
                    });
                },
                snapshot: ()=>active === bridge ? bridge.last : null,
                stop: stopNationSim
            };
        } catch  {
        // construction refused — fall through to the main path, honestly
        }
    }
    // --- the main-thread path (tests, odd browsers, flag-dark workers) ---
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrowdState"])(opts.seed, opts.count);
    const main = {
        kind: 'main',
        engine: 'main-loop',
        timer: null,
        state,
        last: null,
        pulse,
        onSnapshot
    };
    main.timer = setInterval(mainStep, CADENCE_MS);
    // THE SUITE LAW: under Bun/Node the interval must never hold a test
    // process open — unref it where the API exists (browsers ignore this).
    const t = main.timer;
    if (typeof t.unref === 'function') t.unref();
    active = main;
    // first aggregate immediately — the dashboard is never empty on boot
    mainStep();
    return {
        alive: ()=>active === main,
        path: ()=>'main',
        pulse: (p)=>{
            if (active === main) main.pulse = p;
        },
        snapshot: ()=>active === main ? main.last : null,
        stop: stopNationSim
    };
}
function stopNationSim() {
    if (!active) return;
    if (active.timer) clearInterval(active.timer);
    if (active.kind === 'worker' && active.engine !== 'main-loop') {
        try {
            ;
            active.engine.terminate();
        } catch  {
        /* a dead worker is already stopped */ }
    }
    active = null;
}
function __nationBridgeForTests() {
    if (!active) return {
        kind: null,
        hasState: false
    };
    return {
        kind: active.kind,
        hasState: active.state !== null
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/needs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyNeedsDelta",
    ()=>applyNeedsDelta,
    "applySlotDecay",
    ()=>applySlotDecay,
    "canDoStrenuous",
    ()=>canDoStrenuous,
    "clampNeed",
    ()=>clampNeed,
    "clampNeeds",
    ()=>clampNeeds,
    "conditionSummary",
    ()=>conditionSummary
]);
/**
 * LOKOJA LIFE — Needs Engine
 * ---------------------------
 * Pure functions that apply changes to the four player needs.
 * The store calls these; UI never mutates needs directly.
 * Design rule: consequences should push the player to manage needs
 * without making the game frustrating.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
;
function clampNeed(value) {
    return Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].min, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].max, value));
}
function clampNeeds(needs) {
    return {
        health: clampNeed(needs.health),
        energy: clampNeed(needs.energy),
        hunger: clampNeed(needs.hunger),
        mood: clampNeed(needs.mood)
    };
}
function applyNeedsDelta(current, delta) {
    const merged = {
        health: current.health + (delta.health ?? 0),
        energy: current.energy + (delta.energy ?? 0),
        hunger: current.hunger + (delta.hunger ?? 0),
        mood: current.mood + (delta.mood ?? 0)
    };
    // --- built-in consequences ---
    if (merged.hunger <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].hungerCritical) {
        merged.mood -= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].hungryMoodDrain;
    }
    if (merged.hunger <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].min) {
        merged.health -= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].starvingHealthDrain;
    }
    return clampNeeds(merged);
}
function canDoStrenuous(needs) {
    return needs.energy > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].energyCritical;
}
function applySlotDecay(current, slots, decayMult = 1) {
    const n = Math.max(0, Math.floor(slots));
    if (n === 0) return current;
    const m = Math.max(0, decayMult);
    return applyNeedsDelta(current, {
        hunger: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].decay.hunger * n * m,
        energy: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].decay.energy * n * m,
        mood: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].decay.mood * n * m,
        health: -(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].decay.health ?? 0) * n * m
    });
}
function conditionSummary(needs) {
    if (needs.health <= 15) return {
        text: 'You need to see a doctor…',
        tone: 'bad'
    };
    if (needs.hunger <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].hungerCritical) return {
        text: 'Your belle is empty. Find food!',
        tone: 'bad'
    };
    if (needs.energy <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].energyCritical) return {
        text: 'You are tired. Rest small.',
        tone: 'bad'
    };
    if (needs.mood <= 25) return {
        text: 'You dey feel down. Do something fun.',
        tone: 'ok'
    };
    if (needs.hunger >= 80 && needs.energy >= 80 && needs.mood >= 80) {
        return {
            text: 'You are glowing today! 🔥',
            tone: 'good'
        };
    }
    return {
        text: 'You dey okay. Keep pushing.',
        tone: 'ok'
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/progression.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addXp",
    ()=>addXp,
    "formatNaira",
    ()=>formatNaira,
    "nextReputationTier",
    ()=>nextReputationTier,
    "reputationTier",
    ()=>reputationTier,
    "skillCap",
    ()=>skillCap,
    "xpToNextLevel",
    ()=>xpToNextLevel
]);
/**
 * LOKOJA LIFE — Progression System
 * ---------------------------------
 * XP curve, level-ups and reputation tiers.
 * Pure functions so they are trivially testable and reusable
 * by jobs, hustles, missions and events in later stages.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
;
function xpToNextLevel(level) {
    return Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].xpBase * Math.pow(level, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].xpGrowth));
}
function addXp(xp, level, amount) {
    let newLevel = level;
    let newXp = xp + Math.max(0, amount);
    let leveledUp = false;
    let levelsGained = 0;
    while(newLevel < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].maxLevel && newXp >= xpToNextLevel(newLevel)){
        newXp -= xpToNextLevel(newLevel);
        newLevel += 1;
        leveledUp = true;
        levelsGained += 1;
    }
    if (newLevel >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].maxLevel) {
        newXp = Math.min(newXp, xpToNextLevel(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].maxLevel) - 1);
    }
    return {
        xp: newXp,
        level: newLevel,
        leveledUp,
        levelsGained
    };
}
function skillCap(level) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapBase + level * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapPerLevel;
}
function reputationTier(reputation) {
    let current = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"][0];
    for (const tier of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"]){
        if (reputation >= tier.threshold) current = tier;
    }
    return current;
}
function nextReputationTier(reputation) {
    for (const tier of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"]){
        if (reputation < tier.threshold) {
            return {
                tier,
                remaining: tier.threshold - reputation
            };
        }
    }
    return null;
}
function formatNaira(amount) {
    const sign = amount < 0 ? '-' : '';
    const abs = Math.abs(Math.round(amount));
    return `${sign}₦${abs.toLocaleString('en-NG')}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/shared.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * SHARED STORE INTERNALS — moved VERBATIM from useGameStore.ts (PH2.5 split).
 * Source lines: 648-1243. The module-level mutable state (autosave timer,
 * id counters, the nation bridge, the self-referencing store ref) and the
 * cross-domain helpers (arrival, share, civic day-roll, autosave, pull gate)
 * live here so every slice imports ONE internals module (no slice↔slice
 * cycles). The composition file binds useGameStoreRef after create().
 */ __turbopack_context__.s([
    "LEDGER_CAP",
    ()=>LEDGER_CAP,
    "applyArrival",
    ()=>applyArrival,
    "bumpOnboarding",
    ()=>bumpOnboarding,
    "clearNationBridge",
    ()=>clearNationBridge,
    "cloudSaveGate",
    ()=>cloudSaveGate,
    "commitCivicDays",
    ()=>commitCivicDays,
    "dayTally",
    ()=>dayTally,
    "nationBridge",
    ()=>nationBridge,
    "nextNotificationId",
    ()=>nextNotificationId,
    "nextPulseId",
    ()=>nextPulseId,
    "payStreetCredit",
    ()=>payStreetCredit,
    "scheduleAutosave",
    ()=>scheduleAutosave,
    "shareText",
    ()=>shareText,
    "slotDecay",
    ()=>slotDecay,
    "startNationBridge",
    ()=>startNationBridge,
    "useGameStoreRef",
    ()=>useGameStoreRef,
    "warnSaveFailure",
    ()=>warnSaveFailure
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/biz.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/citypack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/flags.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation-bridge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/pulse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/save.ts [app-client] (ecmascript)");
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
;
let saveTimer = null;
/** F2 — a failed disk write announces itself ONCE per session (no spam wall). */ let quotaWarned = false;
let notificationId = 0;
let pulseId = 0;
function applyArrival(set, get, code, m, opts) {
    const world = get().world;
    if (!world) return;
    const pl = get().cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])();
    set({
        world: {
            ...world,
            currentLocation: m.locId
        },
        pendingArrival: null,
        cityPulse: {
            ...pl,
            arrivals: [
                ...pl.arrivals,
                code
            ].slice(-__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PULSE"].arrivalCap),
            stats: {
                ...pl.stats,
                arrivalsIn: pl.stats.arrivalsIn + 1
            }
        }
    });
    try {
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    } catch  {}
    if (!opts?.silent) {
        const place = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][m.locId]?.name ?? m.locId;
        get().notify({
            icon: '📍',
            text: `You land for ${place} — ${m.name}'s postcard, Day ${m.day}. No fare.`,
            tone: 'good'
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('arrival'); // M19 — the postcard buzzes in the pocket
    }
    scheduleAutosave(get);
}
function dayTally(transactions, day) {
    const today = transactions.filter((t)=>t.day === day);
    const earned = today.filter((t)=>t.amount > 0).reduce((s, t)=>s + t.amount, 0);
    const cats = new Set();
    const ordered = [];
    for (const t of today){
        if (!cats.has(t.category)) {
            cats.add(t.category);
            ordered.push(t.category);
        }
    }
    const CATS = [
        'job',
        'hustle',
        'transport',
        'shop',
        'tip',
        'other',
        'bank',
        'fun'
    ];
    const trail = ordered.slice(-3).map((c)=>Math.max(0, CATS.indexOf(c)));
    while(trail.length < 3)trail.push(0);
    return {
        earned,
        moves: today.length,
        trail
    };
}
async function shareText(get, title, body, url) {
    const text = `${title}\n${body}\n${url}`;
    let shared = false;
    try {
        if (typeof navigator !== 'undefined' && 'share' in navigator) {
            await navigator.share({
                title: 'Lokoja Life',
                text,
                url
            });
            shared = true;
        }
    } catch  {}
    if (!shared) {
        try {
            await navigator.clipboard.writeText(text);
            shared = true;
            get().notify({
                icon: '📋',
                text: 'Copied — paste am for WhatsApp.',
                tone: 'good'
            });
        } catch  {
            return {
                ok: false,
                why: 'share-refused'
            };
        }
    }
    return {
        ok: shared
    };
}
function payStreetCredit(get, set) {
    const p = get().player;
    const world = get().world;
    if (!p || !world) return;
    // the share book counts every real share — the credit only pays once a day
    const pl0 = get().cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])();
    set({
        cityPulse: {
            ...pl0,
            stats: {
                ...pl0.stats,
                shares: pl0.stats.shares + 1
            }
        }
    });
    const key = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PULSE"].shareCooldownKey;
    if (p.cooldowns[key] === world.day) return;
    get().giveReward({
        reputation: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PULSE"].shareStreetCredit
    }, {
        label: 'Street credit — shared the city',
        category: 'other'
    });
    set({
        player: {
            ...get().player,
            cooldowns: {
                ...get().player.cooldowns,
                [key]: world.day
            }
        }
    });
    get().notify({
        icon: '🌆',
        text: `Street credit +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PULSE"].shareStreetCredit} — the city hears you.`,
        tone: 'good'
    });
}
const LEDGER_CAP = 50;
function slotDecay(get, needs, slots) {
    const chill = get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1;
    const elder = get().settings.elder ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ELDER"].decayMult : 1;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])(needs, slots, Math.min(chill, elder));
}
function bumpOnboarding(get, set, step) {
    const ob = get().onboarding;
    if (ob.done.includes(step)) return;
    const done = [
        ...ob.done,
        step
    ];
    set({
        onboarding: {
            ...ob,
            done
        }
    });
    if (done.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GOALS"].onboardingSteps.length && !get().onboarding.rewarded) {
        set({
            onboarding: {
                ...get().onboarding,
                rewarded: true
            }
        });
        get().addMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GOALS"].onboardingReward, {
            label: 'Street Certified — onboarding complete',
            category: 'tip'
        });
        get().notify({
            icon: '🏅',
            text: `STREET CERTIFIED! You don learn the ropes — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GOALS"].onboardingReward)} don land.`,
            tone: 'good'
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
    }
}
/** Pure: roll the civic mesh + the chaos engine + the calendar + the rivers
 *  forward day by day (assessments land on exact days). M6 — the NEW day's
 *  weather rides in so the market roll folds weather stress. M8 — the chaos
 *  roll runs in the SAME loop and its liquidity fold (crunch / payout) rides
 *  into the SAME prices. M10 — the calendar's festival folds ride the SAME
 *  channel too, and the year's parties narrate themselves at the day
 *  crossings. M11 — the river rolls in the SAME loop: the surge lifts every
 *  price through the SAME channel, the bowls take yesterday's crossings and
 *  the deep water wakes the cold-room rescue. */ function civicRollForDays(civic, chaos, calendar, rivers, housing, japa, totalEarned, prevDay, newDay, bizCount = 0, solarCount = 0, weather, liquidityMultOverride, chill = false) {
    let cur = civic;
    let curChaos = chaos;
    let curCal = calendar;
    let curRiv = rivers;
    let curHou = housing;
    let curJap = japa;
    const agg = {
        nepaPosted: 0,
        nepaShed: false,
        taxAssessed: 0,
        warrantIssued: false,
        tipsResolved: [],
        tipReward: 0,
        blowoutZone: null,
        outageFixed: null,
        scarcityDay: false,
        payoutDay: false,
        festivalMorning: null,
        weddingToday: null,
        pavingDone: null,
        pavingStalled: null,
        regattaResult: null,
        floodedZone: null,
        drainedZone: null,
        rescueWake: null,
        rescueDone: null,
        riverDamp: false,
        riverRelief: false,
        rentPosted: null,
        wahalaArrived: null,
        lateNotice: false,
        remittance: false
    };
    for(let d = prevDay + 1; d <= newDay; d++){
        // chaos first: today's grid + naira mood decide the market's liquidity
        const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chaosDayRoll"])(curChaos, d, weather ?? 'sunny');
        curChaos = c.next;
        if (c.blowout) agg.blowoutZone = c.blowout.zoneId;
        if (c.fixed) agg.outageFixed = c.fixed;
        agg.scarcityDay = agg.scarcityDay || c.scarcity;
        agg.payoutDay = agg.payoutDay || c.payout;
        // M10 — the year turns: paving lifecycle, regatta stakes, festivals
        const cal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calendarDayRoll"])(curCal, d);
        curCal = cal.next;
        if (cal.pavingDone) agg.pavingDone = cal.pavingDone;
        if (cal.pavingStalled) agg.pavingStalled = cal.pavingStalled;
        if (cal.regattaResult) agg.regattaResult = cal.regattaResult;
        const todayFestival = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["festivalForDay"])(d);
        if (todayFestival) agg.festivalMorning = todayFestival;
        const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["weddingForCycle"])(d);
        if (wedding.isToday) agg.weddingToday = wedding;
        // M11 — the river turns: bowls, rescue, the flood narrations
        const riv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["riversDayRoll"])(curRiv, d);
        curRiv = riv.next;
        if (riv.flooded) agg.floodedZone = riv.flooded.zoneId;
        if (riv.drained) agg.drainedZone = riv.drained.zoneId;
        if (riv.rescueWake) agg.rescueWake = riv.rescueWake.zoneId;
        if (riv.rescueDone) agg.rescueDone = riv.rescueDone.zoneId;
        agg.riverDamp = agg.riverDamp || riv.damp;
        agg.riverRelief = agg.riverRelief || riv.relief;
        // M12 — the ladder turns: the rent book, the landlord, the remittance
        const hou = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["housingDayRoll"])(curHou, d);
        curHou = hou.next;
        if (hou.rentPosted) agg.rentPosted = hou.rentPosted;
        if (hou.wahalaArrived) agg.wahalaArrived = hou.wahalaArrived;
        agg.lateNotice = agg.lateNotice || hou.lateNotice;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["remittanceLands"])(curJap, d)) {
            curJap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["remittanceApply"])(curJap, d);
            agg.remittance = true;
        }
        // the water lifts the SAME roll the weather, chaos and calendar ride
        const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["civicDayRoll"])(cur, totalEarned, d, bizCount, solarCount, weather, liquidityMultOverride ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liquidityMultFor"])(d) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calendarMarketMult"])(d) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["riverMarketMult"])(d), chill);
        cur = r.next;
        agg.nepaPosted += r.nepaPosted;
        agg.nepaShed = agg.nepaShed || r.nepaShed;
        agg.taxAssessed += r.taxAssessed;
        agg.warrantIssued = agg.warrantIssued || r.warrantIssued;
        agg.tipsResolved = [
            ...agg.tipsResolved,
            ...r.tipsResolved
        ];
        agg.tipReward += r.tipReward;
    }
    return {
        civic: cur,
        chaos: curChaos,
        calendar: curCal,
        rivers: curRiv,
        housing: curHou,
        japa: curJap,
        agg
    };
}
function commitCivicDays(get, set, prevDay, newDay) {
    const { civic, chaos, calendar, rivers, housing, japa, player, world } = get();
    if (!civic || !player || !world || newDay <= prevDay) return;
    const bizCount = player.businesses.length;
    // M5 — solar shops draw from the sun: their share of the meter load drops
    const solarCount = player.businesses.filter((b)=>b.upgrades.includes('solar')).length;
    // M6 — the NEW day's weather (already set by the clock before this call)
    // folds its market stress into the day's prices
    const newWeather = get().world?.weather;
    // M9 — Chill Mode runs the whole civic roll kinder (2× disco grace, 3× warrant)
    const chill = get().settings.chill;
    const { civic: rolled, chaos: rolledChaos, calendar: rolledCal, rivers: rolledRiv, housing: rolledHou, japa: rolledJap, agg } = civicRollForDays(civic, chaos, calendar, rivers, housing, japa, player.stats.totalEarned, prevDay, newDay, bizCount, solarCount, newWeather, undefined, chill);
    set({
        civic: rolled,
        chaos: rolledChaos,
        calendar: rolledCal,
        rivers: rolledRiv,
        housing: rolledHou,
        japa: rolledJap
    });
    // M20 — the nation's books + the crowd sim ride the SAME day crossing
    for(let d = prevDay + 1; d <= newDay; d++)get().nationPulseDay(d);
    // M3 — the shops earn while the city turns: accrue into each till (market
    // multipliers read the ALREADY-ROLLED civic slice; M8 — the chaos thread
    // prices the dark days and the scarcity harvest). Tax only sees this
    // money when it is collected (addMoney → ledger → totalEarned).
    if (player.businesses.length > 0) {
        // M11 — the flood crush folds with the grid laws: the worse water wins,
        // the rescue trucks soften the saved zones for the rest of the surge-year
        const bizRes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizDayRoll"])(player.businesses, prevDay, newDay, rolled, player.reputation, rolledChaos, (zoneId, day)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["floodBizFactor"])(rolledRiv, zoneId, day));
        if (bizRes.total > 0) {
            const p0 = get().player;
            set({
                player: {
                    ...p0,
                    businesses: bizRes.next
                }
            });
            get().notify({
                icon: '🧺',
                text: `Your shop${player.businesses.length > 1 ? 's' : ''} made ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(bizRes.total)} — go collect am.`,
                tone: 'good'
            });
        } else {
            const p0 = get().player;
            set({
                player: {
                    ...p0,
                    businesses: bizRes.next
                }
            });
        }
    }
    // whistleblower rewards land as honest hustle income (ledger remembers)
    if (agg.tipReward > 0) {
        get().addMoney(agg.tipReward, {
            label: `Whistleblower reward — ${agg.tipsResolved.map((t)=>t.label).join(', ')}`,
            category: 'hustle'
        });
    }
    // the day the light goes stings a little
    if (agg.nepaShed) {
        const p = get().player;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].nepa.sheddingMoodHit
                })
            }
        });
    } // a warrant makes the state learn your name — the wrong way
    if (agg.warrantIssued) {
        get().addReputation(-__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.warrantReputationHit);
    }
    // M8 — chaos narration: the boom, the light, the dry naira, the payout
    if (agg.blowoutZone) {
        const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.blowoutZone]?.name ?? agg.blowoutZone;
        const p = get().player;
        const inZone = world.currentLocation === agg.blowoutZone;
        if (p && inZone) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].fixMood
                })
            }
        });
        get().notify({
            icon: '⚡',
            text: inZone ? `BOOM! Transformer don blow for ${zoneName} — your area don go dark!` : `Transformer don blow for ${zoneName} — the whole area don go dark.`,
            tone: 'bad'
        });
    }
    if (agg.outageFixed) {
        const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.outageFixed.zoneId]?.name ?? agg.outageFixed.zoneId;
        const contributed = agg.outageFixed.fixedBy === 'community';
        const p = get().player;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].fixMood
                })
            }
        });
        if (contributed) get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].fixReputation);
        get().notify({
            icon: '💡',
            text: contributed ? `UP NEPA! Community power don return to ${zoneName} — the street go remember you.` : `UP NEPA! NEPA don repair the ${zoneName} transformer.`,
            tone: 'good'
        });
    }
    if (agg.scarcityDay) {
        get().notify({
            icon: '💸',
            text: 'Cash scarcity today — ATM dey dry, POS agents don increase price, fuel na black market.',
            tone: 'neutral'
        });
    }
    if (agg.payoutDay) {
        get().notify({
            icon: '🐷',
            text: 'Ajo payout day — market traders carry cash today, prices soft small.',
            tone: 'neutral'
        });
    }
    // M10 — the calendar narrates itself: festivals, weddings, streets, stakes
    if (agg.festivalMorning) {
        const f = agg.festivalMorning;
        const p = get().player;
        const mood = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].mood[f.id] ?? 0;
        if (p && mood > 0) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood
                })
            }
        });
        get().notify({
            icon: f.icon,
            text: `${f.name}${f.daysLeft > 1 ? ' (final day)' : ''} — ${f.note}`,
            tone: 'good'
        });
    }
    if (agg.weddingToday) {
        const w = agg.weddingToday;
        const p = get().player;
        const venueName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][w.venueId]?.name ?? w.venueId;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].mood.wedding
                })
            }
        });
        get().notify({
            icon: '💍',
            text: `Wedding today! ${w.couple} don tie knot at ${venueName} — aso-ebi dey Kpata.`,
            tone: 'good'
        });
    }
    if (agg.pavingDone) {
        const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.pavingDone.zoneId]?.name ?? agg.pavingDone.zoneId;
        get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].pavedRep);
        get().notify({
            icon: '🛣️',
            text: `The union don finish paving ${zoneName} — smooth road for the next ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].pavedDays} days!`,
            tone: 'good'
        });
    }
    if (agg.pavingStalled) {
        const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.pavingStalled.zoneId]?.name ?? agg.pavingStalled.zoneId;
        get().notify({
            icon: '🧱',
            text: `The ${zoneName} paving pool never full — the union don carry am go next project.`,
            tone: 'neutral'
        });
    }
    if (agg.regattaResult) {
        const rr = agg.regattaResult;
        if (rr.sponsorWin) {
            get().addMoney(rr.sponsorWin.payout, {
                label: `Regatta sponsor payout — ${rr.sponsorWin.teamId} win the trophy`,
                category: 'hustle'
            });
            get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorWinRep);
            get().notify({
                icon: '🏆',
                text: `${rr.winner} don win the Regatta! Your sponsorship pay ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(rr.sponsorWin.payout)} — the whole shoreline dey call your name.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
        } else if (rr.sponsorLose) {
            get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorLoseRep);
            get().notify({
                icon: '🚤',
                text: `${rr.winner} carry the Regatta trophy. Your crew no win but the street respect the support.`,
                tone: 'neutral'
            });
        }
        if (rr.betWin) {
            get().addMoney(rr.betWin.payout, {
                label: `Regatta bet won — ${rr.betWin.teamId} at ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].betOdds}×`,
                category: 'other'
            });
            get().notify({
                icon: '💸',
                text: `Your bet don land! ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(rr.betWin.payout)} from the shoreline bookie.`,
                tone: 'good'
            });
        } else if (rr.betLose > 0) {
            get().notify({
                icon: '🎲',
                text: `Your boat no win — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(rr.betLose)} stay for the bookie hand. Next year again.`,
                tone: 'bad'
            });
        }
    }
    // M11 — the river narrates itself: the water, the bowls, the damp
    if (agg.floodedZone) {
        const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.floodedZone]?.name ?? agg.floodedZone;
        const p = get().player;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: -2
                })
            }
        });
        get().notify({
            icon: '🌊',
            text: `The Niger don rise — ${zoneName} road don go under water. Canoe ferry dey run from the Motor Park.`,
            tone: 'bad'
        });
    }
    if (agg.drainedZone) {
        const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.drainedZone]?.name ?? agg.drainedZone;
        get().notify({
            icon: '💧',
            text: `The water don leave ${zoneName} — the road dey open again.`,
            tone: 'good'
        });
    }
    if (agg.rescueWake) {
        get().notify({
            icon: '🧊',
            text: `Deep water don reach the cold rooms — the street don pass the rescue bowl for ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.rescueWake]?.name ?? agg.rescueWake}.`,
            tone: 'neutral'
        });
    }
    if (agg.rescueDone) {
        const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][agg.rescueDone]?.name ?? agg.rescueDone;
        const p = get().player;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].rescue.moodReward
                })
            }
        });
        get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].rescue.repReward);
        get().notify({
            icon: '🛻',
            text: `COLD-ROOM RESCUE COMPLETE! The trucks don move the stock to the Patti road high ground — ${zoneName} go hear am for the season.`,
            tone: 'good'
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
    }
    if (agg.riverRelief) {
        const p = get().player;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].reliefMood
                })
            }
        });
        get().notify({
            icon: '☀️',
            text: 'The river don enter back inside him banks — the whole city dey breathe.',
            tone: 'good'
        });
    } else if (agg.riverDamp) {
        const p = get().player;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].dampMoodHit
                })
            }
        });
    }
    // M12 — the ladder narrates itself: the rent book, the wahala, the japa money
    if (agg.rentPosted) {
        get().notify({
            icon: '🏠',
            text: `Rent cycle posted — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(agg.rentPosted.amount)} due for the room.`,
            tone: 'neutral'
        });
    }
    if (agg.wahalaArrived) {
        get().notify({
            icon: '🔑',
            text: `Landlord wahala: ${agg.wahalaArrived.note}.`,
            tone: 'neutral'
        });
    }
    if (agg.lateNotice) {
        const p = get().player;
        if (p) set({
            player: {
                ...p,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    mood: -4
                })
            }
        });
        get().addReputation(-2);
        get().notify({
            icon: '📄',
            text: 'QUIT NOTICE: the rent book don fall two cycles behind — the landlord no dey smile again.',
            tone: 'bad'
        });
    }
    if (agg.remittance) {
        get().addMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.remittance, {
            label: 'First remittance — from abroad',
            category: 'tip'
        });
        get().notify({
            icon: '💸',
            text: `The first remittance don land — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.remittance)} from abroad. The village dey proud of you.`,
            tone: 'good'
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
    }
    if (agg.nepaPosted > 0) {
        get().notify({
            icon: '🧾',
            text: `NEPA bill posted — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(agg.nepaPosted)} due.`,
            tone: 'neutral'
        });
    }
    if (agg.nepaShed) {
        get().notify({
            icon: '🔌',
            text: 'Load-shedding: NEPA don cut your light. Settle the bill to reconnect.',
            tone: 'bad'
        });
    }
    if (agg.taxAssessed > 0) {
        get().notify({
            icon: '🧮',
            text: `KGIRS assessment: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(agg.taxAssessed)} tax due.`,
            tone: 'neutral'
        });
    }
    if (agg.warrantIssued) {
        get().notify({
            icon: '🚨',
            text: 'Tax warrant issued — settle it at the police station.',
            tone: 'bad'
        });
    }
    for (const t of agg.tipsResolved){
        get().notify({
            icon: '🕵️',
            text: `EFCC recovered funds from “${t.label}” — your share: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["efccRewardFor"])(t))}.`,
            tone: 'good'
        });
    }
}
function warnSaveFailure(get) {
    if (quotaWarned) return;
    quotaWarned = true;
    get().notify({
        icon: '💾',
        text: 'Disk full — progress at risk. Free some space so the city fit save your hustle.',
        tone: 'bad'
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
}
function cloudSaveGate(cloud, sig, key) {
    const probe = cloud;
    const verify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyPayload"])(JSON.stringify(cloud), sig, key);
    if (!verify.ok) return {
        ok: false,
        why: verify.why
    };
    if (typeof probe.version !== 'number' || !Number.isFinite(probe.version) || probe.version < 1 || probe.version > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].SAVE_VERSION) {
        return {
            ok: false,
            why: 'future version'
        };
    }
    if (!probe.player || !probe.world) return {
        ok: false,
        why: 'malformed'
    };
    const num = (v, min)=>typeof v === 'number' && Number.isFinite(v) && v >= min;
    if (!num(probe.player.cash, 0) || !num(probe.player.bankBalance, 0)) return {
        ok: false,
        why: 'insane money'
    };
    if (!num(probe.world.day, 1)) return {
        ok: false,
        why: 'insane day'
    };
    for (const v of Object.values(probe.player.needs ?? {})){
        if (typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 100) return {
            ok: false,
            why: 'insane needs'
        };
    }
    if (!num(probe.player.stats?.totalEarned ?? 0, 0) || !num(probe.player.stats?.totalSpent ?? 0, 0)) return {
        ok: false,
        why: 'insane stats'
    };
    return {
        ok: true
    };
}
function scheduleAutosave(get) {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(()=>{
        const { player, world, civic, settings } = get();
        if (!player || !world || !civic) return;
        const existing = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].load();
        const wrote = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].write({
            version: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].SAVE_VERSION,
            createdAt: existing?.createdAt ?? Date.now(),
            updatedAt: Date.now(),
            player,
            world,
            civic,
            fleet: get().fleet,
            chaos: get().chaos,
            calendar: get().calendar,
            rivers: get().rivers,
            education: get().education,
            housing: get().housing,
            japa: get().japa,
            goals: get().goals,
            onboarding: get().onboarding,
            account: get().account,
            shield: get().shield,
            fortress: get().fortress,
            cityPulse: get().cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(),
            live: get().live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])(),
            forge: get().forge ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])(),
            story: get().story,
            patti: get().patti,
            wardrobe: get().wardrobe,
            nation: get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])(),
            settings
        });
        if (!wrote) warnSaveFailure(get);
    }, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTOSAVE"].debounceMs);
}
let nationBridge = null;
function startNationBridge(get) {
    const nation = get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])();
    const flags = get().opsFlags ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readFlags"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopNationSim"])();
    nationBridge = null;
    if (!nation.crowd.on || flags.crowdSim === false) {
        useGameStoreRef.setState({
            nationSnapshot: null,
            nationPath: null
        });
        return;
    }
    const world = get().world;
    nationBridge = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startNationSim"])({
        seed: nation.crowd.seed,
        count: nation.crowd.count,
        allowWorker: flags.workerSim !== false,
        initialPulse: {
            day: world?.day ?? 1,
            weather: world?.weather ?? 'sunny',
            floodLevel: 0,
            marketMult: 1,
            festival: null
        },
        onSnapshot: (snap)=>{
            const st = useGameStoreRef.getState();
            if (st.nationSnapshot?.tick === snap.tick) return;
            st.nationSnapshotIngest(snap);
        }
    });
    useGameStoreRef.setState({
        nationPath: nationBridge.path()
    });
}
const useGameStoreRef = {
    getState: ()=>{
        throw new Error('nation bridge: store not ready');
    },
    setState: ()=>{
        throw new Error('nation bridge: store not ready');
    }
};
function nextNotificationId() {
    notificationId += 1;
    return notificationId;
}
function nextPulseId() {
    pulseId += 1;
    return pulseId;
}
function clearNationBridge() {
    nationBridge = null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/ui.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * UI SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1246-1246, 1249-1249, 1268-1268, 1283-1284, 1305-1305, 4227-4245, 4270-4303, 5550-5560.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "uiSlice",
    ()=>uiSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/music.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/save.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
const uiSlice = (set, get)=>({
        screen: 'menu',
        notifications: [],
        pulse: null,
        shockwave: 0,
        settings: {
            sound: true,
            graphics: 'auto',
            chill: false,
            elder: false,
            music: false,
            haptics: true
        },
        setScreen: (screen)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["menuSetScreen"])(screen),
        /* --------------------------- settings/save ---------------------------- */ toggleSound: ()=>{
            const settings = {
                ...get().settings,
                sound: !get().settings.sound
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncAudioWithSettings"])(settings);
            set({
                settings
            });
            // the debounced autosave only runs inside a live game — on the menu, patch the save directly
            if (get().player) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            else __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
        },
        setGraphics: (q)=>{
            const settings = {
                ...get().settings,
                graphics: q
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["refreshDeviceProfile"])(q); // the session profile re-resolves against the pick
            set({
                settings
            });
            // M7: a pick made on the MAIN MENU must survive — autosave is dormant there
            if (get().player) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            else __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
        },
        /** M9 — Chill Mode: a gentler Lokoja, persisted like every setting. */ setChill: (chill)=>{
            const settings = {
                ...get().settings,
                chill
            };
            set({
                settings
            });
            if (get().player) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            else __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
        },
        /** M13 — Elder mode: large text, high contrast, reduced motion, slow pacing. */ setElder: (elder)=>{
            const settings = {
                ...get().settings,
                elder
            };
            set({
                settings
            });
            if (get().player) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            else __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
            get().notify({
                icon: elder ? '🔍' : '👓',
                text: elder ? 'Elder mode on — bigger text, kinder streets.' : 'Elder mode off.',
                tone: 'neutral'
            });
        },
        /** M19 — the soundtrack toggle: music rides the master sound switch too. */ setMusic: (on)=>{
            const settings = {
                ...get().settings,
                music: on
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["music"].setEnabled(settings.sound && on);
            set({
                settings
            });
            if (get().player) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            else __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
        },
        /** M19 — haptics toggle; elder mode keeps the phone still regardless. */ setHaptics: (on)=>{
            const settings = {
                ...get().settings,
                haptics: on
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].setEnabled(on);
            set({
                settings
            });
            if (get().player) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            else __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].patchSettings(settings);
        },
        /* ------------------------------ feedback ------------------------------ */ notify: (n)=>{
            // PH2.5: notificationId now lives in shared.ts — this is the same +1
            const notification = {
                ...n,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextNotificationId"])()
            };
            set({
                notifications: [
                    ...get().notifications.slice(-2),
                    notification
                ]
            });
            setTimeout(()=>get().dismissNotification(notification.id), 3200);
        },
        dismissNotification: (id)=>set({
                notifications: get().notifications.filter((n)=>n.id !== id)
            })
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/avatar.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Avatar customisation data
 * ---------------------------------------
 * All character-creation options live here so new options
 * (cosmetics shop, Loko Gems items, premium styles) can be added
 * later purely through data + a `premium` flag.
 */ __turbopack_context__.s([
    "AVATAR_CLOTHING_STYLES",
    ()=>AVATAR_CLOTHING_STYLES,
    "AVATAR_HAIRSTYLES",
    ()=>AVATAR_HAIRSTYLES,
    "CLOTHING_COLORS",
    ()=>CLOTHING_COLORS,
    "DEFAULT_AVATAR",
    ()=>DEFAULT_AVATAR,
    "HAIR_COLORS",
    ()=>HAIR_COLORS,
    "SKIN_TONES",
    ()=>SKIN_TONES
]);
const SKIN_TONES = [
    {
        key: 'deep-ebony',
        label: 'Deep Ebony',
        value: '#4A2C17'
    },
    {
        key: 'dark-brown',
        label: 'Dark Brown',
        value: '#5C3A21'
    },
    {
        key: 'rich-brown',
        label: 'Rich Brown',
        value: '#6E4326'
    },
    {
        key: 'warm-brown',
        label: 'Warm Brown',
        value: '#8A5A32'
    },
    {
        key: 'light-brown',
        label: 'Light Brown',
        value: '#A9714B'
    },
    {
        key: 'pale-brown',
        label: 'Pale Brown',
        value: '#C08A5E'
    }
];
const HAIR_COLORS = [
    {
        key: 'black',
        label: 'Black',
        value: '#1A1714'
    },
    {
        key: 'dark-brown',
        label: 'Dark Brown',
        value: '#2E1D12'
    },
    {
        key: 'burgundy',
        label: 'Burgundy',
        value: '#5C2330'
    },
    {
        key: 'honey',
        label: 'Honey Blonde',
        value: '#8A6A3B'
    },
    {
        key: 'gold-dye',
        label: 'Gold Dye',
        value: '#B79545'
    }
];
const AVATAR_HAIRSTYLES = [
    {
        key: 'bald',
        label: 'Bald',
        gender: 'all'
    },
    {
        key: 'low-cut',
        label: 'Low Cut',
        gender: 'all'
    },
    {
        key: 'waves',
        label: 'Waves',
        gender: 'all'
    },
    {
        key: 'afro',
        label: 'Afro',
        gender: 'all'
    },
    {
        key: 'cornrows',
        label: 'Cornrows',
        gender: 'all'
    },
    {
        key: 'dreads',
        label: 'Dreads',
        gender: 'all'
    },
    {
        key: 'braids',
        label: 'Long Braids',
        gender: 'all'
    },
    {
        key: 'puffs',
        label: 'Two Puffs',
        gender: 'all'
    }
];
const AVATAR_CLOTHING_STYLES = [
    {
        key: 'tshirt',
        label: 'T-Shirt',
        description: 'Everyday hustle wear'
    },
    {
        key: 'kaftan',
        label: 'Kaftan',
        description: 'Clean traditional look'
    },
    {
        key: 'ankara',
        label: 'Ankara Print',
        description: 'Full pattern flex'
    },
    {
        key: 'senator',
        label: 'Senator Wear',
        description: 'Sharp for business'
    },
    {
        key: 'hoodie',
        label: 'Hoodie',
        description: 'Street hoodie — blessed and chilly'
    },
    {
        key: 'lace',
        label: 'Lace',
        description: 'Lace grandeur — occasion wear'
    }
];
const CLOTHING_COLORS = [
    {
        key: 'forest',
        label: 'Forest Green',
        value: '#1B7A43'
    },
    {
        key: 'gold',
        label: 'Amber Gold',
        value: '#E8A317'
    },
    {
        key: 'terra',
        label: 'Terracotta',
        value: '#C4562A'
    },
    {
        key: 'oxblood',
        label: 'Oxblood',
        value: '#7C2D2D'
    },
    {
        key: 'cream',
        label: 'Cream',
        value: '#F1E3C8'
    },
    {
        key: 'charcoal',
        label: 'Charcoal',
        value: '#33332E'
    }
];
const DEFAULT_AVATAR = {
    skinTone: '#6E4326',
    hairColor: '#1A1714',
    hairstyle: 'low-cut',
    clothingStyle: 'tshirt',
    clothingColor: '#1B7A43'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/telemetry.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * M20 — THE TELEMETRY LAW (opt-in or nothing)
 * --------------------------------------------
 * One honest counter book, kept locally, flushed ONLY when the device
 * owner opted in — and even then, NEVER for a kid. The kid refusal is
 * STRUCTURAL: recordTelemetry takes the band as an argument and the
 * kid branch returns before anything can be counted. There is no
 * code path, flag, or override that counts a child.
 *
 * THE CLOSED-ENUM LAW: keys come from TELEMETRY_KEYS only — no free
 * text, no invented metrics, nothing personal ever (no handles, no
 * streets, no naira amounts — just "how many times did the day roll").
 */ __turbopack_context__.s([
    "TELEMETRY_KEYS",
    ()=>TELEMETRY_KEYS,
    "freshTelemetryBook",
    ()=>freshTelemetryBook,
    "recordTelemetry",
    ()=>recordTelemetry,
    "telemetryDayRoll",
    ()=>telemetryDayRoll,
    "telemetryPayload",
    ()=>telemetryPayload
]);
const TELEMETRY_KEYS = [
    'day-rolled',
    'travel-made',
    'gig-run',
    'meal-bought',
    'biz-earned',
    'festival-attended',
    'flood-cut',
    'share-sent'
];
function freshTelemetryBook() {
    return {
        optIn: false,
        day: 1,
        counts: {}
    };
}
const KEY_CAP = 9999;
const DAY_CAP = 100_000;
function recordTelemetry(book, key, band, day) {
    if (band === 'kid') return {
        next: book,
        recorded: false
    };
    if (!book.optIn) return {
        next: book,
        recorded: false
    };
    if (!TELEMETRY_KEYS.includes(key)) return {
        next: book,
        recorded: false
    };
    const counts = {
        ...book.counts
    };
    counts[key] = Math.min(KEY_CAP, (counts[key] ?? 0) + 1);
    return {
        next: {
            optIn: true,
            day: Math.min(DAY_CAP, Math.max(1, Math.floor(day))),
            counts
        },
        recorded: true
    };
}
function telemetryPayload(book) {
    if (!book.optIn) return null;
    const counters = {};
    for (const k of TELEMETRY_KEYS){
        const v = book.counts[k];
        if (typeof v === 'number' && v > 0) counters[k] = v;
    }
    return {
        day: Math.max(1, Math.floor(book.day)),
        counters
    };
}
function telemetryDayRoll(book, newDay) {
    if (newDay - book.day >= 30) return {
        optIn: book.optIn,
        day: Math.max(1, Math.floor(newDay)),
        counts: {}
    };
    return {
        ...book,
        day: Math.max(1, Math.floor(newDay))
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/teleport.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TELEPORT_CATEGORIES",
    ()=>TELEPORT_CATEGORIES,
    "TELEPORT_CODE_LIMIT",
    ()=>TELEPORT_CODE_LIMIT,
    "TELEPORT_ROSTER",
    ()=>TELEPORT_ROSTER,
    "TELEPORT_URL_LIMIT",
    ()=>TELEPORT_URL_LIMIT,
    "base32Decode",
    ()=>base32Decode,
    "base32Encode",
    ()=>base32Encode,
    "decodeTeleport",
    ()=>decodeTeleport,
    "encodeTeleport",
    ()=>encodeTeleport,
    "postcardFor",
    ()=>postcardFor,
    "sanitizeTeleportName",
    ()=>sanitizeTeleportName,
    "teleportUrl",
    ()=>teleportUrl
]);
/**
 * LOKOJA LIFE — M15: TELEPORT (pure rules)
 * -----------------------------------------
 * THE POSTCARD: a signed, ~100-byte code that carries one honest MOMENT
 * of a life in Lokoja — the day, the street, the walker's name, the
 * level, the reputation, and the last three honest money moves.
 * WhatsApp it. Anyone who opens it arrives at that street with the
 * ghost card telling them whose corner they just landed in.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic. Same moment + same version → the same
 *    code bytes, byte for byte (a share re-share is the same postcard).
 *  - The signature rides the M14 fortress crypto: HMAC-SHA256 over the
 *    EXACT payload string, keyed by an app-wide pepper derived through
 *    SHA-256. Honest scope (the M14 note applies twice over): a
 *    teleport code is a POSTCARD, not a bank vault — the signature is
 *    INTEGRITY (transit mangling, truncated paste, casual forgery),
 *    not secrecy. Every device verifies every code with the same key:
 *    a postcard Ada signs on her phone opens on Musa's phone.
 *  - THE BUDGET: the code fits WhatsApp — ≤ 96 characters, the full
 *    share URL ≤ ~100 bytes of payload. encodeTeleport refuses to
 *    mint a code that busts the budget (the law is tested).
 *  - THE MERCY LAW: a mangled or truncated paste is refused honestly
 *    (malformed), an edited payload is refused (tampered) — a broken
 *    postcard NEVER loads a moment. No partial arrivals.
 *  - The roster is FROZEN: v1 codes speak the v1 street list. A street
 *    added later joins at the tail; a removed street breaks nothing
 *    already in circulation (its codes decode with an honest refusal
 *    if the index walks off the frozen list).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
;
;
;
/* ------------------------------ the roster --------------------------------- */ /**
 * The frozen v1 head — the ten launch streets whose indexes are baked into
 * circulating codes. This head is a CONTRACT: append-only, never reorder,
 * never splice.
 */ const V1_ROSTER = [
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
const TELEPORT_ROSTER = [
    ...V1_ROSTER,
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATIONS"].map((l)=>l.id).filter((id)=>!V1_ROSTER.includes(id))
];
const TELEPORT_CATEGORIES = [
    'job',
    'hustle',
    'transport',
    'shop',
    'tip',
    'other',
    'bank',
    'fun'
];
/* -------------------------------- the key ---------------------------------- */ /**
 * The app-wide pepper, stretched through SHA-256 so the HMAC key is a
 * uniform 32-byte hex string. Public by design (client bundle) — the
 * barrier stops mangling and casual forgery, and that is the honest
 * whole of its job.
 */ const TELEPORT_PEPPER = 'lokoja-teleport-v1';
const TELEPORT_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sha256"])(TELEPORT_PEPPER);
_c = TELEPORT_KEY;
/** The signature is the first 16 hex chars of the HMAC — 64 honest bits. */ const SIG_LEN = 16;
/* ------------------------------ the helpers -------------------------------- */ const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function base32Encode(bytes) {
    let bits = 0;
    let value = 0;
    let out = '';
    for (const b of bytes){
        value = value << 8 | b & 255;
        bits += 8;
        while(bits >= 5){
            out += B32[value >>> bits - 5 & 31];
            bits -= 5;
        }
    }
    if (bits > 0) out += B32[value << 5 - bits & 31];
    return out;
}
function base32Decode(s) {
    const bytes = [];
    let bits = 0;
    let value = 0;
    for (const ch of s){
        const idx = B32.indexOf(ch);
        if (idx < 0) return null;
        value = value << 5 | idx;
        bits += 5;
        if (bits >= 8) {
            bytes.push(value >>> bits - 8 & 255);
            bits -= 8;
        }
    }
    return bytes;
}
function sanitizeTeleportName(raw) {
    const name = raw.trim().replace(/\s+/g, ' ');
    if (name.length < 1) return {
        ok: false,
        why: 'A postcard needs a name.'
    };
    if (name.length > 12) return {
        ok: false,
        why: 'Keep the name under 12 characters.'
    };
    if (!/^[A-Za-z0-9 _-]+$/.test(name)) return {
        ok: false,
        why: 'Letters, numbers, spaces, - and _ only.'
    };
    return {
        ok: true,
        name
    };
}
/** Serialise the moment into the exact signed payload string. */ function serializeMoment(m) {
    const trail = (m.trail.length ? m.trail : [
        0,
        0,
        0
    ]).slice(0, 3);
    const padded = [
        ...trail
    ];
    while(padded.length < 3)padded.push(0);
    return [
        m.v,
        m.day,
        TELEPORT_ROSTER.indexOf(m.locId),
        m.name,
        m.level,
        m.rep,
        m.earned,
        m.moves,
        padded.join('.')
    ].join('|');
}
const TELEPORT_CODE_LIMIT = 96;
const TELEPORT_URL_LIMIT = 112;
function teleportUrl(code, base) {
    const origin = base ?? (("TURBOPACK compile-time value", "object") !== 'undefined' && window.location?.origin ? window.location.origin : 'https://lokoja.life');
    return `${origin.replace(/\/$/, '')}/t/${code}`;
}
function encodeTeleport(moment, base) {
    if (moment.v !== 1) return {
        ok: false,
        why: 'Unknown postcard version.'
    };
    if (!Number.isInteger(moment.day) || moment.day < 1) return {
        ok: false,
        why: 'The day is not a real day.'
    };
    if (!TELEPORT_ROSTER.includes(moment.locId)) return {
        ok: false,
        why: 'That street is not on the postcard roster.'
    };
    if (!Number.isInteger(moment.level) || moment.level < 1) return {
        ok: false,
        why: 'The level is not a real level.'
    };
    const name = sanitizeTeleportName(moment.name);
    if (!name.ok) return {
        ok: false,
        why: name.why
    };
    for (const t of moment.trail){
        if (!Number.isInteger(t) || t < 0 || t >= TELEPORT_CATEGORIES.length) return {
            ok: false,
            why: 'The ghost walk broke the category law.'
        };
    }
    const payload = serializeMoment({
        ...moment,
        name: name.name
    });
    const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hmacSha256"])(TELEPORT_KEY, payload).slice(0, SIG_LEN);
    const code = `lkt1.${base32Encode(Array.from(new TextEncoder().encode(payload)))}.${sig}`;
    if (code.length > TELEPORT_CODE_LIMIT) return {
        ok: false,
        why: 'The postcard busted the byte budget.'
    };
    const url = teleportUrl(code, base);
    if (url.length > TELEPORT_URL_LIMIT) return {
        ok: false,
        why: 'The share URL busted the byte budget.'
    };
    return {
        ok: true,
        code,
        url,
        payload,
        bytes: new TextEncoder().encode(payload).length
    };
}
function decodeTeleport(raw) {
    const cleaned = raw.trim().replace(/^["'<]+|["'>]+$/g, '').replace(/\s+/g, '');
    if (!cleaned) return {
        ok: false,
        why: 'empty'
    };
    const parts = cleaned.split('.');
    if (parts.length !== 3 || parts[0] !== 'lkt1') return {
        ok: false,
        why: 'malformed'
    };
    const [, body, sig] = parts;
    const bytes = base32Decode(body);
    if (!bytes || bytes.length === 0) return {
        ok: false,
        why: 'malformed'
    };
    let payload;
    try {
        payload = new TextDecoder().decode(new Uint8Array(bytes));
    } catch  {
        return {
            ok: false,
            why: 'malformed'
        };
    }
    const expect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hmacSha256"])(TELEPORT_KEY, payload).slice(0, SIG_LEN);
    if (expect.length !== sig.length) return {
        ok: false,
        why: 'tampered'
    };
    let diff = 0;
    for(let i = 0; i < expect.length; i++)diff |= expect.charCodeAt(i) ^ sig.charCodeAt(i);
    if (diff !== 0) return {
        ok: false,
        why: 'tampered'
    };
    const f = payload.split('|');
    if (f.length !== 9) return {
        ok: false,
        why: 'malformed'
    };
    const v = Number(f[0]);
    const day = Number(f[1]);
    const locIdx = Number(f[2]);
    const name = f[3];
    const level = Number(f[4]);
    const rep = Number(f[5]);
    const earned = Number(f[6]);
    const moves = Number(f[7]);
    const trail = f[8].split('.').map(Number);
    if (!Number.isInteger(v) || v !== 1) return {
        ok: false,
        why: 'malformed'
    };
    if (!Number.isInteger(day) || day < 1) return {
        ok: false,
        why: 'malformed'
    };
    if (!Number.isInteger(locIdx) || locIdx < 0 || locIdx >= TELEPORT_ROSTER.length) return {
        ok: false,
        why: 'malformed'
    };
    if (!sanitizeTeleportName(name).ok) return {
        ok: false,
        why: 'malformed'
    };
    if (!Number.isInteger(level) || level < 1) return {
        ok: false,
        why: 'malformed'
    };
    if (!Number.isInteger(rep) || !Number.isInteger(earned) || !Number.isInteger(moves)) return {
        ok: false,
        why: 'malformed'
    };
    if (trail.length !== 3 || trail.some((t)=>!Number.isInteger(t) || t < 0 || t >= TELEPORT_CATEGORIES.length)) {
        return {
            ok: false,
            why: 'malformed'
        };
    }
    return {
        ok: true,
        payload,
        moment: {
            v: 1,
            day,
            locId: TELEPORT_ROSTER[locIdx],
            name,
            level,
            rep,
            earned,
            moves,
            trail
        }
    };
}
function postcardFor(m) {
    const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][m.locId];
    const place = loc ? loc.name : m.locId;
    const title = `${m.name} na Day ${m.day} dey ${place}`;
    const walk = m.trail.map((t)=>TELEPORT_CATEGORIES[t]).filter(Boolean).slice(0, 3);
    const walkLine = walk.length ? `Last moves: ${walk.join(' → ')}` : 'The day dey quiet — come see the street yourself.';
    const body = `${walkLine} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(m.earned)} earned across ${m.moves} move${m.moves === 1 ? '' : 's'}`;
    const chips = [
        {
            label: 'Day',
            value: String(m.day)
        },
        {
            label: 'Street',
            value: place
        },
        {
            label: 'Level',
            value: String(m.level)
        },
        {
            label: 'Rep',
            value: String(m.rep)
        }
    ];
    return {
        title,
        body,
        chips
    };
}
var _c;
__turbopack_context__.k.register(_c, "TELEPORT_KEY");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/saveBoot.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * SAVEBOOT SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1247-1248, 1262-1264, 1267-1267, 1291-1303, 1307-1484, 4531-4786, 5471-5548.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "saveBootSlice",
    ()=>saveBootSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/citypack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/education.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/goals.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/guest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/music.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation-bridge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/patti.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/pulse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/save.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/story.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/telemetry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/teleport.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wardrobe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)"); // PH2.5: the boot online-listener reads the composed hook (closure-only, cycle-safe)
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
;
/** M16 — the online listener wires itself exactly once. */ let cloudQueueWired = false;
const saveBootSlice = (set, get)=>({
        booted: false,
        hasSave: false,
        onboarding: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshOnboardingState"])(),
        account: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshAccountState"])(),
        guestPreviewStartedAt: null,
        gateOpen: false,
        /* ----------------------------- lifecycle ----------------------------- */ boot: ()=>{
            const save = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].load();
            const bootSettings = save?.settings ?? {
                sound: true,
                graphics: 'auto',
                chill: false,
                elder: false,
                music: false,
                haptics: true
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncAudioWithSettings"])(bootSettings);
            // M19 — the audio/haptic engines ride the settings at boot
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].setEnabled(bootSettings.haptics);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].setElder(bootSettings.elder);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$music$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["music"].setEnabled(bootSettings.sound && bootSettings.music);
            set({
                booted: true,
                hasSave: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].hasSave(),
                settings: bootSettings
            });
            get().bootWorldHooks();
        },
        /** M15/M16 world-boot hooks — the parts of boot() that only matter once
   *  the FAT store exists (postcard decode + the offline queue). Idempotent:
   *  the postcard decode just re-sets the same value, the listener wires
   *  itself exactly once. boot() runs it; the dashboard idle preload and
   *  continueGame run it too, so the menu-only boot can stay thin. */ bootWorldHooks: ()=>{
            // M15 — a postcard in the URL: decode it now, land when the city opens
            try {
                const t = new URLSearchParams(window.location.search).get('t');
                if (t) {
                    const dec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeTeleport"])(t);
                    if (dec.ok) set({
                        pendingArrival: {
                            code: t.trim(),
                            moment: dec.moment
                        }
                    });
                    else set({
                        pendingArrival: null
                    });
                }
            } catch  {}
            // M16 — the offline law: a queued push rides again when the network returns
            try {
                const queued = window.localStorage.getItem('lokoja-life:cloud-queue') === '1';
                if (queued) set({
                    cloudPending: true
                });
                if (!cloudQueueWired) {
                    cloudQueueWired = true;
                    window.addEventListener('online', ()=>{
                        void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().flushCloudQueue();
                    });
                }
                if (queued && navigator.onLine) void get().flushCloudQueue();
            } catch  {}
        },
        /* ---------------------------- core actions ---------------------------- */ startNewGame: (name, gender, avatar, ageBand = 'adult')=>{
            const player = {
                name: name.trim() || 'New Hustler',
                gender,
                avatar: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"],
                    ...avatar
                },
                ageBand,
                cash: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].cash,
                needs: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].needs
                },
                skills: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].skills
                },
                reputation: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].reputation,
                level: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].level,
                xp: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].xp,
                homeId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].homeId,
                jobId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"].jobId,
                skillXp: {
                    hustle: 0,
                    smart: 0,
                    social: 0
                },
                activeOpportunities: [],
                cooldowns: {},
                transactions: [],
                stats: {
                    jobsCompleted: 0,
                    hustlesCompleted: 0,
                    totalEarned: 0,
                    totalSpent: 0
                },
                inventory: [],
                businesses: [],
                missions: {},
                achievements: [],
                discoveries: [],
                vehicles: [],
                bankBalance: 0,
                relationships: {}
            };
            const world = {
                day: 1,
                timeOfDay: 'morning',
                weather: 'sunny',
                currentLocation: 'home'
            };
            set({
                player,
                world,
                civic: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCivicState"])(),
                chaos: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshChaosState"])(),
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCalendarState"])(),
                rivers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshRiversState"])(),
                education: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshEducationState"])(),
                housing: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshHousingState"])(),
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshJapaState"])(),
                goals: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshGoalState"])(),
                onboarding: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshOnboardingState"])(),
                // M24-UI — THE IDENTITY SURVIVES THE NEW LIFE: a claim made on the
                // landing rides into the game (the M9 identity IS the player, not
                // the save). An unclaimed start stays unclaimed, exactly as before;
                // resetGame keeps its full wipe — that one is the honest delete.
                account: get().account.linked ? get().account : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshAccountState"])(),
                shield: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshShieldState"])(),
                fortress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshFortressState"])(),
                cityPulse: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(),
                live: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])(),
                forge: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])(),
                nation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])(),
                nationSnapshot: null,
                telemetry: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshTelemetryBook"])(),
                pendingArrival: get().pendingArrival,
                gateOpen: false,
                fleet: {
                    day: 1,
                    done: []
                },
                offers: [],
                // THE RESET IS TOTAL (hardening): the new life is born NEW — the old
                // life's quest book, Patti secrets and wardrobe died with it (the
                // audit caught graduate Musa reborn with chapter 5 done and the
                // white agbada already owned), and no stale transition walks in.
                story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshStoryState"])(),
                patti: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPattiState"])(),
                wardrobe: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshWardrobeState"])(),
                isTravelling: false,
                isWorking: false,
                workingLabel: null
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startNationBridge"])(get);
            // M15 — a postcard was waiting for a fresh life: land at that street
            const pending = get().pendingArrival;
            if (pending) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyArrival"])(set, get, pending.code, pending.moment, {
                    silent: true
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["menuSetScreen"])('game'); // the menu store owns screen — this is the writer
        },
        continueGame: ()=>{
            const save = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].load();
            if (!save) return false;
            get().bootWorldHooks(); // the postcard must exist before the landing reads it
            // M7: defensive graphics default (saves restored from older backups)
            const settings = {
                ...save.settings,
                graphics: save.settings.graphics ?? 'auto'
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncAudioWithSettings"])(settings);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["refreshDeviceProfile"])(settings.graphics);
            set({
                player: save.player,
                world: save.world,
                civic: save.civic,
                chaos: save.chaos ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshChaosState"])(),
                calendar: save.calendar ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCalendarState"])(),
                rivers: save.rivers ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshRiversState"])(),
                education: save.education ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshEducationState"])(),
                housing: save.housing ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshHousingState"])(),
                japa: save.japa ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshJapaState"])(),
                goals: save.goals ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshGoalState"])(),
                onboarding: save.onboarding ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshOnboardingState"])(),
                // W1-b — THE LOGIN SURVIVES THE LOAD: a just-claimed/logged-in account's
                // token is FRESHER than the save's own line (the register rotates the
                // key; the save was written with the previous one). The save restores
                // the IDENTITY; a live linked session keeps its own key — otherwise
                // every return-login re-enters the wire as a guest (the W10-b
                // reload witness caught this: guest-dark at the parked door).
                account: get().account.linked && save.account && save.account.handle === get().account.handle ? get().account : save.account ? {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshAccountState"])(),
                    ...save.account
                } : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshAccountState"])(),
                shield: save.shield ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshShieldState"])(),
                fortress: save.fortress ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshFortressState"])(),
                cityPulse: save.cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(),
                live: save.live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])(),
                forge: save.forge ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])(),
                nation: save.nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])(),
                fleet: save.fleet,
                settings,
                // THE BOUNDARY LAW (hardening): the old session's transition timers
                // and flags die at the load — a travel that was mid-flight in the
                // PREVIOUS life never lands its cash in this one
                isTravelling: false,
                isWorking: false,
                workingLabel: null
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startNationBridge"])(get);
            // M15 — a postcard came with the boot URL: land the moment the city opens
            const pendingBoot = get().pendingArrival;
            if (pendingBoot) {
                const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gateVerdict"])(get().account, pendingBoot.moment.locId, save.world.day);
                if (!verdict.blocked) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyArrival"])(set, get, pendingBoot.code, pendingBoot.moment);
                else set({
                    gateOpen: true
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["menuSetScreen"])('game'); // the menu store owns screen — this is the writer
            return true;
        },
        returnToMenu: ()=>{
            get().saveNow();
            set({
                hasSave: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].hasSave()
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["menuSetScreen"])('menu'); // the menu store owns screen — this is the writer
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"].getState().refreshFromDisk(); // the menu re-reads disk truth
        },
        /** M13 — THE FAMILY SHIELD register law: a minor account only exists
   *  behind a parent's PIN and collects NOTHING — no contact, no recovery
   *  line. The birth year is the honest truth: if it yields a different
   *  band than the character's, the birth year wins (and the city tells you). */ registerAccount: async (input)=>{
            const vHandle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateHandle"])(input.handle);
            if (!vHandle.ok) return {
                ok: false,
                why: vHandle.why
            };
            const vPin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validatePin"])(input.pin);
            if (!vPin.ok) return {
                ok: false,
                why: vPin.why
            };
            const year = new Date().getFullYear();
            const band = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ageBandForYear"])(input.birthYear, year);
            if (!band) return {
                ok: false,
                why: 'Enter the year you were born.'
            };
            const minor = band !== 'adult';
            // M13 — zero collection: minors answer to the parent PIN alone
            let contact = input.contact.trim();
            let parentPin;
            if (minor) {
                if (!input.parentPin) return {
                    ok: false,
                    why: 'A parent must set the shield PIN — minors dey register behind a parent.'
                };
                const vParent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateParentPin"])(input.parentPin);
                if (!vParent.ok) return {
                    ok: false,
                    why: vParent.why
                };
                parentPin = input.parentPin;
                contact = ''; // never stored for a minor — zero data collection
            } else if (input.contact.trim()) {
                // W1 — the v2 register law: contact optional, validated-if-present
                const vContact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateContact"])(input.contact);
                if (!vContact.ok) return {
                    ok: false,
                    why: vContact.why
                };
            }
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        handle: input.handle.trim(),
                        contact,
                        pin: input.pin,
                        ageBand: band,
                        parentPin,
                        // W1 — the whole face rides the claim: display name, look, bio
                        displayName: input.displayName,
                        avatarLook: input.avatarLook,
                        bio: input.bio ?? ''
                    })
                });
                const data = await res.json();
                if (!res.ok || !data.ok || !data.token) return {
                    ok: false,
                    why: data.why ?? 'The register no gree — try again.'
                };
                // the birth year is the law: the character's band syncs to it
                const p = get().player;
                const changed = p && p.ageBand !== band;
                if (p && changed) set({
                    player: {
                        ...p,
                        ageBand: band
                    }
                });
                set({
                    account: {
                        linked: true,
                        handle: input.handle.trim(),
                        token: data.token,
                        ageBand: band,
                        gateGraceDay: get().world?.day ?? 0,
                        // W1 — the ProfileRow mirror lands with the token (server truth)
                        displayName: data.profile?.displayName ?? null,
                        avatarLook: data.profile?.avatarLook ?? null,
                        bio: data.profile?.bio ?? null
                    },
                    gateOpen: false
                });
                get().notify({
                    icon: '🪪',
                    text: changed ? `You don claim your name — welcome, ${input.handle.trim()}! (Birth year say ${band.toUpperCase()} — the city adjust to am.)` : `You don claim your name — welcome, ${input.handle.trim()}! Your hustle don dey cloud now.`,
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
                void get().pushCloud();
                // M15 — the postcard the gate held lands behind the claimed name
                const pendingReg = get().pendingArrival;
                const worldReg = get().world;
                if (pendingReg && worldReg) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyArrival"])(set, get, pendingReg.code, pendingReg.moment);
                return {
                    ok: true
                };
            } catch  {
                return {
                    ok: false,
                    why: 'Network no gree — check connection and try again.'
                };
            }
        },
        /**
   * W1 — THE FACE EDITS ITSELF. PATCH /api/profile with the bearer;
   * the server's verdict wins and the mirror lands in the account.
   * Unlinked faces edit device-side through the creation flow — the
   * street only sees claimed profiles.
   */ updateProfile: async (input)=>{
            const acct = get().account;
            if (!acct.linked || !acct.token) return {
                ok: false,
                why: 'Claim your name first — the street sees claimed faces only.'
            };
            try {
                const res = await fetch('/api/profile', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${acct.token}`
                    },
                    body: JSON.stringify(input)
                });
                const data = await res.json();
                if (!res.ok || !data.ok) return {
                    ok: false,
                    why: data.why ?? 'The register no gree — try again.'
                };
                set({
                    account: {
                        ...get().account,
                        displayName: data.profile?.displayName ?? get().account.displayName,
                        avatarLook: data.profile?.avatarLook ?? get().account.avatarLook,
                        bio: data.profile?.bio ?? null
                    }
                });
                get().notify({
                    icon: '🪪',
                    text: 'Your face don update — the city go see am.',
                    tone: 'good'
                });
                return {
                    ok: true
                };
            } catch  {
                return {
                    ok: false,
                    why: 'Network no gree — check connection and try again.'
                };
            }
        },
        /**
   * W1 — THE PREVIEW CLOCK. Called once at world entry by the diegetic
   * layer when the player walks UNLINKED; the second call is a no-op
   * (the clock starts once, honestly). Session-scope — never saved.
   */ markGuestPreview: ()=>{
            if (get().account.linked) return;
            if (get().guestPreviewStartedAt) return;
            set({
                guestPreviewStartedAt: Date.now()
            });
        },
        /** M9 — return to a claimed name: the merge law decides, nothing is lost. */ loginAccount: async (input)=>{
            const vHandle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateHandle"])(input.handle);
            if (!vHandle.ok) return {
                ok: false,
                why: vHandle.why
            };
            const vPin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validatePin"])(input.pin);
            if (!vPin.ok) return {
                ok: false,
                why: vPin.why
            };
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        handle: input.handle.trim(),
                        pin: input.pin
                    })
                });
                const data = await res.json();
                if (!res.ok || !data.ok || !data.token) return {
                    ok: false,
                    why: data.why ?? 'The register no gree — try again.'
                };
                const local = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].load();
                let cloud = data.save ?? null;
                // F2 — THE PULL GATE: the vault row is client-authored data and used to
                // ride RAW into set() (a crafted/foreign save booted straight in). It now
                // passes the same defensive path as a local load: the fortress HMAC
                // (verifyPayload under THIS device's key), then the deserialize reject
                // law mirrored through the public surface (future version / missing
                // player / insane scalar → refuse). A refused row NEVER touches the
                // store: it lands in the backup slot (never-lose-progress) and the
                // login falls back to the device's own books — fresh/guest when
                // nothing local exists.
                if (cloud) {
                    const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloudSaveGate"])(cloud, typeof data.sig === 'string' ? data.sig : '', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].fortKey());
                    if (!gate.ok) {
                        try {
                            localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BACKUP_KEY"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backupPayload"])(cloud));
                        } catch  {}
                        get().notify({
                            icon: '🛡️',
                            text: `Cloud save no pass the gate (${gate.why}) — this device dey continue with him own books.`,
                            tone: 'bad'
                        });
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                        cloud = null;
                    }
                }
                // M17 — the account row's band is the canonical tier law (the
                // register stored it; the save's player band is the fallback)
                const bandFromRegister = [
                    'kid',
                    'teen',
                    'adult'
                ].includes(String(data.band)) ? data.band : null;
                if (cloud && local) {
                    const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeVerdict"])(local, cloud);
                    const winner = verdict.winner === 'cloud' ? cloud : local;
                    const loser = verdict.backup;
                    if (loser) {
                        // never-lose-progress: the loser lands in the backup slot, byte-safe
                        try {
                            localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BACKUP_KEY"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["backupPayload"])(loser));
                        } catch  {}
                    }
                    set({
                        account: {
                            linked: true,
                            handle: input.handle.trim(),
                            token: data.token,
                            ageBand: bandFromRegister ?? cloud.player.ageBand ?? null,
                            gateGraceDay: get().world?.day ?? 0,
                            // W1 — the face rides home (server truth; pre-W1 names stay null)
                            displayName: data.profile?.displayName ?? null,
                            avatarLook: data.profile?.avatarLook ?? null,
                            bio: data.profile?.bio ?? null
                        },
                        player: winner.player,
                        world: winner.world,
                        civic: winner.civic,
                        chaos: winner.chaos ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshChaosState"])(),
                        calendar: winner.calendar ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCalendarState"])(),
                        rivers: winner.rivers ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshRiversState"])(),
                        education: winner.education ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshEducationState"])(),
                        housing: winner.housing ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshHousingState"])(),
                        japa: winner.japa ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshJapaState"])(),
                        fleet: winner.fleet ?? {
                            day: winner.world.day,
                            done: []
                        },
                        goals: winner.goals ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshGoalState"])(),
                        onboarding: winner.onboarding ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshOnboardingState"])(),
                        shield: winner.shield ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshShieldState"])(),
                        fortress: winner.fortress ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshFortressState"])(),
                        cityPulse: winner.cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(),
                        live: winner.live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])(),
                        forge: winner.forge ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])(),
                        story: winner.story ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshStoryState"])(),
                        patti: winner.patti ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPattiState"])(),
                        wardrobe: winner.wardrobe ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshWardrobeState"])(),
                        nation: winner.nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])(),
                        gateOpen: false
                    });
                    get().notify({
                        icon: '🪪',
                        text: `Welcome back, ${input.handle.trim()}! ${verdict.why}`,
                        tone: 'good'
                    });
                } else {
                    set({
                        account: {
                            linked: true,
                            handle: input.handle.trim(),
                            token: data.token,
                            ageBand: bandFromRegister,
                            gateGraceDay: get().world?.day ?? 0,
                            displayName: data.profile?.displayName ?? null,
                            avatarLook: data.profile?.avatarLook ?? null,
                            bio: data.profile?.bio ?? null
                        },
                        gateOpen: false
                    });
                    get().notify({
                        icon: '🪪',
                        text: `Welcome back, ${input.handle.trim()}!`,
                        tone: 'good'
                    });
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
                void get().pushCloud();
                // M15 — the postcard the gate held lands behind the claimed name
                const pendingLog = get().pendingArrival;
                const worldLog = get().world;
                if (pendingLog && worldLog) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyArrival"])(set, get, pendingLog.code, pendingLog.moment);
                return {
                    ok: true
                };
            } catch  {
                return {
                    ok: false,
                    why: 'Network no gree — check connection and try again.'
                };
            }
        },
        /** M9 — "Maybe later": today rides free, tomorrow the gate stands again. */ acceptGateGrace: ()=>{
            const day = get().world?.day ?? 0;
            set({
                account: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyGrace"])(get().account, day),
                gateOpen: false
            });
            get().notify({
                icon: '🤝',
                text: 'Today na free ride — tomorrow, come claim your name.',
                tone: 'neutral'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            // M15 — a postcard the gate was holding lands the moment the grace lands
            const pending = get().pendingArrival;
            const world = get().world;
            if (pending && world) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyArrival"])(set, get, pending.code, pending.moment);
        },
        closeGate: ()=>set({
                gateOpen: false
            }),
        saveNow: ()=>{
            const { player, world, civic, fleet, chaos, calendar, rivers, education, housing, japa, goals, onboarding, account, settings } = get();
            if (!player || !world || !civic) return;
            const existing = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].load();
            const wrote = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].write({
                version: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].SAVE_VERSION,
                createdAt: existing?.createdAt ?? Date.now(),
                updatedAt: Date.now(),
                player,
                world,
                civic,
                fleet,
                chaos,
                calendar,
                rivers,
                education,
                housing,
                japa,
                goals,
                onboarding,
                account,
                shield: get().shield,
                fortress: {
                    ...get().fortress,
                    fingerprint: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["configFingerprint"])({
                        STARTING: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STARTING"],
                        WORK: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"],
                        BIZ: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"],
                        CHAOS: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"],
                        LADDER: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"],
                        FORTRESS: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FORTRESS"],
                        PULSE: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PULSE"]
                    })
                },
                cityPulse: get().cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(),
                live: get().live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])(),
                forge: get().forge ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])(),
                story: get().story,
                patti: get().patti,
                wardrobe: get().wardrobe,
                nation: get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])(),
                settings
            });
            set({
                hasSave: true
            });
            if (!wrote) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warnSaveFailure"])(get);
        },
        resetGame: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].clear();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopNationSim"])();
            set({
                player: null,
                world: null,
                civic: null,
                fleet: {
                    day: 1,
                    done: []
                },
                chaos: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshChaosState"])(),
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCalendarState"])(),
                rivers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshRiversState"])(),
                education: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshEducationState"])(),
                housing: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshHousingState"])(),
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshJapaState"])(),
                goals: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshGoalState"])(),
                onboarding: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshOnboardingState"])(),
                account: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshAccountState"])(),
                shield: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshShieldState"])(),
                fortress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshFortressState"])(),
                cityPulse: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(),
                live: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])(),
                forge: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])(),
                nation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])(),
                nationSnapshot: null,
                nationPath: null,
                telemetry: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshTelemetryBook"])(),
                liveWire: null,
                pendingArrival: null,
                cloudPending: false,
                gateOpen: false,
                screen: 'menu',
                hasSave: false,
                // THE RESET IS TOTAL here too: Start Over leaves NOTHING of the old
                // life standing (story/patti/wardrobe/transients — see startNewGame)
                story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshStoryState"])(),
                patti: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPattiState"])(),
                wardrobe: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshWardrobeState"])(),
                isTravelling: false,
                isWorking: false,
                workingLabel: null
            });
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/economy.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Economy System (Stage 3)
 * ---------------------------------------
 * The money layer. Pure, UI-agnostic helpers plus the transaction
 * ledger every earning/spending flow records into.
 *
 * Store actions (addMoney / removeMoney / giveReward) call these —
 * no component ever mutates player.cash directly. The ledger is the
 * same shape a future phone Banking screen will read.
 */ __turbopack_context__.s([
    "canAfford",
    ()=>canAfford,
    "describeReward",
    ()=>describeReward,
    "pushTransaction",
    ()=>pushTransaction,
    "recordTransaction",
    ()=>recordTransaction,
    "rewardCash",
    ()=>rewardCash,
    "sumEarned",
    ()=>sumEarned,
    "sumSpent",
    ()=>sumSpent,
    "transactionsOnDay",
    ()=>transactionsOnDay
]);
function canAfford(cash, amount) {
    return cash >= Math.max(0, amount);
}
let txCounter = 0;
function recordTransaction(label, category, amount, day, slot, id) {
    txCounter += 1;
    return {
        id: id ?? `tx-${day}-${slot}-${txCounter}`,
        day,
        slot,
        label,
        category,
        amount: Math.round(amount)
    };
}
function pushTransaction(list, tx, cap = 50) {
    return [
        tx,
        ...list
    ].slice(0, cap);
}
function sumEarned(list) {
    return list.filter((t)=>t.amount > 0).reduce((s, t)=>s + t.amount, 0);
}
function sumSpent(list) {
    return list.filter((t)=>t.amount < 0).reduce((s, t)=>s + Math.abs(t.amount), 0);
}
function transactionsOnDay(list, day) {
    return list.filter((t)=>t.day === day);
}
function rewardCash(reward) {
    return Math.max(0, Math.round(reward.cash ?? 0));
}
function describeReward(reward) {
    const parts = [];
    const cash = rewardCash(reward);
    if (cash > 0) parts.push(`+₦${cash.toLocaleString('en-NG')}`);
    if (reward.xp && reward.xp > 0) parts.push(`+${reward.xp} XP`);
    const skillEmoji = {
        hustle: '💪',
        smart: '🧠',
        social: '🗣️'
    };
    for (const [skill, xp] of Object.entries(reward.skillXp ?? {})){
        if (xp && xp > 0) parts.push(`${skillEmoji[skill] ?? '⭐'}+${xp}`);
    }
    if (reward.reputation && reward.reputation > 0) parts.push(`⭐+${reward.reputation}`);
    return parts.join(' • ');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/skills.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SKILL_META",
    ()=>SKILL_META,
    "addSkillXp",
    ()=>addSkillXp,
    "skillXpToNext",
    ()=>skillXpToNext
]);
/**
 * LOKOJA LIFE — Skills System (Stage 3)
 * --------------------------------------
 * Skill level + skill XP + progression toward the next skill point.
 * Pure functions — the store applies the results, UI only displays.
 *
 * Caps grow with player level (PROGRESSION.skillCap*) so skills track
 * the player's overall stage in life. Excess XP banks until the cap
 * rises — nothing is lost, nothing is exploitable.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
;
function skillXpToNext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].skillXpPerPoint;
}
function addSkillXp(skillXp, skills, playerLevel, skill, amount) {
    const cap = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapBase + playerLevel * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapPerLevel;
    const perPoint = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].skillXpPerPoint;
    let xp = Math.max(0, skillXp[skill]) + Math.max(0, amount);
    let level = skills[skill];
    let leveledUp = false;
    while(level < cap && xp >= perPoint){
        xp -= perPoint;
        level += 1;
        leveledUp = true;
    }
    const capped = level >= cap && xp >= perPoint;
    if (capped) xp = perPoint; // show a full bar while capped
    return {
        skillXp: {
            ...skillXp,
            [skill]: xp
        },
        skills: {
            ...skills,
            [skill]: level
        },
        leveledUp,
        newLevel: level,
        capped
    };
}
const SKILL_META = {
    hustle: {
        label: 'Hustle',
        emoji: '💪'
    },
    smart: {
        label: 'Smart',
        emoji: '🧠'
    },
    social: {
        label: 'Social',
        emoji: '🗣️'
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/world.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "absoluteSlot",
    ()=>absoluteSlot,
    "advanceWorldClock",
    ()=>advanceWorldClock,
    "nextSlot",
    ()=>nextSlot,
    "rollNewDayWeather",
    ()=>rollNewDayWeather,
    "weatherForSlot",
    ()=>weatherForSlot
]);
/**
 * LOKOJA LIFE — World Clock
 * --------------------------
 * THE single time/weather engine for the whole game (Stage 1 rest,
 * Stage 2 travel, future stages). No other system may advance the
 * clock — everything calls these helpers so time stays coherent.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
;
function nextSlot(t) {
    const idx = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME"].slots.indexOf(t);
    const next = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME"].slots[(idx + 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME"].slots.length];
    return {
        timeOfDay: next,
        dayDelta: next === 'morning' ? 1 : 0
    };
}
function rollNewDayWeather() {
    const entries = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME"].weatherWeights);
    const total = entries.reduce((sum, [, w])=>sum + w, 0);
    let roll = Math.random() * total;
    for (const [weather, weight] of entries){
        roll -= weight;
        if (roll <= 0) return weather;
    }
    return 'sunny';
}
function weatherForSlot(weather, timeOfDay) {
    if (timeOfDay === 'night') return 'night-clear';
    if (weather === 'night-clear') return 'sunny';
    return weather;
}
function advanceWorldClock(timeOfDay, day, weather, slots) {
    let t = timeOfDay;
    let d = day;
    let w = weather;
    for(let i = 0; i < Math.max(0, slots); i++){
        const r = nextSlot(t);
        t = r.timeOfDay;
        d += r.dayDelta;
        w = weatherForSlot(w, t);
    }
    return {
        timeOfDay: t,
        day: d,
        weather: w
    };
}
function absoluteSlot(day, timeOfDay) {
    return (day - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME"].slots.length + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME"].slots.indexOf(timeOfDay);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/world3d.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "describeWalkSettle",
    ()=>describeWalkSettle,
    "walkingEnergyCost",
    ()=>walkingEnergyCost
]);
/**
 * LOKOJA LIFE — 3D World System (Stage 3D increment 2)
 * ------------------------------------------------------
 * The ONE pure bridge between physical walking in the 3D world and
 * the authoritative needs economy. Deterministic, dependency-free,
 * fully unit-tested (scripts/test-world3d.ts).
 *
 * Design rule (Stage 3D brief §4): presentation may MEASURE, but only
 * the store may APPLY. Components accumulate metres; this system turns
 * metres into an energy cost from config; the store applies it through
 * the existing needs engine. No second clock, no ledger duplication.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
;
function walkingEnergyCost(meters) {
    if (!Number.isFinite(meters) || meters <= 0) return 0;
    const billable = Math.max(0, meters - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORLD3D"].freeMeters);
    if (billable === 0) return 0;
    const raw = billable / 100 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORLD3D"].energyPer100m;
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORLD3D"].maxEnergyPerVisit, Math.max(1, Math.round(raw)));
}
function describeWalkSettle(meters, cost) {
    if (cost <= 0) return null;
    const km = (meters / 1000).toFixed(1);
    return `Long trek around Lokoja (${km} km on foot)`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/player.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PLAYER SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1251-1251, 1261-1261, 1486-1621, 2165-2249, 3486-3560, 3898-3912, 4202-4218, 4220-4225, 4247-4268.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "playerSlice",
    ()=>playerSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/economy.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/goals.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/skills.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world3d$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world3d.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
const playerSlice = (set, get)=>({
        player: null,
        goals: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshGoalState"])(),
        /* --------------------------- needs / time ----------------------------- */ rest: (kind)=>{
            const { player, world } = get();
            if (!player || !world) return;
            // busy-guard: no clock-advancing actions mid-shift/mid-travel
            if (get().isWorking || get().isTravelling) return;
            // rest values come from the central config — never hard-coded
            const { energy, hunger, mood, health } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].rest[kind];
            const delta = {
                energy,
                hunger,
                mood,
                health
            };
            // M12 — THE COMFORT LAW: an owned, furnished home restores the body
            // warmer (energy + comfort × the config step; the furnishing mood too)
            let needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(player.needs, delta);
            if (kind === 'sleep') {
                const comfort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["homeComfort"])(get().housing);
                if (comfort > 0) {
                    needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(needs, {
                        energy: comfort * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].housing.sleepEnergyPerComfort
                    });
                }
            }
            let newWorld;
            if (kind === 'nap') {
                const { timeOfDay, dayDelta } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextSlot"])(world.timeOfDay);
                newWorld = {
                    ...world,
                    timeOfDay,
                    day: world.day + dayDelta,
                    weather: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["weatherForSlot"])(world.weather, timeOfDay)
                };
            } else {
                // sleep till next morning — fresh day, fresh weather
                newWorld = {
                    ...world,
                    day: world.day + 1,
                    timeOfDay: 'morning',
                    weather: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rollNewDayWeather"])()
                };
            }
            set({
                player: {
                    ...player,
                    needs
                },
                world: newWorld
            });
            get().notify({
                icon: kind === 'nap' ? '😴' : '🌙',
                text: kind === 'nap' ? 'You took a short nap.' : `Day ${newWorld.day} begins!`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            // M6 — LIVING WORLD: the day the sky turns, the city tells you. A
            // harmattan haze, a confluence thunderstorm or a flood day announces
            // itself, and the weather's mood lands on the same sleep (the config's
            // weatherEffects table finally does its honest work).
            if (kind === 'sleep') {
                const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WEATHER_META"][newWorld.weather];
                const moodHit = Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIME"].weatherEffects[newWorld.weather]?.mood ?? 0) * (get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].weatherMoodMult : 1));
                const p0 = get().player;
                if (p0 && moodHit !== 0) {
                    set({
                        player: {
                            ...p0,
                            needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                                mood: moodHit
                            })
                        }
                    });
                }
                if (meta?.dayNote) {
                    get().notify({
                        icon: meta.icon === 'flood' ? '🌊' : meta.icon === 'storm' ? '⛈️' : '🌫️',
                        text: meta.dayNote,
                        tone: 'neutral'
                    });
                }
            }
            // M2 — the civic mesh rolls as the day (or days) turn
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitCivicDays"])(get, set, world.day, newWorld.day);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        advanceTime: (slots = 1)=>{
            const { player, world } = get();
            if (!world) return;
            const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(world.timeOfDay, world.day, world.weather, slots);
            // INC 4 — the body quietly spends itself while the clock runs
            const player2 = player ? {
                ...player,
                needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])(player.needs, slots)
            } : player;
            set({
                player: player2,
                world: {
                    ...world,
                    ...clock
                }
            });
            // M2 — slots can cross midnight; the civic mesh follows the day
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitCivicDays"])(get, set, world.day, clock.day);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** INC 4 — home downtime: watch TV or freshen up. Costs one honest clock
   *  slot (time really passes) + small needs shift from INTERIOR config. */ relaxIndoors: (kind)=>{
            const { player, world, civic } = get();
            if (!player || !world) return;
            // busy-guard: no clock-advancing actions mid-shift/mid-travel
            if (get().isWorking || get().isTravelling) return;
            // M2 — load-shedding is real: no light, no TV. M8 — a blown transformer
            // is darker still: the whole feeder is down, the screen is furniture.
            if (kind === 'tv') {
                const darkHome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blackoutAt"])(get().chaos, 'home', world.day);
                if (civic?.nepa.shedding || darkHome) {
                    get().notify({
                        icon: '🔌',
                        text: darkHome ? 'Transformer don blow for your area — the TV just dey look you. E no get light to show anything.' : 'NEPA don take the light — the TV just dey look you. Settle the bill first.',
                        tone: 'bad'
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                    return;
                }
            }
            const r = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].relax[kind];
            const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["slotDecay"])(get, player.needs, 1), r);
            const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(world.timeOfDay, world.day, world.weather, 1);
            set({
                player: {
                    ...player,
                    needs
                },
                world: {
                    ...world,
                    ...clock
                }
            });
            get().notify({
                icon: kind === 'tv' ? '📺' : '🚿',
                text: kind === 'tv' ? 'You relaxed with some TV.' : 'You freshened up. Feeling sharp.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** Stage 3D — walking in the 3D world costs a little energy past the free
   *  allowance. Pure system computes the cost from WORLD3D config; the needs
   *  engine applies it. No clock change (walking is not travelling). */ settleWorldWalk: (meters)=>{
            const { player } = get();
            if (!player) return;
            const cost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world3d$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walkingEnergyCost"])(meters);
            if (cost <= 0) return;
            const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(player.needs, {
                energy: -cost
            });
            set({
                player: {
                    ...player,
                    needs
                }
            });
            const label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world3d$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["describeWalkSettle"])(meters, cost);
            if (label) {
                get().notify({
                    icon: '🚶',
                    text: `${label} — ${cost} energy spent.`,
                    tone: 'neutral'
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        setAvatar: (avatar)=>{
            const { player } = get();
            if (!player) return;
            set({
                player: {
                    ...player,
                    avatar: {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"],
                        ...avatar
                    }
                }
            });
            get().notify({
                icon: '👕',
                text: 'Fresh look don land. Who be this?',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        workout: ()=>{
            const { player, world } = get();
            if (!player || !world) return;
            // busy-guard: no clock-advancing actions mid-shift/mid-travel
            if (get().isWorking || get().isTravelling) return;
            const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(player.needs, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].gym), 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
            const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(world.timeOfDay, world.day, world.weather, 1);
            set({
                player: {
                    ...player,
                    needs
                },
                world: {
                    ...world,
                    ...clock
                }
            });
            get().notify({
                icon: '💪',
                text: 'Gym session done. Body dey thank you.',
                tone: 'good'
            });
            get().bumpGoal('workout');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        study: (label)=>{
            const { player, world } = get();
            if (!player || !world) return;
            // busy-guard: no clock-advancing actions mid-shift/mid-travel
            if (get().isWorking || get().isTravelling) return;
            const cfg = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].study;
            // M13 — education-first: young bands' brains harvest the boost
            const boost = player.ageBand === 'adult' ? 1 : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIELD"].studyBoost;
            const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(player.needs, cfg), 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
            const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(world.timeOfDay, world.day, world.weather, 1);
            set({
                player: {
                    ...player,
                    needs
                },
                world: {
                    ...world,
                    ...clock
                }
            });
            // the skill gain flows through the SAME authority every other XP uses
            get().addSkillXp('smart', Math.round(cfg.smartXp * boost));
            get().notify({
                icon: '📚',
                text: boost > 1 ? `${label ?? 'Lesson'} done. Young brain dey sharp ×${boost}.` : `${label ?? 'Lesson'} done. Brain dey sharp.`,
                tone: 'good'
            });
            get().bumpGoal('study');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        nightOut: ()=>{
            const { player, world } = get();
            if (!player || !world) return;
            // M13 — THE FAMILY SHIELD: the night lounge is crime-adjacent, 18+ only
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["crimeAllowed"])(player.ageBand, 'night-out')) {
                get().notify({
                    icon: '🛡️',
                    text: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CRIME_REFUSALS"]['night-out'],
                    tone: 'neutral'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                return;
            }
            const isNight = world.timeOfDay === 'evening' || world.timeOfDay === 'night';
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAfford"])(player.cash, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].NIGHT_OUT.cost)) {
                get().notify({
                    icon: '🍾',
                    text: `Night out costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].NIGHT_OUT.cost)} — pocket no reach today.`,
                    tone: 'bad'
                });
                return;
            }
            const ok = get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].NIGHT_OUT.cost, {
                label: 'Night out at the lounge',
                category: 'fun'
            });
            if (!ok) return;
            const paid = get().player;
            if (!paid) return;
            const shift = {
                ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].lounge,
                mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].lounge.mood + (isNight ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].NIGHT_OUT.nightMoodBonus : 0)
            };
            const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(paid.needs, shift), 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
            const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(world.timeOfDay, world.day, world.weather, 1);
            set({
                player: {
                    ...paid,
                    needs
                },
                world: {
                    ...world,
                    ...clock
                }
            });
            get().notify({
                icon: '🍾',
                text: isNight ? 'Night life done you well. Lokoja no go sleep tonight!' : 'Small chill for the lounge. Evening own go pass this one.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** Stage 4 — the eating loop. A meal costs REAL cash (ledger entry), fills
   *  hunger, lifts mood, tops a little energy, and the clock moves one slot
   *  (eating takes time). Same authority pattern as rest/travel.
   *  M6 — night dishes are the night market's alone: right stall, after dark,
   *  priced by the seeded night discount — refused honestly otherwise. */ eatMeal: (mealKey, atLocationId)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const meal = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MEAL_BY_KEY"][mealKey];
            if (!meal) return false;
            const spot = atLocationId ?? world.currentLocation;
            if (meal.night && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mealAvailableAt"])(true, spot, world.timeOfDay)) {
                get().notify({
                    icon: '🌙',
                    text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNightMarketOpen"])(world.timeOfDay) ? `${meal.label} na night-market food — e dey the Food Strip.` : `${meal.label} dey wake after dark — the night market no open yet.`,
                    tone: 'neutral'
                });
                return false;
            }
            // M2 — markets breathe: today's honest price at this spot (base outside markets)
            let civic = get().civic ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCivicState"])();
            const rolled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketForDay"])(civic, world.day, world.weather);
            if (rolled !== civic) {
                civic = rolled;
                set({
                    civic
                });
            }
            const price = meal.night ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nightMealPrice"])(meal.price, world.day) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketMealPrice"])(meal.price, mealKey, spot, civic, world.day);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAfford"])(player.cash, price)) {
                get().notify({
                    icon: '🍲',
                    text: `${meal.label} costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(price)}${price !== meal.price ? ' today' : ''} — you no carry enough cash.`,
                    tone: 'bad'
                });
                return false;
            }
            // ledger label: eaten there, or delivered to where you actually are
            const spotName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][spot]?.name ?? 'Lokoja';
            const delivered = atLocationId !== undefined && atLocationId !== world.currentLocation;
            const label = delivered ? `${meal.label} — delivery to ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation]?.name ?? 'home'}` : `${meal.label} at ${spotName}`;
            // pay first — the ledger remembers every plate
            const ok = get().removeMoney(price, {
                label,
                category: 'shop'
            });
            if (!ok) return false;
            // re-read AFTER payment — removeMoney already updated the player object
            const paid = get().player;
            if (!paid) return false;
            const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(paid.needs, {
                hunger: meal.hunger,
                mood: meal.mood + ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIftarHour"])(world.day, world.timeOfDay) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].iftarMood : 0),
                energy: meal.energy
            }), 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
            const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(world.timeOfDay, world.day, world.weather, 1);
            set({
                player: {
                    ...paid,
                    needs
                },
                world: {
                    ...world,
                    ...clock
                }
            });
            get().notify({
                icon: '🍲',
                text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isIftarHour"])(world.day, world.timeOfDay) ? `${meal.label} — iftar blessing! The fast don break proper.` : `${meal.label} — hunger restored. You feel better.`,
                tone: 'good'
            });
            get().bumpGoal('meal');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'meal');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        addSkillXp: (skill, amount)=>{
            const { player } = get();
            if (!player || amount <= 0) return;
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addSkillXp"])(player.skillXp, player.skills, player.level, skill, amount);
            set({
                player: {
                    ...player,
                    skillXp: result.skillXp,
                    skills: result.skills
                }
            });
            if (result.leveledUp) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                get().notify({
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKILL_META"][skill].emoji,
                    text: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKILL_META"][skill].label} is now Level ${result.newLevel}!`,
                    tone: 'good'
                });
            }
        },
        addXp: (amount)=>{
            const { player } = get();
            if (!player || amount <= 0) return;
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addXp"])(player.xp, player.level, amount);
            set({
                player: {
                    ...player,
                    xp: result.xp,
                    level: result.level
                }
            });
            if (result.leveledUp) {
                set({
                    shockwave: get().shockwave + 1
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
                get().notify({
                    icon: '🎉',
                    text: `Level up! You are now Level ${result.level}.`,
                    tone: 'good'
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        addReputation: (amount)=>{
            const { player } = get();
            if (!player || amount === 0) return;
            set({
                player: {
                    ...player,
                    reputation: Math.max(0, player.reputation + amount)
                }
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** M9 — one life event lands on today's goals; completions pay the engines. */ bumpGoal: (kind)=>{
            const { player, world, goals } = get();
            if (!player || !world) return;
            const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpGoal"])(goals, kind, world.day);
            if (res.completed.length === 0) {
                if (res.next !== goals) set({
                    goals: res.next
                });
                return;
            }
            set({
                goals: res.next
            });
            for (const g of res.completed){
                get().addMoney(g.cash, {
                    label: `Daily goal — ${g.label}`,
                    category: 'tip'
                });
                get().addXp(g.xp);
                get().notify({
                    icon: '🎯',
                    text: `Goal complete — ${g.label} (+${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(g.cash)})`,
                    tone: 'good'
                });
            }
            if (res.perfectDay) {
                get().notify({
                    icon: '🔥',
                    text: `PERFECT DAY! Goal streak don reach ${res.next.streak}.`,
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/vehicles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Vehicle Catalog (Stage 5)
 * ----------------------------------------
 * What you can own and drive in the 3D world. Prices are calibrated to
 * the existing hustle/job economy (₦350–₦800 per hustle, jobs a few
 * thousand a shift) — an okada is a real mid-game goal, a danfo is a
 * late-game flex. All presentation (meshes, speed feel, sounds) lives
 * in the 3D layer; this file is pure data + purchase authority.
 */ __turbopack_context__.s([
    "VEHICLES",
    ()=>VEHICLES,
    "VEHICLE_BY_MODEL",
    ()=>VEHICLE_BY_MODEL,
    "generatePlate",
    ()=>generatePlate
]);
const VEHICLES = [
    {
        model: 'okada',
        label: 'Okada (Motorcycle)',
        short: 'Okada',
        emoji: '🏍️',
        price: 85_000,
        description: 'The people\'s engine. Slip through traffic, own the back streets.',
        topSpeed: 9.5,
        accel: 6.5,
        handling: 1.25
    },
    {
        model: 'keke',
        label: 'Keke Napep (Tricycle)',
        short: 'Keke',
        emoji: '🛺',
        price: 180_000,
        description: 'Yellow-and-green hustle. Steady, honest, everywhere welcome.',
        topSpeed: 7.5,
        accel: 4.2,
        handling: 1.0
    },
    {
        model: 'taxi',
        label: 'Taxi (Saloon Car)',
        short: 'Taxi',
        emoji: '🚕',
        price: 420_000,
        description: 'Four doors and a meter. Respect arrives before you do.',
        topSpeed: 11,
        accel: 5.0,
        handling: 0.9
    },
    {
        model: 'danfo',
        label: 'Danfo (Minibus)',
        short: 'Danfo',
        emoji: '🚐',
        price: 750_000,
        description: 'A moving enterprise. When you buy this one, Lokoja knows your name.',
        topSpeed: 9,
        accel: 3.4,
        handling: 0.72
    }
];
const VEHICLE_BY_MODEL = Object.fromEntries(_c1 = VEHICLES.map(_c = (v)=>[
        v.model,
        v
    ]));
_c2 = VEHICLE_BY_MODEL;
function generatePlate(model, day, index) {
    void model;
    void day;
    void index;
    const letters = 'ABCDEFGHJKLMN';
    const l1 = letters[Math.floor(Math.random() * letters.length)];
    const l2 = letters[Math.floor(Math.random() * letters.length)];
    const digits = 100 + Math.floor(Math.random() * 900);
    return `LKO-${digits}-${l1}${l2}`;
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "VEHICLE_BY_MODEL$Object.fromEntries$VEHICLES.map");
__turbopack_context__.k.register(_c1, "VEHICLE_BY_MODEL$Object.fromEntries");
__turbopack_context__.k.register(_c2, "VEHICLE_BY_MODEL");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/travelEvents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Travel Events
 * ----------------------------
 * Small flavour occurrences that can roll during any completed trip
 * (Stage 2). This is the seed of the reusable event framework — Stage 3's
 * hustle/opportunity system and Stage 5's gist system will extend this
 * same shape with their own catalogues.
 *
 * Rules:
 *  - effects are small and configured here, never hard-coded in UI
 *  - `requiresWeather` / `requiresTransport` gate eligibility
 *  - `weight` drives the weighted random pick
 */ __turbopack_context__.s([
    "TRAVEL_EVENTS",
    ()=>TRAVEL_EVENTS
]);
const TRAVEL_EVENTS = [
    {
        id: 'rain-delay',
        icon: '🌧️',
        title: 'Rain on the road',
        description: 'Rain started while you were travelling. You sheltered small before continuing.',
        tone: 'bad',
        weight: 3,
        requiresWeather: [
            'rain'
        ],
        extraMinutes: 10,
        energyDelta: -2
    },
    {
        id: 'traffic',
        icon: '🚗',
        title: 'Go-slow',
        description: 'Traffic slowed your journey near the junction. Lokoja go-slow is not Lagos own — but it still bites.',
        tone: 'bad',
        weight: 3,
        extraMinutes: 8,
        moodDelta: -2
    },
    {
        id: 'keke-stop',
        icon: '🛺',
        title: 'Keke refuel stop',
        description: 'The keke driver stopped to buy fuel mid-road. You waited, legs pressed against the rail.',
        tone: 'neutral',
        weight: 2,
        requiresTransport: [
            'keke'
        ],
        extraMinutes: 6
    },
    {
        id: 'quick-tip',
        icon: '🙌',
        title: 'Quick help, quick tip',
        description: 'Someone nearby needed help with a heavy load. You assisted small — and they gave you a tip.',
        tone: 'good',
        weight: 2,
        extraMinutes: 5,
        cashDelta: 250,
        xpDelta: 8,
        moodDelta: 3
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/travel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateTravel",
    ()=>calculateTravel,
    "mapDistanceKm",
    ()=>mapDistanceKm,
    "rollTravelEvent",
    ()=>rollTravelEvent
]);
/**
 * LOKOJA LIFE — Travel System (Stage 2)
 * --------------------------------------
 * Pure, deterministic travel maths. The store calls these before moving
 * the player; UI reads plans for the confirmation sheet. Nothing here
 * mutates game state — application happens through store actions only.
 *
 * Every number comes from the central config (ECONOMY.transport, TRAVEL,
 * location.travelModifier) — no hard-coded fares or speeds.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$travelEvents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/travelEvents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-client] (ecmascript)");
;
;
;
function mapDistanceKm(a, b) {
    const dx = b.mapX - a.mapX;
    const dy = b.mapY - a.mapY;
    return Math.hypot(dx, dy) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].kmPerMapUnit;
}
function calculateTravel(origin, destination, transport, weather, currentTimeOfDay, fuelMult = 1, minutesMult = 1) {
    const params = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ECONOMY"].transport[transport];
    const km = mapDistanceKm(origin, destination);
    const locationMod = destination.travelModifier ?? 1;
    const weatherMod = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].weatherMinutesMultiplier[weather]?.[transport] ?? 1;
    // fare = base + distance rate, rounded to the configured naira step
    // (personal rides pay the PUMP: the surge multiplies their cost only)
    const rawFare = (params.cost.base + params.cost.perKm * km) * (transport.startsWith('own-') ? fuelMult : 1);
    const cost = Math.round(rawFare / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding;
    // minutes: distance × speed × location × weather × road quality
    // (M10 — the town union's paved streets ride the last multiplier)
    const baseMinutes = km * params.minutesPerKm;
    const minutes = Math.max(1, Math.round(baseMinutes * locationMod * weatherMod * minutesMult));
    // energy: distance × rate × location modifier (walking uphill costs!)
    const energyCost = Math.max(1, Math.round(km * params.energyPerKm * locationMod));
    const slots = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].slotsPerTrip;
    const arrival = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(currentTimeOfDay, 0, weather, slots);
    return {
        originId: origin.id,
        destinationId: destination.id,
        transport,
        distanceKm: km,
        cost,
        baseMinutes: Math.round(baseMinutes),
        weatherModifier: weatherMod,
        minutes,
        energyCost,
        slots,
        arrival: {
            timeOfDay: arrival.timeOfDay,
            dayDelta: arrival.day
        }
    };
}
function rollTravelEvent(transport, weather) {
    if (Math.random() >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].eventChance) return null;
    const eligible = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$travelEvents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL_EVENTS"].filter((e)=>{
        if (e.requiresWeather && !e.requiresWeather.includes(weather)) return false;
        if (e.requiresTransport && !e.requiresTransport.includes(transport)) return false;
        return true;
    });
    if (eligible.length === 0) return null;
    const total = eligible.reduce((sum, e)=>sum + e.weight, 0);
    let roll = Math.random() * total;
    for (const e of eligible){
        roll -= e.weight;
        if (roll <= 0) return e;
    }
    return eligible[eligible.length - 1] ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/garage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "allTravelOptions",
    ()=>allTravelOptions,
    "canPersonalReach",
    ()=>canPersonalReach,
    "personalModelOf",
    ()=>personalModelOf,
    "personalTransportId",
    ()=>personalTransportId,
    "personalTransportsFor",
    ()=>personalTransportsFor,
    "publicCounterpartId",
    ()=>publicCounterpartId,
    "resaleValue",
    ()=>resaleValue,
    "transportAllowed",
    ()=>transportAllowed
]);
/**
 * LOKOJA LIFE — Garage System (M4: THE GARAGE)
 * ---------------------------------------------
 * Pure, deterministic laws that connect the vehicles you OWN to the map
 * you TRAVEL. Before M4 a bought okada was a garage ornament: the 2D map
 * still charged keke fares. Now ownership is an economy:
 *
 *   • your rides appear as personal transport options (own-okada, …)
 *   • fuel replaces the fare — always cheaper than the public rate
 *   • every destination says which vehicles can physically reach it
 *     (a keke-accessible street takes okadas; only taxi roads take cars)
 *   • resale value depreciates deterministically from the buy day
 *
 * Nothing here mutates state — the store applies outcomes through its
 * own actions. Every constant traces to data/vehicles.ts or
 * data/config.ts ECONOMY.transport — no magic numbers.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/travel.ts [app-client] (ecmascript)");
;
;
;
function personalTransportId(model) {
    return `own-${model}`;
}
function personalModelOf(t) {
    if (!t.startsWith('own-')) return null;
    return t.slice(4);
}
/* ---------------------------------- access law --------------------------------- */ /**
 * Which public road class a personal vehicle needs. Bikes and tricycles
 * go anywhere a keke can reach (back streets included); cars and the
 * danfo need real car roads.
 */ const COUNTERPART = {
    okada: 'keke',
    keke: 'keke',
    taxi: 'taxi',
    danfo: 'taxi'
};
function canPersonalReach(destination, model) {
    return destination.transport.includes(COUNTERPART[model]);
}
function publicCounterpartId(model) {
    return COUNTERPART[model];
}
function personalTransportsFor(vehicles) {
    const owned = new Set(vehicles.map((v)=>v.model));
    const order = [
        'okada',
        'keke',
        'taxi',
        'danfo'
    ];
    return order.filter((m)=>owned.has(m)).map(personalTransportId);
}
function transportAllowed(destination, transport, vehicles) {
    const model = personalModelOf(transport);
    if (model === null) return destination.transport.includes(transport);
    return vehicles.some((v)=>v.model === model) && canPersonalReach(destination, model);
}
function allTravelOptions(origin, destination, weather, timeOfDay, vehicles, fuelMult = 1, minutesMult = 1) {
    const options = destination.transport.map((t)=>{
        const params = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ECONOMY"].transport[t];
        return {
            transport: t,
            plan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTravel"])(origin, destination, t, weather, timeOfDay, 1, minutesMult),
            personal: false,
            label: params.label,
            emoji: params.emoji
        };
    });
    for (const t of personalTransportsFor(vehicles)){
        const model = personalModelOf(t);
        if (model === null || !canPersonalReach(destination, model)) continue;
        const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model];
        options.push({
            transport: t,
            plan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTravel"])(origin, destination, t, weather, timeOfDay, fuelMult, minutesMult),
            personal: true,
            label: `Your ${def.short}`,
            emoji: def.emoji
        });
    }
    return options;
}
function resaleValue(model, boughtDay, today) {
    const age = Math.max(0, today - boughtDay);
    const rate = Math.max(0.35, 0.62 - 0.015 * age);
    return Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model].price * rate / 100) * 100;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/world.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * WORLD SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1252-1252, 1256-1257, 1286-1286, 2381-2635, 2637-2904, 3562-3757.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "worldSlice",
    ()=>worldSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/economy.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/guest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/travel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
const worldSlice = (set, get)=>({
        world: null,
        calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCalendarState"])(),
        rivers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshRiversState"])(),
        isTravelling: false,
        /* --------------------- M10 — the living calendar ---------------------- */ /** Join today's festival in person — mood, rep where it is due, and the
   *  crowd's seeded naira spray. Venue-gated, once per festival-day. */ attendFestival: ()=>{
            const { player, world, calendar } = get();
            if (!player || !world) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAttendFestival"])(calendar, world.day, world.currentLocation);
            if (!gate.ok || !gate.festival) {
                get().notify({
                    icon: '🎉',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            const f = gate.festival;
            const after = {
                ...calendar,
                attended: [
                    ...calendar.attended,
                    `${world.day}:${f.id}`
                ],
                stats: {
                    ...calendar.stats,
                    festivalsAttended: calendar.stats.festivalsAttended + 1
                }
            };
            set({
                calendar: after
            });
            const p0 = get().player;
            const rep = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.repFestivals.includes(f.id) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.rep : 0;
            const spray = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attendSprayFor"])(world.day, f.id);
            set({
                player: {
                    ...p0,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                        mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.mood
                    }),
                    reputation: Math.max(0, p0.reputation + rep),
                    cash: p0.cash + spray,
                    transactions: [
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(`Naira spray — ${f.name}`, 'tip', spray, world.day, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay)),
                        ...p0.transactions
                    ].slice(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]),
                    stats: {
                        ...p0.stats,
                        totalEarned: p0.stats.totalEarned + spray
                    }
                }
            });
            get().notify({
                icon: f.icon,
                text: rep > 0 ? `You don attend ${f.name}! The street see you — +${rep} rep, and the crowd spray ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(spray)}.` : `You don attend ${f.name}! Mood don lift, and the crowd spray ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(spray)}.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('festival'); // F2 — the spray rides its own pattern ('festival' was defined in haptics.ts:19 but never fired)
            get().bumpGoal('festival');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Buy a ram at the Kpata ram market — the butcher cuts 6 meat packs. */ buyRam: ()=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canBuyRam"])(world.day, world.currentLocation, player.cash);
            if (!gate.ok) {
                get().notify({
                    icon: '🐏',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(gate.price, {
                label: 'Ram — Sallah',
                category: 'shop'
            })) {
                get().notify({
                    icon: '🐏',
                    text: `The ram na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gate.price)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buyRamApply"])(get().calendar)
            });
            get().notify({
                icon: '🐏',
                text: `Ram don land — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].meatPacksPerRam} meat packs ready. Share am around before the season pass.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Share a meat pack with a paddy — +familiarity, +mood, +rep, once each. */ shareMeat: (npcId)=>{
            const { player, world, calendar } = get();
            if (!player || !world) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canShareMeat"])(calendar, world.day, npcId);
            if (!gate.ok) {
                get().notify({
                    icon: '🍖',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            set({
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareMeatApply"])(calendar, world.day, npcId)
            });
            const rel = player.relationships[npcId];
            const nextFam = Math.min(100, (rel?.familiarity ?? 0) + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].meatShareFamiliarity);
            const p0 = get().player;
            set({
                player: {
                    ...p0,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                        mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].meatShareMood
                    }),
                    reputation: p0.reputation + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].meatShareRep,
                    relationships: {
                        ...p0.relationships,
                        [npcId]: {
                            familiarity: nextFam,
                            lastChatDay: rel?.lastChatDay ?? 0,
                            lastGiftDay: rel?.lastGiftDay ?? 0,
                            lastHangoutDay: rel?.lastHangoutDay ?? 0
                        }
                    }
                }
            });
            const npcName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][npcId]?.name ?? npcId;
            get().notify({
                icon: '🍖',
                text: `Meat don reach ${npcName} hand — blessing dey flow. (+${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].meatShareFamiliarity} familiarity)`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Sponsor a regatta crew — ₦2k on the shoreline, the trophy pays back. */ sponsorBoat: (teamId)=>{
            const { player, world, calendar } = get();
            if (!player || !world) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canSponsor"])(calendar, world.day, world.currentLocation, teamId);
            if (!gate.ok) {
                get().notify({
                    icon: '🚤',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorFee, {
                label: `Regatta sponsorship — ${teamId}`,
                category: 'fun'
            })) {
                get().notify({
                    icon: '🚤',
                    text: `Sponsorship na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorFee)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sponsorApply"])(get().calendar, world.day, teamId)
            });
            get().notify({
                icon: '🚤',
                text: `You don sponsor ${teamId}! If they carry the trophy, ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorWinPayout)} dey wait you.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Back a boat on race-eve — adults only; the bookie settles the morning after. */ betBoat: (teamId, tier)=>{
            const { player, world, calendar } = get();
            if (!player || !world) return false;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].betTiers.includes(tier)) return false;
            // M13 — the family shield reads the CHARACTER's life stage (the honest law)
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canBet"])(calendar, world.day, world.currentLocation, player.ageBand);
            if (!gate.ok) {
                get().notify({
                    icon: '🎲',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(tier, {
                label: `Regatta bet — ${teamId}`,
                category: 'fun'
            })) {
                get().notify({
                    icon: '🎲',
                    text: `The stake na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["betApply"])(get().calendar, world.day, teamId, tier)
            });
            get().notify({
                icon: '🎲',
                text: `Stake don drop on ${teamId} — if they win, ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(Math.round(tier * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].betOdds))} dey wait you tomorrow morning.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Buy the wedding fabric at Kpata — the aunties respect the uniform. */ buyAsoEbi: ()=>{
            const { player, world, calendar } = get();
            if (!player || !world) return false;
            const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["weddingForCycle"])(world.day);
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canBuyAsoEbi"])(calendar, world.day, world.currentLocation, wedding);
            if (!gate.ok) {
                get().notify({
                    icon: '👗',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].asoEbiPrice, {
                label: `Aso-ebi — ${wedding.couple} wedding`,
                category: 'shop'
            })) {
                get().notify({
                    icon: '👗',
                    text: `The fabric na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].asoEbiPrice)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buyAsoEbiApply"])(get().calendar, wedding.id)
            });
            get().notify({
                icon: '👗',
                text: `Aso-ebi don set for ${wedding.couple} wedding — you go shine for the canopy.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Attend today's wedding with a gift — aso-ebi doubles the respect. */ attendWedding: (giftTier)=>{
            const { player, world, calendar } = get();
            if (!player || !world) return false;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingGiftTiers.includes(giftTier)) return false;
            const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["weddingForCycle"])(world.day);
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAttendWedding"])(calendar, world.currentLocation, wedding);
            if (!gate.ok) {
                get().notify({
                    icon: '💍',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(giftTier, {
                label: `Wedding gift — ${wedding.couple}`,
                category: 'fun'
            })) {
                get().notify({
                    icon: '💍',
                    text: `The gift na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(giftTier)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            const hasAsoEbi = calendar.asoEbi.includes(wedding.id);
            const rep = hasAsoEbi ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingRepAsoEbi : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingRep;
            set({
                calendar: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attendWeddingApply"])(get().calendar, wedding.id)
            });
            const p0 = get().player;
            set({
                player: {
                    ...p0,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                        mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingMood
                    }),
                    reputation: p0.reputation + rep
                }
            });
            get().notify({
                icon: '💍',
                text: hasAsoEbi ? `You don flex the aso-ebi at ${wedding.couple} wedding — the aunties dey nod. (+${rep} rep, mood don high)` : `You don attend ${wedding.couple} wedding. Next time buy the aso-ebi — the aunties dey look.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            get().bumpGoal('festival');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Give to the town union's paving pool — a smooth road repays everybody. */ contributePaving: (tier)=>{
            const { player, world, calendar } = get();
            if (!player || !world) return false;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTiers.includes(tier)) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canContributePaving"])(calendar, world.day, world.currentLocation);
            if (!gate.ok) {
                get().notify({
                    icon: '🛣️',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][calendar.paving.zoneId]?.name ?? calendar.paving.zoneId;
            if (!get().removeMoney(tier, {
                label: `Street paving fund — ${zoneName}`,
                category: 'other'
            })) {
                get().notify({
                    icon: '🛣️',
                    text: `Contribution na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            const after = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contributePavingApply"])(get().calendar, world.day, tier);
            set({
                calendar: after
            });
            const need = Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTarget - after.paving.pool);
            get().notify({
                icon: '🛣️',
                text: need <= 0 ? `Pool don complete! The union crew go finish ${zoneName} tomorrow morning.` : `You drop ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(need)} more and ${zoneName} road go smooth.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /* --------------------- M11 — THE RIVERS AWAKE --------------------- */ /** The Crusher sells sand on the Patti road — sacks for the walkways. */ buySand: (sacks)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const count = Math.max(1, Math.min(10, Math.floor(sacks)));
            if (world.currentLocation !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].sandVendorZone) {
                get().notify({
                    icon: '⛰️',
                    text: 'The Crusher dey sell sand for the Patti road — go there in person.',
                    tone: 'bad'
                });
                return false;
            }
            const cost = count * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].sackPrice;
            if (!get().removeMoney(cost, {
                label: `Crusher sand ×${count}`,
                category: 'shop'
            })) {
                get().notify({
                    icon: '💸',
                    text: `${count} sack${count > 1 ? 's' : ''} na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(cost)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            const riv = get().rivers;
            set({
                rivers: {
                    ...riv,
                    sandbags: riv.sandbags + count,
                    stats: {
                        ...riv.stats,
                        sandBought: riv.stats.sandBought + count
                    }
                }
            });
            get().notify({
                icon: '🧱',
                text: `${count} sack${count > 1 ? 's' : ''} of Crusher sand don land for your compound — the walkway dey wait.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Lay one walkway segment in the cut zone you stand in. */ laySegment: ()=>{
            const { player, world, rivers } = get();
            if (!player || !world) return false;
            const zoneId = world.currentLocation;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canLaySegment"])(rivers, world.day, zoneId, world.currentLocation, rivers.sandbags);
            if (!gate.ok) {
                get().notify({
                    icon: '🌊',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (player.needs.energy < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].layEnergy) {
                get().notify({
                    icon: '🥵',
                    text: 'Wading with sand on your head dey chop energy — rest small first.',
                    tone: 'bad'
                });
                return false;
            }
            const p0 = get().player;
            set({
                player: {
                    ...p0,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                        energy: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].layEnergy
                    })
                }
            });
            const after = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["laySegmentApply"])(get().rivers, zoneId);
            set({
                rivers: after
            });
            const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][zoneId]?.name ?? zoneId;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["segmentsLeft"])(after, zoneId) === 0) {
                get().notify({
                    icon: '🛤️',
                    text: `THE WALKWAY DEY OPEN! ${zoneName} crossing don complete — set your toll and collect.`,
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            } else {
                get().notify({
                    icon: '🧱',
                    text: `One more segment stand — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["segmentsLeft"])(after, zoneId)} left for ${zoneName}.`,
                    tone: 'neutral'
                });
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Set the crossing toll tier on the walkway you stand on. */ setTollTier: (tierIndex)=>{
            const { world, rivers } = get();
            if (!world) return false;
            const zoneId = world.currentLocation;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walkwayOpen"])(rivers, zoneId)) {
                get().notify({
                    icon: '🛤️',
                    text: 'Finish the walkway first — then the toll bowl dey open.',
                    tone: 'bad'
                });
                return false;
            }
            set({
                rivers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTollTierApply"])(rivers, zoneId, tierIndex)
            });
            const tier = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers.length - 1, Math.max(0, tierIndex))];
            get().notify({
                icon: '🎫',
                text: `Crossing toll na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} now — the walkers go pay into your bowl.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Collect the toll bowl of the walkway you stand on. */ collectTolls: ()=>{
            const { world, rivers } = get();
            if (!world) return false;
            const zoneId = world.currentLocation;
            const w = rivers.walkways[zoneId];
            if (!w || w.pot <= 0) {
                get().notify({
                    icon: '🎫',
                    text: 'The toll bowl dey empty — the crossings go fill am.',
                    tone: 'neutral'
                });
                return false;
            }
            const amount = Math.round(w.pot);
            set({
                rivers: {
                    ...rivers,
                    walkways: {
                        ...rivers.walkways,
                        [zoneId]: {
                            ...w,
                            pot: 0
                        }
                    },
                    stats: {
                        ...rivers.stats,
                        tollsCollected: rivers.stats.tollsCollected + amount
                    }
                }
            });
            get().addMoney(amount, {
                label: `Crossing tolls — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][zoneId]?.name ?? zoneId} walkway`,
                category: 'hustle'
            });
            get().notify({
                icon: '💰',
                text: `You collect ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amount)} from the toll bowl — the walkers dey pay.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Buy the fishermen's canoe at the jetty (unlocks the ferry gigs). */ buyCanoe: ()=>{
            const { player, world, rivers } = get();
            if (!player || !world) return false;
            if (world.currentLocation !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JETTY_ID"]) {
                get().notify({
                    icon: '🛶',
                    text: 'The fishermen dey sell canoes at the Motor Park jetty.',
                    tone: 'bad'
                });
                return false;
            }
            if (rivers.canoe) {
                get().notify({
                    icon: '🛶',
                    text: 'You already get canoe — one boat, one hustler.',
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].canoeCost, {
                label: 'Fisherman’s canoe',
                category: 'shop'
            })) {
                get().notify({
                    icon: '💸',
                    text: `The canoe na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].canoeCost)} — the fishermen no dey take credit.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                rivers: {
                    ...rivers,
                    canoe: true
                }
            });
            get().notify({
                icon: '🛶',
                text: 'The canoe don land! When the river rise, the ferry board go pay you like a landlord.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Ride the canoe ferry across the water (jetty ↔ a cut zone). */ takeFerry: (toId)=>{
            const { player, world } = get();
            if (!player || !world) return;
            // busy-guard: no clock-advancing actions mid-shift/mid-travel
            if (get().isWorking || get().isTravelling) return;
            const from = world.currentLocation;
            const destination = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][toId];
            if (!destination || from === toId) return;
            // the water's route law: jetty → a cut zone, or a cut zone → the return jetty
            const goingIn = from === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JETTY_ID"] && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zoneCut"])(world.day, toId);
            const goingOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zoneCut"])(world.day, from) && toId === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].cutReturnId;
            if (!goingIn && !goingOut) {
                get().notify({
                    icon: '🛶',
                    text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zoneCut"])(world.day, toId) ? 'The canoes dey wait at the Motor Park jetty.' : 'The canoe no dey go there — that road dey dry, waka or ride.',
                    tone: 'neutral'
                });
                return;
            }
            const fare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ferryFareBetween"])(from, toId, world.day);
            const energyCost = Math.ceil(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].ferryEnergy / 2);
            if (player.cash < fare) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '💸',
                    text: `The fishermen want ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(fare)} for the crossing — water no dey take credit.`,
                    tone: 'bad'
                });
                return;
            }
            if (player.needs.energy < energyCost) {
                get().notify({
                    icon: '🥵',
                    text: 'You are too tired for the crossing. Rest small.',
                    tone: 'bad'
                });
                return;
            }
            set({
                isTravelling: true
            });
            const applyArrival = ()=>{
                const { player: p, world: w } = get();
                if (!p || !w) return;
                const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    energy: -energyCost
                }), 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
                const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(w.timeOfDay, w.day, w.weather, 1);
                const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(clock.day, clock.timeOfDay);
                const tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(`Canoe ferry — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][from]?.shortName ?? from} → ${destination.shortName}`, 'transport', -fare, clock.day, slot);
                set({
                    player: {
                        ...p,
                        cash: Math.max(0, p.cash - fare),
                        needs,
                        transactions: [
                            tx,
                            ...p.transactions
                        ].slice(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]),
                        stats: {
                            ...p.stats,
                            totalSpent: p.stats.totalSpent + fare
                        }
                    },
                    world: {
                        ...w,
                        currentLocation: toId,
                        ...clock
                    },
                    isTravelling: false,
                    offers: []
                });
                // a crossing can cross midnight — the whole mesh follows the day
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitCivicDays"])(get, set, w.day, clock.day);
                get().notify({
                    icon: '🛶',
                    text: `The canoe land you for ${destination.name} — the water still dey, hold the rail.`,
                    tone: 'neutral'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            };
            setTimeout(applyArrival, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].transitionMs);
        },
        /** Run a ferry gig with your own canoe (passengers pay the surge fare). */ runFerryGig: (gigId)=>{
            const { player, world, rivers, isWorking, isTravelling } = get();
            if (!player || !world || isWorking || isTravelling) return false;
            if (!rivers.canoe) {
                get().notify({
                    icon: '🛶',
                    text: 'You need your own canoe — the fishermen dey sell at the jetty.',
                    tone: 'bad'
                });
                return false;
            }
            const cut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["availableFerryGigs"])(rivers, world.day, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cutZonesFor"])(world.day));
            const gig = cut.find((g)=>g.id === gigId);
            if (!gig) return false;
            if (world.currentLocation !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JETTY_ID"]) {
                get().notify({
                    icon: '📍',
                    text: 'The passengers dey wait at the Motor Park jetty — the bus go stop there.',
                    tone: 'bad'
                });
                return false;
            }
            if (player.needs.energy < gig.energyCost) {
                get().notify({
                    icon: '🥵',
                    text: 'You are too tired to paddle a loaded canoe. Rest small first.',
                    tone: 'bad'
                });
                return false;
            }
            const destName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][gig.toId]?.name ?? gig.toId;
            set({
                isWorking: true,
                workingLabel: `Ferry — crossing to ${destName}`
            });
            const applyDone = ()=>{
                const { player: p, world: w } = get();
                if (!p || !w) return;
                get().addMoney(gig.payout, {
                    label: `Ferry run — boatload to ${destName}`,
                    category: 'hustle'
                });
                const paid = get().player;
                const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(paid.needs, {
                    energy: -gig.energyCost
                }), 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
                const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(w.timeOfDay, w.day, w.weather, 1);
                set({
                    player: {
                        ...paid,
                        needs,
                        stats: {
                            ...paid.stats,
                            jobsCompleted: paid.stats.jobsCompleted + 1
                        }
                    },
                    world: {
                        ...w,
                        currentLocation: gig.toId,
                        ...clock
                    },
                    rivers: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runFerryApply"])(get().rivers, w.day, gig.id),
                    isWorking: false,
                    workingLabel: null,
                    offers: []
                });
                const riv = get().rivers;
                set({
                    rivers: {
                        ...riv,
                        stats: {
                            ...riv.stats,
                            ferryEarned: riv.stats.ferryEarned + gig.payout
                        }
                    }
                });
                get().addXp(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].gigXp);
                get().addSkillXp('hustle', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].gigHustleXp);
                get().notify({
                    icon: '🛶',
                    text: `Boatload done — the passengers pay ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gig.payout)} at ${destName}. The water dey pay today.`,
                    tone: 'good'
                });
                get().bumpGoal('gig');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'work');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitCivicDays"])(get, set, w.day, clock.day);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            };
            setTimeout(applyDone, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].transitionMs);
            return true;
        },
        /** Give to the cold-room rescue bowl while standing at the zone. */ contributeRescue: (tier)=>{
            const { player, world, rivers } = get();
            if (!player || !world) return false;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].rescue.tiers.includes(tier)) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canContributeRescue"])(rivers, world.day, world.currentLocation);
            if (!gate.ok) {
                get().notify({
                    icon: '🧊',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(tier, {
                label: 'Cold-room rescue bowl',
                category: 'other'
            })) {
                get().notify({
                    icon: '💸',
                    text: `The bowl dey take ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} tiers — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            const after = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["contributeRescueApply"])(rivers, world.day, tier);
            set({
                rivers: after
            });
            const need = Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].rescue.poolTarget - after.rescue.pool);
            get().notify({
                icon: '🧊',
                text: need <= 0 ? 'Bowl don full! The rescue trucks go roll tomorrow morning.' : `You drop ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(need)} more and the trucks go roll.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /* ------------------------------- travel ------------------------------- */ travel: (destinationId, transportId)=>{
            const { player, world, isTravelling } = get();
            if (!player || !world || isTravelling) return;
            const origin = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation];
            const destination = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][destinationId];
            if (!origin || !destination || origin.id === destination.id) return;
            // --- guards (all feedback through notifications, never silent) ---
            if (player.level < destination.unlockLevel) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🔒',
                    text: `${destination.name} unlocks at Level ${destination.unlockLevel}.`,
                    tone: 'bad'
                });
                return;
            }
            // M6 — THE FLOOD LAW: a flood day closes the riverfront. Nobody wades
            // into the Confluence while the Niger owns it.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["weatherBlocksLocation"])(world.weather, destinationId)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🌊',
                    text: `Flood don close ${destination.name} — the water don take the riverfront. Try tomorrow.`,
                    tone: 'bad'
                });
                return;
            }
            // M11 — THE RIVER LAW: the water owns the low ground. Land transport
            // refuses a cut zone in EITHER direction; a finished sandbag walkway
            // carries pedestrians only (slow, careful steps), and the canoe ferry
            // is its own action — the water never quotes the land sheets' fares.
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zoneCut"])(world.day, destinationId) && !(transportId === 'walk' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walkwayOpen"])(get().rivers, destinationId))) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🌊',
                    text: `The river don take ${destination.name} — the road dey under water. Canoe ferry dey run from the Motor Park.`,
                    tone: 'bad'
                });
                return;
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zoneCut"])(world.day, origin.id) && !(transportId === 'walk' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walkwayOpen"])(get().rivers, origin.id))) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🌊',
                    text: `The water don lock ${origin.name} in — you go need the canoe ferry or the sandbag walkway.`,
                    tone: 'bad'
                });
                return;
            }
            // M4 — personal transport: the ride must be IN the garage first
            const ownModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["personalModelOf"])(transportId);
            if (ownModel && !player.vehicles.some((v)=>v.model === ownModel)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🔑',
                    text: `You no own that ride yet — the Motor Park sells them.`,
                    tone: 'bad'
                });
                return;
            }
            // the ONE offer law: location data for public modes, ownership + road
            // access for personal modes (a danfo cannot follow a keke trail)
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transportAllowed"])(destination, transportId, player.vehicles)) return;
            // M9 — THE GUEST LOOP: the gate stands before forward travel. Linked
            // accounts and the starter trio ride free; anywhere else asks for a name
            // (with an honest one-day grace when they ask for it).
            const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gateVerdict"])(get().account, destinationId, world.day);
            if (verdict.blocked) {
                set({
                    gateOpen: true
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                return;
            }
            // pure calculation — same inputs always give the same plan
            // M8 — the pump surges on scarcity days (personal rides pay black-market)
            // M10 — a paved destination rides the union's smooth road (minutes ×0.85)
            // M11 — a walkway crossing rides slow and careful (minutes ×1.35, walk only)
            const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTravel"])(origin, destination, transportId, world.weather, world.timeOfDay, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelMultFor"])(world.day), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pavedMinutesMult"])(get().calendar, world.day, destinationId) * (transportId === 'walk' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zoneCut"])(world.day, destinationId) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walkwayOpen"])(get().rivers, destinationId) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RIVERS"].walkwayMinutesMult : 1) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sirenMinutesMult"])(get().japa, world.day));
            const event = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rollTravelEvent"])(transportId, world.weather);
            if (player.cash < plan.cost) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '💸',
                    text: `The fare is ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(plan.cost)} — you no get am.`,
                    tone: 'bad'
                });
                return;
            }
            if (player.needs.energy < plan.energyCost) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🥵',
                    text: 'You are too tired for that journey. Rest first.',
                    tone: 'bad'
                });
                return;
            }
            // travelling state drives the 📍 HUD + map transition
            set({
                isTravelling: true
            });
            // apply the completed trip on the EXISTING clock through proper systems
            const applyArrival = ()=>{
                const { player: p, world: w } = get();
                if (!p || !w) return;
                const cash = Math.max(0, p.cash - plan.cost + (event?.cashDelta ?? 0));
                const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    energy: -(plan.energyCost + (event?.energyDelta ?? 0)),
                    mood: event?.moodDelta ?? 0
                }), plan.slots, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
                const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(w.timeOfDay, w.day, w.weather, plan.slots);
                // Stage 3: record the fare (and any event tip) in the player's ledger
                const arrivalSlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(clock.day, clock.timeOfDay);
                const txs = [];
                if (plan.cost > 0) {
                    txs.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(ownModel ? `Fuel — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][ownModel].short} to ${destination.name}` : `Fare to ${destination.name}`, 'transport', -plan.cost, clock.day, arrivalSlot));
                }
                if (event?.cashDelta && event.cashDelta > 0) {
                    txs.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(event.title, 'tip', event.cashDelta, clock.day, arrivalSlot));
                }
                const stats = {
                    ...p.stats,
                    totalEarned: p.stats.totalEarned + (event?.cashDelta && event.cashDelta > 0 ? event.cashDelta : 0),
                    totalSpent: p.stats.totalSpent + plan.cost
                };
                set({
                    player: {
                        ...p,
                        cash,
                        needs,
                        transactions: [
                            ...txs,
                            ...p.transactions
                        ].slice(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]),
                        stats
                    },
                    world: {
                        ...w,
                        currentLocation: destination.id,
                        ...clock
                    },
                    isTravelling: false,
                    offers: []
                });
                // M2 — a trip can cross midnight; the civic mesh follows the day
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitCivicDays"])(get, set, w.day, clock.day);
                // M9 — the journey lands on the daily goals + the onboarding arc
                get().bumpGoal('travel');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'travel');
                // arrival feedback: destination + a compact time/money/energy summary
                get().notify({
                    icon: destination.emoji,
                    text: `You arrived at ${destination.name}.`,
                    tone: 'neutral'
                });
                get().notify({
                    icon: '🧾',
                    text: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(cash)} • ⚡ ${Math.round(needs.energy)}`,
                    tone: 'neutral'
                });
                if (event) {
                    get().notify({
                        icon: event.icon,
                        text: event.description,
                        tone: event.tone
                    });
                    if (event.xpDelta && event.xpDelta > 0) get().addXp(event.xpDelta);
                }
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            };
            setTimeout(applyArrival, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].transitionMs);
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/jobs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Jobs data (Stage 3 consumes this)
 * ------------------------------------------------
 * Ten launch jobs, fully data-driven per the design doc.
 * Requirements are checked by the job system; rewards are tuned here.
 * Reputation requirements gate the "prestige" jobs.
 */ __turbopack_context__.s([
    "JOBS",
    ()=>JOBS,
    "JOB_BY_ID",
    ()=>JOB_BY_ID
]);
const JOBS = [
    {
        id: 'market-worker',
        name: 'Market Worker',
        description: 'Help traders carry goods and watch stalls at Kpata Market.',
        emoji: '🛒',
        locationId: 'kpata-market',
        unlockLevel: 1,
        energyCost: 18,
        timeSlots: 1,
        basePay: 900,
        xpReward: 20,
        skillTraining: {
            skill: 'hustle',
            xp: 10
        },
        reputationReward: 2,
        requirements: {}
    },
    {
        id: 'delivery-worker',
        name: 'Delivery Worker',
        description: 'Run packages across town on foot, keke or bike.',
        emoji: '📦',
        locationId: 'ganaja-junction',
        unlockLevel: 1,
        energyCost: 22,
        timeSlots: 1,
        basePay: 1100,
        xpReward: 24,
        skillTraining: {
            skill: 'hustle',
            xp: 12
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'driver',
        name: 'Driver',
        description: 'Drive a taxi or private car for people who pay better than you sweat.',
        emoji: '🚕',
        locationId: 'transport-area',
        unlockLevel: 2,
        energyCost: 20,
        timeSlots: 2,
        basePay: 1600,
        xpReward: 30,
        skillTraining: {
            skill: 'social',
            xp: 8
        },
        reputationReward: 4,
        requirements: {
            minSkills: {
                hustle: 2
            }
        }
    },
    {
        id: 'fisherman',
        name: 'Fisherman',
        description: 'Cast your nets where the Niger meets the Benue.',
        emoji: '🎣',
        locationId: 'confluence',
        unlockLevel: 2,
        energyCost: 25,
        timeSlots: 2,
        basePay: 1400,
        xpReward: 28,
        skillTraining: {
            skill: 'hustle',
            xp: 12
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'photographer',
        name: 'Photographer',
        description: 'Shoot tourists at the Confluence and events around town.',
        emoji: '📸',
        locationId: 'university-area',
        unlockLevel: 3,
        energyCost: 15,
        timeSlots: 1,
        basePay: 1800,
        xpReward: 32,
        skillTraining: {
            skill: 'smart',
            xp: 10
        },
        reputationReward: 5,
        cooldownSlots: 2,
        requirements: {
            minSkills: {
                smart: 2
            }
        }
    },
    {
        id: 'shop-assistant',
        name: 'Shop Assistant',
        description: 'Keep a shop neat, mind the counter, charm the customers.',
        emoji: '🏪',
        locationId: 'kpata-market',
        unlockLevel: 2,
        energyCost: 16,
        timeSlots: 2,
        basePay: 1300,
        xpReward: 26,
        skillTraining: {
            skill: 'social',
            xp: 12
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'cleaner',
        name: 'Cleaner',
        description: 'Honest work at offices and the motor park. Nobody claps — but they pay.',
        emoji: '🧹',
        locationId: 'transport-area',
        unlockLevel: 1,
        energyCost: 20,
        timeSlots: 1,
        basePay: 800,
        xpReward: 18,
        skillTraining: {
            skill: 'hustle',
            xp: 8
        },
        reputationReward: 1,
        requirements: {}
    },
    {
        id: 'tour-guide',
        name: 'Tour Guide',
        description: 'Show visitors the Confluence, Mount Patti and the old town stories.',
        emoji: '🗺️',
        locationId: 'confluence',
        unlockLevel: 4,
        energyCost: 18,
        timeSlots: 2,
        basePay: 2200,
        xpReward: 40,
        skillTraining: {
            skill: 'social',
            xp: 14
        },
        reputationReward: 8,
        requirements: {
            minSkills: {
                social: 3
            }
        }
    },
    {
        id: 'government-worker',
        name: 'Government Worker',
        description: 'A desk, a stamp, and a steady salary at the Secretariat.',
        emoji: '🏢',
        locationId: 'government-area',
        unlockLevel: 5,
        energyCost: 14,
        timeSlots: 2,
        basePay: 2600,
        xpReward: 45,
        skillTraining: {
            skill: 'smart',
            xp: 16
        },
        reputationReward: 10,
        requirements: {
            minSkills: {
                smart: 4
            },
            minReputation: 100
        }
    },
    {
        id: 'entrepreneur',
        name: 'Entrepreneur',
        description: 'Run your own thing full-time. Risky — but the ceiling is sky high.',
        emoji: '💼',
        locationId: 'ganaja-junction',
        unlockLevel: 6,
        energyCost: 24,
        timeSlots: 2,
        basePay: 2400,
        xpReward: 50,
        skillTraining: {
            skill: 'smart',
            xp: 18
        },
        reputationReward: 12,
        requirements: {
            minReputation: 250
        }
    },
    /* ------------------------- school jobs (Stage 7) ------------------------- */ {
        id: 'evening-tutor',
        name: 'Evening Class Tutor',
        description: 'Take the evening lesson at the FUL Adankolo old campus — earn and revise at once.',
        emoji: '📔',
        locationId: 'ful-adankolo',
        unlockLevel: 3,
        energyCost: 12,
        timeSlots: 1,
        basePay: 1500,
        xpReward: 30,
        skillTraining: {
            skill: 'smart',
            xp: 14
        },
        reputationReward: 4,
        cooldownSlots: 2,
        requirements: {
            minSkills: {
                smart: 2
            }
        }
    },
    {
        id: 'clinic-errand-runner',
        name: 'Clinic Errand Runner',
        description: 'Run case notes and supplies around the nursing college and the hospital quarter.',
        emoji: '🩺',
        locationId: 'college-nursing',
        unlockLevel: 2,
        energyCost: 14,
        timeSlots: 1,
        basePay: 1200,
        xpReward: 24,
        skillTraining: {
            skill: 'hustle',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'campus-caretaker',
        name: 'Campus Caretaker',
        description: 'Keep the quiet Salem campus neat — hedges, chapel pews, and the notice board.',
        emoji: '⛪',
        locationId: 'salem-university',
        unlockLevel: 2,
        energyCost: 15,
        timeSlots: 1,
        basePay: 1150,
        xpReward: 22,
        skillTraining: {
            skill: 'hustle',
            xp: 9
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'afterschool-supervisor',
        name: 'After-School Supervisor',
        description: 'Watch the Faithview kids till last pickup — patience pays, literally.',
        emoji: '✏️',
        locationId: 'faithview-academy',
        unlockLevel: 2,
        energyCost: 11,
        timeSlots: 1,
        basePay: 1050,
        xpReward: 24,
        skillTraining: {
            skill: 'social',
            xp: 12
        },
        reputationReward: 4,
        requirements: {}
    },
    {
        id: 'class-assistant',
        name: 'Class Assistant',
        description: 'Assist the teachers at Al-Azhar — handouts, uniforms, and very polite children.',
        emoji: '🕌',
        locationId: 'al-azhar-college',
        unlockLevel: 2,
        energyCost: 12,
        timeSlots: 1,
        basePay: 1100,
        xpReward: 25,
        skillTraining: {
            skill: 'social',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'choir-practice-assistant',
        name: 'Choir Practice Assistant',
        description: 'Arrange hymn books and chairs for Baptist High’s famous choir practice.',
        emoji: '🎶',
        locationId: 'baptist-high',
        unlockLevel: 2,
        energyCost: 10,
        timeSlots: 1,
        basePay: 1000,
        xpReward: 22,
        skillTraining: {
            skill: 'social',
            xp: 11
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'school-bus-conductor',
        name: 'School Bus Conductor',
        description: 'Call names, count heads, mind the gate — the Julitola yellow bus runs on order.',
        emoji: '🚌',
        locationId: 'julitola-intl',
        unlockLevel: 2,
        energyCost: 14,
        timeSlots: 1,
        basePay: 1250,
        xpReward: 26,
        skillTraining: {
            skill: 'hustle',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    {
        id: 'nursery-assistant',
        name: 'Nursery Assistant',
        description: 'Help the tiny Christfield pupils with their letters — and their crayons.',
        emoji: '🎒',
        locationId: 'christfield-school',
        unlockLevel: 1,
        energyCost: 10,
        timeSlots: 1,
        basePay: 900,
        xpReward: 20,
        skillTraining: {
            skill: 'social',
            xp: 10
        },
        reputationReward: 3,
        requirements: {}
    },
    /* ---------------- M12 — THE LADDER: the careers the certificate opens ---------------- */ {
        id: 'govt-officer',
        name: 'Civil Servant — GRA',
        description: 'A desk of your own at the Government Area: files, stamps, and steady respect. The FUL certificate opened this door.',
        emoji: '🏢',
        locationId: 'government-area',
        unlockLevel: 5,
        energyCost: 22,
        timeSlots: 1,
        basePay: 3800,
        xpReward: 40,
        skillTraining: {
            skill: 'smart',
            xp: 14
        },
        reputationReward: 5,
        requirements: {
            minReputation: 300,
            requiresDegree: true
        }
    },
    {
        id: 'lec-assistant',
        name: 'Tutorial Assistant — FUL',
        description: 'Take the smaller groups in LT B and mark their quizzes. The campus dey call you abeg now.',
        emoji: '🎓',
        locationId: 'ful-felele',
        unlockLevel: 4,
        energyCost: 20,
        timeSlots: 1,
        basePay: 3200,
        xpReward: 36,
        skillTraining: {
            skill: 'smart',
            xp: 16
        },
        reputationReward: 4,
        requirements: {
            minReputation: 150,
            requiresDegree: true
        }
    },
    /* ------------- M12 — the uniform: the police recruit (no degree, pure respect) ------------- */ {
        id: 'police-recruit',
        name: 'Police Recruit',
        description: 'The uniform earns the street’s respect — checkpoints, patrols, and the MOPOL detail watching your record.',
        emoji: '👮',
        locationId: 'government-area',
        unlockLevel: 6,
        energyCost: 24,
        timeSlots: 1,
        basePay: 2800,
        xpReward: 34,
        skillTraining: {
            skill: 'social',
            xp: 12
        },
        reputationReward: 4,
        requirements: {
            minReputation: 200
        }
    }
];
const JOB_BY_ID = Object.fromEntries(_c1 = JOBS.map(_c = (j)=>[
        j.id,
        j
    ]));
_c2 = JOB_BY_ID;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "JOB_BY_ID$Object.fromEntries$JOBS.map");
__turbopack_context__.k.register(_c1, "JOB_BY_ID$Object.fromEntries");
__turbopack_context__.k.register(_c2, "JOB_BY_ID");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/hustles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Hustles (Stage 3)
 * --------------------------------
 * Small, personal, informal opportunities — the opposite of the formal
 * job board in jobs.ts. Each hustle belongs to a real NPC at a real
 * location (stable ids shared with the map + future 3D world), carries
 * its own requirements, risk (difficulty) and reward range.
 *
 * The opportunity SYSTEM (systems/opportunities.ts) reads this catalogue
 * and generates offer instances — nothing here knows about the UI.
 * When the phone/chat system arrives it will deliver these exact defs
 * as chat messages — same data, new transport.
 */ __turbopack_context__.s([
    "HUSTLES",
    ()=>HUSTLES,
    "HUSTLE_BY_ID",
    ()=>HUSTLE_BY_ID,
    "hustlesAt",
    ()=>hustlesAt
]);
const HUSTLES = [
    /* ------------------------------ Kpata Market ------------------------------ */ {
        id: 'musa-fabric-carry',
        npcId: 'musa',
        locationId: 'kpata-market',
        title: 'Carry fabric bundles',
        message: 'Guy, you dey around Kpata? I get small work for you — help me carry this fabric reach my shop.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 400,
            cashMax: 700,
            xp: 16,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 12,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'hajiya-pepper-bags',
        npcId: 'hajiya-amina',
        locationId: 'kpata-market',
        title: 'Bag fresh peppers',
        message: 'My customer dey wait. Come help me bag this pepper before afternoon market rush, abeg.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 350,
            cashMax: 550,
            xp: 14,
            skillXp: 9,
            reputation: 2
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'kpata-price-runner',
        npcId: 'musa',
        locationId: 'kpata-market',
        title: 'Market price run',
        message: 'I wan send somebody go check tomoro price for three stalls. You get sharp mouth — you fit talk price.',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 800,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ------------------------------ Food Strip ------------------------------- */ {
        id: 'mama-ngozi-soup-run',
        npcId: 'mama-ngozi',
        locationId: 'food-area',
        title: 'Deliver soup parcels',
        message: 'My customer for Government Area don order soup since morning. Help me run this delivery — no spill am o!',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 850,
            xp: 18,
            skillXp: 11,
            reputation: 3
        },
        energyCost: 14,
        timeSlots: 1,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: false
    },
    {
        id: 'mama-ngozi-basins',
        npcId: 'mama-ngozi',
        locationId: 'food-area',
        title: 'Wash evening basins',
        message: 'Evening rush dey come. Wash these basins make shine and I go pay you sharp sharp.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 300,
            cashMax: 500,
            xp: 12,
            skillXp: 8,
            reputation: 1
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    /* ---------------------------- Ganaja Junction ----------------------------- */ {
        id: 'emeka-sort-packages',
        npcId: 'emeka',
        locationId: 'ganaja-junction',
        title: 'Sort dispatch packages',
        message: 'Wahala dey — my packages don mix like jollof. Help me sort am by street, make we dey go.',
        source: 'npc',
        difficulty: 1,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 450,
            cashMax: 700,
            xp: 16,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'emeka-last-mile',
        npcId: 'emeka',
        locationId: 'ganaja-junction',
        title: 'Last-mile drop',
        message: 'One last drop for Low-Cost side. I go give you the address — your leg fast pass my fuel gauge.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 600,
            cashMax: 950,
            xp: 22,
            skillXp: 13,
            reputation: 3
        },
        energyCost: 16,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: false
    },
    /* ------------------------------ Motor Park -------------------------------- */ {
        id: 'baba-t-keke-wash',
        npcId: 'baba-t',
        locationId: 'transport-area',
        title: 'Wash the kekes',
        message: 'Park dey judge cleanliness tomorrow. Wash these kekes make dem brown like new kobo.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 350,
            cashMax: 600,
            xp: 14,
            skillXp: 9,
            reputation: 2
        },
        energyCost: 13,
        timeSlots: 1,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'baba-t-fare-collect',
        npcId: 'baba-t',
        locationId: 'transport-area',
        title: 'Collect park fares',
        message: 'Follow me collect loading fares for one round. No let them shake hand for you — talk am well.',
        source: 'npc',
        difficulty: 2,
        skill: 'social',
        requirements: {},
        reward: {
            cashMin: 550,
            cashMax: 900,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ---------------------------- University Area ----------------------------- */ {
        id: 'chantel-flyers',
        npcId: 'chantel',
        locationId: 'university-area',
        title: 'Share tutorial flyers',
        message: 'Hey! Help me share tutorial flyers for hostel side — na per hand I dey pay o.',
        source: 'npc',
        difficulty: 1,
        skill: 'social',
        requirements: {},
        reward: {
            cashMin: 400,
            cashMax: 650,
            xp: 15,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 11,
        timeSlots: 1,
        cooldownSlots: 1,
        weight: 3,
        kidSafe: true
    },
    {
        id: 'chantel-laptop-fix',
        npcId: 'chantel',
        locationId: 'university-area',
        title: 'Fix a student laptop',
        message: 'My coursemate laptop dey craze — e no dey boot. You sabi computer small? They will pay better.',
        source: 'npc',
        difficulty: 3,
        skill: 'smart',
        requirements: {
            minSkills: {
                smart: 2
            }
        },
        reward: {
            cashMin: 900,
            cashMax: 1500,
            xp: 30,
            skillXp: 16,
            reputation: 4
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ---------------------------- Government Area ----------------------------- */ {
        id: 'alhaji-sule-files',
        npcId: 'alhaji-sule',
        locationId: 'government-area',
        title: 'Arrange office files',
        message: 'These files must enter shelf alphabetically before oga arrive. Steady hand, steady pay.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 600,
            cashMax: 950,
            xp: 22,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 12,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'alhaji-sule-errand',
        npcId: 'alhaji-sule',
        locationId: 'government-area',
        title: 'Official errand run',
        message: 'Take this envelope across the secretariat. Stamp am here, sign am there. No open am!',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {
            minSkills: {
                smart: 2
            }
        },
        reward: {
            cashMin: 700,
            cashMax: 1100,
            xp: 26,
            skillXp: 14,
            reputation: 4
        },
        energyCost: 13,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ---------------------------- Historic Lokoja ----------------------------- */ {
        id: 'uncle-ben-cleanup',
        npcId: 'uncle-ben',
        locationId: 'historic-lokoja',
        title: 'Clear the old path',
        message: 'Tourists dey come tomorrow. Help me clear the cemetery path — history must look presentable.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 800,
            xp: 18,
            skillXp: 11,
            reputation: 3
        },
        energyCost: 15,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ------------------------------- Confluence ------------------------------- */ {
        id: 'idris-net-pull',
        npcId: 'idris',
        locationId: 'confluence',
        title: 'Pull the fishing net',
        message: 'The current strong today. Pull this net with me — whatever fish enter, na split we go share.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 550,
            cashMax: 900,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 16,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* ------------------------------ Mount Patti ------------------------------- */ {
        id: 'baba-danjuma-trail',
        npcId: 'baba-danjuma',
        locationId: 'mount-patti',
        title: 'Clear the hiking trail',
        message: 'Branch fall for trail after the rain. Help me clear am — climbers go thank you, I go pay you.',
        source: 'npc',
        difficulty: 2,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 500,
            cashMax: 850,
            xp: 19,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 15,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    /* --------------------------- The Schools (Stage 7) ------------------------ */ {
        id: 'hauwa-assignment-run',
        npcId: 'hauwa',
        locationId: 'gyb-model-adankolo',
        title: 'Deliver assignment scripts',
        message: 'Ah, you came at the right time! Help me carry this whole class’s scripts to the staff room before the bell.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 350,
            cashMax: 600,
            xp: 15,
            skillXp: 10,
            reputation: 2
        },
        energyCost: 10,
        timeSlots: 0,
        cooldownSlots: 1,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'chidi-notes-run',
        npcId: 'chidi',
        locationId: 'ful-felele',
        title: 'Photocopy lecture notes run',
        message: 'Guy, the whole 200 level needs these notes before tomorrow’s test. Business centre run — I go cover the copies.',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 550,
            cashMax: 900,
            xp: 20,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 14,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'abubakar-workshop-tidy',
        npcId: 'abubakar',
        locationId: 'ksp-felele',
        title: 'Tidy the mechanical workshop',
        message: 'Oga say make the workshop clean before inspection. Spanner no go arrange itself — I go split the pay.',
        source: 'npc',
        difficulty: 1,
        skill: 'hustle',
        requirements: {},
        reward: {
            cashMin: 450,
            cashMax: 750,
            xp: 17,
            skillXp: 11,
            reputation: 2
        },
        energyCost: 16,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    },
    {
        id: 'miss-grace-library-sort',
        npcId: 'miss-grace',
        locationId: 'crowther-memorial',
        title: 'Sort the library shelves',
        message: 'The library shelves have slipped into chaos again. Alphabetical order, young lady or young man — there is ₦ in the envelope.',
        source: 'npc',
        difficulty: 2,
        skill: 'smart',
        requirements: {},
        reward: {
            cashMin: 400,
            cashMax: 700,
            xp: 18,
            skillXp: 12,
            reputation: 3
        },
        energyCost: 10,
        timeSlots: 1,
        cooldownSlots: 2,
        weight: 2,
        kidSafe: true
    }
];
const HUSTLE_BY_ID = Object.fromEntries(_c1 = HUSTLES.map(_c = (h)=>[
        h.id,
        h
    ]));
_c2 = HUSTLE_BY_ID;
function hustlesAt(locationId) {
    return HUSTLES.filter((h)=>h.locationId === locationId);
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "HUSTLE_BY_ID$Object.fromEntries$HUSTLES.map");
__turbopack_context__.k.register(_c1, "HUSTLE_BY_ID$Object.fromEntries");
__turbopack_context__.k.register(_c2, "HUSTLE_BY_ID");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/work.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateJobPay",
    ()=>calculateJobPay,
    "checkRequirements",
    ()=>checkRequirements,
    "cooldownRemaining",
    ()=>cooldownRemaining,
    "hustleSuccessChance",
    ()=>hustleSuccessChance,
    "moodPayFactor",
    ()=>moodPayFactor,
    "resolveHustle",
    ()=>resolveHustle,
    "resolveJob",
    ()=>resolveJob
]);
/**
 * LOKOJA LIFE — Work System (Stage 3)
 * ------------------------------------
 * The maths behind every shift and hustle: requirement checks,
 * pay calculation, outcome rolls. All pure — the store applies results.
 *
 * Design intent: formal JOBS are reliable (always pay, modest upside),
 * personal HUSTLES are riskier (difficulty vs skill decides success).
 * Different jobs train different skills and pay differently — no two
 * defs are interchangeable.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
;
;
;
function checkRequirements(player, req, ctx) {
    const reasons = [];
    if (req.minLevel && player.level < req.minLevel) {
        reasons.push(`Unlocks at Level ${req.minLevel}`);
    }
    for (const [skill, min] of Object.entries(req.minSkills ?? {})){
        if (min && player.skills[skill] < min) {
            reasons.push(`Needs ${skill === 'hustle' ? '💪' : skill === 'smart' ? '🧠' : '🗣️'} ${skill} ${min}`);
        }
    }
    if (req.minReputation && player.reputation < req.minReputation) {
        const tier = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"].find((t)=>t.threshold === req.minReputation);
        reasons.push(tier ? `Needs “${tier.name}” reputation (${req.minReputation})` : `Needs ${req.minReputation} reputation`);
    }
    if (req.requiresDegree && !ctx?.graduated) {
        reasons.push('Needs the FUL certificate — enroll and climb the ladder');
    }
    return {
        ok: reasons.length === 0,
        reasons
    };
}
function cooldownRemaining(cooldowns, key, currentAbsSlot) {
    const end = cooldowns[key];
    if (!end) return 0;
    return Math.max(0, end - currentAbsSlot);
}
function moodPayFactor(mood) {
    if (mood >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodBonusHigh.threshold) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodBonusHigh.factor;
    if (mood <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodPenaltyLow.threshold) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodPenaltyLow.factor;
    return 1;
}
function roundPay(raw) {
    return Math.max(0, Math.round(raw / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].payRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].payRounding);
}
function calculateJobPay(job, player) {
    const skillLevel = player.skills[job.skillTraining.skill];
    const skillBonus = 1 + Math.max(0, skillLevel - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].payPerSkillLevel;
    return roundPay(job.basePay * skillBonus * moodPayFactor(player.needs.mood));
}
function hustleSuccessChance(def, player) {
    const skillLevel = player.skills[def.skill];
    let chance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].baseSuccess + (skillLevel - def.difficulty) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].skillStep;
    if (player.needs.mood >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodBonusHigh.threshold) chance += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodChanceBonusHigh;
    if (player.needs.mood <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodPenaltyLow.threshold) chance -= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodChancePenaltyLow;
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].successClamp.max, Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].successClamp.min, chance));
}
function rollCashRange(min, max, rng) {
    return Math.round(min + rng() * (max - min));
}
function resolveJob(job, player, rng = Math.random) {
    let pay = calculateJobPay(job, player);
    const great = rng() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].greatChance;
    if (great) pay = roundPay(pay * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].greatPayFactor);
    const reward = {
        cash: pay,
        xp: great ? Math.round(job.xpReward * 1.25) : job.xpReward,
        skillXp: {
            [job.skillTraining.skill]: job.skillTraining.xp
        },
        reputation: great ? job.reputationReward + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].greatBonusReputation : job.reputationReward
    };
    return {
        outcome: great ? 'great' : 'good',
        headline: great ? `${job.emoji} Excellent shift! The ${job.name.toLowerCase()} work came out sharp.` : `${job.emoji} Shift complete — ${job.name} work done.`,
        reward,
        cash: pay,
        skillId: job.skillTraining.skill
    };
}
function resolveHustle(def, player, rng = Math.random) {
    const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][def.npcId];
    const chance = hustleSuccessChance(def, player);
    if (rng() >= chance) {
        return {
            outcome: 'fail',
            headline: `The hustle no work out — ${npc?.name ?? 'they'} no smile.`,
            reward: {
                xp: Math.round(def.reward.xp * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].fail.xpFactor)
            },
            cash: 0,
            skillId: def.skill
        };
    }
    const great = rng() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].greatChance;
    const cash = roundCash(rollCashRange(def.reward.cashMin, def.reward.cashMax, rng) * (great ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].greatPayFactor : 1));
    const reward = {
        cash,
        xp: great ? Math.round(def.reward.xp * 1.25) : def.reward.xp,
        skillXp: {
            [def.skill]: def.reward.skillXp
        },
        reputation: great ? def.reward.reputation + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].greatBonusReputation : def.reward.reputation
    };
    return {
        outcome: great ? 'great' : 'good',
        headline: great ? `${npc?.emoji ?? '🙌'} ${npc?.name ?? 'They'} dey super impressed — sharp work!` : `${npc?.emoji ?? '🙌'} ${npc?.name ?? 'They'} paid you for the hustle.`,
        reward,
        cash,
        skillId: def.skill
    };
}
function roundCash(raw) {
    return Math.max(0, Math.round(raw / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].payRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].payRounding);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/opportunities.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "filterValidInstances",
    ()=>filterValidInstances,
    "generateHustleOffers",
    ()=>generateHustleOffers,
    "hustleDefFor",
    ()=>hustleDefFor,
    "isEligible",
    ()=>isEligible,
    "jobAsOpportunityMeta",
    ()=>jobAsOpportunityMeta,
    "jobCooldownRemaining",
    ()=>jobCooldownRemaining,
    "jobIdForSlot",
    ()=>jobIdForSlot,
    "makeOpportunityInstance",
    ()=>makeOpportunityInstance,
    "pruneExpiredOpportunities",
    ()=>pruneExpiredOpportunities,
    "resolveOpportunity",
    ()=>resolveOpportunity
]);
/**
 * LOKOJA LIFE — Opportunity System (Stage 3)
 * -------------------------------------------
 * THE core opportunity architecture. Opportunities are plain data with
 * stable ids, a source, a real location id, requirements, reward and
 * expiry — deliberately NOT coupled to any UI.
 *
 * Flow today:  hustles.ts data → generateHustleOffers() → offer instance
 *              → player accepts → player.activeOpportunities → resolve at
 *              the location (systems/work.ts rolls the outcome).
 * Flow tomorrow: NPC → phone chat → gist → THE SAME opportunity shape →
 *              map/3D world → activity → reward. Nothing here changes.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/hustles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/jobs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/work.ts [app-client] (ecmascript)");
;
;
;
;
function makeOpportunityInstance(def, currentAbsSlot) {
    return {
        instanceId: `${def.id}@${currentAbsSlot}`,
        defId: def.id,
        type: 'hustle',
        source: def.source,
        npcId: def.npcId,
        locationId: def.locationId,
        acceptedAtSlot: currentAbsSlot,
        expiresAtSlot: currentAbsSlot + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].expirySlots
    };
}
function isEligible(def, player, currentAbsSlot, active) {
    // M13 — THE FAMILY SHIELD: kids (6–12) only see the light honest chores
    // (kidSafe). The gate lives HERE so every pipeline that offers work —
    // the search board, NPC favours, future gists — inherits the same law.
    if (player.ageBand === 'kid' && !def.kidSafe) return false;
    // already carrying this exact hustle — no duplicate stacking
    if (active.some((o)=>o.defId === def.id)) return false;
    // personal cooldown after finishing this hustle
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, def.id, currentAbsSlot) > 0) return false;
    // level / skill / reputation gates
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRequirements"])(player, def.requirements).ok;
}
function generateHustleOffers(locationId, player, currentAbsSlot, rng = Math.random) {
    const pool = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE_BY_ID"]).filter((def)=>def.locationId === locationId && isEligible(def, player, currentAbsSlot, player.activeOpportunities));
    if (pool.length === 0 || rng() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].dryChance) {
        return {
            offers: [],
            dry: true
        };
    }
    const count = Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxPerSearch, pool.length, 1 + (rng() < 0.5 ? 1 : 0));
    const offers = [];
    const remaining = [
        ...pool
    ];
    for(let i = 0; i < count && remaining.length > 0; i++){
        const total = remaining.reduce((s, d)=>s + d.weight, 0);
        let roll = rng() * total;
        let picked = remaining[remaining.length - 1];
        for (const def of remaining){
            roll -= def.weight;
            if (roll <= 0) {
                picked = def;
                break;
            }
        }
        offers.push(makeOpportunityInstance(picked, currentAbsSlot));
        remaining.splice(remaining.indexOf(picked), 1);
    }
    return {
        offers,
        dry: offers.length === 0
    };
}
function pruneExpiredOpportunities(active, currentAbsSlot) {
    const kept = [];
    const expired = [];
    for (const o of active){
        ;
        (o.expiresAtSlot > currentAbsSlot ? kept : expired).push(o);
    }
    return {
        kept,
        expired
    };
}
function hustleDefFor(instance) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE_BY_ID"][instance.defId] ?? null;
}
function resolveOpportunity(instance, player, rng = Math.random) {
    const def = hustleDefFor(instance);
    if (!def) return null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveHustle"])(def, player, rng);
}
function jobAsOpportunityMeta(job) {
    return {
        defId: job.id,
        type: 'job',
        source: 'board',
        locationId: job.locationId,
        npcId: null
    };
}
function jobCooldownRemaining(job, player, currentAbsSlot) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, job.id, currentAbsSlot);
}
function jobIdForSlot(job, currentAbsSlot) {
    return `${job.id}@${currentAbsSlot}`;
}
function filterValidInstances(active) {
    return active.filter((o)=>o.type === 'hustle' ? !!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE_BY_ID"][o.defId] : !!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOB_BY_ID"][o.defId]);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/economy.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ECONOMY SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1253-1253, 1255-1255, 1266-1266, 1287-1289, 1623-1741, 1743-1835, 1837-1913, 2251-2379, 3759-3896, 3914-3998, 4000-4189, 4191-4200.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "economySlice",
    ()=>economySlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/jobs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/biz.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/economy.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/opportunities.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/work.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
const economySlice = (set, get)=>({
        civic: null,
        chaos: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshChaosState"])(),
        fortress: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshFortressState"])(),
        isWorking: false,
        workingLabel: null,
        offers: [],
        /* --------------------- M2 — the civic mesh actions --------------------- */ /** Settle the electricity bill. In the GRA office it costs the debt
   *  (+ reconnection once cut); from the phone it adds the convenience fee. */ payNepa: (channel)=>{
            const { player, world, civic } = get();
            if (!player || !world || !civic) return false;
            if (civic.nepa.owed <= 0 && !civic.nepa.shedding) {
                get().notify({
                    icon: '💡',
                    text: 'You no owe NEPA anything. Enjoy the light.',
                    tone: 'neutral'
                });
                return false;
            }
            if (channel === 'office' && world.currentLocation !== 'government-area') {
                get().notify({
                    icon: '🏢',
                    text: 'The NEPA counter is in the Government Area — or pay from your phone for a small fee.',
                    tone: 'neutral'
                });
                return false;
            }
            const fee = channel === 'phone' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee : 0;
            const cost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nepaSettleCost"])(civic) + fee;
            if (!get().removeMoney(cost, {
                label: fee ? 'NEPA bill — online payment (incl. fee)' : civic.nepa.shedding ? 'NEPA bill + reconnection fee' : 'NEPA bill',
                category: 'other'
            })) {
                get().notify({
                    icon: '🧾',
                    text: `You need ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(cost)} to clear the disco.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                civic: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nepaApplyPayment"])(get().civic, world.day)
            });
            get().notify({
                icon: '💡',
                text: civic?.nepa.shedding ? 'Light don come back! NEPA staff dey smile small.' : 'NEPA bill settled — meter dey smile.',
                tone: 'good'
            });
            get().bumpGoal('nepa');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Settle the KGIRS assessment. A clean assessment pays anywhere (office
   *  free / phone + fee); a WARRANT only clears at the police desk in the GRA,
   *  where the fine comes on top. */ payKgirs: (channel)=>{
            const { player, world, civic } = get();
            if (!player || !world || !civic) return false;
            if (civic.kgirs.assessed <= 0) {
                get().notify({
                    icon: '🧮',
                    text: 'No tax assessment dey wait. KGIRS dey sleep — for now.',
                    tone: 'neutral'
                });
                return false;
            }
            const warrant = civic.kgirs.warrant;
            if (channel === 'phone' && warrant) {
                get().notify({
                    icon: '🚨',
                    text: 'A warrant no fit clear by phone. Walk to the police station.',
                    tone: 'bad'
                });
                return false;
            }
            if (channel !== 'phone' && world.currentLocation !== 'government-area') {
                get().notify({
                    icon: '🏢',
                    text: warrant ? 'The warrant desk is at the GRA police station.' : 'KGIRS office dey Government Area — or use the phone app (+fee).',
                    tone: 'neutral'
                });
                return false;
            }
            const fee = channel === 'phone' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee : 0;
            const cost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["kgirsSettleCost"])(civic) + fee;
            if (!get().removeMoney(cost, {
                label: warrant ? 'KGIRS tax + warrant fine (police)' : fee ? 'KGIRS tax — online payment (incl. fee)' : 'KGIRS tax assessment',
                category: 'other'
            })) {
                get().notify({
                    icon: '🧮',
                    text: `You need ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(cost)} to settle the taxman.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                civic: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["kgirsApplyPayment"])(get().civic, warrant)
            });
            get().notify({
                icon: '🧮',
                text: warrant ? 'Warrant cleared at the desk — the police sef smile.' : 'Tax settled. Your name clean for KGIRS book.',
                tone: 'good'
            });
            get().bumpGoal('tax');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** File a whistleblower tip at the EFCC zonal command (in person only). */ fileEfccTip: ()=>{
            const { player, world, civic } = get();
            if (!player || !world || !civic) return false;
            if (world.currentLocation !== 'government-area') {
                get().notify({
                    icon: '🏢',
                    text: 'The commission sits in the Government Area. Carry your gist there.',
                    tone: 'neutral'
                });
                return false;
            }
            if (world.day - civic.efcc.lastTipDay < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].efcc.tipCooldownDays) {
                get().notify({
                    icon: '🕵️',
                    text: 'The commission dey still investigate your last tip. Come back small later.',
                    tone: 'neutral'
                });
                return false;
            }
            const { next, tip } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["efccFileTip"])(civic, world.day);
            set({
                civic: next
            });
            get().notify({
                icon: '🕵️',
                text: `Tip filed: “${tip.label}”. If EFCC recover, your cut na ${Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].efcc.rewardRate * 100)}%.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Today's honest market price of a meal at a spot — the ONE source the
   *  menu rows and eatMeal both read, so display can never drift from charge.
   *  M6 — night dishes price by the night-market law: the seeded per-day
   *  discount at the food strip after dark, and NOWHERE else. */ mealPriceAt: (mealKey, locationId)=>{
            const { world, civic } = get();
            const meal = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MEAL_BY_KEY"][mealKey];
            if (!meal || !world) return meal?.price ?? 0;
            if (meal.night) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mealAvailableAt"])(true, locationId, world.timeOfDay) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nightMealPrice"])(meal.price, world.day) : meal.price;
            }
            const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketForDay"])(civic ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshCivicState"])(), world.day, world.weather);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["marketMealPrice"])(meal.price, mealKey, locationId, c, world.day);
        },
        /* ---------------------- M3 — OWN THE CITY (biz) ---------------------- */ buyBiz: (typeId)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizDef"])(typeId);
            if (!def) return false;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizOwned"])(player.businesses, typeId)) {
                get().notify({
                    icon: def.emoji,
                    text: `You already run the ${def.name}. One per man for now.`,
                    tone: 'neutral'
                });
                return false;
            }
            if (player.level < def.unlockLevel) {
                get().notify({
                    icon: '🔒',
                    text: `${def.name} opens at Level ${def.unlockLevel}. Keep pushing.`,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(def.buyCost, {
                label: `Bought: ${def.name}`,
                category: 'other'
            })) {
                get().notify({
                    icon: '💰',
                    text: `${def.name} costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(def.buyCost)}. You no reach yet.`,
                    tone: 'bad'
                });
                return false;
            }
            const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshBusiness"])(typeId, world.day);
            const p = get().player;
            set({
                player: {
                    ...p,
                    businesses: [
                        ...p.businesses,
                        shop
                    ]
                }
            });
            get().notify({
                icon: def.emoji,
                text: `${def.name} na yours now! Income go dey enter the till daily.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        collectBiz: (typeId, channel)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizDef"])(typeId);
            const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizOwned"])(player.businesses, typeId);
            if (!def || !shop) return false;
            if (channel === 'shop' && world.currentLocation !== def.locationId) {
                const where = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][def.locationId]?.shortName ?? def.locationId;
                get().notify({
                    icon: def.emoji,
                    text: `The ${def.name} dey ${where} — the money dey wait for you there.`,
                    tone: 'neutral'
                });
                return false;
            }
            const gross = Math.round(shop.accrued);
            if (gross <= 0) {
                get().notify({
                    icon: '🧺',
                    text: 'The till is empty — come back tomorrow.',
                    tone: 'neutral'
                });
                return false;
            }
            const fee = channel === 'phone' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee : 0;
            const net = Math.max(0, gross - fee);
            if (net <= 0) {
                get().notify({
                    icon: '📱',
                    text: 'The money never even reach transfer fee. Wait small.',
                    tone: 'neutral'
                });
                return false;
            }
            const { next } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizCollect"])(shop, world.day);
            const p = get().player;
            set({
                player: {
                    ...p,
                    businesses: p.businesses.map((b)=>b.typeId === typeId ? next : b)
                }
            });
            get().addMoney(net, {
                label: fee ? `${def.name} till (phone, incl. fee)` : `${def.name} till`,
                category: 'hustle'
            });
            get().notify({
                icon: def.emoji,
                text: fee ? `Collected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(net)} by transfer (₦${fee} fee don go).` : `Collected ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(net)} from the till. Solid.`,
                tone: 'good'
            });
            get().bumpGoal('collect');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        upgradeBiz: (typeId)=>{
            const { player } = get();
            if (!player) return false;
            const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizDef"])(typeId);
            const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizOwned"])(player.businesses, typeId);
            if (!def || !shop) return false;
            const cost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizUpgradeCost"])(typeId, shop.level);
            if (cost === null) {
                get().notify({
                    icon: def.emoji,
                    text: `${def.name} don reach max level. Na big name you be.`,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(cost, {
                label: `Upgraded: ${def.name} → L${shop.level + 1}`,
                category: 'other'
            })) {
                get().notify({
                    icon: '💰',
                    text: `Upgrade costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(cost)}. Gather am first.`,
                    tone: 'bad'
                });
                return false;
            }
            const p = get().player;
            set({
                player: {
                    ...p,
                    businesses: p.businesses.map((b)=>b.typeId === typeId ? {
                            ...b,
                            level: b.level + 1
                        } : b)
                }
            });
            get().notify({
                icon: def.emoji,
                text: `${def.name} don level up to L${shop.level + 1} — income go show am.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /* ------------------ M5 — staff, power & the fleet ------------------ */ hireStaff: (typeId)=>{
            const { player } = get();
            if (!player) return false;
            const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizDef"])(typeId);
            const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizOwned"])(player.businesses, typeId);
            if (!def || !shop) return false;
            const cap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["staffCapFor"])(shop.level);
            if (shop.staff >= cap) {
                get().notify({
                    icon: '👥',
                    text: `The ${def.name} no fit carry more hands at L${shop.level} — upgrade am first.`,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].staffHireFee, {
                label: `Hired attendant — ${def.name}`,
                category: 'other'
            })) {
                get().notify({
                    icon: '💰',
                    text: `Hiring costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].staffHireFee)}. You no reach yet.`,
                    tone: 'bad'
                });
                return false;
            }
            const p = get().player;
            set({
                player: {
                    ...p,
                    businesses: p.businesses.map((b)=>b.typeId === typeId ? {
                            ...b,
                            staff: b.staff + 1
                        } : b)
                }
            });
            get().notify({
                icon: '👥',
                text: `One more attendant join the ${def.name} — income +${Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].staffIncomeBoost * 100)}%, wage ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].staffWagePerDay)}/day from the till.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        fireStaff: (typeId)=>{
            const { player } = get();
            if (!player) return false;
            const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizOwned"])(player.businesses, typeId);
            if (!shop || shop.staff <= 0) return false;
            set({
                player: {
                    ...player,
                    businesses: player.businesses.map((b)=>b.typeId === typeId ? {
                            ...b,
                            staff: b.staff - 1
                        } : b)
                }
            });
            get().notify({
                icon: '👋',
                text: 'You let one attendant go. The wage stops tomorrow.',
                tone: 'neutral'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        installBizUpgrade: (typeId, upgradeId)=>{
            const { player } = get();
            if (!player) return false;
            const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizDef"])(typeId);
            const shop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$biz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bizOwned"])(player.businesses, typeId);
            const up = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BIZ"].upgrades[upgradeId];
            if (!def || !shop || !up) return false;
            if (shop.upgrades.includes(upgradeId)) {
                get().notify({
                    icon: up.emoji,
                    text: `${up.label} already dey run for the ${def.name}.`,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(up.cost, {
                label: `${up.label} — ${def.name}`,
                category: 'other'
            })) {
                get().notify({
                    icon: '💰',
                    text: `${up.label} costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(up.cost)}. Gather am first.`,
                    tone: 'bad'
                });
                return false;
            }
            const p = get().player;
            set({
                player: {
                    ...p,
                    businesses: p.businesses.map((b)=>b.typeId === typeId ? {
                            ...b,
                            upgrades: [
                                ...b.upgrades,
                                upgradeId
                            ]
                        } : b)
                }
            });
            get().notify({
                icon: up.emoji,
                text: `${up.label} installed at the ${def.name} — ${upgradeId === 'solar' ? 'dark days no fit touch am again, and NEPA load don drop.' : 'NEPA fit cut the whole street — your shop go still glow.'}`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        bankDeposit: (amount)=>{
            const { player, world } = get();
            if (!player || !world || amount <= 0) return false;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAfford"])(player.cash, amount)) {
                get().notify({
                    icon: '🏦',
                    text: 'Cash wey dey your pocket no reach that amount.',
                    tone: 'bad'
                });
                return false;
            }
            const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
            const tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])('Bank deposit', 'bank', -amount, world.day, slot);
            set({
                player: {
                    ...player,
                    cash: player.cash - amount,
                    bankBalance: player.bankBalance + amount,
                    transactions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pushTransaction"])(player.transactions, tx, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"])
                }
            });
            get().notify({
                icon: '🏦',
                text: `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amount)} don enter bank. Money wey dey bank dey safe.`,
                tone: 'good'
            });
            get().bumpGoal('deposit');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        bankWithdraw: (amount, channel = 'atm')=>{
            const { player, world } = get();
            if (!player || !world || amount <= 0) return false;
            if (player.bankBalance < amount) {
                get().notify({
                    icon: '🏦',
                    text: 'Your bank balance no reach that amount.',
                    tone: 'bad'
                });
                return false;
            }
            const day = world.day;
            let net = amount;
            let label = 'ATM withdrawal';
            let fee = 0;
            if (channel === 'pos') {
                // M8 — the agent's levy: instant, no cap, the kiosk network always has cash
                fee = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["posFeeFor"])(amount);
                net = Math.max(0, amount - fee);
                label = `POS withdrawal (agent fee ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(fee)})`;
                const c0 = get().chaos;
                set({
                    chaos: {
                        ...c0,
                        stats: {
                            ...c0.stats,
                            posFees: c0.stats.posFees + fee
                        }
                    }
                });
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isScarcityDay"])(day)) {
                // M8 — THE SCARCITY LAW: the ATM pays a capped trickle on dry days
                const remaining = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["atmRemaining"])(get().chaos, day);
                if (remaining <= 0) {
                    get().notify({
                        icon: '🏧',
                        text: 'ATM don dry for today — na only POS agent fit help you now.',
                        tone: 'bad'
                    });
                    return false;
                }
                if (amount > remaining) {
                    get().notify({
                        icon: '🏧',
                        text: `Cash scarcity: the ATM fit pay ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(remaining)} more today. Queue for tomorrow or take the POS agent levy.`,
                        tone: 'neutral'
                    });
                    return false;
                }
                set({
                    chaos: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyAtmDraw"])(get().chaos, day, amount)
                });
            }
            const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(day, world.timeOfDay);
            const tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(label, 'bank', net, day, slot);
            // F2 — the POS levy signs the kobo-chain too: a destroyed fee is a real
            // ledger event, not a silent shave. The entry chains from the fortress
            // tail exactly like every signed entry (chainNext → sig → chainTail),
            // recorded -fee per the ledger's outflow convention (bankDeposit writes
            // the pocket-outflow the same way); magnitude = the fee.
            let transactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pushTransaction"])(player.transactions, tx, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]);
            let fortress = get().fortress;
            if (fee > 0) {
                const levySig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainNext"])(fortress.chainTail, {
                    day,
                    slot,
                    amount: -fee,
                    category: 'bank',
                    label: 'POS agent levy'
                });
                const levyTx = {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])('POS agent levy', 'bank', -fee, day, slot),
                    sig: levySig
                };
                transactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pushTransaction"])(transactions, levyTx, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]);
                fortress = {
                    ...fortress,
                    slotTxSlot: slot,
                    slotTxCount: (fortress.slotTxSlot === slot ? fortress.slotTxCount : 0) + 1,
                    chainTail: levySig
                };
            }
            set({
                player: {
                    ...player,
                    cash: player.cash + net,
                    bankBalance: player.bankBalance - amount,
                    transactions
                },
                ...fee > 0 ? {
                    fortress
                } : {}
            });
            get().notify({
                icon: channel === 'pos' ? '🏧' : '🏦',
                text: channel === 'pos' ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(net)} enter your hand — the agent don chop ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(fee)}.` : `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(net)} don comot from bank.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** M8 — drop your own naira into the community light fund. In person,
   *  once per dark day; when the pool fills, the technician comes overnight. */ contributeToPool: (tier)=>{
            const { player, world, chaos } = get();
            if (!player || !world) return false;
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].poolTiers.includes(tier)) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canContribute"])(chaos, world.currentLocation, world.day);
            if (!gate.ok) {
                get().notify({
                    icon: '💡',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            const zoneName = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][chaos.active.zoneId]?.name ?? chaos.active.zoneId;
            if (!get().removeMoney(tier, {
                label: `Community light fund — ${zoneName}`,
                category: 'other'
            })) {
                get().notify({
                    icon: '⚡',
                    text: `Contribution na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            const after = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyContribution"])(get().chaos, world.day, tier);
            set({
                chaos: after
            });
            const need = Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget - after.active.pool);
            get().notify({
                icon: '⚡',
                text: need <= 0 ? `Pool don complete! Technician go reach ${zoneName} tomorrow morning.` : `You drop ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(tier)} — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(need)} more and the technician go come.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /* ------------------------ work & opportunities ------------------------ */ addMoney: (amount, meta)=>{
            const { player, world, fortress } = get();
            if (!player || !world || amount <= 0) return;
            const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
            // M14 — THE VELOCITY GUARD: no flood of micro-events in one clock slot
            const inSlot = fortress.slotTxSlot === slot ? fortress.slotTxCount : 0;
            const vel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["velocityGuard"])(inSlot, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FORTRESS"].velocityCap);
            if (!vel.allow) {
                set({
                    fortress: {
                        ...fortress,
                        anomalies: fortress.anomalies + 1,
                        slotTxSlot: slot,
                        slotTxCount: inSlot
                    }
                });
                get().notify({
                    icon: '🛡️',
                    text: 'The fortress shut the flood gate — too many money events in one slot.',
                    tone: 'bad'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                return;
            }
            // M14 — THE INCOME GUARD: ceilings, not crashes; the overflow is clamped + counted
            const dayEarned = fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0;
            const guard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["incomeGuard"])(amount, dayEarned, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FORTRESS"]);
            const paid = guard.allowed;
            if (guard.clamped) {
                set({
                    fortress: {
                        ...get().fortress,
                        anomalies: get().fortress.anomalies + 1
                    }
                });
                get().notify({
                    icon: '🛡️',
                    text: `The fortress clamped an impossible income to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(paid)} (${guard.law === 'single' ? 'single-event' : 'day'} ceiling).`,
                    tone: 'bad'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                if (paid <= 0) return;
            }
            // M14 — THE KOBO-CHAIN: the entry signs onto the ledger's chain
            const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainNext"])(get().fortress.chainTail, {
                day: world.day,
                slot,
                amount: paid,
                category: meta.category,
                label: meta.label
            });
            const tx = {
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(meta.label, meta.category, paid, world.day, slot),
                sig
            };
            set({
                player: {
                    ...player,
                    cash: player.cash + paid,
                    transactions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pushTransaction"])(player.transactions, tx, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]),
                    stats: {
                        ...player.stats,
                        totalEarned: player.stats.totalEarned + paid
                    }
                },
                // the fortress ledgers ride along (day earnings + the slot flood counter + the chain tail)
                fortress: {
                    ...get().fortress,
                    dayEarnedDay: world.day,
                    dayEarned: (fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0) + paid,
                    slotTxSlot: slot,
                    slotTxCount: inSlot + 1,
                    chainTail: sig
                },
                // M9 — juice: every honest naira pops (transform/opacity only)
                pulse: {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextPulseId"])(),
                    amount: paid
                }
            });
            // M9 — the first ₦500 earned completes the onboarding 'earn' step
            if (get().player.stats.totalEarned >= 500) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'earn');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        removeMoney: (amount, meta)=>{
            const { player, world, fortress } = get();
            if (!player || !world || amount <= 0) return false;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAfford"])(player.cash, amount)) {
                get().notify({
                    icon: '💸',
                    text: 'You no get that kind money.',
                    tone: 'bad'
                });
                return false;
            }
            const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
            // M14 — the velocity guard rides spending too (the flood gate is symmetric)
            const inSlot = fortress.slotTxSlot === slot ? fortress.slotTxCount : 0;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["velocityGuard"])(inSlot, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FORTRESS"].velocityCap).allow) {
                set({
                    fortress: {
                        ...fortress,
                        anomalies: fortress.anomalies + 1,
                        slotTxSlot: slot,
                        slotTxCount: inSlot
                    }
                });
                get().notify({
                    icon: '🛡️',
                    text: 'The fortress shut the flood gate — too many money events in one slot.',
                    tone: 'bad'
                });
                return false;
            }
            // M14 — the kobo-chain signs the spend too (a full ledger, not a half one)
            const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainNext"])(fortress.chainTail, {
                day: world.day,
                slot,
                amount: -amount,
                category: meta.category,
                label: meta.label
            });
            const tx = {
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(meta.label, meta.category, -amount, world.day, slot),
                sig
            };
            set({
                player: {
                    ...player,
                    cash: player.cash - amount,
                    transactions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pushTransaction"])(player.transactions, tx, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]),
                    stats: {
                        ...player.stats,
                        totalSpent: player.stats.totalSpent + amount
                    }
                },
                fortress: {
                    ...fortress,
                    slotTxSlot: slot,
                    slotTxCount: inSlot + 1,
                    chainTail: sig
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /**
   * Apply a full reward bundle (cash + xp + skill xp + reputation) through
   * the proper engine actions, with ONE ledger entry for the cash part.
   * Jobs, hustles, events and future systems all pay through here.
   */ giveReward: (reward, meta)=>{
            const { player, world, fortress } = get();
            if (!player || !world) return;
            // 1) cash + ledger entry — M14: the SAME income guard + kobo-chain every payout rides
            const cash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rewardCash"])(reward);
            if (cash > 0) {
                const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
                const dayEarned = fortress.dayEarnedDay === world.day ? fortress.dayEarned : 0;
                const guard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["incomeGuard"])(cash, dayEarned, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FORTRESS"]);
                const paid = guard.allowed;
                if (guard.clamped) {
                    set({
                        fortress: {
                            ...fortress,
                            anomalies: fortress.anomalies + 1
                        }
                    });
                    get().notify({
                        icon: '🛡️',
                        text: `The fortress clamped an impossible income to ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(paid)} (${guard.law === 'single' ? 'single-event' : 'day'} ceiling).`,
                        tone: 'bad'
                    });
                }
                if (paid > 0) {
                    const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chainNext"])(fortress.chainTail, {
                        day: world.day,
                        slot,
                        amount: paid,
                        category: meta.category,
                        label: meta.label
                    });
                    const tx = {
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordTransaction"])(meta.label, meta.category, paid, world.day, slot),
                        sig
                    };
                    set({
                        player: {
                            ...player,
                            cash: player.cash + paid,
                            transactions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pushTransaction"])(player.transactions, tx, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_CAP"]),
                            stats: {
                                ...player.stats,
                                totalEarned: player.stats.totalEarned + paid
                            }
                        },
                        fortress: {
                            ...fortress,
                            dayEarnedDay: world.day,
                            dayEarned: dayEarned + paid,
                            slotTxSlot: slot,
                            slotTxCount: (fortress.slotTxSlot === slot ? fortress.slotTxCount : 0) + 1,
                            chainTail: sig
                        },
                        pulse: {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextPulseId"])(),
                            amount: paid
                        }
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                    if (get().player.stats.totalEarned >= 500) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'earn');
                }
            }
            // 2) player XP (level-ups handled by the existing engine action)
            if (reward.xp && reward.xp > 0) get().addXp(reward.xp);
            // 3) skill XP
            for (const [skill, amount] of Object.entries(reward.skillXp ?? {})){
                if (amount && amount > 0) get().addSkillXp(skill, amount);
            }
            // 4) reputation
            if (reward.reputation && reward.reputation !== 0) get().addReputation(reward.reputation);
            // 5) one compact summary toast
            const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["describeReward"])(reward);
            if (summary) get().notify({
                icon: '🧾',
                text: summary,
                tone: 'good'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** Work a formal job shift — reliable pay, real time + energy cost. */ workShift: (jobId)=>{
            const { player, world, isWorking, isTravelling } = get();
            if (!player || !world || isWorking || isTravelling) return;
            const job = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOB_BY_ID"][jobId];
            if (!job) return;
            // --- guards: location, requirements, cooldown, energy ---
            if (world.currentLocation !== job.locationId) {
                const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][job.locationId];
                get().notify({
                    icon: '📍',
                    text: `This shift is at ${loc?.name ?? 'another part of Lokoja'}.`,
                    tone: 'bad'
                });
                return;
            }
            // M12 — the career gate reads the FUL certificate from the live slice
            const req = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRequirements"])(player, job.requirements, {
                graduated: get().education.graduated && get().education.convocationAttended
            });
            if (!req.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🔒',
                    text: req.reasons[0],
                    tone: 'bad'
                });
                return;
            }
            const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
            const cd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, job.id, slot);
            if (cd > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '⏳',
                    text: `${job.name} needs a breather — ready in ${cd} time slot${cd > 1 ? 's' : ''}.`,
                    tone: 'bad'
                });
                return;
            }
            if (player.needs.energy < job.energyCost) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🥵',
                    text: 'You are too tired for this shift. Rest first.',
                    tone: 'bad'
                });
                return;
            }
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveJob"])(job, player);
            set({
                isWorking: true,
                workingLabel: job.name
            });
            const applyDone = ()=>{
                const { player: p, world: w } = get();
                if (!p || !w) return;
                const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    energy: -job.energyCost
                }), job.timeSlots, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
                const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(w.timeOfDay, w.day, w.weather, job.timeSlots);
                const afterSlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(clock.day, clock.timeOfDay);
                const cooldownSlots = job.cooldownSlots ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].defaultCooldownSlots;
                set({
                    player: {
                        ...p,
                        needs,
                        cooldowns: {
                            ...p.cooldowns,
                            [job.id]: afterSlot + cooldownSlots
                        },
                        stats: {
                            ...p.stats,
                            jobsCompleted: p.stats.jobsCompleted + 1
                        }
                    },
                    world: {
                        ...w,
                        ...clock
                    },
                    isWorking: false,
                    workingLabel: null
                });
                // M12 — the uniform builds the MOPOL trust ledger
                if (job.id === 'police-recruit') {
                    set({
                        japa: {
                            ...get().japa,
                            policeShifts: get().japa.policeShifts + 1
                        }
                    });
                }
                get().notify({
                    icon: result.outcome === 'great' ? '🌟' : '💼',
                    text: result.headline,
                    tone: 'good'
                });
                get().giveReward(result.reward, {
                    label: job.name,
                    category: 'job'
                });
                get().bumpGoal('job');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'work');
                if (result.outcome === 'great') __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            };
            setTimeout(applyDone, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].transitionMs);
        },
        /** Look around the current area for personal hustles (gist). */ searchHustles: ()=>{
            const { player, world } = get();
            if (!player || !world) return;
            const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, 'hustle-search', slot) > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '⏳',
                    text: 'You just checked around. Give the streets a moment.',
                    tone: 'bad'
                });
                return;
            }
            const generation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateHustleOffers"])(world.currentLocation, player, slot);
            set({
                player: {
                    ...player,
                    cooldowns: {
                        ...player.cooldowns,
                        'hustle-search': slot + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].searchCooldownSlots
                    }
                },
                offers: generation.offers
            });
            if (generation.dry) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '👀',
                    text: 'You looked around but nothing came up this time.',
                    tone: 'neutral'
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🗣️',
                    text: `Fresh gist! ${generation.offers.length} offer${generation.offers.length > 1 ? 's' : ''} came up.`,
                    tone: 'good'
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** Accept a hustle offer — it joins the player's active opportunities. */ acceptOffer: (instanceId)=>{
            const { player, offers } = get();
            if (!player) return;
            const offer = offers.find((o)=>o.instanceId === instanceId);
            if (!offer) return;
            if (player.activeOpportunities.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxActive) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🎒',
                    text: `Your hands are full — finish or drop something first (max ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxActive}).`,
                    tone: 'bad'
                });
                return;
            }
            if (player.activeOpportunities.some((o)=>o.defId === offer.defId)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🤔',
                    text: 'You already took this one.',
                    tone: 'bad'
                });
                return;
            }
            set({
                player: {
                    ...player,
                    activeOpportunities: [
                        ...player.activeOpportunities,
                        offer
                    ]
                },
                offers: offers.filter((o)=>o.instanceId !== instanceId)
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            get().notify({
                icon: '🤝',
                text: 'Offer accepted — it goes cold if you wait too long!',
                tone: 'good'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        declineOffer: (instanceId)=>{
            const { offers } = get();
            const offer = offers.find((o)=>o.instanceId === instanceId);
            if (!offer) return;
            set({
                offers: offers.filter((o)=>o.instanceId !== instanceId)
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            get().notify({
                icon: '🚶',
                text: 'You declined. No wahala.',
                tone: 'neutral'
            });
        },
        /** Do an accepted hustle at its real location — outcome rolls in work.ts. */ completeOpportunity: (instanceId)=>{
            const { player, world, isWorking, isTravelling } = get();
            if (!player || !world || isWorking || isTravelling) return;
            const instance = player.activeOpportunities.find((o)=>o.instanceId === instanceId);
            if (!instance) return;
            const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hustleDefFor"])(instance);
            if (!def) {
                // data changed between versions — drop the orphan quietly but honestly
                set({
                    player: {
                        ...player,
                        activeOpportunities: player.activeOpportunities.filter((o)=>o.instanceId !== instanceId)
                    }
                });
                return;
            }
            if (world.currentLocation !== instance.locationId) {
                const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][instance.locationId];
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '📍',
                    text: `This hustle is at ${loc?.name ?? 'another part of Lokoja'}.`,
                    tone: 'bad'
                });
                return;
            }
            if (player.needs.energy < def.energyCost) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🥵',
                    text: 'Too tired for this hustle. Rest small first.',
                    tone: 'bad'
                });
                return;
            }
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveOpportunity"])(instance, player);
            if (!result) return;
            set({
                isWorking: true,
                workingLabel: def.title
            });
            const applyDone = ()=>{
                const { player: p, world: w } = get();
                if (!p || !w) return;
                const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p.needs, {
                    energy: -def.energyCost,
                    mood: result.outcome === 'fail' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].fail.moodDelta : 0
                }), def.timeSlots, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
                const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(w.timeOfDay, w.day, w.weather, def.timeSlots);
                const afterSlot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(clock.day, clock.timeOfDay);
                set({
                    player: {
                        ...p,
                        needs,
                        cooldowns: {
                            ...p.cooldowns,
                            [def.id]: afterSlot + def.cooldownSlots
                        },
                        activeOpportunities: p.activeOpportunities.filter((o)=>o.instanceId !== instanceId),
                        stats: {
                            ...p.stats,
                            hustlesCompleted: p.stats.hustlesCompleted + 1
                        }
                    },
                    world: {
                        ...w,
                        ...clock
                    },
                    isWorking: false,
                    workingLabel: null
                });
                get().notify({
                    icon: result.outcome === 'great' ? '🌟' : result.outcome === 'fail' ? '😐' : '🤝',
                    text: result.headline,
                    tone: result.outcome === 'fail' ? 'bad' : 'good'
                });
                get().giveReward(result.reward, {
                    label: def.title,
                    category: 'hustle'
                });
                get().bumpGoal('hustle');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'work');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play(result.outcome === 'fail' ? 'notify' : result.outcome === 'great' ? 'levelup' : 'chime');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            };
            setTimeout(applyDone, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].transitionMs);
        },
        dropOpportunity: (instanceId)=>{
            const { player } = get();
            if (!player) return;
            const dropped = player.activeOpportunities.find((o)=>o.instanceId === instanceId);
            if (!dropped) return;
            const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hustleDefFor"])(dropped);
            set({
                player: {
                    ...player,
                    activeOpportunities: player.activeOpportunities.filter((o)=>o.instanceId !== instanceId)
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            get().notify({
                icon: '🚶',
                text: `You dropped “${def?.title ?? 'the offer'}”.`,
                tone: 'neutral'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** Lazily remove expired offers — the Work screen calls this on mount. */ pruneExpired: ()=>{
            const { player, world, offers } = get();
            if (!player || !world) return;
            const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
            const { kept, expired } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pruneExpiredOpportunities"])(player.activeOpportunities, slot);
            const keptOffers = offers.filter((o)=>o.expiresAtSlot > slot);
            if (kept.length === player.activeOpportunities.length && keptOffers.length === offers.length) {
                return;
            }
            set({
                player: {
                    ...player,
                    activeOpportunities: kept
                },
                offers: keptOffers
            });
            for (const o of expired){
                const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hustleDefFor"])(o);
                get().notify({
                    icon: '⌛',
                    text: `“${def?.title ?? 'An offer'}” went cold.`,
                    tone: 'neutral'
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /* -------------------------- engine actions ---------------------------- */ addCash: (amount)=>{
            const { player } = get();
            if (!player || amount === 0) return;
            set({
                player: {
                    ...player,
                    cash: Math.max(0, player.cash + amount)
                }
            });
            if (amount > 0) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/fleet.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GIG_ORIGIN_ID",
    ()=>GIG_ORIGIN_ID,
    "availableGigs",
    ()=>availableGigs,
    "gigBoard",
    ()=>gigBoard,
    "gigDestinationsFor",
    ()=>gigDestinationsFor,
    "gigLabel",
    ()=>gigLabel,
    "gigPayout",
    ()=>gigPayout
]);
/**
 * LOKOJA LIFE — Fleet System (M5: WORK & FLEET)
 * ----------------------------------------------
 * The Motor Park gig board: the rides you OWN from M4 become the work you
 * DO in M5. Passengers pay the counter fare for the trip (the public rate
 * everyone knows), you burn your own fuel (the M4 law guarantees fuel is
 * cheaper than that fare — the margin IS the business), and rain drives
 * the day's price up because misery pays.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the board for (day, garage, level) is a pure
 *    function — same inputs, same gigs, reload-proof. The only persisted
 *    state is WHICH of today's gigs already ran (FleetState in the save).
 *  - Every naira traces to ECONOMY.transport + config FLEET — no magic
 *    numbers. Fuel reuses calculateTravel() so the pump can never disagree
 *    with the travel sheets.
 *  - Nothing here mutates state — the store applies outcomes.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/travel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
const GIG_ORIGIN_ID = 'transport-area';
function gigDestinationsFor(model, level, weather) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATIONS"].filter((l)=>l.id !== GIG_ORIGIN_ID && l.unlockLevel <= level && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canPersonalReach"])(l, model) && !(weather && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["weatherBlocksLocation"])(weather, l.id)));
}
function gigPayout(model, dest, weather, fleetMult = 1) {
    const park = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][GIG_ORIGIN_ID];
    const km = Math.hypot(dest.mapX - park.mapX, dest.mapY - park.mapY) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].kmPerMapUnit;
    const pub = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ECONOMY"].transport[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["publicCounterpartId"])(model)];
    const rain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRainSky"])(weather) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].rainPayout[model] ?? 1 : 1;
    const rough = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRainSky"])(weather) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].roughSkyBonus[weather] ?? 1 : 1;
    const raw = (pub.cost.base + pub.cost.perKm * km) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].payoutMult * rain * rough * fleetMult;
    return Math.round(raw / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding;
}
function gigBoard(day, vehicles, level, weather, fuelMult = 1, cal) {
    const park = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][GIG_ORIGIN_ID];
    if (!park) return [];
    const gigs = [];
    // showroom order keeps the board stable as the garage grows
    const order = [
        'okada',
        'keke',
        'taxi',
        'danfo'
    ];
    for (const model of order){
        if (!vehicles.some((v)=>v.model === model)) continue;
        const dests = gigDestinationsFor(model, level, weather);
        if (dests.length === 0) continue;
        let prevToId = null;
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].gigsPerModelPerDay; i++){
            // hash pick; when more than one destination exists, walk forward off
            // the PREVIOUS gig's destination so one model never double-books a run
            const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["civicHash"])('gig', day, model, i);
            let idx = h % dests.length;
            if (prevToId !== null && dests.length > 1) {
                let tries = 0;
                while(dests[idx].id === prevToId && tries < dests.length){
                    idx = (idx + 1) % dests.length;
                    tries++;
                }
            }
            prevToId = dests[idx].id;
            const dest = dests[idx];
            const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateTravel"])(park, dest, `own-${model}`, weather, 'morning', fuelMult, cal ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pavedMinutesMult"])(cal, day, dest.id) : 1);
            gigs.push({
                id: `gig-${day}-${model}-${i}`,
                day,
                model,
                toId: dest.id,
                payout: gigPayout(model, dest, weather, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calendarFleetMult"])(day)),
                fuel: plan.cost,
                energyCost: plan.energyCost,
                minutes: plan.minutes,
                distanceKm: plan.distanceKm,
                rainPremium: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRainSky"])(weather)
            });
        }
    }
    return gigs;
}
function availableGigs(day, vehicles, level, weather, fleet, fuelMult = 1) {
    const done = fleet.day === day ? fleet.done : [];
    return gigBoard(day, vehicles, level, weather, fuelMult).filter((g)=>!done.includes(g.id));
}
function gigLabel(gig) {
    const dest = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][gig.toId];
    const VEHICLE_SHORT = {
        okada: 'Okada',
        keke: 'Keke',
        taxi: 'Taxi',
        danfo: 'Danfo'
    };
    return `${VEHICLE_SHORT[gig.model]} run to ${dest?.name ?? gig.toId}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/profile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_LOOK_JSON",
    ()=>DEFAULT_LOOK_JSON,
    "GUEST_PREVIEW_MS",
    ()=>GUEST_PREVIEW_MS,
    "defaultLook",
    ()=>defaultLook,
    "previewState",
    ()=>previewState,
    "profilePatchVerdict",
    ()=>profilePatchVerdict,
    "profileVerdict",
    ()=>profileVerdict,
    "sanitizeProfilePublic",
    ()=>sanitizeProfilePublic,
    "validateAvatarLook",
    ()=>validateAvatarLook,
    "validateBio",
    ()=>validateBio,
    "validateDisplayName",
    ()=>validateDisplayName
]);
/**
 * LOKOJA LIFE — M24 W1: THE REGISTER (pure profile laws)
 * =======================================================
 * What the street sees. The claim door now collects the WHOLE face:
 * handle + PIN + birthday (the band law, untouched) + DISPLAY NAME +
 * AVATAR LOOK (+ optional bio) → the ProfileRow. The avatar look rides
 * the REAL vocabularies from data/avatar.ts — the same words the
 * CharacterCreation speaks and the W2 remote-body renderer will draw —
 * so what you design at signup is what the city sees walking.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. The API
 *    doors import the SAME functions (the M17 law-vault doctrine: the
 *    browser and the server can never disagree about a verdict).
 *  - The vocabulary law: every look value must exist in the REAL
 *    option arrays. A hex we never minted or a style key we never
 *    named refuses at the door — no invented bodies on the street.
 *  - THE PREVIEW LAW: a guest walks FREE for exactly 60 seconds, then
 *    the wall stands. Not a dead end — a door (claim, or the menu).
 *  - Contact is optional and nullable (the v2 register law): the M13
 *    minor shield never collects it; adults MAY give a recovery line,
 *    validated-if-present, never demanded.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-client] (ecmascript)");
;
/** The REAL vocabulary values, as sets — O(1) door checks, one truth. */ const SKIN_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKIN_TONES"].map((o)=>o.value));
const HAIR_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HAIR_COLORS"].map((o)=>o.value));
const HAIR_KEYS = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVATAR_HAIRSTYLES"].map((o)=>o.key));
const CLOTHING_STYLE_KEYS = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].map((o)=>o.key));
const CLOTHING_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLOTHING_COLORS"].map((o)=>o.value));
const DEFAULT_LOOK_JSON = JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"]);
_c = DEFAULT_LOOK_JSON;
function defaultLook() {
    return {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"]
    };
}
function isLookShape(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function str(v) {
    return typeof v === 'string' ? v : '';
}
function validateAvatarLook(raw) {
    let v = raw;
    if (typeof raw === 'string') {
        if (raw.length > 500) return {
            ok: false,
            why: 'The look payload is too heavy.'
        };
        try {
            v = JSON.parse(raw);
        } catch  {
            return {
                ok: false,
                why: 'The look is not a valid payload.'
            };
        }
    }
    if (!isLookShape(v)) return {
        ok: false,
        why: 'The look is not a valid payload.'
    };
    const skinTone = str(v.skinTone);
    const hairColor = str(v.hairColor);
    const hairstyle = str(v.hairstyle);
    const clothingStyle = str(v.clothingStyle);
    const clothingColor = str(v.clothingColor);
    if (!SKIN_VALUES.has(skinTone)) return {
        ok: false,
        why: 'Pick a skin tone from the real shades.'
    };
    if (!HAIR_VALUES.has(hairColor)) return {
        ok: false,
        why: 'Pick a hair colour from the real shades.'
    };
    if (!HAIR_KEYS.has(hairstyle)) return {
        ok: false,
        why: 'Pick a hairstyle the barber knows.'
    };
    if (!CLOTHING_STYLE_KEYS.has(clothingStyle)) return {
        ok: false,
        why: 'Pick a clothing style the tailor knows.'
    };
    if (!CLOTHING_VALUES.has(clothingColor)) return {
        ok: false,
        why: 'Pick a clothing colour from the real palette.'
    };
    return {
        ok: true,
        why: '',
        look: {
            skinTone,
            hairColor,
            hairstyle,
            clothingStyle,
            clothingColor
        }
    };
}
function validateDisplayName(name) {
    const n = name.trim().replace(/\s+/g, ' ');
    if (n.length < 2 || n.length > 24) return {
        ok: false,
        why: 'Display name must be 2–24 characters.'
    };
    // printable, no control chars / newlines — one line the roster can render
    if (/[\u0000-\u001F\u007F]/.test(n)) return {
        ok: false,
        why: 'Letters, numbers and plain punctuation only.'
    };
    if (/^[\p{P}\p{S}\s]+$/u.test(n)) return {
        ok: false,
        why: 'A name needs at least one letter or number.'
    };
    return {
        ok: true,
        why: ''
    };
}
function validateBio(bio) {
    const b = bio.trim();
    if (b.length > 280) return {
        ok: false,
        why: 'Bio must be 280 characters or fewer.'
    };
    if (/[\u0000-\u001F\u007F]/.test(b)) return {
        ok: false,
        why: 'Plain text only — no control characters.'
    };
    return {
        ok: true,
        why: ''
    };
}
function profileVerdict(input) {
    const vName = validateDisplayName(input.displayName ?? '');
    if (!vName.ok) return {
        ok: false,
        why: vName.why
    };
    const vBio = validateBio(input.bio ?? '');
    if (!vBio.ok) return {
        ok: false,
        why: vBio.why
    };
    const vLook = validateAvatarLook(input.avatarLook ?? '');
    if (!vLook.ok || !vLook.look) return {
        ok: false,
        why: vLook.why
    };
    return {
        ok: true,
        why: '',
        displayName: input.displayName.trim().replace(/\s+/g, ' '),
        bio: (input.bio ?? '').trim() || undefined,
        look: vLook.look
    };
}
function profilePatchVerdict(patch) {
    const vName = patch.displayName === undefined ? {
        ok: true,
        why: ''
    } : validateDisplayName(patch.displayName);
    if (!vName.ok) return {
        ok: false,
        why: vName.why
    };
    const vBio = patch.bio === undefined ? {
        ok: true,
        why: ''
    } : validateBio(patch.bio);
    if (!vBio.ok) return {
        ok: false,
        why: vBio.why
    };
    // THE ABSENT-FIELD LAW: an absent look means "keep mine" — its branch
    // carries look: undefined and the guard must NOT mistake that for a
    // refusal (only a PRESENT look must parse to a whole shape).
    const vLook = patch.avatarLook === undefined ? {
        ok: true,
        why: '',
        look: undefined
    } : validateAvatarLook(patch.avatarLook);
    if (!vLook.ok) return {
        ok: false,
        why: vLook.why
    };
    return {
        ok: true,
        why: '',
        displayName: patch.displayName === undefined ? undefined : patch.displayName.trim().replace(/\s+/g, ' '),
        bio: patch.bio === undefined ? undefined : patch.bio.trim() || '',
        look: vLook.look
    };
}
const GUEST_PREVIEW_MS = 60_000;
function previewState(startedAt, now) {
    if (!startedAt || startedAt <= 0) return {
        remainingMs: GUEST_PREVIEW_MS,
        expired: false,
        fraction: 1
    };
    const elapsed = Math.max(0, now - startedAt);
    const remainingMs = Math.max(0, GUEST_PREVIEW_MS - elapsed);
    return {
        remainingMs,
        expired: remainingMs === 0,
        fraction: Math.max(0, Math.min(1, remainingMs / GUEST_PREVIEW_MS))
    };
}
function sanitizeProfilePublic(row) {
    return {
        handle: row.handle,
        displayName: row.displayName,
        avatarLook: row.avatarLook,
        bio: row.bio ?? null
    };
}
var _c;
__turbopack_context__.k.register(_c, "DEFAULT_LOOK_JSON");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/bodies.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IDLE_POS_MS",
    ()=>IDLE_POS_MS,
    "INTERP_DELAY_MS",
    ()=>INTERP_DELAY_MS,
    "InterpBuffer",
    ()=>InterpBuffer,
    "MAX_EXTRAP_MS",
    ()=>MAX_EXTRAP_MS,
    "POS_HZ",
    ()=>POS_HZ,
    "POS_TICK_MS",
    ()=>POS_TICK_MS,
    "RENDER_RANGE",
    ()=>RENDER_RANGE,
    "SPEED_MAX",
    ()=>SPEED_MAX,
    "STALE_MS",
    ()=>STALE_MS,
    "WORLD_BOUND",
    ()=>WORLD_BOUND,
    "angleLerp",
    ()=>angleLerp,
    "bodyLook",
    ()=>bodyLook,
    "bodyRelayOk",
    ()=>bodyRelayOk,
    "distMoved",
    ()=>distMoved,
    "inRenderRange",
    ()=>inRenderRange,
    "joinVerdict",
    ()=>joinVerdict,
    "posOk",
    ()=>posOk,
    "posWorthSending",
    ()=>posWorthSending
]);
/**
 * LOKOJA LIFE — M24 W2: THE BODIES LAW VAULT
 * ===========================================
 * The PURE laws of co-presence: real walkers as real bodies in the one
 * living city. Zero React, zero store, zero DOM — the same verdicts run
 * in the browser AND at the wire door (imported VERBATIM — zero copies,
 * zero drift, the W4-W8 doctrine).
 *
 * LAWS OF THIS FILE:
 *  - THE EPHEMERALITY LAW: a position is a MOMENT, not a record. pos
 *    ticks live in wire memory only — they are NEVER persisted to
 *    LiveEvent (the relay doctrine: distribute, never simulate; the
 *    nation's DB stays lean and no one's footsteps become history).
 *  - THE POS LAW: a pos payload is 4 finite numbers and a boolean —
 *    x/z inside the world bound, heading any finite angle, mv the
 *    movement truth. Anything else refuses (bad-pos) before it ever
 *    touches a neighbour's screen.
 *  - THE SPEED LAW: a human walks ≤ SPRINT_SPEED u/s (the controls'
 *    own law, mirrored as a clamp — a teleporting body is a lying
 *    body; the renderer clamps the interpolated speed, the wire does
 *    not police it beyond plausibility).
 *  - THE INTERPOLATION LAW: a remote body is TWO snaps and a render
 *    clock — the body stands INTERP_DELAY_MS behind the newest snap
 *    and lerps between the pair (never snaps, never extrapolates past
 *    MAX_EXTRAP_MS — a lost packet freezes a body mid-stride instead
 *    of gliding it into a wall it never walked to).
 *  - THE STALE LAW: a body whose snaps stopped STALE_MS ago is GONE —
 *    the walker closed the tab, the wire swept the presence, the body
 *    must not keep standing there like a ghost.
 *  - THE RANGE LAW: a body farther than RENDER_RANGE from MY body is
 *    culled from rendering (the street can hold many walkers; the
 *    frame budget holds few) — pure distance, recomputed per frame.
 *  - THE BLOCK WALL FOR BODIES (the M17 law walks in space): if
 *    either side blocked the other, the wire relays NO pos between
 *    them and the body does not render — a block is a wall you can
 *    see, not just a quiet thread.
 *  - THE GUEST DARKNESS LAW: a guest broadcasts NO pos (no identity,
 *    no body-broadcast; the door refuses guest-mic-dark, the M17
 *    spectate law rides unchanged — guests may WATCH claimed walkers,
 *    claimed walkers never render a guest).
 *  - THE LOOK LAW: a body wears the REAL avatarLook the register law
 *    minted (systems/profile.ts validateAvatarLook — the vocab from
 *    data/avatar.ts). An invented colour or style never renders.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/profile.ts [app-client] (ecmascript)");
;
const POS_HZ = 10;
const POS_TICK_MS = Math.round(1000 / POS_HZ);
const IDLE_POS_MS = 3_000;
const STALE_MS = 5_000;
const INTERP_DELAY_MS = 120;
const MAX_EXTRAP_MS = 250;
const RENDER_RANGE = 60;
const WORLD_BOUND = 330;
const SPEED_MAX = 8;
const isNum = (v)=>typeof v === 'number' && Number.isFinite(v);
function posOk(raw) {
    const b = raw;
    if (!b || typeof b !== 'object') return false;
    if (!isNum(b.x) || !isNum(b.z) || !isNum(b.hd)) return false;
    if (typeof b.mv !== 'boolean') return false;
    if (Math.abs(b.x) > WORLD_BOUND || Math.abs(b.z) > WORLD_BOUND) return false;
    return true;
}
function posWorthSending(prev, next, sinceLastSendMs) {
    if (!prev) return true;
    if (sinceLastSendMs >= IDLE_POS_MS) return true // the still heartbeat
    ;
    const d = Math.hypot(next.x - prev.x, next.z - prev.z);
    if (d >= 0.05) return true;
    let dh = Math.abs(next.hd - prev.hd) % (Math.PI * 2);
    if (dh > Math.PI) dh = Math.PI * 2 - dh;
    return dh >= 0.06;
}
function bodyRelayOk(blockedEitherWay) {
    return !blockedEitherWay;
}
function joinVerdict(input) {
    if (input.myBand === 'guest') return {
        ok: false,
        why: 'guest-mic-dark'
    };
    if (input.self) return {
        ok: false,
        why: 'self'
    };
    if (!input.targetPresent) return {
        ok: false,
        why: 'not-around'
    };
    if (input.blockedEitherWay) return {
        ok: false,
        why: 'blocked'
    };
    if (input.myBand === 'kid' || input.myBand === 'teen') {
        const friend = input.edgeStateMine === 'friend' || input.edgeStateTheirs === 'friend';
        if (!friend) return {
            ok: false,
            why: 'paddies-only'
        };
    }
    return {
        ok: true
    };
}
function bodyLook(raw) {
    const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateAvatarLook"])(raw);
    return v.ok && v.look ? v.look : null;
}
const TAU = Math.PI * 2;
function angleLerp(a, b, k) {
    let d = (b - a) % TAU;
    if (d > Math.PI) d -= TAU;
    if (d < -Math.PI) d += TAU;
    return a + d * k;
}
class InterpBuffer {
    a = null // the older snap
    ;
    b = null // the newer snap
    ;
    push(s) {
        if (!this.b) {
            this.b = {
                ...s
            };
            return;
        }
        if (s.t <= this.b.t) return; // a late packet never rewinds the clock
        this.a = this.b;
        this.b = {
            ...s
        };
    }
    /** the newest snap's clock (the wire's truth of "when did they last speak") */ lastT() {
        return this.b ? this.b.t : 0;
    }
    /** THE STALE LAW: no snaps for STALE_MS → the body has left. */ stale(now) {
        return !!this.b && now - this.b.t > STALE_MS;
    }
    /** seed a fresh buffer with ONE snap so the body stands before it walks */ seed(s) {
        if (!this.b || s.t >= this.b.t) {
            this.a = this.b;
            this.b = {
                ...s
            };
        }
    }
    out = {
        x: 0,
        z: 0,
        hd: 0,
        speed: 0,
        alive: false
    };
    /**
   * THE SAMPLE LAW: render time = newest.t − INTERP_DELAY_MS, clamped to
   * never run past newest + MAX_EXTRAP_MS; speed measured between snaps,
   * clamped by THE SPEED LAW. Writes the shared scratch — zero alloc.
   */ sample(now) {
        const o = this.out;
        if (!this.b) {
            o.alive = false;
            return o;
        }
        if (now - this.b.t > STALE_MS) {
            o.alive = false;
            return o;
        }
        // the render clock stands INTERP_DELAY behind the newest snap
        const rt = Math.min(now - INTERP_DELAY_MS, this.b.t + MAX_EXTRAP_MS);
        if (!this.a || rt >= this.b.t) {
            o.x = this.b.x;
            o.z = this.b.z;
            o.hd = this.b.hd;
            o.speed = 0;
            o.alive = true;
            return o;
        }
        const span = Math.max(1, this.b.t - this.a.t);
        const k = Math.min(1, Math.max(0, (rt - this.a.t) / span));
        o.x = this.a.x + (this.b.x - this.a.x) * k;
        o.z = this.a.z + (this.b.z - this.a.z) * k;
        o.hd = angleLerp(this.a.hd, this.b.hd, k);
        const d = Math.hypot(this.b.x - this.a.x, this.b.z - this.a.z);
        o.speed = Math.min(SPEED_MAX, d / span * 1000);
        o.alive = true;
        return o;
    }
}
function inRenderRange(ax, az, bx, bz) {
    const dx = ax - bx;
    const dz = az - bz;
    return dx * dx + dz * dz <= RENDER_RANGE * RENDER_RANGE;
}
function distMoved(ax, az, bx, bz) {
    return Math.hypot(ax - bx, az - bz);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/wheels.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CAR_RANGE",
    ()=>CAR_RANGE,
    "CAR_SPEED_MAX",
    ()=>CAR_SPEED_MAX,
    "CONDITION_LIFE",
    ()=>CONDITION_LIFE,
    "CarBuffer",
    ()=>CarBuffer,
    "DRY_TANK",
    ()=>DRY_TANK,
    "FUEL_RANGE",
    ()=>FUEL_RANGE,
    "FULL_SERVICE",
    ()=>FULL_SERVICE,
    "PAINT_VOCAB",
    ()=>PAINT_VOCAB,
    "PARKED_SEED_CAP",
    ()=>PARKED_SEED_CAP,
    "PARK_EPS",
    ()=>PARK_EPS,
    "PASSENGER_SEATS",
    ()=>PASSENGER_SEATS,
    "PETROL_PRICE_PER_LITRE",
    ()=>PETROL_PRICE_PER_LITRE,
    "REFUEL_MAX",
    ()=>REFUEL_MAX,
    "REFUEL_MIN",
    ()=>REFUEL_MIN,
    "SERVICE_RADIUS",
    ()=>SERVICE_RADIUS,
    "SERVICE_SPOTS",
    ()=>SERVICE_SPOTS,
    "SPEED_JITTER",
    ()=>SPEED_JITTER,
    "TANK_LITRES",
    ()=>TANK_LITRES,
    "VEH_HZ",
    ()=>VEH_HZ,
    "VEH_TICK_MS",
    ()=>VEH_TICK_MS,
    "WORLD_BOUND",
    ()=>WORLD_BOUND,
    "boardVerdict",
    ()=>boardVerdict,
    "carHelloVerdict",
    ()=>carHelloVerdict,
    "carInRenderRange",
    ()=>carInRenderRange,
    "carWorthSending",
    ()=>carWorthSending,
    "carriedVerdict",
    ()=>carriedVerdict,
    "clampVehicleStep",
    ()=>clampVehicleStep,
    "conditionAfterWear",
    ()=>conditionAfterWear,
    "crewVoiceOk",
    ()=>crewVoiceOk,
    "fuelAfterBurn",
    ()=>fuelAfterBurn,
    "isParkTransition",
    ()=>isParkTransition,
    "nearServiceSpot",
    ()=>nearServiceSpot,
    "paintOk",
    ()=>paintOk,
    "parkedSeedsNear",
    ()=>parkedSeedsNear,
    "patchVerdict",
    ()=>patchVerdict,
    "plateOk",
    ()=>plateOk,
    "plateOwnershipOk",
    ()=>plateOwnershipOk,
    "refuelVerdict",
    ()=>refuelVerdict,
    "repairQuote",
    ()=>repairQuote,
    "repairVerdict",
    ()=>repairVerdict,
    "seatsOf",
    ()=>seatsOf,
    "topSpeedOf",
    ()=>topSpeedOf,
    "unboardVerdict",
    ()=>unboardVerdict
]);
/**
 * LOKOJA LIFE — M24 W10-a: THE WHEELS LAW VAULT
 * ==============================================
 * The PURE laws of the shared world's fleet: real claimed citizens drive
 * real cars the whole street can see. Zero React, zero store, zero DOM —
 * the same verdicts run in the browser AND at the wire door (imported
 * VERBATIM — zero copies, zero drift, the W2-W9 doctrine).
 *
 * LAWS OF THIS FILE:
 *  - THE EPHEMERALITY LAW (bodies, carried over): a car's MOVEMENT is a
 *    moment, not a record — the 12Hz delta lane never touches LiveEvent.
 *    What IS durable is THE PARK: the row (model, face, spot, fuel,
 *    odometer) persists on every park, every bye, every disconnect.
 *  - THE CADENCE LAW: 12Hz ONLY-WHILE-MOVING (the plan's bandwidth law —
 *    a parked car is silent on the wire; the street registry holds it).
 *  - THE ADULT-HANDS LAW (M13, server-side): a minor NEVER drives online
 *    — kid or teen, the wheel refuses (minor-wheel). Passengers may ride
 *    shotgun (W10-b); the wheel itself is adult-hands.
 *  - THE GUEST DARKNESS LAW: a guest publishes NO car (no identity, no
 *    wheels — guest-mic-dark, the same law every door speaks).
 *  - THE PLATE LAW: 4–10 chars of [A-Z0-9-] — the generator's own shape
 *    and the custom plate the garage paints, one validator for both.
 *  - THE PAINT LAW: a per-model vocabulary ONLY (the rigs' real tones —
 *    an invented colour never renders; unknown falls to the default).
 *  - THE N12 SPEED LAW: the server CLAMPS every step to the model's TRUE
 *    top speed (the M23-W4 speedometer law, now structural): a tick may
 *    cover at most topSpeed × dt × JITTER (1.5 — network honesty), and a
 *    cheating client's 100-unit leap relays as the lawful distance along
 *    its own heading. The odometer reads ONLY clamped metres — a cheat's
 *    kilometres never enter the books.
 *  - THE CARRIED LAW: while my car is live on the wire, my BODY lane is
 *    silent — the walker is IN the car (the pos door refuses 'carried';
 *    the client's sender pauses itself; the wire is the backstop).
 *  - THE PARK LAW: mv true→false is a park — the row persists once, and
 *    the car stands where it stopped for every latecomer (the roster's
 *    seed carries it; no heartbeat, the wire stays thin).
 *  - THE BLOCK WALL FOR CARS: a blocked pair shares NO car either —
 *    bodyRelayOk's own verdict (the M17 wall covers the driveway).
 *  - THE RANGE LAW: a car catches the eye farther than a walker
 *    (CAR_RANGE 90 vs the bodies' 60) — squared compare, no sqrt.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/bodies.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
;
;
;
;
const VEH_HZ = 12;
const VEH_TICK_MS = Math.round(1000 / VEH_HZ);
const CAR_RANGE = 90;
const WORLD_BOUND = 330;
const SPEED_JITTER = 1.5;
const PARK_EPS = 0.05;
const PAINT_VOCAB = {
    okada: [
        '0',
        '1',
        '2',
        '3'
    ],
    keke: [
        'stock'
    ],
    taxi: [
        'yellow',
        'white',
        'silver',
        'darkblue',
        'maroon'
    ],
    danfo: [
        'stock'
    ]
};
/** THE PLATE LAW — 4–10 chars of A-Z 0-9 and the dash. The generator's
 *  LKO-123-AB fits; the garage's custom plate fits the same wall. */ const PLATE_RE = /^[A-Z0-9-]{4,10}$/;
function plateOk(plate) {
    return typeof plate === 'string' && PLATE_RE.test(plate);
}
function paintOk(model, paint) {
    if (paint === '' || paint === undefined || paint === null) return true // the default
    ;
    const vocab = PAINT_VOCAB[model];
    return !!vocab && typeof paint === 'string' && vocab.includes(paint);
}
function carHelloVerdict(input) {
    if (input.band === 'guest') return {
        ok: false,
        why: 'guest-mic-dark'
    };
    if (input.band !== 'adult') return {
        ok: false,
        why: 'minor-wheel'
    } // THE ADULT-HANDS LAW
    ;
    const model = input.model;
    if (typeof model !== 'string' || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model]) {
        return {
            ok: false,
            why: 'bad-model'
        };
    }
    if (!plateOk(input.plate)) return {
        ok: false,
        why: 'bad-plate'
    };
    if (!paintOk(model, input.paint)) return {
        ok: false,
        why: 'bad-paint'
    };
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["posOk"])(input.pos)) return {
        ok: false,
        why: 'bad-pos'
    };
    return {
        ok: true,
        model: model,
        plate: input.plate,
        paint: typeof input.paint === 'string' ? input.paint : '',
        pos: input.pos
    };
}
function carriedVerdict(hasLiveCar) {
    if (hasLiveCar) return {
        ok: false,
        why: 'carried'
    };
    return {
        ok: true
    };
}
function topSpeedOf(model) {
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model];
    return def ? def.topSpeed : 0;
}
function clampVehicleStep(prev, next, model, nowMs) {
    const top = topSpeedOf(model);
    if (!prev || !Number.isFinite(prev.x) || !Number.isFinite(prev.z)) {
        return {
            x: next.x,
            z: next.z,
            clamped: false,
            moved: 0
        };
    }
    const dt = Math.max(1, nowMs - prev.t) / 1000;
    const maxDist = Math.max(0, top * dt * SPEED_JITTER);
    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const dist = Math.hypot(dx, dz);
    if (dist <= maxDist || top <= 0) {
        return {
            x: next.x,
            z: next.z,
            clamped: false,
            moved: dist
        };
    }
    const k = maxDist / dist // scale the leap down its own direction
    ;
    return {
        x: prev.x + dx * k,
        z: prev.z + dz * k,
        clamped: true,
        moved: maxDist
    };
}
const CAR_SPEED_MAX = 12;
class CarBuffer {
    a = null;
    b = null;
    push(s) {
        if (!this.b) {
            this.b = {
                ...s
            };
            return;
        }
        if (s.t <= this.b.t) return; // a late packet never rewinds the clock
        this.a = this.b;
        this.b = {
            ...s
        };
    }
    seed(s) {
        if (!this.b || s.t >= this.b.t) {
            this.a = this.b;
            this.b = {
                ...s
            };
        }
    }
    /** the newest snap — the renderer's parked fallback reads the mv truth */ newest() {
        return this.b ? {
            ...this.b
        } : null;
    }
    out = {
        x: 0,
        z: 0,
        hd: 0,
        speed: 0,
        moving: false,
        alive: false
    };
    sample(now) {
        const o = this.out;
        if (!this.b) {
            o.alive = false;
            return o;
        }
        o.moving = this.b.mv;
        // the render clock stands INTERP_DELAY behind the newest snap
        const rt = Math.min(now - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERP_DELAY_MS"], this.b.t + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_EXTRAP_MS"]);
        if (!this.a || rt >= this.b.t) {
            o.x = this.b.x;
            o.z = this.b.z;
            o.hd = this.b.hd;
            o.speed = 0;
            o.alive = true;
            return o;
        }
        const span = Math.max(1, this.b.t - this.a.t);
        const k = Math.min(1, Math.max(0, (rt - this.a.t) / span));
        o.x = this.a.x + (this.b.x - this.a.x) * k;
        o.z = this.a.z + (this.b.z - this.a.z) * k;
        o.hd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["angleLerp"])(this.a.hd, this.b.hd, k);
        const d = Math.hypot(this.b.x - this.a.x, this.b.z - this.a.z);
        o.speed = Math.min(CAR_SPEED_MAX, d / span * 1000);
        o.alive = true;
        return o;
    }
}
function carInRenderRange(ax, az, bx, bz) {
    const dx = ax - bx;
    const dz = az - bz;
    return dx * dx + dz * dz <= CAR_RANGE * CAR_RANGE;
}
function isParkTransition(prevMv, nextMv) {
    return nextMv === false && (prevMv === true || prevMv === undefined);
}
function carWorthSending(prev, next) {
    return next.mv === true || prev !== null && prev.mv === true // the park tick rides once
    ;
}
const PASSENGER_SEATS = {
    okada: 1,
    keke: 2,
    taxi: 3,
    danfo: 5
};
function seatsOf(model) {
    return PASSENGER_SEATS[model] ?? 0;
}
function boardVerdict(input) {
    if (!input.carLive) return {
        ok: false,
        why: 'no-car'
    };
    if (input.band === 'guest') return {
        ok: false,
        why: 'guest-dark'
    };
    if (input.alreadyAboard) return {
        ok: false,
        why: 'already-aboard'
    };
    if (input.blocked) return {
        ok: false,
        why: 'blocked'
    };
    if (!input.seatsOpen) return {
        ok: false,
        why: 'seats-shut'
    };
    if (input.carMv) return {
        ok: false,
        why: 'moving'
    };
    if (input.seated >= seatsOf(input.model)) return {
        ok: false,
        why: 'full'
    };
    return {
        ok: true,
        seat: input.seated
    };
}
function unboardVerdict(riding, carMv) {
    if (!riding) return {
        ok: false,
        why: 'not-riding'
    };
    if (carMv) return {
        ok: false,
        why: 'moving'
    };
    return {
        ok: true
    };
}
function crewVoiceOk(input) {
    if (input.meBand !== 'adult' || input.peerBand !== 'adult') return false;
    if (!input.myCrew || !input.peerCrew) return false;
    return input.myCrew === input.peerCrew;
}
function patchVerdict(input) {
    if (input.band === 'guest') return {
        ok: false,
        why: 'guest-dark'
    };
    const model = input.model;
    if (typeof model !== 'string' || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model]) {
        return {
            ok: false,
            why: 'bad-model'
        };
    }
    const wantsPaint = input.paint !== undefined && input.paint !== null;
    if (wantsPaint && !paintOk(model, input.paint)) return {
        ok: false,
        why: 'bad-paint'
    };
    const wantsPlate = input.plate !== undefined && input.plate !== null;
    if (wantsPlate && !plateOk(input.plate)) return {
        ok: false,
        why: 'bad-plate'
    };
    return {
        ok: true,
        model: model,
        ...wantsPaint ? {
            paint: input.paint
        } : {},
        ...wantsPlate ? {
            plate: input.plate
        } : {}
    };
}
function plateOwnershipOk(plate, handle, model, owner) {
    if (!owner) return true // the plate is free
    ;
    return owner.handle === handle && owner.model === model // my own row may keep it
    ;
}
const PARKED_SEED_CAP = 24;
function parkedSeedsNear(rows, x, z, liveKeys) {
    const near = rows.filter((r)=>Number.isFinite(r.x) && Number.isFinite(r.z)).filter((r)=>!liveKeys.has(`${r.handle}\u0000${r.model}`)).filter((r)=>(r.x - x) * (r.x - x) + (r.z - z) * (r.z - z) <= CAR_RANGE * CAR_RANGE);
    near.sort((a, b)=>(a.x - x) * (a.x - x) + (a.z - z) * (a.z - z) - ((b.x - x) * (b.x - x) + (b.z - z) * (b.z - z)));
    return near.slice(0, PARKED_SEED_CAP);
}
/* ─────────────── W10-c: THE FUEL LAWS (the pump and the garage) ─────────────── */ /** THE MAP LAW — world3d/layout.ts's own math, replicated PURE so the
 *  WIRE can run it (layout drags three.js; the wire never does). The
 *  suite pins this constant against the real MAP_SCALE — drift is caught. */ const WIRE_MAP_SCALE = 6.2 // (GEO_WORLD_HALF 310 × 2) / 100
;
function spotOf(locId) {
    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATIONS"].find((L)=>L.id === locId);
    if (!l) return {
        x: 0,
        z: 0
    };
    return {
        x: (l.mapX - 50) * WIRE_MAP_SCALE,
        z: (l.mapY - 50) * WIRE_MAP_SCALE
    };
}
const SERVICE_SPOTS = {
    pump: [
        'transport-area',
        'ganaja-junction',
        'adankolo'
    ],
    garage: [
        'transport-area'
    ]
};
const SERVICE_RADIUS = 26;
function nearServiceSpot(kind, x, z) {
    const spots = SERVICE_SPOTS[kind] ?? [];
    return spots.some((id)=>{
        const s = spotOf(id);
        return Number.isFinite(x) && Number.isFinite(z) && (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z) <= SERVICE_RADIUS * SERVICE_RADIUS;
    });
}
const FUEL_RANGE = {
    okada: 2600,
    keke: 3400,
    taxi: 5200,
    danfo: 6800
};
const DRY_TANK = 0.02;
function fuelAfterBurn(fuel, metres, model) {
    const range = FUEL_RANGE[model];
    if (!range || metres <= 0) return fuel;
    return Math.max(0, fuel - metres / range);
}
const CONDITION_LIFE = 30_000;
function conditionAfterWear(condition, metres) {
    if (metres <= 0) return condition;
    return Math.max(0, condition - metres / CONDITION_LIFE);
}
const PETROL_PRICE_PER_LITRE = 900;
const TANK_LITRES = {
    okada: 8,
    keke: 12,
    taxi: 45,
    danfo: 60
};
const REFUEL_MIN = 200;
const REFUEL_MAX = 20_000;
function refuelVerdict(input) {
    if (input.band === 'guest') return {
        ok: false,
        why: 'guest-dark'
    };
    if (input.band !== 'adult') return {
        ok: false,
        why: 'minors-no-money'
    };
    if (!FUEL_RANGE[input.model]) return {
        ok: false,
        why: 'bad-model'
    };
    if (!input.atPump) return {
        ok: false,
        why: 'no-pump'
    };
    if (input.fuel >= 0.999) return {
        ok: false,
        why: 'tank-full'
    };
    const amount = Math.floor(Number(input.amount));
    if (!Number.isFinite(amount) || amount < REFUEL_MIN) return {
        ok: false,
        why: 'too-small'
    };
    if (amount > REFUEL_MAX) return {
        ok: false,
        why: 'too-big'
    };
    const litres = amount / PETROL_PRICE_PER_LITRE;
    const fuel = Math.min(1, input.fuel + litres / (TANK_LITRES[input.model] ?? 40));
    return {
        ok: true,
        amount,
        fuel
    };
}
const FULL_SERVICE = {
    okada: 8_000,
    keke: 14_000,
    taxi: 24_000,
    danfo: 32_000
};
function repairQuote(model, condition) {
    const full = FULL_SERVICE[model] ?? 20_000;
    return Math.max(0, Math.ceil((1 - condition) * full));
}
function repairVerdict(input) {
    if (input.band === 'guest') return {
        ok: false,
        why: 'guest-dark'
    };
    if (input.band !== 'adult') return {
        ok: false,
        why: 'minors-no-money'
    };
    if (!FULL_SERVICE[input.model]) return {
        ok: false,
        why: 'bad-model'
    };
    if (!input.atGarage) return {
        ok: false,
        why: 'no-garage'
    };
    if (input.condition >= 0.999) return {
        ok: false,
        why: 'no-need'
    };
    return {
        ok: true,
        amount: repairQuote(input.model, input.condition),
        condition: 1
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/vehicles.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * VEHICLES SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1254-1254, 1915-1996, 1998-2163, 3476-3484.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "vehiclesSlice",
    ()=>vehiclesSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/economy.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fleet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/systems/wheels.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
// PH2.5: lazy wire — the socket.io client (src/game/systems/wire.ts) used to ride
// this module statically, which dragged it (and engine.io) into the menu's
// first-load game-core chunk. The DMV sync below is the ONLY wire use site in
// the store; the module now loads on demand through loadWire(). Type imports
// stay static where needed.
let wireP = null;
const loadWire = ()=>wireP ??= __turbopack_context__.A("[project]/src/game/systems/wire.ts [app-client] (ecmascript, async loader)");
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
;
;
;
;
const vehiclesSlice = (set, get)=>({
        fleet: {
            day: 1,
            done: []
        },
        runGig: (gigId)=>{
            const { player, world, fleet, isWorking, isTravelling } = get();
            if (!player || !world || isWorking || isTravelling) return false;
            const gig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gigBoard"])(world.day, player.vehicles, player.level, world.weather, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelMultFor"])(world.day), get().calendar).find((g)=>g.id === gigId);
            if (!gig) return false;
            if (fleet.day === world.day && fleet.done.includes(gigId)) {
                get().notify({
                    icon: '🛵',
                    text: 'You don run this one today — tomorrow get their own runs.',
                    tone: 'neutral'
                });
                return false;
            }
            if (world.currentLocation !== 'transport-area') {
                get().notify({
                    icon: '📍',
                    text: 'The passengers dey wait at the Motor Park — travel come first.',
                    tone: 'bad'
                });
                return false;
            }
            if (player.needs.energy < gig.energyCost) {
                get().notify({
                    icon: '🥵',
                    text: 'You are too tired for that run. Rest small first.',
                    tone: 'bad'
                });
                return false;
            }
            const label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gigLabel"])(gig);
            set({
                isWorking: true,
                workingLabel: `Driving — ${label}`
            });
            const applyDone = ()=>{
                const { player: p, world: w } = get();
                if (!p || !w) return;
                // fuel first — the pump does not take promises
                const fueled = get().removeMoney(gig.fuel, {
                    label: `Fuel — ${label.split(' run ')[0]} (gig)`,
                    category: 'transport'
                });
                if (!fueled) {
                    set({
                        isWorking: false,
                        workingLabel: null
                    });
                    get().notify({
                        icon: '💸',
                        text: `The run needs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gig.fuel)} fuel and your pocket no carry am.`,
                        tone: 'bad'
                    });
                    return;
                }
                // the passenger's fare — honest hustle income the KGIRS can see
                get().addMoney(gig.payout, {
                    label: `Gig — ${label}`,
                    category: 'hustle'
                });
                const paid = get().player;
                const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(paid.needs, {
                    energy: -gig.energyCost
                }), 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1);
                const clock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(w.timeOfDay, w.day, w.weather, 1);
                const nextFleet = {
                    day: w.day,
                    done: [
                        ...get().fleet.day === w.day ? get().fleet.done : [],
                        gig.id
                    ]
                };
                set({
                    player: {
                        ...paid,
                        needs,
                        stats: {
                            ...paid.stats,
                            jobsCompleted: paid.stats.jobsCompleted + 1
                        }
                    },
                    world: {
                        ...w,
                        currentLocation: gig.toId,
                        ...clock
                    },
                    fleet: nextFleet,
                    isWorking: false,
                    workingLabel: null,
                    offers: []
                });
                get().addXp(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].gigXp);
                get().addSkillXp('hustle', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FLEET"].gigHustleXp);
                get().notify({
                    icon: '🛵',
                    text: `${label} done — passenger paid ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gig.payout)}${gig.rainPremium ? ' (rain price)' : ''}, fuel chop ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gig.fuel)}.`,
                    tone: 'good'
                });
                get().notify({
                    icon: '📍',
                    text: `You drop the passenger at ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][gig.toId]?.name ?? 'the drop-off'}.`,
                    tone: 'neutral'
                });
                // M9 — the run lands on the daily goals + the onboarding arc
                get().bumpGoal('gig');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bumpOnboarding"])(get, set, 'work');
                // a run can cross midnight — the civic mesh follows the day
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commitCivicDays"])(get, set, w.day, clock.day);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            };
            setTimeout(applyDone, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].transitionMs);
            return true;
        },
        /* ------------------ Stage 5 — ownership, bank, social ------------------ */ buyVehicle: (model)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model];
            if (!def) return false;
            if (player.vehicles.some((v)=>v.model === model)) {
                get().notify({
                    icon: def.emoji,
                    text: `You already own a ${def.label}. One per model — garage space na premium.`,
                    tone: 'neutral'
                });
                return false;
            }
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAfford"])(player.cash, def.price)) {
                get().notify({
                    icon: '💰',
                    text: `${def.label} costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(def.price)}. Keep pushing — e go reach.`,
                    tone: 'bad'
                });
                return false;
            }
            const vehicle = {
                id: `${model}-${world.day}-${player.vehicles.length + 1}`,
                model,
                plate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generatePlate"])(model, world.day, player.vehicles.length),
                boughtDay: world.day
            };
            const ok = get().removeMoney(def.price, {
                label: `${def.label} (${vehicle.plate})`,
                category: 'shop'
            });
            if (!ok) return false;
            const paid = get().player;
            if (!paid) return false;
            set({
                player: {
                    ...paid,
                    vehicles: [
                        ...paid.vehicles,
                        vehicle
                    ]
                }
            });
            get().notify({
                icon: def.emoji,
                text: `Congratulations! ${def.label} na yours — plate ${vehicle.plate}.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /* W10-c — THE METERS' ONE WRITER: the tank and the condition wear the
   * disk's truth (the hello readback + the pump/garage acks write here;
   * the pure burn math lives in wheels.ts). Additive fields — the save
   * carries them without a version bump, exactly like paint did. */ patchVehicleMeters: (model, patch)=>{
            const player = get().player;
            if (!player) return;
            if (!player.vehicles.some((v)=>v.model === model)) return;
            set({
                player: {
                    ...player,
                    vehicles: player.vehicles.map((v)=>v.model === model ? {
                            ...v,
                            ...patch.fuel !== undefined ? {
                                fuel: patch.fuel
                            } : {},
                            ...patch.condition !== undefined ? {
                                condition: patch.condition
                            } : {}
                        } : v)
                }
            });
        },
        /* W10 — THE WHEELS' FACE: the garage paints and plates through the SAME
   * laws the wire door runs (zero copies — an invented colour or a bad
   * plate refuses before it ever reaches the street). W10-b: the patch
   * also RIDES TO THE WIRE — the DMV door is the server's own eye (the
   * plate uniqueness wall); a refusal REVERTS the local face so the save
   * never disagrees with the disk. */ setVehicleStyle: (vehicleId, style)=>{
            const player = get().player;
            if (!player) return false;
            const vehicle = player.vehicles.find((v)=>v.id === vehicleId);
            if (!vehicle) return false;
            if (style.plate !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["plateOk"])(style.plate.toUpperCase())) {
                get().notify({
                    icon: '🚫',
                    text: 'Plate na 4–10 characters — letters, numbers and dash only.',
                    tone: 'bad'
                });
                return false;
            }
            if (style.paint !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["paintOk"])(vehicle.model, style.paint)) {
                get().notify({
                    icon: '🎨',
                    text: 'That colour no dey the book for this ride.',
                    tone: 'bad'
                });
                return false;
            }
            const prevPaint = vehicle.paint ?? '';
            const prevPlate = vehicle.plate;
            const paint = style.paint !== undefined ? style.paint : vehicle.paint ?? '';
            const plate = style.plate !== undefined ? style.plate.toUpperCase() : vehicle.plate;
            set({
                player: {
                    ...player,
                    vehicles: player.vehicles.map((v)=>v.id === vehicleId ? {
                            ...v,
                            paint,
                            plate
                        } : v)
                }
            });
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][vehicle.model];
            get().notify({
                icon: def.emoji,
                text: `${def.short} done — plate ${plate}. The street go see am.`,
                tone: 'good'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            // W10-b — THE DMV SYNC: claimed + live only, fire-and-forget; the ack's
            // refusal reverts the local face (the disk is the court of final appeal)
            // PH2.5: lazy wire — the socket.io client loads on demand. The only
            // behavioral consequence: the 'live' check and the send run one import-
            // resolution later than the static import did; the revert-on-refusal
            // law and the fire-and-forget shape are unchanged.
            const { token } = get().account;
            if (token) {
                void loadWire().then((wire)=>{
                    if (wire.useWireStore.getState().state !== 'live') return;
                    return wire.wireSendVehiclePatch(vehicle.model, {
                        ...style.paint !== undefined ? {
                            paint
                        } : {},
                        ...style.plate !== undefined ? {
                            plate
                        } : {}
                    }).then((r)=>{
                        if (r.ok) return;
                        const cur = get().player;
                        if (!cur) return;
                        set({
                            player: {
                                ...cur,
                                vehicles: cur.vehicles.map((v)=>v.id === vehicleId ? {
                                        ...v,
                                        paint: prevPaint,
                                        plate: prevPlate
                                    } : v)
                            }
                        });
                        const why = r.why === 'plate-taken' ? 'DMV: that plate don belong to another motor — pick another.' : r.why === 'bad-plate' ? 'DMV: the plate no follow the law.' : 'DMV no gree — the old face stands.';
                        get().notify({
                            icon: '🚫',
                            text: why,
                            tone: 'bad'
                        });
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
                    });
                }).catch(()=>{
                /* the wire hiccuped — the local face stands, the next hello reconciles */ });
            }
            return true;
        },
        sellVehicle: (vehicleId)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const vehicle = player.vehicles.find((v)=>v.id === vehicleId);
            if (!vehicle) return false;
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][vehicle.model];
            const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resaleValue"])(vehicle.model, vehicle.boughtDay, world.day);
            set({
                player: {
                    ...player,
                    vehicles: player.vehicles.filter((v)=>v.id !== vehicleId)
                }
            });
            get().addMoney(value, {
                label: `Sold ${def.short} (${vehicle.plate})`,
                category: 'other'
            });
            get().notify({
                icon: def.emoji,
                text: `${def.short} sold for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(value)}. The park sabi your price.`,
                tone: 'neutral'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        settleDrive: (meters)=>{
            const { player } = get();
            if (!player || meters <= 0) return;
            const cost = Math.min(4, meters / 1000 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORLD3D"].driveEnergyPerKm);
            if (cost < 0.5) return;
            const needs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(player.needs, {
                energy: -Math.round(cost * 10) / 10
            });
            set({
                player: {
                    ...player,
                    needs
                }
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/ladder.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LADDER SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1258-1260, 2906-3298.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "ladderSlice",
    ()=>ladderSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/education.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
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
const ladderSlice = (set, get)=>({
        education: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshEducationState"])(),
        housing: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshHousingState"])(),
        japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshJapaState"])(),
        /* ---------------------- M12 — THE LADDER ---------------------- */ /** Enroll at FUL: the fee, the level, the semester clock starts tomorrow. */ enrollFul: ()=>{
            const { player, world, education } = get();
            if (!player || !world) return false;
            // M13 — the family shield: FUL na teen/adult road (kids dey primary/secondary)
            if (player.ageBand === 'kid') {
                get().notify({
                    icon: '🛡️',
                    text: 'University na teen/adult road — your school na the scammer game and the library.',
                    tone: 'neutral'
                });
                return false;
            }
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canEnroll"])(education, player.level);
            if (!gate.ok) {
                get().notify({
                    icon: '🎓',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.enrollFee, {
                label: 'FUL enrollment — semester fee',
                category: 'other'
            })) {
                get().notify({
                    icon: '💸',
                    text: `The enrollment na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.enrollFee)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                education: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enrollApply"])(education, world.day)
            });
            get().notify({
                icon: '🎓',
                text: 'You don enroll at FUL! Lectures start tomorrow — the semester clock dey run (18 days, 12 lectures, then the exam).',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Attend one lecture at FUL: smart XP + the tutorial stipend (+ the Dean's grant at 8). */ attendLecture: ()=>{
            const { player, world, education } = get();
            if (!player || !world) return false;
            const atUniversity = world.currentLocation.startsWith('ful-');
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAttendLecture"])(education, world.day, atUniversity);
            if (!gate.ok) {
                get().notify({
                    icon: '🎓',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (player.needs.energy < 8) {
                get().notify({
                    icon: '🥵',
                    text: 'You are too tired for the lecture hall. Rest small.',
                    tone: 'bad'
                });
                return false;
            }
            let ed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attendLectureApply"])(education, world.day);
            const grant = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["earnsDeansGrant"])(ed);
            if (grant) ed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["grantApply"])(ed);
            set({
                education: ed
            });
            get().addSkillXp('smart', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.lectureSmartXp);
            get().addMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.lectureStipend, {
                label: 'Tutorial stipend — FUL lecture',
                category: 'hustle'
            });
            if (grant) {
                get().addMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.deansGrant, {
                    label: "Dean's hustle grant — 8 lectures",
                    category: 'tip'
                });
                get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.deansGrantRep);
                get().notify({
                    icon: '🏅',
                    text: `THE DEAN'S GRANT! ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.deansLectures} lectures don land — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.deansGrant)} + the street dey respect the book.`,
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            } else {
                get().notify({
                    icon: '📚',
                    text: `Lecture ${ed.lecturesDone}/${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.lecturesNeeded} done — smart XP +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.lectureSmartXp}, stipend ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.lectureStipend)}.`,
                    tone: 'good'
                });
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Sit the semester exam at FUL: the work decides, no dice. */ sitExam: ()=>{
            const { player, world, education } = get();
            if (!player || !world) return false;
            const atUniversity = world.currentLocation.startsWith('ful-');
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canSitExam"])(education, world.day, atUniversity);
            if (!gate.ok) {
                get().notify({
                    icon: '📝',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            const { next, passed, graduatedNow } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["examApply"])(education, world.day, player.skills.smart);
            set({
                education: next
            });
            if (graduatedNow) {
                get().notify({
                    icon: '🎓',
                    text: `FINAL EXAM PASSED! The convocation holds in ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.convocationInDays} days — the gown dey press.`,
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            } else if (passed) {
                get().notify({
                    icon: '✅',
                    text: `Semester ${education.semester} passed (score ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["examScore"])(player.skills.smart, education.lecturesDone).toFixed(1)}) — semester ${next.semester} starts tomorrow.`,
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            } else {
                get().notify({
                    icon: '📕',
                    text: `The exam no pass (score ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["examScore"])(player.skills.smart, education.lecturesDone).toFixed(1)} — you need ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.examPassScore}). The semester repeats — the lectures don reset.`,
                    tone: 'bad'
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Collect the certificate at the convocation: the career gates open. */ attendConvocation: ()=>{
            const { player, world, education } = get();
            if (!player || !world) return false;
            const atUniversity = world.currentLocation.startsWith('ful-');
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canAttendConvocation"])(education, world.day, atUniversity);
            if (!gate.ok) {
                get().notify({
                    icon: '🎓',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            set({
                education: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convocationApply"])(education)
            });
            get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.graduateRep);
            const p0 = get().player;
            set({
                player: {
                    ...p0,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                        mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.graduateMood
                    })
                }
            });
            get().notify({
                icon: '🎓',
                text: `CONVOCATION! The FUL certificate dey your hand — +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education.graduateRep} rep, the career desks don open (Civil Servant, Tutorial Assistant).`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Pay the rent book (in person at home free; phone +₦50). */ payRent: (channel)=>{
            const { player, world, housing } = get();
            if (!player || !world) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canPayRent"])(housing, player.cash);
            if (!gate.ok) {
                get().notify({
                    icon: '🏠',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            const fee = channel === 'phone' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee : 0;
            if (channel === 'phone' && world.currentLocation !== 'home') {
                get().notify({
                    icon: '📱',
                    text: 'The rent pays free in person — the phone transfer carries the ₦50 fee.',
                    tone: 'neutral'
                });
                return false;
            }
            if (fee > 0 && player.cash < gate.amount + fee) {
                get().notify({
                    icon: '💸',
                    text: `The transfer fee na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(fee)} — your pocket no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            if (fee > 0 && !get().removeMoney(fee, {
                label: 'Transfer fee — rent',
                category: 'bank'
            })) return false;
            set({
                housing: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["payRentApply"])(housing, gate.amount)
            });
            get().removeMoney(gate.amount, {
                label: 'Rent — one cycle',
                category: 'other'
            });
            get().notify({
                icon: '🏠',
                text: `Rent don clear — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gate.amount)} paid, the book moves ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].housing.rentCycleDays} days forward.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Buy a rung of the housing ladder (the agent visits your sheet). */ buyProperty: (propertyId)=>{
            const { player, housing } = get();
            if (!player) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canBuyProperty"])(housing, propertyId, player.level, player.cash);
            if (!gate.ok) {
                get().notify({
                    icon: '🏠',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            const prop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["propertyFor"])(propertyId);
            if (!get().removeMoney(prop.price, {
                label: `Property — ${prop.name}`,
                category: 'shop'
            })) return false;
            set({
                housing: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buyPropertyApply"])(housing, propertyId)
            });
            get().notify({
                icon: '🏠',
                text: `KEYS DON LAND! ${prop.name} na your own — no more rent, comfort +${prop.comfort} on every sleep.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Furnish the owned home: one honest tier at a time. */ furnishHome: (tier)=>{
            const { player, housing } = get();
            if (!player) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canFurnish"])(housing, tier);
            if (!gate.ok) {
                get().notify({
                    icon: '🛋️',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(gate.cost, {
                label: `Furnishing tier ${tier} — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].housing.furnishTiers.find((f)=>f.tier === tier)?.label ?? ''}`,
                category: 'shop'
            })) return false;
            set({
                housing: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["furnishApply"])(housing, tier)
            });
            const p0 = get().player;
            const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].housing.furnishTiers.find((f)=>f.tier === tier);
            set({
                player: {
                    ...p0,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                        mood: 2
                    })
                }
            });
            get().notify({
                icon: '🛋️',
                text: `${def?.label ?? 'Furnishing'} don land — the house don warm (+${def?.mood ?? 0} comfort).`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Settle the landlord's wahala (the cost buys peace). */ resolveWahala: ()=>{
            const { player, housing } = get();
            if (!player) return false;
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canResolveWahala"])(housing, player.cash);
            if (!gate.ok) {
                get().notify({
                    icon: '🔑',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(gate.cost, {
                label: 'Landlord wahala settlement',
                category: 'other'
            })) return false;
            set({
                housing: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveWahalaApply"])(housing)
            });
            get().notify({
                icon: '🤝',
                text: `Wahala settle — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gate.cost)} and the compound dey quiet again.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** The JAPA gauntlet — request the NIMC slip at the GRA desk. */ requestNimc: ()=>{
            const { player, world, japa } = get();
            if (!player || !world) return false;
            // M13 — the JAPA gauntlet is adult paperwork (kids dey grow first)
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canJapa"])(player.ageBand)) {
                get().notify({
                    icon: '🛡️',
                    text: 'JAPA na adult road — grow first, the documents go wait.',
                    tone: 'neutral'
                });
                return false;
            }
            const atGrades = world.currentLocation === 'government-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canRequestNimc"])(japa, player.level, atGrades);
            if (!gate.ok) {
                get().notify({
                    icon: '🪪',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.nimcFee, {
                label: 'NIMC enrollment fee',
                category: 'other'
            })) {
                get().notify({
                    icon: '💸',
                    text: `The NIMC fee na ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.nimcFee)}.`,
                    tone: 'bad'
                });
                return false;
            }
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestNimcApply"])(japa, world.day)
            });
            get().notify({
                icon: '🪪',
                text: `NIMC slip don enter queue — come back in ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.nimcQueueDays} day(s). The queue no dey forget anybody.`,
                tone: 'neutral'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        collectNimc: ()=>{
            const { player, world, japa } = get();
            if (!player || !world) return false;
            const atGrades = world.currentLocation === 'government-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCollectNimc"])(japa, world.day, atGrades);
            if (!gate.ok) {
                get().notify({
                    icon: '🪪',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectNimcApply"])(japa, world.day)
            });
            get().notify({
                icon: '🪪',
                text: 'NIMC slip dey your hand — step 1 of 5 don land. The passport window dey wait.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** The official passport window: 3 days, the full fee, zero drama. */ requestPassport: ()=>{
            const { player, world, japa } = get();
            if (!player || !world) return false;
            const atGrades = world.currentLocation === 'government-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canRequestPassport"])(japa, player.cash, atGrades);
            if (!gate.ok) {
                get().notify({
                    icon: '📜',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.passportFee, {
                label: 'Passport application — official window',
                category: 'other'
            })) return false;
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestPassportApply"])(japa, world.day)
            });
            get().notify({
                icon: '📜',
                text: `Passport application dey process — ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.passportQueueDays} days, no drama.`,
                tone: 'neutral'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        collectPassport: ()=>{
            const { player, world, japa } = get();
            if (!player || !world) return false;
            const atGrades = world.currentLocation === 'government-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCollectPassport"])(japa, world.day, atGrades);
            if (!gate.ok) {
                get().notify({
                    icon: '📜',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collectPassportApply"])(japa, world.day)
            });
            get().notify({
                icon: '📜',
                text: 'The green book don land — passport dey your hand! The KGIRS clearance dey next.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** The Ganaja street agent: half the fee, sometimes a wash. */ tryAgent: ()=>{
            const { player, world, japa, account } = get();
            if (!player || !world) return false;
            // M13 — THE FAMILY SHIELD: the street agent is crime-adjacent — kids
            // can't japa at all, teens can't touch the 419 road. 18+ only.
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canJapa"])(player.ageBand) || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["crimeAllowed"])(player.ageBand, 'japa-agent')) {
                get().notify({
                    icon: '🛡️',
                    text: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CRIME_REFUSALS"]['japa-agent'],
                    tone: 'neutral'
                });
                return false;
            }
            const atGanaja = world.currentLocation === 'ganaja-junction';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canTryAgent"])(japa, player.cash, atGanaja);
            if (!gate.ok) {
                get().notify({
                    icon: '🕶️',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.agentFee, {
                label: 'Agent express passport — Ganaja',
                category: 'other'
            })) return false;
            const { next, real } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tryAgentApply"])(japa, world.day, account.handle);
            set({
                japa: next
            });
            if (real) {
                get().notify({
                    icon: '🕶️',
                    text: 'The agent sabi somebody! The passport don land TODAY — the street go respect the connect.',
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            } else {
                get().addReputation(-__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.agentRepHit);
                get().notify({
                    icon: '🚬',
                    text: `NA WASH! The agent don disappear with ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.agentFee)} — the street don laugh at you (-${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.agentRepHit} rep). The official window dey wait.`,
                    tone: 'bad'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** KGIRS clearance: the taxman's signature reads your record. */ kgirsClearance: ()=>{
            const { player, world, japa, civic } = get();
            if (!player || !world || !civic) return false;
            const atGrades = world.currentLocation === 'government-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canClearKgirs"])(japa, civic.kgirs.warrant, atGrades);
            if (!gate.ok) {
                get().notify({
                    icon: '🧾',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearanceApply"])(japa, world.day)
            });
            get().notify({
                icon: '🧾',
                text: 'KGIRS clearance don stamp — the taxman dey shake your hand. The police certificate dey next.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** The police character certificate: a clean fine book + the fee. */ policeCertificate: ()=>{
            const { player, world, japa, civic } = get();
            if (!player || !world || !civic) return false;
            const atGrades = world.currentLocation === 'government-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canGetPoliceCertificate"])(japa, civic.police.fines, player.cash, atGrades);
            if (!gate.ok) {
                get().notify({
                    icon: '👮',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.policeFee, {
                label: 'Police character certificate',
                category: 'other'
            })) return false;
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["policeCertificateApply"])(japa, world.day)
            });
            get().notify({
                icon: '👮',
                text: 'The character certificate don land — your file complete! The send-off dey wait at the Motor Park.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** THE SEND-OFF: the complete file + the ticket = the Abuja motor loads. */ takeFlight: ()=>{
            const { player, world, japa } = get();
            if (!player || !world) return false;
            // M13 — the send-off na adult departure (the shield holds the gate)
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canJapa"])(player.ageBand)) {
                get().notify({
                    icon: '🛡️',
                    text: 'The send-off na adult road — grow first, JAPA go wait.',
                    tone: 'neutral'
                });
                return false;
            }
            const atPark = world.currentLocation === 'transport-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canTakeFlight"])(japa, player.cash, atPark);
            if (!gate.ok) {
                get().notify({
                    icon: '✈️',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.ticketFee, {
                label: 'The Abuja ticket — JAPA send-off',
                category: 'transport'
            })) return false;
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["takeFlightApply"])(japa, world.day)
            });
            get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.repReward);
            const p0 = get().player;
            set({
                player: {
                    ...p0,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(p0.needs, {
                        mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.moodReward
                    })
                }
            });
            if (!player.achievements.includes('japa')) {
                set({
                    player: {
                        ...get().player,
                        achievements: [
                            ...player.achievements,
                            'japa'
                        ]
                    }
                });
            }
            get().notify({
                icon: '✈️',
                text: `THE SEND-OFF! The whole motor park don spray you — JAPA DON LAND (+${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].japa.repReward} rep). The first remittance go reach tomorrow morning.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** The MOPOL VIP escort: the siren clears your road for two days. */ runEscort: ()=>{
            const { player, world, japa, civic } = get();
            if (!player || !world || !civic) return false;
            const atGrades = world.currentLocation === 'government-area';
            const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canRunEscort"])(japa, world.day, civic.kgirs.warrant, atGrades);
            if (!gate.ok) {
                get().notify({
                    icon: '🚨',
                    text: gate.why,
                    tone: 'neutral'
                });
                return false;
            }
            set({
                japa: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runEscortApply"])(japa, world.day)
            });
            get().addMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].mopol.escortPay, {
                label: 'MOPOL VIP escort detail',
                category: 'job'
            });
            get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].mopol.escortRep);
            get().notify({
                icon: '🚨',
                text: `Escort detail done — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].mopol.escortPay)} + the siren don clear your road for ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].mopol.sirenDays} days (journeys ×${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].mopol.sirenMinutesMult}).`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/data/npcChat.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — NPC Chat Lines (Stage 5)
 * ---------------------------------------
 * What each NPC says when you chat with them, by familiarity tier.
 * The phone app and the 3D "talk" interaction both read from here —
 * the social SYSTEM decides WHICH line, this file only holds the words.
 *
 * Tiers: stranger → acquaintance → paddy → close-paddy
 * Voice rule: warm Nigerian pidgin, every line is safe, in-character,
 * and tied to the NPC's home location / hustle world.
 */ __turbopack_context__.s([
    "NPC_CHAT",
    ()=>NPC_CHAT
]);
const NPC_CHAT = {
    musa: {
        stranger: [
            'Ah, welcome! You wan buy cloth? Everything good fabric dey here.',
            'Kpata market na my home. Anywhere you wan go, ask me.'
        ],
        acquaintance: [
            'Ah na you! How the hustle dey go today?',
            'If you wan get fine fabric cheap, na me you go meet. No wahala.'
        ],
        paddy: [
            'My paddy! Come make we plan something — market dey pay people wey sabi look well.',
            'You don dey move up o. I dey always talk am — na so e go continue.'
        ],
        'close-paddy': [
            'See am! My guy for life. Anything wey you need for Kpata, na family price.',
            'One day we go open shop together. I get the fabric, you get the sense.'
        ]
    },
    'hajiya-amina': {
        stranger: [
            'You are welcome. Fresh pepper from the farm — look well before you price am.',
            'Market respect people wey get patience. Wetin you dey find?'
        ],
        acquaintance: [
            'Ah, my customer. Your eye don sharp well well since you dey come.',
            'I keep the best tomatoes for people wey no go waste my time.'
        ],
        paddy: [
            'My dear, come sit. Any good gist from the other side of market?',
            'You dey do well. God go continue to bless this your hustle.'
        ],
        'close-paddy': [
            'Come, come! I don cook extra — you must eat before you leave today.',
            'You be like pikin to me now. Anything wey you wan do, I dey support.'
        ]
    },
    'mama-ngozi': {
        stranger: [
            'Welcome! You look hungry — the pot is still hot, no worry.',
            'First time here? Order anything, you go come back tomorrow by yourself.'
        ],
        acquaintance: [
            'My regular! The usual, or you wan try today\'s special?',
            'Sit down, sit down. Somebody wey dey always smile like you no fit palava.'
        ],
        paddy: [
            'Ah my pikin! I don tell everybody for this food strip about you.',
            'Today your food na family treat — no talk am loud o!'
        ],
        'close-paddy': [
            'You don eat? You sure? I no go hear story o — sit, food dey come.',
            'When you go open your own place, na my recipe you go use o! I dey joke… partially.'
        ]
    },
    emeka: {
        stranger: [
            'Oboi! You wan learn okada work? E no easy but e dey pay small small.',
            'If e fit move, I fit carry am. Wetin be your own talent?'
        ],
        acquaintance: [
            'My guy! Road today dey free — no police wahala, no fuel wahala.',
            'You dey look sharper ah ah. Money dey your pocket small small, e dey show!'
        ],
        paddy: [
            'Oboi we go run delivery together one day. You bring customers, I bring wheel.',
            'Any route you wan sabi for this Lokoja, just ask. I don wear all the road like cloth.'
        ],
        'close-paddy': [
            'Na you be my manager for future o! When I buy second bike, na you go ride am.',
            'From Kpata to Ganaja, nobody sabi road like we two. Team no dey disappoint.'
        ]
    },
    'baba-t': {
        stranger: [
            'Welcome to Motor Park. Everything here na order — that\'s why we dey move.',
            'You wan join transport work? Come with patience, leave with sense.'
        ],
        acquaintance: [
            'Ah my friend. Your level don dey rise for this park, I dey watch you.',
            'Keke unit dey always need sharp people. Keep your record clean.'
        ],
        paddy: [
            'My guy, seat dey wait you. Even keke sef know your face now.',
            'We go talk business soon. Park get level, and you don almost reach.'
        ],
        'close-paddy': [
            'Chairman! Park dey respect you now. Anything you wan run, I go open door.',
            'You remember when you first come? Now even danfo drivers dey greet you first.'
        ]
    },
    chantel: {
        stranger: [
            'Hey! You look like you get sense. You dey do anything with the students here?',
            'Campus dey burst with small small opportunities. You just need eye.'
        ],
        acquaintance: [
            'Ah my personal person! I get one small plan — you go like am.',
            'Exams dey come o, but hustle no dey wait exam. Balance am well!'
        ],
        paddy: [
            'My guy! I don draft the whole plan — Monday morning, we go talk am.',
            'You dey move like person wey go far. I wan dey your circle when e happen.'
        ],
        'close-paddy': [
            'Day-one paddy! We go build something wey this campus go remember.',
            'Any gig wey you dey run, count me in. Paddy no dey watch paddy suffa.'
        ]
    },
    'alhaji-sule': {
        stranger: [
            'Good day. If your papers complete, the process is simple. If not… e go take time.',
            'Office na office — but I fit tell you the correct way to file anything.'
        ],
        acquaintance: [
            'Ah, my reliable friend. Your files dey always complete. I respect that.',
            'The secretariat get plenty opportunity for person wey sabi read the room.'
        ],
        paddy: [
            'My friend, come. I go show you the correct office for that your plan.',
            'You dey rise well. Government work like steady people like you.'
        ],
        'close-paddy': [
            'Chairman! I don arrange the file — you only need to sign, sign.',
            'One day we go laugh inside one correct office. Just keep your name clean.'
        ]
    },
    'uncle-ben': {
        stranger: [
            'Young man, do you know this town get the FIRST secondary school in Nigeria? Come, I go tell you.',
            'History dey everywhere for this Lokoja — na only eye we no dey open.'
        ],
        acquaintance: [
            'Ah my student! Today I go show you the other side of the old town.',
            'You dey listen well. Na so history dey enter person body.'
        ],
        paddy: [
            'My dear, the stories wey I no tell tourists, na you I dey tell them.',
            'One day you go carry this town story go far places. Mark my word.'
        ],
        'close-paddy': [
            'My pikin! Sit down. Today na the day I tell you about Lord Lugroad… e get why we dey call am so.',
            'When they write the new history of Lokoja, your name go dey inside. I don see am.'
        ]
    },
    idris: {
        stranger: [
            'The rivers dey generous today. You wan see the confluence? Na God work.',
            'Fishing na patience work. Anybody wey no fit wait no go sabi this water.'
        ],
        acquaintance: [
            'My friend! The fish dey bite better for evening — come with me one day.',
            'You dey grow o. Even the river dey notice people wey dey try.'
        ],
        paddy: [
            'Come make we sit for the bank. The water get way of answering questions.',
            'You be my people now. When catch plenty, na we two go share am.'
        ],
        'close-paddy': [
            'My brother from the land! Today the river go provide — I don already ask am.',
            'This confluence na our office now. Any big decision, come here first.'
        ]
    },
    'baba-danjuma': {
        stranger: [
            'Patti no be small hill o. You wan climb? Go slow, drink water, respect the rock.',
            'From up there you go see where two rivers become one. Na blessing to see am.'
        ],
        acquaintance: [
            'Ah, my climber! Your leg don dey strong. Next time we go reach the summit.',
            'The hill like you small small. E dey test person before e show am everything.'
        ],
        paddy: [
            'My friend, today we go the quiet path. Na there the real Patti dey hide.',
            'You don climb am many times now. The hill don accept you.'
        ],
        'close-paddy': [
            'Welcome, son of the hill! Come, the morning wind dey fresh for the top.',
            'I don climb Patti ten thousand times — but with you, e still dey sweet me.'
        ]
    },
    hauwa: {
        stranger: [
            'Ah-ah, visitor for our school! You wan see the chemistry lab or you dey find somebody?',
            'I no waste time o — break don nearly finish. Wetin you want?'
        ],
        acquaintance: [
            'Na you again! How market? I hope say you bring gist, no be only books.',
            'Our WAEC prep na fire these days. Sometimes I go just dey dream of formulas.'
        ],
        paddy: [
            'My friend! Come make we sit under the mango tree — the gist plenty today.',
            'You sabi say after WAEC, na university next. FUL or nothing!'
        ],
        'close-paddy': [
            'See my day-one paddy! When I turn scientist, no forget say na here we start.',
            'I even keep jollof for you from the social. You too no dey come school on time!'
        ]
    },
    chidi: {
        stranger: [
            'Welcome to the permanent site o. The sun no dey pity anybody here — carry water.',
            'You be fresh student? Abeg no miss LT B, that lecturer no dey forgive.'
        ],
        acquaintance: [
            'My guy! You don dey adapt to campus life. The shuttle wahala no easy sha.',
            'Exams dey come. Library go full this week — if you see seat, hold am tight.'
        ],
        paddy: [
            'Padi mi! Come make we hustle this school life together — notes, runs, everything.',
            'One day after NYSC, na big things we go do. Just dey watch.'
        ],
        'close-paddy': [
            'My brother from another mother! Anything for FUL, I get plug.',
            'Graduation go sweet — and you must sit front row that day. Na family matter.'
        ]
    },
    'miss-grace': {
        stranger: [
            'Good day. This is a place of learning — please keep your voice low and your manners high.',
            'Visitors sign at the office first. That is how we have run this college since 1956.'
        ],
        acquaintance: [
            'Ah, our friend again. The students behave better when you are around — interesting.',
            'Crowther built this college on discipline. I am only keeping the flame.'
        ],
        paddy: [
            'Come in, come in. You know you are always welcome in this compound.',
            'I have watched many children pass through these gates. Some of them now greet ME as colleagues.'
        ],
        'close-paddy': [
            'My dear! Sit. The kettle is on. Even principals need somebody to talk to.',
            'When they write the history of this school, your name will be in the kind part.'
        ]
    },
    abubakar: {
        stranger: [
            'You reach the poly? Mind the generators — the workshop boys dey weld.',
            'ND or HND? Everybody for this road na one family, no shy.'
        ],
        acquaintance: [
            'Ah my guy! See the engine wey we rebuild yesterday — she dey sound like new.',
            'Poly no be joke o, but the hands-on sense? Nobody fit beat am.'
        ],
        paddy: [
            'Come make we check this alternator — you go learn something wey go serve you for life.',
            'When my workshop open for real, na you be my first customer. I swear.'
        ],
        'close-paddy': [
            'My paddy for life! Any vehicle wahala, bring am — family work, family price.',
            'We go blow together — you with your sense, me with my hands. Watch us.'
        ]
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/social.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHAT_COOLDOWN_DAYS",
    ()=>CHAT_COOLDOWN_DAYS,
    "TIERS",
    ()=>TIERS,
    "TIER_META",
    ()=>TIER_META,
    "afterChat",
    ()=>afterChat,
    "afterGift",
    ()=>afterGift,
    "afterHangout",
    ()=>afterHangout,
    "canChat",
    ()=>canChat,
    "canGift",
    ()=>canGift,
    "canHangout",
    ()=>canHangout,
    "chatGain",
    ()=>chatGain,
    "dayRoll",
    ()=>dayRoll,
    "favorRollsToday",
    ()=>favorRollsToday,
    "giftById",
    ()=>giftById,
    "pickLine",
    ()=>pickLine,
    "relationshipFor",
    ()=>relationshipFor,
    "tierFor",
    ()=>tierFor
]);
/**
 * LOKOJA LIFE — Social System (Stage 5 + M6 depth)
 * ---------------------------------------
 * Pure functions for the familiarity/relationship track. No UI, no
 * side effects — the store applies results, components only read.
 *
 * Model: every NPC has familiarity 0–100. Talking once per in-game day
 * moves it up. Tiers unlock warmer chat lines (data/npcChat.ts) and a
 * documented hustle-offer perk hook for the opportunities system.
 *
 * M6 — LIVING WORLD, social depth: gifts that really cost naira, a
 * night-only hangout that spends a clock slot, and paddies who pay you
 * back with real gist (favour hustles). All laws below are pure — the
 * store applies them and the save remembers the cooldowns.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
;
const TIERS = [
    {
        tier: 'stranger',
        min: 0
    },
    {
        tier: 'acquaintance',
        min: 15
    },
    {
        tier: 'paddy',
        min: 40
    },
    {
        tier: 'close-paddy',
        min: 75
    }
];
const TIER_META = {
    stranger: {
        label: 'Stranger',
        perk: 'They still dey size you up.',
        offerBonus: 0
    },
    acquaintance: {
        label: 'Acquaintance',
        perk: 'Small gist, small trust.',
        offerBonus: 0.05
    },
    paddy: {
        label: 'Paddy',
        perk: 'Real paddy — better offers pass your way.',
        offerBonus: 0.1
    },
    'close-paddy': {
        label: 'Close Paddy',
        perk: 'Day-one. Doors open for you.',
        offerBonus: 0.15
    }
};
const CHAT_COOLDOWN_DAYS = 1;
function chatGain(familiarity) {
    return familiarity >= 40 ? 8 : 6;
}
function canChat(state, today) {
    if (!state) return true;
    return today > state.lastChatDay;
}
function tierFor(familiarity) {
    let current = 'stranger';
    for (const t of TIERS){
        if (familiarity >= t.min) current = t.tier;
    }
    return current;
}
function relationshipFor(relationships, npcId) {
    return relationships[npcId] ?? {
        familiarity: 0,
        lastChatDay: 0
    };
}
function pickLine(lines, familiarity, today) {
    return lines[(familiarity + today) % lines.length];
}
function afterChat(state, today) {
    return {
        familiarity: Math.min(100, state.familiarity + chatGain(state.familiarity)),
        lastChatDay: today
    };
}
function dayRoll(npcId, day) {
    let h = 2166136261;
    const key = `${npcId}:${day}`;
    for(let i = 0; i < key.length; i++){
        h ^= key.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0) % 1000 / 1000;
}
function giftById(id) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].gifts.find((g)=>g.id === id) ?? null;
}
function canGift(state, today) {
    if (!state?.lastGiftDay) return true;
    return today > state.lastGiftDay;
}
function afterGift(state, gift, today) {
    return {
        ...state,
        familiarity: Math.min(100, state.familiarity + gift.familiarity),
        lastGiftDay: today
    };
}
function canHangout(state, today) {
    if (!state?.lastHangoutDay) return true;
    return today - state.lastHangoutDay >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.cooldownDays;
}
function afterHangout(state, today) {
    return {
        ...state,
        familiarity: Math.min(100, state.familiarity + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.familiarity),
        lastHangoutDay: today
    };
}
function favorRollsToday(familiarity, npcId, day) {
    if (familiarity < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].favorTierMin) return false;
    return dayRoll(`favor:${npcId}`, day) < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].favorChance;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/social.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * SOCIAL SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1265-1265, 3300-3371, 3373-3474, 4466-4529.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "socialSlice",
    ()=>socialSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/hustles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcChat.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/opportunities.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/social.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
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
;
;
;
const socialSlice = (set, get)=>({
        shield: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshShieldState"])(),
        chatNpc: (npcId)=>{
            const { player, world } = get();
            if (!player || !world) return null;
            const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][npcId];
            if (!npc) return null;
            const today = world.day;
            const rel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, npcId);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canChat"])(rel, today)) {
                get().notify({
                    icon: '💬',
                    text: `You don talk with ${npc.name} today. Tomorrow another level.`,
                    tone: 'neutral'
                });
                return null;
            }
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["afterChat"])(rel, today);
            const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tierFor"])(next.familiarity);
            const pool = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcChat$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_CHAT"][npcId];
            const firstMeeting = rel.familiarity === 0;
            const reply = pool ? firstMeeting ? pool.stranger[0] : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickLine"])(pool[tier], rel.familiarity, today) : npc.bio;
            // M6 — a paddy pays back: on a lucky (deterministic) day, a real paddy
            // drops REAL gist — an eligible hustle from THEIR OWN offers, through
            // the SAME opportunity pipeline. Transient: accept now or it goes cold.
            let favorOffer;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["favorRollsToday"])(next.familiarity, npcId, today)) {
                const slot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(today, world.timeOfDay);
                const def = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE_BY_ID"]).find((d)=>d.npcId === npcId && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEligible"])(d, player, slot, player.activeOpportunities));
                if (def) favorOffer = {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeOpportunityInstance"])(def, slot),
                    source: 'gist'
                };
            }
            set({
                player: {
                    ...player,
                    relationships: {
                        ...player.relationships,
                        [npcId]: next
                    }
                }
            });
            get().addSkillXp('social', 2);
            get().bumpGoal('chat');
            if (favorOffer) {
                get().notify({
                    icon: '🤝',
                    text: `${npc.name} get small work for you — check the chat.`,
                    tone: 'good'
                });
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                npcId,
                tier,
                familiarity: next.familiarity,
                reply,
                firstMeeting,
                favorOffer
            };
        },
        /** M13 — KID SOCIALS: the emote road. Same relationship clock, same
   *  cooldown law, same familiarity ledger — but the words are preset
   *  emotes and the replies are preset warmth. No free text, ever. */ emoteChat: (npcId, emoteId)=>{
            const { player, world } = get();
            if (!player || !world) return null;
            if (player.ageBand !== 'kid') return null;
            const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][npcId];
            const emote = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIELD"].kidEmotes.find((e)=>e.id === emoteId);
            if (!npc || !emote) return null;
            const rel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, npcId);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canChat"])(rel, world.day)) {
                get().notify({
                    icon: '💬',
                    text: `You don greet ${npc.name} today — tomorrow another level.`,
                    tone: 'neutral'
                });
                return null;
            }
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["afterChat"])(rel, world.day);
            next.familiarity = Math.min(100, rel.familiarity + emote.fam);
            const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tierFor"])(next.familiarity);
            set({
                player: {
                    ...player,
                    relationships: {
                        ...player.relationships,
                        [npcId]: next
                    }
                }
            });
            get().addSkillXp('social', 1);
            get().bumpGoal('chat');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                npcId,
                tier,
                familiarity: next.familiarity,
                reply: emote.reply,
                firstMeeting: rel.familiarity === 0
            };
        },
        /* --------------------- M6 — social depth (gifts / hangout) --------------------- */ giveGift: (npcId, giftId)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][npcId];
            const gift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["giftById"])(giftId);
            if (!npc || !gift) return false;
            const rel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, npcId);
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canGift"])(rel, world.day)) {
                get().notify({
                    icon: '🎁',
                    text: `You don give ${npc.name} gift today — no overdo am.`,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(gift.cost, {
                label: `Gift — ${gift.label} for ${npc.name}`,
                category: 'other'
            })) {
                get().notify({
                    icon: '🎁',
                    text: `${gift.label} costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(gift.cost)} — you no carry am.`,
                    tone: 'bad'
                });
                return false;
            }
            const paid = get().player;
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["afterGift"])(rel, gift, world.day);
            const beforeTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tierFor"])(rel.familiarity);
            const afterTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tierFor"])(next.familiarity);
            set({
                player: {
                    ...paid,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(paid.needs, {
                        mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].giftMood
                    }),
                    relationships: {
                        ...paid.relationships,
                        [npcId]: next
                    }
                }
            });
            get().notify({
                icon: gift.emoji,
                text: `${npc.name} collect the ${gift.label} — familiarity +${gift.familiarity}.${afterTier !== beforeTier ? ` You two na ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIER_META"][afterTier].label} now!` : ''}`,
                tone: 'good'
            });
            get().bumpGoal('gift');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play(afterTier !== beforeTier ? 'levelup' : 'chime');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        hangout: (npcId)=>{
            const { player, world } = get();
            if (!player || !world) return false;
            const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][npcId];
            if (!npc) return false;
            const rel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, npcId);
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.slots.includes(world.timeOfDay)) {
                get().notify({
                    icon: '🌙',
                    text: 'Hangout na after-work something — evening or night.',
                    tone: 'neutral'
                });
                return false;
            }
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canHangout"])(rel, world.day)) {
                get().notify({
                    icon: '🍻',
                    text: `You and ${npc.name} just hang out — give am small space (every ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.cooldownDays} days).`,
                    tone: 'neutral'
                });
                return false;
            }
            if (!get().removeMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.cost, {
                label: `Night out with ${npc.name}`,
                category: 'fun'
            })) {
                get().notify({
                    icon: '🍻',
                    text: `Pulling ${npc.name} out costs ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.cost)} — you no reach.`,
                    tone: 'bad'
                });
                return false;
            }
            const paid = get().player;
            const next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["afterHangout"])(rel, world.day);
            set({
                player: {
                    ...paid,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySlotDecay"])(paid.needs, 1, get().settings.chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CHILL"].decayMult : 1), {
                        mood: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.mood
                    }),
                    relationships: {
                        ...paid.relationships,
                        [npcId]: next
                    }
                },
                world: {
                    ...world,
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["advanceWorldClock"])(world.timeOfDay, world.day, world.weather, 1)
                }
            });
            get().notify({
                icon: '🍻',
                text: `You and ${npc.name} catch evening together — mood +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.mood}, familiarity +${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.familiarity}.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** Accept a paddy's favour — the acceptOffer guards (hands-full, duplicate)
   *  apply exactly; only the transport differs (chat hands the instance over). */ acceptFavorOffer: (offer)=>{
            const { player } = get();
            if (!player) return;
            if (player.activeOpportunities.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxActive) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🎒',
                    text: `Your hands are full — finish or drop something first (max ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxActive}).`,
                    tone: 'bad'
                });
                return;
            }
            if (player.activeOpportunities.some((o)=>o.defId === offer.defId)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                get().notify({
                    icon: '🤔',
                    text: 'You already took this one.',
                    tone: 'bad'
                });
                return;
            }
            set({
                player: {
                    ...player,
                    activeOpportunities: [
                        ...player.activeOpportunities,
                        offer
                    ]
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            get().notify({
                icon: '🤝',
                text: 'Favour accepted — it goes cold if you wait too long!',
                tone: 'good'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** M13 — SPOT THE SCAMMER: one round per day, honest money for sharp eyes. */ playScammer: (pickIndex)=>{
            const { player, world, shield } = get();
            if (!player || !world) return;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canPlayScammer"])(shield.scammerDay, world.day)) {
                get().notify({
                    icon: '⏳',
                    text: 'The street teaches once a day — come back tomoro.',
                    tone: 'neutral'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                return;
            }
            const round = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scamRound"])(world.day);
            const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scamAnswerApply"])(shield, round, pickIndex, world.day);
            set({
                shield: res.next
            });
            if (res.correct && res.reward) {
                get().addMoney(res.reward.cash, {
                    label: 'Spot the Scammer — sharp eye',
                    category: 'tip'
                });
                get().addSkillXp('smart', res.reward.smartXp);
                set({
                    player: {
                        ...get().player,
                        needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(get().player.needs, {
                            mood: res.reward.mood
                        })
                    }
                });
                get().notify({
                    icon: '🛡️',
                    text: `Correct! ${res.lesson} (+${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(res.reward.cash)})`,
                    tone: 'good'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                get().bumpGoal('study');
            } else {
                get().notify({
                    icon: '📚',
                    text: `That one na honest talk. Lesson: ${res.lesson}`,
                    tone: 'neutral'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** M13 — the local parent-PIN gate (guests): first set stores the salted hash. */ setLocalParentPin: (pin)=>{
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateParentPin"])(pin);
            if (!v.ok) {
                get().notify({
                    icon: '🔒',
                    text: v.why,
                    tone: 'bad'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                return false;
            }
            if (get().shield.parentPinHash) {
                get().notify({
                    icon: '🔒',
                    text: 'A parent PIN already guards this device.',
                    tone: 'bad'
                });
                return false;
            }
            set({
                shield: {
                    ...get().shield,
                    parentPinHash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localPinHash"])(pin, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeLocalSalt"])())
                }
            });
            get().notify({
                icon: '🛡️',
                text: 'Parent PIN set — the tier ladder dey under your watch now.',
                tone: 'good'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        },
        /** M13 — the local tier gate: climb kid→teen→adult with the parent's yes. */ unlockTierLocal: (to, parentPin)=>{
            const { player, shield } = get();
            if (!player) return false;
            const from = player.ageBand;
            const pinOk = shield.parentPinHash !== null && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["localPinHash"])(parentPin, shield.parentPinHash.slice(8)) === shield.parentPinHash;
            const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tierGateVerdict"])(from, to, pinOk);
            if (!verdict.allowed) {
                get().notify({
                    icon: '🔒',
                    text: verdict.why,
                    tone: 'bad'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                return false;
            }
            set({
                player: {
                    ...player,
                    ageBand: to
                }
            });
            get().notify({
                icon: '🛡️',
                text: `Life stage moved to ${to.toUpperCase()} — the city adjusts to you.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return true;
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/lifestyle.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LIFESTYLE SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1273-1275, 4305-4334, 4336-4464.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "lifestyleSlice",
    ()=>lifestyleSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/patti.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/story.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wardrobe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const lifestyleSlice = (set, get)=>({
        story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshStoryState"])(),
        patti: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPattiState"])(),
        wardrobe: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshWardrobeState"])(),
        /* --------------------------- M19 — the wardrobe --------------------------- */ /** THE SHOP DOOR: the law verdicts first, the wallet pays second. */ wardrobeBuy: (kind, itemKey)=>{
            const { player, wardrobe } = get();
            if (!player) return {
                ok: false,
                why: 'Start a life first.'
            };
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shopBuy"])(wardrobe, kind, itemKey);
            if (!v.ok) return {
                ok: false,
                why: v.why
            };
            if (player.cash < v.price) return {
                ok: false,
                why: `You need ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(v.price)} — the wallet no reach.`
            };
            get().removeMoney(v.price, {
                label: `${kind === 'walk' ? 'Walk style' : 'Outfit'} — ${kind === 'walk' ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WALK_BY_KEY"].get(itemKey)?.label : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PREMIUM_BY_KEY"].get(itemKey)?.label ?? itemKey}`,
                category: 'shop'
            });
            const next = kind === 'walk' ? {
                ...wardrobe,
                ownedWalks: [
                    ...wardrobe.ownedWalks,
                    v.itemKey
                ]
            } : {
                ...wardrobe,
                ownedStyles: [
                    ...wardrobe.ownedStyles,
                    v.itemKey
                ]
            };
            set({
                wardrobe: next
            });
            get().notify({
                icon: kind === 'walk' ? '🕺' : '👑',
                text: `${kind === 'walk' ? 'Walk' : 'Outfit'} secured — ${v.itemKey} na yours now.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /** THE EQUIP DOOR: an owned walk only — the rig never takes credit. */ wardrobeEquipWalk: (walkKey)=>{
            const { wardrobe } = get();
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["equipWalk"])(wardrobe, walkKey);
            if (!v.ok) return {
                ok: false,
                why: v.why
            };
            set({
                wardrobe: {
                    ...wardrobe,
                    activeWalk: v.walkKey
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /* ------------------------ M19 — THE CONFLUENCE PATH ----------------------- */ /** Chapter 1: one carry of sand per day beside the crusher boy. */ storyCarrySand: ()=>{
            const { player, world, story } = get();
            if (!player || !world) return {
                ok: false,
                why: 'Start a life first.'
            };
            if (world.currentLocation !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].meetPlace) return {
                ok: false,
                why: 'Find the crusher boy at the Patti trail base.'
            };
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canCarrySand"])(story, {
                day: world.day,
                chapter: story.chapter,
                energy: player.needs.energy
            });
            if (!v.ok) return {
                ok: false,
                why: v.why
            };
            // the honest needs engine pays the sand's energy, the wallet pays the split
            set({
                player: {
                    ...player,
                    needs: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNeedsDelta"])(player.needs, {
                        energy: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandEnergy
                    })
                }
            });
            get().addMoney(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandPay, {
                label: 'Sand run with the crusher boy',
                category: 'hustle'
            });
            set({
                story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyCarry"])(story, world.day)
            });
            const after = get().story;
            get().notify({
                icon: '⛏️',
                text: after.chapter >= 2 ? `Three days of sand — the boy talk say him wan go school. Him name na Musa.` : `Sand carried — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandPay)} split. Musa nod for you.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('quest');
            get().bumpGoal('work');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /** Chapter 2: the notebook — ₦3,500 or the school's own trust (level ≥ 5). */ storyPayNotebook: ()=>{
            const { player, story } = get();
            if (!player) return {
                ok: false,
                why: 'Start a life first.'
            };
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canPayNotebook"])(story, {
                chapter: story.chapter,
                cash: player.cash,
                level: player.level
            });
            if (!v.ok) return {
                ok: false,
                why: v.why
            };
            if (v.cost > 0) get().removeMoney(v.cost, {
                label: "Musa's school levy + notebook",
                category: 'shop'
            });
            set({
                story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyNotebook"])(story)
            });
            get().addReputation(4);
            get().notify({
                icon: '📒',
                text: v.cost > 0 ? `Notebook + levy paid — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(v.cost)}. Musa dey smile for the first time.` : 'Your word stand in for the levy — the school sabi your face.',
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('quest');
            get().bumpGoal('work');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /** Chapter 3: the fever night at the hospital — ₦2,000 or the story stops here. */ storyPayFever: ()=>{
            const { player, story } = get();
            if (!player) return {
                ok: false,
                why: 'Start a life first.'
            };
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canPayFever"])(story, {
                chapter: story.chapter,
                cash: player.cash
            });
            if (!v.ok) return {
                ok: false,
                why: v.why
            };
            get().removeMoney(v.cost, {
                label: 'FTH fever night — Musa',
                category: 'shop'
            });
            set({
                story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyFever"])(story)
            });
            get().addReputation(5);
            get().notify({
                icon: '🏥',
                text: `The fever break — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(v.cost)} settle am. Musa say he go become doctor, mark am.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('quest');
            get().bumpGoal('work');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /** Chapter 4: ₦500 a day on the desk — six days. */ storySponsor: ()=>{
            const { player, world, story } = get();
            if (!player || !world) return {
                ok: false,
                why: 'Start a life first.'
            };
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canSponsor"])(story, {
                day: world.day,
                chapter: story.chapter,
                cash: player.cash
            });
            if (!v.ok) return {
                ok: false,
                why: v.why
            };
            get().removeMoney(v.cost, {
                label: "Sponsor Musa's desk",
                category: 'shop'
            });
            set({
                story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applySponsor"])(story, world.day)
            });
            const after = get().story;
            get().notify({
                icon: '🪑',
                text: after.sponsoredDays >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sponsorDays ? `Six days complete — the exams dey come. Wait small.` : `Desk sponsored (${after.sponsoredDays}/${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sponsorDays}) — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(v.cost)} well spent.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('quest');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /** Chapter 5: the white coat — the wait served, the city celebrates. */ storyGraduate: ()=>{
            const { player, world, story } = get();
            if (!player || !world) return {
                ok: false,
                why: 'Start a life first.'
            };
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canGraduate"])(story, {
                day: world.day
            });
            if (!v.ok) return {
                ok: false,
                why: v.why
            };
            set({
                story: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyWhiteCoat"])(story, world.day)
            });
            get().addReputation(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].whiteCoatRep);
            // THE DROPS: the earned agbada + the Chairman Strut — one clean set()
            const wd = get().wardrobe;
            set({
                wardrobe: {
                    ...wd,
                    ownedStyles: [
                        ...new Set([
                            ...wd.ownedStyles,
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].whiteCoatOutfit
                        ])
                    ],
                    ownedWalks: [
                        ...new Set([
                            ...wd.ownedWalks,
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].whiteCoatWalk
                        ])
                    ]
                }
            });
            get().notify({
                icon: '🎓',
                text: `DR. MUSA! The white coat don land — Confluence Gold agbada + Chairman Strut na YOURS. Day ${world.day}.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('levelup');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /** M19 — THE HILL'S WHISPER: the HUD poll asks; the law answers.
   *  Rewards pay through the honest engines; the discovery book is idempotent. */ checkPatti: (x, z)=>{
            const { world, patti } = get();
            if (!world) return null;
            const hit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nearestSecret"])(x, z, patti);
            if (!hit) return null;
            const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["discover"])(patti, hit.secret.id, world.day);
            if (!res.isNew) return null;
            set({
                patti: res.state
            });
            // the reward rides the SAME engines as every other naira/xp/rep
            const r = hit.secret.reward;
            if (r.kind === 'cash' && r.amount) get().addMoney(r.amount, {
                label: `Patti secret — ${hit.secret.name}`,
                category: 'tip'
            });
            if (r.kind === 'xp' && r.amount) get().addXp(r.amount);
            if (r.kind === 'rep' && r.amount) get().addReputation(r.amount);
            if (r.kind === 'outfit' && r.item) {
                const wd = get().wardrobe;
                set({
                    wardrobe: {
                        ...wd,
                        ownedStyles: [
                            ...new Set([
                                ...wd.ownedStyles,
                                r.item
                            ])
                        ]
                    }
                });
            }
            get().notify({
                icon: '🗿',
                text: `SECRET FOUND — ${hit.secret.name}: ${hit.secret.line}`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('levelup');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('secret');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return hit.secret;
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/systems/binarydelta.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELTA_CEILING",
    ()=>DELTA_CEILING,
    "applyDelta",
    ()=>applyDelta,
    "deltaPushFields",
    ()=>deltaPushFields,
    "encodeDelta",
    ()=>encodeDelta,
    "patchFromBase64",
    ()=>patchFromBase64,
    "patchToBase64",
    ()=>patchToBase64
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
/**
 * M20 — THE BINARY DELTA (saves under the <1MB law)
 * ---------------------------------------------------
 * The cloud transport today carries the whole signed envelope every
 * push. This codec shrinks the wire to the CHANGE: a binary patch of
 * [keep, replace] ops over the previous payload, varint-lengthed,
 * magic-stamped 'LKBD'.
 *
 * THE EXACTNESS LAW: applyDelta(base, encodeDelta(base, next)) ===
 * next — for EVERY pair, proven in the law suite on hostile pairs
 * (empty, identical, disjoint, unicode, 100KB-scale) and on a real
 * v19-shaped save pair.
 *
 * THE CEILING LAW: a patch for any honest save is < 1MB — asserted
 * in tests; a patch that would exceed it is refused at encode time
 * (the caller falls back to the whole envelope — the M9 transport is
 * the fallback, never a wall).
 *
 * THE HONESTY NOTE: this is a PREFIX-TRIMMING delta, not a field-level
 * diff — simplest possible, provably correct: [magic][ver][baseLen]
 * [prefix][body = next bytes from prefix to END]. The body carries the
 * tail so reconstruction is exact by construction (a suffix-trimmed
 * variant was tried and KILLED by this suite — the tail could not be
 * rebuilt). For saves whose change is a middle slice this still cuts
 * the wire to roughly the changed middle. The M14 signature rides the
 * FULL payload as today (the server stores whole envelopes; the patch
 * is transport clothing, unwrapped before the vault sees it).
 */ const MAGIC = 0x4c4b4244 // 'LKBD'
;
const FORMAT_VERSION = 1;
const OP_KEEP = 1;
const OP_REPLACE = 2;
const DELTA_CEILING = 1_000_000;
/* ------------------------------- varint codec ------------------------------- */ function writeVarint(out, value) {
    let v = value >>> 0;
    while(v > 0x7f){
        out.push(v & 0x7f | 0x80);
        v >>>= 7;
    }
    out.push(v);
}
function readVarint(bytes, pos) {
    let result = 0;
    let shift = 0;
    let p = pos;
    for(;;){
        if (p >= bytes.length) throw new Error('LKBD: torn varint');
        const b = bytes[p];
        p += 1;
        result |= (b & 0x7f) << shift;
        if ((b & 0x80) === 0) break;
        shift += 7;
        if (shift > 31) throw new Error('LKBD: varint overflow');
    }
    return {
        value: result >>> 0,
        pos: p
    };
}
function encodeDelta(base, next) {
    if (typeof base !== 'string' || typeof next !== 'string') throw new Error('LKBD: pairs must be strings');
    // the common prefix — walk while the bytes agree
    const enc = new TextEncoder();
    const baseBytes = enc.encode(base);
    const nextBytes = enc.encode(next);
    let prefix = 0;
    const maxPrefix = Math.min(baseBytes.length, nextBytes.length);
    while(prefix < maxPrefix && baseBytes[prefix] === nextBytes[prefix])prefix++;
    // THE BODY CARRIES THE TAIL: everything from the prefix to the END of
    // next — no suffix trimming, so applyDelta rebuilds next exactly.
    const ops = [];
    writeVarint(ops, prefix);
    writeVarint(ops, nextBytes.length - prefix);
    for(let i = prefix; i < nextBytes.length; i++)ops.push(nextBytes[i]);
    const head = [];
    // magic + version + base length (the receiver sanity-checks its base)
    head.push(MAGIC >>> 24 & 0xff, MAGIC >>> 16 & 0xff, MAGIC >>> 8 & 0xff, MAGIC & 0xff);
    head.push(FORMAT_VERSION);
    writeVarint(head, baseBytes.length);
    const out = new Uint8Array(head.length + ops.length);
    out.set(head, 0);
    out.set(ops, head.length);
    if (out.length > DELTA_CEILING) throw new Error('LKBD: patch breaks the <1MB ceiling — fall back to the whole envelope');
    return out;
}
function applyDelta(base, patch) {
    if (patch.length < 6 || (patch[0] << 24 | patch[1] << 16 | patch[2] << 8 | patch[3]) !== MAGIC) {
        throw new Error('LKBD: not a patch (magic refused)');
    }
    if (patch[4] !== FORMAT_VERSION) throw new Error('LKBD: unknown patch format');
    let pos = 5;
    // layout: [magic4][ver1][baseLen varint][prefix varint][replaceLen varint][replace bytes…]
    const baseLenRead = readVarint(patch, pos);
    pos = baseLenRead.pos;
    const baseLen = baseLenRead.value;
    const prefixRead = readVarint(patch, pos);
    pos = prefixRead.pos;
    const prefix = prefixRead.value;
    const bodyLenRead = readVarint(patch, pos);
    pos = bodyLenRead.pos;
    const bodyLen = bodyLenRead.value;
    const enc = new TextEncoder();
    const baseBytes = enc.encode(base);
    if (baseLen !== baseBytes.length) throw new Error('LKBD: patch was cut against a different base');
    if (prefix > baseBytes.length) throw new Error('LKBD: patch prefix outruns its base');
    if (pos + bodyLen > patch.length) throw new Error('LKBD: patch body torn');
    const nextLen = prefix + bodyLen;
    const nextBytes = new Uint8Array(nextLen);
    nextBytes.set(baseBytes.subarray(0, prefix), 0);
    nextBytes.set(patch.subarray(pos, pos + bodyLen), prefix);
    const dec = new TextDecoder('utf-8', {
        fatal: false
    });
    return dec.decode(nextBytes);
}
function patchToBase64(patch) {
    let bin = '';
    for(let i = 0; i < patch.length; i++)bin += String.fromCharCode(patch[i]);
    if (typeof btoa === 'function') return btoa(bin);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(patch).toString('base64');
}
function patchFromBase64(b64) {
    if (typeof atob === 'function') {
        const bin = atob(b64);
        const out = new Uint8Array(bin.length);
        for(let i = 0; i < bin.length; i++)out[i] = bin.charCodeAt(i);
        return out;
    }
    return new Uint8Array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(b64, 'base64'));
}
function deltaPushFields(baseEnvelope, nextEnvelope) {
    if (!baseEnvelope || baseEnvelope === nextEnvelope) return null;
    try {
        const patch = encodeDelta(baseEnvelope, nextEnvelope);
        // not worth the wire if the patch alone is >= 60% of the payload
        if (patch.length >= nextEnvelope.length * 0.6) return null;
        return {
            patch: patchToBase64(patch)
        };
    } catch  {
        return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/pulse.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * PULSE SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1269-1269, 1281-1282, 4788-4879, 5400-5469.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 */ __turbopack_context__.s([
    "pulseSlice",
    ()=>pulseSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$binarydelta$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/binarydelta.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/guest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/pulse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/save.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/teleport.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
const pulseSlice = (set, get)=>({
        cityPulse: null,
        pendingArrival: null,
        cloudPending: false,
        /* --------------------------- M15 — the city pulse --------------------------- */ /** Opening the paper marks today's feed read — the unread dot dies honestly. */ openCityPulse: ()=>{
            const { player, world, civic, chaos, rivers, calendar, cityPulse } = get();
            if (!player || !world || !civic) return;
            const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pulseForDay"])({
                day: world.day,
                weather: world.weather,
                chaos,
                civic,
                rivers,
                calendar
            });
            set({
                cityPulse: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markPulseRead"])(cityPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshPulseState"])(), world.day, items)
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        /** THE POSTCARD: this moment, signed, ~100 bytes, WhatsApp-ready. */ shareTeleport: async ()=>{
            const { player, world } = get();
            if (!player || !world) return {
                ok: false,
                why: 'no game'
            };
            const tally = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dayTally"])(player.transactions, world.day);
            const moment = {
                v: 1,
                day: world.day,
                locId: world.currentLocation,
                name: player.name,
                level: player.level,
                rep: player.reputation,
                earned: tally.earned,
                moves: tally.moves,
                trail: tally.trail
            };
            const enc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeTeleport"])(moment);
            if (!enc.ok) return {
                ok: false,
                why: enc.why
            };
            const card = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postcardFor"])(moment);
            const share = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareText"])(get, card.title, card.body, enc.url);
            if (!share.ok) return {
                ok: false,
                why: share.why
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["payStreetCredit"])(get, set);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true,
                url: enc.url
            };
        },
        /** THE HEADLINE: a City Pulse item rides the same share law. */ sharePulseCard: async (item)=>{
            const { world } = get();
            if (!world) return {
                ok: false,
                why: 'no game'
            };
            const origin = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.location?.origin ? window.location.origin : '';
            const share = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shareText"])(get, `${item.icon} ${item.headline}`, item.body, origin || 'Lokoja Life');
            if (!share.ok) return {
                ok: false,
                why: share.why
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["payStreetCredit"])(get, set);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
            return {
                ok: true
            };
        },
        /** THE ARRIVAL: a verified postcard lands you on the sender's street — free. */ arriveByTeleport: (code)=>{
            const dec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$teleport$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeTeleport"])(code);
            if (!dec.ok) {
                get().notify({
                    icon: '📩',
                    text: dec.why === 'tampered' ? 'This postcard don break — somebody don edit am. E no go load.' : 'This postcard no readable — the code cut off for road.',
                    tone: 'bad'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
                return {
                    ok: false,
                    why: dec.why
                };
            }
            const m = dec.moment;
            const { player, world, account } = get();
            if (!player || !world) {
                // a fresh arrival — the postcard waits for the creation flow
                set({
                    pendingArrival: {
                        code: code.trim(),
                        moment: m
                    }
                });
                return {
                    ok: true
                };
            }
            // THE GUEST LAW: the gate stands before a forward leap, even by postcard
            const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gateVerdict"])(account, m.locId, world.day);
            if (verdict.blocked) {
                set({
                    gateOpen: true,
                    pendingArrival: {
                        code: code.trim(),
                        moment: m
                    }
                });
                return {
                    ok: false,
                    why: 'gate'
                };
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyArrival"])(set, get, code.trim(), m);
            return {
                ok: true
            };
        },
        /** THE OFFLINE LAW: the queued push rides again the moment the network returns. */ flushCloudQueue: async ()=>{
            const { cloudPending, account } = get();
            if (!cloudPending || !account.linked) return;
            if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
            const res = await get().pushCloud();
            if (res.ok) {
                set({
                    cloudPending: false
                });
                try {
                    window.localStorage.removeItem('lokoja-life:cloud-queue');
                } catch  {}
                get().notify({
                    icon: '☁️',
                    text: 'Network don come back — your save don reach the cloud.',
                    tone: 'good'
                });
            }
        },
        /** M9 — push the current save to the cloud (linked accounts only). M14: the
   *  envelope's signature rides along. M15: THE ZERO-BYTE PUSH — an unchanged
   *  life costs the network nothing; M16: an offline push QUEUES, it never dies. */ pushCloud: async ()=>{
            const { player, world, civic, account } = get();
            if (!player || !world || !civic) return {
                ok: false,
                why: 'no game'
            };
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'not linked'
            };
            // M16 — THE OFFLINE LAW: the queue flag lights NOW (the flush rides the
            // 'online' event), and the honest toast says the network, not the player.
            if (typeof navigator !== 'undefined' && navigator.onLine === false) {
                set({
                    cloudPending: true
                });
                try {
                    window.localStorage.setItem('lokoja-life:cloud-queue', '1');
                } catch  {}
                return {
                    ok: false,
                    why: 'offline'
                };
            }
            get().saveNow();
            const save = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].load();
            if (!save) return {
                ok: false,
                why: 'no save'
            };
            // M15 — THE ZERO-BYTE PUSH: the vault already holds this exact life
            const pushed = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].lastPushedHash();
            if (pushed && pushed === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].fingerprintOf(save)) {
                return {
                    ok: true,
                    why: 'delta-skip'
                };
            }
            // M14 — the signed envelope's sig: the vault stores it beside the save
            let sig = '';
            try {
                const env = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].readEnvelope() ?? '{}');
                sig = typeof env.sig === 'string' ? env.sig : '';
            } catch  {}
            // M20 — THE BINARY DELTA PUSH: the wire carries the CHANGE against the
            // exact string the vault accepted last time. A refused patch (a stranger's
            // base, an older server, a torn codec) falls back to the whole envelope —
            // the M9 transport is the fallback, never a wall.
            const nextEnv = JSON.stringify(save);
            const deltaFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$binarydelta$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deltaPushFields"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].lastPushedEnv(), nextEnv);
            try {
                let res;
                if (deltaFields) {
                    res = await fetch('/api/cloud/push', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${account.token}`
                        },
                        body: JSON.stringify({
                            schema_version: save.version,
                            patch: deltaFields.patch,
                            sig: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].sigForString(nextEnv)
                        })
                    });
                } else {
                    res = await fetch('/api/cloud/push', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${account.token}`
                        },
                        body: JSON.stringify({
                            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].toCloudPayload(save),
                            sig
                        })
                    });
                }
                if (!res.ok && deltaFields) {
                    // THE FALLBACK LAW — one honest retry, whole envelope
                    res = await fetch('/api/cloud/push', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${account.token}`
                        },
                        body: JSON.stringify({
                            ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].toCloudPayload(save),
                            sig
                        })
                    });
                }
                if (!res.ok) return {
                    ok: false,
                    why: 'cloud refused'
                };
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].markPushed(save);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SaveSystem"].markPushedEnv(nextEnv);
                set({
                    cloudPending: false
                });
                try {
                    window.localStorage.removeItem('lokoja-life:cloud-queue');
                } catch  {}
                return {
                    ok: true
                };
            } catch  {
                // M16 — a network failure queues the push; it never dies silently
                set({
                    cloudPending: true
                });
                try {
                    window.localStorage.setItem('lokoja-life:cloud-queue', '1');
                } catch  {}
                return {
                    ok: false,
                    why: 'network'
                };
            }
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/game/systems/walletnet.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWalletNetStore",
    ()=>useWalletNetStore,
    "walletNetDeposit",
    ()=>walletNetDeposit,
    "walletNetInit",
    ()=>walletNetInit,
    "walletNetSync",
    ()=>walletNetSync,
    "walletNetTransfer",
    ()=>walletNetTransfer,
    "walletNetWithdraw",
    ()=>walletNetWithdraw
]);
/**
 * LOKOJA LIFE — M24 W6: THE WALLET NET (the purse's client mirror)
 * =================================================================
 * The client home of the NATION PURSE — the server's WalletRow balance,
 * synced through BOTH lanes with the honest lane law (the live wire ack,
 * the 12s relay door when it's down — N10), plus the wire:ledger PUSH
 * lane (a receipt lands on the receiver the moment the money moves).
 *
 * THE POCKET/PURSE LAW (the wave's architecture):
 *  - the POCKET is the save's money (player.cash — the honest engine's
 *    whole solo economy). It NEVER leaves the client except through the
 *    store's own doors.
 *  - the PURSE is the server's money (WalletRow). P2P transfers draw
 *    from it and ONLY it — so every naira that moves person-to-person
 *    passes the server door and N8 ("₦500 exactly once") is structure.
 *  - DEPOSIT (pocket→purse) debits the pocket FIRST through the honest
 *    engine, then asks the server; a server refusal REFUNDS the pocket
 *    in the same breath. No phantom naira either direction.
 *  - WITHDRAW (purse→pocket) is server-first: the PIN is judged at the
 *    door, the pocket only grows when the server says PAID.
 *  - THE SERVER WINS: the mirror here is a cache — after every ack the
 *    server's balance replaces it. Reconciliation is not a negotiation.
 *  - THE MINOR WALL: kid/teen accounts never even sync a purse — the
 *    server refuses, the store holds nothing, the face says why.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-client] (ecmascript)");
;
;
;
const useWalletNetStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])(()=>({
        balance: null,
        transferredToday: 0,
        recent: [],
        syncedAt: null,
        lane: null,
        lastReceipt: null
    }));
function applyAck(a, lane) {
    useWalletNetStore.setState({
        balance: typeof a.balance === 'number' ? a.balance : null,
        transferredToday: typeof a.transferredToday === 'number' ? a.transferredToday : 0,
        recent: Array.isArray(a.recent) ? a.recent : [],
        syncedAt: Date.now(),
        lane
    });
}
/* ── the push lane (registered once — StrictMode-proof, idempotent) ── */ let pushRegistered = false;
function walletNetInit() {
    if (pushRegistered || ("TURBOPACK compile-time value", "object") === 'undefined') return;
    pushRegistered = true;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireOnLedger"])((r)=>{
        const s = useWalletNetStore.getState();
        // THE SERVER WINS: the receipt says money moved — the receiver's mirror
        // grows by the receipt's truth (the sender's mirror was set by their ack)
        const iAmReceiver = r.to === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle;
        useWalletNetStore.setState({
            balance: iAmReceiver && s.balance !== null ? s.balance + r.amount : s.balance,
            recent: [
                r,
                ...s.recent
            ].slice(0, 12),
            lastReceipt: r,
            syncedAt: Date.now()
        });
    });
}
async function walletNetSync() {
    const { account } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState();
    if (!account.linked || !account.token) {
        useWalletNetStore.setState({
            balance: null,
            recent: [],
            lane: null,
            syncedAt: null
        });
        return {
            ok: false,
            lane: null,
            why: 'unclaimed'
        };
    }
    walletNetInit();
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireWalletState"])();
    if (w.ok) {
        applyAck(w, 'wire');
        return {
            ok: true,
            lane: 'wire'
        };
    }
    if (w.why === 'minors-no-money') {
        // THE MINOR WALL — the store honestly holds nothing
        useWalletNetStore.setState({
            balance: null,
            recent: [],
            lane: null,
            syncedAt: null
        });
        return {
            ok: false,
            lane: null,
            why: 'minors-no-money'
        };
    }
    if (w.why !== 'wire-down' && w.why !== 'wire-slow') {
        useWalletNetStore.setState({
            balance: null,
            lane: null
        });
        return {
            ok: false,
            lane: null,
            why: w.why
        };
    }
    // lane 2: the relay door
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet', {});
    if (res.ok) {
        applyAck(res, 'relay');
        return {
            ok: true,
            lane: 'relay'
        };
    }
    if (res.why === 'minors-no-money') {
        useWalletNetStore.setState({
            balance: null,
            recent: [],
            lane: null,
            syncedAt: null
        });
        return {
            ok: false,
            lane: null,
            why: 'minors-no-money'
        };
    }
    return {
        ok: false,
        lane: null,
        why: typeof res.why === 'string' ? res.why : 'offline'
    };
}
/* ── the move doors (the honest deposit law lives here) ── */ function mintIdem(kind) {
    return `${kind}:${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle}:${Date.now().toString(36)}:${Math.floor(Math.random() * 1e9).toString(36)}`;
}
async function walletNetDeposit(amount) {
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState();
    if (!g.player) return {
        ok: false,
        why: 'unclaimed'
    };
    const amt = Math.floor(amount);
    const debited = g.removeMoney(amt, {
        label: 'Nation purse top-up',
        category: 'other'
    });
    if (!debited) return {
        ok: false,
        why: 'insufficient'
    };
    const idem = mintIdem('dep');
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireWalletDeposit"])(amt, idem);
    if (w.ok && w.receipt) {
        useWalletNetStore.setState({
            balance: w.balance ?? null,
            lastReceipt: w.receipt,
            syncedAt: Date.now(),
            recent: [
                w.receipt,
                ...useWalletNetStore.getState().recent
            ].slice(0, 12)
        });
        return {
            ok: true,
            balance: w.balance,
            receipt: w.receipt,
            replayed: w.replayed
        };
    }
    // relay fallback
    if (w.why === 'wire-down' || w.why === 'wire-slow') {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet-deposit', {
            amount: amt,
            idemKey: idem
        });
        if (res.ok && res.receipt) {
            useWalletNetStore.setState({
                balance: typeof res.balance === 'number' ? res.balance : null,
                lastReceipt: res.receipt,
                syncedAt: Date.now()
            });
            return {
                ok: true,
                balance: typeof res.balance === 'number' ? res.balance : undefined,
                receipt: res.receipt,
                replayed: !!res.replayed
            };
        }
        if (res.why && ![
            'offline',
            'relay no gree',
            'unclaimed'
        ].includes(res.why)) {
            g.addMoney(amt, {
                label: 'Purse top-up refund — the door refused',
                category: 'tip'
            });
            return {
                ok: false,
                why: res.why
            };
        }
    } else {
        // a REAL refusal (too-big, minors, bad-amount…) — refund, name the why
        g.addMoney(amt, {
            label: 'Purse top-up refund — the door refused',
            category: 'tip'
        });
        return {
            ok: false,
            why: w.why
        };
    }
    // both lanes dead — refund; the pocket never lies
    g.addMoney(amt, {
        label: 'Purse top-up refund — the nation was unreachable',
        category: 'tip'
    });
    return {
        ok: false,
        why: 'offline'
    };
}
async function walletNetWithdraw(amount, pin) {
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState();
    if (!g.player) return {
        ok: false,
        why: 'unclaimed'
    };
    const amt = Math.floor(amount);
    const idem = mintIdem('wd');
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireWalletWithdraw"])(amt, pin, idem);
    if (w.ok && w.receipt) {
        useWalletNetStore.setState({
            balance: w.balance ?? null,
            lastReceipt: w.receipt,
            syncedAt: Date.now(),
            recent: [
                w.receipt,
                ...useWalletNetStore.getState().recent
            ].slice(0, 12)
        });
        g.addMoney(amt, {
            label: 'Purse cash-out',
            category: 'tip'
        });
        return {
            ok: true,
            balance: w.balance,
            receipt: w.receipt,
            replayed: w.replayed
        };
    }
    if (w.why === 'wire-down' || w.why === 'wire-slow') {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet-withdraw', {
            amount: amt,
            pin,
            idemKey: idem
        });
        if (res.ok && res.receipt) {
            useWalletNetStore.setState({
                balance: typeof res.balance === 'number' ? res.balance : null,
                lastReceipt: res.receipt,
                syncedAt: Date.now()
            });
            g.addMoney(amt, {
                label: 'Purse cash-out',
                category: 'tip'
            });
            return {
                ok: true,
                balance: typeof res.balance === 'number' ? res.balance : undefined,
                receipt: res.receipt,
                replayed: !!res.replayed
            };
        }
        if (res.why && ![
            'offline',
            'relay no gree',
            'unclaimed'
        ].includes(res.why)) return {
            ok: false,
            why: res.why
        };
        return {
            ok: false,
            why: 'offline'
        };
    }
    return {
        ok: false,
        why: w.why
    };
}
async function walletNetTransfer(to, amount, pin, note) {
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState();
    if (!g.player) return {
        ok: false,
        why: 'unclaimed'
    };
    const amt = Math.floor(amount);
    const idem = mintIdem('tr');
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireWalletTransfer"])(to, amt, pin, idem, note);
    if (w.ok && w.receipt) {
        useWalletNetStore.setState({
            balance: w.balance ?? null,
            lastReceipt: w.receipt,
            syncedAt: Date.now(),
            recent: [
                w.receipt,
                ...useWalletNetStore.getState().recent
            ].slice(0, 12)
        });
        return {
            ok: true,
            balance: w.balance,
            receipt: w.receipt,
            replayed: w.replayed
        };
    }
    if (w.why === 'wire-down' || w.why === 'wire-slow') {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet-transfer', {
            to,
            amount: amt,
            pin,
            idemKey: idem,
            note
        });
        if (res.ok && res.receipt) {
            useWalletNetStore.setState({
                balance: typeof res.balance === 'number' ? res.balance : null,
                lastReceipt: res.receipt,
                syncedAt: Date.now()
            });
            return {
                ok: true,
                balance: typeof res.balance === 'number' ? res.balance : undefined,
                receipt: res.receipt,
                replayed: !!res.replayed
            };
        }
        if (res.why && ![
            'offline',
            'relay no gree',
            'unclaimed'
        ].includes(res.why)) return {
            ok: false,
            why: res.why
        };
        return {
            ok: false,
            why: 'offline'
        };
    }
    return {
        ok: false,
        why: w.why
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/slices/net.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * NET SLICE — moved VERBATIM from useGameStore.ts (PH2.5 god-store split).
 * Source lines: 1270-1272, 1276-1280, 4881-5201, 5203-5291, 5293-5398.
 * Zero logic changes — this file only re-homes the original object members
 * (state initializers + actions) into one zustand slice of the composed store.
 *
 * PH2.5 COMPLETION (Team Bravo, Task 5-b): the ONE deliberate logic change
 * post-split — the client trade/dues reconciliation. The server now holds
 * the trade giveCash (escrow) and the assoc-dues debit on its own purse
 * (WalletRow, live/action txs), so the client's pocket self-application of
 * those legs is gone; the purse mirror (systems/walletnet) takes the ack's
 * server balance instead. Markers: PH2.5-ESCROW-CLIENT / PH2.5-DUES-CLIENT.
 */ __turbopack_context__.s([
    "netSlice",
    ()=>netSlice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/citypack.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/flags.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/haptics.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation-bridge.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/telemetry.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/walletnet.ts [app-client] (ecmascript)");
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
;
;
;
/** THE ONE APPLICATION LAW (hardening) — the ack-applied tradeIds: the 12s
 * sync's broadcast of the SAME trade must never pay a second time. Module
 * scope: the book outlives any single sync pass. */ const appliedTrades = new Set();
/** PH2.5-ESCROW-CLIENT: the purse mirror's SERVER-WINS write — the ack's
 *  `balance` (the relay's WalletRow truth, read AFTER its escrow/credit/
 *  dues tx) replaces the mirror, exactly the applyAck law walletnet.ts
 *  already runs. Returns false when the ack carried no usable balance so
 *  the caller can fall back to a full walletNetSync() pull. */ function mirrorServerBalance(balance) {
    if (typeof balance === 'number' && Number.isFinite(balance)) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"].setState({
            balance,
            syncedAt: Date.now(),
            lane: 'relay'
        });
        return true;
    }
    return false;
}
const netSlice = (set, get)=>({
        live: null,
        liveWire: null,
        forge: null,
        nation: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])(),
        nationSnapshot: null,
        nationPath: null,
        opsFlags: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readFlags"])(),
        telemetry: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshTelemetryBook"])(),
        /* --------------------------- M17 — the live nation --------------------------- */ /** THE IDENTITY LAW, client side: the mic and the money tables open at
   *  claim. A guest syncs nothing — spectating happens in the UI. */ liveSync: async ()=>{
            const { account, world, live } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            try {
                const res = await fetch('/api/live/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${account.token}`
                    },
                    body: JSON.stringify({
                        since: live?.cursor ?? 0,
                        presence: {
                            street: world?.currentLocation ?? 'home',
                            status: 'hustling'
                        }
                    })
                });
                const data = await res.json();
                if (!res.ok || !data.ok) return {
                    ok: false,
                    why: data.why ?? 'relay no gree'
                };
                const me = account.handle;
                const lv = get().live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
                const moves = [];
                let tradeTouchedPurse = false;
                for (const ev of data.events ?? []){
                    /**
 * THE TRADE LAW: each side applies the accepted trade through its
 * OWN honest engines (the kobo-chain + the income guard chain it)
 */ if (ev.kind === 'trade' && ev.payload?.accepted) {
                        const t = ev.payload;
                        // THE ONE APPLICATION LAW (hardening): the accepter already paid
                        // and was paid through the ack's own engines — the 12s sync's
                        // broadcast of the SAME tradeId must never pay twice (the audit
                        // caught the double-credit: ack path + sync path, no book).
                        const alreadyApplied = t.to === me && t.tradeId !== undefined && appliedTrades.has(String(t.tradeId));
                        if (!alreadyApplied) {
                            // PH2.5-ESCROW-CLIENT: the server holds the giveCash leg now —
                            // escrowed from the offerer's PURSE at offer, credited to the
                            // recipient's PURSE at accept (live/action escrow txs). The sync
                            // applies only the client-held wantCash leg; the purse mirror
                            // re-pulls server truth after the loop.
                            if (t.from === me && (t.wantCash ?? 0) > 0) moves.push({
                                cash: t.wantCash ?? 0,
                                why: `trade with ${t.to}`
                            });
                            if (t.to === me && (t.wantCash ?? 0) > 0) moves.push({
                                cash: -(t.wantCash ?? 0),
                                why: `paid for trade from ${t.from}`
                            });
                            tradeTouchedPurse = true;
                        }
                    }
                    // THE COURT GUARANTEE: a fine against me lands through my engines
                    if (ev.kind === 'court' && ev.payload?.defaulter === me) {
                        const fine = Number(ev.payload.fine ?? 0);
                        if (fine > 0) moves.push({
                            cash: -fine,
                            why: 'Market Union fine — the round still paid',
                            fine: true
                        });
                    }
                }
                set({
                    live: {
                        ...lv,
                        cursor: data.cursor ?? lv.cursor
                    },
                    liveWire: {
                        roster: data.roster ?? [],
                        events: data.events ?? []
                    }
                });
                for (const m of moves){
                    if (m.cash > 0) get().addMoney(m.cash, {
                        label: m.why,
                        category: 'other'
                    });
                    else if (m.cash < 0) {
                        // PH2.5-ESCROW-CLIENT: the negative leg labels ITSELF now — the
                        // finesPaid bump + ⚖️ court notify ride m.fine only, so a synced
                        // trade payment is no longer booked as a Market Union fine.
                        const ok = get().removeMoney(-m.cash, {
                            label: m.why,
                            category: 'other'
                        });
                        if (ok && m.fine) {
                            const cur = get().live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
                            set({
                                live: {
                                    ...cur,
                                    finesPaid: cur.finesPaid + -m.cash
                                }
                            });
                            get().notify({
                                icon: '⚖️',
                                text: `The court collected ₦${(-m.cash).toLocaleString()} — the circle still paid.`,
                                tone: 'bad'
                            });
                        }
                    }
                }
                // PH2.5-ESCROW-CLIENT: a synced accept moved PURSE naira server-side —
                // the mirror re-pulls server truth (THE SERVER WINS, walletnet.ts).
                if (tradeTouchedPurse) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetSync"])().catch(()=>{});
                return {
                    ok: true,
                    roster: data.roster ?? [],
                    events: data.events ?? []
                };
            } catch  {
                return {
                    ok: false,
                    why: 'offline — the nation waits'
                };
            }
        },
        /** a raw relay read (boards + inboxes) — thin, tokened, honest */ liveAction: async (action, payload = {})=>{
            const { account } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            try {
                const res = await fetch('/api/live/action', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${account.token}`
                    },
                    body: JSON.stringify({
                        action,
                        payload
                    })
                });
                const data = await res.json();
                return res.ok && data.ok ? {
                    ok: true,
                    ...data
                } : {
                    ok: false,
                    why: data.why ?? 'relay no gree'
                };
            } catch  {
                return {
                    ok: false,
                    why: 'offline'
                };
            }
        },
        /** THE TIERED CHAT LAW, client side first (the relay re-judges). */ liveSendChat: async (text, channel = 'global')=>{
            const { account, live, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'guest-mic-dark'
            };
            const band = account.ageBand ?? 'adult';
            const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeChat"])({
                handle: account.handle,
                band
            }, text);
            if (!verdict.ok) {
                if (verdict.why) get().recordModerationHit(verdict.why); // M20 — the ops book counts the refusal (no text, by type)
                return {
                    ok: false,
                    why: verdict.why
                };
            }
            const res = await get().liveAction('chat', {
                text: verdict.text,
                channel
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const lv = live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            set({
                live: {
                    ...lv,
                    stats: {
                        ...lv.stats,
                        chats: lv.stats.chats + 1
                    }
                }
            });
            if (verdict.stripped) {
                get().notify({
                    icon: '🚫',
                    text: 'Link no dey pass for here — the words went, the talk stayed.',
                    tone: 'neutral'
                });
            }
            void world;
            return {
                ok: true,
                stripped: verdict.stripped
            };
        },
        liveSendEmote: async (emoteId, channel = 'global')=>{
            const { account, live } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'guest-mic-dark'
            };
            const emote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emoteById"])(emoteId);
            if (!emote) return {
                ok: false,
                why: 'no-such-emote'
            };
            const res = await get().liveAction('emote', {
                emoteId,
                channel
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const lv = live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            set({
                live: {
                    ...lv,
                    stats: {
                        ...lv.stats,
                        emotes: lv.stats.emotes + 1
                    }
                }
            });
            return {
                ok: true
            };
        },
        /** THE JOIN-TELEPORT LAW: my street travels as an M15 postcard. */ liveShareJoin: async (code)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const street = world?.currentLocation ?? 'home';
            const res = await get().liveAction('join', {
                code,
                street
            });
            return res.ok ? {
                ok: true
            } : {
                ok: false,
                why: res.why
            };
        },
        liveOpenStream: async (kind, title)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('stream-open', {
                kind,
                title,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            get().notify({
                icon: '📡',
                text: `You dey live — ${String(res.title ?? title)}. Viewers na crowd!`,
                tone: 'good'
            });
            return {
                ok: true,
                streamId: res.streamId
            };
        },
        liveViewStream: async (streamId)=>{
            const { live } = get();
            const res = await get().liveAction('stream-view', {
                streamId
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const lv = live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            set({
                live: {
                    ...lv,
                    stats: {
                        ...lv.stats,
                        streamsWatched: lv.stats.streamsWatched + 1
                    }
                }
            });
            return {
                ok: true,
                viewers: res.viewers
            };
        },
        liveCloseStream: async (streamId)=>{
            const res = await get().liveAction('stream-close', {
                streamId
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            return {
                ok: true,
                peakViewers: res.peakViewers
            };
        },
        liveFoundAssoc: async (name, motto)=>{
            const { account, world, live } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('assoc-found', {
                name,
                motto,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const assocId = res.assocId ?? null;
            const lv = live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            set({
                live: {
                    ...lv,
                    assocId
                }
            });
            get().notify({
                icon: '🏛️',
                text: `${name} don stand — the books dey sealed.`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            return {
                ok: true,
                assocId: assocId ?? undefined
            };
        },
        liveJoinAssoc: async (assocId)=>{
            const { account, world, live } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('assoc-join', {
                assocId,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const lv = live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            set({
                live: {
                    ...lv,
                    assocId
                }
            });
            return {
                ok: true
            };
        },
        /** THE TREASURY LAW: the relay books the move — the SERVER purse pays it. */ livePayDues: async (assocId, amount)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            if (!Number.isFinite(amount) || amount <= 0) return {
                ok: false,
                why: 'bad-amount'
            };
            const res = await get().liveAction('assoc-dues', {
                assocId,
                amount,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            // PH2.5-DUES-CLIENT: the relay debited my SERVER purse inside the dues
            // tx (live/action 'assoc-dues' → conditional WalletRow decrement) — the
            // client removeMoney here was a SECOND, pocket-side debit. The ack's
            // `balance` is server truth: the mirror takes it, sync-pull only if absent.
            if (!mirrorServerBalance(res.balance)) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetSync"])().catch(()=>{});
            get().notify({
                icon: '🤝',
                text: `₦${amount.toLocaleString()} dues land for the union books.`,
                tone: 'neutral'
            });
            return {
                ok: true
            };
        },
        /** THE TWO-KEY LAW: president + one officer, or the books don't move. */ liveWithdrawAssoc: async (assocId, amount, coSigner)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('assoc-withdraw', {
                assocId,
                amount,
                coSigner,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            get().addMoney(amount, {
                label: `union withdrawal (co-signed by ${coSigner})`,
                category: 'other'
            });
            const lv = get().live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            set({
                live: {
                    ...lv,
                    coSigned: [
                        ...lv.coSigned,
                        `${amount}:${coSigner}`
                    ].slice(-24)
                }
            });
            get().notify({
                icon: '🏛️',
                text: `₦${amount.toLocaleString()} out of the union books — two keys turned.`,
                tone: 'good'
            });
            return {
                ok: true
            };
        },
        liveFileContract: async (assocId, terms, stake, parties)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('assoc-contract', {
                assocId,
                terms,
                stake,
                parties,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            return {
                ok: true
            };
        },
        /** THE COURT LAW: file it, the hash judges it. */ liveFileDispute: async (assocId, contractId, evidence)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('assoc-dispute', {
                assocId,
                contractId,
                evidence,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const verdict = res.verdict;
            get().notify({
                icon: '⚖️',
                text: `The Market Union talk: ${verdict === 'broken' ? 'THE CONTRACT BREAK — the liable party pays the stake.' : 'the contract stands.'}`,
                tone: verdict === 'broken' ? 'neutral' : 'good'
            });
            return {
                ok: true,
                verdict
            };
        },
        liveOfferTrade: async (to, giveCash, wantCash, terms)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('trade-offer', {
                to,
                giveCash,
                wantCash,
                terms,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            // PH2.5-ESCROW-CLIENT: the relay took the escrow from my SERVER purse
            // inside the offer tx (conditional giveCash debit) — the pocket owes
            // nothing at offer; the mirror takes the ack's post-escrow `balance`.
            if (!mirrorServerBalance(res.balance)) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetSync"])().catch(()=>{});
            return {
                ok: true
            };
        },
        /** THE TRADE LAW: the relay books the giveCash leg server-side (escrow
   *  in at offer, credit out at accept); MY pocket pays only the one
   *  client-held leg (wantCash) — and a replayed ack moves nothing. */ liveAcceptTrade: async (tradeId)=>{
            const { account } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('trade-accept', {
                tradeId
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const t = res.trade;
            const replayed = res.replayed === true;
            if (t && t.to === account.handle) {
                // THE ONE APPLICATION LAW (hardening): this ack is THE application —
                // the tradeId joins the book so the 12s sync's broadcast of the same
                // trade is recognized and skipped, never a double credit/debit
                if (t.id !== undefined) {
                    if (appliedTrades.size > 200) appliedTrades.clear();
                    appliedTrades.add(String(t.id));
                }
                if (!replayed) {
                    // PH2.5-ESCROW-CLIENT: the relay credited my SERVER purse inside the
                    // accept tx (exactly once, idempotent by the offered→accepted flip) —
                    // the client addMoney(giveCash) double-paid it. The pocket's only leg
                    // is the wantCash payment (its escrow is the documented debt); the
                    // mirror takes the ack's post-credit `balance` (THE SERVER WINS).
                    if (t.wantCash > 0) get().removeMoney(t.wantCash, {
                        label: `paid for trade from ${t.from}`,
                        category: 'other'
                    });
                    if (!mirrorServerBalance(res.balance)) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetSync"])().catch(()=>{});
                    const lv = get().live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
                    set({
                        live: {
                            ...lv,
                            stats: {
                                ...lv.stats,
                                tradesDone: lv.stats.tradesDone + 1
                            }
                        }
                    });
                    get().notify({
                        icon: '🤝',
                        text: `Trade sealed with ${t.from} — ₦${t.giveCash.toLocaleString()} don enter your nation purse.`,
                        tone: 'good'
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                }
            }
            return {
                ok: true
            };
        },
        liveFoundAjo: async (name, contribution)=>{
            const { account, world, live } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('ajo-found', {
                name,
                contribution,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const ajoId = res.ajoId ?? null;
            const lv = live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            set({
                live: {
                    ...lv,
                    circles: [
                        ...lv.circles,
                        ajoId ?? ''
                    ].filter(Boolean).slice(-12)
                }
            });
            get().notify({
                icon: '♻️',
                text: `${name} don open — the ladder don set, nobody dey skip.`,
                tone: 'good'
            });
            return {
                ok: true,
                ajoId: ajoId ?? undefined
            };
        },
        liveJoinAjo: async (ajoId)=>{
            const { account, world, live } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('ajo-join', {
                ajoId,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            const lv = live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            if (!lv.circles.includes(ajoId)) set({
                live: {
                    ...lv,
                    circles: [
                        ...lv.circles,
                        ajoId
                    ].slice(-12)
                }
            });
            return {
                ok: true
            };
        },
        /** THE ROUND LAW: my contribution leaves my pocket through the honest
   *  engines (the relay counts the pot, MY wallet pays for it); when the
   *  ladder completes and the pot walks to ME, the payout lands too. */ livePayAjo: async (ajoId)=>{
            const { account, world } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const board = await get().liveAction('ajos', {});
            const circles = board.circles ?? [];
            const mine = circles.find((c)=>c.id === ajoId);
            if (!mine) return {
                ok: false,
                why: 'no-circle'
            };
            const res = await get().liveAction('ajo-pay', {
                ajoId,
                day: world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            get().removeMoney(mine.contribution, {
                label: `${mine.name} contribution`,
                category: 'other'
            });
            get().notify({
                icon: '♻️',
                text: `₦${mine.contribution.toLocaleString()} enter the ${mine.name} pot.`,
                tone: 'neutral'
            });
            // the ladder completed and the pot walked to ME (the relay says so)
            if (res.paidOut === account.handle) {
                const payout = Number(res.payout ?? 0);
                if (payout > 0) {
                    get().addMoney(payout, {
                        label: `${mine.name} round payout`,
                        category: 'other'
                    });
                    get().notify({
                        icon: '🎉',
                        text: `${mine.name} pays YOU ₦${payout.toLocaleString()} — the ladder reach your turn!`,
                        tone: 'good'
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
                }
            }
            return {
                ok: true,
                paidOut: res.paidOut,
                payout: res.payout
            };
        },
        liveCourtAjo: async (ajoId)=>{
            const { account } = get();
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const res = await get().liveAction('ajo-court', {
                ajoId,
                day: get().world?.day ?? 1
            });
            if (!res.ok) return {
                ok: false,
                why: res.why
            };
            return {
                ok: true
            };
        },
        liveToggleVoice: ()=>{
            const lv = get().live ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshLiveState"])();
            const band = get().account.ageBand ?? 'adult';
            if (band !== 'adult') {
                get().notify({
                    icon: '🎙️',
                    text: 'Voice na adult table — the shield holds.',
                    tone: 'bad'
                });
                return;
            }
            set({
                live: {
                    ...lv,
                    voiceOn: !lv.voiceOn
                }
            });
            get().notify({
                icon: '🎙️',
                text: !lv.voiceOn ? 'Voice dey ON — same-street proximity only.' : 'Voice don off.',
                tone: 'neutral'
            });
        },
        /* --------------------------- M18 — the city forge --------------------------- */ /** THE FORGE, live on the sample extract: the same honest pipeline the
   *  pilots ride — import → classify → blueprint → QA → ship. The run
   *  records its ledger entry whether it ships or refuses. */ runForge: ()=>{
            const world = get().world;
            const day = world?.day ?? 1;
            // the honest sample extract: a small Lokoja-shaped wire (the same
            // shape a real OSM pull lands in — nodes + ways + tags)
            const extract = {
                city: 'lokoja',
                nodes: [
                    {
                        id: 'n1',
                        lat: 7.79,
                        lon: 6.73
                    },
                    {
                        id: 'n2',
                        lat: 7.80,
                        lon: 6.74
                    },
                    {
                        id: 'n3',
                        lat: 7.81,
                        lon: 6.75
                    },
                    {
                        id: 'n4',
                        lat: 7.795,
                        lon: 6.745
                    },
                    {
                        id: 'n5',
                        lat: 7.785,
                        lon: 6.735
                    },
                    {
                        id: 'n6',
                        lat: 7.805,
                        lon: 6.752
                    }
                ],
                ways: [
                    {
                        id: 'w1',
                        nodes: [
                            'n1',
                            'n2'
                        ],
                        tags: {
                            highway: 'primary',
                            name: 'Ganaja Road'
                        }
                    },
                    {
                        id: 'w2',
                        nodes: [
                            'n2',
                            'n3'
                        ],
                        tags: {
                            highway: 'residential',
                            name: 'Zango Street'
                        }
                    },
                    {
                        id: 'w3',
                        nodes: [
                            'n4'
                        ],
                        tags: {
                            amenity: 'marketplace',
                            name: 'New Market'
                        }
                    },
                    {
                        id: 'w4',
                        nodes: [
                            'n5'
                        ],
                        tags: {
                            amenity: 'bank',
                            name: 'Community Bank'
                        }
                    },
                    {
                        id: 'w5',
                        nodes: [
                            'n6'
                        ],
                        tags: {
                            amenity: 'restaurant',
                            name: 'Mama Put'
                        }
                    },
                    {
                        id: 'w6',
                        nodes: [
                            'n5',
                            'n6'
                        ],
                        tags: {
                            waterway: 'river',
                            name: 'The Niger'
                        }
                    },
                    {
                        id: 'w7',
                        nodes: [
                            'n3'
                        ],
                        tags: {
                            building: 'yes'
                        }
                    }
                ]
            };
            // the honest stage wall-clock (recorded, never faked — the SLA law
            // audits these against the budgets)
            const stageMinutes = {
                osm: 12,
                classify: 31,
                blueprint: 44,
                qa: 9,
                ship: 6
            };
            const run = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forgeCity"])(extract, {
                city: 'lokoja',
                name: 'Lokoja',
                country: 'Nigeria',
                version: `lokoja-v1.${day}`,
                colIndex: 100,
                bbox: {
                    minLat: 7.75,
                    maxLat: 7.85,
                    minLon: 6.70,
                    maxLon: 6.80
                },
                stageMinutes
            });
            const fg = get().forge ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])();
            const ledger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordBuild"])(fg.ledger, run, day);
            set({
                forge: {
                    ...fg,
                    ledger,
                    ranLokoja: true
                }
            });
            get().notify(run.manifest ? {
                icon: '🏗️',
                text: `${run.pack?.name ?? 'Lokoja'} don SHIP — QA ${run.qa?.score ?? 0}/100 in ${run.sla.total} min. A city na data!`,
                tone: 'good'
            } : {
                icon: '🚫',
                text: 'The forge refuse the pack — the QA battery no gree.',
                tone: 'bad'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play(run.manifest ? 'chime' : 'notify');
            return ledger;
        },
        /** THE VOTE: the local book moves at once; the ballot box (the relay)
   *  gets it whenever the connection appears — the offline-first law. */ forgeVote: async (city)=>{
            const fg = get().forge ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])();
            const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forgeVote"])(fg.votes, city);
            if (!verdict.ok) {
                get().notify({
                    icon: '🗳️',
                    text: verdict.why === 'capped' ? `Your vote card full — ${fg.votes.mine.length} cities dey your heart already.` : 'You don vote this city before.',
                    tone: 'bad'
                });
                return {
                    ok: false,
                    why: verdict.why
                };
            }
            set({
                forge: {
                    ...fg,
                    votes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyVote"])(fg.votes, city)
                }
            });
            get().notify({
                icon: '🗳️',
                text: `Your vote land for ${city} — ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voteWinner"])(get().forge?.votes ?? fg.votes) === city ? 'and e dey lead!' : 'the race still open.'}`,
                tone: 'good'
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$haptics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["haptics"].fire('reward');
            // the relay vote rides when claimed (the ballot box keeps the world book)
            const { account } = get();
            if (account.linked && account.token) {
                try {
                    await fetch('/api/forge/vote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${account.token}`
                        },
                        body: JSON.stringify({
                            city
                        })
                    });
                } catch  {}
            }
            return {
                ok: true
            };
        },
        /** pull the world's counts (the local seed stays until the box talks) */ forgeVotesPull: async ()=>{
            try {
                const res = await fetch('/api/forge/vote');
                const data = await res.json();
                if (!res.ok || !data.ok || !data.counts) return;
                const fg = get().forge ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshForgeState"])();
                set({
                    forge: {
                        ...fg,
                        votes: {
                            ...fg.votes,
                            counts: {
                                ...fg.votes.counts,
                                ...data.counts
                            }
                        }
                    }
                });
            } catch  {}
        },
        /* ---------------------- M20 — planet scale + ops ---------------------- */ nationPulseDay: (newDay)=>{
            const world = get().world;
            if (!world) return;
            const d = Math.max(1, Math.floor(newDay));
            // THE ONE-CHANNEL LAW: the book records the SAME liquidity product
            // the day roll folded into the market (civic.ts's civicDayRoll input)
            const mult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["liquidityMultFor"])(d) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calendarMarketMult"])(d) * (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["riverMarketMult"])(d);
            const nation0 = get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])();
            const inf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordInflation"])(nation0.inflation, d, mult);
            const nation = inf.recorded ? {
                ...nation0,
                inflation: inf.next
            } : nation0;
            if (inf.recorded) set({
                nation
            });
            // the sim hears the day's real facts (weather, the river, the calendar)
            if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nationBridge"] && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nationBridge"].alive()) {
                const festival = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["festivalForDay"])(d);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nationBridge"].pulse({
                    day: d,
                    weather: world.weather ?? 'sunny',
                    floodLevel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["riverLevelFor"])(d),
                    marketMult: mult,
                    festival: festival ? String(festival.id ?? festival) : null
                });
            }
            // the telemetry book crosses the day too (its own 30-day window law)
            const tel0 = get().telemetry ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshTelemetryBook"])();
            const tel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["telemetryDayRoll"])(tel0, d);
            if (tel.day !== tel0.day) set({
                telemetry: tel
            });
            // the daily flush — opt-in gated inside the endpoint AND the book
            void get().telemetryFlush();
        },
        recordModerationHit: (why)=>{
            const world = get().world;
            if (!world) return;
            const band = get().account.ageBand ?? 'adult';
            const nation0 = get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])();
            const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recordModeration"])(nation0.moderation, world.day, why, band);
            if (!res.recorded) return;
            set({
                nation: {
                    ...nation0,
                    moderation: res.next
                }
            });
        },
        setTelemetryOptIn: (on)=>{
            const nation0 = get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])();
            set({
                nation: {
                    ...nation0,
                    telemetryOptIn: on
                },
                telemetry: {
                    ...get().telemetry ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshTelemetryBook"])(),
                    optIn: on
                }
            });
            const flags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setFlag"])('telemetryAsk', true);
            set({
                opsFlags: flags
            });
            get().notify({
                icon: '📊',
                text: on ? 'The city counts quiet numbers for itself — never words, never a child.' : 'Telemetry dark. Your city, your books.',
                tone: 'good'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        telemetryFlush: async ()=>{
            const { account, world } = get();
            const book = get().telemetry ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshTelemetryBook"])();
            const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$telemetry$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["telemetryPayload"])(book);
            if (!payload) return {
                ok: false,
                why: 'dark'
            };
            if (!account.linked || !account.token) return {
                ok: false,
                why: 'unclaimed'
            };
            const band = account.ageBand ?? 'adult';
            if (band === 'kid') return {
                ok: false,
                why: 'no-minor-data'
            };
            try {
                const res = await fetch('/api/telemetry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${account.token}`
                    },
                    body: JSON.stringify({
                        ...payload,
                        band
                    })
                });
                const data = await res.json().catch(()=>({}));
                if (!res.ok || !data.ok) return {
                    ok: false,
                    why: data.why ?? 'the counter box no gree'
                };
                return {
                    ok: true
                };
            } catch  {
                return {
                    ok: false,
                    why: 'offline'
                };
            }
        },
        nationSetCrowd: (on)=>{
            const nation0 = get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])();
            const nation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["crowdToggle"])(nation0, on);
            set({
                nation
            });
            if (!on) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopNationSim"])();
                // PH2.5: the bridge book lives in shared.ts
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearNationBridge"])();
                set({
                    nationSnapshot: null,
                    nationPath: null
                });
            } else if (get().world) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startNationBridge"])(get);
            }
            get().notify({
                icon: '🏙️',
                text: on ? `The nation breathes — ${nation.crowd.count.toLocaleString()} souls on the thread.` : 'The crowd sleeps — the city is yours alone.',
                tone: 'good'
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAutosave"])(get);
        },
        opsSetFlag: (key, value)=>{
            const flags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$flags$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setFlag"])(key, value);
            set({
                opsFlags: flags
            });
            if (key === 'crowdSim') {
                if (!value) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$bridge$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stopNationSim"])();
                    // PH2.5: the bridge book lives in shared.ts
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearNationBridge"])();
                    set({
                        nationSnapshot: null,
                        nationPath: null
                    });
                } else if (get().world && (get().nation ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freshNationState"])()).crowd.on) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["startNationBridge"])(get);
                }
            }
        },
        nationSnapshotIngest: (s)=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setLiveSnapshot"])(s);
            set({
                nationSnapshot: s
            });
        }
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGameStore",
    ()=>useGameStore
]);
/**
 * LOKOJA LIFE — Game Store (Zustand)
 * -----------------------------------
 * The single source of truth for live game state.
 *
 * Persistence strategy: explicit, versioned saves via SaveSystem
 * (localStorage now, Supabase later) + debounced autosave.
 * We deliberately do NOT use zustand/persist so the saved schema
 * stays clean and cloud-migratable instead of dumping raw store state.
 *
 * PH2.5 GOD-STORE SPLIT: the old 5,575-line monolith now lives in
 * src/game/store/slices/<domain>.ts (one slice per domain, code moved
 * VERBATIM) + src/game/store/shared.ts (module-level state + cross-domain
 * helpers) + src/game/store/types.ts (the slice interfaces + GameStore).
 * This file is ONLY the composition: one create() over the slice spread,
 * the store-ref binding, the menu screen mirror, and the public type
 * re-exports. The public API is unchanged — same default surface, same
 * import path '@/game/store/useGameStore', same single store instance.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$ui$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/ui.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$saveBoot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/saveBoot.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$player$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/player.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/world.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/economy.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$ladder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/ladder.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/social.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$lifestyle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/lifestyle.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/pulse.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$net$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/slices/net.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/shared.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-client] (ecmascript)");
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
;
;
;
;
const useGameStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((...a)=>({
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$ui$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uiSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$saveBoot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveBootSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$player$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["playerSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["worldSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["economySlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["vehiclesSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$ladder$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ladderSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$lifestyle$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lifestyleSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$pulse$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pulseSlice"])(...a),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$slices$2f$net$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["netSlice"])(...a)
    }));
__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStoreRef"].getState = ()=>useGameStore.getState();
__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$shared$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStoreRef"].setState = (partial)=>useGameStore.setState(partial);
/* THE SCREEN MIRROR — the menu store owns `screen` (SILK II: the menu
 * slice is all the entry chunk carries); the fat store mirrors it so every
 * in-game reader stays reactive without a repo-wide migration. One writer,
 * one mirror, zero drift. Wired at module scope so tests and the browser
 * share the exact same law. */ __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"].subscribe((s, prev)=>{
    if (s.screen !== prev.screen && useGameStore.getState().screen !== s.screen) {
        useGameStore.setState({
            screen: s.screen
        });
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/MenuAuthSheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuAuthSheet",
    ()=>MenuAuthSheet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — M24 W1: THE AUTH SHEET (the register's front door)
 * --------------------------------------------------------------------
 * The signup the rebuilt landing opens — now the FULL face the street
 * will see (the W1 register law): handle + PIN + birthday (the band
 * law live) in step one, then DISPLAY NAME + AVATAR LOOK + optional
 * BIO in step two, drawn with the REAL vocabularies from data/avatar.ts
 * — the same words CharacterCreation speaks and the W2 bodies will
 * render. Login stays one step. `inWorld` (the preview wall's door)
 * claims without touching the menu screens — the guest continues the
 * life they were living.
 *
 * THE HONEST DOOR: every failure reason the store returns shows as-is —
 * the sheet never invents a success. Contact is OPTIONAL now (the v2
 * register law): validated-if-present, never demanded. M13 rides live:
 * a minor claims behind a parent PIN and collects NOTHING.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/guest.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/profile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const NOW_YEAR = new Date().getFullYear();
const YEARS = Array.from({
    length: 60
}, (_, i)=>NOW_YEAR - 6 - i);
/* ------------------------ the honest little bust --------------------------- */ /**
 * A flat SVG bust preview — the REAL colors and the REAL style keys,
 * drawn light (no three.js on the landing — the N1 TTI law). This is
 * the "what the street sees" mirror, not the rig itself.
 */ function LookBust({ look }) {
    const hair = {
        bald: null,
        'low-cut': /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M32 14c10-3 18-2 22 1l-2 8c-6-4-14-5-18-3l-2-6Z",
            fill: look.hairColor
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 48,
            columnNumber: 16
        }, this),
        waves: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M30 16c4-6 22-6 26 0l-3 6c-2-4-5-5-10-5s-8 1-10 5l-3-6Z",
            fill: look.hairColor
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 49,
            columnNumber: 12
        }, this),
        afro: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
            cx: "43",
            cy: "16",
            r: "14",
            fill: look.hairColor
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 50,
            columnNumber: 11
        }, this),
        cornrows: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.hairColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M32 14c10-3 18-2 22 1l-2 7c-6-4-14-5-18-3l-2-5Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M35 15l3 7M40 14l2 8M45 14l1 8M50 15l-1 7",
                    stroke: "#00000030",
                    strokeWidth: "1"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 54,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, this),
        dreads: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.hairColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M32 14c10-3 18-2 22 1l-2 8c-6-4-14-5-18-3l-2-6Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 59,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M31 20c-2 8-2 14-1 18l3-1c-1-5-1-11 1-16l-3-1ZM55 20c2 8 2 14 1 18l-3-1c1-5 1-11-1-16l3-1Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this),
        braids: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.hairColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M32 14c10-3 18-2 22 1l-2 7c-6-4-14-5-18-3l-2-5Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M30 20c-1 12-1 20 1 26l4-1c-2-7-2-16 0-24l-5-1ZM56 20c1 12 1 20-1 26l-4-1c2-7 2-16 0-24l5-1Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 64,
            columnNumber: 7
        }, this),
        puffs: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.hairColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M32 15c8-4 16-4 22 0l-2 6c-6-3-12-3-18 0l-2-6Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "28",
                    cy: "12",
                    r: "6"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "58",
                    cy: "12",
                    r: "6"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    };
    const cloth = {
        tshirt: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M24 62c2-8 8-12 19-12s17 4 19 12v14H24V62Z",
            fill: look.clothingColor
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 78,
            columnNumber: 13
        }, this),
        kaftan: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.clothingColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M26 60c3-7 9-10 17-10s14 3 17 10v16H26V60Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M43 50v26",
                    stroke: "#00000022",
                    strokeWidth: "2"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 80,
            columnNumber: 7
        }, this),
        ankara: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.clothingColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M24 62c2-8 8-12 19-12s17 4 19 12v14H24V62Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "34",
                    cy: "66",
                    r: "2",
                    fill: "#ffffff40"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "46",
                    cy: "70",
                    r: "2",
                    fill: "#ffffff40"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "54",
                    cy: "64",
                    r: "2",
                    fill: "#ffffff40"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this),
        senator: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.clothingColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M25 62c2-7 8-11 18-11s16 4 18 11v14H25V62Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M43 51l-5 4 5 5 5-5-5-4Z",
                    fill: "#00000030"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this),
        hoodie: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.clothingColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M23 62c3-9 9-13 20-13s17 4 20 13v14H23V62Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M33 52c2 6 6 9 10 9s8-3 10-9c-3-2-6-3-10-3s-7 1-10 3Z",
                    fill: "#00000025"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 100,
            columnNumber: 7
        }, this),
        lace: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            fill: look.clothingColor,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M24 62c2-8 8-12 19-12s17 4 19 12v14H24V62Z"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "30",
                    cy: "64",
                    r: "1.6",
                    fill: "#ffffff50"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "37",
                    cy: "68",
                    r: "1.6",
                    fill: "#ffffff50"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 108,
                    columnNumber: 60
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "44",
                    cy: "63",
                    r: "1.6",
                    fill: "#ffffff50"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "51",
                    cy: "68",
                    r: "1.6",
                    fill: "#ffffff50"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 109,
                    columnNumber: 60
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "57",
                    cy: "64",
                    r: "1.6",
                    fill: "#ffffff50"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 106,
            columnNumber: 7
        }, this)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 86 86",
        className: "h-24 w-24 shrink-0 drop-shadow",
        "aria-hidden": true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "43",
                cy: "45",
                r: "41",
                fill: "#0f1a15"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            cloth[look.clothingStyle] ?? cloth.tshirt,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "38",
                y: "38",
                width: "10",
                height: "10",
                rx: "4",
                fill: look.skinTone
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                cx: "43",
                cy: "28",
                rx: "13",
                ry: "15",
                fill: look.skinTone
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            hair[look.hairstyle],
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "38",
                cy: "28",
                r: "1.4",
                fill: "#1b1b1b"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "48",
                cy: "28",
                r: "1.4",
                fill: "#1b1b1b"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M39 35c2.5 2 5.5 2 8 0",
                stroke: "#1b1b1b",
                strokeWidth: "1.4",
                fill: "none",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_c = LookBust;
function MenuAuthSheet({ onClose, inWorld = false }) {
    _s();
    const registerAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MenuAuthSheet.useGameStore[registerAccount]": (s)=>s.registerAccount
    }["MenuAuthSheet.useGameStore[registerAccount]"]);
    const loginAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MenuAuthSheet.useGameStore[loginAccount]": (s)=>s.loginAccount
    }["MenuAuthSheet.useGameStore[loginAccount]"]);
    const notify = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MenuAuthSheet.useGameStore[notify]": (s)=>s.notify
    }["MenuAuthSheet.useGameStore[notify]"]);
    const hasSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"])({
        "MenuAuthSheet.useMenuStore[hasSave]": (s)=>s.hasSave
    }["MenuAuthSheet.useMenuStore[hasSave]"]);
    const continueGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"])({
        "MenuAuthSheet.useMenuStore[continueGame]": (s)=>s.continueGame
    }["MenuAuthSheet.useMenuStore[continueGame]"]);
    const setScreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"])({
        "MenuAuthSheet.useMenuStore[setScreen]": (s)=>s.setScreen
    }["MenuAuthSheet.useMenuStore[setScreen]"]);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('claim');
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [handle, setHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [contact, setContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [pin, setPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [birthYear, setBirthYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(String(NOW_YEAR - 22));
    const [parentPin, setParentPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // W1 — the face fields (prefilled from the body the save already built)
    const prefill = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().player?.avatar;
    const [displayName, setDisplayName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [bio, setBio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [look, setLook] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(prefill ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultLook"])());
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [why, setWhy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const band = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ageBandForYear"])(Number(birthYear), NOW_YEAR);
    const minor = band !== null && band !== 'adult';
    // the look the player touched must be one the vocabularies minted —
    // the picker can only emit real values, but the prefill verifies too
    const lookOk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuAuthSheet.useMemo[lookOk]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateAvatarLook"])(look).ok
    }["MenuAuthSheet.useMemo[lookOk]"], [
        look
    ]);
    const nameWhy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuAuthSheet.useMemo[nameWhy]": ()=>displayName.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDisplayName"])(displayName).ok ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDisplayName"])(displayName).why : null
    }["MenuAuthSheet.useMemo[nameWhy]"], [
        displayName
    ]);
    const bioWhy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MenuAuthSheet.useMemo[bioWhy]": ()=>bio.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBio"])(bio).ok ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBio"])(bio).why : null
    }["MenuAuthSheet.useMemo[bioWhy]"], [
        bio
    ]);
    const submit = async ()=>{
        setBusy(true);
        setWhy(null);
        try {
            const res = mode === 'claim' ? await registerAccount({
                handle,
                contact,
                pin,
                birthYear: Number(birthYear),
                parentPin: minor ? parentPin : undefined,
                displayName: displayName.trim() || handle,
                avatarLook: JSON.stringify(look),
                bio
            }) : await loginAccount({
                handle,
                pin
            });
            if (res.ok) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('chime');
                notify({
                    icon: '🪪',
                    text: `Welcome, ${handle} — your name and your face don enter the register.`,
                    tone: 'good'
                });
                if (!inWorld) {
                    if (hasSave) void continueGame();
                    else setScreen('creation');
                }
                onClose();
            } else {
                setWhy(res.why ?? 'E no gree — try again.');
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('notify');
            }
        } finally{
            setBusy(false);
        }
    };
    const step1Why = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validatePin"])(pin).ok === false && pin.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validatePin"])(pin).why : mode === 'claim' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateHandle"])(handle).ok === false && handle.length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateHandle"])(handle).why : mode === 'claim' && contact.length > 0 && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateContact"])(contact).ok === false ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateContact"])(contact).why : null;
    const step2Why = nameWhy ?? bioWhy ?? (lookOk ? null : 'Pick a look from the real options.');
    const canStep1 = handle.length >= 3 && pin.length >= 4 && (mode === 'return' || (minor ? parentPin.length === 6 : true));
    const canSubmit = mode === 'claim' ? canStep1 && lookOk && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDisplayName"])(displayName.trim() || handle).ok && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBio"])(bio).ok : canStep1;
    const switchMode = (m)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        setMode(m);
        setWhy(null);
        setStep(1);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[3px] sm:items-center",
        role: "dialog",
        "aria-modal": true,
        "aria-label": "Enter Lokoja — login or signup",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-testid": "menu-auth-sheet",
            className: "lko-fade max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-white/15 bg-[#0e1512]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:rounded-3xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "lko-display text-xl leading-tight",
                                    children: mode === 'claim' ? step === 1 ? 'Claim your name' : 'Design your face' : 'Enter the city'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-[11.5px] font-semibold text-white/60",
                                    children: mode === 'claim' ? step === 1 ? 'One name, one PIN — step 1 of 2. Step 2 na your face.' : 'Wetin the street go see when W2 bodies land — design am now.' : 'One name, one PIN — the same identity carry your save, your paddies and your pocket.'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 228,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            "aria-label": "Close",
                            className: "lko-press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 223,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.07] p-1",
                    children: [
                        [
                            'return',
                            'Log in'
                        ],
                        [
                            'claim',
                            'Sign up'
                        ]
                    ].map(([m, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-testid": `auth-tab-${m}`,
                            onClick: ()=>switchMode(m),
                            className: `lko-press rounded-lg px-2 py-2 text-[12px] font-extrabold ${mode === m ? 'bg-white text-[#123528] shadow' : 'text-white/70'}`,
                            children: label
                        }, m, false, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 246,
                    columnNumber: 9
                }, this),
                mode === 'claim' && step === 2 && /* ------------------- STEP 2 — the face the street sees ------------------- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-testid": "auth-face-step",
                    className: "mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LookBust, {
                                    look: look
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 264,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            "data-testid": "auth-display-name",
                                            className: "w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-[13px] font-bold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]",
                                            placeholder: "Display name (the roster shows this)",
                                            value: displayName,
                                            maxLength: 24,
                                            onChange: (e)=>setDisplayName(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                            lineNumber: 266,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            "data-testid": "auth-bio",
                                            className: "w-full resize-none rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-[12px] font-semibold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]",
                                            placeholder: "Bio — one line about your hustle (optional)",
                                            value: bio,
                                            maxLength: 280,
                                            rows: 2,
                                            onChange: (e)=>setBio(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                            lineNumber: 274,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-right text-[10px] font-bold text-white/40",
                                            children: [
                                                bio.length,
                                                "/280"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                            lineNumber: 283,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 265,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 263,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 space-y-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchRow, {
                                    label: "Skin",
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKIN_TONES"],
                                    active: look.skinTone,
                                    onPick: (v)=>setLook((l)=>({
                                                ...l,
                                                skinTone: v
                                            })),
                                    testid: "auth-look-skin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 289,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchRow, {
                                    label: "Hair",
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HAIR_COLORS"],
                                    active: look.hairColor,
                                    onPick: (v)=>setLook((l)=>({
                                                ...l,
                                                hairColor: v
                                            })),
                                    testid: "auth-look-hair"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 290,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChipRow, {
                                    label: "Style",
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVATAR_HAIRSTYLES"].map((h)=>({
                                            key: h.key,
                                            label: h.label
                                        })),
                                    active: look.hairstyle,
                                    onPick: (k)=>setLook((l)=>({
                                                ...l,
                                                hairstyle: k
                                            })),
                                    testid: "auth-look-hairstyle"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChipRow, {
                                    label: "Wear",
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].map((c)=>({
                                            key: c.key,
                                            label: c.label
                                        })),
                                    active: look.clothingStyle,
                                    onPick: (k)=>setLook((l)=>({
                                                ...l,
                                                clothingStyle: k
                                            })),
                                    testid: "auth-look-clothing"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 292,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchRow, {
                                    label: "Colour",
                                    options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLOTHING_COLORS"],
                                    active: look.clothingColor,
                                    onPick: (v)=>setLook((l)=>({
                                                ...l,
                                                clothingColor: v
                                            })),
                                    testid: "auth-look-clothcolor"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 288,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 262,
                    columnNumber: 11
                }, this),
                !(mode === 'claim' && step === 2) && /* ------------------------- STEP 1 — the identity ------------------------- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 space-y-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            "data-testid": "auth-handle",
                            className: "w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]",
                            placeholder: "Your street name (e.g. ada_hustle)",
                            value: handle,
                            maxLength: 16,
                            onChange: (e)=>setHandle(e.target.value),
                            autoComplete: "username"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 301,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            "data-testid": "auth-pin",
                            type: "password",
                            className: "w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold tracking-widest text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]",
                            placeholder: "Your PIN (4+ digits)",
                            value: pin,
                            maxLength: 12,
                            onChange: (e)=>setPin(e.target.value.replace(/[^0-9]/g, '')),
                            autoComplete: mode === 'claim' ? 'new-password' : 'current-password'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 310,
                            columnNumber: 13
                        }, this),
                        mode === 'claim' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    "data-testid": "auth-birth-year",
                                    value: birthYear,
                                    onChange: (e)=>setBirthYear(e.target.value),
                                    "aria-label": "Birth year — sets your age band honestly",
                                    className: "w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold text-white outline-none focus:border-[#ffd88a]",
                                    children: YEARS.map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: y,
                                            className: "text-black",
                                            children: y
                                        }, y, false, {
                                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                            lineNumber: 330,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 322,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "px-1 text-[10px] font-bold text-white/50",
                                    children: band === 'adult' ? 'Adult band — full mic and money tables.' : band === 'teen' ? 'Teen band — moderated mic, no money tables.' : 'Kid band — parent PIN dey guard the gate, and we collect nothing.'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 333,
                                    columnNumber: 17
                                }, this),
                                minor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "data-testid": "auth-parent-pin",
                                    type: "password",
                                    className: "w-full rounded-xl border border-[#ffd88a]/40 bg-[#ffd88a]/[0.08] px-3.5 py-3 text-[13px] font-bold tracking-widest text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]",
                                    placeholder: "Parent PIN — guards the minor account",
                                    value: parentPin,
                                    maxLength: 12,
                                    onChange: (e)=>setParentPin(e.target.value.replace(/[^0-9]/g, ''))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 337,
                                    columnNumber: 19
                                }, this),
                                !minor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "data-testid": "auth-contact",
                                    className: "w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-3 text-[13px] font-bold text-white placeholder:text-white/35 outline-none focus:border-[#ffd88a]",
                                    placeholder: "Email or phone — optional now (the recovery line)",
                                    value: contact,
                                    onChange: (e)=>setContact(e.target.value),
                                    autoComplete: "email"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                                    lineNumber: 348,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 300,
                    columnNumber: 11
                }, this),
                (step1Why || step2Why || why) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    "data-testid": "auth-why",
                    className: "mt-2.5 rounded-xl bg-[#fdecea]/90 px-3 py-2 text-[11px] font-bold text-[#a63d33]",
                    children: step1Why ?? step2Why ?? why
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 363,
                    columnNumber: 11
                }, this),
                mode === 'claim' && step === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "data-testid": "auth-next",
                    disabled: !canStep1 || busy,
                    onClick: ()=>{
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                        setStep(2);
                        setWhy(null);
                    },
                    className: "lko-press mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd88a] text-[15px] font-extrabold tracking-wide text-[#123528] shadow-[0_10px_28px_-10px_rgba(255,216,138,0.5)] disabled:cursor-not-allowed disabled:opacity-40",
                    children: "Next — design your face →"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 369,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-4 flex gap-2",
                    children: [
                        mode === 'claim' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-testid": "auth-back",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                setStep(1);
                                setWhy(null);
                            },
                            className: "lko-press flex min-h-[52px] items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] px-5 text-[13px] font-extrabold text-white/80",
                            children: "← Back"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 381,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-testid": "auth-submit",
                            disabled: busy || !canSubmit,
                            onClick: ()=>void submit(),
                            className: "lko-press flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#ffd88a] text-[15px] font-extrabold tracking-wide text-[#123528] shadow-[0_10px_28px_-10px_rgba(255,216,138,0.5)] disabled:cursor-not-allowed disabled:opacity-40",
                            children: busy ? 'Deh open the gate…' : mode === 'claim' ? 'Claim your name 🪪' : 'Enter Lokoja 🔑'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                            lineNumber: 390,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 379,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-3 text-center text-[10px] font-semibold leading-relaxed text-white/40",
                    children: mode === 'claim' ? 'Your name and face na your multiplayer identity — the whole city go know you by am. Minors dey behind the family shield, always.' : 'Your name na your multiplayer identity — the whole city go know you by am. Minors dey behind the family shield, always.'
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                    lineNumber: 401,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
            lineNumber: 222,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
        lineNumber: 221,
        columnNumber: 5
    }, this);
}
_s(MenuAuthSheet, "Y2+bBvdRFGkieLYDsMQJFl7n4gI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"]
    ];
});
_c1 = MenuAuthSheet;
/* ------------------------------- the rows ---------------------------------- */ function SwatchRow({ label, options, active, onPick, testid }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-11 shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-white/45",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1.5",
                "data-testid": testid,
                children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": `${label}: ${o.label}`,
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onPick(o.value);
                        },
                        className: `lko-press h-7 w-7 rounded-full border-2 ${active === o.value ? 'border-[#ffd88a] shadow-[0_0_0_2px_rgba(255,216,138,0.35)]' : 'border-white/20'}`,
                        style: {
                            backgroundColor: o.value
                        }
                    }, o.key, false, {
                        fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                        lineNumber: 425,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
        lineNumber: 421,
        columnNumber: 5
    }, this);
}
_c2 = SwatchRow;
function ChipRow({ label, options, active, onPick, testid }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-11 shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-white/45",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 448,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1.5",
                "data-testid": testid,
                children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                            onPick(o.key);
                        },
                        className: `lko-press rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${active === o.key ? 'bg-[#ffd88a] text-[#123528]' : 'bg-white/10 text-white/75'}`,
                        children: o.label
                    }, o.key, false, {
                        fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                        lineNumber: 451,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
                lineNumber: 449,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/MenuAuthSheet.tsx",
        lineNumber: 447,
        columnNumber: 5
    }, this);
}
_c3 = ChipRow;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "LookBust");
__turbopack_context__.k.register(_c1, "MenuAuthSheet");
__turbopack_context__.k.register(_c2, "SwatchRow");
__turbopack_context__.k.register(_c3, "ChipRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/MenuAuthSheet.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/game/screens/MenuAuthSheet.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_ffae309d._.js.map