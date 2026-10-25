module.exports = [
"[project]/src/game/systems/biz.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-ssr] (ecmascript)");
;
;
;
const BIZ_TYPES = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].types;
const BIZ_TYPE_IDS = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].types);
function bizDef(typeId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].types[typeId] ?? null;
}
function bizAtLocation(locationId) {
    for (const [typeId, def] of Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].types)){
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
    return Math.min(Math.max(1, Math.floor(level)), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].maxLevel);
}
function hasPowerBackup(upgrades) {
    return upgrades.includes('generator') || upgrades.includes('solar');
}
function hasGenerator(upgrades) {
    return upgrades.includes('generator');
}
function bizRepBonus(reputation) {
    const over = Math.max(0, reputation - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].repBonusBase);
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].repBonusCap, over / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].repBonusDivisor / 100);
}
function bizLevelMult(level) {
    const lvl = Math.min(Math.max(1, Math.floor(level)), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].maxLevel);
    return 1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].levelIncomeStep * (lvl - 1);
}
function bizDayMult(typeId, day, civic) {
    const def = bizDef(typeId);
    if (!def) return 1;
    if (def.marketId) {
        const rolled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["marketForDay"])(civic, day);
        let mult = rolled.market.prices[def.marketId] ?? 1;
        if (rolled.market.marketDay) mult *= 1 / 0.9; // market day: cheap goods, BUSY shop
        return mult;
    }
    const u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('biz', typeId, day) % 1000 / 1000;
    return 1 - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].wobbleBand + u * 2 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].wobbleBand;
}
function bizIncomeFor(typeId, level, day, civic, reputation, opts) {
    const def = bizDef(typeId);
    if (!def) return 0;
    const staff = Math.max(0, Math.floor(opts?.staff ?? 0));
    const upgrades = opts?.upgrades ?? [];
    const chaos = opts?.chaos ?? null;
    const dark = civic.nepa.shedding && !hasPowerBackup(upgrades);
    const blackedOut = chaos ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blackoutAt"])(chaos, def.locationId, day) : false;
    const posBoost = chaos && def.pos === true && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isScarcityDay"])(day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].posBoostMult : 1;
    const staffMult = 1 + staff * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffIncomeBoost;
    // M11 — the flood crush folds with the grid laws: the WORSE water wins
    // (a generator keeps the lights on but cannot keep the river out)
    const powerMult = blackedOut && !hasPowerBackup(upgrades) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].blackoutIncomeFactor : dark ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].sheddingIncomeFactor : 1;
    const waterMult = Math.min(powerMult === 1 ? 1 : powerMult, opts?.floodFactor ?? 1);
    return Math.max(0, Math.round(def.baseIncome * bizLevelMult(level) * bizDayMult(typeId, day, civic) * (1 + bizRepBonus(reputation)) * staffMult * waterMult * posBoost));
}
function bizGeneratorFuelFor(typeId, day, upgrades, chaos) {
    if (!chaos || !hasGenerator(upgrades)) return 0;
    const def = bizDef(typeId);
    if (!def) return 0;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["blackoutAt"])(chaos, def.locationId, day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CHAOS"].generatorFuelPerDay : 0;
}
function bizUpgradeCost(typeId, level) {
    const def = bizDef(typeId);
    if (!def || level >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].maxLevel) return null;
    return Math.round(def.buyCost * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].upgradeCostMult * level);
}
function bizDayRoll(list, prevDay, newDay, civic, reputation, chaos, floodFactorFor) {
    const earned = {};
    let total = 0;
    const next = list.map((biz)=>{
        if (newDay <= prevDay || newDay <= biz.lastAccrualDay) return biz;
        const from = Math.max(prevDay + 1, biz.lastAccrualDay + 1);
        const cappedFrom = Math.max(from, newDay - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].accrualCapDays + 1);
        const wages = Math.max(0, biz.staff) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BIZ"].staffWagePerDay;
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
}),
"[project]/src/game/systems/flags.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/game/systems/nation-sim.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
/** Low-lying districts the flood season empties (the M11 cut law's ground). */ const LOW_DISTRICTS = NATION_DISTRICTS.reduce((acc, id, i)=>{
    if (id === 'kpata-market' || id === 'confluence' || id === 'ganaja-junction' || id === 'transport-area') acc.push(i);
    return acc;
}, []);
/** High ground the flood moves people TOWARD (Patti first — the real refuge). */ const HIGH_DISTRICTS = NATION_DISTRICTS.reduce((acc, id, i)=>{
    if (id === 'mount-patti' || id === 'government-area' || id === 'university-area') acc.push(i);
    return acc;
}, []);
/** Where a market-day crowd concentrates (the M2/M8 liquidity ground). */ const MARKET_DISTRICTS = NATION_DISTRICTS.reduce((acc, id, i)=>{
    if (id === 'kpata-market' || id === 'food-area' || id === 'transport-area' || id === 'ganaja-junction') acc.push(i);
    return acc;
}, []);
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
}),
"[project]/src/game/systems/nation-bridge.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation-sim.ts [app-ssr] (ecmascript)");
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stepCrowd"])(active.state, active.pulse);
    const snap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["crowdAggregate"])(active.state);
    active.last = snap;
    if (active.onSnapshot) active.onSnapshot(snap);
}
function startNationSim(opts) {
    stopNationSim();
    const pulse = opts.initialPulse ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["quietPulse"])(1);
    const onSnapshot = opts.onSnapshot ?? null;
    // --- the worker path (REAL BROWSER ONLY, flag-allowed, construction guarded) ---
    // THE ENVIRONMENT LAW: Bun/Node implement Worker too, but a worker there
    // outlives the test process and hangs the suite exit. The worker path is
    // for the browser (document exists); every other runtime takes the
    // time-sliced main path — the same kernel, the same laws, honestly.
    const isRealBrowser = typeof document !== 'undefined';
    if (opts.allowWorker !== false && isRealBrowser && typeof Worker !== 'undefined') {
        try {
            const worker = new Worker(new __turbopack_context__.U(__turbopack_context__.r("[project]/src/game/workers/nation.worker.ts (static in ecmascript)")));
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
    const state = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2d$sim$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrowdState"])(opts.seed, opts.count);
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
}),
"[project]/src/game/systems/needs.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
;
function clampNeed(value) {
    return Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].min, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].max, value));
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
    if (merged.hunger <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].hungerCritical) {
        merged.mood -= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].hungryMoodDrain;
    }
    if (merged.hunger <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].min) {
        merged.health -= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].starvingHealthDrain;
    }
    return clampNeeds(merged);
}
function canDoStrenuous(needs) {
    return needs.energy > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].energyCritical;
}
function applySlotDecay(current, slots, decayMult = 1) {
    const n = Math.max(0, Math.floor(slots));
    if (n === 0) return current;
    const m = Math.max(0, decayMult);
    return applyNeedsDelta(current, {
        hunger: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].decay.hunger * n * m,
        energy: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].decay.energy * n * m,
        mood: -__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].decay.mood * n * m,
        health: -(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].decay.health ?? 0) * n * m
    });
}
function conditionSummary(needs) {
    if (needs.health <= 15) return {
        text: 'You need to see a doctor…',
        tone: 'bad'
    };
    if (needs.hunger <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].hungerCritical) return {
        text: 'Your belle is empty. Find food!',
        tone: 'bad'
    };
    if (needs.energy <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NEEDS"].energyCritical) return {
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
}),
"[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
;
function xpToNextLevel(level) {
    return Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].xpBase * Math.pow(level, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].xpGrowth));
}
function addXp(xp, level, amount) {
    let newLevel = level;
    let newXp = xp + Math.max(0, amount);
    let leveledUp = false;
    let levelsGained = 0;
    while(newLevel < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].maxLevel && newXp >= xpToNextLevel(newLevel)){
        newXp -= xpToNextLevel(newLevel);
        newLevel += 1;
        leveledUp = true;
        levelsGained += 1;
    }
    if (newLevel >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].maxLevel) {
        newXp = Math.min(newXp, xpToNextLevel(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].maxLevel) - 1);
    }
    return {
        xp: newXp,
        level: newLevel,
        leveledUp,
        levelsGained
    };
}
function skillCap(level) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapBase + level * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapPerLevel;
}
function reputationTier(reputation) {
    let current = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"][0];
    for (const tier of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"]){
        if (reputation >= tier.threshold) current = tier;
    }
    return current;
}
function nextReputationTier(reputation) {
    for (const tier of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"]){
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
}),
"[project]/src/game/systems/telemetry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/game/systems/teleport.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
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
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].map((l)=>l.id).filter((id)=>!V1_ROSTER.includes(id))
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
const TELEPORT_KEY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sha256"])(TELEPORT_PEPPER);
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
    const origin = base ?? (("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.location?.origin ? "TURBOPACK unreachable" : 'https://lokoja.life');
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
    const sig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hmacSha256"])(TELEPORT_KEY, payload).slice(0, SIG_LEN);
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
    const expect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hmacSha256"])(TELEPORT_KEY, payload).slice(0, SIG_LEN);
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
    const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][m.locId];
    const place = loc ? loc.name : m.locId;
    const title = `${m.name} na Day ${m.day} dey ${place}`;
    const walk = m.trail.map((t)=>TELEPORT_CATEGORIES[t]).filter(Boolean).slice(0, 3);
    const walkLine = walk.length ? `Last moves: ${walk.join(' → ')}` : 'The day dey quiet — come see the street yourself.';
    const body = `${walkLine} · ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatNaira"])(m.earned)} earned across ${m.moves} move${m.moves === 1 ? '' : 's'}`;
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
}),
"[project]/src/game/systems/economy.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/game/systems/skills.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
;
function skillXpToNext() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].skillXpPerPoint;
}
function addSkillXp(skillXp, skills, playerLevel, skill, amount) {
    const cap = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapBase + playerLevel * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].skillCapPerLevel;
    const perPoint = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROGRESSION"].skillXpPerPoint;
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
}),
"[project]/src/game/systems/world.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
;
function nextSlot(t) {
    const idx = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIME"].slots.indexOf(t);
    const next = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIME"].slots[(idx + 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIME"].slots.length];
    return {
        timeOfDay: next,
        dayDelta: next === 'morning' ? 1 : 0
    };
}
function rollNewDayWeather() {
    const entries = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIME"].weatherWeights);
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
    return (day - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIME"].slots.length + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TIME"].slots.indexOf(timeOfDay);
}
}),
"[project]/src/game/systems/world3d.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
;
function walkingEnergyCost(meters) {
    if (!Number.isFinite(meters) || meters <= 0) return 0;
    const billable = Math.max(0, meters - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].freeMeters);
    if (billable === 0) return 0;
    const raw = billable / 100 * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].energyPer100m;
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORLD3D"].maxEnergyPerVisit, Math.max(1, Math.round(raw)));
}
function describeWalkSettle(meters, cost) {
    if (cost <= 0) return null;
    const km = (meters / 1000).toFixed(1);
    return `Long trek around Lokoja (${km} km on foot)`;
}
}),
"[project]/src/game/systems/travel.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$travelEvents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/travelEvents.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-ssr] (ecmascript)");
;
;
;
function mapDistanceKm(a, b) {
    const dx = b.mapX - a.mapX;
    const dy = b.mapY - a.mapY;
    return Math.hypot(dx, dy) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].kmPerMapUnit;
}
function calculateTravel(origin, destination, transport, weather, currentTimeOfDay, fuelMult = 1, minutesMult = 1) {
    const params = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ECONOMY"].transport[transport];
    const km = mapDistanceKm(origin, destination);
    const locationMod = destination.travelModifier ?? 1;
    const weatherMod = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].weatherMinutesMultiplier[weather]?.[transport] ?? 1;
    // fare = base + distance rate, rounded to the configured naira step
    // (personal rides pay the PUMP: the surge multiplies their cost only)
    const rawFare = (params.cost.base + params.cost.perKm * km) * (transport.startsWith('own-') ? fuelMult : 1);
    const cost = Math.round(rawFare / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding;
    // minutes: distance × speed × location × weather × road quality
    // (M10 — the town union's paved streets ride the last multiplier)
    const baseMinutes = km * params.minutesPerKm;
    const minutes = Math.max(1, Math.round(baseMinutes * locationMod * weatherMod * minutesMult));
    // energy: distance × rate × location modifier (walking uphill costs!)
    const energyCost = Math.max(1, Math.round(km * params.energyPerKm * locationMod));
    const slots = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].slotsPerTrip;
    const arrival = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["advanceWorldClock"])(currentTimeOfDay, 0, weather, slots);
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
    if (Math.random() >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].eventChance) return null;
    const eligible = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$travelEvents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL_EVENTS"].filter((e)=>{
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
}),
"[project]/src/game/systems/garage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/travel.ts [app-ssr] (ecmascript)");
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
        const params = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ECONOMY"].transport[t];
        return {
            transport: t,
            plan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTravel"])(origin, destination, t, weather, timeOfDay, 1, minutesMult),
            personal: false,
            label: params.label,
            emoji: params.emoji
        };
    });
    for (const t of personalTransportsFor(vehicles)){
        const model = personalModelOf(t);
        if (model === null || !canPersonalReach(destination, model)) continue;
        const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model];
        options.push({
            transport: t,
            plan: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTravel"])(origin, destination, t, weather, timeOfDay, fuelMult, minutesMult),
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
    return Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model].price * rate / 100) * 100;
}
}),
"[project]/src/game/systems/work.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-ssr] (ecmascript)");
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
        const tier = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["REPUTATION_TIERS"].find((t)=>t.threshold === req.minReputation);
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
    if (mood >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodBonusHigh.threshold) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodBonusHigh.factor;
    if (mood <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodPenaltyLow.threshold) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodPenaltyLow.factor;
    return 1;
}
function roundPay(raw) {
    return Math.max(0, Math.round(raw / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].payRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].payRounding);
}
function calculateJobPay(job, player) {
    const skillLevel = player.skills[job.skillTraining.skill];
    const skillBonus = 1 + Math.max(0, skillLevel - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].payPerSkillLevel;
    return roundPay(job.basePay * skillBonus * moodPayFactor(player.needs.mood));
}
function hustleSuccessChance(def, player) {
    const skillLevel = player.skills[def.skill];
    let chance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].baseSuccess + (skillLevel - def.difficulty) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].skillStep;
    if (player.needs.mood >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodBonusHigh.threshold) chance += __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodChanceBonusHigh;
    if (player.needs.mood <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodPenaltyLow.threshold) chance -= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].moodChancePenaltyLow;
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].successClamp.max, Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].successClamp.min, chance));
}
function rollCashRange(min, max, rng) {
    return Math.round(min + rng() * (max - min));
}
function resolveJob(job, player, rng = Math.random) {
    let pay = calculateJobPay(job, player);
    const great = rng() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].greatChance;
    if (great) pay = roundPay(pay * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].greatPayFactor);
    const reward = {
        cash: pay,
        xp: great ? Math.round(job.xpReward * 1.25) : job.xpReward,
        skillXp: {
            [job.skillTraining.skill]: job.skillTraining.xp
        },
        reputation: great ? job.reputationReward + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].greatBonusReputation : job.reputationReward
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
    const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NPC_BY_ID"][def.npcId];
    const chance = hustleSuccessChance(def, player);
    if (rng() >= chance) {
        return {
            outcome: 'fail',
            headline: `The hustle no work out — ${npc?.name ?? 'they'} no smile.`,
            reward: {
                xp: Math.round(def.reward.xp * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].fail.xpFactor)
            },
            cash: 0,
            skillId: def.skill
        };
    }
    const great = rng() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].greatChance;
    const cash = roundCash(rollCashRange(def.reward.cashMin, def.reward.cashMax, rng) * (great ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].greatPayFactor : 1));
    const reward = {
        cash,
        xp: great ? Math.round(def.reward.xp * 1.25) : def.reward.xp,
        skillXp: {
            [def.skill]: def.reward.skillXp
        },
        reputation: great ? def.reward.reputation + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].greatBonusReputation : def.reward.reputation
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
    return Math.max(0, Math.round(raw / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].payRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WORK"].payRounding);
}
}),
"[project]/src/game/systems/opportunities.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/hustles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/jobs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/work.ts [app-ssr] (ecmascript)");
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
        expiresAtSlot: currentAbsSlot + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLE"].expirySlots
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
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, def.id, currentAbsSlot) > 0) return false;
    // level / skill / reputation gates
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkRequirements"])(player, def.requirements).ok;
}
function generateHustleOffers(locationId, player, currentAbsSlot, rng = Math.random) {
    const pool = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLE_BY_ID"]).filter((def)=>def.locationId === locationId && isEligible(def, player, currentAbsSlot, player.activeOpportunities));
    if (pool.length === 0 || rng() < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLE"].dryChance) {
        return {
            offers: [],
            dry: true
        };
    }
    const count = Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLE"].maxPerSearch, pool.length, 1 + (rng() < 0.5 ? 1 : 0));
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLE_BY_ID"][instance.defId] ?? null;
}
function resolveOpportunity(instance, player, rng = Math.random) {
    const def = hustleDefFor(instance);
    if (!def) return null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resolveHustle"])(def, player, rng);
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, job.id, currentAbsSlot);
}
function jobIdForSlot(job, currentAbsSlot) {
    return `${job.id}@${currentAbsSlot}`;
}
function filterValidInstances(active) {
    return active.filter((o)=>o.type === 'hustle' ? !!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$hustles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HUSTLE_BY_ID"][o.defId] : !!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JOB_BY_ID"][o.defId]);
}
}),
"[project]/src/game/systems/fleet.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/travel.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const GIG_ORIGIN_ID = 'transport-area';
function gigDestinationsFor(model, level, weather) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].filter((l)=>l.id !== GIG_ORIGIN_ID && l.unlockLevel <= level && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canPersonalReach"])(l, model) && !(weather && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["weatherBlocksLocation"])(weather, l.id)));
}
function gigPayout(model, dest, weather, fleetMult = 1) {
    const park = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][GIG_ORIGIN_ID];
    const km = Math.hypot(dest.mapX - park.mapX, dest.mapY - park.mapY) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].kmPerMapUnit;
    const pub = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ECONOMY"].transport[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["publicCounterpartId"])(model)];
    const rain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRainSky"])(weather) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLEET"].rainPayout[model] ?? 1 : 1;
    const rough = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRainSky"])(weather) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLEET"].roughSkyBonus[weather] ?? 1 : 1;
    const raw = (pub.cost.base + pub.cost.perKm * km) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLEET"].payoutMult * rain * rough * fleetMult;
    return Math.round(raw / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRAVEL"].fareRounding;
}
function gigBoard(day, vehicles, level, weather, fuelMult = 1, cal) {
    const park = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][GIG_ORIGIN_ID];
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
        for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FLEET"].gigsPerModelPerDay; i++){
            // hash pick; when more than one destination exists, walk forward off
            // the PREVIOUS gig's destination so one model never double-books a run
            const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["civicHash"])('gig', day, model, i);
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
            const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$travel$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTravel"])(park, dest, `own-${model}`, weather, 'morning', fuelMult, cal ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["pavedMinutesMult"])(cal, day, dest.id) : 1);
            gigs.push({
                id: `gig-${day}-${model}-${i}`,
                day,
                model,
                toId: dest.id,
                payout: gigPayout(model, dest, weather, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calendarFleetMult"])(day)),
                fuel: plan.cost,
                energyCost: plan.energyCost,
                minutes: plan.minutes,
                distanceKm: plan.distanceKm,
                rainPremium: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRainSky"])(weather)
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
    const dest = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][gig.toId];
    const VEHICLE_SHORT = {
        okada: 'Okada',
        keke: 'Keke',
        taxi: 'Taxi',
        danfo: 'Danfo'
    };
    return `${VEHICLE_SHORT[gig.model]} run to ${dest?.name ?? gig.toId}`;
}
}),
"[project]/src/game/systems/profile.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-ssr] (ecmascript)");
;
/** The REAL vocabulary values, as sets — O(1) door checks, one truth. */ const SKIN_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SKIN_TONES"].map((o)=>o.value));
const HAIR_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["HAIR_COLORS"].map((o)=>o.value));
const HAIR_KEYS = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVATAR_HAIRSTYLES"].map((o)=>o.key));
const CLOTHING_STYLE_KEYS = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].map((o)=>o.key));
const CLOTHING_VALUES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CLOTHING_COLORS"].map((o)=>o.value));
const DEFAULT_LOOK_JSON = JSON.stringify(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"]);
function defaultLook() {
    return {
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_AVATAR"]
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
}),
"[project]/src/game/systems/bodies.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/profile.ts [app-ssr] (ecmascript)");
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
    const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateAvatarLook"])(raw);
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
}),
"[project]/src/game/systems/wheels.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/bodies.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-ssr] (ecmascript)");
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
    if (typeof model !== 'string' || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model]) {
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
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["posOk"])(input.pos)) return {
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
    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model];
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
        const rt = Math.min(now - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["INTERP_DELAY_MS"], this.b.t + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MAX_EXTRAP_MS"]);
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
        o.hd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["angleLerp"])(this.a.hd, this.b.hd, k);
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
    if (typeof model !== 'string' || !__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][model]) {
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
    const l = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCATIONS"].find((L)=>L.id === locId);
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
}),
"[project]/src/game/systems/social.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-ssr] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCIAL"].gifts.find((g)=>g.id === id) ?? null;
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
    return today - state.lastHangoutDay >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.cooldownDays;
}
function afterHangout(state, today) {
    return {
        ...state,
        familiarity: Math.min(100, state.familiarity + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCIAL"].hangout.familiarity),
        lastHangoutDay: today
    };
}
function favorRollsToday(familiarity, npcId, day) {
    if (familiarity < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCIAL"].favorTierMin) return false;
    return dayRoll(`favor:${npcId}`, day) < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SOCIAL"].favorChance;
}
}),
"[project]/src/game/systems/binarydelta.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    return Buffer.from(patch).toString('base64');
}
function patchFromBase64(b64) {
    if (typeof atob === 'function') {
        const bin = atob(b64);
        const out = new Uint8Array(bin.length);
        for(let i = 0; i < bin.length; i++)out[i] = bin.charCodeAt(i);
        return out;
    }
    return new Uint8Array(Buffer.from(b64, 'base64'));
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
"[project]/src/game/systems/walletnet.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
;
;
;
const useWalletNetStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(()=>({
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
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
async function walletNetSync() {
    const { account } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
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
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireWalletState"])();
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
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet', {});
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
    return `${kind}:${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle}:${Date.now().toString(36)}:${Math.floor(Math.random() * 1e9).toString(36)}`;
}
async function walletNetDeposit(amount) {
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
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
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireWalletDeposit"])(amt, idem);
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
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet-deposit', {
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
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
    if (!g.player) return {
        ok: false,
        why: 'unclaimed'
    };
    const amt = Math.floor(amount);
    const idem = mintIdem('wd');
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireWalletWithdraw"])(amt, pin, idem);
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
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet-withdraw', {
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
    const g = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
    if (!g.player) return {
        ok: false,
        why: 'unclaimed'
    };
    const amt = Math.floor(amount);
    const idem = mintIdem('tr');
    const w = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireWalletTransfer"])(to, amt, pin, idem, note);
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
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('wallet-transfer', {
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
}),
"[project]/src/game/systems/ambience.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — World Ambience (INC 4)
 * -------------------------------------
 * Procedural WebAudio bed for the 3D world — zero asset files, in the
 * same spirit as audio.ts. Layers:
 *   • breeze   — filtered noise, always on outdoors (softer indoors)
 *   • river    — bandpassed noise, gain blended by river proximity
 *   • market   — low murmur, gain blended by market proximity
 *   • rain     — bright noise while the real weather says rain
 *   • birds    — scheduled chirp blips by day (outdoors)
 *   • crickets — pulsed high band at night
 *   • room     — faint indoor room tone while inside
 *   • horns    — traffic hum + stochastic horn stabs (M19, by the roads)
 *   • zinc     — bright rain-on-zinc-roof ticks while indoors in the rain (M19)
 *
 * update() is called from the HUD poll (throttled) with pure numbers;
 * nothing here touches game state. Failures are swallowed — audio can
 * never break gameplay.
 */ __turbopack_context__.s([
    "ambience",
    ()=>ambience
]);
class WorldAmbience {
    ctx = null;
    master = null;
    layers = {};
    birdTimer = null;
    hornTimer = null;
    started = false;
    enabled = true;
    last = {
        night: false,
        rain: false,
        indoors: false,
        river: 0,
        market: 0
    };
    setEnabled(on) {
        this.enabled = on;
        if (this.master && this.ctx) {
            try {
                this.master.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.2);
            } catch  {
            /* ignore */ }
        }
        if (!on) this.stop();
    }
    /** Build the graph lazily (must follow a user gesture — the world is entered by a tap). */ start() {
        if (this.started || !this.enabled) return;
        try {
            const Ctor = window.AudioContext || window.webkitAudioContext;
            if (!Ctor) return;
            const ctx = new Ctor();
            this.ctx = ctx;
            const master = ctx.createGain();
            master.gain.value = 0;
            master.connect(ctx.destination);
            this.master = master;
            // shared 2s looping noise buffer
            const len = ctx.sampleRate * 2;
            const buf = ctx.createBuffer(1, len, ctx.sampleRate);
            const data = buf.getChannelData(0);
            let brown = 0;
            for(let i = 0; i < len; i++){
                const white = Math.random() * 2 - 1;
                brown = (brown + 0.02 * white) / 1.02;
                data[i] = white * 0.6 + brown * 2.2;
            }
            const layer = (filterType, freq, q, base)=>{
                const src = ctx.createBufferSource();
                src.buffer = buf;
                src.loop = true;
                const filter = ctx.createBiquadFilter();
                filter.type = filterType;
                filter.frequency.value = freq;
                filter.Q.value = q;
                const gain = ctx.createGain();
                gain.gain.value = base;
                src.connect(filter);
                filter.connect(gain);
                gain.connect(master);
                src.start();
                return gain;
            };
            this.layers.breeze = layer('lowpass', 320, 0.5, 0.045);
            this.layers.river = layer('bandpass', 850, 0.7, 0);
            this.layers.market = layer('lowpass', 480, 0.6, 0);
            this.layers.rain = layer('highpass', 1400, 0.4, 0);
            this.layers.room = layer('lowpass', 140, 0.5, 0);
            this.layers.crickets = layer('bandpass', 4400, 6, 0);
            this.layers.horns = layer('bandpass', 520, 2.5, 0);
            this.layers.zinc = layer('bandpass', 3200, 1.2, 0);
            // slow swell on the breeze — the wind breathes
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.07;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.02;
            lfo.connect(lfoGain);
            lfoGain.connect(this.layers.breeze.gain);
            lfo.start();
            // cricket pulse — amplitude tremolo on the high band (depth stays
            // small relative to the update()-set base so gain never goes wild)
            const cLfo = ctx.createOscillator();
            cLfo.type = 'square';
            cLfo.frequency.value = 16;
            const cLfoGain = ctx.createGain();
            cLfoGain.gain.value = 0.012;
            cLfo.connect(cLfoGain);
            cLfoGain.connect(this.layers.crickets.gain);
            cLfo.start();
            master.gain.setTargetAtTime(1, ctx.currentTime, 0.6);
            this.started = true;
            this.scheduleBirds();
            this.scheduleHorns(buf);
        } catch  {
            this.started = false;
        }
    }
    stop() {
        if (this.birdTimer !== null) clearTimeout(this.birdTimer);
        this.birdTimer = null;
        if (this.hornTimer !== null) clearTimeout(this.hornTimer);
        this.hornTimer = null;
        try {
            this.ctx?.close();
        } catch  {
        /* ignore */ }
        this.ctx = null;
        this.master = null;
        this.layers = {};
        this.started = false;
    }
    /** Throttled per-frame-ish blend from the HUD poll. */ update(p) {
        // M19 fields default here so existing callers compile untouched
        const p2 = {
            rainIndoors: false,
            traffic: 0,
            ...p
        };
        this.last = p2;
        const ctx = this.ctx;
        if (!ctx || !this.started) return;
        try {
            const t = ctx.currentTime;
            const set = (g, v, tc = 0.9)=>{
                if (g) g.gain.setTargetAtTime(v, t, tc);
            };
            const outdoor = p2.indoors ? 0.25 : 1;
            set(this.layers.breeze, p2.indoors ? 0.012 : 0.045);
            set(this.layers.river, Math.max(0, 1 - p2.river / 85) * 0.11 * outdoor);
            set(this.layers.market, Math.max(0, 1 - p2.market / 55) * 0.085 * outdoor);
            set(this.layers.rain, p2.rain ? 0.075 * (p2.indoors ? 0.4 : 1) : 0, 1.4);
            set(this.layers.room, p2.indoors ? 0.028 : 0, 1.2);
            set(this.layers.crickets, p2.night && !p2.indoors ? 0.032 : 0, 1.5);
            set(this.layers.horns, p2.traffic * 0.05 * outdoor);
            set(this.layers.zinc, p2.rainIndoors ? 0.05 : 0, 1.1);
        } catch  {
        /* ignore */ }
    }
    /** day-time bird chirps — 2-4 quick pitch-sliding blips, random interval */ scheduleBirds() {
        const tick = ()=>{
            this.birdTimer = setTimeout(tick, 2600 + Math.random() * 5200);
            const ctx = this.ctx;
            if (!ctx || !this.started || !this.enabled) return;
            if (this.last.night || this.last.indoors) return;
            try {
                const now = ctx.currentTime;
                const n = 2 + Math.floor(Math.random() * 3);
                const base = 2300 + Math.random() * 1900;
                for(let i = 0; i < n; i++){
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    const t0 = now + i * (0.09 + Math.random() * 0.06);
                    osc.frequency.setValueAtTime(base * (0.9 + Math.random() * 0.25), t0);
                    osc.frequency.exponentialRampToValueAtTime(base * (1.25 + Math.random() * 0.3), t0 + 0.07);
                    gain.gain.setValueAtTime(0.0001, t0);
                    gain.gain.exponentialRampToValueAtTime(0.028, t0 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
                    osc.connect(gain);
                    gain.connect(this.master);
                    osc.start(t0);
                    osc.stop(t0 + 0.13);
                }
            } catch  {
            /* ignore */ }
        };
        this.birdTimer = setTimeout(tick, 1800);
    }
    /**
   * M19 — traffic horns + zinc-roof rain ticks, one random 4-9s timer for
   * both. Horn stabs only with real traffic nearby and by day; the zinc
   * ticks only while the walker is indoors in the rain.
   */ scheduleHorns(buf) {
        const tick = ()=>{
            this.hornTimer = setTimeout(tick, 4000 + Math.random() * 5000);
            const ctx = this.ctx;
            if (!ctx || !this.started || !this.enabled) return;
            try {
                // zinc — a tiny 4ms white-noise tick, 30% per tick, 4-6kHz
                if (this.last.rainIndoors && Math.random() < 0.3 && this.master) {
                    const now = ctx.currentTime;
                    const src = ctx.createBufferSource();
                    src.buffer = buf;
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 4000 + Math.random() * 2000;
                    filter.Q.value = 2;
                    const g = ctx.createGain();
                    g.gain.setValueAtTime(0.02, now);
                    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
                    src.connect(filter);
                    filter.connect(g);
                    g.connect(this.master);
                    src.start(now, Math.random() * 1.5, 0.004);
                }
                // horn stab — a short detuned saw pair, only with traffic close and by day
                const traffic = this.last.traffic ?? 0;
                if (traffic <= 0.25 || this.last.night || !this.master) return;
                const now = ctx.currentTime;
                const base = 300 + Math.random() * 200;
                const det = base * 0.02;
                const g = ctx.createGain();
                g.gain.setValueAtTime(0.0001, now);
                g.gain.exponentialRampToValueAtTime(0.035 * traffic, now + 0.015);
                g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
                for (const f of [
                    base - det / 2,
                    base + det / 2
                ]){
                    const osc = ctx.createOscillator();
                    osc.type = 'sawtooth';
                    osc.frequency.value = f;
                    osc.connect(g);
                    osc.start(now);
                    osc.stop(now + 0.2);
                }
                g.connect(this.master);
            } catch  {
            /* ignore */ }
        };
        this.hornTimer = setTimeout(tick, 2600);
    }
}
const ambience = new WorldAmbience();
}),
"[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "boardableNear",
    ()=>boardableNear,
    "isLiveDriver",
    ()=>isLiveDriver,
    "myRideEndWhy",
    ()=>myRideEndWhy,
    "myRideState",
    ()=>myRideState,
    "parkedGhostByKey",
    ()=>parkedGhostByKey,
    "parkedGhostCount",
    ()=>parkedGhostCount,
    "parkedGhostList",
    ()=>parkedGhostList,
    "remoteCar",
    ()=>remoteCar,
    "remoteCarCount",
    ()=>remoteCarCount,
    "remoteCarList",
    ()=>remoteCarList,
    "sampleCar",
    ()=>sampleCar,
    "useWheelsStore",
    ()=>useWheelsStore,
    "wheelCrewHandles",
    ()=>wheelCrewHandles,
    "wheelCrewLast",
    ()=>wheelCrewLast,
    "wheelFuelEstimate",
    ()=>wheelFuelEstimate,
    "wheelIsDriving",
    ()=>wheelIsDriving,
    "wheelIsDryTank",
    ()=>wheelIsDryTank,
    "wheelIsRiding",
    ()=>wheelIsRiding,
    "wheelNetInit",
    ()=>wheelNetInit,
    "wheelQueryParked",
    ()=>wheelQueryParked,
    "wheelQueryParkedWhenLive",
    ()=>wheelQueryParkedWhenLive,
    "wheelRequestBoard",
    ()=>wheelRequestBoard,
    "wheelRequestRefuel",
    ()=>wheelRequestRefuel,
    "wheelRequestRepair",
    ()=>wheelRequestRepair,
    "wheelRequestSeats",
    ()=>wheelRequestSeats,
    "wheelRequestUnboard",
    ()=>wheelRequestUnboard,
    "wheelResetParkedQuery",
    ()=>wheelResetParkedQuery,
    "wheelSetDriveReader",
    ()=>wheelSetDriveReader,
    "wheelStartSending",
    ()=>wheelStartSending,
    "wheelStopSending",
    ()=>wheelStopSending,
    "wheelsWitness",
    ()=>wheelsWitness
]);
/**
 * LOKOJA LIFE — M24 W10-a: THE WHEEL NET (the fleet's client engine)
 * ===================================================================
 * The client home of the shared wheels: every claimed same-street
 * driver's car becomes a REAL rig the renderer can stand on the road.
 * Zero React churn — the per-frame truth lives in a module map the 3D
 * layer reads inside useFrame, exactly the W2 doctrine.
 *
 * LAWS OF THIS FILE:
 *  - THE IMPORTED-LAW DOCTRINE: the cadence, the clamp, the park, the
 *    buffer — ALL of it comes from systems/wheels.ts VERBATIM. This
 *    file only WIRING: wire pushes in, ticks out, samples to the frame.
 *  - THE SEED LAW: the roster push carries the car (the face + the last
 *    spot) — a car seen for the first time STANDS where the wire says
 *    before its first wheel tick ever arrives.
 *  - THE SENDER LAW: my wheels speak only when I am SEATED in a car I
 *    own (controls' own drive truth — this file never asks the 3D layer
 *    for anything), only claimed (a guest broadcasts nothing), only
 *    while the wire lives. The engine says hello on ENTER (one hello —
 *    the refused minor never retries), ticks at the 12Hz cadence
 *    ONLY-WHILE-MOVING, says the ONE park tick on the stop, and says
 *    bye the moment the seat empties.
 *  - THE CARRIED COORDINATION: while my car is live, my BODY lane is
 *    silent (remotenet checks isDriveActive() — the walker is in the
 *    car, not walking beside it).
 *  - THE SELF-ECHO LAW: the relay never sends my own car back to me —
 *    but a defensive client drops it anyway.
 *  - THE SWEEP LAW: a roster row whose car vanished is a car gone (the
 *    driver left the world — the rig must not ghost on the road).
 *  - THE WITNESS LAW: __lklWheels exposes the honest counters (hellos,
 *    ticks, parks, byes, refusals, the DISK readback the hello ack
 *    carried) so the E2E witness reads REALITY, not UI.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/game/systems/wheels.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
;
;
;
;
function parkedGhostByKey(key) {
    const [handle, model] = key.split('\u0000');
    return handle && model && parked.get(`${handle}\u0000${model}`) || null;
}
/* ───────────────────────── the module truth (per-frame) ───────────────────────── */ const cars = new Map();
function remoteCar(handle) {
    return cars.get(handle) ?? null;
}
function remoteCarCount() {
    return cars.size;
}
function remoteCarList() {
    return [
        ...cars.values()
    ];
}
/** THE DRIVER SET — the handles whose walker body must not ghost-walk
 *  (they are IN the car; RemoteWalkers reads this every frame). */ const drivers = new Set();
function isLiveDriver(handle) {
    return drivers.has(handle);
}
const parked = new Map() // key: handle\u0000model
;
function parkedKey(handle, model) {
    return `${handle}\u0000${model}`;
}
function parkedGhostCount() {
    return parked.size;
}
function parkedGhostList() {
    return [
        ...parked.values()
    ];
}
function ghostFromRow(row) {
    return {
        handle: row.handle,
        model: row.model,
        plate: row.plate,
        paint: row.paint ?? '',
        x: row.x,
        z: row.z,
        hd: row.hd ?? 0,
        at: Date.now()
    };
}
const useWheelsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(()=>({
        count: 0,
        plates: [],
        parkedKeys: []
    }));
function mirrorStore() {
    const list = [
        ...cars.values()
    ];
    useWheelsStore.setState({
        count: list.length,
        plates: list.map((c)=>c.plate),
        parkedKeys: parkedGhostList().map((g)=>`${g.handle}\u0000${g.model}\u0000${g.plate}\u0000${g.paint}`)
    });
    drivers.clear();
    for (const c of list)drivers.add(c.handle);
}
/* ───────────────────────────── the seed + the lanes ───────────────────────────── */ let myHandle = null;
function seedFromRoster(rows) {
    const seen = new Set();
    let myDriverGone = false;
    for (const r of rows){
        if (!r || typeof r.handle !== 'string') continue;
        // W10-b — THE RIDE BACKSTOP: my own row carries my ride; a roster
        // where my driver's car vanished means the drive ended upstream.
        if (myHandle && r.handle === myHandle && r.riding && myRide && r.riding.driver !== myRide.driver) {
            myDriverGone = true; // the wire moved me — trust the wire, not the memory
        }
        if (!r.car) continue;
        if (myHandle && r.handle === myHandle) continue; // my own car is MY business
        seen.add(r.handle);
        let c = cars.get(r.handle);
        if (!c) {
            c = {
                handle: r.handle,
                name: r.displayName || r.handle,
                model: r.car.model,
                plate: r.car.plate,
                paint: r.car.paint ?? '',
                buf: new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CarBuffer"](),
                lastHeard: Date.now(),
                seatsOpen: r.car.seatsOpen === true
            };
            cars.set(r.handle, c);
        } else {
            c.name = r.displayName || c.name;
            c.plate = r.car.plate || c.plate;
            c.paint = r.car.paint ?? c.paint;
            c.seatsOpen = r.car.seatsOpen === true;
            if (c.model !== r.car.model) {
                c.model = r.car.model;
                c.buf = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CarBuffer"](); // a different rig — the buffer restarts honestly
            }
        }
        // THE SEED LAW: the roster's moment stands the car before the first tick
        if (typeof r.car.x === 'number' && typeof r.car.z === 'number' && Number.isFinite(r.car.x) && Number.isFinite(r.car.z)) {
            c.buf.seed({
                t: Date.now(),
                x: r.car.x,
                z: r.car.z,
                hd: typeof r.car.hd === 'number' ? r.car.hd : 0,
                mv: r.car.mv === true
            });
        }
    }
    // THE SWEEP LAW: a roster row that lost its car is a car gone
    for (const h of [
        ...cars.keys()
    ]){
        if (!seen.has(h)) cars.delete(h);
    }
    // W10-b — THE LIVE-WINS LAW: a live roster row erases its own parked
    // ghost (the same car came back to life; the ghost must not double it)
    for (const c of cars.values())parked.delete(parkedKey(c.handle, c.model));
    if (myDriverGone) endMyRide('wire');
    mirrorStore();
}
let netInited = false;
function wheelNetInit() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    // the roster lane: the wire store is the ONE roster truth — mirror it
    let lastRoster;
}
let driveReader = null;
function wheelSetDriveReader(fn) {
    driveReader = fn;
}
function driveTruth() {
    if (driveReader) return driveReader();
    return {
        active: false,
        model: null,
        speed: 0,
        x: 0,
        z: 0,
        hd: 0
    };
}
/** the sender's own shared truth — my wheels are live on the wire RIGHT
 *  NOW (remotenet reads this to keep the body lane silent: the walker is
 *  IN the car). Module-level, updated by the sender tick itself. */ let drivingNow = false;
