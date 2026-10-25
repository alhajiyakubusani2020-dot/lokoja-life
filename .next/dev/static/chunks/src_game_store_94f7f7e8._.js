(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
]);

//# sourceMappingURL=src_game_store_94f7f7e8._.js.map