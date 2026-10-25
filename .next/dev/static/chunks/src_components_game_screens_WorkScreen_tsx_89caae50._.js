(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/game/screens/WorkScreen.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkScreen",
    ()=>WorkScreen
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — WorkScreen (Stage 3, R1 presentation pass)
 * --------------------------------------------------------
 * Jobs + hustles + earnings. The UI reads every number from the systems
 * (work.ts / opportunities.ts / economy.ts) — nothing is hard-coded.
 *
 * R1 changes are presentation-only: SVG icon language instead of emoji
 * art, initials-based NPC discs, clearer card hierarchy and status states,
 * animated working overlay. Every store action and guard is untouched.
 *
 * Structure:
 *   1. Active offers   — accepted hustles waiting at real locations
 *   2. Hustle board    — search the current area for personal gist
 *   3. Jobs here       — formal shifts available at the current location
 *   4. Jobs elsewhere  — honest pointers that deep-link to the map
 *   5. Earnings        — today's flow + the recent ledger
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/work.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/opportunities.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/world.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/skills.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/economy.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/jobs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
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
;
;
;
;
/* ------------------------------- helpers -------------------------------- */ /** Tinted initials disc — replaces the old emoji NPC avatar. */ const NPC_TINTS = [
    'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]',
    'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]',
    'bg-[var(--lko-river-soft)] text-[var(--lko-river)]',
    'bg-orange-50 text-[var(--lko-terra)]'
];
function NpcDisc({ name, size = 36 }) {
    const tint = NPC_TINTS[(name.length + name.charCodeAt(0)) % NPC_TINTS.length];
    const initials = name.split(/\s+/).slice(0, 2).map((w)=>w[0]?.toUpperCase() ?? '').join('');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `lko-display flex shrink-0 items-center justify-center rounded-full ${tint}`,
        style: {
            width: size,
            height: size,
            fontSize: size * 0.36
        },
        "aria-hidden": true,
        children: initials || '?'
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c = NpcDisc;
/** One-line reward preview for a hustle def: ₦range • skill • rep. */ function rewardPreview(def) {
    const parts = [
        `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(def.reward.cashMin)}–${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(def.reward.cashMax)}`,
        `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKILL_META"][def.skill].label} +${def.reward.skillXp} xp`,
        `★ +${def.reward.reputation}`
    ];
    return parts.join(' • ');
}
function SkillPill({ skillId }) {
    const meta = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$skills$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKILL_META"][skillId];
    if (!meta) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-2 py-0.5 text-[10px] font-bold text-[var(--lko-ink-soft)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SkillIcon"], {
                name: skillId,
                size: 10
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            meta.label
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
_c1 = SkillPill;
/** Shared section heading with the icon language. */ function SectionTitle({ icon, children, hint }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-2 flex items-baseline justify-between gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[var(--lko-gold-deep)]",
                        "aria-hidden": true,
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "lko-num text-[11px] font-bold text-[var(--lko-ink-soft)]",
                children: hint
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 111,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_c2 = SectionTitle;
/* ---------------------------- opportunity card --------------------------- */ function OfferCard({ instance, isHere, onDo, onDrop, onGo }) {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "OfferCard.useGameStore[player]": (s)=>s.player
    }["OfferCard.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "OfferCard.useGameStore[world]": (s)=>s.world
    }["OfferCard.useGameStore[world]"]);
    const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hustleDefFor"])(instance);
    if (!def) return null;
    const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][instance.npcId ?? ''];
    const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][instance.locationId];
    const abs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
    const slotsLeft = instance.expiresAtSlot - abs;
    const urgent = slotsLeft <= 2;
    const tooTired = player.needs.energy < def.energyCost;
    const odds = Math.round((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hustleSuccessChance"])(def, player) * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `lko-card p-4 ${urgent ? 'border-[var(--lko-terra)]/50' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NpcDisc, {
                        name: npc?.name ?? 'Someone'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-extrabold leading-tight",
                                children: npc?.name ?? 'Someone'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "flex items-center gap-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                        id: instance.locationId,
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this),
                                    loc?.name ?? 'Somewhere',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-black/25",
                                        children: "•"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 154,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                        size: 11,
                                        className: urgent ? 'text-[var(--lko-terra)]' : ''
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 155,
                                        columnNumber: 13
                                    }, this),
                                    urgent ? 'going cold soon!' : `${slotsLeft} slot${slotsLeft === 1 ? '' : 's'} left`
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex shrink-0 items-center gap-1 rounded-full bg-[var(--lko-green-soft)] px-2 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TargetIcon"], {
                                size: 11
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            odds,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2.5 rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-[13px] italic leading-relaxed text-[var(--lko-ink)]",
                children: [
                    "“",
                    def.message,
                    "”"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-[var(--lko-ink-soft)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[var(--lko-gold-deep)]",
                        children: [
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(def.reward.cashMin),
                            "–",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(def.reward.cashMax)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkillPill, {
                        skillId: def.skill
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-0.5 rounded-full bg-black/[0.05] px-2 py-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyIcon"], {
                                size: 10
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            "−",
                            def.energyCost
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    def.timeSlots > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-flex items-center gap-0.5 rounded-full bg-black/[0.05] px-2 py-0.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                size: 10
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            def.timeSlots,
                            " slot",
                            def.timeSlots > 1 ? 's' : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 grid grid-cols-2 gap-2",
                children: [
                    isHere ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onDo,
                        disabled: tooTired,
                        className: `lko-press flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-extrabold ${tooTired ? 'cursor-not-allowed bg-black/10 text-white/70' : 'bg-[var(--lko-green)] text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]'}`,
                        children: tooTired ? 'Too tired' : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyIcon"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 204,
                                    columnNumber: 17
                                }, this),
                                "Do it"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onGo,
                        className: "lko-press flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-[var(--lko-gold)] px-2 py-2 text-sm font-extrabold text-[#3d2a00] shadow-[inset_0_-3px_0_rgba(0,0,0,0.14)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapIcon"], {
                                size: 15
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this),
                            "Take me there"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onDrop,
                        className: "lko-press min-h-[46px] rounded-xl border border-black/[0.08] bg-white px-2 py-2 text-sm font-bold text-[var(--lko-ink)]",
                        children: "Drop"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 189,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
_s(OfferCard, "d34gFTx3Ye/obb9uqKI3ET6uM2Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c3 = OfferCard;
/* ------------------------------ offer (fresh) ---------------------------- */ function FreshOfferCard({ instance, onAccept, onDecline }) {
    _s1();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "FreshOfferCard.useGameStore[player]": (s)=>s.player
    }["FreshOfferCard.useGameStore[player]"]);
    const def = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$opportunities$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hustleDefFor"])(instance);
    if (!def) return null;
    const npc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"][instance.npcId ?? ''];
    const handsFull = player.activeOpportunities.length >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxActive;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "lko-card lko-pop border-[var(--lko-gold)]/50 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NpcDisc, {
                        name: npc?.name ?? 'Someone'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-extrabold leading-tight",
                                children: npc?.name ?? 'Someone'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                children: def.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2.5 rounded-xl bg-[var(--lko-cream)] px-3 py-2 text-[13px] italic leading-relaxed",
                children: [
                    "“",
                    def.message,
                    "”"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "lko-num mt-2 text-[11px] font-bold text-[var(--lko-ink-soft)]",
                children: rewardPreview(def)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 258,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onAccept,
                        disabled: handsFull,
                        className: `lko-press flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-extrabold ${handsFull ? 'cursor-not-allowed bg-black/10 text-white/70' : 'bg-[var(--lko-green)] text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]'}`,
                        children: handsFull ? `Hands full (${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxActive})` : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CheckIcon"], {
                                    size: 15
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 273,
                                    columnNumber: 15
                                }, this),
                                "Accept"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onDecline,
                        className: "lko-press min-h-[46px] rounded-xl border border-black/[0.08] bg-white px-2 py-2 text-sm font-bold text-[var(--lko-ink)]",
                        children: "Not interested"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
}
_s1(FreshOfferCard, "s/oq14MuQ/VPs9CU9x24tBeJPrM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c4 = FreshOfferCard;
/* -------------------------------- job row -------------------------------- */ function JobRow({ job, onOpen }) {
    _s2();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "JobRow.useGameStore[player]": (s)=>s.player
    }["JobRow.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "JobRow.useGameStore[world]": (s)=>s.world
    }["JobRow.useGameStore[world]"]);
    const education = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "JobRow.useGameStore[education]": (s)=>s.education
    }["JobRow.useGameStore[education]"]);
    const abs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
    const req = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRequirements"])(player, job.requirements, {
        graduated: education.graduated && education.convocationAttended
    });
    const cd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, job.id, abs);
    const pay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateJobPay"])(job, player);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onOpen,
        className: `lko-press flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${req.ok ? 'border-black/[0.06] bg-white hover:border-[var(--lko-green)]/40' : 'border-black/[0.05] bg-black/[0.02]'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${req.ok ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)] opacity-70'}`,
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JobIcon"], {
                    id: job.id,
                    size: 20
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                    lineNumber: 315,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 309,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block truncate text-sm font-extrabold text-[var(--lko-ink)]",
                        children: job.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-0.5 flex items-center gap-1 truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                        children: req.ok ? cd > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                    size: 11
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 323,
                                    columnNumber: 17
                                }, this),
                                "Ready in ",
                                cd,
                                " slot",
                                cd > 1 ? 's' : ''
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyIcon"], {
                                    size: 11
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 328,
                                    columnNumber: 17
                                }, this),
                                "−",
                                job.energyCost,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-black/25",
                                    children: "•"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 329,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                    size: 11
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 330,
                                    columnNumber: 17
                                }, this),
                                job.timeSlots,
                                " slot",
                                job.timeSlots > 1 ? 's' : ''
                            ]
                        }, void 0, true) : req.reasons.join(' • ')
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 317,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "shrink-0 text-right",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "lko-num block text-sm font-extrabold text-[var(--lko-terra)]",
                        children: [
                            "~",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(pay)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkillPill, {
                        skillId: job.skillTraining.skill
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 341,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 301,
        columnNumber: 5
    }, this);
}
_s2(JobRow, "JVWKsw/6tIuJbwKXSMGhXyEamLA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c5 = JobRow;
/* ------------------------------- job sheet ------------------------------- */ function JobSheet({ job, onClose, onStart }) {
    _s3();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "JobSheet.useGameStore[player]": (s)=>s.player
    }["JobSheet.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "JobSheet.useGameStore[world]": (s)=>s.world
    }["JobSheet.useGameStore[world]"]);
    const education = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "JobSheet.useGameStore[education]": (s)=>s.education
    }["JobSheet.useGameStore[education]"]);
    const abs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
    const req = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkRequirements"])(player, job.requirements, {
        graduated: education.graduated && education.convocationAttended
    });
    const cd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, job.id, abs);
    const tooTired = player.needs.energy < job.energyCost;
    const pay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateJobPay"])(job, player);
    const moodNote = player.needs.mood >= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodBonusHigh.threshold ? 'Good vibes — better pay today' : player.needs.mood <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].moodPenaltyLow.threshold ? 'Low vibes — pay takes a small hit' : null;
    const blocked = !req.ok || cd > 0 || tooTired;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50",
        role: "dialog",
        "aria-label": `${job.name} details`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                "aria-label": "Close",
                onClick: onClose,
                className: "lko-scrim absolute inset-0 bg-black/45"
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 369,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-sheet absolute inset-x-0 bottom-0 mx-auto w-full max-w-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-t-3xl border-t border-black/[0.06] bg-[var(--lko-surface)] px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 shadow-[var(--lko-shadow-lg)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15",
                            "aria-hidden": true
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 372,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]",
                                    "aria-hidden": true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JobIcon"], {
                                        id: job.id,
                                        size: 28
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 376,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 375,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "lko-display text-lg leading-tight",
                                            children: job.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 379,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                                    id: job.locationId,
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                    lineNumber: 381,
                                                    columnNumber: 17
                                                }, this),
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][job.locationId]?.name
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 380,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 378,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-[13px] leading-relaxed text-[var(--lko-ink-soft)]",
                            children: job.description
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 386,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-3 grid grid-cols-2 gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl bg-[var(--lko-cream)] px-3 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                                            children: "Pay (est.)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 391,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "lko-display lko-num text-base text-[var(--lko-terra)]",
                                            children: [
                                                "~",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(pay)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 392,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 390,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl bg-[var(--lko-cream)] px-3 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                                            children: "Cost"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 395,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "lko-display flex items-center gap-1 text-base",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyIcon"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 17
                                                }, this),
                                                "−",
                                                job.energyCost
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 394,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl bg-[var(--lko-cream)] px-3 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                                            children: "Time"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 401,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "lko-display text-base",
                                            children: [
                                                job.timeSlots,
                                                " slot",
                                                job.timeSlots > 1 ? 's' : ''
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 402,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 400,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl bg-[var(--lko-cream)] px-3 py-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                                            children: "Trains"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 407,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "lko-display flex items-center gap-1 text-base",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SkillIcon"], {
                                                    name: job.skillTraining.skill,
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 17
                                                }, this),
                                                "+",
                                                job.skillTraining.xp
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 408,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 406,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 389,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lko-num mt-2 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                            children: [
                                "+",
                                job.xpReward,
                                " XP • ★ +",
                                job.reputationReward,
                                " reputation • cooldown:",
                                ' ',
                                job.cooldownSlots ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].defaultCooldownSlots,
                                " slot",
                                (job.cooldownSlots ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WORK"].defaultCooldownSlots) > 1 ? 's' : ''
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 415,
                            columnNumber: 11
                        }, this),
                        moodNote && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-[11px] font-bold text-[var(--lko-gold-deep)]",
                            children: moodNote
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 419,
                            columnNumber: 24
                        }, this),
                        !req.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkIcon"], {
                                    size: 13,
                                    className: "shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 424,
                                    columnNumber: 15
                                }, this),
                                req.reasons.join(' • ')
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 423,
                            columnNumber: 13
                        }, this),
                        req.ok && cd > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 flex items-center gap-1.5 rounded-xl bg-black/[0.04] px-3 py-2 text-xs font-bold text-[var(--lko-ink-soft)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                    size: 13,
                                    className: "shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 430,
                                    columnNumber: 15
                                }, this),
                                "You just worked this — ready in ",
                                cd,
                                " time slot",
                                cd > 1 ? 's' : '',
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 429,
                            columnNumber: 13
                        }, this),
                        req.ok && cd === 0 && tooTired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EnergyIcon"], {
                                    size: 13,
                                    className: "shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 436,
                                    columnNumber: 15
                                }, this),
                                "You need ",
                                job.energyCost,
                                " energy — rest first."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 435,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onStart,
                            disabled: blocked,
                            className: `lko-press mt-3 min-h-[50px] w-full rounded-xl py-3 text-sm font-extrabold ${blocked ? 'cursor-not-allowed bg-black/10 text-white/70' : 'bg-[var(--lko-green)] text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]'}`,
                            children: blocked ? 'Not available now' : `Start shift • earn ~${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(pay)}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 441,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "lko-press mt-2 min-h-[48px] w-full rounded-xl border border-black/[0.08] bg-white py-3 text-sm font-extrabold text-[var(--lko-ink)]",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 452,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                    lineNumber: 371,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 370,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 368,
        columnNumber: 5
    }, this);
}
_s3(JobSheet, "JVWKsw/6tIuJbwKXSMGhXyEamLA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c6 = JobSheet;
function WorkScreen({ onGoToMap }) {
    _s4();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[player]": (s)=>s.player
    }["WorkScreen.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[world]": (s)=>s.world
    }["WorkScreen.useGameStore[world]"]);
    const isWorking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[isWorking]": (s)=>s.isWorking
    }["WorkScreen.useGameStore[isWorking]"]);
    const workingLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[workingLabel]": (s)=>s.workingLabel
    }["WorkScreen.useGameStore[workingLabel]"]);
    const offers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[offers]": (s)=>s.offers
    }["WorkScreen.useGameStore[offers]"]);
    const searchHustles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[searchHustles]": (s)=>s.searchHustles
    }["WorkScreen.useGameStore[searchHustles]"]);
    const acceptOffer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[acceptOffer]": (s)=>s.acceptOffer
    }["WorkScreen.useGameStore[acceptOffer]"]);
    const declineOffer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[declineOffer]": (s)=>s.declineOffer
    }["WorkScreen.useGameStore[declineOffer]"]);
    const completeOpportunity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[completeOpportunity]": (s)=>s.completeOpportunity
    }["WorkScreen.useGameStore[completeOpportunity]"]);
    const dropOpportunity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[dropOpportunity]": (s)=>s.dropOpportunity
    }["WorkScreen.useGameStore[dropOpportunity]"]);
    const pruneExpired = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[pruneExpired]": (s)=>s.pruneExpired
    }["WorkScreen.useGameStore[pruneExpired]"]);
    const workShift = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorkScreen.useGameStore[workShift]": (s)=>s.workShift
    }["WorkScreen.useGameStore[workShift]"]);
    const [sheetJobId, setSheetJobId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const location = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][world.currentLocation];
    const abs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$world$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSlot"])(world.day, world.timeOfDay);
    const searchCd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$work$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cooldownRemaining"])(player.cooldowns, 'hustle-search', abs);
    // lazily expire cold offers whenever the work screen is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkScreen.useEffect": ()=>{
            pruneExpired();
        }
    }["WorkScreen.useEffect"], [
        world.day,
        world.timeOfDay,
        offers.length,
        pruneExpired
    ]);
    const jobsHere = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkScreen.useMemo[jobsHere]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOBS"].filter({
                "WorkScreen.useMemo[jobsHere]": (j)=>j.locationId === location.id
            }["WorkScreen.useMemo[jobsHere]"])
    }["WorkScreen.useMemo[jobsHere]"], [
        location.id
    ]);
    const jobsElsewhere = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkScreen.useMemo[jobsElsewhere]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOBS"].filter({
                "WorkScreen.useMemo[jobsElsewhere]": (j)=>j.locationId !== location.id
            }["WorkScreen.useMemo[jobsElsewhere]"])
    }["WorkScreen.useMemo[jobsElsewhere]"], [
        location.id
    ]);
    const todayTxs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transactionsOnDay"])(player.transactions, world.day);
    const todayEarned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sumEarned"])(todayTxs);
    const todaySpent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$economy$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sumSpent"])(todayTxs);
    const sheetJob = sheetJobId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOBS"].find((j)=>j.id === sheetJobId) ?? null : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 pt-3 sm:px-6",
        children: [
            isWorking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-scrim fixed inset-0 z-40 flex items-center justify-center bg-[var(--lko-cream)]/70 backdrop-blur-[2px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/95 px-5 py-3.5 shadow-[var(--lko-shadow-lg)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "relative flex h-9 w-9 items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "absolute inset-0 animate-ping rounded-full bg-[var(--lko-gold)]/25",
                                    "aria-hidden": true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 507,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkIcon"], {
                                    size: 20,
                                    className: "relative text-[var(--lko-gold-deep)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                    lineNumber: 508,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 506,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm font-extrabold text-[var(--lko-ink)]",
                            children: [
                                "Working",
                                workingLabel ? ` — ${workingLabel}` : '',
                                "…"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 510,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                    lineNumber: 505,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 504,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-card mb-3 flex items-center gap-3 px-4 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]",
                        "aria-hidden": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkIcon"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 520,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 519,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0 flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--lko-ink-soft)]",
                                children: "Work • you dey here"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display flex items-center gap-1.5 truncate text-base",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                        id: location.id,
                                        size: 16,
                                        className: "shrink-0 text-[var(--lko-terra)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 527,
                                        columnNumber: 13
                                    }, this),
                                    location.name
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 526,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 522,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex shrink-0 items-center gap-1 rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[11px] font-bold text-[var(--lko-gold-deep)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 532,
                                columnNumber: 11
                            }, this),
                            "Slot ",
                            abs % 4 + 1,
                            "/4"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 531,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 518,
                columnNumber: 7
            }, this),
            player.activeOpportunities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-label": "Active offers",
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 541,
                            columnNumber: 19
                        }, void 0),
                        hint: `${player.activeOpportunities.length}/${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HUSTLE"].maxActive}`,
                        children: "Your accepted hustles"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 540,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2.5",
                        children: player.activeOpportunities.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OfferCard, {
                                instance: o,
                                isHere: o.locationId === world.currentLocation,
                                onDo: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    completeOpportunity(o.instanceId);
                                },
                                onDrop: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    dropOpportunity(o.instanceId);
                                },
                                onGo: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    onGoToMap(o.locationId);
                                }
                            }, o.instanceId, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 548,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 546,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 539,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-label": "Hustle board",
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 572,
                            columnNumber: 29
                        }, void 0),
                        children: "Hustle board — hear the gist"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 572,
                        columnNumber: 9
                    }, this),
                    offers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2.5 flex flex-col gap-2.5",
                        children: offers.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FreshOfferCard, {
                                instance: o,
                                onAccept: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    acceptOffer(o.instanceId);
                                },
                                onDecline: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    declineOffer(o.instanceId);
                                }
                            }, o.instanceId, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 577,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 575,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                            searchHustles();
                        },
                        disabled: searchCd > 0 || isWorking,
                        className: `lko-press w-full rounded-xl px-2 py-3 text-sm font-extrabold ${searchCd > 0 || isWorking ? 'cursor-not-allowed bg-black/10 text-white/70' : 'bg-[var(--lko-gold)] text-[#3d2a00] shadow-[inset_0_-3px_0_rgba(0,0,0,0.14)]'}`,
                        children: [
                            searchCd > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center justify-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HourglassIcon"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 607,
                                        columnNumber: 15
                                    }, this),
                                    "Streets dey rest — ",
                                    searchCd,
                                    " slot",
                                    searchCd > 1 ? 's' : ''
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 606,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center justify-center gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SocialIcon"], {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 612,
                                        columnNumber: 15
                                    }, this),
                                    "Look around for hustles"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 611,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-0.5 block text-[10px] font-bold opacity-80",
                                children: searchCd > 0 ? 'Offers turn up when the time moves' : 'Ask around this area • quick errands from real people'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 616,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 593,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 571,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-label": "Jobs here",
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkIcon"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 624,
                            columnNumber: 29
                        }, void 0),
                        hint: `${jobsHere.length}`,
                        children: [
                            "Shifts at ",
                            location.shortName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 624,
                        columnNumber: 9
                    }, this),
                    jobsHere.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-xl border border-dashed border-black/10 bg-white/50 px-4 py-4 text-center text-xs font-semibold text-[var(--lko-ink-soft)]",
                        children: "No formal shifts here — check the hustle board or explore other areas."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 628,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: jobsHere.map((job)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(JobRow, {
                                job: job,
                                onOpen: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    setSheetJobId(job.id);
                                }
                            }, job.id, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 634,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 632,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 623,
                columnNumber: 7
            }, this),
            jobsElsewhere.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-label": "Jobs elsewhere",
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapIcon"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 650,
                            columnNumber: 31
                        }, void 0),
                        children: "Work in other parts of Lokoja"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 650,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-2",
                        children: jobsElsewhere.map((job)=>{
                            const loc = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][job.locationId];
                            const lockedLoc = player.level < (loc?.unlockLevel ?? 1);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    onGoToMap(job.locationId);
                                },
                                className: "lko-press flex w-full items-center gap-3 rounded-xl border border-black/[0.05] bg-black/[0.02] px-3 py-2.5 text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.05] text-[var(--lko-ink-soft)] opacity-70",
                                        "aria-hidden": true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JobIcon"], {
                                            id: job.id,
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                            lineNumber: 665,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 664,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block truncate text-[13px] font-bold text-[var(--lko-ink)]",
                                                children: job.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 668,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-0.5 flex items-center gap-1 truncate text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaceIcon"], {
                                                        id: job.locationId,
                                                        size: 11
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 670,
                                                        columnNumber: 23
                                                    }, this),
                                                    loc?.name ?? 'Lokoja',
                                                    lockedLoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center gap-0.5 font-bold text-[var(--lko-terra)]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-black/25",
                                                                children: "•"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                                lineNumber: 674,
                                                                columnNumber: 27
                                                            }, this),
                                                            "Level ",
                                                            loc?.unlockLevel
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 673,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 669,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 667,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex shrink-0 items-center gap-0.5 text-[11px] font-extrabold text-[var(--lko-green)]",
                                        children: [
                                            "Go ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "aria-hidden": true,
                                                children: "→"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 681,
                                                columnNumber: 24
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 680,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, job.id, true, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 656,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 651,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 649,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-label": "Earnings",
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionTitle, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CoinsIcon"], {
                            size: 13
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                            lineNumber: 692,
                            columnNumber: 29
                        }, void 0),
                        children: [
                            "Money — Day ",
                            world.day
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lko-card p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-2 rounded-xl bg-[var(--lko-green-soft)] py-2.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendUpIcon"], {
                                                size: 15,
                                                className: "text-[var(--lko-green-deep)]",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 696,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-green-deep)]",
                                                        children: "Earned today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 698,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "lko-display lko-num text-lg text-[var(--lko-green-deep)]",
                                                        children: [
                                                            "+",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(todayEarned)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 699,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 697,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 695,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendDownIcon"], {
                                                size: 15,
                                                className: "text-red-700",
                                                "aria-hidden": true
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 703,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] font-extrabold uppercase tracking-wider text-red-700",
                                                        children: "Spent today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 705,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "lko-display lko-num text-lg text-red-700",
                                                        children: [
                                                            "−",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(todaySpent)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 706,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 704,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 702,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 694,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "mb-1.5 mt-3 text-[10px] font-extrabold uppercase tracking-wider text-[var(--lko-ink-soft)]",
                                children: "Recent"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 711,
                                columnNumber: 11
                            }, this),
                            player.transactions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "rounded-xl bg-black/[0.03] px-3 py-3 text-center text-xs font-semibold text-[var(--lko-ink-soft)]",
                                children: "No money moves yet — your first hustle dey wait."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 715,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "flex flex-col gap-1",
                                children: player.transactions.slice(0, 5).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 odd:bg-black/[0.03]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex min-w-0 flex-1 items-center gap-1.5 truncate text-xs font-semibold text-[var(--lko-ink)]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "shrink-0 text-[var(--lko-ink-soft)]",
                                                        "aria-hidden": true,
                                                        children: t.amount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendUpIcon"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                            lineNumber: 724,
                                                            columnNumber: 39
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrendDownIcon"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                            lineNumber: 724,
                                                            columnNumber: 67
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 723,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "truncate",
                                                        children: [
                                                            t.label,
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "lko-num ml-1 text-[10px] text-[var(--lko-ink-soft)]",
                                                                children: [
                                                                    "D",
                                                                    t.day
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                                lineNumber: 728,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                        lineNumber: 726,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 722,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `lko-num shrink-0 text-xs font-extrabold ${t.amount > 0 ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-terra)]'}`,
                                                children: [
                                                    t.amount > 0 ? '+' : '−',
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(Math.abs(t.amount))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                                lineNumber: 731,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, t.id, true, {
                                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                        lineNumber: 721,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                                lineNumber: 719,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                        lineNumber: 693,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 691,
                columnNumber: 7
            }, this),
            sheetJob && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(JobSheet, {
                job: sheetJob,
                onClose: ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                    setSheetJobId(null);
                },
                onStart: ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                    setSheetJobId(null);
                    workShift(sheetJob.id);
                }
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
                lineNumber: 748,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/WorkScreen.tsx",
        lineNumber: 501,
        columnNumber: 5
    }, this);
}
_s4(WorkScreen, "4UJGYvcuJ+ibd070z60Oyz9nngk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c7 = WorkScreen;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "NpcDisc");
__turbopack_context__.k.register(_c1, "SkillPill");
__turbopack_context__.k.register(_c2, "SectionTitle");
__turbopack_context__.k.register(_c3, "OfferCard");
__turbopack_context__.k.register(_c4, "FreshOfferCard");
__turbopack_context__.k.register(_c5, "JobRow");
__turbopack_context__.k.register(_c6, "JobSheet");
__turbopack_context__.k.register(_c7, "WorkScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_game_screens_WorkScreen_tsx_89caae50._.js.map