function wheelIsDriving() {
    return drivingNow;
}
let myRide = null;
let crewLast = null;
function wheelIsRiding() {
    return myRide !== null;
}
function myRideState() {
    return myRide ? {
        ...myRide
    } : null;
}
function wheelCrewLast() {
    return crewLast ? {
        ...crewLast
    } : null;
}
function wheelCrewHandles() {
    if (!myRide) return null;
    const list = [
        myRide.driver
    ];
    if (myHandle && !list.includes(myHandle)) list.push(myHandle);
    for (const r of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWireStore"].getState().roster){
        if (r.riding?.driver === myRide.driver && !list.includes(r.handle)) list.push(r.handle);
    }
    return list;
}
function sampleCar(handle) {
    const c = cars.get(handle);
    if (!c) return null;
    const s = c.buf.sample(Date.now());
    return s.alive ? {
        x: s.x,
        z: s.z,
        hd: s.hd,
        moving: s.moving
    } : null;
}
function boardableNear(x, z, radius = 5) {
    let best = null;
    for (const c of cars.values()){
        if (!c.seatsOpen) continue;
        const s = c.buf.sample(Date.now());
        if (!s.alive || s.moving) continue;
        const d = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z);
        if (d > radius * radius) continue;
        if (!best || d < best.d) best = {
            c,
            d
        };
    }
    if (!best) return null;
    const rosterSeated = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWireStore"].getState().roster.filter((r)=>r.riding?.driver === best.c.handle).length;
    return {
        handle: best.c.handle,
        name: best.c.name,
        model: best.c.model,
        plate: best.c.plate,
        paint: best.c.paint,
        seatsOpen: best.c.seatsOpen,
        seated: rosterSeated
    };
}
function endMyRide(why) {
    if (!myRide) return;
    myRide = null;
    counters.unboard++;
    rideEndWhy = why;
}
let rideEndWhy = null;
function myRideEndWhy() {
    return rideEndWhy;
}
async function wheelRequestBoard(driver) {
    if (drivingNow) return {
        ok: false,
        why: 'already-aboard'
    };
    if (myRide) return {
        ok: false,
        why: 'already-aboard'
    };
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSendVehicleBoard"])(driver).catch(()=>({
            ok: false,
            why: 'wire-down'
        }));
    if (!r.ok || !r.car) return {
        ok: false,
        why: 'why' in r && r.why || 'no-car'
    };
    myRide = {
        driver,
        model: r.car.model,
        plate: r.car.plate,
        paint: r.car.paint ?? '',
        seat: typeof r.seat === 'number' ? r.seat : 0
    };
    rideEndWhy = null;
    counters.board++;
    return {
        ok: true
    };
}
async function wheelRequestUnboard() {
    if (!myRide) return {
        ok: false,
        why: 'not-riding'
    };
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSendVehicleUnboard"])().catch(()=>({
            ok: false,
            why: 'wire-down'
        }));
    if (!r.ok) return {
        ok: false,
        why: 'why' in r && r.why || 'not-riding'
    };
    const pose = {
        x: r.x,
        z: r.z,
        hd: r.hd
    };
    endMyRide('ack');
    return {
        ok: true,
        ...pose
    };
}
async function wheelRequestSeats(open) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSendVehicleSeats"])(open).catch(()=>({
            ok: false
        }));
    return r.ok === true;
}
async function wheelQueryParked(x, z) {
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSendVehicleParkedQuery"])(x, z).catch(()=>({
            ok: false
        }));
    if (!r.ok) return 0;
    for (const row of r.parked ?? []){
        const key = parkedKey(row.handle, row.model);
        if (!cars.has(row.handle)) parked.set(key, ghostFromRow(row));
    }
    mirrorStore();
    return parked.size;
}
let parkedQueryRan = false;
async function wheelQueryParkedWhenLive(x, z) {
    if (parkedQueryRan) return parked.size;
    for(let i = 0; i < 24; i++){
        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWireStore"].getState().state === 'live') {
            parkedQueryRan = true;
            return wheelQueryParked(x, z);
        }
        await new Promise((r)=>setTimeout(r, 1500));
    }
    return 0;
}
function wheelResetParkedQuery() {
    parkedQueryRan = false;
}
/* ──────────────────────────────── the sender ──────────────────────────────── */ const counters = {
    hello: 0,
    sent: 0,
    park: 0,
    bye: 0,
    refused: 0,
    recv: 0,
    board: 0,
    unboard: 0,
    crew: 0,
    parked: 0,
    refuel: 0,
    repair: 0,
    dry: 0
};
let diskReadback = null;
/* ───────── W10-c: THE TANK'S OWN MIRROR (the driver's honest gauge) ─────────
 * The client burns the tank by the SAME law the wire runs, on the metres
 * the client itself sends (a lawful car's metres and the clamp's agree);
 * the hello readback + the pump/garage acks reconcile the DISK truth.
 * The HUD reads this through the controls-style reader — DOM-only writes. */ let fuelEstimate = null;
