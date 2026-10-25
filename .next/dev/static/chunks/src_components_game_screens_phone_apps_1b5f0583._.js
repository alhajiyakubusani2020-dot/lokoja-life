(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FaceHero",
    ()=>FaceHero,
    "LawNote",
    ()=>LawNote,
    "MiniBar",
    ()=>MiniBar,
    "SectionLabel",
    ()=>SectionLabel,
    "StatTile",
    ()=>StatTile,
    "StatusChip",
    ()=>StatusChip
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
const HERO_GRAD = {
    green: 'from-[var(--lko-green-deep)] via-[var(--lko-green)] to-[#0b4a2a]',
    gold: 'from-[#8a6d1a] via-[var(--lko-gold-deep)] to-[#6b5416]',
    river: 'from-[#155e75] via-[var(--lko-river)] to-[#0e4a5c]',
    terra: 'from-[#9a3412] via-[var(--lko-terra)] to-[#7c2d12]',
    ember: 'from-[#92400e] via-[#b45309] to-[#78350f]',
    ink: 'from-[#0f1a15] via-[#1a2a22] to-[#0b1512]'
};
function FaceHero({ id, glyph, title, sub, hue = 'green', right, wrap = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-testid": `${id}-hero`,
        className: `relative overflow-hidden rounded-2xl bg-gradient-to-br ${HERO_GRAD[hue]} p-3.5 text-white shadow-[var(--lko-shadow-md)]`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 48 48",
                className: "absolute -right-3 -top-3 h-20 w-20 opacity-[0.14]",
                "aria-hidden": true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M8 8 C 20 13 23 22 24 36",
                        stroke: "#fff",
                        strokeWidth: "5",
                        fill: "none",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M41 17 C 31 20 26 26 24 36",
                        stroke: "#fff",
                        strokeWidth: "5",
                        fill: "none",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "24",
                        cy: "37.5",
                        r: "4",
                        fill: "#fff"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex items-start justify-between gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-[15px] backdrop-blur-sm",
                                        "aria-hidden": true,
                                        children: glyph
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                                        lineNumber: 61,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: `lko-display text-[16px] leading-tight ${wrap ? '' : 'truncate'}`,
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                                        lineNumber: 64,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10px] font-bold leading-snug text-white/80",
                                children: sub
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    right && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "shrink-0",
                        children: right
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                        lineNumber: 68,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c = FaceHero;
function StatTile({ label, value, tone = 'green' }) {
    const toneCls = tone === 'gold' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : tone === 'river' ? 'bg-[var(--lko-river-soft)] text-[var(--lko-river)]' : tone === 'terra' ? 'bg-orange-50 text-[var(--lko-terra)]' : 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-xl px-2 py-1.5 text-center ${toneCls}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lko-num text-[14px] font-black leading-none",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-0.5 text-[8px] font-extrabold uppercase tracking-[0.06em] opacity-80",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c1 = StatTile;
function SectionLabel({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "px-1 pb-0.5 pt-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--lko-ink-soft)]",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_c2 = SectionLabel;
function LawNote({ children, tone = 'plain' }) {
    const cls = tone === 'gold' ? 'border-[var(--lko-gold)]/30 bg-[var(--lko-gold-soft)]/60' : tone === 'river' ? 'border-[var(--lko-river)]/25 bg-[var(--lko-river-soft)]/70' : 'border-black/[0.05] bg-black/[0.02]';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-xl border ${cls} px-2.5 py-1.5`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-[9.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
            lineNumber: 113,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_c3 = LawNote;
function MiniBar({ pct, tone = 'green', tall = false }) {
    const w = Math.max(0, Math.min(100, pct));
    const cls = tone === 'gold' ? 'bg-[var(--lko-gold)]' : tone === 'river' ? 'bg-[var(--lko-river)]' : tone === 'terra' ? 'bg-[var(--lko-terra)]' : tone === 'red' ? 'bg-red-500' : 'bg-[var(--lko-green)]';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${tall ? 'h-2' : 'h-1.5'} overflow-hidden rounded-full bg-black/[0.05]`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `h-full rounded-full transition-[width] duration-500 ${cls}`,
            style: {
                width: `${w}%`
            }
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
_c4 = MiniBar;
function StatusChip({ children, tone = 'plain' }) {
    const cls = tone === 'ok' ? 'bg-[var(--lko-green-soft)] text-[var(--lko-green-deep)]' : tone === 'warn' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : tone === 'bad' ? 'bg-red-50 text-red-700' : tone === 'gold' ? 'bg-[var(--lko-gold-soft)] text-[var(--lko-gold-deep)]' : 'bg-black/[0.05] text-[var(--lko-ink-soft)]';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-black ${cls}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/phone/apps/app-face.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}
_c5 = StatusChip;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "FaceHero");
__turbopack_context__.k.register(_c1, "StatTile");
__turbopack_context__.k.register(_c2, "SectionLabel");
__turbopack_context__.k.register(_c3, "LawNote");
__turbopack_context__.k.register(_c4, "MiniBar");
__turbopack_context__.k.register(_c5, "StatusChip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>WardrobeApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — WARDROBE APP (the Bend-Down Select in your pocket)
 * --------------------------------------------------------
 * The wardrobe book, honest: the walks you own and which one is
 * equipped, the premium outfits and their real cloth states — bought
 * (agbada, jersey), earned-only (confluence-gold, lab-coat — the drops
 * the hill and the white coat pay), and the six base styles you owned
 * by birth. Every move goes through the store's REAL doors:
 *   wardrobeBuy / wardrobeEquipWalk (systems/wardrobe.ts laws)
 *   setAvatar (the appearance commit the 3D rig reads)
 * Every number here is a catalogue price or a save fact — nothing
 * is invented, the earned twins carry no price tag.
 *
 * M24-UI wave 2 — the face: gold-toned hero with the wearing chip,
 * the cloth rows with wear/buy doors, the birthright six as chips.
 * Every number, every testid, every law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wardrobe.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const APP_ID = 'wardrobe';
const APP_TITLE = 'Wardrobe';
const APP_GLYPH = '👕';
function WardrobeApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WardrobeApp.useGameStore[player]": (s)=>s.player
    }["WardrobeApp.useGameStore[player]"]);
    const wardrobe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WardrobeApp.useGameStore[wardrobe]": (s)=>s.wardrobe
    }["WardrobeApp.useGameStore[wardrobe]"]);
    const wardrobeBuy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WardrobeApp.useGameStore[wardrobeBuy]": (s)=>s.wardrobeBuy
    }["WardrobeApp.useGameStore[wardrobeBuy]"]);
    const wardrobeEquipWalk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WardrobeApp.useGameStore[wardrobeEquipWalk]": (s)=>s.wardrobeEquipWalk
    }["WardrobeApp.useGameStore[wardrobeEquipWalk]"]);
    const setAvatar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WardrobeApp.useGameStore[setAvatar]": (s)=>s.setAvatar
    }["WardrobeApp.useGameStore[setAvatar]"]);
    if (!player) return null;
    const activeWalk = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WALK_BY_KEY"].get(wardrobe.activeWalk);
    const ownsWalk = (key)=>key === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STREET_WALK"] || wardrobe.ownedWalks.includes(key);
    const ownsOutfit = (key)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_STYLE_KEYS"].has(key) || wardrobe.ownedStyles.includes(key);
    const wearStyle = (key)=>setAvatar({
            ...player.avatar,
            clothingStyle: key
        });
    const wornOutfit = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PREMIUM_OUTFITS"].find((o)=>player.avatar.clothingStyle === o.key);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "wardrobe-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "wardrobe",
                glyph: "👕",
                title: "Wardrobe",
                sub: "The Bend-Down Select — same laws as the mirror at home",
                hue: "gold",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "rounded-full bg-white/15 px-2 py-1 text-[9px] font-black backdrop-blur-sm",
                    children: wornOutfit ? wornOutfit.label : 'base cloth'
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "wardrobe-active",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lko-gold-soft)] text-[15px]",
                                    "aria-hidden": true,
                                    children: "🚶"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] font-extrabold text-[var(--lko-ink)]",
                                            children: [
                                                "Your Walk — ",
                                                activeWalk?.label ?? 'Street Walk'
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: activeWalk ? activeWalk.blurb : 'The Lokoja stride you were born with'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                            lineNumber: 69,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Walk Styles"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-0.5 space-y-1.5",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WALK_STYLES"].map((w)=>{
                                const owned = ownsWalk(w.key);
                                const active = wardrobe.activeWalk === w.key;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-xl px-2.5 py-2 ${active ? 'bg-[var(--lko-gold-soft)]/50' : 'bg-black/[0.03]'}`,
                                    "data-testid": `wardrobe-walk-${w.key}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                        children: [
                                                            w.label,
                                                            active ? ' · wearing' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                        children: w.blurb
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 86,
                                                columnNumber: 21
                                            }, this),
                                            owned ? active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                tone: "ok",
                                                children: "ON"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 94,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "data-testid": `wardrobe-walk-equip-${w.key}`,
                                                className: "lko-press shrink-0 rounded-lg bg-[var(--lko-green)] px-2.5 py-1.5 text-[9.5px] font-black text-white",
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                    void wardrobeEquipWalk(w.key);
                                                },
                                                children: "WEAR"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 96,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "data-testid": `wardrobe-walk-buy-${w.key}`,
                                                className: "lko-press lko-num shrink-0 rounded-lg bg-[var(--lko-gold-deep)] px-2.5 py-1.5 text-[9.5px] font-black text-white",
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                    void wardrobeBuy('walk', w.key);
                                                },
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(w.price)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 106,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                        lineNumber: 85,
                                        columnNumber: 19
                                    }, this)
                                }, w.key, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                    lineNumber: 84,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                            lineNumber: 79,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Premium Outfits"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-0.5 space-y-1.5",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PREMIUM_OUTFITS"].map((o)=>{
                                const owned = wardrobe.ownedStyles.includes(o.key);
                                const worn = player.avatar.clothingStyle === o.key;
                                const earnedOnly = o.price <= 0;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-xl px-2.5 py-2 ${worn ? 'bg-[var(--lko-gold-soft)]/50' : 'bg-black/[0.03]'}`,
                                    "data-testid": `wardrobe-outfit-${o.key}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                        children: [
                                                            o.label,
                                                            worn ? ' · wearing' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "truncate text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                        children: [
                                                            o.blurb,
                                                            earnedOnly ? ' — not sold, earned.' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 133,
                                                columnNumber: 21
                                            }, this),
                                            owned ? worn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                tone: "ok",
                                                children: "ON"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 143,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "data-testid": `wardrobe-outfit-wear-${o.key}`,
                                                className: "lko-press shrink-0 rounded-lg bg-[var(--lko-green)] px-2.5 py-1.5 text-[9.5px] font-black text-white",
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                    wearStyle(o.key);
                                                },
                                                children: "WEAR"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 145,
                                                columnNumber: 25
                                            }, this) : earnedOnly ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                tone: "plain",
                                                children: "EARN IT"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 155,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "data-testid": `wardrobe-outfit-buy-${o.key}`,
                                                className: "lko-press lko-num shrink-0 rounded-lg bg-[var(--lko-gold-deep)] px-2.5 py-1.5 text-[9.5px] font-black text-white",
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                    void wardrobeBuy('outfit', o.key);
                                                },
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(o.price)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                                lineNumber: 157,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                        lineNumber: 132,
                                        columnNumber: 19
                                    }, this)
                                }, o.key, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                    lineNumber: 131,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Base Styles"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "Owned by birth — wear any, no price tag."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 flex flex-wrap gap-1.5",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].filter((s)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wardrobe$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_STYLE_KEYS"].has(s.key)).map((s)=>{
                                    const worn = player.avatar.clothingStyle === s.key;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        "data-testid": `wardrobe-base-${s.key}`,
                                        className: `lko-press rounded-full px-3 py-1.5 text-[9.5px] font-black ${worn ? 'bg-[var(--lko-green)] text-white shadow-[var(--lko-shadow-sm)]' : 'bg-black/[0.05] text-[var(--lko-ink)]'}`,
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            wearStyle(s.key);
                                        },
                                        children: s.label
                                    }, s.key, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                        lineNumber: 181,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                        lineNumber: 175,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/wardrobe-app.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s(WardrobeApp, "bT7brB5wTNV4e08goqvyi2EMOpo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = WardrobeApp;
var _c;
__turbopack_context__.k.register(_c, "WardrobeApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/garage-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>GarageApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — GARAGE APP (the motor park in your pocket)
 * ------------------------------------------------
 * The garage book, honest: the rides you own with their REAL fields —
 * plate, buy day, age, and today's resale value straight from the M4
 * depreciation law (62% day-one, −1.5%/day, 35% floor). Owned vehicles
 * carry NO condition/fuel meter in the save — fuel is bought at the
 * pump per trip (the M4 law: fuel < the public fare). That is stated,
 * not faked. Buy and sell go through the store's REAL doors:
 *   buyVehicle(model) — one per model, showroom price, wallet pays
 *   sellVehicle(id) — the resale law pays
 * The Motor Park board reads the M5 fleet law off the REAL garage:
 *   availableGigs(day, garage, level, weather, fleet, fuelMultFor(day))
 * — the same read the park screen makes, rain premium included.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/vehicles.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/garage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/fleet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/chaos.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
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
;
const APP_ID = 'garage';
const APP_TITLE = 'Garage';
const APP_GLYPH = '🛻';
function GarageApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "GarageApp.useGameStore[player]": (s)=>s.player
    }["GarageApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "GarageApp.useGameStore[world]": (s)=>s.world
    }["GarageApp.useGameStore[world]"]);
    const fleet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "GarageApp.useGameStore[fleet]": (s)=>s.fleet
    }["GarageApp.useGameStore[fleet]"]);
    const buyVehicle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "GarageApp.useGameStore[buyVehicle]": (s)=>s.buyVehicle
    }["GarageApp.useGameStore[buyVehicle]"]);
    const sellVehicle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "GarageApp.useGameStore[sellVehicle]": (s)=>s.sellVehicle
    }["GarageApp.useGameStore[sellVehicle]"]);
    if (!player || !world) return null;
    const day = world.day;
    const gigs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["availableGigs"])(day, player.vehicles, player.level, world.weather, fleet, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$chaos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fuelMultFor"])(day));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "garage-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-2 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[15px] font-black text-[var(--lko-ink)]",
                        children: "Garage"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            player.vehicles.length,
                            " ride",
                            player.vehicles.length === 1 ? '' : 's',
                            " · one per model — Lokoja parking na real"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                children: "Your Rides"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            player.vehicles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "garage-empty",
                                children: "The garage is empty — the showroom dey wait below."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 57,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-1.5",
                                children: player.vehicles.map((v)=>{
                                    const def = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][v.model];
                                    const resale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$garage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resaleValue"])(v.model, v.boughtDay, day);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-black/[0.03] px-2.5 py-2",
                                        "data-testid": `garage-vehicle-${v.id}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                            children: [
                                                                def.emoji,
                                                                " ",
                                                                def.label,
                                                                " · ",
                                                                v.plate
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                            lineNumber: 69,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                            children: [
                                                                "bought day ",
                                                                v.boughtDay,
                                                                " · ",
                                                                Math.max(0, day - v.boughtDay),
                                                                " day",
                                                                day - v.boughtDay === 1 ? '' : 's',
                                                                " old · resale ",
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(resale)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                            lineNumber: 72,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] font-semibold text-[var(--lko-ink-soft)]",
                                                            children: "Fuel dey pump-side per trip — e no dey park for garage (the M4 law: fuel < the public fare)."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                            lineNumber: 75,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                    lineNumber: 68,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    "data-testid": `garage-sell-${v.id}`,
                                                    className: "lko-press shrink-0 rounded-lg bg-black/[0.06] px-2.5 py-1 text-[9.5px] font-black text-[var(--lko-ink)]",
                                                    onClick: ()=>{
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                        sellVehicle(v.id);
                                                    },
                                                    children: [
                                                        "SELL ",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(resale)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                            lineNumber: 67,
                                            columnNumber: 21
                                        }, this)
                                    }, v.id, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                        lineNumber: 66,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                children: "Showroom"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-1.5",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLES"].map((v)=>{
                                    const owned = player.vehicles.some((p)=>p.model === v.model);
                                    const affordable = player.cash >= v.price;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-black/[0.03] px-2.5 py-2",
                                        "data-testid": `garage-model-${v.model}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                            children: [
                                                                v.emoji,
                                                                " ",
                                                                v.label,
                                                                owned ? ' · in the garage' : ''
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                            lineNumber: 106,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                            children: v.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 21
                                                }, this),
                                                owned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "shrink-0 rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green)]",
                                                    children: "YOURS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    "data-testid": `garage-buy-${v.model}`,
                                                    className: `lko-press shrink-0 rounded-lg px-2.5 py-1 text-[9.5px] font-black text-white ${affordable ? 'bg-[var(--lko-green)]' : 'bg-black/[0.25]'}`,
                                                    onClick: ()=>{
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                        buyVehicle(v.model);
                                                    },
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(v.price)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                            lineNumber: 104,
                                            columnNumber: 19
                                        }, this)
                                    }, v.model, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                        lineNumber: 103,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: "Motor Park Board"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                        lineNumber: 133,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "day ",
                                            day,
                                            " · ",
                                            world.weather
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 132,
                                columnNumber: 11
                            }, this),
                            gigs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "garage-gigs-empty",
                                children: player.vehicles.length === 0 ? 'No rides, no gigs — the board pays the garage, not the pocket.' : "Today's runs don finish — the board refreshes tomorrow."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 137,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-1",
                                children: [
                                    gigs.map((g)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between text-[10px] font-bold",
                                            "data-testid": `garage-gig-${g.id}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate text-[var(--lko-ink-soft)]",
                                                    children: [
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$vehicles$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VEHICLE_BY_MODEL"][g.model].emoji,
                                                        " ",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$fleet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gigLabel"])(g)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "shrink-0 text-[var(--lko-ink)]",
                                                    children: [
                                                        "+",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(g.payout),
                                                        " · fuel ",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(g.fuel)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, g.id, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "pt-0.5 text-[9px] font-semibold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "Runs start at the park (",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"]['transport-area']?.shortName ?? 'Motor Park',
                                            ") — the board dey there."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                        lineNumber: 131,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/garage-app.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(GarageApp, "j9xxiaBlF/+IGeTGQX8qd7BZKKE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = GarageApp;
var _c;
__turbopack_context__.k.register(_c, "GarageApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/houses-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>HousesApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — HOUSES APP (the rent book in your pocket)
 * -----------------------------------------------
 * The roof over the hustle, honest: the M12 housing slice exactly as
 * the save keeps it — owned property or the rented room, the rent book
 * (owed, paid-through, next cycle day), the live landlord wahala, and
 * the real stats the book counts (rentPaid / wahalaResolved /
 * cyclesLate). Money moves ONLY through the store's REAL doors:
 *   payRent('phone')  — the phone transfer carries the ₦50 fee, and the
 *                       door itself refuses unless you dey house (its law)
 *   resolveWahala()   — settle the live wahala at its real cost
 *   furnishHome(tier) — one honest tier at a time, owners only
 * The ladder rows read the REAL config table (price/level/comfort) and
 * the canBuyProperty law — no invented keys, no fake "coming soon".
 *
 * M24-UI wave 2 — the face: river-toned hero with the roof chip, the
 * rent book as a ledger card, the wahala loud, the ladder honest.
 * Every number, every testid, every law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/housing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
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
const APP_ID = 'houses';
const APP_TITLE = 'Houses';
const APP_GLYPH = '🏠';
function HousesApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HousesApp.useGameStore[player]": (s)=>s.player
    }["HousesApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HousesApp.useGameStore[world]": (s)=>s.world
    }["HousesApp.useGameStore[world]"]);
    const housing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HousesApp.useGameStore[housing]": (s)=>s.housing
    }["HousesApp.useGameStore[housing]"]);
    const payRent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HousesApp.useGameStore[payRent]": (s)=>s.payRent
    }["HousesApp.useGameStore[payRent]"]);
    const resolveWahala = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HousesApp.useGameStore[resolveWahala]": (s)=>s.resolveWahala
    }["HousesApp.useGameStore[resolveWahala]"]);
    const furnishHome = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HousesApp.useGameStore[furnishHome]": (s)=>s.furnishHome
    }["HousesApp.useGameStore[furnishHome]"]);
    if (!player || !world) return null;
    const H = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].housing;
    const owned = housing.owned ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["propertyFor"])(housing.owned) : null;
    const nextCycleDay = housing.lastPostedDay + H.rentCycleDays;
    const behind = housing.rentOwed >= H.baseRent * 2;
    const tier = owned ? housing.furnishing[owned.id] ?? 0 : 0;
    const nextTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canFurnish"])(housing, tier + 1);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "houses-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "houses",
                glyph: "🏠",
                title: "Houses",
                sub: "The rent book no dey lie — every naira na the book's own",
                hue: "river",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                    tone: owned ? 'ok' : housing.rentOwed > 0 ? behind ? 'bad' : 'warn' : 'plain',
                    children: owned ? 'OWNER' : behind ? '2 BEHIND' : housing.rentOwed > 0 ? 'OWING' : 'RENTER'
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                    lineNumber: 60,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "houses-roof",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                children: "Your Roof"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            owned ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "houses-owned",
                                children: [
                                    owned.name,
                                    " — yours. Comfort ",
                                    owned.comfort,
                                    " (+",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["homeComfort"])(housing),
                                    " to the sleep law with furnishing),",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][owned.locationId] ? ` ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][owned.locationId].name}` : '',
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "houses-renting",
                                children: [
                                    "You dey rent the basic room at Your Place — ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(H.baseRent),
                                    " a cycle of ",
                                    H.rentCycleDays,
                                    " days. The ladder climbs by BUYING."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    housing.wahala && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-[var(--lko-terra)]/30 bg-orange-50/70 p-3.5",
                        "data-testid": "houses-wahala",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: "Landlord Wahala"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 87,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "day ",
                                            housing.wahala.day,
                                            " · ",
                                            housing.wahala.kind
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 86,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: housing.wahala.note
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            housing.wahala.cost > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "data-testid": "houses-resolve-wahala",
                                className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-terra)] py-2.5 text-[11px] font-black tracking-wide text-white shadow-[var(--lko-shadow-sm)]",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    resolveWahala();
                                },
                                children: [
                                    "SETTLE — ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(housing.wahala.cost)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 92,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                children: "This one na rent problem — pay the rent book, the wahala follows."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 101,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this),
                    !housing.owned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Rent Book"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    !housing.owned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "houses-rent-book",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: "The Book"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 113,
                                        columnNumber: 15
                                    }, this),
                                    housing.rentOwed > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                        tone: behind ? 'bad' : 'warn',
                                        children: behind ? 'TWO CYCLES BEHIND — the notice dey load' : 'owing'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                        tone: "ok",
                                        children: "clean"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 119,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "owed now: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "lko-num font-extrabold text-[var(--lko-ink)]",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(housing.rentOwed)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                lineNumber: 123,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "next cycle posts: day ",
                                            nextCycleDay,
                                            " · paid through: day ",
                                            housing.rentPaidThrough
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 124,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "lifetime paid ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(housing.stats.rentPaid),
                                            " · wahala settled ×",
                                            housing.stats.wahalaResolved,
                                            " · late ×",
                                            housing.stats.cyclesLate
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 125,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this),
                            housing.rentOwed > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "data-testid": "houses-pay-rent",
                                className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] py-2.5 text-[11px] font-black tracking-wide text-white shadow-[var(--lko-shadow-sm)]",
                                onClick: ()=>{
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                    payRent('phone');
                                },
                                children: [
                                    "PAY ONE CYCLE — ",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(Math.min(housing.rentOwed, H.baseRent)),
                                    " (+",
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CIVIC"].phonePayFee),
                                    " phone fee, at home)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this),
                    owned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Furnishing"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    owned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "houses-furnish",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    tier === 0 ? 'Bare room — the fan dey wait.' : `Tier ${tier} fitted.`,
                                    ' ',
                                    "Sleep law: +",
                                    H.sleepEnergyPerComfort,
                                    " energy per comfort point."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-1",
                                children: H.furnishTiers.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between rounded-xl bg-black/[0.03] px-2.5 py-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-[var(--lko-ink)]",
                                                children: [
                                                    "T",
                                                    f.tier,
                                                    " · ",
                                                    f.label,
                                                    " · mood +",
                                                    f.mood
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                lineNumber: 153,
                                                columnNumber: 19
                                            }, this),
                                            f.tier <= tier ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                tone: "ok",
                                                children: "FITTED"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                lineNumber: 157,
                                                columnNumber: 21
                                            }, this) : f.tier === tier + 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "data-testid": `houses-furnish-${f.tier}`,
                                                className: "lko-press rounded-lg bg-[var(--lko-green)] px-2.5 py-1.5 text-[9.5px] font-black text-white",
                                                onClick: ()=>{
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                                    furnishHome(f.tier);
                                                },
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(f.cost)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                lineNumber: 159,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                                children: [
                                                    "finish tier ",
                                                    tier + 1,
                                                    " first"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, f.tier, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 152,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            !nextTier.ok && tier >= H.furnishTiers.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[9px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "Full AC + solar — nothing left to fit."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Ladder"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LawNote"], {
                                tone: "river",
                                children: "Buying happens with the agent at the property's own street — the desks dey there."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-1.5",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROPERTIES"].map((p)=>{
                                    const verdict = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$housing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canBuyProperty"])(housing, p.id, player.level, player.cash);
                                    const isMine = housing.owned === p.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-xl px-2.5 py-2 ${isMine ? 'bg-[var(--lko-green-soft)]/50' : 'bg-black/[0.03]'}`,
                                        "data-testid": `houses-prop-${p.id}`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                            children: p.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "lko-num text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                            children: [
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(p.price),
                                                                " · Level ",
                                                                p.level,
                                                                "+ · comfort ",
                                                                p.comfort
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                            lineNumber: 194,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 21
                                                }, this),
                                                isMine ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                    tone: "ok",
                                                    children: "YOURS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                    tone: verdict.ok ? 'ok' : 'plain',
                                                    children: verdict.ok ? 'affordable' : verdict.why
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                                    lineNumber: 201,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                            lineNumber: 191,
                                            columnNumber: 19
                                        }, this)
                                    }, p.id, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                        lineNumber: 190,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/houses-app.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(HousesApp, "nodumj3l3brZFSDIGxeYoP9yE3Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = HousesApp;
var _c;
__turbopack_context__.k.register(_c, "HousesApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/health-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>HealthApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — HEALTH APP (the body book in your pocket)
 * -----------------------------------------------
 * The four needs meters exactly as the save holds them, with the REAL
 * consequence laws from the needs engine (hunger ≤ 20 drains mood −4
 * per action; hunger 0 drains health −3; energy ≤ 10 blocks strenuous
 * work) and the REAL decay the clock applies. The "where to fix it"
 * card is DERIVED from the city's own data: LOCATIONS activities
 * (eat/shop-food → hunger, rest/sleep → energy) and the FOODS table —
 * no invented clinic, no fake medicine. The age-band card reads
 * AGE_LAW (systems/shield.ts) verbatim — the same table the whole
 * game reads. Read-only: the meters move where the meters move.
 *
 * M24-UI wave 2 — the face: the meters as big honest dials (pct bars
 * with the number riding the row), the mend-card with the city's own
 * data, the age law verbatim. Every number, every testid, every law:
 * unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$foods$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/foods.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/needs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/shield.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
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
const APP_ID = 'health';
const APP_TITLE = 'Health';
const APP_GLYPH = '🩺';
const METERS = [
    {
        key: 'health',
        label: 'Health',
        emoji: '❤️',
        tone: 'red'
    },
    {
        key: 'energy',
        label: 'Energy',
        emoji: '⚡',
        tone: 'gold'
    },
    {
        key: 'hunger',
        label: 'Belle (100 = full)',
        emoji: '🍲',
        tone: 'terra'
    },
    {
        key: 'mood',
        label: 'Mood',
        emoji: '🙂',
        tone: 'green'
    }
];
/** the need a location's REAL activities serve — derived, not invented */ function needServerFor(needKey) {
    const serving = [];
    for (const l of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATIONS"]){
        const keys = l.activities.map((a)=>a.key);
        const hit = needKey === 'hunger' && (keys.includes('eat') || keys.includes('shop-food')) || needKey === 'energy' && (keys.includes('rest') || keys.includes('sleep')) || needKey === 'mood' && (keys.includes('rest') || keys.includes('eat'));
        if (hit) serving.push(l.name);
    }
    return serving;
}
function HealthApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "HealthApp.useGameStore[player]": (s)=>s.player
    }["HealthApp.useGameStore[player]"]);
    if (!player) return null;
    const needs = player.needs;
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$needs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["conditionSummary"])(needs);
    const law = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$shield$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AGE_LAW"][player.ageBand];
    const topMeals = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$foods$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOODS"]
    ].sort((a, b)=>b.hungerRestore - a.hungerRestore).slice(0, 3);
    const hungerSpots = needServerFor('hunger');
    const energySpots = needServerFor('energy');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "health-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "health",
                glyph: "🩺",
                title: "Health",
                sub: "The body book — four meters, the engine's own laws, no invented clinic",
                hue: "green",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "rounded-full bg-white/15 px-2 py-1 text-[9px] font-black backdrop-blur-sm",
                    children: summary.tone === 'bad' ? '⚠ body' : summary.tone === 'good' ? '✓ body' : 'body'
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-[10px] font-bold ${summary.tone === 'bad' ? 'text-red-700' : summary.tone === 'good' ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-ink-soft)]'}`,
                                "data-testid": "health-summary",
                                children: summary.text
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-2.5",
                                children: METERS.map((m)=>{
                                    const v = needs[m.key];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        "data-testid": `health-meter-${m.key}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between text-[10px] font-bold",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[var(--lko-ink)]",
                                                        children: [
                                                            m.emoji,
                                                            " ",
                                                            m.label
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "lko-num text-[var(--lko-ink-soft)]",
                                                        children: [
                                                            Math.round(v),
                                                            "/100"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                        lineNumber: 94,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 92,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniBar"], {
                                                    pct: v,
                                                    tone: m.tone,
                                                    tall: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 96,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, m.key, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 91,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2.5 rounded-xl bg-[var(--lko-river-soft)] px-2.5 py-1.5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[9.5px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                    children: [
                                        "The engine's honest laws: hunger ≤ ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].hungerCritical,
                                        " drains mood −",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].hungryMoodDrain,
                                        " per action; hunger 0 drains health −",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].starvingHealthDrain,
                                        "; energy ≤ ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].energyCritical,
                                        " blocks strenuous work. Every clock slot outside rest drains hunger −",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].decay.hunger,
                                        ", energy −",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].decay.energy,
                                        ", mood −",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].decay.mood,
                                        player.ageBand !== 'adult' ? ' (Chill Mode halves it)' : '',
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                lineNumber: 103,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Where Body Dey Mend"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        "data-testid": "health-hunger-spots",
                                        children: [
                                            "🍲 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-extrabold text-[var(--lko-ink)]",
                                                children: "Hunger"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 118,
                                                columnNumber: 18
                                            }, this),
                                            " — ",
                                            hungerSpots.length > 0 ? hungerSpots.join(' · ') : 'the food tables',
                                            " serve am."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 117,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        "data-testid": "health-energy-spots",
                                        children: [
                                            "⚡ ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-extrabold text-[var(--lko-ink)]",
                                                children: "Energy"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 121,
                                                columnNumber: 17
                                            }, this),
                                            " — ",
                                            energySpots.length > 0 ? energySpots.join(' · ') : 'Your Place',
                                            ": nap +",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].rest.nap.energy,
                                            ", sleep +",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].rest.sleep.energy,
                                            "."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "🙂 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-extrabold text-[var(--lko-ink)]",
                                                children: "Mood"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 124,
                                                columnNumber: 18
                                            }, this),
                                            " — the same rest bench: nap +",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].rest.nap.mood,
                                            ", sleep +",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].rest.sleep.mood,
                                            ", a night out +",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].lounge.mood,
                                            " at the lounge."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "❤️ ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-extrabold text-[var(--lko-ink)]",
                                                children: "Health"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 127,
                                                columnNumber: 18
                                            }, this),
                                            " — sleep patches +",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NEEDS"].rest.sleep.health,
                                            "; the gym patch +",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].gym.health,
                                            " but bills −",
                                            Math.abs(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INTERIOR"].gym.energy),
                                            " energy."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 126,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-1 border-t border-black/[0.05] pt-2",
                                children: topMeals.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between rounded-lg bg-black/[0.02] px-2 py-1 text-[10px] font-bold",
                                        "data-testid": `health-food-${f.id}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate text-[var(--lko-ink-soft)]",
                                                children: [
                                                    f.emoji,
                                                    " ",
                                                    f.name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "lko-num shrink-0 text-[var(--lko-ink)]",
                                                children: [
                                                    "+",
                                                    f.hungerRestore,
                                                    " hunger · ₦",
                                                    f.price.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, f.id, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: "Your Age Law"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 143,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                        tone: "gold",
                                        children: player.ageBand
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 144,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                lineNumber: 142,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "health-age-law",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "crime road: ",
                                            law.crime ? 'open (adult only by design)' : 'LOCKED — the shield no dey argue'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "hustles: ",
                                            law.hustle === 'all' ? 'the whole board' : 'light loads only — kid-safe hustles'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "social: ",
                                            law.social === 'full' ? 'full chat' : 'preset emotes only'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 149,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "study boost: ×",
                                            law.studyBoost,
                                            " smart XP — ",
                                            player.ageBand === 'adult' ? 'adult rate' : 'education-first for the young ones'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 150,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "scammer literacy game: ",
                                            law.scammerFeatured ? 'featured on the school sheet' : 'not featured'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "JAPA gauntlet: ",
                                            law.japa ? 'open' : 'locked — adult paperwork'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/health-app.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(HealthApp, "s/oq14MuQ/VPs9CU9x24tBeJPrM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = HealthApp;
var _c;
__turbopack_context__.k.register(_c, "HealthApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/school-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>SchoolApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — SCHOOL APP (the FUL gate in your pocket)
 * ----------------------------------------------
 * The M12 education ladder exactly as the save keeps it: enrolment
 * state, the semester clock (18 days, 12 lectures, 3 exam days), the
 * ASUU strike (derived per semester — the union never asks permission),
 * the exam's honest math (smart + lectures × 0.5 ≥ 8), and the real
 * stats (examsPassed / failedExams / graduated). The one store door
 * this app offers is the REAL enrolment action — enrollFul() takes the
 * ₦25,000 fee through the wallet, and it refuses a kid by the family
 * shield (university na teen/adult road). The 12 schools listed are
 * the city's REAL registry (data/schools.ts — OSM/plus-code anchors),
 * not a brochure.
 *
 * M24-UI wave 2 — the face: FUL-green hero with the status chip, the
 * semester clock as a tall honest bar, the exam math card, the real
 * campus registry. Every number, every testid, every law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/education.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/schools.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
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
const APP_ID = 'school';
const APP_TITLE = 'School';
const APP_GLYPH = '🎓';
const E = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LADDER"].education;
const FUL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCHOOLS"].find(_c = (s)=>s.id === 'ful-felele');
_c1 = FUL;
function SchoolApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SchoolApp.useGameStore[player]": (s)=>s.player
    }["SchoolApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SchoolApp.useGameStore[world]": (s)=>s.world
    }["SchoolApp.useGameStore[world]"]);
    const education = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SchoolApp.useGameStore[education]": (s)=>s.education
    }["SchoolApp.useGameStore[education]"]);
    const enrollFul = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "SchoolApp.useGameStore[enrollFul]": (s)=>s.enrollFul
    }["SchoolApp.useGameStore[enrollFul]"]);
    if (!player || !world) return null;
    const day = world.day;
    const semesterDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["semesterDayOf"])(education, day);
    const gate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canEnroll"])(education, player.level);
    const strike = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStrikeDay"])(education, day);
    const exam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["examScore"])(player.skills.smart, education.lecturesDone);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "school-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "school",
                glyph: "🎓",
                title: "School",
                sub: FUL ? `${FUL.name} — ${FUL.motto}` : 'The Lokoja ladder',
                hue: "green",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                    tone: education.graduated ? 'gold' : education.enrolled ? 'ok' : 'plain',
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "data-testid": "school-status",
                        children: education.graduated ? 'GRADUATE' : education.enrolled ? `SEM ${education.semester}` : 'NOT ENROLLED'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                        lineNumber: 69,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                    lineNumber: 68,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "school-enrolment",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                children: "Enrolment"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            education.enrolled || education.graduated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: education.graduated ? `The FUL certificate dey your hand — the career desks (Civil Servant, Tutorial Assistant) don open. Convocation ${education.convocationAttended ? 'attended' : `holds day ${education.convocationDay ?? '—'} at FUL`}.` : `Ladder: exam ${education.examsPassed}/${E.semestersToGraduate} passed toward the certificate (absolute semester ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["absoluteSemesterIndex"])(education)}).`
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "The FUL gate: ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(E.enrollFee),
                                            " enrollment fee, Level ",
                                            E.enrollLevel,
                                            "+, then the clock runs — ",
                                            E.semesterDays,
                                            "-day semesters, ",
                                            E.lecturesNeeded,
                                            " lectures, 4 semesters to the certificate."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-0.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            gate.ok ? 'The gate is open for you.' : gate.why,
                                            player.ageBand === 'kid' ? ' University na teen/adult road — your school na the library and the scammer game.' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        "data-testid": "school-enroll",
                                        className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] py-2.5 text-[11px] font-black tracking-wide text-white shadow-[var(--lko-shadow-sm)] disabled:opacity-50",
                                        onClick: ()=>{
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                            enrollFul();
                                        },
                                        children: [
                                            "ENROLL — ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(E.enrollFee)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    education.enrolled && !education.graduated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "school-semester",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: [
                                            "Semester ",
                                            education.semester
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 110,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "day ",
                                            semesterDay,
                                            "/",
                                            E.semesterDays
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniBar"], {
                                    pct: semesterDay / E.semesterDays * 100,
                                    tall: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "lectures: ",
                                            education.lecturesDone,
                                            "/",
                                            E.lecturesNeeded,
                                            " · each pays ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(E.lectureStipend),
                                            " + ",
                                            E.lectureSmartXp,
                                            " smart XP · the Dean pays ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(E.deansGrant),
                                            " at ",
                                            E.deansLectures
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 117,
                                        columnNumber: 15
                                    }, this),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isLectureWindow"])(education, day) && !strike && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-[var(--lko-green-deep)]",
                                        children: "lecture window open — one lecture a day, at FUL only."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 118,
                                        columnNumber: 62
                                    }, this),
                                    strike && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-red-700",
                                        "data-testid": "school-strike",
                                        children: [
                                            "ASUU don lock gate — ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strikeDaysLeft"])(education, day),
                                            " day",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["strikeDaysLeft"])(education, day) === 1 ? '' : 's',
                                            " more. The union never asks permission."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 119,
                                        columnNumber: 26
                                    }, this),
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$education$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isExamWindow"])(education, day) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-bold text-[var(--lko-terra)]",
                                        children: "exam window — the halls quiet for the papers."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 120,
                                        columnNumber: 48
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Exam Math"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "school-exam",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    "score = smart + lectures × 0.5 ≥ ",
                                    E.examPassScore,
                                    ". No dice — the semester's work decides."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 rounded-lg bg-black/[0.02] px-2 py-1.5 text-[10.5px] font-bold text-[var(--lko-ink)]",
                                "data-testid": "school-exam-score",
                                children: [
                                    "your standing now: ",
                                    player.skills.smart,
                                    " + ",
                                    education.lecturesDone,
                                    " × 0.5 = ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num font-black",
                                        children: exam.toFixed(1)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 132,
                                        columnNumber: 89
                                    }, this),
                                    ' ',
                                    exam >= E.examPassScore ? '— that one pass' : '— that one no pass yet'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-0.5 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "exams passed ×",
                                            education.examsPassed,
                                            " · failed ×",
                                            education.failedExams,
                                            " · sats ×",
                                            education.stats.examSits
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 136,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "lifetime lectures ×",
                                            education.stats.lectures,
                                            " · semesters cleared ×",
                                            education.stats.semestersPassed
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Schools of Lokoja"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCHOOLS"].length,
                                    " real campuses — OSM ground truth and plus-code anchors, same projection as the 3D city."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-1",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$schools$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SCHOOLS"].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between rounded-lg bg-black/[0.02] px-2 py-1 text-[10px] font-bold",
                                        "data-testid": `school-site-${s.id}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "truncate text-[var(--lko-ink-soft)]",
                                                children: [
                                                    s.emoji,
                                                    " ",
                                                    s.name
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "shrink-0 text-[9.5px] font-extrabold text-[var(--lko-ink-soft)]",
                                                children: [
                                                    s.kind,
                                                    s.anchor === 'osm' ? ' · OSM' : s.anchor === 'plus-code' ? ' · plus-code' : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                                lineNumber: 151,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, s.id, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/school-app.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_s(SchoolApp, "GD6BcJ/H4NFu0fJl8pwDHIO0keg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c2 = SchoolApp;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "FUL$SCHOOLS.find");
__turbopack_context__.k.register(_c1, "FUL");
__turbopack_context__.k.register(_c2, "SchoolApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/career-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>CareerApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — CAREER APP (the ladder in your pocket)
 * --------------------------------------------
 * The progression ladder, honest: level + XP against the REAL curve
 * (xpToNextLevel = 120 × level^1.4, cap 50), the current job from the
 * save, the reputation tier table, the skill cap law, and the job
 * board's next-rank requirements exactly as data/jobs.ts stores them —
 * unlock level, skill bars, reputation floor, and the FUL certificate
 * gate. Read-only by design: shifts happen at the desks (workShift
 * lives at the Work tab and at the job's own location), this app shows
 * you WHICH door to walk through and what it still asks of you.
 *
 * M24-UI wave 2 — the face: terra-toned hero with the level ring, the
 * XP bar tall, the skill tiles, the rep chip, the honest board. Every
 * number, every testid, every honest law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/jobs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const APP_ID = 'career';
const APP_TITLE = 'Career';
const APP_GLYPH = '💼';
function CareerApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "CareerApp.useGameStore[player]": (s)=>s.player
    }["CareerApp.useGameStore[player]"]);
    const education = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "CareerApp.useGameStore[education]": (s)=>s.education
    }["CareerApp.useGameStore[education]"]);
    if (!player) return null;
    const need = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["xpToNextLevel"])(player.level);
    const pct = Math.min(100, player.xp / need * 100);
    const job = player.jobId ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOB_BY_ID"][player.jobId] ?? null : null;
    const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reputationTier"])(player.reputation);
    const nextTier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nextReputationTier"])(player.reputation);
    const sorted = [
        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOBS"]
    ].sort((a, b)=>a.unlockLevel - b.unlockLevel || a.basePay - b.basePay);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "career-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "career",
                glyph: "💼",
                title: "Career",
                sub: "The ladder no dey lie — every gate na the real table",
                hue: "terra",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/15 backdrop-blur-sm",
                    "aria-hidden": true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lko-num text-[14px] font-black leading-none",
                            children: player.level
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mt-0.5 text-[6.5px] font-extrabold uppercase tracking-wider text-white/70",
                            children: "level"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                    lineNumber: 52,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Ladder"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "career-ladder",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "lko-num text-[20px] font-black leading-none text-[var(--lko-terra)]",
                                        "data-testid": "career-level",
                                        children: [
                                            "L",
                                            player.level
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 64,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            "cap ",
                                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PROGRESSION"].maxLevel,
                                            " · ",
                                            player.xp,
                                            "/",
                                            need,
                                            " XP → L",
                                            player.level + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 65,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 63,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniBar"], {
                                    pct: pct,
                                    tone: "terra",
                                    tall: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 grid grid-cols-3 gap-1.5 text-center",
                                children: [
                                    'hustle',
                                    'smart',
                                    'social'
                                ].map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-black/[0.03] px-1 py-1.5",
                                        "data-testid": `career-skill-${k}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "lko-num text-[12px] font-black text-[var(--lko-ink)]",
                                                children: [
                                                    player.skills[k],
                                                    "/",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skillCap"])(player.level)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[8px] font-bold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                                children: [
                                                    k,
                                                    " · cap L",
                                                    player.level
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, k, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "career-job",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                children: "Current Job"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            job ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 flex items-start gap-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[16px]",
                                        "aria-hidden": true,
                                        children: job.emoji
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                children: job.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                lineNumber: 87,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] font-semibold leading-snug text-[var(--lko-ink-soft)]",
                                                children: [
                                                    job.description,
                                                    " — base ",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(job.basePay),
                                                    "/shift, ",
                                                    job.energyCost,
                                                    "⚡, +",
                                                    job.xpReward,
                                                    " XP, +",
                                                    job.reputationReward,
                                                    " rep. Shifts dey ",
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][job.locationId]?.name ?? job.locationId,
                                                    "."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                lineNumber: 88,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 86,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "career-job-none",
                                children: "No job yet — the boards dey wait. Take a job at its own location and shifts open."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "career-rep",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: "Reputation"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                        tone: "gold",
                                        children: tier.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    player.reputation,
                                    " rep — ",
                                    tier.title,
                                    ".",
                                    nextTier ? ` ${nextTier.tier.name} at ${nextTier.tier.threshold} (${nextTier.remaining} to go).` : ' The top of the table — Lokoja knows your name.'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "Job Board"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: [
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$jobs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JOBS"].length,
                                    " jobs — the desk requirements below na the data's own words."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1.5 space-y-1.5",
                                children: sorted.map((j)=>{
                                    const lockedLevel = player.level < j.unlockLevel;
                                    const reqs = [];
                                    if (j.requirements.minSkills) {
                                        for (const [k, v] of Object.entries(j.requirements.minSkills)){
                                            const have = player.skills[k];
                                            reqs.push(`${k} ${have}/${v}${have >= (v ?? 0) ? ' ✓' : ''}`);
                                        }
                                    }
                                    if (j.requirements.minReputation) reqs.push(`rep ${player.reputation}/${j.requirements.minReputation}${player.reputation >= j.requirements.minReputation ? ' ✓' : ''}`);
                                    if (j.requirements.requiresDegree) reqs.push(education.graduated ? 'certificate ✓' : 'needs FUL certificate');
                                    const open = !lockedLevel && reqs.every((r)=>r.endsWith('✓'));
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-xl px-2.5 py-2 ${open ? 'bg-[var(--lko-green-soft)]/50' : 'bg-black/[0.03]'}`,
                                        "data-testid": `career-jobrow-${j.id}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "min-w-0 truncate text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                        children: [
                                                            j.emoji,
                                                            " ",
                                                            j.name,
                                                            player.jobId === j.id ? ' · yours' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                        tone: open ? 'ok' : 'plain',
                                                        children: open ? 'QUALIFIES' : `L${j.unlockLevel}+`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                        lineNumber: 136,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                lineNumber: 131,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-0.5 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                children: [
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(j.basePay),
                                                    "/shift · ",
                                                    j.energyCost,
                                                    "⚡ · ",
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][j.locationId]?.shortName ?? j.locationId,
                                                    reqs.length > 0 ? ` · ${reqs.join(' · ')}` : ' · no requirements'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, j.id, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                        lineNumber: 130,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/career-app.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(CareerApp, "mZlgsKtzUN7h9d9ePiGtDhogrFk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = CareerApp;
var _c;
__turbopack_context__.k.register(_c, "CareerApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/contacts-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>ContactsApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — CONTACTS APP (the paddy book in your pocket)
 * --------------------------------------------------
 * The 14 real people of Lokoja (data/npcs.ts) with their REAL
 * relationship values — the familiarity track (0–100) the save keeps
 * per NPC, and the tier that familiarity buys (stranger →
 * acquaintance → paddy → close-paddy) straight from systems/social.ts.
 * Read-only on purpose: talking happens face-to-face or in the Chats
 * app — one chat per NPC per in-game day is the law, and this book
 * only shows whether today's slot is still open. No cross-app
 * navigation, no invented friends.
 *
 * M24-UI wave 2 — the face: river-toned hero, the three-count stat
 * strip, tier-ringed avatar rows with familiarity bars. Every number,
 * every testid, every honest law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/social.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const APP_ID = 'contacts';
const APP_TITLE = 'Contacts';
const APP_GLYPH = '📇';
function ContactsApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ContactsApp.useGameStore[player]": (s)=>s.player
    }["ContactsApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ContactsApp.useGameStore[world]": (s)=>s.world
    }["ContactsApp.useGameStore[world]"]);
    if (!player || !world) return null;
    const day = world.day;
    const rows = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPCS"].map((npc)=>{
        const rel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["relationshipFor"])(player.relationships, npc.id);
        const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tierFor"])(rel.familiarity);
        return {
            npc,
            rel,
            tier,
            meta: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIER_META"][tier],
            openToday: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canChat"])(player.relationships[npc.id], day)
        };
    });
    const paddies = rows.filter((r)=>r.tier === 'paddy' || r.tier === 'close-paddy').length;
    const met = rows.filter((r)=>r.rel.familiarity > 0).length;
    const sorted = [
        ...rows
    ].sort((a, b)=>b.rel.familiarity - a.rel.familiarity);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "contacts-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "contacts",
                glyph: "📇",
                title: "Contacts",
                sub: "The paddy book — who you know for Lokoja, by the numbers the street keeps",
                hue: "river",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "rounded-full bg-white/15 px-2 py-1 text-[10px] font-black backdrop-blur-sm",
                    children: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPCS"].length,
                        " faces"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                    lineNumber: 54,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 grid grid-cols-3 gap-1.5 px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatTile"], {
                        label: "met",
                        value: met,
                        tone: "river"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatTile"], {
                        label: "paddies",
                        value: paddies,
                        tone: "green"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatTile"], {
                        label: "talked today",
                        value: rows.length - rows.filter((r)=>r.openToday).length,
                        tone: "gold"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 flex-1 space-y-2 overflow-y-auto px-4 pb-4 pt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Paddy Book"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LawNote"], {
                                tone: "river",
                                children: [
                                    "Familiarity 0–100: ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$social$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TIERS"].filter((t)=>t.tier !== 'stranger').map((t)=>`${t.min} ${t.tier}`).join(' · '),
                                    ". One chat a day per person — the street no dey rush."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2 space-y-1.5",
                                children: sorted.map(({ npc, rel, tier, meta, openToday })=>{
                                    const ringCls = tier === 'close-paddy' ? 'ring-[var(--lko-gold)]' : tier === 'paddy' ? 'ring-[var(--lko-green)]' : tier === 'acquaintance' ? 'ring-[var(--lko-river)]/60' : 'ring-black/[0.06]';
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl bg-black/[0.03] px-2.5 py-2",
                                        "data-testid": `contacts-row-${npc.id}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[16px] ring-2 ${ringCls}`,
                                                        "aria-hidden": true,
                                                        children: npc.emoji
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                        lineNumber: 84,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "min-w-0 flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "truncate text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                                        children: npc.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                                        lineNumber: 89,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                                        tone: tier === 'close-paddy' ? 'gold' : tier === 'paddy' ? 'ok' : 'plain',
                                                                        children: meta.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                                        lineNumber: 90,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                                lineNumber: 88,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "truncate text-[9px] font-semibold text-[var(--lko-ink-soft)]",
                                                                children: [
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][npc.homeLocationId]?.shortName ?? npc.homeLocationId,
                                                                    " · ",
                                                                    meta.perk,
                                                                    meta.offerBonus > 0 ? ` (offers +${Math.round(meta.offerBonus * 100)}%)` : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                                lineNumber: 94,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                        lineNumber: 87,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                lineNumber: 82,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-1.5 flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniBar"], {
                                                            pct: rel.familiarity,
                                                            tone: tier === 'close-paddy' ? 'gold' : tier === 'paddy' ? 'green' : 'river'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                            lineNumber: 101,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-[86px] shrink-0 text-right text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                                        "data-testid": `contacts-fam-${npc.id}`,
                                                        children: [
                                                            rel.familiarity,
                                                            "/100",
                                                            openToday ? '' : ' · talked today'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                                lineNumber: 99,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, npc.id, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                        lineNumber: 81,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                children: "Open the Chats app to talk — one line a day is the whole law."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/contacts-app.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(ContactsApp, "d34gFTx3Ye/obb9uqKI3ET6uM2Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = ContactsApp;
var _c;
__turbopack_context__.k.register(_c, "ContactsApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/patti-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>PattiApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — MT PATTI APP (the hill's book in your pocket)
 * ---------------------------------------------------
 * The trail book, honest: the five seeded secrets of systems/patti.ts
 * and the save's own found-record (secret id → the day your feet found
 * it). Found spots show their real reward; unfound spots show ONE
 * honest line — "not yet found". This app never prints an unfound
 * secret's name, coordinates, or reward: the hunt is walked, not read.
 * (Discovery itself happens in the 3D world — checkPatti polls your
 * feet at ~2Hz; a phone cannot stand on the summit for you.)
 *
 * M24-UI wave 2 — the face: a hill-green hero with the summit ring,
 * the trail as a climb (found steps glow, unfound steps stay honest
 * locks). Every number, every testid, every honest law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/patti.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const APP_ID = 'patti';
const APP_TITLE = 'Mt Patti';
const APP_GLYPH = '⛰️';
function rewardLine(kind, amount, item) {
    switch(kind){
        case 'cash':
            return `₦${(amount ?? 0).toLocaleString()}`;
        case 'xp':
            return `+${amount ?? 0} XP`;
        case 'rep':
            return `+${amount ?? 0} rep`;
        case 'outfit':
            return `outfit: ${item ?? ''}`;
        case 'walk':
            return `walk: ${item ?? ''}`;
    }
}
function PattiApp() {
    _s();
    const patti = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "PattiApp.useGameStore[patti]": (s)=>s.patti
    }["PattiApp.useGameStore[patti]"]);
    const found = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["secretsFound"])(patti);
    const pct = Math.round(found / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PATTI_SECRETS"].length * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "patti-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "patti",
                glyph: "⛰️",
                title: "Mt Patti",
                sub: "The guardian hill's book — five secrets, walked not read",
                hue: "green",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex h-12 w-12 flex-col items-center justify-center rounded-full bg-white/15 backdrop-blur-sm",
                    "aria-hidden": true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lko-num text-[13px] font-black leading-none",
                            "data-testid": "patti-count",
                            children: [
                                found,
                                "/",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PATTI_SECRETS"].length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mt-0.5 text-[6.5px] font-extrabold uppercase tracking-wider text-white/70",
                            children: "found"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, void 0)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                    lineNumber: 51,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Trail Book"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LawNote"], {
                                children: "Five places, discovered the old way — you WALK there. No minigame, no lottery: the ground itself is the game."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MiniBar"], {
                                    pct: pct,
                                    tall: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                    lineNumber: 65,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2.5 space-y-1.5",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PATTI_SECRETS"].map((sec, i)=>{
                                    const day = patti.found[sec.id];
                                    const isFound = day !== undefined;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `rounded-xl px-2.5 py-2 ${isFound ? 'bg-[var(--lko-green-soft)]/70' : 'bg-black/[0.03]'}`,
                                        "data-testid": `patti-secret-${isFound ? sec.id : 'hidden'}`,
                                        children: isFound ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "flex min-w-0 items-center gap-1.5 text-[11px] font-extrabold text-[var(--lko-ink)]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[var(--lko-green)] text-[8px] font-black text-white",
                                                                    "aria-hidden": true,
                                                                    children: i + 1
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                                                    lineNumber: 81,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "truncate",
                                                                    children: sec.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                                                    lineNumber: 82,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                                            lineNumber: 80,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                                            tone: "ok",
                                                            children: [
                                                                "day ",
                                                                day
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                                            lineNumber: 84,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-0.5 pl-6 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                                    children: [
                                                        "reward: ",
                                                        rewardLine(sec.reward.kind, sec.reward.amount, sec.reward.item)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "flex items-center gap-1.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                            "data-testid": "patti-unfound",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-[8px]",
                                                    "aria-hidden": true,
                                                    children: "🔒"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 23
                                                }, this),
                                                "not yet found. The hill dey wait for your feet."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                            lineNumber: 91,
                                            columnNumber: 21
                                        }, this)
                                    }, sec.id, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            found === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$patti$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PATTI_SECRETS"].length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 rounded-xl bg-[var(--lko-green-soft)] px-2.5 py-1.5 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                "data-testid": "patti-complete",
                                children: "⛰️ The whole hill don open for you — five of five."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 border-t border-black/[0.05] pt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                children: "Unfound spots no get address for this book — the trailhead dey at Mt Patti in the world. Walk am."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/patti-app.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(PattiApp, "/GOHQ5T5n8ItKCOYUzh/ZKBcLwc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = PattiApp;
var _c;
__turbopack_context__.k.register(_c, "PattiApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/story-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>StoryApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — STORY APP (the Confluence Path in your pocket)
 * ----------------------------------------------------
 * The five-chapter chain exactly as systems/story.ts keeps it: the
 * chapter derived by the law (never the stored number alone), the ONE
 * current task with its real cost/energy/place, the six beats, and
 * the coat day the desk stamps. Read-only — the tasks happen on the
 * trail, at the GRA desk, in the world; this page is the honest map
 * of where the path stands. Every number (₦3,500 levy, ₦2,000 fever
 * night, ₦500 × 6 desk days, day-3 meeting) comes from the STORY
 * table, not from this file.
 *
 * M24-UI wave 2 — the face: gold-toned hero with the chapter chip,
 * the NOW card as the path's loudest beat, the ladder with done/live
 * tones. Every number, every testid, every honest law: unchanged.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/story.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/locations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/app-face.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const APP_ID = 'story';
const APP_TITLE = 'Confluence Path';
const APP_GLYPH = '📖';
function StoryApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "StoryApp.useGameStore[player]": (s)=>s.player
    }["StoryApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "StoryApp.useGameStore[world]": (s)=>s.world
    }["StoryApp.useGameStore[world]"]);
    const story = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "StoryApp.useGameStore[story]": (s)=>s.story
    }["StoryApp.useGameStore[story]"]);
    if (!player || !world) return null;
    const ch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chapterOf"])(story);
    const task = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["currentTask"])(story, {
        day: world.day,
        level: player.level,
        cash: player.cash
    });
    const coat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["coatDay"])(story);
    const placeName = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$locations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOCATION_BY_ID"][id]?.name ?? id;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "story-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceHero"], {
                id: "story",
                glyph: "📖",
                title: "Confluence Path",
                sub: "The Crusher boy's ladder — no lottery, no luck: the same grind, the same day, the same naira",
                hue: "gold",
                right: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "rounded-full bg-white/15 px-2 py-1 text-[10px] font-black backdrop-blur-sm",
                    children: [
                        "CH ",
                        ch,
                        "/5"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                    lineNumber: 50,
                    columnNumber: 11
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "story-task",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                        children: "Now"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                        lineNumber: 60,
                                        columnNumber: 13
                                    }, this),
                                    ch === 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                        tone: "gold",
                                        children: "the path is walked"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                        lineNumber: 61,
                                        columnNumber: 26
                                    }, this),
                                    ch < 5 && task && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusChip"], {
                                        tone: task.ready ? 'ok' : 'warn',
                                        children: task.ready ? 'ready today' : 'not ready today'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                        lineNumber: 62,
                                        columnNumber: 32
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            ch === 5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "story-task-line",
                                children: [
                                    "The path is walked — the white coat landed day ",
                                    story.doctorDay,
                                    ". The city moves on."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this) : task ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] font-extrabold leading-snug text-[var(--lko-ink)]",
                                        "data-testid": "story-task-line",
                                        children: task.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                        children: task.hint
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 rounded-lg bg-[var(--lko-gold-soft)]/60 px-2 py-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            task.kind === 'carry' ? `pay ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandPay)} · ${task.energy ?? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandEnergy}⚡ a carry` : '',
                                            task.kind === 'pay' ? `cost ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(task.cost ?? 0)}` : '',
                                            task.kind === 'wait' ? coat > 0 ? `the coat lands day ${coat}` : '' : '',
                                            " · at ",
                                            placeName(task.place),
                                            task.ready ? '' : ' · not ready today'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "story-task-line",
                                children: [
                                    "The hill is quiet — the boy comes down the trail on day ",
                                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].meetDay,
                                    ". Till then, the city dey run."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Path"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-0.5 space-y-1.5",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY_BEATS"].map((b)=>{
                                const done = ch > b.chapter;
                                const live = ch === b.chapter;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `rounded-xl px-2.5 py-2 ${live ? 'bg-[var(--lko-gold-soft)]/70' : done ? 'bg-[var(--lko-green-soft)]/50' : 'bg-black/[0.03]'}`,
                                    "data-testid": `story-beat-${b.chapter}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `min-w-0 truncate text-[11px] font-extrabold ${live ? 'text-[var(--lko-gold-deep)]' : done ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-ink-soft)]'}`,
                                                    children: [
                                                        done ? '✓ ' : live ? '● ' : '○ ',
                                                        b.title
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "shrink-0 text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                                    children: done ? 'done' : live ? 'you dey here' : 'ahead'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                                    lineNumber: 105,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                            lineNumber: 101,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-0.5 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: b.line
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                            lineNumber: 109,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, b.chapter, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                    lineNumber: 96,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$app$2d$face$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SectionLabel"], {
                        children: "The Desk's Book"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "story-book",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "sand carries: ",
                                        story.sandDays,
                                        "/",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandCarries,
                                        " (₦",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandPay,
                                        " + ",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sandEnergy,
                                        "⚡ each)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                    lineNumber: 120,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "notebook levy: ",
                                        story.notePaid ? 'settled' : `₦${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].notebookCost.toLocaleString()} (waived at Level ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].notebookLevel}+)`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "fever night: ",
                                        story.feverPaid ? 'settled' : `₦${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].feverCost.toLocaleString()} at the ${placeName(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].feverPlace)}`
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "desk days: ",
                                        story.sponsoredDays,
                                        "/",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sponsorDays,
                                        " (₦",
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$story$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STORY"].sponsorCost,
                                        " a day)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: [
                                        "white coat: ",
                                        story.doctorDay > 0 ? `worn since day ${story.doctorDay}` : coat > 0 ? `sewing — lands day ${coat}` : 'not yet earned'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                            lineNumber: 119,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/story-app.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(StoryApp, "e+wNS2TWfU0JtIHbhqjeiUO0LSo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = StoryApp;
var _c;
__turbopack_context__.k.register(_c, "StoryApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/whot-engine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * M21 — THE WHOT ENGINE (pure, headless — no React, no store, no DOM)
 * -------------------------------------------------------------------
 * The complete match kernel for the Whot! app: the REAL 54-card pack,
 * the seeded shuffle, the legality law, the turn resolution, the NPC's
 * greedy policy, and the stake law. Tests import this file directly
 * under Bun — it must stay free of any React/DOM/store import.
 *
 * THE PACK (the standard Nigerian Whot deck — exactly 54 cards; 6 and
 * 9 do not exist, and the suits are unequal, which is what makes 54):
 *     circles   1 2 3 4 5 7 8 10 11 12 13 14   (12 cards)
 *     triangles 1 2 3 4 5 7 8 10 11 12 13 14   (12 cards)
 *     squares   1 2 3 5 7 10 11 13 14          ( 9 cards)
 *     crosses   1 2 3 5 7 10 11 13 14          ( 9 cards)
 *     stars     1 2 3 4 5 7 8                  ( 7 cards)
 *     five "20" Whot cards                      ( 5 cards)
 *
 * THE HOUSE RULESET (stated in the app, one line, exactly what this
 * engine implements): match the call card's suit or number · 1 = skip
 * the next player · 8 = hold on — in a two-man match both mean the
 * same player goes again · 2 = pick two · 5 = pick three (a same-number
 * card defends, and it stacks) · 14 = go to market (the opponent picks
 * 1, you play again) · 20 = Whot — wild, the caller names the suit ·
 * no legal card? pick from the market.
 *
 * DETERMINISM: the shuffle is seeded through mulberry32; the seed comes
 * from (world.day, match counter) via whotSeed(). The RNG state lives
 * inside the match object, so mid-match reshuffles stay deterministic
 * too — the same seed replays the exact same match, proven in tests.
 *
 * THE STAKE LAW: the table stake is ₦200, winner takes 2× (paid by the
 * COMPONENT through the store's removeMoney/addMoney — no money moves
 * here). The kid wall is structural: AGE_LAW says a child plays for
 * joy, so stakeFor('kid') is ₦0 before any door is even looked at.
 */ __turbopack_context__.s([
    "DECK_LAW",
    ()=>DECK_LAW,
    "HAND_SIZE",
    ()=>HAND_SIZE,
    "SUIT_GLYPH",
    ()=>SUIT_GLYPH,
    "SUIT_LABEL",
    ()=>SUIT_LABEL,
    "WHOT_STAKE",
    ()=>WHOT_STAKE,
    "autoTurn",
    ()=>autoTurn,
    "buildDeck",
    ()=>buildDeck,
    "dealMatch",
    ()=>dealMatch,
    "greedyChoose",
    ()=>greedyChoose,
    "legalMoves",
    ()=>legalMoves,
    "npcChoose",
    ()=>npcChoose,
    "npcTurn",
    ()=>npcTurn,
    "pickFromMarket",
    ()=>pickFromMarket,
    "playCard",
    ()=>playCard,
    "rngStep",
    ()=>rngStep,
    "shuffleDeck",
    ()=>shuffleDeck,
    "stakeFor",
    ()=>stakeFor,
    "whotSeed",
    ()=>whotSeed
]);
const WHOT_STAKE = 200;
const DECK_LAW = {
    circle: [
        1,
        2,
        3,
        4,
        5,
        7,
        8,
        10,
        11,
        12,
        13,
        14
    ],
    triangle: [
        1,
        2,
        3,
        4,
        5,
        7,
        8,
        10,
        11,
        12,
        13,
        14
    ],
    square: [
        1,
        2,
        3,
        5,
        7,
        10,
        11,
        13,
        14
    ],
    cross: [
        1,
        2,
        3,
        5,
        7,
        10,
        11,
        13,
        14
    ],
    star: [
        1,
        2,
        3,
        4,
        5,
        7,
        8
    ],
    whots: 5
};
const SUIT_GLYPH = {
    circle: '●',
    triangle: '▲',
    square: '■',
    cross: '✕',
    star: '★',
    whot: '★20'
};
const SUIT_LABEL = {
    circle: 'Circles',
    triangle: 'Triangles',
    square: 'Squares',
    cross: 'Crosses',
    star: 'Stars',
    whot: 'Whot'
};
function buildDeck() {
    const cards = [];
    const suits = [
        'circle',
        'triangle',
        'square',
        'cross',
        'star'
    ];
    for (const suit of suits){
        for (const n of DECK_LAW[suit])cards.push({
            id: `${suit}-${n}`,
            suit,
            n
        });
    }
    for(let i = 0; i < DECK_LAW.whots; i++)cards.push({
        id: `whot-${i + 1}`,
        suit: 'whot',
        n: 20
    });
    return cards;
}
function rngStep(seed) {
    const next = seed + 0x6d2b79f5 | 0;
    let t = next;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return {
        value: ((t ^ t >>> 14) >>> 0) / 4294967296,
        next
    };
}
function whotSeed(day, matchNo) {
    return (Math.imul(day, 0x9e3779b1) ^ Math.imul(matchNo, 0x85ebca6b)) >>> 0;
}
function shuffleDeck(deck, seed) {
    const cards = [
        ...deck
    ];
    let s = seed >>> 0;
    for(let i = cards.length - 1; i > 0; i--){
        const r = rngStep(s);
        s = r.next;
        const j = Math.floor(r.value * (i + 1));
        const tmp = cards[i];
        cards[i] = cards[j];
        cards[j] = tmp;
    }
    return {
        cards,
        seed: s
    };
}
const HAND_SIZE = 6;
/** the action numbers the opener law skips (a match never opens on a debt) */ function isActionCard(c) {
    return c.suit === 'whot' || c.n === 1 || c.n === 2 || c.n === 5 || c.n === 14;
}
/** How many cards actually left the deck (an empty market returns 0 — the note never lies). */ function draw(m, who, count) {
    let taken = 0;
    for(let k = 0; k < count; k++){
        if (m.deck.length === 0) {
            // THE MARKET LAW: market finished — shuffle the played pile (top stays) back in
            if (m.pile.length <= 1) return taken;
            const top = m.pile[m.pile.length - 1];
            const sh = shuffleDeck(m.pile.slice(0, -1), m.rngState);
            m.deck = sh.cards;
            m.rngState = sh.seed;
            m.pile = [
                top
            ];
        }
        const card = m.deck.pop();
        if (!card) return taken;
        m.hands[who].push(card);
        taken++;
    }
    return taken;
}
function dealMatch(seed) {
    const sh = shuffleDeck(buildDeck(), seed);
    const m = {
        deck: sh.cards,
        pile: [],
        hands: {
            you: [],
            npc: []
        },
        turn: 'you',
        activeSuit: 'circle',
        activeN: 1,
        pendingPick: 0,
        pendingKind: 0,
        over: false,
        winner: null,
        rngState: sh.seed,
        note: 'The market dey open — your move.'
    };
    draw(m, 'you', HAND_SIZE);
    draw(m, 'npc', HAND_SIZE);
    // the opener: flip until a plain number card — a 1/2/5/14/20 would
    // start the match with a debt nobody asked for
    const setAside = [];
    let starter = null;
    while(m.deck.length > 0){
        const c = m.deck.pop();
        if (!isActionCard(c)) {
            starter = c;
            break;
        }
        setAside.push(c);
    }
    if (!starter && setAside.length > 0) starter = setAside.shift();
    if (starter) {
        m.pile.push(starter);
        m.activeSuit = starter.suit;
        m.activeN = starter.n;
    }
    for(let i = setAside.length - 1; i >= 0; i--)m.deck.unshift(setAside[i]);
    return m;
}
function legalMoves(m, hand) {
    const out = [];
    for(let i = 0; i < hand.length; i++){
        const c = hand[i];
        if (m.pendingKind > 0) {
            if (c.n === m.pendingKind) out.push(i);
        } else if (c.suit === 'whot' || c.suit === m.activeSuit || c.n === m.activeN) {
            out.push(i);
        }
    }
    return out;
}
function playCard(m, who, index, calledSuit) {
    const hand = m.hands[who];
    const card = hand[index];
    if (m.over || !card) return m;
    if (!legalMoves(m, hand).includes(index)) return m;
    const next = {
        ...m,
        deck: [
            ...m.deck
        ],
        pile: [
            ...m.pile
        ],
        hands: {
            you: [
                ...m.hands.you
            ],
            npc: [
                ...m.hands.npc
            ]
        }
    };
    next.hands[who] = hand.filter((_, i)=>i !== index);
    next.pile.push(card);
    const other = who === 'you' ? 'npc' : 'you';
    const self = who === 'you' ? 'You' : 'Emeka';
    let again = false;
    if (card.suit === 'whot') {
        const call = calledSuit && calledSuit !== 'whot' ? calledSuit : 'circle';
        next.activeSuit = call;
        next.activeN = 20;
        next.turn = other;
        next.pendingPick = 0;
        next.pendingKind = 0;
        next.note = `${self} call${who === 'you' ? '' : 's'} ${SUIT_LABEL[call].toLowerCase()} — follow am or pick.`;
    } else {
        next.activeSuit = card.suit;
        next.activeN = card.n;
        if (card.n === 1 || card.n === 8) {
            again = true;
            next.note = card.n === 1 ? `1 — the next player skips. Two-man match: ${self === 'You' ? 'you go' : 'Emeka goes'} again.` : `8 — hold on: ${self === 'You' ? 'you play' : 'Emeka plays'} again.`;
        } else if (card.n === 14) {
            const took = draw(next, other, 1);
            again = true;
            next.note = `14 — general market: ${other === 'you' ? 'you pick' : 'Emeka picks'} ${took}, then ${who === 'you' ? 'you play' : 'Emeka plays'} again.`;
        } else if (card.n === 2 || card.n === 5) {
            const per = card.n === 2 ? 2 : 3;
            next.pendingPick = m.pendingKind === card.n ? m.pendingPick + per : per;
            next.pendingKind = card.n;
            next.turn = other;
            next.note = `Pick ${next.pendingPick}! ${other === 'you' ? 'You owe the market' : 'Emeka owes the market'} (a ${card.n} defends).`;
        } else {
            next.turn = other;
            next.pendingPick = 0;
            next.pendingKind = 0;
            next.note = `${self} drop${who === 'you' ? '' : 's'} ${SUIT_GLYPH[card.suit]} ${card.n}.`;
        }
    }
    if (again) {
        next.turn = who;
        next.pendingPick = 0;
        next.pendingKind = 0;
    }
    if (next.hands[who].length === 0) {
        next.over = true;
        next.winner = who;
        next.note = who === 'you' ? 'YOU WIN — hand dry!' : 'Emeka wins — hand dry.';
    }
    return next;
}
function pickFromMarket(m) {
    if (m.over) return m;
    const who = m.turn;
    const next = {
        ...m,
        deck: [
            ...m.deck
        ],
        pile: [
            ...m.pile
        ],
        hands: {
            you: [
                ...m.hands.you
            ],
            npc: [
                ...m.hands.npc
            ]
        }
    };
    const count = m.pendingPick > 0 ? m.pendingPick : 1;
    const took = draw(next, who, count);
    next.pendingPick = 0;
    next.pendingKind = 0;
    next.turn = who === 'you' ? 'npc' : 'you';
    next.note = `${who === 'you' ? 'You pick' : 'Emeka picks'} ${took} from the market${took === 0 ? ' — market don finish' : ''}.`;
    return next;
}
function stakeFor(band, cash) {
    if (band === 'kid') return 0;
    return cash >= WHOT_STAKE ? WHOT_STAKE : 0;
}
function greedyChoose(m, who) {
    const hand = m.hands[who];
    const legal = legalMoves(m, hand);
    if (legal.length === 0) return {
        kind: 'pick'
    };
    const scored = legal.map((i)=>{
        const c = hand[i];
        return {
            i,
            w: c.suit === 'whot' ? -1 : c.n
        };
    }).sort((a, b)=>b.w - a.w);
    const best = scored[0];
    const card = hand[best.i];
    if (card.suit === 'whot') {
        // call the suit the player holds most of (ties → the law's fixed order)
        const held = {
            circle: 0,
            triangle: 0,
            square: 0,
            cross: 0,
            star: 0
        };
        for (const c of hand)if (c.suit !== 'whot') held[c.suit]++;
        const order = [
            'circle',
            'triangle',
            'square',
            'cross',
            'star'
        ];
        let call = 'circle';
        let bestN = -1;
        for (const s of order){
            if (held[s] > bestN) {
                bestN = held[s];
                call = s;
            }
        }
        return {
            kind: 'play',
            index: best.i,
            call
        };
    }
    return {
        kind: 'play',
        index: best.i
    };
}
function npcChoose(m) {
    return greedyChoose(m, 'npc');
}
function npcTurn(m) {
    if (m.over || m.turn !== 'npc') return m;
    const choice = npcChoose(m);
    if (choice.kind === 'pick') return pickFromMarket(m);
    return playCard(m, 'npc', choice.index, choice.call);
}
function autoTurn(m) {
    if (m.over) return m;
    const choice = greedyChoose(m, m.turn);
    if (choice.kind === 'pick') return pickFromMarket(m);
    return playCard(m, m.turn, choice.index, choice.call);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/whot-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APP_GLYPH",
    ()=>APP_GLYPH,
    "APP_ID",
    ()=>APP_ID,
    "APP_TITLE",
    ()=>APP_TITLE,
    "default",
    ()=>WhotApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * M21 — WHOT! (the flagship: Nigeria's national card game, playable)
 * ------------------------------------------------------------------
 * A full match vs one real NPC (Emeka Dispatch, data/npcs.ts) with the
 * REAL 54-card Whot pack. The pure engine (deck / seeded shuffle /
 * legality / turn resolution / NPC policy / stake law) lives in
 * ./whot-engine.ts — headless, test-importable, no React in it.
 *
 * THE HOUSE RULESET (one line, exactly what the engine implements):
 * match the call card's suit or number · 1 = skip next player · 8 =
 * hold on (two-man match: both mean you go again) · 2 = pick two ·
 * 5 = pick three (a same-number card defends, e dey stack) · 14 = go
 * to market (opponent picks 1, you play again) · 20 = Whot — wild,
 * caller names the suit · no legal card? pick from the market.
 *
 * DETERMINISM: the shuffle is seeded by (world.day, match counter)
 * through mulberry32 — the same day and match number rebuild the exact
 * same shuffle, proven in scripts/test-m21-apps.ts. The RNG state
 * lives inside the match object, so reshuffles stay deterministic too.
 *
 * THE ECONOMY IS REAL: the stake (₦200 default) is paid through the
 * store's own removeMoney door (category 'fun' — the same door the
 * night out uses) and a win pays the pot (2× stake) through addMoney
 * exactly once, the same honest channel gigs and quests pay through.
 * THE KID WALL IS STRUCTURAL: AGE_LAW says a child plays for joy —
 * the kid path returns stake 0 and the money doors are never touched.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/phone/apps/whot-engine.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const APP_ID = 'whot';
const APP_TITLE = 'Whot!';
const APP_GLYPH = '🃏';
/* ============================== the component ============================= */ const NPC = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPC_BY_ID"]['emeka'];
const NPC_NAME = NPC?.name ?? 'Emeka';
function cardLabel(c) {
    return c.suit === 'whot' ? 'WHOT 20' : `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUIT_GLYPH"][c.suit]} ${c.n}`;
}
function WhotApp() {
    _s();
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WhotApp.useGameStore[player]": (s)=>s.player
    }["WhotApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WhotApp.useGameStore[world]": (s)=>s.world
    }["WhotApp.useGameStore[world]"]);
    const addMoney = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WhotApp.useGameStore[addMoney]": (s)=>s.addMoney
    }["WhotApp.useGameStore[addMoney]"]);
    const removeMoney = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WhotApp.useGameStore[removeMoney]": (s)=>s.removeMoney
    }["WhotApp.useGameStore[removeMoney]"]);
    const [dealt, setDealt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [match, setMatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stakePaid, setStakePaid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [awaitCall, setAwaitCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const paidRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // the NPC's move (and the hold-on chains) resolve off the render pass
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WhotApp.useEffect": ()=>{
            if (!match || match.over || match.turn !== 'npc') return;
            const t = setTimeout({
                "WhotApp.useEffect.t": ()=>setMatch({
                        "WhotApp.useEffect.t": (m)=>m && !m.over && m.turn === 'npc' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["npcTurn"])(m) : m
                    }["WhotApp.useEffect.t"])
            }["WhotApp.useEffect.t"], 600);
            return ({
                "WhotApp.useEffect": ()=>clearTimeout(t)
            })["WhotApp.useEffect"];
        }
    }["WhotApp.useEffect"], [
        match
    ]);
    // THE POT — the winner takes 2× stake through the store's own door, once.
    // (External-system write only — the banner derives the pot from stakePaid,
    // so no setState ever runs inside this effect.)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WhotApp.useEffect": ()=>{
            if (!match?.over || match.winner !== 'you') return;
            if (paidRef.current || stakePaid <= 0) return;
            paidRef.current = true;
            addMoney(stakePaid * 2, {
                label: `Whot pot — match #${dealt} vs ${NPC_NAME}`,
                category: 'fun'
            });
        }
    }["WhotApp.useEffect"], [
        match,
        stakePaid,
        dealt,
        addMoney
    ]);
    if (!player || !world) return null;
    // THE KID WALL (structural): the Age Law through stakeFor — a child
    // plays for joy, ₦0, and the wallet door is never touched on the kid
    // path. A pocket that cannot carry the stake plays free too — honestly
    // labelled, never blocked.
    const stake = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stakeFor"])(player.ageBand, player.cash);
    const stakeWhy = player.ageBand === 'kid' ? 'kids play for fun — the Age Law keeps money out' : 'your pocket no carry ₦200 today — fun only';
    const startMatch = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        const n = dealt + 1;
        paidRef.current = false;
        setAwaitCall(false);
        if (stake > 0) {
            const ok = removeMoney(stake, {
                label: `Whot stake — match #${n} vs ${NPC_NAME}`,
                category: 'fun'
            });
            setStakePaid(ok ? stake : 0);
        } else {
            setStakePaid(0);
        }
        setDealt(n);
        setMatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dealMatch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["whotSeed"])(world.day, n)));
    };
    const legal = match && !match.over && match.turn === 'you' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["legalMoves"])(match, match.hands.you) : [];
    const top = match && match.pile.length > 0 ? match.pile[match.pile.length - 1] : null;
    const onPlay = (i)=>{
        if (!match || match.over || match.turn !== 'you' || awaitCall) return;
        const c = match.hands.you[i];
        if (!legal.includes(i)) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        if (c.suit === 'whot') {
            setAwaitCall(true); // hold the play until the suit is named
            return;
        }
        setMatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["playCard"])(match, 'you', i));
    };
    const onCall = (s)=>{
        if (!match) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        setAwaitCall(false);
        const idx = match.hands.you.findIndex((c)=>c.suit === 'whot' && legal.includes(match.hands.you.indexOf(c)));
        if (idx < 0) return;
        setMatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["playCard"])(match, 'you', idx, s));
    };
    const onPick = ()=>{
        if (!match || match.over || match.turn !== 'you' || awaitCall) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
        setMatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickFromMarket"])(match));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        "aria-label": `${APP_TITLE} app`,
        "data-testid": "whot-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-2 pt-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-[15px] font-black text-[var(--lko-ink)]",
                        children: [
                            "Whot! vs ",
                            NPC_NAME
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            "54-card pack · winner takes the pot (2× ",
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WHOT_STAKE"]),
                            ")",
                            stake === 0 ? ` · today na ₦0 — ${stakeWhy}` : ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 space-y-2 overflow-y-auto px-4 pb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                children: "House Rules"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                "data-testid": "whot-rules",
                                children: "Match the call card's suit or number · 1 = skip next player · 8 = hold on (two-man match: both mean you go again) · 2 = pick two · 5 = pick three (a same-number card defends, e dey stack) · 14 = go to market (opponent picks 1, you play again) · 20 = Whot — wild, caller names the suit · no legal card? Pick from the market."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        "data-testid": "whot-table",
                        children: !match ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] font-extrabold text-[var(--lko-ink)]",
                                    children: "The table dey set"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                    lineNumber: 182,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-0.5 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                    children: stake > 0 ? `Stake ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(stake)} — winner takes ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(stake * 2)}. The stake pays through the wallet when you deal.` : `Free match — ${stakeWhy}.`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                    lineNumber: 183,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    "data-testid": "whot-deal",
                                    className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[10.5px] font-black text-white",
                                    onClick: startMatch,
                                    children: [
                                        "DEAL — match #",
                                        dealt + 1,
                                        " · day ",
                                        world.day
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                    lineNumber: 188,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10.5px] font-extrabold text-[var(--lko-ink)]",
                                            children: [
                                                NPC?.emoji ?? '🏍️',
                                                " ",
                                                NPC_NAME
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 201,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                            "data-testid": "whot-npc-count",
                                            children: [
                                                match.hands.npc.length,
                                                " card",
                                                match.hands.npc.length === 1 ? '' : 's',
                                                " in hand"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 204,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                    lineNumber: 200,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 flex items-center justify-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-xl border border-black/[0.08] bg-[var(--lko-green-soft)] px-4 py-3 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[8.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                                    children: "call card"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[18px] font-black leading-tight text-[var(--lko-ink)]",
                                                    "data-testid": "whot-call-card",
                                                    children: top ? cardLabel(top) : '—'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 19
                                                }, this),
                                                match.activeN === 20 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[8.5px] font-black text-[var(--lko-terra)]",
                                                    "data-testid": "whot-active-suit",
                                                    children: [
                                                        "called: ",
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUIT_LABEL"][match.activeSuit]
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 211,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[9px] font-bold text-[var(--lko-ink-soft)]",
                                            children: [
                                                "market: ",
                                                match.deck.length,
                                                match.pendingPick > 0 && match.turn === 'you' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-black text-red-700",
                                                    "data-testid": "whot-debt",
                                                    children: [
                                                        "YOU OWE ",
                                                        match.pendingPick,
                                                        " — a ",
                                                        match.pendingKind,
                                                        " defends"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 21
                                                }, this),
                                                match.pendingPick > 0 && match.turn === 'npc' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-black text-[var(--lko-terra)]",
                                                    children: [
                                                        NPC_NAME,
                                                        " owes ",
                                                        match.pendingPick
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 227,
                                                    columnNumber: 69
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 border-t border-black/[0.05] pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-extrabold text-[var(--lko-ink)]",
                                                    children: [
                                                        "Your hand (",
                                                        match.hands.you.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 19
                                                }, this),
                                                match.turn === 'you' && !match.over && !awaitCall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    "data-testid": "whot-pick",
                                                    className: "lko-press rounded-lg bg-black/[0.06] px-2.5 py-1 text-[9.5px] font-black text-[var(--lko-ink)]",
                                                    onClick: onPick,
                                                    children: [
                                                        "PICK ",
                                                        match.pendingPick > 0 ? match.pendingPick : 1
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 233,
                                            columnNumber: 17
                                        }, this),
                                        match.over ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-[12px] font-black",
                                            "data-testid": "whot-result",
                                            children: match.winner === 'you' ? stakePaid > 0 ? `🏆 YOU WIN — the pot pays ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(stakePaid * 2)}` : '🏆 YOU WIN — free match, the bragging is the pot' : `😔 ${NPC_NAME} wins — ${stakePaid > 0 ? `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(stakePaid)} stake don go` : 'free match, no money moved'}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 247,
                                            columnNumber: 19
                                        }, this) : awaitCall ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-extrabold text-[var(--lko-ink)]",
                                                    children: "CALL THE SUIT:"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 grid grid-cols-5 gap-1",
                                                    children: [
                                                        'circle',
                                                        'triangle',
                                                        'square',
                                                        'cross',
                                                        'star'
                                                    ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            "data-testid": `whot-call-${s}`,
                                                            className: "lko-press rounded-lg bg-[var(--lko-gold-deep)] px-1 py-1.5 text-[10px] font-black text-white",
                                                            onClick: ()=>onCall(s),
                                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUIT_GLYPH"][s]
                                                        }, s, false, {
                                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                            lineNumber: 259,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 255,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-1.5 flex flex-wrap gap-1.5",
                                            "data-testid": "whot-hand",
                                            children: match.hands.you.map((c, i)=>{
                                                const canPlay = legal.includes(i);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    "data-testid": `whot-card-${c.id}`,
                                                    className: `rounded-lg border px-2 py-2 text-[10px] font-black ${canPlay ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)] text-[var(--lko-ink)] lko-press' : 'border-black/[0.06] bg-black/[0.03] text-[var(--lko-ink-soft)] opacity-60'}`,
                                                    onClick: ()=>onPlay(i),
                                                    children: cardLabel(c)
                                                }, c.id, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 272,
                                            columnNumber: 19
                                        }, this),
                                        match.note && !match.over && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1.5 text-[9.5px] font-semibold text-[var(--lko-ink-soft)]",
                                            "data-testid": "whot-note",
                                            children: match.note
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 290,
                                            columnNumber: 19
                                        }, this),
                                        !match.over && match.turn === 'npc' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-1 text-[9.5px] font-bold text-[var(--lko-terra)]",
                                            children: [
                                                NPC_NAME,
                                                " dey think…"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 293,
                                            columnNumber: 19
                                        }, this),
                                        match.over && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            "data-testid": "whot-again",
                                            className: "lko-press mt-2 w-full rounded-xl bg-[var(--lko-green)] px-3 py-2 text-[10px] font-black text-white",
                                            onClick: startMatch,
                                            children: [
                                                "PLAY AGAIN — match #",
                                                dealt + 1
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                            lineNumber: 296,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                    lineNumber: 232,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.06] bg-white p-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[13px] font-extrabold text-[var(--lko-ink)]",
                                children: "The Book"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                lineNumber: 312,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 space-y-0.5 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "stake: ",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(stake),
                                            " ",
                                            stake > 0 ? `(pot ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$phone$2f$apps$2f$whot$2d$engine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WHOT_STAKE"] * 2)})` : '— fun only',
                                            " · matches dealt: ",
                                            dealt
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                        lineNumber: 314,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "deck law: circles 12 · triangles 12 · squares 9 · crosses 9 · stars 7 · whots 5 = 54 (no 6, no 9 — na Whot law)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                        lineNumber: 315,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "shuffle seed: day ",
                                            world.day,
                                            " × match — same day, same match, same shuffle. Determinism na law."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                        lineNumber: 316,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                                lineNumber: 313,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                        lineNumber: 311,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
                lineNumber: 166,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/whot-app.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}
