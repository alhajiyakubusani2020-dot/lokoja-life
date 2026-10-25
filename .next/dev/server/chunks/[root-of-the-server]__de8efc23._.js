module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: [
        'query'
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[project]/src/game/systems/binarydelta.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/game/data/config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Central Game Configuration
 * -----------------------------------------
 * The ONE place to tune the economy and balance.
 * Game logic must read from here — never hard-code numbers in components.
 *
 * Sections marked "(future stage)" are consumed by systems that arrive
 * in later stages; they live here now so designers can pre-tune them.
 */ /* ------------------------------ Starting stats ------------------------------ */ __turbopack_context__.s([
    "AUTOSAVE",
    ()=>AUTOSAVE,
    "BIZ",
    ()=>BIZ,
    "CHAOS",
    ()=>CHAOS,
    "CHILL",
    ()=>CHILL,
    "CIVIC",
    ()=>CIVIC,
    "ECONOMY",
    ()=>ECONOMY,
    "ELDER",
    ()=>ELDER,
    "FESTIVALS",
    ()=>FESTIVALS,
    "FLEET",
    ()=>FLEET,
    "FOOD",
    ()=>FOOD,
    "FORTRESS",
    ()=>FORTRESS,
    "GAME_META",
    ()=>GAME_META,
    "GOALS",
    ()=>GOALS,
    "HUSTLE",
    ()=>HUSTLE,
    "INTERIOR",
    ()=>INTERIOR,
    "LADDER",
    ()=>LADDER,
    "LEVEL_UNLOCKS",
    ()=>LEVEL_UNLOCKS,
    "MEAL_BY_KEY",
    ()=>MEAL_BY_KEY,
    "NEEDS",
    ()=>NEEDS,
    "PROGRESSION",
    ()=>PROGRESSION,
    "PULSE",
    ()=>PULSE,
    "REPUTATION_TIERS",
    ()=>REPUTATION_TIERS,
    "RIVERS",
    ()=>RIVERS,
    "SHIELD",
    ()=>SHIELD,
    "SOCIAL",
    ()=>SOCIAL,
    "STARTING",
    ()=>STARTING,
    "TIME",
    ()=>TIME,
    "TRAVEL",
    ()=>TRAVEL,
    "WEATHER_META",
    ()=>WEATHER_META,
    "WORK",
    ()=>WORK,
    "WORLD3D",
    ()=>WORLD3D
]);
const STARTING = {
    cash: 5000,
    needs: {
        health: 100,
        energy: 100,
        hunger: 100,
        mood: 100
    },
    skills: {
        hustle: 1,
        smart: 1,
        social: 1
    },
    reputation: 0,
    level: 1,
    xp: 0,
    homeId: 'basic-room',
    jobId: null
};
const NEEDS = {
    /** Hard clamp for all need values. */ min: 0,
    max: 100,
    /** Below this hunger, mood starts draining each action. */ hungerCritical: 20,
    /** Below this energy, strenuous activities are blocked. */ energyCritical: 10,
    /** Mood drain per action while hunger is critical. */ hungryMoodDrain: 4,
    /** Health drain per action while hunger has hit 0. */ starvingHealthDrain: 3,
    /** Passive regen applied when a player rests. */ rest: {
        /** Short nap (advances one time slot). */ nap: {
            energy: 22,
            hunger: -8,
            mood: 4,
            health: 2
        },
        /** Full night sleep (advances to next morning). */ sleep: {
            energy: 100,
            hunger: -22,
            mood: 12,
            health: 8
        }
    },
    /**
   * INC 4 — living-world decay. Every time slot that passes OUTSIDE of
   * rest quietly drains the body: meals now matter on a schedule and a
   * full day of hustling leaves its mark. Applied by the store on the
   * non-rest clock paths (travel, work, eating, home downtime) through
   * systems/needs.applySlotDecay — never hand-rolled in components.
   */ decay: {
        hunger: 2,
        energy: 1,
        mood: 1,
        health: 0
    }
};
const INTERIOR = {
    /** interaction radius for furniture hotspots, in interior metres */ hotspotRadius: 2.1,
    /** unwind actions — each honestly advances one clock slot (time passes) */ relax: {
        tv: {
            mood: 8,
            energy: 3,
            hunger: -3
        },
        bath: {
            mood: 5,
            energy: 5,
            hunger: -3
        }
    },
    /** Stage 5 — gym session (one clock slot, leaves you properly tired) */ gym: {
        energy: -14,
        mood: 8,
        health: 6,
        hunger: -8
    },
    /** Stage 7 — school study hour (one clock slot, sharpens the mind) */ study: {
        energy: -7,
        mood: 3,
        health: 0,
        hunger: -6,
        smartXp: 14
    },
    /** Stage 5 — night out at the lounge: mood bomb, wallet hit (cash in NIGHT_OUT.cost) */ lounge: {
        energy: -6,
        mood: 14,
        hunger: -4
    },
    /** Stage 5 — night-out economy */ NIGHT_OUT: {
        cost: 2500,
        /** evening/night only — daytime visits cost the same but give half mood */ nightMoodBonus: 4
    },
    /** interior camera rig tuning (presentation-only) */ camera: {
        distance: 4.6,
        minDistance: 2.6,
        maxDistance: 7,
        height: 3.1,
        pitchMin: 0.22,
        pitchMax: 0.95
    },
    /** exterior door interact radius (world units) */ doorRadius: 3.2
};
const PROGRESSION = {
    /** xp needed to go from level L to L+1 = base * L^growth */ xpBase: 120,
    xpGrowth: 1.4,
    /** Cap keeps late-game numbers sane. */ maxLevel: 50,
    /** Skill XP converted to skill points at this many XP per point (future stage). */ skillXpPerPoint: 25,
    /** Starting skill cap grows with level: cap = base + level * perLevel. */ skillCapBase: 3,
    skillCapPerLevel: 2
};
const REPUTATION_TIERS = [
    {
        threshold: 0,
        name: 'Nobody',
        title: 'Just another face in Lokoja'
    },
    {
        threshold: 100,
        name: 'Known',
        title: 'People nod when you pass'
    },
    {
        threshold: 250,
        name: 'Hustler',
        title: 'Your name opens small doors'
    },
    {
        threshold: 500,
        name: 'Respected',
        title: 'Traders call you boss'
    },
    {
        threshold: 1000,
        name: 'Influential',
        title: 'Your word carries weight'
    },
    {
        threshold: 2500,
        name: 'Big Player',
        title: 'Lokoja knows your name'
    }
];
const LEVEL_UNLOCKS = {
    1: [
        'Basic jobs',
        'Kpata Market',
        'Ganaja Junction'
    ],
    2: [
        'Food stalls',
        'Photography gigs'
    ],
    3: [
        'Confluence activities',
        'Fishing'
    ],
    4: [
        'Mount Patti trails',
        'Tourist hustles'
    ],
    5: [
        'Market stall business'
    ],
    8: [
        'Food stand business'
    ],
    10: [
        'Historic Lokoja tours',
        'Delivery business'
    ]
};
const ECONOMY = {
    currencySymbol: '₦',
    /**
   * Transport (Stage 2). Fares scale with trip distance from these params:
   *   cost   = base + perKm × km  (rounded to TRAVEL.fareRounding)
   *   time   = minutesPerKm × km  (× location modifier × weather modifier)
   *   energy = energyPerKm × km   (× location modifier)
   * Tuned so a median trip (≈3 km) matches Lokoja-realistic fares:
   *   walk ₦0/15min/-10⚡, keke ≈₦300/8min/-2⚡, taxi ≈₦1,000/4min/-1⚡
   */ transport: {
        walk: {
            label: 'Walk',
            emoji: '🚶',
            cost: {
                base: 0,
                perKm: 0
            },
            minutesPerKm: 4.8,
            energyPerKm: 3.2
        },
        keke: {
            label: 'Keke',
            emoji: '🛺',
            cost: {
                base: 100,
                perKm: 60
            },
            minutesPerKm: 2.6,
            energyPerKm: 0.65
        },
        taxi: {
            label: 'Taxi',
            emoji: '🚕',
            cost: {
                base: 300,
                perKm: 220
            },
            minutesPerKm: 1.3,
            energyPerKm: 0.32
        },
        // M4 — THE GARAGE: your own rides. No fare — FUEL only, bought at the pump
        // on departure (the store charges it like a fare but the ledger says fuel).
        // Fuel < the public fare for the same trip: that is what ownership MEANS.
        'own-okada': {
            label: 'Your Okada',
            emoji: '🏍️',
            cost: {
                base: 0,
                perKm: 45
            },
            minutesPerKm: 2.0,
            energyPerKm: 0.55
        },
        'own-keke': {
            label: 'Your Keke',
            emoji: '🛺',
            cost: {
                base: 0,
                perKm: 40
            },
            minutesPerKm: 2.4,
            energyPerKm: 0.6
        },
        'own-taxi': {
            label: 'Your Taxi',
            emoji: '🚕',
            cost: {
                base: 0,
                perKm: 130
            },
            minutesPerKm: 1.2,
            energyPerKm: 0.32
        },
        'own-danfo': {
            label: 'Your Danfo',
            emoji: '🚐',
            cost: {
                base: 0,
                perKm: 85
            },
            minutesPerKm: 2.1,
            energyPerKm: 0.38
        }
    },
    /** Rent charged every N days per home (Stage 4). */ rent: {
        cycleDays: 7,
        homes: {
            'basic-room': 2500,
            apartment: 15000,
            house: 45000
        }
    },
    /** Starting prices for shops (Stage 4). Tunable per item in foods/items data. */ shopMargin: 1.15,
    /** Businesses (Stage 8): income per in-game day at level 1, upgrade multiplier. */ business: {
        baseIncome: {
            'food-stand': 1800,
            'market-stall': 1500
        },
        upgradeCostMultiplier: 1.8,
        collectIntervalDays: 1
    }
};
const TIME = {
    /** Order of the day. */ slots: [
        'morning',
        'afternoon',
        'evening',
        'night'
    ],
    /** Weighted weather for a new day. Night-clear only appears at night.
   *  M6 — harmattan dust, confluence thunderstorms and Niger/Benue flood
   *  days are rare, dramatic days: the whole city feels them. */ weatherWeights: {
        sunny: 55,
        cloudy: 25,
        rain: 14,
        harmattan: 3.5,
        storm: 1.8,
        flood: 0.7
    },
    /** Effects on the player per weather (travel modifiers live in TRAVEL below).
   *  M6 — actually APPLIED at the sleep day-roll: the sky sets the day's mood. */ weatherEffects: {
        sunny: {
            mood: 0
        },
        cloudy: {
            mood: 0
        },
        rain: {
            mood: -3
        },
        harmattan: {
            mood: -2
        },
        storm: {
            mood: -6
        },
        flood: {
            mood: -8
        }
    }
};
const WEATHER_META = {
    sunny: {
        icon: 'sunny',
        label: 'Sunny',
        tip: 'Clear skies — the city moves easy.',
        dayNote: null
    },
    cloudy: {
        icon: 'cloudy',
        label: 'Cloudy',
        tip: 'Cloud cover, cool air.',
        dayNote: null
    },
    rain: {
        icon: 'rain',
        label: 'Rain',
        tip: 'Rain is falling — trips take a bit longer.',
        dayNote: 'Rain fall this morning — carry body cover, journeys go slow small.'
    },
    'night-clear': {
        icon: 'night-clear',
        label: 'Clear night',
        tip: 'Quiet, starry night.',
        dayNote: null
    },
    harmattan: {
        icon: 'harmattan',
        label: 'Harmattan',
        tip: 'Dust haze everywhere — visibility low, throat dry.',
        dayNote: 'Harmattan dust don blow in — the whole town dey haze. Journeys slow small, price dey climb.'
    },
    storm: {
        icon: 'storm',
        label: 'Thunderstorm',
        tip: 'Heavy storm — okada dey suffer, roads don messy.',
        dayNote: 'Thunderstorm don land for the confluence — no waka comot unless e necessary.'
    },
    flood: {
        icon: 'flood',
        label: 'Flood watch',
        tip: 'Niger don overflow — the riverfront is closed, food prices climb.',
        dayNote: 'Flood alert! Niger/Benue don overflow — riverfront closed, food prices don climb.'
    }
};
const WORK = {
    /** default cooldown after a shift, if a job doesn't define its own */ defaultCooldownSlots: 1,
    /** pay bonus per relevant skill level above 1 (0.05 = +5%) */ payPerSkillLevel: 0.05,
    /** pay factor when mood is high / low — hustle rewards good vibes */ moodBonusHigh: {
        threshold: 70,
        factor: 1.08
    },
    moodPenaltyLow: {
        threshold: 25,
        factor: 0.9
    },
    /** base success chance for a hustle-style roll (jobs always succeed) */ baseSuccess: 0.72,
    /** success shift per (skill − difficulty) point, clamped below */ skillStep: 0.07,
    successClamp: {
        min: 0.15,
        max: 0.95
    },
    /** chance a success becomes a 'great' outcome (bigger payout + bonus rep) */ greatChance: 0.18,
    /** great outcomes multiply the payout by this */ greatPayFactor: 1.5,
    /** what a failed hustle still yields (lesson XP, mood hit) */ fail: {
        xpFactor: 0.5,
        cashFactor: 0,
        moodDelta: -6
    },
    /** pay rounding step (keeps naira amounts tidy) */ payRounding: 10,
    /** success chance bonus when mood is high (hustle rolls) */ moodChanceBonusHigh: 0.05,
    /** success chance penalty when mood is low (hustle rolls) */ moodChancePenaltyLow: 0.05,
    /** extra reputation a 'great' outcome adds */ greatBonusReputation: 2,
    /** how long the on-screen "working…" transition lasts (ms) */ transitionMs: 700
};
const HUSTLE = {
    /** max accepted-but-undone opportunities the player can hold */ maxActive: 3,
    /** generated offers expire after this many absolute slots */ expirySlots: 6,
    /** cooldown for "look around for hustles" searching */ searchCooldownSlots: 1,
    /** how many offers one search can produce (weighted random pick) */ maxPerSearch: 2,
    /** chance (0–1) that a search finds nothing — the streets are not always kind */ dryChance: 0.25
};
const TRAVEL = {
    /** Map units (0–100 grid) → kilometres. Lokoja core ≈ 11 km across. */ kmPerMapUnit: 0.16,
    /** Every completed trip advances this many time slots on the EXISTING clock. */ slotsPerTrip: 1,
    /** Minutes multiplier per transport in each weather (kept gentle by design).
   *  M6 rows: harmattan dust slows everyone a little; a confluence storm is
   *  rain turned to eleven; flood is the slowest day of the year. */ weatherMinutesMultiplier: {
        sunny: {
            walk: 1,
            keke: 1,
            taxi: 1,
            'own-okada': 1,
            'own-keke': 1,
            'own-taxi': 1,
            'own-danfo': 1
        },
        cloudy: {
            walk: 1,
            keke: 1,
            taxi: 1,
            'own-okada': 1,
            'own-keke': 1,
            'own-taxi': 1,
            'own-danfo': 1
        },
        rain: {
            walk: 1.4,
            keke: 1.15,
            taxi: 1.08,
            'own-okada': 1.35,
            'own-keke': 1.14,
            'own-taxi': 1.06,
            'own-danfo': 1.1
        },
        'night-clear': {
            walk: 1,
            keke: 1,
            taxi: 1,
            'own-okada': 1,
            'own-keke': 1,
            'own-taxi': 1,
            'own-danfo': 1
        },
        harmattan: {
            walk: 1.15,
            keke: 1.12,
            taxi: 1.08,
            'own-okada': 1.18,
            'own-keke': 1.12,
            'own-taxi': 1.08,
            'own-danfo': 1.1
        },
        storm: {
            walk: 1.75,
            keke: 1.35,
            taxi: 1.15,
            'own-okada': 1.65,
            'own-keke': 1.32,
            'own-taxi': 1.14,
            'own-danfo': 1.22
        },
        flood: {
            walk: 1.9,
            keke: 1.5,
            taxi: 1.25,
            'own-okada': 1.8,
            'own-keke': 1.45,
            'own-taxi': 1.24,
            'own-danfo': 1.35
        }
    },
    /** Chance (0–1) that a travel event rolls on a completed trip. */ eventChance: 0.3,
    /** Fares are rounded to the nearest naira step. */ fareRounding: 10,
    /** How long the on-screen "travelling…" transition lasts (ms). */ transitionMs: 850
};
const GAME_META = {
    title: 'Lokoja Life',
    tagline: 'Build your life at the Confluence.',
    version: '0.3.0',
    stage: 'Stage 3 — Economy, Work & Opportunities'
};
const AUTOSAVE = {
    /** Debounce window for autosave after state changes (ms). */ debounceMs: 1200
};
const WORLD3D = {
    /** energy cost per 100 m actually walked on foot */ energyPer100m: 0.55,
    /** metres per world visit that are always free (strolling one spot) */ freeMeters: 150,
    /** maximum energy one world visit can drain (anti-idle safety cap) */ maxEnergyPerVisit: 6,
    /** radius (m) at which a nearby NPC's gist chip appears */ npcGistRadius: 24,
    /** metres of road a keke/okada/danfo travels per second (traffic feel) */ trafficBaseSpeed: 7,
    /** localStorage key for the one-time 3D onboarding (NOT part of the save) */ onboardingKey: 'lko-world-tut-v1',
    /** localStorage key for district discovery progress (NOT part of the save) */ discoveryKey: 'lko-world-disc-v1',
    /** Stage 5 — driving your own vehicle: energy per km (much cheaper than walking) */ driveEnergyPerKm: 0.35
};
const FOOD = {
    meals: [
        {
            key: 'amala',
            label: 'Amala + ewedu + goat',
            detail: 'Mama T’s Thursday special — swallow that holds you',
            price: 450,
            hunger: 34,
            mood: 6,
            energy: 4
        },
        {
            key: 'jollof',
            label: 'Party jollof + chicken',
            detail: 'Smoky bottom-pot jollof, fried chicken on top',
            price: 700,
            hunger: 46,
            mood: 10,
            energy: 5
        },
        {
            key: 'suya',
            label: 'Suya wrap',
            detail: 'Hot off the grill, extra yaji pepper',
            price: 300,
            hunger: 18,
            mood: 8,
            energy: 2
        },
        {
            key: 'bread-akara',
            label: 'Bread + akara',
            detail: 'The classic roadside combo that never fails',
            price: 250,
            hunger: 20,
            mood: 4,
            energy: 3
        },
        {
            key: 'groceries',
            label: 'Fresh foodstuff basket',
            detail: 'Tomatoes, peppers, rice, groundnut oil — for the pot at home',
            price: 350,
            hunger: 26,
            mood: 3,
            energy: 2
        },
        /* ---- M6 — the night market menu: food strip stalls that only wake after dark ---- */ {
            key: 'night-suya',
            label: 'Night suya platter',
            detail: 'The grill that runs till the coals die — extra yaji, double onion',
            price: 400,
            hunger: 26,
            mood: 12,
            energy: 2,
            night: true
        },
        {
            key: 'boli-ekpa',
            label: 'Boli + groundnut',
            detail: 'Roasted plantain off the night coals, groundnut on the side',
            price: 220,
            hunger: 18,
            mood: 7,
            energy: 3,
            night: true
        },
        {
            key: 'peppersoup',
            label: 'Catfish pepper soup',
            detail: 'Steaming bowl at the corner table — night taste better',
            price: 650,
            hunger: 30,
            mood: 11,
            energy: 4,
            night: true
        }
    ]
};
const MEAL_BY_KEY = Object.fromEntries(FOOD.meals.map((m)=>[
        m.key,
        m
    ]));
const CIVIC = {
    /** NEPA — the disco. Bills post every cycleDays; debt past grace cuts light. */ nepa: {
        cycleDays: 5,
        /** metered flat for a basic room */ baseBill: 1400,
        /** seeded daily variance added on top (deterministic per billing day) */ billVariance: 900,
        /** days after a bill posts before load-shedding starts */ graceDays: 3,
        /** one-time mood hit the day the light goes */ sheddingMoodHit: 4,
        /** reconnection fee on top of the debt once shedding has started */ reconnectFee: 300
    },
    /** paying a civic bill remotely (phone) costs this convenience fee —
   *  walking into the government-area office is always free */ phonePayFee: 50,
    /** KGIRS — the state revenue service. Assesses a cut of what you EARNED. */ kgirs: {
        cycleDays: 10,
        /** flat share of the cycle's income (Nigeria-ish PAYE metaphor) */ rate: 0.075,
        /** even a hustler with ₦0 income files something small */ minAssessment: 300,
        /** days after assessment before the warrant issues */ graceDays: 4,
        /** extra share of the assessed tax when the police collects it */ warrantFineRate: 0.25,
        /** reputation hit the day the warrant issues */ warrantReputationHit: 5
    },
    /** EFCC — whistleblowers eat too: file a tip, the commission recovers. */ efcc: {
        tipCooldownDays: 3,
        /** your reward is this share of what the commission recovers */ rewardRate: 0.05,
        /** days until a filed tip resolves */ resolveDays: 2,
        /** seeded recovery amounts (deterministic per tip id) */ recoveries: [
            4000,
            9000,
            18000,
            42000,
            120000
        ]
    },
    /** the markets breathe: prices move daily, every 3rd day is market day */ market: {
        markets: [
            'kpata-market',
            'food-area'
        ],
        minMult: 0.85,
        maxMult: 1.35,
        /** every Nth day is a market day — blanket discount at both markets */ marketDayEvery: 3,
        marketDayMult: 0.9,
        /** seasonal flavour events (weighted pick, deterministic per day) */ events: [
            {
                icon: '🍅',
                label: 'Tomato glut',
                note: 'Tomatoes full everywhere — peppers dey almost free.',
                mealBias: 'groceries',
                biasMult: 0.82,
                weight: 3
            },
            {
                icon: '🛢️',
                label: 'Fuel scarcity',
                note: 'Queue for fuel reach two junctions — everything cost small more.',
                weight: 3
            },
            {
                icon: '🎉',
                label: 'Festive season',
                note: 'Ram and rice prices climb — everybody dey cook for somebody.',
                mealBias: 'jollof',
                biasMult: 1.25,
                weight: 2
            },
            {
                icon: '🐮',
                label: 'Suya rush',
                note: 'Wedding season — ram meat scarce round the grill.',
                mealBias: 'suya',
                biasMult: 1.2,
                weight: 2
            },
            {
                icon: '🌧️',
                label: 'Rain scatter market',
                note: 'Rain beat Kpata today — some traders no open at all.',
                weight: 2
            },
            {
                icon: '🚚',
                label: 'New supply enter',
                note: 'Fresh trailer offload — market soft small today.',
                mealBias: 'bread-akara',
                biasMult: 0.85,
                weight: 2
            }
        ],
        /** chance (0–1) a day rolls a flavour event at all */ eventChance: 0.55
    },
    /**
   * M6 — THE NIGHT MARKET. Every evening the Food Strip turns: the day
   * bukas wind down and the night stalls wake — suya coals, boli, pepper
   * soup. Night dishes price BELOW the day rate (night markets feed the
   * late hustler), the multiplier seeded per day so prices still breathe.
   */ nightMarket: {
        /** where the night stalls line up */ locationId: 'food-area',
        /** the slots the night market is open */ opensAt: [
            'evening',
            'night'
        ],
        /** seeded per-day discount band on night dishes */ minMult: 0.78,
        maxMult: 0.95
    }
};
const CHAOS = {
    /** chance (0–1) a heavy-sky day blows a transformer (rain alone never does) */ blowoutChance: {
        storm: 0.45,
        flood: 0.7
    },
    /** outage length band, in days (seeded per blowout) */ outageDays: {
        min: 1,
        max: 2
    },
    /** a shop caught in a BLACKOUT zone with no power backup earns this share
   *  (harsher than plain shedding — the whole feeder is down) */ blackoutIncomeFactor: 0.25,
    /** a generator shop burns this much fuel per dark day, drawn from the till
   *  like a wage (solar shops drink sunlight and pay nothing) */ generatorFuelPerDay: 600,
    /** chance (0–1) any day rolls a cash-scarcity morning (the naira dries up) */ scarcityChance: 0.18,
    /** scarcity law: the ATM pays out at most this per day */ atmCap: 5000,
    /** the POS agent's levy: this share of any instant withdrawal */ posFeeRate: 0.02,
    /** black-market fuel surge on scarcity days (personal-vehicle pump price) */ fuelSurgeMult: 1.6,
    /** POS-agent businesses earn this multiplier on scarcity days (commissions) */ posBoostMult: 1.35,
    /** market liquidity fold: a cash crunch lifts prices, an ajo payout softens them */ scarcityMarketMult: 1.12,
    payoutMarketMult: 0.92,
    /** every Nth day the ajo/esusu circles pay out (traders flush with cash) */ payoutEvery: 9,
    /** community fix pool: naira target before the technician is called */ poolTarget: 12000,
    /** seeded NPC daily contribution band into the pool */ poolNpcMin: 1500,
    poolNpcMax: 3500,
    /** what one player contribution costs (pick one per dark day) */ poolTiers: [
        500,
        1000,
        2500
    ],
    /** restoring the light pays the spirit and the street */ fixMood: 4,
    fixReputation: 3
};
const GOALS = {
    /** goals rolled per day */ perDay: 3,
    /** ₦1,000 when all four onboarding steps land (Street Certified) */ onboardingReward: 1000,
    /** the onboarding steps, in display order */ onboardingSteps: [
        {
            id: 'travel',
            label: 'Make your first journey',
            hint: 'Open the Map and ride somewhere.'
        },
        {
            id: 'work',
            label: 'Run your first hustle',
            hint: 'A shift, a hustle or a gig — anything that pays.'
        },
        {
            id: 'meal',
            label: 'Eat a real meal',
            hint: 'Hunger no dey hustle for anybody.'
        },
        {
            id: 'earn',
            label: 'Earn your first ₦500',
            hint: 'Every big name started from something small.'
        }
    ],
    pool: [
        {
            id: 'gig-run',
            kind: 'gig',
            label: 'Run a Motor Park gig',
            target: 1,
            cash: 500,
            xp: 15
        },
        {
            id: 'eat-well',
            kind: 'meal',
            label: 'Eat a proper meal',
            target: 1,
            cash: 250,
            xp: 8
        },
        {
            id: 'till-run',
            kind: 'collect',
            label: 'Collect your shop till',
            target: 1,
            cash: 400,
            xp: 12
        },
        {
            id: 'waka',
            kind: 'travel',
            label: 'Travel anywhere',
            target: 1,
            cash: 250,
            xp: 8
        },
        {
            id: 'gift-love',
            kind: 'gift',
            label: 'Gift a paddy',
            target: 1,
            cash: 400,
            xp: 12
        },
        {
            id: 'light-bill',
            kind: 'nepa',
            label: 'Settle the NEPA bill',
            target: 1,
            cash: 350,
            xp: 10
        },
        {
            id: 'tax-clean',
            kind: 'tax',
            label: 'Clear your KGIRS tax',
            target: 1,
            cash: 450,
            xp: 12
        },
        {
            id: 'street-smart',
            kind: 'hustle',
            label: 'Finish a street hustle',
            target: 1,
            cash: 450,
            xp: 12
        },
        {
            id: 'shift-go',
            kind: 'job',
            label: 'Work a job shift',
            target: 1,
            cash: 400,
            xp: 12
        },
        {
            id: 'gist-time',
            kind: 'chat',
            label: 'Catch gist with an NPC',
            target: 2,
            cash: 300,
            xp: 10
        },
        {
            id: 'gym-day',
            kind: 'workout',
            label: 'Hit the gym',
            target: 1,
            cash: 300,
            xp: 10
        },
        {
            id: 'book-smart',
            kind: 'study',
            label: 'Study for an hour',
            target: 1,
            cash: 300,
            xp: 10
        },
        {
            id: 'bank-move',
            kind: 'deposit',
            label: 'Bank some money',
            target: 1,
            cash: 250,
            xp: 8
        },
        {
            id: 'double-waka',
            kind: 'travel',
            label: 'Make two journeys',
            target: 2,
            cash: 500,
            xp: 15
        }
    ]
};
const CHILL = {
    /** needs decay multiplier while chill is on */ decayMult: 0.5,
    /** weather mood hits multiply by this */ weatherMoodMult: 0.5,
    /** KGIRS warrant grace multiplier */ warrantGraceMult: 3,
    /** NEPA shedding grace multiplier */ sheddingGraceMult: 2
};
const SHIELD = {
    /** smart-skill XP multiplier for kid + teen (education-first) */ studyBoost: 1.25,
    /** the scammer game pays once per in-game day */ scammer: {
        baseCash: 150,
        streakBonus: 25,
        /** streak bonus stops growing here (the honest ceiling) */ streakCap: 10,
        smartXp: 8,
        mood: 2
    },
    /** kid-band chat: preset emotes only (no free lines, ever) */ kidEmotes: [
        {
            id: 'wave',
            glyph: '👋',
            label: 'Greet',
            reply: 'Ah, you dey greet! Blessings, pikin.',
            fam: 1
        },
        {
            id: 'smile',
            glyph: '😊',
            label: 'Smile',
            reply: 'That your smile na free medicine.',
            fam: 1
        },
        {
            id: 'fire',
            glyph: '🔥',
            label: 'Hype',
            reply: 'Haha! You too much!',
            fam: 2
        },
        {
            id: 'clap',
            glyph: '👏',
            label: 'Applaud',
            reply: 'Thank you my dear. God go bless you.',
            fam: 2
        },
        {
            id: 'pray',
            glyph: '🙏',
            label: 'Pray',
            reply: 'Amen o! You be correct pikin.',
            fam: 2
        },
        {
            id: 'fist',
            glyph: '✊',
            label: 'Solidarity',
            reply: 'One love! We dey together.',
            fam: 1
        }
    ]
};
const ELDER = {
    decayMult: 0.75,
    /** travel/working transitions breathe longer (× on the ms) */ transitionMult: 1.4
};
const FORTRESS = {
    /** the biggest single income event the city can honestly pay */ singleCeiling: 1_500_000,
    /** the most naira one in-game day may honestly earn */ dayCeiling: 3_000_000,
    /** transactions per clock slot before the flood gate shuts */ velocityCap: 24
};
const FESTIVALS = {
    /** the length of one Lokoja year, in game days */ yearDays: 72,
    /** year-day anchors (1-based). The Eid family shifts by the drift. */ anchors: {
        newYear: 1,
        /** Eid-el-Fitr — day 1 of 2 (Ramadan fast runs the 10 days before it) */ eidFitr: 13,
        eidFitrDays: 2,
        ramadanDays: 10,
        workersDay: 27,
        childrensDay: 30,
        regatta: 37,
        regattaDays: 2,
        democracyDay: 43,
        /** Eid-el-Kabir — the ram market runs the 3 days before it */ eidKabir: 51,
        eidKabirDays: 2,
        ramMarketDays: 3,
        newYam: 57,
        independenceDay: 59,
        /** Detty December — the year's last 9 days */ dettyStart: 64
    },
    /** the Islamic-calendar drift: the Eid family slides this far per year,
   *  deterministically, bounded so it can never collide with the Regatta
   *  or Detty December */ eidDriftStep: 3,
    eidDriftMod: 9,
    /** day-festival market folds (ride the SAME market roll as everything) */ marketMult: {
        ramadan: 0.95,
        eid: 1.06,
        regatta: 1.1,
        ramMarket: 1.04,
        newYam: 1.08,
        independence: 1.05,
        detty: 1.2
    },
    /** the returnees' city: Motor Park gigs pay these festival premiums */ fleetMult: {
        detty: 1.35,
        regatta: 1.25,
        independence: 1.2
    },
    /** morning mood gifts on festival days */ mood: {
        newYear: 3,
        eid: 4,
        workers: 1,
        children: 2,
        regatta: 2,
        democracy: 1,
        newYam: 2,
        independence: 3,
        detty: 2,
        wedding: 1
    },
    /** attending a festival in person: mood / reputation / seeded spray */ attend: {
        mood: 4,
        repFestivals: [
            'eid-fitr',
            'eid-kabir',
            'independence'
        ],
        rep: 2,
        sprayMin: 100,
        sprayMax: 800
    },
    /** the regatta: four neighbourhood boat teams a year */ regattaTeams: [
        'Ganaja Lightning',
        'Kpata Warriors',
        'Patti Eagles',
        'Adankolo Sharks'
    ],
    sponsorFee: 2000,
    sponsorWinPayout: 6000,
    sponsorWinRep: 8,
    sponsorLoseRep: 2,
    betTiers: [
        500,
        1000,
        2000
    ],
    betOdds: 2.5,
    /** ram market: base price × proximity ladder (day 1 → Eid-eve) */ ramBasePrice: 40000,
    ramLadder: [
        0.9,
        1.0,
        1.15
    ],
    ramWobble: 0.06,
    /** one ram butchers into this many meat packs to share */ meatPacksPerRam: 6,
    meatShareFamiliarity: 12,
    meatShareMood: 4,
    meatShareRep: 1,
    /** aso-ebi: the wedding fabric, bought at Kpata */ asoEbiPrice: 1500,
    /** wedding gift tiers + the rewards (aso-ebi doubles the respect) */ weddingGiftTiers: [
        500,
        1000,
        2000
    ],
    weddingMood: 8,
    weddingRep: 2,
    weddingRepAsoEbi: 4,
    /** a wedding every N days, seeded inside day 1–7 of the cycle */ weddingEvery: 9,
    weddingVenues: [
        'historic-lokoja',
        'confluence',
        'kpata-market'
    ],
    /** town-union paving: a project every N days, one zone, community pool */ pavingEvery: 14,
    pavingTarget: 10000,
    pavingNpcMin: 800,
    pavingNpcMax: 1800,
    pavingTiers: [
        500,
        1000,
        2500
    ],
    /** a finished street stays smooth this many days — journeys in ×cheaper */ pavedDays: 20,
    pavedMinutesMult: 0.85,
    pavedRep: 4,
    pavedMood: 2,
    /** Ramadan: the iftar blessing on an evening/night meal */ iftarMood: 3,
    /** Ramadan's quieter days deepen the night market's discount */ ramadanNightMult: 0.92,
    /** weddings are seeded from the streets' name pool */ coupleFirstNames: [
        'Musa',
        'Hauwa',
        'Emeka',
        'Ngozi',
        'Abubakar',
        'Zainab',
        'Chidi',
        'Amaka',
        'Sule',
        'Blessing',
        'Ibrahim',
        'Halima',
        'Tunde',
        'Funke',
        'Yakubu',
        'Rukayya'
    ]
};
const BIZ = {
    /** unclaimed income stops accruing after this many days — go show your shop */ accrualCapDays: 7,
    /** each owned business adds this share to the NEPA bill (fridges, freezers) */ nepaLoadPerBiz: 0.22,
    /** income bonus: +1% per `repBonusDivisor` reputation above 500, capped */ repBonusDivisor: 100,
    repBonusBase: 500,
    repBonusCap: 0.25,
    /** upgrade: cost = buyCost × upgradeCostMult × currentLevel */ upgradeCostMult: 0.6,
    /** income multiplier per level: ×(1 + levelIncomeStep × (level−1)) */ levelIncomeStep: 0.35,
    maxLevel: 5,
    /** non-market shops wobble inside this seeded daily band instead of a market mult */ wobbleBand: 0.08,
    /* ---- M5 — staff & power (the shop as a small enterprise) ---- */ /** each attendant lifts income by this share (+22% each) */ staffIncomeBoost: 0.22,
    /** every attendant draws this daily wage straight from the till */ staffWagePerDay: 400,
    /** one-time hiring fee per attendant */ staffHireFee: 2000,
    /** a shop caught dark by load-shedding (no power backup) earns this share */ sheddingIncomeFactor: 0.75,
    /** a solar shop's share of the normal per-shop NEPA load */ nepaLoadWithSolar: 0.08,
    /** one-time installs — the power ladder + their honest trade-offs */ upgrades: {
        generator: {
            label: 'Generator',
            emoji: '🔌',
            cost: 28000,
            blurb: 'When NEPA cuts the city, your shop still glows — no dark-day penalty.'
        },
        solar: {
            label: 'Solar system',
            emoji: '☀️',
            cost: 65000,
            blurb: 'Silent power: shedding penalty gone, and your NEPA meter load drops to almost nothing.'
        }
    },
    types: {
        'kpata-stall': {
            name: 'Kpata Provisions Stall',
            locationId: 'kpata-market',
            emoji: '🧺',
            buyCost: 18000,
            baseIncome: 1100,
            unlockLevel: 1,
            blurb: 'A wooden stall in the row under the Kpata sheds. Rice in bags, groundnut in bottles.',
            /** which market engine row moves this shop's prices (null = seeded wobble) */ marketId: 'kpata-market'
        },
        'ganaja-kiosk': {
            name: 'Ganaja Phone Kiosk',
            locationId: 'ganaja-junction',
            emoji: '📱',
            buyCost: 22000,
            baseIncome: 1250,
            unlockLevel: 2,
            blurb: 'Glass kiosk at Ganaja Junction — chargers, earpieces, transfer POS.',
            marketId: null,
            /** M8 — this shop runs a terminal: cash-scarcity days are its harvest */ pos: true
        },
        'okada-stand': {
            name: 'Motor-Park Okada Stand',
            locationId: 'transport-area',
            emoji: '🛵',
            buyCost: 30000,
            baseIncome: 1450,
            unlockLevel: 3,
            blurb: 'Two bikes on your stand at the motor park. Riders bring the day’s take at night.',
            marketId: null
        },
        'food-joint': {
            name: 'Food-Strip Buka',
            locationId: 'food-area',
            emoji: '🍲',
            buyCost: 42000,
            baseIncome: 1900,
            unlockLevel: 4,
            blurb: 'A buka of your own on the food strip — amala that makes people cross town.',
            marketId: 'food-area'
        }
    }
};
const FLEET = {
    /** gig offers per owned vehicle per day */ gigsPerModelPerDay: 2,
    /** hired runs pay above the counter fare (you are the driver — no park cut) */ payoutMult: 1.18,
    /** rain premium per model — okada rain runs are misery, and misery pays */ rainPayout: {
        okada: 1.4,
        keke: 1.22,
        taxi: 1.12,
        danfo: 1.12
    },
    /**
   * M6 — rough-sky bonus on top of the rain premium. A confluence
   * thunderstorm is rain turned to eleven; a flood day is the hardest
   * driving of the year. Stacks multiplicatively with rainPayout — the
   * M4 margin law (payout − fuel > 0) only gets wider as the sky darkens.
   */ roughSkyBonus: {
        storm: 1.3,
        flood: 1.6
    },
    /** player XP per completed run */ gigXp: 8,
    /** hustle-skill XP per completed run */ gigHustleXp: 6
};
const SOCIAL = {
    /** buyable gifts — familiarity jumps scale with the price tag */ gifts: [
        {
            id: 'recharge-card',
            label: 'Recharge card',
            emoji: '📞',
            cost: 500,
            familiarity: 8,
            note: '₦500 airtime — small but always welcome.'
        },
        {
            id: 'suya-night',
            label: 'Suya wrap',
            emoji: '🍢',
            cost: 1500,
            familiarity: 16,
            note: 'Evening suya from the night grill — paddies first.'
        },
        {
            id: 'ankara',
            label: 'Ankara fabric',
            emoji: '🧵',
            cost: 4000,
            familiarity: 28,
            note: 'Six yards of good Ankara — na real gift be that.'
        }
    ],
    /** mood the PLAYER feels after giving (generosity warms the giver too) */ giftMood: 4,
    /** hangout — pull a paddy out for the evening */ hangout: {
        /** what a night out with a paddy costs you (on top of your own fun) */ cost: 1000,
        /** mood hit for the pair of you */ mood: 8,
        /** familiarity the evening earns */ familiarity: 6,
        /** days before you can hang out with the SAME npc again */ cooldownDays: 3,
        /** hangouts happen after work hours only */ slots: [
            'evening',
            'night'
        ]
    },
    /** chance (0–1) a paddy (familiarity ≥ favourTier) drops real gist on a chat */ favorChance: 0.3,
    /** minimum familiarity before favours start passing your way */ favorTierMin: 40
};
const RIVERS = {
    /** the river's year, on the SAME 72-day clock as the festivals */ season: {
        /** year-day the rise begins (dry season before it) */ riseStart: 41,
        /** rise ends → the water sits at its peak (Lokoja's Sept–Oct) */ peakStart: 55,
        /** the recede begins */ recedeStart: 63,
        /** year-day the river is fully back in its banks */ dryBy: 71
    },
    /** per-day seeded wobble on the level (the river breathes) */ wobble: 0.05,
    /** the level a low-lying zone goes under water (deeper city = higher bar) */ cutAt: {
        confluence: 0.35,
        'ganaja-junction': 0.55,
        'kpata-market': 0.75
    },
    /** the Crusher sells sand on the Patti road — a sack costs this much */ sackPrice: 600,
    /** sacks of sand + patience per walkway segment */ sacksPerSegment: 2,
    /** energy to lay one segment (wading with sand on your head) */ layEnergy: 8,
    /** walkway segments needed before a zone's crossing opens */ segments: {
        confluence: 4,
        'ganaja-junction': 5,
        'kpata-market': 6
    },
    /** where the Crusher's sand is sold (the Patti road quarry trailhead) */ sandVendorZone: 'mount-patti',
    /** a finished walkway rides SLOW (careful steps on wet bags) — minutes ×this */ walkwayMinutesMult: 1.35,
    /** crossing tolls: what one pedestrian pays (the player picks the tier) */ tollTiers: [
        30,
        60,
        120
    ],
    /** seeded NPC crossings/day band at full surge (scales with the level) */ tollCrossingsMin: 8,
    tollCrossingsMax: 26,
    /** the fishermen's price for a canoe of your own */ canoeCost: 18000,
    /** the ferry fare: counter fare × (fareMult + levelPremium × level) */ ferryFareMult: 2.2,
    ferryLevelPremium: 0.8,
    /** running a ferry gig costs this energy + one clock slot */ ferryEnergy: 10,
    /** ferry gigs a day (only while some zone is cut) */ ferryGigsPerDay: 2,
    /** the ferry jetty — where the canoes wait (the buses stop here) */ jettyId: 'transport-area',
    /** the return jetty inside a cut zone rows you back here */ cutReturnId: 'transport-area',
    /** the cold-room rescue: the deep surge's co-op quest */ rescue: {
        /** the level that wakes the rescue (the ice fish sellers start praying) */ triggerLevel: 0.7,
        /** the zone whose cold rooms need saving (Kpata's frozen stock) */ zoneId: 'kpata-market',
        /** pool target before the trucks roll */ poolTarget: 8000,
        npcMin: 600,
        npcMax: 1400,
        /** player contribution tiers (once/day, in person) */ tiers: [
            500,
            1000,
            2000
        ],
        /** a saved zone earns this share of normal income through the surge */ savedIncomeFactor: 0.9,
        /** a drowning zone earns this share (stock spoiling in the damp) */ floodIncomeFactor: 0.5,
        /** the street's thanks when the stock reaches high ground */ repReward: 4,
        moodReward: 3
    },
    /** market fold: the water lifts prices (supply cut) — ×(1 + perLevel × level) */ marketMultPerLevel: 0.25,
    marketMultCap: 1.25,
    /** living in the damp: daily mood cost when the river holds above this */ dampLevel: 0.55,
    dampMoodHit: 2,
    /** the day the river walks back into its banks, the city breathes */ reliefBelow: 0.35,
    reliefMood: 3
};
const LADDER = {
    education: {
        /** FUL enrollment: the fee, the level, the semester clock */ enrollFee: 25000,
        enrollLevel: 2,
        semesterDays: 18,
        examDays: 3,
        /** lectures a semester expects (the exam reads them) */ lecturesNeeded: 12,
        /** one lecture: smart-skill XP + the tutorial stipend */ lectureSmartXp: 12,
        lectureStipend: 150,
        /** the exam's honest bar: smart + lectures × 0.5 ≥ this */ examPassScore: 8,
        semestersToGraduate: 4,
        convocationInDays: 2,
        graduateRep: 12,
        graduateMood: 10,
        /** the Dean's hustle grant: 8 lectures in one semester pays once */ deansGrant: 2000,
        deansGrantRep: 3,
        deansLectures: 8,
        /** ASUU: the strike chance per semester + the length band */ strikeChance: 0.3,
        strikeMinDays: 5,
        strikeMaxDays: 8,
        /** the strike lands on this lecture-day of the semester */ strikeStartDay: 7
    },
    housing: {
        rentCycleDays: 6,
        baseRent: 900,
        lateFee: 400,
        /** chance a rent cycle lands the landlord's wahala */ wahalaChance: 0.35,
        properties: [
            {
                id: 'family-room',
                name: 'Family Room — Adankolo',
                locationId: 'university-area',
                price: 85000,
                level: 3,
                comfort: 1
            },
            {
                id: 'self-contain',
                name: 'Self-Contain — Ganaja',
                locationId: 'ganaja-junction',
                price: 180000,
                level: 5,
                comfort: 2
            },
            {
                id: 'flat-gra',
                name: 'Two-Bedroom Flat — GRA',
                locationId: 'government-area',
                price: 420000,
                level: 7,
                comfort: 3
            },
            {
                id: 'duplex',
                name: 'Duplex — Adankolo Layout',
                locationId: 'university-area',
                price: 950000,
                level: 9,
                comfort: 5
            }
        ],
        furnishTiers: [
            {
                tier: 1,
                cost: 15000,
                label: 'Fan + curtains',
                mood: 1
            },
            {
                tier: 2,
                cost: 40000,
                label: 'Generator + TV',
                mood: 2
            },
            {
                tier: 3,
                cost: 90000,
                label: 'Full AC + solar',
                mood: 3
            }
        ],
        /** the sleep law: +this energy per comfort point */ sleepEnergyPerComfort: 3
    },
    japa: {
        unlockLevel: 8,
        nimcFee: 3000,
        nimcQueueDays: 1,
        passportFee: 25000,
        passportQueueDays: 3,
        /** the street agent: cheaper, faster, and sometimes a wash */ agentFee: 12000,
        agentRealChance: 0.6,
        agentRepHit: 3,
        policeFee: 5000,
        ticketFee: 150000,
        repReward: 15,
        moodReward: 15,
        /** the morning after the send-off: the first remittance lands */ remittance: 50000
    },
    mopol: {
        /** police shifts before the escort detail trusts you */ shiftsToUnlock: 5,
        /** the detail runs every Nth day */ escortEvery: 3,
        escortPay: 8000,
        escortRep: 3,
        /** the siren: the next journeys ride ×this minutes while it lasts */ sirenMinutesMult: 0.8,
        sirenDays: 2
    }
};
const PULSE = {
    /** street credit (rep) a real share pays — once per in-game day */ shareStreetCredit: 2,
    /** the cooldown key on player.cooldowns (value = the in-game day it last paid) */ shareCooldownKey: 'pulse-share',
    /** the arrival book's cap (oldest postcards fall off) */ arrivalCap: 20
};
}),
"[project]/src/game/systems/calendar.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M10: THE LIVING CALENDAR (pure rules)
 * ----------------------------------------------------
 * Lokoja runs on a 72-day year, and the year has a heartbeat:
 *   - The Confluence Regatta (the signature): four neighbourhood boat
 *     teams, shoreline crowds, naira spraying — sponsor a crew, back a
 *     boat, stand in the crowd.
 *   - The Eid family drifts a little every year (the Islamic calendar
 *     never sits still): the Ramadan fast, Eid-el-Fitr, the ram market,
 *     Eid-el-Kabir — buy a ram, butcher it, share the meat around.
 *   - The national days (Workers, Children, Democracy, Independence),
 *     New Yam, New Year, and Detty December when the returnees flood
 *     the city and every price knows it.
 *   - A wedding in somebody's compound every nine days — aso-ebi at
 *     Kpata, gift at the door, respect at the canopy.
 *   - The town union paving one street every fourteen days — gather the
 *     pool, and journeys into that zone ride a smooth road for a season.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (day, state) → same answer. Every
 *    "random" number is a hash of stable inputs — tests and replays
 *    can trust the year.
 *  - The SCHEDULE is derived from the day counter alone — zero state,
 *    reload-proof by construction. Only PARTICIPATION persists
 *    (meat packs, stakes, aso-ebi, attended lists, the paving pool).
 *  - The Eid family drifts ±4 year-days per year, deterministically —
 *    far enough to feel alive, never far enough to collide with the
 *    Regatta or New Yam.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the
 *    UI only reads them. Every naira constant lives in config.FESTIVALS.
 */ __turbopack_context__.s([
    "PAVING_ZONE_IDS",
    ()=>PAVING_ZONE_IDS,
    "absoluteDayOf",
    ()=>absoluteDayOf,
    "attendSprayFor",
    ()=>attendSprayFor,
    "attendWeddingApply",
    ()=>attendWeddingApply,
    "betApply",
    ()=>betApply,
    "buyAsoEbiApply",
    ()=>buyAsoEbiApply,
    "buyRamApply",
    ()=>buyRamApply,
    "calendarDayRoll",
    ()=>calendarDayRoll,
    "calendarFleetMult",
    ()=>calendarFleetMult,
    "calendarMarketMult",
    ()=>calendarMarketMult,
    "canAttendFestival",
    ()=>canAttendFestival,
    "canAttendWedding",
    ()=>canAttendWedding,
    "canBet",
    ()=>canBet,
    "canBuyAsoEbi",
    ()=>canBuyAsoEbi,
    "canBuyRam",
    ()=>canBuyRam,
    "canContributePaving",
    ()=>canContributePaving,
    "canShareMeat",
    ()=>canShareMeat,
    "canSponsor",
    ()=>canSponsor,
    "contributePavingApply",
    ()=>contributePavingApply,
    "eidDriftForYear",
    ()=>eidDriftForYear,
    "festivalForDay",
    ()=>festivalForDay,
    "freshCalendarState",
    ()=>freshCalendarState,
    "inDetty",
    ()=>inDetty,
    "inMeatSeason",
    ()=>inMeatSeason,
    "inRamadan",
    ()=>inRamadan,
    "isIftarHour",
    ()=>isIftarHour,
    "isPaved",
    ()=>isPaved,
    "nextFestivalFrom",
    ()=>nextFestivalFrom,
    "pavedMinutesMult",
    ()=>pavedMinutesMult,
    "pavingCycleOf",
    ()=>pavingCycleOf,
    "pavingNpcFlowFor",
    ()=>pavingNpcFlowFor,
    "pavingZoneFor",
    ()=>pavingZoneFor,
    "ramMarketDayIndex",
    ()=>ramMarketDayIndex,
    "ramPriceFor",
    ()=>ramPriceFor,
    "regattaResultDay",
    ()=>regattaResultDay,
    "regattaTeamsFor",
    ()=>regattaTeamsFor,
    "regattaWinnerFor",
    ()=>regattaWinnerFor,
    "setDebugYearDay",
    ()=>setDebugYearDay,
    "shareMeatApply",
    ()=>shareMeatApply,
    "sponsorApply",
    ()=>sponsorApply,
    "weddingForCycle",
    ()=>weddingForCycle,
    "wrapDay",
    ()=>wrapDay,
    "yearDayOf",
    ()=>yearDayOf,
    "yearOf",
    ()=>yearOf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
;
;
function freshCalendarState() {
    return {
        day: 0,
        meatPacks: 0,
        meatShares: [],
        sponsored: [],
        bets: [],
        asoEbi: [],
        attended: [],
        paved: [],
        paving: null,
        stats: {
            festivalsAttended: 0,
            ramsBought: 0,
            meatShared: 0,
            regattaWins: 0,
            weddings: 0,
            projectsDone: 0
        }
    };
}
/* ------------------------------ debug override ----------------------------- */ /**
 * An E2E/debug override for the year-day reading (1–72). Set ONLY through
 * the __lkl hook — normal play never touches it. When set, every calendar
 * law (festivals, Ramadan, Detty, ram prices, weddings) reads this
 * year-day instead of deriving one from the world clock.
 */ let debugYearDay = null;
function setDebugYearDay(n) {
    debugYearDay = n !== null ? Math.max(1, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays, Math.round(n))) : null;
}
/* ------------------------------- the year laws ------------------------------ */ const A = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].anchors;
function yearOf(day) {
    return Math.floor((day - 1) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays) + 1;
}
function yearDayOf(day) {
    if (debugYearDay !== null) return debugYearDay;
    return (day - 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + 1;
}
function absoluteDayOf(year, yearDay) {
    return (year - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + yearDay;
}
function eidDriftForYear(year) {
    return (year - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].eidDriftStep % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].eidDriftMod - (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].eidDriftMod - 1) / 2;
}
const unit = (...nums)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])(...nums) / 0xffffffff;
/** Is `yearDay` inside the wrapped window [start, start+len)? */ function inWindow(yearDay, start, len) {
    for(let i = 0; i < len; i++){
        if (wrapDay(start + i) === yearDay) return true;
    }
    return false;
}
function wrapDay(n) {
    return ((n - 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays + 1;
}
function inRamadan(day) {
    const yd = yearDayOf(day);
    const start = A.eidFitr - A.ramadanDays + eidDriftForYear(yearOf(day));
    return inWindow(yd, start, A.ramadanDays);
}
function inDetty(day) {
    return yearDayOf(day) >= A.dettyStart;
}
function ramMarketDayIndex(day) {
    const yd = yearDayOf(day);
    const start = A.eidKabir - A.ramMarketDays + eidDriftForYear(yearOf(day));
    for(let i = 0; i < A.ramMarketDays; i++){
        if (wrapDay(start + i) === yd) return i + 1;
    }
    return 0;
}
/**
 * The attendable day-festivals, in year order. The Eid pair shifts with
 * the drift; everything else holds its anchor. `len` counts days.
 */ function festivalDefsForYear(year) {
    const d = eidDriftForYear(year);
    return [
        {
            id: 'new-year',
            name: 'New Year',
            icon: '🎆',
            venueId: 'confluence',
            start: A.newYear,
            len: 1,
            note: 'Cross-over night crowd dey outside — the year don open.'
        },
        {
            id: 'eid-fitr',
            name: 'Eid-el-Fitr',
            icon: '🌙',
            venueId: 'historic-lokoja',
            start: A.eidFitr + d,
            len: A.eidFitrDays,
            note: 'The fast don complete — Ramadan blessings for everybody.'
        },
        {
            id: 'workers',
            name: "Workers' Day",
            icon: '🔨',
            venueId: 'government-area',
            start: A.workersDay,
            len: 1,
            note: 'The unions dey march — every hustle get value today.'
        },
        {
            id: 'children',
            name: "Children's Day",
            icon: '🎈',
            venueId: 'university-area',
            start: A.childrensDay,
            len: 1,
            note: 'The young ones own the streets today.'
        },
        {
            id: 'regatta',
            name: 'Confluence Regatta',
            icon: '🚤',
            venueId: 'confluence',
            start: A.regatta,
            len: A.regattaDays,
            note: 'Boat teams on the water, naira dey spray for shoreline.'
        },
        {
            id: 'democracy',
            name: 'Democracy Day',
            icon: '🗳️',
            venueId: 'government-area',
            start: A.democracyDay,
            len: 1,
            note: 'The town dey argue politics small small — join the gist.'
        },
        {
            id: 'eid-kabir',
            name: 'Eid-el-Kabir',
            icon: '🐏',
            venueId: 'historic-lokoja',
            start: A.eidKabir + d,
            len: A.eidKabirDays,
            note: 'Sallah! Meat dey share around every compound.'
        },
        {
            id: 'new-yam',
            name: 'New Yam Festival',
            icon: '🍠',
            venueId: 'historic-lokoja',
            start: A.newYam,
            len: 1,
            note: 'The first yam of the season don land — come chop.'
        },
        {
            id: 'independence',
            name: 'Independence Day',
            icon: '🇳🇬',
            venueId: 'government-area',
            start: A.independenceDay,
            len: 1,
            note: 'Green-white-green everywhere — Lokoja dey proud today.'
        },
        {
            id: 'detty',
            name: 'Detty December',
            icon: '🎉',
            venueId: 'food-area',
            start: A.dettyStart,
            len: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays - A.dettyStart + 1,
            note: 'Returnees don land — the city shine, price dey shine too.'
        }
    ];
}
function festivalForDay(day) {
    const yd = yearDayOf(day);
    const year = yearOf(day);
    for (const f of festivalDefsForYear(year)){
        for(let i = 0; i < f.len; i++){
            if (wrapDay(f.start + i) === yd) {
                return {
                    id: f.id,
                    name: f.name,
                    icon: f.icon,
                    venueId: f.venueId,
                    dayOfYear: wrapDay(f.start),
                    daysLeft: f.len - i,
                    note: f.note
                };
            }
        }
    }
    return null;
}
function nextFestivalFrom(day) {
    for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].yearDays; i++){
        const d = day + i;
        const f = festivalForDay(d);
        if (f) return {
            festival: f,
            inDays: i
        };
    }
    // unreachable — the year always contains a festival
    return {
        festival: festivalForDay(day),
        inDays: 0
    };
}
function calendarMarketMult(day) {
    let m = 1;
    if (inRamadan(day)) m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.ramadan;
    if (inDetty(day)) m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.detty;
    const rm = ramMarketDayIndex(day);
    if (rm > 0) m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.ramMarket;
    const f = festivalForDay(day);
    if (f) {
        if (f.id === 'eid-fitr' || f.id === 'eid-kabir') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.eid;
        else if (f.id === 'regatta') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.regatta;
        else if (f.id === 'new-yam') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.newYam;
        else if (f.id === 'independence') m *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].marketMult.independence;
    }
    return m;
}
function calendarFleetMult(day) {
    if (inDetty(day)) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].fleetMult.detty;
    const f = festivalForDay(day);
    if (f?.id === 'regatta') return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].fleetMult.regatta;
    if (f?.id === 'independence') return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].fleetMult.independence;
    return 1;
}
function isIftarHour(day, timeOfDay) {
    return inRamadan(day) && (timeOfDay === 'evening' || timeOfDay === 'night');
}
function regattaTeamsFor(_year) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].regattaTeams;
}
function regattaWinnerFor(year) {
    const teams = regattaTeamsFor(year);
    return teams[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('regatta', year) % teams.length];
}
function regattaResultDay(year) {
    return absoluteDayOf(year, A.regatta + A.regattaDays);
}
function attendSprayFor(day, festivalId) {
    const u = unit('spray', day, festivalId);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.sprayMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.sprayMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].attend.sprayMin)) / 10) * 10;
}
function ramPriceFor(day) {
    const idx = ramMarketDayIndex(day);
    if (idx === 0) return 0;
    const ladder = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].ramLadder[Math.min(idx - 1, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].ramLadder.length - 1)];
    const u = unit('ram', day);
    const wobble = 1 + (u * 2 - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].ramWobble;
    return Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].ramBasePrice * ladder * wobble / 100) * 100;
}
function weddingForCycle(day) {
    const every = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingEvery;
    let cycle = Math.floor((day - 1) / every);
    const offsetFor = (c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('wedding-day', c) % 7;
    const weddingDayFor = (c)=>c * every + 1 + offsetFor(c);
    // if this cycle's wedding already passed, show the next one
    if (day > weddingDayFor(cycle)) cycle += 1;
    const weddingDay = weddingDayFor(cycle);
    const venueId = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingVenues[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('wedding-venue', cycle) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].weddingVenues.length];
    const names = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].coupleFirstNames;
    const a = names[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('wedding-a', cycle) % names.length];
    let bi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('wedding-b', cycle) % names.length;
    if (names[bi] === a) bi = (bi + 1) % names.length;
    const b = names[bi];
    return {
        id: `w${cycle}`,
        couple: `${a} & ${b}`,
        venueId,
        day: weddingDay,
        isToday: weddingDay === day,
        inDays: Math.max(0, weddingDay - day)
    };
}
/* ----------------------------- the paving season ---------------------------- */ /** The zones the town union paves — the 10 launch districts. */ const PAVING_ZONES = [
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
const PAVING_ZONE_IDS = PAVING_ZONES;
function pavingZoneFor(cycle) {
    return PAVING_ZONES[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('paving-zone', cycle) % PAVING_ZONES.length];
}
function pavingNpcFlowFor(cycle, day) {
    const u = unit('paving-flow', cycle, day);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingNpcMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingNpcMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingNpcMin)) / 10) * 10;
}
function pavingCycleOf(day) {
    return Math.floor((day - 1) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingEvery);
}
function isPaved(cal, day, zoneId) {
    return cal.paved.some((r)=>r.zoneId === zoneId && day <= r.untilDay);
}
function pavedMinutesMult(cal, day, destId) {
    return isPaved(cal, day, destId) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavedMinutesMult : 1;
}
function calendarDayRoll(cal, day) {
    if (day <= cal.day) {
        return {
            next: cal,
            pavingDone: null,
            pavingStalled: null,
            regattaResult: null
        };
    }
    let next = {
        ...cal,
        day
    };
    let pavingDone = null;
    let pavingStalled = null;
    let regattaResult = null;
    /* ---- the paving project lifecycle ---- */ const cycle = pavingCycleOf(day);
    const cycleStartDay = cycle * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingEvery + 1;
    let paving = next.paving ? {
        ...next.paving,
        contribDays: [
            ...next.paving.contribDays
        ]
    } : null;
    if (paving && paving.cycle !== cycle) {
        // a new cycle started and the old pool never filled — the union pauses
        pavingStalled = {
            zoneId: paving.zoneId
        };
        paving = null;
    }
    if (!paving && day === cycleStartDay) {
        // a fresh project breaks ground ONLY on its cycle's first day — one
        // project per season, even if an earlier one finished early
        paving = {
            cycle,
            zoneId: pavingZoneFor(cycle),
            pool: 0,
            contribDays: []
        };
    }
    // yesterday's community coins (only inside the project's own cycle)
    const yesterday = day - 1;
    if (paving && pavingCycleOf(yesterday) === cycle) {
        paving = {
            ...paving,
            pool: paving.pool + pavingNpcFlowFor(cycle, yesterday)
        };
    }
    if (paving && paving.pool >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavingTarget) {
        next.paved = [
            ...next.paved.filter((r)=>day <= r.untilDay),
            {
                zoneId: paving.zoneId,
                untilDay: day + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].pavedDays - 1
            }
        ];
        next.stats = {
            ...next.stats,
            projectsDone: next.stats.projectsDone + 1
        };
        pavingDone = {
            zoneId: paving.zoneId
        };
        paving = null;
    }
    next.paving = paving;
    /* ---- the regatta's morning after ---- */ const year = yearOf(day);
    if (day === regattaResultDay(year)) {
        const winner = regattaWinnerFor(year);
        const sponsored = next.sponsored.filter((s)=>s.year <= year);
        const bets = next.bets.filter((b)=>b.year <= year);
        let sponsorWin = null;
        let sponsorLose = null;
        let betWin = null;
        let betLose = 0;
        for (const s of sponsored){
            if (s.teamId === winner) sponsorWin = {
                teamId: s.teamId,
                payout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].sponsorWinPayout
            };
            else sponsorLose = s.teamId;
        }
        for (const b of bets){
            if (b.teamId === winner) betWin = {
                teamId: b.teamId,
                payout: Math.round(b.amount * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].betOdds)
            };
            else betLose += b.amount;
        }
        if (sponsored.length > 0 || bets.length > 0) {
            regattaResult = {
                year,
                winner,
                sponsorWin,
                sponsorLose,
                betWin,
                betLose
            };
            next.sponsored = next.sponsored.filter((s)=>s.year > year);
            next.bets = next.bets.filter((b)=>b.year > year);
            if (sponsorWin) next.stats = {
                ...next.stats,
                regattaWins: next.stats.regattaWins + 1
            };
        }
    }
    /* ---- housekeeping: expire old paved records, prune share keys ---- */ if (next.paved.length > 0) next.paved = next.paved.filter((r)=>day <= r.untilDay + 1);
    if (next.meatShares.length > 60) next.meatShares = next.meatShares.slice(-60);
    if (next.attended.length > 60) next.attended = next.attended.slice(-60);
    return {
        next,
        pavingDone,
        pavingStalled,
        regattaResult
    };
}
function canAttendFestival(cal, day, locationId) {
    const festival = festivalForDay(day);
    if (!festival) return {
        ok: false,
        why: 'No festival today.',
        festival: null
    };
    if (locationId !== festival.venueId) return {
        ok: false,
        why: 'The party is at another venue.',
        festival
    };
    if (cal.attended.includes(`${day}:${festival.id}`)) return {
        ok: false,
        why: 'You don already attend today — enjoy the street.',
        festival
    };
    return {
        ok: true,
        why: '',
        festival
    };
}
function inMeatSeason(day) {
    const yd = yearDayOf(day);
    const d = eidDriftForYear(yearOf(day));
    const start = A.eidKabir - A.ramMarketDays + d;
    const end = A.eidKabir + d + A.eidKabirDays - 1;
    // both ends wrap inside a 72-day year and the whole span (≤9 days)
    // never crosses more than one wrap — walk it
    for(let i = 0; i <= end - start; i++){
        if (wrapDay(start + i) === yd) return true;
    }
    return false;
}
function canShareMeat(cal, day, npcId) {
    if (cal.meatPacks < 1) return {
        ok: false,
        why: 'You no get meat pack — go buy ram at the ram market.'
    };
    if (!inMeatSeason(day)) return {
        ok: false,
        why: 'Meat sharing na Sallah season thing.'
    };
    const year = yearOf(day);
    if (cal.meatShares.includes(`${year}:${npcId}`)) return {
        ok: false,
        why: 'You don share meat for this paddy this Eid.'
    };
    return {
        ok: true,
        why: ''
    };
}
function shareMeatApply(cal, day, npcId) {
    const year = yearOf(day);
    return {
        ...cal,
        meatPacks: cal.meatPacks - 1,
        meatShares: [
            ...cal.meatShares,
            `${year}:${npcId}`
        ],
        stats: {
            ...cal.stats,
            meatShared: cal.stats.meatShared + 1
        }
    };
}
function canBuyRam(day, locationId, cash) {
    const price = ramPriceFor(day);
    if (ramMarketDayIndex(day) === 0) return {
        ok: false,
        why: 'The ram market no dey today.',
        price: 0
    };
    if (locationId !== 'kpata-market') return {
        ok: false,
        why: 'The rams dey Kpata market.',
        price
    };
    if (cash < price) return {
        ok: false,
        why: `You need ${price} naira for this ram.`,
        price
    };
    return {
        ok: true,
        why: '',
        price
    };
}
function buyRamApply(cal) {
    return {
        ...cal,
        meatPacks: cal.meatPacks + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].meatPacksPerRam,
        stats: {
            ...cal.stats,
            ramsBought: cal.stats.ramsBought + 1
        }
    };
}
function canSponsor(cal, day, locationId, teamId) {
    const f = festivalForDay(day);
    if (!f || f.id !== 'regatta') return {
        ok: false,
        why: 'Sponsorship opens at the Regatta.'
    };
    if (locationId !== 'confluence') return {
        ok: false,
        why: 'You must stand at the Confluence shoreline.'
    };
    const year = yearOf(day);
    if (cal.sponsored.some((s)=>s.year === year)) return {
        ok: false,
        why: 'You don sponsor a team this year — stand by am.'
    };
    if (!regattaTeamsFor(year).includes(teamId)) return {
        ok: false,
        why: 'That crew no dey race this year.'
    };
    return {
        ok: true,
        why: ''
    };
}
function sponsorApply(cal, day, teamId) {
    const year = yearOf(day);
    return {
        ...cal,
        sponsored: [
            ...cal.sponsored,
            {
                year,
                teamId
            }
        ]
    };
}
function canBet(cal, day, locationId, ageBand) {
    const f = festivalForDay(day);
    if (!f || f.id !== 'regatta' || f.daysLeft !== A.regattaDays) return {
        ok: false,
        why: 'Bets close before the race — day one only.'
    };
    if (locationId !== 'confluence') return {
        ok: false,
        why: 'You must stand at the Confluence shoreline.'
    };
    // M13 — THE FAMILY SHIELD: race-eve betting is crime-adjacent — 18+ only.
    if (ageBand !== 'adult') return {
        ok: false,
        why: 'Betting na 18+ — small paddies dey sponsor team, that one better pass.'
    };
    const year = yearOf(day);
    if (cal.bets.some((b)=>b.year === year)) return {
        ok: false,
        why: 'One bet per year — you don carry stake already.'
    };
    return {
        ok: true,
        why: ''
    };
}
function betApply(cal, day, teamId, amount) {
    const year = yearOf(day);
    return {
        ...cal,
        bets: [
            ...cal.bets,
            {
                year,
                teamId,
                amount
            }
        ]
    };
}
function canBuyAsoEbi(cal, day, locationId, wedding) {
    if (locationId !== 'kpata-market') return {
        ok: false,
        why: 'The fabric dey Kpata market.'
    };
    if (wedding.inDays > 2 && !wedding.isToday) return {
        ok: false,
        why: 'Aso-ebi opens two days to the wedding.'
    };
    if (cal.asoEbi.includes(wedding.id)) return {
        ok: false,
        why: 'You don already buy this wedding aso-ebi.'
    };
    return {
        ok: true,
        why: ''
    };
}
function buyAsoEbiApply(cal, weddingId) {
    return {
        ...cal,
        asoEbi: [
            ...cal.asoEbi,
            weddingId
        ]
    };
}
function canAttendWedding(cal, locationId, wedding) {
    if (!wedding.isToday) return {
        ok: false,
        why: 'The wedding no dey today.'
    };
    if (locationId !== wedding.venueId) return {
        ok: false,
        why: 'The canopies dey another compound.'
    };
    if (cal.attended.includes(wedding.id)) return {
        ok: false,
        why: 'You don attend — the couple don see you.'
    };
    return {
        ok: true,
        why: ''
    };
}
function attendWeddingApply(cal, weddingId) {
    return {
        ...cal,
        attended: [
            ...cal.attended,
            weddingId
        ],
        stats: {
            ...cal.stats,
            weddings: cal.stats.weddings + 1
        }
    };
}
function canContributePaving(cal, day, locationId) {
    const p = cal.paving;
    if (!p) return {
        ok: false,
        why: 'No paving project today.'
    };
    if (p.zoneId !== locationId) return {
        ok: false,
        why: 'The project dey another zone — go there in person.'
    };
    if (p.contribDays.includes(day)) return {
        ok: false,
        why: 'You don give today — the union dey grateful.'
    };
    return {
        ok: true,
        why: ''
    };
}
function contributePavingApply(cal, day, amount) {
    if (!cal.paving) return cal;
    return {
        ...cal,
        paving: {
            ...cal.paving,
            pool: cal.paving.pool + amount,
            contribDays: [
                ...cal.paving.contribDays,
                day
            ]
        }
    };
}
}),
"[project]/src/game/systems/seasons.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M6: LIVING WORLD (pure weather laws)
 * ---------------------------------------------------
 * The sky beyond rain. Harmattan dust off the Sahara, confluence
 * thunderstorms and the Niger/Benue flood days are REAL Lokoja weather,
 * and the whole city answers to them: journeys slow, food prices climb,
 * the riverfront closes, and misery on the road pays the riders extra.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (weather, day, location) → same answer.
 *    No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every constant lives in config (TIME.WEATHER_META, CIVIC.nightMarket,
 *    FLEET.roughSkyBonus, SOCIAL) — nothing hard-coded.
 *  - A weather day is ONE day: the roll happens once (systems/world.ts),
 *    everything here derives from the weather value itself. Reload-proof
 *    by construction — no extra state to persist.
 */ __turbopack_context__.s([
    "FLOODED_LOCATION_IDS",
    ()=>FLOODED_LOCATION_IDS,
    "NIGHT_MARKET_LOCATION_ID",
    ()=>NIGHT_MARKET_LOCATION_ID,
    "isHeavySky",
    ()=>isHeavySky,
    "isNightMarketOpen",
    ()=>isNightMarketOpen,
    "isRainSky",
    ()=>isRainSky,
    "mealAvailableAt",
    ()=>mealAvailableAt,
    "nightMarketMultFor",
    ()=>nightMarketMultFor,
    "nightMealPrice",
    ()=>nightMealPrice,
    "weatherBlocksLocation",
    ()=>weatherBlocksLocation,
    "weatherMarketMult",
    ()=>weatherMarketMult,
    "weatherMinutesMult",
    ()=>weatherMinutesMult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-route] (ecmascript)");
;
;
;
/* ------------------------------ the rain family ----------------------------- */ /**
 * The wet-sky family: plain rain, a confluence thunderstorm and a flood
 * day all read as "rain" to the systems that already respect it — rain
 * premiums, rain audio, rain particles. One family, three intensities.
 */ const RAIN_FAMILY = new Set([
    'rain',
    'storm',
    'flood'
]);
function isRainSky(weather) {
    return RAIN_FAMILY.has(weather);
}
function isHeavySky(weather) {
    return weather === 'storm' || weather === 'flood';
}
const FLOODED_LOCATION_IDS = [
    'confluence'
];
function weatherBlocksLocation(weather, locationId) {
    return weather === 'flood' && FLOODED_LOCATION_IDS.includes(locationId);
}
function weatherMinutesMult(weather, transport) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TRAVEL"].weatherMinutesMultiplier[weather]?.[transport] ?? 1;
}
function weatherMarketMult(weather) {
    switch(weather){
        case 'harmattan':
            return 1.08;
        case 'storm':
            return 1.15;
        case 'flood':
            return 1.3;
        default:
            return 1;
    }
}
function isNightMarketOpen(timeOfDay) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.opensAt.includes(timeOfDay);
}
const NIGHT_MARKET_LOCATION_ID = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.locationId;
function nightMarketMultFor(day) {
    const u = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('night-mkt', day) / 0xffffffff;
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.minMult + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.maxMult - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nightMarket.minMult);
    return base * ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inRamadan"])(day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FESTIVALS"].ramadanNightMult : 1);
}
function nightMealPrice(base, day) {
    return Math.max(10, Math.round(base * nightMarketMultFor(day) / 10) * 10);
}
function mealAvailableAt(mealNight, locationId, timeOfDay) {
    if (!mealNight) return true;
    return locationId === NIGHT_MARKET_LOCATION_ID && isNightMarketOpen(timeOfDay);
}
}),
"[project]/src/game/systems/civic.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M2: the civic mesh (pure rules)
 * ----------------------------------------------
 * The state machinery: NEPA bills that really post, KGIRS taxes that really
 * assess what you EARNED, a warrant that really escalates to the police,
 * whistleblower tips that really pay, and a market whose prices really
 * breathe day by day.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, day) → same outcome. Every
 *    "random" number is a hash of stable inputs (day / tip id), so tests
 *    and replays can trust the world.
 *  - No store, no React, no DOM — the store EXECUTES these rules and the
 *    UI only reads them.
 *  - Every naira constant lives in config.CIVIC — nothing is hard-coded.
 */ __turbopack_context__.s([
    "civicDayRoll",
    ()=>civicDayRoll,
    "civicHash",
    ()=>civicHash,
    "efccDayRoll",
    ()=>efccDayRoll,
    "efccFileTip",
    ()=>efccFileTip,
    "efccRewardFor",
    ()=>efccRewardFor,
    "freshCivicState",
    ()=>freshCivicState,
    "isMarketDay",
    ()=>isMarketDay,
    "kgirsApplyPayment",
    ()=>kgirsApplyPayment,
    "kgirsDayRoll",
    ()=>kgirsDayRoll,
    "kgirsSettleCost",
    ()=>kgirsSettleCost,
    "marketDayRoll",
    ()=>marketDayRoll,
    "marketEventFor",
    ()=>marketEventFor,
    "marketForDay",
    ()=>marketForDay,
    "marketMealPrice",
    ()=>marketMealPrice,
    "nepaApplyPayment",
    ()=>nepaApplyPayment,
    "nepaBillDueToday",
    ()=>nepaBillDueToday,
    "nepaBillFor",
    ()=>nepaBillFor,
    "nepaDayRoll",
    ()=>nepaDayRoll,
    "nepaSettleCost",
    ()=>nepaSettleCost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-route] (ecmascript)");
;
;
function civicHash(...nums) {
    let h = 0x811c9dc5;
    const mix = (v)=>{
        h ^= v & 0xff;
        h = Math.imul(h, 0x01000193);
        h ^= v >>> 8 & 0xff;
        h = Math.imul(h, 0x01000193);
    };
    for (const n of nums){
        if (typeof n === 'number') {
            mix(n);
            mix(n >>> 8);
            mix(n >>> 16);
            mix(n >>> 24);
        } else {
            for(let i = 0; i < n.length; i++)mix(n.charCodeAt(i));
        }
    }
    return h >>> 0;
}
/** deterministic 0..1 from the hash */ const unit = (...nums)=>civicHash(...nums) / 0xffffffff;
function freshCivicState() {
    return {
        nepa: {
            cycleStart: 1,
            owed: 0,
            paidThrough: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nepa.cycleDays,
            shedding: false,
            totalPaid: 0
        },
        kgirs: {
            lastSeenEarned: 0,
            assessed: 0,
            dueDay: 0,
            paid: 0,
            warrant: false
        },
        police: {
            fines: 0,
            paid: 0
        },
        efcc: {
            pending: [],
            rewardsTotal: 0,
            lastTipDay: -99
        },
        market: {
            rolledDay: 0,
            prices: {},
            event: null,
            marketDay: false
        }
    };
}
function nepaBillFor(day, bizCount = 0, solarCount = 0) {
    const { baseBill, billVariance } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nepa;
    const flat = baseBill + unit('nepa', day) * billVariance;
    const grid = Math.max(0, bizCount - solarCount);
    const sunny = Math.min(Math.max(0, solarCount), Math.max(0, bizCount));
    const load = grid * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BIZ"].nepaLoadPerBiz + sunny * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BIZ"].nepaLoadWithSolar;
    const loaded = flat * (1 + load);
    return Math.round(loaded / 10) * 10;
}
function nepaBillDueToday(civic, day) {
    return day > civic.nepa.paidThrough;
}
function nepaDayRoll(civic, day, bizCount = 0, solarCount = 0, chill = false) {
    let nepa = {
        ...civic.nepa
    };
    let posted = 0;
    let shed = false;
    // M9 — Chill Mode doubles the disco's patience before the cutter
    const grace = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nepa.graceDays * (chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHILL"].sheddingGraceMult : 1);
    if (nepaBillDueToday(civic, day)) {
        posted = nepaBillFor(day, bizCount, solarCount);
        nepa.owed += posted;
        nepa.cycleStart = day;
        nepa.paidThrough = day + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nepa.cycleDays - 1;
    }
    // debt past the grace window cuts the light — exactly once
    if (nepa.owed > 0 && !nepa.shedding && day - nepa.cycleStart >= grace) {
        nepa.shedding = true;
        shed = true;
    }
    return {
        next: {
            ...civic,
            nepa
        },
        posted,
        shed
    };
}
function nepaSettleCost(civic) {
    return civic.nepa.owed + (civic.nepa.shedding ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nepa.reconnectFee : 0);
}
function nepaApplyPayment(civic, day) {
    return {
        ...civic,
        nepa: {
            ...civic.nepa,
            owed: 0,
            paidThrough: Math.max(civic.nepa.paidThrough, day + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].nepa.cycleDays - 1),
            shedding: false,
            totalPaid: civic.nepa.totalPaid + nepaSettleCost(civic)
        }
    };
}
function kgirsDayRoll(civic, totalEarned, day, chill = false) {
    const k = {
        ...civic.kgirs
    };
    let assessedNow = 0;
    let warrantIssued = false;
    // M9 — Chill Mode gives the taxman 3× the patience before the warrant
    const grace = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.graceDays * (chill ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHILL"].warrantGraceMult : 1);
    // assessment day — every cycleDays from the game start
    if (day > 1 && (day - 1) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.cycleDays === 0 && k.assessed === 0) {
        const income = Math.max(0, totalEarned - k.lastSeenEarned);
        assessedNow = Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.minAssessment, Math.round(income * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.rate / 10) * 10);
        k.assessed = assessedNow;
        k.dueDay = day;
        k.lastSeenEarned = totalEarned;
    }
    // warrant — past the grace window with an unpaid assessment
    if (k.assessed > 0 && !k.warrant && day > k.dueDay + grace) {
        k.warrant = true;
        warrantIssued = true;
    }
    return {
        next: {
            ...civic,
            kgirs: k
        },
        assessed: assessedNow,
        warrantIssued
    };
}
function kgirsSettleCost(civic) {
    const k = civic.kgirs;
    if (k.assessed <= 0) return 0;
    return k.warrant ? Math.round(k.assessed * (1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].kgirs.warrantFineRate) / 10) * 10 : k.assessed;
}
function kgirsApplyPayment(civic, viaWarrant) {
    const k = civic.kgirs;
    return {
        ...civic,
        kgirs: {
            ...k,
            assessed: 0,
            dueDay: 0,
            warrant: false,
            paid: k.paid + (viaWarrant ? 1 : 1)
        },
        police: viaWarrant ? {
            ...civic.police,
            paid: civic.police.paid + 1
        } : civic.police
    };
}
/* ---------------------------------- EFCC ------------------------------------- */ const TIP_CASES = [
    'Ghost workers on a ministry payroll',
    'Cartel hoarding fertiliser subsidies',
    'Diverted road-project funds',
    'Fake contract executions',
    'Stolen palliative warehouse',
    'Bribe list at a licence office'
];
function efccFileTip(civic, day) {
    const id = `tip-${day}-${civic.efcc.pending.length + 1}`;
    const recovery = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].efcc.recoveries[civicHash('efcc', id) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].efcc.recoveries.length];
    const label = TIP_CASES[civicHash('case', id) % TIP_CASES.length];
    const tip = {
        id,
        filedDay: day,
        recovery,
        label
    };
    return {
        next: {
            ...civic,
            efcc: {
                ...civic.efcc,
                pending: [
                    ...civic.efcc.pending,
                    tip
                ],
                lastTipDay: day
            }
        },
        tip
    };
}
function efccRewardFor(tip) {
    return Math.max(100, Math.round(tip.recovery * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].efcc.rewardRate / 10) * 10);
}
function efccDayRoll(civic, day) {
    const ready = civic.efcc.pending.filter((t)=>day >= t.filedDay + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].efcc.resolveDays);
    const kept = civic.efcc.pending.filter((t)=>day < t.filedDay + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].efcc.resolveDays);
    const totalReward = ready.reduce((sum, t)=>sum + efccRewardFor(t), 0);
    return {
        next: {
            ...civic,
            efcc: {
                ...civic.efcc,
                pending: kept,
                rewardsTotal: civic.efcc.rewardsTotal + totalReward
            }
        },
        resolved: ready,
        totalReward
    };
}
function isMarketDay(day) {
    return day >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.marketDayEvery && day % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.marketDayEvery === 0;
}
function marketEventFor(day) {
    if (unit('event', day) > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.eventChance) return null;
    const events = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.events;
    const total = events.reduce((s, e)=>s + e.weight, 0);
    let pick = unit('eventpick', day) * total;
    for (const e of events){
        pick -= e.weight;
        if (pick <= 0) {
            const { weight: _w, ...rest } = e;
            return rest;
        }
    }
    return null;
}
function marketDayRoll(civic, day, weather, liquidityMult = 1) {
    if (civic.market.rolledDay === day) return {
        next: civic,
        rolled: false
    };
    const stress = (weather ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["weatherMarketMult"])(weather) : 1) * liquidityMult;
    const prices = {};
    for (const m of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.markets){
        const u = unit('mkt', m, day);
        prices[m] = Math.min(2, Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.minMult + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.maxMult - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.minMult)) * stress * 100) / 100);
    }
    return {
        next: {
            ...civic,
            market: {
                rolledDay: day,
                prices,
                event: marketEventFor(day),
                marketDay: isMarketDay(day)
            }
        },
        rolled: true
    };
}
function marketForDay(civic, day, weather, liquidityMult = 1) {
    const { next } = marketDayRoll(civic, day, weather, liquidityMult);
    return next;
}
function marketMealPrice(base, mealKey, locationId, civic, day) {
    const m = civic.market;
    const MARKET_IDS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.markets;
    if (!MARKET_IDS.includes(locationId)) return base;
    let mult = m.prices[locationId] ?? 1;
    if (m.marketDay) mult *= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CIVIC"].market.marketDayMult;
    if (m.event && m.event.mealBias === mealKey && typeof m.event.biasMult === 'number') {
        mult *= m.event.biasMult;
    }
    return Math.max(10, Math.round(base * mult / 10) * 10);
}
function civicDayRoll(civic, totalEarned, day, bizCount = 0, solarCount = 0, weather, liquidityMult = 1, chill = false) {
    const nepa = nepaDayRoll(civic, day, bizCount, solarCount, chill);
    const kgirs = kgirsDayRoll(nepa.next, totalEarned, day, chill);
    const efcc = efccDayRoll(kgirs.next, day);
    const market = marketDayRoll(efcc.next, day, weather, liquidityMult);
    return {
        next: market.next,
        nepaPosted: nepa.posted,
        nepaShed: nepa.shed,
        taxAssessed: kgirs.assessed,
        warrantIssued: kgirs.warrantIssued,
        tipsResolved: efcc.resolved,
        tipReward: efcc.totalReward
    };
}
}),
"[project]/src/game/systems/chaos.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M8: THE CHAOS ENGINE (pure rules)
 * ------------------------------------------------
 * The grid is alive and the naira has moods:
 *   - On a heavy-sky day (storm/flood) a zone transformer can blow: the
 *     whole area goes dark, shops without backup starve, generator shops
 *     burn fuel, and the community gathers naira for the technician.
 *   - Independent of the sky, some mornings the cash simply dries up:
 *     the ATM pays a capped trickle, POS agents charge their levy,
 *     black-market fuel doubles, and market prices climb — while the
 *     ajo payout days soften everything again.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, day, weather) → same outcome.
 *    Every "random" number is a hash of stable inputs (day / zone / kind),
 *    so tests and replays can trust the world.
 *  - Scarcity and payout days are DERIVED from the day number alone —
 *    reload-proof, zero state. Blowouts are rolled ONCE at the day roll
 *    and persisted (the sky history is not), exactly like weather.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every naira constant lives in config.CHAOS — nothing is hard-coded.
 */ __turbopack_context__.s([
    "CHAOS_ZONE_IDS",
    ()=>CHAOS_ZONE_IDS,
    "applyAtmDraw",
    ()=>applyAtmDraw,
    "applyContribution",
    ()=>applyContribution,
    "atmRemaining",
    ()=>atmRemaining,
    "blackoutAt",
    ()=>blackoutAt,
    "blowoutToday",
    ()=>blowoutToday,
    "blowoutZoneFor",
    ()=>blowoutZoneFor,
    "canContribute",
    ()=>canContribute,
    "chaosDayRoll",
    ()=>chaosDayRoll,
    "freshChaosState",
    ()=>freshChaosState,
    "fuelMultFor",
    ()=>fuelMultFor,
    "isPayoutDay",
    ()=>isPayoutDay,
    "isScarcityDay",
    ()=>isScarcityDay,
    "liquidityMultFor",
    ()=>liquidityMultFor,
    "outageDurationFor",
    ()=>outageDurationFor,
    "playerZoneDark",
    ()=>playerZoneDark,
    "poolNpcContributionFor",
    ()=>poolNpcContributionFor,
    "posFeeFor",
    ()=>posFeeFor,
    "setDebugScarcity",
    ()=>setDebugScarcity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/seasons.ts [app-route] (ecmascript)");
;
;
;
function freshChaosState() {
    return {
        day: 0,
        active: null,
        recent: [],
        atmDrawnDay: 0,
        atmDrawn: 0,
        stats: {
            blowouts: 0,
            fixes: 0,
            contributed: 0,
            posFees: 0
        }
    };
}
/* ------------------------------ derived laws ------------------------------- */ const unit = (...nums)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])(...nums) / 0xffffffff;
function blowoutToday(weather, day) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$seasons$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isHeavySky"])(weather)) return false;
    const chance = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].blowoutChance[weather] ?? 0;
    return unit('blowout', day, weather) < chance;
}
function blowoutZoneFor(day, weather) {
    const zones = CHAOS_ZONES;
    return zones[(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('zone', day, weather) % zones.length];
}
function outageDurationFor(day, weather) {
    const span = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].outageDays.max - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].outageDays.min;
    const u = unit('outage-len', day, weather);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].outageDays.min + Math.floor(u * (span + 1));
}
/**
 * The zones that share one transformer each — the 10 LAUNCH districts.
 * Schools ride their district's grid: a school street is not its own
 * feeder, and every zone here is walkable/rideable from the core map.
 */ const CHAOS_ZONES = [
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
const CHAOS_ZONE_IDS = CHAOS_ZONES;
/**
 * Is today a cash-scarcity morning? Derived from the day alone — the
 * naira's mood needs no memory. A debug override exists ONLY for E2E
 * determinism (set through the __lkl hook, never by game code).
 */ let debugScarcity = null;
function setDebugScarcity(v) {
    debugScarcity = v;
}
function isScarcityDay(day) {
    if (debugScarcity !== null) return debugScarcity;
    return unit('scarcity', day) < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].scarcityChance;
}
function isPayoutDay(day) {
    return day > 1 && day % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].payoutEvery === 0;
}
function liquidityMultFor(day) {
    if (isScarcityDay(day)) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].scarcityMarketMult;
    if (isPayoutDay(day)) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].payoutMarketMult;
    return 1;
}
function fuelMultFor(day) {
    return isScarcityDay(day) ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].fuelSurgeMult : 1;
}
function poolNpcContributionFor(startedDay, day) {
    const u = unit('pool', startedDay, day);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].poolNpcMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].poolNpcMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].poolNpcMin)) / 10) * 10;
}
function blackoutAt(chaos, locationId, day) {
    if (chaos.active) {
        const a = chaos.active;
        if (a.zoneId === locationId && day >= a.startedDay && day <= chaos.day) {
            // an active outage darkens every day from its blow day through
            // yesterday inclusive (today may still be fixed tomorrow morning)
            return day < Math.max(a.minUntilDay, chaos.day);
        }
    }
    return chaos.recent.some((r)=>r.zoneId === locationId && day >= r.startedDay && day <= r.untilDay);
}
function chaosDayRoll(chaos, day, weather) {
    if (day <= chaos.day) {
        return {
            next: chaos,
            blowout: null,
            fixed: null,
            scarcity: isScarcityDay(day),
            payout: isPayoutDay(day)
        };
    }
    let active = chaos.active ? {
        ...chaos.active,
        playerContribDays: [
            ...chaos.active.playerContribDays
        ]
    } : null;
    let recent = [
        ...chaos.recent
    ];
    let fixed = null;
    // 1 + 2 — settle yesterday's darkness
    if (active) {
        const endedYesterday = day - 1;
        if (endedYesterday >= active.startedDay) {
            active = {
                ...active,
                pool: active.pool + poolNpcContributionFor(active.startedDay, endedYesterday)
            };
        }
        // the disco repairs THROUGH the night before minUntilDay — power returns
        // that morning; a full pool calls the technician even earlier
        if (active.pool >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget || day >= active.minUntilDay) {
            const record = {
                zoneId: active.zoneId,
                startedDay: active.startedDay,
                untilDay: endedYesterday,
                fixedBy: active.pool >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].poolTarget ? 'community' : 'disco'
            };
            recent = [
                ...recent,
                record
            ];
            fixed = {
                zoneId: record.zoneId,
                fixedBy: record.fixedBy
            };
            active = null;
        }
    }
    // 3 — a heavy sky can blow the next one (never two dark zones at once)
    let blowout = null;
    if (!active && blowoutToday(weather, day)) {
        const zoneId = blowoutZoneFor(day, weather);
        active = {
            zoneId,
            startedDay: day,
            minUntilDay: day + outageDurationFor(day, weather),
            pool: 0,
            playerContribDays: []
        };
        blowout = {
            zoneId
        };
    }
    // prune the recent records to the last few days (they only exist so
    // multi-day sleeps can still price dark shops)
    recent = recent.filter((r)=>r.untilDay >= day - 6);
    return {
        next: {
            ...chaos,
            day,
            active,
            recent,
            atmDrawnDay: day,
            atmDrawn: chaos.atmDrawnDay === day ? chaos.atmDrawn : 0,
            stats: {
                ...chaos.stats,
                blowouts: chaos.stats.blowouts + (blowout ? 1 : 0),
                fixes: chaos.stats.fixes + (fixed ? 1 : 0)
            }
        },
        blowout,
        fixed,
        scarcity: isScarcityDay(day),
        payout: isPayoutDay(day)
    };
}
function canContribute(chaos, locationId, day) {
    const a = chaos.active;
    if (!a) return {
        ok: false,
        why: 'No outage — the grid is holding.'
    };
    if (a.zoneId !== locationId) return {
        ok: false,
        why: 'The dark zone is elsewhere — go there in person.'
    };
    if (a.playerContribDays.includes(day)) return {
        ok: false,
        why: 'You don give today — the community dey grateful.'
    };
    return {
        ok: true,
        why: ''
    };
}
function applyContribution(chaos, day, amount) {
    if (!chaos.active) return chaos;
    return {
        ...chaos,
        active: {
            ...chaos.active,
            pool: chaos.active.pool + amount,
            playerContribDays: [
                ...chaos.active.playerContribDays,
                day
            ]
        },
        stats: {
            ...chaos.stats,
            contributed: chaos.stats.contributed + amount
        }
    };
}
function atmRemaining(chaos, day) {
    if (!isScarcityDay(day)) return Number.POSITIVE_INFINITY;
    const drawn = chaos.atmDrawnDay === day ? chaos.atmDrawn : 0;
    return Math.max(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].atmCap - drawn);
}
function applyAtmDraw(chaos, day, amount) {
    return {
        ...chaos,
        atmDrawnDay: day,
        atmDrawn: (chaos.atmDrawnDay === day ? chaos.atmDrawn : 0) + amount
    };
}
function posFeeFor(amount) {
    return Math.min(Math.ceil(amount * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].posFeeRate / 10) * 10, 2000);
}
function playerZoneDark(chaos, locationId) {
    return blackoutAt(chaos, locationId, chaos.day);
}
}),
"[project]/src/game/systems/goals.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M9: THE CASUAL SHELL (pure rules)
 * ------------------------------------------------
 * The daily goal engine: every morning rolls THREE honest goals from the
 * life the player actually leads — one gig, one meal, one collection —
 * each worth real naira and real XP, with a streak that remembers.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the goals for (day, index) are hash-picked
 *    from the pool — same day, same goals, reload-proof.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the
 *    UI only reads them.
 *  - Every naira/XP constant lives in config.GOALS — nothing hard-coded.
 */ __turbopack_context__.s([
    "GOAL_POOL",
    ()=>GOAL_POOL,
    "bumpGoal",
    ()=>bumpGoal,
    "dailyGoals",
    ()=>dailyGoals,
    "ensureGoals",
    ()=>ensureGoals,
    "freshGoalState",
    ()=>freshGoalState,
    "goalsFor",
    ()=>goalsFor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
;
;
function freshGoalState() {
    return {
        day: 0,
        ids: [],
        progress: {},
        done: [],
        streak: 0,
        lastDoneDay: 0
    };
}
const GOAL_POOL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GOALS"].pool;
function dailyGoals(day) {
    const picked = [];
    const used = new Set();
    for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GOALS"].perDay && picked.length < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GOALS"].perDay; i++){
        let idx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('goal', day, i) % GOAL_POOL.length;
        // walk forward off already-picked rows so one day never repeats a goal
        let tries = 0;
        while(used.has(idx) && tries < GOAL_POOL.length){
            idx = (idx + 1) % GOAL_POOL.length;
            tries++;
        }
        if (used.has(idx)) continue;
        used.add(idx);
        picked.push(GOAL_POOL[idx]);
    }
    return picked;
}
function ensureGoals(state, day) {
    if (state.day === day && state.ids.length === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GOALS"].perDay) return state;
    const goals = dailyGoals(day);
    return {
        day,
        ids: goals.map((g)=>g.id),
        progress: {},
        done: goals.map(()=>false),
        streak: state.streak,
        lastDoneDay: state.lastDoneDay
    };
}
function goalsFor(state) {
    return state.ids.map((id)=>GOAL_POOL.find((g)=>g.id === id)).filter((g)=>!!g);
}
function bumpGoal(state, kind, day) {
    const ensured = ensureGoals(state, day);
    const defs = goalsFor(ensured);
    const completed = [];
    let perfectDay = false;
    const progress = {
        ...ensured.progress
    };
    const done = [
        ...ensured.done
    ];
    defs.forEach((def, i)=>{
        if (def.kind !== kind || done[i]) return;
        const next = (progress[def.id] ?? 0) + 1;
        progress[def.id] = next;
        if (next >= def.target) {
            done[i] = true;
            completed.push(def);
        }
    });
    let streak = ensured.streak;
    let lastDoneDay = ensured.lastDoneDay;
    if (completed.length > 0 && done.every(Boolean) && !ensured.done.every(Boolean)) {
        // the full set just completed — the streak continues only off yesterday
        streak = ensured.lastDoneDay === day - 1 || ensured.lastDoneDay === day ? streak + 1 : 1;
        lastDoneDay = day;
        perfectDay = true;
    }
    return {
        next: {
            ...ensured,
            progress,
            done,
            streak,
            lastDoneDay
        },
        completed,
        perfectDay
    };
}
}),
"[project]/src/game/systems/guest.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M9: THE GUEST LOOP (pure rules)
 * ----------------------------------------------
 * Play first, login to continue. Every new user plays INSTANTLY as a
 * guest — no wall, no form. The GATE fires only when they try to move
 * forward past the starter environment: a friendly "Lokoja knows your
 * face. Claim your name to keep going." with a one-day grace when they
 * ask for it ("Maybe later" buys the rest of TODAY — never a dead end).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. The network
 *    lives in the API routes; the merge law lives here so no surface can
 *    disagree about what "never lose progress" means.
 *  - The merge law: the FURTHER save wins by (day, then totalEarned);
 *    the loser is KEPT as a backup, never deleted. Nobody ever loses
 *    a single naira to the guest loop.
 */ __turbopack_context__.s([
    "BACKUP_KEY",
    ()=>BACKUP_KEY,
    "STARTER_ZONE_IDS",
    ()=>STARTER_ZONE_IDS,
    "ageBandForYear",
    ()=>ageBandForYear,
    "applyGrace",
    ()=>applyGrace,
    "backupPayload",
    ()=>backupPayload,
    "freshAccountState",
    ()=>freshAccountState,
    "freshOnboardingState",
    ()=>freshOnboardingState,
    "gateVerdict",
    ()=>gateVerdict,
    "inStarterZone",
    ()=>inStarterZone,
    "mergeVerdict",
    ()=>mergeVerdict,
    "validateContact",
    ()=>validateContact,
    "validateHandle",
    ()=>validateHandle,
    "validatePin",
    ()=>validatePin
]);
function freshAccountState() {
    return {
        linked: false,
        handle: null,
        token: null,
        ageBand: null,
        gateGraceDay: 0,
        displayName: null,
        avatarLook: null,
        bio: null
    };
}
function freshOnboardingState() {
    return {
        done: [],
        rewarded: false
    };
}
const STARTER_ZONE_IDS = [
    'home',
    'kpata-market',
    'ganaja-junction'
];
function inStarterZone(locationId) {
    return STARTER_ZONE_IDS.includes(locationId);
}
function gateVerdict(account, destinationId, day) {
    if (account.linked) return {
        blocked: false,
        reason: 'graced'
    };
    if (inStarterZone(destinationId)) return {
        blocked: false,
        reason: 'graced'
    };
    if (account.gateGraceDay === day) return {
        blocked: false,
        reason: 'graced'
    };
    return {
        blocked: true,
        reason: 'claim'
    };
}
function applyGrace(account, day) {
    return {
        ...account,
        gateGraceDay: day
    };
}
function validateHandle(handle) {
    const h = handle.trim();
    if (h.length < 3 || h.length > 16) return {
        ok: false,
        why: 'Name must be 3–16 characters.'
    };
    if (!/^[a-zA-Z0-9_]+$/.test(h)) return {
        ok: false,
        why: 'Letters, numbers and underscore only.'
    };
    return {
        ok: true,
        why: ''
    };
}
function validatePin(pin) {
    if (!/^\d{4,8}$/.test(pin)) return {
        ok: false,
        why: 'PIN must be 4–8 digits.'
    };
    return {
        ok: true,
        why: ''
    };
}
function validateContact(contact) {
    const c = contact.trim();
    if (/^\+?\d{7,15}$/.test(c)) return {
        ok: true,
        why: ''
    };
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) return {
        ok: true,
        why: ''
    };
    return {
        ok: false,
        why: 'Enter a phone number or an email.'
    };
}
function ageBandForYear(birthYear, nowYear) {
    const age = nowYear - birthYear;
    if (age < 6 || age > 120) return null;
    if (age <= 12) return 'kid';
    if (age <= 17) return 'teen';
    return 'adult';
}
/** Progress distance: the day leads, the ledger breaks ties. */ function progressScore(save) {
    return save.world.day * 1_000_000_000 + Math.min(save.player.stats.totalEarned, 999_999_999);
}
function mergeVerdict(local, cloud) {
    const l = progressScore(local);
    const c = progressScore(cloud);
    if (l > c) return {
        winner: 'local',
        why: `This device is further (Day ${local.world.day} vs Day ${cloud.world.day}) — your guest hustle stays.`,
        backup: cloud
    };
    return {
        winner: 'cloud',
        why: `Your cloud save is further (Day ${cloud.world.day} vs Day ${local.world.day}) — it continues. This device's progress is kept as a backup.`,
        backup: local
    };
}
const BACKUP_KEY = 'lokoja-life:backup';
function backupPayload(save) {
    return JSON.stringify({
        ...save,
        savedAs: 'backup',
        backupAt: Date.now()
    });
}
}),
"[project]/src/game/data/schools.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LEGACY_ANCHOR_XY",
    ()=>LEGACY_ANCHOR_XY,
    "SCHOOLS",
    ()=>SCHOOLS,
    "SCHOOL_BY_ID",
    ()=>SCHOOL_BY_ID,
    "SCHOOL_PLANS",
    ()=>SCHOOL_PLANS,
    "SCHOOL_SITES_PROJECTED",
    ()=>SCHOOL_SITES_PROJECTED,
    "WORLD_HALF",
    ()=>WORLD_HALF,
    "projectLatLon",
    ()=>projectLatLon
]);
/**
 * LOKOJA LIFE — The Schools of Lokoja (Stage 7)
 * -----------------------------------------------
 * Real schools of the real city, placed by their REAL coordinates:
 *  - OpenStreetMap ground truth (the dataset Google Maps/Earth render):
 *    Federal University Lokoja's Felele permanent site is mapped building by
 *    building (faculties, lecture theatres, gate) and Faithview Academy has
 *    its exact mapped campus polygon.
 *  - Google plus-code decodes: Crowther Memorial College (RP4R+9M8 260101)
 *    and Julitola International School (RMJ6+GF8) decode to real positions.
 *  - Directory/news verification: GYB Model Science Secondary School
 *    (Adankolo New Layout Rd), Al-Azhar International College (Okene road /
 *    Lokongoma), Kogi State Polytechnic (Lokoja–Abuja expressway, Felele),
 *    Salem University, Baptist High School, Christfield School, and the
 *    state College of Nursing Sciences (specialist-hospital quarter).
 *
 * The projection is the SAME one the geo pipeline uses (1 unit = 26 m,
 * north = -Z, world centre 6.753E 7.790N), so a school sits beside the same
 * real road it sits beside in Lokoja. Sites that fall outside the playable
 * circle (FUL's permanent site is ~10 km out, exactly like real life) are
 * pulled to the world rim ALONG their real access road — the game world
 * compresses the city, it does not move it.
 *
 * Pure data + deterministic derivation. No economy, no state.
 */ /* ------------------------------- projection --------------------------------- */ /** geo pipeline anchors — must match scripts/geo/pipeline.py exactly */ const LAT0 = 7.79;
const LON0 = 6.753;
const SCALE_M = 26.0;
const METERS_PER_DEG_LAT = 110540.0;
const METERS_PER_DEG_LON = 111320.0 * Math.cos(LAT0 * Math.PI / 180);
function projectLatLon(lat, lon) {
    const east = (lon - LON0) * METERS_PER_DEG_LON;
    const north = (lat - LAT0) * METERS_PER_DEG_LAT;
    return [
        east / SCALE_M,
        -north / SCALE_M
    ];
}
const SCHOOLS = [
    {
        id: 'ful-felele',
        name: 'Federal University Lokoja',
        shortName: 'FUL',
        kind: 'university',
        lat: 7.85343,
        lon: 6.68416,
        anchor: 'osm',
        sourceNote: 'OSM: gate + 12 faculty/LT buildings on the permanent site',
        founded: '2011',
        motto: 'Knowledge for Development',
        tagline: 'The permanent site — faculties, lecture theatres, ambition',
        description: 'The federal university on its Felele permanent site, off the Abuja expressway. Lecture theatres LT A and LT B, the Twin Theatre, faculty blocks and the e-learning centre stand along real mapped drives. It is a long ride from town — every student knows it.',
        color: '#1D5C8A',
        accent: '#0E3250',
        emoji: '🎓',
        w: 44,
        d: 34,
        plateauR: 30,
        blocks: 4,
        field: true,
        paint: '#e8e2d2',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.35
    },
    {
        id: 'ful-adankolo',
        name: 'FUL Adankolo Campus',
        shortName: 'FUL Adankolo',
        kind: 'university',
        lat: 7.7931,
        lon: 6.7621,
        anchor: 'district',
        sourceNote: 'OSM places the FUL node in the Adankolo side of town',
        founded: '2011',
        motto: 'Knowledge for Development',
        tagline: 'The old campus where it all began',
        description: 'The university’s first campus in Adankolo, before the permanent site. Smaller, older, closer to town — evening lectures spill out onto the Adankolo New Layout road.',
        color: '#2E6E8A',
        accent: '#173E50',
        emoji: '📚',
        w: 28,
        d: 22,
        plateauR: 18.5,
        blocks: 2,
        field: false,
        paint: '#e8e2d2',
        unlockLevel: 2,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'ksp-felele',
        name: 'Kogi State Polytechnic',
        shortName: 'KSP',
        kind: 'polytechnic',
        lat: 7.8495,
        lon: 6.7042,
        anchor: 'district',
        sourceNote: 'Institution address: "along Lokoja/Abuja Expressway" — snapped to the real A2',
        founded: '1993',
        motto: 'Technology for Self-Reliance',
        tagline: 'HND hustle on the expressway',
        description: 'The state polytechnic along the Abuja expressway at Felele. Engineering workshops, ND/HND lecture blocks, and the famous “poly” energy that spills onto the highway at closing time.',
        color: '#7A5A1D',
        accent: '#453209',
        emoji: '🛠️',
        w: 32,
        d: 26,
        plateauR: 21.5,
        blocks: 3,
        field: true,
        paint: '#e2d6b4',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.3
    },
    {
        id: 'salem-university',
        name: 'Salem University',
        shortName: 'Salem',
        kind: 'university',
        lat: 7.8378,
        lon: 6.7136,
        anchor: 'district',
        sourceNote: 'Directory-verified private university on the Abuja road corridor',
        founded: '2007',
        motto: 'Raising Leaders, Transforming Society',
        tagline: 'The private campus with the quiet gates',
        description: 'The mission-run private university on the Abuja road. Neat painted blocks, a Chapel on the lawn, and the quietest reading culture in Lokoja.',
        color: '#5C2D6E',
        accent: '#341542',
        emoji: '⛪',
        w: 28,
        d: 22,
        plateauR: 18.5,
        blocks: 2,
        field: false,
        paint: '#efe6d0',
        unlockLevel: 3,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.25
    },
    {
        id: 'college-nursing',
        name: 'College of Nursing Sciences',
        shortName: 'Nursing Schl.',
        kind: 'college',
        lat: 7.7968,
        lon: 6.7402,
        anchor: 'district',
        sourceNote: 'State school of nursing sits in the specialist-hospital quarter',
        founded: '1976',
        motto: 'Care, Competence, Compassion',
        tagline: 'White uniforms, steady hands',
        description: 'The state nursing college by the specialist hospital. Practical halls, demonstration dummies, and students in crisp white going for morning duty.',
        color: '#1F7A6D',
        accent: '#0C3B34',
        emoji: '🩺',
        w: 24,
        d: 18,
        plateauR: 15.5,
        blocks: 2,
        field: false,
        paint: '#f0ece0',
        unlockLevel: 3,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'crowther-memorial',
        name: 'Crowther Memorial College',
        shortName: 'Crowther',
        kind: 'secondary',
        lat: 7.80591,
        lon: 6.74163,
        anchor: 'plus-code',
        sourceNote: 'Google plus-code RP4R+9M8, Lokoja 260101 — decodes to this point',
        founded: '1956',
        motto: 'Knowledge, Discipline, Service',
        tagline: 'The old mission college under the hill',
        description: 'One of Lokoja’s heritage colleges, in the old GRA quarter beneath Mount Patti. Old students’ association still fights for its land — that is how much this school means.',
        color: '#8A3A28',
        accent: '#4A1D12',
        emoji: '🏫',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 2,
        field: true,
        paint: '#e8d8b8',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'gyb-model-adankolo',
        name: 'GYB Model Science Secondary School',
        shortName: 'GYB Model',
        kind: 'secondary',
        lat: 7.8009,
        lon: 6.7587,
        anchor: 'district',
        sourceNote: 'News-verified: GYB Model Science SS (ex-Government Day SS), Adankolo New Layout Rd',
        founded: '1992',
        motto: 'Science is Light',
        tagline: 'The science school of Adankolo',
        description: 'The model science secondary school on Adankolo New Layout road — MTN quiz finalist energy, laboratories, and morning assembly you can hear three streets away.',
        color: '#C4562A',
        accent: '#7C2D12',
        emoji: '🧪',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 2,
        field: true,
        paint: '#e4dcc4',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'faithview-academy',
        name: 'Faithview Academy',
        shortName: 'Faithview',
        kind: 'secondary',
        lat: 7.75337,
        lon: 6.73858,
        anchor: 'osm',
        sourceNote: 'OSM: amenity=school grounds mapped at this exact position',
        founded: '2003',
        motto: 'Faith. Knowledge. Vision.',
        tagline: 'The academy on the southern road',
        description: 'A private academy on the southern outskirts, mapped school grounds and all. Small classes, big dreams, and a compound that stays alive till prep time.',
        color: '#2E7D5B',
        accent: '#17402E',
        emoji: '✏️',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 1,
        field: false,
        paint: '#e0dcc8',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke'
        ],
        travelModifier: 1.1
    },
    {
        id: 'al-azhar-college',
        name: 'Al-Azhar International College',
        shortName: 'Al-Azhar',
        kind: 'secondary',
        lat: 7.7962,
        lon: 6.7265,
        anchor: 'district',
        sourceNote: 'Directory-verified international college, Okene-road corridor',
        founded: '2005',
        motto: 'Ilm and Akhlaq',
        tagline: 'The international college on Okene road',
        description: 'The international college along the Okene road after Lokongoma. Arabic and English side by side, green-and-white uniform, and some of the calmest students in the city.',
        color: '#2E7D5B',
        accent: '#173E2A',
        emoji: '🕌',
        w: 30,
        d: 24,
        plateauR: 19.5,
        blocks: 1,
        field: true,
        paint: '#e6e0cc',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.1
    },
    {
        id: 'baptist-high',
        name: 'Baptist High School',
        shortName: 'Baptist HS',
        kind: 'secondary',
        lat: 7.8022,
        lon: 6.7498,
        anchor: 'district',
        sourceNote: 'Directory-verified Baptist mission secondary school, central Lokoja quarter',
        founded: '1979',
        motto: 'The Truth Shall Set You Free',
        tagline: 'The mission school with the old choir',
        description: 'The Baptist mission secondary school in central Lokoja. Famous choir, famous discipline, and inter-house sports that stop the whole street.',
        color: '#3A5A8A',
        accent: '#1E3350',
        emoji: '📖',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 1,
        field: true,
        paint: '#e2dcc6',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    },
    {
        id: 'julitola-intl',
        name: 'Julitola International School',
        shortName: 'Julitola',
        kind: 'secondary',
        lat: 7.8313,
        lon: 6.6611,
        anchor: 'plus-code',
        sourceNote: 'Google plus-code RMJ6+GF8, Lokoja 264103 — Abuja-road corridor',
        founded: '2001',
        motto: 'Raising Champions',
        tagline: 'The international school by the expressway',
        description: 'The international school out on the Abuja road. Yellow school bus, intercom at the gate, and the sort of end-of-term parties that trend in Lokoja.',
        color: '#B0812A',
        accent: '#5C3E12',
        emoji: '🚌',
        w: 26,
        d: 20,
        plateauR: 16.5,
        blocks: 1,
        field: false,
        paint: '#ece4c8',
        unlockLevel: 2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.25
    },
    {
        id: 'christfield-school',
        name: 'Christfield School',
        shortName: 'Christfield',
        kind: 'secondary',
        lat: 7.7892,
        lon: 6.7442,
        anchor: 'district',
        sourceNote: 'Directory-verified nursery/primary/secondary, central-south Lokoja',
        founded: '2007',
        motto: 'Built on the Rock',
        tagline: 'Nursery bells to senior class',
        description: 'The all-through school in central-south Lokoja — tiny nursery chairs at one end, WAEC class at the other, and mothers at the gate from 1 pm.',
        color: '#C48A2A',
        accent: '#6E4A12',
        emoji: '🎒',
        w: 24,
        d: 18,
        plateauR: 15.5,
        blocks: 1,
        field: false,
        paint: '#e8e0c8',
        unlockLevel: 1,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1
    }
];
const SCHOOL_BY_ID = Object.fromEntries(SCHOOLS.map((s)=>[
        s.id,
        s
    ]));
const WORLD_HALF = 310;
/** pull any site inside this rim so the gate is reachable on foot (WALK_BOUND 292 − margin) */ const RIM_LIMIT = 272;
function buildSites() {
    return SCHOOLS.map((s)=>{
        const [x, z] = projectLatLon(s.lat, s.lon);
        const rim = Math.hypot(x, z);
        let px = x;
        let pz = z;
        let pulled = false;
        if (rim > RIM_LIMIT) {
            pulled = true;
            px = x / rim * RIM_LIMIT;
            pz = z / rim * RIM_LIMIT;
        }
        return {
            ...s,
            x: px,
            z: pz,
            rimPulled: pulled,
            mapX: 50 + px / (WORLD_HALF * 2 / 100),
            mapY: 50 + pz / (WORLD_HALF * 2 / 100)
        };
    });
}
const SCHOOL_SITES_PROJECTED = buildSites();
const LEGACY_ANCHOR_XY = [
    {
        id: 'home',
        x: -90.52,
        z: 34.1
    },
    {
        id: 'kpata-market',
        x: -70.68,
        z: 42.16
    },
    {
        id: 'ganaja-junction',
        x: -51.46,
        z: 89.28
    },
    {
        id: 'confluence',
        x: -40.3,
        z: 153.76
    },
    {
        id: 'mount-patti',
        x: -84.94,
        z: -135.78
    },
    {
        id: 'historic-lokoja',
        x: -68.2,
        z: -53.94
    },
    {
        id: 'government-area',
        x: -97.96,
        z: 18.6
    },
    {
        id: 'university-area',
        x: -187.86,
        z: -27.9
    },
    {
        id: 'food-area',
        x: -55.8,
        z: 50.84
    },
    {
        id: 'transport-area',
        x: -51.46,
        z: 67.58
    }
];
const SCHOOL_PLANS = {
    'ful-felele': [
        {
            kind: 'senate',
            name: 'The Senate Building',
            position: 'centrally on the main axis, straight past the grand entrance',
            inside: [
                "the Vice-Chancellor's executive suite",
                "the Registrar's corporate wing",
                'the central academic registry',
                'council chambers with the long meeting table'
            ],
            room: 'senate',
            lx: 0,
            lz: -12.2,
            studyLabel: "Greet the Vice-Chancellor's office"
        },
        {
            kind: 'library',
            name: 'The University Library',
            position: 'the heart of the central academic lawn',
            inside: [
                'book stack corridors cataloged by faculty',
                'the digital e-library network hub',
                'reference & serials sections',
                'student reading halls with long desks'
            ],
            room: 'library',
            lx: -13.2,
            lz: -12.2,
            studyLabel: 'Read in the main library'
        },
        {
            kind: 'faculty',
            name: 'Faculty of Arts',
            position: 'the north-east loop of the academic area',
            inside: [
                'English & Literary Studies, History, Theatre Arts wings',
                'the language laboratory with headset desks',
                'lecture rooms with rows of desks',
                'the staff common room'
            ],
            room: 'fac-arts',
            lx: -17.8,
            lz: -5.4,
            studyLabel: 'Practise in the language lab'
        },
        {
            kind: 'science-lab',
            name: 'Faculty of Science',
            position: 'on the western curve of the academic loop road',
            inside: [
                'advanced chemistry laboratories with fume hoods',
                'physics practical labs',
                'biological & geological workspaces with microscopes',
                'the faculty boardroom'
            ],
            room: 'fac-sci',
            lx: 14,
            lz: -5.4,
            studyLabel: 'Take a practical in the science labs'
        },
        {
            kind: 'faculty',
            name: 'Faculty of Social & Management Sciences',
            position: 'along the south-west academic corridor',
            inside: [
                'Economics, Political Science, Sociology offices',
                'Accounting & Business Administration wings',
                'computer simulation labs',
                'the GIS laboratory'
            ],
            room: 'lab',
            lx: 17.6,
            lz: -12.2,
            studyLabel: 'Book a GIS workstation'
        },
        {
            kind: 'lecture-theatre',
            name: 'Twin Lecture Theatre A',
            position: 'between the Faculty of Science and the Faculty of Arts',
            inside: [
                'a 250-seat stepped auditorium',
                'tiered theatre rows',
                'instructional podium with microphone',
                'ceiling projector brackets'
            ],
            room: 'theatre',
            lx: -5.4,
            lz: -5,
            studyLabel: 'Attend the lecture'
        },
        {
            kind: 'lecture-theatre',
            name: 'Twin Lecture Theatre B',
            position: 'shoulder to shoulder with Theatre A',
            inside: [
                'a 250-seat stepped auditorium',
                'tiered theatre rows',
                'instructional podium with microphone',
                'ceiling projector brackets'
            ],
            room: 'lt-b',
            lx: 4.8,
            lz: -5,
            studyLabel: 'Attend the lecture'
        },
        {
            kind: 'hostel',
            name: 'Felele Student Hostels',
            position: 'the south-eastern perimeter, zoned away from academic traffic',
            inside: [
                'shared rooms of metal bunk beds and personal lockers',
                'the common study lounge',
                'ablution blocks on every floor',
                "the porter's lodge at the steps"
            ],
            room: 'hostel',
            lx: -16,
            lz: 0.5,
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'Student Cafeteria',
            position: 'behind the central lawn, beside the faculties',
            inside: [
                'the serving counter with pots',
                'long dining benches',
                'the kitchen store'
            ],
            room: 'canteen',
            lx: 9,
            lz: -12.2
        },
        {
            kind: 'clinic',
            name: 'University Clinic',
            position: 'the quiet corner near the hostels',
            inside: [
                'consultation desk',
                'observation beds',
                'the medicine cabinet'
            ],
            room: 'clinic',
            lx: -17.4,
            lz: 14.4
        },
        {
            kind: 'watchtower',
            name: 'Security Watchtower',
            position: 'rising over the main gatehouse at the compound corner',
            inside: [
                'the elevated watch platform',
                'the perimeter radio base'
            ],
            lx: -19.5,
            lz: -12.2
        }
    ],
    'ful-adankolo': [
        {
            kind: 'health-sciences',
            name: 'College of Health Sciences',
            position: 'the primary northern block of the campus',
            inside: [
                'the gross anatomy laboratory with dissection tables',
                'histology & pathology viewing bays',
                'specimen preservation tanks and models',
                'clinical faculty offices'
            ],
            room: 'anatomy',
            studyLabel: 'Take the anatomy practical'
        },
        {
            kind: 'lecture-theatre',
            name: 'The Pre-Clinical Lecture Theatre',
            position: 'right beside the medical laboratory wing',
            inside: [
                'stepped seating facing the display board',
                'colour-coded medical posters',
                'the human skeletal model',
                'overhead projector screen'
            ],
            room: 'preclinic',
            studyLabel: 'Attend the pre-clinical lecture'
        },
        {
            kind: 'admin',
            name: 'The Adankolo Admin Block',
            position: 'beside the gate, where the old campus began',
            inside: [
                'the campus director’s office',
                'the old registry counters',
                'faculty notice boards'
            ],
            room: 'office',
            studyLabel: 'Greet the campus director'
        },
        {
            kind: 'canteen',
            name: 'The Old Campus Canteen',
            position: 'on the walk between lectures',
            inside: [
                'the jollof counter',
                'plastic tables and benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Campus Sick Bay',
            position: 'the shaded corner by the wall',
            inside: [
                'two observation beds',
                'the first-aid cabinet',
                'the nurse’s desk'
            ],
            room: 'clinic'
        }
    ],
    'ksp-felele': [
        {
            kind: 'workshop',
            name: 'The Engineering Workshops',
            position: 'the noisy row along the back fence',
            inside: [
                'machine benches with lathes and mills',
                'the electrical & electronics bay',
                'mechatronics rigs',
                'the tool store crates'
            ],
            room: 'workshop',
            studyLabel: 'Learn at the machines'
        },
        {
            kind: 'computer-lab',
            name: 'The DITRC Computer Centre',
            position: 'beside the lecture blocks — the ICT directorate',
            inside: [
                'bench rows of workstations',
                'the server stack',
                'the lab instructor desk'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'library',
            name: 'The Polytechnic Library',
            position: 'the quiet block behind the assembly yard',
            inside: [
                'shelf stacks by department',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'admin',
            name: 'The Rectory & Admin Block',
            position: 'the first building past the gate',
            inside: [
                "the Rector's office suite",
                'the records counters',
                'the bursary windows'
            ],
            room: 'office',
            studyLabel: 'Greet the Rector’s office'
        },
        {
            kind: 'hostel',
            name: 'The Poly Hostels',
            position: 'the residential corner of the compound',
            inside: [
                'bunk rooms with lockers',
                'the common lounge',
                'the ablution block'
            ],
            room: 'hostel',
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'The Poly Canteen',
            position: 'where the expressway noise meets the yard',
            inside: [
                'the rice and beans counter',
                'long benches',
                'the cold drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Poly Clinic',
            position: 'the small white block by the hostel fence',
            inside: [
                'observation beds',
                'the medicine shelf',
                'the nurse’s desk'
            ],
            room: 'clinic'
        }
    ],
    'salem-university': [
        {
            kind: 'chapel',
            name: 'The University Chapel',
            position: 'front and centre on the lawn',
            inside: [
                'wooden pews in columns',
                'the pulpit and altar table',
                'the choir bench',
                'the scripture shelf'
            ],
            room: 'chapel',
            studyLabel: 'Sit a moment in the chapel'
        },
        {
            kind: 'library',
            name: 'The Salem Library',
            position: 'beside the chapel on the central lawn',
            inside: [
                'shelf stacks by college',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'admin',
            name: 'The Administration Block',
            position: 'the first building past the gate',
            inside: [
                "the VC's office suite",
                'the registry counters',
                'the bursary windows'
            ],
            room: 'office',
            studyLabel: 'Greet the registry'
        },
        {
            kind: 'hostel',
            name: 'The Salem Hostels',
            position: 'the residential ring — every student lives on campus',
            inside: [
                'bunk rooms with lockers',
                'the common study lounge',
                'the ablution block'
            ],
            room: 'hostel',
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'The Dining Hall Canteen',
            position: 'between the hostels and the lawn',
            inside: [
                'the serving counter',
                'dining tables and benches',
                'the kitchen store'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Medical Centre',
            position: 'the quiet corner by the back fence',
            inside: [
                'observation beds',
                'the medicine cabinet',
                'the nurse’s desk'
            ],
            room: 'clinic'
        }
    ],
    'college-nursing': [
        {
            kind: 'demo-lab',
            name: 'The Demonstration Room',
            position: 'the practical wing beside the lecture hall',
            inside: [
                'demonstration beds with dummies',
                'the anatomy model and charts',
                'the scrub basins',
                'the procedure cabinet'
            ],
            room: 'demo',
            studyLabel: 'Practise at the demonstration beds'
        },
        {
            kind: 'library',
            name: 'The Nursing Library',
            position: 'the quiet block behind the classrooms',
            inside: [
                'shelf stacks of medical texts',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'admin',
            name: 'The Provost’s Office',
            position: 'the first block past the gate',
            inside: [
                "the Provost's office",
                'the admissions counters',
                'the notice board'
            ],
            room: 'office',
            studyLabel: 'Greet the Provost’s office'
        },
        {
            kind: 'clinic',
            name: 'The Practice Sick Bay',
            position: 'beside the demonstration wing',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        }
    ],
    'crowther-memorial': [
        {
            kind: 'assembly-hall',
            name: 'The Heritage Hall',
            position: 'the old hall facing the assembly ground',
            inside: [
                'the stage and podium',
                'long bench rows',
                'the honours board',
                'ceiling fans'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'science-lab',
            name: 'The Science Laboratory',
            position: 'behind the classroom block',
            inside: [
                'lab benches with gas taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'library',
            name: 'The Old Library',
            position: 'the mission-era block under the trees',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'beside the hall steps',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Principal’s Block',
            position: 'beside the gate where discipline is served',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'gyb-model-adankolo': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratories',
            position: 'the lab row behind the blocks — a science school must have them',
            inside: [
                'lab benches with gas taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the assembly ground — morning assembly you can hear three streets away',
            inside: [
                'the stage and podium',
                'long bench rows',
                'the prizes board',
                'ceiling fans'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'library',
            name: 'The Model School Library',
            position: 'behind the classroom block',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'canteen',
            name: 'The School Canteen',
            position: 'beside the hall',
            inside: [
                'the food counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Principal’s Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'faithview-academy': [
        {
            kind: 'science-lab',
            name: 'The Science Lab',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basin'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the yard',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'computer-lab',
            name: 'The ICT Lab',
            position: 'beside the hall',
            inside: [
                'bench rows of computers',
                'the instructor desk',
                'the UPS crate'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'by the gate road',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'al-azhar-college': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratory',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Main Hall',
            position: 'facing the yard',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'library',
            name: 'The Library',
            position: 'the quiet block — well stocked, the prospectus says',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'mosque',
            name: 'The Campus Mosque',
            position: 'the prayer block on the east side',
            inside: [
                'prayer mats in rows',
                'the mihrab niche',
                'the Quran shelves',
                'the ablution taps'
            ],
            room: 'mosque',
            studyLabel: 'Sit a moment in the mosque'
        },
        {
            kind: 'computer-lab',
            name: 'The Computer Lab',
            position: 'beside the library — internet-enabled, honestly',
            inside: [
                'bench rows of computers',
                'the instructor desk',
                'the UPS crate'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'hostel',
            name: 'The Boarding Hostels',
            position: 'the residential wing — a full boarding college',
            inside: [
                'bunk rooms with lockers',
                'the common lounge',
                'the ablution block'
            ],
            room: 'hostel',
            studyLabel: 'Evening prep in the common lounge'
        },
        {
            kind: 'canteen',
            name: 'The Dining Canteen',
            position: 'between the hostel wing and the classes',
            inside: [
                'the serving counter',
                'dining benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sickbay',
            position: 'by the hostel fence — qualified staff, the prospectus says',
            inside: [
                'observation beds',
                'the medicine cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'baptist-high': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratory',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'where the famous choir rehearses',
            inside: [
                'the stage and podium',
                'bench rows',
                'the choir corner',
                'ceiling fans'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'library',
            name: 'The Mission Library',
            position: 'the quiet block under the mango trees',
            inside: [
                'shelf stacks',
                'reading tables',
                'the returns desk'
            ],
            room: 'library',
            studyLabel: 'Read for a while'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'beside the hall',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Principal’s Block',
            position: 'beside the gate',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'julitola-intl': [
        {
            kind: 'science-lab',
            name: 'The Science Laboratories',
            position: 'the lab wing the prospectus calls state-of-the-art',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basins'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'computer-lab',
            name: 'The ICT Lab',
            position: 'hands-on training by IT professionals, the site says',
            inside: [
                'bench rows of computers',
                'the instructor desk',
                'the UPS crate'
            ],
            room: 'lab',
            studyLabel: 'Book a computer hour'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the yard — end-of-term party central',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'canteen',
            name: 'The Canteen',
            position: 'beside the hall',
            inside: [
                'the food counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner by the fence',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate — intercom and visitor book',
            inside: [
                "the Principal's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the principal'
        }
    ],
    'christfield-school': [
        {
            kind: 'science-lab',
            name: 'The Science Lab',
            position: 'behind the classroom block',
            inside: [
                'lab benches with taps',
                'the fume hood',
                'specimen cabinets',
                'the wash basin'
            ],
            room: 'sci-lab',
            studyLabel: 'Take a practical'
        },
        {
            kind: 'assembly-hall',
            name: 'The Assembly Hall',
            position: 'facing the yard — nursery bells to senior class',
            inside: [
                'the stage and podium',
                'bench rows',
                'the honours board'
            ],
            room: 'hall',
            studyLabel: 'Join the assembly'
        },
        {
            kind: 'canteen',
            name: 'The Tuck Shop',
            position: 'where the mothers wait at the gate',
            inside: [
                'the snacks counter',
                'a few benches',
                'the drinks fridge'
            ],
            room: 'canteen'
        },
        {
            kind: 'clinic',
            name: 'The Sick Bay',
            position: 'the quiet corner',
            inside: [
                'observation beds',
                'the first-aid cabinet',
                'the duty desk'
            ],
            room: 'clinic'
        },
        {
            kind: 'admin',
            name: 'The Admin Block',
            position: 'beside the gate',
            inside: [
                "the Head Teacher's office",
                'the staff room',
                'the records counters'
            ],
            room: 'office',
            studyLabel: 'Greet the head teacher'
        }
    ]
};
}),
"[project]/src/game/data/locations.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Lokoja city data
 * -------------------------------
 * The ten launch locations. Stage 2 renders the interactive map straight
 * from this file: mapX/mapY drive the marker positions on the stylised
 * map canvas, `transport` lists which modes can reach the location, and
 * `travelModifier` scales trip time/energy (uphill, riverside roads…).
 *
 * Each location carries its own visual identity + activity catalogue so the
 * map screen stays 100% data-driven.
 */ __turbopack_context__.s([
    "LOCATIONS",
    ()=>LOCATIONS,
    "LOCATION_BY_ID",
    ()=>LOCATION_BY_ID
]);
/* ------------------------------ school locations -----------------------------
 * Stage 7 — the schools of Lokoja join the SAME registry (additive only —
 * every existing id keeps its exact identity). Geometry comes from
 * schools.ts (real coordinates, same projection as the 3D world), so the
 * map pin, the 3D gate and the travel fare can never disagree.
 * --------------------------------------------------------------------------- */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/schools.ts [app-route] (ecmascript)");
const LOCATIONS = [
    {
        id: 'home',
        name: 'Your Place',
        shortName: 'Home',
        tagline: 'Where the hustle rests',
        description: 'A basic room you can call your own. It is not much yet — but every big name in Lokoja started somewhere.',
        color: '#1B7A43',
        accent: '#0B3D22',
        emoji: '🏠',
        unlockLevel: 1,
        mapX: 35.4,
        mapY: 55.5,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'rest',
                label: 'Rest',
                stage: 1
            },
            {
                key: 'sleep',
                label: 'Sleep till morning',
                stage: 1
            },
            {
                key: 'upgrade',
                label: 'Upgrade home',
                stage: 4
            }
        ]
    },
    {
        id: 'kpata-market',
        name: 'Kpata Market',
        shortName: 'Kpata',
        tagline: 'The heartbeat of Lokoja commerce',
        description: 'Colourful stalls, loud traders, and the best pepper soup ingredients in Kogi State. Every hustle in this city passes through Kpata one way or another.',
        color: '#E8A317',
        accent: '#8A5A00',
        emoji: '🛒',
        unlockLevel: 1,
        mapX: 38.6,
        mapY: 56.8,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'shop-food',
                label: 'Buy food items',
                stage: 4
            },
            {
                key: 'shop-general',
                label: 'General store',
                stage: 4
            },
            {
                key: 'job-market-worker',
                label: 'Market worker shifts',
                stage: 3
            },
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            }
        ]
    },
    {
        id: 'ganaja-junction',
        name: 'Ganaja Junction',
        shortName: 'Ganaja',
        tagline: 'Where every road meets',
        description: 'The busy junction that connects Lokoja to the rest of Kogi. Keke horns, suya smoke, and delivery riders everywhere — the right place to hear today’s gist.',
        color: '#C4562A',
        accent: '#7C2D12',
        emoji: '🛺',
        unlockLevel: 1,
        mapX: 41.7,
        mapY: 64.4,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'transport-hub',
                label: 'Get transport anywhere',
                stage: 2
            },
            {
                key: 'job-delivery',
                label: 'Delivery gigs',
                stage: 3
            },
            {
                key: 'gist',
                label: 'Hear the latest gist',
                stage: 5
            }
        ]
    },
    {
        id: 'confluence',
        name: 'The Confluence',
        shortName: 'Confluence',
        tagline: 'Where the Niger kisses the Benue',
        description: 'The world-famous meeting point of two great rivers. Tourists come with cameras; fishermen come with nets. Lokoja’s proudest landmark — and your signature opportunity.',
        color: '#1F7A6D',
        accent: '#0C3B34',
        emoji: '🌊',
        unlockLevel: 1,
        mapX: 43.5,
        mapY: 74.8,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1.15,
        activities: [
            {
                key: 'fishing',
                label: 'Fishing',
                stage: 7
            },
            {
                key: 'photography',
                label: 'Riverside photography',
                stage: 7
            },
            {
                key: 'tourism',
                label: 'Guide tourists',
                stage: 7
            },
            {
                key: 'boat',
                label: 'Boat rides',
                stage: 7
            }
        ]
    },
    {
        id: 'mount-patti',
        name: 'Mount Patti',
        shortName: 'Mt. Patti',
        tagline: 'The giant that watches over Lokoja',
        description: 'The hill that guards the city, covered in green and history. The climb is not easy — but the view from the top has humbled every visitor since 1860.',
        color: '#4C7A2E',
        accent: '#27401A',
        emoji: '⛰️',
        unlockLevel: 1,
        mapX: 36.3,
        mapY: 28.1,
        transport: [
            'walk',
            'keke'
        ],
        travelModifier: 1.5,
        activities: [
            {
                key: 'hiking',
                label: 'Hike the trail',
                stage: 7
            },
            {
                key: 'photography',
                label: 'Photo spots',
                stage: 7
            },
            {
                key: 'explore',
                label: 'Explore history',
                stage: 7
            }
        ]
    },
    {
        id: 'historic-lokoja',
        name: 'Historic Lokoja',
        shortName: 'Historic',
        tagline: 'Old buildings, old stories',
        description: 'Colonial-era relics, the old European cemetery, and Lord Lugard’s rest house. Lokoja was once the capital of the Northern Protectorate — the streets still remember.',
        color: '#8A6A3B',
        accent: '#4A3418',
        emoji: '🏛️',
        unlockLevel: 2,
        mapX: 39.0,
        mapY: 41.3,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'discover',
                label: 'Discover historical sites',
                stage: 7
            },
            {
                key: 'tour',
                label: 'History tours',
                stage: 7
            }
        ]
    },
    {
        id: 'government-area',
        name: 'Government Area',
        shortName: 'GRA',
        tagline: 'GRA — where things are official',
        description: 'Quiet roads, low fences, and offices where paperwork can change your whole week. Government work is slow — but it is steady, and it comes with respect.',
        color: '#5C6E3A',
        accent: '#31401F',
        emoji: '🏢',
        unlockLevel: 3,
        mapX: 34.2,
        mapY: 53.0,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'job-govt',
                label: 'Government jobs',
                stage: 3
            },
            {
                key: 'errands',
                label: 'Official errands',
                stage: 5
            }
        ]
    },
    {
        id: 'university-area',
        name: 'University Area',
        shortName: 'Univ.',
        tagline: 'Book bright, street sharp',
        description: 'Student hostels, cheap cafés, and copy-copy shops. The campus crowd has energy — and money-making ideas that usually need one more partner.',
        color: '#7C2D6E',
        accent: '#43143B',
        emoji: '🎓',
        unlockLevel: 2,
        mapX: 19.7,
        mapY: 45.5,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'job-tutorial',
                label: 'Tutorial gigs',
                stage: 3
            },
            {
                key: 'network',
                label: 'Meet students',
                stage: 5
            },
            {
                key: 'job-photographer',
                label: 'Photography jobs',
                stage: 3
            }
        ]
    },
    {
        id: 'food-area',
        name: 'Mama’s Food Strip',
        shortName: 'Food Strip',
        tagline: 'Come hungry, leave happy',
        description: 'Bukas, suya stands and cold drinks lined side by side. The aroma alone will reset your mood — and the traders here know everybody’s business.',
        color: '#D9522B',
        accent: '#7A2A10',
        emoji: '🍲',
        unlockLevel: 1,
        mapX: 41.0,
        mapY: 58.2,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'eat',
                label: 'Eat a proper meal',
                stage: 4
            },
            {
                key: 'job-waiter',
                label: 'Restaurant shifts',
                stage: 3
            },
            {
                key: 'hustle',
                label: 'Emergency delivery hustles',
                stage: 3
            }
        ]
    },
    {
        id: 'transport-area',
        name: 'Motor Park',
        shortName: 'Motor Park',
        tagline: 'The city moves from here',
        description: 'Taxi drivers argue, keke riders load passengers, and the last bus to Abuja is always “just leaving”. If you want to move, this is where you start.',
        color: '#B0812A',
        accent: '#5C3E12',
        emoji: '🚕',
        unlockLevel: 1,
        mapX: 41.7,
        mapY: 60.9,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        activities: [
            {
                key: 'travel',
                label: 'Take a ride',
                stage: 2
            },
            {
                key: 'job-driver',
                label: 'Driver jobs',
                stage: 3
            },
            {
                key: 'job-cleaner',
                label: 'Park cleaning',
                stage: 3
            }
        ]
    }
];
const LOCATION_BY_ID = Object.fromEntries(LOCATIONS.map((l)=>[
        l.id,
        l
    ]));
;
const SCHOOL_ACTIVITIES = {
    university: [
        {
            key: 'attend-lecture',
            label: 'Attend a lecture',
            stage: 3
        },
        {
            key: 'study-library',
            label: 'Read in the library',
            stage: 3
        },
        {
            key: 'network',
            label: 'Meet students',
            stage: 3
        }
    ],
    polytechnic: [
        {
            key: 'attend-lecture',
            label: 'Attend a lecture',
            stage: 3
        },
        {
            key: 'workshop',
            label: 'Hang around the workshops',
            stage: 3
        },
        {
            key: 'network',
            label: 'Meet students',
            stage: 3
        }
    ],
    secondary: [
        {
            key: 'attend-class',
            label: 'Attend a class',
            stage: 3
        },
        {
            key: 'gist',
            label: 'Hear the school gist',
            stage: 3
        }
    ],
    college: [
        {
            key: 'attend-class',
            label: 'Attend a class',
            stage: 3
        },
        {
            key: 'study-library',
            label: 'Study in the hall',
            stage: 3
        }
    ]
};
const SCHOOL_LOCATIONS = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SCHOOL_SITES_PROJECTED"].map((s)=>({
        id: s.id,
        name: s.name,
        shortName: s.shortName,
        tagline: s.tagline,
        description: s.description,
        color: s.color,
        accent: s.accent,
        emoji: s.emoji,
        unlockLevel: s.unlockLevel,
        mapX: s.mapX,
        mapY: s.mapY,
        transport: s.transport,
        travelModifier: s.travelModifier,
        activities: SCHOOL_ACTIVITIES[s.kind]
    }));
LOCATIONS.push(...SCHOOL_LOCATIONS);
// rebuild the id map so schools are first-class citizens everywhere
for (const l of SCHOOL_LOCATIONS)LOCATION_BY_ID[l.id] = l;
/* ------------------------------ G2 — spaces breadth ----------------------------
 * Ten more real Lokoja spaces join the SAME registry (append-only law — the
 * ten launch rows + the school rows above keep their exact identity). Every
 * name below was mined from the repo's REAL geo data before it was added:
 *
 *   Adankolo / Emiwoziri / Filele / Numai / Kpatakpoli / Kpato
 *     → scripts/geo/network.json `places` (real OSM nodes, projected by the
 *       same pipeline as the 3D world — mapX/mapY below ARE that projection:
 *       mapX = 50 + x/6.2, mapY = 50 + z/6.2, rim-pulled past 272u).
 *   Maigari's Palace / Pati Ridge Hill / Sokamms Global Motel
 *     → the raw OSM tiles the pipeline was built from
 *       (scripts/geo/tiles/t_1_2d.osm, t_0_2.osm, t_1_0.osm).
 *   Township Stadium → the world's own 3D landmark
 *       (src/components/game/world/CityMesh.tsx — "Township Stadium — oval
 *       stands + green pitch + floodlights, south of the motor park"), the
 *       same facility the OSM tiles record as "Lokoja International Stadium".
 *
 * `district` claims the CHAOS zone each place honestly stands in
 * (src/game/systems/chaos.ts CHAOS_ZONE_IDS). The ten launch districts stay
 * covered by their own launch rows (id === zone id).
 * --------------------------------------------------------------------------- */ const G2_LOCATIONS = [
    {
        id: 'adankolo',
        name: 'Adankolo',
        shortName: 'Adankolo',
        tagline: 'The old campus quarter',
        description: 'A busy ward on the west side of town where student lodges squeeze between family compounds. Adankolo carries the university\u2019s first home in its name — half the okada men here know a lecturer by face.',
        color: '#2E7D5B',
        accent: '#14432E',
        emoji: '🏘️',
        unlockLevel: 1,
        mapX: 11.2,
        mapY: 40.9,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1.25,
        district: 'university-area',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'room-hunt',
                label: 'Hunt a student room',
                stage: 99
            },
            {
                key: 'campus-gist',
                label: 'Hear the campus gist',
                stage: 99
            }
        ]
    },
    {
        id: 'emiwoziri',
        name: 'Emiwoziri',
        shortName: 'Emiwoziri',
        tagline: 'Where the road kisses the river sand',
        description: 'A riverine settlement on the southern bank, past where the tar gives up. Canoes ride low with sand and firewood, and the fishermen read the water like a newspaper.',
        color: '#2C6E8A',
        accent: '#123B4C',
        emoji: '🛶',
        unlockLevel: 1,
        mapX: 57.9,
        mapY: 92.2,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.3,
        district: 'confluence',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'net-mending',
                label: 'Help mend the nets',
                stage: 99
            },
            {
                key: 'sand-landing',
                label: 'Watch the sand landing',
                stage: 99
            }
        ]
    },
    {
        id: 'filele',
        name: 'Filele',
        shortName: 'Filele',
        tagline: 'The farm road\u2019s last stop',
        description: 'A village on the north-west flank under the Patti ridge, where the city noise fades into yam mounds and cassava rows. The air smells of woodsmoke and turned earth.',
        color: '#7A8A3A',
        accent: '#3D4519',
        emoji: '🌾',
        unlockLevel: 1,
        // pulled 6.9u north-west of the raw node onto the empty NW shoulder
        // (the node crowd sits on the Felele corridor pins; same honest pull
        // the schools use — "the farm road's last stop" IS the far corner)
        mapX: 25.0,
        mapY: 5.4,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.4,
        district: 'mount-patti',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'farm-shift',
                label: 'Farm work shifts',
                stage: 99
            },
            {
                key: 'harvest-market',
                label: 'Harvest-day market',
                stage: 99
            }
        ]
    },
    {
        id: 'numai',
        name: 'Numai',
        shortName: 'Numai',
        tagline: 'Quiet streets, loud goats',
        description: 'A small settlement north-east of the Adankolo side, all footpaths, low fences and front yards. Everybody knows whose goat ate whose vegetables — and they will tell you, at length.',
        color: '#A0672E',
        accent: '#4F3113',
        emoji: '🌳',
        unlockLevel: 1,
        // pulled 3u north-east of the raw node onto the dry shoulder of the
        // stream (same honest pull the schools use — node blocked by water)
        mapX: 62.4,
        mapY: 28.7,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.2,
        district: 'university-area',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'grazing-route',
                label: 'Walk the grazing route',
                stage: 99
            },
            {
                key: 'frontyard-league',
                label: 'Front-yard football league',
                stage: 99
            }
        ]
    },
    {
        id: 'kpatakpoli',
        name: 'Kpatakpoli',
        shortName: 'Kpatakpoli',
        tagline: 'East of the bustle',
        description: 'A village quarter east of town where the compounds spread out and the sky gets bigger. Keke men negotiate hard for the trip — the road back always takes longer than the road in.',
        color: '#3F7A5C',
        accent: '#1F4030',
        emoji: '🏡',
        unlockLevel: 1,
        mapX: 75.7,
        mapY: 64.5,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.35,
        district: 'ganaja-junction',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'compound-gist',
                label: 'Compound evening gist',
                stage: 99
            },
            {
                key: 'well-queue',
                label: 'Join the well queue',
                stage: 99
            }
        ]
    },
    {
        id: 'kpato',
        name: 'Kpato',
        shortName: 'Kpato',
        tagline: 'Far side of the Otukpo road',
        description: 'A village out along the south-east road where the Lokoja-Otukpo road carries traders, timber and long-suffering goats. The junction boys here wave down every keke like a celebrity.',
        color: '#B8763A',
        accent: '#5C3A1A',
        emoji: '🐐',
        unlockLevel: 1,
        mapX: 77.7,
        mapY: 84.0,
        transport: [
            'keke',
            'taxi'
        ],
        travelModifier: 1.4,
        district: 'ganaja-junction',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'roadside-roast',
                label: 'Roadside roast stand',
                stage: 99
            },
            {
                key: 'timber-load',
                label: 'Help load timber',
                stage: 99
            }
        ]
    },
    {
        id: 'township-stadium',
        name: 'Township Stadium',
        shortName: 'Stadium',
        tagline: 'The city\u2019s roaring bowl',
        description: 'The oval stands and green pitch south of the motor park, floodlights standing tall over matchday dust. Local clubs dream here, and the stall around the back sells the coldest minerals in town.',
        color: '#3D8A37',
        accent: '#1D4519',
        emoji: '🏟️',
        unlockLevel: 1,
        // pin sits in the open parkland pocket south-east of the Motor Park — the
        // 3D landmark (CityMesh.tsx) stands in the same transport-area parkland;
        // pulled east onto dry, unobstructed canvas like the schools' rim pull
        // (the raw OSM stadium node is blocked on the grid by the Julitola pin
        // and the real river channel). Evidence stays the landmark + OSM.
        mapX: 51.0,
        mapY: 67.8,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        district: 'transport-area',
        activities: [
            {
                key: 'hustle',
                label: 'Pick up hustles',
                stage: 3
            },
            {
                key: 'morning-drill',
                label: 'Join morning drill',
                stage: 99
            },
            {
                key: 'matchday-work',
                label: 'Matchday crowd work',
                stage: 99
            }
        ]
    },
    {
        id: 'maigari-palace',
        name: "Maigari's Palace",
        shortName: 'Palace',
        tagline: 'The throne of the old town',
        description: 'The Maigari\u2019s compound — turbaned chiefs, quiet courtyards, and greeting protocols older than the state itself. Arrive with respect and both hands visible; leave with your name remembered.',
        color: '#8A3A6E',
        accent: '#451D37',
        emoji: '👑',
        unlockLevel: 2,
        // pulled 2.3u south-west off the Crowther school pin (≥6u pin law) —
        // the old town between Patti's foot and the historic quarter
        mapX: 42.6,
        mapY: 30.4,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1,
        district: 'historic-lokoja',
        activities: [
            {
                key: 'greeting',
                label: 'Pay your respect',
                stage: 99
            },
            {
                key: 'palace-errand',
                label: 'Palace errands',
                stage: 99
            },
            {
                key: 'festival-grounds',
                label: 'Walk the festival grounds',
                stage: 99
            }
        ]
    },
    {
        id: 'pati-ridge-hill',
        name: 'Pati Ridge Hill',
        shortName: 'Pati Ridge',
        tagline: 'Patti\u2019s quieter shoulder',
        description: 'The lesser shoulder of the great ridge, west of the main trail. No crowds, no vendors — just wind, grass and a view that makes the whole city look like a mat weave.',
        color: '#6E5A2E',
        accent: '#372D14',
        emoji: '🥾',
        unlockLevel: 2,
        mapX: 25.2,
        mapY: 31.7,
        transport: [
            'walk',
            'keke'
        ],
        travelModifier: 1.5,
        district: 'mount-patti',
        activities: [
            {
                key: 'trail-hike',
                label: 'Hike the ridge trail',
                stage: 99
            },
            {
                key: 'photo-walk',
                label: 'Photo walk',
                stage: 99
            },
            {
                key: 'bird-watch',
                label: 'Bird watching hour',
                stage: 99
            }
        ]
    },
    {
        id: 'sokamms-motel',
        name: 'Sokamms Global Motel',
        shortName: 'Sokamms',
        tagline: 'A soft bed on the south road',
        description: 'The traveller\u2019s stop on the southern approach — painted walls, a humming generator, and a night guard who doubles as the gist channel. When home is too far, Sokamms is home enough.',
        color: '#4A6E8A',
        accent: '#243745',
        emoji: '🛏️',
        unlockLevel: 1,
        mapX: 45.0,
        mapY: 88.3,
        transport: [
            'walk',
            'keke',
            'taxi'
        ],
        travelModifier: 1.15,
        district: 'confluence',
        activities: [
            {
                key: 'day-rest',
                label: 'Take a day room',
                stage: 99
            },
            {
                key: 'gist-corner',
                label: 'Sit at the gist corner',
                stage: 99
            }
        ]
    }
];
LOCATIONS.push(...G2_LOCATIONS);
for (const l of G2_LOCATIONS)LOCATION_BY_ID[l.id] = l;
}),
"[project]/src/game/systems/rivers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M11: THE RIVERS AWAKE (pure rules)
 * -------------------------------------------------
 * The Niger has a year of its own. The green-season rains fill the river
 * through the middle of the Lokoja year, it peaks late, and the low-lying
 * city pays: the Confluence riverfront, the Ganaja road and (in the worst
 * surges) the Kpata market go under water. The city answers like the real
 * one — canoes become public transport, sandbag walkways rise from the
 * Crusher's sand, cold-room owners pass the bowl for the rescue trucks,
 * and a deep crossing earns an honest toll.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (day, state) → same answer. The river
 *    LEVEL is a pure function of the day counter (the water keeps its own
 *    calendar) — reload-proof, zero state. Only the player's fight against
 *    the water persists (sandbags, walkways, tolls, the canoe, the bowl).
 *  - The M6 flood WEATHER law stays independent: a cloudburst closes the
 *    riverfront for a day; the river season holds it for weeks. The store
 *    refuses travel if EITHER law says so — the stronger water wins.
 *  - No store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them. Every naira constant lives in config.RIVERS.
 */ __turbopack_context__.s([
    "JETTY_ID",
    ()=>JETTY_ID,
    "RIVER_ZONES",
    ()=>RIVER_ZONES,
    "availableFerryGigs",
    ()=>availableFerryGigs,
    "canContributeRescue",
    ()=>canContributeRescue,
    "canLaySegment",
    ()=>canLaySegment,
    "contributeRescueApply",
    ()=>contributeRescueApply,
    "counterFareBetween",
    ()=>counterFareBetween,
    "crossingsFor",
    ()=>crossingsFor,
    "cutZonesFor",
    ()=>cutZonesFor,
    "ferryBoard",
    ()=>ferryBoard,
    "ferryFareBetween",
    ()=>ferryFareBetween,
    "ferryFareFor",
    ()=>ferryFareFor,
    "floodBizFactor",
    ()=>floodBizFactor,
    "freshRiversState",
    ()=>freshRiversState,
    "isSurge",
    ()=>isSurge,
    "laySegmentApply",
    ()=>laySegmentApply,
    "rescueNpcFlowFor",
    ()=>rescueNpcFlowFor,
    "rescueWakes",
    ()=>rescueWakes,
    "riverLevelFor",
    ()=>riverLevelFor,
    "riverMarketMult",
    ()=>riverMarketMult,
    "riversDayRoll",
    ()=>riversDayRoll,
    "runFerryApply",
    ()=>runFerryApply,
    "segmentsLeft",
    ()=>segmentsLeft,
    "setDebugRiverLevel",
    ()=>setDebugRiverLevel,
    "setTollTierApply",
    ()=>setTollTierApply,
    "tollIncomeFor",
    ()=>tollIncomeFor,
    "walkAllowed",
    ()=>walkAllowed,
    "walkwayOpen",
    ()=>walkwayOpen,
    "zoneCut",
    ()=>zoneCut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-route] (ecmascript)");
;
;
;
;
function freshRiversState() {
    return {
        day: 0,
        sandbags: 0,
        canoe: false,
        walkways: {},
        rescue: null,
        rescuedYear: 0,
        ferryDay: 0,
        ferryDone: [],
        stats: {
            sandBought: 0,
            segmentsLaid: 0,
            tollsCollected: 0,
            ferryRuns: 0,
            ferryEarned: 0,
            rescues: 0
        }
    };
}
/* --------------------------- the river's own year -------------------------- */ const S = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].season;
/**
 * The season base level for a year-day (1–72): dry through the first
 * stretch, a steady green-season rise, the peak sits through Lokoja's
 * flood months, then the river walks back into its banks before the
 * year turns. Deterministic and wrap-safe — New Year's Day is DRY, so
 * the calendar's festivals never drown.
 */ function seasonBaseFor(yearDay) {
    if (yearDay < S.riseStart) return 0;
    if (yearDay < S.peakStart) {
        const t = (yearDay - S.riseStart) / (S.peakStart - S.riseStart);
        return t * t * (3 - 2 * t) // smoothstep — the rise gathers itself
        ;
    }
    if (yearDay < S.recedeStart) return 1;
    if (yearDay < S.dryBy) {
        const t = (yearDay - S.recedeStart) / (S.dryBy - S.recedeStart);
        return 1 - t * t * (3 - 2 * t) // smoothstep — the water lets go
        ;
    }
    return 0;
}
const unit = (...nums)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])(...nums) / 0xffffffff;
/** A debug override for E2E determinism ONLY (never game code). */ let debugLevel = null;
function setDebugRiverLevel(v) {
    debugLevel = v;
}
function riverLevelFor(day) {
    if (debugLevel !== null) return Math.min(1, Math.max(0, debugLevel));
    const base = seasonBaseFor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["yearDayOf"])(day));
    if (base <= 0) return 0;
    const breath = (unit('river', day) * 2 - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].wobble;
    return Math.min(1, Math.max(0, base + breath));
}
const RIVER_ZONES = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].cutAt);
function zoneCut(day, zoneId) {
    const cutAt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].cutAt[zoneId];
    if (cutAt === undefined) return false;
    return riverLevelFor(day) >= cutAt;
}
function cutZonesFor(day) {
    return RIVER_ZONES.filter((z)=>zoneCut(day, z));
}
function isSurge(day) {
    return cutZonesFor(day).length > 0;
}
/* ------------------------------- walkway laws ------------------------------ */ function walkwayFor(rivers, zoneId) {
    return rivers.walkways[zoneId] ?? {
        laid: 0,
        tollTier: 0,
        pot: 0,
        tollDay: 0
    };
}
function segmentsLeft(rivers, zoneId) {
    const need = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].segments[zoneId] ?? 0;
    return Math.max(0, need - walkwayFor(rivers, zoneId).laid);
}
function walkwayOpen(rivers, zoneId) {
    return segmentsLeft(rivers, zoneId) === 0 && (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].segments[zoneId] ?? 0) > 0;
}
function walkAllowed(rivers, day, zoneId) {
    return zoneCut(day, zoneId) && walkwayOpen(rivers, zoneId);
}
function canLaySegment(rivers, day, zoneId, standingIn, sacks) {
    if (standingIn !== zoneId) return {
        ok: false,
        why: 'You have to stand in the water to lay the bags.'
    };
    if (!zoneCut(day, zoneId)) return {
        ok: false,
        why: 'The river is in its banks here — no bags needed.'
    };
    if (walkwayOpen(rivers, zoneId)) return {
        ok: false,
        why: 'This crossing is already open — the bags dey hold.'
    };
    if (sacks < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment) return {
        ok: false,
        why: `One segment needs ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment} sacks of Crusher sand.`
    };
    return {
        ok: true,
        why: ''
    };
}
function laySegmentApply(rivers, zoneId) {
    const w = walkwayFor(rivers, zoneId);
    return {
        ...rivers,
        sandbags: rivers.sandbags - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].sacksPerSegment,
        walkways: {
            ...rivers.walkways,
            [zoneId]: {
                ...w,
                laid: w.laid + 1
            }
        },
        stats: {
            ...rivers.stats,
            segmentsLaid: rivers.stats.segmentsLaid + 1
        }
    };
}
function crossingsFor(zoneId, day) {
    const level = riverLevelFor(day);
    const u = unit('toll', zoneId, day);
    return Math.max(0, Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].tollCrossingsMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].tollCrossingsMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].tollCrossingsMin) * level));
}
function tollIncomeFor(rivers, zoneId, day) {
    if (!zoneCut(day, zoneId) || !walkwayOpen(rivers, zoneId)) return 0;
    const w = walkwayFor(rivers, zoneId);
    const tier = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[w.tollTier] ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers[0];
    return crossingsFor(zoneId, day) * tier;
}
function setTollTierApply(rivers, zoneId, tierIndex) {
    const w = walkwayFor(rivers, zoneId);
    const clamped = Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].tollTiers.length - 1, Math.max(0, tierIndex));
    return {
        ...rivers,
        walkways: {
            ...rivers.walkways,
            [zoneId]: {
                ...w,
                tollTier: clamped
            }
        }
    };
}
function counterFareBetween(fromId, toId) {
    const a = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][fromId];
    const b = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][toId];
    if (!a || !b) return 0;
    const params = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ECONOMY"].transport['taxi'];
    const km = Math.hypot(b.mapX - a.mapX, b.mapY - a.mapY) * __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TRAVEL"].kmPerMapUnit;
    return params.cost.base + params.cost.perKm * km;
}
function ferryFareBetween(fromId, toId, day) {
    return ferryFareFor(counterFareBetween(fromId, toId), day);
}
function ferryFareFor(counterFare, day) {
    const level = riverLevelFor(day);
    const mult = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].ferryFareMult + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].ferryLevelPremium * level;
    return Math.max(10, Math.round(counterFare * mult / 10) * 10);
}
const JETTY_ID = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].jettyId;
function ferryBoard(day, cutZones) {
    if (cutZones.length === 0) return [];
    const gigs = [];
    for(let i = 0; i < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].ferryGigsPerDay; i++){
        const idx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('ferry', day, i) % cutZones.length;
        const zoneId = cutZones[idx];
        gigs.push({
            id: `ferry-${day}-${i}`,
            day,
            toId: zoneId,
            payout: ferryFareBetween(JETTY_ID, zoneId, day),
            energyCost: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].ferryEnergy,
            level: riverLevelFor(day)
        });
    }
    return gigs;
}
function rescueWakes(day) {
    return riverLevelFor(day) >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.triggerLevel;
}
function canContributeRescue(rivers, day, standingIn) {
    const r = rivers.rescue;
    if (!r) return {
        ok: false,
        why: 'No rescue running — the water has not reached the freezers.'
    };
    if (r.zoneId !== standingIn) return {
        ok: false,
        why: 'The bowl passes at the cold rooms — go there in person.'
    };
    if (r.contribDays.includes(day)) return {
        ok: false,
        why: 'You don give today — the cold-room owners dey grateful.'
    };
    return {
        ok: true,
        why: ''
    };
}
function contributeRescueApply(rivers, day, amount) {
    if (!rivers.rescue) return rivers;
    return {
        ...rivers,
        rescue: {
            ...rivers.rescue,
            pool: rivers.rescue.pool + amount,
            contribDays: [
                ...rivers.rescue.contribDays,
                day
            ]
        }
    };
}
function rescueNpcFlowFor(year, day) {
    const u = unit('rescue', year, day);
    return Math.round((__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.npcMin + u * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.npcMax - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.npcMin)) / 10) * 10;
}
function floodBizFactor(rivers, zoneId, day) {
    const cutAt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].cutAt[zoneId];
    if (cutAt === undefined) return 1;
    const level = riverLevelFor(day);
    if (level < cutAt) return 1;
    const saved = rivers.rescuedYear === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["yearOf"])(day);
    return saved ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.savedIncomeFactor : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.floodIncomeFactor;
}
function riverMarketMult(day) {
    const level = riverLevelFor(day);
    if (level <= 0) return 1;
    return Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].marketMultCap, 1 + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].marketMultPerLevel * level);
}
function riversDayRoll(rivers, day) {
    if (day <= rivers.day) {
        return {
            next: rivers,
            flooded: null,
            drained: null,
            rescueDone: null,
            rescueWake: null,
            damp: riverLevelFor(day) >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].dampLevel,
            relief: false
        };
    }
    const prev = rivers.day > 0 ? rivers.day : day - 1;
    const levelToday = riverLevelFor(day);
    const levelYesterday = riverLevelFor(prev);
    const year = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["yearOf"])(day);
    let next = {
        ...rivers,
        walkways: {
            ...rivers.walkways
        }
    };
    let flooded = null;
    let drained = null;
    let rescueDone = null;
    let rescueWake = null;
    // cut/drain narrations — a zone crossing its line is a city event
    for (const zoneId of RIVER_ZONES){
        const cutAt = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].cutAt[zoneId];
        const wasCut = levelYesterday >= cutAt && riverLevelFor(prev) >= cutAt;
        const isCut = levelToday >= cutAt;
        if (isCut && !wasCut) flooded = {
            zoneId
        };
        if (!isCut && wasCut && levelYesterday >= cutAt) drained = {
            zoneId
        };
    }
    // 1 + 2 — the rescue bowl
    const r = next.rescue;
    if (r) {
        const stillDeep = levelYesterday >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.triggerLevel && year === r.year;
        if (stillDeep) {
            const pooled = r.pool + rescueNpcFlowFor(r.year, prev);
            if (pooled >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.poolTarget) {
                rescueDone = {
                    zoneId: r.zoneId
                };
                next = {
                    ...next,
                    rescue: null,
                    rescuedYear: r.year,
                    stats: {
                        ...next.stats,
                        rescues: next.stats.rescues + 1
                    }
                };
            } else {
                next = {
                    ...next,
                    rescue: {
                        ...r,
                        pool: pooled
                    }
                };
            }
        } else {
            // the surge ended (or the year turned) — the bowl dissolves, honest
            next = {
                ...next,
                rescue: null
            };
        }
    }
    if (!next.rescue && rescueWakes(day) && next.rescuedYear !== year) {
        next = {
            ...next,
            rescue: {
                zoneId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.zoneId,
                year,
                pool: 0,
                contribDays: []
            }
        };
        rescueWake = {
            zoneId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].rescue.zoneId
        };
    }
    // 3 — the toll bowls take yesterday's crossings (while the water held)
    for (const [zoneId, w] of Object.entries(next.walkways)){
        const income = tollIncomeFor(next, zoneId, prev);
        if (income > 0) {
            next.walkways[zoneId] = {
                ...w,
                pot: w.pot + income,
                tollDay: prev
            };
        }
    }
    const damp = levelToday >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].dampLevel;
    const relief = levelYesterday >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].reliefBelow && levelToday < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RIVERS"].reliefBelow;
    return {
        next: {
            ...next,
            day
        },
        flooded,
        drained,
        rescueDone,
        rescueWake,
        damp,
        relief
    };
}
function runFerryApply(rivers, day, gigId) {
    const done = rivers.ferryDay === day ? rivers.ferryDone : [];
    return {
        ...rivers,
        ferryDay: day,
        ferryDone: [
            ...done,
            gigId
        ],
        stats: {
            ...rivers.stats,
            ferryRuns: rivers.stats.ferryRuns + 1
        }
    };
}
function availableFerryGigs(rivers, day, cutZones) {
    const done = rivers.ferryDay === day ? rivers.ferryDone : [];
    return ferryBoard(day, cutZones).filter((g)=>!done.includes(g.id));
}
}),
"[project]/src/game/systems/education.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M12: THE LADDER — EDUCATION (pure rules)
 * -------------------------------------------------------
 * FUL runs a semester clock: enroll → attend lectures (real smart-skill
 * XP + the tutorial stipend) → the ASUU strike freezes the gate
 * (deterministic per semester — the union never asks permission) → the
 * exam window reads the semester's work (smart + lectures, an honest
 * bar, no dice) → pass climbs the ladder, fail repeats the semester →
 * the fourth pass calls the convocation → the certificate opens the
 * career jobs. Eight lectures in one semester earns the Dean's hustle
 * grant — the marketing ground zero pays its students.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the semester's phase, the strike, and the
 *    exam verdict are DERIVED from (day, semesterStartDay, smart) — zero
 *    strike state, reload-proof by construction.
 *  - The exam is not a lottery: it reads the semester's work. Skipped
 *    lectures are failed exam questions.
 *  - No store, no React, no DOM. Every constant lives in config.LADDER.
 */ __turbopack_context__.s([
    "absoluteSemesterIndex",
    ()=>absoluteSemesterIndex,
    "attendLectureApply",
    ()=>attendLectureApply,
    "canAttendConvocation",
    ()=>canAttendConvocation,
    "canAttendLecture",
    ()=>canAttendLecture,
    "canEnroll",
    ()=>canEnroll,
    "canSitExam",
    ()=>canSitExam,
    "convocationApply",
    ()=>convocationApply,
    "earnsDeansGrant",
    ()=>earnsDeansGrant,
    "enrollApply",
    ()=>enrollApply,
    "examApply",
    ()=>examApply,
    "examPasses",
    ()=>examPasses,
    "examScore",
    ()=>examScore,
    "freshEducationState",
    ()=>freshEducationState,
    "grantApply",
    ()=>grantApply,
    "isExamWindow",
    ()=>isExamWindow,
    "isLectureWindow",
    ()=>isLectureWindow,
    "isStrikeDay",
    ()=>isStrikeDay,
    "semesterDayOf",
    ()=>semesterDayOf,
    "strikeDaysLeft",
    ()=>strikeDaysLeft,
    "strikeForSemester",
    ()=>strikeForSemester
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
;
;
const E = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LADDER"].education;
function freshEducationState() {
    return {
        enrolled: false,
        semester: 1,
        semesterStartDay: 0,
        lecturesDone: 0,
        lastLectureDay: 0,
        lastGrantSemester: 0,
        examsPassed: 0,
        failedExams: 0,
        graduated: false,
        convocationDay: null,
        convocationAttended: false,
        stats: {
            lectures: 0,
            semestersPassed: 0,
            examSits: 0
        }
    };
}
function absoluteSemesterIndex(ed) {
    return ed.examsPassed + ed.semester;
}
function semesterDayOf(ed, day) {
    if (!ed.enrolled || ed.graduated) return 0;
    return Math.max(0, day - ed.semesterStartDay + 1);
}
function isLectureWindow(ed, day) {
    const d = semesterDayOf(ed, day);
    return d >= 1 && d <= E.semesterDays - E.examDays;
}
function isExamWindow(ed, day) {
    const d = semesterDayOf(ed, day);
    return d > E.semesterDays - E.examDays && d <= E.semesterDays;
}
function strikeForSemester(semesterIndex) {
    const roll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('asuu', semesterIndex) / 0xffffffff;
    if (roll >= E.strikeChance) return {
        active: false
    };
    const lenRoll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('asuu-len', semesterIndex) / 0xffffffff;
    const length = E.strikeMinDays + Math.floor(lenRoll * (E.strikeMaxDays - E.strikeMinDays + 1));
    return {
        active: true,
        length
    };
}
function isStrikeDay(ed, day) {
    if (!ed.enrolled) return false;
    const s = strikeForSemester(absoluteSemesterIndex(ed));
    if (!s.active) return false;
    const start = ed.semesterStartDay + E.strikeStartDay - 1;
    return day >= start && day < start + s.length;
}
function strikeDaysLeft(ed, day) {
    if (!ed.enrolled) return 0;
    const s = strikeForSemester(absoluteSemesterIndex(ed));
    if (!s.active) return 0;
    const start = ed.semesterStartDay + E.strikeStartDay - 1;
    return Math.max(0, start + s.length - day);
}
function canAttendLecture(ed, day, standingAtUniversity) {
    if (!ed.enrolled) return {
        ok: false,
        why: 'You no be student yet — the FUL gate takes the enrollment fee.'
    };
    if (ed.graduated) return {
        ok: false,
        why: 'You don graduate — the certificate dey your hand already.'
    };
    if (!standingAtUniversity) return {
        ok: false,
        why: 'The lectures dey hold at FUL — travel there first.'
    };
    if (!isLectureWindow(ed, day)) return {
        ok: false,
        why: isExamWindow(ed, day) ? 'Exam season — the halls are quiet for the papers.' : 'The semester has not started yet.'
    };
    if (isStrikeDay(ed, day)) return {
        ok: false,
        why: `ASUU don lock gate — ${strikeDaysLeft(ed, day)} day${strikeDaysLeft(ed, day) === 1 ? '' : 's'} more.`
    };
    if (ed.lastLectureDay === day) return {
        ok: false,
        why: 'You don attend today one lecture already — the body needs rest.'
    };
    if (ed.lecturesDone >= E.lecturesNeeded) return {
        ok: false,
        why: 'You don cover the whole syllabus — go and write the exam.'
    };
    return {
        ok: true,
        why: ''
    };
}
function attendLectureApply(ed, day) {
    return {
        ...ed,
        lecturesDone: ed.lecturesDone + 1,
        lastLectureDay: day,
        stats: {
            ...ed.stats,
            lectures: ed.stats.lectures + 1
        }
    };
}
function earnsDeansGrant(ed) {
    return ed.lecturesDone === E.deansLectures && ed.lastGrantSemester !== absoluteSemesterIndex(ed);
}
function grantApply(ed) {
    return {
        ...ed,
        lastGrantSemester: absoluteSemesterIndex(ed)
    };
}
function examScore(smart, lecturesDone) {
    return smart + lecturesDone * 0.5;
}
function examPasses(smart, lecturesDone) {
    return examScore(smart, lecturesDone) >= E.examPassScore;
}
function canSitExam(ed, day, standingAtUniversity) {
    if (!ed.enrolled) return {
        ok: false,
        why: 'The exam hall is for students.'
    };
    if (ed.graduated) return {
        ok: false,
        why: 'You don graduate — leave the hall for those still climbing.'
    };
    if (!standingAtUniversity) return {
        ok: false,
        why: 'The exam dey hold at FUL — travel there first.'
    };
    if (!isExamWindow(ed, day)) return {
        ok: false,
        why: `The exam window opens on lecture-day ${E.semesterDays - E.examDays + 1}.`
    };
    return {
        ok: true,
        why: ''
    };
}
function examApply(ed, day, smart) {
    const passed = examPasses(smart, ed.lecturesDone);
    if (!passed) {
        return {
            next: {
                ...ed,
                failedExams: ed.failedExams + 1,
                semesterStartDay: day + 1,
                lecturesDone: 0,
                stats: {
                    ...ed.stats,
                    examSits: ed.stats.examSits + 1
                }
            },
            passed: false,
            graduatedNow: false
        };
    }
    const graduating = ed.semester >= E.semestersToGraduate;
    if (graduating) {
        return {
            next: {
                ...ed,
                examsPassed: ed.examsPassed + 1,
                graduated: true,
                convocationDay: day + E.convocationInDays,
                semesterStartDay: day + 1,
                stats: {
                    ...ed.stats,
                    examSits: ed.stats.examSits + 1,
                    semestersPassed: ed.stats.semestersPassed + 1
                }
            },
            passed: true,
            graduatedNow: true
        };
    }
    return {
        next: {
            ...ed,
            examsPassed: ed.examsPassed + 1,
            semester: ed.semester + 1,
            semesterStartDay: day + 1,
            lecturesDone: 0,
            stats: {
                ...ed.stats,
                examSits: ed.stats.examSits + 1,
                semestersPassed: ed.stats.semestersPassed + 1
            }
        },
        passed: true,
        graduatedNow: false
    };
}
function canAttendConvocation(ed, day, standingAtUniversity) {
    if (!ed.graduated) return {
        ok: false,
        why: 'The convocation is for graduates only.'
    };
    if (ed.convocationAttended) return {
        ok: false,
        why: 'You don collect the certificate — once is once.'
    };
    if (ed.convocationDay === null || day < ed.convocationDay) return {
        ok: false,
        why: `The ceremony holds in ${ed.convocationDay !== null ? Math.max(0, ed.convocationDay - day) : E.convocationInDays} day(s) — the gown dey press.`
    };
    if (!standingAtUniversity) return {
        ok: false,
        why: 'The ceremony dey at FUL — travel there first.'
    };
    return {
        ok: true,
        why: ''
    };
}
function convocationApply(ed) {
    return {
        ...ed,
        convocationAttended: true
    };
}
function canEnroll(ed, level) {
    if (ed.enrolled) return {
        ok: false,
        why: 'You dey school already — face your books.'
    };
    if (ed.graduated) return {
        ok: false,
        why: 'You don graduate — FUL no dey re-admit the certified.'
    };
    if (level < E.enrollLevel) return {
        ok: false,
        why: `The gate opens at Level ${E.enrollLevel}.`
    };
    return {
        ok: true,
        why: ''
    };
}
function enrollApply(ed, day) {
    return {
        ...freshEducationState(),
        enrolled: true,
        semester: 1,
        semesterStartDay: day + 1
    };
}
}),
"[project]/src/game/systems/housing.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M12: THE LADDER — HOUSING (pure rules)
 * -----------------------------------------------------
 * The roof over the hustle: the basic room starts as a RENT (a cycle
 * posts every N days, the landlord's wahala lands on a seeded share of
 * cycles — the spike, the leaking roof, the inspecting son), and the
 * ladder climbs by BUYING: family room → self-contain → GRA flat → the
 * Adankolo duplex. Every property carries a comfort rating that warms
 * the sleep law; furnishing tiers (fan → generator → AC) warm it further.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the wahala pick is a hash of the cycle —
 *    same cycle, same wahala, reload-proof.
 *  - The rent book is the only state: paidThrough, owed, the live
 *    wahala. Everything else derives.
 *  - No store, no React, no DOM. Every naira constant lives in config.LADDER.
 */ __turbopack_context__.s([
    "PROPERTIES",
    ()=>PROPERTIES,
    "buyPropertyApply",
    ()=>buyPropertyApply,
    "canBuyProperty",
    ()=>canBuyProperty,
    "canFurnish",
    ()=>canFurnish,
    "canPayRent",
    ()=>canPayRent,
    "canResolveWahala",
    ()=>canResolveWahala,
    "freshHousingState",
    ()=>freshHousingState,
    "furnishApply",
    ()=>furnishApply,
    "homeComfort",
    ()=>homeComfort,
    "housingDayRoll",
    ()=>housingDayRoll,
    "payRentApply",
    ()=>payRentApply,
    "propertyFor",
    ()=>propertyFor,
    "resolveWahalaApply",
    ()=>resolveWahalaApply,
    "wahalaForCycle",
    ()=>wahalaForCycle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
;
;
const H = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LADDER"].housing;
function freshHousingState() {
    return {
        owned: null,
        furnishing: {},
        rentPaidThrough: 0,
        lastPostedDay: 0,
        rentOwed: 0,
        wahala: null,
        stats: {
            rentPaid: 0,
            wahalaResolved: 0,
            cyclesLate: 0
        }
    };
}
const PROPERTIES = H.properties;
function propertyFor(id) {
    return PROPERTIES.find((p)=>p.id === id) ?? null;
}
function homeComfort(housing) {
    if (!housing.owned) return 0;
    const prop = propertyFor(housing.owned);
    if (!prop) return 0;
    const tier = housing.furnishing[housing.owned] ?? 0;
    const tierDef = H.furnishTiers.find((f)=>f.tier === tier);
    return prop.comfort + (tierDef?.mood ?? 0);
}
function canBuyProperty(housing, propertyId, level, cash) {
    const prop = propertyFor(propertyId);
    if (!prop) return {
        ok: false,
        why: 'No such property.'
    };
    if (housing.owned === propertyId) return {
        ok: false,
        why: 'You already own this one.'
    };
    if (level < prop.level) return {
        ok: false,
        why: `${prop.name} unlocks at Level ${prop.level}.`
    };
    if (cash < prop.price) return {
        ok: false,
        why: `The agent wants ${prop.price.toLocaleString()} naira for ${prop.name}.`
    };
    return {
        ok: true,
        why: ''
    };
}
function buyPropertyApply(housing, propertyId) {
    return {
        ...housing,
        owned: propertyId
    };
}
function canFurnish(housing, tier) {
    if (!housing.owned) return {
        ok: false,
        why: 'Furnishing is for owners — the landlord no go gree.',
        cost: 0
    };
    const current = housing.furnishing[housing.owned] ?? 0;
    if (tier !== current + 1) return {
        ok: false,
        why: current === 0 ? 'Start with tier 1 — the fan and the curtains.' : `Finish tier ${current} first.`,
        cost: 0
    };
    const def = H.furnishTiers.find((f)=>f.tier === tier);
    if (!def) return {
        ok: false,
        why: 'No such tier.',
        cost: 0
    };
    return {
        ok: true,
        why: '',
        cost: def.cost
    };
}
function furnishApply(housing, tier) {
    if (!housing.owned) return housing;
    return {
        ...housing,
        furnishing: {
            ...housing.furnishing,
            [housing.owned]: tier
        }
    };
}
function wahalaForCycle(cycle) {
    const roll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('wahala', cycle) / 0xffffffff;
    if (roll >= H.wahalaChance) return null;
    const pick = Math.floor((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('wahala-kind', cycle) / 0xffffffff * 3);
    if (pick === 0) return {
        kind: 'spike',
        cost: 0,
        note: 'The landlord don raise rent this cycle — "the dollar don enter"'
    };
    if (pick === 1) return {
        kind: 'repair',
        cost: 2000,
        note: 'The roof dey leak — the plumber wants his own money'
    };
    return {
        kind: 'inspection',
        cost: 1000,
        note: 'The landlord\'s son dey inspect — "settle small make we no stress"'
    };
}
function housingDayRoll(housing, day) {
    let next = {
        ...housing
    };
    let rentPosted = null;
    let wahalaArrived = null;
    let lateNotice = false;
    if (!next.owned) {
        // every MISSED cycle posts exactly once (a 20-day sleep lands them all)
        while(!next.owned && day > next.lastPostedDay && day >= next.lastPostedDay + H.rentCycleDays){
            const dueDay = next.lastPostedDay + H.rentCycleDays;
            const cycle = Math.floor(dueDay / H.rentCycleDays) + (dueDay % H.rentCycleDays === 0 ? 0 : 1) || Math.round(dueDay / H.rentCycleDays);
            const w = wahalaForCycle(cycle);
            const amount = w?.kind === 'spike' ? Math.round(H.baseRent * 1.15) : H.baseRent;
            next = {
                ...next,
                rentOwed: next.rentOwed + amount,
                lastPostedDay: dueDay,
                wahala: w ? {
                    day,
                    kind: w.kind,
                    cost: w.cost,
                    note: w.note
                } : null
            };
            rentPosted = {
                amount,
                cycle
            };
            if (w) wahalaArrived = w;
        }
        // the notice: two cycles behind and the landlord is done smiling
        if (next.rentOwed >= H.baseRent * 2) {
            next = {
                ...next,
                stats: {
                    ...next.stats,
                    cyclesLate: next.stats.cyclesLate + 1
                }
            };
            lateNotice = true;
        }
    }
    return {
        next,
        rentPosted,
        wahalaArrived,
        lateNotice
    };
}
function canPayRent(housing, cash) {
    if (housing.owned) return {
        ok: false,
        why: 'You own your roof — the landlord no dey your account again.',
        amount: 0
    };
    if (housing.rentOwed <= 0) return {
        ok: false,
        why: 'The rent book is clean — nothing due.',
        amount: 0
    };
    const amount = Math.min(housing.rentOwed, H.baseRent);
    if (cash < amount) return {
        ok: false,
        why: `One cycle na ${H.baseRent.toLocaleString()} — your pocket no carry am.`,
        amount
    };
    return {
        ok: true,
        why: '',
        amount
    };
}
function payRentApply(housing, amount) {
    return {
        ...housing,
        rentOwed: Math.max(0, housing.rentOwed - amount),
        rentPaidThrough: housing.rentPaidThrough + H.rentCycleDays,
        stats: {
            ...housing.stats,
            rentPaid: housing.stats.rentPaid + amount
        }
    };
}
function canResolveWahala(housing, cash) {
    if (!housing.wahala) return {
        ok: false,
        why: 'The compound is quiet — no wahala today.',
        cost: 0
    };
    if (housing.wahala.cost <= 0) return {
        ok: false,
        why: 'This wahala na rent problem — pay the rent book.',
        cost: 0
    };
    if (cash < housing.wahala.cost) return {
        ok: false,
        why: `The settlement na ${housing.wahala.cost.toLocaleString()} — your pocket no carry am.`,
        cost: housing.wahala.cost
    };
    return {
        ok: true,
        why: '',
        cost: housing.wahala.cost
    };
}
function resolveWahalaApply(housing) {
    return {
        ...housing,
        wahala: null,
        stats: {
            ...housing.stats,
            wahalaResolved: housing.stats.wahalaResolved + 1
        }
    };
}
}),
"[project]/src/game/systems/japa.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M12: THE LADDER — JAPA (pure rules)
 * --------------------------------------------------
 * The endgame gauntlet, played at the real desks: the NIMC slip at the
 * GRA office (a queue with an honest tomorrow), the passport (the
 * official window takes three days — or the street agent at Ganaja
 * takes half the money and sometimes disappears), the KGIRS clearance
 * (the taxman's signature reads your record), the police character
 * certificate (a clean fine book), and the send-off at the Motor Park
 * when the Abuja motor loads. The morning after, the first remittance
 * lands — the japa is real, and the city still needs you.
 *
 * THE MOPOL DETAIL: serve enough police shifts and the VIP escort
 * calls — every third day, the siren clears the road for your next
 * journeys (×0.8 minutes while it lasts).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the agent's honesty is a hash of
 *    (day, handle) — same day, same agent, same character.
 *  - The gauntlet is a chain: every desk refuses without the previous
 *    paper. The state is a progress ledger; nothing else persists.
 *  - No store, no React, no DOM. Every naira constant lives in config.LADDER.
 */ __turbopack_context__.s([
    "agentDelivers",
    ()=>agentDelivers,
    "canClearKgirs",
    ()=>canClearKgirs,
    "canCollectNimc",
    ()=>canCollectNimc,
    "canCollectPassport",
    ()=>canCollectPassport,
    "canGetPoliceCertificate",
    ()=>canGetPoliceCertificate,
    "canRequestNimc",
    ()=>canRequestNimc,
    "canRequestPassport",
    ()=>canRequestPassport,
    "canRunEscort",
    ()=>canRunEscort,
    "canTakeFlight",
    ()=>canTakeFlight,
    "canTryAgent",
    ()=>canTryAgent,
    "clearanceApply",
    ()=>clearanceApply,
    "collectNimcApply",
    ()=>collectNimcApply,
    "collectPassportApply",
    ()=>collectPassportApply,
    "escortAvailable",
    ()=>escortAvailable,
    "freshJapaState",
    ()=>freshJapaState,
    "hasPaper",
    ()=>hasPaper,
    "papersComplete",
    ()=>papersComplete,
    "policeCertificateApply",
    ()=>policeCertificateApply,
    "remittanceApply",
    ()=>remittanceApply,
    "remittanceLands",
    ()=>remittanceLands,
    "requestNimcApply",
    ()=>requestNimcApply,
    "requestPassportApply",
    ()=>requestPassportApply,
    "runEscortApply",
    ()=>runEscortApply,
    "sirenMinutesMult",
    ()=>sirenMinutesMult,
    "takeFlightApply",
    ()=>takeFlightApply,
    "tryAgentApply",
    ()=>tryAgentApply
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
;
;
const J = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LADDER"].japa;
const M = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LADDER"].mopol;
function freshJapaState() {
    return {
        nimcReadyDay: 0,
        nimcDay: 0,
        passportReadyDay: 0,
        passportDay: 0,
        agentTries: 0,
        agentScams: 0,
        clearanceDay: 0,
        policeDay: 0,
        flownDay: 0,
        remitDay: 0,
        policeShifts: 0,
        sirenUntilDay: 0,
        lastEscortDay: 0,
        stats: {
            escorts: 0,
            escortEarned: 0
        }
    };
}
function hasPaper(japa, step) {
    switch(step){
        case 'nimc':
            return japa.nimcDay > 0;
        case 'passport':
            return japa.passportDay > 0;
        case 'clearance':
            return japa.clearanceDay > 0;
        case 'police':
            return japa.policeDay > 0;
        case 'flight':
            return japa.flownDay > 0;
    }
}
function papersComplete(japa) {
    return hasPaper(japa, 'nimc') && hasPaper(japa, 'passport') && hasPaper(japa, 'clearance') && hasPaper(japa, 'police');
}
function canRequestNimc(japa, level, standingAtGrades) {
    if (hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'You get your NIMC slip already.'
    };
    if (level < J.unlockLevel) return {
        ok: false,
        why: `The JAPA desks open at Level ${J.unlockLevel}.`
    };
    if (japa.nimcReadyDay > 0) return {
        ok: false,
        why: `The slip dey print — come back in ${Math.max(1, japa.nimcReadyDay)} day(s)... the queue no dey forget anybody.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The NIMC desk dey at the Government Area — go there in person.'
    };
    return {
        ok: true,
        why: ''
    };
}
function requestNimcApply(japa, day) {
    return {
        ...japa,
        nimcReadyDay: day + J.nimcQueueDays
    };
}
function canCollectNimc(japa, day, standingAtGrades) {
    if (hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'You don collect am already.'
    };
    if (japa.nimcReadyDay === 0) return {
        ok: false,
        why: 'You never request the slip.'
    };
    if (day < japa.nimcReadyDay) return {
        ok: false,
        why: `Come back tomorrow — the queue dey move slow.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The slip collects at the Government Area desk.'
    };
    return {
        ok: true,
        why: ''
    };
}
function collectNimcApply(japa, day) {
    return {
        ...japa,
        nimcDay: day
    };
}
function canRequestPassport(japa, cash, standingAtGrades) {
    if (hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'Your passport dey your hand already.'
    };
    if (!hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'The window wants your NIMC slip first — the chain no dey skip.'
    };
    if (japa.passportReadyDay > 0) return {
        ok: false,
        why: `The passport dey process — the official window takes ${J.passportQueueDays} days.`
    };
    if (cash < J.passportFee) return {
        ok: false,
        why: `The official fee na ${J.passportFee.toLocaleString()}.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The passport window dey at the Government Area.'
    };
    return {
        ok: true,
        why: ''
    };
}
function requestPassportApply(japa, day) {
    return {
        ...japa,
        passportReadyDay: day + J.passportQueueDays
    };
}
function canCollectPassport(japa, day, standingAtGrades) {
    if (hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'You don collect am already.'
    };
    if (japa.passportReadyDay === 0) return {
        ok: false,
        why: 'You never apply.'
    };
    if (day < japa.passportReadyDay) return {
        ok: false,
        why: `The book dey print — ${japa.passportReadyDay - day} day(s) more.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The passport collects at the Government Area window.'
    };
    return {
        ok: true,
        why: ''
    };
}
function collectPassportApply(japa, day) {
    return {
        ...japa,
        passportDay: day
    };
}
function agentDelivers(day, handle) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["civicHash"])('japa-agent', day, handle ?? 'guest') / 0xffffffff < J.agentRealChance;
}
function canTryAgent(japa, cash, standingAtGanaja) {
    if (hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'You get passport already — the agent no fit help you.'
    };
    if (!hasPaper(japa, 'nimc')) return {
        ok: false,
        why: 'Even the agent wants your NIMC slip first.'
    };
    if (japa.passportReadyDay > 0) return {
        ok: false,
        why: 'Your official passport dey process — no double-book am.'
    };
    if (cash < J.agentFee) return {
        ok: false,
        why: `The agent wants ${J.agentFee.toLocaleString()} up front.`
    };
    if (!standingAtGanaja) return {
        ok: false,
        why: 'The agent dey hustle at Ganaja Junction.'
    };
    return {
        ok: true,
        why: ''
    };
}
function tryAgentApply(japa, day, handle) {
    const real = agentDelivers(day, handle);
    return {
        next: {
            ...japa,
            passportDay: real ? day : japa.passportDay,
            agentTries: japa.agentTries + 1,
            agentScams: japa.agentScams + (real ? 0 : 1)
        },
        real
    };
}
function canClearKgirs(japa, warrant, standingAtGrades) {
    if (hasPaper(japa, 'clearance')) return {
        ok: false,
        why: 'The clearance dey your file already.'
    };
    if (!hasPaper(japa, 'passport')) return {
        ok: false,
        why: 'The clearance wants your passport in the file first.'
    };
    if (warrant) return {
        ok: false,
        why: 'A tax warrant dey your name — the KGIRS pen no go move. Settle am first.'
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The clearance desk dey at the Government Area.'
    };
    return {
        ok: true,
        why: ''
    };
}
function clearanceApply(japa, day) {
    return {
        ...japa,
        clearanceDay: day
    };
}
function canGetPoliceCertificate(japa, fines, cash, standingAtGrades) {
    if (hasPaper(japa, 'police')) return {
        ok: false,
        why: 'The certificate dey your file already.'
    };
    if (!hasPaper(japa, 'clearance')) return {
        ok: false,
        why: 'The police wants the KGIRS clearance in the file first.'
    };
    if (fines > 0) return {
        ok: false,
        why: 'Your fine book no clean — settle the police first.'
    };
    if (cash < J.policeFee) return {
        ok: false,
        why: `The certificate na ${J.policeFee.toLocaleString()}.`
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The police desk dey at the Government Area.'
    };
    return {
        ok: true,
        why: ''
    };
}
function policeCertificateApply(japa, day) {
    return {
        ...japa,
        policeDay: day
    };
}
function canTakeFlight(japa, cash, standingAtPark) {
    if (japa.flownDay > 0) return {
        ok: false,
        why: 'You don fly already — the send-off na once in a life.'
    };
    if (!papersComplete(japa)) return {
        ok: false,
        why: 'The motor dey wait for the complete file — check the missing papers.'
    };
    if (cash < J.ticketFee) return {
        ok: false,
        why: `The ticket na ${J.ticketFee.toLocaleString()} — the Abuja motor no dey take credit.`
    };
    if (!standingAtPark) return {
        ok: false,
        why: 'The send-off dey at the Motor Park — where every journey starts.'
    };
    return {
        ok: true,
        why: ''
    };
}
function takeFlightApply(japa, day) {
    return {
        ...japa,
        flownDay: day
    };
}
function remittanceLands(japa, day) {
    return japa.flownDay > 0 && japa.remitDay === 0 && day > japa.flownDay;
}
function remittanceApply(japa, day) {
    return {
        ...japa,
        remitDay: day
    };
}
function escortAvailable(japa, day, warrant) {
    if (japa.policeShifts < M.shiftsToUnlock) return false;
    if (warrant) return false;
    return day % M.escortEvery === 0 && day > japa.lastEscortDay;
}
function canRunEscort(japa, day, warrant, standingAtGrades) {
    if (japa.policeShifts < M.shiftsToUnlock) return {
        ok: false,
        why: `The detail wants ${M.shiftsToUnlock} police shifts of trust — you carry ${japa.policeShifts}.`
    };
    if (warrant) return {
        ok: false,
        why: 'No escort for a wanted man — settle the taxman.'
    };
    if (!standingAtGrades) return {
        ok: false,
        why: 'The convoy assembles at the Government Area.'
    };
    if (!escortAvailable(japa, day, warrant)) return {
        ok: false,
        why: `The detail no dey today — the convoy moves every ${M.escortEvery} days.`
    };
    return {
        ok: true,
        why: ''
    };
}
function runEscortApply(japa, day) {
    return {
        ...japa,
        lastEscortDay: day,
        sirenUntilDay: day + M.sirenDays,
        stats: {
            ...japa.stats,
            escorts: japa.stats.escorts + 1,
            escortEarned: japa.stats.escortEarned + M.escortPay
        }
    };
}
function sirenMinutesMult(japa, day) {
    return japa.sirenUntilDay >= day ? M.sirenMinutesMult : 1;
}
}),
"[project]/src/game/systems/shield.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M13: THE FAMILY SHIELD (pure rules)
 * --------------------------------------------------
 * One download, three generations — Lagos Life structurally cannot
 * follow. Kids (6–12) walk a safer Lokoja: no crime road, light hustles
 * only, preset-emote socials, and the Spot-the-Scammer literacy game.
 * Teens (13–17) hustle freely but the crime road stays locked and school
 * pays better. Adults see everything. Elder mode is an accessibility
 * toggle, not a third life.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic — no store, no React, no fetch. Content
 *    gates answer honest questions; every action surface asks before it
 *    offers a band something the shield refuses.
 *  - The graph block: an adult account can NEVER contact a minor
 *    account. Not "we try to prevent" — canContact() is the single
 *    function every present and future social surface must pass through,
 *    and it is structurally false for adult→minor.
 *  - Zero minor data collection: the minor register path (server side)
 *    stores no contact and no recovery line. The parent PIN is the only
 *    key a minor account answers to.
 */ __turbopack_context__.s([
    "AGE_LAW",
    ()=>AGE_LAW,
    "CRIME_CONTENT_IDS",
    ()=>CRIME_CONTENT_IDS,
    "CRIME_REFUSALS",
    ()=>CRIME_REFUSALS,
    "HONEST_LINES",
    ()=>HONEST_LINES,
    "SCAM_LINES",
    ()=>SCAM_LINES,
    "canContact",
    ()=>canContact,
    "canHustle",
    ()=>canHustle,
    "canJapa",
    ()=>canJapa,
    "canPlayScammer",
    ()=>canPlayScammer,
    "crimeAllowed",
    ()=>crimeAllowed,
    "elderClass",
    ()=>elderClass,
    "freshShieldState",
    ()=>freshShieldState,
    "localPinHash",
    ()=>localPinHash,
    "makeLocalSalt",
    ()=>makeLocalSalt,
    "scamAnswerApply",
    ()=>scamAnswerApply,
    "scamReward",
    ()=>scamReward,
    "scamRound",
    ()=>scamRound,
    "tierGateVerdict",
    ()=>tierGateVerdict,
    "validateParentPin",
    ()=>validateParentPin
]);
const AGE_LAW = {
    kid: {
        crime: false,
        hustle: 'light',
        social: 'emotes',
        scammerFeatured: true,
        studyBoost: 1.25,
        japa: false
    },
    teen: {
        crime: false,
        hustle: 'all',
        social: 'full',
        scammerFeatured: true,
        studyBoost: 1.25,
        japa: true
    },
    adult: {
        crime: true,
        hustle: 'all',
        social: 'full',
        scammerFeatured: false,
        studyBoost: 1,
        japa: true
    }
};
const CRIME_CONTENT_IDS = [
    'night-out',
    'regatta-bet',
    'japa-agent'
];
const CRIME_REFUSALS = {
    'night-out': 'The lounge na 18+ matter — go school tomorrow, the street go wait.',
    'regatta-bet': 'Race-eve betting na 18+. Small paddies dey sponsor boat — that one better pass.',
    'japa-agent': 'No waka enter that agent office — na adult paperwork, and some of dem na 419.'
};
function crimeAllowed(band, content) {
    void content;
    return AGE_LAW[band].crime;
}
function canHustle(band, def) {
    return AGE_LAW[band].hustle === 'all' || def.kidSafe;
}
function canJapa(band) {
    return AGE_LAW[band].japa;
}
function canContact(from, to) {
    if (from === 'adult' && (to === 'kid' || to === 'teen')) return false;
    return true;
}
function validateParentPin(pin) {
    if (!/^\d{6}$/.test(pin)) return {
        ok: false,
        why: 'Parent PIN must be exactly 6 digits.'
    };
    return {
        ok: true,
        why: ''
    };
}
function localPinHash(pin, salt) {
    let h = 0x811c9dc5;
    const material = `${salt}:${pin}`;
    for(let round = 0; round < 600; round++){
        for(let i = 0; i < material.length; i++){
            h ^= material.charCodeAt(i);
            h = Math.imul(h, 0x01000193) >>> 0;
        }
        h = h + round >>> 0;
    }
    return h.toString(16).padStart(8, '0') + salt;
}
function makeLocalSalt() {
    // deterministic-safe salt for guests: mixes clock with entropy when present
    const rnd = typeof crypto !== 'undefined' && 'getRandomValues' in crypto ? Array.from(crypto.getRandomValues(new Uint8Array(6))).map((b)=>b.toString(16).padStart(2, '0')).join('') : Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
    return rnd;
}
/** The tier ladder order — kid climbs to teen climbs to adult. */ const TIER_ORDER = [
    'kid',
    'teen',
    'adult'
];
function tierGateVerdict(from, to, parentPinOk) {
    if (from === to) return {
        allowed: false,
        why: 'You don dey that tier already.'
    };
    const up = TIER_ORDER.indexOf(to) > TIER_ORDER.indexOf(from);
    if (up && from !== 'adult') {
        return parentPinOk ? {
            allowed: true,
            why: ''
        } : {
            allowed: false,
            why: 'A parent must unlock that tier — enter the Parent PIN.'
        };
    }
    return {
        allowed: true,
        why: ''
    };
}
function elderClass(on) {
    return on ? 'elder-mode' : null;
}
const SCAM_LINES = [
    {
        text: 'You don win MTN promo! Send ₦2,000 activation fee make I release the ₦500,000.',
        why: 'No real promo asks you to PAY to collect a prize. Na advance-fee fraud.'
    },
    {
        text: 'I be bank official — give me your BVN and card PIN make I clear the ₦750,000 wey dey hang.',
        why: 'Your bank will NEVER ask for your BVN or PIN. Na account takeover.'
    },
    {
        text: 'Your uncle send package from abroad — pay customs fee ₦15,000 to this personal account.',
        why: 'Customs fees no ever enter personal account. Na fake delivery scam.'
    },
    {
        text: 'Click this link sharp sharp make you claim your JAMB refund before 6pm.',
        why: 'Strange links = phishing. Dem go harvest your details. Type the site yourself or no go.'
    },
    {
        text: 'Send the naira first, the dollar go land for you tomorrow — black market rate, no inspection.',
        why: 'Nobody honest collects money before you see the goods. Na 419.'
    },
    {
        text: 'Your account go block in 24 hours unless you update am with your card PIN for this app.',
        why: 'Threat + urgency + PIN request = scam. Bank block no dey come like WhatsApp message.'
    },
    {
        text: 'I be army officer — seized phones dey sell half price, pay today, no receipt, no inspection.',
        why: 'Stolen goods + no receipt + pressure = you go lose your money (or worse).'
    },
    {
        text: 'Send me the OTP wey just enter your phone make I finish the transfer — I go send am back.',
        why: 'Your OTP na the last lock. ANYBODY wey ask for am na thief.'
    },
    {
        text: 'Pay ₦5,000 for immigration form — I go link you visa wey no get interview at all.',
        why: 'No visa skip interview by magic. Na japa scam — dem dey sweep boys with am.'
    },
    {
        text: 'Send any amount, in 30 minutes e go double — na village power from my grandfather.',
        why: 'Money no dey double by mouth. Ponzi + juju story = 419 classic.'
    },
    {
        text: 'iPhone 15 Pro ₦90k — pay today, pickup tomorrow, no come inspect am before payment o.',
        why: 'Cheap flagship + no inspection + pay-first = wrong marketplace triangle.'
    },
    {
        text: 'Your NECO result fail — pay ₦8,000 make I upgrade am for CBT office before dem seal am.',
        why: 'Result upgrade na scam AND offence — dem go collect the ₦8k plus your future.'
    }
];
const HONEST_LINES = [
    {
        text: 'Kpata market dey open every third day — the fresh pepper land that morning.',
        why: 'True market gist — no payment, no urgency, no personal account.'
    },
    {
        text: 'Make you save ₦500 every week for the bank — small drops fill big buckets.',
        why: 'Honest advice no ever ask for YOUR money to move first.'
    },
    {
        text: 'NEPA bill don land — pay am for the office for GRA, the desk no dey collect extra.',
        why: 'Real bills dey get real offices. You go see the receipt.'
    },
    {
        text: 'If anybody ask for your OTP — even if dem say na bank — block am and report.',
        why: 'This na the lesson itself: OTP na last lock, nobody legit dey ask.'
    },
    {
        text: 'Always collect your school fee receipt the same day you pay.',
        why: 'Paperwork advice — receipt dey protect you, scam dey avoid paper.'
    },
    {
        text: 'Register your SIM with your NIN at the approved centre — the service dey free.',
        why: 'Real registrations happen at centres, never by transfer to strangers.'
    },
    {
        text: 'The canoe ferry dey charge flat fare — count your change before you waka.',
        why: 'Honest street math — counting change no be crime.'
    },
    {
        text: 'The Motor Park job board dey refresh every morning — check am early.',
        why: 'Work gist wey you fit verify with your own eye.'
    },
    {
        text: 'Harmattan sun dey harsh — carry water, wear face cap.',
        why: 'Care advice. Scams dey always carry money directions, no be water.'
    },
    {
        text: 'Keep your rent receipt safe — landlord wahala dey always come one day.',
        why: 'Receipt na shield. 419 no like anything wey leave paper trail.'
    },
    {
        text: 'Baba T dey wash keke for the compound — ₦800, ask anybody for there.',
        why: 'Real service = real place + verifiable person + agreed price.'
    },
    {
        text: 'The library dey open till evening — free past questions dey the shelf.',
        why: 'Free, checkable, no money path. That na honest street offer.'
    }
];
/** mulberry32 — tiny deterministic PRNG (fixed seed keeps the lesson stable). */ function mulberry32(seed) {
    let a = seed >>> 0;
    return ()=>{
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
function scamRound(day) {
    const rng = mulberry32(Math.imul(day + 1, 2654435761) >>> 0);
    const scam = SCAM_LINES[Math.floor(rng() * SCAM_LINES.length)];
    const h1 = HONEST_LINES[Math.floor(rng() * HONEST_LINES.length)];
    let h2 = HONEST_LINES[Math.floor(rng() * HONEST_LINES.length)];
    if (h2.text === h1.text) h2 = HONEST_LINES[(HONEST_LINES.indexOf(h2) + 3) % HONEST_LINES.length];
    const cards = [
        {
            text: scam.text,
            scam: true,
            why: scam.why
        },
        {
            text: h1.text,
            scam: false,
            why: h1.why
        },
        {
            text: h2.text,
            scam: false,
            why: h2.why
        }
    ];
    // seeded shuffle (Fisher–Yates with the same rng — deterministic)
    for(let i = cards.length - 1; i > 0; i--){
        const j = Math.floor(rng() * (i + 1));
        [cards[i], cards[j]] = [
            cards[j],
            cards[i]
        ];
    }
    return {
        day,
        options: cards,
        scamIndex: cards.findIndex((c)=>c.scam)
    };
}
function scamReward(streakBefore) {
    const capped = Math.min(streakBefore, 10);
    const cash = 150 + 25 * capped;
    return {
        cash,
        smartXp: 8,
        mood: 2
    };
}
function canPlayScammer(lastPlayedDay, day) {
    return lastPlayedDay !== day;
}
function freshShieldState() {
    return {
        scammerDay: 0,
        scammerCorrect: 0,
        scammerWrong: 0,
        scammerStreak: 0,
        parentPinHash: null
    };
}
function scamAnswerApply(state, round, pickIndex, day) {
    const picked = round.options[pickIndex];
    if (picked.scam) {
        const reward = scamReward(state.scammerStreak);
        return {
            next: {
                ...state,
                scammerDay: day,
                scammerCorrect: state.scammerCorrect + 1,
                scammerStreak: state.scammerStreak + 1
            },
            correct: true,
            reward,
            lesson: picked.why
        };
    }
    const honest = round.options[round.scamIndex];
    return {
        next: {
            ...state,
            scammerDay: day,
            scammerWrong: state.scammerWrong + 1,
            scammerStreak: 0
        },
        correct: false,
        reward: null,
        lesson: honest.why
    };
}
}),
"[project]/src/game/systems/pulse.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M15: THE CITY PULSE (pure rules)
 * ------------------------------------------------
 * The civic mesh already LIVES — transformers blow (M8), the Niger
 * rises (M11), the calendar dances (M10), the market breathes (M2).
 * The Pulse is the city's own newspaper: the SAME deterministic facts,
 * rewritten as shareable news. Zero new simulation, zero new state —
 * the feed derives from the day + the slices the game already keeps.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: the same city state yields the same
 *    feed, byte for byte. A test can pin a day and know the news.
 *  - The city's PRIVATE books stay OUT of the paper: bills, taxes,
 *    fines and the player's wallet never become headlines. The Pulse
 *    reports the city (outages, rivers, festivals, market, scarcity),
 *    not the player.
 *  - Weight law: a blown transformer outranks a flood warning, which
 *    outranks a festival, which outranks the market. Ties break by id
 *    (a total order — the feed is sortable and testable).
 *  - Read-marking is idempotent: marking a feed you already marked
 *    changes nothing, and the unread count never counts yesterday.
 *  - KNOW YOUR CITY: the share card's percent reads REAL persisted
 *    facts only (biz, garage, festivals, rivers, school, home, JAPA,
 *    MOPOL, the ledger). No invented progress, no vanity rounding.
 */ __turbopack_context__.s([
    "cityChecklist",
    ()=>cityChecklist,
    "cityGrade",
    ()=>cityGrade,
    "cityKnowledge",
    ()=>cityKnowledge,
    "freshPulseState",
    ()=>freshPulseState,
    "markPulseRead",
    ()=>markPulseRead,
    "pulseForDay",
    ()=>pulseForDay,
    "pulseUnread",
    ()=>pulseUnread
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-route] (ecmascript)");
;
;
;
;
;
const zoneName = (zoneId)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][zoneId]?.name ?? zoneId;
function pulseForDay(input) {
    const { day, weather, chaos, civic, rivers, calendar } = input;
    const items = [];
    // 1) THE BLAST — a transformer is dark RIGHT NOW (the M8 outage law)
    if (chaos.active && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["blackoutAt"])(chaos, chaos.active.zoneId, day)) {
        const z = chaos.active.zoneId;
        items.push({
            id: `${day}:blast:${z}`,
            kind: 'blast',
            icon: '⚡',
            headline: `Transformer don blow for ${zoneName(z)}!`,
            body: `The whole area don go dark. Community dey gather ₦${chaos.active.pool.toLocaleString('en-NG')} for the technician — ₦500/₦1k/₦2.5k in person.`,
            zoneId: z,
            w: 100
        });
    }
    // 2) UP NEPA — the light came back THIS morning (the M8 fix book)
    const backToday = chaos.recent.find((r)=>r.untilDay === day - 1);
    if (backToday) {
        items.push({
            id: `${day}:upnepa:${backToday.zoneId}`,
            kind: 'upnepa',
            icon: '💡',
            headline: `UP NEPA! ${zoneName(backToday.zoneId)} don get light back`,
            body: backToday.fixedBy === 'community' ? 'The community pool paid the technician — the street dey shine again.' : 'The disco finally rolled the truck — the street dey shine again.',
            zoneId: backToday.zoneId,
            w: 80
        });
    }
    // 3) THE FLOOD — the Niger speaks for itself (the M11 cut law)
    const cuts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cutZonesFor"])(day);
    if (weather === 'flood' || cuts.length > 0) {
        items.push({
            id: `${day}:flood`,
            kind: 'flood',
            icon: '🌊',
            headline: cuts.length > 0 ? `The Niger don rise — ${cuts.map(zoneName).join(' + ')} dey cut` : 'The Niger don rise — watch the low streets',
            body: cuts.length > 0 ? `Land transport no go pass there today. The canoe ferry dey run from the jetty — river level ${Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["riverLevelFor"])(day) * 100)}%.` : `River level ${Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["riverLevelFor"])(day) * 100)}% — the low streets go cut soon. Buy sand early.`,
            zoneId: cuts[0] ?? null,
            w: 95
        });
    }
    // 4) THE STORM — heavy sky warning (the M8 blowout window)
    if (weather === 'storm') {
        items.push({
            id: `${day}:storm`,
            kind: 'storm',
            icon: '⛈️',
            headline: 'Heavy sky dey hang over the city',
            body: 'Storm days don blow transformers before. Hold your people close — and maybe drop ₦500 in the light fund early.',
            zoneId: null,
            w: 70
        });
    }
    // 5) THE FUEL PAPER — scarcity is public math (the M8 scarcity law)
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isScarcityDay"])(day)) {
        items.push({
            id: `${day}:fuel`,
            kind: 'fuel',
            icon: '⛽',
            headline: 'Fuel scarce today — pump don dry for Ganaja',
            body: `Black market dey sell ×${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fuelMultFor"])(day).toFixed(1)}. ATM dey cap ₦${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].atmCap.toLocaleString('en-NG')} — POS agents don price am.`,
            zoneId: 'ganaja-junction',
            w: 85
        });
    }
    // 6) THE MARKET — market day + the day's flavour event (the M2 roll)
    if (civic.market.marketDay) {
        items.push({
            id: `${day}:market`,
            kind: 'market',
            icon: '🧺',
            headline: 'Market day for Kpata — prices don soft',
            body: 'The whole street don turn bazaar. Same goods, softer prices — carry your bag.',
            zoneId: 'kpata-market',
            w: 50
        });
    } else if (civic.market.event) {
        items.push({
            id: `${day}:market-event`,
            kind: 'market',
            icon: civic.market.event.icon || '🧺',
            headline: civic.market.event.label,
            body: civic.market.event.note,
            zoneId: 'kpata-market',
            w: 55
        });
    }
    // 7) THE FESTIVAL — today's day-festival (the M10 calendar)
    const fest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["festivalForDay"])(day);
    if (fest && fest.daysLeft <= 1) {
        items.push({
            id: `${day}:festival:${fest.id}`,
            kind: 'festival',
            icon: fest.icon,
            headline: `${fest.name} dey ${zoneName(fest.venueId)} today!`,
            body: fest.note,
            zoneId: fest.venueId,
            w: 60
        });
    }
    // 8) THE WEDDING — the compound with canopies (the M10 cycle law)
    const wedding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["weddingForCycle"])(day);
    if (wedding.isToday) {
        items.push({
            id: `${day}:wedding:${wedding.id}`,
            kind: 'wedding',
            icon: '💍',
            headline: `${wedding.couple} dey wed for ${zoneName(wedding.venueId)} today!`,
            body: 'Aso-ebi dey Kpata — gift well and the respect go follow you.',
            zoneId: wedding.venueId,
            w: 55
        });
    }
    // 9) THE PAVING — the town union's live project (the M10 season)
    if (calendar.paving && calendar.paving.zoneId && calendar.paving.cycle === (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pavingCycleOf"])(day)) {
        items.push({
            id: `${day}:paving:${calendar.paving.zoneId}`,
            kind: 'paving',
            icon: '🛣️',
            headline: `Town union dey pave ${zoneName(calendar.paving.zoneId)}`,
            body: `₦${calendar.paving.pool.toLocaleString('en-NG')} don enter the project pool — the street go ride smooth for 20 days when e finish.`,
            zoneId: calendar.paving.zoneId,
            w: 40
        });
    }
    // 10) AJO DAY — the circles settle (the M8 payout law)
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPayoutDay"])(day)) {
        items.push({
            id: `${day}:ajo`,
            kind: 'ajo',
            icon: '🤝',
            headline: 'Ajo payout day — the circles don settle',
            body: `Every ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAOS"].payoutEvery} days the ajo lands. Market go busy (softer prices), and pockets go full.`,
            zoneId: null,
            w: 45
        });
    }
    // the weight law: louder first, ties break by id — a total order
    items.sort((a, b)=>b.w - a.w || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    if (items.length === 0) {
        items.push({
            id: `${day}:quiet`,
            kind: 'quiet',
            icon: '🌤️',
            headline: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSurge"])(day) ? 'The river dey watch — quiet day for the city' : 'Nothing dey shake the city today',
            body: 'Quiet days na for hustle. The pulse go shout when the city shake.',
            zoneId: null,
            w: 0
        });
    }
    return items;
}
function markPulseRead(pulse, day, items) {
    const ids = items.map((i)=>i.id);
    const seen = new Set(pulse.seen);
    for (const id of ids)seen.add(id);
    return {
        ...pulse,
        readDay: day,
        seen: [
            ...seen
        ].slice(-64)
    };
}
function pulseUnread(pulse, items) {
    const seen = new Set(pulse.seen);
    return items.filter((i)=>!seen.has(i.id)).length;
}
function cityChecklist(player, slices) {
    const p = player;
    const c = slices.calendar;
    const r = slices.rivers;
    return [
        {
            id: 'biz',
            label: 'Open your own shop',
            done: p.businesses.length > 0
        },
        {
            id: 'vehicle',
            label: 'Own a ride',
            done: p.vehicles.length > 0
        },
        {
            id: 'job',
            label: 'Finish a real job',
            done: p.stats.jobsCompleted > 0
        },
        {
            id: 'hustle',
            label: 'Finish a street hustle',
            done: p.stats.hustlesCompleted > 0
        },
        {
            id: 'earned',
            label: 'Earn ₦50k lifetime',
            done: p.stats.totalEarned >= 50_000
        },
        {
            id: 'bank',
            label: 'Keep money in the bank',
            done: p.bankBalance > 0
        },
        {
            id: 'friends',
            label: 'Know 3 people by name',
            done: Object.keys(p.relationships).length >= 3
        },
        {
            id: 'festival',
            label: 'Attend a festival',
            done: c.stats.festivalsAttended > 0
        },
        {
            id: 'wedding',
            label: 'Attend a wedding',
            done: c.stats.weddings > 0
        },
        {
            id: 'regatta',
            label: 'Back a regatta crew',
            done: c.sponsored.length > 0 || c.stats.regattaWins > 0
        },
        {
            id: 'paving',
            label: 'Help pave a street',
            done: c.stats.projectsDone > 0
        },
        {
            id: 'surge',
            label: 'Fight the river surge',
            done: r.stats.sandBought > 0 || Object.keys(r.walkways).length > 0
        },
        {
            id: 'ferry',
            label: 'Run the canoe ferry',
            done: r.stats.ferryRuns > 0
        },
        {
            id: 'rescue',
            label: 'Save the cold rooms',
            done: r.stats.rescues > 0
        },
        {
            id: 'school',
            label: 'Sit a FUL exam',
            done: slices.education.examsPassed > 0 || slices.education.graduated
        },
        {
            id: 'home',
            label: 'Own your own place',
            done: slices.housing.owned !== null
        },
        {
            id: 'papers',
            label: 'Start the JAPA papers',
            done: slices.japa.passportDay > 0 || slices.japa.nimcDay > 0
        },
        {
            id: 'mopol',
            label: 'Serve a MOPOL shift',
            done: slices.japa.policeShifts > 0
        },
        {
            id: 'grid',
            label: 'Feed the light fund',
            done: slices.chaos.stats.contributed > 0
        }
    ];
}
function cityGrade(percent) {
    if (percent >= 100) return 'Confluence Legend';
    if (percent >= 75) return 'Indigene';
    if (percent >= 50) return 'Waka Rider';
    if (percent >= 25) return 'Walker';
    return 'Visitor';
}
function cityKnowledge(player, slices) {
    const checks = cityChecklist(player, slices);
    const checked = checks.filter((c)=>c.done).length;
    const percent = Math.round(checked / checks.length * 100);
    return {
        percent,
        grade: cityGrade(percent),
        checked,
        total: checks.length,
        checks
    };
}
function freshPulseState() {
    return {
        readDay: 0,
        seen: [],
        arrivals: [],
        stats: {
            shares: 0,
            arrivalsIn: 0
        }
    };
}
}),
"[project]/src/game/systems/fortress.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CHAIN_SEED",
    ()=>CHAIN_SEED,
    "FORTRESS_KEYS",
    ()=>FORTRESS_KEYS,
    "FORT_KEY_STORAGE",
    ()=>FORT_KEY_STORAGE,
    "anomalyVerdict",
    ()=>anomalyVerdict,
    "benchSign",
    ()=>benchSign,
    "chainHash",
    ()=>chainHash,
    "chainNext",
    ()=>chainNext,
    "configFingerprint",
    ()=>configFingerprint,
    "freshFortressState",
    ()=>freshFortressState,
    "hmacSha256",
    ()=>hmacSha256,
    "incomeGuard",
    ()=>incomeGuard,
    "loadPlan",
    ()=>loadPlan,
    "sha256",
    ()=>sha256,
    "signPayload",
    ()=>signPayload,
    "utf8Bytes",
    ()=>utf8Bytes,
    "velocityGuard",
    ()=>velocityGuard,
    "verifyChain",
    ()=>verifyChain,
    "verifyPayload",
    ()=>verifyPayload,
    "writePlan",
    ()=>writePlan
]);
/**
 * LOKOJA LIFE — M14: THE FORTRESS (pure rules)
 * ---------------------------------------------
 * Prerequisite for virality + trading: the save is SIGNED, the ledger
 * is a CHAIN, the income is GUARDED, and the writes are DOUBLE-BUFFERED.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic. The SHA-256 + HMAC live here in pure TS so
 *    the signing is SYNCHRONOUS everywhere (browser autosave, bun tests,
 *    node) — no async WebCrypto in the save path, no dependency drift.
 *  - The signature is HMAC-SHA256 over the EXACT serialized save string,
 *    keyed by a device-local key stored OUTSIDE the save. A player who
 *    hex-edits their save in localStorage breaks the signature; re-signing
 *    requires the key. (An honest note: anything client-side is a barrier,
 *    not a vault — the barriers here stop casual cheats, memory editors
 *    and shared save hacks, and make tampering LOUD.)
 *  - The kobo-chain: every ledger entry carries hash = H(prevHash | day |
 *    slot | amount | category | label). The chain anchors at 'seed' and
 *    walks oldest→newest; any edited amount, category or order breaks it.
 *  - The income guard: no single event may exceed the ceiling, no day may
 *    out-earn the day cap — an overflow is CLAMPED (never crashed) and
 *    flagged as an anomaly for the honest toast + the anomaly counter.
 *  - Double-buffer: the previous primary payload is copied to the shadow
 *    key BEFORE the primary is overwritten; a torn primary write falls
 *    back to the shadow, then the M9 backup slot, then fresh. Nobody
 *    ever loses a save to a crashed tab mid-write.
 */ /* --------------------------------- SHA-256 ---------------------------------- */ /** Pure TS SHA-256 core over RAW BYTES — returns the digest as 32 raw bytes. */ function sha256BytesRaw(msg) {
    const K = [
        0x428a2f98,
        0x71374491,
        0xb5c0fbcf,
        0xe9b5dba5,
        0x3956c25b,
        0x59f111f1,
        0x923f82a4,
        0xab1c5ed5,
        0xd807aa98,
        0x12835b01,
        0x243185be,
        0x550c7dc3,
        0x72be5d74,
        0x80deb1fe,
        0x9bdc06a7,
        0xc19bf174,
        0xe49b69c1,
        0xefbe4786,
        0x0fc19dc6,
        0x240ca1cc,
        0x2de92c6f,
        0x4a7484aa,
        0x5cb0a9dc,
        0x76f988da,
        0x983e5152,
        0xa831c66d,
        0xb00327c8,
        0xbf597fc7,
        0xc6e00bf3,
        0xd5a79147,
        0x06ca6351,
        0x14292967,
        0x27b70a85,
        0x2e1b2138,
        0x4d2c6dfc,
        0x53380d13,
        0x650a7354,
        0x766a0abb,
        0x81c2c92e,
        0x92722c85,
        0xa2bfe8a1,
        0xa81a664b,
        0xc24b8b70,
        0xc76c51a3,
        0xd192e819,
        0xd6990624,
        0xf40e3585,
        0x106aa070,
        0x19a4c116,
        0x1e376c08,
        0x2748774c,
        0x34b0bcb5,
        0x391c0cb3,
        0x4ed8aa4a,
        0x5b9cca4f,
        0x682e6ff3,
        0x748f82ee,
        0x78a5636f,
        0x84c87814,
        0x8cc70208,
        0x90befffa,
        0xa4506ceb,
        0xbef9a3f7,
        0xc67178f2
    ];
    const rr = (x, n)=>x >>> n | x << 32 - n;
    const bytes = [
        ...msg
    ];
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while(bytes.length % 64 !== 56)bytes.push(0);
    // big-endian 64-bit length (we never exceed 2^32 bits — push hi then lo)
    bytes.push(0, 0, 0, 0, bitLen >>> 24 & 255, bitLen >>> 16 & 255, bitLen >>> 8 & 255, bitLen & 255);
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    const w = new Array(64);
    for(let off = 0; off < bytes.length; off += 64){
        for(let i = 0; i < 16; i++){
            w[i] = bytes[off + i * 4] << 24 | bytes[off + i * 4 + 1] << 16 | bytes[off + i * 4 + 2] << 8 | bytes[off + i * 4 + 3];
        }
        for(let i = 16; i < 64; i++){
            const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ w[i - 15] >>> 3;
            const s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ w[i - 2] >>> 10;
            w[i] = w[i - 16] + s0 + w[i - 7] + s1 | 0;
        }
        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;
        for(let i = 0; i < 64; i++){
            const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
            const ch = e & f ^ ~e & g;
            const t1 = h + S1 + ch + K[i] + w[i] | 0;
            const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
            const maj = a & b ^ a & c ^ b & c;
            const t2 = S0 + maj | 0;
            h = g;
            g = f;
            f = e;
            e = d + t1 | 0;
            d = c;
            c = b;
            b = a;
            a = t1 + t2 | 0;
        }
        h0 = h0 + a | 0;
        h1 = h1 + b | 0;
        h2 = h2 + c | 0;
        h3 = h3 + d | 0;
        h4 = h4 + e | 0;
        h5 = h5 + f | 0;
        h6 = h6 + g | 0;
        h7 = h7 + h | 0;
    }
    const out = [];
    for (const x of [
        h0,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        h7
    ]){
        out.push(x >>> 24 & 255, x >>> 16 & 255, x >>> 8 & 255, x & 255);
    }
    return out;
}
function utf8Bytes(msg) {
    const bytes = [];
    for(let i = 0; i < msg.length; i++){
        let c = msg.charCodeAt(i);
        if (c < 0x80) bytes.push(c);
        else if (c < 0x800) bytes.push(0xc0 | c >> 6, 0x80 | c & 63);
        else if (c >= 0xd800 && c <= 0xdbff && i + 1 < msg.length) {
            const c2 = msg.charCodeAt(++i);
            c = 0x10000 + (c - 0xd800 << 10) + (c2 - 0xdc00);
            bytes.push(0xf0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
        } else bytes.push(0xe0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    }
    return bytes;
}
function sha256(msg) {
    return sha256BytesRaw(utf8Bytes(msg)).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
function hmacSha256(key, msg) {
    const block = 64;
    let kBytes = utf8Bytes(key);
    if (kBytes.length > block) {
        kBytes = utf8Bytes(sha256BytesRaw(kBytes).map((b)=>b.toString(16).padStart(2, '0')).join('')); // keyed-longer law: H(key) as hex, utf8
    }
    const kPadded = new Array(block).fill(0);
    for(let i = 0; i < kBytes.length; i++)kPadded[i] = kBytes[i];
    const oKey = kPadded.map((b)=>b ^ 0x5c);
    const iKey = kPadded.map((b)=>b ^ 0x36);
    const innerDigest = sha256BytesRaw([
        ...iKey,
        ...utf8Bytes(msg)
    ]) // 32 RAW bytes
    ;
    return sha256BytesRaw([
        ...oKey,
        ...innerDigest
    ]).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
const FORT_KEY_STORAGE = 'lokoja-life:fortkey';
function signPayload(payload, key) {
    return hmacSha256(key, payload);
}
function verifyPayload(payload, sig, key) {
    if (typeof sig !== 'string' || sig.length === 0) return {
        ok: false,
        why: 'malformed'
    };
    if (key === null || key.length === 0) return {
        ok: false,
        why: 'missing-key'
    };
    const expect = signPayload(payload, key);
    // constant-time-ish compare (length + xor walk)
    if (expect.length !== sig.length) return {
        ok: false,
        why: 'tampered'
    };
    let diff = 0;
    for(let i = 0; i < expect.length; i++)diff |= expect.charCodeAt(i) ^ sig.charCodeAt(i);
    return diff === 0 ? {
        ok: true
    } : {
        ok: false,
        why: 'tampered'
    };
}
const CHAIN_SEED = 'lko-chain-seed';
function chainHash(prev, tx) {
    return sha256(`${prev}|${tx.day}|${tx.slot}|${tx.amount}|${tx.category}|${tx.label}`);
}
function chainNext(prevHash, tx) {
    return chainHash(prevHash, tx);
}
function verifyChain(txs) {
    let prev = CHAIN_SEED;
    let anchoring = true;
    for(let i = 0; i < txs.length; i++){
        const t = txs[i];
        if (typeof t.sig !== 'string') {
            // legacy entry: before the first signed link the chain is not live yet
            if (anchoring) continue;
            return {
                ok: false,
                brokenAt: i
            };
        }
        anchoring = false;
        const expect = chainHash(prev, t);
        if (expect !== t.sig) return {
            ok: false,
            brokenAt: i
        };
        prev = t.sig;
    }
    return {
        ok: true,
        brokenAt: -1
    };
}
function incomeGuard(amount, dayEarned, cfg) {
    if (amount <= 0) return {
        allowed: 0,
        clamped: false,
        law: null
    };
    if (amount > cfg.singleCeiling) {
        return {
            allowed: cfg.singleCeiling,
            clamped: true,
            law: 'single'
        };
    }
    const room = cfg.dayCeiling - dayEarned;
    if (room <= 0) return {
        allowed: 0,
        clamped: true,
        law: 'day'
    };
    if (amount > room) return {
        allowed: room,
        clamped: true,
        law: 'day'
    };
    return {
        allowed: amount,
        clamped: false,
        law: null
    };
}
function velocityGuard(txCountThisSlot, cap) {
    return {
        allow: txCountThisSlot < cap,
        cap
    };
}
function anomalyVerdict(anomalyFlag) {
    return anomalyFlag ? 'continue' : 'continue';
}
function configFingerprint(tables) {
    let json;
    try {
        json = JSON.stringify(tables);
    } catch  {
        json = 'unserializable';
    }
    return sha256(json).slice(0, 16);
}
function freshFortressState() {
    return {
        anomalies: 0,
        dayEarnedDay: 0,
        dayEarned: 0,
        slotTxCount: 0,
        slotTxSlot: 0,
        chainTail: CHAIN_SEED,
        fingerprint: null
    };
}
const FORTRESS_KEYS = {
    primary: 'lokoja-life:save',
    shadow: 'lokoja-life:save-b'
};
function loadPlan(primaryOk, shadowExists, shadowOk, backupExists, backupOk, primaryWhy, shadowWhy) {
    if (primaryOk) return {
        step: 'primary'
    };
    if (shadowExists) {
        if (shadowOk) return {
            step: 'shadow',
            why: primaryWhy
        };
    }
    if (backupExists) {
        if (backupOk) return {
            step: 'backup',
            why: shadowExists ? shadowWhy : primaryWhy
        };
    }
    return {
        step: 'fresh',
        why: primaryWhy
    };
}
function writePlan(currentPrimary) {
    return {
        shadowPayload: currentPrimary,
        overwritePrimary: true
    };
}
function benchSign(key, sizeBytes = 8192) {
    const payload = 'x'.repeat(sizeBytes);
    const t0 = Date.now();
    signPayload(payload, key);
    return Date.now() - t0;
}
}),
"[project]/src/game/systems/live.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AJO_MAX_MEMBERS",
    ()=>AJO_MAX_MEMBERS,
    "AJO_PANIC_GRACE_DAYS",
    ()=>AJO_PANIC_GRACE_DAYS,
    "ASSOC_DUES",
    ()=>ASSOC_DUES,
    "ASSOC_MIN_MEMBERS",
    ()=>ASSOC_MIN_MEMBERS,
    "COURT_FEE",
    ()=>COURT_FEE,
    "EMOTE_LIBRARY",
    ()=>EMOTE_LIBRARY,
    "EVENT_PAYLOAD_CAP",
    ()=>EVENT_PAYLOAD_CAP,
    "PRESENCE_TTL_MS",
    ()=>PRESENCE_TTL_MS,
    "ajoCourtFine",
    ()=>ajoCourtFine,
    "ajoIdFor",
    ()=>ajoIdFor,
    "ajoNextBeneficiary",
    ()=>ajoNextBeneficiary,
    "ajoPanicCheck",
    ()=>ajoPanicCheck,
    "ajoRoundReady",
    ()=>ajoRoundReady,
    "assocChainLink",
    ()=>assocChainLink,
    "assocIdFor",
    ()=>assocIdFor,
    "broadcastPayout",
    ()=>broadcastPayout,
    "canFoundAssociation",
    ()=>canFoundAssociation,
    "canLive",
    ()=>canLive,
    "cityBroadcastFor",
    ()=>cityBroadcastFor,
    "contractIdFor",
    ()=>contractIdFor,
    "courtPenalty",
    ()=>courtPenalty,
    "courtVerdict",
    ()=>courtVerdict,
    "crowdMult",
    ()=>crowdMult,
    "emoteById",
    ()=>emoteById,
    "freshLiveState",
    ()=>freshLiveState,
    "joinTeleportEvent",
    ()=>joinTeleportEvent,
    "presenceAlive",
    ()=>presenceAlive,
    "presenceRoster",
    ()=>presenceRoster,
    "sanitizeChat",
    ()=>sanitizeChat,
    "tradeIdFor",
    ()=>tradeIdFor,
    "tradeVerdict",
    ()=>tradeVerdict,
    "validateEvent",
    ()=>validateEvent,
    "voiceAllowed",
    ()=>voiceAllowed,
    "withdrawVerdict",
    ()=>withdrawVerdict
]);
/**
 * LOKOJA LIFE — M17: THE LIVE NATION
 * ----------------------------------
 * Identity arrives FREE from the Guest Loop: every claimed account is
 * multiplayer-ready — no separate signup, ever. This system holds the
 * LAWS of the nation; the relay (two thin API routes) only ever
 * DISTRIBUTES the events these laws produce — it never simulates.
 *
 * LAWS OF THIS FILE:
 *  - THE IDENTITY LAW: a claimed account plays the nation; an unclaimed
 *    guest spectates (reads everything) but the mic stays dark until
 *    claim. No second signup exists anywhere in the app.
 *  - THE TIERED CHAT LAW (rides the M13 bands): kids speak in preset
 *    emotes ONLY; teens speak moderated text (the word wall, 140 chars);
 *    adults speak full text (280 chars) but NO EXTERNAL LINKS EVER —
 *    URLs, phone numbers and wallet addresses are stripped before the
 *    relay ever sees them.
 *  - THE PRESENCE LAW: a live walker is a record with a TTL — a stale
 *    ping is an absent neighbor; presence never lies.
 *  - THE JOIN-TELEPORT LAW: a live invite is an M15 postcard (the SAME
 *    signed code) — arrival is free, landings never pay street credit.
 *  - THE STREAM LAW: anyone may broadcast a stall/regatta/wedding;
 *    viewers BECOME the crowd (an honest multiplier, capped); the city
 *    itself broadcasts on a deterministic civic schedule.
 *  - THE ASSOCIATION LAW: a shared treasury where every move is a
 *    kobo-chain link (M14 fortress math) — and the co-op books never
 *    move on one man's word (the two-key law).
 *  - THE COURT LAW: contracts and disputes land before the Market Union
 *    Court, whose verdict is a HASH of (day, contract, evidence) —
 *    deterministic, reload-proof, bribe-proof.
 *  - THE TRADE LAW: a trade is a signed ledger event both sides apply
 *    through their own honest engines; the relay just carries it.
 *  - THE AJO LAW: real-player rotating savings with THE DEFAULT PANIC
 *    and the court guarantee — a defaulter is fined, the round still
 *    pays; nobody's money dies with a stranger's empty pocket.
 *  - THE VOICE LAW: adults, opt-in, same street — minors NEVER
 *    (structurally false, the M13 graph-block doctrine).
 *  - THE RELAY DOCTRINE: events are validated shapes on channels; the
 *    nation's memory lives in the relay, the simulation lives at home.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-route] (ecmascript)");
;
/**
 * THE IDENTITY LAW + THE TIERED CHAT LAW, one table.
 *  guest  → read-only spectate (the mic is dark until claim)
 *  kid    → emotes only
 *  teen   → moderated text
 *  adult  → full text
 * Hosting/assoc/trade/ajo are grown-folk law: adults only. (Teens may
 * read every room; the nation keeps its money tables adult-hands-only,
 * the same doctrine the M13 shield set for crime and japa.)
 */ const CAPABILITY_TABLE = {
    guest: [
        'read'
    ],
    kid: [
        'read',
        'emote'
    ],
    teen: [
        'read',
        'emote',
        'text'
    ],
    adult: [
        'read',
        'emote',
        'text',
        'host',
        'assoc',
        'trade',
        'ajo',
        'voice'
    ]
};
function canLive(identity, cap) {
    return CAPABILITY_TABLE[identity.band].includes(cap);
}
const EMOTE_LIBRARY = [
    {
        id: 'up-nepa',
        glyph: '💡',
        phrase: 'Up NEPA!'
    },
    {
        id: 'howfar',
        glyph: '👋',
        phrase: 'How far!'
    },
    {
        id: 'lol',
        glyph: '😂',
        phrase: 'Lol'
    },
    {
        id: 'hot',
        glyph: '🔥',
        phrase: 'Fire!'
    },
    {
        id: 'strong',
        glyph: '💪',
        phrase: 'Strong thing'
    },
    {
        id: 'abeg',
        glyph: '🙏',
        phrase: 'Abeg oo'
    },
    {
        id: 'oya',
        glyph: '⭐',
        phrase: 'Oya!'
    },
    {
        id: 'choi',
        glyph: '😮',
        phrase: 'Choi!'
    },
    {
        id: 'welldone',
        glyph: '🎁',
        phrase: 'Well done oo'
    },
    {
        id: 'tired',
        glyph: '😴',
        phrase: 'Body dey pain me'
    },
    {
        id: 'correct',
        glyph: '🤝',
        phrase: 'Correct!'
    },
    {
        id: 'nice',
        glyph: '❤️',
        phrase: 'Nice one'
    }
];
function emoteById(id) {
    return EMOTE_LIBRARY.find((e)=>e.id === id) ?? null;
}
/** THE TEEN WORD WALL — moderation as a pure law. A small honest
 *  blocklist of the classic 419/harassment openers; the list is data,
 *  so it grows without touching any law. */ const WORD_WALL = [
    '419',
    'yahoo boy',
    'blood money',
    'send ur pics',
    'send pictures',
    'credit card',
    'bank pin',
    'atm pin',
    'one chance',
    'kill',
    'stupid fool'
];
/** THE ADULT LINK LAW — no external links ever, in ANY room. URLs,
 *  www hosts, common TLDs, phone numbers and crypto/transfer handles
 *  are stripped; what survives is honest street talk. */ const LINK_PATTERNS = [
    /https?:\/\/\S+/gi,
    /\bwww\.\S+/gi,
    /[\w.-]+\.(com|net|org|ng|io|xyz|link|me|tv)\b/gi,
    /(?:\+?234|0)[789]\d{9}/g,
    /\b0[789]\d{9}\b/g,
    /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\b/g
];
const KID_MAX = 0 // kids never type — the lexicon speaks
;
const TEEN_MAX = 140;
const ADULT_MAX = 280;
function sanitizeChat(identity, raw) {
    // THE IDENTITY LAW at the mic: a guest's mic is dark, full stop
    if (identity.band === 'guest') return {
        ok: false,
        why: 'guest-mic-dark'
    };
    if (identity.band === 'kid') return {
        ok: false,
        why: 'kid-text-refused'
    };
    const text = raw.trim();
    if (!text) return {
        ok: false,
        why: 'empty'
    };
    if (identity.band === 'teen') {
        if (text.length > TEEN_MAX) return {
            ok: false,
            why: 'too-long'
        };
        const low = text.toLowerCase();
        if (WORD_WALL.some((w)=>low.includes(w))) return {
            ok: false,
            why: 'word-wall'
        };
        // teens inherit the link law too — moderation is the floor, not the ceiling
        if (LINK_PATTERNS.some((r)=>r.test(text))) return {
            ok: false,
            why: 'no-links-ever'
        };
        return {
            ok: true,
            text
        };
    }
    // adult: full text, the link law, the length cap
    if (text.length > ADULT_MAX) return {
        ok: false,
        why: 'too-long'
    };
    let out = text;
    let stripped = false;
    for (const r of LINK_PATTERNS){
        if (r.test(out)) {
            // the link DIES — nothing stands in for it (an only-link message
            // leaves nothing honest, and nothing honest never crosses)
            out = out.replace(r, '');
            stripped = true;
        }
        r.lastIndex = 0;
    }
    if (!out.trim()) return {
        ok: false,
        why: 'no-links-ever'
    };
    return {
        ok: true,
        text: out.replace(/\s{2,}/g, ' ').trim(),
        stripped
    };
}
const PRESENCE_TTL_MS = 90_000;
function presenceAlive(p, now) {
    return now - p.ts <= PRESENCE_TTL_MS;
}
function presenceRoster(all, now) {
    return all.filter((p)=>presenceAlive(p, now)).sort((a, b)=>a.handle.localeCompare(b.handle));
}
function joinTeleportEvent(handle, street, code) {
    return {
        id: `jt:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"])(`${handle}|${street}|${code}`).slice(0, 16)}`,
        kind: 'join',
        channel: 'global',
        actor: handle,
        payload: {
            street,
            code
        }
    };
}
function crowdMult(viewerCount) {
    return 1 + Math.min(viewerCount, 40) * 0.0125;
}
function broadcastPayout(base, viewerCount) {
    return Math.round(base * crowdMult(viewerCount));
}
function cityBroadcastFor(yearDay) {
    if (yearDay === 1) return {
        kind: 'address',
        title: "The Governor's New Year Address"
    };
    if (yearDay === 36) return {
        kind: 'address',
        title: 'The Mid-Year Address'
    };
    if (yearDay === 60) return {
        kind: 'election',
        title: 'Election Night — the results walk home'
    };
    return null;
}
const ASSOC_DUES = 500;
const ASSOC_MIN_MEMBERS = 3;
function assocIdFor(name, founder, day) {
    return `asc:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"])(`${name}|${founder}|${day}`).slice(0, 16)}`;
}
function canFoundAssociation(identity) {
    return canLive(identity, 'assoc');
}
function withdrawVerdict(assoc, requester, coSigner, amount) {
    const row = assoc.members.find((m)=>m.handle === requester);
    if (!row) return {
        ok: false,
        why: 'not-member'
    };
    if (row.role !== 'president') return {
        ok: false,
        why: 'not-president'
    };
    if (!coSigner || coSigner === requester || !assoc.members.some((m)=>m.handle === coSigner)) {
        return {
            ok: false,
            why: 'two-key'
        };
    }
    if (!Number.isFinite(amount) || amount <= 0) return {
        ok: false,
        why: 'bad-amount'
    };
    if (amount > assoc.treasury) return {
        ok: false,
        why: 'empty-treasury'
    };
    return {
        ok: true
    };
}
function assocChainLink(prevSig, day, amount, category, label) {
    // the assoc books chain on the SAME ChainTx law; slot 0 is the
    // association's own counter slot (the day-slot pair stays unique per move)
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chainHash"])(prevSig, {
        day,
        slot: 0,
        amount,
        category,
        label
    });
}
function contractIdFor(terms, parties, day) {
    return `ctr:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"])(`${terms}|${parties.join('+')}|${day}`).slice(0, 16)}`;
}
function courtVerdict(contract, evidence) {
    const h = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"])(`${contract.id}|${evidence}|${contract.day}`);
    // the honest bias: a contract with no evidence against it stands
    return parseInt(h.slice(0, 2), 16) % 4 === 0 ? 'broken' : 'kept';
}
const COURT_FEE = 200;
function courtPenalty(contract) {
    if (contract.status !== 'disputed' || !contract.verdict) return null;
    if (contract.verdict === 'kept') return null;
    const liable = contract.parties[1] ?? contract.parties[0];
    const winner = contract.parties[0];
    return {
        liable,
        penalty: contract.stake,
        winner
    };
}
function tradeIdFor(from, to, day, offerSeq) {
    return `trd:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"])(`${from}|${to}|${day}|${offerSeq}`).slice(0, 16)}`;
}
function tradeVerdict(offer, acceptor, roster, now) {
    if (offer.status !== 'offered') return {
        ok: false,
        why: 'not-offered'
    };
    if (offer.from === offer.to) return {
        ok: false,
        why: 'self-trade'
    };
    if (acceptor !== offer.to) return {
        ok: false,
        why: 'wrong-party'
    };
    const partner = roster.find((p)=>p.handle === offer.from);
    if (!partner || !presenceAlive(partner, now)) return {
        ok: false,
        why: 'partner-gone'
    };
    return {
        ok: true
    };
}
const AJO_MAX_MEMBERS = 12;
const AJO_PANIC_GRACE_DAYS = 2;
function ajoIdFor(name, founder, day) {
    return `ajo:${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"])(`${name}|${founder}|${day}`).slice(0, 16)}`;
}
function ajoRoundReady(circle) {
    return circle.order.every((m)=>circle.paidThisRound.includes(m));
}
function ajoNextBeneficiary(circle) {
    for (const m of circle.order){
        if (!Object.values(circle.paid).includes(m)) return m;
    }
    return null;
}
function ajoPanicCheck(circle, day) {
    if (circle.status === 'panic') return {
        panic: true,
        defaulter: circle.defaulters[0] ?? null
    };
    const next = ajoNextBeneficiary(circle);
    if (!next) return {
        panic: false,
        defaulter: null
    };
    const pending = circle.order.filter((m)=>!circle.paidThisRound.includes(m));
    if (circle.paidThisRound.length === 0 || pending.length === 0) return {
        panic: false,
        defaulter: null
    };
    if (day - circle.roundStartDay > AJO_PANIC_GRACE_DAYS) {
        return {
            panic: true,
            defaulter: pending[0]
        };
    }
    return {
        panic: false,
        defaulter: null
    };
}
function ajoCourtFine(circle, handle) {
    return {
        fine: Math.round(circle.contribution * 1.5),
        repHit: 5
    };
}
function voiceAllowed(identity, voiceOn, myStreet, theirStreet) {
    if (identity.band !== 'adult') return false;
    if (!voiceOn) return false;
    if (!myStreet || !theirStreet) return false;
    return myStreet === theirStreet;
}
const EVENT_PAYLOAD_CAP = 2048;
function validateEvent(e) {
    const ev = e;
    if (!ev || typeof ev !== 'object' || typeof ev.id !== 'string' || typeof ev.actor !== 'string') return {
        ok: false,
        why: 'shape'
    };
    const kinds = [
        'chat',
        'emote',
        'join',
        'stream',
        'assoc',
        'trade',
        'ajo',
        'city',
        'court'
    ];
    if (!kinds.includes(ev.kind)) return {
        ok: false,
        why: 'kind'
    };
    if (typeof ev.channel !== 'string' || ev.channel.length === 0 || ev.channel.length > 64) return {
        ok: false,
        why: 'channel'
    };
    if (ev.channel !== 'global' && !/^(street|assoc|circle|stream):[\w:-]{1,48}$/.test(ev.channel)) return {
        ok: false,
        why: 'channel'
    };
    if (JSON.stringify(ev.payload ?? {}).length > EVENT_PAYLOAD_CAP) return {
        ok: false,
        why: 'payload-cap'
    };
    return {
        ok: true
    };
}
function freshLiveState() {
    return {
        cursor: 0,
        voiceOn: false,
        assocId: null,
        coSigned: [],
        circles: [],
        stats: {
            chats: 0,
            emotes: 0,
            streamsWatched: 0,
            tradesDone: 0
        },
        finesPaid: 0
    };
}
}),
"[project]/src/game/systems/citypack.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M18: THE CITY FORGE
 * ---------------------------------
 * A city = content pack, not a program. One pipeline turns an OSM
 * extract into a shippable city pack inside the 3-HOUR SLA, and a QA
 * battery stands between every pack and the nation.
 *
 * LAWS OF THIS FILE:
 *  - THE PACK LAW: a city is DATA — streets, locations, culture,
 *    economy, civic blueprints — versioned, loadable, swappable. The
 *    engine never forks per city; the pack carries the city.
 *  - THE PHANTOM-ID LAW: every id a pack mints carries its city's
 *    brand at the TYPE level (CityId<'kano'> is not CityId<'lokoja'>)
 *    AND a runtime prefix guard — zero cross-contamination, in the
 *    compiler and at the door.
 *  - THE PIPELINE LAW: five stages, each with an honest minute budget
 *    — OSM import (0–45), auto-classify + interiors (45–90), civic
 *    blueprints + economy + culture (90–150), the QA battery (150–170),
 *    the PWA ship (170–180). A stage that overshoots its budget fails
 *    the SLA honestly. Deterministic: the same extract forges the same
 *    pack twice.
 *  - THE QA BATTERY: id hygiene, coordinate bounds, economy sanity (a
 *    meal cannot cost more than a roof), culture completeness, and
 *    street-graph connectivity (every location reachable) — a pack
 *    ships ONLY on a green battery.
 *  - THE PILOT LADDER: Abuja pilots first, then Kano/Enugu/PH/Ibadan,
 *    then Accra — and "YOUR CITY NEXT?" is a real vote book, counted
 *    deterministically.
 *  - THE LOKOJA BRIDGE: the living city ships as a pack too — the
 *    default lokoja-v1 derives from the game's own data, proving packs
 *    and the running city speak one shape.
 */ /* ============================ phantom-typed ids ============================ */ /** THE PHANTOM-ID LAW, type level: a city's id is branded with its
 *  city name — the compiler refuses a Kano street where a Lokoja
 *  street is promised. (Zero runtime cost: the brand is phantom.) */ __turbopack_context__.s([
    "CITY_PREFIX_SEP",
    ()=>CITY_PREFIX_SEP,
    "CITY_SLA_MINUTES",
    ()=>CITY_SLA_MINUTES,
    "MY_VOTE_CAP",
    ()=>MY_VOTE_CAP,
    "PACK_BYTE_BUDGET",
    ()=>PACK_BYTE_BUDGET,
    "PILOT_LADDER",
    ()=>PILOT_LADDER,
    "PIPELINE",
    ()=>PIPELINE,
    "applyVote",
    ()=>applyVote,
    "belongsTo",
    ()=>belongsTo,
    "cityOf",
    ()=>cityOf,
    "civicFor",
    ()=>civicFor,
    "classify",
    ()=>classify,
    "cultureFor",
    ()=>cultureFor,
    "economyFor",
    ()=>economyFor,
    "forgeCity",
    ()=>forgeCity,
    "forgeVote",
    ()=>forgeVote,
    "freshForgeState",
    ()=>freshForgeState,
    "lokojaDefaultPack",
    ()=>lokojaDefaultPack,
    "mintLocation",
    ()=>mintLocation,
    "mintStreet",
    ()=>mintStreet,
    "osmImport",
    ()=>osmImport,
    "qaBounds",
    ()=>qaBounds,
    "qaConnectivity",
    ()=>qaConnectivity,
    "qaCulture",
    ()=>qaCulture,
    "qaEconomy",
    ()=>qaEconomy,
    "qaIdHygiene",
    ()=>qaIdHygiene,
    "recordBuild",
    ()=>recordBuild,
    "runQaBattery",
    ()=>runQaBattery,
    "shipPack",
    ()=>shipPack,
    "slaVerdict",
    ()=>slaVerdict,
    "voteWinner",
    ()=>voteWinner,
    "walkMinutesFor",
    ()=>walkMinutesFor
]);
const CITY_PREFIX_SEP = ':';
function mintStreet(city, slug) {
    return `${city}${CITY_PREFIX_SEP}${slug}`;
}
function mintLocation(city, slug) {
    return `${city}${CITY_PREFIX_SEP}${slug}`;
}
function cityOf(branded) {
    return branded.split(CITY_PREFIX_SEP)[0] ?? '';
}
function belongsTo(id, city) {
    return cityOf(id) === city;
}
const PIPELINE = [
    {
        key: 'osm',
        label: 'OSM import',
        budgetMinutes: 45,
        startsAtMinute: 0
    },
    {
        key: 'classify',
        label: 'Auto-classify + interiors',
        budgetMinutes: 45,
        startsAtMinute: 45
    },
    {
        key: 'blueprint',
        label: 'Civic + economy + culture',
        budgetMinutes: 60,
        startsAtMinute: 90
    },
    {
        key: 'qa',
        label: 'QA battery',
        budgetMinutes: 20,
        startsAtMinute: 150
    },
    {
        key: 'ship',
        label: 'PWA ship',
        budgetMinutes: 10,
        startsAtMinute: 170
    }
];
const CITY_SLA_MINUTES = 180;
function slaVerdict(stageMinutes) {
    let total = 0;
    for (const stage of PIPELINE){
        const spent = stageMinutes[stage.key] ?? 0;
        total += spent;
        if (spent > stage.budgetMinutes) return {
            ok: false,
            brokenStage: stage.key,
            total
        };
    }
    if (total > CITY_SLA_MINUTES) return {
        ok: false,
        brokenStage: 'sla',
        total
    };
    return {
        ok: true,
        brokenStage: null,
        total
    };
}
function osmImport(extract) {
    const nodeById = new Map(extract.nodes.map((n)=>[
            n.id,
            n
        ]));
    const features = [];
    let refused = 0;
    for (const way of extract.ways){
        const name = way.tags.name ?? way.tags.amenity ?? way.tags.shop;
        const first = nodeById.get(way.nodes[0] ?? '');
        if (!name || !first) {
            refused++;
            continue;
        }
        features.push({
            wayId: way.id,
            name,
            tags: way.tags,
            lat: first.lat,
            lon: first.lon
        });
    }
    return {
        features,
        refused
    };
}
function classify(feature) {
    const t = feature.tags;
    if (t.waterway || t.natural === 'water') return {
        as: 'street',
        kind: 'waterfront',
        hasInterior: false
    };
    if (t.amenity || t.shop || t.office || t.tourism) {
        const a = t.amenity ?? '';
        const s = t.shop ?? '';
        if (a === 'marketplace') return {
            as: 'location',
            kind: 'market',
            hasInterior: true
        };
        if (a === 'bank' || s === 'money_transfer') return {
            as: 'location',
            kind: 'bank',
            hasInterior: true
        };
        if (a === 'clinic' || a === 'hospital' || a === 'pharmacy') return {
            as: 'location',
            kind: 'clinic',
            hasInterior: true
        };
        if (a === 'school' || a === 'college' || a === 'university') return {
            as: 'location',
            kind: 'school',
            hasInterior: true
        };
        if (a === 'bus_station' || a === 'ferry_terminal' || a === 'fuel') return {
            as: 'location',
            kind: 'transport',
            hasInterior: false
        };
        if (a === 'restaurant' || a === 'cafe' || a === 'fast_food' || s === 'restaurant') return {
            as: 'location',
            kind: 'food',
            hasInterior: true
        };
        if (t.office) return {
            as: 'location',
            kind: 'work',
            hasInterior: true
        };
        return {
            as: 'location',
            kind: 'shop',
            hasInterior: true
        };
    }
    const hw = t.highway ?? '';
    if (hw === 'primary' || hw === 'trunk' || hw === 'secondary') return {
        as: 'street',
        kind: 'arterial',
        hasInterior: false
    };
    if (hw === 'service') return {
        as: 'street',
        kind: 'service',
        hasInterior: false
    };
    if (t.shop || t.building === 'retail') return {
        as: 'street',
        kind: 'highstreet',
        hasInterior: false
    };
    return {
        as: 'street',
        kind: 'residential',
        hasInterior: false
    };
}
function walkMinutesFor(kind, nodeCount) {
    const base = {
        arterial: 4,
        highstreet: 6,
        residential: 8,
        service: 3,
        waterfront: 10
    };
    return Math.max(1, Math.round(base[kind] + nodeCount * 0.5));
}
function economyFor(colIndex) {
    return {
        colIndex,
        mealBase: Math.round(450 * colIndex / 100),
        fareBase: Math.round(120 * colIndex / 100),
        wageBase: Math.round(3000 * colIndex / 100)
    };
}
function cultureFor(city, country) {
    const table = {
        lokoja: {
            greetings: [
                'How far!',
                'You welcome',
                'Abeg oo'
            ],
            dishes: [
                {
                    name: 'Roasted fish',
                    price: 1500
                },
                {
                    name: 'Egusi and pounded yam',
                    price: 800
                },
                {
                    name: 'Suya',
                    price: 600
                }
            ],
            festivals: [
                {
                    name: 'Confluence Regatta',
                    yearDay: 20
                },
                {
                    name: "Governor's New Year Address",
                    yearDay: 1
                }
            ],
            languageNote: 'Pidgin rides the confluence — Igala, Nupe and Ebira under it.',
            currency: 'NGN'
        },
        abuja: {
            greetings: [
                'How far!',
                'Fine morning',
                'Wetin dey happen'
            ],
            dishes: [
                {
                    name: 'Masa',
                    price: 700
                },
                {
                    name: 'Tuwo and miyan kuka',
                    price: 1200
                },
                {
                    name: 'Grilled catfish',
                    price: 2500
                }
            ],
            festivals: [
                {
                    name: 'City Durbar',
                    yearDay: 33
                }
            ],
            languageNote: 'The capital speaks every tongue — Hausa carries the market.',
            currency: 'NGN'
        },
        kano: {
            greetings: [
                'Sannu!',
                'Ina kwana',
                'Na gode'
            ],
            dishes: [
                {
                    name: 'Masa',
                    price: 400
                },
                {
                    name: 'Tuwo dawa',
                    price: 600
                },
                {
                    name: 'Kilishi',
                    price: 900
                }
            ],
            festivals: [
                {
                    name: 'Durbar',
                    yearDay: 28
                }
            ],
            languageNote: 'Hausa first, the old city walls still carry it.',
            currency: 'NGN'
        },
        accra: {
            greetings: [
                'Ette sen?',
                'Akwaaba!',
                'Charley!'
            ],
            dishes: [
                {
                    name: 'Jollof and chicken',
                    price: 45
                },
                {
                    name: 'Banku and tilapia',
                    price: 60
                },
                {
                    name: 'Waakye',
                    price: 25
                }
            ],
            festivals: [
                {
                    name: 'Chale Wote',
                    yearDay: 50
                }
            ],
            languageNote: 'Twi under the English, Ga by the sea.',
            currency: 'GHS'
        }
    };
    return table[city] ?? {
        greetings: [
            'How far!'
        ],
        dishes: [
            {
                name: 'Street rice',
                price: Math.round(500 * (city === 'accra' ? 0.09 : 1))
            }
        ],
        festivals: [
            {
                name: `${city} Day`,
                yearDay: 15
            }
        ],
        languageNote: `${city} speaks for itself — the Culture Pack collects it.`,
        currency: country === 'Ghana' ? 'GHS' : 'NGN'
    };
}
function civicFor(packed) {
    const kinds = new Set(packed.locations.map((l)=>l.kind));
    const offices = [];
    if (kinds.has('bank')) offices.push('bank');
    if (kinds.has('clinic')) offices.push('clinic');
    if (kinds.has('school')) offices.push('school');
    offices.push('kgirs', 'nepa');
    // the grid zones follow the arterial streets (one transformer each)
    const powerZones = packed.streets.filter((s)=>s.kind === 'arterial').map((s)=>s.id);
    return {
        powerZones: powerZones.length > 0 ? powerZones : [
            packed.streets[0]?.id ?? 'zone-0'
        ],
        marketDayEvery: 5,
        offices
    };
}
function qaIdHygiene(pack) {
    const all = [
        ...pack.streets.map((s)=>s.id),
        ...pack.locations.map((l)=>l.id)
    ];
    const badPrefix = all.filter((id)=>!belongsTo(id, pack.id));
    const dupes = all.filter((id, i)=>all.indexOf(id) !== i);
    const ok = badPrefix.length === 0 && dupes.length === 0;
    return {
        law: 'id-hygiene',
        ok,
        detail: ok ? `${all.length} ids branded + unique` : `foreign: ${badPrefix.length}, dupes: ${dupes.length}`
    };
}
function qaBounds(pack, bbox, coords) {
    const outside = [
        ...coords.values()
    ].filter((c)=>c.lat < bbox.minLat || c.lat > bbox.maxLat || c.lon < bbox.minLon || c.lon > bbox.maxLon).length;
    return {
        law: 'map-bounds',
        ok: outside === 0,
        detail: outside === 0 ? 'all nodes inside the box' : `${outside} nodes outside the box`
    };
}
function qaEconomy(pack) {
    const meal = pack.economy.mealBase;
    const fare = pack.economy.fareBase;
    const weeklyWage = pack.economy.wageBase * 6;
    const ok = meal < weeklyWage && fare <= meal && pack.economy.colIndex > 0;
    return {
        law: 'economy-sanity',
        ok,
        detail: ok ? `meal ${meal} < weekly wage ${weeklyWage}, fare ${fare} ≤ meal` : 'the ratios broke'
    };
}
function qaCulture(pack) {
    const c = pack.culture;
    const ok = c.greetings.length >= 3 && c.dishes.length >= 3 && c.festivals.length >= 1 && c.languageNote.length > 5 && c.currency.length === 3;
    return {
        law: 'culture-complete',
        ok,
        detail: ok ? `${c.greetings.length} greetings, ${c.dishes.length} dishes, ${c.festivals.length} festivals` : 'the culture pack is thin'
    };
}
function qaConnectivity(pack) {
    const streetIds = new Set(pack.streets.map((s)=>s.id));
    const ghostDoors = pack.locations.filter((l)=>!streetIds.has(l.street)).length;
    const orphans = pack.streets.length === 0 ? 1 : 0;
    const emptyStreets = pack.streets.filter((s)=>!pack.locations.some((l)=>l.street === s.id) && s.kind !== 'waterfront' && s.kind !== 'service').length;
    const ok = ghostDoors === 0 && orphans === 0;
    return {
        law: 'connectivity',
        ok,
        detail: ok ? `${pack.locations.length} doors on ${pack.streets.length} streets${emptyStreets > 0 ? ` (${emptyStreets} quiet)` : ''}` : `${ghostDoors} ghost doors, ${orphans} orphans`
    };
}
function runQaBattery(pack, bbox, coords) {
    const findings = [
        qaIdHygiene(pack),
        qaBounds(pack, bbox, coords),
        qaEconomy(pack),
        qaCulture(pack),
        qaConnectivity(pack)
    ];
    const okAll = findings.every((f)=>f.ok);
    const score = Math.round(findings.filter((f)=>f.ok).length / findings.length * 100);
    return {
        ok: okAll,
        findings,
        score
    };
}
const PACK_BYTE_BUDGET = 512 * 1024 // 512KB — a city is data, not a program
;
function shipPack(pack, qa, stageMinutes) {
    if (!qa.ok) return {
        ok: false,
        why: `QA red — ${qa.findings.filter((f)=>!f.ok).map((f)=>f.law).join(', ')}`
    };
    const sla = slaVerdict(stageMinutes);
    if (!sla.ok) return {
        ok: false,
        why: `SLA broken at ${sla.brokenStage}`
    };
    const packBytes = JSON.stringify(pack).length;
    if (packBytes > PACK_BYTE_BUDGET) return {
        ok: false,
        why: `pack too fat (${packBytes}B > ${PACK_BYTE_BUDGET}B)`
    };
    return {
        ok: true,
        manifest: {
            packId: pack.id,
            name: pack.name,
            version: pack.version,
            qaScore: qa.score,
            shippedAtStageMinute: sla.total,
            packBytes
        }
    };
}
function forgeCity(extract, opts) {
    // stage 1 — import
    const { features, refused } = osmImport(extract);
    // stage 2 — classify + interiors
    const streets = [];
    const locations = [];
    const coords = new Map();
    for (const f of features){
        coords.set(f.wayId, {
            lat: f.lat,
            lon: f.lon
        });
        const verdict = classify(f);
        if (verdict.as === 'street') {
            const kind = verdict.kind;
            const id = mintStreet(opts.city, f.name.toLowerCase().replace(/\s+/g, '-'));
            const nodeCount = extract.ways.find((w)=>w.id === f.wayId)?.nodes.length ?? 1;
            streets.push({
                id,
                name: f.name,
                kind,
                walkMinutes: walkMinutesFor(kind, nodeCount),
                fromWays: [
                    f.wayId
                ]
            });
        } else {
            const id = mintLocation(opts.city, f.name.toLowerCase().replace(/\s+/g, '-'));
            const onStreet = streets[streets.length - 1]?.id ?? mintStreet(opts.city, 'main-street');
            locations.push({
                id,
                name: f.name,
                street: onStreet,
                kind: verdict.kind,
                hasInterior: verdict.hasInterior
            });
        }
    }
    // the doors law: a location needs a real street — the first street anchors
    if (streets.length === 0 && locations.length > 0) {
        streets.push({
            id: mintStreet(opts.city, 'main-street'),
            name: 'Main Street',
            kind: 'residential',
            walkMinutes: 5,
            fromWays: []
        });
    }
    // stage 3 — blueprints + economy + culture
    const economy = economyFor(opts.colIndex);
    const culture = cultureFor(opts.city, opts.country);
    const civic = civicFor({
        locations,
        streets
    });
    const pack = {
        id: opts.city,
        name: opts.name,
        country: opts.country,
        version: opts.version,
        streets,
        locations,
        culture,
        economy,
        civic
    };
    // stage 4 — QA
    const qa = runQaBattery(pack, opts.bbox, coords);
    // stage 5 — ship
    const ship = shipPack(pack, qa, opts.stageMinutes);
    return {
        city: opts.city,
        pack: ship.ok ? pack : pack,
        qa,
        manifest: ship.manifest ?? null,
        stageMinutes: opts.stageMinutes,
        sla: slaVerdict(opts.stageMinutes),
        refusedFeatures: refused
    };
}
const PILOT_LADDER = [
    {
        city: 'abuja',
        name: 'Abuja',
        country: 'Nigeria',
        colIndex: 165,
        status: 'piloting'
    },
    {
        city: 'kano',
        name: 'Kano',
        country: 'Nigeria',
        colIndex: 95,
        status: 'queued'
    },
    {
        city: 'enugu',
        name: 'Enugu',
        country: 'Nigeria',
        colIndex: 88,
        status: 'queued'
    },
    {
        city: 'port-harcourt',
        name: 'Port Harcourt',
        country: 'Nigeria',
        colIndex: 118,
        status: 'queued'
    },
    {
        city: 'ibadan',
        name: 'Ibadan',
        country: 'Nigeria',
        colIndex: 85,
        status: 'queued'
    },
    {
        city: 'accra',
        name: 'Accra',
        country: 'Ghana',
        colIndex: 130,
        status: 'voting'
    }
];
const MY_VOTE_CAP = 3;
function forgeVote(book, city) {
    if (book.mine.length >= MY_VOTE_CAP && !book.mine.includes(city)) return {
        ok: false,
        why: 'capped'
    };
    if (book.mine.includes(city)) return {
        ok: false,
        why: 'duplicate'
    };
    return {
        ok: true
    };
}
function applyVote(book, city) {
    return {
        counts: {
            ...book.counts,
            [city]: (book.counts[city] ?? 0) + 1
        },
        mine: [
            ...book.mine,
            city
        ]
    };
}
function voteWinner(book) {
    const entries = Object.entries(book.counts).filter(([, n])=>n > 0);
    if (entries.length === 0) return null;
    entries.sort((a, b)=>b[1] - a[1] || a[0].localeCompare(b[0]));
    return entries[0][0];
}
function lokojaDefaultPack() {
    const city = 'lokoja';
    const roster = [
        [
            'home',
            'Home Quarters',
            'residential'
        ],
        [
            'kpata-market',
            'Kpata Market Road',
            'highstreet'
        ],
        [
            'ganaja-junction',
            'Ganaja Junction',
            'arterial'
        ],
        [
            'confluence',
            'The Confluence',
            'waterfront'
        ],
        [
            'patti-ridge',
            'Mount Patti Ridge',
            'residential'
        ],
        [
            'ful-road',
            'FUL Road',
            'arterial'
        ],
        [
            'adankolo',
            'Adankolo Avenue',
            'residential'
        ],
        [
            'cantonment',
            'Cantonment Street',
            'service'
        ],
        [
            'nigeria-roads',
            'Nigeria Roads Yard',
            'service'
        ],
        [
            'transport-area',
            'Motor Park',
            'highstreet'
        ]
    ];
    const streets = roster.map(([slug, name, kind])=>({
            id: mintStreet(city, slug),
            name,
            kind,
            walkMinutes: walkMinutesFor(kind, 6),
            fromWays: [
                `lko-way-${slug}`
            ]
        }));
    const locations = [
        {
            id: mintLocation(city, 'kpata-market-stalls'),
            name: 'Kpata Market',
            street: mintStreet(city, 'kpata-market'),
            kind: 'market',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'night-food-strip'),
            name: 'Night Food Strip',
            street: mintStreet(city, 'kpata-market'),
            kind: 'food',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'main-bank'),
            name: 'The Bank',
            street: mintStreet(city, 'ganaja-junction'),
            kind: 'bank',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'clinic'),
            name: 'The Clinic',
            street: mintStreet(city, 'adankolo'),
            kind: 'clinic',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'ful-campus'),
            name: 'FUL Campus',
            street: mintStreet(city, 'ful-road'),
            kind: 'school',
            hasInterior: true
        },
        {
            id: mintLocation(city, 'motor-park'),
            name: 'Motor Park',
            street: mintStreet(city, 'transport-area'),
            kind: 'transport',
            hasInterior: false
        }
    ];
    return {
        id: city,
        name: 'Lokoja',
        country: 'Nigeria',
        version: 'lokoja-v1',
        streets,
        locations,
        culture: cultureFor('lokoja', 'Nigeria'),
        economy: economyFor(100),
        civic: civicFor({
            locations,
            streets
        })
    };
}
function recordBuild(ledger, run, atDay) {
    const entry = {
        city: run.city,
        version: run.pack?.version ?? 'none',
        verdict: run.manifest ? 'shipped' : 'refused',
        qaScore: run.qa?.score ?? 0,
        totalMinutes: run.sla.total,
        atDay
    };
    return [
        ...ledger.slice(-19),
        entry
    ];
}
function freshForgeState() {
    return {
        votes: {
            counts: {
                accra: 41,
                kano: 17,
                enugu: 9,
                'port-harcourt': 6,
                ibadan: 5
            },
            mine: []
        },
        ledger: [],
        ranLokoja: false
    };
}
}),
"[project]/src/game/systems/story.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M19: THE CONFLUENCE PATH (the story quest laws)
 * -------------------------------------------------------------
 * One deterministic five-chapter chain: the Crusher boy on the Patti
 * trail → the notebook → the fever night → the sponsorship desk → the
 * white coat. Lokoja's honest ladder — no lottery, no luck: the same
 * grind, the same day, the same naira, every player.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, ctx) → same verdict. No
 *    store, no React, no DOM — the store EXECUTES these rules, the UI
 *    only reads them.
 *  - Every number lives in the STORY table — nothing hard-coded inside
 *    a branch. NO money math happens here: the store wires
 *    removeMoney/addMoney around these validators.
 *  - One task at a time: currentTask() derives from state + ctx and
 *    the story panel just renders it. Energy is NEVER part of task
 *    readiness (the ctx carries no energy) — the task exposes its
 *    energy cost and the ACTION re-validates through canCarrySand at
 *    the store, where the live needs value lives.
 *  - The appliers return NEW state objects; the store drops them into
 *    set() — nothing here mutates the save.
 *  - Chapter 0 → 1 has no separate action: the MEETING is the first
 *    carry (day >= meetDay), exactly as the boy would have it.
 *
 * LOCATION TRUTH: the registry holds no 'fth' id (real ids: home,
 * kpata-market, ganaja-junction, confluence, mount-patti, historic-
 * lokoja, government-area, university-area, food-area, transport-area,
 * plus the school sites). The hospital beats — the fever night and the
 * white coat — therefore stand at 'government-area': the GRA, "where
 * paperwork can change your whole week", the honest civic stand-in for
 * a Federal Teaching Hospital. If a real FTH location is ever
 * registered, only the two constants below move.
 */ __turbopack_context__.s([
    "STORY",
    ()=>STORY,
    "STORY_BEATS",
    ()=>STORY_BEATS,
    "applyCarry",
    ()=>applyCarry,
    "applyFever",
    ()=>applyFever,
    "applyNotebook",
    ()=>applyNotebook,
    "applySponsor",
    ()=>applySponsor,
    "applyWhiteCoat",
    ()=>applyWhiteCoat,
    "canCarrySand",
    ()=>canCarrySand,
    "canGraduate",
    ()=>canGraduate,
    "canPayFever",
    ()=>canPayFever,
    "canPayNotebook",
    ()=>canPayNotebook,
    "canSponsor",
    ()=>canSponsor,
    "chapterOf",
    ()=>chapterOf,
    "coatDay",
    ()=>coatDay,
    "currentTask",
    ()=>currentTask,
    "freshStoryState",
    ()=>freshStoryState
]);
const STORY = {
    meetDay: 3,
    sandCarries: 3,
    sandEnergy: 14,
    sandPay: 400,
    meetPlace: 'mount-patti',
    notebookCost: 3500,
    notebookLevel: 5,
    feverCost: 2000,
    feverPlace: 'government-area',
    sponsorCost: 500,
    sponsorDays: 6,
    graduateWaitDays: 4,
    graduatePlace: 'government-area',
    whiteCoatRep: 15,
    whiteCoatCash: 0,
    whiteCoatOutfit: 'confluence-gold',
    whiteCoatWalk: 'strut'
};
function chapterOf(s) {
    if (s.doctorDay > 0) return 5;
    if (s.feverPaid) return 4;
    if (s.notePaid) return 3;
    if (s.sandDays >= STORY.sandCarries) return 2;
    if (s.sandDays > 0 || s.chapter >= 1) return 1;
    return 0;
}
function freshStoryState() {
    return {
        chapter: 0,
        sandDays: 0,
        lastSandDay: 0,
        notePaid: false,
        feverPaid: false,
        sponsoredDays: 0,
        lastSponsorDay: 0,
        doctorDay: 0
    };
}
function currentTask(s, ctx) {
    const ch = chapterOf(s);
    if (ch === 0) {
        // The boy comes down the trail on meetDay — before that, silence.
        if (ctx.day < STORY.meetDay) return null;
        return {
            id: 'meet-carry',
            label: 'Carry sand with the boy',
            place: STORY.meetPlace,
            kind: 'carry',
            energy: STORY.sandEnergy,
            ready: ctx.day > s.lastSandDay,
            hint: `A small boy on the Patti trail hails you — one honest carry, he shares his cut: ₦${STORY.sandPay} for ${STORY.sandEnergy} energy.`
        };
    }
    if (ch === 1) {
        const left = STORY.sandCarries - s.sandDays;
        return {
            id: 'carry-sand',
            label: left === 1 ? 'One last carry' : `Carry sand — ${left} days to go`,
            place: STORY.meetPlace,
            kind: 'carry',
            energy: STORY.sandEnergy,
            ready: ctx.day > s.lastSandDay,
            hint: left === 1 ? `The last carry — finish it and the boy opens his notebook. ₦${STORY.sandPay} for ${STORY.sandEnergy} energy.` : `Bucket by bucket — one carry a day, ₦${STORY.sandPay} and ${STORY.sandEnergy} energy each. The boy counts days, not grammar.`
        };
    }
    if (ch === 2) {
        // The school knows you: level >= notebookLevel waives the levy (cost 0).
        const cost = ctx.level >= STORY.notebookLevel ? 0 : STORY.notebookCost;
        return {
            id: 'pay-notebook',
            label: cost === 0 ? 'Settle the notebook — waived' : 'Pay the school levy',
            place: STORY.meetPlace,
            kind: 'pay',
            cost,
            ready: ctx.cash >= cost,
            hint: cost === 0 ? `The school knows your name — the ₦${STORY.notebookCost} levy is waved through. Walk it off the boy's head.` : `The boy's school levy and books: ₦${STORY.notebookCost}. Nobody lends it — you earned it on the trail.`
        };
    }
    if (ch === 3) {
        return {
            id: 'pay-fever',
            label: 'Settle the fever night',
            place: STORY.feverPlace,
            kind: 'pay',
            cost: STORY.feverCost,
            ready: ctx.cash >= STORY.feverCost,
            hint: `The boy shakes with fever at the GRA hospital — ₦${STORY.feverCost} for the injections, tonight.`
        };
    }
    if (ch === 4) {
        if (s.sponsoredDays < STORY.sponsorDays) {
            const left = STORY.sponsorDays - s.sponsoredDays;
            return {
                id: 'sponsor-day',
                label: left === 1 ? 'Sponsor the last day' : `Sponsor the desk — ${left} days to go`,
                place: STORY.feverPlace,
                kind: 'pay',
                cost: STORY.sponsorCost,
                ready: ctx.cash >= STORY.sponsorCost && ctx.day > s.lastSponsorDay,
                hint: `₦${STORY.sponsorCost} a day, ${left} left of ${STORY.sponsorDays}. The desk keeps an honest book — one day at a time.`
            };
        }
        return {
            id: 'wait-coat',
            label: 'Wait for the white coat',
            place: STORY.graduatePlace,
            kind: 'wait',
            ready: ctx.day >= coatDay(s),
            hint: `All six days banked — the tailor sews. Return on day ${coatDay(s)} and walk out a doctor.`
        };
    }
    // Chapter 5: the confluence path is walked. The city moves on.
    return null;
}
function coatDay(s) {
    return s.lastSponsorDay > 0 && s.sponsoredDays >= STORY.sponsorDays ? s.lastSponsorDay + STORY.graduateWaitDays : 0;
}
function canCarrySand(s, ctx) {
    if (ctx.chapter >= 2) return {
        ok: false,
        why: 'The sand phase is behind you — the boy remembers.'
    };
    if (ctx.chapter === 0 && ctx.day < STORY.meetDay) {
        return {
            ok: false,
            why: `The boy is still up the hill — he comes down on day ${STORY.meetDay}.`
        };
    }
    if (ctx.day <= s.lastSandDay) {
        return {
            ok: false,
            why: 'One carry a day — the boy shares his cut honestly, but only once.'
        };
    }
    if (ctx.energy < STORY.sandEnergy) {
        return {
            ok: false,
            why: `You need ${STORY.sandEnergy} energy for a carry up the trail. Rest first.`
        };
    }
    return {
        ok: true
    };
}
function canPayNotebook(s, ctx) {
    // Defensive double-lock: a stale chapter ctx can never re-pay the levy.
    if (s.notePaid) return {
        ok: false,
        why: 'The notebook is already paid.'
    };
    if (ctx.chapter < 2) return {
        ok: false,
        why: 'The boy has not asked yet — the sand comes first.'
    };
    if (ctx.chapter > 2) return {
        ok: false,
        why: 'The notebook is already paid.'
    };
    const cost = ctx.level >= STORY.notebookLevel ? 0 : STORY.notebookCost;
    if (ctx.cash < cost) {
        return {
            ok: false,
            why: cost === 0 ? 'The levy is waived — walk it off the boy\'s head.' : `You need ₦${STORY.notebookCost} for the school levy and books.`
        };
    }
    return {
        ok: true,
        cost
    };
}
function canPayFever(s, ctx) {
    // Defensive double-lock: a stale chapter ctx can never re-pay the night.
    if (s.feverPaid) return {
        ok: false,
        why: 'The fever night is already settled.'
    };
    if (ctx.chapter < 3) return {
        ok: false,
        why: 'The fever has not come — the notebook comes first.'
    };
    if (ctx.chapter > 3) return {
        ok: false,
        why: 'The fever night is already settled.'
    };
    if (ctx.cash < STORY.feverCost) {
        return {
            ok: false,
            why: `You need ₦${STORY.feverCost} for the fever night — injections no less.`
        };
    }
    return {
        ok: true,
        cost: STORY.feverCost
    };
}
function canSponsor(s, ctx) {
    if (ctx.chapter < 4) return {
        ok: false,
        why: 'No desk knows your name yet.'
    };
    if (ctx.chapter > 4) return {
        ok: false,
        why: 'The sponsorship chapter is closed.'
    };
    if (s.sponsoredDays >= STORY.sponsorDays) {
        return {
            ok: false,
            why: `All ${STORY.sponsorDays} days are banked — wait for the coat.`
        };
    }
    if (ctx.day <= s.lastSponsorDay) {
        return {
            ok: false,
            why: 'One sponsorship a day — the desk keeps an honest book.'
        };
    }
    if (ctx.cash < STORY.sponsorCost) {
        return {
            ok: false,
            why: `You need ₦${STORY.sponsorCost} for the day's sponsorship.`
        };
    }
    return {
        ok: true,
        cost: STORY.sponsorCost
    };
}
function canGraduate(s, ctx) {
    if (s.doctorDay > 0) return {
        ok: false,
        why: 'You already wear the coat.'
    };
    const coat = coatDay(s);
    if (coat === 0) return {
        ok: false,
        why: 'The coat is not earned yet — the sponsorship desk is waiting.'
    };
    if (ctx.day < coat) return {
        ok: false,
        why: `The tailor still sews — return on day ${coat}.`
    };
    return {
        ok: true
    };
}
function applyCarry(s, day) {
    const sandDays = s.sandDays + 1;
    return {
        ...s,
        sandDays,
        lastSandDay: day,
        chapter: Math.max(s.chapter, sandDays >= STORY.sandCarries ? 2 : 1)
    };
}
function applyNotebook(s) {
    return {
        ...s,
        notePaid: true,
        chapter: Math.max(s.chapter, 3)
    };
}
function applyFever(s) {
    return {
        ...s,
        feverPaid: true,
        chapter: Math.max(s.chapter, 4)
    };
}
function applySponsor(s, day) {
    return {
        ...s,
        sponsoredDays: s.sponsoredDays + 1,
        lastSponsorDay: day
    };
}
function applyWhiteCoat(s, day) {
    return {
        ...s,
        doctorDay: day,
        chapter: Math.max(s.chapter, 5)
    };
}
const STORY_BEATS = [
    {
        chapter: 0,
        title: 'Patti Base',
        line: 'Patti base — a small boy hails you: "Abeg, help me carry sand. I go share my cut. No be scam."'
    },
    {
        chapter: 1,
        title: 'The Sand Days',
        line: 'Bucket by bucket, day by day — the boy counts your days, not your grammar. Three honest carries and he opens his notebook.'
    },
    {
        chapter: 2,
        title: 'The Notebook',
        line: '"My school fee don spoil my head," he says. ₦3,500 — or the school knows your name and waves the levy.'
    },
    {
        chapter: 3,
        title: 'The Fever Night',
        line: 'The GRA hospital by night — the boy shakes with fever and the bill is ₦2,000. You pay. Nobody forgets who stood there.'
    },
    {
        chapter: 4,
        title: 'The Sponsorship Desk',
        line: '₦500 a day, six days straight at the GRA desk. Government work is slow — but it is steady, and it comes with respect.'
    },
    {
        chapter: 5,
        title: 'The White Coat',
        line: 'The white coat fits. Confluence gold under the collar, and the Chairman Strut walks out through the hospital doors.'
    }
];
}),
"[project]/src/game/systems/patti.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M19: MT PATTI SECRETS (the hill's five honest spots)
 * ------------------------------------------------------------------
 * Five seeded hidden places on the guardian hill, discovered the old
 * way: you WALK there. No minigame, no lottery — the ground itself is
 * the game. The HUD polls nearestSecret() with the player's position
 * at ~2Hz; one step inside DISCOVERY_RADIUS and the spot is yours
 * forever (the save records the day it was found).
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (position, state) → same answer.
 *    No store, no React, no DOM.
 *  - Discovery is IDEMPOTENT: finding a found secret returns the same
 *    state and isNew:false — a reward can never double-pay. (The store
 *    wires the drop through its own honest engines exactly once, on
 *    isNew:true — cash/xp/rep via addMoney & co, outfit/walk via the
 *    wardrobe's append-only grant.)
 *  - Rewards ride as DATA (kind + amount/item) — no money moves here.
 *
 * PLACEMENT MATH (authored once from world3d/layout.ts — do not re-derive):
 *  layout.ts's PATTI_TRAIL is a PRIVATE polyline of 7 points from the
 *  trailhead (-51.7,-85.2) to the summit (-85,-136) — and importing
 *  layout.ts would drag the 432KB generated geo.ts into every systems
 *  consumer. So the five secrets are FIXED CONSTANTS, placed (at
 *  authoring time, computed to 1 decimal) as a trail vertex/segment
 *  midpoint plus a fixed PERPENDICULAR offset:
 *    mast         = midpoint(P0→P1) + 6u perpendicular   (west of the track)
 *    baobab       = P2 bend         + 7u perpendicular   (uphill side)
 *    quarry-cave  = P3 bend         + 8u perpendicular   (east slope face)
 *    rest-house   = MOUNT_PATTI anchor (-84.94,-135.78) + (8,-4)
 *    summit-stone = MOUNT_PATTI anchor + (-5,4)          (the summit core)
 *  Every perpendicular offset is < DISCOVERY_RADIUS, so walking the
 *  real trail discovers every secret honestly (trailDist ≤ 8.9);
 *  pairwise spread ≥ 15.3u so two secrets never share one footstep.
 *
 * THE Y LAW: y is 0 everywhere on purpose. Terrain heightAt() lives in
 * the heavy world3d/layout.ts (the 432KB geo chain) — the 3D layer
 * samples heightAt(x, z) itself when it plants the markers; this file
 * never guesses a height.
 */ __turbopack_context__.s([
    "DISCOVERY_RADIUS",
    ()=>DISCOVERY_RADIUS,
    "PATTI_SECRETS",
    ()=>PATTI_SECRETS,
    "discover",
    ()=>discover,
    "freshPattiState",
    ()=>freshPattiState,
    "isDiscovered",
    ()=>isDiscovered,
    "nearestSecret",
    ()=>nearestSecret,
    "secretsFound",
    ()=>secretsFound
]);
const PATTI_SECRETS = [
    {
        id: 'mast',
        name: 'The Climbers\' Mast',
        line: 'An old mast hums on the lower slope — ₦800 tucked under the generator house. "Them no go miss am," you tell yourself.',
        x: -59.3,
        y: 0,
        z: -83.2,
        reward: {
            kind: 'cash',
            amount: 800
        }
    },
    {
        id: 'baobab',
        name: 'The Granddaddy Baobab',
        line: 'The granddaddy baobab — your palm finds the old carved steps. The hill names you friend (rep +3).',
        x: -73.9,
        y: 0,
        z: -95.1,
        reward: {
            kind: 'rep',
            amount: 3
        }
    },
    {
        id: 'quarry-cave',
        name: 'The Quarry Cut',
        line: 'A cool quarry cut hides behind the trail bend — ₦1,200 in a rusted kerosene tin. The hill pays in silence.',
        x: -58.3,
        y: 0,
        z: -108.9,
        reward: {
            kind: 'cash',
            amount: 1200
        }
    },
    {
        id: 'rest-house',
        name: 'Lugard\'s Rest House',
        line: 'Lugard\'s rest house — the walls still stand. Inside, a folded match jersey the hill wind forgot. Na your size.',
        x: -76.9,
        y: 0,
        z: -139.8,
        reward: {
            kind: 'outfit',
            item: 'jersey'
        }
    },
    {
        id: 'summit-stone',
        name: 'The Summit Stone',
        line: 'The summit stone — whole Lokoja at your feet, the two rivers writing one name. +120 XP to your soul.',
        x: -89.9,
        y: 0,
        z: -131.8,
        reward: {
            kind: 'xp',
            amount: 120
        }
    }
];
const DISCOVERY_RADIUS = 9;
const SECRET_BY_ID = new Map(PATTI_SECRETS.map((sec)=>[
        sec.id,
        sec
    ]));
function freshPattiState() {
    return {
        found: {}
    };
}
function secretsFound(s) {
    return PATTI_SECRETS.reduce((n, sec)=>s.found[sec.id] !== undefined ? n + 1 : n, 0);
}
function isDiscovered(s, id) {
    return s.found[id] !== undefined;
}
function nearestSecret(x, z, s) {
    let best = null;
    for (const sec of PATTI_SECRETS){
        if (s.found[sec.id] !== undefined) continue;
        const dist = Math.hypot(x - sec.x, z - sec.z);
        if (dist <= DISCOVERY_RADIUS && (best === null || dist < best.dist)) {
            best = {
                secret: sec,
                dist
            };
        }
    }
    return best;
}
function discover(s, id, day) {
    if (!SECRET_BY_ID.has(id)) return {
        state: s,
        isNew: false
    };
    if (s.found[id] !== undefined) return {
        state: s,
        isNew: false
    };
    return {
        state: {
            ...s,
            found: {
                ...s.found,
                [id]: day
            }
        },
        isNew: true
    };
}
}),
"[project]/src/game/systems/wardrobe.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — M19: THE WARDROBE LAWS (walk-cycle shop + outfit drops)
 * ----------------------------------------------------------------------
 * The fashion layer becomes a real market: premium outfits and walk
 * styles are bought with NAIRA through the honest wallet engines, or
 * GRANTED as drops (quests, festivals, the hill). Pure + deterministic —
 * the same purchase decision is legal or illegal everywhere, and the
 * store only executes what these laws allow.
 *
 * LAWS OF THIS FILE:
 *  - 100% pure/deterministic: same (state, action) → same verdict. No
 *    store, no React, no DOM.
 *  - Money NEVER moves here — the store calls removeMoney/addMoney and
 *    then these laws validate the book change.
 *  - 'street' walk and the six base clothing styles are owned by birth;
 *    only premium goods touch the wardrobe book.
 *  - Drops are append-only: an owned item can never be granted twice
 *    (idempotent), and an unknown key is refused at the door.
 *  - The equipped walk must be an OWNED walk — the law refuses to equip
 *    what the wardrobe does not hold (a bare CityId-style door guard).
 */ __turbopack_context__.s([
    "BASE_STYLE_KEYS",
    ()=>BASE_STYLE_KEYS,
    "PREMIUM_BY_KEY",
    ()=>PREMIUM_BY_KEY,
    "PREMIUM_OUTFITS",
    ()=>PREMIUM_OUTFITS,
    "STREET_WALK",
    ()=>STREET_WALK,
    "WALK_BY_KEY",
    ()=>WALK_BY_KEY,
    "WALK_STYLES",
    ()=>WALK_STYLES,
    "equipWalk",
    ()=>equipWalk,
    "freshWardrobeState",
    ()=>freshWardrobeState,
    "grantDrop",
    ()=>grantDrop,
    "isSaneWalk",
    ()=>isSaneWalk,
    "ownsStyle",
    ()=>ownsStyle,
    "shopBuy",
    ()=>shopBuy,
    "walkRigFor",
    ()=>walkRigFor
]);
const WALK_STYLES = [
    {
        key: 'street',
        label: 'Street Walk',
        blurb: 'The classic Lokoja stride you were born with.',
        price: 0,
        rig: {
            freq: 1,
            swing: 1,
            bob: 1,
            sway: 1,
            lean: 0,
            shin: 1
        }
    },
    {
        key: 'strut',
        label: 'Chairman Strut',
        blurb: 'Shoulders back, chin up — the GRA walk that owns the road.',
        price: 1200,
        rig: {
            freq: 0.86,
            swing: 1.22,
            bob: 1.5,
            sway: 1.6,
            lean: -0.03,
            shin: 0.86
        }
    },
    {
        key: 'swagger',
        label: 'Patti Swagger',
        blurb: 'A rolling hip sway learnt on the mountain trails.',
        price: 1800,
        rig: {
            freq: 0.92,
            swing: 1.1,
            bob: 1.25,
            sway: 2.1,
            lean: 0.01,
            shin: 0.95
        }
    },
    {
        key: 'hustle',
        label: 'Hustle Rush',
        blurb: 'Fast, forward-leaning — POS deadline energy.',
        price: 1500,
        rig: {
            freq: 1.28,
            swing: 1.35,
            bob: 1.15,
            sway: 0.7,
            lean: 0.09,
            shin: 1.15
        }
    },
    {
        key: 'glide',
        label: 'Confluence Glide',
        blurb: 'Smooth as the Niger at dawn — barely a bob.',
        price: 2200,
        rig: {
            freq: 0.78,
            swing: 0.78,
            bob: 0.45,
            sway: 0.9,
            lean: 0,
            shin: 0.8
        }
    },
    {
        key: 'bata',
        label: 'Bata Step',
        blurb: 'The festival drum in your feet — every walk a small dance.',
        price: 2600,
        rig: {
            freq: 1.12,
            swing: 1.45,
            bob: 1.8,
            sway: 1.8,
            lean: 0.02,
            shin: 1.3
        }
    }
];
const PREMIUM_OUTFITS = [
    {
        key: 'agbada',
        label: 'Agbada Royale',
        blurb: 'Three-piece flowing grandeur — owambe law.',
        price: 8500
    },
    {
        key: 'confluence-gold',
        label: 'Confluence Gold',
        blurb: 'The white-coat gift: gold-threaded agbada. Not sold — earned.',
        price: 0
    },
    {
        key: 'jersey',
        label: 'Match Jersey',
        blurb: 'Number 10 — the street named you.',
        price: 3200
    },
    {
        key: 'lab-coat',
        label: 'The White Coat',
        blurb: 'A dream pressed clean. Not sold — earned.',
        price: 0
    }
];
const WALK_BY_KEY = new Map(WALK_STYLES.map((w)=>[
        w.key,
        w
    ]));
const PREMIUM_BY_KEY = new Map(PREMIUM_OUTFITS.map((o)=>[
        o.key,
        o
    ]));
const BASE_STYLE_KEYS = new Set([
    'tshirt',
    'kaftan',
    'ankara',
    'senator',
    'hoodie',
    'lace'
]);
const STREET_WALK = 'street';
/* ----------------------------------- laws ----------------------------------- */ const RIG_BOUNDS = {
    freq: [
        0.6,
        1.5
    ],
    swing: [
        0.5,
        1.6
    ],
    bob: [
        0.2,
        2.0
    ],
    sway: [
        0.4,
        2.4
    ],
    lean: [
        -0.05,
        0.12
    ],
    shin: [
        0.6,
        1.4
    ]
};
function isSaneWalk(w) {
    const r = w.rig;
    return r.freq >= RIG_BOUNDS.freq[0] && r.freq <= RIG_BOUNDS.freq[1] && r.swing >= RIG_BOUNDS.swing[0] && r.swing <= RIG_BOUNDS.swing[1] && r.bob >= RIG_BOUNDS.bob[0] && r.bob <= RIG_BOUNDS.bob[1] && r.sway >= RIG_BOUNDS.sway[0] && r.sway <= RIG_BOUNDS.sway[1] && r.lean >= RIG_BOUNDS.lean[0] && r.lean <= RIG_BOUNDS.lean[1] && r.shin >= RIG_BOUNDS.shin[0] && r.shin <= RIG_BOUNDS.shin[1];
}
function freshWardrobeState() {
    return {
        ownedStyles: [],
        ownedWalks: [],
        activeWalk: STREET_WALK
    };
}
function shopBuy(state, kind, itemKey) {
    if (kind === 'walk') {
        const w = WALK_BY_KEY.get(itemKey);
        if (!w) return {
            ok: false,
            why: 'We no sell that walk for this market.'
        };
        if (w.key === STREET_WALK) return {
            ok: false,
            why: 'Street Walk na your birthright — e no dey cost.'
        };
        if (w.price <= 0) return {
            ok: false,
            why: 'This one na gift — no price tag.'
        };
        if (state.ownedWalks.includes(w.key)) return {
            ok: false,
            why: 'You don already own this walk.'
        };
        return {
            ok: true,
            itemKey: w.key,
            price: w.price,
            kind: 'walk'
        };
    }
    const o = PREMIUM_BY_KEY.get(itemKey);
    if (!o) return {
        ok: false,
        why: 'We no sell that cloth for this market.'
    };
    if (o.price <= 0) return {
        ok: false,
        why: 'This one na gift — you must earn am.'
    };
    if (state.ownedStyles.includes(o.key)) return {
        ok: false,
        why: 'You don already own this outfit.'
    };
    return {
        ok: true,
        itemKey: o.key,
        price: o.price,
        kind: 'outfit'
    };
}
function equipWalk(state, walkKey) {
    if (!WALK_BY_KEY.has(walkKey)) return {
        ok: false,
        why: 'That walk no exist.'
    };
    if (walkKey !== STREET_WALK && !state.ownedWalks.includes(walkKey)) {
        return {
            ok: false,
            why: 'Buy the walk first — the rig no dey take credit.'
        };
    }
    return {
        ok: true,
        walkKey
    };
}
function grantDrop(state, kind, itemKey) {
    if (kind === 'walk') {
        if (!WALK_BY_KEY.has(itemKey)) return {
            ok: false,
            why: 'Unknown walk drop.'
        };
        if (state.ownedWalks.includes(itemKey)) return {
            ok: true,
            added: null
        };
        state.ownedWalks.push(itemKey);
        return {
            ok: true,
            added: itemKey
        };
    }
    if (!PREMIUM_BY_KEY.has(itemKey) && !BASE_STYLE_KEYS.has(itemKey)) return {
        ok: false,
        why: 'Unknown outfit drop.'
    };
    if (BASE_STYLE_KEYS.has(itemKey)) return {
        ok: true,
        added: null
    } // base styles need no book
    ;
    if (state.ownedStyles.includes(itemKey)) return {
        ok: true,
        added: null
    };
    state.ownedStyles.push(itemKey);
    return {
        ok: true,
        added: itemKey
    };
}
function ownsStyle(state, styleKey) {
    return BASE_STYLE_KEYS.has(styleKey) || state.ownedStyles.includes(styleKey);
}
function walkRigFor(state) {
    const w = state ? WALK_BY_KEY.get(state.activeWalk) : undefined;
    return w && isSaneWalk(w) ? w.rig : WALK_STYLES[0].rig;
}
}),
"[project]/src/game/systems/nation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * M20 — THE NATION SLICE (the ops books)
 * ---------------------------------------
 * Pure laws + the fresh state for the Nation Dashboard. The store
 * executes, the UI reads — the same doctrine as every systems module.
 *
 * THE NO-TEXT LAW: the moderation book stores {day, why, band} ONLY —
 * never a word of what anybody typed. The M17 word wall already
 * refused the text; this book counts the refusals, it does not
 * archive them. The type system enforces it: there is no field the
 * text could even live in.
 *
 * THE ONE-CHANNEL LAW: the inflation book records the SAME liquidity
 * multiplier the day roll folded into marketDayRoll (civic.ts) — the
 * dashboard reads the city's real ledger, it invents nothing.
 */ __turbopack_context__.s([
    "MODERATION_WHYS",
    ()=>MODERATION_WHYS,
    "crowdToggle",
    ()=>crowdToggle,
    "freshNationState",
    ()=>freshNationState,
    "getLiveSnapshot",
    ()=>getLiveSnapshot,
    "inflationTrend",
    ()=>inflationTrend,
    "moderationScore",
    ()=>moderationScore,
    "recordInflation",
    ()=>recordInflation,
    "recordModeration",
    ()=>recordModeration,
    "setLiveSnapshot",
    ()=>setLiveSnapshot
]);
function freshNationState() {
    return {
        crowd: {
            seed: 20261017,
            count: 10_000,
            on: true
        },
        inflation: [],
        moderation: [],
        telemetryOptIn: false
    };
}
function recordInflation(book, day, mult) {
    const d = Math.max(1, Math.floor(day));
    const m = Math.max(0.5, Math.min(3, Number.isFinite(mult) ? mult : 1));
    if (book.some((row)=>row.day === d)) return {
        next: book,
        recorded: false
    };
    const next = [
        ...book,
        {
            day: d,
            mult: Math.round(m * 1000) / 1000
        }
    ];
    return {
        next: next.slice(-12),
        recorded: true
    };
}
function inflationTrend(book) {
    if (book.length === 0) return {
        avg: 1,
        hot: false,
        rows: 0
    };
    const avg = book.reduce((a, r)=>a + r.mult, 0) / book.length;
    return {
        avg: Math.round(avg * 1000) / 1000,
        hot: avg >= 1.1,
        rows: book.length
    };
}
const MODERATION_WHYS = [
    'kid-text-refused',
    'word-wall',
    'no-links-ever',
    'too-long',
    'empty',
    'guest-mic-dark'
];
function recordModeration(book, day, why, band) {
    if (!MODERATION_WHYS.includes(why)) return {
        next: book,
        recorded: false
    };
    const b = band === 'kid' || band === 'teen' || band === 'adult' ? band : 'unknown';
    const next = [
        ...book,
        {
            day: Math.max(1, Math.floor(day)),
            why,
            band: b
        }
    ];
    return {
        next: next.slice(-40),
        recorded: true
    };
}
function moderationScore(book) {
    const counts = new Map();
    for (const row of book)counts.set(row.why, (counts.get(row.why) ?? 0) + 1);
    return MODERATION_WHYS.filter((w)=>counts.has(w)).map((why)=>({
            why,
            count: counts.get(why) ?? 0
        }));
}
function crowdToggle(state, on) {
    return {
        ...state,
        crowd: {
            ...state.crowd,
            on
        }
    };
}
/* --------------------------- the snapshot holder ---------------------------- */ /**
 * The session-only live snapshot (never persisted — the wire is the
 * worker's, the save keeps only the switch). The store mirrors the
 * bridge's latest aggregate here for the dashboard.
 */ let liveSnapshot = null;
function setLiveSnapshot(s) {
    liveSnapshot = s;
}
function getLiveSnapshot() {
    return liveSnapshot;
}
}),
"[project]/src/game/systems/save.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — Save System (M14 FORTRESS transport)
 * ---------------------------------------------------
 * Versioned persistence with a migration hook, a SIGNED envelope, and
 * ATOMIC DOUBLE-BUFFER writes.
 *
 * The envelope: the primary key carries `{"fmt":2,"data":<save>,"sig":<hmac>}`.
 * The signature is HMAC-SHA256 over the EXACT serialized save string,
 * keyed by a device-local key stored OUTSIDE the save (FORT_KEY_STORAGE).
 * The shadow key (`save-b`) holds the PREVIOUS primary payload before
 * every overwrite — a torn write falls back to it, then the M9 backup
 * slot, then fresh. Nobody ever loses a save to a crashed tab.
 *
 * Honest scope: client-side signing is a BARRIER, not a vault. It stops
 * casual cheats, memory editors and shared save hacks, and makes any
 * tampering LOUD (the load narrates every descent).
 *
 * Legacy law: a bare (pre-Fortress) payload loads as legacy and gets the
 * envelope on its next write; a signed payload whose key went missing
 * re-keys as legacy — the device lost its key, not the player's honesty.
 */ __turbopack_context__.s([
    "PUSHED_HASH_KEY",
    ()=>PUSHED_HASH_KEY,
    "SAVE_VERSION",
    ()=>SAVE_VERSION,
    "SaveSystem",
    ()=>SaveSystem,
    "lastTransportVerdict",
    ()=>lastTransportVerdict,
    "lastWriteVerdict",
    ()=>lastWriteVerdict
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/civic.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/goals.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/guest.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/calendar.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/rivers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/education.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/japa.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/pulse.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/citypack.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/story.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/patti.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wardrobe.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/nation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fortress.ts [app-route] (ecmascript)");
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
const SAVE_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORTRESS_KEYS"].primary;
const SHADOW_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORTRESS_KEYS"].shadow;
const SAVE_VERSION = 20;
/** M15 — THE DELTA LAW: the state fingerprint of the last payload that hit disk.
 *  Lives OUTSIDE the save (the fortress rule: the books live beside, not inside). */ const DELTA_HASH_KEY = 'lokoja-life:save-hash';
const PUSHED_HASH_KEY = 'lokoja-life:pushed-hash';
/** M20 — the EXACT string the vault last accepted (the binary delta's base). */ const LAST_PUSHED_ENV_KEY = 'lokoja-life:last-pushed-env';
/**
 * THE STATE FINGERPRINT — sha256 over the save with the timestamps
 * zeroed. Two saves whose ONLY difference is `updatedAt` are the SAME
 * life: the debounced autosave re-fires on an idle city every few
 * seconds, and the timestamps alone must never grind the disk (or the
 * cloud). The disk keeps the LAST REAL write's timestamp — an honest
 * "when your life last changed" line.
 */ function stateFingerprint(save) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sha256"])(JSON.stringify({
        ...save,
        createdAt: 0,
        updatedAt: 0
    }));
}
/** Check localStorage availability without throwing (private mode etc). */ function storageAvailable() {
    try {
        const probe = '__lko_probe__';
        window.localStorage.setItem(probe, '1');
        window.localStorage.removeItem(probe);
        return true;
    } catch  {
        return false;
    }
}
/* ------------------------------ the device key ------------------------------ */ let cachedKey = null;
/** Read (or create) the device-local fortress key. Test hook: setFortKey. */ function fortKey() {
    if (cachedKey) return cachedKey;
    try {
        const existing = window.localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORT_KEY_STORAGE"]);
        if (existing && existing.length >= 32) {
            cachedKey = existing;
            return cachedKey;
        }
        // fresh device key — random bytes via crypto, Math.random as the honest fallback
        let hex = '';
        if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
            const bytes = new Uint8Array(24);
            crypto.getRandomValues(bytes);
            hex = Array.from(bytes).map((b)=>b.toString(16).padStart(2, '0')).join('');
        } else {
            for(let i = 0; i < 24; i++)hex += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
        }
        window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORT_KEY_STORAGE"], hex);
        cachedKey = hex;
        return cachedKey;
    } catch  {
        return null;
    }
}
/**
 * TEST HOOK — pin the device key deterministically (the suite signs and
 * tampers against a FIXED key so the vectors stay stable).
 */ function setFortKey(key) {
    cachedKey = key;
    try {
        window.localStorage.setItem(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FORT_KEY_STORAGE"], key);
    } catch  {
    /* the caller owns storage in tests */ }
}
/* --------------------------- serialize + envelope --------------------------- */ /** Serialize the save into the storage-safe JSON string. */ function serialize(save) {
    return JSON.stringify({
        ...save,
        version: SAVE_VERSION
    });
}
function wrapEnvelope(dataStr) {
    const key = fortKey();
    const sig = key ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signPayload"])(dataStr, key) : '';
    return JSON.stringify({
        fmt: 2,
        data: JSON.parse(dataStr),
        sig
    });
}
/**
 * Parse + verify an envelope or a legacy bare save. Returns the save
 * (healed) plus the transport verdict the boot toast narrates.
 */ function unwrapEnvelope(raw) {
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.fmt === 2 && typeof parsed.sig === 'string') {
            // signed envelope — re-serialize the data slice EXACTLY as stored
            const dataStr = JSON.stringify(parsed.data);
            const key = fortKey();
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyPayload"])(dataStr, parsed.sig, key);
            if (v.ok) {
                return parsed.data ? {
                    save: parsed.data,
                    verdict: 'ok'
                } : {
                    save: null,
                    verdict: 'malformed'
                };
            }
            if (v.why === 'missing-key') {
                return parsed.data ? {
                    save: parsed.data,
                    verdict: 'missing-key'
                } : {
                    save: null,
                    verdict: 'malformed'
                };
            }
            if (v.why === 'tampered') return {
                save: null,
                verdict: 'tampered'
            };
            return {
                save: null,
                verdict: 'malformed'
            };
        }
        // legacy bare save (pre-M14) — loads as legacy, re-signed on next write
        return {
            save: parsed ?? null,
            verdict: 'legacy'
        };
    } catch  {
        return {
            save: null,
            verdict: 'malformed'
        };
    }
}
/**
 * Parse + migrate an old save string into the current shape.
 * Each case below upgrades one version step; future versions
 * add their own `case N` — never break existing players.
 */ function deserialize(raw) {
    const { save: parsed, verdict } = unwrapEnvelope(raw);
    if (verdict === 'tampered' || verdict === 'malformed') return null;
    if (!parsed || typeof parsed !== 'object' || !parsed.player) return null;
    let save = parsed;
    switch(save.version){
        case 1:
            // v1 → v2 (Stage 3): economy/work fields added to the player.
            // All are defaulted below — nothing a v1 player had is lost.
            save.version = 2;
            break;
        case 2:
            // v2 → v3 (Stage 5): vehicles, bank balance, NPC relationships.
            // Defaults applied below — a v2 player wakes up with an empty
            // garage, an empty bank account, and strangers for friends.
            save.version = 3;
            break;
        case 3:
            // v3 → v4 (M2): the civic mesh — NEPA/KGIRS/police/EFCC/market.
            // freshCivicState() below gives a v3 player a clean civic slate:
            // no bills owed, no warrant, a rolled market for their current day.
            save.version = 4;
            break;
        case 4:
            // v4 → v5 (M3 — OWN THE CITY): businesses gain the accrual fields
            // (accrued till, lastAccrualDay, openedDay). Any biz entry a v4 save
            // somehow carries is defaulted below; normal v4 saves carry an
            // empty array, which is already the correct v5 shape.
            save.version = 5;
            break;
        case 5:
            // v5 → v6 (M5 — WORK & FLEET): businesses gain staff + installed
            // upgrades, and the save carries the fleet's done-gig ledger. Both
            // default below — a v5 player wakes up with no attendants hired,
            // no generator/solar fitted, and a clean Motor Park board.
            save.version = 6;
            break;
        case 6:
            // v6 → v7 (M6 — LIVING WORLD): the relationship track gains the
            // gift/hangout cooldowns (lastGiftDay / lastHangoutDay). Optional
            // fields defaulted below — a v6 player wakes up with no gifts
            // given and no hangouts owed, everything else untouched.
            save.version = 7;
            break;
        case 7:
            // v7 → v8 (M7 — RUN ON ANY DEVICE): settings gains the graphics
            // pick ('auto' | 'low' | 'mid' | 'high'). Defaulted below — a v7
            // player wakes up on Auto and the device law decides for them.
            save.version = 8;
            break;
        case 8:
            // v8 → v9 (M8 — THE CHAOS ENGINE): the chaos slice joins the save —
            // transformer outages, the community fix pool, scarcity bookkeeping.
            // Defaulted below — a v8 player wakes up on a quiet grid.
            save.version = 9;
            break;
        case 9:
            // v9 → v10 (M9 — THE CASUAL SHELL): daily goals, the onboarding
            // arc, the Guest Loop account line, and settings.chill join the
            // schema. All defaulted below — a v9 player wakes up as a guest
            // with today's goals waiting and the city at normal pressure.
            save.version = 10;
            break;
        case 10:
            // v10 → v11 (M10 — THE LIVING CALENDAR): the calendar slice joins
            // the save — festival participation, ram meat, regatta stakes,
            // aso-ebi, the paving projects. Defaulted below — a v10 player
            // wakes up with the year's celebrations waiting, nothing owed.
            save.version = 11;
            break;
        case 11:
            // v11 → v12 (M11 — THE RIVERS AWAKE): the rivers slice joins the
            // save — sandbags, walkways, tolls, the canoe, the rescue bowl.
            // Defaulted below — a v11 player wakes up on a dry-season river.
            save.version = 12;
            break;
        case 12:
            // v12 → v13 (M12 — THE LADDER): the education, housing and japa
            // slices join the save — the FUL semester clock, the rent book,
            // and the JAPA document chain. Defaulted below — a v12 player
            // wakes up with the ladder waiting at the bottom rung.
            save.version = 13;
            break;
        case 13:
            // v13 → v14 (M13 — THE FAMILY SHIELD): the character gains a life
            // stage, the settings gain elder mode, and the shield slice joins
            // the save — the scammer game's book and the local parent gate.
            // Defaulted below — a v13 player wakes up as an adult (the honest
            // default for existing hustlers) with the literacy game waiting.
            save.version = 14;
            break;
        case 14:
            // v14 → v15 (M14 — THE FORTRESS): the fortress slice joins the
            // save — the anomaly counter, the income ledgers, the kobo-chain
            // tail. Defaulted below — a v14 player wakes up guarded, with a
            // clean ledger and their first entry chaining from the seed.
            save.version = 15;
            break;
        case 15:
            // v15 → v16 (M15 — TELEPORT & PULSE): the pulse slice joins the
            // save — the read book for the city paper, the arrival book for
            // teleport postcards, the share ledger. Defaulted below — a v15
            // player wakes up with the paper waiting and an empty mailbox.
            save.version = 16;
            break;
        case 16:
            // v16 → v17 (M17 — THE LIVE NATION): the live slice joins the
            // save — my event cursor, my voice opt-in, my memberships.
            // Defaulted below — a v16 player wakes up standing in the nation
            // with the mic ready and the cursor at zero.
            save.version = 17;
            break;
        case 17:
            // v17 → v18 (M18 — THE CITY FORGE): the forge slice joins the
            // save — the vote book and the ledger. Defaulted below — a v17
            // player wakes up holding a vote card and an empty ledger.
            save.version = 18;
            break;
        case 18:
            // v18 → v19 (M19 — NEXT-GEN POLISH): the story (THE CONFLUENCE PATH),
            // the Patti secrets and the wardrobe book join the save, plus the
            // settings.music / settings.haptics picks. All defaulted below — a
            // v18 player wakes up at chapter 0 with a dry hill, an empty
            // wardrobe, the soundtrack off until they turn it on, and haptics
            // humming on their phone.
            save.version = 19;
            break;
        case 19:
            // v19 → v20 (M20 — PLANET SCALE + OPS): the nation slice joins the
            // save — the crowd switch, the inflation ledger, the moderation
            // book and the telemetry opt-in (dark by default). Defaulted
            // below — a v19 player wakes up with the city alive, the books
            // empty and their data theirs.
            save.version = 20;
            break;
        case 20:
            break;
        default:
            // F1 HARDENING — a save from a NEWER app version is REFUSED, not
            // best-effort loaded: its shape is ahead of every migration here, and
            // the unconditional stamp-down below used to claim it as v20. null
            // sends the load descent to the shadow/backup rungs, then fresh —
            // continueGame (useGameStore) reads a null load as "no save" and falls
            // back to the new-game flow. Legacy bare saves (version undefined)
            // still pass: `undefined > SAVE_VERSION` is false.
            if (typeof save.version === 'number' && save.version > SAVE_VERSION) return null;
            break;
    }
    // --- defensive defaults (never break a loadable save) ---
    if (!save.world) {
        save.world = {
            day: 1,
            timeOfDay: 'morning',
            weather: 'sunny',
            currentLocation: 'home'
        };
    }
    if (!save.world.currentLocation) save.world.currentLocation = 'home';
    if (!save.settings) save.settings = {
        sound: true,
        graphics: 'auto',
        chill: false,
        elder: false,
        music: false,
        haptics: true
    };
    if (typeof save.settings.sound !== 'boolean') save.settings.sound = true;
    if (![
        'auto',
        'low',
        'mid',
        'high'
    ].includes(save.settings.graphics)) save.settings.graphics = 'auto';
    if (typeof save.settings.chill !== 'boolean') save.settings.chill = false;
    if (typeof save.settings.elder !== 'boolean') save.settings.elder = false;
    // M19 — music defaults OFF (respect data plans), haptics ON (touch is the point)
    if (typeof save.settings.music !== 'boolean') save.settings.music = false;
    if (typeof save.settings.haptics !== 'boolean') save.settings.haptics = true;
    // --- Stage 3 player fields (missing on v1 saves / corrupt data) ---
    const p = save.player;
    if (!p.skillXp) p.skillXp = {
        hustle: 0,
        smart: 0,
        social: 0
    };
    if (!p.activeOpportunities) p.activeOpportunities = [];
    if (!p.cooldowns) p.cooldowns = {};
    if (!p.transactions) p.transactions = [];
    if (!p.stats) {
        p.stats = {
            jobsCompleted: 0,
            hustlesCompleted: 0,
            totalEarned: 0,
            totalSpent: 0
        };
    }
    // --- M13 family shield (missing on v13-and-older saves) ---
    if (p.ageBand !== 'kid' && p.ageBand !== 'teen' && p.ageBand !== 'adult') p.ageBand = 'adult';
    // --- Stage 5 player fields (missing on v2-and-older saves) ---
    if (!p.vehicles) p.vehicles = [];
    // F1 HARDENING — the bank law: finite, non-negative, whole naira. The old
    // guard caught non-numbers only; Infinity/NaN/negative/fractional rode
    // straight into the engine.
    p.bankBalance = typeof p.bankBalance === 'number' && Number.isFinite(p.bankBalance) ? Math.max(0, Math.floor(p.bankBalance)) : 0;
    if (!p.relationships) p.relationships = {};
    // --- M6 social-depth fields (missing on v6-and-older saves) ---
    for (const key of Object.keys(p.relationships)){
        const r = p.relationships[key];
        if (typeof r.lastGiftDay !== 'number') r.lastGiftDay = 0;
        if (typeof r.lastHangoutDay !== 'number') r.lastHangoutDay = 0;
    }
    // --- M3 businesses (missing on v4-and-older saves; legacy entries upgraded) ---
    if (!p.businesses) p.businesses = [];
    p.businesses = p.businesses.map((b)=>({
            ...b,
            accrued: typeof b.accrued === 'number' ? b.accrued : 0,
            lastAccrualDay: typeof b.lastAccrualDay === 'number' ? b.lastAccrualDay : save.world?.day ?? 1,
            openedDay: typeof b.openedDay === 'number' ? b.openedDay : save.world?.day ?? 1,
            // M5 — staff & power (missing on v5-and-older saves)
            staff: typeof b.staff === 'number' && b.staff > 0 ? b.staff : 0,
            upgrades: Array.isArray(b.upgrades) ? b.upgrades : []
        }));
    // --- M5 fleet ledger (missing on v5-and-older saves) ---
    const fleet = save.fleet && Array.isArray(save.fleet.done) ? save.fleet : {
        day: save.world?.day ?? 1,
        done: []
    };
    if (typeof fleet.day !== 'number') fleet.day = save.world?.day ?? 1;
    save.fleet = fleet;
    // --- M8 chaos engine (missing on v8-and-older saves; partial data healed) ---
    const fresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshChaosState"])();
    const chaos = save.chaos ?? fresh;
    if (typeof chaos.day !== 'number') chaos.day = fresh.day;
    if (!Array.isArray(chaos.recent)) chaos.recent = fresh.recent;
    if (!chaos.active || typeof chaos.active.zoneId !== 'string') chaos.active = null;
    if (typeof chaos.atmDrawnDay !== 'number') chaos.atmDrawnDay = fresh.atmDrawnDay;
    if (typeof chaos.atmDrawn !== 'number') chaos.atmDrawn = fresh.atmDrawn;
    if (!chaos.stats) chaos.stats = fresh.stats;
    save.chaos = chaos;
    // --- M9 casual shell (missing on v9-and-older saves; partial data healed) ---
    if (!save.goals || !Array.isArray(save.goals.ids) || save.goals.ids.length !== 3) save.goals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$goals$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshGoalState"])();
    if (!Array.isArray(save.goals.done)) save.goals.done = [
        false,
        false,
        false
    ];
    if (!save.onboarding || !Array.isArray(save.onboarding.done)) save.onboarding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshOnboardingState"])();
    if (typeof save.onboarding.rewarded !== 'boolean') save.onboarding.rewarded = false;
    if (!save.account) save.account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$guest$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshAccountState"])();
    if (typeof save.account.linked !== 'boolean') save.account.linked = false;
    if (typeof save.account.gateGraceDay !== 'number') save.account.gateGraceDay = 0;
    // --- M10 living calendar (missing on v10-and-older saves; partial data healed) ---
    const freshCal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$calendar$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshCalendarState"])();
    const cal = save.calendar ?? freshCal;
    if (typeof cal.day !== 'number') cal.day = freshCal.day;
    if (typeof cal.meatPacks !== 'number') cal.meatPacks = 0;
    if (!Array.isArray(cal.meatShares)) cal.meatShares = [];
    if (!Array.isArray(cal.sponsored)) cal.sponsored = [];
    if (!Array.isArray(cal.bets)) cal.bets = [];
    if (!Array.isArray(cal.asoEbi)) cal.asoEbi = [];
    if (!Array.isArray(cal.attended)) cal.attended = [];
    if (!Array.isArray(cal.paved)) cal.paved = [];
    if (!cal.paving || typeof cal.paving.zoneId !== 'string') cal.paving = null;
    if (!cal.stats) cal.stats = freshCal.stats;
    cal.paved = cal.paved.filter((r)=>typeof r.zoneId === 'string' && typeof r.untilDay === 'number');
    save.calendar = cal;
    // --- M11 rivers (missing on v11-and-older saves; partial data healed) ---
    const freshRiv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$rivers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshRiversState"])();
    const rivers = save.rivers ?? freshRiv;
    if (typeof rivers.day !== 'number') rivers.day = freshRiv.day;
    if (typeof rivers.sandbags !== 'number') rivers.sandbags = 0;
    if (typeof rivers.canoe !== 'boolean') rivers.canoe = false;
    if (!rivers.walkways || typeof rivers.walkways !== 'object') rivers.walkways = {};
    for (const [zoneId, w] of Object.entries(rivers.walkways)){
        if (typeof w.laid !== 'number' || w.laid < 0) w.laid = 0;
        if (typeof w.tollTier !== 'number') w.tollTier = 0;
        if (typeof w.pot !== 'number') w.pot = 0;
        if (typeof w.tollDay !== 'number') w.tollDay = 0;
        rivers.walkways[zoneId] = w;
    }
    if (!rivers.rescue || typeof rivers.rescue.zoneId !== 'string' || typeof rivers.rescue.year !== 'number') rivers.rescue = null;
    if (typeof rivers.rescuedYear !== 'number') rivers.rescuedYear = 0;
    if (typeof rivers.ferryDay !== 'number') rivers.ferryDay = 0;
    if (!Array.isArray(rivers.ferryDone)) rivers.ferryDone = [];
    if (!rivers.stats) rivers.stats = freshRiv.stats;
    save.rivers = rivers;
    // --- M12 ladder (missing on v12-and-older saves; partial data healed) ---
    const freshEd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshEducationState"])();
    const ed = save.education ?? freshEd;
    if (typeof ed.enrolled !== 'boolean') ed.enrolled = false;
    if (typeof ed.semester !== 'number' || ed.semester < 1) ed.semester = freshEd.semester;
    if (typeof ed.semesterStartDay !== 'number') ed.semesterStartDay = 0;
    if (typeof ed.lecturesDone !== 'number') ed.lecturesDone = 0;
    if (typeof ed.lastLectureDay !== 'number') ed.lastLectureDay = 0;
    if (typeof ed.lastGrantSemester !== 'number') ed.lastGrantSemester = 0;
    if (typeof ed.examsPassed !== 'number') ed.examsPassed = 0;
    if (typeof ed.failedExams !== 'number') ed.failedExams = 0;
    if (typeof ed.graduated !== 'boolean') ed.graduated = false;
    if (typeof ed.convocationDay !== 'number') ed.convocationDay = null;
    if (typeof ed.convocationAttended !== 'boolean') ed.convocationAttended = false;
    if (!ed.stats) ed.stats = freshEd.stats;
    save.education = ed;
    const freshHou = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshHousingState"])();
    const hou = save.housing ?? freshHou;
    if (hou.owned !== null && typeof hou.owned !== 'string') hou.owned = null;
    if (!hou.furnishing || typeof hou.furnishing !== 'object') hou.furnishing = {};
    if (typeof hou.rentPaidThrough !== 'number') hou.rentPaidThrough = 0;
    if (typeof hou.lastPostedDay !== 'number') hou.lastPostedDay = 0;
    if (typeof hou.rentOwed !== 'number' || hou.rentOwed < 0) hou.rentOwed = 0;
    if (!hou.wahala || typeof hou.wahala.kind !== 'string') hou.wahala = null;
    if (!hou.stats) hou.stats = freshHou.stats;
    save.housing = hou;
    const freshJap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$japa$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshJapaState"])();
    const jap = save.japa ?? freshJap;
    for (const k of [
        'nimcReadyDay',
        'nimcDay',
        'passportReadyDay',
        'passportDay',
        'agentTries',
        'agentScams',
        'clearanceDay',
        'policeDay',
        'flownDay',
        'remitDay',
        'policeShifts',
        'sirenUntilDay',
        'lastEscortDay'
    ]){
        if (typeof jap[k] !== 'number') jap[k] = 0;
    }
    if (!jap.stats) jap.stats = freshJap.stats;
    save.japa = jap;
    // --- M13 shield (missing on v13-and-older saves; partial data healed) ---
    const freshSh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshShieldState"])();
    const sh = save.shield ?? freshSh;
    if (typeof sh.scammerDay !== 'number') sh.scammerDay = freshSh.scammerDay;
    if (typeof sh.scammerCorrect !== 'number') sh.scammerCorrect = freshSh.scammerCorrect;
    if (typeof sh.scammerWrong !== 'number') sh.scammerWrong = freshSh.scammerWrong;
    if (typeof sh.scammerStreak !== 'number') sh.scammerStreak = freshSh.scammerStreak;
    if (typeof sh.parentPinHash !== 'string' && sh.parentPinHash !== null) sh.parentPinHash = null;
    save.shield = sh;
    // --- M14 fortress (missing on v14-and-older saves; partial data healed) ---
    const freshFt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshFortressState"])();
    const ft = save.fortress ?? freshFt;
    if (typeof ft.anomalies !== 'number' || ft.anomalies < 0) ft.anomalies = freshFt.anomalies;
    if (typeof ft.dayEarnedDay !== 'number') ft.dayEarnedDay = freshFt.dayEarnedDay;
    if (typeof ft.dayEarned !== 'number' || ft.dayEarned < 0) ft.dayEarned = freshFt.dayEarned;
    if (typeof ft.slotTxCount !== 'number' || ft.slotTxCount < 0) ft.slotTxCount = freshFt.slotTxCount;
    if (typeof ft.slotTxSlot !== 'number') ft.slotTxSlot = freshFt.slotTxSlot;
    if (typeof ft.chainTail !== 'string') ft.chainTail = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CHAIN_SEED"];
    if (typeof ft.fingerprint !== 'string' && ft.fingerprint !== null) ft.fingerprint = null;
    save.fortress = ft;
    // --- M15 city pulse (missing on v15-and-older saves; partial data healed) ---
    const freshPl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$pulse$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshPulseState"])();
    const pl = save.cityPulse ?? freshPl;
    if (typeof pl.readDay !== 'number' || pl.readDay < 0) pl.readDay = freshPl.readDay;
    if (!Array.isArray(pl.seen)) pl.seen = [];
    if (!Array.isArray(pl.arrivals)) pl.arrivals = [];
    pl.arrivals = pl.arrivals.filter((c)=>typeof c === 'string' && c.startsWith('lkt1.')).slice(-20);
    pl.seen = pl.seen.filter((s)=>typeof s === 'string').slice(-64);
    if (!pl.stats || typeof pl.stats !== 'object') pl.stats = freshPl.stats;
    if (typeof pl.stats.shares !== 'number' || pl.stats.shares < 0) pl.stats.shares = 0;
    if (typeof pl.stats.arrivalsIn !== 'number' || pl.stats.arrivalsIn < 0) pl.stats.arrivalsIn = 0;
    save.cityPulse = pl;
    // --- M17 live nation (missing on v16-and-older saves; partial data healed) ---
    const freshLv = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshLiveState"])();
    const lv = save.live ?? freshLv;
    if (typeof lv.cursor !== 'number' || lv.cursor < 0) lv.cursor = freshLv.cursor;
    if (typeof lv.voiceOn !== 'boolean') lv.voiceOn = freshLv.voiceOn;
    if (typeof lv.assocId !== 'string' && lv.assocId !== null) lv.assocId = null;
    if (!Array.isArray(lv.coSigned)) lv.coSigned = [];
    lv.coSigned = lv.coSigned.filter((c)=>typeof c === 'string').slice(-24);
    if (!Array.isArray(lv.circles)) lv.circles = [];
    lv.circles = lv.circles.filter((c)=>typeof c === 'string').slice(-12);
    if (!lv.stats || typeof lv.stats !== 'object') lv.stats = freshLv.stats;
    for (const k of [
        'chats',
        'emotes',
        'streamsWatched',
        'tradesDone'
    ]){
        if (typeof lv.stats[k] !== 'number' || lv.stats[k] < 0) lv.stats[k] = 0;
    }
    if (typeof lv.finesPaid !== 'number' || lv.finesPaid < 0) lv.finesPaid = 0;
    save.live = lv;
    // --- M18 city forge (missing on v17-and-older saves; partial data healed) ---
    const freshFg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$citypack$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshForgeState"])();
    const fg = save.forge ?? freshFg;
    if (!fg.votes || typeof fg.votes !== 'object' || !fg.votes.counts || typeof fg.votes.counts !== 'object') fg.votes = freshFg.votes;
    if (!Array.isArray(fg.votes.mine)) fg.votes.mine = [];
    fg.votes.mine = fg.votes.mine.filter((c)=>typeof c === 'string').slice(-3);
    for (const [k, n] of Object.entries(fg.votes.counts)){
        if (typeof n !== 'number' || n < 0) delete fg.votes.counts[k];
    }
    if (!Array.isArray(fg.ledger)) fg.ledger = [];
    fg.ledger = fg.ledger.filter((e)=>e && typeof e.city === 'string').slice(-20);
    if (typeof fg.ranLokoja !== 'boolean') fg.ranLokoja = false;
    save.forge = fg;
    // --- M19 story / patti / wardrobe (missing on v18-and-older saves) ---
    const freshSt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshStoryState"])();
    const st = save.story ?? freshSt;
    if (typeof st.chapter !== 'number' || st.chapter < 0 || st.chapter > 5) st.chapter = freshSt.chapter;
    if (typeof st.sandDays !== 'number' || st.sandDays < 0) st.sandDays = freshSt.sandDays;
    if (typeof st.lastSandDay !== 'number' || st.lastSandDay < 0) st.lastSandDay = freshSt.lastSandDay;
    if (typeof st.notePaid !== 'boolean') st.notePaid = freshSt.notePaid;
    if (typeof st.feverPaid !== 'boolean') st.feverPaid = freshSt.feverPaid;
    if (typeof st.sponsoredDays !== 'number' || st.sponsoredDays < 0) st.sponsoredDays = freshSt.sponsoredDays;
    if (typeof st.lastSponsorDay !== 'number' || st.lastSponsorDay < 0) st.lastSponsorDay = freshSt.lastSponsorDay;
    if (typeof st.doctorDay !== 'number' || st.doctorDay < 0) st.doctorDay = freshSt.doctorDay;
    save.story = st;
    const freshPt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshPattiState"])();
    const pt = save.patti ?? freshPt;
    if (!pt.found || typeof pt.found !== 'object') pt.found = freshPt.found;
    for (const [k, n] of Object.entries(pt.found)){
        if (typeof n !== 'number' || n < 0) delete pt.found[k];
    }
    save.patti = pt;
    const freshWd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshWardrobeState"])();
    const wd = save.wardrobe ?? freshWd;
    if (!Array.isArray(wd.ownedStyles)) wd.ownedStyles = freshWd.ownedStyles;
    if (!Array.isArray(wd.ownedWalks)) wd.ownedWalks = freshWd.ownedWalks;
    wd.ownedStyles = wd.ownedStyles.filter((k)=>typeof k === 'string');
    wd.ownedWalks = wd.ownedWalks.filter((k)=>typeof k === 'string');
    if (typeof wd.activeWalk !== 'string' || !wd.ownedWalks.includes(wd.activeWalk)) {
        wd.activeWalk = wd.ownedWalks.includes('street') || wd.ownedWalks.length === 0 ? 'street' : wd.ownedWalks[0];
    }
    save.wardrobe = wd;
    // --- M20 nation slice (missing on v19-and-older saves) ---
    if (!save.nation) {
        save.nation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshNationState"])();
    } else {
        const fresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$nation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshNationState"])();
        const crowd = save.nation.crowd;
        save.nation = {
            crowd: {
                seed: typeof crowd?.seed === 'number' && Number.isFinite(crowd.seed) ? crowd.seed : fresh.crowd.seed,
                count: typeof crowd?.count === 'number' && crowd.count > 0 && crowd.count <= 50_000 ? Math.floor(crowd.count) : fresh.crowd.count,
                on: typeof crowd?.on === 'boolean' ? crowd.on : fresh.crowd.on
            },
            inflation: Array.isArray(save.nation.inflation) ? save.nation.inflation.filter((r)=>r && typeof r.day === 'number' && typeof r.mult === 'number').slice(-12) : [],
            moderation: Array.isArray(save.nation.moderation) ? save.nation.moderation.filter((r)=>r && typeof r.day === 'number' && typeof r.why === 'string' && typeof r.band === 'string').slice(-40) : [],
            telemetryOptIn: save.nation.telemetryOptIn === true
        };
    }
    // --- M2 civic mesh (missing on v3-and-older saves) ---
    if (!save.civic) {
        save.civic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshCivicState"])();
    } else {
        // defensive merge — a partially-written civic slice still loads
        const fresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$civic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["freshCivicState"])();
        save.civic = {
            nepa: {
                ...fresh.nepa,
                ...save.civic.nepa
            },
            kgirs: {
                ...fresh.kgirs,
                ...save.civic.kgirs
            },
            police: {
                ...fresh.police,
                ...save.civic.police
            },
            efcc: {
                ...fresh.efcc,
                ...save.civic.efcc,
                pending: save.civic.efcc?.pending ?? []
            },
            market: {
                ...fresh.market,
                ...save.civic.market
            }
        };
    }
    // --- F1 HARDENING — the scalar sanitization pass ---
    // The heal blocks above fix MISSING objects only; crafted saves can ride
    // bad SCALARS straight into the engine (cash:-999999, cash:null,
    // day:"5" → "51" after +1, cash:1e308, Infinity → totalEarned:null).
    // Every successful load passes this law: money is a finite non-negative
    // whole naira, the day a finite integer ≥ 1, needs sit in [0,100], life
    // counters are finite. Valid saves already satisfy every rule here and
    // pass through byte-identical (verified by round-trip in the F1 battery).
    // PH2.5 (Bravo25): the heal also caps the CEILING — a hand-edited save
    // with cash:1e308 is finite and passed the floor-only law. Load-side
    // ceiling = ₦1bn, the same ceiling the cloud-push law enforces.
    p.cash = typeof p.cash === 'number' && Number.isFinite(p.cash) ? Math.min(1_000_000_000, Math.max(0, Math.floor(p.cash))) : 0;
    if (typeof p.bankBalance === 'number' && Number.isFinite(p.bankBalance)) {
        p.bankBalance = Math.min(1_000_000_000, Math.max(0, Math.floor(p.bankBalance)));
    }
    if (save.world) {
        const d = Number(save.world.day);
        save.world.day = Number.isFinite(d) ? Math.max(1, Math.floor(d)) : 1;
    }
    if (p.needs && typeof p.needs === 'object') {
        for (const k of [
            'health',
            'energy',
            'hunger',
            'mood'
        ]){
            const v = p.needs[k];
            // a non-finite need loads at the fresh-game value — a corrupt save
            // must never boot its player starving, exhausted or dead
            p.needs[k] = typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 100;
        }
    }
    if (p.stats && typeof p.stats === 'object') {
        for (const k of [
            'jobsCompleted',
            'hustlesCompleted',
            'totalEarned',
            'totalSpent'
        ]){
            const v = p.stats[k];
            p.stats[k] = typeof v === 'number' && Number.isFinite(v) ? v : 0;
        }
    }
    save.version = SAVE_VERSION;
    return save;
}
let lastTransportVerdict = 'none';
let lastWriteVerdict = 'failed';
const SaveSystem = {
    SAVE_KEY,
    SAVE_VERSION,
    SHADOW_KEY,
    /** TEST HOOK — pin the device key (deterministic signing in the suite). */ setFortKey (key) {
        setFortKey(key);
    },
    /** The device fortress key (tests + the UI honesty row may read it). */ fortKey () {
        return fortKey();
    },
    /** Does a local save exist? */ hasSave () {
        if (!storageAvailable()) return false;
        return window.localStorage.getItem(SAVE_KEY) !== null;
    },
    /**
   * THE LOAD PLAN — primary → shadow → backup → fresh. The primary wins
   * when it parses AND verifies; a tampered/torn primary falls to the
   * shadow, then the M9 backup slot, then fresh. The last verdict lands
   * in lastTransportVerdict for the boot toast.
   */ load () {
        if (!storageAvailable()) return null;
        // 1) the primary
        const primaryRaw = window.localStorage.getItem(SAVE_KEY);
        if (primaryRaw) {
            const { save, verdict } = unwrapEnvelope(primaryRaw);
            if (save) {
                const healed = deserialize(primaryRaw);
                if (healed) {
                    lastTransportVerdict = verdict === 'legacy' ? 'legacy' : verdict === 'missing-key' ? 'missing-key' : 'ok';
                    return healed;
                }
            }
        }
        // 2) the shadow (the previous primary — a torn/tampered write's twin)
        const shadowRaw = window.localStorage.getItem(SHADOW_KEY);
        if (shadowRaw) {
            const { save: shadowSave } = unwrapEnvelope(shadowRaw);
            if (shadowSave) {
                const healed = deserialize(shadowRaw);
                if (healed) {
                    lastTransportVerdict = 'recovered-shadow';
                    // heal forward: drop the broken primary FIRST (never demote tampered
                    // bytes into the shadow slot), then re-seal the honest save
                    window.localStorage.removeItem(SAVE_KEY);
                    this.write(healed, {
                        force: true
                    });
                    return healed;
                }
            }
        }
        // 3) the M9 backup slot (the guest loop's never-lose-progress copy)
        try {
            const backupRaw = window.localStorage.getItem('lokoja-life:backup');
            if (backupRaw) {
                const parsed = JSON.parse(backupRaw);
                if (parsed && parsed.player) {
                    const healed = deserialize(JSON.stringify(parsed));
                    if (healed) {
                        lastTransportVerdict = 'recovered-backup';
                        window.localStorage.removeItem(SAVE_KEY);
                        window.localStorage.removeItem(SHADOW_KEY);
                        this.write(healed, {
                            force: true
                        });
                        return healed;
                    }
                }
            }
        } catch  {
        /* the backup slot is corrupt — the descent continues */ }
        lastTransportVerdict = 'fresh';
        return null;
    },
    /**
   * THE WRITE PLAN — the shadow receives the CURRENT primary BEFORE the
   * primary is overwritten (double-buffer), then the new payload lands
   * signed. Torn writes leave the shadow holding the last good save.
   *
   * M15 — THE DELTA LAW: if the serialized payload is byte-identical to
   * the last write AND the primary on disk is intact, the write SKIPS —
   * no re-sign, no shadow churn, zero bytes. A debounced autosave that
   * fires on an idle city no longer grinds the disk. Recovery writes
   * (the load descent) pass { force: true } — a broken primary must be
   * overwritten even when the honest payload hashes the same as the
   * last write (the broken bytes never wrote the hash themselves).
   */ write (save, opts) {
        if (!storageAvailable()) {
            lastWriteVerdict = 'failed';
            return false;
        }
        try {
            const dataStr = serialize(save);
            const fingerprint = stateFingerprint(save);
            const primaryRaw = window.localStorage.getItem(SAVE_KEY);
            // THE SKIP LAW is strict: the skip is only safe when the recovery
            // ladder keeps ALL its rungs — the primary intact, the fingerprint
            // matching, AND the shadow already holding a twin. A first write
            // (no shadow yet) always lands for real, so the descent always
            // has somewhere honest to fall.
            if (!opts?.force && primaryRaw !== null && window.localStorage.getItem(SHADOW_KEY) !== null && window.localStorage.getItem(DELTA_HASH_KEY) === fingerprint) {
                // the bytes on disk ARE this payload — verify the envelope still
                // stands (a tampered primary must never ride a delta skip)
                const { save: intact } = unwrapEnvelope(primaryRaw);
                if (intact) {
                    lastWriteVerdict = 'skip';
                    return true;
                }
            }
            // 1) double-buffer: copy the current primary into the shadow
            if (primaryRaw !== null) {
                window.localStorage.setItem(SHADOW_KEY, primaryRaw);
            }
            // 2) serialize + sign + write the primary
            window.localStorage.setItem(SAVE_KEY, wrapEnvelope(dataStr));
            window.localStorage.setItem(DELTA_HASH_KEY, fingerprint);
            lastWriteVerdict = 'wrote';
            return true;
        } catch  {
            lastWriteVerdict = 'failed';
            return false;
        }
    },
    /** The last write verdict ('wrote' | 'skip' | 'failed') — the delta law's honesty line. */ writeVerdict () {
        return lastWriteVerdict;
    },
    /** M15 — the hash of the last payload that hit disk (the delta book). */ lastWriteHash () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(DELTA_HASH_KEY);
    },
    /** M15 — the hash of the last payload the cloud accepted (zero-byte push law). */ lastPushedHash () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(PUSHED_HASH_KEY);
    },
    /** M15 — record the pushed fingerprint after a successful vault write. */ markPushed (save) {
        if (!storageAvailable()) return;
        try {
            window.localStorage.setItem(PUSHED_HASH_KEY, stateFingerprint(save));
        } catch  {}
    },
    /** M15 — the state fingerprint of a save (the delta book's own law). */ fingerprintOf (save) {
        return stateFingerprint(save);
    },
    /** M20 — the exact string the vault last accepted (the delta's base; null on a fresh device). */ lastPushedEnv () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(LAST_PUSHED_ENV_KEY);
    },
    /** M20 — record the accepted string after a successful vault write. */ markPushedEnv (env) {
        if (!storageAvailable()) return;
        try {
            window.localStorage.setItem(LAST_PUSHED_ENV_KEY, env);
        } catch  {}
    },
    /** M20 — sign an exact envelope string with the device key (the delta path's sig). */ sigForString (envStr) {
        const key = fortKey();
        return key ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fortress$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["signPayload"])(envStr, key) : '';
    },
    /** Remove the save (used by "Start Over"). */ clear () {
        if (!storageAvailable()) return;
        window.localStorage.removeItem(SAVE_KEY);
        window.localStorage.removeItem(SHADOW_KEY);
        window.localStorage.removeItem(DELTA_HASH_KEY);
        window.localStorage.removeItem(PUSHED_HASH_KEY);
        window.localStorage.removeItem(LAST_PUSHED_ENV_KEY);
    },
    /** The raw signed envelope of the primary (the cloud push carries it whole). */ readEnvelope () {
        if (!storageAvailable()) return null;
        return window.localStorage.getItem(SAVE_KEY);
    },
    /** The last transport verdict (the boot toast + the honesty row). */ transportVerdict () {
        return lastTransportVerdict;
    },
    /**
   * M7 — patch ONLY the settings slice of an existing save (or seed it if
   * a save exists but the game isn't live). This is how a graphics pick
   * made on the MAIN MENU (before any game runs, so the debounced
   * autosave is dormant) still reaches disk. No save = nothing to patch.
   */ patchSettings (settings) {
        if (!storageAvailable()) return false;
        const save = this.load();
        if (!save) return false;
        return this.write({
            ...save,
            settings
        });
    },
    /**
   * Shape a save for future cloud upload (Supabase row).
   * Kept as a pure function so the online migration is a transport swap.
   */ toCloudPayload (save) {
        return {
            schema_version: save.version,
            data: save,
            updated_at: new Date(save.updatedAt).toISOString()
        };
    }
};
}),
"[project]/src/lib/rate-limit.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LOKOJA LIFE — PH2.5 THE THROTTLE LAW (src/lib/rate-limit.ts)
 * ============================================================
 * The brute-force wall for the trust doors: login, tier, the wallet PIN
 * lane, and the cloud vault's read/write doors. Two mechanisms:
 *
 *  1. THE FIXED WINDOW (takeToken) — a hard ceiling on requests per key
 *     per window (`Map<key, { count, resetAt }>`). Used for volume doors
 *     (tier probes, cloud push/pull floods) where even HONEST traffic
 *     must not exceed the cap.
 *  2. THE FAILURE LOCKOUT (recordFailure / isLockedOut) — a failure
 *     counter per key per window with EXPONENTIAL BACKOFF: once
 *     `maxFails` failures are recorded inside the window, the key is
 *     locked for `baseLockMs * 2^(fails - maxFails)` (capped at
 *     `maxLockMs`). Every lockout expiry that meets a fresh failure
 *     doubles the next lock. Used for credential doors (login, PIN)
 *     where only FAILURES count — a correct password/PIN clears the
 *     book (clearFailures).
 *
 * THE KEY LAW: keys are built as `${kind}:${part}|${part}` via rlKey().
 * Identity parts come from the request itself — the handle (when the
 * caller declares one) AND the IP (x-forwarded-for's first hop, then
 * x-real-ip, else 'local'). Both parts are throttled TOGETHER: a
 * botnet of one handle from many IPs still trips the handle half; one
 * IP hammering many handles still trips the IP half (for per-IP doors
 * like tier, pass only the IP).
 *
 * SCOPE LAW — SINGLE INSTANCE: every bucket lives in THIS process's
 * memory. Behind one Next.js server (the deployment shape of this
 * project) the limits below are exact. Behind N instances the wall is
 * N× softer (each process counts its own map) — a shared store (Redis)
 * is the upgrade path, deliberately not built here: no new dependency
 * on a hot path that must never fail closed for honest players.
 *
 * FAIL-SAFE LAW: every map is bounded (MAX_KEYS) and prunes expired
 * entries opportunistically — a flood cannot OOM the relay.
 */ /** Production constants — the doors pass these; the unit probe passes
 *  its own tiny windows so the backoff math is verified in milliseconds. */ __turbopack_context__.s([
    "RL_LIMITS",
    ()=>RL_LIMITS,
    "__lockState",
    ()=>__lockState,
    "clearFailures",
    ()=>clearFailures,
    "ipOf",
    ()=>ipOf,
    "isLockedOut",
    ()=>isLockedOut,
    "recordFailure",
    ()=>recordFailure,
    "rlKey",
    ()=>rlKey,
    "takeToken",
    ()=>takeToken
]);
const RL_LIMITS = {
    /** auth/login — ≤5 failure RESPONSES / 15min per handle+IP (4 recorded
   *  failures arm the lock; the 5th bad attempt is refused, so at most 5
   *  failure responses ever leave the door per window). */ LOGIN_FAIL_WINDOW_MS: 15 * 60_000,
    LOGIN_MAX_FAILS: 4,
    LOGIN_BASE_LOCK_MS: 30_000,
    LOGIN_MAX_LOCK_MS: 15 * 60_000,
    /** auth/tier — ≤10/min/IP (a probe door, not a credential door). */ TIER_WINDOW_MS: 60_000,
    TIER_MAX_PER_WINDOW: 10,
    /** wallet PIN inside /api/live/action — ≤5 failure RESPONSES / 15min
   *  per handle (same 4-recorded-failures arm as login). */ PIN_FAIL_WINDOW_MS: 15 * 60_000,
    PIN_MAX_FAILS: 4,
    PIN_BASE_LOCK_MS: 30_000,
    PIN_MAX_LOCK_MS: 15 * 60_000,
    /** cloud/push — ≤30 writes/hour/account. */ PUSH_WINDOW_MS: 3_600_000,
    PUSH_MAX_PER_WINDOW: 30,
    /** cloud/pull — ≤60 reads/hour/account. */ PULL_WINDOW_MS: 3_600_000,
    PULL_MAX_PER_WINDOW: 60,
    /** auth/register — row-growth guard, generous for one household. */ REGISTER_WINDOW_MS: 15 * 60_000,
    REGISTER_MAX_PER_WINDOW: 10
};
const windows = new Map();
const locks = new Map();
const MAX_KEYS = 10_000;
function ipOf(req) {
    const xf = req.headers.get('x-forwarded-for');
    if (xf) {
        const first = xf.split(',')[0]?.trim();
        if (first) return first;
    }
    return req.headers.get('x-real-ip')?.trim() || 'local';
}
function rlKey(kind, parts) {
    return `${kind}:${parts.map((p)=>p && p.length > 0 ? p : '-').join('|')}`;
}
function pruneExpired(now) {
    for (const [k, w] of windows)if (now >= w.resetAt) windows.delete(k);
    for (const [k, s] of locks){
        // a lock that expired AND whose failure window is a day cold can never re-arm
        if (s.lockedUntil <= now && now - s.windowStart > 24 * 3_600_000) locks.delete(k);
    }
}
function takeToken(key, limit, windowMs) {
    const now = Date.now();
    let w = windows.get(key);
    if (!w || now >= w.resetAt) {
        w = {
            count: 0,
            resetAt: now + windowMs
        };
        windows.set(key, w);
        if (windows.size > MAX_KEYS) pruneExpired(now);
    }
    w.count++;
    if (w.count > limit) return {
        ok: false,
        retryAfterSec: Math.max(1, Math.ceil((w.resetAt - now) / 1000))
    };
    return {
        ok: true,
        retryAfterSec: 0
    };
}
function isLockedOut(key) {
    const now = Date.now();
    const s = locks.get(key);
    if (!s) return {
        locked: false,
        retryAfterSec: 0,
        fails: 0
    };
    if (s.lockedUntil > now) {
        return {
            locked: true,
            retryAfterSec: Math.max(1, Math.ceil((s.lockedUntil - now) / 1000)),
            fails: s.fails
        };
    }
    return {
        locked: false,
        retryAfterSec: 0,
        fails: s.fails
    };
}
function recordFailure(key, opts) {
    const now = Date.now();
    let s = locks.get(key);
    if (!s || now - s.windowStart >= opts.windowMs) {
        s = {
            fails: 0,
            windowStart: now,
            lockedUntil: 0
        };
        locks.set(key, s);
        if (locks.size > MAX_KEYS) pruneExpired(now);
    }
    s.fails++;
    if (s.fails >= opts.maxFails) {
        const over = s.fails - opts.maxFails;
        const lock = Math.min(opts.baseLockMs * 2 ** over, opts.maxLockMs);
        if (now + lock > s.lockedUntil) s.lockedUntil = now + lock;
    }
    return isLockedOut(key);
}
function clearFailures(key) {
    locks.delete(key);
}
function __lockState(key) {
    const s = locks.get(key);
    return {
        lockedUntil: s?.lockedUntil ?? 0,
        fails: s?.fails ?? 0
    };
}
}),
"[project]/src/app/api/cloud/push/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
/**
 * LOKOJA LIFE — M9 Guest Loop: /api/cloud/push
 * The cloud vault's write door. Bearer-token gated; the whole GameSave
 * JSON rides in the body exactly as the localStorage transport carries it.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$binarydelta$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/binarydelta.ts [app-route] (ecmascript)");
// F1 HARDENING — the version ceiling is single-sourced with the save system:
// a future SAVE_VERSION bump lifts the vault's ceiling automatically. save.ts
// imports cleanly server-side (pure constants/factories, no DOM at module
// scope — verified by import probe).
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/save.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rate-limit.ts [app-route] (ecmascript)");
;
;
;
;
;
/**
 * F1 HARDENING — the whole-envelope ceiling. The vault row is an unbounded
 * String column; a hostile client must not park megabytes in it. Honest
 * saves ride far under this (the M20 delta door exists because whole
 * envelopes are big). Rejections use the route's existing error shape
 * `{ ok: false, why }` with a 400, before any DB write.
 */ const MAX_SAVE_BYTES = 512_000;
/** PH2.5 COMPLETION (Task 5-b) — THE SANITY CEILING: finite-and-nonnegative
 *  is not enough — the mandate probe proved {player:{cash:1e308}} pushes ok
 *  (a quadrillion-naira vault row, minted onto any device that pulls it).
 *  Honest play sits orders of magnitude below these ceilings: the ledger's
 *  own laws cap a single move at ₦50k and a day at ₦200k, so ₦1bn of cash
 *  and a 100-year-old day counter cannot be an honest save. Both write
 *  paths (whole envelope AND delta rebuild) run the same law. */ const MAX_SAVE_CASH = 1_000_000_000;
const MAX_SAVE_DAY = 36_500;
/** the minimal scalar law, shared by the whole-envelope and delta paths */ function saveScalarsOk(s) {
    return !!s.player && typeof s.player === 'object' && typeof s.player.cash === 'number' && Number.isFinite(s.player.cash) && s.player.cash >= 0 && s.player.cash <= MAX_SAVE_CASH && !!s.world && typeof s.world === 'object' && typeof s.world.day === 'number' && Number.isFinite(s.world.day) && s.world.day >= 1 && s.world.day <= MAX_SAVE_DAY && typeof s.version === 'number' && s.version <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$save$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SAVE_VERSION"];
}
async function POST(req) {
    try {
        const auth = req.headers.get('authorization') ?? '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
        if (!token) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            why: 'no token'
        }, {
            status: 401
        });
        const account = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].account.findFirst({
            where: {
                token
            }
        });
        if (!account) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            why: 'bad token'
        }, {
            status: 401
        });
        // PH2.5 THE THROTTLE LAW — ≤30 vault writes/hour/account (fixed
        // window). The client's honest autosave is minutes-apart deltas; a
        // flood is abuse no matter how small each payload is. Volume counts
        // whether the write lands or not — the bucket fills on every
        // authenticated attempt.
        const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["takeToken"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["rlKey"])('push', [
            account.id
        ]), __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RL_LIMITS"].PUSH_MAX_PER_WINDOW, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rate$2d$limit$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RL_LIMITS"].PUSH_WINDOW_MS);
        if (!gate.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                why: 'too-many-pushes'
            }, {
                status: 429,
                headers: {
                    'Retry-After': String(gate.retryAfterSec)
                }
            });
        }
        const body = await req.json();
        // M20 — THE DELTA DOOR: a patch carries the CHANGE against the exact
        // string this vault already stores. The base mismatch (another device
        // wrote since), a torn codec, or a wrong shape is refused honestly —
        // the client falls back to the whole envelope. The stored row stays a
        // WHOLE envelope either way: the vault never learns a new format.
        if (typeof body?.patch === 'string' && body.patch.length > 0 && (!body?.data || typeof body.data !== 'object')) {
            // PH2.5 — the patch itself is bounded too: a delta bigger than a
            // whole envelope is nonsense and a CPU/parse hazard before anything
            // is applied.
            if (body.patch.length > MAX_SAVE_BYTES) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ok: false,
                    why: 'patch too large'
                }, {
                    status: 400
                });
            }
            const row = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].cloudSave.findUnique({
                where: {
                    accountId: account.id
                }
            });
            if (!row) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                why: 'no base — send whole'
            }, {
                status: 400
            });
            let next;
            try {
                next = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$binarydelta$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["applyDelta"])(row.data, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$binarydelta$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["patchFromBase64"])(body.patch));
                const parsed = JSON.parse(next);
                if (!parsed || typeof parsed !== 'object' || !('player' in parsed) || !('version' in parsed)) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        ok: false,
                        why: 'patch refused — wrong shape'
                    }, {
                        status: 400
                    });
                }
                // PH2.5 COMPLETION (Task 5-b) — the REBUILT envelope obeys the same
                // scalar law as the whole-envelope door (the delta path was the
                // second way to park a hostile cash:1e308 row in the vault).
                if (!saveScalarsOk(JSON.parse(next))) {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        ok: false,
                        why: 'patch refused — bad payload'
                    }, {
                        status: 400
                    });
                }
            } catch  {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ok: false,
                    why: 'patch refused — send whole'
                }, {
                    status: 400
                });
            }
            // PH2.5 — THE DELTA CEILING: the rebuilt WHOLE envelope obeys the
            // same MAX_SAVE_BYTES the whole-envelope path enforces (the old
            // delta door was the one write that could park an oversized row).
            if (next.length > MAX_SAVE_BYTES) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    ok: false,
                    why: 'payload too large'
                }, {
                    status: 400
                });
            }
            const version = typeof JSON.parse(next).version === 'number' ? JSON.parse(next).version : typeof body.schema_version === 'number' ? body.schema_version : 10;
            // the delta path's sig is computed by the client over the EXACT rebuilt string
            const deltaSig = typeof body.sig === 'string' && body.sig.length > 0 ? body.sig : null;
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].cloudSave.upsert({
                where: {
                    accountId: account.id
                },
                create: {
                    accountId: account.id,
                    data: next,
                    version,
                    sig: deltaSig
                },
                update: {
                    data: next,
                    version,
                    sig: deltaSig
                }
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: true,
                delta: true
            });
        }
        if (!body?.data || typeof body.data !== 'object') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                why: 'bad payload'
            }, {
                status: 400
            });
        }
        const data = JSON.stringify(body.data);
        // F1 HARDENING — size cap before any DB write (see MAX_SAVE_BYTES).
        if (data.length > MAX_SAVE_BYTES) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                why: 'payload too large'
            }, {
                status: 400
            });
        }
        // F1 HARDENING — the minimal save law: deserialize heals what it LOADS,
        // but the vault must not STORE what no honest client could write
        // (missing player/world, cash:-999999 or "5000", day:"5", a version
        // ahead of every migration this server knows — and PH2.5's ceiling: a
        // finite cash:1e308 / day:1e308 is refused too). Rejected before the
        // upsert, in this route's existing error shape.
        const save = body.data;
        if (!saveScalarsOk(save)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ok: false,
                why: 'bad payload'
            }, {
                status: 400
            });
        }
        const version = typeof body.schema_version === 'number' ? body.schema_version : 10;
        // M14 — the client's HMAC rides beside the save (tamper-evidence for the pull)
        const sig = typeof body.sig === 'string' && body.sig.length > 0 ? body.sig : null;
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].cloudSave.upsert({
            where: {
                accountId: account.id
            },
            create: {
                accountId: account.id,
                data,
                version,
                sig
            },
            update: {
                data,
                version,
                sig
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            why: 'vault no gree'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__de8efc23._.js.map