function wheelFuelEstimate() {
    return fuelEstimate;
}
function wheelIsDryTank() {
    return fuelEstimate !== null && fuelEstimate < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheels$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DRY_TANK"];
}
/** the store's own vehicle line wears the disk truth (the garage reads it) */ function mirrorVehicleTruth(model, patch) {
    const s = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState();
    if (!s.player) return;
    if (!s.player.vehicles.some((v)=>v.model === model)) return;
    s.patchVehicleMeters(model, patch);
}
async function wheelRequestRefuel(model, amount, x, z) {
    const idemKey = `refuel-${myHandle ?? 'me'}-${model}-${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`;
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSendVehicleRefuel"])(model, amount, x, z, idemKey).catch(()=>({
            ok: false,
            why: 'wire-down'
        }));
    if (!r.ok) return {
        ok: false,
        why: 'why' in r && r.why || 'no-pump'
    };
    counters.refuel++;
    if (typeof r.fuel === 'number') {
        fuelEstimate = r.fuel;
        mirrorVehicleTruth(model, {
            fuel: r.fuel
        });
    }
    return {
        ok: true,
        balance: r.balance
    };
}
async function wheelRequestRepair(model, x, z) {
    const idemKey = `repair-${myHandle ?? 'me'}-${model}-${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`;
    const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSendVehicleRepair"])(model, x, z, idemKey).catch(()=>({
            ok: false,
            why: 'wire-down'
        }));
    if (!r.ok) return {
        ok: false,
        why: 'why' in r && r.why || 'no-garage'
    };
    counters.repair++;
    if (typeof r.condition === 'number') mirrorVehicleTruth(model, {
        condition: r.condition
    });
    return {
        ok: true,
        balance: r.balance
    };
}
let sendTimer = null;
let carLive = null;
let lastTick = null;
let helloInFlight = false;
let helloSentAt = 0;
let refusedFor = null;
let lastMetres = 0;
function wheelStartSending() {
    wheelNetInit();
    myHandle = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle ?? null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEnsure"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.token ?? null, ()=>({
            street: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().world?.currentLocation ?? 'home',
            status: 'hustling'
        }));
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function wheelStopSending() {
    if (sendTimer) clearInterval(sendTimer);
    sendTimer = null;
    // a bracket that ends while seated still says goodbye (the honest exit)
    if (carLive) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSendCarBye"])();
        carLive = null;
        lastTick = null;
        refusedFor = null;
        fuelEstimate = null;
        counters.bye++;
    }
}
function wheelsWitness() {
    return {
        cars: cars.size,
        hello: counters.hello,
        sent: counters.sent,
        park: counters.park,
        bye: counters.bye,
        refused: counters.refused,
        recv: counters.recv,
        board: counters.board,
        unboard: counters.unboard,
        crew: counters.crew,
        parked: counters.parked,
        refuel: counters.refuel,
        repair: counters.repair,
        dry: counters.dry,
        fuel: ()=>fuelEstimate,
        ride: ()=>myRideState(),
        riding: ()=>myRide !== null,
        crewHandles: ()=>wheelCrewHandles(),
        crewLast: ()=>wheelCrewLast(),
        parkedGhosts: ()=>parkedGhostList().map((g)=>({
                    handle: g.handle,
                    model: g.model,
                    plate: g.plate,
                    x: g.x,
                    z: g.z
                })),
        disk: ()=>diskReadback,
        list: ()=>remoteCarList().map((c)=>({
                    handle: c.handle,
                    plate: c.plate,
                    model: c.model,
                    paint: c.paint,
                    seatsOpen: c.seatsOpen
                }))
    };
}
}),
"[project]/src/game/systems/extras.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dustOpacityTarget",
    ()=>dustOpacityTarget,
    "dustPlaneCount",
    ()=>dustPlaneCount,
    "extrasLive",
    ()=>extrasLive,
    "puddleCap",
    ()=>puddleCap,
    "updateExtrasLevel",
    ()=>updateExtrasLevel,
    "wetnessFor",
    ()=>wetnessFor
]);
/**
 * LOKOJA LIFE — M19: THE EXTRAS-FIRST LIVE LEVEL
 * -----------------------------------------------
 * The scene's 2s governor loop (the dynres heartbeat) computes the
 * polish verdict every tick and writes it here; every beauty layer
 * reads it per frame — one small object, zero React churn, zero new
 * timers (THE NO-NEW-TIMER LAW).
 *
 *   level 2 — the full show (what the tier allows)
 *   level 1 — mid polish: half the dust, quieter music kit
 *   level 0 — strip to the floor: dust off, puddles dry, drums out —
 *             and only THEN does dynres start walking resolution down.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-ssr] (ecmascript)");
;
const extrasLive = {
    level: 2,
    tier: 'mid'
};
function updateExtrasLevel(tier, p95ms, dynresDir) {
    extrasLive.tier = tier;
    extrasLive.level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extrasVerdict"])(tier, p95ms, dynresDir);
}
function dustPlaneCount(tier, extras) {
    if (tier === 'low') return 0;
    if (extras === 0) return 0;
    if (extras === 1) return 2;
    return tier === 'high' ? 4 : 3;
}
function puddleCap(tier, extras) {
    if (tier === 'low') return 0;
    if (extras === 0) return 0;
    if (extras === 1) return tier === 'high' ? 7 : 5;
    return tier === 'high' ? 14 : 9;
}
function wetnessFor(weather) {
    if (weather === 'storm' || weather === 'flood') return 1;
    if (weather === 'rain') return 0.8;
    return 0;
}
function dustOpacityTarget(tier, extras, harmattan) {
    const tierCap = tier === 'high' ? 0.34 : 0.26;
    const stress = extras === 2 ? 1 : extras === 1 ? 0.5 : 0;
    return harmattan ? tierCap * stress : 0;
}
}),
"[project]/src/game/systems/perfProbe.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Real-Device FPS Probe (M4 perf duty)
 * ---------------------------------------------------
 * Closes the honest gap flagged in the M2/M3 perf audits: SwiftShader
 * numbers are sub-1 fps software rasterization — the number that matters
 * is the one a REAL phone produces. This module runs everywhere
 * (production included), costs almost nothing (one rAF callback pushing
 * into a ring buffer, read 2×/second by the HUD chip), and produces a
 * shareable report string the player can copy out of the game.
 *
 * Pure measurement — never mutates game state, never touches the store.
 */ /* ------------------------------- renderer registry ------------------------------ */ /** Minimal slice of WebGLRenderer.info the report needs (no three import). */ __turbopack_context__.s([
    "buildReport",
    ()=>buildReport,
    "clearPerfRenderer",
    ()=>clearPerfRenderer,
    "probeRunning",
    ()=>probeRunning,
    "readFrameStats",
    ()=>readFrameStats,
    "sampleFor",
    ()=>sampleFor,
    "setPerfRenderer",
    ()=>setPerfRenderer,
    "startProbe",
    ()=>startProbe,
    "stopProbe",
    ()=>stopProbe
]);
let renderer = null;
function setPerfRenderer(gl) {
    renderer = gl ?? null;
}
function clearPerfRenderer() {
    renderer = null;
}
function readRendererSnapshot() {
    if (!renderer?.info) return null;
    return {
        drawCalls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        programs: renderer.info.programs?.length ?? 0
    };
}
/* --------------------------------- frame sampler -------------------------------- */ const RING = 240 // ~8s at 30fps, ~4s at 60fps
;
const deltas = new Float32Array(RING);
let head = 0;
let count = 0;
let rafId = null;
let last = 0;
function tick(now) {
    if (last > 0) {
        const dt = now - last;
        if (dt > 0 && dt < 4000) {
            // ignore tab-suspend spikes — they are not rendering truth
            deltas[head] = dt;
            head = (head + 1) % RING;
            if (count < RING) count++;
        }
    }
    last = now;
    rafId = requestAnimationFrame(tick);
}
function startProbe() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function stopProbe() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    last = 0;
}
function probeRunning() {
    return rafId !== null;
}
function readFrameStats() {
    if (count < 5) return null // not enough evidence yet — honest null
    ;
    const xs = Array.from(deltas.subarray(0, count)).sort((a, b)=>a - b);
    const total = xs.reduce((s, v)=>s + v, 0);
    const p95 = xs[Math.min(xs.length - 1, Math.floor(xs.length * 0.95))];
    return {
        fps: 1000 / (total / xs.length),
        p95ms: p95,
        worstMs: xs[xs.length - 1],
        frames: count
    };
}
/* ----------------------------------- the report --------------------------------- */ function gpuName() {
    try {
        const gl = renderer?.getContext?.() ?? null;
        if (!gl) return null;
        const dbg = gl.getExtension('WEBGL_debug_renderer_info');
        if (!dbg) return String(gl.getParameter(gl.RENDERER) ?? '') || null;
        return String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? '') || null;
    } catch  {
        return null;
    }
}
/** One honest line about the device this run happened on. */ function deviceLine() {
    const nav = navigator;
    const mem = nav.deviceMemory ? `~${nav.deviceMemory}GB` : '?';
    const net = nav.connection?.effectiveType ?? '?';
    return `${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio.toFixed(2)}x · ${mem} RAM · net ${net}`;
}
function buildReport(label = 'live') {
    const stats = readFrameStats();
    const snap = readRendererSnapshot();
    const gpu = gpuName();
    const lines = [
        `Lokoja Life — FPS report (${label})`,
        `when: ${new Date().toISOString()}`,
        `device: ${deviceLine()}`,
        `gpu: ${gpu ?? 'unknown'}`
    ];
    if (stats) {
        lines.push(`fps: ${stats.fps.toFixed(1)} avg · p95 frame ${stats.p95ms.toFixed(0)}ms · worst ${stats.worstMs.toFixed(0)}ms (${stats.frames} frames)`);
    } else {
        lines.push('fps: not enough frames sampled yet');
    }
    if (snap) {
        lines.push(`render: ${snap.drawCalls} draw calls · ${(snap.triangles / 1000).toFixed(0)}k tris · ${snap.programs} programs`);
    }
    lines.push(`ua: ${navigator.userAgent}`);
    return lines.join('\n');
}
function sampleFor(ms, label = `capture ${Math.round(ms / 1000)}s`) {
    startProbe();
    const before = count;
    return new Promise((resolve)=>{
        const t0 = performance.now();
        const poll = ()=>{
            if (performance.now() - t0 >= ms || count - before >= RING - 1) {
                resolve(buildReport(label));
                return;
            }
            setTimeout(poll, 120);
        };
        setTimeout(poll, ms);
    });
}
}),
"[project]/src/game/systems/remotenet.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bodiesWitness",
    ()=>bodiesWitness,
    "remoteBody",
    ()=>remoteBody,
    "remoteBodyCount",
    ()=>remoteBodyCount,
    "remoteBodyList",
    ()=>remoteBodyList,
    "remoteJoin",
    ()=>remoteJoin,
    "remoteNetInit",
    ()=>remoteNetInit,
    "remoteStartSending",
    ()=>remoteStartSending,
    "remoteStopSending",
    ()=>remoteStopSending,
    "setJoinExecutor",
    ()=>setJoinExecutor,
    "setPosReader",
    ()=>setPosReader,
    "useBodiesStore",
    ()=>useBodiesStore
]);
/**
 * LOKOJA LIFE — M24 W2: THE REMOTE NET (the bodies' client engine)
 * ================================================================
 * The client home of co-presence: every claimed same-street walker
 * becomes a REAL body the renderer can stand in the city. Zero React
 * churn — the per-frame truth lives in a module map the 3D layer reads
 * inside useFrame; the store only mirrors the ROSTER cadence (who is
 * here, what do they wear), which changes rarely.
 *
 * LAWS OF THIS FILE:
 *  - THE IMPORTED-LAW DOCTRINE: the buffer, the cadence, the staleness,
 *    the range — ALL of it comes from systems/bodies.ts VERBATIM. This
 *    file only WIRING: wire pushes in, ticks out, samples to the frame.
 *  - THE SEED LAW: the roster push carries the body (look + name + the
 *    last moment) — a walker seen for the first time STANDS where the
 *    wire says before their first pos tick ever arrives.
 *  - THE SENDER LAW: my body speaks only when I am IN the world
 *    (start/stop bracket the 3D mount), only when claimed (a guest
 *    broadcasts nothing — the darkness law), only when the wire lives.
 *    While moving: the 10Hz cadence; while still: the 1×/3s heartbeat.
 *  - THE SELF-ECHO LAW: the relay never sends my own pos back to me —
 *    but a defensive client drops it anyway (h==my handle → ignore).
 *  - THE JOIN LAW: remoteJoin(handle) asks the where door, teleports my
 *    body beside my paddy (the walker's own teleport seam) and follows
 *    their street with my presence. A guest join refuses at the door.
 *  - THE WITNESS LAW: __lklBodies exposes the honest counters (sent,
 *    received, the body list) so the E2E witness reads REALITY, not UI.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/bodies.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wheelnet$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wheelnet.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
;
;
;
;
;
/* ───────────────────────── the module truth (per-frame) ───────────────────────── */ const bodies = new Map();
function remoteBody(handle) {
    return bodies.get(handle) ?? null;
}
function remoteBodyCount() {
    return bodies.size;
}
function remoteBodyList() {
    return [
        ...bodies.values()
    ];
}
const useBodiesStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(()=>({
        count: 0,
        names: []
    }));
