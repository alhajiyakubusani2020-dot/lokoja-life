(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/src/components/game/screens/WorldPhoneLayer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldPhoneLayer",
    ()=>WorldPhoneLayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * LOKOJA LIFE — M24-UI: THE WORLD PHONE LAYER (the diegetic seam)
 * ----------------------------------------------------------------
 * THE WORLD NEVER BLINKS, wave one: while you stand inside the 3D
 * city, your phone lives HERE — a floating rail on the world's right
 * edge (needs chips + the phone FAB), the phone itself opening as an
 * overlay ABOVE the canvas. The world tab never unmounts; nothing
 * underneath is touched. This file renders NO 3D and imports NO 3D
 * module — it is pure DOM above the canvas.
 *
 * What lives here:
 *  - THE NEEDS RAIL: hunger 🍲 / energy ⚡ / mood 😊 as honest taps —
 *    hunger opens the food sheet (the REAL eatMeal door: market
 *    prices, night law, the ledger).
 *  - THE PHONE FAB: opens the full handset as an overlay; carries
 *    the DM unread dot.
 *  - THE CALL BANNER: an incoming ring covers the world (z-50) with
 *    accept/decline; an active call lives as a pill with its timer.
 *    A REAL wire ring says LIVE WIRE; the labeled demo says demo.
 *  - THE W7 WIRE: the real answer/decline/hangup doors route through
 *    voicenet (the media plane); the demo door stays pure — a demo
 *    never touches the microphone.
 *  - THE STREET WALKIE (W7): the proximity voice sync rides here — the
 *    voiceOn toggle, the band, the wire state and the call phase are
 *    its four inputs; pvSync is idempotent, so the effect just re-runs.
 *  - THE DEMO DOOR (e2e/dev only): `__lklSocial.incoming(peer, video)`
 *    fires a labeled demo ring so the UI is witnessable headless.
 *    No real player ever gets a fake caller.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/world/controls.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/data/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/progression.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$callflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/callflow.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/profile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/audio.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/useGameStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/menu-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/store/social-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/wire.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/systems/voicenet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$PhoneScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/PhoneScreen.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$MenuAuthSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/game/screens/MenuAuthSheet.tsx [app-client] (ecmascript)");
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
;
;
;
;
;
;
;
/** W8 — the face above the world. Muted on PURPOSE: the voice flies
 *  through the engine's remoteAudio; a second unmuted element doubles it. */ function WorldVideoTile({ stream, testid, className }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldVideoTile.useEffect": ()=>{
            if (ref.current && ref.current.srcObject !== stream) {
                ref.current.srcObject = stream;
                void ref.current.play().catch({
                    "WorldVideoTile.useEffect": ()=>{}
                }["WorldVideoTile.useEffect"]);
            }
        }
    }["WorldVideoTile.useEffect"], [
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
        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
        lineNumber: 59,
        columnNumber: 10
    }, this);
}
_s(WorldVideoTile, "8uVE59eA/r6b92xF80p7sH8rXLk=");
_c = WorldVideoTile;
function WorldPhoneLayer({ onOpenWork }) {
    _s1();
    const eatMeal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[eatMeal]": (s)=>s.eatMeal
    }["WorldPhoneLayer.useGameStore[eatMeal]"]);
    const hunger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[hunger]": (s)=>Math.round(s.player?.needs.hunger ?? 100)
    }["WorldPhoneLayer.useGameStore[hunger]"]);
    const energy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[energy]": (s)=>Math.round(s.player?.needs.energy ?? 100)
    }["WorldPhoneLayer.useGameStore[energy]"]);
    const mood = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[mood]": (s)=>Math.round(s.player?.needs.mood ?? 100)
    }["WorldPhoneLayer.useGameStore[mood]"]);
    const call = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[call]": (s)=>s.call
    }["WorldPhoneLayer.useSocialStore[call]"]);
    const callDemo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[callDemo]": (s)=>s.callDemo
    }["WorldPhoneLayer.useSocialStore[callDemo]"]);
    const cam = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[cam]": (s)=>s.cam
    }["WorldPhoneLayer.useSocialStore[cam]"]);
    const answer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[answer]": (s)=>s.answer
    }["WorldPhoneLayer.useSocialStore[answer]"]);
    const decline = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[decline]": (s)=>s.decline
    }["WorldPhoneLayer.useSocialStore[decline]"]);
    const hangupStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[hangupStore]": (s)=>s.hangup
    }["WorldPhoneLayer.useSocialStore[hangupStore]"]);
    const tickCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[tickCall]": (s)=>s.tickCall
    }["WorldPhoneLayer.useSocialStore[tickCall]"]);
    const incomingDemoCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[incomingDemoCall]": (s)=>s.incomingDemoCall
    }["WorldPhoneLayer.useSocialStore[incomingDemoCall]"]);
    const overlayOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[overlayOpen]": (s)=>s.overlayOpen
    }["WorldPhoneLayer.useSocialStore[overlayOpen]"]);
    const setOverlayOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[setOverlayOpen]": (s)=>s.setOverlayOpen
    }["WorldPhoneLayer.useSocialStore[setOverlayOpen]"]);
    const unread = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"])({
        "WorldPhoneLayer.useSocialStore[unread]": (s)=>s.unread
    }["WorldPhoneLayer.useSocialStore[unread]"]);
    const account = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[account]": (s)=>s.account
    }["WorldPhoneLayer.useGameStore[account]"]);
    const guestPreviewStartedAt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[guestPreviewStartedAt]": (s)=>s.guestPreviewStartedAt
    }["WorldPhoneLayer.useGameStore[guestPreviewStartedAt]"]);
    const markGuestPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[markGuestPreview]": (s)=>s.markGuestPreview
    }["WorldPhoneLayer.useGameStore[markGuestPreview]"]);
    const voiceOn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"])({
        "WorldPhoneLayer.useGameStore[voiceOn]": (s)=>!!s.live?.voiceOn
    }["WorldPhoneLayer.useGameStore[voiceOn]"]);
    const wireState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"])({
        "WorldPhoneLayer.useWireStore[wireState]": (s)=>s.state
    }["WorldPhoneLayer.useWireStore[wireState]"]);
    const [foodOpen, setFoodOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [now, setNow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(Date.now());
    const [claimOpen, setClaimOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // THE PHONE HOLDS THE WORLD STILL (hardening): the handset is a dialog —
    // WASD/E/C/V acted BEHIND the open overlay (the walker strolled off while
    // the player typed a DM; E silently entered a car). The overlay owns the
    // input freeze for as long as any of its faces is open.
    const worldUiOpen = overlayOpen || foodOpen || claimOpen;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freezeInput"])(worldUiOpen);
            return ({
                "WorldPhoneLayer.useEffect": ()=>{
                    if (worldUiOpen) (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$world$2f$controls$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["freezeInput"])(false);
                }
            })["WorldPhoneLayer.useEffect"];
        }
    }["WorldPhoneLayer.useEffect"], [
        worldUiOpen
    ]);
    // W3 — ONE PHONE: the dashboard's in-world faces (Home sheet's phone
    // button, deep-links) wake THIS handset with 'lko:phone-open'. The phone
    // never forks into a copy — the FAB and the event ring the same sheet.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            const open = {
                "WorldPhoneLayer.useEffect.open": ()=>setOverlayOpen(true)
            }["WorldPhoneLayer.useEffect.open"];
            window.addEventListener('lko:phone-open', open);
            return ({
                "WorldPhoneLayer.useEffect": ()=>window.removeEventListener('lko:phone-open', open)
            })["WorldPhoneLayer.useEffect"];
        }
    }["WorldPhoneLayer.useEffect"], []);
    // W1 — THE PREVIEW CLOCK: an unlinked walker's 60 seconds start at
    // world entry (the store guards: linked → no-op, twice → no-op).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            markGuestPreview();
        }
    }["WorldPhoneLayer.useEffect"], [
        markGuestPreview
    ]);
    // the preview heartbeat: one 1s tick while the clock runs unlinked
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            if (account.linked || !guestPreviewStartedAt) return;
            const t = setInterval({
                "WorldPhoneLayer.useEffect.t": ()=>setNow(Date.now())
            }["WorldPhoneLayer.useEffect.t"], 1000);
            return ({
                "WorldPhoneLayer.useEffect": ()=>clearInterval(t)
            })["WorldPhoneLayer.useEffect"];
        }
    }["WorldPhoneLayer.useEffect"], [
        account.linked,
        guestPreviewStartedAt
    ]);
    // the 1s heartbeats: the ring timeout law + the active call timer
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            if (call.phase !== 'ringing' && call.phase !== 'dialing' && call.phase !== 'active') return;
            const t = setInterval({
                "WorldPhoneLayer.useEffect.t": ()=>{
                    setNow(Date.now());
                    tickCall(Date.now());
                }
            }["WorldPhoneLayer.useEffect.t"], 1000);
            return ({
                "WorldPhoneLayer.useEffect": ()=>clearInterval(t)
            })["WorldPhoneLayer.useEffect"];
        }
    }["WorldPhoneLayer.useEffect"], [
        call.phase,
        tickCall
    ]);
    // THE W7 WIRE — one boot: the push lanes, the ended watcher, the debug
    // hook. Idempotent. The handle provider feeds the walkie's polite rule.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceSetHandleProvider"])({
                "WorldPhoneLayer.useEffect": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].getState().account.handle ?? null
            }["WorldPhoneLayer.useEffect"]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceInit"])();
        }
    }["WorldPhoneLayer.useEffect"], []);
    // THE STREET WALKIE SYNC — the inputs are the deps; pvSync is
    // idempotent (join once, leave once, no chatter in between).
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pvSync"])({
                voiceOn,
                adult: account.ageBand === 'adult',
                wireLive: wireState === 'live'
            });
        }
    }["WorldPhoneLayer.useEffect"], [
        voiceOn,
        account.ageBand,
        wireState,
        call.phase
    ]);
    // THE DEMO DOOR — e2e/dev only, honestly labeled in the banner itself.
    // It lives under its OWN namespace (`__lklSocial`) because the world's
    // e2e hook wholesale-assigns `__lkl` after its async mount — the two
    // never collide, and this file still imports zero 3D modules.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorldPhoneLayer.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const w = window;
            w.__lklSocial = {
                incoming: ({
                    "WorldPhoneLayer.useEffect": (peer, video)=>incomingDemoCall(peer, video)
                })["WorldPhoneLayer.useEffect"],
                // W1 — the witness door: jump the preview clock honestly (the LAW
                // itself is untouched — this only moves the started-at timestamp).
                previewLeft: ({
                    "WorldPhoneLayer.useEffect": (ms)=>{
                        const clamped = Math.max(0, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GUEST_PREVIEW_MS"], ms));
                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"].setState({
                            guestPreviewStartedAt: Date.now() - (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GUEST_PREVIEW_MS"] - clamped)
                        });
                    }
                })["WorldPhoneLayer.useEffect"]
            };
            return ({
                "WorldPhoneLayer.useEffect": ()=>{
                    delete w.__lklSocial;
                }
            })["WorldPhoneLayer.useEffect"];
        }
    }["WorldPhoneLayer.useEffect"], [
        incomingDemoCall
    ]);
    const unreadTotal = Object.values(unread).reduce((a, b)=>a + b, 0);
    const incoming = call.phase === 'ringing' && !call.outgoing;
    // W1 — the 60-second law, computed: the chip counts, the wall stands
    const preview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$profile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["previewState"])(guestPreviewStartedAt ?? 0, now);
    const previewLive = !account.linked && !!guestPreviewStartedAt && !preview.expired;
    const wallUp = !account.linked && !!guestPreviewStartedAt && preview.expired && !claimOpen;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            !overlayOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none fixed right-2.5 top-[52%] z-30 flex flex-col items-end gap-1.5",
                children: [
                    previewLive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "preview-chip",
                        onClick: ()=>setClaimOpen(true),
                        "aria-label": `Guest preview — ${Math.ceil(preview.remainingMs / 1000)} seconds left. Tap to claim your name now.`,
                        className: "lko-press pointer-events-auto flex items-center gap-1.5 rounded-full border border-[#ffd88a]/50 bg-[#1a1e18]/90 px-2.5 py-1.5 text-[11px] font-extrabold text-[#ffd88a] shadow-sm backdrop-blur-sm",
                        children: [
                            "⏳ ",
                            Math.ceil(preview.remainingMs / 1000),
                            "s — claim your name"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 178,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "hud-hunger",
                        onClick: ()=>{
                            setFoodOpen(true);
                        },
                        "aria-label": `Hunger ${hunger} percent — tap to eat`,
                        className: `lko-press pointer-events-auto flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-extrabold shadow-sm backdrop-blur-sm ${hunger < 35 ? 'border-[#f3c8c4] bg-[#fdecea] text-[#a63d33]' : 'border-black/[0.06] bg-white/90 text-[var(--lko-ink)]'}`,
                        children: [
                            "🍲 ",
                            hunger,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-extrabold shadow-sm backdrop-blur-sm ${energy < 30 ? 'border-[#f3c8c4] bg-[#fdecea] text-[#a63d33]' : 'border-black/[0.06] bg-white/90 text-[var(--lko-ink)]'}`,
                        children: [
                            "⚡ ",
                            energy,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 197,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/90 px-2.5 py-1.5 text-[11px] font-extrabold text-[var(--lko-ink)] shadow-sm backdrop-blur-sm",
                        children: [
                            "😊 ",
                            mood,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "data-testid": "world-phone-fab",
                        onClick: ()=>setOverlayOpen(true),
                        "aria-label": "Open your phone",
                        className: "lko-press pointer-events-auto mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a1e18] text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PhoneIcon"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this),
                            unreadTotal > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "data-testid": "world-phone-unread",
                                className: "absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#1a1e18] bg-[var(--lko-terra)] px-1 text-[9px] font-black",
                                children: unreadTotal
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                lineNumber: 215,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this),
            foodOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[46] flex items-end justify-center bg-black/35 backdrop-blur-[2px] sm:items-center",
                onClick: ()=>setFoodOpen(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-fade w-full max-w-sm rounded-t-3xl border border-[var(--lko-line)] bg-[var(--lko-cream)] p-4 shadow-2xl sm:rounded-3xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "lko-display text-[15px]",
                                    children: "Eat something 🍲"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setFoodOpen(false),
                                    "aria-label": "Close the food sheet",
                                    className: "lko-press flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.06] text-[var(--lko-ink-soft)]",
                                    children: "✕"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1.5",
                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$data$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FOOD"].meals.slice(0, 3).map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    "data-testid": `food-eat-${m.key}`,
                                    onClick: ()=>{
                                        const ok = eatMeal(m.key);
                                        if (ok) setFoodOpen(false);
                                    },
                                    className: "lko-press flex items-center justify-between rounded-2xl border border-black/[0.05] bg-white px-3 py-2.5 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block truncate text-[12.5px] font-extrabold",
                                                    children: m.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                                    children: [
                                                        "+",
                                                        m.hunger,
                                                        " food · +",
                                                        m.mood,
                                                        " mood"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                            lineNumber: 242,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "shrink-0 text-[11.5px] font-extrabold text-[var(--lko-gold-deep)]",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$progression$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatNaira"])(m.price)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                            lineNumber: 246,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, m.key, true, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 233,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 231,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-2 text-center text-[9.5px] font-bold text-[var(--lko-ink-soft)]",
                            children: "Real market prices at your spot — the night law go talk if e no be night yet."
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 250,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 225,
                columnNumber: 9
            }, this),
            incoming && call.peer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "call-banner",
                className: "fixed inset-x-3 top-3 z-50 sm:left-1/2 sm:right-auto sm:w-96 sm:-translate-x-1/2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lko-pop flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/95 px-4 py-3 shadow-[0_14px_36px_-12px_rgba(0,0,0,0.4)] backdrop-blur-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lko-ring-pulse flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--lko-green-soft)] text-xl",
                            "aria-hidden": true,
                            children: call.video ? '📹' : '📞'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 261,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block truncate text-[13px] font-extrabold",
                                    children: [
                                        "@",
                                        call.peer
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 265,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "block text-[10px] font-bold text-[var(--lko-ink-soft)]",
                                    children: callDemo ? `${call.video ? 'Video' : 'Voice'} call · demo ring — labeled, no mic` : `${call.video ? 'Video' : 'Voice'} call · LIVE WIRE — the real ring`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 266,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 264,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": "call-banner-decline",
                            onClick: ()=>{
                                if (callDemo) decline();
                                else void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceDecline"])();
                            },
                            "aria-label": "Decline the call",
                            className: "lko-press flex h-10 w-10 items-center justify-center rounded-full bg-[#d64541] text-white",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 270,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            "data-testid": "call-banner-answer",
                            onClick: ()=>{
                                if (callDemo) answer();
                                else void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceAnswer"])();
                            },
                            "aria-label": "Answer the call",
                            className: "lko-press flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lko-green)] text-white",
                            children: "✓"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 272,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                    lineNumber: 260,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 259,
                columnNumber: 9
            }, this),
            call.phase === 'active' && !overlayOpen && call.peer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "call-pill",
                className: "fixed bottom-[72px] left-3 z-30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 rounded-full bg-[#1a1e18]/95 px-3 py-2 text-white shadow-lg backdrop-blur-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lko-ring-pulse flex h-6 w-6 items-center justify-center rounded-full bg-[var(--lko-green)] text-[11px]",
                            "aria-hidden": true,
                            children: call.video ? '📹' : '📞'
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 282,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-[11px] font-extrabold",
                            children: [
                                "@",
                                call.peer
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 283,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "lko-num text-[11px] font-extrabold tabular-nums text-white/80",
                            children: fmt((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$callflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callSeconds"])(call, now))
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 284,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                if (callDemo) hangupStore();
                                else void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$voicenet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["voiceHangup"])();
                            },
                            "aria-label": "Hang up",
                            className: "lko-press flex h-7 w-7 items-center justify-center rounded-full bg-[#d64541] text-[11px]",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 285,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                    lineNumber: 281,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 280,
                columnNumber: 9
            }, this),
            call.phase === 'active' && call.video && cam.remote && !overlayOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "world-video-face",
                className: "fixed bottom-[124px] right-3 z-30 w-40 overflow-hidden rounded-2xl border border-white/30 bg-black shadow-[0_14px_36px_-12px_rgba(0,0,0,0.55)] sm:w-48",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WorldVideoTile, {
                        stream: cam.remoteStream,
                        testid: "world-video-remote",
                        className: "aspect-[3/4] w-full object-cover"
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 295,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between bg-[#1a1e18]/95 px-2 py-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[9.5px] font-extrabold text-white",
                                children: [
                                    "@",
                                    call.peer,
                                    " · live video"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                lineNumber: 297,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "lko-num text-[9.5px] font-extrabold tabular-nums text-white/80",
                                children: fmt((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$callflow$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callSeconds"])(call, now))
                            }, void 0, false, {
                                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                lineNumber: 298,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 296,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 294,
                columnNumber: 9
            }, this),
            wallUp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[47] flex items-end justify-center bg-black/55 backdrop-blur-[3px] sm:items-center",
                role: "dialog",
                "aria-modal": true,
                "aria-label": "Your guest preview has ended",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-testid": "register-wall",
                    className: "lko-fade w-full max-w-md rounded-t-3xl border border-white/15 bg-[#0e1512]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:rounded-3xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffd88a]/15 text-2xl",
                                    "aria-hidden": true,
                                    children: "⏳"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 311,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "lko-display text-xl leading-tight",
                                            children: "Your free look don finish"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                            lineNumber: 313,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-0.5 text-[11.5px] font-semibold text-white/60",
                                            children: "60 seconds preview done. Claim your name to keep walking — your hustle dey safe, nothing dey lost."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                            lineNumber: 314,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 310,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-[11.5px] font-semibold text-white/75",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": true,
                                            children: "🪪"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                            lineNumber: 320,
                                            columnNumber: 54
                                        }, this),
                                        " One name + one PIN — your save, your paddies and your pocket ride am."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 320,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": true,
                                            children: "😌"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                            lineNumber: 321,
                                            columnNumber: 54
                                        }, this),
                                        " Design your face — wetin the street go see (W2 bodies go render am)."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 321,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            "aria-hidden": true,
                                            children: "🛡️"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                            lineNumber: 322,
                                            columnNumber: 54
                                        }, this),
                                        " Minors dey behind the family shield — we collect nothing."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                                    lineNumber: 322,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 319,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-testid": "wall-claim",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                setClaimOpen(true);
                            },
                            className: "lko-press mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#ffd88a] text-[15px] font-extrabold tracking-wide text-[#123528] shadow-[0_10px_28px_-10px_rgba(255,216,138,0.5)]",
                            children: "Claim your name — keep your life 🪪"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 324,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            "data-testid": "wall-menu",
                            onClick: ()=>{
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$audio$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["audio"].play('click');
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$menu$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMenuStore"].getState().setScreen('menu');
                            },
                            className: "lko-press mt-2 flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] text-[12.5px] font-extrabold text-white/80",
                            children: "Back to the menu"
                        }, void 0, false, {
                            fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                            lineNumber: 332,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                    lineNumber: 309,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 308,
                columnNumber: 9
            }, this),
            claimOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$MenuAuthSheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MenuAuthSheet"], {
                inWorld: true,
                onClose: ()=>setClaimOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 345,
                columnNumber: 21
            }, this),
            overlayOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "world-phone-overlay",
                className: "fixed inset-0 z-[45] flex items-end justify-center bg-black/35 px-3 pb-[max(env(safe-area-inset-bottom),1rem)] pt-8 backdrop-blur-[2px] sm:items-center",
                onClick: ()=>setOverlayOpen(false),
                role: "dialog",
                "aria-modal": true,
                "aria-label": "Your phone",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-h-full",
                    onClick: (e)=>e.stopPropagation(),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$game$2f$screens$2f$PhoneScreen$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PhoneScreen"], {
                        variant: "overlay",
                        onOpenWork: onOpenWork
                    }, void 0, false, {
                        fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                        lineNumber: 358,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                    lineNumber: 357,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/game/screens/WorldPhoneLayer.tsx",
                lineNumber: 349,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s1(WorldPhoneLayer, "Zcn99h0rgMuCHzsdTsh+/lqPpSw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$social$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocialStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$store$2f$useGameStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGameStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$systems$2f$wire$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWireStore"]
    ];
});
_c1 = WorldPhoneLayer;
function fmt(n) {
    const m = Math.floor(n / 60);
    const s = n % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}
var _c, _c1;
__turbopack_context__.k.register(_c, "WorldVideoTile");
__turbopack_context__.k.register(_c1, "WorldPhoneLayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/world-chunk.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "preloadWorldChunk",
    ()=>preloadWorldChunk
]);
/**
 * SILK II — preload hook for the WORLD chunk (the same law as
 * dashboard-chunk.ts, one layer deeper): three.js + the OSM geo stack ride
 * their own chunk since the Dashboard no longer static-imports WorldTab.
 * The Dashboard calls this once mounted; the browser warms the geo gate
 * (the /world/geo-v1.bin fetch + decode) AND the 3D bundle in the first
 * idle window, so a player heading for the streets never waits — and a
 * map-first / phone-first session never downloads any of it at all.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2d$gate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/game/world3d/geo-gate.ts [app-client] (ecmascript)");
;
function preloadWorldChunk() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$game$2f$world3d$2f$geo$2d$gate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["warmWorldChunk"])();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/game/screens/Dashboard.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/game/screens/Dashboard.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_game_screens_1a895a5b._.js.map