_s(WhotApp, "3MUoCt5qjwP6IDKR2b8mv0GpgaU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"]
    ];
});
_c = WhotApp;
var _c;
__turbopack_context__.k.register(_c, "WhotApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/messages-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessagesApp",
    ()=>MessagesApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — M24-UI: MESSAGES (the nation wire + honest DMs)
 * --------------------------------------------------------------
 * Two channels, two truths, both labeled:
 *  - THE NATION WIRE: the REAL relay (kind chat/emote on channel global).
 *    W4: the LIVE SOCKET carries it now — sub-second through the
 *    nation-wire service — and the honest ~12s relay heartbeat stays as
 *    the DEGRADED fallback lane (nothing thrown away). The face labels
 *    which lane is speaking, always.
 *    Session-scoped buffer: the wire shows what flies while you watch.
 *  - THE DMs: person-to-person threads from the social store — honest
 *    DEVICE truth, and when both paddies stand on the live wire the
 *    words ALSO fly sub-second through the wire door (labeled per thread).
 *
 * THE TIER LAW rides at the mic exactly like LiveApp: a kid's keyboard
 * IS the emote grid; teens feel the word wall; adults lose their links
 * before the relay ever sees them. The BLOCK law: a blocked handle
 * cannot be dialed, friended, or messaged — the composer says why.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/social-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/live.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/socialnet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/remotenet.ts [app-client] (ecmascript)");
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
/** session-scoped accumulation of the nation's chat wire (the relay sends deltas) */ const wireBuffer = [];
let wireHighSeq = 0;
const WIRE_CAP = 120;
/** module-scope DM dedupe — survives StrictMode's dev double-mount, so one
 * wire DM lands exactly once no matter how many times effects re-run */ const dmSeenSeq = new Set();
/** W5 — DM history fetch: one fetch per thread per session (idempotent,
 * StrictMode-proof); the server's LiveEvent rows are the thread's truth. */ const historyLoaded = new Set();
function absorbWire(events, me) {
    let fresh = 0;
    for (const e of events){
        if (e.seq <= wireHighSeq) continue;
        wireHighSeq = e.seq;
        if (e.channel && e.channel !== 'global') continue;
        if (e.kind === 'chat') {
            const text = typeof e.payload?.text === 'string' ? e.payload.text : '';
            if (!text) continue;
            wireBuffer.push({
                key: `w${e.seq}`,
                actor: e.actor,
                text,
                ts: Date.now()
            });
            if (e.actor !== me) fresh++;
        } else if (e.kind === 'emote') {
            const glyph = typeof e.payload?.glyph === 'string' ? e.payload.glyph : '✨';
            const phrase = typeof e.payload?.phrase === 'string' ? e.payload.phrase : '';
            wireBuffer.push({
                key: `w${e.seq}`,
                actor: e.actor,
                text: phrase,
                glyph,
                ts: Date.now()
            });
            if (e.actor !== me) fresh++;
        }
    }
    if (wireBuffer.length > WIRE_CAP) wireBuffer.splice(0, wireBuffer.length - WIRE_CAP);
    return fresh;
}
function MessagesApp({ openDm, onOpenDmChange }) {
    _s();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('wire');
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wireTick, forceTick] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // THE DEEP-LINK LAW (render-phase derivation, React's blessed pattern — no
    // effect, no loop): when Connect hands us a handle, the thread OPENS —
    // tapping Message on a paddy must never land on the wrong tab.
    const [lastLinked, setLastLinked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    if (openDm !== lastLinked) {
        setLastLinked(openDm);
        if (openDm) setTab('dms');
    }
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MessagesApp.useGameStore[account]": (s)=>s.account
    }["MessagesApp.useGameStore[account]"]);
    const live = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MessagesApp.useGameStore[live]": (s)=>s.live
    }["MessagesApp.useGameStore[live]"]);
    const wire = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MessagesApp.useGameStore[wire]": (s)=>s.liveWire
    }["MessagesApp.useGameStore[wire]"]);
    const liveSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MessagesApp.useGameStore[liveSync]": (s)=>s.liveSync
    }["MessagesApp.useGameStore[liveSync]"]);
    const liveSendChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MessagesApp.useGameStore[liveSendChat]": (s)=>s.liveSendChat
    }["MessagesApp.useGameStore[liveSendChat]"]);
    const liveSendEmote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "MessagesApp.useGameStore[liveSendEmote]": (s)=>s.liveSendEmote
    }["MessagesApp.useGameStore[liveSendEmote]"]);
    // THE WIRE — the live socket lane (W4)
    const wireState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "MessagesApp.useWireStore[wireState]": (s)=>s.state
    }["MessagesApp.useWireStore[wireState]"]);
    const wireFeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "MessagesApp.useWireStore[wireFeed]": (s)=>s.feed
    }["MessagesApp.useWireStore[wireFeed]"]);
    const wireLive = wireState === 'live';
    const friends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[friends]": (s)=>s.friends
    }["MessagesApp.useSocialStore[friends]"]);
    const blocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[blocked]": (s)=>s.blocked
    }["MessagesApp.useSocialStore[blocked]"]);
    const dms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[dms]": (s)=>s.dms
    }["MessagesApp.useSocialStore[dms]"]);
    const unread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[unread]": (s)=>s.unread
    }["MessagesApp.useSocialStore[unread]"]);
    const sendDm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[sendDm]": (s)=>s.sendDm
    }["MessagesApp.useSocialStore[sendDm]"]);
    const receiveDm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[receiveDm]": (s)=>s.receiveDm
    }["MessagesApp.useSocialStore[receiveDm]"]);
    const receiveHangout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[receiveHangout]": (s)=>s.receiveHangout
    }["MessagesApp.useSocialStore[receiveHangout]"]);
    const absorbServerDms = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[absorbServerDms]": (s)=>s.absorbServerDms
    }["MessagesApp.useSocialStore[absorbServerDms]"]);
    const markDmRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "MessagesApp.useSocialStore[markDmRead]": (s)=>s.markDmRead
    }["MessagesApp.useSocialStore[markDmRead]"]);
    const claimed = account.linked && !!account.token;
    const band = account.ageBand ?? 'adult';
    const me = account.handle;
    // THE DEMO DOOR (e2e/dev only, honestly labeled): receiveDm so the thread
    // UI is witnessable headless. Never runs for a real player's session.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesApp.useEffect": ()=>{
            const w = window;
            w.__lkl = {
                ...w.__lkl,
                socialReceiveDm: ({
                    "MessagesApp.useEffect": (handle, text)=>receiveDm(handle, text)
                })["MessagesApp.useEffect"]
            };
        }
    }["MessagesApp.useEffect"], [
        receiveDm
    ]);
    // deep-link: Connect opens a thread through the controlled openDm prop —
    // no effect, no render-phase setState (the house deep-link law).
    // THE WIRE LANE — connect once, refresh presence, re-handshake on token rotation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesApp.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireEnsure"])({
                "MessagesApp.useEffect": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.token ?? null
            }["MessagesApp.useEffect"], {
                "MessagesApp.useEffect": ()=>({
                        street: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().world?.currentLocation ?? 'home',
                        status: 'hustling'
                    })
            }["MessagesApp.useEffect"]);
            // W2 — the bodies' lanes (idempotent): the join law needs the where door
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["remoteNetInit"])();
        }
    }["MessagesApp.useEffect"], [
        claimed,
        account.token
    ]);
    // the same 12s heartbeat the whole nation rides — THE DEGRADED LANE:
    // when the live socket carries the wire, the polling stands down (N5)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesApp.useEffect": ()=>{
            if (!claimed || tab !== 'wire' || wireLive) return;
            let alive = true;
            const beat = {
                "MessagesApp.useEffect.beat": async ()=>{
                    const res = await liveSync();
                    if (!alive) return;
                    if (res.ok) forceTick({
                        "MessagesApp.useEffect.beat": (n)=>n + 1
                    }["MessagesApp.useEffect.beat"]);
                }
            }["MessagesApp.useEffect.beat"];
            const t0 = setTimeout({
                "MessagesApp.useEffect.t0": ()=>{
                    void beat();
                }
            }["MessagesApp.useEffect.t0"], 0);
            const t = setInterval({
                "MessagesApp.useEffect.t": ()=>{
                    void beat();
                }
            }["MessagesApp.useEffect.t"], 12_000);
            return ({
                "MessagesApp.useEffect": ()=>{
                    alive = false;
                    clearTimeout(t0);
                    clearInterval(t);
                }
            })["MessagesApp.useEffect"];
        }
    }["MessagesApp.useEffect"], [
        claimed,
        tab,
        liveSync,
        wireLive
    ]);
    // absorb whatever the last sync carried (the relay lane)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesApp.useEffect": ()=>{
            if (wire?.events?.length) absorbWire(wire.events, me ?? '');
        }
    }["MessagesApp.useEffect"], [
        wire,
        me
    ]);
    // absorb whatever the LIVE SOCKET carried (the fast lane) + live DM/hangout
    // delivery. No setState here — the wireFeed subscription itself is the
    // render driver; the rows memo below re-derives on every feed change
    // (absorbWire is seq-deduped, so re-running it is always harmless).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesApp.useEffect": ()=>{
            if (!wireFeed.length) return;
            for (const e of wireFeed){
                if (e.actor === me) continue;
                if (e.kind === 'dm' && e.payload?.to === me && !dmSeenSeq.has(e.seq)) {
                    dmSeenSeq.add(e.seq);
                    receiveDm(e.actor, typeof e.payload.text === 'string' ? e.payload.text : '');
                } else if (e.kind === 'hangout' && e.payload?.to === me && !dmSeenSeq.has(e.seq)) {
                    // W5 — the hangout postcard renders LIVE in the open thread
                    dmSeenSeq.add(e.seq);
                    receiveHangout(e.actor, typeof e.payload.street === 'string' ? e.payload.street : 'home');
                }
            }
        }
    }["MessagesApp.useEffect"], [
        wireFeed,
        me,
        receiveDm,
        receiveHangout
    ]);
    // join the DM room when a thread opens — both online paddies receive live
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesApp.useEffect": ()=>{
            if (openDm && wireLive) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireOpenDm"])(openDm);
        }
    }["MessagesApp.useEffect"], [
        openDm,
        wireLive
    ]);
    // W5 — THE HISTORY LAW: opening a thread pulls the SERVER rows (the ONE
    // LiveEvent table) once per session. The device copy stays; overlaps die
    // on the 60s window dedupe inside absorbServerDms' caller below.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesApp.useEffect": ()=>{
            if (!openDm || !claimed || historyLoaded.has(openDm)) return;
            historyLoaded.add(openDm);
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetDms"])(openDm).then({
                "MessagesApp.useEffect": (res)=>{
                    if (!res.ok || !res.events?.length) return;
                    const existing = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"].getState().dms[openDm] ?? [];
                    const fresh = res.events.filter({
                        "MessagesApp.useEffect.fresh": (r)=>{
                            // dedupe: a wire-delivered word already has a device row — same side,
                            // same text, inside a 60s window means the SAME word. Hangout rows
                            // compare by their shaped text ('wan hangout for <street>').
                            const expected = r.kind === 'hangout' ? `wan hangout for ${typeof r.payload?.street === 'string' ? r.payload.street : 'home'}` : typeof r.payload?.text === 'string' ? r.payload.text : '';
                            return !existing.some({
                                "MessagesApp.useEffect.fresh": (m)=>m.text === expected && (r.actor === me ? m.from === 'me' : m.from === r.actor) && Math.abs(('ts' in r ? Number(r.ts) : Date.now()) - m.ts) < 60_000
                            }["MessagesApp.useEffect.fresh"]);
                        }
                    }["MessagesApp.useEffect.fresh"]);
                    absorbServerDms(openDm, fresh.map({
                        "MessagesApp.useEffect": (r)=>({
                                ...r,
                                actor: r.actor === me ? 'me' : r.actor
                            })
                    }["MessagesApp.useEffect"]));
                }
            }["MessagesApp.useEffect"]);
        }
    }["MessagesApp.useEffect"], [
        openDm,
        claimed,
        me,
        absorbServerDms
    ]);
    const wireRows = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MessagesApp.useMemo[wireRows]": ()=>{
            if (wireFeed.length) absorbWire(wireFeed, me ?? '');
            return [
                ...wireBuffer
            ].reverse();
        }
    }["MessagesApp.useMemo[wireRows]"], [
        wireFeed,
        wire,
        me,
        wireTick
    ]);
    const dmHandles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MessagesApp.useMemo[dmHandles]": ()=>{
            const set = new Set([
                ...friends,
                ...Object.keys(dms)
            ]);
            return [
                ...set
            ].filter({
                "MessagesApp.useMemo[dmHandles]": (h)=>!blocked.includes(h)
            }["MessagesApp.useMemo[dmHandles]"]);
        }
    }["MessagesApp.useMemo[dmHandles]"], [
        friends,
        dms,
        blocked
    ]);
    const identity = {
        handle: me || null,
        band
    };
    const verdict = claimed && tab === 'wire' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeChat"])(identity, draft) : {
        ok: true,
        text: draft
    };
    const sendWire = async ()=>{
        const check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sanitizeChat"])(identity, draft);
        if (!check.ok) {
            setNotice(WHY_LABEL[check.why ?? ''] ?? 'The mic no gree — check am.');
            return;
        }
        // THE LANE LAW: the live socket when it lives, the honest relay when it doesn't
        const res = wireLive ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireSendChat"])(draft, 'global') : await liveSendChat(draft, 'global');
        if (!res.ok) {
            setNotice(WHY_LABEL[res.why ?? ''] ?? (wireLive ? 'The wire no gree — try again.' : 'The relay no gree — try again.'));
            return;
        }
        setDraft('');
        setNotice(null);
    };
    const sendEmote = async (id)=>{
        const res = wireLive ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireSendEmote"])(id, 'global') : await liveSendEmote(id, 'global');
        if (!res.ok) setNotice(WHY_LABEL[res.why ?? ''] ?? 'Emote no fly.');
    };
    if (!claimed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center px-4 py-10 text-center",
            "data-testid": "messages-locked",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--lko-green-soft)] text-2xl",
                    "aria-hidden": true,
                    children: "💬"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 239,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "lko-display mt-3 text-[15px]",
                    children: "The nation wire dey wait for your name."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-xs font-semibold leading-relaxed text-[var(--lko-ink-soft)]",
                    children: "Claim your handle first — after that, the whole city fit hear you."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 241,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
            lineNumber: 238,
            columnNumber: 7
        }, this);
    }
    /* ---------------------------- the DM thread view ---------------------------- */ if (tab === 'dms' && openDm) {
        const thread = dms[openDm] ?? [];
        const isBlocked = blocked.includes(openDm);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-2",
            "data-testid": "messages-thread",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>{
                        onOpenDmChange(null);
                    },
                    className: "lko-press flex items-center gap-1.5 self-start rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                    children: "← All chats"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 254,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[13px] font-extrabold",
                            children: [
                                "@",
                                openDm
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": "messages-invite",
                                    onClick: async ()=>{
                                        const street = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().world?.currentLocation ?? 'home';
                                        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireSendInvite"])(openDm, street);
                                        setNotice(res.ok ? `🎮 Hangout invite fly reach @${openDm}.` : res.why === 'wire-down' ? 'The wire dey down — invites need the live wire.' : res.why === 'paddies-only' ? 'Minors invite paddies only — na the law.' : 'The invite no gree.');
                                    },
                                    className: "lko-press rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-gold-deep)]",
                                    children: "🎮 Invite"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded-full bg-[var(--lko-gold-soft)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]",
                                    children: [
                                        "on this device",
                                        wireLive ? ' + live wire' : ''
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                            lineNumber: 262,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex max-h-[300px] min-h-[160px] flex-col gap-1.5 overflow-y-auto rounded-2xl bg-white/70 p-2.5",
                    children: [
                        thread.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "py-6 text-center text-[11.5px] font-semibold text-[var(--lko-ink-soft)]",
                            children: "The thread dey quiet. Talk first."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                            lineNumber: 281,
                            columnNumber: 13
                        }, this),
                        thread.map((m)=>m.kind === 'hangout' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `max-w-[90%] rounded-2xl px-3 py-2 ${m.from === 'me' ? 'self-end bg-[var(--lko-green)]/90 text-white' : 'self-start border border-[var(--lko-gold)]/30 bg-[var(--lko-gold-soft)]'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[12px] font-extrabold",
                                        children: [
                                            "🎮 ",
                                            m.from === 'me' ? 'You wan hangout' : `@${m.from} wan hangout`,
                                            " — ",
                                            m.street
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 288,
                                        columnNumber: 17
                                    }, this),
                                    m.from !== 'me' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": "messages-join",
                                        onClick: async ()=>{
                                            // THE W2 JOIN LAW: if the paddy STANDS on the wire right
                                            // now, the where door teleports my body beside theirs —
                                            // real co-presence, no ferry. A paddy who is not around
                                            // keeps the honest journey (the ferry door rules the
                                            // water — fare, energy; dry roads stay waka).
                                            const j = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$remotenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["remoteJoin"])(openDm);
                                            if (j.ok) {
                                                setNotice(`🎮 You don land beside @${j.displayName ?? openDm} for ${j.street}.`);
                                            } else if (j.why === 'not-around') {
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().takeFerry(m.street ?? '');
                                            } else if (j.why === 'paddies-only') {
                                                setNotice('Minors waka reach accepted paddies only — na the law.');
                                            } else if (j.why === 'blocked') {
                                                setNotice('The block wall stand — no join dey pass am.');
                                            } else if (j.why === 'guest-mic-dark') {
                                                setNotice('Claim your name first — the join na for citizens.');
                                            } else {
                                                setNotice('The join no gree — check the wire.');
                                            }
                                        },
                                        className: "lko-press mt-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-extrabold text-[var(--lko-gold-deep)]",
                                        children: "Waka go meet dem"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 290,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `mt-0.5 text-right text-[8.5px] font-bold ${m.from === 'me' ? 'text-white/70' : 'text-[var(--lko-ink-soft)]'}`,
                                        children: new Date(m.ts).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 318,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, m.id, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 287,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `max-w-[85%] rounded-2xl px-3 py-1.5 ${m.from === 'me' ? 'self-end bg-[var(--lko-green)] text-white' : 'self-start bg-black/[0.05]'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[12px] font-semibold leading-snug break-words",
                                        children: m.text
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 324,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `mt-0.5 text-right text-[8.5px] font-bold ${m.from === 'me' ? 'text-white/70' : 'text-[var(--lko-ink-soft)]'}`,
                                        children: new Date(m.ts).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 325,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, m.id, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 323,
                                columnNumber: 15
                            }, this))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 279,
                    columnNumber: 9
                }, this),
                isBlocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "rounded-xl bg-[#fdecea] px-3 py-2 text-[11px] font-bold text-[#a63d33]",
                    children: [
                        "You block @",
                        openDm,
                        " — the mic dey off for am. Unblock for Connect first."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 333,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            "data-testid": "messages-dm-input",
                            value: draft,
                            onChange: (e)=>setDraft(e.target.value),
                            maxLength: 280,
                            placeholder: `Talk to @${openDm}…`,
                            className: "min-w-0 flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                            lineNumber: 338,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": "messages-dm-send",
                            onClick: async ()=>{
                                if (!draft.trim()) {
                                    setNotice('Empty message no dey fly.');
                                    return;
                                }
                                const text = draft;
                                // THE LANE LAW FOR DMs (W5): the server doors rule the words —
                                // live wire first, the relay 'dm' door when it's down; only a
                                // FULLY offline nation keeps the words as device truth alone.
                                const res = wireLive ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireSendDm"])(openDm, text) : await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().liveAction('dm', {
                                    to: openDm,
                                    text
                                });
                                const laneDown = !wireLive && (res.why === 'offline' || res.why === 'unclaimed' || res.why === 'relay no gree');
                                if (res.ok || laneDown) {
                                    const r = sendDm(openDm, text);
                                    if (r.ok) setDraft('');
                                    setNotice(res.ok ? null : laneDown ? 'Both lanes down — the word wait on this device.' : null);
                                } else {
                                    setNotice(res.why === 'blocked' ? `@${openDm} block you — the mic dey dark.` : res.why === 'paddies-only' ? 'Minors DM paddies only — add dem for Connect first.' : res.why === 'no-such-paddy' ? 'Nobody claim that name.' : 'The door no gree — check the word.');
                                }
                            },
                            className: "lko-press rounded-xl bg-[var(--lko-green)] px-4 py-2 text-[12px] font-extrabold text-white",
                            children: "Send"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                            lineNumber: 346,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 337,
                    columnNumber: 11
                }, this),
                notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-1 text-[10.5px] font-bold text-[var(--lko-terra)]",
                    children: notice
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                    lineNumber: 378,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
            lineNumber: 253,
            columnNumber: 7
        }, this);
    }
    /* ------------------------------ the tab bodies ------------------------------ */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-1 rounded-xl bg-black/[0.05] p-1",
                children: [
                    [
                        'wire',
                        '🌍 Nation wire'
                    ],
                    [
                        'dms',
                        `💬 DMs${dmHandles.length ? ` (${dmHandles.length})` : ''}`
                    ]
                ].map(([k, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(k),
                        className: `lko-press rounded-lg px-2 py-1.5 text-[11.5px] font-extrabold ${tab === k ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`,
                        children: label
                    }, k, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                        lineNumber: 388,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this),
            tab === 'wire' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "messages-wire",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 pb-1 text-[10px] font-bold text-[var(--lko-ink-soft)]",
                        "data-testid": "messages-lane",
                        children: wireLive ? 'Live wire — messages land instant. The ~12s relay stands as fallback.' : 'Relay lane — messages land ~12s. The live wire takes over when it connects.'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                        lineNumber: 400,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex max-h-[300px] min-h-[180px] flex-col gap-1.5 overflow-y-auto rounded-2xl bg-white/70 p-2.5",
                        children: [
                            wireRows.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "py-6 text-center text-[11.5px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "The wire dey quiet now — talk make the city hear you."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 407,
                                columnNumber: 15
                            }, this),
                            wireRows.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `max-w-[85%] rounded-2xl px-3 py-1.5 ${r.actor === me ? 'self-end bg-[var(--lko-green)] text-white' : 'self-start bg-black/[0.05]'}`,
                                    children: [
                                        r.actor !== me && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[9px] font-black uppercase tracking-wide text-[var(--lko-green-deep)]",
                                            children: [
                                                "@",
                                                r.actor
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                            lineNumber: 413,
                                            columnNumber: 36
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[12px] font-semibold leading-snug break-words",
                                            children: [
                                                r.glyph ? `${r.glyph} ` : '',
                                                r.text
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                            lineNumber: 414,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, r.key, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                    lineNumber: 412,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                        lineNumber: 405,
                        columnNumber: 11
                    }, this),
                    band === 'kid' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1 rounded-2xl border border-black/[0.05] bg-white p-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "pb-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                children: "Your words — pick one"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 420,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-4 gap-1.5",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$live$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EMOTE_LIBRARY"].slice(0, 8).map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void sendEmote(e.id),
                                        title: e.phrase,
                                        className: "lko-press rounded-xl bg-black/[0.04] py-2 text-lg",
                                        "aria-label": `Send ${e.phrase}`,
                                        children: e.glyph
                                    }, e.id, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 423,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 421,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                        lineNumber: 419,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 flex gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        "data-testid": "messages-input",
                                        value: draft,
                                        onChange: (e)=>setDraft(e.target.value),
                                        maxLength: band === 'teen' ? 140 : 280,
                                        placeholder: band === 'teen' ? 'Talk (140 max)…' : 'Talk to the city…',
                                        className: "min-w-0 flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 433,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": "messages-send",
                                        onClick: ()=>void sendWire(),
                                        className: "lko-press rounded-xl bg-[var(--lko-green)] px-4 py-2 text-[12px] font-extrabold text-white",
                                        children: "Send"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                        lineNumber: 441,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 432,
                                columnNumber: 15
                            }, this),
                            draft.trim().length > 0 && !verdict.ok && verdict.why && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-1 pt-0.5 text-[10px] font-bold text-[var(--lko-terra)]",
                                children: WHY_LABEL[verdict.why]
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 450,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true),
                    notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 pt-0.5 text-[10.5px] font-bold text-[var(--lko-terra)]",
                        children: notice
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                        lineNumber: 454,
                        columnNumber: 22
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                lineNumber: 399,
                columnNumber: 9
            }, this),
            tab === 'dms' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                "data-testid": "messages-dm-list",
                children: [
                    dmHandles.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center px-4 py-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--lko-green-soft)] text-xl",
                                "aria-hidden": true,
                                children: "🤝"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 462,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-[12px] font-bold",
                                children: "Your paddies go show here."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 463,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-0.5 text-[11px] font-semibold text-[var(--lko-ink-soft)]",
                                children: "Add people for the Connect app — the thread go open itself."
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                lineNumber: 464,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                        lineNumber: 461,
                        columnNumber: 13
                    }, this),
                    dmHandles.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onOpenDmChange(h);
                                markDmRead(h);
                            },
                            className: "lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-[12.5px] font-extrabold",
                                            children: [
                                                "@",
                                                h
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                            lineNumber: 474,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                            children: dms[h]?.length ? dms[h][dms[h].length - 1].text : 'New paddy — talk first'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                            lineNumber: 475,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                    lineNumber: 473,
                                    columnNumber: 15
                                }, this),
                                !!unread[h] && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    "data-testid": `messages-unread-${h}`,
                                    className: "flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--lko-terra)] px-1.5 text-[10px] font-black text-white",
                                    children: unread[h]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                                    lineNumber: 480,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, h, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                            lineNumber: 468,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
                lineNumber: 459,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/messages-app.tsx",
        lineNumber: 385,
        columnNumber: 5
    }, this);
}
_s(MessagesApp, "dpQJWvf+TVkRNGBAvhTZYjp1zfo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"]
    ];
});
_c = MessagesApp;
const WHY_LABEL = {
    'guest-mic-dark': 'Claim your name first — the mic dey dark for guests.',
    'kid-text-refused': 'Kids talk with emotes only — pick one for the grid.',
    'word-wall': 'That word no dey pass the teen wall.',
    'no-links-ever': 'No links, no numbers, no wallet address — the wire no carry am.',
    'too-long': 'Too long — trim am down.',
    'empty': 'Empty message no dey fly.',
    'too-fast': 'Easy o — the wire dey cap speed. Wait small make e reset.',
    'wire-down': 'The wire drop — the relay lane don take over.',
    'wire-slow': 'The wire slow — try again small.',
    'bad-emote': 'That emote no dey the lexicon.',
    'no-such-paddy': 'Nobody claim that name yet.',
    'they-blocked-you': 'Dem block you — the door no open.',
    'you-blocked-them': 'You block dem — unblock first.',
    'paddies-only': 'Minors DM paddies only — na the law.',
    blocked: 'Dem block you — the mic dey dark.'
};
var _c;
__turbopack_context__.k.register(_c, "MessagesApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/calls-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CallsApp",
    ()=>CallsApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — M24-UI → W7: CALLS (the face of the voice wire)
 * ---------------------------------------------------------
 * The full call UI — dialing, ringing, the active screen (mute /
 * hangup / timer), the video face with its PiP frame, the ended
 * card that tells the truth about why — driven by the PURE callflow
 * machine through the social store, and WIRED by voicenet (W7): a
 * dial really rings a real online paddy, the answer really opens the
 * peer-to-peer voice.
 *
 * THE HONESTY LAWS:
 *  - NO FAKE ANSWER: nobody ever answers by themselves. An outgoing
 *    ring rings until the peer answers, YOU end it, or THE TIMEOUT
 *    LAW ends it. The demo ring stays behind the e2e/dev door,
 *    labeled demo, and never touches the microphone.
 *  - THE MINOR WALL: a minor never places and never receives a voice
 *    call — the UI hides the doors AND the server refuses anyway
 *    (fail-closed on both sides of the wire).
 *  - THE GUEST WALL: a guest's mic is dark (M17); the directory
 *    says so instead of pretending.
 *  - NO FAKE PEOPLE: the street NPCs have no phones yet — the rows
 *    say so instead of dialing a ghost.
 *  - THE END TRUTH: hangup / declined / missed / no-answer / busy /
 *    no-mic — the recents list never invents a why.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$callflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/callflow.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/device.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/social-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/voicenet.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
/** session recents (the ended-truth list) */ const recents = [];
function pushRecent(peer, why, video) {
    recents.unshift({
        peer,
        why,
        video,
        at: Date.now()
    });
    if (recents.length > 24) recents.pop();
}
function fmtSecs(n) {
    const m = Math.floor(n / 60);
    const s = n % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}
/** W8 — a live picture on a <video>. Muted on PURPOSE: the audio flies
 *  through the engine's remoteAudio element; a second unmuted element
 *  would double every voice. */ function VideoTile({ stream, testid, className }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VideoTile.useEffect": ()=>{
            if (ref.current && ref.current.srcObject !== stream) {
                ref.current.srcObject = stream;
                void ref.current.play().catch({
                    "VideoTile.useEffect": ()=>{}
                }["VideoTile.useEffect"]);
            }
        }
    }["VideoTile.useEffect"], [
        stream
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
        ref: ref,
        autoPlay: true,
        playsInline: true,
        muted: true,
        "data-testid": testid,
        className: className
    }, void 0, false, {
        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
        lineNumber: 69,
        columnNumber: 10
    }, this);
}
_s(VideoTile, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c = VideoTile;
function CallsApp() {
    _s1();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('people');
    const [target, setTarget] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "CallsApp.useGameStore[account]": (s)=>s.account
    }["CallsApp.useGameStore[account]"]);
    const wireRoster = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "CallsApp.useWireStore[wireRoster]": (s)=>s.roster
    }["CallsApp.useWireStore[wireRoster]"]);
    const wireState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "CallsApp.useWireStore[wireState]": (s)=>s.state
    }["CallsApp.useWireStore[wireState]"]);
    const isAdult = account.ageBand === 'adult';
    const isClaimed = !!account.handle;
    const canVoice = isClaimed && isAdult;
    const wireLive = wireState === 'live';
    const call = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[call]": (s)=>s.call
    }["CallsApp.useSocialStore[call]"]);
    const callDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[callDemo]": (s)=>s.callDemo
    }["CallsApp.useSocialStore[callDemo]"]);
    const cam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[cam]": (s)=>s.cam
    }["CallsApp.useSocialStore[cam]"]);
    const answerStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[answerStore]": (s)=>s.answer
    }["CallsApp.useSocialStore[answerStore]"]);
    const declineStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[declineStore]": (s)=>s.decline
    }["CallsApp.useSocialStore[declineStore]"]);
    const tickCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[tickCall]": (s)=>s.tickCall
    }["CallsApp.useSocialStore[tickCall]"]);
    const clearEnded = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[clearEnded]": (s)=>s.clearEnded
    }["CallsApp.useSocialStore[clearEnded]"]);
    const friends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[friends]": (s)=>s.friends
    }["CallsApp.useSocialStore[friends]"]);
    const blocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "CallsApp.useSocialStore[blocked]": (s)=>s.blocked
    }["CallsApp.useSocialStore[blocked]"]);
    // W8 — the heat honesty: a low device sleeps video by default
    const tier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$device$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceProfile"])().effective;
    const videoOkTier = tier !== 'low';
    // THE TIMEOUT LAW heartbeat: a 1s tick while a ring is alive
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallsApp.useEffect": ()=>{
            if (call.phase !== 'ringing' && call.phase !== 'dialing') return;
            const t = setInterval({
                "CallsApp.useEffect.t": ()=>tickCall(Date.now())
            }["CallsApp.useEffect.t"], 1000);
            return ({
                "CallsApp.useEffect": ()=>clearInterval(t)
            })["CallsApp.useEffect"];
        }
    }["CallsApp.useEffect"], [
        call.phase,
        tickCall
    ]);
    // THE WIRE LANE — the directory rides the LIVE roster (instant presence);
    // connect once, refresh presence, re-handshake on token rotation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallsApp.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireEnsure"])({
                "CallsApp.useEffect": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.token ?? null
            }["CallsApp.useEffect"], {
                "CallsApp.useEffect": ()=>({
                        street: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().world?.currentLocation ?? 'home',
                        status: 'hustling'
                    })
            }["CallsApp.useEffect"]);
            // THE ONE BOOT lives here too — the call face owns the voice engine
            // wherever it opens (the layer's world mount is the other door; both
            // are idempotent)
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceSetHandleProvider"])({
                "CallsApp.useEffect": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle ?? null
            }["CallsApp.useEffect"]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceInit"])();
        }
    }["CallsApp.useEffect"], [
        account.handle,
        account.token
    ]);
    // record ended truth into recents (once per ended call)
    const endedKey = call.phase === 'ended' ? `${call.peer}:${call.endedAt}` : null;
    const [lastEndedKey, setLastEndedKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallsApp.useEffect": ()=>{
            if (endedKey && endedKey !== lastEndedKey && call.peer && call.endedWhy) {
                pushRecent(call.peer, call.endedWhy, call.video);
                setLastEndedKey(endedKey);
            }
        }
    }["CallsApp.useEffect"], [
        endedKey,
        lastEndedKey,
        call.peer,
        call.endedWhy,
        call.video
    ]);
    /* ------------------------- the live call screens ------------------------- */ if (call.phase !== 'idle') {
        const secs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$callflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callSeconds"])(call, Date.now());
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col",
            "data-testid": `calls-screen-${call.phase}`,
            children: call.phase === 'ended' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex h-16 w-16 items-center justify-center rounded-full bg-black/[0.05] text-3xl",
                        "aria-hidden": true,
                        children: call.video ? '📹' : '📞'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 136,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-display text-[16px]",
                        children: "Call ended"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 137,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11.5px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            "@",
                            call.peer,
                            " · ",
                            call.endedWhy === 'hangup' ? 'you hang up' : call.endedWhy === 'declined' ? 'declined' : call.endedWhy === 'missed' ? 'you missed am' : call.endedWhy === 'busy' ? 'line busy' : call.endedWhy === 'no-mic' ? 'mic no gree — check permission' : 'no answer'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 138,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "calls-done",
                        onClick: ()=>{
                            clearEnded();
                            setTab('recents');
                        },
                        className: "lko-press mt-2 rounded-xl bg-[var(--lko-green)] px-6 py-2.5 text-[12.5px] font-extrabold text-white",
                        children: "Done"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 141,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                lineNumber: 135,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-1 flex-col items-center justify-center gap-3 py-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display text-[18px]",
                                children: [
                                    "@",
                                    call.peer
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 152,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[12px] font-extrabold tabular-nums text-[var(--lko-ink-soft)]",
                                "data-testid": "calls-status",
                                children: [
                                    call.phase === 'dialing' && 'Dey ring…',
                                    call.phase === 'ringing' && (call.outgoing ? 'Dey ring…' : 'Incoming call'),
                                    call.phase === 'active' && fmtSecs(secs)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 153,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]",
                                "data-testid": "calls-chip",
                                children: callDemo ? `${call.video ? 'video' : 'voice'} · demo ring — labeled, no mic` : call.video ? 'live video · peer-to-peer' : 'live voice · peer-to-peer'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 158,
                                columnNumber: 15
                            }, this),
                            call.phase === 'active' && call.video && (cam.remote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative mt-1 w-full overflow-hidden rounded-2xl bg-black shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]",
                                "data-testid": "calls-video-stage",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VideoTile, {
                                        stream: cam.remoteStream,
                                        testid: "calls-video-remote",
                                        className: "aspect-[4/3] w-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 164,
                                        columnNumber: 21
                                    }, this),
                                    cam.local && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-2 right-2 w-20 overflow-hidden rounded-lg border border-white/40 shadow-md sm:w-24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(VideoTile, {
                                            stream: cam.localStream,
                                            testid: "calls-video-pip",
                                            className: "aspect-[4/3] w-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                            lineNumber: 167,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 166,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 163,
                                columnNumber: 19
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-black/[0.06]",
                                "data-testid": "calls-video-dark",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-3xl",
                                        "aria-hidden": true,
                                        children: "📹"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 173,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                                        children: cam.local ? 'Their camera dark — audio only' : 'Your camera dark — audio only'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 174,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                        children: "The call dey live — the voice na the floor, the face na wish."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 177,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 172,
                                columnNumber: 19
                            }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 151,
                        columnNumber: 13
                    }, this),
                    call.phase === 'active' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center gap-3 pb-3",
                        "data-testid": "calls-active-controls",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: callDemo ? ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"].getState().toggleMute() : ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceToggleMute"])(),
                                "aria-pressed": call.muted,
                                "aria-label": call.muted ? 'Unmute' : 'Mute',
                                className: `lko-press flex h-13 w-13 items-center justify-center rounded-full p-3.5 text-xl ${call.muted ? 'bg-[var(--lko-ink)] text-white' : 'bg-black/[0.06]'}`,
                                children: call.muted ? '🔇' : '🎤'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 184,
                                columnNumber: 17
                            }, this),
                            call.video && !callDemo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "calls-cam-toggle",
                                onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceToggleCam"])(),
                                "aria-pressed": cam.local,
                                "aria-label": cam.local ? 'Camera off' : 'Camera on',
                                className: `lko-press flex h-13 w-13 items-center justify-center rounded-full p-3.5 text-xl ${cam.local ? 'bg-black/[0.06]' : 'bg-[var(--lko-ink)] text-white'}`,
                                children: cam.local ? '📹' : '🚫'
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 193,
                                columnNumber: 19
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "calls-hangup",
                                onClick: ()=>{
                                    if (callDemo) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"].getState().hangup();
                                    else void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceHangup"])();
                                },
                                "aria-label": "Hang up",
                                className: "lko-press flex h-16 w-16 items-center justify-center rounded-full bg-[#d64541] text-2xl text-white shadow-[0_8px_20px_-6px_rgba(214,69,65,0.6)]",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 203,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 183,
                        columnNumber: 15
                    }, this) : call.outgoing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center pb-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": "calls-cancel",
                            onClick: ()=>{
                                if (callDemo) declineStore();
                                else void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceDecline"])();
                            },
                            className: "lko-press flex h-14 w-14 items-center justify-center rounded-full bg-[#d64541] text-xl text-white",
                            "aria-label": "Cancel the call",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                            lineNumber: 214,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 213,
                        columnNumber: 15
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center gap-4 pb-3",
                        "data-testid": "calls-incoming-controls",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "calls-decline",
                                onClick: ()=>{
                                    if (callDemo) declineStore();
                                    else void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceDecline"])();
                                },
                                className: "lko-press flex h-14 w-14 items-center justify-center rounded-full bg-[#d64541] text-xl text-white",
                                "aria-label": "Decline the call",
                                children: "✕"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 225,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "calls-answer",
                                onClick: ()=>{
                                    if (callDemo) answerStore();
                                    else void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceAnswer"])();
                                },
                                className: "lko-press flex h-14 w-14 items-center justify-center rounded-full bg-[var(--lko-green)] text-xl text-white",
                                "aria-label": "Answer the call",
                                children: "✓"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 233,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 224,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true)
        }, void 0, false, {
            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
            lineNumber: 133,
            columnNumber: 7
        }, this);
    }
    /* ------------------------------ the directory ------------------------------ */ const online = wireRoster.map((r)=>r.handle).filter((h)=>h && h !== account.handle && !blocked.includes(h));
    const people = [
        ...new Set([
            ...friends,
            ...online
        ])
    ];
    const paddies = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPCS"].filter((n)=>!blocked.some((b)=>b === n.id)).slice(0, 8);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-1 rounded-xl bg-black/[0.05] p-1",
                children: [
                    [
                        'people',
                        '👥 People'
                    ],
                    [
                        'recents',
                        '🕘 Recents'
                    ]
                ].map(([k, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(k),
                        className: `lko-press rounded-lg px-2 py-1.5 text-[11.5px] font-extrabold ${tab === k ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`,
                        children: label
                    }, k, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 258,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                lineNumber: 256,
                columnNumber: 7
            }, this),
            tab === 'recents' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                "data-testid": "calls-recents",
                children: [
                    recents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "No call yet. The ended truth go show here — never a lie."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                        lineNumber: 268,
                        columnNumber: 13
                    }, this),
                    recents.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block text-[12px] font-extrabold",
                                        children: [
                                            "@",
                                            r.peer,
                                            " ",
                                            r.video ? '📹' : '📞'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 275,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                        children: [
                                            new Date(r.at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }),
                                            " · ",
                                            r.why
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 276,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 274,
                                columnNumber: 15
                            }, this)
                        }, `${r.at}-${i}`, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                lineNumber: 266,
                columnNumber: 9
            }, this),
            tab === 'people' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: target ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-black/[0.05] bg-white p-3",
                    "data-testid": "calls-target",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[13px] font-extrabold",
                                    children: [
                                        "@",
                                        target
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                    lineNumber: 290,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setTarget(null),
                                    className: "lko-press text-[11px] font-bold text-[var(--lko-ink-soft)]",
                                    "aria-label": "Pick somebody else",
                                    children: "change"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                    lineNumber: 291,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                            lineNumber: 289,
                            columnNumber: 15
                        }, this),
                        canVoice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 grid grid-cols-2 gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": "calls-dial-voice",
                                            onClick: ()=>{
                                                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceDial"])(target, false);
                                            },
                                            className: "lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[11.5px] font-extrabold text-white",
                                            children: "📞 Voice call"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                            lineNumber: 296,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": "calls-dial-video",
                                            onClick: ()=>{
                                                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceDial"])(target, true);
                                            },
                                            className: "lko-press rounded-xl bg-[var(--lko-ink)] py-2.5 text-[11.5px] font-extrabold text-white",
                                            children: "📹 Video call"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                            lineNumber: 303,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                    lineNumber: 295,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1.5 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                    children: wireLive ? videoOkTier ? 'The real wire dey ring — voice and face, peer-to-peer.' : 'This device dey rest small — video dey burn heat and data; the voice na the default.' : 'The wire rest small — reconnect go make the ring real.'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                    lineNumber: 311,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 rounded-xl bg-[var(--lko-gold-soft)] px-3 py-2 text-[10.5px] font-extrabold text-[var(--lko-gold-deep)]",
                            "data-testid": "calls-wall",
                            children: isClaimed ? 'Voice na adult table — minors no dey carry call (the M13 shield).' : 'Claim your phone first — the mic dey dark for guests (M17).'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                            lineNumber: 320,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                    lineNumber: 288,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        people.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                            children: "Real people"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                            lineNumber: 328,
                            columnNumber: 17
                        }, this),
                        people.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>canVoice && setTarget(h),
                                className: "lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[12.5px] font-extrabold",
                                        children: [
                                            "@",
                                            h
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 332,
                                        columnNumber: 19
                                    }, this),
                                    online.includes(h) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "rounded-full bg-[var(--lko-green-soft)] px-2 py-0.5 text-[9px] font-black text-[var(--lko-green-deep)]",
                                        children: "● online"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 333,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, h, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 331,
                                columnNumber: 17
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                            children: "Street paddies"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                            lineNumber: 336,
                            columnNumber: 15
                        }, this),
                        paddies.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white/60 px-3 py-2.5 opacity-70",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[12.5px] font-extrabold",
                                        children: n.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 339,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                        children: "no phone yet"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                        lineNumber: 340,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, n.id, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
                                lineNumber: 338,
                                columnNumber: 17
                            }, this))
                    ]
                }, void 0, true)
            }, void 0, false)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/calls-app.tsx",
        lineNumber: 255,
        columnNumber: 5
    }, this);
}
_s1(CallsApp, "05wlnyn4nvp3ySoYRNtzdjXsZFs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"]
    ];
});
_c1 = CallsApp;
var _c, _c1;
__turbopack_context__.k.register(_c, "VideoTile");
__turbopack_context__.k.register(_c1, "CallsApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/connect-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConnectApp",
    ()=>ConnectApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — M24 W5: CONNECT (the nation's social graph face)
 * ---------------------------------------------------------------
 * TWO TRUTHS, BOTH LABELED (the honesty law of the whole wave):
 *  - NATION PADDIES: the SERVER's FriendRow graph — requests, blocks and
 *    paddies are true on every device, delivered by the live wire ack
 *    (instant) or the 12s relay door (degraded lane, N10), plus the
 *    wire:social PUSH lane (a request lands on you the moment it's sent).
 *  - DEVICE PADDIES: the social-store's own rows — labeled "on this
 *    device", exactly what they always were. Nothing pretends.
 *
 * THE BLOCK LAW is server truth now: a blocked handle receives NOTHING
 * through the door — the wire refuses their DMs with the real why.
 * THE REPORT LAW: 🚩 files evidence into the union's queue (W12 console
 * reads it); nothing automatic happens to the reported handle.
 * THE KID WALL is server law: minors DM accepted paddies only.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/npcs.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/social-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/socialnet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialgraph$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/socialgraph.ts [app-client] (ecmascript)");
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
const REASON_LABEL = {
    'bad-handle': 'That name no fit the register shape.',
    self: 'Na you be that 😄',
    'no-such-paddy': 'Nobody claim that name yet.',
    already: '@ dem dey your paddies already.',
    'already-sent': 'Your request don dey wait — patience.',
    'they-blocked-you': 'Dem block you — the door no open.',
    'you-blocked-them': 'You block dem — unblock first.',
    'not-requested': 'No request dey wait there.',
    'not-friends': 'You no be paddies with dem.',
    'paddies-only': 'Minors waka with paddies only — na the law.',
    blocked: 'Dem block you.',
    unclaimed: 'Claim your name first.'
};
function ConnectApp({ onOpenDm }) {
    _s();
    const [tab, setTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('paddies');
    const [handle, setHandle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [reporting, setReporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ConnectApp.useGameStore[account]": (s)=>s.account
    }["ConnectApp.useGameStore[account]"]);
    const wire = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ConnectApp.useGameStore[wire]": (s)=>s.liveWire
    }["ConnectApp.useGameStore[wire]"]);
    // THE WIRE — live roster lane (W4) + the nation graph sync (W5)
    const wireState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "ConnectApp.useWireStore[wireState]": (s)=>s.state
    }["ConnectApp.useWireStore[wireState]"]);
    const wireRoster = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "ConnectApp.useWireStore[wireRoster]": (s)=>s.roster
    }["ConnectApp.useWireStore[wireRoster]"]);
    const wireLive = wireState === 'live';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConnectApp.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wireEnsure"])({
                "ConnectApp.useEffect": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.token ?? null
            }["ConnectApp.useEffect"], {
                "ConnectApp.useEffect": ()=>({
                        street: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().world?.currentLocation ?? 'home',
                        status: 'hustling'
                    })
            }["ConnectApp.useEffect"]);
        }
    }["ConnectApp.useEffect"], [
        account.linked,
        account.token
    ]);
    // W5: the nation graph — push listener registered once, graph synced on
    // open and whenever the lane flips (wire connect / token rotation)
    const netLane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"])({
        "ConnectApp.useSocialNetStore[netLane]": (s)=>s.lane
    }["ConnectApp.useSocialNetStore[netLane]"]);
    const netSyncedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"])({
        "ConnectApp.useSocialNetStore[netSyncedAt]": (s)=>s.syncedAt
    }["ConnectApp.useSocialNetStore[netSyncedAt]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ConnectApp.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetInit"])();
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetSync"])();
        }
    }["ConnectApp.useEffect"], [
        account.linked,
        account.token,
        wireState
    ]);
    const friends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[friends]": (s)=>s.friends
    }["ConnectApp.useSocialStore[friends]"]);
    const requests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[requests]": (s)=>s.requests
    }["ConnectApp.useSocialStore[requests]"]);
    const blocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[blocked]": (s)=>s.blocked
    }["ConnectApp.useSocialStore[blocked]"]);
    const addFriend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[addFriend]": (s)=>s.addFriend
    }["ConnectApp.useSocialStore[addFriend]"]);
    const acceptRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[acceptRequest]": (s)=>s.acceptRequest
    }["ConnectApp.useSocialStore[acceptRequest]"]);
    const declineRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[declineRequest]": (s)=>s.declineRequest
    }["ConnectApp.useSocialStore[declineRequest]"]);
    const removeFriend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[removeFriend]": (s)=>s.removeFriend
    }["ConnectApp.useSocialStore[removeFriend]"]);
    const blockHandle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[blockHandle]": (s)=>s.blockHandle
    }["ConnectApp.useSocialStore[blockHandle]"]);
    const unblockHandle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ConnectApp.useSocialStore[unblockHandle]": (s)=>s.unblockHandle
    }["ConnectApp.useSocialStore[unblockHandle]"]);
    const netFriends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"])({
        "ConnectApp.useSocialNetStore[netFriends]": (s)=>s.friends
    }["ConnectApp.useSocialNetStore[netFriends]"]);
    const netIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"])({
        "ConnectApp.useSocialNetStore[netIn]": (s)=>s.inReqs
    }["ConnectApp.useSocialNetStore[netIn]"]);
    const netOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"])({
        "ConnectApp.useSocialNetStore[netOut]": (s)=>s.outReqs
    }["ConnectApp.useSocialNetStore[netOut]"]);
    const netBlocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"])({
        "ConnectApp.useSocialNetStore[netBlocked]": (s)=>s.blocked
    }["ConnectApp.useSocialNetStore[netBlocked]"]);
    const me = account.handle;
    const rosterRows = wireLive ? wireRoster : wire?.roster ?? [];
    const onlineHandles = new Set(rosterRows.map((r)=>r.handle));
    const netFriendHandles = netFriends.map((f)=>f.handle);
    const online = rosterRows.map((r)=>r.handle).filter((h)=>h && h !== me && !blocked.includes(h) && !netFriendHandles.includes(h) && !friends.includes(h));
    const inReqs = requests.filter((r)=>r.dir === 'in');
    const outReqs = requests.filter((r)=>r.dir === 'out');
    const suggestions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$npcs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NPCS"].slice(0, 6).filter((n)=>!friends.includes(n.name) && !blocked.includes(n.name));
    const tryAdd = async (h)=>{
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetAdd"])(h);
        if (res.ok) {
            setNotice(res.state === 'friend' ? `@${h} na your paddy now 🤝 (nation truth)` : `Request fly reach @${h} — waiting for dem.`);
            setHandle('');
        } else {
            setNotice(`@${h}: ${REASON_LABEL[res.why ?? ''] ?? res.why ?? 'the door no gree.'}`);
        }
    };
    const laneLabel = !account.linked ? 'Claim your name — the nation graph dey wait.' : netLane === 'wire' ? '● Nation graph rides the LIVE WIRE — paddies, requests and blocks true everywhere.' : netLane === 'relay' ? 'Nation graph rides the ~12s relay lane (the wire dey down). Same rows, same laws.' : 'The nation graph never synced yet — open go retry.';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-1 rounded-xl bg-black/[0.05] p-1",
                children: [
                    [
                        'paddies',
                        `🤝 Paddies${netFriends.length || friends.length ? ` (${netFriends.length + friends.length})` : ''}`
                    ],
                    [
                        'requests',
                        `📥 Requests${netIn.length || inReqs.length ? ` (${netIn.length + inReqs.length})` : ''}`
                    ],
                    [
                        'find',
                        '🔍 Find'
                    ]
                ].map(([k, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setTab(k),
                        className: `lko-press rounded-lg px-1 py-1.5 text-[10.5px] font-extrabold ${tab === k ? 'bg-white text-[var(--lko-green-deep)] shadow-sm' : 'text-[var(--lko-ink-soft)]'}`,
                        children: label
                    }, k, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 127,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                "data-testid": "connect-lane",
                children: laneLabel
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            tab === 'paddies' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                "data-testid": "connect-paddies",
                children: [
                    netFriends.length === 0 && friends.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "No paddy yet — check Find. The city full of people."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 140,
                        columnNumber: 13
                    }, this),
                    netFriends.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: "Nation paddies (server truth)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 145,
                        columnNumber: 13
                    }, this),
                    netFriends.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl border border-[var(--lko-green)]/20 bg-white px-3 py-2.5",
                            "data-testid": `connect-net-paddy-${f.handle}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-[12.5px] font-extrabold",
                                            children: [
                                                "@",
                                                f.handle
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 150,
                                            columnNumber: 17
                                        }, this),
                                        onlineHandles.has(f.handle) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[9.5px] font-black text-[var(--lko-green-deep)]",
                                            children: "● online now"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 152,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                                            children: "offline"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 153,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex shrink-0 gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onOpenDm(f.handle),
                                            className: "lko-press rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                            "aria-label": `Message ${f.handle}`,
                                            children: "💬"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: async ()=>{
                                                const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetRemove"])(f.handle);
                                                setNotice(r.ok ? `@${f.handle} comot from nation paddies.` : REASON_LABEL[r.why ?? ''] ?? 'no gree');
                                            },
                                            className: "lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            "aria-label": `Remove ${f.handle}`,
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 157,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setReporting(reporting === f.handle ? null : f.handle),
                                            className: "lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            "aria-label": `Report ${f.handle}`,
                                            children: "🚩"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 158,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: async ()=>{
                                                const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetBlock"])(f.handle);
                                                setNotice(r.ok ? `@${f.handle} block — nation law: dem no fit reach you again.` : REASON_LABEL[r.why ?? ''] ?? 'no gree');
                                            },
                                            className: "lko-press rounded-full bg-[#fdecea] px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]",
                                            "aria-label": `Block ${f.handle}`,
                                            children: "🚫"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 159,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, f.handle, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                            lineNumber: 148,
                            columnNumber: 13
                        }, this)),
                    friends.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 pt-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: "On this device (street paddies)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 164,
                        columnNumber: 13
                    }, this),
                    friends.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white/70 px-3 py-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-[12.5px] font-extrabold",
                                            children: f
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 169,
                                            columnNumber: 17
                                        }, this),
                                        onlineHandles.has(f) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[9.5px] font-black text-[var(--lko-green-deep)]",
                                            children: "● online now"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 170,
                                            columnNumber: 42
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex shrink-0 gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>onOpenDm(f),
                                            className: "lko-press rounded-full bg-[var(--lko-green-soft)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                            "aria-label": `Message ${f}`,
                                            children: "💬"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                removeFriend(f);
                                                setNotice(`${f} comot from device paddies.`);
                                            },
                                            className: "lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            "aria-label": `Remove ${f}`,
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 174,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                blockHandle(f);
                                                setNotice(`${f} block on this device.`);
                                            },
                                            className: "lko-press rounded-full bg-[#fdecea] px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]",
                                            "aria-label": `Block ${f}`,
                                            children: "🚫"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 175,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, f, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this),
            tab === 'requests' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1.5",
                "data-testid": "connect-requests",
                children: [
                    netIn.length === 0 && netOut.length === 0 && inReqs.length === 0 && outReqs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "rounded-2xl bg-white/70 p-3 text-[11.5px] font-semibold text-[var(--lko-ink-soft)]",
                        children: "No request dey wait. When somebody wan be your paddy, e go land here — instantly."
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 185,
                        columnNumber: 13
                    }, this),
                    netIn.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: "Nation requests (server truth)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 189,
                        columnNumber: 32
                    }, this),
                    netIn.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl border border-[var(--lko-green)]/20 bg-white px-3 py-2.5",
                            "data-testid": `connect-net-in-${r.handle}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12.5px] font-extrabold",
                                    children: [
                                        "@",
                                        r.handle
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 192,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            "data-testid": `connect-accept-${r.handle}`,
                                            onClick: async ()=>{
                                                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetAccept"])(r.handle);
                                                setNotice(res.ok ? `@${r.handle} na your paddy now 🤝` : REASON_LABEL[res.why ?? ''] ?? 'no gree');
                                            },
                                            className: "lko-press rounded-full bg-[var(--lko-green)] px-3 py-1 text-[10px] font-extrabold text-white",
                                            children: "Accept"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 194,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: async ()=>{
                                                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetDecline"])(r.handle);
                                                setNotice(res.ok ? `@${r.handle} request comot.` : 'no gree');
                                            },
                                            className: "lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            children: "Nah"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 195,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, r.handle, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                            lineNumber: 191,
                            columnNumber: 13
                        }, this)),
                    netOut.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white/70 px-3 py-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12px] font-bold text-[var(--lko-ink-soft)]",
                                    children: [
                                        "@",
                                        r.handle
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 201,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] font-black uppercase text-[var(--lko-ink-soft)]",
                                    children: "waiting…"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 202,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, r.handle, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this)),
                    (inReqs.length > 0 || outReqs.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 pt-1 text-[9.5px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: "On this device"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 206,
                        columnNumber: 13
                    }, this),
                    inReqs.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12.5px] font-extrabold",
                                    children: r.handle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                acceptRequest(r.handle);
                                                setNotice(`${r.handle} na device paddy now.`);
                                            },
                                            className: "lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            children: "Accept"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 212,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>declineRequest(r.handle),
                                            className: "lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                            children: "Nah"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 213,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 211,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, r.handle, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                            lineNumber: 209,
                            columnNumber: 13
                        }, this)),
                    outReqs.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl bg-white/50 px-3 py-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12px] font-bold text-[var(--lko-ink-soft)]",
                                    children: r.handle
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] font-black uppercase text-[var(--lko-ink-soft)]",
                                    children: "waiting…"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, r.handle, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 183,
                columnNumber: 9
            }, this),
            tab === 'find' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                "data-testid": "connect-find",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                "data-testid": "connect-add-input",
                                value: handle,
                                onChange: (e)=>setHandle(e.target.value),
                                maxLength: 16,
                                placeholder: "Add by handle — e.g. ada_hustle",
                                className: "min-w-0 flex-1 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-testid": "connect-add-btn",
                                onClick: ()=>void tryAdd(handle),
                                className: "lko-press rounded-xl bg-[var(--lko-green)] px-4 py-2 text-[12px] font-extrabold text-white",
                                children: "Add"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this),
                    online.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                children: [
                                    "Online now (",
                                    wireLive ? 'live wire' : 'relay',
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                lineNumber: 242,
                                columnNumber: 15
                            }, this),
                            online.map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[12.5px] font-extrabold",
                                            children: [
                                                "@",
                                                h,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[9.5px] font-black text-[var(--lko-green-deep)]",
                                                    children: "● online"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 71
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 247,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>void tryAdd(h),
                                            className: "lko-press rounded-full bg-[var(--lko-green-soft)] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-green-deep)]",
                                            children: "+ Paddy"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 248,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, h, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 246,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: [
                            "Street suggestions ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold normal-case",
                                children: "(na NPC — device paddies)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                lineNumber: 254,
                                columnNumber: 129
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this),
                    suggestions.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12.5px] font-extrabold",
                                    children: n.name
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        const res = addFriend(n.name);
                                        setNotice(res.ok ? `${n.name} enter your device paddies.` : 'no gree');
                                    },
                                    className: "lko-press rounded-full bg-black/[0.05] px-3 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                    children: "+ Paddy"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 258,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, n.id, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                            lineNumber: 256,
                            columnNumber: 13
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 227,
                columnNumber: 9
            }, this),
            reporting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-[#f3c8c4] bg-[#fdf1f0] p-2.5",
                "data-testid": "connect-report",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-black uppercase tracking-wide text-[#a63d33]",
                        children: [
                            "🚩 Report @",
                            reporting,
                            " — evidence for the union"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex flex-wrap gap-1.5",
                        children: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialgraph$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REPORT_REASONS"].map((reason)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: async ()=>{
                                        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetReport"])(reporting, reason);
                                        setReporting(null);
                                        setNotice(r.ok ? `Report land — the union go review @${reporting}.` : 'no gree');
                                    },
                                    className: "lko-press rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]",
                                    children: reason
                                }, reason, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 269,
                                    columnNumber: 15
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setReporting(null),
                                className: "lko-press rounded-full bg-black/[0.05] px-2.5 py-1 text-[10px] font-extrabold text-[var(--lko-ink-soft)]",
                                children: "cancel"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                lineNumber: 275,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 265,
                columnNumber: 9
            }, this),
            (netBlocked.length > 0 || blocked.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-2xl border border-[#f3c8c4] bg-[#fdf1f0] p-2.5",
                "data-testid": "connect-blocked",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[10px] font-black uppercase tracking-wide text-[#a63d33]",
                        children: "🚫 Block wall — dem no fit reach you"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-1.5 flex flex-wrap gap-1.5",
                        children: [
                            netBlocked.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: async ()=>{
                                        const r = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["socialNetUnblock"])(b);
                                        setNotice(r.ok ? `@${b} unblocked — nation law.` : 'no gree');
                                    },
                                    className: "lko-press rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]",
                                    children: [
                                        "@",
                                        b,
                                        " ✕"
                                    ]
                                }, b, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 285,
                                    columnNumber: 15
                                }, this)),
                            blocked.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        unblockHandle(b);
                                        setNotice(`${b} unblocked on this device.`);
                                    },
                                    className: "lko-press rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-extrabold text-[#a63d33]",
                                    children: [
                                        b,
                                        " ✕ ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[8px] font-bold",
                                            children: "(device)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                            lineNumber: 291,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, b, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                                    lineNumber: 290,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                        lineNumber: 283,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-[10.5px] font-bold text-[var(--lko-green-deep)]",
                children: notice
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 298,
                columnNumber: 18
            }, this),
            !!netSyncedAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-[8.5px] font-bold text-[var(--lko-ink-soft)] opacity-70",
                children: [
                    "graph synced ",
                    new Date(netSyncedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
                lineNumber: 300,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/connect-app.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(ConnectApp, "8r3by04p49E3W5g58QlKIcdA4MM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"]
    ];
});
_c = ConnectApp;
var _c;
__turbopack_context__.k.register(_c, "ConnectApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/wallet-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletApp",
    ()=>WalletApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — M24 W6: WALLET (the nation purse's face)
 * -------------------------------------------------------
 * TWO balances, BOTH honest, both labeled:
 *  - POCKET — the save's money (player.cash): the honest engine's whole
 *    solo economy lives here. Device truth.
 *  - PURSE — the server's money (WalletRow): the only balance P2P
 *    transfers draw from, so every naira that moves person-to-person
 *    passes the server door. ₦500 moves exactly once (N8), a replayed
 *    send returns the SAME receipt, the PIN judges every spend, minors
 *    are structurally walled out.
 *
 * THE FLOWS: Top up (pocket→purse, debit-first + refund-on-refusal),
 * Send (purse→paddy, PIN step, receipt with the ledger id + hash),
 * Cash out (purse→pocket, server-first). The receipt list is SERVER
 * truth; the wire:ledger push updates a receiver live.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/socialnet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/walletnet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ledger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/ledger.ts [app-client] (ecmascript)");
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
const WHY_LABEL = {
    'minors-no-money': 'The nation purse na adults only — na the M13 law.',
    'minors-collect-nothing': 'Minors collect nothing — pick an adult paddy.',
    'bad-amount': 'Put a correct amount.',
    'too-small': 'Too small — the floor na ₦1.',
    'too-big': `Too big — one transfer no pass ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$ledger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEDGER_LIMITS"].MAX_PER_TRANSFER)}.`,
    'day-cap': 'You don pass today transfer cap. Tomorrow dey come.',
    insufficient: 'The purse no carry that amount — top up first.',
    self: 'Na you be that 😄',
    'bad-handle': 'That handle no correct.',
    'no-such-paddy': 'Nobody claim that name.',
    'bad-pin': 'Wrong PIN — the purse no open.',
    'bad-idem': 'The receipt key no correct — try again.',
    offline: 'The nation no reach — try again when network come.',
    unclaimed: 'Claim your name first.'
};
const QUICK = [
    500,
    1000,
    2000,
    5000
];
function WalletApp() {
    _s();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('home');
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('topup');
    const [to, setTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1000);
    const [custom, setCustom] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [pin, setPin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [receipt, setReceipt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WalletApp.useGameStore[player]": (s)=>s.player
    }["WalletApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WalletApp.useGameStore[world]": (s)=>s.world
    }["WalletApp.useGameStore[world]"]);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WalletApp.useGameStore[account]": (s)=>s.account
    }["WalletApp.useGameStore[account]"]);
    const wireState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "WalletApp.useWireStore[wireState]": (s)=>s.state
    }["WalletApp.useWireStore[wireState]"]);
    // THE WIRE + the purse mirror — sync on open and when the lane flips
    const purse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"])({
        "WalletApp.useWalletNetStore[purse]": (s)=>s.balance
    }["WalletApp.useWalletNetStore[purse]"]);
    const recent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"])({
        "WalletApp.useWalletNetStore[recent]": (s)=>s.recent
    }["WalletApp.useWalletNetStore[recent]"]);
    const walletLane = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"])({
        "WalletApp.useWalletNetStore[walletLane]": (s)=>s.lane
    }["WalletApp.useWalletNetStore[walletLane]"]);
    const syncedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"])({
        "WalletApp.useWalletNetStore[syncedAt]": (s)=>s.syncedAt
    }["WalletApp.useWalletNetStore[syncedAt]"]);
    const netFriends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"])({
        "WalletApp.useSocialNetStore[netFriends]": (s)=>s.friends
    }["WalletApp.useSocialNetStore[netFriends]"]);
    const wireLive = wireState === 'live';
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WalletApp.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetInit"])();
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetSync"])();
        }
    }["WalletApp.useEffect"], [
        account.linked,
        account.token,
        wireState
    ]);
    const cash = player?.cash ?? 0;
    const me = account.handle;
    const amt = Math.floor(Number(custom !== '' ? custom : amount));
    const openAmount = (m)=>{
        setMode(m);
        setStep('amount');
        setNotice(null);
        setCustom('');
        setPin('');
    };
    const proceedToPin = ()=>{
        if (mode === 'send' && !to) {
            setNotice('Pick who dey receive first.');
            return;
        }
        setStep('pin');
        setNotice(null);
    };
    const confirm = async ()=>{
        setBusy(true);
        try {
            if (mode === 'topup') {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetDeposit"])(amt);
                if (res.ok && res.receipt) {
                    setReceipt({
                        kind: 'deposit',
                        label: 'Purse top-up',
                        amount: amt,
                        ledgerId: res.receipt.ledgerId,
                        hash: res.receipt.hash,
                        balance: res.balance ?? null
                    });
                    setStep('done');
                } else setNotice(WHY_LABEL[res.why ?? ''] ?? 'The door no gree.');
            } else if (mode === 'cashout') {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetWithdraw"])(amt, pin);
                if (res.ok && res.receipt) {
                    setReceipt({
                        kind: 'withdraw',
                        label: 'Purse cash-out',
                        amount: amt,
                        ledgerId: res.receipt.ledgerId,
                        hash: res.receipt.hash,
                        balance: res.balance ?? null
                    });
                    setStep('done');
                } else setNotice(WHY_LABEL[res.why ?? ''] ?? 'The door no gree.');
            } else {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletNetTransfer"])(to, amt, pin, `transfer to ${to}`);
                if (res.ok && res.receipt) {
                    setReceipt({
                        kind: 'transfer',
                        label: `Sent to @${to}`,
                        amount: amt,
                        ledgerId: res.receipt.ledgerId,
                        hash: res.receipt.hash,
                        balance: res.balance ?? null
                    });
                    setStep('done');
                } else setNotice(WHY_LABEL[res.why ?? ''] ?? 'The door no gree.');
            }
        } finally{
            setBusy(false);
        }
    };
    /* ------------------------------- the receipt ------------------------------- */ if (step === 'done' && receipt) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-3",
            "data-testid": "wallet-receipt",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-3xl border border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)] p-5 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-[var(--lko-green)] text-2xl text-white",
                            "aria-hidden": true,
                            children: "✓"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lko-display mt-2 text-[16px]",
                            children: [
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(receipt.amount),
                                " ",
                                receipt.kind === 'deposit' ? 'don enter purse' : receipt.kind === 'withdraw' ? 'don return pocket' : 'don land'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[12px] font-bold text-[var(--lko-ink-soft)]",
                            children: receipt.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lko-num mt-2 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                            children: [
                                "ledger #",
                                receipt.ledgerId,
                                " · hash ",
                                receipt.hash.slice(0, 10),
                                "…",
                                receipt.balance !== null ? ` · purse ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(receipt.balance)}` : ''
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "rounded-2xl bg-white/70 px-3 py-2 text-[10.5px] font-bold text-[var(--lko-ink-soft)]",
                    children: "The fortress book don record am — idemKey law: even if the network replay am, the naira no go move twice."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "wallet-again",
                    onClick: ()=>{
                        setStep('home');
                        setReceipt(null);
                        setTo('');
                        setCustom('');
                        setPin('');
                    },
                    className: "lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[12.5px] font-extrabold text-white",
                    children: "Back to the purse"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
            lineNumber: 143,
            columnNumber: 7
        }, this);
    }
    /* --------------------------------- the PIN --------------------------------- */ if (step === 'pin') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-2.5",
            "data-testid": "wallet-pin",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setStep('amount'),
                    className: "lko-press self-start rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                    children: "← Amount"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-black/[0.05] bg-white p-3.5 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                            children: mode === 'send' ? `Send ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amt)} to @${to}` : mode === 'cashout' ? `Cash out ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amt)} to pocket` : `Top up ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amt)}`
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this),
                        mode !== 'topup' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                    children: "Your PIN — the purse no open without am"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                    lineNumber: 177,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    "data-testid": "wallet-pin-input",
                                    value: pin,
                                    onChange: (e)=>setPin(e.target.value.replace(/[^0-9]/g, '')),
                                    inputMode: "numeric",
                                    maxLength: 8,
                                    type: "password",
                                    placeholder: "••••",
                                    className: "lko-num mx-auto mt-1.5 block w-32 rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2 text-center text-[16px] font-extrabold tracking-[0.3em] outline-none focus:border-[var(--lko-green)]"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                    lineNumber: 178,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 171,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "wallet-confirm",
                    onClick: ()=>void confirm(),
                    disabled: busy || mode !== 'topup' && pin.length < 4,
                    className: "lko-press rounded-xl bg-[var(--lko-green)] py-3 text-[13px] font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] disabled:opacity-50",
                    children: busy ? 'The book dey write…' : 'Confirm'
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 191,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-1 text-center text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                    children: "The server judges the PIN, the fortress book records am — ₦ moves exactly once."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, this),
                notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-1 text-center text-[10.5px] font-bold text-[var(--lko-terra)]",
                    children: notice
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 202,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this);
    }
    /* -------------------------------- the amount -------------------------------- */ if (step === 'amount') {
        const sourceLabel = mode === 'topup' ? 'Pocket' : 'Purse';
        const sourceBalance = mode === 'topup' ? cash : purse;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-2.5",
            "data-testid": "wallet-amount",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setStep('home'),
                    className: "lko-press self-start rounded-full bg-black/[0.05] px-3 py-1 text-[11px] font-extrabold text-[var(--lko-ink-soft)]",
                    children: "← Purse"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 213,
                    columnNumber: 9
                }, this),
                mode === 'send' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "px-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                            children: "Who dey receive?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex max-h-[120px] flex-col gap-1 overflow-y-auto",
                            children: [
                                netFriends.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "rounded-xl bg-white/70 p-2 text-[10.5px] font-semibold text-[var(--lko-ink-soft)]",
                                    children: "No nation paddy yet — add dem for Connect. Transfers ride the nation graph."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                    lineNumber: 221,
                                    columnNumber: 17
                                }, this),
                                netFriends.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "data-testid": `wallet-to-${f.handle}`,
                                        onClick: ()=>setTo(f.handle),
                                        className: `lko-press flex items-center justify-between rounded-xl border px-3 py-2 text-left ${to === f.handle ? 'border-[var(--lko-green)] bg-[var(--lko-green-soft)]' : 'border-black/[0.05] bg-white'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[12px] font-extrabold",
                                                children: [
                                                    "@",
                                                    f.handle
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                                lineNumber: 228,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-black uppercase text-[var(--lko-ink-soft)]",
                                                children: to === f.handle ? 'picked' : 'paddy'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                                lineNumber: 229,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, f.handle, true, {
                                        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 217,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-black/[0.05] bg-white p-3.5 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                            children: [
                                sourceLabel,
                                " balance"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "lko-display text-[22px] text-[var(--lko-green-deep)]",
                            children: sourceBalance === null ? '—' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(sourceBalance)
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-4 gap-1.5",
                    children: QUICK.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": `wallet-quick-${q}`,
                            onClick: ()=>{
                                setAmount(q);
                                setCustom('');
                            },
                            className: `lko-press rounded-xl py-2 text-[11px] font-extrabold ${amount === q && custom === '' ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.05] text-[var(--lko-ink)]'}`,
                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(q)
                        }, q, false, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 243,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 241,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    "data-testid": "wallet-custom-amount",
                    value: custom,
                    onChange: (e)=>setCustom(e.target.value.replace(/[^0-9]/g, '')),
                    inputMode: "numeric",
                    placeholder: "Custom amount (₦)",
                    className: "w-full rounded-xl border border-[var(--lko-line)] bg-white px-3 py-2.5 text-center text-[14px] font-extrabold outline-none focus:border-[var(--lko-green)]"
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    "data-testid": "wallet-amount-next",
                    onClick: proceedToPin,
                    disabled: amt < 1 || mode === 'send' && !to || mode !== 'topup' && (purse === null || purse < amt),
                    className: "lko-press rounded-xl bg-[var(--lko-green)] py-3 text-[13px] font-extrabold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] disabled:opacity-50",
                    children: mode === 'topup' ? `Top up ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amt || 0)}` : mode === 'cashout' ? `Cash out ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amt || 0)}` : `Send ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(amt || 0)} to @${to || '…'}`
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 257,
                    columnNumber: 9
                }, this),
                mode !== 'topup' && purse !== null && purse < amt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-1 text-center text-[10px] font-bold text-[var(--lko-terra)]",
                    children: "Purse low — top up first."
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 266,
                    columnNumber: 11
                }, this),
                notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-1 text-center text-[10.5px] font-bold text-[var(--lko-terra)]",
                    children: notice
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                    lineNumber: 268,
                    columnNumber: 20
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
            lineNumber: 212,
            columnNumber: 7
        }, this);
    }
    /* --------------------------------- the home --------------------------------- */ const minor = account.ageBand === 'kid' || account.ageBand === 'teen';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2",
        "data-testid": "wallet-home",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.05] bg-white p-3 text-center",
                        "data-testid": "wallet-pocket",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[9px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                children: "Pocket (the save)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display text-[17px] text-[var(--lko-ink)]",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(cash)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-[var(--lko-green)]/25 bg-[var(--lko-green-soft)] p-3 text-center",
                        "data-testid": "wallet-purse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[9px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                children: "Purse (the nation)"
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                lineNumber: 283,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-display text-[17px] text-[var(--lko-green-deep)]",
                                children: purse === null ? '—' : (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(purse)
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                lineNumber: 284,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                "data-testid": "wallet-lane",
                children: !account.linked ? 'Claim your name — the purse dey wait.' : minor ? 'THE M13 LAW: the nation purse na adults only. Your pocket dey safe for the save.' : purse === null ? 'The purse never synced — open go retry.' : `${walletLane === 'wire' ? '● Purse rides the LIVE WIRE' : 'Purse rides the ~12s relay lane'} — the server wins at reconciliation.${syncedAt ? ` synced ${new Date(syncedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })}` : ''}`
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            !minor && account.linked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-1.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "wallet-topup",
                        onClick: ()=>openAmount('topup'),
                        className: "lko-press rounded-xl bg-[var(--lko-green)] py-2.5 text-[11px] font-extrabold text-white",
                        children: "⬆ Top up"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                        lineNumber: 299,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "wallet-send",
                        onClick: ()=>openAmount('send'),
                        className: "lko-press rounded-xl bg-[var(--lko-gold-soft)] py-2.5 text-[11px] font-extrabold text-[var(--lko-gold-deep)]",
                        children: "💸 Send"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "wallet-cashout",
                        onClick: ()=>openAmount('cashout'),
                        className: "lko-press rounded-xl bg-black/[0.05] py-2.5 text-[11px] font-extrabold text-[var(--lko-ink)]",
                        children: "⬇ Cash out"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                lineNumber: 298,
                columnNumber: 9
            }, this),
            recent.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "px-1 pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: "The book (server truth)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                        lineNumber: 307,
                        columnNumber: 11
                    }, this),
                    recent.slice(0, 6).map((r)=>{
                        const incoming = r.to === me;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between rounded-xl border border-black/[0.05] bg-white px-3 py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block truncate text-[11.5px] font-extrabold",
                                            children: r.kind === 'deposit' ? '⬆ Top up' : r.kind === 'withdraw' ? '⬇ Cash out' : incoming ? `⬇ from @${r.from}` : `⬆ to @${r.to}`
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                            lineNumber: 313,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "block text-[8.5px] font-bold text-[var(--lko-ink-soft)]",
                                            children: [
                                                "#",
                                                r.ledgerId,
                                                " · ",
                                                r.hash.slice(0, 8),
                                                "…"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                            lineNumber: 316,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                    lineNumber: 312,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-[12px] font-extrabold ${incoming ? 'text-[var(--lko-green-deep)]' : 'text-[var(--lko-terra)]'}`,
                                    children: [
                                        incoming ? '+' : '−',
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(r.amount)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                                    lineNumber: 318,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, r.idemKey, true, {
                            fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                            lineNumber: 311,
                            columnNumber: 15
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                lineNumber: 306,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-center text-[9px] font-bold text-[var(--lko-ink-soft)]",
                children: "In-game naira only, forever — real money transmission na CBN territory, we no touch am."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-center text-[10.5px] font-bold text-[var(--lko-terra)]",
                children: notice
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                lineNumber: 330,
                columnNumber: 18
            }, this),
            world && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-1 text-center text-[8.5px] font-bold text-[var(--lko-ink-soft)] opacity-70",
                children: [
                    "day ",
                    world.day
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
                lineNumber: 331,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/wallet-app.tsx",
        lineNumber: 276,
        columnNumber: 5
    }, this);
}
_s(WalletApp, "bOIbdnGBCOB61ldcohWmZWKSQuU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$walletnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWalletNetStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$socialnet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialNetStore"]
    ];
});
_c = WalletApp;
var _c;
__turbopack_context__.k.register(_c, "WalletApp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/phone/apps/profile-app.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProfileApp",
    ()=>ProfileApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — M24 W1: PROFILE (the face the street sees — SERVER truth)
 * ------------------------------------------------------------------------
 * The W1 wave this face was promised: display name, the look, the bio
 * now live in the caller's ProfileRow through PATCH /api/profile (the
 * SAME pure laws the register ran at the door — the sheet and this
 * editor cannot disagree). The look rides the REAL vocabularies from
 * data/avatar.ts — what you pick here is what the W2 bodies render.
 * Unclaimed guests keep the honest device chip: the street sees
 * claimed faces only.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/profile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/avatar.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/social-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const VIBES = [
    '🌊',
    '🔥',
    '⚽',
    '🎵',
    '📚',
    '💼',
    '🍜',
    '🛺'
];
function ProfileApp() {
    _s();
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileApp.useGameStore[account]": (s)=>s.account
    }["ProfileApp.useGameStore[account]"]);
    const player = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileApp.useGameStore[player]": (s)=>s.player
    }["ProfileApp.useGameStore[player]"]);
    const world = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileApp.useGameStore[world]": (s)=>s.world
    }["ProfileApp.useGameStore[world]"]);
    const updateProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "ProfileApp.useGameStore[updateProfile]": (s)=>s.updateProfile
    }["ProfileApp.useGameStore[updateProfile]"]);
    const profile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ProfileApp.useSocialStore[profile]": (s)=>s.profile
    }["ProfileApp.useSocialStore[profile]"]);
    const setProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ProfileApp.useSocialStore[setProfile]": (s)=>s.setProfile
    }["ProfileApp.useSocialStore[setProfile]"]);
    const friends = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "ProfileApp.useSocialStore[friends]": (s)=>s.friends
    }["ProfileApp.useSocialStore[friends]"]);
    const linked = account.linked;
    // the mirror: linked → the account's server truth; guest → device truth
    const serverName = account.displayName ?? '';
    const serverBio = account.bio ?? '';
    const serverLook = (()=>{
        const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateAvatarLook"])(account.avatarLook ?? '');
        return v.ok && v.look ? v.look : player?.avatar ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultLook"])();
    })();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(linked ? serverName : profile.displayName);
    const [bio, setBio] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(linked ? serverBio : profile.bio);
    const [look, setLook] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(serverLook);
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [why, setWhy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const nameWhy = name.length > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDisplayName"])(name).ok ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDisplayName"])(name).why : null;
    const bioWhy = bio.length > 0 && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBio"])(bio).ok ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateBio"])(bio).why : null;
    const save = async ()=>{
        setWhy(null);
        if (nameWhy || bioWhy) return;
        setBusy(true);
        try {
            if (linked) {
                const res = await updateProfile({
                    displayName: name.trim(),
                    bio: bio.trim(),
                    avatarLook: JSON.stringify(look)
                });
                if (!res.ok) setWhy(res.why ?? 'E no gree — try again.');
            } else {
                setProfile({
                    displayName: name.trim(),
                    bio: bio.trim()
                });
            }
            setSaved(true);
        } finally{
            setBusy(false);
        }
    };
    const shownName = linked ? serverName || player?.name || 'Street name dey come' : profile.displayName || player?.name || 'Street name dey come';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2.5",
        "data-testid": "profile-app",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "rounded-3xl border border-black/[0.05] bg-gradient-to-br from-[var(--lko-green-soft)] to-white p-4 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex mx-auto h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow",
                        "aria-hidden": true,
                        children: profile.vibe
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "lko-display mt-2 text-[16px]",
                        children: shownName
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[11px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            "@",
                            account.handle || 'unclaimed'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mt-1.5 inline-block rounded-full bg-[var(--lko-gold-soft)] px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-gold-deep)]",
                        children: [
                            account.ageBand || 'guest',
                            " band"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            linked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                "data-testid": "profile-scope",
                className: "rounded-xl bg-[var(--lko-green-soft)] px-3 py-2 text-[10px] font-bold text-[var(--lko-green-deep)]",
                children: "🌍 SERVER TRUTH — this face dey your ProfileRow on the register. Edit am here, the street go see am (W2 bodies go render am)."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                "data-testid": "profile-scope",
                className: "rounded-xl bg-[var(--lko-gold-soft)]/60 px-3 py-2 text-[10px] font-bold text-[var(--lko-gold-deep)]",
                children: "Device-truth: claim your name and this face go ride your ProfileRow — the street dey see claimed faces only."
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2 rounded-2xl border border-black/[0.05] bg-white p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        htmlFor: "profile-name",
                        children: "Display name"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "profile-name",
                        "data-testid": "profile-name",
                        value: name,
                        maxLength: 24,
                        onChange: (e)=>{
                            setName(e.target.value);
                            setSaved(false);
                        },
                        placeholder: "Wetin the street go call you",
                        className: "w-full rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] px-3 py-2 text-[13px] font-bold outline-none focus:border-[var(--lko-green)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        htmlFor: "profile-bio",
                        children: "Bio"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                        id: "profile-bio",
                        "data-testid": "profile-bio",
                        value: bio,
                        maxLength: 280,
                        rows: 2,
                        onChange: (e)=>{
                            setBio(e.target.value);
                            setSaved(false);
                        },
                        placeholder: "One line about your hustle…",
                        className: "w-full resize-none rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] px-3 py-2 text-[12.5px] font-semibold outline-none focus:border-[var(--lko-green)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-right text-[9px] font-bold text-[var(--lko-ink-soft)]",
                        children: [
                            bio.length,
                            "/280"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: "Your look (what the street sees)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1.5 rounded-xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-2",
                        "data-testid": "profile-look",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchRow, {
                                label: "Skin",
                                options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SKIN_TONES"],
                                active: look.skinTone,
                                onPick: (v)=>{
                                    setLook((l)=>({
                                            ...l,
                                            skinTone: v
                                        }));
                                    setSaved(false);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchRow, {
                                label: "Hair",
                                options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HAIR_COLORS"],
                                active: look.hairColor,
                                onPick: (v)=>{
                                    setLook((l)=>({
                                            ...l,
                                            hairColor: v
                                        }));
                                    setSaved(false);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChipRow, {
                                label: "Style",
                                options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVATAR_HAIRSTYLES"].map((h)=>({
                                        key: h.key,
                                        label: h.label
                                    })),
                                active: look.hairstyle,
                                onPick: (k)=>{
                                    setLook((l)=>({
                                            ...l,
                                            hairstyle: k
                                        }));
                                    setSaved(false);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChipRow, {
                                label: "Wear",
                                options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AVATAR_CLOTHING_STYLES"].map((c)=>({
                                        key: c.key,
                                        label: c.label
                                    })),
                                active: look.clothingStyle,
                                onPick: (k)=>{
                                    setLook((l)=>({
                                            ...l,
                                            clothingStyle: k
                                        }));
                                    setSaved(false);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 128,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SwatchRow, {
                                label: "Colour",
                                options: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$avatar$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CLOTHING_COLORS"],
                                active: look.clothingColor,
                                onPick: (v)=>{
                                    setLook((l)=>({
                                            ...l,
                                            clothingColor: v
                                        }));
                                    setSaved(false);
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "pt-1 text-[10px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                        children: "Your vibe"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-1.5",
                        children: VIBES.map((v)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setProfile({
                                        vibe: v
                                    });
                                    setSaved(false);
                                },
                                "aria-pressed": profile.vibe === v,
                                className: `lko-press flex h-9 w-9 items-center justify-center rounded-xl text-lg ${profile.vibe === v ? 'bg-[var(--lko-green)]' : 'bg-black/[0.05]'}`,
                                children: v
                            }, v, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    (nameWhy || bioWhy || why) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        "data-testid": "profile-why",
                        className: "rounded-lg bg-[#fdecea] px-2.5 py-1.5 text-[11px] font-bold text-[#8a2a20]",
                        children: nameWhy ?? bioWhy ?? why
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "profile-save",
                        disabled: busy || !!nameWhy || !!bioWhy,
                        onClick: ()=>void save(),
                        className: "lko-press mt-1 rounded-xl bg-[var(--lko-green)] py-2.5 text-[12.5px] font-extrabold text-white disabled:opacity-40",
                        children: busy ? 'Deh write the register…' : saved ? 'Saved ✓' : linked ? 'Save to the register' : 'Save the profile'
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-3 gap-2",
                children: [
                    {
                        k: 'Day',
                        v: String(world?.day ?? 1)
                    },
                    {
                        k: 'Pocket',
                        v: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(player?.cash ?? 0)
                    },
                    {
                        k: 'Paddies',
                        v: String(friends.length)
                    }
                ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl border border-black/[0.05] bg-white p-2.5 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[9px] font-black uppercase tracking-wide text-[var(--lko-ink-soft)]",
                                children: s.k
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lko-num text-[13px] font-extrabold",
                                children: s.v
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this)
                        ]
                    }, s.k, true, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
_s(ProfileApp, "Zk2yWBZ7FnHR4mNjMz8U6uWvyYM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"]
    ];
});
_c = ProfileApp;
function SwatchRow({ label, options, active, onPick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-10 shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1.5",
                children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        "aria-label": `${label}: ${o.label}`,
                        onClick: ()=>onPick(o.value),
                        className: `lko-press h-6 w-6 rounded-full border-2 ${active === o.value ? 'border-[var(--lko-green)] shadow-[0_0_0_2px_rgba(27,122,67,0.25)]' : 'border-black/10'}`,
                        style: {
                            backgroundColor: o.value
                        }
                    }, o.key, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_c1 = SwatchRow;
function ChipRow({ label, options, active, onPick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-10 shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lko-ink-soft)]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1",
                children: options.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onPick(o.key),
                        className: `lko-press rounded-full px-2 py-0.5 text-[9.5px] font-extrabold ${active === o.key ? 'bg-[var(--lko-green)] text-white' : 'bg-black/[0.06] text-[var(--lko-ink-soft)]'}`,
                        children: o.label
                    }, o.key, false, {
                        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
                lineNumber: 208,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/game/screens/phone/apps/profile-app.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
_c2 = ChipRow;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ProfileApp");
__turbopack_context__.k.register(_c1, "SwatchRow");
__turbopack_context__.k.register(_c2, "ChipRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_game_screens_phone_apps_1b5f0583._.js.map