function mirrorStore() {
    const list = [
        ...bodies.values()
    ];
    useBodiesStore.setState({
        count: list.length,
        names: list.map((b)=>b.name || b.handle)
    });
}
/* ───────────────────────────── the seed + the lanes ───────────────────────────── */ let myHandle = null;
function seedFromRoster(rows) {
    const seen = new Set();
    for (const r of rows){
        if (!r || typeof r.handle !== 'string') continue;
        seen.add(r.handle);
        if (myHandle && r.handle === myHandle) continue; // my own body is MY business
        const look = r.look ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bodyLook"])(r.look) : null;
        let b = bodies.get(r.handle);
        if (!b) {
            b = {
                handle: r.handle,
                name: r.displayName || r.handle,
                band: r.band ?? 'adult',
                street: r.street ?? 'home',
                look,
                buf: new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$bodies$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InterpBuffer"](),
                lastHeard: Date.now()
            };
            bodies.set(r.handle, b);
        } else {
            b.name = r.displayName || b.name;
            b.band = r.band || b.band;
            b.street = r.street || b.street;
            if (look) b.look = look;
        }
        // THE SEED LAW: the roster's moment stands the body before the first tick
        if (typeof r.x === 'number' && typeof r.z === 'number' && Number.isFinite(r.x) && Number.isFinite(r.z)) {
            b.buf.seed({
                t: Date.now(),
                x: r.x,
                z: r.z,
                hd: typeof r.hd === 'number' ? r.hd : 0,
                mv: r.mv === true
            });
        }
    }
    // THE SWEEP LAW: a roster row that vanished is a body that left
    for (const h of [
        ...bodies.keys()
    ]){
        if (!seen.has(h)) bodies.delete(h);
    }
    mirrorStore();
}
let netInited = false;
function remoteNetInit() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    // the roster lane: the wire store is the ONE roster truth — mirror it
    let lastRoster;
}
/* ──────────────────────────────── the sender ──────────────────────────────── */ const counters = {
    sent: 0,
    recv: 0,
    refused: 0
};
let sendTimer = null;
let lastSent = null;
let lastSentAt = 0;
let prevRead = null;
function remoteStartSending() {
    remoteNetInit();
    myHandle = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle ?? null;
    // THE WORLD-ENTRY LAW: standing in the world ENSURES the wire — co-presence
    // never depends on which phone face happened to open (the faces keep their
    // own ensures; this one is idempotent like them all)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEnsure"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.token ?? null, ()=>({
            street: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().world?.currentLocation ?? 'home',
            status: 'hustling'
        }));
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function remoteStopSending() {
    if (sendTimer) clearInterval(sendTimer);
    sendTimer = null;
    lastSent = null;
    prevRead = null;
}
/** the local player's moment — the 3D layer registers the walker's own
 *  truth (playerPos); mv is DERIVED here from my own reads, never guessed */ let posReader = null;
function setPosReader(fn) {
    posReader = fn;
}
function playerPosRef() {
    if (posReader) return posReader();
    return null;
}
/** the teleport executor — the 3D layer registers the walker seam once
 *  (a system never imports from components; the component brings it) */ let joinExecutor = null;
function setJoinExecutor(fn) {
    joinExecutor = fn;
}
async function remoteJoin(handle) {
    const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireWhere"])(handle);
    if (!res.ok) return {
        ok: false,
        why: res.why ?? 'wire-down'
    };
    const x = typeof res.x === 'number' ? res.x : 0;
    const z = typeof res.z === 'number' ? res.z : 0;
    const street = typeof res.street === 'string' ? res.street : 'home';
    if (joinExecutor) joinExecutor(x, z);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireSetStreet"])(street);
    return {
        ok: true,
        street,
        displayName: typeof res.displayName === 'string' ? res.displayName : undefined
    };
}
function bodiesWitness() {
    return {
        count: bodies.size,
        sent: counters.sent,
        recv: counters.recv,
        list: ()=>remoteBodyList().map((b)=>({
                    handle: b.handle,
                    name: b.name,
                    look: b.look ? `${b.look.clothingStyle}/${b.look.hairstyle}` : null
                }))
    };
}
}),
"[project]/src/game/systems/stage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M24 W9: THE STAGE — THE PURE LAW VAULT
 * ====================================================
 * The nation's broadcast, as LAWS. The wire door runs these VERBATIM
 * (the W4 doctrine: zero copies, zero drift); the client engine
 * (stagenet.ts) and the faces run the same functions, so the suite
 * proves one truth and every side of the nation lives it.
 *
 * WHAT A STAGE IS: a claimed ADULT broadcaster puts their real point
 * of view (the living world's own canvas, the walk through Lokoja)
 * on the wire through the self-hosted media house (LiveKit, WHIP
 * ingest); anybody on the wire may WATCH it (the M17 spectate law —
 * guests watch, never walk); the stage room's chat rides the SAME
 * LiveEvent table as every word in the nation (THE ONE-NATION LAW);
 * tips move REAL server naira through the W6 ledger (the fortress
 * chain, idempotent, PIN-sealed); the viewer count is REAL, and the
 * M17 crowd law (crowdMult) stays a DISPLAY note, never a lie about
 * the number.
 *
 * LAWS OF THIS FILE:
 *  - THE BROADCAST DOOR (stageVerdict): a guest has no stage
 *    (guest-mic-dark); a MINOR never broadcasts (stage-adults-only —
 *    the M13 shield: a child's face never goes out on a public stage);
 *    the title law; THE ONE-STAGE LAW (one live stage per host — a
 *    broadcaster is one voice, not a grid of themselves).
 *  - THE SPECTATE LAW (stageWatchVerdict): ANYBODY on the wire may
 *    watch — claimed or guest, kid or adult. Watching is not speaking.
 *    (The stage room's CHAT door still runs the M17 tier laws.)
 *  - THE TITLE LAW (stageTitleOk): 1–64 printable characters after
 *    whitespace collapse; control characters refuse; punctuation-only
 *    refuses (the profile.ts discipline, carried).
 *  - THE ID LAW (stageIdOk): every stage id is minted `stg-` + base36;
 *    anything else refuses at every door that takes a streamId.
 *  - THE TIP DOOR (stageTipVerdict): a tip is REAL transfer money —
 *    the door still runs transferVerdict (W6) VERBATIM; these are the
 *    stage-scoped walls on top: the stage must be LIVE (a tip to a
 *    dead stage is a lost envelope), self-tip refuses, and the room
 *    hears the spray (the M17 SPRAY spirit — the crowd sees the
 *    generosity).
 *  - THE KIND LAW: W9 ships exactly one kind — 'pov' (the walker's
 *    own eyes). The old M17 sim kinds (stall/regatta/wedding) stay in
 *    the store for the M17 suite; they never appear on the real board.
 *  - THE PATH LAW: the media house answers at /rt (next rewrite in
 *    this sandbox; nginx /rt proxy in the deploy guide). The wire
 *    mints TOKENS, never URLs — the origin belongs to the page, so
 *    the same token works behind any front door.
 *  - THE ZERO-IMPORT LAW: this file imports NOTHING — it is a vault,
 *    not a machine.
 */ /* ─────────────────────────── the constants ─────────────────────────── */ __turbopack_context__.s([
    "STAGE_ID_RE",
    ()=>STAGE_ID_RE,
    "STAGE_KIND",
    ()=>STAGE_KIND,
    "STAGE_MESH_MAX",
    ()=>STAGE_MESH_MAX,
    "STAGE_TITLE_MAX",
    ()=>STAGE_TITLE_MAX,
    "STAGE_TITLE_MIN",
    ()=>STAGE_TITLE_MIN,
    "STAGE_TOKEN_TTL_S",
    ()=>STAGE_TOKEN_TTL_S,
    "crowdNoteText",
    ()=>crowdNoteText,
    "stageChannel",
    ()=>stageChannel,
    "stageChannelInvolves",
    ()=>stageChannelInvolves,
    "stageEndOk",
    ()=>stageEndOk,
    "stageEyeVerdict",
    ()=>stageEyeVerdict,
    "stageIdOk",
    ()=>stageIdOk,
    "stageRoom",
    ()=>stageRoom,
    "stageTipVerdict",
    ()=>stageTipVerdict,
    "stageTitleOk",
    ()=>stageTitleOk,
    "stageVerdict",
    ()=>stageVerdict,
    "stageWatchVerdict",
    ()=>stageWatchVerdict
]);
const STAGE_TITLE_MIN = 1;
const STAGE_TITLE_MAX = 64;
const STAGE_KIND = 'pov';
const STAGE_TOKEN_TTL_S = 4 * 60 * 60 // the media house token: four hours, renewed by the next stage
;
const STAGE_ID_RE = /^stg-[0-9a-z]{6,16}$/;
function stageIdOk(id) {
    return typeof id === 'string' && STAGE_ID_RE.test(id);
}
function stageRoom(id) {
    return `wire:stage:${id}`;
}
function stageChannel(id) {
    return `stream:${id}`;
}
function stageChannelInvolves(channel, streamId) {
    return channel === stageChannel(streamId);
}
/* ─────────────────────────── the title law ─────────────────────────── */ const PRINTABLE_RE = /^[\x20-\x7E\u00A0-\uFFFF]+$/;
const PUNCT_ONLY_RE = /^[\p{P}\p{S}\s]+$/u;
function stageTitleOk(raw) {
    if (typeof raw !== 'string') return null;
    const t = raw.replace(/\s+/g, ' ').trim();
    if (t.length < STAGE_TITLE_MIN || t.length > STAGE_TITLE_MAX) return null;
    if (!PRINTABLE_RE.test(t)) return null;
    if (PUNCT_ONLY_RE.test(t)) return null;
    return t;
}
function stageVerdict(identity, rawTitle, liveStageOfHost) {
    if (!identity.handle || identity.band === 'guest') return {
        ok: false,
        why: 'guest-mic-dark'
    };
    if (identity.band !== 'adult') return {
        ok: false,
        why: 'stage-adults-only'
    };
    const title = stageTitleOk(rawTitle);
    if (!title) return {
        ok: false,
        why: 'bad-title'
    };
    if (liveStageOfHost) return {
        ok: false,
        why: 'stage-live-already'
    };
    return {
        ok: true,
        title
    };
}
function stageWatchVerdict(_identity, stageLive) {
    if (!stageLive) return {
        ok: false,
        why: 'stage-not-live'
    };
    return {
        ok: true
    };
}
function stageTipVerdict(identity, stageLive, host) {
    if (!identity.handle || identity.band === 'guest') return {
        ok: false,
        why: 'guest-mic-dark'
    };
    if (identity.band !== 'adult') return {
        ok: false,
        why: 'minors-no-money'
    };
    if (!stageLive) return {
        ok: false,
        why: 'stage-not-live'
    };
    if (host === identity.handle) return {
        ok: false,
        why: 'self'
    };
    return {
        ok: true
    };
}
const STAGE_MESH_MAX = 8;
function stageEyeVerdict(eyeCount, stageLive) {
    if (!stageLive) return {
        ok: false,
        why: 'stage-not-live'
    };
    if (eyeCount >= STAGE_MESH_MAX) return {
        ok: false,
        why: 'stage-full'
    };
    return {
        ok: true
    };
}
function stageEndOk(identity, host) {
    if (!identity.handle || identity.band === 'guest') return {
        ok: false,
        why: 'guest-mic-dark'
    };
    if (identity.handle !== host) return {
        ok: false,
        why: 'not-yours'
    };
    return {
        ok: true
    };
}
function crowdNoteText(viewers) {
    const real = Math.max(0, Math.floor(viewers));
    if (real === 0) return 'no eyes yet';
    const mult = 1 + Math.min(real, 40) * 0.0125;
    return `${real} real ${real === 1 ? 'eye' : 'eyes'} · crowd ×${mult.toFixed(2)}`;
}
}),
"[project]/src/game/systems/stagenet.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stageBindCanvas",
    ()=>stageBindCanvas,
    "stageBindLane",
    ()=>stageBindLane,
    "stageEnsure",
    ()=>stageEnsure,
    "stageGoLive",
    ()=>stageGoLive,
    "stageNoteChat",
    ()=>stageNoteChat,
    "stagePump",
    ()=>stagePump,
    "stageReset",
    ()=>stageReset,
    "stageSeedBoard",
    ()=>stageSeedBoard,
    "stageSendChat",
    ()=>stageSendChat,
    "stageSendTip",
    ()=>stageSendTip,
    "stageStop",
    ()=>stageStop,
    "stageSubStreamId",
    ()=>stageSubStreamId,
    "stageTipIdentity",
    ()=>stageTipIdentity,
    "stageTipVerdictLocal",
    ()=>stageTipVerdictLocal,
    "stageUnwatch",
    ()=>stageUnwatch,
    "stageWatch",
    ()=>stageWatch,
    "stageWitness",
    ()=>stageWitness,
    "useStageStore",
    ()=>useStageStore
]);
/**
 * LOKOJA LIFE — M24 W9: THE STAGE NET (the broadcast's client plane)
 * ==================================================================
 * The browser home of the nation's stage. The PURE laws live in
 * stage.ts (the wire door runs them VERBATIM); this file is the media
 * plane: it owns the POV capture, the 1:N mesh handshake and the
 * witness counters — the same discipline voicenet.ts carries for the ear.
 *
 * THE MESH DOCTRINE (the honest amendment, recorded in stage.ts): the OSS
 * livekit-server ships NO WHIP door (witnessed: 404 with a VALID grant on
 * two versions) and the SDK would blow the N2 wire budget — so the stage
 * rides the SAME architecture as the W7 voice and the W8 face: SIGNALING
 * on the nation-wire, MEDIA peer-to-peer. ONE publisher offers to each
 * eye; the wire relays the sealed envelopes (the W7 sdp/ice laws at the
 * door) and NEVER sees a media byte (N5 holds). The SFU is the W12+
 * upgrade path when the mesh cap demands it.
 *
 * LAWS OF THIS FILE:
 *  - THE POV LAW: a stage broadcasts YOUR OWN EYES — the living world's
 *    canvas, captured through the StageCapture hook (in-task requestFrame;
 *    the luma instrument proves the frames are not black). No camera is
 *    asked, no permission is needed.
 *  - THE MIC TRUTH (W8's fallback law, carried): the mic is asked ONCE,
 *    best-effort, when the stage starts. A refused mic is an honest
 *    video-only stage — never a fake audio track.
 *  - THE ONE-STAGE LAW, client side: one publish per walker.
 *  - THE PUBLISHER-OFFERS LAW: the host initiates every handshake — an
 *    'eye' push wakes ONE pc with the POV tracks; an 'eye-gone' push
 *    closes it. The viewer never offers, never publishes.
 *  - THE ONE-EYE LAW: a walker watches zero or one stage; a new watch
 *    closes the old eye first.
 *  - THE ICE QUEUE LAW (the W7 discipline): a candidate may land before
 *    the remote description is set — it queues and drains in order.
 *  - THE CLEANUP LAW: stop / ended push / logout — every track stops,
 *    every peer closes, the store resets. No phantom stage, no ghost eye.
 *  - THE DEBUG HOOK (e2e witness): window.__lklStage exposes the REAL
 *    getStats bytes (published / received), the peer states and the
 *    witnessed viewer/chat/tip counts — the money shot reads numbers,
 *    never a fake.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/stage.ts [app-ssr] (ecmascript)");
;
;
;
;
/* ─────────────────────────── the constants ─────────────────────────── */ /** THE POV PACING — ≈15 frames a second (the pump time-gates requestFrame). */ const POV_PUMP_MS = 66;
const useStageStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(()=>({
        publishing: false,
        myStreamId: null,
        myTitle: null,
        myMic: false,
        board: [],
        watchingId: null,
        watchingTitle: null,
        remoteStream: null,
        viewerMuted: true,
        lastWhy: null,
        tipNote: null
    }));
/* ─────────────────────── the media plane (module state) ────────────── */ let povStream = null;
let micStream = null;
let myStreamId = null;
/** THE MESH — one pc per eye (the publisher's side). */ const eyePcs = new Map();
const eyeIceQueues = new Map();
let subPc = null;
let subStreamId = null;
let subIceQueue = [];
let pubSampler = null;
let subSampler = null;
/* ────────────────────────── the witness hook ───────────────────────── */ const witness = {
    pubBytes: 0,
    subBytes: 0,
    pubState: 'idle',
    subState: 'idle',
    viewersSeen: 0,
    chatSeen: 0,
    tipsSeen: 0,
    startedAt: 0,
    luma: -1,
    lastPubWhy: '',
    lastSubWhy: ''
};
async function samplePubBytes() {
    let total = 0;
    for (const pc of eyePcs.values()){
        try {
            const stats = await pc.getStats();
            stats.forEach((r)=>{
                if (r.type === 'outbound-rtp' && typeof r.bytesSent === 'number') total += r.bytesSent;
            });
        } catch  {}
    }
    witness.pubBytes = Math.max(witness.pubBytes, total);
}
async function sampleSubBytes() {
    if (!subPc) return;
    try {
        const stats = await subPc.getStats();
        let total = 0;
        stats.forEach((r)=>{
            if (r.type === 'inbound-rtp' && typeof r.bytesReceived === 'number') total += r.bytesReceived;
        });
        witness.subBytes = Math.max(witness.subBytes, total);
    } catch  {}
}
function stageWitness() {
    const pubStates = [
        ...eyePcs.values()
    ].map((pc)=>pc.connectionState);
    return {
        ...witness,
        luma: lastLuma,
        pubPc: pubStates.length ? pubStates.join('+') : myStreamId ? 'no-eyes' : 'none',
        subPc: subPc?.connectionState ?? 'none',
        store: useStageStore.getState()
    };
}
/* the witness hook install — every stage face ensure carries it */ /* ─────────────────────── the capture hook (StageCapture) ─────────────── */ /* A WebGL canvas without preserveDrawingBuffer hands captureStream a
 * CLEARED buffer the moment compositing ends — the silent black stage. The
 * law: the frames are captured INSIDE the render task. The additive
 * <StageCapture/> (inside the world's Canvas, the W2 doctrine) binds the
 * world's own canvas here and pumps requestFrame() from R3F's
 * addAfterEffect — the same task that just drew the frame, so the buffer
 * is alive. The pump also samples a 32×32 luminance read (same task) so
 * the witness can prove the stage is NOT black. No 3D file behaves
 * differently; the world never knows. */ let captureCanvas = null;
let captureStreamRef = null;
let frameTrack = null;
let pumping = false;
let lastPump = 0;
let lastLuma = -1;
const lumaSample = typeof document !== 'undefined' ? document.createElement('canvas') : null;
function stageBindCanvas(c) {
    captureCanvas = c;
}
function stagePump() {
    if (!pumping || !frameTrack) return;
    const now = performance.now();
    if (now - lastPump < POV_PUMP_MS) return;
    lastPump = now;
    try {
        frameTrack.requestFrame();
    } catch  {}
    // THE LUMA INSTRUMENT — same-task 32×32 read, the anti-black-frame proof
    if (captureCanvas && lumaSample) {
        try {
            lumaSample.width = 32;
            lumaSample.height = 32;
            const ctx = lumaSample.getContext('2d', {
                willReadFrequently: true
            });
            if (ctx) {
                ctx.drawImage(captureCanvas, 0, 0, 32, 32);
                const d = ctx.getImageData(0, 0, 32, 32).data;
                let sum = 0;
                for(let i = 0; i < d.length; i += 4)sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
                lastLuma = sum / (d.length / 4);
            }
        } catch  {}
    }
}
function stageEnsure() {
    stageInstallWitness();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEnsure"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.token ?? null, ()=>({
            street: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().world?.currentLocation ?? 'home',
            status: useStageStore.getState().publishing ? 'on air' : 'hustling'
        }));
}
/** THE BOARD LAW: every push re-pins the board; stage:list seeds it. */ let stageLaneBound = false;
function stageBindLane() {
    if (stageLaneBound) return;
    stageLaneBound = true;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireOnStage"])((p)=>{
        if (p.type === 'started' && p.stage) {
            const board = useStageStore.getState().board.filter((r)=>r.id !== p.stage.id);
            useStageStore.setState({
                board: [
                    ...board,
                    p.stage
                ]
            });
        } else if (p.type === 'ended' && typeof p.streamId === 'string') {
            useStageStore.setState({
                board: useStageStore.getState().board.filter((r)=>r.id !== p.streamId)
            });
            // MY stage died (the host law, the wire's goodbye) — clean up
            if (useStageStore.getState().myStreamId === p.streamId) stageTeardownLocal();
            // MY eye was on it — the honest dark
            if (useStageStore.getState().watchingId === p.streamId) stageUnwatchLocal('stage-ended');
        } else if (p.type === 'viewers' && typeof p.viewers === 'number') {
            witness.viewersSeen = p.viewers;
            useStageStore.setState({
                board: useStageStore.getState().board.map((r)=>r.id === p.streamId ? {
                        ...r,
                        viewers: p.viewers
                    } : r)
            });
        } else if (p.type === 'tip') {
            witness.tipsSeen += 1;
            const from = typeof p.from === 'string' ? p.from : 'someone';
            const amount = typeof p.amount === 'number' ? p.amount : 0;
            useStageStore.setState({
                tipNote: `💸 @${from} sprayed ₦${amount}`
            });
        } else if (p.type === 'eye' && typeof p.streamId === 'string' && typeof p.eye === 'string') {
            void hostEye(p.streamId, p.eye);
        } else if (p.type === 'eye-gone' && typeof p.streamId === 'string' && typeof p.eye === 'string') {
            void hostEyeGone(p.streamId, p.eye);
        } else if (p.type === 'offer' && typeof p.streamId === 'string' && typeof p.sdp === 'string') {
            void viewerOffer(p.streamId, p.sdp);
        } else if (p.type === 'answer' && typeof p.streamId === 'string' && typeof p.sdp === 'string' && typeof p.from === 'string') {
            void hostAnswer(p.streamId, p.from, p.sdp);
        } else if (p.type === 'ice' && !!p.candidate && typeof p.candidate === 'object') {
            void meshIce(p);
        }
    });
}
/* ─────────────────────── the generic mesh helpers ──────────────────── */ function newPc() {
    // the media flies peer-to-peer on loopback / LAN — the deploy's coturn
    // (W12) rides the same iceServers slot when the wider nation needs it
    return new RTCPeerConnection({
        iceServers: []
    });
}
async function gatherComplete(pc) {
    if (pc.iceGatheringState === 'complete') return;
    await new Promise((res)=>{
        const done = ()=>res();
        const t = setTimeout(done, 2_000) // THE GATHER CEILING — never hang the mesh
        ;
        pc.addEventListener('icegatheringstatechange', ()=>{
            if (pc.iceGatheringState === 'complete') {
                clearTimeout(t);
                done();
            }
        });
        pc.addEventListener('icecandidate', (e)=>{
            if (!e.candidate) {
                clearTimeout(t);
                done();
            }
        });
    });
}
/* ──────────────────────── THE PUBLISHER'S SIDE ─────────────────────── */ function worldCanvas() {
    const cs = Array.from(document.querySelectorAll('canvas'));
    return cs.find((c)=>c.width >= 320 && c.height >= 200) ?? cs[0] ?? null;
}
async function stageGoLive(title) {
    if (useStageStore.getState().publishing) return {
        ok: false,
        why: 'stage-live-already'
    };
    stageEnsure();
    stageBindLane();
    useStageStore.setState({
        lastWhy: null
    });
    const ack = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:start', {
        title
    });
    if (!ack.ok || !ack.streamId) return {
        ok: false,
        why: ack.why ?? 'wire no gree'
    };
    const canvas = worldCanvas();
    if (!canvas) {
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:end', {
            streamId: ack.streamId
        });
        return {
            ok: false,
            why: 'stage-no-canvas'
        };
    }
    // THE CAPTURE LAW: the bound hook (in-task requestFrame) when the world
    // mounted it; the honest direct capture otherwise (recorded, never hidden).
    let stream;
    try {
        if (captureCanvas) {
            captureStreamRef = captureCanvas.captureStream(0);
            frameTrack = captureStreamRef.getVideoTracks()[0] ?? null;
            pumping = !!frameTrack;
            stream = captureStreamRef;
            lastLuma = -1;
        } else {
            stream = canvas.captureStream(15);
        }
        if (!stream || stream.getVideoTracks().length === 0) throw new Error('no video track');
    } catch  {
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:end', {
            streamId: ack.streamId
        });
        return {
            ok: false,
            why: 'stage-no-canvas'
        };
    }
    // THE MIC TRUTH — asked ONCE at start; a refusal is an honest video-only
    // stage (the fallback law, never a fake track)
    let mic = false;
    try {
        const m = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });
        micStream = m;
        mic = true;
    } catch  {
        mic = false;
    }
    povStream = stream;
    myStreamId = ack.streamId;
    witness.pubState = 'ready';
    witness.startedAt = Date.now();
    useStageStore.setState({
        publishing: true,
        myStreamId: ack.streamId,
        myTitle: title,
        myMic: mic,
        tipNote: null
    });
    if (pubSampler) clearInterval(pubSampler);
    pubSampler = setInterval(()=>{
        void samplePubBytes();
    }, 2_000);
    return {
        ok: true,
        streamId: ack.streamId
    };
}
/** THE PUBLISHER OFFERS — an eye arrived; one pc, POV tracks, one offer. */ async function hostEye(streamId, eye) {
    if (streamId !== myStreamId || !povStream) return;
    if (eyePcs.has(eye)) return; // THE ONE-PC-PER-EYE LAW
    const pc = newPc();
    eyePcs.set(eye, pc);
    eyeIceQueues.set(eye, []);
    witness.pubState = 'offering';
    for (const track of povStream.getVideoTracks())pc.addTrack(track, povStream);
    if (micStream) for (const track of micStream.getAudioTracks())pc.addTrack(track, micStream);
    pc.addEventListener('icecandidate', (e)=>{
        if (e.candidate) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:ice', {
            streamId,
            to: eye,
            candidate: e.candidate.toJSON()
        });
    });
    pc.addEventListener('connectionstatechange', ()=>{
        witness.pubState = `eye:${pc.connectionState}`;
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') void hostEyeGone(streamId, eye);
    });
    try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await gatherComplete(pc);
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:offer', {
            streamId,
            to: eye,
            sdp: pc.localDescription.sdp
        });
        if (!r.ok) {
            witness.lastPubWhy = `offer(${r.why})`;
            void hostEyeGone(streamId, eye);
        }
    } catch (e) {
        witness.lastPubWhy = `offer(${String(e).slice(0, 60)})`;
        void hostEyeGone(streamId, eye);
    }
}
async function hostEyeGone(streamId, eye) {
    if (streamId !== myStreamId) return;
    const pc = eyePcs.get(eye);
    if (pc) {
        try {
            pc.close();
        } catch  {}
        eyePcs.delete(eye);
        eyeIceQueues.delete(eye);
    }
}
async function hostAnswer(streamId, eye, sdp) {
    if (streamId !== myStreamId) return;
    const pc = eyePcs.get(eye);
    if (!pc) return;
    try {
        await pc.setRemoteDescription({
            type: 'answer',
            sdp
        });
        const q = eyeIceQueues.get(eye) ?? [];
        for (const c of q)await pc.addIceCandidate(c).catch(()=>{});
        eyeIceQueues.set(eye, []);
    } catch (e) {
        witness.lastPubWhy = `answer(${String(e).slice(0, 60)})`;
        void hostEyeGone(streamId, eye);
    }
}
async function stageStop() {
    const sid = useStageStore.getState().myStreamId;
    if (sid) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:end', {
        streamId: sid
    });
    stageTeardownLocal();
}
function stageTeardownLocal() {
    if (pubSampler) {
        clearInterval(pubSampler);
        pubSampler = null;
    }
    pumping = false;
    frameTrack = null;
    captureStreamRef?.getTracks().forEach((t)=>t.stop());
    captureStreamRef = null;
    povStream?.getTracks().forEach((t)=>t.stop());
    micStream?.getTracks().forEach((t)=>t.stop());
    povStream = null;
    micStream = null;
    for (const pc of eyePcs.values()){
        try {
            pc.close();
        } catch  {}
    }
    eyePcs.clear();
    eyeIceQueues.clear();
    myStreamId = null;
    useStageStore.setState({
        publishing: false,
        myStreamId: null,
        myTitle: null,
        myMic: false
    });
}
async function stageWatch(streamId) {
    if (useStageStore.getState().watchingId === streamId) return {
        ok: true
    };
    // THE ONE-EYE LAW: a new eye closes the old one first
    if (useStageStore.getState().watchingId) await stageUnwatch();
    stageEnsure();
    stageBindLane();
    useStageStore.setState({
        lastWhy: null
    });
    const ack = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:watch', {
        streamId
    });
    if (!ack.ok) return {
        ok: false,
        why: ack.why ?? 'stage-not-live'
    };
    useStageStore.setState({
        watchingId: streamId,
        watchingTitle: typeof ack.title === 'string' ? ack.title : null,
        viewerMuted: true,
        remoteStream: null
    });
    // the offer rides the push lane; nothing to do until it lands
    return {
        ok: true
    };
}
async function viewerOffer(streamId, sdp) {
    if (useStageStore.getState().watchingId !== streamId || subPc) return;
    subStreamId = streamId;
    const pc = newPc();
    subPc = pc;
    subIceQueue = [];
    witness.subState = 'answering';
    // THE PASSIVE EYE LAW: no pre-added transceivers — setRemote(offer) creates
    // the recvonly m-lines itself (a pre-added pair doubles them, the wart the
    // deep hook caught: two muted receivers beside the two live ones)
    const remote = new MediaStream();
    pc.addEventListener('track', (e)=>{
        remote.addTrack(e.track);
        useStageStore.setState({
            remoteStream: remote
        });
    });
    pc.addEventListener('icecandidate', (e)=>{
        if (e.candidate) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:ice', {
            streamId,
            candidate: e.candidate.toJSON()
        });
    });
    pc.addEventListener('connectionstatechange', ()=>{
        witness.subState = pc.connectionState;
        if (pc.connectionState === 'failed') stageUnwatchLocal('stage-dark');
    });
    if (subSampler) clearInterval(subSampler);
    subSampler = setInterval(()=>{
        void sampleSubBytes();
    }, 2_000);
    try {
        await pc.setRemoteDescription({
            type: 'offer',
            sdp
        });
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await gatherComplete(pc);
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:answer', {
            streamId,
            sdp: pc.localDescription.sdp
        });
        if (!r.ok) {
            witness.lastSubWhy = `answer(${r.why})`;
            stageUnwatchLocal('stage-dark');
        }
    } catch (e) {
        witness.lastSubWhy = `offer(${String(e).slice(0, 60)})`;
        stageUnwatchLocal('stage-dark');
    }
}
async function meshIce(p) {
    const cand = p.candidate;
    if (!cand || typeof cand.candidate !== 'string') return;
    // MY eye's queue: the host's candidate lands before the answer sometimes
    if (subPc && subStreamId === p.streamId) {
        if (subPc.remoteDescription && subPc.remoteDescription.type) {
            await subPc.addIceCandidate(cand).catch(()=>{});
        } else {
            subIceQueue.push(cand); // THE ICE QUEUE LAW
        }
        return;
    }
    // the host's per-eye queues
    const from = typeof p.from === 'string' ? p.from : null;
    if (from && eyePcs.has(from)) {
        const pc = eyePcs.get(from);
        if (pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(cand).catch(()=>{});
        } else {
            const q = eyeIceQueues.get(from) ?? [];
            q.push(cand);
            eyeIceQueues.set(from, q);
        }
    }
}
async function stageUnwatch() {
    const id = useStageStore.getState().watchingId;
    if (id) void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:leave', {
        streamId: id
    });
    stageUnwatchLocal();
}
function stageUnwatchLocal(why = 'clean') {
    if (subSampler) {
        clearInterval(subSampler);
        subSampler = null;
    }
    try {
        subPc?.close();
    } catch  {}
    subPc = null;
    subStreamId = null;
    subIceQueue = [];
    useStageStore.setState({
        watchingId: null,
        watchingTitle: null,
        remoteStream: null,
        viewerMuted: true,
        lastWhy: why === 'clean' ? null : why
    });
}
async function stageSeedBoard() {
    stageEnsure();
    stageBindLane();
    for(let i = 0; i < 12; i++){
        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:list', {});
        if (r.ok && Array.isArray(r.stages)) {
            useStageStore.setState({
                board: r.stages
            });
            return;
        }
        if (r.why !== 'wire-down' && r.why !== 'wire-slow') return; // a lawful answer, even an empty board
        await new Promise((res)=>setTimeout(res, 700));
    }
}
function stageSendChat(streamId, text) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:chat', {
        streamId,
        text
    });
}
function stageTipIdentity() {
    const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useGameStore"].getState().account;
    const band = a.ageBand === 'kid' || a.ageBand === 'teen' ? a.ageBand : a.linked ? 'adult' : 'guest';
    return {
        handle: a.handle ?? null,
        band
    };
}
function stageTipVerdictLocal(streamId, host) {
    const live = useStageStore.getState().board.some((r)=>r.id === streamId);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$stage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["stageTipVerdict"])(stageTipIdentity(), live, host);
}
function stageSendTip(streamId, amount, pin, idemKey) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["wireEmitAck"])('stage:tip', {
        streamId,
        amount,
        pin,
        idemKey
    });
}
function stageReset() {
    void stageStop();
    void stageUnwatch();
    useStageStore.setState({
        board: [],
        lastWhy: null,
        tipNote: null
    });
}
function stageNoteChat() {
    witness.chatSeen += 1;
}
function stageSubStreamId() {
    return subStreamId;
}
/* ─────────────────────── the debug hook (e2e) ──────────────────────── */ function stageInstallWitness() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/src/game/systems/liveRoom.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SPRAY_MAX",
    ()=>SPRAY_MAX,
    "SPRAY_MIN",
    ()=>SPRAY_MIN,
    "SPRAY_STEP",
    ()=>SPRAY_STEP,
    "crowdNote",
    ()=>crowdNote,
    "playerCountIn",
    ()=>playerCountIn,
    "roomChannel",
    ()=>roomChannel,
    "roomRoster",
    ()=>roomRoster,
    "sprayAllowed",
    ()=>sprayAllowed,
    "sprayEvent",
    ()=>sprayEvent,
    "wireToPresences",
    ()=>wireToPresences
]);
/**
 * LOKOJA LIFE — M21: THE LIVING ROOM (room helpers on top of live.ts)
 * -------------------------------------------------------------------
 * Pure helpers for the ROOM the walker is physically standing in.
 * This file sits ON TOP of systems/live.ts (it never edits the laws,
 * it composes them) and holds the honesty build's prime law:
 *
 *  - THE PRIME LAW — HONESTY: a room's people count comes ONLY from
 *    real presence rows. The NPC crowd is a SEPARATE number that may
 *    only ever cross into UI through crowdNote(), which labels it
 *    "(sim)" every single time. No invented handles, no bot messages,
 *    no fake online counters.
 *  - THE ROOM KEY LAW: a room is keyed by the SAME string the world
 *    calls the player's current location id — liveSync already pings
 *    `street: world.currentLocation`, so roomRoster matches exactly
 *    the co-located (their last ping said this street) walkers.
 *  - THE TTL LAW (inherited): presenceAlive + PRESENCE_TTL_MS decide
 *    who is in the room — a stale ping is an absent neighbor. Roster
 *    order is the presenceRoster order (handle sort), filtered.
 *  - THE SPRAY LAW: spraying real naira is an ADULT money-table move
 *    (band === 'adult', structurally false for minors regardless of
 *    pocket), bounded ₦100–₦5,000 in ₦100 notes, and the broadcast it
 *    mints is a valid LiveEvent on the room's street channel — the
 *    same relay shapes, no new event kind invented.
 *
 * Everything here is deterministic and side-effect-free: no clock, no
 * store, no fetch — the caller always supplies `now`, the day and the
 * identity, exactly like live.ts.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-ssr] (ecmascript)");
;
function roomChannel(street) {
    return `street:${street}`;
}
function roomRoster(all, street, now) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["presenceRoster"])(all, now).filter((p)=>p.street === street);
}
function playerCountIn(presences, street, now) {
    return presences.filter((p)=>p.street === street && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["presenceAlive"])(p, now)).length;
}
function crowdNote(simCrowd) {
    const n = Number.isFinite(simCrowd) ? Math.max(0, Math.round(simCrowd)) : 0;
    return `~${n.toLocaleString('en-US')} souls on this street (sim)`;
}
const SPRAY_MIN = 100;
const SPRAY_MAX = 5_000;
const SPRAY_STEP = 100;
function sprayAllowed(identity, cash) {
    if (identity.band !== 'adult') return false;
    return Number.isFinite(cash) && cash >= SPRAY_MIN;
}
function sprayEvent(handle, street, amount, day) {
    if (!Number.isFinite(amount) || amount < SPRAY_MIN || amount > SPRAY_MAX) return {
        ok: false,
        why: 'bad-amount'
    };
    if (amount % SPRAY_STEP !== 0) return {
        ok: false,
        why: 'not-multiple'
    };
    const naira = amount.toLocaleString('en-US');
    const text = `💰 ${handle} spray ₦${naira} — money dey fly for ${street}! (day ${day})`;
    const event = {
        id: `spray:${handle}:${street}:${day}:${amount}`,
        kind: 'chat',
        channel: roomChannel(street),
        actor: handle,
        payload: {
            text,
            spray: amount,
            day
        }
    };
    // honest by construction: the builder never emits a shape the relay would refuse
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateEvent"])(event).ok) return {
        ok: false,
        why: 'bad-street'
    };
    return {
        ok: true,
        event,
        text,
        channel: event.channel
    };
}
function wireToPresences(rows, now) {
    return rows.map((r)=>({
            handle: r.handle,
            street: r.street,
            status: r.status ?? 'chilling',
            band: r.band ?? 'adult',
            ts: typeof r.ts === 'number' ? r.ts : now
        }));
}
}),
];

//# sourceMappingURL=src_game_systems_d3910ed5._.js.map